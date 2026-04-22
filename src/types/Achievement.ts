/**
 * Achievement system types for Kohrvellia
 * Level-up is achievement-based, not XP-based
 * Each level has 10 universal achievements + deity domain bonuses
 */

// StatName type available from './Stats' if needed for future extensions

// Achievement difficulty tiers
export type AchievementTier = 'standard' | 'challenging' | 'heroic' | 'legendary' | 'mythic';

// Discovery state for achievements
export type DiscoveryState = 'hidden' | 'rumored' | 'known' | 'completed';

// Requirement types for achievements
export type RequirementType =
  | 'kill_count' // Kill X monsters
  | 'kill_type' // Kill X of specific type
  | 'floor_reach' // Reach floor X
  | 'floor_return' // Reach floor X and return alive
  | 'damage_dealt' // Deal X damage
  | 'damage_taken' // Take X damage (survival)
  | 'no_damage' // Complete without taking damage
  | 'low_hp_win' // Win with <X% HP
  | 'item_collect' // Collect X items of rarity
  | 'gold_earn' // Earn X gold
  | 'reputation' // Reach rep +X with NPCs
  | 'skill_use' // Use skill X times
  | 'status_inflict' // Inflict status X times
  | 'stat_reach' // Reach stat grade X
  | 'stealth_kills' // Kill X from stealth
  | 'flee_success' // Flee X times
  | 'shrine_blessing' // Receive X shrine blessings
  | 'elite_kill' // Kill X elite monsters
  | 'boss_kill' // Kill X bosses
  | 'no_consumables' // Complete without using consumables
  | 'custom'; // Custom condition (checked via function)

// Single requirement for an achievement
export interface AchievementRequirement {
  type: RequirementType;
  value: number;
  targetType?: string; // For kill_type: "dragon", "undead", etc.
  comparison?: 'eq' | 'gte' | 'lte' | 'gt' | 'lt';
  description: string;
}

// Achievement definition
export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;

  // Level this achievement applies to (1-9 for level-up achievements)
  targetLevel: number; // Level you're trying to reach

  // Requirements
  requirements: AchievementRequirement[];
  requireAll: boolean; // Must meet ALL requirements (AND) or ANY (OR)

  // Discovery
  discoverySource: string; // Where player learns about this
  discoveryRepRequired?: number; // Rep level with source needed
  discoveryGoldCost?: number; // Gold to research
  hint?: string; // Vague hint shown when rumored

  // Rewards
  bonusStatPoints: number;
  gloryPoints: number;
  titleModifier?: string; // "the Bold", "the Fearless"

  // Domain association (for deity bonus achievements)
  domain?: string; // "war", "magic", "death", etc.
  deitySpecific?: string; // Specific deity ID if deity-locked
}

// Player's progress on a specific achievement
export interface AchievementProgress {
  achievementId: string;
  discoveryState: DiscoveryState;

  // Progress per requirement
  requirementProgress: {
    requirementIndex: number;
    current: number;
    target: number;
    completed: boolean;
  }[];

  // Overall status
  isCompleted: boolean;
  completedAt?: number; // Unix timestamp

  // Level-up tracking
  usedForLevelUp: boolean;
  levelUsedAt?: number;
}

// ===== TIER BONUSES =====

export const ACHIEVEMENT_TIER_REWARDS: Record<
  AchievementTier,
  {
    bonusStatPoints: number;
    gloryPoints: number;
    crEquivalent: string;
    titleModifier: string | null;
  }
> = {
  standard: {
    bonusStatPoints: 0,
    gloryPoints: 0,
    crEquivalent: 'CR 1.0-2.0',
    titleModifier: null,
  },
  challenging: {
    bonusStatPoints: 1,
    gloryPoints: 1,
    crEquivalent: 'CR 2.5-4.0',
    titleModifier: 'the Capable',
  },
  heroic: {
    bonusStatPoints: 2,
    gloryPoints: 3,
    crEquivalent: 'CR 4.5-6.0',
    titleModifier: 'the Bold',
  },
  legendary: {
    bonusStatPoints: 3,
    gloryPoints: 7,
    crEquivalent: 'CR 7.0-10.0',
    titleModifier: 'the Fearless',
  },
  mythic: {
    bonusStatPoints: 5,
    gloryPoints: 15,
    crEquivalent: 'CR 10.0+',
    titleModifier: 'the Impossible',
  },
};

// Achievement stacking multipliers
export const STACK_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.25,
  3: 1.5,
};

// ===== DISCOVERY SOURCES =====

export const DISCOVERY_SOURCES = {
  guild: { name: 'Guild Hall', baseRepRequired: 0 },
  tavern: { name: 'Tavern Veterans', baseRepRequired: 3 },
  library: { name: 'Library', baseRepRequired: 3 },
  arena: { name: 'Arena Master', baseRepRequired: 6 },
  academy: { name: 'Academy Scholars', baseRepRequired: 8 },
  temple: { name: 'Temple', baseRepRequired: 5 },
  shrine: { name: 'Shrine (Deity)', baseRepRequired: 0 }, // Favor-based instead
  journal: { name: 'Past Adventurer Journal', baseRepRequired: 0 }, // Floor loot
  undiscovered: { name: 'Unknown', baseRepRequired: -1 }, // Cannot be discovered normally
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Check if a single requirement is met
 */
export function isRequirementMet(
  requirement: AchievementRequirement,
  currentValue: number
): boolean {
  const comparison = requirement.comparison ?? 'gte';

  switch (comparison) {
    case 'eq':
      return currentValue === requirement.value;
    case 'gte':
      return currentValue >= requirement.value;
    case 'lte':
      return currentValue <= requirement.value;
    case 'gt':
      return currentValue > requirement.value;
    case 'lt':
      return currentValue < requirement.value;
    default:
      return currentValue >= requirement.value;
  }
}

/**
 * Check if all/any requirements are met for an achievement
 */
export function isAchievementCompleted(
  achievement: Achievement,
  progress: AchievementProgress
): boolean {
  const allCompleted = progress.requirementProgress.every((r) => r.completed);
  const anyCompleted = progress.requirementProgress.some((r) => r.completed);

  return achievement.requireAll ? allCompleted : anyCompleted;
}

/**
 * Calculate total bonus stat points from multiple achievements
 */
export function calculateStackedBonus(achievements: Achievement[]): number {
  if (achievements.length === 0) return 0;

  let basePoints = 0;
  for (const a of achievements) {
    basePoints += ACHIEVEMENT_TIER_REWARDS[a.tier].bonusStatPoints;
  }

  const stackCount = Math.min(achievements.length, 3);
  const multiplier = STACK_MULTIPLIERS[stackCount] ?? 1;

  return Math.floor(basePoints * multiplier);
}

/**
 * Check for tier synergy bonus
 */
export function getTierSynergyBonus(achievements: Achievement[]): {
  bonusPoints: number;
  modifier: string | null;
} {
  if (achievements.length < 2) return { bonusPoints: 0, modifier: null };

  // Count tiers
  const tierCounts: Record<AchievementTier, number> = {
    standard: 0,
    challenging: 0,
    heroic: 0,
    legendary: 0,
    mythic: 0,
  };

  for (const a of achievements) {
    tierCounts[a.tier]++;
  }

  // Check for same-tier stacking
  for (const [tier, count] of Object.entries(tierCounts)) {
    if (count >= 3) return { bonusPoints: 2, modifier: `Triple ${tier}` };
    if (count >= 2) return { bonusPoints: 1, modifier: `Double ${tier}` };
  }

  // Check for mixed high-tier synergy
  if (
    tierCounts.challenging > 0 &&
    tierCounts.heroic > 0 &&
    tierCounts.legendary > 0
  ) {
    return { bonusPoints: 2, modifier: 'Versatile' };
  }

  return { bonusPoints: 0, modifier: null };
}

/**
 * Get the highest tier from a list of achievements
 */
export function getHighestTier(achievements: Achievement[]): AchievementTier {
  const tierOrder: AchievementTier[] = ['standard', 'challenging', 'heroic', 'legendary', 'mythic'];
  let highest = 0;

  for (const a of achievements) {
    const index = tierOrder.indexOf(a.tier);
    if (index > highest) highest = index;
  }

  return tierOrder[highest];
}

/**
 * Create initial progress tracker for an achievement
 */
export function createAchievementProgress(
  achievement: Achievement,
  isDiscovered: boolean = false
): AchievementProgress {
  return {
    achievementId: achievement.id,
    discoveryState: isDiscovered ? 'known' : 'hidden',
    requirementProgress: achievement.requirements.map((req, index) => ({
      requirementIndex: index,
      current: 0,
      target: req.value,
      completed: false,
    })),
    isCompleted: false,
    usedForLevelUp: false,
  };
}

/**
 * Format achievement for display
 */
export function formatAchievementDisplay(
  achievement: Achievement,
  progress: AchievementProgress
): string {
  const tierEmoji: Record<AchievementTier, string> = {
    standard: '',
    challenging: '*',
    heroic: '**',
    legendary: '***',
    mythic: '****',
  };

  const completionMark = progress.isCompleted ? '[X]' : '[ ]';
  const tier = tierEmoji[achievement.tier];

  return `${completionMark} ${achievement.name}${tier ? ` ${tier}` : ''}`;
}

/**
 * Get hint text based on discovery state
 */
export function getAchievementHint(
  achievement: Achievement,
  discoveryState: DiscoveryState
): string {
  switch (discoveryState) {
    case 'hidden':
      return '???';
    case 'rumored':
      return achievement.hint ?? 'A great deed awaits...';
    case 'known':
    case 'completed':
      return achievement.description;
  }
}
