/**
 * B-05 regression guard — event-firing single-owner (KV-AUD-074/093/109/220/221/232/253).
 * The STORE owns gameplay events; combat.tsx must never fire a counter the store fires.
 * Source-level assertions guard the ownership boundary; store-level tests prove the
 * exactly-once semantics.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

import { useSoulStore } from '../src/stores/useSoulStore';

const read = (rel: string) =>
  fs.readFileSync(fileURLToPath(new URL(rel, import.meta.url).href), 'utf8');

const combatSrc = read('../app/dungeon/combat.tsx');
const floorSrc = read('../app/dungeon/floor.tsx');
const shopSrc = read('../src/stores/useShopStore.ts');

describe('KV-AUD-093/220 — the store is the single owner of combat counters', () => {
  // Every ID the combat STORE fires must never be fired by the combat SCREEN.
  const storeOwned = [
    'phys_attacks_100',
    'phys_crits_25',
    'phys_kills_50',
    'phys_str_weapon_kills',
    'magic_attacks_100',
    'magic_kills_50',
    'tank_blocks_50',
    'tank_damage_taken_1000',
    'tank_heal_received',
    'tank_survive_low_hp',
    'caution_observes',
    'caution_consumable_use',
    'evade_dodges_50',
    'evade_consecutive_dodges',
    'social_taunts',
    'risk_low_hp_attacks',
    'risk_near_death_wins',
    'risk_elite_fights',
    'glory_boss_streak_3',
    'resource_gold_1000',
    'resource_items_50',
    'resource_weapons_equip',
    'resource_legendary_find',
    'explore_rooms_100',
  ];
  for (const id of storeOwned) {
    it(`combat.tsx no longer fires ${id}`, () => {
      expect(combatSrc).not.toMatch(new RegExp(`(incrementBehavement|setBehavementProgress|checkConsecutiveBehavement)\\('${id}'`));
    });
  }
});

describe('KV-AUD-221 — magic kills no longer pollute the physical streak', () => {
  it('exactly two phys_consecutive_kills sites remain (attack + quick strike)', () => {
    const matches = combatSrc.match(/checkConsecutiveBehavement\('phys_consecutive_kills'/g) ?? [];
    expect(matches.length).toBe(2);
  });
});

describe('KV-AUD-232/253 — per-floor conducts evaluate on real descents', () => {
  const conducts = ['magic_no_physical', 'risk_no_heal_floor', 'caution_no_traps', 'glory_perfect_floor'];
  for (const id of conducts) {
    it(`floor.tsx evaluates ${id} on descent`, () => {
      expect(floorSrc).toContain(`'${id}'`);
    });
    it(`combat.tsx no longer evaluates ${id}`, () => {
      expect(combatSrc).not.toContain(`'${id}'`);
    });
  }
});

describe('KV-AUD-109 — shop sales feed the Merchant behavement', () => {
  it('sellItem fires resource_sell_items', () => {
    expect(shopSrc).toMatch(/sellItem[\s\S]*?incrementBehavement\('resource_sell_items'/);
  });
});

describe('exactly-once store semantics', () => {
  it('one increment advances a behavement by exactly one', () => {
    useSoulStore.getState().initializeDenatus();
    const before =
      useSoulStore.getState().getBehavementProgress('phys_attacks_100')?.current ?? 0;
    useSoulStore.getState().incrementBehavement('phys_attacks_100');
    const after = useSoulStore.getState().getBehavementProgress('phys_attacks_100')?.current;
    expect(after).toBe(before + 1);
  });
});
