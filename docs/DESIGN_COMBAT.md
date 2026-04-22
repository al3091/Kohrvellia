# KOHRVELLIA - Combat System

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Turn Order | ✅ Implemented | Player-first, simple queue |
| Attack Action | ✅ Implemented | Weapon stat-based damage |
| Defend Action | ✅ Implemented | +50% defense, trains END |
| Observe Action | ✅ Implemented | Reveals enemy info, trains WIS |
| Taunt Action | ✅ Implemented | Reduces enemy accuracy, trains CHA |
| Flee Action | ✅ Implemented | AGI check, trains AGI |
| Skill Action | ⏳ Pending | Requires skill system |
| Item Action | ⏳ Pending | Requires inventory system |
| Status Effects | ✅ Implemented | 10 effects (poison, burn, freeze, etc.) |
| Weapon Triangle | ⏳ Pending | Damage type modifiers planned |
| Counter/Parry | ⏳ Pending | Requires skill system |
| Enemy AI | ✅ Basic | Simple attack patterns implemented |
| Combat Log | ✅ Implemented | Last 8 actions displayed |
| Victory Screen | ✅ Implemented | Gold + stat proficiency rewards |
| Death Screen | ✅ Implemented | Game over, return to title |

---

## Turn Order

1. Calculate initiative: `Speed + d20`
2. Higher initiative acts first
3. On tie, player acts first

---

## Available Actions

| Action | Description | Cost |
|--------|-------------|------|
| **Attack** | Basic weapon attack | None |
| **Defend** | +50% defense until next turn, can trigger counter | None |
| **Skill** | Use a learned skill | SP cost varies |
| **Item** | Use consumable from inventory | None (uses turn) |
| **Flee** | Attempt to escape combat | AGI check |

---

## Weapon Triangle (Rock-Paper-Scissors)

```
Slash → Strong vs Flesh, Weak vs Armor
Pierce → Strong vs Leather, Weak vs Bone
Blunt → Strong vs Bone/Armor, Weak vs Flesh
Magic → Strong vs Spirit, Weak vs Magic-Resistant
Holy → Strong vs Undead/Demons, Neutral otherwise
```

**Damage Modifiers**:
- Strong: +50% damage
- Weak: -25% damage
- Neutral: 100% damage

---

## Status Effects

| Effect | Description | Cure |
|--------|-------------|------|
| **Poison** | Takes damage while WALKING (not just combat) | Antidote, Restorative Spring |
| **Bleed** | Cannot heal until cured | Bandage, healing magic |
| **Burn** | DOT + reduced defense (-20%) | Water, ice magic |
| **Freeze** | Reduced speed (-30%), can shatter | Fire, time |
| **Stun** | Lose turns (1-3) | Time |
| **Fear** | Reduced accuracy (-30%), may flee | Courage buff, time |
| **Curse** | Reduced all stats (-10%) until purified | Temple, holy magic |
| **Blind** | Accuracy -50% | Eye drops, time |
| **Silence** | Cannot use magic skills | Time, dispel |
| **Paralysis** | Cannot act (worse stun) | Paralysis cure, time |

---

## Counter/Parry System

**To prevent spam**:
- **Counter** requires Defend action first
- **Counter** costs 10 SP per attempt
- **Counter** has cooldown (can't counter consecutive turns)
- **Parry** is a skill that must be learned
- **Parry** has timing element (choose before enemy acts)
- Failed parry = extra damage taken

---

## Magic Balance

**To prevent magic dominance**:
- SP is scarce (potions expensive, rest sites rare)
- Many enemies have magic resistance
- Physical damage has no resource cost
- Magic has cast time (some spells take 2 turns)
- Silence status completely disables magic

---

## Enemy AI Patterns

Each enemy type has a behavior pattern:

```typescript
interface EnemyBehavior {
  default: Action;
  conditions: ConditionalAction[];
}

interface ConditionalAction {
  condition: string;
  action: Action;
  priority: number;
}
```

### Example Behaviors

**Goblin (Coward)**
```typescript
{
  default: 'attack',
  conditions: [
    { condition: 'hp < 30%', action: 'flee', priority: 1 },
    { condition: 'allies_dead', action: 'flee', priority: 2 },
  ]
}
```

**Troll (Regenerator)**
```typescript
{
  default: 'attack',
  conditions: [
    { condition: 'hp < 80%', action: 'regenerate', priority: 1 },
    { condition: 'hp < 30%', action: 'berserk', priority: 0 },
  ]
}
```

**Necromancer (Summoner)**
```typescript
{
  default: 'summon_skeleton',
  conditions: [
    { condition: 'has_minions', action: 'buff_minions', priority: 1 },
    { condition: 'minions >= 3', action: 'dark_magic', priority: 1 },
    { condition: 'hp < 40%', action: 'life_drain', priority: 0 },
    { condition: 'alone', action: 'dark_magic', priority: 2 },
  ]
}
```

**Slime (Splitter)**
```typescript
{
  default: 'absorb', // Weak attack that heals
  conditions: [
    { condition: 'hp < 50%', action: 'split', priority: 0 },
  ]
}
```

**Dragon (Multi-Phase)**
```typescript
{
  default: 'claw_attack',
  conditions: [
    { condition: 'turn % 3 == 0', action: 'fire_breath', priority: 1 },
    { condition: 'hp < 50%', action: 'enrage', priority: 0 },
    { condition: 'hp < 25%', action: 'desperation_attack', priority: 0 },
  ]
}
```

---

## Power Balance

### Expected Power by Level

| Level | Floor Range | Monster CR | Effective Stat (SSS) |
|-------|-------------|------------|----------------------|
| 1 | 1-10 | 1.0-2.5 | 500-1490 |
| 2 | 6-15 | 2.0-3.5 | 1000-1990 |
| 3 | 12-25 | 3.0-5.0 | 1500-2490 |
| 4 | 20-35 | 4.5-6.5 | 2000-2990 |
| 5 | 30-45 | 6.0-8.5 | 2500-3490 |
| 6 | 40-55 | 7.5-10.5 | 3000-3990 |
| 7 | 50-70 | 9.0-12.5 | 3500-4490 |
| 8 | 60-85 | 11.0-14.5 | 4000-4990 |
| 9 | 75-95 | 13.0-17.0 | 4500-5490 |
| 10 | 90-100+ | 15.0+ | 5000-5990 |

### Preventing Power Creep

1. **Floor CR caps** - Floor determines max monster CR, not player level
2. **Level-gated achievements** - Can't level just by grinding weak enemies
3. **Stat growth diminishing** - Higher grades require more proficiency
4. **Equipment requirements** - Best gear needs high stats AND high level
5. **Paragon as ceiling** - Level 10 is max, focus shifts to optimization

---

## Skill Observation System (KonoSuba Style)

### Core Concept

You cannot learn a skill unless you have **seen** it performed.

### Skill Learning Flow

1. **Observe** - See a skill used (by enemy, NPC, or ally)
2. **Research** (Optional) - Confirm skill exists at Library/Academy
3. **Demonstration** - Someone shows you the skill intentionally
4. **Learn** - Spend Skill Points to acquire

### Observation Sources

| Source | Requirements |
|--------|--------------|
| **Enemy** | Enemy uses skill, you survive combat |
| **NPC** | High reputation (+11 or higher), pay gold + SP |
| **Ally** | Party member uses skill in combat |
| **Scroll** | Find skill scroll as loot |
| **Training** | Academy instructor demonstrates (costs gold) |

### Learning from Enemies

When an enemy uses a skill:
1. Skill is added to your "Observed Skills" list
2. After combat (if you survive), you can attempt to learn it
3. Spend Skill Points to permanently acquire the skill
4. SP cost scales with skill power
