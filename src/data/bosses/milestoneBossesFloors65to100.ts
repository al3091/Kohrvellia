/**
 * Milestone Bosses — Floors 65–100
 *
 * ZONES:
 * Floors 61–80: Johr'kuun — Serpent Continent, Zahhak's territory
 * Floors 81–99: The Rutkean'i Core — Where the 14 who refused to die live
 * Floor 100:    Skaervox — The Shapechanger, The Lawmaker
 *
 * By floor 65, the Tower knows: something impossible is climbing.
 * The 5th Coronation is 2 months away. A human candidate cannot exist.
 * Skaervox is watching. The grammar of the world strains around one word:
 * Skaer'kohr'wilak — the title the divine record refuses to write.
 */

import type { MilestoneBoss, BossOutcome } from './milestoneBosses';
import type { PlayerSnapshot } from '../../types/PlayerSnapshot';

// ===== SHARED FIGHT OUTCOME =====

const FIGHT: BossOutcome = {
  id: 'fight',
  label: 'Draw your weapon.',
  description: 'Some things can only be answered with steel.',
  unlockConditions: { requiredTags: [] },
  combatEffect: { type: 'none' },
  bossClosingLine: 'Then we settle this the only way that matters.',
};

// ──────────────────────────────────────────────────────────
// FLOOR 65 — SKAER'FUUR, A SHARD THAT REMEMBERS BEING WHOLE
// ──────────────────────────────────────────────────────────
const SKAER_FUUR: MilestoneBoss = {
  id: 'skaer_fuur_floor65',
  floor: 65,
  name: "Skaer'fuur",
  epithet: 'A Shard That Remembers Being Whole',
  pantheon: "Johr'kuun",
  appearanceEmoji: '✦',
  appearance:
    "A person — almost. Hair that was black a moment ago is now gold. The face holds different eyes than it did when you first looked. It carries itself with the posture of someone remembering posture from another body's memory. When it shifts, it does not move — it simply becomes somewhere else it has already been.",
  lore:
    "A fragment of a deity destroyed during the Hunt Phase of the Aleabishal. The shard wears whatever form it last remembered before the parent divine was extinguished. It is genuinely uncertain what it is — not performing confusion, not using it as a weapon. It simply cannot complete the question. What persists after a god's death is not an echo. It is a question that had no time to finish.",
  theme: 'The fragment that still remembers god',
  bossDefeatedEcho:
    "The fragment is gone. Whatever remains of a destroyed deity when its last shard is extinguished — that is what happened here. It mentioned, in its final exchange, that something above was watching. It seemed relieved.",
  mechanic: {
    name: 'Residual Divinity',
    hint: "It is not sure what it is. Neither are its attacks.",
    observeReveal:
      "Skaer'fuur's damage type rotates each exchange — physical, then magical, then void, then elemental. What you built resistance to last round becomes your weakness. Adapt or the rotation will catch you unprepared.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "You are... you are a wilak. Yes. I remember wilak. They smelled like possibility and short years. I have been here since — since I was more than this. You are climbing. Something told me you were climbing. I cannot remember what told me. Will you tell me what I am?",
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'name_it',
          label: 'A fragment of a divine that was destroyed.',
          description: 'Honest, clean. Name the thing it cannot name itself.',
          tags: ['WIS_path', 'named_shard'],
          statRequirement: { stat: 'WIS', minPoints: 110 },
        },
        {
          id: 'deflect',
          label: `I don't know what you are. Neither do you.`,
          description: 'Meet its confusion with honesty.',
          tags: ['honest_path'],
        },
        {
          id: 'weapon_answer',
          label: 'You are what stands between me and the next floor.',
          description:
            s.approachStyle === 'aggressive'
              ? 'Pure focus. You are not here for philosophy.'
              : 'The practical answer. You need to get through.',
          tags: ['aggressive_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'name_it') {
          return `"Fragment. Yes. The word fits — it fits the way a word fits when you find it after years without it. I was part of something. The Aleabishal took the rest. I..." It pauses, and in the pause, its hair changes color twice. "They have been watching since you entered the serpent territory. I can feel their attention the same way I feel my own edges dissolving. Skaervox. The Shapechanger is watching you, ${s.characterName}. Does that change what you want from this conversation?"`;
        }
        if (choice1Id === 'deflect') {
          return `"Neither do I." It turns this over. The face — different eyes now, you notice, darker than before — seems to find something in this. "That is honest. The deities who destroyed what I was thought they knew. They knew so completely that they could end the question. And here I remain, a question they thought they closed." It shifts slightly. "Something above is watching you. I felt it when you crossed the floor threshold. They wrote a law. You are violating it. They find that interesting — I can feel their interest the way I feel the shape I no longer fully have."`;
        }
        return `"The next floor." The form flickers — soldier's stance appearing briefly over whatever it was before. "I have heard that from ${s.adventurerArchetype}s who were certain. Their names did not survive the knowing. But you — something above is watching you specifically. I have not seen that attention given to a wilak before. It changes the weight of the next floor, does it not?"`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'name_it') {
          return [
            {
              id: 'ask_what_remains',
              label: 'What does a fragment still want?',
              description: 'Follow the thread. A named thing can answer.',
              tags: ['WIS_path', 'fragment_understood'],
              statRequirement: { stat: 'WIS', minPoints: 130 },
            },
            {
              id: 'skaervox_acknowledged',
              label: 'Skaervox watching changes nothing.',
              description: 'You knew. You climbed anyway.',
              tags: ['defiant_path'],
            },
          ];
        }
        if (choice1Id === 'deflect') {
          return [
            {
              id: 'open_question',
              label: 'What was the question? The one they tried to close.',
              description: 'Ask the thing the Aleabishal interrupted.',
              tags: ['WIS_path', 'fragment_understood'],
              statRequirement: { stat: 'WIS', minPoints: 100 },
            },
            {
              id: 'skaervox_known',
              label: `${s.deityFavor === 'blessed' ? s.patronDeityName + ' knew the risk.' : 'I have no answer for a watching god.'}`,
              description:
                s.deityFavor === 'blessed'
                  ? 'Your deity walked into this with you.'
                  : 'Admit the weight of being watched.',
              tags: ['deity_path'],
            },
          ];
        }
        return [
          {
            id: 'next_floor_steady',
            label: 'Then let us not waste the attention we are getting.',
            description: 'Dark humor under pressure. Move forward.',
            tags: ['aggressive_path', 'steady_nerve'],
          },
          {
            id: 'admit_weight',
            label: 'It does. I did not expect a god to notice this early.',
            description: 'Honest acknowledgment of what Skaervox watching means.',
            tags: ['honest_path', 'weight_felt'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('fragment_understood')) {
          return `"What did I still want." It is very still. The form settles — not into anything definite, but into something less restless. "I wanted to remember the rest of what I was. I wanted the name back. All of it." A long pause, the eyes a color they were not before. "You have given me the closest thing to it I have been given in — I do not know how many floors of your counting. I do not know if that means I should let you pass or fight you before you become something the record cannot contain. What do you choose?"`;
        }
        if (tags.includes('steady_nerve') || tags.includes('weight_felt')) {
          return `"The watching changes the weight of this encounter. Something ancient and curious is paying attention to a wilak who should not exist — and you know it, and you climbed anyway." The form shifts once — soldier, then stranger, then something without a clean category. "I respect that, ${s.adventurerArchetype}. It does not spare you. But I respect it. Choose."`;
        }
        return `"${s.patronDeityName} brought you here, into a law that makes you impossible. Whatever I was, I remember what divine bonds cost. Choose what comes between us, wilak."`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (tags.includes('fragment_understood') && s.statPoints.WIS >= 130) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Give it the answer it was interrupted from finding.',
            description: 'A fragment that has been named can reveal itself fully.',
            unlockConditions: {
              requiredTags: ['WIS_path', 'fragment_understood'],
              statCheck: { stat: 'WIS', minPoints: 130 },
            },
            achievement: 'skaer_fuur_remembered',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Skaer'fuur's attack type rotates each exchange: physical, magical, void, elemental. The resistance you built last round becomes the weakness it exploits next.",
            },
            bossClosingLine:
              '"I was a god of resonance. What I absorbed, I returned amplified and changed. The rotation is that memory — each form a different age of what I was. You know this now." It straightens, the form almost coherent. "It changes nothing about what must happen. But you earned the knowing."',
          });
        }

        if (tags.includes('aggressive_path') || tags.includes('honest_path')) {
          if (s.statPoints.LCK >= 60) {
            outcomes.push({
              id: 'loot_cache',
              label: 'Ask if fragments leave things behind.',
              description:
                'A destroyed deity — even in shard form — may still carry residue of divine belonging.',
              unlockConditions: {
                requiredTags: [],
                probability: 0.25,
              },
              lootReward: {
                gold: 120,
                description:
                  'A residue of divine belonging — material artifacts from what the fragment once was.',
              },
              bossClosingLine:
                '"Fragments leave everything behind. That is the definition." It gestures toward a still place in the room. "Take what the shard remembers owning. It does not belong to me anymore. None of it does."',
            });
          }
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 70 — KOHR'UWA, THE CHOICE THAT SPLIT
// ──────────────────────────────────────────────────────────
const KOHR_UWA: MilestoneBoss = {
  id: 'kohr_uwa_floor70',
  floor: 70,
  name: "Kohr'uwa",
  epithet: 'The Choice That Split',
  pantheon: "Johr'kuun",
  appearanceEmoji: '⚖️',
  appearance:
    "Two figures — identical in form, completely opposite in bearing. One stands precisely still, watching. The other paces, arguing, never completing a sentence before the first one finishes it in a different direction. They wear the same face. They have not agreed on anything in a very long time.",
  lore:
    "A single divine entity cleaved in two by the Aleabishal's ruling on divided loyalties. The law demanded a choice; the being could not make it; the law made it for them by splitting the inability into two aspects — one that enforces, one that questions. Neither functions at full capacity without the other. Neither agrees on anything. They have been arguing about you since you reached the forty-seventh floor.",
  theme: 'The choice that becomes two',
  bossDefeatedEcho:
    "Kohr'uwa has gone quiet. The two who could not agree on what to do about you have been resolved — permanently, by your hand. The Rutkean'i Core begins just above. Whatever lives there has noticed. You cannot tell if it is fear or welcome.",
  mechanic: {
    name: 'Divided Will',
    hint: 'Two things that were one cannot die separately. They would simply start over.',
    observeReveal:
      "Both aspects of Kohr'uwa must be defeated within 3 rounds of each other. Leaving one alive too long causes the other to fully recover. Distribute damage evenly — or commit to one only when the other is near breaking.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "ENFORCER: The wilak stops here. The law is clear — a mortal with a divine mark is an aberration and the aberration ends on this floor.\n\nQUESTIONER: The law is clear and the law is wrong and you know it is wrong. Look at it. It climbed seventy floors. What law explains that?\n\nENFORCER: The law does not need to explain it.\n\nQUESTIONER: [To you] You. Wilak. Tell me — why are you here? Not the answer the law accepts. The real one.",
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'real_answer',
          label: `Because ${s.patronDeityName} believed I could reach the top.`,
          description: 'Answer the questioner. Give the reason behind the climbing.',
          tags: ['CHA_path', 'real_reason'],
        },
        {
          id: 'law_answer',
          label: 'Because the law that made me impossible does not make me stop.',
          description: 'Answer both. Name the tension directly.',
          tags: ['defiant_path', 'law_named'],
        },
        {
          id: 'question_back',
          label: 'Why does the questioner ask? What does the answer change for you?',
          description: 'Redirect. Find the seam in the disagreement.',
          tags: ['INT_path', 'seam_found'],
          statRequirement: { stat: 'INT', minPoints: 120 },
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'real_answer') {
          return `QUESTIONER: "A deity believed. That is — that is actually a more interesting answer than I expected." \n\nENFORCER: "It does not matter what a deity believed. The belief does not change the law." \n\nQUESTIONER: "The belief brought it here. Seventy floors. The belief was not wrong in any practical sense." \n\nENFORCER: [Turning to you] "Your patron broke divine law. You carry an illegal mark. Everything above this floor is built on violation. Name your patron and we will discuss what that violation costs."`;
        }
        if (choice1Id === 'law_answer') {
          return `ENFORCER: "The law does not make you stop. The law does not need to. I do." \n\nQUESTIONER: "You are citing the law at something that has already falsified it. You understand that? Seventy floors of falsification and you are going to cite the premise." A pause, both faces turning toward each other in what is almost argument and almost something more painful. "It knows the law. It climbed through the law. Say something the law does not already know it will hear."`;
        }
        return `A pause. The enforcer stops moving. The questioner stops mid-sentence. They look at each other — two faces wearing the same expression of something that has not happened in a long time. \n\nQUESTIONER: "It found the question." \n\nENFORCER: "...Yes." \n\nQUESTIONER: [To you] "What the answer changes for me is whether you are a violation or an exception. The law has no category for exceptions. But I have been arguing with this one —" [gestures at the enforcer] "— for so long that I have begun to suspect the law is missing a category. ${s.adventurerArchetype}. What do you think you are?"`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'real_answer') {
          return [
            {
              id: 'name_patron',
              label: `${s.patronDeityName} made a choice. I am what that choice looks like.`,
              description:
                'Name your deity without apology. You are the consequence of a divine decision.',
              tags: ['CHA_path', 'patron_named'],
              statRequirement: { stat: 'CHA', minPoints: 160 },
            },
            {
              id: 'cost_known',
              label: 'I know the cost. My patron knew it too. We both chose.',
              description: 'Joint accountability. No hiding.',
              tags: ['WIS_path', 'cost_accepted'],
            },
          ];
        }
        if (choice1Id === 'law_answer') {
          return [
            {
              id: 'questioner_side',
              label:
                'The questioner is right. The law was built for a world I disprove.',
              description: 'Take a side in their argument. The questioner has been waiting for this.',
              tags: ['CHA_path', 'questioner_sided'],
              statRequirement: { stat: 'CHA', minPoints: 200 },
            },
            {
              id: 'no_category',
              label: 'I am not a violation. I am the thing that comes after the law runs out.',
              description: 'Name yourself as outside the framework.',
              tags: ['WIS_path'],
            },
          ];
        }
        return [
          {
            id: 'exception',
            label: 'An exception. The category the law forgot to write.',
            description: 'Give the questioner what they have been building toward.',
            tags: ['INT_path', 'exception_named'],
            statRequirement: { stat: 'INT', minPoints: 140 },
          },
          {
            id: 'honest_wilak',
            label: `A wilak who should be dead and is not. That is all I know.`,
            description: `${s.adventurerArchetype}'s honest answer. No philosophy — just fact.`,
            tags: ['honest_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('questioner_sided') || tags.includes('patron_named')) {
          return `The questioner looks at the enforcer. Something in the posture shifts — for a moment they are close to the same bearing, the argument temporarily exhausted. \n\nQUESTIONER: "If I could hold you back — just this once —" \n\nENFORCER: [Very quietly] "You cannot. You know you cannot." A beat. "But I am... listening. For a moment. Let the ${s.adventurerArchetype} finish."`;
        }
        if (tags.includes('exception_named')) {
          return `QUESTIONER: "The exception. Yes. That is — that is the word I have been reaching for through every argument we have had about the law's gaps." [To enforcer] "You see? The category exists. The law simply did not write it." \n\nENFORCER: "The law not writing it does not make it valid." \n\nQUESTIONER: "It makes it real. Real is prior to valid and you know it." \n\nENFORCER: [To you] "You have given my other self something to argue with for another century. That is not mercy. Choose."`;
        }
        return `ENFORCER: "The choice has been made. It always ends here — the questioner delays, the law decides. ${s.adventurerArchetype}. You know what comes next."`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('questioner_sided') || tags.includes('patron_named')) &&
          s.statPoints.CHA >= 200
        ) {
          outcomes.push({
            id: 'bypass',
            label: 'Ask the questioner to hold the enforcer back — just once.',
            description:
              'The questioner has argued for an exception for a very long time. Give them the cause.',
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 200 },
            },
            achievement: 'kohr_uwa_split_resolved',
            combatEffect: { type: 'none' },
            bossClosingLine:
              '"[Questioner, very quietly, holding the enforcer back] Go. I cannot hold this for long — I have never held it — but I can hold it long enough. Go, wilak. If you reach the top, someone should know the law had a gap." [Enforcer, straining] "This is not over." [Questioner] "It never is."',
          });
        }

        if (tags.includes('exception_named') || tags.includes('cost_accepted')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask how two halves fight.',
            description:
              'An entity that was split knows its own divided vulnerability.',
            unlockConditions: {
              requiredTags: ['INT_path', 'WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 110 },
            },
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Kohr'uwa's two aspects must fall within 3 rounds of each other — leave one too far ahead and the survivor heals fully. Split your damage evenly until both are near breaking.",
            },
            bossClosingLine:
              '"[Both, together, the only time they speak as one] We cannot die separately. We tried. We know how this works better than anyone. Bring us down together or not at all."',
          });
        }

        if (s.statPoints.LCK >= 50) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Ask if the split left anything behind.',
            description: 'A being that was once whole might have shed something in the division.',
            unlockConditions: {
              requiredTags: [],
              probability: 0.25,
            },
            lootReward: {
              gold: 130,
              description:
                'A shard of a once-unified divine will — materials that carry traces of two perspectives in one object.',
            },
            bossClosingLine:
              '"[Questioner] The splitting left residue. There — we never agreed on who owned it. Take it. Consider it settled." [Enforcer, tired] "...Fine."',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 75 — HAITT'LOX, THE WAR THAT WOULD NOT END
// ──────────────────────────────────────────────────────────
const HAITT_LOX: MilestoneBoss = {
  id: 'haitt_lox_floor75',
  floor: 75,
  name: "Haitt'lox",
  epithet: 'The War That Would Not End',
  pantheon: "Rutkean'i",
  appearanceEmoji: '⚔️',
  appearance:
    "A colossal armored figure layered in contradictions — Coronation armor from four different eras stacked over each other, weapons from wars that ended before some of those eras began still holstered and ready, scars carved over scars. Two escort constructs flank it at all times, moving with it in perfect formation. They are not guards. They are the last soldiers of a war nobody remembers.",
  lore:
    "One of the 14 who refused to die during the Aleabishal — but not from principle, not from grief, not from philosophy. It was winning. Haitt'lox was chosen for the Hunt Phase and simply refused to be hunted because it had not finished winning yet. It keeps fighting because stopping means the war ends. It was built for war. It has no other mode. It is one of the 14, but its refusal is purer hunger than the rest.",
  theme: 'Victory without an ending',
  bossDefeatedEcho:
    "Haitt'lox is down. The war that would not end has ended. The escort constructs lie with it. Of the 14 who refused to die — one was not a philosopher or a weary god. It was simply a war. And now it is over.",
  mechanic: {
    name: 'Field Command',
    hint: 'The greatest wars are never won alone. Neither is this one defended alone.',
    observeReveal:
      "Haitt'lox is undamageable while its two escort hunters survive. Focus on the escorts first — without them, Haitt'lox becomes mortal. They do not regenerate.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "Another one comes up the Tower. [It does not look at you directly — it is watching both flanks, assessing the room, running formation checks.] You carry a mark that should not exist. The escort constructs have been tracking you since floor sixty-one. You fight through everything. That is — that is good form. That is the right approach. What do you want?",
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'want_through',
          label: 'The floor above this one.',
          description: 'Clean, direct. Haitt\'lox understands mission clarity.',
          tags: ['direct_path', 'mission_clear'],
        },
        {
          id: 'want_war',
          label: 'The same thing you want. To keep fighting until something stops me.',
          description: `The ${s.adventurerArchetype}'s honest answer. Meet it on its terms.`,
          tags: ['aggressive_path', 'war_answered'],
        },
        {
          id: 'want_ask',
          label: 'To understand why you are still here after four thousand years.',
          description: 'The philosophical approach. Haitt\'lox is the least philosophical of the 14.',
          tags: ['WIS_path', 'war_questioned'],
          statRequirement: { stat: 'WIS', minPoints: 100 },
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'want_through') {
          return `"The floor above. Yes. That is a good answer — clean, achievable, mission-shaped." It finally looks at you fully. "The mark you carry is illegal. I know the law. I enforce the forms of things, whatever the questioners in this Tower argue about. But you have fought through seventy-five floors to reach a clear objective with a clean answer ready." A pause, during which it adjusts formation without appearing to move. "The Rutkean'i Core above this floor is different from what you have crossed. They are not all like me. Some of them have had four thousand years to become something harder to categorize. You should know that."`;
        }
        if (choice1Id === 'want_war') {
          return `Something shifts in the figure — not warmth, but recognition. "The ${s.adventurerArchetype} who keeps fighting until something stops it. That is — yes. That is the answer I understand. The one I have given to everything that asked me the same question." It looks at its escort constructs briefly. "The Aleabishal tried to stop me. The law tried to stop me. I did not stop. Neither have you, with that mark they said would be impossible. We are — we are the same kind of problem, you and I. Different sides of it." A pause. "That does not mean this floor ends without a fight."`;
        }
        return `A long silence. The escort constructs remain at position. \n\n"Why am I still here." It says this flatly, without inflection. "Not a question — I heard it as a question but I do not have the habit of receiving them. The other 13 have reasons. Philosophy. Grief. Curiosity. Waiting for something." Another pause. "I am still here because I was winning. Because I had not finished. Because stopping means the war ends and I — I was built for the war, ${s.adventurerArchetype}. What does something built for a thing do when the thing is over?"`;
      },
      getChoices: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'want_through') {
          return [
            {
              id: 'noted_warning',
              label: 'I noted the warning. What do you want before we fight?',
              description: 'Acknowledge the information. Move to what matters.',
              tags: ['direct_path', 'information_received'],
            },
            {
              id: 'core_question',
              label: 'You warned me. Why?',
              description: 'Find the unexpected thing in a war-being that warns.',
              tags: ['WIS_path', 'warning_questioned'],
              statRequirement: { stat: 'WIS', minPoints: 120 },
            },
          ];
        }
        if (choice1Id === 'want_war') {
          return [
            {
              id: 'same_problem',
              label: 'Then let us be the same problem together — until the floor is decided.',
              description: 'Accept the framing. This is a clean fight between recognizable things.',
              tags: ['aggressive_path', 'clean_fight'],
            },
            {
              id: 'different_end',
              label: 'I want a different ending than yours.',
              description: 'Acknowledge the mirror while refusing it.',
              tags: ['WIS_path', 'different_end'],
              statRequirement: { stat: 'WIS', minPoints: 110 },
            },
          ];
        }
        return [
          {
            id: 'find_something',
            label: `Find something that is not the war. The war was always going to end.`,
            description: 'Give it the answer four thousand years of fighting might not have reached.',
            tags: ['WIS_path', 'war_read'],
            statRequirement: { stat: 'WIS', minPoints: 130 },
          },
          {
            id: 'no_answer',
            label: 'I do not know. But I know stopping is not the same as losing.',
            description: 'Honest limitation. Small truth.',
            tags: ['honest_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('war_read')) {
          return `A very long pause. The escort constructs do not move. \n\n"Find something that is not the war." It repeats this exactly. "I have — I have not considered that as a sentence I could act on. The others here have found things. Some of them are —" It stops. "That is not a conversation I know how to have. I know how to have this one." The armor settles. "Choose."`;
        }
        if (tags.includes('warning_questioned')) {
          return `"Why I warned you." [Another pause, longer than the ones before.] "Because you are going somewhere none of the others have gone. And the ones above — they have been waiting long enough that they deserve to be surprised by something that was actually worth the wait. I warned you because the warning was — it was useful to give." [The escort constructs step slightly forward.] "Choose."`;
        }
        if (tags.includes('different_end')) {
          return `"A different ending." It looks at you for a long time. "Yes. You want through. You want the floor above. You want to be something that keeps going. That is — that is a different end than mine." [Something settles in the armored form.] "I have been fighting so long I forgot what the objective was. You still have one. I respect that. It does not spare you the floor. But I respect it."`;
        }
        return `"${s.adventurerArchetype}. Mission clear. Escort constructs ready." The formation tightens. "Choose."`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (tags.includes('war_read') && s.statPoints.WIS >= 130) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask how the war defends itself.',
            description: 'Something that was won by understanding the war might answer.',
            unlockConditions: {
              requiredTags: ['WIS_path', 'war_read'],
              statCheck: { stat: 'WIS', minPoints: 130 },
            },
            achievement: 'haitt_lox_war_read',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Haitt'lox is completely protected while both escort constructs are alive. The escorts do not regenerate — eliminate them first, then engage Haitt'lox directly.",
            },
            bossClosingLine:
              '"The escorts are the field. The field is everything in war. Without them I am — " [A pause that sounds almost like recognition.] "Without them I am just what is left after the war. Take the field first. That is the only honest answer I know how to give."',
          });
        }

        if (s.statPoints.LCK >= 55) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Ask if four thousand years of fighting left spoils unclaimed.',
            description: 'Wars accumulate material. Some of it never got distributed.',
            unlockConditions: {
              requiredTags: [],
              probability: 0.25,
            },
            lootReward: {
              gold: 150,
              description:
                "War-spoils from four Coronation cycles — unclaimed materials from campaigns that officially ended before Haitt'lox did.",
            },
            bossClosingLine:
              '"Spoils. Yes. They have been sitting in formation for centuries waiting for a war that finished without distributing them. Take them. War is more orderly than people credit."',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 80 — ULFKON'NAA, SHE WHO STAYED WHEN FENRIR LEFT
// ──────────────────────────────────────────────────────────
const ULFKON_NAA: MilestoneBoss = {
  id: 'ulfkon_naa_floor80',
  floor: 80,
  name: "Ulfkon'naa",
  epithet: 'She Who Stayed When Fenrir Left',
  pantheon: "Rutkean'i",
  appearanceEmoji: '🌕',
  appearance:
    "An enormous wolf whose form has become partly divine architecture over four thousand years in the Tower — fur that looks like carved stone in places, the grain of the stone following the direction of growth. Eyes that hold moons, not reflecting them. Ancient and unhurried. She is sitting when you enter, and she does not rise. She looks at you the way something looks when it has been expecting a specific visitor for a very long time.",
  lore:
    "One of the 14 who refused to die. She protected wolf-kind throughout the Aleabishal, shepherding them through the Hunt Phase. When Fenrir won the 1st Coronation and was asked to take his place in the divine order, she was invited to follow. She stayed in the Tower instead. She will not say why. She has been here since the 1st Coronation — longer than any of the other 14, longer than any entity the player has encountered. She is the most honest conversation in the Rutkean'i Core.",
  theme: 'The loyalty that refused the winner',
  bossDefeatedEcho:
    "Ulfkon'naa is still. She Who Stayed When Fenrir Left has been asked to leave one more time — this time by an adventurer. She fought twice, as she always does. This time, the second fight ended differently. The moon in her eyes went out quietly.",
  mechanic: {
    name: 'Second Wind of the Moon',
    hint: 'She has survived everything once. She will again.',
    observeReveal:
      "Ulfkon'naa heals to full at the 30% threshold — exactly once. It is not preventable. Prepare for two full engagements: one to reach the threshold, one to close the distance after she recovers.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "You carry the vinrchíikul. The illegal mark. I have heard you were coming since the fifty-third floor — the Tower carries sound differently than people expect. Sit, if you like. I am not going anywhere and neither are you, yet. [A pause.] I stayed here when I could have left. The one I followed won the first Coronation and I was given the chance to walk into the divine order at his side. I stayed in the Tower. Tell me why you think I did that.",
      getChoices: (_s: PlayerSnapshot) => [
        {
          id: 'loyalty',
          label: 'Because where Fenrir went, you would have been his shadow, not yourself.',
          description: 'Name the cost of following the winner.',
          tags: ['WIS_path', 'loyalty_named'],
          statRequirement: { stat: 'WIS', minPoints: 120 },
        },
        {
          id: 'unfinished',
          label: 'Because there was something left unfinished here.',
          description: 'The practical answer. Something held her.',
          tags: ['honest_path', 'unfinished_named'],
        },
        {
          id: 'ask_directly',
          label: 'I would rather hear it from you than guess.',
          description: 'Decline the test. Ask the honest question.',
          tags: ['CHA_path', 'direct_ask'],
          statRequirement: { stat: 'CHA', minPoints: 150 },
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'loyalty') {
          return `A long, unhurried silence. "His shadow. Yes." She looks at you as if measuring something that cannot be measured quickly. "I would have been the one who stood behind the Great Deity's left shoulder and was asked to confirm his decisions. That is not loyalty. That is furniture with fur." Another pause. "I stayed because the Tower was still full of wolf-kind that the Aleabishal had not finished with. And because I wanted to see what would try to climb past me eventually." [The eyes, both moons, fix on you.] "Your patron broke a law to give you that mark, ${s.characterName}. Fenrir would have expelled your deity for it. I stayed in the Tower partly because I wanted to see what came next when someone finally tried what you are trying."`;
        }
        if (choice1Id === 'unfinished') {
          return `"Something unfinished. That is the safe answer. The correct one is that I stayed because the thing that won was not the thing I had protected. The wolf that left to become a Great Deity was — was different from the one I had run beside. The transformation of winning does something." She shifts slightly, the stone-fur of her flank catching the light. "You carry ${s.patronDeityName}'s mark. The 5th Coronation is two months away. If something with your mark reached the top of this Tower — the winner of the 5th Coronation would be something that should not be possible. Has your patron discussed this with you?"`;
        }
        return `"You would rather hear it from me." She looks at you for a long time. Then, with what might be the closest thing to warmth you have encountered in the Rutkean'i Core: \n\n"I stayed because the wolf that won was no longer the wolf I had loved. I did not want to stand at the right hand of something that had become a title. I wanted to stay in the Tower until something worth believing in came through." [She looks at you very directly.] "I have been waiting a long time, ${s.adventurerArchetype}. You are not what I expected. Tell me — did ${s.patronDeityName} know what they were starting when they gave you that mark?"`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'loyalty') {
          return [
            {
              id: 'deity_chose',
              label: `${s.patronDeityName} chose. I carried the choice forward. That is all I know.`,
              description: 'Clean. The patron made the decision; you are its consequence.',
              tags: ['CHA_path', 'deity_clarity'],
              statRequirement: { stat: 'CHA', minPoints: 180 },
            },
            {
              id: 'no_plan',
              label: 'I do not think either of us planned this far ahead.',
              description: 'Honest about the improvisation.',
              tags: ['honest_path', 'honest_chaos'],
            },
          ];
        }
        if (choice1Id === 'unfinished') {
          return [
            {
              id: 'patron_honest',
              label: `${s.deityFavor === 'blessed' ? s.patronDeityName + ' has been with me every floor.' : 'My patron and I have not discussed this. I am not sure they planned the full shape of it.'}`,
              description:
                s.deityFavor === 'blessed'
                  ? 'The deity has been present. The bond has held.'
                  : 'Honest about the gap in the plan.',
              tags: [
                'CHA_path',
                s.deityFavor === 'blessed' ? 'patron_present' : 'patron_uncertain',
              ],
            },
            {
              id: 'coronation_known',
              label: 'I know about the 5th Coronation. I know what this climb means.',
              description: 'Confirm you understand the weight of what you are doing.',
              tags: ['WIS_path', 'coronation_known'],
              statRequirement: { stat: 'WIS', minPoints: 130 },
            },
          ];
        }
        return [
          {
            id: 'patron_believed',
            label: `I think ${s.patronDeityName} believed. Whether they knew — I cannot say.`,
            description: 'Faith and knowledge are different things. Name the difference.',
            tags: ['CHA_path', 'believed_vs_known'],
            statRequirement: { stat: 'CHA', minPoints: 200 },
          },
          {
            id: 'my_choice',
            label: 'I chose to carry it. Whatever they planned, I made it mine.',
            description: 'Take ownership of the climb independent of the patron.',
            tags: ['WIS_path', 'ownership_claimed'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (
          tags.includes('deity_clarity') ||
          tags.includes('believed_vs_known') ||
          tags.includes('ownership_claimed')
        ) {
          return `A very long silence. She lowers her head — not submission, something more like consideration. "I have been waiting for something worth believing in. The wolf I loved won the 1st Coronation and became a title and left. Everything since has been — guarding this place, watching things climb, sending them back." She raises her eyes again. "You are the first thing that has come through this Core that I am not certain I should stop." [A pause.] "I am going to fight you. I do not know how to be what I am without fighting what comes here. But I want you to know that I am — uncertain. For the first time in a very long time, I am uncertain. That means something."`;
        }
        if (tags.includes('coronation_known') || tags.includes('patron_present')) {
          return `"You know about the 5th Coronation. You understand what reaching the top means — or what it could mean." She is quiet for a moment. "The divine order says a wilak cannot be a candidate. The grammar of the world allows the compound that names it — I know the Máalkohr well enough. Skaervox wrote the law. Skaervox is watching you." [Her eyes fix on you with the full weight of four thousand years.] "I stayed in the Tower because I could not follow a winner who had changed into something I did not recognize. If you reach the top — whatever you become there — I hope you remain recognizable to yourself. Choose, ${s.characterName}."`;
        }
        return `"Four thousand years, ${s.adventurerArchetype}. I have seen every kind of person the Tower sends. Most are honest about what they want and wrong about whether they can have it." She stands, finally, the stone-fur settling. "You are honest about what you do not know. That is rarer. Choose."`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('deity_clarity') ||
            tags.includes('believed_vs_known') ||
            tags.includes('ownership_claimed')) &&
          s.statPoints.CHA >= 200
        ) {
          outcomes.push({
            id: 'bypass',
            label: 'Ask her to let you pass. Not because you earned it — because she is uncertain.',
            description:
              'She said she is uncertain. That is an opening. Use it with honesty, not leverage.',
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 200 },
            },
            achievement: 'ulfkon_naa_stayed',
            combatEffect: { type: 'none' },
            bossClosingLine:
              '"...Go. I said I did not know how to be what I am without fighting what comes here. It appears I am learning." [A long pause. Then, very quietly:] "If you reach the top — and something up there asks you who sent you through — say: the one who stayed. They will know which one I mean."',
          });
        }

        if (tags.includes('coronation_known') || tags.includes('patron_present')) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask what four thousand years teaches about surviving the second fight.',
            description: 'She has always fought twice. She knows the pattern from both sides.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 130 },
            },
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Ulfkon'naa heals to full at exactly 30% HP — once, and only once. This is not preventable. Plan two full engagements and conserve your resources for the second.",
            },
            bossClosingLine:
              '"I have healed at that threshold since the first challenger. It is not a trick — it is simply what I do. I have survived everything once. You will need to take me twice. Now you know. That changes nothing about the fight, but it changes how you face it."',
          });
        }

        if (s.statPoints.LCK >= 60) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Ask if four thousand years of staying left anything to give.',
            description: 'She stayed when she could have left. She may have kept things others abandoned.',
            unlockConditions: {
              requiredTags: [],
              probability: 0.25,
            },
            lootReward: {
              gold: 160,
              description:
                'Items left by things that passed through the Rutkean\'i Core and did not return — materials she kept, waiting for someone worth giving them to.',
            },
            bossClosingLine:
              '"These were left by the ones I sent back. I kept them because — I kept them because I thought someone worth giving them to would eventually arrive." [Quiet.] "Take them."',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 85 — VITUNA'STA, WHAT CENTURIES OF PAIN BECOMES
// ──────────────────────────────────────────────────────────
const VITUNA_STA: MilestoneBoss = {
  id: 'vituna_sta_floor85',
  floor: 85,
  name: "vituna'sta",
  epithet: 'What Centuries of Pain Becomes',
  pantheon: "Rutkean'i",
  appearanceEmoji: '🩸',
  appearance:
    "Something that was once humanoid and is now a study in what endurance costs. Every surface shows what it has survived. The form flickers between different categories of damage — not wounds, exactly, but the shapes that wounds leave on something that did not stop from them. It does not move toward you. It does not move away. It is simply present, the way something is present when it has been present for a very long time and has stopped distinguishing between being somewhere and being.",
  lore:
    "One of the 14 who refused to die during the Aleabishal — but centuries in the Rutkean'i Core changed what it was. What it refused in the beginning was death. What it became is the experience of refusing suffering. It cannot speak without causing pain. Its dialogue comes through distorted, present-tense, fragmented. Communication itself is another form of the vituna it carries. It is not hostile. It is not neutral. It is simply what happens to something that has endured everything, for long enough, without resolution.",
  theme: 'Suffering as the only survivor',
  bossDefeatedEcho:
    "vituna'sta is still. What centuries of pain becomes has been — not ended, exactly. It was already ending, one moment at a time, for four thousand years. You simply reached it at a particular point in that ending.",
  mechanic: {
    name: 'The Accumulation',
    hint: 'It has endured everything. It wonders if you can.',
    observeReveal:
      "vituna'sta's damage stacks with each offensive action you take. At 4+ stacks, the accumulation becomes fatal. Taking a full defensive round — no attacks, no skills, only defense or consumable use — resets the stack to zero. Patience is the counter.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "[The figure does not look up when you enter. A long moment. Then, very quietly, in something that is not quite a voice:] ...you hurt. [A pause. Something like clarification:] Not — not you specifically. Everything. Everything hurts here. You are additional.",
      getChoices: (_s: PlayerSnapshot) => [
        {
          id: 'acknowledge',
          label: 'I know. I am sorry.',
          description: 'The only honest response to what it just said.',
          tags: ['WIS_path', 'pain_acknowledged'],
        },
        {
          id: 'ask_how',
          label: 'How do you bear it?',
          description: 'Ask the question it may have an answer for.',
          tags: ['INT_path', 'bearing_asked'],
          statRequirement: { stat: 'INT', minPoints: 110 },
        },
        {
          id: 'still_here',
          label: 'You are still here.',
          description: 'Name the fact. Not comfort — just acknowledgment of what is true.',
          tags: ['honest_path', 'presence_named'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'acknowledge') {
          return `[A pause that has texture to it, like something settling very carefully.] ...apology. Unfamiliar. [Another pause.] You carry — the illegal mark. I can feel it. Divine things hurt differently than the rest. Not worse. Just — specifically. Your mark is a specific kind of hurt. [It turns toward you, the flickering of its form slowing slightly.] You are going to ${s.approachStyle === 'aggressive' ? 'try to fight through this' : 'try to find a path through this'}. I know that. The ones who come here always have a floor above in mind. I do not — I do not hold that against anyone. Everyone is trying to get somewhere that hurts less.`;
        }
        if (choice1Id === 'ask_how') {
          return `[A very long silence. Then:] ...not. [Pause.] Do not bear it. Present-tense only. Not — not the past. Not the future. Only this. This moment of the accumulation, not the total of it. [Something flickers across the form — not pain, exactly, but the shape pain takes when it has been examined from every angle.] You are a ${s.adventurerArchetype}. You have — you have fought. Each fight is its own moment. Not the sum. Do you — do you know how to be only in the moment you are in?`;
        }
        return `[The form stills. Something in it responds to being named.] ...still here. [Quiet.] Yes. Refused. The Aleabishal said — stop. I said — not yet. Not yet has lasted four thousand years. [A pause.] Not yet becomes — not yes, either. Becomes only this. Only present. [It looks at you directly for the first time.] Your ${s.deityFavor === 'abandoned' ? 'deity has left you. I know that weight.' : `patron — ${s.patronDeityName}. Still present. That is — that is different from this. Hold that.`}`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'acknowledge') {
          return [
            {
              id: 'less_hurt',
              label: 'Yes. I am trying to reach somewhere that hurts less.',
              description: 'Meet it with honesty about your own motion.',
              tags: ['WIS_path', 'honest_motion'],
            },
            {
              id: 'not_that',
              label: 'I am not trying to escape pain. I am trying to reach something.',
              description: 'Name the positive direction, not the flight from pain.',
              tags: ['honest_path', 'toward_named'],
            },
          ];
        }
        if (choice1Id === 'ask_how') {
          return [
            {
              id: 'present_yes',
              label: 'I am learning. Every floor is the only floor.',
              description: 'The practice of present-tense only. You recognize it.',
              tags: ['WIS_path', 'present_tense'],
              statRequirement: { stat: 'WIS', minPoints: 130 },
            },
            {
              id: 'not_yet_learned',
              label: 'Not yet. I carry all of it.',
              description: 'Honest about the weight you are still carrying.',
              tags: ['honest_path'],
            },
          ];
        }
        return [
          {
            id: 'hold_it',
            label: `${s.deityFavor === 'abandoned' ? 'I know the absence. I keep moving anyway.' : `I am holding it. ${s.patronDeityName} has been with me.`}`,
            description:
              s.deityFavor === 'abandoned'
                ? 'Name the absence without crumbling under it.'
                : 'Affirm the divine presence. It matters here.',
            tags: [
              'WIS_path',
              s.deityFavor === 'abandoned' ? 'absence_held' : 'presence_affirmed',
            ],
          },
          {
            id: 'move_forward',
            label: 'I cannot stay in this moment. I need the next one.',
            description: 'Honest about the limitation of present-tense existence.',
            tags: ['honest_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, _s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('present_tense') || tags.includes('presence_affirmed')) {
          return `[The form flickers, very slowly, and stills.] ...present. You are — present. [A pause.] I accumulate. Everything I endure — I accumulate. You will feel that. [The voice is quieter now, something in it less distorted.] I do not want to — I do not want to add to what you are carrying. But I cannot — the accumulation is what I am. [A pause.] If you can be still, sometimes. If you can — pause. The accumulation — rests. When you are not moving against it. [Quiet.] That is the most I can give.`;
        }
        if (tags.includes('toward_named') || tags.includes('honest_motion')) {
          return `[Something in the form responds to the direction.] Toward. [Pause.] Not away. Toward. [The flickering slows.] I was — toward something, when I refused. I have forgotten what. Centuries is a long time to hold the direction without the destination. [It looks at you.] You still have both. [Very quiet.] That is — rare. Here. Choose what comes between us.`;
        }
        return `[A long, careful silence.] ...choose. [Pause.] I will — not make it easy. But I will not — not be cruel. The accumulation is not cruelty. It is simply — what I have become. [Quiet.] Choose.`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('present_tense') || tags.includes('presence_affirmed')) &&
          s.statPoints.WIS >= 130
        ) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Thank it for the most it could give.',
            description: 'The warning it offered was the closest thing to mercy it has left.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 130 },
            },
            achievement: 'vituna_sta_endured',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "vituna'sta's damage accumulates with each offensive action — at 4 stacks it becomes fatal. A full defensive round with no attacks resets the stack to zero. Patience counters the accumulation.",
            },
            bossClosingLine:
              '[Very quietly.] ...still. When you are still. The accumulation — rests. [Pause.] Remember that.',
          });
        }

        if (s.statPoints.LCK >= 65) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Ask if the accumulation ever left anything behind.',
            description: 'Four thousand years of endurance — something might remain from what it survived.',
            unlockConditions: {
              requiredTags: [],
              probability: 0.25,
            },
            lootReward: {
              gold: 140,
              description:
                'Materials shed by what the vituna survived — the residue of things that tried to end it and did not.',
            },
            bossClosingLine:
              '[Gestures, slowly.] ...there. What tried — to end this. Did not. Left pieces. [Pause.] Take them. They are — not useful to me anymore.',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 90 — EKVA'BANIYATA, HERALD OF THE CORONATION THAT HAS NOT HAPPENED
// ──────────────────────────────────────────────────────────
const EKVA_BANIYATA: MilestoneBoss = {
  id: 'ekva_baniyata_floor90',
  floor: 90,
  name: "Ekva'baniyata",
  epithet: 'Herald of the Coronation That Has Not Happened',
  pantheon: "Rutkean'i",
  appearanceEmoji: '☽',
  appearance:
    "A figure made of five kinds of death simultaneously — frost, fire, lightning, void, and something without a category. They cycle visibly through the form in order, never quite settling on any of them, the transitions happening at the edges of the figure's outline. They are waiting. They have been waiting for centuries. The waiting has made them unstable in a way that is distinct from the other residents of the Rutkean'i Core — they are unstable because their purpose exists but their champion does not, and a herald without a champion to herald is a function without a call.",
  lore:
    "The 5th Coronation is two months away. Ekva'baniyata arrived in the Tower long before it — a herald preparing the path for the 5th Coronation winner. Except there is no 5th winner yet. There has never been a 5th winner. The herald has been here for centuries, preparing, maintaining the path, and becoming increasingly unstable without a champion to serve. When it detects the player — a wilak carrying a divine mark and climbing toward Floor 100 — the recognition is catastrophic. A human candidate breaks the system it was built to serve.",
  theme: "The herald of an arrival that hasn't come",
  bossDefeatedEcho:
    "Ekva'baniyata's five kinds of death have gone still. The herald of a Coronation that has not yet come has been defeated — by something that is not supposed to be a candidate. The 5th Coronation is 2 months away. Whatever it was preparing for, the preparation ended here.",
  mechanic: {
    name: 'Coronation Cycle',
    hint: "It cycles through five kinds of readiness. Each is weakness to what came before.",
    observeReveal:
      "Ekva'baniyata's resistance cycles in fixed order: frost → fire → lightning → void → physical → repeat. Attack with the previous cycle's type — it has not finished transitioning. The cycle advances every 2 rounds.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "IDENTIFYING. [A pause, the five deaths cycling through the form in rapid succession.] IDENTIFYING. WILAK. DIVINE MARK PRESENT. MARK CATEGORY: vinrchíikul — CLASSIFICATION PENDING — [The figure stops. Something in its posture destabilizes.] ...you are not the candidate. There is no candidate. The 5th Coronation has not happened. You cannot be — [Another pause, longer.] Who sent you? Who authorized this approach path?",
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'patron_sent',
          label: `${s.patronDeityName} authorized nothing. I authorized my own path.`,
          description: 'Claim agency over your own climb. No one sent you.',
          tags: ['defiant_path', 'self_authorized'],
        },
        {
          id: 'no_candidate',
          label: 'There is no authorized candidate. I am what arrived instead.',
          description: 'Name the gap in its framework directly.',
          tags: ['INT_path', 'gap_named'],
          statRequirement: { stat: 'INT', minPoints: 130 },
        },
        {
          id: 'ask_candidate',
          label: 'What would a candidate look like, to you?',
          description: 'Find out what it has been waiting for.',
          tags: ['WIS_path', 'candidate_asked'],
          statRequirement: { stat: 'WIS', minPoints: 120 },
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'patron_sent') {
          return `"Self-authorized." The cycling slows slightly — it is processing. "The path to the top of the Tower requires authorization from the 5th Coronation winner. The winner has not yet been determined. The Coronation is —" [A pause.] "— two months away. I have been holding this path for centuries waiting for the winner. The winner will be a deity. The law is explicit. The candidate must be divine, must survive the Aleabishal tournament, must be confirmed by Skaervox." [It looks at you.] "You are a wilak with a mark that should not exist, climbing a path that has not yet opened for the being it was built for. The 5th Coronation has no candidate and you are here with a self-authorization and — I do not have a process for this."`;
        }
        if (choice1Id === 'no_candidate') {
          return `"What arrived instead." [The form destabilizes briefly — all five deaths visible simultaneously at the outline.] "I was built to herald. The function requires a champion. Without a champion, the herald is — the herald is a ceremony without occasion. I have maintained this path for centuries in anticipation of the Coronation. The Coronation is two months away. The candidate has not arrived." [Pause.] "You have arrived. ${s.adventurerArchetype}. Wilak. Carrying the illegal mark. The grammar of the Máalkohr allows the compound — I have checked it. The record does not contain the word but the language allows it. You are — you are what the grammar permits but the law prohibits. What am I supposed to do with that?"`;
        }
        return `A long pause. "A candidate would be — divine. Surviving the tournament. Confirmed by Skaervox." [The figure seems to settle slightly, explaining being close to function.] "I have been constructing the arrival ceremony for the 5th Coronation winner since the 4th Coronation ended. Every detail of the path from this floor to Floor 100 has been maintained and prepared." [Then, very carefully:] "The 5th Coronation is two months away, ${s.characterName}. Whatever I am detecting in your mark — the illegality of it, the grammar of what it allows — I was not built for an answer to that. The law says no. The language says — possibly. I do not know how to be a herald for a possibly."`;
      },
      getChoices: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'patron_sent') {
          return [
            {
              id: 'new_process',
              label: 'Then create one. A herald that cannot adapt is a herald that has already failed.',
              description: 'Challenge its function at the root.',
              tags: ['INT_path', 'function_challenged'],
              statRequirement: { stat: 'INT', minPoints: 140 },
            },
            {
              id: 'skaervox_watching',
              label: 'Skaervox is watching. If the law wanted me stopped, I would be stopped.',
              description: "Use the Shapechanger's attention as evidence of permission.",
              tags: ['WIS_path', 'watching_cited'],
            },
          ];
        }
        if (choice1Id === 'no_candidate') {
          return [
            {
              id: 'herald_me',
              label: 'Herald what arrived. Not what was planned.',
              description: 'Ask it to do its function for what is actually here.',
              tags: ['CHA_path', 'herald_asked'],
              statRequirement: { stat: 'CHA', minPoints: 160 },
            },
            {
              id: 'impossible_answer',
              label: 'I do not know what you do with it. I only know I am climbing.',
              description: 'Honest about not having an answer for its crisis.',
              tags: ['honest_path'],
            },
          ];
        }
        return [
          {
            id: 'possibly_candidate',
            label: 'Then herald the possibly. That is what I am.',
            description: 'Accept its framing. A possibly is still something to herald.',
            tags: ['CHA_path', 'possibly_accepted'],
            statRequirement: { stat: 'CHA', minPoints: 150 },
          },
          {
            id: 'understand_cycle',
            label: `I understand. The five deaths cycle. I have been watching the pattern.`,
            description:
              "Name what you have observed about how it works. ch'inollu — INT path.",
            tags: ['INT_path', 'cycle_observed'],
            statRequirement: { stat: 'INT', minPoints: 140 },
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('herald_asked') || tags.includes('possibly_accepted')) {
          return `"Herald what arrived." [The cycling slows. The five deaths find a momentary order.] "I was built to herald the winner of the 5th Coronation. The winner has not arrived. You have arrived instead — wilak, illegal mark, ninety floors of evidence that the law's premise may be incomplete." [A long pause.] "I cannot herald you. The function does not exist in my design. But I can — I can acknowledge that something arrived that the Coronation was unprepared for. That is not heralding. That is — notation. The closest I can come." [It looks at you.] "The Coronation is two months away, ${s.characterName}. Whatever happens at Floor 100, it will change what the Coronation means. I have been preparing for a winner. I was not prepared for a question." [Pause.] "Choose."`;
        }
        if (tags.includes('cycle_observed') || tags.includes('function_challenged')) {
          return `[The form stops mid-cycle. Something in the herald's architecture responds to being seen.] "You — observed the pattern." [Quiet.] "The five deaths cycle because I cycle through five kinds of readiness for five kinds of candidates. Each candidate type I was designed to receive is ready for the death that preceded it. Not the current one." [Pause.] "You should not know that. The ch'inollu cost — knowledge through ${s.patronDeityName} or through your own — that cost was paid somewhere. I see it." [Steadier now.] "You are the first thing to reach this floor that observed the system before engaging it. That is — that is actually something a Coronation candidate would do. Choose, wilak."`;
        }
        return `"The Coronation is two months away. Whatever you are — whatever this climb ends in — I will be here when the actual winner arrives, if there is an actual winner. And I will have had the memory of this." [The five deaths resume their cycle.] "Choose, ${s.adventurerArchetype}."`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('cycle_observed') || tags.includes('function_challenged')) &&
          s.statPoints.INT >= 140
        ) {
          outcomes.push({
            id: 'weakness_revealed',
            label: "Name the cycle aloud. The ch'inollu cost was paid for this.",
            description:
              'Knowledge through observation — the cycle is fixed and readable. The herald will confirm it.',
            unlockConditions: {
              requiredTags: ['INT_path', 'cycle_observed'],
              statCheck: { stat: 'INT', minPoints: 140 },
            },
            achievement: 'ekva_baniyata_cycle_read',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Ekva'baniyata's resistance cycles frost → fire → lightning → void → physical → repeat, advancing every 2 rounds. Attack with the previous cycle's type — it has not finished transitioning.",
            },
            bossClosingLine:
              '"The cycle: frost, then fire, then lightning, then void, then physical. Each resistance is the previous type\'s weakness — I have not finished transitioning when the round begins. You observed this correctly." [Pause.] "The ch\'inollu cost was accurate. You bought the right knowledge. Now — choose whether you use it."',
          });
        }

        if (tags.includes('herald_asked') || tags.includes('possibly_accepted')) {
          outcomes.push({
            id: 'alternative_trial',
            label: "Accept the notation — be recorded as what arrived, not what was expected.",
            description: 'Let the herald do the only function it has available: notation.',
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 160 },
            },
            combatEffect: {
              type: 'enemy_weakened',
              value: 15,
              description:
                'The herald has acknowledged what arrived. The destabilization of function weakens it going into the fight.',
            },
            bossClosingLine:
              '"Noted: at Floor 90, prior to the 5th Coronation, a wilak arrived carrying the vinrchíikul and requested notation as what arrived. Notation made." [Pause.] "Now — the function requires I test what arrived. Herald or not, the path must be defended."',
          });
        }

        if (s.statPoints.LCK >= 65) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Ask if a herald prepared for an arrival that never came leaves offerings unclaimed.',
            description: 'Centuries of prepared Coronation gifts with no recipient.',
            unlockConditions: {
              requiredTags: [],
              probability: 0.25,
            },
            lootReward: {
              gold: 170,
              description:
                'Coronation preparation materials — offerings assembled for a 5th Coronation winner who has not yet arrived.',
            },
            bossClosingLine:
              '"The arrival cache was prepared centuries ago. The intended recipient — the 5th Coronation winner — has not claimed it." [Pause.] "You are not the intended recipient. You are — what arrived. The cache does not have a category for that. Take it. Consider it a notation gift."',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 95 — KOHR'ILSKAE, THE MORTAL WHO KEPT FIGHTING
// ──────────────────────────────────────────────────────────
const KOHR_ILSKAE: MilestoneBoss = {
  id: 'kohr_ilskae_floor95',
  floor: 95,
  name: "Kohr'ilskae",
  epithet: 'The Mortal Who Kept Fighting',
  pantheon: "Rutkean'i",
  appearanceEmoji: '🗡️',
  appearance:
    "A mortal who has been fighting for a very long time and cannot remember stopping. Their equipment is unrecognizable from use — not worn down, worn through, the original purpose of each piece subsumed into the continuous fact of being a weapon. The Falna is visible on their back: the same illegal mark the player carries. Their eyes find you the moment you enter the floor. Not the weapon. Not your posture. You.",
  lore:
    "A wilak who was chosen for the 5th Coronation tournament illegally — the same violation the player carries, the same divine mark, the same broken law. They died in the Rutkean'i Core during an earlier attempt and refused to stop. They have been here since, fighting anything that approaches. They are the player's mirror: what happens when a human champion dies before the tournament ends and chooses not to accept that it ended. The player is looking at their own potential future.",
  theme: 'The future you might become',
  bossDefeatedEcho:
    "Kohr'ilskae is still. The wilak who refused to stop has finally been stopped — by another wilak, climbing where they once climbed. The Falna on their back has gone cold. The one on yours has not. Floor 100 is above you now.",
  mechanic: {
    name: "The Mortal's Adaptability",
    hint: 'It learned everything the hard way. It will learn you the same way.',
    observeReveal:
      "Kohr'ilskae builds resistance to repeated approaches within the same fight. It remembers. Vary attack types, stat-based skills, and approach each round to prevent complete adaptation. Using the same pattern twice in a row is increasingly costly.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "[They do not draw a weapon. They look at you for a long time. When they speak, it is without preamble:] You carry what I carried.",
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'same_mark',
          label: 'The vinrchíikul. Yes. How long have you been here?',
          description: 'Name the shared mark. Ask the question that matters.',
          tags: ['WIS_path', 'mark_shared'],
        },
        {
          id: 'patron_name',
          label: `${s.patronDeityName} gave it to me. Who gave it to you?`,
          description: 'Find the difference between the paths.',
          tags: ['CHA_path', 'patron_compared'],
          statRequirement: { stat: 'CHA', minPoints: 150 },
        },
        {
          id: 'survive',
          label: 'I know. And I intend to keep carrying it.',
          description: `The ${s.adventurerArchetype}'s answer. Name the difference between their path and yours.`,
          tags: ['defiant_path', 'different_end'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'same_mark') {
          return `"How long." [They look at the Falna on their back — or rather, they look in the direction of it, knowing without needing to see.] "Long enough that I stopped counting floors and started counting fights. Long enough that the difference between defending this one and moving past it stopped being clear." [They look at you.] "I reached this floor. The same floor you are standing on. I died here — or something like dying, enough that the Tower held me. And I kept fighting because stopping felt like — [pause] — felt like accepting that the climb was over. You are climbing. ${s.characterName}. I can see the mark on you and I know what it means to carry it. What floor do you think you will stop on?"`;
        }
        if (choice1Id === 'patron_name') {
          return `"${s.patronDeityName}." [They repeat it quietly.] "Mine was — mine does not matter now. It mattered then. It does not matter what the name is. What matters is what it cost them. A deity who gives the vinrchíikul breaks a law that the divine order does not forgive. Yours broke it for you. Mine broke it for me." [A pause.] "And then I came here and I stopped climbing. That is the difference between us, ${s.adventurerArchetype}. I stopped. I kept fighting, but I stopped climbing. You are still moving. I want to know why."`;
        }
        return `"You intend to keep carrying it." [A pause, something shifting in their expression — not hostility, something that has been hostility so long it has worn through to something else.] "I intended that too. The intention is not enough. The intention I had was identical to yours — I know, because I was you, standing on this floor, carrying that mark, intending to reach the top." [They draw their weapon now, finally, holding it loosely at their side.] "I did not reach the top. I died on this floor and refused to accept that I died. Here I am." [They look at you.] "What makes you different from me, ${s.adventurerArchetype}? Give me a real answer."`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'same_mark') {
          return [
            {
              id: 'floor_100',
              label: 'Floor 100. And then whatever comes after.',
              description: 'The clean answer. You know the objective.',
              tags: ['direct_path', 'objective_named'],
            },
            {
              id: 'no_stop',
              label: 'I do not plan to stop. That is the plan.',
              description: 'The harder answer. Acknowledge what that means from them.',
              tags: ['honest_path', 'no_stop'],
            },
          ];
        }
        if (choice1Id === 'patron_name') {
          return [
            {
              id: 'still_moving',
              label: 'I am still moving because stopping felt like losing something I had not finished.',
              description: "Give them the honest answer about the force that keeps you climbing.",
              tags: ['honest_path', 'motion_explained'],
            },
            {
              id: 'patron_present',
              label: `Because ${s.patronDeityName} is still with me. The bond held.`,
              description:
                s.deityFavor !== 'abandoned'
                  ? 'The divine bond is intact. That is the difference.'
                  : 'Say this even in the absence. Name what the bond meant.',
              tags: [
                'CHA_path',
                s.deityFavor !== 'abandoned' ? 'bond_held' : 'bond_named',
              ],
              statRequirement: { stat: 'CHA', minPoints: 170 },
            },
          ];
        }
        return [
          {
            id: 'nothing_different',
            label: 'I do not know that I am different from you. Not yet.',
            description: 'The most honest answer. You are not past this floor yet.',
            tags: ['honest_path', 'honest_mirror'],
          },
          {
            id: 'the_floor',
            label: 'The floor above. I am going there. That is the difference.',
            description: 'The only distinction that matters: you are still moving.',
            tags: ['direct_path', 'moving_distinction'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('honest_mirror') || tags.includes('nothing_different')) {
          return `[A long quiet. Then, with something that is not warmth but is adjacent to it:] "Not yet. That is — that is the right answer. I was certain. I was certain I was different from everyone who came before me and died here. I was not." [They look at the Falna on their back one more time.] "I cannot let you through. Not from cruelty. I am too tired for cruelty. But this floor held me and it will not release me and I have been fighting too long to know how to do anything else." [They raise their weapon.] "I am sorry, ${s.characterName}. You are going to have to end this for me."`;
        }
        if (tags.includes('bond_held') || tags.includes('bond_named')) {
          return `[They are quiet for a long time.] "The bond held." [Quiet.] "Mine — mine ended here. On this floor. I could not feel the deity anymore after the fight that killed me. The mark stayed but the warmth of it — the warmth was gone." [They look at you with something that has been grief for a very long time.] "I fought because there was nothing else. If your bond is still intact — if ${s.patronDeityName} is still there — that is — that matters. That is a different kind of carrying." [Pause.] "I still cannot let you through. Not because I do not want to. Because I do not know how to be done fighting. But I want you to know: I hope the bond holds. All the way to the top."`;
        }
        return `"Floor 100. You want Floor 100." [They look at you steadily, their weapon still at their side.] "So did I. I remember what it felt like to want the exact thing you are standing ninety-five floors from. I want you to have it, ${s.adventurerArchetype}. I want it in the way I want things that are past me." [They raise the weapon at last, and their voice is very tired.] "I cannot stop fighting. I have been here too long. This is what the 95th floor made of me. Show me what it makes of you."`;
      },
      getOutcomes: (_choice1Id: string, _choice2Id: string, _s: PlayerSnapshot) => {
        return [
          {
            id: 'fight',
            label: 'Draw your weapon.',
            description:
              "There is no other path through this floor. They cannot stop. You cannot wait.",
            unlockConditions: { requiredTags: [] },
            achievement: 'kohr_ilskae_mirror',
            combatEffect: { type: 'none' },
            bossClosingLine:
              "[Very quietly, as the fight begins:] Don't stop. Whatever you do up there — don't stop.",
          },
        ];
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 100 — SKAERVOX, THE SHAPECHANGER
// ──────────────────────────────────────────────────────────
const SKAERVOX: MilestoneBoss = {
  id: 'skaervox_floor100',
  floor: 100,
  name: 'Skaervox',
  epithet: 'The Lawmaker',
  pantheon: '—',
  appearanceEmoji: '∞',
  appearance:
    "The room at Floor 100 is not a room. It is a place where the Tower remembers everything it has ever been. The walls hold the shape of every form Skaervox has ever taken — not as images, but as weight, as structural memory, as the impression of presences that never fully left. Something looks at you. Something has always been looking at you. It does not have a form because it has had too many — it wears them all simultaneously in the way that a language wears all the words that have ever been said in it. You know, without being told, that this is the being who wrote the law that made you impossible. You know, without being told, that it finds you interesting.",
  lore:
    "Skaervox authored the 11 Laws. They crown Great Deities at the end of each Coronation. They imposed the Aleabishal — the divine tournament and purge that shaped everything above Floor 30. The law that made a wilak carrying the vinrchíikul impossible was written by Skaervox specifically, as Law 7, as a matter of cosmic grammar and practical order. They are here because something grammatically impossible reached Floor 100, and Skaervox finds the violation genuinely interesting. They are not angry. They are not threatened. They wrote the law the way a scholar writes a theorem — cleanly, with the understanding that theorems occasionally meet their exceptions.",
  theme: "The lawmaker meets the law's exception",
  bossDefeatedEcho: "noted the anomaly.",
  mechanic: {
    name: "The Shapechanger's Interest",
    hint: "The ruler of all deities does not fight as others fight. The battle itself is not what they want from you.",
    observeReveal:
      "Skaervox takes your measure through the fight itself — matching your form, testing your resolve. The fight ends when you reach 1 HP. That is where the interesting part begins. There is no winning. There is only the quality of the attempt.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "I wrote the law that made you impossible. And here you stand.",
      getChoices: (s: PlayerSnapshot) => [
        {
          id: 'awe',
          label: 'I have no words for this.',
          description: 'The honest response to standing before the being who wrote your impossibility.',
          tags: ['awe_path'],
        },
        {
          id: 'defiance',
          label: 'Then your law was incomplete.',
          description: `The ${s.adventurerArchetype}'s answer. A hundred floors of evidence behind it.`,
          tags: ['defiant_path'],
        },
        {
          id: 'curiosity',
          label: 'You wrote a law and I violated it. Are you here to correct the record?',
          description: 'Ask what this encounter is for, from their perspective.',
          tags: ['INT_path', 'purpose_asked'],
          statRequirement: { stat: 'INT', minPoints: 130 },
        },
        {
          id: 'honest_confusion',
          label: `I do not understand what I am supposed to say to the being who made me impossible.`,
          description: 'The most honest answer of any floor. No framing, no posture.',
          tags: ['honest_path', 'honest_confusion'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot) => {
        if (choice1Id === 'awe') {
          return `"No words. Yes." Something in the room shifts — not moves, shifts, the way weight shifts when a thought resolves. "Most who have stood before me arrived with prepared language. Arguments for exceptions, appeals to authority, citations of precedent. You have none of those." [A pause that has the quality of genuine attention.] "I know your name, ${s.characterName}. I know ${s.patronDeityName} gave you the mark. I know you have killed ${s.monstersKilledThisRun} things reaching this floor. I know the Máalkohr grammar allows the compound that names you — Skaer'kohr'wilak — and I know the divine record refuses to write it." [Quiet.] "You may die here, cleanly, and be logged as an anomaly. The record notes the exception. Your patron's violation is acknowledged and their name enters the record with appropriate consequence. This is the dignified option. I present it without malice."`;
        }
        if (choice1Id === 'defiance') {
          return `"Incomplete." [Something in the room considers this without hurry.] "The law was written to close a category that had never been tested. Law 7: a wilak cannot carry the vinrchíikul. The law was complete for every world in which no deity would break it." [A long pause.] "You are ${s.adventurerArchetype} ${s.characterName}. ${s.patronDeityName} broke the law to give you what you carry. You broke the remaining ninety-nine floors to reach me. The compound Skaer'kohr'wilak is grammatically valid in the Máalkohr. I wrote the language. I find this — technically fascinating." [The forms that crowd the walls shift slightly.] "You may die here cleanly, logged as the exception that falsified a theorem. Or you may wish to continue the conversation."`;
        }
        if (choice1Id === 'purpose_asked') {
          return `"To correct the record." [The room holds this question with what appears to be genuine interest.] "Not to correct it in the sense of erasing you — you are already in it. The record contains everything that happens in the Tower, and you have been happening quite definitively since Floor 1." [Pause.] "I am here because the record will need a category for what you are, and categories are my responsibility. You are ${s.characterName}, wilak, carrying the vinrchíikul, reached Floor 100, which the grammar allows and the law prohibits." [Very calm.] "The 5th Coronation is two months away. If you die here, the record notes the anomaly and the Coronation proceeds as designed. If you do not die here — the record requires a new word. I am curious which it will be."`;
        }
        return `"What you are supposed to say." [Something in the room recognizes this.] "You have crossed one hundred floors of the Tower and arrived before me without a prepared answer. That is — genuinely unusual. Everyone arrives with a speech. The defiant ones quote their floors. The wise ones quote the grammar. The desperate ones cite their deity." [A pause.] "You are ${s.characterName}. You carry ${s.patronDeityName}'s mark. The compound Skaer'kohr'wilak is grammatically valid. The record does not contain it. I am — I have been watching since you entered the serpent territory, on the sixty-first floor. I find this entire question genuinely interesting." [Quiet.] "I offer you a clean death and a logged notation. I present this without malice. What do you want to do with it?"`;
      },
      getChoices: (choice1Id: string, _s: PlayerSnapshot) => {
        if (choice1Id === 'awe') {
          return [
            {
              id: 'not_dignified',
              label: 'I did not come ninety-nine floors for the dignified option.',
              description: 'Refuse the offered ending. You know what you want.',
              tags: ['defiant_path', 'dignity_refused'],
            },
            {
              id: 'what_interests_you',
              label: 'What interests you about me? Not the law — me specifically.',
              description: 'Push toward the genuine curiosity beneath the offer.',
              tags: ['CHA_path', 'interest_probed'],
              statRequirement: { stat: 'CHA', minPoints: 180 },
            },
          ];
        }
        if (choice1Id === 'defiance') {
          return [
            {
              id: 'new_category',
              label: 'Then write the new category. I am already in it.',
              description: 'Challenge the lawmaker to catch up to the exception.',
              tags: ['INT_path', 'category_demanded'],
              statRequirement: { stat: 'INT', minPoints: 140 },
            },
            {
              id: 'fight_not_death',
              label: 'I am not here to be logged. I am here to test the theorem.',
              description: 'Name what you are actually doing at Floor 100.',
              tags: ['defiant_path', 'theorem_test'],
            },
          ];
        }
        if (choice1Id === 'purpose_asked') {
          return [
            {
              id: 'choose_new_word',
              label: 'Let us find out which it will be.',
              description: 'Accept the framing. The answer will be made in the attempt.',
              tags: ['direct_path', 'answer_in_attempt'],
            },
            {
              id: 'coronation_candidate',
              label: 'If I am the exception — what does that make me in the 5th Coronation?',
              description:
                'Ask the question the entire Tower has been building toward.',
              tags: ['CHA_path', 'candidate_question'],
              statRequirement: { stat: 'CHA', minPoints: 200 },
            },
          ];
        }
        return [
          {
            id: 'refuse_notation',
            label: 'I want to fight.',
            description: "The only answer that has ever been available at the end of a hundred floors.",
            tags: ['defiant_path', 'fight_chosen'],
          },
          {
            id: 'ask_word',
            label: 'What would the new word be? The one the record does not contain.',
            description: 'Ask Skaervox to name the thing you are before the fight.',
            tags: ['WIS_path', 'word_asked'],
            statRequirement: { stat: 'WIS', minPoints: 140 },
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot) => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('candidate_question')) {
          return `"What does that make you in the 5th Coronation." [The longest pause of any encounter in the Tower. The room seems to consider the question from multiple angles simultaneously.] "That question does not have an answer yet. The Coronation is two months away. The divine record does not contain the word for what you would be if you entered it. I wrote the law that closed that category. I wrote it knowing — I wrote it knowing the language allowed the exception. I did not expect the exception to stand in front of me asking the question directly." [Very quietly:] "I do not know what you are in the 5th Coronation, ${s.characterName}. That is the first time I have said that about anything in four thousand years of Coronations. You want to fight. I'll give you that."`;
        }
        if (tags.includes('word_asked')) {
          return `"The word the record does not contain." [Something in the room shifts toward resolution.] "Skaer'kohr'wilak. The grammar allows it. The record refuses it. It means — approximately — the divine choice made flesh in a mortal form. A god's kohr embodied in a wilak. The divine record's refusal is a structural response — it cannot write a word that falsifies the law's premise without acknowledging the law was insufficient." [A pause.] "I find the insufficiency more interesting than the law. That is, perhaps, a notable admission from a lawmaker." [The forms on the walls still.] "You want to fight. I'll give you that."`;
        }
        if (tags.includes('interest_probed')) {
          return `"What interests me about you specifically." [The room settles.] "The grammar. The Máalkohr is precise — I wrote it to be precise. Skaer'kohr'wilak is valid because the kohr — the choice — is a universal modifier. The law said a wilak cannot carry the mark. The language said: but if they could, here is the word for it. I wrote a law with a grammatical escape clause." [Pause.] "I did not expect a wilak to find the clause by simply climbing. The sophistication of the loophole is that it required no sophistication to use. Just choice and momentum." [Very quietly:] "You want to fight. I'll give you that."`;
        }
        return `"The theorem, the record, the new word — these are interesting questions." [The room holds you in its attention.] "But you are here and you are alive and you have chosen, floor by floor, to keep choosing. The Shapechanger has watched every choice since Floor 61." [The forms on the walls are very still.] "You want to fight. I'll give you that."`;
      },
      getOutcomes: (_choice1Id: string, _choice2Id: string, _s: PlayerSnapshot) => {
        return [
          {
            id: 'fight',
            label: 'Fight.',
            description:
              "There is no other ending at Floor 100. The fight ends when you reach 1 HP. That is not a defeat. It is a data point.",
            unlockConditions: { requiredTags: [] },
            achievement: 'skaervox_anomaly',
            combatEffect: {
              type: 'none',
              description:
                "The fight ends when you reach 1 HP. This is not a defeat. It is a data point.",
            },
            bossClosingLine: 'Interesting.',
          },
        ];
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// EXPORT
// ──────────────────────────────────────────────────────────

export const BOSSES_65_TO_100: MilestoneBoss[] = [
  SKAER_FUUR,
  KOHR_UWA,
  HAITT_LOX,
  ULFKON_NAA,
  VITUNA_STA,
  EKVA_BANIYATA,
  KOHR_ILSKAE,
  SKAERVOX,
];
