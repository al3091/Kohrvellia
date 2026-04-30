/**
 * Deity and Pantheon system types for Kohrvellia
 * Patron deities provide buffs, debuffs, and unique abilities
 */

import type { StatName } from './Stats';

// Deity domains (categories of divine influence)
export type DeityDomain =
  | 'war'
  | 'magic'
  | 'trickery'
  | 'death'
  | 'fortune'
  | 'nature'
  | 'wisdom'
  | 'craft'
  | 'authority'
  | 'life'
  | 'sea'
  | 'sky'
  | 'fire'
  | 'knowledge';

// Pantheon identifiers
export type PantheonId =
  | 'greek'
  | 'norse'
  | 'egyptian'
  | 'japanese'
  | 'celtic'
  | 'mesopotamian'
  | 'hindu'
  | 'chinese'
  | 'slavic'
  | 'aztec'
  | 'maya'
  | 'inca'
  | 'yoruba'
  | 'polynesian'
  | 'persian'
  | 'vodou'
  | 'shinto'
  | 'ars_goetia'
  | 'fallen_angels';

// Deity personality affects hint style
export type DeityPersonality =
  | 'encouraging' // Supportive, gentle hints
  | 'stern'       // Direct, demanding hints
  | 'mysterious'  // Cryptic, riddle-like hints
  | 'playful'     // Teasing, mischievous hints
  | 'wrathful'    // Angry, threatening hints
  | 'serene'      // Calm, peaceful hints
  | 'chaotic'     // Unpredictable hints
  | 'gentle'      // Kind, nurturing hints
  | 'aggressive'  // Forceful, proactive hints
  | 'wise'        // Thoughtful, insightful hints
  | 'ancient'     // Primordial, timeless hints
  | 'passionate'  // Intense, emotional hints
  | 'benevolent'  // Generous, life-affirming hints
  | 'dark'        // Shadow, threshold-dwelling hints
  | 'calculating'; // Strategic, deliberate hints

// Stat modifier from deity
export interface StatModifier {
  stat: StatName;
  value: number; // +10 or -5 typically
  type: 'bonus' | 'penalty';
}

// Unique ability granted by deity
export interface DeityAbility {
  id: string;
  name: string;
  description: string;
  unlockFavor: number; // Favor level required (0-100)
  cooldownType: 'per_combat' | 'per_floor' | 'per_run' | 'passive';
  cooldownValue?: number; // For per_combat/per_floor
  effect: {
    type: string;
    value: number;
    duration?: number;
    condition?: string;
  };
}

// God Challenge definition
export interface GodChallenge {
  id: string;
  name: string;
  description: string;
  domain: DeityDomain;
  tier: 'challenging' | 'heroic' | 'legendary';

  // Requirements
  requirement: {
    type: string;
    value: number;
    timeLimit?: number; // Floors to complete
  };

  // Rewards
  favorGain: number;
  bonusStatPoints?: number;
  uniqueBlessing?: string;

  // Failure consequences
  favorLoss: number;
  failurePenalty?: string;
}

// Full deity definition
export interface Deity {
  id: string;
  name: string;
  pantheon: PantheonId;
  domain: DeityDomain;
  personality: DeityPersonality;

  // Lore
  title: string; // "God of War", "Goddess of Wisdom"
  description: string;
  loreSnippet: string; // Brief flavor text

  // Stat effects
  statBonus: StatModifier;
  statPenalty: StatModifier;

  // Domain blessing
  domainBlessing: {
    description: string;
    effectType: string;
    effectValue: number; // Usually +10%
  };

  // Unique ability (unlocked at high favor)
  uniqueAbility: DeityAbility;

  // God Challenges this deity can issue
  challenges: GodChallenge[];

  // Hint style templates
  hintTemplates: {
    encouragement: string[];
    warning: string[];
    achievement: string[];
    combat: string[];
  };
}

// Pantheon grouping
export interface Pantheon {
  id: PantheonId;
  name: string;
  description: string;
  region: string;
  deities: string[]; // Deity IDs
  uniqueMonsters: string[]; // Monster IDs specific to this pantheon
  biomeAffinity: string[]; // Biomes where this pantheon's monsters appear
}

// Player's relationship with their patron deity
export interface DeityRelationship {
  deityId: string;
  favor: number; // 0-100
  blessingsReceived: number;
  challengesCompleted: number;
  challengesFailed: number;
  currentChallenge?: {
    challengeId: string;
    progress: number;
    floorsRemaining?: number;
    startedAt: number;
  };
  hintHistory: {
    hint: string;
    timestamp: number;
    triggerType: string;
  }[];
}

// ===== DEITY CONSTANTS =====

export const DOMAIN_EFFECTS: Record<
  DeityDomain,
  {
    primaryEffect: string;
    secondaryEffect?: string;
    relatedStats: StatName[];
  }
> = {
  war: { primaryEffect: '+10% physical damage', relatedStats: ['STR', 'END'] },
  magic: { primaryEffect: '+10% spell damage', secondaryEffect: '-5% SP cost', relatedStats: ['INT', 'WIS'] },
  trickery: { primaryEffect: '+10% dodge chance', relatedStats: ['AGI', 'LCK'] },
  death: { primaryEffect: '+10% damage vs undead', relatedStats: ['WIS', 'END'] },
  fortune: { primaryEffect: '+10% loot quality', relatedStats: ['LCK', 'CHA'] },
  nature: { primaryEffect: '+10% healing received', relatedStats: ['WIS', 'END'] },
  wisdom: { primaryEffect: '+10% skill learning', relatedStats: ['WIS', 'INT'] },
  craft: { primaryEffect: '+10% crafting success', relatedStats: ['STR', 'INT'] },
  authority: { primaryEffect: '+10% intimidation', relatedStats: ['CHA', 'STR'] },
  life: { primaryEffect: '+10% HP regen', relatedStats: ['END', 'WIS'] },
  sea: { primaryEffect: '+10% water magic', relatedStats: ['WIS', 'AGI'] },
  sky: { primaryEffect: '+10% lightning damage', relatedStats: ['AGI', 'INT'] },
  fire: { primaryEffect: '+10% fire damage', relatedStats: ['INT', 'STR'] },
  knowledge: { primaryEffect: '+10% enemy info revealed', relatedStats: ['INT', 'PER'] },
};

export const PANTHEON_INFO: Record<
  PantheonId,
  {
    name: string;
    region: string;
    description: string;
  }
> = {
  greek: { name: 'Greek', region: 'Ancient Greece', description: 'The Olympians and their kin' },
  norse: { name: 'Norse', region: 'Scandinavia', description: 'The Aesir and Vanir' },
  egyptian: { name: 'Egyptian', region: 'Ancient Egypt', description: 'The Ennead and Ogdoad' },
  japanese: { name: 'Japanese', region: 'Japan', description: 'The Kami and spirits' },
  celtic: { name: 'Celtic', region: 'British Isles', description: 'The Tuatha Dé Danann' },
  mesopotamian: { name: 'Mesopotamian', region: 'Mesopotamia', description: 'Sumerian, Akkadian, and Babylonian gods' },
  hindu: { name: 'Hindu', region: 'Indian Subcontinent', description: 'The Devas and Devis' },
  chinese: { name: 'Chinese', region: 'China', description: 'The Celestial Bureaucracy' },
  slavic: { name: 'Slavic', region: 'Eastern Europe', description: 'Ancient Slavic deities' },
  aztec: { name: 'Aztec', region: 'Mesoamerica', description: 'The sun gods and their court' },
  maya: { name: 'Maya', region: 'Central America', description: 'Lords of Xibalba' },
  inca: { name: 'Inca', region: 'South America', description: 'Children of the Sun' },
  yoruba: { name: 'Yoruba', region: 'West Africa', description: 'The Orishas' },
  polynesian: { name: 'Polynesian', region: 'Pacific Islands', description: 'Gods of the ocean and sky' },
  persian: { name: 'Persian', region: 'Ancient Persia', description: 'Pre-Zoroastrian Yazatas' },
  vodou: { name: 'Vodou', region: 'Caribbean/West Africa', description: 'The Lwa and spirits' },
  shinto: { name: 'Shinto', region: 'Japan', description: 'Nature spirits and ancestral kami' },
  ars_goetia: { name: 'Ars Goetia', region: 'Occult Traditions', description: 'The 72 demons of Solomon' },
  fallen_angels: { name: 'Fallen Angels', region: 'Abrahamic Traditions', description: 'Those who fell from grace' },
};

// ===== FAVOR TIER SYSTEM =====

/**
 * Favor tiers determine the blessing multiplier applied to all derived stats
 * This creates meaningful gameplay impact from deity relationship management
 */
export interface FavorTier {
  min: number;
  max: number;
  name: string;
  multiplier: number;
  description: string;
}

export const FAVOR_TIERS: FavorTier[] = [
  { min: 0, max: 10, name: 'Abandoned', multiplier: 0.50, description: 'Your deity has forsaken you. All stats halved.' },
  { min: 11, max: 30, name: 'Disfavored', multiplier: 0.75, description: 'Your deity disapproves. Stats reduced by 25%.' },
  { min: 31, max: 60, name: 'Neutral', multiplier: 1.00, description: 'Your deity watches impassively. No bonuses or penalties.' },
  { min: 61, max: 80, name: 'Favored', multiplier: 1.15, description: 'Your deity smiles upon you. Stats increased by 15%.' },
  { min: 81, max: 90, name: 'Blessed', multiplier: 1.35, description: 'Divine power flows through you. Stats increased by 35%.' },
  { min: 91, max: 100, name: 'Chosen', multiplier: 1.50, description: 'You are your deity\'s champion. Stats increased by 50%.' },
];

/**
 * Get the blessing multiplier based on current favor level
 * This multiplier is applied to ALL derived stats (HP, attack, defense, etc.)
 */
export function getBlessingMultiplier(favor: number): number {
  const clampedFavor = Math.max(0, Math.min(100, favor));

  for (const tier of FAVOR_TIERS) {
    if (clampedFavor >= tier.min && clampedFavor <= tier.max) {
      return tier.multiplier;
    }
  }

  return 1.0; // Fallback to neutral
}

/**
 * Get the favor tier name for display
 */
export function getFavorTierName(favor: number): string {
  const clampedFavor = Math.max(0, Math.min(100, favor));

  for (const tier of FAVOR_TIERS) {
    if (clampedFavor >= tier.min && clampedFavor <= tier.max) {
      return tier.name;
    }
  }

  return 'Neutral';
}

/**
 * Get the full favor tier info for display
 */
export function getFavorTier(favor: number): FavorTier {
  const clampedFavor = Math.max(0, Math.min(100, favor));

  for (const tier of FAVOR_TIERS) {
    if (clampedFavor >= tier.min && clampedFavor <= tier.max) {
      return tier;
    }
  }

  // Return neutral as fallback
  return FAVOR_TIERS[2];
}

// ===== UTILITY FUNCTIONS =====

/**
 * Calculate effective blessing power based on favor
 * @deprecated Use getBlessingMultiplier instead for stat calculations
 */
export function calculateBlessingPower(basePower: number, favor: number): number {
  // Favor 0-50: 50%-100% of base power
  // Favor 51-100: 100%-150% of base power
  const favorMultiplier = 0.5 + (favor / 100);
  return basePower * favorMultiplier;
}

/**
 * Get hint based on deity personality
 */
export function getDeityHint(
  deity: Deity,
  hintType: 'encouragement' | 'warning' | 'achievement' | 'combat'
): string {
  const templates = deity.hintTemplates[hintType];
  if (!templates || templates.length === 0) {
    return 'Your patron watches in silence...';
  }
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Check if deity approves of an achievement based on domain
 */
export function checkDeityApproval(
  deity: Deity,
  achievementDomain?: string
): 'enthusiastic' | 'standard' | 'reluctant' | 'refused' {
  if (!achievementDomain) return 'standard';

  // Same domain = enthusiastic
  if (achievementDomain === deity.domain) return 'enthusiastic';

  // Related domains
  const relatedDomains: Record<DeityDomain, DeityDomain[]> = {
    war: ['authority', 'fire'],
    magic: ['wisdom', 'knowledge'],
    trickery: ['fortune', 'death'],
    death: ['wisdom', 'trickery'],
    fortune: ['trickery', 'craft'],
    nature: ['life', 'sea'],
    wisdom: ['magic', 'knowledge'],
    craft: ['fire', 'fortune'],
    authority: ['war', 'wisdom'],
    life: ['nature', 'wisdom'],
    sea: ['nature', 'sky'],
    sky: ['fire', 'sea'],
    fire: ['war', 'craft'],
    knowledge: ['wisdom', 'magic'],
  };

  const related = relatedDomains[deity.domain] ?? [];
  if (related.includes(achievementDomain as DeityDomain)) return 'standard';

  // Opposing domains = reluctant or refused
  const opposingDomains: Partial<Record<DeityDomain, DeityDomain[]>> = {
    war: ['life', 'nature'],
    life: ['death', 'war'],
    trickery: ['authority', 'wisdom'],
    authority: ['trickery'],
  };

  const opposing = opposingDomains[deity.domain] ?? [];
  if (opposing.includes(achievementDomain as DeityDomain)) return 'reluctant';

  return 'standard';
}

/**
 * Create initial deity relationship
 */
export function createDeityRelationship(deityId: string): DeityRelationship {
  return {
    deityId,
    favor: 50, // Start neutral
    blessingsReceived: 0,
    challengesCompleted: 0,
    challengesFailed: 0,
    hintHistory: [],
  };
}

/**
 * Calculate favor change from action
 */
export function calculateFavorChange(
  action: 'blessing' | 'challenge_complete' | 'challenge_fail' | 'shrine_offering' | 'domain_action',
  value: number = 1
): number {
  const baseChanges: Record<string, number> = {
    blessing: 5,
    challenge_complete: 15,
    challenge_fail: -10,
    shrine_offering: 3,
    domain_action: 2,
  };

  return (baseChanges[action] ?? 0) * value;
}

/**
 * Check if ability is unlocked based on favor
 */
export function isAbilityUnlocked(ability: DeityAbility, currentFavor: number): boolean {
  return currentFavor >= ability.unlockFavor;
}

/**
 * Get available deity challenges based on favor and completed challenges
 */
export function getAvailableChallenges(
  deity: Deity,
  favor: number,
  completedChallengeIds: string[]
): GodChallenge[] {
  return deity.challenges.filter((challenge) => {
    // Not already completed
    if (completedChallengeIds.includes(challenge.id)) return false;

    // Favor requirements by tier
    const favorRequired: Record<string, number> = {
      challenging: 30,
      heroic: 50,
      legendary: 70,
    };

    return favor >= (favorRequired[challenge.tier] ?? 0);
  });
}
