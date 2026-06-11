/**
 * Out-of-combat permadeath commit (remediation B-03; KV-AUD-227/248/254/268).
 * Combat deaths are committed by the combat screen's defeat effect; deaths from
 * starvation, ramifications, or other world damage route through here so a fallen
 * character can never linger "alive" outside the death flow.
 */
import { router } from 'expo-router';
import { useCharacterStore } from '../stores/useCharacterStore';
import { useDungeonStore } from '../stores/useDungeonStore';

export function commitDeathOutOfCombat(killedBy: string): boolean {
  const characterStore = useCharacterStore.getState();
  const character = characterStore.character;
  if (!character || !character.isDead) return false;

  const run = useDungeonStore.getState().currentRun;
  const params = {
    characterName: character.name,
    epithet: character.epithet,
    level: String(character.level),
    floor: String(run?.currentFloor ?? character.runStats?.deepestFloor ?? 1),
    killedBy,
    monstersKilled: String(character.runStats?.monstersKilled ?? 0),
    goldEarned: String(character.runStats?.goldEarned ?? 0),
  };

  useDungeonStore.getState().endRun('death');
  characterStore.discardExcelia();
  characterStore.killCharacter();

  router.replace({ pathname: '/dungeon/epitaph', params });
  return true;
}
