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

*(entries follow)*
