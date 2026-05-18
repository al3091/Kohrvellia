/**
 * Market Store — The Living Economy
 *
 * Prices advance on FLOOR DESCENTS only — not on enter/exit cycles.
 * Event durations are HIDDEN from the player intentionally.
 * Ephemeral events expire randomly (20-35% chance per descent).
 * Supply memory: selling too much of one category suppresses its price.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MARKET_EVENT_TEMPLATES,
  NULL_EVENT_WEIGHT,
  type MaterialCategory,
  type MarketEventTemplate,
} from '../data/marketEvents';
import { getMaterialById } from '../data/materials';

// Internal: active event with hidden countdown
export interface ActiveMarketEvent {
  templateId: string;
  title: string;
  flavor: string;
  icon: string;
  effects: Array<{ category: MaterialCategory | 'all'; multiplier: number }>;
  durationType: 'ephemeral' | 'brief' | 'seasonal' | 'extended';
  ticksRemaining: number; // -1 = ephemeral (uses random expiration, not tick count)
}

// Returned to UI for display
export interface SupplyPressure {
  category: MaterialCategory;
  multiplier: number;
  reason: string;
}

const ALL_CATEGORIES: MaterialCategory[] = ['metal', 'monster', 'gem', 'essence'];

const TICK_RANGES: Record<string, [number, number]> = {
  ephemeral: [-1, -1],
  brief: [8, 12],
  seasonal: [15, 25],
  extended: [30, 50],
};

const SUPPLY_THRESHOLD = 12;
const SUPPLY_WINDOW = 20; // Floor descents before resetting sale counts
const NEW_EVENT_CHANCE = 0.30; // Chance to spawn a new event per descent (when < 2 active)

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildActiveEvent(template: MarketEventTemplate): ActiveMarketEvent {
  const [rangeMin, rangeMax] = TICK_RANGES[template.durationType];
  const ticks = rangeMin === -1 ? -1 : randomRange(rangeMin, rangeMax);

  let effects = [...template.effects];

  // Guild Master's Request: dynamically pick a random category at 3.0×
  if (template.id === 'guild_master_request') {
    const picked = ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
    effects = [{ category: picked, multiplier: 3.0 }];
  }

  return {
    templateId: template.id,
    title: template.title,
    flavor: template.flavor,
    icon: template.icon,
    effects,
    durationType: template.durationType,
    ticksRemaining: ticks,
  };
}

function selectRandomEvent(playerLevel: number): ActiveMarketEvent | null {
  const eligible = MARKET_EVENT_TEMPLATES.filter(t => t.minLevel <= playerLevel);
  const totalWeight = eligible.reduce((sum, t) => sum + t.weight, 0) + NULL_EVENT_WEIGHT;

  let roll = Math.random() * totalWeight;

  for (const template of eligible) {
    roll -= template.weight;
    if (roll <= 0) return buildActiveEvent(template);
  }
  return null; // Calm market — no event spawned
}

interface MarketState {
  activeEvents: ActiveMarketEvent[];
  recentSales: Record<MaterialCategory, number>; // Units sold in current window
  floorDescentsInWindow: number;                 // Resets every SUPPLY_WINDOW descents

  // Called by useDungeonStore.enterFloor()
  onFloorDescend: (playerLevel: number) => void;

  // Called by Guild Hall when materials are sold
  recordSale: (category: MaterialCategory, quantity: number) => void;

  // Used by Guild Hall Material Registry to compute effective price
  getMultiplier: (materialId: string) => number;

  // Used by Guild Hall Market Board UI
  getActiveEvents: () => ActiveMarketEvent[];
  getSupplyPressures: () => SupplyPressure[];

  // Reset on new character
  reset: () => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      activeEvents: [],
      recentSales: { metal: 0, monster: 0, gem: 0, essence: 0 },
      floorDescentsInWindow: 0,

      onFloorDescend: (playerLevel) => {
        set((state) => {
          let events = [...state.activeEvents];
          let descents = state.floorDescentsInWindow + 1;
          let sales = { ...state.recentSales };

          // Tick and expire events
          events = events
            .filter((event) => {
              if (event.durationType === 'ephemeral') {
                // Random expiration: 20-35% chance per descent
                const chance = 0.20 + Math.random() * 0.15;
                return Math.random() > chance; // Survive = keep
              }
              return event.ticksRemaining > 1; // Will decrement below
            })
            .map((event) => ({
              ...event,
              ticksRemaining: event.durationType === 'ephemeral'
                ? -1
                : event.ticksRemaining - 1,
            }));

          // Reset supply window
          if (descents >= SUPPLY_WINDOW) {
            descents = 0;
            sales = { metal: 0, monster: 0, gem: 0, essence: 0 };
          }

          // Maybe spawn a new event (only if fewer than 2 active)
          if (events.length < 2 && Math.random() < NEW_EVENT_CHANCE) {
            const newEvent = selectRandomEvent(playerLevel);
            if (newEvent) events.push(newEvent);
          }

          return { activeEvents: events, floorDescentsInWindow: descents, recentSales: sales };
        });
      },

      recordSale: (category, quantity) => {
        set((state) => ({
          recentSales: {
            ...state.recentSales,
            [category]: state.recentSales[category] + quantity,
          },
        }));
      },

      getMultiplier: (materialId) => {
        const mat = getMaterialById(materialId);
        if (!mat) return 1.0;

        const { activeEvents, recentSales } = get();
        let multiplier = 1.0;

        // Stack all active event effects
        for (const event of activeEvents) {
          for (const effect of event.effects) {
            if (effect.category === 'all' || effect.category === (mat.category as MaterialCategory)) {
              multiplier *= effect.multiplier;
            }
          }
        }

        // Supply pressure from player's own selling history
        if (recentSales[mat.category as MaterialCategory] > SUPPLY_THRESHOLD) {
          multiplier *= 0.75;
        }

        return Math.max(0.25, Math.round(multiplier * 100) / 100);
      },

      getActiveEvents: () => get().activeEvents,

      getSupplyPressures: () => {
        const { recentSales } = get();
        return ALL_CATEGORIES
          .filter(cat => recentSales[cat] > SUPPLY_THRESHOLD)
          .map(cat => ({
            category: cat,
            multiplier: 0.75,
            reason: `Your recent ${cat} sales have suppressed prices in this category.`,
          }));
      },

      reset: () => {
        set({
          activeEvents: [],
          recentSales: { metal: 0, monster: 0, gem: 0, essence: 0 },
          floorDescentsInWindow: 0,
        });
      },
    }),
    {
      name: 'kohrvellia-market',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
