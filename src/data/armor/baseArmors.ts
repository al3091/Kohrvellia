/**
 * Base Armor Data for Kohrvellia
 * 16 base armors (4 slots × 4 types), using shared material/quality/enchantment system
 */

import type { BaseArmor, ArmorSlot, ArmorType, Armor } from '../../types/Armor';
import { ARMOR_TYPE_STATS } from '../../types/Armor';
import {
  MATERIALS,
  QUALITIES,
  ENCHANTMENTS,
} from '../weapons/baseWeapons';
import type { WeaponMaterial, WeaponQuality, WeaponEnchantment } from '../../types/Weapon';

// ===== HEAD ARMORS =====

const LEATHER_HOOD: BaseArmor = {
  id: 'leather_hood',
  name: 'Leather Hood',
  slot: 'head',
  type: 'light',
  baseDefense: 4,
  baseMagicDefense: 2,
  weight: 0.5,
};

const IRON_HELM: BaseArmor = {
  id: 'iron_helm',
  name: 'Iron Helm',
  slot: 'head',
  type: 'medium',
  baseDefense: 6,
  baseMagicDefense: 2,
  weight: 1.5,
};

const PLATE_HELM: BaseArmor = {
  id: 'plate_helm',
  name: 'Plate Helm',
  slot: 'head',
  type: 'heavy',
  baseDefense: 9,
  baseMagicDefense: 1,
  weight: 2.5,
};

const WIZARD_HAT: BaseArmor = {
  id: 'wizard_hat',
  name: 'Wizard Hat',
  slot: 'head',
  type: 'robes',
  baseDefense: 2,
  baseMagicDefense: 6,
  weight: 0.3,
};

// ===== CHEST ARMORS =====

const LEATHER_VEST: BaseArmor = {
  id: 'leather_vest',
  name: 'Leather Vest',
  slot: 'chest',
  type: 'light',
  baseDefense: 8,
  baseMagicDefense: 3,
  weight: 1.5,
};

const CHAIN_MAIL: BaseArmor = {
  id: 'chain_mail',
  name: 'Chain Mail',
  slot: 'chest',
  type: 'medium',
  baseDefense: 12,
  baseMagicDefense: 3,
  weight: 3.0,
};

const PLATE_ARMOR: BaseArmor = {
  id: 'plate_armor',
  name: 'Plate Armor',
  slot: 'chest',
  type: 'heavy',
  baseDefense: 18,
  baseMagicDefense: 2,
  weight: 5.0,
};

const MAGE_ROBES: BaseArmor = {
  id: 'mage_robes',
  name: 'Mage Robes',
  slot: 'chest',
  type: 'robes',
  baseDefense: 3,
  baseMagicDefense: 12,
  weight: 0.8,
};

// ===== HAND ARMORS =====

const LEATHER_GLOVES: BaseArmor = {
  id: 'leather_gloves',
  name: 'Leather Gloves',
  slot: 'hands',
  type: 'light',
  baseDefense: 3,
  baseMagicDefense: 2,
  weight: 0.3,
};

const CHAIN_GAUNTLETS: BaseArmor = {
  id: 'chain_gauntlets',
  name: 'Chain Gauntlets',
  slot: 'hands',
  type: 'medium',
  baseDefense: 5,
  baseMagicDefense: 2,
  weight: 1.0,
};

const STEEL_GAUNTLETS: BaseArmor = {
  id: 'steel_gauntlets',
  name: 'Steel Gauntlets',
  slot: 'hands',
  type: 'heavy',
  baseDefense: 7,
  baseMagicDefense: 1,
  weight: 1.8,
};

const ENCHANTED_GLOVES: BaseArmor = {
  id: 'enchanted_gloves',
  name: 'Enchanted Gloves',
  slot: 'hands',
  type: 'robes',
  baseDefense: 1,
  baseMagicDefense: 5,
  weight: 0.2,
};

// ===== LEG ARMORS =====

const LEATHER_PANTS: BaseArmor = {
  id: 'leather_pants',
  name: 'Leather Pants',
  slot: 'legs',
  type: 'light',
  baseDefense: 5,
  baseMagicDefense: 2,
  weight: 0.8,
};

const CHAIN_LEGGINGS: BaseArmor = {
  id: 'chain_leggings',
  name: 'Chain Leggings',
  slot: 'legs',
  type: 'medium',
  baseDefense: 8,
  baseMagicDefense: 2,
  weight: 2.0,
};

const PLATE_GREAVES: BaseArmor = {
  id: 'plate_greaves',
  name: 'Plate Greaves',
  slot: 'legs',
  type: 'heavy',
  baseDefense: 12,
  baseMagicDefense: 1,
  weight: 3.5,
};

const ROBE_BOTTOMS: BaseArmor = {
  id: 'robe_bottoms',
  name: 'Robe Bottoms',
  slot: 'legs',
  type: 'robes',
  baseDefense: 2,
  baseMagicDefense: 8,
  weight: 0.5,
};

// ===== GROUPED BY SLOT =====

export const BASE_ARMORS_BY_SLOT: Record<ArmorSlot, BaseArmor[]> = {
  head:  [LEATHER_HOOD,   IRON_HELM,       PLATE_HELM,    WIZARD_HAT],
  chest: [LEATHER_VEST,   CHAIN_MAIL,      PLATE_ARMOR,   MAGE_ROBES],
  hands: [LEATHER_GLOVES, CHAIN_GAUNTLETS, STEEL_GAUNTLETS, ENCHANTED_GLOVES],
  legs:  [LEATHER_PANTS,  CHAIN_LEGGINGS,  PLATE_GREAVES, ROBE_BOTTOMS],
};

export const ALL_BASE_ARMORS: BaseArmor[] = [
  ...BASE_ARMORS_BY_SLOT.head,
  ...BASE_ARMORS_BY_SLOT.chest,
  ...BASE_ARMORS_BY_SLOT.hands,
  ...BASE_ARMORS_BY_SLOT.legs,
];

// ===== ARMOR TYPE ICONS =====

export const ARMOR_TYPE_ICONS: Record<ArmorType, string> = {
  light:  '🥋',
  medium: '⛓️',
  heavy:  '🛡️',
  robes:  '🔮',
};

export const ARMOR_SLOT_ICONS: Record<ArmorSlot, string> = {
  head:  '⛑️',
  chest: '🧥',
  hands: '🧤',
  legs:  '👖',
};

// ===== UTILITY FUNCTIONS =====

/**
 * Create an armor instance from base + material + quality
 */
export function createArmorInstance(
  base: BaseArmor,
  material: WeaponMaterial,
  quality: WeaponQuality,
  enchantment?: WeaponEnchantment,
  floorFound: number = 1
): Armor {
  const typeStats = ARMOR_TYPE_STATS[base.type];

  const finalDefense = Math.max(1, Math.floor(
    base.baseDefense
    * typeStats.defenseMultiplier
    * (1 + material.damageModifier)
    * (1 + quality.damageModifier)
  ));

  const finalMagicDefense = Math.max(0, Math.floor(
    base.baseMagicDefense
    * typeStats.magicDefMultiplier
    * (1 + material.damageModifier)
    * (1 + quality.damageModifier)
  ));

  // Build display name
  const nameParts: string[] = [];
  if (quality.tier !== 'standard') nameParts.push(quality.name);
  if (material.tier !== 'common') nameParts.push(material.name);
  nameParts.push(base.name);
  if (enchantment) nameParts.push(enchantment.name);

  return {
    id: `armor_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    base,
    material,
    quality,
    enchantment,
    finalDefense,
    finalMagicDefense,
    speedPenalty: typeStats.speedPenalty,
    dodgePenalty: typeStats.dodgePenalty,
    displayName: nameParts.join(' '),
    rarity: material.tier,
    floorFound,
    identified: true,
  };
}

/**
 * Generate a random armor piece scaled to a floor number
 */
export function generateRandomArmor(floorNumber: number): Armor {
  // Pick random slot and a random armor type for that slot
  const slots: ArmorSlot[] = ['head', 'chest', 'hands', 'legs'];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const baseOptions = BASE_ARMORS_BY_SLOT[slot];
  const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];

  // Floor-scaled material
  const availableMaterials = MATERIALS.filter((m) => m.minFloor <= floorNumber);
  const material = availableMaterials[Math.floor(Math.random() * availableMaterials.length)];

  // Floor-scaled quality
  const availableQualities = QUALITIES.filter((q) => q.minFloor <= floorNumber);
  const quality = availableQualities[Math.floor(Math.random() * availableQualities.length)];

  // 20% enchantment chance
  let enchantment: WeaponEnchantment | undefined;
  if (Math.random() < 0.2) {
    const availableEnchants = ENCHANTMENTS.filter((e) => e.minFloor <= floorNumber);
    if (availableEnchants.length > 0) {
      enchantment = availableEnchants[Math.floor(Math.random() * availableEnchants.length)];
    }
  }

  return createArmorInstance(base, material, quality, enchantment, floorNumber);
}
