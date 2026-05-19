/**
 * South/Americas Deity Relics — Hindu, Slavic (non-boss), and Aztec pantheons
 */

import type { DeityRelicPair } from './deityRelics';

// ===== HINDU =====

const SHIVA_RELICS: DeityRelicPair = {
  deityId: 'shiva',
  weapon: {
    id: 'deity_shiva_weapon', name: "Trishula of Destruction",
    lore: "He dances the universe into destruction. The trishula is the accent on the dance.",
    tier: 'deity', slot: 'weapon', deityId: 'shiva',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I destroy so the universe can be remade. My trishula goes to those who embrace destruction: die 3 times total lifetime AND reach Floor 10 on the character after the third death. Destroy the self. The next dance begins.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'three_deaths_then_floor10', description: '3 character deaths lifetime, then reach Floor 10 on the next character' },
    ]},
    passiveId: 'shiva_trishula_passive',
    passiveDescription: "Destroyer's Dance: when your HP drops below 25%, release a destruction pulse — all enemies take 25% of their max HP as damage and are stunned for 1 turn. Shiva dances at the edge of oblivion.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'chaos' },
  },
  accessory: {
    id: 'deity_shiva_accessory', name: "Third Eye of Shiva",
    lore: "When he opens the third eye, whatever he looks at is destroyed. He keeps it closed. Usually.",
    tier: 'deity', slot: 'accessory', deityId: 'shiva',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The third eye is annihilation focused into a point. My eye goes to those who can deliver such focus: deal a single hit of 150+ damage in one combat. Once. One massive hit. The third eye opens only once.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'sp_damage_dealt', value: 150, targetType: 'single_hit_150_plus', description: 'Deal 150+ damage in a single hit' },
    ]},
    passiveId: 'shiva_eye_passive',
    passiveDescription: "Third Eye Focus: once per combat, open the third eye — all your damage this turn is concentrated into a single attack dealing triple damage. The eye closes immediately after.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 28, INT: 20 } },
  },
};

const VISHNU_RELICS: DeityRelicPair = {
  deityId: 'vishnu',
  weapon: {
    id: 'deity_vishnu_weapon', name: "Sudarshana Chakra",
    lore: "The spinning discus weapon of Vishnu. It always returns to his hand. It always hits what it's aimed at.",
    tier: 'deity', slot: 'weapon', deityId: 'vishnu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I preserve the universe through my avatars. My Chakra goes to those who preserve others: use healing skills or consumables to save yourself from death (prevent a killing blow) at least 5 times lifetime. Preserve the self. Then preserve what matters.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 5, targetType: 'prevented_killing_blow', description: 'Prevent a killing blow with a heal 5 times lifetime (below 10% HP, then heal to safety)' },
    ]},
    passiveId: 'vishnu_chakra_passive',
    passiveDescription: "Sudarshana Returns: ranged attacks never miss and always return — on critical hits, the chakra bounces to a second target for 50% of the original damage.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'PER', finalDamage: 48, finalAccuracy: 110, finalCritChance: 0.28, range: 'ranged', damageType: 'holy', neverMisses: true },
  },
  accessory: {
    id: 'deity_vishnu_accessory', name: "Kaustubha Gem",
    lore: "The Kaustubha rests on Vishnu's chest. It emerged from the churning of the cosmic ocean.",
    tier: 'deity', slot: 'accessory', deityId: 'vishnu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I take avatars to restore cosmic balance. My gem goes to those who understand the importance of preservation: complete 10 runs reaching Floor 10 or beyond lifetime — regardless of how those runs ended. 10 descents that went deep enough to matter.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_runs_floor10_plus', description: '10 dungeon runs reaching Floor 10+ lifetime' },
    ]},
    passiveId: 'vishnu_gem_passive',
    passiveDescription: "Cosmic Preservation: when your HP drops below 20%, gain a divine shield absorbing the next 3 incoming hits (Vishnu's avatar form). Shield has a 5-floor cooldown.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 26, WIS: 22 } },
  },
};

const BRAHMA_RELICS: DeityRelicPair = {
  deityId: 'brahma',
  weapon: {
    id: 'deity_brahma_weapon', name: "Creator's Lotus Staff",
    lore: "He emerged from a lotus growing from Vishnu's navel. He creates. He does not fight. The staff disagrees.",
    tier: 'deity', slot: 'weapon', deityId: 'brahma',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I created all that exists with four heads facing four directions. My staff goes to those who understand creation requires full perspective: use all 4 different stat-scaling weapon types (STR, AGI, INT, WIS) across 4 different runs lifetime. See from all directions.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 4, targetType: 'four_runs_four_different_scaling_stats', description: '4 runs each using primary weapons of 4 different stat categories (STR/AGI/INT/WIS)' },
    ]},
    passiveId: 'brahma_staff_passive',
    passiveDescription: "Four-Headed Vision: each unique weapon type you have equipped in previous runs adds +5% damage with this weapon (max +20% from 4 types). Creation is informed by all perspectives.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.24, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_brahma_accessory', name: "Four-Vedas Pendant",
    lore: "He authored the four Vedas. The pendant contains a line from each.",
    tier: 'deity', slot: 'accessory', deityId: 'brahma',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Knowledge must be complete. My pendant goes to those who seek it completely: complete full Bestiary entries for 15 different enemy types AND reach Level 4 on the same character. Learn and apply. Creation requires both.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 4, description: 'Reach Level 4' },
      { metric: 'observe_total', value: 15, targetType: 'complete_bestiary_entries', description: 'Complete 15 Bestiary entries on this character' },
    ]},
    passiveId: 'brahma_pendant_passive',
    passiveDescription: "Sacred Knowledge: +15% proficiency gain rate for all stats. Also: all skills cost -10% SP (the Vedas teach efficiency in every practice).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 26, WIS: 22 } },
  },
};

const INDRA_RELICS: DeityRelicPair = {
  deityId: 'indra',
  weapon: {
    id: 'deity_indra_weapon', name: "Vajra (Thunderbolt)",
    lore: "Made from the bones of a sage. Kills demons. One of the first weapons of any mythology.",
    tier: 'deity', slot: 'weapon', deityId: 'indra',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I killed Vritra the great serpent with the Vajra. My weapon goes to those who demonstrate equivalent decisive force: defeat any milestone boss within 3 turns. No hesitation. No attrition. Three turns, boss dead.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Defeat any milestone boss' },
      { metric: 'custom', value: 1, targetType: 'boss_killed_within_3_turns', description: 'Kill the boss within 3 combat turns' },
    ]},
    passiveId: 'indra_vajra_passive',
    passiveDescription: "Thunderbolt: first attack of any combat deals +70% damage. If the enemy is killed on turn 1, restore 15% HP (the Vajra's decisive blow). Indra strikes once and it is enough.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 58, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_indra_accessory', name: "Amaravati Crown",
    lore: "He rules the devas and heaven. The crown establishes jurisdiction.",
    tier: 'deity', slot: 'accessory', deityId: 'indra',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am king of the devas. My crown goes to those who prove dominion: defeat all 5 milestone bosses in a single run. Floor 5, 10, 15, 20, and 25. All five, one run. Demonstrate you rule from one end of the Tower to the other.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 5, description: 'Defeat all 5 milestone bosses in one run' },
    ]},
    passiveId: 'indra_crown_passive',
    passiveDescription: "King of Devas: +10% damage for each milestone boss already defeated in the current run (cumulative: +10% after first boss, +20% after second, up to +50% after fifth). The crown grows heavier with victory.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 25, END: 22 } },
  },
};

const KALI_RELICS: DeityRelicPair = {
  deityId: 'kali',
  weapon: {
    id: 'deity_kali_weapon', name: "Kali's Sword of Time",
    lore: "She drank demon blood to stop the demons from multiplying. She started dancing and couldn't stop until Shiva lay down in her path. She considers this proportionate.",
    tier: 'deity', slot: 'weapon', deityId: 'kali',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am time and destruction. My sword goes to those who embody both: in a single run, kill 50 enemies AND have a negative status effect on yourself for more than half of those fights. Fight while afflicted. Continue while afflicted. Kali dances even in pain.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_total', value: 50, targetType: 'single_run_kills', description: 'Kill 50 enemies in one run' },
      { metric: 'status_received_survived', value: 25, description: 'Have status effects on yourself in 25+ of those fights' },
    ]},
    passiveId: 'kali_sword_passive',
    passiveDescription: "Dance of Destruction: each negative status effect on you adds +8% damage (max +40%). Kali's dance is most powerful in affliction.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 54, finalAccuracy: 88, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_kali_accessory', name: "Skull Garland",
    lore: "She wears 50 skulls. Each skull is a letter of the Sanskrit alphabet. Language and destruction are the same to her.",
    tier: 'deity', slot: 'accessory', deityId: 'kali',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "50 skulls. My garland goes to those who collect 50 confirmed kills using STR-scaling weapons lifetime. Not any kills — STR kills. Strength kills. Collect them.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_with_stat', value: 50, targetType: 'STR', description: 'Kill 50 enemies with STR-scaling weapons lifetime' },
    ]},
    passiveId: 'kali_garland_passive',
    passiveDescription: "Skull Count: this accessory tracks kills. At every 10th kill with it equipped: release a blood surge dealing 40% weapon damage to all enemies. Kali counts.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 28, END: 20 } },
  },
};

const GANESHA_RELICS: DeityRelicPair = {
  deityId: 'ganesha',
  weapon: {
    id: 'deity_ganesha_weapon', name: "Ankusha (Elephant Goad)",
    lore: "He removes obstacles. The goad removes them from his personal path. The distinction matters.",
    tier: 'deity', slot: 'weapon', deityId: 'ganesha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I remove obstacles. My ankusha goes to those who have faced every obstacle and removed them: reach Level 5 on a single character. Five levels means five sets of obstacles cleared. Come to me with cleared paths.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5 on a single character' },
    ]},
    passiveId: 'ganesha_ankusha_passive',
    passiveDescription: "Obstacle Removed: once per floor, automatically open a locked door or bypass a blocked path without cost. Additionally: traps in the dungeon have 50% chance to be revealed before you step on them.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 42, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_ganesha_accessory', name: "Modaka Sweet Charm",
    lore: "His favorite food is modaka (sweet dumplings). His mother gives them to him. He finds this arrangement excellent.",
    tier: 'deity', slot: 'accessory', deityId: 'ganesha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Beginnings require blessings. I am the god of new beginnings. My charm goes to those who begin well: on your first run with any new character, reach Floor 10. First attempts must be blessed. Show me you understand how to start.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'first_run_character_reaches_floor10', description: "Reach Floor 10 on this character's very first dungeon run" },
    ]},
    passiveId: 'ganesha_charm_passive',
    passiveDescription: "Auspicious Beginning: the first combat of any dungeon run deals +30% damage and cannot result in death (Ganesha blesses the opening). You may fall to 1 HP but not 0 HP in the first fight.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, WIS: 18 } },
  },
};

// ===== SLAVIC (non-boss deities) =====

const PERUN_RELICS: DeityRelicPair = {
  deityId: 'perun',
  weapon: {
    id: 'deity_perun_weapon', name: "Storm God's Axe",
    lore: "He fights Veles eternally across the sky. This is the axe he uses for that fight. It is very worn.",
    tier: 'deity', slot: 'weapon', deityId: 'perun',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I fight Veles across the sky eternally. To earn my axe: defeat 3 different milestone bosses in 3 different runs — the eternal fight requires endurance, not the perfection of a single day.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 3, targetType: 'three_different_bosses', description: 'Defeat 3 different milestone bosses across different runs, lifetime' },
    ]},
    passiveId: 'perun_axe_passive',
    passiveDescription: "Eternal Storm: +5% damage for each milestone boss ever defeated on any character (lifetime total, max +25 from 5 bosses). The storm grows with every victory.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 52, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_perun_accessory', name: "Thunder Stone Talisman",
    lore: "The stones Perun throws at Veles. They land and become thunderstones. This one was kept.",
    tier: 'deity', slot: 'accessory', deityId: 'perun',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Thunder strikes from above, unexpectedly. My talisman goes to those who understand sudden decisive force: kill 20 enemies using a critical hit as the killing blow, lifetime. Not just crits — killing crits. The thunderstone ends what it lands on.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 20, targetType: 'kills_by_critical_hit', description: 'Kill 20 enemies where the killing blow was a critical hit, lifetime' },
    ]},
    passiveId: 'perun_stone_passive',
    passiveDescription: "Thunderstone: critical hits deal +40% additional bonus damage (on top of normal crit multiplier). Perun's stone hits harder when it finds the mark.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 24, AGI: 20 } },
  },
};

const VELES_RELICS: DeityRelicPair = {
  deityId: 'veles',
  weapon: {
    id: 'deity_veles_weapon', name: "World Serpent's Staff",
    lore: "He is the serpent god of the underworld, cattle, magic, and wealth. He fights Perun from below. The staff is what he uses from ground level.",
    tier: 'deity', slot: 'weapon', deityId: 'veles',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I dwell below and persist eternally. My staff goes to those who master the arts below the surface: apply 3 different status effects in a single combat AND win. Magic works in all its forms simultaneously when wielded by those who understand the deep currents.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 3, targetType: 'three_different_types_one_combat', description: 'Apply 3 different status effect types in one combat AND win' },
    ]},
    passiveId: 'veles_staff_passive',
    passiveDescription: "Underworld Magic: poison damage +30%. When you apply 3+ different status effects in one combat, all those effects deal +25% extra damage for that combat.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_veles_accessory', name: "Cattle God's Horn",
    lore: "He protects cattle and wealth. The horn was always his symbol.",
    tier: 'deity', slot: 'accessory', deityId: 'veles',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wealth flows from below the earth, where I rule. My horn goes to those who accumulate: earn 20,000 gold total across your lifetime. Not spend it — earn it. Show me the wealth can flow.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 20000, description: 'Earn 20,000 total gold across all characters lifetime' },
    ]},
    passiveId: 'veles_horn_passive',
    passiveDescription: "Wealth Below: enemy gold drops +30%. Also: once per run, find a hidden cache of gold (500-1500G) in a random room. Veles tends his flock.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 24, LCK: 22 } },
  },
};

const MOKOSH_RELICS: DeityRelicPair = {
  deityId: 'mokosh',
  weapon: {
    id: 'deity_mokosh_weapon', name: "Earth Mother's Spindle",
    lore: "She spins fate and tends the earth. The spindle is what cuts the thread.",
    tier: 'deity', slot: 'weapon', deityId: 'mokosh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The earth provides and sustains. My spindle goes to those who provide for themselves: use 20 rest sites total lifetime AND have 30 healing sources used. The earth does not rush. It nourishes continuously.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'rest_sites_used', value: 20, description: '20 rest sites used lifetime' },
      { metric: 'healing_received', value: 30, description: '30 healing sources used lifetime' },
    ]},
    passiveId: 'mokosh_spindle_passive',
    passiveDescription: "Earth's Sustenance: rest sites restore +40% HP/SP. Also: at the start of each floor, regenerate 5% max HP (the earth provides even without a rest site).",
    weaponStats: { scalingStat: 'END', secondaryStat: 'WIS', finalDamage: 42, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_mokosh_accessory', name: "Fertile Earth Ring",
    lore: "She is the only major female deity in the Slavic pantheon. The ring is her claim to that position.",
    tier: 'deity', slot: 'accessory', deityId: 'mokosh',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The earth endures and grows. My ring goes to those who grow with it: reach Level 5 with END as your highest-graded stat. Endurance is what the earth demands of those she favors.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'stats_grade', value: 1, targetType: 'END_highest_stat', description: 'END must be the highest grade stat on the character' },
    ]},
    passiveId: 'mokosh_ring_passive',
    passiveDescription: "Mother Earth's Resilience: +20% max HP. When you rest at a rest site, also restore 5% SP per floor you have descended this run (the earth rewards the patient descender).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 28, WIS: 20 } },
  },
};

const SVAROG_RELICS: DeityRelicPair = {
  deityId: 'svarog',
  weapon: {
    id: 'deity_svarog_weapon', name: "Celestial Forge Hammer",
    lore: "He is the god of heavenly fire and the forge. His hammer shaped the sun.",
    tier: 'deity', slot: 'weapon', deityId: 'svarog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My forge shaped the weapons of gods. To earn my hammer: perform 5 weapon upgrades at the Blacksmith AND have at least one of those result in a weapon reaching Masterwork quality. The forge demands quality work.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_upgrades', value: 5, description: '5 weapon upgrades at the Blacksmith lifetime' },
      { metric: 'weapon_legendary', value: 1, targetType: 'at_least_masterwork', description: 'At least one upgrade reaches Masterwork or Legendary' },
    ]},
    passiveId: 'svarog_hammer_passive',
    passiveDescription: "Celestial Fire: burn damage +25%. Also: weapons you carry gain +2 flat damage per upgrade they've received at the Blacksmith (the celestial forge's blessing lingers).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_svarog_accessory', name: "Sky Fire Band",
    lore: "Fire from heaven. Svarog threw it down to create metalworking.",
    tier: 'deity', slot: 'accessory', deityId: 'svarog',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Heavenly fire transforms everything it touches. My band goes to those who have been transformed by the forge: spend 10,000 gold total at the Blacksmith lifetime. The fire costs gold. Transformation costs investment.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_spent_blacksmith', value: 10000, description: 'Spend 10,000 gold at the Blacksmith lifetime' },
    ]},
    passiveId: 'svarog_band_passive',
    passiveDescription: "Forge's Mark: all fire-type damage +20%. When at the Blacksmith, upgrade costs reduced by 15% (Svarog recognizes a patron of his forge).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 22, INT: 20 } },
  },
};

// ===== AZTEC =====

const HUITZILOPOCHTLI_RELICS: DeityRelicPair = {
  deityId: 'huitzilopochtli',
  weapon: {
    id: 'deity_huitzilopochtli_weapon', name: "Xiuhcoatl (Fire Serpent)",
    lore: "He is the sun and war. He demands sacrifice. The fire serpent weapon makes the ask.",
    tier: 'deity', slot: 'weapon', deityId: 'huitzilopochtli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The sun requires blood to rise each morning. My fire serpent goes to those who understand sacrifice through accumulation: kill 200 enemies total lifetime using fire-type attacks or burn status damage. Feed the sun.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 200, targetType: 'fire_damage_or_burn_kills', description: 'Kill 200 enemies with fire damage or burn status lifetime' },
    ]},
    passiveId: 'huitzilopochtli_weapon_passive',
    passiveDescription: "Sun's Demand: burn effects cannot be cleansed by enemies. Also: when an enemy dies from burn damage, it explodes for 20% of its max HP as fire damage to all adjacent enemies.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 52, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_huitzilopochtli_accessory', name: "Hummingbird of the South Shield",
    lore: "His name means hummingbird of the south. Aztec gods have the most specific names.",
    tier: 'deity', slot: 'accessory', deityId: 'huitzilopochtli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The sun rises and sets with blood. My shield goes to those who prove they can sustain the sacrifice: in a single run, take 1,500+ damage AND still defeat a milestone boss. Give blood. Keep fighting. The sun demands it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 1500, description: 'Take 1,500+ damage in one run' },
      { metric: 'boss_kills_run', value: 1, description: 'Still defeat a milestone boss in that run' },
    ]},
    passiveId: 'huitzilopochtli_shield_passive',
    passiveDescription: "Blood for the Sun: +1% damage for every 10 HP you have lost this run (max +40%). The sacrifice fuels the war god.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 26, END: 20 } },
  },
};

const QUETZALCOATL_RELICS: DeityRelicPair = {
  deityId: 'quetzalcoatl',
  weapon: {
    id: 'deity_quetzalcoatl_weapon', name: "Feathered Serpent Staff",
    lore: "Quetzal feathers and serpent fangs. The two things you need for a good weapon.",
    tier: 'deity', slot: 'weapon', deityId: 'quetzalcoatl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the feathered serpent — earth and sky unified. My staff goes to those who can move between elements: in a single run to Floor 15, use both melee weapons and ranged weapons (switching between them in different combats). Earth and sky. Not one or the other.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'both_melee_and_ranged_used_same_run', description: 'Use both melee and ranged weapon types in combats during one run' },
    ]},
    passiveId: 'quetzalcoatl_staff_passive',
    passiveDescription: "Feathered Serpent: can be used as either melee or ranged with equal effectiveness (no range penalty). Also: wind-type and earth-type skills cost -15% SP.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_quetzalcoatl_accessory', name: "Serpent Scale Crown",
    lore: "He left the Aztec world promising to return. They kept his crown ready. This is it.",
    tier: 'deity', slot: 'accessory', deityId: 'quetzalcoatl',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I came back when promised. My crown goes to those who make and keep the promise of return: in 3 separate runs, flee a combat and then return to finish that floor's boss. Flee. Return. Keep the promise.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'flee_total', value: 3, targetType: 'flee_then_complete_boss_same_run', description: 'In 3 runs: flee at least once AND still complete the floor boss in that run' },
    ]},
    passiveId: 'quetzalcoatl_crown_passive',
    passiveDescription: "The Return: after using Flee in a run, your damage is +20% for the rest of that run (the promised return carries power). The serpent comes back stronger.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 24, AGI: 20 } },
  },
};

const TEZCATLIPOCA_RELICS: DeityRelicPair = {
  deityId: 'tezcatlipoca',
  weapon: {
    id: 'deity_tezcatlipoca_weapon', name: "Smoking Mirror Blade",
    lore: "His mirror shows people their fate. The blade enforces it.",
    tier: 'deity', slot: 'weapon', deityId: 'tezcatlipoca',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The smoking mirror shows true nature — corruption, fate, the things people hide. To earn my blade: use the Observe action before every single combat in a run reaching Floor 15. See the truth of every enemy before it knows you. Show me you use the mirror rather than turning from it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'observe_total', value: 1, targetType: 'all_combats_observed_first', description: 'Observe before every single combat in the run' },
    ]},
    passiveId: 'tezcatlipoca_blade_passive',
    passiveDescription: "Smoking Mirror: enemies never gain surprise advantage. Additionally: once per combat, see exactly what percent HP the enemy will have when they first use their special ability (foresight through the mirror).",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_tezcatlipoca_accessory', name: "Jaguar God's Pelt",
    lore: "He takes jaguar form. His pelt reflects darkness and stars simultaneously.",
    tier: 'deity', slot: 'accessory', deityId: 'tezcatlipoca',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Chaos and fate are the same thing seen from different angles. My pelt goes to those who embody chaos: win 5 combats in a run where you began the combat below 25% HP. Fight from weakness. The jaguar hunts from the dark.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 5, targetType: 'win_combat_starting_below_25hp', description: 'Win 5 combats in one run starting each with below 25% HP' },
    ]},
    passiveId: 'tezcatlipoca_pelt_passive',
    passiveDescription: "Jaguar Night: when below 30% HP: +35% damage and +20% dodge chance. The jaguar is most dangerous when it should be weakest.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 26, STR: 20 } },
  },
};

const MICTLANTECUHTLI_RELICS: DeityRelicPair = {
  deityId: 'mictlantecuhtli',
  weapon: {
    id: 'deity_mictlantecuhtli_weapon', name: "Lord of Mictlan's Blade",
    lore: "He rules the lowest level of the Aztec underworld. He is depicted as a skeleton wearing eyeballs. He considers this well-designed.",
    tier: 'deity', slot: 'weapon', deityId: 'mictlantecuhtli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The road to Mictlan takes four years and nine levels. My blade goes to those who endure the full journey: reach Floor 25 in a single run without dying. All nine levels of the Tower's equivalent underworld. Return from them.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25 in one run' },
      { metric: 'custom', value: 1, targetType: 'no_deaths_entire_run', description: 'Zero deaths the entire run' },
    ]},
    passiveId: 'mictlantecuhtli_blade_passive',
    passiveDescription: "Nine Levels: each group of 5 floors you descend (5, 10, 15, 20, 25) adds +5% flat damage permanently to this weapon during the run. At Floor 25: +25% total bonus.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_mictlantecuhtli_accessory', name: "Death's Skull Pendant",
    lore: "He wore the bones of the dead. This pendant is from those bones.",
    tier: 'deity', slot: 'accessory', deityId: 'mictlantecuhtli',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "All things come to me eventually. My pendant goes to those who have visited my realm enough: die 7 times total lifetime across all characters. Seven times you came to my door. The pendant awaits those who know the path intimately.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 7, targetType: 'seven_total_deaths_lifetime', description: '7 total character deaths lifetime' },
    ]},
    passiveId: 'mictlantecuhtli_pendant_passive',
    passiveDescription: "Death Lord's Domain: once per run, when you die, Mictlantecuhtli returns you at 30% HP — but you must pay 25% of your current gold as the toll. The Lord does not give for free.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 24, END: 22 } },
  },
};

export const SOUTH_DEITY_RELICS: DeityRelicPair[] = [
  // Hindu
  SHIVA_RELICS, VISHNU_RELICS, BRAHMA_RELICS, INDRA_RELICS,
  KALI_RELICS, GANESHA_RELICS,
  // Slavic (non-boss)
  PERUN_RELICS, VELES_RELICS, MOKOSH_RELICS, SVAROG_RELICS,
  // Aztec (key deities)
  HUITZILOPOCHTLI_RELICS, QUETZALCOATL_RELICS, TEZCATLIPOCA_RELICS, MICTLANTECUHTLI_RELICS,
];
