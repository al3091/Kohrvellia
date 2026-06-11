# Kohrvellia Audit — Data Integrity & Content

> **Status (updated S47, 2026-06-09):** the combat-data (DC1–DC5) + progression (DPr1–DPr5) data clusters are
> **COMPLETE and machine-verified** (`KV-AUD-298–342`). The earlier "interrupted by session limit" note is
> superseded — from S37 a **walled-off, re-runnable harness** (`audit/` + `.audit_tmp/*.ts`, run via
> `./audit/node_modules/.bin/tsx`) imports the **real data barrels** and executes the referential-integrity
> assertions that Section B used to merely *list*. **Still pending (the exhaustive content/voice + integrity
> sweep that is NOT yet done):** the **19 pantheons** (~24K LOC of deity lore) and the **DI items/relics**
> (deityRelics × 16 files + domainArtifacts + pantheonSets) — those discharge the S1 `099` sacred-unobtainable
> *count*. Wave 4 = components/tooling. **How to re-run any check below:** the scripts are in `.audit_tmp/`
> (`weapon_check.ts`, `boss_check.ts`, `ach_check.ts`, `job_check.ts`, `dpr5_check.ts`, `loot_refint.ts`,
> `scaling_sim.js`) + `audit/schemas/` (zod monster validation). They are scratch; migrate the keepers into `audit/`.

---

## A. Integrity findings established first-hand (cumulative)
| Check | Result | Evidence / ID |
|---|---|---|
| Untracked data files in the build | `milestoneBossesFloors30to60.ts` + `…65to100.ts` **untracked but imported** by `milestoneBosses.ts:16-17` → clean `git checkout`/CI cannot bundle them | **S0 KV-AUD-001** (re-verified S37) |
| Pantheon interface validity | maya & inca flagged as wrong `Deity` interface (pending first-hand W3-DP) | seed KV-AUD-028 |
| Sacred-item reachability | **QUANTIFIED:** **244 of 588 sacred items (41%) unobtainable** (dead acquisition metric) + 15 false-unlocks + all 490 deity relics never-reveal (208) + all 588 passives decorative (210) | **S1 KV-AUD-099 → 343** |
| Pantheon count vs docs | 19 pantheon files exist; docs say "12 active" | `PANTHEON_INFO` (184) |
| Achievement count vs docs | **123** in data; docs say 96 | DPr1 import (325) |
| Behavement count vs docs | **90** defined; docs say 85 | `useSoulStore` (091) |
| Status-effect vocabulary schism | 3 non-overlapping ID sets (StatusEffect.ts ‖ Character.ts ‖ `{type:'buff'}`); 7/10 overlap | **S1 KV-AUD-190**; reaches data at 301/305/341 |
| Monster bestiary integrity | 36 monsters, **0 dup ids**, all enums valid; **1 contradiction** (elder_dragon ice weak+immune) machine-caught | 302/**304** |
| Weapon catalog integrity | **338** weapons, **0 dup ids**, all `damageTypes` canonical, all categories valid | 313/**315** |
| Boss roster integrity | **20/20** milestone floors covered, **0 dup ids**, 0 floor-vs-lookup mismatches, all authored | **320** |
| Achievement registry integrity | **123**, **0 dup ids**, valid tiers/targetLevels | **328** |
| Job catalog integrity | 51 base + 18 spec; **6 base↔spec dup ids**; statRequirements/statBonus valid | **337**/339 |

## B. Referential-integrity assertions — **NOW EXECUTED** (was "to run on resume")
*Each was run by importing the real barrels under `tsx`. Result + finding-id recorded.*

| Assertion | Result | ID |
|---|---|---|
| `boss.baseMonsterId` ∈ monster ids | **N/A** — `MilestoneBoss` carries **no** `baseCR`/`baseMonsterId`/stats (pure conversation+lore; the fight is a separately-generated monster) | 319 |
| `job.starterSkill*` / `job.starterWeaponCategory` valid | **PASS / ref-safe by design** — `starterSkill` is an **inline** `CombatSkill` (no id to dangle); `starterWeaponCategory` is a `StatName` (generates a weapon of that category); spec `parentJobId` **0 dangling** | 339 |
| blacksmith `upgrade.materialId` ∈ `materials.ts` | **PASS** (all 7 resolve) | 213 (re-confirmed) |
| `deity.domain` ∈ 14 `DeityDomain`s; backstory affinities | **PARTIAL** — `'divine'`/`'fate'` backstory affinities are non-domain (W1 156/157); deity data pending W3-DP | 157 |
| relic acquisition reachability (vs live metric set) | **DONE — 41% unobtainable (343).** 0 dup relic ids; 107 non-canonical `damageType` (344) | **343/344** |
| relic → deity membership (deityId ∈ pantheon deities) | **DONE (DP) — 240/245 resolve; 5 dangling = the milestone bosses** (vanya/sorath/kutcher/kalindi/malik, not patron deities); 66/310 deities have no relic | **349** |
| deity data integrity (domain/stat/dup/count) | **DONE (DP) — 310 deities/17 active pantheons; 0 invalid domains (14/14 covered), 0 invalid stats; 4 dup deity ids** (japanese∩shinto, hindu∩persian); maya/inca complete-but-ORPHANED (**refutes seed 028** — tsc-clean, just unwired) | **347/348/350** |
| loot pool category ∈ monster `category` | **PASS** — loot resolves by `MonsterCategory` (8 pools: humanoid/undead/beast/elemental/aberration/demon/giant/dragon); all 8 monster categories map | 340 |
| `monster.baseCR` never 0 | **PASS (latent landmine)** — min `baseCR` = 0.5; min final CR ≈0.2 via `weak` prefix; no zero ⇒ the Infinity-reward divide (163/053) is **not exercised by current data** | 302 |
| **uniqueness** — no dup `id` within/across data categories | **MOSTLY PASS** — 0 dups in monsters/weapons(338)/achievements(123)/materials(18)/consumables(19)/skills; **FAIL: 6 base↔spec dup job ids** (warlord/crusader/arcanist/enchanter/hunter/skirmisher) | **337** |
| **achievement RequirementType coverage** (every `type` used ∈ the fired set) | **FAIL, quantified** — the fired set is exactly `{kill_count, gold_earn, boss_kill, elite_kill, damage_dealt, damage_taken, floor_reach, shrine_blessing, stat_reach, custom}` (re-derived R1 from call sites); **20 of 123 achievements (16%) use one of the 11 dead types → uncompletable** (incl. 4 STANDARD-tier shown as achievable) | **325** |
| **suffix gate keys** = suffix ids | **FAIL (doubly dead)** — `SUFFIX_FLOOR_GATES` keys (`burning/venomous/chilling…`) ∉ suffix ids (`of_flame/of_venom/of_frost`); also 0 callers → the early-floor safety never fires (the live gate is the data's own `minFloor`) | **309** |
| **NEW: monster `lootTable` field resolves** | **DEAD** — 22 `*_loot` refs read by nothing (loot is category-keyed); the pool `materials` field is also dead **and** broken (16 dangling refs, `hide`↔`monster_hide` naming mismatch) | **340** |
| **NEW: boss-outcome `achievement` ids ∈ registry** | **PARTIAL FAIL** — floors 5–60 resolve (6/6 spot); **5 of 8 deep (65–100) dangle** (`kohr_uwa_split_resolved`, `haitt_lox_war_read`, `ulfkon_naa_stayed`, `vituna_sta_endured`, `ekva_baniyata_cycle_read`) → the secret-outcome reward silently no-ops | **321/328** |
| **NEW: skill/consumable effect types ∈ handled set** | **199 confirmed** — only `buff`/`damage_percent`/`flee` are unhandled by `playerUseSkill`; the 12-skill catalog uses none (dead impact = the 13 job `buff`-skills, 336). **204 LATENT** — `reveal`/`identify` unhandled but **no** consumable uses them | **342**/336 |
| **NEW: stat-build → job coverage** (all 56 top-3 triples) | **FAIL** — only **21/56** triples have a job → **35 builds (63%) get no job** at L2 (graceful "Continue" fallback, no soft-lock) | **335** |

## C. Content & voice (MINDSET.md) — DC/DPr verdict: **EXCELLENT** (pantheons/relics still pending)
The first-hand reads across the DC/DPr clusters found the **authoring + voice to be a genuine, consistent
asset** — the strongest part of the codebase:
- **Monsters** — richly specified bestiary; sensible CR↔HP↔attack curve; evocative naming.
- **Bosses (all 20)** — the **single best content** in the project: 3-exchange `PlayerSnapshot`-driven conversation
  trees, secret outcomes, archetype-sensing, `bossDefeatedEcho` for future climbers; the deep bosses build a
  coherent invented mythology (Johr'ulf/Johr'kuun/Rutkean'i; the **Skaervox "Lawmaker"** floor-100 finale — the
  11 Laws / Aleabishal / Máalkohr grammar — is the project's best writing). On-MINDSET throughout (active voice,
  hooks, no hedging). *(320/324/334.)*
- **Achievements (123)** — memorable names, clean 1-sentence descriptions, thematic escalation
  (First Blood → Slaughter → Apocalypse → Armageddon → God Slayer). *(328/331/334.)*
- **Jobs (51)** — crisp archetypal flavor (Warrior, Berserker, …). *(339.)*
- **Events (53, wired)** — real moral/risk dilemmas (Wounded Adventurer: help/search/ignore) — a genuine
  realization of the "Meaningful Choices" pillar. *(342.)*
- **The tragedy is not the writing — it is that the runtime under it is unwired** (see §D); the authored back
  half (bosses 20–100, the finale, the Mythic capstone, the Paragon climax) is also **unreachable** behind the
  303 scaling wall.
- **Known naming nit (pending W3-DP confirm):** tower/zone copy uses "Johrvellia"/"Johr'…" while the game is
  "Kohrvellia" (`GameConstants.ts:295-310`); the boss files deliberately use `Johr'*` as *in-world* pantheon
  names, so confirm which are intentional lore vs. a misspelling of the title.

## D. Wave-3 DC/DPr defects with a DATA-INTEGRITY shape (the new findings this section owns)
*(Most DC/DPr defects are runtime-wiring, filed under §08 patterns. These are the ones that are specifically
data-vs-data or data-vs-engine integrity breaks — the kind a referential script owns.)*
1. **Dead/divergent data layers (the loot system, 340).** Two dead layers atop a working core: the monster
   `lootTable` field (22 refs) + the pool `materials`/`consumables` fields (16 dangling, naming-mismatched refs).
   Loot *works* via category + combat's own material path; the `lootTable`/material tables are dead-would-be-broken.
2. **Dangling reward refs (321/328).** 5 deep boss-outcome achievement ids don't exist in `ALL_ACHIEVEMENTS`.
3. **Id collisions (337).** 6 ids exist as both a base job and a specialization → not globally unique.
4. **Coverage gaps (335/338/308/314).** 35/56 stat-builds have no job; only 9/51 jobs branch to a spec; 12/36
   monsters have no portrait; LCK has 22 weapons vs 40/other-category.
5. **Uncompletable-by-construction content (325/326/327/329/333).** ~27%+ of achievements unreachable across 4
   vectors (dead requirement types · undiscoverable Mythic source · type-blind `custom` · cumulative-counter
   conduct constraints · `custom value:0` no-op).
6. **Stale data vs its own docs (313/317/335).** `hybridWeapons.ts` "320 weapons" (really ~162); CLAUDE gap #6
   "floors 30-100 have no bosses" (all 20 wired); `Job.ts` "2-4 jobs per combination" (35 triples have 0).

---
*Companion: root-cause grouping in `08_DEFECT_PATTERNS.md`; full register in `ALL_FINDINGS.md` §4; balance in
`05_BALANCE_AND_BENCHMARKS.md`; doc drift in `07_DOC_RECONCILIATION.md`. **Next data work:** DP pantheons +
DI relics (run the relic→deity/pantheon membership assertion to discharge the 099 count).*
