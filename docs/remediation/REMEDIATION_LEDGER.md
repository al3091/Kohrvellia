# REMEDIATION LEDGER — Kohrvellia audit KV-AUD-001…371

> **Governing directive:** the Remediation Master Prompt (§0–§9), delivered 2026-06-10.
> **Mode: ANALYSIS-ONLY until Gate G1.** Game-code edits made so far: **0**.
> This file is the only cross-session memory. Read it first, every session. `docs/audit/` is read-only (D10).
> Authority hierarchy when documents disagree: live state → canon (`findings/*.md`) → reconciliation (`ALL_FINDINGS.md §1`) → rollups → wave backups → harness.

---

## ▶ RESUME POINTER

- **Phase:** ★ **EXECUTION — WAVE 0** *(GATE G1 SIGNED by the owner 2026-06-10)*
- **G1 decisions (authority):** Part 1 approved in full · **D1** Lycagon bands (player-scaled monsters clamped to per-floor min/max) · **D2** BUILD durability+repair (FE-style; broken-until-repaired proposed) · **D3** DELETE the dungeon merchant + doc · **D4** WIRE ALL biomes (soft-preference weighting) · **D5** stealth = sneak (+Ambush proposal) · **D6** %-growth modifiers replace flat deity/backstory stats (+15/−10 deity, +10/−10 backstory, clamp ±25%; closes 364) · **D7** author ALL ~70 missing jobs (no fallback; 5 sub-batches, owner voice-review)
- **Current batch:** B-01 (track the S0 files + baseline the audited tree) — **WIP** · then B-02 (CI gates) · then B-03 → B-04 → B-05
- **Game-code edits:** begin this session (per-batch, IDs in commits, guards + `13` entries mandatory)
- *(Analysis-phase pointer preserved below for the record)*
- **The G1 package:** this ledger (371 rows, all statuses graph-resolved + HEAD-verified) · `09_TRIAGE_REPORT.md` · `10_ROOT_CAUSE_LEDGER.md` · `11_UNWIRED_REGISTRY.md` · `12_SURGICAL_PLAN.md` (33 batches, W0–W5 + 4 quarantine; **unsigned sign-off block at its end**) · `13_VERIFICATION_LOG.md` (baselines locked)
- **Decisions requested at G1:** Q-2 scaling fork · Q-1's four design-vs-code quarantines · G-5 displayed-costs · B-20 jobs pacing (defaults marked in 12)
- **§9 Definition-of-Done: ALL BOXES CHECKED** — 9 canon + 8 rollups + 4 wave headers read in full · 371/371 rows, none blank · machine tally + 8 divergences explained · live S1 set proven {002,080,099≡343,190,259} · S0+S1s re-verified at HEAD with logged commands · ≥⅓ S2 per pattern verified · every live finding has pattern+bucket · bucket E routed to lint/CI · F protect-list published · leverage table validated numerically (resolver=27+riders) · DAG + conflict scan delivered · all `03` items four-checked with dispositions · 12 covers 100% of A+B, sequences C, gates D/E behind CI, names a guard + Skills field per batch, ends unsigned · **game-code edits = 0**
- **Phase-C outputs:** `10_ROOT_CAUSE_LEDGER.md` — leverage table (resolver claim validated at 27+riders; favor/sacred conflations pruned) · 4 NEW patterns (P12 perf · P13 persistence · P14 coverage · P15 event-instrumentation) · hotspots (combat.tsx is the true #1; ascension.tsx prediction corrected) · DAG (α∥β∥#6∥#5∥312 parallel-safe; #6→#1, #5+11a→#4, #1→C hard-serial) · 10-item conflict scan · 7 backlog gaps
- **Phase-D outputs:** `11_UNWIRED_REGISTRY.md` — four-checks complete per item · F1 batteries run (key strander = `b8e5616`; post-stranding investment at `391a56a`; durability never-wired in ALL history) · **NEW stranding class: abandoned in-flight work** (the hybrid gate exists in 0 commits — uncommitted-only; +maya/inca fix, +the S0 files) · 4 pre-built fixes identified among the "dead" code · dispositions: ~34 WIRE / ~33 DELETE / ~10 MERGE / 4 QUARANTINE→owner
- **Game-code edit count:** 0
- **Backup:** `backup/working-tree-2026-06-10` @ `3b8603e`, pushed to origin (owner-authorized)

## SESSION LOG (append-only, one line per turn)

- 2026-06-10 S1: Ledger created. Audit inventory verified (9 canon + 8 rollups + 4 waves + ledger + plan + 3 junk files present). A0 started.
- 2026-06-10 S2: Plan approved by owner (Phases A→E → Gate G1). **A0 DONE** — 01/00/08/06/ALL_FINDINGS read in full; STATUS-EDGE MAP written below. Pre-logged HEAD-verify: **S0 001 REPRODUCES** (`git -C Kohrvellia ls-files --others --exclude-standard src/` → exactly the 3 files, 2026-06-10). Machine count: **332 `^\*\*KV-AUD-` canon headers + 39 seed-only IDs (003–041) = 371 ✓** (boundary microdelta: stores.md=98 vs range-implied 97, types.md=71 vs 72 — resolve in A2–A4). A1 started.
- 2026-06-10 S2 (cont.): **A1 DONE** — `config_lib_hygiene.md` + `02_FINDINGS.md` read in full; rows 001–050 appended. Edge-map corrections: E3 had 4 wrong seed edges (KV seeds 032–038 are the components cluster, several PENDING at audit close; §1G's bare "036/037/038/032" = prior-audit AUD-###) → fixed; OBS-5 expanded, OBS-7 added (seed 009 has no 02 body entry). A2 next.
- 2026-06-10 S2 (cont.): **A2 DONE** — `stores.md:1-594` (W1-S1…S4b) read in full; rows 051–103 appended. Split point = the S4b/S5a store boundary (line ~594, nearest midpoint). ⚠ Phase-E backlog-gap candidates logged: 068 (flat growth — THE balance root) and 058/138 (first-combat protection) are named by no `06` item. A3 next.
- 2026-06-10 S2 (cont.): **A3 DONE** — `stores.md:595-1162` (W1-S5a…S7b) read in full; rows 104–147 appended. **Count microdelta half-resolved: KV-AUD-106 is double-headered** (Needs-repro in S5a + [REFUTED] restatement in S5b) → stores.md 98 headers = 97 unique IDs ✓. types.md's 71-vs-72 to resolve in A4 (suspect: `ALL_FINDINGS §4` lists a bare "155 S3 ·" with no title). +1 Phase-E gap candidate: P10 silent-failure class (113/282/114…) has no dedicated 06 item. A4 next.
- 2026-06-10 S2 (cont.): **A4 DONE** — `types.md` read in full; rows 148–219 appended. **Count reconciliation EXACT** (164's inline header; OBS-9). **⚠ Major find: `§4` register drifts from canon in the types range** — content mis-maps (169↔170; §4's "189 softlock" = canon 186) + 5 severity drifts (OBS-8) → all tally work must source canon. New unresolved items: the 165/222-vs-300 xpValue contradiction (OBS-10) + 3 open cross-checks at audit close (169/192/177-tail, OBS-11) → Phase-B NEEDS-REPRO seeds. E3 fixed (022→170). A5 next.
- 2026-06-10 S2 (cont.): **A5 + A6 DONE** — `screens.md` read in full (both halves); rows 220–297 appended. +2 open cross-checks added to OBS-11 (239 skill-scale, 249 mystery-reveal source) and one more §4 drift (221 mislabeled). The W2 reconciliations (242★ downgrade, 281★/286★ R1 corrections, 270 shrine-only, 259★ new S1) all captured with their inline-update chains. A7 next.
- 2026-06-10 S2 (cont.): **A7 DONE** — `data_combat.md` + `data_progression.md` read in full; rows 298–342 appended. **OBS-10 RESOLVED** (300 harmonizes with 222 — `xpValue` disposition = REPURPOSE, never delete). A8 next.
- 2026-06-10 S2 (cont.): **A8 DONE** — `data_items.md` + `data_pantheons.md` read in full; rows 343–351 + 364–367 appended (incl. the exhaustive 310-deity pass 364–367). A9 next.
- 2026-06-10 S2 (cont.): **A9 DONE → ★★ PHASE A COMPLETE.** `wave4.md` + `03_CONNECTIVITY_AND_DEADCODE.md` read in full; rows 352–363 + 368–371 appended; UNWIRED PRE-INVENTORY written (Phase-D scope). **Register row count: 50+53+44+72+44+34+45+13+16 = 371 ✓ — every ID 001–371 has a row, none blank.** All 9 canon files + 01/00/08/06/ALL_FINDINGS/03 rollups read in full this session. Phase-B NEEDS-REPRO worklist assembled (13 items). Next session: B1 (machine tally → `09_TRIAGE_REPORT.md`).
- 2026-06-10 S3 (cont.): **★★ PHASE B COMPLETE** — B1: machine tally (canon 332 ✓ · register 371 ✓ · **0 severity mismatches** · as-filed 2/14/130/158/16/51 · live S1 set = {002,080,099≡343,190,259} proven · 8 prose divergences explained). B2: S0+all S1 recipes ✅ VERIFIED-AT-HEAD (sim · relic_check · ach_check · tsc · route-graph · traces · vocab diff) + **all 13 NEEDS-REPRO resolved** (192 hardened Likely→Confirmed S2 — `getHealingModifier` dead; 034 confirmed on a LIVE component; 032's AnimatedHP/SPBar = stale names; 249 dead branches; 342-nit = a **7th P5 raw-points site** at `room.tsx:583`; FloatingDamage double-move confirmed as `03§2-FD`). B3: buckets A–F + F protect-list published in `09_TRIAGE_REPORT.md`; 10 register rows updated. Next: Phase C.
- 2026-06-10 S3 (cont.): **★★ PHASE C COMPLETE** — `10_ROOT_CAUSE_LEDGER.md` written: full pattern assignment over the live set (4 NEW patterns proposed with ≥3 members each: P12 perf / P13 persistence / P14 coverage / P15 event-instrumentation); the "resolver closes ~30" claim VALIDATED at 27 core + riders with the favor (#11b) and sacred-metrics (#10) conflations pruned; hotspots corrected (combat.tsx #1 at 22; ascension.tsx is a junction, not a hotspot); DAG + 10-item conflict scan + 7 backlog gaps (G-1…G-7).
- 2026-06-10 S3 (cont.): **★★ PHASE D COMPLETE** — F1 archaeology battery run (stranding commit = `b8e5616` for the ceremony+tutorial cohorts; `391a56a` invested in dead code post-stranding; durability NEVER store-wired in all history; `git show HEAD:` proves the hybrid gate is **uncommitted-only** → NEW "abandoned in-flight work" class) + F4 pillar battery (durability/shop-node/biomes/stealth ALL have design backing → 4 QUARANTINE owner-questions, Q-1). `11_UNWIRED_REGISTRY.md` written: 11 cohorts, four-checks per item, dispositions ~34 WIRE / ~33 DELETE / ~10 MERGE / 4 QUARANTINE. Next: Phase E (the Surgical Plan → unsigned Gate G1).
- 2026-06-10 S3 (cont.): **★★ PHASE E COMPLETE → THE ANALYSIS MANDATE IS DELIVERED.** `12_SURGICAL_PLAN.md` written — `06` items #1–#19 ALL validated against the verified register (none refuted; rosters adjusted per 09/10/11), gaps G-1…G-7 folded in as batches (B-05 events · B-07 persistence · B-26 perf · B-27 guards · 068 via B-06 · 138 via B-03 · G-5 via B-29), 33 batches across W0–W5 + 4 owner-gated quarantine batches, every batch with Closes/Dep/Guard/Skills/effort/V per §7.3; `13_VERIFICATION_LOG.md` created with the G1 harness baselines. The 4 wave headers read (DoD box closed; their `~` tallies are among 09 §1's explained divergences). **§9 DoD: all boxes checked. Game-code edits: 0. → GATE G1.**
- 2026-06-10 S3: **OWNER-AUTHORIZED SNAPSHOT (explicit D10 exception, owner instruction).** Branch `backup/working-tree-2026-06-10` @ `3b8603e` created via `write-tree`/`commit-tree` (HEAD + working tree untouched; dirty count 76 before = 76 after) and **pushed to origin** (deploy fires on master/main only — verified in deploy.yml). Contents: 102 files (~17.4K insertions) = 38 modified + the 3 S0 files + docs/audit + docs/remediation + audit/ + .audit_tmp/ + 5 untracked lore docs + the creation .docx; junk strays + docs.zip excluded. **Phase-B results from the recon:** (1) **363 HEAD-verify:** the 17 root junk files are **UNTRACKED** (`??` in `git status`) — 363's "are tracked" claim REFUTED-in-part (seed 012's "untracked" was right; the litter stands; the D/M churn was the OUTER repo's tracking). (2) **NEW (OBS-12):** **6 additional junk strays nested in `app/`** missed by the root census: `app/character-creation/500\``, `app/dungeon/{deity,plan}`, `app/town/{500\`,plan,three}` — all left untouched. (3) The **fixed maya/inca exist only as uncommitted modifications** (committed versions = pre-fix) — strengthens 347's WIRE disposition and the snapshot's value. Phase B begins.

## QUESTIONS / OBSERVATIONS (open items for the owner)

- **[Q-1, Phase D — design-vs-code conflicts needing YOUR call at G1]** (1) **Durability/repair**: designed (`DESIGN_EQUIPMENT:188,269`) but never wired in all of git history — build the degrade+repair loop (M–L) or descope + update the doc (XS)? Salvage survives either way. (2) **Dungeon shop node**: designed at 5% (`DESIGN_DUNGEON:86`), deliberately zeroed at `b8e5616`; the room-side implementation is COMPLETE — restoring it is near-free. Restore or delete+update doc? (3) **Biomes**: designed pantheon associations (`DESIGN_DUNGEON:157`); wire biome-filtered monster selection or delete the dead field? (4) **Stealth**: designed in 3 docs; wire to the existing sneak flow or retire the 3 references? Plus two nods: `twoHanded` (undesigned, cosmetic — delete-lean) and **G-5** (deity/backstory `statPenalty`: APPLY per MINDSET, or stop displaying the cost?).
- **[Q-2, Phase C — scaling-fix shape]** #1's fork: gate `monsterLevel` to player level (conservative re-tune) vs extend player progression past L7 (design change). The sim says the binding constraint is DEFENSIVE (monster atk ≫ player HP). Everything in bucket C sequences behind this.

- **[OBS-1, sharpened S2]** Working tree at 2026-06-10 = the audited disk state, but the **committed tree is ~2.5 weeks staler**: last commit `44d53b1` 2026-05-23; **76 dirty files** (most `app/**`, `package.json`, `babel.config.js`, `deploy.yml`). GitHub-Pages CI builds the May-23 commit — the deploy gap is the 3 untracked files **plus** all uncommitted modifications. Phase-B HEAD-verification runs against the working tree and documents committed-tree deltas. Per D10 I stage/commit/restore nothing.
- **[OBS-2]** `Glob` tooling fails on `docs/audit/` (the `` 500` `` backtick junk filename) — use direct paths / shell listings. The 3 stray files (`` 500` ``, `new`, `velocity`) confirmed present and untouched (D10).
- **[OBS-3, new S2]** **Repo-nesting hazard:** the outer `C:\Users\alons\source\repos` repo *independently tracks* Kohrvellia paths (a different, now-deleted junk set; stale M/D churn). Any git op from the outer root (`git add -A`, `checkout -- .`) could clobber game state. All git ops here use `git -C Kohrvellia`. Owner may want to untrack Kohrvellia in the outer repo eventually (post-G1 question).
- **[OBS-4, new S2]** Prose tallies don't sum: final hand-off says "371 · 1 S0 · 5 S1 · ~72 S2 · ~98 S3 · ~52 Info" (≈228 ≠ 332 canon ≠ 371 IDs); `00` says 363; `ALL_FINDINGS` header says 297, its §3 says 342, its footer says 371 (regeneration strata). Phase-B machine tally is mandatory (D6); the divergences each get a one-line explanation in `09_TRIAGE_REPORT.md`.
- **[OBS-5, new S2; expanded after A1]** Notation trap: audit prose sometimes writes prior-audit IDs bare. Confirmed instances: W1-T5 "confirms 053" = **AUD-053** (KV-AUD-053 is the unrelated Infinity-reward finding); `ALL_FINDINGS §1G`'s "053/036→163", "037→164", "038→166", "051/032→189" cite **AUD-036/037/038/032**, not KV seeds (KV seeds 032–038 are the components cluster, mostly PENDING at audit close). When resolving edges, always check whether a bare number means KV-AUD, seed, or prior-audit AUD-### (crosswalk in `07`).
- **[OBS-7, new S2]** Seed **009** has **no body entry** in `02_FINDINGS.md` (sections jump over it); its disposition exists only in that file's header ("009→295") + `ALL_FINDINGS §4` ("character.deity no-op") + 295 ("resolves 009"). Register row cites those.
- **[OBS-8, new S2 — ⚠ load-bearing]** **`ALL_FINDINGS §4` drifts from canon in the types range.** Content mis-maps: §4 assigns 169=biomes/189=poison-softlock, but canon `types.md` (authoritative) has **169=MonsterAbility(Likely) · 170=biomes · 186=poison-softlock · 189=DamageType-no-chaos**; later prose propagates it (299 "compounds 169" should be 170; §1G "051/032→189" should be →186). Severity drift vs canon headers: 155 (canon S4, §4 S3) · 157 (canon S2, §4 S3) · 180 (canon S2, §4 S3) · 186/187 (canon S2, §4 S3). **All register/tally work must source canon headers, never §4.**
- **[OBS-9, new S2]** Count reconciliation now EXACT: 332 line-start headers − 1 (106 double-headered in stores.md) + 1 (164's header is inline mid-paragraph in types.md, missed by `^`-anchored grep) = **332 unique canon IDs + 39 seed-only (003–041) = 371 ✓**.
- **[OBS-10 — ✅ RESOLVED in A7]** The 165/222-vs-300 "contradiction" was rollup compression, not a canon conflict: 300's full prose explicitly cites 222 and harmonizes — `xpValue` is vestigial **as reward-XP** while live **as the proficiency feed**; its recommendation is "remove **or formally repurpose as the proficiency yield (and document)**". ⚠ Disposition consequence (Phase D/E): a naive "delete vestigial `xpValue`" batch would **break the live kill-proficiency channel** (222) — the safe disposition is REPURPOSE+document, never DELETE.
- **[OBS-11, new S2; expanded A5]** Cross-checks left OPEN at audit close (Phase-B NEEDS-REPRO seeds): **169** (MonsterAbility dead? — "verify Wave 2" never discharged; 305's dead BehaviorPatterns is adjacent, not the same) · **192** (`getHealingModifier` wired? — curse/burn healing-modifiers; no W2 discharge found) · **177**'s four non-combat passives beyond `gold_bonus` (`item_effectiveness`/`reputation_gain`/`loot_discovery`/`tier_bonus`) · **239** (skill `statValue` raw-points vs `calculateSkillDamage` expected scale — "verify W3-DPr" not discharged in 340–342) · **249** (mystery-reveal `actualType` source vs `selectMysteryRevealType`'s event/shrine/treasure-only output — "needs W3 gen cross-ref" not discharged). Also one more §4 drift instance: §4 describes **221** as "victory-reward/endCombat sequencing" — canon 221 = magic-kills→`phys_consecutive_kills` (the sequencing item is 226).
- **[OBS-6, new S2]** `ALL_FINDINGS §1` reconciliation tables formally cover through ~342; the 343–371 edges live in its §4 tail entries + the canon files + the audit-ledger NEXT-UP block. Captured in the edge map below; A8/A9 re-verify from canon.

---

## STATUS-EDGE MAP (Unit A0 output — current truth through the reconciliation layer)

> Sources: `ALL_FINDINGS.md` §1 (1A–1I) + §3 + §4 (incl. the 343–371 tail), `08_DEFECT_PATTERNS.md`, `00`, the audit-ledger NEXT-UP block. A bare ID = KV-AUD. **Live S1 set = 002 · 080 · 099(+343) · 190 · 259.** Sole S0 = 001.

### E1 — REFUTED / WITHDRAWN / DISCHARGED-AS-SAFE
| ID | Claim | By | Verdict / residue |
|---|---|---|---|
| 007 | audio is a console.log stub | 143 | FALSE — expo-audio real, 53 mp3s; residue S3 doc-drift only |
| 010 | debug cheats shipped | 294 | `__DEV__`-gated in production; dev-build observation stands |
| 024 | combat drops the blessed selector | 225 | combat aliases `getDerivedStatsWithBlessings` (was also mooted by 121) |
| 028 | maya/inca pantheons broken | 347 | complete + valid + tsc-clean; **ORPHANED** (P7) — audit-adjudicated disposition: WIRE |
| 031 | achievements never progress (seed S0) | 130→326 | progress fires; real defect = discovery gate (lives on as 130/326) |
| 047 | `getArmorStatBonuses` omits slots | 195 | WITHDRAWN — only 4 armor slots exist |
| 086 | `enterFloor`/market over-tick | 257 | descend-gated; no over-tick |
| 106 | two-gold-pool disconnect | 106(S5b) | self-refuted — inventory is a facade over `character.gold`; corrects CLAUDE.md "separate stash" |
| 108 | armor not buyable/equippable | 281 (R1) | armor IS buyable + equippable + defense applies; also corrects 276/267 |
| 202 | `makeJobKey` unsorted-data trap | 338 | `getJobsForStats` sorts both sides — order-independent |
| 219 | CHA haggle display ≠ charge | 283 | refuted for buys |
| AUD-079 | easing strings break combat | 037 | strings dead, never reach `Animated.timing` |
| AUD-086 | 97% of deities locked | 137 | deity-unlock layer is dead code; all selectable |
| PROGRESS | Discovery / God-Challenges "NOT STARTED" | 127/134 | both implemented and wired (stale doc) |

### E2 — DOWNGRADED
| ID | Was→Now | By | Why |
|---|---|---|---|
| 004 | S1→S3 | 122 | the `0×` FAVOR_STATUS table is **dead**, not a wired landmine |
| 007 | S1→S3 | 143 | only the doc-drift half survives |
| 121 | S1→S2 | 242 (+270) | false-negative grep — `modifyDeityFavor` IS called at `room.tsx:497`; favor→power is real but **shrine-ONLY** (Familia/Blessing/Ascension/Challenges never touch `character.deityFavor`) |

### E3 — SUPERSEDED (seed → canonical successor; never cite the seed as evidence) *(corrected S2 after the A1 first-hand read)*
`003→151→360` · `005→080` · `006→099→343` · `008→357/361` · `012→363` · `015→144` · `016→107` · `017→121→242/270` · `018→150` · `019→152(+077/119/313)` · `020→178` · `021→085/171` · `022→170 (NOT 169 — OBS-8)` · `023→068` · `025→052(+190)` · `027→119→313` · `030→091` · `033→356` · `035→358/362/368 (off-token class, incl. screens 236/247/255/275/280/284/297)` · `039→158+190` · `040→185→312 (moot)` · `041→156/157(+289)` · `029 MERGED→011 (≡176)` · `009→295 (resolved)` · `013`/`014`/`026` confirmed standalone (026 via 054/072/218 + screens 257/276)
**⚠ Seeds still PENDING at audit close (settle in A9 from `wave4.md`):** `032` (orphan components — knip 354/358 confirm 5+barrels of its 7-item roster; GritPanel/AnimatedHP/SP NOT flagged, and 369 shows AnimatedBar in use) · `034` (EnemyPreview hardcoded level + dead `canInflict` — listed as a no-op in `03 §2`; not visibly discharged by 356–371) · `036` (console logs — sound half confirmed via 143; component half open) · `037` (dead `Easing`/`Breakpoint` constants — AUD-079 refutation stands) · `038` (`Dimensions` at module load).
**⚠ NOT seed edges (OBS-5 trap):** `ALL_FINDINGS §1G`'s "053/036→163", "037→164", "038→166", "051/032→189" cite the **prior audit's `AUD-###`** IDs — KV seeds 032–038 are the components cluster above.

### E4 — REFINED / SCOPE-CHANGED (load-bearing edges; full set lands per-row in A1–A9)
| ID | Refined by | Current shape |
|---|---|---|
| 002 (S1) | 078/098/104/106 | real bleeds = shop `lifetimeGoldSpent` (104) + sacred `acquired`/char-scope (098); inventory claim dropped; adjacents 069/227/264 |
| 162 | **303 (sim)** | wall at **~floor 15** (not 86); 303 is the live ID; sim = regression harness for any re-tune |
| 196 | **325** | exactly 20/123 (16%) uncompletable; all 11 dead RequirementTypes used; 4 STANDARD-tier visible |
| 130 | **326** | the entire Mythic tier (11 mythic + 2 legendary) undiscoverable (`'undiscovered'` source has no handler) |
| — | 327/329/333 | + type-blind `custom` + cumulative-counter conduct + `value:0` no-op = **4 unreachability vectors, ~27%+ of achievements** (synthesis 332: Mythic capstone quadruple-dead) |
| 211 | **286 (R1)** | `repair.tsx` = functional **salvage** (closes loot loop); only the durability *model* is dead |
| 199 | **342** | dead skill-effect set = exactly `buff`/`damage_percent`/`flee`; catalog clean; live impact entirely = 13 job buff-skills (**336**) |
| 204 | **342** | **LATENT** — handlers missing but no consumable uses reveal/identify |
| 153/061 | **312** | **LATENT** — hybrid routing never engages (`isHybridMixed` always false; 0/338 hybrid categories); **185 = moot type-debt**; the live S2 defect is 312 itself (162 weapons' 2nd stat inert) |
| 165 | **300** | `BaseMonster.xpValue` vestigial ×36; but `rewards.xp` is **live** (222 — consumed as proficiency, physical-biased; revises 055/164/203 in part) |
| 215 | 266 (via 242) | boss favor-sense varies via PlayerSnapshot now |
| 266 | **321** | boss achievements wired floors 5–60; **5 of 8 dangle at 65–100** (machine-caught) |
| 003/065/151 | **360** | GameConstants **~80% dead** (16/20 configs unimported) → balance untunable from the documented source |
| 008/357 | **361** | Typography declares no serif; gothic-serif pillar unimplemented (system fonts) |
| 292 | **361** | `useHaptics` fires unconditionally — toggle is a confirmed placebo |
| 012 | **363** | 17 junk files tracked at game-repo root (+3 strays in docs/audit) |
| 168 | **309** | doubly dead — 0 callers AND gate-key vocabulary ∉ suffix ids; live gate = `MonsterSuffix.minFloor` (P3) |
| 095 | 127 + 244 | `glory_challenge_complete` reachable (127); `explore_secret_rooms` reachable (244, revising 178's example — 178's Mythic-100-impossible stands via 326/332) |
| 177 | 223 | partially refuted — Paragon `gold_bonus` applied screen-side; other noun passives still dead |
| 058 | 138 | compounded — first-combat protection is meta-keyed → dead for char #2+; both entry paths unprotected |
| 118 | 287 | mitigated — upgrade self-heals the registry |
| 113 | 282 | confirmed reachable (ineffective full-bag guard → silent gold-loss) |
| 156 | **289** | extended — deity AND backstory `statPenalty` displayed but never applied (every character all-upside) |
| 067 | 096 | corrected — soul wiring is *over*-wiring (the 093 double-count); positives stand |
| 057 | 116/224/199/204 | generalized — one dead-effect-handler pattern (combat-only inert; works out-of-combat) |
| 205 | 283 | sell uses an inline formula, not `calculateSellPrice` (AUD-062 stays closed) |
| 213 | 339/340 | refint re-confirmed, EXCEPT loot→materials: 16 dangling refs + `hide`↔`monster_hide` (340) |
| 098 | 114 | identify stale-setState confirmed (287) |
| 317 | — | CLAUDE gap #6 "no bosses 30–100" is STALE — all 20 milestone floors wired/authored (15 past the 303 wall) |

### E5 — LATENT (true but currently unreachable/unarmed)
`153` · `163 (302/319 — no baseCR:0 in data; bosses have no baseCR)` · `204 (342)` · `061 (312)` · `231 (→S1 if self-damage ever exists)` · `240 (armed only via 190's schism)`

### E6 — POSITIVE candidates (verified-good → Phase-B bucket F feeders; finalized per-row)
W1: 090 · 096 · 103 · 120 · 127 · 134 · 136 · 142 · 143 · 147 · 160/161 · 175 · 184 · 195 · 205 · 213 · 233 — W2: 241 · 250 · 258 · 263 · 269 · 273 · 278 · 285 · 288 · 290 · 294 · 295 · 297 — W3: 302 · 306 · 310 · 315 · 320 · 324 · 328 · 331 · 334 · 339 · 342 · 346 · 351 — W4: 355 · 359 · 362 · 367 · 371

### E7 — Pre-adjudicated dispositions (inherit; do not re-litigate without new evidence — D9/§5.2)
- **347** maya/inca → **WIRE** (2 lines + delete stale TODO)
- **260** `level-up.tsx` → route DIES, but its Denatus logic **re-homes** per 259 (not lost)
- **286** `repair.tsx` → **live salvage**; only the durability model (211) is dead
- knip-pre-cleared DELETE roster (354/03 §6): `starterSkills.ts`, 7 component orphans, 6 dead barrels, dead 16 GameConstants, ~50-entry combat dead-style museum (237) — pending Phase-D four-checks

---

## FINDINGS REGISTER

Schema: `ID | Sev@audit | Status | Sev-now | Conf | Pattern | System | Key files | Edges | Bucket | HEAD-verify | Batch | Notes`
Columns Bucket/HEAD-verify fill in Phase B; Pattern = only where canon/08 states it (formalized Phase C); Batch = `06` backlog item # where it names the ID (validated Phase E). `—` = pending. Sev-now for REFUTED/MERGED = `—`.

### Rows 001–050 (Unit A1 — seeds + config/lib canon)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 001 | S0 | CONFIRMED | S0 | Conf | — | build/git | `weaponFormulaResolver.ts` + `bosses/milestoneBossesFloors{30to60,65to100}.ts` ← `useCombatStore:32`, `milestoneBosses:16-17` | reinf-by 352 | — | ✅ AT-HEAD 2026-06-10: `git -C Kohrvellia ls-files --others --exclude-standard src/` → exactly the 3 | #2 | owner defers `git add` until content vetted; CI guard = #3 |
| 002 | S1 | REFINED | **S1** | Conf | P6 | state/permadeath | `clearAllStores.ts:19-29` | by 078/098/104/106; adj 069/227/264 | — | — | #8 | header comment "reset all persisted" is false; real bleeds = 104+098 |
| 003 | S1 | SUPERSEDED | S2 | Conf | P3/P8 | balance/constants | `GameConstants.ts:24-61`; `Stats.ts` | →151→360 (16/20 dead; 065 partial) | — | — | #6 | 10× drift; tuning the documented source is a no-op |
| 004 | S1 | DOWNGRADED | S3 | Conf | P3 | deity/favor | `useDeityStore.ts:25-33` | ↓by 122; ×180 | — | — | #11 | 0× FAVOR_STATUS table is dead, not a landmine |
| 005 | S1 | SUPERSEDED | S1 | Conf | P6 | dungeon | `useDungeonStore.ts:644-651` | →080 | — | — | #7 | farming confirmed end-to-end |
| 006 | S1 | SUPERSEDED | S1 | Conf | P1 | sacred | `useSacredItemStore.ts:210-245` | →099→343 | — | — | #10 | bidirectional: unobtainable + false unlocks |
| 007 | S1 | REFUTED | S3 | Conf | — | audio/docs | `package.json`; `useSoundStore.ts` | by 143 | — | — | #19 | audio real (53 mp3s); only lib-naming doc-drift survives |
| 008 | S1 | SUPERSEDED | S3 | Conf | P9 | design/typography | `Typography.ts:56-93`; `app/_layout.tsx` | →357/361 | — | — | #18 | gothic-serif pillar unimplemented (system fonts) |
| 009 | S2 | RESOLVED | — | Conf | — | title/epitaph | `app/index.tsx` | by 295 | — | — | — | ⚠ OBS-7: no body entry in 02; epitaph memoized, clearAllStores wired |
| 010 | S2 | REFUTED | — | Conf | — | settings | `settings/index.tsx:273` | by 294 | — | — | — | `__DEV__`-gated; stripped from export |
| 011 | S2 | CONFIRMED | S2 | Conf | — | soul/paragon | `Behavement.ts:293-298` | proven 176; absorbs 029; ×177/178/093 | — | — | #9 | 13/28 pairs→'Iron'; `Math.random()` noun |
| 012 | S2 | SUPERSEDED | S3 | Conf | — | repo hygiene | repo root | →363 | — | — | #19 | ⚠ seed said 7 UNtracked; 363 says 17 TRACKED — re-verify delta in Phase B |
| 013 | S2 | CONFIRMED | S2 | Conf | — | build/CI | `package.json:5-10` | reinf 068/150/151/303 | — | — | #3 | no lint/test/typecheck scripts; zero tests |
| 014 | S3 | CONFIRMED | S3 | Conf | — | build/deps | `deploy.yml:22` | — | — | — | — | `--legacy-peer-deps` masks React19/Expo54 conflict |
| 015 | S2 | SUPERSEDED | S2 | Conf | P3 | audio/settings | `useSoundStore:100-103`; `useGameStore:27-29` | →144(+293) | — | — | #18 | engine volumes non-persisted, different scale |
| 016 | S2 | SUPERSEDED | S2 | Conf | P3 | blacksmith | `useBlacksmithStore:38`; `useShopStore:40` | →107(+288) | — | — | — | shop's blacksmith-rep dup is the dead one |
| 017 | S2 | SUPERSEDED | S2 | Conf | P3 | deity/favor | `Character.deityFavor`; `DeityRelationship.favor` | →121→242/270 | — | — | #11 | escalated to S1, then ↓S2 (shrine-only sync) |
| 018 | S2 | SUPERSEDED | S2 | Conf | P8 | stats/grades | `Stats.ts` | →150 (×068) | — | — | — | grades near-cosmetic (linear effStat) |
| 019 | S2 | REFINED | S2 | Conf | P8 | stats/cap | `Stats.ts:316` | →152+077+119(→313) | — | — | — | cap physical-only; Infinity = unarmed-only |
| 020 | S3 | SUPERSEDED | S3 | Conf | P11 | denatus | `GameConstants.ts:246-247` | →178 (×091/093/326/332) | — | — | #9 | Mythic=100 literally impossible |
| 021 | S2 | SUPERSEDED | S3 | Conf | P7 | dungeon-gen | `useDungeonStore.ts:44-187` | →085 | — | — | #15 | NODES consts dead; "45 rooms" doc stale |
| 022 | S3 | SUPERSEDED | S3 | Conf | P7 | dungeon/biomes | `Dungeon.ts:262`; `Colors.ts:158,161` | →169 (+299/362) | — | — | #15 | void/labyrinth/dreamscape dead |
| 023 | S2 | SUPERSEDED | S2 | Conf | P8 | falna/growth | `useCharacterStore:245-291,377-417` | →068 (×150) | — | — | — | flat 1:1 live; cost curve dead — THE balance root |
| 024 | S2 | REFUTED | — | Conf | — | combat/blessing | `useCharacterStore:1325-1385` | by 225; mooted by 121 | — | — | — | combat DOES read the blessed selector |
| 025 | S2 | SUPERSEDED | S2 | Conf | P1 | combat/status | `useCombatStore:1263-1282` | →052(+190/301) | — | — | #4 | suffix procs dead in combat |
| 026 | S2 | CONFIRMED | S2 | Conf | P4 | types/casts | `useCharacterStore:1227,1280`; `useCombatStore:532`; `floor.tsx:415`; `town/inventory:401,407,446` | conf 054/072/218 + 257/276 | — | — | #5 | lint-ban `as any` |
| 027 | S2 | SUPERSEDED | S2 | Conf | — | blacksmith | `useBlacksmithStore:287-295` | →119→313; conf 287 | — | — | — | upgrade omits `maxOutputCap` (store-only) |
| 028 | S2 | REFUTED | S3 | Conf | P7 | pantheons | `data/pantheons/index.ts:16` | by 347 | — | — | #14 | complete-but-ORPHANED (~28 deities); adjudicated WIRE |
| 029 | S2 | MERGED | — | — | — | soul/paragon | `Behavement.ts:293-298` | →011 | — | — | — | duplicate of 011 |
| 030 | S2 | SUPERSEDED | S2 | Conf | — | soul | `useSoulStore:31-141` | →091 (096 refutes "soul dead") | — | — | #19 | 90 behavements, docs say 85 |
| 031 | S0 | REFUTED | — | Conf | P11 | achievements | `combat.tsx:1038-48`; `floor:313`; `room:542` | residual→130/196→325/326 | — | — | #12 | leveling NOT blocked; STANDARD auto-unlocks |
| 032 | S2 | REFINED | S3 | Conf | P7 | components | EmphasisText; StatTooltip; ActionModal; GritPanel | →354/358; ✅ B2 2026-06-10: AnimatedHP/SPBar DON'T EXIST (stale names; live `AnimatedBar` replaced them, 369); GritPanel = orphan-via-barrel | D | ✅ AT-HEAD | #15 | roster final: knip's 5 + GritPanel |
| 033 | S2 | SUPERSEDED | S3 | Conf | — | components/perf | `src/components/**` | →356 (+369) | — | — | #18 | 0/49 React.memo; JS-thread HP/SP bars |
| 034 | S2 | CONFIRMED | S3 | Conf | P1 | components | `EnemyPreview.tsx:58,64` ← `encounter.tsx:144` | ✅ B2 read 2026-06-10: component LIVE; both defects present | B | ✅ AT-HEAD | — | `getDangerLevel(cr, 1)` hardcoded + `canInflict=[]` never populated |
| 035 | S2 | SUPERSEDED | S3 | Conf | P9 | design/colors | 7 components + screens | →358/362/368 | — | — | #18 | 66 hex; the `Colors` tokens EXIST (mechanical fix) |
| 036 | S3 | PART-CONF | S3 | Mixed | — | hygiene/logs | `DomainIcon.tsx:54`; `useSoundStore` | sound half conf (143) | — | — | — | ⚠ A9: component-side logs unconfirmed |
| 037 | S3 | CONFIRMED | S3 | Conf | P7 | constants | `Animation.ts:224`; `Spacing.ts:115` | refutes AUD-079; ✅ B2 grep 2026-06-10: `Breakpoint`+`isSentenceEnd` definition-only; `Shadow.glow` 0 hits | D | ✅ AT-HEAD | #15 | dead constants confirmed |
| 038 | S3 | NEEDS-REPRO | S3? | Agent | — | components | `GritOverlay.tsx:6` | not discharged by 356–371 | — | — | — | ⚠ A9/Phase-B: `Dimensions` at module load |
| 039 | S1 | SUPERSEDED | S1 | Conf | P1 | combat/status | `Character.ts:111-130` vs `StatusEffect.ts:9-53` | →158+190 | — | — | #11 | THE schism root (BUG-040) |
| 040 | S2 | SUPERSEDED | moot | Conf | P4 | weapons/hybrid | `Weapon.ts:12-29` | →185→312 | — | — | #5 | CHA_INT≠INT_CHA; routing never engages |
| 041 | S2 | SUPERSEDED | S2 | Conf | P2 | char-creation | `Character.ts:39,306` | →156/157; ext 289 | — | — | — | penalties displayed-never-applied → all-upside |
| 042 | S3 | CONFIRMED | S3 | Conf | P10 | lib/reset | `clearAllStores.ts:19-29` | adj 002 | — | — | — | 9 sequential resets, no try/catch → partial-reset risk |
| 043 | S2 | CONFIRMED | S2 | Conf | P4/P10 | lib/resolver | `weaponFormulaResolver.ts:33,37,46` | enables 185/312 silence | — | — | #5 | any category miss → silent physical fallback |
| 044 | S2 | CONFIRMED | S2 | Conf | P4 | lib/sacred | `sacredItemConversion.ts:51,67-68,101-102` | adj 046 | — | — | #5 | `as never` material/quality stubs |
| 045 | S3 | CONFIRMED | S3 | Conf | P1 | lib/sacred | `sacredItemConversion.ts:43-46` | weapon-triangle interplay | — | — | — | physical sacred→'slash'; chaos→dark silently |
| 046 | S2 | REFINED | S2 | Conf | P4 | lib/sacred | `sacredItemConversion.ts:111-112,198-213` | bonuses LIVE (`useCharacterStore:198-206,1248-52,1304-08`) | — | — | #5 | off-interface `statBonuses` — type-debt only |
| 047 | S2 | REFUTED | — | Conf | — | lib/sacred | `sacredItemConversion.ts:202` | withdrawn by 195 | — | — | — | R1 self-correction — only 4 armor slots exist |
| 048 | S2 | CONFIRMED | S2 | Conf | P10 | lib/sacred | `sacredItemConversion.ts:39,85,120` (+`useSacredItemStore:559`) | — | — | — | — | unguarded throw at equip-time via `require()` |
| 049 | S3 | CONFIRMED | S3 | Conf | P9 | lib/balance | `sacredItemConversion.ts:76` | ties 019/152; ×360 | — | — | — | hardcoded ×5 sacred cap |
| 050 | S4 | CONFIRMED | S4 | Conf | — | lib/sacred | `sacredItemConversion.ts:152-158` | — | — | — | — | seal/talisman→'belt'; unknown→'amulet' silently |

### Rows 051–103 (Unit A2 — stores.md first half: combat · character · dungeon · soul · sacred)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 051 | S2 | CONFIRMED | S2 | Conf | — | combat | `useCombatStore:521,534` | ×189 (triangle 0×) ×298 (53% immune) | — | — | — | 0-dmg softlock: floor applied BEFORE triangle multiply |
| 052 | S2 | CONFIRMED | S2 | Conf | P1 | combat/status | `useCombatStore:1263-1282` | conf seed 025; ×190/301 | — | — | #4 | procs from base damageTypes, never suffix statusEffect |
| 053 | S2 | LATENT | S2 | Conf | — | combat/rewards | `useCombatStore:1519-1520` | ×163; latent per 302/319 (no baseCR:0 in data) | — | — | — | Infinity/NaN reward div-by-baseCR — guard anyway |
| 054 | S2 | CONFIRMED | S2 | Conf | P4 | combat/types | `useCombatStore:527-532` | conf seed 026; ×039 vocab | — | — | #5 | `normalizedArmor as any`; flesh/bone/magic_resistant unmapped→silent 1.0 |
| 055 | S2 | SUPERSEDED | S2 | Conf | — | combat/growth | `useCombatStore:1459,1519-24` | →222 (LIVE: xp→proficiency, physical-only) | — | — | — | "vestigial" withdrawn; residual = physical-bias + flat path (068) |
| 056 | S2 | REFINED | S3 | Conf | P10 | combat/rewards | `useCombatStore:369-389,1517-25` | by 226 (safe-but-fragile) | — | — | — | ordering hazard documented, not currently lossy |
| 057 | S2 | CONFIRMED | S2 | Conf | P1 | combat/items | `useCombatStore:818-918` | conf 224; generalized 116/199/204 | — | — | #4 | buff/%-heal only log in combat; work out-of-combat (116) |
| 058 | S2 | REFINED | S3 | Conf | P7 | combat/entry | `useCombatStore:267-303` | ×138 (compound); 265: startCombat DEAD (0 callers) | — | — | — | orphan generator — delete with the 138 fix |
| 059 | S3 | CONFIRMED | S3 | Conf | — | combat | `useCombatStore:633-647,673` | — | — | — | — | bonus hits bypass weapon-formula routing (physical-stat) |
| 060 | S3 | CONFIRMED | S3 | Conf | — | combat/loot | `useCombatStore:1493` vs `:329-333` | — | — | — | — | two disagreeing "elite" notions |
| 061 | S2 | LATENT | S2 | Conf | — | combat/balance | `useCombatStore:519` | latent via 312 (hybrid routing never engages) | — | — | — | hybrid sum-both-pools double-dip — unreachable today |
| 062 | S2 | CONFIRMED | S2 | Conf | — | combat/balance | `useCombatStore:556-572,1249-52` | — | — | — | — | multiplicative burst (exploit^5, FLOW 1.6) + near-immortal LCK escape |
| 063 | S3 | CONFIRMED | S3 | Conf | P9 | combat/constants | `useCombatStore:961,1210,637,560,1267` | ×360 class | — | — | — | balance literals in engine — bucket-E lint candidate |
| 064 | S3 | CONFIRMED | S3 | Conf | — | combat/docs | `useCombatStore:1387` | refined by 235 (5/20/8 triple) | — | — | — | log cap 20 vs doc 8 |
| 065 | S2 | REFINED | S2 | Conf | P3 | constants | `useCombatStore:55,730-33,1511` | refines 003; →360 definitive (4/20 live) | — | — | #6 | per-field dead/live split — don't blanket-delete |
| 066 | S3 | CONFIRMED | S3 | Conf | — | combat/status | `useCombatStore:866,1021` | ×190 (schism); dup list | — | — | #11 | cleanse vocab = StatusEffect.ts; fear/silence/paralysis never cured |
| 067 | Info | REFINED | Info | Conf | — | combat/soul | `useCombatStore` (~30 sites) | corrected by 096/093 | — | — | — | positives stand (triangle wired, alreadyDead guard); "well-wired" → over-wired |
| 068 | S2 | CONFIRMED | **S2** | Conf | P8 | falna/growth | `useCharacterStore:377-417` vs `:245-291` | conf seed 023; ×150/018 | — | — | ⚠none | **THE balance root** — flat 1:1 live, cost curve dead. ⚠ not named by any 06 item — Phase-E gap |
| 069 | S2 | CONFIRMED | S2 | Conf | P6 | permadeath | `useCharacterStore:529-550` | adj 002 | — | — | #8 | modifyHP resurrects a corpse (R10) |
| 070 | S2 | CONFIRMED | S2 | Conf | — | inventory | `useCharacterStore:702-768` vs `:673` | ×113 (gold-loss compound, §1F) | — | — | — | armor/accessory swap has no BAG_CAPACITY guard |
| 071 | S2 | CONFIRMED | S2 | Conf | — | character/derived | `useCharacterStore:180-191,1232-43,1288-99` | contains the 312 always-false gate (`:184`) | — | — | — | damage-routing block duplicated ×3 verbatim |
| 072 | S2 | CONFIRMED | S2 | Conf | P4 | character/types | `useCharacterStore:1224-27,1277-80` | conf seed 026 | — | — | #5 | 9-field null fallback cast to ~30-field DerivedStats → NaN risk |
| 073 | S2 | CONFIRMED | S2 | Conf | — | persistence | `useCharacterStore:1437-40` | class: 073/088/094/102/141 | — | — | — | no version/migrate; whole Character serialized |
| 074 | S3 | CONFIRMED | S3 | Conf | — | soul/growth | `useCharacterStore:444-449` | — | — | — | — | INT & LCK growth behavements never fire |
| 075 | S3 | CONFIRMED | S3 | Conf | — | paragon | `useCharacterStore:1364-66` | adj 177 | — | — | — | crit_damage passive applied as crit chance |
| 076 | S3 | CONFIRMED | S3 | Conf | — | inventory | `useCharacterStore:894-926` | residual-real per 281 | — | — | — | accessory2 unreachable via inventory-equip |
| 077 | Info | CONFIRMED | Info | Conf | — | stats/cap | `useCharacterStore:48-54` | refines 019/BUG-010 | — | — | — | Infinity cap is unarmed-only |
| 078 | Info | CONFIRMED | Info | Conf | — | state/favor | `useCharacterStore:237,1431-34,1146-70` | refines 002/004 | — | — | — | shop-rep reset wired; live blessing path = FAVOR_TIERS |
| 079 | S4 | CONFIRMED | S4 | Conf | — | deity | `useCharacterStore:1132-44` | forward-link 121 | — | — | — | setPatronDeity skips resource recompute |
| 080 | S1 | CONFIRMED | **S1** | Conf | P6 | dungeon/farming | `useDungeonStore:644-651,698-719,586` | supersedes seed 005; +251 screen; ×082/264 | — | Phase-B trace req'd | #7 | re-arm + backward edges + no validation = infinite farm |
| 081 | S2 | CONFIRMED | S2 | Conf | — | dungeon/nav | `useDungeonStore:572-596` | part of 080 fix | — | — | #7 | moveToNode accepts ANY nodeId |
| 082 | S2 | CONFIRMED | S2 | Conf | — | dungeon/gen | `useDungeonStore:45,1052-54` | conf 252; ×080 (§1F fresh-content farm) | — | — | #7 | Date.now seed; ascend re-rolls floors |
| 083 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon | `useDungeonStore:206-207,248` | quantified by 245 | — | — | — | dead `shop` node + contradictory comment |
| 084 | S3 | CONFIRMED | S3 | Conf | — | hygiene | `useDungeonStore:272-273` | ×013 (no ESLint configured) | — | — | — | vestigial eslint-disable for a linter that never runs |
| 085 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon | `useDungeonStore:62-69` | supersedes seed 021 | — | — | #15 | NODES_PER_FLOOR consts dead |
| 086 | S2 | REFUTED | — | Conf | — | dungeon/market | `useDungeonStore:454-478` | by 257 (descend-gated) | — | — | — | no over-tick |
| 087 | S3 | CONFIRMED | S3 | Conf | — | dungeon/stats | `useDungeonStore:418-430` | — | — | — | — | endRun kills read from pendingExcelia → can report 0 |
| 088 | S3 | CONFIRMED | S3 | Conf | — | persistence | `useDungeonStore:1112-16` | class 073 | — | — | — | floorContext not persisted; manual `-v2` versioning |
| 089 | S4 | CONFIRMED | S4 | Conf | — | dungeon/balance | `useDungeonStore:251-261` | — | — | — | — | treasure double-gated (intended; misleading for tuning) |
| 090 | Info | POSITIVE | Info | Conf | — | dungeon | `useDungeonStore` | — | F-cand | — | — | soul snapshots, sacred run-reset, elite gatekeeper, clean clearAllData |
| 091 | S2 | CONFIRMED | S2 | Conf | — | soul | `useSoulStore:31-141` | supersedes seed 030; ×178/020 score math | — | — | — | 90 behavements, all docs say 85 |
| 092 | S3 | CONFIRMED | S3 | Conf | — | soul | `useSoulStore:244-252` | correct pattern exists at `:258-296` | — | — | — | non-atomic incrementBehavement (lost updates) |
| 093 | S2 | CONFIRMED | S2 | Conf | — | soul/paragon | store vs `combat.tsx` (~30 dup IDs, table in canon) | conf per-event by 220; ×011/020 | — | — | — | combat vectors advance 2× → Paragon title combat-biased |
| 094 | S2 | CONFIRMED | S2 | Conf | — | persistence | `useSoulStore:218,396-399` | class 073 | — | — | — | definitions change → new ids silently no-op forever |
| 095 | S3 | REFUTED | — | Conf | — | soul/reachability | `room.tsx:772`; `useDeityStore:322` | by 127 + 244 (BOTH reachable; S24 correction) | — | — | — | undercuts 178's "capped <100" example |
| 096 | Info | POSITIVE | Info | Conf | — | soul | `useGameStore:340,347`; `confirm.tsx:80`; `denatus.tsx:117` | corrects 067 | F-cand | — | — | soul system initialized + ceremony invoked — live |
| 097 | S3 | CONFIRMED | S3 | Conf | — | denatus | `useSoulStore:315-319` | store half of 011; behind dead route (259/261) | — | — | #9 | performDenatus forwards topStats blind — no agency |
| 098 | S2 | CONFIRMED | S2 | Conf | P6 | sacred/permadeath | `useSacredItemStore:57-59,509-529,539,611-14` | half of S1 002 | — | — | #8/#10 | `acquired` bleeds AND blocks re-earning; no resetCharacterMetrics |
| 099 | S1 | CONFIRMED | **S1** | Conf | P1 | sacred | `useSacredItemStore:206-256,578` | quantified →343 (41%/15 false); ×208/270/121 | — | Phase-B: run `relic_check.ts` | #10 | 14 return-0 stubs + 3 no-writer metrics + dead forceUnlock; value:0 = free pass |
| 100 | S2 | CONFIRMED | S2 | Conf | — | sacred | `useSacredItemStore` (7 sites incl. `recordMaxFavor:448-460`) | — | — | — | — | increments skip checkAndUnlock — incl. the secret-relic gate |
| 101 | S2 | CONFIRMED | S2 | Conf | — | perf | `useSacredItemStore:282-285,533-545` | ×132 (O(123) twin, §1F) | — | — | — | O(770) rebuild+scan per metric tick |
| 102 | S3 | CONFIRMED | S3 | Conf | — | persistence | `useSacredItemStore:608-616` | class 073 | — | — | — | no version/migrate |
| 103 | Info | POSITIVE | Info | Conf | — | sacred | `useSacredItemStore` | — | F-cand | — | — | live writers correctly wired; evaluator sound where metrics live |

### Rows 104–147 (Unit A3 — stores.md second half: shop/market · inv/blacksmith · deity · achievement/job · game · sound)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 104 | S2 | CONFIRMED | S2 | Conf | P6 | shop/permadeath | `useShopStore:496-502,549-551,568-576` | half of S1 002 | — | — | #8 | `lifetimeGoldSpent` bleeds → fresh char docked rep for "underspending" |
| 105 | S2 | CONFIRMED | S2 | Conf | — | shop/balance | `useShopStore:139,158,174-179` | conf 283; ×138 (meta-keyed class) ×142 | — | — | — | stock tier keyed to meta `bestFloorReached` |
| 106 | S2 | REFUTED | — | Conf | — | economy | `useInventoryStore:145-159` | self-refuted (S5b) | — | — | — | NO second gold pool — facade over `character.gold`; corrects CLAUDE.md "separate stash" |
| 107 | S2 | CONFIRMED | S2 | Conf | P3 | blacksmith | `useBlacksmithStore:38,72,218` vs `useShopStore:40,93,484-86` | supersedes seed 016; conf 288 | — | — | — | canonical = blacksmith store; shop dup dead |
| 108 | S2 | REFUTED | Info | Conf | — | shop/armor | `useShopStore:181-185,361-370` | by 281 (R1) | — | — | — | armor IS buyable + equippable + applies |
| 109 | S3 | CONFIRMED | S3 | Conf | — | shop/soul | `useShopStore:416-456` | contrast `guildhall:445,474` | — | — | — | shop sells fire no behavement; guildhall sales do |
| 110 | S4 | CONFIRMED | S4 | Conf | — | hygiene | `useShopStore:10` | AUD-064 | — | — | — | dead `_Consumable` import |
| 111 | S3 | CONFIRMED | S3 | Conf | — | market | `useMarketStore:169-191` | conf 278; reset wired ✓ | — | — | — | "Living Economy" = guildhall material sells only — mislabeled scope |
| 112 | S3 | CONFIRMED | S3 | Conf | — | market/balance | `useMarketStore:177-190` | — | — | — | — | event multipliers stack unbounded (floor 0.25, no ceiling) |
| 113 | S2 | CONFIRMED | S2 | Conf | P10 | inventory/economy | `useInventoryStore:16,162-182` vs `useCharacterStore:812` | ×070 (compound §1F); conf reachable 282 | — | — | ⚠none | 50-vs-20 cap mismatch → gold charged, item dropped. ⚠ P10 class has no dedicated 06 item — Phase-E gap |
| 114 | S2 | CONFIRMED | S2 | Conf | P10 | blacksmith | `useBlacksmithStore:143,161-167` | conf 287; AUD-098 | — | — | — | identify: stale cross-store setState clobber risk |
| 115 | S3 | CONFIRMED | S3 | Conf | — | consumables/status | `useInventoryStore:114-115` | ×190/066 (schism manifest) | — | — | #11 | cure-by-id fails vs unique effect ids |
| 116 | S3 | CONFIRMED | S3 | Conf | — | consumables | `useInventoryStore:118-128` | refines 057 | — | — | #4 | buff WORKS out-of-combat, inert in combat → one resolver |
| 117 | S3 | CONFIRMED | S3 | Conf | — | blacksmith | `useBlacksmithStore:72,365,173,432` | AUD-097 | — | — | — | reset rep 0≠initial 1; float rep |
| 118 | S2 | REFINED | S2 | Conf | — | persistence | `useBlacksmithStore:18,102,128,266` + weaponRegistry | mitigated by 287 (self-heal) | — | — | — | in-memory registry empty after reload; list helpers self-heal, actions don't |
| 119 | S2 | CONFIRMED | S2 | Conf | — | blacksmith/balance | `useBlacksmithStore:287-295` | supersedes seed 027; →313 store-only; conf 287 | — | — | — | upgrade omits `maxOutputCap` → throttles its own gain |
| 120 | Info | POSITIVE | Info | Conf | — | blacksmith/inventory | — | — | F-cand | — | — | resets wired; atomic materials; sound facade design |
| 121 | S1 | DOWNGRADED | **S2** | Conf | P1/P3 | deity/favor | `useDeityStore:124-159` + `room.tsx:71,497` | ↓242; completed 270 (shrine-ONLY); ×180/122/079 | — | — | #11 | favor→power real but shrine-only; Familia/Blessing/Ascension/Challenges never touch `character.deityFavor` |
| 122 | S3 | CONFIRMED | S3 | Conf | P3 | deity/favor | `useDeityStore:25-33,465-468,474` | downgrades 004; display-concern refuted (270: familia shows label) | — | — | #11 | dead 0×–2.0× multiplier table; live = FAVOR_TIERS |
| 123 | S2 | CONFIRMED | S2 | Conf | — | deity | `useDeityStore:138-142` | — | — | — | — | eviction flag one-way (never clears on recovery) |
| 124 | S2 | CONFIRMED | S2 | Conf | — | deity/permadeath | `useDeityStore:104-107,119-121` | adj 002 class | — | — | — | reset leaves `pendingChallengeReward` + `isPatronEvicted` |
| 125 | S3 | CONFIRMED | S3 | Conf | P7 | deity/challenges | `useDeityStore:176-192,367-397` | AUD-092; refutes double-tick | — | — | #15 | dead `startChallenge`/`tickChallengeFloor` dups |
| 126 | S3 | CONFIRMED | S3 | Conf | — | challenges/balance | `useDeityStore:312-318` | AUD-091 | — | — | — | rewards split STR/END/AGI/PER only |
| 127 | Info | POSITIVE | Info | Conf | — | challenges | `issueChallenge`←`familia:236`; `recordChallengeEvent`←room/combat/floor | refutes PROGRESS 2.4; resolves 095(a) | **F** | — | — | God-Challenges fully wired |
| 128 | S3 | CONFIRMED | S3 | Conf | — | deity | `useDeityStore:474,479` | ×182 (deprecated helper) | — | — | — | dead self-call + `@deprecated calculateBlessingPower` |
| 129 | S3 | CONFIRMED | S3 | Conf | — | deity | `useDeityStore:303-338` | — | — | — | — | completeChallenge triple re-read fragility |
| 130 | S2 | CONFIRMED | S2 | Conf | P11 | achievements | `useAchievementStore:106,152` | true shape of seed 031; sharpened →326 | — | — | #12 | hidden achievements accrue 0 progress; no retroactive credit |
| 131 | S3 | CONFIRMED | S3 | Conf | — | achievements | `useAchievementStore:119,165` | — | — | — | — | max-set vs additive — caller must pair correctly |
| 132 | S3 | CONFIRMED | S3 | Conf | — | perf | `useAchievementStore:103,149` | ×101 (twin O(770), §1F) | — | — | — | O(123) scan per combat event |
| 133 | S3 | CONFIRMED | S3 | Conf | — | achievements/balance | `useAchievementStore:284-337` | AUD-041; dead dup in `Achievement.ts` (W1-T5) | — | — | — | GLORY ×1.25/1.5 fires on ANY 2/3 selections (simplified vs design) |
| 134 | Info | POSITIVE | Info | Conf | — | achievements | discovery fns + `checkReputationDiscovery`←`useShopStore:544` | refutes PROGRESS 2.3 + AUD-040 | **F** | — | — | Discovery system implemented; tier casing consistent; self-merging progress init |
| 135 | S3 | CONFIRMED | S3 | Conf | — | jobs | `useJobStore:55-84,86-109` | re-entry surface per 262 | — | — | — | no idempotency guard → double bonus + dup skill |
| 136 | Info | POSITIVE | Info | Conf | — | jobs | `useJobStore:63-71` | AUD-052 FIXED | F-cand | — | — | typed Skill; clean store |
| 137 | S3 | CONFIRMED | S3 | Conf | P7 | game/meta | `useGameStore:242-259,367-374` | refutes AUD-086; conf 290 | — | — | #15 | dead deity-unlock layer (0 callers); parallel achievement-unlock likely dead too |
| 138 | S2 | CONFIRMED | S2 | Conf | — | combat/safety | `useGameStore:92,106,175,185` + `useCombatStore:309` | ×058; 265 (protection upstream) | — | — | ⚠none | first-combat protection meta-keyed → only the first-ever character. ⚠ Phase-E gap |
| 139 | S3 | CONFIRMED | S3 | Conf | — | game/stats | `useGameStore:216` | — | — | — | — | totalDeaths counts victory/abandon as deaths |
| 140 | S3 | CONFIRMED | S3 | Conf | — | hygiene | `stores/index.ts` | AUD-100; mirrors 217 | — | — | — | barrel omits 5 of 15 stores |
| 141 | S3 | CONFIRMED | S3 | Conf | — | persistence | `useGameStore:386-389` | class 073 | — | — | — | settings replace-wholesale on hydration — new fields undefined |
| 142 | Info | POSITIVE | Info | Conf | — | game/meta | `useGameStore:339-348` | resolves 096; ×105 | **F** | — | — | meta correctly survives permadeath; denatus init wired |
| 143 | S3 | CONFIRMED | S3 | Conf | — | audio | `useSoundStore:432,446-465,485,493-498,609` | REFUTES 007/XC-2/docs | **F** (system) | — | #19 | audio REAL (53 mp3s verified); defect = stale "Would play" logs + doc drift |
| 144 | S2 | CONFIRMED | S2 | Conf | P3 | audio/settings | `useSoundStore:281-285,379-395` vs `useGameStore:28-29` | supersedes 015; conf 293 | — | — | #18 | live volumes non-persisted (0–1) vs persisted settings (0–100) |
| 145 | S3 | CONFIRMED | S3 | Conf | — | audio/types | `useSoundStore:455-456` | — | — | — | — | `(player as any).addListener` |
| 146 | S3 | CONFIRMED | S3 | Conf | — | audio/content | `useSoundStore:213,224,229-235` | — | — | — | — | 7 placeholder BGM tracks (town + 6 blessing domains) |
| 147 | Info | POSITIVE | Info | Conf | — | audio | `useSoundStore` | — | **F** | — | — | defensive engine: try/catch wraps, cleanup, crossfade guard, correctly non-persisted |

### Rows 148–219 (Unit A4 — types.md: Stats/Character · Monster/Dungeon · Behavement/Deity · Weapon/StatusEffect/Armor · Achievement/Skill/Job/Loot/Consumable · Shop/Sacred/Blacksmith/Snapshot/index)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 148 | S3 | CONFIRMED | S3 | Conf | P7 | stats/dead | `Stats.ts:217-219,229,297` | knip-conf (354); AUD-021 | — | — | #15 | `applySoftCap` dead; "soft-capped" comment false |
| 149 | S3 | CONFIRMED | S3 | Conf | P2 | stats/copy | `Stats.ts:55,80,88` | conf 275 (displayed) | — | — | — | STAT_INFO promises party/spell-slots/carry that don't exist |
| 150 | S2 | CONFIRMED | S2 | Conf | P8 | stats/grades | `Stats.ts:13-26,129-131` | conf seed 018; ×068 | — | — | — | A→SSS = 199 pts vs I→A = 800; grades near-cosmetic (linear effStat) |
| 151 | S2 | CONFIRMED | S2 | Conf | P3/P8 | balance/constants | `Stats.ts:332-416` | conf seed 003; →360 | — | — | #6 | exact 10× drift (0.008 vs 0.08); single-source law broken |
| 152 | S2 | CONFIRMED | S2 | Conf | P8 | stats/cap | `Stats.ts:353,356-359,316` | conf seed 019; ×077 | — | — | — | output cap physical-only; magic/luck uncapped |
| 153 | S2 | LATENT | S2 | Conf | — | weapons/hybrid | `Stats.ts:341-358` | latent via 312 (routing never engages) | — | — | — | hybrid halves would scale off STR/INT regardless of declared stats |
| 154 | S3 | CONFIRMED | S3 | Conf | P7 | growth | `Stats.ts:180-183` | dead half of 068 | — | — | — | the only escalating-cost curve, sitting dead |
| 155 | S4 | CONFIRMED | S4 | Conf | — | stats/dead | `Stats.ts:390,451` | ⚠ §4 says S3 (OBS-8) | — | — | — | `battleCryBonus` constant 0, still returned |
| 156 | S2 | CONFIRMED | S2 | Conf | P2 | char-creation | `Character.ts:38,293-307` | conf seed 041; ext 289 (deity too) | — | — | — | backstory `statPenalty` pure no-op — all-upside |
| 157 | S2 | CONFIRMED | S2 | Conf | — | char-creation | `Character.ts:39,81,105` | conf seed 041; conf 290 (half-dead) | — | — | — | `deityAffinity` 'divine'/'fate' ∉ 14 domains — never matches. ⚠ §4 says S3 |
| 158 | S2 | CONFIRMED | S2 | Conf | P1 | status | `Character.ts:111-130,214` | Character side of 190 | — | — | #11 | persisted status model ≠ combat model; consumables push a 3rd shape |
| 159 | S3 | CONFIRMED | S3 | Conf | P7 | inventory/dead | `Stats.ts:174,433-435` | knip-conf (354); AUD-029 | — | — | #15 | `getCarryCapacity` dead (flat BAG_CAPACITY 20 everywhere) |
| 160 | S3 | CONFIRMED | S3 | Conf | — | stats/dead | `Stats.ts:190,404` | — | — | — | — | `allStatsAtD` stored flag never read (gate computed live) |
| 161 | Info | POSITIVE | Info | Conf | — | stats | `Stats.ts:129-131,195,397-414` | closes AUD-019/030 | **F** | — | — | Falna formula + carry model sound; canLevelUp matches docs |
| 162 | S2 | SUPERSEDED | S2 | Conf | P8 | balance/scaling | `Monster.ts:254-319,474-499` | →**303** (sim: wall ~15, not 86) | — | Phase-B: re-run sim | #1 | structural mechanism confirmed; magnitude corrected by execution |
| 163 | S2 | LATENT | S2 | Conf | — | rewards | `Monster.ts:388,466` + `useCombatStore:1519` | 302 (no baseCR:0) · 319 (bosses N/A) | — | — | — | clamp guards finalCR, not the divisor — guard anyway |
| 164 | S3 | CONFIRMED | S3 | Conf | P7 | monster/dead | `Monster.ts:463-468` | knip-conf (354) | — | — | #15 | orphan `calculateGoldDrop` dups combat's inline math. ⚠ header is inline (OBS-9) |
| 165 | S3 | REVISED | S3 | Conf | — | monster/data | `Monster.ts:102` | →222 (LIVE: →proficiency) ⚠ vs 300 "vestigial" — OBS-10 | — | Phase-B grep | — | resolve the 222-vs-300 contradiction before any deletion |
| 166 | S3 | CONFIRMED | S3 | Conf | P4 | monster/types | `Monster.ts:107` | conf seed 038; ×203 | — | — | #5 | `category: string` where `MonsterCategory` union exists |
| 167 | S2 | CONFIRMED | S2 | Conf | P1 | status/CR | `Monster.ts:8,66,346-356,365` | exact combat consequence of 190 | — | — | #11 | fear/silence/paralysis weight=0; weaken/slow weights dead |
| 168 | S3 | SUPERSEDED | S3 | Conf | P3 | monster/suffix | `Monster.ts:180-188,538-541` | →**309** (doubly dead: 0 callers + key mismatch) | — | — | — | aspirational guard of a never-firing mechanism |
| 169 | S3 | CONFIRMED | S3 | Conf | P7 | monster | `Monster.ts:114-124` | ✅ B2 grep 2026-06-10: definition-only, 0 `.abilities` readers | D | ✅ AT-HEAD | #15 | `MonsterAbility` dead surface. ⚠ §4 mis-maps this ID to biomes |
| 170 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon/biomes | `Dungeon.ts:24-34,262` | conf seed 022; ×299 (field) ×362 (colors) | — | — | #15 | void/labyrinth never generate; dreamscape color-only |
| 171 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon/dead | `Dungeon.ts:193-198` | conf seed 021; pairs 085 | — | — | #15 | dead NODES_PER_FLOOR_* consts; "45 rooms" doc stale |
| 172 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon/dead | `Dungeon.ts:18,69-72,209,329,348` | pairs 083; quantified 245 | — | — | #15 | full dead `shop` node surface (type/data/icon/name) |
| 173 | S3 | CONFIRMED | S3 | Conf | — | balance/brackets | `Dungeon:224-232` vs `Monster:223-236` vs `ZONE_NAMES` | AUD-070 | — | — | — | three misaligned floor-bracket schemes → difficulty steps |
| 174 | S3 | CONFIRMED | S3 | Conf | — | dungeon/dup | `Dungeon:405-415` vs `Monster:418-431` | AUD-048; +floor<1 unguarded (harmless) | — | — | — | duplicate danger fns, divergent labels |
| 175 | Info | CONFIRMED | Info | Conf | — | dungeon | `Dungeon.ts:418-427` | irony vs 080 (forward-only helper unused) | — | — | — | `getAdjacentNodes` unused for nav; `combatData.monster` always null |
| 176 | S2 | CONFIRMED | S2 | Conf | — | paragon | `Behavement:93-122,293-298` | proves 011 (13/28 exact list) | — | — | #9 | sort-vs-keys mismatch; STR_END masks the bug for STR/END builds |
| 177 | S2 | REFINED | S2 | Conf | P1 | paragon/passives | `Behavement:158-217` vs `useCharacterStore:1350-82` | part-refuted 223 (gold_bonus screen-side); ✅ B2: the other 4 types CONFIRMED DEAD (defs-only grep 2026-06-10) | B | ✅ AT-HEAD | #4 | final shape: 1 screen-wired + 4 dead (all moot behind 259) |
| 178 | S3 | CONFIRMED | S3 | Conf | P11 | paragon | `Behavement:70-81,256-268` | conf seed 020; example undercut by 244; re-proven via 326/332 | — | — | #9 | Mythic=100 impossible; Legendary 98-99 likely too |
| 179 | S3 | CONFIRMED | S3 | Conf | — | paragon | `Behavement:303-351,381-420` | ×093 (bias) ×261 (caller) | — | — | #9 | tie-default COMBAT_PHYSICAL + Math.random noun — no determinism/agency |
| 180 | S2 | CONFIRMED | S2 | Conf | P3 | deity/favor | `Deity:252-275` vs `useDeityStore:25-33` | ×121/122; "always 1.0×" softened by 242 | — | — | #11 | two divergent tables on every axis; live=FAVOR_TIERS. ⚠ §4 says S3 |
| 181 | S2 | CONFIRMED | S2 | Likely | P1 | deity/blessings | `Deity:185-207,131-135` | W2 verify not explicitly discharged | — | Phase-B sample | #4 | domain blessings ("+10% physical") display-only |
| 182 | S3 | CONFIRMED | S3 | Conf | — | deity/dead | `Deity:312-319` | pairs 128 (the caller) | — | — | — | `@deprecated calculateBlessingPower` still consumed |
| 183 | S3 | CONFIRMED | S3 | Conf | — | deity | `Deity:338-380` | AUD-042-adj | — | — | — | opposition map 4/14 domains; `'refused'` never produced |
| 184 | Info | POSITIVE | Info | Conf | — | pantheons | `Deity.ts` (PantheonId×19) | feeds 350 (docs stale) | **F** | — | — | type layer enumerates all 19 incl. maya/inca; FAVOR_TIERS well-designed |
| 185 | S2 | SUPERSEDED | moot | Conf | P4 | weapons/hybrid | `Weapon.ts:12-29` | conf seed 040; →312 (moot; type-debt real) | — | — | #5 | CHA_INT≠INT_CHA + dead INT_PER/WIS_PER/WIS_LCK set entries |
| 186 | S2 | CONFIRMED | S2 | Conf | — | combat/triangle | `Weapon.ts:269` | pairs 051; data side 298 (53% immune) | — | — | — | hard 0× poison vs bone/armor/spirit = softlock. ⚠ §4 mis-maps to 189 |
| 187 | S2 | CONFIRMED | S2 | Conf | P4 | combat/types | `Weapon.ts:256-258` | pairs 054 (the as-any bridge) | — | — | #5 | triangle table 6 armor types vs union's 9 |
| 188 | S2 | CONFIRMED | S2 | Conf | P1 | weapons/enchant | `Weapon.ts:118-142` | conf at screens (W2-P5) | — | — | #4 | enchantment effects generated + displayed, never read by combat |
| 189 | S3 | CONFIRMED | S3 | Conf | — | weapons/types | `Weapon.ts:44-54` | AUD-061; ×045/206/344 | — | — | — | no `'chaos'` in DamageType yet sacred references it |
| 190 | S1 | CONFIRMED | **S1** | Conf | P1 | combat/status | `StatusEffect.ts:9-19` vs `Character.ts:111-121` | supersedes seed 039; manifests 052/066/115/158/167/191/240/301/341 | — | Phase-B: diff 3 vocabularies | #4/#11 | THREE incompatible models; 7/10 ids overlap |
| 191 | S2 | CONFIRMED | S2 | Conf | P1 | combat/status | `StatusEffect.ts:34-38,84-88,133-157` vs `useCombatStore:502` | child of 190 | — | — | #4 | `statModifier` dead → `slow` fully inert |
| 192 | S2 | CONFIRMED | **S2** | Conf | P1 | combat/healing | `StatusEffect.ts:244` | ✅ B2 grep 2026-06-10: definition-only, 0 callers | B | ✅ AT-HEAD | #4 | `getHealingModifier` DEAD → curse preventsHealing + burn reducesHealing inert — new resolver-column member |
| 193 | S2 | CONFIRMED | S2 | Conf | P1 | armor | `Armor.ts:15-53,167-179` vs `Stats.ts:362` | residual-real per 281 | — | — | #4 | speed/dodge penalties dead — weight-class tradeoff half-dead |
| 194 | S2 | CONFIRMED | S2 | Conf | P1 | accessories | `Armor.ts:92-103` vs `sacredItemConversion:184-189` | — | — | — | #4 | only `stat_boost` applies; resistance/regen/bonus_damage/special dead |
| 195 | Info | POSITIVE | Info | Conf | — | armor | `Armor.ts:9,118-162` | refutes own 047 (R1) | **F** | — | — | 4 slots complete; armor defense math live; triangle table sensible |
| 196 | S2 | CONFIRMED | S2 | Conf | P11 | achievements | `Achievement.ts:16-37` | quantified →325 (20/123; all 11 dead types used) | — | — | #12 | ~11 of 21 RequirementTypes never fired |
| 197 | S3 | CONFIRMED | S3 | Conf | P7 | achievements/dead | `Achievement.ts:195-275` | dead dup of 133's live stacking | — | — | #15 | orphan utils incl. `getTierSynergyBonus` |
| 198 | S3 | CONFIRMED | S3 | Conf | — | discovery | `Achievement.ts:152-163` vs `useAchievementStore:420-438` | conf 278 (single SHOP rep) | — | — | — | per-source rep gates collapse to one track |
| 199 | S2 | CONFIRMED | S2 | Conf | P1 | skills | `Skill.ts:9-22` vs `useCombatStore:934-1071` | refined 342 (dead set exact; impact = 336) | — | — | #4 | `damage_percent`/`buff`/`flee` unhandled |
| 200 | S3 | CONFIRMED | S3 | Conf | — | skills/balance | `Skill.ts:127` | — | — | — | — | flat `def*0.3` vs ratio model — skills crushed by high defense |
| 201 | S3 | CONFIRMED | S3 | Conf | — | skills/types | `Skill.ts:86-90` vs `Character.ts:133-141` | AUD-052-adj | — | — | — | two LearnedSkill shapes; `createLearnedSkill` orphan |
| 202 | S3 | REFUTED | — | Conf | — | jobs | `Job.ts:38-40` | by **338** (sorts both sides) | — | — | — | sort-trap doesn't hold; sparse-specs residual lives at 338 |
| 203 | S3 | CONFIRMED | S3 | Conf | P4 | loot/types | `Loot.ts:9-17` vs `Monster.ts:107` | ×166; xp clause revised by 222 | — | — | #5 | canonical union exists, unused; LootResult.xp see OBS-10 |
| 204 | S2 | LATENT | S2 | Conf | P1 | consumables | `Consumable.ts:20-21` | →342 (no consumable uses reveal/identify) | — | — | #4 | handlers missing but currently zero data exercises them |
| 205 | Info | REFINED | Info | Conf | — | economy | `Consumable.ts:57-58` | closes AUD-062; revised 283 (screen inline formula) | — | — | — | single-path pricing at type level; screen drift found later |
| 206 | S3 | CONFIRMED | S3 | Conf | P4 | sacred/types | `SacredItem.ts:102` | quantified 344 (107/245); ⚠ its "triangle unimplemented" aside contradicts 067/186 | — | — | #5 | `'physical'`/`'chaos'` ∉ canonical DamageType; latent-S2 once triangle matters |
| 207 | S2 | CONFIRMED | S2 | Conf | P1 | sacred | `SacredItem.ts:29-91` | feeds 099/343; nuance 345 (targetType dropped) | — | — | #10 | 50 metrics × 4 scopes — catalog ≫ evaluator |
| 208 | S2 | CONFIRMED | S2 | Conf | P1 | sacred/reveal | `SacredItem.ts:139` | feeds 099/343; partial refute 273 (a reveal UI exists); ×270 | — | — | #10 | `revealFavorRequired` read by 0 stores; favor never hits 100 |
| 209 | S4 | CONFIRMED | S4 | Conf | P4 | sacred/types | `SacredItem.ts:151-154` | — | — | — | — | non-discriminated stats triple |
| 210 | S3 | CONFIRMED | S3 | Conf | P1 | sacred/passives | `SacredItem.ts:148-149,159-164` | confirmed by 343 (all 588 decorative) | — | — | #4/#10 | `passiveId` has no resolver anywhere |
| 211 | S2 | REFINED | S2 | Conf | P1 | blacksmith/durability | `Blacksmith.ts:103-117` + `Weapon.ts:163` | revised by 286 (screen = live salvage) | — | — | #4 | durability MODEL inert (0 reads/writes); repair service nonexistent |
| 212 | S4 | CONFIRMED | S4 | Conf | — | blacksmith | `Blacksmith.ts:24,54,64,75` | — | — | — | — | `questRequired` dead (no quest system) |
| 213 | Info | POSITIVE | Info | Conf | — | data-integrity | `Blacksmith.ts:38-74` ↔ `materials.ts` | re-conf 339/340 (loot-materials nuance separate) | **F** | — | — | upgrade-material refint PASS; price tables match tiers |
| 214 | S3 | CONFIRMED | S3 | Conf | P3 | blacksmith/content | `Blacksmith.ts:129-155` ↔ `Shop.ts:189-196` | — | — | — | — | one NPC, three greeting/identity sources, mismatched ids |
| 215 | S3 | REFINED | S3 | Conf | — | boss/favor | `PlayerSnapshot.ts:135-137` | revised by 266 via 242 (varies now); 3rd favor scheme (×180) | — | — | #11 | favor-sense was constant only while 121 held |
| 216 | S3 | CONFIRMED | S3 | Conf | — | boss/types | `PlayerSnapshot.ts:64,140-141` | — | — | — | — | redundant flags + "reached" vs DEFEATED semantics |
| 217 | S3 | CONFIRMED | S3 | Conf | P7 | types/dead | `types/index.ts:1-22` | knip-conf (354); mirrors 140 | — | — | #15 | 0-importer barrel, re-exports 9/18 |
| 218 | S4 | CONFIRMED | S4 | Conf | P4/P5 | boss/types | `PlayerSnapshot.ts:84-92` + `floor.tsx:415` | conf 257; raw-points secondary (P5 class) | — | — | #5/#17 | `as unknown as` contract bypass; archetype map SOUND (refuted own hypothesis) |
| 219 | S4 | REFINED | S4 | Conf | — | shop/pricing | `Shop.ts:6,61-144` | by 283 (haggle display=charge for buys) | — | — | — | pricing split across layers; CHA haggle screen-only |

### Rows 220–263 (Unit A5 — screens.md part 1: combat.tsx both halves · room · floor · ceremonies)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 220 | S2 | CONFIRMED | S2 | Conf | — | soul/combat | `combat.tsx` (12 firing clusters) | confirms 093 per-event; +explore_rooms inflated per kill | — | — | — | every combat behavement fires store+screen = 2× |
| 221 | S2 | CONFIRMED | S2 | Conf | — | soul/combat | `combat.tsx:457,500` | ⚠ §4 mislabels this ID (OBS-8) | — | — | — | magic kills advance `phys_consecutive_kills`; no magic streak exists |
| 222 | S2 | CONFIRMED | S2 | Conf | — | growth | `combat.tsx:1019-1024,1236` | REVISES 055/165/203 (xp LIVE); ⚠ vs 300 (OBS-10) | — | — | — | kill-xp→proficiency is physical-only (INT/WIS/CHA/LCK get 0) + flat path (068) |
| 223 | S3 | CONFIRMED | S3 | Conf | — | paragon | `combat.tsx:998-1002` | partially refutes 177 | — | — | — | `gold_bonus` applied screen-side — passives inconsistently wired |
| 224 | S2 | CONFIRMED | S2 | Conf | P1 | combat/items | `combat.tsx:369-414` | confirms 057/116/204 combat path | — | — | #4 | no buff/reveal/identify branch in `runUseItem` |
| 225 | S4 | POSITIVE | S4 | Conf | — | combat/blessing | `combat.tsx:138-139` | REFUTES 024 | **F** | — | — | blessed selector aliased; only dead import remains |
| 226 | S3 | CONFIRMED | S3 | Conf | P10 | combat/rewards | `combat.tsx:991-1158` | settles 056 (safe-but-fragile) | — | — | — | no rewards snapshot — future-proofing gap |
| 227 | S2 | CONFIRMED | S2 | Conf | P6 | permadeath | `combat.tsx:1386-1414,1161-1196` | ×069/002; named in #8 | — | — | #8 | death committed only on "Accept Fate" tap → force-close zombie |
| 228 | S3 | CONFIRMED | S3 | Conf | — | inventory/registry | `combat.tsx:977-986` | ×118 | — | — | — | latent weapon-id divergence on Add to Bag |
| 229 | S3 | CONFIRMED | S3 | Conf | P9 | balance/literals | `combat.tsx:271,316,341,778,803,1086` | class 063/247 | — | — | — | bucket-E lint candidate |
| 230 | S2 | CONFIRMED | S2 | Conf | — | perf | `combat.tsx:99-141` | ×033/356/238 | — | — | — | unselected full-store subscriptions on a 3,100-line screen |
| 231 | S3 | LATENT | S3 (→S1 if self-damage) | Conf | — | combat/death | `combat.tsx:144-148` | — | — | — | — | kill-and-die resolves to DEFEAT, voiding the win |
| 232 | S3 | CONFIRMED | S3 | Conf | — | soul/floors | `combat.tsx:1054-1069` | confirmed by 253 | — | — | — | 4 per-floor-conduct behavements fire only on boss kills |
| 233 | Info | POSITIVE | Info | Conf | — | combat | `combat.tsx` | — | **F** | — | — | DoT-death pre-compute, registerWeapon on all pickups, epitaph snapshot, native crit-flash |
| 234 | S2 | CONFIRMED | S2 | Conf | P6 | combat/flee | `combat.tsx:1828-1863` | exploitable via 264; compounds 080 | — | — | #8adj | retreat modal = buggy parallel flee; no 'fled' render state; node un-avoided |
| 235 | S3 | CONFIRMED | S3 | Conf | P3 | combat/log | `combat.tsx:1472` | refines 064 | — | — | — | display 5 vs store 20 vs doc 8 |
| 236 | S3 | CONFIRMED | S3 | Conf | P9 | design/colors | `combat.tsx:2052,2621,2701-2730,3033-3089` | 035 class; ×358/362/368 | — | — | #18 | bespoke retreat-modal palette + `#00BFFF` teal |
| 237 | S3 | CONFIRMED | S3 | Conf | P7 | dead styles | `combat.tsx:1897-2152,2618,2655,2780-2799` | named in #15 | — | — | #15 | ~50-entry dead-style museum (~⅓ of the sheet) |
| 238 | S3 | CONFIRMED | S3 | Conf | — | perf | `combat.tsx:1652-1668` | pairs 230/356 | — | — | — | inline closures + per-render array in BONUS row |
| 239 | S3 | CONFIRMED | S3 | Conf | P5 | skills/scaling | `combat.tsx:722,1778` + `Skill.ts:117-131` | ✅ B2 read 2026-06-10: formula tuned FOR raw 0-999 | B | ✅ AT-HEAD | #17adj | incompatible-scales branch confirmed; skills ≠ effStat economy; flat def*0.3 (200) at `:127` |
| 240 | S3 | LATENT | S3 | Conf | P10 | combat/status | `combat.tsx:1524,1527-1528` | armed via 190 | — | — | — | `'undefined30'` badge color on unknown effect type |
| 241 | Info | POSITIVE | Info | Conf | — | combat/render | `combat.tsx` | — | **F** | — | — | FlatList modals, keyed badges, gated hint overlay, canUseSkill gating |
| 242 | S2 | CONFIRMED | S2 | Conf | P1/P3 | deity/favor | `room.tsx:71,497-498` | ★ DOWNGRADES 121; completed by 270 | — | — | #11 | shrine updates both favor stores; events/challenges only `relationship.favor` |
| 243 | S2 | CONFIRMED | S2 | Conf | P10 | shrine | `room.tsx:432-440` | BUG-042 "fix" broken | — | — | — | Capitalized-vs-lowercase: `'opposed'` unreachable |
| 244 | S3 | CONFIRMED | S3 | Conf | — | soul/reachability | `room.tsx:763-777` | revises 095/178 (R1 self-correction of S21 note) | — | — | — | `explore_secret_rooms` fires on every mystery reveal |
| 245 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon/shop | `room.tsx:126-132,802-822,1322-1358` | quantifies 083/172 | — | — | #15 | ~180-LOC complete dead dungeon-shop feature |
| 246 | S2 | CONFIRMED | S2 | Conf | P6 | dungeon/farming | `room.tsx:7,134-150,288,1566` | compounds 080; exploitable via 264; named in #8 | — | — | #8 | reward banked on action, node completed on Continue → re-farm; no BackHandler |
| 247 | S3 | CONFIRMED | S3 | Conf | P9 | balance+colors | `room.tsx:54-64,207-214,278,357,466,475-481,699,709-743` | class 063/229/255 | — | — | — | entire shrine matrix + trap/rest/treasure numbers inline |
| 248 | S3 | CONFIRMED | S3 | Conf | — | shrine/permadeath | `room.tsx:465-467` | ×069/227 | — | — | — | blood offering can kill with no death flow |
| 249 | S3 | CONFIRMED | S3 | Conf | P7 | dungeon/mystery | `room.tsx:789-798,1172-1205,1478-1488` | ✅ B2 grep 2026-06-10: `actualType` ← `selectMysteryRevealType` only (`useDungeonStore:85-87`) | D | ✅ AT-HEAD | #15adj | combat/elite/rest mystery branches are DEAD (generator emits 3 types, screen handles 6) |
| 250 | Info | POSITIVE | Info | Conf | — | room | `room.tsx` | BUG-036 fixed; 127/134 confirmed | **F** | — | — | shrine favor dual-write (the 242 evidence); satiation model coherent |
| 251 | S2 | CONFIRMED | S2 | Conf | P6 | dungeon/farming | `floor.tsx:106,232-234,272-303,715-719,840-850` | screen half of 080/081 | — | — | #7 | backward GO badges + "Go Here" tooltip; no forward-only filter |
| 252 | S2 | CONFIRMED | S2 | Conf | — | dungeon/gen | `floor.tsx:368-385` | confirms 082 | — | — | #7 | ascend Alert: "A new path will be generated" — fresh-content farm |
| 253 | S3 | CONFIRMED | S3 | Conf | — | soul/floors | `floor.tsx:305-335` | confirms 232 | — | — | — | handleDescend skips per-floor-conduct evaluation |
| 254 | S3 | CONFIRMED | S3 | Conf | P6 | nav/permadeath | `floor.tsx:794-796,293-295` | cluster 264; ×069 | — | — | #8adj | mid-run Menu→title without endRun; famine step-damage death unguarded |
| 255 | S3 | CONFIRMED | S3 | Conf | P9 | design/colors | `floor.tsx:34-73` + styles | the recurring "second palette"; dead-biome gradients (170) | — | — | #18 | |
| 256 | S3 | CONFIRMED | S3 | Conf | — | perf | `floor.tsx:559-726,1122-1175` | pairs 230/238 | — | — | — | per-render trig + closures under full-store subscriptions; dead styles |
| 257 | Info | POSITIVE | Info | Conf | — | dungeon/market | `floor.tsx:312,415` | DISCHARGES 086; confirms 218/026 | **F** | — | — | enterFloor descend-gated |
| 258 | Info | POSITIVE | Info | Conf | — | dungeon/boss | `floor.tsx:139-148,324-326,396-431` | BUG-023 fixed; 127/134 | **F** | — | — | boss-cleared reachable; challenge HUD wired |
| 259 | S1 | CONFIRMED | **S1** | Conf | P7 | denatus/paragon | `level-up.tsx` (whole) · `denatus.tsx` (whole) · `ascension.tsx:194-210` | feeds 260/261; corroborated 271/296/332 | — | Phase-B: route-graph | #9 | L10 climax unreachable → `paragonTitle` ALWAYS null → whole Paragon layer dead |
| 260 | S2 | CONFIRMED | S2 | Conf | P7 | dead screens | `level-up.tsx` (855 LOC) | feeds 259; confirms 009/027/133-in-dead-code | — | — | #9/#14 | pre-adjudicated: route DIES, Denatus logic re-homes (E7) |
| 261 | S2 | LATENT | S2 | Conf | P5 | denatus | `denatus.tsx:89-93,110-127,152-162` | behind 259; confirms 097/179; raw-points class (#17) | — | — | #9 | wrong top-stats, mount-vs-finish strand, recordParagon never called |
| 262 | S3 | CONFIRMED | S3 | Conf | P7 | jobs/routes | `job-select.tsx` + `ascension.tsx:200-204` | mitigates 135 (screen guards) | — | — | — | base-mode dead, spec-mode live; ceremonies inconsistent on stat ranking |
| 263 | Info | POSITIVE | Info | Conf | — | ceremonies | `ascension.tsx`; `job-select.tsx` | — | **F** | — | — | live ceremony careful: BackHandler, favor-tiered dialogue, effStat ranking |

### Rows 264–297 (Unit A6 — screens.md part 2: dungeon bundle · familia · town hub · guildhall/shops · blacksmith · creation · framing)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 264 | S2 | CONFIRMED | S2 | Conf | P6 | nav-integrity ROOT | `dungeon/_layout.tsx:24-37` | makes 234/246/254/277 exploitable on iOS | — | — | #8 | no `gestureEnabled:false` anywhere; cheapest single cluster fix |
| 265 | S2 | CONFIRMED | S2 | Conf | — | boss/combat | `boss-encounter.tsx:201-208` + `floor.tsx:421` | ×316 (mechanic twin); masks missing boss generation | — | — | — | FIGHT → null monster → room→encounter detour |
| 266 | Info | REFINED | Info | Conf | — | boss/achievements | `boss-encounter.tsx:142-199` | BUG-022/034 resolved; revises 215; **revised by 321** (5 deep ids dangle) | F-cand | — | — | wired for floors 5–60; breaks 65–100 |
| 267 | S3 | REFINED | S3 | Conf | — | inventory/dungeon | `inventory.tsx:107-116,200-208,74-76,394-401` | reframed by 281 (placeholder STALE) | — | — | — | cosmetic cures (no removeStatusEffect) + display-only enchants stand |
| 268 | S3 | CONFIRMED | S3 | Conf | — | entry/exit screens | `encounter:84,121` · `boss-cleared:29` · `boss-encounter:54` · `travel:104` · `epitaph:189` | 058 dead ✓; travel drops ramification status (→341); fontFamily:undefined (→357) | — | — | — | navigate-during-render; travel modifyHP death unguarded |
| 269 | Info | POSITIVE | Info | Conf | — | dungeon bundle | `encounter`/`travel`/`boss-cleared`/`epitaph` | BUG-021/023 ✓ | **F** | — | — | boss conversation system = strong content |
| 270 | S2 | CONFIRMED | S2 | Conf | P1/P3 | deity/favor | grep `town/familia/*` + `blessing-rite:186` | ★ completes 242; refutes 122-display worry | — | — | #11 | favor→power is shrine-ONLY; whole patron loop power-inert (near-S1) |
| 271 | S3 | CONFIRMED | S3 | Conf | P2 | ascension | `ascension.tsx:278` | reinforces 259 | — | — | #9adj | hardcoded "LEVEL 2" at every level; no L10 phase |
| 272 | S3 | CONFIRMED | S3 | Conf | — | blessing-rite | `blessing-rite.tsx:92-100,202,52-56,517` | 068 manifests here | — | — | — | dead newValue; phantom DOMAIN_GLYPH domains; formula copy omits carry |
| 273 | Info | POSITIVE | Info | Conf | — | familia | `familia/index.tsx:113-164,233-269` | conf 127; partial 208 refute (reveal UI exists) | **F** | — | — | eviction Option C wired; primary-stat agency; strong deity voice |
| 274 | S2 | CONFIRMED | S2 | Conf | P2/P3 | character/status | `character/index.tsx:94,125` | vs 225 (combat blessed) | — | — | — | canonical Status screen shows UNBLESSED stats |
| 275 | S3 | CONFIRMED | S3 | Conf | P9 | character/display | `character/index.tsx:26-39,304` | confirms 149 player-visible | — | — | #18 | phantom combatEffect + 2nd grade-color palette |
| 276 | S3 | REFINED | S3 | Conf | P4 | town/inventory | `town/inventory:401,407,446` | corrected by 281 (slots fillable); casts stand (026) | — | — | #5 | "phantom slots" withdrawn; 3 `as any` remain |
| 277 | S3 | CONFIRMED | S3 | Conf | P6 | town/nav | `town/_layout` + `town/index:73,93-101,294` | BUG-013; ×254 (resumes dangling run) | — | — | #8adj | positive: permadeath warnings before entry |
| 278 | Info | REFINED | Info | Conf | — | guildhall | `guildhall:80-140,283,350-474` | conf 134/111; BUG-037/030 ✓; defect = 198 single SHOP-rep track | F-cand | — | — | discovery renders all 4 states |
| 279 | S3 | CONFIRMED | S3 | Conf | P5 | guildhall/gate | `guildhall:288-313` | 5th raw-points site; rubber-stamp deity approval (×270) | — | — | #17 | grade-blind `s.points>=500` mislabeled "Grade D" |
| 280 | S3 | CONFIRMED | S3 | Conf | P9 | colors | `guildhall:60-66` | 4th off-token palette | — | — | #18 | TIER_COLORS hex |
| 281 | S2 | CONFIRMED | S2 | Conf | — | armor (R1 ★) | `shops/equipment:99-124,400` + `town/inventory:139,256,574` | REFUTES 108; corrects 276/267 | F-cand (armor system) | — | — | armor buyable+equippable+applies; residual = 193/076/194 + stale placeholder |
| 282 | S2 | CONFIRMED | S2 | Conf | P10 | shop/economy | `shops/equipment:252-257` | confirms 113 reachable at buy site | — | — | ⚠none | guard reads the wrong cap (50 vs 20) → charged, no item |
| 283 | S3 | CONFIRMED | S3 | Conf | — | shop/sell | `shops/sell:116,127-129` + `equipment:257,306` | BUG-038✓ 105✓ 109✓; refutes 219(buys); revises 205 | — | — | — | inline weapon sell formula ≠ calculateSellPrice |
| 284 | S3 | CONFIRMED | S3 | Conf | P9 | colors | `town/inventory:34-41` + shop rarity maps | 5th+ off-token palette | — | — | #18 | |
| 285 | Info | POSITIVE | Info | Conf | — | shops | shop screens | — | **F** | — | — | buy/sell flow well-built; rep + haggle consistent |
| 286 | S3 | CONFIRMED | S3 | Conf | — | blacksmith (R1 ★) | `repair.tsx:1-4,197-227` + `index:168-175` | REVISES 211 (screen = live salvage) | **F** (salvage) | — | — | pre-adjudicated E7: misnamed-but-functional; durability model stays dead |
| 287 | S3 | CONFIRMED | S3 | Conf | — | blacksmith | `upgrade:131-132,160` + `identify:107` | confirms 119/114; MITIGATES 118 (self-heal) | — | — | — | |
| 288 | Info | POSITIVE | Info | Conf | — | blacksmith | `blacksmith/index:66,87-111` | confirms 107 (canonical rep; shop dup dead) | **F** | — | — | token-clean repColors |
| 289 | S2 | CONFIRMED | S2 | Conf | P2 | char-creation | `confirm:59-77` · `stats:57-79` · `equipment:51-57` · `deity/[pantheonId]:219` | extends 156 to deity penalty + previews | — | — | — | cost displayed, never paid — MINDSET violation |
| 290 | Info | POSITIVE | Info | Conf | — | char-creation | `confirm.tsx:71-94` | confirms 096/137/157 | **F** | — | — | atomic seal commit; picker ignores dead unlock layer |
| 291 | S3 | CONFIRMED | S3 | Conf | P7 | tutorial | `tutorial/_layout:20-22` + 4 orphan files | confirms AUD-012; knip-blind (route entries) | — | — | #14 | 1015 dead LOC; web deep-link still loads them; old 6-step numbering = smoking gun |
| 292 | S3 | CONFIRMED | S3 | Conf | — | settings/haptics | `settings/index.tsx:40,236-241` | source-confirmed by 361 | — | — | #18 | placebo toggle — local useState, never read |
| 293 | S3 | CONFIRMED | S3 | Conf | P3 | settings/volume | `settings:24-35` + `useGameStore:28-29,156-157` | confirms 144 (the dead copy named) | — | — | #18 | delete `useGameStore.musicVolume/sfxVolume` |
| 294 | Info | POSITIVE | Info | Conf | — | settings | `settings/index.tsx:64-90,272-306` | refutes 010 for production | **F** | — | — | `__DEV__`-gated dev tools; Data buttons legit |
| 295 | Info | POSITIVE | Info | Conf | — | title | `app/index.tsx:42-52,86-118,239` | resolves 009 | **F** | — | — | epitaph memoized; clearAllStores on every New Game path; stale `v0.1.0` nit |
| 296 | S3 | CONFIRMED | S3 | Conf | P7 | codex | `codex/index.tsx:19,29,58-91,144` | corroborates 259; 12-vs-14 domains | — | — | #9adj | `LEVELS=[1..9]` hides ~15 L10 achievements; 3/4 categories "Soon" stubs |
| 297 | Info | POSITIVE | Info | Conf | — | root layout | `app/_layout.tsx:9-34,39-58,71-79` | — | **F** (ErrorBoundary) | — | — | graceful crash fallback; AppState BGM pause; nits: raw hex + SafeAreaProvider doc mismatch |

### Rows 298–342 (Unit A7 — data_combat.md + data_progression.md: monsters · weapons · bosses · achievements · jobs · skills/loot/events)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 298 | S2 | CONFIRMED | S2 | Conf | — | monsters/balance | `baseMonsters.ts` (immunities ×36) | data side of 189/051/186 | — | — | — | 17 immune + 2 resist poison (~53%); overlaps the 0× armor set; no in-game signal |
| 299 | S3 | CONFIRMED | S3 | Conf | P1 | monsters/selection | `baseMonsters.ts:1193-1208` | compounds 170 (canon writes "169" — OBS-8 propagation) | — | — | — | flat uniform pick (4.4× CR swing on fl.10); `biomes` field 0 readers |
| 300 | S3 | CONFIRMED | S3 | Conf | P1 | monsters/data | `baseMonsters.ts` (`xpValue` ×36) | harmonized w/ 222 (OBS-10 ✅) | — | — | — | vestigial AS REWARD, live as proficiency feed — disposition: REPURPOSE, never delete |
| 301 | S3 | CONFIRMED | S3 | Conf | P1 | monsters/suffix | `baseMonsters.ts:1087-1137` | confirms 052/168; refined by automated pass (ids ARE valid) | — | — | #4 | suffix statusEffect dead (proc source) + 2 passives likely display-only |
| 302 | Info | POSITIVE | Info | Conf | — | monsters/data | `baseMonsters.ts` (whole) | DISCHARGES 163 (LATENT — min CR ≈0.2); lootTable refs corrected 18→**22** | **F** | — | — | healthiest content layer; deep floors 70–100 draw from ~7 monsters |
| 303 | S2 | CONFIRMED | **S2 (P0)** | Conf (sim) | P8 | balance/scaling ★ | `Monster.ts:255-318,474-499` + `Stats.ts:307-360` + `.audit_tmp/scaling_sim.js` | corrects/supersedes 162 | — | Phase-B: re-run sim | #1 | **unwinnable past ~floor 15**; monster HP ×670/atk ×770 vs player ×5; binding constraint = atk ≫ HP |
| 304 | S3 | CONFIRMED | S3 | Conf (zod) | — | monsters/data | `baseMonsters.ts:656-682` | machine-caught | — | — | — | elder_dragon: ice BOTH weakness and immunity |
| 305 | S3 | CONFIRMED | S3 | Conf (zod) | P7 | monsters/unions | `Monster.ts` unions vs usage | adj 169 (abilities still open); ×190/196 | — | — | #15 | spirit armorType, 4/9 BehaviorPatterns, 7/10 StatusEffectIds unused; regeneration triple-dead |
| 306 | S4 | CONFIRMED | S4 | Conf (zod) | — | monsters/data | `baseMonsters.ts` (10/36) | — | — | — | — | redundant resistance∩immunity copy-paste |
| 307 | S3 | CONFIRMED | S3 | Conf | P1/P7 | combat-content | `combatNarration.ts:128-172,247-263` + `useCombatStore:39-43` | knip-conf (354) | — | — | #15 | 24-line status-narration pools never shown |
| 308 | S3 | CONFIRMED | S3 | Conf (diff) | — | combat-content | `monsterArt.ts:6-252` | bounded by 303 | — | — | #14 | 12/36 monsters (CR 7–16 tier) render the same generic face |
| 309 | S3 | CONFIRMED | S3 | Conf | P3/P7 | monsters/suffix | `Monster.ts:180-188,538-541` vs suffix ids | DISCHARGES 168 (doubly dead); live gate = `minFloor` | — | — | #15 | knip-conf; gate keys ∉ suffix ids → always gate 1 |
| 310 | Info | POSITIVE | Info | Conf | — | combat-content | `monsterFlavor.ts` · `combatNarration.ts` | flavor bypassed on boss path (265) | **F** | — | — | flavor wired + key-exact; 4/6 narration helpers consumed; voice on-register |
| 311 | S2 | CONFIRMED | **S2** | Conf | P1 | weapons/loot ★ | `Weapon.ts:91` + grep 0 readers | twin of 188/210/316; writer = `sacredItemConversion:61` | — | — | #4 | `specialMechanic` dead on 111/338 incl. ALL 34 uniques — "Loot is King" hollow |
| 312 | S2 | CONFIRMED | **S2** | Conf (sim) | P1/P7 | weapons/scaling ★ | `useCharacterStore:180-191 (:184)` + data (0/338 hybrid cats) | recontextualizes 153/185/061/043 | — | — | #4 | `isHybridMixed` always false → 162 weapons' 2nd stat inert; imbued hybrids drop arcane half |
| 313 | S3 | CONFIRMED | S3 | Conf | P3 | weapons | `baseWeapons.ts:749-761` · `hybridWeapons.ts:1-7` | DISCHARGES 119 (store-only) + 206 (base clean) | — | — | — | stale "320 hybrid weapons" comment (~162 real) |
| 314 | S3 | CONFIRMED | S3 | Conf | — | weapons/balance | validator per-cat + `equipment.tsx:247` | — | — | — | — | LCK 22 vs 40/cat; `twoHanded` cosmetic (no off-hand slot) |
| 315 | Info | POSITIVE | Info | Conf | — | weapons | `baseWeapons.ts` + index | — | **F** | — | — | 0 dups/0 enum violations; pool wiring solid; outstanding weapon voice |
| 316 | S2 | CONFIRMED | **S2** | Conf | P1 | bosses/combat ★ | `milestoneBosses.ts:77-81` + `boss-encounter:232-233` + grep | twin 311/188; ×265; LIVE pre-wall (floors 5/10/15) | — | — | #4 | all 20 boss mechanics display-only — taught, then ignored by the fight |
| 317 | S3 | CONFIRMED | S3 | Conf | — | bosses/docs | `milestoneBosses.ts:894-905` + roster import | CLAUDE gap #6 STALE | — | — | #19 | all 20 floors wired/authored; 15 past the 303 wall |
| 318 | S3 | CONFIRMED | S3 | Conf | P5 | bosses/gates | 61 gates across boss files | 6th raw-points site (218/261/279 class) | — | — | #17 | grade-blind `minPoints` 50–150 gating secret outcomes |
| 319 | S3 | CONFIRMED | S3 | Conf | — | bosses | `milestoneBosses.ts:66-83` | DISCHARGES 163-for-bosses (no CR field); supports 215 revision | — | — | — | bosses = lore+conversation only; combat entity generated separately (265) |
| 320 | Info | POSITIVE | Info | Conf | — | bosses ★ | roster import + reads | BUG-022/034 refint holds 5–60 | **F** | — | — | pristine refint; strongest content asset; archetype-sensing sophisticated |
| 321 | S3 | CONFIRMED | S3 | Conf (auto) | P3 | bosses/achievements | `Floors65to100.ts` outcomes + achievements grep | REVISES 266; re-conf by 328 | — | — | #14 | 5/8 deep boss achievement ids exist nowhere → silent no-op rewards |
| 322 | S3 | CONFIRMED | S3 | Conf | — | finale (synthesis) | `Floors65to100.ts:1303-1320` | = 303×316×259×302 | — | — | — | Skaervox finale triply unreachable+unimplemented — apex of the theses |
| 323 | S4 | CONFIRMED | S4 | Conf | — | bosses/hygiene | `Floors65to100.ts:15,786,1307` | — | — | — | — | lowercase `vituna'sta`; intentional `pantheon:'—'`; ChoiceTag unimported |
| 324 | Info | POSITIVE | Info | Conf | — | bosses/voice ★ | `Floors65to100.ts:1303-1356` | — | **F** | — | — | the project's best writing (11 Laws / Aleabishal / Máalkohr) |
| 325 | S2 | CONFIRMED | S2 | Conf (sim+R1) | P1/P11 | achievements ★ | registry import + FIRED-set re-derivation | DISCHARGES/QUANTIFIES 196/031/130 | — | — | #12 | 20/123 (16%) uncompletable; all 11 dead types used; 4 STANDARD-tier visible |
| 326 | S2 | CONFIRMED | S2 | Conf | P11 | achievements ★ | 13 `'undiscovered'` entries + store grep | SHARPENS 130; compounds 178/296 | — | — | #12 | entire Mythic tier (11+2) born-hidden catch-22 |
| 327 | S3 | CONFIRMED | S3 | Conf | P1/P10 | achievements | `boss-encounter:149-188` ×6 | — | — | — | #12 | type-blind `custom`; ~8 non-boss customs only progress via bosses |
| 328 | Info | POSITIVE | Info | Conf | — | achievements | registry import | re-confirms 321 (5 absent) | **F** | — | — | 123, 0 dups; L1–3 voice excellent |
| 329 | S3 | CONFIRMED | S3 | Conf/Likely | P10/P11 | achievements/conduct | `Achievement.ts:44,174-176` + 9 entries | 3rd uncompletable vector (live types) | — | — | #12 | eq/lt vs monotonic lifetime counters; `isRequirementMet` itself correct (positive) |
| 330 | S4 | CONFIRMED | S4 | Conf | P4 | achievements | `stat_reach` in level{4,5} | — | — | — | — | value=grade-index vs stat-count conflation |
| 331 | Info | POSITIVE | Info | Conf | — | achievements | level{4,5,6} | sharper read of 325 | **F** | — | — | several dead-type achievements name UNBUILT systems (stealth; favor loop) — fossil layer |
| 332 | S3 | CONFIRMED | S3 | Conf | — | achievements/L10 (synthesis) | mythic entries | sharpens 326; = 326×303×259/316/322×178 | — | — | #12 | Mythic capstone quadruple-dead; fixing one lock leaves the others |
| 333 | S3 | CONFIRMED | S3 | Conf | P10/P1 | achievements | `Achievement.ts:174` + `custom value:0` | compounds 327/329 | — | — | #12 | "Without dying" `gte 0` always true — reusable broken idiom |
| 334 | Info | POSITIVE | Info | Conf | — | achievements ★ | level{7,8,9} | corroborates 259/296/303/326 | **F** | — | — | best voice in the system; L10 = densest dead zone; registry CLOSED |
| 335 | S2 | CONFIRMED | **S2** | Conf (sim) | P3 | jobs/coverage ★ | `jobDefinitions.ts` + `index.ts:13-16` + `ascension:297-302` | contradicts `Job.ts:4` doc | — | — | #13 | 21/56 triples covered → 63% of builds job-less at L2 (graceful fallback, no soft-lock) |
| 336 | S2 | CONFIRMED | **S2** | Conf (sim) | P1 | jobs/skills ★ | 13 jobs' `buff` starter skills + 199 | job-side of 199/057 | — | — | #13/#4 | champion/monk buff-ONLY no-ops; support archetype inert |
| 337 | S3 | CONFIRMED | S3 | Conf (auto) | P3 | jobs/ids | `jobDefinitions` ↔ `specializations` | — | — | — | — | 6 base↔spec id collisions (warlord/crusader/arcanist/enchanter/hunter/skirmisher) |
| 338 | S3 | CONFIRMED | S3 | Conf | — | jobs/specs | `index.ts:13-16` + `specializations.ts` | ★ REFUTES 202 (sorts both sides) | — | — | — | only 9/51 jobs branch to a spec |
| 339 | Info | POSITIVE | Info | Conf | — | jobs | `jobDefinitions.ts` + `ascension.tsx:138` | — | **F** | — | — | ref-safe by design (inline skills); effStat-keyed (avoids P5 class); strong voice |
| 340 | S3 | CONFIRMED | S3 | Conf (sim) | P1/P3 | loot | `baseMonsters` lootTable ×36 + `lootPools.ts:10-104` + `useCombatStore:1490-1523` | machine-caught refs; knip-conf (getMaterialsForMonster) | — | — | #15 | 2 dead layers: `lootTable` (22 refs, 0 readers) + pool materials (16/16 dangle, `hide`↔`monster_hide`) |
| 341 | S3 | CONFIRMED | S3 | Conf | P1/P10 | events/ramifications | `ramifications.ts:33-37` + `useDungeonStore:609-624` | ✅ B2 2026-06-10: data verified (`buff` + non-canonical `weapon_damage_down`); store loop applies ONLY hp/sp/gold/ration types | B | ✅ AT-HEAD | #4 | status-afflictions confirmed dropped (the store's effect loop has no status branch) |
| 342 | Info | POSITIVE | Info | Conf (R1) | — | skills/consumables/events | handler re-derivation + catalogs | REFINES 199 (exact dead set) + 204 (LATENT); discharges 213/302 | **F** | — | — | events = genuine "Meaningful Choices" win; nit: event statCheck.dc vs raw-points class — confirm in Phase B |

### Rows 343–351 + 364–367 (Unit A8 — data_items.md + data_pantheons.md: sacred relics · deities incl. the exhaustive 310-deity pass)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 343 | S1 | CONFIRMED | **S1** | Conf (sim) | P1 | sacred ★ | `src/data/items/*` + `useSacredItemStore:206-276` | QUANTIFIES 099 (stays S1, reinforced); ×208/210/270/311 | — | Phase-B: `relic_check.ts` | #10 | 244/588 (41%) unobtainable · 15 false-unlocks · 490 relics never reveal · all 588 passives decorative |
| 344 | S3 | CONFIRMED | S3 | Conf (sim) | P4 | sacred/types | `deityRelics_*.ts` weaponStats | quantifies 206 (107/245) | — | — | #5adj | `physical`/`chaos` ∉ canonical union; conversion loses chaos→dark |
| 345 | S3 | CONFIRMED | S3 | Conf | P4/P1 | sacred/acquisition | relic acquisition + `useSacredItemStore:194-255` | adj 207 | — | — | #10adj | `targetType` nuance dropped → items unlock on cruder conditions than stated |
| 346 | Info | POSITIVE | Info | Conf | — | sacred/content ★ | `deityRelics*.ts` | doc UNDERcount (245 pairs vs "168×2") | **F** | — | — | most ambitious authoring in the game; 0 dup ids; deadness = purest P1 tragedy |
| 347 | S3 | CONFIRMED | S3 | Conf (tsc) | P7/P3 | pantheons ★ | `pantheons/index.ts:16,30-69` + `maya.ts:973` + `inca.ts:1049` | ★ REFUTES seed 028; reframes CLAUDE gap #4 | — | — | #14 | complete+valid+tsc-clean, ORPHANED; pre-adjudicated WIRE (E7); stale TODO misdiagnoses |
| 348 | S3 | CONFIRMED | S3 | Conf (auto) | P3 | pantheons/ids | `allDeities` dup scan | — | — | — | — | `vayu`/`fujin`/`raijin`/`yama_no_kami` ×2 pantheons; 310 = 306 unique; getDeityById shadows |
| 349 | S3 | CONFIRMED | S3 | Conf (auto) | P3 | pantheons/relics | relic deityIds vs `allDeities` | discharges DI-deferred refint | — | — | #10 | 5 dangling = the milestone bosses (not patrons); 66/310 deities relic-less |
| 350 | S3 | CONFIRMED | S3 | Conf (sim) | P3 | docs | `pantheonInfo` vs docs | meta-pattern w/ 317/313/335-doc | — | — | #19 | 310 deities / 17 pantheons vs docs "~168 / 12" (~2×) |
| 351 | Info | POSITIVE | Info | Conf | — | pantheons | sampled greek/maya/inca | — | **F** | — | — | 0 invalid domains/stats ×310; cleanest core-axis refint in the wave |
| 364 | S3 | CONFIRMED | S3 | Conf (exhaustive) | — | pantheons/balance | `pantheons/*` statBonus | machine refint (351) couldn't see this — value-normalization | — | — | — | newer pantheons +12..+15 vs older +10 → hidden patron min-max optimum |
| 365 | S4 | CONFIRMED | S4 | Conf (exhaustive) | P3 | pantheons/content | 5 newer pantheons + omoikane | §6.3 rule: formatting-only content edit | — | — | — | ~71 loreSnippets carry embedded quotes → render `""…"` |
| 366 | S4 | CONFIRMED | S4 | Conf (auto) | P3 | pantheons/content | ability dups + Astaroth ×2 | distinct ids (not a 348-class collision) | — | — | — | 3 dup ability descriptions, 4 dup names; domain blessings shared by design |
| 367 | Info | POSITIVE | Info | Conf (★310/310) | — | pantheons ★ | all 17 files | definitive discharge of the exhaustive voice read | **F** | — | — | 0 stubs/dup-lore/placeholders/name-errors/misspellings; uniformly excellent voice |

### Rows 352–363 + 368–371 (Unit A9 — wave4.md: tool sweep · components · constants/hooks · config + the exhaustive component pass)

| ID | Sev@aud | Status | Sev-now | Conf | Pat | System | Key files | Edges | Bkt | HEAD-verify | Bklg | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 352 | S3 | CONFIRMED | S3 | Conf (exec) | P4 | build/types | `npx tsc --noEmit` → exit 0 | reinforces S0 001; blinded by the cast set (190/166/312/206/218) | — | Phase-B: re-run | #3 | FALSE GREEN — passes only because the S0 files exist on disk |
| 353 | S3 | CONFIRMED | S3 | Conf (exec) | P3 | architecture | `npx madge --circular` → 23 | inline-`require` dodges incomplete | — | Phase-B: re-run | #16 | 3 RUNTIME store cycles + 20 type-import cycles |
| 354 | S2 | CONFIRMED | S2 | Conf (exec) | P7 | dead-code ★ | `npx knip` (`.audit_tmp/knip.jsonc`, entry app/**) | VALIDATES 03 §6 (307/340/309/159/164/148/347/217) | — | Phase-B: re-run | #15 | NEW: `starterSkills.ts` (380 LOC) + 7 component orphans + 6 dead barrels; knip BLIND to dead routes (260/291 need the manual graph) |
| 355 | Info | POSITIVE | Info | Conf | — | methodology | tool sweep | — | — | — | #3 | promote knip.jsonc+madge → `audit/integration/` + CI gate |
| 356 | S3 | CONFIRMED | S3 | Conf (exec) | — | components/perf | grep ×49 | DISCHARGES 033; compounds 230/238/256 | — | — | #18adj | 0/49 React.memo; 1 useMemo/useCallback total |
| 357 | S3 | CONFIRMED | S3 | Conf | — | typography | grep useFonts/Font.loadAsync | DISCHARGES seed 008; →361 source | — | — | #18 | no custom font loaded; gothic-serif pillar unimplemented |
| 358 | S3 | CONFIRMED | S3 | Conf (exec) | P9/P7/P1 | components | hex grep + knip + `MonsterDisplay:29-45` | 7 orphans = the 354 roster; 4 dead tell-branches (305) | — | — | #18/#15 | 66 hex across 7 components |
| 359 | Info | POSITIVE | Info | Conf | — | components | inventory ×49 | — | **F** | — | — | token-disciplined; native-driver off useRef; 14 domain icons all used |
| 360 | S2 | CONFIRMED | **S2** | Conf (grep) | P3/P9 | balance/constants ★ | `GameConstants.ts` + consumer grep | DEFINITIVE 003/065/151 discharge | — | — | #6 | 16/20 configs never imported → balance untunable from the documented source |
| 361 | S3 | CONFIRMED | S3 | Conf | — | constants/hooks | `Typography.ts:9,54-311` + `useHaptics.ts:11-79` | DISCHARGES 357-at-source + 292 | — | — | #18 | only MONO_FONT declared; useHaptics fires unconditionally (toggle = placebo) |
| 362 | Info | POSITIVE | Info | Conf | — | design-system | `Colors.ts` (13 groups) | the off-token defect is consumer-side; biome dead entries (170) | **F** | — | — | tokens EXIST and are well-organised — mechanical fix |
| 363 | S3 | REFINED | S3 | Conf | — | repo hygiene | repo root (17) + `app/**` (6, OBS-12) | DISCHARGES seed 012; ✅ B2 2026-06-10: all **UNTRACKED** (`??`) — the "tracked" clause REFUTED (the outer repo's tracking caused the D/M churn) | D | ✅ AT-HEAD | #19 | now 23 junk files total incl. the app-nested set |
| 368 | S3 | CONFIRMED | S3 | Conf (exhaustive) | P9 | components/colors | `BlessingCeremony.tsx:25-40` · `NarrativeLog.tsx:40-58` | SOURCES the "second palette" (255/358) | — | — | #18 | DOMAIN_GLOW_COLORS ≠ Colors.domain — same domain, different color per screen |
| 369 | S3 | CONFIRMED | S3 | Conf (exhaustive) | — | components/perf | `AnimatedBar.tsx:42-65` · `NarrativeLog.tsx:79-110` | concrete 033/05/356 instance | — | — | #18 (§6.4 batch) | HP/SP bars animate width/color on the JS thread; per-char typewriter setState |
| 370 | S4 | CONFIRMED | S4 | Conf (exhaustive) | P1 | components/content | `BlessingCeremony.tsx:43-58` · `NarrativeLog.tsx:62-77` | — | — | — | — | telephone glyph for `knowledge`; damage-emphasis regex replaces match with itself (no-op) |
| 371 | Info | POSITIVE | Info | Conf (★49/49) | — | components ★ | all 49 | definitive discharge of the exhaustive component read | **F** | — | — | clean, well-architected presentational tier; defects all systemic |

---

## UNWIRED PRE-INVENTORY (Unit A9 output — the Phase-D forensics scope, from `03` + §6/§6b + knip)

> Every item below gets the four checks (F1 archaeology · F2 multi-shape reachability · F3 contract dependents · F4 pillar) before any disposition is finalized. Pre-adjudicated dispositions (E7) inherited. ⚠ = F3 has KNOWN dependent content — DELETE is presumptively wrong.

**BROKEN-LINK (1):** the 3 untracked S0 files (001) — ✅ re-verified at HEAD 2026-06-10.
**NO-OP (engine):** favor→power beyond shrines (270) · domain blessings (181) · weapon enchantments (188) ⚠466 enchanted instances · `statModifier`/slow (191) · armor penalties (193) · accessory non-stat effects (194) · durability model (211 — repair.tsx itself = LIVE salvage, E7) · suffix procs (052/301) ⚠suffix data · `rewards.xp`-as-XP (300 — ⚠ LIVE as proficiency feed, OBS-10: REPURPOSE not delete) · GameConstants dead 16 (360) · haptics toggle (292/361) · `useGameStore` volumes (293) · FloatingDamage x-offset (03 §2 — ⚠ never discharged; Phase-B) · EnemyPreview canInflict + level-1 hardcode (034 — ⚠ never discharged; Phase-B) · `boss.mechanic` (316) ⚠20 authored mechanics · `specialMechanic` (311) ⚠111 weapons incl. 34 uniques · dual-stat apparatus (312) ⚠162 weapons' primaryStats · no-op damage-emphasis (370).
**ASPIRATIONAL:** 17 sacred metrics + reveal gate + passive resolver (099/343/208/210) ⚠588 items + 245 hand-voiced conditions · maya/inca (347 — E7: WIRE) ⚠28 deities · dungeon-inventory armor TODO (267 — stale placeholder; armor IS live per 281) · custom-font pipeline (357/361) · `MonsterAbility` (169 — ⚠ never discharged; Phase-B).
**ORPHAN (knip-confirmed + grep-confirmed):** deity-unlock layer (137) · `forceUnlock` (099) · `startChallenge`/`tickChallengeFloor` (125) · FAVOR_STATUS table (122/180) · types barrel (217) + stores barrel gap (140) + 4 more dead barrels (354) · `applySoftCap` (148) · `getCarryCapacity` (159) · `calculateGoldDrop` (164) · NODES consts (171/085) · dead shop node surface (172/083/245 ~180 LOC) · `Colors.biome` void/labyrinth/dreamscape (170/362) · `getTierSynergyBonus` + achievement utils (197/133) · `createLearnedSkill` (201) · status-narration helpers + pools (307) · `SUFFIX_FLOOR_GATES`/`isSuffixAllowedOnFloor` (309) · `getMaterialsForMonster`/`rollMaterialDrop` (340) ⚠pool data broken too · `starterSkills.ts` 380 LOC (354) · 7 component orphans (354/358: DeityFilters/ActionModal/EmphasisText/TowerWarningModal/StatTooltip + 2 barrels) · `Easing`/`isSentenceEnd`/`Breakpoint`/`Shadow.glow` (037 — ⚠ knip didn't name them; Phase-B) · `_Consumable` import (110/219) · `getAdjacentNodes`-for-nav + `combatData.monster` (175) · `battleCryBonus` (155) · `allStatsAtD` (160) · `questRequired` (212) · dead `'refused'` branch (183) · `startCombat` (058/268) · `addStatProficiency`+`getProficiencyThreshold` (068/154 — ⚠ the CORRECT mechanism, sitting dead: candidate WIRE not DELETE).
**DEAD ROUTES (manual route-graph — knip-blind):** `level-up.tsx` 855 LOC (260 — E7: route dies, Denatus logic re-homes per 259) · `denatus.tsx` (unreachable, latent defects 261 — re-home target) · `job-select.tsx` base-mode (262) · 4 tutorial orphans 1015 LOC (291) · codex L10 hiding (296) · combat dead-style museum ~50 entries (237) + floor/room dead styles (256).
**Write-only data fields:** `lootTable` ×36 (340) · `biomes` ×36 (299) · pool `materials`/`consumables` (340 — 16/16 dangling) · suffix `statusEffect`/`passiveAbility` (301) · `revealFavorRequired` ×490 (208) ⚠ · `passiveId` ×588 (343) ⚠ · `twoHanded` (314) · `MapNode.combatData.monster` (175).

---
