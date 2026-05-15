# KOHRVELLIA — Current Sprint

> Last updated: 2026-05-14
> Status: Phase 2.1/2.2 — Job System shipped; Market Events shipped; Guildhall expansion complete

---

## THIS WEEK'S FOCUS

Complete the Job System end-to-end flow (Level 2 → job selection → job benefits active in combat), then wire the remaining Denatus behavement tracking so soul data accumulates faithfully during dungeon runs. These two systems are the connective tissue between Phase 1 (MVP) and Phase 2 (Extended Content) — everything else in Phase 2 depends on them being solid.

---

## Active Tasks

- [x] **Job System: Wire Level 2 → job-select flow** (persona: Sylas + Thane)
  - `job-select.tsx` exists, uses `useJobStore.selectJob()`, `BackHandler` prevents premature exit
  - Selected job persists via `useJobStore` and starter skill is granted via `learnSkill()`
  - Screen routes correctly from level-up flow

- [ ] **Job System: Job benefits in combat** (persona: Thane)
  - Verify starter skill appears in combat skill menu
  - Confirm SP cost and skill damage are calculated correctly using job's scaling stat
  - Test all 8 base job starter skills in combat

- [ ] **Denatus: Complete behavement tracking wiring** (persona: Eris + Sylas)
  - Audit which of the 85 behavements in `SOUL_BEHAVEMENTS.md` are currently tracked in `useCombatStore` and `useDungeonStore`
  - Wire the missing ones — especially PHYS, MAGIC, TANK, EVADE vectors which should fire on combat actions
  - Confirm `useSoulStore.recordBehavement()` is being called at the right moments

- [ ] **Denatus: Ceremony screen completion** (persona: Eris + Zenna)
  - `app/dungeon/denatus.tsx` exists — verify it reads from `useSoulStore` correctly
  - Confirm title generation formula (`[CR Adj] + [Stat Adj] + [Skill Noun]`) produces valid titles
  - Test the full ceremony flow: reach Paragon → Denatus screen → title assigned

- [ ] **Item Drop/Destroy** (persona: Sylas + Pike)
  - Add full item removal from inventory (destroy without equipping)
  - Add drop confirmation dialog ("This item will be lost. Descend without it?")
  - Ensure bag capacity enforcement works correctly after destroy

- [ ] **GLORY tracking** (persona: Eris)
  - Implement the GLORY vector in soul tracking (10 behavements for hard-path choices)
  - GLORY should increment when player completes HEROIC, LEGENDARY, or MYTHIC achievements
  - Wire into achievement ceremony completion callback

---

## Blocked / Needs Decision

- **Issue:** `.ts.tmp` files in `/src/data/pantheons/` — RESOLVED. Files deleted 2026-05-14. Pantheons (inca, maya, persian, polynesian, shinto, vodou, yoruba) are queued for Phase 3 content expansion.

- **Issue:** `useMarketStore.onFloorDescend(playerLevel)` is never called anywhere in the dungeon flow. Market events will never spawn, tick, or expire. The entire Market Events system is wired internally but has no external trigger.
  - Decision needed from: **Sylas** — Hook this call into `useDungeonStore.enterFloor()` or the `descend` action to activate the living economy. See BUG-015.

- **Issue:** Weapon Triangle damage type modifiers (Slash/Pierce/Blunt vs Flesh/Leather/Bone/Armor) are documented in `DESIGN_COMBAT.md` but not implemented in `useCombatStore.playerAttack()`.
  - Decision needed from: **Thane** — Is this a Phase 2 or Phase 3 feature? Implementing it changes existing combat balance.
  - Risk: Retroactively changes difficulty of existing encounters.

- **Issue:** Music audio files are absent. `useSoundStore` infrastructure is complete with all BGM/SFX types defined, but no `.mp3`/`.ogg` files exist in `assets/`.
  - Decision needed from: **Valdris** — Source or commission audio, or ship with silence and add later?

---

## Done This Sprint (move to PROGRESS.md when complete)

- [x] Job store (`useJobStore`) — persisted, handles job selection and starter skill granting
- [x] Job definitions (`src/data/jobs/jobDefinitions.ts`) — base jobs defined with stat requirements
- [x] Soul store (`useSoulStore`) — initialized, behavement vector structure in place
- [x] Denatus screen (`app/dungeon/denatus.tsx`) — screen exists, reads from soul store
- [x] Job select screen (`app/dungeon/job-select.tsx`) — complete with BackHandler, top-stat filter, confirmation flow
- [x] Market Events system (`useMarketStore`) — 35 narrative events, weighted random selection, ephemeral/brief/seasonal/extended durations, supply pressure tracking per material category
- [x] Market Events data (`src/data/marketEvents.ts`) — 35 templates with icons, flavor, category effects, minLevel gating
- [x] Guildhall Market Board UI — live event display, supply pressure warnings, price indicators (▲/▼)
- [x] Guildhall Material Registry — sell-one/sell-all with dynamic pricing via `getMultiplier()`, market-adjusted price display
- [x] `clearAllStores()` expanded — now resets `useJobStore`, `useSoulStore`, and `useDeityStore` on new game (fixes BUG-002, BUG-006, BUG-014)
- [x] Removed 7 dead `.ts.tmp` pantheon files from `src/data/pantheons/` (BUG-007)

---

## Next Up (not started)

- **Discovery System** (Phase 2.3) — Rumor system, achievement visibility states (Hidden → Rumored → Known → Completed), NPC reputation-based discovery. Depends on: NPC reputation tracking in `useCharacterStore` or a new `useNPCStore`.

- **God Challenges** (Phase 2.4) — Deity-assigned time-limited challenges. Trigger conditions: low favor, shrine visit, approaching milestone without discovered achievements. Requires: favor tracking to be fully wired in `useDeityStore`.

- **Shop/Economy Completion** (Phase 2.6) — Shop screens exist but buy/sell pricing, haggling (CHA bonus to prices), and town shop stock generation need to be fully implemented.

- **Extended Pantheons** — 7 `.ts.tmp` files need decision (see Blocked above). If green-lit: complete each pantheon to ~14 deities each.

- **150+ Monster Bestiary** — Currently ~36 base monsters. Design doc targets 150+. Low priority until Phase 3.

- **Sound Assets** — Audio files needed for all defined BGM/SFX types.

---

## Known Issues (Pike's List)

| ID | Severity | Screen | Issue |
|----|----------|--------|-------|
| BUG-001 | Major | `dungeon/combat.tsx` | If app is force-closed during combat, `useCombatStore` (non-persisted) clears but `useDungeonStore` retains the room as unvisited — player re-enters the same room without combat state. Needs resume-from-interrupted-combat handling. |
| BUG-002 | Major | `app/index.tsx` (New Game flow) | `clearAllStores()` clears character, dungeon, achievements, and weapon registry — but does NOT reset `useJobStore`, `useSoulStore`, or `useDeityStore`. A new character could inherit a previous run's job or soul state. |
| BUG-003 | Minor | Inventory | When swapping a weapon via `equipWeapon()`, the old weapon is moved to inventory. If inventory is full (16 slots), the old weapon is LOST with no warning to the player. |
| BUG-004 | Minor | `dungeon/level-up.tsx` | Level-up ceremony can be dismissed before deity approval step completes. State remains in a partially-committed limbo until next load. |
| BUG-005 | Minor | Data | 7 `.ts.tmp` files in `src/data/pantheons/` are not imported by the pantheon index — they're dead weight but not harmful. |

---

## Design Questions Open

1. **Paragon (Level 10) unique abilities** — What does reaching Paragon actually unlock mechanically beyond the Denatus title? Permanent passive buffs? A unique Paragon skill? The design doc says "focus shifts to optimization" but this needs concrete mechanics.

2. **Deity Eviction** — At favor 0-10, a deity abandons the adventurer. What is the UX flow? Does the player continue with no patron, or are they forced to select a new deity in town? Is there a narrative "breakup" scene?

3. **Flee cost** — Currently fleeing has no HP/resource cost, only an AGI check and floor penalty. Thane should decide: should failed flee attempts cost HP or SP, or is the lost stat proficiency from not fighting sufficient?

4. **Run stat tracking for title screen epitaph** — The epitaph system on the title screen uses `runHistory.causeOfDeath` which is a string. Who sets this string, and is it always set correctly on death? The death flow in `app/dungeon/epitaph.tsx` should be audited.

5. **Consumables in dungeons** — The general shop exists (`app/town/shops/general/index.tsx`) and sell screen exists, but the dungeon shop room type is still a placeholder. When does a dungeon shop spawn, what's its stock, and how do prices compare to town?

---

*The Tower Awaits.*
