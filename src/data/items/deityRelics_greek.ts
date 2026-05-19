/**
 * Greek Deity Relics — all Olympians and major deities.
 */

import type { DeityRelicPair } from './deityRelics';

// Already implemented in deityRelics.ts: zeus, athena, ares

const HADES_RELICS: DeityRelicPair = {
  deityId: 'hades',
  weapon: {
    id: 'deity_hades_weapon', name: "Bident of the Underworld",
    lore: "He rules what cannot be undone. This weapon remembers every soul it has touched.",
    tier: 'deity', slot: 'weapon', deityId: 'hades',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My kingdom is permanent. Every soul that crosses my threshold stays. To prove you understand permanence: defeat me — the dungeon's final boss — five separate times, on five separate characters. Not the same run. Not the same life. Five different adventurers who each reached the deepest floor. Only then does my weapon believe you have earned it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 5, targetType: 'different_characters_floor25', description: 'Defeat the Floor 25 boss (Malik) on 5 different characters total lifetime' },
    ]},
    passiveId: 'hades_bident_passive',
    passiveDescription: "Death's Permanence: enemies killed by this weapon cannot be resurrected by other enemies or boss mechanics. Also: +15% damage to enemies below 50% HP — the dying are already crossing the threshold.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_hades_accessory', name: "Helm of Hades",
    lore: "He wore this to walk among mortals unseen. They never knew he was there.",
    tier: 'deity', slot: 'accessory', deityId: 'hades',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Invisibility is not hiding. It is existing without announcement. My Helm goes to those who prove they act without being seen first: defeat 10 elite enemies lifetime where you were the one to enter the room and initiate combat — not them spotting you. Walk into danger on purpose, without warning.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 10, targetType: 'player_initiates_elite', description: 'Engage 10 elite enemies by entering their room first, lifetime' },
    ]},
    passiveId: 'hades_helm_passive',
    passiveDescription: "Unseen King: enemies do not know your HP total — displayed enemy HP percentages reflect your apparent threat, not actual. Once per combat: phase out of visibility for 1 turn (enemies cannot target you).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 25, WIS: 22 } },
  },
};

const POSEIDON_RELICS: DeityRelicPair = {
  deityId: 'poseidon',
  weapon: {
    id: 'deity_poseidon_weapon', name: "Trident of the Unending Deep",
    lore: "The trident struck the earth and created the sea. It strikes enemies and creates endings.",
    tier: 'deity', slot: 'weapon', deityId: 'poseidon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The sea retreats before it crashes. I gave you the Tide's Eye domain artifact as your hint. Now prove you understand the full lesson: in a single run, flee from 15 different combats — and then return to win every floor you fled from. Retreat is not defeat. Return is everything.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 15, description: 'Flee from 15 combats in one run' },
      { metric: 'boss_kills_run', value: 3, description: 'Still defeat at least 3 milestone bosses in that run' },
    ]},
    passiveId: 'poseidon_trident_passive',
    passiveDescription: "Tidal Force: every time you flee and return to fight, your next combat deals +20% damage for the entire fight. Stacks up to +60% across 3 tactical retreats per run.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_poseidon_accessory', name: "Coral Crown of the Deep",
    lore: "It grew in total darkness at the bottom of what cannot be fathomed.",
    tier: 'deity', slot: 'accessory', deityId: 'poseidon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The ocean floor has never seen sunlight. To earn the Crown: complete a full run reaching Floor 20 where you NEVER used the Observe action — not once. Fight blind. Trust your strength over preparation. The deep doesn't care what you see. It cares how deep you can go.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'observe_total', value: 0, description: 'Zero Observe uses the entire run' },
    ]},
    passiveId: 'poseidon_crown_passive',
    passiveDescription: "Pressure of the Deep: +5% damage for each floor descended below Floor 5 (max +50% at Floor 15). The deeper you go, the more the weight presses down in your favor.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 22, STR: 20, AGI: 15 } },
  },
};

const APOLLO_RELICS: DeityRelicPair = {
  deityId: 'apollo',
  weapon: {
    id: 'deity_apollo_weapon', name: "Apollo's Silver Longbow",
    lore: "The sun's arrow travels in a straight line. There is no such thing as a near miss.",
    tier: 'deity', slot: 'weapon', deityId: 'apollo',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the god of truth and light. My bow does not lie. To earn it: complete a single run to Floor 20 without a single missed attack. Every swing, every skill that can miss — must connect. If any attack misses, the run is forfeit. The sun does not 'almost' rise.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'custom', value: 0, targetType: 'zero_missed_attacks_entire_run', description: 'Zero missed attacks the entire run' },
    ]},
    passiveId: 'apollo_bow_passive',
    passiveDescription: "Perfect Truth: this weapon never misses. Accuracy is treated as 100% regardless of enemy evasion. Critical hit chance +10% when your current HP is above 75%.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 110, finalCritChance: 0.30, range: 'ranged', damageType: 'holy', neverMisses: true },
  },
  accessory: {
    id: 'deity_apollo_accessory', name: "Laurel Crown of Delphi",
    lore: "The Oracle wore laurel. So did victors. They understood something similar.",
    tier: 'deity', slot: 'accessory', deityId: 'apollo',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Prophecy is the art of waiting for what you already know. Earn my crown by proving you understand patience: in 5 different combats across your lifetime, use the Observe action on the first turn without attacking, let the enemy act, then kill them without taking damage afterward. Patience before the strike. That is the Oracle's way.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 5, targetType: 'observe_turn1_then_nodamage_win', description: 'Observe on turn 1, let enemy act, then win without taking damage — 5 times lifetime' },
    ]},
    passiveId: 'apollo_laurel_passive',
    passiveDescription: "Oracle's Foreknowledge: the first time you enter combat with any enemy type you have observed before, you know its next 2 actions in advance (shown in combat log before they happen).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { PER: 28, WIS: 20, INT: 15 } },
  },
};

const ARTEMIS_RELICS: DeityRelicPair = {
  deityId: 'artemis',
  weapon: {
    id: 'deity_artemis_weapon', name: "Artemis's Hunting Bow",
    lore: "She never misses prey she has hunted before. This weapon holds that memory.",
    tier: 'deity', slot: 'weapon', deityId: 'artemis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My hunt ends before the prey knows it has begun. To earn this bow: in a single run, kill 50 enemies total without ever taking damage in any single combat. Every fight must be perfect — no wounds, no compromise. If you take even 1 damage in any fight, start counting again. The hunt is pristine or it is nothing.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 50, targetType: 'zero_damage_taken_per_fight', description: '50 fights in one run with zero damage taken in each individual fight' },
    ]},
    passiveId: 'artemis_bow_passive',
    passiveDescription: "Perfect Hunt: on the first attack of any combat, if you have not been damaged in the last 3 fights, +50% damage and guaranteed critical hit. The bow rewards clean streaks.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 48, finalAccuracy: 105, finalCritChance: 0.35, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_artemis_accessory', name: "Moon Phase Pendant",
    lore: "She changes and remains. The moon does not apologize for either state.",
    tier: 'deity', slot: 'accessory', deityId: 'artemis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The moon rules night, and night rules the hunt. My pendant goes to those who hunt selectively: complete a run to Floor 10 where you only entered ELITE rooms for combat — no normal combat rooms at all. Only marked prey. Skip every ordinary fight. Show me you choose your quarry, not the other way around.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 1, targetType: 'only_elite_combat_rooms_engaged', description: 'Only fought in elite rooms — zero normal combat rooms entered and fought in' },
    ]},
    passiveId: 'artemis_moon_passive',
    passiveDescription: "Selective Hunter: +40% damage and +20% critical chance against elite enemies. Against normal enemies, you deal standard damage — the pendant only empowers worthy prey.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 25, PER: 22 } },
  },
};

const HEPHAESTUS_RELICS: DeityRelicPair = {
  deityId: 'hephaestus',
  weapon: {
    id: 'deity_hephaestus_weapon', name: "The God-Forged Warhammer",
    lore: "He forged the weapons of Olympus. He made something better for himself.",
    tier: 'deity', slot: 'weapon', deityId: 'hephaestus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I make weapons for gods. You want one? Then act like a craftsman. Upgrade 3 different weapons to Legendary quality at my Blacksmith — not the same weapon three times. Three different weapons, three times reaching perfection. Show me you understand variety in craft. I'll know when the third one is done.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_legendary', value: 3, targetType: 'three_different_weapons', description: 'Upgrade 3 different weapons to Legendary quality lifetime' },
    ]},
    passiveId: 'hephaestus_hammer_passive',
    passiveDescription: "Masterwork: each time you successfully upgrade a weapon at the Blacksmith while equipping this, the upgraded weapon permanently gains +5 bonus damage on top of the upgrade. The God-Forged hammer teaches what it touches.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 58, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_hephaestus_accessory', name: "Smith's Signet Ring",
    lore: "He was thrown from Olympus twice. He built his forge underground and called it a promotion.",
    tier: 'deity', slot: 'accessory', deityId: 'hephaestus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My ring goes to those who invest in craft. Spend 30,000 gold total at the Blacksmith — upgrades, repairs, identification, all of it. Every coin you pour into my forge goes toward what you are asking for. I respect dedicated investment. I don't respect tourists.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_spent_blacksmith', value: 30000, description: 'Spend 30,000 total gold at the Blacksmith lifetime' },
    ]},
    passiveId: 'hephaestus_ring_passive',
    passiveDescription: "Master Smith's Mark: all Blacksmith upgrade costs reduced by 25%. Weapon quality improvements take effect immediately without needing an equip/unequip cycle. Masterwork and Legendary weapons repaired for free.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 22, END: 20 } },
  },
};

const HERMES_RELICS: DeityRelicPair = {
  deityId: 'hermes',
  weapon: {
    id: 'deity_hermes_weapon', name: "The Caduceus",
    lore: "He carries messages between worlds with it. It is also, technically, a weapon.",
    tier: 'deity', slot: 'weapon', deityId: 'hermes',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Speed is my domain. Not brute speed — the speed of someone who was never where you're looking. My Caduceus goes to those who never fail a flee attempt: successfully flee 50 times lifetime, and never once have a flee attempt fail. Every escape must be clean. I don't carry messages that don't arrive.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'flee_total', value: 50, description: '50 successful flee attempts lifetime' },
      { metric: 'custom', value: 0, targetType: 'zero_failed_flee_attempts_lifetime', description: 'Zero failed flee attempts ever' },
    ]},
    passiveId: 'hermes_caduceus_passive',
    passiveDescription: "Swift Messenger: flee attempts always succeed. Once per combat, the first turn can be used to flee without spending an action (free instant escape). Enemies cannot pursue you between floors.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'CHA', finalDamage: 42, finalAccuracy: 98, finalCritChance: 0.32, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_hermes_accessory', name: "Winged Talaria",
    lore: "He delivered messages between gods at the speed of thought. This helped.",
    tier: 'deity', slot: 'accessory', deityId: 'hermes',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Time is the only thing I value. Prove yours is worth my endorsement: complete a run from Floor 1 to reaching Malik (Floor 25) in which you never spent more than 2 turns in any single combat — kill or flee within 2 turns, every fight. Speed of thought. Speed of action. That is Hermes.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25' },
      { metric: 'custom', value: 1, targetType: 'all_combats_resolved_within_2_turns', description: 'Every combat ended (kill or flee) within 2 turns — no fight lasted 3+ turns' },
    ]},
    passiveId: 'hermes_talaria_passive',
    passiveDescription: "Speed of Hermes: initiative always goes to you first in any combat. Additionally: if you kill an enemy on turn 1 or turn 2, gain +10 SP (messenger's bonus for efficiency).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { AGI: 30, PER: 20 } },
  },
};

const DIONYSUS_RELICS: DeityRelicPair = {
  deityId: 'dionysus',
  weapon: {
    id: 'deity_dionysus_weapon', name: "Thyrsus of Divine Madness",
    lore: "It is a fennel stalk with a pine cone. It has driven armies mad. Proportion is irrelevant.",
    tier: 'deity', slot: 'weapon', deityId: 'dionysus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Madness is when the rules stop applying. My Thyrsus is for those who prove they can function inside chaos: in a single combat, have 4 or more different status effects active on yourself simultaneously and still win the fight. Don't remove them. Embrace them. Win through them. The vine grows around the obstacle, not away from it.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 4, targetType: 'four_simultaneous_different_types', description: 'Have 4+ different status effect types on yourself at once in one combat AND win' },
    ]},
    passiveId: 'dionysus_thyrsus_passive',
    passiveDescription: "Divine Frenzy: every negative status effect on you converts its debuff into a random offensive bonus (+10-20% damage, +5% crit, +10% speed, etc.). The worse you're afflicted, the more dangerous you become.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 44, finalAccuracy: 88, finalCritChance: 0.30, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_dionysus_accessory', name: "Wine God's Mask",
    lore: "He wore masks to hide in plain sight at his own parties. No one ever recognized him.",
    tier: 'deity', slot: 'accessory', deityId: 'dionysus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Mystery is my weapon. To earn the Mask: complete 40 mystery rooms total across your lifetime. Open every door you cannot see through. Fortune favors the reckless drinker who doesn't read the label. I'll be watching for you in the mystery rooms — look for me there.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 40, description: 'Complete 40 mystery rooms lifetime' },
    ]},
    passiveId: 'dionysus_mask_passive',
    passiveDescription: "Mystery Revelry: mystery room rewards are upgraded by one tier (normal→rare, rare→epic). Also: once per run, a mystery room contains Dionysus's personal cache — guaranteed high-quality consumable and 100-300G.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, CHA: 20 } },
  },
};

const DEMETER_RELICS: DeityRelicPair = {
  deityId: 'demeter',
  weapon: {
    id: 'deity_demeter_weapon', name: "Harvest Sickle of Demeter",
    lore: "She invented agriculture. She also invented the concept of the bad harvest, as a threat.",
    tier: 'deity', slot: 'weapon', deityId: 'demeter',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Life feeds on life. My sickle goes to those who understand the cycle of sustenance: use 100 healing items (consumables, rest sites, any healing source) total across your lifetime. You cannot sustain a harvest without tending to what sustains you. Feed yourself first. Then others.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 100, description: 'Use 100 healing items/sources total lifetime' },
    ]},
    passiveId: 'demeter_sickle_passive',
    passiveDescription: "Cycle of Life: every healing action you take also stores 5% of the healed amount as bonus damage for your next attack (harvest stores energy). Maximum 50% bonus damage stored at once.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_demeter_accessory', name: "Grain Crown of Plenty",
    lore: "When she is pleased, harvests are good. When she is not, they are very educational.",
    tier: 'deity', slot: 'accessory', deityId: 'demeter',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Patience is a harvest virtue. My crown goes to those who understand endurance: complete 15 separate dungeon runs reaching Floor 5 or beyond, with no character deaths on those specific runs. Each run is a season. Survive 15 seasons clean. Then come to me.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 15, targetType: 'full_runs_floor5_no_death', description: '15 separate runs reaching Floor 5+ without dying, lifetime' },
    ]},
    passiveId: 'demeter_crown_passive',
    passiveDescription: "Abundance: rest sites restore +50% HP/SP when you use them. Also: consumable items used in the dungeon have a 20% chance to not be consumed (restored to inventory after use).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 25, WIS: 20 } },
  },
};

const HECATE_RELICS: DeityRelicPair = {
  deityId: 'hecate',
  weapon: {
    id: 'deity_hecate_weapon', name: "Staff of Three Crossroads",
    lore: "Three forms, three powers, one direction. The choice of path is the power.",
    tier: 'deity', slot: 'weapon', deityId: 'hecate',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I stand at the crossroads of three powers. To earn my Staff: in a single run reaching Floor 15, use at least 100 skills of each type — physical skills, magic skills, and support skills (100 of each, 300 total). Walk all three roads. Those who choose only one path are not worthy of the crossroads.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 100, targetType: 'physical_skills', description: 'Use 100 physical-type skills in one run' },
      { metric: 'skill_uses', value: 100, targetType: 'magic_skills', description: 'Use 100 magic-type skills in one run' },
      { metric: 'skill_uses', value: 100, targetType: 'support_skills', description: 'Use 100 support-type skills in one run' },
    ]},
    passiveId: 'hecate_staff_passive',
    passiveDescription: "Triple Goddess: using 3 different skill types in a single combat grants a 1-turn immunity phase (untouchable) after the third skill. The crossroads grants brief invulnerability to those who walk all paths.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_hecate_accessory', name: "Lunar Phase Ring",
    lore: "She knows when to use light and when the dark serves better. Same answer either way: her.",
    tier: 'deity', slot: 'accessory', deityId: 'hecate',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Crossroads magic works without light. To earn this ring: complete a full run to Floor 10 using ONLY magic skills — not a single physical skill, not a single basic attack. Only spells. Those who see in the dark don't need the torch they've been holding.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'skill_uses', value: 0, targetType: 'zero_physical_or_basic_attacks', description: 'Zero basic attacks and zero physical skills used the entire run' },
    ]},
    passiveId: 'hecate_ring_passive',
    passiveDescription: "Crossroads Power: when you cast 3 or more spells in a single combat, the fourth spell this combat costs 0 SP. Magic at the crossroads flows freely.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { INT: 30, WIS: 22 } },
  },
};

const HERA_RELICS: DeityRelicPair = {
  deityId: 'hera',
  weapon: {
    id: 'deity_hera_weapon', name: "Scepter of Olympus",
    lore: "She does not wield it in combat. She wields it to make combat unnecessary.",
    tier: 'deity', slot: 'weapon', deityId: 'hera',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am Queen of Olympus. Authority is not taken — it is recognized. My Scepter goes to those who have proven themselves in the courts of my court: reach Favoured Child status (91+ favor) with 4 different deities across your lifetime. Not 4 from the same pantheon. Four different gods must recognize you. Then I will consider it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 4, description: 'Reach 91+ favor with 4 different deities lifetime' },
    ]},
    passiveId: 'hera_scepter_passive',
    passiveDescription: "Queen's Command: Taunt action now has a chance to completely end combat (enemy flees or surrenders) based on your CHA grade (D=5%, A=20%, SS=40%). Cannot work on bosses or elites.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 42, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_hera_accessory', name: "Peacock Eye Brooch",
    lore: "Hundred eyes on a peacock tail. She put them there when Argus failed her. A lesson in what surveillance looks like.",
    tier: 'deity', slot: 'accessory', deityId: 'hera',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My Brooch records everything. To earn it: use the Taunt action 15 times without any of those taunts failing, in a single run. Every challenge must land. I do not accept partial authority. You taunt, they respond to it — all 15. Then we can discuss whether you merit my jewels.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 15, targetType: 'all_successful', description: '15 successful Taunt uses in one run, none failing' },
    ]},
    passiveId: 'hera_brooch_passive',
    passiveDescription: "Divine Surveillance: after using Taunt successfully, the enemy's next special ability is revealed to you before they use it (1-turn preview). Also: enemies who have been taunted deal -15% damage for the rest of the combat.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { CHA: 28, WIS: 20 } },
  },
};

const APHRODITE_RELICS: DeityRelicPair = {
  deityId: 'aphrodite',
  weapon: {
    id: 'deity_aphrodite_weapon', name: "Arrow of Divine Desire",
    lore: "It doesn't aim at the body. It aims at the reason someone fights.",
    tier: 'deity', slot: 'weapon', deityId: 'aphrodite',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My power is in making others want what I want them to want. To earn my Arrow: use the Taunt action 100 times total lifetime, and have it succeed at least 85 of those times. Charm is not forced. It is consistent. I do not miss what I aim for. Neither should you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 100, description: 'Use Taunt 100 times lifetime' },
      { metric: 'taunt_total', value: 85, targetType: 'successful', description: 'At least 85 of those Taunts succeed' },
    ]},
    passiveId: 'aphrodite_arrow_passive',
    passiveDescription: "Irresistible: enemies who have been Taunted at least once this combat have a 25% chance to attack an ally instead of you on their turn (if any allies/other enemies present). Also: Taunt now reduces enemy damage by 30% instead of 20%.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 42, finalAccuracy: 95, finalCritChance: 0.30, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_aphrodite_accessory', name: "Aphrodite's Mirror",
    lore: "She uses it to look at herself. It also shows what others most want to see.",
    tier: 'deity', slot: 'accessory', deityId: 'aphrodite',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Beauty is most powerful when it is what they cannot resist reaching for. To earn my Mirror: complete a run to Floor 15 with a character whose primary highest stat is CHA — charm above all else. Not a CHA build that also has STR. CHA must be your singular highest stat. Then come to me.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'stats_grade', value: 1, targetType: 'CHA_highest_stat', description: 'CHA must be the highest grade stat on the character' },
    ]},
    passiveId: 'aphrodite_mirror_passive',
    passiveDescription: "Reflection of Desire: enemies that target you have a 15% chance per turn to become 'enamored' — they waste their turn (confused, not attacking). CHA checks in all contexts have +15% success rate.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 32, LCK: 18 } },
  },
};

const TYCHE_RELICS: DeityRelicPair = {
  deityId: 'tyche',
  weapon: {
    id: 'deity_tyche_weapon', name: "Fortune's Fickle Blade",
    lore: "She gives and takes. The blade is a reminder that those actions are not opposites.",
    tier: 'deity', slot: 'weapon', deityId: 'tyche',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fortune is not a gift I give — it is a state I recognize. To earn my blade: win 15 combats in a row without taking a single point of damage, in a single run. Perfect streak. Fortune rewards those who create conditions where luck is irrelevant. Make luck unnecessary, and I'll believe you deserve it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 15, targetType: 'zero_damage_taken_each', description: '15 consecutive fights with zero damage taken in each, in a single run' },
    ]},
    passiveId: 'tyche_blade_passive',
    passiveDescription: "Fortune's Edge: critical hit chance +5% for each consecutive fight won without taking damage (current streak, max +30%). The streak fuels the fortune. Break the streak, the bonus resets.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'AGI', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.38, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_tyche_accessory', name: "Tyche's Lucky Coin",
    lore: "She flips it. She never looks at how it lands. She already knows.",
    tier: 'deity', slot: 'accessory', deityId: 'tyche',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Luck belongs to those who collect it. My Coin goes to those with an LCK stat at grade B or higher — and who have also reached a character level of 5. You cannot rush luck. You build it. Level 5 with strong LCK means you understand both patience and the value of chance. Then we talk.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'stats_grade', value: 1, targetType: 'LCK_grade_B_or_higher', description: 'LCK stat at grade B or above' },
    ]},
    passiveId: 'tyche_coin_passive',
    passiveDescription: "Lucky Token: once per run, when you would fail a critical hit roll, it succeeds instead (fortune's intervention). Also: gold dropped by enemies has a 10% chance to be doubled (fortune touches the coins).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 35, CHA: 15 } },
  },
};

const PERSEPHONE_RELICS: DeityRelicPair = {
  deityId: 'persephone',
  weapon: {
    id: 'deity_persephone_weapon', name: "Pomegranate Blade",
    lore: "Six seeds. Six months below. She chose to return. The blade remembers both halves.",
    tier: 'deity', slot: 'weapon', deityId: 'persephone',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I chose to return to the underworld. Not because I was forced — because I understood that the darkness was as much mine as the spring was. Prove you understand cycles: in a single run, bypass 2 bosses through dialogue AND then defeat at least 2 other bosses in combat. Both faces. Both choices. The blade belongs to one who walks between.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 2, description: 'Bypass 2 bosses through dialogue in one run' },
      { metric: 'boss_kills_run', value: 2, description: 'Also defeat 2 bosses in combat in that same run' },
    ]},
    passiveId: 'persephone_blade_passive',
    passiveDescription: "Between Worlds: after bypassing any boss, your next combat deals +40% damage (spring returning from winter). After defeating any boss, you regenerate 20% HP (rest between darkness and light).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_persephone_accessory', name: "Crown of Spring's Return",
    lore: "When she comes back, everything grows again. Even what should have stayed dead.",
    tier: 'deity', slot: 'accessory', deityId: 'persephone',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Spring only exists because winter does. My crown goes to those who have experienced the full cycle: play a character to death, then begin a new one — and on that new character's first run, reach Level 3. Not level 2. Level 3. Die, grieve, return, grow. That is the cycle. Do it once and the crown recognizes you.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'first_run_after_character_death', description: 'This character is your first character started after another character died' },
      { metric: 'level_reached', value: 3, description: 'Reach Level 3' },
    ]},
    passiveId: 'persephone_crown_passive',
    passiveDescription: "Cycle's Gift: when you resurrect or start a new run on this character, you begin with +20% max HP for the entire run (the spring bonus). This bonus stacks once per new run started.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 25, END: 20 } },
  },
};

const HESTIA_RELICS: DeityRelicPair = {
  deityId: 'hestia',
  weapon: {
    id: 'deity_hestia_weapon', name: "Hearthfire Lance",
    lore: "She never left Olympus. She stayed to tend the fire. The fire was the most important part.",
    tier: 'deity', slot: 'weapon', deityId: 'hestia',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The hearth requires constant tending. Not glory — consistency. My lance goes to those who rest: use 30 rest sites total across your lifetime. Not because you had to. Because tending yourself is as sacred as any battle. Come back to the hearth. It is always lit.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'rest_sites_used', value: 30, description: 'Use 30 rest sites total lifetime' },
    ]},
    passiveId: 'hestia_lance_passive',
    passiveDescription: "Sacred Flame: when used near a rest site (on the floor immediately after using a rest site), first attack of the combat deals +100% damage. The hearth's warmth carries into battle.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.22, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_hestia_accessory', name: "Eternal Hearth Votive",
    lore: "The flame does not seek glory. It simply does not go out.",
    tier: 'deity', slot: 'accessory', deityId: 'hestia',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Continuity is the highest virtue. The flame that never dies is the most powerful flame. Prove continuity: survive 20 full runs reaching Floor 10 without dying on any of those runs. Not 20 runs with some deaths mixed in — 20 clean survivals to Floor 10. The eternal flame is patient. So should you be.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 20, targetType: 'full_runs_reaching_floor10_no_death', description: '20 separate runs reaching Floor 10+ without dying, lifetime' },
    ]},
    passiveId: 'hestia_votive_passive',
    passiveDescription: "Eternal Flame: HP does not regen naturally, BUT instead of dying at 0 HP, once per run you survive at 1 HP (the hearth keeps the flame alive). Additionally: rest sites restore 100% HP/SP instead of the standard amount.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 28, WIS: 18 } },
  },
};

const PAN_RELICS: DeityRelicPair = {
  deityId: 'pan',
  weapon: {
    id: 'deity_pan_weapon', name: "Syrinx-Song Pipes (Bladed Form)",
    lore: "He chased a nymph. She became reeds. He played them into a weapon. Pan finds joy in everything.",
    tier: 'deity', slot: 'weapon', deityId: 'pan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I invented panic. Not fear — panic. The sudden, irrational, complete dissolution of control. My pipes go to those who can create that: cause enemies to flee (via Taunt or panic effects) 20 times total lifetime. I want to see that you understand what it means to make something abandon all reason.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 20, targetType: 'causes_enemy_flee', description: 'Make enemies flee 20 times lifetime through Taunt or fear effects' },
    ]},
    passiveId: 'pan_pipes_passive',
    passiveDescription: "Wild Panic: Taunt now has a 25% chance to cause the enemy to flee combat entirely (dropping loot). On boss and elite encounters, Taunt instead causes confusion — enemy attacks a random target for 2 turns.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 40, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_pan_accessory', name: "Wild God's Mask",
    lore: "Half goat. All deity. Pan has never understood why this surprises people.",
    tier: 'deity', slot: 'accessory', deityId: 'pan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The wild doesn't have a path. It IS the path. My mask goes to those who prove they don't follow the road: in a single run to Floor 10, explore every mystery room AND every event room available on each floor before taking any combat. Curiosity over aggression. That is the wild god's way.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 5, description: 'Visit 5 mystery rooms in one run' },
      { metric: 'event_success', value: 5, description: 'Complete 5 event rooms in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'pan_mask_passive',
    passiveDescription: "Wild Instinct: mystery and event room outcomes are always the best possible result (highest tier, most favorable outcome). The wild god's blessing guides randomness.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 22, LCK: 20, AGI: 15 } },
  },
};

const NIKE_RELICS: DeityRelicPair = {
  deityId: 'nike',
  weapon: {
    id: 'deity_nike_weapon', name: "Victory Laurel Blade",
    lore: "She crowns victors. She has been very busy.",
    tier: 'deity', slot: 'weapon', deityId: 'nike',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Victory is repetition. To earn my blade: kill 75 enemies in a row without dying, across any number of runs. The streak carries between runs on the same character. If you die, the count resets. If you stay alive across 75 kills on the same character, you have my endorsement.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 75, targetType: 'kills_no_death_streak', description: '75 consecutive enemy kills without dying on the same character' },
    ]},
    passiveId: 'nike_blade_passive',
    passiveDescription: "Victory Streak: +1% damage for each consecutive fight won this run (no dying). Streak resets if you die. At 20-fight streak: +5% additional flat damage bonus applied. At 50-fight: +10% more. Victory compounds.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 95, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_nike_accessory', name: "Victor's Wreath",
    lore: "It does not decay. It is the only laurel wreath in existence that doesn't.",
    tier: 'deity', slot: 'accessory', deityId: 'nike',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I crown the undefeated. To earn this wreath: complete a full run from Floor 1 to Floor 25 without losing a single combat. Zero deaths. Zero retreats. Every fight must be won. This is not about strength — it is about never accepting defeat as a viable outcome.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero retreats the entire run' },
      { metric: 'consecutive_fights', value: 1, targetType: 'full_run_no_deaths', description: 'Zero deaths the entire run' },
    ]},
    passiveId: 'nike_wreath_passive',
    passiveDescription: "Crowned Victor: after 10 consecutive fights without dying on the current run: +10% damage and +10% critical chance (permanent for that run, stacks up to 5 times at 10/20/30/40/50 fights).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 25, STR: 20 } },
  },
};

const NEMESIS_RELICS: DeityRelicPair = {
  deityId: 'nemesis',
  weapon: {
    id: 'deity_nemesis_weapon', name: "Blade of Retribution",
    lore: "She does not punish the wicked for fun. She punishes them to maintain the mathematics.",
    tier: 'deity', slot: 'weapon', deityId: 'nemesis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Retribution requires wrongdoing first. My blade goes to those who have been harmed and returned the favor: be inflicted with 5 or more status effects in a single run AND still defeat the boss who inflicted the last one. You suffered. You balanced the equation. That is divine retribution.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, description: 'Receive 5+ different status effects in one run' },
      { metric: 'boss_kills_run', value: 1, description: 'Still defeat at least one boss in that run' },
    ]},
    passiveId: 'nemesis_blade_passive',
    passiveDescription: "Retributive Justice: each time you take damage from a status effect, add that damage to a Retribution pool. When you attack, the pool discharges as bonus damage (1:1 ratio, up to +40 flat damage).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'STR', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_nemesis_accessory', name: "Scales of Balance",
    lore: "Nemesis's scales do not weigh good and evil. They weigh what was given and what was returned.",
    tier: 'deity', slot: 'accessory', deityId: 'nemesis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Perfect balance requires perfect records. My scales go to those who prove they can rise from disadvantage: start a character with 25 points invested in only 2 stats (minimum spread, maximum focus), reach Level 3. You were given less. You returned more. That is balance.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 3, description: 'Reach Level 3' },
      { metric: 'custom', value: 1, targetType: 'initial_stats_maxed_in_2_only', description: 'Character creation: put at least 24 of 30 stat points into only 2 stats' },
    ]},
    passiveId: 'nemesis_scales_passive',
    passiveDescription: "Balance Restored: enemies who have dealt more damage to you than you to them have their defense reduced by 20% (the scales tip in your favor). Enemies you are 'losing against' are paradoxically easier.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 25, PER: 20 } },
  },
};

const ASCLEPIUS_RELICS: DeityRelicPair = {
  deityId: 'asclepius',
  weapon: {
    id: 'deity_asclepius_weapon', name: "Serpent-Wound Staff",
    lore: "The serpent taught him medicine. He taught the serpent nothing, but it stayed anyway.",
    tier: 'deity', slot: 'weapon', deityId: 'asclepius',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was killed for learning how to defeat death. My staff goes to those who demonstrate that same knowledge: heal yourself from below 10% HP back to above 50% HP in a single combat, using only your own abilities — no consumables, no rest. The body wants to live. Show me you know how to let it.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'healing_received', value: 1, targetType: 'below_10_to_above_50_no_consumables', description: 'In one combat: be below 10% HP, then self-heal to above 50% HP without consumables' },
    ]},
    passiveId: 'asclepius_staff_passive',
    passiveDescription: "Healing Touch: this weapon heals you for 5% of damage dealt on every hit. When your HP is below 30%, the healing triples to 15%. The staff remembers its first purpose.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 42, finalAccuracy: 90, finalCritChance: 0.22, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_asclepius_accessory', name: "Medical Sash of Healing",
    lore: "He could cure anything. He specifically chose not to cure impatience.",
    tier: 'deity', slot: 'accessory', deityId: 'asclepius',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "True healing requires discipline. My sash goes to the self-sufficient: complete a run reaching Floor 10 where you used zero consumable items — no potions, no SP flasks, nothing. The body that has learned to heal itself does not need crutches. Then I will trust you with medicine.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'floor_noconsumable', value: 10, description: 'Use zero consumables all run' },
    ]},
    passiveId: 'asclepius_sash_passive',
    passiveDescription: "Self-Sufficient: regenerate 2% max HP at the start of every combat. After a combat where you did not use any consumables, regenerate an additional 5% HP. The body heals between fights.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 25, WIS: 22 } },
  },
};

const THANATOS_RELICS: DeityRelicPair = {
  deityId: 'thanatos',
  weapon: {
    id: 'deity_thanatos_weapon', name: "Peaceful Reaper's Scythe",
    lore: "Thanatos is not Hades. He does not rule death. He is death — the gentle kind.",
    tier: 'deity', slot: 'weapon', deityId: 'thanatos',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the peaceful death. The one that comes when you stop fighting. My scythe goes to those who understand accumulation over urgency: kill 1,000 enemies total across your lifetime. Not in one run. Not on one character. Across all of it. One thousand. When that count reaches 1,000, the scythe will be waiting.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 1000, description: 'Kill 1,000 enemies total lifetime' },
    ]},
    passiveId: 'thanatos_scythe_passive',
    passiveDescription: "Quiet Harvest: this weapon's damage increases by 1 permanently for every 25 enemies killed with it (total, across all runs). At 500 kills: gains 'Peaceful End' — enemies at 5% HP die immediately to this weapon's touch.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 48, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_thanatos_accessory', name: "Serene Burial Shroud",
    lore: "He wraps souls in this before guiding them. Wearing it while living is technically an error.",
    tier: 'deity', slot: 'accessory', deityId: 'thanatos',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Timing is everything in death. I do not come before the moment, and I do not come after it. My shroud goes to those who understand precise timing: die on exactly Floor 10 in 3 different runs — not Floor 9, not Floor 11. Floor 10, three times. Show me you can reach the right moment, at the right depth, consistently.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'die_exactly_on_floor_10_three_times', description: 'Die exactly on Floor 10 (not 9, not 11) in 3 different runs lifetime' },
    ]},
    passiveId: 'thanatos_shroud_passive',
    passiveDescription: "Gentle Passing: once per run, when you would die, instead drop to 1 HP and all enemies in the current combat flee. The peaceful death grants you a moment's reprieve — but only once.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 28, END: 22 } },
  },
};

// Minor Greek deities with concise but distinct conditions

const HELIOS_RELICS: DeityRelicPair = {
  deityId: 'helios',
  weapon: {
    id: 'deity_helios_weapon', name: "Solar Flare Blade",
    lore: "He drives the sun chariot. This is what he uses when the chariot isn't enough.",
    tier: 'deity', slot: 'weapon', deityId: 'helios',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I see everything from above. Every day, every run. My blade goes to those who are consistent: complete 15 dungeon runs lifetime — regardless of depth, regardless of outcome. Show me that you return to the Tower as reliably as I return to the sky.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 15, targetType: 'total_dungeon_runs_started', description: 'Start (and complete or die in) 15 dungeon runs lifetime' },
    ]},
    passiveId: 'helios_blade_passive',
    passiveDescription: "All-Seeing Light: enemies cannot hide or use stealth mechanics against you. Fire-type attacks deal +20% damage. Once per combat: solar flare hits all enemies for 30% weapon damage.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'STR', finalDamage: 48, finalAccuracy: 100, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_helios_accessory', name: "All-Seeing Eye Pendant",
    lore: "He watches everything from the sun. The pendant is a fragment of that attention.",
    tier: 'deity', slot: 'accessory', deityId: 'helios',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I see every creature in every tower. My pendant goes to the truly curious: observe every unique enemy type that exists in this Tower — complete the Bestiary. When every creature type has been observed and recorded, I will consider the pendant has found the right bearer.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'all_unique_enemy_types_observed', description: 'Observe every unique enemy type in the Bestiary (complete the monster knowledge book)' },
    ]},
    passiveId: 'helios_pendant_passive',
    passiveDescription: "Solar Vision: instantly know all enemy stats and abilities when entering combat with any observed enemy type. Critical hit chance +15% against enemies you have observed 3+ times total.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { PER: 30, INT: 20 } },
  },
};

const SELENE_RELICS: DeityRelicPair = {
  deityId: 'selene',
  weapon: {
    id: 'deity_selene_weapon', name: "Moonbeam Blade",
    lore: "She drives the moon chariot. The blade is cold, reflected, and more dangerous than it looks.",
    tier: 'deity', slot: 'weapon', deityId: 'selene',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The moon rules from a distance. My blade goes to those who understand distance in combat: complete a run to Floor 10 using only ranged weapons — not once using a melee weapon or melee skill. Stay above. Stay distant. The moon does not descend to the sea.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 1, targetType: 'ranged_only_run', description: 'Only ranged weapons and ranged skills used — zero melee attacks' },
    ]},
    passiveId: 'selene_blade_passive',
    passiveDescription: "Lunar Distance: +20% damage bonus when using ranged weapons. When the enemy is 'at distance' (not adjacent/close range), this bonus doubles to +40%. The moon always aims from afar.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 98, finalCritChance: 0.30, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_selene_accessory', name: "Silver Crescent Moon",
    lore: "She waxes and wanes and does not apologize for either.",
    tier: 'deity', slot: 'accessory', deityId: 'selene',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The moon changes every night and stays faithful to its cycle. My crescent goes to those who show the same faithfulness: complete 5 separate dungeon runs where you reached at least Floor 5 — spread across 5 different calendar days. One run per day, five days. That is the moon's schedule.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_runs_on_five_different_days_floor5', description: 'Complete 5 runs reaching Floor 5+ spread across 5 different calendar days lifetime' },
    ]},
    passiveId: 'selene_crescent_passive',
    passiveDescription: "Lunar Cycle: critical hit chance cycles — starts at base, increases +5% per floor (max +30% at Floor 6+), then resets when you rest. Like the moon, it rises and resets.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 22, WIS: 20, LCK: 15 } },
  },
};

const EROS_RELICS: DeityRelicPair = {
  deityId: 'eros',
  weapon: {
    id: 'deity_eros_weapon', name: "Lover's Arrow",
    lore: "It never misses. The problem is it sometimes hits the wrong person. This is considered a feature.",
    tier: 'deity', slot: 'weapon', deityId: 'eros',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My arrows aim at what the heart reaches for. To earn this arrow: use the Taunt action 150 times total lifetime. Not just any Taunt — I want to see that you understand attraction. Draw them in. Make them come to you. 150 times, you pull them toward the danger.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 150, description: 'Use Taunt 150 times lifetime' },
    ]},
    passiveId: 'eros_arrow_passive',
    passiveDescription: "Love's Mark: enemies hit by Taunt are 'marked' — for the rest of that combat, they have -20% chance to target anyone but you AND your critical hits against marked enemies deal +25% bonus damage. They cannot resist the pull.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 40, finalAccuracy: 110, finalCritChance: 0.32, range: 'ranged', damageType: 'physical', neverMisses: true },
  },
  accessory: {
    id: 'deity_eros_accessory', name: "Golden Heart Pendant",
    lore: "His heart is golden. Metaphorically. Literally. Both.",
    tier: 'deity', slot: 'accessory', deityId: 'eros',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Love does not fail. It simply hasn't been applied correctly yet. My pendant goes to those whose charm never breaks: in a single run to Floor 15, complete every NPC interaction with a positive outcome — no failed CHA checks, no negative results from events, every social encounter succeeds. Perfect charm. That is what love looks like in this Tower.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'event_success', value: 1, targetType: 'all_cha_checks_successful', description: 'Every CHA-based event check succeeded this run (none failed)' },
    ]},
    passiveId: 'eros_heart_passive',
    passiveDescription: "Beloved: CHA checks in events, NPC interactions, and Taunt attempts have +20% success rate. Additionally: when you successfully charm an enemy (via Taunt), there is a 15% chance they permanently join your side for the rest of the floor.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 30, LCK: 20 } },
  },
};

export const GREEK_DEITY_RELICS: DeityRelicPair[] = [
  HADES_RELICS, POSEIDON_RELICS, APOLLO_RELICS, ARTEMIS_RELICS,
  HEPHAESTUS_RELICS, HERMES_RELICS, DIONYSUS_RELICS, DEMETER_RELICS,
  HECATE_RELICS, HERA_RELICS, APHRODITE_RELICS, TYCHE_RELICS,
  PERSEPHONE_RELICS, HESTIA_RELICS, PAN_RELICS, NIKE_RELICS,
  NEMESIS_RELICS, ASCLEPIUS_RELICS, THANATOS_RELICS,
  HELIOS_RELICS, SELENE_RELICS, EROS_RELICS,
];
