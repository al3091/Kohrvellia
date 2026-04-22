/**
 * Level 8→9 Achievements
 * Floor range: 25-30, near-endgame with high stat requirements
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_8_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l8_tower_depths',
    name: 'Tower Depths',
    description: 'Reach Floor 27 of the tower.',
    tier: 'standard',
    targetLevel: 9,
    requirements: [
      { type: 'floor_reach', value: 27, description: 'Reach Floor 27' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The deepest reaches await.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l8_mass_extinction',
    name: 'Mass Extinction',
    description: 'Defeat 300 monsters total.',
    tier: 'standard',
    targetLevel: 9,
    requirements: [
      { type: 'kill_count', value: 300, description: 'Defeat 300 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Three hundred souls bear witness.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l8_treasure_hoard',
    name: 'Treasure Hoard',
    description: 'Accumulate 8000 gold.',
    tier: 'standard',
    targetLevel: 9,
    requirements: [
      { type: 'gold_earn', value: 8000, description: 'Earn 8000 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'A dragon\'s hoard.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l8_boss_veteran_master',
    name: 'Boss Master',
    description: 'Defeat 15 boss monsters total.',
    tier: 'standard',
    targetLevel: 9,
    requirements: [
      { type: 'boss_kill', value: 15, description: 'Defeat 15 bosses' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Fifteen crowns adorn the wall.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l8_stat_a_any',
    name: 'Exceptional Stat',
    description: 'Reach Grade A in any stat.',
    tier: 'challenging',
    targetLevel: 9,
    requirements: [
      { type: 'stat_reach', value: 7, description: 'Reach Grade A' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 12,
    hint: 'Excellence ascends to exception.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'wisdom',
  },
  {
    id: 'l8_damage_catastrophe',
    name: 'Catastrophe',
    description: 'Deal 25000 total damage.',
    tier: 'challenging',
    targetLevel: 9,
    requirements: [
      { type: 'damage_dealt', value: 25000, description: 'Deal 25000 damage' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Catastrophic power.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'war',
  },
  {
    id: 'l8_skill_master',
    name: 'Skill Grandmaster',
    description: 'Use skills 100 times in combat.',
    tier: 'challenging',
    targetLevel: 9,
    requirements: [
      { type: 'skill_use', value: 100, description: 'Use skills 100 times' },
    ],
    requireAll: true,
    discoverySource: 'academy',
    hint: 'A hundred techniques mastered.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'magic',
  },

  // ===== HEROIC TIER =====
  {
    id: 'l8_floor_30',
    name: 'Thirtieth Floor',
    description: 'Reach Floor 30.',
    tier: 'heroic',
    targetLevel: 9,
    requirements: [
      { type: 'floor_reach', value: 30, description: 'Reach Floor 30' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 14,
    hint: 'The thirtieth floor is legend.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Legend',
  },
  {
    id: 'l8_elite_annihilator',
    name: 'Elite Annihilator',
    description: 'Defeat 50 elite monsters total.',
    tier: 'heroic',
    targetLevel: 9,
    requirements: [
      { type: 'elite_kill', value: 50, description: 'Defeat 50 elites' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Fifty elites fall before you.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l8_all_stats_b',
    name: 'Complete Superiority',
    description: 'Reach Grade B in all 8 stats.',
    tier: 'legendary',
    targetLevel: 9,
    requirements: [
      { type: 'stat_reach', value: 6, description: 'All stats at Grade B' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 15,
    hint: 'Complete superiority in all things.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Complete',
    domain: 'wisdom',
  },
  {
    id: 'l8_boss_chain_5',
    name: 'Boss Pentakill',
    description: 'Defeat 5 bosses in a single run.',
    tier: 'legendary',
    targetLevel: 9,
    requirements: [
      { type: 'boss_kill', value: 5, description: 'Defeat 5 bosses in one run' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 14,
    hint: 'Five crowns in a single breath.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'Pentakiller',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l8_ultimate_warrior',
    name: 'Ultimate Warrior',
    description: 'Reach Floor 30 at Level 8 with Grade A in 2 stats and without dying.',
    tier: 'mythic',
    targetLevel: 9,
    requirements: [
      { type: 'floor_reach', value: 30, description: 'Reach Floor 30' },
      { type: 'stat_reach', value: 7, description: 'Grade A in 2 stats' },
      { type: 'custom', value: 0, description: 'Without dying' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'The ultimate warrior knows no limits.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Ultimate',
  },
];

export function getLevel8AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_8_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel8AchievementById(id: string): Achievement | undefined {
  return LEVEL_8_ACHIEVEMENTS.find(a => a.id === id);
}
