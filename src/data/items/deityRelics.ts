/**
 * Deity Relics — the rarest tier of sacred items.
 *
 * ONE weapon + ONE accessory per deity (168 deities × 2 = 336 items).
 * The acquisition condition is ONLY revealed when the player reaches
 * 100% favor (Favoured Child) with that specific deity.
 *
 * The reveal text is the deity's exact words — cryptic, personal, in their voice.
 * No two deities have the same condition.
 *
 * This file contains the FULLY IMPLEMENTED relics for:
 * - The 5 milestone bosses (Vanya, Sorath, Kutcher, Kalindi, Malik)
 * - ~30 key deities from major pantheons
 * - The FRAMEWORK for all 168 (empty entries for unimplemented deities)
 */

import type { SacredItem } from '../../types/SacredItem';

export interface DeityRelicPair {
  deityId: string;
  weapon: SacredItem;
  accessory: SacredItem;
}

// =========================================
// SLAVIC — Key Deities + Bosses
// =========================================

const VANYA_RELICS: DeityRelicPair = {
  deityId: 'vanya',
  weapon: {
    id: 'deity_vanya_weapon',
    name: "Vanya's Memory Blade",
    lore: 'She remembers every adventurer who passed. This weapon remembers every kill.',
    tier: 'deity', slot: 'weapon', deityId: 'vanya',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "You have reached the end of my patience for secrets. I will tell you one thing: I remember everything you have ever done in this Tower. I remember the first room. I remember the last one. The blade is there, in the room where you first understood that you would not always win. Go back. It waits in a room you already cleared.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_bypass', value: 1, targetType: 'vanya', description: "Bypass Vanya through dialogue ('boss_bypassed' flag active)" },
        { metric: 'floors_reached', value: 10, description: 'After bypassing Vanya, continue to reach Floor 10 in the same run' },
      ],
    },
    passiveId: 'vanya_memory_weapon',
    passiveDescription: "This weapon remembers: for each boss you have ever talked to (any dialogue interaction), gain +5 flat damage (max +25 from 5 bosses). Cannot be upgraded — it is already complete.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_vanya_accessory',
    name: "Vanya's Corrosion Shell",
    lore: 'She shed this piece of herself to let you in. Wear it carefully.',
    tier: 'deity', slot: 'accessory', deityId: 'vanya',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "I gave up a piece of my shell once — to let something through that should not have passed. The piece is still in the Tower somewhere. Find the room where the wall is most corroded and press your palm against it. If you have been recognized enough times, the shell will recognize you in return.",
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [
        { metric: 'boss_bypass', value: 3, description: "Bypass Vanya (by dialogue) 3 separate times across all runs" },
      ],
    },
    passiveId: 'vanya_shell_passive',
    passiveDescription: "Corrosion Shell: once per floor, the first hit you receive is absorbed by the shell (0 damage). The shell then 'corrodes' an enemy — their next 2 attacks deal -20% damage.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 25, WIS: 20 } },
  },
};

const SORATH_RELICS: DeityRelicPair = {
  deityId: 'sorath',
  weapon: {
    id: 'deity_sorath_weapon',
    name: "Sorath's Bargain Staff",
    lore: "Every deal has a clause. This one is written in the damage.",
    tier: 'deity', slot: 'weapon', deityId: 'sorath',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "Oh, you've earned this. I'll tell you — but listen carefully, because I'll only say it once. The staff requires a sacrifice: come to me with something you love and give it up before the fight. By 'something you love,' I mean: enter my floor with a Masterwork or Legendary weapon equipped, and destroy it before the fight begins. The staff will materialize from the ashes. That's my kind of deal.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'items_destroyed', value: 1, targetType: 'masterwork_or_legendary_before_sorath', description: "Destroy a Masterwork or Legendary weapon on Floor 10 (Sorath's floor) before engaging" },
        { metric: 'boss_kills_run', value: 1, targetType: 'sorath', description: 'Then defeat Sorath in the same run' },
      ],
    },
    passiveId: 'sorath_bargain_weapon',
    passiveDescription: "The Bargain: this weapon deals bonus damage equal to the sell price of the most expensive item you have destroyed this run ÷ 50 (flat damage bonus, capped at +30).",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.32, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_sorath_accessory',
    name: "Sorath's Rewind Fragment",
    lore: "Time is the only currency Sorath cannot counterfeit.",
    tier: 'deity', slot: 'accessory', deityId: 'sorath',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "You want the Rewind? Here's what it costs: lose. On purpose. Walk into my floor knowing you won't be making it. Die on Floor 10 — not any floor, THAT one — and die with at least 3 milestone boss kills already recorded this run. The Rewind will be in your next character's starting inventory. That's how time works.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 3, description: 'Kill 3 milestone bosses in the run' },
        { metric: 'floors_reached', value: 10, targetType: 'die_on_floor_10', description: 'Die on Floor 10 specifically (Sorath\'s floor) — this run is consumed' },
      ],
    },
    passiveId: 'sorath_rewind_passive',
    passiveDescription: "Rewind: once per character lifetime, when you die, you are returned to the start of the current floor with full HP/SP and your run state intact. The Rewind then shatters.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 25, INT: 20 } },
  },
};

const KUTCHER_RELICS: DeityRelicPair = {
  deityId: 'kutcher',
  weapon: {
    id: 'deity_kutcher_weapon',
    name: "Kutcher's Static Harvester",
    lore: 'Every stolen charge builds the final strike.',
    tier: 'deity', slot: 'weapon', deityId: 'kutcher',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "I drain energy. That is what I do. To earn this weapon, you must drain mine: when we fight, do not use a single skill — not one. Make me work for every drop of SP I siphon from you. Exhaust my patience with pure persistence. When my HP reaches 0 and your SP is still above 0, the weapon will already be in your hand.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, targetType: 'kutcher', description: 'Defeat Kutcher (Floor 15)' },
        { metric: 'skill_uses', value: 0, targetType: 'during_kutcher_fight', description: 'Zero skill uses during the Kutcher fight specifically' },
        { metric: 'skill_sp_spent', value: 1, targetType: 'SP_above_0_at_kutcher_kill', description: 'Your SP must be above 0 when Kutcher dies' },
      ],
    },
    passiveId: 'kutcher_harvester_passive',
    passiveDescription: "Static Siphon: each hit on an enemy drains 2 SP from them (if they have SP-based mechanics) and adds to your damage pool (+1% damage per 10 SP drained, max +20%). SP drain is cosmetic flavor for enemies without SP.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'END', finalDamage: 45, finalAccuracy: 88, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_kutcher_accessory',
    name: "Kutcher's Song of Truth",
    lore: 'He carried a melody that stopped everything else. This carries an echo of it.',
    tier: 'deity', slot: 'accessory', deityId: 'kutcher',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The song requires a listener. To earn this, you must listen to this floor completely — enter every single room on Floor 15 before touching Kutcher. Every room. Leave none unexplored. Then find me. The song will recognize you as someone who actually pays attention.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, targetType: 'kutcher', description: 'Defeat Kutcher (Floor 15)' },
        { metric: 'consecutive_fights', value: 1, targetType: 'all_rooms_floor_15_before_boss', description: 'Enter every room on Floor 15 before entering the boss room' },
      ],
    },
    passiveId: 'kutcher_song_passive',
    passiveDescription: "Song of Truth: once per combat, you may 'play the song' — all status effects currently on you convert to Regen effects of equal duration. Burn becomes healing fire. Poison becomes cleansing.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 22, CHA: 22 } },
  },
};

const KALINDI_RELICS: DeityRelicPair = {
  deityId: 'kalindi',
  weapon: {
    id: 'deity_kalindi_weapon',
    name: "Kalindi's River Blade",
    lore: 'The river does not stop. The river does not fight the stones. The river is what happens after.',
    tier: 'deity', slot: 'weapon', deityId: 'kalindi',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "Purification is not done once. It is done every day. You want my blade? Clean yourself before coming to me: the entire run leading to my floor — no status effects inflicted on YOU. Poison, burn, bleed, anything — arrive at Floor 20 pristine. Completely clean. The river does not carry mud to its destination. It arrives clear.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, targetType: 'kalindi', description: 'Defeat Kalindi (Floor 20)' },
        { metric: 'status_received_survived', value: 0, description: 'Zero status effects received on you the entire run (arrive at Floor 20 with no debuff history this run)' },
      ],
    },
    passiveId: 'kalindi_river_passive',
    passiveDescription: "River Purity: this weapon deals +2% extra damage for each floor you have descended without receiving a status effect (current run). Maximum +40% at Floor 20 clean run.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 47, finalAccuracy: 95, finalCritChance: 0.24, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_kalindi_accessory',
    name: "Kalindi's Purification Vessel",
    lore: "She cleanses what enters. She releases what is clean.",
    tier: 'deity', slot: 'accessory', deityId: 'kalindi',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The Vessel holds what needs cleaning. To earn it, you must fill it: inflict the maximum number of different status effects on a single enemy in one fight — burn, poison, bleed, weaken, slow, blind, curse, freeze, stun. All of them. On one enemy. Before it dies. Show me you understand that purification requires knowing what impurity looks like.",
    acquisition: {
      scope: 'single_combat', requireAll: true,
      requirements: [
        { metric: 'status_inflict', value: 7, targetType: 'seven_different_types_one_enemy', description: 'Apply 7 different status effect types to a single enemy in one combat (burn, poison, bleed, weaken, slow, blind, curse minimum)' },
      ],
    },
    passiveId: 'kalindi_vessel_passive',
    passiveDescription: "Purification Vessel: when you apply a status effect, it is amplified — its damage/duration is +50%. Also: when all active status effects on an enemy expire naturally (not cured), you restore 10% max HP.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 25, END: 18 } },
  },
};

const MALIK_RELICS: DeityRelicPair = {
  deityId: 'malik',
  weapon: {
    id: 'deity_malik_weapon',
    name: "Malik's Echo Chain",
    lore: 'The chain binds what should not be free. It was made when freedom was a concept, not a state.',
    tier: 'deity', slot: 'weapon', deityId: 'malik',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "You have impressed me. That is not easy to do. The Chain requires you to understand what I am: I am what happens when reality forgets itself. To earn the Chain, you must become equally inconsistent — in a single fight against me, use every different action available to you: Attack, Defend, Observe, Taunt, Flee-attempt, Item-use, and Skill. All seven in one fight. Reality will notice the contradiction. So will I.",
    acquisition: {
      scope: 'single_combat', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, targetType: 'malik', description: 'Defeat Malik (Floor 25)' },
        { metric: 'skill_uses', value: 1, targetType: 'all_seven_action_types_in_malik_fight', description: 'Use all 7 action types (Attack, Defend, Observe, Taunt, Flee-attempt, Item, Skill) in the Malik fight' },
      ],
    },
    passiveId: 'malik_chain_passive',
    passiveDescription: "Echo Chains: each time you use a different action type in a combat, add +5% damage for the rest of that fight (max +35% using all 7 action types). The chain echoes every choice.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.35, range: 'melee', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_malik_accessory',
    name: "Malik's Void Scholar Token",
    lore: 'Unreality consolidated into an object. The object is uncertain about its own existence.',
    tier: 'deity', slot: 'accessory', deityId: 'malik',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "You want the Token? Here is what I know about you: you have been here before. Every run is a repetition of a pattern. The Token wants you to break the pattern completely. Play a full run — Floor 1 to reaching me — and never use any weapon, skill, or action that you used in your previous run. Different weapon category. Different skills. Different approach entirely. The Void rewards novelty. It is the only thing it cannot predict.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, targetType: 'malik', description: 'Defeat Malik' },
        { metric: 'kills_with_stat', value: 1, targetType: 'different_category_than_last_run', description: 'Use a completely different weapon stat category than your previous run' },
      ],
    },
    passiveId: 'malik_void_passive',
    passiveDescription: "Void Scholar: each run, this token 'learns' one enemy weakness. Enemies of that type take +10% damage for the rest of the run. The knowledge changes every run — the Void does not repeat.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { LCK: 25, WIS: 20 } },
  },
};

// =========================================
// GREEK DEITIES — Key Examples
// =========================================

const ZEUS_RELICS: DeityRelicPair = {
  deityId: 'zeus',
  weapon: {
    id: 'deity_zeus_weapon',
    name: "Zeus's Personal Bolt",
    lore: 'Not the copy. The real one. He says there is a difference.',
    tier: 'deity', slot: 'weapon', deityId: 'zeus',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "I have watched you. I have judged you. Now I will make this simple: I am the King of Gods. My weapon goes to those who have commanded others — who have NEVER fled, who have dominated every floor they walked, and who have reached my Olympus equivalent in this Tower. Reach Floor 25 without a single retreat. Then — and only then — you are worthy of what I use. I will not negotiate this condition.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'floors_reached', value: 25, description: 'Reach Floor 25' },
        { metric: 'floor_noretreat', value: 1, description: 'Zero retreat/flee attempts the entire run' },
        { metric: 'boss_kills_run', value: 5, description: 'All 5 milestone bosses defeated in this run' },
      ],
    },
    passiveId: 'zeus_bolt_passive',
    passiveDescription: "The Thunderking's Sovereignty: +10% damage for each active buff you currently have. Also: once per combat, release a thunderstrike that hits all enemies (ignores single-target limitation) for 150% damage.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'CHA', finalDamage: 60, finalAccuracy: 95, finalCritChance: 0.30, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_zeus_accessory',
    name: "Crown of Olympus",
    lore: "Wearing this tells every enemy exactly who they are dealing with.",
    tier: 'deity', slot: 'accessory', deityId: 'zeus',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The Crown goes to those who have ruled. Rule means: never asking for mercy, never running, and always being the last thing standing. Complete the Paragon path — Level 10 — on a character who has never once used the Flee action. From Level 1 to Level 10. Not one retreat. Do this and the Crown is yours.",
    acquisition: {
      scope: 'single_character', requireAll: true,
      requirements: [
        { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon' },
        { metric: 'flee_total', value: 0, description: 'Zero flee attempts on this character their entire lifetime' },
      ],
    },
    passiveId: 'zeus_crown_passive',
    passiveDescription: "King of Gods: your presence commands — Taunt now permanently reduces enemy damage by 40% (instead of 20%) and costs 1 less SP. Enemies with knowledge of your past victories are 10% weaker.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 30, STR: 25 } },
  },
};

const ATHENA_RELICS: DeityRelicPair = {
  deityId: 'athena',
  weapon: {
    id: 'deity_athena_weapon',
    name: "Spear of the Owl's Wisdom",
    lore: 'Strategy makes this spear perfect. Without strategy, it is just a spear.',
    tier: 'deity', slot: 'weapon', deityId: 'athena',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "Wisdom without strategy is merely information. To earn my spear, demonstrate strategy: defeat any Floor 20+ boss having observed it with the Observe action, having used every skill type once (physical, magic, support), and having dealt the killing blow with a skill — not a basic attack. Show me you planned the entire fight.",
    acquisition: {
      scope: 'single_combat', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, targetType: 'floor_20_plus', description: 'Defeat a Floor 20+ boss' },
        { metric: 'observe_total', value: 1, targetType: 'this_boss_fight', description: 'Used Observe in this fight' },
        { metric: 'boss_skillonly', value: 1, description: 'Killing blow is a skill, not a basic attack' },
      ],
    },
    passiveId: 'athena_spear_passive',
    passiveDescription: "Strategic Perfection: when you have used Observe, at least one support skill, and at least one attacking skill in a combat: +25% damage on every subsequent attack in that fight.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'PER', finalDamage: 48, finalAccuracy: 98, finalCritChance: 0.25, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_athena_accessory',
    name: "Owl's Eye Pendant",
    lore: 'The owl sees what others call darkness.',
    tier: 'deity', slot: 'accessory', deityId: 'athena',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The pendant belongs to one who has proven they study as hard as they fight. Observe every elite and boss encounter in a single run — every single one — before making any attack in that fight. Complete the run through Floor 20. The Owl only grants sight to those who actually look.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
        { metric: 'observe_total', value: 1, targetType: 'all_elites_and_bosses_first', description: 'Observed every elite and boss before the first attack in each of those fights' },
      ],
    },
    passiveId: 'athena_owl_passive',
    passiveDescription: "Tactical Awareness: enemies observed at least once during this run have their special abilities previewed 1 turn before they use them (shown in combat log with a turn's warning).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 28, PER: 22 } },
  },
};

const ARES_RELICS: DeityRelicPair = {
  deityId: 'ares',
  weapon: {
    id: 'deity_ares_weapon',
    name: "Ares's Bloodsoaked Spear",
    lore: 'He did not win every battle. He enjoyed every battle.',
    tier: 'deity', slot: 'weapon', deityId: 'ares',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "You want MY weapon? You have to BLEED for it. Not die — bleed. In a single run reaching Floor 15: take damage in at least 80% of your combat rooms. I don't care if you win. I care that you fought hard enough to feel it every time. Come to me with wounds and I'll give you what wounds are for.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
        { metric: 'damage_taken_run', value: 1, targetType: 'eighty_percent_combat_rooms', description: 'Take at least 1 damage in 80% of all combat rooms entered this run' },
      ],
    },
    passiveId: 'ares_spear_passive',
    passiveDescription: "War God's Hunger: each point of damage you've taken this run adds +0.01% to your damage (max +30%). This resets per run. The more you bleed, the harder you hit.",
    weaponStats: { scalingStat: 'STR', finalDamage: 58, finalAccuracy: 85, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ares_accessory',
    name: "Ares's War Medallion",
    lore: 'It smells like a battlefield. Every battlefield.',
    tier: 'deity', slot: 'accessory', deityId: 'ares',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The medallion goes to the warrior who never stopped swinging. Kill 500 enemies total in your lifetime — all weapons, all methods. 500 kills. I don't care how. War is indiscriminate. So am I.",
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'kills_total', value: 500, description: 'Kill 500 enemies total lifetime' }],
    },
    passiveId: 'ares_medallion_passive',
    passiveDescription: "Bloodlust: after 5 kills in a single floor, enter a battle frenzy (+20% damage) for the rest of that floor. The frenzy stacks to +40% after 10 kills on a floor.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 30, END: 20 } },
  },
};

// =========================================
// NORSE DEITIES
// =========================================

const ODIN_RELICS: DeityRelicPair = {
  deityId: 'odin',
  weapon: {
    id: 'deity_odin_weapon',
    name: "The All-Father's Staff",
    lore: 'He hung from the World Tree for nine days for this knowledge. He is not giving you a shortcut.',
    tier: 'deity', slot: 'weapon', deityId: 'odin',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "I sacrificed my eye for wisdom. I hung from the World Tree for nine days for the runes. I gave everything. My weapon goes to those who demonstrate equivalent commitment to knowledge: Observe 200 enemies total across your lifetime. Not just once per type — 200 individual observations. Pay attention like sacrifice depends on it. Because it does.",
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'observe_total', value: 200, description: 'Use the Observe action 200 times total lifetime' }],
    },
    passiveId: 'odin_staff_passive',
    passiveDescription: "Runes of Power: after using Observe in a combat, the next 3 attacks ignore all enemy defense. Additionally, observing an enemy adds its weakness to a permanent mental library — enemies in your library take +8% damage.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 52, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_odin_accessory',
    name: "Hugin and Munin's Feather",
    lore: "Memory and Thought, bound in one feather. Odin sends them out every morning and fears their return.",
    tier: 'deity', slot: 'accessory', deityId: 'odin',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "Hugin is Thought. Munin is Memory. To earn this feather, you must demonstrate both: complete the Denatus at Level 10 AND have at least 50 enemy types permanently recorded in the monster knowledge system. Thought without memory is noise. Memory without thought is just a list. Bring me both.",
    acquisition: {
      scope: 'single_character', requireAll: true,
      requirements: [
        { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon' },
        { metric: 'observe_total', value: 50, targetType: 'unique_enemy_types', description: '50 different enemy types observed and recorded' },
      ],
    },
    passiveId: 'odin_feather_passive',
    passiveDescription: "Ravens' Gift: once per floor, Hugin or Munin circles the area — randomly reveals either the floor map one room ahead (Thought) or marks 3 enemies with permanent weaknesses (Memory). You cannot choose which.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 25, PER: 25 } },
  },
};

const THOR_RELICS: DeityRelicPair = {
  deityId: 'thor',
  weapon: {
    id: 'deity_thor_weapon',
    name: 'Mjolnir',
    lore: 'The dwarves made it with a shortened handle. Thor uses it anyway.',
    tier: 'deity', slot: 'weapon', deityId: 'thor',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "Mjolnir can only be lifted by those worthy. You've proven your character at maximum favor — but Mjolnir tests something else: sheer physical commitment. Kill 100 enemies with END-scaling weapons (shields, flails, halberds) in a single run, reaching Floor 15. Not cleverness. Not tricks. Pure bludgeoning strength. Show me you can do what I do.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'kills_with_stat', value: 100, targetType: 'END', description: 'Kill 100 enemies with END-scaling weapons in one run' },
        { metric: 'floors_reached', value: 15, description: 'Reach Floor 15 in that run' },
      ],
    },
    passiveId: 'mjolnir_passive',
    passiveDescription: "Worthy: Mjolnir returns to your hand on each attack (never misses). When used with END weapons, deals bonus damage equal to 5% of your max HP as flat damage per hit. Thunder: 20% chance to stun on any hit.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'STR', finalDamage: 55, finalAccuracy: 110, finalCritChance: 0.25, range: 'melee', damageType: 'physical', neverMisses: true },
  },
  accessory: {
    id: 'deity_thor_accessory',
    name: "Thor's Iron Gauntlet",
    lore: "He needs the gauntlet to hold Mjolnir. You need it for something else entirely.",
    tier: 'deity', slot: 'accessory', deityId: 'thor',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "My gauntlet goes to those who've been in a real fight. A REAL fight — not clever, not strategic. Take 1,000 damage in a single run and still win the run. Get hit. Get hit a lot. Win anyway. That is what the gauntlet is for.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'damage_taken_run', value: 1000, description: 'Take 1,000+ damage in one run' },
        { metric: 'boss_kills_run', value: 1, description: 'Still defeat at least one milestone boss in that run' },
      ],
    },
    passiveId: 'thor_gauntlet_passive',
    passiveDescription: "Thunder Resistance: +20% damage reduction. Also: each time you are hit for 50+ damage in a single blow, you immediately counterattack for 30% of that damage at no action cost.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 35, STR: 20 } },
  },
};

// =========================================
// EGYPTIAN DEITIES
// =========================================

const RA_RELICS: DeityRelicPair = {
  deityId: 'ra',
  weapon: {
    id: 'deity_ra_weapon',
    name: "Ra's Solar Disc",
    lore: 'The sun that crossed the underworld every night and came back. This is what carried it.',
    tier: 'deity', slot: 'weapon', deityId: 'ra',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The Solar Disc goes to those who rise again. Ra crosses the underworld each night and returns each dawn. Prove you understand this cycle: die and resurrect (begin a new character) and immediately, on that new character's FIRST run, reach Floor 10 without being hit by a single status effect. Rise clean. The sun does not come back tarnished.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'floors_reached', value: 10, description: 'On your very first run with a new character after the previous one died' },
        { metric: 'status_received_survived', value: 0, description: 'Zero status effects received on you the entire run (the dawn run must be clean)' },
      ],
    },
    passiveId: 'ra_disc_passive',
    passiveDescription: "Solar Cycle: damage increases progressively through the run — +2% per floor descended (max +40% at Floor 20). Resets when you leave the dungeon. The solar arc is measured in descent.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 100, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_ra_accessory',
    name: "Eye of Ra's Blessing",
    lore: 'Ra sent his Eye to punish humanity. He called it back before it finished. This is what remains.',
    tier: 'deity', slot: 'accessory', deityId: 'ra',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "My Eye sees everything lit and everything hidden. To earn its blessing: complete 5 floors in a row where every combat room was entered and cleared, AND you observed every single enemy before fighting them. The Eye rewards thorough illumination. It despises combat in the dark.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'observe_total', value: 1, targetType: 'five_floors_all_observed', description: '5 consecutive floors: every combat room cleared AND every enemy observed first' },
      ],
    },
    passiveId: 'ra_eye_passive',
    passiveDescription: "Blazing Vision: enemies you have Observed this run are permanently highlighted — they deal -15% damage to you. Also: critical hits against observed enemies burn for 3 turns (auto-applied, no action cost).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 25, WIS: 22, PER: 15 } },
  },
};

const ANUBIS_RELICS: DeityRelicPair = {
  deityId: 'anubis',
  weapon: {
    id: 'deity_anubis_weapon',
    name: "Anubis's Judgment Crook",
    lore: 'The shepherd of the dead. You are not dead. That is the only reason you can touch this.',
    tier: 'deity', slot: 'weapon', deityId: 'anubis',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "I judge the dead. You have not been judged yet. To earn my Crook: stand in my court — fight a milestone boss with your HP below 20% when the fight begins, using zero healing consumables, and win. Come to me already dying and walk away alive. That is the only soul I respect: one that should be mine but refuses to be.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 1, description: 'Defeat any milestone boss' },
        { metric: 'consecutive_fights', value: 1, targetType: 'below_20hp_at_boss_start', description: 'Enter the boss fight with HP below 20%' },
        { metric: 'floor_noconsumable', value: 1, targetType: 'no_heal_items_boss_fight', description: 'Zero healing consumables used during the boss fight' },
      ],
    },
    passiveId: 'anubis_crook_passive',
    passiveDescription: "Death's Shepherd: this weapon deals +30% damage when your HP is below 30%. The Judgment: once per combat, deal the killing blow for guaranteed double damage if the enemy is below 10% HP (the Crook decides who has been judged).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'STR', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_anubis_accessory',
    name: "Scales of Ma'at (Anubis's Version)",
    lore: 'He holds the scales for Ma\'at. His version is heavier.',
    tier: 'deity', slot: 'accessory', deityId: 'anubis',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The scales weigh truth. To earn them: complete an entire run where every fight you killed the enemy — no fleeing, no bypassing, no surrender. Complete judgment. But also: you must have used the Observe action at least once before each boss fight. I weigh thoroughness as well as decisiveness.",
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'floor_noretreat', value: 1, description: 'Zero retreats or bypasses the entire run' },
        { metric: 'observe_total', value: 1, targetType: 'all_bosses_observed', description: 'Observed every boss before each fight' },
        { metric: 'boss_kills_run', value: 3, description: 'Defeated at least 3 milestone bosses in this run' },
      ],
    },
    passiveId: 'anubis_scales_passive',
    passiveDescription: "Perfect Judgment: when your record this run is clean (no retreats, every combat cleared): +15% all damage. If additionally you have observed every enemy in the last 3 rooms: +10% more. The scales tip based on your history.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 25, END: 20 } },
  },
};

// =========================================
// ARS GOETIA DEITY EXAMPLES
// =========================================

const ASTAROTH_RELIC_EXAMPLE: DeityRelicPair = {
  deityId: 'astaroth',
  weapon: {
    id: 'deity_astaroth_weapon',
    name: "Astaroth's Counting Fork",
    lore: "He has counted every sin. He uses this to keep track.",
    tier: 'deity', slot: 'weapon', deityId: 'astaroth',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "I count years and sins. My Fork goes to those who have accumulated enough of both. Kill exactly 666 enemies total lifetime — not 665, not 667. When that counter reaches 666, the Fork will be waiting on the next monster's body. I have been waiting to give this to someone for a very long time. Do not make me wait much longer.",
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'kills_total', value: 666, targetType: 'exact_count', description: 'Kill exactly 666 enemies total lifetime (the Fork appears when the counter hits 666 precisely)' }],
    },
    passiveId: 'astaroth_fork_passive',
    passiveDescription: "The Count: this weapon's damage increases by 1 for each enemy killed with it (lifetime, permanent). At 66 kills: +15% crit chance added. The counting never stops.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'CHA', finalDamage: 45, finalAccuracy: 88, finalCritChance: 0.30, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_astaroth_accessory',
    name: "Astaroth's Treasury Key",
    lore: "This opens exactly one door. No one agrees which door that is.",
    tier: 'deity', slot: 'accessory', deityId: 'astaroth',
    revealFavorRequired: 100, isSecret: true,
    acquisitionHint: '',
    deityRevealText: "The Key opens what has been closed. To earn it: accumulate 100,000 gold total across all your characters. When that threshold is crossed, the Key materializes. Astaroth guards infinite treasure — to borrow from his collection, you must prove you understand the value of what you are asking for.",
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'gold_accumulated', value: 100000, description: 'Accumulate 100,000 total gold across all characters lifetime' }],
    },
    passiveId: 'astaroth_key_passive',
    passiveDescription: "Treasury Key: once per dungeon run, unlock a 'treasury room' — a hidden room containing 3 items of guaranteed rare+ quality. The room appears after entering the first combat room of any floor.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { LCK: 30, INT: 22 } },
  },
};

// =========================================
// ALL DEITY RELICS — Complete Collection
// =========================================

import { GREEK_DEITY_RELICS } from './deityRelics_greek';
import { NORSE_DEITY_RELICS } from './deityRelics_norse';
import { EGYPTIAN_DEITY_RELICS } from './deityRelics_egyptian';
import { EAST_ASIAN_DEITY_RELICS } from './deityRelics_eastAsian';
import { WESTERN_DEITY_RELICS } from './deityRelics_western';
import { SOUTH_DEITY_RELICS } from './deityRelics_south';
import { DARK_DEITY_RELICS } from './deityRelics_dark';
import { GREEK_REMAINING_RELICS } from './deityRelics_greek_remaining';
import { EGYPTIAN_REMAINING_RELICS } from './deityRelics_egyptian_remaining';
import { JAPANESE_REMAINING_RELICS } from './deityRelics_japanese_remaining';
import { CELTIC_REMAINING_RELICS } from './deityRelics_celtic_remaining';
import { MESOPOTAMIAN_REMAINING_RELICS } from './deityRelics_mesopotamian_remaining';
import { HINDU_REMAINING_RELICS } from './deityRelics_hindu_remaining';
import { SLAVIC_REMAINING_RELICS } from './deityRelics_slavic_remaining';
import { AZTEC_REMAINING_RELICS } from './deityRelics_aztec_remaining';
import { GOETIA_REMAINING_RELICS } from './deityRelics_goetia_remaining';
import { FALLEN_REMAINING_RELICS } from './deityRelics_fallen_remaining';

export const ALL_DEITY_RELICS: DeityRelicPair[] = [
  // Milestone Bosses (Slavic-adjacent)
  VANYA_RELICS, SORATH_RELICS, KUTCHER_RELICS, KALINDI_RELICS, MALIK_RELICS,
  // Greek (zeus, athena, ares here; rest in deityRelics_greek)
  ZEUS_RELICS, ATHENA_RELICS, ARES_RELICS,
  ...GREEK_DEITY_RELICS,
  ...GREEK_REMAINING_RELICS,
  // Norse (odin, thor here; rest in deityRelics_norse)
  ODIN_RELICS, THOR_RELICS,
  ...NORSE_DEITY_RELICS,
  // Egyptian (ra, anubis here; rest in deityRelics_egyptian)
  RA_RELICS, ANUBIS_RELICS,
  ...EGYPTIAN_DEITY_RELICS,
  ...EGYPTIAN_REMAINING_RELICS,
  // East Asian (Japanese + Chinese; remaining Japanese in deityRelics_japanese_remaining)
  ...EAST_ASIAN_DEITY_RELICS,
  ...JAPANESE_REMAINING_RELICS,
  // Western (Celtic + Mesopotamian; remaining in separate files)
  ...WESTERN_DEITY_RELICS,
  ...CELTIC_REMAINING_RELICS,
  ...MESOPOTAMIAN_REMAINING_RELICS,
  // South (Hindu + Slavic non-boss + Aztec; remaining in separate files)
  ...SOUTH_DEITY_RELICS,
  ...HINDU_REMAINING_RELICS,
  ...SLAVIC_REMAINING_RELICS,
  ...AZTEC_REMAINING_RELICS,
  // Dark (Ars Goetia + Fallen Angels; astaroth here; remaining in separate files)
  ASTAROTH_RELIC_EXAMPLE,
  ...DARK_DEITY_RELICS,
  ...GOETIA_REMAINING_RELICS,
  ...FALLEN_REMAINING_RELICS,
];

export function getDeityRelics(deityId: string): DeityRelicPair | undefined {
  return ALL_DEITY_RELICS.find(r => r.deityId === deityId);
}

export function getDeityRelic_weapon(deityId: string): SacredItem | undefined {
  return getDeityRelics(deityId)?.weapon;
}

export function getDeityRelic_accessory(deityId: string): SacredItem | undefined {
  return getDeityRelics(deityId)?.accessory;
}

/** Total number of deity relics designed (each has weapon + accessory = 2) */
export const DEITY_RELICS_DESIGNED = ALL_DEITY_RELICS.length;
export const DEITY_RELICS_TOTAL_ITEMS = ALL_DEITY_RELICS.length * 2;
