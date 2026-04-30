import type { Job } from '../../types/Job';
import { makeJobKey } from '../../types/Job';
import type { StatName } from '../../types/Stats';
import { JOB_DEFINITIONS } from './jobDefinitions';

export { JOB_DEFINITIONS };

/**
 * Return the 2-4 jobs that match the given top-3-stat combination.
 * Order of the three stats does not matter — they are sorted internally.
 */
export function getJobsForStats(topThree: [StatName, StatName, StatName]): Job[] {
  const key = makeJobKey(topThree);
  return JOB_DEFINITIONS.filter(job => makeJobKey(job.statRequirements) === key);
}

/** Look up a single job by its ID. */
export function getJobById(id: string): Job | undefined {
  return JOB_DEFINITIONS.find(j => j.id === id);
}

/** All distinct stat-combination keys that have at least one job. */
export function getAllJobKeys(): string[] {
  const keys = new Set<string>();
  for (const job of JOB_DEFINITIONS) {
    keys.add(makeJobKey(job.statRequirements));
  }
  return [...keys];
}
