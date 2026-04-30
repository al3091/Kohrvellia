/**
 * Combat Screen
 * Turn-based combat interface with text-forward narrative design
 */

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Modal, FlatList, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useCombatStore } from '../../src/stores/useCombatStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { useSoulStore } from '../../src/stores/useSoulStore';
import { useDeityStore } from '../../src/stores/useDeityStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { FloatingDamage, type DamagePopup } from '../../src/components/combat/FloatingDamage';
import { TurnOrderTimeline } from '../../src/components/combat/TurnOrderTimeline';
import { MonsterDisplay } from '../../src/components/combat/MonsterDisplay';
import { NarrativeLog } from '../../src/components/combat/NarrativeLog';
import { DramaticReveal } from '../../src/components/text/DramaticReveal';
import { CeremonialDivider } from '../../src/components/ui/CeremonialDivider';
import type { StatName, DerivedStats } from '../../src/types/Stats';
import { STATUS_EFFECT_ICONS, STATUS_EFFECT_COLORS } from '../../src/types/StatusEffect';
import { getConsumableById } from '../../src/data/consumables';
import type { StagedAction, CombatAction } from '../../src/stores/useCombatStore';
import { formatConsumableEffect, RARITY_COLORS as CONSUMABLE_RARITY_COLORS } from '../../src/types/Consumable';
import type { LearnedSkill } from '../../src/types/Skill';
import { canUseSkill, formatSkillDescription, SKILL_CATEGORY_COLORS } from '../../src/types/Skill';
import { MATERIAL_TIER_COLORS } from '../../src/data/materials';

// Rarity colors for weapon drops
const RARITY_COLORS: Record<string, string> = {
  junk: Colors.text.muted,
  common: Colors.text.secondary,
  uncommon: Colors.ui.success,
  rare: Colors.domain.knowledge,
  epic: Colors.domain.authority,
  legendary: Colors.resource.gold,
};

export default function CombatScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const [actionDisabled, setActionDisabled] = useState(false);
  const [initiativeMessage, setInitiativeMessage] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const screenFlash = useRef(new Animated.Value(0)).current;
  const bonusPulse = useRef(new Animated.Value(1)).current;
  const [weaponEquipped, setWeaponEquipped] = useState(false);
  const [confirmDestroyWeapon, setConfirmDestroyWeapon] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [monsterTakingDamage, setMonsterTakingDamage] = useState(false);
  const [retreatModalVisible, setRetreatModalVisible] = useState(false);
  const [lastPrimaryAction, setLastPrimaryAction] = useState<{ action: CombatAction; label: string } | null>(null);

  // Add a floating damage popup
  const addDamagePopup = useCallback((value: number, type: DamagePopup['type'], xOffset?: number) => {
    const popup: DamagePopup = {
      id: `${Date.now()}-${Math.random()}`,
      value,
      type,
      x: xOffset ?? (Math.random() * 40 - 20), // Random x offset for variety
    };
    setDamagePopups((prev) => [...prev, popup]);
  }, []);

  // Remove a popup when animation completes
  const removeDamagePopup = useCallback((id: string) => {
    setDamagePopups((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Screen flash for critical hits
  const triggerScreenFlash = useCallback(() => {
    Animated.sequence([
      Animated.timing(screenFlash, { toValue: 0.3, duration: 50, useNativeDriver: true }),
      Animated.timing(screenFlash, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [screenFlash]);

  const {
    isInCombat,
    phase,
    turn,
    monster,
    log,
    rewards,
    monsterObserved,
    playerEffects,
    monsterEffects,
    combatDynamic,
    stagedPrimary,
    stagedBonus,
    bonusActionAvailable,
    resolvedTurnSequence,
    playerAttack,
    playerDefend,
    playerFlee,
    playerObserve,
    playerTaunt,
    playerUseItem,
    playerUseSkill,
    playerQuickStrike,
    playerCharge,
    enemyTurn,
    processPassiveEffects,
    setPhase,
    nextTurn,
    endCombat,
    processPlayerEffects,
    processMonsterEffects,
    stagePrimary,
    stageBonus,
    cancelPrimary,
    cancelBonus,
    invokeKairos,
    setBonusActionAvailable,
  } = useCombatStore();

  const { character, modifyHP, modifySP, modifyGold, addPendingExcelia, updateRunStats, equipWeapon, removeFromInventory, addToInventory, getDerivedStats: _getDerivedStats, getDerivedStatsWithBlessings, updatePendingExceliaStats, discardExcelia, killCharacter, isBagFull } = useCharacterStore();
  const getDerivedStats = getDerivedStatsWithBlessings;
  const { completeNode, getCurrentNode, endRun, currentRun } = useDungeonStore();
  const { incrementProgress, updateProgress } = useAchievementStore();

  // Check if player died
  useEffect(() => {
    if (character && character.currentHP <= 0 && phase !== 'defeat' && phase !== 'fled') {
      setPhase('defeat');
    }
  }, [character, phase, setPhase]);

  // Kairos: set initial bonus action availability on combat start
  useEffect(() => {
    if (isInCombat && monster) {
      const derived = getDerivedStats();
      setBonusActionAvailable(derived.speed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInCombat]);

  // Auto-stage last used primary action at the start of each player_plan phase
  useEffect(() => {
    if (phase === 'player_plan' && !stagedPrimary && lastPrimaryAction) {
      stagePrimary(lastPrimaryAction.action, lastPrimaryAction.label, {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Block hardware back button during active combat — show retreat modal instead
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isInCombat && phase !== 'victory' && phase !== 'defeat' && phase !== 'fled') {
        setRetreatModalVisible(true);
        return true; // Consume the event — do NOT navigate back
      }
      return false; // Allow default behavior when combat is resolved
    });
    return () => subscription.remove();
  }, [isInCombat, phase]);

  // Bonus slot pulse: breathe when Primary is staged but Bonus is available and empty
  useEffect(() => {
    if (stagedPrimary && bonusActionAvailable && !stagedBonus) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(bonusPulse, { toValue: 0.25, duration: 900, useNativeDriver: true }),
          Animated.timing(bonusPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => { anim.stop(); bonusPulse.setValue(1); };
    } else {
      bonusPulse.setValue(1);
    }
  }, [stagedPrimary, bonusActionAvailable, stagedBonus, bonusPulse]);

  // Combat BGM management
  useEffect(() => {
    // Start combat/boss BGM on mount
    if (monster?.isBoss) {
      useSoundStore.getState().crossfadeBGM('boss', 800);
    } else {
      useSoundStore.getState().crossfadeBGM('combat', 500);
    }

    // Return to dungeon BGM on unmount
    return () => {
      useSoundStore.getState().crossfadeBGM('dungeon', 1000);
    };
  }, [monster?.isBoss]);

  // Victory / defeat BGM transitions
  useEffect(() => {
    if (phase === 'victory') {
      useSoundStore.getState().playBGM('victory');
    } else if (phase === 'defeat') {
      useSoundStore.getState().playBGM('defeat');
    }
  }, [phase]);

  // Shake animation for damage
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Get consumable items from inventory
  const consumableItems = useMemo(() => {
    if (!character) return [];
    return character.inventory.filter(
      (item) => item.type === 'consumable' && item.quantity > 0
    );
  }, [character?.inventory]);

  // (moreActions removed — Kairos two-row panel replaces the ActionModal)

  // Get weapon scaling stat (defaults to STR if no weapon equipped)
  const getWeaponScalingStat = (): StatName => {
    const weapon = character?.equipment.weapon;
    if (weapon?.base.category) {
      return weapon.base.category as StatName;
    }
    return 'STR'; // Unarmed defaults to STR
  };

  // ── B3: Execution helpers (run* functions) ──
  // These contain the logic previously inline in handleXxx.
  // Called by executePlayerAction inside handleLockIn.

  const runAttack = (derived: DerivedStats): void => {
    if (!character) return;
    haptics.medium();
    useSoundStore.getState().playSFX('attack');

    const scalingStat = getWeaponScalingStat();
    const result = playerAttack(derived, character.currentHP, character.maxHP);

    if (result.hit) {
      addPendingExcelia(scalingStat, 1);
      updateRunStats({ damageDealt: character.runStats.damageDealt + result.damage });
      setMonsterTakingDamage(true);
      setTimeout(() => setMonsterTakingDamage(false), 300);

      if (result.critical) {
        addDamagePopup(result.damage, 'critical', 0);
        triggerScreenFlash();
        useSoundStore.getState().playSFX('attack_critical');
        haptics.heavy();
        addPendingExcelia('PER', 2);
        addPendingExcelia(scalingStat, 1);
        useSoulStore.getState().incrementBehavement('phys_crits_25');
        useSoulStore.getState().incrementBehavement('phys_crits_100');
      } else {
        addDamagePopup(result.damage, 'damage', 0);
        useSoundStore.getState().playSFX('hit');
      }

      if (result.doubleHit) {
        setTimeout(() => {
          addDamagePopup(result.doubleHitDamage, 'damage', 10);
          useSoundStore.getState().playSFX('hit');
        }, 300);
        addPendingExcelia('AGI', 1);
      }
    } else {
      addDamagePopup(0, 'miss', 0);
      useSoundStore.getState().playSFX('miss');
    }

    useSoulStore.getState().incrementBehavement('phys_attacks_100');
    useSoulStore.getState().incrementBehavement('phys_attacks_500');

    // Track kills — phase flips to 'victory' synchronously inside playerAttack when monster dies
    if (useCombatStore.getState().phase === 'victory') {
      useSoulStore.getState().incrementBehavement('phys_kills_50');
      useSoulStore.getState().incrementBehavement('phys_kills_200');
    }
  };

  const runDefend = (): void => {
    haptics.light();
    useSoundStore.getState().playSFX('defend');
    playerDefend();
    addPendingExcelia('END', 1);
    useSoulStore.getState().incrementBehavement('tank_blocks_50');
    useSoulStore.getState().incrementBehavement('tank_blocks_200');
  };

  const runFlee = (derived: DerivedStats): void => {
    haptics.medium();
    const effectiveFleeSpeed = derived.speed + derived.fleeBonus * 0.5;
    const success = playerFlee(effectiveFleeSpeed, currentRun?.currentFloor ?? 1);
    addPendingExcelia('AGI', 1);

    if (success) {
      haptics.success();
      addPendingExcelia('AGI', 2);
      useSoulStore.getState().incrementBehavement('evade_flees_10');
      useSoulStore.getState().incrementBehavement('evade_flees_50');
      setTimeout(() => router.back(), 1000);
    }
    // If flee fails, handleLockIn sees phase is still 'resolve_queue' and proceeds to enemy turn
  };

  const runTaunt = (derived: DerivedStats): void => {
    haptics.medium();
    const result = playerTaunt(derived.intimidatePower);
    addPendingExcelia('CHA', 1);
    useSoulStore.getState().incrementBehavement('social_taunts');
    useSoulStore.getState().incrementBehavement('social_taunts_100');
    if (result.success) {
      haptics.success();
      addPendingExcelia('CHA', 2);
    }
  };

  const runUseItem = (itemId: string, derived: DerivedStats): void => {
    if (!character) return;
    const consumable = getConsumableById(itemId);
    if (!consumable) return;

    haptics.medium();

    const onHeal = (amount: number) => {
      let healAmount = amount;
      if (consumable.effect.type === 'heal_percent_hp') {
        healAmount = Math.floor(derived.maxHP * (amount / 100));
      }
      healAmount = Math.floor(healAmount * derived.healAmplify);
      modifyHP(healAmount);
      addDamagePopup(healAmount, 'heal', 0);
      useSoundStore.getState().playSFX('heal');
    };

    const onHealSP = (amount: number) => {
      let healAmount = amount;
      if (consumable.effect.type === 'heal_percent_sp') {
        healAmount = Math.floor(derived.maxSP * (amount / 100));
      }
      modifySP(healAmount);
      addDamagePopup(healAmount, 'heal', 0);
      useSoundStore.getState().playSFX('buff');
    };

    const onRemoveItem = (id: string) => {
      removeFromInventory(id, 1);
    };

    const result = playerUseItem(itemId, onHeal, onHealSP, onRemoveItem);

    if (result.success) {
      useSoulStore.getState().incrementBehavement('caution_consumable_use');
      if (result.effect?.type === 'flee') {
        setTimeout(() => router.back(), 1000);
      }
    }
  };

  const runUseSkill = (skill: LearnedSkill, statValue: number, derived: DerivedStats): void => {
    if (!character) return;
    const check = canUseSkill(skill, character.currentSP);
    if (!check.canUse) return;

    haptics.medium();
    useSoundStore.getState().playSFX('attack');

    const onHeal = (amount: number) => {
      modifyHP(amount);
      addDamagePopup(amount, 'heal', 0);
      useSoundStore.getState().playSFX('heal');
    };
    const onSpendSP = (amount: number) => { modifySP(-amount); };
    const onApplyShield = (amount: number) => {
      const prev = useCombatStore.getState().combatDynamic.playerShieldHP;
      useCombatStore.getState().updateCombatDynamic({ playerShieldHP: prev + amount });
      addDamagePopup(amount, 'heal', 0);
      useSoundStore.getState().playSFX('defend');
    };

    const result = playerUseSkill(skill, statValue, derived, onHeal, onSpendSP, onApplyShield);

    if (result.success) {
      addPendingExcelia(skill.scalingStat, 2);
      updateRunStats({ damageDealt: character.runStats.damageDealt + result.damage });
      if (skill.scalingStat === 'INT' || skill.scalingStat === 'WIS') {
        useSoulStore.getState().incrementBehavement('magic_attacks_100');
        useSoulStore.getState().incrementBehavement('magic_attacks_500');
        useSoulStore.getState().incrementBehavement('magic_sp_spent_1000', skill.spCost);
      }
    }
  };

  // Kairos: Charge (Primary — WARD tag, no damage, builds momentum)
  const runCharge = (): void => {
    haptics.light();
    playerCharge();
    addPendingExcelia('END', 1);
  };

  // Kairos: Quick Strike (Bonus — STRIKE tag, 50% power)
  const runQuickStrike = (derived: DerivedStats): void => {
    if (!character) return;
    haptics.medium();
    useSoundStore.getState().playSFX('attack');
    const result = playerQuickStrike(derived, character.currentHP, character.maxHP);
    if (result.hit) {
      addDamagePopup(result.damage, 'damage', 10);
      useSoundStore.getState().playSFX('hit');
      setMonsterTakingDamage(true);
      setTimeout(() => setMonsterTakingDamage(false), 300);
      addPendingExcelia('AGI', 1);
    } else {
      addDamagePopup(0, 'miss', 10);
      useSoundStore.getState().playSFX('miss');
    }
  };

  // Observe staged as Bonus action (fires during resolution)
  const runObserve = (): void => {
    haptics.light();
    const result = playerObserve();
    addPendingExcelia('WIS', result.alreadyObserved ? 0 : 2);
    if (!result.alreadyObserved) {
      useSoulStore.getState().incrementBehavement('caution_observes');
      useSoulStore.getState().incrementBehavement('caution_observes_200');
    }
  };

  // Execute a primary or bonus staged action
  const executePlayerAction = (action: StagedAction, derived: DerivedStats): void => {
    switch (action.action) {
      case 'attack':       runAttack(derived); break;
      case 'charge':       runCharge(); break;
      case 'flee':         runFlee(derived); break;
      case 'skill':
        runUseSkill(
          action.data.skill as LearnedSkill,
          action.data.statValue as number,
          derived
        );
        break;
      case 'defend':       runDefend(); break;
      case 'quick_strike': runQuickStrike(derived); break;
      case 'observe':      runObserve(); break;
      case 'taunt':        runTaunt(derived); break;
      case 'item':
        runUseItem(action.data.itemId as string, derived);
        useCombatStore.getState().updateCombatDynamic({ lastActionTag: 'SURGE' });
        break;
      default: break;
    }
  };

  // ── Kairos Protocol: INVOKE KAIROS — resolve turn order and execute both slots ──
  const handleInvokeKairos = () => {
    if (!stagedPrimary || phase !== 'player_plan' || !character) return;

    const primaryAction = stagedPrimary;
    const bonusAction = stagedBonus;
    const bonusWasted = bonusActionAvailable && !stagedBonus;
    const derived = getDerivedStats();

    // Sneak minor_fail → enemy always acts first
    const sneakState = useCombatStore.getState().sneakPenalty;
    const rawOrder = invokeKairos(derived.speed);

    // Atmospheric log when bonus slot was left empty
    if (bonusWasted) {
      useCombatStore.getState().addLogEntry('A moment slipped past.', 'system');
    }
    const order = (sneakState === 'minor_fail' || sneakState === 'critical_fail') ? 'enemy_first' : rawOrder;

    setInitiativeMessage(order === 'player_first' ? 'You act first!' : 'Enemy acts first!');
    setActionDisabled(true);

    // Helper: execute both player slots in correct sub-order
    // Plan: Bonus fires before Primary in player-first (Defend primes stance before Attack)
    const executeBothSlots = (d: DerivedStats): void => {
      if (bonusAction) executePlayerAction(bonusAction, d);
      const postBonus = useCombatStore.getState().phase;
      if (postBonus === 'victory' || postBonus === 'defeat' || postBonus === 'fled') return;
      executePlayerAction(primaryAction, d);
    };

    if (sneakState === 'critical_fail') {
      // Ambush: free enemy hit, then player acts, no second enemy turn this round
      useCombatStore.getState().setSneakPenalty('none');
      handleEnemyTurnInner(() => {
        const pp = useCombatStore.getState().phase;
        if (pp === 'defeat' || pp === 'fled') {
          setActionDisabled(false);
          return;
        }
        setTimeout(() => {
          executeBothSlots(derived);
          const finalPhase = useCombatStore.getState().phase;
          if (finalPhase === 'resolve_queue' || finalPhase === 'player_plan') {
            endRound();
          } else {
            setActionDisabled(false);
          }
        }, 500);
      });
      return;
    }

    if (order === 'player_first') {
      executeBothSlots(derived);

      setTimeout(() => {
        const pp = useCombatStore.getState().phase;
        if (pp === 'victory' || pp === 'defeat' || pp === 'fled') {
          setActionDisabled(false);
          return;
        }
        handleEnemyTurnInner();
      }, 700);
    } else {
      // Enemy acts first
      handleEnemyTurnInner(() => {
        const pp = useCombatStore.getState().phase;
        if (pp === 'defeat' || pp === 'fled') {
          setActionDisabled(false);
          return;
        }
        setTimeout(() => {
          executeBothSlots(derived);

          const finalPhase = useCombatStore.getState().phase;
          if (finalPhase === 'resolve_queue' || finalPhase === 'player_plan') {
            if (useCombatStore.getState().monsterActsTwice) {
              setTimeout(() => {
                const phaseCheck = useCombatStore.getState().phase;
                if (phaseCheck === 'victory' || phaseCheck === 'defeat' || phaseCheck === 'fled') {
                  endRound();
                  return;
                }
                handleEnemyTurnInner(endRound, true);
              }, 500);
            } else {
              endRound();
            }
          } else {
            setActionDisabled(false);
          }
        }, 500);
      });
      return; // early return — endRound called inside callback
    }
  };

  // ── Kairos action staging handlers ──

  const isActionDisabled = actionDisabled || phase !== 'player_plan';

  // PRIMARY slot handlers
  const handleAttack = () => {
    if (isActionDisabled || !!stagedPrimary) return;
    stagePrimary('attack', '⚔ Attack', {});
    setLastPrimaryAction({ action: 'attack', label: '⚔ Attack' });
  };

  const handleCharge = () => {
    if (isActionDisabled || !!stagedPrimary) return;
    stagePrimary('charge', '⬆ Charge', {});
    setLastPrimaryAction({ action: 'charge', label: '⬆ Charge' });
  };

  const handleFlee = () => {
    if (isActionDisabled || !!stagedPrimary) return;
    stagePrimary('flee', '🏃 Flee', {});
    setLastPrimaryAction({ action: 'flee', label: '🏃 Flee' });
  };

  // BONUS slot handlers — smart routing: primary if empty, bonus if primary staged
  const handleDefend = () => {
    if (isActionDisabled) return;
    if (!stagedPrimary) {
      stagePrimary('defend', '🛡 Defend', {});
      setLastPrimaryAction({ action: 'defend', label: '🛡 Defend' });
    } else if (bonusActionAvailable && !stagedBonus) {
      stageBonus('defend', '🛡 Defend', {});
    }
  };

  const handleQuickStrike = () => {
    if (isActionDisabled) return;
    if (!stagedPrimary) {
      stagePrimary('quick_strike', '⚡ Q.Strike', {});
      setLastPrimaryAction({ action: 'quick_strike', label: '⚡ Q.Strike' });
    } else if (bonusActionAvailable && !stagedBonus) {
      stageBonus('quick_strike', '⚡ Q.Strike', {});
    }
  };

  const handleObserve = () => {
    if (isActionDisabled) return;
    if (!stagedPrimary) {
      stagePrimary('observe', '👁 Observe', {});
      setLastPrimaryAction({ action: 'observe', label: '👁 Observe' });
    } else if (bonusActionAvailable && !stagedBonus) {
      stageBonus('observe', '👁 Observe', {});
    }
  };

  const handleTaunt = () => {
    if (isActionDisabled) return;
    if (!stagedPrimary) {
      stagePrimary('taunt', '😤 Taunt', {});
      setLastPrimaryAction({ action: 'taunt', label: '😤 Taunt' });
    } else if (bonusActionAvailable && !stagedBonus) {
      stageBonus('taunt', '😤 Taunt', {});
    }
  };

  // Item selected in modal → stage as primary or bonus action depending on what's available
  const handleUseItem = (itemId: string) => {
    if (!character || isActionDisabled) return;
    const consumable = getConsumableById(itemId);
    if (!consumable) return;
    setItemModalVisible(false);
    if (!stagedPrimary) {
      stagePrimary('item', `🧪 ${consumable.name}`, { itemId });
    } else if (bonusActionAvailable && !stagedBonus) {
      stageBonus('item', `🧪 ${consumable.name}`, { itemId });
    }
  };

  // Skill selected in modal → stage as primary action
  const handleUseSkill = (skill: LearnedSkill) => {
    if (!character || isActionDisabled) return;
    const check = canUseSkill(skill, character.currentSP);
    if (!check.canUse) return;
    setSkillModalVisible(false);
    const statValue = character.stats[skill.scalingStat].points;
    stagePrimary('skill', `✨ ${skill.name}`, { skill, statValue });
  };

  // B3: Enemy turn — onComplete callback fires after the setTimeout resolves.
  // When called from handleLockIn (player_first path), nextTurn+handlePlayerTurnStart run here.
  // When called from handleLockIn (enemy_first path), onComplete drives the next step instead.
  const handleEnemyTurnInner = (onComplete?: () => void, isSecondStrike = false) => {
    if (!character) { onComplete?.(); return; }

    const currentPhase = useCombatStore.getState().phase;
    if (currentPhase === 'victory' || currentPhase === 'defeat' || currentPhase === 'fled') {
      setActionDisabled(false);
      onComplete?.();
      return;
    }

    const wasDefending = useCombatStore.getState().playerDefending;
    // No setPhase('enemy_turn') — we stay in 'resolve_queue' throughout

    setTimeout(() => {
      const monsterEffectResult = processMonsterEffects();

      if (useCombatStore.getState().phase === 'victory') {
        setActionDisabled(false);
        onComplete?.();
        return;
      }

      if (monsterEffectResult.skipped) {
        // Monster stunned — skip enemy action; round still needs to end
        if (!onComplete) {
          // player_first path: we own the round end
          nextTurn();
          handlePlayerTurnStart();
          setActionDisabled(false);
        } else {
          onComplete();
        }
        return;
      }

      const currentChar = useCharacterStore.getState().character;
      if (!currentChar) { onComplete?.(); return; }
      const derived = getDerivedStats();

      const result = enemyTurn(derived, currentChar.currentHP, currentChar.maxHP, (damage) => {
        modifyHP(-damage);
        triggerShake();
        haptics.heavy();
        if (wasDefending) {
          useSoundStore.getState().playSFX('defend');
          addDamagePopup(damage, 'block', 0);
          addPendingExcelia('END', 2);
        } else {
          useSoundStore.getState().playSFX(damage > 15 ? 'hit_heavy' : 'hit');
          addDamagePopup(damage, 'damage', 0);
        }
        updateRunStats({ damageTaken: currentChar.runStats.damageTaken + damage });
      });

      if (result.hit) {
        if (result.damage > 0) {
          useSoulStore.getState().incrementBehavement('tank_damage_taken_1000', result.damage);
          useSoulStore.getState().incrementBehavement('tank_damage_taken_5000', result.damage);
        }
        const currentHP = useCharacterStore.getState().character?.currentHP ?? 0;
        if (currentHP <= 0) {
          setPhase('defeat');
          haptics.error();
          useSoundStore.getState().playSFX('defeat');
          setActionDisabled(false);
          onComplete?.();
          return;
        }
      } else {
        addDamagePopup(0, 'miss', 0);
        useSoundStore.getState().playSFX('miss');
        addPendingExcelia('LCK', 1);
      }

      if (!onComplete) {
        // player_first path: check double-turn before ending round
        const actsTwice = !isSecondStrike && useCombatStore.getState().monsterActsTwice;
        if (actsTwice) {
          setTimeout(() => {
            const phaseCheck = useCombatStore.getState().phase;
            if (phaseCheck === 'victory' || phaseCheck === 'defeat' || phaseCheck === 'fled') {
              endRound();
              return;
            }
            handleEnemyTurnInner(undefined, true);
          }, 500);
        } else {
          setInitiativeMessage('');
          nextTurn();
          handlePlayerTurnStart();
          setActionDisabled(false);
        }
      } else {
        onComplete();
      }
    }, 600);
  };

  // B3: end of round — advance turn counter and restore player_plan phase
  const endRound = () => {
    nextTurn();
    handlePlayerTurnStart(); // internally sets player_plan at end
    setInitiativeMessage('');
    setActionDisabled(false);
  };

  // Process status effects and passive regen at the start of player turn
  const handlePlayerTurnStart = () => {
    // Get fresh character reference to avoid stale closure
    const currentCharacter = useCharacterStore.getState().character;
    if (!currentCharacter) return;

    // Phase F: passive per-turn effects (HP/SP regen, divine shield, status clear)
    const derived = getDerivedStats();

    // Kairos: compute bonus action availability for this turn
    setBonusActionAvailable(derived.speed);
    const currentTurn = useCombatStore.getState().turn;
    processPassiveEffects(
      derived,
      currentTurn,
      (hp) => {
        modifyHP(hp);
        addDamagePopup(hp, 'heal', -15);
      },
      (sp) => {
        modifySP(sp);
      },
      (effectName) => {
        useSoundStore.getState().playSFX('buff');
        addDamagePopup(0, 'heal', 15);
        // Log message is added inside processPassiveEffects
        void effectName; // used by log inside store
      }
    );

    // Track cumulative HP change to detect death reliably
    let cumulativeHPChange = 0;

    // Process player status effects (DoT, stun check)
    const result = processPlayerEffects(
      currentCharacter.maxHP,
      (rawDotDamage, effectType) => {
        // END dotDamageReduction reduces all DoT tick damage
        const damage = Math.max(1, Math.floor(rawDotDamage * (1 - derived.dotDamageReduction)));
        cumulativeHPChange -= damage;
        modifyHP(-damage);
        triggerShake();
        haptics.warning();
        // Show floating damage with effect type (poison/burn)
        const popupType = effectType === 'poison' ? 'poison' : effectType === 'burn' ? 'burn' : 'damage';
        addDamagePopup(damage, popupType, 0);
        updateRunStats({
          damageTaken: currentCharacter.runStats.damageTaken + damage,
        });
      },
      (heal) => {
        cumulativeHPChange += heal;
        modifyHP(heal);
        addDamagePopup(heal, 'heal', 0);
        useSoundStore.getState().playSFX('heal');
      }
    );

    // Check if player died from DoT using pre-calculated expected HP
    // This avoids the race condition with batched state updates
    const expectedHP = currentCharacter.currentHP + cumulativeHPChange;
    if (expectedHP <= 0) {
      setPhase('defeat');
      haptics.error();
      useSoundStore.getState().playSFX('defeat');
      return;
    }

    // If stunned, skip player turn and trigger enemy turn automatically
    if (result.skipped) {
      setActionDisabled(true);
      setTimeout(() => {
        const currentPhaseCheck = useCombatStore.getState().phase;
        if (currentPhaseCheck !== 'victory' && currentPhaseCheck !== 'defeat') {
          handleEnemyTurnInner(() => {
            const phaseAfterEnemy = useCombatStore.getState().phase;
            if (phaseAfterEnemy !== 'defeat') {
              endRound();
            } else {
              setActionDisabled(false);
            }
          });
        } else {
          setActionDisabled(false);
        }
      }, 1000);
      return;
    }

    setPhase('player_plan');
  };

  // Handle equipping dropped weapon
  const handleEquipDrop = () => {
    if (!rewards?.weaponDrop) return;
    // Bag full + current weapon equipped = weapon will be destroyed — require confirm
    if (isBagFull() && character?.equipment.weapon) {
      setConfirmDestroyWeapon(true);
      return;
    }
    haptics.success();
    equipWeapon(rewards.weaponDrop);
    setWeaponEquipped(true);
  };

  const handleEquipDropConfirmed = () => {
    if (!rewards?.weaponDrop) return;
    setConfirmDestroyWeapon(false);
    haptics.success();
    equipWeapon(rewards.weaponDrop);
    setWeaponEquipped(true);
  };

  // Handle adding dropped weapon to inventory bag
  const handleAddToBag = () => {
    if (!rewards?.weaponDrop || isBagFull()) return;
    haptics.success();
    addToInventory({
      id: rewards.weaponDrop.id || `weapon_${Date.now()}`,
      type: 'weapon',
      name: rewards.weaponDrop.displayName,
      stackable: false,
      quantity: 1,
      identified: rewards.weaponDrop.identified,
      weaponData: rewards.weaponDrop,
    });
    setWeaponEquipped(true); // Reuse state to hide buttons
  };

  // Handle victory (continue after rewards)
  const handleVictory = () => {
    if (!rewards || !character || !monster) return;

    haptics.success();
    useSoundStore.getState().playSFX('victory');

    // Add gold
    modifyGold(rewards.gold);

    // Add material drops to inventory
    for (const drop of rewards.materialDrops) {
      addToInventory({
        id: drop.material.id,
        name: drop.material.name,
        type: 'material',
        quantity: drop.quantity,
        stackable: true,
        icon: drop.material.icon,
      });
    }

    // Distribute XP as stat proficiency (spread across combat stats)
    const xpPerStat = Math.floor(rewards.xp / 4);
    addPendingExcelia('STR', xpPerStat);
    addPendingExcelia('END', xpPerStat);
    addPendingExcelia('AGI', xpPerStat);
    addPendingExcelia('PER', xpPerStat);

    // Update run stats (count materials as items found)
    const totalMaterialsFound = rewards.materialDrops.reduce((sum, d) => sum + d.quantity, 0);
    updateRunStats({
      monstersKilled: character.runStats.monstersKilled + 1,
      goldEarned: character.runStats.goldEarned + rewards.gold,
      itemsFound: character.runStats.itemsFound + (rewards.weaponDrop ? 1 : 0) + totalMaterialsFound,
    });

    // Update pending excelia tracking (monsters killed for Blessing Rite summary)
    updatePendingExceliaStats(character.runStats.deepestFloor || 1, 1);

    // Track achievements
    incrementProgress('kill_count', 1);
    incrementProgress('gold_earn', rewards.gold);
    if (monster.isBoss) {
      incrementProgress('boss_kill', 1);
    }
    if (monster.isElite) {
      incrementProgress('elite_kill', 1);
    }
    // Track damage dealt/taken for achievements
    updateProgress('damage_dealt', character.runStats.damageDealt);
    updateProgress('damage_taken', character.runStats.damageTaken);

    // Soul system: room cleared
    useSoulStore.getState().incrementBehavement('explore_rooms_100');
    useSoulStore.getState().incrementBehavement('explore_rooms_500');
    // Soul system: boss kills
    if (monster.isBoss) {
      useSoulStore.getState().incrementBehavement('phys_boss_melee');
      useSoulStore.getState().incrementBehavement('glory_boss_streak_3');
      useSoulStore.getState().incrementBehavement('glory_boss_streak_5');
    }

    // God Challenge progress — update kill-type challenges
    {
      const deityStore = useDeityStore.getState();
      const activeCh = deityStore.relationship?.currentChallenge;
      if (activeCh) {
        const deity = deityStore.getPatronDeity();
        const challengeDef = deity?.challenges.find((c) => c.id === activeCh.challengeId);
        if (challengeDef) {
          const reqType = challengeDef.requirement.type;
          const isKillChallenge = reqType === 'kill' || reqType === 'kill_monsters';
          const isBossChallenge = (reqType === 'kill_bosses') && monster.isBoss;
          const isEliteChallenge = (reqType === 'kill_elites') && monster.isElite;
          if (isKillChallenge || isBossChallenge || isEliteChallenge) {
            deityStore.updateChallengeProgress(1);
          }
        }
      }
    }

    // Clear the combat node
    const node = getCurrentNode();
    if (node) {
      completeNode(node.id);
    }

    // Reset state
    setWeaponEquipped(false);
    endCombat();
    router.back();
  };

  // Handle defeat (permadeath)
  const handleDefeat = () => {
    haptics.error();
    endCombat();

    // Snapshot stats before stores are cleared
    const snapshotName = character?.name ?? 'Unknown';
    const snapshotEpithet = character?.epithet ?? '';
    const snapshotLevel = String(character?.level ?? 1);
    const snapshotFloor = String(currentRun?.currentFloor ?? character?.runStats?.deepestFloor ?? 1);
    const snapshotKilledBy = monster?.displayName ?? 'the dungeon';
    const snapshotMonstersKilled = String(character?.runStats?.monstersKilled ?? 0);
    const snapshotGoldEarned = String(character?.runStats?.goldEarned ?? 0);

    // Sync run stats to character store before clearing (fixes depth tracking)
    endRun('death');

    // Discard all pending excelia (lost forever)
    discardExcelia();

    // Mark character as dead (permadeath)
    killCharacter();

    // Navigate to epitaph screen with run summary
    router.replace({
      pathname: '/dungeon/epitaph',
      params: {
        characterName: snapshotName,
        epithet: snapshotEpithet,
        level: snapshotLevel,
        floor: snapshotFloor,
        killedBy: snapshotKilledBy,
        monstersKilled: snapshotMonstersKilled,
        goldEarned: snapshotGoldEarned,
      },
    });
  };

  if (!isInCombat || !monster || !character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No combat in progress</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Victory screen
  if (phase === 'victory' && rewards) {
    const weaponDrop = rewards.weaponDrop;
    const currentWeapon = character.equipment.weapon;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.victoryContainer}>
          <DramaticReveal delay={0} duration={600} direction="scale" haptic hapticStyle="heavy">
            <Text style={styles.victoryTitle}>VICTORY</Text>
          </DramaticReveal>
          <DramaticReveal delay={400} duration={400}>
            <Text style={styles.victoryMonster}>
              {rewards.fled
                ? `${monster.displayName} fled from battle.`
                : `${monster.displayName} has been slain.`}
            </Text>
          </DramaticReveal>

          <DramaticReveal delay={700} duration={500}>
            <View style={styles.rewardsContainer}>
              <Text style={styles.rewardsTitle}>Spoils of Battle</Text>
              <CeremonialDivider variant="fade" spacing="sm" />
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>Proficiency:</Text>
              <Text style={styles.rewardValue}>+{rewards.xp} to combat stats</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>Gold:</Text>
              <Text style={styles.rewardGold}>+{rewards.gold} G</Text>
            </View>

            {/* Material Drops */}
            {rewards.materialDrops.length > 0 && (
              <View style={styles.materialDropsSection}>
                <Text style={styles.materialDropsTitle}>Materials:</Text>
                {rewards.materialDrops.map((drop, index) => (
                  <View key={`${drop.material.id}-${index}`} style={styles.materialDropRow}>
                    <Text style={styles.materialIcon}>{drop.material.icon}</Text>
                    <Text
                      style={[
                        styles.materialName,
                        { color: MATERIAL_TIER_COLORS[drop.material.tier] || Colors.text.primary },
                      ]}
                    >
                      {drop.material.name}
                    </Text>
                    <Text style={styles.materialQuantity}>x{drop.quantity}</Text>
                    <Text style={styles.materialValue}>
                      ({drop.material.sellPrice * drop.quantity}G)
                    </Text>
                  </View>
                ))}
              </View>
            )}
            </View>
          </DramaticReveal>

          {/* Weapon Drop */}
          {weaponDrop && (
            <DramaticReveal delay={1000} duration={500}>
              <View style={styles.weaponDropContainer}>
                <Text style={styles.weaponDropTitle}>Weapon Found!</Text>
              <Text
                style={[
                  styles.weaponDropName,
                  { color: RARITY_COLORS[weaponDrop.rarity] || Colors.text.primary },
                ]}
              >
                {weaponDrop.displayName}
              </Text>
              <View style={styles.weaponDropStats}>
                <Text style={styles.weaponDropStat}>
                  DMG: {weaponDrop.finalDamage}
                </Text>
                <Text style={styles.weaponDropStat}>
                  ACC: {weaponDrop.finalAccuracy}%
                </Text>
                <Text style={styles.weaponDropStat}>
                  CRIT: {weaponDrop.finalCritChance.toFixed(0)}%
                </Text>
                <Text style={styles.weaponDropStat}>
                  Scales: {weaponDrop.base.category}
                </Text>
              </View>

              {currentWeapon && (
                <View style={styles.comparisonContainer}>
                  <Text style={styles.comparisonTitle}>Current: {currentWeapon.displayName}</Text>
                  <Text style={styles.comparisonStat}>
                    DMG: {currentWeapon.finalDamage} → {weaponDrop.finalDamage}
                    {weaponDrop.finalDamage > currentWeapon.finalDamage ? ' ↑' : weaponDrop.finalDamage < currentWeapon.finalDamage ? ' ↓' : ''}
                  </Text>
                </View>
              )}

              {/* Warning if bag is full and equipping would lose the old weapon */}
              {currentWeapon && isBagFull() && !weaponEquipped && (
                <View style={styles.bagFullWarning}>
                  <Text style={styles.bagFullWarningText}>
                    Bag is full! Equipping will destroy your current weapon.
                  </Text>
                </View>
              )}

              {!weaponEquipped ? (
                <View style={styles.weaponDropActions}>
                  <Pressable
                    style={[styles.weaponDropButton, styles.equipButton]}
                    onPress={handleEquipDrop}
                  >
                    <Text style={styles.weaponDropButtonText}>Equip</Text>
                  </Pressable>
                  {!isBagFull() && (
                    <Pressable
                      style={[styles.weaponDropButton, styles.bagButton]}
                      onPress={handleAddToBag}
                    >
                      <Text style={styles.weaponDropButtonText}>Add to Bag</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={[styles.weaponDropButton, styles.discardButton]}
                    onPress={handleVictory}
                  >
                    <Text style={styles.discardButtonText}>Discard</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.equippedText}>Equipped!</Text>
              )}
              </View>
            </DramaticReveal>
          )}

          <DramaticReveal delay={weaponDrop ? 1400 : 1100} duration={400}>
            <Pressable style={styles.continueButton} onPress={handleVictory}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </DramaticReveal>
        </ScrollView>

        {/* Weapon destroy confirmation modal */}
        {confirmDestroyWeapon && rewards?.weaponDrop && character?.equipment.weapon && (
          <View style={styles.destroyConfirmOverlay}>
            <View style={styles.destroyConfirmBox}>
              <Text style={styles.destroyConfirmTitle}>Destroy Current Weapon?</Text>
              <Text style={styles.destroyConfirmBody}>
                Your bag is full. Equipping{'\n'}
                <Text style={styles.destroyConfirmWeapon}>{rewards.weaponDrop.displayName}</Text>
                {'\n'}will permanently destroy{'\n'}
                <Text style={styles.destroyConfirmWeapon}>{character.equipment.weapon.displayName}</Text>.
              </Text>
              <View style={styles.destroyConfirmButtons}>
                <Pressable
                  style={[styles.destroyConfirmBtn, styles.destroyConfirmCancel]}
                  onPress={() => setConfirmDestroyWeapon(false)}
                >
                  <Text style={styles.destroyConfirmCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.destroyConfirmBtn, styles.destroyConfirmProceed]}
                  onPress={handleEquipDropConfirmed}
                >
                  <Text style={styles.destroyConfirmProceedText}>Destroy & Equip</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Defeat screen
  if (phase === 'defeat') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.defeatContainer}>
          <DramaticReveal delay={0} duration={800} direction="fade" haptic hapticStyle="heavy">
            <Text style={styles.defeatTitle}>FALLEN</Text>
          </DramaticReveal>

          <DramaticReveal delay={600} duration={600}>
            <Text style={styles.defeatText}>
              {monster.displayName} has claimed your life...
            </Text>
          </DramaticReveal>

          <DramaticReveal delay={1000} duration={500}>
            <Text style={styles.defeatHint}>
              Your journey ends here. The dungeon keeps what it takes.
            </Text>
          </DramaticReveal>

          <DramaticReveal delay={1600} duration={400}>
            <Pressable style={styles.defeatButton} onPress={handleDefeat}>
              <Text style={styles.defeatButtonText}>Accept Fate</Text>
            </Pressable>
          </DramaticReveal>
        </View>
      </SafeAreaView>
    );
  }


  // Combat interface
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Floating Damage Numbers */}
      <FloatingDamage popups={damagePopups} onComplete={removeDamagePopup} />

      {/* Screen Flash for Critical Hits */}
      <Animated.View
        style={[
          styles.screenFlash,
          { opacity: screenFlash }
        ]}
        pointerEvents="none"
      />

      {/* Compact Enemy Display */}
      <View style={styles.enemySectionCompact}>
        <MonsterDisplay
          monster={monster}
          effects={monsterEffects}
          observed={monsterObserved}
          isTakingDamage={monsterTakingDamage}
          intentVisible={phase === 'player_plan'}
          behaviorPattern={monster.base.behaviorPattern}
        />
      </View>

      {/* Turn Banner */}
      <View style={styles.kairosBanner}>
        <Text style={styles.kairosTitle}>Turn {turn}</Text>
        {initiativeMessage !== '' && (
          <Text style={styles.initiativeMsg}>{initiativeMessage}</Text>
        )}
        {combatDynamic.sequenceBonus > 0 && (
          <Text style={styles.flowBadge}>FLOW ×{combatDynamic.sequenceBonus}</Text>
        )}
        {combatDynamic.comboCount > 0 && (
          <Text style={styles.comboIndicator}>×{combatDynamic.comboCount} combo</Text>
        )}
        {combatDynamic.postDodgeCritActive && (
          <Text style={styles.comboIndicator}>⚡ Crit</Text>
        )}
        {phase === 'resolve_queue' && (
          <Text style={[styles.phaseTextMinimal, styles.phaseEnemy]}>Resolving...</Text>
        )}
      </View>

      {/* Action Economy Visualizer */}
      {resolvedTurnSequence.length > 0 && phase === 'resolve_queue' && (
        <TurnOrderTimeline sequence={resolvedTurnSequence} />
      )}

      {/* Narrative Combat Log - THE HERO */}
      <NarrativeLog
        entries={log}
        maxEntries={5}
        style={styles.narrativeLog}
      />

      {/* Compact Player Status */}
      <Animated.View
        style={[
          styles.playerStatusCompact,
          { transform: [{ translateX: shakeAnim }] }
        ]}
      >
        <View style={styles.playerBarsCompact}>
          <View style={styles.barRowCompact}>
            <Text style={styles.barLabelCompact}>HP</Text>
            <View style={styles.barContainerCompact}>
              <View
                style={[
                  styles.barFillCompact,
                  styles.hpFill,
                  { width: `${(character.currentHP / character.maxHP) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.barValueCompact}>
              {character.currentHP}/{character.maxHP}
            </Text>
          </View>
          <View style={styles.barRowCompact}>
            <Text style={styles.barLabelCompact}>SP</Text>
            <View style={styles.barContainerCompact}>
              <View
                style={[
                  styles.barFillCompact,
                  styles.spFill,
                  { width: `${(character.currentSP / character.maxSP) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.barValueCompact}>
              {character.currentSP}/{character.maxSP}
            </Text>
          </View>
        </View>

        {/* Status Effects - Compact */}
        {playerEffects.length > 0 && (
          <View style={styles.statusRowCompact}>
            {playerEffects.map((effect) => (
              <View
                key={effect.id}
                style={[
                  styles.statusBadgeCompact,
                  { backgroundColor: STATUS_EFFECT_COLORS[effect.type] + '30' },
                ]}
              >
                <Text style={styles.statusIconCompact}>{STATUS_EFFECT_ICONS[effect.type]}</Text>
                <Text style={[styles.statusDurationCompact, { color: STATUS_EFFECT_COLORS[effect.type] }]}>
                  {effect.duration > 0 ? effect.duration : '∞'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      {/* Action Staging Bar — always visible during planning */}
      {phase === 'player_plan' && (
        <View style={styles.stagedPanel}>
          <View style={styles.stagedRow}>
            {/* PRIMARY Slot */}
            <View style={[styles.stagedSlot, stagedPrimary ? styles.stagedSlotFilled : styles.stagedSlotEmpty]}>
              <Text style={styles.stagedSlotLabel}>ACTION</Text>
              {stagedPrimary
                ? <Text style={styles.stagedSlotValue}>{stagedPrimary.label}</Text>
                : <Text style={styles.stagedSlotPlaceholder}>— choose —</Text>}
            </View>
            {stagedPrimary && (
              <Pressable style={styles.cancelSlotBtn} onPress={cancelPrimary}>
                <Text style={styles.cancelBtnText}>✕</Text>
              </Pressable>
            )}

            {/* BONUS Slot */}
            <Animated.View style={[
              styles.stagedSlot,
              !bonusActionAvailable
                ? styles.stagedSlotGated
                : stagedBonus
                  ? styles.stagedSlotBonusFilled
                  : styles.stagedSlotBonusEmpty,
              (stagedPrimary && bonusActionAvailable && !stagedBonus) && { opacity: bonusPulse },
            ]}>
              <Text style={styles.stagedSlotLabel}>BONUS</Text>
              {stagedBonus
                ? <Text style={[styles.stagedSlotValue, styles.stagedSlotBonusValue]}>{stagedBonus.label}</Text>
                : bonusActionAvailable
                  ? <Text style={styles.stagedSlotPlaceholder}>— optional —</Text>
                  : <Text style={styles.stagedSlotPlaceholder}>too slow</Text>}
            </Animated.View>
            {stagedBonus && (
              <Pressable style={styles.cancelSlotBtn} onPress={cancelBonus}>
                <Text style={styles.cancelBtnText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Commit Button — 3 states */}
          <Pressable
            style={[
              styles.commitBtn,
              !stagedPrimary
                ? styles.commitBtnLocked
                : (stagedBonus || !bonusActionAvailable)
                  ? styles.commitBtnFull
                  : styles.commitBtnPartial,
            ]}
            onPress={handleInvokeKairos}
            disabled={!stagedPrimary}
          >
            <Text style={[styles.commitBtnText, !stagedPrimary && styles.commitBtnTextLocked]}>
              {!stagedPrimary
                ? 'CHOOSE AN ACTION'
                : (stagedBonus || !bonusActionAvailable)
                  ? 'COMMIT ▶'
                  : 'COMMIT · BONUS OPEN'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Kairos Action Panel — Two Rows */}
      <View style={styles.kairosActionPanel}>
        {/* PRIMARY Row */}
        <Text style={styles.slotLabel}>PRIMARY</Text>
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.kairosBtn, styles.attackBtn, (isActionDisabled || !!stagedPrimary) && styles.kairosBtnDisabled]}
            onPress={handleAttack}
            disabled={isActionDisabled || !!stagedPrimary}
          >
            <Text style={styles.kairosBtnText}>⚔ ATTACK</Text>
          </Pressable>
          <Pressable
            style={[styles.kairosBtn, styles.skillBtn2, (isActionDisabled || !!stagedPrimary) && styles.kairosBtnDisabled]}
            onPress={() => setSkillModalVisible(true)}
            disabled={isActionDisabled || !!stagedPrimary || !character?.skills?.length}
          >
            <Text style={styles.kairosBtnText}>✨ SKILL</Text>
            {character?.skills?.length ? <Text style={styles.kairosBadge}>{character.skills.length}</Text> : null}
          </Pressable>
          <Pressable
            style={[styles.kairosBtn, styles.itemBtn, (isActionDisabled || !!stagedPrimary || consumableItems.length === 0) && styles.kairosBtnDisabled]}
            onPress={() => { if (!isActionDisabled && !stagedPrimary && consumableItems.length > 0) setItemModalVisible(true); }}
            disabled={isActionDisabled || !!stagedPrimary || consumableItems.length === 0}
          >
            <Text style={styles.kairosBtnText}>🧪 ITEM</Text>
            {consumableItems.length > 0 && <Text style={styles.kairosBadge}>{consumableItems.length}</Text>}
          </Pressable>
          <Pressable
            style={[styles.kairosBtn, styles.chargeBtn, (isActionDisabled || !!stagedPrimary || combatDynamic.momentumStacks >= 3) && styles.kairosBtnDisabled]}
            onPress={handleCharge}
            disabled={isActionDisabled || !!stagedPrimary || combatDynamic.momentumStacks >= 3}
          >
            <Text style={styles.kairosBtnText}>⬆ CHARGE</Text>
            {combatDynamic.momentumStacks > 0 && <Text style={styles.kairosBadge}>×{combatDynamic.momentumStacks}</Text>}
          </Pressable>
          <Pressable
            style={[styles.kairosBtn, styles.fleeBtn, (isActionDisabled || !!stagedPrimary) && styles.kairosBtnDisabled]}
            onPress={handleFlee}
            disabled={isActionDisabled || !!stagedPrimary}
          >
            <Text style={[styles.kairosBtnText, styles.kairosBtnMuted]}>🏃 FLEE</Text>
          </Pressable>
        </View>

        {/* BONUS Row — always visible; handlers smart-route to primary if slot empty */}
        <Text style={[styles.slotLabel, !bonusActionAvailable && styles.slotLabelDim]}>
          BONUS {!bonusActionAvailable ? '— Primary Only' : ''}
        </Text>
        <View style={styles.actionRow}>
          {[
            { label: '🛡 DEFEND', onPress: handleDefend, disabled: isActionDisabled || (!!stagedPrimary && (!bonusActionAvailable || !!stagedBonus)) },
            { label: '⚡ Q.STRIKE', onPress: handleQuickStrike, disabled: isActionDisabled || (!!stagedPrimary && (!bonusActionAvailable || !!stagedBonus)) },
            { label: '👁 OBSERVE', onPress: handleObserve, disabled: isActionDisabled || monsterObserved || (!!stagedPrimary && (!bonusActionAvailable || !!stagedBonus)) },
            { label: '😤 TAUNT', onPress: handleTaunt, disabled: isActionDisabled || (!!stagedPrimary && (!bonusActionAvailable || !!stagedBonus)) },
            { label: '🧪 ITEM', onPress: () => setItemModalVisible(true), disabled: isActionDisabled || consumableItems.length === 0 || (!!stagedPrimary && (!bonusActionAvailable || !!stagedBonus)) },
          ].map(({ label, onPress, disabled }) => (
            <Pressable
              key={label}
              style={[styles.kairosBonusBtn, disabled && styles.kairosBtnDisabled]}
              onPress={onPress}
              disabled={disabled}
            >
              <Text style={[styles.kairosBonusBtnText, disabled && styles.kairosBtnMuted]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Item Selection Modal */}
      <Modal
        visible={itemModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setItemModalVisible(false)}
      >
        <Pressable
          style={styles.itemModalOverlay}
          onPress={() => setItemModalVisible(false)}
        >
          <Pressable
            style={styles.itemModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.itemModalHeader}>
              <Text style={styles.itemModalTitle}>Use Item</Text>
              <Pressable
                onPress={() => setItemModalVisible(false)}
                style={styles.itemModalClose}
              >
                <Text style={styles.itemModalCloseText}>✕</Text>
              </Pressable>
            </View>

            {consumableItems.length === 0 ? (
              <View style={styles.itemModalEmpty}>
                <Text style={styles.itemModalEmptyText}>No items available</Text>
              </View>
            ) : (
              <FlatList
                data={consumableItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.itemModalList}
                renderItem={({ item }) => {
                  const consumable = getConsumableById(item.id);
                  if (!consumable) return null;

                  return (
                    <Pressable
                      style={styles.itemCard}
                      onPress={() => handleUseItem(item.id)}
                    >
                      <View style={styles.itemCardHeader}>
                        <Text style={styles.itemIcon}>{consumable.icon || '🧪'}</Text>
                        <View style={styles.itemCardInfo}>
                          <Text
                            style={[
                              styles.itemName,
                              { color: CONSUMABLE_RARITY_COLORS[consumable.rarity] || Colors.text.primary },
                            ]}
                          >
                            {consumable.name}
                          </Text>
                          <Text style={styles.itemEffect}>
                            {formatConsumableEffect(consumable.effect)}
                          </Text>
                        </View>
                        <View style={styles.itemQuantityBadge}>
                          <Text style={styles.itemQuantityText}>x{item.quantity}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Skill Selection Modal */}
      <Modal
        visible={skillModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSkillModalVisible(false)}
      >
        <Pressable
          style={styles.itemModalOverlay}
          onPress={() => setSkillModalVisible(false)}
        >
          <Pressable
            style={styles.itemModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.itemModalHeader}>
              <Text style={styles.itemModalTitle}>Use Skill</Text>
              <Pressable
                onPress={() => setSkillModalVisible(false)}
                style={styles.itemModalClose}
              >
                <Text style={styles.itemModalCloseText}>✕</Text>
              </Pressable>
            </View>

            {!character?.skills || character.skills.length === 0 ? (
              <View style={styles.itemModalEmpty}>
                <Text style={styles.itemModalEmptyText}>No skills learned</Text>
              </View>
            ) : (
              <FlatList
                data={character.skills as unknown as LearnedSkill[]}
                keyExtractor={(skill) => skill.id}
                contentContainerStyle={styles.itemModalList}
                renderItem={({ item: skill }) => {
                  const check = canUseSkill(skill as LearnedSkill, character.currentSP);
                  const statValue = character.stats[skill.scalingStat].points;

                  return (
                    <Pressable
                      style={[
                        styles.skillCard,
                        !check.canUse && styles.skillCardDisabled,
                      ]}
                      onPress={() => check.canUse && handleUseSkill(skill as LearnedSkill)}
                      disabled={!check.canUse}
                    >
                      <View style={styles.skillCardHeader}>
                        <Text style={styles.skillIcon}>{skill.icon || '✨'}</Text>
                        <View style={styles.skillCardInfo}>
                          <Text
                            style={[
                              styles.skillName,
                              { color: SKILL_CATEGORY_COLORS[skill.category] || Colors.text.primary },
                            ]}
                          >
                            {skill.name}
                          </Text>
                          <Text style={styles.skillDesc}>
                            {formatSkillDescription(skill, statValue)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.skillCardFooter}>
                        <View style={styles.skillCostBadge}>
                          <Text style={styles.skillCostText}>{skill.spCost} SP</Text>
                        </View>
                        {skill.currentCooldown > 0 && (
                          <View style={styles.skillCooldownBadge}>
                            <Text style={styles.skillCooldownText}>CD: {skill.currentCooldown}</Text>
                          </View>
                        )}
                        <Text style={styles.skillStat}>{skill.scalingStat}</Text>
                      </View>
                      {!check.canUse && (
                        <Text style={styles.skillDisabledReason}>{check.reason}</Text>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Retreat Confirmation Modal */}
      <Modal
        visible={retreatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRetreatModalVisible(false)}
      >
        <Pressable
          style={styles.retreatModalOverlay}
          onPress={() => setRetreatModalVisible(false)}
        >
          <View style={styles.retreatModalContainer}>
            <Text style={styles.retreatModalTitle}>Retreat?</Text>
            <Text style={styles.retreatModalBody}>
              Attempting to flee carries risk. You may still take damage.
            </Text>
            <View style={styles.retreatModalButtons}>
              <Pressable
                style={styles.retreatFleeButton}
                onPress={() => {
                  setRetreatModalVisible(false);
                  playerFlee(getDerivedStats().speed, currentRun?.currentFloor ?? 1);
                }}
              >
                <Text style={styles.retreatFleeButtonText}>Attempt Escape</Text>
              </Pressable>
              <Pressable
                style={styles.retreatStayButton}
                onPress={() => setRetreatModalVisible(false)}
              >
                <Text style={styles.retreatStayButtonText}>Stay and Fight</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginBottom: Spacing.xl,
  },
  backButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  backButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.muted,
  },

  // Enemy section
  enemySection: {
    padding: Padding.screen.horizontal,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  monsterInfo: {
    marginBottom: Spacing.sm,
  },
  monsterName: {
    ...Typography.h4,
    color: Colors.ui.error,
    textAlign: 'center',
  },
  monsterCR: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
  },

  // HP bars
  hpBarContainer: {
    height: 24,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  hpBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.resource.hp,
    borderRadius: BorderRadius.sm,
  },
  enemyHpFill: {
    backgroundColor: Colors.ui.error,
  },
  spBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.resource.sp,
    borderRadius: BorderRadius.sm,
  },
  hpText: {
    ...Typography.caption,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Status effects
  statusEffectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusDuration: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },

  // Turn indicator
  turnIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.tertiary,
  },
  turnText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  phaseText: {
    ...Typography.label,
    color: Colors.text.accent,
    fontWeight: '600',
  },

  // Combat log
  logContainer: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
  },
  logContent: {
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  logEntry: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  logPlayerAction: {
    color: Colors.domain.life,
  },
  logEnemyAction: {
    color: Colors.ui.error,
  },
  logSystem: {
    color: Colors.text.accent,
    fontStyle: 'italic',
  },
  logStatus: {
    color: '#9B59B6', // Purple for status effects
  },
  logDamage: {
    color: Colors.ui.warning,
  },
  logHeal: {
    color: Colors.ui.success,
  },

  // Player section
  playerSection: {
    padding: Padding.screen.horizontal,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  playerName: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  playerLevel: {
    ...Typography.label,
    color: Colors.text.muted,
  },
  playerBars: {
    gap: Spacing.xs,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    width: 24,
    fontWeight: '600',
  },

  // Action buttons (legacy — kept for possible reuse)
  actionContainer: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  attackButton: {
    backgroundColor: Colors.ui.error,
  },
  defendButton: {
    backgroundColor: Colors.domain.wisdom,
  },
  observeButton: {
    backgroundColor: Colors.domain.wisdom,
  },
  tauntButton: {
    backgroundColor: Colors.domain.authority,
  },
  itemButton: {
    backgroundColor: Colors.domain.fortune,
  },
  skillButton: {
    backgroundColor: Colors.domain.magic,
    flex: 2,
  },
  secondaryButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.inverse,
  },
  fleeButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  fleeButtonText: {
    ...Typography.button,
    color: Colors.text.muted,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionUsed: {
    opacity: 0.6,
    backgroundColor: Colors.background.tertiary,
  },

  // Victory screen - Ceremonial
  victoryContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing['2xl'],
  },
  victoryTitle: {
    fontSize: 42,
    fontWeight: '200',
    color: Colors.ui.success,
    letterSpacing: 12,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  victoryMonster: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  rewardsContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.xl,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  rewardsTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  rewardLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  rewardValue: {
    ...Typography.body,
    color: Colors.domain.life,
    fontWeight: '600',
  },
  rewardGold: {
    ...Typography.body,
    color: Colors.resource.gold,
    fontWeight: '600',
  },

  // Material drops
  materialDropsSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  materialDropsTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  materialDropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  materialIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  materialName: {
    ...Typography.body,
    flex: 1,
  },
  materialQuantity: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  materialValue: {
    ...Typography.caption,
    color: Colors.text.muted,
    width: 50,
    textAlign: 'right',
  },

  continueButton: {
    backgroundColor: Colors.ui.success,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.md,
  },
  continueButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },

  // Defeat screen - Solemn
  defeatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background.primary,
  },
  defeatTitle: {
    fontSize: 48,
    fontWeight: '100',
    color: Colors.ui.error,
    letterSpacing: 16,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  defeatText: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 28,
  },
  defeatHint: {
    ...Typography.body,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginBottom: Spacing['2xl'],
    textAlign: 'center',
    lineHeight: 24,
  },
  defeatButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.error + '40',
  },
  defeatButtonText: {
    ...Typography.button,
    color: Colors.ui.error,
    letterSpacing: 2,
  },

  // Weapon drop styles
  weaponDropContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.xl,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.resource.gold,
  },
  weaponDropTitle: {
    ...Typography.h5,
    color: Colors.resource.gold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  weaponDropName: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  weaponDropStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  weaponDropStat: {
    ...Typography.caption,
    color: Colors.text.secondary,
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  comparisonContainer: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  comparisonTitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  comparisonStat: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  bagFullWarning: {
    backgroundColor: Colors.ui.error + '20',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.error + '60',
  },
  bagFullWarningText: {
    ...Typography.caption,
    color: Colors.ui.error,
    textAlign: 'center',
    fontWeight: '600',
  },
  weaponDropActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  weaponDropButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  weaponDropButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  equipButton: {
    backgroundColor: Colors.ui.success,
  },
  bagButton: {
    backgroundColor: Colors.domain.wisdom,
  },
  discardButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  discardButtonText: {
    ...Typography.button,
    color: Colors.text.muted,
  },
  equippedText: {
    ...Typography.button,
    color: Colors.ui.success,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Item Modal
  itemModalOverlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'flex-end',
  },
  itemModalContent: {
    backgroundColor: Colors.background.tertiary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    borderTopWidth: BorderWidth.thin,
    borderLeftWidth: BorderWidth.thin,
    borderRightWidth: BorderWidth.thin,
    borderColor: Colors.border.secondary,
    maxHeight: '60%',
    paddingBottom: Spacing.xl,
  },
  itemModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  itemModalTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  itemModalClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemModalCloseText: {
    color: Colors.text.muted,
    fontSize: 18,
  },
  itemModalList: {
    padding: Padding.screen.horizontal,
    gap: Spacing.sm,
  },
  itemModalEmpty: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  itemModalEmptyText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  itemCard: {
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.secondary,
  },
  itemCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  itemIcon: {
    fontSize: 28,
  },
  itemCardInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.h6,
    marginBottom: 3,
  },
  itemEffect: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontSize: 13,
  },
  itemQuantityBadge: {
    backgroundColor: Colors.border.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minWidth: 28,
    alignItems: 'center',
  },
  itemQuantityText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '700',
  },

  // Skill Card styles
  skillCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    marginBottom: Spacing.sm,
  },
  skillCardDisabled: {
    opacity: 0.5,
  },
  skillCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  skillIcon: {
    fontSize: 28,
  },
  skillCardInfo: {
    flex: 1,
  },
  skillName: {
    ...Typography.h6,
    marginBottom: 2,
  },
  skillDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  skillCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  skillCostBadge: {
    backgroundColor: Colors.resource.sp + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  skillCostText: {
    ...Typography.caption,
    color: Colors.resource.sp,
    fontWeight: '600',
  },
  skillCooldownBadge: {
    backgroundColor: Colors.ui.warning + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  skillCooldownText: {
    ...Typography.caption,
    color: Colors.ui.warning,
    fontWeight: '600',
  },
  skillStat: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginLeft: 'auto',
  },
  skillDisabledReason: {
    ...Typography.caption,
    color: Colors.ui.error,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },

  // Screen flash overlay
  screenFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.resource.gold,
    zIndex: 999,
  },

  // ===== NEW TEXT-FORWARD COMPACT STYLES =====

  // Compact Enemy Section
  enemySectionCompact: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },

  // Kairos Banner (replaces turnIndicatorMinimal)
  kairosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
    paddingHorizontal: Padding.screen.horizontal,
    flexWrap: 'wrap',
  },
  kairosTitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  kairosSwift: {
    ...Typography.caption,
    fontSize: 10,
    color: '#00BFFF', // teal/swift blue
    fontWeight: '700',
    letterSpacing: 1,
  },
  flowBadge: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.resource.gold,
    fontWeight: '700',
    backgroundColor: Colors.resource.gold + '20',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  phaseTextMinimal: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  comboIndicator: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.resource.gold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  initiativeMsg: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.domain.authority,
    fontWeight: '700',
  },
  phasePlayer: {
    color: Colors.domain.life,
  },
  phaseEnemy: {
    color: Colors.ui.error,
  },

  // Action staging bar
  stagedPanel: {
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  stagedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stagedSlot: {
    flex: 1,
    minWidth: 70,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  // PRIMARY slot states
  stagedSlotEmpty: {
    borderStyle: 'dashed',
    borderColor: Colors.domain.authority + '80',
    backgroundColor: 'transparent',
  },
  stagedSlotFilled: {
    borderStyle: 'solid',
    borderColor: Colors.domain.authority,
    backgroundColor: Colors.domain.authority + '18',
  },
  // BONUS slot states
  stagedSlotBonusEmpty: {
    borderStyle: 'dashed',
    borderColor: '#00BFFF80',
    backgroundColor: 'transparent',
  },
  stagedSlotBonusFilled: {
    borderStyle: 'solid',
    borderColor: '#00BFFF',
    backgroundColor: '#00BFFF14',
  },
  stagedSlotGated: {
    borderStyle: 'solid',
    borderColor: Colors.border.primary,
    backgroundColor: 'transparent',
    opacity: 0.4,
  },
  stagedSlotLabel: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stagedSlotValue: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.domain.authority,
    fontWeight: '700',
  },
  stagedSlotBonusValue: {
    color: '#00BFFF',
  },
  stagedSlotPlaceholder: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  cancelSlotBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.text.muted,
    borderRadius: BorderRadius.sm,
    alignSelf: 'center',
  },
  cancelBtnText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 11,
  },
  // Commit button — 3 states
  commitBtn: {
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  commitBtnLocked: {
    backgroundColor: Colors.background.tertiary,
    opacity: 0.5,
  },
  commitBtnPartial: {
    backgroundColor: Colors.domain.authority,
  },
  commitBtnFull: {
    backgroundColor: Colors.resource.gold,
  },
  commitBtnText: {
    ...Typography.button,
    color: Colors.background.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  commitBtnTextLocked: {
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },
  // kept for backward compat (unused after J4 rename)
  invokeKairosBtn: {
    backgroundColor: Colors.resource.gold,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  invokeKairosBtnText: {
    ...Typography.button,
    color: Colors.background.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  stagedBonusHint: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },

  // Narrative Log Container
  narrativeLog: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Compact Player Status
  playerStatusCompact: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  playerBarsCompact: {
    gap: 6,
  },
  barRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabelCompact: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
    width: 20,
    fontWeight: '600',
  },
  barContainerCompact: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFillCompact: {
    height: '100%',
    borderRadius: 4,
  },
  hpFill: {
    backgroundColor: Colors.resource.hp,
  },
  spFill: {
    backgroundColor: Colors.resource.sp,
  },
  barValueCompact: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.secondary,
    width: 50,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  statusRowCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: Spacing.xs,
  },
  statusBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  statusIconCompact: {
    fontSize: 10,
  },
  statusDurationCompact: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '600',
  },

  // Kairos Two-Row Action Panel
  kairosActionPanel: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.secondary,
    gap: Spacing.xs,
  },
  slotLabel: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.text.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  slotLabelDim: {
    color: Colors.text.muted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 4,
  },
  // Primary action buttons
  kairosBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kairosBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.inverse,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  kairosBtnMuted: {
    color: Colors.text.secondary,
  },
  kairosBtnDisabled: {
    opacity: 0.4,
  },
  kairosBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 9,
    color: Colors.resource.gold,
    fontWeight: '700',
  },
  attackBtn: {
    backgroundColor: Colors.ui.error,
  },
  skillBtn2: {
    backgroundColor: Colors.domain.magic,
  },
  chargeBtn: {
    backgroundColor: Colors.domain.knowledge,
  },
  fleeBtn: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  itemBtn: {
    backgroundColor: Colors.resource.gold + '22',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold,
  },
  // Bonus action buttons (smaller)
  kairosBonusBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  kairosBonusBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  destroyConfirmOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  destroyConfirmBox: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xl,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.ui.error + '80',
    gap: Spacing.md,
  },
  destroyConfirmTitle: {
    ...Typography.h5,
    color: Colors.ui.error,
    textAlign: 'center',
  },
  destroyConfirmBody: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  destroyConfirmWeapon: {
    color: Colors.resource.gold,
    fontWeight: '700',
  },
  destroyConfirmButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  destroyConfirmBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  destroyConfirmCancel: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  destroyConfirmCancelText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  destroyConfirmProceed: {
    backgroundColor: Colors.ui.error + '30',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.error + '80',
  },
  destroyConfirmProceedText: {
    ...Typography.bodySmall,
    color: Colors.ui.error,
    fontWeight: '700',
  },

  // Retreat Confirmation Modal
  retreatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  retreatModalContainer: {
    backgroundColor: '#1E1214',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#C84832',
  },
  retreatModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8D8C0',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
  },
  retreatModalBody: {
    fontSize: 13,
    color: '#A08870',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  retreatModalButtons: {
    gap: 10,
  },
  retreatFleeButton: {
    backgroundColor: '#C84832',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  retreatFleeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8D8C0',
    letterSpacing: 1,
  },
  retreatStayButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3D2020',
  },
  retreatStayButtonText: {
    fontSize: 13,
    color: '#A08870',
    letterSpacing: 1,
  },
});
