import type { BaseWeapon } from '../../types/Weapon';

export const LCK_WEAPONS: BaseWeapon[] = [
  // ── LEVEL 1 ──
  { id: 'lck_l1_loaded_dice', name: 'Loaded Dice', category: 'LCK', damageTypes: ['magic'], baseDamage: 5, baseAccuracy: 75, baseCritChance: 25, attackSpeed: 1.3, range: 'ranged', twoHanded: false, requirements: [], minLevel: 1 },
  { id: 'lck_l1_coin_launcher', name: 'Coin Launcher', category: 'LCK', damageTypes: ['pierce'], baseDamage: 7, baseAccuracy: 78, baseCritChance: 22, attackSpeed: 1.2, range: 'ranged', twoHanded: false, requirements: [], minLevel: 1 },

  // ── LEVEL 2 ──
  { id: 'lck_l2_chaos_blade', name: 'Chaos Blade', category: 'LCK', damageTypes: ['slash', 'dark'], baseDamage: 10, baseAccuracy: 70, baseCritChance: 20, attackSpeed: 1.0, range: 'melee', twoHanded: false, requirements: [], minLevel: 2 },
  { id: 'lck_l2_wild_card', name: 'Wild Card', category: 'LCK', damageTypes: ['magic'], baseDamage: 8, baseAccuracy: 72, baseCritChance: 30, attackSpeed: 1.1, range: 'ranged', twoHanded: false, requirements: [], minLevel: 2 },

  // ── LEVEL 3 ──
  { id: 'lck_l3_fortune_blade', name: 'Fortune Blade', category: 'LCK', damageTypes: ['slash', 'magic'], baseDamage: 9, baseAccuracy: 74, baseCritChance: 26, attackSpeed: 1.15, range: 'melee', twoHanded: false, requirements: [], minLevel: 3, specialMechanic: 'Damage is randomly ×0.5, ×1, ×2, or ×3 each hit' },
  { id: 'lck_l3_rigged_arrow', name: 'Rigged Arrow', category: 'LCK', damageTypes: ['pierce'], baseDamage: 8, baseAccuracy: 76, baseCritChance: 24, attackSpeed: 1.2, range: 'ranged', twoHanded: false, requirements: [], minLevel: 3 },

  // ── LEVEL 4 ──
  { id: 'lck_l4_gamblers_knife', name: "Gambler's Knife", category: 'LCK', damageTypes: ['pierce'], baseDamage: 10, baseAccuracy: 80, baseCritChance: 28, attackSpeed: 1.4, range: 'melee', twoHanded: false, requirements: [], minLevel: 4, specialMechanic: 'On kill: 50% chance to double all rewards, 50% chance to halve them' },
  { id: 'lck_l4_probability_cannon', name: 'Probability Cannon', category: 'LCK', damageTypes: ['magic'], baseDamage: 12, baseAccuracy: 68, baseCritChance: 32, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 4 },

  // ── LEVEL 5 ──
  { id: 'lck_l5_cursed_die', name: 'Cursed Die', category: 'LCK', damageTypes: ['magic', 'dark'], baseDamage: 8, baseAccuracy: 72, baseCritChance: 35, attackSpeed: 1.1, range: 'ranged', twoHanded: false, requirements: [], minLevel: 5, specialMechanic: 'Randomly applies one of: Bleed, Poison, Burn, Freeze, or Fear each hit' },
  { id: 'lck_l5_lucky_star', name: 'Lucky Star', category: 'LCK', damageTypes: ['pierce', 'magic'], baseDamage: 11, baseAccuracy: 76, baseCritChance: 30, attackSpeed: 1.3, range: 'ranged', twoHanded: false, requirements: [], minLevel: 5 },

  // ── LEVEL 6 ──
  { id: 'lck_l6_roulette_blade', name: 'Roulette Blade', category: 'LCK', damageTypes: ['slash', 'magic'], baseDamage: 14, baseAccuracy: 70, baseCritChance: 32, attackSpeed: 1.1, range: 'melee', twoHanded: false, requirements: [], minLevel: 6 },
  { id: 'lck_l6_chaos_cannon', name: 'Chaos Cannon', category: 'LCK', damageTypes: ['magic'], baseDamage: 16, baseAccuracy: 65, baseCritChance: 28, attackSpeed: 0.85, range: 'ranged', twoHanded: true, requirements: [], minLevel: 6, specialMechanic: 'Damage multiplied by a random factor between 0.1× and 5×' },

  // ── LEVEL 7 ──
  { id: 'lck_l7_fate_spinner', name: 'Fate Spinner', category: 'LCK', damageTypes: ['magic', 'dark'], baseDamage: 12, baseAccuracy: 74, baseCritChance: 36, attackSpeed: 1.2, range: 'ranged', twoHanded: false, requirements: [], minLevel: 7 },
  { id: 'lck_l7_devils_hand', name: "Devil's Hand", category: 'LCK', damageTypes: ['slash', 'dark'], baseDamage: 15, baseAccuracy: 68, baseCritChance: 40, attackSpeed: 1.0, range: 'melee', twoHanded: false, requirements: [], minLevel: 7, specialMechanic: 'Critical hits cascade: 50% chance each additional hit also crits (up to 3 total)' },

  // ── LEVEL 8 ──
  { id: 'lck_l8_jackpot_gun', name: 'Jackpot Gun', category: 'LCK', damageTypes: ['pierce', 'magic'], baseDamage: 14, baseAccuracy: 72, baseCritChance: 38, attackSpeed: 1.1, range: 'ranged', twoHanded: false, requirements: [], minLevel: 8 },
  { id: 'lck_l8_chaos_engine', name: 'Chaos Engine', category: 'LCK', damageTypes: ['magic'], baseDamage: 18, baseAccuracy: 62, baseCritChance: 34, attackSpeed: 0.9, range: 'ranged', twoHanded: true, requirements: [], minLevel: 8, specialMechanic: 'Each attack deals 1–500% of stated damage with equal probability' },

  // ── LEVEL 9 — UNIQUE ★ ──
  { id: 'lck_l9_fates_chosen', name: "Fate's Chosen", category: 'LCK', damageTypes: ['magic', 'dark'], baseDamage: 20, baseAccuracy: 80, baseCritChance: 45, attackSpeed: 1.2, range: 'ranged', twoHanded: false, requirements: [], minLevel: 9, isUnique: true, specialMechanic: 'Before each attack, fate chooses: triple damage (20%), normal (30%), miss (20%), self-heal (20%), or instant kill (10%). Odds cannot be modified.' },

  // ── LEVEL 10 — UNIQUE ★ ──
  { id: 'lck_l10_the_house_always_wins', name: 'The House Always Wins', category: 'LCK', damageTypes: ['magic', 'dark'], baseDamage: 24, baseAccuracy: 75, baseCritChance: 50, attackSpeed: 1.0, range: 'ranged', twoHanded: true, requirements: [], minLevel: 10, isUnique: true, specialMechanic: 'Every attack rolls a slot machine. Three matching symbols: jackpot (×10 damage + instant kill). Two matching: bonus effect. No match: miss but gain 10 gold.' },
];
