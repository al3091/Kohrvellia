# KOHRVELLIA — Current Sprint

> Last updated: 2026-05-18
> Status: Phase 1 COMPLETE. Starting Phase 2.

---

## THIS SPRINT'S FOCUS

Phase 2 deepens the relationship between the player, their deity, and the world. The core loop is
solid — combat, stats, ascension, soul tracking are all wired. Now we add the **discovery arc**
(achievements go from hidden → rumored → known as you engage with NPCs), **God Challenges**
(deity assigns tasks that create run-defining stakes), and the full **economy loop** (buy/sell/
haggle in town and guild hall).

The player should feel like they're inside a living world, not just a dungeon simulator.

---

## IMPORTANT CONTEXT FROM PHASE 1 (read before starting)

### What's already built (confirmed working 2026-05-18)

- **All imports clean** — no broken paths, no missing stores
- **Discovery System UI already built** — `app/town/guildhall/index.tsx` renders all 4 `DiscoveryState` values (hidden/rumored/known/completed). Only the feed triggers are missing. This is closer than it looks.
- **God Challenges scaffold exists** — `useDeityStore.issueChallenge()` and `checkChallengeExpiry()` implemented. Challenge issued at favor ≥ 30 in `familia/index.tsx`. `checkChallengeExpiry()` called on floor descent. **Missing**: `recordChallengeEvent()` not called from combat/events; no in-run progress UI.
- **Guild Hall sell works** — `useMarketStore` fully wired for sell. Buy flow lives in `app/town/shops/` (separate hub, not guild hall).
- **Dungeon shop disabled** — `room.tsx` has shop node type but it's gated out ("shops only in town"). No stock generation for dungeon shops yet.
- **Soul system ~90% wired** — 82/85 behavements fire. `glory_challenge_complete` deferred to God Challenges phase.

### Known deferred bugs (non-blocking, don't start these without deciding design first)

| ID | Issue | Decision Needed From |
|----|-------|---------------------|
| BUG-034 | Per-boss achievement IDs in `milestoneBosses.ts` unreachable (`vanya_the_understood` etc.) — `executeOutcome()` uses hardcoded generic IDs | Orla: Add per-boss achievement data to level files L1-L5 |
| BUG-023 | `boss-cleared.tsx` registered in layout but no caller exists | Valdris: Route here before `boss-encounter` if boss previously defeated? |
| BUG-001 | App force-close mid-combat leaves stale dungeon state | Pike: Low priority until late Phase 2 |
| BUG-025 | RunFlags string literals have no registry/docs | Sylas: Add `DUNGEON_FLAGS` const registry in `src/constants/` |

---

## Active Tasks (Phase 2 Kickoff)

### Task 1 — Discovery System: Feed the existing UI (persona: Sylas + Orla)
**Why first**: UI is already built. This is lower effort than it appears.

What exists:
- `DiscoveryState`: `hidden | rumored | known | completed` on `AchievementProgress`
- Guild Hall renders all 4 states with correct visual treatment
- `discoverAchievement(achievementId, source)` in `useAchievementStore` sets state to `'known'`

What's missing:
- **NPC reputation-based unlocking**: guild/academy/librarian NPCs should upgrade `hidden → rumored` at reputation thresholds. The `discoveryRepRequired` field exists on `Achievement` — it's just never read.
- **First-run hinting**: specific achievements go from `hidden → rumored` on first floor reach (e.g. `walked_past_death` should be `rumored` once player reaches a boss floor for the first time)
- Wire `discoveryRepRequired` reading in `useAchievementStore.updateProgress()` — check if reputation meets threshold, auto-promote to `'rumored'` or `'known'`

Files: `src/stores/useAchievementStore.ts`, `app/town/guildhall/index.tsx`

---

### Task 2 — God Challenges: Wire combat/event callbacks (persona: Thane + Sylas)
**Why second**: Scaffold exists. One missing piece: `recordChallengeEvent()` from the combat loop.

What exists:
- `issueChallenge()` — adds challenge to `useDeityStore.activeChallenge`
- `checkChallengeExpiry()` — called on floor descent
- `recordChallengeEvent(type, amount)` — routes progress for gold/heal/kill types

What's missing:
- `recordChallengeEvent('floor_clear', 1)` in `useDungeonStore.moveToNode()` or `floor.tsx` on descent
- `recordChallengeEvent('boss_kill', 1)` in `handleVictory()` in `combat.tsx` when boss is killed
- Challenge progress bar in the dungeon HUD (shows active challenge progress during run)
- Challenge reward delivery UI (currently `completeChallenge()` sets a flag but no UI reacts to it)

Files: `src/stores/useDeityStore.ts`, `app/dungeon/combat.tsx`, `app/dungeon/floor.tsx`

---

### Task 3 — Economy: Buy flow + haggling (persona: Korben + Zenna)
**Why third**: Sell is done. Buy flow lives in `app/town/shops/` — check existing implementation depth.

What exists:
- Guild Hall: sell all / sell item (wired)
- `app/town/shops/`: multiple shop screens exist (check what's implemented)
- `useShopStore`: stock refresh logic, `shouldRefreshStock()`, `generateStock()` exist

What's missing:
- Haggling mechanic: CHA stat should modify purchase price (±20% based on CHA grade vs target DC)
- Confirmation flow for purchases with gold drain
- Shop stock tied to character level (same `generateLeveledWeaponDrop` approach as combat drops)

Files: `app/town/shops/`, `src/stores/useShopStore.ts`

---

### Task 4 — Job Specialization at Level 5 (persona: Thane + Sylas)
**Later in sprint**: Level 5 is where jobs branch into Path A/B.

What exists:
- `useJobStore` has `selectSpecialization()` stub
- `DESIGN_PROGRESSION.md` has full specialization tree
- Framework gating in `useJobStore` at Level 5 check

What's missing:
- `src/data/jobs/specializations.ts` — define Path A/B for all 8 base jobs
- `app/dungeon/job-select.tsx` — add specialization choice phase at Level 5
- Combat effects of specialization (bonus passive in `useCombatStore`)

---

## Design Decisions Open (resolve before building)

These are blocking or will become blocking. Put them on the table at the start of next session.

| # | Question | Blocking | Personas |
|---|----------|----------|---------|
| 1 | **GLORY stacking multiplier** — 3+ hard-path achievements give 1.5× stat reward. GLORY vector fires but multiplier never applied in `performLevelUp()`. Implement it, or is the soul tracking sufficient? | Task 1 | Valdris + Eris |
| 2 | **Deity Eviction UX** — At favor 0-10, what happens? Currently nothing. (A) disable domain blessing only, (B) forced shrine visit, (C) full eviction + new deity choice | Task 2 | Valdris |
| 3 | **Per-boss achievements (BUG-034)** — Add `vanya_the_understood` etc. to level files and read from `resolvedOutcome.achievement`? Or keep generic IDs? | Task 1 | Orla |
| 4 | **Paragon (Level 10) mechanics** — Beyond the Denatus title, what does Level 10 unlock mechanically? Passive from soul title? Unique skill? Meta-progression? | Future sprint | Valdris + Thane |
| 5 | **RunFlags registry (BUG-025)** — Add a `DUNGEON_FLAGS` const object to document all valid flag strings and their semantics? | Task 2 | Sylas |

---

## Phase 2 Full Scope (for reference)

| Phase | Target | Status |
|-------|--------|--------|
| 2.1 Job System | Complete | ✅ Done in Phase 1 sprint |
| 2.2 Denatus Soul | ~90% | ✅ Mostly done; `glory_challenge_complete` deferred |
| 2.3 Discovery System | Not started | UI built, feed logic missing |
| 2.4 God Challenges | Scaffold only | `issueChallenge` exists, wire combat/events |
| 2.5 Town Hub | Complete | ✅ Done |
| 2.6 Shop/Economy | Sell done | Buy/haggling/dungeon shops pending |
| 2.7 Extended Pantheons | 12 active | 7 additional planned (Phase 3) |
| 2.8 Extended Monsters | 36 active | 150+ target (Phase 3) |
| 2.9 Extended Equipment | Weapons done | Armor/accessories Phase 3 |

---

## What Phase 2 Feels Like When Done

A player should be able to:
1. Reach the Guild Hall and see RUMORED achievements they don't fully understand yet
2. Take a God Challenge from their deity mid-run — a time-limited goal that changes how they play
3. Visit a town shop, haggle using CHA, and buy a weapon tier above what they'd normally find
4. Reach Level 5, enter a boss fight, then choose a job specialization that permanently branches their build
5. See the Denatus soul ceremony at Level 10 produce a title that actually reflects how they played

---

*The Tower Awaits.*
