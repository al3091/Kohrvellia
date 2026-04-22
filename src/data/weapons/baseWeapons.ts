/**
 * Base Weapon Data for Kohrvellia
 * Weapons organized by scaling stat
 */

import type { BaseWeapon, WeaponMaterial, WeaponQuality, WeaponEnchantment } from '../../types/Weapon';
import { QUALITY_OUTPUT_CAP_MULTIPLIER } from '../../types/Weapon';

// ===== STR WEAPONS (Power) =====
// Heavy weapons that deal massive damage through raw strength

export const LONGSWORD: BaseWeapon = {
  id: 'longsword',
  name: 'Longsword',
  category: 'STR',
  damageTypes: ['slash'],
  baseDamage: 12,
  baseAccuracy: 75,
  baseCritChance: 8,
  attackSpeed: 1.0,
  range: 'melee',
  twoHanded: false,
  requirements: [],
};

export const GREATAXE: BaseWeapon = {
  id: 'greataxe',
  name: 'Greataxe',
  category: 'STR',
  damageTypes: ['slash'],
  baseDamage: 18,
  baseAccuracy: 65,
  baseCritChance: 12,
  attackSpeed: 0.7,
  range: 'melee',
  twoHanded: true,
  requirements: [{ stat: 'STR', minGrade: 'H' }],
};

export const WARHAMMER: BaseWeapon = {
  id: 'warhammer',
  name: 'Warhammer',
  category: 'STR',
  damageTypes: ['blunt'],
  baseDamage: 15,
  baseAccuracy: 70,
  baseCritChance: 10,
  attackSpeed: 0.8,
  range: 'melee',
  twoHanded: true,
  requirements: [],
};

export const MACE: BaseWeapon = {
  id: 'mace',
  name: 'Mace',
  category: 'STR',
  damageTypes: ['blunt'],
  baseDamage: 10,
  baseAccuracy: 78,
  baseCritChance: 6,
  attackSpeed: 1.0,
  range: 'melee',
  twoHanded: false,
  requirements: [],
};

// ===== AGI WEAPONS (Finesse) =====
// Light, fast weapons that strike quickly and precisely

export const DAGGER: BaseWeapon = {
  id: 'dagger',
  name: 'Dagger',
  category: 'AGI',
  damageTypes: ['pierce'],
  baseDamage: 6,
  baseAccuracy: 90,
  baseCritChance: 15,
  attackSpeed: 1.5,
  range: 'melee',
  twoHanded: false,
  requirements: [],
};

export const RAPIER: BaseWeapon = {
  id: 'rapier',
  name: 'Rapier',
  category: 'AGI',
  damageTypes: ['pierce'],
  baseDamage: 9,
  baseAccuracy: 85,
  baseCritChance: 12,
  attackSpeed: 1.3,
  range: 'melee',
  twoHanded: false,
  requirements: [],
};

export const DUAL_BLADES: BaseWeapon = {
  id: 'dual_blades',
  name: 'Dual Blades',
  category: 'AGI',
  damageTypes: ['slash'],
  baseDamage: 8,
  baseAccuracy: 80,
  baseCritChance: 14,
  attackSpeed: 1.4,
  range: 'melee',
  twoHanded: true, // Both hands occupied
  requirements: [{ stat: 'AGI', minGrade: 'H' }],
};

export const KATANA: BaseWeapon = {
  id: 'katana',
  name: 'Katana',
  category: 'AGI',
  damageTypes: ['slash'],
  baseDamage: 11,
  baseAccuracy: 82,
  baseCritChance: 18,
  attackSpeed: 1.1,
  range: 'melee',
  twoHanded: true,
  requirements: [{ stat: 'AGI', minGrade: 'G' }],
};

// ===== PER WEAPONS (Precision) =====
// Ranged weapons that reward careful aim and observation

export const SHORTBOW: BaseWeapon = {
  id: 'shortbow',
  name: 'Shortbow',
  category: 'PER',
  damageTypes: ['pierce'],
  baseDamage: 8,
  baseAccuracy: 80,
  baseCritChance: 10,
  attackSpeed: 1.2,
  range: 'ranged',
  twoHanded: true,
  requirements: [],
};

export const LONGBOW: BaseWeapon = {
  id: 'longbow',
  name: 'Longbow',
  category: 'PER',
  damageTypes: ['pierce'],
  baseDamage: 12,
  baseAccuracy: 75,
  baseCritChance: 15,
  attackSpeed: 0.9,
  range: 'ranged',
  twoHanded: true,
  requirements: [{ stat: 'PER', minGrade: 'H' }],
};

export const CROSSBOW: BaseWeapon = {
  id: 'crossbow',
  name: 'Crossbow',
  category: 'PER',
  damageTypes: ['pierce'],
  baseDamage: 14,
  baseAccuracy: 85,
  baseCritChance: 8,
  attackSpeed: 0.6,
  range: 'ranged',
  twoHanded: true,
  requirements: [],
};

export const THROWING_KNIVES: BaseWeapon = {
  id: 'throwing_knives',
  name: 'Throwing Knives',
  category: 'PER',
  damageTypes: ['pierce'],
  baseDamage: 5,
  baseAccuracy: 88,
  baseCritChance: 12,
  attackSpeed: 1.5,
  range: 'ranged',
  twoHanded: false,
  requirements: [],
};

// ===== INT WEAPONS (Arcane) =====
// Magical implements that channel arcane energy

export const STAFF: BaseWeapon = {
  id: 'staff',
  name: 'Staff',
  category: 'INT',
  damageTypes: ['magic'],
  baseDamage: 10,
  baseAccuracy: 85,
  baseCritChance: 8,
  attackSpeed: 0.9,
  range: 'ranged',
  twoHanded: true,
  requirements: [],
};

export const WAND: BaseWeapon = {
  id: 'wand',
  name: 'Wand',
  category: 'INT',
  damageTypes: ['magic'],
  baseDamage: 7,
  baseAccuracy: 90,
  baseCritChance: 10,
  attackSpeed: 1.3,
  range: 'ranged',
  twoHanded: false,
  requirements: [],
};

export const TOME: BaseWeapon = {
  id: 'tome',
  name: 'Tome',
  category: 'INT',
  damageTypes: ['magic'],
  baseDamage: 12,
  baseAccuracy: 82,
  baseCritChance: 12,
  attackSpeed: 0.7,
  range: 'ranged',
  twoHanded: true,
  requirements: [{ stat: 'INT', minGrade: 'G' }],
};

export const ORB: BaseWeapon = {
  id: 'orb',
  name: 'Crystal Orb',
  category: 'INT',
  damageTypes: ['magic'],
  baseDamage: 9,
  baseAccuracy: 88,
  baseCritChance: 15,
  attackSpeed: 1.0,
  range: 'ranged',
  twoHanded: false,
  requirements: [{ stat: 'INT', minGrade: 'H' }],
};

// ===== WIS WEAPONS (Divine) =====
// Holy symbols and relics that channel spiritual power

export const HOLY_SYMBOL: BaseWeapon = {
  id: 'holy_symbol',
  name: 'Holy Symbol',
  category: 'WIS',
  damageTypes: ['holy'],
  baseDamage: 8,
  baseAccuracy: 85,
  baseCritChance: 10,
  attackSpeed: 1.0,
  range: 'ranged',
  twoHanded: false,
  requirements: [],
};

export const PRAYER_BEADS: BaseWeapon = {
  id: 'prayer_beads',
  name: 'Prayer Beads',
  category: 'WIS',
  damageTypes: ['holy'],
  baseDamage: 6,
  baseAccuracy: 90,
  baseCritChance: 8,
  attackSpeed: 1.2,
  range: 'ranged',
  twoHanded: false,
  requirements: [],
};

export const CENSER: BaseWeapon = {
  id: 'censer',
  name: 'Battle Censer',
  category: 'WIS',
  damageTypes: ['holy', 'blunt'],
  baseDamage: 11,
  baseAccuracy: 75,
  baseCritChance: 8,
  attackSpeed: 0.9,
  range: 'melee',
  twoHanded: false,
  requirements: [{ stat: 'WIS', minGrade: 'H' }],
};

export const RELIC: BaseWeapon = {
  id: 'relic',
  name: 'Sacred Relic',
  category: 'WIS',
  damageTypes: ['holy', 'magic'],
  baseDamage: 14,
  baseAccuracy: 80,
  baseCritChance: 12,
  attackSpeed: 0.8,
  range: 'ranged',
  twoHanded: true,
  requirements: [{ stat: 'WIS', minGrade: 'F' }],
};

// ===== CHA WEAPONS (Performance) =====
// Weapons that weaponize presence and personality

export const WHIP: BaseWeapon = {
  id: 'whip',
  name: 'Whip',
  category: 'CHA',
  damageTypes: ['slash'],
  baseDamage: 7,
  baseAccuracy: 80,
  baseCritChance: 10,
  attackSpeed: 1.2,
  range: 'melee', // Extended melee range
  twoHanded: false,
  requirements: [],
};

export const WAR_FAN: BaseWeapon = {
  id: 'war_fan',
  name: 'War Fan',
  category: 'CHA',
  damageTypes: ['slash'],
  baseDamage: 6,
  baseAccuracy: 85,
  baseCritChance: 12,
  attackSpeed: 1.4,
  range: 'melee',
  twoHanded: false,
  requirements: [],
};

export const SCEPTER: BaseWeapon = {
  id: 'scepter',
  name: 'Scepter',
  category: 'CHA',
  damageTypes: ['blunt', 'magic'],
  baseDamage: 9,
  baseAccuracy: 82,
  baseCritChance: 10,
  attackSpeed: 1.0,
  range: 'melee',
  twoHanded: false,
  requirements: [{ stat: 'CHA', minGrade: 'H' }],
};

export const INSTRUMENT: BaseWeapon = {
  id: 'instrument',
  name: 'War Lute',
  category: 'CHA',
  damageTypes: ['magic'],
  baseDamage: 8,
  baseAccuracy: 85,
  baseCritChance: 8,
  attackSpeed: 1.1,
  range: 'ranged',
  twoHanded: true,
  requirements: [{ stat: 'CHA', minGrade: 'G' }],
};

// ===== END WEAPONS (Guardian) =====
// Defensive weapons that punish attackers and protect allies

export const TOWER_SHIELD: BaseWeapon = {
  id: 'tower_shield',
  name: 'Tower Shield',
  category: 'END',
  damageTypes: ['blunt'],
  baseDamage: 6,
  baseAccuracy: 85,
  baseCritChance: 5,
  attackSpeed: 0.8,
  range: 'melee',
  twoHanded: false, // Shield bash
  requirements: [],
};

export const SPIKED_SHIELD: BaseWeapon = {
  id: 'spiked_shield',
  name: 'Spiked Shield',
  category: 'END',
  damageTypes: ['blunt', 'pierce'],
  baseDamage: 9,
  baseAccuracy: 80,
  baseCritChance: 8,
  attackSpeed: 0.9,
  range: 'melee',
  twoHanded: false,
  requirements: [{ stat: 'END', minGrade: 'H' }],
};

export const FLAIL: BaseWeapon = {
  id: 'flail',
  name: 'Flail',
  category: 'END',
  damageTypes: ['blunt'],
  baseDamage: 11,
  baseAccuracy: 70,
  baseCritChance: 10,
  attackSpeed: 0.85,
  range: 'melee',
  twoHanded: false,
  requirements: [],
};

export const HALBERD: BaseWeapon = {
  id: 'halberd',
  name: 'Halberd',
  category: 'END',
  damageTypes: ['slash', 'pierce'],
  baseDamage: 14,
  baseAccuracy: 72,
  baseCritChance: 8,
  attackSpeed: 0.7,
  range: 'melee',
  twoHanded: true,
  requirements: [{ stat: 'END', minGrade: 'G' }],
};

// ===== LCK WEAPONS (Chaos) =====
// Unpredictable weapons with random but potentially devastating effects

export const LOADED_DICE: BaseWeapon = {
  id: 'loaded_dice',
  name: 'Loaded Dice',
  category: 'LCK',
  damageTypes: ['magic'],
  baseDamage: 5, // Base is low, but can crit high
  baseAccuracy: 75,
  baseCritChance: 25, // Very high crit chance
  attackSpeed: 1.3,
  range: 'ranged',
  twoHanded: false,
  requirements: [],
};

export const CHAOS_BLADE: BaseWeapon = {
  id: 'chaos_blade',
  name: 'Chaos Blade',
  category: 'LCK',
  damageTypes: ['slash', 'dark'],
  baseDamage: 10,
  baseAccuracy: 70,
  baseCritChance: 20,
  attackSpeed: 1.0,
  range: 'melee',
  twoHanded: false,
  requirements: [{ stat: 'LCK', minGrade: 'H' }],
};

export const COIN_LAUNCHER: BaseWeapon = {
  id: 'coin_launcher',
  name: 'Coin Launcher',
  category: 'LCK',
  damageTypes: ['pierce'],
  baseDamage: 7,
  baseAccuracy: 78,
  baseCritChance: 22,
  attackSpeed: 1.2,
  range: 'ranged',
  twoHanded: false,
  requirements: [],
};

export const WILD_CARD: BaseWeapon = {
  id: 'wild_card',
  name: 'Wild Card',
  category: 'LCK',
  damageTypes: ['magic'],
  baseDamage: 8,
  baseAccuracy: 72,
  baseCritChance: 30, // Highest crit chance
  attackSpeed: 1.1,
  range: 'ranged',
  twoHanded: false,
  requirements: [{ stat: 'LCK', minGrade: 'G' }],
};

// ===== ALL BASE WEAPONS =====

export const ALL_BASE_WEAPONS: BaseWeapon[] = [
  // STR
  LONGSWORD, GREATAXE, WARHAMMER, MACE,
  // AGI
  DAGGER, RAPIER, DUAL_BLADES, KATANA,
  // PER
  SHORTBOW, LONGBOW, CROSSBOW, THROWING_KNIVES,
  // INT
  STAFF, WAND, TOME, ORB,
  // WIS
  HOLY_SYMBOL, PRAYER_BEADS, CENSER, RELIC,
  // CHA
  WHIP, WAR_FAN, SCEPTER, INSTRUMENT,
  // END
  TOWER_SHIELD, SPIKED_SHIELD, FLAIL, HALBERD,
  // LCK
  LOADED_DICE, CHAOS_BLADE, COIN_LAUNCHER, WILD_CARD,
];

// ===== WEAPON MATERIALS =====

export const MATERIALS: WeaponMaterial[] = [
  {
    id: 'rusty',
    name: 'Rusty',
    tier: 'junk',
    damageModifier: -0.2,
    durabilityModifier: 0.5,
    weightModifier: 1.2,
    minFloor: 1,
    description: 'Corroded and brittle, barely holding together.',
  },
  {
    id: 'iron',
    name: 'Iron',
    tier: 'common',
    damageModifier: 0,
    durabilityModifier: 1.0,
    weightModifier: 1.0,
    minFloor: 1,
    description: 'Standard iron, reliable but unremarkable.',
  },
  {
    id: 'steel',
    name: 'Steel',
    tier: 'uncommon',
    damageModifier: 0.1,
    durabilityModifier: 1.2,
    weightModifier: 0.95,
    minFloor: 5,
    description: 'Refined steel with a keen edge.',
  },
  {
    id: 'damascus',
    name: 'Damascus',
    tier: 'rare',
    damageModifier: 0.25,
    durabilityModifier: 1.4,
    weightModifier: 0.9,
    minFloor: 10,
    description: 'Folded steel with distinctive patterns.',
  },
  {
    id: 'mithril',
    name: 'Mithril',
    tier: 'epic',
    damageModifier: 0.5,
    durabilityModifier: 2.0,
    weightModifier: 0.5,
    minFloor: 25,
    description: 'Legendary elven silver, light as a feather.',
  },
  {
    id: 'adamantine',
    name: 'Adamantine',
    tier: 'legendary',
    damageModifier: 1.0,
    durabilityModifier: 10.0,
    weightModifier: 1.5,
    minFloor: 40,
    description: 'Indestructible metal from the depths.',
  },
];

// ===== WEAPON QUALITIES =====

export const QUALITIES: WeaponQuality[] = [
  {
    id: 'crude',
    name: 'Crude',
    tier: 'crude',
    accuracyModifier: -0.1,
    critModifier: 0,
    damageModifier: -0.1,
    minFloor: 1,
  },
  {
    id: 'standard',
    name: '',
    tier: 'standard',
    accuracyModifier: 0,
    critModifier: 0,
    damageModifier: 0,
    minFloor: 1,
  },
  {
    id: 'fine',
    name: 'Fine',
    tier: 'fine',
    accuracyModifier: 0,
    critModifier: 0.05,
    damageModifier: 0,
    minFloor: 5,
  },
  {
    id: 'superior',
    name: 'Superior',
    tier: 'superior',
    accuracyModifier: 0,
    critModifier: 0.1,
    damageModifier: 0.05,
    minFloor: 10,
  },
  {
    id: 'masterwork',
    name: 'Masterwork',
    tier: 'masterwork',
    accuracyModifier: 0.05,
    critModifier: 0.15,
    damageModifier: 0.1,
    minFloor: 20,
  },
  {
    id: 'legendary',
    name: 'Legendary',
    tier: 'legendary',
    accuracyModifier: 0.1,
    critModifier: 0.25,
    damageModifier: 0.2,
    minFloor: 35,
  },
];

// ===== ENCHANTMENTS =====

export const ENCHANTMENTS: WeaponEnchantment[] = [
  {
    id: 'of_flame',
    name: 'of Flame',
    tier: 'minor',
    effects: [
      { type: 'elemental_damage', value: 3, element: 'fire', description: '+3 fire damage' },
      { type: 'status_chance', value: 10, statusEffect: 'burn', description: '10% chance to burn' },
    ],
    minFloor: 1,
  },
  {
    id: 'of_frost',
    name: 'of Frost',
    tier: 'minor',
    effects: [
      { type: 'elemental_damage', value: 2, element: 'ice', description: '+2 ice damage' },
      { type: 'status_chance', value: 15, statusEffect: 'freeze', description: '15% chance to freeze' },
    ],
    minFloor: 1,
  },
  {
    id: 'of_venom',
    name: 'of Venom',
    tier: 'minor',
    effects: [
      { type: 'elemental_damage', value: 1, element: 'poison', description: '+1 poison damage' },
      { type: 'status_chance', value: 25, statusEffect: 'poison', description: '25% chance to poison' },
    ],
    minFloor: 1,
  },
  {
    id: 'of_lightning',
    name: 'of Lightning',
    tier: 'standard',
    effects: [
      { type: 'elemental_damage', value: 5, element: 'lightning', description: '+5 lightning damage' },
      { type: 'status_chance', value: 8, statusEffect: 'stun', description: '8% chance to stun' },
    ],
    minFloor: 8,
  },
  {
    id: 'of_vampirism',
    name: 'of Vampirism',
    tier: 'standard',
    effects: [
      { type: 'lifesteal', value: 10, description: 'Heal 10% of damage dealt' },
    ],
    minFloor: 10,
  },
  {
    id: 'of_slaying',
    name: 'of Slaying',
    tier: 'greater',
    effects: [
      { type: 'armor_pierce', value: 25, description: 'Ignore 25% of defense' },
    ],
    minFloor: 15,
  },
  {
    id: 'of_the_dragon',
    name: 'of the Dragon',
    tier: 'legendary',
    effects: [
      { type: 'elemental_damage', value: 10, element: 'fire', description: '+10 fire damage' },
      { type: 'stat_boost', value: 10, description: '+10 to weapon scaling stat' },
    ],
    minFloor: 30,
  },
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get weapons by category
 */
export function getWeaponsByCategory(category: string): BaseWeapon[] {
  return ALL_BASE_WEAPONS.filter((w) => w.category === category);
}

/**
 * Get a random starting weapon for a stat
 */
export function getStarterWeaponForStat(stat: string): BaseWeapon | undefined {
  const weapons = getWeaponsByCategory(stat);
  // Return the simplest weapon (no requirements)
  return weapons.find((w) => w.requirements.length === 0);
}

/**
 * Create a weapon instance from base weapon
 */
export function createWeaponInstance(
  base: BaseWeapon,
  material: WeaponMaterial,
  quality: WeaponQuality,
  enchantment?: WeaponEnchantment,
  floorFound: number = 1
): import('../../types/Weapon').Weapon {
  const finalDamage = Math.floor(
    base.baseDamage * (1 + material.damageModifier) * (1 + quality.damageModifier)
  );
  const finalAccuracy = Math.floor(
    base.baseAccuracy * (1 + quality.accuracyModifier)
  );
  const finalCritChance = base.baseCritChance + quality.critModifier * 100;

  // Generate display name
  const nameParts: string[] = [];
  if (quality.tier !== 'standard') nameParts.push(quality.name);
  if (material.tier !== 'common') nameParts.push(material.name);
  nameParts.push(base.name);
  if (enchantment) nameParts.push(enchantment.name);

  // C2: Cap scales with quality — crude weapons cannot benefit from high stats
  const capMult = QUALITY_OUTPUT_CAP_MULTIPLIER[quality.tier as import('../../types/Weapon').QualityTier] ?? 3;
  const maxOutputCap = Math.ceil(finalDamage * capMult);

  return {
    id: `weapon_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    base,
    material,
    quality,
    enchantment,
    finalDamage,
    finalAccuracy,
    finalCritChance,
    maxOutputCap,
    displayName: nameParts.join(' '),
    rarity: material.tier,
    floorFound,
    identified: true,
  };
}

/**
 * Create a starter weapon for a character based on their highest stat
 */
export function createStarterWeapon(highestStat: string): import('../../types/Weapon').Weapon {
  const baseWeapon = getStarterWeaponForStat(highestStat) ?? LONGSWORD;
  const material = MATERIALS.find((m) => m.tier === 'common') ?? MATERIALS[1];
  const quality = QUALITIES.find((q) => q.tier === 'standard') ?? QUALITIES[1];

  return createWeaponInstance(baseWeapon, material, quality, undefined, 0);
}

/**
 * Generate a random weapon drop for a floor from the legacy base weapon pool.
 * For drops using the full expanded pool (level-gated), use generateLeveledWeaponDrop from index.ts.
 * @param floorNumber - The floor level to base weapon quality on
 * @param categoryFilter - Optional array of weapon categories to filter by (e.g., ['STR', 'AGI'])
 */
export function generateRandomWeapon(
  floorNumber: number,
  categoryFilter?: import('../../types/Weapon').WeaponCategory[]
): import('../../types/Weapon').Weapon {
  // Select base weapon, optionally filtered by category
  let availableWeapons = ALL_BASE_WEAPONS;
  if (categoryFilter && categoryFilter.length > 0) {
    const filtered = ALL_BASE_WEAPONS.filter((w) =>
      categoryFilter.includes(w.category as import('../../types/Weapon').WeaponCategory)
    );
    availableWeapons = filtered.length > 0 ? filtered : ALL_BASE_WEAPONS;
  }

  const baseWeapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];

  // Select material based on floor
  const availableMaterials = MATERIALS.filter((m) => m.minFloor <= floorNumber);
  const material = availableMaterials[Math.floor(Math.random() * availableMaterials.length)];

  // Select quality based on floor
  const availableQualities = QUALITIES.filter((q) => q.minFloor <= floorNumber);
  const quality = availableQualities[Math.floor(Math.random() * availableQualities.length)];

  // Maybe add enchantment (20% chance, based on floor)
  let enchantment: WeaponEnchantment | undefined;
  if (Math.random() < 0.2) {
    const availableEnchants = ENCHANTMENTS.filter((e) => e.minFloor <= floorNumber);
    if (availableEnchants.length > 0) {
      enchantment = availableEnchants[Math.floor(Math.random() * availableEnchants.length)];
    }
  }

  return createWeaponInstance(baseWeapon, material, quality, enchantment, floorNumber);
}
