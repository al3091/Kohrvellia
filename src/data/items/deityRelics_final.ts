/**
 * Final remaining deity relics:
 * - Chinese pantheon: 16 remaining deities
 * - Hindu remaining: skanda, kamadeva, budha (3)
 * - Fallen Angels: astaroth_fallen (1)
 *
 * Total: 20 pairs = 40 items. Completes the deity relic system.
 */

import type { DeityRelicPair } from './deityRelics';

// ===== CHINESE — 16 remaining deities =====

const CAISHEN_RELICS: DeityRelicPair = {
  deityId: 'caishen',
  weapon: {
    id: 'deity_caishen_weapon', name: "Caishen's Golden Staff",
    lore: 'He rides a black tiger and throws ingots. The staff distributes the ingots at speed.',
    tier: 'deity', slot: 'weapon', deityId: 'caishen',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wealth flows to those who move it, not those who hoard it. My staff goes to those who have proven they understand gold as a living force: spend 25,000 gold total across all town shops and blacksmith visits, lifetime. Not earned — spent. Wealth that moves blesses everyone it touches, including you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_spent_blacksmith', value: 10000, description: 'Spend 10,000+ gold at the Blacksmith lifetime' },
      { metric: 'shop_visits', value: 30, description: 'Visit shops 30+ times lifetime' },
    ]},
    passiveId: 'caishen_staff_passive',
    passiveDescription: "Wealth's Touch: enemies drop +30% gold. Once per floor, a random gold bonus (100-500G) appears after your first kill. The god of wealth blesses the active spender.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'CHA', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_caishen_accessory', name: "Ingot of Caishen",
    lore: 'A gold ingot that was in his hands before it was in yours. It has opinions about being spent.',
    tier: 'deity', slot: 'accessory', deityId: 'caishen',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wealth rewards those who pursue it without desperation. My ingot goes to those who have held more than 8,000 gold at once — not spent it, not lost it. Held it. Peak wealth shows peak discipline. When your gold touches that amount, the ingot recognizes the hand that can carry such weight.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 8000, description: 'Hold 8,000+ gold simultaneously on one character' },
    ]},
    passiveId: 'caishen_ingot_passive',
    passiveDescription: "Golden Luck: LCK-based critical hits deal double the crit bonus damage. Also: at the start of each floor, there is a 20% chance to receive a small windfall (150-400G) — Caishen's passing blessing.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 30, CHA: 18 } },
  },
};

const YAMA_DIYU_RELICS: DeityRelicPair = {
  deityId: 'yama_diyu',
  weapon: {
    id: 'deity_yama_diyu_weapon', name: "Judge's Sword of Hell",
    lore: 'He judges the dead in eighteen courts. This weapon handles pre-trial sentencing.',
    tier: 'deity', slot: 'weapon', deityId: 'yama_diyu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I sit in judgment over all souls. My sword goes to those who have earned the right to judge: defeat all 5 milestone bosses in a single run — and before each boss, use the Observe action first. You must see them clearly before condemning them. Justice requires full knowledge.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 5, description: 'Defeat all 5 milestone bosses in one run' },
      { metric: 'observe_total', value: 5, targetType: 'boss_before_kill', description: 'Observe each boss before fighting' },
    ]},
    passiveId: 'yama_diyu_sword_passive',
    passiveDescription: "Final Judgment: enemies below 20% HP take +40% damage from this weapon. When you kill a boss, all remaining enemies on the floor are 'sentenced' — they deal -15% damage for the rest of the floor.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'STR', finalDamage: 52, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_yama_diyu_accessory', name: "Hell Court Seal",
    lore: 'One of the official seals of the eighteen courts of Diyu. Carries the weight of ten thousand verdicts.',
    tier: 'deity', slot: 'accessory', deityId: 'yama_diyu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The dead do not lie to me. My seal goes to those who have faced death and returned with clean hands: complete 5 separate runs reaching Floor 10 or beyond without dying on any of them. Death has looked at you five times and found nothing to hold.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 5, targetType: 'five_runs_floor10_no_death', description: '5 separate runs reaching Floor 10+ without dying, lifetime' },
    ]},
    passiveId: 'yama_diyu_seal_passive',
    passiveDescription: "Hell Court Authority: when you would be killed, the first time per run the Seal intercedes — you survive at 10% HP and the killing enemy is 'sentenced' (stunned for 2 turns, -30% defense for the rest of the combat).",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 26, END: 22 } },
  },
};

const XI_WANGMU_RELICS: DeityRelicPair = {
  deityId: 'xi_wangmu',
  weapon: {
    id: 'deity_xi_wangmu_weapon', name: "Peach Tree Branch",
    lore: 'Her peach trees grant immortality. The branch was cut from one. It still blooms once per run.',
    tier: 'deity', slot: 'weapon', deityId: 'xi_wangmu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My peaches grant immortality to those who earn them. My branch goes to those who demonstrate they understand longevity: reach Level 8 on a single character. Eight levels of continuous growth on the same life. The peach tree does not rush its fruit.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 8, description: 'Reach Level 8 on a single character' },
    ]},
    passiveId: 'xi_wangmu_branch_passive',
    passiveDescription: "Immortal Peach: once per run, the branch blossoms — fully restoring your HP and SP, and clearing all status effects. The bloom activates the first time you drop below 15% HP.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'END', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.24, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_xi_wangmu_accessory', name: "Queen Mother's Jade Pendant",
    lore: 'She rules the western paradise. This pendant is a fragment of its gate.',
    tier: 'deity', slot: 'accessory', deityId: 'xi_wangmu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My paradise is only entered by those who have lived enough to appreciate it. My pendant goes to those with the full range of experience: reach Favoured Child status (91+ favor) with 2 different deities from completely different pantheons. You must be beloved in more than one heaven.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 2, targetType: 'different_pantheons', description: 'Reach 91+ favor with 2 deities from different pantheons' },
    ]},
    passiveId: 'xi_wangmu_pendant_passive',
    passiveDescription: "Western Paradise: all healing received +35%. Once per dungeon run, visit the Western Paradise — restore to full HP and receive one guaranteed rare-quality item. Cannot be forced; activates at the start of a randomly chosen floor.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 28, END: 20 } },
  },
};

const HOU_YI_RELICS: DeityRelicPair = {
  deityId: 'hou_yi',
  weapon: {
    id: 'deity_hou_yi_weapon', name: "Hou Yi's Divine Bow",
    lore: 'He shot down nine of ten suns to save the earth. He practiced until the tenth was enough.',
    tier: 'deity', slot: 'weapon', deityId: 'hou_yi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the greatest archer in history. My bow does not accept mediocrity. Earn it by completing a full run to Floor 20 without a single missed attack — every shot connects. The nine suns I shot taught me that there is no 'almost.' There is only the shot and what it hits.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'custom', value: 0, targetType: 'zero_missed_attacks_run', description: 'Zero missed attacks the entire run' },
    ]},
    passiveId: 'hou_yi_bow_passive',
    passiveDescription: "Perfect Archer: this weapon cannot miss. Accuracy is always 100%. Critical hits with this weapon cause 'sunburst' — dealing 25% bonus damage to all enemies present as splash.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'AGI', finalDamage: 50, finalAccuracy: 110, finalCritChance: 0.32, range: 'ranged', damageType: 'physical', neverMisses: true },
  },
  accessory: {
    id: 'deity_hou_yi_accessory', name: "Sun Archer's Armguard",
    lore: 'He wore this while shooting. It absorbed the light of nine dying suns.',
    tier: 'deity', slot: 'accessory', deityId: 'hou_yi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Nine suns, nine arrows, nine kills. My armguard goes to those who match that precision: kill 9 elite enemies in a single run without missing a single attack in any of those fights. Nine fights, zero misses. Precision is my only standard.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 9, targetType: 'elite_kills_no_miss', description: 'Kill 9 elites in one run without missing any attacks in those fights' },
    ]},
    passiveId: 'hou_yi_armguard_passive',
    passiveDescription: "Divine Aim: when you have not missed any attack in the current combat, your critical hit chance is +15% (precision compounds). The armguard rewards unbroken accuracy.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { PER: 28, AGI: 20 } },
  },
};

const CHANGE_RELICS: DeityRelicPair = {
  deityId: 'change',
  weapon: {
    id: 'deity_change_weapon', name: "Moonlight Blade",
    lore: 'She drank the elixir of immortality and floated to the moon alone. The blade carries that loneliness forward.',
    tier: 'deity', slot: 'weapon', deityId: 'change',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I chose immortality and solitude. My blade goes to those who prove they can stand alone: complete a run to Floor 15 without using any CHA-based actions (no Taunt, no dialogue options, no social interactions). Walk the Tower alone, relying on nothing but yourself. The moon needs no companions.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'taunt_total', value: 0, description: 'Zero Taunt uses the entire run' },
      { metric: 'boss_bypass', value: 0, description: 'Zero boss bypasses (no dialogue interactions)' },
    ]},
    passiveId: 'change_blade_passive',
    passiveDescription: "Solitary Moon: +20% damage when you have not used any CHA action this combat. +10% additional damage per floor descended without a CHA action (max +40%). The solitary moon grows stronger in its isolation.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 96, finalCritChance: 0.30, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_change_accessory', name: "Lunar Elixir Vial",
    lore: 'The elixir that made her immortal. A drop remains. She does not know where it went.',
    tier: 'deity', slot: 'accessory', deityId: 'change',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The elixir was meant for Hou Yi. I took it instead. My vial goes to those who make unexpected choices: in a single run, bypass at least 2 bosses through dialogue AND still reach Floor 20. Take the unexpected path. The moon rose because of an unexpected choice.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_bypass', value: 2, description: 'Bypass 2 bosses through dialogue in one run' },
      { metric: 'floors_reached', value: 20, description: 'Still reach Floor 20 in that run' },
    ]},
    passiveId: 'change_vial_passive',
    passiveDescription: "Immortal Moon: once per character lifetime, on the moment of death, the vial activates — you are returned to 50% HP with all status effects cleared. The elixir grants one reprieve. Only one.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { AGI: 24, WIS: 22 } },
  },
};

const ZHONG_KUI_RELICS: DeityRelicPair = {
  deityId: 'zhong_kui',
  weapon: {
    id: 'deity_zhong_kui_weapon', name: "Demon Queller's Sword",
    lore: 'He failed the imperial examination and killed himself. The Jade Emperor made him the official queller of demons. Career pivots can work out.',
    tier: 'deity', slot: 'weapon', deityId: 'zhong_kui',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I hunt demons for the Jade Emperor. My sword goes to those who prove they can find and destroy what hides: complete 20 mystery rooms total lifetime AND kill every enemy encountered in those rooms (no fleeing, no bypassing in mystery rooms). Hunt completely. Demons do not get mercy.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 20, description: 'Complete 20 mystery rooms lifetime' },
      { metric: 'custom', value: 1, targetType: 'kill_all_enemies_in_mystery_rooms', description: 'Kill all enemies encountered inside mystery rooms (never flee from mystery room combats)' },
    ]},
    passiveId: 'zhong_kui_sword_passive',
    passiveDescription: "Demon Queller: +30% damage to all undead and demon-type enemies. Also: when you enter a mystery room, the room contents are revealed before you engage (no surprises — Zhong Kui knows what hides).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_zhong_kui_accessory', name: "Demon King's Hat",
    lore: 'He wears a ceremonial hat. The demons fear it more than the sword.',
    tier: 'deity', slot: 'accessory', deityId: 'zhong_kui',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My hat is authority over the unseen. To earn it: apply a status effect to 30 different elite enemies across your lifetime. Demons must be marked before they can be controlled. 30 elites, 30 marks.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 30, targetType: 'on_elite_enemies', description: 'Apply any status effect to 30 elite enemies lifetime' },
    ]},
    passiveId: 'zhong_kui_hat_passive',
    passiveDescription: "Demon Authority: enemies you have applied a status effect to take +20% damage from all sources. The mark of Zhong Kui weakens what it touches.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 24, WIS: 20 } },
  },
};

const DRAGON_KING_RELICS: DeityRelicPair = {
  deityId: 'dragon_king',
  weapon: {
    id: 'deity_dragon_king_weapon', name: "Ruyi Jingu Bang (Replica)",
    lore: "The Dragon King's pillar that measured the sea. Sun Wukong took the original. The Dragon King made a replacement. It's heavier.",
    tier: 'deity', slot: 'weapon', deityId: 'dragon_king',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My kingdom is the deep sea. My pillar goes to those who go equally deep: reach Floor 25 in a single run. The Dragon King's domain is measured in depth. Prove you can match it.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25 in one run' },
    ]},
    passiveId: 'dragon_king_weapon_passive',
    passiveDescription: "Sea King's Weight: +3% damage per floor descended below Floor 10 in the current run (max +45% at Floor 25). The deeper you go, the greater the weight of the ocean behind each strike.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 54, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_dragon_king_accessory', name: "Dragon Pearl",
    lore: 'Each Dragon King carries one. This one was left at the entrance to the Tower. He will not say why.',
    tier: 'deity', slot: 'accessory', deityId: 'dragon_king',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Dragon Pearl controls weather and water. To earn it: flee from 15 combats in a single run and still defeat at least 2 milestone bosses in that run. The sea retreats — and it always returns. 15 retreats, 2 conquests, in one descent.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 15, description: 'Flee 15 times in one run' },
      { metric: 'boss_kills_run', value: 2, description: 'Still defeat 2 milestone bosses in that run' },
    ]},
    passiveId: 'dragon_king_pearl_passive',
    passiveDescription: "Dragon's Tide: after successfully fleeing, your next combat deals +25% damage (the returning tide). This bonus stacks up to +75% for 3 flee-and-returns per run.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 22, AGI: 20, LCK: 15 } },
  },
};

const PANGU_RELICS: DeityRelicPair = {
  deityId: 'pangu',
  weapon: {
    id: 'deity_pangu_weapon', name: "Creation's Axe",
    lore: 'He used it to separate heaven and earth. The axe predates everything that exists.',
    tier: 'deity', slot: 'weapon', deityId: 'pangu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I created everything by striking the void. My axe goes to those who have made enough marks to matter: kill 800 enemies total across your lifetime. Each kill is a separation — order from chaos, something from nothing. 800 separations. Then the axe is yours.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 800, description: 'Kill 800 enemies total lifetime' },
    ]},
    passiveId: 'pangu_axe_passive',
    passiveDescription: "World Cleaving: this weapon ignores 30% of enemy defense (the axe that split heaven and earth respects no barrier). Also: +5% damage for each different enemy type killed with it (lifetime, max +40%).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 56, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_pangu_accessory', name: "Primordial Egg Fragment",
    lore: 'Pangu emerged from the cosmic egg. This is a piece of the shell.',
    tier: 'deity', slot: 'accessory', deityId: 'pangu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Before creation, there was only the egg. My fragment goes to those who begin again: start a new character after a previous character's death, and on that new character's first run, reach Floor 10. The world begins again. It must prove itself immediately.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'first_character_after_death', description: 'This character was started after a previous character died' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10 on this character' },
    ]},
    passiveId: 'pangu_egg_passive',
    passiveDescription: "Primordial Strength: +5% to all base stats (flat multiplier applied after all other bonuses). The egg of creation contains every possibility.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, END: 20, WIS: 15 } },
  },
};

const NUWA_RELICS: DeityRelicPair = {
  deityId: 'nuwa',
  weapon: {
    id: 'deity_nuwa_weapon', name: "Sky-Mending Staff",
    lore: 'She repaired the sky after a battle of gods broke it. The staff channeled five-colored stones.',
    tier: 'deity', slot: 'weapon', deityId: 'nuwa',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I mended the sky when it was broken. My staff goes to those who mend what is broken in themselves: reach Level 5 on a character who has died at least twice total in your lifetime. You broke twice and came back a third time. That is the mending I recognize.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'custom', value: 2, targetType: 'two_prior_deaths_before_this_character', description: 'At least 2 character deaths occurred before this character was created' },
      { metric: 'level_reached', value: 5, description: 'Reach Level 5 on this character' },
    ]},
    passiveId: 'nuwa_staff_passive',
    passiveDescription: "Sky Mended: once per combat, repair yourself — heal 15% max HP as an instant free action when first dropping below 40% HP. The mending happens once; after that, you fight whole.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.26, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_nuwa_accessory', name: "Five-Colored Stone",
    lore: 'She used 36,501 stones to repair the sky. One remained. The universe keeps the spare.',
    tier: 'deity', slot: 'accessory', deityId: 'nuwa',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I created humanity from yellow earth. Each piece is different. My stone goes to those who reflect that variety: reach grade B or higher in 5 different stats on the same character. No single path. Five facets, all polished.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'stats_grade', value: 5, targetType: 'five_stats_grade_B_or_higher', description: '5 different stats at grade B or higher on one character' },
    ]},
    passiveId: 'nuwa_stone_passive',
    passiveDescription: "Five Colors: each of the five highest-grade stats on your character contributes a +4% bonus to their associated combat role (STR→attack, END→defense, AGI→speed, INT→magic, WIS→healing). A balanced character is rewarded completely.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 22, INT: 18, END: 15 } },
  },
};

const FU_XI_RELICS: DeityRelicPair = {
  deityId: 'fu_xi',
  weapon: {
    id: 'deity_fu_xi_weapon', name: "I Ching Trigram Staff",
    lore: 'He invented the eight trigrams. Every combination describes a state of change. The staff embodies all of them.',
    tier: 'deity', slot: 'weapon', deityId: 'fu_xi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I discovered the patterns within change itself. My staff goes to those who can read the patterns of this Tower: complete the Bestiary entry for 20 different enemy types — observe them, fight them, record them. The I Ching is a record of change. Fill your own record.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 20, targetType: 'complete_bestiary_entries', description: 'Complete full Bestiary entries for 20 enemy types (observe + fight + record)' },
    ]},
    passiveId: 'fu_xi_staff_passive',
    passiveDescription: "Trigram Wisdom: each enemy type you have fully recorded in the Bestiary reduces their damage to you by 5% (stacks, max -40% from 8+ types). The eight trigrams hold the secrets of all change.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_fu_xi_accessory', name: "Bagua Mirror",
    lore: 'The eight trigrams reflected. Used to ward demons. Also used to confuse them first.',
    tier: 'deity', slot: 'accessory', deityId: 'fu_xi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The mirror reflects the true nature of everything. My Bagua mirror goes to those who use all eight actions available to them in combat: in a single combat, use Attack, Defend, Observe, Taunt, Flee-attempt, Item, Skill, and Quick Strike — all eight. The eight trigrams require all eight positions.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'all_eight_action_types_one_combat', description: 'Use all 8 action types (Attack, Defend, Observe, Taunt, Flee-attempt, Item, Skill, Quick Strike) in one combat' },
    ]},
    passiveId: 'fu_xi_mirror_passive',
    passiveDescription: "Eight Trigrams: after using 4 different action types in a combat, all subsequent actions that combat cost -15% SP or deal +10% damage (alternating bonus per action). The pattern rewards variety.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 26, WIS: 20 } },
  },
};

const SHENNONG_RELICS: DeityRelicPair = {
  deityId: 'shennong',
  weapon: {
    id: 'deity_shennong_weapon', name: "Threshing Whip",
    lore: 'He used it to thresh grain and to teach agriculture. It also struck enemies who threatened the harvest.',
    tier: 'deity', slot: 'weapon', deityId: 'shennong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I tasted 365 herbs to discover medicine, and was poisoned by 72 of them. My whip goes to those who survive their own mistakes: receive 5 different status effects across your lifetime AND recover from each one (not die with them active). Survive being poisoned. That is Shennong's test.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, targetType: 'five_different_types_survived', description: 'Receive and survive 5 different status effect types lifetime (not die while afflicted)' },
    ]},
    passiveId: 'shennong_whip_passive',
    passiveDescription: "Herbalist's Knowledge: you are immune to poison damage (but still get the debuff visually). Also: when a status effect expires naturally on you (not cleansed), restore 8% HP — the body learns from what it endures.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_shennong_accessory', name: "Divine Farmer's Herb Pouch",
    lore: 'Contains the essence of all 365 herbs he tested. 72 of them are still poisonous.',
    tier: 'deity', slot: 'accessory', deityId: 'shennong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My pouch holds every herb that heals — and every herb that harms. To earn it: use 40 consumable items total across your lifetime (any type — potions, food, anything). Show me you understand that healing requires using what is available.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 40, description: 'Use 40+ healing consumables or healing actions total lifetime' },
    ]},
    passiveId: 'shennong_pouch_passive',
    passiveDescription: "Divine Medicine: all consumable items have 30% stronger effects when used. Healing potions heal 30% more HP. SP flasks restore 30% more SP. The divine farmer's blessing multiplies what the body already knows how to use.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { END: 24, WIS: 22 } },
  },
};

const ZAO_JUN_RELICS: DeityRelicPair = {
  deityId: 'zao_jun',
  weapon: {
    id: 'deity_zao_jun_weapon', name: "Hearth Flame Lance",
    lore: 'He watches households from the kitchen. He carries a list of everything that happened there. The lance enforces the list.',
    tier: 'deity', slot: 'weapon', deityId: 'zao_jun',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I report to the Jade Emperor on the behavior of every household. My lance goes to those whose record is worth reporting: visit the Familia Home 15 times total lifetime. The hearth god rewards those who return home consistently. Come back 15 times.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'familia_visits', value: 15, description: 'Visit the Familia Home 15 times total lifetime' },
    ]},
    passiveId: 'zao_jun_lance_passive',
    passiveDescription: "Hearth's Protection: +10% damage and +10% defense on the floor immediately after using a rest site (the hearth god travels with you from the fire). Bonus lasts exactly one floor.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_zao_jun_accessory', name: "Kitchen God's Report Scroll",
    lore: "Zao Jun reports on your year's actions every New Year. This is an early copy.",
    tier: 'deity', slot: 'accessory', deityId: 'zao_jun',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My report records all actions in the household. My scroll goes to those who maintain a clean record: complete 8 consecutive runs reaching Floor 5+ without dying in any of them. Eight clean entries in the divine ledger.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 8, targetType: 'eight_consecutive_runs_floor5_no_death', description: '8 consecutive runs reaching Floor 5+ without dying, lifetime' },
    ]},
    passiveId: 'zao_jun_scroll_passive',
    passiveDescription: "Good Record: if you have not died in your last 3 dungeon runs, start each new run with +20% max HP and +20% max SP for that run (the Jade Emperor's temporary blessing for a clean report).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 22, END: 20 } },
  },
};

const TU_DI_GONG_RELICS: DeityRelicPair = {
  deityId: 'tu_di_gong',
  weapon: {
    id: 'deity_tu_di_gong_weapon', name: "Earth God's Staff",
    lore: 'He protects specific territories. Very specific. This is the staff of one particular patch of earth that happens to include this Tower.',
    tier: 'deity', slot: 'weapon', deityId: 'tu_di_gong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I protect the earth beneath your feet. My staff goes to those who have walked every path in this territory: explore every room available on 5 complete floors in a single run. No rooms skipped. Every corner of the territory must be visited. I protect what is fully known.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_floors_all_rooms_entered', description: '5 complete floors where every available room was entered in one run' },
    ]},
    passiveId: 'tu_di_gong_staff_passive',
    passiveDescription: "Local God's Blessing: traps and hidden dangers on each floor are revealed at the start of that floor. Also: when you have entered every room on the previous floor, +10% damage on the current floor (the earth god rewards thorough exploration).",
    weaponStats: { scalingStat: 'END', secondaryStat: 'STR', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_tu_di_gong_accessory', name: "Local Earth Ward",
    lore: 'A small statue that sits at crossroads and doorways. This one was at the Tower entrance.',
    tier: 'deity', slot: 'accessory', deityId: 'tu_di_gong',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The earth remembers those who have walked on it. My ward goes to those who have covered significant ground: complete 12 dungeon runs lifetime — started and either completed or died in. The local god knows who belongs to the territory.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 12, targetType: 'twelve_dungeon_runs', description: 'Complete (or die in) 12 dungeon runs lifetime' },
    ]},
    passiveId: 'tu_di_gong_ward_passive',
    passiveDescription: "Earth's Memory: the first enemy on each new floor deals -20% damage to you (the local god has warned you about them). Subsequent enemies deal normal damage.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 24, WIS: 18 } },
  },
};

const BI_GAN_RELICS: DeityRelicPair = {
  deityId: 'bi_gan',
  weapon: {
    id: 'deity_bi_gan_weapon', name: "Loyal Minister's Blade",
    lore: 'He remonstrated tyrants with perfect honesty until they killed him. His honesty is the weapon now.',
    tier: 'deity', slot: 'weapon', deityId: 'bi_gan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I spoke truth to power until they cut out my heart. My blade goes to those who fight without compromise: complete a run to Floor 15 using only the basic Attack action — no skills, no Taunt, no Defend. Pure honest combat, no cleverness. Truth does not need techniques.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'skill_uses', value: 0, description: 'Zero skill uses' },
      { metric: 'taunt_total', value: 0, description: 'Zero Taunt uses' },
      { metric: 'floor_nodefend', value: 15, description: 'Zero Defend uses' },
    ]},
    passiveId: 'bi_gan_blade_passive',
    passiveDescription: "Honest Strike: basic attacks deal +35% damage when no skills have been used this combat. Loyalty to simplicity is its own reward.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'CHA', finalDamage: 50, finalAccuracy: 94, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_bi_gan_accessory', name: "Heart of Loyalty",
    lore: "They took his heart and he kept walking. The heart knows something the body doesn't.",
    tier: 'deity', slot: 'accessory', deityId: 'bi_gan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My heart kept beating after it was removed. To earn it: survive in combat with 1 HP remaining in 3 different fights across your lifetime. Not nearly 1 HP — exactly 1. The body must prove it knows how to keep going when everything says stop.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'survive_at_exactly_1hp_three_fights', description: 'Survive 3 combats while at exactly 1 HP, lifetime' },
    ]},
    passiveId: 'bi_gan_heart_passive',
    passiveDescription: "Loyal Heart: when at 25% HP or below, all damage you deal increases by 30% (the heart fights hardest when it should stop). When at 10% HP or below: +50% damage instead.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 22, END: 22 } },
  },
};

const DOU_MU_RELICS: DeityRelicPair = {
  deityId: 'dou_mu',
  weapon: {
    id: 'deity_dou_mu_weapon', name: "Star Mother's Crescent Blade",
    lore: 'She is the mother of all stars. She rules the North Star. The blade is the light that reaches the farthest.',
    tier: 'deity', slot: 'weapon', deityId: 'dou_mu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the mother of the Big Dipper stars. My blade goes to those who understand cycles: reach Level 3 on 4 different characters across your lifetime. Four children, four journeys. The stars return to their positions again and again. So must you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 4, targetType: 'four_characters_level_3', description: 'Reach Level 3 on 4 different characters across your lifetime' },
    ]},
    passiveId: 'dou_mu_blade_passive',
    passiveDescription: "Star Alignment: at the start of each dungeon run, you receive the 'Star Alignment' of that run — a random +15% bonus to one stat for the entire run (changes each run). The stars align differently for each journey.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_dou_mu_accessory', name: "North Star Pendant",
    lore: 'The North Star does not move. Everything else circles it. The pendant knows this.',
    tier: 'deity', slot: 'accessory', deityId: 'dou_mu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The North Star guides all those who are lost. My pendant goes to those who have explored beyond the familiar: complete 15 mystery rooms total lifetime. The stars guided navigators into the unknown. Follow the same impulse.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 15, description: 'Complete 15 mystery rooms lifetime' },
    ]},
    passiveId: 'dou_mu_pendant_passive',
    passiveDescription: "Fixed Star: you always know which direction leads to the floor exit (floor map shows exit location from the moment you enter). Also: mystery room outcomes are always non-negative — bad outcomes are redirected to neutral.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 24, PER: 20 } },
  },
};

const WEN_CHANG_RELICS: DeityRelicPair = {
  deityId: 'wen_chang',
  weapon: {
    id: 'deity_wen_chang_weapon', name: "Scholar God's Writing Brush",
    lore: 'He controls the fates of scholars and literati. The brush writes destiny, not sentences.',
    tier: 'deity', slot: 'weapon', deityId: 'wen_chang',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I determine who passes the divine examinations. My brush goes to those who have demonstrated mastery across disciplines: reach grade B or higher in 4 different stats on a single character. The imperial examination tests breadth. So do I.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'stats_grade', value: 4, targetType: 'four_stats_grade_B_or_higher', description: '4 different stats at grade B or higher on one character' },
    ]},
    passiveId: 'wen_chang_brush_passive',
    passiveDescription: "Scholar's Authority: INT and WIS proficiency gain rates +25%. Also: once per dungeon run, 'inscribe' an enemy — inscribed enemies' next 3 attacks miss and their defense is reduced by 25% (the brush rewrites their fate).",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 42, finalAccuracy: 94, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_wen_chang_accessory', name: "Fate-Writing Inkstone",
    lore: 'His inkstone. The ink in it writes what will happen, not what has.',
    tier: 'deity', slot: 'accessory', deityId: 'wen_chang',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The inkstone holds the fate of scholars. My stone goes to those who have applied knowledge in practice: use skills 200 times total in a single run. Not just knowing them — using them. The scholar who only reads passes no examination.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 200, description: 'Use skills 200 times in one run' },
    ]},
    passiveId: 'wen_chang_inkstone_passive',
    passiveDescription: "Written Fate: once per combat, you may 'rewrite' an enemy's next action — nullifying it entirely (it simply doesn't happen). The inkstone overwrites one line of their fate per fight.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { INT: 28, WIS: 20 } },
  },
};

// ===== HINDU — 3 remaining =====

const SKANDA_RELICS: DeityRelicPair = {
  deityId: 'skanda',
  weapon: {
    id: 'deity_skanda_weapon', name: "Vel Spear of Skanda",
    lore: 'His mother Parvati forged this spear and gave it to him to destroy a demon that could not be killed. He did it in one throw.',
    tier: 'deity', slot: 'weapon', deityId: 'skanda',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the commander of the divine army. My spear was thrown once and destroyed what nothing else could. To earn it: defeat any milestone boss without taking a single point of damage in that fight. One perfect engagement. The Vel demands perfection.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_nodamage', value: 1, description: 'Defeat any milestone boss without taking any damage in the fight' },
    ]},
    passiveId: 'skanda_vel_passive',
    passiveDescription: "Divine Commander: when you enter combat with more than 80% HP, your first attack deals +60% damage (the spear always strikes first from a position of strength). If this kills the enemy, restore 10% SP.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'STR', finalDamage: 52, finalAccuracy: 100, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_skanda_accessory', name: "Peacock Feather Crest",
    lore: "He rides a peacock named Paravani. The peacock ate the demon Surapadman, which Skanda had first split in two. The peacock did not complain.",
    tier: 'deity', slot: 'accessory', deityId: 'skanda',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The peacock's speed allowed me to ride into battle before the enemy could prepare. My crest goes to those who demonstrate the same swiftness: win 20 combats in a single run where the enemy did not act first — you always struck before they could. Speed of the divine general.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 20, targetType: 'twenty_fights_first_strike', description: 'Win 20 combats in one run where you attacked before the enemy acted' },
    ]},
    passiveId: 'skanda_crest_passive',
    passiveDescription: "War God's Initiative: you always have first-strike priority in combat (you always act before enemies on turn 1). Additionally: +15% damage on attacks made before the enemy has acted this combat.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 28, STR: 20 } },
  },
};

const KAMADEVA_RELICS: DeityRelicPair = {
  deityId: 'kamadeva',
  weapon: {
    id: 'deity_kamadeva_weapon', name: "Flower Arrow",
    lore: "He shot Shiva with a flower arrow to awaken love. Shiva burned him to ash with a glance. Kamadeva considers this a net positive outcome.",
    tier: 'deity', slot: 'weapon', deityId: 'kamadeva',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My arrow awakens desire. To earn it: use the Taunt action 100 times total lifetime — not just to reduce damage, but to make them desire combat with you specifically. Draw them toward you 100 times. Desire is the most powerful force. I know.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 100, description: 'Use Taunt 100 times lifetime' },
    ]},
    passiveId: 'kamadeva_arrow_passive',
    passiveDescription: "Arrow of Love: enemies hit by this weapon have a 20% chance to become 'enamored' — they waste their next action (too distracted to attack). On a critical hit: guaranteed enamored for 2 turns.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 40, finalAccuracy: 96, finalCritChance: 0.32, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_kamadeva_accessory', name: "Sugarcane Bow Fragment",
    lore: "His bow is made of sugarcane strung with bees. The fragment does not sting. Usually.",
    tier: 'deity', slot: 'accessory', deityId: 'kamadeva',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Even gods cannot resist my arrows. My bow-fragment goes to those whose CHA has proven irresistible: reach grade A or higher in CHA on any character. When your charm reaches that level, my bow recognizes a kindred force.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'stats_grade', value: 1, targetType: 'CHA_grade_A_or_higher', description: 'CHA stat at grade A or higher on one character' },
    ]},
    passiveId: 'kamadeva_fragment_passive',
    passiveDescription: "Irresistible Presence: all CHA-based checks (Taunt, event dialogue, boss bypass attempts) have +30% success rate. Enemies that successfully resist your Taunt still deal -10% damage for 2 turns (they can't quite dismiss you).",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 32, LCK: 18 } },
  },
};

const BUDHA_RELICS: DeityRelicPair = {
  deityId: 'budha',
  weapon: {
    id: 'deity_budha_weapon', name: "Mercury's Swift Blade",
    lore: 'He is the Hindu Mercury — god of the planet, commerce, intellect, and eloquence. Not Buddha. Budha.',
    tier: 'deity', slot: 'weapon', deityId: 'budha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am Budha — the planet Mercury, not the sage. I govern intelligence in motion. My blade goes to those who demonstrate intellect applied to commerce: spend 10,000 gold at shops (not Blacksmith) AND have INT at grade B or higher. Mind and market, together.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'shop_visits', value: 20, description: 'Visit shops 20+ times on this character' },
      { metric: 'stats_grade', value: 1, targetType: 'INT_grade_B_or_higher', description: 'INT stat at grade B or higher' },
    ]},
    passiveId: 'budha_blade_passive',
    passiveDescription: "Mercurial Speed: the first attack in every combat has +40% damage and cannot be dodged (Mercury always arrives before defense is raised). After that, normal combat resumes.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'AGI', finalDamage: 46, finalAccuracy: 98, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_budha_accessory', name: "Messenger's Caduceus Ring",
    lore: "A ring bearing the mark of the divine messenger. It opens doors that shouldn't open.",
    tier: 'deity', slot: 'accessory', deityId: 'budha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Mercury carries messages between worlds. My ring goes to those who move between situations with equal facility: in a single run, successfully flee 5 combats AND defeat 3 bosses. Show me you can both retreat and advance with precision. The messenger serves all parties.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 5, description: 'Flee 5 times in one run' },
      { metric: 'boss_kills_run', value: 3, description: 'Also defeat 3 bosses in that same run' },
    ]},
    passiveId: 'budha_ring_passive',
    passiveDescription: "Mercury's Passage: once per floor, pass through an obstacle or locked path without cost (the messenger's ring opens any door). Also: +15% gold from all sources (Mercury blesses commerce).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { INT: 24, AGI: 20 } },
  },
};

// ===== FALLEN ANGELS — astaroth_fallen (the 15th, distinct from Ars Goetia's astaroth) =====

const ASTAROTH_FALLEN_RELICS: DeityRelicPair = {
  deityId: 'astaroth_fallen',
  weapon: {
    id: 'deity_astaroth_fallen_weapon', name: "Duke of Hell's Viper Lance",
    lore: "He is a grand duke of the western mansions of Hell. He carries a viper in his left hand and rides a dragon. He will tell you all secrets if you don't smell of herbs. He has a weakness for herbs.",
    tier: 'deity', slot: 'weapon', deityId: 'astaroth_fallen',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I reveal all secrets to those who ask correctly. Do not smell of garlic or herbs when you come to me — I am offended by them. My lance goes to those who have revealed secrets of their own: observe 40 enemies total lifetime. Show me you seek knowledge as diligently as I dispense it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 40, description: 'Use Observe 40 times total lifetime' },
    ]},
    passiveId: 'astaroth_fallen_lance_passive',
    passiveDescription: "Duke's Secrets: every enemy observed reveals its exact HP total and a preview of its next intended action. Also: enemies cannot surprise you — ambush mechanics never trigger against this weapon's bearer.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_astaroth_fallen_accessory', name: "Western Mansion Sigil",
    lore: 'He governs 40 legions. The sigil is the administrative stamp for all of them.',
    tier: 'deity', slot: 'accessory', deityId: 'astaroth_fallen',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I govern the western mansions. Do not approach me with herbs. My sigil goes to those who have demonstrated command over 40 legions worth of experience: kill 400 enemies total lifetime. Govern what you have conquered.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 400, description: 'Kill 400 enemies total lifetime' },
    ]},
    passiveId: 'astaroth_fallen_sigil_passive',
    passiveDescription: "Western Duke's Domain: +8% damage for each floor you have ever reached on any character (lifetime maximum depth, max +40% from Floor 5+). The sigil marks territory — the more you have claimed, the greater its power.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { INT: 26, WIS: 18 } },
  },
};

// ===== EXPORT =====

export const FINAL_REMAINING_RELICS: DeityRelicPair[] = [
  // Chinese (16)
  CAISHEN_RELICS, YAMA_DIYU_RELICS, XI_WANGMU_RELICS, HOU_YI_RELICS,
  CHANGE_RELICS, ZHONG_KUI_RELICS, DRAGON_KING_RELICS, PANGU_RELICS,
  NUWA_RELICS, FU_XI_RELICS, SHENNONG_RELICS, ZAO_JUN_RELICS,
  TU_DI_GONG_RELICS, BI_GAN_RELICS, DOU_MU_RELICS, WEN_CHANG_RELICS,
  // Hindu remaining (3)
  SKANDA_RELICS, KAMADEVA_RELICS, BUDHA_RELICS,
  // Fallen Angels (1)
  ASTAROTH_FALLEN_RELICS,
];
