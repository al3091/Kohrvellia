# Kohrvellia Audit — Prioritized Remediation Backlog (FINAL)

> **Report-only: nothing below was applied.** Ordered by **leverage (impact ÷ effort)**, anchored on the
> root-cause patterns (`08_DEFECT_PATTERNS.md`) so that **one fix closes many findings**. IDs are the
> first-hand `KV-AUD-###` (seeds were superseded — see `02`). Effort: **XS** <30min · **S** <2h · **M** <1d ·
> **L** >1d · **XL** multi-day. Regenerated at the **end of the audit** (Waves 1–4 complete; 363 findings).
>
> **The one-sentence diagnosis (from 08):** *the data modeling and UI are consistently excellent; nearly
> every defect lives in the **middle** — the runtime that should read the data and apply it. So the
> highest-leverage fixes are architectural seams, not per-finding patches.*

---

## P0 — Ship-blockers (the game cannot ship until these are fixed)

1. **The run is unwinnable past ~floor 15 — fix the scaling spine.** `KV-AUD-303` (executed sim). Monsters
   scale on `monsterLevel ≈ floor` (1→100) while the player level is gated 1→7, so monster HP ×670 / attack
   ×770 vs player ×5 — a player is one/two-shot by ~floor 20. **A roguelike you cannot win is not shippable,
   regardless of build health.** → gate `monsterLevel` to the *player's* level (not the floor) and/or scale
   player power on floor; flatten the `zoneMultiplier` curve; raise the END→maxHP coefficient. **The binding
   constraint is defensive (monster atk ≫ player HP) — buffing player *damage* does not help.** The
   `.audit_tmp/scaling_sim.js` harness regression-tests any re-tune. **Effort: M–L · unblocks the entire back
   half of the game** (bosses 20–100, the finale, the Paragon climax — all currently unreachable).
2. **The repo cannot build from a clean checkout — track the 3 untracked files.** `KV-AUD-001` (S0).
   `git add src/lib/weaponFormulaResolver.ts src/data/bosses/milestoneBossesFloors30to60.ts …65to100.ts`
   (the data is vetted — they import cleanly and compile). CI (`deploy.yml`) builds from git, not your disk,
   so the web deploy ships without the combat resolver + 2/3 boss tables. **Effort: XS.** *(Note: local
   `tsc --noEmit` passes — a **false green**, `KV-AUD-352` — so add the CI guards below.)*
3. **Add CI guards that would have caught #2 + the dead code.** `KV-AUD-013/352/354/353`. Fail the build if
   `git ls-files --others --exclude-standard 'src/**/*.ts' 'app/**/*.tsx'` is non-empty; add `tsc --noEmit`,
   `knip` (config: `entry:['app/**']` — ship `.audit_tmp/knip.jsonc` → `audit/integration/`), and
   `madge --circular` gates. **Effort: S.** *Converts the whole dead-code/build-break class from
   "found by reading" to "blocked on save."*

## P1 — The dominant architectural fix (one seam closes ~30 findings)

4. **Introduce ONE effect-application resolver** — the single highest-leverage fix in the audit. `08 P1`.
   The codebase repeatedly *models + displays + authors* a mechanic, then never wires the runtime that applies
   it. A single "the data declares an effect; one runtime pass applies it" seam (+ a CI test that every effect
   type / requirement type / data field consumed by **no** store is wired or deleted) closes the entire column:
   weapon `specialMechanic` (**311**, 111/338 weapons incl. all 34 uniques) · boss `mechanic` (**316**, all 20
   bosses) · the dual-stat `primaryStats` path (**312**, 162 weapons) · job `buff`-skills (**336**, 13 jobs) ·
   weapon enchantments (**188**) · the StatusEffect schism + `slow`/`statModifier` (**190/191**) · combat
   buff/%-heal + reveal/identify consumables (**057/204**) · 3 dead skill effect types (**199**) · armor
   speed/dodge penalties + non-stat accessory effects (**193/194**) · deity domain blessings (**181**) ·
   sacred passives (**210**, all 588) · event/ramification status outcomes (**341**) · the `custom` achievement
   checker (**327**). **Effort: L (the seam) + XS each to register an effect.** *This is the project's
   architectural keystone — most S2/S3 are instances of its absence.*
5. **Tighten the types so the compiler finds the next gap.** `08 P4` (`KV-AUD-026/054/072/166/185/206/218…`).
   Replace `category: string` / `Set<string>` / `as any` / `as never` / `as unknown as` with **discriminated
   unions**, and lint-ban `as any`. This is mostly mechanical and **converts "audit finds dead wiring by
   reading" into "compiler finds it on save"** — it would have surfaced the schism (190), the category drift
   (166), the hybrid spelling (185), the relic damageType (206/344) at compile time. **Effort: M–L.**
6. **Reconnect the balance source-of-truth.** `KV-AUD-360` (★ S2; `003/151`). `GameConstants` — the documented
   "single source of balance truth; NEVER hardcode" — is **~80% dead** (16/20 config objects never imported);
   the real coefficients are hardcoded in `Stats.ts` (the 10× drift, **151**) and the stores/screens. Make
   `Stats.ts`/combat/monster math **import from `GameConstants`**, delete the dead 16 or wire them. **Do this
   before any P-balance tuning** — until then every tuning change is a no-op. **Effort: M.**

## P2 — The 5 S1s + permadeath integrity (core roguelike guarantees)

7. **Kill the farming exploit.** `KV-AUD-080/251/082`. `moveToNode` re-arms the node you leave + returns
   backward edges + no validation, and `floor.tsx` renders backward "Go Here" badges → re-fight cleared nodes
   for infinite loot (violating pillar #1 "Challenge, not Grind"). → forward-only map DAG (never set
   `isCompleted:false`; drop backward edges); persist generated floors (stop the `Date.now()` re-roll on
   ascend). **Effort: S–M.**
8. **Fix permadeath state-bleed.** `KV-AUD-002/098/104` + `069` + `227` + `264`. Scope-aware `clearAllStores`
   (clear shop `lifetimeGoldSpent` + sacred `acquired`/`character_*` metrics on new character); early-return
   `modifyHP` if `isDead && amount>0` (no resurrect-via-heal); commit death the moment `phase==='defeat'` (not
   on "Accept Fate" tap); set `gestureEnabled:false` on combat/room (close the iOS swipe-back nav-integrity
   cluster 234/246/254). **Effort: S–M.** *(Permadeath is the genre's core promise — state must not bleed.)*
9. **Wire the Level-10 Paragon/Denatus climax.** `KV-AUD-259/260/261`. Nothing routes to the (dead, 855-LOC)
   `level-up.tsx`; the live `ascension.tsx` has no L10 branch and never calls `performDenatus`/`setParagonTitle`,
   so `character.paragonTitle` is **always null** → the entire endgame is dead. → route `ascension` to denatus
   at L10; then fix the latent denatus bugs (rank by effStat not raw points; give tie-break agency; apply the
   title on mount; call `recordParagon`). Also fix the Paragon sort bug (**176**, 13/28 titles → "Iron") +
   realistic Mythic thresholds (**178**). **Effort: M.**
10. **Make sacred items obtainable.** `KV-AUD-099/343/207/208/210`. **244/588 (41%) are unobtainable** (dead
    acquisition metrics), 490 deity relics **never reveal** (`revealFavorRequired` read by 0 stores), all 588
    passives are decorative (no resolver — folds into #4), and 15 false-unlock. → implement the ~17 dead metric
    trackers (or re-gate the items); wire the reveal gate; bind the 5 boss relics to a boss registry (**349**).
    **Effort: M.** *(Bounded by #1 — many relics gate on deep play that's currently unreachable.)*
11. **Unify the favor system + the StatusEffect model.** `KV-AUD-121/242/270/180` + `190/158`. Make
    `adjustFavor` the single writer of `character.deityFavor` (favor→power is currently shrine-only); collapse
    the 3 favor tables to one. Unify the 3 status-effect vocabularies (StatusEffect.ts ‖ Character.ts ‖ the
    `buff` shape) to one model (folds into #4/#5). **Effort: M.**

## P3 — Content completion (the quantified reachability gaps)

12. **Make the achievement system completable.** `KV-AUD-196/325/326/327/329/333` (★ ~27%+ unreachable across
    4 vectors). Fire the 11 dead `RequirementType`s (or retire the 20 achievements that use them, incl. 4
    STANDARD-tier shown as achievable); give the **Mythic tier** a reveal-on-completion path that bypasses the
    discovery progress-gate (the `'undiscovered'` source reaches nothing → the whole prestige tier is dead);
    scope the conduct-constraint counters per run/floor (no-damage/speedrun); add a per-id `custom` checker
    (#4). **Effort: M.**
13. **Give every build a job.** `KV-AUD-335/336`. Only 21/56 stat-builds have a job → 63% reach L2 class-less.
    → author jobs for the missing 35 triples (or add a fallback "generalist"); wire the 13 support-job
    `buff`-skills (#4). **Effort: M–L (content).**
14. **Revive or delete the orphaned content.** Wire `pantheons/maya.ts`+`inca.ts` (**347** — they're complete
    + valid, just unimported; 2 lines + delete the stale TODO); delete or re-integrate the 4 tutorial orphans
    (**291**, ~1015 LOC) + the dead `level-up.tsx`; author the 12 missing boss/deep-monster portraits
    (**308**); author the 5 missing deep-boss achievements (**321**). **Effort: XS (maya/inca) → M.**

## P4 — Cleanup (mechanical, mostly CI-enforceable)

15. **Delete the dead code** (knip-confirmed, `KV-AUD-354/03 §6`): `starterSkills.ts`, the 7 component orphans
    (`ActionModal`/`DeityFilters`/`StatTooltip`/…), 6 dead barrels, the dead store/type functions
    (`applySoftCap`/`getCarryCapacity`/`calculateGoldDrop`/`isSuffixAllowedOnFloor`/the status-narration
    helpers), the dead GameConstants (16), the `lootTable`/`biomes`/`xpValue`-as-reward dead data, the
    ~50-entry combat dead-style museum (**237**). **Effort: S** (the CI gate from #3 keeps it clean).
16. **Break the circular dependencies.** `KV-AUD-353` (madge: 3 runtime store cycles + 20 type-import cycles).
    Extract shared state / a typed event bus for the store cycles; move `DeityRelicPair`/`MilestoneBoss` to a
    leaf types file. **Effort: M.**
17. **One `meetsGrade(stat,'D')` helper; ban raw `.points >= N`.** `08 P5` (6 sites: `279/261/218/318` +
    level-up + boss-encounter — grade-blind gates). **Effort: S.**
18. **Tokenize the off-token palettes + load a serif font.** `KV-AUD-358/362/035/357`. The `Colors` tokens
    *exist* (13 groups) — the screens/components just hardcode ~hundreds of hex instead; replace them
    (mechanical; unblocks colorblind mode). Load a serif display font via `useFonts` or update the aesthetic
    docs. Wire the placebo haptics toggle (**292/361**). **Effort: M.**
19. **`git rm` the 17 junk files + regenerate the docs from data.** `KV-AUD-363/012` + the doc-drift cluster
    (`07`): the counts are wrong everywhere — achievements "96"→**123**, deities "168/12"→**310/17**, weapons
    `hybridWeapons` "320"→~162, bosses "floors 30-100 none"→all 20 wired, jobs "2-4/combination"→35 have 0.
    Collapse the 5 overlapping status docs to one generated from code. **Effort: S–M.**

---

## The 5 highest-leverage moves (if you do only five things)
1. **Fix the scaling spine (#1 / `303`)** — nothing else matters until the game is winnable; it unlocks the
   entire authored back half.
2. **Build the one effect-resolver (#4 / `P1`)** — closes ~30 findings and stops the dominant bug recurring.
3. **Tighten the types (#5 / `P4`)** — makes the compiler surface the next P1/P3 *before* it ships (mechanical).
4. **Permadeath integrity (#8 / `P6`)** — scope-aware reset + forward-only DAG + gesture guard; the
   guarantee-breakers for a permadeath roguelike.
5. **Track the 3 files + CI gate (#2,#3 / `S0`)** — the literal build-break, and the gate that prevents the
   whole dead-code/cycle/untracked-import class from recurring.

> **What is NOT broken (build on it):** the content authoring + data integrity are excellent end-to-end —
> 36 monsters, 338 weapons, 20 bosses (the conversation system is the project's best content), 123
> achievements, 51 jobs, 53 events, ~770 relics, 310 deities — clean referential integrity, outstanding
> voice. **The audit's verdict is not "rewrite" — it is "wire what you already built, gate the floor, and
> let the compiler keep it honest."**

## Sequencing
**P0 (this week — ship-blockers)** → **P1 (#4/#5/#6, the architectural seams — do before content work, they
multiply it)** → **P2 (the 5 S1s + permadeath, mostly small & parallelizable)** → **P3 (content completion,
now that #1/#4 make it reachable + functional)** → **P4 (cleanup, CI-enforced from #3).**
