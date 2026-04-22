/**
 * Level 3→4 Achievements
 * Floor range: 5-8, introducing stat milestones and skill usage
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_3_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l3_deep_explorer',
    name: 'Deep Explorer',
    description: 'Reach Floor 6 of the tower.',
    tier: 'standard',
    targetLevel: 4,
    requirements: [
      { type: 'floor_reach', value: 6, description: 'Reach Floor 6' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The darkness deepens below.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l3_battle_hardened',
    name: 'Battle Hardened',
    description: 'Defeat 30 monsters total.',
    tier: 'standard',
    targetLevel: 4,
    requirements: [
      { type: 'kill_count', value: 30, description: 'Defeat 30 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Experience forges the warrior.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l3_prosperous',
    name: 'Prosperous',
    description: 'Accumulate 500 gold.',
    tier: 'standard',
    targetLevel: 4,
    requirements: [
      { type: 'gold_earn', value: 500, description: 'Earn 500 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Wealth brings opportunity.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l3_skilled_fighter',
    name: 'Skilled Fighter',
    description: 'Use skills 20 times in combat.',
    tier: 'standard',
    targetLevel: 4,
    requirements: [
      { type: 'skill_use', value: 20, description: 'Use skills 20 times' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The wise warrior uses every tool.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l3_stat_growth',
    name: 'Growing Power',
    description: 'Reach Grade D in any stat.',
    tier: 'challenging',
    targetLevel: 4,
    requirements: [
      { type: 'stat_reach', value: 4, description: 'Reach Grade D in any stat' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 3,
    hint: 'The Falna reveals hidden potential.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'wisdom',
  },
  {
    id: 'l3_shrine_blessed',
    name: 'Shrine Blessed',
    description: 'Receive 5 shrine blessings.',
    tier: 'challenging',
    targetLevel: 4,
    requirements: [
      { type: 'shrine_blessing', value: 5, description: 'Receive 5 shrine blessings' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    hint: 'The gods favor the devoted.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'life',
  },
  {
    id: 'l3_poison_master',
    name: 'Venomous',
    description: 'Kill 10 enemies with poison damage.',
    tier: 'challenging',
    targetLevel: 4,
    requirements: [
      { type: 'kill_type', value: 10, targetType: 'poison', description: 'Kill 10 via poison' },
    ],
    requireAll: true,
    discoverySource: 'library',
    hint: 'Some deaths are slow.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'death',
  },

  // ===== HEROIC TIER =====
  {
    id: 'l3_floor_marathon',
    name: 'Floor Marathon',
    description: 'Clear 5 floors in a single run.',
    tier: 'heroic',
    targetLevel: 4,
    requirements: [
      { type: 'floor_reach', value: 6, description: 'Reach Floor 6 from Floor 1' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 6,
    hint: 'Endurance conquers all.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Enduring',
  },
  {
    id: 'l3_boss_trio',
    name: 'Boss Trio',
    description: 'Defeat 3 boss monsters total.',
    tier: 'heroic',
    targetLevel: 4,
    requirements: [
      { type: 'boss_kill', value: 3, description: 'Defeat 3 bosses total' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Three heads for the wall.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l3_no_consumables',
    name: 'Pure Strength',
    description: 'Reach Floor 6 without using any consumables.',
    tier: 'legendary',
    targetLevel: 4,
    requirements: [
      { type: 'floor_reach', value: 6, description: 'Reach Floor 6' },
      { type: 'no_consumables', value: 1, description: 'Without using consumables' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    discoveryRepRequired: 8,
    hint: 'True strength needs no crutch.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Pure',
  },
  {
    id: 'l3_elite_chain',
    name: 'Elite Chain',
    description: 'Defeat 5 elite monsters without returning to town.',
    tier: 'legendary',
    targetLevel: 4,
    requirements: [
      { type: 'elite_kill', value: 5, description: 'Defeat 5 elites in one run' },
    ],
    requireAll: true,
    discoverySource: 'library',
    discoveryRepRequired: 7,
    hint: 'The chain of triumph grows link by link.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'Chain Breaker',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l3_flawless_descent',
    name: 'Flawless Descent',
    description: 'Reach Floor 8 at Level 3 without dying or fleeing.',
    tier: 'mythic',
    targetLevel: 4,
    requirements: [
      { type: 'floor_reach', value: 8, description: 'Reach Floor 8' },
      { type: 'flee_success', value: 0, comparison: 'eq', description: 'Never flee' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'The fearless descend without looking back.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Fearless',
  },
];

export function getLevel3AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_3_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel3AchievementById(id: string): Achievement | undefined {
  return LEVEL_3_ACHIEVEMENTS.find(a => a.id === id);
}
