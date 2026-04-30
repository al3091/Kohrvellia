/**
 * Dungeon state store using Zustand
 * Node-based branching path exploration (Slay the Spire style)
 * with per-step ramifications (Buried Bornes style)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  DungeonRun,
  FloorMap,
  MapNode,
  NodeConnection,
  NodeType,
  RamificationResult,
} from '../types/Dungeon';

import {
  createDungeonRun,
  createMapNode,
  getCRRangeForFloor,
  getBiomeForFloor,
  getBiomeDisplayName,
  getRamificationChance,
  floorHasBoss,
  ROWS_PER_FLOOR,
  NODE_TYPE_WEIGHTS,
} from '../types/Dungeon';

import { rollStepRamifications } from '../data/ramifications';
import { useCharacterStore } from './useCharacterStore';

// ===== MAP GENERATION =====

/**
 * Generate a branching path map for a floor
 * Creates Slay the Spire-style vertical node layout
 */
function generateFloorMap(floorNumber: number): FloorMap {
  const seed = Date.now() + floorNumber * 1000;
  const rng = createSeededRNG(seed);

  const biome = getBiomeForFloor(floorNumber, seed);
  const biomeName = getBiomeDisplayName(biome);
  const crRange = getCRRangeForFloor(floorNumber);
  const hasBoss = floorHasBoss(floorNumber);

  const nodes: MapNode[] = [];
  const connections: NodeConnection[] = [];

  // Row 0: Start node
  const startNode = createMapNode('node_0_0', 'start', 0, 0);
  startNode.isRevealed = true;
  startNode.isCurrent = true;
  nodes.push(startNode);

  // Generate middle rows (1 to ROWS_PER_FLOOR - 2)
  const middleRows = ROWS_PER_FLOOR - 2;

  const floorTracking = { shrineCount: 0, restLastRow: -5, mysteryCount: 0 };

  for (let row = 1; row <= middleRows; row++) {
    // Determine number of columns for this row (2-3 nodes typically)
    const numColumns = 2 + Math.floor(rng() * 2); // 2-3 columns

    // Generate nodes for this row
    for (let col = 0; col < numColumns; col++) {
      const columnOffset = col - Math.floor(numColumns / 2);
      const nodeType = selectNodeType(floorNumber, row, rng, floorTracking);
      // Track placements for anti-cluster guards
      if (nodeType === 'shrine') floorTracking.shrineCount++;
      if (nodeType === 'rest') floorTracking.restLastRow = row;
      if (nodeType === 'mystery') floorTracking.mysteryCount++;
      const nodeId = `node_${row}_${col}`;

      const node = createMapNode(nodeId, nodeType, row, columnOffset);

      // If mystery node, generate what it reveals to
      if (nodeType === 'mystery') {
        const actualType = selectMysteryRevealType(floorNumber, rng);
        node.mysteryData = {
          actualType,
          isRevealed: false,
        };
      }

      // Row 1 nodes are visible from start
      if (row === 1) {
        node.isRevealed = true;
      }

      nodes.push(node);
    }
  }

  // Final row: Boss node (if applicable) or just exit path
  const bossRow = middleRows + 1;
  const bossNode = createMapNode(
    `node_${bossRow}_0`,
    hasBoss ? 'boss' : 'combat',
    bossRow,
    0
  );
  nodes.push(bossNode);

  // Generate connections (from each node to valid nodes in the next row)
  for (let row = 0; row < bossRow; row++) {
    const currentRowNodes = nodes.filter(n => n.row === row);
    const nextRowNodes = nodes.filter(n => n.row === row + 1);

    for (const currentNode of currentRowNodes) {
      // Find valid connections (adjacent columns in next row)
      const validTargets = nextRowNodes.filter(nextNode => {
        // Can connect to nodes within 1 column distance
        const columnDiff = Math.abs(nextNode.column - currentNode.column);
        return columnDiff <= 1;
      });

      // Ensure at least one connection per node
      if (validTargets.length === 0 && nextRowNodes.length > 0) {
        // Connect to closest node
        const closest = nextRowNodes.reduce((a, b) =>
          Math.abs(a.column - currentNode.column) < Math.abs(b.column - currentNode.column) ? a : b
        );
        connections.push({ fromId: currentNode.id, toId: closest.id });
      } else {
        // Connect to 1-2 valid targets
        const numConnections = Math.min(validTargets.length, 1 + Math.floor(rng() * 2));
        const shuffled = validTargets.sort(() => rng() - 0.5);

        for (let i = 0; i < numConnections; i++) {
          connections.push({ fromId: currentNode.id, toId: shuffled[i].id });
        }
      }
    }
  }

  // Ensure all nodes in each row have at least one incoming connection (except start)
  for (let row = 1; row <= bossRow; row++) {
    const rowNodes = nodes.filter(n => n.row === row);
    const prevRowNodes = nodes.filter(n => n.row === row - 1);

    for (const node of rowNodes) {
      const hasIncoming = connections.some(c => c.toId === node.id);
      if (!hasIncoming && prevRowNodes.length > 0) {
        // Connect from closest previous row node
        const closest = prevRowNodes.reduce((a, b) =>
          Math.abs(a.column - node.column) < Math.abs(b.column - node.column) ? a : b
        );
        connections.push({ fromId: closest.id, toId: node.id });
      }
    }
  }

  return {
    floorNumber,
    biome,
    biomeName,
    nodes,
    connections,
    currentNodeId: startNode.id,
    stepsTaken: 0,
    totalSteps: bossRow,
    startNodeId: startNode.id,
    bossNodeId: bossNode.id,
    baseCR: crRange.base,
    maxCR: crRange.max,
    seed,
    generatedAt: Date.now(),
  };
}

// Floor-tiered weight profiles
function getFloorWeightProfile(floorNumber: number): Partial<Record<NodeType, number>> {
  if (floorNumber <= 5) {
    // Early: more events, fewer elites
    return { event: 5, elite: -3, rest: 1 };
  } else if (floorNumber <= 15) {
    // Mid: more elites, fewer events
    return { elite: 4, event: -3, mystery: 2 };
  } else {
    // Deep: survival mode — elites spike, rest gets rare, mystery spikes
    return { elite: 6, rest: -2, mystery: 4, event: -2 };
  }
}

/**
 * Select a node type based on floor and row
 * Treasure is ULTRA-RARE: additional floor-based probability filter
 * Shop weight is low (5): rare wandering merchant encounters
 */
function selectNodeType(
  floorNumber: number,
  row: number,
  rng: () => number,
  placedOnFloor?: { shrineCount: number; restLastRow: number; mysteryCount: number }
): NodeType {
  const weights = { ...NODE_TYPE_WEIGHTS };

  // Apply floor-tier profile
  const profile = getFloorWeightProfile(floorNumber);
  for (const [type, delta] of Object.entries(profile)) {
    weights[type as NodeType] = Math.max(0, (weights[type as NodeType] ?? 0) + delta);
  }

  // Row-position adjustments
  if (row <= 2) {
    weights.combat = Math.max(0, weights.combat - 10);
    weights.event += 5;
  }
  if (row === 3 || row === 4) {
    weights.rest += 2;
    weights.mystery += 2;
  }
  if (row === ROWS_PER_FLOOR - 2) {
    weights.rest += 6;
    weights.elite += 5;
    weights.combat = Math.max(0, weights.combat - 15);
  }

  // Anti-cluster guards
  if (placedOnFloor) {
    // Cap shrine at 1 per floor
    if (placedOnFloor.shrineCount >= 1) weights.shrine = 0;
    // No rest within 1 row of last rest
    if (Math.abs(row - placedOnFloor.restLastRow) <= 1) weights.rest = 0;
  }

  const validTypes: NodeType[] = ['combat', 'elite', 'treasure', 'event', 'rest', 'shrine', 'mystery'];
  const totalWeight = validTypes.reduce((sum, type) => sum + Math.max(0, weights[type]), 0);

  let roll = rng() * totalWeight;
  for (const type of validTypes) {
    roll -= Math.max(0, weights[type]);
    if (roll <= 0) {
      if (type === 'treasure') {
        let treasureChance: number;
        if (floorNumber <= 10) treasureChance = 0.04;
        else if (floorNumber <= 25) treasureChance = 0.07;
        else treasureChance = 0.12;
        if (rng() > treasureChance) return 'combat';
      }
      return type;
    }
  }
  return 'combat';
}

/**
 * Select what a mystery node reveals to when entered
 * Mystery nodes have a chance to reveal good or bad outcomes
 */
function selectMysteryRevealType(floorNumber: number, rng: () => number): NodeType {
  // Mystery reveal weights - different from normal node weights
  // More chance for interesting outcomes (good or bad)
  const revealWeights: Record<NodeType, number> = {
    start: 0,
    mystery: 0, // Can't reveal to another mystery
    boss: 0,
    shop: 3, // Rare wandering merchant in mystery reveals
    // Positive outcomes (40% total)
    treasure: 12, // Higher chance than normal - mystery reward
    rest: 10,
    shrine: 8,
    event: 10, // Events can be positive
    // Neutral/Negative outcomes (60% total)
    combat: 38,
    elite: 15, // Higher elite chance - mystery can be dangerous
  };

  // Floor adjustments
  if (floorNumber >= 10) {
    // Deeper floors: more elites in mystery
    revealWeights.elite += 5;
    revealWeights.combat -= 5;
  }

  if (floorNumber >= 5) {
    // More shrine encounters on deeper floors
    revealWeights.shrine += 3;
  }

  // Calculate total and select
  const validTypes: NodeType[] = ['combat', 'elite', 'treasure', 'event', 'rest', 'shrine'];
  const totalWeight = validTypes.reduce((sum, type) => sum + revealWeights[type], 0);

  let roll = rng() * totalWeight;

  for (const type of validTypes) {
    roll -= revealWeights[type];
    if (roll <= 0) {
      return type;
    }
  }

  return 'combat'; // Fallback
}

/**
 * Create a seeded random number generator
 */
function createSeededRNG(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// ===== STORE INTERFACE =====

interface DungeonState {
  // Current run state
  currentRun: DungeonRun | null;

  // Last ramification result (for display)
  lastRamifications: RamificationResult | null;

  // Actions - Run lifecycle
  startNewRun: () => void;
  endRun: (reason: 'death' | 'return' | 'abandon' | 'victory') => void;

  // Actions - Navigation
  enterFloor: (floorNumber: number) => FloorMap;
  moveToNode: (nodeId: string) => RamificationResult;
  getCurrentPathOptions: () => MapNode[];

  // Actions - Node state
  completeNode: (nodeId: string) => void;
  revealAdjacentNodes: (nodeId: string) => void;

  // Actions - Node interactions
  setNodeCombatData: (nodeId: string, monsterId: string, isElite: boolean) => void;
  setNodeEventData: (nodeId: string, eventId: string) => void;
  setNodeTreasureData: (nodeId: string, isTrapped: boolean, isMimic: boolean) => void;
  openTreasure: (nodeId: string) => void;
  useShrine: (nodeId: string, deityDomain: string) => void;
  useRestSite: (nodeId: string) => void;
  revealMystery: (nodeId: string) => void;

  // Computed values
  getCurrentMap: () => FloorMap | null;
  getCurrentNode: () => MapNode | null;
  getFloorProgress: () => { step: number; total: number };
  canDescend: () => boolean;
  canExitDungeon: () => boolean;
  canAscendFloor: () => boolean;

  // Actions - Floor transitions
  ascendFloor: () => void;

  // Reset for new game
  clearAllData: () => void;
  clearRamifications: () => void;
}

export const useDungeonStore = create<DungeonState>()(
  persist(
    (set, get) => ({
      currentRun: null,
      lastRamifications: null,

      // Run lifecycle
      startNewRun: () => {
        const newRun = createDungeonRun();

        // Generate floor 1 and start there
        const floor1 = generateFloorMap(1);
        newRun.currentFloor = 1;
        newRun.currentMap = floor1;

        set({ currentRun: newRun, lastRamifications: null });
      },

      endRun: (reason) => {
        const { currentRun } = get();

        // Sync run depth to character runStats before clearing
        if (currentRun) {
          const characterState = useCharacterStore.getState();
          const pending = characterState.character?.pendingExcelia;
          characterState.updateRunStats({
            floorsCleared: currentRun.deepestFloor,
            deepestFloor: currentRun.deepestFloor,
            monstersKilled: pending?.monstersKilled ?? 0,
          });
        }

        // Death, return, and abandon: clear run completely
        if (reason === 'death' || reason === 'return' || reason === 'abandon') {
          set({ currentRun: null, lastRamifications: null });
          return;
        }

        // Victory: mark inactive (preserve for future stats feature)
        set((state) => {
          if (!state.currentRun) return state;

          return {
            currentRun: {
              ...state.currentRun,
              isActive: false,
              isPaused: true,
            },
            lastRamifications: null,
          };
        });
      },

      // Navigation
      enterFloor: (floorNumber) => {
        const map = generateFloorMap(floorNumber);

        set((state) => {
          if (!state.currentRun) return state;

          return {
            currentRun: {
              ...state.currentRun,
              currentFloor: floorNumber,
              deepestFloor: Math.max(state.currentRun.deepestFloor, floorNumber),
              currentMap: map,
              lastActivityAt: Date.now(),
            },
            lastRamifications: null,
          };
        });

        return map;
      },

      moveToNode: (nodeId) => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) {
          return {
            ramifications: [],
            wasBlessed: false,
            totalHPLost: 0,
            totalSPLost: 0,
            totalGoldLost: 0,
            rationsLost: 0,
          };
        }

        const map = currentRun.currentMap;
        const targetNode = map.nodes.find(n => n.id === nodeId);
        if (!targetNode) {
          return {
            ramifications: [],
            wasBlessed: false,
            totalHPLost: 0,
            totalSPLost: 0,
            totalGoldLost: 0,
            rationsLost: 0,
          };
        }

        // Roll ramifications for this step
        const baseChance = getRamificationChance(currentRun.currentFloor);
        const ramifications = rollStepRamifications(currentRun.currentFloor, baseChance);

        // Calculate totals
        let totalHPLost = 0;
        let totalSPLost = 0;
        let totalGoldLost = 0;
        let rationsLost = 0;
        let wasBlessed = false;

        for (const ram of ramifications) {
          if (ram.isBlessing) wasBlessed = true;

          if (ram.effect.type === 'hp' && ram.effect.value) {
            if (ram.effect.value < 0) totalHPLost += Math.abs(ram.effect.value);
          }
          if (ram.effect.type === 'sp' && ram.effect.value) {
            if (ram.effect.value < 0) totalSPLost += Math.abs(ram.effect.value);
          }
          if (ram.effect.type === 'gold' && ram.effect.value) {
            if (ram.effect.value < 0) totalGoldLost += Math.abs(ram.effect.value);
          }
          if (ram.effect.type === 'ration' && ram.effect.value) {
            if (ram.effect.value < 0) rationsLost += Math.abs(ram.effect.value);
          }
        }

        const result: RamificationResult = {
          ramifications,
          wasBlessed,
          totalHPLost,
          totalSPLost,
          totalGoldLost,
          rationsLost,
        };

        // Update state
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const leavingNodeId = state.currentRun.currentMap.currentNodeId;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node => {
            // Handle the node we're leaving
            if (node.id === leavingNodeId) {
              // Reactivate combat/elite nodes when leaving (NOT boss)
              const shouldReactivate =
                node.type === 'combat' || node.type === 'elite';

              return {
                ...node,
                isCurrent: false,
                isCompleted: shouldReactivate ? false : node.isCompleted,
              };
            }
            // Handle the node we're arriving at
            if (node.id === nodeId) {
              return { ...node, isCurrent: true, isRevealed: true };
            }
            return node;
          });

          // Reveal nodes adjacent to new position
          const targetNode = updatedNodes.find(n => n.id === nodeId);
          if (targetNode) {
            const adjacentIds = state.currentRun!.currentMap!.connections
              .filter(c => c.fromId === nodeId)
              .map(c => c.toId);

            updatedNodes.forEach((node, index) => {
              if (adjacentIds.includes(node.id)) {
                updatedNodes[index] = { ...node, isRevealed: true };
              }
            });
          }

          const newMap: FloorMap = {
            ...state.currentRun.currentMap,
            nodes: updatedNodes,
            currentNodeId: nodeId,
            stepsTaken: state.currentRun.currentMap.stepsTaken + 1,
          };

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: newMap,
              totalSteps: state.currentRun.totalSteps + 1,
              totalRamifications: state.currentRun.totalRamifications + ramifications.length,
              totalBlessingsReceived: state.currentRun.totalBlessingsReceived + (wasBlessed ? 1 : 0),
              lastActivityAt: Date.now(),
            },
            lastRamifications: result,
          };
        });

        return result;
      },

      getCurrentPathOptions: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) return [];

        const map = currentRun.currentMap;
        const currentId = map.currentNodeId;

        // Forward connections (nodes we can move TO)
        const forwardIds = map.connections
          .filter(c => c.fromId === currentId)
          .map(c => c.toId);

        // Backward connections (nodes that connect TO us - we can go back)
        const backwardIds = map.connections
          .filter(c => c.toId === currentId)
          .map(c => c.fromId);

        // Combine both directions, remove duplicates
        const allNavigableIds = [...new Set([...forwardIds, ...backwardIds])];

        return map.nodes.filter(n => allNavigableIds.includes(n.id));
      },

      // Node state
      completeNode: (nodeId) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId ? { ...node, isCompleted: true } : node
          );

          // Track combats
          const node = state.currentRun.currentMap.nodes.find(n => n.id === nodeId);
          const wasCombat = node?.type === 'combat' || node?.type === 'elite' || node?.type === 'boss';

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
              totalCombats: state.currentRun.totalCombats + (wasCombat ? 1 : 0),
            },
          };
        });
      },

      revealAdjacentNodes: (nodeId) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const adjacentIds = state.currentRun.currentMap.connections
            .filter(c => c.fromId === nodeId)
            .map(c => c.toId);

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            adjacentIds.includes(node.id) ? { ...node, isRevealed: true } : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      // Node interactions
      setNodeCombatData: (nodeId, _monsterId, isElite) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId
              ? {
                  ...node,
                  combatData: {
                    monster: null, // Will be set by combat system
                    isElite,
                  },
                }
              : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      setNodeEventData: (nodeId, eventId) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId
              ? {
                  ...node,
                  eventData: {
                    eventId,
                    isCompleted: false,
                  },
                }
              : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      setNodeTreasureData: (nodeId, isTrapped, isMimic) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId
              ? {
                  ...node,
                  treasureData: {
                    isTrapped,
                    isMimic,
                    isOpened: false,
                  },
                }
              : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      openTreasure: (nodeId) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId && node.treasureData
              ? {
                  ...node,
                  treasureData: { ...node.treasureData, isOpened: true },
                  isCompleted: true,
                }
              : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      useShrine: (nodeId, deityDomain) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId
              ? {
                  ...node,
                  shrineData: {
                    deityDomain,
                    isUsed: true,
                  },
                  isCompleted: true,
                }
              : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      useRestSite: (nodeId) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node =>
            node.id === nodeId
              ? { ...node, isCompleted: true }
              : node
          );

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      revealMystery: (nodeId) => {
        set((state) => {
          if (!state.currentRun || !state.currentRun.currentMap) return state;

          const updatedNodes = state.currentRun.currentMap.nodes.map(node => {
            if (node.id !== nodeId || !node.mysteryData) return node;

            // Reveal the actual type
            return {
              ...node,
              type: node.mysteryData.actualType,
              mysteryData: {
                ...node.mysteryData,
                isRevealed: true,
              },
            };
          });

          return {
            currentRun: {
              ...state.currentRun,
              currentMap: {
                ...state.currentRun.currentMap,
                nodes: updatedNodes,
              },
            },
          };
        });
      },

      // Computed values
      getCurrentMap: () => {
        const { currentRun } = get();
        return currentRun?.currentMap ?? null;
      },

      getCurrentNode: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) return null;

        return currentRun.currentMap.nodes.find(
          n => n.id === currentRun.currentMap!.currentNodeId
        ) ?? null;
      },

      getFloorProgress: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) {
          return { step: 0, total: 0 };
        }

        return {
          step: currentRun.currentMap.stepsTaken,
          total: currentRun.currentMap.totalSteps,
        };
      },

      canDescend: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) return false;

        // Check if boss node is completed
        const bossNode = currentRun.currentMap.nodes.find(
          n => n.id === currentRun.currentMap!.bossNodeId
        );

        return bossNode?.isCompleted ?? false;
      },

      canExitDungeon: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) return false;

        // Must be on Floor 1
        if (currentRun.currentFloor !== 1) return false;

        // Must be at start node (entrance)
        return currentRun.currentMap.currentNodeId === currentRun.currentMap.startNodeId;
      },

      canAscendFloor: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) return false;

        // Can't ascend from Floor 1
        if (currentRun.currentFloor <= 1) return false;

        // Must be at start node (entrance) of current floor
        return currentRun.currentMap.currentNodeId === currentRun.currentMap.startNodeId;
      },

      ascendFloor: () => {
        const { currentRun } = get();
        if (!currentRun || !currentRun.currentMap) return;

        // Can't ascend from Floor 1
        if (currentRun.currentFloor <= 1) return;

        // Must be at start node to ascend
        if (currentRun.currentMap.currentNodeId !== currentRun.currentMap.startNodeId) {
          return;
        }

        // Generate new map for the floor above (fresh path each time)
        const previousFloor = currentRun.currentFloor - 1;
        const map = generateFloorMap(previousFloor);

        // Start at the BOSS node (coming from below)
        // Mark boss node as completed since we already cleared it to get here
        const updatedNodes = map.nodes.map(node => {
          if (node.id === map.bossNodeId) {
            return {
              ...node,
              isCurrent: true,
              isCompleted: true,
              isRevealed: true,
            };
          }
          // Clear the start node's current status
          if (node.id === map.startNodeId) {
            return { ...node, isCurrent: false };
          }
          return node;
        });

        // Also reveal nodes adjacent to boss (backward connections)
        const bossBackwardIds = map.connections
          .filter(c => c.toId === map.bossNodeId)
          .map(c => c.fromId);

        updatedNodes.forEach((node, index) => {
          if (bossBackwardIds.includes(node.id)) {
            updatedNodes[index] = { ...node, isRevealed: true };
          }
        });

        const newMap: FloorMap = {
          ...map,
          nodes: updatedNodes,
          currentNodeId: map.bossNodeId,
        };

        set((state) => ({
          currentRun: {
            ...state.currentRun!,
            currentFloor: previousFloor,
            currentMap: newMap,
            lastActivityAt: Date.now(),
          },
          lastRamifications: null,
        }));
      },

      // Reset
      clearAllData: () => {
        set({ currentRun: null, lastRamifications: null });
      },

      clearRamifications: () => {
        set({ lastRamifications: null });
      },
    }),
    {
      name: 'kohrvellia-dungeon-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentRun: state.currentRun,
      }),
    }
  )
);
