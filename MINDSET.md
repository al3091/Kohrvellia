# KOHRVELLIA - Mindset & Style Guide

> **Check this document before writing ANYTHING.** It exists to prevent reworks and maintain consistency across all Kohrvellia documentation.

---

## Core Philosophy

These are non-negotiable. Every design decision should align with at least one:

| Principle | Meaning | Violation Example |
|-----------|---------|-------------------|
| **Challenge, Not Grind** | Difficulty through smart choices, not time investment | XP bars, farmable resources |
| **Loot is King** | Dopamine comes from finding cool gear | "Numbers go up" progression |
| **Meaningful Choices** | Every decision has consequence | Reversible decisions, no stakes |
| **Push Your Luck** | Risk and reward are constant companions | Safe optimal paths |
| **Natural Play Rewarded** | Playing to win naturally fills progression | Forcing artificial optimization |

---

## Tone & Voice

### Who Are We Talking To?

**Both developers AND players.** The document bridges technical specification and narrative flavor.

### Voice Characteristics

| Do | Don't |
|----|-------|
| Be authoritative but welcoming | Be condescending or gatekeeping |
| Use active voice ("You stand before...") | Use passive voice ("The tower is stood before...") |
| Be poetic in flavor, precise in mechanics | Be vague about numbers or flowery about rules |
| Use contractions naturally (don't, can't) | Use slang or memes |
| Trust player intelligence | Over-explain obvious concepts |
| State design boundaries clearly ("CRITICAL:") | Hedge with "maybe" or "perhaps" |

### Example Voice

```
Good: "Death is PERMANENT. Everything you carry, everything you've become - gone."
Bad:  "When your character dies, you will lose your progress and need to start over."

Good: "The deeper you go, the greater the rewards."
Bad:  "Progression scales with floor depth in terms of loot quality."
```

---

## Flavor Text Rules

### Backstories (Character Creation)

**Pattern**: `"[Action revealing identity]. [Implied consequence or hook]."`

| Good | Bad |
|------|-----|
| "They said you lacked talent. They were wrong." | "You failed your apprenticeship but kept trying." |
| "Fate has plans for you, whether you like it or not." | "You come from a family with a curse." |
| "You were forged in fire like the blades you made." | "You grew up as a blacksmith's child." |

**Rules**:
- 1-2 sentences maximum
- End with a hook or contrast
- Address the character directly (implied "you")
- No backstory dumps

### Deity Abilities

**Pattern**: `*[Evocative Name]* - [Mechanical effect in plain terms]`

| Good | Bad |
|------|-----|
| *Berserk Rage* - 2x damage, 0 defense (toggle) | *Rage* - Increases damage significantly |
| *Valhalla's Call* - No death penalty once per run | *Death Protection* - Prevents permadeath |
| *Trickster's Luck* - Reroll any dice once per floor | *Lucky* - Sometimes reroll |

**Rules**:
- Name should evoke the deity's personality
- Mechanical effect must be precise (numbers, conditions)
- Trade-offs visible when applicable

### Achievement Names

**Pattern**: Memorable through metaphor, alliteration, or thematic resonance

| Good | Bad |
|------|-----|
| "Bloodless Victory" | "Win Without Damage" |
| "The Perfect Con" | "Complete Stealth Floor" |
| "Ascension Absolute" | "Best Achievement" |
| "Dragonblood Initiate" | "Survive Dragon" |

**Rules**:
- Never just describe the requirement
- Domain-specific achievements use deity possession ("Ares' First Offering", "Hades' Tithe")
- MYTHIC tier names should feel impossible ("The Impossible Novice")

### Tutorial Hints

**Pattern**: `"Tip: [Rule or advice]. [Optional consequence]."`

| Good | Bad |
|------|-----|
| "Tip: Different damage types work better against different enemies. Slash flesh, crush bone, pierce leather." | "Remember that the rock-paper-scissors system applies to damage types!" |
| "Rest sites are rare. The deeper you go, the fewer you'll find." | "Rest sites become less common as you progress through floors." |

**Rules**:
- Concise and actionable
- No NPC dialogue framing
- Trigger-based, contextual

---

## Formatting Rules

### When to Use Tables

- **Comparisons**: Stat combinations → Job options
- **Lookups**: Grade → Point range
- **Progression**: Floor range → CR range → Loot tiers
- **Reference**: Room types, NPC locations, status effects

### When to Use Bullet Lists

- **Sequential instructions**: First do A, then B, then C
- **Non-exhaustive examples**: "Such as X, Y, Z"
- **Feature lists**: Benefits, drawbacks, characteristics

### When to Use Code Blocks

- **TypeScript interfaces**: Store definitions, type declarations
- **Formulas**: `EffectiveStat = (Level × 500) + GradePoints`
- **Pseudocode flows**: Algorithm descriptions
- **In-game text**: Tutorial messages, flavor text examples

### Header Hierarchy

```markdown
# DOCUMENT TITLE
## System or Feature Group
### Specific Mechanic
#### Deep Dive (use sparingly)
```

**Rules**:
- Title Case for all headers
- No punctuation at end of headers
- Use `---` horizontal rules between major sections
- Never go deeper than `####`

### Section Length

- **Intro paragraphs**: 3-4 max before first table
- **Mechanics sections**: Table → Explanation → Examples
- **Lists**: Max 20 items before breaking into subsections

---

## Naming Conventions

### Stats

**Format**: Three-letter abbreviation, all caps

```
STR | PER | END | CHA | INT | AGI | WIS | LCK
```

- First mention: "STR (Strength)"
- Grade display: `STR: B-782`
- Stat pairs: "STR + END" or "INT/WIS"

### Achievement Tiers

**Format**: All caps, arrow progression

```
STANDARD → CHALLENGING → HEROIC → LEGENDARY → MYTHIC
```

- Always use full tier name
- Never abbreviate (not "STD" or "LEG")

### Monster Names

**Format**: `[Prefix] + [Base Monster] + [Suffix]`

```
Goblin                          (base only)
Berserk Goblin                  (prefix + base)
Goblin of Poison                (base + suffix)
Elite Dire Wolf of Flame        (prefix + base + suffix)
Mythic Ancient Dragon, World-Eater  (legendary - comma for title)
```

### Weapon Names

**Format**: `[Quality] + [Material] + [Base Weapon] + [Enchantment]`

```
Rusty Knife                                    (junk)
Iron Sword                                     (common)
Fine Steel Longsword                           (uncommon)
Superior Damascus Longsword of Flame           (rare)
Masterwork Mithril Greatsword of Dragonslaying (legendary)
```

### Behavement IDs

**Format**: `[VECTOR]_[##]`

```
PHYS_01, MAGIC_08, TANK_04, GLORY_10
```

- Vector prefix: 2-6 characters
- Underscore separator
- Two-digit number (zero-padded)

### Paragon Titles

**Format**: `[CR Adjective] + [Stat Adjective] + [Skill Noun]`

```
Legendary Arcane Slayer
Heroic Swift Negotiator
Mythic Sage Invoker
```

---

## Numbers & Balance

### Percentages vs Flat Numbers

**Use percentages for:**
- Relative changes: "+15% damage"
- Probabilities: "30% drop chance"
- Scaling bonuses: "+10% per level"
- Modifiers: "-5% accuracy"

**Use flat numbers for:**
- Absolute thresholds: "Reputation -20 to +20"
- Fixed targets: "Kill 500 enemies"
- Base values: "50 HP base"
- Point costs: "100 SP"

### Tier Scaling Pattern

Standard weight progression:

```
TRIVIAL(1) → EASY(2) → MODERATE(5) → HARD(10) → VERY_HARD(25) → EXTREME(50) → LEGENDARY(100)
```

Each tier is roughly 2-5x the previous (exponential, not linear).

### Trade-offs Must Be Visible

| Good | Bad |
|------|-----|
| "+50% crit damage, -10% HP" | "Increases crit damage" |
| "+10 STR, -5 WIS" | "Boosts strength" |
| "2x damage, 0 defense (toggle)" | "Powerful attack mode" |

**Rule**: Every benefit should show its cost. No free power.

### Formula Presentation

1. Natural language first: "Your true power combines..."
2. Formula in code block: `(Level × 500) + CurrentGradePoints`
3. Concrete examples in table showing calculations

---

## Key Phrases

Use these consistently when applicable:

| Phrase | When to Use |
|--------|-------------|
| **"CRITICAL:"** | Non-negotiable rules, design boundaries |
| **"Challenge, Not Grind"** | Explaining why something isn't farmable |
| **"Push Your Luck"** | Risk/reward mechanics |
| **"Natural play rewarded"** | Hidden tracking systems |
| **"The deeper you go..."** | Escalating consequences |
| **"Loot is King"** | Explaining gear importance |
| **"Meaningful Choices"** | Why decisions matter |
| **"The Tower Awaits"** | Thematic calls to action |

### Emphasis Patterns

- **CRITICAL**: All caps for absolute rules
- **Key terms**: Bold for important concepts
- *Ability names*: Italics for named abilities
- `Code style`: Backticks for formulas, IDs, formats

---

## Cultural Sensitivity

### Pantheon Representation

| Do | Don't |
|----|-------|
| Treat all pantheons with equal mechanical weight | Make "exotic" pantheons feel like DLC |
| Use historical accuracy (Mesopotamian → Sumerian/Akkadian/Babylonian) | Lump diverse cultures together |
| Present deities as game elements | Make deities cultural ambassadors |
| Include diversity naturally | Tokenize or performatively include |

### Avoiding Stereotypes

| Bad | Better |
|-----|--------|
| Aztec deities = "blood gods" | Aztec deities have varied domains like any pantheon |
| Hindu deities = "mystical and spiritual" | Hindu deities have concrete mechanical effects |
| Indigenous = "nature spirits" | Indigenous pantheons have full deity rosters |

**Rule**: If you wouldn't say it about Greek/Roman gods, don't say it about any pantheon.

---

## Quick Checklist

Before finalizing ANY content, verify:

- [ ] **Philosophy**: Does it align with "Challenge, Not Grind"?
- [ ] **Trade-offs**: Are costs and benefits both visible?
- [ ] **Flavor**: Is it concise (1-2 sentences)?
- [ ] **Mechanics**: Are numbers precise, not vague?
- [ ] **Names**: Are they memorable, not descriptive?
- [ ] **Format**: Tables for comparisons, bullets for lists?
- [ ] **Caps**: Consistent with naming conventions?
- [ ] **Culture**: Respectful and equal treatment?
- [ ] **Voice**: Active, direct, authoritative but welcoming?

---

## Anti-Patterns (What NOT to Do)

### Writing

- "Perhaps the player might want to consider..." → "You must..."
- "This system allows for..." → "This system does..."
- Explaining obvious concepts players already know
- Hedging design decisions with "maybe" or "optionally"

### Design

- Free power without cost
- Farmable resources that bypass challenge
- Reversible decisions with no stakes
- Optimal safe paths that avoid all risk

### Formatting

- Bullet lists for lookup data (use tables)
- Tables for sequential instructions (use bullets)
- Headers deeper than #### level
- Walls of text without visual breaks

### Naming

- Generic descriptive names ("Damage Boost Skill")
- Abbreviations in player-facing content
- Inconsistent capitalization
- Numbers in achievement names ("Kill 50 Enemies I")

---

## Reference: Comparison Examples

### Stat Block (Good)

| Stat | Combat Effect | Non-Combat Effect |
|------|---------------|-------------------|
| **STR** | +Melee damage, +Block | +Carry capacity, +Force checks |
| **AGI** | +Dodge, +Initiative | +Flee success, +Stealth |

### Stat Block (Bad)

- STR: Makes you stronger in combat and lets you carry more
- AGI: Helps with dodging and going first, also stealth

### Achievement Entry (Good)

| Name | Tier | Requirement | Discovery |
|------|------|-------------|-----------|
| Dragonblood Initiate | LEGENDARY | Survive dragon encounter | Ancient tome (rep +8) |

### Achievement Entry (Bad)

**Survive Dragon**: Survive a dragon encounter. (Legendary tier, found in library)

---

*Last updated: Session where Level 10 achievement system was implemented*
