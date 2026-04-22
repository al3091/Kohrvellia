import type { BaseWeapon } from '../../types/Weapon';

export const END_WEAPONS: BaseWeapon[] = [
  // ── LEVEL 1 ──
  { id: 'end_l1_tower_shield', name: 'Tower Shield', category: 'END', damageTypes: ['blunt'], baseDamage: 6, baseAccuracy: 85, baseCritChance: 5, attackSpeed: 0.8, range: 'melee', twoHanded: false, requirements: [], minLevel: 1 },
  { id: 'end_l1_flail', name: 'Flail', category: 'END', damageTypes: ['blunt'], baseDamage: 11, baseAccuracy: 70, baseCritChance: 10, attackSpeed: 0.85, range: 'melee', twoHanded: false, requirements: [], minLevel: 1 },

  // ── LEVEL 2 ──
  { id: 'end_l2_spiked_shield', name: 'Spiked Shield', category: 'END', damageTypes: ['blunt', 'pierce'], baseDamage: 9, baseAccuracy: 80, baseCritChance: 8, attackSpeed: 0.9, range: 'melee', twoHanded: false, requirements: [], minLevel: 2 },
  { id: 'end_l2_iron_gauntlet', name: 'Iron Gauntlet', category: 'END', damageTypes: ['blunt'], baseDamage: 8, baseAccuracy: 82, baseCritChance: 6, attackSpeed: 1.1, range: 'melee', twoHanded: false, requirements: [], minLevel: 2, specialMechanic: 'Counter-attacks automatically when blocking (25% chance)' },

  // ── LEVEL 3 ──
  { id: 'end_l3_halberd', name: 'Halberd', category: 'END', damageTypes: ['slash', 'pierce'], baseDamage: 14, baseAccuracy: 72, baseCritChance: 8, attackSpeed: 0.7, range: 'melee', twoHanded: true, requirements: [], minLevel: 3 },
  { id: 'end_l3_fortress_shield', name: 'Fortress Shield', category: 'END', damageTypes: ['blunt'], baseDamage: 8, baseAccuracy: 84, baseCritChance: 5, attackSpeed: 0.75, range: 'melee', twoHanded: false, requirements: [], minLevel: 3, specialMechanic: 'Reduces all incoming damage by 15% when wielded' },

  // ── LEVEL 4 ──
  { id: 'end_l4_warspear', name: 'Warspear', category: 'END', damageTypes: ['pierce', 'slash'], baseDamage: 15, baseAccuracy: 76, baseCritChance: 10, attackSpeed: 0.85, range: 'melee', twoHanded: true, requirements: [], minLevel: 4 },
  { id: 'end_l4_retaliation_gauntlet', name: 'Retaliation Gauntlet', category: 'END', damageTypes: ['blunt'], baseDamage: 10, baseAccuracy: 80, baseCritChance: 8, attackSpeed: 1.0, range: 'melee', twoHanded: false, requirements: [], minLevel: 4, specialMechanic: 'Deals bonus damage equal to 50% of the last hit received this combat' },

  // ── LEVEL 5 ──
  { id: 'end_l5_dragon_shield', name: 'Dragon Shield', category: 'END', damageTypes: ['blunt', 'fire'], baseDamage: 11, baseAccuracy: 82, baseCritChance: 6, attackSpeed: 0.8, range: 'melee', twoHanded: false, requirements: [], minLevel: 5 },
  { id: 'end_l5_guardian_lance', name: 'Guardian Lance', category: 'END', damageTypes: ['pierce'], baseDamage: 18, baseAccuracy: 74, baseCritChance: 10, attackSpeed: 0.75, range: 'melee', twoHanded: true, requirements: [], minLevel: 5, specialMechanic: 'First attack each combat deals double damage' },

  // ── LEVEL 6 ──
  { id: 'end_l6_rampant_flail', name: 'Rampant Flail', category: 'END', damageTypes: ['blunt', 'slash'], baseDamage: 18, baseAccuracy: 68, baseCritChance: 12, attackSpeed: 0.8, range: 'melee', twoHanded: true, requirements: [], minLevel: 6 },
  { id: 'end_l6_aegis', name: 'Aegis', category: 'END', damageTypes: ['blunt'], baseDamage: 10, baseAccuracy: 86, baseCritChance: 6, attackSpeed: 0.7, range: 'melee', twoHanded: false, requirements: [], minLevel: 6, specialMechanic: 'Immunity to Stun and Fear while wielded. Counter-attack chance raised to 40%.' },

  // ── LEVEL 7 ──
  { id: 'end_l7_colossus_hammer', name: 'Colossus Hammer', category: 'END', damageTypes: ['blunt'], baseDamage: 26, baseAccuracy: 58, baseCritChance: 10, attackSpeed: 0.55, range: 'melee', twoHanded: true, requirements: [], minLevel: 7 },
  { id: 'end_l7_bulwark', name: 'Bulwark', category: 'END', damageTypes: ['blunt', 'pierce'], baseDamage: 14, baseAccuracy: 80, baseCritChance: 8, attackSpeed: 0.7, range: 'melee', twoHanded: false, requirements: [], minLevel: 7, specialMechanic: 'Generates SP on hit. Each hit restores 5 SP.' },

  // ── LEVEL 8 ──
  { id: 'end_l8_juggernaut_shield', name: 'Juggernaut Shield', category: 'END', damageTypes: ['blunt'], baseDamage: 14, baseAccuracy: 84, baseCritChance: 7, attackSpeed: 0.75, range: 'melee', twoHanded: false, requirements: [], minLevel: 8 },
  { id: 'end_l8_titan_polearm', name: 'Titan Polearm', category: 'END', damageTypes: ['slash', 'pierce'], baseDamage: 28, baseAccuracy: 65, baseCritChance: 10, attackSpeed: 0.65, range: 'melee', twoHanded: true, requirements: [], minLevel: 8, specialMechanic: 'HP lost in this combat is added as bonus damage (resets each combat)' },

  // ── LEVEL 9 — UNIQUE ★ ──
  { id: 'end_l9_unbroken', name: 'Unbroken', category: 'END', damageTypes: ['blunt'], baseDamage: 22, baseAccuracy: 88, baseCritChance: 10, attackSpeed: 0.8, range: 'melee', twoHanded: false, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'Damage scales with missing HP — deals +200% damage at 1 HP. Negates the next lethal hit once per floor. Counter-attack is guaranteed when a hit would be lethal.' },

  // ── LEVEL 10 — UNIQUE ★ ──
  { id: 'end_l10_atlas_burden', name: "Atlas's Burden", category: 'END', damageTypes: ['blunt', 'magic'], baseDamage: 30, baseAccuracy: 82, baseCritChance: 12, attackSpeed: 0.7, range: 'melee', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'Absorbs 30% of all incoming damage as stored power (max 999). Stored power releases as bonus damage on next attack. Cannot be killed by a single hit — death requires two consecutive mortal blows.' },
];
