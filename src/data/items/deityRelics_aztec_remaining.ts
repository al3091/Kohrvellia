/**
 * Aztec Deity Relics — Remaining deities not in deityRelics_south.ts
 * Xipe Totec, Tlaloc, Tonatiuh, Chalchiuhtlicue, Xiuhtecuhtli,
 * Xochiquetzal, Xochipilli, Tlazolteotl, Coatlicue, Xolotl, Mayahuel
 */

import type { DeityRelicPair } from './deityRelics';

const XIPE_TOTEC_RELICS: DeityRelicPair = {
  deityId: 'xipe_totec',
  weapon: {
    id: 'deity_xipe_totec_weapon', name: "Flayed Lord's Skinning Blade",
    lore: "He is Our Lord the Flayed One — he wore the flayed skin of sacrificial victims as his own, symbolizing renewal through death. Seeds shed their husk to become plants. He wears the husk.",
    tier: 'deity', slot: 'weapon', deityId: 'xipe_totec',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I wear the skin of death so that life can grow beneath it. My blade goes to those who demonstrate renewal through sacrifice: destroy an item of rare quality or higher permanently, then in the same run complete it reaching Floor 10. The seed sheds its husk. Growth requires the death of what contained it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'items_destroyed', value: 1, targetType: 'rare_quality_or_higher', description: 'Destroy a rare+ quality item permanently in this run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10 in that same run' },
    ]},
    passiveId: 'xipe_totec_blade_passive',
    passiveDescription: "Renewal Through Destruction: each item destroyed this run permanently adds +5 flat damage to this weapon for the run (the flayed skin feeds the living). Maximum +30 from 6 destroyed items.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_xipe_totec_accessory', name: "Tlapalteotl Renewal Ring",
    lore: "The ring worn by priests during the Tlacaxipehualiztli festival — the festival of flaying. The renewal ceremony that marks the transition to spring.",
    tier: 'deity', slot: 'accessory', deityId: 'xipe_totec',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Renewal comes through cycles, not moments. My ring goes to those who have shed their old skins repeatedly: create 4 characters across your lifetime — four skins, four lives, four cycles of growth. Each character is the seed of the next. Four renewals. Then the ring passes to you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 4, targetType: 'four_characters_created_lifetime', description: 'Create 4 characters lifetime (each played at least through character creation)' },
    ]},
    passiveId: 'xipe_totec_ring_passive',
    passiveDescription: "Flayed Renewal: when any weapon you equip breaks or is destroyed, immediately gain +20% damage with the next weapon you equip for the next 5 combats — the old skin becomes the new one's foundation.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 22, END: 20, WIS: 16 } },
  },
};

const TLALOC_RELICS: DeityRelicPair = {
  deityId: 'tlaloc',
  weapon: {
    id: 'deity_tlaloc_weapon', name: "Rain God's Serpent Staff",
    lore: "His rain falls as rain or hail or frost or drought depending on his mood. He is worshipped with child sacrifices because their tears summon rain. He is also generous when properly entreated.",
    tier: 'deity', slot: 'weapon', deityId: 'tlaloc',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I require tears before I give rain. The ritual requires suffering before blessing. My staff goes to those who demonstrate the suffering before the gift: take 300 total damage in a single run AND still reach Floor 10. Bleed for the rain. Suffer for the harvest. Tlaloc gives most generously to those whose tears are real.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 300, description: 'Take 300+ total damage in one run' },
      { metric: 'floors_reached', value: 10, description: 'Still reach Floor 10' },
    ]},
    passiveId: 'tlaloc_staff_passive',
    passiveDescription: "Rain After Tears: damage dealt increases by 1% for every 15 damage taken this run (max +25% from 375 damage taken). The rain falls heaviest after the longest suffering.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_tlaloc_accessory', name: "Tlalocan Paradise Jade",
    lore: "Tlalocan is Tlaloc's paradise — those who drowned or were struck by lightning went there. It is lush and abundant. The jade is from Tlalocan's garden.",
    tier: 'deity', slot: 'accessory', deityId: 'tlaloc',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Tlalocan is paradise for those who died in my domain — drowning, lightning, water. My jade goes to those who prove they can turn suffering into abundance: in a single run, receive the Poison status effect AND survive it to clear the floor — do this on 3 different floors. Three floors where the rain turned to poison and you survived each one.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 3, targetType: 'poison_survived_on_three_floors', description: 'Receive Poison on 3 different floors in one run and survive each' },
    ]},
    passiveId: 'tlaloc_jade_passive',
    passiveDescription: "Tlalocan's Abundance: when you survive a status effect expiring naturally (not cured), restore 8% max HP (the rain nourishes what endured it). This triggers once per status effect that runs its full duration.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 24, WIS: 20, INT: 14 } },
  },
};

const TONATIUH_RELICS: DeityRelicPair = {
  deityId: 'tonatiuh',
  weapon: {
    id: 'deity_tonatiuh_weapon', name: "Fifth Sun's Sacrificial Blade",
    lore: "The current sun Tonatiuh required constant sacrifice to keep moving. He refused to rise without it. The gods sacrificed themselves at Teotihuacan to start the Fifth Sun.",
    tier: 'deity', slot: 'weapon', deityId: 'tonatiuh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I required the gods to sacrifice themselves before I would rise. Blood keeps the sun moving. My blade goes to those who offer equivalent sacrifice: destroy a Legendary weapon permanently and use the run to reach Floor 20. Not the same run — not necessarily. Just destroy Legendary and then prove the sacrifice was worth it on any subsequent run. The Fifth Sun rose because the sacrifice was real.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'items_destroyed', value: 1, targetType: 'legendary_weapon_ever', description: 'Destroy a Legendary weapon permanently (any run)' },
      { metric: 'floors_reached', value: 20, targetType: 'in_any_run', description: 'Reach Floor 20 in any run' },
    ]},
    passiveId: 'tonatiuh_blade_passive',
    passiveDescription: "Fifth Sun's Hunger: each item destroyed in this run adds +8% damage (max +40% from 5 destroyed items). The sun demands sacrifice — every sacrifice feeds the blade's hunger.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_tonatiuh_accessory', name: "Eagle Warrior's Sun Disc",
    lore: "The eagle warriors were the sun's elite soldiers, charged with capturing sacrificial victims for Tonatiuh. The disc is their badge of recognition.",
    tier: 'deity', slot: 'accessory', deityId: 'tonatiuh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My eagle warriors capture the living for sacrifice. They do not kill indiscriminately — they capture with purpose. My disc goes to those who prove equivalent selective mastery: use boss_bypass (dialogue) exactly 0 times in a single run to Floor 20. Fight every boss. The sun requires the full sacrifice, not the diplomatic bypass. Zero bypasses. Floor 20.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'boss_bypass', value: 0, description: 'Zero boss bypasses the entire run' },
      { metric: 'boss_kills_run', value: 4, description: 'Defeat at least 4 milestone bosses' },
    ]},
    passiveId: 'tonatiuh_disc_passive',
    passiveDescription: "Eagle Warrior's Mark: +20% damage against bosses and elites (the sun warrior hunts the significant prey). Additionally: defeating a boss restores 15% max HP — the successful sacrifice pleases Tonatiuh.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 25, AGI: 20 } },
  },
};

const CHALCHIUHTLICUE_RELICS: DeityRelicPair = {
  deityId: 'chalchiuhtlicue',
  weapon: {
    id: 'deity_chalchiuhtlicue_weapon', name: "Jade Skirt Flood-Staff",
    lore: "She is the goddess of water, rivers, and the Fourth Sun — which she ended by flood. She wears a skirt of jade. Her waters birth and drown.",
    tier: 'deity', slot: 'weapon', deityId: 'chalchiuhtlicue',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I ended the Fourth Sun with a flood of jade water. My staff goes to those who demonstrate the flood's selectivity: in a single run reaching Floor 15, inflict the same status effect on 20 different enemies — any single status effect type, but the same one on 20 different targets. The flood is not random. It carries the jade-green intention everywhere it reaches.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 20, targetType: 'same_status_type_20_different_enemies', description: 'Inflict the same status effect type on 20 different enemies in one run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
    ]},
    passiveId: 'chalchiuhtlicue_staff_passive',
    passiveDescription: "Jade Flood: the first status effect you inflict each combat is always at double duration (the jade skirt goddess spreads her water deeply). Additionally: magic-type damage deals +15% bonus when you have a status effect active on the target.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 92, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_chalchiuhtlicue_accessory', name: "Jade Skirt Jewel",
    lore: "The jade of her skirt is polished water-green. It is the color of the river in the mountain, the lake at dawn. The jewel is carved from one of her skirt-stones.",
    tier: 'deity', slot: 'accessory', deityId: 'chalchiuhtlicue',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The river protects those who travel it honestly. My jewel goes to those who have proven honest passage: complete 5 separate dungeon runs reaching Floor 5+ without using any flee action in any of those runs. Five clean passages through the river. No retreat from the current. The jade skirt goddess grants passage only to those who commit to the crossing.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_runs_floor5_no_flee', description: 'Complete 5 runs reaching Floor 5+ with zero flee attempts in each, lifetime' },
    ]},
    passiveId: 'chalchiuhtlicue_jewel_passive',
    passiveDescription: "River Passage: at the start of each floor, if you have not fled since the last floor, gain +15% damage for the first combat on the new floor (the river grants swift current to those who commit to the crossing).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 24, WIS: 20, END: 14 } },
  },
};

const XIUHTECUHTLI_RELICS: DeityRelicPair = {
  deityId: 'xiuhtecuhtli',
  weapon: {
    id: 'deity_xiuhtecuhtli_weapon', name: "Turquoise Lord's Fire Blade",
    lore: "He is the old god, the fire deity, the center of the universe in Aztec cosmology. He is turquoise because fire is all colors. The New Fire ceremony that prevented the world from ending was held in his honor.",
    tier: 'deity', slot: 'weapon', deityId: 'xiuhtecuhtli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Every 52 years the Aztecs extinguished all fires to wait and see if the sun would rise. If it did, I gave permission to relight the fires. The New Fire. My blade goes to those who complete the cycle: complete 52 dungeon runs lifetime — started and played to conclusion (Floor 5 reached or death). The New Fire is lit. The world continues.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 52, targetType: 'fifty_two_dungeon_runs_completed', description: 'Complete 52 dungeon runs lifetime (Floor 5 reached or died trying in each)' },
    ]},
    passiveId: 'xiuhtecuhtli_blade_passive',
    passiveDescription: "New Fire Ceremony: at the start of each dungeon run, gain a 'New Fire' bonus — +10% damage for the first 5 floors. The turquoise lord's blessing on the newly lit fire is always strongest at the beginning.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'STR', finalDamage: 52, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_xiuhtecuhtli_accessory', name: "Xiuhcoatl Turquoise Serpent",
    lore: "The Xiuhcoatl is the fire serpent — Xiuhtecuhtli's weapon-form. It is the vehicle of the sun's daily journey, the lightning bolt made serpent-shaped.",
    tier: 'deity', slot: 'accessory', deityId: 'xiuhtecuhtli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The center of the universe burns constantly. My serpent goes to those who maintain constant fire: inflict Burn status effect in every combat room on 3 consecutive floors in a single run. Three floors where fire spreads to every room. The fire serpent flies through all of them.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 1, targetType: 'burn_in_every_room_three_consecutive_floors', description: 'Apply Burn in every combat room across 3 consecutive floors in one run' },
    ]},
    passiveId: 'xiuhtecuhtli_serpent_passive',
    passiveDescription: "Turquoise Serpent: Burn effects last 1 extra turn. Additionally: when an enemy dies while Burning, their death triggers a chain — adjacent enemies take 15% of the burn tick damage instantly (the fire serpent spreads through the crowd).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { INT: 24, STR: 18, AGI: 16 } },
  },
};

const XOCHIQUETZAL_RELICS: DeityRelicPair = {
  deityId: 'xochiquetzal',
  weapon: {
    id: 'deity_xochiquetzal_weapon', name: "Flower Arrow of the Goddess",
    lore: "She is the goddess of beauty, flowers, art, and sexuality. She was the first woman, taken from the underworld by Tezcatlipoca. Every flower bloomed for her. This arrow was made from the first rose thorn.",
    tier: 'deity', slot: 'weapon', deityId: 'xochiquetzal',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the first woman, the most beautiful, the one that even gods fought to possess. My arrow goes to those whose charm has been proven beyond doubt: use Taunt successfully 50 times total across your lifetime. Every successful taunt is a flower bloomed. When the garden reaches fifty blooms, the arrow finds you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 50, targetType: 'successful_taunts', description: 'Use Taunt successfully 50 times lifetime' },
    ]},
    passiveId: 'xochiquetzal_arrow_passive',
    passiveDescription: "Flower's Beauty: enemies who have been Taunted this combat deal -25% damage (they are distracted by the goddess's beauty). Additionally: the first Taunt in any combat always succeeds — no failure chance on the opening charm.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 42, finalAccuracy: 95, finalCritChance: 0.30, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_xochiquetzal_accessory', name: "Quetzal Feather Crown",
    lore: "She wears quetzal feathers and marigolds. The quetzal was sacred, its feathers rare. She wore them because no one would forbid her.",
    tier: 'deity', slot: 'accessory', deityId: 'xochiquetzal',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Beauty opens every door. My crown goes to those whose charm makes the Tower less hostile: succeed in every event room in a single run reaching Floor 10 — not most events, but every event that offers a choice. The goddess of beauty finds favor in every encounter.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'event_success', value: 4, targetType: 'all_events_succeeded', description: 'Succeed in every event room entered (at least 4) in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'xochiquetzal_crown_passive',
    passiveDescription: "Beauty's Gateway: CHA-based event outcomes are always the best available result. Additionally: Taunt costs 0 SP for 3 turns after a successful event (the goddess's charm is recharged by recognition).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 28, LCK: 20 } },
  },
};

const XOCHIPILLI_RELICS: DeityRelicPair = {
  deityId: 'xochipilli',
  weapon: {
    id: 'deity_xochipilli_weapon', name: "Flower Prince's Ceremonial Blade",
    lore: "He is the prince of flowers, the god of art, games, beauty, dance, and flowers. He sits in eternal trance on his throne covered in carved butterflies and flowers. He is the happiest of gods.",
    tier: 'deity', slot: 'weapon', deityId: 'xochipilli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am joy. Pure, elevated, eternal joy. My blade goes to those who find joy in exploration — not conquest: in a single run reaching Floor 10, enter every mystery room available and every event room on every floor. Not fight through them — experience them. The Flower Prince is pleased by every discovery, regardless of outcome.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 4, description: 'Enter 4+ mystery rooms in one run' },
      { metric: 'event_success', value: 4, description: 'Enter 4+ event rooms in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'xochipilli_blade_passive',
    passiveDescription: "Prince's Joy: after any non-combat room (mystery, event, treasure, rest), gain +20% damage on the next combat (the joy of discovery translates to battle vigor). This does not stack — resets with each non-combat room.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'CHA', finalDamage: 42, finalAccuracy: 92, finalCritChance: 0.32, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_xochipilli_accessory', name: "Butterfly Dance Anklet",
    lore: "The carved butterflies on his throne represent the souls of the dead who died in the sun's service. They dance around him eternally in joy.",
    tier: 'deity', slot: 'accessory', deityId: 'xochipilli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Dance and art require practice. Joy requires repetition. My anklet goes to those who dance often: complete 25 mystery rooms across your lifetime. Each mystery room is a dance with the unknown. Twenty-five dances. The Flower Prince watches each one and will send the anklet when the twenty-fifth is finished.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 25, description: 'Complete 25 mystery rooms lifetime' },
    ]},
    passiveId: 'xochipilli_anklet_passive',
    passiveDescription: "Butterfly Blessing: mystery rooms are always the highest possible reward tier (the Flower Prince blesses those who dance with the unknown). Additionally: +15% LCK effective value for all luck-based calculations.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 30, CHA: 18 } },
  },
};

const TLAZOLTEOTL_RELICS: DeityRelicPair = {
  deityId: 'tlazolteotl',
  weapon: {
    id: 'deity_tlazolteotl_weapon', name: "Purification-Through-Sin Blade",
    lore: "She is the goddess of filth and purification — she eats sins in the final confession before death, purifying the soul. Sin-eater and sin-creator in one.",
    tier: 'deity', slot: 'weapon', deityId: 'tlazolteotl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I eat sins. I am the one confessed to in the moment before death. My blade goes to those who have sinned and been purified by consequence: receive 5 or more status effects in a single run AND still complete the run reaching Floor 10. The sins (status effects) were eaten by your survival. The filth was purified by the act of continuing despite it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, description: 'Receive 5 status effects in one run' },
      { metric: 'floors_reached', value: 10, description: 'Still reach Floor 10' },
    ]},
    passiveId: 'tlazolteotl_blade_passive',
    passiveDescription: "Sin Eater: when a status effect on you expires naturally, restore 12 HP (the sin is eaten and you are purified by the experience). The more status effects you endure to completion, the more total restoration you receive.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_tlazolteotl_accessory', name: "Deathbed Confession Token",
    lore: "Only at the moment of death could one confess to Tlazolteotl. The confession was total — everything. The token is a priest's record of the most complete confession ever received.",
    tier: 'deity', slot: 'accessory', deityId: 'tlazolteotl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The deathbed confession requires proximity to death. My token goes to those who have made the confession honest: in a single combat, survive having your HP drop to below 5% and then win the fight without using any healing items. The confession at the threshold. Survive it without external help. The sin-eater only accepts confessions made in true extremity.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'hp_below_5pct_survived_no_heal_items', description: 'HP drops below 5% in one combat, survive without healing items' },
    ]},
    passiveId: 'tlazolteotl_token_passive',
    passiveDescription: "Purified by Extremity: when HP drops below 20%, deal +25% damage (the purification in extremity focuses the attack). When HP is above 80%, deal +10% damage (the clean state is blessed). The sin-eater goddess rewards both extremes.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 26, WIS: 20, INT: 12 } },
  },
};

const COATLICUE_RELICS: DeityRelicPair = {
  deityId: 'coatlicue',
  weapon: {
    id: 'deity_coatlicue_weapon', name: "Earth Mother's Serpent Skirt Blade",
    lore: "She gave birth to the stars, the moon, and Huitzilopochtli. Her skirt is made of serpents. Her necklace is made of hands, hearts, and a skull. She is the most terrifying mother in mythology.",
    tier: 'deity', slot: 'weapon', deityId: 'coatlicue',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the mother of everything that kills and is killed. My blade goes to those who demonstrate the earth mother's terrible completeness: kill 400 enemies total across your lifetime. Not a specific type — all kinds. Every death feeds the earth. Every kill is returned to my serpent skirt.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 400, description: 'Kill 400 enemies total lifetime' },
    ]},
    passiveId: 'coatlicue_blade_passive',
    passiveDescription: "Serpent Mother's Embrace: +1 flat damage for every 50 enemies killed with this weapon (permanent, carries across runs, max +30 at 1500 kills). The earth mother's power grows with every life returned to her.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 48, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_coatlicue_accessory', name: "Skull Necklace of the Earth",
    lore: "Her necklace of hearts, hands, and a skull. The skull is the last link in the chain. This is that skull, reduced to amulet size.",
    tier: 'deity', slot: 'accessory', deityId: 'coatlicue',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My necklace counts the cost of creation. I wear it because I know the full accounting. My skull goes to those who have died and fully accepted that cost: have 7 total character deaths across your lifetime. Seven deaths. Seven skulls for the necklace. The earth mother does not grieve what returns to her. She collects.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 7, targetType: 'seven_character_deaths_lifetime', description: '7 total character deaths across all characters lifetime' },
    ]},
    passiveId: 'coatlicue_skull_passive',
    passiveDescription: "Skull Collection: for each character death in your account history, gain +4% damage on the current character (max +40% from 10 deaths). The necklace grows heavier — and the bearing of it grows stronger.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 26, STR: 20, WIS: 12 } },
  },
};

const XOLOTL_RELICS: DeityRelicPair = {
  deityId: 'xolotl',
  weapon: {
    id: 'deity_xolotl_weapon', name: "Lightning Dog's Escort Blade",
    lore: "Xolotl is the dog-god who accompanies the dead through the underworld. He is also the god of lightning, twins, deformity, and monsters. He guided the dead across the dangerous waters.",
    tier: 'deity', slot: 'weapon', deityId: 'xolotl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guide the dead safely. Without me, the dead wander lost. My blade goes to those who guide themselves faithfully through the deepest dark: in a single run, reach Floor 20 using only basic attacks — no skills. Guide yourself by the most fundamental path. The dog-god knows the underworld requires no cleverness, only faithful forward movement.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'skill_uses', value: 0, description: 'Zero skills used the entire run' },
    ]},
    passiveId: 'xolotl_blade_passive',
    passiveDescription: "Faithful Guide: basic attacks deal +30% damage (the dog-god empowers the fundamental strike). Additionally: the first basic attack in every combat is always a critical hit — the guide's first step is always true.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'LCK', finalDamage: 50, finalAccuracy: 95, finalCritChance: 0.32, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_xolotl_accessory', name: "Hairless Dog Companion Token",
    lore: "The Xoloitzcuintli dog was buried with the dead to guide them. The token is a collar-tag from such a dog, carried back from Mictlan.",
    tier: 'deity', slot: 'accessory', deityId: 'xolotl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My dogs guide the dead through nine levels of the underworld. Nine is the sacred number. My token goes to those who have descended through nine complete floors in a single run — reach Floor 9 or deeper. Nine floors with the dog-god beside you, guiding every step. The ninth level is where the dog's guidance ends and the final rest begins.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 9, description: 'Reach Floor 9 or deeper in one run' },
    ]},
    passiveId: 'xolotl_token_passive',
    passiveDescription: "Dog's Guidance: on floors 5+ (the deep underworld), gain +15% evasion (the dog knows these depths and steers you away from the worst). Additionally: once per run, when HP drops to exactly 1, the dog intervenes — restore 20% max HP.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { AGI: 24, LCK: 22, END: 12 } },
  },
};

const MAYAHUEL_RELICS: DeityRelicPair = {
  deityId: 'mayahuel',
  weapon: {
    id: 'deity_mayahuel_weapon', name: "Four-Hundred Rabbit Maguey Blade",
    lore: "She is the goddess of the maguey plant from which pulque is made. The four hundred rabbits (Centzon Totochtin) are her children — each representing a different kind of drunkenness.",
    tier: 'deity', slot: 'weapon', deityId: 'mayahuel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My children are four hundred rabbits, each embodying a different intoxication. My blade goes to those who have experienced the full range of the Tower's afflictions: have every type of status effect in the game inflicted on you at least once across your lifetime. The full palette of the maguey's intoxications. Every rabbit's gift experienced.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 8, targetType: 'all_status_types_received_ever', description: 'Have every available status effect type inflicted on you at least once lifetime' },
    ]},
    passiveId: 'mayahuel_blade_passive',
    passiveDescription: "Four Hundred Rabbits: when you have 3+ different status effects on you simultaneously, your attacks deal +15% chaos damage as a bonus type. The intoxications of Mayahuel blend into chaotic strength.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'LCK', finalDamage: 44, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_mayahuel_accessory', name: "Pulque Blessing Vessel",
    lore: "Pulque was the sacred drink of Aztec ritual — sacred to specific deities and dangerous when misused. The vessel holds the first pulque ever fermented from the maguey heart.",
    tier: 'deity', slot: 'accessory', deityId: 'mayahuel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The maguey provides drink, fiber, and sweetness. Every part is useful. My vessel goes to those who use every part of the Tower's provision: in a single run reaching Floor 8, use at least one of every consumable category available — healing, SP restoration, offensive, and status-curing. The maguey plant wastes nothing. Neither should those who seek my vessel.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floor_noconsumable', value: 0, targetType: 'use_all_consumable_categories', description: 'Use at least one consumable from every category (healing, SP, offensive, cure) in one run' },
      { metric: 'floors_reached', value: 8, description: 'Reach Floor 8' },
    ]},
    passiveId: 'mayahuel_vessel_passive',
    passiveDescription: "Maguey's Provision: consumable effects are +25% more potent (the blessing of the maguey goddess amplifies all that grows from the earth's sweetness). Additionally: after using any consumable, restore 5 SP — the maguey provides for all needs.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 22, LCK: 20, WIS: 16 } },
  },
};

export const AZTEC_REMAINING_RELICS: DeityRelicPair[] = [
  XIPE_TOTEC_RELICS, TLALOC_RELICS, TONATIUH_RELICS, CHALCHIUHTLICUE_RELICS,
  XIUHTECUHTLI_RELICS, XOCHIQUETZAL_RELICS, XOCHIPILLI_RELICS, TLAZOLTEOTL_RELICS,
  COATLICUE_RELICS, XOLOTL_RELICS, MAYAHUEL_RELICS,
];
