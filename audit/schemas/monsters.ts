/* Layer C — zod schema for the monster data.
 * VALUE: catches what `tsc` cannot — enum membership on the stringly-typed `category` field
 * (KV-AUD-166), value-range / invariant violations, and weakness/resistance/immunity contradictions.
 * Canonical union members are transcribed from source (cited); a ts-morph consistency check
 * (Layer A) will later assert these still match the source unions, so they can't silently drift. */

import { z } from 'zod';

// ── Canonical unions (source-cited) ──
export const DAMAGE_TYPES = ['slash','pierce','blunt','magic','holy','fire','ice','lightning','poison','dark'] as const;      // Weapon.ts:44-54
export const MONSTER_CATEGORIES = ['humanoid','undead','beast','elemental','aberration','demon','giant','dragon'] as const;   // Loot.ts:9-17
export const MONSTER_ARMOR_TYPES = ['flesh','leather','bone','armor','plate','scales','spirit','ethereal','magic_resistant'] as const; // Monster.ts:11-20
export const BEHAVIOR_PATTERNS = ['aggressive','defensive','cowardly','berserker','summoner','caster','support','ambusher','regenerator'] as const; // Monster.ts:23-32
export const STATUS_EFFECT_IDS = ['poison','bleed','burn','freeze','stun','fear','curse','blind','silence','paralysis'] as const; // Character.ts:111-121
export const PREFIX_TIERS = ['negative','low','mid','high','legendary'] as const;  // Monster.ts:35
export const SUFFIX_TIERS = ['low','mid','high','legendary'] as const;             // Monster.ts:38

const damageType = z.enum(DAMAGE_TYPES);

export const baseMonsterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  baseCR: z.number().positive(),
  baseHP: z.number().positive(),
  baseAttack: z.number().nonnegative(),
  baseDefense: z.number().nonnegative(),
  baseMagicDefense: z.number().nonnegative(),
  baseSpeed: z.number().nonnegative(),
  baseAccuracy: z.number().min(0).max(100),
  baseInitiative: z.number().nonnegative().optional(),
  damageTypes: z.array(damageType).min(1),
  armorType: z.enum(MONSTER_ARMOR_TYPES),
  weaknesses: z.array(damageType),
  resistances: z.array(damageType),
  immunities: z.array(damageType),
  behaviorPattern: z.enum(BEHAVIOR_PATTERNS),
  canFlee: z.boolean(),
  fleeThreshold: z.number().min(0).max(1),
  goldDrop: z.object({ min: z.number().nonnegative(), max: z.number().nonnegative() }),
  xpValue: z.number(),
  lootTable: z.string().min(1),
  description: z.string().min(1),
  // Source types this `string` (KV-AUD-166); we enforce the MonsterCategory union to catch typos/drift.
  category: z.enum(MONSTER_CATEGORIES),
  biomes: z.array(z.string()),
  minFloor: z.number().int().min(1),
  maxFloor: z.number().int().optional(),
})
  .refine(m => m.goldDrop.min <= m.goldDrop.max, { message: 'goldDrop.min > goldDrop.max' })
  .refine(m => m.maxFloor == null || m.maxFloor >= m.minFloor, { message: 'maxFloor < minFloor' })
  // Hard contradiction: same damage type listed as BOTH a weakness and a resistance/immunity.
  .refine(m => !m.weaknesses.some(w => m.resistances.includes(w) || m.immunities.includes(w)),
    { message: 'CONTRADICTION: a damage type is both a weakness and a resistance/immunity' });

export const monsterPrefixSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tier: z.enum(PREFIX_TIERS),
  crModifier: z.number(),                 // may be negative (e.g. 'weak')
  statModifiers: z.object({
    hp: z.number().positive().optional(),
    attack: z.number().positive().optional(),
    defense: z.number().positive().optional(),
    speed: z.number().positive().optional(),
    accuracy: z.number().positive().optional(),
  }),
  specialAbility: z.string().optional(),
  minFloor: z.number().int().min(1),
});

export const monsterSuffixSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tier: z.enum(SUFFIX_TIERS),
  crModifier: z.number(),
  damageType: damageType.optional(),
  bonusDamage: z.number().nonnegative().optional(),
  statusChance: z.number().min(0).max(100).optional(),
  statusEffect: z.enum(STATUS_EFFECT_IDS).optional(),
  passiveAbility: z.string().optional(),
  minFloor: z.number().int().min(1),
});
