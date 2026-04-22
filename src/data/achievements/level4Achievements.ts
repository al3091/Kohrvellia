/**
 * Level 4→5 Achievements
 * Floor range: 7-10, mid-game milestone with stat requirements
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_4_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l4_depths_reached',
    name: 'Into the Depths',
    description: 'Reach Floor 8 of the tower.',
    tier: 'standard',
    targetLevel: 5,
    requirements: [
      { type: 'floor_reach', value: 8, description: 'Reach Floor 8' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Few venture this deep.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l4_veteran_slayer',
    name: 'Veteran Slayer',
    description: 'Defeat 50 monsters total.',
    tier: 'standard',
    targetLevel: 5,
    requirements: [
      { type: 'kill_count', value: 50, description: 'Defeat 50 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'A veteran knows the rhythm of battle.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l4_wealthy',
    name: 'Wealthy Adventurer',
    description: 'Accumulate 1000 gold.',
    tier: 'standard',
    targetLevel: 5,
    requirements: [
      { type: 'gold_earn', value: 1000, description: 'Earn 1000 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Gold flows to those who survive.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l4_safe_deep_return',
    name: 'Deep Return',
    description: 'Return alive from Floor 7.',
    tier: 'standard',
    targetLevel: 5,
    requirements: [
      { type: 'floor_return', value: 7, description: 'Return from Floor 7' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The climb back is the hardest part.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l4_balanced_growth',
    name: 'Balanced Growth',
    description: 'Reach Grade D in 4 different stats.',
    tier: 'challenging',
    targetLevel: 5,
    requirements: [
      { type: 'stat_reach', value: 4, description: 'Grade D in 4 stats' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 5,
    hint: 'Balance is the foundation of strength.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'wisdom',
  },
  {
    id: 'l4_damage_dealer',
    name: 'Damage Dealer',
    description: 'Deal 2000 total damage.',
    tier: 'challenging',
    targetLevel: 5,
    requirements: [
      { type: 'damage_dealt', value: 2000, description: 'Deal 2000 damage' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Power speaks in numbers.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'war',
  },
  {
    id: 'l4_survivor_instinct',
    name: 'Survivor Instinct',
    description: 'Win 5 fights with less than 25% HP.',
    tier: 'challenging',
    targetLevel: 5,
    requirements: [
      { type: 'low_hp_win', value: 5, description: 'Win 5 fights below 25% HP' },
    ],
    requireAll: true,
    discoverySource: 'tavern',
    hint: 'Desperation breeds strength.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },

  // ===== HEROIC TIER =====
  {
    id: 'l4_double_digits',
    name: 'Double Digits',
    description: 'Reach Floor 10.',
    tier: 'heroic',
    targetLevel: 5,
    requirements: [
      { type: 'floor_reach', value: 10, description: 'Reach Floor 10' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 7,
    hint: 'The tenth floor marks a milestone.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Determined',
  },
  {
    id: 'l4_boss_veteran',
    name: 'Boss Veteran',
    description: 'Defeat 5 boss monsters total.',
    tier: 'heroic',
    targetLevel: 5,
    requirements: [
      { type: 'boss_kill', value: 5, description: 'Defeat 5 bosses total' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Five crowns for the king.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l4_undamaged_depths',
    name: 'Undamaged Depths',
    description: 'Clear Floors 5-8 taking less than 100 total damage.',
    tier: 'legendary',
    targetLevel: 5,
    requirements: [
      { type: 'floor_reach', value: 9, description: 'Clear through Floor 8' },
      { type: 'damage_taken', value: 100, comparison: 'lt', description: 'Take less than 100 damage on 5-8' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    discoveryRepRequired: 9,
    hint: 'The master avoids all harm.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Untouched',
  },
  {
    id: 'l4_stat_excellence',
    name: 'Stat Excellence',
    description: 'Reach Grade C in any stat.',
    tier: 'legendary',
    targetLevel: 5,
    requirements: [
      { type: 'stat_reach', value: 5, description: 'Reach Grade C' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 8,
    hint: 'Excellence is a journey, not a destination.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Excellent',
    domain: 'wisdom',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l4_speedrunner',
    name: 'Speedrunner',
    description: 'Reach Floor 10 at Level 4 defeating less than 20 monsters.',
    tier: 'mythic',
    targetLevel: 5,
    requirements: [
      { type: 'floor_reach', value: 10, description: 'Reach Floor 10' },
      { type: 'kill_count', value: 20, comparison: 'lt', description: 'Defeat less than 20 monsters' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'The fastest blade is the one that never swings.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Swift',
  },
];

export function getLevel4AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_4_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel4AchievementById(id: string): Achievement | undefined {
  return LEVEL_4_ACHIEVEMENTS.find(a => a.id === id);
}
