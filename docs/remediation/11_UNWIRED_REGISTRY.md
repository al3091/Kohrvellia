# 11 — UNWIRED REGISTRY (Phase D)

> Produced 2026-06-10 (remediation S3) per Master Prompt §5. Every floating item carries the four checks —
> **F1** archaeology (`git log`/`git show`, run this session) · **F2** reachability (multi-shape rg + knip 354 +
> the manual route graph — most machine-verified in Phase B) · **F3** contract dependents · **F4** pillar/design
> backing (doc greps, this session) — and exactly one disposition. Pre-adjudications (ledger E7) inherited.
> Key commits: `3812852` = initial release · `88a1fce` = "Update game files" · `b8e5616` = "Phase 1 complete —
> job system, **ascension ceremony**, dungeon balance rework" (THE stranding commit) · `216539a`/`283b19b` =
> route shuffles · `391a56a` = Discovery wiring · `56165d3` = UX sprint · working tree = the uncommitted wave.

## ★ Phase-D headline insights
1. **A third stranding class exists beyond "refactor-orphan": ABANDONED IN-FLIGHT WORK.** The dual-stat gate
   (`HYBRID_MIXED_CATEGORIES`/`isHybridMixed`) appears in **zero committed versions** (`git show HEAD:` → 0 hits)
   — it exists only in the uncommitted wave, layered on `primaryStats` data that shipped at `3812852`. The 3 S0
   files and the maya/inca fix are the same class. These aren't decay; they're WIP that stopped mid-wire.
2. **The team invested in dead code post-stranding:** `391a56a` wired Discovery features into `level-up.tsx`
   *after* `b8e5616` had already orphaned it — nobody knew it was dead. (The knip/route-graph CI gate, #3,
   is what prevents this class of waste.)
3. **Four "dead" items are actually the pre-built FIXES for open defects** (WIRE, never DELETE):
   `getProficiencyThreshold`+`addStatProficiency` (the designed cost curve 068/154) · `getAdjacentNodes`
   (the forward-only primitive 080's fix needs) · `getHealingModifier` (192) · the status-narration pools (307).
4. **Four design-vs-code conflicts go to the owner** (F4 found design backing the code abandoned):
   durability/repair · the 5%-wandering-merchant shop node · biome-pantheon associations · stealth.

---

## Cohort 1 — BROKEN-LINK (the S0)
| Item | Class | Findings | F1 | F2 | F3 | F4 | Disposition |
|---|---|---|---|---|---|---|---|
| `weaponFormulaResolver.ts` + `milestoneBossesFloors{30to60,65to100}.ts` | BROKEN-LINK | 001/352 | created in the uncommitted wave; never committed (in-flight class) | imported by `useCombatStore:32` + `milestoneBosses:16-17` → 4 screens | all combat damage + boss floors 30–100 | core combat | **WIRE → `git add` + commit (#2; owner step; content vetted 313/320/324; already safe on `3b8603e`)** |

## Cohort 2 — The ceremony rewiring (stranded at `b8e5616`)
| Item | Class | Findings | F1 | F2 | F3 | F4 | Disposition |
|---|---|---|---|---|---|---|---|
| `level-up.tsx` (855 LOC) | ORPHAN route | 259/260 | superseded when `b8e5616` created `ascension.tsx`; `391a56a` invested in it post-death | 0 inbound (B2 route-graph) | holds the ONLY denatus route + GLORY/bonus logic (live dup in store, 133) | ceremony moved by design | **DELETE after extracting the denatus route + a GLORY-parity check (#9)** |
| `denatus.tsx` | ORPHAN route (re-home target) | 259/261 | born with the soul system; stranded transitively | inbound only from dead `level-up:309` | the ENTIRE Paragon layer + L10 achievements + codex L10 | Eris's soul-climax pillar | **WIRE — route `ascension` → denatus at L10; fix 261(a/b/c) + 176 + 178 IN the same batch (#9)** |
| `job-select.tsx` base-mode | ORPHAN half-route | 262 | L2 picker moved inline into ascension at `b8e5616` | base-mode 0 inbound; spec-mode live (`ascension:204`) | none (ascension owns L2) | — | **DELETE the base-mode branch; keep spec-mode** |
| codex `LEVELS=[1..9]` | NO-OP (hides content) | 296 | — | live screen | ~15 `targetLevel:10` achievements | progression pillar | **WIRE — extend to 10 (#9 rider)** |

## Cohort 3 — The tutorial trim (stranded at `b8e5616`)
| Item | Class | Findings | F1 | F2 | F3 | F4 | Disposition |
|---|---|---|---|---|---|---|---|
| `tutorial/{combat,stats,falna,leveling}.tsx` (1,015 LOC) | ORPHAN routes ×4 | 291 | trimmed 6→3 at `b8e5616`; orphans last polished `56165d3` (pre-trim) | 0 inbound (exhaustive route grep; knip-blind); web deep-link still loads them | none — CLAUDE 1.3: in-context hint overlays replaced them | the trim was deliberate | **DELETE all 4 (#14/#15)** |

## Cohort 4 — Day-one aspirational / superseded (born `3812852`, never touched or never wired)
| Item | Class | Findings | F1 | F2 | F3 | F4 | Disposition |
|---|---|---|---|---|---|---|---|
| **Durability model** (`Weapon.durability`, repair pricing) | ASPIRATIONAL | 211/212 | `git log -S durability -- src/stores` → **EMPTY across all history** — never wired, ever | 0 store reads/writes | `calculateRepairCost`; salvage screen is separate + LIVE (286, protect) | **DESIGNED** — `DESIGN_EQUIPMENT:188` durability tiers + `:269` repair=10% | **QUARANTINE → owner: build the designed degrade+repair loop (M–L) vs descope + update the doc (XS). The salvage screen survives either way.** |
| Deity-unlock layer (`unlockDeity`/`isDeityUnlocked`) | ORPHAN | 137 | born `3812852`, untouched | 0 callers (grep, B2-era) | none — all deities selectable by design of the picker (290) | no design doc demands locked deities | **DELETE** |
| `FAVOR_STATUS` 0×-table | ORPHAN | 122/180 | born `3812852`; survived the `dbb6b8d` favor work un-unified | only a discarded self-call; familia shows `.label` only (270) | the label strings (keep) | — | **MERGE → `FAVOR_TIERS` survivor; port labels; delete multipliers (#11)** |
| `forceUnlock` (sacred) | ORPHAN | 099 | day-one escape hatch, never called | 0 callers | superseded by #10's real metric writers | — | **DELETE (after #10 lands)** |
| `starterSkills.ts` (380 LOC) | ORPHAN | 354/342 | born `3812852`, sole importer = dead barrel | knip-confirmed | none — job skills are inline (339) | — | **DELETE** |
| Dead barrels ×6 (`types/index` 217 · `stores/index` 140 · items/skills/character-creation/text) | ORPHAN | 217/140/354 | day-one; consumers deep-import | knip-confirmed; `types/index` 0 importers | none | — | **DELETE all 6 (one convention: deep-imports); #15** |
| Component orphans: `ActionModal` (tombstone: "Kairos panel replaces"), `DeityFilters`, `EmphasisText`, `TowerWarningModal`, `StatTooltip`, `GritPanel` | ORPHAN ×6 | 032/354/358 | `ActionModal` superseded by the Kairos rework; rest day-one | knip + B2 (GritPanel = orphan-via-barrel; AnimatedHP/SPBar = stale names, files don't exist) | none | — | **DELETE all 6** |
| Dead constants: `Easing`, `isSentenceEnd`, `Breakpoint` · `battleCryBonus` · `allStatsAtD` · `questRequired` · `'refused'` branch · `_Consumable` imports ×2 · NODES consts · `MapNode.combatData.monster` | ORPHAN | 037/155/160/212/183/110/219/085/171/175 | day-one residue | definition-only (B2 greps) | none | — | **DELETE (one sweep, #15)** |
| `applySoftCap` · `getCarryCapacity` · `calculateGoldDrop` · `getTierSynergyBonus`+orphan utils · `createLearnedSkill` · `startChallenge`/`tickChallengeFloor` · `startCombat` | ORPHAN | 148/159/164/197/201/125/058 | superseded mechanisms | knip + greps; `startCombat` 0 callers (268) | `getCarryCapacity`: only the phantom STAT_INFO copy (149 — delete together) | soft caps removed by design (`:297`) | **DELETE** (201 = MERGE→`Character.Skill`; delete `startCombat` inside #8's batch) |
| `calculateBlessingPower` (`@deprecated`, still wired) | NO-OP (deprecated-live) | 128/182 | deprecated in place, caller never migrated | 1 caller (`getBlessingEffect:479`) | — | — | **MIGRATE → `getBlessingMultiplier`, then DELETE** |
| `MonsterAbility` interface | ORPHAN | 169 | day-one modeling | definition-only (B2) | none — AI runs on `behaviorPattern` | not in DESIGN_MONSTERS as a separate ability system | **DELETE** |
| Dead mystery branches (combat/elite/rest) | ORPHAN branches | 249 | room built for 6 reveal types; generator deliberately emits 3 (60/20/20) | `actualType` source proven (B2) | none | generator IS the design | **DELETE the 3 dead branches** |
| Dead styles: combat museum (~50) + floor/room | ORPHAN | 237/256 | superseded by the component/Kairos rework | tombstone comments | none | — | **DELETE (#15; mechanical)** |

## Cohort 5 — Design-vs-code conflicts (F4 found design backing — owner calls)
| Item | Class | Findings | F1 | F2 | F3 | F4 | Disposition |
|---|---|---|---|---|---|---|---|
| **Dungeon shop node** (~180 LOC, complete implementation) | ORPHAN (deliberately starved) | 083/172/245 | weight zeroed at `b8e5616` "dungeon balance rework" ("Removed … dead weight") | generator excludes; room.tsx implementation COMPLETE + ready | the full merchant UI/handlers/stock-refresh | **DESIGNED at 5%** — `DESIGN_DUNGEON:86` "Shop / Wandering merchant / 5%" + `:185` | **QUARANTINE → owner: restore weight 5 (near-FREE — the room side is finished) vs delete surface + update the doc** |
| **`monster.biomes` + biome gating** | NO-OP field | 299/170 | day-one field; selection never read it | 0 readers (B2-era grep) | `getBiomeForFloor`+`Colors.biome`+display names ARE live (8/10) | **DESIGNED** — `DESIGN_DUNGEON:157` "Biome-Pantheon Associations" | **QUARANTINE → owner: WIRE-lite (filter `getMonstersForFloor` by biome + add the 2 missing biomes to rotation) vs delete the field + dead union members** |
| **Stealth system** | ASPIRATIONAL (cross-system) | 325-member (`stealth_kills`) · SOUL EVADE_04 · `DESIGN_PROGRESSION:197` challenge | never built | no stealth mechanic exists (331) | 1 achievement + 1 behavement + 1 designed challenge + AGI's designed role | **DESIGNED in 3 docs** | **QUARANTINE → owner: wire to the EXISTING sneak flow (encounter.tsx sneak = the natural seed) vs retire the 3 references** |
| `twoHanded` field | NO-OP (cosmetic) | 314 | day-one | display-wired only; no off-hand slot exists | 338 weapons carry it | **NOT designed** (0 hits for two-handed/off-hand/shield in DESIGN_EQUIPMENT) | **DELETE-lean (or keep as pure flavor text); owner nod** |

## Cohort 6 — The effect-resolver column (P1 — ALL WIRE via #4; F3 is the decisive check)
| Item | Findings | F1 (shared) | F2 | F3 — the authored dependents (why DELETE is forbidden, D7) | Disposition |
|---|---|---|---|---|---|
| `specialMechanic` | 311 | the project's consistent shape: data+display ship, the apply-pass is deferred (day-one through the data waves) | 0 readers (B2) | **111 weapons incl. all 34 uniques** — hand-written mechanics | **WIRE (#4 + a display surface)** |
| `boss.mechanic` | 316 (+265) | same | display-only (B2) | **all 20 bosses' taught puzzles** | **WIRE (#4; needs 265's real boss entity first)** |
| Enchantment effects | 188 | same | display-only | every enchanted drop ("of Flame…") | **WIRE (#4)** |
| Armor `speedPenalty`/`dodgePenalty` + accessory non-stat effects | 193/194 | same | dead | the armor catalog's weight-class tradeoff | **WIRE (#4)** |
| `statModifier` (slow/freeze/weaken/curse stat-halves) + healing modifiers | 191/**192** | same | 0 callers (192 B2-proven) | the StatusEffect catalog's defined behavior | **WIRE (#4, after #11a unifies the model)** |
| Suffix `statusEffect`/`passiveAbility` + the proc source | 052/301 (+034's `canInflict` display) | same | procs read `damageTypes` instead | the 5-suffix catalog + EnemyPreview's dead block | **WIRE (#4); 034 rider** |
| Skill `damage_percent`/`buff`/`flee` + job buff-skills | 199/336 | same | handler re-derivation (342) | **13 jobs' class identity** (champion/monk = no-ops) | **WIRE (#4/#13)** |
| Event/ramification status outcomes | 341 | same | store loop applies hp/sp/gold/ration only (B2) | the 53-event "Push Your Luck" consequences | **WIRE (#4 + canonical ids)** |
| Paragon noun passives ×4 types | 177 | same | definitions-only (B2) | ~16 non-combat Paragon rewards | **WIRE (#4; live after #9)** |
| Domain blessings | 181 | same | display-only (B2: `DOMAIN_EFFECTS` consumers = display) | all 310 deities' "+X%" promises | **WIRE (#4)** |
| `custom` checker + `value:0` idiom | 327/333 | same | type-blind (B2 ach_check) | 20 custom achievements | **WIRE (#4/#12 — per-id registry)** |
| Sacred passives + `revealFavorRequired` + `targetType` | 210/208/345 | same | 0 consumers / 0 readers / dropped | **588 items, 245 hand-voiced conditions, the cryptic reveal texts** | **WIRE (#10, resolver-backed)** |
| Status-narration pools | 307 | built, bypassed | not imported | 24 polished lines | **WIRE (trivial — route the status log through them)** |
| Haptics toggle | 292/361 | placebo since birth | hook reads no flag | the settings UI promise | **WIRE (#18)** |

## Cohort 7 — The favor/sacred web (WIRE via #11b/#10)
`adjustFavor`→`character.deityFavor` single-writer (270/121-shape) · the 17 dead metric writers (343's a-list) · `recordParagon`/`incrementEventSuccess`/`incrementSkillUse` callers · the boss-relic registry (349's 5 dangling) — F3: the entire 588-item tier + the DanMachi patron pillar (CLAUDE identity). **WIRE.**

## Cohort 8 — Abandoned in-flight work (the NEW class — finish, don't archaeologize)
| Item | Findings | Evidence | Disposition |
|---|---|---|---|
| The dual-stat apparatus (`HYBRID_MIXED_CATEGORIES`/`isHybridMixed`/`physRatio`) | 312 (+153/061/185 latent) | `git show HEAD:` → **0 hits**; working tree → 6; data (`primaryStats`) shipped at `3812852` | **WIRE — finish the in-flight work: gate on `primaryStats.length>1`, derive the split from `primaryStats`, delete the spelling-drifted sets (185)** |
| maya/inca regeneration | 347 | committed = broken (`88a1fce`); the FIX is uncommitted-only; tsc-clean (B-recon) | **WIRE — 2 imports + 2 spreads + delete the stale TODO (E7)** |
| The 3 S0 files | 001 | untracked since creation | **WIRE — Cohort 1** |

## Cohort 9 — Pre-built fixes sitting dead (WIRE — they ARE the remediation)
`getProficiencyThreshold` + `addStatProficiency` (068/154 — the designed escalating cost curve; the live flat path violates "Challenge, Not Grind") · `getAdjacentNodes` (175 — the forward-only nav primitive that closes 080's backward step) · `getHealingModifier` (192) · the narration pools (307). **WIRE each inside its owning batch (#6-extension, #7, #4).**

## Cohort 10 — Write-only data fields (dispositions per field)
`lootTable` ×36 (340) → **DELETE** (category pools are the live system) · pool `materials`/`consumables` (340 — 16/16 dangling) → **DELETE** (combat's own material path works; wiring would need the id-renames too) · `xpValue` ×36 (300) → **REPURPOSE as the documented proficiency yield — DELETION FORBIDDEN (OBS-10: it feeds the live 222 channel)** · `biomes` → Cohort 5 (owner) · `twoHanded` → Cohort 5 · `revealFavorRequired`/`passiveId` → Cohort 6/7 (WIRE) · suffix fields → Cohort 6 (WIRE).

## Cohort 11 — Junk files (D10 — untouched until their batch)
23 files (17 root + 6 app-nested, OBS-12), **all untracked** (B2). → **DELETE in #19 with explicit pathspecs; never `git add -A` before it.**

---

### Disposition tally
**WIRE ≈ 34 items** (the resolver column + favor/sacred web + in-flight work + pre-built fixes + ceremony re-home) · **DELETE ≈ 33** (day-one residue, orphan routes/components/styles/barrels, dead branches/fields) · **MERGE ≈ 10** (favor tables, volumes, blacksmith rep, suffix gates, brackets, danger fns, LearnedSkill, NPC, log lengths, sell paths) · **QUARANTINE → owner = 4 design conflicts** (durability/repair · shop node · biomes · stealth) + 2 nods (twoHanded · the G-5 statPenalty decision). The codebase's disease is confirmed as **under-wiring, not over-building** — and a quarter of the "dead" code is the unfinished fix itself.
