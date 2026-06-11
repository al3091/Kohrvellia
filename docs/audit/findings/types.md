# Findings — Types (`src/types/`)

Canonical first-hand findings for the type layer. Schema per `01_CHARTER_AND_RUBRIC.md`. This wave
discharges several pending seed cross-checks (018, 003, 019, 039, 041, 061) with exact evidence.

---

## Unit W1-T1 — `Stats.ts` (477) + `Character.ts` (435) — Session 13, audited first-hand

**Context:** the Falna/stat math (`calculateEffectiveStat`, `calculateDerivedStats`, grades) that every
store consumes, plus the `Character` interface, backstories, and creation.

### Per-section coverage map
| Symbol | Lines | Verdict |
|---|---|---|
| `GRADE_RANGES` | 13-26 | **S/SS/SSS = 50/30/20 wide** (I–A = 100 each) — KV-AUD-150 |
| `STAT_INFO` | 51-116 | references party/spell-slots/carry that don't exist — KV-AUD-149 |
| `calculateEffectiveStat` | 129-131 | `level*500 + points + carry` ✓ (sound) |
| `getProficiencyThreshold` | 180-183 | increasing curve — **dead** (flat path live) — KV-AUD-154 |
| `applySoftCap` | 217-219 | **dead** (soft caps removed) — KV-AUD-148 |
| `calculateDerivedStats` | 307-477 | hardcoded coeffs (003 drift) — KV-AUD-151; cap physical-only — KV-AUD-152; hybrid mis-scale — KV-AUD-153; `battleCry=0` — KV-AUD-155 |
| `BACKSTORIES` / `createNewCharacter` | 43-108 / 265-392 | penalty no-op — KV-AUD-156; non-domain affinity — KV-AUD-157 |
| `StatusEffectId`/`StatusEffect` | 111-130 | the schism, Character side — KV-AUD-158 |
| `canLevelUp`/`getCarryCapacity` | 397-435 | `allStatsAtD` unused — KV-AUD-160; carry-capacity dead — KV-AUD-159 |

### Balance: the grade system is both cheap and nearly cosmetic (confirms 018; cross-links 068/003)
**KV-AUD-150 | S2 | Confirmed | L9 | `:13-26,129-131`** — **Confirms seed KV-AUD-018 with exact widths.**
`GRADE_RANGES`: I–A are **100 points each** (0→899), then **S = 900-949 (50), SS = 950-979 (30), SSS =
980-999 (20)**. So A→SSS costs **199** points while I→A costs **800** — the four prestige grades are
*compressed*, inverting "top points cost most." **But it's worse than just cheap:** combat reads
`calculateEffectiveStat = level*500 + points + carry` (`:129-131`) — **linear in points** — so going
A(800)→SSS(999) adds only **+199** to an effective stat that's in the thousands by level 3-5 (the comment
at `:300-301` shows effX ≈ 1800 at L2, ≈ 5000 at L5). Net: the prestige grade is a **near-cosmetic label**
that's *also* trivially cheap to reach (compounded by the flat growth of KV-AUD-068). The CLAUDE.md "every
stat matters / SSS is a real grind" pillar is unmet on both axes. → if grades should matter, make combat
read grade **breakpoints** (soft caps), and re-curve + re-cost the top grades (with 068).

### Balance: `GameConstants.DerivedStatFormulas` confirmed dead + the exact 10× drift (confirms 003)
**KV-AUD-151 | S2 | Confirmed | L3/L9 | `:332-416`** — **Confirms seed KV-AUD-003 first-hand.**
`calculateDerivedStats` hardcodes every coefficient inline and imports nothing from `GameConstants`.
Compared field-by-field: HP `50 + effEND*0.1 + effSTR*0.02` (`:332`) **matches** `GameConstants`, but the
rest have **drifted ~10×**: physical-attack `STR 0.008` (`:342`) vs constants `0.08`; speed `effAGI*0.010`
(`:362`) vs `0.1`; crit `effLCK*0.0004` (`:363`) vs `0.004`. The drift comes from the "soft caps removed,
coefficients recalibrated for the linear effX scale" rework (`:297`) that updated `Stats.ts` but not
`GameConstants`. So the documented "single source of balance truth" is both **disconnected** and **10×
stale** for most fields. → make `Stats.ts` import from `GameConstants`; reconcile the values.

**KV-AUD-152 | S2 | Confirmed | L9 | `:353,356-359`** — **Confirms seed KV-AUD-019.** The quality output
cap is applied **only to physical attack**: `basePhysicalAttack = Math.min(physScaling + weaponDamage,
weaponMaxOutputCap)` (`:353`), while `baseMagicAttack` (`:356-358`) and `baseLuckAttack` (`:359`) have **no
`Math.min`** — INT/WIS/LCK weapons scale **uncapped** with stats regardless of quality tier. `weaponMaxOutputCap`
also defaults to `Infinity` (`:316`), confirming W1-S2 KV-AUD-077 (unarmed is uncapped too). → apply the cap
symmetrically across all three attack channels.

**KV-AUD-153 | S2 | Confirmed | L1/L9 | `:341-358`** — **Hybrid weapons scale off the wrong stats.**
`PHYS_COEFFICIENTS` (`:341-343`) only has the five single physical stats; for a hybrid `weaponCategory`
(e.g. `AGI_WIS`) the lookup misses and falls back to **`effSTR * 0.008`** (`:351`), and `baseMagicAttack`
defaults to **`effINT`-based** unless category is exactly `'WIS'` (`:356-358`). So a hybrid weapon's physical
half always scales off **STR** and its magic half off **INT**, ignoring the hybrid's *declared* stats — an
`AGI_WIS` or `PER_LCK` hybrid mis-scales entirely. Combine with combat's hybrid **sum** of both pools (W1-S1
KV-AUD-061) and hybrids are both mis-stated and double-dipping. → look up the hybrid's component stats.

### Dead code / stale (Stats.ts)
**KV-AUD-148 | S3 | Confirmed | L3 | `:217-219,229,297`** — `applySoftCap` is exported but **dead** (line
297: "Soft caps have been removed"; `calculateDerivedStats` uses `Math.min` hard caps). The `DerivedStats`
section comment "Core offensive/defensive (**soft-capped**)" (`:229`) is now false. Confirms prior AUD-021.
→ delete `applySoftCap`; fix the comment.

**KV-AUD-154 | S3 | Confirmed | L3 | `:180-183`** — `getProficiencyThreshold` (`100*(index+1)` — the *only*
increasing-cost curve) is **bypassed** by the live flat `commitExcelia` (W1-S2 KV-AUD-068). It's the correct
mechanism, sitting dead. → drive the canonical growth path off it.

**KV-AUD-149 | S3 | Confirmed | L8 | `:55,80,88`** — `STAT_INFO` describes mechanics that don't exist:
`CHA.combatEffect = '+Party buff power'` (`:80`, solo game), `INT = '+Spell slots'` (`:88`, no spell slots),
`STR = '+Carry capacity'` (`:55`, inventory is flat 20-slot — KV-AUD-159). Player-facing stat text is wrong.
Confirms prior AUD-024. → rewrite the copy.

**KV-AUD-155 | S4 | Confirmed | L3 | `:390,451`** — `battleCryBonus` is computed as a constant `0` ("Retired
— replaced by Kairos sequenceBonus") yet still returned as a derived stat. Dead field. → remove.

### Character.ts — backstory & the StatusEffect schism
**KV-AUD-156 | S2 | Confirmed | L4/L9 | `:38,293-307`** — **Confirms seed KV-AUD-041 (penalty half).**
Every backstory declares a `statPenalty` (e.g. orphan: CHA −5), but `createNewCharacter` applies only the
`statBonus` (+5) and deity bonus (+10) — the comment at `:306-307` says "Penalty is not applied to starting
points, it affects growth rate," and W1-S2 confirmed **no growth path references it** either. So the penalty
is a **pure no-op**: every backstory is all upside, no cost — violating MINDSET's "every benefit shows its
cost." → apply the penalty (to starting points or a real growth modifier), or remove the field.

**KV-AUD-157 | S2 | Confirmed | L7 | `:39,81,105`** — **Confirms seed KV-AUD-041 (affinity half).**
`Backstory.deityAffinity` is typed `string[]` (`:39`) and uses `'divine'` (temple_acolyte `:81`) and
`'fate'` (cursed_bloodline `:105`) — **neither is one of the 14 `DeityDomain`s**, so those two backstories'
affinity hints can never match a deity. Typed `DomainId[]` these would be compile errors. → type it as
`DomainId[]`; fix the two values. (Verify the picker actually reads `deityAffinity` in Wave 2.)

**KV-AUD-158 | S2 | Confirmed | L2/L3 | `:111-130,214`** — **Confirms + deepens seed KV-AUD-039 (StatusEffect
schism).** `Character.ts` defines `StatusEffectId` = poison/bleed/burn/freeze/stun/**fear/silence/paralysis**/
curse/blind and a `{id,name,duration,damagePerTurn?,statModifier?}` shape — **structurally different** from
the `StatusEffect.ts` model combat uses (weaken/slow/regen + percentDamage/preventsHealing…, W1-S1). And the
two **don't interact**: combat status lives in `useCombatStore.playerEffects` (StatusEffect.ts shape), while
`character.statusEffects` (this shape, persisted) is written only by **out-of-combat consumables** — which
push a `{type:'buff', stat, value}` object cast `as any` (W1-S5b KV-AUD-116) that matches *neither* schema.
So `fear`/`silence`/`paralysis` are dead (combat never makes them), and there are effectively **three** status
shapes in play. Full unification verdict in W1-T4 (`StatusEffect.ts`). → one status model.

### Smaller / positives
**KV-AUD-159 | S3 | Confirmed | L3 | `:174,433-435`** — `getCarryCapacity` (STR-weight model) is dead —
inventory uses the flat `BAG_CAPACITY = 20` everywhere (W1-S2). Confirms prior AUD-029. → delete or wire.

**KV-AUD-160 | S3 | Confirmed | L3 | `:190,404`** — `levelProgress.allStatsAtD` is a stored flag, but
`canLevelUp` computes the 6-of-8-at-D gate **live** from `stats` (`:404`) and never reads `allStatsAtD`.
Dead/duplicated state. → remove the field or use it.

**KV-AUD-161 | Info | Confirmed | L3** — Positives: the Falna formula + carry model are sound and
self-consistent (`:129-131,195`); `canLevelUp` (6-of-8 stats ≥500 + 1 achievement + deity approval, `:397-414`)
matches GAME_INDEX (closes prior AUD-019); the hardcoded `maxHP:50/maxSP:30` at creation (`:327-330`) is
immediately overwritten by `computeMaxResources` (closes prior AUD-030); IDs use `Date.now()+random`.

**Unit verdict:** the type layer's math is internally consistent, but this unit **confirmed five pending
seeds first-hand** (018 grade compression + the new insight that grades are near-cosmetic for combat; 003
the exact 10× coefficient drift; 019 the cap asymmetry; 041 the no-op backstory penalty + broken affinity;
039 the StatusEffect schism) and added a **hybrid mis-scaling** bug (153). The balance picture sharpens:
**068 (flat growth) × 150 (compressed, cosmetic grades) × 003 (dead/stale constants) = a progression system
whose prestige tiers are cheap, marginal, and untunable from the documented source.** Cross-checks: W1-T4
(StatusEffect.ts unification), Wave 2 (does the creation picker read `deityAffinity`?), W1-T3 (Behavement
score vs the grade/effStat scale).

---

## Unit W1-T2 — `Monster.ts` (566) + `Dungeon.ts` (440) — Session 14, audited first-hand

**Context:** the modular monster system (prefix/base/suffix, CR + floor scaling) and the dungeon structure
types (nodes, biomes, floor brackets, ramifications). Discharges seeds 022, 035, 036/053, 037, 038, 085.

### Per-section coverage map
**`Monster.ts`:** `MONSTER_LEVEL_MULTIPLIERS`+`MONSTER_STAT_SCALING`+`PLAYER_LEVEL_FLOOR_ZONES`+`createMonsterInstance`
(254-532) **multiplicative HP scaling** — KV-AUD-162 · `calculateMonsterCR` clamps finalCR≥0.1 but division
uses raw `base.baseCR` — KV-AUD-163 · `calculateGoldDrop`(463-468) orphan/dup — KV-AUD-164 · `xpValue`(102)
vestigial — KV-AUD-165 · `category:string`(107) — KV-AUD-166 · `STATUS_EFFECT_CR_WEIGHTS`(346-356) vs
`StatusEffectId` — KV-AUD-167 · `SUFFIX_FLOOR_GATES`+`isSuffixAllowedOnFloor`(180-188,538-541) — KV-AUD-168 ·
`MonsterAbility`(114-124) likely dead — KV-AUD-169.
**`Dungeon.ts`:** dead `void`/`labyrinth` biomes(24-34,262) — KV-AUD-170 · dead `NODES_PER_FLOOR_*`(193-195) —
KV-AUD-171 · dead `shop` node surface(18,69-72,209) — KV-AUD-172 · three floor-bracket schemes — KV-AUD-173 ·
dup danger fns(405-415 vs Monster 418-431) — KV-AUD-174.

### Balance: monster HP scales multiplicatively while player damage scales linearly (headline)
**KV-AUD-162 | S2 | Confirmed (mechanism) / Needs-sim (magnitude) | L9 | `:254-319,474-499`** — Deep floors are
likely **mathematically unwinnable**, and this probably explains why content stops at floor 25. Monster HP in
`createMonsterInstance` stacks **three multiplicative layers**: `monsterLevel (≈floor)` × `levelMultiplier
(8–36 by CR tier, :254-259)` × `zoneMultiplier (1.0→9.0, :223-236)` × `prefix.hp (≤2.0)`:
```
rawHP = monsterLevel * levelMultiplier * 1.0 + baseHP        (:310)
hp    = floor(rawHP * zoneMultiplier) * prefixHpMod          (:313, :493)
```
At floor 86 a CR-11 monster ≈ `86 × 36 × 9 × ~1` ≈ **27,900 HP** (×2 with a legendary prefix ≈ 55k). Player
physical attack scales **linearly** off `effStat × ~0.008` (W1-T1 KV-AUD-151) — on the order of tens per hit
at the target level — so kills would take hundreds of hits, while monster *attack* (`×0.20` + same zone/level
stack) dwarfs player HP and one-shots. The structural mismatch — **multiplicative monster HP/atk vs linear
player damage** — widens with depth. → flatten to one scaling model and simulate the full 100-floor curve
(W3/W4 with real monster data + the combat formula). Magnitude needs a sim; the structural divergence is
certain.

### Confirmed seeds (dead data / schism / Infinity)
**KV-AUD-163 | S2 | Confirmed | L1 | `:388,466` + `useCombatStore:1519`** — **Confirms seed KV-AUD-053/036.**
`calculateMonsterCR` clamps the **final** CR to ≥0.1 (`:388`) but the reward math divides by the **raw**
`monster.base.baseCR` — `calculateGoldDrop:466` `finalCR / base.baseCR`, and combat's inline copy
(`useCombatStore:1519`). So a data monster with `baseCR:0` → **Infinity gold/xp**; the 0.1 clamp gives false
reassurance (it doesn't guard the divisor). → guard `base.baseCR` (clamp ≥0.1) and assert no zero-CR data (W3-DC1).

**KV-AUD-167 | S2 | Confirmed | L2/L3 | `:8,66,346-356,365`** — **Confirms seed KV-AUD-039 — exact combat
consequence.** `Monster.ts` imports `StatusEffectId` (Character.ts vocab: …`fear/silence/paralysis`) for
`MonsterSuffix.statusEffect`, but `STATUS_EFFECT_CR_WEIGHTS` (`:346-356`) is keyed with the **StatusEffect.ts**
vocab (`weaken`/`slow` present; `fear`/`silence`/`paralysis` absent). So `calculateStatusEffectCRModifier`
(`:365`) returns **0** for any `fear`/`silence`/`paralysis` suffix (no weight entry), and the `weaken`/`slow`
weights are **dead** (no `StatusEffectId` can name them). Root of BUG-040, confirmed.

**KV-AUD-168 | S3 | Confirmed | L3 | `:180-188,538-541`** — `SUFFIX_FLOOR_GATES` + `isSuffixAllowedOnFloor`
gate dangerous suffix status effects by floor — but combat **procs status from `monster.base.damageTypes`, not
`suffix.statusEffect`** (W1-S1 KV-AUD-052). So this entire early-floor safety system protects a mechanism that
**never fires** — aspirational guarding of dead data. (Also: the gate keys `burning`/`venomous`/`chilling`
must equal suffix `id`s or `isSuffixAllowedOnFloor` defaults to gate=1 — W3-DC2 data check.)

**KV-AUD-165 | S3 | Confirmed | L3 | `:102`** — Every `BaseMonster` carries `xpValue` though the game has no
XP (W1-S1 KV-AUD-055: `rewards.xp` computed-and-discarded). Vestigial dead data on all ~39 monsters. → remove.
> **[Update S22 — REVISED by KV-AUD-222 (W2-P1a): `xpValue` is LIVE data, not vestigial.** It flows
> `xpValue → rewards.xp → pending excelia` in `combat.tsx handleVictory:1020` (per-kill proficiency). Keep
> the field; the defect is the physical-only distribution, not the data. The "remove" recommendation is withdrawn.]**
**KV-AUD-166 | S3 | Confirmed | L2 | `:107`** — `BaseMonster.category: string` (not a union), yet loot pools +
sacred/soul routing branch on it — a typo silently breaks drops/tracking. `Loot.ts` has a `MonsterCategory`
union to reuse. Confirms seed KV-AUD-038. **KV-AUD-164 | S3 | Confirmed | L3 | `:463-468`** —
`calculateGoldDrop` duplicates combat's inline gold math (`useCombatStore:1456-1519`) and appears **orphan**
(combat doesn't call it). → delete or converge on one.
**KV-AUD-169 | S3 | Likely | L3 | `:114-124`** — `MonsterAbility` (cooldown/effectId/targeting) is defined but
combat's `enemyTurn` (W1-S1) drives behavior off `behaviorPattern` only, never abilities — likely dead/aspirational
(verify Wave 2).

### Dungeon.ts — dead surfaces + misaligned brackets
**KV-AUD-170 | S3 | Confirmed | L3 | `:24-34,262`** — **Confirms seed KV-AUD-022.** `Biome` declares 10 types
but `getBiomeForFloor` draws from only **8** (`:262`) — `void` (themed for Ars Goetia/Fallen) and `labyrinth`
are never generated; `getBiomeDisplayName` carries dead names for both. Biome also ignores the patron pantheon
(pure floor rotation + a `seed%2` coin-flip on a non-deterministic seed, W1-S3 KV-AUD-082). → wire to deep
floors / pantheon or remove.

**KV-AUD-171 | S3 | Confirmed | L3 | `:193-198`** — **Confirms seed KV-AUD-085/021.** `NODES_PER_FLOOR_BASE/MAX/
TIER_INCREASE` are dead (generation uses `ROWS_PER_FLOOR=12 ≈ 25-36 nodes`, W1-S3); PROGRESS "45 rooms" is a
third, stale number. → delete the dead constants.

**KV-AUD-172 | S3 | Confirmed | L3 | `:18,69-72,209,329,348`** — **Confirms seed KV-AUD-083/044.** The `shop`
node is dead — `NODE_TYPE_WEIGHTS.shop = 0` ("Removed … dead weight"), generation excludes it — yet the full
surface survives (`NodeType`, `shopData` interface, icon `◉`, display name "Shop"). → remove the dead surface.

**KV-AUD-173 | S3 | Confirmed | L9 | `Dungeon:224-232` vs `Monster:223-236` vs `GameConstants ZONE_NAMES`** —
**Three misaligned floor-bracketing schemes:** CR ranges (1-5/6-10/11-20/21-30…), player-level zones
(1-10/11-25/26-40/41-55…), and display zone names (1-10/11-25/26-40/41-60…). The boundaries don't line up
(e.g. floor 22 is CR-bracket "21-30" but zone "11-25"), so CR scaling and zone/level scaling step at different
floors → difficulty discontinuities. Confirms prior AUD-070. → one bracket table.

**KV-AUD-174 | S3 | Confirmed | L1 | `Dungeon:405-415` vs `Monster:418-431`** — Duplicate danger-rating
functions: `getDangerLevel` returns `…'hard'…` while `getFloorDangerText` returns `…'Dangerous'…` (same
`playerLevel*2.5` math, divergent labels). Confirms prior AUD-048. Plus `getBiomeForFloor(0)` → negative index
→ `undefined` biome (floor<1 unguarded, prior AUD-047; harmless since floors start at 1).

**KV-AUD-175 | Info | Confirmed | L3 | `:418-427`** — Note: `getAdjacentNodes` (forward-only, `fromId===current`)
exists but navigation uses `getCurrentPathOptions` (forward **+ backward**, the farming vector W1-S3 KV-AUD-080)
— the forward-only helper sits unused for navigation. `MapNode.combatData.monster` is always `null` (combat
generates the monster separately, W1-S3) — dead field.

**Unit verdict:** the monster/dungeon types are feature-rich but carry the audit's clearest **deep-floor
balance red flag** (KV-AUD-162: multiplicative monster scaling vs linear player damage — likely why floors >25
were never finished) plus a dense cluster of **confirmed dead surfaces** (void/labyrinth biomes, NODES
constants, shop node, xpValue, calculateGoldDrop, MonsterAbility) and the schism's exact CR consequence (167).
Cross-checks: **W3-DC1** (any `baseCR:0`?), **W3-DC2** (suffix ids vs gate keys), **W1-T4** (StatusEffect
unification), **W3/W4** (100-floor balance simulation for 162).

---

## Unit W1-T3 — `Behavement.ts` (457) + `Deity.ts` (442) — Session 15, audited first-hand

**Context:** the Paragon-title generator (the soul system's Level-10 climax) and the deity/favor types.
Definitively resolves the Paragon sort bug (011/029), Mythic=100 (020/050), and the favor-table divergence
(004/121/122/128).

### The Paragon sort bug — now proven exactly (13 of 28 titles are wrong)
**KV-AUD-176 | S2 | Confirmed (exhaustive) | L1 | `Behavement:93-122,293-298`** — Reading the sort **and**
every map key: `getStatAdjective` does `[stat1,stat2].sort()` (alphabetical: AGI<CHA<END<INT<LCK<PER<STR<WIS)
then `STAT_ADJECTIVE_MAP[key] ?? 'Iron'`. But the map keys are **not** all alphabetical, so **13 of 28 pairs
miss and fall back to 'Iron'**: every `STR_*` except `STR_WIS` (STR_AGI/INT/PER/CHA/LCK → 'Iron' instead of
Savage/Arcane/Precise/Commanding/Fortunate), `END_AGI`, `END_CHA`, `INT_CHA`, `WIS_PER`, `WIS_CHA`, `WIS_LCK`,
`PER_CHA`, `PER_LCK`. (`STR_END` also misses but its intended value *is* 'Iron', masking the bug for STR/END
players.) So ~half of all Level-10 Paragon stat-adjectives are silently wrong. Confirms seed KV-AUD-011/029
with the exact list; trivial fix (alphabetize the map keys). 

### NEW — half the Paragon noun passives are dead
**KV-AUD-177 | S2 | Confirmed | L3 | `Behavement:158-217` vs `useCharacterStore:1350-1382`** — `NOUN_PASSIVES`
grants combat buffs by `effect.type`, but `getDerivedStatsWithBlessings` (the only consumer of paragon buffs,
W1-S2) only handles `physical_damage/magic_damage/damage_reduction/dodge_chance/crit_damage/max_hp_bonus/
speed_bonus/physical_defense_only/magic_defense_only`. The passives for the **CAUTION/SOCIAL/EXPLORATION/
RESOURCE/GLORY** vectors use `item_effectiveness`, `reputation_gain`, `gold_bonus`, `loot_discovery`, and
`tier_bonus` — **none of which are applied** in the derived path or read by any audited store. So ~16 of ~39
noun passives (e.g. Tactician +20% item, Diplomat +30% rep, Negotiator +15% gold, Seeker +25% loot, Champion
+25% tier bonuses) are **inert**. A non-combat Paragon's reward does nothing mechanically — compounding the
combat-bias of the title itself (KV-AUD-093). → apply these in the relevant systems, or convert them to
derived effects. (Verify no screen applies them, Wave 2.)
> **[Update S22 — PARTIALLY REFUTED by KV-AUD-223 (W2-P1a):** `gold_bonus` (Negotiator) **is** applied —
> at the screen level in `combat.tsx handleVictory:998-1002`, not the derived path. So the passives are
> applied **inconsistently** (some in screens), not uniformly dead. The other four (`item_effectiveness`/
> `reputation_gain`/`loot_discovery`/`tier_bonus`) remain unconfirmed pending the shop/loot/discovery
> screens (W2-P5–P9). Reword "inert" → "applied inconsistently across screens, never in the derived path."]**

**KV-AUD-178 | S3 | Confirmed | L9 | `Behavement:70-81,256-268`** — **Mythic is impossible, not just hard.**
`CR_ADJECTIVE_RANGES.Mythic = {min:100,max:100}` and `calculateBehavementScore` = weighted mean of
`min(current/target,1)` × weight × 100 — so score 100 requires **every** one of the ~90 behavements at 100%.
Since some behavements are structurally unreachable (e.g. `explore_secret_rooms` — no secret rooms generate,
W1-S4a KV-AUD-095), the max attainable score is **capped below 100**, making Mythic (and likely Legendary,
98-99) **literally unreachable**. Confirms + escalates seed KV-AUD-020/050. → realistic thresholds keyed to
the true max score.

**KV-AUD-179 | S3 | Confirmed | L1 | `Behavement:303-351,381-420`** — Title generation has no determinism or
agency: `getDominantVector` defaults to `COMBAT_PHYSICAL` on ties/all-zero (`:304`) and is biased by the
combat double-count (KV-AUD-093); `getSkillNoun` picks the secondary noun via `Math.random()` (`:345`) so the
"revelation" varies run to run; and `generateParagonTitle` takes `topStats` from the caller with no
validation/choice (`:383`, prior AUD-065). → deterministic + player-chosen on ties.

### Favor tables — definitively reconciled (004/121/122)
**KV-AUD-180 | S2 | Confirmed | L1/L9 | `Deity:252-275` vs `useDeityStore:25-33`** — The two favor tables are
confirmed divergent on **every** axis: `FAVOR_TIERS` (Deity.ts, the **live** one `getBlessingMultiplier` uses)
= **6 tiers, 0.50×–1.50×, Abandoned 0.50×**, boundaries 0-10/11-30/31-60/61-80/81-90/91-100; `FAVOR_STATUS`
(useDeityStore, **dead** — only a self-call, W1-S6a KV-AUD-122) = **7 tiers, 0×–2.0×, Abandoned 0×**, different
boundaries (11-25, 26-40…). So the `0×` "zero all stats" lives only in the dead table (downgrade of seed 004
stands). **And the live table is itself inert:** `getBlessingMultiplier(character.deityFavor)` only ever sees
favor **frozen at 50** (KV-AUD-121, `modifyDeityFavor` has 0 callers) → it always returns **1.0× (Neutral)**.
So the comment "creates meaningful gameplay impact from deity relationship management" (`:241-242`) is false —
favor never moves the multiplier. → unify to one table **and** fix the freeze (121), or the blessing is dead.

**KV-AUD-181 | S2 | Likely | L3 | `Deity:185-207,131-135`** — Deity **domain** blessings appear display-only.
`DOMAIN_EFFECTS` ("+10% physical damage" for war, etc.) and `deity.domainBlessing.effectValue` are surfaced by
`getBlessingEffect` for **display**, but combat (W1-S1) and `getDerivedStatsWithBlessings` (W1-S2) never read
them — so a war deity's "+10% physical damage" is shown but **not applied**. Combined with KV-AUD-180/121, the
deity system's *two* power mechanics (favor multiplier + domain blessing) are **both inert**. → apply domain
effects in combat (verify Wave 2 first).

### Smaller (Deity.ts)
**KV-AUD-182 | S3 | Confirmed | L3 | `Deity:312-319`** — `calculateBlessingPower` is `@deprecated` ("Use
getBlessingMultiplier") yet still called by `useDeityStore.getBlessingEffect` (W1-S6a `:479`). Confirms seed
KV-AUD-128. → migrate the one caller; delete.
**KV-AUD-183 | S3 | Confirmed | L1 | `Deity:338-380`** — `checkDeityApproval` has `opposingDomains` for only
**4** of 14 domains (war/life/trickery/authority), so the other 10 deities never react with disapproval; and
the typed return `'refused'` is **never produced** (opposing → `'reluctant'`). Dead branch + incomplete map
(relates to prior AUD-042). → complete the opposition map or simplify the type.
**KV-AUD-184 | Info | Confirmed | L3** — `PantheonId` + `PANTHEON_INFO` enumerate **all 19** pantheons (incl.
maya/inca — the *type* is fine; the *data* is the W3 concern, KV-AUD-028), confirming docs' "12 active" is
stale (prior AUD-016). Positives: `FAVOR_TIERS` is well-designed (contiguous, sensible curve — wasted by the
freeze); `calculateFavorChange`/`isAbilityUnlocked`/`getAvailableChallenges` correctly use the live
`relationship.favor` (so challenges/abilities *do* respond to favor — only the blessing multiplier is frozen).

**Unit verdict:** the soul/deity type layer is elaborate but its two marquee rewards are deeply compromised:
the **Paragon title** is ~50% wrong (176), partly impossible (178), non-deterministic (179), and half its
passives are dead (177); the **deity blessing** is split across a divergent dead table (180) and an inert
domain layer (181), all moot because favor is frozen (121). Together with W1-T1's grade findings, the
progression-and-reward systems are the audit's richest vein of "looks complete, isn't wired." Cross-checks:
**W1-T4** (StatusEffect unification), **Wave 2** (combat application of domain effects + paragon non-combat
passives), **W3** (maya/inca pantheon data).

---

## Unit W1-T4 — `Weapon.ts` (274) + `StatusEffect.ts` (377) + `Armor.ts` (217) — Session 16, audited first-hand

**Context:** the equipment + status-effect type layer. Delivers the **definitive StatusEffect schism verdict**
(seed 039, cross-referenced across ~6 units), confirms the hybrid-set mismatch (040) and the weapon triangle,
and audits the armor/accessory systems.

### The StatusEffect schism — definitive verdict (seed 039, S1)
**KV-AUD-190 | S1 | Confirmed (definitive) | L2/L3 | `StatusEffect.ts:9-19` vs `Character.ts:111-121`** —
**Three incompatible status models coexist.** (1) `StatusEffect.ts` (the **combat** model, used by `useCombatStore`):
`poison/burn/freeze/stun/blind/bleed/`**`weaken/slow/regen`** + a rich interface (percentDamage, statModifier,
skipTurnChance, stacks, preventsHealing…). (2) `Character.ts` `StatusEffectId` (persisted + out-of-combat
consumables): `poison/bleed/burn/freeze/stun/`**`fear/silence/paralysis`**`/curse/blind` + a *different*,
thinner interface. (3) the `{type:'buff',stat,value}` object consumables push (W1-S5b). **Only 7 of 10 IDs
overlap**; each model has 3 unique. Consequences proven across the audit: `fear/silence/paralysis` are **dead**
(combat never creates them); `weaken/slow` CR-weights are **dead** (Monster.ts KV-AUD-167); out-of-combat
`cure_poison` removes by **id** and fails (KV-AUD-115); `character.statusEffects` is a separate persisted system
from combat's `playerEffects`. This is the audit's clearest structural hazard. → unify on the richer
`StatusEffect.ts` model; migrate `Character.ts` (add or drop fear/silence/paralysis).

**KV-AUD-191 | S2 | Confirmed | L3 | `StatusEffect.ts:34-38,84-88,133-144,153-157` vs `useCombatStore:502`** —
**The `statModifier` field is dead.** Effects define stat reductions (freeze `AGI -30%`, slow `AGI -40%`,
weaken `STR -25%`, curse `ALL -10%`) but combat **never applies `statModifier`** — it hardcodes per-type
effects instead (e.g. weaken → `×0.75` damage at `:502`, stun/freeze → skip via `skipTurnChance`, blind →
`accuracyModifier`). So **`slow` is fully inert** (its *only* effect is the ignored `statModifier`), and
freeze/weaken/curse lose their stat-reduction component. → apply `statModifier`, or delete the dead field and
keep the hardcodes.

**KV-AUD-192 | S2 | Likely | L3 | `StatusEffect.ts:152,73,244-257`** — `preventsHealing` (curse) and
`reducesHealing` (burn 50%) only matter if `getHealingModifier` is called — but combat's heal paths (W1-S1)
went through `onHeal` callbacks without it. If `getHealingModifier` isn't applied, **curse's healing-block and
burn's healing-reduction are dead** too. → verify the combat/heal call sites (Wave 2); wire `getHealingModifier`.

### Weapon — hybrid routing + triangle
**KV-AUD-185 | S2 | Confirmed (definitive) | L2 | `Weapon.ts:12-29`** — **Confirms seed KV-AUD-040 exactly.**
The `HybridCategory` union and the routing `Set<string>`s disagree: the union has `CHA_INT` but
`HYBRID_MIXED_CATEGORIES` has `INT_CHA` (different spelling → `resolveWeaponFormula.has('CHA_INT')` is **false**
→ a CHA_INT hybrid mis-routes to **physical**, W1-L1 KV-AUD-043 / W1-T1 KV-AUD-153); the set has `INT_PER`,
`WIS_PER`, `WIS_LCK` which **aren't in the union** (dead entries); and `WIS_CHA`+`CHA_WIS` are **both** in the
union *and* the set (redundant). `Set<string>` hides all of this from `tsc`. → derive the sets from the union;
canonicalize pair order.

**KV-AUD-186 | S2 | Confirmed | L1/L9 | `Weapon.ts:269`** — **Confirms seed KV-AUD-051/032.** `getDamageEffectiveness`
returns a hard **0** (not a reduction) for `poison` vs `bone`/`armor`/`spirit`. Combat applies this *after* the
`Math.max(1)` floor (W1-S1 `:534`), so a poison weapon does **literally 0** to skeletons/golems/ghosts — an
unwinnable softlock if such an enemy is mandatory. → floor the post-triangle damage to ≥1, or use a small
reduction not 0.

**KV-AUD-187 | S2 | Confirmed | L2 | `Weapon.ts:256-258`** — The triangle table accepts **6** armor types but
`MonsterArmorType` has **9** (`plate`/`scales`/`ethereal` absent). Combat bridges the gap with an `as any`
normalization (W1-S1 KV-AUD-054); any new armor type without that mapping hits the `?? 1.0` neutral fallback. →
align the union; remove the cast.

**KV-AUD-188 | S2 | Likely | L3 | `Weapon.ts:118-142`** — **Weapon enchantments appear display-only.**
`WeaponEnchantment.effects` (lifesteal, elemental_damage, status_chance, armor_pierce, bonus_vs_type, on_kill,
stat_boost) are generated and shown in the display name ("of Flame"), but combat's `playerAttack` (W1-S1) never
reads `weapon.enchantment` — so the effects likely do nothing. This undercuts the "Loot is King" pillar
(enchanted weapons are a core reward). → verify Wave 2 (`combat.tsx`); wire enchantment effects.

**KV-AUD-189 | S3 | Confirmed | L7 | `Weapon.ts:44-54`** — `DamageType` (10 types) has no `'chaos'`, yet
`SacredItem` references it (mapped to `'dark'` in conversion, W1-L1 KV-AUD-045). Confirms prior AUD-061. → add
`chaos` or stop referencing it.

### Armor / accessories
**KV-AUD-193 | S2 | Confirmed | L3 | `Armor.ts:15-53,167-179` vs `Stats.ts:362`** — Armor **mobility penalties
are dead.** `ARMOR_TYPE_STATS` defines `speedPenalty`/`dodgePenalty` (heavy = −0.25 speed) and
`calculateSpeedPenalty` sums them, but `calculateDerivedStats` (W1-T1) computes speed/dodge **without**
subtracting them, and `getDerivedStats` (W1-S2) never passes them. So heavy armor's defense applies but its
speed/dodge cost doesn't — the weight-class tradeoff is half-dead; `calculateSpeedPenalty` is orphan. → apply
the penalties in the derived calc.

**KV-AUD-194 | S2 | Confirmed | L3 | `Armor.ts:92-103` vs `sacredItemConversion:184-189`** — Only `stat_boost`
accessory effects are applied. `getAccessoryStatBonuses` (W1-L1) reads **only** `effect.type === 'stat_boost'`;
the `resistance`/`regen`/`bonus_damage`/`special` accessory effect types are **never applied** anywhere → dead.
→ wire the other effect types or remove them.

**KV-AUD-195 | Info | Confirmed (refutes 047) | L3 | `Armor.ts:9,118-126,133-162`** — **Corrects W1-L1
KV-AUD-047:** there are only **4** armor slots (`head/chest/hands/legs` — no boots/feet), so `getArmorStatBonuses`
(which reads exactly those four) misses **nothing** — the sacred-armor-bonus omission I flagged was wrong.
Positives: armor **defense does apply** (`calculateTotalDefense`/`MagicDefense` → `getDerivedStats` armorDefense),
so armor is implemented at the type/store level (UI exposure is the open Wave-2 question, not the math); the
weapon triangle table is otherwise complete and sensible; `QUALITY_OUTPUT_CAP_MULTIPLIER` is well-formed (the
bug is upgrade not recomputing it, W1-S5b KV-AUD-119).

**Unit verdict:** the equipment/status layer is the audit's densest concentration of **rich data that combat
barely applies**: the StatusEffect schism (190, S1) is the structural keystone, and around it sit a chain of
**inert systems** — dead `statModifier` (191, `slow` does nothing), likely-dead enchantments (188), dead armor
mobility penalties (193), dead non-stat-boost accessory effects (194), and the long-confirmed hybrid mis-route
(185) + poison-0 softlock (186). With W1-T1/T3, the verdict crystallizes: **Kohrvellia models far more than it
wires.** One refutation (047) keeps the ledger honest. Cross-checks: **Wave 2-P1** (`combat.tsx`: enchantments,
`getHealingModifier`, statModifier), **W3** (weapon/armor data integrity). **Two type units left (T5, T6).**

---

## Unit W1-T5 — `Achievement.ts`(335) + `Skill.ts`(196) + `Job.ts`(40) + `Loot.ts`(62) + `Consumable.ts`(164) — Session 17, audited first-hand

**Context:** five smaller type files — achievements, skills, jobs, loot pools, consumables. Closes the
RequirementType-vs-fired-set question (031/130), the MonsterCategory union (038/166), and the makeJobKey
sort risk (053).

### Achievements — ~half the RequirementTypes are never fired (definitive 031/130)
**KV-AUD-196 | S2 | Confirmed (definitive) | L3 | `Achievement.ts:16-37`** — Of the **21** `RequirementType`s,
only **~10 are ever fired** by the screens/stores (`kill_count, gold_earn, boss_kill, elite_kill, damage_dealt,
damage_taken, floor_reach, shrine_blessing, stat_reach, custom`). The other **~11 are dead**: `kill_type`,
`floor_return`, `no_damage`, `low_hp_win`, `item_collect`, `reputation`, `skill_use`, `status_inflict`,
`stealth_kills`, `flee_success`, `no_consumables`. Any achievement whose requirement uses a dead type can
**never complete** (its `requirementProgress` never advances), regardless of discovery state. This is the
definitive, type-level resolution of seeds KV-AUD-031/130 — the "residual" they flagged is now quantified. →
fire the missing types, or remove the achievements that use them. (Exact affected-achievement count = W3-DPr.)

**KV-AUD-197 | S3 | Confirmed | L3 | `Achievement.ts:195-275`** — Several utility functions are orphan: the
store inlines its stacking logic (W1-S6b), so `calculateStackedBonus`, `getTierSynergyBonus` (the dead
duplicate of the live count-stacking — confirms prior AUD-041), `getHighestTier`, and `isAchievementCompleted`
appear unused (only `isRequirementMet` is called). → delete or adopt.

**KV-AUD-198 | S3 | Confirmed | L3 | `Achievement.ts:152-163` vs `useAchievementStore:420-438`** —
`DISCOVERY_SOURCES` defines per-source rep gates (tavern 3, arena 6, academy 8…), but `checkReputationDiscovery`
checks **one** `guildRep` for **all** sources — so the multi-NPC discovery economy collapses to a single
reputation track; the per-source `baseRepRequired` values are largely cosmetic. → wire per-source reputations
or simplify.

### Skills — dead effect types + inconsistent defense
**KV-AUD-199 | S2 | Confirmed | L3 | `Skill.ts:9-22` vs `useCombatStore:934-1071`** — Three skill effect types
are **not handled** by `playerUseSkill` (W1-S1): `damage_percent` (HP%-based damage), `buff` (skill self-buff —
distinct from the combat hardcodes), and `flee`. A skill using any of these silently does nothing for that
effect. (Mirrors the consumable buff no-op KV-AUD-057.) → handle them, or remove from the type. (Which skills
use them = W3-DPr.)

**KV-AUD-200 | S3 | Confirmed | L9 | `Skill.ts:127`** — `calculateSkillDamage` reduces by a **flat**
`targetDefense * 0.3`, whereas basic attacks use the ratio `def/(def+100)` (W1-S1). So skill damage scales
differently vs defense than auto-attacks — skills fall off hard against high-defense monsters (flat
subtraction → floored to 1). Inconsistent two-formula defense model. → unify the defense reduction.

**KV-AUD-201 | S3 | Confirmed | L3 | `Skill.ts:86-90` vs `Character.ts:133-141`** — Two "learned skill" types:
`Skill.LearnedSkill` (cooldown/proficiency/timesUsed) vs `Character.Skill` (those + `level/observed/learned`).
The job store uses `Character.Skill`, so `createLearnedSkill` (`Skill.ts:179`) is orphan. Confirms prior AUD-052.
→ unify on one.

### Jobs, Loot, Consumables
**KV-AUD-202 | S3 | Confirmed | L1 | `Job.ts:38-40`** — `makeJobKey` = `[...stats].sort().join('+')` — the
**same alphabetical-sort dependency** as the Paragon bug (KV-AUD-176). Job lookup works only if the keys in
`jobDefinitions.ts` are *also* sorted; if a job's data key is in stat-priority order instead, that job is
**unfindable**. Confirms prior AUD-053 — same failure class as 176. → verify the data keys are sorted (W3-DPr4)
or sort on both sides.

**KV-AUD-203 | S3 | Confirmed | L2/L7 | `Loot.ts:9-17` vs `Monster.ts:107`** — `MonsterCategory` (8 values, incl.
`aberration`/`giant`) is the canonical union, but `Monster.ts` types `category` as **`string`** (KV-AUD-166)
and its comment lists only **6** — a drift that lets a category typo silently break loot/soul routing. Also
`LootResult.xp` (`:54`) is vestigial (no XP, cross-link KV-AUD-037). → use `MonsterCategory` in `Monster.ts`.

**KV-AUD-204 | S2 | Confirmed | L3 | `Consumable.ts:20-21` vs `useCombatStore:818-918`/`useInventoryStore:68-136`** —
The `reveal` and `identify` consumable effect types are **dead**: neither `playerUseItem` (combat) nor
`useConsumable` (out of combat) handles them — so a Scroll of Reveal / Identify Scroll does **nothing**.
(Extends the buff no-op KV-AUD-057.) → handle them or drop the types. (Which consumables use them = W3.)

**KV-AUD-205 | Info | Confirmed | L3 | `Consumable.ts:57-58`** — Pricing is single-path (confirms prior AUD-062
**closed**): consumables carry an explicit `sellPrice`, weapons/armor derive via `calculateSellPrice(buyPrice)`
— no divergence. Positive: `isRequirementMet` (Achievement), `canUseSkill`/`tickSkillCooldowns` (Skill),
`canUseConsumable` (Consumable) are all clean and wired.

**Unit verdict:** more confirmation of the central theme — the type layer enumerates far more capability than
the runtime applies: **~11 dead achievement RequirementTypes** (196, the headline — quantifying why many
achievements can't complete), **3 dead skill effect types** (199), **2 dead consumable effects** (204), the
`makeJobKey` sort trap (202), plus orphan utilities and the loose `MonsterCategory`. Cross-checks: **W3-DPr**
(which achievements/skills/consumables actually use the dead types/effects; jobDefinitions key ordering).
**One type unit left (T6) — then Wave 1 closes and synthesis begins.**

---

## W1-T6 — `Shop.ts`(197) · `SacredItem.ts`(190) · `Blacksmith.ts`(166) · `PlayerSnapshot.ts`(197) · `index.ts`(22)
*Session 18 · KV-AUD-206..219 · the final Wave-1 type unit*

### SacredItem.ts — the catalog the engine barely reads

**KV-AUD-206 | S3 (latent S2) | Confirmed | L4/L1 | `SacredItem.ts:102`** — `SacredWeaponStats.damageType`
is a **divergent, partly-orphan union**: `'physical' | 'magic' | 'holy' | 'dark' | 'chaos'`. Canonical
`DamageType` (`Weapon.ts:44-54`) = `slash|pierce|blunt|magic|holy|fire|ice|lightning|poison|dark`. **`'physical'`
and `'chaos'` exist in NEITHER** canonical value; sacred also omits all of fire/ice/lightning/poison/slash/
pierce/blunt. Structural mismatch too: `BaseWeapon.damageTypes` is `DamageType[]` (array, `Weapon.ts:80`) vs
sacred's singular scalar. On conversion to a real `Weapon` (lib `sacredItemConversion`), `'physical'`/`'chaos'`
have no mapping target. Currently **cosmetic** because the weapon-triangle is unimplemented (CLAUDE.md known
gap #2) — but it becomes a real bug the instant the triangle is wired. (Resolves seed 061.) *Confidence: high.*

**KV-AUD-207 | S2 | Confirmed | L7 | `SacredItem.ts:29-91`** — The acquisition **catalog dwarfs the
evaluator**: **50 `AcquisitionMetric`s × 4 `AcquisitionScope`s** (lifetime/single_character/single_run/
single_combat), with AND/OR via `requireAll` and an extra `forbiddenActions?: string[]`. Per **KV-AUD-099**
the sacred store evaluates only a fraction of these metrics (the rest read as 0/never-progress) → the bulk of
sacred items are **unobtainable**. `targetType?: string` and `forbiddenActions?: string[]` are stringly-typed
(no enum, no validation) — `kills_with_stat`/`kills_type` rely on a free-text `targetType` matching monster/stat
ids nowhere constrained by the type. This is the central theme — *models far more than it wires* — in its
purest form. (Resolves seed 060.) *Confidence: high (ties to 099).*

**KV-AUD-208 | S2 | Confirmed | L7 | `SacredItem.ts:139`** — `revealFavorRequired` is **inert at the engine
level**. It is set on essentially every relic (`deityRelics.ts`: dozens at `revealFavorRequired: 100,
isSecret: true`) but **NO store reads it** (`grep revealFavorRequired src/stores` → 0). So discovery-by-favor
is **unimplemented** in the engine. Compounded by **KV-AUD-121** (`character.deityFavor` frozen at 50 because
`modifyDeityFavor` has 0 callers): even if reveal were wired against character favor, thresholds 60/80/100 are
**unreachable**, so all deity-tier relics (`revealFavorRequired:100`) can never even be *revealed*, let alone
acquired. Double-locks the sacred system shut. (Links 099 + 121.) *Confidence: high.*

**KV-AUD-209 | S4 | Confirmed | L4 | `SacredItem.ts:151-154`** — `weaponStats?/armorStats?/accessoryStats?`
is a **non-discriminated optional triple**; "exactly one is populated" is enforced only by the comment, not
the type. A discriminated union keyed on `slot` (weapon → weaponStats, accessory → accessoryStats, else
armorStats) would make illegal states unrepresentable. Minor type-safety debt. *(Positive: `SacredArmorStats.slot`
= `Exclude<SacredSlot,'weapon'|'accessory'>` correctly yields the real 4 armor slots head/chest/hands/legs —
consistent with Armor.ts having no boots slot.)* *Confidence: high.*

**KV-AUD-210 | S3 | Suspected | L7 | `SacredItem.ts:148-149,159-164`** — Every `SacredItem` carries a
`passiveId`/`passiveDescription`, and every `PantheonSetBonus` a `passiveId`, but **no passive- or
set-bonus-resolution engine was found in any Wave-1 store**. Pending Wave-2/3 confirmation, sacred passives
and 2/4/7-piece set bonuses appear **decorative** (a `passiveId` string with no registry/handler). Moot today
because the items are unobtainable (099) — but it is more enumerated-capability-without-wiring. *Confidence:
medium (deferred for a passive-engine grep in Wave 2/3).*

### Blacksmith.ts — one dead service, one verified-good

**KV-AUD-211 | S2 | Confirmed | L7 | `Blacksmith.ts:103-117` + `Weapon.ts:163`** — The **repair/durability
model is inert**. `Weapon.durability?: { current; max }` exists (`Weapon.ts:163`) but has **0 reads/writes in
any store** (`grep durability src/stores` → none) → durability **never degrades**. `Blacksmith.ts` even labels
the section `REPAIR SYSTEM (Future)` (line 103); `calculateRepairCost` returns 10%-of-value gold while
`RepairCost.materials?` is never populated. Net: the `repair.tsx` screen (705 lines, Wave 2) operates on a value
that is **always max** → a **no-op town service**. (Resolves seed 058; engine-level verdict — screen specifics
deferred to Wave 2.) *Confidence: high.*

**KV-AUD-212 | S4 | Confirmed | L7 | `Blacksmith.ts:24,54,64,75`** — `UpgradeRequirement.questRequired?: string`
is **dead** (no quest system exists; never populated in `UPGRADE_REQUIREMENTS`). `requiredReputation` (6/11/16
for superior/masterwork/legendary) is a live gate but depends on a blacksmith-reputation value actually rising
(cross-ref `useBlacksmithStore`; flagged for the reputation-source check). *Confidence: high (questRequired);
medium (reputation reachability — Wave-2 cross-check).*

**KV-AUD-213 | Info / VERIFIED-GOOD | Confirmed | L8 | `Blacksmith.ts:38-74` ↔ `materials.ts`** — **Referential
integrity PASS** (refutes the seed-057 concern). All 7 upgrade `materialId`s resolve in `materials.ts`:
`iron_ingot`(:21), `steel_ingot`(:33), `damascus_ingot`(:45), `mithril_ingot`(:57), `adamantine_ingot`(:69),
`monster_essence`(:119), `dragon_heart`(:143). Likewise Shop's `MATERIAL_BASE_PRICES` keys (junk…legendary) ==
`MaterialTier` (`Weapon.ts:57`) and `QUALITY_PRICE_MULTIPLIERS` keys == `QualityTier` (`Weapon.ts:60`). *(Whether
the player can ACQUIRE these materials — drop sourcing — is a Wave-3 data question, not a type defect.)*
*Confidence: high.*

**KV-AUD-214 | S3 | Confirmed | L9/L3 | `Blacksmith.ts:129-135,138-155` ↔ `Shop.ts:189-196`** — The blacksmith
NPC is **triplicated and divergent**. (a) `BLACKSMITH_NPC` (id `blacksmith_garm`, greeting *"Ah, another
adventurer! …"*). (b) `SHOP_NPCS.blacksmith` (id `blacksmith`, **different** greeting *"Need something identified
or upgraded? …"* and different farewell). (c) `BLACKSMITH_GREETINGS` (a third, reputation-keyed pool). One NPC,
**three competing greeting/identity sources with mismatched ids** — whichever the screen consumes, the other two
are dead/contradictory data. *Confidence: high.*

### PlayerSnapshot.ts — the boss "senses" a constant

**KV-AUD-215 | S3 | Confirmed | L1/L7 | `PlayerSnapshot.ts:135-137`** — The boss's deity-favor sense is
**constant**. `favorPercent = character.deityFavor ?? 50` feeds the bucket (`≥70` blessed / `≥30` neutral /
else abandoned). Because `character.deityFavor` is **frozen at 50** (KV-AUD-121), `deityFavor` is **always
'neutral'** and `deityFavorPercent` **always 50** — bosses can never sense *blessed* or *abandoned*, defeating
the file's own headline design rule ("they sense ARCHETYPES… divine entities detect sacred marks"). This bucket
(3 tiers @70/30) is also a **THIRD** favor scheme atop `Deity.FAVOR_TIERS` (5 tiers; KV-AUD-180) and
`useDeityStore.FAVOR_STATUS` — extending 180's fragmentation to **3+ incompatible favor models**. (Resolves seed
054; links 121 + 180.) *Confidence: high.*

**KV-AUD-216 | S3 | Confirmed | L1 | `PlayerSnapshot.ts:64,140-141`** — `isFirstEverEncounter` /
`bossDefeatedBefore` are **(a) redundant** — when `bossId` is set both derive from
`gameState.defeatedBosses.includes(bossId)`, so `isFirstEverEncounter === !bossDefeatedBefore` always — and
**(b) semantically wrong**: the field + comment claim "Has ANY character ever **reached** this boss" (line 64),
but the data is `defeatedBosses` (**DEFEATED**, not reached). A boss you reached and *fled* (never killed) still
reports `isFirstEverEncounter=true` on return. Name/intent vs data mismatch. (Resolves seed 055.) *Confidence:
high.*

**KV-AUD-218 | S4 | Confirmed | L4/L1 | `PlayerSnapshot.ts:84-92` + `floor.tsx:415`** — The one caller invokes
the function through a **type-laundering cast**: `floor.tsx:415` passes `soul as unknown as Parameters<typeof
createPlayerSnapshot>[3]`, defeating the `SoulStoreRef` contract. Root cause: the file **re-declares** local
structural `SoulStoreRef`/`GameStateRef` shapes (lines 84-92) instead of importing the real store types, so the
real store can't satisfy them without the `as unknown as` escape hatch. Secondary: `primaryStat` (lines 105-107)
ranks by raw `stats[x].points` only, ignoring the Falna effective value (`level*500 + carry + points`), so it
can misreport the true dominant stat. *(Positive correction: archetype is sound — `WeaponBase.category` is
`WeaponCategory = STR|AGI|PER|INT|WIS|CHA|END|LCK` (`Weapon.ts:9`), i.e. a stat key, so `ARCHETYPE_MAP[category]`
resolves; an earlier "always Berserker" hypothesis was REFUTED on read.)* *Confidence: high.*

### Shop.ts + types/index.ts

**KV-AUD-217 | S3 | Confirmed | L3/L7 | `types/index.ts:1-22`** — The types **barrel is dead AND incomplete**.
(a) **Dead:** `grep "from '…/types'"` (barrel index, not `…/types/X`) = **0 importers** repo-wide; every consumer
deep-imports the concrete module (e.g. `floor.tsx:25` → `…/types/PlayerSnapshot`). (b) **Incomplete:** it
re-exports **9 of 18** type modules; it **omits** `StatusEffect`, `Skill`, `Job`, `Loot`, `Consumable`, `Shop`,
`SacredItem`, `Blacksmith`, `PlayerSnapshot` — so even if adopted it would be half-blind, and a future
`import { … } from '@/types'` of an omitted type would fail confusingly. Dead code + latent trap. (Resolves and
escalates seed 056.) *Confidence: high.*

**KV-AUD-219 | S4 | Confirmed | L7/L3 | `Shop.ts:6,61-144` + shop screens** — Shop pricing is **split across
layers**: `calculateWeaponPrice`/`calculateArmorPrice`/`calculateSellPrice`/`applyReputationDiscount`/
`getCHAHaggleDiscount` live in the `Shop.ts` *type* module and are consumed directly by **screens** (`floor.tsx`,
`shops/general/index.tsx:108`, `shops/equipment/index.tsx:168`) **and** by `useShopStore`. Notably
`getCHAHaggleDiscount` is used **only in the two shop screens, never in the store** → CHA haggling won't apply to
any store-driven transaction (e.g. quick-sell), a likely displayed-vs-charged divergence (defer exact
reconciliation to Wave-2 screens). Trivia: `REPUTATION_DISCOUNTS` falls through to 0 for `|rep|>20`
(out-of-range), and the `_Consumable` import (line 6) is intentionally-unused dead weight. *Confidence: medium
(screen reconciliation deferred).*

**Unit verdict (W1-T6):** the final type unit lands the theme hardest. Two whole subsystems are confirmed
**unwired** at the engine level — the **sacred-item economy** (207 catalog≫evaluator, 208 reveal-favor inert +
double-locked by the 121 favor freeze, 210 passives decorative — all feeding the S1 **KV-AUD-099**) and the
**blacksmith repair/durability** service (211, a no-op because durability never degrades). The **boss-sense**
showpiece is partly constant (215, again downstream of the 121 favor freeze). Plus dead/divergent plumbing: the
**0-importer types barrel** (217), the **triplicated blacksmith NPC** (214), redundant/mislabeled boss flags
(216), and a `as unknown as` contract bypass (218). Counter-evidence recorded too — **057 referential integrity
PASSES** (213, all 7 materials exist; price tables match canonical tiers) and the **archetype map is sound**
(218 positive). New IDs **KV-AUD-206..219** (14 findings; 1 S2-cluster reinforcing 099, 6×S3, 5×S4, 1 verified-
good). **★ WAVE 1 (engine spine: stores + types + lib) IS COMPLETE — 18 units, KV-AUD-001..219. Next: the
deferred Wave-1 synthesis (regenerate `00`/`02`/`03`/`05`/`07` from `ALL_FINDINGS.md`).**