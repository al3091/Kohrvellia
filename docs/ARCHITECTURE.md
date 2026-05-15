# KOHRVELLIA — Technical Architecture

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.
> See [CLAUDE.md](../CLAUDE.md) for the full operating manual including persona definitions.

---

## Data Flow Overview

The architecture follows a unidirectional data flow. State lives in Zustand stores, screens consume it via hooks, components render it.

```
AsyncStorage (on-disk persistence)
    ↕  (Zustand persist middleware — read on mount, write on change)
Zustand Stores (runtime source of truth)
    ↕  (React hooks — useCombatStore(), useCharacterStore(), etc.)
Expo Router Screens (app/ directory)
    ↕  (props + callbacks)
Components (src/components/)
```

**Write path**: User action → Screen callback → Store action → State update → Re-render

**Read path**: Store selector → Screen hook → Prop → Component display

---

## Store Dependency Map

Stores are listed in initialization order (bottom = most depended upon).

```
useGameStore ──────────────────────────────────── meta state
    └── depends on: useSoulStore (calls initializeDenatus on tutorial complete)

useCharacterStore ─────────────────────────────── character entity
    └── depends on: useAchievementStore (calls updateProgress on commitExcelia grade-ups)
    └── depends on: useShopStore (lazy require — calls resetReputation on createCharacter)

useCombatStore ────────────────────────────────── ephemeral combat (NOT persisted)
    └── depends on: useGameStore (recordMonsterEncounter, addMonsterObservation, hasHadFirstCombat)
    └── depends on: useCharacterStore (getEffectiveStats for LCK loot bonus)

useAchievementStore ───────────────────────────── achievement tracking
    └── depends on: (none — consumed by others)

useDeityStore ─────────────────────────────────── deity data and favor
    └── depends on: (none — consumed by others)

useSoulStore ──────────────────────────────────── behavement tracking
    └── depends on: (none — consumed by others)

useDungeonStore ───────────────────────────────── active run state
    └── depends on: (none — consumed by others)

useJobStore ───────────────────────────────────── job selection
    └── depends on: useCharacterStore (lazy — calls learnSkill on selectJob)

useInventoryStore ─────────────────────────────── stash management
    └── depends on: (none — consumed by others)

useShopStore ──────────────────────────────────── shop state
    └── depends on: (none — consumed by others)

useBlacksmithStore ────────────────────────────── crafting state
    └── depends on: (none — consumed by others)

useSoundStore ─────────────────────────────────── audio (NOT persisted)
    └── depends on: (none — consumed by others)
```

**Circular dependency prevention**: `useCharacterStore` uses a lazy `require()` to access `useShopStore`, breaking the circular dependency at the module level. `useJobStore` does the same for `useCharacterStore`. Do NOT change this pattern without understanding the React module initialization order implications.

---

## Screen → Store Mapping

Which stores each screen reads from. Screens only listed once; child routes share parent layout stores.

| Screen | Stores Read | Notes |
|--------|-------------|-------|
| `app/index.tsx` | useGameStore, useCharacterStore, useDungeonStore | Title screen state machine |
| `app/character-creation/name.tsx` | useGameStore | Tutorial check only |
| `app/character-creation/backstory.tsx` | — | Local state only |
| `app/character-creation/stats.tsx` | — | Local state only |
| `app/character-creation/deity/index.tsx` | useDeityStore, useGameStore | Pantheon browser |
| `app/character-creation/deity/[pantheonId].tsx` | useDeityStore | Filtered deity list |
| `app/character-creation/deity/compare.tsx` | useDeityStore | Comparison tool |
| `app/character-creation/confirm.tsx` | useCharacterStore, useDeityStore | Character creation final step |
| `app/tutorial/*` | useGameStore | Tutorial progression |
| `app/town/index.tsx` | useCharacterStore, useDungeonStore, useDeityStore | Town hub |
| `app/town/familia/index.tsx` | useCharacterStore, useDeityStore | Deity greeting + favor |
| `app/town/familia/blessing-rite.tsx` | useCharacterStore, useDeityStore | Excelia commitment ceremony |
| `app/town/character/index.tsx` | useCharacterStore, useDeityStore, useJobStore | Character sheet |
| `app/town/guildhall/index.tsx` | useCharacterStore, useAchievementStore | Guild board |
| `app/town/inventory/index.tsx` | useCharacterStore | Full inventory management |
| `app/town/blacksmith/*` | useCharacterStore, useBlacksmithStore | Crafting screens |
| `app/town/shops/*` | useCharacterStore, useShopStore | Shop screens |
| `app/dungeon/floor.tsx` | useDungeonStore, useCharacterStore | Floor map |
| `app/dungeon/room.tsx` | useDungeonStore, useCharacterStore, useCombatStore | Room entry |
| `app/dungeon/encounter.tsx` | useCombatStore, useCharacterStore | Monster preview |
| `app/dungeon/combat.tsx` | useCombatStore, useCharacterStore, useDungeonStore, useAchievementStore, useSoulStore, useDeityStore | Full combat |
| `app/dungeon/level-up.tsx` | useCharacterStore, useAchievementStore, useDeityStore | Level ceremony |
| `app/dungeon/job-select.tsx` | useJobStore, useCharacterStore | Job selection |
| `app/dungeon/denatus.tsx` | useSoulStore, useCharacterStore | Paragon soul ceremony |
| `app/dungeon/inventory.tsx` | useCharacterStore | In-dungeon bag access |
| `app/dungeon/epitaph.tsx` | useCharacterStore, useGameStore | Death screen |
| `app/codex/index.tsx` | useGameStore | Monster knowledge codex |
| `app/settings/index.tsx` | useGameStore | Settings |

---

## Component Organization

```
src/components/
├── ui/                    Generic, reusable across any screen
│   ├── Button.tsx         Primary action button with haptic feedback
│   ├── Card.tsx           Content card container
│   ├── Header.tsx         Screen title header
│   ├── ProgressBar.tsx    HP/SP/favor bars with animated transitions
│   ├── ProgressIndicator.tsx  Step indicators for multi-step flows
│   └── CeremonialDivider.tsx  Decorative section divider (gothic aesthetic)
│
├── combat/                Combat-screen-specific components
│   ├── MonsterDisplay.tsx     Monster icon + HP bar + shake/pulse animations
│   ├── FloatingDamage.tsx     Animated damage number popups
│   ├── NarrativeLog.tsx       Scrolling combat log (last 20 entries)
│   ├── TurnOrderTimeline.tsx  Visual turn order indicator (Kairos Protocol)
│   └── EnemyPreview.tsx       Monster stat preview (pre-combat encounter screen)
│
├── character-creation/    Used only in character creation flow
│   ├── DeityCard.tsx          Full deity display with domain icon + stats
│   ├── DeitySearchBar.tsx     Cross-pantheon search input
│   ├── DeityFilters.tsx       Domain/stat/personality filter chips
│   ├── DeityComparison.tsx    Side-by-side deity comparison (up to 3)
│   ├── PantheonCard.tsx       Pantheon browse card with match count
│   └── BackstoryCard.tsx      Backstory option card with stat preview
│
└── text/                  Narrative and atmospheric text components
    └── DramaticReveal.tsx     Staged text reveal animation (used in ceremonies)
```

**Rule**: If a component is used in only one screen, consider keeping it in that screen file as a local component. Extract to `src/components/` only when reused in 2+ screens.

---

## Critical Data Paths

### 1. Combat Resolution (Most Complex Path)

```
User taps action button (combat.tsx)
    → stagePrimary() / stageBonus() in useCombatStore
    → User taps "Invoke" / confirm
    → invokeKairos() — rolls initiative, determines turn order
    → phase transitions: 'player_plan' → 'resolve_queue'
    → combat.tsx executes staged actions in turn order:
        Player action: playerAttack() / playerDefend() / playerFlee() etc.
            → damageMonster() — updates monster.currentHP
            → if killed: setPhase('victory') + calculateRewards()
        Enemy action: enemyTurn()
            → onDamage callback → useCharacterStore.modifyHP()
            → if HP ≤ 0: character.isDead = true
    → nextTurn() — increments turn, clears staged actions
    → processPassiveEffects() — END regen, WIS divine shield, status ticks
    → Soul tracking: useSoulStore.recordBehavement() at key moments
```

**Performance note**: `playerAttack()` calls `useCharacterStore.getState()` once to read weapon category. This is acceptable — avoid calling `getState()` inside tight loops.

### 2. Excelia Commitment (Falna Growth Path)

```
During dungeon run:
    Combat actions → useCombatStore.playerAttack() etc.
        → useCharacterStore.addPendingExcelia(stat, amount)
        → character.pendingExcelia.stats[stat] += amount
        → HIDDEN from player — not displayed anywhere during run

Player returns to town → Familia Home
    → Blessing Rite ceremony triggered (app/town/familia/blessing-rite.tsx)
    → useCharacterStore.commitExcelia()
        → Reads pendingExcelia.stats
        → For each stat: newPoints = min(999, currentPoints + pendingAmount)
        → Detects grade-ups → calls useAchievementStore.updateProgress('stat_reach', gradeIndex)
        → Clears pendingExcelia (set to null)
        → Returns { statsGained, gradeUps } for ceremony display

Player dies before Blessing Rite:
    → useCharacterStore.discardExcelia() — pending stats are LOST
    → This is intentional and core to the design (DanMachi-faithful)
```

### 3. Level-Up Path

```
Achievement condition met in dungeon (e.g., reaching Floor 5):
    → useAchievementStore.updateProgress(achievementId, value)
    → If threshold met: achievement.status = 'completed'
    → useCharacterStore.addAchievementProgress(progress)

Player completes a run, returns to town, visits Guild Hall:
    → useCharacterStore.canLevelUp() checks:
        1. All 8 stats at Grade D (500+ points)
        2. At least one achievement completed
        3. Deity approval flag set
    → If true: navigate to /dungeon/level-up (ceremony)

Level-up ceremony (dungeon/level-up.tsx):
    → Deity approval message displayed
    → useCharacterStore.performLevelUp()
        → commitExcelia() if pending (auto-commit safety net)
        → Saves current stat points to levelHistory (permanent carry)
        → Resets all stats to Grade I (points = 0)
        → Increments level
        → Recomputes maxHP/maxSP
    → If Level 2: navigate to /dungeon/job-select
    → If Level 10: navigate to /dungeon/denatus (Paragon)
```

### 4. Death and New Game Path

```
Player HP reaches 0 in combat:
    → enemyTurn() callback: useCharacterStore.modifyHP(-damage)
    → modifyHP sets isDead = true when HP ≤ 0
    → useCombatStore.setPhase('defeat')
    → combat.tsx detects phase 'defeat' → navigate to /dungeon/epitaph

Epitaph screen:
    → Displays run summary (deepest floor, monsters killed, cause of death)
    → useGameStore.recordRunEnd(runRecord)
    → useCharacterStore.killCharacter() (redundant safety — already isDead)
    → Player taps "Return to the Surface" → navigate to /

New game from title screen:
    → Alert: "A Life Abandoned" confirmation if active save exists
    → clearAllStores():
        - useCharacterStore.deleteCharacter()      → character = null
        - useDungeonStore.getState().clearAllData() → run state cleared
        - useAchievementStore.getState().resetAllProgress() → achievements reset
        - clearWeaponRegistry()                     → weapon instance IDs reset
    ⚠️  KNOWN GAP: useJobStore, useSoulStore, useDeityStore NOT reset here
    → Navigate to /tutorial or /character-creation/name
```

---

## Save System

### What Is Persisted (AsyncStorage)

| Store | AsyncStorage Key | Contents |
|-------|-----------------|----------|
| useGameStore | `kohrvellia-game` | Settings, run history, tutorial state, monster knowledge, total deaths/runs |
| useCharacterStore | `kohrvellia-character` | Full character entity including stats, equipment, inventory, pending excelia |
| useDungeonStore | `kohrvellia-dungeon` | Active run state: floor, room map, visited rooms, floor history |
| useAchievementStore | `kohrvellia-achievements` | Achievement progress, discovery states |
| useDeityStore | `kohrvellia-deity` | Selected deity, favor tracking |
| useSoulStore | `kohrvellia-soul` | Behavement tracking, Denatus title |
| useJobStore | `kohrvellia-job` | Selected job ID |
| useShopStore | `kohrvellia-shop` | Shop reputation, stock |
| useBlacksmithStore | `kohrvellia-blacksmith` | Crafting state |
| useInventoryStore | *(check store definition)* | Stash management |

### What Is Ephemeral (NOT Persisted, Lost on App Close)

- `useCombatStore` — entire combat state. If app closes mid-combat, player re-enters the room.
- `useSoundStore` — audio playback state. BGM restarts on app re-open.
- All local React component state.
- Damage popup animations, screen flash animations.

### Save Integrity Rules

1. **Never mutate persisted state outside of store actions**. Use store actions only — never call `set()` directly from a screen.

2. **Legacy migration**: `useCharacterStore` handles missing fields on old saves with `?? defaultValue` patterns. When adding new fields to Character, always provide a fallback in functions that read it.

3. **Weapon registry** (`src/data/weaponRegistry.ts`) tracks all generated weapon instance IDs to prevent duplicate IDs across a run. It is cleared on new game but NOT persisted — weapon IDs in existing saves may clash if the registry is not rebuilt on load. This is a known risk.

---

## AsyncStorage Performance Notes

- All stores use `createJSONStorage(() => AsyncStorage)` from Zustand — serialization is automatic.
- AsyncStorage is asynchronous but Zustand hydrates synchronously from its in-memory state. The `persist` middleware handles the async bridging.
- **Vega says**: Avoid reading from AsyncStorage directly anywhere outside Zustand. All reads should go through store selectors, not `AsyncStorage.getItem()`.
- Large saves (character with full inventory + achievement progress + dungeon map) should stay well under AsyncStorage's effective limit (~6MB on most platforms), but monitor if dungeon floor maps grow significantly.

---

## TypeScript Patterns

### Store Pattern (Standard)

```typescript
// All stores follow this pattern:
export const useMyStore = create<MyState>()(
  persist(
    (set, get) => ({
      // state
      // actions
    }),
    {
      name: 'kohrvellia-my-store-key',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Computed Values Pattern

Heavy computations (derived stats, effective stats) are implemented as store methods, not inline in components:

```typescript
// In store:
getEffectiveStats: () => { ... }  // Computed from character.stats + levelHistory

// In component:
const effectiveStats = useCharacterStore(s => s.getEffectiveStats());
// NOT: compute inline in render
```

### Lazy Import Pattern (Circular Dependency Prevention)

```typescript
// In useCharacterStore.createCharacter():
(require('./useShopStore') as typeof import('./useShopStore'))
  .useShopStore.getState().resetReputation();
```

This is intentional and must not be changed to a top-level import.

---

*The Tower Awaits.*
