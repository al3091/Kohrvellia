/**
 * B-07 migration guard (KV-AUD-073/088/094/102/141) — versioned persistence.
 * Proves the deep-merge fills new schema fields from defaults without losing saved data, and that
 * the soul behavement array reconciles against current definitions on load (no crash, no silent loss).
 */
import { describe, it, expect } from 'vitest';
import { deepMergeDefaults, createVersionedPersist } from '../src/lib/createVersionedPersist';
import { reconcileBehavements } from '../src/stores/useSoulStore';
import type { BehavementProgress } from '../src/types/Behavement';

describe('deepMergeDefaults — old saves hydrate without losing data or leaving fields undefined', () => {
  it('fills a newly-added nested field from defaults', () => {
    const defaults = { character: { name: 'x', level: 1, huntMemory: 0 } };
    const saved = { character: { name: 'Hero', level: 5 } }; // saved before huntMemory existed
    expect(deepMergeDefaults(defaults, saved)).toEqual({
      character: { name: 'Hero', level: 5, huntMemory: 0 },
    });
  });

  it('preserves every entry of a dynamic-key map', () => {
    const defaults = { floorMaps: {} as Record<string, number> };
    const saved = { floorMaps: { '1': 11, '2': 22 } };
    expect(deepMergeDefaults(defaults, saved)).toEqual({ floorMaps: { '1': 11, '2': 22 } });
  });

  it('replaces arrays wholesale (no element merge)', () => {
    expect(deepMergeDefaults({ items: [1, 2, 3] }, { items: [9] })).toEqual({ items: [9] });
  });

  it('an explicit null in the save wins (e.g. a deleted character)', () => {
    expect(deepMergeDefaults({ character: { name: 'x' } }, { character: null })).toEqual({
      character: null,
    });
  });

  it('a key absent from the save keeps the default', () => {
    expect(deepMergeDefaults({ a: 1, b: 2 }, { a: 9 })).toEqual({ a: 9, b: 2 });
  });

  it('keeps store action functions (present in defaults, absent from the save)', () => {
    const fn = () => 1;
    const merged = deepMergeDefaults({ doThing: fn, count: 0 }, { count: 7 });
    expect(merged.doThing).toBe(fn);
    expect(merged.count).toBe(7);
  });
});

describe('createVersionedPersist — config shape', () => {
  it('carries name + version and a migrate/merge', () => {
    const cfg = createVersionedPersist<{ a: number }>('kohrvellia-test', 3);
    expect(cfg.name).toBe('kohrvellia-test');
    expect(cfg.version).toBe(3);
    expect(typeof cfg.migrate).toBe('function');
    expect(typeof cfg.merge).toBe('function');
  });

  it('default merge deep-fills defaults', () => {
    const cfg = createVersionedPersist<{ nested: { a: number; b: number } }>('kohrvellia-test2', 1);
    const merged = cfg.merge!({ nested: { a: 9 } }, { nested: { a: 0, b: 2 } });
    expect(merged).toEqual({ nested: { a: 9, b: 2 } });
  });
});

describe('reconcileBehavements (KV-AUD-094) — soul array survives a definitions change', () => {
  it('starts fresh at zero when there is no save', () => {
    const fresh = reconcileBehavements(undefined);
    expect(fresh.length).toBeGreaterThan(0);
    expect(fresh.every((b) => b.current === 0)).toBe(true);
  });

  it('keeps earned progress, adds new behavements, drops unknown ones', () => {
    const fresh = reconcileBehavements(undefined);
    const realId = fresh[0].behavementId;
    const saved: BehavementProgress[] = [
      { ...fresh[0], current: fresh[0].target, completed: true },
      { ...fresh[0], behavementId: '__removed__', current: 5, completed: true }, // no longer defined
    ];
    const merged = reconcileBehavements(saved);
    expect(merged.length).toBe(fresh.length); // count tracks the definitions, not the save
    expect(merged.find((b) => b.behavementId === '__removed__')).toBeUndefined();
    const kept = merged.find((b) => b.behavementId === realId)!;
    expect(kept.current).toBe(kept.target);
    expect(kept.completed).toBe(true);
  });

  it('clamps over-cap saved progress to the current target', () => {
    const fresh = reconcileBehavements(undefined);
    const id = fresh[0].behavementId;
    const merged = reconcileBehavements([{ ...fresh[0], current: 999999, completed: false }]);
    const got = merged.find((b) => b.behavementId === id)!;
    expect(got.current).toBe(got.target);
    expect(got.completed).toBe(true);
  });
});
