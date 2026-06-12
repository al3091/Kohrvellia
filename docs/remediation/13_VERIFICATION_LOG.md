# 13 — VERIFICATION LOG (append-only; post-G1 execution)

> One entry per executed batch: date · batch id · commits (with KV-AUD ids) · harness layers re-run + results ·
> new findings surfaced (ledger row ids) · sim re-baselines. Created at Phase-E close; **empty until Gate G1 is signed.**

## Baselines at G1 (2026-06-10, working tree = `backup/working-tree-2026-06-10` @ `3b8603e`)
- `scaling_sim.js`: lose ~fl.10 · one-shot ~fl.20 · fl.86 atk 6052 vs HP 617 (the 303 baseline)
- `relic_check.ts`: 244/588 unobtainable · 15 false-unlocks · 490 reveal-locked · 107 non-canonical damageTypes
- `ach_check.ts`: 20/123 uncompletable · 13 undiscoverable · boss ids 5/10
- `tsc --noEmit`: exit 0 (the 352 false green — expected to surface errors at B-08 by design)
- `madge --circular`: 23 (3 runtime + 20 type) · `knip`: the 354 roster

## 2026-06-10 · B-01 — track the S0 files + baseline the audited tree
- Commit: `675e7fd` `fix(KV-AUD-001): …` (local master; NOT pushed — deploy stays the owner's)
- **Closes: KV-AUD-001 (the S0).** Verified: `git ls-files --others --exclude-standard src/` → EMPTY · `tsc --noEmit` → exit 0 · remaining dirty = junk strays only
- Note: master now == the audited working tree (the OBS-1 committed-vs-disk schism is closed); local master is 3 commits ahead of origin
- Incidental: removed a stray backtick file created by my own earlier shell quoting (my byproduct, not 363's evidence; junk count back to 23)

## 2026-06-10 · B-02 — CI quality gates + ratcheted baselines
- Commit: `5aaa474` `feat(KV-AUD-013,KV-AUD-352,KV-AUD-353,KV-AUD-354): …`
- Adds: `quality-gates.yml` (tsc · refint gates · knip dead-file ratchet · madge ratchet) · root `knip.jsonc` (the 354 roster as a remove-only ignore list) · `audit/integration/{refint_gates.ts, madge_gate.js, baselines.json}` · knip@5 + madge@7 pinned in `audit/` · `npm run typecheck`
- **All gates verified green locally**, reproducing the audit's numbers exactly: achievements 123/0-dup/20-uncompletable · relics 588/0-dup/240-245/107 · jobs 51/6-dup/21-56 · weapons 338/0/0 · monsters 36/24-art/elder_dragon-only · deities 310/4-dup · cycles 23/23 · knip files 0-new
- **NEW data point for B-21:** the boss-file source-scan finds **18** referenced achievement ids with **12 resolving** — i.e. **6 dangling**, one MORE than 321's five outcome-dangles. Identify the 6th when authoring the missing entries (no drive-by; logged here per the standing rules). Baseline set to the measured 12.
- Deferred to B-08 (by design): the eslint custom rules (ban `as any` / balance literals / hex) — they land with the union refactor that makes them pass-able
- Residual risk: the workflow's first CI execution happens on the owner's next push (gates are locally proven; CI run pending)

## 2026-06-11 · B-03 — permadeath integrity
- Commits: `4894974` (the surgery) + `03cdf9d` (type-environment fix-forward)
- **Closes: KV-AUD-002 · 069 · 070 · 098 · 104 · 113/282 · 124 · 138 (+deletes 058) · 227 · 231(guard) · 248 · 254(b) · 264 · 268(deaths).**
- Surgery: per-character resets (`resetForNewCharacter` on shop+sacred; complete deity reset) wired into `clearAllStores` · `modifyHP` corpse-heal guard · permadeath commits on the defeat phase (force-close can't dodge it) with a same-tick-victory exclusion · dungeon stack `gestureEnabled:false` · first-combat protection per-character (`src/lib/combatSafety.ts`); orphan `startCombat` deleted · out-of-combat deaths route via `src/lib/deathFlow.ts` (starvation, ramifications) · lethal blood offering refused in-voice · armor/accessory swaps honor `BAG_CAPACITY` · one capacity + honest `addItem` (the 50-vs-20 schism deleted)
- Guard: NEW vitest harness (`vitest.config.ts`, AsyncStorage shim) + `tests/permadeath.spec.ts` — **11/11 green**; `npm test` added to CI. Gates: tsc 0 · refint PASS · knip PASS. Test-scope note: paths crossing the inline-`require` cycle-dodges deferred to post-B-23 (documented in the spec header).
- **Surfaced-by-tooling rows (per the standing rule):** installing vitest brought `@types/node` into the type-space and exposed **5 latent `NodeJS.Timeout` declarations** in pre-existing components (NarrativeLog ×1, SneakRollAnimation ×3, TypewriterText ×1) → fixed with `ReturnType<typeof setTimeout/setInterval>` in `03cdf9d`. This is the B-08 conflict-scan class arriving early — expect more at the union batch.
- **Process correction (honest):** `4894974` was committed while tsc was red, because the gate sweep was chained into the same shell command as the commit. Caught in-session; fixed forward in `03cdf9d`. **New rule: gates run as a separate command; the commit only follows an inspected green.**
- Design notes for the owner: blood offerings are now *refused* when lethal (alternative was death-flow routing — flag if you prefer the crueler version); first-combat protection = level 1 + zero kills this run (protective-bias on multi-run level-1 characters).

## 2026-06-11 · B-04 — kill the farm
- Commit: `501017e`
- **Closes: KV-AUD-080 · 081 · 082 · 234 · 246 · 251 · 252 · 254(a)** (+WIREs the dead `getAdjacentNodes`, 175 — Cohort-9 "pre-built fix" #2 landed)
- Surgery: nodes never re-arm · forward-only path options · `moveToNode` target validation · one `runSeed` per run + a bounded `floorMaps` cache (ascend/descend restores the SAME floor — position + completion; **additive optional `DungeonRun` fields, old saves hydrate safely**) · rewards complete their rooms at banking (treasure/shrine/event/trap/rest ×2) · room gains the missing Android `BackHandler` · retreat modal → the real `runFlee` · Menu = confirmed save-and-quit
- Guard: NEW `tests/antifarm.spec.ts` — **5/5** (re-arm · forward-only · validation · cache-restore · seed-determinism); full suite **16/16**; tsc 0 · refint PASS · knip PASS · **scaling-sim baseline unchanged** (BREAK-EVEN line byte-identical)
- One surfaced fix in-flight: room.tsx had never imported `useEffect` bare — added with the BackHandler effect (caught by the pre-commit sweep, per the B-03 process rule)
- Notes: `completeNode` is a pure flag-set for non-combat nodes → idempotent at the banking sites (Continue handlers left untouched; the exactly-once event work is B-05's). Floor-cache pruned to the 10 most recent floors (persisted-size discipline). The dungeon-shop `handleShopLeave` site was deliberately skipped (dead code; D3 = DELETE in B-22).

## 2026-06-11 · B-04b — restore the way out (⚠ remediation-introduced regression, OWNER-caught)
- Commit: `7aabc0f`
- **What went wrong:** B-04's forward-only movement sealed the dungeon's only exit — `canExitDungeon` and `ascendFloor` both require reaching a floor's START node, which only backward walking can do. The audit's "forward-only DAG" recommendation was an overcorrection: the farm was the re-arm + re-bank, never the walking. **The owner caught it before any player did.**
- **The fix:** two-way traversal restored (forward via the wired `getAdjacentNodes` + backward neighbors); `moveToNode` accepts either direction of a REAL edge, still rejects teleports (081 stands). The farm remains dead via B-04's other three mechanisms. The return trip is design-positive: ramifications + satiation still bite on every backward step ("Return is everything" — Poseidon's relic, the `floor_return` achievements).
- Guard: anti-farm suite updated + extended (two-way options · exit-walk-with-completion-preserved · unconnected-teleport rejection) — **suite 17/17**; tsc 0 · refint PASS · sim baseline unchanged. The completed-node guard (`room.tsx:869`) verified: universal "This area has been cleared." render.
- **Lesson logged:** anti-exploit fixes must be tested against the *legitimate* flows they share machinery with — the new exit-walk test now guards the door permanently.

## 2026-06-12 · B-05 — event-firing single-owner ★ WAVE 0 COMPLETE
- Commit: `c0a003e`
- **Closes: KV-AUD-093 · 109 · 220 · 221 · 232 · 253** · **074 closed-AS-DESIGNED** (the 90-behavement definitions contain no INT/LCK growth entries — the commitExcelia switch matches the data exactly; adding INT/LCK vectors = a soul-score design change → owner's call, parked)
- Surgery: ~24 store-owned counters stripped from `combat.tsx` (the 2× combat bias on the Paragon title is gone); the 221 magic→phys streak copy-paste removed (exactly 2 `phys_consecutive_kills` sites remain, guarded by count); the 4 per-floor conducts moved to `floor.tsx handleDescend` reading the OUTGOING floor's context pre-reset (they now fire on all ~95 non-boss descents, not 5 boss floors); shop `sellItem` feeds `resource_sell_items` (the audit's `incrementShopSpend` rider deliberately skipped — selling ≠ spending, logged deviation); screen-only fight conducts kept at their single sites
- Guard: NEW `tests/soul-singlefire.spec.ts` — ownership-boundary source asserts (24 forbidden call patterns) + streak-count + exactly-once store semantics; **suite 52/52** · tsc 0 (2 orphaned consts removed — `noUnusedLocals` confirmed ON) · refint PASS · sim baseline unchanged
- Found during work: `floor.tsx` already fired BOTH explore-room tiers (an earlier truncated grep mis-read it) — combat's kill-side firing was the only wrong-scope source
- **★ WAVE 0 (B-01…B-05 + B-04b) COMPLETE:** the build is tracked+gated, permadeath is sealed, the farm is dead with the exit open, and the soul ledger counts honestly. 3 vitest suites / 52 tests stand guard. Next: Wave 1 (the architecture seams).

*(entries follow)*
