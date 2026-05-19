/**
 * Japanese Deity Relics — Remaining deities not in deityRelics_eastAsian.ts
 * Ame-no-Uzume, Sarutahiko, Okuninushi, Takemikazuchi, Toyotama-hime,
 * Yama-no-Kami, Shinatsuhiko, Omoikane
 */

import type { DeityRelicPair } from './deityRelics';

const AME_NO_UZUME_RELICS: DeityRelicPair = {
  deityId: 'ame_no_uzume',
  weapon: {
    id: 'deity_ame_no_uzume_weapon', name: "Dawn Dance Wand",
    lore: "Her sacred dance lured the sun goddess from her cave. The wand does not fight what it cannot charm.",
    tier: 'deity', slot: 'weapon', deityId: 'ame_no_uzume',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I danced with such mirth and joy that all the gods laughed, and that laughter drew Amaterasu back to the world. My wand goes to those who can turn every situation into joy: in a single run reaching Floor 10, use the Taunt action at least once in every combat room AND succeed in every event room you enter. Dance through all of it. Not one encounter should break the rhythm.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'taunt_total', value: 1, targetType: 'every_combat_room', description: 'Use Taunt in every combat room entered this run' },
      { metric: 'event_success', value: 3, description: 'Succeed in at least 3 event rooms this run' },
    ]},
    passiveId: 'uzume_wand_passive',
    passiveDescription: "Sacred Mirth: each successful Taunt in a combat reduces the enemy's critical hit chance by 10% for the rest of the fight (laughter disrupts precision). After the 3rd Taunt in a single combat, the enemy becomes confused for 1 turn.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 40, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ame_no_uzume_accessory', name: "Kagura Bell Pendant",
    lore: "The bells ring in the kagura dance. Their sound both frightens spirits and draws the attention of gods.",
    tier: 'deity', slot: 'accessory', deityId: 'ame_no_uzume',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the goddess of dawn and mirth. Where I dance, even the divine come to watch. My pendant goes to those who spread their joy widely: reach Favoured Child status (91+ favor) with 3 different deities from 3 different pantheons. Show me your joy is not pantheon-specific. It belongs to all the gods.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 3, targetType: 'three_different_pantheons', description: 'Reach 91+ favor with deities from 3 different pantheons lifetime' },
    ]},
    passiveId: 'uzume_bells_passive',
    passiveDescription: "Bell's Resonance: CHA-based event outcomes are always positive (the divine presence shifts luck). Additionally: Taunt success rate increased by 15% — the goddess of mirth lends her charm to every appeal.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 28, LCK: 22 } },
  },
};

const SARUTAHIKO_RELICS: DeityRelicPair = {
  deityId: 'sarutahiko',
  weapon: {
    id: 'deity_sarutahiko_weapon', name: "Celestial Descent Spear",
    lore: "He stood at the crossroads of heaven and earth to guide the descent of the gods. This spear pointed the way.",
    tier: 'deity', slot: 'weapon', deityId: 'sarutahiko',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guided the descent of heaven's children to earth. I am the great guide, standing at the crossroads. My spear goes to those who lead the way without hesitation: complete 3 separate runs where you cleared every room on every floor you visited — not just combat rooms, but all rooms. Show every path completely explored before descending. A true guide leaves nothing unmapped.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_runs_all_rooms_cleared_each_floor', description: 'Complete 3 runs where all rooms were entered on every floor visited, lifetime' },
    ]},
    passiveId: 'sarutahiko_spear_passive',
    passiveDescription: "Guiding Light: the floor map is always fully revealed at the start of each floor. Additionally: the first enemy in any new floor type you encounter is always at -15% stats (the guide knows the terrain; the enemy does not know the guide).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'PER', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_sarutahiko_accessory', name: "Crossroads Staff Charm",
    lore: "Where roads cross, Sarutahiko stands. He has the largest nose in all the heavens and uses it to smell which path leads to glory.",
    tier: 'deity', slot: 'accessory', deityId: 'sarutahiko',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The crossroads demands a choice. I have helped the gods choose since before your kind existed. My charm goes to the decisive: in a single run reaching Floor 10, enter and clear every mystery room and every event room available — leave no crossroads unexplored. The guide does not stand at the fork. He walks every path.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 3, description: 'Enter 3+ mystery rooms in one run' },
      { metric: 'event_success', value: 3, description: 'Complete 3+ event rooms in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'sarutahiko_charm_passive',
    passiveDescription: "Path Knowledge: mystery room outcomes are always revealed before you enter (you see the reward tier before committing). Event room choices show their likely outcomes. The great guide sees what each path holds before stepping onto it.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, PER: 20, WIS: 16 } },
  },
};

const OKUNINUSHI_RELICS: DeityRelicPair = {
  deityId: 'okuninushi',
  weapon: {
    id: 'deity_okuninushi_weapon', name: "Nation-Builder's Great Sword",
    lore: "He built the land through trial and suffering — killed by his brothers, restored by clam-shell goddesses, tried again. The sword carries that earned wisdom.",
    tier: 'deity', slot: 'weapon', deityId: 'okuninushi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My brothers killed me twice before I built my nation. I was restored, and I tried again with more knowledge each time. My sword goes to those who demonstrate the same pattern: die and return — and on the run after a character death, reach Floor 10 with that new character. Die. Learn. Descend further. The land was not built on first attempts.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'this_run_after_character_death', description: 'This is a run made after a character death (any character)' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10 in this post-death run' },
    ]},
    passiveId: 'okuninushi_sword_passive',
    passiveDescription: "Land Master's Wisdom: +5% damage for each previous character death in your account history (lifetime deaths, max +30%). The more you have fallen and returned, the more the nation-builder recognizes your dedication.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_okuninushi_accessory', name: "White Rabbit's Gratitude Bead",
    lore: "He helped the white rabbit when his brothers mocked it. The rabbit gave him this bead and told him he would marry the princess. It was right.",
    tier: 'deity', slot: 'accessory', deityId: 'okuninushi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I helped a suffering creature when others laughed. Small kindnesses become great fortunes. My bead goes to those who demonstrate the same generosity: succeed in 15 event room encounters total across your lifetime. Fifteen times you chose to engage with what the Tower offered, and showed wisdom or compassion. Fifteen gratitudes stored in this bead.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'event_success', value: 15, description: 'Succeed in 15 event rooms total lifetime' },
    ]},
    passiveId: 'okuninushi_bead_passive',
    passiveDescription: "Fortune's Gratitude: after any successfully completed event room, the next combat in the same run has all enemy attack values reduced by 15% (gratitude from the rabbit extends forward). Stack: each event success this run reduces a pool — up to -40% enemy attack at 4 events.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, WIS: 18, CHA: 12 } },
  },
};

const TAKEMIKAZUCHI_RELICS: DeityRelicPair = {
  deityId: 'takemikazuchi',
  weapon: {
    id: 'deity_takemikazuchi_weapon', name: "Futsunomitama — Sword that Conquers",
    lore: "His sword was thrust into the earth point-first and ended wars simply by its presence. The blade that conquered the earthly kami.",
    tier: 'deity', slot: 'weapon', deityId: 'takemikazuchi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My blade ended the wars of the earthly kami without contest. My weapon goes to those who demonstrate similarly complete domination: kill 50 enemies with sword-type weapons in a single run, reaching Floor 15. Not any weapon — specifically swords. The god of swords recognizes only those who wield his chosen weapon with mastery.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_with_stat', value: 50, targetType: 'sword_type_weapon', description: 'Kill 50 enemies with sword-type weapons in one run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15 in that run' },
    ]},
    passiveId: 'takemikazuchi_futsunomitama_passive',
    passiveDescription: "Divine Sword: critical hits with this weapon deal 3.5× damage instead of 2× (the sword god's crits are absolute). Additionally: the first attack in any combat is always a critical hit — the sword that was thrust into earth strikes first and perfectly.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 55, finalAccuracy: 95, finalCritChance: 0.35, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_takemikazuchi_accessory', name: "Thunder-Born Battle Seal",
    lore: "He was born from the blood of Kagutsuchi — fire god's blood, sword god's birth. The seal carries both lineages.",
    tier: 'deity', slot: 'accessory', deityId: 'takemikazuchi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was born from the blood of a slain fire god. My nature is conquest through lineage and purpose. My seal goes to those who prove they never retreat from what they began: complete a full run from Floor 1 to Floor 20 with zero flee attempts and zero boss bypasses. Not one retreat. Not one diplomatic escape. The sword god does not negotiate. He conquers.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'flee_total', value: 0, description: 'Zero flee attempts the entire run' },
      { metric: 'boss_bypass', value: 0, description: 'Zero boss bypasses the entire run' },
    ]},
    passiveId: 'takemikazuchi_seal_passive',
    passiveDescription: "Thunder Lineage: +10% damage for each floor you have descended without fleeing or bypassing (current run). At Floor 10 without retreat: +15% instead. At Floor 20: +25%. The sword's honor compounds as the conquest deepens.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { STR: 28, AGI: 18 } },
  },
};

const TOYOTAMA_HIME_RELICS: DeityRelicPair = {
  deityId: 'toyotama_hime',
  weapon: {
    id: 'deity_toyotama_hime_weapon', name: "Dragon Princess Trident",
    lore: "She asked her husband not to watch her give birth. He watched. She revealed her true dragon form and departed forever. This trident is what she left behind.",
    tier: 'deity', slot: 'weapon', deityId: 'toyotama_hime',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I gave up my mortal life because a promise was broken. My trident goes to those who understand that transformation cannot be witnessed unwillingly: complete a run to Floor 15 where you never used the Observe action on any boss during their fight. Fight them without studying them. Trust your instincts. The dragon shows her form on her own terms — not yours.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'no_observe_during_boss_fights', description: 'Never use Observe during any boss fight this run (Observe outside boss fights is allowed)' },
    ]},
    passiveId: 'toyotama_trident_passive',
    passiveDescription: "Dragon Form Unleashed: once per run, when your HP drops below 25%, you reveal your dragon nature — for 5 turns, deal +60% damage and gain +30% damage reduction. The princess's true form protects in the moment of greatest need.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_toyotama_hime_accessory', name: "Sea Dragon's Pearl",
    lore: "The tide jewels of the dragon palace: one raises the tide, one lowers it. She sent this with her son as a parting gift for the lineage she could no longer share.",
    tier: 'deity', slot: 'accessory', deityId: 'toyotama_hime',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The tide jewels control the sea itself. My pearl goes to those who understand the power of water-born magic: use magic-type skills 100 times total in a single run while reaching Floor 15. Not physical skills. Not support skills. Magic, purely. The ocean princess fights with the power of what cannot be physically held.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 100, targetType: 'magic_skills', description: 'Use magic-type skills 100 times in one run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
    ]},
    passiveId: 'toyotama_pearl_passive',
    passiveDescription: "Tide Pearl: magic skills cost 20% less SP. Once per floor, the first magic skill you use this floor is cast for free (0 SP). The tide jewel provides the ocean's abundant power to spellcraft.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 28, WIS: 20 } },
  },
};

const YAMA_NO_KAMI_RELICS: DeityRelicPair = {
  deityId: 'yama_no_kami',
  weapon: {
    id: 'deity_yama_no_kami_weapon', name: "Mountain Spirit's Iron Club",
    lore: "The mountain kami watches hunters who enter the forest. This is what greets those who do not show proper respect.",
    tier: 'deity', slot: 'weapon', deityId: 'yama_no_kami',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the spirit of the mountain. I am patient as stone and dangerous as avalanche. My club goes to those who demonstrate mountain patience: in a single run reaching Floor 10, begin each combat with the Defend action — every combat, the first action is Defend. Then when you strike, strike hard. The mountain endures before it falls.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'defend_first_action_every_combat_run', description: 'Use Defend as the first action in every combat this run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'yama_no_kami_club_passive',
    passiveDescription: "Mountain Patience: if you used Defend as your first action in a combat, your next attack deals +40% bonus damage. The mountain's patience converts directly to the avalanche's force.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'STR', finalDamage: 52, finalAccuracy: 85, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_yama_no_kami_accessory', name: "Forest Heart Stone",
    lore: "The ancient stone at the center of the mountain that the kami inhabits. It does not move. Neither does it break.",
    tier: 'deity', slot: 'accessory', deityId: 'yama_no_kami',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the mountain. I do not run. I do not flee. My stone goes to those who prove the same immovability: complete 5 separate runs where you did not use the Flee action a single time, and reached at least Floor 5 in each. Five ascents. No retreat. The mountain does not withdraw from the sky.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'floor_noretreat', value: 5, targetType: 'five_runs_no_flee_floor5_plus', description: 'Complete 5 runs reaching Floor 5+ with zero flee attempts in each run, lifetime' },
    ]},
    passiveId: 'yama_no_kami_stone_passive',
    passiveDescription: "Immovable Peak: you cannot be pushed back, slowed, or have your initiative reduced by enemy effects. Additionally: END stat grants +2% physical damage reduction instead of the base +1% (the mountain endures more than other peaks).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 30, STR: 18 } },
  },
};

const SHINATSUHIKO_RELICS: DeityRelicPair = {
  deityId: 'shinatsuhiko',
  weapon: {
    id: 'deity_shinatsuhiko_weapon', name: "Breath of Heaven Blade",
    lore: "He is older than Fujin, predating the famous wind brothers. His breath shaped the first winds from the primordial separation of heaven and earth.",
    tier: 'deity', slot: 'weapon', deityId: 'shinatsuhiko',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I breathed the first wind between heaven and earth. I was there before the famous wind gods, though they have forgotten. My blade goes to those who prove they act first: in a single run reaching Floor 10, win the initiative (act first) in every single combat. Not most — every single one. The first breath preceded everything. So should yours.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'always_first_initiative_every_combat', description: 'Win initiative (act first) in every combat this run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'shinatsuhiko_blade_passive',
    passiveDescription: "First Wind: you always act first in combat (initiative is automatic). Additionally: your first attack in every combat has +25% damage — the first wind is always the strongest. This advantage exists regardless of AGI comparison.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 44, finalAccuracy: 98, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_shinatsuhiko_accessory', name: "Sky-Between Wind Amulet",
    lore: "When Izanagi and Izanami separated earth from heaven with a spear, the wind god was born in the space between. He still lives there.",
    tier: 'deity', slot: 'accessory', deityId: 'shinatsuhiko',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I exist in the space between things. Not earth, not heaven. Between. My amulet goes to those who understand the threshold: dodge or evade 50 attacks total across your lifetime — not once per run, but 50 total evasions recorded. Move between the blow and the body. The wind exists where the solid cannot.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'dodges_total', value: 50, description: 'Dodge or evade 50 attacks total lifetime' },
    ]},
    passiveId: 'shinatsuhiko_amulet_passive',
    passiveDescription: "Between Heaven and Earth: +20% evasion on all attacks. When you successfully evade an attack, the next attack you make deals +20% bonus damage — the space between becomes the strike's origin.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { AGI: 28, PER: 18 } },
  },
};

const OMOIKANE_RELICS: DeityRelicPair = {
  deityId: 'omoikane',
  weapon: {
    id: 'deity_omoikane_weapon', name: "Eight Thousand Thoughts Staff",
    lore: "He devised the plan to draw Amaterasu from her cave — every god's plan had failed. His succeeded because he thought further than anyone else.",
    tier: 'deity', slot: 'weapon', deityId: 'omoikane',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I held eight thousand plans in my mind simultaneously and chose the correct one. My staff goes to those who demonstrate equivalent analytical depth: use the Observe action on 100 different enemies across your lifetime — not 100 observations total, but 100 enemies uniquely observed. Catalog the enemy. Build the database. Eight thousand thoughts require eight thousand subjects.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 100, targetType: 'unique_enemy_types', description: 'Observe 100 unique enemy types (not 100 total uses, but 100 different enemy IDs observed) lifetime' },
    ]},
    passiveId: 'omoikane_staff_passive',
    passiveDescription: "Optimal Plan: after using Observe in a combat, the next 5 actions you take in that combat each receive +10% effectiveness (attacks deal +10% more, skills have +10% effect). The counselor's plan improves every action it informs.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 96, finalCritChance: 0.28, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_omoikane_accessory', name: "Counsel of the Gods Seal",
    lore: "The heavenly gods asked him to think. He always had the answer. They always asked the right deity.",
    tier: 'deity', slot: 'accessory', deityId: 'omoikane',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Good counsel requires patience, observation, and application. Not any one, but all three. To earn my seal: in a single run reaching Floor 15, use the Observe action before every boss fight AND use a skill as the killing blow on every boss you defeat. Observe. Plan. Execute with precision. That is the counselor's method.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'observe_total', value: 1, targetType: 'all_bosses_observed_before_fight', description: 'Observe every boss before any attack in their fight' },
      { metric: 'boss_skillonly', value: 1, targetType: 'all_boss_kills_with_skills', description: 'Killing blow on every boss must be a skill, not a basic attack' },
    ]},
    passiveId: 'omoikane_seal_passive',
    passiveDescription: "Divine Counsel: Observe reveals enemy weaknesses, upcoming special attacks (2-turn preview), and exact HP remaining. The counselor's knowledge is complete. Additionally: SP regenerates 1 point faster per turn when an enemy you have Observed this combat is alive.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { INT: 30, WIS: 22 } },
  },
};

export const JAPANESE_REMAINING_RELICS: DeityRelicPair[] = [
  AME_NO_UZUME_RELICS, SARUTAHIKO_RELICS, OKUNINUSHI_RELICS, TAKEMIKAZUCHI_RELICS,
  TOYOTAMA_HIME_RELICS, YAMA_NO_KAMI_RELICS, SHINATSUHIKO_RELICS, OMOIKANE_RELICS,
];
