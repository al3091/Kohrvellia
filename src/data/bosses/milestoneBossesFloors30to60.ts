/**
 * Milestone Bosses — Floors 30–60
 *
 * ZONES COVERED:
 *   Floors 26–40: Johr'ubi — Bird Continent, Ixpuxtequi's territory (2nd Coronation)
 *   Floors 41–60: Johr'biike — Bone Continent, Gashadokuro's territory (3rd Coronation)
 *
 * WORLD RULES ENCODED HERE:
 *   - "Wilak" subtext: bosses sense the vinrchíikul (the illegal patron mark) — they do not lecture, they register wrongness
 *   - nekl'ych'e FIRST APPEARS at Floor 35 (Naa'haitt), unexplained, as native vocabulary
 *   - "Witake" FIRST APPEARS at Floor 40 (Biik'haitt'ok), also unexplained
 *   - ch'inollu bypass: invoked by INT path; implies a cost, never a free pass
 *   - LCK cache: probability 0.25–0.30, available after observing/exploring paths
 */

import type { MilestoneBoss, BossOutcome, ChoiceTag } from './milestoneBosses';
import type { PlayerSnapshot } from '../../types/PlayerSnapshot';

// ===== LOCAL FIGHT CONST =====
const FIGHT: BossOutcome = {
  id: 'fight',
  label: 'Draw your weapon.',
  description: 'Some things can only be answered with steel.',
  unlockConditions: { requiredTags: [] },
  combatEffect: { type: 'none' },
  bossClosingLine: 'Then we settle this the only way that matters.',
};

// ──────────────────────────────────────────────────────────
// FLOOR 30 — ULFBIIK'OK ("Bone-Wolf Walker")
// ──────────────────────────────────────────────────────────
const ULFBIIK_OK: MilestoneBoss = {
  id: 'ulfbiik_floor30',
  floor: 30,
  name: "Ulfbiik'ok",
  epithet: 'Guardian of the Southern Edge',
  pantheon: "Johr'ulf",
  appearanceEmoji: '🐺',
  appearance:
    "A massive wolf-construct, ribcage exposed to show the bone scaffolding within. Pale divine flame burns in the chest cavity where a heart would be. It stands precisely at the boundary between two conquered continents — not patrol, not siege. Monument.",
  lore:
    "A construct of Fenrir's wolf-pack, stationed at the southernmost edge of Johr'ulf territory since the First Coronation. Its purpose is singular: stop things from crossing. It has never been given a reason to distinguish between what should cross and what should not.",
  theme: 'The boundary that recognizes you',
  bossDefeatedEcho:
    "Ulfbiik'ok's bones lie scattered across the threshold. The last wolf-guardian at the southern edge fell to a mortal adventurer. In the distance — far above, past the Tower's canopy — something older heard the silence where the howling used to be.",
  mechanic: {
    name: 'Pack Threshold',
    hint: 'Wolves do not fight alone. Something waits behind the guardian.',
    observeReveal:
      "At half-strength, Ulfbiik'ok fractures into three shadow-pack. They regenerate each other while all are alive. All three must fall within the same round to prevent recovery.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "The construct's nostrils flare. Its head tilts — not in greeting, in recognition. Something in the scent. Something wrong about what you carry. The pale flame in its chest deepens. It speaks in a low sound that becomes words only at the edge of comprehension: ...You carry a name that belongs to something higher. And you are very, very far from where that name is allowed.",
      getChoices: (s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'unyielding',
          label: 'Step forward. Say nothing.',
          description:
            s.approachStyle === 'aggressive'
              ? 'The wolf knows an aggressor. This is its language.'
              : 'Let the weapon speak before the mouth does.',
          tags: ['aggressive_path'],
        },
        {
          id: 'state_purpose',
          label: 'I cross this threshold. That is all.',
          description: `${s.monstersKilledThisRun} things tried to stop you already. This is one more.`,
          tags: ['direct_path'],
        },
        {
          id: 'observe',
          label: "Study the wolf before it moves.",
          description:
            'Hold still. The boundary guardian has a shape. That shape has a weakness.',
          tags: ['WIS_path', 'observer_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot): string => {
        if (choice1Id === 'unyielding') {
          return "The flame brightens. A low sound — not aggression yet, but warning. It steps sideways once, blocking the path with its full body. Then it speaks again: A wilak who does not speak. Either very brave, or very stupid. In my experience, the difference is small. Why should the pack allow something that should not exist to cross the edge?";
        }
        if (choice1Id === 'state_purpose') {
          return `"That is all." It repeats your words. The tone is neither mocking nor approving — it is the tone of something that has heard everything and is filing this under a category. ${s.adventurerArchetype}. Weapon-bearer. Vinrchíikul-carrier. You belong to three categories that should not coexist. The pack wants to know which one is true.`;
        }
        return "The wolf goes still. It notices you noticing it. Something in its posture shifts — not threat, but consideration. You are not fleeing. You are not charging. You are watching. The flame in its chest dims by half a shade. That is... unexpected. What do you see?";
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'unyielding') {
          return [
            {
              id: 'draw_weapon',
              label: 'Draw your weapon. Let it decide.',
              description: 'No argument. Just resolution.',
              tags: ['aggressive_path', 'combat_ready'],
            },
            {
              id: 'answer_wolf',
              label: 'Because the threshold is a test, not a wall.',
              description: 'Something about the wolf suggests it can hear this kind of answer.',
              tags: ['WIS_path'],
              statRequirement: { stat: 'WIS', minPoints: 80 },
            },
          ];
        }
        if (choice1Id === 'state_purpose') {
          return [
            {
              id: 'all_three',
              label: 'All three. None of them contradict each other.',
              description: `The ${s.adventurerArchetype} who holds paradox without flinching.`,
              tags: ['CHA_path'],
              statRequirement: { stat: 'CHA', minPoints: 100 },
            },
            {
              id: 'the_last_one',
              label: 'The last one is truest. The mark is what I am now.',
              description: 'An honest answer. Possibly a dangerous one.',
              tags: ['direct_path', 'honest_mark'],
            },
          ];
        }
        // observer path
        return [
          {
            id: 'see_the_pack',
            label: 'Three shadows. Waiting behind you.',
            description: 'You saw the pack before the wolf showed it.',
            tags: ['WIS_path', 'pack_seen'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'see_the_flame',
            label: 'The fire in your chest. It wavers when you speak.',
            description: 'You noticed what it costs the guardian to use words.',
            tags: ['observer_path', 'flame_noticed'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('pack_seen')) {
          return "A long silence. The flame in its chest almost goes out. ...You saw the pack. No climber has ever — the wolf shifts its stance. It does not step aside. But it speaks differently now: The pack fractures at half-strength. All three shadows must fall in the same breath, or they feed each other. You did not need to know that. The pack's rules say I should not have told you. What do you do with that?";
        }
        if (tags.includes('WIS_path')) {
          return "A threshold is a test. Yes. The wolf-guardian has been that for longer than you have existed as a concept. The fact that you named it correctly changes something. Not everything. But something. Make your choice.";
        }
        if (tags.includes('CHA_path') && s.statPoints.CHA >= 150) {
          return `"All three." It considers this for what feels like geological time. Then: A wilak who accepts its own paradox without apology is a rarer thing than I have encountered in ${s.isFirstEverEncounter ? 'any challenger' : 'recent memory'}. The pack does not require consensus. But it does require honesty. You have given that. Choose what comes next.`;
        }
        if (tags.includes('flame_noticed')) {
          return "The flame deepens instead of dims. The wolf has been noticed. Not many notice. It does not announce what this means. It simply looks at you differently. What do you choose?";
        }
        return `The wolf's posture is unchanged. The threshold has been declared. The ${s.adventurerArchetype} who tried every argument eventually finds only one path left. Choose.`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (tags.includes('pack_seen') || (tags.includes('WIS_path') && s.statPoints.WIS >= 100)) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Ask about the pack mechanics directly.',
            description: 'The wolf already told you. Ask it to confirm.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            achievement: 'ulfbiik_pack_broken',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Ulfbiik'ok fractures at 50% HP into three shadow-pack. All three must fall in the same round or they regenerate each other.",
            },
            bossClosingLine:
              'You already know. The pack fractures. All three must fall together. I will not pretend that knowledge makes you prepared. Come.',
          });
        }

        if (tags.includes('CHA_path') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: 'Walk the boundary alongside the guardian.',
            description: 'The wolf acknowledged the paradox. Step through it.',
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine:
              "Walk. The pack holds its breath. Do not mistake this for approval — only for recognition that the paradox you carry is real. The threshold was crossed.",
          });
        }

        if (tags.includes('observer_path') || tags.includes('flame_noticed')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Look where the wolf-guardian has stood for centuries.',
            description: 'Watchers sometimes find what others walk past.',
            unlockConditions: { requiredTags: ['observer_path'], probability: 0.27 },
            lootReward: {
              gold: 110,
              description: "Materials left by previous challengers — forgotten at the threshold for longer than the guild has kept records.",
            },
            bossClosingLine:
              "The pack does not remove what falls at the boundary. That is not our purpose. Take it. Then we will see if the rest of you is as observant.",
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 35 — NAA'HAITT ("Mother of War")
// ──────────────────────────────────────────────────────────
const NAA_HAITT: MilestoneBoss = {
  id: 'naa_haitt_floor35',
  floor: 35,
  name: "Naa'haitt",
  epithet: 'She Who Births the Battlefield',
  pantheon: "Johr'ubi",
  appearanceEmoji: '🦅',
  appearance:
    "A vast bird-form, each feather bone-edged and blade-sharp. Her wingspan blots the upper floors. A plague-bloom spreads from where she stands, slow and patient. Her eyes look through you rather than at you — as though measuring something you don't know you contain.",
  lore:
    "Not a deity. The accumulated will of every war fought across Ixpuxtequi's sky-continent, given form. She was born from the violence of the 2nd Coronation. She does not know what she is — only what she does. She has been doing it a very long time.",
  theme: 'War as origin',
  bossDefeatedEcho:
    "Naa'haitt's battlefield stands empty. The Mother of War fell to a mortal. The plague-bloom at her feet has already begun to retreat. She called those who walked the Tower by a word that was heard here once — a word no one thought to ask about. It will not be explained.",
  mechanic: {
    name: 'Plague Mother',
    hint: 'She has been fighting so long she no longer distinguishes between weapon and wound.',
    observeReveal:
      "Naa'haitt's strikes carry stacking infection. Each stack accelerates the damage of subsequent ones. Cleanse after the second stack — the third compounds exponentially.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "She does not look at you when she speaks. She looks at the air around you. Then: You are a nekl'ych'e. Yes. I can see the thread. Strange — they usually travel in pairs. Are you separated from your partner, or did you come alone on purpose?",
      getChoices: (s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'what_is_that',
          label: "I don't know that word.",
          description:
            "Honest. The word means nothing to you. Whatever she thinks you are — you are not it.",
          tags: ['honest_path', 'named_confused'],
        },
        {
          id: 'came_alone',
          label: 'Alone. Always alone.',
          description:
            s.approachStyle === 'aggressive'
              ? 'The aggressor who needs no partner.'
              : 'Let her assumption stand. See where it leads.',
          tags: ['direct_path'],
        },
        {
          id: 'study_her',
          label: 'Watch the plague-bloom before answering.',
          description: 'Something spreads from her feet. Understand it before you speak.',
          tags: ['WIS_path', 'observer_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot): string => {
        if (choice1Id === 'what_is_that') {
          return `She finally looks directly at you. Something shifts in her expression — not recognition exactly. More like recalibration. ...A ${s.adventurerArchetype} who does not know the word for what it is. That is unusual. Either the training failed you, or — she pauses — or you are not one, and I am reading something else. The vinrchíikul confuses the pattern. Your patron's mark is wrong. What did they promise you?`;
        }
        if (choice1Id === 'came_alone') {
          return `Alone. She considers this. The plague-bloom at her feet pulses once. The last nekl'ych'e who walked this continent alone was chasing something it had lost. Are you chasing something? Or running from it? The direction matters to how the infection spreads.`;
        }
        return "She notices you noticing the bloom. A long moment. Then: You see it. Most don't, until the second strike. The plague-mother's gift spreads with patience — it has no interest in hurrying. What does it tell you, if you can read it?";
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'what_is_that') {
          return [
            {
              id: 'deity_honest',
              label: `${s.patronDeityName} promised nothing. Only the mark.`,
              description: 'A patron who gives a mark without promise — that is either very dangerous or very honest.',
              tags: ['honest_path', 'deity_named'],
            },
            {
              id: 'deity_refuse',
              label: "What my patron promised isn't your concern.",
              description: 'Keep the bond private. She does not have the right to it.',
              tags: ['direct_path'],
            },
          ];
        }
        if (choice1Id === 'came_alone') {
          return [
            {
              id: 'chasing',
              label: "Chasing. The next floor. The floor after. Something beyond this Tower.",
              description: `${s.monstersKilledThisRun} kills says this is true.`,
              tags: ['direct_path', 'chaser'],
            },
            {
              id: 'neither',
              label: 'Neither. I simply walk forward.',
              description: `The ${s.adventurerArchetype} who refuses the frame.`,
              tags: ['WIS_path'],
              statRequirement: { stat: 'WIS', minPoints: 80 },
            },
          ];
        }
        // observer path
        return [
          {
            id: 'stacks',
            label: 'It stacks. Each layer feeds the next one.',
            description: 'You read the bloom correctly.',
            tags: ['WIS_path', 'plague_read'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'patience',
            label: 'That it is patient. It is not in a hurry.',
            description: 'Partial truth. The patience is right. The mechanism is still hidden.',
            tags: ['observer_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('plague_read')) {
          return "The wings lower slightly. Genuine. You read the bloom. The third stack compounds — not adds. Compounds. The ${s.adventurerArchetype} who knows the word 'compounds' usually lives past the first exchange. Cleanse on the second. Never let the third land. I will pretend I did not say that. Choose.";
        }
        if (tags.includes('deity_named')) {
          return `${s.patronDeityName}. She says the name slowly. The plague-bloom shifts color for one moment — something reacting to a deity's name being spoken in its territory. A mark without promise. That is... a strange kind of faith. Or a strange kind of desperation. Which is it in your case?`;
        }
        if (tags.includes('WIS_path')) {
          return "Simply walks forward. The Mother of War has fought things that walked forward without reason and things that walked forward with too much reason. The ones with exactly the right amount of reason — those are rarest. What do you choose?";
        }
        return `The war has been going since before you were born and will go on after. Choose your part in it.`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (tags.includes('plague_read') && s.statPoints.WIS >= 100) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Confirm the infection mechanic aloud.',
            description: "She said it. Make her hear you understood.",
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            achievement: 'naa_haitt_unplagued',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Naa'haitt's infection stacks and compounds on the third stack. Cleanse after the second hit. The third stack is lethal over time.",
            },
            bossClosingLine:
              "You understood. The bloom already knows you understood. Cleanse on two. Never three. Now — the war has been patient long enough.",
          });
        }

        if (tags.includes('CHA_path') || (tags.includes('honest_path') && s.statPoints.CHA >= 150)) {
          outcomes.push({
            id: 'bypass',
            label: "Walk through the Mother of War as if you belong here.",
            description: 'The mark confused her category system. Use that.',
            unlockConditions: {
              requiredTags: ['honest_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine:
              "You are not what I called you. The war does not know what to do with things it cannot categorize. Go — before I find a category.",
          });
        }

        if (tags.includes('observer_path') || tags.includes('patience')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Look at what the plague-bloom surrounds.',
            description: 'Patience carries things to the center of the bloom.',
            unlockConditions: { requiredTags: ['observer_path'], probability: 0.28 },
            lootReward: {
              gold: 130,
              description: "Objects carried to the center of the war-bloom over decades — materials the war forgot it was protecting.",
            },
            bossClosingLine:
              "The war carries things. It does not always know why. Take what you find. It will not change what comes next.",
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 40 — BIIK'HAITT'OK ("Bone-War Walker")
// ──────────────────────────────────────────────────────────
const BIIK_HAITT_OK: MilestoneBoss = {
  id: 'biik_haitt_floor40',
  floor: 40,
  name: "Biik'haitt'ok",
  epithet: 'The Construct That Serves Both Sides',
  pantheon: "Johr'biike",
  appearanceEmoji: '💀',
  appearance:
    "Humanoid, massive, composed entirely of fused battle-bones — armor and skeleton and weapon inseparable. Its left hand is a great cleaver; its right, a tower shield of compressed femur. The dominant side shifts constantly, as if the bones are debating. Both sides have scarring from both sides' weapons.",
  lore:
    "Built from the bones of those who died fighting for the 3rd Coronation. Gashadokuro made it as a boundary guardian — but the bones remember fighting on opposite sides of the same war. It is loyal to neither victor. It is loyal to the violence that used them both.",
  theme: 'Allegiance to the violence itself',
  bossDefeatedEcho:
    "Biik'haitt'ok stands shattered. The construct that served the violence of the 3rd Coronation was undone by a single adventurer, not another divine war. The Witake shade dispersed with it. The bones are still for the first time in centuries.",
  mechanic: {
    name: 'Bone Memory',
    hint: 'The bones it was built from do not agree on which direction to fight.',
    observeReveal:
      "At low health, a Witake shade emerges — the accumulated ghost of all the battles these bones once fought. It attacks everything. It cannot be targeted. Focus on the construct itself; the shade fades when its host falls.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "It regards you with both of its eyes — the left cold, the right burning. A long silence. Then, from the cleaver-side: You carry the mark of the divine law's exception. From the shield-side: You carry a weapon and the smell of thirty floors of blood. The two voices do not agree on which is more relevant. Neither do we.",
      getChoices: (s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'acknowledge_split',
          label: 'I heard two voices. Which one decides?',
          description: 'Name what you noticed immediately. The bones appreciate directness.',
          tags: ['direct_path', 'split_noted'],
        },
        {
          id: 'weapon_speaks',
          label: `${s.weaponName} is the only argument I need.`,
          description: `The ${s.adventurerArchetype} who leads with the weapon.`,
          tags: ['aggressive_path'],
        },
        {
          id: 'observe_the_shift',
          label: 'Watch which side leads. Wait for it to settle.',
          description: 'The shifting has a pattern. Find it before you commit.',
          tags: ['WIS_path', 'observer_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot): string => {
        if (choice1Id === 'acknowledge_split') {
          return "Which one decides. The left voice: Neither. The right voice: Both. A pause while both sides consider. Then, together — which is rare: The Witake decides. That is the word for what emerges when the bones stop agreeing and start acting on the war's memory instead. You will learn what Witake means. Not yet. But soon. What do you think you are here to do?";
        }
        if (choice1Id === 'weapon_speaks') {
          return `The cleaver-side brightens. The shield-side dims. A ${s.adventurerArchetype} with their weapon out — this is a familiar pattern. The cleaver-voice says: Yes. That is honest. The shield-voice says: That is also predictable. One of us is pleased with you. The other is not. Does it matter which?`;
        }
        return "Both sides stop shifting. It has been observed — not just looked at. This happens very rarely. The left voice: You see the bones debating. The right voice: You see the war that used them. You see more than most. What do you intend to do with the seeing?";
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'acknowledge_split') {
          return [
            {
              id: 'witake_question',
              label: 'What is a Witake?',
              description: "The word was offered. Ask it.",
              tags: ['INT_path', 'witake_asked'],
              statRequirement: { stat: 'INT', minPoints: 90 },
            },
            {
              id: 'break_the_host',
              label: "Break the host. The shade can't survive it.",
              description: 'Logic. The Witake is secondary.',
              tags: ['direct_path', 'host_logic'],
            },
          ];
        }
        if (choice1Id === 'weapon_speaks') {
          return [
            {
              id: 'pleasing_side',
              label: "It matters that the honest side is pleased.",
              description: 'Choose the cleaver over the shield.',
              tags: ['direct_path'],
            },
            {
              id: 'both_opinions',
              label: "I can live with one side disliking me.",
              description: `${s.approachStyle === 'aggressive' ? 'The aggressor rarely needs consensus.' : 'Not every voice needs to approve.'}`,
              tags: ['CHA_path'],
              statRequirement: { stat: 'CHA', minPoints: 100 },
            },
          ];
        }
        // observer path
        return [
          {
            id: 'use_against_itself',
            label: 'Turn the disagreement into a weapon. Use it.',
            description: 'Something that cannot agree on a target is vulnerable.',
            tags: ['WIS_path', 'split_exploit'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'witness_only',
            label: "I see it. I don't intend to exploit it.",
            description: 'A rare kind of honesty.',
            tags: ['observer_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('split_exploit') && s.statPoints.WIS >= 100) {
          return "The two sides go completely still. Left voice, very quietly: You would use the war's oldest wound against the war's servant. Right voice, also quietly: That is exactly what Witake does to us. A pause. Then both, together: You understand something you were not meant to understand. That changes the terms.";
        }
        if (tags.includes('witake_asked')) {
          return "Left voice: The shade of accumulated battle-ghosts. Right voice: The thing that emerges when the bones' memory overwhelms the construct's purpose. Together: It cannot be targeted. It fades when we fall. That was more than you asked. We are not sure why we answered. Choose.";
        }
        if (tags.includes('CHA_path') && s.statPoints.CHA >= 150) {
          return `${s.adventurerArchetype} who can carry one side's disapproval without flinching — the shield-side considers this. The cleaver-side has already decided. Choose quickly, before both sides agree again.`;
        }
        return "The bones have heard enough. The war's construct has its mandate. Choose.";
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('split_exploit') || tags.includes('witake_asked')) &&
          s.statPoints.WIS >= 100
        ) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Name the Witake and its limitation.',
            description: 'Both sides already told you. Say it back.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Biik'haitt'ok spawns a Witake shade at 40% HP. The shade attacks everything and cannot be targeted. Focus on the construct — the shade fades when the host falls.",
            },
            bossClosingLine:
              "The Witake cannot be targeted. The host can. You know this now. It will not spare you the shade — but you know where to look. Begin.",
          });
        }

        if (tags.includes('CHA_path') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: "Let the two sides settle their argument without you.",
            description: 'The construct is divided. Step through the gap.',
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine:
              "The cleaver-side: Let it pass. The shield-side: ...agreed. The two voices have not agreed in four hundred years. The path opens in the silence before they remember why they disagreed.",
          });
        }

        if (tags.includes('observer_path') || tags.includes('witness_only')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Look at what the bones have been standing on.',
            description: 'Centuries of standing in one place accumulates things.',
            unlockConditions: { requiredTags: ['observer_path'], probability: 0.26 },
            lootReward: {
              gold: 150,
              description: "Battle-materials compressed beneath the construct's weight — what the war carried and then forgot.",
            },
            bossClosingLine:
              "The bones notice you looking down. Left voice: Take it. Right voice: Yes. A rare moment of agreement on something minor.",
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 45 — VOR'BANIYATA ("Sky-Death")
// ──────────────────────────────────────────────────────────
const VOR_BANIYATA: MilestoneBoss = {
  id: 'vor_baniyata_floor45',
  floor: 45,
  name: "Vor'baniyata",
  epithet: 'Death That Comes From Above',
  pantheon: "Johr'biike",
  appearanceEmoji: '🌑',
  appearance:
    "A vast winged shape that blots out the Tower's false sky — not quite solid. More like a death-shaped hole in the light. It does not land. It strikes from altitude, diving and returning, always above. It regards everything below it as already dead.",
  lore:
    "A fragment of the death Ixpuxtequi claimed at the 2nd Coronation, left behind when the 3rd Coronation claimed this zone. Not fully Johr'ubi, not fully Johr'biike. A thing between categorizations that has no name in either zone's ledger. It has waited between zones since before anyone thought to ask what it was.",
  theme: 'The unreachable death',
  bossDefeatedEcho:
    "Vor'baniyata's presence no longer blocks the Tower's false sky. The thing between zones was grounded — by force, from below. The two zones it haunted feel slightly more resolved. Slightly.",
  mechanic: {
    name: 'Aerial Sovereignty',
    hint: 'Some things cannot be reached from below. They must be brought down.',
    observeReveal:
      "Vor'baniyata's strikes bypass ground-level defenses entirely while airborne. A well-timed Deflect or heavy strike during its dive forces a grounding stun — limited window, but it changes the fight completely.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "It does not land. It circles. The voice arrives from everywhere above: You are below. Everything below is below. The mark you carry was placed by something that thought above-and-below did not matter. It was wrong. Why should what is below reach what is above?",
      getChoices: (s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'reach_up',
          label: 'Because I have something in my hand that disagrees.',
          description: `${s.weaponName} can be thrown, swung, or aimed upward. The argument is physical.`,
          tags: ['aggressive_path'],
        },
        {
          id: 'question_premise',
          label: 'The premise assumes above is better than below.',
          description: "Challenge the framework before accepting it.",
          tags: ['INT_path', 'premise_challenged'],
          statRequirement: { stat: 'INT', minPoints: 90 },
        },
        {
          id: 'watch_the_dive',
          label: 'Watch how it circles before answering.',
          description: 'It has to descend to strike. There is a pattern in the descent.',
          tags: ['WIS_path', 'observer_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot): string => {
        if (choice1Id === 'reach_up') {
          return `Something in your hand. Yes. The ${s.adventurerArchetype} always has something. But the space between your weapon and what is above you is not negotiable by intention alone. The vinrchíikul your patron placed on you — does that mark reach upward? Or did your deity give you the mark of exception and leave you on the ground anyway?`;
        }
        if (choice1Id === 'question_premise') {
          return "The circling slows. Slightly. A pause in which the death-shape considers the challenge. ...The premise holds because the strikes land downward. Not because of moral hierarchy. Correction accepted. But the mechanic remains: what is below cannot reach what is above without being brought down. Are you offering to bring me down?";
        }
        return "It notices you watching. The circles tighten. The voice shifts: An observer below. You are counting the revolutions. You will see the pattern in three more passes. Tell me what you see — before those passes complete.";
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'reach_up') {
          return [
            {
              id: 'patron_gave_more',
              label: `${s.patronDeityName} gave me more than the mark. They gave me the climb.`,
              description: `The ${s.deityFavor === 'blessed' ? 'blessed' : 'committed'} adventurer who trusts the patron's intent.`,
              tags: ['CHA_path', 'patron_claim'],
              statRequirement: { stat: 'CHA', minPoints: 100 },
            },
            {
              id: 'weapon_answer',
              label: "The reach is the weapon's problem to solve, not mine.",
              description: 'Leave the philosophy and commit to the mechanics.',
              tags: ['aggressive_path'],
            },
          ];
        }
        if (choice1Id === 'question_premise') {
          return [
            {
              id: 'offer_grounding',
              label: "Yes. I will bring you down. That is what I am here to do.",
              description: 'Accept the framing. Ground the unreachable.',
              tags: ['direct_path', 'grounding_intent'],
            },
            {
              id: 'deflect_read',
              label: 'A well-timed deflect during the dive. That is the answer.',
              description: 'Name the specific mechanic. The INT path found it.',
              tags: ['INT_path', 'deflect_found'],
              statRequirement: { stat: 'INT', minPoints: 120 },
            },
          ];
        }
        // observer path
        return [
          {
            id: 'dive_pattern',
            label: 'The third revolution is shorter. You compress before striking.',
            description: 'You found the tell.',
            tags: ['WIS_path', 'dive_read'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'see_the_gap',
            label: 'You always return to the same altitude. There is a ceiling.',
            description: 'Partial read — useful, not complete.',
            tags: ['observer_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('deflect_found') || tags.includes('dive_read')) {
          return "The death-shape descends one full revolution lower than before. As if demonstrating. The third revolution compresses. The deflect window opens for the length of a held breath. You found it. Knowledge obtained through ch'inollu's domain carries a price — you will not speak of what you learned here. Does it matter? You already know.";
        }
        if (tags.includes('grounding_intent')) {
          return "You will bring me down. Things that say that are either very confident or very wrong about their chances. The divide between the two is the descent. What do you choose?";
        }
        if (tags.includes('patron_claim') && s.statPoints.CHA >= 150) {
          return `${s.patronDeityName} gave you the climb. I have seen the climb from above for longer than your patron has existed. What the climb gave you may be enough. Choose.`;
        }
        return "Everything below must eventually choose: accept the height between you, or close it. What do you choose?";
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('deflect_found') || tags.includes('dive_read')) &&
          (s.statPoints.INT >= 120 || s.statPoints.WIS >= 100)
        ) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Describe the deflect window precisely.',
            description: 'You found it. Name it completely.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            combatEffect: {
              type: 'dodge_boost',
              value: 25,
              description:
                "Vor'baniyata is immune to ground attacks while airborne. Time a Deflect or heavy strike during the dive to force a grounding stun. The window is the length of a held breath.",
            },
            bossClosingLine:
              "The dive compresses on the third revolution. Deflect into it. That is the only window I have. I will not pretend you did not earn this. Begin.",
          });
        }

        if (tags.includes('patron_claim') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: "Rise to where the patron's mark reaches.",
            description: "The mark was placed by something that ignored above-and-below. Use that.",
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine:
              "The vinrchíikul reaches where I thought it could not. The death that comes from above has no category for marks that break zone-law. Pass. Before I find one.",
          });
        }

        if (tags.includes('observer_path') || tags.includes('see_the_gap')) {
          outcomes.push({
            id: 'loot_cache',
            label: "Look at what accumulated at the ceiling it always returns to.",
            description: 'The ceiling is a limit. Limits accumulate things.',
            unlockConditions: { requiredTags: ['observer_path'], probability: 0.27 },
            lootReward: {
              gold: 160,
              description: "Materials caught at altitude and never retrieved — objects that reached the ceiling and stayed there.",
            },
            bossClosingLine:
              "You found the ceiling. Things catch there. Take what you find. It does not change the distance between us.",
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 50 — DRAPK'AGLA'OK ("Fire-Killer Walker")
// ──────────────────────────────────────────────────────────
const DRAPK_AGLA_OK: MilestoneBoss = {
  id: 'drapk_agla_floor50',
  floor: 50,
  name: "Drapk'agla'ok",
  epithet: 'Champion of the Fire Assassin',
  pantheon: "Johr'biike",
  appearanceEmoji: '🔥',
  appearance:
    "A figure consumed in pale fire that does not burn — it erases. Where the fire touches, material stops existing. Not combustion. Cancellation. The figure beneath is indistinct. It was someone once. The fire has been consuming that fact for a long time.",
  lore:
    "A divine champion of Drapk'agla, the LE Fire Assassin deity. Given form to guard the deep Bone Continent's approaches. It is not the deity — it is what a deity invests in when it wants something done without doing it itself. The closest thing to a divine agent the adventurers encounter this side of Floor 65.",
  theme: 'The first strike that ends everything',
  bossDefeatedEcho:
    "The pale fire is gone. Drapk'agla'ok — champion of the Fire Assassin — was extinguished by an adventurer who learned to read what erases. The deity whose name was invoked here offers no comment. It rarely does.",
  mechanic: {
    name: 'Erasure Strike',
    hint: 'The fire that does not burn is still hungry. It wants the first word.',
    observeReveal:
      "Drapk'agla'ok's first strike cannot be mitigated — it always crits. At 60% HP, it vanishes into its own fire. It leaves a heat-trace if you know to look. Strike the trace to force it back before it resets its crit.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "It does not speak immediately. It studies the air around you. When it speaks, the pale fire dims slightly — as though words cost something: The Fire Assassin's mark finds things that should not exist. You have the other kind of mark — the illegal one. The vinrchíikul. Your patron committed a crime to place that on you. Mine committed a different kind of crime to place this on me. We are perhaps more alike than either of us would choose.",
      getChoices: (_s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'not_alike',
          label: "I chose to accept the mark. Did you?",
          description: 'The distinction matters. Whether it changes anything is unclear.',
          tags: ['direct_path', 'choice_claimed'],
        },
        {
          id: 'alike_yes',
          label: "Possibly. What crime did yours commit?",
          description: "Engage the comparison. Learn what you are dealing with.",
          tags: ['INT_path', 'crime_asked'],
          statRequirement: { stat: 'INT', minPoints: 90 },
        },
        {
          id: 'observe_fire',
          label: 'Study the pale fire. Not the figure. The fire.',
          description: 'The fire does not burn. That is the mechanic, not the metaphor.',
          tags: ['WIS_path', 'observer_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot): string => {
        if (choice1Id === 'not_alike') {
          return `Did you choose. The figure beneath the fire pauses for a long moment. The pale erasure-flame dims. ...The mark was placed on what was left of a person who had already chosen to serve. Whether that counts as choice depends on what remained of the original choosing. The ${s.adventurerArchetype} who argues about consent to a divine mark — that is an argument for an older court than this one. What does your ${s.patronDeityName} say about choice?`;
        }
        if (choice1Id === 'alike_yes') {
          return "What crime. The fire brightens briefly. My deity gave power to something mortal-adjacent. Yours gave a mark to something categorized as hunted. Both broke the law between divine and wilak. Yours by omission — yours by the nature of what you are. Mine by — the figure pauses — commission. The Fire Assassin wanted a champion it could control. What you control eventually controls you. You should know that word. You invoke it, perhaps.";
        }
        return "You study the fire and not the figure. That is wise. The fire erases because the first strike is designed to be unanswerable. It does not accumulate — it cancels. What specifically do you see in how it moves?";
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'not_alike') {
          return [
            {
              id: 'patron_honest',
              label: `${s.patronDeityName} says choice is the only thing that remains after everything else is taken.`,
              description: `The ${s.deityFavor === 'blessed' ? 'blessed' : 'uncertain'} adventurer invoking the patron's voice.`,
              tags: ['CHA_path', 'patron_invoked'],
              statRequirement: { stat: 'CHA', minPoints: 100 },
            },
            {
              id: 'court_later',
              label: "We can argue the court after. Now there is only this.",
              description: 'Practical. The philosophy comes second to the fight.',
              tags: ['direct_path'],
            },
          ];
        }
        if (choice1Id === 'alike_yes') {
          return [
            {
              id: 'ch_invoked',
              label: "ch'inollu. Knowledge has a price. I know the price.",
              description: "Invoke the Knowledge patron's domain. The cost is silence about what you learn.",
              tags: ['INT_path', 'ch_invoked'],
              statRequirement: { stat: 'INT', minPoints: 120 },
            },
            {
              id: 'dont_know_it',
              label: "I don't know that word.",
              description: 'Honest. Whatever word it implied — you did not reach for it.',
              tags: ['honest_path'],
            },
          ];
        }
        // observer path
        return [
          {
            id: 'first_strike_read',
            label: 'It has not moved yet. It is saving the first strike.',
            description: 'The fire has been holding something since before you arrived.',
            tags: ['WIS_path', 'first_strike_seen'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'trace_noticed',
            label: 'When the fire dims, it leaves a pattern. A heat-shape.',
            description: 'You found the trace it leaves when it vanishes.',
            tags: ['observer_path', 'trace_found'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('ch_invoked')) {
          return "The pale fire goes completely still. A silence that has weight. Then: You reach for ch'inollu's domain. The Knowledge patron's price is silence — you will not speak of what you learned here. The figure considers this for a long moment. Then: The first strike is always a crit. At sixty percent, I enter the fire. I leave a heat-trace. Strike the trace. That name opens doors. It also locks others. Remember that.";
        }
        if (tags.includes('first_strike_seen') || tags.includes('trace_found')) {
          return "You saw what is being held. The trace is there when the fire compresses. You read more than most manage before the first blow lands. What do you do with that?";
        }
        if (tags.includes('patron_invoked') && s.statPoints.CHA >= 150) {
          return `${s.patronDeityName}'s voice, spoken to a divine champion. The Fire Assassin's investment grows quieter. The figure beneath the pale fire — whatever it was — attended to the name. Choose quickly, before the champion's mandate reasserts.`;
        }
        return "The pale fire has been patient. The first word belongs to whoever acts first. What do you do?";
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (tags.includes('ch_invoked') && s.statPoints.INT >= 120) {
          outcomes.push({
            id: 'weakness_revealed',
            label: "Receive what ch'inollu's price purchased.",
            description: 'The knowledge was paid for. Claim it.',
            unlockConditions: {
              requiredTags: ['INT_path'],
              statCheck: { stat: 'INT', minPoints: 120 },
            },
            achievement: 'drapk_agla_ch_invoked',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Drapk'agla'ok's first strike always crits — it cannot be mitigated. At 60% HP it vanishes. Locate the heat-trace and strike it to force it back before the crit resets.",
            },
            bossClosingLine:
              "You paid the price. First strike is mine. At sixty percent, I vanish. Find the trace. Strike it. Do not speak of this. Begin.",
          });
        }

        if (
          (tags.includes('first_strike_seen') || tags.includes('trace_found')) &&
          s.statPoints.WIS >= 100
        ) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Describe the heat-trace before it can vanish.',
            description: 'Name what you found before the fire takes it back.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Drapk'agla'ok vanishes at 60% HP into the erasure-fire. The heat-trace it leaves can be struck to force it back before the first-strike crit resets.",
            },
            bossClosingLine:
              "You found the trace. Good. The first strike is still mine. Everything else — you may earn. Begin.",
          });
        }

        if (tags.includes('patron_invoked') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: "Let the champion's original self hear the patron's name.",
            description: "Whatever it was before the mark — it is still inside the fire.",
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine:
              "The name reached something that is no longer the champion. It has not been reached in a long time. Go — before the Fire Assassin's mandate reclaims its investment.",
          });
        }

        if (tags.includes('observer_path') || tags.includes('trace_found')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Look at what the erasure-fire left intact.',
            description: 'The fire cancels. But cancellation has edges.',
            unlockConditions: { requiredTags: ['observer_path'], probability: 0.25 },
            lootReward: {
              gold: 190,
              description: "Materials at the edge of the erasure-fire — things the cancellation left intact because they had no category to cancel.",
            },
            bossClosingLine:
              "The fire is selective. You noticed. Take what it did not erase. Then we proceed.",
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 55 — TAT'KUUN'OK ("Serpent-King Blade")
// ──────────────────────────────────────────────────────────
const TAT_KUUN_OK: MilestoneBoss = {
  id: 'tat_kuun_floor55',
  floor: 55,
  name: "Tat'kuun'ok",
  epithet: 'Herald of the Serpent King',
  pantheon: "Johr'kuun",
  appearanceEmoji: '🐍',
  appearance:
    "Half-serpent, half-armored figure. As it moves, scales shed and reveal different weapons beneath each layer — sword, then staff, then claws, then a blade with no name. Its eyes are compound, seeing multiple angles simultaneously. It has been watching you since the floor before this one.",
  lore:
    "A herald-construct sent forward from Zahhak's serpent territory to evaluate what approaches before it arrives. It does not simply fight — it becomes your equal. Every layer of it is a mirror calibrated to the last challenger it faced. Whatever you are, it has already begun to become it.",
  theme: 'The thing that matches you',
  bossDefeatedEcho:
    "Tat'kuun'ok's scales lie across the threshold to the Serpent King's territory. The herald that became your equal was unmade by the gap between the mirror and the thing it reflected. Somewhere in Johr'kuun, Zahhak noticed.",
  mechanic: {
    name: "Serpent's Mirror",
    hint: 'It has seen everything approach this threshold. It has become all of it.',
    observeReveal:
      "Tat'kuun'ok adapts to your dominant stat and fighting style within the first exchange. Lead with your non-dominant stat to disrupt its calibration — then switch when it overcommits to the mirror.",
  },
  conversation: {
    exchange1: {
      bossOpening:
        "It watches you approach and then — without preamble — begins shedding scales. One layer falls, then another. Each layer reveals a different weapon, a different stance. It stops when it arrives at a configuration that mirrors yours. Then: I have been calibrating since the floor below. You are — it tilts its compound eyes — almost what I expected. The vinrchíikul complicates the read. Your patron was not on my list of known mark-givers.",
      getChoices: (_s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'recognise_mirror',
          label: "You're becoming me. I've noticed.",
          description: 'Name the mechanic immediately. You recognized the mirror.',
          tags: ['INT_path', 'mirror_named'],
          statRequirement: { stat: 'INT', minPoints: 90 },
        },
        {
          id: 'list_question',
          label: "Which deities are on your list?",
          description: "Learn what it knows about patron deities. Useful information.",
          tags: ['direct_path', 'list_asked'],
        },
        {
          id: 'shift_stance',
          label: 'Deliberately switch your weapon grip. See if it follows.',
          description: 'Test the mirror before the conversation begins.',
          tags: ['WIS_path', 'mirror_tested'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, s: PlayerSnapshot): string => {
        if (choice1Id === 'recognise_mirror') {
          return `You noticed. The scales pause mid-shed. Most ${s.adventurerArchetype}s do not notice until after the first exchange — you noticed before. Good. The mirror is not perfect — the vinrchíikul introduces a variable I cannot calibrate for. Your patron's domain touches something the mirror cannot reflect. Whether that is an advantage depends on whether you know how to use it.`;
        }
        if (choice1Id === 'list_question') {
          return `The list. It continues shedding scales while it speaks. Zahhak's approved mark-givers: seventeen deities across six zones. ${s.patronDeityName} is not among them. That means either your patron operates outside zone authority — which is a crime — or I have outdated data. Given the vinrchíikul's structure, I believe the former. Now — I have become a ${s.adventurerArchetype} to match you. What do you lead with?`;
        }
        return `You switched your grip. The scales pause. Then — it follows. Adjusts. But the adjustment takes longer than the original calibration. You found the lag. The mirror has a speed. The thing it reflects moves faster. Tell me — what does a ${s.adventurerArchetype} who tests mirrors plan to do with one?`;
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'recognise_mirror') {
          return [
            {
              id: 'use_weakness',
              label: `Lead with my secondary stat. Force the mirror to recalibrate.`,
              description: `The ${s.adventurerArchetype} who knows their non-dominant side.`,
              tags: ['INT_path', 'mirror_counter'],
              statRequirement: { stat: 'INT', minPoints: 120 },
            },
            {
              id: 'patron_variable',
              label: `Then ${s.patronDeityName}'s domain is the variable you can't mirror.`,
              description: 'Name the uncalibratable element. Use it.',
              tags: ['CHA_path', 'deity_variable'],
              statRequirement: { stat: 'CHA', minPoints: 100 },
            },
          ];
        }
        if (choice1Id === 'list_question') {
          return [
            {
              id: 'admit_crime',
              label: "The former. My patron committed the crime knowingly.",
              description: 'Own the illegal mark. The herald is evaluating honesty too.',
              tags: ['honest_path', 'crime_admitted'],
            },
            {
              id: 'lead_secondary',
              label: 'Lead with what you least expect from a ${s.adventurerArchetype}.',
              description: 'Disrupt the calibration before the fight begins.',
              tags: ['WIS_path', 'mirror_counter'],
              statRequirement: { stat: 'WIS', minPoints: 100 },
            },
          ];
        }
        // mirror_tested path
        return [
          {
            id: 'exploit_lag',
            label: "The lag. I switch, you follow. I use the gap in between.",
            description: 'You found the exploit in the calibration speed.',
            tags: ['WIS_path', 'lag_found'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'break_it',
            label: "Break it. Force it to become something it can't mirror.",
            description: 'Push the mirror past its calibration range.',
            tags: ['aggressive_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('mirror_counter') || tags.includes('lag_found')) {
          return `A ${s.adventurerArchetype} who knows the counter to their own mirror. The scales hold still. Then shed one more layer — revealing something underneath that does not match you. It says: You are correct. Lead with the secondary. I will overcommit to the primary when I believe that is what you are. The gap between the overcommit and your switch — that is the opening. Zahhak will want to know you found this.`;
        }
        if (tags.includes('deity_variable')) {
          return `${s.patronDeityName}'s domain is the uncalibratable element. The scales shift uneasily. The mirror cannot reflect a divine domain it was not given data on. That is an advantage with a specific shape. Use it before I find a workaround.`;
        }
        if (tags.includes('crime_admitted')) {
          return "A patron who committed the crime knowingly — and an adventurer who admits it. The herald's evaluation function notes this. Zahhak's territory respects honesty about what you are. It does not mean passage. It means the evaluation is complete. Choose.";
        }
        return `The mirror is ready. The ${s.adventurerArchetype} and its reflection stand across from each other. One of you is real. Choose which.`;
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (
          (tags.includes('mirror_counter') || tags.includes('lag_found')) &&
          (s.statPoints.WIS >= 100 || s.statPoints.INT >= 120)
        ) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Describe the calibration counter strategy.',
            description: "The herald confirmed it. State it completely.",
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Tat'kuun'ok mirrors your primary stat. Lead with your secondary to force recalibration — then switch when it overcommits to the mirror. The lag is the opening.",
            },
            bossClosingLine:
              "Lead secondary. Wait for the overcommit. Switch. The gap is real. It will not be as wide as you hope. Begin.",
          });
        }

        if (tags.includes('deity_variable') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: "Use the uncalibratable domain as a pass.",
            description: "The mirror cannot reflect what it was not given data on.",
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine:
              `The mirror has no data for ${s.patronDeityName}'s domain. The herald's evaluation requires a complete read. Without it — the evaluation is incomplete. Pass. Zahhak will have questions. Bring answers.`,
          });
        }

        if (tags.includes('mirror_tested') || tags.includes('lag_found')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Look at what was shed in the calibration layers.',
            description: 'Every shed scale carries what it was calibrated from.',
            unlockConditions: { requiredTags: ['WIS_path'], probability: 0.26 },
            lootReward: {
              gold: 200,
              description: "Materials from the calibration shedding — remnants of everything the mirror has become and discarded.",
            },
            bossClosingLine:
              "The shed layers carry residue from every challenger catalogued here. Take what applies to you. Then demonstrate whether the catalogue is accurate.",
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// FLOOR 60 — JOHR'OK ("Earth Walker")
// ──────────────────────────────────────────────────────────
const JOHR_OK: MilestoneBoss = {
  id: 'johr_ok_floor60',
  floor: 60,
  name: "Johr'ok",
  epithet: 'The Floor Itself',
  pantheon: "Johr'biike",
  appearanceEmoji: '⛰️',
  appearance:
    "A massive humanoid of packed stone and compressed earth. No eyes. No face. No weapon — its fists are mountains. It does not acknowledge the player's approach until it must. It may predate the floor it stands on. It does not know. It has not thought about it.",
  lore:
    "The oldest thing in the Bone Continent. Predates the 3rd Coronation. May predate Gashadokuro himself. It does not know what it guards. It simply stands where it stands because it has always stood here. It has been asked every question. It has one answer for all of them.",
  theme: 'Immovability as the only answer',
  bossDefeatedEcho:
    "Johr'ok is still standing. The stone has not moved. Something is different in the arrangement of the rubble. An adventurer passed through. The floor remembers this the way it remembers all things — without judgment, without record, simply as fact.",
  mechanic: {
    name: 'Deep Root',
    hint: 'There is a thing that cannot be worn down. It must be broken all at once.',
    observeReveal:
      "Johr'ok cannot be reduced past one-third health by incremental damage. It must be broken past that threshold in a single committed strike. Accumulate, then commit everything at once.",
  },
  conversation: {
    exchange1: {
      bossOpening: 'You are here.',
      getChoices: (s: PlayerSnapshot): ChoiceTag[] => [
        {
          id: 'yes_here',
          label: 'Yes.',
          description: 'The only honest answer to the only true statement.',
          tags: ['direct_path'],
        },
        {
          id: 'ask_what_it_is',
          label: 'What are you?',
          description:
            s.isFirstEverEncounter
              ? 'No one has ever stood here and asked. It may not know the answer.'
              : 'Someone asked this before. The answer, if any, was kept private.',
          tags: ['INT_path', 'nature_asked'],
          statRequirement: { stat: 'INT', minPoints: 90 },
        },
        {
          id: 'observe_the_stone',
          label: 'Study the stone. Look for where it was once broken.',
          description: 'Everything that has stood long enough has a fracture somewhere.',
          tags: ['WIS_path', 'observer_path'],
        },
      ],
    },
    exchange2: {
      getBossText: (choice1Id: string, _s: PlayerSnapshot): string => {
        if (choice1Id === 'yes_here') {
          return 'Yes.';
        }
        if (choice1Id === 'ask_what_it_is') {
          return 'Stone.';
        }
        return "The stone is old. Older than most records. There are fractures — but they are old fractures, filled and compressed over centuries. The original break is there, underneath, if you know where to look and how much force to apply at once. What do you see?";
      },
      getChoices: (choice1Id: string, s: PlayerSnapshot): ChoiceTag[] => {
        if (choice1Id === 'yes_here') {
          return [
            {
              id: 'walk_forward',
              label: 'Then I move forward.',
              description:
                'The simplest possible response to the simplest possible confirmation.',
              tags: ['direct_path', 'forward_declared'],
            },
            {
              id: 'ask_permission',
              label: "May I pass?",
              description: `The ${s.adventurerArchetype} who asks before assuming.`,
              tags: ['CHA_path'],
              statRequirement: { stat: 'CHA', minPoints: 100 },
            },
          ];
        }
        if (choice1Id === 'ask_what_it_is') {
          return [
            {
              id: 'stone_moves',
              label: 'Stone breaks.',
              description: "The counter to the only answer it gave.",
              tags: ['direct_path', 'break_stated'],
            },
            {
              id: 'understand_stone',
              label: 'Stone remembers.',
              description: 'Older than any record — it has been here for everything.',
              tags: ['INT_path', 'stone_wisdom'],
              statRequirement: { stat: 'INT', minPoints: 120 },
            },
          ];
        }
        // observer path
        return [
          {
            id: 'found_fracture',
            label: 'There is a line beneath the third compression layer. Old break, never fully healed.',
            description: 'You found the original fracture.',
            tags: ['WIS_path', 'fracture_found'],
            statRequirement: { stat: 'WIS', minPoints: 100 },
          },
          {
            id: 'no_weakness',
            label: 'Nothing. It has been here long enough to fill all its breaks.',
            description: 'Honest — the breaks are there, but buried.',
            tags: ['observer_path'],
          },
        ];
      },
    },
    exchange3: {
      getBossText: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): string => {
        const tags = [choice1Id, choice2Id];
        if (tags.includes('fracture_found')) {
          return 'The line is there.';
        }
        if (tags.includes('stone_wisdom')) {
          return 'Yes.';
        }
        if (tags.includes('CHA_path') && s.statPoints.CHA >= 150) {
          return 'No.';
        }
        if (tags.includes('break_stated')) {
          return 'Eventually.';
        }
        return '';
      },
      getOutcomes: (choice1Id: string, choice2Id: string, s: PlayerSnapshot): BossOutcome[] => {
        const tags = [choice1Id, choice2Id];
        const outcomes: BossOutcome[] = [FIGHT];

        if (tags.includes('fracture_found') && s.statPoints.WIS >= 100) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Strike the fracture line directly.',
            description: 'You found it. Use it.',
            unlockConditions: {
              requiredTags: ['WIS_path'],
              statCheck: { stat: 'WIS', minPoints: 100 },
            },
            achievement: 'johr_ok_the_deep_read',
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Johr'ok cannot be reduced past one-third health by incremental damage. A single committed strike must break past the threshold all at once. Accumulate, then commit.",
            },
            bossClosingLine: 'The line is there. It has always been there.',
          });
        }

        if (tags.includes('stone_wisdom') && s.statPoints.INT >= 120) {
          outcomes.push({
            id: 'weakness_revealed',
            label: 'Acknowledge what the stone remembers about breaking.',
            description: "Stone that remembers being broken knows how it was broken.",
            unlockConditions: {
              requiredTags: ['INT_path'],
              statCheck: { stat: 'INT', minPoints: 120 },
            },
            combatEffect: {
              type: 'weakness_exposed',
              description:
                "Johr'ok cannot be reduced past one-third health by incremental damage. A single committed strike must cross the threshold. Accumulate everything, then release.",
            },
            bossClosingLine: 'Stone remembers. Yes.',
          });
        }

        if (tags.includes('CHA_path') && s.statPoints.CHA >= 150) {
          outcomes.push({
            id: 'bypass',
            label: "Ask again. With everything you have behind the asking.",
            description: "It said no. Say it differently.",
            unlockConditions: {
              requiredTags: ['CHA_path'],
              statCheck: { stat: 'CHA', minPoints: 150 },
            },
            combatEffect: { type: 'none' },
            bossClosingLine: 'Pass.',
          });
        }

        if (tags.includes('observer_path') || tags.includes('no_weakness')) {
          outcomes.push({
            id: 'loot_cache',
            label: 'Look at what accumulated in the compressed earth around its feet.',
            description: 'Things sink into the floor over enough centuries.',
            unlockConditions: { requiredTags: ['observer_path'], probability: 0.25 },
            lootReward: {
              gold: 220,
              description: "Materials compressed into the floor by Johr'ok's weight over centuries — things the stone swallowed and forgot.",
            },
            bossClosingLine: 'Things sink.',
          });
        }

        return outcomes;
      },
    },
  },
};

// ──────────────────────────────────────────────────────────
// EXPORT
// ──────────────────────────────────────────────────────────
export const BOSSES_30_TO_60: MilestoneBoss[] = [
  ULFBIIK_OK,
  NAA_HAITT,
  BIIK_HAITT_OK,
  VOR_BANIYATA,
  DRAPK_AGLA_OK,
  TAT_KUUN_OK,
  JOHR_OK,
];
