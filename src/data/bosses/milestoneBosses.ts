/**
 * Milestone Bosses — 20 sentient guardians of the Tower's milestone floors.
 * Each boss has: character lore, a unique mechanic hint, and a personalized dialogue template.
 * Bosses appear on floors 5, 10, 15, 20, 25, ... 100.
 *
 * Orla (character + lore) + Thane (mechanics) + Eris (personalization) synthesis.
 */

import type { PlayerSnapshot } from '../../types/PlayerSnapshot';

export interface BossChoice {
  id: string;
  label: string;
  description: string;
  bossReaction: string;
  combatEffect: {
    type: 'none' | 'dodge_boost' | 'first_attack_guaranteed' | 'damage_bonus' | 'enemy_enraged';
    value?: number;
    description?: string;
  };
}

export interface MilestoneBoss {
  id: string;
  floor: number;
  name: string;
  epithet: string;
  pantheon: string;
  appearanceEmoji: string;
  appearance: string;
  lore: string;
  theme: string;
  mechanic: {
    name: string;
    hint: string;        // Shown in the encounter screen
    observeReveal: string; // Shown if player used Observe on this boss type before
  };
  dialogue: {
    opening: string;
    personalizedTaunt: (s: PlayerSnapshot) => string;
    choices: BossChoice[];
    combatOpener: (s: PlayerSnapshot, choiceId: string) => string;
  };
}

// ──────────────────────────────────────────────────────────
// FLOOR 5 — VANYA, THE FIRST WARDEN (Slavic)
// ──────────────────────────────────────────────────────────
const VANYA: MilestoneBoss = {
  id: 'vanya_floor5',
  floor: 5,
  name: 'Vanya',
  epithet: 'She Who Keeps the Threshold',
  pantheon: 'Slavic',
  appearanceEmoji: '🌲',
  appearance: 'A towering woman of oak and birch, her form shifting between bark and flesh. Antlers of pale bone crown her head. Her voice sounds like wind through winter forests.',
  lore: 'Vanya guards the Tower\'s first true test. She has stood at this threshold since before the convergence, watching a thousand climbers pass. She remembers nearly all of them.',
  theme: 'Memory & Recognition',
  mechanic: {
    name: 'Corrosive Shell',
    hint: 'Her defense grows harder each time she is struck. Brute force alone cannot prevail.',
    observeReveal: 'Physical attacks increase her defense permanently. Status effects and magic bypass her shell entirely.',
  },
  dialogue: {
    opening: 'I have waited here longer than your bloodline has existed. You smell of ambition. Tell me — is it enough?',
    personalizedTaunt: (s: PlayerSnapshot) => {
      if (s.isFirstRun) {
        return `Your first descent, ${s.characterName}. I know that smell — equal parts wonder and ignorance. The Tower has claimed better beginners.`;
      }
      if (s.isComebackRun) {
        return `You returned so quickly. The wound is still fresh on your pride, I can see it. What changed between then and now?`;
      }
      if (s.totalDeaths >= 8) {
        return `${s.totalDeaths} times. I have watched you fall ${s.totalDeaths} times and still you come back. Either you are courageous or you have not yet learned what death means.`;
      }
      if (s.isFleeer) {
        return `You fled ${s.fleeCount} times to reach me. There is wisdom in survival, yes. But also a question: what exactly are you surviving *for*?`;
      }
      if (s.isAggressor) {
        return `Your ${s.weaponName}. You've swung it at everything that moved. That rage will serve you poorly against something that does not bleed the same way.`;
      }
      return `${s.patronDeityName} watches from above. Do they see what I see? A climber who has not yet decided what they are.`;
    },
    choices: [
      {
        id: 'challenge',
        label: 'Step forward boldly',
        description: 'Meet her gaze without flinching.',
        bossReaction: 'Vanya\'s bark-skin cracks into something that might be a smile. "Conviction. Rare. Do not let it be the last interesting thing about you."',
        combatEffect: { type: 'first_attack_guaranteed', description: 'Your resolve grants you first strike.' },
      },
      {
        id: 'ask',
        label: 'Ask what she remembers',
        description: 'Seek knowledge before the fight.',
        bossReaction: '"They always want to know their predecessors\' mistakes. Wisdom shows in the asking. I will remember this."',
        combatEffect: { type: 'dodge_boost', value: 20, description: '+20% dodge first turn — she respects your caution.' },
      },
      {
        id: 'silent',
        label: 'Say nothing. Attack.',
        description: 'No words. Only intent.',
        bossReaction: 'Vanya closes her eyes slowly. "Silence can be strength. Or arrogance. We shall find out which."',
        combatEffect: { type: 'damage_bonus', value: 15, description: '+15% first-strike damage — your silence unnerved her.' },
      },
    ],
    combatOpener: (s: PlayerSnapshot, choiceId: string) => {
      if (choiceId === 'ask') return `"The threshold opens. What you find beyond it depends on what you bring with you."`;
      if (choiceId === 'silent') return `"Very well, ${s.characterName}. Let your actions speak."`;
      return `"Then let the threshold judge you."`;
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 10 — SORATH, THE LIAR-KING (Ars Goetia)
// ──────────────────────────────────────────────────────────
const SORATH: MilestoneBoss = {
  id: 'sorath_floor10',
  floor: 10,
  name: 'Sorath',
  epithet: 'Duke of a Thousand Tongues',
  pantheon: 'Ars Goetia',
  appearanceEmoji: '🎭',
  appearance: 'A lean figure in nobleman\'s attire that shimmers between solid and mirage. His face never quite resolves — always beautiful, always unsettling. Eyes like amber coins.',
  lore: 'Sorath was bound into the Tower as punishment for his deceptions in the world above. But here, in the convergence space, lies have more power than truth. He has made a kingdom of them.',
  theme: 'Temptation & Corruption',
  mechanic: {
    name: 'Rewind',
    hint: 'He adapts. Repeat the same action three times and he will be waiting for it.',
    observeReveal: 'Sorath reads your last three action types and builds resistance. Vary your approach: mix strikes, defenses, and skills each turn cycle.',
  },
  dialogue: {
    opening: 'Oh. Another one. You all have the same look — determined, slightly afraid, completely unaware that the real danger was never down here.',
    personalizedTaunt: (s: PlayerSnapshot) => {
      if (s.deityFavor === 'blessed') {
        return `${s.patronDeityName}'s beloved. How touching. Tell me — if your god has blessed you so generously, why do you look so uncertain standing here?`;
      }
      if (s.deityFavor === 'abandoned') {
        return `${s.patronDeityName} barely knows your name anymore. You can feel it, can't you? That silence where the divine warmth should be. Come. I\'ll give you something to believe in.`;
      }
      if (s.healingReliant) {
        return `You carry ${s.consumablesUsed} used potions worth of desperation. You patch yourself up and call it strategy. That's not combat, darling — that's anxiety with a sword.`;
      }
      if (s.observer) {
        return `Patient. Careful. You studied everything before you struck. What did all that watching teach you? Because from where I stand, it looks like fear wearing wisdom's clothes.`;
      }
      return `You fight with a ${s.weaponName}. You worship ${s.patronDeityName}. You've killed ${s.monstersKilledThisRun} things to get here. And you still don\'t know what you want from this place. That's the most interesting thing about you.`;
    },
    choices: [
      {
        id: 'refuse',
        label: 'I want nothing from you.',
        description: 'Reject his framing entirely.',
        bossReaction: '"Nothing? How refreshingly honest. Most say that and mean the opposite. Perhaps you are different." He sounds almost impressed.',
        combatEffect: { type: 'none', description: 'He takes you seriously. No advantage — but no disadvantage either.' },
      },
      {
        id: 'negotiate',
        label: 'What are you offering?',
        description: 'Hear the deal before refusing it.',
        bossReaction: '"Curiosity! My favorite weakness. Come then — I\'ll show you exactly what you\'re walking away from." He grins, and for a moment his face is perfectly clear.',
        combatEffect: { type: 'dodge_boost', value: 15, description: 'You learned something — +15% dodge.' },
      },
      {
        id: 'expose',
        label: 'You\'re afraid of the truth.',
        description: 'Turn his tactics back on him.',
        bossReaction: 'A pause. His face flickers. "...Clever. Very clever. I haven\'t heard that in some time." His amber eyes narrow.',
        combatEffect: { type: 'enemy_enraged', description: 'He\'s rattled but furious — he fights harder.' },
      },
    ],
    combatOpener: (s: PlayerSnapshot, choiceId: string) => {
      if (choiceId === 'expose') return `"You'll regret that, ${s.characterName}. I don't forget."`;
      if (choiceId === 'negotiate') return `"Let me show you what your choices have earned. And cost."`;
      return `"Nothing from me. I wonder if that remains true when we're done here."`;
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 15 — KUTCHER, THE BONE-SINGER (Mesopotamian)
// ──────────────────────────────────────────────────────────
const KUTCHER: MilestoneBoss = {
  id: 'kutcher_floor15',
  floor: 15,
  name: 'Kutcher',
  epithet: 'The Death-Choir\'s Conductor',
  pantheon: 'Mesopotamian',
  appearanceEmoji: '🦴',
  appearance: 'A skeletal figure draped in funerary linen, wrapped in clay tablets inscribed with forgotten names. Small bones dangle from threads at his wrists, chiming softly.',
  lore: 'Kutcher came to the Tower seeking the names of the dead. In the convergence, he began to collect them, singing their ghosts into harmonies. He wants to add your name to his chorus.',
  theme: 'Mortality & the Inevitability of Ending',
  mechanic: {
    name: 'Static Siphon',
    hint: 'Each action you take drains your momentum. Too many actions and you lose your edge.',
    observeReveal: 'He siphons your speed with each action you stage. If your bonus action threshold drops below his speed, you lose it. Use skills and items to preserve your action economy.',
  },
  dialogue: {
    opening: 'What a lovely name you carry. I\'ve been collecting names for centuries. Yours... has a particular resonance. When it\'s time, I\'ll sing it properly.',
    personalizedTaunt: (s: PlayerSnapshot) => {
      if (s.totalDeaths > 0) {
        return `I already know the shape of your ending, ${s.characterName}. I have seen it ${s.totalDeaths} time${s.totalDeaths > 1 ? 's' : ''}. Each one sounded slightly different. More surprised. Then less surprised. Now I wonder — have you made your peace with the melody?`;
      }
      if (s.isFirstRun) {
        return `You have never died. How extraordinary — and how temporary. Don't worry. First deaths are always the most memorable. I'll sing yours beautifully.`;
      }
      if (s.reckless) {
        return `You court death like a reckless lover. ${s.fleeCount > 0 ? `Even fleeing ${s.fleeCount} times couldn't slow you down.` : ''} It would be romantic if it weren't so final.`;
      }
      return `The ${s.weaponName} you carry. The ${s.patronDeityName} you pray to. Neither will keep your name from my collection. I wait for all of them. I am patient.`;
    },
    choices: [
      {
        id: 'sing',
        label: 'Sing something back.',
        description: 'Meet him on his own terms.',
        bossReaction: 'Kutcher stops. The bones at his wrists go still. "...You sang. No one has ever..." A long silence. "Your name earns a gentler note than most."',
        combatEffect: { type: 'dodge_boost', value: 25, description: 'His surprise grants you a grace period — +25% dodge first turn.' },
      },
      {
        id: 'defiant',
        label: 'My name isn\'t yours to take.',
        description: 'Refuse his ownership of your fate.',
        bossReaction: '"Oh, but it already is. It is simply waiting." He sounds almost kind. "Defiance is the most common final verse. But sometimes it changes the ending."',
        combatEffect: { type: 'first_attack_guaranteed', description: 'Your defiance earns initiative.' },
      },
      {
        id: 'ask_list',
        label: 'Whose names have you collected?',
        description: 'Ask about those who came before.',
        bossReaction: 'He pauses and tilts his skull. "You want to know your predecessors. How curious. Very well — they mostly arrived confident and departed surprised."',
        combatEffect: { type: 'none', description: 'He respected the question. No advantage; but no ambush either.' },
      },
    ],
    combatOpener: (_s: PlayerSnapshot, choiceId: string) => {
      if (choiceId === 'sing') return `"Let us compose the final verse together."`;
      if (choiceId === 'defiant') return `"Then prove it. The choir is listening."`;
      return `"Their names remembered you, in a way. Let us see if yours will too."`;
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 20 — KALINDI, THE RIVER-MOTHER (Hindu)
// ──────────────────────────────────────────────────────────
const KALINDI: MilestoneBoss = {
  id: 'kalindi_floor20',
  floor: 20,
  name: 'Kalindi',
  epithet: 'Current of All Life',
  pantheon: 'Hindu',
  appearanceEmoji: '🌊',
  appearance: 'A form of constant flowing water held temporarily in womanly shape. She glows faintly with bioluminescent algae. When she moves, water trails and pools at her feet.',
  lore: 'Kalindi is the animating force of all waters. She dwells in the Tower\'s depths, not as a prisoner, but as the current that runs through everything. She wants to purify the climbers by returning them to her waters.',
  theme: 'Purification & Natural Cycles',
  mechanic: {
    name: 'Spreading Contagion',
    hint: 'Whatever you give her, she gives back worse. Status effects return to you amplified.',
    observeReveal: 'Any debuff you apply to Kalindi reflects back at 1.5× strength and bypasses your resistance. Use pure damage only — no poison, no curses, no status effects.',
  },
  dialogue: {
    opening: 'You thirst, yes? I can see it. All living things thirst. Come drink. The river will take you, and you will be... refreshed.',
    personalizedTaunt: (s: PlayerSnapshot) => {
      if (s.deityFavor === 'blessed') {
        return `${s.patronDeityName} has given you so much. Their blessing flows through you like water. Beautiful. Temporary. Water always returns to me eventually.`;
      }
      if (s.healingReliant) {
        return `You have consumed ${s.consumablesUsed} healing draughts. You patch the vessel when you should strengthen it. I am not unkind — I will simply teach you what real restoration feels like.`;
      }
      if (s.monstersKilledThisRun > 20) {
        return `${s.monstersKilledThisRun} lives taken since the descent began. I do not judge — I simply note that much has been poured out. Rivers require filling. What fills you, ${s.characterName}?`;
      }
      return `The ${s.primaryStat} that defines you — it is strength, yes, but all strength flows from somewhere. From something. When was the last time you considered the source?`;
    },
    choices: [
      {
        id: 'drink',
        label: 'Accept the river\'s gift.',
        description: 'Drink deeply before the battle.',
        bossReaction: '"There. Yes. You understand instinctively what others spend lifetimes refusing." She seems genuinely pleased. "Perhaps the river will be gentle."',
        combatEffect: { type: 'dodge_boost', value: 20, description: 'The water grants clarity — +20% dodge.' },
      },
      {
        id: 'stand_ground',
        label: 'I flow on my own terms.',
        description: 'Assert your will against her current.',
        bossReaction: '"Your own terms." She considers this with tidal patience. "The river has heard this before. It does not argue. It simply continues."',
        combatEffect: { type: 'first_attack_guaranteed', description: 'Your assertion earns the first move.' },
      },
      {
        id: 'question',
        label: 'What awaits after purification?',
        description: 'Ask what lies beyond her trial.',
        bossReaction: '"After? After, you return. Cleaner. More precisely yourself." Her voice softens. "Whether that is improvement or removal... the river decides."',
        combatEffect: { type: 'none', description: 'She appreciates the philosophical inquiry. Neutral ground.' },
      },
    ],
    combatOpener: (_s: PlayerSnapshot, choiceId: string) => {
      if (choiceId === 'drink') return `"The river flows. And in it, all things find their nature."`;
      if (choiceId === 'question') return `"Then let the river answer for itself."`;
      return `"Your terms are acknowledged. The current does not negotiate."`;
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 25 — MALIK, THE VOID-KEEPER (Primordial)
// ──────────────────────────────────────────────────────────
const MALIK: MilestoneBoss = {
  id: 'malik_floor25',
  floor: 25,
  name: 'Malik',
  epithet: 'Lord of What Never Was',
  pantheon: 'Primordial',
  appearanceEmoji: '🌑',
  appearance: 'An absence shaped like a man. Wherever you look at him, there\'s nothing — but you can see perfectly around him. Shadows cluster near him like iron filings to a magnet.',
  lore: 'Malik existed before creation and will exist after ending. He slipped into the Tower through cracks in reality, drawn by the chaos of the convergence. He has one curiosity: what happens when you push a climber into true nothingness?',
  theme: 'Unreality & Dissolution',
  mechanic: {
    name: 'Echo Chains',
    hint: 'Your consecutive strikes power his next blow. The longer your combo, the harder he hits back.',
    observeReveal: 'Malik mirrors your comboCount as bonus damage on his next attack. Deliberately take small hits or miss attacks to reset your combo before it becomes lethal.',
  },
  dialogue: {
    opening: 'You are here. You are not here. Both are equally true. I have been examining this paradox for some time. You will help me test it.',
    personalizedTaunt: (s: PlayerSnapshot) => {
      if (s.isFirstRun && !s.isComebackRun) {
        return `You have existed for so brief a time. And you've spent a portion of that existence climbing toward something you can't quite name. I find that... not tragic, exactly. More like interesting mathematics.`;
      }
      if (s.reckless) {
        return `You walk toward annihilation repeatedly and call it bravery. I am the annihilation you've been walking toward. The symmetry pleases me.`;
      }
      if (s.observer) {
        return `You watch before you act. Careful. Thoughtful. You observe the shape of things before engaging them. Have you considered observing the absence of shape? That is where I live.`;
      }
      if (s.dominantVector) {
        return `Your pattern is ${s.dominantVector.toLowerCase().replace('_', ' ')}. I can see the shape of your choices from outside time. They form an interesting trajectory. Toward what, I wonder? Perhaps nothing. Nothing is my domain.`;
      }
      return `The ${s.weaponName}. The ${s.patronDeityName}. The ${s.primaryStat}-trained body. All of it — real to you. Temporary to me. Shall we discover which perspective is correct?`;
    },
    choices: [
      {
        id: 'exist',
        label: 'I exist. That\'s enough.',
        description: 'Assert existence against the void.',
        bossReaction: '"Enough." He seems to taste the word. "Mortals say that. The void has no concept of enough. But I respect the assertion."',
        combatEffect: { type: 'first_attack_guaranteed', description: 'Your assertion anchors you in reality — first strike.' },
      },
      {
        id: 'ask_nothing',
        label: 'What is nothing like?',
        description: 'Ask about the void on its own terms.',
        bossReaction: '"Like..." A long pause. "Like the space between thoughts. Like the moment before you understand something. You have been there. You return there every time you sleep."',
        combatEffect: { type: 'dodge_boost', value: 30, description: 'Understanding nothingness grants strange clarity — +30% dodge.' },
      },
      {
        id: 'void_self',
        label: 'Then let\'s see which of us is really nothing.',
        description: 'Meet unreality with raw defiance.',
        bossReaction: '"A challenge. How delightful. Most cling to existence. You weaponize it." Something in the dark shifts, excited.',
        combatEffect: { type: 'damage_bonus', value: 25, description: '+25% damage — your defiance destabilizes him.' },
      },
    ],
    combatOpener: (_s: PlayerSnapshot, choiceId: string) => {
      if (choiceId === 'ask_nothing') return `"Then let me show you. The lesson begins with dissolution."`;
      if (choiceId === 'void_self') return `"Yes. Let us see. I have not been tested like this in... any time. All time."`;
      return `"Enough. Let us examine your existence under proper conditions."`;
    },
  },
};

// ──────────────────────────────────────────────────────────
// ALL DEFINED BOSSES (MVP: floors 5-25)
// ──────────────────────────────────────────────────────────
export const MILESTONE_BOSSES: MilestoneBoss[] = [
  VANYA,
  SORATH,
  KUTCHER,
  KALINDI,
  MALIK,
  // Floors 30-100 to be added in subsequent sprint
];

export function getMilestoneBoss(floor: number): MilestoneBoss | null {
  if (floor % 5 !== 0) return null;
  return MILESTONE_BOSSES.find(b => b.floor === floor) ?? null;
}

export function isMilestoneFloor(floor: number): boolean {
  return floor % 5 === 0 && MILESTONE_BOSSES.some(b => b.floor === floor);
}
