/**
 * Shared utility to reset all persisted stores before starting a new game.
 * Call this from every entry point that leads to character creation:
 *   - Title screen (New Game button)
 *   - Epitaph screen (Begin Again button)
 *   - Tutorial end (Enter the Tower button)
 */

import { useCharacterStore } from '../stores/useCharacterStore';
import { useDungeonStore } from '../stores/useDungeonStore';
import { useAchievementStore } from '../stores/useAchievementStore';
import { useSoulStore } from '../stores/useSoulStore';
import { useJobStore } from '../stores/useJobStore';
import { useDeityStore } from '../stores/useDeityStore';
import { clearWeaponRegistry } from '../data/weaponRegistry';

export function clearAllStores(): void {
  useCharacterStore.getState().deleteCharacter();
  useDungeonStore.getState().clearAllData();
  useAchievementStore.getState().resetAllProgress();
  clearWeaponRegistry();
  useSoulStore.getState().reset();
  useJobStore.getState().reset();
  useDeityStore.getState().reset();
}
