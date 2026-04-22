/**
 * Ramification Definitions
 * Per-step consequences that create tension during dungeon exploration
 * Inspired by Buried Bornes' per-turn events
 */

import type { Ramification, RamificationType } from '../types/Dungeon';

// ===== RESOURCE DRAIN RAMIFICATIONS =====

export const DRAIN_RAMIFICATIONS: Ramification[] = [
  {
    id: 'creeping_hunger',
    name: 'Creeping Hunger',
    description: 'Your stomach growls. The dungeon air drains your energy.',
    type: 'drain',
    effect: { type: 'ration', value: -1 },
    minFloor: 1,
    weight: 25,
    isBlessing: false,
  },
  {
    id: 'torch_flickers',
    name: 'Torch Flickers',
    description: 'The darkness seems to consume the light faster here.',
    type: 'drain',
    effect: { type: 'gold', value: -5 },  // Represents torch consumption cost
    minFloor: 1,
    weight: 20,
    isBlessing: false,
  },
  {
    id: 'weapon_chip',
    name: 'Weapon Chip',
    description: 'Your weapon scrapes against stone, dulling the edge.',
    type: 'drain',
    effect: { type: 'buff', value: -5, statusId: 'weapon_damage_down' },
    minFloor: 3,
    weight: 15,
    isBlessing: false,
  },
  {
    id: 'armor_wear',
    name: 'Armor Wear',
    description: 'The constant movement strains your armor\'s straps.',
    type: 'drain',
    effect: { type: 'buff', value: -3, statusId: 'armor_down' },
    minFloor: 5,
    weight: 12,
    isBlessing: false,
  },
  {
    id: 'coin_purse_tear',
    name: 'Coin Purse Tear',
    description: 'A hole in your purse! Some gold slips away unnoticed.',
    type: 'drain',
    effect: { type: 'gold', value: -15 },
    minFloor: 2,
    weight: 18,
    isBlessing: false,
  },
  {
    id: 'supply_rot',
    name: 'Supply Rot',
    description: 'The damp air has spoiled some of your supplies.',
    type: 'drain',
    effect: { type: 'ration', value: -1 },
    minFloor: 6,
    weight: 10,
    isBlessing: false,
  },
];

// ===== DAMAGE RAMIFICATIONS =====

export const DAMAGE_RAMIFICATIONS: Ramification[] = [
  {
    id: 'dungeon_miasma',
    name: 'Dungeon Miasma',
    description: 'Poisonous vapors seep from cracks in the walls.',
    type: 'damage',
    effect: { type: 'hp', value: -8 },
    minFloor: 1,
    weight: 20,
    isBlessing: false,
  },
  {
    id: 'mind_fog',
    name: 'Mind Fog',
    description: 'An oppressive haze clouds your thoughts.',
    type: 'damage',
    effect: { type: 'sp', value: -10 },
    minFloor: 1,
    weight: 18,
    isBlessing: false,
  },
  {
    id: 'spike_remnants',
    name: 'Spike Remnants',
    description: 'Hidden spikes from an old trap scrape your legs.',
    type: 'damage',
    effect: { type: 'hp', value: -12 },
    minFloor: 2,
    weight: 15,
    isBlessing: false,
  },
  {
    id: 'falling_debris',
    name: 'Falling Debris',
    description: 'Loose rocks tumble from above, striking you.',
    type: 'damage',
    effect: { type: 'hp', value: -15 },
    minFloor: 4,
    weight: 12,
    isBlessing: false,
  },
  {
    id: 'soul_drain',
    name: 'Soul Drain',
    description: 'Something in the darkness reaches for your spirit.',
    type: 'damage',
    effect: { type: 'sp', value: -15 },
    minFloor: 6,
    weight: 10,
    isBlessing: false,
  },
  {
    id: 'cursed_ground',
    name: 'Cursed Ground',
    description: 'The very floor pulses with malevolent energy.',
    type: 'damage',
    effect: { type: 'hp', value: -20 },
    minFloor: 8,
    weight: 8,
    isBlessing: false,
  },
  {
    id: 'psychic_scream',
    name: 'Psychic Scream',
    description: 'A soundless wail tears through your mind.',
    type: 'damage',
    effect: { type: 'sp', value: -20 },
    minFloor: 10,
    weight: 6,
    isBlessing: false,
  },
  {
    id: 'lava_vent',
    name: 'Lava Vent',
    description: 'A sudden gout of molten rock bursts nearby!',
    type: 'damage',
    effect: { type: 'hp', value: -25 },
    minFloor: 12,
    weight: 5,
    isBlessing: false,
  },
];

// ===== STATUS EFFECT RAMIFICATIONS =====

export const STATUS_RAMIFICATIONS: Ramification[] = [
  {
    id: 'creeping_dread',
    name: 'Creeping Dread',
    description: 'Fear seeps into your bones, shaking your aim.',
    type: 'status',
    effect: { type: 'status', statusId: 'accuracy_down', duration: 3 },
    minFloor: 1,
    weight: 15,
    isBlessing: false,
  },
  {
    id: 'exhaustion',
    name: 'Exhaustion',
    description: 'Weariness slows your movements and weakens your strikes.',
    type: 'status',
    effect: { type: 'status', statusId: 'damage_down', duration: 3 },
    minFloor: 2,
    weight: 14,
    isBlessing: false,
  },
  {
    id: 'poison_spores',
    name: 'Poison Spores',
    description: 'You breathe in glowing spores from fungal growths.',
    type: 'status',
    effect: { type: 'status', statusId: 'poison', duration: 5 },
    minFloor: 3,
    weight: 12,
    isBlessing: false,
  },
  {
    id: 'chilling_presence',
    name: 'Chilling Presence',
    description: 'An unnatural cold slows your reflexes.',
    type: 'status',
    effect: { type: 'status', statusId: 'slow', duration: 2 },
    minFloor: 4,
    weight: 10,
    isBlessing: false,
  },
  {
    id: 'bleeding_wound',
    name: 'Bleeding Wound',
    description: 'An old wound reopens, blood seeping through bandages.',
    type: 'status',
    effect: { type: 'status', statusId: 'bleed', duration: 4 },
    minFloor: 5,
    weight: 9,
    isBlessing: false,
  },
  {
    id: 'curse_mark',
    name: 'Curse Mark',
    description: 'A dark sigil appears on your skin, pulsing with pain.',
    type: 'status',
    effect: { type: 'status', statusId: 'curse', duration: 6 },
    minFloor: 8,
    weight: 6,
    isBlessing: false,
  },
  {
    id: 'haunted_vision',
    name: 'Haunted Vision',
    description: 'Spectral images blur your sight.',
    type: 'status',
    effect: { type: 'status', statusId: 'blind', duration: 2 },
    minFloor: 7,
    weight: 7,
    isBlessing: false,
  },
  {
    id: 'paralytic_touch',
    name: 'Paralytic Touch',
    description: 'Something brushed against you. Your muscles seize.',
    type: 'status',
    effect: { type: 'status', statusId: 'paralysis', duration: 1 },
    minFloor: 10,
    weight: 4,
    isBlessing: false,
  },
];

// ===== BLESSING RAMIFICATIONS (POSITIVE) =====

export const BLESSING_RAMIFICATIONS: Ramification[] = [
  {
    id: 'second_wind',
    name: 'Second Wind',
    description: 'A surge of energy flows through you!',
    type: 'blessing',
    effect: { type: 'sp', value: 15 },
    minFloor: 1,
    weight: 8,
    isBlessing: true,
  },
  {
    id: 'lucky_find',
    name: 'Lucky Find',
    description: 'You spot something glittering in the rubble.',
    type: 'blessing',
    effect: { type: 'gold', value: 30 },
    minFloor: 1,
    weight: 10,
    isBlessing: true,
  },
  {
    id: 'divine_protection',
    name: 'Divine Protection',
    description: 'Your deity\'s warmth shields you briefly.',
    type: 'blessing',
    effect: { type: 'buff', value: 1, statusId: 'protected' },
    minFloor: 3,
    weight: 5,
    isBlessing: true,
  },
  {
    id: 'adrenaline_surge',
    name: 'Adrenaline Surge',
    description: 'Danger sharpens your senses!',
    type: 'blessing',
    effect: { type: 'buff', value: 10, statusId: 'damage_up', duration: 2 },
    minFloor: 2,
    weight: 7,
    isBlessing: true,
  },
  {
    id: 'refreshing_spring',
    name: 'Refreshing Spring',
    description: 'You discover a clean water source.',
    type: 'blessing',
    effect: { type: 'hp', value: 20 },
    minFloor: 1,
    weight: 8,
    isBlessing: true,
  },
  {
    id: 'abandoned_supplies',
    name: 'Abandoned Supplies',
    description: 'A fallen adventurer\'s supplies, still usable.',
    type: 'blessing',
    effect: { type: 'ration', value: 1 },
    minFloor: 2,
    weight: 6,
    isBlessing: true,
  },
  {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'You feel inexplicably fortunate.',
    type: 'blessing',
    effect: { type: 'buff', value: 15, statusId: 'luck_up', duration: 5 },
    minFloor: 4,
    weight: 4,
    isBlessing: true,
  },
  {
    id: 'warriors_spirit',
    name: "Warrior's Spirit",
    description: 'The ghost of a fallen hero grants you strength.',
    type: 'blessing',
    effect: { type: 'buff', value: 20, statusId: 'strength_up', duration: 3 },
    minFloor: 6,
    weight: 3,
    isBlessing: true,
  },
  {
    id: 'treasure_cache',
    name: 'Treasure Cache',
    description: 'A hidden stash of valuables!',
    type: 'blessing',
    effect: { type: 'gold', value: 75 },
    minFloor: 5,
    weight: 3,
    isBlessing: true,
  },
  {
    id: 'full_restoration',
    name: 'Full Restoration',
    description: 'A divine light washes over you, healing all wounds.',
    type: 'blessing',
    effect: { type: 'hp', value: 50 },
    minFloor: 8,
    weight: 2,
    isBlessing: true,
  },
];

// ===== EVENT RAMIFICATIONS =====

export const EVENT_RAMIFICATIONS: Ramification[] = [
  {
    id: 'wandering_merchant',
    name: 'Wandering Merchant',
    description: 'A cloaked figure emerges from the shadows, wares in hand.',
    type: 'event',
    effect: { type: 'item', statusId: 'trigger_shop' },
    minFloor: 2,
    weight: 5,
    isBlessing: true,
  },
  {
    id: 'fellow_adventurer',
    name: 'Fellow Adventurer',
    description: 'Another soul braves these depths.',
    type: 'event',
    effect: { type: 'item', statusId: 'trigger_encounter' },
    minFloor: 3,
    weight: 4,
    isBlessing: true,
  },
  {
    id: 'strange_altar',
    name: 'Strange Altar',
    description: 'An ancient shrine glows with otherworldly light.',
    type: 'event',
    effect: { type: 'item', statusId: 'trigger_shrine' },
    minFloor: 4,
    weight: 4,
    isBlessing: true,
  },
  {
    id: 'trapped_spirit',
    name: 'Trapped Spirit',
    description: 'A ghost pleads for your help.',
    type: 'event',
    effect: { type: 'item', statusId: 'trigger_spirit' },
    minFloor: 5,
    weight: 3,
    isBlessing: true,
  },
  {
    id: 'ambush',
    name: 'Ambush!',
    description: 'Enemies leap from the shadows!',
    type: 'event',
    effect: { type: 'combat' },
    minFloor: 3,
    weight: 6,
    isBlessing: false,
  },
  {
    id: 'collapsing_passage',
    name: 'Collapsing Passage',
    description: 'The tunnel begins to crumble!',
    type: 'event',
    effect: { type: 'item', statusId: 'trigger_escape' },
    minFloor: 6,
    weight: 3,
    isBlessing: false,
  },
];

// ===== NOTHING (SAFE PASSAGE) =====

export const NOTHING_RAMIFICATIONS: Ramification[] = [
  {
    id: 'safe_passage',
    name: 'Safe Passage',
    description: 'The way ahead is clear.',
    type: 'nothing',
    effect: { type: 'hp', value: 0 },
    minFloor: 1,
    weight: 15,
    isBlessing: false,
  },
  {
    id: 'quiet_steps',
    name: 'Quiet Steps',
    description: 'Your footsteps echo softly in the silence.',
    type: 'nothing',
    effect: { type: 'hp', value: 0 },
    minFloor: 1,
    weight: 10,
    isBlessing: false,
  },
  {
    id: 'momentary_peace',
    name: 'Momentary Peace',
    description: 'For a brief moment, the dungeon feels almost... peaceful.',
    type: 'nothing',
    effect: { type: 'hp', value: 0 },
    minFloor: 1,
    weight: 8,
    isBlessing: false,
  },
];

// ===== COMBINED RAMIFICATION POOL =====

export const ALL_RAMIFICATIONS: Ramification[] = [
  ...DRAIN_RAMIFICATIONS,
  ...DAMAGE_RAMIFICATIONS,
  ...STATUS_RAMIFICATIONS,
  ...BLESSING_RAMIFICATIONS,
  ...EVENT_RAMIFICATIONS,
  ...NOTHING_RAMIFICATIONS,
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get ramifications available for a given floor
 */
export function getRamificationsForFloor(floorNumber: number): Ramification[] {
  return ALL_RAMIFICATIONS.filter(r => {
    if (r.minFloor > floorNumber) return false;
    if (r.maxFloor !== undefined && r.maxFloor < floorNumber) return false;
    return true;
  });
}

/**
 * Select a weighted random ramification
 */
export function selectWeightedRamification(
  pool: Ramification[],
  excludeBlessings: boolean = false
): Ramification | null {
  const filtered = excludeBlessings
    ? pool.filter(r => !r.isBlessing)
    : pool;

  if (filtered.length === 0) return null;

  const totalWeight = filtered.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const ramification of filtered) {
    roll -= ramification.weight;
    if (roll <= 0) {
      return ramification;
    }
  }

  return filtered[filtered.length - 1];
}

/**
 * Roll ramifications for a step
 * Returns array of ramifications that triggered
 */
export function rollStepRamifications(
  floorNumber: number,
  baseChance: number
): Ramification[] {
  const results: Ramification[] = [];
  const pool = getRamificationsForFloor(floorNumber);

  // Number of potential ramification rolls (1-3)
  const maxRolls = 1 + Math.floor(Math.random() * 2);

  for (let i = 0; i < maxRolls; i++) {
    // Check if this roll triggers
    if (Math.random() < baseChance) {
      const ramification = selectWeightedRamification(pool);
      if (ramification) {
        // Avoid duplicate ramifications in same step
        if (!results.some(r => r.id === ramification.id)) {
          results.push(ramification);
        }
      }
    }
  }

  return results;
}

/**
 * Get ramification type icon
 */
export function getRamificationIcon(type: RamificationType): string {
  const icons: Record<RamificationType, string> = {
    drain: '!',
    damage: '!!',
    status: '~',
    blessing: '+',
    event: '?',
    nothing: '-',
  };
  return icons[type] ?? '?';
}

/**
 * Get ramification severity color hint
 */
export function getRamificationSeverity(
  ramification: Ramification
): 'safe' | 'warning' | 'danger' | 'blessing' {
  if (ramification.isBlessing) return 'blessing';
  if (ramification.type === 'nothing') return 'safe';
  if (ramification.type === 'event') return 'warning';

  // Check effect magnitude
  const value = ramification.effect.value ?? 0;
  if (value <= -20) return 'danger';
  if (value < 0) return 'warning';

  return 'safe';
}

/**
 * Format ramification effect for display
 */
export function formatRamificationEffect(ramification: Ramification): string {
  const { effect } = ramification;

  switch (effect.type) {
    case 'hp':
      return effect.value! > 0 ? `+${effect.value} HP` : `${effect.value} HP`;
    case 'sp':
      return effect.value! > 0 ? `+${effect.value} SP` : `${effect.value} SP`;
    case 'gold':
      return effect.value! > 0 ? `+${effect.value} Gold` : `${effect.value} Gold`;
    case 'ration':
      return effect.value! > 0 ? `+${effect.value} Ration` : `${effect.value} Ration`;
    case 'status':
      return `${effect.statusId} (${effect.duration} turns)`;
    case 'buff':
      const sign = effect.value! > 0 ? '+' : '';
      return `${sign}${effect.value}% ${effect.statusId?.replace(/_/g, ' ')}`;
    case 'item':
      return 'Special Event';
    case 'combat':
      return 'Combat Encounter!';
    default:
      return 'No effect';
  }
}
