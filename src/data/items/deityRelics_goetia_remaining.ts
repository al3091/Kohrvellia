/**
 * Ars Goetia Deity Relics — Remaining deities not in deityRelics_dark.ts
 * Glasya-Labolas, Gusion, Furfur, Marchosias, Phenex, Murmur, Vepar, Berith, Malphas, Orias
 * (17th deity in arsGoetia.ts is Orias — confirmed from file)
 */

import type { DeityRelicPair } from './deityRelics';

const GLASYA_LABOLAS_RELICS: DeityRelicPair = {
  deityId: 'glasya_labolas',
  weapon: {
    id: 'deity_glasya_labolas_weapon', name: "Bloodshed President's Blade",
    lore: "He is the President of Hell who teaches all arts and sciences — and causes murder, bloodshed, and the ruin of those who stand in his enemies' way. A Renaissance gentleman of chaos.",
    tier: 'deity', slot: 'weapon', deityId: 'glasya_labolas',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I cause bloodshed. That is my function and my art. My blade goes to those who have proven they do not shy from blood: take 400 total damage in a single run AND kill 30 enemies in that same run. Bleed and kill. Kill and bleed. The President of bloodshed only acknowledges those who have demonstrated his preferred combination.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 400, description: 'Take 400+ damage in one run' },
      { metric: 'kills_total', value: 30, targetType: 'in_that_same_run', description: 'Kill 30+ enemies in that same run' },
    ]},
    passiveId: 'glasya_labolas_blade_passive',
    passiveDescription: "Blood for Blood: for every 25 damage taken this run, deal +1% bonus damage (max +20% from 500 damage taken). The more you bleed, the more precise the President's teaching becomes.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_glasya_labolas_accessory', name: "Arts and Ruin Seal",
    lore: "He teaches all sciences while presiding over murder. The seal carries both lessons simultaneously.",
    tier: 'deity', slot: 'accessory', deityId: 'glasya_labolas',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "All sciences and bloodshed. Both. My seal goes to those who study and destroy in equal measure: in a single run reaching Floor 10, use the Observe action at least 10 times AND kill at least 20 enemies. Equal parts observation and murder. The President requires both his domains to be honored.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 10, description: 'Use Observe 10+ times in one run' },
      { metric: 'kills_total', value: 20, targetType: 'in_same_run', description: 'Kill 20+ enemies in that same run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'glasya_labolas_seal_passive',
    passiveDescription: "Dual Mastery: if you have both Observed and killed at least 3 enemies this combat, gain +20% damage for the rest of the combat — the President's dual arts in harmony create disproportionate power.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { STR: 22, PER: 20, END: 16 } },
  },
};

const GUSION_RELICS: DeityRelicPair = {
  deityId: 'gusion',
  weapon: {
    id: 'deity_gusion_weapon', name: "Honor-Restorer's Mace",
    lore: "He is the Duke of Hell who resolves disputes, reconciles enemies, and restores honor and dignity to those who have lost it. He answers all questions about the past, present, and future.",
    tier: 'deity', slot: 'weapon', deityId: 'gusion',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I restore dignity to the disgraced. I resolve disputes through wisdom. My mace goes to those who have faced disgrace and recovered it: die 2 times lifetime, then on the next character after those deaths, reach Level 3. You were disgraced by defeat. You returned with dignity restored. Gusion recognizes the arc of the restored.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 2, targetType: 'character_comes_after_two_deaths', description: 'This character started after at least 2 previous character deaths in the account' },
      { metric: 'level_reached', value: 3, description: 'Reach Level 3' },
    ]},
    passiveId: 'gusion_mace_passive',
    passiveDescription: "Restored Honor: +3% damage for each previous character death in your account history (max +24% from 8 deaths). The Duke of Reconciliation extracts dignity from every past failure.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_gusion_accessory', name: "Reconciliation Seal",
    lore: "Gusion's seal is used to bind disputes and restore friendships. It works on enemies. It has been tested.",
    tier: 'deity', slot: 'accessory', deityId: 'gusion',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I resolve what is unresolved. My seal goes to those who have proven they can resolve disputes without violence: bypass 3 bosses through dialogue across your lifetime. Three confrontations resolved through words. Gusion does not require that you fight what can be reasoned with.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 3, description: 'Bypass 3 bosses through dialogue lifetime' },
    ]},
    passiveId: 'gusion_seal_passive',
    passiveDescription: "Duke's Diplomacy: after bypassing a boss, gain +25% damage for the entire next floor (the resolved dispute empowers). Additionally: boss bypass attempts have +20% success rate — Gusion lends his skill to the negotiation.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { CHA: 26, WIS: 22 } },
  },
};

const FURFUR_RELICS: DeityRelicPair = {
  deityId: 'furfur',
  weapon: {
    id: 'deity_furfur_weapon', name: "Storm-Love Thunder Staff",
    lore: "He is an Earl of Hell who commands storms, thunder, and lightning — and who also causes love between man and woman. The tempest and the tender, in one.",
    tier: 'deity', slot: 'weapon', deityId: 'furfur',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I control both storms and love. The lightning and the longing. My staff goes to those who demonstrate both: in a single run reaching Floor 10, inflict a status effect on enemies at least 15 times AND use Taunt successfully at least 5 times. Storm and love. Thunder and charm. Both of Earl Furfur's domains must be honored.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 15, description: 'Inflict status effects 15+ times in one run' },
      { metric: 'taunt_total', value: 5, targetType: 'successful', description: 'Use Taunt successfully 5+ times in that run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'furfur_staff_passive',
    passiveDescription: "Storm and Love: status effects you inflict have a 25% chance to also Taunt the enemy (the thunder carries the longing). Conversely: after a successful Taunt, the enemy has a 25% chance to receive the Confusion status effect automatically.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.28, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_furfur_accessory', name: "Earl's Thunderstruck Token",
    lore: "His storms are the storms that strike lovers senseless and warriors speechless. The token has absorbed many direct strikes.",
    tier: 'deity', slot: 'accessory', deityId: 'furfur',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My lightning strikes with perfect targeting. My token goes to those who demonstrate equivalent precision: achieve 10 critical hits in a single run. Not in one combat — across the run. Ten moments of perfect timing when the lightning chose its precise landing.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_critical_hits_in_one_run', description: 'Land 10+ critical hits in a single run' },
    ]},
    passiveId: 'furfur_token_passive',
    passiveDescription: "Lightning Precision: +5% critical hit chance. Additionally: when a critical hit lands, there is a 30% chance the enemy is Stunned for 1 turn — the Earl's thunder strikes the nervous system.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 24, AGI: 20, LCK: 14 } },
  },
};

const MARCHOSIAS_RELICS: DeityRelicPair = {
  deityId: 'marchosias',
  weapon: {
    id: 'deity_marchosias_weapon', name: "Wolf-Phoenix Warrior Blade",
    lore: "He appears as a wolf with griffin's wings and a serpent's tail, spitting fire. He was once of the Order of Dominations and hopes to return to heaven after 1,200 years. He is an excellent fighter.",
    tier: 'deity', slot: 'weapon', deityId: 'marchosias',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was a Domination. I fell. I fight still, and with more than those who never fell. My blade goes to those who have fallen and fight harder for it: die 3 times total lifetime and then, on any subsequent character, defeat a boss without taking any damage during the fight. Fall three times. Then demonstrate mastery the fallen warrior achieves. I recognize it because I lived it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_character_deaths_before_this', description: 'At least 3 character deaths in account history before this attempt' },
      { metric: 'boss_noattack', value: 1, description: 'Defeat a boss without taking any damage during the fight' },
    ]},
    passiveId: 'marchosias_blade_passive',
    passiveDescription: "Warrior's Fallen Fury: +5% damage for each previous character death in account history (max +35% from 7 deaths). The Marquis Marchosias fights hardest for those who have paid the price of the fall.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 52, finalAccuracy: 93, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_marchosias_accessory', name: "Griffin Wing Brand",
    lore: "The griffin wing of his wolf form. It burns with the fire he spits. The brand carries his fire as a permanent mark.",
    tier: 'deity', slot: 'accessory', deityId: 'marchosias',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wings carry me above what once defeated me. My brand goes to those who demonstrate that they have risen above defeat: die in a run, then on the very next run, reach a deeper floor than the run in which you died. Fall further than you fell before. The phoenix wing carries you past the point of past failure.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'this_run_reached_deeper_than_previous_death_floor', description: 'This run reached a deeper floor than the floor of your previous character death' },
    ]},
    passiveId: 'marchosias_brand_passive',
    passiveDescription: "Wolf-Phoenix Fire: attacks deal +10% bonus fire damage (magic bonus alongside primary type). Additionally: when HP drops below 50%, gain +15% damage for 3 turns — the phoenix aspect ignites when the wolf is pressed.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 24, AGI: 18, END: 16 } },
  },
};

const PHENEX_RELICS: DeityRelicPair = {
  deityId: 'phenex',
  weapon: {
    id: 'deity_phenex_weapon', name: "Poet-Phoenix Quill-Blade",
    lore: "He appears as a phoenix singing sweet songs before taking human form. He teaches rhetoric, poetry, and science excellently. He wept when he was compelled to leave heaven. He has been weeping ever since.",
    tier: 'deity', slot: 'weapon', deityId: 'phenex',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I write poetry of loss because I have lost the most. My quill-blade goes to those who demonstrate knowledge's breadth through use: use 100 skills total across your lifetime — not one type, but the raw count of 100 skill uses. Every skill is a line of verse. One hundred lines make a poem. I will hear it when you reach that count.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 100, description: 'Use skills 100 times total lifetime' },
    ]},
    passiveId: 'phenex_quill_passive',
    passiveDescription: "Phoenix Song: at the start of each combat, there is a 20% chance an ally spirit (the phoenix's echo) appears and provides +15% damage bonus for 3 turns. The poet's song is heard by those who listen for it.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'CHA', finalDamage: 44, finalAccuracy: 93, finalCritChance: 0.28, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_phenex_accessory', name: "Eternal Weeping Feather",
    lore: "The tears of the phoenix that cannot stop weeping for heaven. The feather is perpetually damp. It is, the Marquis insists, worth it.",
    tier: 'deity', slot: 'accessory', deityId: 'phenex',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I weep because knowledge of what I lost is complete. The feather goes to those who have also looked at what they have lost clearly: die exactly on Floor 10 once lifetime — not Floor 9, not Floor 11. Floor 10. The phoenix's death altitude. One specific, precise loss. The weeping requires a specific grief, not a general one.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'die_exactly_floor_10_once', description: 'Die exactly on Floor 10 (not 9, not 11) once in any run lifetime' },
    ]},
    passiveId: 'phenex_feather_passive',
    passiveDescription: "Phoenix's Grief Made Strength: SP regenerates 1 extra point per turn (the eternal song plays even in silence). Additionally: after using any skill, restore 3 HP (the weeping sustains what continues despite loss).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { INT: 26, WIS: 18, CHA: 14 } },
  },
};

const MURMUR_RELICS: DeityRelicPair = {
  deityId: 'murmur',
  weapon: {
    id: 'deity_murmur_weapon', name: "Soul-Necromancer's Trumpet",
    lore: "He is a Duke and Earl of Hell who teaches philosophy, constrains souls, and forces them to appear before the summoner. He is accompanied by phantom trumpeters.",
    tier: 'deity', slot: 'weapon', deityId: 'murmur',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The souls I constrain answer my call. My trumpet goes to those who have sent enough souls to my domain: kill 300 enemies total across your lifetime. Three hundred souls constrained and answering my trumpet. The necromancer-philosopher requires a sufficient sample size for philosophy.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 300, description: 'Kill 300 enemies total lifetime' },
    ]},
    passiveId: 'murmur_trumpet_passive',
    passiveDescription: "Trumpet of the Dead: when you kill an enemy, there is a 15% chance their ghost lingers for 1 turn, attacking any remaining enemies in the combat for 30% of your weapon's damage. Murmur's constrained souls serve one final purpose.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.24, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_murmur_accessory', name: "Philosophical Constraint Ring",
    lore: "He teaches philosophy. His method: constrain a dead soul, have it deliver the philosophical lecture you need, then release it. Most efficient education system available.",
    tier: 'deity', slot: 'accessory', deityId: 'murmur',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Philosophy requires understanding the dead. My ring goes to those who have demonstrated patience in accumulated study: use the Observe action 80 times total across your lifetime. Eighty souls examined. Eighty philosophical constraints. The Duke's ring requires the breadth of a philosopher's investigation.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 80, description: 'Use Observe 80 times total lifetime' },
    ]},
    passiveId: 'murmur_ring_passive',
    passiveDescription: "Necromancer's Philosophy: after Observing an enemy, you know their remaining HP and their damage output range for the entire combat. The constrained soul reveals itself completely — Murmur extracts every answer.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 26, INT: 20 } },
  },
};

const VEPAR_RELICS: DeityRelicPair = {
  deityId: 'vepar',
  weapon: {
    id: 'deity_vepar_weapon', name: "Duke of Waters' Trident",
    lore: "He is a Duke who governs the waters, guides armadas of warships, and creates storms at sea. He also causes wounds to fester with infection. A maritime officer of Hell.",
    tier: 'deity', slot: 'weapon', deityId: 'vepar',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guide armadas and cause festering wounds. Water and infection — two things that flow and spread. My trident goes to those who have inflicted spreading harm: cause enemies to spread status effects to each other — the Bleed or Poison you inflict must trigger on 3 different enemies in the same run from one source. One wound spreading to three sailors.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 3, targetType: 'chain_status_spread_three_enemies', description: 'Inflict a spreading status effect that reaches 3 enemies in one run (via chain mechanics)' },
    ]},
    passiveId: 'vepar_trident_passive',
    passiveDescription: "Festering Waters: Poison and Bleed effects you inflict spread to adjacent enemies on their first tick (the wound infects everything near it). This spread is at 50% potency of the original.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_vepar_accessory', name: "Armada Commander's Compass",
    lore: "The compass guides armadas through the storms Vepar himself creates. It is a map of every danger on the sea — drawn by the danger himself.",
    tier: 'deity', slot: 'accessory', deityId: 'vepar',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guide ships through waters I make dangerous. The Duke of both the storm and the safe passage. My compass goes to those who navigate successfully through danger: complete 3 runs lifetime where you used flee at least 3 times per run AND still defeated a boss in that run. Retreat through the storm. Arrive to conquer.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_runs_three_flees_and_boss_kill', description: 'Complete 3 runs where you fled 3+ times AND killed a boss in each run, lifetime' },
    ]},
    passiveId: 'vepar_compass_passive',
    passiveDescription: "Armada Navigation: each flee action in a run adds +5% damage for the rest of that run (maximum +30% from 6 flees). The Duke who creates storms knows how to sail through them.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { AGI: 24, INT: 18, PER: 16 } },
  },
};

const BERITH_RELICS: DeityRelicPair = {
  deityId: 'berith',
  weapon: {
    id: 'deity_berith_weapon', name: "Alchemist-Liar's Red Sword",
    lore: "He wears red and rides a red horse. He is a Duke of Hell who knows how to transmute metals into gold, makes men dignified, and is a powerful liar who must be contained within a magic circle to prevent his deceptions.",
    tier: 'deity', slot: 'weapon', deityId: 'berith',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I transmute base metals into gold. I also transmute truth into comfortable deceptions. My sword goes to those who demonstrate alchemical mastery: accumulate 50,000 total gold across your lifetime — not in one run, but the transmutation of time and effort into gold. The alchemist's patience. The Duke's gold.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 50000, description: 'Accumulate 50,000 total gold lifetime' },
    ]},
    passiveId: 'berith_sword_passive',
    passiveDescription: "Gold Transmutation: gold dropped by bosses is doubled. Additionally: at the start of each run, convert 5% of your total current gold into a damage bonus for that run (1% damage per 1,000 gold converted, max +10% from 10,000 gold converted).",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_berith_accessory', name: "Red Duke's Dignity Medal",
    lore: "He makes men dignified. What this means in practice for demons and mortals alike remains imprecisely defined. The medal is surprisingly effective at making the wearer seem important.",
    tier: 'deity', slot: 'accessory', deityId: 'berith',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Dignity is the alchemy of self. My medal goes to those who prove they can command respect through presence alone: succeed in 3 Taunt actions in a row within the same combat — not over a run, but in ONE combat. Three consecutive taunts, same fight, all landing. The Red Duke makes men dignified. Show me you can command for a whole fight.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 3, targetType: 'three_consecutive_in_one_combat', description: 'Succeed in 3 consecutive Taunt actions in a single combat' },
    ]},
    passiveId: 'berith_medal_passive',
    passiveDescription: "Red Duke's Presence: CHA checks in events and Taunt attempts have +20% success rate. Additionally: after 3 successful Taunts in a combat, the enemy permanently has -25% attack for the rest of that fight — the dignified Duke reduces the opponent to submission.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { CHA: 26, LCK: 20 } },
  },
};

const MALPHAS_RELICS: DeityRelicPair = {
  deityId: 'malphas',
  weapon: {
    id: 'deity_malphas_weapon', name: "Fortress-Builder's Raven Staff",
    lore: "He appears as a crow before taking human form. He builds strong towers and fortresses, destroys enemies' fortifications, and commands forty legions. He speaks hoarsely.",
    tier: 'deity', slot: 'weapon', deityId: 'malphas',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I build and I destroy. The raven surveys the fortification before it falls. My staff goes to those who demonstrate this cycle: use the Defend action at least once AND deal the killing blow to an enemy in the SAME combat — in 5 different combats across your lifetime. Build defense. Then tear through offense. Five times the cycle must complete.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'defend_and_kill_same_combat_five_times', description: 'Use Defend and land the killing blow in the same combat — 5 times lifetime' },
    ]},
    passiveId: 'malphas_staff_passive',
    passiveDescription: "Fortress and Ruin: after using Defend in a combat, the next attack in that same combat deals +35% bonus damage. Build the wall — then break through it.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'STR', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.28, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_malphas_accessory', name: "Crow-Surveyor's Eye",
    lore: "The crow that surveys the battlefield before the President takes human form to begin his work. The eye is always looking ahead.",
    tier: 'deity', slot: 'accessory', deityId: 'malphas',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The crow surveys. Then the fortress falls. My eye goes to those who survey before they act: use Observe in every combat room on 2 consecutive floors in a single run. Every enemy on two consecutive floors studied before the attack. The crow surveys everything before the President acts.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'every_combat_two_consecutive_floors', description: 'Observe before attacking in every combat room on 2 consecutive floors in one run' },
    ]},
    passiveId: 'malphas_eye_passive',
    passiveDescription: "Raven's Survey: at the start of each floor, the mini-map shows an additional 2 rooms ahead (the crow surveys the path). Additionally: Observe reveals enemy defense value as well as standard information.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { PER: 28, WIS: 18 } },
  },
};

const ORIAS_RELICS: DeityRelicPair = {
  deityId: 'orias',
  weapon: {
    id: 'deity_orias_weapon', name: "Star-Virtue Shapeshifter Blade",
    lore: "He is a Marquis of Hell who appears as a lion riding a horse, with a serpent's tail, holding two hissing serpents. He transforms men into shapes, gives dignities and confirmations, and knows the virtues of stars.",
    tier: 'deity', slot: 'weapon', deityId: 'orias',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I know the virtues of every star and can transform any man into any shape. My blade goes to those who demonstrate stellar knowledge through virtue: in a single run reaching Floor 15, use every action type available at least 5 times each — basic attack, defend, observe, taunt, skill, and item. Every action type, each at least five times. The Marquis of stars counts each action as a virtue noted.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 5, description: 'Use Observe 5+ times in one run' },
      { metric: 'taunt_total', value: 5, description: 'Use Taunt 5+ times in one run' },
      { metric: 'skill_uses', value: 5, description: 'Use skills 5+ times in one run' },
      { metric: 'floor_noconsumable', value: 0, targetType: 'use_items_at_least_5', description: 'Use consumable items 5+ times in one run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
    ]},
    passiveId: 'orias_blade_passive',
    passiveDescription: "Stellar Virtues: for each unique action type used in a single combat (attack, defend, observe, taunt, skill, item), gain +8% damage for the rest of that combat (max +48% from all 6 types). The Marquis's star-knowledge illuminates every form of action.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_orias_accessory', name: "Transformation Sigil Ring",
    lore: "He transforms men into new shapes. The ring carries the transformative sigil — wear it and you are subtly different from what you were.",
    tier: 'deity', slot: 'accessory', deityId: 'orias',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I bestow dignities and transform what I choose. My ring goes to those who have proven themselves worthy of confirmation: reach Favoured Child status (91+ favor) with any deity while also having completed Level 5 on the same character. Dignity requires both the divine recognition AND the achievement of self. One without the other is incomplete.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 1, description: 'Reach 91+ favor with any deity' },
      { metric: 'level_reached', value: 5, description: 'Reach Level 5 on the same character' },
    ]},
    passiveId: 'orias_ring_passive',
    passiveDescription: "Marquis's Confirmation: favor gain with all deities is increased by 20% (the Marquis who bestows dignities accelerates the path to divine recognition). Additionally: at 50+ favor with your patron, all stats are treated as one grade higher for derived stat calculations.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { CHA: 25, WIS: 20, LCK: 13 } },
  },
};

export const GOETIA_REMAINING_RELICS: DeityRelicPair[] = [
  GLASYA_LABOLAS_RELICS, GUSION_RELICS, FURFUR_RELICS, MARCHOSIAS_RELICS,
  PHENEX_RELICS, MURMUR_RELICS, VEPAR_RELICS, BERITH_RELICS, MALPHAS_RELICS, ORIAS_RELICS,
];
