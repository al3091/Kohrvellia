/**
 * Character type definitions for Kohrvellia
 * Full character interface with Falna, equipment, inventory, and progression
 */

import type { Stats, StatName, StatValue } from './Stats';
import { getGradeFromPoints } from './Stats';
import type { Equipment, Armor, Accessory } from './Armor';
import type { AchievementProgress } from './Achievement';
import type { Weapon } from './Weapon';

// Pending excelia from dungeon runs - NOT applied until Blessing Rite
export interface PendingExcelia {
  stats: Record<StatName, number>; // Proficiency earned per stat
  earnedAt: number;                // Timestamp when run started
  floorReached: number;            // Deepest floor reached this run
  monstersKilled: number;          // Monsters slain this run
}

// Backstory options that affect starting stats
export type BackstoryId =
  | 'orphan_of_streets'
  | 'disgraced_noble'
  | 'failed_apprentice'
  | 'veteran_soldier'
  | 'temple_acolyte'
  | 'wandering_merchant'
  | 'blacksmith_child'
  | 'cursed_bloodline';

// Backstory definition
export interface Backstory {
  id: BackstoryId;
  name: string;
  statBonus: { stat: StatName; value: number };
  statPenalty: { stat: StatName; value: number };
  deityAffinity: string[]; // Domains that match well
  flavor: string;
}

export const BACKSTORIES: Record<BackstoryId, Backstory> = {
  orphan_of_streets: {
    id: 'orphan_of_streets',
    name: 'Orphan of the Streets',
    statBonus: { stat: 'AGI', value: 5 },
    statPenalty: { stat: 'CHA', value: 5 },
    deityAffinity: ['trickery'],
    flavor: 'You learned to survive before you learned your name.',
  },
  disgraced_noble: {
    id: 'disgraced_noble',
    name: 'Disgraced Noble',
    statBonus: { stat: 'CHA', value: 5 },
    statPenalty: { stat: 'END', value: 5 },
    deityAffinity: ['authority'],
    flavor: "Your family's shame is your fuel.",
  },
  failed_apprentice: {
    id: 'failed_apprentice',
    name: 'Failed Apprentice',
    statBonus: { stat: 'INT', value: 5 },
    statPenalty: { stat: 'WIS', value: 5 },
    deityAffinity: ['knowledge'],
    flavor: 'They said you lacked talent. They were wrong.',
  },
  veteran_soldier: {
    id: 'veteran_soldier',
    name: 'Veteran Soldier',
    statBonus: { stat: 'END', value: 5 },
    statPenalty: { stat: 'INT', value: 5 },
    deityAffinity: ['war'],
    flavor: 'The battlefield taught you more than any book.',
  },
  temple_acolyte: {
    id: 'temple_acolyte',
    name: 'Temple Acolyte',
    statBonus: { stat: 'WIS', value: 5 },
    statPenalty: { stat: 'AGI', value: 5 },
    deityAffinity: ['divine'],
    flavor: 'Faith sustained you when all else failed.',
  },
  wandering_merchant: {
    id: 'wandering_merchant',
    name: 'Wandering Merchant',
    statBonus: { stat: 'PER', value: 5 },
    statPenalty: { stat: 'STR', value: 5 },
    deityAffinity: ['fortune'],
    flavor: 'Every road leads to opportunity.',
  },
  blacksmith_child: {
    id: 'blacksmith_child',
    name: "Blacksmith's Child",
    statBonus: { stat: 'STR', value: 5 },
    statPenalty: { stat: 'CHA', value: 5 },
    deityAffinity: ['craft'],
    flavor: 'You were forged in fire like the blades you made.',
  },
  cursed_bloodline: {
    id: 'cursed_bloodline',
    name: 'Cursed Bloodline',
    statBonus: { stat: 'LCK', value: 5 },
    statPenalty: { stat: 'WIS', value: 5 },
    deityAffinity: ['death', 'fate'],
    flavor: 'Fate has plans for you, whether you like it or not.',
  },
};

// Status effects that can afflict the character
export type StatusEffectId =
  | 'poison'
  | 'bleed'
  | 'burn'
  | 'freeze'
  | 'stun'
  | 'fear'
  | 'curse'
  | 'blind'
  | 'silence'
  | 'paralysis';

export interface StatusEffect {
  id: StatusEffectId;
  name: string;
  duration: number; // Turns remaining
  damagePerTurn?: number;
  statModifier?: Partial<Record<StatName, number>>;
  description: string;
}

// Skill definition
export interface Skill {
  id: string;
  name: string;
  description: string;
  spCost: number;
  cooldown: number; // Turns
  currentCooldown: number;
  level: number; // Proficiency level 1-50
  observed: boolean; // Have we seen this skill used?
  learned: boolean; // Have we acquired this skill?
  category: 'physical' | 'magic' | 'support' | 'passive';
  scalingStat: StatName;
}

// Job/Class system
export type JobId = string; // Dynamic based on stat combinations

export interface JobProgress {
  id: JobId;
  name: string;
  level: number; // 1 = unlocked, progresses with milestones
  specialization?: 'path_a' | 'path_b';
  skills: string[]; // Skill IDs unlocked through this job
}

// Inventory item (generic wrapper for all item types)
export interface InventoryItem {
  id: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'key';
  stackable: boolean;
  quantity: number;
  identified?: boolean;

  // Display fields (for items without separate data lookup)
  name?: string;
  icon?: string;

  // Full equipment data for non-stackable items
  // These store the complete generated item for weapons/armor/accessories
  weaponData?: Weapon;
  armorData?: Armor;
  accessoryData?: Accessory;
}

// Bag capacity constant
export const BAG_CAPACITY = 20; // Maximum inventory slots

// AchievementProgress is exported from Achievement.ts

// Full character state
export interface Character {
  // Identity
  id: string;
  name: string;
  epithet: string; // "the Wandering Storm"
  backstory: BackstoryId;

  // Progression
  level: number; // 1-10 (Paragon at 10)
  levelProgress: {
    achievementsCompleted: AchievementProgress[];
    allStatsAtD: boolean; // Required for level-up
    deityApproved: boolean;
  };

  // Level history — stat points accumulated at each level, carried forward permanently.
  // effectiveStat = level × 500 + currentPoints + sum(levelHistory[i].stats[stat])
  levelHistory: Array<{
    level: number;
    stats: Record<StatName, number>; // Final stat points at time of level-up
  }>;

  primaryStatHistory?: StatName[]; // Primary stat chosen at each level-up (index = level - 1)

  // Core stats (Falna)
  stats: Stats;

  // Combat resources
  currentHP: number;
  maxHP: number;
  currentSP: number;
  maxSP: number;
  satiation: number; // 0-100; decays on movement, restored by eating rations

  // Status
  statusEffects: StatusEffect[];
  isDead: boolean;

  // Equipment
  equipment: Equipment;

  // Inventory
  inventory: InventoryItem[];
  gold: number;

  // Skills
  skills: Skill[];
  observedSkills: string[]; // Skills we've seen but not learned

  // Job system
  currentJob: JobProgress | null;
  completedJobs: JobProgress[];

  // Deity relationship
  patronDeityId: string | null;
  deityFavor: number; // 0-100

  // Pending excelia from current dungeon run (null = no pending growth)
  pendingExcelia: PendingExcelia | null;

  // Run stats (reset on death)
  runStats: {
    floorsCleared: number;
    deepestFloor: number;
    monstersKilled: number;
    damageDealt: number;
    damageTaken: number;
    goldEarned: number;
    itemsFound: number;
    roomsExplored: number;
    timePlayedSeconds: number;
  };

  // Metadata
  createdAt: number; // Unix timestamp
  lastPlayedAt: number;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Create a new character with default values
 */
export function createNewCharacter(
  name: string,
  epithet: string,
  backstoryId: BackstoryId,
  statAllocations?: Record<StatName, number>,
  deityStatBonus?: { stat: StatName; value: number }
): Character {
  const backstory = BACKSTORIES[backstoryId];

  // Start with base stats
  const stats: Stats = {
    STR: { grade: 'I', points: 0, proficiency: 0 },
    PER: { grade: 'I', points: 0, proficiency: 0 },
    END: { grade: 'I', points: 0, proficiency: 0 },
    CHA: { grade: 'I', points: 0, proficiency: 0 },
    INT: { grade: 'I', points: 0, proficiency: 0 },
    AGI: { grade: 'I', points: 0, proficiency: 0 },
    WIS: { grade: 'I', points: 0, proficiency: 0 },
    LCK: { grade: 'I', points: 0, proficiency: 0 },
  };

  // Apply stat allocations from character creation
  if (statAllocations) {
    for (const stat of Object.keys(statAllocations) as StatName[]) {
      stats[stat].points += statAllocations[stat];
    }
  }

  // Apply backstory bonus (+5 to one stat)
  stats[backstory.statBonus.stat].points += backstory.statBonus.value;

  // Apply deity bonus (+10 to one stat)
  if (deityStatBonus) {
    stats[deityStatBonus.stat].points += deityStatBonus.value;
  }

  // Update grades based on final point values
  for (const stat of Object.keys(stats) as StatName[]) {
    stats[stat].grade = getGradeFromPoints(stats[stat].points);
  }

  // Note: Penalty is not applied to starting points, it affects growth rate
  // This keeps starting characters viable regardless of backstory

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    epithet,
    backstory: backstoryId,

    level: 1,
    levelProgress: {
      achievementsCompleted: [],
      allStatsAtD: false,
      deityApproved: false,
    },

    levelHistory: [],
    primaryStatHistory: [],

    stats,

    currentHP: 50, // Base HP
    maxHP: 50,
    currentSP: 30, // Base SP
    maxSP: 30,
    satiation: 60,

    statusEffects: [],
    isDead: false,

    equipment: {
      weapon: null,
      head: null,
      chest: null,
      hands: null,
      legs: null,
      accessory1: null,
      accessory2: null,
    },

    inventory: [
      // Starting supplies
      {
        id: 'ration',
        type: 'consumable',
        stackable: true,
        quantity: 3,
        identified: true,
      },
      {
        id: 'health_potion_small',
        type: 'consumable',
        stackable: true,
        quantity: 2,
        identified: true,
      },
    ],
    gold: 50,

    skills: [],
    observedSkills: [],

    currentJob: null,
    completedJobs: [],

    patronDeityId: null,
    deityFavor: 50, // Start neutral

    pendingExcelia: null, // No pending growth at creation

    runStats: {
      floorsCleared: 0,
      deepestFloor: 0,
      monstersKilled: 0,
      damageDealt: 0,
      damageTaken: 0,
      goldEarned: 0,
      itemsFound: 0,
      roomsExplored: 0,
      timePlayedSeconds: 0,
    },

    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
}

/**
 * Check if character meets level-up requirements
 */
export function canLevelUp(character: Character): boolean {
  if (character.level >= 10) return false; // Max level
  if (character.isDead) return false;

  // DanMachi-authentic: at least ONE stat must reach Grade A (800+ points).
  // Specialization is rewarded — a dedicated warrior can level without grinding every stat.
  // The carry model guarantees that fresh Level N is always stronger than any Level N-1 character.
  const primaryStatAtA = Object.values(character.stats).some((s) => s.points >= 800);
  if (!primaryStatAtA) return false;

  // Must have at least one completed achievement
  const hasAchievement = character.levelProgress.achievementsCompleted.some(
    (a) => a.isCompleted
  );

  // Must have deity approval (obtained through achievement submission)
  return hasAchievement && character.levelProgress.deityApproved;
}

export function getLeadingStats(character: Character): StatName[] {
  return (Object.entries(character.stats) as [StatName, StatValue][])
    .filter(([, v]) => v.points >= 800)
    .sort(([, a], [, b]) => b.points - a.points)
    .map(([k]) => k);
}

/**
 * Format character for display: "Kira, the Wandering Storm (Lv.3)"
 */
export function formatCharacterTitle(character: Character): string {
  return `${character.name}, ${character.epithet} (Lv.${character.level})`;
}

/**
 * Calculate total carry capacity
 */
export function getCarryCapacity(_character: Character, effectiveSTR: number): number {
  return Math.floor(10 + effectiveSTR * 0.05); // Base 10 + 5% of effective STR
}
