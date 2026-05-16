# KOHRVELLIA — Execution Runway

> This document exists so that any future Claude session can read it and know exactly what to
> build, in what order, in which files, at which lines. It is a self-contained work plan for
> finishing what is already designed. Do NOT add new features. Finish existing ones first.
>
> Last updated: 2026-05-16

---

## Item 0: Progressive Disclosure — Tutorial Restructuring (DO THIS FIRST)

**Why it's Item 0:** A non-gamer product expert tested the game and spent 12 minutes in tutorial
screens before reaching character creation. This is the single highest-impact UX change possible.
The existing tutorial content is good — the order and density are the problem.

**Target state:** 3 tutorial screens (Stakes → Rules → Enter Tower). The 4 removed screens
(Kairos, Eight Pillars, Falna, Leveling) become **first-use overlays** that appear in-game at
the moment they're relevant.

### Files to modify

- `app/tutorial/_layout.tsx` — Remove `stats`, `falna`, `leveling` from Stack (keep `index`, `basics`, `death`)
- `app/tutorial/basics.tsx` — Change navigation: `router.push('/tutorial/death')` (skip combat/stats/falna/leveling)
- `src/stores/useGameStore.ts` — Add 4 boolean flags:
  `hasSeenCombatHint`, `hasSeenStatsHint`, `hasSeenFalnaHint`, `hasSeenLevelingHint`
- `app/dungeon/combat.tsx` — On first combat: if `!hasSeenCombatHint`, show Kairos overlay, then set flag
- `app/town/character/index.tsx` — On first visit: if `!hasSeenStatsHint`, show Eight Pillars overlay, set flag
- `app/dungeon/floor.tsx` or `app/town/familia/` — On first Excelia: if `!hasSeenFalnaHint`, show Falna overlay
- `app/town/guildhall/index.tsx` — On first level-up opportunity: if `!hasSeenLevelingHint`, show Ascent overlay

### First-use overlay pattern

Each overlay is a `Modal` (full-screen, `animationType="fade"`) with the tutorial screen content
condensed to the key points, plus a "Got it" button that sets the flag and closes the modal.
Reuse the existing screen content — copy the JSX into modal wrappers.

---

## The Mandate

**Stop expanding. Finish what's designed.**

Roughly 35% of designed systems are functional. Every sprint has added scope before completing
existing scope. This runway enforces a completion sprint. No new pantheons, no new bosses, no
new systems — only wiring and finishing work that is already designed in the docs.

The four things that would make the biggest feel difference right now:
1. Progressive disclosure (Item 0 above — do first, biggest UX impact)
2. Weapon damage type vs monster armor type (already coded, not called)
3. Monster flavor text (30 minutes of work, huge atmosphere gain)
4. Denatus fully wired (the Paragon ceremony is the culmination — it needs all 85 hooks)

---

## Task 1: Weapon Triangle in Combat Math

**Status:** BUG-032 / BUG-008 — OPEN
**Effort:** ~2 hours
**Files:** `src/stores/useCombatStore.ts`, `src/types/Weapon.ts`, `src/types/Monster.ts`

### What exists

`getDamageEffectiveness(damageType, armorType)` is fully implemented at `Weapon.ts:245-263`.
It returns a multiplier: 1.5 (strong), 1.0 (neutral), 0.75 / 0.5 (weak).

Monster armor type is on every `BaseMonster` as `armorType: MonsterArmorType` (`Monster.ts:88`).

Weapon damage types are on every `BaseWeapon` as `damageTypes: DamageType[]` (`Weapon.ts:70`).

### The gap

`playerAttack()` in `useCombatStore.ts:467-601` never calls `getDamageEffectiveness()`.
All weapons deal identical damage against all armor types.

### How to fix

In `playerAttack()`, after line 508 (where `baseAttackStat` is resolved), add:

```typescript
// ── 5b. Weapon Triangle effectiveness ──
const equippedWeapon = useCharacterStore.getState().character?.equipment.weapon;
const weaponDamageType = equippedWeapon?.base?.damageTypes?.[0]; // primary damage type
const monsterArmorType = monster.base.armorType;

let triangleMultiplier = 1.0;
if (weaponDamageType) {
  // Map MonsterArmorType variants not in getDamageEffectiveness to closest equivalent
  const normalizedArmor = monsterArmorType === 'plate' ? 'armor'
    : monsterArmorType === 'scales' ? 'leather'
    : monsterArmorType === 'ethereal' ? 'spirit'
    : monsterArmorType;
  triangleMultiplier = getDamageEffectiveness(weaponDamageType, normalizedArmor as any);
}
rawDamage *= triangleMultiplier;
```

Then in the log section (after line 542, where `addLogEntry` is called for the hit), add:

```typescript
if (triangleMultiplier > 1.1) {
  get().addLogEntry('Effective!', 'system');
} else if (triangleMultiplier < 0.9) {
  get().addLogEntry('Resisted.', 'system');
}
```

### Import to add at top of useCombatStore.ts

```typescript
import { getDamageEffectiveness } from '../types/Weapon';
```

### Verification

Start combat with a STR/Slash weapon against a Flesh monster (e.g., Goblin) — damage should
be visibly higher than against an Armored monster (e.g., Iron Golem). Check combat log for
"Effective!" and "Resisted." annotations.

### After completion

Update `BUGS.md`: BUG-032 → RESOLVED, BUG-008 → RESOLVED.

---

## Task 2: Monster Flavor Text at Encounter Entry

**Status:** Not implemented
**Effort:** ~1 hour
**Files:** New `src/data/monsters/monsterFlavor.ts`, `app/dungeon/encounter.tsx`

### What exists

`encounter.tsx` shows an `EnemyPreview` component at line 138-145. The monster object from
`useCombatStore().monster` has `monster.prefix` (MonsterPrefix | undefined) and
`monster.suffix` (MonsterSuffix | undefined). Each has a `.name` string field.

Prefix names: 'Weak', 'Young', 'Fierce', 'Armored', 'Elite', 'Ancient', 'Mythic'
Suffix names: 'of Flame', 'of Frost', 'of Venom', 'the Swift', 'the Undying'

### Step 1: Create `src/data/monsters/monsterFlavor.ts`

```typescript
export const PREFIX_FLAVOR: Record<string, string[]> = {
  'Weak':    ['Its movements are labored. Desperation is its own cruelty.'],
  'Young':   ['Raw and untested. The young have nothing to lose.'],
  'Fierce':  ['It scents blood before you enter the room.', 'The air thickens around it.'],
  'Armored': ['Your blade will have to find the joints.', 'A fortress of bone and plate.'],
  'Elite':   ['This one has survived a hundred like you.', 'Battle-hardened and patient.'],
  'Ancient': ['It remembers an age before the Tower was built.', 'Time has made it deliberate.'],
  'Mythic':  ['The air warps around it.', 'You feel the weight of a legend before you.'],
};

export const SUFFIX_FLAVOR: Record<string, string[]> = {
  'of Flame':    ['Heat rolls off it in waves.', 'The corridor smells of scorched stone.'],
  'of Frost':    ['Your breath mists in its presence.', 'Cold radiates from it like a second skin.'],
  'of Venom':    ['The floor around it is stained dark.', 'Something acidic hangs in the air.'],
  'the Swift':   ['It clocks your movements before you make them.', 'You blink — it has already shifted.'],
  'the Undying': ['It has died before. It is patient about doing it again.'],
};

export function getMonsterFlavorText(
  prefixName?: string,
  suffixName?: string
): string | null {
  const lines: string[] = [];
  if (prefixName && PREFIX_FLAVOR[prefixName]) {
    const pool = PREFIX_FLAVOR[prefixName];
    lines.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  if (suffixName && SUFFIX_FLAVOR[suffixName]) {
    const pool = SUFFIX_FLAVOR[suffixName];
    lines.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  if (lines.length === 0) return null;
  return lines.join(' ');
}
```

### Step 2: Wire into `encounter.tsx`

Import at top:
```typescript
import { getMonsterFlavorText } from '../../src/data/monsters/monsterFlavor';
```

Inside the component, after the `sneakChance` useMemo (around line 55):
```typescript
const flavorText = useMemo(() => {
  if (!monster) return null;
  return getMonsterFlavorText(monster.prefix?.name, monster.suffix?.name);
}, [monster]);
```

In the JSX, inside `previewContainer` after the `<EnemyPreview>` block (after line 145):
```tsx
{flavorText && (
  <Text style={styles.flavorText}>{flavorText}</Text>
)}
```

Add to StyleSheet:
```typescript
flavorText: {
  ...Typography.body,
  color: Colors.text.muted,
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: Spacing.md,
  paddingHorizontal: Padding.screen.horizontal,
},
```

### Verification

Enter an encounter with a prefixed/suffixed monster. Verify 1 italic sentence appears below
the monster card. Enter an encounter with a base monster — verify no flavor line, no crash.

---

## Task 3: Denatus Full Wiring (60 Remaining Hook Points)

**Status:** ~30% wired per CURRENT_SPRINT.md
**Effort:** 3-5 days
**Critical:** The Paragon ceremony is the culmination of the game. A title reflecting 30% of
events is a lie. Wire everything before calling Denatus "done."

### How the soul store works

```typescript
import { useSoulStore } from '../stores/useSoulStore';
useSoulStore.getState().incrementBehavement('id', amount);       // cumulative
useSoulStore.getState().setBehavementProgress('id', value);      // set absolute value
useSoulStore.getState().checkConsecutiveBehavement('id', bool);  // streak tracking
```

Behavement IDs are defined in `useSoulStore.ts` starting at line 31. IDs must match exactly.

### Already confirmed wired (do not re-add)

- `social_deity_favor_high` — `useDeityStore.adjustFavor()` when newFavor >= 80
- `resource_sell_items` — `app/town/guildhall/index.tsx` handleSellAll + handleSellOne
- `glory_no_death_floor5` — `app/dungeon/floor.tsx` floor 5 descent (BUG-028: add death-check guard)
- `glory_no_death_floor10` — `app/dungeon/floor.tsx` floor 10 descent (same guard needed)

### Hook points — `src/stores/useCombatStore.ts`

**On confirmed hit inside `playerAttack()` (after line 479):**
```typescript
const soulStore = useSoulStore.getState();
soulStore.incrementBehavement('phys_attacks_100', 1);
soulStore.incrementBehavement('phys_attacks_500', 1);
if (isCrit) {
  soulStore.incrementBehavement('phys_crits_25', 1);
  soulStore.incrementBehavement('phys_crits_100', 1);
}
const weaponCat = equippedWeaponCategory; // already resolved at line 505
if (weaponCat === 'AGI') soulStore.incrementBehavement('evade_dagger_kills', 1);
if (weaponCat === 'LCK') soulStore.incrementBehavement('risk_lck_weapon_use', 1);
if (weaponCat === 'INT' || weaponCat === 'WIS') {
  soulStore.incrementBehavement('magic_attacks_100', 1);
  soulStore.incrementBehavement('magic_attacks_500', 1);
}
if (currentHP / maxHP < 0.30) soulStore.incrementBehavement('risk_low_hp_attacks', 1);
```

**On kill inside `calculateRewards()` or `handleVictory()`:**
```typescript
const soulStore = useSoulStore.getState();
const weaponCat = useCharacterStore.getState().character?.equipment.weapon?.base?.category;
if (weaponCat && ['STR', 'AGI', 'PER', 'END'].includes(weaponCat)) {
  soulStore.incrementBehavement('phys_kills_50', 1);
  soulStore.incrementBehavement('phys_kills_200', 1);
}
if (weaponCat && ['INT', 'WIS', 'CHA'].includes(weaponCat)) {
  soulStore.incrementBehavement('magic_kills_50', 1);
  soulStore.incrementBehavement('magic_kills_200', 1);
}
const hpPct = currentHP / maxHP;
if (hpPct < 0.20) soulStore.incrementBehavement('tank_survive_low_hp', 1);
if (hpPct < 0.10) soulStore.incrementBehavement('risk_near_death_wins', 1);
if (monster.prefix?.tier === 'high' || monster.prefix?.tier === 'legendary')
  soulStore.incrementBehavement('risk_elite_fights', 1);
if (monster.base.category === 'boss') {
  soulStore.incrementBehavement('glory_boss_streak_3', 1);
  soulStore.incrementBehavement('glory_boss_streak_5', 1);
}
```

**On damage taken by player (monster attack resolution):**
```typescript
soulStore.incrementBehavement('tank_damage_taken_1000', damage);
soulStore.incrementBehavement('tank_damage_taken_5000', damage);
```

**On confirmed dodge:**
```typescript
soulStore.incrementBehavement('evade_dodges_50', 1);
soulStore.incrementBehavement('evade_dodges_200', 1);
soulStore.checkConsecutiveBehavement('evade_consecutive_dodges', true);
```

**On confirmed block:**
```typescript
soulStore.incrementBehavement('tank_blocks_50', 1);
soulStore.incrementBehavement('tank_blocks_200', 1);
```

**On heal (consumable or skill):**
```typescript
soulStore.incrementBehavement('tank_heal_received', healAmount);
```

**On taunt action:**
```typescript
soulStore.incrementBehavement('social_taunts', 1);
soulStore.incrementBehavement('social_taunts_100', 1);
```

### Hook points — `app/dungeon/room.tsx`

```typescript
// When observe action is used:
useSoulStore.getState().incrementBehavement('caution_observes', 1);
useSoulStore.getState().incrementBehavement('caution_observes_200', 1);

// When trap is triggered:
useSoulStore.getState().incrementBehavement('risk_trap_triggers', 1);

// When event room outcome resolves:
useSoulStore.getState().incrementBehavement('social_event_rooms', 1);
```

### Hook points — `app/dungeon/floor.tsx`

```typescript
// On every floor descent:
const soulStore = useSoulStore.getState();
soulStore.setBehavementProgress('explore_floors_10', currentFloor);
soulStore.setBehavementProgress('explore_floors_25', currentFloor);
// Fix BUG-028: add guard to existing glory_no_death calls:
// if (runStats.deaths === 0) { ... fire glory_no_death_floor5/10 }

// On room count increment:
soulStore.incrementBehavement('explore_rooms_100', 1);
soulStore.incrementBehavement('explore_rooms_500', 1);
```

### Hook points — `src/stores/useCharacterStore.ts`

```typescript
// Gold gain:
useSoulStore.getState().incrementBehavement('resource_gold_1000', amount);
useSoulStore.getState().incrementBehavement('resource_gold_10000', amount);

// Item pickup:
useSoulStore.getState().incrementBehavement('resource_items_50', 1);

// Weapon equip:
useSoulStore.getState().incrementBehavement('resource_weapons_equip', 1);

// Stat proficiency gain (route by stat name):
const proficiencyHooks: Record<string, string> = {
  STR: 'resource_str_growth', AGI: 'evade_agi_growth', END: 'tank_end_growth',
  WIS: 'caution_wis_growth',  CHA: 'social_cha_growth', PER: 'explore_per_growth',
};
if (proficiencyHooks[stat]) useSoulStore.getState().incrementBehavement(proficiencyHooks[stat], amount);

// Consumable use:
useSoulStore.getState().incrementBehavement('caution_consumable_use', 1);

// In performLevelUp() — achievement tier tracking:
if (tier === 'LEGENDARY') soulStore.incrementBehavement('glory_legendary_achievement', 1);
if (tier === 'MYTHIC')    soulStore.incrementBehavement('glory_mythic_achievement', 1);
if (newLevel === 10)      soulStore.incrementBehavement('glory_level_10', 10);
```

### Hook points — `app/town/` screens

```typescript
// Any shop screen on mount (useEffect):
useSoulStore.getState().incrementBehavement('social_shop_visits', 1);

// Shrine/blessing-rite on blessing received:
useSoulStore.getState().incrementBehavement('social_shrine_visits', 1);
```

### Verification

Play a melee build through 5 floors. Log `useSoulStore.getState().getOverallScore()` — should
read >40% (was 30%). Log `useSoulStore.getState().getDominantVector()` — should return
`'COMBAT_PHYSICAL'` for a melee-only character.

---

## Task 4: Job System Combat Integration Audit

**Status:** PARTIAL
**Effort:** 1-2 days
**Files:** `src/stores/useJobStore.ts:62`, `src/types/Skill.ts`, `app/dungeon/combat.tsx`, `src/data/jobs/`

### Known issue

`useJobStore.ts:62` has `learnSkill(starterSkill as any)`. The `as any` cast hides a type
mismatch between `Skill` and `LearnedSkill` interfaces.

### Steps

1. Read `src/types/Skill.ts` — find every required field on `LearnedSkill` that is missing
   from the `starterSkill` object built at `useJobStore.ts:52-62`.
2. Add missing fields explicitly so the cast is unnecessary, then remove `as any`.
3. Read `app/dungeon/combat.tsx` — find the combat skill menu section. Confirm it reads from
   `character.skills` and that the starter skill renders.
4. Confirm the SP cost formula for skill execution uses the job's declared scaling stat, not
   a hardcoded `physicalAttack`.
5. Read `src/data/jobs/` — test all 8 base job starter skills through the Level 2 flow.

### Verification

New character → Level 2 → select Warrior → open combat skill menu → starter skill visible →
use it → SP consumed → damage reflects STR scaling.

---

## Task 5: Armor Slot Decision (BUG-031)

**Status:** Needs decision before coding
**File:** `app/dungeon/inventory.tsx` — `handleSlotPress` gated with `if (slot === 'weapon')`

**Ask the user before touching this:**

- **Option A — Hide dead slots:** Remove head/chest/hands/legs from equipment display or show
  `[Phase 3]` placeholder. ~1 hour. Correct choice if armor data won't land soon.
- **Option B — Implement armor system:** New `src/data/armor/` files, loot pool entries, equip
  logic in `useCharacterStore`. ~1-2 week sprint.

Dead tappable slots that do nothing erode trust. Pick one and execute.

---

## Task 6: Item Drop / Destroy

**Status:** OPEN — Phase 1.8 checkbox unchecked in PROGRESS.md
**Effort:** ~1 day
**Files:** `app/dungeon/inventory.tsx`, `src/stores/useCharacterStore.ts`

### Steps

1. Add long-press or swipe gesture on inventory items to reveal a "Destroy" action.
2. Confirmation modal: "This item will be lost forever. The Tower keeps what the Tower takes."
3. Add `destroyItem(itemId: string)` to `useCharacterStore` — filters `character.inventory`.
4. Confirm `BAG_CAPACITY` check works correctly after destroy.

### Why it matters

Without destroy, inventory caps at 16 and forces an unwanted town return. This breaks the
core "push deeper for better loot" loop.

---

## Open Decisions (Ask User — Do NOT Code Until Answered)

| ID | Question | Options |
|----|----------|---------|
| BUG-026 | Soul data is global across all runs. Boss dialogue reads the wrong character's soul. | (A) Reset soul on run start. (B) Snapshot + delta tracking. (C) Accept as intentional identity depth. Eris decides. |
| BUG-027 | "+X GLORY" shown in level-up ceremony never feeds `useSoulStore`. Misleading UI. | (A) Wire to `incrementBehavement('glory_*')`. (B) Rename label to "GLORY BONUS". (C) Remove. Valdris decides. |
| ARMOR | Dead inventory slots (BUG-031). | See Task 5 above. Korben decides. |
| COMBAT_LOG | Code keeps 20 log entries. Docs say 8. | Update docs to match code (20 is better). |

---

## Do NOT Build (Explicitly Deferred)

If a future session suggests starting any of these, redirect to the task list above first.

| Item | Reason Deferred |
|------|----------------|
| Bosses 6-20 (floors 30-100) | Combat loop must be tactically interesting before adding more bosses |
| Discovery System (Phase 2.3) | Requires NPC systems — Phase 3 scope |
| God Challenges (Phase 2.4) | Requires deity rejection + shrine triggers + challenge UI |
| 7 more pantheons | 170 deities already exceeds player encounter capacity in a lifetime |
| 150+ monster bestiary | 36 + weapon triangle > 150 without it |
| Audio assets | Infrastructure ready; source files when budget allows |
| Advanced Job Specializations (Level 5 branch) | Level 2 integration not verified yet |
| Biome-Pantheon monster associations | Needs monster count to be sufficient first |
| Witness Skill System | Next Phase 2 item after this list is cleared |
| NPC Keyword Dialogue | Phase 3 — requires NPC architecture |

---

## Key Architecture Facts

### The one rule about combat store

`useCombatStore` is NOT persisted. Never add `persist` middleware to it. Combat state resets
if app is killed mid-fight. This is by design. Do not change this.

### Cross-store calls (imperative pattern)

```typescript
// Inside any store action or anywhere outside React:
useCharacterStore.getState().someAction();
useSoulStore.getState().incrementBehavement('id', 1);
```

### Weapon field paths

```typescript
character.equipment.weapon                       // Weapon | null
character.equipment.weapon?.base                 // BaseWeapon
character.equipment.weapon?.base.category        // WeaponCategory ('STR' | 'AGI' | ...)
character.equipment.weapon?.base.damageTypes     // DamageType[] — use [0] for primary
character.equipment.weapon?.base.damageTypes[0]  // 'slash' | 'pierce' | 'blunt' | 'magic' | ...
```

### Monster field paths (in combat)

```typescript
monster.base.armorType   // MonsterArmorType
monster.base.weaknesses  // DamageType[]
monster.base.category    // 'beast' | 'undead' | 'demon' | 'humanoid' | 'elemental' | 'boss'
monster.prefix?.name     // 'Fierce' | 'Elite' | 'Ancient' | ... | undefined
monster.suffix?.name     // 'of Flame' | 'the Undying' | ... | undefined
monster.prefix?.tier     // 'negative' | 'low' | 'mid' | 'high' | 'legendary'
```

### Weapon triangle function signature

```typescript
// src/types/Weapon.ts:245
import { getDamageEffectiveness } from '../types/Weapon';
// signature: (damageType: DamageType, armorType: 'flesh'|'leather'|'bone'|'armor'|'spirit'|'magic_resistant') => number
// IMPORTANT: MonsterArmorType has 3 extra values not in the function parameter:
//   plate → map to 'armor'
//   scales → map to 'leather'
//   ethereal → map to 'spirit'
```

### Style constants (always use these — never hardcode)

```typescript
Spacing.sm / Spacing.md / Spacing.lg / Spacing.xl   // layout gaps
Padding.screen.horizontal                            // screen edge padding
BorderRadius.md / BorderRadius.lg                    // corner radius
BorderWidth.thin                                     // border width
Colors.text.muted                                    // secondary / flavor text color
Colors.text.secondary                                // body text
Colors.background.primary / .secondary / .tertiary  // bg layers
Typography.body / Typography.caption / Typography.label / Typography.button
```

### Complete Behavement ID Reference (from `useSoulStore.ts:31`)

```
COMBAT_PHYSICAL:  phys_attacks_100, phys_attacks_500, phys_kills_50, phys_kills_200,
                  phys_crits_25, phys_crits_100, phys_overkill_10, phys_boss_melee,
                  phys_str_weapon_kills, phys_consecutive_kills

COMBAT_MAGIC:     magic_attacks_100, magic_attacks_500, magic_kills_50, magic_kills_200,
                  magic_sp_spent_1000, magic_int_weapon_kills, magic_wis_weapon_kills,
                  magic_status_kills, magic_boss_spell, magic_no_physical

DEFENSE_TANK:     tank_blocks_50, tank_blocks_200, tank_damage_taken_1000, tank_damage_taken_5000,
                  tank_survive_low_hp, tank_end_growth, tank_no_flee, tank_shield_kills,
                  tank_heal_received, tank_boss_no_death

DEFENSE_EVASION:  evade_dodges_50, evade_dodges_200, evade_flees_10, evade_flees_50,
                  evade_agi_growth, evade_no_damage_fight, evade_dagger_kills, evade_lucky_dodges,
                  evade_consecutive_dodges, evade_boss_no_hit

RISK_TAKING:      risk_low_hp_attacks, risk_no_heal_floor, risk_boss_rush, risk_trap_triggers,
                  risk_elite_fights, risk_lck_weapon_use, risk_near_death_wins, risk_no_observe

CAUTION:          caution_observes, caution_observes_200, caution_rest_sites, caution_full_hp_fights,
                  caution_consumable_use, caution_wis_growth, caution_no_traps, caution_heal_before_boss

SOCIAL:           social_taunts, social_taunts_100, social_cha_growth, social_cha_weapon_kills,
                  social_shop_visits, social_shrine_visits, social_deity_favor_high, social_event_rooms

EXPLORATION:      explore_rooms_100, explore_rooms_500, explore_floors_10, explore_floors_25,
                  explore_treasure_rooms, explore_per_growth, explore_per_weapon_kills, explore_secret_rooms

RESOURCE:         resource_gold_1000, resource_gold_10000, resource_items_50, resource_weapons_equip,
                  resource_sell_items, resource_materials_collect, resource_legendary_find, resource_str_growth

GLORY:            glory_no_death_floor5, glory_no_death_floor10, glory_boss_streak_3, glory_boss_streak_5,
                  glory_legendary_achievement, glory_mythic_achievement, glory_perfect_floor,
                  glory_challenge_complete, glory_all_stats_c, glory_level_10
```

---

## Execution Order

```
[ ] Item 0: Progressive Disclosure             (1-2d)  tutorial trim + 4 first-use overlays
[ ] Task 1: Weapon Triangle in combat math     (~2h)   useCombatStore.ts:504-509
[ ] Task 2: Monster Flavor Text                (~1h)   new monsterFlavor.ts + encounter.tsx:138
[ ] Task 3: Denatus full wiring               (3-5d)  combat + floor + room + character stores
[ ] Task 4: Job combat integration audit       (1-2d)  useJobStore.ts:62 + combat.tsx skill menu
[ ] DECISION: Armor slots — hide or build      (ask)   inventory.tsx BUG-031
[ ] Task 5: Item drop/destroy                  (~1d)   inventory.tsx + useCharacterStore
[ ] DECISION: BUG-026 soul cross-run           (ask)   Eris decides
[ ] DECISION: BUG-027 GLORY UI orphan          (ask)   Valdris decides
```

*The Tower Awaits. Finish what you started.*
