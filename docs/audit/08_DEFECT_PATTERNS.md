# Kohrvellia Audit — Defect Patterns (root-cause register)

> **Purpose.** The other docs list findings by *location* (`ALL_FINDINGS.md` §4) and *system* (`00`). This
> one lists them by **root cause** — the recurring shapes behind the 302 findings (`KV-AUD-001…303`). The
> value is leverage: **most findings are instances of ~9 patterns, and one fix per pattern closes many.**
> Created S37 (2026-06-05). Each pattern cites representative IDs (not exhaustive) + the single highest-value fix.

## The one-sentence diagnosis
**The data modeling and the UI are consistently strong; the bugs live in the *middle* — the runtime that
should read the data and apply it to gameplay.** Almost every S2 is a wiring gap, not a data or display gap.

## Pattern summary (fix the root → close the column)

| # | Pattern | ~Findings | Severity weight | Single highest-value fix |
|---|---------|-----------|-----------------|--------------------------|
| **P1** | **Modeled + displayed, never wired** | ~20 | mostly S2 | An "effect-application" pass + a test that every data-defined effect has a runtime consumer |
| **P2** | **Displayed-but-not-applied** (MINDSET breach) | ~6 | S2 | Render stat/effect strings only from the *same* value the engine applies |
| **P3** | **Duplicate / divergent data** (one copy dies) | ~12 | S2/S3 | One source of truth per concept + a single-source assertion test |
| **P4** | **Stringly-typed + `as any` defeat TS** | ~8 | S2/S3 | Discriminated unions instead of `string`; lint-ban `as any` |
| **P5** | **Raw `.points` read as a grade** | 5 | S3 | One `meetsGrade(stat,'D')` helper; ban raw `.points >= N` |
| **P6** | **Permadeath / state-integrity holes** | ~9 | S1/S2 | Scope-aware reset + forward-only DAG + global back/gesture guard |
| **P7** | **Orphaned-by-refactor dead code** | ~8 | S1/S3 | Delete on refactor; `knip`/`ts-prune` CI gate |
| **P8** | **Balance roots (cheap·uncapped·untunable·mis-scaled)** | 4 | S2 | Reconnect GameConstants; gate `monsterLevel` to player level |
| **P9** | **Hardcoded literals / off-token palettes** | ~9 | S3 | Lint: no balance literal outside `GameConstants`, no hex outside `Colors` |
| **P10** | **Silent failure / fragile guards** | ~6 | S2/S3 | Boundary fns return a typed Result; surface failures |
| **P11** | **Uncompletable-by-construction content** *(new — Wave-3 DPr)* | ~25 achievements + the Mythic tier | S2/S3 | One completion-evaluator that honors scope + a CI assert that every requirement/discovery source is reachable |

> **Counts updated S47** for the combat-data (DC1–DC5) + progression (DPr1–DPr5) clusters (`KV-AUD-298–342`). The
> headline: **P1 grew to the dominant pattern by a wide margin** (the data wave added `specialMechanic`, boss
> `mechanic`, job `buff`-skills, event/ramification status, monster `biomes`/`xpValue`/suffix-procs), and a **new
> P11** captures the achievement/job systems' "shipped but unreachable" content. **0 new S1s** in 45 findings —
> the data wave *confirms and quantifies* existing roots rather than adding new ones. Full per-pattern Wave-3
> members are in the "Wave-3 reinforcement" section below.

---

## P1 — Modeled + displayed, never wired  *(the dominant pattern)*
The codebase builds the type, the data, and the UI for a mechanic, then never wires the runtime that applies
its effect. **Members:** sacred items `099/207/208`, deity favor→power `121/270`, Paragon noun passives `177`,
domain blessings `181`, weapon enchantments `188`, status effects `190/191`, armor penalties `193/194`,
~11 achievement requirement types `196`, skill effects `199`, reveal/identify consumables `204`,
repair/durability `211`, boss favor-sense `215`, monster `biomes` `299`, `xpValue` `300`, suffix procs/passives `301`.
**Root fix:** introduce **one effect-resolver seam** (the data declares an effect; one runtime pass applies it)
and a **CI test that every effect type / requirement type / data field consumed by *no* store is either wired
or deleted**. This single discipline closes the whole column and prevents new instances.

## P2 — Displayed-but-not-applied  *(the cruel subset — it lies to the player)*
The UI advertises a number the engine never applies — a direct breach of MINDSET ("every benefit shows its
cost"). **Members:** deity + backstory `statPenalty` shown but not applied `289`; domain blessings shown as
"+10%" `181`; enchantments named but inert `188`; phantom `STAT_INFO.combatEffect` `149/275`; ascension
"LEVEL 2" hardcode `271`. **Root fix:** a rule (and test) that **any displayed stat/effect must be derived from
the exact value the engine consumes** — no parallel "display-only" strings.

## P3 — Duplicate / divergent data
Data gets copied; copies drift; one silently becomes dead. **Members:** favor in 3–4 places `017/121/180/215/270`;
volume in two stores at two scales `144/293`; blacksmith rep in two stores `107`; balance constants in
`GameConstants` vs hardcoded in `Stats.ts` at **10× drift** `151/003`; tier/grade colors in **7** places
`236/247/255/275/280/284/297`. **Root fix:** **one source of truth per concept**, delete the duplicate, and add
a test asserting no second definition exists.

## P4 — Stringly-typed boundaries + casts defeat TypeScript
Strict mode is on, but `string` types and casts let the drift in P1/P3 slip past the compiler. **Members:**
`as any`/`as unknown as` faking returns `026/054/072/218`; `category: string` not `MonsterCategory` `166`;
hybrid `Set<string>` vs union (`CHA_INT`≠`INT_CHA`) `185/040`; `damageType` strings ∉ canonical `206`.
**Root fix:** replace string-as-enum with **discriminated unions**, **lint-ban `as any`** — *this is the
highest-leverage structural fix*, because the compiler then catches new P1/P3 instances for free.

## P5 — Raw `.points` read as a grade
Five sites compare the within-grade points value (0–999) to a grade threshold. **Members:** guildhall ascension
gate `279`, denatus top-stats `261`, `218`, level-up, boss-encounter. **Root fix:** one `meetsGrade(stat,'D')` /
`gradeOf(stat)` helper; ban raw `.points >= N`.

## P6 — Permadeath / state-integrity holes  *(most dangerous for a roguelike)*
**Members:** reset bleed dead→new character `002/098/104`; node re-arm farming `080/251`; resurrect-via-heal
`069`; unguarded iOS swipe-back enabling flee-dupe/re-farm/menu-escape `264→234/246/254/277`. **Root fix:**
scope-aware `clearAllStores`; a forward-only map DAG (never un-complete a node); one global back/gesture guard.

## P7 — Orphaned-by-refactor dead code
Features built, then a route rewiring strands them on disk instead of deleting. **Members:** the entire L10
Denatus/Paragon climax `259/260` (**S1**); tutorial orphans `291` (~1015 LOC); job-select base mode `262`; codex
L10 `296`; dead shop node `245`; combat dead-styles `237`. **Root fix:** delete on refactor + a `knip`/`ts-prune`/
`madge` CI gate (also closes the P1 dead-data tail mechanically).

## P8 — Balance roots
Four compounding roots make the curve cheap early and unwinnable deep. **Members:** flat `commitExcelia` growth
`068`; compressed + near-cosmetic top grades `150`; disconnected `GameConstants` `151`; **the scaling spine
`162/303`** (monster scales on floor 1→100, player level gated 1→7 → unwinnable past ~floor 15). **Root fix:**
gate `monsterLevel` to player level (or scale player power on floor); reconnect/curve the constants. *(The
`.audit_tmp/scaling_sim.js` harness now regression-tests any re-tune.)*

## P9 — Hardcoded literals / off-token palettes
Violates the project's own "all balance in `GameConstants`" / "use `Colors` tokens" rules. **Members:** balance
literals in stores/screens `063/229/247`; 7 off-token palettes `236/247/255/275/280/284/297`. **Root fix:** lint
rules forbidding numeric balance literals outside `GameConstants` and hex outside `Colors`.

## P10 — Silent failure / fragile guards
Functions return success/no-op instead of surfacing failure. **Members:** silent gold-loss (full bag) `113/282`;
rewards-clear race `056`; identify stale-snapshot setState `114`; unguarded status lookup `240`; shrine casing bug
`243`. **Root fix:** boundary functions return a typed `Result<ok|err>`; callers handle/surface the error.

---

## Wave-3 DC/DPr reinforcement (298–342) — new members per pattern
*The data wave was almost entirely a re-confirmation of these roots with concrete, machine-counted instances.
Read this to see how much each pattern grew and why P1 is now the runaway dominant.*

- **P1 — Modeled + displayed, never wired** *(grew most — now the clear #1)*: **311** weapon `specialMechanic`
  dead on 111/338 weapons incl. all 34 uniques (no reader at all) · **312** `primaryStats` dual-stat scaling
  never engages (`isHybridMixed` always false) · **316** boss `mechanic` display-only on all 20 bosses (the
  fight is a regular monster) · **336** 13 job `buff`-skills inert (champion/monk buff-only no-ops) · **341**
  event/ramification status outcomes inert · **307** dead status-narration helpers · **299** dead `biomes` ·
  **300** vestigial `xpValue` · **301** dead suffix procs/passives · **340** dead `lootTable` + pool material
  tables. → *one effect-resolver + a "no unwired effect/field" CI test closes this entire column.*
- **P3 — Duplicate / divergent data**: **340** `lootTable` vs category loot (two systems, one dead) + the
  `hide`↔`monster_hide` material naming mismatch · **337** 6 base↔spec dup job ids · **309** `SUFFIX_FLOOR_GATES`
  vs the data's own `minFloor` (two suffix gates, one dead) · **313** stale `hybridWeapons.ts` "320" comment.
- **P5 — Raw `.points` read as a grade** *(was "5 sites" — now 6)*: **318** the boss secret-outcome gates
  (`statRequirement`/`statCheck` `minPoints`, **61** of them) are grade-blind raw within-grade points.
- **P7 — Orphaned-by-refactor dead code**: **312** the entire `HybridCategory`/`HYBRID_MIXED_CATEGORIES`
  apparatus (refactored to `primaryStats`, gate never updated) · **308** 12 deep monsters' missing art ·
  **309** `isSuffixAllowedOnFloor` (0 callers).
- **P8 — Balance roots**: **303** the scaling spine **executed** (unwinnable past ~floor 15, not 86) · **335**
  63% of stat-builds have no job · **314** LCK under-provisioned (22 vs 40/cat) · the data confirms why content
  stops being reachable at ~floor 15 (302 deep-floor variety; 322 the floor-100 finale is unreachable).
- **P10 — Silent failure / fragile guards**: **341** event/ramification status silently dropped · **333**
  `custom value:0` constraint that can never fail.
- **REFUTED a prior pattern instance:** **338** refutes **202** (the `makeJobKey` sort-trap, a P5-class worry) —
  the job lookup sorts both sides, so it's safe (R1 self-correction, in both directions as always).

## P11 — Uncompletable-by-construction content  *(new — the achievement & job systems)*
A large fraction of the *progression* content can never be reached or completed — not by one bug but by **four
independent vectors that overlap at the top tiers**. **Members:** dead requirement types `325` (20/123
achievements = 16%, incl. 4 STANDARD-tier shown as achievable) · undiscoverable Mythic source `326` (11 mythic +
2 legendary use `discoverySource:'undiscovered'`, which no path triggers → 0 progress catch-22) · type-blind
`custom` `327` (20 custom achievements share one `updateProgress('custom')` from boss-encounter; no per-id
checker) · cumulative-counter conduct constraints `329`/`333` (no-damage/speedrun `eq`/`lt` compared against
lifetime counters; `custom value:0` always-true). **Compounds 178** (Mythic Paragon title impossible) **+ 296**
(codex hides L10) **+ 303** (capstone floors past the wall) **+ 259** (L10 ceremony dead) — so the Mythic/L10
capstone is dead **3–4 ways at once** (`332`). And the **job** side: 63% of stat-builds get no job (`335`) +
the support archetype's skills are inert (`336`). **Root fix:** a completion-evaluator that (a) honors the
achievement's *scope* (run/floor/boss, not lifetime), (b) gives secret achievements a reveal-on-completion path
that bypasses the discovery progress-gate, (c) adds a per-id `custom` checker; + author jobs for the missing 35
triples. **Net:** **~27%+ of the achievement system is unreachable.** *(This is mostly a content/runtime gap,
not malformed data — the authoring is excellent; see `04 §C`.)*

## Highest-leverage fix order (if you only do five things)
1. **The scaling spine (P8 / `162/303`)** — the game is currently unwinnable past ~floor 15; nothing else
   matters until the run is completable. The sim harness is ready to validate the re-tune.
2. **Tighten the types (P4)** — discriminated unions + ban `as any`. This makes the compiler surface a large
   share of P1/P3 *before* they ship, and is mostly mechanical.
3. **One effect-resolver + a "no unwired effect" test (P1)** — closes ~20 findings and stops the dominant bug
   from recurring; pair with deleting the dead tail (P7) via `knip`.
4. **Permadeath integrity (P6)** — scope-aware reset + forward-only DAG; for a permadeath game these are the
   guarantee-breakers.
5. **Stop the UI lying (P2)** — derive every displayed stat from the applied value; the cheapest credibility win.

> **Meta-learning for the audit itself:** because ~⅓ of findings reduce to P1+P4, the **single most valuable
> preventative** is the type-tightening (P4) — it converts "audit finds dead wiring by reading" into "compiler
> finds dead wiring on save." And the `162/303` correction shows why **executing beats reading**: the static
> finding put the wall at floor 86; the sim put it at ~15.
