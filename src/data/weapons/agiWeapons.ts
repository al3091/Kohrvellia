import type { BaseWeapon } from '../../types/Weapon';

export const AGI_WEAPONS: BaseWeapon[] = [
  // ── LEVEL 1 ──
  { id: 'agi_l1_dagger', name: 'Dagger', category: 'AGI', damageTypes: ['pierce'], baseDamage: 6, baseAccuracy: 90, baseCritChance: 15, attackSpeed: 1.5, range: 'melee', twoHanded: false, requirements: [], minLevel: 1 },
  { id: 'agi_l1_shortsword', name: 'Shortsword', category: 'AGI', damageTypes: ['slash'], baseDamage: 8, baseAccuracy: 85, baseCritChance: 10, attackSpeed: 1.3, range: 'melee', twoHanded: false, requirements: [], minLevel: 1 },

  // ── LEVEL 2 ──
  { id: 'agi_l2_rapier', name: 'Rapier', category: 'AGI', damageTypes: ['pierce'], baseDamage: 9, baseAccuracy: 85, baseCritChance: 12, attackSpeed: 1.3, range: 'melee', twoHanded: false, requirements: [], minLevel: 2 },
  { id: 'agi_l2_stiletto', name: 'Stiletto', category: 'AGI', damageTypes: ['pierce'], baseDamage: 7, baseAccuracy: 92, baseCritChance: 20, attackSpeed: 1.6, range: 'melee', twoHanded: false, requirements: [], minLevel: 2, specialMechanic: 'Ignores leather armor entirely' },

  // ── LEVEL 3 ──
  { id: 'agi_l3_dual_blades', name: 'Dual Blades', category: 'AGI', damageTypes: ['slash'], baseDamage: 8, baseAccuracy: 80, baseCritChance: 14, attackSpeed: 1.4, range: 'melee', twoHanded: true, requirements: [], minLevel: 3 },
  { id: 'agi_l3_kukri', name: 'Kukri', category: 'AGI', damageTypes: ['slash', 'pierce'], baseDamage: 10, baseAccuracy: 82, baseCritChance: 16, attackSpeed: 1.2, range: 'melee', twoHanded: false, requirements: [], minLevel: 3, specialMechanic: '20% chance to apply Bleed on hit' },

  // ── LEVEL 4 ──
  { id: 'agi_l4_katana', name: 'Katana', category: 'AGI', damageTypes: ['slash'], baseDamage: 13, baseAccuracy: 82, baseCritChance: 18, attackSpeed: 1.1, range: 'melee', twoHanded: true, requirements: [], minLevel: 4 },
  { id: 'agi_l4_ninjato', name: 'Ninjato', category: 'AGI', damageTypes: ['pierce', 'slash'], baseDamage: 10, baseAccuracy: 88, baseCritChance: 22, attackSpeed: 1.4, range: 'melee', twoHanded: false, requirements: [], minLevel: 4, specialMechanic: 'First strike each combat is guaranteed crit' },

  // ── LEVEL 5 ──
  { id: 'agi_l5_shadow_blades', name: 'Shadow Blades', category: 'AGI', damageTypes: ['slash', 'dark'], baseDamage: 12, baseAccuracy: 84, baseCritChance: 20, attackSpeed: 1.35, range: 'melee', twoHanded: true, requirements: [], minLevel: 5 },
  { id: 'agi_l5_venomblade', name: 'Venomblade', category: 'AGI', damageTypes: ['pierce', 'poison'], baseDamage: 9, baseAccuracy: 88, baseCritChance: 18, attackSpeed: 1.45, range: 'melee', twoHanded: false, requirements: [], minLevel: 5, specialMechanic: 'Applies Poison on every hit (no chance roll)' },

  // ── LEVEL 6 ──
  { id: 'agi_l6_wind_sabers', name: 'Wind Sabers', category: 'AGI', damageTypes: ['slash'], baseDamage: 14, baseAccuracy: 86, baseCritChance: 22, attackSpeed: 1.5, range: 'melee', twoHanded: true, requirements: [], minLevel: 6 },
  { id: 'agi_l6_assassin_blades', name: "Assassin's Blades", category: 'AGI', damageTypes: ['pierce', 'dark'], baseDamage: 11, baseAccuracy: 90, baseCritChance: 28, attackSpeed: 1.6, range: 'melee', twoHanded: true, requirements: [], minLevel: 6, specialMechanic: 'Crits deal triple damage instead of double' },

  // ── LEVEL 7 ──
  { id: 'agi_l7_phantom_edge', name: 'Phantom Edge', category: 'AGI', damageTypes: ['slash', 'magic'], baseDamage: 16, baseAccuracy: 88, baseCritChance: 24, attackSpeed: 1.4, range: 'melee', twoHanded: false, requirements: [], minLevel: 7 },
  { id: 'agi_l7_razor_storm', name: 'Razor Storm', category: 'AGI', damageTypes: ['slash'], baseDamage: 13, baseAccuracy: 82, baseCritChance: 20, attackSpeed: 1.7, range: 'melee', twoHanded: true, requirements: [], minLevel: 7, specialMechanic: 'Hits all enemies in combat simultaneously' },

  // ── LEVEL 8 ──
  { id: 'agi_l8_masterwork_katana', name: 'Masterwork Katana', category: 'AGI', damageTypes: ['slash'], baseDamage: 20, baseAccuracy: 88, baseCritChance: 26, attackSpeed: 1.2, range: 'melee', twoHanded: true, requirements: [], minLevel: 8 },
  { id: 'agi_l8_void_daggers', name: 'Void Daggers', category: 'AGI', damageTypes: ['pierce', 'dark'], baseDamage: 14, baseAccuracy: 92, baseCritChance: 30, attackSpeed: 1.8, range: 'melee', twoHanded: true, requirements: [], minLevel: 8 },

  // ── LEVEL 9 — UNIQUE ★ ──
  { id: 'agi_l9_whisperwind', name: 'Whisperwind', category: 'AGI', damageTypes: ['slash', 'magic'], baseDamage: 18, baseAccuracy: 95, baseCritChance: 30, attackSpeed: 2.0, range: 'melee', twoHanded: false, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'Attacks twice per action. Second hit automatically crits if first hit crits.' },

  // ── LEVEL 10 — UNIQUE ★ ──
  { id: 'agi_l10_the_last_step', name: 'The Last Step', category: 'AGI', damageTypes: ['pierce', 'dark'], baseDamage: 22, baseAccuracy: 98, baseCritChance: 35, attackSpeed: 1.8, range: 'melee', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'If this attack would kill the enemy, deals exactly enough damage to leave them at 1 HP — then triggers a free bonus attack with +50% crit chance.' },
];
