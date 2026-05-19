import type { SacredItem, PantheonSet } from '../../../types/SacredItem';

// ===== GREEK PANTHEON — "Arms of Olympus" =====
// Philosophy: The Olympians reward heroic trials. These pieces represent
// the Twelve Labors reimagined as dungeon challenges.
// Full set bonus grants a death save — even the Underworld negotiates with Olympians.

export const GREEK_PIECES: SacredItem[] = [
  {
    id: 'greek_ring_oracle',
    name: 'Ring of the Oracle',
    lore: 'Delphi was consulted for every great decision. This ring listens.',
    tier: 'pantheon', slot: 'accessory',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 0,
    revealFavorRequired: 30,
    acquisitionHint: 'She sees those who seek to understand before they act.',
    isSecret: false,
    acquisition: {
      scope: 'lifetime',
      requirements: [{ metric: 'observe_total', value: 30, description: 'Observe 30 enemies total lifetime' }],
      requireAll: true,
    },
    passiveId: 'prophecy_sense',
    passiveDescription: 'Once per floor, gain a free Observe that costs no turn.',
    accessoryStats: {
      accessoryType: 'ring',
      statBonuses: { WIS: 20, PER: 20 },
    },
  },
  {
    id: 'greek_helm_twelve',
    name: 'Helm of the Twelve',
    lore: 'Twelve trials. None of them rest.',
    tier: 'pantheon', slot: 'head',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 1,
    revealFavorRequired: 30,
    acquisitionHint: 'The Twelve watched those who fought as heroes did: without cover and without flinching.',
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'consecutive_fights', value: 12, targetType: 'no_defend_no_stun', description: '12 consecutive fights with no Defend used and no Stun received' },
      ],
      requireAll: true,
    },
    passiveId: 'olympian_fury',
    passiveDescription: 'Your first critical hit each combat deals 3× damage instead of 2×.',
    armorStats: {
      slot: 'head', armorType: 'divine',
      finalDefense: 45, finalMagicDefense: 30, speedPenalty: 0,
      statBonuses: { STR: 25, AGI: 20 },
    },
  },
  {
    id: 'greek_amulet_aegis',
    name: 'Aegis Shard',
    lore: "Half of the shield remains in the Tower. You found the half that still works.",
    tier: 'pantheon', slot: 'accessory',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 2,
    revealFavorRequired: 60,
    acquisitionHint: "The shield of Athena never yielded. Prove you understand what that means.",
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'boss_nodamage', value: 1, description: 'Take 0 damage in a milestone boss fight (Floor 5+)' },
      ],
      requireAll: true,
    },
    passiveId: 'gorgon_ward',
    passiveDescription: 'Once per combat, the first hit that would deal >20% of your max HP is completely nullified.',
    accessoryStats: {
      accessoryType: 'talisman',
      statBonuses: { END: 20, WIS: 15 },
    },
  },
  {
    id: 'greek_gauntlets_ares',
    name: 'Gauntlets of Ares',
    lore: 'They do not wash off.',
    tier: 'pantheon', slot: 'hands',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 3,
    revealFavorRequired: 60,
    acquisitionHint: 'War demands purity of method. Kill only with the oldest weapons — no magic, no tricks, no mercy.',
    isSecret: false,
    acquisition: {
      scope: 'single_character',
      requirements: [
        { metric: 'kills_with_stat', value: 75, targetType: 'STR', description: 'Kill 75 enemies with STR weapons on one character' },
        { metric: 'skill_uses', value: 0, targetType: 'magic_category', description: 'Never use a magic-category skill on this character' },
      ],
      requireAll: true,
    },
    passiveId: 'bloodlust_stack',
    passiveDescription: 'Each kill in the same combat room stacks +3% damage (max +18%, resets per room).',
    armorStats: {
      slot: 'hands', armorType: 'heavy',
      finalDefense: 40, finalMagicDefense: 10, speedPenalty: 0,
      statBonuses: { STR: 30 },
    },
  },
  {
    id: 'greek_chest_hephaestus',
    name: 'Cuirass of Hephaestus',
    lore: 'Forged for a warrior not yet born.',
    tier: 'pantheon', slot: 'chest',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 4,
    revealFavorRequired: 60,
    acquisitionHint: "Hephaestus made perfect things. Honor his craft by using it — push any weapon to its absolute limit.",
    isSecret: false,
    acquisition: {
      scope: 'lifetime',
      requirements: [
        { metric: 'weapon_legendary', value: 1, description: 'Upgrade any weapon to Legendary quality at the Blacksmith' },
      ],
      requireAll: true,
    },
    passiveId: 'divine_craft',
    passiveDescription: 'Your equipped weapon gains +2 flat damage per Blacksmith upgrade you have ever performed (lifetime).',
    armorStats: {
      slot: 'chest', armorType: 'divine',
      finalDefense: 75, finalMagicDefense: 45, speedPenalty: 0,
      statBonuses: { END: 35 },
    },
  },
  {
    id: 'greek_legs_hermes',
    name: 'Greaves of Hermes',
    lore: 'He delivered the message. Then he delivered the messenger.',
    tier: 'pantheon', slot: 'legs',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 5,
    revealFavorRequired: 80,
    acquisitionHint: 'The Messenger God valued speed above pride. Retreat from the strong. Return for the kill.',
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'flee_elite', value: 1, description: 'Successfully flee from an elite enemy' },
        { metric: 'kills_type', value: 1, targetType: 'previously_fled', description: 'Return to that same room and kill the enemy you fled from' },
      ],
      requireAll: true,
    },
    passiveId: 'messengers_step',
    passiveDescription: 'Flee attempts always succeed on the first try (once per combat). Moving between rooms costs no satiation.',
    armorStats: {
      slot: 'legs', armorType: 'light',
      finalDefense: 35, finalMagicDefense: 35, speedPenalty: 0,
      statBonuses: { AGI: 25 },
    },
  },
  {
    id: 'greek_weapon_thunderbolt',
    name: 'Thunderbolt of Olympus',
    lore: 'It is borrowed. Even the gods only borrow it.',
    tier: 'pantheon', slot: 'weapon',
    pantheonId: 'greek', setId: 'greek_olympian', setPieceIndex: 6,
    revealFavorRequired: 80,
    acquisitionHint: "Zeus gives nothing to those who do not prove themselves worthy of being given nothing. Complete what the Olympians demand first.",
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'boss_kills_run', value: 3, description: 'Defeat the Floor 5, 10, AND 15 bosses in a single run' },
        { metric: 'floor_noretreat', value: 1, description: 'Never flee from any combat in this run' },
        { metric: 'boss_nodamage', value: 1, description: 'At least one of those boss fights taken with 0 damage received' },
      ],
      requireAll: true,
    },
    passiveId: 'lightning_incarnate',
    passiveDescription: 'Every 5th attack releases chain lightning: hits the enemy twice, 40% chance to stun. After defeating any boss, your next attack is a guaranteed triple-damage critical.',
    weaponStats: {
      scalingStat: 'STR', secondaryStat: 'INT',
      finalDamage: 55, finalAccuracy: 95, finalCritChance: 0.35,
      range: 'melee', damageType: 'holy',
    },
  },
];

export const GREEK_SET: PantheonSet = {
  id: 'greek_olympian',
  name: 'Arms of Olympus',
  pantheonId: 'greek',
  lore: 'When the Twelve made war upon the Titans, these were the instruments of their victory. They were scattered after — hidden on floors that mirror the Twelve Labors.',
  pieces: GREEK_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Olympic Ambition', bonusDescription: '+15% all stat proficiency gains.', passiveId: 'olympic_ambition' },
    { piecesRequired: 4, bonusName: 'Heroic Resolve', bonusDescription: 'Entering combat below 30% HP triggers +50% physical damage for 3 turns.', passiveId: 'heroic_resolve' },
    { piecesRequired: 7, bonusName: 'Divine Ascension', bonusDescription: 'Once per run, when reduced to 0 HP, survive at 1 HP (Hades refuses you this once).', passiveId: 'divine_ascension' },
  ],
};
