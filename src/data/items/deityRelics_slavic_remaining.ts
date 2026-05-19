/**
 * Slavic Deity Relics — Remaining deities not in deityRelics_south.ts
 * Dazhbog, Stribog, Marzanna, Rod, Lada, Chernobog, Belobog, Jarilo, Simargl, Zorya, Triglav
 */

import type { DeityRelicPair } from './deityRelics';

const DAZHBOG_RELICS: DeityRelicPair = {
  deityId: 'dazhbog',
  weapon: {
    id: 'deity_dazhbog_weapon', name: "Sun Wheel Blade",
    lore: "Dazhbog is the giving god, the sun god who distributes wealth and good fortune. His sun wheel rides across the sky each day providing all things.",
    tier: 'deity', slot: 'weapon', deityId: 'dazhbog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I give. I distribute. My sun wheel provides all that is needed to those who receive it honestly. My blade goes to those who demonstrate honest accumulation: accumulate 25,000 gold across your lifetime AND spend 10,000 of it at shops (not blacksmith). Give as you receive. The giving god distributes to those who also distribute.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 25000, description: 'Accumulate 25,000 total gold lifetime' },
      { metric: 'custom', value: 10000, targetType: 'gold_spent_shops_lifetime', description: 'Spend 10,000 gold at shops lifetime' },
    ]},
    passiveId: 'dazhbog_blade_passive',
    passiveDescription: "Giving God's Generosity: +3% damage for every 1,000 gold currently held (max +30% at 10,000 gold). The sun's wealth translates directly to the sun's power.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 93, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_dazhbog_accessory', name: "Golden Herd Pendant",
    lore: "He owns the golden horses that pull the sun chariot and the golden cattle that produce amber and gold. The pendant is amber from those cattle.",
    tier: 'deity', slot: 'accessory', deityId: 'dazhbog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Prosperity flows in cycles like the sun. My pendant goes to those who demonstrate the complete cycle: complete 10 runs lifetime reaching Floor 5 or deeper, regardless of outcome. The sun rises ten times. Each run is a cycle. The herd grazes and returns regardless of what the day held.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_runs_floor5_any_outcome', description: 'Complete 10 dungeon runs reaching Floor 5+ lifetime (any outcome)' },
    ]},
    passiveId: 'dazhbog_pendant_passive',
    passiveDescription: "Sun Cycle Bonus: gold earned this run is +20% more. After completing 5 consecutive floors without dying, gain an additional +10% gold multiplier for the rest of the run (the full sun cycle maximizes the bounty).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { LCK: 26, CHA: 18, END: 14 } },
  },
};

const STRIBOG_RELICS: DeityRelicPair = {
  deityId: 'stribog',
  weapon: {
    id: 'deity_stribog_weapon', name: "Ancestor Wind Blade",
    lore: "Stribog is the god of winds and storms, the grandfather of all winds. His grandsons are the eight wind spirits that blow from every direction.",
    tier: 'deity', slot: 'weapon', deityId: 'stribog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My grandsons blow from all eight directions. There is no escape from my wind family. My blade goes to those who evade what cannot be evaded: dodge 30 attacks total across your lifetime. Not avoid — specifically dodge, where the evasion mechanic triggers. The wind surrounds. The skilled warrior moves through the wind's gaps.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'dodges_total', value: 30, description: 'Dodge 30 attacks total lifetime' },
    ]},
    passiveId: 'stribog_blade_passive',
    passiveDescription: "Ancestor Wind: after each successful dodge, the next attack deals +25% damage (the wind redirected becomes the strike's power). Additionally: AGI grants +1.5% evasion per grade level instead of the standard +1%.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 44, finalAccuracy: 96, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_stribog_accessory', name: "Eight-Winds Compass Charm",
    lore: "Eight grandsons, eight directions, one grandfather. The compass shows all eight and points to none — the wind god goes everywhere.",
    tier: 'deity', slot: 'accessory', deityId: 'stribog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wind fills everything. It comes from every direction. My charm goes to those who have explored all directions: in a single run reaching Floor 10, visit every room type available — combat, elite, mystery, event, treasure, rest site. All of them in one run. The wind does not favor one direction. Neither should the one who seeks my charm.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 1, description: 'Visit at least 1 mystery room' },
      { metric: 'event_success', value: 1, description: 'Visit at least 1 event room' },
      { metric: 'treasure_rooms', value: 1, description: 'Visit at least 1 treasure room' },
      { metric: 'rest_sites_used', value: 1, description: 'Use at least 1 rest site' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'stribog_compass_passive',
    passiveDescription: "All-Direction Wind: on every floor you descend to, evasion is +5% higher for the first combat (the wind scout has scouted all directions). After 5 different room types visited in a run, gain +10% permanent damage bonus for that run.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { AGI: 24, PER: 20, LCK: 14 } },
  },
};

const MARZANNA_RELICS: DeityRelicPair = {
  deityId: 'marzanna',
  weapon: {
    id: 'deity_marzanna_weapon', name: "Winter Death Effigy Blade",
    lore: "She is drowned and burned each spring to end winter — the ritual effigy of Marzanna is thrown into the river every year to make spring possible. She does not take offense. She has to end.",
    tier: 'deity', slot: 'weapon', deityId: 'marzanna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am drowned every year. Burned. My effigy destroyed so that spring can come. And yet I return. Every winter, I return. My blade goes to those who demonstrate the same cycle: die 3 times lifetime on floors 5-15 specifically — not before Floor 5, not after Floor 15. Three winter drownings at the depths of the Tower's river. Then the blade washes ashore.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'die_on_floors_5_to_15_three_times', description: 'Die on Floors 5-15 in 3 different runs lifetime' },
    ]},
    passiveId: 'marzanna_blade_passive',
    passiveDescription: "Winter's Edge: +20% damage against enemies on floors 10-20 (the winter of the Tower, where the cold bites deepest). Additionally: status effects you inflict cannot be cured by the target for their first 2 turns — the winter cannot be thawed immediately.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_marzanna_accessory', name: "Frozen River Reed",
    lore: "The reed she is burned on, then frozen in, then burned again. It does not decay. Only Marzanna persists through her own annual destruction.",
    tier: 'deity', slot: 'accessory', deityId: 'marzanna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Spring requires winter first. My reed goes to those who have properly completed the ritual: in a single run, flee from 5 combats and then, in the same run, defeat a boss. Flee and return. The ritual killing and the spring resurrection. Winter and spring in the same run.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 5, description: 'Flee 5 times in one run' },
      { metric: 'boss_kills_run', value: 1, description: 'Still defeat a boss in that run' },
    ]},
    passiveId: 'marzanna_reed_passive',
    passiveDescription: "Death and Return: each time you flee a combat in a run, your HP regenerates 10% at the start of the next combat (Marzanna's drowning and return grants recovery). After 3 flee-and-return cycles, the regeneration increases to 20%.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 22, END: 22 } },
  },
};

const ROD_RELICS: DeityRelicPair = {
  deityId: 'rod',
  weapon: {
    id: 'deity_rod_weapon', name: "Fate-Carver's Staff",
    lore: "Rod is the creator deity, the fate-weaver, the god of family and generation. He carved the destinies of all living things before the world began.",
    tier: 'deity', slot: 'weapon', deityId: 'rod',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I carved your fate before your birth. But fate is not fixed — it is written in proportion to what you do with it. My staff goes to those who have demonstrated the full arc of what I carved: reach Level 10 Paragon on any character. The carved fate completed. The staff recognizes the soul that has walked the full distance of what was written.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon on any character' },
    ]},
    passiveId: 'rod_staff_passive',
    passiveDescription: "Fated Strike: once per run, the first attack you make is guaranteed to deal maximum possible damage (the fate-carver's moment of perfection). Additionally: level-based stat bonuses are +10% more effective — the carved fate provides more than its base inscription.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_rod_accessory', name: "Ancestral Rod Amulet",
    lore: "The family line is sacred to Rod. Every ancestor feeds the current generation. The amulet carries the compressed weight of lineage.",
    tier: 'deity', slot: 'accessory', deityId: 'rod',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The family line extends backward and forward. My amulet goes to those who have created family through repeated returns: create 3 characters across your lifetime, and have all 3 reach Level 2. Not survive — reach Level 2. Three generations. Three fates carved. The family amulet goes to those who have made the line.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_characters_each_reached_level_2', description: 'Create 3 characters lifetime, each reaching Level 2' },
    ]},
    passiveId: 'rod_amulet_passive',
    passiveDescription: "Ancestral Strength: for each previous character you have played (created and reached Level 2 or beyond), gain +3% permanent damage on the current character (ancestral line feeds the present). Maximum +24% from 8 prior characters.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 22, WIS: 20, CHA: 16 } },
  },
};

const LADA_RELICS: DeityRelicPair = {
  deityId: 'lada',
  weapon: {
    id: 'deity_lada_weapon', name: "Love-Harmony Blade",
    lore: "Lada is the goddess of beauty, love, spring, and marriage. She and her male counterpart Lad are sung about in Slavic folk songs to this day.",
    tier: 'deity', slot: 'weapon', deityId: 'lada',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am harmony. I am the joining of what fits together. My blade goes to those who demonstrate harmony in their approach: in a single run reaching Floor 10, have your highest stat and second-highest stat both at grade B or higher. Not one dominant stat — two elevated ones. Harmony is not maximum in one domain. It is balance at height.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'stats_grade', value: 1, targetType: 'two_stats_grade_B_or_higher', description: 'Two different stats at grade B or higher simultaneously' },
    ]},
    passiveId: 'lada_blade_passive',
    passiveDescription: "Spring Harmony: when your two highest stats are within 2 grade steps of each other (e.g., both A and B), deal +20% damage — balanced excellence empowers more than singular focus.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 42, finalAccuracy: 94, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_lada_accessory', name: "Spring Flower Wreath",
    lore: "Lada's wreath is woven on Midsummer's Day and set floating on water. Those who receive it receive her blessing. The wreath has been floating for centuries.",
    tier: 'deity', slot: 'accessory', deityId: 'lada',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Love and beauty bring warmth even to cold places. My wreath goes to those who have spread warmth: succeed in every CHA-based event check in a single run reaching Floor 10. Not most — every one. Love does not partially succeed. Every interaction that required your charm must be resolved beautifully.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'event_success', value: 1, targetType: 'all_cha_events_success', description: 'All CHA-based event checks succeeded this run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'lada_wreath_passive',
    passiveDescription: "Beauty's Blessing: CHA stat is counted as 10 effective points higher for all calculations. Additionally: the first event room on each floor always offers a positive, non-combat option — love opens doors.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 30, LCK: 18 } },
  },
};

const CHERNOBOG_RELICS: DeityRelicPair = {
  deityId: 'chernobog',
  weapon: {
    id: 'deity_chernobog_weapon', name: "Black God's Obsidian Mace",
    lore: "The Black God of Slavic mythology — the dark half of the divine. He is the source of all evil and misfortune, the balance to Belobog's light.",
    tier: 'deity', slot: 'weapon', deityId: 'chernobog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the darkness that makes light meaningful. My mace goes to those who embrace the dark path entirely: complete a full run to Floor 15 using only dark-type damage dealing skills and weapons. Not mixed — only dark. Every kill sealed in blackness. The Black God recognizes those who do not dilute his domain with other colors.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'kills_with_stat', value: 50, targetType: 'dark_damage_type_only', description: 'All kills with dark-type damage (no other damage types used)' },
    ]},
    passiveId: 'chernobog_mace_passive',
    passiveDescription: "Black God's Domain: dark-type attacks deal +30% bonus damage. Additionally: enemies on floors 15+ take +15% extra dark damage — the deeper the darkness, the more the Black God's power resonates.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 52, finalAccuracy: 88, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_chernobog_accessory', name: "Night Feast Token",
    lore: "He is toasted at Slavic feasts to keep him away — a toast of acknowledgment to the Black God ensures he leaves the feast in peace. This token is from such a toast.",
    tier: 'deity', slot: 'accessory', deityId: 'chernobog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am acknowledged in fear, which is a form of respect. My token goes to those whose dark record the Black God acknowledges: inflict a combined total of 100 status effects across your lifetime. Not one type — 100 total inflictions. Every affliction is a piece of my dark gift distributed to the world.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 100, description: 'Inflict any status effects 100 times total lifetime' },
    ]},
    passiveId: 'chernobog_token_passive',
    passiveDescription: "Black God's Favor: dark and chaos type attacks ignore 25% of enemy resistance. Additionally: status effects you inflict have a 20% chance to be doubled in duration — the Black God's curse lingers.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { INT: 26, WIS: 18, END: 14 } },
  },
};

const BELOBOG_RELICS: DeityRelicPair = {
  deityId: 'belobog',
  weapon: {
    id: 'deity_belobog_weapon', name: "White God's Dawn Sword",
    lore: "The White God — the light counterpart to Chernobog. He brings fortune and good things. He is rarely mentioned alone, always in contrast to his dark twin.",
    tier: 'deity', slot: 'weapon', deityId: 'belobog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the light that contrast makes visible. Without Chernobog, I am not understood. My sword goes to those who have stood in the full light and never sought the dark: complete a run to Floor 15 using only holy-type damage. Not a drop of dark or chaos. Only the White God's domain, from start to finish.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'kills_with_stat', value: 30, targetType: 'holy_damage_type_only', description: 'All kills with holy-type damage this run' },
    ]},
    passiveId: 'belobog_sword_passive',
    passiveDescription: "White God's Domain: holy-type attacks deal +25% bonus damage. At the start of each run, gain a White God's Blessing: first floor bonus +10% damage that decays by 1% per floor (most powerful at Floor 1, still +5% at Floor 5).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 95, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_belobog_accessory', name: "Fortune's Light Bead",
    lore: "He brings prosperity through light. Where he walks, things go well. This bead carries that specific kind of going-well energy.",
    tier: 'deity', slot: 'accessory', deityId: 'belobog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The White God brings good fortune. To earn my bead: complete 5 runs lifetime where you survived to at least Floor 5 without dying. Five bright runs. Five floors of light. The fortune-bringer gives his bead to those who have walked clean roads without turning toward shadow.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'floors_nodeath', value: 5, description: 'Complete 5 runs reaching Floor 5+ without dying, lifetime' },
    ]},
    passiveId: 'belobog_bead_passive',
    passiveDescription: "White Fortune: at the start of each run, if your last run was a death-free survival to Floor 5+, gain +15% all stats for the first 5 floors of the new run (the White God's continued blessing for consistent light-walking).",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, WIS: 18, CHA: 12 } },
  },
};

const JARILO_RELICS: DeityRelicPair = {
  deityId: 'jarilo',
  weapon: {
    id: 'deity_jarilo_weapon', name: "Spring Youth's Scythe",
    lore: "Jarilo is the god of spring and fertility, the youth who was killed (or taken to the underworld) and then returned — the Slavic equivalent of the dying and rising god cycle.",
    tier: 'deity', slot: 'weapon', deityId: 'jarilo',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I die and I return. Every spring I come back younger than before. My scythe goes to those who demonstrate the return stronger than before: after a character death, create a new character and on that character's first run defeat a boss. Die. Return. Conquer what you faced before. The spring always slays winter.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'first_run_new_character_after_death', description: 'This is a new character\'s first run after a previous character died' },
      { metric: 'boss_kills_run', value: 1, description: 'Defeat at least 1 boss in this run' },
    ]},
    passiveId: 'jarilo_scythe_passive',
    passiveDescription: "Spring's Return: +15% damage in the first 5 floors of any run (the youth's vitality is strongest at the beginning). After defeating the first boss in a run, gain an additional +10% damage for the rest of the run — the returned youth triumphs.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'STR', finalDamage: 46, finalAccuracy: 93, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_jarilo_accessory', name: "Green Wheat Wreath",
    lore: "The green wheat wreath of spring, woven when Jarilo returns. It is burned at the end of summer when he dies again. This one has not yet been burned.",
    tier: 'deity', slot: 'accessory', deityId: 'jarilo',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Youth springs fresh from every ending. My wreath goes to those who refresh most often: begin your first dungeon run of 5 different calendar days, lifetime. Not one session — five different days where you started a new run. The spring returns daily. Show me you return daily.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'start_run_on_five_different_calendar_days', description: 'Start dungeon runs on 5 different calendar days lifetime' },
    ]},
    passiveId: 'jarilo_wreath_passive',
    passiveDescription: "Spring Renewal: at the start of each dungeon run, restore +10% max HP (the spring youth refreshes what winter took). Additionally: the first enemy killed each floor drops +50% gold — the spring harvest always opens strong.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { AGI: 22, END: 20, LCK: 16 } },
  },
};

const SIMARGL_RELICS: DeityRelicPair = {
  deityId: 'simargl',
  weapon: {
    id: 'deity_simargl_weapon', name: "Sacred Plant Fire Blade",
    lore: "Simargl is the winged dog of Slavic mythology — guardian of the sacred plant, the link between heaven and earth, the spirit that watches over seeds and sprouts.",
    tier: 'deity', slot: 'weapon', deityId: 'simargl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guard what grows between earth and sky. The sacred plant is mine to protect. My blade goes to those who prove they guard what they protect: complete a run to Floor 10 without letting your HP drop below 30% at any point. Guard your vitality as I guard the sacred plant. What is precious must not be allowed to wither.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 30, targetType: 'hp_never_below_30pct_entire_run', description: 'HP never drops below 30% at any point this run' },
    ]},
    passiveId: 'simargl_blade_passive',
    passiveDescription: "Sacred Guard: while above 50% HP, deal +15% damage (the guardian is strongest when most intact). When HP drops to exactly 50%, immediately gain +10% damage reduction for 3 turns — the winged guardian spreads its wings at the threshold.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.24, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_simargl_accessory', name: "Winged Dog Amulet",
    lore: "Simargl runs between the world tree and the ground, between spirit and earth. The amulet carries his tracks.",
    tier: 'deity', slot: 'accessory', deityId: 'simargl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I travel between worlds constantly. Guardian and messenger. My amulet goes to those who prove they can traverse all room types without harm: in a single run reaching Floor 8, successfully complete every non-combat room you enter — mystery rooms, event rooms, treasure rooms, rest sites — without any negative outcome. The guardian passes through safely.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 2, description: 'Complete 2+ mystery rooms with no negative outcomes' },
      { metric: 'event_success', value: 2, description: 'Complete 2+ events successfully' },
      { metric: 'floors_reached', value: 8, description: 'Reach Floor 8' },
    ]},
    passiveId: 'simargl_amulet_passive',
    passiveDescription: "Between Worlds: after any non-combat room (mystery, event, treasure, rest), gain +15% damage for the first combat on the same floor (the sacred guardian transitions smoothly between realms). This bonus does not carry across floors.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 20, END: 20, AGI: 18 } },
  },
};

const ZORYA_RELICS: DeityRelicPair = {
  deityId: 'zorya',
  weapon: {
    id: 'deity_zorya_weapon', name: "Dawn-Dusk Twin Blade",
    lore: "The Zorya are two (sometimes three) goddesses of dawn and dusk. They open and close the palace gates for the sun god's chariot horses. The evening star and the morning star in female form.",
    tier: 'deity', slot: 'weapon', deityId: 'zorya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "We are the dawn and the dusk — the gates that open the day and close it. My twin blade goes to those who demonstrate the full cycle: in a single run, defeat a boss as your first combat of the run AND defeat a different boss as your last combat before reaching Floor 20. Gate-opening and gate-closing combat in the same journey.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 2, description: 'Defeat 2 different bosses in one run' },
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
    ]},
    passiveId: 'zorya_blade_passive',
    passiveDescription: "Dawn and Dusk: +20% damage on the first combat of each floor (dawn blessing). +20% damage on the last combat before descending from each floor (dusk blessing). The twin guardians empower the transitions.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 94, finalCritChance: 0.30, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_zorya_accessory', name: "Doomsday Chain of Ursa Minor",
    lore: "One of the Zorya's duties is to keep the doomsday hound Simargl (different from the other Simargl) chained to Ursa Minor. When the chain breaks, the world ends. It has not broken yet.",
    tier: 'deity', slot: 'accessory', deityId: 'zorya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The chain must hold. We hold it every night. My chain goes to those who prove they can hold what must not break: complete 3 separate runs where you did not die, reached Floor 5+, AND used the Defend action at least once per run. Guard. Hold. The chain is kept by vigilance.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_runs_no_death_floor5_defend_used', description: 'Complete 3 runs: no death, Floor 5+, and Defend used at least once per run, lifetime' },
    ]},
    passiveId: 'zorya_chain_passive',
    passiveDescription: "Watchful Guardians: using Defend in a combat triggers the Zorya's blessing — the attack you next receive deals -30% damage (dawn-dusk protection). This applies to the first defended attack after each Defend use.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 24, WIS: 22, AGI: 12 } },
  },
};

const TRIGLAV_RELICS: DeityRelicPair = {
  deityId: 'triglav',
  weapon: {
    id: 'deity_triglav_weapon', name: "Three-Headed Judgment Staff",
    lore: "Triglav is the three-headed Slavic deity whose three faces see past, present, and future. His eyes are bound so he does not destroy what he sees with the weight of total knowledge.",
    tier: 'deity', slot: 'weapon', deityId: 'triglav',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My three heads see all time. Past — what has been done. Present — what is being done. Future — what will be done. My staff goes to those who demonstrate temporal awareness: in a single run reaching Floor 15, use skills from each type at least 30 times each — physical (past), magic (present), support (future). Thirty observations across all three heads of time.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 30, targetType: 'physical_skills_30', description: 'Use 30 physical skills in one run' },
      { metric: 'skill_uses', value: 30, targetType: 'magic_skills_30', description: 'Use 30 magic skills in one run' },
      { metric: 'skill_uses', value: 30, targetType: 'support_skills_30', description: 'Use 30 support skills in one run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
    ]},
    passiveId: 'triglav_staff_passive',
    passiveDescription: "Three Heads of Time: when you have used all 3 skill types in a single combat, you deal +20% damage for the rest of that combat — all three heads of Triglav are aligned. Additionally: Observe reveals 2 turns of enemy actions instead of the current 1.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_triglav_accessory', name: "Bound-Eyes Oracle Token",
    lore: "His eyes are bound because the full weight of all-time knowledge would destroy what it falls on. The token is the golden band that keeps his gaze contained.",
    tier: 'deity', slot: 'accessory', deityId: 'triglav',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Total knowledge is contained because it would destroy what it illuminates. My token goes to those who demonstrate they know when NOT to look: complete a run from Floor 1 to Floor 10 with zero Observe actions. The three-headed one who binds his own eyes proves the wisdom of selective knowledge. Fight without looking. Trust the past, act in the present.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'observe_total', value: 0, description: 'Zero Observe actions the entire run' },
    ]},
    passiveId: 'triglav_token_passive',
    passiveDescription: "Bound Vision: when you do NOT Observe before attacking in a combat, deal +15% damage on that first attack (the unobserved strike carries Triglav's blindfolded power). Against observed enemies, this bonus does not apply — the bound gaze is the advantage.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 26, INT: 20, PER: 12 } },
  },
};

export const SLAVIC_REMAINING_RELICS: DeityRelicPair[] = [
  DAZHBOG_RELICS, STRIBOG_RELICS, MARZANNA_RELICS, ROD_RELICS, LADA_RELICS,
  CHERNOBOG_RELICS, BELOBOG_RELICS, JARILO_RELICS, SIMARGL_RELICS, ZORYA_RELICS, TRIGLAV_RELICS,
];
