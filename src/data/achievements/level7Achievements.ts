/**
 * Level 7→8 Achievements
 * Floor range: 20-25, late-game with mastery requirements
 */

import type { Achievement } from '../../types/Achievement';

export const LEVEL_7_ACHIEVEMENTS: Achievement[] = [
  // ===== STANDARD TIER =====
  {
    id: 'l7_abyssal_reach',
    name: 'Abyssal Reach',
    description: 'Reach Floor 22 of the tower.',
    tier: 'standard',
    targetLevel: 8,
    requirements: [
      { type: 'floor_reach', value: 22, description: 'Reach Floor 22' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'The abyss gazes back.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l7_slaughter',
    name: 'Slaughter',
    description: 'Defeat 200 monsters total.',
    tier: 'standard',
    targetLevel: 8,
    requirements: [
      { type: 'kill_count', value: 200, description: 'Defeat 200 monsters' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Two hundred souls weigh heavy.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l7_wealthy_lord',
    name: 'Wealthy Lord',
    description: 'Accumulate 5000 gold.',
    tier: 'standard',
    targetLevel: 8,
    requirements: [
      { type: 'gold_earn', value: 5000, description: 'Earn 5000 gold' },
    ],
    requireAll: true,
    discoverySource: 'guild',
    hint: 'Gold paves the path.',
    bonusStatPoints: 0,
    gloryPoints: 0,
  },
  {
    id: 'l7_shrine_devotion',
    name: 'Shrine Devotion',
    description: 'Receive 20 shrine blessings total.',
    tier: 'standard',
    targetLevel: 8,
    requirements: [
      { type: 'shrine_blessing', value: 20, description: 'Receive 20 blessings' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    hint: 'Devotion brings reward.',
    bonusStatPoints: 0,
    gloryPoints: 0,
    domain: 'life',
  },

  // ===== CHALLENGING TIER =====
  {
    id: 'l7_all_stats_c',
    name: 'Complete Competence',
    description: 'Reach Grade C in all 8 stats.',
    tier: 'challenging',
    targetLevel: 8,
    requirements: [
      { type: 'stat_reach', value: 5, description: 'All stats at Grade C' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 10,
    hint: 'Completeness is the beginning of mastery.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'wisdom',
  },
  {
    id: 'l7_boss_decimator',
    name: 'Boss Decimator',
    description: 'Defeat 12 boss monsters total.',
    tier: 'challenging',
    targetLevel: 8,
    requirements: [
      { type: 'boss_kill', value: 12, description: 'Defeat 12 bosses' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'A dozen crowns claimed.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'war',
  },
  {
    id: 'l7_status_mastery',
    name: 'Status Mastery',
    description: 'Inflict status effects 50 times.',
    tier: 'challenging',
    targetLevel: 8,
    requirements: [
      { type: 'status_inflict', value: 50, description: 'Inflict 50 status effects' },
    ],
    requireAll: true,
    discoverySource: 'library',
    hint: 'The cunning weapon never dulls.',
    bonusStatPoints: 1,
    gloryPoints: 1,
    domain: 'trickery',
  },

  // ===== HEROIC TIER =====
  {
    id: 'l7_floor_25',
    name: 'Quarter Century',
    description: 'Reach Floor 25.',
    tier: 'heroic',
    targetLevel: 8,
    requirements: [
      { type: 'floor_reach', value: 25, description: 'Reach Floor 25' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    discoveryRepRequired: 12,
    hint: 'Twenty-five floors mark the true adventurer.',
    bonusStatPoints: 2,
    gloryPoints: 3,
    titleModifier: 'the Abyss Walker',
  },
  {
    id: 'l7_elite_slaughter',
    name: 'Elite Slaughter',
    description: 'Defeat 30 elite monsters total.',
    tier: 'heroic',
    targetLevel: 8,
    requirements: [
      { type: 'elite_kill', value: 30, description: 'Defeat 30 elites' },
    ],
    requireAll: true,
    discoverySource: 'arena',
    hint: 'Thirty elite trophies.',
    bonusStatPoints: 2,
    gloryPoints: 3,
  },

  // ===== LEGENDARY TIER =====
  {
    id: 'l7_stat_b_multiple',
    name: 'Multiple Superiority',
    description: 'Reach Grade B in 3 different stats.',
    tier: 'legendary',
    targetLevel: 8,
    requirements: [
      { type: 'stat_reach', value: 6, description: 'Grade B in 3 stats' },
    ],
    requireAll: true,
    discoverySource: 'temple',
    discoveryRepRequired: 14,
    hint: 'Superiority breeds superiority.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Ascendant',
    domain: 'wisdom',
  },
  {
    id: 'l7_favored_child',
    name: 'Favoured Child',
    description: 'Reach "Favoured Child" status with your patron deity.',
    tier: 'legendary',
    targetLevel: 8,
    requirements: [
      { type: 'reputation', value: 90, description: 'Reach Favoured Child (90+ favor)' },
    ],
    requireAll: true,
    discoverySource: 'shrine',
    discoveryRepRequired: 13,
    hint: 'The chosen walk in divine light.',
    bonusStatPoints: 3,
    gloryPoints: 7,
    titleModifier: 'the Chosen',
    domain: 'authority',
  },

  // ===== MYTHIC TIER =====
  {
    id: 'l7_deathless_deep',
    name: 'Deathless Depths',
    description: 'Reach Floor 25 at Level 7 without dying.',
    tier: 'mythic',
    targetLevel: 8,
    requirements: [
      { type: 'floor_reach', value: 25, description: 'Reach Floor 25' },
      { type: 'custom', value: 0, description: 'Without dying' },
    ],
    requireAll: true,
    discoverySource: 'undiscovered',
    hint: 'Death cannot claim what it cannot catch.',
    bonusStatPoints: 5,
    gloryPoints: 15,
    titleModifier: 'the Deathless',
  },
];

export function getLevel7AchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return LEVEL_7_ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getLevel7AchievementById(id: string): Achievement | undefined {
  return LEVEL_7_ACHIEVEMENTS.find(a => a.id === id);
}
