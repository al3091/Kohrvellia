import type { BaseWeapon } from '../../types/Weapon';

export const INT_WEAPONS: BaseWeapon[] = [
  // L1
  { id: 'int_l1_wand', name: 'Wand', category: 'INT', damageTypes: ['magic'], baseDamage: 7, baseAccuracy: 90, baseCritChance: 10, attackSpeed: 1.3, range: 'ranged', twoHanded: false, requirements: [], minLevel: 1 },
  { id: 'int_l1_staff', name: 'Apprentice Staff', category: 'INT', damageTypes: ['magic'], baseDamage: 10, baseAccuracy: 85, baseCritChance: 8, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 1 },
  // L2
  { id: 'int_l2_fire_wand', name: 'Fire Wand', category: 'INT', damageTypes: ['magic', 'fire'], baseDamage: 9, baseAccuracy: 88, baseCritChance: 12, attackSpeed: 1.2, range: 'ranged', twoHanded: false, requirements: [], minLevel: 2, specialMechanic: '20% chance to Burn on hit' },
  { id: 'int_l2_arcane_rod', name: 'Arcane Rod', category: 'INT', damageTypes: ['magic'], baseDamage: 12, baseAccuracy: 84, baseCritChance: 10, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 2 },
  // L3
  { id: 'int_l3_crystal_orb', name: 'Crystal Orb', category: 'INT', damageTypes: ['magic'], baseDamage: 11, baseAccuracy: 88, baseCritChance: 15, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 3 },
  { id: 'int_l3_battle_staff', name: 'Battle Staff', category: 'INT', damageTypes: ['magic', 'blunt'], baseDamage: 14, baseAccuracy: 80, baseCritChance: 8, attackSpeed: 0.85, range: 'melee', twoHanded: true, requirements: [], minLevel: 3 },
  // L4
  { id: 'int_l4_tome', name: 'Spellbinder Tome', category: 'INT', damageTypes: ['magic'], baseDamage: 14, baseAccuracy: 82, baseCritChance: 12, attackSpeed: 0.7, range: 'ranged', twoHanded: true, requirements: [], minLevel: 4 },
  { id: 'int_l4_lightning_rod', name: 'Lightning Rod', category: 'INT', damageTypes: ['magic', 'lightning'], baseDamage: 11, baseAccuracy: 86, baseCritChance: 14, attackSpeed: 1.1, range: 'ranged', twoHanded: false, requirements: [], minLevel: 4, specialMechanic: '15% chance to chain-lightning to a second enemy for 50% damage' },
  // L5
  { id: 'int_l5_froststaff', name: 'Frost Staff', category: 'INT', damageTypes: ['magic', 'ice'], baseDamage: 16, baseAccuracy: 84, baseCritChance: 10, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 5, specialMechanic: 'Slows enemy attack speed by 20% for 2 turns on hit' },
  { id: 'int_l5_runic_orb', name: 'Runic Orb', category: 'INT', damageTypes: ['magic'], baseDamage: 13, baseAccuracy: 90, baseCritChance: 18, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 5 },
  // L6
  { id: 'int_l6_archmage_staff', name: 'Archmage Staff', category: 'INT', damageTypes: ['magic'], baseDamage: 20, baseAccuracy: 86, baseCritChance: 12, attackSpeed: 0.85, range: 'ranged', twoHanded: true, requirements: [], minLevel: 6 },
  { id: 'int_l6_chaos_tome', name: 'Chaos Tome', category: 'INT', damageTypes: ['magic', 'dark'], baseDamage: 17, baseAccuracy: 80, baseCritChance: 20, attackSpeed: 0.75, range: 'ranged', twoHanded: true, requirements: [], minLevel: 6, specialMechanic: 'Randomly applies one of: Burn, Freeze, or Poison each hit' },
  // L7
  { id: 'int_l7_void_staff', name: 'Void Staff', category: 'INT', damageTypes: ['magic', 'dark'], baseDamage: 24, baseAccuracy: 84, baseCritChance: 14, attackSpeed: 0.8, range: 'ranged', twoHanded: true, requirements: [], minLevel: 7 },
  { id: 'int_l7_spell_cannon', name: 'Spell Cannon', category: 'INT', damageTypes: ['magic'], baseDamage: 28, baseAccuracy: 72, baseCritChance: 10, attackSpeed: 0.55, range: 'ranged', twoHanded: true, requirements: [], minLevel: 7, specialMechanic: 'Deals AOE damage hitting all enemies. Each charge takes 2 turns.' },
  // L8
  { id: 'int_l8_grand_tome', name: 'Grand Tome', category: 'INT', damageTypes: ['magic'], baseDamage: 22, baseAccuracy: 88, baseCritChance: 16, attackSpeed: 0.7, range: 'ranged', twoHanded: true, requirements: [], minLevel: 8 },
  { id: 'int_l8_prism_orb', name: 'Prism Orb', category: 'INT', damageTypes: ['magic', 'fire', 'ice', 'lightning'], baseDamage: 16, baseAccuracy: 86, baseCritChance: 20, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 8, specialMechanic: 'Randomly selects damage type each hit for weakness exploitation' },
  // L9 UNIQUE
  { id: 'int_l9_the_living_flame', name: 'The Living Flame', category: 'INT', damageTypes: ['magic', 'fire'], baseDamage: 30, baseAccuracy: 92, baseCritChance: 22, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'Leaves a burning mark on the enemy. Each subsequent hit amplifies by +10% (max +100%). If enemy is killed while marked, mark transfers to all remaining enemies.' },
  // L10 UNIQUE
  { id: 'int_l10_axiom', name: 'Axiom', category: 'INT', damageTypes: ['magic'], baseDamage: 36, baseAccuracy: 95, baseCritChance: 25, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'Bypasses all magic resistance. Crits ignore all defenses and deal true damage. Once per combat, can rewrite the outcome of the last turn (undo the enemys last action).' },
];
