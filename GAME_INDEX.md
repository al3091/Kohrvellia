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

### Pantheons (12 implemented)
Greek | Norse | Egyptian | Japanese | Celtic | Mesopotamian | Hindu | Chinese | Slavic | Aztec | Ars Goetia | Fallen Angels

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

### Meta Documents (root)

| File | Purpose |
|------|---------|
| [MINDSET.md](MINDSET.md) | Style guide for writing content |
| [PROGRESS.md](PROGRESS.md) | Implementation checklist |

---

## Key Formulas

### Falna Formula (Effective Stat)
```
EffectiveStat = (Level x 500) + CurrentGradePoints
```

### Level Up Requirements
1. All 8 stats at Grade D (500+ points)
2. Complete a Great Achievement
3. Deity Approval

### Rest Site Spawn
```
chance = 15% x 0.85^floor
```

---

## Implementation Status

See [PROGRESS.md](PROGRESS.md) for full checklist.

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Foundation | ~90% | Core types, stores, constants done |
| Phase 1: MVP | ~85% | Character creation, deity, tutorial, combat, dungeon all working |
| Phase 2: Extended | ~5% | Job system, Denatus planned |
| Phase 3: Polish | Not started | UI polish, balancing |

### Recent Completions
- **Tutorial Flow** - 6-screen interactive tutorial (Welcome → Basics → Combat → Stats → Falna → Leveling → Death)
- **Enhanced Deity System** - Search, filters, comparison tool, domain blessing display
- **Combat System** - Full turn-based combat with 10 status effects, action-based stat growth
- **Dungeon Generation** - Procedural branching dungeons with 9 room types
- **Weapon System** - 32 base weapons, 6 quality tiers, 7 materials, 7 enchantments
- **Monster System** - 16 base monsters with prefix/suffix modifiers

---

*The Tower Awaits.*
