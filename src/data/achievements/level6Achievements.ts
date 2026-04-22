/**
 * Level 6→7 Achievements
 * Floor range: 15-20, advanced challenges with deity challenges
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_6_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l6_deep_tower',
    name: 'Deep Tower',
    description: 'Reach Floor 16 of the tower.',
    tier: 'standard',
    targetLevel: 7,
    requirements: [
      { type: 'floor_reach', value: 16, description: 'Reach Floor 16' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The darkness grows thicker.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l6_mass_slayer',
    name: 'Mass Slayer',
    description: 'Defeat 150 monsters total.',
    tier: 'standard',
    targetLevel: 7,
    requirements: [
      { type: 'kill_count', value: 150, description: 'Defeat 150 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The blade remembers every strike.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l6_fortune',
    name: 'Fortune',
    description: 'Accumulate 3500 gold.',
    tier: 'standard',
    targetLevel: 7,
    requirements: [
      { type: 'gold_earn', value: 3500, description: 'Earn 3500 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Fortune favors the bold.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l6_boss_count',
    name: 'Boss Counter',
    description: 'Defeat 8 boss monsters total.',
    tier: 'standard',
    targetLevel: 7,
    requirements: [
      { type: 'boss_kill', value: 8, description: 'Defeat 8 bosses' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'A collection of trophies.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l6_blessed_status',
    name: 'Divinely Blessed',
    description: 'Reach "Blessed" status with your patron deity.',
    tier: 'challenging',
    targetLevel: 7,
    requirements: [
      { type: 'reputation', value: 75, description: 'Reach Blessed status (75+ favor)' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 8,
    hint: 'The divine light shines upon you.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'authority',
  },
  {
    id: 'l6_stat_c_multiple',
    name: 'Growing Excellence',
    description: 'Reach Grade C in 3 different stats.',
    tier: 'challenging',
    targetLevel: 7,
    requirements: [
      { type: 'stat_reach', value: 5, description: 'Grade C in 3 stats' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    hint: 'Excellence spreads like fire.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'wisdom',
  },
  {
    id: 'l6_damage_massive',
    name: 'Devastation',
    description: 'Deal 10000 total damage.',
    tier: 'challenging',
    targetLevel: 7,
    requirements: [
      { type: 'damage_dealt', value: 10000, description: 'Deal 10000 damage' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Destruction incarnate.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'war',
  },

  // ===== HEROIC TIER =====
  {
    id: 'l6_floor_20',
    name: 'Twentieth Floor',
    description: 'Reach Floor 20.',
    tier: 'heroic',
    targetLevel: 7,
    requirements: [
      { type: 'floor_reach', value: 20, description: 'Reach Floor 20' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 10,
    hint: 'The twentieth floor is a legend unto itself.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Depths Walker',
  },
  {
    id: 'l6_elite_hunter_master',
    name: 'Elite Master',
    description: 'Defeat 20 elite monsters total.',
    tier: 'heroic',
    targetLevel: 7,
    requirements: [
      { type: 'elite_kill', value: 20, description: 'Defeat 20 elites' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'The hunter becomes the master.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l6_stat_b_any',
    name: 'Superior Stat',
    description: 'Reach Grade B in any stat.',
    tier: 'legendary',
    targetLevel: 7,
    requirements: [
      { type: 'stat_reach', value: 6, description: 'Reach Grade B' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 12,
    hint: 'Superiority is earned, not given.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Superior',
    domain: 'wisdom',
  },
  {
    id: 'l6_no_rest_deep',
    name: 'Ironman Descent',
    description: 'Clear Floors 10-15 without using rest sites.',
    tier: 'legendary',
    targetLevel: 7,
    requirements: [
      { type: 'floor_reach', value: 16, description: 'Clear through Floor 15' },
      { type: 'custom', value: 0, description: 'No rest sites on 10-15' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    discoveryRepRequired: 11,
    hint: 'Iron will knows no fatigue.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'Ironwilled',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l6_perfect_boss_streak',
    name: 'Perfect Boss Streak',
    description: 'Defeat 3 consecutive bosses without taking damage from any.',
    tier: 'mythic',
    targetLevel: 7,
    requirements: [
      { type: 'boss_kill', value: 3, description: 'Defeat 3 bosses' },
      { type: 'damage_taken', value: 0, comparison: 'eq', description: 'Take 0 boss damage' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'Perfection is a pattern, not an accident.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Immaculate',
  },
];

export function getLevel6AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_6_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel6AchievementById(id: string): Achievement | undefined {
  return LEVEL_6_ACHIEVEMENTS.find(a => a.id === id);
}
