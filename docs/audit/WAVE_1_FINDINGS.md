# ▰▰▰ WAVE 1 — ENGINE SPINE (stores · lib · types) — Consolidated Findings (for team analysis) ▰▰▰

## Scope & tally
Wave 1 = the engine — every store, the lib utilities, and all core type modules, read first-hand line-by-line.
**`KV-AUD-001…219`** (178 first-hand + 41 verified seeds). **1 S0 · 4 of the 5 S1s ORIGINATE here · ~30 S2 ·
rest S3/Info.** This is the **foundation** — most defects in later waves are *instances or consequences* of
engine findings here.

## The Wave-1 headlines (the roots — what the team must act on)
1. **`001` (S0) — the repo can't build from a clean checkout** (3 untracked source files imported by tracked
   code). **→ `06` P0 #2.**
2. **The S1 roots originate here:** `002` permadeath state-bleed · `080` farming re-arm (the dungeon store) ·
   `099` sacred-items unobtainable (the metric evaluator) · `190` the 3-way StatusEffect schism. **→ `06` P2.**
3. **The balance roots:** `068` flat Falna growth (bypasses the cost curve) × `150` compressed near-cosmetic
   top grades × `151` Stats.ts hardcodes coefficients (10× drift from the dead `GameConstants`). **→ `06` P1 #6.**
4. **The "models more than it wires" thesis is born here** — `177` dead Paragon passives · `181` domain
   blessings display-only · `188/191/193/194` inert enchantments/penalties · `196` ~11 dead achievement types ·
   `207/208/211` sacred + repair unwired. **→ `06` P1 #4 (the one effect-resolver).**
5. **Type escape-hatches (P4):** `as any`/`as never`/`as unknown as`/`category:string` defeat the compiler
   (`026/054/072/166/185/218`). **→ `06` P1 #5.**

**Below this header is the lossless concatenation of the canonical Wave-1 prose** (`02_FINDINGS.md` seeds +
`findings/config_lib_hygiene.md` + `findings/stores.md` + `findings/types.md` + the cross-wave register).
Canonical sources are authoritative — regenerate this anytime. **Fixes: `06_REMEDIATION_BACKLOG.md`. Roots:
`08_DEFECT_PATTERNS.md`. Live register: `ALL_FINDINGS.md`. Resume: `AUDIT_LEDGER.md`. Wave 2: `WAVE_2_FINDINGS.md`.**

---

<details><summary>(original backup header)</summary>

> **Durable backup, regenerated S35 (current through Wave 2 COMPLETE).** Concatenates ALL Wave-1 findings + the
> full cross-wave register. Canonical sources (authoritative): `02_FINDINGS.md`, `findings/config_lib_hygiene.md`,
> `findings/stores.md`, `findings/types.md`, `ALL_FINDINGS.md`. Resume pointer: `AUDIT_LEDGER.md`.
> Wave-2 findings: `WAVE_2_FINDINGS.md`.

</details>
>
> **Scope.** Wave 1 = engine spine (stores + lib + types), 18 units, **KV-AUD-001..219** (178 first-hand + 41 seeds).
> **Wave-1 severity: 1 S0 · 5 S1 · ~59 S2 · ~70 S3 · ~30 S4/Info.** S1s = 002/080/099/190/259 (121 was an S1,
> DOWNGRADED->S2 by Wave-2 242; 259 added by Wave-2). **Wave-2 revisions touching Wave-1 findings are
> annotated inline here** (e.g. 108 refuted by 281, 211 revised by 286, xp 055/165 revised by 222, favor 121 by
> 242/270, backstory penalty 156 extended by 289, blessed selector 024 refuted by 225).
> **PART E now carries the full Waves-1+2 reconciliation + register (001..297), incl. §1I (Wave-2 reconciliation).**
>
> **Contents:** PART A seeds (001-041) · PART B lib · PART C stores · PART D types · PART E register+reconciliation (001..297).

================================================================
## PART A - SEED FINDINGS (KV-AUD-001..041) - from 02_FINDINGS.md
================================================================

# Kohrvellia Audit — Seed Findings Register (triage, now reconciled)

> **What this file is.** The **41 provisional seed findings** (`KV-AUD-001…041`) from the initial
> triage. Per the charter (R1) they were never accepted as coverage — each was re-confirmed or refuted
> first-hand when its unit was audited in Wave 1.
>
> **Reconciliation status (updated 2026-06-05, post-Wave-2).** Every seed below carries a
> `→ **Reconciliation**` line recording its disposition. The **consolidated, live register of all 297
> findings is `ALL_FINDINGS.md`**; full first-hand prose lives in `findings/config_lib_hygiene.md`
> (001–002, 042–050), `findings/stores.md` (051–147), `findings/types.md` (148–219), and
> `findings/screens.md` (Wave 2, 220–297). Several seeds were further resolved by the Wave-2 screen pass
> (009→295, 010→294, 024→225, 041→289) — noted inline below.
>
> **Disposition legend:**
> - **CONFIRMED** — verified first-hand; if a deeper finding superseded the prose, the new ID is cited.
> - **REFINED** — still valid, but the shape/scope changed (see the new ID).
> - **DOWNGRADED** — severity lowered after first-hand evidence.
> - **SUPERSEDED → ###** — replaced by a confirmed first-hand finding; use the new ID.
> - **REFUTED** — the claim was disproved.
> - **PENDING (Wave N)** — not yet reached first-hand (screens / data / components).

Format: `KV-AUD-### | Severity | Confidence | Lens | path:line — title`. **Confidence:** Confirmed =
read in source this audit; Agent-verified = from the completed components/design pass (evidence-based,
file:line); Likely(AUD-###) = prior-audit claim consistent with what I checked, flagged to re-confirm
in the resumed passes. Severity S0=critical … S4=info.

---

## A. Build, deploy, repo hygiene

- **KV-AUD-001 | S0 | Confirmed | L3/L10 | `useCombatStore.ts:32`, `data/bosses/milestoneBosses.ts:16-17`** — **Untracked source imported by tracked code → clean checkout cannot build.** `weaponFormulaResolver.ts`, `milestoneBossesFloors30to60.ts`, `…65to100.ts` are untracked (`git ls-files` → absent) yet imported by the combat store and by milestoneBosses (used by 4 dungeon screens). CI builds from git → the web deploy ships without the damage resolver / 2 boss tables. `tsc` passes locally only because the files are on disk. → `git add` the three files; add CI step `git ls-files --others --exclude-standard 'src/**/*.ts'` must be empty.
  → **Reconciliation: CONFIRMED (S0), still live.** Re-verified 2026-06-04: all three files are still untracked (`git status` → `??`). This remains the single build-blocker and the #1 fix. The owner's chosen sequence defers the `git add` until the Wave-3 content/voice pass vets the files.
- **KV-AUD-012 | S2 | Confirmed | L10 | repo root** — 7 untracked garbage files (`0)`,`3)`,`AsyncStorage)`,`b.floor`,`e.type`,`r.completed)`,`w.category`) from botched shell redirects; `3)` holds Windows `COLOR` help text. A `git add -A` would commit them. → delete.
  → **Reconciliation: CONFIRMED (S2), still present.** Re-verified 2026-06-04 — the junk files persist (plus an empty `plan` file and `used`). → `git clean` the untracked junk before any `git add -A`.
- **KV-AUD-013 | S2 | Confirmed | L8 | `package.json:5-10`** — No `lint`/`test`/`typecheck`/`build` scripts; zero automated tests for combat/Falna/loot/economy. Only manual `tsc`. → add `"typecheck":"tsc --noEmit"` + a CI job; seed unit tests on the formulas.
  → **Reconciliation: CONFIRMED (S2).** Reinforced by the Wave-1 balance roots (068/150/151/162): the formula surfaces most needing regression tests are exactly the ones with zero coverage.
- **KV-AUD-014 | S3 | Confirmed | L10 | `.github/workflows/deploy.yml:22`** — Build requires `npm ci --legacy-peer-deps`, masking a peer-dep conflict (React 19 / Expo 54). → run `npm ls` to find the offender; resolve.
  → **Reconciliation: CONFIRMED (S3).** Unchanged.

## B. State & persistence (permadeath integrity)

- **KV-AUD-002 | S1 | Confirmed | L4/L6 | `src/lib/clearAllStores.ts:19-29`** — New-game reset omits `useShopStore`, `useSacredItemStore`, `useInventoryStore`. Prior audit (AUD-066) refined: shop `npcReputation` *is* reset via `createCharacter→resetReputation`, but shop **`lifetimeGoldSpent`** and sacred **character-scope** metrics (`character_boss_*`) reset **nowhere** → a dead character biases a fresh one. Violates CLAUDE.md "ALWAYS clear all store state on new game." → scope-aware reset; clear all non-lifetime metrics on new character. `[AUD-066]`
  → **Reconciliation: REFINED (stays S1).** The inventory "second gold pool" half is **REFUTED** — `useInventoryStore` is a facade over `character.gold` (106). The real, confirmed bleeds are shop **`lifetimeGoldSpent`** (104) and sacred **`acquired`/character-scope** metrics (098). Rewrite drops the inventory claim; keeps the two confirmed leaks. One of the four S1s (post-Wave-2: 121 was downgraded S1→S2 by KV-AUD-242).
- **KV-AUD-004 | S1 | Confirmed | L1/L4 | `useDeityStore.ts:25-33`** — Two favor→multiplier tables: `FAVOR_STATUS` (7 tiers, **ABANDONED 0×**, Favoured Child 2.0×) vs `Deity.ts FAVOR_TIERS` (6 tiers, 0.5×→1.5×) which HP/combat actually use. The 0× is a one-shot "zero all stats" landmine; the 3–4× swing is a death-spiral. → unify to one table; floor the multiplier > 0; clamp `currentHP ≤ maxHP`. `[AUD-090]`
  → **Reconciliation: DOWNGRADED S1→S3 (122).** The `FAVOR_STATUS` 0×–2.0× table is **dead code** — its only consumer is a discarded self-call at `:474`; it never reaches stats, so it is **not a live landmine/death-spiral**, just a divergent dead table (180). The genuine favor defect is **KV-AUD-121 (S1): favor is mechanically inert** (`modifyDeityFavor` 0 callers → frozen at 50). See `05_BALANCE_AND_BENCHMARKS.md`.
- **KV-AUD-015 | S2 | Likely(AUD-104) | `useSoundStore.ts:100-103` vs `useGameStore.ts:27-29`** — Volume stored in two stores (game settings 0-100 persisted; sound 0-1 runtime). Settings screen and audio engine may read different ones. → single source.
  → **Reconciliation: SUPERSEDED → 144 (confirmed).** Engine volumes (0–1) are **non-persisted** and on a different scale from the persisted `useGameStore.settings` (0–100); the engine reads the non-persisted ones → audio volume never persists / may not reflect Settings.
- **KV-AUD-016 | S2 | Likely(AUD-096) | `useBlacksmithStore.ts:38` + `useShopStore.ts:40`** — Blacksmith reputation tracked in two stores with different resets (0 vs 1). Pricing/gating may disagree. → consolidate.
  → **Reconciliation: SUPERSEDED → 107 (confirmed).** `useBlacksmithStore` holds the canonical blacksmith rep; the `useShopStore` blacksmith-rep field is the **dead** duplicate.
- **KV-AUD-017 | S2 | Likely(AUD-034) | `Character.deityFavor` + `DeityRelationship.favor`** — Favor duplicated, hand-synced (BUG-039 was a missed sync). → single source.
  → **Reconciliation: SUPERSEDED → 121 (escalated S2→S1).** Not "hand-synced" — **never** synced: `modifyDeityFavor` has 0 callers, so `character.deityFavor` is frozen at 50 while all changes go only to `relationship.favor`. Favor is inert with respect to combat power.

## C. Stats / Falna / balance math  (see `05_BALANCE_AND_BENCHMARKS.md`)

- **KV-AUD-003 | S1 | Confirmed | L3/L9 | `GameConstants.ts:24-61`** — `DerivedStatFormulas` ("all tunable values in one place") is **not imported by `Stats.ts`** (grep confirms); live coefficients are hardcoded in `Stats.ts` and drifted ~10×. Editing the documented balance file is a no-op. Much of `GameConstants` is similarly orphaned. → reconnect; delete dead duplicates. `[AUD-067]`
  → **Reconciliation: REFINED (partial) → 065 + 151.** Confirmed exactly (10× drift: constants `0.08` vs live `~0.008`, 151). But **not** blanket-dead: `CombatConfig.flee` and `LootConfig.luckBonusPerPoint` **are** imported and used (065). Audit `GameConstants` per-field in Wave 4; don't blanket-delete. Stays a structural balance defect (B1 in `05`).
- **KV-AUD-018 | S2 | Likely(AUD-082) | `Stats.ts` grade widths** — Top grades compressed (I–A=100 each; S=50, SS=30, SSS=20) → SSS is *cheaper*, inverting the genre's "top points cost most." → re-curve. (confirm widths on resume)
  → **Reconciliation: CONFIRMED → 150.** Widths verified (A→SSS = 199 pts vs I→A = 800). **New insight:** combat reads a *linear* effective-stat, so the grades are **near-cosmetic** — the compression barely matters mechanically. Compounds with 068 (flat growth). See `05` B3.
- **KV-AUD-019 | S2 | Likely(AUD-023) | `Stats.ts` derived calc** — Output cap gates physical attack only; magic/luck uncapped. Compounded by **BUG-010** (`Infinity` cap on corrupt save). → symmetric cap + guard.
  → **Reconciliation: REFINED → 152 + 077 + 119.** Cap **is** physical-only (152, confirmed). The `Infinity` fallback is **unarmed-only**, not a corrupt-save bug (077). The sharper defect is `upgradeWeapon` omitting `maxOutputCap` (119). → symmetric cap across all three channels.
- **KV-AUD-020 | S3 | Confirmed | L9 | `GameConstants.ts:246-247`** — `crScoreRanges.mythic` needs exactly 100; legendary 98-99 → top Denatus titles unreachable. → realistic thresholds. `[AUD-050]`
  → **Reconciliation: CONFIRMED → 178 (×091/093).** Mythic = 100 is literally impossible; worse, the **real** max score is far below 100 because many behavements never fire (177) and combat behavements are double-counted (093). Set thresholds from observed maxima.

## D. Dungeon / playthrough

- **KV-AUD-005 | S1 | Confirmed | L1/L9 | `useDungeonStore.ts:644-651`** — Combat/elite nodes set `isCompleted:false` when left ("reactivate … when leaving"). If backtracking onto a cleared node is possible (confirm directionality on resume), it's an infinite farm. Violates "Challenge, Not Grind." → never un-complete; forward-only connections. `[AUD-101]`
  → **Reconciliation: SUPERSEDED → 080 (S1, confirmed end-to-end).** Directionality resolved: `getCurrentPathOptions` returns backward edges + `moveToNode` has no navigability check + nodes re-arm on leave ⇒ confirmed infinite farm. Compounds with 082 (floors re-roll on ascend → infinite *fresh* content). One of the four S1s (post-Wave-2: 121 was downgraded S1→S2 by KV-AUD-242).
- **KV-AUD-021 | S2 | Likely(AUD-046) | `useDungeonStore.ts:44-187`** — `generateFloorMap` ignores `NODES_PER_FLOOR_BASE/MAX`; real size ≈ rows×cols. Those constants are dead; PROGRESS "45 rooms" stale. → remove dead constants/fix docs.
  → **Reconciliation: SUPERSEDED → 085 (confirmed dead).** `NODES_PER_FLOOR_BASE/MAX` are dead; generator uses rows×cols.
- **KV-AUD-022 | S3 | Confirmed | L3 | `Dungeon.ts:262` + `Colors.ts:158,161`** — `getBiomeForFloor` generates only 8 of 10 biomes; `void`/`labyrinth` (and color-only `dreamscape`) are dead. → wire to deep floors or remove. `[AUD-045]`
  → **Reconciliation: CONFIRMED → 169.** Dead `void`/`labyrinth` biomes confirmed first-hand in the types wave.

## E. Combat / weapons

- **KV-AUD-023 | S2 | Likely(AUD-087) | `useCharacterStore.ts:245-291,377-417`** — Two growth paths: `addStatProficiency` (increasing per-grade cost) vs `commitExcelia` (flat 1=1). If the flat Falna path is live in combat, the increasing-cost curve is dead → growth too cheap. **Must confirm which combat uses.**
  → **Reconciliation: SUPERSEDED → 068 (S2, THE balance root).** Confirmed: `commitExcelia` flat 1:1 is the live path; the increasing `getProficiencyThreshold` curve is **dead** → no per-grade cost escalation. With 150 (compressed grades), prestige tiers are trivially cheap. See `05` B2.
- **KV-AUD-024 | S2 | Likely(AUD-051) | `useCharacterStore.ts:1325-1385`** — Paragon/blessing buffs live in `getDerivedStatsWithBlessings`; `getDerivedStats` omits both. **Confirm combat reads the blessed selector**, else blessings + paragon are computed-and-ignored.
  → **Reconciliation: REFINED → moot via 121.** Whichever selector combat reads, favor is **frozen at 50** (121), so the blessing multiplier is ~1.0× regardless — lower live impact than filed. The Paragon-passive half is separately broken (177 dead noun passives).
- **KV-AUD-025 | S2 | Likely(AUD-089) | `useCombatStore.ts:1263-1282`** — Monster status procs derive from base `damageTypes`, not `MonsterSuffix.statusEffect` → "of Venom" etc. suffix effects are dead in combat. → drive procs from suffix data.
  → **Reconciliation: SUPERSEDED → 052 (confirmed) + 190.** Suffix status effects are dead in combat; this is one manifestation of the definitive **StatusEffect schism (190, S1)**.
- **KV-AUD-026 | S2 | Confirmed | L2 | multiple** — `as any`/`as unknown as` casts hide boundary mismatches: `useCharacterStore.ts:1227,1280` fake `calculateDerivedStats` return; `useCombatStore.ts:532` `normalizedArmor as any`; `floor.tsx:415`; `app/town/inventory/index.tsx:401,407,446`. → tighten types.
  → **Reconciliation: CONFIRMED (054/072 + 218); screen casts confirmed in Wave 2.** Confirmed first-hand across stores/types + the `as unknown as` PlayerSnapshot bypass (218). Wave 2 confirmed the screen-side casts: `floor.tsx:415` (257) and `town/inventory:401/407/446` (276).
- **KV-AUD-027 | S2 | Likely(AUD-099) | `useBlacksmithStore.ts:287-295`** — `upgradeWeapon` recomputes damage but not `maxOutputCap`; upgraded weapons keep the lower original cap, throttling the upgrade. → recompute cap.
  → **Reconciliation: SUPERSEDED → 119 (confirmed first-hand).** Upgrade omits `maxOutputCap`; ties to 019/152.

## F. Familia / Deity / Pantheons / Sacred items

- **KV-AUD-006 | S1 | Confirmed | L3 | `useSacredItemStore.ts:210-245`** — ≥6 acquisition metrics hardcoded `return 0; //TODO` (`floors_nodeath`, `floor_noconsumable`, `floor_nodefend`, `dodges_total`, `causes_enemy_flee`, `achievements_total`; prior audit counts ~13 incl. `boss_noattack`, `level_reached`, `stats_grade`…). Any sacred item gated on these can **never unlock**. → implement tracking or re-gate the items. **Quantify affected items on resume.** `[AUD-085]`
  → **Reconciliation: SUPERSEDED → 099 (S1, expanded & quantified).** 14 `return 0` metric stubs + `recordParagon`/event metrics with no writers + **`forceUnlock` is dead code** ⇒ a large share of ~770 items unobtainable; `value:0` reqs on dead metrics also mis-fire as **false unlocks** (bidirectional). Double-locked by `revealFavorRequired` read by 0 stores (208) + the favor freeze (121). One of the four S1s (post-Wave-2: 121 was downgraded S1→S2 by KV-AUD-242).
- **KV-AUD-028 | S2 | Confirmed | L7/L3 | `data/pantheons/index.ts:16`** — `// TODO: Regenerate maya, inca pantheons with correct Deity interface` → those pantheons likely malformed/excluded. **Verify wiring + count on resume.**
  → **Reconciliation: PENDING (Wave 3).** Pantheon *content* + referential integrity is a Wave-3 unit (W3-DP1…DP13). Note: `maya`/`inca` were among the files modified this working session (uncommitted) — verify the TODO still holds when Wave 3 reaches them.
- **KV-AUD-029 | S2 | — | `Behavement.ts:293-298`** — *(was: see KV-AUD-011, Paragon title sort bug.)*
  → **Reconciliation: MERGED into KV-AUD-011 (dup, §1E).** No standalone entry; the Paragon sort bug lives at 011, proven exactly by 176.

## G. Soul / Denatus / Paragon

- **KV-AUD-011 | S2 | Confirmed | L1 | `Behavement.ts:293-298`** — `getStatAdjective` sorts the stat pair alphabetically and indexes `STAT_ADJECTIVE_MAP`, but ~half the keys are stored reversed → `?? 'Iron'` fallback for ~50% of titles. `getDominantVector` (303-315) defaults to `COMBAT_PHYSICAL` on ties; `getSkillNoun` (345) uses `Math.random()` → non-deterministic. The soul system's climactic reward is half-wrong/arbitrary. → alphabetize keys (or canonical order); give the player tie-break agency. `[AUD-049/065]` *(absorbs KV-AUD-029)*
  → **Reconciliation: CONFIRMED/PROVEN → 176.** Exactly **13 of 28** stat pairs collapse to 'Iron' (all `STR_*` except `STR_WIS`, `END_AGI/CHA`, `INT_CHA`, `WIS_*`, `PER_*`). Compounds with 177 (half noun passives dead), 178 (Mythic unreachable), 093 (combat behavements double-counted → combat-biased vectors) → the Denatus/Paragon climax is multiply broken.
- **KV-AUD-030 | S2 | Likely(AUD-094) | `useSoulStore.ts:31-141`** — `BEHAVEMENT_DEFINITIONS` has 90 entries; all docs say "85." Many EXPLORATION/CAUTION/GLORY behavements appear unfired from stores. → reconcile count; confirm wired set on resume.
  → **Reconciliation: SUPERSEDED → 091 (confirmed 90).** Count is 90, not 85; the unfired-behavement worry is partly real (feeds 177/178) but the soul system is **not** dead — `initializeDenatus` is wired and the ceremony fires (096, refutes the "soul dead" hypothesis).

## H. Achievements / Leveling

- **KV-AUD-031 | S0→refuted | Confirmed | L3 | `combat.tsx:1038-1048`, `floor.tsx:313`, `room.tsx:542`** — Prior audit feared "achievements never progress → can't level up (CRITICAL)." **Refuted:** progress fires (`kill_count`,`gold_earn`,`boss_kill`,`elite_kill`,`damage_*`,`floor_reach`,`shrine_blessing`,`stat_reach`,`custom`). Residual: enumerate `RequirementType`s used in data but never fired → those achievements are dead (resume). `[AUD-093]`
  → **Reconciliation: REFUTED (S0→OK); residual → 130 + 196.** Leveling is not blocked (STANDARD tiers auto-unlock). The real residual is twofold: progress is **discovery-gated** (`hidden` achievements accrue 0 progress, 130) and **~11 of 21 `RequirementType`s never fire** (196) → those specific achievements are uncompletable. See `03` §3 and `ALL_FINDINGS` §1A.
- **KV-AUD-010 | S2 | Confirmed | L10 | `app/settings/index.tsx:73-74`** — Debug cheat shipped: a Settings action injects `updateProgress('kill_count',50)` + `('floor_reach',5)`. → gate behind `__DEV__` or remove.
  → **Reconciliation: REVISED → REFUTED for production (KV-AUD-294).** Wave-2 first-hand: the cheat panel (stat boost, deity-approval toggle, seed-achievement) IS already wrapped in **`{__DEV__ && character && …}`** (`settings/index.tsx:273`) → Metro strips it from `expo export`, so it never ships. A dev-only tool, correctly gated — not a player-exploitable cheat. (The seed cited `:73-74`, now inside the gated block.)

## I. Components / Design system  (Agent-verified — pending Wave-4 first-hand re-verify)

> **R1 caveat:** these came from the prior components/design agent pass, not first-hand reading. That
> pass's audio claim (007) was **already refuted** first-hand (143), so the whole cluster is treated as
> *unverified* until Wave 4 re-reads `src/components/**`.

- **KV-AUD-008 | S1 | Agent-verified | L1/L8 | `Typography.ts:56-93`, `app/_layout.tsx`** — No font loaded anywhere (`expo-font` dep+plugin never imported); headers set no `fontFamily`. "Gothic serif headers" aesthetic unimplemented. → load a serif via `useFonts` or fix docs.
  → **Reconciliation: PENDING (Wave 4) — re-verify.** Plausible but unconfirmed first-hand; severity may move once `_layout.tsx`/Typography are read directly.
- **KV-AUD-007 | S1 | Confirmed/Agent-verified | L3 | `package.json:11-30`, `useSoundStore.ts`** — CLAUDE.md names `react-native-reanimated` + `expo-av`; neither installed (`expo-audio` is). Audio is a 17×`console.log` "Would play" stub. → correct docs; implement or strip audio.
  → **Reconciliation: REFUTED-IN-PART → S3 (143).** **The audio-stub claim is FALSE** — audio is fully implemented (`expo-audio` real `createAudioPlayer`+`play`; all 53 `.mp3` assets present; the `Would play` logs are stale). Only the **doc-drift** survives (CLAUDE.md names the wrong libs) → S3.
- **KV-AUD-032 | S2 | Agent-verified | L3 | components** — **Orphan components** (exported, imported by nothing): `EmphasisText`, `StatTooltip`+`StatRowWithTooltip` (520 lines), `ActionModal` (256), `GritPanel`, `AnimatedHPBar`/`AnimatedSPBar`. → delete or adopt.
  → **Reconciliation: PENDING (Wave 4) — re-verify with `ts-prune`/`knip`.**
- **KV-AUD-033 | S2 | Agent-verified | L5 | library-wide** — `React.memo` used **0×**; JS-thread animations on a 60fps target; `DramaticReveal` (50+ call sites) unmemoized. → memo leaf/animation components; native-drive transforms.
  → **Reconciliation: PENDING (Wave 4) — re-verify.**
- **KV-AUD-034 | S2 | Agent-verified | L1 | `EnemyPreview.tsx:58,64`** — `getDangerLevel(monster.finalCR, 1)` hardcodes player level 1; `canInflict` array never populated → "Can Inflict" block is dead. → pass real level; wire/remove block.
  → **Reconciliation: PENDING (Wave 4) — re-verify** (listed as a no-op in `03` §2).
- **KV-AUD-035 | S2 | Agent-verified | L4 | 7 components** — ~62 hardcoded hex bypassing the token system. → tokenize.
  → **Reconciliation: PENDING (Wave 4) — re-verify.**
- **KV-AUD-036 | S3 | Agent-verified | L10 | `DomainIcon.tsx:54`, `useSoundStore.ts:*`** — `console.warn`/`console.log` shipped to production. → gate on `__DEV__`.
  → **Reconciliation: PARTIALLY CONFIRMED (143).** The `useSoundStore` `console.log` calls were read first-hand (stale `Would play` logs) — real. Component-side logs pending Wave 4.
- **KV-AUD-037 | S3 | Agent-verified | L3 | `Animation.ts:112-125,224`; `Spacing.ts:115`** — Dead constants: `Easing` (never passed to `Animated.timing`; **refutes the AUD-079 "breaks native" fear**), `isSentenceEnd`, `Breakpoint`. → delete.
  → **Reconciliation: PENDING (Wave 4) — re-verify;** the AUD-079 refutation stands (the strings are dead).
- **KV-AUD-038 | S3 | Agent-verified | L5/L4 | `GritOverlay.tsx:6`** — `Dimensions.get('window')` read once at module load → no re-measure on rotation. → `useWindowDimensions()`.
  → **Reconciliation: PENDING (Wave 4) — re-verify.**

## J. Type-system structural (now first-hand — types wave W1-T1…T6)

- **KV-AUD-039 | S1 | Confirmed | `Character.ts:111-130` vs `StatusEffect.ts:9-53`** — Two incompatible StatusEffect models, only 7/10 IDs overlap; `Monster.ts` mixes both vocabularies → some suffix effects contribute 0 CR; `weaken`/`slow` CR weights dead. Root of BUG-040. → unify to one status model.
  → **Reconciliation: CONFIRMED/SUPERSEDED → 190 (S1) + 158.** Definitive: **THREE** incompatible status models (`StatusEffect.ts` weaken/slow/regen · `Character.ts` fear/silence/paralysis · a 'buff' shape); 7/10 ids overlap → fear/silence/paralysis dead, weaken/slow CR-weights dead, cure-by-id fails, `slow` fully inert (191). One of the four S1s (post-Wave-2: 121 was downgraded S1→S2 by KV-AUD-242).
- **KV-AUD-040 | S2 | Confirmed | `Weapon.ts:12-29`** — `HybridCategory` union vs routing `Set<string>` spell combos differently (`CHA_INT` vs `INT_CHA`…); `Set<string>` hides it from tsc → magic/hybrid damage misroute. → tighten to typed unions.
  → **Reconciliation: CONFIRMED → 185 (+153).** Hybrid set mismatch confirmed (`CHA_INT` vs `INT_CHA` + dead `INT_PER`/`WIS_PER`/`WIS_LCK` pairs); compounds the hybrid mis-scale balance defect (153). See `05`.
- **KV-AUD-041 | S2 | Confirmed | `Character.ts:39,306`** — `Backstory.deityAffinity` uses non-domain strings (`divine`,`fate`) → never matches; `statPenalty` applied nowhere → backstory is pure upside (violates MINDSET "every benefit shows its cost").
  → **Reconciliation: CONFIRMED → 156 + 157; EXTENDED by Wave-2 289.** `statPenalty` applied nowhere (156); `deityAffinity` uses non-domain strings (157). **Wave-2 289 extended this to the DEITY penalty too:** at the creation screen both the deity AND backstory `statPenalty` are **displayed** (`stats.tsx:73-79`, `deity/[pantheonId]:219`) but never applied (`createCharacter` passes only `deity.statBonus`) → every character is pure upside; the displayed cost is a lie (MINDSET violation).

---

> **This file = the 41 seeds, reconciled.** The full first-hand set (`KV-AUD-042…219`) and the
> cross-finding reconciliation (REFUTED / DOWNGRADED / REFINED / SUPERSEDED / DUP / cross-links) are in
> **`ALL_FINDINGS.md`**. Dead/floating code → `03_CONNECTIVITY_AND_DEADCODE.md`. Balance → `05`.
> Doc drift → `07`. Coverage status → `00`. **Wave 2 (screens, 220–297) is complete** and folded into `ALL_FINDINGS.md` §1I/§4; Waves 3–4 (data / components) will extend this further.

================================================================
## PART B - W1-L1 LIB/CONFIG/HYGIENE (001-002, 042-050) - from findings/config_lib_hygiene.md
================================================================

# Findings — Config / Lib / Hygiene

Canonical first-hand findings. Schema per `01_CHARTER_AND_RUBRIC.md`. Seed IDs (KV-AUD-001…041) are
confirmed/refuted here with evidence; new IDs continue from the ledger counter.

---

## Unit W1-L1 — `src/lib/` (clearAllStores, weaponFormulaResolver, sacredItemConversion) — Session 1, audited first-hand

### `src/lib/clearAllStores.ts` (29 lines — read in full)

**KV-AUD-002 [CONFIRMED first-hand] | S1 | L4/L6 | `clearAllStores.ts:19-29`** — Incomplete new-game
reset. The function resets exactly 9 things — `useCharacterStore.deleteCharacter`, `useDungeonStore.
clearAllData`, `useAchievementStore.resetAllProgress`, `clearWeaponRegistry`, and `.reset()` on soul,
job, deity, market, blacksmith — and **omits `useShopStore`, `useSacredItemStore`, `useInventoryStore`**
(all persisted) plus `useGameStore` (intentional meta). The file's own header comment says *"reset all
persisted stores"* (`:1-2`) — **false**, three persisted stores are skipped.
- *Impact:* potential cross-character bleed in a permadeath game. **Net bleed must be confirmed in the
  store units** — prior notes suggest `createCharacter` may compensate for shop `npcReputation`/sacred
  *run* metrics, but shop `lifetimeGoldSpent`, sacred *character-scope* metrics, and the entire
  `useInventoryStore` stash/gold have **no reset visible here**. → cross-check `useCharacterStore.
  createCharacter` (W1-S2), `useShopStore`/`useInventoryStore` (W1-S5), `useSacredItemStore` (W1-S4).
- *Fix:* make the reset scope-aware and exhaustive (clear all non-`lifetime` state for every
  run-scoped store), or centralize a single `resetForNewCharacter()` each store implements.

**KV-AUD-042 | S3 | L6 | `clearAllStores.ts:19-29`** — No error isolation. Nine `getState().action()`
calls run sequentially with no try/catch; if any throws (e.g. a store mid-migration), the remaining
resets never run → a **partially-reset** new game (worse than no reset, because state is now
inconsistent). → wrap each in try/catch or collect errors; resets should be individually idempotent.

### `src/lib/weaponFormulaResolver.ts` (47 lines — read in full; **UNTRACKED in git**)

**KV-AUD-001 [CONFIRMED first-hand] | S0 | L3/L10 | `weaponFormulaResolver.ts` (whole) ← `useCombatStore.ts:32`**
— This file is real, load-bearing combat code (it derives every weapon's attack pool / defense target
/ pierce type) and is **untracked**. It is imported by the tracked combat store, so a clean
`git checkout` (CI) cannot bundle it → broken deploy. Confirmed by reading the file content (not just
its absence). → `git add` it; CI guard for untracked `src/**` imports.

**KV-AUD-043 | S2 | L1/L2 | `weaponFormulaResolver.ts:33,37,46`** — Silent physical fallback on any
unrecognized category. The resolver routes by `MAGICAL_WEAPON_CATEGORIES.has(category)` /
`HYBRID_MIXED_CATEGORIES.has(category)` (both `Set<string>`), and **any miss falls through to Node 3 =
`{attackPool:'physical', defenseTarget:'physDef', pierceType:'armorPierce'}`** (`:45-46`). Because
`category: string` and the sets are `Set<string>`, a spelling drift between a weapon's category and the
set entries (e.g. `INT_CHA` vs `CHA_INT` — see seed KV-AUD-040 / prior AUD-031) makes a *magic/hybrid*
weapon silently deal **physical** damage vs the wrong defense. No type error guards this. → tighten
`category` to the `WeaponCategory` union and the routing sets to typed sets; verify spellings against
`Weapon.ts` in W1-T4.
- *Positive note:* the LCK branch (`:24-31`) correctly splits defense by damage type (the "Loaded Dice
  uses magDef" case) — that logic is sound.

### `src/lib/sacredItemConversion.ts` (215 lines — read in full)

**KV-AUD-044 | S2 | L2 | `sacredItemConversion.ts:51,67,68,101,102`** — `as never` casts defeat type
checking on sacred-item construction. `DIVINE_MATERIAL`/`SACRED_QUALITY` stubs (`:18-27`) are forced
into the `Weapon.material`/`quality` slots with `as never`, and `category` with `as never` (`:51`).
The stubs only carry a handful of fields; if any `Material`/`Quality` consumer (damage calc,
durability, display) reads a field the stub omits, it gets `undefined` at runtime with no compile
warning. → define real typed `Material`/`Quality` stubs; remove `as never`. Verify the consumed field
set in `Weapon.ts`/combat (W1-T4 / W1-S1).

**KV-AUD-045 | S3 | L1 | `sacredItemConversion.ts:43-46`** — All physical sacred weapons collapse to
`'slash'`. `DAMAGE_MAP = { physical:'slash', magic:'magic', holy:'holy', dark:'dark', chaos:'dark' }`
→ a sacred mace/spear (blunt/pierce in spirit) is typed `'slash'`, so the weapon-triangle treats every
physical sacred weapon as slashing; `'chaos'` is silently coerced to `'dark'`. → carry the real damage
type on `SacredWeaponStats` (add blunt/pierce) instead of one-way mapping to slash.

**KV-AUD-046 | S2 | L2 | `sacredItemConversion.ts:111-112,198-213`** — Sacred armor stat bonuses live on
an **off-interface** `statBonuses` property attached via `as Armor & { statBonuses }` (`:111-112`).
Only the matching-cast `getArmorStatBonuses` (`:198-213`) can read them; any code consuming the typed
`Armor` is blind to sacred armor bonuses. → add `statBonuses?: Partial<Record<StatName,number>>` to the
`Armor` interface. Confirm the derived-stat path actually calls `getArmorStatBonuses` (W1-S2), else the
bonuses are dead.
> **[Update S21 — the "are they dead?" question is DISCHARGED:** W1-S2 confirmed `getArmorStatBonuses`
> **is** merged into `mergedCarry` in all three derived paths (`useCharacterStore:198-206,1248-1252,
> 1304-1308`), so sacred armor bonuses **do** reach derived stats — they are live, not dead. Only the
> off-interface `statBonuses` *type-safety* concern remains.]**

**KV-AUD-047 | S2 | L1 | `sacredItemConversion.ts:202`** — `getArmorStatBonuses` only iterates
`head, chest, hands, legs` — it omits any other armor slot (boots/accessory). Sacred armor equipped to
an omitted slot contributes **zero** stat bonus silently. → iterate the full `Equipment` armor slot
set; confirm the slot list in `Armor.ts` (W1-T6).
> **[Update S21 — REFUTED by KV-AUD-195 (W1-T4):** reading `Armor.ts` first-hand, the game has **only 4
> armor slots** (`head/chest/hands/legs` — there is no boots/feet slot), so `getArmorStatBonuses` iterates
> the *complete* set and omits nothing. This finding was a false alarm (the auditor's own self-correction,
> R1 in both directions). **Withdrawn.** The off-interface `statBonuses` type-debt (KV-AUD-046) still stands.]**

**KV-AUD-048 | S2 | L6 | `sacredItemConversion.ts:39,85,120`** — Unguarded `throw` on missing stats.
`sacredItemToWeapon/Armor/Accessory` each `throw new Error` if the matching `*Stats` block is absent,
and `convertSacredItemToEquippable` (`:164-170`) dispatches purely by `item.slot`. A data-inconsistent
sacred item (slot says `weapon`, no `weaponStats`) throws at **equip time** — and the caller invokes
this via `require(...)` in `useSacredItemStore.ts:559`, so an unhandled throw can crash the equip flow.
→ validate at data-load (W3-DI integrity) and/or return a typed failure instead of throwing.

**KV-AUD-049 | S3 | L4 | `sacredItemConversion.ts:76`** — Balance literal in a lib file: sacred weapon
`maxOutputCap = ws.finalDamage * 5` (hardcoded). Violates the "balance lives in `GameConstants`" law
and bypasses the quality-tier cap system (asymmetric with normal weapons). → move the `5×` to
`GameConstants`; reconcile with the tier-cap model (ties to seed KV-AUD-019).

**KV-AUD-050 | S4 | L1/L8 | `sacredItemConversion.ts:152-158`** — `normalizeAccessoryType` maps both
`seal` and `talisman` → `'belt'` ("closest mapping") and any unknown type → `'amulet'` silently. A
"seal" relic surfaces to the player as a belt; bad data is masked as an amulet. → preserve the real
type or surface a warning.

**Unit verdict:** the lib layer is small and the core logic (formula resolver, converters) is mostly
sound, but it is the project's densest cluster of **type-system escape hatches** (`as never`,
`Set<string>` fall-through, off-interface `statBonuses`) — exactly the boundaries where silent runtime
bugs hide. The S0 (untracked file) and S1 (reset gap) here are the headline carryovers, both confirmed
first-hand. 4 cross-checks queued for W1-S1/S2/S4/S5/T4/T6.

================================================================
## PART C - W1-S1..S7b STORES (051-147) - from findings/stores.md
================================================================

# Findings — Stores

Canonical first-hand findings. Schema per `01_CHARTER_AND_RUBRIC.md`. Seed IDs (KV-AUD-001…041) are
confirmed/refuted here with evidence; new IDs continue from the ledger counter.

---

## Unit W1-S1 — `src/stores/useCombatStore.ts` (1690 lines) — Session 2, audited first-hand (every line)

**Context:** ephemeral (non-persisted) turn-based combat engine. Player derived stats flow in as args
(`derived: DerivedStats`) from the screen; the store mutates monster/effects/log/rewards and calls back
to character/soul/sacred/game stores. Kairos two-slot action economy + ~14 secondary-stat interactions.

### Correctness / connectivity
**KV-AUD-051 | S2 | Confirmed | L1/L3 | `:521,534`** — A weapon can deal **0 damage** despite the
`Math.max(1, …)` floor. `rawDamage = Math.max(1, baseAttackStat*(1-defenseReduction))` (`:521`) is
floored to ≥1, **then** `rawDamage *= triangleMultiplier` (`:534`). If `getDamageEffectiveness` returns
`0` (prior AUD-032: poison vs bone/armor/spirit), final damage floors to 0 → a poison-weapon player vs
a skeleton/golem does literally nothing every turn = **soft-lock** on a mandatory enemy. → floor damage
to ≥1 *after* the triangle multiply, or make the triangle a reduction (e.g. 0.25×) not 0×. (Cross-check
the 0-returning combos in `Weapon.ts`, W1-T4.)

**KV-AUD-052 | S2 | Confirmed | L1/L3 | `:1263-1282`** — Monster status procs derive from
`monster.base.damageTypes`, **not** from `MonsterSuffix.statusEffect`. The proc maps
fire→burn / ice→freeze / poison→poison / dark→curse, else a 30% bleed (`:1272-1276`). So a suffix like
"of Venom" (which sets `statusEffect`) **never** drives a combat proc, and monsters whose damage type is
lightning/holy/slash proc nothing but bleed. Confirms seed **KV-AUD-025** & prior AUD-089: suffix status
data is dead in combat, and `SUFFIX_FLOOR_GATES` early-floor safety is moot. → drive procs off the
suffix's `statusEffect`/`statusChance`.

**KV-AUD-053 | S2 | Confirmed | L1 | `:1519-1520`** — `Infinity`/`NaN` reward on a zero-CR monster.
`gold * (monster.finalCR / monster.base.baseCR) * goldModifier` and `xp * (finalCR/baseCR)` divide by
`base.baseCR`; any monster with `baseCR:0` yields Infinity gold + Infinity xp (and `0/0`=NaN). Confirms
prior AUD-036 **at the reward site**. → guard `baseCR` (clamp ≥0.1) or assert no zero-CR data (W3-DC1).

**KV-AUD-054 | S2 | Confirmed | L2 | `:527-532`** — `getDamageEffectiveness(weaponDamageType,
normalizedArmor as any)`. The normalizer maps plate→armor, scales→leather, ethereal→spirit, but
`flesh`, `bone`, `magic_resistant` pass through unmapped; if any isn't in `getDamageEffectiveness`'s
table it hits the `?? 1.0` neutral fallback — **silently** (the `as any` deletes the type guard that
would catch it). Confirms seed KV-AUD-026; ties to the StatusEffect/armor-vocabulary schism
(KV-AUD-039). → type the param to the real armor union; remove `as any` (verify table coverage W1-T4).

**KV-AUD-055 | S2 | Confirmed | L1/L3 | `:1459,1519-1524`** — `rewards.xp` is computed
(`xp = monster.base.xpValue`; scaled by CR) and written into `rewards`, but the game has **no XP system**
(no character XP field). Unless a screen reads `rewards.xp` (verify Wave 2), this is computed-and-
discarded — vestigial of a pre-"no XP" design (confirms prior AUD-037). → drop `xpValue`/`rewards.xp`.
> **[Update S22 — REVISED by KV-AUD-222 (W2-P1a): NOT discarded.** `combat.tsx handleVictory:1019-1024`
> reads `rewards.xp` and distributes `xp/4` as pending excelia to STR/END/AGI/PER, and the victory UI shows
> "+{xp} to combat stats" (`:1236`). So `xpValue → rewards.xp → proficiency` is a **live per-kill growth
> channel** — the "vestigial/discard" framing is withdrawn. The real defect is that it's **physical-only**
> (no INT/WIS/CHA/LCK) and routed through the flat path (068). See 222.]**

**KV-AUD-056 | S2 | Needs-repro | L6 | `:369-389,1517-1525`** — Rewards-clear timing (BUG-005). The only
victory payload is `rewards`, **set** in `calculateRewards` and **nulled** in `endCombat` (`:387`) and
the three combat-start actions. The victory screen must read `rewards` *before* anything calls
`endCombat`. This is a real ordering hazard to trace at the call sites in `combat.tsx` (Wave 2-P1); if
`endCombat` can fire first, the player loses all loot/gold on a win.

**KV-AUD-057 | S2 | Confirmed | L1/L3 | `:818-918`** — `playerUseItem` applies only some effect types in
the store; **`heal_percent_hp/sp` (`:845-852`) and `buff` (`:891-899`) only log** and delegate the
actual effect to the caller (or, for buff, to nothing — the "Apply as status effect" comment has no
code). If the screen doesn't read the returned `effect` and apply it, percentage potions and **all buff
potions are inert**. → apply these in the store (call `applyPlayerEffect` for buffs) or document the
caller contract; verify `combat.tsx` handles them (Wave 2).
> **[Update S21 — root of the "dead effect-handler" cluster:** later units found the same
> apply-only-some-effect-types pattern elsewhere — KV-AUD-116 (the `buff` case DOES work in
> `useInventoryStore.useConsumable`, so buffs work *out* of combat but not *in* it), KV-AUD-199 (skill
> `damage_percent`/`buff`/`flee` unhandled), KV-AUD-204 (consumable `reveal`/`identify` unhandled). Fix
> by unifying on one effect resolver shared by combat + out-of-combat + skills.]**

**KV-AUD-058 | S2 | Confirmed | L1/L3 | `:267-303` vs `:305-341`** — `startCombat` duplicates
`prepareEncounter`'s monster-generation but **lacks** the first-ever-combat safety (`:309-313` forces a
normal, non-boss/elite encounter so a new player can't be instakilled) **and** elite handling. If any
screen still calls `startCombat` (verify callers, Wave 2), a brand-new player can hit a boss on combat
#1. Also a DRY hazard — two encounter generators that can diverge. → unify on `prepareEncounter`; delete
`startCombat` if orphaned.
> **[Update S21 — compounds KV-AUD-138 (W1-S7a):** even the protection `startCombat` *lacks* is itself
> broken — `prepareEncounter`'s first-combat safeguard keys off meta `totalRuns`/`hasHadFirstCombat`, so it
> only ever protects the *first character on the device*. So whether combat enters via `startCombat`
> (no guard) or `prepareEncounter` (guard dead for char #2+), every post-first character is unprotected on
> fight #1. Fix 058 and 138 together.]**

**KV-AUD-059 | S3 | Confirmed | L1 | `:633-647,673` ** — AGI double-strike second hit uses
`derived.physicalAttack` unconditionally (`:637`), ignoring the weapon-formula routing used for the
primary hit; `playerQuickStrike` likewise only distinguishes magical vs physical (`:673`), not luck/
hybrid. Magic/luck builds' bonus hits deal physical-stat damage. → route bonus hits through
`resolveWeaponFormula` too.

**KV-AUD-060 | S3 | Confirmed | L1 | `:1493` vs `:329-333`** — Two disagreeing "elite" notions: the
explicit `monster.isElite` flag (set in `prepareEncounter`) and a local loot heuristic
`isElite = finalCR > baseCR + 1` (`:1493`) used for magic-stone drops. They can disagree, so loot
"elite-ness" ≠ encounter "elite-ness". → use one source.

### Balance (L9)
**KV-AUD-061 | S2 | Confirmed | L9 | `:519`** — Hybrid weapons get `attackPool = physicalAttack +
magicAttack` (full **sum** of both pools), while pure weapons get one. A hybrid build can roughly double
its base attack stat — a likely dominant strategy. → average or weight the two, don't sum (verify intent
vs `Stats.ts`, W1-T1).

**KV-AUD-062 | S2 | Confirmed | L9 | `:556-572,562-566,1249-1252`** — Deeply multiplicative damage:
`defenseReduction × triangle × exploitWeakness^min(debuffs,5) × variance × crit × weaken × flow(1+0.2n)`
plus additive cleave/combo/morale/momentum. The `exploitWeakness^5` (`:565`) and FLOW ×1.6 (`:571`)
compound into very high burst variance. Separately, LCK `luckyEscapeChance` (`:1249`) sets lethal damage
to `currentHP-1` — at high LCK the player approaches **immortality** (stacks with deity death-saves). →
cap total multiplier; make lucky-escape once-per-combat.

**KV-AUD-063 | S3 | Confirmed | L4 | `:961,1210,637,560`** — Balance literals hardcoded in the combat
engine instead of `GameConstants`: LCK-skill crit `30` (`:961`), defend `+50%` (`:1210`), double-hit
`0.7` (`:637`), momentum `0.002` (`:560`), proc base `0.20` (`:1267`). Violates the "balance lives in
`GameConstants`" law (R6). → centralize.

### Doc/connectivity reconciliation
**KV-AUD-064 | S3 | Confirmed | L3 | `:1387`** — Combat log capped at **20** (`.slice(-20)`); design doc
says 8 (BUG-011). Confirmed first-hand: code=20. → fix the doc (or code).

**KV-AUD-065 | S2 | Confirmed | L3 | `:55,730-733,1511`** — **Refines seed KV-AUD-003** (GameConstants
mostly-dead). First-hand: `GameConstants` is **partially live** — `CombatConfig.flee` (`:730-733`) and
`LootConfig.luckBonusPerPoint` (`:1511`) **are** imported and used here. But combat **ignores**
`CombatConfig.critDamage`/`defend`/`counter`/`damageEffectiveness` (it uses `derived.critMultiplier`,
hardcoded `0.5` defend, and `getDamageEffectiveness` from `Weapon.ts`). So the dead-vs-live split is
*per-field*, not whole-file. → audit GameConstants field-by-field in W4; don't blanket-delete.

**KV-AUD-066 | S3 | Confirmed | L1/L3 | `:866,1021`** — The cleanse debuff list
`['poison','bleed','burn','freeze','stun','blind','weaken','curse']` is duplicated verbatim in
`cure_all` (`:866`) and skill `cleanse` (`:1021`), and uses the **`StatusEffect.ts` vocabulary**
(`weaken`) — confirming the schism (KV-AUD-039): `Character.ts`'s `fear`/`silence`/`paralysis` are never
produced *or* cured in combat → those three are dead. → single shared `ALL_DEBUFFS` const; unify the
status model.

### Positives (verified — fairness / refutations)
- **KV-AUD-067 | Info | Confirmed | L3** — Combat is **well-wired** to the soul + sacred systems: ~30
  `soul.incrementBehavement(...)` calls (phys/magic attacks & kills, crits, dodges, blocks, observes,
  taunts, damage-taken, low-HP risk, boss-streak) and 7 `useSacredItemStore` metric calls fire across
  the file. (Each behavement **ID** must still be validated against `useSoulStore` definitions in
  W1-S4 — a typo'd ID increments nothing silently.) The **weapon triangle IS wired** in `playerAttack`
  (`:523-534`) → BUG-008/032 confirmed resolved. `damageMonster`'s `alreadyDead` guard (`:1357`)
  correctly prevents double-kill reward grants. Refutes any "combat doesn't track playstyle" claim.
  > **[Update S21 — CORRECTED by KV-AUD-096 (W1-S4a):** the praise here was half-wrong. Cross-validation
  > showed the store's behavement firing is *over-wiring*, not just "good wiring" — ~30 combat behavements
  > fire in BOTH the store *and* `combat.tsx` (KV-AUD-093 double-count). The standing positives (triangle
  > wired, `alreadyDead` guard, system is live) hold; the "well-wired soul" framing is superseded by 093.]

**Cross-checks discharged from W1-L1:** KV-AUD-043 (weapon-category→formula routing) **confirmed** — the
call sites pass `weapon.base.category ?? ''` directly (`:506,667`), so a `Set<string>` spelling drift
silently routes magic/hybrid → physical. KV-AUD-044 (sacred material `as never` fields) — not exercised
here; combat reads `derived.*`, not material fields, so the risk lives in `Stats.ts`/equip (W1-T1/S2).

**Unit verdict:** the engine is feature-rich and mostly correct, with strong soul/sacred wiring and a
real weapon-triangle — but it carries **two S2 correctness traps** (0-damage soft-lock, Infinity reward),
**several silent no-ops** (suffix status, buff/percent consumables, xp), **one safety regression**
(`startCombat` missing first-combat protection), and a **balance surface** (hybrid double-stat,
multiplicative burst, near-immortal LCK) that the balance pass must model. 6 cross-checks queued for
W1-S2 (rewards-clear caller, getDerivedStats path), W1-S4 (behavement IDs), W1-T1 (hybrid/derived),
W1-T4 (triangle table + armor union), Wave 2-P1 (`combat.tsx` rewards race + consumable application).

---

## Unit W1-S2 — `src/stores/useCharacterStore.ts` (1442 lines) — Session 3, audited first-hand (every line)

**Context:** persisted (`kohrvellia-character`) — owns the Character, the Falna stat-growth engine, the
derived-stats math combat consumes, equipment/inventory, level-up, death, deity favor, paragon buffs.

### Balance / growth (the headline)
**KV-AUD-068 | S2 | Confirmed | L3/L9 | `:377-417` vs `:245-291`** — **The stat-growth cost curve is
dead; live growth is flat.** Two paths exist: `addStatProficiency` (`:245-262`) climbs an *increasing*
`getProficiencyThreshold(grade)` curve (+100 pts per grade-up) — the only escalating-cost mechanism; and
`commitExcelia` (`:377-417`), the **live Falna path**, whose comment is explicit — *"FIXED: Proficiency
gains should directly increase points… 1 proficiency = 1 point"* (`:398-401`): `newPoints =
min(999, points + amount)`, **flat**, no threshold, `proficiency` reset to 0 (`:415`). Combat feeds
`addPendingExcelia` → `commitExcelia`, so the increasing-cost curve is bypassed and `addStatProficiency`
is likely orphaned (confirm callers in Wave 2). **Net: every point costs the same from grade I to SSS** —
the root cause of "SSS too cheap," compounding the compressed top-grade widths (KV-AUD-018). Confirms
seed KV-AUD-023 / prior AUD-087. → drive the canonical path off the escalating curve.

### Correctness / permadeath integrity
**KV-AUD-069 | S2 | Confirmed | L1/L6 | `:529-550`** — `modifyHP` can **resurrect a dead character**.
`isDead` is recomputed every call as `newHP <= 0` (`:534,546`); a *positive* `modifyHP` while dead sets
`newHP = currentHP(0) + amount > 0` → `isDead = false`. Nothing guards against healing a corpse, so any
post-death heal/regen (status tick, deity save, a screen race) silently un-kills the player — a
permadeath violation (R10). → early-return if `state.character.isDead` and `amount > 0`.

**KV-AUD-070 | S2 | Confirmed | L1 | `:702-768` vs `:673`** — Inventory overflow on armor/accessory
swap. `equipWeapon` guards `oldWeapon && newInventory.length < BAG_CAPACITY` (`:673`, the BUG-003 fix),
but `equipArmor` (`:710-721`) and `equipAccessory` (`:744-755`) push the displaced item into the bag with
**no capacity check** → `inventory.length` can exceed `BAG_CAPACITY (20)`. Inconsistent enforcement. →
apply the same guard (and a caller confirmation).

**KV-AUD-071 | S2 | Confirmed | L1 | `:180-191`, `:1232-1243`, `:1288-1299`** — The weapon
damage-routing block (isLuck/isMagic/isHybridMixed/physRatio/weaponDamage/weaponMagic/weaponLuck) is
duplicated **verbatim three times** — `computeMaxResources`, `getDerivedStats`, and
`getDerivedStatsWithBlessings`. A routing change must hit all three or they silently diverge (and they
feed maxHP, combat damage, and blessing-applied damage respectively). Confirms prior AUD-088. → extract
one `resolveWeaponDamageSplit(equipment)` helper.

**KV-AUD-072 | S2 | Confirmed | L2 | `:1224-1227`, `:1277-1280`** — Null-character derived-stat fallbacks
return a **9-field** object `as unknown as ReturnType<typeof calculateDerivedStats>`, but `DerivedStats`
carries ~30 fields combat reads (critMultiplier, cleaveDamage, armorPierce, spellPierce, luckAttack,
fortuneStrikeChance, comboRamp, moraleBonus, …). If combat ever derives with a null character, every
missing field is `undefined` → `NaN` propagates through damage. The cast deletes the guard. Confirms seed
KV-AUD-026. → return a fully-zeroed `DerivedStats`.

**KV-AUD-073 | S2 | Confirmed | L6 | `:1437-1440`** — No persistence versioning/migration. The `persist`
config sets only `name` + `storage` — no `version`, `migrate`, or `partialize`. The **entire** Character
(including computed `maxHP/maxSP`) is serialized; schema changes can't be migrated (only ad-hoc `??`
fallbacks in `computeCarryStats`/`resolveWeaponOutputCap` cover legacy), and stored max-resources can go
stale vs the formula across versions. → add `version`+`migrate`; `partialize` out derived fields.

### Connectivity / dead code
**KV-AUD-074 | S3 | Confirmed | L3 | `:444-449`** — INT & LCK stat-growth behavements never fire.
`commitExcelia`'s soul switch tracks END/AGI/WIS/CHA/PER/STR growth but **omits INT and LCK** — any
`*_int_growth`/luck-growth behavement is unreachable from the only growth commit. → add INT/LCK cases
(validate IDs against `useSoulStore`, W1-S4).

**KV-AUD-075 | S3 | Confirmed | L1 | `:1364-1366`** — Paragon `crit_damage` passive is applied as crit
**chance**, not crit **damage** ("Approximated… until critDamage is a first-class derived stat"). A title
promising crit damage silently grants crit chance. → add a real `critDamage` derived stat.

**KV-AUD-076 | S3 | Confirmed | L1 | `:894-926`** — `equipFromInventory`: armor slot is `as
'head'|'chest'|'hands'|'legs'` (`:912`) — a lie for any other slot; accessories are hardcoded to
`accessory1` (`:919-920`), so **`accessory2` is unreachable** via inventory-equip (a second accessory
overwrites the first). → respect the real slot; add accessory-slot selection.

**KV-AUD-079 | S4 | Confirmed | L1 | `:1132-1144`** — `setPatronDeity` sets `deityFavor=50` but does not
recompute `maxHP/maxSP` for the blessing (unlike `modifyDeityFavor`). Harmless at creation (createCharacter
recomputes) but a mid-game patron change wouldn't refresh resources. → recompute or document single-use.
> **[Update S21 — forward-link to KV-AUD-121:** `modifyDeityFavor` (the only post-creation writer of
> `character.deityFavor`, the value the blessing multiplier reads) turned out to have **0 callers**
> repo-wide. So `character.deityFavor` is frozen at 50 for the character's whole life and favor is
> mechanically inert for combat power — this S4 "single-use" note understated it; see the S1 at 121.]**

### Refinements & positives (fairness)
**KV-AUD-077 | Info | Confirmed | L6 | `:48-54`** — **Refines BUG-010 / KV-AUD-019.** `resolveWeaponOutputCap`
returns `Infinity` **only for a null weapon** (unarmed); the corrupt-tier path is guarded by `?? 3`. So
uncapped output is *unarmed-only*, not a corrupt-save bug as the doc implies. Still verify unarmed can't
scale unbounded. → reconcile the BUG-010 wording.

**KV-AUD-078 | Info | Confirmed | L4/L6 | `:237`, `:1431-1434`, `:1146-1170`** — **Refines KV-AUD-002 &
KV-AUD-004.** (1) `createCharacter` **does** call `useShopStore.resetReputation()` on new character
(`:237`) → shop-*reputation* bleed is handled; the remaining KV-AUD-002 gaps are sacred *character-scope*
metrics + `useInventoryStore` stash + shop `lifetimeGoldSpent` (verify W1-S4/S5). (2) The **live** blessing
path uses `types/Deity.getBlessingMultiplier` (0.5–1.5) via `getBlessingMultiplier` (`:179,1284,1434`) —
**not** `useDeityStore.FAVOR_STATUS` (0–2.0 with the 0× Abandoned). So the 0× landmine (KV-AUD-004) is a
latent table divergence, **not** currently wired to HP/combat. (3) `modifyDeityFavor` clamps `currentHP ≤
new maxHP` (`:1165-1166`) — correctly addressing prior AUD-033. Positives: the Falna carry model
(`levelHistory`→`computeCarryStats`→`calculateEffectiveStat`) is sound; `performLevelUp` auto-commits
pending excelia so no gains are lost on skip (`:1044-1046`); broad soul/sacred wiring throughout.

**Cross-checks discharged:** seed KV-AUD-024 — confirmed the store EXPOSES both `getDerivedStats` (no
blessing/paragon, blessingMult=1.0 `:1262`) and `getDerivedStatsWithBlessings` (blessing **and** paragon
buffs `:1325-1384`); whether *combat* passes the blessed one is a Wave 2-P1 (`combat.tsx`) check — if it
passes `getDerivedStats`, deity blessing + paragon are silently dropped from combat. **[Update S21 — the
blessing half is largely MOOT via KV-AUD-121 (W1-S6a): `modifyDeityFavor` has 0 callers, so
`character.deityFavor` is frozen at 50 and `getBlessingMultiplier` returns ~1.0× no matter which selector
combat reads. The paragon half is NOT moot — but it is separately broken (KV-AUD-177: ~half the noun
passives are dead). So the live damage from this selector gap is small; the wiring fix still matters.]** seed KV-AUD-046/047
(sacred armor/accessory bonuses) — **confirmed live**: both `getAccessoryStatBonuses` and
`getArmorStatBonuses` are merged into `mergedCarry` in all three derived paths (`:198-206,1248-1252,
1304-1308`), so sacred bonuses DO reach derived stats (but still miss any armor slot beyond head/chest/
hands/legs per KV-AUD-047). **[Update S21 — the parenthetical is now REFUTED: KV-AUD-195 (W1-T4) found
the game has only 4 armor slots (head/chest/hands/legs — no boots/feet), so `getArmorStatBonuses` misses
**nothing**. Sacred armor bonuses are fully live; seed 047 is withdrawn.]**

**Unit verdict:** the Falna carry architecture is genuinely well-built, but this store holds the audit's
**most important balance finding** (flat growth bypassing the cost curve, KV-AUD-068), a **permadeath
integrity bug** (resurrect-via-heal, KV-AUD-069), an inventory-overflow inconsistency, triple-duplicated
derived logic, and unversioned persistence. 2 cross-checks queued for Wave 2-P1 (blessed-selector usage,
`addStatProficiency` callers) and W1-S4 (INT/LCK growth behavement IDs).

---

## Unit W1-S3 — `src/stores/useDungeonStore.ts` (1119 lines) — Session 4, audited first-hand (every line)

**Context:** persisted (`kohrvellia-dungeon-v2`, `partialize`→`currentRun` only). Slay-the-Spire-style
node map generation + navigation + per-step ramifications + run flags + boss/milestone tracking.

### The farming exploit — now CONFIRMED end-to-end (was a "mechanism")
**KV-AUD-080 | S1 | Confirmed | L1/L9 | `:644-651`, `:698-719`, `:586`** — **Cleared combat/elite nodes
can be re-fought indefinitely.** Three facts combine: (1) `moveToNode` re-arms the node you *leave* —
`isCompleted: shouldReactivate ? false : …` for combat/elite (`:644-651`); (2) `getCurrentPathOptions`
returns **both forward and backward** connections (`forwardIds`+`backwardIds`, `:706-716`), so the UI
offers the node you just came from; (3) `moveToNode` performs **no navigability validation** (`:586` —
it finds the node by id and moves, never checking the target is connected). So: clear A → step to B
(A re-arms) → step back to A (now active again) → re-fight for gold/loot/proficiency/soul → repeat.
This **supersedes/confirms seed KV-AUD-005** (the open "is backtracking possible?" question is answered:
yes, explicitly). Directly violates the #1 pillar "Challenge, Not Grind" (benchmark: Grid Sage/Cogmind,
`05`). **Irony:** the store *does* implement anti-farming for *event weapons* (`canGrantEventWeapon`,
4-floor cooldown, `:509-513`) while leaving combat-node farming wide open. → forward-only navigation
(drop `backwardIds`) **and/or** never set `isCompleted:false`; validate the target in `moveToNode`.

**KV-AUD-081 | S2 | Confirmed | L1/L6 | `:572-596`** — `moveToNode` accepts **any** `nodeId` with no check
that it's reachable from the current node (no connection lookup). The only gate is the screen rendering
buttons from `getCurrentPathOptions`. A bug, a stale button, or a direct call could teleport to the boss
or skip rows. → validate `nodeId ∈ getCurrentPathOptions()` inside the action (defense-in-depth; also
closes the farm's backward step if combined with forward-only).

### Generation / determinism
**KV-AUD-082 | S2 | Confirmed | L1/L6 | `:45,1052-1054`** — The "seed" is non-deterministic and floors
are non-persistent. `generateFloorMap` seeds `createSeededRNG` with `Date.now() + floorNumber*1000`
(`:45`) and stores `seed` in the map (`:184`) as if reproducible — but a wall-clock seed can never be
reproduced, so the seeded-RNG buys nothing. Worse, `ascendFloor` calls `generateFloorMap(previousFloor)`
fresh (`:1054`, "fresh path each time") → going **back up** a floor yields a **different** layout than
coming down. Floors aren't stable spaces; ascend↔descend re-rolls content (and pairs with the KV-AUD-080
farm). → if reproducibility/persistence is wanted, persist generated maps per floor and seed from the
run seed, not `Date.now()`.

**KV-AUD-083 | S3 | Confirmed | L3 | `:206-207,248`** — Dead `shop` node + contradictory comment.
`selectNodeType`'s `validTypes` (`:248`) omits `shop`, so shop nodes never generate, yet the function's
own doc comment (`:206-207`) says *"Shop weight is low (5): rare wandering merchant encounters."*
Confirms prior AUD-044. → remove the dead shop surface (and `NODE_TYPE_WEIGHTS.shop`, W1-T2) or implement.

**KV-AUD-084 | S3 | Confirmed | L3 | `:272-273`** — `selectMysteryRevealType` ignores its `_floorNumber`
arg (mystery reveal is floor-independent 60/20/20), flagged with a vestigial
`// eslint-disable-next-line @typescript-eslint/no-unused-vars` — and **no ESLint is configured**, so the
suppression references a linter that never runs. → drop the param + the dead directive.

**KV-AUD-085 | S3 | Confirmed | L3 | `:62-69`** — **Confirms seed KV-AUD-021 / prior AUD-046:** floor size
is `ROWS_PER_FLOOR` middle rows × 2-3 columns (`:63,69`) — `NODES_PER_FLOOR_BASE/MAX` are **not used**
here (they live dead in `Dungeon.ts`, W1-T2). PROGRESS's "45 rooms" is stale. → delete the dead
constants / fix docs.

### Smaller correctness / persistence
**KV-AUD-086 | S2 | Needs-repro | L1 | `:454-478`** — `enterFloor` ticks the living economy
(`useMarketStore.onFloorDescend`, `:475`) on every call; the comment claims "real floor descents, not
enter/exit cycles" (`:473`). If `enterFloor` is also called on resume/re-entry from town (verify callers,
Wave 2-P3 `floor.tsx`), the market over-ticks. → gate the tick on an actual depth increase.

**KV-AUD-087 | S3 | Confirmed | L1 | `:418-430`** — `endRun` reads `monstersKilled` from
`pendingExcelia?.monstersKilled ?? 0` (`:428`). If excelia was committed (→ `pendingExcelia=null`) before
the run ends, run-stat kills report **0**. → track kills on the run, not on pending excelia.

**KV-AUD-088 | S3 | Confirmed | L6 | `:1112-1116`** — `partialize` persists only `currentRun`, so
`floorContext` (per-floor flags: usedHealing/triggeredTrap/restedThisFloor) is **not** persisted — an app
close mid-floor resets those, dropping any behavement/achievement keyed on them. Also the store version is
a manual name suffix (`-v2`) with no `migrate`. → persist `floorContext` (or accept the reset
explicitly); use zustand `version`+`migrate`.

**KV-AUD-089 | S4 | Confirmed | L9 | `:251-261`** — Treasure is gated **twice** (weighted selection *then*
a 4–12% floor roll, else `→combat`), so `NODE_TYPE_WEIGHTS.treasure` overstates the real treasure rate.
Intended ("ULTRA-RARE") but makes the weight table misleading for tuning. → fold the rarity into the
weight.

**KV-AUD-090 | Info | Confirmed | L3** — **Positives:** `startNewRun` snapshots soul-vector scores for
per-run boss-dialogue delta (`:396-406`, addresses prior BUG-026) and resets sacred run metrics (`:415`);
`moveToNode` validates `currentRun`/`currentMap` defensively; generation guarantees ≥1 incoming connection
per node (`:143-158`) and a structural elite gatekeeper before the boss (`:160-169`). `clearAllData`
(`:1103-1105`) correctly nulls run/ramifications/floorContext (this is what `clearAllStores` calls).

**Unit verdict:** generation is thoughtfully built (anti-cluster guards, structural elite, floor-tiered
weights), but the store contains the audit's **second confirmed S1 — a wide-open grind exploit**
(KV-AUD-080), plus an unvalidated `moveToNode`, a non-deterministic "seed" with re-rolling floors, and
the long-confirmed dead shop/constants. 1 cross-check queued for Wave 2-P3 (`enterFloor` callers /
market over-tick) and W1-T2 (`Dungeon.ts` biomes + dead constants + `NODE_TYPE_WEIGHTS`).

---

## Unit W1-S4a — `src/stores/useSoulStore.ts` (405 lines, not 684) — Session 5, audited first-hand (every line) + full cross-validation

**Context:** persisted (`kohrvellia-soul`). Holds the 90 behavement *definitions*, the per-behavement
progress, vector scores, and the Level-10 Denatus/Paragon ceremony. This unit was audited *with* a
codebase-wide grep of every firing site so each behavement ID could be validated end-to-end.

### Per-function coverage map (proof of line-by-line)
| Symbol | Lines | Verdict |
|---|---|---|
| `BEHAVEMENT_DEFINITIONS` | 31-141 | **90** entries (not 85) — KV-AUD-091; 2 firing-but-maybe-unreachable — KV-AUD-095 |
| `initializeDenatus` | 186-201 | Wired (`useGameStore:340,347`, `confirm.tsx:80`) — KV-AUD-096 |
| `reset` | 203-208 | Clean — nulls `denatus`+`ceremonyCompleted`; called by `clearAllStores` ✓ |
| `trackBehavement` | 211-242 | Atomic (mutates inside `set`); clamps `Math.min(target, progress)` ✓ |
| `incrementBehavement` | 244-252 | **Non-atomic read-modify-write** — KV-AUD-092 |
| `setBehavementProgress` | 254-256 | Delegates to `trackBehavement` (idempotent set) ✓ |
| `checkConsecutiveBehavement` | 258-296 | Atomic (reads inside `set`) — correct; contrast w/ `incrementBehavement` |
| `recalculateVectorScores` | 299-312 | Clean |
| `performDenatus` | 315-332 | One-time guard (`ceremonyCompleted`); forwards caller `topStats` — KV-AUD-097 |
| `addHint` | 335-349 | Clean — last-20 ring buffer; caller = deity hints (verify W1-S6) |
| getters | 352-394 | Delegate to `Behavement.ts` (W1-T3); `getDominantVector` defaults `COMBAT_PHYSICAL` |
| `persist` config | 396-399 | **No `version`/`migrate`** — KV-AUD-094 |

### Behavement firing cross-validation (the headline)
**KV-AUD-093 | S2 | Confirmed (dual sites) / per-event 2× Likely | L1/L9 | store vs `combat.tsx`** — **~30
combat behavements are double-counted.** The combat **store** fires them inside its actions AND the
combat **screen** fires the *same IDs* in the handlers that call those actions. Because both use
`incrementBehavement` (additive), each combat event counts **twice**. Representative duplicates (store →
screen):

| Behavement | `useCombatStore.ts` | `combat.tsx` |
|---|---|---|
| `phys_attacks_100/500` | `:539-540` | `:308-309` |
| `phys_crits_25/100` | `:542-543` | `:289-290` |
| `phys_kills_50/200` | `:1404-1405` | `:314-315` |
| `*_weapon_kills` (str/agi/per/cha/lck/end) | `:1407-1422` | `:319-324` |
| `magic_attacks_100/500`, `magic_kills_50/200`, `magic_*_weapon_kills` | `:546-547,1412-1419` | `:447-455` |
| `tank_blocks_50/200` | `:722-723` | `:334-335` |
| `tank_damage_taken_1000/5000` | `:1287-1288` | `:786-787` |
| `tank_heal_received` | `:913` | `:385` |
| `caution_observes/200` | `:768-769` | `:511-512` |
| `caution_consumable_use` | `:911` | `:407` |
| `evade_dodges_50/200` | `:1174-1175` | `:812-813` |
| `social_taunts/100` | `:810-811` | `:361-362` |
| `risk_low_hp_attacks` | `:550` | `:272` |
| `glory_boss_streak_3/5` | `:1438-1439` | `:1058-1059` |
| `resource_gold_1000/10000` | `useCharacterStore:576-577` (via `modifyGold`) | `:1092-1093` |

Impact: every **COMBAT_PHYSICAL/MAGIC/TANK/EVASION** counter (and combat-derived RESOURCE/SOCIAL) advances
at **2×**, while purely screen-fired vectors (EXPLORATION rooms, CAUTION rooms, SOCIAL shops/shrines,
GLORY floor-survival) advance at **1×** — so the hidden vector balance that *defines the Paragon title* is
systematically skewed toward combat. This is the precise mechanism behind a "why is my title always a
combat title" outcome, and it compounds KV-AUD-011 (sort bug) and KV-AUD-020 (mythic=100). **Note the
distinction:** the *`setBehavementProgress`* duplicates (`resource_legendary_find` store
`useCharacterStore:830` + screen `:1097`; `magic_no_physical`, `glory_perfect_floor`, `evade_boss_no_hit`)
are **idempotent** (set to 1, not additive) → **not** affected. → remove the behavement calls from one
layer (the store is the cleaner owner; strip them from `combat.tsx`), or centralize all soul tracking in
the store and never fire from screens. *(Per-event 2× to be nailed in W2-P1 by tracing that
`combat.tsx:308` and the `playerAttack` call share one handler — the dual sites themselves are confirmed.)*

### Code-level correctness
**KV-AUD-091 | S2 | Confirmed | L3 | `:31-141`** — There are **90** behavements, not the "85" every doc
states (`SOUL_BEHAVEMENTS.md`, PROGRESS, CLAUDE). Count: 4 vectors ×10 (PHYS/MAGIC/TANK/EVASION) + 5 ×8
(RISK/CAUTION/SOCIAL/EXPLORATION/RESOURCE) + GLORY ×10 = **90**. This matters because the CR-adjective
thresholds (`SoulSystem.crScoreRanges`, mythic=100) and `calculateBehavementScore` normalize against the
true count (W1-T3) — a wrong documented count means the published "max score" math is wrong. Confirms seed
KV-AUD-030. → fix docs; assert `BEHAVEMENT_DEFINITIONS.length` in a test.

**KV-AUD-092 | S3 | Confirmed | L1/L10 | `:244-252`** — `incrementBehavement` is a **non-atomic
read-modify-write**:
```ts
incrementBehavement: (behavementId, amount = 1) => {
  const { denatus } = get();                       // ← reads current OUTSIDE set()
  if (!denatus) return;
  const behavement = denatus.behavements.find(...); // ← stale snapshot
  get().trackBehavement(behavementId, behavement.current + amount); // computes from stale read
}
```
Two synchronous increments of the **same** id (e.g. a double-hit that resolves two `phys_attacks` in one
tick, or React batching) both read the same `current` → the second overwrites the first (lost update).
Contrast `checkConsecutiveBehavement` (`:258-296`), which reads the behavement **inside** `set((state)=>…)`
and is race-free — so the codebase already has the correct pattern. → refactor `incrementBehavement` to do
the read+add **inside** `trackBehavement`'s `set` (pass a delta, not an absolute).

**KV-AUD-094 | S2 | Confirmed | L6 | `:218`, `:396-399`** — No persistence migration. `persist` sets only
`name`+`storage`; the 90-element `denatus.behavements` array is serialized whole. `initializeDenatus`
(`:190`) only builds the array from definitions on a **fresh** denatus, and `trackBehavement` bails when an
id isn't found (`:218` `if (behavementIndex === -1) return state;`). So after a definitions change
(add/rename a behavement) that ships to an existing save, the **new** ids silently no-op forever and
**removed** ids linger as dead progress — with no migration to reconcile. → add `version`+`migrate` that
merges current `BEHAVEMENT_DEFINITIONS` into the persisted array on load.

### Connectivity nuances
**KV-AUD-095 | S3 | Confirmed | L3 | `room.tsx:772`, `useDeityStore.ts:322`** — Two behavements have a
firing site but a **possibly-unreachable trigger**: `explore_secret_rooms` is incremented at `room.tsx:772`,
yet floor generation has **no secret-room node type** (W1-S3 `selectNodeType` validTypes omits any
"secret") — so the increment may be in dead code; and `glory_challenge_complete` fires at deity store
`:322` though God-Challenges are "NOT STARTED" (PROGRESS 2.4). → confirm reachability in W2 (room.tsx) /
W1-S6 (deity challenges); if unreachable, those two behavements can never complete (dead vector points).
> **[Update S21 — both halves now resolved within Wave 1:** (1) `glory_challenge_complete` is **reachable**
> — KV-AUD-127 (W1-S6a) confirmed God-Challenges ARE wired (`issueChallenge`←familia, `recordChallengeEvent`
> ←room/combat/floor), so PROGRESS "2.4 NOT STARTED" is stale. (2) `explore_secret_rooms` is **confirmed
> unreachable** — no secret-room node type generates — and this is precisely the example KV-AUD-178 (W1-T3)
> uses to prove the max behavement score is capped **below 100**, making the Mythic title impossible. So one
> half is fine, the other is a dead vector point with a downstream consequence.]**
> **[CORRECTION S24 — the (2) above is WRONG:** KV-AUD-244 (W2-P2) found `explore_secret_rooms` **IS
> reachable** — it fires on *every mystery-node reveal* (`room.tsx:772`), and mystery nodes generate. So it
> is **not** a dead vector point, and 178's "Mythic capped <100 because this can't fire" example is undercut.
> Both halves of 095 are reachable. (R1 in action — correcting my own S21 annotation.)]**

**KV-AUD-096 | Info | Confirmed | L3** — **Corrects W1-S1 KV-AUD-067.** That note praised the store's
behavement firing as "good wiring"; cross-validation shows it's actually **over**-wiring (the source of the
KV-AUD-093 double-count). Positives that stand: the system **is** initialized (`useGameStore:340,347`;
`confirm.tsx:80`) and the ceremony **is** invoked (`denatus.tsx:117`), so the soul layer is live; and the
vast majority of the 90 behavements have real firing sites spread across combat/room/floor/level-up/deity
(coverage is broad, contradicting any "half the soul system is unfired" claim).

**KV-AUD-097 | S3 | Confirmed | L1 | `:315-319`** — `performDenatus(topStats)` forwards the caller's
pre-chosen `[StatName,StatName]` straight to `generateParagonTitle` (`:319`); the store adds no validation
and no agency. This is the store-side half of KV-AUD-011 (sort bug) / prior AUD-065 (no player choice on
ties) — the title's correctness depends entirely on `Behavement.ts` (W1-T3) and the `denatus.tsx` caller
(W2-P4). → resolve in those units.

**Unit verdict:** the soul store's own code is small and mostly clean (atomic `trackBehavement`/
`checkConsecutive`, one-time ceremony guard), but cross-validation surfaced a **systemic double-count**
(KV-AUD-093) that biases the entire Paragon mechanic toward combat, plus a count-drift, a non-atomic
increment, and an unversioned 90-element persisted array that breaks on any definitions change. Crucially,
the verification **refuted** the scarier hypothesis (a dead/unfired soul system) — the wiring is broad and
the ceremony is live. Cross-checks queued: W2-P1 (`combat.tsx` per-event double-fire trace + the ~30 dup
removals), W2-P4 (`denatus.tsx` topStats agency), W1-T3 (`Behavement.ts` score normalization vs count=90),
W1-S6 (deity `glory_challenge_complete` reachability).

---

## Unit W1-S4b — `src/stores/useSacredItemStore.ts` (617 lines) — Session 6, audited first-hand + item-data & caller cross-reference

**Context:** persisted (`kohrvellia-sacred-items`). Accumulates ~50 metrics and checks them against every
sacred item's `acquisition.requirements` to auto-unlock pantheon pieces, domain artifacts, and deity
relics (~770 checkable items via `getAllCheckableItems`). Audited with a grep of `src/data/items` (which
items use which metrics, at what value) and a caller grep (which metric writers actually fire).

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `SacredItemMetrics` / `INITIAL_METRICS` | 25-181 | `character_*` declared "reset on new character" but no resetter — KV-AUD-098 |
| `evaluateRequirement` | 187-258 | **14 `return 0` stubs** + reads 3 no-writer metrics — KV-AUD-099 |
| `checkItemUnlockable` | 260-276 | `value===0` ⇒ "must be zero" semantics — interacts catastrophically with the 0-stubs (KV-AUD-099) |
| `getAllCheckableItems` | 282-285 | Rebuilds ~770-item array every call — KV-AUD-101 |
| increment/record actions | 300-505 | Atomic ✓; **inconsistent `checkAndUnlock`** (KV-AUD-100); `recordParagon`/`incrementEventSuccess` have no callers (KV-AUD-099) |
| `resetRunMetrics` | 509-529 | Resets `run_*` only — **not** `character_*`/lifetime (KV-AUD-098) |
| `checkAndUnlock` | 533-576 | Full-catalog scan per call; pushes to inventory via `require()` |
| `forceUnlock` | 578-590 | **Dead code — zero callers** (KV-AUD-099) |
| `persist` | 608-616 | `partialize`→acquired+metrics; **no version/migrate** — KV-AUD-102 |

### The sacred-item unlock system is substantially broken (the headline)
**KV-AUD-099 | S1 | Confirmed | L3/L1 | `:206-256`, `:578`, item data** — A large fraction of the ~770
sacred items can **never** unlock, and a second set unlock **falsely**. Three compounding causes:

**(a) 14 metrics hardcode `return 0`** (`evaluateRequirement`): `boss_noattack`(206), `boss_skillonly`(207),
`floors_nodeath`(210), `floor_noconsumable`(211), `floor_nodefend`(212), `dodges_total`(215),
`taunt_total:causes_enemy_flee`(221), `achievements_total`(245), `level_reached`(246), `stats_grade`(249),
`same_weapon_run`(252), `debuffs_active_boss`(253), `sp_damage_dealt`(254), `custom`(255).

**(b) `forceUnlock` (the "checked externally" escape hatch) is never called** — grep across the whole repo
finds only its declaration/impl (`:122,578`). So `level_reached`/`stats_grade` items, whose comments say
"checked externally", have **no** external checker.

**(c) Two more metrics have no writer at all:** `recordParagon` (sets `paragon_achieved`) and
`incrementEventSuccess` (sets `event_success`) are **never called anywhere** (caller grep), and there is no
`incrementSkillUse` (so `skill_uses`/`skill_sp_spent` are always 0).

**Bidirectional impact, with real items:**
- **Unobtainable** (`requireAll` + dead metric + `value>0` ⇒ `0 >= value` false forever):
  `deityRelics_dark.ts:31,49,80,204` & `deityRelics_eastAsian.ts:219,298,313` (`level_reached` 2-5);
  `deityRelics_dark.ts:32`/`eastAsian.ts:238` (`stats_grade`); `dark.ts:298-299`/`egyptian.ts:183`
  (`floor_nodefend`/`floor_noconsumable` 10-15); `eastAsian.ts:65` (`sp_damage_dealt` 1500);
  `eastAsian.ts:206` (`boss_skillonly`); `eastAsian.ts:299` (`achievements_total` 3). `level_reached`
  alone gates a large share of the **single_character deity relics** across all 16 relic files.
- **False-positive unlock** (`value:0` "must-be-zero" + dead metric ⇒ `0===0` true): `eastAsian.ts:50`
  `{metric:'boss_noattack', value:0}` is auto-satisfied, so the relic unlocks on its *other* requirement
  (`boss_kills_run ≥ 1`, i.e. any boss kill) — the intended "defeat a boss with ONLY basic attacks"
  challenge is silently bypassed. Every `value:0` requirement on a dead metric is a free pass.

→ Fix in three parts: implement the 14 metric trackers (or wire `forceUnlock` from the level-up/denatus/
stat screens for `level_reached`/`stats_grade`/`paragon`); call `recordParagon`/`incrementEventSuccess`;
and make the `value:0` path require the metric to be **live** (e.g. a `trackedMetrics` allow-list) so a
0-stub can't auto-satisfy. Quantify exact affected item count in W3-DI (full item-data pass). This
confirms seed **KV-AUD-006** with far more precision and a second failure mode.

### Permadeath state-bleed (extends KV-AUD-002)
**KV-AUD-098 | S2 | Confirmed | L4/L6 | `:57-59`, `:509-529`, `:539`, `:611-614`** — Sacred state never
resets on a new character, with two consequences:
1. **`acquired` bleeds and *blocks* re-earning.** `acquired` is persisted (`:612`) and `clearAllStores`
   doesn't touch this store (W1-L1 KV-AUD-002). On a new character, `checkAndUnlock` skips any
   already-acquired id (`:539 if (acquired.includes(item.id)) continue`). The new character has a **fresh
   inventory** (it never received the item) yet can **never unlock it** → sacred items earned by a dead
   character are permanently lost to all future characters.
2. **`character_*` metrics are documented to reset but don't.** `:57-59` label `character_boss_bypass`/
   `character_boss_kills_unique` "reset on new character," but `resetRunMetrics` (`:509-529`) clears only
   `run_*`, and **no `resetCharacterMetrics` exists**. So single-character relic progress accumulates
   across permadeath. → add a `resetForNewCharacter()` (clears `acquired` + `character_*` + lifetime as
   designed) and call it from `createCharacter`/`clearAllStores`.

### Correctness & performance
**KV-AUD-100 | S2 | Confirmed | L1/L3 | various** — Inconsistent unlock-checking. Most increments end with
`get().checkAndUnlock()`, but **seven do not**: `incrementFlee`(338-347), `incrementShopSpend`(397-399),
`incrementEventSuccess`(421-423), `incrementShopVisit`(425-427), `incrementDamageTaken`(472-480),
`setBossNoDamage`(503-505), and critically **`recordMaxFavor`**(448-460) — which sets
`deities_at_max_favor`, the exact gate `checkAndUnlock` uses for secret items (`:541`). So hitting 100%
favor does **not** immediately check the deity's secret relic; it unlocks only on the next unrelated metric
event. → call `checkAndUnlock()` after any metric that can satisfy a requirement (or after every set).

**KV-AUD-101 | S2 | Confirmed | L5 | `:282-285`, `:533-545`** — `checkAndUnlock` runs on **every** metric
increment (every kill via `incrementKills:309`, observe, heal, gold update…), and each call rebuilds the
entire item list — `ALL_DEITY_RELICS.flatMap(r => [r.weapon, r.accessory])` (~672) + pantheon pieces +
artifacts ≈ **770 items** — then evaluates every item's requirements. That's an unmemoized O(items ×
requirements) scan per combat tick on a 60fps mobile target. → memoize `getAllCheckableItems` (module
const), index items by metric, and/or debounce `checkAndUnlock`.

**KV-AUD-102 | S3 | Confirmed | L6 | `:608-616`** — No persistence `version`/`migrate`; `metrics` (incl.
the evolving `SacredItemMetrics` shape) and `acquired` are serialized whole. A metrics-shape change can't
migrate. → add versioning.

**KV-AUD-103 | Info | Confirmed | L3** — Positives: every increment mutates atomically inside `set`; the
metric *writers* that exist are correctly wired (`incrementMysteryRoom`←`room.tsx:183`,
`incrementTreasureRoom`←`room.tsx:322`, `incrementBlacksmithSpend`←`useBlacksmithStore:311`,
`recordMaxFavor`←`useDeityStore:152`, `incrementShopVisit`←`useShopStore:492`); the conditional
requirement engine (`requireAll`/some, "must-be-zero") is a sound design **where the metric is live** — the
failure is entirely the dead metrics + dead `forceUnlock`, not the evaluator.

**Unit verdict:** beneath a clean, atomic store sits a **largely non-functional content system** — by the
combination of 14 `return 0` stubs, 3 no-writer metrics, and a never-called `forceUnlock`, a major share of
~770 sacred items is unobtainable, while `value:0` requirements on dead metrics hand out *false* unlocks;
plus a confirmed permadeath bleed (`acquired` blocks re-earning) and an O(770)-per-tick scan. This is the
unit's S1. Cross-checks queued: **W3-DI** (exact unobtainable-item count across all 16 relic files +
pantheon sets), **W2-P4** (does level-up/denatus call `recordParagon`/`forceUnlock`?), **W1-S6** (deity
`recordMaxFavor`/secret-relic flow). Closes the W1-L1/W1-S2 KV-AUD-002 sacred cross-check: **confirmed the
char-scope + acquired bleed is real and unmitigated.**

---

## Unit W1-S5a — `useShopStore.ts` (579) + `useMarketStore.ts` (219) — Session 7, audited first-hand + consumer cross-reference

**Context:** the town economy. `useShopStore` (persisted `kohrvellia-shop`) = general/equipment vendor
stock, pricing, reputation, "merchant memory." `useMarketStore` (persisted `kohrvellia-market`) = a
material-price fluctuation system. Audited with a grep of every `useMarketStore` consumer.

### Per-function coverage maps
**`useShopStore`:** `calcExpectedSpend`(99-118) exponential expectation ✓ · `shouldRefreshStock`(136-153)
stock tier keyed to `bestFloorReached` — KV-AUD-105 · `refreshStock`(156-220) guarantees armor stock —
KV-AUD-108 · `purchaseConsumable`(232-325)/`purchaseEquipment`(328-413) spend **`useInventoryStore`** gold —
KV-AUD-106 · `sellItem`(416-456) no soul/rep — KV-AUD-109 · `recordVisitEnd`(489-526) updates
`lifetimeGoldSpent` · `addReputation`(533-546) clamped + discovery hook ✓ · `resetReputation`(549-551)
**resets rep only** — KV-AUD-104 · `partialize`(568-576) persists `lifetimeGoldSpent` · `_Consumable`
import(10) dead — KV-AUD-110.
**`useMarketStore`:** `onFloorDescend`(121-158) tick/expire/spawn ✓ · `recordSale`(160-167) ✓ ·
`getMultiplier`(169-191) **only consumer = guildhall** — KV-AUD-111 · `getSupplyPressures`(195-204) ✓ ·
`reset`(206-212) **called by `clearAllStores`** ✓ (no bleed — contrast shop).

### State-bleed (closes the KV-AUD-002 shop cross-check)
**KV-AUD-104 | S2 | Confirmed | L4/L6 | `:496-502,549-551,568-576`** — Shop `lifetimeGoldSpent` bleeds
across permadeath. `resetReputation` (the new-character reset, called at `useCharacterStore:237`) resets
**only** `npcReputation`:
```ts
resetReputation: () => { set({ npcReputation: DEFAULT_NPC_REPUTATION }); },
```
but `lifetimeGoldSpent` is persisted (`:575`) and reset **nowhere** (clearAllStores doesn't call the shop
at all — W1-L1). So a new level-1 character inherits the dead character's lifetime spend → `calcExpectedSpend`
(`:99-118`) immediately demands high per-visit spending (e.g. ≥1,200g at lifetime 8k) → `recordVisitEnd`
docks reputation for "underspending" on a broke fresh character → higher prices. Precise, confirmed shop
half of KV-AUD-002. → reset `lifetimeGoldSpent`+`belowExpectationScore` in `resetReputation`.

### Economy correctness / connectivity
**KV-AUD-106 | S2 | Needs-repro | L1/L3 | `:259,270,355,450`** — **Two gold pools.** The shop reads/mutates
**`useInventoryStore`** gold (`inventoryStore.getGold()`/`spendGold`/`addGold`), but combat rewards and
`modifyGold` operate on **`character.gold`** (W1-S1/S2). If the two pools aren't synced on town entry, gold
earned in the dungeon is **not spendable** at the shop, and shop sales pay into a different pool than the
dungeon spends from. Potential core-economy disconnect. → **resolve in W1-S5b** (does `useInventoryStore`
mirror `character.gold`?) + Wave 2 (town transition sync). **[Update S21 — RESOLVED & REFUTED in W1-S5b:
`useInventoryStore`'s `addGold`/`spendGold`/`getGold` are a thin **facade** that delegate straight to
`character.gold`. There is NO second pool; dungeon gold IS shop gold. This dissolves the thread and also
corrects CLAUDE.md's "separate stash" claim. Filed `Needs-repro` precisely so it could be checked — it was.]**

**KV-AUD-105 | S2 | Confirmed | L9 | `:139,158,174-179`** — Shop stock tier is keyed to
`useGameStore.bestFloorReached` (meta, cross-character), not the current character's depth. A new level-1
character created after a deep run sees gear generated for the best-ever floor — over-tier and unaffordable.
→ key stock to the current run depth, or clamp to character level.

**KV-AUD-108 | ~~S2~~ REFUTED→Info (by W2-P7b KV-AUD-281: armor IS equippable via `equipFromInventory`; defense applies — don't gate it out, finish wiring penalties/accessory2) | L9 | `:181-185,361-370`** — The shop guarantees
one armor per slot + ~40% random armor and fully supports buying it, but whether bought armor is
**equippable** depends on the town inventory UI (the store supports it — W1-S2 `:910-915` — but the UI may
hide armor slots "Phase 3"). If hidden, players buy unusable goods (prior AUD-084). → confirm Wave 2; gate
armor out if unequippable.

**KV-AUD-107 | S2 | Confirmed | L3 | `:40,93,484-486`** — Dual blacksmith reputation:
`useShopStore.npcReputation.blacksmith` exists (default 1) and `getReputation('blacksmith')` reads it, but
**no shop code writes it** (purchases touch only general/equipment), while `useBlacksmithStore` keeps its
own. The shop's blacksmith rep is likely dead/stale. Confirms KV-AUD-016. → resolve canonical source in
W1-S5b; delete the unused one.

**KV-AUD-109 | S3 | Confirmed | L3 | `:416-456`** — `sellItem` fires no soul behavement / sacred metric,
whereas Guild Hall material sales fire `resource_sell_items` (`guildhall:445,474`). Selling at the shop
doesn't count toward the "Merchant" behavement; selling at the guildhall does — invisible inconsistency. →
fire `resource_sell_items` + `incrementShopSpend` from `sellItem`.

### Market store
**KV-AUD-111 | S3 | Confirmed | L3/L8 | consumer grep** — The "Living Economy" is **narrowly scoped &
mislabeled.** `getMultiplier` is consumed **only** by the Guild Hall material board
(`guildhall/index.tsx:421,457,502`) → it affects **material sell prices only**, not shop buy/sell,
consumables, or equipment (the shop never imports `useMarketStore`). The docstring "The Living Economy"
oversells a one-screen system. **Positive:** unlike the shop, `reset()` **is** wired into `clearAllStores`
(`:27`) so the market doesn't bleed. → broaden it to the shop economy or rename to its true (material-only)
scope.

**KV-AUD-112 | S3 | Confirmed | L9 | `:177-190`** — Market event effects stack **multiplicatively** with a
floor of 0.25 but **no ceiling**; two stacked 3× events = 9× on a category. Material prices can spike
unbounded. → cap the upside (e.g. max 4×).

**KV-AUD-110 | S4 | Confirmed | L3 | `:10`** — Dead import `Consumable as _Consumable` (underscore dodges
`noUnusedLocals`). Confirms prior AUD-064. → delete.

**Unit verdict:** the shop is a rich, well-built vendor (exponential surcharge, CHA-haggle irritation,
reputation discovery, merchant-memory expectations) but carries a confirmed **permadeath bleed**
(`lifetimeGoldSpent`), a **meta-keyed stock tier**, a ~~likely **two-gold-pool disconnect** (the most
important open thread)~~ **[S21: REFUTED in W1-S5b — no second pool; facade over `character.gold`]**, and a dead dual blacksmith-rep; the market is sound but mislabeled and narrowly
wired. Cross-checks for **W1-S5b**: `useInventoryStore`↔`character.gold` sync (KV-AUD-106) + canonical
blacksmith rep (KV-AUD-107); **Wave 2**: armor equippability + `recordVisitEnd`/`resetSessionCounts`
callers.

---

## Unit W1-S5b — `useInventoryStore.ts` (247) + `useBlacksmithStore.ts` (433) — Session 8, audited first-hand

**Context:** `useInventoryStore` (persisted `kohrvellia-inventory-ui`) advertised as "stash/gold" but is
actually a **facade** over `useCharacterStore`. `useBlacksmithStore` (persisted `kohrvellia-blacksmith`) =
identify/upgrade/reputation for the smith (Garm). Audited to resolve the W1-S5a gold-pool + dual-rep threads.

### Per-function coverage maps
**`useInventoryStore`:** `useConsumable`(68-136) applies effects (buff **works** here — KV-AUD-116; cure-by-id
suspect — KV-AUD-115) · `addGold/spendGold/getGold`(145-159) **delegate to `character.gold`** — KV-AUD-106
REFUTED · `addItem`(162-182) **ignores `addToInventory` failure** — KV-AUD-113 · other item/material wrappers
delegate to character store · `partialize`(242-244) persists **only `selectedItemId`** (no stash).
**`useBlacksmithStore`:** `modifyReputation`(78-82) clamp ✓ (float — KV-AUD-117) · `identifyWeapon`(112-177)
stale-snapshot `setState` — KV-AUD-114 · `canUpgrade`(182-244) sound gating ✓ · `upgradeWeapon`(252-314)
**no `maxOutputCap` recompute** — KV-AUD-027 confirmed · registry helpers self-heal (`:338,354`) but actions
don't — KV-AUD-118 · `reset`(364-366) **called by `clearAllStores`** ✓ (no bleed) but rep 0≠initial 1 —
KV-AUD-117.

### Resolved cross-checks (refutations + confirmations)
**KV-AUD-106 [REFUTED] | was S2 | `:145-159`** — There is **no** two-gold-pool disconnect. `useInventoryStore`
gold is a passthrough:
```ts
addGold:   (a) => useCharacterStore.getState().modifyGold(a),
spendGold: (a) => { if (character.gold < a) return false; modifyGold(-a); return true; },
getGold:   () => useCharacterStore.getState().character?.gold ?? 0,
```
So the shop spending "`useInventoryStore` gold" **is** spending `character.gold`. The W1-S5a top thread
dissolves. **Also refutes the inventory half of KV-AUD-002**: there's no separate stash to bleed
(`partialize` persists only `selectedItemId`). And it **corrects CLAUDE.md**, which describes
`useInventoryStore` as "Stash items, gold (separate from in-run inventory in Character)" — false; it's a
facade. (This is why KV-AUD-106 was filed `Needs-repro`, not Confirmed — the read paid off.)

**KV-AUD-107 [CONFIRMED] | S2 | L3 | `useBlacksmithStore:38,72,218` vs shop** — Blacksmith reputation's
**canonical home is `useBlacksmithStore.reputation`** — it gates upgrades (`canUpgrade:218` checks
`requiredReputation`) and tiers (`getReputationTier:84-90`). `useShopStore.npcReputation.blacksmith`
(W1-S5a) is the **dead duplicate** (never written, never used for gating). → delete the shop's blacksmith
rep field. Confirms KV-AUD-016.

**KV-AUD-119 [CONFIRMED] | S2 | L9 | `:287-295`** — `upgradeWeapon` recomputes `finalDamage`/`accuracy`/
`crit`/`displayName`/`quality` but **omits `maxOutputCap`**:
```ts
const upgradedWeapon: Weapon = { ...weapon, quality: qualityData,
  finalDamage: calculateUpgradedDamage(weapon, qualityData), … };  // no maxOutputCap
```
The cap was set at generation from the *original* quality tier (`QUALITY_OUTPUT_CAP_MULTIPLIER`), so an
upgraded weapon keeps its lower cap and **throttles the very damage the upgrade grants** (per W1-S1
KV-AUD-051, combat applies the cap). Confirms KV-AUD-027 / prior AUD-099. → recompute
`maxOutputCap = ceil(finalDamage × QUALITY_OUTPUT_CAP_MULTIPLIER[newTier])` on upgrade.

### New findings
**KV-AUD-113 | S2 | Confirmed | L1 | `:16,162-182` vs `useCharacterStore:812`** — **Silent gold loss from a
capacity-cap mismatch.** `useInventoryStore` uses `MAX_INVENTORY_SLOTS = 50` (`:16`), but
`useCharacterStore.addToInventory` enforces `BAG_CAPACITY = 20` (W1-S2 `:812`). `addItem` checks the 50-cap,
calls `addToInventory`, and **returns `true` regardless of its result** (`:180-181`):
```ts
if (character.inventory.length >= MAX_INVENTORY_SLOTS) return false; // 50
useCharacterStore.getState().addToInventory(item);  // rejects at 20, returns false — ignored
return true;
```
So when inventory holds **20–49** items, `canAddItem()` reports space, the shop charges gold
(`purchaseConsumable:270`/`purchaseEquipment:355`), `addItem` returns success, but `addToInventory`
**silently dropped the item** → gold spent, no item. Inventory can exceed 20 via the equip-overflow bug
(KV-AUD-070), so the two bugs compound. → unify the caps (one constant) and make `addItem` return
`addToInventory`'s actual boolean; the shop must refund on failure.

**KV-AUD-114 | S2 | Confirmed | L4 | `:143,161-167`** — `identifyWeapon` deducts gold **twice over two
mechanisms** and reaches into another store's `setState` with a stale snapshot:
```ts
characterStore.modifyGold(-IDENTIFICATION_COST);          // (1) proper deduct
…
useCharacterStore.setState({ character: { ...character,   // (2) stale `character` from :113
  gold: character.gold - IDENTIFICATION_COST, inventory: updatedInventory } });
```
Not currently a double-charge (both compute `G - COST`), but it's fragile: step (2) overwrites whatever
step (1)'s `modifyGold` did using a pre-(1) snapshot, so any future side-effect of `modifyGold` (a
behavement, a derived recompute) would be **clobbered**, and the inventory mutation bypasses the character
store's own methods. Confirms prior AUD-098. → route the `identified` flag update through a character-store
method; deduct once.

**KV-AUD-115 | S3 | Confirmed | L1 | `:114-115`** — `cure_poison`/`cure_bleed` call
`removeStatusEffect('poison')`/`('bleed')`, but `removeStatusEffect` filters by **`e.id`** (W1-S2 `:638`),
and combat status effects are created with unique ids (not the literal `'poison'`) — the StatusEffect
id-vs-type schism (KV-AUD-039). So a poison-cure potion likely **fails to remove poison** unless the effect
id happens to equal `'poison'`. (`cure_all` at `:111` is correct — it maps over `e.id`.) → remove by
`type`, not a hardcoded id. Verify the id scheme in W1-T4.

**KV-AUD-116 | S3 | Confirmed | L1/L3 | `:118-128`** — **Refines KV-AUD-057.** Buff consumables **do** apply
here — `useConsumable` builds and applies a status effect for `case 'buff'` (`:120-127`) — but
`useCombatStore.playerUseItem`'s `buff` case (W1-S1 `:891-899`) does **nothing**. So buff potions work out
of combat (this path) yet are inert in combat (that path), depending on which the screen calls. → unify on
one consumable-effect resolver. (The `as unknown as` cast at `:127` is the StatusEffect-schism smell again.)

**KV-AUD-117 | S3 | Confirmed | L1 | `:72,365,173,432`** — Blacksmith reputation oddities: (a) `reset()`
sets `reputation: 0` (`:365`) but the initial value is `1` (`:72`), so a reset character starts below a
fresh install (confirms prior AUD-097); (b) reputation accumulates in **floats** (`+0.5` on identify `:173`;
`getReputationGainForUpgrade` returns `0.5` `:432`), yielding fractional rep like `1.5`. → reset to `1`;
decide if fractional rep is intended (round for display).

**KV-AUD-118 | S2 | Confirmed | L6 | `:18,102,128,266` + weaponRegistry** — Blacksmith reads weapons from
the **in-memory** `weaponRegistry` (`getWeaponById`). That Map is module-level and **not persisted**, and is
cleared by `clearWeaponRegistry` on new game. After an **app reload**, the registry is empty while
`character.inventory` (with full `weaponData`) persists — so `getWeaponById` returns `undefined` and
`identifyWeapon`/`canUpgrade`/`upgradeWeapon` fail ("Weapon data not found") until something re-registers.
The *list* helpers self-heal (`getUnidentifiedWeapons:338`, `getUpgradeableWeapons:354` re-register from
`i.weaponData`), but the **action** methods don't. → re-register from `weaponData` in the actions, or
persist the registry. Full weaponRegistry audit queued for **W3**.

**KV-AUD-120 | Info | Confirmed | L3** — Positives: `useBlacksmithStore.reset()` **is** wired into
`clearAllStores` (`:28`) so the smith doesn't bleed (contrast shop); `canUpgrade` gates correctly on
identified-status, max-tier, reputation, gold, and materials with a helpful missing-materials message;
`upgradeWeapon` consumes materials atomically via `consumeMaterials`. `useInventoryStore` correctly
centralizes inventory in the character store (no duplicate source of truth) — the facade design is sound;
only the `MAX_INVENTORY_SLOTS` mismatch (KV-AUD-113) undermines it.

**Unit verdict:** this pair **refuted** the scary W1-S5a thread (no gold-pool split; `useInventoryStore` is
a clean facade) and **confirmed** three queued issues (dual blacksmith-rep, upgrade-cap throttle,
identify-stale-setState), while surfacing a **new silent gold-loss bug** (the 50-vs-20 cap mismatch,
KV-AUD-113) and a **persistence gap** (in-memory weaponRegistry breaks identify/upgrade after reload,
KV-AUD-118). Cross-checks queued: **W1-T4** (StatusEffect id scheme for cure-by-id, KV-AUD-115), **W3**
(weaponRegistry persistence), **Wave 2** (which consumable path combat uses — KV-AUD-116). **W1-S5 economy
bundle complete.**

---

## Unit W1-S6a — `src/stores/useDeityStore.ts` (512 lines) — Session 9, audited first-hand + caller cross-reference

**Context:** persisted (`kohrvellia-deity`). Patron relationship, favor, blessings, and God-Challenges.
Audited with caller greps for the favor mutators, the blessing multiplier, and the challenge lifecycle —
which resolved several long-queued cross-checks and surfaced an S1.

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `FAVOR_STATUS` (0×–2.0×) | 25-33 | `multiplier` field **dead** (only self-call consumer) — KV-AUD-122 |
| `adjustFavor` | 124-159 | Updates `relationship.favor` **only**, never `character.deityFavor` — KV-AUD-121; eviction flag set-not-cleared — KV-AUD-123 |
| `reset` | 119-121 | Incomplete — leaves `pendingChallengeReward`/`isPatronEvicted` — KV-AUD-124 |
| `startChallenge` / `tickChallengeFloor` | 176-192 / 367-397 | **Dead** (0 callers; `issueChallenge`/`checkChallengeExpiry` are the live ones) — KV-AUD-125 |
| `completeChallenge` | 281-339 | Bonus pts STR/END/AGI/PER only — KV-AUD-126; convoluted 3× re-read — KV-AUD-129 |
| `recordChallengeEvent`/`updateChallengeProgress`/`checkChallengeCompletion` | 399-410/212-231/265-279 | Wired ✓ (room/combat/floor) — KV-AUD-127 |
| `getBlessingMultiplier` | 465-468 | Reads `FAVOR_STATUS`; **only caller is the dead self-call `:474`** — KV-AUD-122 |
| `getBlessingEffect` | 470-482 | Dead `getBlessingMultiplier()` call + uses `@deprecated calculateBlessingPower` — KV-AUD-128 |
| getters/`isAbilityUnlocked`/`getAvailableChallenges` | 444-505 | Read `relationship.favor` ✓ |

### The headline — deity favor is mechanically inert for combat power
**KV-AUD-121 | S1 | Confirmed | L1/L3 | `:124-159` + 0-caller grep** — **Raising deity favor does nothing
to the blessing that scales your stats.** There are two favor values and they never sync:
- `relationship.favor` (this store) — mutated by every in-game favor source: shrines (`room.tsx:498`),
  domain actions (`:171`), challenge complete/fail. `adjustFavor` updates **only** this:
  ```ts
  adjustFavor: (amount, _reason) => {
    set((state) => ({ relationship: { ...state.relationship, favor: clamp(0,100, favor+amount) } }));
    // …soul/sacred milestones… — never touches character.deityFavor
  }
  ```
- `character.deityFavor` (character store) — the value the **blessing multiplier actually reads**
  (`getDerivedStatsWithBlessings` → `getBlessingMultiplier(character.deityFavor)`, W1-S2 `:1284`).

The **only** function that updates `character.deityFavor` after creation is `useCharacterStore.modifyDeityFavor`
(W1-S2 `:1146`, which also recomputes maxHP/SP) — and a repo-wide grep for `.modifyDeityFavor(` returns
**zero callers.** So `character.deityFavor` is frozen at its creation value (50) for the character's entire
life, the blessing multiplier is permanently the favor-50 value (~1.0×), and the entire favor loop —
shrines, domain actions, challenge rewards, the "Blessed/Favoured Child" tiers — has **no effect on combat
power**. This directly falsifies the in-code promise at `useCharacterStore` ("deity favor directly impacts
power") and the DanMachi-style favor pillar. (Unique-ability unlocking *does* respond to favor — it reads
`relationship.favor` via `isAbilityUnlocked` — so the disconnect is specifically the **blessing
multiplier**.) → make `adjustFavor` the single source and have it call `character.modifyDeityFavor` (or have
the blessing read `relationship.favor`); collapse the two favor values into one. Escalates KV-AUD-017.
> **[Update S24 — DOWNGRADED S1→S2 by KV-AUD-242 (W2-P2): the "0 callers" claim was a FALSE NEGATIVE.**
> The grep `.modifyDeityFavor(` (leading dot) missed the **destructured bare call** at `room.tsx:71,497` —
> the shrine does `modifyDeityFavor(favorDelta)` alongside `adjustFavor` (`:498`). So `character.deityFavor`
> is **not** frozen at 50: shrine visits move it and recompute the blessing. Favor is therefore
> **inconsistently synced** (shrines update *both* stores; events/challenges only `relationship.favor`),
> not *inert* → **severity S1→S2**, dropping the audit S1 count 5→4. Methodology lesson: grep the bare
> identifier, not just `.method(`. Full caller set (esp. the Blessing Rite) confirmed in W2-P6.]**

### Favor table & eviction
**KV-AUD-122 | S3 | Confirmed | L3 | `:25-33,465-468,474`** — **Refines seed KV-AUD-004 DOWN from S1.** The
`FAVOR_STATUS` table's `multiplier` (0× at Abandoned … 2.0× at Favoured Child) is **dead**: `getBlessingMultiplier`
is its only consumer, and `getBlessingMultiplier`'s only caller is the **discarded self-call** inside
`getBlessingEffect` (`:474 get().getBlessingMultiplier();` — return value unused). The live stat blessing uses
the *other* table (`types/Deity.FAVOR_TIERS` 0.5–1.5, W1-S2). So the "0× zeroes all stats" landmine the seed
feared is **not wired** — it's a dead field plus a divergent display table. (If a Familia/character screen
reads `FAVOR_STATUS[status].multiplier` directly, the player sees a multiplier — e.g. "2.0×" — that combat
never applies; verify Wave 2.) → unify the two favor tables; delete the dead multiplier.

**KV-AUD-123 | S2 | Confirmed | L1 | `:138-142`** — Eviction flag is one-way. `adjustFavor` sets
`isPatronEvicted = true` when favor ≤ 10 (`:140-142`) but **nothing clears it when favor recovers** (only
`evictPatron` resets it, on actual eviction). A transient dip to ≤10 (e.g. a challenge fail) permanently
flags the patron for eviction even after favor climbs back. → clear `isPatronEvicted` when favor rises above
`ABANDONED.max`.

**KV-AUD-124 | S2 | Confirmed | L4 | `:104-107,119-121`** — `reset()` is incomplete: it nulls `relationship`
and `completedChallengeIds` but leaves `pendingChallengeReward` and `isPatronEvicted` set, so a new character
(reset via `clearAllStores:26`) can inherit a dead character's stale eviction flag or pending-reward popup. →
reset all four fields.

### Challenges
**KV-AUD-125 | S3 | Confirmed | L3 | `:176-192,367-397`** — Two dead duplicate methods: `startChallenge`
(duplicate of the live `issueChallenge`) and `tickChallengeFloor` (duplicate of the live `checkChallengeExpiry`)
each have **0 callers** (greps). Confirms prior AUD-092. (Bonus: this **refutes** any double-tick concern —
only `checkChallengeExpiry` runs.) → delete both.

**KV-AUD-126 | S3 | Confirmed | L9 | `:312-318`** — Challenge `bonusStatPoints` are split across **STR/END/
AGI/PER only** (`addPendingExcelia` for those four), so INT/WIS/CHA/LCK builds get reward points in stats they
don't use. Confirms prior AUD-091. → target the build's scaling stats.

**KV-AUD-129 | S3 | Confirmed | L1 | `:303-338`** — `completeChallenge` re-reads state via `get()` **three
times** after the `set`, reconstructing the just-completed challenge from `completedChallengeIds[last]` (its
own comment admits `currentChallenge` is already cleared) and carries a `void relationship;` warning-suppressor.
Fragile if two challenges complete in succession. → return the completed challenge object from the `set`
closure instead of re-deriving "last."

**KV-AUD-128 | S3 | Confirmed | L1 | `:474,479`** — `getBlessingEffect` makes a dead `getBlessingMultiplier()`
call (result discarded) and computes its value via the **`@deprecated`** `calculateBlessingPower` (`:479`,
imported `:13`). → drop the dead call; migrate off the deprecated helper (W1-T3).

**KV-AUD-127 | Info | Confirmed | L3** — **Refutations/positives.** God-Challenges **are wired** —
`issueChallenge`←`familia/index.tsx:236`, `recordChallengeEvent`←`room.tsx:284,289,606`/`combat.tsx:387,1004`/
`floor.tsx:326`, `checkChallengeExpiry`←`floor.tsx:324` — so **PROGRESS's "Phase 2.4 God Challenges NOT
STARTED" is stale**, and `glory_challenge_complete` (W1-S4a KV-AUD-095) **is** reachable. The soul/sacred favor
milestones are correctly wired in `adjustFavor` (`social_deity_favor_high` at 80, `recordMaxFavor` at 100,
`recordFavoredChild` at 91); favor is clamped 0–100; `reset()` is invoked by `clearAllStores`.

**Unit verdict:** beneath a feature-complete-looking challenge/favor store sits the audit's **third S1** —
the favor→blessing-power link is severed because `modifyDeityFavor` is never called and the two favor values
never sync, so a marquee progression mechanic is mechanically inert. The verification also **refuted** two
seeds (the 0× landmine is dead, not dangerous; challenges are wired, not unstarted) — net, two corrections and
one major new defect. Cross-checks queued: **W1-T3** (`Deity.ts` FAVOR_TIERS vs FAVOR_STATUS unification +
deprecated `calculateBlessingPower`), **Wave 2** (does any screen display `FAVOR_STATUS.multiplier`?).

---

## Unit W1-S6b — `useAchievementStore.ts` (468) + `useJobStore.ts` (125) — Session 10, audited first-hand

**Context:** `useAchievementStore` (persisted `kohrvellia-achievements`) tracks progress + discovery for the
~123 achievements and runs the level-up ceremony. `useJobStore` (persisted `kohrvellia-job-store`) handles
the Level-2 job + Level-5 specialization choice. Resolves the RequirementType-coverage, GLORY-stacking,
tier-casing, discovery, and job `as any` cross-checks.

### Per-function coverage maps
**`useAchievementStore`:** `initializeProgress`(79-97) guild→rumored, else hidden · `updateProgress`(99-143)
**max-set, skips `hidden`** — KV-AUD-130 · `incrementProgress`(145-187) **additive, skips `hidden`** —
KV-AUD-130; both O(123) scans — KV-AUD-132 · discovery fns(194-248,420-445) wired ✓ — KV-AUD-134 ·
`completeLevelUp`(284-337) GLORY stacking ×1.25/1.5 — KV-AUD-133 · `getTierCount`(376-394) lowercase tiers ✓ ·
`resetAllProgress`(410-418) wired to `clearAllStores` ✓ · `unlockAchievementsForLevel`(447-461) STANDARD→known.
**`useJobStore`:** `selectJob`(55-84)/`selectSpecialization`(86-109) **no idempotency guard** — KV-AUD-135;
`as any` **gone** (explicit `Skill`) — KV-AUD-136 · `reset`(111-113) wired ✓.

### Achievement progress is gated on discovery (the real shape of KV-AUD-031)
**KV-AUD-130 | S2 | Confirmed | L1/L3 | `:106,152`** — **A 'hidden' achievement accrues zero progress.** Both
progress paths bail on undiscovered achievements:
```ts
for (const achievement of ALL_ACHIEVEMENTS) {
  const achievementProgress = updatedProgress[achievement.id];
  if (!achievementProgress || achievementProgress.isCompleted) continue;
  if (achievementProgress.discoveryState === 'hidden') continue;   // ← :106 / :152
  …
}
```
So an achievement must first be moved `hidden → rumored/known` (via guild rep `checkReputationDiscovery`,
`hintDiscovery`, source match, or — for STANDARD tier — `unlockAchievementsForLevel` on level-up) before any
play counts toward it; deeds done while it's still hidden earn **nothing** and don't count retroactively when
it's later discovered. Consequence: STANDARD achievements for the next level are auto-`known` (so leveling
isn't blocked — the old "can't level up" fear stays refuted), but **harder tiers (challenging/heroic/
legendary/mythic) that are hard to discover may never progress** even when the player meets their
requirements. This is the true form of KV-AUD-031: not "RequirementTypes never fire," but "progress is gated
behind discovery." → consider retroactive crediting on discovery, or make discovery easier for in-progress
deeds. (Exact RequirementType-vs-fired-set audit — `kill_count, gold_earn, boss_kill, elite_kill, damage_*,
floor_reach, shrine_blessing, stat_reach, custom` are the fired types — completes in W1-T5 + W3-DPr.)

### Confirmations & smaller findings
**KV-AUD-133 | S3 | Confirmed | L9 | `:320-326`** — GLORY/level-up stacking is the **live** path:
`stackCount ≥ 3 → ×1.5`, `≥ 2 → ×1.25` on `bonusPoints` (`getTierSynergyBonus` in `Achievement.ts` is the
dead duplicate — W1-T5). Triggers on **any** 2/3 selected achievements, not specifically hard-path ones
(simplified vs design). Confirms prior AUD-041.

**KV-AUD-132 | S3 | Confirmed | L5 | `:103,149`** — `updateProgress`/`incrementProgress` iterate **all ~123
`ALL_ACHIEVEMENTS`** (× their requirements) on **every** call, and they're fired on every combat kill/floor/
gold event. Same per-tick-scan class as the sacred store's O(770) (KV-AUD-101); together they add real
per-kill overhead on a 60fps target. → index achievements by `requirement.type`.

**KV-AUD-131 | S3 | Confirmed | L1 | `:119,165`** — Two progress semantics that the caller must choose
correctly: `updateProgress` does `Math.max(current, value)` (threshold/"reach" types), `incrementProgress`
does `current + amount` (count types). Mis-pairing silently mis-counts; e.g. the shipped debug button
(`settings:73`) calls `updateProgress('kill_count', 50)` → **sets** kill progress to 50 rather than adding.
→ document the contract; consider encoding it on the requirement type.

**KV-AUD-134 | Info | Confirmed | L3** — **Refutations/positives.** The **Discovery system IS implemented**
(states + `checkReputationDiscovery`←`useShopStore:544`, `hintDiscovery`, `discoverAllFromSource`,
`unlockAchievementsForLevel`←`performLevelUp` W1-S2:1106) — so PROGRESS's "Phase 2.3 Discovery System NOT
STARTED" is **stale**. Tier handling is **lowercase-consistent** (`getTierCount` keys, `ACHIEVEMENT_TIER_REWARDS[tier]`)
— refutes prior AUD-040's mismatch worry at the store level. `resetAllProgress` is wired into `clearAllStores`
(`:22`), and `initializeProgress` self-merges new achievement ids (`:87 if (!newProgress[id])`) — better than
the soul store's non-merging persist (still verify `initializeProgress`'s caller in Wave 2).

### Job store
**KV-AUD-135 | S3 | Confirmed | L1 | `:55-84,86-109`** — `selectJob`/`selectSpecialization` have **no
idempotency guard**: each call grants the starter skill (`learnSkill`, which doesn't dedup — W1-S2 `:955`)
**and** applies the permanent `applyJobStatBonus` (flat points). A second call (e.g. re-entering the
Level-2 job screen) would **double the stat bonus and duplicate the skill**. The one-time choice is enforced
only by the UI (`hasSelectedJob` is set but never checked here). → early-return if `hasSelectedJob`/spec
already set. Verify the screen can't re-enter (Wave 2-P4 `job-select`).

**KV-AUD-136 | Info | Confirmed | L2 | `:63-71`** — **Confirms prior AUD-052 is FIXED.** `selectJob` builds a
fully-typed `Skill` (all six tracking fields) before `learnSkill` — the old `as any` cast at `useJobStore:62`
is gone. `reset()` is wired into `clearAllStores` (`:25`). Clean store overall.

**Unit verdict:** both stores are clean and well-wired; the notable finding is the **discovery gate**
(KV-AUD-130) — progress only counts for discovered achievements, so hard-to-discover tiers can be missed —
plus a job-selection idempotency gap. The pass also **refuted two more stale claims** (Discovery System is
implemented, not "NOT STARTED"; tier casing is consistent; job `as any` is fixed). **Wave 1 stores nearly
done — only `W1-S7` (game+sound) remains.** Cross-checks: W1-T5 (`Achievement.ts` RequirementType enum +
`isRequirementMet`), W3-DPr (which RequirementTypes the 123 achievements actually use vs the fired set),
Wave 2-P4 (job-select re-entry; `initializeProgress` caller).

---

## Unit W1-S7a — `useGameStore.ts` (391) + `stores/index.ts` (14) — Session 11, audited first-hand + caller grep

**Context:** `useGameStore` (persisted `kohrvellia-game`) is the **meta-progression** store — settings, the
GamePhase machine, run history (the "Rankings" data), unlocks, monster knowledge, tutorial/hint flags, and
permanently-defeated bosses. Intentionally **not** reset by `clearAllStores` (it survives permadeath). Audited
with a caller grep of the deity-unlock gate.

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `GamePhase`/`GameSettings`/`RunRecord` types | 12-58 | ✓ (settings no-migration — KV-AUD-141) |
| `recordRunEnd` | 209-220 | caps history 100 ✓; `totalDeaths` over-counts — KV-AUD-139 |
| `unlockDeity` / `isDeityUnlocked` | 242-259 / 367-374 | **DEAD — 0 callers** — KV-AUD-137 |
| `unlockAchievement` / `isAchievementUnlocked` | 222-240 / 376-379 | parallel meta-unlock — likely also dead (verify) — KV-AUD-137 |
| `recordMonsterEncounter`/`addMonsterObservation` | 273-307 | bestiary tiers ✓ (meta-persisted) |
| `completeTutorial`/`skipTutorial` | 337-349 | init denatus — resolves KV-AUD-096 |
| `defeatBoss`/`isBossDefeated` | 326-334 | dedup ✓ (meta) |
| `setHasHadFirstCombat` + meta flags | 314-316 | **root of the first-combat bug** — KV-AUD-138 |
| persist | 386-389 | no `version`/`migrate` |

### The first-combat instakill protection only ever protects the first character (headline)
**KV-AUD-138 | S2 | Confirmed | L1 | `:92,106,175,185` + `useCombatStore:309`** — New characters get **no**
first-combat protection. The guard in `prepareEncounter` (W1-S1 `:309`) is
`isFirstCombatEver = gameState.totalRuns === 0 && !gameState.hasHadFirstCombat` — and **both** flags live in
this meta store (`totalRuns:92`, `hasHadFirstCombat:106`), persist across characters, and are **not** reset by
`clearAllStores`. `recordRunEnd` increments `totalRuns` on every run end (`:215`), and `setHasHadFirstCombat`
sets the flag on the first encounter. So after the very first run ever, `totalRuns ≥ 1` **permanently** →
`isFirstCombatEver` is always `false` for every subsequent character. In a permadeath game where new
characters after a death are the *common* case, none of them receive the "force a safe, non-boss/elite first
encounter" protection — a brand-new level-1 character can be handed a boss/elite on fight #1 and instakilled.
The safeguard helps only the literal first character on the device. → gate on a **per-character** signal
(e.g. `character.runStats` or a fresh per-character flag), not the meta `totalRuns`/`hasHadFirstCombat`.

### Dead meta-unlock system (owner-priority "floating code")
**KV-AUD-137 | S3 | Confirmed | L3 | `:242-259,367-374` + 0-caller grep** — The deity-unlock meta-layer is
**dead**. `isDeityUnlocked` (`:367-374`, defaulting to 4 unlocked — `zeus/odin/ra/amaterasu` — and ~166
requiring `unlockDeity`) and `unlockDeity` (`:242-259`) have **zero callers** anywhere (grep returns only
their definitions); `unlockedDeities` is therefore always empty and nothing reads the gate. **This refutes
prior AUD-086** ("97% of the roster unreachable") — the picker can't be gating on a function nobody calls, so
all deities are selectable; the lock infrastructure is simply unwired aspirational code. The parallel
`unlockAchievement`/`isAchievementUnlocked`/`unlockedAchievements` layer follows the same shape and is likely
also dead (verify in Wave 2 — codex/guildhall). → wire the picker to `isDeityUnlocked` if deity-unlocking is
intended, else delete the dead meta-unlock layer.

### Smaller findings
**KV-AUD-139 | S3 | Confirmed | L1 | `:216`** — `totalDeaths` over-counts: `+ (causeOfDeath !== 'return' ? 1 :
0)` treats every non-`'return'` run end (including `'victory'`/`'abandon'`) as a death, inflating the
Rankings death stat. → count only actual death causes.

**KV-AUD-140 | S3 | Confirmed | L3 | `stores/index.ts`** — The barrel exports **9** store hooks (Character,
Dungeon, Game, Deity, Inventory, Soul, Achievement, Combat, Sound) and **omits 5** (`useShopStore`,
`useBlacksmithStore`, `useSacredItemStore`, `useMarketStore`, `useJobStore`), so consumers of those deep-import.
Confirms prior AUD-100; mirrors the types-barrel gap (W1-T6). → export all 15.

**KV-AUD-141 | S3 | Confirmed | L6 | `:386-389`** — No settings migration. With no `version`/`migrate` and
zustand's default top-level shallow merge, the persisted `settings` object **replaces** `DEFAULT_SETTINGS`
wholesale on hydration — so a newly added setting field is `undefined` for every existing save (e.g. a future
`colorBlindMode` option wouldn't appear). → add a `merge`/`migrate` that fills missing setting keys from
defaults.

**KV-AUD-142 | Info | Confirmed | L3** — **Resolutions/positives.** Meta-progression is correctly **excluded**
from `clearAllStores` (run history, defeated bosses, unlocks, settings, monster knowledge, tutorial/hints all
persist across permadeath — intended). **Resolves W1-S4a KV-AUD-096:** `initializeDenatus` is invoked here in
`completeTutorial`/`skipTutorial` (`:339-348`) *and* at `confirm.tsx:80`, so the soul system is initialized for
new characters. **Cross-links KV-AUD-105:** `bestFloorReached` (meta) is what keys the shop's stock tier, so a
fresh character sees best-ever-floor gear. The "Rankings" system is the local `runHistory` (last 100 records) —
no global/server leaderboard exists. `defeatBoss`/unlock/codex all dedup correctly.

**Unit verdict:** the meta store is clean and its non-reset-on-new-game design is correct, but it holds the
**root of a real gameplay bug** — the first-combat instakill safeguard is keyed to meta flags so it protects
only the first-ever character (KV-AUD-138) — plus a fully **dead deity-unlock layer** (KV-AUD-137, refuting
AUD-086) and minor stat/barrel/migration nits. **14 of 15 stores audited — only `W1-S7b` (`useSoundStore`)
remains in the stores wave.** Cross-checks: Wave 2 (does the creation picker reference `isDeityUnlocked`?
codex `unlockAchievement`?), Wave 2-P2/P3 (first-combat guard fix surface).

---

## Unit W1-S7b — `src/stores/useSoundStore.ts` (685 lines) — Session 12, audited first-hand + asset verification

**Context:** the audio engine (NOT persisted). Audited specifically to settle the "stub vs real" contradiction
(the components sub-agent called it a `console.log` stub; PROGRESS/CLAUDE call audio "pending Phase 3") and the
volume dual-source. Verified the `.mp3` assets on disk via Glob.

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `SFX/BGM/AMBIENT_FILES` (~40 `require()`) | 161-237 | All referenced assets **exist** (53 .mp3 verified) — KV-AUD-143; 7 placeholder fallbacks — KV-AUD-146 |
| `safeRemove/SetVolume/Play/Pause` | 259-277 | try/catch wrappers ✓ |
| volume state + setters | 282-285,379-416 | **non-persisted, 0–1, separate from settings** — KV-AUD-144 |
| `playSFX` | 428-466 | **real playback** after a stale "Would play" log; `(player as any)` — KV-AUD-143/145 |
| `playBGM`/`crossfadeBGM`/`fadeOutBGM` | 479-602 | real, with `isCrossfading` guard ✓ |
| `playAmbient`/`fadeAmbient` | 604-650 | real loops ✓ |
| `useSound()` hook | 654-684 | convenience consumer ✓ |

### The audio system is real and complete (refutes KV-AUD-007 + stale docs)
**KV-AUD-143 | S3 | Confirmed | L3 | `:432,446-465,485,493-498,609`** — **Audio is fully implemented, not a
stub.** Each `console.log('[…] Would play')` is **immediately followed by actual playback**:
```ts
playSFX: async (type) => {
  …
  console.log(`[SFX] Would play: ${type}`);        // ← stale/misleading log
  const file = SFX_FILES[type];
  if (file) {
    const player = createAudioPlayer(file);         // ← real expo-audio player
    player.volume = sfxVolume * masterVolume;
    player.play();                                   // ← actually plays
    …
  }
}
```
The engine uses `expo-audio` with a preload cache, crossfade, fade-out, ambient loops, and master/category
volume — and a Glob confirms **all 53 referenced `.mp3` assets exist** (so the hard `require()`s resolve; no
build break). This **refutes** three claims at once: the components sub-agent's "console.log stub, no audio"
(XC-2), PROGRESS/CLAUDE's "audio pending (Phase 3)", and my own exec-summary **KV-AUD-007** (the "17× stub"
half). Only the *stale debug logs* remain a (cosmetic) problem. → strip/relabel the `Would play` logs; update
the docs to mark audio **done**; the only real doc-drift left from KV-AUD-007 is the `expo-av`→`expo-audio`
naming (the audio file itself notes "Uses expo-audio (replaces deprecated expo-av)" at `:4`).

### Volume dual-source (closes the KV-AUD-015 cross-check)
**KV-AUD-144 | S2 | Confirmed | L1/L6 | `:281-285,379-395` vs `useGameStore:28-29`** — Two volume systems
that don't sync, and the live one **doesn't persist.** `useSoundStore` owns `masterVolume/sfxVolume/bgmVolume/
ambientVolume` on a **0–1** scale with their own setters, and the playback engine reads **these**. But the
store is created **without `persist`** (`:281`), so those volumes **reset to defaults** (bgm 0.5, sfx 0.8) on
every app launch. Meanwhile `useGameStore.settings.musicVolume/sfxVolume` are **persisted** on a **0–100**
scale (W1-S7a) — the values the Settings UI presumably saves. Unless the settings screen explicitly bridges
into `useSoundStore`'s setters (and converts 0–100→0–1), changing volume in Settings won't affect playback,
and even if it does, the change is lost on restart. Confirms KV-AUD-015. → persist the engine volumes (or have
the engine read `useGameStore.settings` directly) and bridge the two scales; verify the Settings screen wiring
in Wave 2.

### Smaller findings
**KV-AUD-145 | S3 | Confirmed | L2 | `:455-456`** — `(player as any).addListener('playbackStatusChange', …)`
(eslint-disabled) — `expo-audio`'s `AudioPlayer` type doesn't expose `addListener`, so the auto-cleanup
listener is untyped. Works; type-unsafe. → use the typed event API if available.

**KV-AUD-146 | S3 | Confirmed | L8 | `:213,224,229,230,232,233,235`** — 7 BGM tracks are placeholders that
`require()` an existing file as a stand-in: `town` → `dungeon.mp3` (comment "fallback until town.mp3 is
added"), and `blessing_trickery/craft/authority/sea/sky/knowledge` → `blessing_generic.mp3`. So town and six
blessing domains share borrowed themes — a content gap (missing tracks), handled gracefully. → add the
dedicated tracks or accept the reuse.

**KV-AUD-147 | Info | Confirmed | L3/L6** — Positives: the engine is **well-built and defensive** —
`safeRemove/SetVolume/Play/Pause` wrap every player op in try/catch, `cleanup()` removes all players + clears
caches, `crossfadeBGM` guards re-entrancy with `isCrossfading`, and the store is **correctly NOT persisted**
(it holds non-serializable `AudioPlayer`/`Map`/`Set` — persisting would break). It's consumed via the
`useSound()` hook (`_layout.tsx`, `BlessingCeremony` per the components pass).

**Unit verdict:** a genuinely complete, defensively-coded audio engine — its only real defect is the
volume dual-source/non-persistence (KV-AUD-144); the rest are cosmetic (stale logs) or content gaps
(placeholder tracks). The standout is the **refutation**: audio is done and shipped, not a stub — a sub-agent
error corrected by first-hand reading + asset verification.

---

## ✅ WAVE 1 STORES COMPLETE (W1-S1…S7b + W1-L1)
All 14 store modules + `index.ts` + the lib unit audited first-hand. **Stores tally: KV-AUD-001…147** across
12 store/lib units. Running severity in stores: **1×S0** (build break, in lib), **~4×S1** (state-bleed,
farming exploit, sacred-items-broken, deity-favor-inert — the **5th S1, the StatusEffect schism KV-AUD-190,
lands in the types wave** → 5 S1 total for Wave 1), **~30×S2**, the rest S3/Info — plus a large number
of seed/prior-claim **refutations** (node_modules, ghost libs, 0× favor landmine, "can't level up", discovery/
challenges "NOT STARTED", audio stub, deity 97%-locked). **NEXT WAVE: types (W1-T1…T6)**, then Wave 2 screens.

================================================================
## PART D - W1-T1..T6 TYPES (148-219) - from findings/types.md
================================================================

# Findings — Types (`src/types/`)

Canonical first-hand findings for the type layer. Schema per `01_CHARTER_AND_RUBRIC.md`. This wave
discharges several pending seed cross-checks (018, 003, 019, 039, 041, 061) with exact evidence.

---

## Unit W1-T1 — `Stats.ts` (477) + `Character.ts` (435) — Session 13, audited first-hand

**Context:** the Falna/stat math (`calculateEffectiveStat`, `calculateDerivedStats`, grades) that every
store consumes, plus the `Character` interface, backstories, and creation.

### Per-section coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `GRADE_RANGES` | 13-26 | **S/SS/SSS = 50/30/20 wide** (I–A = 100 each) — KV-AUD-150 |
| `STAT_INFO` | 51-116 | references party/spell-slots/carry that don't exist — KV-AUD-149 |
| `calculateEffectiveStat` | 129-131 | `level*500 + points + carry` ✓ (sound) |
| `getProficiencyThreshold` | 180-183 | increasing curve — **dead** (flat path live) — KV-AUD-154 |
| `applySoftCap` | 217-219 | **dead** (soft caps removed) — KV-AUD-148 |
| `calculateDerivedStats` | 307-477 | hardcoded coeffs (003 drift) — KV-AUD-151; cap physical-only — KV-AUD-152; hybrid mis-scale — KV-AUD-153; `battleCry=0` — KV-AUD-155 |
| `BACKSTORIES` / `createNewCharacter` | 43-108 / 265-392 | penalty no-op — KV-AUD-156; non-domain affinity — KV-AUD-157 |
| `StatusEffectId`/`StatusEffect` | 111-130 | the schism, Character side — KV-AUD-158 |
| `canLevelUp`/`getCarryCapacity` | 397-435 | `allStatsAtD` unused — KV-AUD-160; carry-capacity dead — KV-AUD-159 |

### Balance: the grade system is both cheap and nearly cosmetic (confirms 018; cross-links 068/003)
**KV-AUD-150 | S2 | Confirmed | L9 | `:13-26,129-131`** — **Confirms seed KV-AUD-018 with exact widths.**
`GRADE_RANGES`: I–A are **100 points each** (0→899), then **S = 900-949 (50), SS = 950-979 (30), SSS =
980-999 (20)**. So A→SSS costs **199** points while I→A costs **800** — the four prestige grades are
*compressed*, inverting "top points cost most." **But it's worse than just cheap:** combat reads
`calculateEffectiveStat = level*500 + points + carry` (`:129-131`) — **linear in points** — so going
A(800)→SSS(999) adds only **+199** to an effective stat that's in the thousands by level 3-5 (the comment
at `:300-301` shows effX ≈ 1800 at L2, ≈ 5000 at L5). Net: the prestige grade is a **near-cosmetic label**
that's *also* trivially cheap to reach (compounded by the flat growth of KV-AUD-068). The CLAUDE.md "every
stat matters / SSS is a real grind" pillar is unmet on both axes. → if grades should matter, make combat
read grade **breakpoints** (soft caps), and re-curve + re-cost the top grades (with 068).

### Balance: `GameConstants.DerivedStatFormulas` confirmed dead + the exact 10× drift (confirms 003)
**KV-AUD-151 | S2 | Confirmed | L3/L9 | `:332-416`** — **Confirms seed KV-AUD-003 first-hand.**
`calculateDerivedStats` hardcodes every coefficient inline and imports nothing from `GameConstants`.
Compared field-by-field: HP `50 + effEND*0.1 + effSTR*0.02` (`:332`) **matches** `GameConstants`, but the
rest have **drifted ~10×**: physical-attack `STR 0.008` (`:342`) vs constants `0.08`; speed `effAGI*0.010`
(`:362`) vs `0.1`; crit `effLCK*0.0004` (`:363`) vs `0.004`. The drift comes from the "soft caps removed,
coefficients recalibrated for the linear effX scale" rework (`:297`) that updated `Stats.ts` but not
`GameConstants`. So the documented "single source of balance truth" is both **disconnected** and **10×
stale** for most fields. → make `Stats.ts` import from `GameConstants`; reconcile the values.

**KV-AUD-152 | S2 | Confirmed | L9 | `:353,356-359`** — **Confirms seed KV-AUD-019.** The quality output
cap is applied **only to physical attack**: `basePhysicalAttack = Math.min(physScaling + weaponDamage,
weaponMaxOutputCap)` (`:353`), while `baseMagicAttack` (`:356-358`) and `baseLuckAttack` (`:359`) have **no
`Math.min`** — INT/WIS/LCK weapons scale **uncapped** with stats regardless of quality tier. `weaponMaxOutputCap`
also defaults to `Infinity` (`:316`), confirming W1-S2 KV-AUD-077 (unarmed is uncapped too). → apply the cap
symmetrically across all three attack channels.

**KV-AUD-153 | S2 | Confirmed | L1/L9 | `:341-358`** — **Hybrid weapons scale off the wrong stats.**
`PHYS_COEFFICIENTS` (`:341-343`) only has the five single physical stats; for a hybrid `weaponCategory`
(e.g. `AGI_WIS`) the lookup misses and falls back to **`effSTR * 0.008`** (`:351`), and `baseMagicAttack`
defaults to **`effINT`-based** unless category is exactly `'WIS'` (`:356-358`). So a hybrid weapon's physical
half always scales off **STR** and its magic half off **INT**, ignoring the hybrid's *declared* stats — an
`AGI_WIS` or `PER_LCK` hybrid mis-scales entirely. Combine with combat's hybrid **sum** of both pools (W1-S1
KV-AUD-061) and hybrids are both mis-stated and double-dipping. → look up the hybrid's component stats.

### Dead code / stale (Stats.ts)
**KV-AUD-148 | S3 | Confirmed | L3 | `:217-219,229,297`** — `applySoftCap` is exported but **dead** (line
297: "Soft caps have been removed"; `calculateDerivedStats` uses `Math.min` hard caps). The `DerivedStats`
section comment "Core offensive/defensive (**soft-capped**)" (`:229`) is now false. Confirms prior AUD-021.
→ delete `applySoftCap`; fix the comment.

**KV-AUD-154 | S3 | Confirmed | L3 | `:180-183`** — `getProficiencyThreshold` (`100*(index+1)` — the *only*
increasing-cost curve) is **bypassed** by the live flat `commitExcelia` (W1-S2 KV-AUD-068). It's the correct
mechanism, sitting dead. → drive the canonical growth path off it.

**KV-AUD-149 | S3 | Confirmed | L8 | `:55,80,88`** — `STAT_INFO` describes mechanics that don't exist:
`CHA.combatEffect = '+Party buff power'` (`:80`, solo game), `INT = '+Spell slots'` (`:88`, no spell slots),
`STR = '+Carry capacity'` (`:55`, inventory is flat 20-slot — KV-AUD-159). Player-facing stat text is wrong.
Confirms prior AUD-024. → rewrite the copy.

**KV-AUD-155 | S4 | Confirmed | L3 | `:390,451`** — `battleCryBonus` is computed as a constant `0` ("Retired
— replaced by Kairos sequenceBonus") yet still returned as a derived stat. Dead field. → remove.

### Character.ts — backstory & the StatusEffect schism
**KV-AUD-156 | S2 | Confirmed | L4/L9 | `:38,293-307`** — **Confirms seed KV-AUD-041 (penalty half).**
Every backstory declares a `statPenalty` (e.g. orphan: CHA −5), but `createNewCharacter` applies only the
`statBonus` (+5) and deity bonus (+10) — the comment at `:306-307` says "Penalty is not applied to starting
points, it affects growth rate," and W1-S2 confirmed **no growth path references it** either. So the penalty
is a **pure no-op**: every backstory is all upside, no cost — violating MINDSET's "every benefit shows its
cost." → apply the penalty (to starting points or a real growth modifier), or remove the field.

**KV-AUD-157 | S2 | Confirmed | L7 | `:39,81,105`** — **Confirms seed KV-AUD-041 (affinity half).**
`Backstory.deityAffinity` is typed `string[]` (`:39`) and uses `'divine'` (temple_acolyte `:81`) and
`'fate'` (cursed_bloodline `:105`) — **neither is one of the 14 `DeityDomain`s**, so those two backstories'
affinity hints can never match a deity. Typed `DomainId[]` these would be compile errors. → type it as
`DomainId[]`; fix the two values. (Verify the picker actually reads `deityAffinity` in Wave 2.)

**KV-AUD-158 | S2 | Confirmed | L2/L3 | `:111-130,214`** — **Confirms + deepens seed KV-AUD-039 (StatusEffect
schism).** `Character.ts` defines `StatusEffectId` = poison/bleed/burn/freeze/stun/**fear/silence/paralysis**/
curse/blind and a `{id,name,duration,damagePerTurn?,statModifier?}` shape — **structurally different** from
the `StatusEffect.ts` model combat uses (weaken/slow/regen + percentDamage/preventsHealing…, W1-S1). And the
two **don't interact**: combat status lives in `useCombatStore.playerEffects` (StatusEffect.ts shape), while
`character.statusEffects` (this shape, persisted) is written only by **out-of-combat consumables** — which
push a `{type:'buff', stat, value}` object cast `as any` (W1-S5b KV-AUD-116) that matches *neither* schema.
So `fear`/`silence`/`paralysis` are dead (combat never makes them), and there are effectively **three** status
shapes in play. Full unification verdict in W1-T4 (`StatusEffect.ts`). → one status model.

### Smaller / positives
**KV-AUD-159 | S3 | Confirmed | L3 | `:174,433-435`** — `getCarryCapacity` (STR-weight model) is dead —
inventory uses the flat `BAG_CAPACITY = 20` everywhere (W1-S2). Confirms prior AUD-029. → delete or wire.

**KV-AUD-160 | S3 | Confirmed | L3 | `:190,404`** — `levelProgress.allStatsAtD` is a stored flag, but
`canLevelUp` computes the 6-of-8-at-D gate **live** from `stats` (`:404`) and never reads `allStatsAtD`.
Dead/duplicated state. → remove the field or use it.

**KV-AUD-161 | Info | Confirmed | L3** — Positives: the Falna formula + carry model are sound and
self-consistent (`:129-131,195`); `canLevelUp` (6-of-8 stats ≥500 + 1 achievement + deity approval, `:397-414`)
matches GAME_INDEX (closes prior AUD-019); the hardcoded `maxHP:50/maxSP:30` at creation (`:327-330`) is
immediately overwritten by `computeMaxResources` (closes prior AUD-030); IDs use `Date.now()+random`.

**Unit verdict:** the type layer's math is internally consistent, but this unit **confirmed five pending
seeds first-hand** (018 grade compression + the new insight that grades are near-cosmetic for combat; 003
the exact 10× coefficient drift; 019 the cap asymmetry; 041 the no-op backstory penalty + broken affinity;
039 the StatusEffect schism) and added a **hybrid mis-scaling** bug (153). The balance picture sharpens:
**068 (flat growth) × 150 (compressed, cosmetic grades) × 003 (dead/stale constants) = a progression system
whose prestige tiers are cheap, marginal, and untunable from the documented source.** Cross-checks: W1-T4
(StatusEffect.ts unification), Wave 2 (does the creation picker read `deityAffinity`?), W1-T3 (Behavement
score vs the grade/effStat scale).

---

## Unit W1-T2 — `Monster.ts` (566) + `Dungeon.ts` (440) — Session 14, audited first-hand

**Context:** the modular monster system (prefix/base/suffix, CR + floor scaling) and the dungeon structure
types (nodes, biomes, floor brackets, ramifications). Discharges seeds 022, 035, 036/053, 037, 038, 085.

### Per-section coverage map
**`Monster.ts`:** `MONSTER_LEVEL_MULTIPLIERS`+`MONSTER_STAT_SCALING`+`PLAYER_LEVEL_FLOOR_ZONES`+`createMonsterInstance`
(254-532) **multiplicative HP scaling** — KV-AUD-162 · `calculateMonsterCR` clamps finalCR≥0.1 but division
uses raw `base.baseCR` — KV-AUD-163 · `calculateGoldDrop`(463-468) orphan/dup — KV-AUD-164 · `xpValue`(102)
vestigial — KV-AUD-165 · `category:string`(107) — KV-AUD-166 · `STATUS_EFFECT_CR_WEIGHTS`(346-356) vs
`StatusEffectId` — KV-AUD-167 · `SUFFIX_FLOOR_GATES`+`isSuffixAllowedOnFloor`(180-188,538-541) — KV-AUD-168 ·
`MonsterAbility`(114-124) likely dead — KV-AUD-169.
**`Dungeon.ts`:** dead `void`/`labyrinth` biomes(24-34,262) — KV-AUD-170 · dead `NODES_PER_FLOOR_*`(193-195) —
KV-AUD-171 · dead `shop` node surface(18,69-72,209) — KV-AUD-172 · three floor-bracket schemes — KV-AUD-173 ·
dup danger fns(405-415 vs Monster 418-431) — KV-AUD-174.

### Balance: monster HP scales multiplicatively while player damage scales linearly (headline)
**KV-AUD-162 | S2 | Confirmed (mechanism) / Needs-sim (magnitude) | L9 | `:254-319,474-499`** — Deep floors are
likely **mathematically unwinnable**, and this probably explains why content stops at floor 25. Monster HP in
`createMonsterInstance` stacks **three multiplicative layers**: `monsterLevel (≈floor)` × `levelMultiplier
(8–36 by CR tier, :254-259)` × `zoneMultiplier (1.0→9.0, :223-236)` × `prefix.hp (≤2.0)`:
```
rawHP = monsterLevel * levelMultiplier * 1.0 + baseHP        (:310)
hp    = floor(rawHP * zoneMultiplier) * prefixHpMod          (:313, :493)
```
At floor 86 a CR-11 monster ≈ `86 × 36 × 9 × ~1` ≈ **27,900 HP** (×2 with a legendary prefix ≈ 55k). Player
physical attack scales **linearly** off `effStat × ~0.008` (W1-T1 KV-AUD-151) — on the order of tens per hit
at the target level — so kills would take hundreds of hits, while monster *attack* (`×0.20` + same zone/level
stack) dwarfs player HP and one-shots. The structural mismatch — **multiplicative monster HP/atk vs linear
player damage** — widens with depth. → flatten to one scaling model and simulate the full 100-floor curve
(W3/W4 with real monster data + the combat formula). Magnitude needs a sim; the structural divergence is
certain.

### Confirmed seeds (dead data / schism / Infinity)
**KV-AUD-163 | S2 | Confirmed | L1 | `:388,466` + `useCombatStore:1519`** — **Confirms seed KV-AUD-053/036.**
`calculateMonsterCR` clamps the **final** CR to ≥0.1 (`:388`) but the reward math divides by the **raw**
`monster.base.baseCR` — `calculateGoldDrop:466` `finalCR / base.baseCR`, and combat's inline copy
(`useCombatStore:1519`). So a data monster with `baseCR:0` → **Infinity gold/xp**; the 0.1 clamp gives false
reassurance (it doesn't guard the divisor). → guard `base.baseCR` (clamp ≥0.1) and assert no zero-CR data (W3-DC1).

**KV-AUD-167 | S2 | Confirmed | L2/L3 | `:8,66,346-356,365`** — **Confirms seed KV-AUD-039 — exact combat
consequence.** `Monster.ts` imports `StatusEffectId` (Character.ts vocab: …`fear/silence/paralysis`) for
`MonsterSuffix.statusEffect`, but `STATUS_EFFECT_CR_WEIGHTS` (`:346-356`) is keyed with the **StatusEffect.ts**
vocab (`weaken`/`slow` present; `fear`/`silence`/`paralysis` absent). So `calculateStatusEffectCRModifier`
(`:365`) returns **0** for any `fear`/`silence`/`paralysis` suffix (no weight entry), and the `weaken`/`slow`
weights are **dead** (no `StatusEffectId` can name them). Root of BUG-040, confirmed.

**KV-AUD-168 | S3 | Confirmed | L3 | `:180-188,538-541`** — `SUFFIX_FLOOR_GATES` + `isSuffixAllowedOnFloor`
gate dangerous suffix status effects by floor — but combat **procs status from `monster.base.damageTypes`, not
`suffix.statusEffect`** (W1-S1 KV-AUD-052). So this entire early-floor safety system protects a mechanism that
**never fires** — aspirational guarding of dead data. (Also: the gate keys `burning`/`venomous`/`chilling`
must equal suffix `id`s or `isSuffixAllowedOnFloor` defaults to gate=1 — W3-DC2 data check.)

**KV-AUD-165 | S3 | Confirmed | L3 | `:102`** — Every `BaseMonster` carries `xpValue` though the game has no
XP (W1-S1 KV-AUD-055: `rewards.xp` computed-and-discarded). Vestigial dead data on all ~39 monsters. → remove.
> **[Update S22 — REVISED by KV-AUD-222 (W2-P1a): `xpValue` is LIVE data, not vestigial.** It flows
> `xpValue → rewards.xp → pending excelia` in `combat.tsx handleVictory:1020` (per-kill proficiency). Keep
> the field; the defect is the physical-only distribution, not the data. The "remove" recommendation is withdrawn.]**
**KV-AUD-166 | S3 | Confirmed | L2 | `:107`** — `BaseMonster.category: string` (not a union), yet loot pools +
sacred/soul routing branch on it — a typo silently breaks drops/tracking. `Loot.ts` has a `MonsterCategory`
union to reuse. Confirms seed KV-AUD-038. **KV-AUD-164 | S3 | Confirmed | L3 | `:463-468`** —
`calculateGoldDrop` duplicates combat's inline gold math (`useCombatStore:1456-1519`) and appears **orphan**
(combat doesn't call it). → delete or converge on one.
**KV-AUD-169 | S3 | Likely | L3 | `:114-124`** — `MonsterAbility` (cooldown/effectId/targeting) is defined but
combat's `enemyTurn` (W1-S1) drives behavior off `behaviorPattern` only, never abilities — likely dead/aspirational
(verify Wave 2).

### Dungeon.ts — dead surfaces + misaligned brackets
**KV-AUD-170 | S3 | Confirmed | L3 | `:24-34,262`** — **Confirms seed KV-AUD-022.** `Biome` declares 10 types
but `getBiomeForFloor` draws from only **8** (`:262`) — `void` (themed for Ars Goetia/Fallen) and `labyrinth`
are never generated; `getBiomeDisplayName` carries dead names for both. Biome also ignores the patron pantheon
(pure floor rotation + a `seed%2` coin-flip on a non-deterministic seed, W1-S3 KV-AUD-082). → wire to deep
floors / pantheon or remove.

**KV-AUD-171 | S3 | Confirmed | L3 | `:193-198`** — **Confirms seed KV-AUD-085/021.** `NODES_PER_FLOOR_BASE/MAX/
TIER_INCREASE` are dead (generation uses `ROWS_PER_FLOOR=12 ≈ 25-36 nodes`, W1-S3); PROGRESS "45 rooms" is a
third, stale number. → delete the dead constants.

**KV-AUD-172 | S3 | Confirmed | L3 | `:18,69-72,209,329,348`** — **Confirms seed KV-AUD-083/044.** The `shop`
node is dead — `NODE_TYPE_WEIGHTS.shop = 0` ("Removed … dead weight"), generation excludes it — yet the full
surface survives (`NodeType`, `shopData` interface, icon `◉`, display name "Shop"). → remove the dead surface.

**KV-AUD-173 | S3 | Confirmed | L9 | `Dungeon:224-232` vs `Monster:223-236` vs `GameConstants ZONE_NAMES`** —
**Three misaligned floor-bracketing schemes:** CR ranges (1-5/6-10/11-20/21-30…), player-level zones
(1-10/11-25/26-40/41-55…), and display zone names (1-10/11-25/26-40/41-60…). The boundaries don't line up
(e.g. floor 22 is CR-bracket "21-30" but zone "11-25"), so CR scaling and zone/level scaling step at different
floors → difficulty discontinuities. Confirms prior AUD-070. → one bracket table.

**KV-AUD-174 | S3 | Confirmed | L1 | `Dungeon:405-415` vs `Monster:418-431`** — Duplicate danger-rating
functions: `getDangerLevel` returns `…'hard'…` while `getFloorDangerText` returns `…'Dangerous'…` (same
`playerLevel*2.5` math, divergent labels). Confirms prior AUD-048. Plus `getBiomeForFloor(0)` → negative index
→ `undefined` biome (floor<1 unguarded, prior AUD-047; harmless since floors start at 1).

**KV-AUD-175 | Info | Confirmed | L3 | `:418-427`** — Note: `getAdjacentNodes` (forward-only, `fromId===current`)
exists but navigation uses `getCurrentPathOptions` (forward **+ backward**, the farming vector W1-S3 KV-AUD-080)
— the forward-only helper sits unused for navigation. `MapNode.combatData.monster` is always `null` (combat
generates the monster separately, W1-S3) — dead field.

**Unit verdict:** the monster/dungeon types are feature-rich but carry the audit's clearest **deep-floor
balance red flag** (KV-AUD-162: multiplicative monster scaling vs linear player damage — likely why floors >25
were never finished) plus a dense cluster of **confirmed dead surfaces** (void/labyrinth biomes, NODES
constants, shop node, xpValue, calculateGoldDrop, MonsterAbility) and the schism's exact CR consequence (167).
Cross-checks: **W3-DC1** (any `baseCR:0`?), **W3-DC2** (suffix ids vs gate keys), **W1-T4** (StatusEffect
unification), **W3/W4** (100-floor balance simulation for 162).

---

## Unit W1-T3 — `Behavement.ts` (457) + `Deity.ts` (442) — Session 15, audited first-hand

**Context:** the Paragon-title generator (the soul system's Level-10 climax) and the deity/favor types.
Definitively resolves the Paragon sort bug (011/029), Mythic=100 (020/050), and the favor-table divergence
(004/121/122/128).

### The Paragon sort bug — now proven exactly (13 of 28 titles are wrong)
**KV-AUD-176 | S2 | Confirmed (exhaustive) | L1 | `Behavement:93-122,293-298`** — Reading the sort **and**
every map key: `getStatAdjective` does `[stat1,stat2].sort()` (alphabetical: AGI<CHA<END<INT<LCK<PER<STR<WIS)
then `STAT_ADJECTIVE_MAP[key] ?? 'Iron'`. But the map keys are **not** all alphabetical, so **13 of 28 pairs
miss and fall back to 'Iron'**: every `STR_*` except `STR_WIS` (STR_AGI/INT/PER/CHA/LCK → 'Iron' instead of
Savage/Arcane/Precise/Commanding/Fortunate), `END_AGI`, `END_CHA`, `INT_CHA`, `WIS_PER`, `WIS_CHA`, `WIS_LCK`,
`PER_CHA`, `PER_LCK`. (`STR_END` also misses but its intended value *is* 'Iron', masking the bug for STR/END
players.) So ~half of all Level-10 Paragon stat-adjectives are silently wrong. Confirms seed KV-AUD-011/029
with the exact list; trivial fix (alphabetize the map keys). 

### NEW — half the Paragon noun passives are dead
**KV-AUD-177 | S2 | Confirmed | L3 | `Behavement:158-217` vs `useCharacterStore:1350-1382`** — `NOUN_PASSIVES`
grants combat buffs by `effect.type`, but `getDerivedStatsWithBlessings` (the only consumer of paragon buffs,
W1-S2) only handles `physical_damage/magic_damage/damage_reduction/dodge_chance/crit_damage/max_hp_bonus/
speed_bonus/physical_defense_only/magic_defense_only`. The passives for the **CAUTION/SOCIAL/EXPLORATION/
RESOURCE/GLORY** vectors use `item_effectiveness`, `reputation_gain`, `gold_bonus`, `loot_discovery`, and
`tier_bonus` — **none of which are applied** in the derived path or read by any audited store. So ~16 of ~39
noun passives (e.g. Tactician +20% item, Diplomat +30% rep, Negotiator +15% gold, Seeker +25% loot, Champion
+25% tier bonuses) are **inert**. A non-combat Paragon's reward does nothing mechanically — compounding the
combat-bias of the title itself (KV-AUD-093). → apply these in the relevant systems, or convert them to
derived effects. (Verify no screen applies them, Wave 2.)
> **[Update S22 — PARTIALLY REFUTED by KV-AUD-223 (W2-P1a):** `gold_bonus` (Negotiator) **is** applied —
> at the screen level in `combat.tsx handleVictory:998-1002`, not the derived path. So the passives are
> applied **inconsistently** (some in screens), not uniformly dead. The other four (`item_effectiveness`/
> `reputation_gain`/`loot_discovery`/`tier_bonus`) remain unconfirmed pending the shop/loot/discovery
> screens (W2-P5–P9). Reword "inert" → "applied inconsistently across screens, never in the derived path."]**

**KV-AUD-178 | S3 | Confirmed | L9 | `Behavement:70-81,256-268`** — **Mythic is impossible, not just hard.**
`CR_ADJECTIVE_RANGES.Mythic = {min:100,max:100}` and `calculateBehavementScore` = weighted mean of
`min(current/target,1)` × weight × 100 — so score 100 requires **every** one of the ~90 behavements at 100%.
Since some behavements are structurally unreachable (e.g. `explore_secret_rooms` — no secret rooms generate,
W1-S4a KV-AUD-095), the max attainable score is **capped below 100**, making Mythic (and likely Legendary,
98-99) **literally unreachable**. Confirms + escalates seed KV-AUD-020/050. → realistic thresholds keyed to
the true max score.

**KV-AUD-179 | S3 | Confirmed | L1 | `Behavement:303-351,381-420`** — Title generation has no determinism or
agency: `getDominantVector` defaults to `COMBAT_PHYSICAL` on ties/all-zero (`:304`) and is biased by the
combat double-count (KV-AUD-093); `getSkillNoun` picks the secondary noun via `Math.random()` (`:345`) so the
"revelation" varies run to run; and `generateParagonTitle` takes `topStats` from the caller with no
validation/choice (`:383`, prior AUD-065). → deterministic + player-chosen on ties.

### Favor tables — definitively reconciled (004/121/122)
**KV-AUD-180 | S2 | Confirmed | L1/L9 | `Deity:252-275` vs `useDeityStore:25-33`** — The two favor tables are
confirmed divergent on **every** axis: `FAVOR_TIERS` (Deity.ts, the **live** one `getBlessingMultiplier` uses)
= **6 tiers, 0.50×–1.50×, Abandoned 0.50×**, boundaries 0-10/11-30/31-60/61-80/81-90/91-100; `FAVOR_STATUS`
(useDeityStore, **dead** — only a self-call, W1-S6a KV-AUD-122) = **7 tiers, 0×–2.0×, Abandoned 0×**, different
boundaries (11-25, 26-40…). So the `0×` "zero all stats" lives only in the dead table (downgrade of seed 004
stands). **And the live table is itself inert:** `getBlessingMultiplier(character.deityFavor)` only ever sees
favor **frozen at 50** (KV-AUD-121, `modifyDeityFavor` has 0 callers) → it always returns **1.0× (Neutral)**.
So the comment "creates meaningful gameplay impact from deity relationship management" (`:241-242`) is false —
favor never moves the multiplier. → unify to one table **and** fix the freeze (121), or the blessing is dead.

**KV-AUD-181 | S2 | Likely | L3 | `Deity:185-207,131-135`** — Deity **domain** blessings appear display-only.
`DOMAIN_EFFECTS` ("+10% physical damage" for war, etc.) and `deity.domainBlessing.effectValue` are surfaced by
`getBlessingEffect` for **display**, but combat (W1-S1) and `getDerivedStatsWithBlessings` (W1-S2) never read
them — so a war deity's "+10% physical damage" is shown but **not applied**. Combined with KV-AUD-180/121, the
deity system's *two* power mechanics (favor multiplier + domain blessing) are **both inert**. → apply domain
effects in combat (verify Wave 2 first).

### Smaller (Deity.ts)
**KV-AUD-182 | S3 | Confirmed | L3 | `Deity:312-319`** — `calculateBlessingPower` is `@deprecated` ("Use
getBlessingMultiplier") yet still called by `useDeityStore.getBlessingEffect` (W1-S6a `:479`). Confirms seed
KV-AUD-128. → migrate the one caller; delete.
**KV-AUD-183 | S3 | Confirmed | L1 | `Deity:338-380`** — `checkDeityApproval` has `opposingDomains` for only
**4** of 14 domains (war/life/trickery/authority), so the other 10 deities never react with disapproval; and
the typed return `'refused'` is **never produced** (opposing → `'reluctant'`). Dead branch + incomplete map
(relates to prior AUD-042). → complete the opposition map or simplify the type.
**KV-AUD-184 | Info | Confirmed | L3** — `PantheonId` + `PANTHEON_INFO` enumerate **all 19** pantheons (incl.
maya/inca — the *type* is fine; the *data* is the W3 concern, KV-AUD-028), confirming docs' "12 active" is
stale (prior AUD-016). Positives: `FAVOR_TIERS` is well-designed (contiguous, sensible curve — wasted by the
freeze); `calculateFavorChange`/`isAbilityUnlocked`/`getAvailableChallenges` correctly use the live
`relationship.favor` (so challenges/abilities *do* respond to favor — only the blessing multiplier is frozen).

**Unit verdict:** the soul/deity type layer is elaborate but its two marquee rewards are deeply compromised:
the **Paragon title** is ~50% wrong (176), partly impossible (178), non-deterministic (179), and half its
passives are dead (177); the **deity blessing** is split across a divergent dead table (180) and an inert
domain layer (181), all moot because favor is frozen (121). Together with W1-T1's grade findings, the
progression-and-reward systems are the audit's richest vein of "looks complete, isn't wired." Cross-checks:
**W1-T4** (StatusEffect unification), **Wave 2** (combat application of domain effects + paragon non-combat
passives), **W3** (maya/inca pantheon data).

---

## Unit W1-T4 — `Weapon.ts` (274) + `StatusEffect.ts` (377) + `Armor.ts` (217) — Session 16, audited first-hand

**Context:** the equipment + status-effect type layer. Delivers the **definitive StatusEffect schism verdict**
(seed 039, cross-referenced across ~6 units), confirms the hybrid-set mismatch (040) and the weapon triangle,
and audits the armor/accessory systems.

### The StatusEffect schism — definitive verdict (seed 039, S1)
**KV-AUD-190 | S1 | Confirmed (definitive) | L2/L3 | `StatusEffect.ts:9-19` vs `Character.ts:111-121`** —
**Three incompatible status models coexist.** (1) `StatusEffect.ts` (the **combat** model, used by `useCombatStore`):
`poison/burn/freeze/stun/blind/bleed/`**`weaken/slow/regen`** + a rich interface (percentDamage, statModifier,
skipTurnChance, stacks, preventsHealing…). (2) `Character.ts` `StatusEffectId` (persisted + out-of-combat
consumables): `poison/bleed/burn/freeze/stun/`**`fear/silence/paralysis`**`/curse/blind` + a *different*,
thinner interface. (3) the `{type:'buff',stat,value}` object consumables push (W1-S5b). **Only 7 of 10 IDs
overlap**; each model has 3 unique. Consequences proven across the audit: `fear/silence/paralysis` are **dead**
(combat never creates them); `weaken/slow` CR-weights are **dead** (Monster.ts KV-AUD-167); out-of-combat
`cure_poison` removes by **id** and fails (KV-AUD-115); `character.statusEffects` is a separate persisted system
from combat's `playerEffects`. This is the audit's clearest structural hazard. → unify on the richer
`StatusEffect.ts` model; migrate `Character.ts` (add or drop fear/silence/paralysis).

**KV-AUD-191 | S2 | Confirmed | L3 | `StatusEffect.ts:34-38,84-88,133-144,153-157` vs `useCombatStore:502`** —
**The `statModifier` field is dead.** Effects define stat reductions (freeze `AGI -30%`, slow `AGI -40%`,
weaken `STR -25%`, curse `ALL -10%`) but combat **never applies `statModifier`** — it hardcodes per-type
effects instead (e.g. weaken → `×0.75` damage at `:502`, stun/freeze → skip via `skipTurnChance`, blind →
`accuracyModifier`). So **`slow` is fully inert** (its *only* effect is the ignored `statModifier`), and
freeze/weaken/curse lose their stat-reduction component. → apply `statModifier`, or delete the dead field and
keep the hardcodes.

**KV-AUD-192 | S2 | Likely | L3 | `StatusEffect.ts:152,73,244-257`** — `preventsHealing` (curse) and
`reducesHealing` (burn 50%) only matter if `getHealingModifier` is called — but combat's heal paths (W1-S1)
went through `onHeal` callbacks without it. If `getHealingModifier` isn't applied, **curse's healing-block and
burn's healing-reduction are dead** too. → verify the combat/heal call sites (Wave 2); wire `getHealingModifier`.

### Weapon — hybrid routing + triangle
**KV-AUD-185 | S2 | Confirmed (definitive) | L2 | `Weapon.ts:12-29`** — **Confirms seed KV-AUD-040 exactly.**
The `HybridCategory` union and the routing `Set<string>`s disagree: the union has `CHA_INT` but
`HYBRID_MIXED_CATEGORIES` has `INT_CHA` (different spelling → `resolveWeaponFormula.has('CHA_INT')` is **false**
→ a CHA_INT hybrid mis-routes to **physical**, W1-L1 KV-AUD-043 / W1-T1 KV-AUD-153); the set has `INT_PER`,
`WIS_PER`, `WIS_LCK` which **aren't in the union** (dead entries); and `WIS_CHA`+`CHA_WIS` are **both** in the
union *and* the set (redundant). `Set<string>` hides all of this from `tsc`. → derive the sets from the union;
canonicalize pair order.

**KV-AUD-186 | S2 | Confirmed | L1/L9 | `Weapon.ts:269`** — **Confirms seed KV-AUD-051/032.** `getDamageEffectiveness`
returns a hard **0** (not a reduction) for `poison` vs `bone`/`armor`/`spirit`. Combat applies this *after* the
`Math.max(1)` floor (W1-S1 `:534`), so a poison weapon does **literally 0** to skeletons/golems/ghosts — an
unwinnable softlock if such an enemy is mandatory. → floor the post-triangle damage to ≥1, or use a small
reduction not 0.

**KV-AUD-187 | S2 | Confirmed | L2 | `Weapon.ts:256-258`** — The triangle table accepts **6** armor types but
`MonsterArmorType` has **9** (`plate`/`scales`/`ethereal` absent). Combat bridges the gap with an `as any`
normalization (W1-S1 KV-AUD-054); any new armor type without that mapping hits the `?? 1.0` neutral fallback. →
align the union; remove the cast.

**KV-AUD-188 | S2 | Likely | L3 | `Weapon.ts:118-142`** — **Weapon enchantments appear display-only.**
`WeaponEnchantment.effects` (lifesteal, elemental_damage, status_chance, armor_pierce, bonus_vs_type, on_kill,
stat_boost) are generated and shown in the display name ("of Flame"), but combat's `playerAttack` (W1-S1) never
reads `weapon.enchantment` — so the effects likely do nothing. This undercuts the "Loot is King" pillar
(enchanted weapons are a core reward). → verify Wave 2 (`combat.tsx`); wire enchantment effects.

**KV-AUD-189 | S3 | Confirmed | L7 | `Weapon.ts:44-54`** — `DamageType` (10 types) has no `'chaos'`, yet
`SacredItem` references it (mapped to `'dark'` in conversion, W1-L1 KV-AUD-045). Confirms prior AUD-061. → add
`chaos` or stop referencing it.

### Armor / accessories
**KV-AUD-193 | S2 | Confirmed | L3 | `Armor.ts:15-53,167-179` vs `Stats.ts:362`** — Armor **mobility penalties
are dead.** `ARMOR_TYPE_STATS` defines `speedPenalty`/`dodgePenalty` (heavy = −0.25 speed) and
`calculateSpeedPenalty` sums them, but `calculateDerivedStats` (W1-T1) computes speed/dodge **without**
subtracting them, and `getDerivedStats` (W1-S2) never passes them. So heavy armor's defense applies but its
speed/dodge cost doesn't — the weight-class tradeoff is half-dead; `calculateSpeedPenalty` is orphan. → apply
the penalties in the derived calc.

**KV-AUD-194 | S2 | Confirmed | L3 | `Armor.ts:92-103` vs `sacredItemConversion:184-189`** — Only `stat_boost`
accessory effects are applied. `getAccessoryStatBonuses` (W1-L1) reads **only** `effect.type === 'stat_boost'`;
the `resistance`/`regen`/`bonus_damage`/`special` accessory effect types are **never applied** anywhere → dead.
→ wire the other effect types or remove them.

**KV-AUD-195 | Info | Confirmed (refutes 047) | L3 | `Armor.ts:9,118-126,133-162`** — **Corrects W1-L1
KV-AUD-047:** there are only **4** armor slots (`head/chest/hands/legs` — no boots/feet), so `getArmorStatBonuses`
(which reads exactly those four) misses **nothing** — the sacred-armor-bonus omission I flagged was wrong.
Positives: armor **defense does apply** (`calculateTotalDefense`/`MagicDefense` → `getDerivedStats` armorDefense),
so armor is implemented at the type/store level (UI exposure is the open Wave-2 question, not the math); the
weapon triangle table is otherwise complete and sensible; `QUALITY_OUTPUT_CAP_MULTIPLIER` is well-formed (the
bug is upgrade not recomputing it, W1-S5b KV-AUD-119).

**Unit verdict:** the equipment/status layer is the audit's densest concentration of **rich data that combat
barely applies**: the StatusEffect schism (190, S1) is the structural keystone, and around it sit a chain of
**inert systems** — dead `statModifier` (191, `slow` does nothing), likely-dead enchantments (188), dead armor
mobility penalties (193), dead non-stat-boost accessory effects (194), and the long-confirmed hybrid mis-route
(185) + poison-0 softlock (186). With W1-T1/T3, the verdict crystallizes: **Kohrvellia models far more than it
wires.** One refutation (047) keeps the ledger honest. Cross-checks: **Wave 2-P1** (`combat.tsx`: enchantments,
`getHealingModifier`, statModifier), **W3** (weapon/armor data integrity). **Two type units left (T5, T6).**

---

## Unit W1-T5 — `Achievement.ts`(335) + `Skill.ts`(196) + `Job.ts`(40) + `Loot.ts`(62) + `Consumable.ts`(164) — Session 17, audited first-hand

**Context:** five smaller type files — achievements, skills, jobs, loot pools, consumables. Closes the
RequirementType-vs-fired-set question (031/130), the MonsterCategory union (038/166), and the makeJobKey
sort risk (053).

### Achievements — ~half the RequirementTypes are never fired (definitive 031/130)
**KV-AUD-196 | S2 | Confirmed (definitive) | L3 | `Achievement.ts:16-37`** — Of the **21** `RequirementType`s,
only **~10 are ever fired** by the screens/stores (`kill_count, gold_earn, boss_kill, elite_kill, damage_dealt,
damage_taken, floor_reach, shrine_blessing, stat_reach, custom`). The other **~11 are dead**: `kill_type`,
`floor_return`, `no_damage`, `low_hp_win`, `item_collect`, `reputation`, `skill_use`, `status_inflict`,
`stealth_kills`, `flee_success`, `no_consumables`. Any achievement whose requirement uses a dead type can
**never complete** (its `requirementProgress` never advances), regardless of discovery state. This is the
definitive, type-level resolution of seeds KV-AUD-031/130 — the "residual" they flagged is now quantified. →
fire the missing types, or remove the achievements that use them. (Exact affected-achievement count = W3-DPr.)

**KV-AUD-197 | S3 | Confirmed | L3 | `Achievement.ts:195-275`** — Several utility functions are orphan: the
store inlines its stacking logic (W1-S6b), so `calculateStackedBonus`, `getTierSynergyBonus` (the dead
duplicate of the live count-stacking — confirms prior AUD-041), `getHighestTier`, and `isAchievementCompleted`
appear unused (only `isRequirementMet` is called). → delete or adopt.

**KV-AUD-198 | S3 | Confirmed | L3 | `Achievement.ts:152-163` vs `useAchievementStore:420-438`** —
`DISCOVERY_SOURCES` defines per-source rep gates (tavern 3, arena 6, academy 8…), but `checkReputationDiscovery`
checks **one** `guildRep` for **all** sources — so the multi-NPC discovery economy collapses to a single
reputation track; the per-source `baseRepRequired` values are largely cosmetic. → wire per-source reputations
or simplify.

### Skills — dead effect types + inconsistent defense
**KV-AUD-199 | S2 | Confirmed | L3 | `Skill.ts:9-22` vs `useCombatStore:934-1071`** — Three skill effect types
are **not handled** by `playerUseSkill` (W1-S1): `damage_percent` (HP%-based damage), `buff` (skill self-buff —
distinct from the combat hardcodes), and `flee`. A skill using any of these silently does nothing for that
effect. (Mirrors the consumable buff no-op KV-AUD-057.) → handle them, or remove from the type. (Which skills
use them = W3-DPr.)

**KV-AUD-200 | S3 | Confirmed | L9 | `Skill.ts:127`** — `calculateSkillDamage` reduces by a **flat**
`targetDefense * 0.3`, whereas basic attacks use the ratio `def/(def+100)` (W1-S1). So skill damage scales
differently vs defense than auto-attacks — skills fall off hard against high-defense monsters (flat
subtraction → floored to 1). Inconsistent two-formula defense model. → unify the defense reduction.

**KV-AUD-201 | S3 | Confirmed | L3 | `Skill.ts:86-90` vs `Character.ts:133-141`** — Two "learned skill" types:
`Skill.LearnedSkill` (cooldown/proficiency/timesUsed) vs `Character.Skill` (those + `level/observed/learned`).
The job store uses `Character.Skill`, so `createLearnedSkill` (`Skill.ts:179`) is orphan. Confirms prior AUD-052.
→ unify on one.

### Jobs, Loot, Consumables
**KV-AUD-202 | S3 | Confirmed | L1 | `Job.ts:38-40`** — `makeJobKey` = `[...stats].sort().join('+')` — the
**same alphabetical-sort dependency** as the Paragon bug (KV-AUD-176). Job lookup works only if the keys in
`jobDefinitions.ts` are *also* sorted; if a job's data key is in stat-priority order instead, that job is
**unfindable**. Confirms prior AUD-053 — same failure class as 176. → verify the data keys are sorted (W3-DPr4)
or sort on both sides.

**KV-AUD-203 | S3 | Confirmed | L2/L7 | `Loot.ts:9-17` vs `Monster.ts:107`** — `MonsterCategory` (8 values, incl.
`aberration`/`giant`) is the canonical union, but `Monster.ts` types `category` as **`string`** (KV-AUD-166)
and its comment lists only **6** — a drift that lets a category typo silently break loot/soul routing. Also
`LootResult.xp` (`:54`) is vestigial (no XP, cross-link KV-AUD-037). → use `MonsterCategory` in `Monster.ts`.

**KV-AUD-204 | S2 | Confirmed | L3 | `Consumable.ts:20-21` vs `useCombatStore:818-918`/`useInventoryStore:68-136`** —
The `reveal` and `identify` consumable effect types are **dead**: neither `playerUseItem` (combat) nor
`useConsumable` (out of combat) handles them — so a Scroll of Reveal / Identify Scroll does **nothing**.
(Extends the buff no-op KV-AUD-057.) → handle them or drop the types. (Which consumables use them = W3.)

**KV-AUD-205 | Info | Confirmed | L3 | `Consumable.ts:57-58`** — Pricing is single-path (confirms prior AUD-062
**closed**): consumables carry an explicit `sellPrice`, weapons/armor derive via `calculateSellPrice(buyPrice)`
— no divergence. Positive: `isRequirementMet` (Achievement), `canUseSkill`/`tickSkillCooldowns` (Skill),
`canUseConsumable` (Consumable) are all clean and wired.

**Unit verdict:** more confirmation of the central theme — the type layer enumerates far more capability than
the runtime applies: **~11 dead achievement RequirementTypes** (196, the headline — quantifying why many
achievements can't complete), **3 dead skill effect types** (199), **2 dead consumable effects** (204), the
`makeJobKey` sort trap (202), plus orphan utilities and the loose `MonsterCategory`. Cross-checks: **W3-DPr**
(which achievements/skills/consumables actually use the dead types/effects; jobDefinitions key ordering).
**One type unit left (T6) — then Wave 1 closes and synthesis begins.**

---

## W1-T6 — `Shop.ts`(197) · `SacredItem.ts`(190) · `Blacksmith.ts`(166) · `PlayerSnapshot.ts`(197) · `index.ts`(22)
*Session 18 · KV-AUD-206..219 · the final Wave-1 type unit*

### SacredItem.ts — the catalog the engine barely reads

**KV-AUD-206 | S3 (latent S2) | Confirmed | L4/L1 | `SacredItem.ts:102`** — `SacredWeaponStats.damageType`
is a **divergent, partly-orphan union**: `'physical' | 'magic' | 'holy' | 'dark' | 'chaos'`. Canonical
`DamageType` (`Weapon.ts:44-54`) = `slash|pierce|blunt|magic|holy|fire|ice|lightning|poison|dark`. **`'physical'`
and `'chaos'` exist in NEITHER** canonical value; sacred also omits all of fire/ice/lightning/poison/slash/
pierce/blunt. Structural mismatch too: `BaseWeapon.damageTypes` is `DamageType[]` (array, `Weapon.ts:80`) vs
sacred's singular scalar. On conversion to a real `Weapon` (lib `sacredItemConversion`), `'physical'`/`'chaos'`
have no mapping target. Currently **cosmetic** because the weapon-triangle is unimplemented (CLAUDE.md known
gap #2) — but it becomes a real bug the instant the triangle is wired. (Resolves seed 061.) *Confidence: high.*

**KV-AUD-207 | S2 | Confirmed | L7 | `SacredItem.ts:29-91`** — The acquisition **catalog dwarfs the
evaluator**: **50 `AcquisitionMetric`s × 4 `AcquisitionScope`s** (lifetime/single_character/single_run/
single_combat), with AND/OR via `requireAll` and an extra `forbiddenActions?: string[]`. Per **KV-AUD-099**
the sacred store evaluates only a fraction of these metrics (the rest read as 0/never-progress) → the bulk of
sacred items are **unobtainable**. `targetType?: string` and `forbiddenActions?: string[]` are stringly-typed
(no enum, no validation) — `kills_with_stat`/`kills_type` rely on a free-text `targetType` matching monster/stat
ids nowhere constrained by the type. This is the central theme — *models far more than it wires* — in its
purest form. (Resolves seed 060.) *Confidence: high (ties to 099).*

**KV-AUD-208 | S2 | Confirmed | L7 | `SacredItem.ts:139`** — `revealFavorRequired` is **inert at the engine
level**. It is set on essentially every relic (`deityRelics.ts`: dozens at `revealFavorRequired: 100,
isSecret: true`) but **NO store reads it** (`grep revealFavorRequired src/stores` → 0). So discovery-by-favor
is **unimplemented** in the engine. Compounded by **KV-AUD-121** (`character.deityFavor` frozen at 50 because
`modifyDeityFavor` has 0 callers): even if reveal were wired against character favor, thresholds 60/80/100 are
**unreachable**, so all deity-tier relics (`revealFavorRequired:100`) can never even be *revealed*, let alone
acquired. Double-locks the sacred system shut. (Links 099 + 121.) *Confidence: high.*

**KV-AUD-209 | S4 | Confirmed | L4 | `SacredItem.ts:151-154`** — `weaponStats?/armorStats?/accessoryStats?`
is a **non-discriminated optional triple**; "exactly one is populated" is enforced only by the comment, not
the type. A discriminated union keyed on `slot` (weapon → weaponStats, accessory → accessoryStats, else
armorStats) would make illegal states unrepresentable. Minor type-safety debt. *(Positive: `SacredArmorStats.slot`
= `Exclude<SacredSlot,'weapon'|'accessory'>` correctly yields the real 4 armor slots head/chest/hands/legs —
consistent with Armor.ts having no boots slot.)* *Confidence: high.*

**KV-AUD-210 | S3 | Suspected | L7 | `SacredItem.ts:148-149,159-164`** — Every `SacredItem` carries a
`passiveId`/`passiveDescription`, and every `PantheonSetBonus` a `passiveId`, but **no passive- or
set-bonus-resolution engine was found in any Wave-1 store**. Pending Wave-2/3 confirmation, sacred passives
and 2/4/7-piece set bonuses appear **decorative** (a `passiveId` string with no registry/handler). Moot today
because the items are unobtainable (099) — but it is more enumerated-capability-without-wiring. *Confidence:
medium (deferred for a passive-engine grep in Wave 2/3).*

### Blacksmith.ts — one dead service, one verified-good

**KV-AUD-211 | S2 | Confirmed | L7 | `Blacksmith.ts:103-117` + `Weapon.ts:163`** — The **repair/durability
model is inert**. `Weapon.durability?: { current; max }` exists (`Weapon.ts:163`) but has **0 reads/writes in
any store** (`grep durability src/stores` → none) → durability **never degrades**. `Blacksmith.ts` even labels
the section `REPAIR SYSTEM (Future)` (line 103); `calculateRepairCost` returns 10%-of-value gold while
`RepairCost.materials?` is never populated. Net: the `repair.tsx` screen (705 lines, Wave 2) operates on a value
that is **always max** → a **no-op town service**. (Resolves seed 058; engine-level verdict — screen specifics
deferred to Wave 2.) *Confidence: high.*

**KV-AUD-212 | S4 | Confirmed | L7 | `Blacksmith.ts:24,54,64,75`** — `UpgradeRequirement.questRequired?: string`
is **dead** (no quest system exists; never populated in `UPGRADE_REQUIREMENTS`). `requiredReputation` (6/11/16
for superior/masterwork/legendary) is a live gate but depends on a blacksmith-reputation value actually rising
(cross-ref `useBlacksmithStore`; flagged for the reputation-source check). *Confidence: high (questRequired);
medium (reputation reachability — Wave-2 cross-check).*

**KV-AUD-213 | Info / VERIFIED-GOOD | Confirmed | L8 | `Blacksmith.ts:38-74` ↔ `materials.ts`** — **Referential
integrity PASS** (refutes the seed-057 concern). All 7 upgrade `materialId`s resolve in `materials.ts`:
`iron_ingot`(:21), `steel_ingot`(:33), `damascus_ingot`(:45), `mithril_ingot`(:57), `adamantine_ingot`(:69),
`monster_essence`(:119), `dragon_heart`(:143). Likewise Shop's `MATERIAL_BASE_PRICES` keys (junk…legendary) ==
`MaterialTier` (`Weapon.ts:57`) and `QUALITY_PRICE_MULTIPLIERS` keys == `QualityTier` (`Weapon.ts:60`). *(Whether
the player can ACQUIRE these materials — drop sourcing — is a Wave-3 data question, not a type defect.)*
*Confidence: high.*

**KV-AUD-214 | S3 | Confirmed | L9/L3 | `Blacksmith.ts:129-135,138-155` ↔ `Shop.ts:189-196`** — The blacksmith
NPC is **triplicated and divergent**. (a) `BLACKSMITH_NPC` (id `blacksmith_garm`, greeting *"Ah, another
adventurer! …"*). (b) `SHOP_NPCS.blacksmith` (id `blacksmith`, **different** greeting *"Need something identified
or upgraded? …"* and different farewell). (c) `BLACKSMITH_GREETINGS` (a third, reputation-keyed pool). One NPC,
**three competing greeting/identity sources with mismatched ids** — whichever the screen consumes, the other two
are dead/contradictory data. *Confidence: high.*

### PlayerSnapshot.ts — the boss "senses" a constant

**KV-AUD-215 | S3 | Confirmed | L1/L7 | `PlayerSnapshot.ts:135-137`** — The boss's deity-favor sense is
**constant**. `favorPercent = character.deityFavor ?? 50` feeds the bucket (`≥70` blessed / `≥30` neutral /
else abandoned). Because `character.deityFavor` is **frozen at 50** (KV-AUD-121), `deityFavor` is **always
'neutral'** and `deityFavorPercent` **always 50** — bosses can never sense *blessed* or *abandoned*, defeating
the file's own headline design rule ("they sense ARCHETYPES… divine entities detect sacred marks"). This bucket
(3 tiers @70/30) is also a **THIRD** favor scheme atop `Deity.FAVOR_TIERS` (5 tiers; KV-AUD-180) and
`useDeityStore.FAVOR_STATUS` — extending 180's fragmentation to **3+ incompatible favor models**. (Resolves seed
054; links 121 + 180.) *Confidence: high.*

**KV-AUD-216 | S3 | Confirmed | L1 | `PlayerSnapshot.ts:64,140-141`** — `isFirstEverEncounter` /
`bossDefeatedBefore` are **(a) redundant** — when `bossId` is set both derive from
`gameState.defeatedBosses.includes(bossId)`, so `isFirstEverEncounter === !bossDefeatedBefore` always — and
**(b) semantically wrong**: the field + comment claim "Has ANY character ever **reached** this boss" (line 64),
but the data is `defeatedBosses` (**DEFEATED**, not reached). A boss you reached and *fled* (never killed) still
reports `isFirstEverEncounter=true` on return. Name/intent vs data mismatch. (Resolves seed 055.) *Confidence:
high.*

**KV-AUD-218 | S4 | Confirmed | L4/L1 | `PlayerSnapshot.ts:84-92` + `floor.tsx:415`** — The one caller invokes
the function through a **type-laundering cast**: `floor.tsx:415` passes `soul as unknown as Parameters<typeof
createPlayerSnapshot>[3]`, defeating the `SoulStoreRef` contract. Root cause: the file **re-declares** local
structural `SoulStoreRef`/`GameStateRef` shapes (lines 84-92) instead of importing the real store types, so the
real store can't satisfy them without the `as unknown as` escape hatch. Secondary: `primaryStat` (lines 105-107)
ranks by raw `stats[x].points` only, ignoring the Falna effective value (`level*500 + carry + points`), so it
can misreport the true dominant stat. *(Positive correction: archetype is sound — `WeaponBase.category` is
`WeaponCategory = STR|AGI|PER|INT|WIS|CHA|END|LCK` (`Weapon.ts:9`), i.e. a stat key, so `ARCHETYPE_MAP[category]`
resolves; an earlier "always Berserker" hypothesis was REFUTED on read.)* *Confidence: high.*

### Shop.ts + types/index.ts

**KV-AUD-217 | S3 | Confirmed | L3/L7 | `types/index.ts:1-22`** — The types **barrel is dead AND incomplete**.
(a) **Dead:** `grep "from '…/types'"` (barrel index, not `…/types/X`) = **0 importers** repo-wide; every consumer
deep-imports the concrete module (e.g. `floor.tsx:25` → `…/types/PlayerSnapshot`). (b) **Incomplete:** it
re-exports **9 of 18** type modules; it **omits** `StatusEffect`, `Skill`, `Job`, `Loot`, `Consumable`, `Shop`,
`SacredItem`, `Blacksmith`, `PlayerSnapshot` — so even if adopted it would be half-blind, and a future
`import { … } from '@/types'` of an omitted type would fail confusingly. Dead code + latent trap. (Resolves and
escalates seed 056.) *Confidence: high.*

**KV-AUD-219 | S4 | Confirmed | L7/L3 | `Shop.ts:6,61-144` + shop screens** — Shop pricing is **split across
layers**: `calculateWeaponPrice`/`calculateArmorPrice`/`calculateSellPrice`/`applyReputationDiscount`/
`getCHAHaggleDiscount` live in the `Shop.ts` *type* module and are consumed directly by **screens** (`floor.tsx`,
`shops/general/index.tsx:108`, `shops/equipment/index.tsx:168`) **and** by `useShopStore`. Notably
`getCHAHaggleDiscount` is used **only in the two shop screens, never in the store** → CHA haggling won't apply to
any store-driven transaction (e.g. quick-sell), a likely displayed-vs-charged divergence (defer exact
reconciliation to Wave-2 screens). Trivia: `REPUTATION_DISCOUNTS` falls through to 0 for `|rep|>20`
(out-of-range), and the `_Consumable` import (line 6) is intentionally-unused dead weight. *Confidence: medium
(screen reconciliation deferred).*

**Unit verdict (W1-T6):** the final type unit lands the theme hardest. Two whole subsystems are confirmed
**unwired** at the engine level — the **sacred-item economy** (207 catalog≫evaluator, 208 reveal-favor inert +
double-locked by the 121 favor freeze, 210 passives decorative — all feeding the S1 **KV-AUD-099**) and the
**blacksmith repair/durability** service (211, a no-op because durability never degrades). The **boss-sense**
showpiece is partly constant (215, again downstream of the 121 favor freeze). Plus dead/divergent plumbing: the
**0-importer types barrel** (217), the **triplicated blacksmith NPC** (214), redundant/mislabeled boss flags
(216), and a `as unknown as` contract bypass (218). Counter-evidence recorded too — **057 referential integrity
PASSES** (213, all 7 materials exist; price tables match canonical tiers) and the **archetype map is sound**
(218 positive). New IDs **KV-AUD-206..219** (14 findings; 1 S2-cluster reinforcing 099, 6×S3, 5×S4, 1 verified-
good). **★ WAVE 1 (engine spine: stores + types + lib) IS COMPLETE — 18 units, KV-AUD-001..219. Next: the
deferred Wave-1 synthesis (regenerate `00`/`02`/`03`/`05`/`07` from `ALL_FINDINGS.md`).**
================================================================
## PART E - CROSS-FINDING RECONCILIATION + REGISTER - from ALL_FINDINGS.md
================================================================

# Kohrvellia Audit — Consolidated Findings + Cross-Finding Reconciliation

> All findings to date: **`KV-AUD-001…297`** (the owner's "A-0…A-109" was the early range; first-hand
> work has since extended it through 297).
> Canonical prose detail lives in `findings/config_lib_hygiene.md` (001–002, 042–050),
> `findings/stores.md` (051–147), `findings/types.md` (148–219), and **`findings/screens.md` (Wave 2, 220–297)**;
> the 41 seeds are in `02_FINDINGS.md`. **This file is the index + the reconciliation** (which later findings
> change/refute/supersede earlier ones).
>
> Coverage so far: **★ WAVE 1 COMPLETE — engine spine: stores + lib + types (18 units, 001–219).
> ★ WAVE 2 COMPLETE — app/ screens (10 units W2-P1…P10, 220–297).** Data/content (Wave 3) and
> components/tooling (Wave 4) = not yet first-hand (their seeds/agent-claims below are marked *pending*).

---

# §1 — Cross-finding reconciliation (the "do findings affect previous findings" analysis)

First-hand Wave-1 work changed **18 earlier findings**. Grouped by the kind of change.

## 1A. REFUTED — earlier claim disproved (must be rewritten/removed)
| Earlier finding | Disproved by | Verdict |
|---|---|---|
| **KV-AUD-007** "audio is a 17× console.log stub" | **KV-AUD-143** | **FALSE.** Audio is fully implemented (expo-audio real playback; 53 `.mp3` assets present). The `Would play` logs are stale. *Only the `expo-av`/`reanimated` doc-drift survives (S3).* |
| **KV-AUD-031** "achievements never progress → can't level up" | KV-AUD-031 itself + **KV-AUD-130** | **REFUTED** (progress fires; STANDARD tiers auto-unlock). Real issue is the *discovery gate* (130). |
| prior **AUD-086** "97% of deities unreachable" | **KV-AUD-137** | **REFUTED.** The deity-unlock layer is dead code (0 callers) → all deities are selectable. |
| prior **AUD-079** "Easing strings break native combat" | KV-AUD-037 | **REFUTED.** The strings are dead, never passed to `Animated.timing`. |
| PROGRESS "Discovery System / God Challenges NOT STARTED" | **KV-AUD-127, 134** | **REFUTED.** Both are implemented and wired. |
| sub-agent "node_modules is committed" | planning grep | **REFUTED.** `git ls-files node_modules` = 0. |

## 1B. DOWNGRADED — severity reduced
| Finding | Was | Now | Why |
|---|---|---|---|
| **KV-AUD-004** (favor `0×` table) | **S1** | **S3** | KV-AUD-122: the `0×` multiplier is **dead** (`getBlessingMultiplier` only self-called at `:474`); never wired to stats — not a landmine, just a divergent dead table. |
| **KV-AUD-007** (residual) | S1 | S3 | Audio half refuted (1A); only library-naming doc-drift remains. |

## 1C. REFINED / SCOPE-NARROWED — still valid but the shape changed
| Finding | Refined by | New shape |
|---|---|---|
| **KV-AUD-002** (clearAllStores bleed) | KV-AUD-078, 098, 104, 106 | Inventory is a **facade** (no bleed — 106 refuted it); shop *reputation* resets via `createCharacter`. **Real bleeds = shop `lifetimeGoldSpent` (104) + sacred `acquired`/char-scope (098).** Rewrite to drop the inventory claim. |
| **KV-AUD-003** (dead GameConstants) | KV-AUD-065 | **Partially** dead: `CombatConfig.flee` + `LootConfig.luckBonusPerPoint` **are** used; `DerivedStatFormulas` + some `Combat` fields are dead. Audit per-field (W4), don't blanket-delete. |
| **KV-AUD-019** (output cap) | KV-AUD-077, 119 | `Infinity` cap is **unarmed-only** (not corrupt-save, 077); the real defect is **upgrade omits `maxOutputCap` (119, confirmed)**; magic/luck-uncapped still pending W1-T1. |
| **KV-AUD-024** (blessing selector) | KV-AUD-121 | Largely **moot**: even if combat reads the blessed selector, favor is **frozen at 50** (121), so the blessing is ~1.0 regardless. Lower impact than filed. |

## 1D. SUPERSEDED — seed replaced by a confirmed first-hand finding (use the new ID)
| Seed | Superseded by | Note |
|---|---|---|
| KV-AUD-005 (farming) | **KV-AUD-080** | Full end-to-end confirmation (re-arm + backward nav + no validation). |
| KV-AUD-006 (sacred return-0) | **KV-AUD-099** | Expanded: + dead `forceUnlock` + no-writer metrics + bidirectional (unobtainable *and* false-unlock). |
| KV-AUD-023 (growth path) | **KV-AUD-068** | Flat `commitExcelia` is live; cost curve dead → the balance root. |
| KV-AUD-017 (dual favor) | **KV-AUD-121** | Escalated S2→S1: not "hand-synced," **never** synced (`modifyDeityFavor` 0 callers) → favor inert. |
| KV-AUD-015 (volume) | **KV-AUD-144** | Confirmed; engine volumes non-persisted + different scale. |
| KV-AUD-016 (blacksmith rep) | **KV-AUD-107** | Shop's blacksmith rep is the dead one. |
| KV-AUD-025 (suffix status) | **KV-AUD-052** | Confirmed dead in combat. |
| KV-AUD-027 (upgrade cap) | **KV-AUD-119** | Confirmed first-hand. |
| KV-AUD-030 (90 vs 85) | **KV-AUD-091** | Confirmed 90. |
| KV-AUD-021 (dead NODES const) | **KV-AUD-085** | Confirmed. |

## 1E. DUPLICATES to merge
- **KV-AUD-029 ≡ KV-AUD-011** (both the Paragon sort bug) — delete 029, keep 011.

## 1F. CROSS-LINKS — findings that compound (fix together, or one masks another)
- **Balance / growth:** 068 (flat growth) **×** 018 (compressed grades) → SSS trivially cheap. *(both needed for the fix)*
- **Favor system:** 121 (favor inert) **×** 004 (divergent tables) **×** 024 (blessing selector) → the whole favor→power layer is broken+confusing; **121 is the load-bearing one.**
- **Paragon title:** 011 (sort bug) **×** 093 (combat behavements double-counted → combat-biased vectors) **×** 020/050 (Mythic needs score 100) **×** 091 (90 not 85) → the Denatus climax is multiply broken.
- **Sacred items:** 099 (dead metrics/forceUnlock) **×** 098 (acquired bleed) → large share of ~770 items unreachable *and* lost across permadeath.
- **Inventory gold-loss:** 070 (equip overflow past 20) **×** 113 (50-vs-20 cap mismatch) → equip past 20, then buy = charged, no item.
- **Farming:** 080 (node re-arm) **×** 082 (floors re-roll on ascend) → infinite *fresh* content farm.
- **Perf per combat tick:** 101 (sacred O(770) scan) **×** 132 (achievement O(123) scan) → every kill scans both.
- **StatusEffect schism (039)** → manifests as 052 (suffix dead), 066 (cleanse vocab), 115 (cure-by-id likely fails).
- **First-combat protection (138)** depends on meta `totalRuns` → only the first-ever character is protected.
- **Hybrid weapons (4-way compound):** 043 (resolver `Set<string>` fall-through → physical) **×** 185
  (union vs set spelling: `CHA_INT`≠`INT_CHA` + dead `INT_PER`/`WIS_PER`/`WIS_LCK`) **×** 153 (fallback
  hardcodes effSTR/effINT → scales off the **wrong** stats) **×** 061 (combat **sums** both attack pools →
  ~2× base) → a hybrid weapon is simultaneously **mis-routed, mis-scaled, and double-dipping.** Fix by
  deriving the routing sets from the typed `HybridCategory` union (185) first.
- **Vestigial XP (the abandoned "no XP" design):** 055 (`rewards.xp` computed, no consumer) **×** 165
  (`BaseMonster.xpValue` dead data on ~39 monsters) **×** 203 (`LootResult.xp` vestigial) → three dead
  remnants of a pre-"no XP bar" design; remove together (one cleanup, three files).
- **Dead effect-handler pattern:** 057 (combat `buff`/`heal_percent` only log) **×** 199 (skill
  `damage_percent`/`buff`/`flee` unhandled) **×** 204 (consumable `reveal`/`identify` unhandled) — with
  116 showing buffs **do** apply out-of-combat → one shared effect resolver fixes all four.

## 1G. TYPES WAVE (W1-T1..T6, KV-AUD-148–219) — what the type layer added/settled
*The types wave discharged ~20 pending seeds with first-hand evidence and surfaced the 5th S1.*
- **New S1 — KV-AUD-190 (StatusEffect schism, definitive):** THREE incompatible status models
  (`StatusEffect.ts` weaken/slow/regen · `Character.ts` fear/silence/paralysis · a 'buff' shape);
  7/10 ids overlap → fear/silence/paralysis dead, weaken/slow CR-weights dead, cure-by-id fails.
  **Supersedes/settles seed 039** and explains 052/066/115/158. Favor-table fragmentation reaches
  **3+ schemes** once `PlayerSnapshot` (215) is counted alongside `Deity.FAVOR_TIERS`/`FAVOR_STATUS`.
- **Seeds CONFIRMED first-hand by the types wave:** 018→**150** (grade compression; +grades are
  near-cosmetic since combat reads linear effStat), 003→**151** (Stats.ts hardcodes coeffs, 10× drift),
  019→**152** (output cap physical-only), 041→**156/157** (backstory penalty applied nowhere;
  deityAffinity non-domain), 039→**158/190**, 053/036→**163** (Infinity reward on `baseCR:0`), 037→**164**,
  038→**166** (MonsterCategory union vs `category:string`), 022→**169** (dead void/labyrinth biomes),
  052→**168** (SUFFIX_FLOOR_GATES guard a never-firing mechanism), 040→**185** (hybrid set CHA_INT vs
  INT_CHA + dead pairs), 051/032→**189** (poison vs bone/armor/spirit = 0-dmg softlock), 031/130→**196**
  (~11 of 21 achievement RequirementTypes never fire → uncompletable), AUD-062 **CLOSED**→205 (single
  sell-price path), 054/055/056/060/061→**215/216/217/207/206**, 057 **PASSES**→213.
- **New "models-more-than-it-wires" findings (types wave):** **162 (S2, balance headline)** deep floors
  likely mathematically unwinnable (3-layer multiplicative monster HP vs linear player damage — needs a
  100-floor sim; likely why content stops at fl.25); **177 (S2)** half the Paragon noun passives dead;
  **181 (S2)** deity DOMAIN blessings display-only; **188/191/193/194 (S2)** weapon enchantments + armor
  speed/dodge penalties + `slow` + non-stat accessory effects all inert; **199/204 (S2)** 3 dead skill
  effect types + reveal/identify consumables dead; **207/208/211 (S2)** sacred catalog ≫ evaluator +
  `revealFavorRequired` read by 0 stores + repair/durability never degrades.
- **Self-corrections (R1 in both directions):** refuted my own "armor omits boots" (047 — Armor.ts has
  only 4 slots) and "archetype always Berserker" (218 — `WeaponCategory` IS the stat set).
- **Compounding cross-links added:** **176 (sort) × 177 (dead noun passives) × 178 (Mythic=100 impossible)
  × 091/093** → the Denatus/Paragon climax is multiply broken; **162 × 153 (hybrid mis-scale) × 068 × 150**
  → the whole power curve is simultaneously cheap, mis-scaled, and untunable; **207/208/210 × 099 × 121**
  → the sacred economy is locked shut from three directions.

## 1H. WITHIN-WAVE-1 SELF-CORRECTIONS — first-hand findings that revised *earlier first-hand* findings
*(Distinct from §1A–1E, which reconcile the 41 **seeds**. These are cases where one first-hand finding
(042+) corrected, refuted, mooted, or compounded **another first-hand finding** — R1 "verify everything,
including our own work," applied to the audit itself. Each is now annotated inline in `findings/*.md` with
an `[Update S21]` note so the source prose is internally honest without a cross-reference here.)*

| Earlier finding | Revised by | Disposition |
|---|---|---|
| **067** (S1) "combat is well-wired to soul" | **096** (S4a) | **CORRECTED** — it's *over*-wiring: ~30 behavements fire in store **and** screen (the 093 double-count). The concrete positives (triangle wired, `alreadyDead` guard, system live) stand. |
| **047** (L1) "`getArmorStatBonuses` omits slots" | **195** (T4) | **REFUTED / WITHDRAWN** — only 4 armor slots exist; nothing is omitted. (046's off-interface type-debt stands.) |
| **106** (S5a) "two gold pools — top open thread" | **106** (S5b) | **REFUTED** — `useInventoryStore` is a facade over `character.gold`; no second pool. Also corrects CLAUDE.md's "separate stash." |
| **024** (S2) "combat may drop the blessed selector" | **121** (S6a) | **MOOTED** — favor frozen at 50 → blessing ~1.0× regardless of selector. (Paragon half separately dead via 177, not moot.) |
| **058** (S1) "`startCombat` lacks first-combat protection" | **138** (S7a) | **COMPOUNDED** — the protection it lacks is itself dead for char #2+ (meta-keyed). Both entry paths leave post-first characters unprotected on fight #1. |
| **095** (S4a) "two behavements maybe unreachable" | **127** + **178** | **SPLIT** — `glory_challenge_complete` is **reachable** (127, challenges wired); `explore_secret_rooms` is **confirmed unreachable** (178, and it's the example that caps the Mythic score <100). |
| **046** (L1) "sacred armor bonuses maybe dead" | **S2** | **DISCHARGED** — derived path **does** call `getArmorStatBonuses`; bonuses are live. Type-debt only. |
| **057** (S1) "buff/%-heal consumables inert in combat" | **116/199/204** | **GENERALIZED** — same dead-effect-handler pattern in skills (199) + reveal/identify consumables (204); buffs work out-of-combat (116). One resolver needed. |
| **077** (S2) "unarmed cap is `Infinity`" | **152** (T1) | **CONFIRMED** — `weaponMaxOutputCap` defaults to `Infinity` (`Stats.ts:316`); cap is also physical-only. |

**Method note.** Roughly **a third of Wave-1 effort was correction in *both* directions** — of the 41
seeds *and* of the audit's own first-hand findings. The deliverable's value is as much in the
**withdrawals** (047, the inventory second-pool, the 0× favor landmine, the audio-stub, "deity 97%
locked," "can't level up," "node_modules committed") as in the confirmations. A finding that survived this
gauntlet is high-confidence; the five S1s did — though Wave 2 then **downgraded** one (121→S2, KV-AUD-242, false-negative grep) **and added** another (259, the Paragon/Denatus Level-10 climax is unreachable), so the count is **5 again** — a different set: 002/080/099/190/**259**.

---

## 1I. WAVE 2 (SCREEN LAYER, KV-AUD-220–297) — how the screen pass changed prior findings
*The 10-unit app/ pass (W2-P1…P10) was the highest-yield reconciliation wave: it discharged the queued
Wave-1 cross-checks against the screens that consume each subsystem, produced **three R1 self-corrections**,
**downgraded one S1**, and **added one S1**. Each item is annotated inline in `findings/screens.md` (and
back-annotated in `findings/stores.md`/`types.md` where it revises a W1 finding).*

### R1 self-corrections (the audit correcting its own earlier first-hand work)
| Earlier finding | Revised by | Disposition |
|---|---|---|
| **108** (S2) "is armor sold/equippable?" | **281** (S2) | **REFUTED → armor IS fully buyable, equippable, and its defense applies.** The equipment shop sells armor (DEF/MDEF cards) and the town inventory equips it (`equipFromInventory:256`). This also **corrects my own 276/267** (armor isn't phantom; the dungeon "Phase 3" placeholder is stale). Residual real defects are partial: speed/dodge penalties dead (193), accessory2 unreachable (076). |
| **211** (S2) "`repair.tsx` is a 705-line no-op" | **286** (S3) | **REVISED → `repair.tsx` is a *functional SALVAGE* screen.** `handleSalvage` breaks items → materials + gold + rep and **closes the loot loop** (→ upgrade materials). 211's spirit holds at the *model* level (`Weapon.durability` never degrades; there is no repair service), but the file is misnamed-functional, not dead. |
| **024** (S2) "combat may drop the blessed selector" | **225** (S4) | **REFUTED** — combat aliases to `getDerivedStatsWithBlessings` (was also mooted by 121 in W1). |

### DOWNGRADE / ESCALATION
- **121 (favor) S1 → S2** via **242**: the W1 "`modifyDeityFavor` has 0 callers" was a **false-negative grep** (missed the destructured bare call) — favor **is** synced at `room.tsx:497` (shrine). **270** completes it: favor→power is **shrine-ONLY** (a grep of `town/familia/*` for `modifyDeityFavor|adjustFavor` = 0 → Blessing Rite / Familia / Ascension / Challenges never touch `character.deityFavor`). Main patron loop power-inert, shrines work → stays S2.
- **NEW S1 — 259**: the **Level-10 Denatus/Paragon climax is unreachable** (nothing routes to the dead `level-up.tsx`; `ascension.tsx` has no L10 branch and never calls `performDenatus`/`setParagonTitle`) → `character.paragonTitle` is **always null**. Reinforced on-screen by **271** (ascension hardcodes "LEVEL 2", no L10 phase) and **296** (codex `LEVELS=[1..9]` hides all ~15 `targetLevel:10` achievements). Feeders: **260** (`level-up.tsx`, 855 LOC, fully dead) + **261** (denatus latent defects behind the dead route).

### Seeds / W1 findings CONFIRMED or REFUTED first-hand at the screen level
- **093 → CONFIRMED per-event** (220) · **055/164/165/203 "xp vestigial" → REVISED→live** (222: `rewards.xp`→proficiency, physical-biased) · **177 `gold_bonus` → PARTIALLY REFUTED** (223, applied screen-side) · **057/116 → CONFIRMED** (224, buff consumables inert in combat).
- **080/081 → CONFIRMED player-facing** (251, backward "Go Here" badges) · **082 → CONFIRMED** (252, ascend re-rolls) · **086 → DISCHARGED** (257, `enterFloor` descend-gated, no over-tick) · **095/178 → REVISED** (244, `explore_secret_rooms` reachable).
- **205 → REVISED** (283, inline sell formula not `calculateSellPrice`) · **219 → REFUTED for buys** (283, CHA haggle display=charge) · **215 → REVISED** (266, boss favor sense varies via 242; **BUG-022/034 RESOLVED**).
- **010 → REFUTED for production** (294, cheats `{__DEV__ && …}`-gated) · **009 → RESOLVED** (295, epitaph memoized + `clearAllStores` wired) · **096/137/157 → CONFIRMED** (290; "97% locked" stays refuted) · **AUD-012 → CONFIRMED** (291, ~1015 dead LOC) · **144 → CONFIRMED** (293, dead `useGameStore.musicVolume/sfxVolume`).

### NEW Wave-2 cross-links (compounding defects)
- **Nav-integrity cluster:** **264** (dungeon `_layout` sets no `gestureEnabled:false` → iOS swipe-back live) is the **root** that makes **234** (retreat-modal flee duplicate), **246** (reward re-farm + Android-only `BackHandler`), **254** (mid-run "Menu" escape without `endRun`), **277** (`enterDungeon` resumes a dangling run) exploitable — together with **251** they are the **screen-side surface of the S1 080 farming**.
- **Raw-`.points`-vs-grade bug class (systemic, 5 sites):** **279** (guildhall gate `s.points>=500` mislabeled "Grade D") · **261** (denatus top-stats) · **218** (W1) · level-up · boss-encounter.
- **Off-token color palettes (5+ sites):** **236** · **247** · **255** · **275** · **280** · **284** · **297** — diverge from `Colors.*`; the same tier/grade renders differently across screens.
- **Status divergence (274):** the Character **Status screen reads the UNBLESSED `getDerivedStats`** while combat/inventory/familia use `getDerivedStatsWithBlessings` → the canonical stats view diverges from actual combat stats.
- **Displayed-but-not-applied (289, extends 156):** deity AND backstory `statPenalty` are shown but never applied at `createCharacter` → every character is all-upside (MINDSET violation).

---

# §2 — Action items (docs that need rewriting from this reconciliation)
1. **`00_EXECUTIVE_SUMMARY.md`** — (a) **rewrite KV-AUD-007** (audio is *not* a stub; keep only the doc-drift); (b) **downgrade KV-AUD-004 S1→S3**; (c) add the new S1s — **KV-AUD-121 (favor inert)**, **099 (sacred broken)** — and confirm **080 (farming)** as S1; (d) narrow KV-AUD-002 to 104+098. The current scorecard overcounts S1s (007/004) and undercounts (121/099 absent).
2. **`02_FINDINGS.md`** — annotate seeds 005/006/015/016/017/021/023/025/027/030 as **Superseded**; 002/003/019/024 as **Refined**; 004 **Downgraded**; 007/031 **Refuted-in-part**; merge 029→011.
3. **`03_CONNECTIVITY_AND_DEADCODE.md`** — add dead deity-unlock layer (137), dead `forceUnlock` (099), dead `startChallenge`/`tickChallengeFloor` (125), dead `FAVOR_STATUS.multiplier` (122); **remove** the "audio stub" entry.
4. **`05_BALANCE_AND_BENCHMARKS.md`** — add **121 (favor inert)** as a top balance defect; mark 068 (flat growth) confirmed; note 062 (multiplicative burst), 061 (hybrid double-stat).
5. **`07_DOC_RECONCILIATION.md`** — record the meta-pattern: **PROGRESS understates** Phase-2 completion (Discovery, Challenges, audio all done) while **CLAUDE.md overstates** the stack (reanimated/expo-av). Audio = done.

*(These are recommendations; this audit is report-only. The regeneration happens in Wave 4 synthesis or on owner request.)*

---

# §3 — Severity tally (post-reconciliation, **Waves 1+2 COMPLETE: engine spine 001–219 + app/ screens 220–297**)
| Sev | Count | Examples |
|---|---|---|
| **S0** | 1 | 001 build break (untracked `weaponFormulaResolver.ts` + 2 boss tables; CI builds from git) |
| **S1** | **5** | 080 farming · 099 sacred-unobtainable · 190 StatusEffect schism · 002 state-bleed · **259 Paragon/Denatus climax unreachable** *(net 5, a different set than Wave-1's: **121 favor was DOWNGRADED→S2** by Wave-2 242 — `modifyDeityFavor` IS called at `room.tsx:497` — and Wave-2 **259 ADDED an S1** — the Level-10 ceremony is unreachable so `character.paragonTitle` is always null. 007 & 004 removed by Wave-1 reconciliation; 190 added by the types wave)* |
| **S2** | ~59 | 051 0-dmg softlock · 053/163 Infinity reward · 068 flat growth · 069 resurrect-via-heal · 098 acquired-bleed · 104 lifetimeGoldSpent bleed · 113 gold-loss · 118 weaponRegistry · 138 first-combat · 144 volume · **162 deep-floors-unwinnable** · 153 hybrid mis-scale · 177 dead Paragon passives · 181 domain blessings display-only · 188/191/193/194 inert equipment · 196 dead achievement types · 207/208/211 sacred+repair unwired … |
| **S3** | ~70 | dead code (137 deity-unlock · 217 dead barrel · 125 challenge fns · 122 0× table) · schism/drift (180 favor tables · 214 NPC triplication · 206 sacred damageType) · docs · minor |
| **S4/Info** | ~30 | positives & verified-good (096 soul-init wired · 127/134 challenges+discovery wired · 136 job `as any` fixed · 142 meta correctly-not-reset · **213 referential integrity PASS** · 218 archetype-map sound) · housekeeping |
**Totals:** 219 (Wave 1: 178 first-hand 042–219 + 41 seeds 001–041) + **78 (Wave 2: 220–297)** = **297 findings.** *(Pending: Wave 3 data/content, Wave 4 components/tooling.)*

**Wave-2 (screens, 220–297) sub-tally:** S0 = 0 · **S1 = 1** (259, the unreachable L10 climax) · S2 = 20 · S3 = 40 · S4/Info = 17. Many Wave-2 S2/S3 entries **confirm or sharpen** an existing Wave-1 finding rather than adding a new defect (220→093, 251→080, 252→082, 282→113, 293→144, 287→119, 286→211…); the genuinely *new* screen-layer defects are **234, 246, 254, 264, 265, 274, 279, 289, 291, 292** + the **259** S1. Wave 2 also produced **3 R1 self-corrections** (281 refutes 108; 286 revises 211; 225 refutes 024) and **resolved/refuted** 009/010/086/219/215.

**Grand S1 set (Waves 1+2) = 5:** 002 · 080 · 099 · 190 · 259 *(121 dropped S1→S2 via 242; 259 added via W2-P4)*.

> **The Wave-1 thesis, in one line:** *Kohrvellia's type/data layer enumerates far more capability than
> the runtime applies.* Whole subsystems are modeled in detail but unwired — sacred items (099/207/208),
> deity favor→power (121/180/181/215), repair/durability (211), half the Paragon passives (177), most
> status effects (190), and ~11 achievement requirement types (196). The single S0 is the only thing
> that blocks a build; the five S1s break core roguelike guarantees (no farming, permadeath hygiene,
> deity progression, sacred rewards, status combat).

---

# §4 — Full register (status-annotated)

## Seeds KV-AUD-001…041 (triage → reconciled)
`001` S0 **Confirmed** build break · `002` S1 **Refined**→104+098 (drop inventory) · `003` S1→**Refined** partial (065) ·
`004` S1→**S3 Downgraded** (122) · `005` S1 **Superseded**→080 · `006` S1 **Superseded**→099 ·
`007` S1→**S3** audio-half **Refuted** (143) · `008` S1 no-font (pending W4 re-verify) · `009` S2 character.deity no-op (pending Wave2) ·
`010` S2 **Confirmed** debug cheat · `011` S2 **Confirmed** paragon sort (deep W1-T3 pending; ≡029) · `012` S2 **Confirmed** garbage files ·
`013` S2 **Confirmed** no scripts/tests · `014` S3 **Confirmed** legacy-peer-deps · `015` S2 **Superseded**→144 ·
`016` S2 **Superseded**→107 · `017` S2 **Superseded**→121 (S1) · `018` S2 grade compression (pending W1-T1; ×068) ·
`019` S2 **Refined** (077 unarmed-only / 119 upgrade) · `020` S3 mythic=100 (pending W1-T3; ×091/093) ·
`021` S2 **Superseded**→085 · `022` S3 dead biomes (pending W1-T2) · `023` S2 **Superseded**→068 ·
`024` S2 **Refined**→moot via 121 · `025` S2 **Superseded**→052 · `026` S2 **Confirmed** (054/072) ·
`027` S2 **Superseded**→119 · `028` S2 maya/inca broken (pending W3) · `029` S2 **DUP of 011** ·
`030` S2 **Superseded**→091 · `031` S0→**Refuted**; residual→130 · `032`-`038` S2/S3 components (Agent; pending W4 re-verify; 037 refutes AUD-079) ·
`039` S1 StatusEffect schism (pending W1-T4; ×052/066/115) · `040` S2 Weapon hybrid-set mismatch (pending W1-T4; ×043) ·
`041` S2 backstory penalty/affinity (pending W1-T1).

## First-hand Wave 1 — KV-AUD-042…147 (canonical; full prose in `findings/`)
**W1-L1 lib (042-050):** 042 S3 no error-isolation · 043 S2 resolver silent-physical fallback · 044 S2 `as never` casts · 045 S3 sacred→'slash' · 046 S2 sacred statBonuses off-interface (bonuses live; type-debt only) · 047 ~~S2 armorBonuses omits slots~~ **WITHDRAWN→195** (only 4 armor slots; nothing omitted) · 048 S2 unguarded throw · 049 S3 hardcoded ×5 cap · 050 S4 accessory-type squash.
**W1-S1 combat (051-067):** 051 S2 0-dmg softlock · 052 S2 suffix-status dead · 053 S2 Infinity reward · 054 S2 `armor as any` · 055 S2 xp computed-unused · 056 S2 rewards-clear race · 057 S2 buff/%-heal inert · 058 S2 startCombat unprotected · 059 S3 bonus-hit physical-only · 060 S3 two elite notions · 061 S2 hybrid double-stat · 062 S2 multiplicative burst/immortal-LCK · 063 S3 balance literals · 064 S3 log cap 20≠8 · 065 S3 **refines 003** · 066 S2 cleanse dup/vocab · 067 Info positives **(corrected by 096)**.
**W1-S2 character (068-079):** 068 S2 **flat growth (balance root)** · 069 S2 **resurrect-via-heal** · 070 S2 equip overflow · 071 S2 triple-dup routing · 072 S2 null-derived cast · 073 S2 no persist-migrate · 074 S3 INT/LCK growth unfired · 075 S3 paragon crit_damage→crit_chance · 076 S3 equipFromInventory slot/accessory2 · 077 Info **refines 019** · 078 Info **refines 002/004** · 079 S4 setPatronDeity no recompute.
**W1-S3 dungeon (080-090):** 080 S1 **farming confirmed** · 081 S2 moveToNode unvalidated · 082 S2 Date.now() seed/re-roll · 083 S3 dead shop node · 084 S3 unused param/eslint · 085 S3 dead NODES const · 086 S2 market over-tick? · 087 S3 endRun kills · 088 S3 floorContext not persisted · 089 S4 treasure double-gate · 090 Info positives.
**W1-S4a soul (091-097):** 091 S2 90≠85 · 092 S3 non-atomic increment · 093 S2 **behavement double-count** · 094 S2 no migrate/desync · 095 S3 secret-room/challenge firing-unreachable · 096 Info soul-init wired **(corrects 067)** · 097 S3 forwards topStats.
**W1-S4b sacred (098-103):** 098 S2 **acquired/char-scope bleed** · 099 S1 **sacred unlock broken** · 100 S2 inconsistent checkAndUnlock · 101 S2 O(770) scan · 102 S3 no migrate · 103 Info positives.
**W1-S5a shop+market (104-112):** 104 S2 **lifetimeGoldSpent bleed** · 105 S2 stock tier meta-keyed · 106 S2 **REFUTED** (two-gold-pool) · 107 S2 dual blacksmith rep · 108 S2 armor sold/equippable? · 109 S3 sellItem no soul · 110 S4 dead import · 111 S3 market guildhall-only/mislabeled · 112 S3 market uncapped stack.
**W1-S5b inv+blacksmith (113-120):** 113 S2 **gold-loss cap mismatch** · 114 S2 identify stale-setState · 115 S3 cure-by-id mismatch · 116 S3 buff works here not combat · 117 S3 rep 0≠1/float · 118 S2 **weaponRegistry not persisted** · 119 S2 upgrade omits cap · 120 Info positives.
**W1-S6a deity (121-129):** 121 ~~S1 favor inert~~ **→S2 favor INCONSISTENTLY-SYNCED** (REVISED by Wave-2 KV-AUD-242: `modifyDeityFavor` IS called at `room.tsx:497`; shrine favor reaches the blessing) · 122 S3 **downgrades 004** (0× dead) · 123 S2 eviction flag one-way · 124 S2 reset incomplete · 125 S3 dead startChallenge/tickChallengeFloor · 126 S3 reward STR/END/AGI/PER only · 127 Info **refutes 095** (challenges wired) · 128 S3 dead call/deprecated · 129 S3 convoluted re-read.
**W1-S6b achievement+job (130-136):** 130 S2 **discovery-gated progress** · 131 S3 max-vs-additive semantics · 132 S3 O(123) scan · 133 S3 GLORY stacking any-2/3 · 134 Info **refutes** discovery/tier-casing claims · 135 S3 job-select no idempotency · 136 Info job `as any` fixed.
**W1-S7a game (137-142):** 137 S3 **dead deity-unlock layer** (refutes AUD-086) · 138 S2 **first-combat protects only 1st char** · 139 S3 totalDeaths over-counts · 140 S3 barrel omits 5 · 141 S3 settings no-migrate · 142 Info meta correctly-not-reset.
**W1-S7b sound (143-147):** 143 S3 **refutes 007** (audio real) · 144 S2 volume dual-source/non-persist · 145 S3 `player as any` · 146 S3 placeholder BGM · 147 Info positives.

## First-hand Wave 1 — types wave KV-AUD-148…219 (canonical; full prose in `findings/types.md`)
**W1-T1 Stats+Character (148-161):** 148 S3 applySoftCap dead · 149 S3 STAT_INFO phantom mechanics · **150 S2 grade compression** (confirms 018; +grades near-cosmetic vs linear effStat) · **151 S2 hardcoded coeffs 10× drift** (confirms 003) · **152 S2 output cap physical-only** (confirms 019) · **153 S2 hybrid weapons mis-scale** · 154 S3 dead proficiency curve · 155 S3 · **156 S2 backstory penalty applied nowhere** (confirms 041) · 157 S3 deityAffinity non-domain · **158 S2 StatusEffect schism (Character side)** (confirms 039) · 159 S3 getCarryCapacity dead · 160-161 Info.
**W1-T2 Monster+Dungeon (162-175):** **162 S2 deep floors likely unwinnable** (3-layer multiplicative monster HP vs linear damage — balance headline) · **163 S2 Infinity reward on `baseCR:0`** (confirms 053/036) · 164 S3 xpValue dead (037) · 165 S3 · 166 S3 MonsterCategory union vs `category:string` (038) · 167 S3 · **168 S2 SUFFIX_FLOOR_GATES guard a never-firing mechanism** (052) · 169 S3 dead void/labyrinth biomes (022) · 170-172 S3 (dead NODES 085, dead shop node 044) · 173 S3 three misaligned floor-bracket schemes · 174 S3 dup danger fns · 175 Info.
**W1-T3 Behavement+Deity (176-184):** **176 S2 Paragon sort bug proven** (13/28 pairs→'Iron'; ≡seed 011/029) · **177 S2 half Paragon noun passives dead** · 178 S3 Mythic=100 impossible · 179 S3 · **180 S3 favor tables reconciled** (live 0.5–1.5 vs dead 0–2.0; only ever 1.0× via 121) · **181 S2 domain blessings display-only** · 182 S3 deprecated calculateBlessingPower still used · 183 S3 opposition map 4/14 · 184 Info.
**W1-T4 Weapon+StatusEffect+Armor (185-195):** **185 S2 hybrid set mismatch** (CHA_INT vs INT_CHA; confirms 040) · 186-187 S3 · **188 S2 weapon enchantments display-only** · **189 S2 poison-vs-bone 0-dmg softlock** (confirms 051/032) · **190 S1 StatusEffect schism definitive** (3 models) · **191 S2 `statModifier` dead → slow inert** · 192 S3 · **193 S2 armor speed/dodge penalties dead** · **194 S2 non-stat accessory effects dead** · 195 Info (refutes own 047 — only 4 armor slots).
**W1-T5 Achievement+Skill+Job+Loot+Consumable (196-205):** **196 S2 ~11/21 achievement RequirementTypes never fire** (definitive 031/130 → uncompletable) · 197-198 S3 · **199 S2 3 dead skill effect types** (damage_percent/buff/flee) · 200-201 S3 · **202 S3 makeJobKey alphabetical-sort trap** (same class as 176; confirms 053) · 203 S3 · **204 S2 reveal/identify consumables dead** · 205 Info **closes AUD-062** (single sell-price path).
**W1-T6 Shop+SacredItem+Blacksmith+PlayerSnapshot+index (206-219):** 206 S3 sacred `damageType` divergence (`'physical'`/`'chaos'` ∉ canonical) · **207 S2 sacred catalog ≫ evaluator** (→099) · **208 S2 `revealFavorRequired` read by 0 stores + double-locked by 121** (→099) · 209 S4 non-discriminated stats triple · 210 S3 passives decorative · **211 S2 repair/durability inert** (`Weapon.durability` 0 store reads → ~~`repair.tsx` no-op~~ **REVISED by 286: `repair.tsx` is functional salvage; only the durability *model* is dead**) · 212 S4 questRequired dead · **213 Info VERIFIED-GOOD** (057 referential integrity PASSES; price tables match canonical tiers) · 214 S3 blacksmith NPC triplicated/divergent · **215 S3 boss favor sense constant** (→121; 3rd favor scheme; **revised by 266**) · 216 S3 redundant+mislabeled boss flags · 217 S3 types barrel dead (0 importers) + incomplete (9/18) · 218 S4 `as unknown as` contract bypass (+archetype map sound) · 219 S4 shop pricing split across layers.

## First-hand Wave 2 — KV-AUD-220…297 (canonical prose in `findings/screens.md`)
**W2-P1a combat logic (220-233):** **220 S2 093 behavement double-count CONFIRMED per-event** · 221 S2 victory-reward/`endCombat` sequencing · **222 S2 xp REVISED→live** (`rewards.xp`→proficiency, physical-biased; revises 055/164/165/203) · 223 S3 **177 partially refuted** (Paragon `gold_bonus` applied screen-side) · 224 S2 **057/116 confirmed** (buff consumables inert in combat) · **225 S4 REFUTES 024** (combat uses `getDerivedStatsWithBlessings`) · 226 S3 056 rewards-clear safe-but-fragile · 227 S2 enemy-turn/`endRound` defect · 228 S3 · 229 S3 balance literals hardcoded in screen (063 class) · 230 S2 · 231 S3 (latent→S1 if self-damage exists) · 232 S3 per-floor-conduct behavements skip normal descents · 233 Info positives.
**W2-P1b combat presentation (234-241):** **234 S2 retreat-modal flee is a buggy duplicate of `runFlee`** (can strand on unrendered `'fled'`) · 235 S3 combat-log triple-length mismatch 5/20/8 (refines 064) · 236 S3 hardcoded-color retreat modal (035 pattern) · **237 S3 ~50-entry dead-style museum** · 238 S3 inline-closure render perf · 239 S3 raw-grade-points skill scaling · 240 S3 unguarded status-badge lookup (latent via 190) · 241 Info.
**W2-P2 room (242-250):** **242 S2 ★ DOWNGRADES the S1 121** (`modifyDeityFavor` IS called at `room.tsx:497`; favor inconsistently-synced, not inert) · 243 S2 shrine "opposed" never fires (BUG-042 casing bug) · 244 S3 `explore_secret_rooms` reachable (revises 095/178) · 245 S3 dead dungeon-shop quantified (083/172) · 246 S2 reward re-farm + bypassable No-Retreat (no `BackHandler`) · 247 S3 inline balance/hex · 248 S3 shrine blood-offering death hole · 249 S3 (needs W3 gen cross-ref) · 250 Info.
**W2-P3 floor (251-258):** **251 S2 screen half of the S1 080/081** (backward nodes render tappable "Go Here" badges; `moveToNode` no directionality guard) · 252 S2 ascend re-rolls (confirms 082) · 253 S3 per-floor-conduct behavements (confirms 232) · 254 S3 mid-run "Menu" escape without `endRun` · 255 S3 off-token "second palette" recurs · 256 S3 map-render perf + dead styles · 257 Info **discharges 086** (`enterFloor` descend-gated; confirms 218/026) · 258 Info.
**W2-P4 ceremonies (259-263):** **259 S1 ★ NEW — Level-10 Denatus/Paragon climax UNREACHABLE** (`paragonTitle` always null) · **260 S2 `level-up.tsx` 855 LOC dead** (feeds 259; confirms 009/027/133 in dead code) · 261 S2 denatus latent defects (097/179 agency, raw-points top-stats, 099 `recordParagon` never called) · 262 S3 job-select half-reachable (base-mode dead, spec-mode live via `ascension:204`) · 263 Info.
**W2-P5 dungeon bundle (264-269):** **264 S2 ROOT — `_layout` sets no `gestureEnabled:false`** → iOS swipe-back live (makes 234/246/254/277 exploitable) · 265 S2 milestone-boss "FIGHT" `monster` null → fragile room→encounter detour · 266 Info **BUG-022/034 resolved** (boss-dialogue achievements wired; revises 215) · 267 S3 stale dungeon armor placeholder · 268 S3 · 269 Info.
**W2-P6a familia (270-273):** **270 S2 ★ completes 242 — favor→power is shrine-ONLY** (`town/familia/*` never touches `deityFavor`) · 271 S3 ascension hardcodes "LEVEL 2", no L10 phase (reinforces 259) · 272 S3 blessing-rite minors (dead `newValue`, phantom `DOMAIN_GLYPH`, flat-growth 068) · 273 Info positives (eviction Option C, challenges wired 127, primary-stat agency).
**W2-P6b town hub (274-277):** **274 S2 Character Status uses the UNBLESSED `getDerivedStats`** (diverges from combat) · 275 S3 phantom `STAT_INFO.combatEffect` (149) + hardcoded grade palette · 276 S3 town inventory 026 casts + 6 phantom armor slots (**corrected by 281**) · 277 S3 `_layout` gesture pattern (264) + `enterDungeon` resumes dangling run (BUG-013).
**W2-P7a guildhall (278-280):** 278 Info discovery 4-states (134) + Gem Exchange (BUG-037) + market board (111); discovery uses general SHOP rep (confirms 198) · **279 S3 ascension gate `s.points>=500` mislabeled "Grade D"** (5th raw-points-vs-grade site) · 280 S3 hardcoded `TIER_COLORS` (4th off-token palette).
**W2-P7b shops (281-285):** **281 S2 ★ R1 — armor IS buyable + equippable + defense applies** (refutes 108; corrects 276/267) · **282 S2 ineffective full-bag guard → silent gold-loss reachable** (confirms 113) · 283 S3 sell uses inline formula not `calculateSellPrice` (revises 205; BUG-038✓/105✓; refutes 219 for buys) · 284 S3 off-token rarity palette · 285 Info shop flow well-built.
**W2-P8 blacksmith (286-288):** **286 S3 ★ R1 — `repair.tsx` is functional SALVAGE, not a no-op** (revises 211; durability model still dead; closes loot loop) · 287 S3 upgrade omits cap (119) + self-heals registry (mitigates 118); identify stale-setState (114) · 288 Info hub uses canonical blacksmith rep (107; shop dup dead).
**W2-P9 character-creation (289-290):** **289 S2 deity + backstory `statPenalty` DISPLAYED but never applied** (extends 156 → every character all-upside, MINDSET violation) · 290 Info confirms 096 (`initializeDenatus` wired) / 137 ("97% locked" refuted) / 157 (affinity half-dead); atomic creation commit + starter weapon.
**W2-P10 framing — tutorial/settings/codex/title/root (291-297):** **291 S3 tutorial trim left 4 orphaned screens** (`combat`/`stats`/`falna`/`leveling` = **1015 dead LOC**; confirms AUD-012) · **292 S3 Haptic-Feedback toggle is a placebo** (local `useState`, never read by `useHaptics`) · 293 S3 volume dual-source (dead `useGameStore.musicVolume/sfxVolume`; confirms 144) · 294 Info settings cheats `__DEV__`-gated (refutes 010 for production) · 295 Info title epitaph memoized + `clearAllStores` on every New Game path (resolves 009); stale `v0.1.0` string · **296 S3 codex `LEVELS=[1..9]` hides ~15 L10 achievements + 3/4 stub categories** (corroborates 259) · 297 Info root `ErrorBoundary` positive; lone off-token hex + SafeAreaProvider doc mismatch.

---
*Maintained alongside `AUDIT_LEDGER.md`. **Waves 1 (engine spine) + 2 (app/ screens) COMPLETE — synthesis folded in (S35, 2026-06-05).** Next: Wave 3 (data/content, `src/data/**`) + the owed 100-floor scaling sim (162).*
