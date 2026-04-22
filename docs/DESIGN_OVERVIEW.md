# KOHRVELLIA - Design Overview

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Project Overview

**Kohrvellia** is a mobile roguelike dungeon crawler built with React Native (Expo) and TypeScript. The game combines text-based choose-your-own-adventure gameplay with tactical turn-based combat, inspired by Buriedbornes' dungeon crawling and DanMachi's progression systems.

---

## Core Philosophy

1. **Challenge, Not Grind** - Levels are milestone achievements, not XP bars. The game should never feel grindy.
2. **Loot is King** - Dopamine comes from finding cool gear, not from watching numbers go up.
3. **Meaningful Choices** - Every decision matters. Risk vs reward is constant.
4. **Permadeath** - Death is permanent. Full reset. Start from scratch.
5. **No Quick Exits** - Must climb back up to exit. Every floor deeper is a commitment.

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo) |
| Language | TypeScript (strict) |
| Routing | Expo Router (file-based) |
| State | Zustand |
| Persistence | AsyncStorage |
| Styling | StyleSheet + design constants |
| Animations | react-native-reanimated |
| Haptics | expo-haptics |

---

## Tutorial / Onboarding

### Introduction Text (First Play)

```
Welcome, Adventurer.

You stand before the Tower of Kohrvellia - a dungeon
that descends endlessly into darkness. Many have entered.
Few have returned.

THE RULES ARE SIMPLE:
1. Descend to find treasure. The deeper you go, the
   greater the rewards.
2. To EXIT, you must CLIMB BACK UP. There are no shortcuts.
3. Death is PERMANENT. Everything you carry, everything
   you've become - gone.

YOUR STRENGTH GROWS THROUGH ACTION:
- Swing a sword? Your body grows stronger.
- Cast a spell? Your mind sharpens.
- Take a hit? Your endurance hardens.

A PATRON AWAITS:
Choose a deity. They will grant you their blessing...
and their burden.

THE TOWER AWAITS.
```

### Tutorial Hints (Contextual)

| Trigger | Hint |
|---------|------|
| First combat | "Tip: Different damage types work better against different enemies. Slash flesh, crush bone, pierce leather." |
| First level up | "Your stats grew from your ACTIONS this level. Fight more to grow stronger. Think more to grow wiser." |
| First rest site | "Rest sites are rare. The deeper you go, the fewer you'll find. Plan accordingly." |
| First death | "Death is not the end - it's a teacher. What will you do differently?" |
| First shrine | "Your patron deity watches. They reward those who walk their path." |
| First Elite monster | "Elites are dangerous but rewarding. Their defeat may prove you worthy of advancement." |
| First CR warning | "The tower warns you of danger ahead. Heed it... or defy it." |

---

## Character Creation

### Step 1: Name and Epithet

Player enters: `[Name], [Epithet]`
Example: "Kira, the Wandering Storm"

### Step 2: Backstory Selection

Each backstory provides:
- Small stat modifier (+5 to one stat, -5 to another)
- Deity affinity hint (highlights compatible patron deities)
- Starting flavor (narrative hook)

| Backstory | Stat Effect | Deity Affinity | Flavor |
|-----------|-------------|----------------|--------|
| **Orphan of the Streets** | +5 AGI, -5 CHA | Trickster gods | "You learned to survive before you learned your name." |
| **Disgraced Noble** | +5 CHA, -5 END | Authority gods | "Your family's shame is your fuel." |
| **Failed Apprentice** | +5 INT, -5 WIS | Knowledge gods | "They said you lacked talent. They were wrong." |
| **Veteran Soldier** | +5 END, -5 INT | War gods | "The battlefield taught you more than any book." |
| **Temple Acolyte** | +5 WIS, -5 AGI | Divine gods | "Faith sustained you when all else failed." |
| **Wandering Merchant** | +5 PER, -5 STR | Fortune gods | "Every road leads to opportunity." |
| **Blacksmith's Child** | +5 STR, -5 CHA | Craft gods | "You were forged in fire like the blades you made." |
| **Cursed Bloodline** | +5 LCK, -5 WIS | Death/Fate gods | "Fate has plans for you, whether you like it or not." |

### Step 3: Deity Selection

After backstory, player selects their patron deity. Backstory highlights compatible deities but does not restrict choice.

---

## Critical Balance Guidelines

1. **Floor CR is CAPPED** - Floor 1 can never spawn legendary monsters
2. **Rest sites are RARE** - Exponential decay, very rare deep
3. **Reputation is HARD** - Each level harder, easy to lose
4. **Counter/Parry can't be spammed** - Costs SP, has cooldown
5. **Magic is BALANCED** - SP scarce, enemies resist
6. **Levels are MILESTONES** - Not grind
7. **Loot is KING** - Dopamine from drops, not XP

---

## Implementation Status

### Completed Systems

| System | Status | Details |
|--------|--------|---------|
| Character Creation | ✅ Complete | Name, backstory (8), stats (30 pts), deity selection |
| Deity System | ✅ Enhanced | Search, filters, comparison, 12 pantheons, ~170 deities |
| Tutorial | ✅ Complete | 6-screen flow covering all mechanics |
| Combat | ✅ Complete | Turn-based, 6 actions, 10 status effects, stat growth |
| Dungeon | ✅ Complete | Branching generation, 9 room types, 2D map UI |
| Weapons | ✅ Complete | 32 types, 6 qualities, 7 materials, 7 enchantments |
| Monsters | ✅ Complete | 16 base types, prefix/suffix modifiers, CR scaling |
| Achievements | ✅ Partial | Level 1→2 achievements, ceremony UI pending |

### Pending Systems

| System | Status | Notes |
|--------|--------|-------|
| Job System | ⏳ Planned | 8 base jobs, specializations |
| Denatus Soul | ⏳ Planned | 85+ behavements, title generation |
| Deity Favor | ⏳ Planned | Favor tracking, eviction, favoured child |
| Shop/Economy | ⏳ Planned | Town shops, dungeon shops |
| Extended Content | ⏳ Planned | More monsters, equipment, pantheons |

---

## Development Notes

- Use strict TypeScript (no `any`)
- All game constants in `constants/GameConstants.ts`
- All balance values should be easily tunable
- Comprehensive type definitions for everything
- Zustand stores should be atomic and composable
- Lazy-load pantheon data to manage bundle size
- Use seeded RNG for reproducible testing

---

## Project Structure

```
Kohrvellia/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout with navigation
│   ├── index.tsx                 # Title screen (New Game, Continue)
│   ├── character-creation/       # Character creation flow
│   │   ├── _layout.tsx           # Stack navigator
│   │   ├── name.tsx              # Name entry screen
│   │   ├── backstory.tsx         # Backstory selection (8 options)
│   │   ├── stats.tsx             # Stat allocation (30 points)
│   │   └── deity/                # Deity selection
│   │       ├── index.tsx         # Pantheon browser with search
│   │       ├── [pantheonId].tsx  # Deity list with filters
│   │       └── compare.tsx       # Side-by-side comparison
│   ├── tutorial/                 # Tutorial flow (6 screens)
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Welcome
│   │   ├── basics.tsx            # Navigation, HP/SP
│   │   ├── combat.tsx            # Combat mechanics
│   │   ├── stats.tsx             # Stat system
│   │   ├── falna.tsx             # Action-based growth
│   │   ├── leveling.tsx          # Achievement progression
│   │   └── death.tsx             # Permadeath warning
│   └── dungeon/                  # Dungeon gameplay
│       ├── _layout.tsx
│       ├── floor.tsx             # 2D floor map navigation
│       ├── room.tsx              # Room encounters
│       └── combat.tsx            # Turn-based combat
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   └── index.ts
│   │   └── character-creation/   # Character creation components
│   │       ├── DeityCard.tsx     # Enhanced deity display
│   │       ├── DeitySearchBar.tsx
│   │       ├── DeityFilters.tsx
│   │       ├── DeityComparison.tsx
│   │       ├── PantheonCard.tsx
│   │       └── BackstoryCard.tsx
│   ├── stores/                   # Zustand state management
│   │   ├── useGameStore.ts       # Meta state, settings, tutorial
│   │   ├── useCharacterStore.ts  # Character stats, equipment
│   │   ├── useDungeonStore.ts    # Floor, rooms, navigation
│   │   ├── useCombatStore.ts     # Combat state, actions
│   │   ├── useAchievementStore.ts # Achievement tracking
│   │   └── useCreationStore.ts   # Character creation state
│   ├── types/                    # TypeScript definitions
│   │   ├── Stats.ts              # Stat system types
│   │   ├── Character.ts          # Character, backstory types
│   │   ├── Deity.ts              # Deity, domain, favor types
│   │   ├── Monster.ts            # Monster generation types
│   │   ├── Weapon.ts             # Weapon system types
│   │   ├── Armor.ts              # Armor types
│   │   ├── Dungeon.ts            # Dungeon, room, floor types
│   │   ├── Achievement.ts        # Achievement types
│   │   └── Behavement.ts         # Soul system types
│   ├── data/                     # Static game data
│   │   ├── pantheons/            # 12 pantheon files (~170 deities)
│   │   ├── monsters/             # Monster definitions
│   │   ├── weapons/              # Weapon data
│   │   └── achievements/         # Achievement definitions
│   ├── lib/                      # Game logic utilities
│   │   └── generators/           # Procedural generation
│   ├── constants/                # Design system
│   │   ├── Colors.ts             # Color palette
│   │   ├── Typography.ts         # Text styles
│   │   ├── Spacing.ts            # Layout constants
│   │   └── GameConstants.ts      # Balance values
│   └── hooks/                    # Custom React hooks
│       ├── useHaptics.ts         # Haptic feedback
│       └── useCreationState.ts   # Creation flow state
├── assets/                       # Images, fonts
├── docs/                         # Design documentation
└── archive/                      # Original design docs
```
