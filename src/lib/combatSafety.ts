/**
 * Per-character first-combat protection predicate (remediation B-03; KV-AUD-138).
 * The old guard keyed off device-meta flags (useGameStore.totalRuns/hasHadFirstCombat),
 * which only ever protected the first character on the device. In a permadeath game the
 * common case is a fresh character after a death — the protection must follow the character.
 */
import type { Character } from '../types/Character';

export function isFirstCombatForCharacter(
  character: Pick<Character, 'level' | 'runStats'> | null
): boolean {
  if (!character) return false;
  return character.level === 1 && (character.runStats?.monstersKilled ?? 0) === 0;
}
