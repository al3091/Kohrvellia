/**
 * Crafting materials for Kohrvellia
 * Used for blacksmith upgrades and crafting
 */

export interface CraftingMaterial {
  id: string;
  name: string;
  description: string;
  tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  sellPrice: number;
  minFloor: number; // Earliest floor this drops
  dropWeight: number; // Relative drop chance
  category: 'metal' | 'monster' | 'gem' | 'essence';
}

// ===== METAL INGOTS =====

export const IRON_INGOT: CraftingMaterial = {
  id: 'iron_ingot',
  name: 'Iron Ingot',
  description: 'A bar of refined iron. Common but reliable.',
  tier: 'common',
  icon: '🔩',
  sellPrice: 10,
  minFloor: 1,
  dropWeight: 100,
  category: 'metal',
};

export const STEEL_INGOT: CraftingMaterial = {
  id: 'steel_ingot',
  name: 'Steel Ingot',
  description: 'Hardened steel, stronger than iron.',
  tier: 'uncommon',
  icon: '🔩',
  sellPrice: 25,
  minFloor: 6,
  dropWeight: 60,
  category: 'metal',
};

export const DAMASCUS_INGOT: CraftingMaterial = {
  id: 'damascus_ingot',
  name: 'Damascus Ingot',
  description: 'Patterned steel forged with ancient techniques.',
  tier: 'rare',
  icon: '🔩',
  sellPrice: 75,
  minFloor: 11,
  dropWeight: 30,
  category: 'metal',
};

export const MITHRIL_INGOT: CraftingMaterial = {
  id: 'mithril_ingot',
  name: 'Mithril Ingot',
  description: 'Legendary silver-steel alloy, light as silk.',
  tier: 'epic',
  icon: '✨',
  sellPrice: 200,
  minFloor: 25,
  dropWeight: 10,
  category: 'metal',
};

export const ADAMANTINE_INGOT: CraftingMaterial = {
  id: 'adamantine_ingot',
  name: 'Adamantine Ingot',
  description: 'The hardest metal known to mortals.',
  tier: 'legendary',
  icon: '💎',
  sellPrice: 500,
  minFloor: 40,
  dropWeight: 3,
  category: 'metal',
};

// ===== MONSTER DROPS =====

export const MONSTER_HIDE: CraftingMaterial = {
  id: 'monster_hide',
  name: 'Monster Hide',
  description: 'Tough hide from dungeon creatures.',
  tier: 'common',
  icon: '🦴',
  sellPrice: 5,
  minFloor: 1,
  dropWeight: 120,
  category: 'monster',
};

export const MONSTER_FANG: CraftingMaterial = {
  id: 'monster_fang',
  name: 'Monster Fang',
  description: 'A sharp fang from a predatory monster.',
  tier: 'common',
  icon: '🦷',
  sellPrice: 8,
  minFloor: 1,
  dropWeight: 80,
  category: 'monster',
};

export const MONSTER_CLAW: CraftingMaterial = {
  id: 'monster_claw',
  name: 'Monster Claw',
  description: 'A razor-sharp claw from a beast.',
  tier: 'uncommon',
  icon: '🔪',
  sellPrice: 15,
  minFloor: 5,
  dropWeight: 50,
  category: 'monster',
};

export const MONSTER_ESSENCE: CraftingMaterial = {
  id: 'monster_essence',
  name: 'Monster Essence',
  description: 'Crystallized magical essence from a powerful creature.',
  tier: 'rare',
  icon: '💠',
  sellPrice: 100,
  minFloor: 15,
  dropWeight: 15,
  category: 'essence',
};

export const DRAGON_SCALE: CraftingMaterial = {
  id: 'dragon_scale',
  name: 'Dragon Scale',
  description: 'An iridescent scale from a dragon.',
  tier: 'epic',
  icon: '🐉',
  sellPrice: 300,
  minFloor: 30,
  dropWeight: 5,
  category: 'monster',
};

export const DRAGON_HEART: CraftingMaterial = {
  id: 'dragon_heart',
  name: 'Dragon Heart',
  description: 'The still-warm heart of a slain dragon.',
  tier: 'legendary',
  icon: '❤️‍🔥',
  sellPrice: 1000,
  minFloor: 40,
  dropWeight: 1,
  category: 'monster',
};

// ===== MAGIC STONES (Primary Monster Drops) =====
// Magic stones are crystallized monster essence - the primary sellable loot

export const MAGIC_STONE_SMALL: CraftingMaterial = {
  id: 'magic_stone_small',
  name: 'Small Magic Stone',
  description: 'A faint crystal formed from a weak monster\'s essence.',
  tier: 'common',
  icon: '💠',
  sellPrice: 15,
  minFloor: 1,
  dropWeight: 200,
  category: 'gem',
};

export const MAGIC_STONE_MEDIUM: CraftingMaterial = {
  id: 'magic_stone_medium',
  name: 'Magic Stone',
  description: 'A crystallized monster essence, the standard dungeon currency.',
  tier: 'uncommon',
  icon: '💎',
  sellPrice: 50,
  minFloor: 5,
  dropWeight: 80,
  category: 'gem',
};

export const MAGIC_STONE_LARGE: CraftingMaterial = {
  id: 'magic_stone_large',
  name: 'Large Magic Stone',
  description: 'A potent crystal from a powerful monster.',
  tier: 'rare',
  icon: '💎',
  sellPrice: 150,
  minFloor: 15,
  dropWeight: 25,
  category: 'gem',
};

export const MAGIC_STONE_ELITE: CraftingMaterial = {
  id: 'magic_stone_elite',
  name: 'Elite Magic Stone',
  description: 'A brilliant crystal pulsing with concentrated monster energy.',
  tier: 'epic',
  icon: '✨',
  sellPrice: 400,
  minFloor: 25,
  dropWeight: 8,
  category: 'gem',
};

export const MAGIC_STONE_BOSS: CraftingMaterial = {
  id: 'magic_stone_boss',
  name: 'Boss Magic Stone',
  description: 'An extraordinarily rare stone from a floor guardian.',
  tier: 'legendary',
  icon: '🔮',
  sellPrice: 1000,
  minFloor: 1, // Drops from any floor boss
  dropWeight: 0, // Only drops from bosses, not random
  category: 'gem',
};

// ===== GEMS =====

export const MAGIC_CRYSTAL: CraftingMaterial = {
  id: 'magic_crystal',
  name: 'Magic Crystal',
  description: 'A crystal infused with ambient mana.',
  tier: 'uncommon',
  icon: '💎',
  sellPrice: 30,
  minFloor: 5,
  dropWeight: 40,
  category: 'gem',
};

export const SOUL_GEM: CraftingMaterial = {
  id: 'soul_gem',
  name: 'Soul Gem',
  description: 'A gem that contains trapped spiritual energy.',
  tier: 'rare',
  icon: '🔮',
  sellPrice: 150,
  minFloor: 20,
  dropWeight: 8,
  category: 'gem',
};

// ===== ALL MATERIALS =====

export const ALL_MATERIALS: CraftingMaterial[] = [
  // Metals
  IRON_INGOT,
  STEEL_INGOT,
  DAMASCUS_INGOT,
  MITHRIL_INGOT,
  ADAMANTINE_INGOT,
  // Monster drops
  MONSTER_HIDE,
  MONSTER_FANG,
  MONSTER_CLAW,
  MONSTER_ESSENCE,
  DRAGON_SCALE,
  DRAGON_HEART,
  // Magic Stones (primary currency)
  MAGIC_STONE_SMALL,
  MAGIC_STONE_MEDIUM,
  MAGIC_STONE_LARGE,
  MAGIC_STONE_ELITE,
  MAGIC_STONE_BOSS,
  // Gems
  MAGIC_CRYSTAL,
  SOUL_GEM,
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get material by ID
 */
export function getMaterialById(id: string): CraftingMaterial | undefined {
  return ALL_MATERIALS.find((m) => m.id === id);
}

/**
 * Get materials available at a floor
 */
export function getAvailableMaterials(floor: number): CraftingMaterial[] {
  return ALL_MATERIALS.filter((m) => floor >= m.minFloor);
}

/**
 * Get a random material drop for a floor
 */
export function getRandomMaterialDrop(floor: number, luckBonus: number = 0): CraftingMaterial | null {
  const available = getAvailableMaterials(floor);
  if (available.length === 0) return null;

  // Apply luck bonus to weights
  const weightedMaterials = available.map((m) => ({
    material: m,
    weight: m.dropWeight * (1 + luckBonus / 100),
  }));

  const totalWeight = weightedMaterials.reduce((sum, wm) => sum + wm.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const wm of weightedMaterials) {
    roll -= wm.weight;
    if (roll <= 0) {
      return wm.material;
    }
  }

  return available[0];
}

// ===== TIER COLORS =====

export const MATERIAL_TIER_COLORS: Record<string, string> = {
  common: '#9a9a9a',
  uncommon: '#5fa55f',
  rare: '#5b7bb8',
  epic: '#7b5fb3',
  legendary: '#c9a227',
};

// ===== MAGIC STONE DROP SYSTEM =====

/**
 * Get the appropriate magic stone based on floor and monster CR
 * All monsters drop magic stones - this is the primary income source
 *
 * IMPORTANT: Boss drops scale with floor to prevent early game gold explosion
 */
export function getMagicStoneDrop(
  floor: number,
  monsterCR: number,
  isBoss: boolean,
  isElite: boolean
): CraftingMaterial {
  // Bosses drop floor-appropriate stones (1 tier higher than regular enemies)
  // This prevents Floor 1 boss from dropping 3000g worth of gems
  if (isBoss) {
    if (floor >= 30) {
      return MAGIC_STONE_BOSS; // True boss stones only from deep floors
    } else if (floor >= 20) {
      return MAGIC_STONE_ELITE;
    } else if (floor >= 10) {
      return MAGIC_STONE_LARGE;
    } else if (floor >= 5) {
      return MAGIC_STONE_MEDIUM;
    } else {
      return MAGIC_STONE_SMALL; // Early bosses drop small stones (but more of them)
    }
  }

  // Elite monsters drop one tier higher
  const effectiveFloor = isElite ? floor + 10 : floor;
  const effectiveCR = isElite ? monsterCR + 2 : monsterCR;

  // Determine stone tier based on floor and CR
  if (effectiveFloor >= 25 || effectiveCR >= 8) {
    return MAGIC_STONE_ELITE;
  } else if (effectiveFloor >= 15 || effectiveCR >= 5) {
    return MAGIC_STONE_LARGE;
  } else if (effectiveFloor >= 5 || effectiveCR >= 2) {
    return MAGIC_STONE_MEDIUM;
  } else {
    return MAGIC_STONE_SMALL;
  }
}

/**
 * Calculate magic stone quantity based on monster power
 * Stronger monsters drop more stones
 *
 * Note: Boss bonus is now +1 (was +2) to balance early game
 */
export function getMagicStoneQuantity(
  monsterCR: number,
  isBoss: boolean,
  isElite: boolean
): number {
  let base = 1;

  // CR affects quantity
  if (monsterCR >= 5) base += 1;
  if (monsterCR >= 10) base += 1;

  // Elite/Boss bonuses (reduced boss bonus for balance)
  if (isElite) base += 1;
  if (isBoss) base += 1; // Was +2, now +1 to prevent gold explosion

  // Small random variance
  const variance = Math.random() < 0.3 ? 1 : 0;

  return base + variance;
}

/**
 * Roll for bonus material drops (category-specific materials)
 * Called in addition to magic stone drops
 */
export function rollBonusMaterialDrop(
  floor: number,
  _monsterCategory: string,
  luckBonus: number = 0
): CraftingMaterial | null {
  // 25% base chance + luck bonus
  const dropChance = 0.25 + (luckBonus / 200);
  if (Math.random() > dropChance) return null;

  // Get floor-appropriate materials
  const available = getAvailableMaterials(floor).filter(
    m => !m.id.startsWith('magic_stone') // Exclude magic stones
  );

  if (available.length === 0) return null;

  // Weight by dropWeight
  const totalWeight = available.reduce((sum, m) => sum + m.dropWeight, 0);
  let roll = Math.random() * totalWeight;

  for (const material of available) {
    roll -= material.dropWeight;
    if (roll <= 0) return material;
  }

  return available[0];
}
