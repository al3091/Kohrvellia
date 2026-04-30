/**
 * Job/Class system types for Kohrvellia
 * Jobs are selected at Level 2 based on the player's top 3 stats.
 * Each stat combination unlocks 2-4 distinct job options.
 */

import type { StatName } from './Stats';
import type { CombatSkill } from './Skill';

export type JobTier = 'base' | 'specialization' | 'advanced';

export interface Job {
  id: string;
  name: string;
  description: string;
  flavorText: string;

  /** The 3 stats that must be the player's highest to unlock this job */
  statRequirements: [StatName, StatName, StatName];

  tier: JobTier;
  /** For specialization/advanced: the parent job this branches from */
  parentJobId?: string;

  /** Skill granted immediately on job selection */
  starterSkill: CombatSkill;

  /** Small stat bonus received on job selection */
  statBonus: { stat: StatName; value: number };
}

/** Lookup all jobs by their stat combination key (sorted stat names joined by '+') */
export type JobStatKey = string; // e.g. "AGI+PER+LCK"

export function makeJobKey(stats: [StatName, StatName, StatName]): JobStatKey {
  return [...stats].sort().join('+');
}
