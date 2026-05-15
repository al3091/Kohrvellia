/**
 * PlayerSnapshot — computed once when the player reaches a boss node.
 * The "soul knowledge" a sentient boss has about this specific player.
 * Immutable during a boss encounter.
 */

import type { StatName } from './Stats';
import type { Character } from './Character';
import type { BehaviorVector } from './Behavement';

export interface PlayerSnapshot {
  // Identity
  characterName: string;
  epithet: string;
  patronDeityName: string;
  primaryStat: StatName;
  secondaryStat: StatName;
  weaponCategory: string;
  weaponName: string;

  // Behavioral flags
  isAggressor: boolean;    // kills >> flees
  isFleeer: boolean;       // has fled at least once this run
  healingReliant: boolean; // heavy consumable use
  reckless: boolean;       // attacked at low HP repeatedly
  observer: boolean;       // passive/cautious tendencies

  // History
  totalDeaths: number;
  isFirstRun: boolean;
  isComebackRun: boolean;  // previous run ended in death within 15 minutes
  deepestEverReached: number;
  currentFloor: number;
  monstersKilledThisRun: number;

  // Deity bond
  deityFavor: 'blessed' | 'neutral' | 'abandoned';
  deityFavorPercent: number;

  // Secrets the boss reveals to make the player feel seen
  favoriteAction: string;
  fleeCount: number;
  consumablesUsed: number;
  dominantVector: BehaviorVector | null;
}

type SoulStoreRef = {
  getBehavementProgress: (id: string) => { currentValue: number } | null;
  getDominantVector: () => BehaviorVector | null;
};

type GameStateRef = {
  totalDeaths: number;
  totalRuns: number;
  bestFloorReached: number;
  runHistory: Array<{ endedAt: number; causeOfDeath: string }>;
};

export function createPlayerSnapshot(
  character: Character,
  currentFloor: number,
  gameState: GameStateRef,
  soul: SoulStoreRef,
  patronDeityName: string
): PlayerSnapshot {
  // Top two invested stats by current-level points
  const statEntries = (Object.entries(character.stats) as [StatName, { points: number }][])
    .sort((a, b) => b[1].points - a[1].points);
  const primaryStat = statEntries[0]?.[0] ?? 'STR';
  const secondaryStat = statEntries[1]?.[0] ?? 'END';

  // Behavement-derived behavioral flags
  const fleeCount = soul.getBehavementProgress('evade_flees_10')?.currentValue ?? 0;
  const lowHpAttacks = soul.getBehavementProgress('risk_low_hp_attacks')?.currentValue ?? 0;
  const consumablesUsed = soul.getBehavementProgress('caution_consumable_use')?.currentValue ?? 0;
  const tauntsUsed = soul.getBehavementProgress('social_taunts')?.currentValue ?? 0;
  const monstersKilled = character.runStats.monstersKilled;

  const isAggressor = monstersKilled > fleeCount * 3;
  const isFleeer = fleeCount > 0;
  const healingReliant = consumablesUsed > 2;
  const reckless = lowHpAttacks >= 5;
  const observer = tauntsUsed === 0 && !healingReliant && !isFleeer && monstersKilled > 3;

  // Deity favor bracket
  const favorPercent = character.deityFavor ?? 50;
  const deityFavor: 'blessed' | 'neutral' | 'abandoned' =
    favorPercent >= 70 ? 'blessed' : favorPercent >= 30 ? 'neutral' : 'abandoned';

  // Approximate favorite action from behavioral signals
  let favoriteAction = 'Attack';
  if (fleeCount > monstersKilled / 3) favoriteAction = 'Flee';
  else if (healingReliant) favoriteAction = 'Heal';
  else if (tauntsUsed > 5) favoriteAction = 'Taunt';
  else if (reckless) favoriteAction = 'Risk';

  // Comeback run: last run ended in death within 15 minutes
  const lastRun = gameState.runHistory[0];
  const lastWasRecent = lastRun && (Date.now() - lastRun.endedAt) < 15 * 60 * 1000;
  const isComebackRun = !!(lastWasRecent && lastRun.causeOfDeath !== 'return');

  return {
    characterName: character.name,
    epithet: character.epithet,
    patronDeityName,
    primaryStat,
    secondaryStat,
    weaponCategory: character.equipment.weapon?.base?.category ?? 'STR',
    weaponName: character.equipment.weapon?.base?.name ?? 'bare fists',
    isAggressor,
    isFleeer,
    healingReliant,
    reckless,
    observer,
    totalDeaths: gameState.totalDeaths,
    isFirstRun: gameState.totalRuns === 0,
    isComebackRun,
    deepestEverReached: gameState.bestFloorReached,
    currentFloor,
    monstersKilledThisRun: monstersKilled,
    deityFavor,
    deityFavorPercent: favorPercent,
    favoriteAction,
    fleeCount,
    consumablesUsed,
    dominantVector: soul.getDominantVector(),
  };
}
