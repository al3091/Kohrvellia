# Findings — Config / Lib / Hygiene

Canonical first-hand findings. Schema per `01_CHARTER_AND_RUBRIC.md`. Seed IDs (KV-AUD-001…041) are
confirmed/refuted here with evidence; new IDs continue from the ledger counter.

---

## Unit W1-L1 — `src/lib/` (clearAllStores, weaponFormulaResolver, sacredItemConversion) — Session 1, audited first-hand

### `src/lib/clearAllStores.ts` (29 lines — read in full)

**KV-AUD-002 [CONFIRMED first-hand] | S1 | L4/L6 | `clearAllStores.ts:19-29`** — Incomplete new-game
reset. The function resets exactly 9 things — `useCharacterStore.deleteCharacter`, `useDungeonStore.
clearAllData`, `useAchievementStore.resetAllProgress`, `clearWeaponRegistry`, and `.reset()` on soul,
job, deity, market, blacksmith — and **omits `useShopStore`, `useSacredItemStore`, `useInventoryStore`**
(all persisted) plus `useGameStore` (intentional meta). The file's own header comment says *"reset all
persisted stores"* (`:1-2`) — **false**, three persisted stores are skipped.
- *Impact:* potential cross-character bleed in a permadeath game. **Net bleed must be confirmed in the
  store units** — prior notes suggest `createCharacter` may compensate for shop `npcReputation`/sacred
  *run* metrics, but shop `lifetimeGoldSpent`, sacred *character-scope* metrics, and the entire
  `useInventoryStore` stash/gold have **no reset visible here**. → cross-check `useCharacterStore.
  createCharacter` (W1-S2), `useShopStore`/`useInventoryStore` (W1-S5), `useSacredItemStore` (W1-S4).
- *Fix:* make the reset scope-aware and exhaustive (clear all non-`lifetime` state for every
  run-scoped store), or centralize a single `resetForNewCharacter()` each store implements.

**KV-AUD-042 | S3 | L6 | `clearAllStores.ts:19-29`** — No error isolation. Nine `getState().action()`
calls run sequentially with no try/catch; if any throws (e.g. a store mid-migration), the remaining
resets never run → a **partially-reset** new game (worse than no reset, because state is now
inconsistent). → wrap each in try/catch or collect errors; resets should be individually idempotent.

### `src/lib/weaponFormulaResolver.ts` (47 lines — read in full; **UNTRACKED in git**)

**KV-AUD-001 [CONFIRMED first-hand] | S0 | L3/L10 | `weaponFormulaResolver.ts` (whole) ← `useCombatStore.ts:32`**
— This file is real, load-bearing combat code (it derives every weapon's attack pool / defense target
/ pierce type) and is **untracked**. It is imported by the tracked combat store, so a clean
`git checkout` (CI) cannot bundle it → broken deploy. Confirmed by reading the file content (not just
its absence). → `git add` it; CI guard for untracked `src/**` imports.

**KV-AUD-043 | S2 | L1/L2 | `weaponFormulaResolver.ts:33,37,46`** — Silent physical fallback on any
unrecognized category. The resolver routes by `MAGICAL_WEAPON_CATEGORIES.has(category)` /
`HYBRID_MIXED_CATEGORIES.has(category)` (both `Set<string>`), and **any miss falls through to Node 3 =
`{attackPool:'physical', defenseTarget:'physDef', pierceType:'armorPierce'}`** (`:45-46`). Because
`category: string` and the sets are `Set<string>`, a spelling drift between a weapon's category and the
set entries (e.g. `INT_CHA` vs `CHA_INT` — see seed KV-AUD-040 / prior AUD-031) makes a *magic/hybrid*
weapon silently deal **physical** damage vs the wrong defense. No type error guards this. → tighten
`category` to the `WeaponCategory` union and the routing sets to typed sets; verify spellings against
`Weapon.ts` in W1-T4.
- *Positive note:* the LCK branch (`:24-31`) correctly splits defense by damage type (the "Loaded Dice
  uses magDef" case) — that logic is sound.

### `src/lib/sacredItemConversion.ts` (215 lines — read in full)

**KV-AUD-044 | S2 | L2 | `sacredItemConversion.ts:51,67,68,101,102`** — `as never` casts defeat type
checking on sacred-item construction. `DIVINE_MATERIAL`/`SACRED_QUALITY` stubs (`:18-27`) are forced
into the `Weapon.material`/`quality` slots with `as never`, and `category` with `as never` (`:51`).
The stubs only carry a handful of fields; if any `Material`/`Quality` consumer (damage calc,
durability, display) reads a field the stub omits, it gets `undefined` at runtime with no compile
warning. → define real typed `Material`/`Quality` stubs; remove `as never`. Verify the consumed field
set in `Weapon.ts`/combat (W1-T4 / W1-S1).

**KV-AUD-045 | S3 | L1 | `sacredItemConversion.ts:43-46`** — All physical sacred weapons collapse to
`'slash'`. `DAMAGE_MAP = { physical:'slash', magic:'magic', holy:'holy', dark:'dark', chaos:'dark' }`
→ a sacred mace/spear (blunt/pierce in spirit) is typed `'slash'`, so the weapon-triangle treats every
physical sacred weapon as slashing; `'chaos'` is silently coerced to `'dark'`. → carry the real damage
type on `SacredWeaponStats` (add blunt/pierce) instead of one-way mapping to slash.

**KV-AUD-046 | S2 | L2 | `sacredItemConversion.ts:111-112,198-213`** — Sacred armor stat bonuses live on
an **off-interface** `statBonuses` property attached via `as Armor & { statBonuses }` (`:111-112`).
Only the matching-cast `getArmorStatBonuses` (`:198-213`) can read them; any code consuming the typed
`Armor` is blind to sacred armor bonuses. → add `statBonuses?: Partial<Record<StatName,number>>` to the
`Armor` interface. Confirm the derived-stat path actually calls `getArmorStatBonuses` (W1-S2), else the
bonuses are dead.
> **[Update S21 — the "are they dead?" question is DISCHARGED:** W1-S2 confirmed `getArmorStatBonuses`
> **is** merged into `mergedCarry` in all three derived paths (`useCharacterStore:198-206,1248-1252,
> 1304-1308`), so sacred armor bonuses **do** reach derived stats — they are live, not dead. Only the
> off-interface `statBonuses` *type-safety* concern remains.]**

**KV-AUD-047 | S2 | L1 | `sacredItemConversion.ts:202`** — `getArmorStatBonuses` only iterates
`head, chest, hands, legs` — it omits any other armor slot (boots/accessory). Sacred armor equipped to
an omitted slot contributes **zero** stat bonus silently. → iterate the full `Equipment` armor slot
set; confirm the slot list in `Armor.ts` (W1-T6).
> **[Update S21 — REFUTED by KV-AUD-195 (W1-T4):** reading `Armor.ts` first-hand, the game has **only 4
> armor slots** (`head/chest/hands/legs` — there is no boots/feet slot), so `getArmorStatBonuses` iterates
> the *complete* set and omits nothing. This finding was a false alarm (the auditor's own self-correction,
> R1 in both directions). **Withdrawn.** The off-interface `statBonuses` type-debt (KV-AUD-046) still stands.]**

**KV-AUD-048 | S2 | L6 | `sacredItemConversion.ts:39,85,120`** — Unguarded `throw` on missing stats.
`sacredItemToWeapon/Armor/Accessory` each `throw new Error` if the matching `*Stats` block is absent,
and `convertSacredItemToEquippable` (`:164-170`) dispatches purely by `item.slot`. A data-inconsistent
sacred item (slot says `weapon`, no `weaponStats`) throws at **equip time** — and the caller invokes
this via `require(...)` in `useSacredItemStore.ts:559`, so an unhandled throw can crash the equip flow.
→ validate at data-load (W3-DI integrity) and/or return a typed failure instead of throwing.

**KV-AUD-049 | S3 | L4 | `sacredItemConversion.ts:76`** — Balance literal in a lib file: sacred weapon
`maxOutputCap = ws.finalDamage * 5` (hardcoded). Violates the "balance lives in `GameConstants`" law
and bypasses the quality-tier cap system (asymmetric with normal weapons). → move the `5×` to
`GameConstants`; reconcile with the tier-cap model (ties to seed KV-AUD-019).

**KV-AUD-050 | S4 | L1/L8 | `sacredItemConversion.ts:152-158`** — `normalizeAccessoryType` maps both
`seal` and `talisman` → `'belt'` ("closest mapping") and any unknown type → `'amulet'` silently. A
"seal" relic surfaces to the player as a belt; bad data is masked as an amulet. → preserve the real
type or surface a warning.

**Unit verdict:** the lib layer is small and the core logic (formula resolver, converters) is mostly
sound, but it is the project's densest cluster of **type-system escape hatches** (`as never`,
`Set<string>` fall-through, off-interface `statBonuses`) — exactly the boundaries where silent runtime
bugs hide. The S0 (untracked file) and S1 (reset gap) here are the headline carryovers, both confirmed
first-hand. 4 cross-checks queued for W1-S1/S2/S4/S5/T4/T6.
