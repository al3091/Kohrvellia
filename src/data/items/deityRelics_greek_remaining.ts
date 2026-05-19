/**
 * Greek Deity Relics — Remaining deities not in deityRelics_greek.ts
 * Hypnos, Nyx, Prometheus, Eris, Charon
 */

import type { DeityRelicPair } from './deityRelics';

const HYPNOS_RELICS: DeityRelicPair = {
  deityId: 'hypnos',
  weapon: {
    id: 'deity_hypnos_weapon', name: "Sleep-Touch Blade",
    lore: "He put the gods themselves to sleep. This blade carries that same quiet inevitability.",
    tier: 'deity', slot: 'weapon', deityId: 'hypnos',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Sleep is not weakness. Sleep is preparation that the waking never understand. My blade goes to those who master the art of the still moment: in a single run reaching Floor 10, use the Defend action at least once in every single combat room you enter — before taking any other action. Stand still before the storm. The sword of sleep rewards those who pause before striking.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 1, targetType: 'defend_first_every_combat', description: 'Use Defend as your first action in every combat room entered this run' },
    ]},
    passiveId: 'hypnos_blade_passive',
    passiveDescription: "Sleep Stroke: attacks with this weapon have a 20% chance to inflict Sleep on the enemy (they skip their next turn). Against enemies below 25% HP, the chance doubles to 40% — the near-dead are easiest to put down gently.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 42, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_hypnos_accessory', name: "Poppy Crown of Lethe",
    lore: "He grows the poppies on the banks of Lethe. Wearing this you smell them constantly.",
    tier: 'deity', slot: 'accessory', deityId: 'hypnos',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Lethe flows in my kingdom. Mortals drink from it to forget — to sleep without the weight of memory. My crown goes to those who demonstrate the mercy of forgetting: use 5 rest sites in a single run. Not because you must — because you choose to lay down the weight. Rest does not interrupt the journey. It is the journey.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'rest_sites_used', value: 5, description: 'Use 5 rest sites in one run' },
    ]},
    passiveId: 'hypnos_crown_passive',
    passiveDescription: "Lethe's Gift: after using a rest site, your next combat opens with the enemy in a Drowsy state — they act on turn 2 instead of turn 1 (you always go first). The poppy crown carries calm ahead of you.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 25, END: 20 } },
  },
};

const NYX_RELICS: DeityRelicPair = {
  deityId: 'nyx',
  weapon: {
    id: 'deity_nyx_weapon', name: "Veil of First Dark",
    lore: "She existed before the gods. Before the light. This is a sliver of what that was.",
    tier: 'deity', slot: 'weapon', deityId: 'nyx',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am primordial. I do not grant weapons lightly — not to those who merely survive. I grant them to those who embrace total darkness: complete a full run to Floor 15 without ever using the Observe action, without visiting any treasure rooms, and without purchasing anything from shops. Walk blindly. Trust nothing. That is the primordial way — before revelation existed.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'observe_total', value: 0, description: 'Zero Observe uses the entire run' },
      { metric: 'treasure_rooms', value: 0, description: 'Zero treasure rooms visited' },
      { metric: 'shop_visits', value: 0, description: 'Zero shop visits' },
    ]},
    passiveId: 'nyx_veil_passive',
    passiveDescription: "Primordial Dark: this weapon deals +25% damage against any enemy you have never Observed. Against enemies you have observed, it deals standard damage. Knowledge weakens its power.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_nyx_accessory', name: "Starless Mantle",
    lore: "There was a night before stars. Nyx remembers it. The mantle is a piece of that memory.",
    tier: 'deity', slot: 'accessory', deityId: 'nyx',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The primordial dark is absolute. Even I bow to no one — not Olympus, not fate. My mantle goes to those who prove independence: complete a run to Floor 10 on a character who has never been a Favoured Child of any deity — 91+ favor with no one. Walk alone. The first night had no gods in it. Neither should you, for this one run.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'favor_favoured_child', value: 0, description: 'This character has never reached 91+ favor with any deity' },
    ]},
    passiveId: 'nyx_mantle_passive',
    passiveDescription: "Night Without Stars: dark-type damage you deal ignores 30% of enemy resistance. Additionally: on floors 15+, you gain +20% evasion — the primordial dark wraps around you more completely the deeper the Tower goes.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 28, INT: 20 } },
  },
};

const PROMETHEUS_RELICS: DeityRelicPair = {
  deityId: 'prometheus',
  weapon: {
    id: 'deity_prometheus_weapon', name: "Stolen Flame Torch-Spear",
    lore: "He took fire from the gods and gave it to mortals. He paid for it for eternity. He says it was worth it.",
    tier: 'deity', slot: 'weapon', deityId: 'prometheus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was chained to a rock for all eternity because I chose humanity over the gods' comfort. My weapon goes to those who make similarly costly sacrifices: destroy a Legendary-quality weapon or accessory permanently — not sell it, DESTROY it — and then, in the same run, reach Floor 15. Give up what is most valuable. Then prove it was worth it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'items_destroyed', value: 1, targetType: 'legendary_quality', description: 'Permanently destroy a Legendary-quality item in this run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15 in that same run' },
    ]},
    passiveId: 'prometheus_torch_passive',
    passiveDescription: "Stolen Flame: this weapon's attacks deal +15% bonus magic damage on top of physical damage (the fire adds to every strike). When you use a skill, the skill gains a fire rider dealing 10% of its base damage as magic bonus.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_prometheus_accessory', name: "Titan's Unbreakable Chain",
    lore: "He wore these for an eternity and refused to repent. Strength of purpose made them meaningless.",
    tier: 'deity', slot: 'accessory', deityId: 'prometheus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The eagle came every day to eat my liver. Every night it regrew. I did not break. My chains go to those who endure equivalent punishment: in a single run, take at least 500 total damage AND still complete the run reaching Floor 15. You bleed. You continue. That is the Prometheus compact.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 500, description: 'Take 500+ total damage in one run' },
      { metric: 'floors_reached', value: 15, description: 'Still reach Floor 15 in that run' },
    ]},
    passiveId: 'prometheus_chain_passive',
    passiveDescription: "Titan's Endurance: your max HP increases by 1 permanently for every 5 damage you take in a run (up to +100 max HP per run). Suffering adds to your capacity. The chain that bound a Titan now gives you Titan strength.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 30, STR: 18 } },
  },
};

const ERIS_RELICS: DeityRelicPair = {
  deityId: 'eris',
  weapon: {
    id: 'deity_eris_weapon', name: "Apple of Discord",
    lore: "She threw a golden apple inscribed 'For the Fairest.' Three goddesses fought over it. A war followed. Eris considers this her masterpiece.",
    tier: 'deity', slot: 'weapon', deityId: 'eris',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Discord is the engine of all change. My Apple goes to those who demonstrate chaos as a weapon strategy: in a single run, inflict 5 different status effect types on enemies — in the same combat. Not across the run. In ONE fight, against any enemy, apply five distinct ailments simultaneously. Discord: applied, not theoretical.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 5, targetType: 'five_different_types_one_combat', description: 'Apply 5 different status effect types in a single combat' },
    ]},
    passiveId: 'eris_apple_passive',
    passiveDescription: "Sown Discord: when you inflict a new status effect on an enemy, all existing status effects on that enemy deal +15% more damage this turn. Discord compounds — the more chaos, the more each piece of chaos hurts.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'CHA', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.32, range: 'ranged', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_eris_accessory', name: "Uninvited Guest's Seal",
    lore: "She was the only deity not invited to the wedding. She was the most important one there.",
    tier: 'deity', slot: 'accessory', deityId: 'eris',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the one who disrupts when all seems settled. My seal goes to the truly chaotic: in a single run, flee from 5 combats AND complete the run reaching Floor 10 — and at least 3 of those fleeing events must be from elite rooms specifically. Disrupt the expected order. Flee the hard fights. Then finish strong. Chaos does not fight on others' terms.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_elite', value: 3, description: 'Flee from 3 elite rooms in one run' },
      { metric: 'flee_total', value: 5, description: 'Total 5 flee actions in that run' },
      { metric: 'floors_reached', value: 10, description: 'Still reach Floor 10' },
    ]},
    passiveId: 'eris_seal_passive',
    passiveDescription: "Chaos Dividend: each time you flee a combat in a run, your next combat opens with a random positive buff applied to you (and a random debuff applied to the enemy). Discord's dividend: something is always gained in the disruption.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { LCK: 28, CHA: 20, AGI: 10 } },
  },
};

const CHARON_RELICS: DeityRelicPair = {
  deityId: 'charon',
  weapon: {
    id: 'deity_charon_weapon', name: "Ferryman's Pole",
    lore: "He poles the boat across the Styx. This is what he uses when someone refuses to stay dead.",
    tier: 'deity', slot: 'weapon', deityId: 'charon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I charge one obol for the crossing. Everyone pays eventually. My pole goes to those who understand the toll of passage: accumulate 50,000 gold total across your lifetime — not in one run, not on one character. Fifty thousand, total. Every gold piece is an obol. Pay the ferryman. Then he will lend you his pole.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 50000, description: 'Accumulate 50,000 total gold across all runs and characters lifetime' },
    ]},
    passiveId: 'charon_pole_passive',
    passiveDescription: "Obol Toll: each kill with this weapon adds 3 gold to your purse automatically (the ferryman takes his cut from the defeated). Additionally: once per run, if you would die with 50+ gold on you, you survive at 1 HP — Charon lets you pass back for the fare.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_charon_accessory', name: "Unburied Coin",
    lore: "Those who cannot pay must wait on the far shore for a hundred years. This coin belongs to someone who finally found it.",
    tier: 'deity', slot: 'accessory', deityId: 'charon',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The unburied wander. The coin brings peace. My coin goes to those who have passed the underworld threshold and returned: die on exactly Floor 15 in 2 different runs, lifetime. Not Floor 14. Not Floor 16. Floor 15, twice. The precise toll. The ferryman sees patterns in the dead. Show me yours.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 2, targetType: 'die_exactly_floor_15_twice', description: 'Die exactly on Floor 15 (not 14 or 16) in 2 different runs lifetime' },
    ]},
    passiveId: 'charon_coin_passive',
    passiveDescription: "Ferryman's Mark: when you are on a floor where you have previously died on a different run, you deal +20% damage (the dead know their killing ground). Also: gold looted from bosses on floors you have died on is doubled.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 22, LCK: 22, END: 15 } },
  },
};

export const GREEK_REMAINING_RELICS: DeityRelicPair[] = [
  HYPNOS_RELICS, NYX_RELICS, PROMETHEUS_RELICS, ERIS_RELICS, CHARON_RELICS,
];
