# 13 — VERIFICATION LOG (append-only; post-G1 execution)

> One entry per executed batch: date · batch id · commits (with KV-AUD ids) · harness layers re-run + results ·
> new findings surfaced (ledger row ids) · sim re-baselines. Created at Phase-E close; **empty until Gate G1 is signed.**

## Baselines at G1 (2026-06-10, working tree = `backup/working-tree-2026-06-10` @ `3b8603e`)
- `scaling_sim.js`: lose ~fl.10 · one-shot ~fl.20 · fl.86 atk 6052 vs HP 617 (the 303 baseline)
- `relic_check.ts`: 244/588 unobtainable · 15 false-unlocks · 490 reveal-locked · 107 non-canonical damageTypes
- `ach_check.ts`: 20/123 uncompletable · 13 undiscoverable · boss ids 5/10
- `tsc --noEmit`: exit 0 (the 352 false green — expected to surface errors at B-08 by design)
- `madge --circular`: 23 (3 runtime + 20 type) · `knip`: the 354 roster

*(entries follow)*
