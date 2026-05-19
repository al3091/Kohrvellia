/**
 * Sacred Item Conversion Utilities
 *
 * Converts SacredItem data into equippable Weapon / Armor / Accessory instances.
 * Sacred items use pre-calculated final stats so the complex material/quality
 * pipeline is bypassed — they arrive fully formed.
 */

import type { Weapon, BaseWeapon, DamageType } from '../types/Weapon';
import type { Armor, BaseArmor, Accessory, AccessoryEffect } from '../types/Armor';
import type { SacredItem } from '../types/SacredItem';
import type { StatName } from '../types/Stats';

// ──────────────────────────────────────────────────────────────────────────────
// Divine material / quality stubs — sacred items bypass the normal tiers
// ──────────────────────────────────────────────────────────────────────────────

const DIVINE_MATERIAL = {
  id: 'divine', name: 'Divine', tier: 'legendary' as const,
  damageModifier: 1.0, durabilityModifier: 2.0, weightModifier: 0.5,
  minFloor: 1, description: 'Blessed by the gods themselves.',
};

const SACRED_QUALITY = {
  id: 'sacred', name: 'Sacred', tier: 'legendary' as const,
  accuracyModifier: 0.10, critModifier: 0.25, damageModifier: 0.20, minFloor: 1,
};

// ──────────────────────────────────────────────────────────────────────────────
// Weapon conversion
// ──────────────────────────────────────────────────────────────────────────────

const WEAPON_CATEGORY_MAP: Record<string, string> = {
  STR: 'STR', AGI: 'AGI', INT: 'INT', WIS: 'WIS',
  END: 'END', CHA: 'CHA', PER: 'PER', LCK: 'LCK',
};

export function sacredItemToWeapon(item: SacredItem): Weapon {
  if (!item.weaponStats) throw new Error(`Sacred item ${item.id} has no weaponStats`);
  const ws = item.weaponStats;

  // Map sacred damage type to DamageType
  const DAMAGE_MAP: Record<string, DamageType> = {
    physical: 'slash', magic: 'magic', holy: 'holy', dark: 'dark', chaos: 'dark',
  };
  const mappedDamageType: DamageType = DAMAGE_MAP[ws.damageType] ?? 'slash';

  const base: BaseWeapon = {
    id: `base_${item.id}`,
    name: item.name,
    category: (WEAPON_CATEGORY_MAP[ws.scalingStat] ?? 'STR') as never,
    damageTypes: [mappedDamageType],
    baseDamage: ws.finalDamage,
    baseAccuracy: ws.finalAccuracy,
    baseCritChance: ws.finalCritChance,
    attackSpeed: 1.0,
    range: ws.range,
    twoHanded: false,
    requirements: [],
    isUnique: true,
    specialMechanic: item.passiveDescription,
  };

  return {
    id: item.id,
    base,
    material: DIVINE_MATERIAL as never,
    quality: SACRED_QUALITY as never,
    finalDamage: ws.finalDamage,
    finalAccuracy: ws.finalAccuracy,
    finalCritChance: ws.finalCritChance,
    displayName: item.name,
    rarity: 'legendary' as const,
    floorFound: -1,
    identified: true,
    maxOutputCap: ws.finalDamage * 5, // generous cap for sacred weapons
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Armor conversion
// ──────────────────────────────────────────────────────────────────────────────

export function sacredItemToArmor(item: SacredItem): Armor {
  if (!item.armorStats) throw new Error(`Sacred item ${item.id} has no armorStats`);
  const as_ = item.armorStats;

  const base: BaseArmor = {
    id: `base_${item.id}`,
    name: item.name,
    slot: as_.slot,
    type: (as_.armorType === 'divine' ? 'medium' : (as_.armorType ?? 'medium')) as import('../types/Armor').ArmorType,
    baseDefense: as_.finalDefense,
    baseMagicDefense: as_.finalMagicDefense,
    weight: 0,
  };

  return {
    id: item.id,
    base,
    material: DIVINE_MATERIAL as never,
    quality: SACRED_QUALITY as never,
    finalDefense: as_.finalDefense,
    finalMagicDefense: as_.finalMagicDefense,
    speedPenalty: as_.speedPenalty ?? 0,
    dodgePenalty: 0,
    displayName: item.name,
    rarity: 'legendary' as const,
    floorFound: -1,
    identified: true,
    statBonuses: as_.statBonuses ?? {},
  } as Armor & { statBonuses: Partial<Record<StatName, number>> };
}

// ──────────────────────────────────────────────────────────────────────────────
// Accessory conversion
// ──────────────────────────────────────────────────────────────────────────────

export function sacredItemToAccessory(item: SacredItem): Accessory {
  if (!item.accessoryStats) throw new Error(`Sacred item ${item.id} has no accessoryStats`);
  const acs = item.accessoryStats;

  // Convert statBonuses map → AccessoryEffect[] entries
  const statEffects: AccessoryEffect[] = Object.entries(acs.statBonuses ?? {}).map(
    ([stat, value]) => ({
      type: 'stat_boost' as const,
      stat,
      value: value as number,
      description: `+${value} ${stat}`,
    })
  );

  // Passive effect as a special AccessoryEffect for display
  const passiveEffect: AccessoryEffect = {
    type: 'special' as const,
    value: 0,
    description: item.passiveDescription,
  };

  return {
    id: item.id,
    name: item.name,
    type: normalizeAccessoryType(acs.accessoryType),
    effects: [...statEffects, passiveEffect],
    rarity: 'legendary' as const,
    floorFound: -1,
    identified: true,
    loreText: item.lore,
  };
}

function normalizeAccessoryType(t: string): 'ring' | 'amulet' | 'charm' | 'belt' | 'cloak' {
  if (t === 'ring') return 'ring';
  if (t === 'amulet') return 'amulet';
  if (t === 'charm') return 'charm';
  if (t === 'seal' || t === 'talisman') return 'belt'; // closest mapping
  return 'amulet';
}

// ──────────────────────────────────────────────────────────────────────────────
// Generic converter — dispatches by slot
// ──────────────────────────────────────────────────────────────────────────────

export function convertSacredItemToEquippable(
  item: SacredItem
): { type: 'weapon'; data: Weapon } | { type: 'armor'; data: Armor } | { type: 'accessory'; data: Accessory } {
  if (item.slot === 'weapon') return { type: 'weapon', data: sacredItemToWeapon(item) };
  if (item.slot === 'accessory') return { type: 'accessory', data: sacredItemToAccessory(item) };
  return { type: 'armor', data: sacredItemToArmor(item) };
}

// ──────────────────────────────────────────────────────────────────────────────
// Get stat bonuses from ALL equipped accessories (for derived stats calc)
// ──────────────────────────────────────────────────────────────────────────────

export function getAccessoryStatBonuses(
  equipment: import('../types/Armor').Equipment
): Partial<Record<StatName, number>> {
  const bonuses: Partial<Record<StatName, number>> = {};

  const slots = [equipment.accessory1, equipment.accessory2] as (import('../types/Armor').Accessory | null)[];
  for (const acc of slots) {
    if (!acc) continue;
    for (const effect of acc.effects) {
      if (effect.type === 'stat_boost' && effect.stat) {
        const stat = effect.stat as StatName;
        bonuses[stat] = (bonuses[stat] ?? 0) + effect.value;
      }
    }
  }
  return bonuses;
}

// ──────────────────────────────────────────────────────────────────────────────
// Get stat bonuses from ALL equipped armor pieces (for sacred armor stat bonuses)
// ──────────────────────────────────────────────────────────────────────────────

export function getArmorStatBonuses(
  equipment: import('../types/Armor').Equipment
): Partial<Record<StatName, number>> {
  const bonuses: Partial<Record<StatName, number>> = {};
  const slots = [equipment.head, equipment.chest, equipment.hands, equipment.legs] as
    (import('../types/Armor').Armor | null)[];

  for (const armor of slots) {
    if (!armor) continue;
    const armorWithBonuses = armor as Armor & { statBonuses?: Partial<Record<StatName, number>> };
    if (armorWithBonuses.statBonuses) {
      for (const [stat, value] of Object.entries(armorWithBonuses.statBonuses)) {
        bonuses[stat as StatName] = (bonuses[stat as StatName] ?? 0) + (value as number);
      }
    }
  }
  return bonuses;
}
