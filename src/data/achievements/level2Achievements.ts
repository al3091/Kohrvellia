/**
 * Level 2→3 Achievements
 * Floor range: 3-6, introducing elite monsters and status effects
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_2_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l2_dungeon_delver',
    name: 'Dungeon Delver',
    description: 'Reach Floor 4 of the tower.',
    tier: 'standard',
    targetLevel: 3,
    requirements: [
      { type: 'floor_reach', value: 4, description: 'Reach Floor 4' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The depths call to the brave.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l2_monster_slayer',
    name: 'Monster Slayer',
    description: 'Defeat 15 monsters total.',
    tier: 'standard',
    targetLevel: 3,
    requirements: [
      { type: 'kill_count', value: 15, description: 'Defeat 15 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The blade grows sharper with use.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l2_wealth_seeker',
    name: 'Wealth Seeker',
    description: 'Accumulate 200 gold.',
    tier: 'standard',
    targetLevel: 3,
    requirements: [
      { type: 'gold_earn', value: 200, description: 'Earn 200 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Fortune follows the persistent.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l2_safe_return',
    name: 'Safe Return',
    description: 'Return alive from Floor 3.',
    tier: 'standard',
    targetLevel: 3,
    requirements: [
      { type: 'floor_return', value: 3, description: 'Return from Floor 3' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Knowing when to leave is wisdom.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l2_elite_hunter',
    name: 'Elite Hunter',
    description: 'Defeat your first elite monster.',
    tier: 'challenging',
    targetLevel: 3,
    requirements: [
      { type: 'elite_kill', value: 1, description: 'Defeat 1 elite monster' },
    ],
    requireAll: true,
    discoverySource: 'tavern',
    discoveryRepRequired: 3,
    hint: 'Some prey is more dangerous than others.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },
  {
    id: 'l2_status_master',
    name: 'Status Master',
    description: 'Inflict status effects 10 times.',
    tier: 'challenging',
    targetLevel: 3,
    requirements: [
      { type: 'status_inflict', value: 10, description: 'Inflict 10 status effects' },
    ],
    requireAll: true,
    discoverySource: 'library',
    hint: 'The cunning warrior fights with more than steel.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },
  {
    id: 'l2_floor_sweep',
    name: 'Floor Sweep',
    description: 'Clear Floors 2 and 3 in a single run.',
    tier: 'challenging',
    targetLevel: 3,
    requirements: [
      { type: 'floor_reach', value: 4, description: 'Reach Floor 4' },
      { type: 'custom', value: 0, description: 'In a single run' },
    ],
    requireAll: true,
    discoverySource: 'tavern',
    hint: 'Momentum is a weapon unto itself.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },

  // ===== HEROIC TIER =====
  {
    id: 'l2_unbroken',
    name: 'Unbroken',
    description: 'Reach Floor 5 without dying.',
    tier: 'heroic',
    targetLevel: 3,
    requirements: [
      { type: 'floor_reach', value: 5, description: 'Reach Floor 5' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 5,
    hint: 'The tower tests all who enter.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Unbroken',
  },
  {
    id: 'l2_boss_hunter',
    name: 'Boss Hunter',
    description: 'Defeat 2 boss monsters.',
    tier: 'heroic',
    targetLevel: 3,
    requirements: [
      { type: 'boss_kill', value: 2, description: 'Defeat 2 bosses' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'The greatest challenges yield the greatest rewards.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l2_perfect_floors',
    name: 'Perfect Floors',
    description: 'Clear Floors 1-3 taking less than 50 total damage.',
    tier: 'legendary',
    targetLevel: 3,
    requirements: [
      { type: 'floor_reach', value: 4, description: 'Reach Floor 4' },
      { type: 'damage_taken', value: 50, comparison: 'lt', description: 'Take less than 50 damage' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    discoveryRepRequired: 7,
    hint: 'Mastery is measured in precision.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Precise',
  },
  {
    id: 'l2_elite_destroyer',
    name: 'Elite Destroyer',
    description: 'Defeat 3 elite monsters in a single run.',
    tier: 'legendary',
    targetLevel: 3,
    requirements: [
      { type: 'elite_kill', value: 3, description: 'Defeat 3 elites in one run' },
    ],
    requireAll: true,
    discoverySource: 'library',
    discoveryRepRequired: 6,
    hint: 'The strong seek the strong.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'Elite Bane',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l2_perfectionist',
    name: 'The Perfectionist',
    description: 'Reach Floor 6 at Level 2 without taking any damage.',
    tier: 'mythic',
    targetLevel: 3,
    requirements: [
      { type: 'floor_reach', value: 6, description: 'Reach Floor 6' },
      { type: 'damage_taken', value: 0, comparison: 'eq', description: 'Take 0 damage' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'Perfection is not a goal, it is a standard.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Perfect',
  },
];

export function getLevel2AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_2_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel2AchievementById(id: string): Achievement | undefined {
  return LEVEL_2_ACHIEVEMENTS.find(a => a.id === id);
}
