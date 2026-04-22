/**
 * Combat state store using Zustand
 * Manages turn-based combat encounters
 */

import { create } from 'zustand';
import { useGameStore } from './useGameStore';
import type { Monster } from '../types/Monster';
import { createMonsterInstance } from '../types/Monster';
import type { DerivedStats } from '../types/Stats';
import {
  getRandomMonsterForFloor,
  getRandomPrefixForFloor,
  getRandomSuffixForFloor,
} from '../data/monsters';
import { generateRandomWeapon } from '../data/weapons/baseWeapons';
import {
  canDropWeapon,
  getWeaponCategoriesForMonster,
  getGoldModifier,
  getWeaponDropModifier,
} from '../data/loot/lootPools';
import type { MonsterCategory } from '../types/Loot';
import {
  getMagicStoneDrop,
  getMagicStoneQuantity,
  rollBonusMaterialDrop,
  type CraftingMaterial,
} from '../data/materials';
import type { Weapon } from '../types/Weapon';
import type { StatusEffect, StatusEffectType } from '../types/StatusEffect';
import type { ConsumableEffect } from '../types/Consumable';
import { getConsumableById } from '../data/consumables';
import type { LearnedSkill } from '../types/Skill';
import { calculateSkillDamage } from '../types/Skill';
import {
  getPlayerAttackNarration,
  getMonsterAttackNarration,
  getDefendNarration,
  getFleeNarration,
} from '../data/combat/combatNarration';
import {
  createStatusEffect,
  calculateStatusDamage,
  getAccuracyModifier,
  shouldSkipTurn,
  tickStatusEffects,
  applyStatusEffect,
  removeStatusEffectByType,
  hasStatusEffect,
  STATUS_EFFECT_ICONS,
} from '../types/StatusEffect';

export type ActionTag = 'STRIKE' | 'WARD' | 'READ' | 'SURGE';
export type CombatAction = 'attack' | 'defend' | 'flee' | 'skill' | 'item' | 'observe' | 'taunt'
  | 'quick_strike'  // Bonus slot: 50% power STRIKE attack
  | 'charge';       // Primary slot: +1 momentumStack, WARD tag
export type CombatPhase = 'player_plan' | 'resolve_queue' | 'victory' | 'defeat' | 'fled';

export interface StagedAction {
  action: CombatAction;
  label: string;
  data: Record<string, unknown>;
}

/** Ephemeral per-combat state for secondary stat interactions */
export interface CombatDynamicState {
  comboCount: number;           // Consecutive hits without taking damage (0–5)
  postDodgeCritActive: boolean; // Next attack guaranteed crit after a dodge (AGI)
  patternAccuracyBonus: number; // Accumulates each turn (PER+INT synergy, cap 45)
  momentumStacks: number;       // Stacks from defending turns for next attack (0–3, STR)
  moraleRemainingTurns: number; // Turns of morale bonus remaining after stun/taunt (CHA)
  divineShieldActive: boolean;  // Active divine magic absorption buffer (WIS, every 5 turns)
  playerShieldHP: number;        // Temporary HP shield from shield skills (absorbs damage before HP)
  lastActionTag: ActionTag | null; // Kairos: tag of last primary action
  sequenceBonus: number;           // Kairos: 0–3 stacks, varied action chain earns +3 flat dmg/stack
}
export type SneakPenalty = 'none' | 'minor_fail' | 'major_fail' | 'critical_fail';

export interface CombatLogEntry {
  id: string;
  message: string;
  type: 'player_action' | 'enemy_action' | 'damage' | 'heal' | 'status' | 'system' | 'miss';
  timestamp: number;
  resultText?: string;
  resultType?: CombatLogEntry['type'];
}

interface CombatState {
  // Combat status
  isInCombat: boolean;
  phase: CombatPhase;
  turn: number;

  // Combatants
  monster: Monster | null;

  // Player combat state
  playerDefending: boolean;
  playerFledAttempts: number;
  monsterObserved: boolean; // Has player used Observe?
  monsterTaunted: boolean; // Is monster taunted? (accuracy debuff)
  sneakPenalty: SneakPenalty; // Penalty from failed sneak attempt
  sneakPenaltyTurns: number; // Turns remaining for accuracy penalty

  // Secondary stat dynamic state (Phase F)
  combatDynamic: CombatDynamicState;

  // Kairos Protocol: two staged slots
  stagedPrimary: StagedAction | null;
  stagedBonus: StagedAction | null;
  bonusActionAvailable: boolean; // true when playerSpeed >= monsterSpeed * 0.8

  // Status effects
  playerEffects: StatusEffect[];
  monsterEffects: StatusEffect[];

  // Combat log
  log: CombatLogEntry[];

  // Rewards (set on victory)
  rewards: {
    gold: number;
    xp: number;
    items: string[];
    weaponDrop?: Weapon;
    materialDrops: Array<{ material: CraftingMaterial; quantity: number }>;
    fled?: boolean; // true when monster fled rather than was slain
  } | null;

  // Actions
  startCombat: (floorNumber: number, isBoss?: boolean) => void;
  prepareEncounter: (floorNumber: number, isBoss?: boolean, isElite?: boolean) => void;
  startCombatWithMonster: (monster: Monster) => void;
  endCombat: () => void;
  setSneakPenalty: (penalty: SneakPenalty) => void;

  // Kairos Protocol: two staged slots
  stagePrimary: (action: CombatAction, label: string, data?: Record<string, unknown>) => void;
  stageBonus: (action: CombatAction, label: string, data?: Record<string, unknown>) => void;
  cancelPrimary: () => void;
  cancelBonus: () => void;
  setBonusActionAvailable: (playerSpeed: number) => void;
  invokeKairos: (playerSpeed: number) => 'player_first' | 'enemy_first';

  // Player actions — Phase F: derived stats flow through from character store
  playerAttack: (
    derived: DerivedStats,
    currentHP: number,
    maxHP: number
  ) => { hit: boolean; damage: number; critical: boolean; doubleHit: boolean; doubleHitDamage: number };
  playerDefend: () => void;
  playerFlee: (playerSpeed: number) => boolean;
  playerObserve: () => { alreadyObserved: boolean; info: string };
  playerTaunt: (intimidatePower: number) => { success: boolean };
  // Kairos new actions
  playerQuickStrike: (
    derived: DerivedStats,
    currentHP: number,
    maxHP: number
  ) => { hit: boolean; damage: number };
  playerCharge: () => void;

  playerUseItem: (
    itemId: string,
    onHeal: (hp: number) => void,
    onHealSP: (sp: number) => void,
    onRemoveItem: (itemId: string) => void
  ) => { success: boolean; effect: ConsumableEffect | null };

  playerUseSkill: (
    skill: LearnedSkill,
    statValue: number,
    derived: DerivedStats,
    onHeal: (hp: number) => void,
    onSpendSP: (sp: number) => void,
    onApplyShield: (amount: number) => void
  ) => { success: boolean; damage: number; effects: string[] };

  // Enemy actions — Phase F: derived stats provide player defense/passive values
  enemyTurn: (
    derived: DerivedStats,
    currentHP: number,
    maxHP: number,
    onDamage: (damage: number) => void
  ) => { damage: number; hit: boolean; statusApplied?: StatusEffectType };

  // Per-turn passive effects (END regen, WIS regen, status clear, divine shield)
  processPassiveEffects: (
    derived: DerivedStats,
    turn: number,
    onHpRegen: (hp: number) => void,
    onSpRegen: (sp: number) => void,
    onStatusCleared: (effectName: string) => void
  ) => void;

  // Dynamic state mutators
  updateCombatDynamic: (updates: Partial<CombatDynamicState>) => void;

  // Phase management
  setPhase: (phase: CombatPhase) => void;
  nextTurn: () => void;

  // Damage handling
  damageMonster: (damage: number) => { killed: boolean; alreadyDead: boolean };

  // Log management
  addLogEntry: (message: string, type: CombatLogEntry['type'], resultText?: string, resultType?: CombatLogEntry['type']) => void;
  clearLog: () => void;

  // Rewards
  calculateRewards: () => void;

  // Status effect management
  applyPlayerEffect: (type: StatusEffectType, sourceId?: string) => void;
  applyMonsterEffect: (type: StatusEffectType, sourceId?: string) => void;
  removePlayerEffect: (type: StatusEffectType) => void;
  removeMonsterEffect: (type: StatusEffectType) => void;
  processPlayerEffects: (maxHP: number, onDamage: (dmg: number, effectType?: StatusEffectType) => void, onHeal: (heal: number) => void) => { skipped: boolean; reason?: string };
  processMonsterEffects: () => { skipped: boolean; reason?: string; damage: number };
}

const DEFAULT_COMBAT_DYNAMIC: CombatDynamicState = {
  comboCount: 0,
  postDodgeCritActive: false,
  patternAccuracyBonus: 0,
  momentumStacks: 0,
  moraleRemainingTurns: 0,
  divineShieldActive: false,
  playerShieldHP: 0,
  lastActionTag: null,
  sequenceBonus: 0,
};

export const useCombatStore = create<CombatState>((set, get) => ({
  isInCombat: false,
  phase: 'player_plan',
  turn: 1,
  monster: null,
  playerDefending: false,
  playerFledAttempts: 0,
  monsterObserved: false,
  monsterTaunted: false,
  sneakPenalty: 'none',
  sneakPenaltyTurns: 0,
  combatDynamic: { ...DEFAULT_COMBAT_DYNAMIC },
  stagedPrimary: null,
  stagedBonus: null,
  bonusActionAvailable: false,
  playerEffects: [],
  monsterEffects: [],
  log: [],
  rewards: null,

  startCombat: (floorNumber, isBoss = false) => {
    // Generate monster
    const baseMonster = getRandomMonsterForFloor(floorNumber);
    const prefix = isBoss ? getRandomPrefixForFloor(floorNumber + 10) : getRandomPrefixForFloor(floorNumber);
    const suffix = isBoss ? getRandomSuffixForFloor(floorNumber + 10) : getRandomSuffixForFloor(floorNumber);

    // Pass floor number for proper monster scaling
    const monster = createMonsterInstance(baseMonster, prefix, suffix, floorNumber);
    if (isBoss) {
      monster.isBoss = true;
      monster.maxHP = Math.floor(monster.maxHP * 1.5);
      monster.currentHP = monster.maxHP;
    }

    useGameStore.getState().recordMonsterEncounter(baseMonster.id);

    set({
      isInCombat: true,
      phase: 'player_plan',
      turn: 1,
      monster,
      playerDefending: false,
      playerFledAttempts: 0,
      monsterObserved: false,
      monsterTaunted: false,
      combatDynamic: { ...DEFAULT_COMBAT_DYNAMIC },
      stagedPrimary: null,
      stagedBonus: null,
      bonusActionAvailable: false,
      playerEffects: [],
      monsterEffects: [],
      log: [],
      rewards: null,
    });

    get().addLogEntry(`A ${monster.displayName} appears!`, 'system');
  },

  prepareEncounter: (floorNumber, isBoss = false, isElite = false) => {
    // Generate monster and store it, but don't start combat yet
    // Used by room screen before navigating to encounter screen
    const gameState = useGameStore.getState();
    const isFirstCombatEver = gameState.totalRuns === 0 && !gameState.hasHadFirstCombat;

    // Force normal encounter on first ever combat — prevents instant-death elite/boss
    const effectiveBoss = isFirstCombatEver ? false : isBoss;
    const effectiveElite = isFirstCombatEver ? false : isElite;

    const baseMonster = getRandomMonsterForFloor(floorNumber);
    const prefix = (effectiveBoss || effectiveElite)
      ? getRandomPrefixForFloor(floorNumber + (effectiveBoss ? 10 : 5))
      : getRandomPrefixForFloor(floorNumber);
    const suffix = (effectiveBoss || effectiveElite)
      ? getRandomSuffixForFloor(floorNumber + (effectiveBoss ? 10 : 5))
      : getRandomSuffixForFloor(floorNumber);

    const monster = createMonsterInstance(baseMonster, prefix, suffix, floorNumber);

    if (effectiveBoss) {
      monster.isBoss = true;
      monster.maxHP = Math.floor(monster.maxHP * 1.5);
      monster.currentHP = monster.maxHP;
    } else if (effectiveElite) {
      // Elite monsters get a smaller HP boost
      monster.maxHP = Math.floor(monster.maxHP * 1.25);
      monster.currentHP = monster.maxHP;
    }


    // Just store the monster, don't start combat
    set({
      monster,
      isInCombat: false, // Not in combat yet
    });
  },

  startCombatWithMonster: (existingMonster) => {
    // Start combat with a pre-generated monster (from encounter screen)
    set({
      isInCombat: true,
      phase: 'player_plan',
      turn: 1,
      monster: existingMonster,
      playerDefending: false,
      playerFledAttempts: 0,
      monsterObserved: false,
      monsterTaunted: false,
      sneakPenalty: 'none',
      sneakPenaltyTurns: 0,
      combatDynamic: { ...DEFAULT_COMBAT_DYNAMIC },
      stagedPrimary: null,
      stagedBonus: null,
      bonusActionAvailable: false,
      playerEffects: [],
      monsterEffects: [],
      log: [],
      rewards: null,
    });

    get().addLogEntry(`You engage ${existingMonster.displayName}!`, 'system');
  },

  endCombat: () => {
    set({
      isInCombat: false,
      phase: 'player_plan',
      turn: 1,
      monster: null,
      playerDefending: false,
      playerFledAttempts: 0,
      monsterObserved: false,
      monsterTaunted: false,
      sneakPenalty: 'none',
      sneakPenaltyTurns: 0,
      combatDynamic: { ...DEFAULT_COMBAT_DYNAMIC },
      stagedPrimary: null,
      stagedBonus: null,
      bonusActionAvailable: false,
      playerEffects: [],
      monsterEffects: [],
      rewards: null,
    });
  },

  // Kairos Protocol: stage primary action
  stagePrimary: (action, label, data = {}) => {
    const { phase } = get();
    if (phase !== 'player_plan') return;
    set({ stagedPrimary: { action, label, data } });
  },

  // Kairos Protocol: stage bonus action
  stageBonus: (action, label, data = {}) => {
    const { phase } = get();
    if (phase !== 'player_plan') return;
    set({ stagedBonus: { action, label, data } });
  },

  cancelPrimary: () => {
    set({ stagedPrimary: null, stagedBonus: null }); // Cancelling primary also clears bonus
  },

  cancelBonus: () => {
    set({ stagedBonus: null });
  },

  // Compute and store whether bonus action is available this turn
  setBonusActionAvailable: (playerSpeed) => {
    const { monster } = get();
    const monsterSpeed = monster?.speed ?? 0;
    const gameState = useGameStore.getState();
    const isFirstEver = gameState.totalRuns === 0 && !gameState.hasHadFirstCombat;
    if (isFirstEver) {
      gameState.setHasHadFirstCombat();
    }
    set({ bonusActionAvailable: isFirstEver || playerSpeed >= monsterSpeed * 0.8 });
  },

  // Kairos Protocol: roll initiative, clear both slots, return turn order
  invokeKairos: (playerSpeed) => {
    const state = get();
    if (!state.stagedPrimary || state.phase !== 'player_plan') return 'player_first';

    const playerInit = playerSpeed + Math.floor(Math.random() * 21);
    const enemyInit = (state.monster?.initiative ?? 5) + Math.floor(Math.random() * 21);
    const order: 'player_first' | 'enemy_first' = playerInit >= enemyInit ? 'player_first' : 'enemy_first';

    set({ phase: 'resolve_queue', stagedPrimary: null, stagedBonus: null });
    return order;
  },

  updateCombatDynamic: (updates) => {
    set((state) => ({
      combatDynamic: { ...state.combatDynamic, ...updates },
    }));
  },

  setSneakPenalty: (penalty) => {
    // Set sneak penalty - accuracy debuff lasts 2 turns for major_fail
    const turns = penalty === 'major_fail' ? 2 : 0;
    set({
      sneakPenalty: penalty,
      sneakPenaltyTurns: turns,
    });

    // Log the penalty
    if (penalty === 'minor_fail') {
      get().addLogEntry('You were spotted! The enemy strikes first!', 'system');
    } else if (penalty === 'major_fail') {
      get().addLogEntry('You were caught! Your accuracy is reduced!', 'system');
    } else if (penalty === 'critical_fail') {
      get().addLogEntry('AMBUSH! The enemy attacks before you can react!', 'system');
    }
  },

  playerAttack: (derived, currentHP, maxHP) => {
    const { monster, playerEffects, sneakPenaltyTurns, combatDynamic } = get();
    if (!monster) return { hit: false, damage: 0, critical: false, doubleHit: false, doubleHitDamage: 0 };

    // ── 1. Accuracy ──
    let accuracyMod = getAccuracyModifier(playerEffects);
    if (sneakPenaltyTurns > 0) accuracyMod -= 20;
    const effectiveAccuracy = Math.min(95, Math.max(5,
      derived.accuracy + combatDynamic.patternAccuracyBonus + accuracyMod
    ));

    const hitRoll = Math.random() * 100;
    const hit = hitRoll <= effectiveAccuracy;

    if (!hit) {
      const narration = getPlayerAttackNarration(false, false, false, monster.displayName);
      const blindedText = hasStatusEffect(playerEffects, 'blind') ? ' (blinded)' : '';
      get().addLogEntry(`${narration}${blindedText}`, 'miss');
      // Reset combo on miss
      get().updateCombatDynamic({ comboCount: 0 });
      return { hit: false, damage: 0, critical: false, doubleHit: false, doubleHitDamage: 0 };
    }

    // ── 2. Crit check ──
    let isCrit = Math.random() * 100 < derived.critChance;
    // AGI: post-dodge guaranteed crit
    if (combatDynamic.postDodgeCritActive) isCrit = true;
    const critMult = isCrit ? derived.critMultiplier : 1.0;

    // ── 3. Damage modifiers from status effects ──
    let damageMultiplier = 1.0;
    if (hasStatusEffect(playerEffects, 'weaken')) damageMultiplier *= 0.75;

    // ── 4. Enemy defense — reduced by armorPierce (STR) ──
    const effectiveEnemyDef = Math.max(0, monster.defense - derived.armorPierce);
    const defenseReduction = effectiveEnemyDef / (effectiveEnemyDef + 100);

    // ── 5. Base damage from DerivedStats (soft-capped physicalAttack) ──
    let rawDamage = Math.max(1, derived.physicalAttack * (1 - defenseReduction));

    // ── 6. Situational bonuses ──
    const hpFraction = maxHP > 0 ? currentHP / maxHP : 1;
    if (hpFraction >= 0.5) rawDamage += derived.cleaveDamage; // STR cleave when healthy
    rawDamage += derived.comboRamp * combatDynamic.comboCount; // AGI combo chain
    rawDamage += derived.moraleBonus * (combatDynamic.moraleRemainingTurns > 0 ? 1 : 0); // CHA morale
    // STR momentum from defending turns
    rawDamage += derived.physicalAttack * 0.002 * combatDynamic.momentumStacks;

    // ── 7. INT exploit weakness — multiplier per active debuff on monster ──
    const activeDebuffs = get().monsterEffects.length;
    if (activeDebuffs > 0) {
      rawDamage *= Math.pow(derived.exploitWeaknessMultiplier, Math.min(activeDebuffs, 5));
    }

    // ── 8. Variance + crit + status modifiers + FLOW multiplier ──
    const varianceFactor = 0.85 + Math.random() * 0.30;
    // Kairos FLOW: +20% per stack (×1=+20%, ×2=+40%, ×3=+60%) — felt as real burst window
    const flowMultiplier = 1 + combatDynamic.sequenceBonus * 0.20;
    let damage = Math.floor(rawDamage * varianceFactor * critMult * damageMultiplier * flowMultiplier);

    // ── 9. LCK fortune strike ──
    if (Math.random() * 100 < derived.fortuneStrikeChance) {
      const fortuneBonus = Math.floor(derived.fortuneStrikeDamage * (0.85 + Math.random() * 0.30));
      damage += fortuneBonus;
      get().addLogEntry(`✨ Fortune strikes! (+${fortuneBonus})`, 'system');
    }

    // ── 10. Apply damage ──
    const { killed, alreadyDead } = get().damageMonster(damage);

    const narration = getPlayerAttackNarration(true, isCrit, killed && !alreadyDead, monster.displayName);
    get().addLogEntry(narration, 'player_action', ` (${damage} dmg)`, 'damage');

    if (killed && !alreadyDead) {
      set({ phase: 'victory' });
      get().calculateRewards();
    }

    // ── 11. Post-hit procs ──
    if (!killed) {
      // STR knockback: stun chance
      if (Math.random() * 100 < derived.knockbackChance) {
        get().applyMonsterEffect('stun', 'knockback');
        get().addLogEntry(`💥 Knocked back! ${monster.displayName} is stunned!`, 'status');
      }
      // CHA unnerve: weaken chance
      if (Math.random() * 100 < derived.unnerveChance) {
        get().applyMonsterEffect('weaken', 'unnerve');
        get().addLogEntry(`😰 ${monster.displayName} is unnerved! Attack reduced.`, 'status');
      }
    }

    // ── 12. Update dynamic state ──
    const newCombo = Math.min(5, combatDynamic.comboCount + 1);
    const newMorale = Math.max(0, combatDynamic.moraleRemainingTurns - 1);
    // Kairos sequence bonus: varied primary action tags earn flow stacks
    const newSequenceBonus = combatDynamic.lastActionTag !== null && 'STRIKE' !== combatDynamic.lastActionTag
      ? Math.min(3, combatDynamic.sequenceBonus + 1)
      : 0;
    if (newSequenceBonus > combatDynamic.sequenceBonus && newSequenceBonus > 0) {
      const flowPct = newSequenceBonus * 20;
      get().addLogEntry(`🌊 FLOW ×${newSequenceBonus} — +${flowPct}% damage until chain breaks!`, 'system');
    }
    get().updateCombatDynamic({
      comboCount: newCombo,
      postDodgeCritActive: false,
      momentumStacks: 0,
      moraleRemainingTurns: newMorale,
      lastActionTag: 'STRIKE',
      sequenceBonus: newSequenceBonus,
    });

    // ── 13. AGI double action check ──
    const doubleHit = !killed && Math.random() * 100 < derived.doubleActionChance;
    let doubleHitDamage = 0;
    if (doubleHit) {
      // Second hit at 70% power — simplified: direct 70% raw damage pass
      const d2Raw = Math.max(1, derived.physicalAttack * 0.7 * (1 - defenseReduction));
      const d2Variance = 0.85 + Math.random() * 0.30;
      const d2Dmg = Math.floor(d2Raw * d2Variance);
      doubleHitDamage = d2Dmg;
      const d2Result = get().damageMonster(d2Dmg);
      get().addLogEntry('⚡ Double strike!', 'player_action', ` (${d2Dmg} dmg)`, 'damage');
      if (d2Result.killed && !d2Result.alreadyDead) {
        set({ phase: 'victory' });
        get().calculateRewards();
      }
    }

    return { hit: true, damage, critical: isCrit, doubleHit, doubleHitDamage };
  },

  // Kairos: Quick Strike — Bonus slot, 50% power STRIKE attack
  playerQuickStrike: (derived, _currentHP, _maxHP) => {
    const { monster, playerEffects, combatDynamic } = get();
    if (!monster) return { hit: false, damage: 0 };

    const accuracyMod = getAccuracyModifier(playerEffects);
    const effectiveAccuracy = Math.min(95, Math.max(5, derived.accuracy + combatDynamic.patternAccuracyBonus + accuracyMod));
    const hit = Math.random() * 100 <= effectiveAccuracy;

    if (!hit) {
      get().addLogEntry('Quick strike missed!', 'miss');
      return { hit: false, damage: 0 };
    }

    const effectiveEnemyDef = Math.max(0, monster.defense - derived.armorPierce);
    const defenseReduction = effectiveEnemyDef / (effectiveEnemyDef + 100);
    const rawDamage = Math.max(1, derived.physicalAttack * 0.5 * (1 - defenseReduction));
    const varianceFactor = 0.85 + Math.random() * 0.30;
    const damage = Math.floor(rawDamage * varianceFactor);

    const { killed, alreadyDead } = get().damageMonster(damage);
    get().addLogEntry('⚡ Quick strike!', 'player_action', ` (${damage} dmg)`, 'damage');

    if (killed && !alreadyDead) {
      set({ phase: 'victory' });
      get().calculateRewards();
      get().addLogEntry(`The ${monster.displayName} is defeated!`, 'system');
    }

    // Quick strike contributes to combo count
    const newCombo = Math.min(5, combatDynamic.comboCount + 1);
    get().updateCombatDynamic({ comboCount: newCombo });

    return { hit: true, damage };
  },

  // Kairos: Charge — Primary slot, WARD tag, builds momentumStack
  playerCharge: () => {
    const { combatDynamic } = get();
    const newMomentum = Math.min(3, combatDynamic.momentumStacks + 1);

    // Sequence bonus: WARD tag differs from most prior actions
    const newSequenceBonus = combatDynamic.lastActionTag !== null && 'WARD' !== combatDynamic.lastActionTag
      ? Math.min(3, combatDynamic.sequenceBonus + 1)
      : 0;
    if (newSequenceBonus > combatDynamic.sequenceBonus && newSequenceBonus > 0) {
      const flowPct = newSequenceBonus * 20;
      get().addLogEntry(`🌊 FLOW ×${newSequenceBonus} — +${flowPct}% damage until chain breaks!`, 'system');
    }

    get().updateCombatDynamic({
      momentumStacks: newMomentum,
      lastActionTag: 'WARD',
      sequenceBonus: newSequenceBonus,
    });
    get().addLogEntry(`You gather your strength... (Forge ×${newMomentum})`, 'player_action');
  },

  playerDefend: () => {
    const { monster } = get();
    set({ playerDefending: true });
    const narration = getDefendNarration(monster?.displayName || 'enemy');
    get().addLogEntry(narration, 'player_action');
  },

  playerFlee: (playerSpeed) => {
    const { monster, playerFledAttempts } = get();
    if (!monster) return false;

    // Calculate flee chance based on speed difference
    const speedDiff = playerSpeed - monster.speed;
    const baseChance = 50 + speedDiff * 2 - playerFledAttempts * 10;
    const fleeChance = Math.max(10, Math.min(90, baseChance));

    const roll = Math.random() * 100;
    const success = roll <= fleeChance;

    const narration = getFleeNarration(success, monster.displayName);

    if (success) {
      set({ phase: 'fled' });
      get().addLogEntry(narration, 'system');
      return true;
    } else {
      set({ playerFledAttempts: playerFledAttempts + 1 });
      get().addLogEntry(narration, 'player_action');
      return false;
    }
  },

  playerObserve: () => {
    const { monster, monsterObserved } = get();
    if (!monster) return { alreadyObserved: true, info: '' };

    if (monsterObserved) {
      get().addLogEntry('You already know this enemy\'s patterns.', 'player_action');
      return { alreadyObserved: true, info: '' };
    }

    set({ monsterObserved: true });
    useGameStore.getState().addMonsterObservation(monster.base.id);

    // Generate info about the monster
    const weaknessText = monster.base.weaknesses.length > 0
      ? `Weak to: ${monster.base.weaknesses.join(', ')}`
      : 'No obvious weaknesses';
    const resistText = monster.base.resistances.length > 0
      ? `Resists: ${monster.base.resistances.join(', ')}`
      : '';
    const behaviorText = `Behavior: ${monster.base.behaviorPattern}`;

    const info = `${weaknessText}. ${resistText} ${behaviorText}`.trim();

    get().addLogEntry(`You study the ${monster.displayName}...`, 'player_action');
    get().addLogEntry(info, 'system');

    get().updateCombatDynamic({ lastActionTag: 'READ' });
    return { alreadyObserved: false, info };
  },

  playerTaunt: (intimidatePower) => {
    const { monster, combatDynamic } = get();
    if (!monster) return { success: false };

    const roll = Math.random() * 100;
    const success = roll <= intimidatePower;

    if (success) {
      set({ monsterTaunted: true });
      get().addLogEntry(`You taunt the ${monster.displayName}, disrupting its focus!`, 'player_action');
      get().addLogEntry('Enemy accuracy reduced by 20%!', 'system');
      // CHA morale: 2 turns of bonus damage after successful taunt
      get().updateCombatDynamic({ moraleRemainingTurns: combatDynamic.moraleRemainingTurns + 2 });
    } else {
      get().addLogEntry(`The ${monster.displayName} ignores your taunt.`, 'player_action');
    }
    get().updateCombatDynamic({ lastActionTag: 'READ' });
    return { success };
  },

  playerUseItem: (itemId, onHeal, onHealSP, onRemoveItem) => {
    const { monster } = get();
    const consumable = getConsumableById(itemId);

    if (!consumable) {
      get().addLogEntry('Item not found!', 'system');
      return { success: false, effect: null };
    }

    if (!consumable.usableInCombat) {
      get().addLogEntry(`${consumable.name} cannot be used in combat!`, 'system');
      return { success: false, effect: null };
    }

    const effect = consumable.effect;

    switch (effect.type) {
      case 'heal_hp':
        onHeal(effect.value);
        get().addLogEntry(`You use ${consumable.name} and restore ${effect.value} HP!`, 'heal');
        break;

      case 'heal_sp':
        onHealSP(effect.value);
        get().addLogEntry(`You use ${consumable.name} and restore ${effect.value} SP!`, 'heal');
        break;

      case 'heal_percent_hp':
        // Percentage healing handled by caller
        get().addLogEntry(`You use ${consumable.name} and restore ${effect.value}% HP!`, 'heal');
        break;

      case 'heal_percent_sp':
        get().addLogEntry(`You use ${consumable.name} and restore ${effect.value}% SP!`, 'heal');
        break;

      case 'cure_poison':
        get().removePlayerEffect('poison');
        get().addLogEntry(`You use ${consumable.name} and cure poison!`, 'heal');
        break;

      case 'cure_bleed':
        get().removePlayerEffect('bleed');
        get().addLogEntry(`You use ${consumable.name} and stop bleeding!`, 'heal');
        break;

      case 'cure_all':
        // Remove all negative effects
        const debuffs: StatusEffectType[] = ['poison', 'bleed', 'burn', 'freeze', 'stun', 'blind', 'weaken', 'curse'];
        for (const debuff of debuffs) {
          get().removePlayerEffect(debuff);
        }
        get().addLogEntry(`You use ${consumable.name} and cure all ailments!`, 'heal');
        break;

      case 'damage':
        if (monster) {
          get().addLogEntry(`You throw ${consumable.name}!`, 'player_action');
          const { killed, alreadyDead } = get().damageMonster(effect.value);
          get().addLogEntry(`The ${monster.displayName} takes ${effect.value} damage!`, 'damage');
          if (killed && !alreadyDead) {
            set({ phase: 'victory' });
            get().calculateRewards();
            get().addLogEntry(`The ${monster.displayName} is defeated!`, 'system');
          }
        }
        break;

      case 'flee':
        set({ phase: 'fled' });
        get().addLogEntry(`You use ${consumable.name} and escape from battle!`, 'system');
        break;

      case 'buff':
        if (effect.buffEffect) {
          // Apply as status effect
          get().addLogEntry(
            `You use ${consumable.name}! +${effect.buffEffect.value} ${effect.buffEffect.stat || effect.buffEffect.name} for ${effect.duration} turns!`,
            'status'
          );
        }
        break;

      default:
        get().addLogEntry(`You use ${consumable.name}.`, 'player_action');
    }

    // Remove item from inventory
    onRemoveItem(itemId);

    return { success: true, effect };
  },

  playerUseSkill: (skill, statValue, derived, onHeal, onSpendSP, onApplyShield) => {
    const { monster, playerEffects } = get();
    const results: string[] = [];
    let totalDamage = 0;

    // INT: reduce SP cost
    const effectiveSpCost = Math.max(1, Math.round(skill.spCost * (1 - derived.spCostReduction)));
    onSpendSP(effectiveSpCost);
    const spCostText = effectiveSpCost < skill.spCost
      ? `-${effectiveSpCost} SP (INT reduced from ${skill.spCost})`
      : `-${effectiveSpCost} SP`;
    get().addLogEntry(`You use ${skill.name}! (${spCostText})`, 'player_action');

    // Process each effect
    for (const effect of skill.effects) {
      switch (effect.type) {
        case 'damage':
        case 'damage_multi': {
          if (!monster) break;

          const hits = effect.hits || 1;
          let effectDamage = 0;

          for (let i = 0; i < hits; i++) {
            // Apply accuracy modifiers from status effects
            const accuracyMod = getAccuracyModifier(playerEffects);
            const hitRoll = Math.random() * 100;
            // Use derived.accuracy (PER-based) instead of hardcoded 85% so PER investment applies to skills
            const baseAccuracy = Math.min(95, derived.accuracy + accuracyMod);

            if (hitRoll > baseAccuracy) {
              get().addLogEntry(`${skill.name} missed!`, 'miss');
              continue;
            }

            // Calculate damage with variance; INT skillAmplify scales up damage
            const baseDmg = calculateSkillDamage(skill, effect, statValue, monster.defense);
            const amplifiedDmg = baseDmg * derived.skillAmplify;

            // Check for crit (higher chance for LCK scaling skills)
            // Magic crit multiplier (WIS + INT) applies to skills
            const critChance = skill.scalingStat === 'LCK' ? 30 : derived.critChance;
            const isCrit = Math.random() * 100 < critChance;
            const skillVariance = 0.85 + Math.random() * 0.30; // 85–115% variance
            const finalDamage = Math.floor(
              (isCrit ? amplifiedDmg * derived.magicCritMultiplier : amplifiedDmg) * skillVariance
            );

            effectDamage += finalDamage;

            const critText = isCrit ? ' CRITICAL!' : '';
            const hitText = hits > 1 ? ` (hit ${i + 1})` : '';
            get().addLogEntry(
              `${skill.name} deals ${finalDamage} ${effect.damageType || 'physical'} damage!${critText}${hitText}`,
              'damage'
            );

            // Apply status effect if applicable
            if (effect.statusEffect && effect.statusChance) {
              const statusRoll = Math.random() * 100;
              if (statusRoll < effect.statusChance) {
                get().applyMonsterEffect(effect.statusEffect, skill.id);
              }
            }
          }

          totalDamage += effectDamage;

          // Apply damage
          if (effectDamage > 0) {
            const { killed, alreadyDead } = get().damageMonster(effectDamage);
            if (killed && !alreadyDead) {
              set({ phase: 'victory' });
              get().calculateRewards();
              get().addLogEntry(`The ${monster.displayName} is defeated!`, 'system');
            }
          }
          break;
        }

        case 'heal':
        case 'heal_percent': {
          // WIS healAmplify scales up all healing; INT skillAmplify also applies
          const rawHeal = effect.value + Math.floor(statValue * effect.scaling);
          const healAmount = Math.floor(rawHeal * derived.healAmplify * derived.skillAmplify);
          onHeal(healAmount);
          get().addLogEntry(`You recover ${healAmount} HP!`, 'heal');
          results.push(`Healed ${healAmount} HP`);
          break;
        }

        case 'shield': {
          const shieldAmount = effect.value + Math.floor(statValue * effect.scaling);
          onApplyShield(shieldAmount);
          get().addLogEntry(`You gain a ${shieldAmount} HP shield!`, 'status');
          results.push(`Shield: ${shieldAmount}`);
          break;
        }

        case 'cleanse': {
          // Remove all negative effects
          const debuffs: StatusEffectType[] = ['poison', 'bleed', 'burn', 'freeze', 'stun', 'blind', 'weaken', 'curse'];
          for (const debuff of debuffs) {
            if (hasStatusEffect(playerEffects, debuff)) {
              get().removePlayerEffect(debuff);
            }
          }
          get().addLogEntry('All negative effects cleansed!', 'heal');
          results.push('Cleansed');
          break;
        }

        case 'debuff': {
          if (!monster) break;
          if (effect.statusEffect && effect.statusChance) {
            const roll = Math.random() * 100;
            if (roll < effect.statusChance) {
              get().applyMonsterEffect(effect.statusEffect, skill.id);
              results.push(`Applied ${effect.statusEffect}`);
            }
          }
          break;
        }

        case 'drain': {
          if (!monster) break;
          const damage = calculateSkillDamage(skill, effect, statValue, monster.defense);
          const healAmount = Math.floor(damage * 0.5);

          const { killed, alreadyDead } = get().damageMonster(damage);
          onHeal(healAmount);

          get().addLogEntry(`${skill.name} drains ${damage} damage and heals ${healAmount} HP!`, 'damage');
          totalDamage += damage;
          results.push(`Drained ${damage}/${healAmount}`);

          if (killed && !alreadyDead) {
            set({ phase: 'victory' });
            get().calculateRewards();
            get().addLogEntry(`The ${monster.displayName} is defeated!`, 'system');
          }
          break;
        }
      }
    }

    // Kairos: tag based on first effect type
    const { combatDynamic } = get();
    const firstEffectType = skill.effects[0]?.type ?? 'damage';
    const actionTag: ActionTag =
      firstEffectType === 'damage' ? 'STRIKE' :
      firstEffectType === 'damage_multi' ? 'STRIKE' :
      firstEffectType === 'heal' ? 'WARD' :
      firstEffectType === 'heal_percent' ? 'WARD' :
      firstEffectType === 'shield' ? 'WARD' :
      firstEffectType === 'buff' ? 'READ' :
      firstEffectType === 'debuff' ? 'READ' :
      firstEffectType === 'drain' ? 'SURGE' :
      firstEffectType === 'cleanse' ? 'WARD' :
      'SURGE';
    const newSequenceBonus = combatDynamic.lastActionTag !== null && actionTag !== combatDynamic.lastActionTag
      ? Math.min(3, combatDynamic.sequenceBonus + 1)
      : 0;
    if (newSequenceBonus > combatDynamic.sequenceBonus && newSequenceBonus > 0) {
      const flowPct = newSequenceBonus * 20;
      get().addLogEntry(`🌊 FLOW ×${newSequenceBonus} — +${flowPct}% damage!`, 'system');
    }
    get().updateCombatDynamic({ lastActionTag: actionTag, sequenceBonus: newSequenceBonus });

    return { success: true, damage: totalDamage, effects: results };
  },

  enemyTurn: (derived, currentHP, maxHP, onDamage) => {
    const { monster, playerDefending, monsterTaunted, monsterEffects, combatDynamic } = get();
    if (!monster) return { damage: 0, hit: false };

    // Check if monster is stunned or frozen
    const skipResult = shouldSkipTurn(monsterEffects);
    if (skipResult.skip) {
      get().addLogEntry(`The ${monster.displayName} is ${skipResult.reason?.toLowerCase()}! It cannot act.`, 'enemy_action');
      return { damage: 0, hit: false };
    }

    // ── Behavior: COWARDLY — attempt to flee at low HP (before any attack) ──
    const monsterHpFraction = monster.currentHP / monster.maxHP;
    if (
      monster.base.behaviorPattern === 'cowardly' &&
      monsterHpFraction < (monster.base.fleeThreshold ?? 0.3) &&
      monster.base.canFlee !== false
    ) {
      if (Math.random() < 0.4) {
        get().addLogEntry(`${monster.displayName} fled from battle!`, 'enemy_action');
        const hpLost = monster.maxHP - monster.currentHP;
        const damageFraction = Math.max(0, Math.min(1, hpLost / monster.maxHP));
        const partialXp = Math.floor((monster.base.xpValue ?? 20) * damageFraction * 0.6);
        set({
          phase: 'victory',
          rewards: {
            gold: Math.max(1, Math.floor((monster.base.goldDrop?.min ?? 5) * 0.5)),
            xp: partialXp,
            items: [],
            weaponDrop: undefined,
            materialDrops: [],
            fled: true,
          },
        });
        return { damage: 0, hit: false };
      } else {
        get().addLogEntry(`${monster.displayName} tries to flee but fails!`, 'enemy_action');
        return { damage: 0, hit: false };
      }
    }

    // ── Behavior: REGENERATOR — heal every 3rd turn before attacking ──
    if (monster.base.behaviorPattern === 'regenerator' && get().turn % 3 === 0) {
      const regenAmount = Math.floor(monster.maxHP * 0.08);
      const newHP = Math.min(monster.maxHP, monster.currentHP + regenAmount);
      set({ monster: { ...monster, currentHP: newHP } });
      get().addLogEntry(`${monster.displayName} regenerates ${regenAmount} HP!`, 'enemy_action');
    }

    // ── Behavior modifiers: effective attack and accuracy bonus ──
    let effectiveAttack = monster.attack;
    let accuracyBonus = 0;

    // BERSERKER — enrage at low HP
    if (monster.base.behaviorPattern === 'berserker' && monsterHpFraction < 0.5) {
      effectiveAttack = Math.floor(monster.attack * 1.5);
      accuracyBonus += 15;
      get().addLogEntry(`${monster.displayName} is ENRAGED! (+50% damage)`, 'enemy_action');
    }

    // AMBUSHER — guaranteed burst on turn 1
    if (monster.base.behaviorPattern === 'ambusher' && get().turn === 1) {
      effectiveAttack = Math.floor(monster.attack * 1.5);
      accuracyBonus += 20;
      get().addLogEntry(`${monster.displayName} strikes from the shadows! (Ambush!)`, 'enemy_action');
    }

    // ── 1. Player dodge check first (AGI) ──
    if (Math.random() * 100 < derived.dodgeChance) {
      const missNarration = getMonsterAttackNarration(false, false, false, monster.displayName);
      get().addLogEntry(`${missNarration} — Dodged!`, 'miss');
      // AGI post-dodge crit on next attack
      get().updateCombatDynamic({ postDodgeCritActive: true });
      // PER counter-attack
      if (Math.random() * 100 < derived.counterAttackChance) {
        const counterRaw = Math.max(1, derived.physicalAttack * 0.5 * (1 - monster.defense / (monster.defense + 100)));
        const counterDmg = Math.floor(counterRaw * (0.85 + Math.random() * 0.30));
        get().damageMonster(counterDmg);
        get().addLogEntry(`⚡ Counter-attack! (${counterDmg} dmg)`, 'player_action');
      }
      return { damage: 0, hit: false };
    }

    // ── 2. Enemy accuracy check — PER trueStrike reduces effective accuracy ──
    const accuracyMod = getAccuracyModifier(monsterEffects);
    let effectiveAccuracy = Math.max(5, monster.accuracy + accuracyMod + accuracyBonus - derived.trueStrike);
    if (monsterTaunted) effectiveAccuracy *= 0.8;

    const hitRoll = Math.random() * 100;
    const hit = hitRoll <= effectiveAccuracy;
    if (!hit) {
      const missNarration = getMonsterAttackNarration(false, false, false, monster.displayName);
      get().addLogEntry(missNarration, 'miss');
      return { damage: 0, hit: false };
    }

    // ── 3. Player defense — END + STR low-HP bonuses + defend stance ──
    const hpFraction = maxHP > 0 ? currentHP / maxHP : 1;
    let totalDefense = derived.physicalDefense;
    if (hpFraction < 0.25) {
      totalDefense += derived.lastStandDefense + derived.endurePainBonus; // END + STR low-HP defense
    }
    if (playerDefending) {
      totalDefense += derived.physicalDefense * 0.5; // defend stance: +50% defense
      // STR momentum: accumulate stacks for next attack
      const newMomentum = Math.min(3, combatDynamic.momentumStacks + 1);
      get().updateCombatDynamic({ momentumStacks: newMomentum });
    }

    const defenseReduction = totalDefense / (totalDefense + 100);
    let damageMultiplier = 1.0;
    if (hasStatusEffect(monsterEffects, 'weaken')) damageMultiplier *= 0.75;

    const rawDamage = Math.max(1, effectiveAttack * (1 - defenseReduction));
    const varianceFactor = 0.85 + Math.random() * 0.30;
    let damage = Math.floor(rawDamage * varianceFactor * damageMultiplier);

    // ── 4. Enemy crit — reduced by LCK jinx ──
    const enemyCritChance = Math.max(0, 5 - derived.jinxReduction);
    if (Math.random() * 100 < enemyCritChance) {
      damage = Math.floor(damage * 1.5);
      get().addLogEntry(`💥 Critical hit by ${monster.displayName}!`, 'enemy_action');
    }

    // ── 5. WIS divine shield — absorbs incoming damage once every 5 turns ──
    if (combatDynamic.divineShieldActive && derived.divineShieldValue > 0) {
      const absorbed = Math.min(derived.divineShieldValue, damage);
      damage = Math.max(0, damage - absorbed);
      get().updateCombatDynamic({ divineShieldActive: false });
      get().addLogEntry(`🛡️ Divine shield absorbs ${absorbed} damage!`, 'status');
    }

    // ── 5b. Skill shield — temporary HP buffer from shield skills ──
    if (combatDynamic.playerShieldHP > 0) {
      const absorbed = Math.min(combatDynamic.playerShieldHP, damage);
      damage = Math.max(0, damage - absorbed);
      const remaining = combatDynamic.playerShieldHP - absorbed;
      get().updateCombatDynamic({ playerShieldHP: remaining });
      get().addLogEntry(`🔰 Shield absorbs ${absorbed} damage! (${remaining} remaining)`, 'status');
    }

    // ── 6. Lucky escape check (LCK) — survive lethal blow ──
    if (damage >= currentHP && Math.random() * 100 < derived.luckyEscapeChance) {
      damage = currentHP - 1; // Survive with 1 HP
      get().addLogEntry(`🍀 Fortune spares you at the last moment!`, 'system');
    }

    const isHeavy = damage > monster.attack * 0.4;
    const hitNarration = getMonsterAttackNarration(true, playerDefending, isHeavy, monster.displayName);
    get().addLogEntry(hitNarration, 'enemy_action', ` (${damage} dmg)`, 'damage');

    // Reset combo and sequence bonus on taking damage (AGI combo break / Kairos flow break)
    get().updateCombatDynamic({ comboCount: 0, sequenceBonus: 0 });

    onDamage(damage);

    // ── 6. Status proc — modified by LCK procAmplify and END statusResistance ──
    // Use monster's ATTACK TYPES (what the monster deals) — NOT its resistances.
    let statusApplied: StatusEffectType | undefined;
    const attackTypes = monster.base.damageTypes;
    const baseProcChance = 0.20 * derived.procAmplify; // LCK amplifies all procs
    const effectiveProcChance = baseProcChance * (1 - derived.statusResistance); // END reduces

    if (Math.random() < effectiveProcChance) {
      let chosenType: StatusEffectType | undefined;
      if (attackTypes.includes('fire'))   chosenType = 'burn';
      else if (attackTypes.includes('ice'))    chosenType = 'freeze';
      else if (attackTypes.includes('poison')) chosenType = 'poison';
      else if (attackTypes.includes('dark'))   chosenType = 'curse';
      else if (Math.random() < 0.3)           chosenType = 'bleed';

      if (chosenType) {
        get().applyPlayerEffect(chosenType, monster.instanceId);
        statusApplied = chosenType;
      }
    }

    set({ playerDefending: false });
    return { damage, hit: true, statusApplied };
  },

  processPassiveEffects: (derived, turn, onHpRegen, onSpRegen, onStatusCleared) => {
    const { playerEffects } = get();

    // END: HP regen per turn
    if (derived.hpRegenPerTurn > 0) {
      onHpRegen(derived.hpRegenPerTurn);
    }

    // WIS: SP regen per turn
    if (derived.spRegenPerTurn > 0) {
      onSpRegen(derived.spRegenPerTurn);
    }

    // WIS: divine shield activates every 5 turns
    if (turn % 5 === 0 && derived.divineShieldValue > 0) {
      get().updateCombatDynamic({ divineShieldActive: true });
      get().addLogEntry(`🛡️ Divine shield activates! (${derived.divineShieldValue} magic absorbed)`, 'status');
    }

    // WIS: passive status clear
    if (derived.statusClearChance > 0 && playerEffects.length > 0) {
      if (Math.random() * 100 < derived.statusClearChance) {
        // Priority: stun > curse > poison > bleed > others
        const priority: StatusEffectType[] = ['stun', 'curse', 'poison', 'bleed', 'burn', 'freeze', 'blind', 'weaken'];
        const toClear = priority.find(p => hasStatusEffect(playerEffects, p));
        if (toClear) {
          get().removePlayerEffect(toClear);
          const effect = playerEffects.find(e => e.type === toClear);
          onStatusCleared(effect?.name ?? toClear);
        }
      }
    }

    // PER + INT: pattern accuracy accumulates each turn (cap 45)
    if (derived.patternAccuracyGain > 0) {
      const { combatDynamic } = get();
      const newBonus = Math.min(45, combatDynamic.patternAccuracyBonus + derived.patternAccuracyGain);
      if (newBonus !== combatDynamic.patternAccuracyBonus) {
        get().updateCombatDynamic({ patternAccuracyBonus: newBonus });
      }
    }
  },

  setPhase: (phase) => set({ phase }),

  nextTurn: () => {
    set((state) => ({
      turn: state.turn + 1,
      playerDefending: false,
      // Decrease sneak penalty turns
      sneakPenaltyTurns: Math.max(0, state.sneakPenaltyTurns - 1),
    }));
  },

  damageMonster: (damage) => {
    const { monster } = get();
    if (!monster) return { killed: false, alreadyDead: true };

    // Check if monster was already dead before this damage
    const alreadyDead = monster.currentHP <= 0;
    if (alreadyDead) {
      return { killed: false, alreadyDead: true };
    }

    const newHP = Math.max(0, monster.currentHP - damage);
    const killed = newHP <= 0;

    set({
      monster: {
        ...monster,
        currentHP: newHP,
      },
    });

    return { killed, alreadyDead: false };
  },

  addLogEntry: (message, type, resultText?, resultType?) => {
    set((state) => ({
      log: [
        ...state.log,
        {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          message,
          type,
          timestamp: Date.now(),
          resultText,
          resultType,
        },
      ].slice(-20), // Keep last 20 entries
    }));
  },

  clearLog: () => set({ log: [] }),

  calculateRewards: () => {
    const { monster } = get();
    if (!monster) return;

    // Get monster category for loot pool
    const category = (monster.base.category || 'beast') as MonsterCategory;

    // Calculate gold with category modifier
    const baseGold = monster.base.goldDrop;
    const goldModifier = getGoldModifier(category);
    const gold = Math.floor(
      Math.random() * (baseGold.max - baseGold.min + 1) + baseGold.min
    );
    const xp = monster.base.xpValue;

    // Calculate weapon drop based on monster category
    // Only certain monsters can drop weapons
    let weaponDrop: Weapon | undefined;

    if (canDropWeapon(category)) {
      // Base 15% + 5% per CR level, max 50%
      const baseDropChance = Math.min(0.5, 0.15 + monster.finalCR * 0.05);
      const categoryModifier = getWeaponDropModifier(category);
      const dropChance = baseDropChance * categoryModifier;
      const dropsWeapon = Math.random() < dropChance;

      // Boss monsters always drop a weapon (if they can)
      if (dropsWeapon || monster.isBoss) {
        const validCategories = getWeaponCategoriesForMonster(category);
        weaponDrop = generateRandomWeapon(monster.base.minFloor, validCategories);
      }
    }
    // Note: Beasts, elementals, dragons, and aberrations don't drop weapons
    // They drop materials instead

    // Calculate material drops - ALL monsters drop magic stones
    const materialDrops: Array<{ material: CraftingMaterial; quantity: number }> = [];

    // Primary drop: Magic Stone (scales with floor and CR)
    const isElite = monster.finalCR > monster.base.baseCR + 1; // Elite if CR increased significantly
    const magicStone = getMagicStoneDrop(
      monster.base.minFloor,
      monster.finalCR,
      monster.isBoss || false,
      isElite
    );
    const stoneQuantity = getMagicStoneQuantity(
      monster.finalCR,
      monster.isBoss || false,
      isElite
    );
    materialDrops.push({ material: magicStone, quantity: stoneQuantity });

    // Bonus material drop (25% base chance, category-specific)
    const bonusMaterial = rollBonusMaterialDrop(
      monster.base.minFloor,
      category,
      0 // TODO: Add luck bonus from player stats
    );
    if (bonusMaterial) {
      materialDrops.push({ material: bonusMaterial, quantity: 1 });
    }

    set({
      rewards: {
        gold: Math.floor(gold * (monster.finalCR / monster.base.baseCR) * goldModifier),
        xp: Math.floor(xp * (monster.finalCR / monster.base.baseCR)),
        items: [],
        weaponDrop,
        materialDrops,
      },
    });
  },

  // Status effect management
  applyPlayerEffect: (type, sourceId) => {
    const newEffect = createStatusEffect(type, sourceId);
    const { playerEffects } = get();
    const updatedEffects = applyStatusEffect(playerEffects, newEffect);

    if (updatedEffects.length > playerEffects.length) {
      // New effect was applied
      get().addLogEntry(
        `${STATUS_EFFECT_ICONS[type]} You are afflicted with ${newEffect.name}!`,
        'status'
      );
    } else {
      // Effect was refreshed/stacked
      const existing = updatedEffects.find(e => e.type === type);
      if (existing?.stacks && existing.stacks > 1) {
        get().addLogEntry(
          `${STATUS_EFFECT_ICONS[type]} ${newEffect.name} intensifies! (${existing.stacks} stacks)`,
          'status'
        );
      }
    }

    set({ playerEffects: updatedEffects });
  },

  applyMonsterEffect: (type, sourceId) => {
    const newEffect = createStatusEffect(type, sourceId);
    const { monsterEffects, monster } = get();
    const updatedEffects = applyStatusEffect(monsterEffects, newEffect);

    if (updatedEffects.length > monsterEffects.length) {
      get().addLogEntry(
        `${STATUS_EFFECT_ICONS[type]} The ${monster?.displayName} is afflicted with ${newEffect.name}!`,
        'status'
      );
    } else {
      const existing = updatedEffects.find(e => e.type === type);
      if (existing?.stacks && existing.stacks > 1) {
        get().addLogEntry(
          `${STATUS_EFFECT_ICONS[type]} ${newEffect.name} intensifies! (${existing.stacks} stacks)`,
          'status'
        );
      }
    }

    set({ monsterEffects: updatedEffects });
  },

  removePlayerEffect: (type) => {
    const { playerEffects } = get();
    const effect = playerEffects.find(e => e.type === type);
    if (effect) {
      get().addLogEntry(`${effect.name} has worn off.`, 'status');
    }
    set({ playerEffects: removeStatusEffectByType(playerEffects, type) });
  },

  removeMonsterEffect: (type) => {
    const { monsterEffects, monster } = get();
    const effect = monsterEffects.find(e => e.type === type);
    if (effect) {
      get().addLogEntry(`${effect.name} has worn off the ${monster?.displayName}.`, 'status');
    }
    set({ monsterEffects: removeStatusEffectByType(monsterEffects, type) });
  },

  processPlayerEffects: (maxHP, onDamage, onHeal) => {
    const { playerEffects } = get();

    // Check if player's turn is skipped
    const skipResult = shouldSkipTurn(playerEffects);
    if (skipResult.skip) {
      get().addLogEntry(`You are ${skipResult.reason?.toLowerCase()}! You cannot act.`, 'status');
    }

    // Calculate and apply damage/healing from effects
    let totalHeal = 0;

    for (const effect of playerEffects) {
      const effectDamage = calculateStatusDamage(effect, maxHP);
      if (effectDamage > 0) {
        // Apply damage with effect type for floating damage display
        onDamage(effectDamage, effect.type);
        get().addLogEntry(
          `${STATUS_EFFECT_ICONS[effect.type]} ${effect.name} deals ${effectDamage} damage!`,
          'damage'
        );
      } else if (effectDamage < 0) {
        totalHeal += Math.abs(effectDamage);
      }
    }
    if (totalHeal > 0) {
      onHeal(totalHeal);
      get().addLogEntry(`Regeneration heals ${totalHeal} HP!`, 'heal');
    }

    // Tick effect durations
    const updatedEffects = tickStatusEffects(playerEffects);

    // Log expired effects
    const expiredEffects = playerEffects.filter(
      e => !updatedEffects.some(u => u.id === e.id)
    );
    for (const expired of expiredEffects) {
      get().addLogEntry(`${expired.name} has worn off.`, 'status');
    }

    set({ playerEffects: updatedEffects });

    return { skipped: skipResult.skip, reason: skipResult.reason };
  },

  processMonsterEffects: () => {
    const { monsterEffects, monster } = get();
    if (!monster) return { skipped: false, damage: 0 };

    // Check if monster's turn is skipped
    const skipResult = shouldSkipTurn(monsterEffects);

    // Calculate and apply damage from effects
    let totalDamage = 0;

    for (const effect of monsterEffects) {
      const effectDamage = calculateStatusDamage(effect, monster.maxHP);
      if (effectDamage > 0) {
        totalDamage += effectDamage;
        get().addLogEntry(
          `${STATUS_EFFECT_ICONS[effect.type]} ${effect.name} deals ${effectDamage} damage to ${monster.displayName}!`,
          'damage'
        );
      }
    }

    // Apply damage to monster
    if (totalDamage > 0) {
      const { killed, alreadyDead } = get().damageMonster(totalDamage);
      if (killed && !alreadyDead) {
        set({ phase: 'victory' });
        get().calculateRewards();
        get().addLogEntry(`The ${monster.displayName} succumbs to ${monsterEffects[0]?.name}!`, 'system');
      }
    }

    // Tick effect durations
    const updatedEffects = tickStatusEffects(monsterEffects);

    // Log expired effects
    const expiredEffects = monsterEffects.filter(
      e => !updatedEffects.some(u => u.id === e.id)
    );
    for (const expired of expiredEffects) {
      get().addLogEntry(`${expired.name} has worn off the ${monster.displayName}.`, 'status');
    }

    set({ monsterEffects: updatedEffects });

    return { skipped: skipResult.skip, reason: skipResult.reason, damage: totalDamage };
  },
}));
