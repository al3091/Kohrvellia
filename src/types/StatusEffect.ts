/**
 * Status Effect Types
 * Defines combat status effects that can affect players and monsters
 */

// Global maximum stack limit for any status effect (safety fallback)
export const MAX_STATUS_STACKS = 10;

export type StatusEffectType =
  | 'poison'    // Damage over time (% of max HP)
  | 'burn'      // Damage over time (flat damage, reduces healing)
  | 'freeze'    // Reduces speed/accuracy, chance to skip turn
  | 'stun'      // Skip next turn (one-time)
  | 'blind'     // Greatly reduces accuracy
  | 'bleed'     // Damage over time (stacks)
  | 'weaken'    // Reduces attack damage
  | 'slow'      // Reduces speed/evasion
  | 'curse'     // Reduces all stats slightly, blocks healing
  | 'regen';    // Heal over time

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  name: string;
  description: string;

  // Duration
  duration: number;        // Turns remaining (-1 = until cured)
  maxDuration: number;     // Original duration

  // Effect values
  damagePerTurn?: number;  // Flat damage per turn
  percentDamage?: number;  // % of max HP damage per turn
  statModifier?: {         // Stat modifications
    stat: string;
    value: number;         // Negative = reduction
    isPercent: boolean;    // true = percentage, false = flat
  };

  // Special flags
  preventsHealing?: boolean;
  reducesHealing?: number; // % reduction (0-100)
  skipTurnChance?: number; // % chance to skip turn (0-100)
  accuracyModifier?: number; // +/- to accuracy

  // Stacking
  stacks?: number;
  maxStacks?: number;

  // Source tracking
  sourceId?: string;       // Who applied this effect
  appliedAt: number;       // Timestamp
}

// Status effect definitions with default values
export const STATUS_EFFECT_DEFINITIONS: Record<StatusEffectType, Omit<StatusEffect, 'id' | 'appliedAt' | 'sourceId'>> = {
  poison: {
    type: 'poison',
    name: 'Poison',
    description: 'Taking damage each turn from venom coursing through your veins.',
    duration: 3,
    maxDuration: 3,
    percentDamage: 5, // 5% max HP per turn
  },

  burn: {
    type: 'burn',
    name: 'Burn',
    description: 'Flames sear your flesh, dealing damage and reducing healing.',
    duration: 3,
    maxDuration: 3,
    damagePerTurn: 5,
    reducesHealing: 50, // 50% less healing
  },

  freeze: {
    type: 'freeze',
    name: 'Freeze',
    description: 'Ice encases your limbs, slowing your movements.',
    duration: 2,
    maxDuration: 2,
    accuracyModifier: -20,
    skipTurnChance: 25, // 25% chance to be frozen solid
    statModifier: {
      stat: 'AGI',
      value: -30,
      isPercent: true,
    },
  },

  stun: {
    type: 'stun',
    name: 'Stun',
    description: 'Dazed and unable to act.',
    duration: 1,
    maxDuration: 1,
    skipTurnChance: 100, // Always skip turn
  },

  blind: {
    type: 'blind',
    name: 'Blind',
    description: 'Your vision is obscured, making it hard to hit anything.',
    duration: 2,
    maxDuration: 2,
    accuracyModifier: -50,
  },

  bleed: {
    type: 'bleed',
    name: 'Bleed',
    description: 'Open wounds cause continuous blood loss.',
    duration: 4,
    maxDuration: 4,
    damagePerTurn: 3,
    stacks: 1,
    maxStacks: 5, // Can stack up to 5 times
  },

  weaken: {
    type: 'weaken',
    name: 'Weaken',
    description: 'Your strength fails you, reducing damage dealt.',
    duration: 3,
    maxDuration: 3,
    statModifier: {
      stat: 'STR',
      value: -25,
      isPercent: true,
    },
  },

  slow: {
    type: 'slow',
    name: 'Slow',
    description: 'Your movements are sluggish and delayed.',
    duration: 3,
    maxDuration: 3,
    statModifier: {
      stat: 'AGI',
      value: -40,
      isPercent: true,
    },
  },

  curse: {
    type: 'curse',
    name: 'Curse',
    description: 'Dark magic saps your vitality and blocks healing.',
    duration: 4,
    maxDuration: 4,
    preventsHealing: true,
    statModifier: {
      stat: 'ALL',
      value: -10,
      isPercent: true,
    },
  },

  regen: {
    type: 'regen',
    name: 'Regeneration',
    description: 'Your wounds heal rapidly over time.',
    duration: 3,
    maxDuration: 3,
    percentDamage: -3, // Negative = healing (3% max HP per turn)
  },
};

// Status effect colors for UI
export const STATUS_EFFECT_COLORS: Record<StatusEffectType, string> = {
  poison: '#9B59B6',   // Purple
  burn: '#E74C3C',     // Red-orange
  freeze: '#3498DB',   // Ice blue
  stun: '#F1C40F',     // Yellow
  blind: '#7F8C8D',    // Gray
  bleed: '#C0392B',    // Dark red
  weaken: '#8E44AD',   // Dark purple
  slow: '#1ABC9C',     // Teal
  curse: '#2C3E50',    // Dark blue-gray
  regen: '#27AE60',    // Green
};

// Status effect icons (emoji for now)
export const STATUS_EFFECT_ICONS: Record<StatusEffectType, string> = {
  poison: '🧪',
  burn: '🔥',
  freeze: '❄️',
  stun: '💫',
  blind: '👁️',
  bleed: '🩸',
  weaken: '💔',
  slow: '🐌',
  curse: '☠️',
  regen: '💚',
};

/**
 * Create a new status effect instance
 */
export function createStatusEffect(
  type: StatusEffectType,
  sourceId?: string,
  durationOverride?: number,
  stacksOverride?: number
): StatusEffect {
  const definition = STATUS_EFFECT_DEFINITIONS[type];

  return {
    ...definition,
    id: `effect_${type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    duration: durationOverride ?? definition.duration,
    stacks: stacksOverride ?? definition.stacks,
    sourceId,
    appliedAt: Date.now(),
  };
}

/**
 * Calculate damage from status effects
 */
export function calculateStatusDamage(
  effect: StatusEffect,
  maxHP: number
): number {
  let damage = 0;

  // Flat damage per turn
  if (effect.damagePerTurn) {
    damage += effect.damagePerTurn * (effect.stacks ?? 1);
  }

  // Percent of max HP
  if (effect.percentDamage) {
    damage += Math.floor((maxHP * effect.percentDamage) / 100);
  }

  return damage;
}

/**
 * Check if a status effect prevents/reduces healing
 */
export function getHealingModifier(effects: StatusEffect[]): number {
  let modifier = 1.0;

  for (const effect of effects) {
    if (effect.preventsHealing) {
      return 0; // No healing allowed
    }
    if (effect.reducesHealing) {
      modifier *= (100 - effect.reducesHealing) / 100;
    }
  }

  return modifier;
}

/**
 * Check if any effect causes turn skip
 */
export function shouldSkipTurn(effects: StatusEffect[]): { skip: boolean; reason?: string } {
  for (const effect of effects) {
    if (effect.skipTurnChance) {
      const roll = Math.random() * 100;
      if (roll < effect.skipTurnChance) {
        return { skip: true, reason: effect.name };
      }
    }
  }
  return { skip: false };
}

/**
 * Get total accuracy modifier from effects
 */
export function getAccuracyModifier(effects: StatusEffect[]): number {
  let modifier = 0;

  for (const effect of effects) {
    if (effect.accuracyModifier) {
      modifier += effect.accuracyModifier;
    }
  }

  return modifier;
}

/**
 * Tick all status effects (reduce duration, remove expired)
 */
export function tickStatusEffects(effects: StatusEffect[]): StatusEffect[] {
  return effects
    .map((effect) => ({
      ...effect,
      duration: effect.duration > 0 ? effect.duration - 1 : effect.duration,
    }))
    .filter((effect) => effect.duration !== 0); // Remove expired (duration 0), keep permanent (-1)
}

/**
 * Apply a status effect, handling stacking
 */
export function applyStatusEffect(
  currentEffects: StatusEffect[],
  newEffect: StatusEffect
): StatusEffect[] {
  const existingIndex = currentEffects.findIndex((e) => e.type === newEffect.type);

  if (existingIndex === -1) {
    // New effect, add it
    return [...currentEffects, newEffect];
  }

  const existing = currentEffects[existingIndex];

  // Check if stackable - use maxStacks if defined, otherwise use global limit
  const maxStacks = existing.maxStacks ?? MAX_STATUS_STACKS;
  const currentStacks = existing.stacks ?? 1;

  if (existing.stacks !== undefined && currentStacks < maxStacks) {
    // Increase stacks and refresh duration
    const updated = {
      ...existing,
      stacks: currentStacks + 1,
      duration: Math.max(existing.duration, newEffect.duration),
    };
    return [
      ...currentEffects.slice(0, existingIndex),
      updated,
      ...currentEffects.slice(existingIndex + 1),
    ];
  }

  // Not stackable or at max stacks, refresh duration if new is longer
  if (newEffect.duration > existing.duration) {
    const updated = { ...existing, duration: newEffect.duration };
    return [
      ...currentEffects.slice(0, existingIndex),
      updated,
      ...currentEffects.slice(existingIndex + 1),
    ];
  }

  // Keep existing
  return currentEffects;
}

/**
 * Remove a specific status effect
 */
export function removeStatusEffect(
  effects: StatusEffect[],
  effectId: string
): StatusEffect[] {
  return effects.filter((e) => e.id !== effectId);
}

/**
 * Remove all effects of a type
 */
export function removeStatusEffectByType(
  effects: StatusEffect[],
  type: StatusEffectType
): StatusEffect[] {
  return effects.filter((e) => e.type !== type);
}

/**
 * Check if entity has a specific effect type
 */
export function hasStatusEffect(
  effects: StatusEffect[],
  type: StatusEffectType
): boolean {
  return effects.some((e) => e.type === type);
}
