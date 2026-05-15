/**
 * PlayerSnapshot — computed once when the player enters a milestone boss node.
 *
 * DESIGN RULE: Each character is a completely different mortal.
 * The boss has never met this specific person. They sense ARCHETYPES
 * from centuries of collective memory — not personal history.
 *
 * What bosses CAN sense:
 * - The weapon (visible)
 * - Deity alignment (divine entities detect sacred marks)
 * - Adventurer archetype (pattern-matched from killing that type for centuries)
 * - This run's approach style (observable behavior: aggressive/cautious/desperate)
 * - Whether any prior challenger has ever reached this boss (guild history)
 *
 * What bosses CANNOT sense:
 * - How many characters the player has created
 * - Any previous character's death count
 * - "Comeback" timing from a previous mortal's run
 */

import type { StatName } from './Stats';
import type { Character } from './Character';
import type { BehaviorVector } from './Behavement';

export type AdventurerArchetype =
  | 'Berserker'   // STR — brute force, predictable
  | 'Shadow'      // AGI — fast, dies when cornered
  | 'Hunter'      // PER — patient, precise, frustrating
  | 'Arcanist'    // INT — powerful burst, fragile if disrupted
  | 'Paladin'     // WIS — defensive, sustained, stubborn
  | 'Performer'   // CHA — surprising, morale-based
  | 'Bulwark'     // END — slow, durable, attrition
  | 'Gambler';    // LCK — unpredictable, high variance

const ARCHETYPE_MAP: Record<string, AdventurerArchetype> = {
  STR: 'Berserker', AGI: 'Shadow', PER: 'Hunter', INT: 'Arcanist',
  WIS: 'Paladin', CHA: 'Performer', END: 'Bulwark', LCK: 'Gambler',
};

export interface PlayerSnapshot {
  // Identity (visible to the boss)
  characterName: string;
  epithet: string;
  patronDeityName: string;
  deityDomain: string;         // e.g. "War", "Trickery", "Death" — divine entities sense this
  primaryStat: StatName;
  weaponCategory: string;
  weaponName: string;

  // Archetype (collective memory pattern-match)
  adventurerArchetype: AdventurerArchetype;

  // Approach style (observable from THIS run's behavior)
  approachStyle: 'aggressive' | 'methodical' | 'desperate' | 'cautious';

  // Behavioral flags (THIS run only)
  isAggressor: boolean;
  isFleeer: boolean;
  healingReliant: boolean;
  reckless: boolean;
  observer: boolean;

  // Guild/encounter history (what the boss DOES legitimately know)
  isFirstEverEncounter: boolean;   // Has ANY character ever reached this specific boss?
  bossDefeatedBefore: boolean;     // Was this boss already slain by a previous character?

  // Current run stats (observable)
  currentFloor: number;
  monstersKilledThisRun: number;
  fleeCount: number;
  consumablesUsed: number;

  // Deity bond (observable by divine senses)
  deityFavor: 'blessed' | 'neutral' | 'abandoned';
  deityFavorPercent: number;

  // Stat points for gate checks (CHA bypass, LCK cache, WIS reveal)
  statPoints: Record<StatName, number>;

  // Soul vector (for boss flavor, not personal attribution)
  dominantVector: BehaviorVector | null;
}

type SoulStoreRef = {
  getBehavementProgress: (id: string) => { currentValue: number } | null;
  getDominantVector: () => BehaviorVector | null;
};

type GameStateRef = {
  defeatedBosses: string[];
};

export function createPlayerSnapshot(
  character: Character,
  currentFloor: number,
  gameState: GameStateRef,
  soul: SoulStoreRef,
  patronDeityName: string,
  deityDomain: string,
  bossId?: string
): PlayerSnapshot {
  // Primary stat by current-level points
  const statEntries = (Object.entries(character.stats) as [StatName, { points: number }][])
    .sort((a, b) => b[1].points - a[1].points);
  const primaryStat = statEntries[0]?.[0] ?? 'STR';

  // Weapon info
  const weaponCategory = character.equipment.weapon?.base?.category ?? 'STR';
  const weaponName = character.equipment.weapon?.base?.name ?? 'bare fists';
  const adventurerArchetype = ARCHETYPE_MAP[weaponCategory] ?? 'Berserker';

  // Behavement tracking — THIS RUN ONLY
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

  // Approach style from this run's signals
  let approachStyle: PlayerSnapshot['approachStyle'];
  if (consumablesUsed > 5 || fleeCount > 3) approachStyle = 'desperate';
  else if (monstersKilled > fleeCount * 3 && !observer) approachStyle = 'aggressive';
  else if (observer) approachStyle = 'methodical';
  else approachStyle = 'cautious';

  // Deity favor bracket
  const favorPercent = character.deityFavor ?? 50;
  const deityFavor: 'blessed' | 'neutral' | 'abandoned' =
    favorPercent >= 70 ? 'blessed' : favorPercent >= 30 ? 'neutral' : 'abandoned';

  // Boss encounter history (from permanent meta-progression)
  const isFirstEverEncounter = !bossId || !gameState.defeatedBosses.some(id => id === bossId);
  const bossDefeatedBefore = bossId ? gameState.defeatedBosses.includes(bossId) : false;

  // Stat points for dialogue gate checks
  const statPoints: Record<StatName, number> = {
    STR: character.stats.STR.points,
    PER: character.stats.PER.points,
    END: character.stats.END.points,
    CHA: character.stats.CHA.points,
    INT: character.stats.INT.points,
    AGI: character.stats.AGI.points,
    WIS: character.stats.WIS.points,
    LCK: character.stats.LCK.points,
  };

  return {
    characterName: character.name,
    epithet: character.epithet,
    patronDeityName,
    deityDomain,
    primaryStat,
    weaponCategory,
    weaponName,
    adventurerArchetype,
    approachStyle,
    isAggressor,
    isFleeer,
    healingReliant,
    reckless,
    observer,
    isFirstEverEncounter,
    bossDefeatedBefore,
    currentFloor,
    monstersKilledThisRun: monstersKilled,
    fleeCount,
    consumablesUsed,
    deityFavor,
    deityFavorPercent: favorPercent,
    statPoints,
    dominantVector: soul.getDominantVector(),
  };
}
