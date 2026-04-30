/**
 * Dungeon structure types for Kohrvellia
 * Slay the Spire-style branching paths with per-turn ramifications
 */

import type { Monster } from './Monster';

// ===== NODE TYPES =====

// Node types available in the dungeon (Slay the Spire style)
export type NodeType =
  | 'start'     // Entry point
  | 'combat'    // Monster encounter
  | 'elite'     // Harder combat, better rewards
  | 'treasure'  // Chest (may be trapped/mimic)
  | 'event'     // Narrative encounter with choices
  | 'rest'      // Rest site (costs rations)
  | 'shop'      // Wandering merchant
  | 'shrine'    // Deity interaction
  | 'mystery'   // Unknown until arrival
  | 'boss';     // Floor boss

// Biome affects aesthetics and monster spawns
export type Biome =
  | 'ruins'       // Greek, Roman, Egyptian
  | 'frozen'      // Norse, Slavic, Finnish
  | 'forest'      // Celtic, Shinto, nature
  | 'desert'      // Egyptian, Mesopotamian
  | 'jungle'      // Aztec, Maya, Inca
  | 'swamp'       // Vodou, Yoruba
  | 'volcanic'    // Polynesian, Hindu
  | 'void'        // Ars Goetia, Fallen
  | 'cavern'      // Generic underground
  | 'labyrinth';  // Maze-like structure

// ===== MAP NODE =====

export interface MapNode {
  id: string;
  type: NodeType;
  row: number;      // Vertical position (0 = start, max = boss)
  column: number;   // Horizontal position for branching (-2 to 2 typically)

  // State
  isRevealed: boolean;   // Can player see this node?
  isCompleted: boolean;  // Has player cleared this node?
  isCurrent: boolean;    // Is player here now?

  // Type-specific data
  combatData?: {
    monster: Monster | null;
    isElite: boolean;
  };
  treasureData?: {
    isTrapped: boolean;
    isMimic: boolean;
    isOpened: boolean;
  };
  eventData?: {
    eventId: string;
    isCompleted: boolean;
    choiceMade?: string;
  };
  shrineData?: {
    deityDomain?: string;
    isUsed: boolean;
  };
  shopData?: {
    merchantType: 'wandering' | 'specialty';
    inventory: string[];
  };
  mysteryData?: {
    actualType: NodeType;  // What it becomes when revealed
    isRevealed: boolean;
  };
}

// Connection between nodes
export interface NodeConnection {
  fromId: string;
  toId: string;
}

// ===== FLOOR MAP =====

export interface FloorMap {
  floorNumber: number;
  biome: Biome;
  biomeName: string;

  // Node structure
  nodes: MapNode[];
  connections: NodeConnection[];

  // Current state
  currentNodeId: string;
  stepsTaken: number;
  totalSteps: number;  // Expected steps to boss

  // Special node references
  startNodeId: string;
  bossNodeId: string;

  // Floor metadata
  baseCR: number;
  maxCR: number;
  seed: number;
  generatedAt: number;
}

// ===== RAMIFICATION SYSTEM =====

export type RamificationType =
  | 'drain'     // Resource loss (rations, gold)
  | 'damage'    // HP/SP loss
  | 'status'    // Apply status effect
  | 'blessing'  // Positive effect
  | 'event'     // Mini-event triggers
  | 'nothing';  // Safe passage

export interface RamificationEffect {
  type: 'hp' | 'sp' | 'ration' | 'gold' | 'status' | 'buff' | 'item' | 'combat';
  value?: number;
  statusId?: string;
  duration?: number;
}

export interface Ramification {
  id: string;
  name: string;
  description: string;
  type: RamificationType;
  effect: RamificationEffect;
  minFloor: number;       // Minimum floor to appear
  maxFloor?: number;      // Maximum floor (undefined = no cap)
  weight: number;         // Higher = more common
  isBlessing: boolean;    // True = positive effect
}

// Result of ramification roll
export interface RamificationResult {
  ramifications: Ramification[];
  wasBlessed: boolean;
  totalHPLost: number;
  totalSPLost: number;
  totalGoldLost: number;
  rationsLost: number;
}

// ===== DUNGEON RUN =====

export interface DungeonRun {
  runId: string;

  // Current position
  currentFloor: number;
  deepestFloor: number;
  currentMap: FloorMap | null;

  // Run state
  isActive: boolean;
  isPaused: boolean;  // Player can pause between nodes

  // Stats
  totalSteps: number;
  totalCombats: number;
  totalEventsCompleted: number;
  totalRamifications: number;
  totalBlessingsReceived: number;

  // Timestamps
  startedAt: number;
  lastActivityAt: number;
}

// ===== GENERATION CONSTANTS =====

// Nodes per floor
export const NODES_PER_FLOOR_BASE = 10;
export const NODES_PER_FLOOR_MAX = 14;
export const NODES_PER_TIER_INCREASE = 1;  // +1 node every 10 floors

// Row structure (vertical layers)
export const ROWS_PER_FLOOR = 12;  // start, 10 middle rows, boss (~25-36 nodes)

// Node type weights by row
// Note: Treasure is ultra-rare (actual spawn controlled by floor probability in useDungeonStore)
// Shop is rare (weight 5) — a wandering merchant occasionally appears inside dungeons
export const NODE_TYPE_WEIGHTS: Record<NodeType, number> = {
  start: 0,       // Placed automatically
  combat: 40,     // Most common
  elite: 12,      // Rare but rewarding
  treasure: 3,    // Ultra-rare base weight (further filtered by floor probability)
  event: 22,      // Narrative encounters
  rest: 4,        // Rest sites kept scarce
  shop: 5,        // Rare wandering merchant
  shrine: 3,      // Rare deity interactions
  mystery: 16,    // Variety and tension
  boss: 0,        // Placed automatically
};

// Ramification chances by floor tier
export const RAMIFICATION_CHANCE = {
  floors1to5: 0.40,    // 40% per step
  floors6to10: 0.55,   // 55% per step
  floors11to20: 0.70,  // 70% per step
  floors21plus: 0.85,  // 85% per step
};

// CR by floor depth
export const FLOOR_CR_RANGES: Array<{ minFloor: number; maxFloor: number; baseCR: number; maxCR: number }> = [
  { minFloor: 1, maxFloor: 5, baseCR: 1.0, maxCR: 2.0 },
  { minFloor: 6, maxFloor: 10, baseCR: 2.0, maxCR: 3.5 },
  { minFloor: 11, maxFloor: 20, baseCR: 3.5, maxCR: 5.0 },
  { minFloor: 21, maxFloor: 30, baseCR: 5.0, maxCR: 7.0 },
  { minFloor: 31, maxFloor: 40, baseCR: 7.0, maxCR: 10.0 },
  { minFloor: 41, maxFloor: 50, baseCR: 10.0, maxCR: 15.0 },
  { minFloor: 51, maxFloor: 999, baseCR: 15.0, maxCR: 25.0 },
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get CR range for a floor
 */
export function getCRRangeForFloor(floorNumber: number): { base: number; max: number } {
  for (const range of FLOOR_CR_RANGES) {
    if (floorNumber >= range.minFloor && floorNumber <= range.maxFloor) {
      return { base: range.baseCR, max: range.maxCR };
    }
  }
  return { base: 15.0, max: 25.0 };
}

/**
 * Get ramification chance for a floor
 */
export function getRamificationChance(floorNumber: number): number {
  if (floorNumber <= 5) return RAMIFICATION_CHANCE.floors1to5;
  if (floorNumber <= 10) return RAMIFICATION_CHANCE.floors6to10;
  if (floorNumber <= 20) return RAMIFICATION_CHANCE.floors11to20;
  return RAMIFICATION_CHANCE.floors21plus;
}

/**
 * Get biome for a floor
 */
export function getBiomeForFloor(floorNumber: number, seed: number): Biome {
  const biomes: Biome[] = ['cavern', 'ruins', 'forest', 'frozen', 'desert', 'swamp', 'jungle', 'volcanic'];
  const baseIndex = Math.floor((floorNumber - 1) / 5) % biomes.length;
  const variation = seed % 2;
  return biomes[(baseIndex + variation) % biomes.length];
}

/**
 * Get biome display name
 */
export function getBiomeDisplayName(biome: Biome): string {
  const names: Record<Biome, string> = {
    ruins: 'Ancient Ruins',
    frozen: 'Frozen Depths',
    forest: 'Underground Forest',
    desert: 'Sunken Desert',
    jungle: 'Primal Jungle',
    swamp: 'Fetid Swamp',
    volcanic: 'Volcanic Caverns',
    void: 'The Void',
    cavern: 'Stone Caverns',
    labyrinth: 'The Labyrinth',
  };
  return names[biome] ?? biome;
}

/**
 * Get floor theme name (combines floor number and biome)
 */
export function getFloorThemeName(floorNumber: number, biome: Biome): string {
  const floorNames: Record<number, string> = {
    1: 'The First Descent',
    2: 'Echoing Halls',
    3: 'The Dim Passages',
    4: 'Forgotten Corridors',
    5: 'The Guardian\'s Domain',
    6: 'Deeper Still',
    7: 'The Whispering Dark',
    8: 'Shadowed Ways',
    9: 'The Hungry Depths',
    10: 'The Second Trial',
  };

  if (floorNames[floorNumber]) {
    return floorNames[floorNumber];
  }

  return `${getBiomeDisplayName(biome)} - Floor ${floorNumber}`;
}

/**
 * Check if floor has a boss
 */
export function floorHasBoss(floorNumber: number): boolean {
  return floorNumber % 5 === 0 && floorNumber > 0;
}

/**
 * Get node icon
 */
export function getNodeIcon(type: NodeType): string {
  const icons: Record<NodeType, string> = {
    start: '▼',
    combat: '✕',
    elite: '☠',
    treasure: '◈',
    event: '◎',
    rest: '❧',
    shop: '◉',
    shrine: '✦',
    mystery: '◌',
    boss: '⚑',
  };
  return icons[type] ?? '?';
}

/**
 * Get node display name
 */
export function getNodeDisplayName(type: NodeType): string {
  const names: Record<NodeType, string> = {
    start: 'Entrance',
    combat: 'Combat',
    elite: 'Elite Combat',
    treasure: 'Treasure',
    event: 'Event',
    rest: 'Rest Site',
    shop: 'Shop',
    shrine: 'Shrine',
    mystery: 'Mystery',
    boss: 'Floor Boss',
  };
  return names[type] ?? type;
}

/**
 * Create empty map node
 */
export function createMapNode(
  id: string,
  type: NodeType,
  row: number,
  column: number
): MapNode {
  return {
    id,
    type,
    row,
    column,
    isRevealed: row <= 1,  // First two rows visible
    isCompleted: false,
    isCurrent: false,
  };
}

/**
 * Create new dungeon run
 */
export function createDungeonRun(): DungeonRun {
  return {
    runId: `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    currentFloor: 0,
    deepestFloor: 0,
    currentMap: null,
    isActive: true,
    isPaused: false,
    totalSteps: 0,
    totalCombats: 0,
    totalEventsCompleted: 0,
    totalRamifications: 0,
    totalBlessingsReceived: 0,
    startedAt: Date.now(),
    lastActivityAt: Date.now(),
  };
}

/**
 * Get danger level text
 */
export function getFloorDangerText(playerLevel: number, floorCR: number): string {
  const expectedCR = playerLevel * 2.5;
  const ratio = floorCR / expectedCR;

  if (ratio < 0.6) return 'Trivial';
  if (ratio < 0.9) return 'Easy';
  if (ratio < 1.1) return 'Normal';
  if (ratio < 1.4) return 'Dangerous';
  if (ratio < 1.8) return 'Deadly';
  return 'Suicidal';
}

/**
 * Get nodes adjacent to current (valid path choices)
 */
export function getAdjacentNodes(
  map: FloorMap,
  currentNodeId: string
): MapNode[] {
  const connections = map.connections.filter(c => c.fromId === currentNodeId);
  const adjacentIds = connections.map(c => c.toId);
  return map.nodes.filter(n => adjacentIds.includes(n.id));
}

/**
 * Check if path exists between two nodes
 */
export function pathExists(
  map: FloorMap,
  fromId: string,
  toId: string
): boolean {
  return map.connections.some(
    c => c.fromId === fromId && c.toId === toId
  );
}
