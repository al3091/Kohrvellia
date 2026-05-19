/**
 * Western Deity Relics — Celtic and Mesopotamian pantheons
 */

import type { DeityRelicPair } from './deityRelics';

// ===== CELTIC =====

const DAGDA_RELICS: DeityRelicPair = {
  deityId: 'dagda',
  weapon: {
    id: 'deity_dagda_weapon', name: "Lorg Mór (Great Club)",
    lore: "One end kills. The other end resurrects. He uses the killing end more often.",
    tier: 'deity', slot: 'weapon', deityId: 'dagda',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the Good God. I provide abundance. My club kills with one end and heals with the other. To earn it: in a single run to Floor 15, use healing items or rest sites at least 10 times AND kill at least 60 enemies. Both ends of the club. Feed and fight.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'healing_received', value: 10, description: 'Use healing items/rest sites 10+ times in one run' },
      { metric: 'kills_total', value: 60, targetType: 'single_run_kills', description: 'Kill 60+ enemies in that same run' },
    ]},
    passiveId: 'dagda_club_passive',
    passiveDescription: "Great Club's Duality: kills restore 5% HP. Also: rest sites used in the same run as 30+ kills restore 100% instead of 50% HP (abundance generates abundance).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 52, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_dagda_accessory', name: "Cauldron Shard",
    lore: "His cauldron never runs empty. This shard carries that quality.",
    tier: 'deity', slot: 'accessory', deityId: 'dagda',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Cauldron provides endless sustenance. My shard goes to those who prove they can endure: use 50 healing sources total lifetime (rest sites, consumables, regeneration — any source, any character). Show me you keep the cauldron filled.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 50, description: 'Receive healing 50 times from any source lifetime' },
    ]},
    passiveId: 'dagda_cauldron_passive',
    passiveDescription: "Endless Cauldron: SP regenerates 2 per turn during combat (the cauldron always refills). Also: consumables can be used one extra time per run before being consumed (they get one refill).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 24, WIS: 20 } },
  },
};

const MORRIGAN_RELICS: DeityRelicPair = {
  deityId: 'morrigan',
  weapon: {
    id: 'deity_morrigan_weapon', name: "Crow Queen's Spear",
    lore: "She appeared as a crow before battles to predict outcomes. She was usually right.",
    tier: 'deity', slot: 'weapon', deityId: 'morrigan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I choose the slain on Irish battlefields. To earn my spear: kill 5 milestone bosses total lifetime. Five choices. Five fates. Show me you can be the deciding force in that many battles.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 5, description: 'Kill 5 milestone bosses total lifetime (any combination)' },
    ]},
    passiveId: 'morrigan_spear_passive',
    passiveDescription: "Battle Prophecy: at the start of any boss fight, you receive a prophetic vision — the boss's HP bar and an indicator of whether victory is likely (based on your current stats vs boss stats). The crow sees the outcome before the battle.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_morrigan_accessory', name: "Triple Crow Brooch",
    lore: "She is three: Badb, Macha, and Nemain. All war, in different aspects.",
    tier: 'deity', slot: 'accessory', deityId: 'morrigan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am three aspects of war. My brooch goes to those who have mastered all three: in a single run, win combats using each of the three core damage types — physical, magic, and dark. All three voices of war. In one descent.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'win_combats_with_physical_magic_dark_same_run', description: 'Win combats using all three: physical-type damage, magic-type damage, and dark-type damage in one run' },
    ]},
    passiveId: 'morrigan_brooch_passive',
    passiveDescription: "Triple Aspect: damage type cycles per combat (physical → magic → dark → physical). You always deal the type that the current enemy is most vulnerable to. The Morrigan sees weakness.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, INT: 20, WIS: 15 } },
  },
};

const BRIGID_RELICS: DeityRelicPair = {
  deityId: 'brigid',
  weapon: {
    id: 'deity_brigid_weapon', name: "Sacred Flame Forged Blade",
    lore: "She is healing, poetry, and smithcraft. The blade is the smithcraft part, informed by the others.",
    tier: 'deity', slot: 'weapon', deityId: 'brigid',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My sacred flame never goes out. It was tended for 1,000 years. My blade goes to those who demonstrate equivalent persistence in craft: upgrade 5 weapons to Masterwork or Legendary quality lifetime. Not repairs. Not identifications. Upgrades to the highest tiers.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_legendary', value: 2, description: 'Upgrade 2 weapons to Legendary quality lifetime' },
      { metric: 'weapon_upgrades', value: 8, description: 'Perform 8+ weapon upgrades total lifetime' },
    ]},
    passiveId: 'brigid_blade_passive',
    passiveDescription: "Sacred Forge: weapons upgraded at the Blacksmith while this is equipped gain the 'Brigid's Blessing' enchantment — +5% critical chance permanently. The sacred flame touches the craft.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_brigid_accessory', name: "Imbolc Flame Votive",
    lore: "The spring festival flame. It marks the turning of winter.",
    tier: 'deity', slot: 'accessory', deityId: 'brigid',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Poetry, healing, and fire — three aspects of making. My votive goes to those who embody making: use 30 rest sites lifetime AND complete 5 event rooms that tested your WIS or INT stat AND apply burn 30 times. Three arts. All at once.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'rest_sites_used', value: 30, description: '30 rest sites used lifetime' },
      { metric: 'event_success', value: 5, targetType: 'WIS_or_INT_checks', description: '5 event rooms with WIS/INT checks passed' },
      { metric: 'status_inflict', value: 30, targetType: 'burn', description: '30 burn applications lifetime' },
    ]},
    passiveId: 'brigid_votive_passive',
    passiveDescription: "Triple Flame: rest sites restore +30% bonus HP. WIS and INT based skills cost -15% SP. Burn effects deal +25% more damage. All three sacred flames burn together.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 22, INT: 18, END: 15 } },
  },
};

const LUGH_RELICS: DeityRelicPair = {
  deityId: 'lugh',
  weapon: {
    id: 'deity_lugh_weapon', name: "Luin of Celtchar (Long Arm's Spear)",
    lore: "He is master of all arts. He demanded entry to the otherworld by naming his skills one by one. There were many.",
    tier: 'deity', slot: 'weapon', deityId: 'lugh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the master of all skills. To earn my spear of the Long Arm: use 200 skill activations total in a single run. Not 200 uses of one skill — 200 total, any combination. Show me you understand that mastery means breadth as well as depth.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 200, description: 'Use skills 200 total times in one run' },
    ]},
    passiveId: 'lugh_spear_passive',
    passiveDescription: "Long Arm: this spear hits from any range without penalty (functions as both melee and ranged). Additionally: the 10th skill use of any combat deals +50% bonus damage (the master's decisive strike).",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 100, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_lugh_accessory', name: "Master's Samildánach Ring",
    lore: "Samildánach means 'skilled in all arts.' He demanded they find one person equal to him at any art. They couldn't.",
    tier: 'deity', slot: 'accessory', deityId: 'lugh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "All arts. To earn my ring: complete the Blessing Rite with all 8 stats showing proficiency gains in a single ceremony. Not just gains — proficiency on every stat, in one ceremony. I mastered everything. Show me you can, even for a moment.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'blessing_rite_all_8_stats_proficiency', description: 'Complete a Blessing Rite where all 8 stats have proficiency registered' },
    ]},
    passiveId: 'lugh_ring_passive',
    passiveDescription: "All Arts: +5% effectiveness on all stat-based actions (STR attacks, WIS checks, CHA interactions). The master's ring amplifies universal skill.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 20, INT: 18, WIS: 15 } },
  },
};

const CERNUNNOS_RELICS: DeityRelicPair = {
  deityId: 'cernunnos',
  weapon: {
    id: 'deity_cernunnos_weapon', name: "Wild Hunt's Antler Staff",
    lore: "He is the lord of the wild hunt and all living things. The antlers are his. The staff was always his.",
    tier: 'deity', slot: 'weapon', deityId: 'cernunnos',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The wild hunt takes what is natural to take. My staff goes to those who respect the natural order: kill 100 enemies using PER or AGI-scaling weapons lifetime. Hunters who use precision and speed — not brute force — understand the wild.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_with_stat', value: 100, targetType: 'PER_or_AGI', description: 'Kill 100 enemies with PER or AGI-scaling weapons lifetime' },
    ]},
    passiveId: 'cernunnos_staff_passive',
    passiveDescription: "Wild Hunt: nature-type enemies (beasts, plants, elementals) take +25% damage. Also: when you kill an enemy on the first floor you descend to, gain a +10% damage bonus for the rest of that floor (the hunt's opening strike).",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 100, finalCritChance: 0.32, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_cernunnos_accessory', name: "Antler Crown",
    lore: "He is the Horned One. Those who wear the crown of antlers are recognized by the forest.",
    tier: 'deity', slot: 'accessory', deityId: 'cernunnos',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The forest protects those it recognizes. My crown goes to those who have explored deeply: open and complete 30 mystery rooms total lifetime. The wild is full of unknowns. Those who seek them out are the wild's own.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 30, description: 'Complete 30 mystery rooms lifetime' },
    ]},
    passiveId: 'cernunnos_crown_passive',
    passiveDescription: "Forest Lord: mystery room outcomes are always the most favorable available. Also: when traversing the dungeon, you sense hidden rooms (mystery and treasure rooms are marked on the floor map before entering).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { PER: 28, AGI: 20 } },
  },
};

const NUADA_RELICS: DeityRelicPair = {
  deityId: 'nuada',
  weapon: {
    id: 'deity_nuada_weapon', name: "Fragarach the Answerer",
    lore: "No armor could stop it. No one could lie while it was at their throat. It was one of the four treasures of the Tuatha Dé Danann.",
    tier: 'deity', slot: 'weapon', deityId: 'nuada',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fragarach cannot be stopped. My sword goes to those who prove they cannot be stopped either: complete a run to Floor 20 without any attack of yours being blocked or resisted (zero attacks negated by immunity or resistance). The Answerer finds the gap in every defense.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'custom', value: 0, targetType: 'zero_attacks_blocked_resisted', description: 'Zero attacks negated by immunity/resistance the entire run' },
    ]},
    passiveId: 'nuada_fragarach_passive',
    passiveDescription: "The Answerer: ignores all enemy damage immunities and resistances. Also: no enemy can flee from you — any enemy that would flee instead freezes for 1 turn.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 54, finalAccuracy: 100, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_nuada_accessory', name: "Silver Hand's Grip",
    lore: "He lost his hand in battle. The Tuatha Dé made him a silver hand. He became king again.",
    tier: 'deity', slot: 'accessory', deityId: 'nuada',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was disqualified as king for losing my hand, then restored when I was made whole again. My grip goes to those who overcome disadvantage: start a run with a non-legendary, non-masterwork weapon (common or below) and still defeat at least 2 milestone bosses. Win with less. Prove sovereignty requires no ideal conditions.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 2, description: 'Defeat 2 milestone bosses in one run' },
      { metric: 'custom', value: 1, targetType: 'run_started_with_common_or_worse_weapon', description: 'Run started with a Common or Poor quality weapon' },
    ]},
    passiveId: 'nuada_grip_passive',
    passiveDescription: "King's Restoration: weapon damage is boosted based on quality difference from Legendary — Common weapon: +40% damage bonus. Poor weapon: +60% damage bonus. The silver hand compensates completely.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 26, END: 22 } },
  },
};

const MANANNAN_RELICS: DeityRelicPair = {
  deityId: 'manannan',
  weapon: {
    id: 'deity_manannan_weapon', name: "Fragarach's Lesser Twin",
    lore: "He rules the sea and the otherworld. He once confused an army by making himself appear as a thousand men.",
    tier: 'deity', slot: 'weapon', deityId: 'manannan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I rule the mists between worlds. My weapon goes to those who move between danger and safety fluidly: in a single run, flee from an elite enemy AND then return to the same floor and defeat the floor boss. Mist retreat, then advance. The sea of mist flows both ways.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_elite', value: 1, description: 'Flee from an elite enemy in one run' },
      { metric: 'boss_kills_run', value: 1, description: 'Then defeat the floor boss in that same run' },
    ]},
    passiveId: 'manannan_weapon_passive',
    passiveDescription: "Sea Mist: once per floor, step into the mist — become invisible to all enemies for 2 turns (they cannot target you). While invisible: your attacks deal +30% damage from the mist cover.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_manannan_accessory', name: "Féth Fíada Mist Cloak",
    lore: "The fairy mist that makes its wearer invisible. He uses it for everything.",
    tier: 'deity', slot: 'accessory', deityId: 'manannan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The mist hides the path between worlds. My cloak goes to those who successfully fled from combat 30 times total lifetime — and never lost a resource or item to any of those retreats. Clean escapes. The mist carries you out intact.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'flee_total', value: 30, description: '30 successful flee attempts lifetime' },
    ]},
    passiveId: 'manannan_cloak_passive',
    passiveDescription: "Otherworld Path: when you flee, you exit into the mist — the next floor you enter begins with all enemies on that floor having already been Observed (the mist shows you what awaits).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 26, WIS: 18 } },
  },
};

const OGMA_RELICS: DeityRelicPair = {
  deityId: 'ogma',
  weapon: {
    id: 'deity_ogma_weapon', name: "Champion's Mace",
    lore: "He invented the ogham alphabet. He was also the champion of the Tuatha Dé Danann. Both jobs required precision.",
    tier: 'deity', slot: 'weapon', deityId: 'ogma',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The alphabet captures knowledge. My mace goes to those who have the knowledge to use it: complete full Bestiary entries for 20 different enemy types AND reach Level 4 on the same character. Warrior-scholars. That is Ogma's mark.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 4, description: 'Reach Level 4' },
      { metric: 'observe_total', value: 20, targetType: 'complete_bestiary_entries', description: 'Complete 20 Bestiary entries (observe + fight + record)' },
    ]},
    passiveId: 'ogma_mace_passive',
    passiveDescription: "Ogham Inscription: enemies whose Bestiary entries are complete take +20% damage from this weapon specifically (you have written their name — Ogma's power resonates).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ogma_accessory', name: "Ogham Stone Pendant",
    lore: "Text carved into standing stones. The pendant carries the weight of written memory.",
    tier: 'deity', slot: 'accessory', deityId: 'ogma',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Writing preserves what memory forgets. My pendant goes to those who observe beyond their need: observe 50 enemies total lifetime — not just before fighting them, but simply to record them. Knowledge for its own sake. The champion-scholar records first.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 50, description: 'Use Observe 50 times total lifetime' },
    ]},
    passiveId: 'ogma_pendant_passive',
    passiveDescription: "Written Record: each time you use Observe, permanently add that enemy type to your knowledge — enemies in your record take +8% damage from all sources. The inscription holds power.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 26, WIS: 22 } },
  },
};

const ARAWN_RELICS: DeityRelicPair = {
  deityId: 'arawn',
  weapon: {
    id: 'deity_arawn_weapon', name: "Annwn's Edge",
    lore: "He rules the Welsh underworld. He traded places with Pwyll for a year to deal with an enemy. He considers this a management approach.",
    tier: 'deity', slot: 'weapon', deityId: 'arawn',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The otherworld takes everyone in the end. My edge goes to those who understand patient inevitability: defeat 3 milestone bosses in 3 separate runs where, in each run, you bypassed at least 1 other boss by dialogue. Claim what needs claiming. Let the rest pass when it can.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 3, targetType: 'different_bosses', description: 'Kill 3 different bosses in 3 separate runs lifetime' },
      { metric: 'boss_bypass', value: 3, description: 'Also bypass 3 bosses through dialogue total lifetime' },
    ]},
    passiveId: 'arawn_edge_passive',
    passiveDescription: "Otherworld's Patience: +15% damage against enemies that have already acted at least 3 times this combat (the inevitable end comes after sufficient time). Also: dark-type damage +20%.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_arawn_accessory', name: "Hound of Annwn Collar",
    lore: "His hounds are white with red ears. They hunt souls. This is a collar that was once on one of them.",
    tier: 'deity', slot: 'accessory', deityId: 'arawn',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My hounds find what hides. To earn the collar: find and clear 10 mystery rooms in a single run. Seek what is hidden. Arawn's hounds never stop hunting.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 10, description: 'Complete 10 mystery rooms in one run' },
    ]},
    passiveId: 'arawn_collar_passive',
    passiveDescription: "Hound's Hunt: +1 extra mystery room appears on each floor. Also: mystery room items are always identified (you never find unidentified items in mystery rooms — Annwn's hounds already know what they are).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { PER: 26, WIS: 18 } },
  },
};

// ===== MESOPOTAMIAN =====

const MARDUK_RELICS: DeityRelicPair = {
  deityId: 'marduk',
  weapon: {
    id: 'deity_marduk_weapon', name: "Dragon-Slayer's Blade",
    lore: "He killed Tiamat and made the earth and sky from her body. Creation through victory.",
    tier: 'deity', slot: 'weapon', deityId: 'marduk',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I slew the primordial chaos and made ordered creation from it. My blade goes to those who bring order through overwhelming force: defeat a milestone boss with maximum damage dealt in the fight — kill it in 5 turns or fewer. Order through decisive victory.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Defeat any milestone boss' },
      { metric: 'custom', value: 1, targetType: 'boss_killed_within_5_turns', description: 'Kill the boss within 5 combat turns' },
    ]},
    passiveId: 'marduk_blade_passive',
    passiveDescription: "Order From Chaos: in any combat that ends within 5 turns, deal +25% bonus damage on all attacks. The shorter the battle, the more decisive the force.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 54, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_marduk_accessory', name: "Fifty Names Signet",
    lore: "He was given 50 names at his coronation, each representing a power. The signet holds all of them.",
    tier: 'deity', slot: 'accessory', deityId: 'marduk',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fifty names for fifty powers. My signet goes to those who master many disciplines: reach Level 5 with a character who has at least 5 different skills learned. Breadth of power. The patron of Babylon demands a complete arsenal.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'custom', value: 5, targetType: 'five_skills_learned', description: 'Have 5 different skills learned on this character' },
    ]},
    passiveId: 'marduk_signet_passive',
    passiveDescription: "Fifty Powers: each skill you have learned adds +2% to all damage dealt. The more names, the more power (max +20% at 10 skills).",
    accessoryStats: { accessoryType: 'seal', statBonuses: { STR: 22, WIS: 20 } },
  },
};

const ISHTAR_RELICS: DeityRelicPair = {
  deityId: 'ishtar',
  weapon: {
    id: 'deity_ishtar_weapon', name: "Star of Ishtar Blade",
    lore: "She is love and war. She descended to the underworld and everything stopped growing. She considers this leverage.",
    tier: 'deity', slot: 'weapon', deityId: 'ishtar',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am love and war inseparable. To earn my blade: in a single run, defeat at least 2 bosses AND also bypass at least 1 boss through dialogue. War and diplomacy. Both, in one descent. I am not one or the other — I am both.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 2, description: 'Defeat 2 milestone bosses in one run' },
      { metric: 'boss_bypass', value: 1, description: 'Bypass 1 boss through dialogue in that same run' },
    ]},
    passiveId: 'ishtar_blade_passive',
    passiveDescription: "Love and War: after using Taunt successfully, your next attack deals +30% damage. War is most effective when preceded by the appearance of peace.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'STR', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ishtar_accessory', name: "Eight-Pointed Star Pendant",
    lore: "The morning and evening star. She is Venus in two aspects. The pendant holds both.",
    tier: 'deity', slot: 'accessory', deityId: 'ishtar',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The morning star and evening star are the same, seen at different hours. My pendant goes to those who demonstrate two aspects of power: reach grade B or higher in BOTH CHA and STR on the same character. Desire and strength, in equal measure.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'stats_grade', value: 1, targetType: 'CHA_grade_B_or_higher', description: 'CHA at grade B or higher' },
      { metric: 'stats_grade', value: 1, targetType: 'STR_grade_B_or_higher', description: 'STR at grade B or higher' },
    ]},
    passiveId: 'ishtar_pendant_passive',
    passiveDescription: "Morning and Evening: CHA-based actions grant a combat damage bonus (+10%) for 3 turns. STR-based kills restore 8% SP. Love and war feed each other.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 24, STR: 22 } },
  },
};

const ENKI_RELICS: DeityRelicPair = {
  deityId: 'enki',
  weapon: {
    id: 'deity_enki_weapon', name: "Waters of Wisdom Staff",
    lore: "He holds the divine plans of the universe. He also built the first cities. He is extremely busy.",
    tier: 'deity', slot: 'weapon', deityId: 'enki',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I hold the Me — the divine laws that govern everything. My staff goes to those who have proven understanding of the game's systems: reach Level 6 on a single character. You must understand enough to survive that long.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 6, description: 'Reach Level 6 on a single character' },
    ]},
    passiveId: 'enki_staff_passive',
    passiveDescription: "Divine Plans: once per floor, see the layout of the next floor before descending (preview the floor structure). Also: INT-based attacks have +15% damage — wisdom directs power.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_enki_accessory', name: "Abzu's Lapis Lazuli",
    lore: "The Abzu is the freshwater ocean beneath the earth. This stone holds its depth.",
    tier: 'deity', slot: 'accessory', deityId: 'enki',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The waters beneath the earth hold infinite knowledge. My lapis goes to those who have drawn deep from that well: observe 75 enemies total lifetime AND use INT-scaling skills at least 100 times lifetime. Both the knowing and the applying.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 75, description: 'Use Observe 75 times lifetime' },
      { metric: 'skill_uses', value: 100, targetType: 'INT_scaling_skills', description: 'Use INT-scaling skills 100 times lifetime' },
    ]},
    passiveId: 'enki_lapis_passive',
    passiveDescription: "Abzu's Depths: SP maximum +25. Every Observe action restores 5 SP (knowledge replenishes the pool). The deeper the knowledge, the more resource you carry.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 28, WIS: 20 } },
  },
};

const ERESHKIGAL_RELICS: DeityRelicPair = {
  deityId: 'ereshkigal',
  weapon: {
    id: 'deity_ereshkigal_weapon', name: "Queen of the Great Below's Staff",
    lore: "She rules the land of no return. She once stripped Ishtar of seven garments as she descended. She finds all descents appropriate.",
    tier: 'deity', slot: 'weapon', deityId: 'ereshkigal',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Great Below is where all descend. My staff goes to those who descend deepest: reach Floor 30 in a single run. The land of no return is the deepest floor. Go there. Return from it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 30, description: 'Reach Floor 30 in a single run' },
    ]},
    passiveId: 'ereshkigal_staff_passive',
    passiveDescription: "Depths of the Great Below: dark-type attacks deal +30% damage. Also: once per combat, drain 20% of an enemy's remaining HP as dark damage (the Great Below takes its toll).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_ereshkigal_accessory', name: "Land of No Return Brand",
    lore: "Once marked, you belong to her realm. This is a way of saying goodbye in advance.",
    tier: 'deity', slot: 'accessory', deityId: 'ereshkigal',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "What enters the Great Below does not leave unchanged. My brand goes to those who have died and been marked: die in the dungeon 5 times total lifetime. Each death brands you deeper. Five deaths means you carry my mark completely.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'total_character_deaths_five', description: '5 character deaths total lifetime (any characters)' },
    ]},
    passiveId: 'ereshkigal_brand_passive',
    passiveDescription: "Marked by the Great Below: enemies that kill you are permanently weakened (-20% damage, -15% defense) for the rest of that run — even if you resurrect. The dead queen's curse follows them.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 24, END: 20 } },
  },
};

const SHAMASH_RELICS: DeityRelicPair = {
  deityId: 'shamash',
  weapon: {
    id: 'deity_shamash_weapon', name: "Sun God's Justice Blade",
    lore: "He is the sun, justice, and law. The Code of Hammurabi was given under his authority. He is uninterested in ambiguity.",
    tier: 'deity', slot: 'weapon', deityId: 'shamash',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I see all actions in the light of the sun. To earn my blade: complete a run to Floor 15 where every action you took was an attack (no defense, no fleeing, no skills of support type, no items). Pure combat. Pure judgment. I see the truth of what you are.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero retreats' },
      { metric: 'floor_nodefend', value: 15, description: 'Zero Defend actions' },
    ]},
    passiveId: 'shamash_blade_passive',
    passiveDescription: "Solar Justice: +20% damage. When an enemy uses evasion or resistance, your next attack bypasses it completely (the sun's light cannot be hidden from).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 52, finalAccuracy: 100, finalCritChance: 0.26, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_shamash_accessory', name: "Code Tablet of Shamash",
    lore: "282 laws. All written. All enforced. The tablet holds a fragment of the first law.",
    tier: 'deity', slot: 'accessory', deityId: 'shamash',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The law is written and public. My tablet goes to those who follow the visible path: complete a run to Floor 10 without entering any mystery rooms or secret passages — only the visible, stated path. Justice operates in the open.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'mystery_rooms', value: 0, description: 'Zero mystery rooms entered' },
    ]},
    passiveId: 'shamash_tablet_passive',
    passiveDescription: "Written Law: +20% to all damage when fighting enemies that have previously attacked you first (the law defends the attacked). Shamash's justice favors the one who waited.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 26, PER: 20 } },
  },
};

const NERGAL_RELICS: DeityRelicPair = {
  deityId: 'nergal',
  weapon: {
    id: 'deity_nergal_weapon', name: "Plague Bringer's Mace",
    lore: "He descends to the underworld and becomes its king. By force. Every time. He considers this a reasonable domestic arrangement.",
    tier: 'deity', slot: 'weapon', deityId: 'nergal',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am plague and war and fever. My mace goes to those who inflict suffering systematically: apply poison to 50 enemies total lifetime. Not just once each — 50 applications. Show me you understand spreading harm as strategy.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 50, targetType: 'poison', description: 'Apply poison to 50 enemies lifetime' },
    ]},
    passiveId: 'nergal_mace_passive',
    passiveDescription: "Plague Spread: poison you apply deals 50% more damage per tick. Also: once per combat, your poison can spread to an adjacent enemy (the plague does not respect boundaries).",
    weaponStats: { scalingStat: 'END', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_nergal_accessory', name: "Fever Crown",
    lore: "He married Ereshkigal by threatening war. This is the crown he wore to that proposal.",
    tier: 'deity', slot: 'accessory', deityId: 'nergal',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "War and plague operate through accumulation. My crown goes to those who accumulate damage through attrition: in a single run, have status effects deal more total damage than your direct attacks. Let the ticks win the war.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'status_damage_exceeds_direct_damage_single_run', description: 'Total status effect damage exceeds total direct attack damage in one run' },
    ]},
    passiveId: 'nergal_crown_passive',
    passiveDescription: "Plague Lord: status effects you inflict cannot be cleansed by enemies. Additionally: status effects deal double damage on their last tick (the final surge of plague).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { INT: 24, END: 20 } },
  },
};

const SIN_RELICS: DeityRelicPair = {
  deityId: 'sin',
  weapon: {
    id: 'deity_sin_weapon', name: "Crescent Moon Blade",
    lore: "He is the moon god of Mesopotamia. The crescent is his vessel. The blade is its edge.",
    tier: 'deity', slot: 'weapon', deityId: 'sin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The moon records time and cycles. My blade goes to those who respect the cycle: reach Level 4 on 3 different characters across your lifetime. Not one character repeatedly — three characters, each to Level 4. Three full cycles of the moon.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_characters_each_level4', description: 'Reach Level 4 on 3 different characters lifetime' },
    ]},
    passiveId: 'sin_blade_passive',
    passiveDescription: "Lunar Cycle: damage increases by 5% for each phase of the moon (game mechanic: +5% per complete run survived, up to +25% at 5 runs, reset at run 6). The moon is patient with itself.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 44, finalAccuracy: 95, finalCritChance: 0.28, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_sin_accessory', name: "Moon Barque Ring",
    lore: "Sin's boat crosses the night sky. This ring is carved from its hull.",
    tier: 'deity', slot: 'accessory', deityId: 'sin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The boat crosses the sky every night without fail. My ring goes to those who are equally reliable: complete 8 dungeon runs (any depth, any outcome) lifetime. Return to the Tower 8 times. The moon rises 8 times for you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 8, targetType: 'eight_dungeon_runs_started', description: 'Start and complete (or die in) 8 dungeon runs lifetime' },
    ]},
    passiveId: 'sin_ring_passive',
    passiveDescription: "Night Crossing: once per run, choose a floor to 'skip' — descend past it without engaging any of its rooms. The moon passes over some nights without stopping.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 22, AGI: 20 } },
  },
};

const ANU_RELICS: DeityRelicPair = {
  deityId: 'anu',
  weapon: {
    id: 'deity_anu_weapon', name: "Heaven's Scepter",
    lore: "He is the sky father of Mesopotamia. He decreed creation. He has decreed little since.",
    tier: 'deity', slot: 'weapon', deityId: 'anu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I decreed the universe into existence and stepped back. My scepter goes to those who have earned the respect of heaven's court: reach Favoured Child status (91+ favor) with 2 different Mesopotamian deities. The court of heaven recognizes its own.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 2, targetType: 'mesopotamian_deities', description: 'Reach 91+ favor with 2 Mesopotamian deities lifetime' },
    ]},
    passiveId: 'anu_scepter_passive',
    passiveDescription: "Heavenly Decree: once per floor, declare a decree — all enemies on the floor have their damage reduced by 15% for 3 turns (heaven commands, they obey).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.24, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_anu_accessory', name: "Star Father's Crown",
    lore: "He was the original ruler of heaven. He ceded to younger gods. The crown remembers when he didn't.",
    tier: 'deity', slot: 'accessory', deityId: 'anu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Creation preceded all things. My crown goes to those who have proven they understand precedence: reach Level 8 on a single character. The first law of heaven is persistence.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 8, description: 'Reach Level 8 on a single character' },
    ]},
    passiveId: 'anu_crown_passive',
    passiveDescription: "First Among Gods: +5% to all stats (additive) as a flat bonus. The father of heaven grants authority over all domains equally.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 28, CHA: 18 } },
  },
};

export const WESTERN_DEITY_RELICS: DeityRelicPair[] = [
  // Celtic
  DAGDA_RELICS, MORRIGAN_RELICS, BRIGID_RELICS, LUGH_RELICS,
  CERNUNNOS_RELICS, NUADA_RELICS, MANANNAN_RELICS, OGMA_RELICS, ARAWN_RELICS,
  // Mesopotamian
  MARDUK_RELICS, ISHTAR_RELICS, ENKI_RELICS, ERESHKIGAL_RELICS,
  SHAMASH_RELICS, NERGAL_RELICS, SIN_RELICS, ANU_RELICS,
];
