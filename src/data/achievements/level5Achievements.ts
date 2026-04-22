/**
 * Level 5→6 Achievements
 * Floor range: 10-15, mid-game challenge tier with deity involvement
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_5_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l5_mid_tower',
    name: 'Mid Tower',
    description: 'Reach Floor 12 of the tower.',
    tier: 'standard',
    targetLevel: 6,
    requirements: [
      { type: 'floor_reach', value: 12, description: 'Reach Floor 12' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The tower\'s heart awaits.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l5_centurion',
    name: 'Centurion',
    description: 'Defeat 100 monsters total.',
    tier: 'standard',
    targetLevel: 6,
    requirements: [
      { type: 'kill_count', value: 100, description: 'Defeat 100 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'A hundred souls mark the warrior.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l5_affluent',
    name: 'Affluent',
    description: 'Accumulate 2000 gold.',
    tier: 'standard',
    targetLevel: 6,
    requirements: [
      { type: 'gold_earn', value: 2000, description: 'Earn 2000 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Wealth opens doors.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l5_elite_count',
    name: 'Elite Count',
    description: 'Defeat 10 elite monsters total.',
    tier: 'standard',
    targetLevel: 6,
    requirements: [
      { type: 'elite_kill', value: 10, description: 'Defeat 10 elites' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The strong hunt the strong.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l5_deity_favored',
    name: 'Deity Favored',
    description: 'Reach "Favored" status with your patron deity.',
    tier: 'challenging',
    targetLevel: 6,
    requirements: [
      { type: 'reputation', value: 60, description: 'Reach Favored status (60+ favor)' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 6,
    hint: 'The gods smile upon the devoted.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'authority',
  },
  {
    id: 'l5_skill_specialist',
    name: 'Skill Specialist',
    description: 'Use skills 50 times in combat.',
    tier: 'challenging',
    targetLevel: 6,
    requirements: [
      { type: 'skill_use', value: 50, description: 'Use skills 50 times' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    hint: 'Mastery comes through repetition.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'magic',
  },
  {
    id: 'l5_damage_milestone',
    name: 'Destruction',
    description: 'Deal 5000 total damage.',
    tier: 'challenging',
    targetLevel: 6,
    requirements: [
      { type: 'damage_dealt', value: 5000, description: 'Deal 5000 damage' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Devastation speaks.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'war',
  },

  // ===== HEROIC TIER =====
  {
    id: 'l5_floor_15',
    name: 'Deep Delver',
    description: 'Reach Floor 15.',
    tier: 'heroic',
    targetLevel: 6,
    requirements: [
      { type: 'floor_reach', value: 15, description: 'Reach Floor 15' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 8,
    hint: 'Few have ventured so deep.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Deep',
  },
  {
    id: 'l5_boss_chain',
    name: 'Boss Chain',
    description: 'Defeat 3 bosses in a single run.',
    tier: 'heroic',
    targetLevel: 6,
    requirements: [
      { type: 'boss_kill', value: 3, description: 'Defeat 3 bosses in one run' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'A chain of triumphs.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l5_all_stats_d',
    name: 'Balanced Warrior',
    description: 'Reach Grade D in all 8 stats.',
    tier: 'legendary',
    targetLevel: 6,
    requirements: [
      { type: 'stat_reach', value: 4, description: 'All stats at Grade D' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 10,
    hint: 'True power knows no weakness.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Balanced',
    domain: 'wisdom',
  },
  {
    id: 'l5_stealth_master',
    name: 'Stealth Master',
    description: 'Achieve 20 stealth kills.',
    tier: 'legendary',
    targetLevel: 6,
    requirements: [
      { type: 'stealth_kills', value: 20, description: 'Achieve 20 stealth kills' },
    ],
    requireAll: true,
    discoverySource: 'library',
    discoveryRepRequired: 9,
    hint: 'Unseen, unheard, unstoppable.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Shadow',
    domain: 'trickery',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l5_no_damage_boss',
    name: 'Untouchable Champion',
    description: 'Defeat 2 bosses without taking any damage from them.',
    tier: 'mythic',
    targetLevel: 6,
    requirements: [
      { type: 'boss_kill', value: 2, description: 'Defeat 2 bosses' },
      { type: 'damage_taken', value: 0, comparison: 'eq', description: 'Take 0 boss damage' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'The greatest warriors make battles look effortless.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Invincible',
  },
];

export function getLevel5AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_5_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel5AchievementById(id: string): Achievement | undefined {
  return LEVEL_5_ACHIEVEMENTS.find(a => a.id === id);
}
