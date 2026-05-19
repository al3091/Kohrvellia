import type { SacredItem, PantheonSet } from '../../../types/SacredItem';

// ===== NORSE PANTHEON — "Wyrd's Legacy" =====
// Philosophy: The Aesir respect those who fight knowing death is coming — and advance anyway.
// These items reward near-death mastery, sacrifice, and relentless forward motion.
// Full set bonus: raise an Einherjar ghost companion after each boss kill.

export const NORSE_PIECES: SacredItem[] = [
  {
    id: 'norse_accessory_eye',
    name: 'Eye of Odin',
    lore: 'It looks back.',
    tier: 'pantheon', slot: 'accessory',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 0,
    revealFavorRequired: 30,
    acquisitionHint: 'Odin gave his eye for knowledge. He expects you to similarly value understanding over action.',
    isSecret: false,
    acquisition: {
      scope: 'lifetime',
      requirements: [{ metric: 'observe_total', value: 100, description: 'Use the Observe action 100 times lifetime' }],
      requireAll: true,
    },
    passiveId: 'all_seeing',
    passiveDescription: 'Observing an enemy permanently marks its weakness type for all future characters. Also reveals resistances without requiring Observe in combat.',
    accessoryStats: {
      accessoryType: 'amulet',
      statBonuses: { WIS: 25, PER: 20 },
    },
  },
  {
    id: 'norse_helm_slain',
    name: 'Helm of the Slain',
    lore: 'The All-Father collects the fallen. He appreciates the effort.',
    tier: 'pantheon', slot: 'head',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 1,
    revealFavorRequired: 30,
    acquisitionHint: 'Odin values those who learn from the battlefield — not just those who survive it.',
    isSecret: false,
    acquisition: {
      scope: 'single_character',
      requirements: [{ metric: 'level_reached', value: 3, description: 'Die at least once but still reach Level 3 on the same character' }],
      requireAll: true,
    },
    passiveId: 'einherjars_will',
    passiveDescription: 'When you fall below 20% HP, gain +25% all damage for the rest of the fight.',
    armorStats: {
      slot: 'head', armorType: 'heavy',
      finalDefense: 50, finalMagicDefense: 25, speedPenalty: 0,
      statBonuses: { STR: 20, END: 15 },
    },
  },
  {
    id: 'norse_chest_serpent',
    name: 'Mail of the World-Serpent',
    lore: "The Serpent's skin. Claimed by outlasting its owner.",
    tier: 'pantheon', slot: 'chest',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 2,
    revealFavorRequired: 60,
    acquisitionHint: 'Jormungandr poisoned Mjolnir. Prove you can outlast what poisons you.',
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'status_received_survived', value: 10, targetType: 'poison', description: '10 poison effects tick to completion in a single run (no antidote cures)' },
      ],
      requireAll: true,
    },
    passiveId: 'jormungandr_hide',
    passiveDescription: 'Poison effects on you are halved in damage but doubled in duration. Each poison tick builds +1% physical resistance (max +20% per combat).',
    armorStats: {
      slot: 'chest', armorType: 'divine',
      finalDefense: 70, finalMagicDefense: 55, speedPenalty: 0,
      statBonuses: { END: 30 },
    },
  },
  {
    id: 'norse_hands_valkyrie',
    name: 'Gloves of the Valkyrie',
    lore: 'She chose you. Repeatedly.',
    tier: 'pantheon', slot: 'hands',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 3,
    revealFavorRequired: 60,
    acquisitionHint: 'The Valkyrie only take the battle-worthy. Prove the battle cannot end you.',
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'boss_kills_run', value: 5, description: 'Defeat 5 milestone bosses in a single run (requires reaching Floor 25+)' },
      ],
      requireAll: true,
    },
    passiveId: 'chooser_of_slain',
    passiveDescription: 'Defeating a boss or elite while below 30% HP grants double stat proficiency from that fight.',
    armorStats: {
      slot: 'hands', armorType: 'divine',
      finalDefense: 40, finalMagicDefense: 20, speedPenalty: 0,
      statBonuses: { STR: 25, AGI: 20 },
    },
  },
  {
    id: 'norse_legs_skidbladnir',
    name: "Boots of Skíðblaðnir",
    lore: 'Folds to pocket size. Unfolds to carry everything.',
    tier: 'pantheon', slot: 'legs',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 4,
    revealFavorRequired: 80,
    acquisitionHint: "The magic ship needed no wind. You need no map. Reach Floor 10 without triggering a single trap.",
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
        { metric: 'status_received_survived', value: 0, targetType: 'trap_damage', description: 'Take zero trap damage the entire run' },
      ],
      requireAll: true,
    },
    passiveId: 'folding_ship',
    passiveDescription: 'On entering a new floor, gain a free Observe against the first enemy you encounter. Moving between rooms costs 50% less satiation.',
    armorStats: {
      slot: 'legs', armorType: 'light',
      finalDefense: 35, finalMagicDefense: 40, speedPenalty: 0,
      statBonuses: { AGI: 20, PER: 20 },
    },
  },
  {
    id: 'norse_accessory_ansuz',
    name: 'Rune of Ansuz',
    lore: 'The word that writes itself.',
    tier: 'pantheon', slot: 'accessory',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 5,
    revealFavorRequired: 80,
    acquisitionHint: "Odin invented the runes through sacrifice. Prove your soul has been written — achieve the Denatus.",
    isSecret: false,
    acquisition: {
      scope: 'single_character',
      requirements: [{ metric: 'paragon', value: 1, description: 'Complete the Level 10 Denatus ceremony on this character' }],
      requireAll: true,
    },
    passiveId: 'runic_memory',
    passiveDescription: "Your Paragon title's passive adjective effects are increased by 50%.",
    accessoryStats: {
      accessoryType: 'talisman',
      statBonuses: { WIS: 25, INT: 25 },
    },
  },
  {
    id: 'norse_weapon_gungnir',
    name: 'Gungnir',
    lore: 'It was thrown to start the first war. It never misses because missing was never the point.',
    tier: 'pantheon', slot: 'weapon',
    pantheonId: 'norse', setId: 'norse_wyrd', setPieceIndex: 6,
    revealFavorRequired: 80,
    acquisitionHint: "Gungnir is given to those who fight as Odin fights — with knowledge, not instinct. Defeat Malik using no basic attacks.",
    isSecret: false,
    acquisition: {
      scope: 'single_run',
      requirements: [
        { metric: 'boss_noattack', value: 1, description: 'Defeat Malik (Floor 25) using zero basic attack actions — skills, items, and special actions only' },
      ],
      requireAll: true,
    },
    passiveId: 'odins_spear',
    passiveDescription: "Gungnir never misses. Dealing the killing blow to any boss grants 'Marked by Odin' (+20% all stats) for the rest of the run.",
    weaponStats: {
      scalingStat: 'PER',
      finalDamage: 50, finalAccuracy: 110, finalCritChance: 0.25,
      range: 'ranged', damageType: 'physical',
      neverMisses: true,
    },
  },
];

export const NORSE_SET: PantheonSet = {
  id: 'norse_wyrd',
  name: "Wyrd's Legacy",
  pantheonId: 'norse',
  lore: 'The Aesir respect only those who fight knowing death approaches — and advance anyway. These are not rewards. They are recognitions.',
  pieces: NORSE_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Battle-Seasoned', bonusDescription: '+15% damage against milestone bosses.', passiveId: 'battle_seasoned' },
    { piecesRequired: 4, bonusName: 'Ragnarok Ready', bonusDescription: 'Surviving below 20% HP for 3+ consecutive turns permanently increases max HP by 5% (once per run).', passiveId: 'ragnarok_ready' },
    { piecesRequired: 7, bonusName: "Valhalla's Champion", bonusDescription: 'Upon defeating any milestone boss, raise a Spectral Einherjar companion that attacks for 30% of your damage for the next 3 rooms.', passiveId: 'valhalla_champion' },
  ],
};
