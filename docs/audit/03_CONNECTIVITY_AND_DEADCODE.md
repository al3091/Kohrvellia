# Kohrvellia Audit — Connectivity & "Floating Code" Inventory

> Your explicit priority: *code that's present but does nothing, was never wired, or was planned and
> never built.* Each entry is classified **ORPHAN** (exported/defined, imported/called by nothing),
> **NO-OP** (runs but its effect is never read / always the same), **ASPIRATIONAL** (stub / TODO /
> planned-not-built), or **BROKEN-LINK** (imported but the target is missing/untracked). Evidence is
> `file:line`.
>
> **Status (2026-06-05): updated through the Wave-1 engine pass + the Wave-2 screen pass** (stores + types
> `KV-AUD-042…219`; all `app/` screens `KV-AUD-220…297`). Items confirmed first-hand are marked **✓**; the
> few remaining items are marked *(Wave 4 components/tooling)*. The **thesis is a connectivity story:**
> *Kohrvellia enumerates far more capability than the runtime wires* — and Wave 2 both **enlarged** this
> inventory (new dead routes: `level-up`/denatus 259/260, tutorial orphans 291, codex L10 296) and **corrected
> three earlier entries** (favor 242, repair 286, armor 281 — flagged ⚠ below).

## 1. BROKEN-LINK — imports whose target isn't in the build
| What | Evidence | Effect |
|---|---|---|
| `weaponFormulaResolver.ts` untracked, imported by combat store | `useCombatStore.ts:32` | ✓ Clean checkout / CI build fails (S0, KV-AUD-001). **Re-verified untracked 2026-06-04.** |
| `milestoneBossesFloors30to60.ts` + `…65to100.ts` untracked, imported | `data/bosses/milestoneBosses.ts:16-17` | ✓ Boss tables 30-100 absent from deploy. **Re-verified untracked 2026-06-04.** |

## 2. NO-OP — executes but the result is never used / always identical
| What | Evidence | Why it's a no-op |
|---|---|---|
| ⚠ **Deity favor → power (CORRECTED)** | `room.tsx:497` calls `modifyDeityFavor` | **REVISED by KV-AUD-242 (121 S1→S2).** The W1 "0 callers" was a **false-negative grep** (missed the destructured bare call). Shrine favor **does** sync `character.deityFavor` + the blessing. **Residual NO-OP (KV-AUD-270, S2):** favor→power is **shrine-ONLY** — the Familia/Blessing-Rite/Ascension/Challenge loop (`town/familia/*`) never touches `deityFavor`, so the *patron-relationship* main loop stays power-inert. |
| **Deity DOMAIN blessings** (`+10% physical` etc.) | `Deity.ts` domain blessing strings; `getDerivedStatsWithBlessings` | ✓ **KV-AUD-181 (S2).** Domain blessings appear **display-only** — the `+X%` strings are shown but not applied to derived stats. |
| Weapon **enchantments** | `Weapon.ts` enchantment data; combat damage path | ✓ **KV-AUD-188 (S2).** "of Flame/Frost/Venom…" enchantments are **display-only** — no `statModifier`/proc is applied in `playerAttack`. |
| `slow` status / `statModifier` | `StatusEffect.ts` `statModifier`; combat tick | ✓ **KV-AUD-191 (S2).** `statModifier` is never read → **`slow` is fully inert** (a manifestation of the 190 schism). |
| **Armor** speed/dodge penalties | `Armor.ts` penalty fields | ✓ **KV-AUD-193 (S2).** Armor mobility penalties are dead — never applied to AGI/dodge/turn order. |
| **Accessory** non-stat effects | `Armor.ts` accessory `effect` fields | ✓ **KV-AUD-194 (S2).** Accessory effects that aren't flat stat boosts are never applied. |
| ⚠ **Repair / durability (model only)** | `Weapon.durability`; `town/blacksmith/repair.tsx` | **REVISED by KV-AUD-286.** `Weapon.durability` still has **0 store reads/writes** → never degrades → there is **no repair feature** (the durability *model* is dead, 211). But `repair.tsx` is **NOT a no-op** — it implements functional **SALVAGE** (`handleSalvage` → materials + gold + rep; closes the loot loop). Only the route/file name `repair` misleads. |
| Suffix status effects | `useCombatStore.ts:1263-1282` | ✓ **KV-AUD-052/189.** Procs come from base `damageTypes`, so `MonsterSuffix.statusEffect` ("of Venom"→poison) never fires; poison-vs-bone/armor/spirit also yields **0 damage** (softlock risk). |
| `rewards.xp` | `useCombatStore.ts:1459,1520` | ✓ **KV-AUD-055/164.** XP is computed from `monster.xpValue` and stored, but **no character field consumes it** — vestigial of a pre-"no XP" design. |
| Balance "source of truth" | `GameConstants.ts:24-61` | ✓ **KV-AUD-003/065/151.** `DerivedStatFormulas` is imported by nothing; `Stats.ts` hardcodes its own coefficients (drifted ~10×). Editing it changes nothing. *(Per-field: `CombatConfig.flee` + `LootConfig.luckBonusPerPoint` **are** live — 065.)* |
| `FloatingDamage` x-offset | `FloatingDamage.tsx:111,115` | Applies both a `translateX` transform AND `left:%` — double-moves; intent defeated. *(Wave 4 — re-verify)* |
| `EnemyPreview` "Can Inflict" block | `EnemyPreview.tsx:64,134-148` | `canInflict` array never populated → block unreachable. *(Wave 4 — re-verify)* |
| `EnemyPreview` danger rating | `EnemyPreview.tsx:58` | `getDangerLevel(cr, 1)` hardcodes player level 1 → label ignores real character. *(Wave 4 — re-verify)* |
| Deity name on level-up | `app/dungeon/level-up.tsx:354` | ✓ `(character as any).deity?.name` always falls back to `'Your Patron Deity'` — **and moot anyway: the entire `level-up.tsx` (855 LOC) is a dead route** (KV-AUD-260; no inbound nav → superseded by `ascension.tsx`). |
| **Haptic-Feedback settings toggle** | `app/settings/index.tsx:40,236-241` | ✓ **KV-AUD-292 (S3).** The "Haptic Feedback" `Switch` is bound to a local `useState(true)` — never persisted, never read by `useHaptics` → toggling it does nothing and it resets to ON each visit. A placebo control. |
| **`useGameStore.musicVolume/sfxVolume`** | `useGameStore.ts:28-29,156-157` | ✓ **KV-AUD-293 (S3, confirms 144).** Dead duplicate of `useSoundStore`'s live volumes — different name *and* scale (0-100 vs 0-1); the settings screen reads only `useSoundStore`. |

## 3. ASPIRATIONAL — stubbed / TODO / planned-not-built
| What | Evidence | Status |
|---|---|---|
| Sacred-item acquisition metrics | `useSacredItemStore.ts:210-245` | ✓ **KV-AUD-099 (S1).** 14 metrics `return 0; //TODO` + `recordParagon`/event metrics have no writers + `incrementSkillUse` missing ⇒ a large share of ~770 items **unobtainable**; some `value:0` reqs **false-unlock**. Compounded by `revealFavorRequired` read by 0 stores (208) and the 121 favor freeze. |
| maya / inca pantheons | `data/pantheons/index.ts:16` | `// TODO: Regenerate … with correct Deity interface` — malformed/likely-excluded. *(Wave 3 — both files have uncommitted edits this session; re-confirm the TODO holds.)* |
| ⚠ Armor system **(CORRECTED)** | shops sell armor; the **town** inventory equips it (`equipFromInventory:256`) | **CORRECTED by KV-AUD-281.** Armor IS buyable + equippable + its **defense applies** (195) — *not* phantom (refutes 108; corrects my own 276/267). Still half-built: mobility penalties (193) + accessory effects (194) inert, accessory2 unreachable (076), and the **dungeon** inventory keeps a stale "Phase 3" placeholder (267 ≠ the town inventory). |
| Custom font | `expo-font` dep + `app.json` plugin, **no `useFonts` call** | Pipeline declared, never used (KV-AUD-008). *(Wave 4 — re-verify.)* |
| In-dungeon armor/accessory equip | `app/dungeon/inventory.tsx:115` `// TODO: Handle armor and accessory slots` | ✓ **Confirmed stale placeholder (KV-AUD-267).** The **town** inventory equips armor fine (281); only this dungeon screen retains the unfinished TODO + a "Phase 3" notice. |

> **Removed from this section (refuted first-hand):**
> - ~~Audio (`console.log 'Would play'` stubs)~~ — **REFUTED by KV-AUD-143.** Audio is **fully
>   implemented** (`expo-audio`: real `createAudioPlayer`+`play`, preload cache, crossfade/fades) and all
>   **53 referenced `.mp3` assets exist**. The `Would play` logs are stale, not stubs. The only residue
>   is doc-drift (CLAUDE.md names `expo-av`/`reanimated`; see `07`).
> - ~~Discovery System / God Challenges "NOT STARTED"~~ — **REFUTED by KV-AUD-127/134.** Both are
>   implemented and wired (`issueChallenge`←familia, `recordChallengeEvent`←room/combat/floor;
>   discovery has `checkReputationDiscovery` + the 4 visibility states). PROGRESS.md is stale here.

## 4. ORPHAN — exported/defined, referenced by nothing (DELETE candidates)

**Stores / engine (✓ first-hand, caller-grep confirmed):**
| Symbol | Evidence |
|---|---|
| **Deity-unlock layer** — `isDeityUnlocked` / `unlockDeity` / `unlockedDeities` | ✓ `useGameStore` — **0 callers** (KV-AUD-137). All deities are selectable; the lock is unwired. **Refutes prior AUD-086 ("97% of deities unreachable").** |
| **`forceUnlock`** (sacred items) | ✓ `useSacredItemStore` — **0 callers** (KV-AUD-099). The intended escape hatch for the dead acquisition metrics is itself dead. |
| **`startChallenge` / `tickChallengeFloor`** | ✓ `useDeityStore` — dead (KV-AUD-125); the live challenge path is `issueChallenge`/`recordChallengeEvent`/`checkChallengeExpiry`. |
| **`FAVOR_STATUS` 0×–2.0× table** | ✓ `useDeityStore.ts:25-33` — only consumer is a discarded self-call at `:474` (KV-AUD-122; downgrades seed 004 from S1→S3). The live table is `Deity.ts FAVOR_TIERS` (0.5–1.5×). |
| **types barrel** `src/types/index.ts` | ✓ **0 importers AND incomplete** — re-exports 9 of 18 modules (KV-AUD-217). Dead *and* misleading. |

**Constants / helpers / data (✓ now confirmed first-hand where noted):**
| Symbol | Evidence |
|---|---|
| `applySoftCap()` | ✓ `Stats.ts:217-219` — exported, unused (soft caps removed); stale "soft-capped" comment (KV-AUD-148). |
| `getCarryCapacity()` | ✓ `Character.ts:433` — STR weight model vs flat `BAG_CAPACITY=20` (KV-AUD-159). |
| `NODES_PER_FLOOR_BASE/MAX` | ✓ `Dungeon.ts:193-198` — generator ignores them (KV-AUD-085). |
| dead `shop` `NodeType` | ✓ `Dungeon.ts:209` — full type/icon/weight retained but generation-excluded (KV-AUD-083/172). |
| `Colors.biome.void` / `labyrinth` | ✓ `Colors.ts:158,161` — in union but `getBiomeForFloor` never generates them (KV-AUD-169). |
| `Colors.biome.dreamscape` | `Colors.ts:159` — not in the `Biome` union → unreferenceable. |
| `getTierSynergyBonus` | ✓ achievements — dead duplicate of the live count-based stacking (KV-AUD ref AUD-041). |
| `Easing` object / `isSentenceEnd()` / `Breakpoint` / `Shadow.glow` | `Animation.ts:112-125,224`; `Spacing.ts:115,172` — 0 references. *(Wave 4 — re-verify; AUD-079 "breaks native" already refuted.)* |
| `Shop.ts:6` `Consumable as _Consumable` | underscore-aliased unused import. |

> **Moved out of ORPHAN — deprecated but still called:** `calculateBlessingPower()` (`Deity.ts:312`,
> `@deprecated`) is **not** an orphan — KV-AUD-182 found it is **still used** in place of the live
> `getBlessingMultiplier`. That's a "deprecated path still wired" defect, not dead code.

**Components** *(Wave 4 — Agent-claimed, re-verify with `ts-prune`/`knip`):* `EmphasisText`,
`StatTooltip`+`StatRowWithTooltip` (520 lines, duplicate `GRADE_COLORS`), `ActionModal` (256 lines —
only a tombstone comment at `combat.tsx:247`), `GritPanel`, `AnimatedHPBar`+`AnimatedSPBar` (only
`AnimatedEnemyHPBar` is used).

## 5. DEAD / UNREACHABLE ROUTES & DATA TYPES
- ✓ **`repair.tsx` (705 lines) is effectively dead UI** — operates on `Weapon.durability`, which no store
  ever decrements (KV-AUD-211). Confirmed at the type/store level; the screen-side confirmation is a
  Wave-2 formality.
- ✓ **~11 of 21 achievement `RequirementType`s never fire** (KV-AUD-196) — `kill_type`, `floor_return`,
  `no_damage`, `low_hp_win`, `item_collect`, `reputation`, `skill_use`, `status_inflict`, `stealth_kills`,
  `flee_success`, `no_consumables`. Achievements using only these are **uncompletable** (plus the
  discovery-gate, 130). This is the definitive shape of seed 031.
- ✓ **3 dead skill effect types** (`damage_percent`/`buff`/`flee`) in `playerUseSkill` (KV-AUD-199);
  **reveal/identify consumables** do nothing (KV-AUD-204).
- ✓ **`SUFFIX_FLOOR_GATES`** guard a mechanism that never fires (KV-AUD-168).
- ✓ **Tutorial — 4 complete orphaned screens (~1015 lines), CONFIRMED dead** (KV-AUD-291). `tutorial/_layout.tsx`
  registers only `index`/`basics`/`death`; the trim rewired `basics→death` and abandoned `combat`(391)/`stats`(214)/
  `falna`(196)/`leveling`(214) — a self-connected chain with **no inbound edge** (exhaustive route grep). Smoking
  gun: the orphans still carry `TutorialProgress totalSteps={6}` vs the live `={2}`. (`boss-cleared.tsx` confirmed reachable in W2-P5.)
- ✓ **`level-up.tsx` (855 lines) + the Denatus/Paragon Level-10 ceremony — CONFIRMED dead route** (KV-AUD-259/260, **S1**).
  Nothing routes to `/dungeon/level-up`; `denatus.tsx`'s only inbound link is the dead `level-up.tsx:309`; `ascension.tsx`
  has no L10 branch → `character.paragonTitle` is always null. `job-select.tsx` **base-mode** is likewise dead (spec-mode is
  live via `ascension:204`, KV-AUD-262).
- ✓ **Codex hides the entire Level-10 achievement set** (KV-AUD-296). `codex/index.tsx` `LEVELS=[1..9]` never renders the
  ~15 `targetLevel:10` achievements (in `level9Achievements.ts`); 3 of 4 codex categories (Bestiary/Equipment/Lore) are
  permanent "Soon" stubs, and the live Bestiary surfaces none of the tracked monster-knowledge.
- ✓ **Combat dead-style museum** (KV-AUD-237) — ~50 `StyleSheet` entries in `combat.tsx` are defined but never referenced
  (quantify precisely with `knip` in W4).

## 6. Dead/superseded constant tables in `GameConstants.ts`
✓ Beyond `DerivedStatFormulas` (no-op, 003/151): `Combat.damageEffectiveness`, `MonsterBalance.crScaling`,
`RestSiteHealing` (pre-satiation), and `ProficiencyThresholds` (068 — the live growth path is flat
`commitExcelia`, so the threshold curve is dead) appear superseded by values inlined in
`Stats.ts`/combat/monster code. The file reads as a **"constants museum"** — much defined, little
imported. → resolve imported-vs-dead per table; collapse to one source (ties to KV-AUD-003; see `05` B1).

## How to finish this inventory (Wave 4 tool sweep)
The store/type layer is now first-hand. To mechanically close the remainder:
`npx ts-prune` and `npx knip` (unused exports — validates the §4 component orphans),
`npx madge --circular --extensions ts,tsx app src` (cycles — note the inline `require('./otherStore')`
hacks at `useShopStore.ts:491,543` and `useSacredItemStore.ts:558` that dodge ES cycles and hide from
the static graph). The **Wave-2 screen pass is complete** (the items flagged above are now confirmed ✓, and
it added the dead routes in §5); what remains is the **Wave-3 DP/DI data pass** (`maya`/`inca`, relic→deity
integrity) and the **Wave-4 tool sweep**. *(The Wave-3 combat-data + progression dead code is now catalogued in §6.)*

## §6. Wave-3 DC/DPr dead code & unreachable content (298–342) — added S47

The data wave added a large amount of **dead data + write-only fields + unreachable content** — all
machine-confirmed by importing the real barrels. Grouped by kind:

**Write-only / unread fields (the field is set in data but no code reads it):**
- **`weapon.specialMechanic`** — set on **111/338 weapons (all 34 uniques)**; the *only* references repo-wide are
  the type def + the sacred-conversion **writer**; **0 readers** (no combat handler, no display). `311`
- **`monster.lootTable`** (22 `*_loot` refs ×36 monsters) — read by nothing; loot resolves by `MonsterCategory`. `340`
- **`MONSTER_LOOT_POOLS[*].materials` / `.consumables`** — `getMaterialsForMonster`/`rollMaterialDrop` imported by
  no one (combat computes materials its own way); the 16 refs are also broken (`hide`↔`monster_hide`). `340`
- **`monster.biomes`** (0 readers, `299`) · **`monster.xpValue`** (vestigial, `300`) · suffix `statusEffect`/
  `passiveAbility` (dead procs, `301`).

**Orphan functions / apparatus (defined, 0 callers, or gated by an always-false condition):**
- **`getStatusAppliedNarration` / `getStatusDamageNarration`** + their pools — not imported by `useCombatStore`;
  combat uses inline strings. `307`
- **`isSuffixAllowedOnFloor` / `SUFFIX_FLOOR_GATES`** — 0 callers **and** key-vocabulary mismatch (doubly dead). `309`
- **The entire `HybridCategory` / `HYBRID_MIXED_CATEGORIES` / `physRatio`-from-`primaryStats` apparatus** — gated by
  `isHybridMixed`, which is **always false** (no weapon uses a hybrid category) → dual-stat scaling never runs. `312`
- **`boss.mechanic`** — displayed on `boss-encounter` but never read by combat. `316`

**Unreachable / never-completable content (shipped, but the player can't get it):**
- **20 achievements** use 1 of 11 dead requirement types → never complete (incl. 4 STANDARD-tier shown as known). `325`
- **11 mythic + 2 legendary achievements** use `discoverySource:'undiscovered'` (no handler) → 0 progress forever. `326`
- **The Mythic/L10 capstone** (`The Paragon Path`/`The Anomaly Noted`/`Skaer'kohr'wilak`) — quadruple-dead. `332`
- **5 of 8 deep boss-outcome achievement ids** dangle (not in `ALL_ACHIEVEMENTS`) → reward no-ops. `321`
- **The support-job archetype's starter skills** (13 jobs, `buff`-only) do nothing. `336`
- **35/56 stat-builds** have no job; **42/51 jobs** have no specialization. `335/338`
- **12/36 monsters** (the CR 7–16 tier) have no ASCII art → generic fallback. `308`

→ For the Wave-4 `knip`/`ts-prune` sweep: these are the expected data-side orphans; a **"no unwired data field"
CI assert** (every effect type / requirement type / data field consumed by *no* store is wired or deleted)
closes most of this column and prevents recurrence.

### §6b. Tool sweep EXECUTED (W4-4, S51) — machine validation + new orphans (352–355)
`madge`/`knip` were run against the game tree (`entry:['app/**']`). **They independently confirmed the reading-
based inventory above** and added orphans the per-area reads didn't reach:
- **knip `--include exports` CONFIRMS as unused:** `getStatusAppliedNarration`/`getStatusDamageNarration` (307),
  `getMaterialsForMonster`/`rollMaterialDrop` (340), `isSuffixAllowedOnFloor` (309), `getCarryCapacity` (159),
  `calculateGoldDrop` (164), `applySoftCap` (148).
- **knip `--include files` CONFIRMS dead:** `pantheons/maya.ts` + `inca.ts` (347), `types/index.ts` (217).
- **NEW dead files (354):** `data/skills/starterSkills.ts` (380-line `STARTER_SKILLS` catalog — only the dead
  `skills/index` barrel imports it; job skills are inline → never consumed; *extends 342*); **7 component orphans**
  — `character-creation/DeityFilters.tsx`, `combat/ActionModal.tsx` (refactor-orphan; comment "Kairos panel
  replaces the ActionModal"), `text/EmphasisText.tsx`, `TowerWarningModal.tsx`, `ui/StatTooltip.tsx` + the
  `character-creation`/`text` barrels; **6 dead barrels** (`stores/index` 140, `types/index` 217, `data/items/index`,
  `data/skills/index`, `character-creation/index`, `text/index`).
- **`madge --circular` (353):** 23 cycles — **3 runtime store cycles** (`character↔sacred`, `character↔shop`,
  `character→shop→consumables→inventory`) the inline-`require()` dodges don't hide + 20 type-import cycles
  (relic/boss files ↔ their aggregator).
- **knip LIMITATION:** Expo-Router auto-discovers `app/**` as entries, so knip **cannot** flag dead *route* files —
  the manual route-graph found those: `level-up.tsx` (260), the 4 tutorial orphans (291). knip complements, not replaces.
- **`tsc --noEmit` = 0 errors (352):** a false green (S0 files exist on disk + casts suppress the type errors).
→ Promote `audit/integration/knip.jsonc` + a `knip`/`madge`/`no-untracked-src-import` CI gate; it converts this
whole inventory from "found by reading" to "blocked on save."
