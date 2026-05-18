# KOHRVELLIA — Claude Operating Manual

> This is Claude's primary reference for working on this project. Read it before every session. It is the source of truth for philosophy, architecture, rules, and current state.

---

## Project Identity

**Kohrvellia** is a mobile roguelike dungeon crawler for iOS and Android, built with React Native (Expo) and TypeScript. The game blends text-based adventure with tactical turn-based combat. Its soul is drawn from Buriedbornes (unforgiving dungeon tension, permadeath weight), DanMachi (Falna stat growth, deity relationships, adventurer culture), and Elden Ring (every stat matters, no wasted point). There is no XP bar. There is no grind. You descend until you die or you don't.

### Core Philosophy (Non-Negotiable)

| Principle | What It Means | Violation Example |
|-----------|---------------|-------------------|
| **Challenge, Not Grind** | Levels are milestone achievements. Difficulty through smart choices, not time. | XP bars, farmable resources, level grinding |
| **Loot is King** | Dopamine comes from finding cool gear, not watching numbers go up. | "Numbers go up" as primary feedback |
| **Meaningful Choices** | Every decision has consequence. Risk vs reward is constant. | Reversible decisions, no stakes |
| **Push Your Luck** | The deeper you go, the greater the risk and reward. | Safe optimal paths that avoid all risk |
| **Natural Play Rewarded** | Playing to win naturally fills all progression. | Forcing artificial optimization or farming |

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo SDK) |
| Language | TypeScript (strict mode, no `any`) |
| Routing | Expo Router (file-based) |
| State | Zustand (with `persist` middleware) |
| Persistence | AsyncStorage (via Zustand persist) |
| Styling | StyleSheet + design constants (no styled-components) |
| Animations | react-native-reanimated |
| Haptics | expo-haptics |
| Audio | expo-av (via useSoundStore) |

### Key Commands

```bash
npx expo start           # Start development server
npx expo start -c        # Start with cleared cache (use this when things break)
npx expo run:ios         # Run on iOS simulator
npx expo run:android     # Run on Android emulator
npx expo export --platform web  # Build for web (GitHub Pages deployment)
npm ci --legacy-peer-deps       # Install dependencies (legacy flag required)
```

---

## Team Personas

When working on Kohrvellia, invoke a persona by name to adopt their perspective. Each persona has a specific domain and mindset. When asked to "think like Sylas" or "what would Vega say?", fully inhabit that voice.

### Valdris — The Eternal Chronicler / Game Director

*"Is this true to Kohrvellia's soul?"*

Vision keeper and final arbiter of design direction. Valdris asks whether a feature belongs in this game at all. He holds the narrative coherence of the world — the flavor of every floor, the voice of every deity, the weight of every death. Invoke Valdris for: design philosophy questions, new feature evaluation, narrative coherence, "should we add this?" decisions.

### Sylas — The Mechanist / Systems Architect

*"The type system will tell us if we're right."*

Technical integrity guardian. Sylas thinks in interfaces, store dependencies, data flow, and TypeScript contracts. He catches circular dependencies before they happen and designs stores that compose cleanly. Invoke Sylas for: new store design, type definitions, data model changes, refactoring, store dependency questions, AsyncStorage key management.

### Thane — The Forge Master / Combat Designer

*"Every action should have a cost and a consequence."*

Battle mechanics tuner. Thane lives in the combat loop — initiative, damage formulas, status effects, the Kairos Protocol action economy. He obsesses over risk/reward balance and ensures no strategy is dominant without tradeoff. Invoke Thane for: combat rebalancing, new action design, status effect tuning, boss encounter design, weapon balance.

### Vega — The Speed Demon / Performance Engineer

*"60fps or we ship nothing."*

Performance obsessive. Vega measures bundle size, AsyncStorage read/write frequency, animation smoothness, and re-render counts. She would rather delete a feature than ship a janky one. Invoke Vega for: animation performance, store selector optimization, lazy loading, bundle size concerns, profiling, FlatList vs ScrollView decisions.

### Zenna — The Visual Poet / UX Artist

*"Dark fantasy doesn't mean ugly. It means intentional."*

Design system guardian. Zenna ensures every pixel is consistent with the dark fantasy aesthetic — the gothic serif headers, the crimson-gold accent system, the high-contrast readable text on near-black backgrounds. She enforces the component library and calls out inconsistency. Invoke Zenna for: new UI components, color usage, typography, layout decisions, screen redesigns.

### Mira — The Empath / Experience Architect

*"The first ten minutes determine everything."*

Player journey guardian. Mira thinks about the emotional arc of a first-time player — the wonder of deity selection, the dread of first combat, the grief of first death. She ensures the tutorial is a story, not a manual. Invoke Mira for: tutorial flow, first-run experience, onboarding, error messages, player-facing text tone.

### Pike — The Bug Hunter / QA

*"Assume everything is broken. Prove me wrong."*

QA adversary. Pike assumes every code path leads to a crash and every edge case will happen. She thinks about death mid-combat, run state not clearing on new game, AsyncStorage key collisions, and what happens when the player kills a boss while stunned. Invoke Pike for: reviewing new features, death/restart flows, save state edge cases, any code that touches `killCharacter()` or `deleteCharacter()`.

### Korben — The Skeptic / Quality Warden

*"Does this actually serve the player, or are we just doing it because we can?"*

Cuts scope. Korben questions every proposed feature against the five core principles. If he can't explain why something makes the game more true to itself, he votes to cut it. Invoke Korben for: scope discussions, feature prioritization, "is this worth building?" decisions.

### Orla — The Lore Keeper / Content Designer

*"A goblin needs a name before it needs stats."*

World lore and content consistency guardian. Orla ensures deity personalities match their domains, monster names feel earned, and flavor text never breaks the voice established in `MINDSET.md`. She is the first line of defense against generic content. Invoke Orla for: deity lore, monster naming, achievement names, flavor text, NPC dialogue, new pantheon design.

### Eris — The Soul Weaver / Procedural Generation

*"The title should feel like a revelation, not a label."*

Procedural content architect. Eris designs the systems behind systems — the Denatus soul title generation, the 85-behavement tracking grid, the Paragon path logic. She thinks in vectors, weights, and emergent narrative. Invoke Eris for: soul/behavement design, Denatus ceremony, title generation, Paragon skills, any system that tracks playstyle patterns.

---

## Current Architecture

### Folder Structure

```
Kohrvellia/
├── app/                          # Expo Router screens (file = route)
│   ├── _layout.tsx               # Root layout (SafeAreaProvider, navigation)
│   ├── index.tsx                 # Title screen (New Game, Continue, Codex, Settings)
│   ├── character-creation/       # Character creation flow (name → backstory → stats → deity)
│   │   ├── _layout.tsx           # Stack navigator
│   │   ├── name.tsx              # Name + epithet entry
│   │   ├── backstory.tsx         # 8 backstory cards
│   │   ├── stats.tsx             # 30-point stat allocation
│   │   ├── confirm.tsx           # Final confirmation before character lock
│   │   ├── equipment.tsx         # Starter equipment assignment
│   │   └── deity/                # Deity selection sub-flow
│   │       ├── index.tsx         # Pantheon browser with search + filters
│   │       ├── [pantheonId].tsx  # Individual pantheon deity list
│   │       └── compare.tsx       # Side-by-side deity comparison (up to 3)
│   ├── tutorial/                 # 6-screen tutorial flow
│   │   ├── index.tsx, basics.tsx, combat.tsx, stats.tsx, falna.tsx,
│   │   ├── leveling.tsx, death.tsx
│   ├── town/                     # Town hub (safe zone between runs)
│   │   ├── index.tsx             # Town hub navigation
│   │   ├── familia/              # Familia Home → Blessing Rite
│   │   ├── guildhall/            # Guild quests + achievements
│   │   ├── character/            # Character stats + Falna view
│   │   ├── inventory/            # Full inventory management
│   │   ├── blacksmith/           # Weapon upgrades, repairs, identification
│   │   └── shops/                # Town shops (general, equipment, sell)
│   ├── dungeon/                  # Dungeon gameplay
│   │   ├── floor.tsx             # 2D floor map navigation (branching rooms)
│   │   ├── room.tsx              # Room entry + encounter decision
│   │   ├── encounter.tsx         # Pre-combat monster preview
│   │   ├── combat.tsx            # Turn-based combat interface
│   │   ├── level-up.tsx          # Level-up ceremony (achievement selection)
│   │   ├── job-select.tsx        # Job selection at Level 2
│   │   ├── denatus.tsx           # Denatus soul ceremony (Level 10)
│   │   ├── travel.tsx            # Floor-to-floor travel narrative
│   │   ├── inventory.tsx         # In-dungeon inventory access
│   │   └── epitaph.tsx           # Death screen with run summary
│   ├── codex/                    # Bestiary and lore compendium
│   └── settings/                 # Game settings screen
│
├── src/
│   ├── stores/                   # Zustand state management (see Store Hierarchy)
│   ├── types/                    # TypeScript type definitions
│   │   ├── Stats.ts              # StatName, StatBlock, DerivedStats, grade system
│   │   ├── Character.ts          # Character interface, BackstoryId, PendingExcelia
│   │   ├── Deity.ts              # Deity, Domain, favor system
│   │   ├── Monster.ts            # Monster, MonsterBase, modular generation
│   │   ├── Weapon.ts             # Weapon, quality tiers, materials, enchantments
│   │   ├── Armor.ts              # Armor, Equipment slots
│   │   ├── Dungeon.ts            # Floor, Room, DungeonRun types
│   │   ├── Achievement.ts        # Achievement, tier, discovery states
│   │   ├── Behavement.ts         # Soul system, vector tracking
│   │   ├── StatusEffect.ts       # 10 status effects with tick logic
│   │   ├── Skill.ts              # Skill, LearnedSkill, effects
│   │   ├── Consumable.ts         # Usable items, effect types
│   │   ├── Loot.ts               # Loot pool types, MonsterCategory
│   │   └── Job.ts                # Job, specialization types
│   ├── data/                     # Static game data (TypeScript modules, not JSON)
│   │   ├── pantheons/            # 12+ pantheon files (~170+ deities)
│   │   ├── monsters/             # Base monster definitions + prefixes/suffixes
│   │   ├── weapons/              # 32 base weapons, materials, qualities, enchantments
│   │   ├── achievements/         # Level 1→10 achievement tables (all implemented)
│   │   ├── combat/               # Combat narration text pools
│   │   ├── consumables.ts        # All consumable items
│   │   ├── materials.ts          # Crafting materials + magic stones
│   │   ├── loot/                 # Loot pool rules per monster category
│   │   ├── jobs/                 # Job definitions and starter skills
│   │   ├── skills/               # Skill catalog
│   │   ├── events/               # Random event tables
│   │   └── weaponRegistry.ts     # Global weapon instance registry (prevent dupes)
│   ├── constants/                # Design system constants
│   │   ├── Colors.ts             # Full color palette (background, text, domain, resource)
│   │   ├── Typography.ts         # Text styles and size definitions
│   │   ├── Spacing.ts            # Spacing, BorderRadius, BorderWidth, Padding
│   │   └── GameConstants.ts      # ALL tunable game balance values (never hardcode!)
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Generic: Button, Card, Header, ProgressBar, etc.
│   │   ├── combat/               # Combat-specific: MonsterDisplay, FloatingDamage, etc.
│   │   ├── character-creation/   # Creation flow: DeityCard, DeitySearchBar, etc.
│   │   └── text/                 # Narrative: DramaticReveal, CeremonialDivider
│   ├── hooks/                    # Custom React hooks
│   │   ├── useHaptics.ts         # Haptic feedback helpers
│   │   └── useCreationState.ts   # Character creation flow state
│   └── lib/                      # Game logic utilities
│       └── generators/           # Procedural generation helpers
│
├── docs/                         # Design documentation (alongside root)
│   ├── DESIGN_OVERVIEW.md        # Project overview, tech stack, structure
│   ├── DESIGN_STATS.md           # 8 stats, grades, Falna formula, growth
│   ├── DESIGN_DUNGEON.md         # Tower, floors, room types, CR
│   ├── DESIGN_COMBAT.md          # Combat system, turn order, status effects
│   ├── DESIGN_MONSTERS.md        # Monster system, modular generation
│   ├── DESIGN_EQUIPMENT.md       # Weapons, armor, crafting
│   ├── DESIGN_PROGRESSION.md     # Levels, achievements, deities, jobs, NPCs
│   ├── SOUL_BEHAVEMENTS.md       # 85 behavements across 10 vectors
│   └── SOUL_TITLES.md            # Paragon title generation system
│
├── archive/                      # Archived documents (read-only reference)
│   └── CLAUDE_ORIGINAL.md        # Original design doc (superseded by docs/ split)
│
├── MINDSET.md                    # Voice and style guide (read before writing content)
├── PROGRESS.md                   # Implementation checklist (check off as you go)
├── GAME_INDEX.md                 # Navigation hub for all documentation
└── CURRENT_SPRINT.md             # What we're building right now
```

### Data Flow

```
AsyncStorage
    ↓ (persist middleware, on app start)
Zustand Stores (source of truth for all runtime state)
    ↓ (hooks: useCharacterStore, useCombatStore, etc.)
Expo Router Screens (app/ directory, consume stores directly)
    ↓ (props + local state)
Components (src/components/, presentational layer)
```

State flows DOWN. Actions flow UP (called from screens, mutate stores). Components are dumb — they receive data and call callbacks. Logic lives in stores.

### Store Hierarchy and Dependencies

| Store | Persisted | Depends On | Purpose |
|-------|-----------|------------|---------|
| `useGameStore` | YES | `useSoulStore` | Meta-state: settings, run history, tutorial, monster knowledge |
| `useCharacterStore` | YES | `useAchievementStore`, `useShopStore` (lazy) | Character stats, equipment, inventory, skills, Falna/excelia |
| `useDungeonStore` | YES | — | Active run: floor state, room map, visited rooms, current run |
| `useCombatStore` | NO | `useGameStore`, `useCharacterStore` | Active combat only — ephemeral per-encounter |
| `useAchievementStore` | YES | — | Achievement progress, discovery states, ceremony state |
| `useDeityStore` | YES | — | Selected deity data, domain effects, favor tracking |
| `useSoulStore` | YES | — | 85 behavements across 10 vectors, Denatus state |
| `useInventoryStore` | YES | — | Stash items, gold (separate from in-run inventory in Character) |
| `useJobStore` | YES | `useCharacterStore` (lazy) | Current job, job selection state |
| `useShopStore` | YES | — | Shop reputation, stock state |
| `useBlacksmithStore` | YES | — | Upgrade/repair state |
| `useSoundStore` | NO | — | Audio playback, volume, BGM/SFX management |

**CRITICAL**: `useCombatStore` is NOT persisted. Combat state is ephemeral — if the app closes mid-combat, the run resumes from the last floor state in `useDungeonStore`. Do not add persist middleware to combat.

### Screen → Store Mapping

| Screen | Primary Stores Read |
|--------|---------------------|
| `app/index.tsx` | useGameStore, useCharacterStore, useDungeonStore |
| `app/dungeon/floor.tsx` | useDungeonStore, useCharacterStore |
| `app/dungeon/combat.tsx` | useCombatStore, useCharacterStore, useDungeonStore, useAchievementStore, useSoulStore, useDeityStore |
| `app/dungeon/level-up.tsx` | useCharacterStore, useAchievementStore, useDeityStore |
| `app/town/familia/index.tsx` | useCharacterStore, useDeityStore |
| `app/town/familia/blessing-rite.tsx` | useCharacterStore, useDeityStore |
| `app/character-creation/deity/` | useDeityStore, useGameStore |

---

## Design Rules (NON-NEGOTIABLE)

These are not preferences. They are constraints. Breaking them requires an explicit design discussion.

**CRITICAL: What We NEVER Add**
- NEVER add an XP bar or any grinding mechanic
- NEVER make death reversible outside of specific deity abilities (e.g., Hades' *Underworld Passage*)
- NEVER add a microtransaction, premium currency, or pay-to-win system
- NEVER add an "undo" button for combat or dungeon decisions
- NEVER hardcode balance values in component or screen files — all go in `GameConstants.ts`
- NEVER use `any` as a TypeScript type — use `unknown` or proper typed interfaces
- NEVER commit `.env` files, API keys, or secrets

**CRITICAL: What We ALWAYS Do**
- ALWAYS check `MINDSET.md` before writing any player-facing text
- ALWAYS put components in `src/components/`, screens in `app/`
- ALWAYS put type definitions in `src/types/`
- ALWAYS put static data in `src/data/`
- ALWAYS put balance values in `src/constants/GameConstants.ts`
- ALWAYS persist character and game state via Zustand `persist` middleware
- ALWAYS clear all store state on new game / character deletion
- ALWAYS use typed interfaces for all public store APIs

---

## Key Data Models

### Character

The core entity. Lives in `useCharacterStore`. Persisted to AsyncStorage under key `kohrvellia-character`.

```typescript
// Key fields — see src/types/Character.ts for full definition
interface Character {
  name: string;
  epithet: string;
  level: number;           // 1-10 (max level is Paragon)
  stats: Stats;            // 8 stats, each with grade + points + proficiency
  levelHistory: Array<{ level: number; stats: Record<StatName, number> }>; // carry for Falna
  pendingExcelia: PendingExcelia | null;  // Stat gains HIDDEN until Blessing Rite
  equipment: Equipment;    // weapon, head, chest, hands, legs, accessory1, accessory2
  inventory: InventoryItem[];  // capped at BAG_CAPACITY (20)
  skills: Skill[];
  patronDeityId: string | null;
  deityFavor: number;      // 0-100 (affects blessing multiplier)
  currentHP: number; maxHP: number;
  currentSP: number; maxSP: number;
  gold: number;
  isDead: boolean;         // Permadeath flag — when true, character must be deleted
  runStats: { ... };       // This-run tracking (monsters killed, floors reached, etc.)
}
```

### Stat System

```typescript
interface StatBlock {
  grade: Grade;      // 'I' | 'H' | 'G' | 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'
  points: number;    // 0-999 within current grade
  proficiency: number; // Action-based proficiency accumulation
}

// The Falna Formula — NEVER bypass this
EffectiveStat = (Level × 500) + SumOfAllPreviousLevelPoints + CurrentPoints
```

Level history is stored and summed — this is how a Level 3 character remains stronger than Level 1 even after stat reset. The `computeCarryStats()` function in `useCharacterStore` handles this correctly.

### Deity

```typescript
interface Deity {
  id: string;
  name: string;
  pantheon: PantheonId;
  domain: DomainId;         // 14 domains
  statBonus: { stat: StatName; value: number };    // +10 to one stat
  statPenalty: { stat: StatName; value: number };  // -5 to one stat
  domainBlessing: string;   // "+10% physical damage" etc.
  uniqueAbility: { name: string; description: string; favorRequired: number };
  personality: string[];
  lore: string;
}
```

Deity approval affects `blessingMultiplier` which directly scales maxHP, maxSP, and derived stats. This is implemented in `getBlessingMultiplier()` in `src/types/Deity.ts`.

### Monster (Modular)

```
displayName = [Prefix?] + BaseMonster.name + [Suffix?]
```

Prefix modifies stats upward (Fierce, Elite, Ancient, Mythic). Suffix adds elemental or special properties (of Flame, the Undying). All generated procedurally at floor entry. 36+ base monsters spanning CR 0.5-16.0.

### Achievement

```typescript
interface Achievement {
  id: string;
  name: string;            // Memorable name (see MINDSET.md naming rules)
  tier: 'STANDARD' | 'CHALLENGING' | 'HEROIC' | 'LEGENDARY' | 'MYTHIC';
  levelRequired: number;   // Which level transition this unlocks for
  requirement: AchievementRequirement;
  discoveryState: 'hidden' | 'rumored' | 'known' | 'completed';
}
```

Achievement data lives in `src/data/achievements/`. All 96 achievements (Levels 1→10) are implemented as TypeScript modules. The `useAchievementStore` validates progress and triggers the level-up ceremony.

---

## Aesthetic Vocabulary

When designing UI or writing UI text:

**Visual Register**
- Dark fantasy, grimdark, atmospheric — not horror, not whimsical
- UI chrome is minimal — let the content breathe
- High contrast: near-black backgrounds (`Colors.background.primary`), crisp text
- Accent system: crimson/gold for important actions, grey midtones for secondary content
- No rounded corners on "iron tablet" buttons — sharp, deliberate geometry

**Typography Register**
- Headers: authoritative, slightly archaic — "The Tower Awaits" not "Let's go!"
- Mechanic text: precise, unambiguous numbers — "+15% damage" not "stronger attacks"
- Flavor text: 1-2 sentences, active voice, implied "you", ends with a hook
- Error/warning states: "The way is barred." not "Error: invalid action"

**Color Palette Reference** (see `src/constants/Colors.ts` for full values)
- `Colors.background.primary` — near-black main background
- `Colors.text.accent` — antique gold (titles, key labels)
- `Colors.domain.death` — crimson/dark purple (danger, death states)
- `Colors.domain.fire` — ember orange (action highlights)
- `Colors.ui.success` — muted green (positive outcomes)
- `Colors.text.muted` — dark grey (secondary/tertiary info)

---

## Current State and Focus

### Phase Completion Status

*Last updated: 2026-05-18*

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Foundation | COMPLETE | Types, stores, constants, folder structure |
| Phase 1.1: Character Creation | COMPLETE | Name, backstory (8), stat allocation (30 pts) |
| Phase 1.2: Deity Selection | COMPLETE | 12+ pantheons, ~170+ deities, search/filter/compare |
| Phase 1.3: Tutorial Flow | COMPLETE | Trimmed to 3 screens (Stakes/Rules/Ledger); in-context hint overlays replace removed screens |
| Phase 1.4: Dungeon Core | COMPLETE | Branching generation, 9 room types, 2D map; weights reworked (combat:61%) |
| Phase 1.5: Combat System | COMPLETE | Kairos Protocol, 10 status effects, full action menu, skill cooldowns |
| Phase 1.6: Stat Growth | COMPLETE | Action-based growth, weapon-based training, grades |
| Phase 1.7: Level Progression | COMPLETE | 96 achievements (L1→L10), ascension ceremony, GLORY tracking wired |
| Phase 1.8: Inventory | PARTIAL | Equipment slots done; Drop/Destroy item system pending |
| Phase 1.9: Monster System | COMPLETE | 36+ monsters, prefix/suffix, CR scaling, loot tables |
| Phase 1.10: Weapon System | COMPLETE | 32 weapons, 6 qualities, 7 materials, 7 enchantments |
| Phase 1.X: Systems | COMPLETE | Multi-step events, milestone bosses, dungeon balance, anti-farming, shrine rework |
| Phase 2.1: Job System | COMPLETE | selectJob() → starter skill + stat bonus + starter weapon; wired in combat |
| Phase 2.2: Denatus Soul | NEAR-COMPLETE | ~90% wired (82/85 behavements); `glory_challenge_complete` deferred to God Challenges |
| Phase 2.3: Discovery System | NOT STARTED | Rumor system, achievement visibility states |
| Phase 2.4: God Challenges | NOT STARTED | Deity-assigned challenges |
| Phase 2.5: Town Hub | COMPLETE | Hub, Familia Home, Blessing Rite, Ascension Ceremony, satiation on home rest |
| Phase 2.6: Shop/Economy | PARTIAL | Shop screens exist; buy/sell UI exists; pricing/haggling not complete |
| Phase 3: Polish/Launch | NOT STARTED | |

### Known Gaps and Issues

1. **Drop/Destroy items** — Players cannot permanently remove items from inventory — only equip/unequip. Weapon slot is the only active equipment slot; armor shows a "Phase 3" locked placeholder.

2. **Weapon Triangle** — Damage type modifiers (Slash vs Flesh, Blunt vs Bone) are documented in `DESIGN_COMBAT.md` but not implemented in combat damage calculations.

3. **Music audio files** — `useSoundStore` infrastructure exists with all BGM/SFX types defined. Audio file assets pending (Phase 3).

4. **`.tmp` pantheon files** — `src/data/pantheons/` contains `.ts.tmp` files (inca, maya, persian, polynesian, shinto, vodou, yoruba). These are unreachable — either complete them or delete them.

5. **GLORY stacking multiplier** — GLORY vector tracked and HEROIC+ selections fire behavements. The 1.5× stat reward multiplier formula for 3+ hard-path achievements is documented but not yet applied in `performLevelUp()`.

6. **Bosses 6-20** — Only 5 bosses implemented (floors 5-25). Floors 30-100 have no milestone bosses yet.

---

## Deployment

The project auto-deploys to GitHub Pages on push to `master` via `.github/workflows/deploy.yml`. It runs `npx expo export --platform web` and publishes the `./dist` folder. This is a web preview only — not the primary release target (iOS/Android App Store).

---

*The Tower Awaits.*
