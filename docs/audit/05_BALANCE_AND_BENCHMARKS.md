# Kohrvellia Audit — Balance & Competitive Benchmarks

> Lens **L9**. Covers the math surfaces (stat/Falna growth, derived formulas, economy, favor, CR
> scaling, anti-grind) and benchmarks them against comparable titles.
>
> **Status (2026-06-05): updated through the Wave-1 engine pass + the Wave-2 screen pass** (`KV-AUD-001…297`).
> Every structural defect below is **Confirmed** first-hand unless marked otherwise; Wave 2 **sharpened the
> favor analysis** (B5: `242`→`270`, favor→power is shrine-only) and **added one creation-balance defect**
> (`289`: deity + backstory penalties are displayed but never applied → every character is pure upside).
> The one analysis still **owed** is the **100-floor scaling simulation** for §2 (`162`). Confidence:
> **Confirmed** = read in source this audit; **Pending-sim** = mechanism confirmed, magnitude needs a run.

> **The balance thesis in one line:** the power curve is simultaneously **cheap** (068 flat growth),
> **near-cosmetic at the top** (150 compressed + linear effStat), **untunable** (151 the balance file is
> disconnected), and **mis-scaled against monsters** (162 multiplicative HP vs linear damage) — while the
> systems meant to *modulate* power (favor 121, blessings 181, enchantments/armor 188/191/193/194) are
> **inert**. Four roots — **068 × 150 × 151 × 162** — explain why the game is both trivial early and
> likely unwinnable deep, and why content stops at floor 25.

---

## 1. Structural balance defects (these break *how* tuning works, not just the numbers)

### B1 — The "single source of balance truth" is dead code (S1 High, **Confirmed — 003/065/151**)
`GameConstants.ts:24-61` declares `DerivedStatFormulas` under the banner *"All tunable game values in
one place."* But `src/types/Stats.ts` imports **nothing** from `constants` (grep confirmed), and computes
derived stats from its own hardcoded coefficients. **KV-AUD-151 confirmed the drift exactly: ~10×**
(constants `physicalAttack.strMultiplier: 0.08` vs the live `~0.008`). **Editing the documented balance
file changes nothing in-game.** Much of `GameConstants.ts` is similarly orphaned
(`Combat.damageEffectiveness`, `MonsterBalance.crScaling`, `RestSiteHealing`, `ProficiencyThresholds`).
*Caveat (065): not blanket-dead — `CombatConfig.flee` and `LootConfig.luckBonusPerPoint` **are** live;
audit per-field in Wave 4.* This is the single biggest *process* risk to balancing the game.
→ **Fix:** make `Stats.ts` (and combat/monster math) import from `GameConstants`, delete the dead
duplicates, and add a test asserting no balance literal lives outside `GameConstants`.

### B2 — Falna growth is flat, bypassing the cost curve (S2 Medium, **Confirmed — 068, the growth root**)
There are two growth paths: `addStatProficiency` (an *increasing* per-grade cost via
`getProficiencyThreshold`) and `commitExcelia` (a **flat 1:1** application of pending excelia). **The live
path is `commitExcelia`** — so the increasing-cost curve is **dead**, and there is **no per-grade cost
escalation**. Combined with B3, reaching the top grades costs trivially little. This is the **balance
root** beneath the whole progression economy. → **Fix:** route committed excelia through the rising
`getProficiencyThreshold` curve (or make that curve the single growth model); delete the dead path.

### B3 — Top stat grades are *compressed* **and near-cosmetic** (S2 Medium, **Confirmed — 150**, confirms seed 018)
Grades run I→SSS with `maxGradePoints:999`. Widths are now verified: **I–A = 100 each, then S=50, SS=30,
SSS=20** — A→SSS spans just **199** points vs I→A's **800**. SSS, the pinnacle, is reachable for trivially
little extra investment. **New first-hand insight (150):** combat reads a **linear effective-stat**
(`(Level×500) + Σpoints`), so the grade *letter* is **near-cosmetic** — crossing into SSS barely changes
combat output. So the top end is *both* cheap to reach *and* mechanically marginal — the worst of both,
and the inverse of the genre norm (§4). → **Fix:** widen the top bands, make `getProficiencyThreshold`
exponential at high grades, and give the grade letter a real derived-stat consequence (soft-cap
breakpoints, §4) so A→S→SS→SSS each cost — and *do* — progressively more.

### B4 — Output cap applied only to physical attack (S2 Medium, **Confirmed — 152/119/077**)
The weapon `maxOutputCap` gates `basePhysicalAttack` but **not** `baseMagicAttack`/`baseLuckAttack`
(152). INT/WIS/LCK weapons scale **uncapped** with stats regardless of quality tier, while STR/AGI
physical weapons are tier-capped — a dominant-build asymmetry. Two refinements from the engine pass: the
`Infinity` cap fallback is **unarmed-only** (077, not a corrupt-save bug as BUG-010 implied), and
`upgradeWeapon` **omits `maxOutputCap`** so upgraded weapons keep the lower original cap (119). → **Fix:**
apply the cap symmetrically across all three attack channels; recompute the cap on upgrade.

### B5 — Deity favor sync is INCONSISTENT (~~S1~~→**S2**, **REVISED by Wave-2 KV-AUD-242**)
> **[Update S24 — this section's original "mechanically inert / 0 callers / frozen at 50" framing is REVISED.**
> `modifyDeityFavor` **is** called at `room.tsx:497` (the shrine — a destructured bare call the `.modifyDeityFavor(`
> grep missed). So shrine favor **does** reach `character.deityFavor` and the blessing → favor is
> **inconsistently synced** (shrines update both stores; events/challenges update only `relationship.favor`),
> **not inert**. Severity **S1→S2**. Read the paragraph below as the original (now-corrected) hypothesis;
> the fix direction (unify to one favor source) still applies.]**

**This was reframed by the engine pass.** `modifyDeityFavor` (which writes `character.deityFavor`, the
value the live blessing multiplier reads) has **0 callers** → `character.deityFavor` is **frozen at 50**.
Every favor change from shrines/domains/challenges writes only `useDeityStore.relationship.favor` and
**never syncs back**. Net effect: **raising or losing favor does nothing to HP/SP/combat**, and the live
blessing (`Deity.ts FAVOR_TIERS`, 0.5×–1.5×) is **always ~1.0×**. The entire favor→power loop — a
headline feature of the DanMachi-inspired design — is unwired.

Three reconciliations around it:
- **Old seed 004 (the `FAVOR_STATUS` 0×–2.0× table) is DOWNGRADED S1→S3 (122):** that table is **dead
  code** (only a discarded self-call at `:474`). There is **no live 0× landmine and no live death-spiral**
  — it never reaches stats. Two divergent favor tables coexist (180): the live `FAVOR_TIERS` (0.5–1.5×,
  frozen at 1.0× via 121) and the dead `FAVOR_STATUS` (0–2.0×). A **third** favor scheme lives in the boss
  "favor sense," which is a **constant** ('neutral'/50, 215).
- **Domain blessings are display-only (181):** the `+10% physical damage` strings render but aren't applied
  to derived stats — a second, independent break in the favor/deity→power chain.
- **Seed 024 (blessed-selector) is moot via 121:** even if combat reads the blessed selector, the
  multiplier is ~1.0× regardless. *(Wave 2: 225 confirms combat DOES read the blessed selector — still ~1.0× via the favor freeze, so the point stands.)*
- **Wave-2 sharpening (270, completes 242):** a grep of `town/familia/*` for `modifyDeityFavor|adjustFavor`
  = **0** → the Blessing-Rite, Familia Home, Ascension, and God-Challenges (the entire intended patron loop)
  **never touch `character.deityFavor`**. Favor→power is **shrine-ONLY** (the lone caller is `room.tsx:497`),
  so the DanMachi favor relationship is power-inert outside incidental shrine visits.
- **Wave-2 add (289, creation balance, S2):** both the deity AND backstory `statPenalty` are **displayed but
  never applied** at `createCharacter` (`getFinalStatValue`/previews add bonuses only; the commit passes only
  `deity.statBonus`). Every character starts **pure upside** — no offsetting cost — flattening build identity
  and violating MINDSET's "every benefit shows its cost." → apply both penalties at creation (or stop showing them).

→ **Fix:** call `modifyDeityFavor` (or collapse to a single favor field) so favor actually moves the
multiplier; unify to ONE favor table; apply domain blessings to derived stats; floor the worst multiplier
above 0 and clamp `currentHP ≤ recomputed maxHP` before any wider spread is enabled.

---

## 2. Scaling: the run is mathematically unwinnable past ~floor 15 (S2 Medium, **CONFIRMED via simulation — 162 → 303**)

The single most consequential balance finding — **now executed** (`.audit_tmp/scaling_sim.js`, formulas
transcribed first-hand from `Monster.ts:255-318,474-499` + `Stats.ts:307-360`). The earlier "3-layer
multiplicative HP" framing was **imprecise**; the real formula is *additive-then-zone*, and the true
mismatch is that **monsters scale on the FLOOR NUMBER while the player's level is gated to 1→7**:

```
monsterHP  = floor( (monsterLevel × levelMult[8–36] × 1.0  + baseHP ) × zoneMult[1.0→9.0] ) × prefixHP
monsterAtk = floor( (monsterLevel × levelMult        × 0.20 + baseAtk) × zoneMult          ) × prefixAtk
   monsterLevel ≈ FLOOR (1→100)  ·  zoneMult: fl.1-10=1.0, 26-40=2.2, 56-70=4.5, 86+=9.0
playerAtk   = effStat[primary]×0.008 + weaponDamage      (effStat = level×500 + carry + points)
playerMaxHP = 50 + effEND×0.1 + effSTR×0.02              ← stays in the HUNDREDS (113→617 over the run)
   the zone table's `targetPlayerLevel` caps the *expected* player at LEVEL 7 by floor 86+
```

So monster HP scales ~**670×** (58→38,829) and monster attack ~**770×** (9→6,960) across 100 floors, while
player attack scales ~**4.8×** (25→119) and player HP ~**5.5×** (113→617). **Executed result (averaged over the
uniformly-random eligible pool, KV-AUD-299):**

| floor | player atk / HP | avg monster HP / atk | hits-to-kill | player turns survived | verdict |
|---|---|---|---|---|---|
| 1–5 | 25 / 113 | 58–120 / 9–21 | 2–4 | 6–19 | **playable** |
| 10 | 25 / 113 | 210 / 37 | 7 | 3 | **lose (die first)** |
| 20 | 41 / 197 | 692 / 129 | 15 | 1 | **one-shot** |
| 50 | 72 / 365 | 5,712 / 1,001 | 100+ | 1 | unwinnable |
| 86 | 119 / 617 | 34,293 / 6,052 | 450+ | 1 | unwinnable |

**Break-even: the playable window is ≈ floors 1–9; the player starts losing ≈ floor 10 and is reliably
one-shot by ≈ floor 20** — far earlier than 162's "floor 86." (The floor-86 ~28k–55k HP estimate was right
*for floor 86*, but the wall arrives ~70 floors sooner.) **This precisely explains why content/bosses stop
at floor 25.** The conclusion is robust to the player-growth/damage assumptions (flagged in the script):
even under the optimistic mitigation model with a 2.5× Kairos/crit burst, the one-shot wall (monster attack ≫
player HP) holds regardless of player damage. → **Fix:** gate `monsterLevel` to the *player's* level (not the
floor), or scale player power on floor too; cut the zoneMultiplier curve; tie player maxHP to a higher END
coefficient. *(Caveat: the exact per-hit `playerAttack` formula in `useCombatStore` would finalize the kill
counts; the survivability/one-shot result needs only the EXACT monster-attack vs player-HP figures above.)* →
**Fix direction:** either make monster HP scaling additive/piecewise, or make player damage scale with
the same multiplicative class (e.g., grade-gated multipliers — which also fixes B3's "cosmetic grades").

---

## 3. Anti-grind: the confirmed farming exploit vs genre norms (S1 High, **Confirmed end-to-end — 080**)

### B6 — Cleared combat nodes re-arm on backtrack
`useDungeonStore.ts:644-651` sets `isCompleted:false` on `combat`/`elite` nodes *when the player leaves
them* ("Reactivate combat/elite nodes when leaving"). The directionality question is now **resolved**:
`getCurrentPathOptions` (`:698-719`) **returns backward connections** and `moveToNode` (`:586`) has **no
navigability check** → the player can step back onto a cleared node and **re-fight the same encounter
indefinitely** for gold/loot/proficiency/achievement progress. Compounded by **082** (floors re-roll on
ascend via a `Date.now()` seed) → the farm yields *fresh* content, not just repeats.

**Benchmark — this is the textbook anti-pattern.** Grid Sage Games (Cogmind) on backtracking:
*"Preventing backtracking cleanly cuts out a number of potential types of grinding (such as returning to
fight weaker enemies to maximize XP or resources)… contributing to a player's forward momentum."* The
cautionary classic is Moria/Angband "level scumming." A node re-arm is exactly that, and it directly
violates Kohrvellia's **#1 pillar, "Challenge, Not Grind."** → **Fix:** never un-complete a cleared node;
make connections strictly forward (DAG) or impose a one-way "the way collapses behind you" rule consistent
with the tower fiction; seed floors deterministically per run, not by wall-clock.

---

## 4. Weapon / hybrid scaling defects (S2 Medium, **Confirmed — 153/185/061/062**)

- **Hybrid weapons mis-scale (153/185):** the hybrid damage path's fallback **hardcodes `effSTR`/`effINT`**,
  ignoring the weapon's *declared* scaling stats; and the `HybridCategory` union diverges from the routing
  `Set<string>` (`CHA_INT` vs `INT_CHA`, plus dead `INT_PER`/`WIS_PER`/`WIS_LCK` pairs, 185) → hybrid/magic
  damage misroutes and several declared combos are unreachable.
- **Double-stat hybrids (061):** hybrid weapons effectively count **two** stats into damage, out-scaling
  pure builds for the same investment.
- **Multiplicative burst / near-immortal LCK (062):** certain LCK/crit interactions stack multiplicatively
  → burst spikes and an effectively near-immortal LCK build at the extreme. → **Fix:** drive hybrid scaling
  from the declared stats via a typed union (kill the `Set<string>`); normalize hybrid contribution so two
  half-stats ≈ one full stat; cap the multiplicative crit/LCK interaction.

---

## 5. Prestige tiers mathematically unreachable (S3 Low, **Confirmed — 178/020, ×091/093**)

`SoulSystem.crScoreRanges.mythic = {min:100,max:100}` and `legendary = 98-99` (`GameConstants.ts:246-247`)
require effectively all 90 behavements at 100%. The Denatus climax's top titles are **impossible** — and
worse, the **real attainable max is far below 100** because half the noun-passive vectors never fire (177),
many behavements are unfired, and combat behavements are **double-counted** (093, inflating combat vectors
while starving others). So the title both *can't* hit Mythic *and* is biased toward combat. (See also the
Paragon **sort bug 176/011** → ~half of titles collapse to 'Iron'.) → **Fix:** set thresholds from observed
maxima after fixing the double-count (093) and dead vectors (177); fix the sort (176). **Moot in practice
(Wave-2 259):** the Level-10 ceremony that would award these titles is **unreachable in the live flow**
(`ascension.tsx` never routes to denatus / calls `performDenatus`), so `paragonTitle` is always null
regardless of score — the prestige tier is dead before the threshold math even matters.

---

## 6. Economy benchmark — gold sources vs sinks

Kohrvellia today (`GameConstants.ts`): **sources** `Loot.baseGoldPerCR:10` (+`luckBonusPerPoint 0.01`),
boss/event caches; **sinks** potions 25–50g, `identification:100`, `skillTrainingBase:500`, `blessing:250`,
`curseRemoval:500`, weapon repair 10% of value, upgrades.

**Benchmark — Slay the Spire** (a gold-economy exemplar): standard fights **10–20g**, elites **30–40g +
guaranteed relic**, shop commons **45–80g**, rares **~150g**, relics **150–300g**, and crucially a
**scaling sink** — card removal **75g, +25g each use**. The escalating sink keeps gold meaningful late.

**Gaps for Kohrvellia (Wave-1 confirmed):**
- All sinks are **flat**; nothing scales with run length → gold likely inflates on deep runs. A deep
  roguelike especially needs a scaling sink. Consider escalating blacksmith/upgrade or identification
  costs, or depth-indexed shop prices.
- **Repair is a no-op sink that can't even fire (211):** `Weapon.durability` is never decremented by any
  store, so the 705-line `repair.tsx` never has anything to repair — a "sink" that is structurally dead.
- **Broken sink — unusable armor (AUD-084 + 193/194):** shops stock/sell **armor the player cannot
  meaningfully use** (mobility penalties 193 and accessory effects 194 are inert; equipping is gated).
  Players spend gold on goods that do little — a sink that is actively anti-fun. → gate armor out of shops
  until the system is wired.
- **Silent gold-loss (113):** `MAX_INVENTORY_SLOTS=50` vs `BAG_CAPACITY=20`; `addItem` returns success even
  when the bag (cap 20) rejects the item → buying at 20–49 items **charges gold but adds nothing**. A
  negative "sink." → reconcile the caps; fail the purchase when the bag is full.
- **Reputation price band 0.6×–2.0×** (`ReputationEffects.priceModifiers`) is a reasonable lever; keep —
  but resolve the duplicated blacksmith rep (107: `useBlacksmithStore` canonical, `useShopStore`'s is dead)
  so pricing is deterministic.

---

## 7. Stat scaling benchmark — "every stat matters" vs the actual curve

Kohrvellia's pillar (CLAUDE.md) explicitly cites **Elden Ring** ("every stat matters, no wasted point").
The genre achieves that with **soft caps / diminishing returns**: Elden Ring Vigor gives *accelerating* HP
to ~40 then *diminishing* returns, with multiple soft-cap breakpoints — deliberately making the *last*
points the most expensive, which both rewards investment and incentivizes spreading.

**Kohrvellia does the opposite:** linear coefficients with hard `Math.min` caps (a cliff, not a curve),
**compressed + near-cosmetic top grades (B3)**, and a **flat growth path (B2)**. Net effect: little
incentive to specialize deeply (hard cap kills the top end) yet trivial to reach SSS (compression), and the
grade letter barely matters anyway (linear effStat). → **Adopt soft-cap breakpoints** (piecewise
diminishing multipliers) instead of hard `Math.min`, make the prestige grades a real grind (B2/B3), and
give grades a derived-stat consequence. This delivers the cited Elden Ring feel *and* gives the balance
audit one curve to reason about rather than 60 inline literals (B1).

---

## 8. Permadeath & meta-progression benchmark — intentional vs accidental

**Buriedbornes** (closest sibling: hardcore turn-based permadeath dungeon RPG) makes meta-progression
**explicit and earned** — death is permanent, but you bank *Soulstones* to unlock jobs; "choosing is most
important." The cross-run carry is a *designed* currency.

**Kohrvellia's cross-run carry is accidental (KV-AUD-002, the S1):** the `clearAllStores()` gaps mean
fragments of a *dead* character silently influence the next one — confirmed leaks are shop
**`lifetimeGoldSpent`** (104, biases shop pricing/tiering) and sacred **`acquired`/character-scope**
metrics (098, items earned by a dead character stay "owned"/affect unlocks). *(The earlier "second gold
pool" worry was refuted — inventory is a facade over `character.gold`, 106.)* In a permadeath game this is
the cardinal sin: meta-progression no one designed and the player can't see. → Either make a meta-layer
**explicit** (a Buriedbornes-style banked currency) or **fully sever** every run-scoped store on new game.
Today it is neither.

---

## 9. Prioritized tuning recommendations
1. **Reconnect the balance source of truth (B1/151)** before tuning anything — otherwise every change is a
   no-op. Highest leverage.
2. **Run the 100-floor scaling sim (B6/162)** and refactor monster-HP-vs-player-damage — this gates whether
   the game is *completable* past floor 25.
3. **Kill the farming re-arm (B6/080)** + deterministic floor seeds (082) — protects the core pillar; cheap.
4. **Fix the growth/grade curve together (B2/068 × B3/150)** — flat growth → rising curve, widen/empower
   top grades, soft-cap derived stats (§7). Delivers the Elden Ring "every point matters" goal.
5. **Wire favor → power (B5/121)** — call `modifyDeityFavor`/collapse to one favor field; unify the favor
   tables (180); apply domain blessings (181). Restores a headline feature.
6. **Fix the economy sinks (§6)** — make a sink scale with depth; wire durability so repair exists (211);
   remove unusable armor from shops; fix the silent gold-loss (113); de-dupe blacksmith rep (107).
7. **Decide meta-progression intent (§8/002)** — explicit currency or total reset, not accidental.
8. **Fix the Denatus climax (§5)** — sort bug (176), double-count (093), dead noun passives (177), and
   realistic Mythic thresholds (178) — so the game's emotional payoff actually works.

## Wave-3 DC/DPr balance additions (298–342) — added S47

The data wave's balance findings (beyond the headline `303` scaling sim, which is in §2):
- **The scaling wall is executed, not estimated (`303`).** The owed 100-floor sim ran on the *real* formulas
  (`.audit_tmp/scaling_sim.js`): the run is **unwinnable past ~floor 15** (playable 1–9; lose-by-attrition ~fl.10;
  one-shot ~fl.20) because `monsterLevel≈floor` (1→100) while the player level is gated 1→7 (monster HP ×670 /
  atk ×770 vs player ×5). The **binding constraint is defensive** (monster attack ≫ player HP → 1–2-shot),
  robust across focused/tank/out-levelled builds — so **buffing player *damage* doesn't help; only gating
  `monsterLevel` to player level / raising END→maxHP / flattening the zone curve does.** The script is the
  regression harness for any re-tune. *(This bounds the practical severity of 099/259/322 — the deep content
  they gate is unreachable anyway until 303 is fixed.)*
- **Poison is non-viable (`298`).** ~53% of the bestiary is poison-immune/resistant (17/36 immune + 2 resist),
  concentrated in the undead/demon/dragon sets that dominate deep floors — a whole build path with no in-game signal.
- **Job coverage breaks "every stat matters" (`335`).** Only 21 of 56 top-3-stat builds have a job → 63% of builds
  are class-less at L2 (no starter skill / stat bonus / spec path). The Elden-Ring "no wasted point" pillar is unmet.
- **LCK under-provisioned (`314`).** 22 LCK weapons vs 40 per other category — the Chaos/LCK identity has ~half
  the gear variety.
- **Reward systems can't pay out (the "Loot is King" / progression economy):** `311` weapon `specialMechanic`s
  (the loot dopamine) don't execute; `316` boss mechanics don't execute; `325/326/327/329/333` ~27%+ of
  achievement rewards are unreachable; `336` the support-job class skills do nothing. The *intended* reward curve
  is far richer than the *delivered* one.
- **Grade-blind gates persist into content (`318`).** 61 boss secret-outcome stat-gates compare raw within-grade
  `minPoints` (50–150) — the 6th site of the raw-points-vs-grade class (`279/261/218`), so the gates favor the
  wrong builds.

## Sources
- [Elden Ring Soft Caps, Explained (Game Rant)](https://gamerant.com/elden-ring-soft-caps-explained-dlc-stat-caps-guide/)
- [Elden Ring Stat Caps & Diminishing Returns (Game Rant)](https://gamerant.com/elden-ring-stat-attribute-soft-hard-caps-diminishing-returns/)
- [Slay the Spire 2 Gold Economy Guide (sts2front)](https://sts2front.com/tips/gold-economy-guide/)
- [Slay the Spire Merchant (Fandom wiki)](https://slay-the-spire.fandom.com/wiki/Merchant)
- [Buriedbornes – Dungeon RPG (Steam)](https://store.steampowered.com/app/2153310/Buriedbornes__Dungeon_RPG/)
- [On Backtracking in Roguelikes — Grid Sage Games / Cogmind](https://www.gridsagegames.com/blog/2022/11/on-backtracking-in-roguelikes/)
