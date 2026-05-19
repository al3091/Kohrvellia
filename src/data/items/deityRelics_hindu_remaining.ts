/**
 * Hindu Deity Relics — Remaining deities not in deityRelics_south.ts
 * Lakshmi, Saraswati, Hanuman, Agni, Varuna, Surya, Durga, Parvati,
 * Kartikeya, Krishna, Rama, Yama, Vayu, Kubera, Chandra, Brihaspati,
 * Shani, Narasimha, Dattatreya
 * (Skanda = Kartikeya — checking they are the same deity here)
 */

import type { DeityRelicPair } from './deityRelics';

const LAKSHMI_RELICS: DeityRelicPair = {
  deityId: 'lakshmi',
  weapon: {
    id: 'deity_lakshmi_weapon', name: "Lotus Mace of Fortune",
    lore: "She emerged from the cosmic ocean during the churning of the milky sea, lotus in hand. She is the goddess of wealth, fortune, and prosperity — and of beautiful things earned through virtue.",
    tier: 'deity', slot: 'weapon', deityId: 'lakshmi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fortune favors the virtuous, not the merely greedy. My mace goes to those who demonstrate prosperity through right action: accumulate 30,000 gold across your lifetime AND visit shops at least 15 times lifetime. Commerce is sacred when it flows from virtue. The lotus grows in muddy water but remains pure. Show me you prosper with both.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 30000, description: 'Accumulate 30,000 total gold lifetime' },
      { metric: 'shop_visits', value: 15, description: 'Visit shops 15 times lifetime' },
    ]},
    passiveId: 'lakshmi_mace_passive',
    passiveDescription: "Fortune's Blessing: gold dropped by enemies is +25% more. Additionally: when you enter a floor with 2,000+ gold, deal +15% damage (the prosperity of Lakshmi empowers the virtuous wealthy).",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'CHA', finalDamage: 44, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_lakshmi_accessory', name: "Padma Lotus Pendant",
    lore: "The lotus is Lakshmi's symbol — purity emerging from depth. The pendant is carved from the lotus that bloomed at the cosmic churning.",
    tier: 'deity', slot: 'accessory', deityId: 'lakshmi',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the goddess of the lotus — beauty that grows from depths. My pendant goes to those who have both LCK and CHA at grade B or higher on the same character. Fortune and charm together. The lotus does not grow in clear water. It requires the depths. Show me both grades.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'stats_grade', value: 1, targetType: 'LCK_and_CHA_both_grade_B_or_higher', description: 'Both LCK and CHA at grade B or higher on the same character' },
    ]},
    passiveId: 'lakshmi_lotus_passive',
    passiveDescription: "Lotus Grace: LCK and CHA both contribute to damage calculations (each at 50% efficiency of STR scaling). The doubly-blessed character is doubly-empowered.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { LCK: 28, CHA: 20 } },
  },
};

const SARASWATI_RELICS: DeityRelicPair = {
  deityId: 'saraswati',
  weapon: {
    id: 'deity_saraswati_weapon', name: "Veena String-Blade",
    lore: "She plays the veena — the lute of divine knowledge. Her music is said to contain the entire Vedas. This weapon plays a different kind of note.",
    tier: 'deity', slot: 'weapon', deityId: 'saraswati',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am knowledge, learning, and the arts. All wisdom flows through me. My veena-blade goes to those who have observed and studied: use the Observe action on every unique enemy type in the game. Complete the bestiary — every monster recorded. The veena requires knowledge of every note before it can play the whole composition.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'complete_bestiary_all_unique_enemies', description: 'Observe every unique enemy type in the game (complete bestiary)' },
    ]},
    passiveId: 'saraswati_veena_passive',
    passiveDescription: "Vedic Harmony: magic skills deal +20% more damage. Additionally: each unique enemy type you have observed and recorded in the bestiary adds +0.5% damage (max +20% from 40 unique enemies). The goddess of knowledge rewards comprehensive study.",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 96, finalCritChance: 0.28, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_saraswati_accessory', name: "White River Lotus Bracelet",
    lore: "Saraswati is also the sacred river Sarasvati, which disappeared into the earth. The bracelet carries water from the hidden river.",
    tier: 'deity', slot: 'accessory', deityId: 'saraswati',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Knowledge is a river that never stops flowing. My bracelet goes to those who have proven consistent study: use skills in combat 200 times total across your lifetime. Every skill use is a note on the veena. Two hundred notes in the composition of your mastery.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 200, description: 'Use skills 200 times total lifetime' },
    ]},
    passiveId: 'saraswati_bracelet_passive',
    passiveDescription: "Hidden River's Wisdom: SP regenerates 1 extra point per turn in combat. Additionally: every 10th skill use in a run is free (0 SP cost) — the river of knowledge flows freely to those who consistently draw from it.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { INT: 25, WIS: 22 } },
  },
};

const HANUMAN_RELICS: DeityRelicPair = {
  deityId: 'hanuman',
  weapon: {
    id: 'deity_hanuman_weapon', name: "Mace of the Devoted Warrior",
    lore: "He carried a mountain to find the healing herb for Lakshmana. He is the perfect devotee — strength in service of love.",
    tier: 'deity', slot: 'weapon', deityId: 'hanuman',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I tore open my chest to show Rama's image in my heart. Devotion made me the most powerful being in creation. My mace goes to those who demonstrate devotion and strength together: kill 100 enemies using only melee attacks — no skills, no ranged, just direct strikes — in a single run reaching Floor 10. Strength that needs no augmentation. The devoted warrior who carries mountains uses his own arms.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_with_stat', value: 100, targetType: 'melee_basic_attacks_only', description: 'Kill 100 enemies with basic melee attacks (no skills, no ranged) in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'hanuman_mace_passive',
    passiveDescription: "Devoted Strength: STR gains +50% effectiveness for damage calculations (Hanuman's devotion amplifies raw strength). Additionally: basic attacks have a 15% chance to deal double damage — the devoted strike lands twice.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 52, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_hanuman_accessory', name: "Sanjeevani Herb Pouch",
    lore: "When he could not identify the correct herb, he carried the whole mountain. The pouch contains the herb that revives the dead.",
    tier: 'deity', slot: 'accessory', deityId: 'hanuman',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I revived Lakshmana from near-death. Devotion transcends death. My pouch goes to those who have healed themselves from the brink: heal yourself from below 10% HP back above 30% HP in a single combat using any source — skill, consumable, passive. Any method. Once from that depth, three times across your lifetime. Revive from nothing. Three times.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 3, targetType: 'below_10_to_above_30_in_combat_lifetime', description: 'Heal from below 10% to above 30% HP in combat 3 times lifetime' },
    ]},
    passiveId: 'hanuman_pouch_passive',
    passiveDescription: "Mountain Carrier: when HP drops below 20%, immediately restore 25% max HP (the sanjeevani herb activates). This can trigger once per combat — the devoted warrior does not fall until the mission is complete.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, END: 25 } },
  },
};

const AGNI_RELICS: DeityRelicPair = {
  deityId: 'agni',
  weapon: {
    id: 'deity_agni_weapon', name: "Primordial Fire Spear",
    lore: "Agni is the fire that accepts sacrifices, the messenger between humans and gods. He burns in three forms: in the sky as lightning, in the air as lightning, and on earth as the ritual fire.",
    tier: 'deity', slot: 'weapon', deityId: 'agni',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the fire of sacrifice. Every offering burned is a message sent through me. My spear goes to those who sacrifice appropriately: destroy 3 different items permanently — consumables, weapons, accessories, anything — across your lifetime. Not sell. DESTROY. The fire accepts sacrifice. The messenger delivers it.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'items_destroyed', value: 3, description: 'Permanently destroy 3 items (not sell — destroy) lifetime' },
    ]},
    passiveId: 'agni_spear_passive',
    passiveDescription: "Sacred Fire: the Burn status effect you inflict deals +50% more damage per tick. Additionally: the first attack in every combat deals bonus fire damage equal to 10% of the enemy's max HP (Agni's fire strikes the first moment).",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.28, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_agni_accessory', name: "Ritual Flame Armband",
    lore: "The seven tongues of Agni — each consuming a different type of offering. The armband holds all seven.",
    tier: 'deity', slot: 'accessory', deityId: 'agni',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fire requires fuel. My armband goes to those who have fueled it sufficiently: inflict the Burn status effect on 50 enemies total across your lifetime. Fifty offerings to the fire. The ritual requires repetition. The armband will find you when the fiftieth flame is lit.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 50, targetType: 'burn_type_specifically', description: 'Inflict Burn status effect on 50 enemies lifetime' },
    ]},
    passiveId: 'agni_armband_passive',
    passiveDescription: "Ritual Fire: when you inflict Burn on an enemy, the first 2 turns of that Burn deal double damage (the initial flame is hottest). Additionally: burn effects you apply cannot be extinguished by enemy abilities — Agni's fire does not accept cancellation.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { INT: 26, STR: 18 } },
  },
};

const VARUNA_RELICS: DeityRelicPair = {
  deityId: 'varuna',
  weapon: {
    id: 'deity_varuna_weapon', name: "Cosmic Order's Noose-Spear",
    lore: "Varuna carries a noose — the pasha — with which he binds the wicked. He is the god of cosmic order, of the oath, of the waters that flow in accordance with Rta.",
    tier: 'deity', slot: 'weapon', deityId: 'varuna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I maintain cosmic order. Oaths made before me cannot be broken — I bind those who violate them. My spear goes to those who prove they maintain order: complete a run from Floor 1 to Floor 15 with zero flee attempts, zero bypasses, and zero consumables used. Every promise to face what the Tower offers — kept. Not one retreat. Not one shortcut. Not one external aid.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'flee_total', value: 0, description: 'Zero flee attempts' },
      { metric: 'boss_bypass', value: 0, description: 'Zero boss bypasses' },
      { metric: 'floor_noconsumable', value: 15, description: 'Zero consumables used the entire run' },
    ]},
    passiveId: 'varuna_spear_passive',
    passiveDescription: "Rta's Binding: enemies that you have not fled from or bypassed this run take +15% damage from all sources (Varuna's cosmic order recognizes and weakens those marked for confrontation). This bonus applies to all enemies in a no-flee, no-bypass run.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 93, finalCritChance: 0.25, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_varuna_accessory', name: "Waters of Truth Seal",
    lore: "He sees all that is hidden beneath the waters. The liar's throat is bound by his noose. The honest receive his blessing.",
    tier: 'deity', slot: 'accessory', deityId: 'varuna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I watch through the cosmic waters. The honest act in sight of my gaze. My seal goes to those who succeed in 5 event rooms in a single run while also reaching Floor 10. Every event is an oath — an engagement with what the Tower offers. Succeed in each one without retreating from it. Cosmic order rewards the honest encounter.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'event_success', value: 5, description: 'Succeed in 5 event rooms in one run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'varuna_seal_passive',
    passiveDescription: "Cosmic Witness: Observe reveals whether an enemy has any unique interactions available (special weaknesses, dialogue options, or avoidable encounters). Varuna sees what is hidden. Additionally: +15% WIS stat bonus to all calculations.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 28, INT: 18 } },
  },
};

const SURYA_RELICS: DeityRelicPair = {
  deityId: 'surya',
  weapon: {
    id: 'deity_surya_weapon', name: "Chariot Wheel Sun-Disc",
    lore: "He rides a single-wheeled chariot across the sky pulled by seven horses named for the seven colors of light. His chariot never stops.",
    tier: 'deity', slot: 'weapon', deityId: 'surya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My chariot crosses the entire sky every day without pause. Consistency is my power. My sun-disc goes to those who demonstrate equivalent consistency: start and complete (reach Floor 5 or die trying) 20 dungeon runs across your lifetime. Not victories — runs. The sun rises twenty times and does not ask whether the day will be favorable.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 20, targetType: 'twenty_dungeon_runs_started_and_played', description: 'Start and play 20 dungeon runs lifetime (Floor 5 reached OR died attempting)' },
    ]},
    passiveId: 'surya_disc_passive',
    passiveDescription: "Solar Consistency: +2% damage for each floor descended this run (max +40% at Floor 20). The sun's progress across the sky measures your power — the further you travel, the brighter you burn.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 50, finalAccuracy: 96, finalCritChance: 0.28, range: 'ranged', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_surya_accessory', name: "Seven Horse Talisman",
    lore: "The seven horses of Surya's chariot: Arun, Arogya, Subhahu, Pingala, Susham, Dhruva, Atibhraja. Their names carry the colors of light.",
    tier: 'deity', slot: 'accessory', deityId: 'surya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Seven colors of light, seven horses, one unbroken journey. My talisman goes to those who achieve seven: defeat 7 different types of enemies in a single run — not 7 individual enemies, but 7 distinct enemy types encountered and defeated. Seven colors of the Tower's bestiary in one journey.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_type', value: 7, targetType: 'seven_different_enemy_types_one_run', description: 'Kill 7 different enemy types in one run' },
    ]},
    passiveId: 'surya_talisman_passive',
    passiveDescription: "Seven Rays: for each unique enemy type defeated so far in the current run, gain +3% damage (max +21% from 7 types). The complete spectrum of Surya's light blazes brightest when all colors are present.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 20, AGI: 20, CHA: 18 } },
  },
};

const DURGA_RELICS: DeityRelicPair = {
  deityId: 'durga',
  weapon: {
    id: 'deity_durga_weapon', name: "Trident of the Invincible Goddess",
    lore: "She was created by all the gods combined when no individual god could defeat Mahishasura. She is the collected strength of divinity made singular.",
    tier: 'deity', slot: 'weapon', deityId: 'durga',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The gods combined their weapons and power to create me. I defeated what they could not. My trident goes to those who prove they can defeat what seems undefeatable: kill a boss while afflicted by at least 3 different status effects simultaneously — and win without using any healing items during the fight. The invincible goddess was never clean in her victory. She was just unconquerable.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Defeat a boss' },
      { metric: 'status_received_survived', value: 3, targetType: 'three_simultaneous_during_boss_fight', description: 'Have 3 different status effects on you simultaneously during the boss fight' },
      { metric: 'floor_noconsumable', value: 1, targetType: 'no_healing_during_boss_fight', description: 'Use zero healing consumables during the boss fight' },
    ]},
    passiveId: 'durga_trident_passive',
    passiveDescription: "Mahishasura's Destroyer: +15% damage against any enemy that has inflicted a status effect on you this combat (Durga's fury at the affliction empowers the counterstrike). If you have 2+ status effects active, this bonus doubles to +30%.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_durga_accessory', name: "Divine Weapons Cache Bangle",
    lore: "She carries all the weapons given by all the gods: Vishnu's discus, Shiva's trident, Indra's thunderbolt, Vayu's bow. The bangle contains their combined blessing.",
    tier: 'deity', slot: 'accessory', deityId: 'durga',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I carry every weapon the gods possess. To earn my bangle: reach Favoured Child status with 3 different Hindu deities lifetime. Not any deities — specifically deities from the Hindu pantheon. I am the collective strength of the Hindu divine. Show me you know each member of my origin.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 3, targetType: 'three_hindu_pantheon_deities', description: 'Reach 91+ favor with 3 different Hindu pantheon deities lifetime' },
    ]},
    passiveId: 'durga_bangle_passive',
    passiveDescription: "Combined Divinity: you gain +8% damage with every weapon type (the combined gifts of all gods flow through you). When using melee weapons, +5% extra; when using ranged, +5% extra — Durga's grace extends equally to all forms of combat.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { STR: 22, WIS: 18, END: 18 } },
  },
};

const PARVATI_RELICS: DeityRelicPair = {
  deityId: 'parvati',
  weapon: {
    id: 'deity_parvati_weapon', name: "Lotus Petal Blade",
    lore: "She is Shiva's beloved — the gentle goddess whose love eventually drew the withdrawn ascetic god back to the world. She created Ganesha from her own body.",
    tier: 'deity', slot: 'weapon', deityId: 'parvati',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I waited. I practiced austerities. I persisted through Shiva's indifference and finally his recognition. My blade goes to those who demonstrate the same patient devotion: reach maximum favor (100) with any deity over the course of 3 or more separate runs — not all in one run. The love that wins the ascetic god is patient, careful, and spread over time.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 1, targetType: 'max_favor_across_multiple_runs', description: 'Reach 100 favor with one deity across 3+ separate runs contributing to it' },
    ]},
    passiveId: 'parvati_blade_passive',
    passiveDescription: "Devoted Heart: favor gain with your current patron deity is doubled (patience in devotion accelerates its fruits). Additionally: at 50+ favor with your patron, this weapon deals +10% damage — the blessing of the beloved who earned love.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 42, finalAccuracy: 93, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_parvati_accessory', name: "Golden Mountain Earring",
    lore: "Her name means 'daughter of the mountain.' The golden earring carries the mountain's stability and the daughter's grace.",
    tier: 'deity', slot: 'accessory', deityId: 'parvati',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Love is steady as the mountain. My earring goes to those who demonstrate mountain-steadiness in protection: use the Defend action 30 times total across your lifetime. Not aggressive, not retreating — standing firm and absorbing. Thirty mountains of patience. The daughter of Himalaya knows the value of endurance.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 30, targetType: 'defend_action_total_lifetime', description: 'Use the Defend action 30 times total lifetime' },
    ]},
    passiveId: 'parvati_earring_passive',
    passiveDescription: "Mountain Daughter's Grace: after using Defend, restore 8 SP (the patient stance restores inner resource). Additionally: Defend reduces incoming damage by 40% instead of the normal 25% — Parvati's mountain strength amplifies protection.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 22, END: 22, WIS: 14 } },
  },
};

const KARTIKEYA_RELICS: DeityRelicPair = {
  deityId: 'kartikeya',
  weapon: {
    id: 'deity_kartikeya_weapon', name: "Vel Spear of the War God",
    lore: "His mother Parvati gave him the Vel — the divine spear — to defeat the demon Surapadman. He used it. Once was enough.",
    tier: 'deity', slot: 'weapon', deityId: 'kartikeya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My Vel was forged to defeat a specific demon, and it did so without effort. I am the commander of the divine army. My spear goes to those who demonstrate command over battle: in a single run reaching Floor 15, defeat every elite enemy encountered without using the Flee action once. Elites are the demons I was sent to destroy. Do not retreat from them.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'flee_elite', value: 0, description: 'Zero flee actions from elite encounters in this run' },
    ]},
    passiveId: 'kartikeya_vel_passive',
    passiveDescription: "Divine Army Commander: +25% damage against elite enemies. Additionally: the first attack against any elite enemy in a combat has guaranteed critical hit — the Vel strikes the demon's weakness before it can respond.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 95, finalCritChance: 0.32, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_kartikeya_accessory', name: "Peacock Mount Crest",
    lore: "His mount is a peacock named Paravani that tramples the snake Surapadman's remnant. The crest is a feather from Paravani.",
    tier: 'deity', slot: 'accessory', deityId: 'kartikeya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My peacock carries me swiftly to every battlefield. Speed and beauty combined. My crest goes to those who demonstrate swiftness in victory: defeat an elite enemy within 3 turns of combat beginning — 3 times across your lifetime. Not kill on turn 3 total — kill within turns 1, 2, or 3. The war god's speed does not linger over enemies.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 3, targetType: 'kill_elite_within_3_turns_3_times_lifetime', description: 'Kill an elite enemy within 3 turns of combat 3 times lifetime' },
    ]},
    passiveId: 'kartikeya_crest_passive',
    passiveDescription: "Peacock's Speed: initiative is always won by you (act first in all combats). Additionally: +20% damage on turns 1, 2, and 3 of any combat — the swift war god's advantage is greatest at the opening.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 28, STR: 18 } },
  },
};

const KRISHNA_RELICS: DeityRelicPair = {
  deityId: 'krishna',
  weapon: {
    id: 'deity_krishna_weapon', name: "Sudarshana Chakra",
    lore: "The spinning discus weapon of Vishnu, given to Krishna. It returns to his hand after striking. It has never missed a target it was intended for.",
    tier: 'deity', slot: 'weapon', deityId: 'krishna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Sudarshana Chakra returns to my hand. It never misses. I give it to those who have proven they understand the Dharma — the divine duty: defeat all 5 milestone bosses in a single run AND reach Floor 25. The full path. Every obstacle cleared by the divine will. The Chakra only obeys those who have walked the complete dharmic path.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 5, description: 'Defeat all 5 milestone bosses' },
      { metric: 'floors_reached', value: 25, description: 'Reach Floor 25' },
    ]},
    passiveId: 'krishna_chakra_passive',
    passiveDescription: "Sudarshana Returns: this weapon never misses (accuracy treated as 100%). When used as a ranged weapon, it returns to you immediately — no penalty for ranged use. Critical hits apply the Chakra's divine mark — marked enemies take +10% damage from all subsequent attacks.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'AGI', finalDamage: 52, finalAccuracy: 110, finalCritChance: 0.30, range: 'ranged', damageType: 'holy', neverMisses: true },
  },
  accessory: {
    id: 'deity_krishna_accessory', name: "Flute of Divine Counsel",
    lore: "He played the flute in the forest of Vrindavan. He spoke the Bhagavad Gita on the battlefield. The flute carries both — the love and the wisdom.",
    tier: 'deity', slot: 'accessory', deityId: 'krishna',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Bhagavad Gita I spoke to Arjuna when he could not fight. I told him: do your duty. Fight without attachment to outcome. My flute goes to those who demonstrate detachment from outcome: complete a run reaching Floor 15 where you did not check your gold count in the inventory screen — played purely for combat and floor descent. Not every system is relevant to every moment of battle.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'familia_visits', value: 0, description: 'Zero familia visits this run (play without managing home resources)' },
    ]},
    passiveId: 'krishna_flute_passive',
    passiveDescription: "Gita's Lesson: at the start of each combat, gain a preview of the optimal action for the first turn (shown as a highlighted action in the menu — not mandatory, but correct more often than not). Divine counsel guides without commanding.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { WIS: 26, CHA: 20, INT: 12 } },
  },
};

const RAMA_RELICS: DeityRelicPair = {
  deityId: 'rama',
  weapon: {
    id: 'deity_rama_weapon', name: "Kodanda Bow of Righteous Fury",
    lore: "Rama's bow Kodanda was given by Vishnu. He used it with absolute precision and never — not once — used it for anything other than righteous purpose.",
    tier: 'deity', slot: 'weapon', deityId: 'rama',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I never deviated from dharma. Not when my father exiled me. Not when Ravana stole Sita. Not once. My bow goes to those who demonstrate equivalent righteousness: complete a run from Floor 1 to Floor 20 with zero failed actions — every attack must hit, every skill must connect, zero misses. The righteous king's arrow does not stray.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 20, description: 'Reach Floor 20' },
      { metric: 'custom', value: 0, targetType: 'zero_missed_attacks_run', description: 'Zero missed attacks the entire run' },
    ]},
    passiveId: 'rama_bow_passive',
    passiveDescription: "Righteous Precision: this weapon's accuracy is 100% against enemies you have Observed at least once. Against unobserved enemies, accuracy is standard. The righteous king sees his enemy clearly before striking — observation enables perfection.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'WIS', finalDamage: 48, finalAccuracy: 105, finalCritChance: 0.28, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_rama_accessory', name: "Raghuvamsha Heritage Ring",
    lore: "He is of the Raghuvamsha dynasty — a lineage of kings who gave away everything asked of them. The ring carries that legacy of selfless duty.",
    tier: 'deity', slot: 'accessory', deityId: 'rama',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Duty is its own reward. I did not exile myself for praise. I did it because it was right. My ring goes to those who demonstrate action for its own sake: complete 25 achievements across your lifetime — of any tier, any type. Not for the power they grant. The act of completion itself is what I recognize. Duty fulfilled in full.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'achievements_total', value: 25, description: 'Complete 25 achievements total lifetime' },
    ]},
    passiveId: 'rama_ring_passive',
    passiveDescription: "Heritage of Duty: each achievement completed this character grants +1% permanent damage on this character (carries across runs). The lineage of duty compounds — the more complete your record, the stronger the ring's blessing.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 24, PER: 20, CHA: 14 } },
  },
};

const YAMA_RELICS: DeityRelicPair = {
  deityId: 'yama',
  weapon: {
    id: 'deity_yama_weapon', name: "Death-Rod of Dharmic Judgment",
    lore: "Yama is the first mortal to die, who became king of the dead. He judges souls with his rod while Chitragupta reads the record of their lives.",
    tier: 'deity', slot: 'weapon', deityId: 'yama',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I judge the dead. Every soul passes before me. My rod goes to those whose record is complete: kill 750 enemies total across your lifetime. Not one kind of enemy — any enemy. The judgment requires volume. The king of the dead has seen many. Show me you have sent an equal number.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 750, description: 'Kill 750 enemies total lifetime' },
    ]},
    passiveId: 'yama_rod_passive',
    passiveDescription: "Death King's Authority: enemies at 10% HP or below die immediately when struck by this weapon (Yama's judgment at the threshold of death is final). Additionally: +10% damage against enemies that have previously been Observed — the king knows the record before passing judgment.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_yama_accessory', name: "Chitragupta's Ledger Token",
    lore: "Chitragupta keeps the perfect record of every soul's deeds. When Yama judges, Chitragupta reads. The token is a page from the first account.",
    tier: 'deity', slot: 'accessory', deityId: 'yama',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Chitragupta's ledger is perfect. Every action is recorded. My token goes to those whose record shows completion: reach Level 10 Paragon on any character. The full life. The complete arc from birth to the highest form. Show me the full account before the judgment seat.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon on any character' },
    ]},
    passiveId: 'yama_ledger_passive',
    passiveDescription: "Perfect Record: at the start of each combat, see the enemy's exact HP value, their primary damage type, and whether they have any status immunities. Chitragupta has already recorded what you need to judge them efficiently.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 28, INT: 18 } },
  },
};

const VAYU_RELICS: DeityRelicPair = {
  deityId: 'vayu',
  weapon: {
    id: 'deity_vayu_weapon', name: "Wind God's Mace of Bhima",
    lore: "Vayu is the father of Hanuman and of Bhima the most powerful Pandava. He gave Bhima his windborn strength. This mace is what Bhima used to break Duryodhana's thigh.",
    tier: 'deity', slot: 'weapon', deityId: 'vayu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I fathered the two greatest warriors — Hanuman and Bhima. My strength flows through both. My mace goes to those who demonstrate wind-born power: in a single combat, deal the most damage you have ever dealt in a single hit. Not across the run — your personal record single-hit damage, beaten. Wind power concentrates to a single perfect gust. Show me your peak.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'personal_highest_single_hit_damage_ever', description: 'Deal a new personal record single-hit damage amount in one attack' },
    ]},
    passiveId: 'vayu_mace_passive',
    passiveDescription: "Windborn Power: critical hit damage multiplier is 3× instead of 2× (wind concentrates at the point of impact). Additionally: once per combat, declare a 'Wind Strike' — the next attack ignores all enemy defense (the gust finds every gap).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_vayu_accessory', name: "Prana Breath Ring",
    lore: "Vayu is also prana — the life breath, the vital force. Without him, the other gods starved (he once refused to breathe for a year to prove his importance; they believed him immediately).",
    tier: 'deity', slot: 'accessory', deityId: 'vayu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am prana — I am the breath of life. Without me the gods stop functioning. My ring goes to those who prove they cannot be stopped by lack of resource: complete a run reaching Floor 10 where your SP never dropped below 20. Not that you always conserved — your SP never fell below 20 at any point. Vayu's breath is constant. So must yours be.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 20, targetType: 'sp_never_below_20_entire_run', description: 'SP never drops below 20 at any point in the run' },
    ]},
    passiveId: 'vayu_ring_passive',
    passiveDescription: "Vital Breath: SP regenerates 2 points per turn instead of 1 (prana flows more abundantly). When SP is above 50%, deal +10% damage — the fully-breathing warrior strikes with greater vital force.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 24, END: 20, STR: 14 } },
  },
};

const KUBERA_RELICS: DeityRelicPair = {
  deityId: 'kubera',
  weapon: {
    id: 'deity_kubera_weapon', name: "Nine Treasures Club",
    lore: "He is the lord of the Navaratnas — the nine treasures. He is also the lord of the yakshas and of Lanka before Ravana took it. He does not fight often, but his treasury is unparalleled.",
    tier: 'deity', slot: 'weapon', deityId: 'kubera',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the king of all treasures. The nine treasures of the world belong to my domain. My club goes to those who have proven themselves true collectors: accumulate 75,000 gold total across your lifetime. Seventy-five thousand. Not all at once — across all time. The lord of treasures recognizes those who match his dedication to accumulation.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 75000, description: 'Accumulate 75,000 total gold across all time lifetime' },
    ]},
    passiveId: 'kubera_club_passive',
    passiveDescription: "Nine Treasures: gold found in treasure rooms is doubled. Additionally: when you have 5,000+ gold on your person, deal +20% damage — Kubera's treasury empowers those who carry sufficient wealth.",
    weaponStats: { scalingStat: 'LCK', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 88, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_kubera_accessory', name: "Padmini Treasury Jewel",
    lore: "One of the nine treasures of Kubera is Padmini — an elephant with jeweled tusks. The jewel is one tusk-tip.",
    tier: 'deity', slot: 'accessory', deityId: 'kubera',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Treasures seek their proper owner. My jewel goes to those who treat treasure with the respect it deserves: visit treasure rooms 10 times across your lifetime. Not loot them all — visit them, enter them, acknowledge what they offer. Ten times before the lord of treasure acknowledges you as worthy of his personal jewel.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'treasure_rooms', value: 10, description: 'Visit treasure rooms 10 times lifetime' },
    ]},
    passiveId: 'kubera_jewel_passive',
    passiveDescription: "Treasury Lord: treasure room quality is increased by one tier (common→uncommon, uncommon→rare, etc.). Additionally: once per run, a random treasure room contains Kubera's personal cache — 1 guaranteed epic+ item and 500G.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { LCK: 30, CHA: 18 } },
  },
};

const CHANDRA_RELICS: DeityRelicPair = {
  deityId: 'chandra',
  weapon: {
    id: 'deity_chandra_weapon', name: "Moon Scythe of Night Waters",
    lore: "Chandra carries the moon in his hands as a cup. From it drip the soma that nourishes the gods. He waxes and wanes and is eternally cursed by Daksha for favoring one wife over others.",
    tier: 'deity', slot: 'weapon', deityId: 'chandra',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I wax and I wane. The moon does not apologize for either phase. My scythe goes to those who demonstrate mastery across both high and low cycles: in a single run, kill at least 10 enemies when at max HP AND at least 10 enemies when below 30% HP. Peak and trough. The moon's two faces. Show me you are effective at both ends.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'kills_at_max_hp', description: 'Kill 10 enemies while at max HP in one run' },
      { metric: 'custom', value: 10, targetType: 'kills_below_30hp', description: 'Kill 10 enemies while below 30% HP in one run' },
    ]},
    passiveId: 'chandra_scythe_passive',
    passiveDescription: "Waxing and Waning: +15% critical chance when at 80%+ HP (full moon). +20% damage when below 30% HP (crescent moon desperate intensity). Both bonuses active simultaneously when applicable.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'WIS', finalDamage: 44, finalAccuracy: 94, finalCritChance: 0.32, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_chandra_accessory', name: "Soma Moon Cup",
    lore: "The soma drips from the moon each night. Gods drink it and are nourished. The cup is the moon itself, carried in miniature.",
    tier: 'deity', slot: 'accessory', deityId: 'chandra',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Soma nourishes the gods. The moon gives and then is given to. My cup goes to those who have spread the nourishment: use healing items 40 times total across your lifetime. Every potion is a sip of soma. Every rest site is the moon's cup offered to a traveler. Forty times at the moon's table.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 40, description: 'Use healing sources (items + rest sites) 40 times total lifetime' },
    ]},
    passiveId: 'chandra_cup_passive',
    passiveDescription: "Soma Blessing: all healing effects restore +20% more HP (the moon cup is generous). Additionally: when you use a healing consumable, restore 10 SP as well — the soma nourishes body and mind simultaneously.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { END: 22, WIS: 20, LCK: 16 } },
  },
};

const BRIHASPATI_RELICS: DeityRelicPair = {
  deityId: 'brihaspati',
  weapon: {
    id: 'deity_brihaspati_weapon', name: "Jupiter Counsel Staff",
    lore: "He is the guru of the gods, the preceptor of the devas. Jupiter is named for him. He composed the Rigveda's hymns and guides the gods' council.",
    tier: 'deity', slot: 'weapon', deityId: 'brihaspati',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the teacher of the gods. Every divine strategy was conceived in my counsel. My staff goes to those who demonstrate the teacher's comprehensiveness: in a single run reaching Floor 15, use every skill type at least 20 times each — physical skills, magic skills, and support skills. 20 of each. 60 total. The teacher is fluent in every discipline.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 20, targetType: 'physical_skills', description: 'Use 20 physical skills in one run' },
      { metric: 'skill_uses', value: 20, targetType: 'magic_skills', description: 'Use 20 magic skills in one run' },
      { metric: 'skill_uses', value: 20, targetType: 'support_skills', description: 'Use 20 support skills in one run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
    ]},
    passiveId: 'brihaspati_staff_passive',
    passiveDescription: "Divine Counsel: after using 3 different skill types in a single combat, gain a 'Counsel Bonus' — the next skill used costs 0 SP. The teacher's comprehensive approach finds the efficient path.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.26, range: 'ranged', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_brihaspati_accessory', name: "Guru's Golden Ring",
    lore: "The guru receives golden gifts from grateful students. This ring was given by Indra when Brihaspati's counsel won a critical battle.",
    tier: 'deity', slot: 'accessory', deityId: 'brihaspati',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Wisdom is the wealth the teacher offers. My ring goes to those who have accumulated wisdom across many lessons: use the Observe action in 50 different combats across your lifetime. Not 50 uses — 50 different fights where you chose to study before striking. Each fight studied is a lesson taught. Fifty lessons marks you as a worthy student of the divine guru.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 50, targetType: 'fifty_different_combats_observed', description: 'Use Observe in 50 different combats lifetime' },
    ]},
    passiveId: 'brihaspati_ring_passive',
    passiveDescription: "Guru's Teaching: after using Observe, SP costs for all skills this combat are reduced by 30% (the teacher's foreknowledge makes execution efficient). Additionally: WIS scaling for magic damage is treated as 20% higher than its actual grade.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { WIS: 28, INT: 20 } },
  },
};

const SHANI_RELICS: DeityRelicPair = {
  deityId: 'shani',
  weapon: {
    id: 'deity_shani_weapon', name: "Iron Rod of Saturn's Justice",
    lore: "Shani is Saturn — slow, patient, inexorable. He rules karma. Those under his gaze experience delay, hardship, and ultimate justice. He is not cruel. He is exact.",
    tier: 'deity', slot: 'weapon', deityId: 'shani',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the slowest planet and the most patient judge. My rod goes to those who have accumulated karma through patience: die 5 times lifetime — not failure, karma. Five character deaths. Each death is Saturn's gaze. Each return is the result of that gaze. After five deaths, five lessons paid, my iron rod recognizes the soul that has paid its karmic debt.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_total_character_deaths_lifetime', description: '5 total character deaths across all characters lifetime' },
    ]},
    passiveId: 'shani_rod_passive',
    passiveDescription: "Karmic Weight: for each previous character death in your account history, gain +3% permanent damage on this character (max +30% from 10 deaths). Saturn's patience extracts compensation from each cycle of karma.",
    weaponStats: { scalingStat: 'END', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 88, finalCritChance: 0.22, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_shani_accessory', name: "Sesame Seed Offering Bowl",
    lore: "Sesame seeds and oil are offered to Shani on Saturdays to mitigate his gaze. The bowl has absorbed countless Saturday offerings from fearful supplicants.",
    tier: 'deity', slot: 'accessory', deityId: 'shani',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Saturday offerings mitigate my gaze. But the gaze cannot be avoided entirely — only prepared for. My bowl goes to those who demonstrate preparation: survive 10 combats where the enemy had a damage modifier against you (type advantage, elemental weakness, etc.) and still win. Not lucky wins — preparation against the disadvantage. Saturn rewards those who prepare for his gaze.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'win_combat_against_type_disadvantage_10_times', description: 'Win 10 combats lifetime where you had a type/damage disadvantage against the enemy' },
    ]},
    passiveId: 'shani_bowl_passive',
    passiveDescription: "Slow Justice: once per run, apply 'Saturn's Mark' to one enemy — over 5 turns they take 5% additional damage each turn (building to +25% by turn 5). The justice of Saturn is slow but cumulative and inevitable.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 25, WIS: 22 } },
  },
};

const NARASIMHA_RELICS: DeityRelicPair = {
  deityId: 'narasimha',
  weapon: {
    id: 'deity_narasimha_weapon', name: "Claw-Blades of the Half-Lion",
    lore: "He appeared at twilight, at a doorstep, as neither man nor animal, from a pillar — specifically to exploit every loophole in Hiranyakashipu's invincibility boon. Narasimha is divine problem-solving.",
    tier: 'deity', slot: 'weapon', deityId: 'narasimha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I found the loopholes. The demon was invincible by man and beast, by day and night, inside and outside, with any weapon. I was none of those things. My claws go to those who find their own loopholes: defeat a boss using only the Taunt action and basic attacks — no skills, no items. Not the expected approach. The half-lion does not fight by the expected rules.",
    acquisition: { scope: 'single_combat', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Defeat any boss' },
      { metric: 'skill_uses', value: 0, targetType: 'during_boss_fight', description: 'Zero skill uses during the boss fight' },
      { metric: 'floor_noconsumable', value: 1, targetType: 'no_items_boss_fight', description: 'Zero items used during the boss fight' },
    ]},
    passiveId: 'narasimha_claws_passive',
    passiveDescription: "Loophole Found: once per run, basic attacks ignore all enemy special resistances and immunities for 3 turns (the half-lion finds the gap in every invincibility). Additionally: basic attacks deal +20% damage against any enemy that has used a buff or defensive ability.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'AGI', finalDamage: 52, finalAccuracy: 95, finalCritChance: 0.32, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_narasimha_accessory', name: "Pillar-Burst Amulet",
    lore: "He erupted from a stone pillar when Hiranyakashipu challenged whether Vishnu was everywhere. The answer was yes. The amulet is a fragment of that specific pillar.",
    tier: 'deity', slot: 'accessory', deityId: 'narasimha',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I was everywhere the demon thought I was not. My amulet goes to those who demonstrate omnipresence by covering every room: in a single run reaching Floor 10, enter every room on every floor — not just combat, but every room type. Mystery rooms, event rooms, combat rooms, treasure rooms — every available room on every available floor. Be everywhere.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'all_rooms_all_floors_entered', description: 'Enter every available room on every floor this run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'narasimha_amulet_passive',
    passiveDescription: "The Avatar Erupts: when you enter combat for the first time on a floor (first fight of the floor), deal +40% damage on your first attack — the avatar erupts from expectation. This bonus applies specifically to the very first combat entered per floor.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { STR: 24, END: 20, AGI: 14 } },
  },
};

const DATTATREYA_RELICS: DeityRelicPair = {
  deityId: 'dattatreya',
  weapon: {
    id: 'deity_dattatreya_weapon', name: "Three-Faced Trishula",
    lore: "He has three faces — Brahma, Vishnu, and Shiva combined in one body. He is the supreme synthesis, carrying the creation, preservation, and destruction of divinity in a single form.",
    tier: 'deity', slot: 'weapon', deityId: 'dattatreya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am Brahma, Vishnu, and Shiva simultaneously. All three functions in one form. My trishula goes to those who prove they encompass all three: in a single run reaching Floor 10, use skills of every type (creation/support, preservation/defense, destruction/attack) at least 20 times each. 60 total skills across the three divine functions. Show me the complete trinity.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'skill_uses', value: 20, targetType: 'support_skills_20', description: 'Use 20 support/healing skills' },
      { metric: 'skill_uses', value: 20, targetType: 'physical_skills_20', description: 'Use 20 physical attack skills' },
      { metric: 'skill_uses', value: 20, targetType: 'magic_skills_20', description: 'Use 20 magic skills' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'dattatreya_trishula_passive',
    passiveDescription: "Triple Aspect: this weapon strikes three times instead of once on critical hits (one strike for each face — Brahma, Vishnu, Shiva). Each additional strike deals 40% of the first strike's damage.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 90, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_dattatreya_accessory', name: "Twenty-Four Guru Chakra",
    lore: "Dattatreya had 24 gurus — the earth, water, fire, air, sky, moon, sun, pigeon, python, ocean, moth, bee, elephant, deer, fish, dancing girl Pingala, the child, the maiden, the arrow-maker, the serpent, the spider, the wasp, and the beetle. He learned from all of them.",
    tier: 'deity', slot: 'accessory', deityId: 'dattatreya',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I learned from 24 gurus, none of them human scholars. I took wisdom from nature, from animals, from the humble and the overlooked. My chakra goes to those with similar breadth: complete 3 runs of very different styles — one run with zero flee (warrior path), one run using all skills heavily (sage path), one run using Observe in every combat (scholar path) — lifetime. Three different gurus completed.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'floor_noretreat', value: 1, targetType: 'at_least_one_run_no_flee', description: 'Complete at least one run to Floor 5+ with zero flee attempts lifetime' },
      { metric: 'skill_sp_spent', value: 100, targetType: 'in_one_run', description: 'Spend 100+ SP on skills in a single run lifetime (sage path)' },
      { metric: 'observe_total', value: 10, targetType: 'in_one_run_every_combat', description: 'Use Observe in every combat in a single run (10+ combats) lifetime' },
    ]},
    passiveId: 'dattatreya_chakra_passive',
    passiveDescription: "Twenty-Four Learnings: each unique action type used in a combat adds +5% damage for the rest of that combat (max +35% using all 7 action types: attack, defend, observe, taunt, flee-attempt, item, skill). Learning from every possible teacher.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 25, INT: 18, CHA: 15 } },
  },
};

export const HINDU_REMAINING_RELICS: DeityRelicPair[] = [
  LAKSHMI_RELICS, SARASWATI_RELICS, HANUMAN_RELICS, AGNI_RELICS, VARUNA_RELICS,
  SURYA_RELICS, DURGA_RELICS, PARVATI_RELICS, KARTIKEYA_RELICS, KRISHNA_RELICS,
  RAMA_RELICS, YAMA_RELICS, VAYU_RELICS, KUBERA_RELICS, CHANDRA_RELICS,
  BRIHASPATI_RELICS, SHANI_RELICS, NARASIMHA_RELICS, DATTATREYA_RELICS,
];
