/**
 * Pantheon Sets: Japanese, Celtic, Mesopotamian, Hindu, Chinese, Slavic, Aztec,
 * Ars Goetia, Fallen Angels
 *
 * Each pantheon follows the same structure: 7 sacred pieces (weapon + 4 armor + 2 accessories)
 * revealed at favor milestones (30/30/60/60/80/80/80), acquired through themed challenges.
 */

import type { SacredItem, PantheonSet } from '../../../types/SacredItem';

// ===================================================
// JAPANESE — "The Shinki" (Divine Instruments)
// ===================================================
// Philosophy: Mushin (no-mind), the Way, precision through emptiness.
// Full set: The kami intervenes once per floor with a random boon.

export const JAPANESE_PIECES: SacredItem[] = [
  {
    id: 'japan_accessory_magatama',
    name: 'Magatama of Izanagi',
    lore: 'He came back. But he left something behind.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Izanagi descended to retrieve what was lost. You must return from the Tower five times.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'rest_sites_used', value: 0, targetType: 'dungeon_exits_alive', description: 'Exit the dungeon alive 5 separate runs (return from 5 different runs)' }] },
    passiveId: 'return_from_yomi',
    passiveDescription: 'Once per character lifetime: upon death, survive at 1 HP but your equipped weapon is cursed (-10% damage) for the rest of the run. The price of return.',
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 20, CHA: 15 } },
  },
  {
    id: 'japan_helm_mushin',
    name: 'Kabuto of Mushin',
    lore: 'The empty mirror reflects most clearly.',
    tier: 'pantheon', slot: 'head', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Fight without thought. Defeat 10 enemies without ever observing them first.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'consecutive_fights', value: 10, targetType: 'no_observe_before', description: '10 consecutive combat rooms entered without using Observe beforehand' }] },
    passiveId: 'no_mind',
    passiveDescription: 'After 5 consecutive attacks without observing the enemy: +15% crit chance and +15% accuracy for the remainder of that fight.',
    armorStats: { slot: 'head', armorType: 'light', finalDefense: 40, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { AGI: 20, WIS: 15 } },
  },
  {
    id: 'japan_chest_raijin',
    name: 'Do Armor of Raijin',
    lore: 'It has been struck by lightning. It remembers.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Raijin's thunder should not silence the worthy. Be stunned 20 times and keep fighting.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'status_received_survived', value: 20, targetType: 'stun', description: 'Survive being stunned 20 times total lifetime' }] },
    passiveId: 'thunder_body',
    passiveDescription: 'When stunned, 30% chance to immediately break free and deal double damage on the next action.',
    armorStats: { slot: 'chest', armorType: 'medium', finalDefense: 65, finalMagicDefense: 45, speedPenalty: 0, statBonuses: { END: 25, AGI: 20 } },
  },
  {
    id: 'japan_hands_kote',
    name: 'Kote of the Shinto Warrior',
    lore: 'Two swords is distraction. One sword is completion.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'Musashi won every duel. He never switched weapons. Complete a run using only your starting weapon.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'same_weapon_run', value: 1, description: 'Complete a run from Floor 1 to any milestone boss never equipping a different weapon' }] },
    passiveId: 'musashi_way',
    passiveDescription: 'Any weapon you have used for 30+ kills on this character deals +10% damage and has +20% accuracy while held.',
    armorStats: { slot: 'hands', armorType: 'light', finalDefense: 35, finalMagicDefense: 25, speedPenalty: 0, statBonuses: { STR: 25, AGI: 20 } },
  },
  {
    id: 'japan_legs_fox',
    name: 'Waraji of the Fox',
    lore: 'The kitsune taught me to walk without announcement.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'The kitsune leaves no footprints. Slip past 10 elite enemies without fighting them.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'flee_elite', value: 10, description: 'Successfully flee from 10 different elite enemies lifetime' }] },
    passiveId: 'fox_step',
    passiveDescription: 'After avoiding a combat room (sneak/flee), your first attack in the NEXT combat deals +50% damage.',
    armorStats: { slot: 'legs', armorType: 'light', finalDefense: 30, finalMagicDefense: 30, speedPenalty: 0, statBonuses: { AGI: 25, LCK: 20 } },
  },
  {
    id: 'japan_accessory_omamori',
    name: 'Omamori of Inari',
    lore: 'Fox prints in every treasure room. Not taking. Just noticing.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "Inari blesses abundance. Show dedication to the Tower's hidden rewards.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'treasure_rooms', value: 30, description: 'Find and open 30 treasure rooms total lifetime' }] },
    passiveId: 'rice_god_blessing',
    passiveDescription: 'Treasure room loot has 25% chance to be one rarity tier higher. Event weapon cooldown never activates.',
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 20, CHA: 15 } },
  },
  {
    id: 'japan_weapon_kusanagi',
    name: 'Kusanagi-no-Tsurugi',
    lore: 'Yamato-Takeru drew it from the grass. You draw it from something harder.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'japanese',
    setId: 'japan_shinki', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "The Grasscutter cut through what shouldn't yield. Defeat Malik at above 50% HP, without using any defense or healing action.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, targetType: 'malik', description: 'Defeat Malik (Floor 25)' },
      { metric: 'consecutive_fights', value: 1, targetType: 'no_defend_no_heal_boss', description: 'The fight must have zero Defend actions and zero healing used' },
      { metric: 'custom', value: 1, targetType: 'above_50hp_at_kill', description: 'Your HP must be above 50% when Malik dies' },
    ]},
    passiveId: 'grass_cutting_edge',
    passiveDescription: 'When you receive a critical hit, immediately counterattack for 80% damage at no action cost (once per turn). Attacking first in any combat grants +10% damage for the entire fight.',
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'STR', finalDamage: 52, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
];

export const JAPANESE_SET: PantheonSet = {
  id: 'japan_shinki', name: 'The Shinki', pantheonId: 'japanese',
  lore: 'The kami reward those who follow the unspoken way — not through strength but through understanding.',
  pieces: JAPANESE_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'The Way Begins', bonusDescription: '+10% AGI and STR proficiency gains.', passiveId: 'the_way' },
    { piecesRequired: 4, bonusName: "Bushido's Path", bonusDescription: 'Winning fights without taking damage builds Way Stacks (+1% all stats each, max 10). Resets on character death.', passiveId: 'bushido_path' },
    { piecesRequired: 7, bonusName: 'The Kami Watches', bonusDescription: 'Once per floor, a random kami boon triggers: full SP restore, status clear, enemy stunned, or +30% damage aura.', passiveId: 'kami_watches' },
  ],
};

// ===================================================
// CELTIC — "The Tuatha's Price"
// ===================================================
// Philosophy: Celtic gifts always have a cost. These items are on loan.
// Full set: Skip directly to the next floor's boss — but it arrives at 150% stats.

export const CELTIC_PIECES: SacredItem[] = [
  {
    id: 'celtic_accessory_morrigan',
    name: 'Ring of the Morrigan',
    lore: 'She chose who lived on battlefields. Today she chose you.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'The Crow goddess only notices those who should have died.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'consecutive_fights', value: 3, targetType: 'survive_below_5hp', description: 'Win 3 different fights from below 5% HP on one character' }] },
    passiveId: 'crows_watch',
    passiveDescription: "When below 10% HP: cannot be critically hit by enemies. Attacks have 15% chance to instantly kill a non-elite, non-boss enemy.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 25, AGI: 20 } },
  },
  {
    id: 'celtic_helm_high_king',
    name: 'Torc of the High King',
    lore: 'Kings wear gold. This king wore victory.',
    tier: 'pantheon', slot: 'head', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'The High King rules through presence. Kill a boss using only CHA-scaling weapons.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'boss_kills_run', value: 1, targetType: 'cha_weapon_only', description: 'Defeat any milestone boss using only CHA-scaling weapons (Whip, Fan, Scepter, or Lute)' }] },
    passiveId: 'high_kings_command',
    passiveDescription: "Taunt reduces enemy damage by 35% instead of 20% and can stack twice (second Taunt = -70% total, then breaks).",
    armorStats: { slot: 'head', armorType: 'divine', finalDefense: 45, finalMagicDefense: 35, speedPenalty: 0, statBonuses: { CHA: 25, END: 20 } },
  },
  {
    id: 'celtic_chest_lugh',
    name: "Armor of Lugh's Light",
    lore: 'He answered "I am already that" to every credential demanded.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'Lugh mastered every craft. Show you master the craft of combat: vary every action perfectly.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'skill_uses', value: 1, targetType: 'no_consecutive_same_action', description: 'Never use the same skill or the same basic action in consecutive turns across 20+ rooms' }] },
    passiveId: 'master_of_masters',
    passiveDescription: '+5% damage bonus for each different skill used in a single combat (max +30% with 6 different skills).',
    armorStats: { slot: 'chest', armorType: 'divine', finalDefense: 68, finalMagicDefense: 52, speedPenalty: 0, statBonuses: { END: 25, INT: 25 } },
  },
  {
    id: 'celtic_hands_dagda',
    name: 'Gloves of the Dagda',
    lore: 'He carried a club that killed with one end and healed with the other. This only heals.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "The Dagda's cauldron never empties for the worthy. Rest sites are your cauldron.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'rest_sites_used', value: 50, description: 'Use 50 rest sites total lifetime' }] },
    passiveId: 'the_cauldron',
    passiveDescription: 'Your max SP increases permanently by 1 for every 10 rest sites used (lifetime).',
    armorStats: { slot: 'hands', armorType: 'divine', finalDefense: 38, finalMagicDefense: 38, speedPenalty: 0, statBonuses: { END: 30, WIS: 20 } },
  },
  {
    id: 'celtic_legs_hunt',
    name: 'Boots of the Wild Hunt',
    lore: 'Once the Hunt notices you, it does not stop.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'The Wild Hunt claims the worthy. Enter and clear 30 elite nodes lifetime.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'consecutive_fights', value: 30, targetType: 'elite_rooms_cleared', description: '30 elite rooms cleared lifetime' }] },
    passiveId: 'hunters_quarry',
    passiveDescription: 'Elite enemies drop 2× normal loot. Defeating an elite marks the next elite encountered — that elite has -20% HP.',
    armorStats: { slot: 'legs', armorType: 'medium', finalDefense: 42, finalMagicDefense: 30, speedPenalty: 0, statBonuses: { AGI: 25, STR: 20 } },
  },
  {
    id: 'celtic_accessory_brigid',
    name: "Brooch of Brigid",
    lore: 'The hearth-fire and the forge-fire are the same fire.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Brigid is the forge goddess. Patronize the forge.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'gold_spent_blacksmith', value: 5000, description: 'Spend 5,000G total at the Blacksmith lifetime (upgrades + identifications)' }] },
    passiveId: 'sacred_flame',
    passiveDescription: 'Your equipped weapon emits Brigid\'s flame: 10% chance per attack to trigger an additional hit for 30% damage.',
    accessoryStats: { accessoryType: 'ring', statBonuses: { INT: 20, WIS: 20 } },
  },
  {
    id: 'celtic_weapon_fragarach',
    name: 'Fragarach, the Answerer',
    lore: 'It compelled truth in a world of lies. It still does.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'celtic',
    setId: 'celtic_tuatha', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Fragarach answered lies with steel. Win a fight where the enemy critically hit you — but win using only basic attacks and support actions, no attacking skills.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 1, targetType: 'was_crit_but_no_atk_skills', description: 'Win a fight where the enemy landed a crit on you, using zero attacking skills' },
    ]},
    passiveId: 'the_answerer',
    passiveDescription: 'When an enemy uses a special ability, your next attack ignores all defense. Fragarach cannot be blocked or dodged. Always shows exact enemy HP.',
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 100, finalCritChance: 0.27, range: 'melee', damageType: 'physical', neverMisses: true },
  },
];

export const CELTIC_SET: PantheonSet = {
  id: 'celtic_tuatha', name: "The Tuatha's Price", pantheonId: 'celtic',
  lore: "The Tuatha Dé Danann give nothing without debt. Their gifts always cost something sacred.",
  pieces: CELTIC_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: "The Price", bonusDescription: '+15% CHA proficiency gains.', passiveId: 'the_price' },
    { piecesRequired: 4, bonusName: "The Bargain", bonusDescription: 'The last piece you equipped is temporarily "on loan" — removing it halves its stats for 5 floors (the Tuatha demand full commitment).', passiveId: 'the_bargain' },
    { piecesRequired: 7, bonusName: "The Sídhe's Door", bonusDescription: "Once per run: enter the Otherworld — skip directly to the next floor's boss, arriving at full HP/SP. The boss is at 150% stats.", passiveId: 'sidhe_door' },
  ],
};

// ===================================================
// MESOPOTAMIAN — "Tablets of Anu"
// ===================================================
// Philosophy: The first gods. Older than the Tower. Their items grant structural
// advantages — seeing ahead, skipping, commanding.
// Full set: 3 random hidden achievements revealed as 'known' at run start.

export const MESOPOTAMIAN_PIECES: SacredItem[] = [
  {
    id: 'mesop_accessory_eye_marduk',
    name: 'Eye of Marduk',
    lore: 'He split Tiamat in two to make the sky. This is what that looks like held.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: "Marduk's chaos fire strikes without warning. Taunt 30 enemies and finish each with one hit.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'taunt_total', value: 30, description: 'Successfully Taunt 30 enemies lifetime, then kill each with a single attack afterward' }] },
    passiveId: 'storm_of_tiamat',
    passiveDescription: 'Once per combat, randomly inflict one of the 10 status effects on the enemy at no action cost.',
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 20, WIS: 20 } },
  },
  {
    id: 'mesop_helm_anu',
    name: 'Crown of Anu',
    lore: 'The first sky. The first law. The first eyes that watched the Tower.',
    tier: 'pantheon', slot: 'head', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Anu rewards those who push the boundary. Reach the deepest floor you have ever reached.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'floors_reached', value: 15, description: 'Reach your personal deepest floor record (at least Floor 15) on this character' }] },
    passiveId: 'sky_fathers_gaze',
    passiveDescription: 'Once per floor, you may spend 5 deity favor to advance one hidden achievement to rumored state.',
    armorStats: { slot: 'head', armorType: 'divine', finalDefense: 44, finalMagicDefense: 44, speedPenalty: 0, statBonuses: { WIS: 20, CHA: 20 } },
  },
  {
    id: 'mesop_chest_gilgamesh',
    name: 'Breastplate of Gilgamesh',
    lore: 'He built the wall of Uruk after failing to cheat death. He built something that lasted.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Gilgamesh faced death repeatedly. Complete a run reaching Floor 20+ without ever retreating.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero fleeing attempts the entire run' },
    ]},
    passiveId: 'two_thirds_divine',
    passiveDescription: 'Below 50% HP: +20% damage. Below 25% HP: +35% damage. Gilgamesh fought hardest when mortality was obvious.',
    armorStats: { slot: 'chest', armorType: 'heavy', finalDefense: 78, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { STR: 35, END: 25 } },
  },
  {
    id: 'mesop_hands_enkidu',
    name: 'Gauntlets of Enkidu',
    lore: 'He ran with them before he fought them.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'Enkidu was wild before civilization. Kill 100 beast-type enemies.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'kills_type', value: 100, targetType: 'beast', description: 'Kill 100 beast-category enemies lifetime' }] },
    passiveId: 'wild_companion',
    passiveDescription: 'Defeating a beast enemy has 20% chance to leave a spirit companion: stacks +5% to next attack (up to 5 stacks, +25% max).',
    armorStats: { slot: 'hands', armorType: 'medium', finalDefense: 42, finalMagicDefense: 28, speedPenalty: 0, statBonuses: { STR: 25, END: 20 } },
  },
  {
    id: 'mesop_legs_ishtar',
    name: 'Sandals of Ishtar',
    lore: 'She entered hell wearing her crown. It cost her everything. She got it all back.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Ishtar descended and commanded. Use CHA in 5 consecutive event rooms successfully.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'event_success', value: 5, targetType: 'CHA_check', description: '5 consecutive event CHA stat check successes in a single run' }] },
    passiveId: 'descent_of_ishtar',
    passiveDescription: "Once per character lifetime: spend 200G when entering a boss room to 'pay tribute' — the boss retreats and drops its loot without a fight.",
    armorStats: { slot: 'legs', armorType: 'divine', finalDefense: 38, finalMagicDefense: 45, speedPenalty: 0, statBonuses: { CHA: 25, AGI: 20 } },
  },
  {
    id: 'mesop_accessory_tablet',
    name: 'Tablet of Destiny',
    lore: 'Whoever holds the Tablet holds what happens next.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'The Tablets record fate. Write enough of yours to earn them.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'achievements_total', value: 10, description: 'Complete 10 achievements on one character' }] },
    passiveId: 'written_fate',
    passiveDescription: 'Once per dungeon run: peek one floor ahead — first 5 room types of the next floor are revealed on the map.',
    accessoryStats: { accessoryType: 'seal', statBonuses: { INT: 25, WIS: 20 } },
  },
  {
    id: 'mesop_weapon_flood_spear',
    name: 'Flood Spear of Enlil',
    lore: 'He sent the flood not from anger but from administrative decision.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'mesopotamian',
    setId: 'mesop_tablets', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Enlil sent the flood to drown everything. Prove you withstand what is sent to drown you. Take damage in every single combat room of a run — and still survive to Floor 25.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25' },
      { metric: 'damage_taken_run', value: 1, targetType: 'every_combat_room', description: 'Must take at least 1 damage in every combat room of the run' },
    ]},
    passiveId: 'world_ender',
    passiveDescription: 'Each time you are hit in combat, gain 1 Flood Rage stack (+2% damage each, max +40%). Stacks reset at combat end.',
    weaponStats: { scalingStat: 'END', secondaryStat: 'STR', finalDamage: 47, finalAccuracy: 92, finalCritChance: 0.22, range: 'melee', damageType: 'physical' },
  },
];

export const MESOPOTAMIAN_SET: PantheonSet = {
  id: 'mesop_tablets', name: 'Tablets of Anu', pantheonId: 'mesopotamian',
  lore: 'These are older than the Tower itself. The words on them predate the language you speak.',
  pieces: MESOPOTAMIAN_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Ancient Knowledge', bonusDescription: '+10% WIS and CHA proficiency gains.', passiveId: 'ancient_knowledge' },
    { piecesRequired: 4, bonusName: 'Ancient Authority', bonusDescription: "NPC reputation expectation tracking is disabled — merchants don't judge your spending patterns.", passiveId: 'ancient_authority' },
    { piecesRequired: 7, bonusName: 'Tablets Complete', bonusDescription: 'At the start of each run, 3 random hidden achievements are revealed as known (the Tablets show your fate).', passiveId: 'tablets_complete' },
  ],
};

// ===================================================
// HINDU — "Deva Implements"
// ===================================================
// Philosophy: Dharma, karma, right action without attachment to outcome.
// Full set: Denatus title effects doubled, second vector adjective unlocked.

export const HINDU_PIECES: SacredItem[] = [
  {
    id: 'hindu_accessory_lotus',
    name: 'Lotus of Lakshmi',
    lore: 'She stands on a lotus in a flood of gold. The lotus does not get wet.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Lakshmi is abundance made divine. Accumulate 10,000 gold across all your characters.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'gold_accumulated', value: 10000, description: 'Accumulate 10,000 gold total lifetime' }] },
    passiveId: 'abundance',
    passiveDescription: 'When entering a rest site, 20% chance to also find 200–500 gold.',
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 20, LCK: 20 } },
  },
  {
    id: 'hindu_helm_brahma',
    name: 'Diadem of Brahma',
    lore: 'Four faces, none of them looking backward.',
    tier: 'pantheon', slot: 'head', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Brahma created the universe from nothing. Create something impossible — complete a MYTHIC tier achievement.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'achievements_total', value: 1, targetType: 'mythic_tier', description: 'Complete one MYTHIC tier achievement on this character' }] },
    passiveId: 'creators_sight',
    passiveDescription: 'Once per floor, a treasure room that would not otherwise exist has 15% chance to generate.',
    armorStats: { slot: 'head', armorType: 'robes', finalDefense: 35, finalMagicDefense: 65, speedPenalty: 0, statBonuses: { INT: 25, WIS: 20 } },
  },
  {
    id: 'hindu_chest_vishnu',
    name: 'Armor of Vishnu',
    lore: 'He maintained the cosmos through 10 incarnations. The 11th is yours.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Vishnu preserves through adaptation. Reach Level 5 never selecting the same achievement tier in consecutive ceremonies.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'achievements_total', value: 1, targetType: 'no_consecutive_same_tier', description: 'No two consecutive level-up ceremonies selected the same achievement tier' },
    ]},
    passiveId: 'avatars_body',
    passiveDescription: "This armor takes the nature of your patron deity's domain, granting a domain-specific bonus (+5% per 14 domains: War=damage, Life=HP, etc).",
    armorStats: { slot: 'chest', armorType: 'divine', finalDefense: 65, finalMagicDefense: 65, speedPenalty: 0, statBonuses: { END: 30 } },
  },
  {
    id: 'hindu_hands_shiva',
    name: 'Hands of Shiva',
    lore: 'The dance destroys. The dance creates. The dance is indifferent to which it does.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Shiva's fire ends ages. Show dedication to the element that ends — apply burn 100 times lifetime.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'status_inflict', value: 100, targetType: 'burn', description: 'Apply the burn status 100 times total lifetime' }] },
    passiveId: 'cosmic_dance',
    passiveDescription: 'Each turn in combat, gain a Dance Stack (+1% all damage, max 15 stacks). Stacks reset at combat end.',
    armorStats: { slot: 'hands', armorType: 'divine', finalDefense: 40, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { STR: 25, WIS: 20 } },
  },
  {
    id: 'hindu_legs_rama',
    name: 'Sandals of Rama',
    lore: 'The longest road only seems long from the start.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Rama walked to Lanka on faith, not supplies. Complete a full run without using any consumables.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 1, targetType: 'any_boss', description: 'Reach and defeat a milestone boss' },
      { metric: 'floor_noconsumable', value: 1, description: 'Zero consumables used the entire run' },
    ]},
    passiveId: 'righteous_path',
    passiveDescription: 'Entering a new floor with no status effects grants Dharma Clarity (+15% all stats for the first combat of that floor).',
    armorStats: { slot: 'legs', armorType: 'divine', finalDefense: 40, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { STR: 20, AGI: 20 } },
  },
  {
    id: 'hindu_accessory_chakra',
    name: 'Chakra of Sudarshana',
    lore: 'It returns to Vishnu\'s finger. It returns through the skull of whoever needed it.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "Vishnu's discus is overwhelming force. Deal 10,000 total damage in a single combat encounter.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [{ metric: 'sp_damage_dealt', value: 10000, description: 'Deal 10,000 total damage in one combat' }] },
    passiveId: 'returning_edge',
    passiveDescription: 'After landing a critical hit, crit chance increases +5% for the next attack (stacks to +25% bonus).',
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 25, INT: 20 } },
  },
  {
    id: 'hindu_weapon_trishula',
    name: 'Trishula of Shiva',
    lore: 'Three prongs: past, present, future. All three end here.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'hindu',
    setId: 'hindu_deva', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "Shiva renounces everything. Your character must never have used a healing consumable in any combat encounter — not this run, not ever in their lifetime.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'boss_kills', value: 1, description: 'Defeat any Floor 20+ boss on this character' },
      { metric: 'skill_uses', value: 0, targetType: 'heal_consumable_in_combat_ever', description: 'Zero healing consumables used in combat — lifetime, on this character' },
    ]},
    passiveId: 'third_eye_open',
    passiveDescription: "Once per combat, Shiva's gaze: simultaneously inflict burn, blind, AND weaken on the enemy at no action cost.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 53, finalAccuracy: 90, finalCritChance: 0.25, range: 'melee', damageType: 'holy' },
  },
];

export const HINDU_SET: PantheonSet = {
  id: 'hindu_deva', name: 'Deva Implements', pantheonId: 'hindu',
  lore: 'Not earned through strength. Earned through correct action performed without attachment to outcome.',
  pieces: HINDU_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Dharma Path', bonusDescription: '+15% INT and WIS proficiency.', passiveId: 'dharma_path' },
    { piecesRequired: 4, bonusName: 'Karmic Cycle', bonusDescription: 'Each character death and reincarnation adds +3% to all base stats on the next character (max +30% total).', passiveId: 'karmic_cycle' },
    { piecesRequired: 7, bonusName: "Moksha's Path", bonusDescription: 'Paragon Denatus title effects are 2× as strong. A second title adjective from your second-highest behavement vector activates.', passiveId: 'moksha_path' },
  ],
};

// ===================================================
// CHINESE — "Mandate of Heaven"
// ===================================================
// Philosophy: Heaven observes. Virtue accumulates. Balance of yin and yang.
// Full set: Any achievement completed in the same run grants 1.5× bonus value.

export const CHINESE_PIECES: SacredItem[] = [
  {
    id: 'chinese_accessory_pearl',
    name: 'Pearl of the Dragon',
    lore: 'The dragon chases it forever. You hold it.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: "The dragon pearl contains everything the dragon values. Show you value what dragons value.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 1000, description: 'Have 1,000+ gold' },
      { metric: 'boss_kills_run', value: 1, description: 'Defeat a Floor 15+ milestone boss in this run' },
    ]},
    passiveId: 'celestial_pearl',
    passiveDescription: 'Once per run, fully restore all SP.',
    accessoryStats: { accessoryType: 'amulet', statBonuses: { LCK: 20, INT: 20 } },
  },
  {
    id: 'chinese_helm_jade',
    name: 'Crown of the Jade Emperor',
    lore: "Heaven's throne is maintained through virtue, not just power.",
    tier: 'pantheon', slot: 'head', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: "The Jade Emperor governs all deities. Show you have engaged with many domains.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'favor_favoured_child', value: 2, description: 'Reach Favoured Child status (91+ favor) with any 2 different deities lifetime' }] },
    passiveId: 'celestial_mandate',
    passiveDescription: 'Entering combat at full HP: +10% damage. Entering with full SP: +10% skill damage.',
    armorStats: { slot: 'head', armorType: 'divine', finalDefense: 45, finalMagicDefense: 45, speedPenalty: 0, statBonuses: { WIS: 25, CHA: 20 } },
  },
  {
    id: 'chinese_chest_dragon',
    name: 'Dragon Scale Armor',
    lore: "The dragon doesn't flee. The dragon is the direction everything else flees from.",
    tier: 'pantheon', slot: 'chest', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'The dragon clears its floor completely. Reach Floor 20 — never retreating and never avoiding a single combat room.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'floor_noretreat', value: 1, description: 'Zero fleeing attempts the entire run' },
    ]},
    passiveId: 'dragon_spirit',
    passiveDescription: 'At full HP, cannot be reduced below 1 HP by a single hit (once per combat). The dragon cannot be killed by one blow.',
    armorStats: { slot: 'chest', armorType: 'heavy', finalDefense: 80, finalMagicDefense: 45, speedPenalty: 0, statBonuses: { END: 35 } },
  },
  {
    id: 'chinese_hands_monkey',
    name: "Monkey King's Gloves",
    lore: 'He was imprisoned under a mountain for 500 years. That was the slow part.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Sun Wukong was never where you expected. Make enemies miss 75 times.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'dodges_total', value: 75, description: 'Cause enemies to miss you 75 times lifetime (via dodge or accuracy failure)' }] },
    passiveId: '72_transformations',
    passiveDescription: 'Once per combat: choose to transform — your weapon scaling stat randomly changes to a different stat for that fight.',
    armorStats: { slot: 'hands', armorType: 'light', finalDefense: 35, finalMagicDefense: 35, speedPenalty: 0, statBonuses: { AGI: 25, LCK: 20 } },
  },
  {
    id: 'chinese_legs_court',
    name: 'Boots of the Celestial Court',
    lore: 'The court is not navigated by strength. It is navigated by knowing everyone.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'The Celestial Court rewards loyal patrons. Visit both the General Store and Equipment Vendor 15 times total.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'shop_visits', value: 15, targetType: 'both_general_and_equipment', description: 'Visit both General Store and Equipment Vendor — 15 total visits combined lifetime' }] },
    passiveId: 'court_walker',
    passiveDescription: 'NPC reputation expectation scores never increase (merchants track your history but never hold it against you).',
    armorStats: { slot: 'legs', armorType: 'divine', finalDefense: 42, finalMagicDefense: 42, speedPenalty: 0, statBonuses: { CHA: 20, WIS: 20 } },
  },
  {
    id: 'chinese_accessory_iching',
    name: 'I Ching Coin',
    lore: 'Heaven and Earth. Wind and Thunder. Water and Fire. Mountain and Lake. You ask which? Yes.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "The I Ching requires all eight trigrams in balance. Have 6 different stats at Grade C or above simultaneously.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'stats_grade', value: 6, targetType: 'C_or_above', description: '6 different stats at Grade C or above on one character simultaneously' }] },
    passiveId: 'eight_trigrams',
    passiveDescription: 'At the start of each combat: 50% chance for +20% damage, 50% chance for +20% defense. The coin cannot be predicted.',
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 25, WIS: 20 } },
  },
  {
    id: 'chinese_weapon_guan_yu',
    name: 'Green Dragon Crescent Blade',
    lore: 'Guan Yu became a god through loyalty, not victory. The blade followed.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'chinese',
    setId: 'china_mandate', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "Guan Yu's loyalty was unconditional across many lifetimes. Defeat the same milestone boss three separate times — each time using a completely different weapon category.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'boss_kills', value: 3, targetType: 'same_boss_different_weapon_categories', description: 'Defeat any single milestone boss 3 times total, each time with a different weapon stat-category equipped' }] },
    passiveId: 'eternal_loyalty',
    passiveDescription: 'Gains +2 damage for each boss ever defeated (lifetime, never resets). At 25 bosses: additional +15% crit chance.',
    weaponStats: { scalingStat: 'STR', finalDamage: 54, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
];

export const CHINESE_SET: PantheonSet = {
  id: 'china_mandate', name: 'Mandate of Heaven', pantheonId: 'chinese',
  lore: 'Heaven observes. When enough virtue has accumulated in one mortal vessel, these descend.',
  pieces: CHINESE_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Celestial Favor', bonusDescription: '+15% LCK proficiency.', passiveId: 'celestial_favor' },
    { piecesRequired: 4, bonusName: 'Dragon Harmony', bonusDescription: 'When all 8 stats are at Grade C+: permanent +10% damage that cannot be removed by status effects.', passiveId: 'dragon_harmony' },
    { piecesRequired: 7, bonusName: "Heaven's Approval", bonusDescription: 'Any achievement completed in the same run as equipping the full set grants its bonus at 1.5× value.', passiveId: 'heavens_approval' },
  ],
};

// ===================================================
// SLAVIC — "Gifts of Veles and Perun"
// ===================================================

export const SLAVIC_PIECES: SacredItem[] = [
  {
    id: 'slavic_accessory_rusalka',
    name: 'Ring of the Rusalka',
    lore: 'She pulls you under. She lets you breathe. This is what passing costs.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Rusalki drown those they choose to save. Survive what poisons you 25 times.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'status_received_survived', value: 25, targetType: 'any_dot', description: 'Survive 25 damage-over-time status effects total lifetime (poison or burn ticking to 0 duration)' }] },
    passiveId: 'river_magic',
    passiveDescription: 'Once per combat: spend 20 HP to restore 40 SP.',
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 20, CHA: 20 } },
  },
  {
    id: 'slavic_helm_perun',
    name: "Helm of Perun's Thunder",
    lore: 'Perun strikes his own champions. It is how they become champions.',
    tier: 'pantheon', slot: 'head', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Stand in the storm without flinching. Be stunned 3 times in a single combat and win.',
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [{ metric: 'status_received_survived', value: 3, targetType: 'stun_same_fight', description: 'Be stunned 3 times in one combat and win the fight' }] },
    passiveId: 'thunderhead',
    passiveDescription: 'Being stunned now grants +20% damage on your next action instead of being purely negative.',
    armorStats: { slot: 'head', armorType: 'heavy', finalDefense: 52, finalMagicDefense: 30, speedPenalty: 0, statBonuses: { STR: 20, END: 15 } },
  },
  {
    id: 'slavic_chest_veles',
    name: "Serpent Scale Armor of Veles",
    lore: 'He ruled the dead with patience, not battle. So does this armor.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Veles never confronts Perun directly. Reach Floor 10 by having avoided (fled or bypassed) at least 3 different combat rooms.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'flee_total', value: 3, description: 'Successfully avoid at least 3 combat rooms in this run' },
    ]},
    passiveId: 'underworld_scales',
    passiveDescription: 'Each time you take status effect damage (not direct damage), gain +2% damage for the rest of that combat.',
    armorStats: { slot: 'chest', armorType: 'divine', finalDefense: 68, finalMagicDefense: 58, speedPenalty: 0, statBonuses: { END: 25 } },
  },
  {
    id: 'slavic_hands_volkhv',
    name: 'Gloves of the Volkhv',
    lore: 'The volkhv spoke to the world. The world helped.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'The Slavic shaman used all forms of power. Use skills 50 times in a single run across 20+ different enemy kills.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 50, description: 'Use skills 50 times in one run' },
      { metric: 'kills_total', value: 20, targetType: 'different_types', description: 'Kill 20+ different enemy types in that run' },
    ]},
    passiveId: 'shamanic_hands',
    passiveDescription: 'Using a skill immediately after another skill in the same combat turn gives the second skill +15% power.',
    armorStats: { slot: 'hands', armorType: 'medium', finalDefense: 40, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { WIS: 25, INT: 20 } },
  },
  {
    id: 'slavic_legs_leshy',
    name: 'Boots of the Leshy',
    lore: 'He leads travelers astray. He likes you too much to do that.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'The Leshy lives where paths are unclear. Explore 50 mystery rooms lifetime.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'mystery_rooms', value: 50, description: 'Explore 50 mystery rooms total lifetime' }] },
    passiveId: 'lost_in_forest',
    passiveDescription: 'Mystery rooms always contain a weapon reward, shrine encounter, or treasure — never a raw combat.',
    armorStats: { slot: 'legs', armorType: 'light', finalDefense: 32, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { AGI: 20, PER: 20 } },
  },
  {
    id: 'slavic_accessory_domovoi',
    name: "Domovoi's Luck Charm",
    lore: 'He cleaned your boots while you slept. He will keep doing it.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'The Domovoi only helps those who return home. Visit the Familia Home 10 times on one character without dying.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'familia_visits', value: 10, description: '10 Familia Home visits on one character without dying' }] },
    passiveId: 'household_guardian',
    passiveDescription: 'Familia Home rest restores +20% extra HP and SP. Shop and blacksmith reputation never drop below 0.',
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 25, CHA: 15 } },
  },
  {
    id: 'slavic_weapon_svarog_hammer',
    name: "Svarog's Cosmic Hammer",
    lore: 'Made at the forge where sky touches earth. Both deities signed it.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'slavic',
    setId: 'slavic_cosmic', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "The cosmos alternates. Perun and Veles trade dominance. In a single run reaching Floor 20+, alternate between resting and not-resting on consecutive floors: rest on odd floors if sites exist, skip rest on even floors entirely.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'rest_sites_used', value: 1, targetType: 'alternating_floor_pattern', description: 'Rest on odd-numbered floors (when available) and avoid resting on even-numbered floors' },
    ]},
    passiveId: 'cosmic_hammer',
    passiveDescription: 'Alternates modes each turn: Perun Mode (attack turns: +25% damage) → Veles Mode (defend turns: +30% damage reduction). The weapon knows which you chose.',
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 49, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
];

export const SLAVIC_SET: PantheonSet = {
  id: 'slavic_cosmic', name: "Gifts of Veles and Perun", pantheonId: 'slavic',
  lore: "These items exist at the intersection of two eternal conflicts. To claim them, you must stand in both worlds.",
  pieces: SLAVIC_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Cosmic Balance', bonusDescription: '+15% END proficiency.', passiveId: 'cosmic_balance_2' },
    { piecesRequired: 4, bonusName: 'Dual Nature', bonusDescription: 'HP and SP refill each other at 5% per floor: when HP is full, excess healing transfers to SP.', passiveId: 'dual_nature' },
    { piecesRequired: 7, bonusName: "World Tree's Root", bonusDescription: "Once per run: one death-dealing blow is absorbed into the Root; you survive at 5% HP. The Root shatters after one use.", passiveId: 'world_tree_root' },
  ],
};

// ===================================================
// AZTEC — "Instruments of the Fifth Sun"
// ===================================================

export const AZTEC_PIECES: SacredItem[] = [
  {
    id: 'aztec_accessory_jade',
    name: 'Jade Earring of Tlaloc',
    lore: 'He demanded children. He got devotion instead. He accepted it.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Tlaloc controls rain and death by water. Let status effects touch you 25 times.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'status_received_survived', value: 25, description: 'Receive 25 any-type status effects (let them tick — no premature curing) lifetime' }] },
    passiveId: 'rain_gods_gift',
    passiveDescription: 'Once per combat: clear ALL status effects on yourself at the cost of 30 SP.',
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 20, END: 20 } },
  },
  {
    id: 'aztec_helm_quetzalcoatl',
    name: 'Headdress of Quetzalcoatl',
    lore: 'The god who taught civilization. The civilization that sacrificed him.',
    tier: 'pantheon', slot: 'head', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'The Feathered Serpent valued beauty in combat. Complete a run using only AGI or CHA-scaling weapons.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'kills_with_stat', value: 1, targetType: 'AGI_or_CHA_only', description: 'Complete a run using exclusively AGI or CHA weapons' }] },
    passiveId: 'feathered_wisdom',
    passiveDescription: 'When your WIS grade exceeds your STR grade: deal +15% magic damage.',
    armorStats: { slot: 'head', armorType: 'light', finalDefense: 35, finalMagicDefense: 55, speedPenalty: 0, statBonuses: { AGI: 20, INT: 20 } },
  },
  {
    id: 'aztec_chest_xipe',
    name: "Xipe Totec's Flayed Armor",
    lore: 'Xipe Totec is the god of seasons. The old skin must die for the new to grow.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Xipe Totec's priests wore flayed skin — sacrifice through enduring suffering. Take over 2,000 damage in a single run and reach Floor 20.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'damage_taken_run', value: 2000, description: 'Take 2,000+ total damage in a single run' },
      { metric: 'floors_reached', value: 20, description: 'Still reach Floor 20' },
    ]},
    passiveId: 'renewal_through_suffering',
    passiveDescription: 'Each time you survive below 30% HP in a combat, max HP permanently increases by 2% (max +30% per character).',
    armorStats: { slot: 'chest', armorType: 'medium', finalDefense: 65, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { END: 30 } },
  },
  {
    id: 'aztec_hands_huitzilopochtli',
    name: 'Gauntlets of Huitzilopochtli',
    lore: 'Every kill is an offering. The sun is always hungry.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'Huitzilopochtli is the war sun god — blood feeds the sun. Kill 200 enemies with physical weapons lifetime.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'kills_with_stat', value: 200, targetType: 'STR_or_AGI', description: 'Kill 200 enemies with STR or AGI weapons lifetime' }] },
    passiveId: 'blood_of_sun',
    passiveDescription: 'Every 5th kill in a run releases stored solar energy: deal +30% damage for the next 3 attacks.',
    armorStats: { slot: 'hands', armorType: 'heavy', finalDefense: 48, finalMagicDefense: 15, speedPenalty: 0, statBonuses: { STR: 30 } },
  },
  {
    id: 'aztec_legs_coatlicue',
    name: 'Sandals of Coatlicue',
    lore: 'Her skirt is made of serpents. She stands on the skulls of those who disagreed.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Coatlicue never retreats. Reach Floor 25 on a character who has never once fled from combat.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25' },
      { metric: 'flee_total', value: 0, description: 'Zero flee attempts this character lifetime' },
    ]},
    passiveId: 'serpent_skirt',
    passiveDescription: 'Immune to fear effects, taunt effects, and accuracy reduction from enemy abilities.',
    armorStats: { slot: 'legs', armorType: 'heavy', finalDefense: 50, finalMagicDefense: 25, speedPenalty: 0, statBonuses: { END: 25, STR: 20 } },
  },
  {
    id: 'aztec_accessory_mirror',
    name: 'Mirror of Tezcatlipoca',
    lore: 'The smoking mirror shows you what you are. It shows them what they are.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "Tezcatlipoca's mirror shows truth. Observe 100 enemies lifetime AND dodge 20 attacks you knew were coming.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 100, description: 'Observe 100 enemies lifetime' },
      { metric: 'dodges_total', value: 20, description: 'Successfully dodge 20 attacks lifetime' },
    ]},
    passiveId: 'smoking_mirror',
    passiveDescription: "Enemy HP is always shown exactly. Once per combat: 'smoking mirror reveal' — see the exact HP threshold for the enemy to change behavior, plus all resistances.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 25, PER: 20 } },
  },
  {
    id: 'aztec_weapon_macuahuitl',
    name: 'Macuahuitl of the Flower War',
    lore: 'The Aztecs did not fight to kill. They fought to capture. This weapon prefers otherwise.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'aztec',
    setId: 'aztec_fifth_sun', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "The Flower War: fight at maximum disadvantage and still win. Defeat any milestone boss while simultaneously afflicted by burn, poison, AND bleed.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Defeat a milestone boss' },
      { metric: 'debuffs_active_boss', value: 3, targetType: 'burn_poison_bleed_simultaneously', description: 'During the killing blow: burn + poison + bleed all active on you simultaneously' },
    ]},
    passiveId: 'obsidian_edge',
    passiveDescription: 'Enemies with any status effect you applied take +15% damage. With 3+ active status effects: +30%. Applies bleed on every hit (100% chance).',
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 51, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
];

export const AZTEC_SET: PantheonSet = {
  id: 'aztec_fifth_sun', name: 'Instruments of the Fifth Sun', pantheonId: 'aztec',
  lore: 'Huitzilopochtli does not reward survivors. He rewards those who bleed for the sun\'s continuation.',
  pieces: AZTEC_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: 'Blood Tribute', bonusDescription: 'After defeating a boss, restore 25% max HP.', passiveId: 'blood_tribute' },
    { piecesRequired: 4, bonusName: 'Solar Power', bonusDescription: '+15% STR proficiency gains.', passiveId: 'solar_power' },
    { piecesRequired: 7, bonusName: 'Fifth Sun Rising', bonusDescription: 'On the first combat after entering each new floor: deal 50% bonus damage on ALL attacks.', passiveId: 'fifth_sun_rising' },
  ],
};

// ===================================================
// ARS GOETIA — "Seals of Solomon"
// ===================================================

export const GOETIA_PIECES: SacredItem[] = [
  {
    id: 'goetia_accessory_paimon',
    name: 'Seal of Paimon',
    lore: 'He arrives with great noise. He leaves you knowing more than before.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Paimon teaches all arts. Demonstrate you have learned many.',
    acquisition: { scope: 'single_run', requireAll: true, requirements: [{ metric: 'skill_uses', value: 10, targetType: 'different_skill_ids', description: 'Use 10 different skills in a single run' }] },
    passiveId: 'paimon_instruction',
    passiveDescription: 'Each different skill used permanently reduces that skill\'s SP cost by 1 for this character (max -5 per skill).',
    accessoryStats: { accessoryType: 'seal', statBonuses: { INT: 20, CHA: 20 } },
  },
  {
    id: 'goetia_helm_buer',
    name: 'Crown of Buer',
    lore: 'Buer teaches logic. This is logic applied to what you should not know.',
    tier: 'pantheon', slot: 'head', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: "Buer teaches philosophy and virtue. Apply knowledge before power — observe ancient enemies before ending them.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'observe_total', value: 10, targetType: 'ancient_or_mythic_prefix', description: 'Observe 10 enemies with "Ancient" or "Mythic" prefix' },
      { metric: 'kills_total', value: 10, targetType: 'no_first_turn_damage', description: 'Kill all 10 without taking damage in the first turn of each fight' },
    ]},
    passiveId: 'philosophers_crown',
    passiveDescription: 'Observing an enemy has 15% chance to learn a hidden weakness applicable to ALL enemies of that type for the rest of your character lifetime.',
    armorStats: { slot: 'head', armorType: 'robes', finalDefense: 30, finalMagicDefense: 65, speedPenalty: 0, statBonuses: { WIS: 20, INT: 20 } },
  },
  {
    id: 'goetia_chest_forneus',
    name: 'Armor of Forneus',
    lore: 'He taught 72 languages. The 73rd was the one you needed.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: 'Forneus teaches language and persuasion. Complete 20 boss dialogue exchanges lifetime.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'event_success', value: 20, targetType: 'boss_dialogue_any', description: 'Interact with boss dialogue (not necessarily bypass) 20 times lifetime' }] },
    passiveId: 'language_of_abyss',
    passiveDescription: 'Boss dialogue reveals an additional hidden choice option visible only to you, usually leading to a unique outcome.',
    armorStats: { slot: 'chest', armorType: 'divine', finalDefense: 62, finalMagicDefense: 62, speedPenalty: 0, statBonuses: { CHA: 25, INT: 25 } },
  },
  {
    id: 'goetia_hands_beleth',
    name: 'Gloves of Beleth',
    lore: 'Kings do not dodge. They make others miss.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Beleth commands 85 legions. Make enemies miss you 50 times while you were the one attacking.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'dodges_total', value: 50, description: 'Cause enemies to miss 50 times lifetime' }] },
    passiveId: 'demon_kings_touch',
    passiveDescription: 'Basic attacks have 10% chance to "dominate" the enemy for 1 turn — they attack themselves for 50% of their normal damage.',
    armorStats: { slot: 'hands', armorType: 'divine', finalDefense: 40, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { AGI: 25, CHA: 20 } },
  },
  {
    id: 'goetia_legs_dantalion',
    name: 'Boots of Dantalion',
    lore: '72 faces. You only needed one.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Dantalion changes form to escape — as must you. Flee from 5 different boss-type enemies lifetime.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'flee_boss', value: 5, description: 'Successfully flee from 5 different milestone boss encounters lifetime' }] },
    passiveId: 'the_shapechanger',
    passiveDescription: 'Flee attempts from boss enemies now always succeed. Once per run: re-enter a cleared combat room as if unseen (enemy resets, fresh loot roll).',
    armorStats: { slot: 'legs', armorType: 'light', finalDefense: 35, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { AGI: 25, LCK: 20 } },
  },
  {
    id: 'goetia_accessory_astaroth',
    name: 'Ring of Astaroth',
    lore: 'He has counted every coin since time began. He knows which ones belong to you.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Astaroth guards the treasury of hell. Accumulate 50,000 gold lifetime across all characters.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'gold_accumulated', value: 50000, description: 'Accumulate 50,000 gold lifetime across all characters' }] },
    passiveId: 'hells_treasurer',
    passiveDescription: 'When you spend gold at any shop, 10% of the amount spent returns to you as commission.',
    accessoryStats: { accessoryType: 'ring', statBonuses: { LCK: 25, INT: 20 } },
  },
  {
    id: 'goetia_weapon_marbas',
    name: 'Grand Stave of Marbas',
    lore: 'Marbas knew every disease and its cure. Occasionally he used only the first half.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'ars_goetia',
    setId: 'goetia_solomon', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "Marbas teaches disease and engineering. Defeat Sorath (Floor 10) using only skills — no basic attacks — and deliver the killing blow with a skill that inflicts a status effect.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_skillonly', value: 1, targetType: 'sorath', description: 'Defeat Sorath using zero basic attacks' },
      { metric: 'status_inflict', value: 1, targetType: 'killing_blow_sorath', description: 'The killing blow must apply a status effect' },
    ]},
    passiveId: 'grand_grimoire',
    passiveDescription: 'Killing an enemy has 15% chance to "learn their name" — enemies with known names take +20% damage from all your attacks. Names persist across characters.',
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 92, finalCritChance: 0.30, range: 'melee', damageType: 'magic' },
  },
];

export const GOETIA_SET: PantheonSet = {
  id: 'goetia_solomon', name: 'Seals of Solomon', pantheonId: 'ars_goetia',
  lore: 'Solomon commanded 72. You need command only your own nature — but that is harder.',
  pieces: GOETIA_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: "Solomon's Seal", bonusDescription: "Once per floor: 'bind' one enemy — they deal -20% damage and cannot flee.", passiveId: 'solomons_seal' },
    { piecesRequired: 4, bonusName: 'Forbidden Studies', bonusDescription: '+15% INT and LCK proficiency.', passiveId: 'forbidden_studies' },
    { piecesRequired: 7, bonusName: '72 Legions', bonusDescription: 'Once per run: for 3 turns your damage is tripled (the 72 lend their strength). One random equipment piece loses half its stats for 5 floors afterward — payment due.', passiveId: 'seventy_two_legions' },
  ],
};

// ===================================================
// FALLEN ANGELS — "Instruments of the Fall"
// ===================================================

export const FALLEN_PIECES: SacredItem[] = [
  {
    id: 'fallen_accessory_israfel',
    name: 'Tear of Israfel',
    lore: "He hasn't played the last note yet. He gave you a smaller one.",
    tier: 'pantheon', slot: 'accessory', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 0, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'The last trumpet has not sounded. The ascension ceremonies are still possible. Complete 3 of them.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'level_reached', value: 2, targetType: 'ascension_ceremonies_3', description: 'Complete the Level 2+ Ascension Ceremony (at any level) 3 times across all characters' }] },
    passiveId: 'the_last_note',
    passiveDescription: "When you die, the next character you create starts with +15% all stats for their first 5 floors.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 20, CHA: 20 } },
  },
  {
    id: 'fallen_helm_lucifer',
    name: 'Halo of Lucifer',
    lore: 'The light was brighter before it fell. So was this.',
    tier: 'pantheon', slot: 'head', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 1, revealFavorRequired: 30, isSecret: false,
    acquisitionHint: 'Lucifer was the brightest of all. Reach Level 5 with ALL stats at Grade C or above.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'stats_grade', value: 8, targetType: 'C_or_above', description: 'ALL 8 stats at Grade C or above on this character simultaneously' },
    ]},
    passiveId: 'morning_star',
    passiveDescription: 'The first attack each combat is guaranteed to be a critical hit.',
    armorStats: { slot: 'head', armorType: 'divine', finalDefense: 48, finalMagicDefense: 48, speedPenalty: 0, statBonuses: { INT: 25, WIS: 25 } },
  },
  {
    id: 'fallen_chest_azazel',
    name: 'Armor of Azazel',
    lore: 'He taught them to make swords. Heaven disapproved. Swords did not.',
    tier: 'pantheon', slot: 'chest', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 2, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Azazel gave humanity metalwork. Honor the forbidden gift — upgrade any weapon through 3 quality tiers at the Blacksmith.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'weapon_upgrades', value: 3, targetType: 'same_weapon_three_tiers', description: 'Upgrade the same weapon through 3 consecutive quality tiers at the Blacksmith' }] },
    passiveId: 'forbidden_metal',
    passiveDescription: 'Weapons upgraded at the Blacksmith gain +5% damage for each quality tier upgraded (max +25%).',
    armorStats: { slot: 'chest', armorType: 'divine', finalDefense: 75, finalMagicDefense: 55, speedPenalty: 0, statBonuses: { END: 30 } },
  },
  {
    id: 'fallen_hands_samyaza',
    name: 'Gauntlets of Samyaza',
    lore: 'The Watchers fell for loving too much. Their hands remember what they gave up.',
    tier: 'pantheon', slot: 'hands', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 3, revealFavorRequired: 60, isSecret: false,
    acquisitionHint: "Samyaza led the Watchers who fell for devotion. Be the Favoured Child for 5 consecutive dungeon runs on the same character.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'favor_favoured_child', value: 5, targetType: 'consecutive_runs', description: 'Maintain 91+ deity favor across 5 consecutive dungeon runs' }] },
    passiveId: 'watchers_grip',
    passiveDescription: 'Once per combat: observe the enemy perfectly for 1 turn (zero damage, zero action) — their next 3 moves are fully revealed.',
    armorStats: { slot: 'hands', armorType: 'divine', finalDefense: 40, finalMagicDefense: 40, speedPenalty: 0, statBonuses: { CHA: 25, STR: 20 } },
  },
  {
    id: 'fallen_legs_raum',
    name: 'Boots of Raum',
    lore: 'He destroys cities. You destroy junk. He respects the effort.',
    tier: 'pantheon', slot: 'legs', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 4, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Raum is the angel of destruction. Destroy 50 items lifetime.',
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [{ metric: 'items_destroyed', value: 50, description: 'Destroy 50 items using discard/drop functions lifetime' }] },
    passiveId: 'raums_path',
    passiveDescription: 'Once per run: a random item in your inventory is destroyed involuntarily — in exchange, gain a buff equal to 50% of that item\'s sell value as temporary stats for 10 floors.',
    armorStats: { slot: 'legs', armorType: 'medium', finalDefense: 45, finalMagicDefense: 38, speedPenalty: 0, statBonuses: { AGI: 20, STR: 20 } },
  },
  {
    id: 'fallen_accessory_metatron',
    name: 'Sigil of Metatron',
    lore: 'He was human. He writes God\'s words now. The gap is smaller than you think.',
    tier: 'pantheon', slot: 'accessory', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 5, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: 'Metatron was once Enoch — human, transcended. Reach Level 10 Paragon on any character.',
    acquisition: { scope: 'single_character', requireAll: true, requirements: [{ metric: 'paragon', value: 1, description: 'Complete the Denatus at Level 10 (Paragon)' }] },
    passiveId: 'scribe_of_heaven',
    passiveDescription: 'Paragon Denatus title effects are 2× strength. Second highest behavement vector also generates a title adjective.',
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 30, INT: 25 } },
  },
  {
    id: 'fallen_weapon_jophiel',
    name: 'Flaming Sword of Jophiel',
    lore: 'He was placed to keep humanity out of Eden. You have his weapon. Figure that out.',
    tier: 'pantheon', slot: 'weapon', pantheonId: 'fallen_angels',
    setId: 'fallen_fall', setPieceIndex: 6, revealFavorRequired: 80, isSecret: false,
    acquisitionHint: "You have fallen from the garden. There is no rest here anymore. Complete a full run reaching Floor 20+ without ever visiting a rest site or using a healing consumable.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'rest_sites_used', value: 0, description: 'Zero rest sites used the entire run' },
      { metric: 'floor_noconsumable', value: 1, description: 'Zero healing consumables used' },
    ]},
    passiveId: 'paradise_lost',
    passiveDescription: "Burns with sacred fire: every 3rd attack applies burn. Enemies killed while burning drop +25% gold and +50% base material. The fire never goes out.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'INT', finalDamage: 56, finalAccuracy: 92, finalCritChance: 0.22, range: 'melee', damageType: 'holy' },
  },
];

export const FALLEN_SET: PantheonSet = {
  id: 'fallen_fall', name: 'Instruments of the Fall', pantheonId: 'fallen_angels',
  lore: 'They fell choosing to fall. These items choose you — but you must first choose them.',
  pieces: FALLEN_PIECES.map(p => p.id),
  bonuses: [
    { piecesRequired: 2, bonusName: "Light Before the Fall", bonusDescription: '+15% WIS proficiency.', passiveId: 'light_before_fall' },
    { piecesRequired: 4, bonusName: "The Fall's Gift", bonusDescription: 'Once per run: perfect insight into one random boss — their first 5 moves are revealed before the fight.', passiveId: 'fall_gift' },
    { piecesRequired: 7, bonusName: 'Morningstar Ascending', bonusDescription: 'All enemies on your current floor are 10% weaker while the complete set is equipped (celestial authority radiates).', passiveId: 'morningstar_ascending' },
  ],
};
