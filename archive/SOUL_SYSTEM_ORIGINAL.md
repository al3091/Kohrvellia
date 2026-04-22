# KOHRVELLIA - Soul System (Denatus)

## Overview

The **Soul System** (internally called "Denatus") is a hidden tracking mechanism that observes every action the player takes throughout their playthrough. At Level 10, when the player reaches Paragon evolution, the system generates a **unique title** with corresponding **permanent buffs** based entirely on how the player played the game.

This system ensures that every player's Paragon is meaningfully different, creating emergent identity from gameplay rather than preset choices.

---

## Core Concept

### Hidden Tracking
- Player **never sees** the raw tracking data
- No progress bars visible (unlike achievements)
- Only vague hints from patron deity

### Title Revelation
- Revealed at **Level 10 (Paragon)**
- Special ceremony screen
- Title becomes permanent identity
- Grants unique buffs

### Emergent Identity
- Title reflects actual playstyle
- No two players with identical histories get identical titles
- Encourages natural play, not gaming the system

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

### Score Ranges
| Score Range | CR Adjective | Buff Magnitude |
|-------------|--------------|----------------|
| 0-20% | Novice | +5% |
| 21-35% | Apprentice | +8% |
| 36-50% | Journeyman | +12% |
| 51-65% | Adept | +18% |
| 66-75% | Expert | +25% |
| 76-85% | Master | +32% |
| 86-92% | Grandmaster | +40% |
| 93-97% | Heroic | +45% |
| 98-99% | Legendary | +48% |
| 100% | Mythic | +50% |

### What Affects Score
- **Completion percentage** of each behavement
- **Weight** of completed behavements (harder = more impactful)
- Score is **NOT** just count of completed behavements
- Partially completed behavements contribute proportionally

---

## Stat Adjective (Top 2 Stats)

The Stat Adjective is determined by the player's **two highest stats** at the moment of Paragon evolution.

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
The Stat Adjective grants **+15% bonus** to both contributing stats.

Example: "Iron" (STR + END) grants:
- +15% STR-based damage
- +15% END-based HP/resistances

---

## Skill Noun (Dominant Behavior Vector)

The Skill Noun is determined by the player's **highest-scoring behavioral vector**.

### Vector Calculation
```typescript
function calculateDominantVector(behavements: Behavement[]): BehaviorVector {
  const vectorScores: Record<BehaviorVector, number> = {};

  for (const b of behavements) {
    const progress = Math.min(b.current / b.target, 1.0);
    const contribution = progress * b.weight;
    vectorScores[b.vector] = (vectorScores[b.vector] || 0) + contribution;
  }

  return getHighestScoringVector(vectorScores);
}
```

### Vectors and Their Nouns
| Vector | Primary Noun | Secondary Nouns | Passive Ability |
|--------|--------------|-----------------|-----------------|
| COMBAT_PHYSICAL | Slayer | Warrior, Destroyer, Berserker | +20% physical damage |
| COMBAT_MAGIC | Invoker | Mage, Sorcerer, Arcanist | +20% magic damage, -10% SP cost |
| DEFENSE_TANK | Guardian | Sentinel, Bulwark, Protector | +25% damage reduction |
| DEFENSE_EVASION | Shadow | Phantom, Ghost, Specter | +30% dodge chance |
| RISK_TAKING | Gambler | Daredevil, Madman, Reckless | +50% crit damage, -10% HP |
| CAUTION | Tactician | Strategist, Planner, Analyst | +20% item effectiveness |
| SOCIAL | Diplomat | Negotiator, Merchant, Envoy | +30% reputation gain |
| EXPLORATION | Seeker | Explorer, Pioneer, Wanderer | +25% loot discovery |
| RESOURCE | Artisan | Smith, Creator, Hoarder | +20% gold, +15% crafting |
| **GLORY** | **Champion** | Legend, Demigod | +25% to all tier bonus rewards |

### GLORY Special Nouns (Tiered)

GLORY has special escalating nouns based on dominance level:

| GLORY Dominance | Noun | Passive Ability |
|-----------------|------|-----------------|
| High (top 3 vectors) | Champion | +25% to all achievement tier bonus rewards |
| Dominant (top vector) | Legend | +50% to all tier bonuses, enemies have -10% accuracy vs you |
| Maximum (80%+ of total) | Demigod | Auto-dodge first lethal hit per floor, +100% tier bonuses |

### Noun Selection
The system selects the **Primary Noun** by default. Secondary nouns are chosen when:
- Player's second-highest vector is within 10% of the first
- Specific behavement combinations trigger special nouns

---

## Behavioral Vectors (Pillars)

Each behavement belongs to exactly one vector. Vectors represent fundamental playstyle pillars.

### Vector Definitions

#### COMBAT_PHYSICAL
Tracks all physical damage dealing, weapon mastery, and martial prowess.
- Melee kills, ranged kills, critical hits
- Weapon type proficiency
- Counter attacks, parries, combos

#### COMBAT_MAGIC
Tracks all magical damage dealing, spell usage, and arcane proficiency.
- Spell kills, elemental damage
- Mana efficiency, school mastery
- Status effect applications

#### DEFENSE_TANK
Tracks damage absorption, blocking, and front-line presence.
- Total damage taken
- Successful blocks
- Heavy armor usage
- Survival at low HP

#### DEFENSE_EVASION
Tracks dodging, stealth, and avoiding damage entirely.
- Total dodges
- No-damage victories
- Stealth kills
- Trap avoidance

#### RISK_TAKING
Tracks dangerous decisions and punching above weight class.
- Underleveled victories
- Low HP victories
- Deep floor progression
- Fighting after CR warnings

#### CAUTION
Tracks safe, methodical play and resource management.
- Full HP victories
- Pre-healing behavior
- Safe retreats
- Thorough exploration

#### SOCIAL
Tracks NPC interactions, reputation building, and diplomacy.
- Conversations, negotiations
- Reputation levels reached
- Skills learned from NPCs
- Quests completed

#### EXPLORATION
Tracks discovery, environmental interaction, and curiosity.
- Rooms explored
- Secret rooms found
- Traps disarmed
- Unique encounters

#### RESOURCE
Tracks wealth accumulation, item management, and efficiency.
- Gold earned
- Items collected
- Crafting actions
- Resource efficiency ratios

#### GLORY (NEW)
Tracks players who consistently choose the hardest level-up paths.
- Achievement tier choices (STANDARD vs LEGENDARY)
- Consecutive high-tier level-ups
- God Challenges completed
- Title modifiers earned
- Refusal of easy paths

**Note**: Unlike other vectors that measure *what* you do, GLORY measures *how hard* you choose to do it.

---

## Complete Behavement List (85+)

### COMBAT_PHYSICAL Vector (12 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| PHYS_01 | Total Physical Damage | 100,000 | MODERATE (5) | Cumulative physical damage dealt |
| PHYS_02 | Melee Kills | 500 | MODERATE (5) | Enemies killed with melee weapons |
| PHYS_03 | Ranged Kills | 500 | MODERATE (5) | Enemies killed with ranged weapons |
| PHYS_04 | Critical Hits | 250 | HARD (10) | Land critical strikes |
| PHYS_05 | One-Shot Kills | 100 | HARD (10) | Kill enemy in a single hit |
| PHYS_06 | Weapon Mastery | 5 weapons at 50+ | VERY_HARD (25) | Master multiple weapon types |
| PHYS_07 | STR Weapon Kills | 200 | MODERATE (5) | Kills with STR-scaling weapons |
| PHYS_08 | AGI Weapon Kills | 200 | MODERATE (5) | Kills with AGI-scaling weapons |
| PHYS_09 | Counter Attacks | 100 | HARD (10) | Successful counter attacks |
| PHYS_10 | Parry Perfects | 50 | VERY_HARD (25) | Perfect parry timing |
| PHYS_11 | Combo Chains | 50 | HARD (10) | Complete 5+ hit combos |
| PHYS_12 | Execution Finishers | 100 | HARD (10) | Kill with execute skill |

### COMBAT_MAGIC Vector (12 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| MAGIC_01 | Total Magic Damage | 100,000 | MODERATE (5) | Cumulative magic damage dealt |
| MAGIC_02 | Spell Kills | 500 | MODERATE (5) | Enemies killed with magic |
| MAGIC_03 | Fire Damage | 25,000 | MODERATE (5) | Fire element damage |
| MAGIC_04 | Ice Damage | 25,000 | MODERATE (5) | Ice element damage |
| MAGIC_05 | Lightning Damage | 25,000 | MODERATE (5) | Lightning element damage |
| MAGIC_06 | Holy Damage | 25,000 | HARD (10) | Holy element damage |
| MAGIC_07 | Dark Damage | 25,000 | HARD (10) | Dark element damage |
| MAGIC_08 | Mana Efficiency | 80% avg | VERY_HARD (25) | Average SP remaining after fights |
| MAGIC_09 | Spell School Mastery | 5 schools at 30+ | VERY_HARD (25) | Master multiple spell schools |
| MAGIC_10 | Status Inflictions | 500 | MODERATE (5) | Apply status effects via magic |
| MAGIC_11 | Multi-Target Hits | 200 | HARD (10) | Hit 3+ enemies with one spell |
| MAGIC_12 | No-Weapon Wins | 100 | VERY_HARD (25) | Win fights using only magic |

### DEFENSE_TANK Vector (10 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| TANK_01 | Total Damage Taken | 500,000 | TRIVIAL (1) | Cumulative damage received |
| TANK_02 | Successful Blocks | 500 | MODERATE (5) | Block enemy attacks |
| TANK_03 | Damage Mitigated | 200,000 | HARD (10) | Damage reduced by armor/skills |
| TANK_04 | Survive at 1 HP | 25 | EXTREME (50) | Survive with exactly 1 HP |
| TANK_05 | Heavy Armor Kills | 200 | MODERATE (5) | Kills while wearing heavy armor |
| TANK_06 | Shield Bashes | 100 | HARD (10) | Offensive shield use |
| TANK_07 | Taunt Uses | 100 | HARD (10) | Draw enemy aggro |
| TANK_08 | No Dodge Wins | 50 | VERY_HARD (25) | Win without dodging |
| TANK_09 | Massive Hit Survived | 500+ dmg single hit | EXTREME (50) | Tank massive damage |
| TANK_10 | Regeneration Healing | 50,000 | HARD (10) | HP from regeneration |

### DEFENSE_EVASION Vector (10 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| EVADE_01 | Total Dodges | 1000 | MODERATE (5) | Successful dodges |
| EVADE_02 | Perfect Dodges | 200 | VERY_HARD (25) | Dodge at last moment |
| EVADE_03 | No Damage Wins | 100 | EXTREME (50) | Win fights taking 0 damage |
| EVADE_04 | Stealth Kills | 100 | HARD (10) | Kill from stealth |
| EVADE_05 | Flee Successes | 50 | MODERATE (5) | Successfully flee combat |
| EVADE_06 | Light Armor Kills | 200 | MODERATE (5) | Kills in light armor |
| EVADE_07 | Trap Avoidance | 100 | HARD (10) | Avoid triggered traps |
| EVADE_08 | Ambush Escapes | 25 | VERY_HARD (25) | Escape ambush encounters |
| EVADE_09 | Speed Kills | 50 | VERY_HARD (25) | Kill before enemy acts |
| EVADE_10 | Hit Streak No Damage | 20 consecutive | EXTREME (50) | 20 attacks dealt, 0 received |

### RISK_TAKING Vector (10 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| RISK_01 | Underleveled Wins | 50 | EXTREME (50) | Win when 5+ levels below enemy |
| RISK_02 | Low HP Victories | 100 | VERY_HARD (25) | Win with <20% HP remaining |
| RISK_03 | Deep Floor Reached | Floor 50 | VERY_HARD (25) | Reach deep floors |
| RISK_04 | Longest Descent | 20 floors | VERY_HARD (25) | Floors descended without returning |
| RISK_05 | Fight After Warning | 100 | HARD (10) | Engage after CR warning |
| RISK_06 | No Rest Run | Floor 10 | EXTREME (50) | Reach floor 10 without resting |
| RISK_07 | Elite Solo Kills | 25 | EXTREME (50) | Solo elite without items |
| RISK_08 | Legendary Solo | 5 | LEGENDARY (100) | Solo legendary monsters |
| RISK_09 | Multiple Enemy Fights | 100 | HARD (10) | Fight 3+ enemies at once |
| RISK_10 | CR Difference Wins | 100 | VERY_HARD (25) | Win vs 3+ CR higher enemy |

### CAUTION Vector (8 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| SAFE_01 | Full HP Wins | 200 | HARD (10) | Win with 100% HP |
| SAFE_02 | Overleveled Wins | 200 | EASY (2) | Win when 3+ levels above |
| SAFE_03 | Pre-Heal Actions | 500 | MODERATE (5) | Heal before combat |
| SAFE_04 | Safe Retreats | 100 | MODERATE (5) | Retreat at <50% HP |
| SAFE_05 | Item Buffer | 50 fights | HARD (10) | Always keep 3+ potions |
| SAFE_06 | Floor Clear Rate | 90%+ rooms | VERY_HARD (25) | Clear almost every room |
| SAFE_07 | Return After Boss | 25 | HARD (10) | Return to town after boss |
| SAFE_08 | Trap Detection Rate | 80% | VERY_HARD (25) | Detect most traps before trigger |

### SOCIAL Vector (8 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| SOC_01 | NPC Conversations | 500 | EASY (2) | Talk to NPCs |
| SOC_02 | Max Reputation NPCs | 10 | EXTREME (50) | Reach +20 with 10 NPCs |
| SOC_03 | Negotiations Won | 100 | HARD (10) | Negotiate successfully |
| SOC_04 | Skills Learned NPCs | 25 | VERY_HARD (25) | Learn skills from NPCs |
| SOC_05 | Quests Completed | 100 | HARD (10) | Complete NPC quests |
| SOC_06 | Gifts Given | 200 | EASY (2) | Give items to NPCs |
| SOC_07 | Intimidation Successes | 50 | HARD (10) | Intimidate successfully |
| SOC_08 | Persuasion Successes | 50 | HARD (10) | Persuade successfully |

### EXPLORATION Vector (8 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| EXPL_01 | Rooms Explored | 5000 | MODERATE (5) | Total rooms entered |
| EXPL_02 | Secret Rooms | 100 | VERY_HARD (25) | Find hidden rooms |
| EXPL_03 | Traps Disarmed | 200 | HARD (10) | Disarm traps |
| EXPL_04 | Locked Chests Opened | 200 | HARD (10) | Pick locks |
| EXPL_05 | Biomes Discovered | All (9) | VERY_HARD (25) | Visit every biome type |
| EXPL_06 | Unique Monsters Seen | 200 | VERY_HARD (25) | Encounter unique pantheon monsters |
| EXPL_07 | Shrine Blessings | 100 | HARD (10) | Receive shrine blessings |
| EXPL_08 | Floor 100 Reached | 1 | LEGENDARY (100) | Reach floor 100 |

### RESOURCE Vector (7 behavements)

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| RES_01 | Gold Earned | 1,000,000 | MODERATE (5) | Total gold acquired |
| RES_02 | Items Collected | 2000 | EASY (2) | Total items picked up |
| RES_03 | Legendary Items | 25 | EXTREME (50) | Find legendary items |
| RES_04 | Consumables Used | 500 | TRIVIAL (1) | Use consumable items |
| RES_05 | Gold Efficiency | 90% kept | VERY_HARD (25) | Gold kept vs earned ratio |
| RES_06 | Gear Upgrades | 100 | MODERATE (5) | Upgrade equipment |
| RES_07 | Crafting Actions | 100 | HARD (10) | Craft items |

### GLORY Vector (10 behavements) - NEW

Tracks players who consistently choose the hardest level-up paths.

| ID | Name | Target | Weight | Description |
|----|------|--------|--------|-------------|
| GLORY_01 | Tier Climber | 9 CHALLENGING+ level-ups | HARD (10) | Level up via CHALLENGING+ tiers |
| GLORY_02 | Heroic Path | 5 HEROIC+ level-ups | VERY_HARD (25) | Level up via HEROIC+ tiers |
| GLORY_03 | Legendary Pursuer | 3 LEGENDARY+ level-ups | EXTREME (50) | Level up via LEGENDARY+ tiers |
| GLORY_04 | Mythic Seeker | 1 MYTHIC level-up | LEGENDARY (100) | Achieve the impossible |
| GLORY_05 | Glory Streak | 5 consecutive HEROIC+ | EXTREME (50) | Never take the easy path |
| GLORY_06 | Deity Challenger | 3 God Challenges completed | VERY_HARD (25) | Accept and complete deity trials |
| GLORY_07 | Refused STANDARD | 9 level-ups without STANDARD | EXTREME (50) | Never take baseline achievements |
| GLORY_08 | Bonus Hunter | 25 tier bonus stat points | VERY_HARD (25) | Maximize rewards through difficulty |
| GLORY_09 | Title Collector | 5 different title modifiers | VERY_HARD (25) | Earn "Bold", "Fearless", etc. |
| GLORY_10 | Perfect Glory | All 9 level-ups at HEROIC+ | LEGENDARY (100) | Ultimate glory-seeker |

---

## Weight System

Weights determine how "impressive" completing a behavement is. Higher weight = more contribution to CR score AND vector dominance.

### Weight Scale
| Weight | Value | Examples |
|--------|-------|----------|
| TRIVIAL | 1 | Use consumables, take damage |
| EASY | 2 | Win overleveled, give gifts |
| MODERATE | 5 | Basic kills, gold earned, rooms explored |
| HARD | 10 | Critical hits, quests, crafting |
| VERY_HARD | 25 | Weapon mastery, no-damage wins, deep exploration |
| EXTREME | 50 | Solo elites, survive 1 HP, max reputation |
| LEGENDARY | 100 | Floor 100, solo legendary monsters |

### Weight Ratios
The weight system creates natural ratios:
- Killing 100 goblins (EASY x 100) = 200 weighted points
- Solo killing 1 legendary (LEGENDARY x 1) = 100 weighted points
- Reaching floor 100 (LEGENDARY x 1) = 100 weighted points

This ensures both breadth and depth contribute meaningfully.

---

## Deity Hint System

The player's patron deity provides **vague hints** about their developing title based on behavement progress.

### Hint Triggers
Hints trigger when:
- A vector reaches 25%, 50%, 75% dominance
- A behavement reaches 50%, 75%, 100% completion
- Player's top 2 stats shift

### Example Hints by Deity Personality

**Encouraging Deity (e.g., Athena)**:
- "Your strength grows with each battle..." (COMBAT_PHYSICAL rising)
- "I see wisdom in your caution..." (CAUTION dominant)
- "The spirits favor your diplomacy..." (SOCIAL high)

**Stern Deity (e.g., Ares)**:
- "You fight with reckless abandon. Good." (RISK_TAKING high)
- "Your blade speaks louder than words." (COMBAT_PHYSICAL dominant)
- "Cowardice? Or strategy?" (CAUTION rising)

**Mysterious Deity (e.g., Hecate)**:
- "The shadows recognize you..." (DEFENSE_EVASION high)
- "Fortune weaves around you strangely..." (LCK-related behavior)
- "Your soul grows in unexpected directions..." (vector shift)

**Playful Deity (e.g., Loki)**:
- "Dancing with danger, are we?" (RISK_TAKING high)
- "Clever fingers, clever tongue..." (EXPLORATION + SOCIAL)
- "Even I can't predict where you're going..." (balanced vectors)

---

## Title Buff Generation

When the Paragon title is generated, each component contributes specific buffs.

### CR Adjective Buff (Magnitude)
The CR Adjective determines the **magnitude** of all Paragon buffs.

| CR Adjective | Magnitude Multiplier |
|--------------|---------------------|
| Novice | 1.0x |
| Apprentice | 1.2x |
| Journeyman | 1.4x |
| Adept | 1.6x |
| Expert | 1.8x |
| Master | 2.0x |
| Grandmaster | 2.3x |
| Heroic | 2.6x |
| Legendary | 2.8x |
| Mythic | 3.0x |

### Stat Adjective Buff (Stat Bonus)
The Stat Adjective grants bonuses to the **two contributing stats**.

Base bonus: +15% to both stats
With magnitude: +15% * CR_Magnitude

Example: "Master Iron" = +15% * 2.0 = **+30% to STR and END**

### Skill Noun Buff (Passive Ability)
The Skill Noun grants a **unique passive ability**.

| Noun | Base Passive | With Magnitude |
|------|--------------|----------------|
| Slayer | +20% physical damage | +20% * magnitude |
| Invoker | +20% magic damage, -10% SP cost | Scales with magnitude |
| Guardian | +25% damage reduction | Scales with magnitude |
| Shadow | +30% dodge chance | Scales with magnitude |
| Gambler | +50% crit damage, -10% HP | Fixed (risk-reward) |
| Tactician | +20% item effectiveness | Scales with magnitude |
| Diplomat | +30% reputation gain | Scales with magnitude |
| Seeker | +25% loot discovery | Scales with magnitude |
| Artisan | +20% gold, +15% crafting | Scales with magnitude |
| **Champion** | +25% achievement tier bonuses | Scales with magnitude |
| **Legend** | +50% tier bonuses, enemy -10% accuracy | Scales with magnitude |
| **Demigod** | Auto-dodge first lethal/floor, +100% tier bonuses | Fixed (ultimate) |

---

## Implementation Architecture

### Store: denatusStore.ts
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

interface GeneratedTitle {
  crAdjective: CRAdjective;
  statAdjective: StatAdjective;
  skillNoun: SkillNoun;
  fullTitle: string;
  buffs: ParagonBuffs;
}
```

### Tracker: denatusTracker.ts
```typescript
// Hook into combat engine
function onDamageDealt(damage: number, type: DamageType, weapon: Weapon) {
  if (type === 'physical') {
    denatusStore.trackAction({ type: 'PHYS_DAMAGE', value: damage });
    if (weapon.statScaling === 'STR') {
      denatusStore.trackAction({ type: 'STR_WEAPON_HIT', value: 1 });
    }
  }
  // ... etc
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
    if (result.playerLevel < result.enemyLevel - 5) {
      denatusStore.trackAction({ type: 'UNDERLEVELED_WIN', value: 1 });
    }
  }
}

// Hook into NPC interactions
function onNPCChat(npc: NPC, topic: string) {
  denatusStore.trackAction({ type: 'NPC_CONVERSATION', value: 1 });
}

// ... hooks throughout all game systems
```

### Title Generator: titleGenerator.ts
```typescript
function generateParagonTitle(state: DenatusState, character: Character): GeneratedTitle {
  // 1. Calculate CR Adjective
  const behavementScore = calculateBehavementScore(state.behavements);
  const crAdjective = getCRAdjectiveFromScore(behavementScore);

  // 2. Calculate Stat Adjective
  const [stat1, stat2] = getTopTwoStats(character.stats);
  const statAdjective = getStatAdjective(stat1, stat2);

  // 3. Calculate Skill Noun
  const dominantVector = getDominantVector(state.vectorScores);
  const skillNoun = getSkillNoun(dominantVector, state.vectorScores);

  // 4. Generate Buffs
  const buffs = generateParagonBuffs(crAdjective, statAdjective, skillNoun);

  return {
    crAdjective,
    statAdjective,
    skillNoun,
    fullTitle: `${crAdjective} ${statAdjective} ${skillNoun}`,
    buffs,
  };
}
```

---

## Testing Scenarios

### Scenario 1: Pure Mage
**Playstyle**: Only uses magic, cautious, never takes risks
**Expected Title**: "Master Sage Invoker" or similar
**Expected Buffs**: +Magic damage, +SP efficiency, INT/WIS bonuses

### Scenario 2: Berserker
**Playstyle**: Melee only, high risk, low HP fights
**Expected Title**: "Heroic Savage Gambler" or "Legendary Iron Slayer"
**Expected Buffs**: +Physical damage, +Crit damage, STR/AGI bonuses

### Scenario 3: Tank
**Playstyle**: Heavy armor, blocks everything, never dodges
**Expected Title**: "Master Iron Guardian"
**Expected Buffs**: +Damage reduction, STR/END bonuses

### Scenario 4: Social Player
**Playstyle**: Maxes NPC reputation, learns skills from NPCs, does quests
**Expected Title**: "Grandmaster Charming Diplomat"
**Expected Buffs**: +Reputation gain, CHA/PER bonuses

### Scenario 5: Jack-of-All-Trades
**Playstyle**: Balanced across all vectors
**Expected Title**: Varies based on slight dominance
**Expected Buffs**: Balanced across multiple areas

---

## Balance Considerations

### Preventing Gaming
1. **Hidden progress** - Player can't see exact numbers
2. **Weighted contributions** - Can't spam easy actions
3. **Natural play rewarded** - Playing to win naturally fills behavements
4. **No "best" title** - All titles are powerful in different ways

### Weight Calibration
Weights are calibrated so that:
- A player can't max score by grinding trivial actions
- Impressive feats (legendary solo, floor 100) are properly rewarded
- Breadth and depth both matter
- Natural playthrough reaches ~50-65% score (Adept-Expert)
- Only dedicated players reach 90%+ (Grandmaster+)

### Vector Balance
Vectors are balanced so that:
- Pure specialists get strong noun abilities
- Generalists get moderate buffs across multiple areas
- No vector is "better" than others
- Each vector has roughly equal total weight across behavements

---

## Future Considerations

### Meta-Progression
- Titles could persist across runs as achievements
- Unlock special content based on titles earned
- Leaderboards by title type

### Title Evolution
- Titles could evolve with continued play post-Paragon
- Sub-titles for specific achievements
- Title modifiers for rare feats

### Multiplayer Integration
- Share titles with other players
- Title-based matchmaking
- Cooperative bonuses based on complementary titles
