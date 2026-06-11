/**
 * B-03 regression guard — permadeath integrity (KV-AUD-002/069/070/098/104/113/124/138).
 *
 * Scope note: these tests exercise store logic directly. Paths that cross the inline
 * `require('./otherStore')` cycle-dodges (KV-AUD-353) are avoided until B-23 removes
 * them — the clearAllStores wiring is asserted at the source level instead.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

import { BAG_CAPACITY } from '../src/types/Character';
import type { Character, InventoryItem } from '../src/types/Character';
import type { Armor } from '../src/types/Armor';
import { useCharacterStore } from '../src/stores/useCharacterStore';
import { useInventoryStore } from '../src/stores/useInventoryStore';
import { useShopStore } from '../src/stores/useShopStore';
import { useSacredItemStore } from '../src/stores/useSacredItemStore';
import { useDeityStore } from '../src/stores/useDeityStore';
import { isFirstCombatForCharacter } from '../src/lib/combatSafety';

// Tests-only partial fixture; a fully-typed factory lands with the B-08 union batch.
function makeCharacter(overrides: Record<string, unknown> = {}): Character {
  return {
    name: 'Testa',
    epithet: 'the Brief',
    level: 1,
    currentHP: 100,
    maxHP: 100,
    currentSP: 30,
    maxSP: 30,
    gold: 500,
    isDead: false,
    inventory: [],
    equipment: {
      weapon: null,
      head: null,
      chest: null,
      hands: null,
      legs: null,
      accessory1: null,
      accessory2: null,
    },
    runStats: { monstersKilled: 0, goldEarned: 0, deepestFloor: 1 },
    statusEffects: [],
    ...overrides,
  } as unknown as Character;
}

const inv = (id: string): InventoryItem =>
  ({ id, type: 'material', stackable: false, quantity: 1, name: id, icon: 'x' } as InventoryItem);

beforeEach(() => {
  useCharacterStore.setState({ character: null });
});

describe('KV-AUD-069 — a corpse cannot be healed back to life', () => {
  it('positive modifyHP on a dead character is a no-op', () => {
    useCharacterStore.setState({ character: makeCharacter({ isDead: true, currentHP: 0 }) });
    useCharacterStore.getState().modifyHP(50);
    const c = useCharacterStore.getState().character!;
    expect(c.isDead).toBe(true);
    expect(c.currentHP).toBe(0);
  });

  it('lethal damage still kills (the guard is heal-only)', () => {
    useCharacterStore.setState({ character: makeCharacter({ currentHP: 5 }) });
    useCharacterStore.getState().modifyHP(-10);
    expect(useCharacterStore.getState().character!.isDead).toBe(true);
  });
});

describe('KV-AUD-104/002 — the merchant memory dies with the character', () => {
  it('resetForNewCharacter clears lifetime spend + expectation scores', () => {
    useShopStore.setState({
      lifetimeGoldSpent: { general: 8000, equipment: 1200 },
      belowExpectationScore: { general: 4, equipment: 2 },
    });
    useShopStore.getState().resetForNewCharacter();
    const s = useShopStore.getState();
    expect(s.lifetimeGoldSpent).toEqual({ general: 0, equipment: 0 });
    expect(s.belowExpectationScore).toEqual({ general: 0, equipment: 0 });
  });
});

describe('KV-AUD-098/002 — sacred state resets per character, lifetime survives', () => {
  it('clears acquired + character/run scopes + reveal queues, keeps lifetime metrics', () => {
    const m = useSacredItemStore.getState().metrics;
    useSacredItemStore.setState({
      acquired: ['deity_zeus_weapon'],
      metrics: {
        ...m,
        kills_total: 999,
        character_boss_bypass: 3,
        run_kills: 7,
        deities_at_max_favor: ['zeus'],
        pending_relic_reveals: ['zeus'],
      },
    });
    useSacredItemStore.getState().resetForNewCharacter();
    const after = useSacredItemStore.getState();
    expect(after.acquired).toEqual([]);
    expect(after.metrics.character_boss_bypass).toBe(0);
    expect(after.metrics.run_kills).toBe(0);
    expect(after.metrics.deities_at_max_favor).toEqual([]);
    expect(after.metrics.pending_relic_reveals).toEqual([]);
    expect(after.metrics.kills_total).toBe(999); // lifetime scope survives by design
  });
});

describe('KV-AUD-124 — deity reset is complete', () => {
  it('clears the eviction flag and the pending challenge reward', () => {
    useDeityStore.setState({ isPatronEvicted: true });
    useDeityStore.getState().reset();
    expect(useDeityStore.getState().isPatronEvicted).toBe(false);
    expect(useDeityStore.getState().pendingChallengeReward).toBeNull();
  });
});

describe('KV-AUD-002 — clearAllStores wires the new resets (source smoke)', () => {
  it('calls both resetForNewCharacter functions', () => {
    const src = fs.readFileSync(
      fileURLToPath(new URL('../src/lib/clearAllStores.ts', import.meta.url).href),
      'utf8'
    );
    expect(src).toContain('useShopStore.getState().resetForNewCharacter()');
    expect(src).toContain('useSacredItemStore.getState().resetForNewCharacter()');
  });
});

describe('KV-AUD-113 — one inventory capacity, honest results', () => {
  it('canAddItem and addItem both enforce BAG_CAPACITY', () => {
    const full = Array.from({ length: BAG_CAPACITY }, (_, i) => inv(`m${i}`));
    useCharacterStore.setState({ character: makeCharacter({ inventory: full }) });
    expect(useInventoryStore.getState().canAddItem()).toBe(false);
    expect(useInventoryStore.getState().addItem(inv('overflow'))).toBe(false);
    expect(useCharacterStore.getState().character!.inventory.length).toBe(BAG_CAPACITY);

    useCharacterStore.setState({
      character: makeCharacter({ inventory: full.slice(0, BAG_CAPACITY - 1) }),
    });
    expect(useInventoryStore.getState().canAddItem()).toBe(true);
    expect(useInventoryStore.getState().addItem(inv('fits'))).toBe(true);
    expect(useCharacterStore.getState().character!.inventory.length).toBe(BAG_CAPACITY);
  });
});

describe('KV-AUD-070 — equipment swaps cannot overflow the bag', () => {
  it('a full bag discards the displaced armor instead of growing past the cap', () => {
    const full = Array.from({ length: BAG_CAPACITY }, (_, i) => inv(`m${i}`));
    const oldHelm = { id: 'old_helm', displayName: 'Old Helm' } as unknown as Armor;
    const newHelm = { id: 'new_helm', displayName: 'New Helm' } as unknown as Armor;
    useCharacterStore.setState({
      character: makeCharacter({
        inventory: full,
        equipment: {
          weapon: null,
          head: oldHelm,
          chest: null,
          hands: null,
          legs: null,
          accessory1: null,
          accessory2: null,
        },
      }),
    });
    useCharacterStore.getState().equipArmor(newHelm, 'head');
    const c = useCharacterStore.getState().character!;
    expect(c.inventory.length).toBe(BAG_CAPACITY);
    expect((c.equipment.head as Armor).id).toBe('new_helm');
  });
});

describe('KV-AUD-138 — first-combat protection follows the character', () => {
  it('protects a fresh level-1 character regardless of device meta', () => {
    expect(isFirstCombatForCharacter(makeCharacter())).toBe(true);
  });
  it('ends after the first kill', () => {
    expect(
      isFirstCombatForCharacter(
        makeCharacter({ runStats: { monstersKilled: 1, goldEarned: 0, deepestFloor: 1 } })
      )
    ).toBe(false);
  });
  it('never applies past level 1, and never to a missing character', () => {
    expect(isFirstCombatForCharacter(makeCharacter({ level: 2 }))).toBe(false);
    expect(isFirstCombatForCharacter(null)).toBe(false);
  });
});
