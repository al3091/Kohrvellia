# KOHRVELLIA - Game Design Index

> Mobile roguelike dungeon crawler with text-based adventure and tactical combat.
> Built with React Native (Expo) + TypeScript.

---

## Quick Reference

### Core Philosophy
1. **Challenge, Not Grind** - Levels are milestone achievements
2. **Loot is King** - Dopamine from drops, not XP
3. **Meaningful Choices** - Risk vs reward is constant
4. **Permadeath** - Death is permanent, full reset
5. **No Quick Exits** - Must climb back up to exit

### The 8 Stats
| Stat | Name | Primary Role |
|------|------|--------------|
| STR | Strength | Melee damage, carry capacity |
| PER | Perception | Traps, ranged accuracy |
| END | Endurance | HP, resistances |
| CHA | Charisma | NPCs, prices |
| INT | Intelligence | Magic, puzzles |
| AGI | Agility | Dodge, speed |
| WIS | Wisdom | Magic defense, divine |
| LCK | Luck | Crits, loot quality |

### Deity Domains (14 total)
War | Magic | Trickery | Death | Fortune | Nature | Wisdom | Craft | Authority | Life | Sea | Sky | Fire | Knowledge

### Achievement Tiers
STANDARD (1x) | CHALLENGING (1.5x) | HEROIC (2x) | LEGENDARY (3x) | MYTHIC (5x)

### Pantheons (12 active, ~168 deities)
Greek | Norse | Egyptian | Japanese | Celtic | Mesopotamian | Hindu | Chinese | Slavic | Aztec | Ars Goetia | Fallen Angels

### Milestone Bosses (5 implemented, 15 planned)
Vanya (Floor 5) | Sorath (Floor 10) | Kutcher (Floor 15) | Kalindi (Floor 20) | Malik (Floor 25)
Floors 30-100: Sekhmet → Hades → Brahman → Valdris (15 bosses designed, not coded)

---

## State Stores (Zustand)

| Store | Persisted | Purpose |
|-------|-----------|---------|
| `useCharacterStore` | YES | Stats, equipment, inventory, skills, Falna |
| `useDungeonStore` | YES | Active run: floor map, rooms, run flags, boss snapshot |
| `useCombatStore` | NO | Ephemeral per-encounter combat state |
| `useAchievementStore` | YES | Progress, discovery states, ceremony |
| `useDeityStore` | YES | Patron deity, favor, challenges, hints |
| `useSoulStore` | YES | 85 behavements across 10 vectors, Denatus state |
| `useInventoryStore` | YES | Town stash, gold |
| `useJobStore` | YES | Current job, selection state, starter skill |
| `useShopStore` | YES | Shop reputation, stock state |
| `useBlacksmithStore` | YES | Upgrade/repair state |
| `useMarketStore` | YES | 35 market events, supply pressure, material pricing |
| `useGameStore` | YES | Meta: settings, run history, defeated bosses, tutorial state |
| `useSoundStore` | NO | Audio playback (files pending) |

---

## Documentation Map

### Design Documents (in `docs/`)

| File | Contents |
|------|----------|
| [DESIGN_OVERVIEW.md](docs/DESIGN_OVERVIEW.md) | Project overview, philosophy, tech stack, project structure |
| [DESIGN_STATS.md](docs/DESIGN_STATS.md) | 8 stats, grades (I-SSS), Falna formula, derived stats, stat growth |
| [DESIGN_DUNGEON.md](docs/DESIGN_DUNGEON.md) | Tower system, floors, rooms, CR, rest sites |
| [DESIGN_COMBAT.md](docs/DESIGN_COMBAT.md) | Combat system, turn order, status effects, enemy AI |
| [DESIGN_MONSTERS.md](docs/DESIGN_MONSTERS.md) | Monster system, prefixes/suffixes, generation, loot |
| [DESIGN_EQUIPMENT.md](docs/DESIGN_EQUIPMENT.md) | Weapons, armor, materials, qualities, enchantments |
| [DESIGN_PROGRESSION.md](docs/DESIGN_PROGRESSION.md) | Levels, achievements, deities, jobs, NPCs, events |

### Soul System (in `docs/`)

| File | Contents |
|------|----------|
| [SOUL_TITLES.md](docs/SOUL_TITLES.md) | Paragon titles, CR/stat adjectives, skill nouns, buff generation |
| [SOUL_BEHAVEMENTS.md](docs/SOUL_BEHAVEMENTS.md) | 9 vectors, 85+ behavements, tracking implementation |

### Boss System (in `src/data/bosses/`)

| File | Contents |
|------|----------|
| [milestoneBosses.ts](src/data/bosses/milestoneBosses.ts) | 5 sentient bosses (floors 5-25), `MilestoneBoss` interface, 3-exchange conversation system, `getMilestoneBoss()` |

Boss design rules:
- Each boss senses **archetypes** from collective memory, not individual player history
- 3-exchange conversation → secret stat-gated outcomes (CHA bypass, LCK cache, WIS weakness reveal)
- Bosses fight every run for gear progression; `defeatedBosses[]` in `useGameStore` is flavor-only

### Meta Documents (root)

| File | Purpose |
|------|---------|
| [MINDSET.md](MINDSET.md) | Style guide for writing content |
| [PROGRESS.md](PROGRESS.md) | Implementation checklist + Cool Ideas Backlog |
| [BUGS.md](BUGS.md) | Living bug tracker (Pike's list) |
| [CURRENT_SPRINT.md](CURRENT_SPRINT.md) | Active tasks, blocked decisions, next up |

---

## Key Formulas

### Falna Formula (Effective Stat)
```
EffectiveStat = (Level x 500) + CurrentGradePoints
```

### Level Up Requirements
1. 6 of 8 stats at Grade D (500+ points) — allows 2 dump stats for specialist builds
2. Complete a Great Achievement
3. Deity Approval

### Rest Site Spawn
```
chance = 15% x 0.85^floor
```

---

## Implementation Status

See [PROGRESS.md](PROGRESS.md) for full checklist. See [PROGRESS.md Cool Ideas Backlog](PROGRESS.md#cool-ideas-backlog) for 10 recovered design concepts queued for future sprints.

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Foundation | COMPLETE | Core types, stores, constants, folder structure |
| Phase 1: MVP | ~95% | All core systems working; GLORY tracking + item destroy remain |
| Phase 1.X: Build Hardening | COMPLETE | Combat scaling, shop, loot pools, boss system, challenge routing, TypeScript |
| Phase 2: Extended | ~20% | Job store ✅, Denatus store ✅, Market Events ✅, boss conversations ✅; Denatus wiring + job combat + God Challenges pending |
| Phase 3: Polish | Not started | UI polish, audio, balancing, localization |

### Recent Completions (2026-05-15 sprint)
- **Milestone Boss System** — 5 sentient bosses (floors 5-25), 3-exchange conversations, archetype dialogue, stat-gated secret outcomes
- **Multi-Step Dungeon Events** — 5 Buriedbornes-style events with run flags and weapon rewards
- **Deity Challenge Routing** — All non-kill challenge types (gold, heal, etc.) now track correctly
- **Market Events System** — 35 narrative events, live economy, guild hall market board
- **Shop Overhaul** — Level-gated weapon pool, stale stock fix, 12-item minimum guarantee
- **All-Build Weapon Progression** — LCK/WIS/INT/CHA weapons now drop from appropriate monster categories
- **Soul System Partial Wiring** — PHYS/MAGIC/TANK/EVADE vectors fully wired; social/resource/GLORY partially wired
- **Job System UI** — job-select screen, job store, stat bonus applied at selection

---

*The Tower Awaits.*
