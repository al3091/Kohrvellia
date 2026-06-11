import { MAGICAL_WEAPON_CATEGORIES, HYBRID_MIXED_CATEGORIES } from '../types/Weapon';
import type { DamageType } from '../types/Weapon';

const MAGICAL_DAMAGE_TYPES = new Set<DamageType>([
  'magic', 'holy', 'fire', 'ice', 'lightning', 'dark',
]);

export interface WeaponFormulaProfile {
  attackPool: 'physical' | 'magical' | 'luck' | 'hybrid';
  defenseTarget: 'physDef' | 'magDef';
  pierceType: 'armorPierce' | 'spellPierce';
}

/**
 * Derives the combat formula profile for a weapon from its category and primary damage type.
 * Category alone determines the attack pool; damage type additionally determines defense target
 * for LCK and hybrid weapons (e.g. Loaded Dice uses magDef, not physDef).
 */
export function resolveWeaponFormula(
  category: string,
  primaryDamageType: DamageType | undefined,
): WeaponFormulaProfile {
  // Node 1: LCK — attack pool is luck; defense follows damage type
  if (category === 'LCK') {
    const isMagicDmg = primaryDamageType !== undefined && MAGICAL_DAMAGE_TYPES.has(primaryDamageType);
    return {
      attackPool: 'luck',
      defenseTarget: isMagicDmg ? 'magDef' : 'physDef',
      pierceType: isMagicDmg ? 'spellPierce' : 'armorPierce',
    };
  }
  // Node 2: Pure magical categories (INT, WIS, INT_WIS)
  if (MAGICAL_WEAPON_CATEGORIES.has(category)) {
    return { attackPool: 'magical', defenseTarget: 'magDef', pierceType: 'spellPierce' };
  }
  // Node 2b: Hybrid mixed categories (physical + magical split)
  if (HYBRID_MIXED_CATEGORIES.has(category)) {
    const isMagicDmg = primaryDamageType !== undefined && MAGICAL_DAMAGE_TYPES.has(primaryDamageType);
    return {
      attackPool: 'hybrid',
      defenseTarget: isMagicDmg ? 'magDef' : 'physDef',
      pierceType: isMagicDmg ? 'spellPierce' : 'armorPierce',
    };
  }
  // Node 3: Pure physical categories (STR, AGI, PER, END, CHA, hybrid-physical pairs)
  return { attackPool: 'physical', defenseTarget: 'physDef', pierceType: 'armorPierce' };
}
