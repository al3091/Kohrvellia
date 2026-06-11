# Findings — Stores

Canonical first-hand findings. Schema per `01_CHARTER_AND_RUBRIC.md`. Seed IDs (KV-AUD-001…041) are
confirmed/refuted here with evidence; new IDs continue from the ledger counter.

---

## Unit W1-S1 — `src/stores/useCombatStore.ts` (1690 lines) — Session 2, audited first-hand (every line)

**Context:** ephemeral (non-persisted) turn-based combat engine. Player derived stats flow in as args
(`derived: DerivedStats`) from the screen; the store mutates monster/effects/log/rewards and calls back
to character/soul/sacred/game stores. Kairos two-slot action economy + ~14 secondary-stat interactions.

### Correctness / connectivity
**KV-AUD-051 | S2 | Confirmed | L1/L3 | `:521,534`** — A weapon can deal **0 damage** despite the
`Math.max(1, …)` floor. `rawDamage = Math.max(1, baseAttackStat*(1-defenseReduction))` (`:521`) is
floored to ≥1, **then** `rawDamage *= triangleMultiplier` (`:534`). If `getDamageEffectiveness` returns
`0` (prior AUD-032: poison vs bone/armor/spirit), final damage floors to 0 → a poison-weapon player vs
a skeleton/golem does literally nothing every turn = **soft-lock** on a mandatory enemy. → floor damage
to ≥1 *after* the triangle multiply, or make the triangle a reduction (e.g. 0.25×) not 0×. (Cross-check
the 0-returning combos in `Weapon.ts`, W1-T4.)

**KV-AUD-052 | S2 | Confirmed | L1/L3 | `:1263-1282`** — Monster status procs derive from
`monster.base.damageTypes`, **not** from `MonsterSuffix.statusEffect`. The proc maps
fire→burn / ice→freeze / poison→poison / dark→curse, else a 30% bleed (`:1272-1276`). So a suffix like
"of Venom" (which sets `statusEffect`) **never** drives a combat proc, and monsters whose damage type is
lightning/holy/slash proc nothing but bleed. Confirms seed **KV-AUD-025** & prior AUD-089: suffix status
data is dead in combat, and `SUFFIX_FLOOR_GATES` early-floor safety is moot. → drive procs off the
suffix's `statusEffect`/`statusChance`.

**KV-AUD-053 | S2 | Confirmed | L1 | `:1519-1520`** — `Infinity`/`NaN` reward on a zero-CR monster.
`gold * (monster.finalCR / monster.base.baseCR) * goldModifier` and `xp * (finalCR/baseCR)` divide by
`base.baseCR`; any monster with `baseCR:0` yields Infinity gold + Infinity xp (and `0/0`=NaN). Confirms
prior AUD-036 **at the reward site**. → guard `baseCR` (clamp ≥0.1) or assert no zero-CR data (W3-DC1).

**KV-AUD-054 | S2 | Confirmed | L2 | `:527-532`** — `getDamageEffectiveness(weaponDamageType,
normalizedArmor as any)`. The normalizer maps plate→armor, scales→leather, ethereal→spirit, but
`flesh`, `bone`, `magic_resistant` pass through unmapped; if any isn't in `getDamageEffectiveness`'s
table it hits the `?? 1.0` neutral fallback — **silently** (the `as any` deletes the type guard that
would catch it). Confirms seed KV-AUD-026; ties to the StatusEffect/armor-vocabulary schism
(KV-AUD-039). → type the param to the real armor union; remove `as any` (verify table coverage W1-T4).

**KV-AUD-055 | S2 | Confirmed | L1/L3 | `:1459,1519-1524`** — `rewards.xp` is computed
(`xp = monster.base.xpValue`; scaled by CR) and written into `rewards`, but the game has **no XP system**
(no character XP field). Unless a screen reads `rewards.xp` (verify Wave 2), this is computed-and-
discarded — vestigial of a pre-"no XP" design (confirms prior AUD-037). → drop `xpValue`/`rewards.xp`.
> **[Update S22 — REVISED by KV-AUD-222 (W2-P1a): NOT discarded.** `combat.tsx handleVictory:1019-1024`
> reads `rewards.xp` and distributes `xp/4` as pending excelia to STR/END/AGI/PER, and the victory UI shows
> "+{xp} to combat stats" (`:1236`). So `xpValue → rewards.xp → proficiency` is a **live per-kill growth
> channel** — the "vestigial/discard" framing is withdrawn. The real defect is that it's **physical-only**
> (no INT/WIS/CHA/LCK) and routed through the flat path (068). See 222.]**

**KV-AUD-056 | S2 | Needs-repro | L6 | `:369-389,1517-1525`** — Rewards-clear timing (BUG-005). The only
victory payload is `rewards`, **set** in `calculateRewards` and **nulled** in `endCombat` (`:387`) and
the three combat-start actions. The victory screen must read `rewards` *before* anything calls
`endCombat`. This is a real ordering hazard to trace at the call sites in `combat.tsx` (Wave 2-P1); if
`endCombat` can fire first, the player loses all loot/gold on a win.

**KV-AUD-057 | S2 | Confirmed | L1/L3 | `:818-918`** — `playerUseItem` applies only some effect types in
the store; **`heal_percent_hp/sp` (`:845-852`) and `buff` (`:891-899`) only log** and delegate the
actual effect to the caller (or, for buff, to nothing — the "Apply as status effect" comment has no
code). If the screen doesn't read the returned `effect` and apply it, percentage potions and **all buff
potions are inert**. → apply these in the store (call `applyPlayerEffect` for buffs) or document the
caller contract; verify `combat.tsx` handles them (Wave 2).
> **[Update S21 — root of the "dead effect-handler" cluster:** later units found the same
> apply-only-some-effect-types pattern elsewhere — KV-AUD-116 (the `buff` case DOES work in
> `useInventoryStore.useConsumable`, so buffs work *out* of combat but not *in* it), KV-AUD-199 (skill
> `damage_percent`/`buff`/`flee` unhandled), KV-AUD-204 (consumable `reveal`/`identify` unhandled). Fix
> by unifying on one effect resolver shared by combat + out-of-combat + skills.]**

**KV-AUD-058 | S2 | Confirmed | L1/L3 | `:267-303` vs `:305-341`** — `startCombat` duplicates
`prepareEncounter`'s monster-generation but **lacks** the first-ever-combat safety (`:309-313` forces a
normal, non-boss/elite encounter so a new player can't be instakilled) **and** elite handling. If any
screen still calls `startCombat` (verify callers, Wave 2), a brand-new player can hit a boss on combat
#1. Also a DRY hazard — two encounter generators that can diverge. → unify on `prepareEncounter`; delete
`startCombat` if orphaned.
> **[Update S21 — compounds KV-AUD-138 (W1-S7a):** even the protection `startCombat` *lacks* is itself
> broken — `prepareEncounter`'s first-combat safeguard keys off meta `totalRuns`/`hasHadFirstCombat`, so it
> only ever protects the *first character on the device*. So whether combat enters via `startCombat`
> (no guard) or `prepareEncounter` (guard dead for char #2+), every post-first character is unprotected on
> fight #1. Fix 058 and 138 together.]**

**KV-AUD-059 | S3 | Confirmed | L1 | `:633-647,673` ** — AGI double-strike second hit uses
`derived.physicalAttack` unconditionally (`:637`), ignoring the weapon-formula routing used for the
primary hit; `playerQuickStrike` likewise only distinguishes magical vs physical (`:673`), not luck/
hybrid. Magic/luck builds' bonus hits deal physical-stat damage. → route bonus hits through
`resolveWeaponFormula` too.

**KV-AUD-060 | S3 | Confirmed | L1 | `:1493` vs `:329-333`** — Two disagreeing "elite" notions: the
explicit `monster.isElite` flag (set in `prepareEncounter`) and a local loot heuristic
`isElite = finalCR > baseCR + 1` (`:1493`) used for magic-stone drops. They can disagree, so loot
"elite-ness" ≠ encounter "elite-ness". → use one source.

### Balance (L9)
**KV-AUD-061 | S2 | Confirmed | L9 | `:519`** — Hybrid weapons get `attackPool = physicalAttack +
magicAttack` (full **sum** of both pools), while pure weapons get one. A hybrid build can roughly double
its base attack stat — a likely dominant strategy. → average or weight the two, don't sum (verify intent
vs `Stats.ts`, W1-T1).

**KV-AUD-062 | S2 | Confirmed | L9 | `:556-572,562-566,1249-1252`** — Deeply multiplicative damage:
`defenseReduction × triangle × exploitWeakness^min(debuffs,5) × variance × crit × weaken × flow(1+0.2n)`
plus additive cleave/combo/morale/momentum. The `exploitWeakness^5` (`:565`) and FLOW ×1.6 (`:571`)
compound into very high burst variance. Separately, LCK `luckyEscapeChance` (`:1249`) sets lethal damage
to `currentHP-1` — at high LCK the player approaches **immortality** (stacks with deity death-saves). →
cap total multiplier; make lucky-escape once-per-combat.

**KV-AUD-063 | S3 | Confirmed | L4 | `:961,1210,637,560`** — Balance literals hardcoded in the combat
engine instead of `GameConstants`: LCK-skill crit `30` (`:961`), defend `+50%` (`:1210`), double-hit
`0.7` (`:637`), momentum `0.002` (`:560`), proc base `0.20` (`:1267`). Violates the "balance lives in
`GameConstants`" law (R6). → centralize.

### Doc/connectivity reconciliation
**KV-AUD-064 | S3 | Confirmed | L3 | `:1387`** — Combat log capped at **20** (`.slice(-20)`); design doc
says 8 (BUG-011). Confirmed first-hand: code=20. → fix the doc (or code).

**KV-AUD-065 | S2 | Confirmed | L3 | `:55,730-733,1511`** — **Refines seed KV-AUD-003** (GameConstants
mostly-dead). First-hand: `GameConstants` is **partially live** — `CombatConfig.flee` (`:730-733`) and
`LootConfig.luckBonusPerPoint` (`:1511`) **are** imported and used here. But combat **ignores**
`CombatConfig.critDamage`/`defend`/`counter`/`damageEffectiveness` (it uses `derived.critMultiplier`,
hardcoded `0.5` defend, and `getDamageEffectiveness` from `Weapon.ts`). So the dead-vs-live split is
*per-field*, not whole-file. → audit GameConstants field-by-field in W4; don't blanket-delete.

**KV-AUD-066 | S3 | Confirmed | L1/L3 | `:866,1021`** — The cleanse debuff list
`['poison','bleed','burn','freeze','stun','blind','weaken','curse']` is duplicated verbatim in
`cure_all` (`:866`) and skill `cleanse` (`:1021`), and uses the **`StatusEffect.ts` vocabulary**
(`weaken`) — confirming the schism (KV-AUD-039): `Character.ts`'s `fear`/`silence`/`paralysis` are never
produced *or* cured in combat → those three are dead. → single shared `ALL_DEBUFFS` const; unify the
status model.

### Positives (verified — fairness / refutations)
- **KV-AUD-067 | Info | Confirmed | L3** — Combat is **well-wired** to the soul + sacred systems: ~30
  `soul.incrementBehavement(...)` calls (phys/magic attacks & kills, crits, dodges, blocks, observes,
  taunts, damage-taken, low-HP risk, boss-streak) and 7 `useSacredItemStore` metric calls fire across
  the file. (Each behavement **ID** must still be validated against `useSoulStore` definitions in
  W1-S4 — a typo'd ID increments nothing silently.) The **weapon triangle IS wired** in `playerAttack`
  (`:523-534`) → BUG-008/032 confirmed resolved. `damageMonster`'s `alreadyDead` guard (`:1357`)
  correctly prevents double-kill reward grants. Refutes any "combat doesn't track playstyle" claim.
  > **[Update S21 — CORRECTED by KV-AUD-096 (W1-S4a):** the praise here was half-wrong. Cross-validation
  > showed the store's behavement firing is *over-wiring*, not just "good wiring" — ~30 combat behavements
  > fire in BOTH the store *and* `combat.tsx` (KV-AUD-093 double-count). The standing positives (triangle
  > wired, `alreadyDead` guard, system is live) hold; the "well-wired soul" framing is superseded by 093.]

**Cross-checks discharged from W1-L1:** KV-AUD-043 (weapon-category→formula routing) **confirmed** — the
call sites pass `weapon.base.category ?? ''` directly (`:506,667`), so a `Set<string>` spelling drift
silently routes magic/hybrid → physical. KV-AUD-044 (sacred material `as never` fields) — not exercised
here; combat reads `derived.*`, not material fields, so the risk lives in `Stats.ts`/equip (W1-T1/S2).

**Unit verdict:** the engine is feature-rich and mostly correct, with strong soul/sacred wiring and a
real weapon-triangle — but it carries **two S2 correctness traps** (0-damage soft-lock, Infinity reward),
**several silent no-ops** (suffix status, buff/percent consumables, xp), **one safety regression**
(`startCombat` missing first-combat protection), and a **balance surface** (hybrid double-stat,
multiplicative burst, near-immortal LCK) that the balance pass must model. 6 cross-checks queued for
W1-S2 (rewards-clear caller, getDerivedStats path), W1-S4 (behavement IDs), W1-T1 (hybrid/derived),
W1-T4 (triangle table + armor union), Wave 2-P1 (`combat.tsx` rewards race + consumable application).

---

## Unit W1-S2 — `src/stores/useCharacterStore.ts` (1442 lines) — Session 3, audited first-hand (every line)

**Context:** persisted (`kohrvellia-character`) — owns the Character, the Falna stat-growth engine, the
derived-stats math combat consumes, equipment/inventory, level-up, death, deity favor, paragon buffs.

### Balance / growth (the headline)
**KV-AUD-068 | S2 | Confirmed | L3/L9 | `:377-417` vs `:245-291`** — **The stat-growth cost curve is
dead; live growth is flat.** Two paths exist: `addStatProficiency` (`:245-262`) climbs an *increasing*
`getProficiencyThreshold(grade)` curve (+100 pts per grade-up) — the only escalating-cost mechanism; and
`commitExcelia` (`:377-417`), the **live Falna path**, whose comment is explicit — *"FIXED: Proficiency
gains should directly increase points… 1 proficiency = 1 point"* (`:398-401`): `newPoints =
min(999, points + amount)`, **flat**, no threshold, `proficiency` reset to 0 (`:415`). Combat feeds
`addPendingExcelia` → `commitExcelia`, so the increasing-cost curve is bypassed and `addStatProficiency`
is likely orphaned (confirm callers in Wave 2). **Net: every point costs the same from grade I to SSS** —
the root cause of "SSS too cheap," compounding the compressed top-grade widths (KV-AUD-018). Confirms
seed KV-AUD-023 / prior AUD-087. → drive the canonical path off the escalating curve.

### Correctness / permadeath integrity
**KV-AUD-069 | S2 | Confirmed | L1/L6 | `:529-550`** — `modifyHP` can **resurrect a dead character**.
`isDead` is recomputed every call as `newHP <= 0` (`:534,546`); a *positive* `modifyHP` while dead sets
`newHP = currentHP(0) + amount > 0` → `isDead = false`. Nothing guards against healing a corpse, so any
post-death heal/regen (status tick, deity save, a screen race) silently un-kills the player — a
permadeath violation (R10). → early-return if `state.character.isDead` and `amount > 0`.

**KV-AUD-070 | S2 | Confirmed | L1 | `:702-768` vs `:673`** — Inventory overflow on armor/accessory
swap. `equipWeapon` guards `oldWeapon && newInventory.length < BAG_CAPACITY` (`:673`, the BUG-003 fix),
but `equipArmor` (`:710-721`) and `equipAccessory` (`:744-755`) push the displaced item into the bag with
**no capacity check** → `inventory.length` can exceed `BAG_CAPACITY (20)`. Inconsistent enforcement. →
apply the same guard (and a caller confirmation).

**KV-AUD-071 | S2 | Confirmed | L1 | `:180-191`, `:1232-1243`, `:1288-1299`** — The weapon
damage-routing block (isLuck/isMagic/isHybridMixed/physRatio/weaponDamage/weaponMagic/weaponLuck) is
duplicated **verbatim three times** — `computeMaxResources`, `getDerivedStats`, and
`getDerivedStatsWithBlessings`. A routing change must hit all three or they silently diverge (and they
feed maxHP, combat damage, and blessing-applied damage respectively). Confirms prior AUD-088. → extract
one `resolveWeaponDamageSplit(equipment)` helper.

**KV-AUD-072 | S2 | Confirmed | L2 | `:1224-1227`, `:1277-1280`** — Null-character derived-stat fallbacks
return a **9-field** object `as unknown as ReturnType<typeof calculateDerivedStats>`, but `DerivedStats`
carries ~30 fields combat reads (critMultiplier, cleaveDamage, armorPierce, spellPierce, luckAttack,
fortuneStrikeChance, comboRamp, moraleBonus, …). If combat ever derives with a null character, every
missing field is `undefined` → `NaN` propagates through damage. The cast deletes the guard. Confirms seed
KV-AUD-026. → return a fully-zeroed `DerivedStats`.

**KV-AUD-073 | S2 | Confirmed | L6 | `:1437-1440`** — No persistence versioning/migration. The `persist`
config sets only `name` + `storage` — no `version`, `migrate`, or `partialize`. The **entire** Character
(including computed `maxHP/maxSP`) is serialized; schema changes can't be migrated (only ad-hoc `??`
fallbacks in `computeCarryStats`/`resolveWeaponOutputCap` cover legacy), and stored max-resources can go
stale vs the formula across versions. → add `version`+`migrate`; `partialize` out derived fields.

### Connectivity / dead code
**KV-AUD-074 | S3 | Confirmed | L3 | `:444-449`** — INT & LCK stat-growth behavements never fire.
`commitExcelia`'s soul switch tracks END/AGI/WIS/CHA/PER/STR growth but **omits INT and LCK** — any
`*_int_growth`/luck-growth behavement is unreachable from the only growth commit. → add INT/LCK cases
(validate IDs against `useSoulStore`, W1-S4).

**KV-AUD-075 | S3 | Confirmed | L1 | `:1364-1366`** — Paragon `crit_damage` passive is applied as crit
**chance**, not crit **damage** ("Approximated… until critDamage is a first-class derived stat"). A title
promising crit damage silently grants crit chance. → add a real `critDamage` derived stat.

**KV-AUD-076 | S3 | Confirmed | L1 | `:894-926`** — `equipFromInventory`: armor slot is `as
'head'|'chest'|'hands'|'legs'` (`:912`) — a lie for any other slot; accessories are hardcoded to
`accessory1` (`:919-920`), so **`accessory2` is unreachable** via inventory-equip (a second accessory
overwrites the first). → respect the real slot; add accessory-slot selection.

**KV-AUD-079 | S4 | Confirmed | L1 | `:1132-1144`** — `setPatronDeity` sets `deityFavor=50` but does not
recompute `maxHP/maxSP` for the blessing (unlike `modifyDeityFavor`). Harmless at creation (createCharacter
recomputes) but a mid-game patron change wouldn't refresh resources. → recompute or document single-use.
> **[Update S21 — forward-link to KV-AUD-121:** `modifyDeityFavor` (the only post-creation writer of
> `character.deityFavor`, the value the blessing multiplier reads) turned out to have **0 callers**
> repo-wide. So `character.deityFavor` is frozen at 50 for the character's whole life and favor is
> mechanically inert for combat power — this S4 "single-use" note understated it; see the S1 at 121.]**

### Refinements & positives (fairness)
**KV-AUD-077 | Info | Confirmed | L6 | `:48-54`** — **Refines BUG-010 / KV-AUD-019.** `resolveWeaponOutputCap`
returns `Infinity` **only for a null weapon** (unarmed); the corrupt-tier path is guarded by `?? 3`. So
uncapped output is *unarmed-only*, not a corrupt-save bug as the doc implies. Still verify unarmed can't
scale unbounded. → reconcile the BUG-010 wording.

**KV-AUD-078 | Info | Confirmed | L4/L6 | `:237`, `:1431-1434`, `:1146-1170`** — **Refines KV-AUD-002 &
KV-AUD-004.** (1) `createCharacter` **does** call `useShopStore.resetReputation()` on new character
(`:237`) → shop-*reputation* bleed is handled; the remaining KV-AUD-002 gaps are sacred *character-scope*
metrics + `useInventoryStore` stash + shop `lifetimeGoldSpent` (verify W1-S4/S5). (2) The **live** blessing
path uses `types/Deity.getBlessingMultiplier` (0.5–1.5) via `getBlessingMultiplier` (`:179,1284,1434`) —
**not** `useDeityStore.FAVOR_STATUS` (0–2.0 with the 0× Abandoned). So the 0× landmine (KV-AUD-004) is a
latent table divergence, **not** currently wired to HP/combat. (3) `modifyDeityFavor` clamps `currentHP ≤
new maxHP` (`:1165-1166`) — correctly addressing prior AUD-033. Positives: the Falna carry model
(`levelHistory`→`computeCarryStats`→`calculateEffectiveStat`) is sound; `performLevelUp` auto-commits
pending excelia so no gains are lost on skip (`:1044-1046`); broad soul/sacred wiring throughout.

**Cross-checks discharged:** seed KV-AUD-024 — confirmed the store EXPOSES both `getDerivedStats` (no
blessing/paragon, blessingMult=1.0 `:1262`) and `getDerivedStatsWithBlessings` (blessing **and** paragon
buffs `:1325-1384`); whether *combat* passes the blessed one is a Wave 2-P1 (`combat.tsx`) check — if it
passes `getDerivedStats`, deity blessing + paragon are silently dropped from combat. **[Update S21 — the
blessing half is largely MOOT via KV-AUD-121 (W1-S6a): `modifyDeityFavor` has 0 callers, so
`character.deityFavor` is frozen at 50 and `getBlessingMultiplier` returns ~1.0× no matter which selector
combat reads. The paragon half is NOT moot — but it is separately broken (KV-AUD-177: ~half the noun
passives are dead). So the live damage from this selector gap is small; the wiring fix still matters.]** seed KV-AUD-046/047
(sacred armor/accessory bonuses) — **confirmed live**: both `getAccessoryStatBonuses` and
`getArmorStatBonuses` are merged into `mergedCarry` in all three derived paths (`:198-206,1248-1252,
1304-1308`), so sacred bonuses DO reach derived stats (but still miss any armor slot beyond head/chest/
hands/legs per KV-AUD-047). **[Update S21 — the parenthetical is now REFUTED: KV-AUD-195 (W1-T4) found
the game has only 4 armor slots (head/chest/hands/legs — no boots/feet), so `getArmorStatBonuses` misses
**nothing**. Sacred armor bonuses are fully live; seed 047 is withdrawn.]**

**Unit verdict:** the Falna carry architecture is genuinely well-built, but this store holds the audit's
**most important balance finding** (flat growth bypassing the cost curve, KV-AUD-068), a **permadeath
integrity bug** (resurrect-via-heal, KV-AUD-069), an inventory-overflow inconsistency, triple-duplicated
derived logic, and unversioned persistence. 2 cross-checks queued for Wave 2-P1 (blessed-selector usage,
`addStatProficiency` callers) and W1-S4 (INT/LCK growth behavement IDs).

---

## Unit W1-S3 — `src/stores/useDungeonStore.ts` (1119 lines) — Session 4, audited first-hand (every line)

**Context:** persisted (`kohrvellia-dungeon-v2`, `partialize`→`currentRun` only). Slay-the-Spire-style
node map generation + navigation + per-step ramifications + run flags + boss/milestone tracking.

### The farming exploit — now CONFIRMED end-to-end (was a "mechanism")
**KV-AUD-080 | S1 | Confirmed | L1/L9 | `:644-651`, `:698-719`, `:586`** — **Cleared combat/elite nodes
can be re-fought indefinitely.** Three facts combine: (1) `moveToNode` re-arms the node you *leave* —
`isCompleted: shouldReactivate ? false : …` for combat/elite (`:644-651`); (2) `getCurrentPathOptions`
returns **both forward and backward** connections (`forwardIds`+`backwardIds`, `:706-716`), so the UI
offers the node you just came from; (3) `moveToNode` performs **no navigability validation** (`:586` —
it finds the node by id and moves, never checking the target is connected). So: clear A → step to B
(A re-arms) → step back to A (now active again) → re-fight for gold/loot/proficiency/soul → repeat.
This **supersedes/confirms seed KV-AUD-005** (the open "is backtracking possible?" question is answered:
yes, explicitly). Directly violates the #1 pillar "Challenge, Not Grind" (benchmark: Grid Sage/Cogmind,
`05`). **Irony:** the store *does* implement anti-farming for *event weapons* (`canGrantEventWeapon`,
4-floor cooldown, `:509-513`) while leaving combat-node farming wide open. → forward-only navigation
(drop `backwardIds`) **and/or** never set `isCompleted:false`; validate the target in `moveToNode`.

**KV-AUD-081 | S2 | Confirmed | L1/L6 | `:572-596`** — `moveToNode` accepts **any** `nodeId` with no check
that it's reachable from the current node (no connection lookup). The only gate is the screen rendering
buttons from `getCurrentPathOptions`. A bug, a stale button, or a direct call could teleport to the boss
or skip rows. → validate `nodeId ∈ getCurrentPathOptions()` inside the action (defense-in-depth; also
closes the farm's backward step if combined with forward-only).

### Generation / determinism
**KV-AUD-082 | S2 | Confirmed | L1/L6 | `:45,1052-1054`** — The "seed" is non-deterministic and floors
are non-persistent. `generateFloorMap` seeds `createSeededRNG` with `Date.now() + floorNumber*1000`
(`:45`) and stores `seed` in the map (`:184`) as if reproducible — but a wall-clock seed can never be
reproduced, so the seeded-RNG buys nothing. Worse, `ascendFloor` calls `generateFloorMap(previousFloor)`
fresh (`:1054`, "fresh path each time") → going **back up** a floor yields a **different** layout than
coming down. Floors aren't stable spaces; ascend↔descend re-rolls content (and pairs with the KV-AUD-080
farm). → if reproducibility/persistence is wanted, persist generated maps per floor and seed from the
run seed, not `Date.now()`.

**KV-AUD-083 | S3 | Confirmed | L3 | `:206-207,248`** — Dead `shop` node + contradictory comment.
`selectNodeType`'s `validTypes` (`:248`) omits `shop`, so shop nodes never generate, yet the function's
own doc comment (`:206-207`) says *"Shop weight is low (5): rare wandering merchant encounters."*
Confirms prior AUD-044. → remove the dead shop surface (and `NODE_TYPE_WEIGHTS.shop`, W1-T2) or implement.

**KV-AUD-084 | S3 | Confirmed | L3 | `:272-273`** — `selectMysteryRevealType` ignores its `_floorNumber`
arg (mystery reveal is floor-independent 60/20/20), flagged with a vestigial
`// eslint-disable-next-line @typescript-eslint/no-unused-vars` — and **no ESLint is configured**, so the
suppression references a linter that never runs. → drop the param + the dead directive.

**KV-AUD-085 | S3 | Confirmed | L3 | `:62-69`** — **Confirms seed KV-AUD-021 / prior AUD-046:** floor size
is `ROWS_PER_FLOOR` middle rows × 2-3 columns (`:63,69`) — `NODES_PER_FLOOR_BASE/MAX` are **not used**
here (they live dead in `Dungeon.ts`, W1-T2). PROGRESS's "45 rooms" is stale. → delete the dead
constants / fix docs.

### Smaller correctness / persistence
**KV-AUD-086 | S2 | Needs-repro | L1 | `:454-478`** — `enterFloor` ticks the living economy
(`useMarketStore.onFloorDescend`, `:475`) on every call; the comment claims "real floor descents, not
enter/exit cycles" (`:473`). If `enterFloor` is also called on resume/re-entry from town (verify callers,
Wave 2-P3 `floor.tsx`), the market over-ticks. → gate the tick on an actual depth increase.

**KV-AUD-087 | S3 | Confirmed | L1 | `:418-430`** — `endRun` reads `monstersKilled` from
`pendingExcelia?.monstersKilled ?? 0` (`:428`). If excelia was committed (→ `pendingExcelia=null`) before
the run ends, run-stat kills report **0**. → track kills on the run, not on pending excelia.

**KV-AUD-088 | S3 | Confirmed | L6 | `:1112-1116`** — `partialize` persists only `currentRun`, so
`floorContext` (per-floor flags: usedHealing/triggeredTrap/restedThisFloor) is **not** persisted — an app
close mid-floor resets those, dropping any behavement/achievement keyed on them. Also the store version is
a manual name suffix (`-v2`) with no `migrate`. → persist `floorContext` (or accept the reset
explicitly); use zustand `version`+`migrate`.

**KV-AUD-089 | S4 | Confirmed | L9 | `:251-261`** — Treasure is gated **twice** (weighted selection *then*
a 4–12% floor roll, else `→combat`), so `NODE_TYPE_WEIGHTS.treasure` overstates the real treasure rate.
Intended ("ULTRA-RARE") but makes the weight table misleading for tuning. → fold the rarity into the
weight.

**KV-AUD-090 | Info | Confirmed | L3** — **Positives:** `startNewRun` snapshots soul-vector scores for
per-run boss-dialogue delta (`:396-406`, addresses prior BUG-026) and resets sacred run metrics (`:415`);
`moveToNode` validates `currentRun`/`currentMap` defensively; generation guarantees ≥1 incoming connection
per node (`:143-158`) and a structural elite gatekeeper before the boss (`:160-169`). `clearAllData`
(`:1103-1105`) correctly nulls run/ramifications/floorContext (this is what `clearAllStores` calls).

**Unit verdict:** generation is thoughtfully built (anti-cluster guards, structural elite, floor-tiered
weights), but the store contains the audit's **second confirmed S1 — a wide-open grind exploit**
(KV-AUD-080), plus an unvalidated `moveToNode`, a non-deterministic "seed" with re-rolling floors, and
the long-confirmed dead shop/constants. 1 cross-check queued for Wave 2-P3 (`enterFloor` callers /
market over-tick) and W1-T2 (`Dungeon.ts` biomes + dead constants + `NODE_TYPE_WEIGHTS`).

---

## Unit W1-S4a — `src/stores/useSoulStore.ts` (405 lines, not 684) — Session 5, audited first-hand (every line) + full cross-validation

**Context:** persisted (`kohrvellia-soul`). Holds the 90 behavement *definitions*, the per-behavement
progress, vector scores, and the Level-10 Denatus/Paragon ceremony. This unit was audited *with* a
codebase-wide grep of every firing site so each behavement ID could be validated end-to-end.

### Per-function coverage map (proof of line-by-line)
| Symbol | Lines | Verdict |
|---|---|---|
| `BEHAVEMENT_DEFINITIONS` | 31-141 | **90** entries (not 85) — KV-AUD-091; 2 firing-but-maybe-unreachable — KV-AUD-095 |
| `initializeDenatus` | 186-201 | Wired (`useGameStore:340,347`, `confirm.tsx:80`) — KV-AUD-096 |
| `reset` | 203-208 | Clean — nulls `denatus`+`ceremonyCompleted`; called by `clearAllStores` ✓ |
| `trackBehavement` | 211-242 | Atomic (mutates inside `set`); clamps `Math.min(target, progress)` ✓ |
| `incrementBehavement` | 244-252 | **Non-atomic read-modify-write** — KV-AUD-092 |
| `setBehavementProgress` | 254-256 | Delegates to `trackBehavement` (idempotent set) ✓ |
| `checkConsecutiveBehavement` | 258-296 | Atomic (reads inside `set`) — correct; contrast w/ `incrementBehavement` |
| `recalculateVectorScores` | 299-312 | Clean |
| `performDenatus` | 315-332 | One-time guard (`ceremonyCompleted`); forwards caller `topStats` — KV-AUD-097 |
| `addHint` | 335-349 | Clean — last-20 ring buffer; caller = deity hints (verify W1-S6) |
| getters | 352-394 | Delegate to `Behavement.ts` (W1-T3); `getDominantVector` defaults `COMBAT_PHYSICAL` |
| `persist` config | 396-399 | **No `version`/`migrate`** — KV-AUD-094 |

### Behavement firing cross-validation (the headline)
**KV-AUD-093 | S2 | Confirmed (dual sites) / per-event 2× Likely | L1/L9 | store vs `combat.tsx`** — **~30
combat behavements are double-counted.** The combat **store** fires them inside its actions AND the
combat **screen** fires the *same IDs* in the handlers that call those actions. Because both use
`incrementBehavement` (additive), each combat event counts **twice**. Representative duplicates (store →
screen):

| Behavement | `useCombatStore.ts` | `combat.tsx` |
|---|---|---|
| `phys_attacks_100/500` | `:539-540` | `:308-309` |
| `phys_crits_25/100` | `:542-543` | `:289-290` |
| `phys_kills_50/200` | `:1404-1405` | `:314-315` |
| `*_weapon_kills` (str/agi/per/cha/lck/end) | `:1407-1422` | `:319-324` |
| `magic_attacks_100/500`, `magic_kills_50/200`, `magic_*_weapon_kills` | `:546-547,1412-1419` | `:447-455` |
| `tank_blocks_50/200` | `:722-723` | `:334-335` |
| `tank_damage_taken_1000/5000` | `:1287-1288` | `:786-787` |
| `tank_heal_received` | `:913` | `:385` |
| `caution_observes/200` | `:768-769` | `:511-512` |
| `caution_consumable_use` | `:911` | `:407` |
| `evade_dodges_50/200` | `:1174-1175` | `:812-813` |
| `social_taunts/100` | `:810-811` | `:361-362` |
| `risk_low_hp_attacks` | `:550` | `:272` |
| `glory_boss_streak_3/5` | `:1438-1439` | `:1058-1059` |
| `resource_gold_1000/10000` | `useCharacterStore:576-577` (via `modifyGold`) | `:1092-1093` |

Impact: every **COMBAT_PHYSICAL/MAGIC/TANK/EVASION** counter (and combat-derived RESOURCE/SOCIAL) advances
at **2×**, while purely screen-fired vectors (EXPLORATION rooms, CAUTION rooms, SOCIAL shops/shrines,
GLORY floor-survival) advance at **1×** — so the hidden vector balance that *defines the Paragon title* is
systematically skewed toward combat. This is the precise mechanism behind a "why is my title always a
combat title" outcome, and it compounds KV-AUD-011 (sort bug) and KV-AUD-020 (mythic=100). **Note the
distinction:** the *`setBehavementProgress`* duplicates (`resource_legendary_find` store
`useCharacterStore:830` + screen `:1097`; `magic_no_physical`, `glory_perfect_floor`, `evade_boss_no_hit`)
are **idempotent** (set to 1, not additive) → **not** affected. → remove the behavement calls from one
layer (the store is the cleaner owner; strip them from `combat.tsx`), or centralize all soul tracking in
the store and never fire from screens. *(Per-event 2× to be nailed in W2-P1 by tracing that
`combat.tsx:308` and the `playerAttack` call share one handler — the dual sites themselves are confirmed.)*

### Code-level correctness
**KV-AUD-091 | S2 | Confirmed | L3 | `:31-141`** — There are **90** behavements, not the "85" every doc
states (`SOUL_BEHAVEMENTS.md`, PROGRESS, CLAUDE). Count: 4 vectors ×10 (PHYS/MAGIC/TANK/EVASION) + 5 ×8
(RISK/CAUTION/SOCIAL/EXPLORATION/RESOURCE) + GLORY ×10 = **90**. This matters because the CR-adjective
thresholds (`SoulSystem.crScoreRanges`, mythic=100) and `calculateBehavementScore` normalize against the
true count (W1-T3) — a wrong documented count means the published "max score" math is wrong. Confirms seed
KV-AUD-030. → fix docs; assert `BEHAVEMENT_DEFINITIONS.length` in a test.

**KV-AUD-092 | S3 | Confirmed | L1/L10 | `:244-252`** — `incrementBehavement` is a **non-atomic
read-modify-write**:
```ts
incrementBehavement: (behavementId, amount = 1) => {
  const { denatus } = get();                       // ← reads current OUTSIDE set()
  if (!denatus) return;
  const behavement = denatus.behavements.find(...); // ← stale snapshot
  get().trackBehavement(behavementId, behavement.current + amount); // computes from stale read
}
```
Two synchronous increments of the **same** id (e.g. a double-hit that resolves two `phys_attacks` in one
tick, or React batching) both read the same `current` → the second overwrites the first (lost update).
Contrast `checkConsecutiveBehavement` (`:258-296`), which reads the behavement **inside** `set((state)=>…)`
and is race-free — so the codebase already has the correct pattern. → refactor `incrementBehavement` to do
the read+add **inside** `trackBehavement`'s `set` (pass a delta, not an absolute).

**KV-AUD-094 | S2 | Confirmed | L6 | `:218`, `:396-399`** — No persistence migration. `persist` sets only
`name`+`storage`; the 90-element `denatus.behavements` array is serialized whole. `initializeDenatus`
(`:190`) only builds the array from definitions on a **fresh** denatus, and `trackBehavement` bails when an
id isn't found (`:218` `if (behavementIndex === -1) return state;`). So after a definitions change
(add/rename a behavement) that ships to an existing save, the **new** ids silently no-op forever and
**removed** ids linger as dead progress — with no migration to reconcile. → add `version`+`migrate` that
merges current `BEHAVEMENT_DEFINITIONS` into the persisted array on load.

### Connectivity nuances
**KV-AUD-095 | S3 | Confirmed | L3 | `room.tsx:772`, `useDeityStore.ts:322`** — Two behavements have a
firing site but a **possibly-unreachable trigger**: `explore_secret_rooms` is incremented at `room.tsx:772`,
yet floor generation has **no secret-room node type** (W1-S3 `selectNodeType` validTypes omits any
"secret") — so the increment may be in dead code; and `glory_challenge_complete` fires at deity store
`:322` though God-Challenges are "NOT STARTED" (PROGRESS 2.4). → confirm reachability in W2 (room.tsx) /
W1-S6 (deity challenges); if unreachable, those two behavements can never complete (dead vector points).
> **[Update S21 — both halves now resolved within Wave 1:** (1) `glory_challenge_complete` is **reachable**
> — KV-AUD-127 (W1-S6a) confirmed God-Challenges ARE wired (`issueChallenge`←familia, `recordChallengeEvent`
> ←room/combat/floor), so PROGRESS "2.4 NOT STARTED" is stale. (2) `explore_secret_rooms` is **confirmed
> unreachable** — no secret-room node type generates — and this is precisely the example KV-AUD-178 (W1-T3)
> uses to prove the max behavement score is capped **below 100**, making the Mythic title impossible. So one
> half is fine, the other is a dead vector point with a downstream consequence.]**
> **[CORRECTION S24 — the (2) above is WRONG:** KV-AUD-244 (W2-P2) found `explore_secret_rooms` **IS
> reachable** — it fires on *every mystery-node reveal* (`room.tsx:772`), and mystery nodes generate. So it
> is **not** a dead vector point, and 178's "Mythic capped <100 because this can't fire" example is undercut.
> Both halves of 095 are reachable. (R1 in action — correcting my own S21 annotation.)]**

**KV-AUD-096 | Info | Confirmed | L3** — **Corrects W1-S1 KV-AUD-067.** That note praised the store's
behavement firing as "good wiring"; cross-validation shows it's actually **over**-wiring (the source of the
KV-AUD-093 double-count). Positives that stand: the system **is** initialized (`useGameStore:340,347`;
`confirm.tsx:80`) and the ceremony **is** invoked (`denatus.tsx:117`), so the soul layer is live; and the
vast majority of the 90 behavements have real firing sites spread across combat/room/floor/level-up/deity
(coverage is broad, contradicting any "half the soul system is unfired" claim).

**KV-AUD-097 | S3 | Confirmed | L1 | `:315-319`** — `performDenatus(topStats)` forwards the caller's
pre-chosen `[StatName,StatName]` straight to `generateParagonTitle` (`:319`); the store adds no validation
and no agency. This is the store-side half of KV-AUD-011 (sort bug) / prior AUD-065 (no player choice on
ties) — the title's correctness depends entirely on `Behavement.ts` (W1-T3) and the `denatus.tsx` caller
(W2-P4). → resolve in those units.

**Unit verdict:** the soul store's own code is small and mostly clean (atomic `trackBehavement`/
`checkConsecutive`, one-time ceremony guard), but cross-validation surfaced a **systemic double-count**
(KV-AUD-093) that biases the entire Paragon mechanic toward combat, plus a count-drift, a non-atomic
increment, and an unversioned 90-element persisted array that breaks on any definitions change. Crucially,
the verification **refuted** the scarier hypothesis (a dead/unfired soul system) — the wiring is broad and
the ceremony is live. Cross-checks queued: W2-P1 (`combat.tsx` per-event double-fire trace + the ~30 dup
removals), W2-P4 (`denatus.tsx` topStats agency), W1-T3 (`Behavement.ts` score normalization vs count=90),
W1-S6 (deity `glory_challenge_complete` reachability).

---

## Unit W1-S4b — `src/stores/useSacredItemStore.ts` (617 lines) — Session 6, audited first-hand + item-data & caller cross-reference

**Context:** persisted (`kohrvellia-sacred-items`). Accumulates ~50 metrics and checks them against every
sacred item's `acquisition.requirements` to auto-unlock pantheon pieces, domain artifacts, and deity
relics (~770 checkable items via `getAllCheckableItems`). Audited with a grep of `src/data/items` (which
items use which metrics, at what value) and a caller grep (which metric writers actually fire).

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `SacredItemMetrics` / `INITIAL_METRICS` | 25-181 | `character_*` declared "reset on new character" but no resetter — KV-AUD-098 |
| `evaluateRequirement` | 187-258 | **14 `return 0` stubs** + reads 3 no-writer metrics — KV-AUD-099 |
| `checkItemUnlockable` | 260-276 | `value===0` ⇒ "must be zero" semantics — interacts catastrophically with the 0-stubs (KV-AUD-099) |
| `getAllCheckableItems` | 282-285 | Rebuilds ~770-item array every call — KV-AUD-101 |
| increment/record actions | 300-505 | Atomic ✓; **inconsistent `checkAndUnlock`** (KV-AUD-100); `recordParagon`/`incrementEventSuccess` have no callers (KV-AUD-099) |
| `resetRunMetrics` | 509-529 | Resets `run_*` only — **not** `character_*`/lifetime (KV-AUD-098) |
| `checkAndUnlock` | 533-576 | Full-catalog scan per call; pushes to inventory via `require()` |
| `forceUnlock` | 578-590 | **Dead code — zero callers** (KV-AUD-099) |
| `persist` | 608-616 | `partialize`→acquired+metrics; **no version/migrate** — KV-AUD-102 |

### The sacred-item unlock system is substantially broken (the headline)
**KV-AUD-099 | S1 | Confirmed | L3/L1 | `:206-256`, `:578`, item data** — A large fraction of the ~770
sacred items can **never** unlock, and a second set unlock **falsely**. Three compounding causes:

**(a) 14 metrics hardcode `return 0`** (`evaluateRequirement`): `boss_noattack`(206), `boss_skillonly`(207),
`floors_nodeath`(210), `floor_noconsumable`(211), `floor_nodefend`(212), `dodges_total`(215),
`taunt_total:causes_enemy_flee`(221), `achievements_total`(245), `level_reached`(246), `stats_grade`(249),
`same_weapon_run`(252), `debuffs_active_boss`(253), `sp_damage_dealt`(254), `custom`(255).

**(b) `forceUnlock` (the "checked externally" escape hatch) is never called** — grep across the whole repo
finds only its declaration/impl (`:122,578`). So `level_reached`/`stats_grade` items, whose comments say
"checked externally", have **no** external checker.

**(c) Two more metrics have no writer at all:** `recordParagon` (sets `paragon_achieved`) and
`incrementEventSuccess` (sets `event_success`) are **never called anywhere** (caller grep), and there is no
`incrementSkillUse` (so `skill_uses`/`skill_sp_spent` are always 0).

**Bidirectional impact, with real items:**
- **Unobtainable** (`requireAll` + dead metric + `value>0` ⇒ `0 >= value` false forever):
  `deityRelics_dark.ts:31,49,80,204` & `deityRelics_eastAsian.ts:219,298,313` (`level_reached` 2-5);
  `deityRelics_dark.ts:32`/`eastAsian.ts:238` (`stats_grade`); `dark.ts:298-299`/`egyptian.ts:183`
  (`floor_nodefend`/`floor_noconsumable` 10-15); `eastAsian.ts:65` (`sp_damage_dealt` 1500);
  `eastAsian.ts:206` (`boss_skillonly`); `eastAsian.ts:299` (`achievements_total` 3). `level_reached`
  alone gates a large share of the **single_character deity relics** across all 16 relic files.
- **False-positive unlock** (`value:0` "must-be-zero" + dead metric ⇒ `0===0` true): `eastAsian.ts:50`
  `{metric:'boss_noattack', value:0}` is auto-satisfied, so the relic unlocks on its *other* requirement
  (`boss_kills_run ≥ 1`, i.e. any boss kill) — the intended "defeat a boss with ONLY basic attacks"
  challenge is silently bypassed. Every `value:0` requirement on a dead metric is a free pass.

→ Fix in three parts: implement the 14 metric trackers (or wire `forceUnlock` from the level-up/denatus/
stat screens for `level_reached`/`stats_grade`/`paragon`); call `recordParagon`/`incrementEventSuccess`;
and make the `value:0` path require the metric to be **live** (e.g. a `trackedMetrics` allow-list) so a
0-stub can't auto-satisfy. Quantify exact affected item count in W3-DI (full item-data pass). This
confirms seed **KV-AUD-006** with far more precision and a second failure mode.

### Permadeath state-bleed (extends KV-AUD-002)
**KV-AUD-098 | S2 | Confirmed | L4/L6 | `:57-59`, `:509-529`, `:539`, `:611-614`** — Sacred state never
resets on a new character, with two consequences:
1. **`acquired` bleeds and *blocks* re-earning.** `acquired` is persisted (`:612`) and `clearAllStores`
   doesn't touch this store (W1-L1 KV-AUD-002). On a new character, `checkAndUnlock` skips any
   already-acquired id (`:539 if (acquired.includes(item.id)) continue`). The new character has a **fresh
   inventory** (it never received the item) yet can **never unlock it** → sacred items earned by a dead
   character are permanently lost to all future characters.
2. **`character_*` metrics are documented to reset but don't.** `:57-59` label `character_boss_bypass`/
   `character_boss_kills_unique` "reset on new character," but `resetRunMetrics` (`:509-529`) clears only
   `run_*`, and **no `resetCharacterMetrics` exists**. So single-character relic progress accumulates
   across permadeath. → add a `resetForNewCharacter()` (clears `acquired` + `character_*` + lifetime as
   designed) and call it from `createCharacter`/`clearAllStores`.

### Correctness & performance
**KV-AUD-100 | S2 | Confirmed | L1/L3 | various** — Inconsistent unlock-checking. Most increments end with
`get().checkAndUnlock()`, but **seven do not**: `incrementFlee`(338-347), `incrementShopSpend`(397-399),
`incrementEventSuccess`(421-423), `incrementShopVisit`(425-427), `incrementDamageTaken`(472-480),
`setBossNoDamage`(503-505), and critically **`recordMaxFavor`**(448-460) — which sets
`deities_at_max_favor`, the exact gate `checkAndUnlock` uses for secret items (`:541`). So hitting 100%
favor does **not** immediately check the deity's secret relic; it unlocks only on the next unrelated metric
event. → call `checkAndUnlock()` after any metric that can satisfy a requirement (or after every set).

**KV-AUD-101 | S2 | Confirmed | L5 | `:282-285`, `:533-545`** — `checkAndUnlock` runs on **every** metric
increment (every kill via `incrementKills:309`, observe, heal, gold update…), and each call rebuilds the
entire item list — `ALL_DEITY_RELICS.flatMap(r => [r.weapon, r.accessory])` (~672) + pantheon pieces +
artifacts ≈ **770 items** — then evaluates every item's requirements. That's an unmemoized O(items ×
requirements) scan per combat tick on a 60fps mobile target. → memoize `getAllCheckableItems` (module
const), index items by metric, and/or debounce `checkAndUnlock`.

**KV-AUD-102 | S3 | Confirmed | L6 | `:608-616`** — No persistence `version`/`migrate`; `metrics` (incl.
the evolving `SacredItemMetrics` shape) and `acquired` are serialized whole. A metrics-shape change can't
migrate. → add versioning.

**KV-AUD-103 | Info | Confirmed | L3** — Positives: every increment mutates atomically inside `set`; the
metric *writers* that exist are correctly wired (`incrementMysteryRoom`←`room.tsx:183`,
`incrementTreasureRoom`←`room.tsx:322`, `incrementBlacksmithSpend`←`useBlacksmithStore:311`,
`recordMaxFavor`←`useDeityStore:152`, `incrementShopVisit`←`useShopStore:492`); the conditional
requirement engine (`requireAll`/some, "must-be-zero") is a sound design **where the metric is live** — the
failure is entirely the dead metrics + dead `forceUnlock`, not the evaluator.

**Unit verdict:** beneath a clean, atomic store sits a **largely non-functional content system** — by the
combination of 14 `return 0` stubs, 3 no-writer metrics, and a never-called `forceUnlock`, a major share of
~770 sacred items is unobtainable, while `value:0` requirements on dead metrics hand out *false* unlocks;
plus a confirmed permadeath bleed (`acquired` blocks re-earning) and an O(770)-per-tick scan. This is the
unit's S1. Cross-checks queued: **W3-DI** (exact unobtainable-item count across all 16 relic files +
pantheon sets), **W2-P4** (does level-up/denatus call `recordParagon`/`forceUnlock`?), **W1-S6** (deity
`recordMaxFavor`/secret-relic flow). Closes the W1-L1/W1-S2 KV-AUD-002 sacred cross-check: **confirmed the
char-scope + acquired bleed is real and unmitigated.**

---

## Unit W1-S5a — `useShopStore.ts` (579) + `useMarketStore.ts` (219) — Session 7, audited first-hand + consumer cross-reference

**Context:** the town economy. `useShopStore` (persisted `kohrvellia-shop`) = general/equipment vendor
stock, pricing, reputation, "merchant memory." `useMarketStore` (persisted `kohrvellia-market`) = a
material-price fluctuation system. Audited with a grep of every `useMarketStore` consumer.

### Per-function coverage maps
**`useShopStore`:** `calcExpectedSpend`(99-118) exponential expectation ✓ · `shouldRefreshStock`(136-153)
stock tier keyed to `bestFloorReached` — KV-AUD-105 · `refreshStock`(156-220) guarantees armor stock —
KV-AUD-108 · `purchaseConsumable`(232-325)/`purchaseEquipment`(328-413) spend **`useInventoryStore`** gold —
KV-AUD-106 · `sellItem`(416-456) no soul/rep — KV-AUD-109 · `recordVisitEnd`(489-526) updates
`lifetimeGoldSpent` · `addReputation`(533-546) clamped + discovery hook ✓ · `resetReputation`(549-551)
**resets rep only** — KV-AUD-104 · `partialize`(568-576) persists `lifetimeGoldSpent` · `_Consumable`
import(10) dead — KV-AUD-110.
**`useMarketStore`:** `onFloorDescend`(121-158) tick/expire/spawn ✓ · `recordSale`(160-167) ✓ ·
`getMultiplier`(169-191) **only consumer = guildhall** — KV-AUD-111 · `getSupplyPressures`(195-204) ✓ ·
`reset`(206-212) **called by `clearAllStores`** ✓ (no bleed — contrast shop).

### State-bleed (closes the KV-AUD-002 shop cross-check)
**KV-AUD-104 | S2 | Confirmed | L4/L6 | `:496-502,549-551,568-576`** — Shop `lifetimeGoldSpent` bleeds
across permadeath. `resetReputation` (the new-character reset, called at `useCharacterStore:237`) resets
**only** `npcReputation`:
```ts
resetReputation: () => { set({ npcReputation: DEFAULT_NPC_REPUTATION }); },
```
but `lifetimeGoldSpent` is persisted (`:575`) and reset **nowhere** (clearAllStores doesn't call the shop
at all — W1-L1). So a new level-1 character inherits the dead character's lifetime spend → `calcExpectedSpend`
(`:99-118`) immediately demands high per-visit spending (e.g. ≥1,200g at lifetime 8k) → `recordVisitEnd`
docks reputation for "underspending" on a broke fresh character → higher prices. Precise, confirmed shop
half of KV-AUD-002. → reset `lifetimeGoldSpent`+`belowExpectationScore` in `resetReputation`.

### Economy correctness / connectivity
**KV-AUD-106 | S2 | Needs-repro | L1/L3 | `:259,270,355,450`** — **Two gold pools.** The shop reads/mutates
**`useInventoryStore`** gold (`inventoryStore.getGold()`/`spendGold`/`addGold`), but combat rewards and
`modifyGold` operate on **`character.gold`** (W1-S1/S2). If the two pools aren't synced on town entry, gold
earned in the dungeon is **not spendable** at the shop, and shop sales pay into a different pool than the
dungeon spends from. Potential core-economy disconnect. → **resolve in W1-S5b** (does `useInventoryStore`
mirror `character.gold`?) + Wave 2 (town transition sync). **[Update S21 — RESOLVED & REFUTED in W1-S5b:
`useInventoryStore`'s `addGold`/`spendGold`/`getGold` are a thin **facade** that delegate straight to
`character.gold`. There is NO second pool; dungeon gold IS shop gold. This dissolves the thread and also
corrects CLAUDE.md's "separate stash" claim. Filed `Needs-repro` precisely so it could be checked — it was.]**

**KV-AUD-105 | S2 | Confirmed | L9 | `:139,158,174-179`** — Shop stock tier is keyed to
`useGameStore.bestFloorReached` (meta, cross-character), not the current character's depth. A new level-1
character created after a deep run sees gear generated for the best-ever floor — over-tier and unaffordable.
→ key stock to the current run depth, or clamp to character level.

**KV-AUD-108 | ~~S2~~ REFUTED→Info (by W2-P7b KV-AUD-281: armor IS equippable via `equipFromInventory`; defense applies — don't gate it out, finish wiring penalties/accessory2) | L9 | `:181-185,361-370`** — The shop guarantees
one armor per slot + ~40% random armor and fully supports buying it, but whether bought armor is
**equippable** depends on the town inventory UI (the store supports it — W1-S2 `:910-915` — but the UI may
hide armor slots "Phase 3"). If hidden, players buy unusable goods (prior AUD-084). → confirm Wave 2; gate
armor out if unequippable.

**KV-AUD-107 | S2 | Confirmed | L3 | `:40,93,484-486`** — Dual blacksmith reputation:
`useShopStore.npcReputation.blacksmith` exists (default 1) and `getReputation('blacksmith')` reads it, but
**no shop code writes it** (purchases touch only general/equipment), while `useBlacksmithStore` keeps its
own. The shop's blacksmith rep is likely dead/stale. Confirms KV-AUD-016. → resolve canonical source in
W1-S5b; delete the unused one.

**KV-AUD-109 | S3 | Confirmed | L3 | `:416-456`** — `sellItem` fires no soul behavement / sacred metric,
whereas Guild Hall material sales fire `resource_sell_items` (`guildhall:445,474`). Selling at the shop
doesn't count toward the "Merchant" behavement; selling at the guildhall does — invisible inconsistency. →
fire `resource_sell_items` + `incrementShopSpend` from `sellItem`.

### Market store
**KV-AUD-111 | S3 | Confirmed | L3/L8 | consumer grep** — The "Living Economy" is **narrowly scoped &
mislabeled.** `getMultiplier` is consumed **only** by the Guild Hall material board
(`guildhall/index.tsx:421,457,502`) → it affects **material sell prices only**, not shop buy/sell,
consumables, or equipment (the shop never imports `useMarketStore`). The docstring "The Living Economy"
oversells a one-screen system. **Positive:** unlike the shop, `reset()` **is** wired into `clearAllStores`
(`:27`) so the market doesn't bleed. → broaden it to the shop economy or rename to its true (material-only)
scope.

**KV-AUD-112 | S3 | Confirmed | L9 | `:177-190`** — Market event effects stack **multiplicatively** with a
floor of 0.25 but **no ceiling**; two stacked 3× events = 9× on a category. Material prices can spike
unbounded. → cap the upside (e.g. max 4×).

**KV-AUD-110 | S4 | Confirmed | L3 | `:10`** — Dead import `Consumable as _Consumable` (underscore dodges
`noUnusedLocals`). Confirms prior AUD-064. → delete.

**Unit verdict:** the shop is a rich, well-built vendor (exponential surcharge, CHA-haggle irritation,
reputation discovery, merchant-memory expectations) but carries a confirmed **permadeath bleed**
(`lifetimeGoldSpent`), a **meta-keyed stock tier**, a ~~likely **two-gold-pool disconnect** (the most
important open thread)~~ **[S21: REFUTED in W1-S5b — no second pool; facade over `character.gold`]**, and a dead dual blacksmith-rep; the market is sound but mislabeled and narrowly
wired. Cross-checks for **W1-S5b**: `useInventoryStore`↔`character.gold` sync (KV-AUD-106) + canonical
blacksmith rep (KV-AUD-107); **Wave 2**: armor equippability + `recordVisitEnd`/`resetSessionCounts`
callers.

---

## Unit W1-S5b — `useInventoryStore.ts` (247) + `useBlacksmithStore.ts` (433) — Session 8, audited first-hand

**Context:** `useInventoryStore` (persisted `kohrvellia-inventory-ui`) advertised as "stash/gold" but is
actually a **facade** over `useCharacterStore`. `useBlacksmithStore` (persisted `kohrvellia-blacksmith`) =
identify/upgrade/reputation for the smith (Garm). Audited to resolve the W1-S5a gold-pool + dual-rep threads.

### Per-function coverage maps
**`useInventoryStore`:** `useConsumable`(68-136) applies effects (buff **works** here — KV-AUD-116; cure-by-id
suspect — KV-AUD-115) · `addGold/spendGold/getGold`(145-159) **delegate to `character.gold`** — KV-AUD-106
REFUTED · `addItem`(162-182) **ignores `addToInventory` failure** — KV-AUD-113 · other item/material wrappers
delegate to character store · `partialize`(242-244) persists **only `selectedItemId`** (no stash).
**`useBlacksmithStore`:** `modifyReputation`(78-82) clamp ✓ (float — KV-AUD-117) · `identifyWeapon`(112-177)
stale-snapshot `setState` — KV-AUD-114 · `canUpgrade`(182-244) sound gating ✓ · `upgradeWeapon`(252-314)
**no `maxOutputCap` recompute** — KV-AUD-027 confirmed · registry helpers self-heal (`:338,354`) but actions
don't — KV-AUD-118 · `reset`(364-366) **called by `clearAllStores`** ✓ (no bleed) but rep 0≠initial 1 —
KV-AUD-117.

### Resolved cross-checks (refutations + confirmations)
**KV-AUD-106 [REFUTED] | was S2 | `:145-159`** — There is **no** two-gold-pool disconnect. `useInventoryStore`
gold is a passthrough:
```ts
addGold:   (a) => useCharacterStore.getState().modifyGold(a),
spendGold: (a) => { if (character.gold < a) return false; modifyGold(-a); return true; },
getGold:   () => useCharacterStore.getState().character?.gold ?? 0,
```
So the shop spending "`useInventoryStore` gold" **is** spending `character.gold`. The W1-S5a top thread
dissolves. **Also refutes the inventory half of KV-AUD-002**: there's no separate stash to bleed
(`partialize` persists only `selectedItemId`). And it **corrects CLAUDE.md**, which describes
`useInventoryStore` as "Stash items, gold (separate from in-run inventory in Character)" — false; it's a
facade. (This is why KV-AUD-106 was filed `Needs-repro`, not Confirmed — the read paid off.)

**KV-AUD-107 [CONFIRMED] | S2 | L3 | `useBlacksmithStore:38,72,218` vs shop** — Blacksmith reputation's
**canonical home is `useBlacksmithStore.reputation`** — it gates upgrades (`canUpgrade:218` checks
`requiredReputation`) and tiers (`getReputationTier:84-90`). `useShopStore.npcReputation.blacksmith`
(W1-S5a) is the **dead duplicate** (never written, never used for gating). → delete the shop's blacksmith
rep field. Confirms KV-AUD-016.

**KV-AUD-119 [CONFIRMED] | S2 | L9 | `:287-295`** — `upgradeWeapon` recomputes `finalDamage`/`accuracy`/
`crit`/`displayName`/`quality` but **omits `maxOutputCap`**:
```ts
const upgradedWeapon: Weapon = { ...weapon, quality: qualityData,
  finalDamage: calculateUpgradedDamage(weapon, qualityData), … };  // no maxOutputCap
```
The cap was set at generation from the *original* quality tier (`QUALITY_OUTPUT_CAP_MULTIPLIER`), so an
upgraded weapon keeps its lower cap and **throttles the very damage the upgrade grants** (per W1-S1
KV-AUD-051, combat applies the cap). Confirms KV-AUD-027 / prior AUD-099. → recompute
`maxOutputCap = ceil(finalDamage × QUALITY_OUTPUT_CAP_MULTIPLIER[newTier])` on upgrade.

### New findings
**KV-AUD-113 | S2 | Confirmed | L1 | `:16,162-182` vs `useCharacterStore:812`** — **Silent gold loss from a
capacity-cap mismatch.** `useInventoryStore` uses `MAX_INVENTORY_SLOTS = 50` (`:16`), but
`useCharacterStore.addToInventory` enforces `BAG_CAPACITY = 20` (W1-S2 `:812`). `addItem` checks the 50-cap,
calls `addToInventory`, and **returns `true` regardless of its result** (`:180-181`):
```ts
if (character.inventory.length >= MAX_INVENTORY_SLOTS) return false; // 50
useCharacterStore.getState().addToInventory(item);  // rejects at 20, returns false — ignored
return true;
```
So when inventory holds **20–49** items, `canAddItem()` reports space, the shop charges gold
(`purchaseConsumable:270`/`purchaseEquipment:355`), `addItem` returns success, but `addToInventory`
**silently dropped the item** → gold spent, no item. Inventory can exceed 20 via the equip-overflow bug
(KV-AUD-070), so the two bugs compound. → unify the caps (one constant) and make `addItem` return
`addToInventory`'s actual boolean; the shop must refund on failure.

**KV-AUD-114 | S2 | Confirmed | L4 | `:143,161-167`** — `identifyWeapon` deducts gold **twice over two
mechanisms** and reaches into another store's `setState` with a stale snapshot:
```ts
characterStore.modifyGold(-IDENTIFICATION_COST);          // (1) proper deduct
…
useCharacterStore.setState({ character: { ...character,   // (2) stale `character` from :113
  gold: character.gold - IDENTIFICATION_COST, inventory: updatedInventory } });
```
Not currently a double-charge (both compute `G - COST`), but it's fragile: step (2) overwrites whatever
step (1)'s `modifyGold` did using a pre-(1) snapshot, so any future side-effect of `modifyGold` (a
behavement, a derived recompute) would be **clobbered**, and the inventory mutation bypasses the character
store's own methods. Confirms prior AUD-098. → route the `identified` flag update through a character-store
method; deduct once.

**KV-AUD-115 | S3 | Confirmed | L1 | `:114-115`** — `cure_poison`/`cure_bleed` call
`removeStatusEffect('poison')`/`('bleed')`, but `removeStatusEffect` filters by **`e.id`** (W1-S2 `:638`),
and combat status effects are created with unique ids (not the literal `'poison'`) — the StatusEffect
id-vs-type schism (KV-AUD-039). So a poison-cure potion likely **fails to remove poison** unless the effect
id happens to equal `'poison'`. (`cure_all` at `:111` is correct — it maps over `e.id`.) → remove by
`type`, not a hardcoded id. Verify the id scheme in W1-T4.

**KV-AUD-116 | S3 | Confirmed | L1/L3 | `:118-128`** — **Refines KV-AUD-057.** Buff consumables **do** apply
here — `useConsumable` builds and applies a status effect for `case 'buff'` (`:120-127`) — but
`useCombatStore.playerUseItem`'s `buff` case (W1-S1 `:891-899`) does **nothing**. So buff potions work out
of combat (this path) yet are inert in combat (that path), depending on which the screen calls. → unify on
one consumable-effect resolver. (The `as unknown as` cast at `:127` is the StatusEffect-schism smell again.)

**KV-AUD-117 | S3 | Confirmed | L1 | `:72,365,173,432`** — Blacksmith reputation oddities: (a) `reset()`
sets `reputation: 0` (`:365`) but the initial value is `1` (`:72`), so a reset character starts below a
fresh install (confirms prior AUD-097); (b) reputation accumulates in **floats** (`+0.5` on identify `:173`;
`getReputationGainForUpgrade` returns `0.5` `:432`), yielding fractional rep like `1.5`. → reset to `1`;
decide if fractional rep is intended (round for display).

**KV-AUD-118 | S2 | Confirmed | L6 | `:18,102,128,266` + weaponRegistry** — Blacksmith reads weapons from
the **in-memory** `weaponRegistry` (`getWeaponById`). That Map is module-level and **not persisted**, and is
cleared by `clearWeaponRegistry` on new game. After an **app reload**, the registry is empty while
`character.inventory` (with full `weaponData`) persists — so `getWeaponById` returns `undefined` and
`identifyWeapon`/`canUpgrade`/`upgradeWeapon` fail ("Weapon data not found") until something re-registers.
The *list* helpers self-heal (`getUnidentifiedWeapons:338`, `getUpgradeableWeapons:354` re-register from
`i.weaponData`), but the **action** methods don't. → re-register from `weaponData` in the actions, or
persist the registry. Full weaponRegistry audit queued for **W3**.

**KV-AUD-120 | Info | Confirmed | L3** — Positives: `useBlacksmithStore.reset()` **is** wired into
`clearAllStores` (`:28`) so the smith doesn't bleed (contrast shop); `canUpgrade` gates correctly on
identified-status, max-tier, reputation, gold, and materials with a helpful missing-materials message;
`upgradeWeapon` consumes materials atomically via `consumeMaterials`. `useInventoryStore` correctly
centralizes inventory in the character store (no duplicate source of truth) — the facade design is sound;
only the `MAX_INVENTORY_SLOTS` mismatch (KV-AUD-113) undermines it.

**Unit verdict:** this pair **refuted** the scary W1-S5a thread (no gold-pool split; `useInventoryStore` is
a clean facade) and **confirmed** three queued issues (dual blacksmith-rep, upgrade-cap throttle,
identify-stale-setState), while surfacing a **new silent gold-loss bug** (the 50-vs-20 cap mismatch,
KV-AUD-113) and a **persistence gap** (in-memory weaponRegistry breaks identify/upgrade after reload,
KV-AUD-118). Cross-checks queued: **W1-T4** (StatusEffect id scheme for cure-by-id, KV-AUD-115), **W3**
(weaponRegistry persistence), **Wave 2** (which consumable path combat uses — KV-AUD-116). **W1-S5 economy
bundle complete.**

---

## Unit W1-S6a — `src/stores/useDeityStore.ts` (512 lines) — Session 9, audited first-hand + caller cross-reference

**Context:** persisted (`kohrvellia-deity`). Patron relationship, favor, blessings, and God-Challenges.
Audited with caller greps for the favor mutators, the blessing multiplier, and the challenge lifecycle —
which resolved several long-queued cross-checks and surfaced an S1.

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `FAVOR_STATUS` (0×–2.0×) | 25-33 | `multiplier` field **dead** (only self-call consumer) — KV-AUD-122 |
| `adjustFavor` | 124-159 | Updates `relationship.favor` **only**, never `character.deityFavor` — KV-AUD-121; eviction flag set-not-cleared — KV-AUD-123 |
| `reset` | 119-121 | Incomplete — leaves `pendingChallengeReward`/`isPatronEvicted` — KV-AUD-124 |
| `startChallenge` / `tickChallengeFloor` | 176-192 / 367-397 | **Dead** (0 callers; `issueChallenge`/`checkChallengeExpiry` are the live ones) — KV-AUD-125 |
| `completeChallenge` | 281-339 | Bonus pts STR/END/AGI/PER only — KV-AUD-126; convoluted 3× re-read — KV-AUD-129 |
| `recordChallengeEvent`/`updateChallengeProgress`/`checkChallengeCompletion` | 399-410/212-231/265-279 | Wired ✓ (room/combat/floor) — KV-AUD-127 |
| `getBlessingMultiplier` | 465-468 | Reads `FAVOR_STATUS`; **only caller is the dead self-call `:474`** — KV-AUD-122 |
| `getBlessingEffect` | 470-482 | Dead `getBlessingMultiplier()` call + uses `@deprecated calculateBlessingPower` — KV-AUD-128 |
| getters/`isAbilityUnlocked`/`getAvailableChallenges` | 444-505 | Read `relationship.favor` ✓ |

### The headline — deity favor is mechanically inert for combat power
**KV-AUD-121 | S1 | Confirmed | L1/L3 | `:124-159` + 0-caller grep** — **Raising deity favor does nothing
to the blessing that scales your stats.** There are two favor values and they never sync:
- `relationship.favor` (this store) — mutated by every in-game favor source: shrines (`room.tsx:498`),
  domain actions (`:171`), challenge complete/fail. `adjustFavor` updates **only** this:
  ```ts
  adjustFavor: (amount, _reason) => {
    set((state) => ({ relationship: { ...state.relationship, favor: clamp(0,100, favor+amount) } }));
    // …soul/sacred milestones… — never touches character.deityFavor
  }
  ```
- `character.deityFavor` (character store) — the value the **blessing multiplier actually reads**
  (`getDerivedStatsWithBlessings` → `getBlessingMultiplier(character.deityFavor)`, W1-S2 `:1284`).

The **only** function that updates `character.deityFavor` after creation is `useCharacterStore.modifyDeityFavor`
(W1-S2 `:1146`, which also recomputes maxHP/SP) — and a repo-wide grep for `.modifyDeityFavor(` returns
**zero callers.** So `character.deityFavor` is frozen at its creation value (50) for the character's entire
life, the blessing multiplier is permanently the favor-50 value (~1.0×), and the entire favor loop —
shrines, domain actions, challenge rewards, the "Blessed/Favoured Child" tiers — has **no effect on combat
power**. This directly falsifies the in-code promise at `useCharacterStore` ("deity favor directly impacts
power") and the DanMachi-style favor pillar. (Unique-ability unlocking *does* respond to favor — it reads
`relationship.favor` via `isAbilityUnlocked` — so the disconnect is specifically the **blessing
multiplier**.) → make `adjustFavor` the single source and have it call `character.modifyDeityFavor` (or have
the blessing read `relationship.favor`); collapse the two favor values into one. Escalates KV-AUD-017.
> **[Update S24 — DOWNGRADED S1→S2 by KV-AUD-242 (W2-P2): the "0 callers" claim was a FALSE NEGATIVE.**
> The grep `.modifyDeityFavor(` (leading dot) missed the **destructured bare call** at `room.tsx:71,497` —
> the shrine does `modifyDeityFavor(favorDelta)` alongside `adjustFavor` (`:498`). So `character.deityFavor`
> is **not** frozen at 50: shrine visits move it and recompute the blessing. Favor is therefore
> **inconsistently synced** (shrines update *both* stores; events/challenges only `relationship.favor`),
> not *inert* → **severity S1→S2**, dropping the audit S1 count 5→4. Methodology lesson: grep the bare
> identifier, not just `.method(`. Full caller set (esp. the Blessing Rite) confirmed in W2-P6.]**

### Favor table & eviction
**KV-AUD-122 | S3 | Confirmed | L3 | `:25-33,465-468,474`** — **Refines seed KV-AUD-004 DOWN from S1.** The
`FAVOR_STATUS` table's `multiplier` (0× at Abandoned … 2.0× at Favoured Child) is **dead**: `getBlessingMultiplier`
is its only consumer, and `getBlessingMultiplier`'s only caller is the **discarded self-call** inside
`getBlessingEffect` (`:474 get().getBlessingMultiplier();` — return value unused). The live stat blessing uses
the *other* table (`types/Deity.FAVOR_TIERS` 0.5–1.5, W1-S2). So the "0× zeroes all stats" landmine the seed
feared is **not wired** — it's a dead field plus a divergent display table. (If a Familia/character screen
reads `FAVOR_STATUS[status].multiplier` directly, the player sees a multiplier — e.g. "2.0×" — that combat
never applies; verify Wave 2.) → unify the two favor tables; delete the dead multiplier.

**KV-AUD-123 | S2 | Confirmed | L1 | `:138-142`** — Eviction flag is one-way. `adjustFavor` sets
`isPatronEvicted = true` when favor ≤ 10 (`:140-142`) but **nothing clears it when favor recovers** (only
`evictPatron` resets it, on actual eviction). A transient dip to ≤10 (e.g. a challenge fail) permanently
flags the patron for eviction even after favor climbs back. → clear `isPatronEvicted` when favor rises above
`ABANDONED.max`.

**KV-AUD-124 | S2 | Confirmed | L4 | `:104-107,119-121`** — `reset()` is incomplete: it nulls `relationship`
and `completedChallengeIds` but leaves `pendingChallengeReward` and `isPatronEvicted` set, so a new character
(reset via `clearAllStores:26`) can inherit a dead character's stale eviction flag or pending-reward popup. →
reset all four fields.

### Challenges
**KV-AUD-125 | S3 | Confirmed | L3 | `:176-192,367-397`** — Two dead duplicate methods: `startChallenge`
(duplicate of the live `issueChallenge`) and `tickChallengeFloor` (duplicate of the live `checkChallengeExpiry`)
each have **0 callers** (greps). Confirms prior AUD-092. (Bonus: this **refutes** any double-tick concern —
only `checkChallengeExpiry` runs.) → delete both.

**KV-AUD-126 | S3 | Confirmed | L9 | `:312-318`** — Challenge `bonusStatPoints` are split across **STR/END/
AGI/PER only** (`addPendingExcelia` for those four), so INT/WIS/CHA/LCK builds get reward points in stats they
don't use. Confirms prior AUD-091. → target the build's scaling stats.

**KV-AUD-129 | S3 | Confirmed | L1 | `:303-338`** — `completeChallenge` re-reads state via `get()` **three
times** after the `set`, reconstructing the just-completed challenge from `completedChallengeIds[last]` (its
own comment admits `currentChallenge` is already cleared) and carries a `void relationship;` warning-suppressor.
Fragile if two challenges complete in succession. → return the completed challenge object from the `set`
closure instead of re-deriving "last."

**KV-AUD-128 | S3 | Confirmed | L1 | `:474,479`** — `getBlessingEffect` makes a dead `getBlessingMultiplier()`
call (result discarded) and computes its value via the **`@deprecated`** `calculateBlessingPower` (`:479`,
imported `:13`). → drop the dead call; migrate off the deprecated helper (W1-T3).

**KV-AUD-127 | Info | Confirmed | L3** — **Refutations/positives.** God-Challenges **are wired** —
`issueChallenge`←`familia/index.tsx:236`, `recordChallengeEvent`←`room.tsx:284,289,606`/`combat.tsx:387,1004`/
`floor.tsx:326`, `checkChallengeExpiry`←`floor.tsx:324` — so **PROGRESS's "Phase 2.4 God Challenges NOT
STARTED" is stale**, and `glory_challenge_complete` (W1-S4a KV-AUD-095) **is** reachable. The soul/sacred favor
milestones are correctly wired in `adjustFavor` (`social_deity_favor_high` at 80, `recordMaxFavor` at 100,
`recordFavoredChild` at 91); favor is clamped 0–100; `reset()` is invoked by `clearAllStores`.

**Unit verdict:** beneath a feature-complete-looking challenge/favor store sits the audit's **third S1** —
the favor→blessing-power link is severed because `modifyDeityFavor` is never called and the two favor values
never sync, so a marquee progression mechanic is mechanically inert. The verification also **refuted** two
seeds (the 0× landmine is dead, not dangerous; challenges are wired, not unstarted) — net, two corrections and
one major new defect. Cross-checks queued: **W1-T3** (`Deity.ts` FAVOR_TIERS vs FAVOR_STATUS unification +
deprecated `calculateBlessingPower`), **Wave 2** (does any screen display `FAVOR_STATUS.multiplier`?).

---

## Unit W1-S6b — `useAchievementStore.ts` (468) + `useJobStore.ts` (125) — Session 10, audited first-hand

**Context:** `useAchievementStore` (persisted `kohrvellia-achievements`) tracks progress + discovery for the
~123 achievements and runs the level-up ceremony. `useJobStore` (persisted `kohrvellia-job-store`) handles
the Level-2 job + Level-5 specialization choice. Resolves the RequirementType-coverage, GLORY-stacking,
tier-casing, discovery, and job `as any` cross-checks.

### Per-function coverage maps
**`useAchievementStore`:** `initializeProgress`(79-97) guild→rumored, else hidden · `updateProgress`(99-143)
**max-set, skips `hidden`** — KV-AUD-130 · `incrementProgress`(145-187) **additive, skips `hidden`** —
KV-AUD-130; both O(123) scans — KV-AUD-132 · discovery fns(194-248,420-445) wired ✓ — KV-AUD-134 ·
`completeLevelUp`(284-337) GLORY stacking ×1.25/1.5 — KV-AUD-133 · `getTierCount`(376-394) lowercase tiers ✓ ·
`resetAllProgress`(410-418) wired to `clearAllStores` ✓ · `unlockAchievementsForLevel`(447-461) STANDARD→known.
**`useJobStore`:** `selectJob`(55-84)/`selectSpecialization`(86-109) **no idempotency guard** — KV-AUD-135;
`as any` **gone** (explicit `Skill`) — KV-AUD-136 · `reset`(111-113) wired ✓.

### Achievement progress is gated on discovery (the real shape of KV-AUD-031)
**KV-AUD-130 | S2 | Confirmed | L1/L3 | `:106,152`** — **A 'hidden' achievement accrues zero progress.** Both
progress paths bail on undiscovered achievements:
```ts
for (const achievement of ALL_ACHIEVEMENTS) {
  const achievementProgress = updatedProgress[achievement.id];
  if (!achievementProgress || achievementProgress.isCompleted) continue;
  if (achievementProgress.discoveryState === 'hidden') continue;   // ← :106 / :152
  …
}
```
So an achievement must first be moved `hidden → rumored/known` (via guild rep `checkReputationDiscovery`,
`hintDiscovery`, source match, or — for STANDARD tier — `unlockAchievementsForLevel` on level-up) before any
play counts toward it; deeds done while it's still hidden earn **nothing** and don't count retroactively when
it's later discovered. Consequence: STANDARD achievements for the next level are auto-`known` (so leveling
isn't blocked — the old "can't level up" fear stays refuted), but **harder tiers (challenging/heroic/
legendary/mythic) that are hard to discover may never progress** even when the player meets their
requirements. This is the true form of KV-AUD-031: not "RequirementTypes never fire," but "progress is gated
behind discovery." → consider retroactive crediting on discovery, or make discovery easier for in-progress
deeds. (Exact RequirementType-vs-fired-set audit — `kill_count, gold_earn, boss_kill, elite_kill, damage_*,
floor_reach, shrine_blessing, stat_reach, custom` are the fired types — completes in W1-T5 + W3-DPr.)

### Confirmations & smaller findings
**KV-AUD-133 | S3 | Confirmed | L9 | `:320-326`** — GLORY/level-up stacking is the **live** path:
`stackCount ≥ 3 → ×1.5`, `≥ 2 → ×1.25` on `bonusPoints` (`getTierSynergyBonus` in `Achievement.ts` is the
dead duplicate — W1-T5). Triggers on **any** 2/3 selected achievements, not specifically hard-path ones
(simplified vs design). Confirms prior AUD-041.

**KV-AUD-132 | S3 | Confirmed | L5 | `:103,149`** — `updateProgress`/`incrementProgress` iterate **all ~123
`ALL_ACHIEVEMENTS`** (× their requirements) on **every** call, and they're fired on every combat kill/floor/
gold event. Same per-tick-scan class as the sacred store's O(770) (KV-AUD-101); together they add real
per-kill overhead on a 60fps target. → index achievements by `requirement.type`.

**KV-AUD-131 | S3 | Confirmed | L1 | `:119,165`** — Two progress semantics that the caller must choose
correctly: `updateProgress` does `Math.max(current, value)` (threshold/"reach" types), `incrementProgress`
does `current + amount` (count types). Mis-pairing silently mis-counts; e.g. the shipped debug button
(`settings:73`) calls `updateProgress('kill_count', 50)` → **sets** kill progress to 50 rather than adding.
→ document the contract; consider encoding it on the requirement type.

**KV-AUD-134 | Info | Confirmed | L3** — **Refutations/positives.** The **Discovery system IS implemented**
(states + `checkReputationDiscovery`←`useShopStore:544`, `hintDiscovery`, `discoverAllFromSource`,
`unlockAchievementsForLevel`←`performLevelUp` W1-S2:1106) — so PROGRESS's "Phase 2.3 Discovery System NOT
STARTED" is **stale**. Tier handling is **lowercase-consistent** (`getTierCount` keys, `ACHIEVEMENT_TIER_REWARDS[tier]`)
— refutes prior AUD-040's mismatch worry at the store level. `resetAllProgress` is wired into `clearAllStores`
(`:22`), and `initializeProgress` self-merges new achievement ids (`:87 if (!newProgress[id])`) — better than
the soul store's non-merging persist (still verify `initializeProgress`'s caller in Wave 2).

### Job store
**KV-AUD-135 | S3 | Confirmed | L1 | `:55-84,86-109`** — `selectJob`/`selectSpecialization` have **no
idempotency guard**: each call grants the starter skill (`learnSkill`, which doesn't dedup — W1-S2 `:955`)
**and** applies the permanent `applyJobStatBonus` (flat points). A second call (e.g. re-entering the
Level-2 job screen) would **double the stat bonus and duplicate the skill**. The one-time choice is enforced
only by the UI (`hasSelectedJob` is set but never checked here). → early-return if `hasSelectedJob`/spec
already set. Verify the screen can't re-enter (Wave 2-P4 `job-select`).

**KV-AUD-136 | Info | Confirmed | L2 | `:63-71`** — **Confirms prior AUD-052 is FIXED.** `selectJob` builds a
fully-typed `Skill` (all six tracking fields) before `learnSkill` — the old `as any` cast at `useJobStore:62`
is gone. `reset()` is wired into `clearAllStores` (`:25`). Clean store overall.

**Unit verdict:** both stores are clean and well-wired; the notable finding is the **discovery gate**
(KV-AUD-130) — progress only counts for discovered achievements, so hard-to-discover tiers can be missed —
plus a job-selection idempotency gap. The pass also **refuted two more stale claims** (Discovery System is
implemented, not "NOT STARTED"; tier casing is consistent; job `as any` is fixed). **Wave 1 stores nearly
done — only `W1-S7` (game+sound) remains.** Cross-checks: W1-T5 (`Achievement.ts` RequirementType enum +
`isRequirementMet`), W3-DPr (which RequirementTypes the 123 achievements actually use vs the fired set),
Wave 2-P4 (job-select re-entry; `initializeProgress` caller).

---

## Unit W1-S7a — `useGameStore.ts` (391) + `stores/index.ts` (14) — Session 11, audited first-hand + caller grep

**Context:** `useGameStore` (persisted `kohrvellia-game`) is the **meta-progression** store — settings, the
GamePhase machine, run history (the "Rankings" data), unlocks, monster knowledge, tutorial/hint flags, and
permanently-defeated bosses. Intentionally **not** reset by `clearAllStores` (it survives permadeath). Audited
with a caller grep of the deity-unlock gate.

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `GamePhase`/`GameSettings`/`RunRecord` types | 12-58 | ✓ (settings no-migration — KV-AUD-141) |
| `recordRunEnd` | 209-220 | caps history 100 ✓; `totalDeaths` over-counts — KV-AUD-139 |
| `unlockDeity` / `isDeityUnlocked` | 242-259 / 367-374 | **DEAD — 0 callers** — KV-AUD-137 |
| `unlockAchievement` / `isAchievementUnlocked` | 222-240 / 376-379 | parallel meta-unlock — likely also dead (verify) — KV-AUD-137 |
| `recordMonsterEncounter`/`addMonsterObservation` | 273-307 | bestiary tiers ✓ (meta-persisted) |
| `completeTutorial`/`skipTutorial` | 337-349 | init denatus — resolves KV-AUD-096 |
| `defeatBoss`/`isBossDefeated` | 326-334 | dedup ✓ (meta) |
| `setHasHadFirstCombat` + meta flags | 314-316 | **root of the first-combat bug** — KV-AUD-138 |
| persist | 386-389 | no `version`/`migrate` |

### The first-combat instakill protection only ever protects the first character (headline)
**KV-AUD-138 | S2 | Confirmed | L1 | `:92,106,175,185` + `useCombatStore:309`** — New characters get **no**
first-combat protection. The guard in `prepareEncounter` (W1-S1 `:309`) is
`isFirstCombatEver = gameState.totalRuns === 0 && !gameState.hasHadFirstCombat` — and **both** flags live in
this meta store (`totalRuns:92`, `hasHadFirstCombat:106`), persist across characters, and are **not** reset by
`clearAllStores`. `recordRunEnd` increments `totalRuns` on every run end (`:215`), and `setHasHadFirstCombat`
sets the flag on the first encounter. So after the very first run ever, `totalRuns ≥ 1` **permanently** →
`isFirstCombatEver` is always `false` for every subsequent character. In a permadeath game where new
characters after a death are the *common* case, none of them receive the "force a safe, non-boss/elite first
encounter" protection — a brand-new level-1 character can be handed a boss/elite on fight #1 and instakilled.
The safeguard helps only the literal first character on the device. → gate on a **per-character** signal
(e.g. `character.runStats` or a fresh per-character flag), not the meta `totalRuns`/`hasHadFirstCombat`.

### Dead meta-unlock system (owner-priority "floating code")
**KV-AUD-137 | S3 | Confirmed | L3 | `:242-259,367-374` + 0-caller grep** — The deity-unlock meta-layer is
**dead**. `isDeityUnlocked` (`:367-374`, defaulting to 4 unlocked — `zeus/odin/ra/amaterasu` — and ~166
requiring `unlockDeity`) and `unlockDeity` (`:242-259`) have **zero callers** anywhere (grep returns only
their definitions); `unlockedDeities` is therefore always empty and nothing reads the gate. **This refutes
prior AUD-086** ("97% of the roster unreachable") — the picker can't be gating on a function nobody calls, so
all deities are selectable; the lock infrastructure is simply unwired aspirational code. The parallel
`unlockAchievement`/`isAchievementUnlocked`/`unlockedAchievements` layer follows the same shape and is likely
also dead (verify in Wave 2 — codex/guildhall). → wire the picker to `isDeityUnlocked` if deity-unlocking is
intended, else delete the dead meta-unlock layer.

### Smaller findings
**KV-AUD-139 | S3 | Confirmed | L1 | `:216`** — `totalDeaths` over-counts: `+ (causeOfDeath !== 'return' ? 1 :
0)` treats every non-`'return'` run end (including `'victory'`/`'abandon'`) as a death, inflating the
Rankings death stat. → count only actual death causes.

**KV-AUD-140 | S3 | Confirmed | L3 | `stores/index.ts`** — The barrel exports **9** store hooks (Character,
Dungeon, Game, Deity, Inventory, Soul, Achievement, Combat, Sound) and **omits 5** (`useShopStore`,
`useBlacksmithStore`, `useSacredItemStore`, `useMarketStore`, `useJobStore`), so consumers of those deep-import.
Confirms prior AUD-100; mirrors the types-barrel gap (W1-T6). → export all 15.

**KV-AUD-141 | S3 | Confirmed | L6 | `:386-389`** — No settings migration. With no `version`/`migrate` and
zustand's default top-level shallow merge, the persisted `settings` object **replaces** `DEFAULT_SETTINGS`
wholesale on hydration — so a newly added setting field is `undefined` for every existing save (e.g. a future
`colorBlindMode` option wouldn't appear). → add a `merge`/`migrate` that fills missing setting keys from
defaults.

**KV-AUD-142 | Info | Confirmed | L3** — **Resolutions/positives.** Meta-progression is correctly **excluded**
from `clearAllStores` (run history, defeated bosses, unlocks, settings, monster knowledge, tutorial/hints all
persist across permadeath — intended). **Resolves W1-S4a KV-AUD-096:** `initializeDenatus` is invoked here in
`completeTutorial`/`skipTutorial` (`:339-348`) *and* at `confirm.tsx:80`, so the soul system is initialized for
new characters. **Cross-links KV-AUD-105:** `bestFloorReached` (meta) is what keys the shop's stock tier, so a
fresh character sees best-ever-floor gear. The "Rankings" system is the local `runHistory` (last 100 records) —
no global/server leaderboard exists. `defeatBoss`/unlock/codex all dedup correctly.

**Unit verdict:** the meta store is clean and its non-reset-on-new-game design is correct, but it holds the
**root of a real gameplay bug** — the first-combat instakill safeguard is keyed to meta flags so it protects
only the first-ever character (KV-AUD-138) — plus a fully **dead deity-unlock layer** (KV-AUD-137, refuting
AUD-086) and minor stat/barrel/migration nits. **14 of 15 stores audited — only `W1-S7b` (`useSoundStore`)
remains in the stores wave.** Cross-checks: Wave 2 (does the creation picker reference `isDeityUnlocked`?
codex `unlockAchievement`?), Wave 2-P2/P3 (first-combat guard fix surface).

---

## Unit W1-S7b — `src/stores/useSoundStore.ts` (685 lines) — Session 12, audited first-hand + asset verification

**Context:** the audio engine (NOT persisted). Audited specifically to settle the "stub vs real" contradiction
(the components sub-agent called it a `console.log` stub; PROGRESS/CLAUDE call audio "pending Phase 3") and the
volume dual-source. Verified the `.mp3` assets on disk via Glob.

### Per-function coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `SFX/BGM/AMBIENT_FILES` (~40 `require()`) | 161-237 | All referenced assets **exist** (53 .mp3 verified) — KV-AUD-143; 7 placeholder fallbacks — KV-AUD-146 |
| `safeRemove/SetVolume/Play/Pause` | 259-277 | try/catch wrappers ✓ |
| volume state + setters | 282-285,379-416 | **non-persisted, 0–1, separate from settings** — KV-AUD-144 |
| `playSFX` | 428-466 | **real playback** after a stale "Would play" log; `(player as any)` — KV-AUD-143/145 |
| `playBGM`/`crossfadeBGM`/`fadeOutBGM` | 479-602 | real, with `isCrossfading` guard ✓ |
| `playAmbient`/`fadeAmbient` | 604-650 | real loops ✓ |
| `useSound()` hook | 654-684 | convenience consumer ✓ |

### The audio system is real and complete (refutes KV-AUD-007 + stale docs)
**KV-AUD-143 | S3 | Confirmed | L3 | `:432,446-465,485,493-498,609`** — **Audio is fully implemented, not a
stub.** Each `console.log('[…] Would play')` is **immediately followed by actual playback**:
```ts
playSFX: async (type) => {
  …
  console.log(`[SFX] Would play: ${type}`);        // ← stale/misleading log
  const file = SFX_FILES[type];
  if (file) {
    const player = createAudioPlayer(file);         // ← real expo-audio player
    player.volume = sfxVolume * masterVolume;
    player.play();                                   // ← actually plays
    …
  }
}
```
The engine uses `expo-audio` with a preload cache, crossfade, fade-out, ambient loops, and master/category
volume — and a Glob confirms **all 53 referenced `.mp3` assets exist** (so the hard `require()`s resolve; no
build break). This **refutes** three claims at once: the components sub-agent's "console.log stub, no audio"
(XC-2), PROGRESS/CLAUDE's "audio pending (Phase 3)", and my own exec-summary **KV-AUD-007** (the "17× stub"
half). Only the *stale debug logs* remain a (cosmetic) problem. → strip/relabel the `Would play` logs; update
the docs to mark audio **done**; the only real doc-drift left from KV-AUD-007 is the `expo-av`→`expo-audio`
naming (the audio file itself notes "Uses expo-audio (replaces deprecated expo-av)" at `:4`).

### Volume dual-source (closes the KV-AUD-015 cross-check)
**KV-AUD-144 | S2 | Confirmed | L1/L6 | `:281-285,379-395` vs `useGameStore:28-29`** — Two volume systems
that don't sync, and the live one **doesn't persist.** `useSoundStore` owns `masterVolume/sfxVolume/bgmVolume/
ambientVolume` on a **0–1** scale with their own setters, and the playback engine reads **these**. But the
store is created **without `persist`** (`:281`), so those volumes **reset to defaults** (bgm 0.5, sfx 0.8) on
every app launch. Meanwhile `useGameStore.settings.musicVolume/sfxVolume` are **persisted** on a **0–100**
scale (W1-S7a) — the values the Settings UI presumably saves. Unless the settings screen explicitly bridges
into `useSoundStore`'s setters (and converts 0–100→0–1), changing volume in Settings won't affect playback,
and even if it does, the change is lost on restart. Confirms KV-AUD-015. → persist the engine volumes (or have
the engine read `useGameStore.settings` directly) and bridge the two scales; verify the Settings screen wiring
in Wave 2.

### Smaller findings
**KV-AUD-145 | S3 | Confirmed | L2 | `:455-456`** — `(player as any).addListener('playbackStatusChange', …)`
(eslint-disabled) — `expo-audio`'s `AudioPlayer` type doesn't expose `addListener`, so the auto-cleanup
listener is untyped. Works; type-unsafe. → use the typed event API if available.

**KV-AUD-146 | S3 | Confirmed | L8 | `:213,224,229,230,232,233,235`** — 7 BGM tracks are placeholders that
`require()` an existing file as a stand-in: `town` → `dungeon.mp3` (comment "fallback until town.mp3 is
added"), and `blessing_trickery/craft/authority/sea/sky/knowledge` → `blessing_generic.mp3`. So town and six
blessing domains share borrowed themes — a content gap (missing tracks), handled gracefully. → add the
dedicated tracks or accept the reuse.

**KV-AUD-147 | Info | Confirmed | L3/L6** — Positives: the engine is **well-built and defensive** —
`safeRemove/SetVolume/Play/Pause` wrap every player op in try/catch, `cleanup()` removes all players + clears
caches, `crossfadeBGM` guards re-entrancy with `isCrossfading`, and the store is **correctly NOT persisted**
(it holds non-serializable `AudioPlayer`/`Map`/`Set` — persisting would break). It's consumed via the
`useSound()` hook (`_layout.tsx`, `BlessingCeremony` per the components pass).

**Unit verdict:** a genuinely complete, defensively-coded audio engine — its only real defect is the
volume dual-source/non-persistence (KV-AUD-144); the rest are cosmetic (stale logs) or content gaps
(placeholder tracks). The standout is the **refutation**: audio is done and shipped, not a stub — a sub-agent
error corrected by first-hand reading + asset verification.

---

## ✅ WAVE 1 STORES COMPLETE (W1-S1…S7b + W1-L1)
All 14 store modules + `index.ts` + the lib unit audited first-hand. **Stores tally: KV-AUD-001…147** across
12 store/lib units. Running severity in stores: **1×S0** (build break, in lib), **~4×S1** (state-bleed,
farming exploit, sacred-items-broken, deity-favor-inert — the **5th S1, the StatusEffect schism KV-AUD-190,
lands in the types wave** → 5 S1 total for Wave 1), **~30×S2**, the rest S3/Info — plus a large number
of seed/prior-claim **refutations** (node_modules, ghost libs, 0× favor landmine, "can't level up", discovery/
challenges "NOT STARTED", audio stub, deity 97%-locked). **NEXT WAVE: types (W1-T1…T6)**, then Wave 2 screens.
