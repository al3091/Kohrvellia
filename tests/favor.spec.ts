/**
 * B-10 guard — deity favor single-writer (KV-AUD-121/242/270 et al).
 * `useDeityStore.adjustFavor` is the sole favor writer; it mirrors onto `character.deityFavor`
 * (which recomputes the blessing-driven maxHP/maxSP), so the two copies can never diverge — and it
 * clears the eviction flag once favor recovers.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useCharacterStore } from '../src/stores/useCharacterStore';
import { useDeityStore } from '../src/stores/useDeityStore';
import { createDefaultStats } from '../src/types/Stats';
import type { Character } from '../src/types/Character';

const baseChar = () =>
  ({
    deityFavor: 50,
    level: 1,
    stats: createDefaultStats(),
    levelHistory: [],
    equipment: {},
    currentHP: 100,
    maxHP: 100,
    currentSP: 50,
    maxSP: 50,
  }) as unknown as Character;

describe('B-10 — favor single-writer (adjustFavor mirrors the character copy)', () => {
  beforeEach(() => {
    useCharacterStore.setState({ character: baseChar() });
    useDeityStore.setState({
      relationship: { favor: 50, deityId: 'test_deity' } as never,
      isPatronEvicted: false,
    });
  });

  it('updates BOTH the deity favor and character.deityFavor (no divergence)', () => {
    useDeityStore.getState().adjustFavor(20, 'test');
    expect(useDeityStore.getState().relationship?.favor).toBe(70);
    expect(useCharacterStore.getState().character?.deityFavor).toBe(70);
  });

  it('clamps to 0 and flags eviction at the ABANDONED tier', () => {
    useDeityStore.getState().adjustFavor(-100, 'test'); // 50 → 0
    expect(useDeityStore.getState().relationship?.favor).toBe(0);
    expect(useCharacterStore.getState().character?.deityFavor).toBe(0);
    expect(useDeityStore.getState().isPatronEvicted).toBe(true);
  });

  it('CLEARS eviction once favor recovers above the abandoned tier', () => {
    useDeityStore.getState().adjustFavor(-100, 'test'); // evicted at 0
    expect(useDeityStore.getState().isPatronEvicted).toBe(true);
    useDeityStore.getState().adjustFavor(40, 'test'); // 0 → 40
    expect(useDeityStore.getState().isPatronEvicted).toBe(false);
    expect(useCharacterStore.getState().character?.deityFavor).toBe(40);
  });
});
