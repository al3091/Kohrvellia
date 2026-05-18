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
| BUG-003 | `dungeon/combat.tsx` | When swapping weapons with full bag (16 items), old weapon was silently destroyed. | 2026-05-06 | RESOLVED — confirmation modal at combat.tsx:1337 was already implemented |
| BUG-004 | `dungeon/level-up.tsx` | Level-up ceremony could be dismissed on iOS via swipe-back before `performLevelUp()` is called. `BackHandler` only blocks Android hardware back. | 2026-05-06 | RESOLVED — 2026-05-15 |
| BUG-005 | `dungeon/combat.tsx` | `useCombatStore.endCombat()` resets `monster` to null and `rewards` to null. If this is called before the victory screen reads `rewards`, loot is lost. Screen timing dependency needs to be audited. | 2026-05-06 | OPEN — safe today but fragile; snapshot `rewards` at top of handleVictory() as future-proofing |
| BUG-006 | `dungeon/job-select.tsx` | Job selection at Level 2 — if player backs out of `job-select.tsx` without selecting a job, `useJobStore.hasSelectedJob` remains false. On next session, the job select screen may re-trigger or the player skips it entirely depending on navigation logic. | 2026-05-06 | RESOLVED |

---

## Major (Degrades Experience) — New 2026-05-15

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-022 | `app/dungeon/boss-encounter.tsx` | Boss dialogue outcome achievements (`walked_past_death`, `vanya_the_understood`, etc.) are referenced in `BossOutcome.achievement` fields and TODO comments, but no matching achievement definitions exist in any level achievement file. Achievement unlocks will silently not fire until data is added. | 2026-05-15 | RESOLVED — 2026-05-18: `walked_past_death`, `fortune_s_pet`, `boss_weakness_revealed` added to `level1Achievements.ts`; all three `executeOutcome()` cases now call `discoverAchievement()` + `updateProgress()` |
| BUG-023 | `app/dungeon/boss-cleared.tsx` | Screen exists and is complete but is currently unreachable — no routing points to it. With per-run boss fights, the screen only makes sense as an intro to the fight (showing that guild history exists) but it's not integrated. | 2026-05-15 | RESOLVED — 2026-05-18: `boss-cleared` added to `app/dungeon/_layout.tsx` Stack. Still needs a caller — `useDungeonStore` can check `defeatedBossIds` and route here before `boss-encounter` if boss was previously defeated. |
| BUG-024 | `useGameStore` + `useDungeonStore` | `useGameStore.milestoneChestsOpened` (account-level) is now shadowed by `DungeonRun.milestoneChestsOpenedThisRun` (run-level). The old field still exists in the store and in saved data but is no longer used. Confusing naming and stale field. | 2026-05-15 | RESOLVED — 2026-05-15 |
| BUG-025 | `src/data/events/dungeonEvents.ts` | `runFlags` system for multi-step events has no documentation of flag names, semantics, or valid values. Flag names like `'gamblers_coin'` are string literals scattered across the codebase with no registry. | 2026-05-15 | OPEN — needs design doc entry |
| BUG-034 | `src/data/bosses/milestoneBosses.ts` | Each `BossOutcome` has an `achievement` field with boss-specific IDs (`vanya_the_understood`, `sorath_truth_extracted`, `kutcher_song_of_truth`, `kalindi_river_wisdom`, `malik_void_scholar`) that don't exist in any achievement file. `executeOutcome()` currently ignores this field and hardcodes generic IDs, so no crash — but per-boss achievements are unreachable. | 2026-05-18 | DEFERRED — Phase 2: add per-boss achievement definitions to the appropriate level files (L1-L5), then update `executeOutcome()` to read `resolvedOutcome.achievement` instead of hardcoded IDs. |

---

## Minor (Polish / Edge Cases)

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-007 | `src/data/pantheons/` | 7 files with `.ts.tmp` extension (inca, maya, persian, polynesian, shinto, vodou, yoruba) are not imported by the pantheon index. They are dead weight but not harmful — however they inflate the apparent pantheon count and may confuse future contributors. | 2026-05-06 | RESOLVED |
| BUG-008 | `dungeon/combat.tsx` | Weapon Triangle damage modifiers (Slash → Flesh, Blunt → Bone/Armor) are documented in `DESIGN_COMBAT.md` but not implemented in `playerAttack()`. All physical attacks use flat damage with no type advantage/disadvantage. This is a missing feature presented in the tutorial. | 2026-05-06 | RESOLVED — 2026-05-16 |
| BUG-009 | `app/index.tsx` | `epitaph` text on title screen is computed via `useMemo` with empty dependency array (stable on mount). The `// eslint-disable-line` comment suppresses a legitimate warning. If `lastDeath` changes mid-session (player starts a new run and dies quickly), the epitaph is stale. Low impact but worth noting. | 2026-05-06 | OPEN |
| BUG-010 | `useCharacterStore` | `resolveWeaponOutputCap()` has a legacy migration comment for saves that predate the `maxOutputCap` field. If a very old save is loaded, it falls back to `QUALITY_OUTPUT_CAP_MULTIPLIER[weapon.quality.tier]`. If `weapon.quality.tier` is undefined (corrupt save), the cap becomes `Infinity` — weapon damage is uncapped. | 2026-05-06 | OPEN |
| BUG-011 | `useCombatStore` | `addLogEntry()` keeps only the last 20 entries (`.slice(-20)`). This is correct, but `DESIGN_COMBAT.md` says "last 8 entries" and `PROGRESS.md` says "last 8 entries". The implementation uses 20. Documentation is stale — pick one and update docs or code. | 2026-05-06 | OPEN |
| BUG-012 | `useCharacterStore.performLevelUp()` | After `performLevelUp()`, the function calls `useAchievementStore.getState().unlockAchievementsForLevel(updatedCharacter.level + 1)`. This passes `level + 1` after incrementing, so it always reveals achievements for the level ABOVE the new level. May be intentional (showing next milestone) or an off-by-one error. | 2026-05-06 | NEEDS REVIEW |
| BUG-013 | `useDungeonStore` | No store reset is called when entering the dungeon from a fresh character (after character creation → tutorial → town → dungeon). If any dungeon state persists from a previous session that wasn't properly cleared, floor generation may use stale data. | 2026-05-06 | OPEN |
| BUG-014 | `useDeityStore` | Deity store is persisted but there is no explicit reset in the `clearAllStores()` function called during New Game. A new character retains the previous character's patron deity selection. The deity selection screen in character creation should overwrite this, but if the player skips or backs out, the old deity persists. | 2026-05-06 | RESOLVED |
| BUG-015 | `useMarketStore` | `useMarketStore.onFloorDescend()` is never called anywhere in the dungeon flow. Market events will never spawn, tick, or expire during a run — the entire living economy system is wired internally but has no external trigger. | 2026-05-14 | RESOLVED — already called at `useDungeonStore.ts:473` on floor descent |

---

## Major (Degrades Experience) — New 2026-05-15 (Swarm Audit)

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-026 | `src/types/PlayerSnapshot.ts` | `useSoulStore` is persisted globally across all character runs. Boss dialogue uses `dominantVector` from cumulative behavements — a returning player's run 5 behavements pollute their current character's boss interaction flavor. `approachStyle` is correctly run-scoped (uses DungeonRun stats) but `dominantVector` is cross-run. | 2026-05-15 | RESOLVED — 2026-05-18: `soulVectorSnapshot` captured at run start in `startNewRun()`; `createPlayerSnapshot()` computes delta dominant vector from snapshot vs current scores; boss reads this-run behavior only. |
| BUG-027 | `app/dungeon/level-up.tsx` | Level-up ceremony shows "+X GLORY" from `tierRewards.gloryPoints` but these points are never forwarded to `useSoulStore`. The GLORY vector is tracked separately via behavements (boss streaks, deathless floors). UI implies soul points are accumulated; they are not. | 2026-05-15 | RESOLVED — 2026-05-18: All HEROIC+ achievement selections now fire `glory_legendary_achievement` behavement; MYTHIC additionally fires `glory_mythic_achievement`. GLORY vector is now live-tracking across ceremony choices. |
| BUG-028 | `app/dungeon/floor.tsx` | `glory_no_death_floor5/10` behavements fire on floor descent with no death-check guard. Currently correct for permadeath (can't descend if dead), but fragile for future revival mechanics (Hades deity ability). `runStats` has no deaths counter. | 2026-05-15 | OPEN — low priority until revival mechanics exist |
| BUG-029 | `src/stores/useDeityStore.ts` | `social_deity_favor_high` behavement never increments — no soul call when deity favor reaches 80+. | 2026-05-15 | RESOLVED — 2026-05-15 |
| BUG-030 | `app/town/guildhall/index.tsx` | `resource_sell_items` soul behavement never increments — guild hall sell handlers had no soul tracking call. | 2026-05-15 | RESOLVED — 2026-05-15 |
| BUG-031 | `app/dungeon/inventory.tsx` | Armor equip/unequip UI is dead for 5 of 7 equipment slots — `handleSlotPress` gates all interaction with `if (slot === 'weapon')`. Other slots do nothing on tap. | 2026-05-15 | PARTIAL — 2026-05-18: Dead armor slots hidden; only `weapon` slot rendered. A locked "Armor & Accessories — Available in a future update" placeholder shown. Full armor system deferred to Phase 3. |
| BUG-032 | `src/stores/useCombatStore.ts` | Weapon Triangle not implemented — `weaknesses` and `resistances` arrays on `MonsterBase` only feed the inspection text string. No damage type math exists in `playerAttack()`. Tutorial implies type advantages exist. | 2026-05-15 | RESOLVED — 2026-05-16 |
| BUG-033 | `useDeityStore` + `app/dungeon/combat.tsx` | Deity challenge progress completely unrouted — `updateChallengeProgress()` was called only on monster kills. All non-kill challenges (`gold_collected`, `heal_self`, `dodge_attacks`, `survive_low_hp`, etc.) were stuck at 0. Freya's "2000 gold by Floor 8" never progressed. | 2026-05-15 | RESOLVED — 2026-05-15 |
| BUG-034 | `src/data/bosses/milestoneBosses.ts` | Each `BossOutcome` has an `achievement` field with boss-specific IDs that don't exist in any achievement file. `executeOutcome()` ignores this field and hardcodes generic IDs. | 2026-05-18 | DEFERRED — Phase 2: add per-boss achievement definitions |

---

## Deep Audit Findings — New 2026-05-18

| ID | Screen | Issue | Reported | Status |
|----|--------|-------|----------|--------|
| BUG-035 | `app/dungeon/combat.tsx` | `handleAddToBag()` and `handleEquipDrop()` add combat weapon drops to inventory but never call `registerWeapon()`. Blacksmith upgrade/identify screens use `getWeaponById()` from the registry — returns `undefined` for all combat drops. 100% of combat-dropped weapons are invisible to the blacksmith. | 2026-05-18 | RESOLVED — 2026-05-18: Added `registerWeapon(rewards.weaponDrop)` to all three pickup handlers (handleAddToBag, handleEquipDrop, handleEquipDropConfirmed). |
| BUG-036 | `app/dungeon/room.tsx:548` | `if (tier !== 'D' && tier !== 'D+')` — `tier` is an undeclared local variable (undefined). `undefined !== 'D'` is `true`, so shrine achievement discovery fires for ALL outcomes including opposed/abandoned shrines. | 2026-05-18 | RESOLVED — 2026-05-18: Extracted `resultTier` as a local const before `setShrineResult()`, used in the discovery check instead of undefined `tier`. |
| BUG-037 | `app/town/guildhall/index.tsx:411` | Guild Hall Material Registry filter uses `i.type === 'material'` — includes metals, monster parts, essences, AND gems. Design: Guild Hall should only sell gems. Non-gem materials should sell at the town shop. | 2026-05-18 | RESOLVED — 2026-05-18: Filter updated to `category === 'gem'` only. Section renamed "Gem Exchange". |
| BUG-038 | `app/town/shops/sell/index.tsx:127` | Shop sell screen includes gems in its material list via `getMaterials()`. Design: gems should only be sold at the Guild Hall. | 2026-05-18 | RESOLVED — 2026-05-18: Added `category !== 'gem'` filter to the materials list in `getSellableItems()`. |
| BUG-039 | `app/dungeon/room.tsx:501` | Shrine favor update calls `modifyDeityFavor()` from `useCharacterStore` only. This updates `character.deityFavor` but NOT `useDeityStore.relationship.favor`. After shrine visits, the two stores diverge — Familia Home, challenge gating, and ABANDONED tier detection all read from the deity store and never see shrine changes. | 2026-05-18 | RESOLVED — 2026-05-18: Added `useDeityStore.getState().adjustFavor(favorDelta, 'shrine')` call alongside the character store call. |
| BUG-040 | `app/dungeon/room.tsx:504` | Shrine `addStatusEffect()` uses `Character.ts`'s simpler StatusEffect type (not StatusEffect.ts) — `id: StatusEffectId`, `name`, `duration`, `description`. `'curse'` is a valid StatusEffectId. Original code was correct. | 2026-05-18 | CLOSED — False alarm. `Character.ts` StatusEffect is a simpler interface than `StatusEffect.ts`; original call was valid. |
| BUG-041 | `src/types/Blacksmith.ts:75` + `src/stores/useBlacksmithStore.ts:225` | `masterwork → legendary` upgrade has `questRequired: 'legendary_smith_quest'`. Store always returns `canUpgrade: false` for this. No quest system exists — masterwork weapons permanently unupgradeable. | 2026-05-18 | RESOLVED — 2026-05-18: Removed `questRequired` field. Upgrade now requires 50,000G + adamantine ×5 + dragon_heart ×1 + mithril ×5 + rep 16. |
| BUG-042 | `app/dungeon/room.tsx:431` | Shrine opposition map only covers 2 of 12 domains (Death/Life, War/Wisdom). `Trickery/Authority` and `Chaos/Order` are dead code (not in SHRINE_DOMAINS). Magic, Fortune, Nature, Craft, Sky, Fire, Knowledge have no opposite — these patrons can never encounter an opposed shrine. | 2026-05-18 | RESOLVED — 2026-05-18: Complete 12-domain opposition map defined. |

---

## Design Decisions Needed

| Topic | Context | Options | Status |
|-------|---------|---------|--------|
| Flee cost | Fleeing has no HP/SP cost — only AGI check + floor penalty + lost training opportunity. May feel too "free" for deep floors. | (A) No change — the lost proficiency and fear of failing the check is sufficient cost. (B) Failed flee = 10% max HP damage. (C) Each attempt costs 5 SP. | OPEN — needs Thane |
| Deity eviction UX | At favor 0-10, design says deity abandons adventurer. Currently no UX for this transition — favor can drop to 0 with no consequences. | (A) Disable domain blessing only — no eviction. (B) Forced shrine visit to repair relationship. (C) Full eviction — player must choose new deity in town. | DECIDED — Option C (full eviction). Implement in Phase 2 Task 2. |
| Paragon abilities | Level 10 unlocks Paragon and Denatus title, but no mechanical bonus beyond title is implemented. | (A) Passive stat bonuses from soul title adjectives. (B) A unique Paragon skill based on top behavement vector. (C) Meta-progression unlock (affects future runs). | OPEN — needs Valdris + Thane |
| Combat log length | Implementation: 20 entries. Documentation: 8 entries. | Pick one. 20 is better for UX — shorter scrolls are less useful. Update docs to say 20. | DECIDED — 20 entries is correct. Docs need update. |
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
| BUG-016 | `weapon.finalCritChance` was computed on weapon generation but never passed to `calculateDerivedStats` — every weapon in the game had 5-14% effective crit regardless of `baseCritChance` | 2026-05-15 | Added `weaponCritChance` param to `calculateDerivedStats`; all three call sites in `useCharacterStore` now extract and pass `equippedWeapon?.finalCritChance` |
| BUG-017 | LCK weapon attack scaling (luckAttack) used coefficient 0.008 — same as STR — making Grade I vs Grade G difference only 1 damage point, invisible through variance | 2026-05-15 | Raised `effLCK * 0.008` to `effLCK * 0.012` in `Stats.ts`; Grade G now yields +18% over Grade I |
| BUG-018 | `computeMaxResources()` passed `weaponDamage` for all weapon types including LCK and magic — omitting `weaponLuck` and `weaponMagic` entirely | 2026-05-15 | `computeMaxResources` now routes weapon damage via category (physical/magic/luck) matching `getDerivedStats` logic |
| BUG-019 | Shop stale data: stock persisted from old code with only 4 items; `shouldRefreshStock()` never triggered refresh because floor/run counters were unchanged | 2026-05-15 | Added `if (state.equipmentStock.length < 12) return true` to `shouldRefreshStock()`; guarantees regeneration on stale saves |
| BUG-020 | Shop guaranteed 1-per-stat weapon used `generateRandomWeapon` (4-weapon base pool) — LCK/WIS players always saw same Level 1 weapons regardless of character level | 2026-05-15 | Switched to `generateLeveledWeaponDrop(floor, characterLevel, [stat])` — shop now stocks tier-appropriate weapons |
| BUG-021 | Flee/sneak success left player trapped in room.tsx — `handleBack()` fired "No Retreat" alert with only one button, no exit | 2026-05-15 | Flee and sneak now call `markNodeAvoided(nodeId)`; room.tsx checks `!node.isAvoided` before blocking back navigation |
| BUG-024 | `useGameStore.milestoneChestsOpened` shadowed by run-scoped version — stale field, never called | 2026-05-15 | Removed field, initial state, and `claimMilestoneChest` action from `useGameStore.ts` |
| BUG-029 | `social_deity_favor_high` soul behavement never fired when deity favor reached 80+ | 2026-05-15 | Added soul call in `useDeityStore.adjustFavor()` after `set()` when `newFavor >= 80` |
| BUG-030 | `resource_sell_items` soul behavement never fired on Guild Hall material sales | 2026-05-15 | Added `useSoulStore.getState().incrementBehavement('resource_sell_items')` in `handleSellAll` and `handleSellOne` |
| BUG-033 | Deity challenge progress unrouted — gold, heal, dodge, survive challenges stuck at 0 permanently | 2026-05-15 | Added `recordChallengeEvent(type, amount)` to `useDeityStore`; wired gold at 3 sites in combat.tsx and room.tsx; extended kill type routing (melee, giants, beasts); added heal tracking in item use |
| BUG-003 | Silent weapon discard with full bag | 2026-05-15 | Already implemented — `confirmDestroyWeapon` modal at `combat.tsx:1337`. Closing the bug. |
| BUG-004 | iOS swipe-back bypassed level-up ceremony | 2026-05-15 | Added `navigation.addListener('beforeRemove', e => e.preventDefault())` in `level-up.tsx` when phase !== 'complete' |
| BUG-015 | `useMarketStore.onFloorDescend()` never called | 2026-05-15 | Already wired at `useDungeonStore.ts:473` — false alarm, closing. |

---

*"Pike assumes everything is broken. Prove her wrong."*
