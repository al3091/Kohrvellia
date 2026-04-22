import type { BaseWeapon } from '../../types/Weapon';

export const PER_WEAPONS: BaseWeapon[] = [
  // ── LEVEL 1 ──
  { id: 'per_l1_shortbow', name: 'Shortbow', category: 'PER', damageTypes: ['pierce'], baseDamage: 8, baseAccuracy: 80, baseCritChance: 10, attackSpeed: 1.2, range: 'ranged', twoHanded: true, requirements: [], minLevel: 1 },
  { id: 'per_l1_throwing_knives', name: 'Throwing Knives', category: 'PER', damageTypes: ['pierce'], baseDamage: 5, baseAccuracy: 88, baseCritChance: 12, attackSpeed: 1.5, range: 'ranged', twoHanded: false, requirements: [], minLevel: 1 },

  // ── LEVEL 2 ──
  { id: 'per_l2_longbow', name: 'Longbow', category: 'PER', damageTypes: ['pierce'], baseDamage: 12, baseAccuracy: 75, baseCritChance: 15, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 2 },
  { id: 'per_l2_sling', name: 'Sling', category: 'PER', damageTypes: ['blunt'], baseDamage: 6, baseAccuracy: 84, baseCritChance: 8, attackSpeed: 1.4, range: 'ranged', twoHanded: false, requirements: [], minLevel: 2, specialMechanic: '15% chance to Stun on hit' },

  // ── LEVEL 3 ──
  { id: 'per_l3_crossbow', name: 'Crossbow', category: 'PER', damageTypes: ['pierce'], baseDamage: 14, baseAccuracy: 85, baseCritChance: 8, attackSpeed: 0.6, range: 'ranged', twoHanded: true, requirements: [], minLevel: 3 },
  { id: 'per_l3_javelin', name: 'Javelin', category: 'PER', damageTypes: ['pierce'], baseDamage: 11, baseAccuracy: 78, baseCritChance: 14, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 3 },

  // ── LEVEL 4 ──
  { id: 'per_l4_composite_bow', name: 'Composite Bow', category: 'PER', damageTypes: ['pierce'], baseDamage: 15, baseAccuracy: 80, baseCritChance: 18, attackSpeed: 1.0, range: 'ranged', twoHanded: true, requirements: [], minLevel: 4 },
  { id: 'per_l4_blowgun', name: 'Blowgun', category: 'PER', damageTypes: ['pierce', 'poison'], baseDamage: 4, baseAccuracy: 95, baseCritChance: 10, attackSpeed: 1.6, range: 'ranged', twoHanded: false, requirements: [], minLevel: 4, specialMechanic: 'Guaranteed Poison. Ignores all accuracy penalties.' },

  // ── LEVEL 5 ──
  { id: 'per_l5_hunting_bow', name: 'Hunting Bow', category: 'PER', damageTypes: ['pierce'], baseDamage: 17, baseAccuracy: 82, baseCritChance: 20, attackSpeed: 0.95, range: 'ranged', twoHanded: true, requirements: [], minLevel: 5, specialMechanic: 'Deals +30% damage when full HP' },
  { id: 'per_l5_heavy_crossbow', name: 'Heavy Crossbow', category: 'PER', damageTypes: ['pierce'], baseDamage: 20, baseAccuracy: 78, baseCritChance: 10, attackSpeed: 0.5, range: 'ranged', twoHanded: true, requirements: [], minLevel: 5, specialMechanic: 'Pierces armor — always deals minimum 50% of damage' },

  // ── LEVEL 6 ──
  { id: 'per_l6_war_bow', name: 'War Bow', category: 'PER', damageTypes: ['pierce'], baseDamage: 22, baseAccuracy: 76, baseCritChance: 22, attackSpeed: 0.85, range: 'ranged', twoHanded: true, requirements: [], minLevel: 6 },
  { id: 'per_l6_repeating_crossbow', name: 'Repeating Crossbow', category: 'PER', damageTypes: ['pierce'], baseDamage: 12, baseAccuracy: 82, baseCritChance: 14, attackSpeed: 1.4, range: 'ranged', twoHanded: true, requirements: [], minLevel: 6, specialMechanic: 'Fires twice per action at -20% damage each' },

  // ── LEVEL 7 ──
  { id: 'per_l7_elven_bow', name: 'Elven Recurve', category: 'PER', damageTypes: ['pierce', 'magic'], baseDamage: 20, baseAccuracy: 88, baseCritChance: 24, attackSpeed: 1.1, range: 'ranged', twoHanded: true, requirements: [], minLevel: 7 },
  { id: 'per_l7_ballista_bolt', name: 'Ballista Bolt', category: 'PER', damageTypes: ['pierce'], baseDamage: 30, baseAccuracy: 65, baseCritChance: 12, attackSpeed: 0.45, range: 'ranged', twoHanded: true, requirements: [], minLevel: 7, specialMechanic: 'Guaranteed critical hit if target is standing still (enemy is stunned/slowed)' },

  // ── LEVEL 8 ──
  { id: 'per_l8_siege_bow', name: 'Siege Bow', category: 'PER', damageTypes: ['pierce'], baseDamage: 28, baseAccuracy: 72, baseCritChance: 20, attackSpeed: 0.8, range: 'ranged', twoHanded: true, requirements: [], minLevel: 8 },
  { id: 'per_l8_storm_thrower', name: 'Storm Thrower', category: 'PER', damageTypes: ['pierce', 'lightning'], baseDamage: 20, baseAccuracy: 84, baseCritChance: 22, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 8, specialMechanic: '+5 lightning damage per consecutive hit on same enemy (resets on miss)' },

  // ── LEVEL 9 — UNIQUE ★ ──
  { id: 'per_l9_eagles_eye', name: "Eagle's Eye", category: 'PER', damageTypes: ['pierce'], baseDamage: 35, baseAccuracy: 95, baseCritChance: 30, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'First shot each combat deals 300% damage. Accuracy never misses on a revealed target (observed enemy). Crit range doubled.' },

  // ── LEVEL 10 — UNIQUE ★ ──
  { id: 'per_l10_the_final_shot', name: 'The Final Shot', category: 'PER', damageTypes: ['pierce', 'dark'], baseDamage: 40, baseAccuracy: 90, baseCritChance: 35, attackSpeed: 1.0, range: 'ranged', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'Each miss charges this weapon (up to 3). On next hit, releases all charges as bonus hits simultaneously. A fully charged shot is unblockable.' },
];
