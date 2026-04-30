/**
 * Maya Pantheon - Lords of Xibalba and the Heavens
 * 14 deities covering war, magic, death, nature, sky, life,
 * wisdom, trickery, fortune, craft, authority, and knowledge
 */

import type { Deity } from '../../types/Deity';

const mayaDeities: Deity[] = [

  // ===== ITZAMNA - Wisdom Domain =====
  {
    id: 'itzamna',
    name: 'Itzamna',
    pantheon: 'maya',
    domain: 'wisdom',
    personality: 'ancient',
    title: 'Lord of the Heavens, Inventor of Writing',
    description:
      'The supreme creator deity and lord of all gods. Itzamna invented writing, calendars, and medicine. He sees all of time as a single unrolled scroll.',
    loreSnippet: '"He did not create the world in a day. He took as long as it needed. That is the difference between wisdom and haste."',
    statBonus: { stat: 'WIS', value: 12, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'The lord of all calendars reveals when to strike with perfect timing',
      effectType: 'skill_learning',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'cosmic_calendar',
      name: 'Cosmic Calendar',
      description: 'For 3 turns, your actions have no cooldowns and cost 50% less SP.',
      unlockFavor: 70,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'no_cooldown_sp_reduction', value: 50, duration: 3 },
    },
    challenges: [
      {
        id: 'itzamna_ch1',
        name: "The Calendar's Path",
        description: 'Use a skill on every turn for 5 consecutive rounds.',
        domain: 'wisdom',
        tier: 'challenging',
        requirement: { type: 'skills_every_turn', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'itzamna_ch2',
        name: 'Scroll of All Things',
        description: 'Observe 12 different enemy types across any number of runs.',
        domain: 'wisdom',
        tier: 'heroic',
        requirement: { type: 'observe_unique_enemies', value: 12 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The calendar turns in your favor today. Act on it.',
        'Itzamna has written this moment down. Make it worth reading.',
        'All time flows through this point. You are exactly where you should be.',
      ],
      warning: [
        'The calendar predicts this goes poorly if you do not change course.',
        'Even the lord of time cannot rewrite what has already been done.',
        'Haste undoes wisdom. Slow down.',
      ],
      achievement: [
        'THE COSMIC SCROLL RECORDS YOUR TRIUMPH. Itzamna is deeply satisfied.',
        'A worthy entry in the annals of creation. Well done.',
        'The lord of all heavens nods. That means something.',
      ],
      combat: [
        'Timing is everything. Strike when the calendar opens.',
        'Knowledge of the enemy is victory already half won.',
        'Use every skill available. Itzamna invented them for this.',
      ],
    },
  },

  // ===== IXCHEL - Life Domain =====
  {
    id: 'ixchel',
    name: 'Ixchel',
    pantheon: 'maya',
    domain: 'life',
    personality: 'benevolent',
    title: 'Lady Rainbow, Goddess of Medicine',
    description:
      'The jaguar goddess of midwifery and medicine. Ixchel heals what sickness breaks and brings the rainbow after every storm.',
    loreSnippet: '"She gathered the herbs before the wound was made. That is the mark of a true healer."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Rainbow blessing amplifies all healing received',
      effectType: 'hp_regen',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'rainbow_medicine',
      name: 'Rainbow Medicine',
      description: 'Immediately restore 45% max HP and cure all negative status effects.',
      unlockFavor: 60,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'heal_and_cleanse', value: 45 },
    },
    challenges: [
      {
        id: 'ixchel_ch1',
        name: 'After the Storm',
        description: 'Recover from below 20% HP in 5 separate combats.',
        domain: 'life',
        tier: 'challenging',
        requirement: { type: 'low_hp_recovery', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'ixchel_ch2',
        name: 'Healer of Wounds',
        description: 'Cure 20 status effects across any number of runs.',
        domain: 'life',
        tier: 'heroic',
        requirement: { type: 'cures_applied', value: 20 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The rainbow follows every storm. Your storm is nearly over.',
        'Ixchel sees your wounds. She is already preparing the remedy.',
        'Healing is not retreat. It is preparation for the next advance.',
      ],
      warning: [
        'Medicine cannot fix what recklessness keeps breaking.',
        'The jaguar goddess is watching your wound count. Address it.',
        'Even the rainbow has limits. Do not test them today.',
      ],
      achievement: [
        'THE RAINBOW ARCS IN YOUR HONOR. Ixchel is deeply moved.',
        'Healed and victorious. The medicine goddess approves.',
        'You survived the storm. The rainbow was waiting for you.',
      ],
      combat: [
        'Heal when it matters, not when it feels good.',
        'A cleansed status is a free turn advantage.',
        'Keep yourself alive. That is always the first priority.',
      ],
    },
  },

  // ===== CHAAC - Sky Domain =====
  {
    id: 'chaac',
    name: 'Chaac',
    pantheon: 'maya',
    domain: 'sky',
    personality: 'aggressive',
    title: 'God of Rain and Lightning',
    description:
      'The great rain god who strikes the clouds with his obsidian axe to bring thunder and lightning. He is worshipped with urgency — when Chaac withholds rain, civilizations die.',
    loreSnippet: '"He does not threaten. He demonstrates. The lightning is the demonstration."',
    statBonus: { stat: 'STR', value: 10, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Obsidian lightning coats every strike with storm force',
      effectType: 'lightning_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'obsidian_axe',
      name: 'Obsidian Axe Strike',
      description: 'Call down lightning: deal 170% physical damage. If it kills the target, immediately act again.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'execute_then_reattack', value: 170 },
    },
    challenges: [
      {
        id: 'chaac_ch1',
        name: 'Bring the Rain',
        description: 'Deal 400 total physical damage across a single floor.',
        domain: 'sky',
        tier: 'challenging',
        requirement: { type: 'physical_damage_per_floor', value: 400 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'chaac_ch2',
        name: 'The Axe Falls',
        description: 'Kill 5 enemies with a single decisive blow (one-shot kills).',
        domain: 'sky',
        tier: 'heroic',
        requirement: { type: 'one_shot_kills', value: 5 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The storm is building. Let it break.',
        'Chaac swings his axe for you. Swing yours.',
        'Thunder before lightning. You are the lightning.',
      ],
      warning: [
        'Even Chaac knows when the storm is spent. Check your resources.',
        'Reckless storms destroy crops too. Be precise.',
        'Lightning without aim is just noise.',
      ],
      achievement: [
        'THE STORM BREAKS IN YOUR FAVOR. Chaac roars his approval.',
        'Lightning struck perfectly. The rain god is satisfied.',
        'Your axe fell true. Chaac acknowledges the blow.',
      ],
      combat: [
        'One decisive strike over three cautious ones.',
        'Hit first, hit hard, let the thunder follow.',
        "Chaac's axe doesn't stop swinging. Neither should you.",
      ],
    },
  },

  // ===== KUKULKAN - Knowledge Domain =====
  {
    id: 'kukulkan',
    name: 'Kukulkan',
    pantheon: 'maya',
    domain: 'knowledge',
    personality: 'wise',
    title: 'The Feathered Serpent',
    description:
      'The feathered serpent deity of wind, storms, and knowledge. Kukulkan descends as a shadow of light down pyramid staircases and shares cosmic wisdom with the worthy.',
    loreSnippet: '"The serpent who learned to fly did not stop being a serpent. It became something more."',
    statBonus: { stat: 'INT', value: 10, type: 'bonus' },
    statPenalty: { stat: 'END', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Feathered serpent sight reveals all hidden enemy information',
      effectType: 'enemy_info_reveal',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'serpent_descent',
      name: 'Serpent Descent',
      description: 'The feathered serpent descends: deal 130% magic damage and reduce enemy INT defense by 40% for 2 turns.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'magic_strike_and_debuff', value: 130, duration: 2 },
    },
    challenges: [
      {
        id: 'kukulkan_ch1',
        name: 'Cosmic Wisdom',
        description: 'Use Observe on 15 different enemy types.',
        domain: 'knowledge',
        tier: 'challenging',
        requirement: { type: 'observe_unique_enemies', value: 15 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'kukulkan_ch2',
        name: 'The Pyramid Shadow',
        description: 'Win a combat using only magic damage against an elite or boss.',
        domain: 'knowledge',
        tier: 'legendary',
        requirement: { type: 'elite_magic_only_kill', value: 1 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The feathered serpent sees what the ground-crawler cannot. Look up.',
        'You have learned enough. Now apply it.',
        'Kukulkan descended to share this knowledge with you specifically.',
      ],
      warning: [
        'Wisdom is not arrogance. Do not confuse them.',
        'The serpent who stops learning becomes just another snake.',
        'Knowledge unused is weight carried for nothing.',
      ],
      achievement: [
        'THE FEATHERED SERPENT ASCENDS IN YOUR HONOR. Kukulkan is pleased.',
        'Cosmic knowledge applied perfectly. The pyramid acknowledges you.',
        'You have earned the right to look down from the summit.',
      ],
      combat: [
        'They cannot defend what they cannot see coming.',
        'The informed strike does three times the work.',
        'Knowledge is the first weapon. Deploy it first.',
      ],
    },
  },

  // ===== AH PUCH - Death Domain =====
  {
    id: 'ah_puch',
    name: 'Ah Puch',
    pantheon: 'maya',
    domain: 'death',
    personality: 'dark',
    title: 'Lord of Xibalba, Ruler of the Ninth Underworld',
    description:
      'The supreme death god who rules the lowest level of the underworld. He walks among the dead wearing bells that ring with each step — a sound mortals dread.',
    loreSnippet: '"When you hear the bells and there is no wind, do not turn around."',
    statBonus: { stat: 'PER', value: 10, type: 'bonus' },
    statPenalty: { stat: 'CHA', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Lord of death amplifies all damage against weakened enemies',
      effectType: 'damage_vs_undead',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'bells_of_xibalba',
      name: 'Bells of Xibalba',
      description: 'Ring the death bells: terrorize the enemy (-30% attack, -20% defense) for 3 turns.',
      unlockFavor: 70,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'mass_debuff', value: 30, duration: 3 },
    },
    challenges: [
      {
        id: 'ah_puch_ch1',
        name: 'The Ninth Level',
        description: 'Reach floor 9 in a single run.',
        domain: 'death',
        tier: 'challenging',
        requirement: { type: 'reach_floor', value: 9 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'ah_puch_ch2',
        name: 'Xibalba Claims Its Own',
        description: 'Win 3 combats while at or below 10% HP without using any healing.',
        domain: 'death',
        tier: 'legendary',
        requirement: { type: 'win_at_low_hp_no_heal', value: 3 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The lord of death has no interest in those who die too quickly. Survive longer.',
        'Ah Puch has seen a million endings. Make this one interesting.',
        'Walk in the shadow of death and let your enemy see it following you.',
      ],
      warning: [
        'The bells ring for someone in this room. Make sure it is not for you.',
        'Even Ah Puch does not rush death. Do not rush it for yourself.',
        'The ninth level does not forgive recklessness.',
      ],
      achievement: [
        'AH PUCH RINGS HIS BELLS IN TRIBUTE. A rare honor from the lord of death.',
        'You walked his domain and returned. Not many can say that.',
        'The ninth level acknowledges you. That is no small thing.',
      ],
      combat: [
        'Make them fear the bells before they feel the blow.',
        'Debilitate first. Kill at your leisure.',
        'Death comes for the weakened first. Be the instrument.',
      ],
    },
  },

  // ===== HUNAHPU - War Domain =====
  {
    id: 'hunahpu',
    name: 'Hunahpu',
    pantheon: 'maya',
    domain: 'war',
    personality: 'aggressive',
    title: 'Hero Twin, Defeater of the Lords of Death',
    description:
      'One of the divine Hero Twins who descended into Xibalba and defeated the death lords through cunning and combat. He became the sun itself after his final victory.',
    loreSnippet: '"They invited us to our deaths. We arrived, played their games, and won. Then we became gods."',
    statBonus: { stat: 'STR', value: 12, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Hero Twin spirit grants the power to turn defeat into victory',
      effectType: 'physical_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'hero_twin_reversal',
      name: 'Hero Twin Reversal',
      description: 'When you would take lethal damage once, survive with 1 HP and gain +50% damage for 2 turns.',
      unlockFavor: 70,
      cooldownType: 'per_run',
      effect: { type: 'death_reversal_and_boost', value: 50, duration: 2 },
    },
    challenges: [
      {
        id: 'hunahpu_ch1',
        name: 'Games of Xibalba',
        description: 'Survive 3 encounters where you began below 25% HP.',
        domain: 'war',
        tier: 'challenging',
        requirement: { type: 'survive_low_hp_fights', value: 3 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'hunahpu_ch2',
        name: 'Defeat the Death Lords',
        description: 'Defeat 3 boss-tier enemies in a single run.',
        domain: 'war',
        tier: 'legendary',
        requirement: { type: 'boss_kills_per_run', value: 3 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The Hero Twins did not win by being stronger. They won by not stopping.',
        'Hunahpu played their games and won. Play yours.',
        'Even death can be defeated if you refuse to accept it.',
      ],
      warning: [
        'The twins were clever, not reckless. Know the difference.',
        'Pride before Xibalba is what they wanted from you. Do not give it.',
        'Survive first. Win second. That is the order.',
      ],
      achievement: [
        'HUNAHPU RISES AS THE SUN. His twin celebrates your victory.',
        'You played their game and you won. The Hero Twins approve.',
        'From the underworld to the heavens. You made the same journey.',
      ],
      combat: [
        'Turn their rules against them.',
        'The hero who cannot be stopped wins eventually.',
        'Keep fighting after they expect you to stop.',
      ],
    },
  },

  // ===== XBALANQUE - Trickery Domain =====
  {
    id: 'xbalanque',
    name: 'Xbalanque',
    pantheon: 'maya',
    domain: 'trickery',
    personality: 'playful',
    title: 'Hero Twin, Jaguar Sun',
    description:
      'The second Hero Twin, the jaguar aspect. More cunning and mischievous than his brother, Xbalanque used wit and disguise to outwit the lords of Xibalba and became the moon.',
    loreSnippet: '"The trick is not the deception itself. It is making them believe they had no other option."',
    statBonus: { stat: 'AGI', value: 10, type: 'bonus' },
    statPenalty: { stat: 'END', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Jaguar cunning makes every attack from an unexpected angle',
      effectType: 'dodge_chance',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'jaguar_disguise',
      name: 'Jaguar Disguise',
      description: 'Appear to flee: enemies lose focus for 2 turns (misses guaranteed), then you reappear dealing +100% damage.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'fake_flee_and_ambush', value: 100, duration: 2 },
    },
    challenges: [
      {
        id: 'xbalanque_ch1',
        name: 'The Misdirection',
        description: 'Dodge 8 attacks in a single floor.',
        domain: 'trickery',
        tier: 'challenging',
        requirement: { type: 'dodges_per_floor', value: 8 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'xbalanque_ch2',
        name: 'The Jaguar Trick',
        description: 'Win a combat after successfully fleeing from the same enemy type earlier.',
        domain: 'trickery',
        tier: 'heroic',
        requirement: { type: 'return_kill_after_flee', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The jaguar never hunts the way the prey expects. Remember that.',
        'Xbalanque approves of your creativity. Keep it up.',
        'The misdirection worked. Now capitalize.',
      ],
      warning: [
        'Clever has its limits. Know when to stop playing.',
        'The jaguar does not taunt from the open. Find cover.',
        'Too many tricks confuse the trickster too.',
      ],
      achievement: [
        'XBALANQUE LAUGHS WITH PURE DELIGHT. The jaguar twin is impressed.',
        'They never saw it coming. That was the whole point.',
        'Cunning executed perfectly. The moon shines brighter tonight.',
      ],
      combat: [
        'Make them commit. Then punish the commitment.',
        'Unpredictable is more dangerous than powerful.',
        'The jaguar strikes from shadow. Be the shadow.',
      ],
    },
  },

  // ===== YUM KAAX - Nature Domain =====
  {
    id: 'yum_kaax',
    name: 'Yum Kaax',
    pantheon: 'maya',
    domain: 'nature',
    personality: 'gentle',
    title: 'Lord of the Forest and Wild Things',
    description:
      'The benevolent god of forests, wild animals, and the natural abundance that feeds civilization. He protects animals and those who walk with respect through his domain.',
    loreSnippet: '"The forest feeds you or swallows you. Yum Kaax decides which."',
    statBonus: { stat: 'END', value: 10, type: 'bonus' },
    statPenalty: { stat: 'INT', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Forest guardian restores health between each encounter',
      effectType: 'hp_regen',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'forest_embrace',
      name: 'Forest Embrace',
      description: 'Call the forest: restore 30% HP and apply Thorns to yourself (attackers take 15% damage) for 3 turns.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'heal_and_thorns', value: 30, duration: 3 },
    },
    challenges: [
      {
        id: 'yum_kaax_ch1',
        name: 'Walk With Respect',
        description: 'Complete 5 floors without killing any beast-type enemies.',
        domain: 'nature',
        tier: 'challenging',
        requirement: { type: 'floors_no_beast_kills', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'yum_kaax_ch2',
        name: 'Lord of All Creatures',
        description: 'Survive 5 consecutive combats relying solely on END-based endurance (no offensive skills).',
        domain: 'nature',
        tier: 'heroic',
        requirement: { type: 'consecutive_endurance_fights', value: 5 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The forest provides for those who respect it. You have respected it.',
        'Yum Kaax sees your endurance. The forest does not abandon the patient.',
        'Wild things protect those who protect them in return.',
      ],
      warning: [
        'Even the gentlest forest has thorns. Do not ignore your defenses.',
        'The lord of wild things does not approve of waste.',
        'Nature is not passive. It responds to what you do.',
      ],
      achievement: [
        'THE FOREST RUSTLES WITH APPROVAL. Yum Kaax is deeply satisfied.',
        'You walked through the wild and came out stronger. As intended.',
        'Even the animals acknowledge you now. That is Yum Kaax speaking.',
      ],
      combat: [
        'Outlast them. The forest outlasts everything.',
        'Let their strikes bounce off your endurance.',
        'You are part of the forest now. Roots hold.',
      ],
    },
  },

  // ===== BULUC CHABTAN - War Domain =====
  {
    id: 'buluc_chabtan',
    name: 'Buluc Chabtan',
    pantheon: 'maya',
    domain: 'war',
    personality: 'aggressive',
    title: 'God of Human Sacrifice and Sudden Death',
    description:
      'The violent death god associated with warfare, sacrifice, and sudden violent ends. He appears where battles rage and claims the fallen for his own purposes.',
    loreSnippet: '"He does not choose the battle. He arrives when the battle chooses someone to end."',
    statBonus: { stat: 'STR', value: 15, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'God of sudden death makes every finishing blow deal extra damage',
      effectType: 'physical_damage',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'sudden_death',
      name: 'Sudden Death',
      description: 'Instantly kill any enemy below 25% HP. If they survive the threshold, deal 200% physical damage.',
      unlockFavor: 75,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'execute_or_heavy_strike', value: 200, condition: 'below_25_percent' },
    },
    challenges: [
      {
        id: 'buluc_ch1',
        name: 'Sudden Offering',
        description: 'Kill 10 enemies in a single strike (no prior damage to them).',
        domain: 'war',
        tier: 'heroic',
        requirement: { type: 'one_shot_kills', value: 10 },
        favorGain: 20,
        favorLoss: 10,
      },
      {
        id: 'buluc_ch2',
        name: "The God's Arrival",
        description: 'Win initiative and deal the killing blow in 15 combats.',
        domain: 'war',
        tier: 'legendary',
        requirement: { type: 'first_strike_kills', value: 15 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The god of sudden death approves of your decisiveness.',
        'Buluc Chabtan is standing behind your enemy. One more hit.',
        'End it. The god of sacrifice is growing impatient.',
      ],
      warning: [
        'Sudden death cuts both ways. Finish fast or face consequences.',
        'Do not let them see you hesitate. The god of sudden endings does not hesitate.',
        'Buluc Chabtan has no patience for drawn-out battles.',
      ],
      achievement: [
        'BULUC CHABTAN CLAIMS THE OFFERING. The god of sudden death is satisfied.',
        'Fast, decisive, final. The sacrifice god could not have done it better.',
        'Sudden death delivered. The god nods once and vanishes.',
      ],
      combat: [
        'First strike should be the last strike.',
        'Leave nothing standing that can threaten you.',
        'Sudden death favors the prepared.',
      ],
    },
  },

  // ===== EK CHUAH - Fortune Domain =====
  {
    id: 'ek_chuah',
    name: 'Ek Chuah',
    pantheon: 'maya',
    domain: 'fortune',
    personality: 'calculating',
    title: 'Black Scorpion, God of Merchants and Cacao',
    description:
      'The patron god of merchants and cacao. He guards travelers on long journeys and rewards those who honor deals and keep accounts.',
    loreSnippet: '"Every transaction is a prayer. Every profit is an offering. He is watching the ledger."',
    statBonus: { stat: 'LCK', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Merchant god improves all loot quality and gold dropped',
      effectType: 'loot_quality',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'merchants_eye',
      name: "Merchant's Eye",
      description: 'Reveal the rarity and value of all items on this floor. Next shop visit has 30% discount.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'reveal_items_and_discount', value: 30 },
    },
    challenges: [
      {
        id: 'ek_chuah_ch1',
        name: 'Profitable Journey',
        description: 'Collect 800 gold across a single run.',
        domain: 'fortune',
        tier: 'challenging',
        requirement: { type: 'gold_accumulated', value: 800 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'ek_chuah_ch2',
        name: 'The Great Merchant',
        description: 'Find and keep 4 rare-or-better items in a single run.',
        domain: 'fortune',
        tier: 'heroic',
        requirement: { type: 'rare_items_kept', value: 4 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Every kill has value. Ek Chuah is tallying.',
        'The merchant sees profit where others see only danger.',
        'You are making good transactions today.',
      ],
      warning: [
        'Wasted resources dishonor the merchant god.',
        'Do not spend what you cannot afford to lose.',
        'Ek Chuah is checking the ledger. The numbers should be better.',
      ],
      achievement: [
        'EK CHUAH STAMPS THE LEDGER APPROVED. The merchant god is very pleased.',
        'Profitable in every sense. The black scorpion acknowledges you.',
        'A run worth recording in the great ledger. Well done.',
      ],
      combat: [
        'Every win is a transaction. Make the terms favorable.',
        'Resource efficiency honors the merchant god.',
        'Kill efficiently. Loot fully. Move on.',
      ],
    },
  },

  // ===== BACAB (HOBNIL) - Authority Domain =====
  {
    id: 'hobnil',
    name: 'Hobnil',
    pantheon: 'maya',
    domain: 'authority',
    personality: 'stern',
    title: 'Bacab of the East, Keeper of the Red Direction',
    description:
      'One of the four Bacab brothers who hold up the corners of the world. Hobnil guards the East and controls the red bee. The four brothers together keep existence from collapsing.',
    loreSnippet: '"He has held the sky up since before you were born. He will hold it up after you are forgotten. Respect is mandatory."',
    statBonus: { stat: 'END', value: 12, type: 'bonus' },
    statPenalty: { stat: 'AGI', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'World-pillar strength makes you impossible to knock down',
      effectType: 'intimidation',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'pillar_of_the_world',
      name: 'Pillar of the World',
      description: 'Plant yourself as a world-pillar: immune to all knockback and status effects for 4 turns, +35% defense.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'root_immunity_defense', value: 35, duration: 4 },
    },
    challenges: [
      {
        id: 'hobnil_ch1',
        name: 'Pillar of the East',
        description: 'Survive 15 hits without dying in a single combat.',
        domain: 'authority',
        tier: 'challenging',
        requirement: { type: 'hits_survived_single_combat', value: 15 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'hobnil_ch2',
        name: 'The World Does Not Fall',
        description: 'Complete 8 floors without retreating from a single encounter.',
        domain: 'authority',
        tier: 'legendary',
        requirement: { type: 'floors_no_retreat', value: 8 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The Bacab holds up the world. You can hold up to this fight.',
        'Hobnil has been standing here since creation. He respects your endurance.',
        'The pillar does not bend. Neither do you today.',
      ],
      warning: [
        'Even pillars crack under the wrong stress. Know your limits.',
        'The world-keeper watches your structural integrity. It is concerning.',
        'Hobnil does not carry the weak. Stand on your own.',
      ],
      achievement: [
        'THE BACAB NODS ONCE. That is the highest praise from a world-pillar.',
        'Immovable. That is what you proved. Hobnil is satisfied.',
        'You held up the sky today. The east direction acknowledges you.',
      ],
      combat: [
        'Let them exhaust themselves on your defense.',
        'A pillar does not attack. It endures until the enemy breaks.',
        'Hold the position. Then answer from certainty.',
      ],
    },
  },

  // ===== XMUCANE - Magic Domain =====
  {
    id: 'xmucane',
    name: 'Xmucane',
    pantheon: 'maya',
    domain: 'magic',
    personality: 'mysterious',
    title: 'Grandmother of Light, First Diviner',
    description:
      'The ancient grandmother deity who, with her husband Xpiyacoc, cast the first divination that allowed humanity to be created. She performs the first magic and sees the first things.',
    loreSnippet: '"Before anything was named, she cast the divination. Everything that follows is her answer."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'First-divination magic amplifies all spell effects',
      effectType: 'spell_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'first_divination',
      name: 'First Divination',
      description: 'Cast the primordial divination: reveal all of this floor\'s hidden information and gain +25% to all stats for 3 turns.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'full_reveal_and_stat_boost', value: 25, duration: 3 },
    },
    challenges: [
      {
        id: 'xmucane_ch1',
        name: 'The Grandmother\'s Reading',
        description: 'Complete 3 floors where you used at least 5 different skills.',
        domain: 'magic',
        tier: 'challenging',
        requirement: { type: 'skill_variety_per_floor', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'xmucane_ch2',
        name: 'Primordial Casting',
        description: 'Deal 1200 total magic damage in a single run.',
        domain: 'magic',
        tier: 'heroic',
        requirement: { type: 'total_magic_damage', value: 1200 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The grandmother cast the first divination for you. Read it.',
        'Magic older than any god flows through your hands.',
        'Xmucane sees what you cannot. Trust the divination.',
      ],
      warning: [
        'The first divination does not lie. But it requires interpretation.',
        'Ancient magic demands precision. Scatter it and lose it.',
        'The grandmother is patient. Her magic is not.',
      ],
      achievement: [
        'THE FIRST DIVINATION IS FULFILLED. Xmucane is deeply satisfied.',
        'Magic cast as it was first intended. The grandmother approves.',
        'You have completed what the primordial casting began. Magnificent.',
      ],
      combat: [
        'Cast with intention. Every spell is a divination.',
        'The magic knows where to go. Let it.',
        'Ancient power flows best when not forced.',
      ],
    },
  },

  // ===== IX TAB - Death Domain =====
  {
    id: 'ix_tab',
    name: 'Ix Tab',
    pantheon: 'maya',
    domain: 'death',
    personality: 'dark',
    title: 'Goddess of the Hanged, Patron of the Brave Dead',
    description:
      'The goddess who collects the souls of warriors who died bravely in battle, women who died in childbirth, and those who made honorable sacrifices. She offers mercy to the valiant dead.',
    loreSnippet: '"Not all death is the same. She keeps track of which kind you died."',
    statBonus: { stat: 'INT', value: 10, type: 'bonus' },
    statPenalty: { stat: 'LCK', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Patron of brave death reduces all penalties from near-death state',
      effectType: 'damage_vs_undead',
      effectValue: 10,
    },
    uniqueAbility: {
      id: 'valiant_death',
      name: 'Valiant Death',
      description: 'When below 20% HP, all damage dealt is increased by 50% and you cannot be stunned.',
      unlockFavor: 60,
      cooldownType: 'passive',
      effect: { type: 'low_hp_damage_boost', value: 50, condition: 'below_20_percent' },
    },
    challenges: [
      {
        id: 'ix_tab_ch1',
        name: 'The Brave Dead',
        description: 'Win 5 combats while below 20% HP.',
        domain: 'death',
        tier: 'heroic',
        requirement: { type: 'win_at_low_hp', value: 5 },
        favorGain: 20,
        favorLoss: 10,
      },
      {
        id: 'ix_tab_ch2',
        name: "The Goddess's Collection",
        description: 'Survive 3 encounters where you began at exactly 1 HP.',
        domain: 'death',
        tier: 'legendary',
        requirement: { type: 'survive_at_1hp', value: 3 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The brave dead fight hardest at the edge. You are at the edge.',
        'Ix Tab watches the valiant die well. Show her you die harder.',
        'Almost dead is still alive. Use it.',
      ],
      warning: [
        'The goddess collects the brave dead, not the reckless dead.',
        'Honor your near-death. It is still near.',
        'Ix Tab does not accept those who waste their final moments.',
      ],
      achievement: [
        'IX TAB OPENS HER ARMS IN RECOGNITION. You have fought as the brave dead fight.',
        'Valiant to the last. The goddess of the brave dead honors you.',
        'From the edge of death, victory. Ix Tab is deeply moved.',
      ],
      combat: [
        'The lower your HP, the fiercer Ix Tab makes you.',
        'Fight like you have nothing left to lose. Sometimes you do.',
        'Brave dead fight harder. Channel it.',
      ],
    },
  },

];

export const mayaPantheon = mayaDeities;
