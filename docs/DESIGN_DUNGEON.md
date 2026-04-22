# KOHRVELLIA - Dungeon System

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Floor Generation | ✅ Implemented | Procedural branching layout |
| Room Count Scaling | ✅ Implemented | Base 45 + 10/tier + CR% bonus |
| Main Spine + Branches | ✅ Implemented | 3-6 branches per floor |
| Cross-Connections | ✅ Implemented | Loop paths between branches |
| 2D Grid Map UI | ✅ Implemented | Pan/scroll, room icons |
| Room Navigation | ✅ Implemented | Tap adjacent room to move |
| Combat Rooms | ✅ Implemented | Full turn-based combat |
| Rest Rooms | ✅ Implemented | Heal 50% HP/SP |
| Treasure Rooms | ✅ Basic | Placeholder loot |
| Shop Rooms | ⏳ Pending | Placeholder only |
| Event Rooms | ⏳ Pending | Placeholder only |
| Boss Rooms | ✅ Implemented | 1.5x HP monsters |
| Shrine Rooms | ⏳ Pending | Placeholder only |
| Trap Rooms | ✅ Implemented | 10% max HP damage |
| Empty Rooms | ✅ Implemented | Safe passage |
| Floor Transition | ✅ Implemented | Stairs after clearing exit |

---

## Tower System (Core Rules)

1. **No Quick Exits** - The dungeon is a tower. To exit, you must climb back up.
2. **Descend 5, Ascend 5** - If you go down 5 floors, you must ascend 5 floors to reach town.
3. **Rooms Per Floor** - Each floor has X rooms (varies by depth).
4. **CR Warnings** - Before descending, the game shows the next floor's Challenge Rating.
5. **Push Your Luck** - Deeper = better loot, but harder return.

---

## Floor Layout

```
TOWN (Safe Zone)
    │
    ▼
Floor 1 (3-5 rooms)
    │
    ▼
Floor 2 (3-5 rooms)
    │
    ▼
...continuing infinitely...
```

Each floor contains:
- **Entrance Room** - Where you arrive from above
- **Middle Rooms** - Combat, events, treasures, traps
- **Exit Room** - Stairs down to next floor

---

## Room Count by Depth

| Floor Range | Rooms | Encounter Chance |
|-------------|-------|------------------|
| 1-5 | 3-5 | 40% |
| 6-10 | 4-6 | 50% |
| 11-20 | 5-7 | 55% |
| 21-30 | 6-8 | 60% |
| 31-40 | 7-9 | 65% |
| 41-50 | 8-10 | 70% |
| 51+ | 9-12 | 75% |

---

## Room Types

| Type | Description | Frequency |
|------|-------------|-----------|
| **Empty** | Safe room, catch your breath | 15% |
| **Combat** | Monster encounter | 35% |
| **Treasure** | Chest (may be locked, trapped, or mimic) | 10% |
| **Trap** | Environmental hazard, skill check to disarm | 10% |
| **Event** | Narrative encounter, choices matter | 15% |
| **Shrine** | Blessing/curse from patron deity | 5% |
| **Shop** | Wandering merchant | 5% |
| **Rest Site** | Safe rest, healing (exponentially rare) | Variable |

---

## Challenge Rating (CR) Per Floor

| Floor | Base CR | Monster Complexity |
|-------|---------|-------------------|
| 1-5 | 1.0-2.0 | Base monsters only |
| 6-10 | 2.0-3.5 | +1 low-tier affix |
| 11-20 | 3.5-5.0 | +1 mid-tier affix |
| 21-30 | 5.0-7.0 | +2 mid-tier affixes |
| 31-40 | 7.0-10.0 | +2 high-tier affixes |
| 41-50 | 10.0-15.0 | Elite encounters |
| 51+ | 15.0+ | Legendary possible |

**CRITICAL**: Floor CR is CAPPED. Floor 1 will NEVER spawn legendary dragons, even if the player is level 60. The floor determines monster complexity, not the player's level.

---

## CR Danger Indicator

```typescript
function getDangerLevel(playerLevel: number, monsterCR: number): string {
  const expectedCR = playerLevel * 2.5;
  const ratio = monsterCR / expectedCR;

  if (ratio < 0.6) return "TRIVIAL";   // Green
  if (ratio < 0.9) return "EASY";      // Light green
  if (ratio < 1.1) return "NORMAL";    // Yellow
  if (ratio < 1.4) return "HARD";      // Orange
  if (ratio < 1.8) return "DEADLY";    // Red
  return "SUICIDAL";                   // Skull icon
}
```

---

## Rest Sites (Exponential Rarity)

### Types

| Site Type | Effect |
|-----------|--------|
| **Grace Oasis** | Full HP/SP restore, completely safe rest |
| **Restorative Spring** | 50% HP restore, cures poison and bleed |
| **Campsite** | Safe rest (recover SP), no HP healing |
| **Past Adventurer's Cache** | Mystery loot from fallen adventurers |

### Spawn Formula

```typescript
rest_site_chance(floor) = BASE_CHANCE * Math.pow(0.85, floor)
// BASE_CHANCE = 0.15 (15%)
```

| Floor | Chance Per Room |
|-------|-----------------|
| 1 | 15.0% |
| 5 | 9.0% |
| 10 | 5.0% |
| 20 | 2.0% |
| 30 | 0.8% |
| 40 | 0.3% |
| 50+ | ~0.1% |

**Lore Justification**: Fewer adventurers reach deeper floors, so fewer established rest sites exist.

---

## Biome-Pantheon Associations

| Biome | Primary Pantheons |
|-------|-------------------|
| Ruins | Greek, Roman, Egyptian |
| Frozen | Norse, Slavic, Finnish |
| Forest | Celtic, Shinto, Yokai |
| Desert | Egyptian, Mesopotamian, Persian |
| Jungle | Aztec, Maya, Inca |
| Swamp | Vodou, Yoruba |
| Volcanic | Polynesian, Hindu |
| Void | Ars Goetia, Fallen Angels |
| Dreamscape | Aboriginal, North American |

---

## Events System

### Event Types

| Type | Description |
|------|-------------|
| **Narrative** | Story moments, world-building |
| **Choice** | Multiple options with consequences |
| **Skill Check** | Pass/fail based on stat or skill |
| **Combat** | Special combat encounter |
| **Treasure** | Loot opportunity |
| **Trap** | Environmental hazard |
| **Merchant** | Special vendor |
| **Shrine** | Deity interaction |
| **NPC** | Meeting other adventurers |
| **Mystery** | Puzzle or investigation |

### Example Events

**Wounded Adventurer**
```
You find a wounded adventurer slumped against the wall...

[Help them] - Uses supplies, gain reputation, possible reward
[Rob them] - Gain loot, lose karma
[Ignore them] - No effect
[Interrogate] - CHA check, learn info
```

**Mysterious Altar**
```
An ancient altar glows with ethereal light...

[Pray] - WIS check, blessing or curse
[Desecrate] - Gain gold, angered deity
[Examine] - INT check, learn lore
[Leave it] - No effect
```

---

## Save System

### Autosave Points

- Entering a new floor
- After combat
- After important events
- Before descending

### Permadeath

- Death = full save wipe
- No save scumming (autosave only)
- Records of past runs preserved (epitaphs)

### Records Preserved

- Best floor reached
- Total runs
- Total deaths
- Achievements unlocked
- Deities discovered
- Codex entries
