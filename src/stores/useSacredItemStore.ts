/**
 * Sacred Item Acquisition Store
 *
 * Tracks all metrics needed to unlock sacred items (pantheon sets, domain
 * artifacts, and deity relics). Metrics are accumulated across runs / lifetime
 * and checked against every item's acquisition.requirements array.
 *
 * When an item is unlocked the player's inventory receives an InventoryItem
 * entry whose data comes from the converted sacred item.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createVersionedPersist } from '../lib/createVersionedPersist';

import { ALL_PANTHEON_PIECES } from '../data/items/pantheonSets/index';
import { DOMAIN_ARTIFACTS } from '../data/items/domainArtifacts';
import { ALL_DEITY_RELICS } from '../data/items/deityRelics';
import type { SacredItem, AcquisitionMetric } from '../types/SacredItem';

// ──────────────────────────────────────────────────────────────────────────────
// Metric registry — one counter per AcquisitionMetric variant
// ──────────────────────────────────────────────────────────────────────────────

export interface SacredItemMetrics {
  // Lifetime (never reset)
  kills_total: number;
  kills_with_stat: Partial<Record<string, number>>;  // by stat name
  kills_type: Partial<Record<string, number>>;        // by enemy type
  boss_kills: number;
  boss_kills_unique: Partial<Record<string, boolean>>; // boss id → defeated
  boss_bypass: number;
  flee_total: number;
  flee_elite: number;
  flee_boss: number;
  observe_total: number;
  observe_unique_types: Partial<Record<string, boolean>>; // enemy type → observed
  taunt_total: number;
  taunt_successful: number;
  status_inflict: Partial<Record<string, number>>;    // by status type
  weapon_upgrades: number;
  weapon_legendary: number;
  gold_accumulated_max: number; // peak gold held simultaneously
  gold_spent_blacksmith: number;
  gold_spent_shops: number;
  healing_received: number;
  rest_sites_used: number;
  treasure_rooms: number;
  mystery_rooms: number;
  event_success: number;
  shop_visits: number;
  familia_visits: number;
  paragon_achieved: boolean;
  favor_favoured_child_count: number; // deities ever at 91+ favor
  damage_taken_total: number;
  items_destroyed: number;
  // character-lifetime (reset on new character)
  character_boss_bypass: number;
  character_boss_kills_unique: Partial<Record<string, boolean>>;

  // Per-run (reset at run start)
  run_kills: number;
  run_boss_kills: number;
  run_boss_kills_by_type: Partial<Record<string, boolean>>;
  run_boss_bypass: number;
  run_flee: number;
  run_skill_uses: number;
  run_skill_sp_spent: number;
  run_damage_taken: number;
  run_status_received: number;
  run_observe: number;
  run_floors_reached: number;
  run_boss_nodamage: boolean;  // current boss fight taken no damage
  run_taunt_successful: number;
  run_items_destroyed: number;

  // Deity reveal tracking
  deities_revealed: string[];           // deity IDs whose relic text has been shown
  deities_at_max_favor: string[];       // deity IDs at 100% favor
  pending_relic_reveals: string[];      // deity IDs queued for UI reveal
}

export interface SacredItemState {
  acquired: string[];            // item IDs the player has earned
  metrics: SacredItemMetrics;
  pendingNotifications: { itemId: string; itemName: string }[];
}

interface SacredItemActions {
  // ── Metric increments ──
  incrementKills(count: number, statUsed?: string, enemyType?: string): void;
  incrementBossKill(bossId?: string): void;
  incrementBossBypass(bossId?: string): void;
  incrementFlee(isElite?: boolean, isBoss?: boolean): void;
  incrementObserve(enemyType?: string): void;
  incrementTaunt(successful?: boolean): void;
  incrementStatusInflict(statusType: string): void;
  incrementWeaponUpgrade(reachedLegendary?: boolean): void;
  incrementBlacksmithSpend(gold: number): void;
  incrementShopSpend(gold: number): void;
  incrementHealingReceived(count?: number): void;
  incrementRestSite(): void;
  incrementTreasureRoom(): void;
  incrementMysteryRoom(): void;
  incrementEventSuccess(): void;
  incrementShopVisit(): void;
  incrementFamiliaVisit(): void;
  recordParagon(): void;
  recordFavoredChild(deityId: string): void;
  recordMaxFavor(deityId: string, favor: number): void;
  updateGoldHeld(currentGold: number): void;
  incrementDamageTaken(amount: number, isRun?: boolean): void;
  incrementItemsDestroyed(isRun?: boolean): void;
  updateRunFloorReached(floor: number): void;
  setBossNoDamage(val: boolean): void;

  // ── Run lifecycle ──
  resetRunMetrics(): void;
  resetForNewCharacter(): void;

  // ── Acquisition checking ──
  checkAndUnlock(): void;
  forceUnlock(itemId: string): void;

  // ── Notification UI ──
  dismissNotification(itemId: string): void;
  dismissRelicReveal(deityId: string): void;
}

const INITIAL_METRICS: SacredItemMetrics = {
  kills_total: 0,
  kills_with_stat: {},
  kills_type: {},
  boss_kills: 0,
  boss_kills_unique: {},
  boss_bypass: 0,
  flee_total: 0,
  flee_elite: 0,
  flee_boss: 0,
  observe_total: 0,
  observe_unique_types: {},
  taunt_total: 0,
  taunt_successful: 0,
  status_inflict: {},
  weapon_upgrades: 0,
  weapon_legendary: 0,
  gold_accumulated_max: 0,
  gold_spent_blacksmith: 0,
  gold_spent_shops: 0,
  healing_received: 0,
  rest_sites_used: 0,
  treasure_rooms: 0,
  mystery_rooms: 0,
  event_success: 0,
  shop_visits: 0,
  familia_visits: 0,
  paragon_achieved: false,
  favor_favoured_child_count: 0,
  damage_taken_total: 0,
  items_destroyed: 0,
  character_boss_bypass: 0,
  character_boss_kills_unique: {},

  run_kills: 0,
  run_boss_kills: 0,
  run_boss_kills_by_type: {},
  run_boss_bypass: 0,
  run_flee: 0,
  run_skill_uses: 0,
  run_skill_sp_spent: 0,
  run_damage_taken: 0,
  run_status_received: 0,
  run_observe: 0,
  run_floors_reached: 0,
  run_boss_nodamage: false,
  run_taunt_successful: 0,
  run_items_destroyed: 0,

  deities_revealed: [],
  deities_at_max_favor: [],
  pending_relic_reveals: [],
};

// ──────────────────────────────────────────────────────────────────────────────
// Condition evaluator
// ──────────────────────────────────────────────────────────────────────────────

function evaluateRequirement(
  metric: AcquisitionMetric,
  targetType: string | undefined,
  requiredValue: number,
  m: SacredItemMetrics
): number {
  switch (metric) {
    case 'kills_total': return m.kills_total;
    case 'kills_with_stat': return m.kills_with_stat[targetType ?? ''] ?? 0;
    case 'kills_type': return m.kills_type[targetType ?? ''] ?? 0;
    case 'boss_kills':
      if (targetType === 'different_bosses' || targetType === 'different_characters_floor25') {
        return Object.keys(m.boss_kills_unique).length;
      }
      return m.boss_kills;
    case 'boss_kills_run':
      if (targetType) return (m.run_boss_kills_by_type[targetType] ? 1 : 0);
      return m.run_boss_kills;
    case 'boss_nodamage': return m.run_boss_nodamage ? 1 : 0;
    case 'boss_noattack': return 0; // tracked externally via combat flags
    case 'boss_skillonly': return 0; // tracked via combat flags
    case 'boss_bypass': return m.boss_bypass;
    case 'floors_reached': return m.run_floors_reached;
    case 'floors_nodeath': return 0; // complex — TODO per-run no-death tracking
    case 'floor_noconsumable': return 0; // TODO per-floor tracking
    case 'floor_nodefend': return 0; // TODO per-floor tracking
    case 'floor_noretreat': return m.run_flee === 0 ? 1 : 0;
    case 'consecutive_fights': return m.run_kills; // simplified: proxy with run kills
    case 'dodges_total': return 0; // TODO dodge tracking
    case 'observe_total':
      if (targetType?.startsWith('unique_enemy')) return Object.keys(m.observe_unique_types).length;
      return m.observe_total;
    case 'taunt_total':
      if (targetType === 'successful') return m.taunt_successful;
      if (targetType === 'causes_enemy_flee') return 0; // TODO
      return m.taunt_total;
    case 'flee_total': return m.flee_total;
    case 'flee_elite': return m.flee_elite;
    case 'flee_boss': return m.flee_boss;
    case 'status_inflict':
      if (targetType) return m.status_inflict[targetType] ?? 0;
      return (Object.values(m.status_inflict) as number[]).reduce((a: number, b: number) => a + (b ?? 0), 0);
    case 'status_received_survived':
      if (requiredValue === 0) return m.run_status_received === 0 ? 0 : 1; // 0 = "must have zero"
      return m.run_status_received;
    case 'damage_taken_run': return m.run_damage_taken;
    case 'skill_uses': return m.run_skill_uses;
    case 'skill_sp_spent': return m.run_skill_sp_spent;
    case 'gold_accumulated': return m.gold_accumulated_max;
    case 'gold_spent_blacksmith': return m.gold_spent_blacksmith;
    case 'weapon_upgrades': return m.weapon_upgrades;
    case 'weapon_legendary': return m.weapon_legendary;
    case 'treasure_rooms': return m.treasure_rooms;
    case 'mystery_rooms': return m.mystery_rooms;
    case 'event_success': return m.event_success;
    case 'rest_sites_used': return m.rest_sites_used;
    case 'familia_visits': return m.familia_visits;
    case 'shop_visits': return m.shop_visits;
    case 'achievements_total': return 0; // TODO
    case 'level_reached': return 0; // checked externally
    case 'paragon': return m.paragon_achieved ? 1 : 0;
    case 'favor_favoured_child': return m.favor_favoured_child_count;
    case 'stats_grade': return 0; // checked externally
    case 'healing_received': return m.healing_received;
    case 'items_destroyed': return m.items_destroyed;
    case 'same_weapon_run': return 0;
    case 'debuffs_active_boss': return 0;
    case 'sp_damage_dealt': return 0;
    case 'custom': return 0; // custom conditions require manual/external check
    default: return 0;
  }
}

function checkItemUnlockable(item: SacredItem, m: SacredItemMetrics): boolean {
  const { requirements, requireAll } = item.acquisition;

  if (requireAll) {
    return requirements.every(req => {
      // For requirements where value = 0 and we want "must be zero":
      if (req.value === 0) {
        return evaluateRequirement(req.metric, req.targetType, 0, m) === 0;
      }
      return evaluateRequirement(req.metric, req.targetType, req.value, m) >= req.value;
    });
  } else {
    return requirements.some(req =>
      evaluateRequirement(req.metric, req.targetType, req.value, m) >= req.value
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// All sacred items flat list (excluding deity relics which have isSecret)
// ──────────────────────────────────────────────────────────────────────────────

function getAllCheckableItems(): SacredItem[] {
  const relicItems: SacredItem[] = ALL_DEITY_RELICS.flatMap(r => [r.weapon, r.accessory]);
  return [...ALL_PANTHEON_PIECES, ...DOMAIN_ARTIFACTS, ...relicItems];
}

// ──────────────────────────────────────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────────────────────────────────────

export const useSacredItemStore = create<SacredItemState & SacredItemActions>()(
  persist(
    (set, get) => ({
      acquired: [],
      metrics: { ...INITIAL_METRICS },
      pendingNotifications: [],

      // ── Metric increments ──

      incrementKills(count, statUsed, enemyType) {
        set(s => {
          const m = { ...s.metrics };
          m.kills_total += count;
          m.run_kills += count;
          if (statUsed) m.kills_with_stat = { ...m.kills_with_stat, [statUsed]: (m.kills_with_stat[statUsed] ?? 0) + count };
          if (enemyType) m.kills_type = { ...m.kills_type, [enemyType]: (m.kills_type[enemyType] ?? 0) + count };
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementBossKill(bossId) {
        set(s => {
          const m = { ...s.metrics };
          m.boss_kills += 1;
          m.run_boss_kills += 1;
          if (bossId) {
            m.boss_kills_unique = { ...m.boss_kills_unique, [bossId]: true };
            m.run_boss_kills_by_type = { ...m.run_boss_kills_by_type, [bossId]: true };
          }
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementBossBypass(bossId) {
        set(s => {
          const m = { ...s.metrics };
          m.boss_bypass += 1;
          m.run_boss_bypass += 1;
          m.character_boss_bypass += 1;
          if (bossId) m.character_boss_kills_unique = { ...m.character_boss_kills_unique, [bossId]: true };
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementFlee(isElite, isBoss) {
        set(s => {
          const m = { ...s.metrics };
          m.flee_total += 1;
          m.run_flee += 1;
          if (isElite) m.flee_elite += 1;
          if (isBoss) m.flee_boss += 1;
          return { metrics: m };
        });
      },

      incrementObserve(enemyType) {
        set(s => {
          const m = { ...s.metrics };
          m.observe_total += 1;
          m.run_observe += 1;
          if (enemyType) m.observe_unique_types = { ...m.observe_unique_types, [enemyType]: true };
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementTaunt(successful = false) {
        set(s => {
          const m = { ...s.metrics };
          m.taunt_total += 1;
          if (successful) {
            m.taunt_successful += 1;
            m.run_taunt_successful += 1;
          }
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementStatusInflict(statusType) {
        set(s => {
          const m = { ...s.metrics };
          m.status_inflict = { ...m.status_inflict, [statusType]: (m.status_inflict[statusType] ?? 0) + 1 };
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementWeaponUpgrade(reachedLegendary = false) {
        set(s => {
          const m = { ...s.metrics };
          m.weapon_upgrades += 1;
          if (reachedLegendary) m.weapon_legendary += 1;
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      incrementBlacksmithSpend(gold) {
        set(s => ({ metrics: { ...s.metrics, gold_spent_blacksmith: s.metrics.gold_spent_blacksmith + gold } }));
        get().checkAndUnlock();
      },

      incrementShopSpend(gold) {
        set(s => ({ metrics: { ...s.metrics, gold_spent_shops: s.metrics.gold_spent_shops + gold } }));
      },

      incrementHealingReceived(count = 1) {
        set(s => ({ metrics: { ...s.metrics, healing_received: s.metrics.healing_received + count } }));
        get().checkAndUnlock();
      },

      incrementRestSite() {
        set(s => ({ metrics: { ...s.metrics, rest_sites_used: s.metrics.rest_sites_used + 1 } }));
        get().checkAndUnlock();
      },

      incrementTreasureRoom() {
        set(s => ({ metrics: { ...s.metrics, treasure_rooms: s.metrics.treasure_rooms + 1 } }));
        get().checkAndUnlock();
      },

      incrementMysteryRoom() {
        set(s => ({ metrics: { ...s.metrics, mystery_rooms: s.metrics.mystery_rooms + 1 } }));
        get().checkAndUnlock();
      },

      incrementEventSuccess() {
        set(s => ({ metrics: { ...s.metrics, event_success: s.metrics.event_success + 1 } }));
      },

      incrementShopVisit() {
        set(s => ({ metrics: { ...s.metrics, shop_visits: s.metrics.shop_visits + 1 } }));
      },

      incrementFamiliaVisit() {
        set(s => ({ metrics: { ...s.metrics, familia_visits: s.metrics.familia_visits + 1 } }));
        get().checkAndUnlock();
      },

      recordParagon() {
        set(s => ({ metrics: { ...s.metrics, paragon_achieved: true } }));
        get().checkAndUnlock();
      },

      recordFavoredChild(_deityId) {
        set(s => {
          const m = { ...s.metrics };
          m.favor_favoured_child_count += 1;
          return { metrics: m };
        });
        get().checkAndUnlock();
      },

      recordMaxFavor(deityId, favor) {
        if (favor < 100) return;
        set(s => {
          const m = { ...s.metrics };
          if (!m.deities_at_max_favor.includes(deityId)) {
            m.deities_at_max_favor = [...m.deities_at_max_favor, deityId];
          }
          if (!m.deities_revealed.includes(deityId) && !m.pending_relic_reveals.includes(deityId)) {
            m.pending_relic_reveals = [...m.pending_relic_reveals, deityId];
          }
          return { metrics: m };
        });
      },

      updateGoldHeld(currentGold) {
        set(s => ({
          metrics: {
            ...s.metrics,
            gold_accumulated_max: Math.max(s.metrics.gold_accumulated_max, currentGold),
          },
        }));
        get().checkAndUnlock();
      },

      incrementDamageTaken(amount, isRun = true) {
        set(s => ({
          metrics: {
            ...s.metrics,
            damage_taken_total: s.metrics.damage_taken_total + amount,
            run_damage_taken: isRun ? s.metrics.run_damage_taken + amount : s.metrics.run_damage_taken,
          },
        }));
      },

      incrementItemsDestroyed(isRun = true) {
        set(s => ({
          metrics: {
            ...s.metrics,
            items_destroyed: s.metrics.items_destroyed + 1,
            run_items_destroyed: isRun ? s.metrics.run_items_destroyed + 1 : s.metrics.run_items_destroyed,
          },
        }));
        get().checkAndUnlock();
      },

      updateRunFloorReached(floor) {
        set(s => ({
          metrics: {
            ...s.metrics,
            run_floors_reached: Math.max(s.metrics.run_floors_reached, floor),
          },
        }));
        get().checkAndUnlock();
      },

      setBossNoDamage(val) {
        set(s => ({ metrics: { ...s.metrics, run_boss_nodamage: val } }));
      },

      // ── Run lifecycle ──

      resetRunMetrics() {
        set(s => ({
          metrics: {
            ...s.metrics,
            run_kills: 0,
            run_boss_kills: 0,
            run_boss_kills_by_type: {},
            run_boss_bypass: 0,
            run_flee: 0,
            run_skill_uses: 0,
            run_skill_sp_spent: 0,
            run_damage_taken: 0,
            run_status_received: 0,
            run_observe: 0,
            run_floors_reached: 0,
            run_boss_nodamage: false,
            run_taunt_successful: 0,
            run_items_destroyed: 0,
          },
        }));
      },

      // Per-character reset (remediation B-03; KV-AUD-098/002).
      // Clears earned items + character-scope and run-scope metrics + the active-character
      // reveal queues. LIFETIME metrics (account-wide acquisition scopes) survive by design,
      // as does deities_revealed (the player's knowledge of already-shown relic texts).
      resetForNewCharacter() {
        set(s => ({
          acquired: [],
          metrics: {
            ...s.metrics,
            character_boss_bypass: 0,
            character_boss_kills_unique: {},
            run_kills: 0,
            run_boss_kills: 0,
            run_boss_kills_by_type: {},
            run_boss_bypass: 0,
            run_flee: 0,
            run_skill_uses: 0,
            run_skill_sp_spent: 0,
            run_damage_taken: 0,
            run_status_received: 0,
            run_observe: 0,
            run_floors_reached: 0,
            run_boss_nodamage: false,
            run_taunt_successful: 0,
            run_items_destroyed: 0,
            deities_at_max_favor: [],
            pending_relic_reveals: [],
          },
        }));
      },

      // ── Acquisition checking ──

      checkAndUnlock() {
        const { acquired, metrics } = get();
        const allItems = getAllCheckableItems();
        const newlyUnlocked: SacredItem[] = [];

        for (const item of allItems) {
          if (acquired.includes(item.id)) continue;
          // Secret items only checkable once the deity is at 100% favor
          if (item.isSecret && !metrics.deities_at_max_favor.includes(item.deityId ?? '')) continue;
          if (checkItemUnlockable(item, metrics)) {
            newlyUnlocked.push(item);
          }
        }

        if (newlyUnlocked.length === 0) return;

        set(s => ({
          acquired: [...s.acquired, ...newlyUnlocked.map(i => i.id)],
          pendingNotifications: [
            ...s.pendingNotifications,
            ...newlyUnlocked.map(i => ({ itemId: i.id, itemName: i.name })),
          ],
        }));

        // Push sacred items into character inventory
        const { useCharacterStore } = require('./useCharacterStore') as typeof import('./useCharacterStore');
        const { convertSacredItemToEquippable } = require('../lib/sacredItemConversion') as typeof import('../lib/sacredItemConversion');
        const charStore = useCharacterStore.getState();

        for (const item of newlyUnlocked) {
          const equippable = convertSacredItemToEquippable(item);
          charStore.addToInventory({
            id: item.id,
            type: equippable.type,
            stackable: false,
            quantity: 1,
            name: item.name,
            icon: item.slot === 'weapon' ? '⚔️' : item.tier === 'deity' ? '✨' : '🔮',
            weaponData: equippable.type === 'weapon' ? equippable.data as import('../types/Weapon').Weapon : undefined,
            armorData: equippable.type === 'armor' ? equippable.data as import('../types/Armor').Armor : undefined,
            accessoryData: equippable.type === 'accessory' ? equippable.data as import('../types/Armor').Accessory : undefined,
          });
        }
      },

      forceUnlock(itemId) {
        const allItems = getAllCheckableItems();
        const item = allItems.find(i => i.id === itemId);
        if (!item || get().acquired.includes(itemId)) return;

        set(s => ({
          acquired: [...s.acquired, itemId],
          pendingNotifications: [
            ...s.pendingNotifications,
            { itemId, itemName: item.name },
          ],
        }));
      },

      dismissNotification(itemId) {
        set(s => ({
          pendingNotifications: s.pendingNotifications.filter(n => n.itemId !== itemId),
        }));
      },

      dismissRelicReveal(deityId) {
        set(s => ({
          metrics: {
            ...s.metrics,
            deities_revealed: [...s.metrics.deities_revealed, deityId],
            pending_relic_reveals: s.metrics.pending_relic_reveals.filter(id => id !== deityId),
          },
        }));
      },
    }),
    createVersionedPersist<SacredItemState & SacredItemActions>('kohrvellia-sacred-items', 1, {
      partialize: (s) => ({
        acquired: s.acquired,
        metrics: s.metrics,
      }),
    })
  )
);
