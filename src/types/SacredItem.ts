/**
 * Sacred Item System — Pantheon Sets, Domain Artifacts, Deity Relics
 *
 * Three tiers of divine equipment, each with specific acquisition conditions.
 * Normal items drop from the dungeon. Sacred items must be EARNED.
 */

import type { PantheonId } from './Deity';
import type { StatName } from './Stats';

// ===== TIER DEFINITIONS =====

export type SacredTier = 'pantheon' | 'domain' | 'deity';

export type SacredSlot = 'weapon' | 'head' | 'chest' | 'hands' | 'legs' | 'accessory';

export type DomainId =
  | 'war' | 'magic' | 'trickery' | 'death' | 'fortune' | 'nature'
  | 'wisdom' | 'craft' | 'authority' | 'life' | 'sea' | 'sky' | 'fire' | 'knowledge';

// ===== ACQUISITION CONDITIONS =====

export type AcquisitionScope =
  | 'lifetime'         // Counts across ALL characters ever played
  | 'single_character' // Must be done on one character (resets on death)
  | 'single_run'       // Must be done in one dungeon run without dying
  | 'single_combat';   // Must be done in one fight

export type AcquisitionMetric =
  | 'kills_total'              // Total enemy kills
  | 'kills_with_stat'          // Kills using a specific scaling stat weapon
  | 'kills_type'               // Kills against a specific monster type
  | 'boss_kills'               // Milestone boss kills
  | 'boss_kills_run'           // Boss kills in a single run
  | 'boss_nodamage'            // Beat boss without taking damage
  | 'boss_noattack'            // Beat boss without using basic attack
  | 'boss_skillonly'           // Beat boss using only skills
  | 'boss_bypass'              // Talked past boss (boss_bypassed flag)
  | 'floors_reached'           // Deepest floor reached
  | 'floors_nodeath'           // Floors without dying (run)
  | 'floor_noconsumable'       // Full floor with no consumable use
  | 'floor_nodefend'           // Consecutive fights without Defend action
  | 'floor_noretreat'          // Full run without fleeing
  | 'consecutive_fights'       // Fights without specific condition
  | 'dodges_total'             // Total dodges / enemy misses
  | 'observe_total'            // Times used Observe action
  | 'taunt_total'              // Times used Taunt action
  | 'flee_total'               // Times successfully fled
  | 'flee_elite'               // Times fled from elites specifically
  | 'flee_boss'                // Times fled from bosses
  | 'status_inflict'           // Status effects inflicted
  | 'status_received_survived' // Status effects received and survived
  | 'damage_taken_run'         // Damage taken in a single run
  | 'skill_uses'               // Skills used
  | 'skill_sp_spent'           // Total SP spent on skills
  | 'gold_accumulated'         // Gold accumulated total
  | 'gold_spent_blacksmith'    // Gold spent at Blacksmith
  | 'weapon_upgrades'          // Number of weapon upgrades performed
  | 'weapon_legendary'         // Upgraded a weapon to Legendary
  | 'treasure_rooms'           // Treasure rooms found
  | 'mystery_rooms'            // Mystery rooms explored
  | 'event_success'            // Event rooms passed
  | 'rest_sites_used'          // Rest sites used
  | 'familia_visits'           // Visits to Familia Home
  | 'shop_visits'              // Shop visits
  | 'achievements_total'       // Achievements completed
  | 'level_reached'            // Level reached
  | 'paragon'                  // Reached Level 10
  | 'favor_favoured_child'     // Reached Favoured Child status
  | 'stats_grade'              // N stats at given grade
  | 'healing_received'         // Total healing received
  | 'items_destroyed'          // Items destroyed
  | 'same_weapon_run'          // Used same weapon whole run (never swapped)
  | 'debuffs_active_boss'      // Specific debuffs active when killing boss
  | 'sp_damage_dealt'          // SP damage or total damage dealt
  | 'custom';                  // Any complex bespoke condition

export interface AcquisitionRequirement {
  metric: AcquisitionMetric;
  value: number;
  targetType?: string;   // e.g. 'STR' for kills_with_stat, 'undead' for kills_type
  description: string;   // Human-readable explanation
}

export interface AcquisitionCondition {
  scope: AcquisitionScope;
  requirements: AcquisitionRequirement[];
  requireAll: boolean;  // AND vs OR logic
  /** Optional: additional constraint that must hold (e.g. "also never fled this run") */
  forbiddenActions?: string[];
}

// ===== SACRED ITEM STATS =====

export interface SacredWeaponStats {
  scalingStat: StatName;
  secondaryStat?: StatName;   // Some sacred weapons scale off 2 stats
  finalDamage: number;
  finalAccuracy: number;      // Usually 90-110%
  finalCritChance: number;    // As decimal, 0.20 = 20%
  range: 'melee' | 'ranged';
  damageType: 'physical' | 'magic' | 'holy' | 'dark' | 'chaos';
  /** True if this weapon can never miss */
  neverMisses?: boolean;
}

export interface SacredArmorStats {
  slot: Exclude<SacredSlot, 'weapon' | 'accessory'>;
  armorType: 'light' | 'medium' | 'heavy' | 'robes' | 'divine'; // divine = no penalties
  finalDefense: number;
  finalMagicDefense: number;
  speedPenalty: number;       // 0 for divine tier
  statBonuses: Partial<Record<StatName, number>>;
}

export interface SacredAccessoryStats {
  accessoryType: 'ring' | 'amulet' | 'talisman' | 'seal' | 'charm' | 'fragment';
  statBonuses: Partial<Record<StatName, number>>;
  resistances?: { type: string; value: number }[];
}

// ===== THE SACRED ITEM =====

export interface SacredItem {
  id: string;
  name: string;
  lore: string;               // 1-2 sentence flavor text
  tier: SacredTier;
  slot: SacredSlot;

  // Origin
  pantheonId?: PantheonId;
  domainId?: DomainId;
  deityId?: string;
  setId?: string;             // e.g. 'greek_olympian'
  setPieceIndex?: number;     // 0–6 within the set

  // Discovery — when does the player learn this exists?
  revealFavorRequired: number;  // 0=always visible, 30/60/80 for pantheon, 100 for deity
  acquisitionHint: string;    // Cryptic clue shown when revealed
  deityRevealText?: string;   // Deity's exact words at 100% favor (deity tier only)
  isSecret: boolean;          // Deity items start as unknown even by name

  // How to acquire
  acquisition: AcquisitionCondition;

  // Passive ability
  passiveId: string;
  passiveDescription: string;

  // Stats (exactly one of these is populated)
  weaponStats?: SacredWeaponStats;
  armorStats?: SacredArmorStats;
  accessoryStats?: SacredAccessoryStats;
}

// ===== PANTHEON SET =====

export interface PantheonSetBonus {
  piecesRequired: number;
  bonusName: string;
  bonusDescription: string;
  passiveId: string;
}

export interface PantheonSet {
  id: string;
  name: string;
  pantheonId: PantheonId;
  lore: string;
  pieces: string[];        // Sacred item IDs (always 7)
  bonuses: PantheonSetBonus[];  // 2-piece, 4-piece, 7-piece bonuses
}

// ===== ACQUISITION PROGRESS =====

export interface SacredItemProgress {
  itemId: string;
  discovered: boolean;      // Player knows this item exists
  acquired: boolean;        // Player has obtained this item
  discoveredAt?: number;    // Timestamp
  acquiredAt?: number;
  // Per-requirement tracking
  requirementProgress: {
    metric: AcquisitionMetric;
    current: number;
    target: number;
    completed: boolean;
  }[];
}
