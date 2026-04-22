# KOHRVELLIA - Stats System

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| 8 Stats | ✅ Implemented | STR, PER, END, CHA, INT, AGI, WIS, LCK |
| Grade System | ✅ Implemented | I→H→G→F→E→D→C→B→A→S→SS→SSS (0-999 points) |
| Stat Allocation | ✅ Implemented | 30 points at creation, max 20 per stat |
| Backstory Modifiers | ✅ Implemented | 8 backstories with +/- stat effects |
| Action-Based Growth | ✅ Implemented | Combat actions train relevant stats |
| Weapon-Based Training | ✅ Implemented | Attack with weapon trains its scaling stat |
| Defending Training | ✅ Implemented | END +1, +2 when hit while defending |
| Observe Training | ✅ Implemented | WIS +2 for observing enemies |
| Taunt Training | ✅ Implemented | CHA +1, +2 on success |
| Flee Training | ✅ Implemented | AGI +1, +2 on successful escape |
| Critical Hit Training | ✅ Implemented | PER +2 bonus |
| Lucky Dodge Training | ✅ Implemented | LCK +1 when enemy misses |
| Falna Formula | ✅ Implemented | EffectiveStat = (Level × 500) + GradePoints |
| Stats Display UI | ✅ Implemented | Full stats screen with grades |

---

## 8 Stats (D&D + Fallout SPECIAL Merged)

| Stat | Full Name | Description |
|------|-----------|-------------|
| **STR** | Strength | Melee damage, carry capacity, physical feats |
| **PER** | Perception | Trap detection, ranged accuracy, awareness |
| **END** | Endurance | Health pool, stamina, poison/bleed resistance |
| **CHA** | Charisma | NPC interactions, prices, social skills |
| **INT** | Intelligence | Magic power, skill learning speed, puzzles |
| **AGI** | Agility | Dodge chance, speed, initiative, stealth |
| **WIS** | Wisdom | Magic defense, intuition, divine favor |
| **LCK** | Luck | Critical hits, loot quality, random events |

---

## Stat Grades (DanMachi-Inspired)

Stats are measured in letter grades within each level. Grades range from 0-999 points **per level**:

```
Grade    Points    Description
I        0-99      Untrained
H        100-199   Novice
G        200-299   Beginner
F        300-399   Developing
E        400-499   Competent
D        500-599   Proficient
C        600-699   Skilled
B        700-799   Advanced
A        800-899   Expert
S        900-949   Elite
SS       950-979   Master
SSS      980-999   Legendary
```

**Display Format**: `STR: B-782` means Strength is at grade B with 782 points.

**CRITICAL**: On level-up, grades **reset to I** but effective power does NOT decrease (see Falna Formula below).

---

## The Falna Formula (Effective Stat Calculation)

Your true power combines your current level with your current grade:

```typescript
EffectiveStat = (Level × 500) + CurrentGradePoints
```

| Character | Level | Grade | Points | Effective Stat |
|-----------|-------|-------|--------|----------------|
| Newbie | 1 | SSS | 990 | 500 + 990 = **1490** |
| Veteran | 3 | C | 650 | 1500 + 650 = **2150** |
| Elite | 5 | D | 550 | 2500 + 550 = **3050** |
| Champion | 7 | B | 750 | 3500 + 750 = **4250** |
| Paragon | 10 | A | 850 | 5000 + 850 = **5850** |

**Key Insight**: Levels are the FOUNDATION of power. A Level 3 C-rank (2150) crushes a Level 1 SSS (1490). You MUST level up to compete with higher floors.

---

## Derived Stats (Using EffectiveStat)

| Derived Stat | Formula |
|--------------|---------|
| Max HP | `50 + (EffectiveEND × 0.1) + (EffectiveSTR × 0.02)` |
| Max SP | `30 + (EffectiveWIS × 0.06) + (EffectiveINT × 0.04)` |
| Physical Attack | `(EffectiveSTR × 0.08) + WeaponDamage` |
| Magic Attack | `(EffectiveINT × 0.08) + (EffectiveWIS × 0.02) + WeaponMagic` |
| Physical Defense | `(EffectiveEND × 0.06) + ArmorDefense` |
| Magic Defense | `(EffectiveWIS × 0.08) + ArmorMagicDef` |
| Speed | `(EffectiveAGI × 0.1) + (EffectivePER × 0.02)` |
| Critical Chance | `5% + (EffectiveLCK × 0.004) + (EffectivePER × 0.002)` |
| Dodge Chance | `(EffectiveAGI × 0.006) + (EffectivePER × 0.002)` |

---

## Stat Definitions (Combat & Non-Combat)

| Stat | Combat Effect | Non-Combat Effect |
|------|---------------|-------------------|
| **STR** | +Physical melee damage, +Block power | +Carry capacity, +Force checks |
| **PER** | +Ranged accuracy, +Crit chance | +Trap detection, +Search success |
| **END** | +Max HP, +Status resistance | +Stamina duration, +Poison survival |
| **CHA** | +Party buff power, +Intimidate | +Shop prices, +NPC reputation gain |
| **INT** | +Magic damage, +Spell slots | +Skill learn speed, +Puzzle hints |
| **AGI** | +Dodge chance, +Initiative | +Flee success, +Stealth |
| **WIS** | +Magic defense, +Healing power | +Shrine blessings, +Divine favor |
| **LCK** | +Crit damage, +Status proc | +Loot quality, +Random events |

---

## Every Stat Matters (Elden Ring Philosophy)

Even if a stat isn't your "main," it still helps:

| Non-Main Stat | Benefits for ANY Build |
|---------------|------------------------|
| STR for Mage | Better blocking, more carry weight |
| INT for Warrior | Identify items, solve puzzles faster |
| AGI for Tank | Still dodge some attacks, escape when needed |
| WIS for Rogue | Better divine blessings, status effect duration |
| CHA for Loner | Better shop prices, information gathering |
| END for Glass Cannon | Survive one more hit, resist status effects |
| PER for Brute | Notice traps, better ranged backup |
| LCK for Anyone | Better loot, random advantages |

---

## Action-Based Stat Growth (Bethesda-Style)

Every action increases a specific stat's proficiency points. When proficiency reaches threshold, grade increases.

```typescript
proficiencyThreshold(currentGrade) = 100 * (gradeIndex + 1)
// I→H: 100 points, H→G: 200 points, ... S→SS: 1000 points
```

### Growth Actions by Stat

**STR**
| Action | Points |
|--------|--------|
| Melee attack (hit) | +3 |
| Melee attack (kill) | +10 |
| Force open door/chest | +5 |
| Block with shield | +2 |

**PER**
| Action | Points |
|--------|--------|
| Ranged attack (hit) | +3 |
| Detect trap | +8 |
| Find secret room | +15 |
| Identify enemy weakness | +5 |

**END**
| Action | Points |
|--------|--------|
| Take damage | +1 per 10 |
| Survive status effect | +5 |
| Survive below 20% HP | +10 |
| Wear heavy armor (per room) | +1 |

**CHA**
| Action | Points |
|--------|--------|
| NPC conversation | +3 |
| Successful negotiation | +10 |
| Intimidation success | +8 |
| Gain NPC reputation | +5 |

**INT**
| Action | Points |
|--------|--------|
| Cast spell | +3 |
| Kill with magic | +8 |
| Learn new skill | +15 |
| Solve puzzle | +12 |

**AGI**
| Action | Points |
|--------|--------|
| Dodge attack | +3 |
| Perfect dodge | +8 |
| Flee successfully | +10 |
| Stealth kill | +10 |

**WIS**
| Action | Points |
|--------|--------|
| Pray at shrine | +10 |
| Receive deity blessing | +15 |
| Use divine skill | +5 |
| Heal ally | +5 |

**LCK**
| Action | Points |
|--------|--------|
| Critical hit | +3 |
| Find rare loot | +5 |
| Survive death (1 HP) | +15 |
| Natural 20 | +5 |

---

## Guided Grinding (Deliberate Training)

Players can deliberately train specific stats at town locations:

| Stat | Location | Method | Cost |
|------|----------|--------|------|
| STR | Academy | Strength training | 50g |
| PER | Library | Study enemy guides | 30g |
| END | Arena | Take hits deliberately | 75g |
| CHA | Tavern | Social practice | 25g |
| INT | Academy | Study sessions | 40g |
| AGI | Arena | Dodge-only training | 75g |
| WIS | Temple | Meditation | 20g |
| LCK | Casino | Games of chance | Varies |
