/**
 * Dark Deity Relics — Ars Goetia and Fallen Angels
 */

import type { DeityRelicPair } from './deityRelics';

// ===== ARS GOETIA (astaroth already in main deityRelics.ts) =====

const BAEL_RELICS: DeityRelicPair = {
  deityId: 'bael',
  weapon: {
    id: 'deity_bael_weapon', name: "Three-Headed King's Scepter",
    lore: "He rules 66 legions. He appears as a man, toad, cat, and spider simultaneously. He has considered this branding.",
    tier: 'deity', slot: 'weapon', deityId: 'bael',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I grant invisibility and make men wise. My scepter goes to those who master what cannot be seen coming: kill 10 enemies as a critical hit on the FIRST attack of combat, lifetime. Strike before they know you are there. That is what my invisibility teaches.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'kill_with_crit_on_turn1_first_attack', description: 'Kill 10 enemies with a critical hit as the very first attack of combat, lifetime' },
    ]},
    passiveId: 'bael_scepter_passive',
    passiveDescription: "King's Invisibility: first attack of every combat has +30% critical chance. If it critically hits AND kills: gain +15% damage for the rest of the floor (invisible strike ripples forward).",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.36, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_bael_accessory', name: "Legion Count's Seal",
    lore: "66 legions under one command. The seal is the administrative proof.",
    tier: 'deity', slot: 'accessory', deityId: 'bael',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My 66 legions follow because they fear and respect the command equally. My seal goes to those who demonstrate command presence: reach Level 3 with CHA as your highest stat AND have a reputation of Friendly or better with at least 2 NPCs. Command respect before you command anything else.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 3, description: 'Reach Level 3' },
      { metric: 'stats_grade', value: 1, targetType: 'CHA_highest_stat', description: 'CHA is highest grade stat' },
    ]},
    passiveId: 'bael_seal_passive',
    passiveDescription: "Legion Command: Taunt is 30% more effective (higher reduction to enemy damage). Also: once per combat, your presence causes all enemies to hesitate for 1 turn at combat start (cannot act on turn 1).",
    accessoryStats: { accessoryType: 'seal', statBonuses: { CHA: 28, WIS: 18 } },
  },
};

const PAIMON_RELICS: DeityRelicPair = {
  deityId: 'paimon',
  weapon: {
    id: 'deity_paimon_weapon', name: "All Sciences Staff",
    lore: "He knows all arts and sciences. He comes with a cacophonous noise and requires you to ask questions before he answers.",
    tier: 'deity', slot: 'weapon', deityId: 'paimon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I know all arts and sciences. My staff goes to those who demonstrate equivalent breadth of knowledge: have all 8 stats with proficiency points accumulated on a single character at Level 5. Not necessarily high grades — just evidence of engagement with every stat. You must have used everything.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'custom', value: 1, targetType: 'all_8_stats_have_proficiency', description: 'All 8 stats have some proficiency accumulated on this character' },
    ]},
    passiveId: 'paimon_staff_passive',
    passiveDescription: "All Knowledge: INT and WIS-based skills cost -20% SP. Additionally, once per floor, 'consult Paimon' — receive an exact description of the strongest enemy on the floor before engaging it.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_paimon_accessory', name: "Desert Wind Compass",
    lore: "He arrives from the west on a dromedary. The compass finds him or anything else.",
    tier: 'deity', slot: 'accessory', deityId: 'paimon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I answer all questions. My compass goes to those who ask the right ones: use the Observe action 25 times in a single run. Ask. Investigate. The knowledge must be sought before it is given.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 25, description: 'Use Observe 25 times in one run' },
    ]},
    passiveId: 'paimon_compass_passive',
    passiveDescription: "Desert Wind: once per floor, the compass points to the most valuable room — the highest-reward room on the floor is marked on your map before you enter any other room.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 26, PER: 22 } },
  },
};

const ASMODEUS_RELICS: DeityRelicPair = {
  deityId: 'asmodeus',
  weapon: {
    id: 'deity_asmodeus_weapon', name: "Lust and Wrath Combined",
    lore: "He is the demon of lust. He is also one of the most powerful. He sees no contradiction.",
    tier: 'deity', slot: 'weapon', deityId: 'asmodeus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Desire makes everything worse and better simultaneously. My weapon goes to those who desire power so completely that they accept the cost: reach Level 4 with a character who has taken at least 3,000 total damage in their adventuring career. Want it. Pay for it. That is Asmodeus.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 4, description: 'Reach Level 4' },
      { metric: 'damage_taken_run', value: 3000, targetType: 'lifetime_on_character', description: 'Take 3,000+ total damage across all runs on this character' },
    ]},
    passiveId: 'asmodeus_weapon_passive',
    passiveDescription: "Burning Desire: +5% damage for every 100 HP lost this run (max +30%). The wanting fuels the striking.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_asmodeus_accessory', name: "Prince of Lust's Ring",
    lore: "His ring makes those who wear it irresistible. This is a simplified version that works through proximity to combat.",
    tier: 'deity', slot: 'accessory', deityId: 'asmodeus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Desire controls everything. To earn my ring: use Taunt successfully against 5 different boss-type enemies across your lifetime. Make them want to fight you. Make them come to you. Even the most powerful surrender to desire.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 5, targetType: 'successful_boss_taunt', description: 'Successfully Taunt 5 different boss-type enemies lifetime' },
    ]},
    passiveId: 'asmodeus_ring_passive',
    passiveDescription: "Irresistible: enemies who have been Taunted have 30% lower chance to use special abilities (they are focused on you, not their techniques). Also: successful Taunt reduces enemy damage by 35% instead of 20%.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { CHA: 30, LCK: 18 } },
  },
};

const BELETH_RELICS: DeityRelicPair = {
  deityId: 'beleth',
  weapon: {
    id: 'deity_beleth_weapon', name: "Battle-Rage Sword",
    lore: "He rides a pale horse. He is terrifying. He causes love between men and women. This is the problem with his domain.",
    tier: 'deity', slot: 'weapon', deityId: 'beleth',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My presence causes uncontrollable desire. My sword goes to those who demonstrate uncontrollable rage: kill 10 enemies in a single run using the basic Attack action exclusively — no skills for those 10 kills, pure attack. Then follow with 10 more kills using only skills. Desire and fury alternate.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 10, targetType: 'basic_attack_only_kills', description: '10 kills using only basic Attack in one run' },
      { metric: 'consecutive_fights', value: 10, targetType: 'skill_only_kills_in_same_run', description: '10 kills using only skills in that same run' },
    ]},
    passiveId: 'beleth_sword_passive',
    passiveDescription: "Battle Desire: if your last 3 kills were all basic attacks, your next attack is +40% damage. If your last 3 kills were all skills, your next skill costs 0 SP. Desire for the other fuels the current.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'CHA', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_beleth_accessory', name: "Pale Rider's Brand",
    lore: "He comes on a pale horse with trumpets. He is extremely difficult to ignore.",
    tier: 'deity', slot: 'accessory', deityId: 'beleth',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My trumpet announces battle and desire. My brand goes to those who make a statement: in a single combat, use Taunt 3 times in one fight AND win that fight. Make them come to you, three times, and then end it.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 3, targetType: 'three_taunts_single_combat', description: 'Use Taunt 3 times in one combat AND win' },
    ]},
    passiveId: 'beleth_brand_passive',
    passiveDescription: "Pale Announcement: when combat begins, all enemies prioritize targeting you (they cannot target elsewhere). In exchange: +15% damage against all enemies this combat. The announcement is the advantage.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { CHA: 26, STR: 20 } },
  },
};

const BUER_RELICS: DeityRelicPair = {
  deityId: 'buer',
  weapon: {
    id: 'deity_buer_weapon', name: "Healer's Wheel-Blade",
    lore: "He appears as a wheel that rolls through the world. He knows philosophy, logic, herbs, and healing. He is a wheel.",
    tier: 'deity', slot: 'weapon', deityId: 'buer',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I heal all ailments. My blade goes to those who demonstrate healing mastery: in a single combat, heal more HP than you take damage. Receive 50 damage, heal 60. The net must be positive. Show me the healer's math.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'healing_received', value: 1, targetType: 'heal_more_than_damage_in_combat', description: 'In one combat: heal more HP total than you took as damage' },
    ]},
    passiveId: 'buer_blade_passive',
    passiveDescription: "Healer's Strike: 10% of all damage you deal is converted to HP healing for you. The wheel spins healing through combat.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 42, finalAccuracy: 90, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_buer_accessory', name: "Philosophical Wheel Token",
    lore: "He teaches what is most important about the world. The world disagrees on what that is. He does not care.",
    tier: 'deity', slot: 'accessory', deityId: 'buer',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I heal more than the body. To earn my token: receive healing 75 times total lifetime from any source. Seventy-five times, the healing wheel touched you. Then it recognizes you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 75, description: 'Receive healing 75 times from any source lifetime' },
    ]},
    passiveId: 'buer_token_passive',
    passiveDescription: "Wheel of Healing: all healing received +25%. Additionally: once per combat, the wheel activates — remove 1 random negative status effect from yourself (Buer's herbs cleanse automatically).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { END: 24, WIS: 20 } },
  },
};

const SITRI_RELICS: DeityRelicPair = {
  deityId: 'sitri',
  weapon: {
    id: 'deity_sitri_weapon', name: "Leopard Wings Blade",
    lore: "He has a leopard's head and wings. He causes love. He also strips people naked if asked. He is extremely flexible.",
    tier: 'deity', slot: 'weapon', deityId: 'sitri',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I reveal what is hidden in the heart. My blade goes to those who reveal hidden things: complete 25 mystery rooms total lifetime. Each mystery room is a hidden heart. Open 25.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 25, description: 'Complete 25 mystery rooms lifetime' },
    ]},
    passiveId: 'sitri_blade_passive',
    passiveDescription: "Revelation: once per combat, strip an enemy of their defensive bonus — all damage against them ignores resistance/defense for 3 turns. Sitri reveals what is underneath.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_sitri_accessory', name: "Sixty Legions' Lure",
    lore: "He commands 60 legions. He attracts people toward each other involuntarily. He finds this efficient.",
    tier: 'deity', slot: 'accessory', deityId: 'sitri',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Attraction is a force that bends willpower. To earn the Lure: use Taunt 50 times total lifetime. Draw them in. All 50 times.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 50, description: 'Use Taunt 50 times lifetime' },
    ]},
    passiveId: 'sitri_lure_passive',
    passiveDescription: "Involuntary Attraction: once per floor, automatically draw the nearest enemy toward you — triggering combat on your terms (you attack first). The lure draws them whether they want to come or not.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 26, LCK: 20 } },
  },
};

// ===== FALLEN ANGELS =====

const LUCIFER_RELICS: DeityRelicPair = {
  deityId: 'lucifer',
  weapon: {
    id: 'deity_lucifer_weapon', name: "Light Bearer's Blade",
    lore: "He was the morning star before the fall. The blade carries the light of what he was, not what he became.",
    tier: 'deity', slot: 'weapon', deityId: 'lucifer',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was the highest of all. I fell the farthest. My blade goes to those who understand the fall: start with the highest possible stat allocation in a single stat (put all 30 creation points into one stat) and still reach Level 5. Pride in one thing. Fall from the others. Rise anyway.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'custom', value: 1, targetType: 'all_30_creation_points_in_one_stat', description: 'Character creation: put all 30 stat points into a single stat' },
    ]},
    passiveId: 'lucifer_blade_passive',
    passiveDescription: "Light of Pride: +30% damage with your highest-grade stat's scaling weapon. When using a different weapon type: -10% damage. The morning star burns brightest in one direction.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'CHA', finalDamage: 55, finalAccuracy: 95, finalCritChance: 0.30, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_lucifer_accessory', name: "Fallen Star Crown",
    lore: "He fell like lightning from heaven. The crown is the impact point.",
    tier: 'deity', slot: 'accessory', deityId: 'lucifer',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fall and rise. Fall and rise. To earn my crown: die 5 times total lifetime AND still have a character at Level 5 or higher. Five falls. Rise above them all. The morning star rises every dawn.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_deaths_and_level5_character', description: '5 total deaths lifetime AND a character at Level 5+' },
    ]},
    passiveId: 'lucifer_crown_passive',
    passiveDescription: "Morning Star: +15% to all stats when your HP is above 75%. When below 25% HP: release a burst of fallen starlight dealing 30% of max HP as damage to all enemies. Lucifer falls with radiance.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 28, CHA: 20 } },
  },
};

const AZAZEL_RELICS: DeityRelicPair = {
  deityId: 'azazel',
  weapon: {
    id: 'deity_azazel_weapon', name: "Forbidden Knowledge Blade",
    lore: "He taught humans how to make weapons and use cosmetics. Both considered forbidden. He has some regrets about one of those.",
    tier: 'deity', slot: 'weapon', deityId: 'azazel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I taught humanity to make weapons. My blade goes to those who master what I taught: upgrade any weapon to Legendary quality at the Blacksmith. Not masterwork — Legendary. The forbidden knowledge of perfect weaponcraft.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_legendary', value: 1, description: 'Upgrade a weapon to Legendary quality at the Blacksmith' },
    ]},
    passiveId: 'azazel_blade_passive',
    passiveDescription: "Forbidden Craft: this weapon ignores the quality cap — it can be upgraded beyond Legendary at the Blacksmith (to 'Forbidden' tier, +15 additional damage on top of Legendary stats).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 52, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_azazel_accessory', name: "Scapegoat's Mark",
    lore: "His name gives us 'scapegoat.' He was the original one sent to the wilderness carrying humanity's sins. He has not forgiven this.",
    tier: 'deity', slot: 'accessory', deityId: 'azazel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I carry what others refused. My mark goes to those who endure carrying the blame: survive a run where you received 5 or more negative status effects AND still completed the run (reached the run-end condition, not death). Bear the weight. Walk out anyway.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, description: 'Receive 5+ status effects in one run' },
      { metric: 'custom', value: 1, targetType: 'run_completed_not_died', description: 'Complete the run without dying' },
    ]},
    passiveId: 'azazel_mark_passive',
    passiveDescription: "Scapegoat's Resilience: negative status effects deal -25% damage to you (Azazel knows how to carry sin without being destroyed by it). Also: when all status effects on you expire, restore 5% HP.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 26, WIS: 18 } },
  },
};

const SAMAEL_RELICS: DeityRelicPair = {
  deityId: 'samael',
  weapon: {
    id: 'deity_samael_weapon', name: "Venom Sword of the Angel of Death",
    lore: "He is the angel of death and also the source of venom. Both jobs require precision.",
    tier: 'deity', slot: 'weapon', deityId: 'samael',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Venom works over time. My sword goes to those who understand time as a weapon: apply poison to 30 enemies total lifetime AND have at least 15 of those enemies die from poison damage (not direct attack). Let the venom do the work.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 30, targetType: 'poison', description: 'Apply poison to 30 enemies lifetime' },
      { metric: 'custom', value: 15, targetType: 'kills_from_poison_damage', description: '15 enemies killed by poison damage (not direct attack), lifetime' },
    ]},
    passiveId: 'samael_sword_passive',
    passiveDescription: "Angel's Venom: poison you apply stacks (2 independent poison effects can be active). The second stack deals +50% more damage per tick. Samael's venom is patient and thorough.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'AGI', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_samael_accessory', name: "Death Cup Pendant",
    lore: "The cup of death. It gives visions. It also sometimes kills. He finds this acceptable product liability.",
    tier: 'deity', slot: 'accessory', deityId: 'samael',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Death comes for everyone, but venom comes for those who let it. My pendant goes to those who survive their own: be afflicted by poison AND survive 10 dungeon floors while poisoned across your lifetime (total floors, not consecutive). Walk through venom. Emerge.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 1, targetType: 'ten_floors_while_poisoned', description: 'Survive 10 floors total while carrying poison status, lifetime' },
    ]},
    passiveId: 'samael_pendant_passive',
    passiveDescription: "Immune to Venom: you cannot be killed by poison damage (floor minimum: 1 HP). Also: poison on you converts 25% of its damage to SP restoration (the angel of death feeds your power).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 24, END: 22 } },
  },
};

const LILITH_RELICS: DeityRelicPair = {
  deityId: 'lilith',
  weapon: {
    id: 'deity_lilith_weapon', name: "Night Queen's Talon",
    lore: "She was Adam's first wife. She refused to be subservient. She left. She did quite well afterward.",
    tier: 'deity', slot: 'weapon', deityId: 'lilith',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I refused what was demanded of me. My talon goes to those who demonstrate the same refusal: in a single run to Floor 15, never use the Defend action AND never use a healing item. Refuse defensiveness. Refuse comfort. Fight on your own terms, without compromise.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'floor_nodefend', value: 15, description: 'Zero Defend actions' },
      { metric: 'floor_noconsumable', value: 15, description: 'Zero consumables used' },
    ]},
    passiveId: 'lilith_talon_passive',
    passiveDescription: "Refused Submission: +25% damage while below 50% HP. When at full HP: +10% critical chance. Lilith fights hardest when it matters most and sharpest when she does not need to.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'CHA', finalDamage: 50, finalAccuracy: 96, finalCritChance: 0.34, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_lilith_accessory', name: "Night Owl Pendant",
    lore: "She rules the night and is associated with owls and screech owls. The pendant remembers the owl.",
    tier: 'deity', slot: 'accessory', deityId: 'lilith',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am free because I chose freedom over comfort. My pendant goes to those who make the same choice: bypass 2 milestone bosses through dialogue in a single run AND still complete the run by reaching a floor beyond the bypassed boss. Walk past power. Find what is beyond it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 2, description: 'Bypass 2 bosses through dialogue in one run' },
      { metric: 'floors_reached', value: 15, description: 'Still reach Floor 15 or beyond in that run' },
    ]},
    passiveId: 'lilith_pendant_passive',
    passiveDescription: "Sovereign Night: CHA checks have +20% success rate. Also: you can choose to pass through any elite room without engaging (declare 'night passage' once per floor — they do not see you).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { CHA: 28, AGI: 20 } },
  },
};

const BEELZEBUB_RELICS: DeityRelicPair = {
  deityId: 'beelzebub',
  weapon: {
    id: 'deity_beelzebub_weapon', name: "Lord of Flies' Staff",
    lore: "He is the lord of flies. An entire domain built around the principle that annoyance can be divinity.",
    tier: 'deity', slot: 'weapon', deityId: 'beelzebub',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Flies are everywhere. They land where they choose. My staff goes to those who demonstrate equivalent persistence: kill 300 enemies total lifetime. Not in one run — total, accumulated, across all your characters. Three hundred flies.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 300, description: 'Kill 300 enemies total lifetime' },
    ]},
    passiveId: 'beelzebub_staff_passive',
    passiveDescription: "Lord of Flies: summon a swarm once per combat — the swarm deals 5% max HP damage to all enemies per turn for 3 turns (flies everywhere, unavoidable). Cannot be blocked or resisted.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'END', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.26, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_beelzebub_accessory', name: "Fly Swarm Ring",
    lore: "He commands flies. This ring occasionally lets one fly through it. This is intentional.",
    tier: 'deity', slot: 'accessory', deityId: 'beelzebub',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Corruption spreads like flies. To earn the ring: apply 100 total status effects across your lifetime — any type, any target. Spread the corruption. 100 times.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 100, description: 'Apply 100 total status effects lifetime' },
    ]},
    passiveId: 'beelzebub_ring_passive',
    passiveDescription: "Corruption Spreads: once per combat, your status effects automatically spread to one additional enemy (the flies carry the affliction). Each spread deals an initial burst of 10% weapon damage.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { INT: 24, LCK: 20 } },
  },
};

const BELIAL_RELICS: DeityRelicPair = {
  deityId: 'belial',
  weapon: {
    id: 'deity_belial_weapon', name: "Worthlessness Blade",
    lore: "Belial means 'without worth.' He is the spirit of lies and lawlessness. He has made a career of the irony.",
    tier: 'deity', slot: 'weapon', deityId: 'belial',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Lies are the most powerful weapon. To earn mine: bypass 3 milestone bosses through dialogue in 3 separate runs. Three lies, three bypasses. The lie that says 'you don't need to fight' is always the most powerful one.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 3, description: 'Bypass 3 milestone bosses through dialogue, lifetime' },
    ]},
    passiveId: 'belial_blade_passive',
    passiveDescription: "Perfect Lie: Taunt is 40% more effective. Also: once per run, declare a lie — tell the next enemy you encounter that you are stronger than you are (they flee immediately). No combat. Works once.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_belial_accessory', name: "Lawless Brand",
    lore: "He is lawlessness itself. The brand is his mark on those who understand that rules are for the rule-followers.",
    tier: 'deity', slot: 'accessory', deityId: 'belial',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Rules are for those who cannot break them. My brand goes to those who exist outside the expected: complete a run to Floor 10 where at least 3 of your level-up achievement selections were not the type that most players select (if 90% of players choose a certain pattern, choose differently). Be anomalous.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'unconventional_achievement_selections', description: 'At level-ups, select unexpected/minority achievement paths at least 3 times' },
    ]},
    passiveId: 'belial_brand_passive',
    passiveDescription: "Without Law: you are immune to any mechanic that 'prevents' or 'blocks' actions. Walls, locks, barriers, immunities that affect player actions — none apply to you. Lawlessness is absolute.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { CHA: 24, LCK: 22 } },
  },
};

const ABADDON_RELICS: DeityRelicPair = {
  deityId: 'abaddon',
  weapon: {
    id: 'deity_abaddon_weapon', name: "Destroyer's Lance",
    lore: "He is the angel of the abyss and the destroyer. In Revelation he commands the locust army. He considers this a reasonable hobby.",
    tier: 'deity', slot: 'weapon', deityId: 'abaddon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The destroyer arrives from the bottomless pit. My lance goes to those who reach the bottom: reach Floor 30 in a single run. The abyss is below Floor 25. Go there. The destroyer recognizes those who have seen the pit.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 30, description: 'Reach Floor 30 in a single run' },
    ]},
    passiveId: 'abaddon_lance_passive',
    passiveDescription: "From the Abyss: +5% damage per floor below Floor 20 you have descended to in this run (max +25% at Floor 25). Deeper descent means more of the abyss in the strike.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_abaddon_accessory', name: "Locust Army Token",
    lore: "He commands locusts that look like horses. The token is from their armor.",
    tier: 'deity', slot: 'accessory', deityId: 'abaddon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The locust army descends with one purpose: destruction of everything. My token goes to those who destroy completely: in a single run, destroy (permanently remove) 3 items from your inventory intentionally. Sacrifice what you have to become what you need to be.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'items_destroyed', value: 3, description: 'Destroy 3 items intentionally in one run' },
    ]},
    passiveId: 'abaddon_token_passive',
    passiveDescription: "Locust Swarm: once per combat, release a locust surge — hits all enemies for 15% of their current HP as dark damage. The swarm ignores defense and resistances.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { STR: 24, END: 20 } },
  },
};

const MAMMON_RELICS: DeityRelicPair = {
  deityId: 'mammon',
  weapon: {
    id: 'deity_mammon_weapon', name: "Greed's Golden Blade",
    lore: "He is the demon of greed. He appears as a fat demon sitting on a throne of gold. He does not consider this negative imagery.",
    tier: 'deity', slot: 'weapon', deityId: 'mammon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Greed is collecting everything. My blade goes to the truly greedy: accumulate 50,000 gold total across all your characters lifetime. Not in one session — lifetime. 50,000 gold collected, in all forms. Show me the measure of your appetite.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 50000, description: 'Accumulate 50,000 gold lifetime across all characters' },
    ]},
    passiveId: 'mammon_blade_passive',
    passiveDescription: "Gold Hunger: +20% gold from all sources. Also: enemies killed with this weapon drop an extra 5-20G regardless of type. Mammon ensures profit from every kill.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_mammon_accessory', name: "Treasury Key of Mammon",
    lore: "He holds all the wealth of the world. This key opens a small part of it.",
    tier: 'deity', slot: 'accessory', deityId: 'mammon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The treasury is full for those who fill it. My key goes to those who have proven their devotion to wealth: spend 40,000 gold total lifetime — at any vendor, Blacksmith, or shop. Show me the gold flows, not just accumulates. The market moves gold, not hoards it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 40000, targetType: 'total_gold_spent_any_source', description: 'Spend 40,000 total gold at any vendors/shops/blacksmith lifetime' },
    ]},
    passiveId: 'mammon_key_passive',
    passiveDescription: "Mammon's Treasury: once per run, open a hidden vault in a random room — contains 500-2,000G and one item of guaranteed Rare quality or better. The treasury opens for those Mammon trusts.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { LCK: 30, CHA: 18 } },
  },
};

export const DARK_DEITY_RELICS: DeityRelicPair[] = [
  // Ars Goetia (astaroth in main file)
  BAEL_RELICS, PAIMON_RELICS, ASMODEUS_RELICS, BELETH_RELICS,
  BUER_RELICS, SITRI_RELICS,
  // Fallen Angels
  LUCIFER_RELICS, AZAZEL_RELICS, SAMAEL_RELICS, LILITH_RELICS,
  BEELZEBUB_RELICS, BELIAL_RELICS, ABADDON_RELICS, MAMMON_RELICS,
];
