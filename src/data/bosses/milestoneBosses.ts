/**
 * Milestone Bosses — 20 sentient guardians of the Tower's milestone floors.
 *
 * DESIGN RULES:
 * 1. Each character the player runs is a DIFFERENT MORTAL. The boss has never
 *    met them. They sense ARCHETYPES from collective memory — not individuals.
 * 2. Bosses are killed EXACTLY ONCE across all characters on the account.
 * 3. The 3-exchange conversation can unlock secret outcomes (bypass, loot cache,
 *    weakness reveal) gated by the right dialogue sequence + stat investment.
 *
 * Authors: Orla (character/lore) + Thane (mechanics) + Eris (personalization)
 */

import type { PlayerSnapshot } from '../../types/PlayerSnapshot';
import type { StatName } from '../../types/Stats';

// ===== TYPES =====

export interface ChoiceTag {
  id: string;
  label: string;
  description: string;
  tags: string[];
  statRequirement?: { stat: StatName; minPoints: number };
  probability?: number; // For LCK options — shows as approximate % in UI
}

export type OutcomeType = 'fight' | 'bypass' | 'loot_cache' | 'weakness_revealed' | 'alternative_trial';

export interface BossOutcome {
  id: OutcomeType;
  label: string;
  description: string;
  unlockConditions: {
    requiredTags: string[];
    statCheck?: { stat: StatName; minPoints: number };
    probability?: number;
  };
  achievement?: string;
  combatEffect?: {
    type: 'none' | 'dodge_boost' | 'weakness_exposed' | 'first_attack_guaranteed' | 'enemy_weakened';
    value?: number;
    description?: string;
  };
  lootReward?: { gold: number; description: string };
  bossClosingLine: string;
}

export interface BossConversation {
  exchange1: {
    bossOpening: string;
    getChoices: (s: PlayerSnapshot) => ChoiceTag[];
  };
  exchange2: {
    getBossText: (choice1Id: string, s: PlayerSnapshot) => string;
    getChoices: (choice1Id: string, s: PlayerSnapshot) => ChoiceTag[];
  };
  exchange3: {
    getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => string;
    getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => BossOutcome[];
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
  bossDefeatedEcho: string; // Text shown to future characters who reach this cleared floor
  mechanic: {
    name: string;
    hint: string;
    observeReveal: string;
  };
  conversation: BossConversation;
}

// ===== THE FIGHT OUTCOME (always available) =====
const ALWAYS_FIGHT: BossOutcome = {
  id: 'fight',
  label: 'Draw your weapon.',
  description: 'Some things can only be answered with steel.',
  unlockConditions: { requiredTags: [] },
  combatEffect: { type: 'none' },
  bossClosingLine: 'Then we settle this the only way that matters.',
};

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
  lore: 'Vanya guards the Tower\'s first true test. She has stood at this threshold since before the convergence, watching a thousand climbers pass. She has never fallen. She wants to know if you are different.',
  theme: 'Memory & Recognition',
  bossDefeatedEcho: 'Vanya\'s chamber stands empty. The ancient oak has become stone. She Who Kept the Threshold kept it no longer — an adventurer of the guild passed here, and ended her centuries-long vigil. The way is open.',
  mechanic: {
    name: 'Corrosive Shell',
    hint: 'Her defense grows harder each time she is struck. Brute force alone cannot prevail.',
    observeReveal: 'Physical attacks increase Vanya\'s defense permanently. Magic damage and status effects bypass her shell entirely.',
  },
  conversation: {
    exchange1: {
      bossOpening: 'I have kept this threshold since before your kind learned to name the gods. You carry a weapon and the scent of something that wants to cross. Tell me — do you understand what you are crossing?',
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'honest',
          label: 'I came to cross your threshold.',
          description: 'Direct, honest. You make no claims you cannot back.',
          tags: ['threshold_honest'],
        },
        {
          id: 'aggressive',
          label: 'I came to take what lies beyond.',
          description: 'Raw ambition. No pretense.',
          tags: ['aggressive_honest'],
        },
        {
          id: 'curious',
          label: 'I\'ve heard stories of what you guard.',
          description: s.isFirstEverEncounter
            ? 'Curiosity before combat. She\'s been here since the beginning.'
            : 'The stories are proven true — she is still here.',
          tags: ['curious_approach'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'honest') {
          return 'What do you understand of thresholds? They are not barriers. They are questions. The Tower asks: what have you become? What are you becoming? Most who cross here have not yet formed an answer.';
        }
        if (choice1Id === 'aggressive') {
          return `The ${s.adventurerArchetype} who takes. I have seen your kind many times. Strong, yes. Clear in their want. But the Tower does not reward want. It rewards knowing. Do you know what you are taking, and why?`;
        }
        return `Stories. The guild collects them like stones. This one says I am ancient, relentless, unknowable. That one says I am simply waiting. Both are true. What did YOUR story say about what happens if you cross me?`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'honest') return [
          {
            id: 'wisdom',
            label: 'Some things must be earned before they\'re crossed.',
            description: 'You acknowledge the weight of the threshold.',
            tags: ['WIS_path'],
          },
          {
            id: 'earned',
            label: 'I\'ve earned mine. Ask the things I killed to get here.',
            description: `${s.monstersKilledThisRun} monsters can testify.`,
            tags: ['STR_path'],
          },
        ];
        if (choice1Id === 'aggressive') return [
          {
            id: 'defiant',
            label: 'The why is mine. My reason needs no approval.',
            description: 'Unapologetic. This is who you are.',
            tags: ['aggressive_path'],
          },
          {
            id: 'soften',
            label: '...You\'re right. I chose my words poorly.',
            description: 'Acknowledge the overreach. There is dignity in this.',
            tags: ['CHA_path'],
            statRequirement: { stat: 'CHA', minPoints: 50 },
          },
        ];
        // curious path
        return [
          {
            id: 'respect_unbeaten',
            label: 'That you\'ve never been beaten.',
            description: 'Acknowledge what she is.',
            tags: ['WIS_path'],
          },
          {
            id: 'fortune',
            label: 'That you remember every one who failed.',
            description: 'Lean into the pattern-breaking. Maybe you\'re different.',
            tags: ['LCK_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('WIS_path')) {
          return `You understand thresholds. That is rare — rarer than strength, rarer than speed. Most arrive and see a wall. You see a question. The Tower respects the question. I... may respect the asker. What do you choose?`;
        }
        if (tags.includes('LCK_path')) {
          return `"Different." They all believe it, the ${s.adventurerArchetype} especially. Yet fortune is a capricious guardian. You may find that it has already prepared something for you here. Or it may simply watch you fail. Either way, you must choose.`;
        }
        if (tags.includes('CHA_path')) {
          return `You caught yourself. That... takes something. Most who open with aggression carry it to the end. The fact that you can change course tells me something about your nature. What is your next move?`;
        }
        return `An honest ${s.adventurerArchetype}. I have seen many. The Tower chews through honesty as easily as deception. But it has its own respect for those who do not hide. Choose.`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, _s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [ALWAYS_FIGHT];

        // WIS path: weakness reveal
        if (tags.includes('WIS_path')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask what the threshold reveals about itself.',
            description: 'The question earns an answer.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            achievement: 'vanya_the_understood',
            combatEffect: {
              type: 'weakness_exposed',
              description: 'Vanya revealed her shell is bypassed by magic and status effects.',
            },
            bossClosingLine: 'Know this, then: my shell grows when struck. Go around it. Now — the threshold must still be crossed.',
          });
        }

        // LCK path: fortune cache
        if (tags.includes('LCK_path')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Trust to fortune.',
            description: 'Perhaps luck has already prepared something here.',
            unlockConditions: {
              requiredTags: ['LCK_path'],
              probability: 0.30,
            },
            lootReward: { gold: 75, description: 'A fortune-touched cache — materials and gold, hidden by luck itself.' },
            bossClosingLine: 'Fortune-seekers sometimes find what the careful miss. There — in the roots. Now prepare yourself.',
          });
        }

        // CHA path: bypass
        if (tags.includes('CHA_path')) {
          outcomes.push({
            id: 'bypass',
            label: 'Convince her your cause is worthy.',
            description: 'Make the case. She has heard a thousand others.',
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            achievement: 'walked_past_death',
            combatEffect: { type: 'none' },
            bossClosingLine: '...Go. The threshold was never meant to stop the worthy. I will remember the name that turned me without a blow.',
          });
        }

        return outcomes;
      },
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
  lore: 'Sorath was bound into the Tower as punishment for his deceptions in the world above. Here, lies have power. He has made a kingdom of them. He wants your agreement more than your defeat — to make you choose damnation willingly.',
  theme: 'Temptation & Corruption',
  bossDefeatedEcho: 'Sorath\'s throne is empty. The thousand-tongued Duke was finally silenced by a mortal who refused his bargains. The amber eyes are gone. Whatever he offered the one who stood here — they chose the sword instead.',
  mechanic: {
    name: 'Rewind',
    hint: 'He adapts. Repeat the same action three times and he will be ready for it.',
    observeReveal: 'Sorath reads your last three action types and builds resistance. Vary your approach: mix strikes, defenses, and skills each turn cycle to prevent his adaptation.',
  },
  conversation: {
    exchange1: {
      bossOpening: 'Oh. Another one. You all have the same look — determined, slightly afraid, completely unaware that the real danger was never down here. Tell me: what do you think you\'re fighting for?',
      getChoices: (_s: PlayerSnapshot) => [
        {
          id: 'mission',
          label: 'To get through. Nothing more.',
          description: 'Simple, honest. You want no part of his games.',
          tags: ['simple_honest'],
        },
        {
          id: 'expose',
          label: 'You\'re stalling. You\'re afraid of something.',
          description: 'Turn his tactics back on him immediately.',
          tags: ['INT_path'],
          statRequirement: { stat: 'INT', minPoints: 80 },
        },
        {
          id: 'engage',
          label: 'Let\'s hear what you\'re offering.',
          description: 'Play his game — carefully.',
          tags: ['CHA_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'mission') return '"Nothing more." The simplest lie always. Everyone wants more. That\'s why you\'re here — not to survive, but to surpass. What are you surpassing *toward*?';
        if (choice1Id === 'expose') return 'A pause. His face flickers. "...Clever. Most take until at least the second exchange to try that. I am... rarely caught off-balance." He recovers, amber eyes sharpening. "Fine. What gave me away?"';
        return '"Ah — curiosity! My favorite weakness. I\'m offering the obvious: a guarantee. You step aside right now, and I give you passage without consequence. Worth considering, don\'t you think?"';
      },
      getChoices: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'mission') return [
          {
            id: 'unmoved',
            label: 'I said what I meant. Stand aside or don\'t.',
            description: 'Unyielding. He can\'t work with someone who won\'t engage.',
            tags: ['unmoved_path'],
          },
          {
            id: 'admit',
            label: '...Yes. There is something else.',
            description: 'An honest admission. This surprises him.',
            tags: ['CHA_path'],
            statRequirement: { stat: 'CHA', minPoints: 80 },
          },
        ];
        if (choice1Id === 'expose') return [
          {
            id: 'specifics',
            label: 'Your eyes. They moved before your face changed. You\'re reading me.',
            description: 'Precise observation. The INT play.',
            tags: ['INT_path', 'exposed_liar'],
            statRequirement: { stat: 'INT', minPoints: 120 },
          },
          {
            id: 'gut',
            label: 'I can\'t say. Instinct.',
            description: 'Honest about the limit of your insight.',
            tags: ['simple_honest'],
          },
        ];
        return [
          {
            id: 'counter_offer',
            label: 'What do YOU get from letting me through?',
            description: 'Every deal has two sides. Find his.',
            tags: ['CHA_path', 'bargainer'],
            statRequirement: { stat: 'CHA', minPoints: 100 },
          },
          {
            id: 'reject',
            label: 'I don\'t make deals with bound demons.',
            description: 'Shut it down. He expected this.',
            tags: ['aggressive_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, _s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('exposed_liar')) return '"You found the seam in my performance. That has not happened in..." He is quiet for a moment. "I will not insult you with another script. What now?"';
        if (tags.includes('bargainer')) return '"What do I get?" A long pause. Then something almost like honesty crosses his face. "The same thing I always want. To matter to someone. For the transaction to mean something. It\'s pathetic, I know."';
        if (tags.includes('CHA_path')) return '"You\'re unusual. Most choose the simple path — attack or flee. You stay and talk. I respect that. It changes nothing about my mandate, but I respect it."';
        return '"Simple to the end. I appreciate the consistency, if not the conversation."';
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [ALWAYS_FIGHT];

        if (tags.includes('exposed_liar')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask what he\'s actually afraid of.',
            description: 'A liar exposed will sometimes tell the truth.',
            unlockConditions: {
              requiredTags: ['exposed_liar'],
              statCheck: { stat: 'INT', minPoints: 120 },
            },
            achievement: 'sorath_truth_extracted',
            combatEffect: {
              type: 'weakness_exposed',
              description: 'Sorath revealed he adapts to repeated patterns — vary your action types each turn.',
            },
            bossClosingLine: '"Fine. The truth: I read what you repeat and build walls against it. So don\'t repeat. Now — let\'s settle this properly."',
          });
        }

        if (tags.includes('bargainer') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: 'Complete the bargain.',
            description: 'He found his dignity in the honesty. Close the deal.',
            unlockConditions: {
              requiredTags: ['bargainer'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            achievement: 'walked_past_death',
            bossClosingLine: '"Go. It wasn\'t a victory I wanted from you anyway. Come back, if you survive. I\'d like to talk again."',
          });
        }

        return outcomes;
      },
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
  epithet: "The Death-Choir's Conductor",
  pantheon: 'Mesopotamian',
  appearanceEmoji: '🦴',
  appearance: 'A skeletal figure draped in funerary linen. Clay tablets inscribed with forgotten names cover his body. Small bones dangle from threads at his wrists, chiming softly.',
  lore: "Kutcher came to the Tower seeking the names of the dead. Every mortal who ever drew breath and returned to dust. In the convergence, he began to collect them, singing their ghosts into harmonies. He wants to add your name to his chorus.",
  theme: 'Mortality & the Inevitability of Ending',
  bossDefeatedEcho: "Kutcher's choir is silent. The Bone-Singer who collected ten thousand names has had his own name written — by the hand of a mortal adventurer. The clay tablets stand empty. His collection will grow no further.",
  mechanic: {
    name: 'Static Siphon',
    hint: 'Each action drains your momentum. Too many actions and you lose your edge.',
    observeReveal: "Kutcher siphons your speed with each action staged. If your speed drops below his threshold, you lose your bonus action. Use skills and items to preserve your action economy.",
  },
  conversation: {
    exchange1: {
      bossOpening: "What a lovely name you carry. I've been collecting names for centuries — each one a different note. Yours has a particular resonance. Before I add it to my choir... introduce yourself. Tell me something the name doesn't.",
      getChoices: (_s: PlayerSnapshot) => [
        {
          id: 'sing',
          label: 'Sing something.',
          description: 'Meet him on his terms. Whatever comes to mind.',
          tags: ['WIS_path', 'singer'],
        },
        {
          id: 'name_refuse',
          label: 'My name isn\'t yours to take.',
          description: 'Defiance. Simple, clear.',
          tags: ['defiant_path'],
        },
        {
          id: 'ask_list',
          label: 'Tell me whose names you\'ve collected.',
          description: 'Learn about those who came before.',
          tags: ['curious_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'sing') return 'The bones at his wrists go still. A long silence. "...You sang. No one has ever—" He stops himself. "The melody was imperfect. But the attempt. The attempt was genuine. Tell me — do you understand why that matters to me?"';
        if (choice1Id === 'name_refuse') return `"Oh, but it already IS mine. It simply hasn\'t arrived yet." He sounds almost gentle. "Every ${s.adventurerArchetype} who comes to me says something like that. Most in those exact words. What makes you different from all the others who refused?"`;
        return `"Whose names." A pause. "All of them. The warriors who trusted their arms. The mages who trusted their spells. The gamblers who trusted the dice. Do you want to know which kind survived longest? You might be surprised."`;
      },
      getChoices: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'sing') return [
          {
            id: 'why_singing',
            label: 'Because silence means agreement. I disagreed.',
            description: 'Philosophical. You knew exactly what you were doing.',
            tags: ['WIS_path', 'philosopher'],
            statRequirement: { stat: 'WIS', minPoints: 80 },
          },
          {
            id: 'honest_song',
            label: 'I don\'t know. It felt right.',
            description: 'Honest in its simplicity.',
            tags: ['honest_path'],
          },
        ];
        if (choice1Id === 'name_refuse') return [
          {
            id: 'made_it',
            label: 'What I\'ve done since I chose to descend.',
            description: 'Not defiance — accomplishment.',
            tags: ['STR_path'],
          },
          {
            id: 'mortality',
            label: 'I know I\'m going to die. I just choose when and where.',
            description: 'Embrace mortality without surrendering to it.',
            tags: ['WIS_path'],
          },
        ];
        return [
          {
            id: 'want_to_know',
            label: 'Yes. Tell me which kind survived longest.',
            description: 'The honest gamble — ask the thing that might help you.',
            tags: ['LCK_path'],
          },
          {
            id: 'doesnt_matter',
            label: 'Patterns don\'t determine individuals.',
            description: 'Reject the statistical frame.',
            tags: ['defiant_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, _s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('philosopher')) return '"Silence means agreement." He tilts his skull, considering. "That is... new. The names I collect never saw their silence as consent. They saw it as absence. You see it as position. That changes something in how I hear your name."';
        if (tags.includes('mortality')) return '"Choose when and where." His voice softens to something almost respectful. "Every warrior who ever said that eventually found out if they meant it. Most didn\'t. What will you do with your choice now?"';
        if (tags.includes('LCK_path')) return '"The survivors? The WIS-built ones. The Paladins. The methodical. Not because they hit harder — because they knew when to endure. Does knowing that change your approach? It shouldn\'t. It should terrify you."';
        return '"The defiant. Always the defiant. Choose what comes next."';
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [ALWAYS_FIGHT];

        if (tags.includes('singer') || tags.includes('philosopher')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask him what note your fate should take.',
            description: 'The singer might answer a singer.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            achievement: 'kutcher_song_of_truth',
            combatEffect: {
              type: 'weakness_exposed',
              description: 'Kutcher drains your speed each action. Conserve your moves — fewer, heavier actions preserve your bonus slot.',
            },
            bossClosingLine: '"Every action you take, I take a note of your speed. Slow your rhythm. Fewer, harder. That is the only song I respect."',
          });
        }

        if (tags.includes('LCK_path') && Math.random() < 0.25) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Ask to see the effects of a survivor\'s name.',
            description: 'The Paladin types who survived — they left something behind.',
            unlockConditions: { requiredTags: ['LCK_path'], probability: 0.25 },
            lootReward: { gold: 50, description: 'An echo of a past survivor\'s fortune — materials from the long-ago.' },
            bossClosingLine: '"The Bulwark who survived left this behind. Take it. It will not spare you what comes next."',
          });
        }

        if (tags.includes('mortality') && s.statPoints.CHA >= 120) {
          outcomes.push({
            id: 'bypass',
            label: 'The choice is to walk past.',
            description: 'You chose your moment. This is it.',
            unlockConditions: {
              requiredTags: ['mortality'],
              statCheck: { stat: 'CHA', minPoints: 120 },
            },
            achievement: 'walked_past_death',
            bossClosingLine: '"Then you have chosen your moment. I will record this. Not your name — not yet. But this choice." He steps aside. "Go. The choir can wait for another voice."',
          });
        }

        return outcomes;
      },
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
  appearance: 'A form of constant flowing water held temporarily in womanly shape. She glows with bioluminescent algae. When she moves, water pools at her feet. Her voice is soft and continuous — like a gentle current.',
  lore: 'Kalindi is the animating force of all waters. The convergence awakened her to purpose: to purify climbers, to return them to her waters, to cycle them into the world anew. She is not cruel. She simply operates on a scale where individual lives are temporary ripples.',
  theme: 'Purification & Natural Cycles',
  bossDefeatedEcho: 'Kalindi\'s waters are still. The River-Mother who sought to purify all things has herself been stilled by a mortal hand. The current has no conductor now. Whether she will reform, or whether this pool is all that remains — the Tower has not said.',
  mechanic: {
    name: 'Spreading Contagion',
    hint: 'Whatever affliction you give her, she gives back worse. Status effects reflect at amplified potency.',
    observeReveal: 'Any debuff you apply to Kalindi reflects to you at 1.5× strength, bypassing your resistance. Use pure damage — no poison, no curses, no status effects.',
  },
  conversation: {
    exchange1: {
      bossOpening: 'You thirst, yes? I can see it. All living things thirst. The water you were made from remembers me. Before we proceed — tell me what you carry. Not the weapon. What you carry inside.',
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'purpose',
          label: 'Purpose. I know why I\'m here.',
          description: 'Confident answer. Purpose is a kind of water too.',
          tags: ['WIS_path'],
        },
        {
          id: 'anger',
          label: 'Anger. Something to prove.',
          description: `The ${s.adventurerArchetype}'s honest answer, perhaps.`,
          tags: ['STR_path'],
        },
        {
          id: 'question',
          label: 'A question I can\'t answer any other way.',
          description: 'Philosophical honesty. The water appreciates questions.',
          tags: ['LCK_path', 'philosopher'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'purpose') return '"Purpose. Yes. The purposeful ones survive longer. But the water does not reward purpose — only persistence. Your purpose may be true. Is it also patient?"';
        if (choice1Id === 'anger') return '"Anger burns. Water doesn\'t. I have outlasted more anger than you can imagine — centuries of it. It always purifies into something quieter. What will yours become?"';
        return '"A question you can\'t answer another way. Tell me the question, if you will. The water has heard many questions. Not all deserve answers. But all deserve asking."';
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'purpose') return [
          {
            id: 'patient_yes',
            label: 'It has to be. I\'ve survived this far by it.',
            description: 'Grounding in evidence.',
            tags: ['WIS_path', 'patient'],
            statRequirement: { stat: 'WIS', minPoints: 80 },
          },
          {
            id: 'patient_honest',
            label: 'Not always. Sometimes I simply push.',
            description: 'Honest about the limits.',
            tags: ['honest_path'],
          },
        ];
        if (choice1Id === 'anger') return [
          {
            id: 'transforms',
            label: 'Into patience, I hope. One day.',
            description: 'Awareness of the process.',
            tags: ['WIS_path'],
          },
          {
            id: 'stays_anger',
            label: 'I don\'t know. Maybe it stays anger.',
            description: 'Raw honesty.',
            tags: ['STR_path'],
          },
        ];
        const question = s.adventurerArchetype === 'Gambler' ? 'Whether luck is earned or given.' : 'Whether I can survive what I haven\'t prepared for.';
        return [
          {
            id: 'share_question',
            label: question,
            description: 'Give her the real question.',
            tags: ['LCK_path', 'question_asked'],
          },
          {
            id: 'private',
            label: 'It\'s private.',
            description: 'Keep it.',
            tags: ['honest_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, _s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('patient') && tags.includes('WIS_path')) return '"Patience and purpose together. These are not qualities water fights against. What would you ask of me, then, if asking is possible before combat?"';
        if (tags.includes('question_asked')) return `"Whether luck is earned or given. The current doesn\'t judge it — luck is simply where the current takes you. But I can tell you this: the currents here favor those who know when to stop fighting the water and simply... float. What do you choose?"`;
        if (tags.includes('STR_path')) return '"Strong. Honest. The river doesn\'t hold grudges against those who beat their path through it. Make your choice."';
        return '"The water has heard your answer. It is neither wrong nor right — only what you carry. Choose what happens next."';
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [ALWAYS_FIGHT];

        if (tags.includes('patient') && tags.includes('WIS_path')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask the water what flows around the current.',
            description: 'Patience earns an honest answer.',
            unlockConditions: {
              requiredTags: ['WIS_path', 'patient'],
              statCheck: { stat: 'WIS', minPoints: 120 },
            },
            achievement: 'kalindi_river_wisdom',
            combatEffect: {
              type: 'weakness_exposed',
              description: 'Kalindi reflects debuffs at 1.5×. Use pure damage — no status effects, no curses.',
            },
            bossClosingLine: '"The current I guard reflects what you throw at it. Do not poison a river. Strike directly. That is the only path."',
          });
        }

        if (tags.includes('question_asked') && Math.random() < 0.30) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Float with the current briefly.',
            description: 'Let the water show you what it carries.',
            unlockConditions: { requiredTags: ['question_asked'], probability: 0.30 },
            lootReward: { gold: 60, description: 'Items carried downstream by the river\'s current.' },
            bossClosingLine: '"The river brought these here. Take what fortune carried. Then come — the current must still be crossed."',
          });
        }

        if (tags.includes('WIS_path') && s.statPoints.CHA >= 130) {
          outcomes.push({
            id: 'bypass',
            label: 'Offer to carry the water\'s question forward.',
            description: 'Promise to bring her curiosity beyond her reach.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'CHA', minPoints: 130 },
            },
            achievement: 'walked_past_death',
            bossClosingLine: '"...Yes. Carry it forward. The water cannot follow where you go. But perhaps you can." She parts. "Be worthy of the carrying."',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 25 — MALIK, LORD OF WHAT NEVER WAS (Primordial)
// ──────────────────────────────────────────────────────────
const MALIK: MilestoneBoss = {
  id: 'malik_floor25',
  floor: 25,
  name: 'Malik',
  epithet: 'Lord of What Never Was',
  pantheon: 'Primordial',
  appearanceEmoji: '🌑',
  appearance: 'An absence shaped like a man. Wherever you look at him, there\'s nothing — but you can see perfectly around him. Shadows cluster near him like iron filings to a magnet. When he speaks, the sound comes from everywhere at once.',
  lore: 'Malik existed before creation. He slipped into the Tower through cracks in reality, drawn by the chaos of the convergence. He has no agenda beyond curiosity: what happens when you push a climber into true nothingness?',
  theme: 'Unreality & Dissolution',
  bossDefeatedEcho: 'Where Malik stood, there is now a perfect absence — the shape of a man-sized nothing. He was dissolved by a mortal who refused to accept that dissolution was inevitable. The void has learned it can be fought. Whether it has learned to be afraid is another question.',
  mechanic: {
    name: 'Echo Chains',
    hint: 'Your consecutive strikes power his next blow. The longer your combo, the harder he hits back.',
    observeReveal: 'Malik mirrors your comboCount as bonus damage on his next attack. Deliberately take small hits or miss attacks to reset your combo before it becomes lethal.',
  },
  conversation: {
    exchange1: {
      bossOpening: 'You are here. You are not here. Both are equally true. I have been examining this paradox for some time and you will help me test it. Tell me — what, to you, is real?',
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'exist',
          label: 'What I can touch, strike, and survive.',
          description: 'Pragmatic. Real is what matters.',
          tags: ['STR_path', 'pragmatic'],
        },
        {
          id: 'choice',
          label: 'What I choose to treat as real.',
          description: `The ${s.adventurerArchetype}'s philosophical answer.`,
          tags: ['WIS_path', 'philosopher'],
        },
        {
          id: 'void_real',
          label: 'Nothing is real. That\'s why I can do anything.',
          description: 'Meet unreality with unreality.',
          tags: ['LCK_path', 'void_embrace'],
          statRequirement: { stat: 'LCK', minPoints: 60 },
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'exist') return '"What you can touch." Interesting. I am the space between what can be touched. Does that make me less real? Most who arrive with your conviction answer this question with their sword. A few answer it with their attention."';
        if (choice1Id === 'choice') return '"What you choose to treat as real. I have heard this answer from scholars, prophets, and gamblers alike. Tell me — what do you choose to treat as real about ME?"';
        return '"Nothing is real. Yes. And the gambler — the one who plays in the void — sometimes wins exactly because they refuse to believe in the rules. Tell me what winning looks like to someone who believes in nothing."';
      },
      getChoices: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'exist') return [
          {
            id: 'threat_real',
            label: 'Your threat is real enough. I\'ll treat it accordingly.',
            description: 'Pragmatic and focused.',
            tags: ['STR_path', 'pragmatic'],
          },
          {
            id: 'attention',
            label: 'I\'m paying attention right now.',
            description: 'Choose the deeper answer.',
            tags: ['INT_path'],
            statRequirement: { stat: 'INT', minPoints: 90 },
          },
        ];
        if (choice1Id === 'choice') return [
          {
            id: 'danger_real',
            label: 'The danger you represent. That is real.',
            description: 'Focused on the immediate.',
            tags: ['WIS_path'],
          },
          {
            id: 'paradox',
            label: 'The paradox itself. You are a real absence.',
            description: 'Acknowledge his nature without flinching.',
            tags: ['INT_path', 'paradox_holder'],
            statRequirement: { stat: 'INT', minPoints: 100 },
          },
        ];
        return [
          {
            id: 'survive',
            label: 'Surviving the void. That\'s winning.',
            description: 'The gambler knows the house edge.',
            tags: ['LCK_path', 'void_gambler'],
          },
          {
            id: 'through_void',
            label: 'Getting through it to what\'s beyond.',
            description: 'The void as a door, not a destination.',
            tags: ['LCK_path', 'void_walker'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, _s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('paradox_holder')) return '"A real absence." He is quiet. Genuinely quiet. "I have never been named that way before. Not by anyone. The language fits in a way I cannot explain, which is unusual — I know the explanation for most things. Choose carefully what comes next. I am paying attention now."';
        if (tags.includes('attention')) return '"You are paying attention. Yes. Most do not. They arrive with the answer already formed and the conversation is simply delay. But you — you are still forming it. That is rare. Choose."';
        if (tags.includes('void_gambler')) return '"Surviving the void. The gamblers always bet on survival and then discover the void has better odds. But occasionally — occasionally — they win. Choose your odds."';
        return '"An absence choosing its resolution. That is what you are to me right now — a shape in the space before decision. Choose."';
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [ALWAYS_FIGHT];

        if (tags.includes('paradox_holder') || tags.includes('attention')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask what the void looks like from inside.',
            description: 'He is paying attention. He might answer.',
            unlockConditions: {
              requiredTags: ['INT_path'],
              statCheck: { stat: 'INT', minPoints: 100 },
            },
            achievement: 'malik_void_scholar',
            combatEffect: {
              type: 'weakness_exposed',
              description: 'Malik mirrors your combo count as damage. Reset your combo deliberately — take a hit or miss an attack before it stacks past 3.',
            },
            bossClosingLine: '"From inside: your consecutive strikes compound. I take that momentum and return it. Break the chain before it breaks you. Now — I have answered. Let us proceed."',
          });
        }

        if (tags.includes('void_gambler') && Math.random() < 0.30) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Take the gambler\'s odds.',
            description: '30% chance the void has already prepared something.',
            unlockConditions: { requiredTags: ['LCK_path'], probability: 0.30 },
            lootReward: { gold: 80, description: 'A void-cache — items that exist between what should exist and what does.' },
            bossClosingLine: '"The void occasionally contains things. You found one. Take it. The odds were always in my favor, but I enjoy the exceptions."',
          });
        }

        if (tags.includes('void_walker') && s.statPoints.CHA >= 140) {
          outcomes.push({
            id: 'bypass',
            label: 'Step through him.',
            description: 'If the void is a door — walk through it.',
            unlockConditions: {
              requiredTags: ['void_walker'],
              statCheck: { stat: 'CHA', minPoints: 140 },
            },
            achievement: 'walked_past_death',
            bossClosingLine: '"Through me. Yes. Through me — not past me. They are different. You understood the distinction." He parts. The absence closes behind you.',
          });
        }

        return outcomes;
      },
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
  // Floors 30-100: Sekhmet, Ahab, Ignis, Morgaine, Tyrael, Jormungandr,
  // Nemesis, Apep, Ashur, Sedna, Yaotzin, Thoth, Hades, Brahman, Valdris
  // — to be implemented in subsequent sprint
];

export function getMilestoneBoss(floor: number): MilestoneBoss | null {
  if (floor % 5 !== 0) return null;
  return MILESTONE_BOSSES.find(b => b.floor === floor) ?? null;
}

export function isMilestoneFloor(floor: number): boolean {
  return floor % 5 === 0 && MILESTONE_BOSSES.some(b => b.floor === floor);
}
