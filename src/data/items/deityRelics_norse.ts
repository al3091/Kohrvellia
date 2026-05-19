/**
 * Norse Deity Relics — all Norse deities (odin + thor already in main deityRelics.ts)
 */

import type { DeityRelicPair } from './deityRelics';

const FREYA_RELICS: DeityRelicPair = {
  deityId: 'freya',
  weapon: {
    id: 'deity_freya_weapon', name: "Brisingamen's Edge",
    lore: "She paid four nights of her time for the Brisingamen necklace. The blade was a later addition. No one asked what she paid for it.",
    tier: 'deity', slot: 'weapon', deityId: 'freya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I choose half the slain. I take the best of them to Fólkvangr. To earn my blade: defeat 5 milestone bosses across 5 different runs on the same character. Each run, bring me the best of what this Tower has to offer. Half the glory is mine — I want to see you earn all of it.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 5, targetType: 'any_boss_different_runs', description: 'Defeat 5 milestone bosses across 5 different runs on the same character' },
    ]},
    passiveId: 'freya_blade_passive',
    passiveDescription: "Chooser of Slain: after defeating a boss, choose one of its abilities — that ability becomes a passive bonus for your character for the rest of the run. You take what you want from the fallen.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_freya_accessory', name: "Falcon Cloak Brooch",
    lore: "She lends this to gods and heroes. They always return it, because returning it is safer.",
    tier: 'deity', slot: 'accessory', deityId: 'freya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Cloak lets you soar above what would otherwise stop you. My brooch goes to those who can cry golden tears — not literally. Accumulate 5,000 gold total on a single character (not spent, held simultaneously). Show me you have gathered enough to weep without losing anything.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 5000, description: 'Hold 5,000 gold simultaneously on one character' },
    ]},
    passiveId: 'freya_cloak_passive',
    passiveDescription: "Golden Tears: when you drop below 25% HP, you briefly transform — gaining 30% damage reduction and 20% increased damage for 3 turns. The tears of Freya are not weakness. They are transformation.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { CHA: 25, AGI: 22 } },
  },
};

const LOKI_RELICS: DeityRelicPair = {
  deityId: 'loki',
  weapon: {
    id: 'deity_loki_weapon', name: "The Lie That Cuts",
    lore: "He told the blind god Höðr where to aim. He called this 'helping'.",
    tier: 'deity', slot: 'weapon', deityId: 'loki',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am chaos given purpose. My weapon goes to those who can fight in a way no one predicts: complete a run to Floor 15 where no two consecutive combats used the same primary action to kill the enemy. Alternate: kill with Attack, then kill with a Skill, then kill with a status effect proc, then Attack again, and so on. Never repeat back-to-back. Chaos does not repeat itself.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'alternating_kill_methods_no_consecutive_same', description: 'No two consecutive fights won by the same killing method' },
    ]},
    passiveId: 'loki_weapon_passive',
    passiveDescription: "Shapeshifter's Edge: this weapon changes damage type each combat (cycles through physical, magic, dark, fire, chaos). Enemies resistant to one type are hit by whichever type they are weak to. The lie cuts wherever it is least expected.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'LCK', finalDamage: 45, finalAccuracy: 90, finalCritChance: 0.32, range: 'melee', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_loki_accessory', name: "Trickster's Coin",
    lore: "Both sides are tails. He has never been caught with it. He will never be caught with it.",
    tier: 'deity', slot: 'accessory', deityId: 'loki',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Deception is my art form. My coin goes to those who have mastered the art of the unexpected advantage: successfully flee from combat 5 times in a run, then return and defeat the enemy you fled from — 5 times. Retreat is a lie you tell. The return is the punchline.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_elite', value: 5, description: 'Flee from 5 encounters in one run' },
      { metric: 'custom', value: 5, targetType: 'return_to_defeat_fled_enemy', description: 'Return to defeat the enemy you fled from 5 times in that run' },
    ]},
    passiveId: 'loki_coin_passive',
    passiveDescription: "Perfect Deception: after fleeing and returning to the same enemy, you are invisible for the first 2 turns of that re-engagement (cannot be targeted). They don't see the return coming.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, AGI: 20 } },
  },
};

const TYR_RELICS: DeityRelicPair = {
  deityId: 'tyr',
  weapon: {
    id: 'deity_tyr_weapon', name: "The Sword of Justice",
    lore: "He gave his hand to bind Fenrir. He would do it again. He has thought about it.",
    tier: 'deity', slot: 'weapon', deityId: 'tyr',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I sacrificed my hand for the law. My sword goes to those who demonstrate equivalent sacrifice: in a single run to Floor 15, complete every combat room you enter — no fleeing, no bypassing. Even if it costs you. Especially if it costs you. Honor requires accepting consequences.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero retreats or bypasses the entire run' },
    ]},
    passiveId: 'tyr_sword_passive',
    passiveDescription: "Honor-Bound: in any combat you have not fled or been forced to retreat from, your damage increases by 15% per consecutive non-retreat floor (max +45%). Breaking the chain resets it.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 52, finalAccuracy: 95, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_tyr_accessory', name: "War-Band of Tyr",
    lore: "He is the patron of warriors who fight by rules. There are fewer of these than you'd think.",
    tier: 'deity', slot: 'accessory', deityId: 'tyr',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Justice requires fairness. My band goes to those who win fairly: defeat 10 elite enemies and 5 bosses lifetime — without ever using the Observe action before those fights. Fight blind. Fight fair. The information advantage is a compromise of honor.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 10, targetType: 'elite_kills_no_observe_before', description: 'Defeat 10 elites without Observing before those fights, lifetime' },
      { metric: 'boss_kills', value: 5, targetType: 'no_observe_before_boss', description: 'Defeat 5 bosses without Observing before those fights, lifetime' },
    ]},
    passiveId: 'tyr_band_passive',
    passiveDescription: "Lawspeaker: when you enter combat without having used Observe beforehand, +20% damage for the entire fight. Tyr rewards those who trust themselves over information.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 25, END: 22 } },
  },
};

const HEL_RELICS: DeityRelicPair = {
  deityId: 'hel',
  weapon: {
    id: 'deity_hel_weapon', name: "Half-Dead Edge",
    lore: "Half of her is living. Half of her is not. The weapon is entirely the other half.",
    tier: 'deity', slot: 'weapon', deityId: 'hel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My realm holds those who die of sickness and old age — not the glorious slain. My weapon goes to those who understand my domain: die in the dungeon 10 times total lifetime. Not from bosses. From ordinary enemies — the unglamorous, the overlooked. Die in the dark, from something small. My realm is where most end up.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'deaths_to_non_boss_enemies', description: 'Die to non-boss, non-elite enemies 10 times total lifetime' },
    ]},
    passiveId: 'hel_edge_passive',
    passiveDescription: "Between Living and Dead: when your HP is below 50%, deal +25% damage (the dying half). When above 50%, deal +10% damage and take -10% damage (the living half). She grants power to both states.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 88, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_hel_accessory', name: "Pale Queen's Ring",
    lore: "Hel's face is half-corpse, half-living. The ring reflects which half is looking at you.",
    tier: 'deity', slot: 'accessory', deityId: 'hel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "You have died enough times to understand my kingdom from the inside. My ring goes to those who have been to the threshold and returned: survive at 1 HP at least 5 times in a single run (being brought to 1 HP by any source and surviving to win). Live. Barely. Repeatedly.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'survived_at_1hp_five_times_single_run', description: 'Survive with exactly 1 HP remaining in combat 5 times in one run' },
    ]},
    passiveId: 'hel_ring_passive',
    passiveDescription: "Death's Threshold: when you would die, instead survive at 1 HP once per combat (the cold threshold). After activating: deal +50% damage for 3 turns (Hel's fury at being cheated of a soul).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 28, WIS: 18 } },
  },
};

const HEIMDALL_RELICS: DeityRelicPair = {
  deityId: 'heimdall',
  weapon: {
    id: 'deity_heimdall_weapon', name: "Gjallarhorn's Blade",
    lore: "He will blow the Gjallarhorn at Ragnarok. Until then, this is in his other hand.",
    tier: 'deity', slot: 'weapon', deityId: 'heimdall',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I see everything. I hear everything. To earn my blade: observe every single enemy on 10 consecutive floors in a run — every floor, every enemy, before the first kill on each floor. Not 10 random floors. 10 consecutive floors. I need to know you can maintain vigilance indefinitely.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'ten_consecutive_floors_all_observed', description: '10 consecutive floors: observe every enemy before first kill' },
    ]},
    passiveId: 'heimdall_blade_passive',
    passiveDescription: "All-Watch: you are never surprised. Enemies cannot get the first-attack bonus against you. Additionally: once per floor, you receive advance warning of what the boss room contains before entering it.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 102, finalCritChance: 0.28, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_heimdall_accessory', name: "Watcher's Bifrost Shard",
    lore: "The bridge between worlds. This piece fell off during Ragnarok prep. He hasn't noticed.",
    tier: 'deity', slot: 'accessory', deityId: 'heimdall',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Rainbow Bridge connects all realms. My shard goes to those who demonstrate connection: reach Favoured Child status with 2 deities from completely different pantheons simultaneously. You cannot serve two masters of the same house. Cross-pantheon devotion proves breadth of understanding.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 2, targetType: 'different_pantheons', description: 'Reach 91+ favor with 2 deities from different pantheons simultaneously' },
    ]},
    passiveId: 'heimdall_shard_passive',
    passiveDescription: "Bifrost Connection: you can see through walls — mystery rooms reveal their content type before you enter. Also: floor maps are fully revealed from the start of each new floor.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { PER: 30, WIS: 18 } },
  },
};

const FRIGG_RELICS: DeityRelicPair = {
  deityId: 'frigg',
  weapon: {
    id: 'deity_frigg_weapon', name: "Fate-Woven Lance",
    lore: "She knows the fate of all beings but tells no one. The lance holds that weight.",
    tier: 'deity', slot: 'weapon', deityId: 'frigg',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I know the fate of every living thing. My lance goes to those who face known doom with open eyes: in a run where you have already lost 75% of your max HP from damage accumulated, still defeat a milestone boss. Walk into what you know is coming. That is what I respect.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 1, targetType: 'at_25_percent_hp_when_boss_killed', description: 'Kill a milestone boss while at 25% or less max HP' },
      { metric: 'boss_kills_run', value: 1, description: 'Defeat any milestone boss' },
    ]},
    passiveId: 'frigg_lance_passive',
    passiveDescription: "Foreknowledge: once per combat, you may ask what the enemy's next action will be (see the pending action before it resolves). Additionally, when your HP is below 30%, all damage you deal increases by 20%.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_frigg_accessory', name: "Fensalir Weaving Sash",
    lore: "She spins fate in her hall. You only get this if you're woven into the good threads.",
    tier: 'deity', slot: 'accessory', deityId: 'frigg',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fate is most powerful when it is already decided. My sash goes to those who demonstrate that destiny can be prepared for: visit the Familia Home 20 times total lifetime. Prepare. Plan. Return to the hearthfire before each descent. I protect those who tend their household.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'familia_visits', value: 20, description: 'Visit the Familia Home 20 times total lifetime' },
    ]},
    passiveId: 'frigg_sash_passive',
    passiveDescription: "Woven Fate: at the start of each dungeon run, you receive a 'Fate Preview' — a vague hint about what floor the first major threat will appear on. Also: Blessing Rite outcomes are guaranteed to include at least one non-standard tier achievement.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 26, END: 20 } },
  },
};

const BALDUR_RELICS: DeityRelicPair = {
  deityId: 'baldur',
  weapon: {
    id: 'deity_baldur_weapon', name: "Radiant Strike",
    lore: "He was invulnerable to everything. They tested it by throwing things at him at parties. Then Loki ruined it.",
    tier: 'deity', slot: 'weapon', deityId: 'baldur',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was beloved by all — everything loved me, everything protected me. My weapon goes to those who prove they are equally safe: complete a full run from Floor 1 to Floor 10 where you take zero damage in any combat. Not less than 50 damage. Zero. Every combat, untouched. Baldur did not feel pain. Neither should you.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'damage_taken_run', value: 0, description: 'Zero total damage taken from any source the entire run' },
    ]},
    passiveId: 'baldur_weapon_passive',
    passiveDescription: "Beloved Light: when you have not taken damage in the last 3 combats, this weapon deals +30% damage and ignores 25% of enemy defense. The radiance of the untouched.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 98, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_baldur_accessory', name: "Light of Asgard Pendant",
    lore: "When he died, even the rocks wept. This is a fragment of what they wept for.",
    tier: 'deity', slot: 'accessory', deityId: 'baldur',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Everything loved me — except mistletoe. One weakness. My pendant goes to those who have no weaknesses they show: complete a run to Floor 15 without receiving a single status effect OR negative outcome from any event room. Perfect run. If you have a weakness, you have not earned this yet.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'status_received_survived', value: 0, description: 'Zero status effects received the entire run' },
    ]},
    passiveId: 'baldur_pendant_passive',
    passiveDescription: "Invulnerability: you are immune to all status effects. Enemies that would inflict status effects instead waste their action (they cannot affect you). The pendant holds what made Baldur beloved.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 28, WIS: 20 } },
  },
};

const SKADI_RELICS: DeityRelicPair = {
  deityId: 'skadi',
  weapon: {
    id: 'deity_skadi_weapon', name: "Winter Hunter's Bow",
    lore: "She hunts on skis through the mountains. She has never missed. The mountains acknowledge this.",
    tier: 'deity', slot: 'weapon', deityId: 'skadi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The mountains demand precision. My bow goes to those who hunt with patience and never rush: observe every elite and boss encounter in a single run before attacking — AND, in each of those fights, do not attack on the first turn. Let them come to you. The mountain hunter does not chase. She positions and waits.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'all_elites_bosses_observed_wait_turn1', description: 'Observe every elite and boss first, and delay first attack to turn 2+ in each' },
      { metric: 'boss_kills_run', value: 1, description: 'Still defeat at least one boss' },
    ]},
    passiveId: 'skadi_bow_passive',
    passiveDescription: "Mountain Precision: if you do not attack on turn 1 of any combat, your turn 2 attack deals +60% damage (the calculated shot). This bonus applies once per combat.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 50, finalAccuracy: 106, finalCritChance: 0.32, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_skadi_accessory', name: "Jötunheim Snowdrift Cloak",
    lore: "She married Njord because she chose wrong. She stayed in the mountains because she chose right.",
    tier: 'deity', slot: 'accessory', deityId: 'skadi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I chose the mountains over the sea. Proof of commitment: complete 5 runs each reaching at least Floor 8, all using ranged weapons exclusively — no melee ever. Commit to the distance. The mountain hunter does not close range.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_runs_floor8_ranged_only', description: '5 runs reaching Floor 8+ using only ranged weapons, lifetime' },
    ]},
    passiveId: 'skadi_cloak_passive',
    passiveDescription: "Winter Camouflage: enemies cannot target you for the first turn of combat (they cannot find you in the cold). Also: cold/freeze status effects cannot be applied to you.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 25, PER: 22 } },
  },
};

const NJORD_RELICS: DeityRelicPair = {
  deityId: 'njord',
  weapon: {
    id: 'deity_njord_weapon', name: "Sea-Wind Staff",
    lore: "He governs winds and seas. His marriages were troubled. His seas are calm.",
    tier: 'deity', slot: 'weapon', deityId: 'njord',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Prosperity flows to those who trade, not hoard. My staff goes to those who have invested in the economy: visit shops 25 times total lifetime. Buy things. Move gold. The sea flows — it does not stagnate. Neither should your gold.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'shop_visits', value: 25, description: 'Visit town shops 25 times total lifetime' },
    ]},
    passiveId: 'njord_staff_passive',
    passiveDescription: "Prosperity Winds: gold dropped by enemies is increased by 20%. Also: shop prices are reduced by 10% (Njord's trade winds favor you). The sea god blesses those who move wealth.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 42, finalAccuracy: 90, finalCritChance: 0.24, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_njord_accessory', name: "Calm Seas Amulet",
    lore: "He controls the winds. Sometimes he calms them. Sometimes he does not.",
    tier: 'deity', slot: 'accessory', deityId: 'njord',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Calm waters carry ships safely. My amulet goes to those who prove they can navigate without turbulence: complete 3 consecutive runs reaching Floor 10+ without using the Flee action once across all three runs. Three clean voyages.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 3, targetType: 'three_consecutive_runs_no_flee_floor10', description: '3 consecutive runs reaching Floor 10+ with zero flee uses, lifetime' },
    ]},
    passiveId: 'njord_amulet_passive',
    passiveDescription: "Favorable Winds: flee attempts now always succeed. When you flee successfully, you carry 1 random item from the enemy's loot table (the tide recedes with gifts).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { AGI: 22, LCK: 20 } },
  },
};

const BRAGI_RELICS: DeityRelicPair = {
  deityId: 'bragi',
  weapon: {
    id: 'deity_bragi_weapon', name: "Skald's Harp-Blade",
    lore: "He is the god of poetry. The blade has a rhythm to it that scholars argue about.",
    tier: 'deity', slot: 'weapon', deityId: 'bragi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "A saga must be worth telling. My blade goes to those who have done the deeds that fill one: complete the Denatus ceremony at Level 10. Your soul must have enough story in it to earn a soul title. A weapon fit for legends goes to legends. Not to those still writing their first verse.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon and complete the Denatus ceremony' },
    ]},
    passiveId: 'bragi_blade_passive',
    passiveDescription: "Epic Saga: this weapon gains a new passive ability for every boss you defeat with it (adds to the 'saga' of the blade). First ability unlocks at 1 boss kill, second at 3, third at 5 total with this weapon.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_bragi_accessory', name: "Golden Tongue Pendant",
    lore: "He was given runes on his tongue. This makes conversation at Asgard dinners uncomfortable.",
    tier: 'deity', slot: 'accessory', deityId: 'bragi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Words have power. My pendant goes to those who speak the right ones: bypass 5 bosses through dialogue total lifetime. Not fight them. Talk to them. Talk your way past 5. The Skald's power is not the sword — it is the word that makes the sword unnecessary.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 5, description: 'Bypass 5 bosses through dialogue total lifetime' },
    ]},
    passiveId: 'bragi_pendant_passive',
    passiveDescription: "Golden Speech: all CHA-based actions (Taunt, event checks, boss dialogue) have +25% success rate. Additionally: bypassing a boss through dialogue now also grants you a bonus item from that boss's loot table.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 30, WIS: 18 } },
  },
};

const IDUN_RELICS: DeityRelicPair = {
  deityId: 'idun',
  weapon: {
    id: 'deity_idun_weapon', name: "Golden Apple Branch",
    lore: "She keeps the apples that give the gods their youth. The branch can also remove age from something's lifespan.",
    tier: 'deity', slot: 'weapon', deityId: 'idun',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Youth is not the absence of experience — it is the continuation of growth. My branch goes to those who continue growing: reach Level 7 on a single character. Not just any 7 levels. Same character, continuous. Show me the growth does not stop.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 7, description: 'Reach Level 7 on a single character' },
    ]},
    passiveId: 'idun_branch_passive',
    passiveDescription: "Eternal Youth: each level you gain permanently increases this weapon's base damage by +3. Also: at the start of each dungeon run, you regain 10% of your total HP/SP lost in the previous run (the apple restores).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 42, finalAccuracy: 92, finalCritChance: 0.24, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_idun_accessory', name: "Apple-Keeper's Basket",
    lore: "She was kidnapped once. The gods aged immediately. They got her back very quickly.",
    tier: 'deity', slot: 'accessory', deityId: 'idun',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The golden apples require a keeper who understands their value. My basket goes to those who understand the value of healing: receive healing 200 times across your lifetime — any source, any method. Potions, rest sites, skill regeneration. Show me you keep yourself alive as carefully as I keep the apples.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 200, description: 'Receive healing 200 times from any source lifetime' },
    ]},
    passiveId: 'idun_basket_passive',
    passiveDescription: "Youth Restored: consumable healing items restore +30% more HP/SP. Also: once per dungeon run, after you use a healing consumable, it has a 50% chance to not be consumed (the apple replenishes).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 25, WIS: 20 } },
  },
};

const VIDAR_RELICS: DeityRelicPair = {
  deityId: 'vidar',
  weapon: {
    id: 'deity_vidar_weapon', name: "Silence Blade",
    lore: "He will kill Fenrir at Ragnarok with his thick boot. The blade is for everything before that.",
    tier: 'deity', slot: 'weapon', deityId: 'vidar',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Vidar is silent. Vidar is patient. Vidar acts at the right moment and never before. My blade goes to those who demonstrate that silence: complete a run to Floor 20 using zero support skills — no buffing, no Taunt, no healing skills. Only attacking. Only waiting. Only precision.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'skill_uses', value: 0, targetType: 'zero_support_skills', description: 'Zero support/healing skills used the entire run' },
    ]},
    passiveId: 'vidar_blade_passive',
    passiveDescription: "Patient Strength: the first attack of any combat deals +100% damage. Vidar strikes once, precisely, at the right moment. After attacking on turn 1: normal damage for the rest of the combat.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_vidar_accessory', name: "Thick-Soled Boot (Charm Form)",
    lore: "He has been making this boot from the scraps of shoes. At Ragnarok, it will be perfect.",
    tier: 'deity', slot: 'accessory', deityId: 'vidar',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Vengeance requires patience and accumulation. My boot-charm goes to those who accumulate: acquire 20 unique weapon types across your lifetime (20 different weapon base types ever equipped or held). Each scrap adds to the whole. Collect them all.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 20, targetType: 'unique_weapon_base_types_owned', description: 'Own or equip 20 different base weapon types across all characters lifetime' },
    ]},
    passiveId: 'vidar_boot_passive',
    passiveDescription: "Prepared Vengeance: whenever an enemy reduces you to below 50% HP in a single hit, that enemy takes 50% bonus damage from you for the rest of the combat. The boot is ready for the moment.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 28, STR: 18 } },
  },
};

const MIMIR_RELICS: DeityRelicPair = {
  deityId: 'mimir',
  weapon: {
    id: 'deity_mimir_weapon', name: "Well-Keeper's Staff",
    lore: "His head was cut off. Odin kept it and consults it. Mimir considers this a promotion.",
    tier: 'deity', slot: 'weapon', deityId: 'mimir',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "All wisdom flows through my well. Odin sacrificed his eye for a drink. My staff goes to those who have accumulated equivalent wisdom: observe 100 enemies total lifetime (same metric Odin needed for his runes). 100 observations. The well gives what is earned.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 100, description: 'Use Observe 100 times total lifetime' },
    ]},
    passiveId: 'mimir_staff_passive',
    passiveDescription: "Well of Wisdom: after using Observe in combat, all subsequent attacks in that fight have +20% accuracy and +10% critical chance. The well's gift: knowing exactly where the blow lands.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_mimir_accessory', name: "Fragment of the Well",
    lore: "A piece of the well that holds all knowledge. It leaks constantly. This is normal.",
    tier: 'deity', slot: 'accessory', deityId: 'mimir',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Knowledge without application is just memory. My fragment goes to those who apply what they know: complete the Bestiary knowledge entry for 25 different enemy types (observe, fight, and record 25 unique species). The Well holds all names. Those who add to it may borrow from it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 25, targetType: 'complete_bestiary_entries', description: 'Complete full Bestiary knowledge entries for 25 enemy types (observe + fight + record)' },
    ]},
    passiveId: 'mimir_fragment_passive',
    passiveDescription: "Borrowed Wisdom: once per run, consult the Well — receive a precise hint about the most dangerous enemy on the current floor (its weakness and a preview of its special ability).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 30, INT: 18 } },
  },
};

export const NORSE_DEITY_RELICS: DeityRelicPair[] = [
  FREYA_RELICS, LOKI_RELICS, TYR_RELICS, HEL_RELICS, HEIMDALL_RELICS,
  FRIGG_RELICS, BALDUR_RELICS, SKADI_RELICS, NJORD_RELICS, BRAGI_RELICS,
  IDUN_RELICS, VIDAR_RELICS, MIMIR_RELICS,
];
