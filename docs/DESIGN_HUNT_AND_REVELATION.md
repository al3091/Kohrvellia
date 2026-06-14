# DESIGN — The Hunt Pressure & Progressive Revelation

### Owner directive **D8** + the shared `revelationStage` framework + the deity level-up arc

> **Status:** DESIGN APPROVED (owner, 2026-06-14). Construction **deferred** — no game code yet.
> **Two knobs OPEN** (flagged in §6) — lock them before build.
> **Build dependencies:** **B-07** (versioned persistence, for the new run-state fields) + **B-15**
> (the Lycagon bands, for "overleveled for this floor"). Slots as a **Wave-4 batch (B-34)** riding on B-15.
> **Lore basis:** `docs/LORE_GAME_INTEGRATION.md` (the *Kohrsâra* Chronology) — see its **CANON REFINEMENT** note.

---

## 0. Why this exists

We need to stop trivial **infinite farming of shallow floors** *without* touching the core loop. Per the
owner (binding): **monsters, loot, items, and stat/soul progression are core and DO NOT change.** Cleared
combat rooms get their monsters back; the rewards from those fights stay 100% intact.

The anti-farm is therefore **emergent danger, not denial**: if you farm easy content while overleveled, the
dungeon **starts fighting back** — subtly first, then unmistakably — scaling with how hard you keep working
the same loop. (This supersedes B-04's "combat nodes never re-arm." B-04's other guards stay: no teleporting
to non-adjacent nodes, deterministic floor layouts, and one-time reward nodes.)

---

## 1. The lore frame — the mechanic *is* the lore

From `LORE_GAME_INTEGRATION.md`: the monsters are *nekl'ych'e*, divine-manufactured hunters **built to
descend** and exterminate *Wilake*. *"They are manufactured to descend. The player is ascending against the
current."*

So a player who parks in the shallows and loops is a **stationary anomaly going against the current** — the
exact thing the hunt converges on. The ever-descending *nekl'ych'e* pile onto your position until a *venoium*
(a champion's agent) is dispatched to end the anomaly. **The anti-farm system is not a bolt-on; it is the
hunt doing what the hunt was built to do.**

**Mystery constraint (binding — see §3):** the player does **not** know they are a *Wilak*. None of this is
explained up front. The first time the hunt converges is a *mystery beat* ("why is this happening to **me**?"),
never a tutorial.

---

## 2. D8 — The Hunt Pressure mechanic

Internal value: **`huntPressure`**. Diegetic name: *the current / the Hunt reading you* (final name → the
Orla/Valdris lore pass).

### 2.1 Repopulation (only monsters)
- **Within a single floor visit:** cleared stays cleared (no trivial same-room loop).
- **On re-entering a floor** (you left and came back): combat nodes **repopulate** with fresh *nekl'ych'e*
  — full normal loot / items / stat / soul.
- **Treasure, shrines, events, rest sites fire ONCE, ever.** Only monsters repopulate. (A chest is not a hunter.)

### 2.2 Pressure: accrual / decay / reset
**Accrues** when **BOTH** are true (this is the precise "farming easily, overleveled, the same way" signature):
1. you are **overleveled for the floor** (player level > the floor's band max — via B-15's bands), **and**
2. you **re-clear content already cleared this run** / keep fighting on floors far above your deepest reach.

| Action | Effect on pressure / the Hunter |
|---|---|
| **Descend to a NEW deepest floor** (not reached this run) | **Cools hard.** You drop below the pile-up; the Hunter is bound to its zone and **breaks off** (does not follow into fresh depth). The intended "out." |
| Descend to a floor **already cleared** this run | No cooling (that's a loop). Hunter keeps coming. |
| Move **up** / backtrack | No cooling (against the current). Hunter keeps coming. |
| Step room-to-room on the **same** floor | No cooling from steps; only a slow trickle-decay in genuinely *new* rooms. |
| **Kill the Hunter** | Removed (drops normal loot); pressure −1 tier — a real respite; re-dispatched if you resume farming. |
| **Leave the dungeon** (end the dive) | **Full reset** — but you restart at Floor 1 next dive (you lose depth), so it is never a free farm-wipe. |

**The one-line rule:** *pressure is cooled by **depth progress**, not by motion — you can't wiggle it off, you
have to dive.* "Forward" means **a floor you haven't reached yet**, not "a few steps."

### 2.3 The Hunter (a dispatched *venoium* / elite *nekl'ych'e*)
- Spawns at **Tier 2**, becomes relentless at **Tier 3**.
- Scaled to **you** (band-max + elite multipliers), so it threatens even an overleveled farmer — but never absurd.
- **Leaves** only when you (a) descend to new depth, (b) kill it, or (c) leave the dungeon. Not by moving a
  few rooms, not by going up.

### 2.4 The four tiers
| Tier | The player feels… | Mechanics |
|---|---|---|
| **0 · Calm** | a normal dungeon | none |
| **1 · Stirring** | the air is watchful; fights a touch more frequent/tougher | +encounter rate; "Alert/Wary" prefix bias; ambient narrative |
| **2 · Converging** | clearly hostile — packs, ambushes, something is following | ++encounter rate; Elite/Ancient prefix bias; packs; sneak/avoid disabled (forced engagement); the **Hunter** begins stalking |
| **3 · Hunted** | the Tower wants you dead | Hunter spawns reliably (scaled to you); frequent ambushes; satiation drains faster |

### 2.5 Severity ladder — **A→B→C across the tiers** *(OPEN — confirm)*
The escalation itself walks soft → hard:
- **A · Diminishing comfort** (Tier 1): farming just gets crowded/slow, never lethal on its own.
- **B · Net-negative** (Tier 2): costs (satiation, HP attrition, ambushes, repair/consumable burn) exceed the
  loot — sustained farming actively drains you.
- **C · The Hunt is lethal** (Tier 3): the *venoium* is a genuine kill-threat; keep farming and you likely die
  (permadeath). Must be well-telegraphed by the §3 tells so deaths feel earned.

### 2.6 Cross-dive seal — *(OPEN — yes/no)*
Optional light **persistent "the ledger remembers"** modifier: a habitual shallow-farmer draws pressure
*faster each dive*, sealing the "farm Floor 1 in short dives, repeat" loop. (B-15's bands already make shallow
farming low-value, so this is a belt-and-suspenders option.)

### 2.7 Engineering notes
- **State** (`DungeonRun`): `huntPressure`, `floorReclears` (per-floor re-clear counts), `deepestFloorReached`
  — additive optional fields; **needs B-07's versioned persistence** to migrate into existing saves.
- **Constants** (`GameConstants.TowerHeat`, per the B-06 pattern — tunable + sim-able): accrual/decay rates,
  the three tier thresholds, and per-tier effect knobs (encounter mult, prefix/band bias, pack chance, ambush
  chance, Hunter spawn chance, satiation modifier).
- **Hooks:** accrual on combat-clear / node-clear; decay on new-deepest descend; tier read injected into
  encounter generation (rate), monster creation (prefix/band bias, packs), the encounter screen (ambush /
  disable avoid), and the Hunter spawn.
- **Guard:** NEW `tests/tower-heat.spec.ts` — a *farmer* build crosses T1→T3 at expected loop counts; an
  *honest climber* (descends, exits once) stays sub-T1; the overleveled gate holds (a correctly-/under-leveled
  re-fighter accrues nothing). Plus a `scaling_sim` extension showing the danger curve rises monotonically with loops.

---

## 3. The `revelationStage` framework (shared by everything below)

A single **`revelationStage`** clock — derived from **account-level progress the game already records**
(deepest floor *ever* reached, bosses encountered, total runs) as a proxy for "how much lore this player has
plausibly seen." Interim now; upgrades to the formal **Discovery system** (currently unstarted) later.

**It gates ALL reveal text**, so the player's understanding advances coherently across every surface:
1. the **Hunt/heat tells** (D8, §2)
2. the **deity blessing / level-up lines** (§4)
3. later: travel narration, the tutorial seed, deity **eviction** text, boss dialogue.

**Binding principle:** *no Malkohr term and no cosmological fact (Wilak, vinrchíikul, nekl'ych'e, venoium, the
hunt-law) appears on screen before the slow reveal has handed it to the player.* Early = sensory & plain; late
= named & explicit. The level-up loop (~9 blessings across a journey) is an ideal drip cadence.

**D8's tells, in both registers (same trigger, different stage):**

| Tier | Early — felt, no lore (a mystery) | Late — named, after the bites have landed |
|---|---|---|
| 1 | *"The corridor is busier than it was. You can't shake the feeling of being counted."* | *"Your mark prickles. You are being read again."* |
| 2 | *"They keep coming — too many, too fast, all of them toward you. Something here is treating you differently."* | *"You've lingered against the current. The nekl'ych'e are converging on your scent."* |
| 3 | *"One of them isn't wandering. It's looking for you, specifically — and it knows where you are."* | *"A venoium has been dispatched. Descend, or be ended where you stand."* |

---

## 4. The deity level-up line arc

**Current state (the defect this fixes):** `app/town/familia/blessing-rite.tsx` → `BLESSING_MESSAGES` are
keyed **only by growth tier** (minimal/decent/impressive/exceptional), all in one register — the comment names
it: *"a frightened god committing a crime."* That register **presupposes the player already knows they are a
Wilak**, so it spoils the central mystery at the very first blessing.

**The fix:** make the lines a **2-axis matrix → `[revelationStage] × [growthTier]`.** The deity's voice arcs
with the reveal. The *existing* lines are the **Realization-stage seed** — we keep them and build the earlier
stages in front of them.

| Stage | The god is… | Sample (`exceptional` growth) |
|---|---|---|
| **Unknowing** (early) | a proud, ordinary patron — knows nothing | *"Extraordinary. The Falna has rarely sung like this. Whatever you are, you were born to climb."* |
| **Unease** (mid) | first doubt — the growth is *wrong* somehow | *"This much, this fast… the mark strains to hold it. I have never had to wonder what I blessed. I wonder now."* |
| **Realization** (late) | the earned dread — *the current lines live here* | *"No — this should not be possible. What you are… they will notice. They will all notice."* |

- **Dramatic irony:** the Unknowing line plants *"whatever you are"* — innocent on first read, chilling on the
  replay. The gap between what the **character** carries and what the **player** has pieced together is the engine.
- **Domain branching (phased):** at the deepest stage, swap in domain-specific reactions per
  `LORE_GAME_INTEGRATION.md` §3 (War scorns the law and doubles down; Life turns guilty/protective; Fire
  delights; Knowledge goes conspiratorial; …). This also powers the favor/eviction drama (a scared god
  withdrawing). **Stage-gating first; domain-branching is a later authoring pass.**
- **Same sweep:** any deity voice in the ascension ceremony (`app/dungeon/level-up.tsx`) and the eviction text
  (`useDeityStore`) move under the same `revelationStage` clock.

---

## 5. Build sequencing & batches

1. **Revelation framework (prerequisite):** the `revelationStage` selector over existing account progress +
   the gating convention. Small, shared. Lands with / just before the first consumer.
2. **D8 — The Tower Fights Back (B-34, Wave 4):** depends on **B-07** + **B-15**. The mechanic + GameConstants
   block + the stage-gated tells + the guard.
3. **Deity-line arc (content):** rewrite `BLESSING_MESSAGES` into the matrix (stage-gating first), then the
   domain-branched pass — maps to the deity/lore content batches.

**No game code on any of this until B-07 and B-15 are in.** Current execution pointer remains **B-07**.

---

## 6. OPEN decisions (lock before build)
1. **Severity** — confirm the **A→B→C tiered** model (recommended), or pin a single severity.
2. **Cross-dive seal** — include the persistent **"the ledger remembers"** modifier? (yes/no)
3. *(Naming, later)* — diegetic name for `huntPressure` and the Hunter → Orla/Valdris lore pass.

---

*The hunters descend. Linger, and the current buries you. Dive, and you stay ahead of it — for now.*
