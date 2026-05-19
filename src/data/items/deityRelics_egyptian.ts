/**
 * Egyptian Deity Relics — all Egyptian deities (ra + anubis already in main deityRelics.ts)
 */

import type { DeityRelicPair } from './deityRelics';

const OSIRIS_RELICS: DeityRelicPair = {
  deityId: 'osiris',
  weapon: {
    id: 'deity_osiris_weapon', name: "Green Lord's Crook",
    lore: "He was scattered across Egypt. Isis reassembled him. He governs renewal now. The crook was the last piece.",
    tier: 'deity', slot: 'weapon', deityId: 'osiris',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was destroyed and remade. To earn my Crook: die and resurrect (start a new character) exactly 3 times — on each resurrection, reach at least Floor 5 on that new character's first run. Destruction is not the end. Return, three times. Prove the cycle.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'resurrections_with_floor5_first_run', description: 'Start 3 new characters after deaths, each reaching Floor 5 on their first run' },
    ]},
    passiveId: 'osiris_crook_passive',
    passiveDescription: "Green Renewal: each time you start a new dungeon run, this weapon gains +2 permanent damage (it grows with each beginning). Death is where it starts, not where it ends.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_osiris_accessory', name: "Was Scepter of the Dead",
    lore: "He judges the dead. The scepter ensures they know this.",
    tier: 'deity', slot: 'accessory', deityId: 'osiris',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The underworld receives all. My scepter goes to those who have faced it and returned: bypass 3 bosses through dialogue over your lifetime. Not kill them. Walk past them. I understand the pause before death. I want to see you demonstrate the same grace.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 3, description: 'Bypass 3 bosses through dialogue total lifetime' },
    ]},
    passiveId: 'osiris_scepter_passive',
    passiveDescription: "Judgment of Osiris: once per combat, extend any enemy's negative status effect duration by 3 turns (the judgment delays their end). Also: defeating undead enemies restores 5% HP.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 26, END: 20 } },
  },
};

const ISIS_RELICS: DeityRelicPair = {
  deityId: 'isis',
  weapon: {
    id: 'deity_isis_weapon', name: "Staff of a Thousand Names",
    lore: "She tricked Ra into revealing his true name and became one of the most powerful beings in existence. Methodology matters.",
    tier: 'deity', slot: 'weapon', deityId: 'isis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I mastered the Falna before Falna had a name. My staff goes to those who demonstrate true mastery of growth: in a single Blessing Rite ceremony, advance 4 or more stats by at least one full grade each. Show me you understand growth across the full spectrum — not just one pillar.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'four_grade_advances_single_blessing_rite', description: 'In a single Blessing Rite, advance 4+ stats by a full grade each' },
    ]},
    passiveId: 'isis_staff_passive',
    passiveDescription: "Magic of a Thousand Names: this weapon's damage type shifts to exploit enemy weaknesses automatically (it knows the enemy's true name). Also: all skill SP costs reduced by 15%.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 92, finalCritChance: 0.28, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_isis_accessory', name: "Wings of Protection",
    lore: "She spread her wings over Osiris to protect him. The wings carry that intention still.",
    tier: 'deity', slot: 'accessory', deityId: 'isis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I rebuilt what was scattered. My wings go to those who understand healing and reconstruction: heal 250 HP in a single combat using only your own abilities — no consumables. Your body must demonstrate it can put itself back together. That is what my wings protect: the capacity to heal.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'healing_received', value: 250, targetType: 'self_heal_no_consumables_single_combat', description: 'Heal 250+ HP in one combat using only skills/passive regen (no consumables)' },
    ]},
    passiveId: 'isis_wings_passive',
    passiveDescription: "Divine Restoration: once per run, Isis's wings activate — instantly restore you to 60% HP and remove all status effects. Wings activate when you would otherwise drop to 0 HP.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 28, CHA: 18 } },
  },
};

const HORUS_RELICS: DeityRelicPair = {
  deityId: 'horus',
  weapon: {
    id: 'deity_horus_weapon', name: "Eye of Horus Spear",
    lore: "He lost his eye fighting Set. He got it back. Then he gave it to his father. He has complicated feelings about eyes now.",
    tier: 'deity', slot: 'weapon', deityId: 'horus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I avenged my father against Set — the god of chaos. My spear goes to those who can do what I did: defeat an enemy of the opposite domain to your patron deity 50 times total lifetime. Find what opposes you. Fight it. Win. The Eye of Horus sees through opposition.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_type', value: 50, targetType: 'opposite_domain_enemies', description: 'Kill 50 enemies of the domain opposite your patron deity lifetime' },
    ]},
    passiveId: 'horus_spear_passive',
    passiveDescription: "Avenger's Strike: +30% damage against enemies of the domain opposing your patron's domain. Against all other enemies: +10% damage. The Eye of Horus never loses its target.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 100, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_horus_accessory', name: "Wedjat Eye Amulet",
    lore: "The Eye sees what the sky cannot — all the way through and underneath.",
    tier: 'deity', slot: 'accessory', deityId: 'horus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Wedjat Eye sees truth. To earn it: observe every enemy type on 3 consecutive complete floors at or beyond Floor 10 — every creature on each floor before engaging any. Your sight must be thorough. My Eye does not accept partial vision.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Floors must be 10+' },
      { metric: 'observe_total', value: 1, targetType: 'three_consecutive_complete_floors_all_observed', description: 'Observe every enemy on 3 consecutive floors (10+) before any kills' },
    ]},
    passiveId: 'horus_wedjat_passive',
    passiveDescription: "True Sight: observed enemies are permanently weakened (-10% damage, -10% defense) even if the observation was in a previous run. The Eye's memory is permanent.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { PER: 28, WIS: 20 } },
  },
};

const THOTH_RELICS: DeityRelicPair = {
  deityId: 'thoth',
  weapon: {
    id: 'deity_thoth_weapon', name: "Scribe's Khopesh",
    lore: "He invented writing. The khopesh is his argument that writing and combat are the same discipline.",
    tier: 'deity', slot: 'weapon', deityId: 'thoth',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I wrote down everything. The Book of the Dead, the calendar, the stars. My weapon goes to those who record everything: complete the full monster knowledge entry for 30 different enemy types — observed, fought, and fully recorded in the Bestiary. Write them all down. Then the khopesh is yours.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 30, targetType: 'complete_bestiary_30_types', description: 'Complete full Bestiary entries (observe + fight + record) for 30 enemy types' },
    ]},
    passiveId: 'thoth_khopesh_passive',
    passiveDescription: "Written Law: enemies whose Bestiary entries are complete take +15% damage from all sources. Additionally: once per floor, Thoth's knowledge provides a free Observe on the first combat — you never enter blind.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 95, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_thoth_accessory', name: "Tablet of Scribing",
    lore: "He recorded everything on tablets. This one is a small fragment of the larger record.",
    tier: 'deity', slot: 'accessory', deityId: 'thoth',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Tablet holds all that is inscribed upon it. To earn it: kill 5 different milestone boss types (the 5 bosses of the Tower) and observe each one before fighting. Thoth records the worthy. Add yourself to the record.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 5, targetType: 'different_bosses', description: 'Kill all 5 different milestone bosses lifetime' },
      { metric: 'observe_total', value: 5, targetType: 'boss_before_kill', description: 'Observe each before killing' },
    ]},
    passiveId: 'thoth_tablet_passive',
    passiveDescription: "Living Record: this accessory tracks every enemy type killed by your character. Enemies recorded on the Tablet (killed at least 10 times total) take +8% additional damage. The record grows forever.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 28, WIS: 22 } },
  },
};

const SEKHMET_RELICS: DeityRelicPair = {
  deityId: 'sekhmet',
  weapon: {
    id: 'deity_sekhmet_weapon', name: "Eye of the Sun Blade",
    lore: "She was sent to punish humanity. She got so caught up in the task that Ra had to flood the desert with beer to stop her. She considers this an overreaction.",
    tier: 'deity', slot: 'weapon', deityId: 'sekhmet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was sent to punish. I was stopped only by subterfuge. My blade goes to those who show equal unstoppable rage: defeat 100 enemies in a single run. One run, one hundred kills. Don't stop. Don't flee. Don't rest until the count is done. Show me what unstoppable looks like.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_total', value: 100, targetType: 'single_run_kills', description: 'Kill 100 enemies in a single run' },
    ]},
    passiveId: 'sekhmet_blade_passive',
    passiveDescription: "Unquenchable Rage: each kill adds 1% damage (up to +50%). The rage does not reset between floors. It only resets when the run ends. Sekhmet does not stop.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 52, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_sekhmet_accessory', name: "Lioness's Blood Amulet",
    lore: "The desert ran red. Ra filled it with beer dyed red. Sekhmet drank it thinking it was blood. This was considered a diplomatic solution.",
    tier: 'deity', slot: 'accessory', deityId: 'sekhmet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The blood trance made me unstoppable. My amulet goes to those who fight through blood: take 2,000 damage in a single run AND still defeat at least 3 milestone bosses in that run. Be hurt. Keep fighting. The trance does not end because you are bleeding.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 2000, description: 'Take 2,000 damage in one run' },
      { metric: 'boss_kills_run', value: 3, description: 'Still defeat 3 milestone bosses in that run' },
    ]},
    passiveId: 'sekhmet_amulet_passive',
    passiveDescription: "Blood Trance: when you drop below 40% HP, enter a trance state — +30% damage and immunity to the next 3 incoming hits. The trance lasts 5 turns per combat activation.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 28, END: 20 } },
  },
};

const BASTET_RELICS: DeityRelicPair = {
  deityId: 'bastet',
  weapon: {
    id: 'deity_bastet_weapon', name: "Cat's Grace Claws",
    lore: "She is grace and protection in equal measure. The claws are grace that happens to have points.",
    tier: 'deity', slot: 'weapon', deityId: 'bastet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Cats land on their feet. To earn my claws: survive falling to below 5% HP in combat 10 times total lifetime — and win those combats each time. The cat always lands. Show me 10 landings.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 10, targetType: 'win_combat_from_below_5hp', description: 'Win 10 combats after dropping below 5% HP, lifetime' },
    ]},
    passiveId: 'bastet_claws_passive',
    passiveDescription: "Nine Lives: the first time you drop to below 10% HP in a combat, your next attack is guaranteed critical. Also: you are immune to instant-kill effects. Cats do not die on schedule.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 44, finalAccuracy: 100, finalCritChance: 0.36, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_bastet_accessory', name: "Sacred Cat's Eye",
    lore: "Cats were sacred in Egypt. Anyone who harmed one answered to her. This is that answer, distilled.",
    tier: 'deity', slot: 'accessory', deityId: 'bastet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Cats protect the home. My eye goes to those who protect themselves with grace: complete a run to Floor 10 without ever using the Defend action — pure dodge and offense, no defensive posture. Cats do not crouch behind shields. They move.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'floor_nodefend', value: 10, description: 'Zero Defend action uses the entire run' },
    ]},
    passiveId: 'bastet_eye_passive',
    passiveDescription: "Feline Grace: +20% dodge chance for enemies' first attack in any combat. When you dodge, your next attack is +30% damage (the cat counter-pounces). Grace and lethality are the same thing.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 28, PER: 20 } },
  },
};

const SET_RELICS: DeityRelicPair = {
  deityId: 'set',
  weapon: {
    id: 'deity_set_weapon', name: "Was Scepter of Chaos",
    lore: "He killed his brother. He fought Horus for 80 years. He was eventually given the desert. He considers this adequate.",
    tier: 'deity', slot: 'weapon', deityId: 'set',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am storms and chaos and the desert that kills everything that enters it. My scepter goes to those who are equally indiscriminate: kill 25 enemies of the domain directly opposing your patron deity, in a single run. Fight what fights against everything you represent. Win anyway.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_type', value: 25, targetType: 'opposite_domain_single_run', description: 'Kill 25 enemies of the domain opposing your patron in one run' },
    ]},
    passiveId: 'set_scepter_passive',
    passiveDescription: "Desert Storm: each time you deal damage to an enemy of an opposing domain, release a storm burst hitting all enemies for 10% of weapon damage. Chaos spreads.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 52, finalAccuracy: 88, finalCritChance: 0.30, range: 'melee', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_set_accessory', name: "Storm God's Band",
    lore: "He controls the storm because he IS the storm. He has never been calm.",
    tier: 'deity', slot: 'accessory', deityId: 'set',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Chaos does not follow rules. My band goes to those who embrace disorder: complete a run to Floor 15 where you NEVER followed the same pattern in combat twice consecutively — alternate weapons type, alternate actions, never repeat the same decision twice in a row. Be chaotic. Be Set.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'no_consecutive_same_action_sequence', description: 'Never use the same action sequence twice consecutively throughout the run' },
    ]},
    passiveId: 'set_band_passive',
    passiveDescription: "Storm Surge: dealing damage with any action triggers a 15% chance for a secondary 'chaos strike' doing 30% bonus damage of a random damage type. Chaos cannot be predicted.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 25, LCK: 20 } },
  },
};

const MAAT_RELICS: DeityRelicPair = {
  deityId: 'maat',
  weapon: {
    id: 'deity_maat_weapon', name: "Feather Sword of Truth",
    lore: "Her feather weighs nothing and everything simultaneously. The sword holds that paradox.",
    tier: 'deity', slot: 'weapon', deityId: 'maat',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am truth and cosmic order. My sword goes to those who walk a clean line: complete a run to Floor 20 without ever fleeing, without ever using a consumable, and without ever using the Defend action. Absolute directness. No shortcuts. No excuses. The scale measures exactly what is there.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero retreats' },
      { metric: 'floor_noconsumable', value: 20, description: 'Zero consumables used' },
      { metric: 'floor_nodefend', value: 20, description: 'Zero Defend uses' },
    ]},
    passiveId: 'maat_sword_passive',
    passiveDescription: "Absolute Truth: damage cannot be reduced below 1 (enemies cannot completely resist or deflect). Also: your attacks ignore 30% of all defense. Truth passes through everything.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'PER', finalDamage: 48, finalAccuracy: 100, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_maat_accessory', name: "Ostrich Feather of Ma'at",
    lore: "The feather that weighs hearts. It weighs yours now. You should feel something.",
    tier: 'deity', slot: 'accessory', deityId: 'maat',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My feather weighs only what is real. To earn it: complete 7 consecutive achievement selections at level-up that are all HEROIC or LEGENDARY tier — no STANDARD tier at any of those 7 ceremonies. The heart must carry no lightness. Only true weight earns the feather.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'achievements_total', value: 7, targetType: 'seven_consecutive_heroic_or_legendary', description: '7 consecutive HEROIC or LEGENDARY tier achievements selected at level-up, no STANDARD' },
    ]},
    passiveId: 'maat_feather_passive',
    passiveDescription: "Perfect Balance: when your combat record for the current run has zero retreats and zero failed actions: +20% all damage and +15% all defense. Ma'at rewards the unblemished.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 30, END: 18 } },
  },
};

const SOBEK_RELICS: DeityRelicPair = {
  deityId: 'sobek',
  weapon: {
    id: 'deity_sobek_weapon', name: "Crocodile God's Fang",
    lore: "He is the Nile. He is what the Nile eats. He finds this arrangement acceptable.",
    tier: 'deity', slot: 'weapon', deityId: 'sobek',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The crocodile waits. The crocodile is patient. Then the crocodile acts with complete commitment. My fang goes to those who demonstrate the same: in 10 combats total lifetime, win without attacking on turn 1 — wait, then strike on turn 2 with the killing blow. One patient wait. One decisive end.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'win_combat_first_attack_turn2_kills', description: 'Win 10 combats where you did not attack on turn 1, and won on turn 2' },
    ]},
    passiveId: 'sobek_fang_passive',
    passiveDescription: "Crocodile Strike: if you have not attacked on turn 1, your turn 2 attack deals +80% damage and has guaranteed critical hit. The ambush from still water.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 54, finalAccuracy: 88, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_sobek_accessory', name: "Crocodile Skin Ward",
    lore: "Crocodile hide. Not the fake kind.",
    tier: 'deity', slot: 'accessory', deityId: 'sobek',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The hide turns away what should kill. My ward goes to those with sufficient thickness: survive 5 combats where you took more than 100 damage in a single hit — and won anyway. The crocodile absorbs. Then proceeds.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 5, targetType: 'win_after_taking_100plus_single_hit', description: 'Win 5 combats where you took 100+ damage in a single hit, lifetime' },
    ]},
    passiveId: 'sobek_ward_passive',
    passiveDescription: "Ancient Hide: reduce any single hit that would deal 50+ damage by 30%. The massive hits are what the hide was made for. Small attacks are irrelevant to the crocodile.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 30, STR: 18 } },
  },
};

const PTAH_RELICS: DeityRelicPair = {
  deityId: 'ptah',
  weapon: {
    id: 'deity_ptah_weapon', name: "Creator's Djed Staff",
    lore: "He created the world by speaking it. The staff was in his hand during the speaking.",
    tier: 'deity', slot: 'weapon', deityId: 'ptah',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I created through craft and word. My staff goes to those who understand creation through accumulation: upgrade 15 weapons at the Blacksmith total lifetime. Not the same weapon. 15 total upgrade actions. The smith's craft grows through repetition.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_upgrades', value: 15, description: 'Perform 15 weapon upgrade actions at the Blacksmith lifetime' },
    ]},
    passiveId: 'ptah_staff_passive',
    passiveDescription: "Creator's Touch: each weapon upgrade performed at the Blacksmith permanently adds +2 flat damage to this staff (lifetime counter, never resets). Creation compounds.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ptah_accessory', name: "Craftsman's Menat",
    lore: "Ptah is patron of craftsmen. This is their highest honor.",
    tier: 'deity', slot: 'accessory', deityId: 'ptah',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Creation requires dedicated investment. My Menat goes to those who spend on craft: spend 20,000 gold at the Blacksmith total lifetime. The craftsman pours resources into the craft. Show me you respect what it costs.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_spent_blacksmith', value: 20000, description: 'Spend 20,000 gold at the Blacksmith lifetime' },
    ]},
    passiveId: 'ptah_menat_passive',
    passiveDescription: "Master Craft: weapon upgrade quality gains +1 tier when you upgrade (standard→good upgrades to good→superior quality jump). The craftsman's tools improve every result.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 22, INT: 20 } },
  },
};

const NEPHTHYS_RELICS: DeityRelicPair = {
  deityId: 'nephthys',
  weapon: {
    id: 'deity_nephthys_weapon', name: "Shadow Wing Blade",
    lore: "She is death's guardian, the one who protects the dead. The blade is the protection part.",
    tier: 'deity', slot: 'weapon', deityId: 'nephthys',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I mourn the dead and protect their passage. My blade goes to those who understand the weight of loss: die 5 times on the same floor level across different runs — not the same floor number, but the same relative depth (if you first died on Floor 3, die 5 times more on Floor 3-equivalent across other runs). Return to the same threshold. Learn from it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_deaths_on_same_floor_level', description: 'Die 5 times on the same floor number across different runs lifetime' },
    ]},
    passiveId: 'nephthys_blade_passive',
    passiveDescription: "Shadow Wings: after any combat where you lost more than 40% HP, the next combat of that floor begins with you having +20% damage and +15% defense (mourning transforms to protection).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_nephthys_accessory', name: "Mourning Veil",
    lore: "She wept for Osiris. Her tears preserved him. These tears have a different application.",
    tier: 'deity', slot: 'accessory', deityId: 'nephthys',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My veil protects the dead from what follows them. To earn it: complete 3 dungeon runs where, on each run, you survived to the end after having been at 5% HP or below at some point. Come close to the veil. Walk away from it. Three times.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'complete_runs_after_reaching_5_percent_hp', description: 'Complete 3 runs where you were at 5% HP or below but survived to run end' },
    ]},
    passiveId: 'nephthys_veil_passive',
    passiveDescription: "Protective Shadow: when below 20% HP, incoming damage is reduced by 25%. Additionally: enemies cannot deal killing blows with status-effect ticks (you survive status damage at 1 HP minimum).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 25, WIS: 20 } },
  },
};

const NUT_RELICS: DeityRelicPair = {
  deityId: 'nut',
  weapon: {
    id: 'deity_nut_weapon', name: "Starborn Crescent",
    lore: "She is the sky. Every star you see is her body. The crescent is her smile.",
    tier: 'deity', slot: 'weapon', deityId: 'nut',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I arch over everything. Every star is a part of my form. My crescent goes to those who reach heights: reach Floor 30 in a single run. Ascend high enough that you can see the stars from below. That is where I begin.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 30, description: 'Reach Floor 30 in a single run' },
    ]},
    passiveId: 'nut_crescent_passive',
    passiveDescription: "Sky Arch: damage increases by 2% per floor descended beyond Floor 10 (max +40% at Floor 30). The higher you go, the more you carry the sky's weight as power.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 98, finalCritChance: 0.30, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_nut_accessory', name: "Night Sky Collar",
    lore: "She swallows the sun each evening and gives birth to it each dawn. As jewelry goes, this is tame.",
    tier: 'deity', slot: 'accessory', deityId: 'nut',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I hold all stars in my body. My collar goes to those who show they can hold many things at once: in a single run, use at least 15 different skill types (15 distinct named skills, not types). Show me you carry a full sky of options.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 15, targetType: 'fifteen_different_skill_names', description: 'Use 15 different named skills in a single run' },
    ]},
    passiveId: 'nut_collar_passive',
    passiveDescription: "Infinite Sky: your skill slots can hold one additional skill (effectively +1 skill slot while wearing this). The sky is limitless — so is your reach.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 25, WIS: 20 } },
  },
};

const GEB_RELICS: DeityRelicPair = {
  deityId: 'geb',
  weapon: {
    id: 'deity_geb_weapon', name: "Earthshaker's Staff",
    lore: "His laughter causes earthquakes. His tears are floods. He tries to be reserved about this.",
    tier: 'deity', slot: 'weapon', deityId: 'geb',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The earth endures. My staff goes to those who demonstrate endurance above all: reach Level 5 with a character whose END stat is at grade A or higher. Root yourself in this Tower. Become unmovable. Then I will give you the tool to move others.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'stats_grade', value: 1, targetType: 'END_grade_A_or_higher', description: 'END stat at grade A or higher' },
    ]},
    passiveId: 'geb_staff_passive',
    passiveDescription: "Unmovable Ground: all knockback, push, and displacement effects have no effect on you. Also: +20% damage against enemies that have been previously stunned or slowed (the earth breaks what cannot move).",
    weaponStats: { scalingStat: 'END', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_geb_accessory', name: "Stone Foundation Bangle",
    lore: "The earth does not move unless moved. This bangle contains the stubbornness of mountains.",
    tier: 'deity', slot: 'accessory', deityId: 'geb',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Foundation requires never breaking. My bangle goes to those who have never been knocked down: complete 10 full runs lifetime without dying on any of them — 10 clean survivals from start to run-end. The earth does not crack. Build that kind of foundation.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 10, targetType: 'ten_complete_runs_no_death', description: '10 complete dungeon runs without dying, lifetime' },
    ]},
    passiveId: 'geb_bangle_passive',
    passiveDescription: "Stone Foundation: +15% max HP. Physical damage reduction +10%. Once per floor: when hit by an attack that would deal more than 20% max HP damage in one hit, absorb 30% of that excess damage.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 30, STR: 18 } },
  },
};

export const EGYPTIAN_DEITY_RELICS: DeityRelicPair[] = [
  OSIRIS_RELICS, ISIS_RELICS, HORUS_RELICS, THOTH_RELICS, SEKHMET_RELICS,
  BASTET_RELICS, SET_RELICS, MAAT_RELICS, SOBEK_RELICS, PTAH_RELICS,
  NEPHTHYS_RELICS, NUT_RELICS, GEB_RELICS,
];
