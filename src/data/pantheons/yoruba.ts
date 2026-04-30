/**
 * Yoruba Pantheon - The Orishas of West Africa
 * 14 deities covering war, sky, fortune, sea, wisdom, knowledge,
 * trickery, death, nature, life, authority, and fire
 */

import type { Deity } from '../../types/Deity';

const yorubaDeities: Deity[] = [
  // ===== OGUN - War Domain =====
  {
    id: 'ogun',
    name: 'Ogun',
    pantheon: 'yoruba',
    domain: 'war',
    personality: 'aggressive',
    title: 'Lord of Iron and War',
    description:
      'God of iron, warfare, and all who work with metal. He clears the path with his machete and expects no mercy from those who call on him.',
    loreSnippet: '"Iron never lies. The blade cuts truth into the world."',
    statBonus: { stat: 'STR', value: 10, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Iron fills your sinews; every strike lands with divine force',
      effectType: 'physical_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'iron_covenant',
      name: 'Iron Covenant',
      description:
        'Iron weapons in your hands deal bonus physical damage equal to 30% of your base STR for the remainder of combat.',
      unlockFavor: 60,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'weapon_damage_multiplier', value: 1.3, condition: 'iron_weapons' },
    },
    challenges: [
      {
        id: 'ogun_ch1',
        name: "Ogun's Tribute",
        description: 'Slay 20 enemies using iron or metal weapons to honor the forge-god.',
        domain: 'war',
        tier: 'challenging',
        requirement: { type: 'kill_with_weapon_type', value: 20 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'ogun_ch2',
        name: 'Path of the Machete',
        description: 'Defeat 2 boss-tier enemies without retreating or using healing items.',
        domain: 'war',
        tier: 'heroic',
        requirement: { type: 'boss_kill_no_heal', value: 2 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Your iron is hungry. Feed it.',
        'The forge remembers every blade you have swung. Keep swinging.',
        'Ogun watches. Do not waste the strength he granted you.',
      ],
      warning: [
        'You hesitate. Iron does not hesitate.',
        'Drop your fear before you drop your weapon.',
        'Ogun has no patience for the timid warrior.',
      ],
      achievement: [
        'THE IRON SINGS. Ogun roars his approval.',
        'You have carved your name into the face of war.',
        'Even the forge-god raises his machete in salute.',
      ],
      combat: [
        'Cut through. Keep cutting.',
        'Every enemy before you is just metal to be shaped.',
        'Strike first, strike hard, let iron decide the rest.',
      ],
    },
  },

  // ===== SHANGO - Sky Domain =====
  {
    id: 'shango',
    name: 'Shango',
    pantheon: 'yoruba',
    domain: 'sky',
    personality: 'wrathful',
    title: 'King of Thunder and Justice',
    description:
      'God of thunder, lightning, and divine justice. His double-headed axe mirrors his power: storm above and judgment below. Those who wrong the innocent draw his wrath.',
    loreSnippet: '"Thunder announces me. Lightning is my verdict."',
    statBonus: { stat: 'STR', value: 10, type: 'bonus' },
    statPenalty: { stat: 'AGI', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Lightning arcs from your blows, shocking those who dare face you',
      effectType: 'lightning_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'thunder_verdict',
      name: "Thunder's Verdict",
      description:
        'Your attacks carry a 25% chance to stun the target for 1 turn as Shango passes judgment.',
      unlockFavor: 65,
      cooldownType: 'passive',
      effect: { type: 'stun_chance', value: 0.25, duration: 1 },
    },
    challenges: [
      {
        id: 'shango_ch1',
        name: 'Storm Judgment',
        description: 'Strike down 15 enemies with lightning-element attacks to call down Shango\'s verdict.',
        domain: 'sky',
        tier: 'challenging',
        requirement: { type: 'kill_with_lightning', value: 15 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'shango_ch2',
        name: 'King of the Storm Floor',
        description: 'Complete an entire floor without taking more than 20% of your max HP in damage.',
        domain: 'sky',
        tier: 'heroic',
        requirement: { type: 'floor_clear_low_damage', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The storm favors the bold. Move forward.',
        'Thunder rolls before you. Enemies should tremble.',
        'Shango grants his strength to those who stand upright.',
      ],
      warning: [
        'Injustice invites the lightning. Act with purpose.',
        'Do not let the storm within you go to waste.',
        'Shango is watching. Do not bring shame to his name.',
      ],
      achievement: [
        'THE THUNDER ROARS YOUR NAME. Shango is pleased.',
        'Justice delivered. The sky acknowledges you.',
        'You fight as Shango intended — with power and purpose.',
      ],
      combat: [
        'Strike like the storm — no warning, no mercy.',
        'Let thunder announce your arrival.',
        'Every blow is a verdict. Make it count.',
      ],
    },
  },

  // ===== OSHUN - Fortune Domain =====
  {
    id: 'oshun',
    name: 'Oshun',
    pantheon: 'yoruba',
    domain: 'fortune',
    personality: 'playful',
    title: 'Lady of Sweet Waters',
    description:
      'Goddess of rivers, love, and abundant wealth. She flows around every obstacle with grace and coaxes fortune to follow those she favors.',
    loreSnippet: '"Honey draws more than vinegar ever could. Come, let me show you."',
    statBonus: { stat: 'CHA', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Golden luck trails your steps, improving the quality of every drop',
      effectType: 'loot_quality',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'sweet_waters_charm',
      name: 'Sweet Waters Charm',
      description:
        'Charm a single enemy, causing them to skip their next turn as they fall momentarily under Oshun\'s spell.',
      unlockFavor: 55,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'skip_turn', value: 1, duration: 1 },
    },
    challenges: [
      {
        id: 'oshun_ch1',
        name: "River's Offering",
        description: 'Collect 10 gold-tier or higher loot items within 5 floors to honor Oshun\'s abundance.',
        domain: 'fortune',
        tier: 'challenging',
        requirement: { type: 'collect_gold_loot', value: 10, timeLimit: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'oshun_ch2',
        name: 'The Golden Current',
        description: 'Charm 5 different enemy types using CHA-based abilities or items.',
        domain: 'fortune',
        tier: 'heroic',
        requirement: { type: 'charm_enemy_types', value: 5 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Gold loves company. Gather more, dear.',
        'Oshun smiles — your fortune is already turning.',
        'A little sweetness goes a long way. Keep going.',
      ],
      warning: [
        'Greed is not abundance. Know the difference.',
        'Even rivers have currents that pull you under. Be careful.',
        'Oshun is generous, but do not mistake her patience for weakness.',
      ],
      achievement: [
        'SWEETNESS OVERFLOWS! Oshun dances in your honor.',
        'Fortune herself has written your name in gold.',
        'The river sings. You have earned her blessing.',
      ],
      combat: [
        'Charm them before you disarm them.',
        'A smile opens more doors than a sword. Use both.',
        'Turn their aggression into your opportunity.',
      ],
    },
  },

  // ===== YEMOJA - Sea Domain =====
  {
    id: 'yemoja',
    name: 'Yemoja',
    pantheon: 'yoruba',
    domain: 'sea',
    personality: 'gentle',
    title: 'Mother of Waters',
    description:
      'Protector of children and all who sail the sea. She is the mother of countless Orishas and wraps her children in living waters that ward off harm.',
    loreSnippet: '"Come to the water, child. The depths do not frighten those I protect."',
    statBonus: { stat: 'END', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Living waters flow through your wounds, restoring what was lost',
      effectType: 'healing_power',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'ocean_embrace',
      name: 'Ocean Embrace',
      description:
        'At the start of each combat, an aquatic shield absorbs the first hit you receive completely.',
      unlockFavor: 55,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'absorb_first_hit', value: 1 },
    },
    challenges: [
      {
        id: 'yemoja_ch1',
        name: "Mother's Vigil",
        description: 'Survive 5 consecutive combats without being reduced below 50% HP.',
        domain: 'sea',
        tier: 'challenging',
        requirement: { type: 'consecutive_combat_high_hp', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'yemoja_ch2',
        name: 'Depths Unbroken',
        description: 'Complete an entire floor without your HP dropping below 25%.',
        domain: 'sea',
        tier: 'heroic',
        requirement: { type: 'floor_clear_hp_threshold', value: 25 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'You are held. The waters will not let you fall.',
        'Every wound heals. Press forward with courage.',
        'Yemoja watches her child with pride.',
      ],
      warning: [
        'Even the sea has its storms. Do not be reckless.',
        'A mother\'s love is not armor against foolishness.',
        'Protect yourself as fiercely as I protect you.',
      ],
      achievement: [
        'THE OCEAN SWELLS WITH PRIDE. You have not disappointed her.',
        'You endured. Yemoja wraps you in her blessing.',
        'Unbroken, undrowned — the Mother\'s chosen.',
      ],
      combat: [
        'Absorb the blow and return twice the force.',
        'Endurance outlasts fury. Outlast them.',
        'Let the tide of battle flow through you, not against you.',
      ],
    },
  },

  // ===== OBATALA - Wisdom Domain =====
  {
    id: 'obatala',
    name: 'Obatala',
    pantheon: 'yoruba',
    domain: 'wisdom',
    personality: 'serene',
    title: 'Sculptor of Human Forms',
    description:
      'Creator of human bodies and god of purity, peace, and clarity. He abhors violence born of impulse and blesses those who think before they act.',
    loreSnippet: '"I shaped your hands. Use them with wisdom, not waste."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'LCK', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Divine purity flows through you, making every SP spent go further',
      effectType: 'sp_efficiency',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'pure_form',
      name: 'Pure Form',
      description:
        'Status effects applied to you have their duration reduced by 50% as Obatala\'s purity repels corruption.',
      unlockFavor: 60,
      cooldownType: 'passive',
      effect: { type: 'status_duration_reduction', value: 0.5 },
    },
    challenges: [
      {
        id: 'obatala_ch1',
        name: 'The Unsoiled Path',
        description: 'Complete 3 floors without using any poison, fire, or curse effects on enemies.',
        domain: 'wisdom',
        tier: 'challenging',
        requirement: { type: 'floor_clear_no_status_offense', value: 3 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'obatala_ch2',
        name: 'White Cloth Trial',
        description: 'Defeat a boss without receiving any status ailments during the fight.',
        domain: 'wisdom',
        tier: 'heroic',
        requirement: { type: 'boss_kill_no_status', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Clarity is its own strength. You are clear.',
        'Obatala sees the wisdom forming in your choices.',
        'Purity of intent opens the truest path.',
      ],
      warning: [
        'Do not stain what I have given you with recklessness.',
        'Hasty choices soil even the cleanest garment.',
        'Still your mind before you move your hand.',
      ],
      achievement: [
        'PURE AND UNBLEMISHED. Obatala nods in quiet satisfaction.',
        'You acted with wisdom. The form you carry honors its maker.',
        'Even the white cloth remains spotless. Well done.',
      ],
      combat: [
        'Calm hands strike truer than angry ones.',
        'Think one move ahead. Obatala\'s gift is foresight.',
        'Purity of mind — do not let panic cloud your strikes.',
      ],
    },
  },

  // ===== ORUNMILA - Knowledge Domain =====
  {
    id: 'orunmila',
    name: 'Orunmila',
    pantheon: 'yoruba',
    domain: 'knowledge',
    personality: 'mysterious',
    title: 'Witness to Creation',
    description:
      'God of divination and destiny, who was present at the creation of all things. He reads the threads of fate and shares just enough for his champions to walk wisely.',
    loreSnippet: '"I was there when you were made. I know how this ends — but you must live it."',
    statBonus: { stat: 'INT', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Orunmila reveals the nature of your foes, stripping away their secrets',
      effectType: 'enemy_info',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'divination_sight',
      name: 'Divination Sight',
      description:
        'At the start of every combat, you immediately learn the full HP, resistances, and weaknesses of all enemies present.',
      unlockFavor: 65,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'reveal_enemy_stats', value: 1 },
    },
    challenges: [
      {
        id: 'orunmila_ch1',
        name: 'Reading the Odu',
        description: 'Exploit the elemental weakness of 10 enemies in a single run to prove your mastery of hidden knowledge.',
        domain: 'knowledge',
        tier: 'challenging',
        requirement: { type: 'exploit_weakness', value: 10 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'orunmila_ch2',
        name: 'Witness to the Outcome',
        description: 'Defeat 2 bosses by striking their revealed weak points for every killing blow.',
        domain: 'knowledge',
        tier: 'heroic',
        requirement: { type: 'boss_kill_weak_point', value: 2 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The threads of fate pull in your favor... for now.',
        'Knowledge is already yours. You need only remember it.',
        'I have seen your victory. Walk toward it.',
      ],
      warning: [
        'The path branches here. Choose carefully — I will not intervene.',
        'Destiny is not a shield against poor decisions.',
        'Even foreknowledge cannot save the one who ignores it.',
      ],
      achievement: [
        'AS FORETOLD. Orunmila marks this moment in the great tapestry.',
        'You read the signs correctly. The oracle is pleased.',
        'Destiny fulfilled — not by chance, but by wisdom.',
      ],
      combat: [
        'You already know their weakness. Strike it.',
        'Information is the sharpest weapon. Use what you know.',
        'Their secrets are yours. Do not squander them.',
      ],
    },
  },

  // ===== ESHU/ELEGBA - Trickery Domain =====
  {
    id: 'eshu',
    name: 'Eshu',
    pantheon: 'yoruba',
    domain: 'trickery',
    personality: 'chaotic',
    title: 'Opener of Roads',
    description:
      'Divine trickster and messenger who stands at every crossroads. No path opens or closes without his say, and he delights in upending what was certain.',
    loreSnippet: '"Every road leads to me first. You just did not notice."',
    statBonus: { stat: 'AGI', value: 10, type: 'bonus' },
    statPenalty: { stat: 'END', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Eshu bends the road beneath you; enemies grasp at air where you stood',
      effectType: 'dodge',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'open_the_road',
      name: 'Open the Road',
      description:
        'Once per floor, bypass all normal path restrictions — take any branch, room, or route available regardless of locks, requirements, or previous choices.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'ignore_path_restrictions', value: 1 },
    },
    challenges: [
      {
        id: 'eshu_ch1',
        name: 'The Trickster\'s Road',
        description: 'Dodge 15 attacks successfully in a single floor to show Eshu your footwork.',
        domain: 'trickery',
        tier: 'challenging',
        requirement: { type: 'dodge_count', value: 15, timeLimit: 1 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'eshu_ch2',
        name: 'Crossroads King',
        description: 'Use the Open the Road ability to access 3 locked paths across one run.',
        domain: 'trickery',
        tier: 'heroic',
        requirement: { type: 'use_ability', value: 3 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Ha! Even I did not see that coming. Well played.',
        'Every road bends for you. Keep moving.',
        'Eshu grins — that was almost as clever as him.',
      ],
      warning: [
        'Even tricksters get tricked. Watch your back.',
        'The crossroads has teeth if you stand there too long.',
        'Do not let overconfidence make you predictable.',
      ],
      achievement: [
        'ESHU CACKLES WITH DELIGHT. The road is yours!',
        'The trickster tips his hat. That was worthy.',
        'You played the crossroads like a master. Eshu approves.',
      ],
      combat: [
        'Never be where they expect you. Simple.',
        'The best dodge is the one they never saw coming.',
        'Confuse them first, then strike while they search.',
      ],
    },
  },

  // ===== OYA - Death Domain =====
  {
    id: 'oya',
    name: 'Oya',
    pantheon: 'yoruba',
    domain: 'death',
    personality: 'wrathful',
    title: 'Lady of Storms and the Veil',
    description:
      'Goddess of wind, violent change, and the boundary between the living and the dead. She sweeps battlefields clean with the fury of a hurricane.',
    loreSnippet: '"I do not cause death. I simply clear the space it needs."',
    statBonus: { stat: 'PER', value: 10, type: 'bonus' },
    statPenalty: { stat: 'CHA', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Oya\'s fury consecrates your strikes against the walking dead',
      effectType: 'undead_damage',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'death_wind',
      name: 'Death Wind',
      description:
        'After landing a killing blow, a gust of Oya\'s wind fills your limbs — gain a speed boost granting an extra action for 2 turns.',
      unlockFavor: 65,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'extra_action_on_kill', value: 2, duration: 2 },
    },
    challenges: [
      {
        id: 'oya_ch1',
        name: 'Clearing the Field',
        description: 'Kill 20 enemies before they can land an attack on you to prove Oya\'s speed in death.',
        domain: 'death',
        tier: 'challenging',
        requirement: { type: 'kill_before_attacked', value: 20 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'oya_ch2',
        name: 'Storm Reaper',
        description: 'Kill 2 bosses using the Death Wind bonus action to deliver the killing blow.',
        domain: 'death',
        tier: 'heroic',
        requirement: { type: 'boss_kill_with_ability', value: 2 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The wind is at your back. Press them harder.',
        'Every kill feeds the storm. Build it.',
        'Oya sees your hunger. Satisfy it.',
      ],
      warning: [
        'The storm does not pause for the hesitant.',
        'Sluggishness invites death — yours, not theirs.',
        'Oya\'s patience is measured in hurricanes. Do not test it.',
      ],
      achievement: [
        'THE STORM IS SATISFIED. Oya howls in fierce approval.',
        'The field is clear. You are her hurricane.',
        'Wind and death in perfect measure. Oya is pleased.',
      ],
      combat: [
        'Kill fast. Kill again. Keep the storm alive.',
        'Every fallen foe is fuel. Do not slow down.',
        'Strike like a gust — before they can brace for it.',
      ],
    },
  },

  // ===== OSANYIN - Nature Domain (Healing) =====
  {
    id: 'osanyin',
    name: 'Osanyin',
    pantheon: 'yoruba',
    domain: 'nature',
    personality: 'mysterious',
    title: 'Keeper of the Sacred Herbs',
    description:
      'God of medicinal plants, hidden remedies, and the living pharmacy of the forest. He guards the knowledge that separates a healer from a poisoner.',
    loreSnippet: '"Every leaf is a door. Most people walk past them without knocking."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Herbal wisdom flows through you, amplifying all healing you receive',
      effectType: 'healing_power',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'potent_harvest',
      name: 'Potent Harvest',
      description:
        'All consumable items — potions, herbs, and food — grant 50% more effect when used, as Osanyin blesses their properties.',
      unlockFavor: 60,
      cooldownType: 'passive',
      effect: { type: 'consumable_effect_multiplier', value: 1.5 },
    },
    challenges: [
      {
        id: 'osanyin_ch1',
        name: 'The Healer\'s Trial',
        description: 'Heal a total of 200 HP across consumable uses in a single run to show mastery of the herb-lore.',
        domain: 'nature',
        tier: 'challenging',
        requirement: { type: 'total_hp_healed_consumables', value: 200 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'osanyin_ch2',
        name: 'Forest Pharmacy',
        description: 'Collect and use 5 different types of consumable items within 3 floors.',
        domain: 'nature',
        tier: 'heroic',
        requirement: { type: 'use_unique_consumable_types', value: 5, timeLimit: 3 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The forest provides. You only need to look.',
        'Your supplies carry more power than you realize.',
        'Osanyin nods — the herbs are working as intended.',
      ],
      warning: [
        'Waste not the gifts the forest offers.',
        'A healer who ignores their medicine dies needlessly.',
        'The knowledge of herbs means nothing if you do not use it.',
      ],
      achievement: [
        'THE HERBS SING YOUR PRAISES. Osanyin is honored.',
        'You have proven that healing is its own form of power.',
        'The forest recognizes you. Osanyin smiles from the shadows.',
      ],
      combat: [
        'Heal smart, not desperately. Time your recovery.',
        'A well-timed potion is worth more than a sword swing.',
        'Osanyin\'s gift is knowing when to stop and when to push.',
      ],
    },
  },

  // ===== OSOOSI - Nature Domain (Hunt) =====
  {
    id: 'osoosi',
    name: 'Osoosi',
    pantheon: 'yoruba',
    domain: 'nature',
    personality: 'serene',
    title: 'Master of the Sacred Hunt',
    description:
      'God of hunters, forests, and the perfect arrow. He teaches patience as a weapon and ensures that the one who lines up their shot with care never misses.',
    loreSnippet: '"The animal does not run from the arrow it never heard coming."',
    statBonus: { stat: 'PER', value: 10, type: 'bonus' },
    statPenalty: { stat: 'CHA', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Hunter\'s eye sharpens your aim, turning each strike into a precision hit',
      effectType: 'accuracy',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'first_arrow',
      name: 'First Arrow',
      description:
        'Ranged attacks and PER-based weapon strikes always hit on the first attack of each combat, guaranteed.',
      unlockFavor: 55,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'guaranteed_hit_first_attack', value: 1 },
    },
    challenges: [
      {
        id: 'osoosi_ch1',
        name: 'Clean Kill',
        description: 'Kill 15 enemies with ranged or PER-based attacks to honor Osoosi\'s domain.',
        domain: 'nature',
        tier: 'challenging',
        requirement: { type: 'kill_with_ranged', value: 15 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'osoosi_ch2',
        name: 'Sacred Hunt',
        description: 'Defeat 2 bosses with a ranged or PER-based weapon dealing the killing blow.',
        domain: 'nature',
        tier: 'heroic',
        requirement: { type: 'boss_kill_ranged', value: 2 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'You are lining up the perfect shot. Take it.',
        'Patience and precision — Osoosi sees both in you.',
        'The hunt rewards those who wait for the right moment.',
      ],
      warning: [
        'A hurried arrow rarely finds its mark.',
        'Do not let urgency make you sloppy.',
        'Osoosi does not rush, and neither should you.',
      ],
      achievement: [
        'A PERFECT KILL. Osoosi marks you among the great hunters.',
        'The forest acknowledges your skill. The prey had no chance.',
        'Clean, precise, inevitable — the hunter\'s way, fulfilled.',
      ],
      combat: [
        'One arrow, one kill. Make the first one count.',
        'Find their opening before you commit.',
        'The patient hunter always eats. Be patient.',
      ],
    },
  },

  // ===== NANA BULUKU - Life Domain =====
  {
    id: 'nana_buluku',
    name: 'Nana Buluku',
    pantheon: 'yoruba',
    domain: 'life',
    personality: 'serene',
    title: 'Ancient Creatrix, Grandmother of Orishas',
    description:
      'The primordial grandmother who existed before the other gods. Her age is without measure, and her care for life — all life — is absolute and unhurried.',
    loreSnippet: '"Before the storm, before the iron, before the river — there was me."',
    statBonus: { stat: 'END', value: 10, type: 'bonus' },
    statPenalty: { stat: 'AGI', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Primordial life energy seeps into your wounds, never letting them fester long',
      effectType: 'hp_regen',
      effectValue: 10,
    },
    uniqueAbility: {
      id: 'ancient_renewal',
      name: 'Ancient Renewal',
      description:
        'At the start of each of your turns, automatically regenerate 5 HP as Nana Buluku\'s primordial life force sustains you.',
      unlockFavor: 70,
      cooldownType: 'passive',
      effect: { type: 'hp_regen_per_turn', value: 5 },
    },
    challenges: [
      {
        id: 'nana_buluku_ch1',
        name: 'Enduring Life',
        description: 'Regenerate a cumulative total of 100 HP through passive regen effects across one run.',
        domain: 'life',
        tier: 'challenging',
        requirement: { type: 'total_passive_regen', value: 100 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'nana_buluku_ch2',
        name: 'The Grandmother\'s Trial',
        description: 'Complete 3 consecutive floors above 75% HP at each floor\'s end.',
        domain: 'life',
        tier: 'heroic',
        requirement: { type: 'floor_end_high_hp', value: 3 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Life is patient, and so am I. Keep going, child.',
        'You are still breathing. That is already a victory.',
        'Nana Buluku has seen worse. You will endure this.',
      ],
      warning: [
        'Even ancient things can be broken by enough carelessness.',
        'Do not squander the life I have given you sustaining.',
        'The body heals, but recklessness repeats.',
      ],
      achievement: [
        'LIFE PERSISTS. Nana Buluku watches with ancient satisfaction.',
        'You endured as all living things must. She is proud.',
        'The grandmother nods slowly. You understand now.',
      ],
      combat: [
        'Let them wear themselves down. You regenerate; they do not.',
        'Time is on your side if you manage your life wisely.',
        'Outlast them. That is the oldest strategy there is.',
      ],
    },
  },

  // ===== OLODUMARE - Authority Domain =====
  {
    id: 'olodumare',
    name: 'Olodumare',
    pantheon: 'yoruba',
    domain: 'authority',
    personality: 'stern',
    title: 'Supreme Being, Source of All Power',
    description:
      'The highest divinity in the Yoruba cosmology, from whom all other Orishas draw their authority. He speaks rarely, but when he does, creation listens.',
    loreSnippet: '"I do not argue. I simply am."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'AGI', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Supreme authority radiates from you, breaking the will of lesser beings',
      effectType: 'intimidation',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'supreme_command',
      name: 'Supreme Command',
      description:
        'Once per run, issue an absolute command that forces one non-boss enemy to flee the battlefield with a 100% flee rate.',
      unlockFavor: 75,
      cooldownType: 'per_run',
      effect: { type: 'force_flee', value: 1.0 },
    },
    challenges: [
      {
        id: 'olodumare_ch1',
        name: 'The Authority\'s Test',
        description: 'Cause 10 enemies to flee or surrender through intimidation or CHA-based actions.',
        domain: 'authority',
        tier: 'challenging',
        requirement: { type: 'cause_enemy_flee', value: 10 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'olodumare_ch2',
        name: 'Proof of Supreme Will',
        description: 'Complete an entire floor without your character being affected by fear, charm, or confusion effects.',
        domain: 'authority',
        tier: 'heroic',
        requirement: { type: 'floor_clear_no_cc_received', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Authority unchallenged does not need to shout.',
        'Carry yourself as one who has already won.',
        'Olodumare approves. Your bearing speaks for itself.',
      ],
      warning: [
        'Supreme power demands supreme responsibility.',
        'Do not squander this blessing with unworthy choices.',
        'I grant authority to those who deserve it. Continue deserving it.',
      ],
      achievement: [
        'ABSOLUTE. Olodumare acknowledges you with a nod of eternity.',
        'You exercised power with wisdom. The Supreme Being is satisfied.',
        'All creation bows slightly in acknowledgment.',
      ],
      combat: [
        'Command the battlefield before the first blow is struck.',
        'Let them see your authority and reconsider their courage.',
        'You are the highest presence in this room. Act like it.',
      ],
    },
  },

  // ===== AGANJU - Fire Domain =====
  {
    id: 'aganju',
    name: 'Aganju',
    pantheon: 'yoruba',
    domain: 'fire',
    personality: 'wrathful',
    title: 'God of Volcanoes and the Wild Places',
    description:
      'Lord of volcanic fire, vast wilderness, and the raw, untameable forces that reshape the earth. He has no patience for those who refuse to burn brightly.',
    loreSnippet: '"The volcano does not apologize for its eruption."',
    statBonus: { stat: 'STR', value: 10, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Volcanic fury coats your strikes, setting enemies ablaze with divine fire',
      effectType: 'fire_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'volcanic_persistence',
      name: 'Volcanic Persistence',
      description:
        'Burn status effects you apply to enemies persist for 1 additional turn as Aganju\'s volcanic heat lingers in their wounds.',
      unlockFavor: 60,
      cooldownType: 'passive',
      effect: { type: 'burn_duration_bonus', value: 1 },
    },
    challenges: [
      {
        id: 'aganju_ch1',
        name: 'Eruption',
        description: 'Set 15 enemies on fire using fire-based attacks or items in a single run.',
        domain: 'fire',
        tier: 'challenging',
        requirement: { type: 'apply_burn_status', value: 15 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'aganju_ch2',
        name: 'The Caldera',
        description: 'Deal a total of 300 fire damage across burn ticks on enemies in one run.',
        domain: 'fire',
        tier: 'heroic',
        requirement: { type: 'total_burn_damage', value: 300 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The fire inside you matches the one in my mountain. Burn.',
        'Aganju sees the heat rising in you. Good.',
        'Do not let the flame inside you die down now.',
      ],
      warning: [
        'Fire that does not spread is just a candle. Rage harder.',
        'You are cooling when you should be erupting.',
        'Aganju did not bless the cautious. Push harder.',
      ],
      achievement: [
        'THE VOLCANO ROARS IN APPROVAL. Aganju is alight with pride.',
        'You burned bright and true. The fire god is satisfied.',
        'Nothing left standing. The volcano claims its ground.',
      ],
      combat: [
        'Set them on fire and let it do your work.',
        'Burn everything. Aganju will sort out what matters later.',
        'Eruption without warning — that is the volcano\'s way.',
      ],
    },
  },

  // ===== OLOKUN - Sea Domain =====
  {
    id: 'olokun',
    name: 'Olokun',
    pantheon: 'yoruba',
    domain: 'sea',
    personality: 'mysterious',
    title: 'Lord of the Ocean Depths',
    description:
      'God of the deepest, most unknowable parts of the sea, where wealth beyond imagining rests in absolute darkness. He is vast, ancient, and impossible to fully comprehend.',
    loreSnippet: '"What sinks to the bottom of the sea does not disappear. It becomes mine."',
    statBonus: { stat: 'INT', value: 10, type: 'bonus' },
    statPenalty: { stat: 'CHA', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'The wealth of the deep rises to meet you; every fallen foe yields richer rewards',
      effectType: 'loot_quality',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'depths_bounty',
      name: "Depth's Bounty",
      description:
        'Once per floor, the first monster you kill is guaranteed to drop a material or crafting component regardless of its normal drop table.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'guaranteed_material_drop', value: 1 },
    },
    challenges: [
      {
        id: 'olokun_ch1',
        name: 'Sunken Treasure',
        description: 'Collect 5 rare or higher material drops from monster kills in a single run.',
        domain: 'sea',
        tier: 'challenging',
        requirement: { type: 'collect_material_drops', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'olokun_ch2',
        name: 'Abyssal Claim',
        description: 'Collect a legendary-tier material drop by using Depth\'s Bounty on a boss or elite enemy.',
        domain: 'sea',
        tier: 'heroic',
        requirement: { type: 'legendary_material_from_ability', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The deep rewards patience. Stay the course.',
        'Treasures unseen are still treasures. Press deeper.',
        'Olokun watches with ancient curiosity. You interest him.',
      ],
      warning: [
        'Not all that glitters at the bottom is safe to touch.',
        'Greed without wisdom is just drowning slowly.',
        'The depths are generous to those who respect them.',
      ],
      achievement: [
        'THE DEPTHS YIELD THEIR SECRET. Olokun is satisfied.',
        'You claimed what the sea hid. It was always yours.',
        'Even the darkest ocean floor has opened for you.',
      ],
      combat: [
        'Like the deep sea — apply pressure until they break.',
        'The abyss outlasts everything. So can you.',
        'Crush them with the weight of the deep. Relentless.',
      ],
    },
  },
];

export const yorubaPantheon = yorubaDeities;
