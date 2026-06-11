# Kohrvellia Audit — Seed Findings Register (triage, now reconciled)

> **What this file is.** The **41 provisional seed findings** (`KV-AUD-001…041`) from the initial
> triage. Per the charter (R1) they were never accepted as coverage — each was re-confirmed or refuted
> first-hand when its unit was audited in Wave 1.
>
> **Reconciliation status (updated 2026-06-09, ★ AUDIT COMPLETE — Waves 1–4).** Every seed carries a
> `→ **Reconciliation**` line. The **consolidated live register of all 363 findings is `ALL_FINDINGS.md`**;
> first-hand prose lives in `findings/*.md` (config_lib_hygiene · stores · types · screens · data_combat ·
> data_progression · data_items · data_pantheons · wave4). Seeds resolved by the later waves:
> Wave-2 (009→295, 010→294, 024→225, 041→289), **Wave-3/4 finals — `028` REFUTED→`347` (maya/inca are
> complete-but-orphaned, not malformed); `008` CONFIRMED→`357/361` (no serif font); `033` CONFIRMED→`356`
> (0 `React.memo` across 49 components); `035` CONFIRMED+extended→`358/362` (off-token hex, but the `Colors`
> tokens exist); `012` CONFIRMED→`363` (now 17 junk files); `003` discharged→`360` (`GameConstants` ~80%
> dead)** — noted inline.
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
  → **Reconciliation: REFUTED → `347` (W3-DP, S50).** The TODO is **stale**: `maya.ts`/`inca.ts` **export `mayaPantheon`/`incaPantheon`, are typed `Deity[]`, compile clean (`tsc` exit 0), and carry the full, correct structure + voice.** They are not malformed-interface — they are **complete-but-orphaned** (the index never imports them; ~28 authored deities sit dead). The seed's "likely malformed" framing is wrong; the real defect is wiring (`347`, S3) + a misleading comment. (Reframes CLAUDE gap #4: 5/7 `.tmp` pantheons completed+wired, maya/inca completed-but-orphaned — none broken.)
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
