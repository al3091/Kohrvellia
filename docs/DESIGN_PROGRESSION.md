# KOHRVELLIA - Progression System

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Level 1→2 Achievements | ✅ Implemented | 12 achievements across 5 tiers |
| Achievement Checker | ✅ Implemented | Validates completion conditions |
| Achievement Store | ✅ Implemented | Track progress, discovery |
| Level Up Ceremony | ⏳ Pending | UI for deity approval |
| Level 2-10 Achievements | ⏳ Pending | 80+ more achievements |
| GLORY Tracking | ⏳ Pending | Hard-path choice recording |
| Discovery System | ⏳ Pending | Reputation-based hints |
| Deity Selection | ✅ Enhanced | Search, filters, comparison |
| Deity Favor | ⏳ Planned | 0-100 scale, eviction, favoured child |
| Domain Blessings | ✅ Display | Effects shown, combat integration pending |
| Job System | ⏳ Planned | 8 base jobs + specializations |
| Denatus System | ⏳ Planned | Soul titles, behavements |

---

## Level System (Achievement-Based)

### Core Concept

**Max Level: 10** (DanMachi-inspired)

| Level | Title | Unlock |
|-------|-------|--------|
| 1 | Fledgling adventurer | — |
| 2 | Novice adventurer | Base Job |
| 3 | Competent adventurer | — |
| 4 | Veteran adventurer | — |
| 5 | Elite adventurer | Specialization |
| 6 | Champion adventurer | — |
| 7 | Renowned adventurer | — |
| 8 | Legendary adventurer | Advanced Class |
| 9 | Mythic adventurer | — |
| 10 | Paragon | Denatus title |

### Level-Up Requirements

To level up, you must:
1. **All 8 stats** must reach at least **Grade D** (500+ points)
2. Complete a **Great Achievement** (see below)
3. Receive **Deity Approval** (patron must recognize the achievement)

**NO XP SYSTEM** - Leveling is purely achievement-based.

### What Happens on Level Up

1. Your current stat grades "lock in" as permanent power (via Falna Formula)
2. All current grades **reset to I** (but effective power doesn't drop)
3. New stat growth begins from I again
4. Unlock job milestones (if applicable)
5. Receive bonus stat points based on achievement tier

---

## Great Achievement System

### Achievement Tiers

Each level-up has **10 universal achievements** plus **2 deity-domain bonus achievements**.

| Tier | CR Equivalent | Bonus Stats | GLORY Points | Title Modifier |
|------|---------------|-------------|--------------|----------------|
| **STANDARD** | CR 1.0-2.0 | +0 | +0 | None |
| **CHALLENGING** | CR 2.5-4.0 | +1 | +1 | "the Capable" |
| **HEROIC** | CR 4.5-6.0 | +2 | +3 | "the Bold" |
| **LEGENDARY** | CR 7.0-10.0 | +3 | +7 | "the Fearless" |
| **MYTHIC** | CR 10.0+ | +5 | +15 | "the Impossible" |

### Level 1 → 2 Achievements

| # | Name | Tier | Requirement |
|---|------|------|-------------|
| 1 | First Blood | STANDARD | Kill 10 monsters |
| 2 | Tower Initiate | STANDARD | Reach Floor 5, return alive |
| 3 | The Cleanser | CHALLENGING | Clear entire floor without retreat |
| 4 | Undying Will | CHALLENGING | Win 3 fights at <30% HP |
| 5 | Collector of Spoils | CHALLENGING | Acquire 5 Uncommon+ items |
| 6 | Slayer of the Strong | HEROIC | Solo kill Elite monster |
| 7 | Untouchable | HEROIC | Clear Floors 3-5 with 0 damage taken |
| 8 | Speaker to All | HEROIC | Reach rep +5 with 5 different NPCs |
| 9 | Dragonblood Initiate | LEGENDARY | Survive encounter with Dragon-type |
| 10 | The Impossible Novice | MYTHIC | Kill Dragon-type at Level 1 |

### Achievement Stacking

Complete multiple achievements before leveling up for bonus rewards:

| Stack Count | Multiplier |
|-------------|------------|
| 1 achievement | 1.0x |
| 2 achievements | 1.25x |
| 3 achievements (max) | 1.5x |

---

## Discovery System

### Discovery Sources

| Source | Reputation Req | Reveals |
|--------|----------------|---------|
| Guild Receptionist | +0 | All STANDARD achievements |
| Tavern Veterans | +3 | CHALLENGING hints |
| Library Research | +3, 100-500g | CHALLENGING-HEROIC details |
| Arena Master | +6 | HEROIC combat achievements |
| Academy Scholars | +8 | HEROIC skill/stat achievements |
| Ancient Tomes | +8 | LEGENDARY hints |
| Deity at Shrine | Favor-based | Domain-aligned achievements |
| Past Adventurer Journals | Floor 15+ loot | Random tier |
| UNDISCOVERED | N/A | MYTHIC (figure it out) |

---

## Deity System

### Deity Buff/Debuff Structure

Every patron deity provides:
- **Stat Bonus**: +10 to one stat
- **Stat Penalty**: -5 to one stat (for balance)
- **Domain Blessing**: +10% to domain-related actions (displayed prominently)
- **Unique Ability**: Unlocked at higher favor (shown with unlock threshold)
- **Personality**: Affects how hints/guidance are delivered

### Deity Domains (14 implemented)

| Domain | Primary Effect | Related Stats |
|--------|----------------|---------------|
| War | +10% physical damage | STR, END |
| Magic | +10% spell damage, -5% SP cost | INT, WIS |
| Trickery | +10% dodge chance | AGI, LCK |
| Death | +10% damage vs undead | WIS, END |
| Fortune | +10% loot quality | LCK, CHA |
| Nature | +10% healing received | WIS, END |
| Wisdom | +10% skill learning | WIS, INT |
| Craft | +10% crafting success | STR, INT |
| Authority | +10% intimidation | CHA, STR |
| Life | +10% HP regen | END, WIS |
| Sea | +10% water magic | WIS, AGI |
| Sky | +10% lightning damage | AGI, INT |
| Fire | +10% fire damage | INT, STR |
| Knowledge | +10% enemy info revealed | INT, PER |

### Deity Selection UX (Implemented)

- **Search Bar**: Search across all deities by name, title, domain
- **Filters**: Filter by domain, bonus stat, personality type
- **View All Mode**: Browse all deities across pantheons
- **Comparison Tool**: Side-by-side compare up to 3 deities
- **Enhanced Cards**: Domain icon, blessing effect, personality displayed
- **Detail Modal**: Full info with favor unlock requirements

### Available Pantheons (12 implemented, ~170 deities)

Greek, Norse, Egyptian, Japanese, Celtic, Mesopotamian, Hindu, Chinese, Slavic, Aztec, Ars Goetia, Fallen Angels

### Planned: Deity Favor System

| Favor Range | Status | Blessing Power |
|-------------|--------|----------------|
| 0-10 | ABANDONED | 0% (evicted) |
| 11-25 | DISFAVORED | 50% |
| 26-40 | TOLERATED | 75% |
| 41-60 | ACCEPTED | 100% (default) |
| 61-75 | FAVORED | 125% |
| 76-90 | BLESSED | 150% |
| 91-100 | FAVOURED CHILD | 200% + death save |

---

## God Challenge System

Time-limited deity-assigned achievements that test alignment with their domain.

### Trigger Conditions

- Achievement rejected by deity
- Player requests guidance at shrine (costs favor)
- Random shrine event (5% chance)
- Approaching milestone without discovered achievements

### Example Challenges

| Domain | Challenge | Requirement | Time Limit | Tier |
|--------|-----------|-------------|------------|------|
| War | Trial of Carnage | Kill 50 enemies | 5 floors | CHALLENGING |
| War | Champion's Gauntlet | Defeat 3 Elites consecutively | 3 floors | HEROIC |
| Trickery | Shadow's Game | Kill 10 enemies from stealth | 5 floors | CHALLENGING |
| Death | Death's Threshold | Win 5 fights at <10% HP | 5 floors | CHALLENGING |
| Fortune | Lucky Streak | Land 10 critical hits | 5 floors | CHALLENGING |

---

## Job/Class System

### Progression Milestones

```
Level 2  → Choose Base Job (30+ options based on top 3 stats)
Level 5  → Job Specialization (Path A or B)
Level 8  → Advanced Class (elite abilities)
Level 10 → Paragon (unique Denatus title + permanent buffs)
```

### Job Selection

Jobs are determined by your **top 3 stats** at the time of selection.

### Jobs by Stat Combination (Examples)

| Top 3 Stats | Available Base Jobs |
|-------------|---------------------|
| STR + END + AGI | Warrior, Berserker, Guardian, Gladiator |
| STR + END + WIS | Paladin, Crusader, War Priest |
| AGI + PER + LCK | Assassin, Scout, Thief, Gambler |
| INT + WIS + CHA | Sage, Enchanter, Oracle, Diplomat |
| AGI + INT + CHA | Bard, Trickster, Illusionist |

---

## NPC Reputation System

### Likeability Scale

Range: **-20** to **+20** (starts at **+1**)

### Progression Formula

```typescript
xp_to_next_level(current) = BASE_XP * Math.pow(1.5, current)
// BASE_XP = 100
```

| Level | XP Required |
|-------|-------------|
| +1 → +2 | 150 |
| +2 → +3 | 225 |
| +3 → +4 | 338 |
| +19 → +20 | ~28,000 |

**CRITICAL**: Each level is HARDER than the previous!

### Reputation Effects

| Level Range | Effect |
|-------------|--------|
| **-20 to -15** | Hostile, may attack on sight |
| **-14 to -10** | Won't speak, prices +200% |
| **-9 to -5** | Terse responses, prices +150% |
| **-4 to 0** | Neutral, basic services only |
| **+1 to +5** | Friendly, answers basic questions |
| **+6 to +10** | Shares rumors, 10% discount |
| **+11 to +15** | Shares secrets, 25% discount, may teach skills |
| **+16 to +19** | 40% discount, rare info, special quests |
| **+20** | Maximum trust, unique rewards |

### NPC Locations

| Location | NPCs | Services |
|----------|------|----------|
| **Guild Hall** | Guildmaster, Receptionist | Quests, rankings, party recruitment |
| **Library** | Head Librarian, Scholars | Skill research, monster info, lore |
| **Academy** | Headmaster, Instructors | Skill demonstrations, training |
| **Blacksmith** | Master Smith, Apprentice | Crafting, repairs, upgrades |
| **Apothecary** | Alchemist, Herbalist | Potions, antidotes, status cures |
| **Temple** | High Priest, Priests | Blessings, curse removal, deity info |
| **Tavern** | Barkeep, Barmaid, Patrons | Rumors, rest, food buffs |
| **Market** | Various Merchants | General goods, rare items |
| **Arena** | Arena Master, Fighters | Practice combat, tournaments |
