# Kohrvellia Audit — Charter & Analysis Rubric

> The binding rules and the per-file analysis prompt used for the June 2026 external audit.
> **Mode: report-only on GAME code** (no change to `app/`/`src/`/config/CI). Findings carry `file:line`
> evidence + a fix direction. As of S37 the audit also runs a **walled-off machine-verified harness**
> (`audit/`, isolated — see Part C); it *measures*, it never edits game code.
> **The standard is non-negotiable: letter by letter, code by code, line by line. Nothing overlooked,
> nothing glanced. Most detailed, most specific. Specificity > velocity; tokens are not a constraint.**
> Companion files: `00_EXECUTIVE_SUMMARY`, `02_FINDINGS`, `03_CONNECTIVITY_AND_DEADCODE`,
> `04_DATA_INTEGRITY_AND_CONTENT`, `05_BALANCE_AND_BENCHMARKS`, `06_REMEDIATION_BACKLOG`,
> `07_DOC_RECONCILIATION`, `08_DEFECT_PATTERNS` (root-cause register). **Live state + resume pointer:
> `AUDIT_LEDGER.md` — read it FIRST. Canonical findings: `findings/*.md`. Master register: `ALL_FINDINGS.md`.**

## Part A — Charter (Rules of Engagement)

- **R1 — Zero trust / verify everything.** Docs, comments, commit messages, `PROGRESS.md`/`BUGS.md`
  claims, a prior in-repo audit (`docs/AUDIT_2026-06.md`), and even this audit's own sub-agents are
  *hypotheses to confirm against source*, never evidence. (Proven necessary: a sub-agent falsely
  reported `node_modules` committed — it is not; the prior audit rated a build-breaking untracked
  file as "LOW".)
- **R2 — Evidence or it didn't happen.** Every finding cites `path:line` and quotes the code.
- **R3 — Reproduce or trace.** Behavioral bugs get repro steps or an exact traced code path.
- **R4 — Severity + confidence are explicit** on every finding.
- **R5 — Connectivity is a first-class finding class.** Orphans, no-op writes, and aspirational
  stubs ("planned but never built") are defects, not footnotes.
- **R6 — Measure against the project's own laws** (CLAUDE.md / MINDSET.md): no `any`; never hardcode
  balance (use `GameConstants.ts`); always clear all stores on new game; permadeath is irreversible;
  voice/tone rules. The docs themselves are also audited for accuracy.
- **R7 — Read-only on game code; the harness is walled-off.** No edits to `app/`/`src/`/config/CI. The
  machine-verified harness lives in an isolated `audit/` tree with its **own** `package.json` (it imports game
  source **read-only** and never touches the game's manifest or build). The audit does **not** merge it; at the
  end its configs ship as **reviewable patches** (`audit/integration/`) for the team to adopt on their terms.
- **R8 — Cover the unglamorous** (build/config/deploy, gitignore, type-checker output, dep manifest
  vs imports, garbage files, line endings, AsyncStorage keys).
- **R9 — No finding without a fix direction.**
- **R10 — Determinism & save-safety bias** — state-bleed, hydration corruption, RNG-dupe, and
  permadeath-integrity issues are high-priority by default.

## Part B — Rubric (the prompt applied to EVERY file)

Walk each file top-to-bottom; record every hit against these ten lenses.

- **L1 Correctness** — logic/off-by-one/operator/precedence, inverted conditions, bad formulas,
  float/int drift, NaN/Infinity, null/undefined, OOB, async ordering, races, state mutated outside
  actions, stale closures, `useEffect` deps.
- **L2 Type safety** — `any`/`as any`/`as unknown as`/`as never`/`@ts-ignore`, unsafe casts, `!`
  abuse, `Set<string>`/`string` where a union belongs, enum vs string drift.
- **L3 Connectivity & dead code (priority)** — exported-but-unimported, imported-but-unused,
  handlers never bound, store actions never called, data never referenced, behavements/achievements
  that never fire, `set()` writes never read, unreachable routes, planned-but-never-built. Classify
  *orphan / no-op / aspirational*.
- **L4 Design-law compliance** — hardcoded balance outside `GameConstants.ts`, `any`, logic in the
  wrong layer, missing `persist`, incomplete new-game reset, reversible death.
- **L5 Optimization** — unmemoized recompute, full-store subscriptions/re-renders, O(n²), redundant
  AsyncStorage writes, oversized persisted blobs, `ScrollView` vs `FlatList`, unbounded logs.
- **L6 Robustness & persistence** — hydration/migration safety, corrupt-save handling, app
  backgrounded mid-combat, AsyncStorage key collisions, error boundaries, boundary guards.
- **L7 Data integrity** — unique IDs; referential integrity (boss.baseMonsterId∈monsters,
  achievement.discoverySource valid, deity.domain∈domains, job.starterSkillId∈skills, relic→deity,
  loot→category, upgrade.materialId∈materials); enum validity; sane ranges; counts vs docs.
- **L8 Content & voice (exhaustive)** — every player-facing string vs MINDSET.md (active voice,
  1–2 sentence flavor, no hedging, naming conventions); lore coherence; typos; shipped placeholders.
- **L9 Balance** — damage/defense formulas, CR-vs-floor, Falna growth, economy (sources vs sinks,
  pricing, upgrade costs), favor thresholds, drop rates, output caps — exploits / dead-ends /
  dominant strategies / softlocks, with external benchmarking.
- **L10 Security & hygiene** — secrets, boundary validation, debug code, committed temp/garbage,
  manifest vs imports.

### Severity

| Sev | Definition |
|---|---|
| **S0 Critical** | Crash, data loss, permadeath/state-bleed corruption, build-breaking, or a core loop that can't complete. |
| **S1 High** | Wrong-but-not-crashing logic, exploit, balance softlock, a "complete" system that is materially unwired. |
| **S2 Medium** | Degraded correctness/perf/UX, doc-vs-code drift on a real mechanic, notable dead code. |
| **S3 Low** | Minor optimization, small voice/lore inconsistency, harmless dead code. |
| **S4 Info** | Observation, tech-debt, housekeeping. |

### Finding schema

```
[KV-AUD-###] <title>
Severity S# | Confidence Confirmed/Likely/Needs-repro | System <system> | Lens L# | Prior-ref <AUD-### if any>
Location: <path:line>
Evidence: <quoted code>
Impact: <what breaks / why it matters>
Recommendation: <concrete fix direction>
```

## On the prior audit (`docs/AUDIT_2026-06.md`)
A partial external audit (started 2026-06-01) covering hygiene/types/constants/stores (its sessions
S1–S4) exists untracked in the repo; data content, components, screens, synthesis, balance, and
benchmarking (S5–S11) were never done. Under **R1** every one of its ~90 findings is treated as an
unverified claim. This audit independently re-verifies its High/Critical findings, completes the
uncovered scope, adds the connectivity/dead-code and balance/benchmark passes, and supersedes it.
Crosswalk of prior `AUD-###` → this audit's `KV-AUD-###` is in `07_DOC_RECONCILIATION.md`.

---

## Part C — Methodology & the Machine-Verified Harness (added S37–S38)

**The standard (restate, because it governs everything): letter by letter, code by code, line by line.** Every
file in scope is read top-to-bottom, **first-hand**. No skimming, no "looks fine," no sampling where judgment is
required. **Specificity > velocity. Tokens are not a constraint** — depth and exhaustiveness win every time.

**Methodology evolution.** Waves 1–2 were *read-and-reason*. That is thorough but has a proven failure mode: the
static reading of finding **162** put the "unwinnable" wall at floor 86; **executing** the sim put it at
**~floor 15** (KV-AUD-303). From S37 the audit is a **hybrid: human first-hand judgment + machine verification**:

> **Anything that CAN be machine-verified IS — exhaustively, reproducibly, importing the REAL source (no
> transcription). Human first-hand reading is reserved for judgment a machine can't do — and is NEVER skipped
> there.** Quantitative claims get executable models that import the real game functions (ground truth).

**The two-layer rule for data/content (R1 stays intact).** (a) The *verifiable* layer (enums, IDs, refs, ranges,
dead data) → **script it to 100% coverage** (a script beats eyes for completeness — it already caught the
`elder_dragon` ice weak+immune contradiction that a full line read missed, KV-AUD-304). (b) The *qualitative*
layer (lore, voice, design intent) → **still read first-hand, line by line.** Scripts remove the cross-checking
burden *from* the reading; they do **not** replace it. **"Sampling" is never a substitute for reading the
voice/logic** — that would be a token-saver masquerading as rigor.

**The harness — 6 analysis layers + 2 infra layers** (built in `audit/`; full design in
`~/.claude/plans/abundant-juggling-bumblebee.md`). Sequenced: **C+D first** (core math + data), then A+B, then E+F, then G+H.
- **A. Correctness & wiring** — `ts-morph` AST queries + eslint `switch-exhaustiveness-check` + the sim (mechanizes pattern **P1** "modeled-but-not-wired").
- **B. Structure & dead code** — `knip` (NOT ts-prune/depcheck — archived 2025; config `entry:['app/**']` for Expo-Router or it false-positives every screen), `dependency-cruiser` (store-hierarchy + no-circular), `madge`, ts-morph reachability.
- **C. Data integrity** — `zod` schemas validating **100% of** `src/data/**` (enum membership on stringly-typed fields, value invariants, contradictions, dup IDs, dead union members) + referential-integrity cross-checks. *(Live: `audit/schemas/`.)*
- **D. Balance** — Monte-Carlo sim that **imports** `calculateDerivedStats`/`createMonsterInstance`/`playerAttack` via `tsx` (ground truth) + `fast-check` invariants. *(Live keystone: `audit/sim/smoke.ts`.)*
- **E. Security / vulnerability** — save-tamper / anti-cheat (AsyncStorage = unencrypted `localStorage` on web → a permadeath save is trivially edited), `npm audit` + `osv-scanner`, web-bundle exposure, input validation.
- **F. Performance / inefficiency** — Expo Atlas bundle (dead-weight shipping), algorithmic hotspots (O(770)/O(123) per-tick scans), re-render anti-patterns, persisted-size vs the 6MB/2MB AsyncStorage limits. *(On-device FPS is the one thing the static lab can't measure — flagged.)*
- **G. Regression** — `vitest` + `fast-check`; every S1/S2 gets a failing test encoding the bug; `stryker` mutation testing validates the tests.
- **H. Findings-as-data** — `audit/findings.yaml` (rollups generated from it) + a citation validator (every `file:line` still exists).

**Harness location & how to run** (walled-off; never touches game files):
- `audit/` has its **own** `package.json` (deps so far: zod, tsx, fast-check, glob). The game `package.json` is untouched.
- Run from repo root: `./audit/node_modules/.bin/tsx audit/<script>.ts`, or `npm --prefix ./audit run <smoke|validate|sim>`.
- Scripts import game source **relatively + read-only** (`../../src/...`); proven to run under `tsx` (the pure formula/data files have no RN/Zustand transitive imports). For RN-coupled modules (e.g. `useCombatStore`), extract/stub the formula.
- `.audit_tmp/` is scratch (older hand-rolled scripts + JSON dumps) — migrate useful parts into `audit/`; gitignore the scratch.

---

## Part D — Finding workflow, schema, and rituals

**Finding schema (upgraded S37).** Beyond the base schema (Part B), every NEW finding also carries:
**Repro/symptom** (the exact player action or traced path — R3 made mandatory) · **Fix-effort** (trivial/medium/high
+ blast-radius) · **Verification-method** (`read`/`grep`/`AST`/`sim`/`test` — so confidence is explicit) ·
**Pattern** (its `08_DEFECT_PATTERNS` root, so "fix 1 root → close N").

**ID numbering.** `KV-AUD-###`, monotonic, **never reused**. The **Next finding ID** lives in the ledger's RESUME
POINTER. *Gotcha:* per-unit `§4` registers in `ALL_FINDINGS.md` write IDs as **bare numbers**, so `grep KV-AUD-###`
undercounts — count `^\*\*KV-AUD-` in the `findings/*.md` canon instead.

**Canonical vs rollup.** `findings/*.md` (`config_lib_hygiene`, `stores`, `types`, `screens`, `data_*`) are the
**canonical first-hand prose** — write findings there first. `00`/`02`/`03`/`05`/`07`/`08`/`ALL_FINDINGS` are
**synthesis rollups** reconciled from the canon. **Rollups get a full synthesis pass at each WAVE boundary** (as
Wave-2 did at S35) — not per-finding — except `ALL_FINDINGS.md` (master register) + `AUDIT_LEDGER.md`, kept current
continuously.

**Per-unit discipline (one unit per turn, clean checkpoint):** (1) read the unit **first-hand, every line** (+ run
the relevant harness layer); (2) write findings to the canonical `findings/*.md`; (3) **checkpoint the ledger**
(Next ID, catalog row → DONE, NEXT UP tail, append the session-log line); (4) regenerate the affected
**`WAVE_n_FINDINGS.md` backup** via Bash `cat` (lossless; content → disk not context — compaction insurance).

**Edit gotchas.** After a compaction the file-state is invalidated → **Read before Edit**. Anchor on **exact
verbatim** text (em-dashes `—`, middle-dots `·`, arrows `→`, `✓`). The ledger `NEXT UP` field is one giant
accumulated block — edit only its **tail**.

**Verification rituals (after edits).** `grep -c '^\*\*KV-AUD-' findings/*.md` (counts); scan for **stray CJK**
with the Grep tool / ripgrep `\p{Han}` (a recurring artifact — **note:** don't embed literal CJK range chars in
docs or this very check self-trips; git-bash `grep -P` is unreliable here, so use ripgrep); harness runners
self-verify via exit code; the Layer-H validator confirms no stale `file:line` citations.

---

## Part E — Resuming from a FRESH conversation

**Step 0 — open at the right root + ignore the wrong manual.** Work from
`C:\Users\alons\source\repos\Kohrvellia`. ⚠ **Two-CLAUDE.md hazard:** the repo-root
`C:\Users\alons\source\repos\CLAUDE.md` is **RuFlo/swarm config that CONTRADICTS this project** (mandates agent
swarms, `/tests`, 500-line files, "never create docs"). **Ignore it for this audit.** The real manual is
`Kohrvellia/CLAUDE.md`. **NO agent swarms** — this audit is sequential, first-hand, one unit per turn (a prior
swarm attempt exhausted the budget).

**Step 1 — read `docs/audit/AUDIT_LEDGER.md` FIRST.** It is the single source of truth for **live state**: the
▶ RESUME POINTER (Next ID + NEXT UP unit), the unit catalog (DONE/TODO), and the append-only session log.

**Step 2 — the doc map:**
| File | Role |
|---|---|
| `AUDIT_LEDGER.md` | **Live state / resume pointer (read first)** |
| `01_CHARTER_AND_RUBRIC.md` | This file — rules R1-R10, 10-lens rubric, severity, **methodology (Part C), workflow (Part D)** |
| `AUDIT_PLAN.md` | Goal + engagement params + wave sequencing |
| `findings/*.md` | **Canonical** first-hand findings (stores/types/config_lib_hygiene/screens/data_*) |
| `ALL_FINDINGS.md` | Master register + cross-finding reconciliation (§1, incl. R1 self-corrections) |
| `00`,`02`–`08` | Synthesis rollups (exec, seeds, dead-code, data, balance, backlog, doc-recon, **patterns**) |
| `WAVE_1/2_FINDINGS.md` | Lossless single-file backups (compaction insurance) |
| `audit/` | The walled-off machine-verified harness (Part C) |

**Step 3 — current-state snapshot** (authoritative = the ledger; this is the S38 picture):
- **Waves 1 (engine 001-219) + 2 (all `app/` screens 220-297) COMPLETE**; synthesis folded in.
- **Wave 3 (data/content) IN PROGRESS** — re-sequenced **combat-data (DC) first**. **W3-DC1 `baseMonsters.ts`
  DONE** (298-306, incl. the executed 162 sim → 303 and the Layer-C automated pass → 304-306). **Next ID 307.**
- **NEXT UP:** extend Layer-C zod schemas to deities/weapons/sacred-items; build Layer-D real-formula Monte-Carlo
  sim; then resume the first-hand `W3-DC2` read; then W3-DC3 weapons (185/153/119).
- **S0 (open):** `weaponFormulaResolver.ts` + 2 boss-table files **untracked in git** → clean build/CI fails
  (re-verified S37). **S1 set (5):** 002 state-bleed · 080 farming · 099 sacred-unobtainable · 190 status-schism ·
  259 L10-climax-unreachable. **Balance headline:** the run is unwinnable past **~floor 15** (162/303).
- **Defect patterns (08):** ~9 roots; the dominant is **P1 "modeled + displayed, never wired."** Tag every new
  finding to a pattern.

**Step 4 — the standard, restated one more time.** Letter by letter, code by code, line by line. Verify everything
first-hand (R1) — including this audit's own prior claims. Script the verifiable to 100%; read the rest in full.
Execute, don't just reason. Nothing overlooked, nothing glanced.
