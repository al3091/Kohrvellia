# KOHRVELLIA — Known Issues & Bugs

> Living document. Add bugs as they're found. Resolve them here when fixed. Reference by ID in commits.
> Format: `fix: resolve BUG-XXX — brief description`

---

## Critical (Blocks Gameplay)

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-001 | `dungeon/combat.tsx` | App force-closed during combat leaves `useDungeonStore` with the room marked unvisited, but `useCombatStore` (non-persisted) is cleared. Player re-enters room without any combat state — may trigger a second monster encounter for a room that should have been clear. | 2026-05-06 | OPEN |
| BUG-002 | `app/index.tsx` | `clearAllStores()` on New Game does NOT reset `useJobStore`, `useSoulStore`, or `useDeityStore`. A new character starts with a previous run's job, soul state, and possibly the old deity's bonus stat applied to a fresh character. | 2026-05-06 | RESOLVED |

---

## Major (Degrades Experience)

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-003 | `town/inventory/index.tsx` | When swapping weapons via `equipWeapon()`, the old weapon is moved to inventory. If inventory is at BAG_CAPACITY (16 slots), the old weapon is silently destroyed with no warning. Player loses equipped item without feedback. | 2026-05-06 | OPEN |
| BUG-004 | `dungeon/level-up.tsx` | Level-up ceremony can potentially be dismissed (back gesture or navigation) before all phases complete. `performLevelUp()` may not be called, leaving character with `achievementsCompleted` populated but level unchanged. State is partially committed. | 2026-05-06 | OPEN |
| BUG-005 | `dungeon/combat.tsx` | `useCombatStore.endCombat()` resets `monster` to null and `rewards` to null. If this is called before the victory screen reads `rewards`, loot is lost. Screen timing dependency needs to be audited. | 2026-05-06 | OPEN |
| BUG-006 | `dungeon/job-select.tsx` | Job selection at Level 2 — if player backs out of `job-select.tsx` without selecting a job, `useJobStore.hasSelectedJob` remains false. On next session, the job select screen may re-trigger or the player skips it entirely depending on navigation logic. | 2026-05-06 | RESOLVED |

---

## Minor (Polish / Edge Cases)

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-007 | `src/data/pantheons/` | 7 files with `.ts.tmp` extension (inca, maya, persian, polynesian, shinto, vodou, yoruba) are not imported by the pantheon index. They are dead weight but not harmful — however they inflate the apparent pantheon count and may confuse future contributors. | 2026-05-06 | RESOLVED |
| BUG-008 | `dungeon/combat.tsx` | Weapon Triangle damage modifiers (Slash → Flesh, Blunt → Bone/Armor) are documented in `DESIGN_COMBAT.md` but not implemented in `playerAttack()`. All physical attacks use flat damage with no type advantage/disadvantage. This is a missing feature presented in the tutorial. | 2026-05-06 | OPEN |
| BUG-009 | `app/index.tsx` | `epitaph` text on title screen is computed via `useMemo` with empty dependency array (stable on mount). The `// eslint-disable-line` comment suppresses a legitimate warning. If `lastDeath` changes mid-session (player starts a new run and dies quickly), the epitaph is stale. Low impact but worth noting. | 2026-05-06 | OPEN |
| BUG-010 | `useCharacterStore` | `resolveWeaponOutputCap()` has a legacy migration comment for saves that predate the `maxOutputCap` field. If a very old save is loaded, it falls back to `QUALITY_OUTPUT_CAP_MULTIPLIER[weapon.quality.tier]`. If `weapon.quality.tier` is undefined (corrupt save), the cap becomes `Infinity` — weapon damage is uncapped. | 2026-05-06 | OPEN |
| BUG-011 | `useCombatStore` | `addLogEntry()` keeps only the last 20 entries (`.slice(-20)`). This is correct, but `DESIGN_COMBAT.md` says "last 8 entries" and `PROGRESS.md` says "last 8 entries". The implementation uses 20. Documentation is stale — pick one and update docs or code. | 2026-05-06 | OPEN |
| BUG-012 | `useCharacterStore.performLevelUp()` | After `performLevelUp()`, the function calls `useAchievementStore.getState().unlockAchievementsForLevel(updatedCharacter.level + 1)`. This passes `level + 1` after incrementing, so it always reveals achievements for the level ABOVE the new level. May be intentional (showing next milestone) or an off-by-one error. | 2026-05-06 | NEEDS REVIEW |
| BUG-013 | `useDungeonStore` | No store reset is called when entering the dungeon from a fresh character (after character creation → tutorial → town → dungeon). If any dungeon state persists from a previous session that wasn't properly cleared, floor generation may use stale data. | 2026-05-06 | OPEN |
| BUG-014 | `useDeityStore` | Deity store is persisted but there is no explicit reset in the `clearAllStores()` function called during New Game. A new character retains the previous character's patron deity selection. The deity selection screen in character creation should overwrite this, but if the player skips or backs out, the old deity persists. | 2026-05-06 | RESOLVED |
| BUG-015 | `useMarketStore` | `useMarketStore.onFloorDescend()` is never called anywhere in the dungeon flow. Market events will never spawn, tick, or expire during a run — the entire living economy system is wired internally but has no external trigger. Needs to be called from `useDungeonStore` on floor transition. | 2026-05-14 | OPEN |

---

## Design Decisions Needed

| Topic | Context | Options | Status |
|-------|---------|---------|--------|
| Flee cost | Fleeing has no HP/SP cost — only AGI check + floor penalty + lost training opportunity. May feel too "free" for deep floors. | (A) No change — the lost proficiency and fear of failing the check is sufficient cost. (B) Failed flee = 10% max HP damage. (C) Each attempt costs 5 SP. | OPEN — needs Thane |
| Deity eviction UX | At favor 0-10, design says deity abandons adventurer. Currently no UX for this transition — favor can drop to 0 with no consequences. | (A) Disable domain blessing only — no eviction. (B) Forced shrine visit to repair relationship. (C) Full eviction — player must choose new deity in town. | OPEN — needs Valdris |
| Paragon abilities | Level 10 unlocks Paragon and Denatus title, but no mechanical bonus beyond title is implemented. | (A) Passive stat bonuses from soul title adjectives. (B) A unique Paragon skill based on top behavement vector. (C) Meta-progression unlock (affects future runs). | OPEN — needs Valdris + Thane |
| Combat log length | Implementation: 20 entries. Documentation: 8 entries. | Pick one. 20 is better for UX — shorter scrolls are less useful. Update docs to say 20. | OPEN |
| `.ts.tmp` pantheons | 7 half-built pantheon files exist but aren't loaded. | (A) Complete all 7. (B) Delete them. (C) Mark as `[PLANNED]` and leave. | OPEN — needs Valdris |
| Armor system | Equipment slots for head/chest/hands/legs are defined in types and store, but no armor data exists in `src/data/`. The only implemented equippable is weapons. | (A) Implement armor drops in Phase 2. (B) Remove armor slots from UI until implemented (reduce confusion). | OPEN — needs Korben |

---

## Resolved

| ID | Issue | Resolved | Fix |
|----|-------|----------|-----|
| BUG-002 | `clearAllStores()` did not reset `useJobStore`, `useSoulStore`, or `useDeityStore` | 2026-05-14 | Added explicit `.reset()` calls for all three stores in `src/lib/clearAllStores.ts` |
| BUG-006 | Job select screen allowed back navigation before job was selected | 2026-05-14 | `BackHandler` subscription in `job-select.tsx` blocks hardware back until `allowBack.current` is true |
| BUG-007 | 7 `.ts.tmp` pantheon files were dead weight in `src/data/pantheons/` | 2026-05-14 | Files deleted — will be replaced with complete implementations when pantheons are prioritized |
| BUG-014 | Deity store not cleared on new game | 2026-05-14 | Resolved by same fix as BUG-002 — `useDeityStore.getState().reset()` added to `clearAllStores()` |

---

*"Pike assumes everything is broken. Prove her wrong."*
