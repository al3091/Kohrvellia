/**
 * East Asian Deity Relics — Japanese and Chinese pantheons
 */

import type { DeityRelicPair } from './deityRelics';

// ===== JAPANESE =====

const AMATERASU_RELICS: DeityRelicPair = {
  deityId: 'amaterasu',
  weapon: {
    id: 'deity_amaterasu_weapon', name: "Dawn Sword",
    lore: "She is the sun. She once hid in a cave and the world went dark. Everything tried to coax her out. This weapon is what convinced her.",
    tier: 'deity', slot: 'weapon', deityId: 'amaterasu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I withdrew from the world and it suffered for it. My sword goes to those who understand the value of presence: complete 10 consecutive dungeon runs without skipping a single floor — every floor must be descended through, no shortcuts, no floor-skip mechanics. I did not hide. Neither should you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_runs_no_floor_skips', description: '10 consecutive runs with no floors skipped, lifetime' },
    ]},
    passiveId: 'amaterasu_sword_passive',
    passiveDescription: "Divine Light: deals holy damage. Once per combat, illuminate the battlefield — all enemies' defenses are reduced by 20% for 3 turns. The sun hides nothing.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 100, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_amaterasu_accessory', name: "Sacred Mirror Pendant",
    lore: "The Yata no Kagami. One of the three imperial treasures. It sees truth.",
    tier: 'deity', slot: 'accessory', deityId: 'amaterasu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The sacred mirror reflects what is true, not what is shown. My pendant goes to those who fight without deception: complete a full run to Floor 15 using zero fleeing, zero status infliction, and only direct attacks or healing skills. No tricks. Only truth. The mirror will recognize the reflection.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero retreats' },
      { metric: 'status_inflict', value: 0, description: 'Zero status effects inflicted on enemies' },
    ]},
    passiveId: 'amaterasu_mirror_passive',
    passiveDescription: "True Reflection: once per combat, negate any deception effect — status effect, dodge, or evasion attempt — and deal the blocked damage back to the attacker. The mirror does not lie.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 28, PER: 20 } },
  },
};

const SUSANOO_RELICS: DeityRelicPair = {
  deityId: 'susanoo',
  weapon: {
    id: 'deity_susanoo_weapon', name: "Totsuka-no-Tsurugi",
    lore: "He used it to slay an eight-headed serpent. This is the sword that cut the storm.",
    tier: 'deity', slot: 'weapon', deityId: 'susanoo',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I slew Yamata no Orochi by getting it drunk and cutting off all eight heads. My sword goes to those who demonstrate overwhelming force: kill any boss enemy using only basic attack — no skills, no items, pure sword work. The storm does not use tricks. It uses force.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_noattack', value: 0, description: 'Defeat a boss using ONLY the basic Attack action (zero skills, zero items)' },
      { metric: 'boss_kills_run', value: 1, description: 'Defeat any milestone boss' },
    ]},
    passiveId: 'susanoo_sword_passive',
    passiveDescription: "Storm's Edge: the basic attack deals +40% damage when used exclusively (no skills used that combat). The storm's pure force is greater than any technique.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 56, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_susanoo_accessory', name: "Yasakani-no-Magatama",
    lore: "Imperial jewel. Sacred object. Susanoo wore it before it passed to the emperors.",
    tier: 'deity', slot: 'accessory', deityId: 'susanoo',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The storm is also the sea. My jewel goes to those who embody both fury and depth: complete a run to Floor 15 taking at least 500 damage AND dealing at least 1,500 damage in those same fights. Fight hard. Be hit hard. Both must happen.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 500, description: 'Take 500+ damage in one run' },
      { metric: 'sp_damage_dealt', value: 1500, description: 'Deal 1,500+ damage in that same run' },
    ]},
    passiveId: 'susanoo_jewel_passive',
    passiveDescription: "Storm Heart: damage dealt increases by 1% for each 10 HP you have lost this run (max +50%). The more you have bled, the more the storm rages.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { STR: 25, END: 22 } },
  },
};

const TSUKUYOMI_RELICS: DeityRelicPair = {
  deityId: 'tsukuyomi',
  weapon: {
    id: 'deity_tsukuyomi_weapon', name: "Moon-Phase Blade",
    lore: "He killed a food goddess at a dinner party because the way she prepared the meal insulted him. He has not spoken to Amaterasu since. Neither has the moon.",
    tier: 'deity', slot: 'weapon', deityId: 'tsukuyomi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The moon and the sun do not look at each other. I rule the night alone. My blade goes to those who thrive in solitude: complete a run to Floor 10 where you entered zero social/event rooms — only combat, only forward. No conversations, no interactions. Pure solitude.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'event_success', value: 0, description: 'Zero event rooms entered' },
      { metric: 'mystery_rooms', value: 0, description: 'Zero mystery rooms entered' },
    ]},
    passiveId: 'tsukuyomi_blade_passive',
    passiveDescription: "Lunar Isolation: +20% damage at night (mechanical effect: +20% bonus in floors 5+, where the light fades). Also: critical hits have a 30% chance to stun for 1 turn (the cold moon stops motion).",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 94, finalCritChance: 0.32, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_tsukuyomi_accessory', name: "Silver Moon Disk",
    lore: "He watches the night. He does not comment. He does not need to.",
    tier: 'deity', slot: 'accessory', deityId: 'tsukuyomi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Cold judgment is the highest form. My disk goes to those who act without mercy or hesitation: in 10 combats lifetime, kill the enemy before they take a single action (kill on turn 1 before enemy acts). Ten executions. Cold. Precise. Completed.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'kill_before_enemy_acts_turn1', description: 'Kill 10 enemies before they take any action (turn 1 kill before enemy acts), lifetime' },
    ]},
    passiveId: 'tsukuyomi_disk_passive',
    passiveDescription: "Cold Moonlight: +30% damage on turn 1 of any combat. If you kill the enemy before they act, restore 5% SP. The moon is swift when it chooses to be.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 28, WIS: 20 } },
  },
};

const INARI_RELICS: DeityRelicPair = {
  deityId: 'inari',
  weapon: {
    id: 'deity_inari_weapon', name: "Fox Fire Wand",
    lore: "Her foxes carry lanterns that lead people either home or nowhere. Depends on the fox.",
    tier: 'deity', slot: 'weapon', deityId: 'inari',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Prosperity and rice and foxes. My wand goes to those who understand abundance: accumulate 10,000 gold simultaneously on a single character — held, not spent. Show me you have gathered enough to be generous with.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 10000, description: 'Hold 10,000 gold simultaneously on one character' },
    ]},
    passiveId: 'inari_wand_passive',
    passiveDescription: "Fox Fire: +15% gold from all sources. Also: once per floor, a fox fire appears — 50% chance to reveal a hidden treasure room on the floor map.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'CHA', finalDamage: 42, finalAccuracy: 92, finalCritChance: 0.30, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_inari_accessory', name: "Nine-Tail Strand",
    lore: "A kitsune with nine tails is at the height of their power. This is one of those tails.",
    tier: 'deity', slot: 'accessory', deityId: 'inari',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The nine-tailed fox brings fortune to those who earn it. My strand goes to those who prove remarkable luck: have 5 critical hits in a single combat. Not 5 total — 5 in ONE fight. Fortune must concentrate itself at the right moment.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_crits_in_single_combat', description: '5 critical hits in a single combat' },
    ]},
    passiveId: 'inari_strand_passive',
    passiveDescription: "Nine Blessings: critical hit chance +15%. Additionally: when you land 3 crits in a single combat, Inari's blessing activates — all attacks for 2 turns are guaranteed criticals.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 32, AGI: 18 } },
  },
};

const RAIJIN_RELICS: DeityRelicPair = {
  deityId: 'raijin',
  weapon: {
    id: 'deity_raijin_weapon', name: "Thunder Drum Striker",
    lore: "He beats the drums of thunder. The striker is the drumstick.",
    tier: 'deity', slot: 'weapon', deityId: 'raijin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Thunder is rhythm. My striker goes to those who hit without pause: defeat 5 enemies in a row using only the basic Attack action — no skills between those 5 kills. Pure beat. Pure rhythm. Thunder does not stop for flourish.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 5, targetType: 'five_kills_basic_attack_only', description: '5 consecutive kills using only basic Attack, in one run' },
    ]},
    passiveId: 'raijin_striker_passive',
    passiveDescription: "Thunder Rhythm: using basic attack 3 turns in a row builds a charge — the 4th attack is automatically a Thunder Strike dealing +80% damage. The rhythm reaches its climax.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 52, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_raijin_accessory', name: "Storm God's Drum Ring",
    lore: "Small ring. Contains a lot of thunder. This is considered a design flaw by everyone but Raijin.",
    tier: 'deity', slot: 'accessory', deityId: 'raijin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The storm hits everywhere at once. My ring goes to those who can deal damage on every front: inflict 5 different status effects in a single run (burn, poison, bleed, stun, weaken — any 5 different types). Show me the storm's full reach.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 5, targetType: 'five_different_types', description: 'Inflict 5 different status effect types in one run' },
    ]},
    passiveId: 'raijin_ring_passive',
    passiveDescription: "Thunder and Lightning: once per combat, your attack releases a secondary thunder burst — hits all enemies for 25% weapon damage. Does not count as an action.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 24, AGI: 22 } },
  },
};

const FUJIN_RELICS: DeityRelicPair = {
  deityId: 'fujin',
  weapon: {
    id: 'deity_fujin_weapon', name: "Wind Bag Blade",
    lore: "He carries all winds in a bag on his back. The blade cuts through them all.",
    tier: 'deity', slot: 'weapon', deityId: 'fujin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wind moves without restriction. My blade goes to those who move freely: complete a run to Floor 15 using at least 3 different types of actions each floor — Attack, Skill, Defend, Flee, Taunt, Observe, or Item. No floor should have you locked into one pattern. Move like the wind.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'three_different_action_types_per_floor', description: 'Use at least 3 different action types per floor throughout the run' },
    ]},
    passiveId: 'fujin_blade_passive',
    passiveDescription: "Wind's Freedom: +20% dodge chance. When you dodge, immediately get to take a free bonus action (the wind carries you into the gap). No extra turn cost.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 44, finalAccuracy: 98, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_fujin_accessory', name: "Gale Band",
    lore: "He runs. He does not stop. The band is what holds the gale together.",
    tier: 'deity', slot: 'accessory', deityId: 'fujin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Speed is freedom. My band goes to those who flee faster than wind: successfully flee from 20 combats in a single run. Not total lifetime — 20 in ONE run. Move constantly. Never stop. The wind does not linger.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 20, description: 'Flee 20 times in a single run' },
    ]},
    passiveId: 'fujin_band_passive',
    passiveDescription: "Swift as Wind: +30% all movement-related mechanics (flee success rate, initiative bonus). After successfully fleeing, the next combat starts with you having already acted (free first action).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 30, PER: 18 } },
  },
};

const HACHIMAN_RELICS: DeityRelicPair = {
  deityId: 'hachiman',
  weapon: {
    id: 'deity_hachiman_weapon', name: "War God's Sacred Bow",
    lore: "He is the god of war and archery. Both are the same art, viewed from different distances.",
    tier: 'deity', slot: 'weapon', deityId: 'hachiman',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Honor in war means winning without unnecessary cruelty. My bow goes to those who prove mastery: defeat any milestone boss without taking any damage during the fight, using only skills (no basic attack on the killing blow). Perfect technical execution. That is the warrior's art.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_nodamage', value: 1, description: 'Defeat a boss without taking any damage in that fight' },
      { metric: 'boss_skillonly', value: 1, description: 'Killing blow must be a skill, not basic attack' },
    ]},
    passiveId: 'hachiman_bow_passive',
    passiveDescription: "Warrior's Art: when you enter a combat without having taken damage in the last 2 fights, your first attack deals +45% damage. The warrior who has remained untouched carries momentum.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'PER', finalDamage: 52, finalAccuracy: 100, finalCritChance: 0.26, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_hachiman_accessory', name: "Dove of Peace Banner",
    lore: "He is both god of war and protector of Japan. He keeps both offices and considers neither a contradiction.",
    tier: 'deity', slot: 'accessory', deityId: 'hachiman',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "True warriors know when not to fight. My banner goes to those who demonstrate both: reach Level 4 on a single character AND have bypassed at least 2 bosses through dialogue by that point. Know when to fight. Know when to speak. Master both.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 4, description: 'Reach Level 4' },
      { metric: 'boss_bypass', value: 2, description: 'Bypass 2 bosses through dialogue by this point' },
    ]},
    passiveId: 'hachiman_banner_passive',
    passiveDescription: "Warrior's Dual Nature: +20% damage in combat. +25% success rate for all non-combat resolutions (dialogue, CHA checks, event outcomes). The dove and the hawk are one.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, CHA: 20 } },
  },
};

const BENZAITEN_RELICS: DeityRelicPair = {
  deityId: 'benzaiten',
  weapon: {
    id: 'deity_benzaiten_weapon', name: "Biwa Blade",
    lore: "She plays the biwa. The blade is the bow drawn across strings. The notes are the cutting.",
    tier: 'deity', slot: 'weapon', deityId: 'benzaiten',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Music is the art of making the invisible felt. My blade goes to those who master the intangible: reach grade B or higher in the CHA stat AND complete a run to Floor 10 using only CHA-based actions in non-combat rooms. Charm, persuade, bypass. Let talent carry you.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'stats_grade', value: 1, targetType: 'CHA_grade_B_or_higher', description: 'CHA stat at grade B or higher' },
    ]},
    passiveId: 'benzaiten_blade_passive',
    passiveDescription: "Resonant Art: after using a CHA-based action (Taunt), your next attack deals +30% damage (the music resolves into violence). Benzaiten's art is persuasion first, force second.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 42, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_benzaiten_accessory', name: "Snake Charmer's Torc",
    lore: "She is associated with serpents and music. This is the intersection of both.",
    tier: 'deity', slot: 'accessory', deityId: 'benzaiten',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Talent reveals itself over time. My torc goes to those who demonstrate that revelation: accumulate 200 total proficiency points in any single stat across your character's development. Deep investment in a single art is its own kind of devotion.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 200, targetType: 'single_stat_200_proficiency', description: 'Reach 200+ proficiency points in any single stat on one character' },
    ]},
    passiveId: 'benzaiten_torc_passive',
    passiveDescription: "Seven Lucky Gods: once per run, invoke Benzaiten's seven-god blessing — all stats receive a +10% proficiency bonus for the rest of the run. Talent multiplies itself.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 26, WIS: 20, LCK: 12 } },
  },
};

const EBISU_RELICS: DeityRelicPair = {
  deityId: 'ebisu',
  weapon: {
    id: 'deity_ebisu_weapon', name: "Lucky Fisherman's Rod",
    lore: "He is the only one of the seven lucky gods born in Japan. He is also deaf. He fishes anyway.",
    tier: 'deity', slot: 'weapon', deityId: 'ebisu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am persistence and good fortune combined. My rod goes to those who demonstrate equivalent patience with treasure: find 20 treasure rooms total across your lifetime. Patience and luck, in equal measure. The fish come to those who wait.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'treasure_rooms', value: 20, description: 'Find 20 treasure rooms lifetime' },
    ]},
    passiveId: 'ebisu_rod_passive',
    passiveDescription: "Lucky Catch: treasure rooms always contain 1 guaranteed item above your current best quality (if you have Common items, treasure gives Uncommon or better). Ebisu's luck upgrades the catch.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'END', finalDamage: 40, finalAccuracy: 90, finalCritChance: 0.26, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ebisu_accessory', name: "Commerce God's Coin Purse",
    lore: "He blesses commerce. He is also the patron of fishermen. He sees no contradiction.",
    tier: 'deity', slot: 'accessory', deityId: 'ebisu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Prosperity comes to those who invest. My coin purse goes to those who have moved significant gold through commerce: spend 15,000 gold total at town shops across your lifetime. Not at the Blacksmith — at shops. Invest in the economy, adventurer.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 15000, targetType: 'gold_spent_at_shops', description: 'Spend 15,000 gold at town shops (not Blacksmith) lifetime' },
    ]},
    passiveId: 'ebisu_purse_passive',
    passiveDescription: "Commerce Blessing: gold earned in the dungeon is increased by 25%. Also: shop items have a 15% chance to be on sale (randomly reduced by 20-40%).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, CHA: 20 } },
  },
};

const IZANAGI_RELICS: DeityRelicPair = {
  deityId: 'izanagi',
  weapon: {
    id: 'deity_izanagi_weapon', name: "Heaven-Floating Spear",
    lore: "He stirred the ocean with this until Japan formed. Creation through action.",
    tier: 'deity', slot: 'weapon', deityId: 'izanagi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I created the world with this spear by stirring. Creation through persistence. My spear goes to those who create something in this Tower: reach Level 5 on a character whose achievements include at least 3 LEGENDARY tier challenges completed. Build something worth keeping.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'achievements_total', value: 3, targetType: 'legendary_tier', description: 'Complete 3 LEGENDARY tier achievements on this character' },
    ]},
    passiveId: 'izanagi_spear_passive',
    passiveDescription: "World Creation: +5 flat damage for every floor you have ever descended to on any character (lifetime count, max +50 from Floor 10+). The spear grows with the world you have built.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.24, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_izanagi_accessory', name: "Birth-World Seal",
    lore: "He and Izanami made the islands. Then she died and he went to bring her back. Then he ran away and made the sun and moon to forget her.",
    tier: 'deity', slot: 'accessory', deityId: 'izanagi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Creation requires separation from death. I ran from the underworld and sealed the entrance. My seal goes to those who demonstrate they can separate themselves from failure: start a new character after a death and immediately reach Level 2 in their first session. Creation begins again. Always.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'new_character_after_death_reaches_level2', description: 'New character (started after previous death) reaches Level 2' },
      { metric: 'level_reached', value: 2, description: 'Reach Level 2' },
    ]},
    passiveId: 'izanagi_seal_passive',
    passiveDescription: "World Seal: once per character: seal the path behind you — after dying, the next run starts with +20% max HP permanently for that run (Izanagi's purification blessing).",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 25, STR: 20 } },
  },
};

const IZANAMI_RELICS: DeityRelicPair = {
  deityId: 'izanami',
  weapon: {
    id: 'deity_izanami_weapon', name: "Death Mother's Blade",
    lore: "She rules the underworld. She kills 1,000 people a day. Izanagi responds by creating 1,500 births. She considers this a competition.",
    tier: 'deity', slot: 'weapon', deityId: 'izanami',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I kill 1,000 a day. To earn my blade: kill 500 enemies total across your lifetime. Not in one run — accumulated. Half my daily quota. When you reach 500 kills total, my blade will find its way into the next dungeon run's first chest.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 500, description: 'Kill 500 enemies total lifetime' },
    ]},
    passiveId: 'izanami_blade_passive',
    passiveDescription: "Underworld Queen: enemies killed with this weapon cannot be revived by any means. Also: +20% damage to enemies that have already been wounded (below 75% HP).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_izanami_accessory', name: "Shikome's Gift",
    lore: "She sent demons to pursue Izanagi when he ran from her. This is a piece of one of those demons. She kept it as a keepsake.",
    tier: 'deity', slot: 'accessory', deityId: 'izanami',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Death comes for everyone. My gift goes to those who understand the inevitability: die 3 times total lifetime on the same floor number — Floor 15. Return to that floor. Die there again. Three times. Show me you understand that some thresholds do not yield easily.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_deaths_on_floor_15', description: 'Die on Floor 15 exactly, 3 times lifetime' },
    ]},
    passiveId: 'izanami_gift_passive',
    passiveDescription: "Underworld Bond: when you die and restart, you remember one thing from the previous run — a random passive buff that carries over to your next character. Death teaches.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 24, END: 22 } },
  },
};

const RYUJIN_RELICS: DeityRelicPair = {
  deityId: 'ryujin',
  weapon: {
    id: 'deity_ryujin_weapon', name: "Tide Jewel Trident",
    lore: "He rules the sea from his palace of coral. The trident controls the tides.",
    tier: 'deity', slot: 'weapon', deityId: 'ryujin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The tide ebbs and flows. My trident goes to those who master that rhythm: flee from 10 combats in a single run AND return to fight the floor boss of each floor you fled from (clear the boss of each floor where you fled). Ebb and flow. Always return.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 10, description: 'Flee 10 times in one run' },
      { metric: 'boss_kills_run', value: 3, description: 'Still defeat 3 floor bosses in that run' },
    ]},
    passiveId: 'ryujin_trident_passive',
    passiveDescription: "Tidal Mastery: +15% damage after fleeing (the tide returning). This bonus stacks for 3 turns after any flee action. Also: water/cold status effects cannot be applied to you.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ryujin_accessory', name: "Dragon Palace Coral",
    lore: "His palace is made of coral and crystal. This fragment fell off during one of the tide jewel demonstrations.",
    tier: 'deity', slot: 'accessory', deityId: 'ryujin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My palace is at the bottom of the sea. Depth is my domain. My coral goes to those who go deep: reach Floor 25 in a single run. That is the deepest the Tower has placed its worst guardian. Go to the deepest point. Return. The coral will know you.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25 in a single run' },
    ]},
    passiveId: 'ryujin_coral_passive',
    passiveDescription: "Deep Water Pressure: +3% damage per 5 floors descended beyond Floor 5 (max +36% at Floor 65 equivalent — practically +15-20% in normal runs). The deep rewards those who descend.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 22, AGI: 20, LCK: 15 } },
  },
};

const KAGUTSUCHI_RELICS: DeityRelicPair = {
  deityId: 'kagutsuchi',
  weapon: {
    id: 'deity_kagutsuchi_weapon', name: "First Fire Blade",
    lore: "His birth burned his mother Izanami to death. Izanagi was angry. Kagutsuchi did not choose this.",
    tier: 'deity', slot: 'weapon', deityId: 'kagutsuchi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fire is the first creation and the last destruction. My blade goes to those who wield fire as a sustained force: apply the burn status effect to 75 enemies total lifetime. Not just occasionally — 75 burns. Fire that continues to teach.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 75, targetType: 'burn', description: 'Apply burn status to 75 enemies lifetime' },
    ]},
    passiveId: 'kagutsuchi_blade_passive',
    passiveDescription: "Birth-Fire: this weapon ignites on every hit — applying a 2-turn burn dealing 8% max HP damage. The fire of creation cannot be extinguished by resistance.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'STR', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_kagutsuchi_accessory', name: "Eternal Ember Ring",
    lore: "The fire that started with his birth never fully went out. This is a piece of that beginning.",
    tier: 'deity', slot: 'accessory', deityId: 'kagutsuchi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fire spreads. To earn this ring: in a single combat, have burn status simultaneously affecting 3 or more different enemies. You must spread the fire. Show me it reaches everything around you.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 3, targetType: 'simultaneous_burn_three_enemies', description: 'Have burn affecting 3+ enemies simultaneously in one combat' },
    ]},
    passiveId: 'kagutsuchi_ring_passive',
    passiveDescription: "Wildfire: when you apply burn to an enemy, there is a 30% chance it spreads to an adjacent enemy immediately (chain-fire mechanic). Kagutsuchi's fire does not stay in one place.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { INT: 26, STR: 20 } },
  },
};

// ===== CHINESE =====

const JADE_EMPEROR_RELICS: DeityRelicPair = {
  deityId: 'jade_emperor',
  weapon: {
    id: 'deity_jade_emperor_weapon', name: "Celestial Decree Blade",
    lore: "He rules heaven itself. His decrees cannot be appealed. This weapon has the same philosophy.",
    tier: 'deity', slot: 'weapon', deityId: 'jade_emperor',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I rule heaven's court. Authority commands through unquestionable presence. My blade goes to those who command respect in this Tower: reach Favoured Child status (91+ favor) with 3 different deities from different pantheons. The Jade Court recognizes those who are recognized by many courts.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 3, targetType: 'different_pantheons', description: 'Reach 91+ favor with 3 deities from different pantheons lifetime' },
    ]},
    passiveId: 'jade_emperor_blade_passive',
    passiveDescription: "Celestial Mandate: +5% damage for each Favoured Child relationship you hold (across all active deities, max +25%). The Jade Court's authority multiplies with recognition.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 95, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_jade_emperor_accessory', name: "Heavenly Court Jade",
    lore: "Jade is the stone of heaven. This piece was carved by the emperor himself, presumably to prove he could.",
    tier: 'deity', slot: 'accessory', deityId: 'jade_emperor',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Heaven's court keeps perfect records. My jade goes to those who have demonstrated their worth formally: complete the Denatus at Level 10. The soul title is your entry into the celestial ledger. No title, no jade.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon and complete the Denatus ceremony' },
    ]},
    passiveId: 'jade_emperor_jade_passive',
    passiveDescription: "Jade Authority: all NPC reputation gains are doubled. Shop prices permanently reduced by 15%. The Jade Emperor's mark opens every door in the mortal realm.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 28, WIS: 20 } },
  },
};

const GUAN_YU_RELICS: DeityRelicPair = {
  deityId: 'guan_yu',
  weapon: {
    id: 'deity_guan_yu_weapon', name: "Green Dragon Crescent Blade",
    lore: "He has been a general, god, judge, and icon of brotherhood for 1,800 years. The blade has been there for all of it.",
    tier: 'deity', slot: 'weapon', deityId: 'guan_yu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the god of righteous war and brotherhood. My crescent blade goes to those who fight righteously: complete a run to Floor 20 without using any Flee action AND without any failed actions (every attack, every skill, every taunt must succeed). Righteous war has no retreats and no failures.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero retreats' },
      { metric: 'custom', value: 0, targetType: 'zero_failed_actions', description: 'Zero failed actions (attacks, skills, taunts) the entire run' },
    ]},
    passiveId: 'guan_yu_blade_passive',
    passiveDescription: "Righteous Fury: +25% damage on all attacks when your HP is above 50%. Below 50%, you deal standard damage — righteousness requires strength to sustain itself.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'CHA', finalDamage: 56, finalAccuracy: 94, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_guan_yu_accessory', name: "Red Face Brotherhood Seal",
    lore: "Brotherhood means the oath you never break. The seal enforces it.",
    tier: 'deity', slot: 'accessory', deityId: 'guan_yu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The oath of the peach garden was unbreakable. My seal goes to those who make unbreakable commitments: complete 5 runs in a row where, in each run, you reached at least Floor 5 AND never used the Flee action. Five unbroken oaths. Not one retreat across five journeys.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_consecutive_runs_floor5_no_flee', description: '5 consecutive runs reaching Floor 5+ with zero flee uses, lifetime' },
    ]},
    passiveId: 'guan_yu_seal_passive',
    passiveDescription: "Sworn Brotherhood: +20% damage and +10% defense when you have not used Flee in the current run. Breaking the oath (using Flee) removes this bonus permanently for that run.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { STR: 24, END: 22 } },
  },
};

const GUANYIN_RELICS: DeityRelicPair = {
  deityId: 'guanyin',
  weapon: {
    id: 'deity_guanyin_weapon', name: "Willow Branch Wand",
    lore: "She hears all suffering. She responds to all calls. The wand carries that response.",
    tier: 'deity', slot: 'weapon', deityId: 'guanyin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Compassion means acting on the suffering of others. My wand goes to those who understand mercy: bypass 4 bosses through dialogue across your lifetime. Not every enemy is your enemy. Some can be spoken to. Show me you can hear the difference.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 4, description: 'Bypass 4 bosses through dialogue lifetime' },
    ]},
    passiveId: 'guanyin_wand_passive',
    passiveDescription: "Compassion's Reach: after bypassing a boss through dialogue, all enemies on the next floor deal -20% damage (compassion calms the Tower). Also: healing received +20%.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 40, finalAccuracy: 92, finalCritChance: 0.24, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_guanyin_accessory', name: "Lotus Blossom Pendant",
    lore: "She stands on a lotus. The lotus grows from mud and is untouched by it. She chose this carefully.",
    tier: 'deity', slot: 'accessory', deityId: 'guanyin',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The lotus rises from mud unstained. My pendant goes to those who rise from hardship unstained: complete a run to Floor 10 after having already suffered 3 character deaths across your lifetime. The mud of failure cannot stain you if you choose to rise from it.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'character_started_after_three_total_deaths', description: 'Character started after accumulating 3+ total character deaths across the account' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10 on this character' },
    ]},
    passiveId: 'guanyin_pendant_passive',
    passiveDescription: "Lotus Rising: once per run, when you drop below 15% HP, Guanyin's compassion activates — restore 40% HP and remove all negative status effects. The lotus always rises.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 28, END: 20 } },
  },
};

const SUN_WUKONG_RELICS: DeityRelicPair = {
  deityId: 'sun_wukong',
  weapon: {
    id: 'deity_sun_wukong_weapon', name: "Ruyi Jingu Bang",
    lore: "It weighs 13,500 jin. He reduced it to the size of a needle for storage. Physics is for lesser beings.",
    tier: 'deity', slot: 'weapon', deityId: 'sun_wukong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I can be anything. I once fought Heaven itself. My staff goes to those who demonstrate equivalent audacity: complete a run to Floor 15 using a completely different weapon TYPE from every previous run (different scaling stat category — STR run last time? Use AGI this time. And the time before? Try INT.). Three successive runs, three different weapon categories. Transform yourself.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_runs_different_weapon_categories', description: '3 separate runs each using a different primary weapon category (STR/AGI/INT/END/WIS/CHA/PER/LCK)' },
    ]},
    passiveId: 'wukong_staff_passive',
    passiveDescription: "72 Transformations: at the start of each combat, this weapon randomly shifts its scaling stat to whatever is highest for that enemy (targets their weakness). The staff adapts.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 56, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_sun_wukong_accessory', name: "Trickster's Headband",
    lore: "Tripitaka put it on him to control him. It gives headaches. Sun Wukong has mixed feelings about the whole arrangement.",
    tier: 'deity', slot: 'accessory', deityId: 'sun_wukong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The headband restrains defiance. To earn mine — the one that doesn't hurt — you must show that your defiance is earned: fight a boss while being affected by 2 or more negative status effects AND win. Restrained but unconquerable. That is the Monkey King.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Defeat any milestone boss' },
      { metric: 'status_received_survived', value: 2, targetType: 'during_boss_fight', description: 'Have 2+ different negative status effects during the boss fight when you win' },
    ]},
    passiveId: 'wukong_headband_passive',
    passiveDescription: "Defiant Freedom: negative status effects on you also grant +5% damage per active effect (max +25%). The restraint becomes power.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 22, AGI: 22, LCK: 15 } },
  },
};

const NEZHA_RELICS: DeityRelicPair = {
  deityId: 'nezha',
  weapon: {
    id: 'deity_nezha_weapon', name: "Fire-Tipped Spear",
    lore: "He killed a dragon prince, stripped the tendons from its body to make a belt for his father, and offered his own flesh to settle the debt. He was three years old. He considers this backstory normal.",
    tier: 'deity', slot: 'weapon', deityId: 'nezha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I died and was reborn from lotus. My spear goes to those who understand rebirth: start a new character after dying and defeat the first milestone boss (Floor 5) on that new character. Die. Be reborn. Prove yourself immediately. The lotus does not wait.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'new_character_after_death', description: 'This character was started after a previous character died' },
      { metric: 'boss_kills', value: 1, description: 'Defeat the Floor 5 boss on this character' },
    ]},
    passiveId: 'nezha_spear_passive',
    passiveDescription: "Lotus Rebirth: once per run, if you die, Nezha's rebirth activates — return to 1 HP with a fire aura dealing 10% weapon damage to all enemies at the start of each turn for 3 turns.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 96, finalCritChance: 0.30, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_nezha_accessory', name: "Wind Fire Wheels",
    lore: "He rides wheels made of wind and fire. This is the accessory equivalent.",
    tier: 'deity', slot: 'accessory', deityId: 'nezha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Speed and fire together. My wheels go to those who combine both: defeat 5 enemies using fire-type attacks in a single run, each kill within 2 turns of combat starting. Fast and burning. Wind to carry fire to the target.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_type', value: 5, targetType: 'fire_attack_within_2_turns', description: 'Kill 5 enemies with fire attacks within 2 turns of combat starting, in one run' },
    ]},
    passiveId: 'nezha_wheels_passive',
    passiveDescription: "Wind-Fire Speed: you always go first in combat initiative. Additionally: fire-type attacks deal +20% damage when used on turn 1 or turn 2 of combat.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { AGI: 28, INT: 20 } },
  },
};

const LEI_GONG_RELICS: DeityRelicPair = {
  deityId: 'lei_gong',
  weapon: {
    id: 'deity_lei_gong_weapon', name: "Thunder God's Mallet",
    lore: "He is the Thunder God. He carries chisels and hammers. He uses them to punish evil and announce storms.",
    tier: 'deity', slot: 'weapon', deityId: 'lei_gong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I punish the wicked by striking them with lightning. My mallet goes to those who have punished enough: kill 50 enemies using skills that deal stun effects. Not just stun them — KILL them while they are stunned. The punishment must be final.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 50, targetType: 'kills_on_stunned_enemies', description: 'Kill 50 enemies while they are stunned, lifetime' },
    ]},
    passiveId: 'lei_gong_mallet_passive',
    passiveDescription: "Heaven's Judgment: +50% damage against stunned enemies. Also: when you stun an enemy, they remain stunned for +1 extra turn. Thunder's judgment is thorough.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 52, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_lei_gong_accessory', name: "Drum of Heaven's Gate",
    lore: "His drums call storms. Small drum. Major consequences.",
    tier: 'deity', slot: 'accessory', deityId: 'lei_gong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Thunder announces itself. My drum goes to those who make an entrance: in 5 different combats lifetime, stun an enemy on turn 1. Not later. Immediately. The announcement is the first strike.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 5, targetType: 'stun_on_turn_1_five_combats', description: 'Stun an enemy on turn 1 in 5 different combats lifetime' },
    ]},
    passiveId: 'lei_gong_drum_passive',
    passiveDescription: "Thunder Announcement: 20% chance on your first attack each combat to deal double damage and stun the target for 1 turn. Heaven announces judgment before it delivers it.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 24, AGI: 20 } },
  },
};

const ERLANG_SHEN_RELICS: DeityRelicPair = {
  deityId: 'erlang_shen',
  weapon: {
    id: 'deity_erlang_shen_weapon', name: "Three-Pointed Double-Edged Spear",
    lore: "He has three eyes. The third eye sees what the others cannot. The spear has three points for the same reason.",
    tier: 'deity', slot: 'weapon', deityId: 'erlang_shen',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My third eye sees all. My spear goes to those who prove they can see what others miss: use the Observe action before EVERY combat for 3 consecutive floors in a run, and win every combat on those floors. True sight enables true victory.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'three_floors_all_observed_and_won', description: '3 consecutive floors: observe every enemy before fighting AND win every combat' },
    ]},
    passiveId: 'erlang_spear_passive',
    passiveDescription: "Third Eye: after using Observe, your next 3 attacks against that enemy are guaranteed to hit and each have +15% critical chance. The third eye shows the perfect strike.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 100, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_erlang_shen_accessory', name: "Heaven Hound's Collar",
    lore: "His dog helps him hunt. The collar is so the dog knows who it serves.",
    tier: 'deity', slot: 'accessory', deityId: 'erlang_shen',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The hunt requires a hunter who cannot be fooled. My collar goes to those who prove they cannot be deceived: successfully predict and survive 20 different enemy special abilities across your lifetime (the Observe action shows them — predict it, then survive it). Watch, understand, endure.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 20, targetType: 'observe_then_survive_special_ability', description: 'Observe an enemy, see their special ability incoming, and survive it — 20 times lifetime' },
    ]},
    passiveId: 'erlang_collar_passive',
    passiveDescription: "True Sight Hunt: enemies that you have Observed cannot surprise you — their special abilities have 50% reduced effect when used against you. The third eye negates deception.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { PER: 30, WIS: 18 } },
  },
};

const MAZU_RELICS: DeityRelicPair = {
  deityId: 'mazu',
  weapon: {
    id: 'deity_mazu_weapon', name: "Sea Calmer's Staff",
    lore: "She protects sailors. She appeared above the water during a typhoon to guide ships. This is the staff she held.",
    tier: 'deity', slot: 'weapon', deityId: 'mazu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I calm storms. My staff goes to those who demonstrate they can bring peace to chaos: complete a run to Floor 15 where you cleared every floor without entering a single combat room on 3 separate floors (use non-combat paths only for those floors). The sea sometimes flows without storms.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 3, targetType: 'three_floors_zero_combat_rooms', description: '3 floors completed by avoiding all combat rooms (only non-combat paths used)' },
    ]},
    passiveId: 'mazu_staff_passive',
    passiveDescription: "Calming Presence: enemies in non-combat rooms do not trigger, giving you extra time to prepare. Also: flee success rate +25%. The sea guardian keeps her sailors safe.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 40, finalAccuracy: 92, finalCritChance: 0.22, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_mazu_accessory', name: "Lighthouse Beacon",
    lore: "She guided ships through storms. This is the light she carried.",
    tier: 'deity', slot: 'accessory', deityId: 'mazu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My light guides those in darkness. My beacon goes to those who follow it: complete 10 runs reaching Floor 5 or beyond lifetime — regardless of outcome, you returned to the Tower 10 times. Sailors who find the light keep sailing.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_runs_reaching_floor5', description: '10 dungeon runs reaching Floor 5+ lifetime (any outcome)' },
    ]},
    passiveId: 'mazu_beacon_passive',
    passiveDescription: "Guiding Light: floor maps are always partially revealed (25% of rooms visible) from the start. Also: rest sites on the current floor are always visible on the map.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 24, PER: 22 } },
  },
};

export const EAST_ASIAN_DEITY_RELICS: DeityRelicPair[] = [
  // Japanese
  AMATERASU_RELICS, SUSANOO_RELICS, TSUKUYOMI_RELICS, INARI_RELICS,
  RAIJIN_RELICS, FUJIN_RELICS, HACHIMAN_RELICS, BENZAITEN_RELICS,
  EBISU_RELICS, IZANAGI_RELICS, IZANAMI_RELICS, RYUJIN_RELICS, KAGUTSUCHI_RELICS,
  // Chinese
  JADE_EMPEROR_RELICS, GUAN_YU_RELICS, GUANYIN_RELICS, SUN_WUKONG_RELICS,
  NEZHA_RELICS, LEI_GONG_RELICS, ERLANG_SHEN_RELICS, MAZU_RELICS,
];
