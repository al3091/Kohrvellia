/**
 * B-04 regression guard — anti-farming (KV-AUD-080/081/082/251/252).
 * Cleared means cleared · descent is forward-only · floors are stable spaces.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import type { DungeonRun, FloorMap, MapNode } from '../src/types/Dungeon';
import { useDungeonStore } from '../src/stores/useDungeonStore';

const node = (id: string, type: string, over: Record<string, unknown> = {}): MapNode =>
  ({
    id,
    type,
    row: 0,
    isCompleted: false,
    isCurrent: false,
    isRevealed: true,
    isAvoided: false,
    ...over,
  } as unknown as MapNode);

const makeMap = (over: Record<string, unknown> = {}): FloorMap =>
  ({
    floorNumber: 1,
    nodes: [
      node('S', 'start', { isCompleted: true }),
      node('A', 'combat', { isCurrent: true, isCompleted: true }), // cleared, standing on it
      node('B', 'combat'),
    ],
    connections: [
      { fromId: 'S', toId: 'A' },
      { fromId: 'A', toId: 'B' },
    ],
    currentNodeId: 'A',
    startNodeId: 'S',
    bossNodeId: 'B',
    baseCR: 1,
    maxCR: 2,
    seed: 1,
    generatedAt: 0,
    ...over,
  } as unknown as FloorMap);

const makeRun = (over: Record<string, unknown> = {}): DungeonRun =>
  ({
    runId: 'test-run',
    currentFloor: 1,
    deepestFloor: 1,
    currentMap: makeMap(),
    isActive: true,
    isPaused: false,
    totalSteps: 0,
    totalCombats: 0,
    totalEventsCompleted: 0,
    totalRamifications: 0,
    totalBlessingsReceived: 0,
    runFlags: [],
    clearedBossIds: [],
    milestoneChestsOpenedThisRun: [],
    soulVectorSnapshot: {},
    lastEventWeaponFloor: 0,
    startedAt: 0,
    lastActivityAt: 0,
    runSeed: 42,
    floorMaps: {},
    ...over,
  } as unknown as DungeonRun);

beforeEach(() => {
  useDungeonStore.setState({ currentRun: null, lastRamifications: null, floorContext: null });
});

describe('KV-AUD-080 — cleared means cleared', () => {
  it('a completed combat node does NOT re-arm when left', () => {
    useDungeonStore.setState({ currentRun: makeRun() });
    useDungeonStore.getState().moveToNode('B');
    const a = useDungeonStore
      .getState()
      .currentRun!.currentMap!.nodes.find((n) => n.id === 'A')!;
    expect(a.isCompleted).toBe(true);
  });
});

describe('KV-AUD-080/251 — path options are forward-only', () => {
  it('offers only forward connections, never the node behind you', () => {
    useDungeonStore.setState({ currentRun: makeRun() });
    const ids = useDungeonStore
      .getState()
      .getCurrentPathOptions()
      .map((n) => n.id);
    expect(ids).toEqual(['B']); // not S
  });
});

describe('KV-AUD-081 — moveToNode validates the target', () => {
  it('rejects a backward/unconnected move', () => {
    useDungeonStore.setState({ currentRun: makeRun() });
    useDungeonStore.getState().moveToNode('S'); // backward — must be refused
    expect(useDungeonStore.getState().currentRun!.currentMap!.currentNodeId).toBe('A');
  });
});

describe('KV-AUD-082 — floors are stable spaces', () => {
  it('ascending restores the cached floor exactly (position + completion)', () => {
    const cachedFloor1 = makeMap({
      currentNodeId: 'B', // we left floor 1 standing at its boss
      nodes: [
        node('S', 'start', { isCompleted: true }),
        node('A', 'combat', { isCompleted: true }),
        node('B', 'boss', { isCompleted: true, isCurrent: true }),
      ],
    });
    const floor2 = makeMap({
      floorNumber: 2,
      currentNodeId: 'S',
      nodes: [node('S', 'start', { isCurrent: true }), node('A', 'combat'), node('B', 'boss')],
    });
    useDungeonStore.setState({
      currentRun: makeRun({ currentFloor: 2, currentMap: floor2, floorMaps: { 1: cachedFloor1 } }),
    });
    useDungeonStore.getState().ascendFloor();
    const run = useDungeonStore.getState().currentRun!;
    expect(run.currentFloor).toBe(1);
    expect(run.currentMap!.currentNodeId).toBe('B');
    expect(run.currentMap!.nodes.find((n) => n.id === 'A')!.isCompleted).toBe(true);
    expect(run.floorMaps![2]).toBeDefined(); // floor 2 stashed for the way back down
  });

  it('the same run seed regenerates the same layout (no fresh-content farm)', () => {
    const layout = () => {
      useDungeonStore.setState({ currentRun: makeRun({ runSeed: 12345, floorMaps: {} }) });
      useDungeonStore.getState().enterFloor(3);
      return useDungeonStore
        .getState()
        .currentRun!.currentMap!.nodes.map((n) => `${n.id}:${n.type}`)
        .join('|');
    };
    expect(layout()).toBe(layout());
  });
});
