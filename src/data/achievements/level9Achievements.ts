/**
 * Level 9→10 Achievements
 * Floor range: 30+, endgame achievements for reaching Paragon (Level 10)
 * These are the final achievements before the Denatus ceremony
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_9_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l9_deep_abyss',
    name: 'Deep Abyss',
    description: 'Reach Floor 35 of the tower.',
    tier: 'standard',
    targetLevel: 10,
    requirements: [
      { type: 'floor_reach', value: 35, description: 'Reach Floor 35' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The final depths call.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l9_apocalypse',
    name: 'Apocalypse',
    description: 'Defeat 500 monsters total.',
    tier: 'standard',
    targetLevel: 10,
    requirements: [
      { type: 'kill_count', value: 500, description: 'Defeat 500 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Five hundred souls light the path.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l9_fortune_king',
    name: 'Fortune King',
    description: 'Accumulate 15000 gold.',
    tier: 'standard',
    targetLevel: 10,
    requirements: [
      { type: 'gold_earn', value: 15000, description: 'Earn 15000 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'A king\'s ransom.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l9_boss_legend',
    name: 'Boss Legend',
    description: 'Defeat 20 boss monsters total.',
    tier: 'standard',
    targetLevel: 10,
    requirements: [
      { type: 'boss_kill', value: 20, description: 'Defeat 20 bosses' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Twenty crowns make a legend.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l9_stat_s_any',
    name: 'S-Rank Achiever',
    description: 'Reach Grade S in any stat.',
    tier: 'challenging',
    targetLevel: 10,
    requirements: [
      { type: 'stat_reach', value: 8, description: 'Reach Grade S' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 14,
    hint: 'S-Rank marks the truly exceptional.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'wisdom',
  },
  {
    id: 'l9_damage_armageddon',
    name: 'Armageddon',
    description: 'Deal 50000 total damage.',
    tier: 'challenging',
    targetLevel: 10,
    requirements: [
      { type: 'damage_dealt', value: 50000, description: 'Deal 50000 damage' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'World-ending devastation.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'war',
  },
  {
    id: 'l9_divine_bond',
    name: 'Divine Bond',
    description: 'Maintain "Favoured Child" status for an entire dungeon run (10+ floors).',
    tier: 'challenging',
    targetLevel: 10,
    requirements: [
      { type: 'reputation', value: 90, description: 'Maintain Favoured Child' },
      { type: 'floor_reach', value: 10, description: 'For 10+ floors' },
    ],
    requireAll: true,
    discoverySource: 'shrine',
    hint: 'The divine bond transcends mortal limits.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'authority',
  },

  // ===== HEROIC TIER =====
  {
    id: 'l9_floor_40',
    name: 'Fortieth Floor',
    description: 'Reach Floor 40.',
    tier: 'heroic',
    targetLevel: 10,
    requirements: [
      { type: 'floor_reach', value: 40, description: 'Reach Floor 40' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 16,
    hint: 'The fortieth floor is myth made real.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Mythic',
  },
  {
    id: 'l9_stat_a_multiple',
    name: 'Multiple Excellence',
    description: 'Reach Grade A in 4 different stats.',
    tier: 'heroic',
    targetLevel: 10,
    requirements: [
      { type: 'stat_reach', value: 7, description: 'Grade A in 4 stats' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 15,
    hint: 'Excellence multiplied.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    domain: 'wisdom',
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l9_all_stats_a',
    name: 'Complete Excellence',
    description: 'Reach Grade A in all 8 stats.',
    tier: 'legendary',
    targetLevel: 10,
    requirements: [
      { type: 'stat_reach', value: 7, description: 'All stats at Grade A' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 18,
    hint: 'Complete excellence in all things.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Transcendent',
    domain: 'wisdom',
  },
  {
    id: 'l9_god_slayer',
    name: 'God Slayer',
    description: 'Defeat 10 bosses in a single run without dying.',
    tier: 'legendary',
    targetLevel: 10,
    requirements: [
      { type: 'boss_kill', value: 10, description: 'Defeat 10 bosses in one run' },
      { type: 'custom', value: 0, description: 'Without dying' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'Even gods fall before the relentless.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'God Slayer',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l9_paragon_path',
    name: 'The Paragon Path',
    description: 'Reach Floor 50 at Level 9 with Grade S in any stat and without dying once.',
    tier: 'mythic',
    targetLevel: 10,
    requirements: [
      { type: 'floor_reach', value: 50, description: 'Reach Floor 50' },
      { type: 'stat_reach', value: 8, description: 'Grade S in any stat' },
      { type: 'custom', value: 0, description: 'Without dying' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'The Paragon Path is walked by those who transcend mortality.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Paragon',
  },
];

export function getLevel9AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_9_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel9AchievementById(id: string): Achievement | undefined {
  return LEVEL_9_ACHIEVEMENTS.find(a => a.id === id);
}
