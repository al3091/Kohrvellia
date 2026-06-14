/**
 * createVersionedPersist (B-07 — KV-AUD-073/088/102/141)
 *
 * One safe, versioned persistence config for every Zustand store. The bare `persist({ name,
 * storage })` calls the game shipped with had neither of the two protections below, so a deliberate
 * shape change (or even just adding a nested field) could corrupt or crash an existing save:
 *
 *   1. A schema `version` + `migrate` hook — so intentional shape changes are *upgraded*, not silently
 *      mismatched. (The dungeon store had resorted to bumping its storage key to `-v2`, which simply
 *      discards the old run.)
 *   2. A DEEP merge of saved data over the current defaults — so a field added to a store is never
 *      `undefined` after loading an old save (the crash class). Dynamic-key maps keep all their entries.
 *
 * Zustand's built-in merge is a *shallow* spread, which only protects top-level fields; nested objects
 * are replaced wholesale by the old saved shape. `deepMergeDefaults` fixes that.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, type PersistOptions } from 'zustand/middleware';

/**
 * Fill missing fields from `defaults` without discarding saved data:
 *  - plain objects deep-merge (new schema fields get their default; dynamic-key maps keep entries)
 *  - arrays & primitives are taken from the save as-is (replace, never element-merge)
 *  - an explicit `null` in the save wins (e.g. a deleted character)
 *  - a key absent from the save keeps the default
 */
export function deepMergeDefaults<T>(defaults: T, persisted: unknown): T {
  if (persisted === undefined) return defaults;
  if (persisted === null) return persisted as T;
  if (Array.isArray(persisted) || typeof persisted !== 'object') return persisted as T;
  if (defaults === null || typeof defaults !== 'object' || Array.isArray(defaults)) {
    return persisted as T;
  }
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const [key, value] of Object.entries(persisted as Record<string, unknown>)) {
    out[key] = deepMergeDefaults((defaults as Record<string, unknown>)[key], value);
  }
  return out as T;
}

export interface VersionedPersistExtras<T> {
  /** Persist only a subset of state (passed straight through to zustand). */
  partialize?: (state: T) => Partial<T>;
  /** Upgrade an older persisted shape to the current `version`. Default: identity. */
  migrate?: (persisted: unknown, fromVersion: number) => unknown;
  /** Override the default deep-merge (e.g. the soul behavement reconciliation). */
  merge?: (persisted: unknown, current: T) => T;
}

/**
 * Build a complete, versioned `PersistOptions` for a Zustand `persist(...)` call.
 * Usage: `persist((set, get) => ({ ... }), createVersionedPersist<MyState>('kohrvellia-x', 1))`.
 */
export function createVersionedPersist<T>(
  name: string,
  version: number,
  extras: VersionedPersistExtras<T> = {}
): PersistOptions<T> {
  const options: PersistOptions<T> = {
    name,
    version,
    storage: createJSONStorage(() => AsyncStorage),
    migrate: (extras.migrate ?? ((persisted) => persisted)) as PersistOptions<T>['migrate'],
    merge: (persisted, current) =>
      extras.merge ? extras.merge(persisted, current as T) : deepMergeDefaults(current as T, persisted),
  };
  // Only attach partialize when provided — zustand calls it directly, so an explicit `undefined` throws.
  if (extras.partialize) {
    options.partialize = extras.partialize as PersistOptions<T>['partialize'];
  }
  return options;
}
