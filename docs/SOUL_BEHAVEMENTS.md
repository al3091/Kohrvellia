# KOHRVELLIA - Soul System: Behavements

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.
> See [SOUL_TITLES.md](SOUL_TITLES.md) for title generation.

---

## Behavioral Vectors (Pillars)

Each behavement belongs to exactly one vector. Vectors represent fundamental playstyle pillars.

| Vector | Description |
|--------|-------------|
| **COMBAT_PHYSICAL** | Physical damage, melee, weapon mastery |
| **COMBAT_MAGIC** | Magic damage, spell use, mana efficiency |
| **DEFENSE_TANK** | Damage taken, blocking, high armor |
| **DEFENSE_EVASION** | Dodges, escapes, stealth |
| **RISK_TAKING** | Underleveled fights, low HP wins, deep dives |
| **CAUTION** | Safe retreats, heal before fight, overleveled |
| **SOCIAL** | NPC interactions, negotiations, reputation |
| **EXPLORATION** | Rooms discovered, secrets found, traps disarmed |
| **RESOURCE** | Gold earned, items hoarded, efficiency |
| **GLORY** | Hard-path choices, high-tier level-ups |

---

## Weight System

Weights determine how "impressive" completing a behavement is.

| Weight | Value | Examples |
|--------|-------|----------|
| TRIVIAL | 1 | Use consumables, take damage |
| EASY | 2 | Win overleveled, give gifts |
| MODERATE | 5 | Basic kills, gold earned, rooms explored |
| HARD | 10 | Critical hits, quests, crafting |
| VERY_HARD | 25 | Weapon mastery, no-damage wins |
| EXTREME | 50 | Solo elites, survive 1 HP |
| LEGENDARY | 100 | Floor 100, solo legendary monsters |

---

## Complete Behavement List (85+)

### COMBAT_PHYSICAL Vector (12)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| PHYS_01 | Total Physical Damage | 100,000 | 5 |
| PHYS_02 | Melee Kills | 500 | 5 |
| PHYS_03 | Ranged Kills | 500 | 5 |
| PHYS_04 | Critical Hits | 250 | 10 |
| PHYS_05 | One-Shot Kills | 100 | 10 |
| PHYS_06 | Weapon Mastery | 5 weapons at 50+ | 25 |
| PHYS_07 | STR Weapon Kills | 200 | 5 |
| PHYS_08 | AGI Weapon Kills | 200 | 5 |
| PHYS_09 | Counter Attacks | 100 | 10 |
| PHYS_10 | Parry Perfects | 50 | 25 |
| PHYS_11 | Combo Chains | 50 | 10 |
| PHYS_12 | Execution Finishers | 100 | 10 |

### COMBAT_MAGIC Vector (12)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| MAGIC_01 | Total Magic Damage | 100,000 | 5 |
| MAGIC_02 | Spell Kills | 500 | 5 |
| MAGIC_03 | Fire Damage | 25,000 | 5 |
| MAGIC_04 | Ice Damage | 25,000 | 5 |
| MAGIC_05 | Lightning Damage | 25,000 | 5 |
| MAGIC_06 | Holy Damage | 25,000 | 10 |
| MAGIC_07 | Dark Damage | 25,000 | 10 |
| MAGIC_08 | Mana Efficiency | 80% avg | 25 |
| MAGIC_09 | Spell School Mastery | 5 schools at 30+ | 25 |
| MAGIC_10 | Status Inflictions | 500 | 5 |
| MAGIC_11 | Multi-Target Hits | 200 | 10 |
| MAGIC_12 | No-Weapon Wins | 100 | 25 |

### DEFENSE_TANK Vector (10)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| TANK_01 | Total Damage Taken | 500,000 | 1 |
| TANK_02 | Successful Blocks | 500 | 5 |
| TANK_03 | Damage Mitigated | 200,000 | 10 |
| TANK_04 | Survive at 1 HP | 25 | 50 |
| TANK_05 | Heavy Armor Kills | 200 | 5 |
| TANK_06 | Shield Bashes | 100 | 10 |
| TANK_07 | Taunt Uses | 100 | 10 |
| TANK_08 | No Dodge Wins | 50 | 25 |
| TANK_09 | Massive Hit Survived | 500+ dmg single | 50 |
| TANK_10 | Regeneration Healing | 50,000 | 10 |

### DEFENSE_EVASION Vector (10)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| EVADE_01 | Total Dodges | 1000 | 5 |
| EVADE_02 | Perfect Dodges | 200 | 25 |
| EVADE_03 | No Damage Wins | 100 | 50 |
| EVADE_04 | Stealth Kills | 100 | 10 |
| EVADE_05 | Flee Successes | 50 | 5 |
| EVADE_06 | Light Armor Kills | 200 | 5 |
| EVADE_07 | Trap Avoidance | 100 | 10 |
| EVADE_08 | Ambush Escapes | 25 | 25 |
| EVADE_09 | Speed Kills | 50 | 25 |
| EVADE_10 | Hit Streak No Damage | 20 consecutive | 50 |

### RISK_TAKING Vector (10)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| RISK_01 | Underleveled Wins | 50 | 50 |
| RISK_02 | Low HP Victories | 100 | 25 |
| RISK_03 | Deep Floor Reached | Floor 50 | 25 |
| RISK_04 | Longest Descent | 20 floors | 25 |
| RISK_05 | Fight After Warning | 100 | 10 |
| RISK_06 | No Rest Run | Floor 10 | 50 |
| RISK_07 | Elite Solo Kills | 25 | 50 |
| RISK_08 | Legendary Solo | 5 | 100 |
| RISK_09 | Multiple Enemy Fights | 100 | 10 |
| RISK_10 | CR Difference Wins | 100 | 25 |

### CAUTION Vector (8)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| SAFE_01 | Full HP Wins | 200 | 10 |
| SAFE_02 | Overleveled Wins | 200 | 2 |
| SAFE_03 | Pre-Heal Actions | 500 | 5 |
| SAFE_04 | Safe Retreats | 100 | 5 |
| SAFE_05 | Item Buffer | 50 fights | 10 |
| SAFE_06 | Floor Clear Rate | 90%+ rooms | 25 |
| SAFE_07 | Return After Boss | 25 | 10 |
| SAFE_08 | Trap Detection Rate | 80% | 25 |

### SOCIAL Vector (8)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| SOC_01 | NPC Conversations | 500 | 2 |
| SOC_02 | Max Reputation NPCs | 10 | 50 |
| SOC_03 | Negotiations Won | 100 | 10 |
| SOC_04 | Skills Learned NPCs | 25 | 25 |
| SOC_05 | Quests Completed | 100 | 10 |
| SOC_06 | Gifts Given | 200 | 2 |
| SOC_07 | Intimidation Successes | 50 | 10 |
| SOC_08 | Persuasion Successes | 50 | 10 |

### EXPLORATION Vector (8)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| EXPL_01 | Rooms Explored | 5000 | 5 |
| EXPL_02 | Secret Rooms | 100 | 25 |
| EXPL_03 | Traps Disarmed | 200 | 10 |
| EXPL_04 | Locked Chests Opened | 200 | 10 |
| EXPL_05 | Biomes Discovered | All (9) | 25 |
| EXPL_06 | Unique Monsters Seen | 200 | 25 |
| EXPL_07 | Shrine Blessings | 100 | 10 |
| EXPL_08 | Floor 100 Reached | 1 | 100 |

### RESOURCE Vector (7)

| ID | Name | Target | Weight |
|----|------|--------|--------|
| RES_01 | Gold Earned | 1,000,000 | 5 |
| RES_02 | Items Collected | 2000 | 2 |
| RES_03 | Legendary Items | 25 | 50 |
| RES_04 | Consumables Used | 500 | 1 |
| RES_05 | Gold Efficiency | 90% kept | 25 |
| RES_06 | Gear Upgrades | 100 | 5 |
| RES_07 | Crafting Actions | 100 | 10 |

### GLORY Vector (10) - NEW

Tracks players who choose the hardest level-up paths.

| ID | Name | Target | Weight |
|----|------|--------|--------|
| GLORY_01 | Tier Climber | 9 CHALLENGING+ | 10 |
| GLORY_02 | Heroic Path | 5 HEROIC+ | 25 |
| GLORY_03 | Legendary Pursuer | 3 LEGENDARY+ | 50 |
| GLORY_04 | Mythic Seeker | 1 MYTHIC | 100 |
| GLORY_05 | Glory Streak | 5 consecutive HEROIC+ | 50 |
| GLORY_06 | Deity Challenger | 3 God Challenges completed | 25 |
| GLORY_07 | Refused STANDARD | 9 level-ups w/o STANDARD | 50 |
| GLORY_08 | Bonus Hunter | 25 tier bonus stat points | 25 |
| GLORY_09 | Title Collector | 5 different title modifiers | 25 |
| GLORY_10 | Perfect Glory | All 9 level-ups at HEROIC+ | 100 |

---

## Implementation Architecture

### Store Interface

```typescript
interface DenatusState {
  behavements: Record<BehavementId, BehavementProgress>;
  vectorScores: Record<BehaviorVector, number>;
  lastCalculatedTitle: GeneratedTitle | null;
  hintHistory: DeityHint[];

  // Actions
  trackAction: (action: TrackedAction) => void;
  getVectorScores: () => Record<BehaviorVector, number>;
  calculateTitle: () => GeneratedTitle;
  generateDeityHint: () => DeityHint | null;
}

interface BehavementProgress {
  current: number;
  target: number;
  weight: number;
  vector: BehaviorVector;
  completed: boolean;
}
```

### Tracking Hooks

```typescript
// Hook into combat engine
function onDamageDealt(damage: number, type: DamageType, weapon: Weapon) {
  if (type === 'physical') {
    denatusStore.trackAction({ type: 'PHYS_DAMAGE', value: damage });
  }
}

// Hook into combat resolution
function onCombatEnd(result: CombatResult) {
  if (result.victory) {
    if (result.playerHP === result.playerMaxHP) {
      denatusStore.trackAction({ type: 'FULL_HP_WIN', value: 1 });
    }
    if (result.playerHP < result.playerMaxHP * 0.2) {
      denatusStore.trackAction({ type: 'LOW_HP_WIN', value: 1 });
    }
  }
}
```

---

## Testing Scenarios

### Scenario 1: Pure Mage
**Playstyle**: Only uses magic, cautious
**Expected Title**: "Master Sage Invoker"

### Scenario 2: Berserker
**Playstyle**: Melee only, high risk, low HP fights
**Expected Title**: "Legendary Iron Slayer" or "Heroic Savage Gambler"

### Scenario 3: Tank
**Playstyle**: Heavy armor, blocks everything
**Expected Title**: "Master Iron Guardian"

### Scenario 4: Social Player
**Playstyle**: Max NPC reputation, quests
**Expected Title**: "Grandmaster Charming Diplomat"

### Scenario 5: Glory Seeker
**Playstyle**: Always chooses hardest achievements
**Expected Title**: "[High CR] [Stats] Champion/Legend/Demigod"
