/**
 * Shinto Pantheon - Nature Kami of Japan
 * 14 nature spirits distinct from the japanese.ts file (which covers the high-pantheon kami).
 * These are the earthbound nature deities: mountain gods, river gods, forest guardians.
 */

import type { Deity } from '../../types/Deity';

const shintoDeities: Deity[] = [

  // ===== KONOHANASAKUYA-HIME - Nature Domain =====
  {
    id: 'konohanasakuya_hime',
    name: 'Konohanasakuya-hime',
    pantheon: 'shinto',
    domain: 'nature',
    personality: 'gentle',
    title: 'Princess Who Makes the Blossoms Bloom',
    description:
      'The goddess of Mount Fuji and cherry blossoms. Her presence brings spring and renewal; her blessing causes wounds to heal as flowers bloom from ash.',
    loreSnippet: '"Blossoms fall. That does not make the tree lesser. It makes it honest."',
    statBonus: { stat: 'END', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Cherry blossoms restore your spirit after each battle',
      effectType: 'hp_regen',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'blossom_surge',
      name: 'Blossom Surge',
      description: 'Summon a storm of sakura petals: heal 25% max HP and restore 20 SP. All allies receive +10% to all stats for 2 turns.',
      unlockFavor: 55,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'heal_and_stat_boost', value: 25, duration: 2 },
    },
    challenges: [
      {
        id: 'konohana_ch1',
        name: 'Spring Endurance',
        description: 'Complete 5 consecutive floors without your HP dropping below 30%.',
        domain: 'nature',
        tier: 'challenging',
        requirement: { type: 'consecutive_floors_high_hp', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'konohana_ch2',
        name: 'Bloom From Ash',
        description: 'Survive 3 near-death encounters (HP below 10%) in a single run.',
        domain: 'nature',
        tier: 'heroic',
        requirement: { type: 'near_death_survived', value: 3 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Every blossom that falls makes room for the next. You will endure.',
        'Konohanasakuya-hime sees your beauty in battle. It does not fade.',
        'Spring always returns. Hold on a little longer.',
      ],
      warning: [
        'Even Mount Fuji shows her fire when pushed too far.',
        'Blossoms are fragile. Be mindful of your HP.',
        'The princess watches. She is patient, but wounds accumulate.',
      ],
      achievement: [
        'CHERRY BLOSSOMS RAIN DOWN IN YOUR HONOR. The Princess rejoices.',
        'From ash, a bloom. The goddess of spring is deeply moved.',
        'You have endured as the mountain endures. Magnificent.',
      ],
      combat: [
        'Recover. Let them tire. Then finish.',
        'A blossom does not fight the wind. It dances with it.',
        'Your resilience is your sharpest weapon.',
      ],
    },
  },

  // ===== UKE MOCHI - Craft Domain =====
  {
    id: 'uke_mochi',
    name: 'Uke Mochi',
    pantheon: 'shinto',
    domain: 'craft',
    personality: 'benevolent',
    title: 'Goddess of Food and Sustenance',
    description:
      'The kami of food who generates sustenance from her body to feed the gods and mortals alike. She ensures those she blesses never fight on an empty spirit.',
    loreSnippet: '"What I give, I give fully. Do not insult the gift by wasting it."',
    statBonus: { stat: 'END', value: 10, type: 'bonus' },
    statPenalty: { stat: 'AGI', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Sacred sustenance doubles the effect of all healing items',
      effectType: 'crafting_success',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'divine_feast',
      name: 'Divine Feast',
      description: 'Instantly restore 35% HP and 30 SP. For the next combat, all healing items are 50% more effective.',
      unlockFavor: 55,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'heal_and_item_buff', value: 35, duration: 1 },
    },
    challenges: [
      {
        id: 'uke_mochi_ch1',
        name: 'Never Wasteful',
        description: 'Complete a floor using fewer than 3 healing items.',
        domain: 'craft',
        tier: 'challenging',
        requirement: { type: 'floor_low_item_use', value: 3 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'uke_mochi_ch2',
        name: 'Full Provider',
        description: 'Enter a combat encounter with full HP and SP for 8 consecutive fights.',
        domain: 'craft',
        tier: 'heroic',
        requirement: { type: 'full_resource_fights', value: 8 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Uke Mochi feeds you more than food. She feeds your spirit. Feel it.',
        'You have used her gifts well. She is pleased.',
        'Resources well managed honor the goddess of sustenance.',
      ],
      warning: [
        'Waste invites hunger. Manage what you carry.',
        'The goddess of food does not appreciate profligacy.',
        'You are running low. Uke Mochi suggests caution.',
      ],
      achievement: [
        'UKE MOCHI SETS OUT A DIVINE FEAST. You have honored her gifts.',
        'Sustained through the fight. The food-goddess approves deeply.',
        'Nothing wasted, everything earned. Uke Mochi is moved.',
      ],
      combat: [
        'A fed warrior fights better. Use your resources.',
        'Efficiency is its own sustenance.',
        'Leave nothing on the table — including your enemy.',
      ],
    },
  },

  // ===== SARUTA-HIKO - Authority Domain =====
  {
    id: 'saruta_hiko',
    name: 'Saruta-hiko',
    pantheon: 'shinto',
    domain: 'authority',
    personality: 'stern',
    title: 'Great Earthly Kami of the Crossroads',
    description:
      'The imposing kami who stands at the intersection of heaven and earth. He guides those who are lost and commands all crossroads with absolute authority.',
    loreSnippet: '"I have stood here longer than your path has existed. I will tell you which way to go."',
    statBonus: { stat: 'CHA', value: 10, type: 'bonus' },
    statPenalty: { stat: 'LCK', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'The kami of crossroads improves every decision made under pressure',
      effectType: 'intimidation',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'crossroads_command',
      name: 'Crossroads Command',
      description: 'Issue a divine command: stun all enemies for 1 turn and reduce their attack by 20% for 3 turns.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'aoe_stun_and_debuff', value: 20, duration: 3 },
    },
    challenges: [
      {
        id: 'saruta_ch1',
        name: 'Decisive Crossroads',
        description: 'Defeat 5 enemies using Taunt or intimidation-based actions.',
        domain: 'authority',
        tier: 'challenging',
        requirement: { type: 'taunt_kills', value: 5 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'saruta_ch2',
        name: 'The Right Path',
        description: 'Complete 10 floors without ever retreating from an encounter.',
        domain: 'authority',
        tier: 'legendary',
        requirement: { type: 'floors_no_retreat', value: 10 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Saruta-hiko points you down the winning path. Trust it.',
        'Authority is clarity. You have both right now.',
        'The crossroads kami has guided greater heroes than you. He will guide you.',
      ],
      warning: [
        'Wrong direction. Saruta-hiko sees where this leads.',
        'At the crossroads, indecision is the most dangerous path.',
        'The imposing kami is watching. Do not choose weakly.',
      ],
      achievement: [
        'SARUTA-HIKO PLANTS HIS STAFF IN TRIUMPH. The crossroads kami approves.',
        'Every choice was right. The guide of crossroads is impressed.',
        'You walked the right path without hesitation. Well done.',
      ],
      combat: [
        'Dominate the space. Make them react to you.',
        'The crossroads warrior controls the battlefield.',
        'Command the fight. Saruta-hiko demands it.',
      ],
    },
  },

  // ===== KUKURIHIME - Magic Domain =====
  {
    id: 'kukurihime',
    name: 'Kukurihime',
    pantheon: 'shinto',
    domain: 'magic',
    personality: 'mysterious',
    title: 'The Binding Goddess',
    description:
      'The enigmatic kami of binding and connections. She weaves the invisible threads between all things and can unravel or reinforce any bond.',
    loreSnippet: '"Every connection is a vulnerability and a strength. I merely decide which."',
    statBonus: { stat: 'INT', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Binding magic lingers on all of your spells',
      effectType: 'spell_damage',
      effectValue: 10,
    },
    uniqueAbility: {
      id: 'divine_binding',
      name: 'Divine Binding',
      description: 'Bind the enemy: prevent them from using skills for 3 turns and deal 90% magic damage.',
      unlockFavor: 60,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'bind_and_damage', value: 90, duration: 3 },
    },
    challenges: [
      {
        id: 'kukuri_ch1',
        name: 'Woven Victory',
        description: 'Win 5 combats where the enemy never successfully used a skill.',
        domain: 'magic',
        tier: 'heroic',
        requirement: { type: 'enemy_skill_denied_wins', value: 5 },
        favorGain: 20,
        favorLoss: 10,
      },
      {
        id: 'kukuri_ch2',
        name: 'Thread of Power',
        description: 'Deal magic damage equal to 5× the enemy\'s max HP across a single floor.',
        domain: 'magic',
        tier: 'legendary',
        requirement: { type: 'overkill_magic_floor', value: 5 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The threads you cannot see are the ones holding you together.',
        'Kukurihime\'s bindings protect as much as they restrict.',
        'Every connection you have made strengthens you. Feel them.',
      ],
      warning: [
        'Some bindings are traps. Know the difference.',
        'The goddess of binding watches every tangled thread. Untangle yours.',
        'You are bound to this outcome. Make it the right one.',
      ],
      achievement: [
        'INVISIBLE THREADS TIGHTEN IN CELEBRATION. Kukurihime is pleased.',
        'The binding holds. The goddess of connections approves.',
        'You have woven an unbreakable victory. Magnificent.',
      ],
      combat: [
        'Restrict their options before you press your advantage.',
        'Binding magic creates the space for the killing blow.',
        'Control the thread. Control the fight.',
      ],
    },
  },

  // ===== KAWA NO KAMI - Sea Domain =====
  {
    id: 'kawa_no_kami',
    name: 'Kawa no Kami',
    pantheon: 'shinto',
    domain: 'sea',
    personality: 'ancient',
    title: 'God of Rivers',
    description:
      'The collective spirit of all rivers in Japan. Ancient, patient, and relentless — rivers find their path around every obstacle or wear it away completely.',
    loreSnippet: '"I do not fight mountains. I go around. Then I go through. Then the mountain is gone."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'River\'s persistence slowly erodes enemy defenses',
      effectType: 'water_magic',
      effectValue: 10,
    },
    uniqueAbility: {
      id: 'relentless_current',
      name: 'Relentless Current',
      description: 'Over 4 turns, deal 30% magic damage each turn that ignores defense. Cannot be interrupted.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'persistent_true_damage', value: 30, duration: 4 },
    },
    challenges: [
      {
        id: 'kawa_ch1',
        name: 'The Patient River',
        description: 'Win a combat that lasts 8 or more rounds.',
        domain: 'sea',
        tier: 'challenging',
        requirement: { type: 'long_combat_win', value: 8 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'kawa_ch2',
        name: 'Erosion',
        description: 'Reduce an enemy\'s defense to zero through stacking debuffs in a single combat.',
        domain: 'sea',
        tier: 'heroic',
        requirement: { type: 'defense_zero_debuff', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The river never gives up. Neither should you.',
        'You are wearing them down. Kawa no Kami is patient. Be patient.',
        'Every turn is progress. Every strike is erosion.',
      ],
      warning: [
        'Even rivers flood when pushed too hard. Manage your resources.',
        'The current needs a direction. Where are you flowing?',
        'Ancient rivers do not rush. Be deliberate.',
      ],
      achievement: [
        'THE RIVER CRESTS IN TRIUMPH. Kawa no Kami is deeply pleased.',
        'Patient persistence won the day. The river-god approves.',
        'You wore them down and then swept them away. Perfect.',
      ],
      combat: [
        'Each hit is a drop of water. Enough drops become a flood.',
        'Patience is the weapon that never runs out.',
        'Flow around their defenses. Find the crack.',
      ],
    },
  },

  // ===== YAMA NO KAMI - War Domain =====
  {
    id: 'yama_no_kami',
    name: 'Yama no Kami',
    pantheon: 'shinto',
    domain: 'war',
    personality: 'stern',
    title: 'God of the Mountains',
    description:
      'The fierce spirit of mountain heights. Yama no Kami tests all who dare climb, rewarding only those with iron resolve and punishing the weak with avalanche force.',
    loreSnippet: '"The summit does not come to you. You climb to it. Or you do not."',
    statBonus: { stat: 'STR', value: 12, type: 'bonus' },
    statPenalty: { stat: 'CHA', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Mountain strength multiplies every physical strike',
      effectType: 'physical_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'avalanche_strike',
      name: 'Avalanche Strike',
      description: 'Unleash mountain force: deal 180% physical damage and reduce enemy defense by 30% for 2 turns.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'heavy_strike_and_defense_break', value: 180, duration: 2 },
    },
    challenges: [
      {
        id: 'yama_ch1',
        name: 'The Climb',
        description: 'Reach floor 7 or deeper on a single run.',
        domain: 'war',
        tier: 'challenging',
        requirement: { type: 'reach_floor', value: 7 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'yama_ch2',
        name: 'Summit Force',
        description: 'Deal over 500 physical damage in a single combat.',
        domain: 'war',
        tier: 'heroic',
        requirement: { type: 'physical_damage_per_combat', value: 500 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'You are still climbing. Yama no Kami respects your endurance.',
        'The mountain approves of those who do not stop.',
        'Few make it this high. You are among the few.',
      ],
      warning: [
        'Mountains do not forgive carelessness. The next step matters.',
        'Pride before the summit is where climbers fall.',
        'Yama no Kami is watching the next choice you make very carefully.',
      ],
      achievement: [
        'THE MOUNTAIN SHAKES WITH APPROVAL. Yama no Kami acknowledges your summit.',
        'You have climbed where others turned back. The mountain-god is satisfied.',
        'Iron resolve rewarded. Yama no Kami opens the next path.',
      ],
      combat: [
        'Hit like a mountain falling.',
        'No defenses survive an avalanche. Make yourself one.',
        'The mountain never hesitates. Neither should you.',
      ],
    },
  },

  // ===== TAKA-MI-MUSUBI - Sky Domain =====
  {
    id: 'taka_mi_musubi',
    name: 'Taka-mi-musubi',
    pantheon: 'shinto',
    domain: 'sky',
    personality: 'ancient',
    title: 'High Creator Kami',
    description:
      'One of the three creator kami who emerged at the beginning of creation. Ancient beyond reckoning, Taka-mi-musubi embodies the high creative force of the sky.',
    loreSnippet: '"I was here before the islands. I will decide what comes after."',
    statBonus: { stat: 'INT', value: 10, type: 'bonus' },
    statPenalty: { stat: 'END', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'The creator\'s lightning flows through all your elemental strikes',
      effectType: 'lightning_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'primal_lightning',
      name: 'Primal Lightning',
      description: 'Unleash the lightning of creation: deal 140% magic damage and stun the enemy for 1 turn.',
      unlockFavor: 70,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'lightning_and_stun', value: 140, duration: 1 },
    },
    challenges: [
      {
        id: 'taka_ch1',
        name: 'Ancient Power',
        description: 'Deal 800 total magic damage in a single run.',
        domain: 'sky',
        tier: 'heroic',
        requirement: { type: 'total_magic_damage', value: 800 },
        favorGain: 20,
        favorLoss: 10,
      },
      {
        id: 'taka_ch2',
        name: 'Creation\'s Edge',
        description: 'Defeat a boss-tier enemy using only magic damage.',
        domain: 'sky',
        tier: 'legendary',
        requirement: { type: 'boss_magic_only_kill', value: 1 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The creator\'s power is ancient and vast. You carry a spark of it.',
        'Taka-mi-musubi does not express approval easily. This is approval.',
        'Creation itself is behind your strikes. Believe that.',
      ],
      warning: [
        'The creator watches with very old eyes. Do not disappoint them.',
        'Primal power requires primal focus. Scatter it and you lose it.',
        'Ancient kami are patient but not forgiving. Be precise.',
      ],
      achievement: [
        'THE SKY CRACKS WITH APPROVAL. Taka-mi-musubi acknowledges your power.',
        'Creation recognizes its servant. The ancient kami is pleased.',
        'Lightning and victory together. The high creator is satisfied.',
      ],
      combat: [
        'Strike from above. Creation flows downward.',
        'The lightning knows no defense. Let it find their weakness.',
        'Ancient power needs only one good opening.',
      ],
    },
  },

  // ===== KAMI-MUSUBI - Life Domain =====
  {
    id: 'kami_musubi',
    name: 'Kami-musubi',
    pantheon: 'shinto',
    domain: 'life',
    personality: 'gentle',
    title: 'Divine Creator of Life',
    description:
      'The third of the creator kami, Kami-musubi embodies the generative power of life itself. Her blessing accelerates healing and growth.',
    loreSnippet: '"Life makes itself. I simply remind it to do so."',
    statBonus: { stat: 'WIS', value: 10, type: 'bonus' },
    statPenalty: { stat: 'AGI', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Life-force accelerates natural regeneration',
      effectType: 'hp_regen',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'vital_surge',
      name: 'Vital Surge',
      description: 'Awaken the life force: restore 50% max HP and cleanse all negative status effects.',
      unlockFavor: 60,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'full_heal_and_cleanse', value: 50 },
    },
    challenges: [
      {
        id: 'kami_musubi_ch1',
        name: 'Life Unbroken',
        description: 'Survive 5 floors without ever dropping below 40% HP.',
        domain: 'life',
        tier: 'heroic',
        requirement: { type: 'floors_above_hp_threshold', value: 5 },
        favorGain: 20,
        favorLoss: 10,
      },
      {
        id: 'kami_musubi_ch2',
        name: 'Enduring Creation',
        description: 'Heal yourself for 500 total HP in a single run.',
        domain: 'life',
        tier: 'challenging',
        requirement: { type: 'total_healing', value: 500 },
        favorGain: 15,
        favorLoss: 8,
      },
    ],
    hintTemplates: {
      encouragement: [
        'Life persists. Kami-musubi makes sure of it.',
        'The creator of life watches over you. You are not alone.',
        'Every breath is a gift from the life-kami. Use this one well.',
      ],
      warning: [
        'Life is precious. The creator does not want it wasted carelessly.',
        'Your wounds speak. Kami-musubi urges you to listen to them.',
        'Even the life-kami cannot create what is completely destroyed.',
      ],
      achievement: [
        'LIFE BLOOMS IN YOUR WAKE. Kami-musubi rejoices in your survival.',
        'Creation approves of what you have kept alive today.',
        'Unbroken and victorious. The life-kami is deeply satisfied.',
      ],
      combat: [
        'Stay alive. That is the foundation of all victory.',
        'Life-force is not a resource. It is the whole point.',
        'The creator of life asks only that you preserve it long enough to win.',
      ],
    },
  },

  // ===== MISHAGUJI - Death Domain =====
  {
    id: 'mishaguji',
    name: 'Mishaguji',
    pantheon: 'shinto',
    domain: 'death',
    personality: 'dark',
    title: 'Ancient Earth Serpent',
    description:
      'An ancient serpent deity predating the current Shinto order. Mishaguji dwells in boundary stones and demand blood offerings, blessing warriors who respect the boundary between living and dead.',
    loreSnippet: '"I am older than the gods who tried to name me. I remember when there was no name for anything."',
    statBonus: { stat: 'PER', value: 10, type: 'bonus' },
    statPenalty: { stat: 'CHA', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Ancient serpent wisdom reveals hidden weaknesses in the undead',
      effectType: 'damage_vs_undead',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'boundary_violation',
      name: 'Boundary Violation',
      description: 'Tear the boundary between living and dead: deal 120% true damage. If the enemy is below 30% HP, deal 200% instead.',
      unlockFavor: 70,
      cooldownType: 'per_combat',
      cooldownValue: 1,
      effect: { type: 'execute_strike', value: 120, condition: 'below_30_percent' },
    },
    challenges: [
      {
        id: 'mishaguji_ch1',
        name: 'Blood Offering',
        description: 'Kill 10 enemies at exactly the moment you are also below 20% HP.',
        domain: 'death',
        tier: 'heroic',
        requirement: { type: 'kill_at_low_hp', value: 10 },
        favorGain: 20,
        favorLoss: 10,
      },
      {
        id: 'mishaguji_ch2',
        name: 'The Ancient Pact',
        description: 'Defeat an undead boss without using any healing.',
        domain: 'death',
        tier: 'legendary',
        requirement: { type: 'undead_boss_no_heal', value: 1 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The serpent sees your offering. It is enough. For now.',
        'Mishaguji is old enough to know worth when it passes by.',
        'Boundary-walker. You feel it too. Good.',
      ],
      warning: [
        'The boundary between you and death is very thin here. Step carefully.',
        'Ancient serpents have no mercy for the careless. Only for the capable.',
        'Mishaguji smells fear. It is not your friend tonight.',
      ],
      achievement: [
        'THE ANCIENT SERPENT COILS IN SATISFACTION. Mishaguji is appeased.',
        'The boundary held for you. The ancient one is impressed.',
        'Blood and victory together. Mishaguji nods from the boundary stone.',
      ],
      combat: [
        'The finishing blow is the only one that matters.',
        'Watch for the moment when the boundary thins. Strike then.',
        'Ancient power serves those who respect it. Use it without fear.',
      ],
    },
  },

  // ===== OOMIWA - Wisdom Domain =====
  {
    id: 'oomiwa',
    name: 'Ōmiwa',
    pantheon: 'shinto',
    domain: 'wisdom',
    personality: 'mysterious',
    title: 'Great Spirit of Mount Miwa',
    description:
      'The divine serpent spirit of Mount Miwa, one of the oldest deities in Japan. Ōmiwa embodies ancient wisdom and the mystery of divine form.',
    loreSnippet: '"I do not show my body. I show you what is behind what you think you see."',
    statBonus: { stat: 'WIS', value: 12, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Ancient serpent sight reveals what others cannot perceive',
      effectType: 'skill_learning',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'divine_serpent_sight',
      name: 'Divine Serpent Sight',
      description: 'Pierce all illusions: reveal hidden enemy mechanics, ignore enemy dodge for 3 turns, and gain +20% to all magic damage.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'ignore_dodge_and_magic_boost', value: 20, duration: 3 },
    },
    challenges: [
      {
        id: 'oomiwa_ch1',
        name: 'Serpent Wisdom',
        description: 'Successfully Observe 8 different enemy types.',
        domain: 'wisdom',
        tier: 'challenging',
        requirement: { type: 'observe_unique_enemies', value: 8 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'oomiwa_ch2',
        name: 'The Hidden Truth',
        description: 'Win a combat where the enemy\'s stats were fully revealed before landing the killing blow.',
        domain: 'wisdom',
        tier: 'heroic',
        requirement: { type: 'kill_after_full_observe', value: 1 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'You have seen more than your enemy realizes. Use that advantage.',
        'Ōmiwa shows you what is behind the obvious. Look again.',
        'Ancient wisdom does not shout. It whispers the answer into quiet minds.',
      ],
      warning: [
        'The serpent sees what you are avoiding. Face it.',
        'Hidden things have power. But so does the truth you are not looking at.',
        'Wisdom unused is just information. Act on what you know.',
      ],
      achievement: [
        'THE DIVINE SERPENT RISES. Ōmiwa honors your perception.',
        'You saw what was hidden and acted on it. Ancient wisdom approves.',
        'Mount Miwa shakes gently in acknowledgment. Ōmiwa is pleased.',
      ],
      combat: [
        'Study them first. Knowledge is the first attack.',
        'The serpent strikes only when it knows exactly where to strike.',
        'What you see determines what you can do. See everything.',
      ],
    },
  },

  // ===== INARI OKAMI - Fortune Domain =====
  {
    id: 'inari_okami',
    name: 'Inari Ōkami',
    pantheon: 'shinto',
    domain: 'fortune',
    personality: 'playful',
    title: 'Kami of Foxes, Rice, and Prosperity',
    description:
      'The beloved kami of fertility, foxes, rice, and worldly success. Inari takes many forms — man, woman, old crone, young child — but always brings prosperity where favored.',
    loreSnippet: '"Everything I touch becomes lucky. Even luck becomes luckier."',
    statBonus: { stat: 'LCK', value: 15, type: 'bonus' },
    statPenalty: { stat: 'END', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Fox-spirit\'s blessing makes fortune flow toward you',
      effectType: 'loot_quality',
      effectValue: 15,
    },
    uniqueAbility: {
      id: 'fox_blessing',
      name: 'Fox Blessing',
      description: 'Call a fox spirit: next loot drop is guaranteed legendary quality, and your critical hit chance doubles for 3 turns.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'legendary_loot_and_crit_boost', value: 2, duration: 3 },
    },
    challenges: [
      {
        id: 'inari_ch1',
        name: 'Fox\'s Luck',
        description: 'Land 10 critical hits in a single floor.',
        domain: 'fortune',
        tier: 'challenging',
        requirement: { type: 'crits_per_floor', value: 10 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'inari_ch2',
        name: 'The Prosperous Run',
        description: 'Collect 3 legendary-quality items in a single dungeon run.',
        domain: 'fortune',
        tier: 'legendary',
        requirement: { type: 'legendary_items_collected', value: 3 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The fox sees what the straight path misses. So do you.',
        'Inari\'s foxes are running ahead of you. Follow them.',
        'Fortune likes you today. Don\'t waste it.',
      ],
      warning: [
        'Even fox spirits get caught in bad traps. Watch your step.',
        'Luck runs thin when overextended. Consolidate now.',
        'Inari is mercurial. Do not take today\'s fortune for granted.',
      ],
      achievement: [
        'A HUNDRED FOX SPIRITS CELEBRATE. Inari Ōkami is delighted.',
        'Fortune maxed out today. The kami of prosperity is very pleased.',
        'The fox spirit chose well when it chose you. Well done.',
      ],
      combat: [
        'Luck lands where skill points.',
        'Critical hits honor the fox spirit.',
        'Fortune rewards the bold. Be bold.',
      ],
    },
  },

  // ===== FUJIN - Sky Domain =====
  {
    id: 'fujin',
    name: 'Fūjin',
    pantheon: 'shinto',
    domain: 'sky',
    personality: 'chaotic',
    title: 'God of Wind',
    description:
      'The wild wind-god who carries a bag of winds and releases them at will. He delights in chaos and rewards those who embrace the unpredictable.',
    loreSnippet: '"I could tell you which way the wind blows. But where\'s the fun in that?"',
    statBonus: { stat: 'AGI', value: 12, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Wind-god\'s breath accelerates every dodge and movement',
      effectType: 'lightning_damage',
      effectValue: 10,
    },
    uniqueAbility: {
      id: 'storm_bag',
      name: 'Storm Bag',
      description: 'Release chaotic winds: all enemies are confused for 2 turns (30% chance to hit themselves) and you gain +30% speed.',
      unlockFavor: 60,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'aoe_confuse_and_speed', value: 30, duration: 2 },
    },
    challenges: [
      {
        id: 'fujin_ch1',
        name: 'Wind\'s Chaos',
        description: 'Win 3 combats where you attack first every single round.',
        domain: 'sky',
        tier: 'challenging',
        requirement: { type: 'first_every_round_wins', value: 3 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'fujin_ch2',
        name: 'Tornado Run',
        description: 'Clear 8 encounters in a single floor.',
        domain: 'sky',
        tier: 'legendary',
        requirement: { type: 'encounters_per_floor', value: 8 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The wind changes direction constantly. That\'s what makes it unstoppable.',
        'Fūjin laughs with you. Keep moving.',
        'Chaos is only chaos to those who can\'t ride it. You can.',
      ],
      warning: [
        'Even tornados burn out eventually. Save something for later.',
        'Moving too fast to think is still moving too fast.',
        'The wind-god is amused. That is not always comforting.',
      ],
      achievement: [
        'FŪJIN OPENS HIS BAG FULLY. Chaos reigns in your honor.',
        'Unpredictable, unstoppable. The wind-god couldn\'t be happier.',
        'You turned chaos into victory. Fūjin roars with delight.',
      ],
      combat: [
        'Be where they don\'t expect you.',
        'The wind never telegraphs. Neither should you.',
        'Speed is the kami\'s gift. Use it.',
      ],
    },
  },

  // ===== RAIJIN - War Domain =====
  {
    id: 'raijin',
    name: 'Raijin',
    pantheon: 'shinto',
    domain: 'war',
    personality: 'aggressive',
    title: 'God of Thunder and Lightning',
    description:
      'The thunder deity who beats the drums that make the storm. Raijin strikes with the ferocity of lightning and the persistence of rolling thunder, rewarding those who hit first and hit hardest.',
    loreSnippet: '"My drums do not stop for the dead. Neither should you."',
    statBonus: { stat: 'STR', value: 10, type: 'bonus' },
    statPenalty: { stat: 'WIS', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Thunder drums your attacks into concussive force',
      effectType: 'physical_damage',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'thunder_drums',
      name: 'Thunder Drums',
      description: 'Beat the war drums: deal 160% physical damage and terrify the enemy (-25% attack) for 2 turns.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'heavy_hit_and_terrify', value: 160, duration: 2 },
    },
    challenges: [
      {
        id: 'raijin_ch1',
        name: 'Rolling Thunder',
        description: 'Deal 300 physical damage in a single combat encounter.',
        domain: 'war',
        tier: 'challenging',
        requirement: { type: 'physical_damage_per_combat', value: 300 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'raijin_ch2',
        name: 'The First Strike',
        description: 'Win initiative and land the killing blow in 10 consecutive combats.',
        domain: 'war',
        tier: 'legendary',
        requirement: { type: 'first_strike_kills', value: 10 },
        favorGain: 30,
        bonusStatPoints: 3,
        favorLoss: 15,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The drums beat for you. Listen and strike with them.',
        'Raijin rewards the first blow. You already know this.',
        'Thunder and lightning — you are the lightning. Be fast.',
      ],
      warning: [
        'Even thunder needs something to hit. Are you sure of your target?',
        'Raijin doesn\'t pause between strikes. Why are you pausing?',
        'The storm does not wait for the enemy to be ready.',
      ],
      achievement: [
        'THE THUNDER DRUMS ROAR YOUR VICTORY. Raijin beats them in triumph.',
        'Lightning struck true. The storm-god approves completely.',
        'You fought like a thunderstorm. Raijin is very satisfied.',
      ],
      combat: [
        'First strike. Hard. Then again.',
        'Thunder doesn\'t argue. It hits.',
        'The war drums are playing. Keep pace with them.',
      ],
    },
  },

  // ===== UGAJIN - Trickery Domain =====
  {
    id: 'ugajin',
    name: 'Ugajin',
    pantheon: 'shinto',
    domain: 'trickery',
    personality: 'mysterious',
    title: 'Coiled Serpent of Good Fortune',
    description:
      'A serpent-human kami depicted as a coiled white snake with a human head. Ugajin is closely bound to Inari and Benzaiten, operating at the mysterious intersection between fortune and deception.',
    loreSnippet: '"Fortune and illusion share the same face. I simply choose which one I show."',
    statBonus: { stat: 'LCK', value: 10, type: 'bonus' },
    statPenalty: { stat: 'STR', value: 5, type: 'penalty' },
    domainBlessing: {
      description: 'Serpent coils grant uncanny ability to slip through enemy attacks',
      effectType: 'dodge_chance',
      effectValue: 12,
    },
    uniqueAbility: {
      id: 'coil_of_fortune',
      name: 'Coil of Fortune',
      description: 'The serpent coils around fate: for 2 turns dodge all attacks, and on the next strike deal +60% damage with a guaranteed critical hit.',
      unlockFavor: 65,
      cooldownType: 'per_floor',
      cooldownValue: 1,
      effect: { type: 'dodge_then_crit_strike', value: 60, duration: 2 },
    },
    challenges: [
      {
        id: 'ugajin_ch1',
        name: 'Serpent\'s Evasion',
        description: 'Dodge 15 attacks across an entire run.',
        domain: 'trickery',
        tier: 'challenging',
        requirement: { type: 'total_dodges', value: 15 },
        favorGain: 15,
        favorLoss: 8,
      },
      {
        id: 'ugajin_ch2',
        name: 'Coiled Strike',
        description: 'Land 5 critical hits in a row without taking damage between them.',
        domain: 'trickery',
        tier: 'heroic',
        requirement: { type: 'consecutive_crits_no_damage', value: 5 },
        favorGain: 25,
        bonusStatPoints: 2,
        favorLoss: 12,
      },
    ],
    hintTemplates: {
      encouragement: [
        'The coil tightens. Ugajin whispers: not yet. Wait.',
        'Fortune and deception aligned. The serpent kami is watching.',
        'You have been patient. The strike is ready. Take it.',
      ],
      warning: [
        'The serpent does not strike recklessly. Neither should you.',
        'Ugajin sees a pattern you are falling into. Break it.',
        'The coil of fortune is not infinite. Do not waste what remains.',
      ],
      achievement: [
        'THE WHITE SERPENT RISES. Ugajin blesses the fortunate warrior.',
        'Fortune and skill entwined. The serpent kami approves.',
        'From the coil, perfect victory. Ugajin is deeply satisfied.',
      ],
      combat: [
        'Wait for the moment. The serpent always waits.',
        'Fortune strikes where luck and skill meet. Aim there.',
        'Slip the attack. Then answer from the unexpected angle.',
      ],
    },
  },

];

export const shintoPantheon = shintoDeities;
