import type { BaseWeapon } from '../../types/Weapon';

export const WIS_WEAPONS: BaseWeapon[] = [
  // ── LEVEL 1 ──
  { id: 'wis_l1_holy_symbol', name: 'Holy Symbol', category: 'WIS', damageTypes: ['holy'], baseDamage: 8, baseAccuracy: 85, baseCritChance: 10, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 1 },
  { id: 'wis_l1_prayer_beads', name: 'Prayer Beads', category: 'WIS', damageTypes: ['holy'], baseDamage: 6, baseAccuracy: 90, baseCritChance: 8, attackSpeed: 1.2, range: 'ranged', twoHanded: false, requirements: [], minLevel: 1 },

  // ── LEVEL 2 ──
  { id: 'wis_l2_censer', name: 'Battle Censer', category: 'WIS', damageTypes: ['holy', 'blunt'], baseDamage: 11, baseAccuracy: 75, baseCritChance: 8, attackSpeed: 0.9, range: 'melee', twoHanded: false, requirements: [], minLevel: 2 },
  { id: 'wis_l2_devotion_ring', name: 'Ring of Devotion', category: 'WIS', damageTypes: ['holy'], baseDamage: 7, baseAccuracy: 92, baseCritChance: 12, attackSpeed: 1.3, range: 'ranged', twoHanded: false, requirements: [], minLevel: 2, specialMechanic: 'Restores 5% max HP when hitting an undead or cursed enemy' },

  // ── LEVEL 3 ──
  { id: 'wis_l3_relic', name: 'Sacred Relic', category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 14, baseAccuracy: 80, baseCritChance: 12, attackSpeed: 0.8, range: 'ranged', twoHanded: true, requirements: [], minLevel: 3 },
  { id: 'wis_l3_blessed_mace', name: 'Blessed Mace', category: 'WIS', damageTypes: ['holy', 'blunt'], baseDamage: 13, baseAccuracy: 76, baseCritChance: 8, attackSpeed: 0.9, range: 'melee', twoHanded: false, requirements: [], minLevel: 3, specialMechanic: 'Deals +50% damage to cursed and fear-afflicted enemies' },

  // ── LEVEL 4 ──
  { id: 'wis_l4_divine_tome', name: 'Divine Tome', category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 15, baseAccuracy: 82, baseCritChance: 14, attackSpeed: 0.75, range: 'ranged', twoHanded: true, requirements: [], minLevel: 4 },
  { id: 'wis_l4_sun_disc', name: 'Sun Disc', category: 'WIS', damageTypes: ['holy', 'fire'], baseDamage: 12, baseAccuracy: 85, baseCritChance: 12, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 4 },

  // ── LEVEL 5 ──
  { id: 'wis_l5_crusader_flail', name: 'Crusader Flail', category: 'WIS', damageTypes: ['holy', 'blunt'], baseDamage: 18, baseAccuracy: 72, baseCritChance: 10, attackSpeed: 0.85, range: 'melee', twoHanded: true, requirements: [], minLevel: 5 },
  { id: 'wis_l5_aura_crystal', name: 'Aura Crystal', category: 'WIS', damageTypes: ['holy'], baseDamage: 14, baseAccuracy: 88, baseCritChance: 16, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 5, specialMechanic: 'Heals 10% max HP on crit. Overheal converts to SP.' },

  // ── LEVEL 6 ──
  { id: 'wis_l6_prophet_staff', name: 'Prophet Staff', category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 20, baseAccuracy: 84, baseCritChance: 14, attackSpeed: 0.85, range: 'ranged', twoHanded: true, requirements: [], minLevel: 6 },
  { id: 'wis_l6_divine_shield', name: 'Divine Shield', category: 'WIS', damageTypes: ['holy', 'blunt'], baseDamage: 10, baseAccuracy: 82, baseCritChance: 8, attackSpeed: 0.8, range: 'melee', twoHanded: false, requirements: [], minLevel: 6, specialMechanic: 'Grants a 15% damage reduction barrier that refreshes each combat' },

  // ── LEVEL 7 ──
  { id: 'wis_l7_holy_avenger', name: 'Holy Avenger', category: 'WIS', damageTypes: ['holy', 'slash'], baseDamage: 24, baseAccuracy: 78, baseCritChance: 16, attackSpeed: 0.9, range: 'melee', twoHanded: true, requirements: [], minLevel: 7 },
  { id: 'wis_l7_oracle_eye', name: "Oracle's Eye", category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 18, baseAccuracy: 92, baseCritChance: 20, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 7, specialMechanic: 'Reveals enemy weaknesses. Damage against weaknesses is +40%.' },

  // ── LEVEL 8 ──
  { id: 'wis_l8_arch_relic', name: 'Arch Relic', category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 26, baseAccuracy: 86, baseCritChance: 18, attackSpeed: 0.85, range: 'ranged', twoHanded: true, requirements: [], minLevel: 8 },
  { id: 'wis_l8_divine_word', name: 'Divine Word', category: 'WIS', damageTypes: ['holy'], baseDamage: 20, baseAccuracy: 90, baseCritChance: 14, attackSpeed: 0.9, range: 'ranged', twoHanded: false, requirements: [], minLevel: 8, specialMechanic: 'If this attack reduces enemy below 25% HP, they become feared for 1 turn.' },

  // ── LEVEL 9 — UNIQUE ★ ──
  { id: 'wis_l9_the_shepherds_voice', name: "The Shepherd's Voice", category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 28, baseAccuracy: 94, baseCritChance: 22, attackSpeed: 1.0, range: 'ranged', twoHanded: false, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'Crits restore 25% max HP. Once per combat, can fully restore HP and SP at the cost of skipping next turn. Undead enemies take 300% damage.' },

  // ── LEVEL 10 — UNIQUE ★ ──
  { id: 'wis_l10_absolution', name: 'Absolution', category: 'WIS', damageTypes: ['holy', 'magic'], baseDamage: 35, baseAccuracy: 96, baseCritChance: 28, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'On kill, fully restores HP. On crit, cleanses all negative status effects on the player. If the player would die while wielding this, survive at 1 HP once per floor.' },
];
