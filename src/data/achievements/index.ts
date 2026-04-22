/**
 * Achievements barrel export
 * All level-up achievements organized by target level
 */

import type { Achievement } from '../../types/Achievement';

// Individual level exports
export { LEVEL_1_ACHIEVEMENTS, getLevel1AchievementsByTier, getLevel1AchievementById } from './level1Achievements';
export { LEVEL_2_ACHIEVEMENTS, getLevel2AchievementsByTier, getLevel2AchievementById } from './level2Achievements';
export { LEVEL_3_ACHIEVEMENTS, getLevel3AchievementsByTier, getLevel3AchievementById } from './level3Achievements';
export { LEVEL_4_ACHIEVEMENTS, getLevel4AchievementsByTier, getLevel4AchievementById } from './level4Achievements';
export { LEVEL_5_ACHIEVEMENTS, getLevel5AchievementsByTier, getLevel5AchievementById } from './level5Achievements';
export { LEVEL_6_ACHIEVEMENTS, getLevel6AchievementsByTier, getLevel6AchievementById } from './level6Achievements';
export { LEVEL_7_ACHIEVEMENTS, getLevel7AchievementsByTier, getLevel7AchievementById } from './level7Achievements';
export { LEVEL_8_ACHIEVEMENTS, getLevel8AchievementsByTier, getLevel8AchievementById } from './level8Achievements';
export { LEVEL_9_ACHIEVEMENTS, getLevel9AchievementsByTier, getLevel9AchievementById } from './level9Achievements';

// Import for combined operations
import { LEVEL_1_ACHIEVEMENTS } from './level1Achievements';
import { LEVEL_2_ACHIEVEMENTS } from './level2Achievements';
import { LEVEL_3_ACHIEVEMENTS } from './level3Achievements';
import { LEVEL_4_ACHIEVEMENTS } from './level4Achievements';
import { LEVEL_5_ACHIEVEMENTS } from './level5Achievements';
import { LEVEL_6_ACHIEVEMENTS } from './level6Achievements';
import { LEVEL_7_ACHIEVEMENTS } from './level7Achievements';
import { LEVEL_8_ACHIEVEMENTS } from './level8Achievements';
import { LEVEL_9_ACHIEVEMENTS } from './level9Achievements';

/**
 * All achievements combined
 */
export const ALL_ACHIEVEMENTS: Achievement[] = [
  ...LEVEL_1_ACHIEVEMENTS,
  ...LEVEL_2_ACHIEVEMENTS,
  ...LEVEL_3_ACHIEVEMENTS,
  ...LEVEL_4_ACHIEVEMENTS,
  ...LEVEL_5_ACHIEVEMENTS,
  ...LEVEL_6_ACHIEVEMENTS,
  ...LEVEL_7_ACHIEVEMENTS,
  ...LEVEL_8_ACHIEVEMENTS,
  ...LEVEL_9_ACHIEVEMENTS,
];

/**
 * Achievements organized by target level
 */
export const ACHIEVEMENTS_BY_LEVEL: Record<number, Achievement[]> = {
  2: LEVEL_1_ACHIEVEMENTS,
  3: LEVEL_2_ACHIEVEMENTS,
  4: LEVEL_3_ACHIEVEMENTS,
  5: LEVEL_4_ACHIEVEMENTS,
  6: LEVEL_5_ACHIEVEMENTS,
  7: LEVEL_6_ACHIEVEMENTS,
  8: LEVEL_7_ACHIEVEMENTS,
  9: LEVEL_8_ACHIEVEMENTS,
  10: LEVEL_9_ACHIEVEMENTS,
};

/**
 * Get achievements for a specific target level
 */
export function getAchievementsForLevel(targetLevel: number): Achievement[] {
  return ACHIEVEMENTS_BY_LEVEL[targetLevel] ?? [];
}

/**
 * Get achievement by ID from any level
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by tier across all levels
 */
export function getAchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.tier === tier);
}

/**
 * Get achievements by domain across all levels
 */
export function getAchievementsByDomain(domain: string): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.domain === domain);
}

/**
 * Get achievement counts summary
 */
export function getAchievementsSummary(): {
  total: number;
  byLevel: Record<number, number>;
  byTier: Record<string, number>;
} {
  const byLevel: Record<number, number> = {};
  const byTier: Record<string, number> = {
    standard: 0,
    challenging: 0,
    heroic: 0,
    legendary: 0,
    mythic: 0,
  };

  for (const [level, achievements] of Object.entries(ACHIEVEMENTS_BY_LEVEL)) {
    byLevel[Number(level)] = achievements.length;
    for (const a of achievements) {
      byTier[a.tier]++;
    }
  }

  return {
    total: ALL_ACHIEVEMENTS.length,
    byLevel,
    byTier,
  };
}
