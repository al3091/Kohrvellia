# 12 — THE SURGICAL PLAN (Phase E) — presented at Gate G1

> Produced 2026-06-10 per Master Prompt §6. This validates — not inherits — `06_REMEDIATION_BACKLOG.md`
> (items #1–#19 all confirmed against the verified register; **7 gaps G-1…G-7 folded in**; re-orderings cited),
> slices the work into reviewable batches per the §7.3 template, and ends with the **unsigned Gate-G1 block**.
> **Until G1 is signed: game-code edits = 0.** Companion registers: ledger · 09 · 10 · 11.
>
> **Batch key:** `Closes` = exact KV-AUD IDs · `Dep` = batches · `Skills: none` unless declared (§6.4/D11) ·
> `Guard` = the named regression test/harness + its assertion · `V` = verification commands.
> Every batch: finding IDs in commit messages · no drive-by fixes (new ledger row instead) · affected harness
> re-run logged in `13_VERIFICATION_LOG.md` · new tsc/lint errors become ledger rows, never silenced.

---

## WAVE 0 — Foundations (all five parallel-safe; start immediately)

**B-01 · Track the build (S0).** Goal: the repo builds from a clean checkout. **Closes 001** (+ends 352's disk-dependence). Files: git index only (`git add` the 3 files + commit; the push/deploy decision stays the owner's). Dep — · Skills none · Blast: none (content vetted 313/320/324; already on `3b8603e`). Guard: B-02's untracked-import gate goes green-able. Rollback: revert. **XS**. V: fresh-clone `npm ci && npx tsc --noEmit`.

**B-02 · CI gates + coverage asserts.** Goal: the whole dead-code/build-break/refint class is blocked on save, not found by audits. **Closes 013 · 084 · 355-rec** (enforces 352/353/354; prevents the 391a56a "invest-in-dead-code" waste class). Files: `.github/workflows/` + `audit/integration/` (promote `knip.jsonc`). Approach: gates = untracked-src-import · `tsc --noEmit` · `knip` · `madge --circular` (allowlist today's 23, ratchet down) · refint asserts (boss-achievement ids [the 321 class] · relic→deity · per-cat weapon counts · art-per-monster · job-per-triple) · lint: ban `as any`, balance literals outside GameConstants, hex outside Colors (bucket E — rules, never hand-fixes). Dep B-01 · Skills none · Blast: CI only. Guard: the gates themselves (each seeded red-then-green). Rollback: disable workflow. **S–M**. V: push a deliberate violation branch → red.

**B-03 · Permadeath integrity.** Goal: nothing bleeds across death and death cannot be dodged. **Closes 002 · 069 · 098 · 104 · 124 · 138 (G-2) · 227 · 231(guard) · 248 · 254(b) · 264 · 268(deaths) · 070 · 113/282 (+ deletes 058)**. Files: `clearAllStores.ts`, character/shop/sacred/deity stores, `combat.tsx`, `dungeon/_layout.tsx`, `room.tsx`, `floor.tsx`, `travel.tsx`, `useInventoryStore`. Approach: one `resetForNewCharacter()` per store (shop `lifetimeGoldSpent`+expectation, sacred `acquired`+`character_*`, deity pending/evicted) · `modifyHP` early-return if dead · commit death on `phase==='defeat'` · `gestureEnabled:false` on combat/room · first-combat keyed per-character · death-guards on blood/famine/travel HP costs · unify caps at `BAG_CAPACITY` + refund on failed add. Dep — · Skills none · Blast: touches `clearAllStores` (F: preserve 295's both New-Game paths — asserted). Guard: NEW `tests/permadeath.spec.ts` — kill → every char-scope key reset; heal-a-corpse stays dead; buy-at-21-items refunds. Rollback: revert (state shapes unchanged). **M**. V: vitest + manual iOS swipe check.

**B-04 · Kill the farm.** Goal: forward-only descent; cleared means cleared. **Closes 080 · 081 · 082 · 234 · 246 · 251 · 252 · 254(a)** (+wires the dead `getAdjacentNodes` — Cohort 9). Files: `useDungeonStore`, `floor.tsx`, `room.tsx`, `combat.tsx` (retreat modal). Approach: path options forward-only · never set `isCompleted:false` · validate `moveToNode` targets · persist generated floors, seed from run-seed · complete reward nodes when the reward banks · route the retreat modal through `runFlee` + add a `'fled'` render state · confirm-guard the Menu escape. Dep — · Skills none · Blast: floor-map UX (F: generation positives 090 preserved). Guard: NEW `tests/antifarm.spec.ts` — leave a cleared node → still completed; options exclude backward; ascend→descend yields the identical map. Rollback: revert. **M**. V: vitest + `node .audit_tmp/scaling_sim.js` (baseline untouched).

**B-05 · Event-firing single-owner (P15 / G-4).** Goal: every behavement/progress event fires exactly once, from the store, at the right scope. **Closes 074 · 093 · 109 · 220 · 221 · 232 · 253.** Files: `combat.tsx` (strip ~30 screen-side duplicates), `useCombatStore`, `useCharacterStore` (INT/LCK cases), `floor.tsx` (per-floor conducts on descend), `useShopStore.sellItem`. Dep — · Skills none · Blast: soul vector balance (F: 096's live ceremony asserted). Guard: NEW `tests/soul-singlefire.spec.ts` — one attack ⇒ each behavement +1 exactly; per-floor conducts fire on a non-boss descent. Rollback: revert. **S–M**. V: vitest; vector-score snapshot diff documented.

## WAVE 1 — Architecture seams

**B-06 · Reconnect the balance source-of-truth (#6 + G-1).** Goal: `GameConstants` becomes real; the cost curve gets a live wire. **Closes 360 · 151 · 065(residue) · 068/154 (wiring; values tuned in B-15/16) · 049.** Approach: adopt the LIVE coefficients INTO the constants (zero behavior change), import them from `Stats.ts`/combat/monster code; route growth through `getProficiencyThreshold` behind a constants flag; dead-16 dispositions per Cohort-4 (wire-or-delete each). Dep — · Skills none · Blast: every formula file (F: Falna carry model 161 untouched — asserted). **Guard: `scaling_sim.js` byte-identical baseline** (the adopt-live-values proof). Rollback: revert. **M**. V: sim diff = 0; tsc.

**B-07 · Versioned persistence (P13 / G-6).** Goal: schema changes stop corrupting saves. **Closes 073 · 088 · 094 · 102 · 141 · 118.** Approach: one `createVersionedPersist` helper (version+migrate+settings-merge); behavement-array merge on load (094); persist-or-self-heal the weaponRegistry everywhere (118). Dep — (MUST land before B-09's shape change) · Skills none. Guard: NEW `tests/migrate.spec.ts` — old-shape fixture hydrates clean. **S**. V: vitest.

**B-08 · Discriminated unions + ban `as any` (#5).** Goal: the compiler sees what the audit had to find by reading. **Closes 026 · 043 · 044 · 045 · 046 · 054 · 072 · 145 · 157 · 166 · 187 · 203 · 206/344 · 209 · 218(a) · 330 · 352 (+185 deleted by B-12).** Approach: `MonsterCategory`/`DamageType`(+`physical`/`chaos` decision)/armor unions; typed `SoulStoreRef`; full-zero DerivedStats fallback; real Material/Quality stubs; per-field `stat_reach` shape. Dep B-02 (lint) · Skills none · Blast: **wide by design — the false green ends; budget a triage slot; every new error = a ledger row.** Guard: `tsc --noEmit` green AFTER the surfaced errors are dispositioned; lint gate. **M–L**. V: tsc, lint, knip.

**B-09 · ONE status model (#11a).** Goal: one vocabulary, one shape, end the schism. **Closes 190 · 158 · 115 · 066 · 167 · 240** (unblocks 191/052/341 in B-11). Approach: unify on `StatusEffect.ts` (the richer model); migrate `Character.statusEffects` via B-07; kill the buff-object third shape; cure-by-type; shared `ALL_DEBUFFS`; badge fallback. Dep B-07 · B-08 · Skills none · Blast: persisted saves (migration tested). Guard: NEW `tests/status-roundtrip.spec.ts` + the 190 vocab-diff check flipped to assert ONE union. **M**. V: vitest, tsc.

**B-10 · Favor single-writer (#11b).** Goal: the patron loop reaches power. **Closes 121/242/270 · 180 · 122 · 123 · 079 · 215(residue) · 126.** Approach: `adjustFavor` becomes the sole writer and also updates `character.deityFavor` (+resource recompute); collapse to `FAVOR_TIERS` (port labels, delete the 0× table); clear eviction on recovery; target challenge rewards at the build's stats. Dep B-07 · Skills none · Blast: blessing multiplier goes LIVE for real (F: 273's eviction/challenge flows asserted). Guard: NEW `tests/favor.spec.ts` — challenge/blessing favor reaches the multiplier; shrine parity. **M**. V: vitest.

## WAVE 2 — The resolver column

**B-11 · THE EFFECT-RESOLVER (#4).** Goal: data declares an effect; ONE runtime pass applies it — the audit's keystone. **Closes 052 · 057 · 116 · 191 · 192 · 193 · 194 · 199 · 224 · 301 · 336 · 341 · 327 · 333 (+204 latent-wired, +034 rider, +198 per-source option).** Approach: `resolveEffect(effect, ctx)` registry shared by combat/out-of-combat/skills/consumables/events; register statModifier, healing-mods, suffix procs (drive from `suffix.statusEffect`), buff/damage_percent/flee, accessory/armor penalties, event afflictions (canonical ids), per-id custom-achievement checkers; + the B-02 "no unwired effect/field" assert. Dep B-08 · B-09 · Skills none · Blast: combat math (F: triangle wiring + alreadyDead guard 233 asserted). Guard: NEW `tests/resolver.spec.ts` (one case per registered effect type — failing-test-first) + `tsx .audit_tmp/dpr5_check.ts` (handler diff = 0 dead types). **L (the seam) + XS per registration.** V: vitest, dpr5_check, sim baseline.

**B-12 · Finish the dual-stat work (312 — the abandoned WIP).** Goal: 162 weapons' second stat engages. **Closes 312 (retires latent 153/061; deletes moot 185's sets).** Approach: gate on `primaryStats.length>1`, derive the split from `primaryStats`, extract the ×3-duplicated routing block into one helper (071). Dep B-08 · Skills none · Blast: weapon damage for dual-stat weapons (**conflict-scan #3: assert no 061-style double-dip — split must sum to 1.0**). Guard: NEW `tests/weapon-split.spec.ts` + `tsx .audit_tmp/weapon_check.ts`. **M**. V: vitest, weapon_check, sim.

**B-13 · Signature mechanics (311 + 316 + 265).** Goal: cool gear and boss puzzles actually DO things. **Closes 311 · 316 · 265 (+228 id-unify rider).** Approach: real boss entity on the boss path (`prepareEncounter` at boss-encounter; FIGHT starts combat directly); per-unique-weapon + per-boss mechanic handlers through B-11's registry; display `specialMechanic` on weapon cards. Dep B-11 · Skills none · Blast: boss fights + unique weapons (**F: the 20 boss conversations 320/324 are read-only — zero content edits**). Guard: resolver tests per mechanic batch-slice; Vanya's Corrosive Shell as the seed failing-test. **L** (slice by floors: 5/10/15 first — the pre-wall live set). V: vitest, manual boss fight.

**B-14 · Blessings + paragon passives (181 + 177 + 075).** Goal: the deity/paragon promises apply. Approach: domain effects + the 4 noun-passive types through the resolver; real `critDamage` stat (075). Dep B-11 (live after B-17). Skills none. Guard: resolver cases + favor.spec extension. **S–M**. V: vitest.

## WAVE 3 — Balance (the spine)

**B-15 · The scaling spine (#1 — Q-2 owner fork resolved at G1).** Goal: **the game becomes winnable to floor 100.** **Closes 303 · 051/186 · 298(signal) · 062 · 053/163(guards) · 173 (+322 reachability leg).** Approach (default = the conservative fork unless Q-2 says otherwise): gate `monsterLevel` to player level + flatten `zoneMultiplier` + raise END→maxHP · post-triangle floor ≥1 with 0×→0.25 (+immunity SIGNAL in UI) · cap burst multipliers + once-per-combat lucky-escape · one bracket table · divisor guards. Dep B-06 · Skills none · Blast: every fight (F: bestiary data untouched). **Guard: `scaling_sim.js` NEW baseline — assert a playable corridor on floors 1–100 (kills-to-die > kills-to-kill margin), logged + re-baselined in 13.** Rollback: constants revert (one file post-B-06). **M–L**. V: sim (re-run per tuning iteration — conflict-scan #1), vitest.

**B-16 · Growth + skill economy tuning.** Goal: one coherent power model. **Closes 068/154(values) · 150 · 152 · 239 · 200 · 222(distribution) · 059.** Approach: enable the cost curve (flag from B-06) + re-curve top grades · symmetric output caps · skills onto the effStat economy + ratio defense · kill-proficiency across the build's real stats · bonus hits through the formula resolver. Dep B-06 · B-15 (one sim model) · Skills none. Guard: sim corridor holds; NEW `tests/growth.spec.ts` (SSS cost ≫ I cost). **M**. V: sim, vitest.

## WAVE 4 — The climax + content reachability (gated by B-11/B-15)

**B-17 · The Level-10 climax (#9).** Goal: `paragonTitle` stops being always-null. **Closes 259 · 260 · 261 · 262 · 271 · 296 · 176 · 178 · 097/179 (+via B-05 clean vectors).** Approach: ascension L10 branch → re-homed Denatus ceremony (effStat ranking, tie agency, title applied atomically, `recordParagon` called); alphabetize the adjective map (176); thresholds from observed maxima (178); codex LEVELS→10; extract-then-delete `level-up.tsx` (GLORY-parity check vs the store's live stacking 133) + the base job-select branch. Dep B-05 (vectors), B-10 · Skills none · Blast: the endgame (F: ascension's live ceremony content 263 preserved). Guard: NEW `tests/denatus.spec.ts` — L10 completion yields a non-null, deterministic, correctly-adjectived title. **M**. V: vitest + route-graph re-run (259's recipe flips green).

**B-18 · The sacred tier (#10).** Goal: 588 items become earnable, revealable, and real. **Closes 343/099 · 207 · 208 · 345 · 100 · 349 · 210(passives via B-11) · 101(index-by-metric rider).** Approach: implement the 17 metric writers (wire `recordParagon` from B-17, `incrementEventSuccess` from events, `incrementSkillUse` from skills) · kill the `value:0` free-pass (live-metric allowlist) · reveal gate reads favor (B-10) + surfaces `deityRevealText` (the 273 UI exists) · boss-relic registry for the 5 dangling ids · `checkAndUnlock` after every satisfiable metric + metric-indexed items. Dep B-10 · B-11 · Skills none · Blast: loot economy (F: the 245 hand-voiced conditions are read-only). **Guard: `tsx .audit_tmp/relic_check.ts` → unobtainable 244→0 · false-unlocks 15→0.** **M–L**. V: relic_check, vitest.

**B-19 · Achievements completable (#12).** Goal: the 27%+ unreachable share → 0 by construction. **Closes 325 · 326 · 329 · 332(+130/196 ancestry) · 131 · 198(decision) · 321(authoring in B-21).** Approach: fire the 11 dead types from their real events · reveal-on-completion bypass for secret tiers (326 FIRST — conflict-scan #7) · scoped conduct counters (run/floor/boss windows) · pair-semantics encoded on the requirement type. Dep B-11 (custom registry) · B-15 (floors) · Skills none. **Guard: `tsx .audit_tmp/ach_check.ts` → uncompletable 20→0; a Mythic completes in test.** **M**. V: ach_check, vitest.

**B-20 · Jobs for every build (#13).** Goal: no character reaches L2 class-less. **Closes 335 · 338(option) · 337.** Approach: owner-paced — author toward 2/triple (~70 jobs) or ship a generalist fallback now + author over time; globally-unique spec ids; document the 9-branch spec reality or extend. Dep B-02 (coverage assert) · Skills none (content authoring — Orla voice rules apply to NEW entries only). Guard: `tsx .audit_tmp/job_check.ts` → 0 uncovered triples · 0 dup ids. **M–L (content)**. V: job_check.

**B-21 · Content authoring batch (#14 + P14).** Goal: close the coverage gaps. **Closes 308 · 321 · 347 · 314 · 146 · 364 · 365(format-only) (+349's 66-relic-less documented).** Approach: wire maya/inca (2 lines + TODO delete — E7) · author the 5 deep achievements + 12 portraits + ~18 LCK weapons · normalize the +10/+15 bonus budget (owner picks the budget) · strip the 71 embedded quotes (formatting-only, §6.3) · dedicated BGM when assets exist. Dep B-02 asserts · Skills none. Guard: the B-02 coverage asserts go green; deity_check/content script re-run. **M (spread)**. V: asserts, `tsx .audit_tmp/deity_check.ts`.

## WAVE 5 — Cleanup, polish, hardening (CI-enforced)

**B-22 · The DELETE sweep (#15).** **Closes** the Phase-D DELETE roster (~33 items: Cohorts 2-residue/3/4/10 — tutorial orphans 291, dead barrels, components 032/354/358, dead constants/fns 037/148/155/159/160/164/169/183/197/201/212, FAVOR_STATUS post-B-10, forceUnlock post-B-18, startCombat via B-03, dead styles 237/256, dead branches 249, lootTable+pool-materials 340, shop-surface IF Q-1 says delete). Dep B-02 (knip ratchet) + the QUARANTINE answers · Skills none · Blast: none by construction (knip+route-graph green = the guard). Guard: knip exit 0 at the tightened ratchet; tsc; full vitest. **S–M**. V: knip, madge, tsc, vitest.

**B-23 · Break the cycles (#16).** **Closes 353.** Leaf types files for `DeityRelicPair`/`MilestoneBoss`; extract the store-shared state. Dep B-08. Guard: `madge --circular` = 0 runtime cycles (ratchet). **M**.

**B-24 · `meetsGrade` (#17).** **Closes 218(b) · 261(a, via B-17) · 279 · 318 · the room-events site · (+239 via B-16).** One helper; lint-ban raw `.points >=`. Dep — · Guard: NEW `tests/grade-gates.spec.ts` (SSS/40pts passes a D-gate; I/600 fails). **S**.

**B-25 · Tokens, serif, haptics (#18 — §6.4 visual batch).** **Closes 035/236/247/255/275(b)/280/284/297(nit)/358/368 · 357/361(serif) · 292(haptics) · 362(nit biome colors).** **Skills: `frontend-design` + `ui-ux-pro-max`** — D11 rules: the gothic-serif pillar + the EXISTING 13-group `Colors` tokens are fed as fixed constraints first; `ui-ux-pro-max`'s pre-delivery checklist (contrast/touch-targets/accessibility) is the closing QA gate; any new palette/font/dependency proposal → ledger QUESTIONS, owner sign-off. Approach: one tokenized tier/grade/rarity palette · replace ~hundreds of hex (mechanical; the B-02 lint locks it) · load one serif display font via `useFonts` · wire the haptics flag. Dep B-02 · Blast: visual-only (F: token system 362 is the base, not replaced). Guard: hex-lint = 0 violations; screenshot pass. **M**.

**B-26 · Render perf (P12 / G-7).** **Closes 230 · 238 · 256(render) · 356 · 369 · 132 · 101(with B-18) · 03§2-FD.** **Skills: `ui-ux-pro-max`** (RN perf guidelines as the QA gate only). Approach: narrow selectors on the heavy screens · `React.memo` the combat/map leaves · `scaleX` bars + RAF typewriter · index achievements by requirement type · fix the FloatingDamage double-move. Dep — · Guard: render-count probe in dev (one combat tick re-renders only the touched leaves). **M**.

**B-27 · Guard hardening (#20 / G-3).** **Closes** the P10 remainder: **042 · 048 · 050 · 056/226 · 076 · 087 · 092 · 100(via B-18) · 114 · 117 · 119/287 · 123(via B-10) · 129 · 135 · 139 · 228 · 243 · 265(via B-13).** Typed-Result convention at the store boundaries + the per-site patches (upgrade recomputes the cap; identify through store methods; atomic increments; accessory2 slot choice; shrine-opposed casing fix). Dep — · Guard: NEW `tests/guards.spec.ts` (upgrade raises the cap; opposed shrine fires; double-select job = no double bonus). **S–M**.

**B-28 · Junk + docs (#19).** **Closes 363+OBS-12 (23 files, explicit pathspecs — never `git add -A`) · 014(investigate) · 091 · 064/235 · 313 · 317 · 350 · 346(doc) · 111(label) · 272(d) · 295(version) · 297(doc) · the 07 crosswalk regeneration.** Counts regenerated FROM data. Dep — · Skills none. Guard: a doc-counts script asserting docs == data. **S–M**.

**B-29 · The UI stops lying (P2 + G-5).** **Closes 149/275(a) · 156/289 (per the owner's G-5 call: APPLY the penalties [MINDSET-faithful] or remove the display) · 267 · 271(via B-17) · 075(via B-14) · 034(display half).** Guard: NEW `tests/display-truth.spec.ts` — previewed stats == sealed stats. Dep G-5 answer. **S**.

## QUARANTINE batches (exist only if the owner says yes at G1 — Q-1)
**B-30** durability+repair service (DESIGNED; M–L) · **B-31** restore the 5% wandering merchant (near-FREE — room side complete; XS) · **B-32** biome-filtered selection + the 2 missing biomes (S) · **B-33** stealth via the existing sneak flow (M).

---

## Sequencing summary
`W0 (B-01…05, parallel) → W1 (B-06∥B-07∥B-08→B-09→B-10; B-12 may run here) → W2 (B-11→B-13/B-14) → W3 (B-15→B-16) → W4 (B-17…21) → W5 (B-22…29) + Q-batches when answered.`
Hard rules from the DAG/conflict scan: **B-06 before any tuning** · **B-07 before any persisted-shape change** · **B-08+B-09 before B-11** · **B-15 before all of W4's reachability claims** · **326-first inside B-19** · **B-17's 261 fixes ship WITH the route** · sim re-run after every W3 batch · the B-08 error-surfacing triage slot is budgeted, not incidental.

## Bucket coverage (DoD §9)
**A: 100%** (B-01/02/03/04/15/17/18 + 190 via B-09) · **B: 100%** (B-05…B-14, B-16, B-23/24/26/27) · **C sequenced** behind B-15/B-11 (B-17…21) · **D/E behind CI** (B-22/25/28 + the B-02 rules) · **F protect-list**: every batch above declares its contact; the content layers are read-only everywhere except B-21's NEW entries.

---

## ▶ GATE G1 — SIGN-OFF (hard stop)

**Analysis phase complete: Phases A–E delivered (ledger · 09 · 10 · 11 · 12). Game-code edits made during analysis: 0.**

Decisions requested with approval (defaults applied if unmarked):
1. **Q-2 scaling fork** — ☐ gate monsterLevel to player level (default) ☐ extend player progression past L7
2. **Q-1 quarantines** — durability/repair: ☐ build ☐ descope+doc (default) · shop node: ☐ restore-5% (default — near-free) ☐ delete · biomes: ☐ wire-lite ☐ delete field (default) · stealth: ☐ wire-to-sneak ☐ retire refs (default)
3. **G-5 displayed costs** — ☐ APPLY the penalties (default — MINDSET-faithful) ☐ remove the display
4. **B-20 jobs** — ☐ generalist fallback now + author over time (default) ☐ author all ~70 first

```
GATE G1 — OWNER APPROVAL
Approved by: the owner (in-session)   Date: 2026-06-10
Scope approved: ☑ full plan (Part 1 in full + seven decisions)
Decisions:
  Q-2  = HYBRID "Lycagon bands": monsterLevel = clamp(playerLevel±1, bandMin(floor), bandMax(floor));
         overleveled → floor's top-CR/prefix bias; underleveled → bandMin pressure. (reshapes B-15)
  Q-1  = durability: BUILD (FE-style; B-30 is live) · shop node: DELETE (+doc) · biomes: WIRE ALL (B-32 full)
         · stealth: WIRE to sneak (+Ambush proposal, B-33)
  G-5  = %-GROWTH MODIFIERS replace flat deity/backstory stats (B-16b: +15/−10 deity, +10/−10 backstory,
         clamp ±25%, both gain sites, remainder accumulator; supersedes flat-penalty application; closes 364)
  B-20 = AUTHOR ALL (~70 jobs, 5 themed sub-batches, owner voice-review; no generalist fallback)
```

**Until signed: zero game-code edits.** On approval, execution proceeds batch-by-batch; every batch closes with its
`13_VERIFICATION_LOG.md` entry; any batch whose pre-flight re-verification finds STALE ground truth returns to §3.2.
