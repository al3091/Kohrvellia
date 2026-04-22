/**
 * Level 1→2 Achievements
 * 10 achievements per tier category for reaching Level 2
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_1_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER (Easy, expected path) =====
  {
    id: 'l1_first_blood',
    name: 'First Blood',
    description: 'Defeat your first monster in the tower.',
    tier: 'standard',
    targetLevel: 2,
    requirements: [
      { type: 'kill_count', value: 1, description: 'Defeat 1 monster' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Every journey begins with a single step.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l1_first_steps',
    name: 'First Steps',
    description: 'Reach Floor 2 of the tower.',
    tier: 'standard',
    targetLevel: 2,
    requirements: [
      { type: 'floor_reach', value: 2, description: 'Reach Floor 2' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Descend into the darkness.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l1_survivor',
    name: 'Survivor',
    description: 'Return alive from the first floor.',
    tier: 'standard',
    targetLevel: 2,
    requirements: [
      { type: 'floor_return', value: 1, description: 'Return from Floor 1' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Live to fight another day.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l1_coin_collector',
    name: 'Coin Collector',
    description: 'Earn your first 50 gold.',
    tier: 'standard',
    targetLevel: 2,
    requirements: [
      { type: 'gold_earn', value: 50, description: 'Earn 50 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Gold opens many doors.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER (Requires effort) =====
  {
    id: 'l1_clean_sweep',
    name: 'Clean Sweep',
    description: 'Clear Floor 1 without resting.',
    tier: 'challenging',
    targetLevel: 2,
    requirements: [
      { type: 'floor_reach', value: 2, description: 'Reach Floor 2' },
      { type: 'custom', value: 0, description: 'Without using rest sites on Floor 1' },
    ],
    requireAll: true,
    discoverySource: 'tavern',
    discoveryRepRequired: 2,
    hint: 'The strong need no respite.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },
  {
    id: 'l1_efficient_hunter',
    name: 'Efficient Hunter',
    description: 'Defeat 5 monsters on Floor 1.',
    tier: 'challenging',
    targetLevel: 2,
    requirements: [
      { type: 'kill_count', value: 5, description: 'Defeat 5 monsters' },
    ],
    requireAll: true,
    discoverySource: 'tavern',
    hint: 'Practice makes perfect.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },
  {
    id: 'l1_treasure_seeker',
    name: 'Treasure Seeker',
    description: 'Open 3 treasure chests on Floor 1.',
    tier: 'challenging',
    targetLevel: 2,
    requirements: [
      { type: 'item_collect', value: 3, description: 'Open 3 chests' },
    ],
    requireAll: true,
    discoverySource: 'tavern',
    hint: 'Fortune favors the curious.',
    bonusStatPoints: 1,
    gloryPoints: 1,
  },

  // ===== HEROIC TIER (Skilled play) =====
  {
    id: 'l1_deathless_dawn',
    name: 'Deathless Dawn',
    description: 'Reach Floor 3 without dying.',
    tier: 'heroic',
    targetLevel: 2,
    requirements: [
      { type: 'floor_reach', value: 3, description: 'Reach Floor 3' },
      { type: 'no_damage', value: 0, description: 'Without dying' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 4,
    hint: 'Death fears the fearless.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Unscathed',
  },
  {
    id: 'l1_overachiever',
    name: 'Overachiever',
    description: 'Defeat 10 monsters before reaching Floor 2.',
    tier: 'heroic',
    targetLevel: 2,
    requirements: [
      { type: 'kill_count', value: 10, description: 'Defeat 10 monsters on Floor 1' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Why settle for less?',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER (Exceptional) =====
  {
    id: 'l1_dragons_bane',
    name: "Dragon's Bane",
    description: 'Defeat a boss monster on Floor 1.',
    tier: 'legendary',
    targetLevel: 2,
    requirements: [
      { type: 'boss_kill', value: 1, description: 'Defeat 1 boss' },
    ],
    requireAll: true,
    discoverySource: 'library',
    discoveryRepRequired: 5,
    hint: 'Legends speak of a great beast...',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Dragonslayer',
  },
  {
    id: 'l1_untouched',
    name: 'Untouched',
    description: 'Clear Floor 1 taking no damage.',
    tier: 'legendary',
    targetLevel: 2,
    requirements: [
      { type: 'floor_reach', value: 2, description: 'Reach Floor 2' },
      { type: 'damage_taken', value: 0, comparison: 'eq', description: 'Take 0 damage' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    discoveryRepRequired: 6,
    hint: 'The perfect warrior leaves no opening.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Untouchable',
  },

  // ===== MYTHIC TIER (Near impossible) =====
  {
    id: 'l1_impossible_novice',
    name: 'The Impossible Novice',
    description: 'Reach Floor 5 at Level 1 without dying or fleeing.',
    tier: 'mythic',
    targetLevel: 2,
    requirements: [
      { type: 'floor_reach', value: 5, description: 'Reach Floor 5' },
      { type: 'flee_success', value: 0, comparison: 'eq', description: 'Never flee' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'Some deeds are never spoken of, only witnessed.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Impossible',
  },
];

// Helper to get achievements by tier
export function getLevel1AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_1_ACHIEVEMENTS.filter(a => a.tier === tier);
}

// Helper to get achievement by ID
export function getLevel1AchievementById(id: string): Achievement | undefined {
  return LEVEL_1_ACHIEVEMENTS.find(a => a.id === id);
}
