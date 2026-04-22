# KOHRVELLIA - Soul System: Titles

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.
> See [SOUL_BEHAVEMENTS.md](SOUL_BEHAVEMENTS.md) for tracking details.

---

## Overview

The **Soul System** (internally called "Denatus") is a hidden tracking mechanism that observes every action the player takes throughout their playthrough. At Level 10, when the player reaches Paragon evolution, the system generates a **unique title** with corresponding **permanent buffs** based entirely on how the player played the game.

### Key Principles

- **Hidden Tracking** - Player never sees raw tracking data
- **Title Revelation** - Revealed at Level 10 (Paragon) in special ceremony
- **Emergent Identity** - Title reflects actual playstyle
- **No two identical** - Players with different histories get different titles

---

## Title Structure

Every generated title follows this format:

```
[CR Adjective] + [Stat Adjective] + [Skill Noun]
```

### Examples

| Title | Breakdown |
|-------|-----------|
| Legendary Arcane Slayer | CR:Legendary + Stats:INT+STR + Behavior:PhysicalCombat |
| Heroic Swift Negotiator | CR:Heroic + Stats:AGI+INT + Behavior:Social |
| Master Iron Guardian | CR:Master + Stats:STR+END + Behavior:Tank |
| Grandmaster Elusive Shadow | CR:Grandmaster + Stats:AGI+LCK + Behavior:Evasion |
| Mythic Sage Invoker | CR:Mythic + Stats:INT+WIS + Behavior:Magic |

---

## CR Adjective (Achievement Score)

The CR Adjective is determined by the player's overall **weighted behavement completion score**.

### Score Ranges

| Score Range | CR Adjective | Buff Magnitude |
|-------------|--------------|----------------|
| 0-20% | Novice | 1.0x |
| 21-35% | Apprentice | 1.2x |
| 36-50% | Journeyman | 1.4x |
| 51-65% | Adept | 1.6x |
| 66-75% | Expert | 1.8x |
| 76-85% | Master | 2.0x |
| 86-92% | Grandmaster | 2.3x |
| 93-97% | Heroic | 2.6x |
| 98-99% | Legendary | 2.8x |
| 100% | Mythic | 3.0x |

### Calculation

```typescript
function calculateCRAdjective(behavements: Behavement[]): CRAdjective {
  let totalWeightedProgress = 0;
  let totalMaxWeight = 0;

  for (const b of behavements) {
    const progress = Math.min(b.current / b.target, 1.0);
    totalWeightedProgress += progress * b.weight;
    totalMaxWeight += b.weight;
  }

  const score = (totalWeightedProgress / totalMaxWeight) * 100;
  return getCRAdjectiveFromScore(score);
}
```

---

## Stat Adjective (Top 2 Stats)

The Stat Adjective is determined by the player's **two highest stats** at Paragon evolution.

### Complete Mapping (28 combinations)

| Top 2 Stats | Adjective | Associated Concept |
|-------------|-----------|-------------------|
| STR + END | Iron | Unyielding fortitude |
| STR + AGI | Savage | Brutal speed |
| STR + INT | Arcane | Magical might |
| STR + WIS | Holy | Divine strength |
| STR + PER | Precise | Calculated power |
| STR + CHA | Commanding | Authority through strength |
| STR + LCK | Fortunate | Blessed power |
| END + AGI | Resilient | Enduring mobility |
| END + INT | Stalwart | Unwavering intellect |
| END + WIS | Patient | Timeless wisdom |
| END + PER | Vigilant | Watchful endurance |
| END + CHA | Steadfast | Reliable presence |
| END + LCK | Enduring | Persistent fortune |
| AGI + INT | Swift | Quick-minded |
| AGI + WIS | Graceful | Elegant wisdom |
| AGI + PER | Keen | Sharp reflexes |
| AGI + CHA | Dashing | Charismatic speed |
| AGI + LCK | Elusive | Uncatchable |
| INT + WIS | Sage | Pure intellect |
| INT + PER | Analytical | Calculated precision |
| INT + CHA | Eloquent | Persuasive genius |
| INT + LCK | Brilliant | Inspired intellect |
| WIS + PER | Enlightened | Awakened awareness |
| WIS + CHA | Divine | Sacred presence |
| WIS + LCK | Fated | Destined wisdom |
| PER + CHA | Charming | Perceptive charisma |
| PER + LCK | Sharp | Lucky eye |
| CHA + LCK | Golden | Fortune's favorite |

### Stat Adjective Buffs

Grants **+15% bonus** to both contributing stats.
With magnitude: `+15% * CR_Magnitude`

Example: "Master Iron" = +15% * 2.0 = **+30% to STR and END**

---

## Skill Noun (Dominant Behavior Vector)

The Skill Noun is determined by the player's **highest-scoring behavioral vector**.

### Vectors and Their Nouns

| Vector | Primary Noun | Passive Ability |
|--------|--------------|-----------------|
| COMBAT_PHYSICAL | Slayer | +20% physical damage |
| COMBAT_MAGIC | Invoker | +20% magic damage, -10% SP cost |
| DEFENSE_TANK | Guardian | +25% damage reduction |
| DEFENSE_EVASION | Shadow | +30% dodge chance |
| RISK_TAKING | Gambler | +50% crit damage, -10% HP |
| CAUTION | Tactician | +20% item effectiveness |
| SOCIAL | Diplomat | +30% reputation gain |
| EXPLORATION | Seeker | +25% loot discovery |
| RESOURCE | Artisan | +20% gold, +15% crafting |
| **GLORY** | **Champion** | +25% to all tier bonus rewards |

### GLORY Special Nouns (Tiered)

| GLORY Dominance | Noun | Passive Ability |
|-----------------|------|-----------------|
| High (top 3 vectors) | Champion | +25% to all tier bonuses |
| Dominant (top vector) | Legend | +50% tier bonuses, enemy -10% accuracy |
| Maximum (80%+ of total) | Demigod | Auto-dodge first lethal/floor, +100% tier bonuses |

---

## Title Buff Generation

When the Paragon title is generated, each component contributes specific buffs.

### CR Adjective Buff (Magnitude)

Determines the **magnitude multiplier** of all Paragon buffs.

### Stat Adjective Buff (Stat Bonus)

Base: +15% to both contributing stats
With magnitude: +15% * CR_Magnitude

### Skill Noun Buff (Passive Ability)

Unique passive ability that scales with magnitude.

### Example Title

**"Master Iron Guardian"**
- CR: Master (2.0x magnitude)
- Stats: STR+END → +30% to both (15% * 2.0)
- Noun: Guardian → +50% damage reduction (25% * 2.0)

---

## Deity Hint System

The player's patron deity provides **vague hints** about their developing title based on behavement progress.

### Hint Triggers

- A vector reaches 25%, 50%, 75% dominance
- A behavement reaches 50%, 75%, 100% completion
- Player's top 2 stats shift

### Example Hints by Deity Personality

**Encouraging Deity (e.g., Athena)**:
- "Your strength grows with each battle..." (COMBAT_PHYSICAL rising)
- "I see wisdom in your caution..." (CAUTION dominant)

**Stern Deity (e.g., Ares)**:
- "You fight with reckless abandon. Good." (RISK_TAKING high)
- "Your blade speaks louder than words." (COMBAT_PHYSICAL dominant)

**Mysterious Deity (e.g., Hecate)**:
- "The shadows recognize you..." (DEFENSE_EVASION high)
- "Your soul grows in unexpected directions..." (vector shift)

**Playful Deity (e.g., Loki)**:
- "Dancing with danger, are we?" (RISK_TAKING high)
- "Even I can't predict where you're going..." (balanced vectors)

---

## Balance Considerations

### Preventing Gaming

1. **Hidden progress** - Player can't see exact numbers
2. **Weighted contributions** - Can't spam easy actions
3. **Natural play rewarded** - Playing to win naturally fills behavements
4. **No "best" title** - All titles are powerful in different ways

### Expected Score Distribution

- Natural playthrough: ~50-65% score (Adept-Expert)
- Dedicated players: 90%+ (Grandmaster+)
- Perfect optimization required for Mythic (100%)
