import type { SacredItem, PantheonSet } from '../../../types/SacredItem';

// ===== EGYPTIAN PANTHEON — "Instruments of Ma'at" =====
// Philosophy: Balance, truth, the weighing of hearts. Ma'at's scales weigh more than
// hearts — they weigh every choice made in darkness.
// Full set bonus: each boss killed permanently increases ALL base stats.

export const EGYPTIAN_PIECES: SacredItem[] = [
  {
    id: 'egypt_accessory_eye_ra',
    name: 'Eye of Ra',
    lore: 'It burned the world once. It is being polite now.',
    tier: 'pantheon', slot: 'accessory',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 0,
    revealFavorRequired: 30,
    acquisitionHint: 'Ra sees truth through fire. Pass the fire five times in a row.',
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'event_success', value: 5, targetType: 'WIS_or_INT_check', description: '5 consecutive event rooms passed with WIS or INT stat checks' },
      ],
      requireAll: true,
    },
    passiveId: 'solar_fire',
    passiveDescription: 'INT-scaling attacks have +20% chance to apply burn dealing 8% max HP/turn.',
    accessoryStats: {
      accessoryType: 'amulet',
      statBonuses: { INT: 25, WIS: 20 },
    },
  },
  {
    id: 'egypt_helm_pharaoh',
    name: 'Crown of the Pharaoh',
    lore: 'This is not a crown. It is a contract.',
    tier: 'pantheon', slot: 'head',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 1,
    revealFavorRequired: 30,
    acquisitionHint: 'Ma\'at weighs ambition. The Pharaoh chose only the highest path — never the easy road.',
    isSecret: false,
    acquisition: {
      scope: 'single_character',
      requirements: [
        { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
        { metric: 'achievements_total', value: 0, targetType: 'never_standard', description: 'Never select a STANDARD tier achievement in any level-up ceremony on this character' },
      ],
      requireAll: true,
    },
    passiveId: 'divine_authority',
    passiveDescription: 'CHA-based actions (Taunt) have 25% higher success rate. Enemies are 15% less likely to attack first on entering a combat room.',
    armorStats: {
      slot: 'head', armorType: 'divine',
      finalDefense: 45, finalMagicDefense: 45, speedPenalty: 0,
      statBonuses: { CHA: 20, WIS: 20 },
    },
  },
  {
    id: 'egypt_hands_anubis',
    name: 'Gauntlets of Anubis',
    lore: 'The scales tip toward the honest blade.',
    tier: 'pantheon', slot: 'hands',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 2,
    revealFavorRequired: 60,
    acquisitionHint: 'Anubis judged the dead. Prove your blade judges the undead.',
    isSecret: false,
    acquisition: {
      scope: 'lifetime',
      requirements: [
        { metric: 'kills_type', value: 50, targetType: 'undead', description: 'Kill 50 undead-type enemies lifetime (Skeleton, Zombie, Ghost, Wraith, Lich, Death Knight)' },
      ],
      requireAll: true,
    },
    passiveId: 'feather_weight',
    passiveDescription: "If you never fled, never used healing consumables, AND landed every attack in a fight: the killing blow deals 50% bonus damage — the scales tip in your favor.",
    armorStats: {
      slot: 'hands', armorType: 'divine',
      finalDefense: 38, finalMagicDefense: 38, speedPenalty: 0,
      statBonuses: { WIS: 20, STR: 20 },
    },
  },
  {
    id: 'egypt_chest_osiris',
    name: 'Breastplate of Osiris',
    lore: 'He was killed, scattered, and remade. So was this.',
    tier: 'pantheon', slot: 'chest',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 3,
    revealFavorRequired: 60,
    acquisitionHint: "Osiris was destroyed and returned. Prove the same understanding — walk past death three times.",
    isSecret: false,
    acquisition: {
      scope: 'lifetime',
      requirements: [
        { metric: 'boss_bypass', value: 3, description: "Earn the 'boss_bypassed' run flag (talk past a boss) on 3 separate bosses total lifetime" },
      ],
      requireAll: true,
    },
    passiveId: 'green_resurrection',
    passiveDescription: 'Once per run, when you fall below 5% HP, fully heal to 30% HP and clear all negative status effects.',
    armorStats: {
      slot: 'chest', armorType: 'divine',
      finalDefense: 72, finalMagicDefense: 58, speedPenalty: 0,
      statBonuses: { END: 30 },
    },
  },
  {
    id: 'egypt_legs_thoth',
    name: 'Sandals of Thoth',
    lore: 'Knowledge is the only weapon that does not wear out.',
    tier: 'pantheon', slot: 'legs',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 4,
    revealFavorRequired: 80,
    acquisitionHint: "Thoth wrote down everything. Observe every enemy on an entire floor before drawing a single drop of blood — Floor 10 or deeper.",
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'floors_reached', value: 10, description: 'The floor must be Floor 10+' },
        { metric: 'observe_total', value: 1, targetType: 'all_enemies_before_first_kill', description: 'Observe EVERY enemy on a floor before killing any of them' },
      ],
      requireAll: true,
    },
    passiveId: 'written_law',
    passiveDescription: "Once per floor, 'inscribe' an enemy: inscribed enemies take 25% extra damage from all sources and their special abilities are partially suppressed.",
    armorStats: {
      slot: 'legs', armorType: 'robes',
      finalDefense: 30, finalMagicDefense: 60, speedPenalty: 0,
      statBonuses: { INT: 25, WIS: 25, PER: 15 },
    },
  },
  {
    id: 'egypt_accessory_isis',
    name: 'Amulet of Isis',
    lore: 'She rebuilt what the desert scattered. She can rebuild you.',
    tier: 'pantheon', slot: 'accessory',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 5,
    revealFavorRequired: 80,
    acquisitionHint: 'Isis mastered the Falna before Falna had a name. Show her you understand what growth really means.',
    isSecret: false,
    acquisition: {
      scope: 'single_character',
      requirements: [
        { metric: 'level_reached', value: 1, targetType: 'blessing_rite_triple_grade', description: 'In a single Blessing Rite ceremony, have at least 3 stats advance a full grade' },
      ],
      requireAll: true,
    },
    passiveId: 'wings_of_isis',
    passiveDescription: 'Once per dungeon run, convert 50% of your current SP into HP. +15% all healing received.',
    accessoryStats: {
      accessoryType: 'talisman',
      statBonuses: { WIS: 25, CHA: 20 },
    },
  },
  {
    id: 'egypt_weapon_khopesh',
    name: 'Khopesh of Set',
    lore: "Set killed his brother to rule alone. The blade doesn't care who it serves.",
    tier: 'pantheon', slot: 'weapon',
    pantheonId: 'egyptian', setId: 'egypt_maat', setPieceIndex: 6,
    revealFavorRequired: 80,
    acquisitionHint: "Set was the god of chaos and the desert. Prove your nature: fight the domain that opposes your patron deity's domain and win — utterly.",
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'kills_type', value: 25, targetType: 'opposite_domain_enemies', description: "Kill 25 enemies of the domain opposite to your patron deity's domain in a single run" },
      ],
      requireAll: true,
    },
    passiveId: 'chaos_blade',
    passiveDescription: 'Each time you take damage in a fight, your next attack is +5% stronger (stacks up to +50%, resets per fight). +20% damage to enemies of opposite domain to your patron.',
    weaponStats: {
      scalingStat: 'STR', secondaryStat: 'AGI',
      finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.30,
      range: 'melee', damageType: 'chaos',
    },
  },
];

export const EGYPTIAN_SET: PantheonSet = {
  id: 'egypt_maat',
  name: "Instruments of Ma'at",
  pantheonId: 'egyptian',
  lore: "Ma'at's scales weigh more than hearts. They weigh every choice made in the dark. These instruments are given only when the scales have been satisfied.",
  pieces: EGYPTIAN_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: "Scribe's Eye", bonusDescription: '+20% all WIS and INT proficiency gains.', passiveId: 'scribes_eye' },
    { piecesRequired: 4, bonusName: 'Weighing of Hearts', bonusDescription: "Entering combat with 'clean approach' (no fleeing, no failed actions in the last 3 rooms) grants +20% damage for the entire fight.", passiveId: 'weighing_hearts' },
    { piecesRequired: 7, bonusName: "Ma'at's Judgment", bonusDescription: 'Each milestone boss defeated permanently increases ALL base stats by +3 on this character.', passiveId: 'maat_judgment' },
  ],
};
