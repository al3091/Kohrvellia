import type { BaseWeapon } from '../../types/Weapon';

export const CHA_WEAPONS: BaseWeapon[] = [
  // ── LEVEL 1 ──
  { id: 'cha_l1_whip', name: 'Whip', category: 'CHA', damageTypes: ['slash'], baseDamage: 7, baseAccuracy: 80, baseCritChance: 10, attackSpeed: 1.2, range: 'melee', twoHanded: false, requirements: [], minLevel: 1 },
  { id: 'cha_l1_war_fan', name: 'War Fan', category: 'CHA', damageTypes: ['slash'], baseDamage: 6, baseAccuracy: 85, baseCritChance: 12, attackSpeed: 1.4, range: 'melee', twoHanded: false, requirements: [], minLevel: 1 },

  // ── LEVEL 2 ──
  { id: 'cha_l2_scepter', name: 'Scepter', category: 'CHA', damageTypes: ['blunt', 'magic'], baseDamage: 9, baseAccuracy: 82, baseCritChance: 10, attackSpeed: 1.0, range: 'melee', twoHanded: false, requirements: [], minLevel: 2 },
  { id: 'cha_l2_signet_ring', name: 'Signet Ring', category: 'CHA', damageTypes: ['blunt'], baseDamage: 5, baseAccuracy: 90, baseCritChance: 14, attackSpeed: 1.6, range: 'melee', twoHanded: false, requirements: [], minLevel: 2, specialMechanic: '25% chance to demoralize enemy, reducing their attack damage by 20% for 2 turns' },

  // ── LEVEL 3 ──
  { id: 'cha_l3_war_lute', name: 'War Lute', category: 'CHA', damageTypes: ['magic'], baseDamage: 8, baseAccuracy: 85, baseCritChance: 8, attackSpeed: 1.1, range: 'ranged', twoHanded: true, requirements: [], minLevel: 3 },
  { id: 'cha_l3_dueling_blade', name: 'Dueling Blade', category: 'CHA', damageTypes: ['pierce', 'slash'], baseDamage: 10, baseAccuracy: 88, baseCritChance: 16, attackSpeed: 1.3, range: 'melee', twoHanded: false, requirements: [], minLevel: 3 },

  // ── LEVEL 4 ──
  { id: 'cha_l4_charming_rod', name: 'Charming Rod', category: 'CHA', damageTypes: ['magic'], baseDamage: 11, baseAccuracy: 86, baseCritChance: 12, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 4, specialMechanic: '20% chance to Charm enemy — skips their next turn' },
  { id: 'cha_l4_ornate_whip', name: 'Ornate Whip', category: 'CHA', damageTypes: ['slash', 'magic'], baseDamage: 10, baseAccuracy: 82, baseCritChance: 14, attackSpeed: 1.3, range: 'melee', twoHanded: false, requirements: [], minLevel: 4 },

  // ── LEVEL 5 ──
  { id: 'cha_l5_herald_horn', name: 'Herald Horn', category: 'CHA', damageTypes: ['magic'], baseDamage: 12, baseAccuracy: 84, baseCritChance: 10, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 5, specialMechanic: 'AoE — causes Fear in all enemies (30% chance per enemy)' },
  { id: 'cha_l5_noble_rapier', name: 'Noble Rapier', category: 'CHA', damageTypes: ['pierce'], baseDamage: 13, baseAccuracy: 90, baseCritChance: 20, attackSpeed: 1.4, range: 'melee', twoHanded: false, requirements: [], minLevel: 5 },

  // ── LEVEL 6 ──
  { id: 'cha_l6_crown_scepter', name: 'Crown Scepter', category: 'CHA', damageTypes: ['blunt', 'magic'], baseDamage: 16, baseAccuracy: 82, baseCritChance: 12, attackSpeed: 0.9, range: 'melee', twoHanded: false, requirements: [], minLevel: 6 },
  { id: 'cha_l6_dominator_whip', name: 'Dominator Whip', category: 'CHA', damageTypes: ['slash', 'magic'], baseDamage: 14, baseAccuracy: 80, baseCritChance: 16, attackSpeed: 1.2, range: 'melee', twoHanded: true, requirements: [], minLevel: 6, specialMechanic: 'Each hit has 25% chance to lower enemy defense by 10% (stacks, max 5 times)' },

  // ── LEVEL 7 ──
  { id: 'cha_l7_reality_lute', name: 'Reality Lute', category: 'CHA', damageTypes: ['magic'], baseDamage: 18, baseAccuracy: 88, baseCritChance: 14, attackSpeed: 1.0, range: 'ranged', twoHanded: true, requirements: [], minLevel: 7 },
  { id: 'cha_l7_sovereign_blade', name: 'Sovereign Blade', category: 'CHA', damageTypes: ['slash', 'magic'], baseDamage: 20, baseAccuracy: 84, baseCritChance: 18, attackSpeed: 1.1, range: 'melee', twoHanded: false, requirements: [], minLevel: 7, specialMechanic: 'Defeated enemies grant +5% damage to all subsequent hits this combat' },

  // ── LEVEL 8 ──
  { id: 'cha_l8_emperor_staff', name: "Emperor's Staff", category: 'CHA', damageTypes: ['magic', 'blunt'], baseDamage: 22, baseAccuracy: 84, baseCritChance: 14, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 8 },
  { id: 'cha_l8_tyrant_whip', name: 'Tyrant Whip', category: 'CHA', damageTypes: ['slash', 'dark'], baseDamage: 18, baseAccuracy: 82, baseCritChance: 22, attackSpeed: 1.3, range: 'melee', twoHanded: false, requirements: [], minLevel: 8, specialMechanic: 'Hits cause Silence — prevents enemy from using special abilities' },

  // ── LEVEL 9 — UNIQUE ★ ──
  { id: 'cha_l9_aria_of_ruin', name: 'Aria of Ruin', category: 'CHA', damageTypes: ['magic', 'dark'], baseDamage: 24, baseAccuracy: 92, baseCritChance: 20, attackSpeed: 1.1, range: 'ranged', twoHanded: true, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'Melody intensifies each turn: Turn 1 normal, Turn 3 +50%, Turn 5 +100% and causes Fear. Enemies below 40% HP flee unless they resist Fear.' },

  // ── LEVEL 10 — UNIQUE ★ ──
  { id: 'cha_l10_the_final_curtain', name: 'The Final Curtain', category: 'CHA', damageTypes: ['magic', 'dark'], baseDamage: 30, baseAccuracy: 95, baseCritChance: 25, attackSpeed: 1.0, range: 'ranged', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'All combat actions have a 15% chance to become "Perfect" (double effect). On killing blow, stuns all surviving enemies for 1 turn.' },
];
