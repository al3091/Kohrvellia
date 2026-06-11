/**
 * Shared utility to reset all per-character persisted state before starting a new game.
 * Call this from every entry point that leads to character creation:
 *   - Title screen (New Game button)
 *   - Epitaph screen (Begin Again button)
 *   - Tutorial end (Enter the Tower button)
 *
 * Deliberately NOT reset: useGameStore (device meta-progression: run history, defeated
 * bosses, monster knowledge, settings) and the LIFETIME sacred-item metrics
 * (account-wide acquisition scopes survive permadeath by design).
 */

import { useCharacterStore } from '../stores/useCharacterStore';
import { useDungeonStore } from '../stores/useDungeonStore';
import { useAchievementStore } from '../stores/useAchievementStore';
import { useSoulStore } from '../stores/useSoulStore';
import { useJobStore } from '../stores/useJobStore';
import { useDeityStore } from '../stores/useDeityStore';
import { useMarketStore } from '../stores/useMarketStore';
import { useBlacksmithStore } from '../stores/useBlacksmithStore';
import { useShopStore } from '../stores/useShopStore';
import { useSacredItemStore } from '../stores/useSacredItemStore';
import { clearWeaponRegistry } from '../data/weaponRegistry';

export function clearAllStores(): void {
  useCharacterStore.getState().deleteCharacter();
  useDungeonStore.getState().clearAllData();
  useAchievementStore.getState().resetAllProgress();
  clearWeaponRegistry();
  useSoulStore.getState().reset();
  useJobStore.getState().reset();
  useDeityStore.getState().reset();
  useMarketStore.getState().reset();
  useBlacksmithStore.getState().reset();
  // KV-AUD-002 (B-03): the two stores the old reset skipped — a dead character's
  // merchant memory (104) and sacred unlocks/character metrics (098) no longer
  // bleed into the next life.
  useShopStore.getState().resetForNewCharacter();
  useSacredItemStore.getState().resetForNewCharacter();
}
