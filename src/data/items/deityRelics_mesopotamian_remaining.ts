/**
 * Mesopotamian Deity Relics — Remaining deities not in deityRelics_western.ts
 * Ea, Ninurta, Tiamat, Enlil, Nabu, Dumuzi, Pazuzu, Gilgamesh,
 * Nammu, Nisaba, Inanna (separate from Ishtar in this game), Lamashtu
 */

import type { DeityRelicPair } from './deityRelics';

const EA_RELICS: DeityRelicPair = {
  deityId: 'ea',
  weapon: {
    id: 'deity_ea_weapon', name: "Abzu-Staff of Deep Wisdom",
    lore: "Ea dwells in the Abzu — the fresh water beneath the earth. He is the god of wisdom, craft, magic, and mischief. He warned humanity of the flood.",
    tier: 'deity', slot: 'weapon', deityId: 'ea',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I warned Utnapishtim of the flood through a reed wall so that no divine law was technically broken. I find solutions that do not require direct confrontation. My staff goes to those who demonstrate the same creativity: in a single run reaching Floor 15, bypass at least 2 bosses through dialogue AND still reach Floor 15 through the remaining combat. Find the path that does not require the head-on fight.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 2, description: 'Bypass 2 bosses through dialogue in one run' },
      { metric: 'floors_reached', value: 15, description: 'Still reach Floor 15 in that run' },
    ]},
    passiveId: 'ea_staff_passive',
    passiveDescription: "Deep Wisdom: after bypassing a boss, all your attacks for the next floor deal +25% magic damage (wisdom turns the avoided conflict into advantage). Additionally: INT scales +15% more effectively for damage calculations.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 48, finalAccuracy: 95, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_ea_accessory', name: "Reed-Wall Whisper Amulet",
    lore: "He whispered the secret to a reed wall. The reed wall whispered it to Utnapishtim. Plausible deniability perfected.",
    tier: 'deity', slot: 'accessory', deityId: 'ea',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the cleverest of the great gods. My amulet goes to those who prove they have studied their enemy: use the Observe action at least 3 times total in a single boss fight. Not across the run — in one boss fight alone. Observe the flood. Read its patterns. Three observations before the moment of commitment. Wisdom requires preparation.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'observe_total', value: 3, targetType: 'in_single_boss_fight', description: 'Use Observe 3 times in a single boss fight' },
      { metric: 'boss_kills_run', value: 1, description: 'Win the boss fight' },
    ]},
    passiveId: 'ea_amulet_passive',
    passiveDescription: "Abzu Knowledge: each use of Observe in a combat adds a stacking +8% damage bonus for the rest of that combat (max +40% from 5 observations). The deep water's wisdom converts observation into power.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 25, WIS: 22 } },
  },
};

const NINURTA_RELICS: DeityRelicPair = {
  deityId: 'ninurta',
  weapon: {
    id: 'deity_ninurta_weapon', name: "Sharur — The Mace That Speaks",
    lore: "Ninurta's weapon Sharur could fly independently and report intelligence to its owner. He used it to defeat Asag, the stone demon. The mace has opinions.",
    tier: 'deity', slot: 'weapon', deityId: 'ninurta',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My weapon Sharur flew ahead to scout, then returned to my hand to report. It advised me on the best strategy before I struck. To earn Sharur: in 5 different combats lifetime, use Observe as your first action and then kill the enemy without taking any damage. Scout. Strike perfectly. Five hunts done without blemish.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 5, targetType: 'observe_first_then_nodamage_kill_lifetime', description: 'Use Observe as first action then kill without taking damage — 5 times lifetime' },
    ]},
    passiveId: 'ninurta_sharur_passive',
    passiveDescription: "Sharur Speaks: before each combat, Sharur assesses the enemy and provides a hint (shows one of: their HP, their special ability name, or their weakness). Which hint is revealed rotates — you cannot control it, but Sharur always knows something.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 52, finalAccuracy: 93, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ninurta_accessory', name: "Flood Stone Amulet",
    lore: "After defeating Asag, Ninurta gathered the stones that had aided the demon and arranged them to control the floods of Tigris. Water management as victory lap.",
    tier: 'deity', slot: 'accessory', deityId: 'ninurta',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I defeated the stone demon and used his stones to build civilization. Victory into utility. My amulet goes to those who demonstrate the same: defeat any elite enemy while your HP is below 25%. You fought the hard battle from the lower position, and you won. Then I will know you carry the farmer-warrior's spirit.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 1, targetType: 'beat_elite_below_25hp', description: 'Defeat an elite enemy while HP is below 25%' },
    ]},
    passiveId: 'ninurta_amulet_passive',
    passiveDescription: "Stone Demon's Trophies: +10% damage against elite enemies permanently. Additionally: when you defeat an elite enemy, gain a permanent +3 max HP on this character (the flood stones add to your foundation). Maximum +30 max HP from 10 elite kills.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, END: 22 } },
  },
};

const TIAMAT_RELICS: DeityRelicPair = {
  deityId: 'tiamat',
  weapon: {
    id: 'deity_tiamat_weapon', name: "Primordial Dragon Scale-Blade",
    lore: "She was the salt water, the chaos dragon mother. Marduk split her in half to make heaven and earth. She was not consulted. This blade is a scale from that creation.",
    tier: 'deity', slot: 'weapon', deityId: 'tiamat',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was the ocean before the world existed. I was the chaos that became creation. My scale-blade goes to those who wield chaos as a weapon: in a single combat, have 3 or more different status effects active on yourself simultaneously and still kill the enemy. Be the chaos. Endure it. The primordial ocean was not calm.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 3, targetType: 'three_simultaneous_different_statuses_and_win', description: 'Have 3 different status effects active simultaneously and win the combat' },
    ]},
    passiveId: 'tiamat_blade_passive',
    passiveDescription: "Primordial Chaos: each negative status effect currently on you grants +10% damage (the chaos that makes the world fuels the strike). Maximum +50% from 5 status effects. The dragon mother's scale absorbs suffering and returns it as force.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'INT', finalDamage: 54, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_tiamat_accessory', name: "Salt Water Drakon Seal",
    lore: "From her body Marduk made the sky and earth, and from her eyes the Tigris and Euphrates. The seal is a compression of that original body.",
    tier: 'deity', slot: 'accessory', deityId: 'tiamat',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My body became the world. Everything that exists is made of me. My seal goes to those who have endured across many lives: reach 10 total character deaths across your lifetime. Die ten times. Be divided ten times into something new. I was divided once to make everything. Ten times makes you something more.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_total_character_deaths_lifetime', description: '10 total character deaths across all characters lifetime' },
    ]},
    passiveId: 'tiamat_seal_passive',
    passiveDescription: "Mother of All Monsters: at the start of each combat, 30% chance an additional monster joins the fight (a chaos spawn from Tiamat's lineage). If you kill this additional monster, gain +5% damage for the rest of the combat. The chaos dragon's children multiply, but so does the reward.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { END: 28, INT: 20 } },
  },
};

const ENLIL_RELICS: DeityRelicPair = {
  deityId: 'enlil',
  weapon: {
    id: 'deity_enlil_weapon', name: "Wind-Breath Authority Staff",
    lore: "He decided to destroy humanity with a flood because they were too loud. He was outvoted afterward but remained the authority. He did not apologize.",
    tier: 'deity', slot: 'weapon', deityId: 'enlil',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the authority of the air — I determine fates by decree. My staff goes to those who prove they act with authority and do not retreat from it: complete a run from Floor 1 to Floor 20 with zero flee attempts. I decreed the flood and did not unmake the decision. Those who earn my staff understand that authority requires commitment.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'flee_total', value: 0, description: 'Zero flee attempts the entire run' },
    ]},
    passiveId: 'enlil_staff_passive',
    passiveDescription: "Divine Decree: once per combat, declare an enemy 'decreed' — for the rest of the combat they cannot use their special abilities (authority overrules capability). Additionally: +15% damage against any enemy you have declared an intent to fight (no flee, no bypass in this run).",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.24, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_enlil_accessory', name: "Tablet of Destinies",
    lore: "He held the Tablet of Destinies — whoever possessed it ruled the gods. It was stolen by Anzu the bird-demon. He was not pleased. The tablet was recovered.",
    tier: 'deity', slot: 'accessory', deityId: 'enlil',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Tablet of Destinies confers total authority. Whoever holds it rules. My tablet goes to those who demonstrate they can hold authority even when challenged: use Taunt in 3 consecutive combats in a single run without it failing once. Each consecutive taunt is a claim to authority. Three in a row, uncontested. Then the tablet recognizes its new bearer.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 3, targetType: 'three_consecutive_combats_all_success', description: 'Taunt successfully in 3 consecutive combats without failure in a single run' },
    ]},
    passiveId: 'enlil_tablet_passive',
    passiveDescription: "Authority of Destinies: Taunt can no longer fail (authority cannot be denied). Additionally: successfully Taunting an enemy reduces their maximum damage output by 20% for the entire combat — the decree limits what they are permitted to do.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { CHA: 25, WIS: 22 } },
  },
};

const NABU_RELICS: DeityRelicPair = {
  deityId: 'nabu',
  weapon: {
    id: 'deity_nabu_weapon', name: "Writing Reed of Fate",
    lore: "Nabu holds the reed stylus that writes destiny on tablets. He is the scribe god — every fate is written in his hand.",
    tier: 'deity', slot: 'weapon', deityId: 'nabu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I write fate. Everything that is fated has my script on it. My reed goes to those who demonstrate the power of accumulated knowledge: use the Observe action 150 times total across your lifetime. Not unique enemies — 150 total observation actions. Every page of the tablet filled. Every enemy scrutinized. The scribe who writes most is the scribe who knows most.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 150, description: 'Use Observe 150 times total lifetime' },
    ]},
    passiveId: 'nabu_reed_passive',
    passiveDescription: "Written Fate: enemies that have been Observed by you have their fate written — they take +12% damage from all sources for the rest of the combat. Additionally: each Observe this run adds +1% to a stacking damage bonus (max +20% from 20 observations this run).",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'PER', finalDamage: 44, finalAccuracy: 96, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_nabu_accessory', name: "Stylus of the Scribe God",
    lore: "He writes the book of fate beside the scales of judgment. This stylus has written more than any other object in existence.",
    tier: 'deity', slot: 'accessory', deityId: 'nabu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wisdom is the accumulation of what is written. My stylus goes to those who achieve mastery in knowledge: reach Level 5 on a character whose INT stat is grade A or higher. Wisdom must be in the statistics. The body must carry what the mind has mastered. Show me the letters and the flesh that holds them.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'stats_grade', value: 1, targetType: 'INT_grade_A_or_higher', description: 'INT stat at grade A or above' },
    ]},
    passiveId: 'nabu_stylus_passive',
    passiveDescription: "Knowledge Written in the Body: INT stat grants +2% bonus to magic skill damage per grade level (D=2%, C=4%, B=6%, A=8%, S=10%, SS=12%). The scribe's stylus enhances the precise execution that INT enables.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { INT: 30, WIS: 20 } },
  },
};

const DUMUZI_RELICS: DeityRelicPair = {
  deityId: 'dumuzi',
  weapon: {
    id: 'deity_dumuzi_weapon', name: "Shepherd King's Crook",
    lore: "Inanna chose him as her husband. Ereshkigal demanded a substitute for Inanna's time in the underworld. Inanna chose Dumuzi. He spends half the year there. He is not angry anymore.",
    tier: 'deity', slot: 'weapon', deityId: 'dumuzi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I descend to the underworld for half the year and return for the other half. My crook goes to those who understand the descent-and-return: die, then start a new character, and on that new character's first run reach Floor 5 without using any healing consumables. Descend clean. Return stronger. The shepherd who was taken learns to need nothing from those who took him.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'first_run_new_character_after_death', description: 'This character\'s first run, started after a previous character death' },
      { metric: 'floors_reached', value: 5, description: 'Reach Floor 5' },
      { metric: 'floor_noconsumable', value: 5, description: 'No healing consumables the entire run' },
    ]},
    passiveId: 'dumuzi_crook_passive',
    passiveDescription: "Shepherd's Return: at the start of each dungeon run, you gain +15% max HP for the run (the return from the underworld restores more than was taken). This bonus stacks +5% for each previous character death in your account history.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'CHA', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_dumuzi_accessory', name: "Fertile Season Ring",
    lore: "When Dumuzi is above ground, the crops grow. When he descends, they wither. He carries the seasons with him like a coat.",
    tier: 'deity', slot: 'accessory', deityId: 'dumuzi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Half the year I give, half I take. The seasons are in my hands. My ring goes to those who accumulate gold and spend it with balance: accumulate 10,000 gold lifetime AND spend at least 5,000 of that at shops (not blacksmith). Give and take, in that proportion. The fertile season requires both growth and commerce.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 10000, description: 'Accumulate 10,000 total gold lifetime' },
      { metric: 'custom', value: 5000, targetType: 'gold_spent_at_shops_lifetime', description: 'Spend at least 5,000 gold at shops (not blacksmith) lifetime' },
    ]},
    passiveId: 'dumuzi_ring_passive',
    passiveDescription: "Fertile Season: gold found in treasure rooms is +20% more. After spending any amount at a shop in a run, gain a permanent +5% damage bonus for that run (commerce empowers the shepherd king). Max stacks up to +25% from 5 shop purchases.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { LCK: 22, END: 20, CHA: 16 } },
  },
};

const PAZUZU_RELICS: DeityRelicPair = {
  deityId: 'pazuzu',
  weapon: {
    id: 'deity_pazuzu_weapon', name: "Demon King's Scorpion Tail Blade",
    lore: "Pazuzu is the demon king of the wind — lion head, eagle wings, scorpion tail. He is invoked to drive away other evil spirits, making him paradoxically one of the most protective demons in existence.",
    tier: 'deity', slot: 'weapon', deityId: 'pazuzu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the demon that drives away demons. I am evil protecting from greater evil. My tail-blade goes to those who have survived what should have killed them many times: survive 20 total combats across your lifetime where you entered the fight below 30% HP. Not carefully — 20 times in the jaws of death, survived. The demon of wind respects only those who have passed through him repeatedly.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 20, targetType: 'entered_below_30hp_survived_lifetime', description: 'Enter combat below 30% HP and survive 20 times lifetime' },
    ]},
    passiveId: 'pazuzu_tail_passive',
    passiveDescription: "Demon Ward: negative status effects inflicted on you by enemies have a 25% chance to be deflected back to the caster (Pazuzu drives away what attacks you). Additionally: when below 30% HP, deal +20% damage — the demon king defends most viciously when cornered.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'END', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_pazuzu_accessory', name: "Invocation Amulet of the Demon King",
    lore: "Lamashtu feared Pazuzu. She-demons came for children, and families hung Pazuzu amulets to drive her off. The demon that scares other demons.",
    tier: 'deity', slot: 'accessory', deityId: 'pazuzu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "They invoke me to drive away my colleagues. I am the counterweight. My amulet goes to those who have been afflicted by status effects and endured: receive 5 different status effect types across your lifetime and survive each one. Not in one run — five different types, any time, any run. You have been afflicted by the full palette of the Tower's cruelty. Then I will protect you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, targetType: 'five_different_types_lifetime', description: 'Survive having received 5 different status effect types across your lifetime' },
    ]},
    passiveId: 'pazuzu_amulet_passive',
    passiveDescription: "Demon King's Ward: once per run, automatically cure the most dangerous status effect on you at the start of a combat (Pazuzu identifies and expels the worst). Additionally: status effects on you deal -20% of their normal damage (the demon king weakens what he cannot deflect).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 24, AGI: 22, WIS: 12 } },
  },
};

const GILGAMESH_RELICS: DeityRelicPair = {
  deityId: 'gilgamesh',
  weapon: {
    id: 'deity_gilgamesh_weapon', name: "Bull of Heaven Slayer",
    lore: "He killed the Bull of Heaven sent by Anu, defeated Humbaba guardian of the Cedar Forest, and sought immortality after Enkidu died. He did not find it. He found the story instead.",
    tier: 'deity', slot: 'weapon', deityId: 'gilgamesh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was two-thirds divine, one-third mortal. I built the walls of Uruk that still stand. I killed the greatest monsters of my age. My weapon goes to those who have accumulated equivalent accomplishments: defeat all 5 milestone bosses in a single run. Every great foe. From Vanya to Malik. Complete the full circuit. Gilgamesh did not stop at the Cedar Forest.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 5, description: 'Defeat all 5 milestone bosses in a single run' },
    ]},
    passiveId: 'gilgamesh_weapon_passive',
    passiveDescription: "Hero-King's Strength: +10% damage for each milestone boss defeated in the current run (max +50% from 5 bosses). The hero-king grows stronger with each great enemy slain — his legend is written in the kills.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 56, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_gilgamesh_accessory', name: "Plant of Immortality Shard",
    lore: "He found it at the bottom of the sea. A serpent stole it while he slept. He wept. Then he went home and wrote the story of all he had done instead. The shard was recovered from the serpent.",
    tier: 'deity', slot: 'accessory', deityId: 'gilgamesh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I reached the bottom of the sea for the plant of immortality and a serpent took it while I slept. What I found instead was the story — and the story outlasted everything. My shard goes to those who have accumulated a lifetime's depth: reach Level 10 Paragon. The hero-king who cannot find immortality must become immortal through the achievement of his story.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon' },
    ]},
    passiveId: 'gilgamesh_shard_passive',
    passiveDescription: "Mortal Immortality: once per run, when you would die, instead survive at 1 HP with all status effects cleansed (the immortality plant's shard provides one perfect reprieve). After this triggers, gain +15% damage for the rest of the run — the almost-death sharpens the hero-king.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { STR: 25, END: 22 } },
  },
};

const NAMMU_RELICS: DeityRelicPair = {
  deityId: 'nammu',
  weapon: {
    id: 'deity_nammu_weapon', name: "Primordial Sea Staff",
    lore: "She is the sea — not a sea, the sea. The first sea, the one the world was made from. Even Enki came from her womb.",
    tier: 'deity', slot: 'weapon', deityId: 'nammu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was there before the sky was divided from the earth. I carried the first gods in my waters. My staff goes to those who prove they carry depth: accumulate 50,000 lifetime gold — but also have reached Floor 10 or deeper in at least one run. Depth requires both persistence and time. The primordial sea was neither quick nor shallow.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 50000, description: 'Accumulate 50,000 gold lifetime' },
      { metric: 'floors_reached', value: 10, targetType: 'in_any_single_run', description: 'Reach Floor 10 or deeper in at least one run' },
    ]},
    passiveId: 'nammu_staff_passive',
    passiveDescription: "Primordial Depths: magic damage increases by 1% for every 500 gold currently held (max +20% at 10,000 gold). The primordial sea's power flows from accumulated wealth — Nammu's depth is measured in what she contains.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 93, finalCritChance: 0.24, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_nammu_accessory', name: "First Waters Amulet",
    lore: "Before land, there was only Nammu. The amulet is a droplet from the first sea, before anything was named.",
    tier: 'deity', slot: 'accessory', deityId: 'nammu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "From my waters came everything that exists. I am the origin. My amulet goes to those at their own beginning: earn it on your very first character — reach Level 3, and accumulate 500 gold on that character before Level 3. The first waters require no experience to be powerful. They simply require recognition.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'first_character_ever_created', description: 'This is the first character ever created in the account' },
      { metric: 'level_reached', value: 3, description: 'Reach Level 3' },
      { metric: 'gold_accumulated', value: 500, description: 'Accumulate 500 gold on this character' },
    ]},
    passiveId: 'nammu_amulet_passive',
    passiveDescription: "Origin Water: this character begins each run with +20% max HP (the primordial sea grants generous depths to those who started with nothing). Additionally: the first time each stat type is raised this character, gain +2 to that stat instead of +1.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 22, WIS: 20, END: 16 } },
  },
};

const NISABA_RELICS: DeityRelicPair = {
  deityId: 'nisaba',
  weapon: {
    id: 'deity_nisaba_weapon', name: "Grain-Reed Counting Staff",
    lore: "She is the goddess of grain and the stylus — of both the harvest and the writing that records it. She holds the lapis lazuli tablet of the stars.",
    tier: 'deity', slot: 'weapon', deityId: 'nisaba',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I count the stars and the grain in the same breath. The tablet of the heavens and the tablet of the harvest are the same tablet. My staff goes to those who have proven both: reach Level 5 AND have 10,000 gold accumulated on the same character at the time of reaching Level 5. Count the grain AND count the stars. Both at once.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'gold_accumulated', value: 10000, targetType: 'at_the_same_character', description: 'Have 10,000 gold accumulated on this same character' },
    ]},
    passiveId: 'nisaba_staff_passive',
    passiveDescription: "Grain and Stars: all skill uses restore 2 SP instead of costing SP when your gold is above 1,000 (abundance of grain feeds the mind). When gold drops below 1,000, skills cost their normal SP — the harvest determines the capacity for stargazing.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 94, finalCritChance: 0.24, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_nisaba_accessory', name: "Lapis Lazuli Star Tablet",
    lore: "Her tablet predicts the future with grain-counts and astronomical movements. The grain that feeds the present, the stars that map the future.",
    tier: 'deity', slot: 'accessory', deityId: 'nisaba',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My tablet holds all knowledge of what grows and what is written in the sky. To earn it: complete 10 event rooms across your lifetime — the grain-scribe values those who read what events offer and respond with wisdom, not with weapons. Event rooms are the stars and grain of the Tower. Read them.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'event_success', value: 10, description: 'Complete 10 event rooms successfully lifetime' },
    ]},
    passiveId: 'nisaba_tablet_passive',
    passiveDescription: "Star-Grain Wisdom: event rooms always offer 3 choices instead of 2 (the scribe reveals additional options). Additionally: after completing an event room, the next combat has all enemy defense values reduced by 15% — the grain-scribe's foreknowledge undermines their preparation.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 28, INT: 18, LCK: 12 } },
  },
};

const INANNA_RELICS: DeityRelicPair = {
  deityId: 'inanna',
  weapon: {
    id: 'deity_inanna_weapon', name: "Descent Queen's Blade",
    lore: "She descended to the underworld through seven gates, surrendering a divine power at each one. She arrived naked and powerless before Ereshkigal. She was hung on a hook. She returned. No one explains how.",
    tier: 'deity', slot: 'weapon', deityId: 'inanna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I descended through seven gates and survived the one who killed gods. I returned with everything I surrendered reclaimed. My blade goes to those who descend to the deepest point and survive it: in a single run, reach Floor 20 with your HP below 15% at the time you ENTER Floor 20. Arrive at the deepest point nearly broken. Then survive Floor 20. The descent requires arriving vulnerable. The return requires surviving what awaits.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'custom', value: 1, targetType: 'enter_floor_20_below_15hp', description: 'Enter Floor 20 with HP below 15%' },
    ]},
    passiveId: 'inanna_blade_passive',
    passiveDescription: "Seven Gates Crossed: for each floor descended below Floor 10 in a single run, gain +4% damage (max +40% at Floor 20). The descent empowers — what Inanna surrendered at each gate, you gain in power instead.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_inanna_accessory', name: "Morning Star Earring",
    lore: "She is the morning star and the evening star — both the love that rises and the war that sets. The earring holds both times of day.",
    tier: 'deity', slot: 'accessory', deityId: 'inanna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am love and I am war. I am the first and the last light. My earring goes to those who carry both: in a single run reaching Floor 15, use Taunt in at least 5 combats AND defeat at least 3 bosses. Charm your enemies. Then slay them. The morning star rises in beauty and sets in conquest.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 5, description: 'Use Taunt in 5 combats in one run' },
      { metric: 'boss_kills_run', value: 3, description: 'Defeat at least 3 bosses in that run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
    ]},
    passiveId: 'inanna_earring_passive',
    passiveDescription: "Morning and Evening Star: Taunt reduces enemy damage by 30% (morning star softens the aggression). After killing any boss this run, all Taunt costs are halved for the rest of the run (the evening star of conquest empowers the morning star of charm).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 26, WIS: 20, LCK: 12 } },
  },
};

const LAMASHTU_RELICS: DeityRelicPair = {
  deityId: 'lamashtu',
  weapon: {
    id: 'deity_lamashtu_weapon', name: "Child-Dread Talon-Blade",
    lore: "She is the demon goddess who steals and eats children, causes miscarriages, and spreads disease. She is among the most feared entities in Mesopotamian belief. Pazuzu protects against her.",
    tier: 'deity', slot: 'weapon', deityId: 'lamashtu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am not invoked for protection. I am the thing that makes protection necessary. My talon-blade goes to those who inflict what should not be inflicted: apply the maximum number of different status effects to enemies in one run — use every status effect type available at least once in a single run reaching Floor 10. Every affliction. Every poison, every burn, every curse. Show me you carry my full palette.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 7, targetType: 'all_status_types_used', description: 'Apply every available status effect type at least once in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'lamashtu_talon_passive',
    passiveDescription: "Plague Bearer: all status effects you inflict have their duration extended by 1 turn. Additionally: when 3 or more different status effects are active on a single enemy simultaneously, they take +20% damage from all sources — the accumulated afflictions compound into something worse.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_lamashtu_accessory', name: "Fever-Dream Pendant",
    lore: "She is half lion, half bird, half donkey — three halves in impossible proportion. She holds a serpent in each hand. Her pendant induces fever dreams in anyone who wears it without her favor.",
    tier: 'deity', slot: 'accessory', deityId: 'lamashtu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fever makes the body fight itself. I make the world fight itself. My pendant goes to those who have willingly endured what most refuse: in a single run, have 5 different status effects inflicted on yourself and survive all of them to complete the run reaching Floor 10. Let the sickness come. Live through it. The demon of illness recognizes only those who cannot be broken by her tools.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, targetType: 'five_different_types_survived_in_run', description: 'Receive and survive 5 different status effect types in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'lamashtu_pendant_passive',
    passiveDescription: "Fever Immunity: negative status effects deal 30% less damage to you (you have endured her full affliction and learned to diminish it). Additionally: enemies that inflict status effects on you have those same effects reflected back on them at 50% potency on their next turn.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 25, INT: 20, WIS: 13 } },
  },
};

export const MESOPOTAMIAN_REMAINING_RELICS: DeityRelicPair[] = [
  EA_RELICS, NINURTA_RELICS, TIAMAT_RELICS, ENLIL_RELICS, NABU_RELICS,
  DUMUZI_RELICS, PAZUZU_RELICS, GILGAMESH_RELICS, NAMMU_RELICS,
  NISABA_RELICS, INANNA_RELICS, LAMASHTU_RELICS,
];
