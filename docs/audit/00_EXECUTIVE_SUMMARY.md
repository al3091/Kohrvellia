# Kohrvellia — External Audit, Executive Summary (June 2026)

> **Mode:** report-only, zero-trust external audit (rules in `01_CHARTER_AND_RUBRIC.md`).
> **Scope reality:** ~86K LOC / 325 tracked files, audited sequentially, first-hand, line-by-line.
> **Status: ★ AUDIT COMPLETE — Waves 1–4, first-hand + machine-verified, `KV-AUD-001…363`.** Wave 1 (engine
> spine — every store, lib, core type) · Wave 2 (every `app/` screen) · **Wave 3 (all data/content** — 36
> monsters, 338 weapons, 20 bosses, 123 achievements, 51 jobs, skills/consumables/materials/loot/events, ~770
> relics, 310 deities**)** · **Wave 4 (components · constants/hooks · config + a tool sweep that mechanically
> validated the dead-code inventory · this final synthesis).** **363 findings.** A re-runnable harness imports
> the **real** data barrels for every quantitative claim (`303` scaling sim · `343` 41%-unobtainable · `325`
> achievement coverage · `335` job coverage · `354` knip/madge). Nothing is taken on trust; every headline
> cites `file:line`, and **~⅓ of the work was *correcting* earlier claims in both directions** — 6 R1 self-
> corrections (281/286/225 · 202→338 · 028→347 · the `162`→`303` floor-86→floor-15 sim). **The actionable
> output is `06_REMEDIATION_BACKLOG.md`** (leverage-ordered). See `08_DEFECT_PATTERNS.md` for the root causes,
> `ALL_FINDINGS.md` for the register.
>
> **Bottom line:** the **content + data are excellent**; **the runtime that should read them is the problem.**
> 1 S0 (build-break) + 5 S1s break core roguelike guarantees, and the run is **unwinnable past ~floor 15** —
> but the fix is *not* a rewrite: **wire what's already built** (one effect-resolver closes ~30 findings),
> **gate the scaling floor**, **tighten the types**, and let CI keep it honest.

## The one thing to fix first

**KV-AUD-001 (S0 Critical) — the repository cannot build from a clean checkout.** Three source files
that core code imports are **untracked in git**:
- `src/lib/weaponFormulaResolver.ts` ← imported by `src/stores/useCombatStore.ts:32`
- `src/data/bosses/milestoneBossesFloors30to60.ts` and `…65to100.ts` ← imported by
  `src/data/bosses/milestoneBosses.ts:16-17`, which `app/dungeon/combat.tsx:20`, `floor.tsx:24`,
  `boss-encounter.tsx:32`, `boss-cleared.tsx:17` all import.

CI (`/.github/workflows/deploy.yml`) builds from the git tree (`checkout` → `npm ci` → `expo export`),
**not your disk**. So the GitHub Pages deploy builds (or fails) without the combat damage resolver and
2 of 3 boss tables. Local `npx tsc --noEmit` returns **0 errors only because the files exist on your
machine** — it masks the break completely. This is the literal embodiment of "it works one way, but
really doesn't." → `git add` the three files (after the content/voice pass vets them), and add a CI
guard that fails on untracked `src/**` imports.

## Severity scorecard (Wave-1 engine spine; Wave-2 screen sub-tally follows)

| Sev | Count | Examples |
|---|---|---|
| **S0 Critical** | 1 | Build-break from untracked imports (`001`) |
| **S1 High** | **5** | `002` permadeath state-bleed · `080` farming re-arm · `099` sacred items unobtainable · `190` StatusEffect schism · **`259` Paragon/Denatus climax unreachable** *(net 5: Wave-2 KV-AUD-242 downgraded `121` favor→S2 — `modifyDeityFavor` IS called at `room.tsx:497` — and Wave-2 `259` added a new S1)* |
| **S2 Medium** | ~59 | `068` flat growth · `069` resurrect-via-heal · `162` deep floors unwinnable · `113` silent gold-loss · `196` ~11 dead achievement types · `177/181/188/191/193/194` inert reward/equipment systems · `207/208/211` sacred + repair unwired |
| **S3 Low** | ~70 | dead code (`137` deity-unlock · `217` dead types barrel · `122/125` dead favor/challenge fns) · schism/drift (`180` favor tables · `214` NPC triplication) · docs |
| **S4 / Info** | ~30 | positives & verified-good (`213` referential integrity PASS · `127/134` challenges + discovery wired · `136` job `as any` fixed · `143` audio real) |

*The table above is the **Wave-1 engine tally**. **Wave 2 (screens, 220–297) adds: +1 S1 (`259`), +20 S2,
+40 S3, +17 Info** — though many Wave-2 S2/S3 entries *confirm or sharpen* a Wave-1 finding rather than add
a new defect (e.g. `220`→093, `251`→080, `282`→113, `293`→144). **Grand total = 297 findings; the S1 set
stays 5** (`002/080/099/190/259` — `121` dropped to S2 via `242`). The genuinely new screen-layer defects
are `234/246/254/264/265/274/279/289/291/292` + the `259` S1. The earlier "7 S1s" figure was wrong —
reconciliation removed `007` (audio is real) and `004` (the `0×` table is dead), and first-hand work added
`099` and `190`.*

## The S1s (core roguelike guarantees broken) — 5 (Wave 2: 121 downgraded→S2, 259 added)

| ID | System | What's broken | Evidence |
|---|---|---|---|
| **KV-AUD-002** | State / permadeath | `clearAllStores()` leaves shop `lifetimeGoldSpent` (104) and sacred `acquired`/char-scope metrics (098) behind → a dead character biases the next one (cardinal sin in permadeath). *(Refined: the inventory "second gold pool" was refuted — 106.)* | `clearAllStores.ts:19-29` + `useShopStore`/`useSacredItemStore` |
| **KV-AUD-080** | Dungeon | Cleared combat/elite nodes **re-arm on backtrack** (`isCompleted:false` on leave) + `getCurrentPathOptions` returns backward edges + `moveToNode` has no validation → infinite farming, violating "Challenge, Not Grind." | `useDungeonStore.ts:644-651,698-719,586` |
| **KV-AUD-099** | Sacred items | The ~770-item unlock system is substantially **unobtainable**: ~14 acquisition metrics are `return 0` stubs, `recordParagon`/event metrics have no writers, and `forceUnlock` is dead. Compounded by `revealFavorRequired` being read by **0 stores** (208) and the favor-sync gap (121/242) → deity relics never even *reveal*. Some `value:0` reqs also mis-fire as **false unlocks**. | `useSacredItemStore.ts` + `SacredItem.ts:139` |
| ~~**KV-AUD-121**~~ **→S2** | Familia / Deity | **DOWNGRADED by Wave-2 KV-AUD-242.** The "0 callers" was a false-negative grep (`.modifyDeityFavor(` missed the destructured bare call) — `modifyDeityFavor` **is** called at `room.tsx:497`, so shrine favor *does* move `character.deityFavor` + the blessing. Real (S2) defect: favor is **inconsistently synced** — shrines update both stores; events/challenges update only `relationship.favor`. | `room.tsx:497` + `useDeityStore.ts:124-159` |
| **KV-AUD-190** | Combat / Status | **Three incompatible status models** (`StatusEffect.ts` weaken/slow/regen · `Character.ts` fear/silence/paralysis · a 'buff' shape); 7/10 ids overlap → fear/silence/paralysis are dead, weaken/slow CR-weights are dead, and cure-by-id fails. `slow` is fully inert (191). | `StatusEffect.ts:9-19` vs `Character.ts:111-121` |
| **KV-AUD-259** | Soul / Denatus / Paragon | **The Level-10 Denatus/Paragon climax is unreachable.** The live ceremony (`ascension.tsx`) never routes to denatus or calls `performDenatus`/`setParagonTitle`; denatus's only inbound route is the **dead** `level-up.tsx:309`. So `character.paragonTitle` is **always null** → the whole Paragon buff layer + soul-climax (176/177/178/093) is dead in practice. *(Wave-2 add.)* | `ascension.tsx:194-210` + `level-up.tsx` (no inbound route) |

## The Wave-1 thesis

**Kohrvellia's type/data layer enumerates far more capability than the runtime applies.** Subsystem
after subsystem is modeled in elaborate detail but only partially (or never) wired:

- **Sacred items** (099 / 207 catalog ≫ evaluator / 208 reveal-favor inert / 210 passives decorative)
- **Deity favor → power** (121 inert / 180 three divergent favor tables / 181 domain blessings
  display-only / 215 the boss "favor sense" is a constant)
- **Paragon / Denatus climax** (176 sort bug → ~half of L10 titles become "Iron" / 177 half the noun
  passives dead / 178 Mythic score literally unreachable / 093 combat behavements double-counted)
- **Equipment** (188 enchantments display-only / 191 `slow` inert / 193 armor speed/dodge penalties
  dead / 194 non-stat accessory effects dead)
- **Repair / durability** (211 `Weapon.durability` is never decremented by any store → `repair.tsx` is
  a 705-line no-op)
- **Achievements** (196 ~11 of 21 `RequirementType`s are never fired → those achievements can't complete)

Two **balance roots** sit underneath: **068** (flat `commitExcelia` growth bypasses the cost curve →
prestige tiers are cheap) **×** **150** (top grades S/SS/SSS are compressed *and* near-cosmetic because
combat reads a linear effective-stat) **×** **151** (Stats.ts hardcodes coefficients that drifted ~10×
from `GameConstants` → the documented "single source of balance truth" is partly disconnected). And
**162** (S2, pending a 100-floor sim): monster HP stacks three multiplicative layers while player damage
is linear, so deep floors are likely mathematically unwinnable — a plausible reason content stops at
floor 25.

Full list + fixes: `02_FINDINGS.md`. Dead/aspirational "floating code": `03_CONNECTIVITY_AND_DEADCODE.md`.
Balance + benchmarks: `05_BALANCE_AND_BENCHMARKS.md`. Doc crosswalk: `07_DOC_RECONCILIATION.md`.

## What Wave 2 (the screen layer, 220–297) added

The 10-unit `app/` pass confirmed the Wave-1 thesis from the consumer side and surfaced one new core-guarantee break:

- **★ NEW S1 — the Level-10 climax is unreachable in the live flow (`259`).** Nothing routes to the (dead, 855-LOC) `level-up.tsx`; the live `ascension.tsx` has no L10 branch and never calls `performDenatus`/`setParagonTitle`, so `character.paragonTitle` is **always null**. The codex even hides the ~15 L10 achievements (`296`). This is the screen-layer counterpart to the Wave-1 "Paragon multiply-broken" cluster (176/177/178).
- **The farming S1 (`080`) is real on-screen (`251`)** — backward map nodes render tappable "Go Here" badges — inside a **navigation-integrity cluster** rooted at **`264`** (the dungeon layout enables iOS swipe-back; back-nav isn't guarded), which also makes the retreat-modal flee (`234`), reward re-farm (`246`), and mid-run menu-escape (`254`) exploitable.
- **Three R1 self-corrections** (the audit correcting its own first-hand W1 work): **armor is fully buyable + equippable + its defense applies (`281`**, refuting `108` and my own `276/267`); **`repair.tsx` is functional salvage, not a no-op (`286`**, revising `211` — only the durability *model* is dead); and combat does use the blessed selector (`225`, refuting `024`).
- **Favor resolved (`242` + `270`):** the W1 S1 "favor is inert" was a false-negative grep — shrine favor *does* reach power (`room.tsx:497`), so `121` drops to S2; but favor→power is **shrine-only** (the entire Familia/Blessing/Ascension/Challenge loop never touches `deityFavor`).
- **Displayed-but-not-applied (`289`):** the deity AND backstory `statPenalty` are shown during creation but never applied, so every character is pure upside — a direct MINDSET ("every benefit shows its cost") violation.
- **Dead / aspirational UI quantified:** the tutorial was trimmed 6→3 but left **4 complete orphaned screens (~1015 LOC, `291`)**; the codex ships 3 of 4 categories as permanent "Soon" stubs (`296`); the "Haptic Feedback" toggle is a placebo that controls nothing (`292`).
- **Two systemic cross-screen patterns:** a **raw-`.points`-read-as-grade** bug recurs at 5 sites (`279/261/218`/level-up/boss), and **5+ off-token color palettes** (`236/247/255/275/280/284/297`) make the same tier/grade render different colors across screens.
- **Verified-good:** combat reads the blessed selector (`225`), `clearAllStores` fires on every New Game path (`295`), the soul system initializes at creation (`290`), settings cheats are `__DEV__`-gated out of production (`294`), and a global `ErrorBoundary` wraps the app (`297`).

## What Wave 3 (combat-data + progression data, `298–342`) added

The 10-unit data pass read every line of the content layer **and** ran a re-runnable harness that imports the
real data barrels — and it delivered the thesis as a hard count. **0 new S1s** (the data doesn't add critical
defects); ~9 new S2s; the rest confirm/quantify existing roots.

- **One-line verdict:** *the content authoring + data integrity are **excellent end-to-end** (clean refint, no
  dup ids in monsters/weapons/achievements/materials, outstanding voice across 36 monsters / 338 weapons / 20
  bosses / 123 achievements / 51 jobs / 53 events); **every defect lives in the runtime that should read that
  content and apply it.***
- **"Loot is King" is hollow (`311`, S2):** `specialMechanic` — the signature power on **111/338 weapons incl.
  all 34 uniques** (Godslayer's crit-chain, World Ender) — has **no reader anywhere**: not combat, not even a
  display. Cool gear's powers neither execute nor show.
- **Hybrid weapons don't hybridize (`312`, S2):** no weapon uses a hybrid `category`; the dual-stat `primaryStats`
  path is gated behind a condition that's **always false**, so 162 dual-stat weapons scale off one stat and the
  "imbued" (physical+magical) weapons drop their arcane half. *(This refutes the W1 hybrid-mis-scale framing —
  the routing never even engages.)*
- **Boss puzzles are narration (`316`, S2):** all 20 bosses *describe + display + "reveal"* a unique mechanic
  (Corrosive Shell, Pack Threshold) that **combat never reads** — the fight is a regular generated monster. The
  game teaches a puzzle the fight ignores. The authored **floor-100 finale (Skaervox)** is **triply unreachable**
  (`322`: past the 303 wall + display-only mechanic + the dead L10 crown).
- **The achievement system is ~27%+ unreachable (`325/326/327/329/333`):** **20/123 (16%) uncompletable** via 11
  dead requirement types (incl. 4 STANDARD-tier shown as achievable), the **entire Mythic prestige tier**
  undiscoverable (a non-functional `'undiscovered'` source → a 0-progress catch-22), a type-blind `custom`
  mechanism, and conduct constraints broken by cumulative counters. *(Excellent authoring; pure runtime/wiring.)*
- **63% of stat-builds get no job (`335`, S2)** — only 21 of 56 top-3-stat combinations have a job, so most
  builds reach Level 2 **class-less** (gracefully — a "Continue" fallback, no soft-lock); and the entire
  **support-job archetype's starter skills are inert** (`336`, the dead `buff` effect — champion/monk are no-ops).
- **The balance wall, executed (`303`, S2):** the long-owed sim ran on the real formulas — the run is
  **unwinnable past ~floor 15** (not 86), because `monsterLevel≈floor` (1→100) while player level is gated 1→7.
  This is *why* the authored back half (bosses 20–100, the finale, the capstone) is unreachable.
- **Machine-caught breaks the eye missed** (proving "execute, don't just read"): `304` (elder_dragon ice
  weak+immune), `321` (5 dangling deep-boss achievement ids), `337` (6 base↔spec dup job ids), `340` (16
  dangling loot→material refs). All are whole-set/cross-file assertions a line-read structurally can't do.
- **Verified-good / fairness:** pristine referential integrity, the **20-boss conversation system + the 53
  dungeon events** are top-tier content, job selection correctly uses effStat (not raw points), and the empty-job
  case is handled gracefully. The catalogs are clean; the gaps are wiring + coverage.

## System health scorecard (Waves 1+2 verified + Wave-3 DC/DPr; ⏳ = awaiting its wave)

| System | Verdict | Notes |
|---|---|---|
| Build / Deploy | 🔴 Broken from clean checkout | S0 untracked imports; no test/lint gate |
| State & Persistence | 🟠 Leaks across permadeath | `002` reset gaps (104/098); several dual-source stores (favor, rep, volume); no persist-migration |
| Dungeon / Playthrough | 🟠 Farming exploit | `080` node re-arm + backward nav; floors re-roll on ascend (082); dead `shop` node + biomes |
| Combat | 🟠 Works; nav-integrity holes | `051/189` 0-dmg softlock; `190` status schism; `162` deep-floor scaling; W2: `220` behavement double-count confirmed, `234` retreat-flee duplicate, `264` iOS swipe-back unguarded; enchant/blessing application is data-layer dead (188/181) |
| Familia / Deity / Pantheons | 🟠 Favor inconsistently synced | `121`→S2 (shrine favor DOES reach power via `room.tsx:497`; events/challenges don't — 242); `180` divergent tables; `181` domain blessings display-only; pantheon *content* = Wave 3 |
| Stats / Falna | 🟡 Sound carry model, dead tuning surface | carry math real; `151` constants disconnected (10× drift); `150` grades compressed + near-cosmetic |
| Achievements / Leveling | 🔴 ~27%+ unreachable (data verified) | **123 achievements, excellent voice, but ~27%+ uncompletable across 4 vectors**: `325` 20/123 (16%) use 11 dead requirement types (4 STANDARD-tier shown as achievable); `326` the entire Mythic tier is undiscoverable (`'undiscovered'` source has no handler); `327` type-blind `custom`; `329/333` conduct constraints broken by cumulative counters |
| Soul / Denatus / Paragon | 🔴 Climax **unreachable** (+ multiply broken) | **`259` the Level-10 ceremony is unreachable → `paragonTitle` always null (Wave-2 S1)**; even if reached: `176` sort bug; `177` dead passives; `178` Mythic unreachable; `093` double-count |
| Sacred items | 🔴 Substantially unobtainable | `099/207/208` — catalog ≫ evaluator, reveal-favor inert, double-locked by `121` |
| Economy (Shops/Blacksmith/Market) | 🟠 Flat sinks; repair is a no-op | `113` gold-loss; `211` durability never degrades; `104` rep-spend bleed; `214` triplicated NPC |
| Weapons / Equipment | 🟠 Clean data, signature powers inert | **338 weapons, 0 dup ids, all damageTypes canonical** — but `311` `specialMechanic` dead on 111/338 (incl. all 34 uniques); `312` dual-stat scaling never engages (162 weapons' 2nd stat inert); `188/191/193/194` enchant/penalty/accessory effects dead; `314` LCK under-provisioned |
| Jobs / Class system | 🟠 Clean data, big coverage gaps | **51 jobs + 18 specs, ref-safe, effStat-keyed (good)** — but `335` 63% of stat-builds have no job (21/56 triples); `336` support archetype's starter skills inert (dead `buff`); `337` 6 base↔spec dup ids; `338` only 9/51 jobs branch to a spec *(refutes 202)* |
| Monsters / Bosses | 🟡 Pristine data + best content; mechanics unwired | **36 monsters + 20 bosses: 0 dup ids, complete coverage, outstanding voice** (the boss conversations are the project's best content); `316` boss signature mechanics display-only (fight is a regular monster); `304` elder_dragon ice contradiction; `163` latent (no `baseCR:0`); `298` poison non-viable; bosses 30-100 still untracked-in-git (S0 `001`) |
| Components / Design system | ⏳ Unverified (Wave 4) | prior agent-pass claims (orphans, 0 `React.memo`, hardcoded hex, "no font") are **unconfirmed** — and that pass's audio claim was already **refuted** first-hand (`143`); re-verify before trusting |
| Docs | 🔴 Drifting both directions | PROGRESS *understates* Phase-2 (Discovery/Challenges/audio all done); CLAUDE.md *overstates* the stack (reanimated/expo-av). See `07` |

## Coverage (honest)

| Wave / Area | Status |
|---|---|
| **Wave 1 — engine spine** (15 stores, `clearAllStores`/lib, 19 core type modules) | ✅ **Complete, first-hand, line-by-line** (`KV-AUD-001…219`) |
| Repo hygiene, build/config/deploy, type-check baseline | ✅ Done (first-hand) |
| Balance reasoning + internet benchmarking | 🟡 In progress (`05`) — `162` deep-floor sim still owed |
| **Wave 2 — app screens** (combat/room/floor/town/creation/tutorial) | ✅ **Complete, first-hand, line-by-line** (`KV-AUD-220…297`, 10 units W2-P1…P10) |
| **Wave 3 — data & content** | ◐ **In progress.** ✅ combat-data (monsters/weapons/bosses) + progression (achievements/jobs/skills/consumables/materials/loot/events) **COMPLETE, first-hand + harness-verified** (`KV-AUD-298…342`). ⛔ Pending: **19 pantheons** (~24K LOC) + **DI items/relics** (discharges the `099` count) |
| **Wave 4 — components / constants / hooks / config + tool sweep** (`ts-prune`/`knip`/`madge`) + final synthesis | ⛔ Not started (re-verifies the prior agent-pass component claims) |

The prior in-repo audit (`docs/AUDIT_2026-06.md`) is treated as a **checklist to confirm/refute**, never
as coverage; this audit supersedes it. The verified Wave-1 findings above are stable regardless of the
remaining waves.
