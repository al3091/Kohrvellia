# Kohrvellia — Full Audit Plan (consolidated, in-repo copy)

> The authoritative working copy lives at `~/.claude/plans/`; this is the durable in-repo mirror.
> Binding rules & the 10-lens rubric are in **`01_CHARTER_AND_RUBRIC.md`** (not repeated here).
> Live progress + the per-unit catalog: **`AUDIT_LEDGER.md`**. Findings: **`ALL_FINDINGS.md`** (register)
> and `findings/*.md` (full prose).

## Goal
A cold, external, **report-only** audit of all ~86K LOC / 325+ files — folder by folder, file by file,
line by line — answering for every system: **Is it correct? Is it optimized (incl. balance)? Is it
actually connected (vs "floating code")?** Deliverable: an evidence-backed findings report + a
prioritized remediation backlog. No game-code changes.

## Engagement parameters (owner-confirmed)
| Parameter | Decision |
|---|---|
| Action scope | **Report-only.** No edits to `app/`/`src/`/config/content. |
| Depth | **Exhaustive, first-hand.** Every line; every data entry. *Specificity > velocity.* |
| Prior work | **Full independent re-read.** The in-repo `AUDIT_2026-06.md` + any sub-agent report are **claims to verify**, never coverage. |
| Sequencing | **Engine-first by layer:** Wave 1 stores+types → Wave 2 screens → Wave 3 data/content → Wave 4 remainder + synthesis. |
| Execution | **Sequential, one unit at a time, direct reading.** No parallel agent swarms (that exhausted the budget on the first attempt). |
| Sessions | **Many, resumable.** Checkpoint after every unit so a token cutoff loses ≤ 1 in-flight unit. |

## Why the first attempt was shallow (root cause → the fix)
1. Spawned 4 heavy agents in parallel → shared token budget exhausted → 3 returned nothing.
2. Leaned on a prior audit + one agent instead of reading code first-hand.
3. No checkpoint/resume design → forced a premature "consolidation" instead of pausing.
The current method fixes all three: sequential first-hand reading + a durable ledger + per-unit checkpoints.

## Resumable architecture (the core mechanism)
- **`AUDIT_LEDGER.md`** — single source of truth: a `▶ RESUME POINTER` (next finding ID + NEXT UP unit),
  the full ~60-unit catalog with TODO/WIP/DONE status, and an appended session log. Updated **every unit**.
- **`findings/*.md`** — append-only per-area detail (`config_lib_hygiene`, `stores`, soon `types`,
  `screens`, `data_*`, `components`). Each finding uses the schema in `01`.
- **`ALL_FINDINGS.md`** — the consolidated register + cross-finding reconciliation.
- **Top-level rollups** (`00`,`02`–`07`) — regenerated at wave boundaries.

### Per-session runbook
1. Read `01_CHARTER_AND_RUBRIC.md` (rules + lenses). 2. Read `AUDIT_LEDGER.md` → take **NEXT UP**, mark WIP.
3. Read the unit's file(s) **fully**; apply all 10 lenses; trace connectivity; confirm/refute prior claims
with caller greps. 4. Append findings (continue IDs) to the area file. 5. Mark unit **DONE**, bump the ID
counter, set the new **NEXT UP**, add a session-log line. 6. Continue while budget allows, else stop —
state is already saved.

### Token discipline
Sequential only; one unit fully read+persisted before the next; read in chunks, write findings, don't hoard
file text; **stop a unit early and checkpoint** rather than risk a mid-write cutoff. Caller greps are used
liberally to resolve connectivity ("is X actually called?") cheaply.

## Work-Breakdown Structure (~60 units, 4 waves)
**Wave 1 — Engine spine (14 units):** 7 store units (combat · character · dungeon · soul+sacred · shop+
market+inventory+blacksmith · deity+achievement+job · game+sound) + 6 type units (Stats+Character ·
Monster+Dungeon · Deity+Behavement · Weapon+Armor+StatusEffect · Achievement+Skill+Job+Loot+Consumable ·
Shop+SacredItem+Blacksmith+PlayerSnapshot+index) + 1 lib unit. *(In practice store units were split for
depth — see ledger.)*
**Wave 2 — Screens `app/` (~11 units):** combat.tsx · room.tsx · floor.tsx · level-up/denatus/job-select ·
encounter/travel/epitaph/boss-* /inventory · town hub+familia · guildhall+shops · blacksmith ·
character-creation · tutorial+settings+codex+index+_layout.
**Wave 3 — Data & content, exhaustive (~28 units):** 19 pantheons · items/relics · monsters · weapons ·
bosses · achievements · jobs · skills · consumables/materials/loot/events/ramifications.
**Wave 4 — Remainder + synthesis (~7 units):** components (53) · constants+hooks · config/build/docs ·
tool sweep (`ts-prune`/`knip`/`madge`/`depcheck`/`tsc` + data integrity scripts) · final synthesis
(regenerate `00`,`02`–`07`).

**Scale:** ~60 units at the deep bar ⇒ many sessions. Owner has accepted multi-session; depth is the priority.

## Status (as of session 20)
**★ Wave 1 (engine spine: stores + lib + types) COMPLETE** — 18 units, `KV-AUD-001…219` (178 first-hand
+ 41 seeds), and the **Wave-1 synthesis is finished**: all five rollups (`00`,`02`,`03`,`05`,`07`)
regenerated from `ALL_FINDINGS.md`. **5 S1s** (002/080/099/121/190) + 1 S0 (001 build-break, still live).
**NEXT: Wave 2 (screens) @ `app/dungeon/combat.tsx`.** One analysis owed: the 100-floor scaling sim (162).
See `AUDIT_LEDGER.md` for the live pointer.

## Verification of the audit itself
Every finding: first-hand `file:line` + quoted evidence + severity + confidence. Every prior/sub-agent claim
touching an audited file is explicitly confirmed or refuted (≈⅓ of Wave-1 work was corrections, both
directions). Wave 4 will validate connectivity/dead-code mechanically (`ts-prune`/`knip`/`madge`) and data
integrity via scripts.

## Out of scope
Report-only — no game-code edits, dependency upgrades, refactors, or content rewrites; all fixes land in
`06_REMEDIATION_BACKLOG.md`.
