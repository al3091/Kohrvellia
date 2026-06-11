# KOHRVELLIA — Lore & Game Integration Bible
### The *Kohrsâra* Chronology: How the World's History Becomes Your Mechanics

> *"The Tower Awaits."*
> — Last line of every Kohrvellia document, now understood as a threat.

---

## 0. ORIENTATION

This document is the authoritative integration layer between the *Kohrsâra* world chronology and every existing game system. It does not replace any design document. It gives those documents their *reason*. Every mechanic was already in place. This document reveals what it was always describing.

Read this before writing any boss dialogue, deity lore, behavement flavor text, or floor description. The chronology is not background. It is the game.

---

## 1. THE CENTRAL PREMISE REFRAMED

### What the Player REALLY Is

The player character is a *Wilak* — a human, the condemned species of *Kohrsâra*. Humans turned their backs on the gods four thousand years ago. In divine law, *Wilake* (the plural) are the supreme blasphemers: the people who chose science (*nolueitla*) over faith, reason over devotion, and were answered with genocide.

The player character is not a hero. They are a fugitive. They carry a *vinrchíikul* — a patron's mark — which is the most illegal object in the current divine order. No human is permitted to receive a divine mark under the *Aleabishal* (the sacred hunt-law). To possess one is an execution-level offense. To have been given one means their patron deity also broke divine law.

The player character descends into the Tower not in pursuit of glory but in possession of a secret that would see them killed on sight by every faction in the divine order. They are the thing the gods created the dungeon to destroy.

**Implementation note:** The player's *vinrchíikul* maps exactly to the existing Falna mark in `useCharacterStore`. The Blessing Rite in `app/town/familia/blessing-rite.tsx` is not a ceremony of initiation. It is a moment of divine crime. Every time the player receives *excelia*, their patron deity is actively breaking *Aleabishal* law. This requires no mechanical change — only narrative reframing in the Blessing Rite UI text.

### What the Dungeon REALLY Is

The Tower of Kohrvellia is the primary hunting ground of the *Rutkean'i* — the fifth and final great hunt. The floors are not a dungeon in the classical sense. They are the contested ground of an ongoing divine tournament, where the gods' *venoium'e* (champions) drive divine-manufactured hunters downward to exterminate the last remnants of *Wilake* presence.

The deeper a floor, the deeper into actively contested hunt territory it sits. The monsters do not wander randomly. They descend. They are manufactured to descend. The player is ascending against the current.

**Implementation note:** The existing dungeon generation in `useDungeonStore` already models floors as increasingly hostile with CR scaling. The fiction behind that scaling is now: every floor deeper is deeper into the zone controlled by a Greater God's faction. The existing rest site formula (`chance = 15% × 0.85^floor`) reflects divine hostility — the gods have stripped more and more sanctuary from lower floors. No mechanical change is needed.

### What the Monsters REALLY Are

Every monster the player encounters is *nekl'ych'e* — divine manufactured hunters, created by *Skaervox* at the start of the *Aleabishal* to pursue and kill *Wilake*. They are not natural creatures. They are divine instruments.

The existing modular monster system (36+ base monsters, prefix/suffix generation) gains a lore layer: monster prefixes represent divine enhancement. An "Ancient" monster is old *nekl'ych'e*, carrying four thousand years of hunting memory. An "Mythic" monster is a freshly empowered hunter, newly infused with divine energy for the fifth hunt. The Elite and Legendary categories are not power tiers — they are divine investment levels.

**Implementation note:** The monster `MonsterCategory` system in `src/data/loot/` and the prefix/suffix tables in `src/data/monsters/` require no mechanical change. Their lore meaning is now: each prefix is a rank of divine empowerment. "Fierce" = freshly activated. "Elite" = veteran hunter, second or third generation. "Ancient" = a survivor from Phase 1, four thousand years old. "Mythic" = a Phase 5 prototype built for the *Rutkean'i*.

### What the Patron Relationship REALLY Means

Every patron deity in Kohrvellia is a criminal. They broke *Aleabishal* law — specifically the clause that forbids granting a *vinrchíikul* to a *Wilak*. The player's patron did not choose them out of benevolence. They chose them for a reason that reflects their domain, their personality, and their own agenda against *Skaervox*.

The relationship between player and deity is not worship. It is a criminal pact between two parties who both stand to die if discovered. The god needs the player to survive because the player's survival is proof of concept for the god's illegal gamble. The player needs the god's *excelia* because it is the only power source that can keep a lone *Wilak* alive in the hunting grounds.

**Implementation note:** The existing `Deity` interface in `src/types/Deity.ts` already models favor as a bidirectional relationship. The planned deity eviction at favor ≤ 10 now has a specific narrative meaning: the god is withdrawing their illegal mark to protect themselves from *Skaervox*'s judgment. Favor is not approval — it is the measure of how much divine risk the god is still willing to carry for this *Wilak*.

---

## 2. THE *RUTKEAN'I* AS GAME FRAMING

### The Hunt That Opens the Game

The *Rutkean'i* — the fifth and final hunt — begins the moment the player's character first descends into the Tower. This is not coincidence. The divine tournament that governs who becomes *Ekvaprach'ilskae* (5th Champion) is already underway. The gods' *venoium'e* are already competing. The deepest floors are already contested.

The player is not descending into an empty dungeon. They are descending into a war.

### The Endgame Clock

The timeline of the *Rutkean'i* maps cleanly to the floor structure:

| Hunt Phase | Floor Range | Divine Presence | Dominant Faction |
|---|---|---|---|
| Opening moves | Floors 1-10 | Scouting parties | Mixed — no dominant faction yet |
| *Johr'ulf* territory | Floors 11-25 | Ulfkon'ur's wolf-packs | 1st Champion's legacy zone |
| *Johr'ubi* territory | Floors 26-40 | Uba'niyata's plague-birds | 2nd Champion's death-zone |
| *Johr'biike* territory | Floors 41-60 | Vitatu'ke's bone constructs | 3rd Champion's undead marches |
| *Johr'kuun* territory | Floors 61-80 | Kuukalin'ah's venom-packs | 4th Champion's domain (CURRENT) |
| *Rutkean'i* core | Floors 81-99 | All factions converging | 5th Champion candidates competing |
| *Skaervox* | Floor 100 | *Skaervox* itself | The architect of everything |

**Implementation note:** This table is the design brief for the 15 unimplemented milestone bosses (floors 30-100) and for floor biome naming as Kohrvellia expands. The four continent names from MALKOHR_LINGUISTICS.md — *Johr'ulf*, *Johr'ubi*, *Johr'biike*, *Johr'kuun* — are now the dungeon zone names. They should be introduced to players gradually through lore fragments, monster names, and boss dialogue, not as an explicit map.

### Narrative Urgency

Every floor deeper is a statement. The *Rutkean'i* has a clock: in the game's fiction, the tournament ends when a *Ekvaprach'ilskae* is decided. No *Wilak* has ever survived long enough to be present when that happens. The player is attempting something that has never occurred in four thousand years of divine law.

The "One More Run" factor is now lore-coherent: each time the player dies, a *Wilak* fails the hunt. Each time they restart, a new *Wilak* — a new soul, a new illegal pact with a desperate god — descends again. The gods keep trying. The hunt keeps failing to end them entirely. The *Rutkean'i* may be the last hunt in the *Aleabishal*, but the *Wilake* are harder to finish than *Skaervox* predicted.

---

## 3. PATRON DEITIES — MORAL COMPLEXITY

Every patron deity marked a *Wilak*. Every one of them broke divine law. But their reasons differ by domain, and those reasons should flavor how each deity communicates with the player, what they demand, and why they might abandon the player if favor falls.

### Domain Motivation Map

| Domain | Why They Broke the Law | Tone | What They Want |
|---|---|---|---|
| **War** | Saw a worthy warrior and scorns the tournament's politics. The *Aleabishal* is law, but law without honor is just bureaucracy. | Terse, demanding, military | Proof the player can fight gods' champions on equal ground |
| **Trickery** | Is playing a game *against Skaervox* specifically. The *Wilak* is a piece on a board the player cannot see. | Amused, oblique, never fully honest | Entertainment. Chaos. Something unexpected. |
| **Fortune** | Saw a prophecy. This *Wilak* matters to a future that the god has already witnessed. The god is not generous — they are investing. | Cryptic, occasionally urgent | The prophecy fulfilled, or at least not destroyed |
| **Death** | Wants to watch what a human does when death is everywhere and inevitable. Scientific interest in the mortality curve. | Cold, fascinated, uncomfortably honest | Data. Observation. A good death if not a long life. |
| **Knowledge** | The player may be the last keeper of *nolueitla* — the forbidden science that started the war. The god is protecting a library. | Urgent, conspiratorial, driven | Survival of the knowledge that *Skaervox* tried to exterminate |
| **Nature** | The natural order predates the *Aleabishal*. *Wilake* were part of the world before the gods rewrote the rules. The forest recognizes them as *LG* — righteous in the old law. | Ancient, patient, earthy | Restoration of what was. The old balance. |
| **Wisdom** | The *Aleabishal* is unjust. Wisdom requires acknowledging injustice even when it is dangerous to do so. This god is acting on principle. | Measured, philosophical, self-aware about the risk | The player demonstrating that wisdom can survive in a lawless world |
| **Craft** | A *Wilak* craftsperson built something four thousand years ago that the god still considers the finest work ever made. The debt is older than the law. | Warm, practical, occasionally nostalgic | A worthy successor. Something built that lasts. |
| **Authority** | Believes the *Aleabishal* is illegitimate. *Skaervox* does not have the rightful authority this god recognizes. The mark is a political statement. | Imperious, confident, occasionally condescending | Defiance. Legitimacy reclaimed by surviving. |
| **Life** | A *Wilak* cannot be allowed to die while a Life deity watches. The instinct overrode the law. The god acted without fully thinking it through, and is now committed. | Guilty, protective, sometimes reckless in their anxiety | The player alive, at any cost, even at cost to the god |
| **Sea** | The sea has no borders and recognizes no hunt law. *Wilake* fished its waters for four thousand years. The sea's god never agreed to the *Aleabishal*. | Indifferent to land-laws, expansive, free | The player to go deeper than anyone has gone. Depth for its own sake. |
| **Sky** | The sky is *CG* — chaotic good, unconstrained freedom. The *Aleabishal* is a cage. This god broke the law because cages are intolerable, regardless of who is inside them. | Rebellious, energetic, impatient with rules | Freedom. The player proving cages can be broken. |
| **Fire** | Fire is *CE* — chaotic evil. This god marked a *Wilak* because watching things burn, including divine law, is what they do. No other reason needed. | Volatile, destructive, honest about their nature | Everything burning eventually. Starting with *Skaervox*'s tournament. |

**Implementation note:** These motivations should manifest in the existing deity `personality` array in `src/types/Deity.ts` and in the `lore` field. Each deity description should reference, even obliquely, why this god took the illegal risk. Players who read carefully will piece together that their patron is a criminal. That realization should be one of the game's quiet revelations.

---

## 4. THE FIVE GREATER GODS AS BOSS FACTIONS

The four continents of *Kohrsâra* each belong to one of the four champion-gods. Their territories are the dungeon zones. Their *venoium'e* and *nekl'ych'e* populate those zones. The milestone bosses on the floors corresponding to each territory are either the champion-god's lieutenants, their creations, or rival competitors for the fifth champion title.

### Champion-God Profiles

**Ulfkon'ur** — *Aleaprach'ilskae* (1st Champion)
Continent: *Johr'ulf* (Earth + Wolf). Visual: vantablack wolf, purple iris, red pupil, silver claws. Controls the northern floors (11-25). His *nekl'ych'e* are pack hunters — wolves and wolf-adjacent creatures that coordinate, cut off retreat paths, and exhaust targets before the kill. Ulfkon'ur is old enough to have killed four billion *Wilake* across Phase 1. He is not angry. He is patient. He considers the current hunt beneath him.

In boss conversations on *Johr'ulf* floors, his lieutenants will be dismissive of the player — a *Wilak* reaching this deep is not an achievement to them; it is a scheduling problem.

**Uba'niyata** — *Uwaprach'ilskae* (2nd Champion)
Continent: *Johr'ubi* (Earth + Bird). Visual: faceless bird-man, putrid, feather-shedding. Controls plague and death-bird floors (26-40). The *Tanakfale* rose during his phase — a detail that implies *Uba'niyata*'s methods produced a secondary catastrophe the other gods did not anticipate. His *nekl'ych'e* spread disease and confusion before the kill. Bosses in his territory will reference the *Tanakfale* as proof of efficacy, not as a mistake.

The alignment contradiction in *Uba'niyata* — Death (*NE*) fused with Bird (*LG*) — is intentional horror. Something that is simultaneously organized harm and righteous by the old law. His lieutenants will speak with genuine moral certainty that the player finds increasingly difficult to argue against.

**Vitatu'ke** — *Inraprach'ilskae* (3rd Champion)
Continent: *Johr'biike* (Earth + Bone). Visual: bone colossus born from the forgotten dead. Controls undead and memory-haunted floors (41-60). *Vitatu'ke* is made from the bones of the *Witake* — the pre-human species who came before *Wilake* and were also forgotten in battle. This is the game's deepest horror: the god hunting humans was built from the remains of humanity's predecessors.

Bosses in *Johr'biike* territory should carry echoes of the *Witake*. They remember being human-adjacent. They are haunted in a way that makes them more unsettling than simple monsters.

**Kuukalin'ah** — *Apaprach'ilskae* (4th Champion — CURRENT)
Continent: *Johr'kuun* (Earth + Serpent). Visual: ruby snake-limbed humanoid, venom breath, three heads (past/present/future). Controls transformation and venom floors (61-80). *Kuukalin'ah* is the active champion — the hunt is happening on their watch. The fifth hunt (*Rutkean'i*) is their tournament to oversee. When the player reaches *Johr'kuun* territory, they are in the most politically contested zone in the game. Every god vying for *Ekvaprach'ilskae* is here.

**Skaervox** — Floor 100 Final Boss
*Skaervox* is *TN* (True Neutral). God is True Neutral in the *Malkohr* alignment system. A shapechanger with no continent, no fixed form, no fixed moral position. *Skaervox* does not hate *Wilake*. The genocide was governance, not passion. *Skaervox* shaped the *Aleabishal* the way a ruler shapes law — dispassionately, for order.

When the player reaches Floor 100, *Skaervox* becomes whatever the player is most invested in fighting. It does not have a true form. The conversation before the final encounter should be the most disturbing boss exchange in the game — not because *Skaervox* is cruel, but because *Skaervox* is reasonable. The genocide made sense. The *Aleabishal* is working as designed. The player's survival is an acceptable anomaly. *Skaervox* is not even angry.

**Implementation note:** The existing `MilestoneBoss` interface in `src/data/bosses/milestoneBosses.ts` already supports the `lore`, `theme`, and 3-exchange `conversation` structure needed to deliver these faction narratives. The `bossDefeatedEcho` field — text shown to future characters who reach a cleared floor — is especially powerful for the champion-god lieutenants: a cleared floor should echo with something that implies the faction is aware and adjusting.

---

## 5. MILESTONE BOSS REDESIGN — FLOORS 30-100

The 15 unimplemented bosses (floors 30-100) should map to the *Rutkean'i* narrative. Each boss is either a lieutenant of one of the four champion-gods, a *Wilak*-hunter of legendary age, a competitor for the fifth champion title, or a fragment of *Skaervox* itself.

The 3-exchange conversation hook for each boss follows the same rule: **they know the player is a *Wilak*.** They always know. The question is what they do with that knowledge.

### Boss Table — Floors 30-100

| Floor | Malkohr Name | Translation | Faction | Combat Theme | Conversation Hook |
|---|---|---|---|---|---|
| 30 | *Ulfbiik'ok* | The Bone-Wolf Walker | Ulfkon'ur | Pack ambush; spawns two wolf-shades at 50% HP | "You smell like a *Wilak*. The last one who made it this far begged." — Exchange 1 invites the player to prove they are different. |
| 35 | *Naa'haitt* | Mother of War | Uba'niyata | Plague aura; poisons the entire encounter; all attacks carry infection | "I have killed more of your kind than you have names for. What name do you carry?" — Exchange 1 demands the player's identity. |
| 40 | *biik'haitt'ok* | The Bone-War-Walker | Vitatu'ke | Summons a Witake shade at the start; the shade attacks both sides | "Look at what I'm made of. Look closely. Do you recognize them?" — The revelation that the boss is built from human predecessors. |
| 45 | *Vor'baniyata* | Sky-Death | Uba'niyata | Aerial positioning; immune to ground attacks until grounded | "The *Tanakfale* did not fail. It succeeded. The definition of success was simply different than they told you." — Exchange 1 reframes everything the player thought they knew about Phase 2. |
| 50 | *Drapk'agla* | The Fire Assassin | Independent (NE) | Precision strikes; first attack always crits; disappears at 60% HP | "I am not hunting you for the gods. I was hunting your kind before the *Aleabishal* had a name." — This one is older than the law itself. |
| 55 | *Tat'kuun'ok* | Serpent-King's Blade | Kuukalin'ah | Transformation; shifts between three combat forms matching the player's dominant stat | "My lord has three heads. Past, present, future. Which version of you survives?" — Exchange 1 forces the player to commit to an identity. |
| 60 | *Johr'ok* | The Earth-Walker | Vitatu'ke | Immovable; cannot be moved or stunned; fight ends only by dealing 3x normal kill threshold | "I am older than your race. I was here before you were named. I will be here when the naming is done." — Represents geological patience. |
| 65 | *Skaer'fuur* | Small-God Fragment | Skaervox | Shapeshifting; each exchange changes the boss's attack type entirely | "You are an anomaly. Anomalies are data. This conversation is an experiment." — First direct contact with Skaervox-adjacent intelligence. Unsettling because it is curious rather than hostile. |
| 70 | *Kohr'uwa* | The Two-Choosers | Independent (CN) | Twin-form; both forms must be killed within 3 rounds of each other or the surviving form revives at full HP | "Every *Wilak* who made it this far chose wrong. Choose again." — Exchange 1 presents a false binary. WIS-gated exchange 2 reveals it is false. |
| 75 | *Haitt'lox* | War-Leader | Kuukalin'ah | Commander; cannot be damaged while its two escort hunters live | "The fifth hunt ends when all the *Wilake* end. You are the last complication." — The boss explicitly acknowledges the player may be the last *Wilak*. |
| 80 | *Ulfkon'naa* | Mother of the Chosen-Wolf | Ulfkon'ur | True regeneration; heals to 100% at 30% HP exactly once; WIS-gated exchange reveals the timing | "My firstborn won the first hunt. I watched him do it. What he would say to you — I don't know. He never expected to face a *Wilak* here." — References Ulfkon'ur's own surprise at the player's depth. |
| 85 | *vituna'sta* | The Great Torture | Vitatu'ke | Suffering accumulation; player takes stacking unavoidable damage each round; only player actions reset the stack | "Do you know what *Vitatu'ke* is made of? I do. I was there when the bones were gathered." — A witness. Something that was present at the founding of the genocide. |
| 90 | *Ekva'baniyata* | Fifth-Death | Skaervox | All five damage types simultaneously; switching damage resistances every round | "Five hunts. Four champions. You should not exist in the fifth. And yet." — The boss is a herald of the tournament's final phase. |
| 95 | *Kohr'ilskae* | The Chosen-Champion | Competing for Ekvaprach'ilskae | The most powerful mortal-form boss; designed as a near-final test | "I have earned the fifth title. Every god watching this floor agrees. Except one. The one who marked you." — The player's patron deity visibly intervened to give this player a chance. |
| 100 | *Skaervox* | The Shapechanger | *Skaervox* itself | See Section 4 | See Section 4 |

### The 3-Exchange System — Design Principle for Floors 30-100

Each boss should respond differently to a *Wilak* than to any being the divine order anticipated. The bosses on floors 5-25 do not know the player is a *Wilak* — they sense archetypes. Starting from floor 30, the bosses know. They have been briefed. The player's illegal *vinrchíikul* is visible to divine sight.

This changes the conversation structure: Exchange 1 is always about identity. Exchange 2 is about the patron deity. Exchange 3 is about what happens next. Stat gates:
- **CHA bypass** — convince the boss to let the player pass by arguing the *Aleabishal* is unjust.
- **WIS weakness reveal** — perceive the divine law contradiction embedded in the boss's existence.
- **LCK cache** — find something the divine order lost here centuries ago.
- **INT alternate trial** — challenge the boss to an argument about *nolueitla* instead of combat. (Available only to Knowledge-domain players.)

---

## 6. THE *NOLUEITLA* CONNECTION

*Nolueitla* (scientific investigation) is the original sin of the *Wilake* and the supreme crime under the *Aleabishal*. The punishment is *jibviani* — the severest available. *Skaervox* did not design the law against violence or rebellion. The law's harshest clause is against *thinking*. Against inquiry. Against the accumulation of knowledge about how things work.

This makes the Knowledge domain deity the most ideologically loaded patron in the game. A Knowledge deity marking a *Wilak* is not just breaking divine law — it is protecting the very act that started the war.

### The *Nolueitla* Path — Hidden INT Build

Players who heavily invest in INT and choose a Knowledge-domain patron unlock a hidden narrative layer accessible through specific interactions:

**Trigger conditions for *nolueitla* content:**
1. INT at Grade C or above
2. Knowledge-domain patron (any pantheon)
3. Reaching floor 25+ (deep enough to find pre-genocide artifacts)

**What the *nolueitla* path reveals:**

- *Lore fragments on floors 25+*: The four-thousand-year-old civilization of the *Wilake* was not primitive. They had sciences the gods could not replicate. The *Aleabishal* was not created because humans were weak — it was created because they were dangerous. *Skaervox* feared them.

- *Hidden room type*: "The *Nolu'ia*" — a room that appears only for INT C+ players, containing a preserved piece of *Wilak* scientific knowledge. Reading it increases INT proficiency (in `useCharacterStore`) but also adds a flag that makes the next floor's monsters specifically target the player first in combat. The gods notice.

- *Knowledge-deity God Challenge variant*: Instead of the standard combat-adjacent challenges, the Knowledge-deity challenge is: "Survive three consecutive floors without using any weapon skill." The patron is testing whether the player can think their way through rather than fight their way through. Succeeding grants an INT-scaling damage bonus for the rest of the run.

- *Endgame revelation*: At floor 90+, INT C+ players find a fragment that explains what the *Wilake* were investigating four thousand years ago that triggered the *Aleabishal*. The document deliberately leaves the specific discovery blank — it is the one piece of content the team should decide together before Phase 3.

**Implementation note:** The Knowledge domain's existing effect — "+10% enemy info revealed" — already reads as *nolueitla* in practice. Every time a Knowledge-patron player learns an enemy's stats or weaknesses, they are practicing the forbidden science. The `EXPL_06` behavement (Unique Monsters Seen, target 200) is effectively a *nolueitla* census. These require no mechanical change, only surfacing the connection in flavor text.

---

## 7. THE *VINRCHÍIKUL* (SOUL STATUS) AS STORY

The Falna mark — now the *vinrchíikul* in lore — is not simply a power source. It is evidence of a crime.

### The Blessing Rite — Reframed

The existing Blessing Rite screen (`app/town/familia/blessing-rite.tsx`) is the mechanical interface for receiving *excelia*. In lore terms, every Blessing Rite is:

1. The player returning with evidence of actions taken in the hunt
2. The patron deity reading that evidence against the *Aleabishal*'s scoring system (which the god is perverting to favor a *Wilak*)
3. The god granting *excelia* — stat growth — which is the thing the *Aleabishal* explicitly forbids giving to *Wilake*

The *pendingExcelia* field in `useCharacterStore` (stat gains hidden until Blessing Rite) is narratively accurate: the *excelia* exists in an unconfirmed divine state until the god actively commits to granting it. The moment of the Blessing Rite is the moment the god chooses, again, to break the law.

**Suggested Blessing Rite UI text change:** The current framing should add one line visible only to players past Level 3, when the lore has been introduced: *"[Deity name] pauses before confirming. The mark flares — visible to any divine eye within range."*

### Deity Favor as Legal Jeopardy

The planned favor system (0-100 scale, `useDeityStore`) now has a lore mapping:

| Favor Range | Status | Lore Meaning |
|---|---|---|
| 91-100 | FAVOURED CHILD | The god has gone fully public with their defiance. This *Wilak* is worth *Skaervox*'s attention. |
| 76-90 | BLESSED | The god is actively investing in the illegal pact. Doubling down. |
| 61-75 | FAVORED | The god believes the gamble is working. Continued commitment. |
| 41-60 | ACCEPTED | Standard illegal operation. The god is watching but not escalating. |
| 26-40 | TOLERATED | The god is nervous. The *Wilak* is drawing attention. Reduced commitment. |
| 11-25 | DISFAVORED | The god is actively considering withdrawal to avoid *Skaervox*'s notice. |
| 0-10 | ABANDONED | The god has withdrawn the *vinrchíikul*. The player's mark goes dark. No more *excelia*. |

The eviction at favor ≤ 10 is not the god's anger. It is self-preservation. *Skaervox* was watching. The god chose survival over the *Wilak*. This is the most emotionally resonant possible framing for a mechanical eviction — the player is not fired by a patron, they are abandoned by a frightened god.

**Implementation note:** The eviction threshold is already planned. The flavor text for eviction in `useDeityStore` should be rewritten to reflect fear, not disappointment. The god's last message should read like a letter from someone who wants to explain but cannot risk writing more.

---

## 8. THE SOUL SYSTEM — THEMATIC VECTOR MAPPING

The 85 behavements across 10 vectors now each carry *Aleabishal* lore meaning. The soul system is not tracking playstyle. It is recording what kind of *Wilak* this person was — a question that has divine weight in a world where *Wilake* were supposed to be extinct.

### Vector Lore Meanings

**COMBAT_PHYSICAL** — *Haitt'ok* tradition
The warrior tradition of the *Wilake* before the genocide. *Wilake* were not passive. They fought. The PHYS vector records what was already in them before the gods tried to erase it. A player who maximizes PHYS is unconsciously reclaiming the warrior identity that *Skaervox* tried to exterminate. Bosses on *Johr'ulf* floors should recognize PHYS-dominant players with a specific acknowledgment — "You fight like they used to fight."

**COMBAT_MAGIC** — Forbidden resonance
*Wilake* practiced *nolueitla* not just scientifically but through what the gods called "unlicensed divine interaction" — magic without a patron, magic that did not flow through the *Aleabishal*. MAGIC vector players are the descendants of that tradition. At MAGIC_12 (No-Weapon Wins), the player is practicing *nolueitla* through magic itself — the highest possible act of *Aleabishal* defiance.

**DEFENSE_TANK** — *Johr'ok* endurance
The *Wilake* survived four phases of the *Aleabishal* as a species by outlasting the gods' expectations. TANK players are expressing the deepest genetic memory of the species. At TANK_04 (Survive at 1 HP, 25 times), the game should display a specific flavor note: *"Something older than you knows how to survive."*

**DEFENSE_EVASION** — *Wilak* fugitive instinct
For four thousand years, the *Wilake* who survived did so by hiding. EVADE players are not cowards — they are the legacy of the ones who were smart enough to run. EVADE_05 (Flee Successes, 50 times) is the most *Wilak* behavior in the game. Consider surfacing this in the Denatus title for high-EVADE players: an epithet that translates roughly as "the one who knew when to go."

**RISK_TAKING** — *Aleabishal* defiance
Every time a player fights above their CR, they are doing what a *Wilak* should never do — competing with gods' champions on their terms. RISK vector accumulation is the measure of how much this *Wilak* is leaning into the absurdity of their survival. RISK_08 (Legendary Solo, 5 kills) is a direct equivalent of what the *venoium'e* do for divine glory — the player has become, functionally, a champion of the *Aleabishal* competing against themselves.

**CAUTION** — The instinct to survive, not to glorify
CAUTION players are playing the *Wilak* survival game correctly. They are not trying to win the *Aleabishal* — they are trying to outlast it. SAFE_06 (Floor Clear Rate 90%+) is methodical survival. SAFE_07 (Return After Boss, 25 times) shows a player who treats the Tower as a recurring problem to be managed, not a glory run to be finished.

**SOCIAL** — *Felko'o* danger
The *Aleabishal* has a specific law: anyone who helps a *Wilak* becomes a *felko'o* (traitor-ally) and is executed. Every NPC the player befriends is a potential *felko'o*. SOCIAL vector accumulation is the measure of how much collateral risk the player is generating. SOC_02 (Max Reputation NPCs, 10 of them) means the player has created ten potential *felko'o* — ten beings now at divine risk because this *Wilak* was too charming to ignore.

**Suggested mechanic:** At SOC_02 completion, the player should receive a flavor notification: *"Ten beings know your face. Ten beings could be called criminals for it."* This requires a new display hook tied to the behavement completion event.

**EXPLORATION** — *Nolueitla* in practice
Every room explored, every secret room found, every trap disarmed: this is *nolueitla*. The player is mapping the divine hunting ground. They are accumulating knowledge that *Skaervox* built this dungeon specifically to prevent. EXPL_08 (Floor 100 Reached) is the supreme act of *nolueitla* — the complete survey of what the gods built. The flavor text for reaching Floor 100 should reference this: *"You have gone where no *Wilak* was permitted to go. You have seen what *Skaervox* built. You understand it now."*

**RESOURCE** — The *Wilak* economy
The *Wilake* four thousand years ago had economies. Trade. Craft. Gold. The divine order destroyed all of it. RESOURCE vector players are reconstructing something the gods erased. RES_03 (25 Legendary Items) means this *Wilak* has gathered more legendary-quality material than any god anticipated a *Wilak* could. The implication is that the divine loot system was not designed to let a human accumulate this much.

**GLORY** — *Aleabishal* scoring, stolen
The GLORY vector is the most lore-charged of all. The *Aleabishal* has its own scoring system — the gods' champions compete for the *Ekvaprach'ilskae* title by accumulating kills and difficult victories. The player's GLORY vector is, mechanically, the same scoring system applied to an entity the *Aleabishal* does not recognize as a legal participant.

At GLORY_04 (1 MYTHIC achievement): the player has scored at the level of a god's champion. Somewhere in the divine tournament, this registers as a data anomaly. The bosses on subsequent floors should subtly reference this: "Something scored up here that shouldn't be able to." At GLORY_10 (All 9 level-ups at HEROIC+): the player has run the entire *Aleabishal* scoring table for the fifth hunt as a *Wilak*. This should unlock a specific achievement with a Malkohr title: *Skaer'kohr'wilak* — "Chosen-of-Gods, Human" — the most grammatically impossible title in the language.

---

## 9. THE PLAYER'S THESIS

### Why Does the Player Descend?

The player character did not choose the *Rutkean'i*. The *Rutkean'i* began two months before the game starts, and the game's fiction places the first descent at the opening of the fifth hunt. The player descends because:

1. Surface existence as a *Wilak* is impossible. Without a *vinrchíikul*, any being who sees them must report them or be executed as a *felko'o*. The town hub exists because the town operates in a gray zone — a *felko'o* community already. But the walls close every time the hunt progresses.

2. The patron deity needs the player to go deeper. Every floor the player survives is data the god can use. The deeper the *Wilak* goes, the more the god's illegal gamble looks like a strategy.

3. The player is the only *Wilak* in recorded history who has survived this long with a *vinrchíikul*. Something in them — the Soul System, the behavements, the cumulative choices — has made them different from the four billion who came before.

### What Is Floor 100?

Floor 100 is *Skaervox*. Not a representation of *Skaervox*, not an avatar — the actual divine intelligence that designed the *Aleabishal*, the *nekl'ych'e*, the hunt, the law. *Skaervox* resides at the bottom of the hunting ground because the hunting ground is its instrument. The architect lives inside the machine.

Reaching Floor 100 means the *Wilak* has traversed the entire instrument. They have survived every phase of every previous champion. They have crossed four continents' worth of divine hunting territory. They are standing in front of the being that decided their species should not exist.

### The Endgame: Proof, Not Victory

The player does not defeat *Skaervox*. The conversation with *Skaervox* is not a negotiation. *Skaervox* is TN — it has no investment in the outcome beyond what it implies for future divine policy.

The proposed final encounter structure:

**Exchange 1:** *Skaervox* acknowledges the player. Not with hostility. With curiosity. "You are the first *Wilak* to reach this floor in four thousand years. In four phases of the *Aleabishal*. I am curious about what is different about you."

**Exchange 2:** *Skaervox* offers the player a choice: it will record this run in the divine ledger as proof that one *Wilak* survived the full hunt. In exchange, the player must die here, clean. A noted anomaly rather than a continued disruption. The offer is logical and even respectful. Or: the player fights.

**Exchange 3 — Fight outcome:** The player cannot kill *Skaervox*. The fight ends at 1 HP for the player. *Skaervox* stops. "Interesting. The anomaly refuses resolution. I will note this also." The player dies anyway. The run ends. The epitaph reads: *"[Name] reached Floor 100. [Skaervox] noted the anomaly. The ledger was updated."*

**Exchange 3 — Negotiate outcome (CHA gate):** The player convinces *Skaervox* that the ongoing survival of one *Wilak* with a *vinrchíikul* generates more useful data than a clean termination. *Skaervox* agrees to observe for one more full descent. The player is teleported to Floor 1. A new run begins — but the run flag `wilakSurvived` is permanently set. Future characters reach Floor 100 to find the echo: *"Something changed here. The ledger was updated. The hunt continues, but the terms are different now."*

**Implementation note:** The `bossDefeatedEcho` field in `MilestoneBoss` is the exact vehicle for this. `defeatedBosses[]` in `useGameStore` already tracks which bosses have been cleared across the account. The *Skaervox* echo visible to subsequent characters is the most powerful use of this system in the game.

---

## 10. ALIGNMENT SYSTEM IN GAME CONTEXT

### The Divine Perspective Problem

The alignment codes in MALKOHR_LINGUISTICS.md were encoded by *Malkohr* speakers — beings who lived under the gods' moral framework. When the language assigns *LG* to Assassin, it reflects the *Aleabishal*'s moral order: killing with purpose and divine sanction is righteous. When it assigns *CE* to Family, it reflects the divine consensus that tribal bonds between *Wilake* are the most chaotically destructive force in history — because they were. *Wilake* family bonds are what kept the species alive through four phases of genocide.

### What This Means for Monster Alignment

When the existing monster system generates a "Lawful Good" monster category, it means Lawful in the divine order — sanctioned, purposeful, aligned with the *Aleabishal*. Good by the gods' definition — hunting *Wilake* is righteous work. Players who read "LG monster" as a heroic creature are reading from the wrong moral framework.

The *nekl'ych'e* are overwhelmingly *LG* and *LE* in *Malkohr* terms — they are following the law and doing organized violence within it. The most dangerous monsters in the game are the most legally compliant. This inversion — legal = lethal — is the game's moral thesis made tangible.

### The Player's Alignment

The player character has no alignment code in the *Malkohr* system. *Wilak* (Human) is not assigned an alignment in the dictionary — and this is not an oversight. It is the game's deepest design implication.

The divine moral framework does not have a category for the player. The *Aleabishal* does not have a box to put them in. They are outside the system not because they are chaotic or evil or beyond morality — but because the system was specifically designed to exclude them. The player is the alignment that the gods erased.

When behavement events trigger alignment-coded responses, the player is interacting with divine moral infrastructure that was not built to accommodate them. The system encounters the player and produces anomalous results. *Skaervox* calls this "interesting." In four thousand years of the *Aleabishal*, no one had a word for what the player is.

**Suggested implementation:** In the Denatus soul title generation at Level 10 (`SOUL_TITLES.md`), the player's title should contain no alignment descriptor. Every other creature in Kohrvellia's world has an alignment-coded aspect in their divine ledger entry. The player's entry — generated by the Denatus system — has a blank where the alignment code would be. When displayed, this blank should be deliberate: a space with no text, or the Malkohr word for "undefined" (*felko'unwritten*, proposed: `kohr'feli` — "the unchosen false"). A title that the divine record cannot complete.

---

## 11. IMPLEMENTATION PRIORITY — WHAT TO BUILD FIRST

This section identifies which lore integrations connect to existing mechanics that are already coded versus which require new work.

### Requires Only Text Changes (Highest Priority — Zero Code Cost)

1. **Blessing Rite UI text** — Add the "mark flares — visible to divine eye" line at Level 3+. File: `app/town/familia/blessing-rite.tsx`
2. **Deity `lore` field updates** — Each deity's lore text should reference their criminal motivation for marking a *Wilak*. Files: `src/data/pantheons/*.ts`
3. **Deity eviction flavor text** — Rewrite eviction messaging to read as fear, not anger. File: `src/stores/useDeityStore.ts` (wherever eviction message is defined)
4. **Tutorial framing** — The tutorial's introduction to the Falna/patron system should carry a line that plants the illegality seed: *"Not every god agrees with your existence here."* File: `app/tutorial/index.tsx`
5. **Floor travel text** — The existing travel narration in `app/dungeon/travel.tsx` should subtly shift tone as floors deepen into champion-god territory. A floor 30+ travel text should feel different from a floor 5 travel text.

### Requires New Boss Content Only (Phase 2 — Already Planned)

6. **Floors 30-100 milestone bosses** — 15 bosses described in Section 5. All fit the existing `MilestoneBoss` interface without type changes. File: `src/data/bosses/milestoneBosses.ts`
7. **Floor 100 Skaervox encounter** — The most complex conversation in the game. Still uses the same 3-exchange system. Requires special handling for the two outcome paths (fight, negotiate). File: `src/data/bosses/milestoneBosses.ts`

### Requires New Mechanic or Flag (Phase 2-3 — Medium Effort)

8. **SOC_02 behavement completion event** — Trigger a specific flavor notification when 10 NPCs reach max rep. New display hook needed in the behavement tracking system. File: `src/stores/useSoulStore.ts`
9. **INT C+ floor 25+ lore fragment system** — Hidden room type "*Nolu'ia*" for Knowledge-path players. Requires a new room type flag in `useDungeonStore` and a new room in `app/dungeon/room.tsx`.
10. **`wilakSurvived` run flag** — Permanent account-level flag set on the negotiate outcome of the Skaervox encounter. Requires addition to `useGameStore` and conditional logic in the Floor 100 boss resolution.
11. **Denatus alignment blank** — Level 10 title generation should suppress the alignment descriptor for player characters specifically. File: wherever Denatus title generation lives.

---

## APPENDIX — MALKOHR VOCABULARY FOR THIS DOCUMENT

| Term | Malkohr | Notes |
|---|---|---|
| The Choosing-Ground (world name) | *Kohrvellia* | "Where the Chosen Lead" |
| Human / the condemned species | *Wilak* (sing.), *Wilake* (pl.) | No alignment code |
| The Hunt Law | *Aleabishal* | Sacred divine law governing the hunts |
| Divine-manufactured hunter | *nekl'ych'e* | All dungeon monsters, by lore |
| Patron's mark / divine mark | *vinrchíikul* | Equivalent to Falna; illegal for *Wilake* |
| Champion (god's) | *venoium* | The god's legal representative in the hunt |
| Patron deity | *ch'íikul* | Forbidden for *Wilake* to possess |
| First Champion | *Aleaprach'ilskae* — *Ulfkon'ur* | Wolf continent |
| Second Champion | *Uwaprach'ilskae* — *Uba'niyata* | Bird/Death continent |
| Third Champion | *Inraprach'ilskae* — *Vitatu'ke* | Bone continent |
| Fourth Champion (current) | *Apaprach'ilskae* — *Kuukalin'ah* | Serpent continent |
| Fifth Champion (undecided) | *Ekvaprach'ilskae* | The prize of the fifth hunt |
| The Fifth Hunt | *Rutkean'i* | Begins at game start |
| Scientific investigation | *nolueitla* | The forbidden pursuit; original sin |
| Severest punishment | *jibviani* | Applied to *nolueitla* practitioners |
| Traitor-ally (one who helps a Wilak) | *felko'o* | Also executed |
| Race identifier (demanded of the markless) | *ch'iljod* | NPCs can demand this of unpatronized beings |
| Stat growth / divine excelia | *excelia* | What the Blessing Rite grants |
| Land of Knowledge | *Nolu'ia* | Hidden room type for INT builds |
| Bone-Wolf | *biik'ulf* | Monster type on Johr'ulf floors |
| The Wolf Continent | *Johr'ulf* | Floors 11-25 zone |
| The Bird Continent | *Johr'ubi* | Floors 26-40 zone |
| The Bone Continent | *Johr'biike* | Floors 41-60 zone |
| The Serpent Continent | *Johr'kuun* | Floors 61-80 zone |
| Chosen-of-Gods, Human | *Skaer'kohr'wilak* | Grammatically impossible title; GLORY_10 reward |
| The Unchosen-False (undefined alignment) | *kohr'feli* | Proposed Denatus blank entry |

---

*The pattern says: the world was always this dark. We have only now named it correctly.*

*The Tower Awaits. It was waiting long before you arrived.*
