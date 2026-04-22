/**
 * Extended Skill types for Kohrvellia
 * Defines combat skills with effects, targeting, and animations
 */

import type { StatName } from './Stats';
import type { StatusEffectType } from './StatusEffect';

// Skill effect types
export type SkillEffectType =
  | 'damage'           // Deal damage
  | 'damage_multi'     // Multiple hits
  | 'damage_percent'   // Damage based on target's HP %
  | 'heal'             // Heal HP
  | 'heal_percent'     // Heal % of max HP
  | 'buff'             // Apply positive status
  | 'debuff'           // Apply negative status to enemy
  | 'cleanse'          // Remove negative status from self
  | 'drain'            // Deal damage and heal
  | 'shield'           // Temporary HP shield
  | 'flee';            // Guaranteed escape

// Skill targeting
export type SkillTarget =
  | 'self'
  | 'enemy'
  | 'all_enemies'
  | 'ally'
  | 'all_allies'
  | 'random_enemy';

// Damage type
export type SkillDamageType =
  | 'physical'
  | 'magic'
  | 'fire'
  | 'ice'
  | 'lightning'
  | 'holy'
  | 'dark'
  | 'true';  // Ignores defense

// Single effect within a skill
export interface SkillEffect {
  type: SkillEffectType;
  target: SkillTarget;
  value: number;                    // Base value (damage, heal amount)
  scaling: number;                  // % of stat added to value (0.5 = 50%)
  hits?: number;                    // For multi-hit skills
  damageType?: SkillDamageType;
  statusEffect?: StatusEffectType;  // For buff/debuff effects
  statusDuration?: number;          // Turns
  statusChance?: number;            // 0-100 probability
}

// Full skill definition (extends base Skill)
export interface CombatSkill {
  id: string;
  name: string;
  description: string;

  // Cost and cooldown
  spCost: number;
  cooldown: number;       // Turns before can use again

  // Category and requirements
  category: 'physical' | 'magic' | 'support' | 'passive';
  scalingStat: StatName;
  requiredStat?: { stat: StatName; min: number };

  // Effects (can have multiple)
  effects: SkillEffect[];

  // Visual/audio
  icon?: string;
  color?: string;
  animation?: 'slash' | 'thrust' | 'magic' | 'heal' | 'buff' | 'area';

  // Learning
  learnMethod: 'starter' | 'levelup' | 'quest' | 'observe' | 'deity';
  observeChance?: number; // % chance to learn when observed
}

// Runtime skill state (on character)
export interface LearnedSkill extends CombatSkill {
  currentCooldown: number;
  proficiency: number;     // 0-100, increases with use
  timesUsed: number;
}

// ===== SKILL CONSTANTS =====

export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  physical: '#EF4444',  // Red
  magic: '#8B5CF6',     // Purple
  support: '#10B981',   // Green
  passive: '#6B7280',   // Gray
};

export const SKILL_DAMAGE_TYPE_ICONS: Record<SkillDamageType, string> = {
  physical: '⚔️',
  magic: '✨',
  fire: '🔥',
  ice: '❄️',
  lightning: '⚡',
  holy: '✝️',
  dark: '🌑',
  true: '💀',
};

// ===== UTILITY FUNCTIONS =====

/**
 * Calculate skill damage with scaling
 */
export function calculateSkillDamage(
  _skill: CombatSkill,
  effect: SkillEffect,
  statValue: number,
  targetDefense: number = 0
): number {
  // Base damage + scaling
  const baseDamage = effect.value + Math.floor(statValue * effect.scaling);

  // Apply defense reduction (true damage ignores defense)
  const defenseReduction = effect.damageType === 'true' ? 0 : targetDefense * 0.3;
  const finalDamage = Math.max(1, baseDamage - defenseReduction);

  return finalDamage;
}

/**
 * Check if skill can be used
 */
export function canUseSkill(
  skill: LearnedSkill,
  currentSP: number
): { canUse: boolean; reason?: string } {
  if (skill.currentCooldown > 0) {
    return { canUse: false, reason: `On cooldown (${skill.currentCooldown} turns)` };
  }

  if (currentSP < skill.spCost) {
    return { canUse: false, reason: `Not enough SP (need ${skill.spCost})` };
  }

  return { canUse: true };
}

/**
 * Format skill description with actual values
 */
export function formatSkillDescription(
  skill: CombatSkill,
  statValue: number
): string {
  let desc = skill.description;

  // Replace {damage} placeholder with calculated value
  for (const effect of skill.effects) {
    if (effect.type === 'damage' || effect.type === 'damage_multi') {
      const damage = effect.value + Math.floor(statValue * effect.scaling);
      const hitText = effect.hits && effect.hits > 1 ? ` x${effect.hits}` : '';
      desc = desc.replace('{damage}', `${damage}${hitText}`);
    }
    if (effect.type === 'heal' || effect.type === 'heal_percent') {
      const heal = effect.value + Math.floor(statValue * effect.scaling);
      desc = desc.replace('{heal}', `${heal}`);
    }
  }

  return desc;
}

/**
 * Create a learned skill from a combat skill definition
 */
export function createLearnedSkill(skill: CombatSkill): LearnedSkill {
  return {
    ...skill,
    currentCooldown: 0,
    proficiency: 0,
    timesUsed: 0,
  };
}

/**
 * Tick cooldowns (call at start of turn)
 */
export function tickSkillCooldowns(skills: LearnedSkill[]): LearnedSkill[] {
  return skills.map((skill) => ({
    ...skill,
    currentCooldown: Math.max(0, skill.currentCooldown - 1),
  }));
}
