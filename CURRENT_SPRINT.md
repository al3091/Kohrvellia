# KOHRVELLIA — Current Sprint

> Last updated: 2026-05-15
> Status: Build Hardening complete + Deity Challenges live + Soul tracking partially wired

---

## THIS WEEK'S FOCUS

Complete the Job System combat integration (starter skills working in combat skill menu),
wire the remaining ~60 Denatus behavements, and implement Bosses 6-20 to fill out the
milestone boss system through floor 100. These three tasks take the game from "well-architected
skeleton" to "fully playable arc" — every character build can now reach a boss that talks back.

---

## Active Tasks

- [ ] **Job System: Combat integration audit** (persona: Thane + Sylas)
  - Verify starter skill appears in the combat skill modal for job-holding characters
  - Confirm SP cost and damage formula uses the job's declared scaling stat
  - Test all 8 base job starter skills in combat — any type mismatch between `Skill` and `LearnedSkill` interfaces?
  - Fix `learnSkill(starterSkill as any)` cast in `useJobStore.ts:62` with proper typing

- [ ] **Denatus: Complete 85-behavement wiring** (persona: Eris + Sylas)
  - ~30% of behavements currently fire; ~60 hook points are unwired
  - Priority targets: `explore_secret_rooms`, `risk_boss_rush`, `risk_no_observe`, `social_deity_favor_high` ✅ done
  - Wire behavements at: trap detection (`room.tsx`), NPC interactions, skill learning (job selection), dungeon shop visits
  - Reference `docs/SOUL_BEHAVEMENTS.md` for full list

- [ ] **Denatus: Test title generation end-to-end** (persona: Eris + Zenna)
  - `app/dungeon/denatus.tsx` exists and reads from `useSoulStore`
  - Test the full path: reach Level 10 → Denatus screen → title formula `[CR Adj] + [Stat Adj] + [Skill Noun]`
  - Confirm title is stored on the character and displayed in epitaph/stats screens

- [ ] **Bosses 6-20: Implement floors 30-100** (persona: Orla + Thane)
  - 15 remaining bosses designed (from doc): Sekhmet, Ahab, Ignis, Morgaine, Tyrael, Jormungandr, Nemesis, Apep, Ashur, Sedna, Yaotzin, Thoth, Hades, Brahman, Valdris
  - Each needs: full `MilestoneBoss` definition, 3-exchange conversation, 3+ outcomes, `bossDefeatedEcho`
  - Add to `MILESTONE_BOSSES[]` in `src/data/bosses/milestoneBosses.ts`

- [ ] **Boss dialogue achievements: Add data** (persona: Orla + Eris)
  - `BUG-022`: Boss outcomes reference achievements (`walked_past_death`, `fortune_s_pet`, `vanya_the_understood`, etc.) but no matching definitions exist in `src/data/achievements/`
  - Add achievement data entries; update `RequirementType` if needed

- [ ] **Item Drop/Destroy** (persona: Sylas + Pike)
  - Add permanent item removal from inventory (destroy without equipping)
  - Confirmation dialog: "This item will be lost permanently. Destroy it?"
  - Enforce BAG_CAPACITY correctly on destroy (not just equip)

---

## Blocked / Needs Decision

- **BUG-026:** `useSoulStore` is persisted globally. Boss `dominantVector` reflects cumulative
  soul data across all of a player's characters — boss dialogue flavor may be wrong for
  returning players. Soul data IS correct for the current run's approach style signals
  (those use `DungeonRun` stats). Only `dominantVector` is cross-run.
  - Decision from **Eris**: (A) reset soul at run start, (B) snapshot at run-start + use deltas
    in `createPlayerSnapshot`, (C) accept cumulative soul as character identity (intentional depth).

- **BUG-027:** Level-up ceremony shows "+X GLORY" from `tierRewards.gloryPoints` but these
  points are never forwarded to `useSoulStore`. The GLORY vector tracks separately via
  specific behavements (boss streaks, deathless floors). UI implies soul points accumulate;
  they don't.
  - Decision from **Valdris**: (A) wire gloryPoints to soul GLORY accumulator, (B) rename UI
    label to "GLORY BONUS" with tooltip, (C) remove the display entirely.

- **Weapon Triangle** — Damage type modifiers (Slash/Pierce/Blunt vs Flesh/Leather/Bone/Armor)
  documented in `DESIGN_COMBAT.md` but absent from `useCombatStore.playerAttack()`.
  Monster `weaknesses`/`resistances` arrays only feed inspection text — no damage math.
  - Decision from **Thane**: Phase 2 or Phase 3? Retroactively changes encounter balance.

- **Audio files** — `useSoundStore` infrastructure complete (all BGM/SFX types defined), but
  no `.mp3`/`.ogg` files exist in `assets/`. All sound calls are silent no-ops.
  - Decision from **Valdris**: Source/commission audio, ship with silence, or use free CC assets?

---

## Done This Sprint

- [x] `recordChallengeEvent()` routing in `useDeityStore` — gold/heal/kill challenges now track correctly; Freya's "2000 gold by Floor 8" and similar challenges now progress (BUG-033)
- [x] `social_deity_favor_high` soul behavement wired in `useDeityStore.adjustFavor()` (BUG-029)
- [x] `resource_sell_items` soul behavement wired in guildhall `handleSellAll`/`handleSellOne` (BUG-030)
- [x] Stale `milestoneChestsOpened` + `claimMilestoneChest` removed from `useGameStore` (BUG-024)
- [x] iOS swipe-back guard in `level-up.tsx` — `navigation.addListener('beforeRemove')` blocks ceremony dismissal before phase is 'complete' (BUG-004)
- [x] TypeScript zero-error build — 15 pre-existing errors fixed: Padding/Spacing constants, unused imports (Padding, useSoundStore, addToInventory, tags1/tags2), unused `s` params in milestoneBosses, `SoulStoreRef.getBehavementProgress` return type corrected from `currentValue` to `current`

---

## Next Up (not started)

- **Discovery System** (Phase 2.3) — Achievement visibility states (Hidden → Rumored → Known → Completed), NPC reputation-based discovery. `DiscoveryState` type exists in code but never fed to UI.

- **God Challenges** (Phase 2.4) — `useDeityStore.issueChallenge()` and `checkChallengeExpiry()` are implemented. What's missing: trigger conditions (shrine visit, low favor, approaching milestone), and many challenge event types still need routing via `recordChallengeEvent()`.

- **Advanced Job Specializations** — Jobs branch at Level 5 (Path A/B) and become Advanced Class at Level 8. Design exists in `DESIGN_PROGRESSION.md`. Framework stored in `useJobStore`; Level 5 gating not coded.

- **Shop/Economy Completion** (Phase 2.6) — Guild Hall sell exists ✅. Buy flow, haggling (CHA bonus to prices), town shop stock generation still need full wiring.

- **Biome-Pantheon Monster Associations** — 9 biomes each tied to a pantheon in `DESIGN_DUNGEON.md`. Floor generation currently uses global monster pool regardless of depth/biome. Norse creatures (Frost Giant, Storm Giant) should dominate Frozen biome floors, etc.

- **150+ Monster Bestiary** — Currently 36+ base monsters. Design doc targets 150+. Low priority until Phase 3.

- **Sound Assets** — Audio files needed for all defined BGM/SFX types.

---

## Known Issues (Pike's List)

| ID | Severity | Screen | Issue |
|----|----------|--------|-------|
| BUG-001 | Major | `dungeon/combat.tsx` | App force-closed during combat leaves `useDungeonStore` with the room marked unvisited, but `useCombatStore` (non-persisted) is cleared. Player re-enters same room without combat state — may double-spawn encounter. |
| BUG-005 | Minor | `dungeon/combat.tsx` | `endCombat()` nulls `rewards` and `monster`. Currently safe (all reads precede the call), but any refactor moving `endCombat()` earlier will produce silent null-reference crashes. Snapshot `rewards` at top of `handleVictory()` as future-proofing. |
| BUG-008 | Minor | `dungeon/combat.tsx` | Weapon Triangle not implemented — `weaknesses`/`resistances` arrays only used for inspection text, no damage formula effect. Tutorial implies type advantages exist. |
| BUG-022 | Major | `boss-encounter.tsx` | Boss outcome achievements (`walked_past_death`, `fortune_s_pet`, etc.) are referenced in TODO comments but no matching achievement definitions exist. Achievement unlocks silently fail. |
| BUG-023 | Minor | `boss-cleared.tsx` | Screen exists and is complete but unreachable — no route points to it. Routing decision pending. |
| BUG-026 | Medium | `PlayerSnapshot.ts` | Boss `dominantVector` uses cumulative cross-run soul data. Approach style is correctly run-scoped; this is the only affected field. |
| BUG-027 | Medium | `level-up.tsx` | "+X GLORY" display in ceremony is visual only — never feeds `useSoulStore` GLORY vector. |
| BUG-031 | Major | `dungeon/inventory.tsx` | Armor equip/unequip UI dead for 5 of 7 slots — `handleSlotPress` gates all interaction with `if (slot === 'weapon')`. |
| BUG-032 | Major | `useCombatStore.ts` | Weapon Triangle not in damage math. Slash/Pierce/Blunt vs monster type has zero effect on combat numbers. |
| BUG-033 | RESOLVED | `useDeityStore` | Deity challenge routing complete. Gold/heal/kill types now route to active challenge. |

---

## Design Questions Open

1. **Paragon (Level 10) mechanics** — Denatus title formula is designed. What does Paragon unlock *mechanically* beyond the title? Passive stat bonuses from soul title adjectives? A unique Paragon skill? Meta-progression unlock that carries to future runs? Needs Valdris + Thane.

2. **Deity Eviction UX** — At favor 0-10, deity abandons adventurer. Current behavior: favor drops, blessings weaken, nothing else happens. Options: (A) disable domain blessing only, (B) forced shrine visit to repair, (C) full eviction — player picks new deity. Needs Valdris.

3. **Flee cost** — Fleeing has no HP/SP cost, only AGI check and floor penalty. Thane: should failed flee attempts cost HP or SP, or is the lost proficiency and floor penalty sufficient?

4. **GLORY + gloryPoints** — See BUG-027. The "+X GLORY" UI implies soul tracking; it doesn't. Pick one: wire it, rename it, or drop it.

5. **Consumables in dungeons** — Dungeon shop room type exists in floor generation but renders no merchant stock. When should dungeon shops spawn, what's their stock, and how do prices compare to town?

---

*The Tower Awaits.*
