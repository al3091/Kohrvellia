/**
 * Soul System (Denatus) types for Kohrvellia
 * Hidden tracking of player behavior for Paragon title generation at Level 10
 */

import type { StatName } from './Stats';

// Behavioral vectors (pillars of playstyle)
export type BehaviorVector =
  | 'COMBAT_PHYSICAL'
  | 'COMBAT_MAGIC'
  | 'DEFENSE_TANK'
  | 'DEFENSE_EVASION'
  | 'RISK_TAKING'
  | 'CAUTION'
  | 'SOCIAL'
  | 'EXPLORATION'
  | 'RESOURCE'
  | 'GLORY';

// Weight tiers for behavement difficulty
export type BehavementWeight = 'trivial' | 'easy' | 'moderate' | 'hard' | 'very_hard' | 'extreme' | 'legendary';

// Weight values
export const WEIGHT_VALUES: Record<BehavementWeight, number> = {
  trivial: 1,
  easy: 2,
  moderate: 5,
  hard: 10,
  very_hard: 25,
  extreme: 50,
  legendary: 100,
};

// Single behavement definition
export interface Behavement {
  id: string;
  name: string;
  description: string;
  vector: BehaviorVector;
  target: number; // Goal value to complete
  weight: BehavementWeight;
  trackingType: 'cumulative' | 'threshold' | 'percentage' | 'consecutive';
}

// Player's progress on a behavement
export interface BehavementProgress {
  behavementId: string;
  current: number;
  target: number;
  weight: number; // Numeric weight value
  vector: BehaviorVector;
  completed: boolean;
}

// CR Adjective tiers (based on overall score)
export type CRAdjective =
  | 'Novice'
  | 'Apprentice'
  | 'Journeyman'
  | 'Adept'
  | 'Expert'
  | 'Master'
  | 'Grandmaster'
  | 'Heroic'
  | 'Legendary'
  | 'Mythic';

// CR score ranges
export const CR_ADJECTIVE_RANGES: Array<{ min: number; max: number; adjective: CRAdjective; magnitude: number }> = [
  { min: 0, max: 20, adjective: 'Novice', magnitude: 1.0 },
  { min: 21, max: 35, adjective: 'Apprentice', magnitude: 1.2 },
  { min: 36, max: 50, adjective: 'Journeyman', magnitude: 1.4 },
  { min: 51, max: 65, adjective: 'Adept', magnitude: 1.6 },
  { min: 66, max: 75, adjective: 'Expert', magnitude: 1.8 },
  { min: 76, max: 85, adjective: 'Master', magnitude: 2.0 },
  { min: 86, max: 92, adjective: 'Grandmaster', magnitude: 2.3 },
  { min: 93, max: 97, adjective: 'Heroic', magnitude: 2.6 },
  { min: 98, max: 99, adjective: 'Legendary', magnitude: 2.8 },
  { min: 100, max: 100, adjective: 'Mythic', magnitude: 3.0 },
];

// Stat adjective combinations (28 total)
export type StatAdjective =
  | 'Iron' | 'Savage' | 'Arcane' | 'Holy' | 'Precise' | 'Commanding' | 'Fortunate'
  | 'Resilient' | 'Stalwart' | 'Patient' | 'Vigilant' | 'Steadfast' | 'Enduring'
  | 'Swift' | 'Graceful' | 'Keen' | 'Dashing' | 'Elusive'
  | 'Sage' | 'Analytical' | 'Eloquent' | 'Brilliant'
  | 'Enlightened' | 'Divine' | 'Fated'
  | 'Charming' | 'Sharp' | 'Golden';

// Stat combination to adjective mapping
export const STAT_ADJECTIVE_MAP: Record<string, StatAdjective> = {
  'STR_END': 'Iron',
  'STR_AGI': 'Savage',
  'STR_INT': 'Arcane',
  'STR_WIS': 'Holy',
  'STR_PER': 'Precise',
  'STR_CHA': 'Commanding',
  'STR_LCK': 'Fortunate',
  'END_AGI': 'Resilient',
  'END_INT': 'Stalwart',
  'END_WIS': 'Patient',
  'END_PER': 'Vigilant',
  'END_CHA': 'Steadfast',
  'END_LCK': 'Enduring',
  'AGI_INT': 'Swift',
  'AGI_WIS': 'Graceful',
  'AGI_PER': 'Keen',
  'AGI_CHA': 'Dashing',
  'AGI_LCK': 'Elusive',
  'INT_WIS': 'Sage',
  'INT_PER': 'Analytical',
  'INT_CHA': 'Eloquent',
  'INT_LCK': 'Brilliant',
  'WIS_PER': 'Enlightened',
  'WIS_CHA': 'Divine',
  'WIS_LCK': 'Fated',
  'PER_CHA': 'Charming',
  'PER_LCK': 'Sharp',
  'CHA_LCK': 'Golden',
};

// Skill nouns by dominant vector
export type SkillNoun =
  | 'Slayer' | 'Warrior' | 'Destroyer' | 'Berserker'
  | 'Invoker' | 'Mage' | 'Sorcerer' | 'Arcanist'
  | 'Guardian' | 'Sentinel' | 'Bulwark' | 'Protector'
  | 'Shadow' | 'Phantom' | 'Ghost' | 'Specter'
  | 'Gambler' | 'Daredevil' | 'Madman' | 'Reckless'
  | 'Tactician' | 'Strategist' | 'Planner' | 'Analyst'
  | 'Diplomat' | 'Negotiator' | 'Merchant' | 'Envoy'
  | 'Seeker' | 'Explorer' | 'Pioneer' | 'Wanderer'
  | 'Artisan' | 'Smith' | 'Creator' | 'Hoarder'
  | 'Champion' | 'Legend' | 'Demigod';

// Vector to primary noun mapping
export const VECTOR_NOUNS: Record<BehaviorVector, { primary: SkillNoun; secondary: SkillNoun[] }> = {
  COMBAT_PHYSICAL: { primary: 'Slayer', secondary: ['Warrior', 'Destroyer', 'Berserker'] },
  COMBAT_MAGIC: { primary: 'Invoker', secondary: ['Mage', 'Sorcerer', 'Arcanist'] },
  DEFENSE_TANK: { primary: 'Guardian', secondary: ['Sentinel', 'Bulwark', 'Protector'] },
  DEFENSE_EVASION: { primary: 'Shadow', secondary: ['Phantom', 'Ghost', 'Specter'] },
  RISK_TAKING: { primary: 'Gambler', secondary: ['Daredevil', 'Madman', 'Reckless'] },
  CAUTION: { primary: 'Tactician', secondary: ['Strategist', 'Planner', 'Analyst'] },
  SOCIAL: { primary: 'Diplomat', secondary: ['Negotiator', 'Merchant', 'Envoy'] },
  EXPLORATION: { primary: 'Seeker', secondary: ['Explorer', 'Pioneer', 'Wanderer'] },
  RESOURCE: { primary: 'Artisan', secondary: ['Smith', 'Creator', 'Hoarder'] },
  GLORY: { primary: 'Champion', secondary: ['Legend', 'Demigod'] },
};

// Noun passive abilities
export interface NounPassive {
  noun: SkillNoun;
  description: string;
  effect: { type: string; value: number };
}

export const NOUN_PASSIVES: Partial<Record<SkillNoun, NounPassive>> = {
  Slayer: { noun: 'Slayer', description: '+20% physical damage', effect: { type: 'physical_damage', value: 0.2 } },
  Invoker: { noun: 'Invoker', description: '+20% magic damage, -10% SP cost', effect: { type: 'magic_damage', value: 0.2 } },
  Guardian: { noun: 'Guardian', description: '+25% damage reduction', effect: { type: 'damage_reduction', value: 0.25 } },
  Shadow: { noun: 'Shadow', description: '+30% dodge chance', effect: { type: 'dodge_chance', value: 0.3 } },
  Gambler: { noun: 'Gambler', description: '+50% crit damage, -10% HP', effect: { type: 'crit_damage', value: 0.5 } },
  Tactician: { noun: 'Tactician', description: '+20% item effectiveness', effect: { type: 'item_effectiveness', value: 0.2 } },
  Diplomat: { noun: 'Diplomat', description: '+30% reputation gain', effect: { type: 'reputation_gain', value: 0.3 } },
  Seeker: { noun: 'Seeker', description: '+25% loot discovery', effect: { type: 'loot_discovery', value: 0.25 } },
  Artisan: { noun: 'Artisan', description: '+20% gold, +15% crafting', effect: { type: 'gold_bonus', value: 0.2 } },
  Champion: { noun: 'Champion', description: '+25% achievement tier bonuses', effect: { type: 'tier_bonus', value: 0.25 } },
  Legend: { noun: 'Legend', description: '+50% tier bonuses, -10% enemy accuracy', effect: { type: 'tier_bonus', value: 0.5 } },
  Demigod: { noun: 'Demigod', description: 'Auto-dodge first lethal per floor, +100% tier bonuses', effect: { type: 'tier_bonus', value: 1.0 } },
};

// Generated Paragon title
export interface GeneratedTitle {
  crAdjective: CRAdjective;
  statAdjective: StatAdjective;
  skillNoun: SkillNoun;
  fullTitle: string; // "Legendary Arcane Slayer"
  magnitude: number; // CR magnitude multiplier
  buffs: ParagonBuffs;
}

// Buffs granted by Paragon title
export interface ParagonBuffs {
  statBonus: { stat1: StatName; stat2: StatName; percentage: number };
  nounPassive: NounPassive;
  magnitudeMultiplier: number;
}

// Deity hint for soul development
export interface DeityHint {
  message: string;
  triggerType: 'vector_rise' | 'vector_dominant' | 'behavement_complete' | 'stat_shift';
  timestamp: number;
}

// Full Denatus (Soul) state
export interface DenatusState {
  behavements: BehavementProgress[];
  vectorScores: Record<BehaviorVector, number>;
  lastCalculatedTitle: GeneratedTitle | null;
  hintHistory: DeityHint[];
}

// ===== UTILITY FUNCTIONS =====

/**
 * Calculate weighted behavement score (0-100)
 */
export function calculateBehavementScore(behavements: BehavementProgress[]): number {
  let totalWeightedProgress = 0;
  let totalMaxWeight = 0;

  for (const b of behavements) {
    const progress = Math.min(b.current / b.target, 1.0);
    totalWeightedProgress += progress * b.weight;
    totalMaxWeight += b.weight;
  }

  if (totalMaxWeight === 0) return 0;
  return (totalWeightedProgress / totalMaxWeight) * 100;
}

/**
 * Get CR adjective from score
 */
export function getCRAdjectiveFromScore(score: number): CRAdjective {
  for (const range of CR_ADJECTIVE_RANGES) {
    if (score >= range.min && score <= range.max) {
      return range.adjective;
    }
  }
  return 'Novice';
}

/**
 * Get magnitude multiplier for a CR adjective
 */
export function getMagnitudeForAdjective(adjective: CRAdjective): number {
  const range = CR_ADJECTIVE_RANGES.find((r) => r.adjective === adjective);
  return range?.magnitude ?? 1.0;
}

/**
 * Get stat adjective from top 2 stats
 */
export function getStatAdjective(stat1: StatName, stat2: StatName): StatAdjective {
  // Sort alphabetically to create consistent key
  const sorted = [stat1, stat2].sort();
  const key = `${sorted[0]}_${sorted[1]}`;
  return STAT_ADJECTIVE_MAP[key] ?? 'Iron'; // Default fallback
}

/**
 * Calculate dominant vector from behavement progress
 */
export function getDominantVector(vectorScores: Record<BehaviorVector, number>): BehaviorVector {
  let highest: BehaviorVector = 'COMBAT_PHYSICAL';
  let highestScore = 0;

  for (const [vector, score] of Object.entries(vectorScores)) {
    if (score > highestScore) {
      highestScore = score;
      highest = vector as BehaviorVector;
    }
  }

  return highest;
}

/**
 * Get skill noun from dominant vector
 */
export function getSkillNoun(
  dominantVector: BehaviorVector,
  vectorScores: Record<BehaviorVector, number>
): SkillNoun {
  const vectorData = VECTOR_NOUNS[dominantVector];

  // Special GLORY handling for tiered nouns
  if (dominantVector === 'GLORY') {
    const gloryScore = vectorScores.GLORY ?? 0;
    const totalScore = Object.values(vectorScores).reduce((a, b) => a + b, 0);
    const gloryPercentage = totalScore > 0 ? (gloryScore / totalScore) * 100 : 0;

    if (gloryPercentage >= 80) return 'Demigod';
    if (gloryPercentage >= 50) return 'Legend';
    return 'Champion';
  }

  // Check if second highest is within 10% for secondary noun consideration
  const scores = Object.entries(vectorScores).sort(([, a], [, b]) => b - a);
  if (scores.length >= 2) {
    const [, topScore] = scores[0];
    const [, secondScore] = scores[1];

    if (topScore > 0 && (secondScore / topScore) >= 0.9) {
      // Close contest - use secondary noun
      const secondaryIndex = Math.floor(Math.random() * vectorData.secondary.length);
      return vectorData.secondary[secondaryIndex];
    }
  }

  return vectorData.primary;
}

/**
 * Calculate vector scores from behavement progress
 */
export function calculateVectorScores(behavements: BehavementProgress[]): Record<BehaviorVector, number> {
  const scores: Record<BehaviorVector, number> = {
    COMBAT_PHYSICAL: 0,
    COMBAT_MAGIC: 0,
    DEFENSE_TANK: 0,
    DEFENSE_EVASION: 0,
    RISK_TAKING: 0,
    CAUTION: 0,
    SOCIAL: 0,
    EXPLORATION: 0,
    RESOURCE: 0,
    GLORY: 0,
  };

  for (const b of behavements) {
    const progress = Math.min(b.current / b.target, 1.0);
    scores[b.vector] += progress * b.weight;
  }

  return scores;
}

/**
 * Generate full Paragon title
 */
export function generateParagonTitle(
  behavements: BehavementProgress[],
  topStats: [StatName, StatName]
): GeneratedTitle {
  const score = calculateBehavementScore(behavements);
  const crAdjective = getCRAdjectiveFromScore(score);
  const magnitude = getMagnitudeForAdjective(crAdjective);

  const statAdjective = getStatAdjective(topStats[0], topStats[1]);

  const vectorScores = calculateVectorScores(behavements);
  const dominantVector = getDominantVector(vectorScores);
  const skillNoun = getSkillNoun(dominantVector, vectorScores);

  const nounPassive = NOUN_PASSIVES[skillNoun] ?? {
    noun: skillNoun,
    description: 'No passive',
    effect: { type: 'none', value: 0 },
  };

  // Calculate stat bonus percentage (15% base * magnitude)
  const statBonusPercentage = 0.15 * magnitude;

  return {
    crAdjective,
    statAdjective,
    skillNoun,
    fullTitle: `${crAdjective} ${statAdjective} ${skillNoun}`,
    magnitude,
    buffs: {
      statBonus: {
        stat1: topStats[0],
        stat2: topStats[1],
        percentage: statBonusPercentage,
      },
      nounPassive,
      magnitudeMultiplier: magnitude,
    },
  };
}

/**
 * Create initial Denatus state
 */
export function createInitialDenatusState(): DenatusState {
  return {
    behavements: [],
    vectorScores: {
      COMBAT_PHYSICAL: 0,
      COMBAT_MAGIC: 0,
      DEFENSE_TANK: 0,
      DEFENSE_EVASION: 0,
      RISK_TAKING: 0,
      CAUTION: 0,
      SOCIAL: 0,
      EXPLORATION: 0,
      RESOURCE: 0,
      GLORY: 0,
    },
    lastCalculatedTitle: null,
    hintHistory: [],
  };
}

/**
 * Create behavement progress from definition
 */
export function createBehavementProgress(behavement: Behavement): BehavementProgress {
  return {
    behavementId: behavement.id,
    current: 0,
    target: behavement.target,
    weight: WEIGHT_VALUES[behavement.weight],
    vector: behavement.vector,
    completed: false,
  };
}
