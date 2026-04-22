/**
 * Starter skills for Kohrvellia
 * Basic skills available from character creation
 */

import type { CombatSkill, LearnedSkill } from '../../types/Skill';
import { createLearnedSkill } from '../../types/Skill';

// ===== PHYSICAL SKILLS =====

export const POWER_STRIKE: CombatSkill = {
  id: 'power_strike',
  name: 'Power Strike',
  description: 'A powerful melee attack. Deals {damage} physical damage.',
  spCost: 10,
  cooldown: 0,
  category: 'physical',
  scalingStat: 'STR',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 15,
      scaling: 0.8,
      damageType: 'physical',
    },
  ],
  icon: '💥',
  color: '#EF4444',
  animation: 'slash',
  learnMethod: 'starter',
};

export const QUICK_SLASH: CombatSkill = {
  id: 'quick_slash',
  name: 'Quick Slash',
  description: 'Two rapid strikes. Deals {damage} physical damage per hit.',
  spCost: 8,
  cooldown: 1,
  category: 'physical',
  scalingStat: 'AGI',
  effects: [
    {
      type: 'damage_multi',
      target: 'enemy',
      value: 8,
      scaling: 0.4,
      hits: 2,
      damageType: 'physical',
    },
  ],
  icon: '⚡',
  color: '#FACC15',
  animation: 'slash',
  learnMethod: 'starter',
};

export const SHIELD_BASH: CombatSkill = {
  id: 'shield_bash',
  name: 'Shield Bash',
  description: 'Bash enemy with shield. Deals {damage} damage with 30% stun chance.',
  spCost: 12,
  cooldown: 2,
  category: 'physical',
  scalingStat: 'END',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 10,
      scaling: 0.5,
      damageType: 'physical',
      statusEffect: 'stun',
      statusDuration: 1,
      statusChance: 30,
    },
  ],
  icon: '🛡️',
  color: '#64748B',
  animation: 'thrust',
  learnMethod: 'starter',
};

// ===== MAGIC SKILLS =====

export const FIREBALL: CombatSkill = {
  id: 'fireball',
  name: 'Fireball',
  description: 'Hurl a ball of fire. Deals {damage} fire damage with burn chance.',
  spCost: 15,
  cooldown: 1,
  category: 'magic',
  scalingStat: 'INT',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 18,
      scaling: 0.9,
      damageType: 'fire',
      statusEffect: 'burn',
      statusDuration: 3,
      statusChance: 25,
    },
  ],
  icon: '🔥',
  color: '#F97316',
  animation: 'magic',
  learnMethod: 'starter',
};

export const ICE_SHARD: CombatSkill = {
  id: 'ice_shard',
  name: 'Ice Shard',
  description: 'Launch a frozen shard. Deals {damage} ice damage with slow chance.',
  spCost: 12,
  cooldown: 0,
  category: 'magic',
  scalingStat: 'INT',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 12,
      scaling: 0.7,
      damageType: 'ice',
      statusEffect: 'freeze',
      statusDuration: 1,
      statusChance: 15,
    },
  ],
  icon: '❄️',
  color: '#06B6D4',
  animation: 'magic',
  learnMethod: 'starter',
};

export const LIGHTNING_BOLT: CombatSkill = {
  id: 'lightning_bolt',
  name: 'Lightning Bolt',
  description: 'Strike with lightning. Deals {damage} lightning damage with stun chance.',
  spCost: 18,
  cooldown: 2,
  category: 'magic',
  scalingStat: 'INT',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 22,
      scaling: 1.0,
      damageType: 'lightning',
      statusEffect: 'stun',
      statusDuration: 1,
      statusChance: 20,
    },
  ],
  icon: '⚡',
  color: '#EAB308',
  animation: 'magic',
  learnMethod: 'starter',
};

// ===== SUPPORT SKILLS =====

export const HEAL: CombatSkill = {
  id: 'heal',
  name: 'Heal',
  description: 'Restore {heal} HP to yourself.',
  spCost: 20,
  cooldown: 2,
  category: 'support',
  scalingStat: 'WIS',
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 25,
      scaling: 0.8,
    },
  ],
  icon: '💚',
  color: '#10B981',
  animation: 'heal',
  learnMethod: 'starter',
};

export const FORTIFY: CombatSkill = {
  id: 'fortify',
  name: 'Fortify',
  description: 'Harden your defenses. Gain a shield that absorbs {heal} damage.',
  spCost: 15,
  cooldown: 3,
  category: 'support',
  scalingStat: 'END',
  effects: [
    {
      type: 'shield',
      target: 'self',
      value: 20,
      scaling: 0.6,
    },
  ],
  icon: '🛡️',
  color: '#3B82F6',
  animation: 'buff',
  learnMethod: 'starter',
};

export const CLEANSE: CombatSkill = {
  id: 'cleanse',
  name: 'Cleanse',
  description: 'Remove all negative status effects from yourself.',
  spCost: 18,
  cooldown: 4,
  category: 'support',
  scalingStat: 'WIS',
  effects: [
    {
      type: 'cleanse',
      target: 'self',
      value: 0,
      scaling: 0,
    },
  ],
  icon: '✨',
  color: '#F0ABFC',
  animation: 'buff',
  learnMethod: 'starter',
};

// ===== CHA/SOCIAL SKILLS =====

export const INTIMIDATE: CombatSkill = {
  id: 'intimidate',
  name: 'Intimidate',
  description: 'Frighten the enemy. Reduces their attack and accuracy for 3 turns.',
  spCost: 12,
  cooldown: 3,
  category: 'support',
  scalingStat: 'CHA',
  effects: [
    {
      type: 'debuff',
      target: 'enemy',
      value: 0,
      scaling: 0,
      statusEffect: 'weaken',
      statusDuration: 3,
      statusChance: 100,
    },
  ],
  icon: '😠',
  color: '#DC2626',
  animation: 'buff',
  learnMethod: 'starter',
};

// ===== LCK SKILLS =====

export const LUCKY_STRIKE: CombatSkill = {
  id: 'lucky_strike',
  name: 'Lucky Strike',
  description: 'A gamble. Deals {damage} damage with high crit chance.',
  spCost: 10,
  cooldown: 1,
  category: 'physical',
  scalingStat: 'LCK',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 10,
      scaling: 0.6,
      damageType: 'physical',
    },
  ],
  icon: '🎲',
  color: '#F59E0B',
  animation: 'slash',
  learnMethod: 'starter',
};

// ===== PER SKILLS =====

export const PRECISE_SHOT: CombatSkill = {
  id: 'precise_shot',
  name: 'Precise Shot',
  description: 'A carefully aimed attack. Deals {damage} damage with high accuracy.',
  spCost: 8,
  cooldown: 0,
  category: 'physical',
  scalingStat: 'PER',
  effects: [
    {
      type: 'damage',
      target: 'enemy',
      value: 12,
      scaling: 0.7,
      damageType: 'physical',
    },
  ],
  icon: '🎯',
  color: '#06B6D4',
  animation: 'thrust',
  learnMethod: 'starter',
};

// ===== ALL STARTER SKILLS =====

export const ALL_STARTER_SKILLS: CombatSkill[] = [
  // Physical
  POWER_STRIKE,
  QUICK_SLASH,
  SHIELD_BASH,
  // Magic
  FIREBALL,
  ICE_SHARD,
  LIGHTNING_BOLT,
  // Support
  HEAL,
  FORTIFY,
  CLEANSE,
  // Social
  INTIMIDATE,
  // Luck
  LUCKY_STRIKE,
  // Perception
  PRECISE_SHOT,
];

// ===== SKILL SELECTION BY STAT =====

/**
 * Get recommended starter skills based on character's highest stats
 */
export function getRecommendedSkills(
  stats: Record<string, { points: number }>
): CombatSkill[] {
  // Sort stats by points
  const sortedStats = Object.entries(stats)
    .sort(([, a], [, b]) => b.points - a.points)
    .map(([stat]) => stat);

  const skills: CombatSkill[] = [];

  // Add skill for top 3 stats
  for (const stat of sortedStats.slice(0, 3)) {
    const skillForStat = ALL_STARTER_SKILLS.find(
      (s) => s.scalingStat === stat && !skills.some((sk) => sk.id === s.id)
    );
    if (skillForStat) {
      skills.push(skillForStat);
    }
  }

  // Always include Heal if not already included
  if (!skills.some((s) => s.id === 'heal')) {
    skills.push(HEAL);
  }

  return skills.slice(0, 4); // Max 4 starter skills
}

/**
 * Get skill by ID
 */
export function getSkillById(skillId: string): CombatSkill | undefined {
  return ALL_STARTER_SKILLS.find((s) => s.id === skillId);
}

/**
 * Create learned versions of skills
 */
export function createStarterSkills(skillIds: string[]): LearnedSkill[] {
  return skillIds
    .map((id) => getSkillById(id))
    .filter((s): s is CombatSkill => s !== undefined)
    .map(createLearnedSkill);
}
