# KOHRVELLIA - Game Design Document

## Project Overview

**Kohrvellia** is a mobile roguelike dungeon crawler built with React Native (Expo) and TypeScript. The game combines text-based choose-your-own-adventure gameplay with tactical turn-based combat, inspired by Buriedbornes' dungeon crawling and DanMachi's progression systems.

### Core Philosophy

1. **Challenge, Not Grind** - Levels are milestone achievements, not XP bars. The game should never feel grindy.
2. **Loot is King** - Dopamine comes from finding cool gear, not from watching numbers go up.
3. **Meaningful Choices** - Every decision matters. Risk vs reward is constant.
4. **Permadeath** - Death is permanent. Full reset. Start from scratch.
5. **No Quick Exits** - Must climb back up to exit. Every floor deeper is a commitment.

---

## Tutorial / Onboarding

### Introduction Text (First Play)

```
Welcome, Adventurer.

You stand before the Tower of Kohrvellia - a dungeon
that descends endlessly into darkness. Many have entered.
Few have returned.

THE RULES ARE SIMPLE:
1. Descend to find treasure. The deeper you go, the
   greater the rewards.
2. To EXIT, you must CLIMB BACK UP. There are no shortcuts.
3. Death is PERMANENT. Everything you carry, everything
   you've become - gone.

YOUR STRENGTH GROWS THROUGH ACTION:
- Swing a sword? Your body grows stronger.
- Cast a spell? Your mind sharpens.
- Take a hit? Your endurance hardens.

A PATRON AWAITS:
Choose a deity. They will grant you their blessing...
and their burden.

THE TOWER AWAITS.
```

### Tutorial Hints (Contextual)

| Trigger | Hint |
|---------|------|
| First combat | "Tip: Different damage types work better against different enemies. Slash flesh, crush bone, pierce leather." |
| First level up | "Your stats grew from your ACTIONS this level. Fight more to grow stronger. Think more to grow wiser." |
| First rest site | "Rest sites are rare. The deeper you go, the fewer you'll find. Plan accordingly." |
| First death | "Death is not the end - it's a teacher. What will you do differently?" |
| First shrine | "Your patron deity watches. They reward those who walk their path." |
| First Elite monster | "Elites are dangerous but rewarding. Their defeat may prove you worthy of advancement." |
| First CR warning | "The tower warns you of danger ahead. Heed it... or defy it." |

---

## Character Creation

### Step 1: Name and Epithet

Player enters: `[Name], [Epithet]`
Example: "Kira, the Wandering Storm"

### Step 2: Backstory Selection

Each backstory provides:
- Small stat modifier (+5 to one stat, -5 to another)
- Deity affinity hint (highlights compatible patron deities)
- Starting flavor (narrative hook)

| Backstory | Stat Effect | Deity Affinity | Flavor |
|-----------|-------------|----------------|--------|
| **Orphan of the Streets** | +5 AGI, -5 CHA | Trickster gods | "You learned to survive before you learned your name." |
| **Disgraced Noble** | +5 CHA, -5 END | Authority gods | "Your family's shame is your fuel." |
| **Failed Apprentice** | +5 INT, -5 WIS | Knowledge gods | "They said you lacked talent. They were wrong." |
| **Veteran Soldier** | +5 END, -5 INT | War gods | "The battlefield taught you more than any book." |
| **Temple Acolyte** | +5 WIS, -5 AGI | Divine gods | "Faith sustained you when all else failed." |
| **Wandering Merchant** | +5 PER, -5 STR | Fortune gods | "Every road leads to opportunity." |
| **Blacksmith's Child** | +5 STR, -5 CHA | Craft gods | "You were forged in fire like the blades you made." |
| **Cursed Bloodline** | +5 LCK, -5 WIS | Death/Fate gods | "Fate has plans for you, whether you like it or not." |

### Step 3: Deity Selection

After backstory, player selects their patron deity. Backstory highlights compatible deities but does not restrict choice.

---

## Deity Buff/Debuff System

Every patron deity provides:
- **Stat Bonus**: +10 to one stat
- **Stat Penalty**: -5 to one stat (for balance)
- **Domain Blessing**: +10% to domain-related actions
- **Unique Ability**: Unlocked at higher devotion

### War Domain Deities

| Deity | Pantheon | Blessing | Stat+ | Stat- | Unique Ability |
|-------|----------|----------|-------|-------|----------------|
| **Ares** | Greek | +10% physical damage | STR +10 | WIS -5 | *Berserk Rage* - 2x damage, 0 defense (toggle) |
| **Odin** | Norse | +10% battle insight | PER +10 | CHA -5 | *Valhalla's Call* - No death penalty once per run |
| **Huitzilopochtli** | Aztec | +10% crit chance | AGI +10 | END -5 | *Blood Sacrifice* - Convert HP to damage |

### Magic Domain Deities

| Deity | Pantheon | Blessing | Stat+ | Stat- | Unique Ability |
|-------|----------|----------|-------|-------|----------------|
| **Hecate** | Greek | +10% dark magic | INT +10 | STR -5 | *Triple Path* - 3 spell slots instead of 2 |
| **Thoth** | Egyptian | +10% spell efficiency | WIS +10 | AGI -5 | *Scribe's Memory* - Relearn forgotten skills free |
| **Saraswati** | Hindu | +10% holy magic | CHA +10 | END -5 | *Knowledge Stream* - Learn skills 2x faster |

### Trickery Domain Deities

| Deity | Pantheon | Blessing | Stat+ | Stat- | Unique Ability |
|-------|----------|----------|-------|-------|----------------|
| **Loki** | Norse | +10% dodge chance | AGI +10 | WIS -5 | *Shapeshift* - Disguise as any observed creature |
| **Anansi** | Yoruba | +10% trap success | INT +10 | STR -5 | *Spider's Web* - Slow all enemies in room |
| **Coyote** | Native American | +10% flee success | LCK +10 | PER -5 | *Trickster's Luck* - Reroll any dice once per floor |

### Death Domain Deities

| Deity | Pantheon | Blessing | Stat+ | Stat- | Unique Ability |
|-------|----------|----------|-------|-------|----------------|
| **Hades** | Greek | +10% undead damage | END +10 | CHA -5 | *Underworld Passage* - Escape death once per run |
| **Anubis** | Egyptian | +10% soul magic | WIS +10 | LCK -5 | *Weigh the Heart* - See enemy weaknesses |
| **Hel** | Norse | +10% curse duration | INT +10 | STR -5 | *Half-Death* - Survive at 1 HP once per floor |

### Fortune Domain Deities

| Deity | Pantheon | Blessing | Stat+ | Stat- | Unique Ability |
|-------|----------|----------|-------|-------|----------------|
| **Tyche** | Greek | +10% loot quality | LCK +10 | END -5 | *Fortune's Favor* - Reroll loot drops |
| **Fortuna** | Roman | +10% gold drops | CHA +10 | WIS -5 | *Wheel of Fate* - Random buff each floor |
| **Lakshmi** | Hindu | +10% shop discounts | PER +10 | STR -5 | *Abundance* - Extra item slot |

### Nature Domain Deities

| Deity | Pantheon | Blessing | Stat+ | Stat- | Unique Ability |
|-------|----------|----------|-------|-------|----------------|
| **Artemis** | Greek | +10% beast damage | PER +10 | CHA -5 | *Wild Bond* - Tame beast companions |
| **Cernunnos** | Celtic | +10% nature magic | WIS +10 | INT -5 | *Forest's Embrace* - Heal in natural biomes |
| **Freya** | Norse | +10% healing received | CHA +10 | AGI -5 | *Valkyrie's Touch* - Revive once at 50% HP |

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo) |
| Language | TypeScript (strict) |
| Routing | Expo Router (file-based) |
| State | Zustand |
| Persistence | AsyncStorage |
| Styling | StyleSheet + design constants |
| Animations | react-native-reanimated |
| Haptics | expo-haptics |

---

## Core Stats System

### 8 Stats (D&D + Fallout SPECIAL Merged)

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

### Stat Grades (DanMachi-Inspired, Per-Level)

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

### The Falna Formula (Effective Stat Calculation)

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

### Derived Stats (Using EffectiveStat)

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

### Stat Definitions (Combat & Non-Combat)

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

### Every Stat Matters (Elden Ring Philosophy)

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

## Dungeon Structure (Tower System)

### Core Rules

1. **No Quick Exits** - The dungeon is a tower. To exit, you must climb back up.
2. **Descend 5, Ascend 5** - If you go down 5 floors, you must ascend 5 floors to reach town.
3. **Rooms Per Floor** - Each floor has X rooms (varies by depth).
4. **CR Warnings** - Before descending, the game shows the next floor's Challenge Rating.
5. **Push Your Luck** - Deeper = better loot, but harder return.

### Floor Layout

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

### Room Count by Depth

| Floor Range | Rooms | Encounter Chance |
|-------------|-------|------------------|
| 1-5 | 3-5 | 40% |
| 6-10 | 4-6 | 50% |
| 11-20 | 5-7 | 55% |
| 21-30 | 6-8 | 60% |
| 31-40 | 7-9 | 65% |
| 41-50 | 8-10 | 70% |
| 51+ | 9-12 | 75% |

### Room Types

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

### Challenge Rating (CR) Per Floor

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

## Modular Monster System (Affix LEGO)

### Structure

```
[Prefix] + [Base Monster] + [Suffix]
```

Each component adds to the monster's Challenge Rating (CR).

### Base Monsters

Base monsters have:
- Base HP, Attack, Defense
- Weakness/Resistance profile
- AI behavior pattern
- Base CR value

**Examples**:
| Monster | Base CR | Weakness | Resistance | Immunity |
|---------|---------|----------|------------|----------|
| Goblin | 1.0 | — | — | — |
| Skeleton | 1.2 | Blunt, Holy | Pierce, Slash | Poison, Bleed |
| Slime | 0.8 | Fire, Ice | Blunt | Pierce |
| Wolf | 1.5 | — | — | — |
| Ghost | 2.0 | Magic, Holy | — | Physical |
| Troll | 3.0 | Fire | Physical | — |
| Golem | 4.0 | Magic, Water | Physical | Poison, Stun |
| Dragon | 8.0 | Ice | Fire | Fear |

### Prefix Tiers

| Tier | CR Bonus | Prefixes | Effect |
|------|----------|----------|--------|
| **Negative (-0.3)** | -0.3 | Young, Weak, Starving, Injured | Reduced stats |
| **Low (+0.3)** | +0.3 | Feral, Wild, Roaming | Minor stat boost |
| **Mid (+0.5)** | +0.5 | Berserk, Armored, Swift, Cunning, Venomous | Specific enhancement |
| **High (+1.0)** | +1.0 | Elite, Ancient, Dire, Alpha, Corrupted | Major enhancement |
| **Legendary (+2.0)** | +2.0 | Mythic, Abyssal, Celestial, Primordial | Massive enhancement + special ability |

### Suffix Tiers

| Tier | CR Bonus | Suffixes | Effect |
|------|----------|----------|--------|
| **Low (+0.3)** | +0.3 | of the Wilds, the Scavenger, the Wanderer | Minor passive |
| **Mid (+0.5)** | +0.5 | of Poison, of Flame, of Frost, of Shadow, of Lightning | Elemental damage |
| **High (+1.0)** | +1.0 | of Regeneration, of Terror, of the Void, the Undying | Powerful passive |
| **Legendary (+2.0)** | +2.0 | World-Eater, Soul Reaver, the Deathless, Godslayer | Legendary ability |

### Floor-Based Affix Rules

| Floor | Max Affixes | Max Affix Tier |
|-------|-------------|----------------|
| 1-5 | 0 | None (base monsters only) |
| 6-10 | 1 | Low |
| 11-20 | 1 | Mid |
| 21-30 | 2 | Mid |
| 31-40 | 2 | High |
| 41-50 | 2 | High (5% chance Legendary) |
| 51+ | 3 | Legendary possible |

### Monster Generation Algorithm

```typescript
function generateMonster(floor: number): Monster {
  // 1. Select base monster appropriate for floor CR
  const baseCR = getFloorCR(floor);
  const baseMonster = selectBaseMonster(baseCR);

  // 2. Determine affix count
  const maxAffixes = getMaxAffixes(floor);
  const affixCount = randomInt(0, maxAffixes);

  // 3. Select affixes within tier limits
  const maxTier = getMaxAffixTier(floor);
  const prefix = affixCount > 0 ? selectPrefix(maxTier) : null;
  const suffix = affixCount > 1 ? selectSuffix(maxTier) : null;

  // 4. Calculate final CR
  const finalCR = baseMonster.cr + (prefix?.crBonus || 0) + (suffix?.crBonus || 0);

  // 5. Apply affix effects to stats
  return applyAffixes(baseMonster, prefix, suffix, finalCR);
}
```

### Example Monsters

| Generated Name | CR Calculation |
|----------------|----------------|
| Goblin | 1.0 |
| Berserk Goblin | 1.0 + 0.5 = 1.5 |
| Goblin of Poison | 1.0 + 0.5 = 1.5 |
| Berserk Goblin of Poison | 1.0 + 0.5 + 0.5 = 2.0 |
| Elite Dire Wolf of Flame | 1.5 + 1.0 + 0.5 = 3.0 |
| Mythic Ancient Dragon, World-Eater | 8.0 + 2.0 + 1.0 + 2.0 = 13.0 |

---

## Modular Weapon System (Affix LEGO)

### Structure

```
[Quality] + [Material] + [Base Weapon] + [Enchantment]
```

### Base Weapons by Primary Stat

Each weapon type scales primarily with one stat:

**STR Weapons (10+)**
| Weapon | Damage Type | Base Damage |
|--------|-------------|-------------|
| Greatsword | Slash | 20 |
| Warhammer | Blunt | 22 |
| Battleaxe | Slash | 18 |
| Mace | Blunt | 12 |
| Halberd | Slash/Pierce | 16 |
| Flail | Blunt | 14 |
| Maul | Blunt | 25 |
| Greatclub | Blunt | 10 |
| Pike | Pierce | 14 |
| Morningstar | Blunt/Pierce | 15 |

**AGI Weapons (10+)**
| Weapon | Damage Type | Base Damage |
|--------|-------------|-------------|
| Rapier | Pierce | 8 |
| Dagger | Pierce | 5 |
| Scimitar | Slash | 10 |
| Shortsword | Slash/Pierce | 8 |
| Whip | Slash | 6 |
| Sai | Pierce | 7 |
| Kukri | Slash | 9 |
| Kama | Slash | 8 |
| Stiletto | Pierce | 4 |
| Throwing Knives | Pierce | 5 |

**PER Weapons (10+)**
| Weapon | Damage Type | Base Damage |
|--------|-------------|-------------|
| Longbow | Pierce | 12 |
| Crossbow | Pierce | 14 |
| Shortbow | Pierce | 8 |
| Sling | Blunt | 5 |
| Blowgun | Pierce | 3 (+ poison) |
| Javelin | Pierce | 10 |
| Throwing Axes | Slash | 9 |
| Darts | Pierce | 4 |
| Boomerang | Blunt | 7 |
| Arquebus | Pierce | 20 (slow) |

**INT Weapons (10+)**
| Weapon | Damage Type | Base Magic |
|--------|-------------|------------|
| Staff | Blunt/Magic | 5/15 |
| Wand | Magic | 10 |
| Orb | Magic | 12 |
| Tome | Magic | 14 |
| Crystal | Magic | 16 |
| Scepter | Magic | 11 |
| Rod | Magic | 13 |
| Grimoire | Magic | 18 |
| Talisman | Magic | 8 |
| Runeblade | Slash/Magic | 8/10 |

**WIS Weapons (10+)**
| Weapon | Damage Type | Base Holy |
|--------|-------------|-----------|
| Holy Symbol | Holy | 10 |
| Prayer Beads | Holy | 8 |
| Censer | Holy | 12 |
| Reliquary | Holy | 15 |
| Ankh | Holy | 11 |
| Totem | Nature/Holy | 9 |
| Spirit Blade | Holy/Pierce | 8/6 |
| Psalter | Holy | 7 |
| Icon | Holy | 13 |
| Rosary | Holy | 6 |

**CHA Weapons (10+)**
| Weapon | Damage Type | Base Damage |
|--------|-------------|-------------|
| Dueling Sword | Pierce | 9 |
| Fencing Blade | Pierce | 8 |
| Saber | Slash | 10 |
| Estoc | Pierce | 11 |
| Smallsword | Pierce | 7 |
| Cutlass | Slash | 12 |
| Basket-hilt | Slash/Pierce | 10 |
| Flamberge | Slash | 14 |
| Katzbalger | Slash | 11 |
| Schiavona | Slash | 13 |

### Weapon Stat Requirements

Every weapon has minimum stat requirements to wield:

```typescript
interface WeaponRequirements {
  primaryStat: StatName;
  primaryMin: number;
  secondaryStat?: StatName;
  secondaryMin?: number;
}

// Examples:
// Greatsword: STR 15, END 10
// Longbow: PER 14, AGI 12
// Staff of Flames: INT 16, WIS 12
// Rapier: AGI 12, CHA 8
```

**Cannot Equip Without Meeting Requirements**

### Materials (Affects Base Stats)

| Tier | Materials | Stat Modifier | Floor Available |
|------|-----------|---------------|-----------------|
| **Junk** | Rusty, Broken, Crude, Rotting | -20% | 1+ |
| **Common** | Iron, Bronze, Leather, Bone | Base (100%) | 1+ |
| **Uncommon** | Steel, Hardened Leather, Silver-Plated | +10% | 6+ |
| **Rare** | Silver, Damascus, Dragonscale, Darksteel | +25% | 11+ |
| **Epic** | Mithril, Adamantine, Celestial Steel, Voidstone | +50% | 36+ |
| **Legendary** | Orichalcum, Void Metal, Divine, Primordial | +100% | 51+ |

### Quality (Affects Reliability/Crit)

| Quality | Accuracy | Crit Chance | Damage | Availability |
|---------|----------|-------------|--------|--------------|
| Crude | -10% | 0% | -10% | Always |
| Standard | 0% | 0% | 0% | Always |
| Fine | 0% | +5% | 0% | Floor 6+ |
| Superior | 0% | +10% | +5% | Floor 11+ |
| Masterwork | +5% | +15% | +10% | Floor 21+ |
| Legendary | +10% | +25% | +20% | Floor 41+ |

### Enchantments (Adds Special Effects)

| Tier | Enchantments | Effect | Floor Available |
|------|--------------|--------|-----------------|
| **Minor** | Sharpness | +5 damage | 6+ |
| **Minor** | Durability | Never breaks | 6+ |
| **Minor** | Light | Glows, +PER in dark | 6+ |
| **Standard** | Flame | +10 fire damage | 11+ |
| **Standard** | Frost | +10 ice damage, slow | 11+ |
| **Standard** | Lightning | +8 lightning, stun chance | 11+ |
| **Standard** | Poison | +5 damage, poison DOT | 11+ |
| **Greater** | Vampiric | Heal 10% of damage dealt | 21+ |
| **Greater** | Stunning | 15% stun chance | 21+ |
| **Greater** | Armor-Piercing | Ignore 30% defense | 21+ |
| **Legendary** | Dragonslaying | 3x damage vs dragons | 41+ |
| **Legendary** | Undead Bane | 2x damage vs undead | 41+ |
| **Legendary** | Soul Harvest | Gain SP on kill | 51+ |

### Floor-Based Weapon Generation

| Floor | Max Material | Max Quality | Max Enchant |
|-------|--------------|-------------|-------------|
| 1-5 | Common | Standard | None |
| 6-10 | Uncommon | Fine | Minor |
| 11-20 | Rare | Superior | Standard |
| 21-35 | Rare | Masterwork | Greater |
| 36-50 | Epic | Masterwork | Greater |
| 51+ | Legendary | Legendary | Legendary |

### Example Weapons

| Generated Name | Components |
|----------------|------------|
| Rusty Knife | Junk + Knife |
| Iron Sword | Common + Sword |
| Fine Steel Longsword | Fine + Uncommon + Longsword |
| Superior Damascus Longsword of Flame | Superior + Rare + Longsword + Standard |
| Masterwork Mithril Greatsword of Dragonslaying | Masterwork + Epic + Greatsword + Legendary |

---

## Armor System

### Armor Types

| Type | Best For | Defense | Magic Def | Speed Penalty | Dodge Penalty |
|------|----------|---------|-----------|---------------|---------------|
| **Light** | AGI, PER builds | Low | Low | None | None |
| **Medium** | Balanced | Medium | Medium | -10% | -5% |
| **Heavy** | STR, END builds | High | Low | -25% | -15% |
| **Robes** | INT, WIS builds | Very Low | High | None | None |

### Armor Slots

1. Head (Helm, Hood, Hat, Crown)
2. Chest (Plate, Chainmail, Leather, Robes)
3. Hands (Gauntlets, Gloves, Bracers)
4. Legs (Greaves, Leggings, Boots)
5. Accessory 1 (Ring, Amulet, Charm)
6. Accessory 2 (Ring, Amulet, Charm)

### Armor Materials & Quality

Same system as weapons - Material + Base + Quality + Enchantment

---

## Combat System

### Turn Order

1. Calculate initiative: `Speed + d20`
2. Higher initiative acts first
3. On tie, player acts first

### Available Actions

| Action | Description | Cost |
|--------|-------------|------|
| **Attack** | Basic weapon attack | None |
| **Defend** | +50% defense until next turn, can trigger counter | None |
| **Skill** | Use a learned skill | SP cost varies |
| **Item** | Use consumable from inventory | None (uses turn) |
| **Flee** | Attempt to escape combat | AGI check |

### Weapon Triangle (Rock-Paper-Scissors)

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

### Status Effects

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

### Counter/Parry System

**To prevent spam**:
- **Counter** requires Defend action first
- **Counter** costs 10 SP per attempt
- **Counter** has cooldown (can't counter consecutive turns)
- **Parry** is a skill that must be learned
- **Parry** has timing element (choose before enemy acts)
- Failed parry = extra damage taken

### Magic Balance

**To prevent magic dominance**:
- SP is scarce (potions expensive, rest sites rare)
- Many enemies have magic resistance
- Physical damage has no resource cost
- Magic has cast time (some spells take 2 turns)
- Silence status completely disables magic

---

## Enemy AI Patterns

### Behavior System

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
    { condition: 'hp < 50%', action: 'split', priority: 0 }, // Creates 2 smaller slimes
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

### 30+ Jobs by Stat Combination

| Top 3 Stats | Available Base Jobs |
|-------------|---------------------|
| STR + END + AGI | Warrior, Berserker, Guardian, Gladiator |
| STR + END + WIS | Paladin, Crusader, War Priest |
| STR + END + LCK | Brawler, Pit Fighter |
| STR + AGI + PER | Ranger, Archer, Skirmisher |
| STR + LCK + PER | Hunter, Bounty Hunter, Executioner |
| STR + INT + WIS | Battlemage, Spellsword, Runesmith |
| AGI + PER + LCK | Assassin, Scout, Thief, Gambler |
| AGI + PER + INT | Spellthief, Arcane Trickster |
| AGI + PER + WIS | Shadow Monk, Wind Dancer |
| AGI + INT + CHA | Bard, Trickster, Illusionist |
| AGI + CHA + LCK | Swashbuckler, Duelist |
| INT + WIS + CHA | Sage, Enchanter, Oracle, Diplomat |
| INT + WIS + LCK | Diviner, Fate Weaver, Arcanist |
| INT + WIS + END | Archmage, Battle Caster |
| INT + PER + AGI | Spellsniper, Arcane Archer |
| WIS + CHA + LCK | Priest, Shaman, Fortune Teller |
| WIS + CHA + END | Cleric, Guardian Priest |
| WIS + END + STR | Templar, Inquisitor |
| WIS + END + CHA | Monk, Exorcist |
| PER + WIS + INT | Witch Hunter, Inquisitor |
| PER + LCK + CHA | Treasure Hunter, Prospector |
| CHA + LCK + STR | Champion, Warlord |
| CHA + LCK + INT | Charlatan, Confidence Artist |
| CHA + INT + WIS | Court Mage, Vizier |
| END + LCK + PER | Survivor, Scavenger |
| END + STR + LCK | Juggernaut, Ironclad |

### Job Prerequisites

Beyond stat requirements, some jobs have additional prerequisites:

```typescript
interface JobPrerequisites {
  stats: Partial<Record<StatName, number>>;
  skills?: Record<SkillId, number>;
  items?: string[];
  achievements?: string[];
}

// Example: Assassin
{
  stats: { AGI: 'C', PER: 'D', LCK: 'D' },
  skills: { stealth: 20, dagger: 15 },
}

// Example: Paladin
{
  stats: { STR: 'D', END: 'D', WIS: 'D' },
  achievements: ['shrine_blessing', 'undead_slayer_50'],
}
```

### Job Specializations (Level 5)

Each base job has 2 specialization paths:

**Warrior Specializations**:
- Path A: **Vanguard** - Offensive focus, AoE skills
- Path B: **Sentinel** - Defensive focus, taunt, party protection

**Assassin Specializations**:
- Path A: **Shadowblade** - Pure damage, execute skills
- Path B: **Infiltrator** - Utility, traps, escape skills

### Advanced Classes (Level 8)

Unlocks more powerful abilities and stat bonuses.

### Paragon (Level 10) - UNIQUE TO EACH PLAYER

Unlike preset job options, **Paragon evolution is dynamically generated** based on your entire playthrough. The **Denatus System** (hidden tracking) analyzes everything you've done and generates a unique title with corresponding buffs.

See: **Denatus Title System** and **Behavements System** below.

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

### Skill Card

Visual stat card showing:
- All learned skills organized by type
- Skill levels and proficiency
- Observed but unlearned skills
- Skill point balance

---

## Denatus Title System (Soul Tracking)

The **Denatus** is a **hidden system** that watches EVERYTHING the player does. At Level 10 (Paragon), it generates a **unique title** with corresponding permanent buffs. This title is revealed in a special ceremony.

**See: `SOUL_SYSTEM.md` for complete technical documentation.**

### Title Structure
```
[CR Adjective] + [Stat Adjective] + [Skill Noun]
```
Example: **"Legendary Arcane Slayer"** or **"Heroic Swift Negotiator"**

### Title Components

**CR Adjective** (from achievement score):
`Novice → Apprentice → Journeyman → Adept → Expert → Master → Grandmaster → Heroic → Legendary → Mythic`

**Stat Adjective** (from top 2 stats):
28 combinations (STR+END="Iron", AGI+LCK="Elusive", INT+WIS="Sage", etc.)

**Skill Noun** (from dominant behavior vector):
`Warrior | Mage | Guardian | Shadow | Assassin | Explorer | Diplomat | Gambler | Tactician | Healer | Summoner | Artisan`

### Deity Hints

Your patron deity gives **vague hints** about your developing title:
- "You fight with reckless abandon..." (Risk-Taking high)
- "Your blade speaks more than your words..." (Physical Combat dominant)
- "The shadows favor you..." (Evasion/Dodge rising)

---

## Behavements System (75+ Tracked Behaviors)

Hidden progress bars tracking **every player action**. Each behavement has a **weight** (difficulty rating) and belongs to a **vector** (behavioral pillar).

**See: `SOUL_SYSTEM.md` for complete behavement list with weights.**

### Behavioral Vectors (Pillars)
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

### Behavement Weight Scale
```
TRIVIAL = 1      (Use 100 items)
EASY = 2         (Kill 50 goblins)
MODERATE = 5     (Reach floor 25)
HARD = 10        (Kill 10 Elite monsters)
VERY_HARD = 25   (Win while 5+ levels below enemy)
EXTREME = 50     (Solo a Legendary monster)
LEGENDARY = 100  (Reach floor 100)
```

### Score Calculation
```typescript
function calculateBehavementScore(behavements: Behavement[]): number {
  let totalWeightedProgress = 0;
  let totalMaxWeight = 0;

  for (const b of behavements) {
    const progress = Math.min(b.current / b.target, 1.0);
    totalWeightedProgress += progress * b.weight;
    totalMaxWeight += b.weight;
  }

  return (totalWeightedProgress / totalMaxWeight) * 100;
}
```

---

## NPC Reputation System

### Likeability Scale

Range: **-20** to **+20** (starts at **+1**)

### Progression Formula

```typescript
xp_to_next_level(current) = BASE_XP * Math.pow(1.5, current)
// BASE_XP = 100
```

| Level | XP Required | Cumulative XP |
|-------|-------------|---------------|
| +1 → +2 | 150 | 150 |
| +2 → +3 | 225 | 375 |
| +3 → +4 | 338 | 713 |
| +4 → +5 | 506 | 1219 |
| +5 → +6 | 759 | 1978 |
| ... | Exponential | — |
| +19 → +20 | ~28,000 | ~56,000 |

**CRITICAL**: Each level is HARDER than the previous!

### Negative Reputation

- Easier to decrease (spiral down)
- Recovery from negative is extremely difficult
- Negative actions give more negative XP than positive actions give positive XP

### Reputation Effects

| Level Range | Effect |
|-------------|--------|
| **-20 to -15** | Hostile, may attack on sight, refuses all service |
| **-14 to -10** | Won't speak to you, prices increased 200% |
| **-9 to -5** | Terse responses, prices increased 150% |
| **-4 to 0** | Neutral, basic services only |
| **+1 to +5** | Friendly, answers basic questions |
| **+6 to +10** | Shares rumors, 10% discount |
| **+11 to +15** | Shares secrets, 25% discount, may teach skills |
| **+16 to +19** | 40% discount, rare info, special quests |
| **+20** | Maximum trust, unique rewards, hidden knowledge |

### Chat System

NPCs have limited chat resources based on reputation:

| Rep Level | Daily Chat Limit |
|-----------|------------------|
| -20 to -10 | 0 (won't talk) |
| -9 to 0 | 1 |
| +1 to +5 | 2 |
| +6 to +10 | 3 |
| +11 to +15 | 5 |
| +16 to +20 | Unlimited |

### Interaction Options

| Action | Effect |
|--------|--------|
| **Chat** | Costs 1 chat point, gains small rep XP |
| **Trade** | Prices affected by reputation |
| **Request Info** | Higher rep = more info shared |
| **Learn Skill** | Requires +11 rep, NPC demonstrates skill |
| **Gift** | Give items to increase reputation (diminishing returns) |
| **Quest** | Complete NPC quests for large rep gains |

### NPC Locations

| Location | NPCs | Services |
|----------|------|----------|
| **Guild Hall** | Guildmaster, Receptionist, Quest Board | Quests, rankings, adventurer info, party recruitment |
| **Library** | Head Librarian, Scholars, Archivists | Skill research, monster info, lore, history |
| **Academy** | Headmaster, Instructors, Students | Skill demonstrations, training, stat training |
| **Blacksmith** | Master Smith, Apprentice | Weapon/armor crafting, repairs, upgrades, identification |
| **Apothecary** | Alchemist, Herbalist | Potions, antidotes, status cures, ingredients |
| **Temple** | High Priest, Priests, Acolytes | Blessings, curse removal, deity info, resurrection (if unlocked) |
| **Tavern** | Barkeep, Barmaid, Patrons | Rumors, rest, food buffs, hiring companions |
| **Market** | Various Merchants | General goods, rare items, haggling |
| **Arena** | Arena Master, Fighters | Practice combat, tournaments, fame |

---

## Pantheon System

### Available Pantheons (25+)

1. **Greek/Roman** - Olympians / Dii Consentes
2. **Norse** - Aesir and Vanir
3. **Celtic** - Tuatha Dé Danann
4. **Slavic**
5. **Finnish**
6. **Aztec**
7. **Maya**
8. **Inca**
9. **Egyptian** - Ennead and Ogdoad
10. **Mesopotamian** - Sumerian, Akkadian, Babylonian
11. **Yoruba** - Orishas
12. **Hindu** - Devas and Devis
13. **Shinto** - Kami
14. **Chinese**
15. **Polynesian**
16. **Yokai**
17. **Canaanite/Phoenician**
18. **Persian/Pre-Zoroastrian** - Yazatas
19. **Etruscan**
20. **Kiowa**
21. **Hittite/Anatolian**
22. **Baltic**
23. **North American Indigenous**
24. **Vodou**
25. **Australian Aboriginal** - Dreamtime
26. **Canaanite & Philistine Roots** - Demonized Gods
27. **Christian Angelology & Demonology** - The Fallen
28. **Ars Goetia** - Occult Hierarchy

### Deity Selection

Occurs during early game story event (prologue). Player chooses:
1. Pantheon
2. Deity within pantheon

### Patron Benefits

| Benefit Type | Description |
|--------------|-------------|
| **Stat Bonuses** | +X to specific stats |
| **Stat Growth** | Increased growth rate for specific stats |
| **Skill Bonuses** | +X to specific skill levels |
| **Unique Blessing** | Special ability only available to followers |
| **Shrine Interactions** | Special events at shrines in dungeon |
| **Domain Affinity** | Bonus effects related to deity's domain |

### Deity Domains

| Domain | Effect Examples |
|--------|-----------------|
| War | +Physical damage, combat buffs |
| Wisdom | +Skill learning, INT/WIS bonuses |
| Magic | +Magic damage, SP bonuses |
| Death | +Undead damage, death resistance |
| Life | +Healing, HP bonuses |
| Nature | +Beast taming, survival skills |
| Sea | +Water magic, swim ability |
| Sky | +Lightning magic, speed |
| Fire | +Fire damage, burn immunity |
| Trickery | +Stealth, trap skills |
| Fortune | +Luck, better loot |
| Craft | +Crafting, equipment bonuses |

---

## Unique Pantheon Monsters (15+ per Pantheon)

Each pantheon has **15+ unique monsters** in three tiers with specific prerequisites.

### Tier Structure
| Tier | Count | Spawn Conditions |
|------|-------|------------------|
| **Common** | 5-6 | Biome-linked (ruins=Greek, frozen=Norse, desert=Egyptian) |
| **Rare** | 5-6 | Shrine encounter, patron favor, special events |
| **Legendary** | 3-4 | Boss-tier, achievement unlock, storyline |

### Prerequisites by Tier
- **Common**: Floor + Biome match
- **Rare**: Patron deity match OR shrine discovery OR floor 20+
- **Legendary**: Specific achievement + floor 40+ OR quest completion

### Biome-Pantheon Associations
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

### Example: Greek Pantheon Monsters (15)
| Monster | Tier | CR | Prerequisites |
|---------|------|-----|---------------|
| Harpy | Common | 2.0 | Ruins biome |
| Satyr | Common | 1.5 | Forest/ruins |
| Centaur | Common | 3.0 | Plains/ruins, floor 10+ |
| Cyclops | Common | 4.0 | Cave/ruins, floor 15+ |
| Gorgon | Common | 5.0 | Ruins, floor 20+ |
| Chimera | Rare | 6.0 | Greek patron OR shrine |
| Minotaur | Rare | 5.5 | Labyrinth event OR floor 25+ |
| Nemean Lion | Rare | 7.0 | Greek patron, floor 30+ |
| Hydra | Rare | 8.0 | Swamp + Greek shrine |
| Cerberus | Rare | 9.0 | Underworld biome, floor 40+ |
| Sphinx | Rare | 7.5 | Riddle event, INT check |
| Typhon | Legendary | 12.0 | Defeat 5 Greek rares |
| Echidna | Legendary | 11.0 | Mother of monsters quest |
| Scylla | Legendary | 13.0 | Sea biome + floor 50+ |
| Charybdis | Legendary | 14.0 | Paired with Scylla encounter |

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

**Ambush While Resting**
```
You settle down to rest when you hear movement...

[Stay alert] - PER check, avoid ambush
[Flee immediately] - AGI check, escape
[Spring trap] - Attack first if detected
[Keep resting] - Ambushed if enemies present
```

**Past Adventurer's Cache**
```
You find the remains of a fallen adventurer...

[Search body] - Roll loot table
[Examine equipment] - May find rare weapon
[Read journal] - Learn dungeon info, maybe skill observation
[Bury respectfully] - Small karma boost
```

---

## Level System (Achievement-Based)

### Core Concept

**Max Level: 10** (DanMachi-inspired)
- Level 1: Fledgling adventurer
- Level 2: Novice adventurer (Base Job unlock)
- Level 3: Competent adventurer
- Level 4: Veteran adventurer
- Level 5: Elite adventurer (Specialization unlock)
- Level 6: Champion adventurer
- Level 7: Renowned adventurer
- Level 8: Legendary adventurer (Advanced Class unlock)
- Level 9: Mythic adventurer
- Level 10: Paragon (Denatus title reveal)

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

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | First Blood | STANDARD | Kill 10 monsters | Guild (automatic) |
| 2 | Tower Initiate | STANDARD | Reach Floor 5, return alive | Guild (automatic) |
| 3 | The Cleanser | CHALLENGING | Clear entire floor without retreat | Tavern veteran (rep +3) |
| 4 | Undying Will | CHALLENGING | Win 3 fights at <30% HP | Temple priest (rep +5) |
| 5 | Collector of Spoils | CHALLENGING | Acquire 5 Uncommon+ items | Blacksmith (rep +3) |
| 6 | Slayer of the Strong | HEROIC | Solo kill Elite monster | Arena Master (rep +6) |
| 7 | Untouchable | HEROIC | Clear Floors 3-5 with 0 damage taken | Wandering Sage (rare spawn) |
| 8 | Speaker to All | HEROIC | Reach rep +5 with 5 different NPCs | Library research (200g) |
| 9 | Dragonblood Initiate | LEGENDARY | Survive encounter with Dragon-type | Ancient tome (rep +8) |
| 10 | The Impossible Novice | MYTHIC | Kill Dragon-type at Level 1 | UNDISCOVERED |

**War Domain Bonus**: *Ares' First Offering* (CHALLENGING) - Kill 5 enemies in single room
**Death Domain Bonus**: *Hades' Tithe* (CHALLENGING) - Kill 5 undead enemies

### Level 2 → 3 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Delver's Mark | STANDARD | Reach Floor 10, return alive | Guild (automatic) |
| 2 | Hundred Hands | STANDARD | Accumulate 50 total kills | Guild (automatic) |
| 3 | Treasure Hunter | CHALLENGING | Open 10 chests without triggering traps | Library (150g) |
| 4 | The Survivor | CHALLENGING | Return from Floor 8+ with <20% HP | Tavern rumor |
| 5 | Weakness Exploiter | CHALLENGING | Kill enemies using 3 damage types | Academy (rep +4) |
| 6 | Elite Slayer | HEROIC | Kill 3 Elite-prefix monsters | Arena Master (rep +7) |
| 7 | Shadow Walker | HEROIC | Complete 2 floors using only stealth | Shadow contact (AGI D+) |
| 8 | Shrine Blessed | HEROIC | Receive blessings from 3 shrines | Temple (rep +6) |
| 9 | Affix Breaker | LEGENDARY | Solo kill double-affix monster | Past adventurer journal |
| 10 | The Untouched | MYTHIC | Reach Floor 10 taking exactly 0 damage | UNDISCOVERED |

**Magic Domain Bonus**: *Hecate's Whisper* (CHALLENGING) - Kill using 3 spell types
**Trickery Domain Bonus**: *Loki's Jest* (CHALLENGING) - Flee 3 times, then return and win all

### Level 3 → 4 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Deep Diver | STANDARD | Reach Floor 15, return alive | Guild (automatic) |
| 2 | Veteran's Mark | STANDARD | Accumulate 100 total kills | Guild (automatic) |
| 3 | The Wealthy | CHALLENGING | Accumulate 5,000 gold | Merchant (rep +4) |
| 4 | Trap Master | CHALLENGING | Disarm 15 traps | Library (200g) |
| 5 | Secret Seeker | CHALLENGING | Find 5 secret rooms | Archivist (rep +5) |
| 6 | Boss Breaker | HEROIC | Defeat floor boss without consumables | Arena Master (rep +8) |
| 7 | Mana Conduit | HEROIC | Kill 20 enemies using only magic | Academy Head (rep +8) |
| 8 | Iron Will | HEROIC | Win 5 fights at <10% HP | Temple (rep +7) |
| 9 | Legendary Prey | LEGENDARY | Solo kill Legendary-affix monster | Ancient scroll |
| 10 | The Deep Walker | MYTHIC | Reach Floor 20 before Level 4 | UNDISCOVERED |

**War Domain Bonus**: *Odin's Trial* (HEROIC) - Win 10 fights without healing
**Nature Domain Bonus**: *Beast Tongue* (CHALLENGING) - Tame a beast companion

### Level 4 → 5 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Master Explorer | STANDARD | Reach Floor 20, return alive | Guild (automatic) |
| 2 | Slaughter Count | STANDARD | Accumulate 200 total kills | Guild (automatic) |
| 3 | Reputation Builder | CHALLENGING | Reach rep +10 with any NPC | Tavern (rep +5) |
| 4 | Biome Walker | CHALLENGING | Visit 4 different biome types | Library (250g) |
| 5 | Efficient Killer | CHALLENGING | Win 25 fights taking <10% of max HP | Arena (rep +6) |
| 6 | Elemental Master | HEROIC | Deal 5,000 damage with each element | Academy (rep +10) |
| 7 | The Silent One | HEROIC | Complete 5 floors using only stealth kills | Shadow Guild |
| 8 | Pantheon Witness | HEROIC | Encounter 3 pantheon-specific monsters | Temple (rep +9) |
| 9 | Dual Affix Destroyer | LEGENDARY | Kill 5 double-affix monsters solo | Archivist quest |
| 10 | Floor 25 at Four | MYTHIC | Reach Floor 25 before Level 5 | UNDISCOVERED |

**Fortune Domain Bonus**: *Tyche's Gambit* (HEROIC) - Win 5 fights with <5% calculated odds
**Death Domain Bonus**: *Anubis' Scale* (HEROIC) - Win 5 fights at exactly 1 HP

### Level 5 → 6 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Journey Master | STANDARD | Reach Floor 25, return alive | Guild (automatic) |
| 2 | Battle Hardened | STANDARD | Accumulate 300 total kills | Guild (automatic) |
| 3 | Elemental Mastery | CHALLENGING | Kill enemies using 4 damage types | Academy (rep +7) |
| 4 | The Survivor | CHALLENGING | Return from Floor 20+ with <10% HP, no potions | Tavern rumor |
| 5 | Treasure Seeker | CHALLENGING | Find and open 5 secret rooms | Archivist (rep +8) |
| 6 | Boss Breaker II | HEROIC | Defeat 3 floor bosses without consumables | Arena Master (rep +10) |
| 7 | The Silent One | HEROIC | Complete 5 consecutive floors, stealth only | Shadow Guild |
| 8 | Mana Conduit II | HEROIC | Kill 50 enemies using only magic | Academy Head (rep +10) |
| 9 | Affix Slayer | LEGENDARY | Solo kill double-affix High-tier monster | Ancient scroll (Floor 20+) |
| 10 | The Deep Walker II | MYTHIC | Reach Floor 35 before Level 6 | UNDISCOVERED |

**Magic Domain Bonus**: *Thoth's Theorem* (HEROIC) - Win 10 fights using only magic
**Trickery Domain Bonus**: *Spider's Patience* (HEROIC) - Kill 15 enemies from stealth

### Level 6 → 7 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Champion's Path | STANDARD | Reach Floor 35, return alive | Guild (automatic) |
| 2 | Warrior's Count | STANDARD | Accumulate 500 total kills | Guild (automatic) |
| 3 | Master Diplomat | CHALLENGING | Reach rep +12 with 3 NPCs | Tavern (rep +8) |
| 4 | All Biomes | CHALLENGING | Visit all 9 biome types | Library (300g) |
| 5 | Perfect Efficiency | CHALLENGING | Win 50 fights taking <5% max HP | Arena (rep +9) |
| 6 | Triple Threat | HEROIC | Kill 3 Elites in single descent without returning | Arena Master (rep +12) |
| 7 | Pacifist Floor | HEROIC | Complete floor without dealing direct damage | Sage (rare spawn) |
| 8 | Multi-Pantheon | HEROIC | Encounter monsters from 5 pantheons | Temple (rep +10) |
| 9 | Legendary Hunter | LEGENDARY | Solo kill 3 Legendary-affix monsters | Ancient texts |
| 10 | Floor 45 at Six | MYTHIC | Reach Floor 45 before Level 7 | UNDISCOVERED |

**War Domain Bonus**: *Battle Fury* (LEGENDARY) - Kill 50 enemies in single descent
**Nature Domain Bonus**: *Pack Alpha* (HEROIC) - Have 3 beast companions simultaneously

### Level 7 → 8 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Renowned Explorer | STANDARD | Reach Floor 45, return alive | Guild (automatic) |
| 2 | Legend's Count | STANDARD | Accumulate 750 total kills | Guild (automatic) |
| 3 | Master Merchant | CHALLENGING | Accumulate 50,000 gold | Merchant Guild |
| 4 | Skill Collector | CHALLENGING | Learn 30 different skills | Academy (rep +12) |
| 5 | Status Master | CHALLENGING | Inflict every status effect type | Library (400g) |
| 6 | Perfect Run | HEROIC | Complete 10 floors without taking damage | Arena Master (rep +14) |
| 7 | The Judge | HEROIC | Execute 25 enemies with finishing moves | Shadow Guild |
| 8 | Deity's Champion | HEROIC | Complete 5 God Challenges | Shrine (deity favor) |
| 9 | Mythic Prey | LEGENDARY | Solo kill Mythic-affix monster | Temple oracle |
| 10 | Floor 55 at Seven | MYTHIC | Reach Floor 55 before Level 8 | UNDISCOVERED |

**Death Domain Bonus**: *Reaper's Equal* (LEGENDARY) - Kill Legendary undead solo
**Fortune Domain Bonus**: *Jackpot* (HEROIC) - Find 3 Legendary items in one descent

### Level 8 → 9 Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Legendary Explorer | STANDARD | Reach Floor 60, return alive | Guild (automatic) |
| 2 | Master's Count | STANDARD | Accumulate 1000 total kills | Guild (automatic) |
| 3 | Full Mastery | CHALLENGING | All stats at Grade B or higher | Academy (rep +14) |
| 4 | Complete Arsenal | CHALLENGING | Own Epic+ weapon for each stat type | Blacksmith (rep +15) |
| 5 | Guild Master | CHALLENGING | Reach rep +15 with 5 NPCs | Tavern (rep +12) |
| 6 | Pantheon Walker | HEROIC | Defeat monsters from 7 pantheons | Temple (rep +14) |
| 7 | The Immortal Run | HEROIC | Complete 15 floors without dying | Oracle |
| 8 | Perfect Paragon | HEROIC | All 8 stats at Grade A or higher | Academy Head |
| 9 | Godslayer's Mark | LEGENDARY | Defeat pantheon Legendary matching your deity | Deity (shrine event) |
| 10 | Floor 70 at Eight | MYTHIC | Reach Floor 70 before Level 9 | UNDISCOVERED |

**Magic Domain Bonus**: *Arcane Transcendence* (LEGENDARY) - Deal 50,000 magic damage in run
**Trickery Domain Bonus**: *The Perfect Con* (LEGENDARY) - Complete floor with 0 direct attacks

### Level 9 → 10 (Paragon) Achievements

| # | Name | Tier | Requirement | Discovery Source |
|---|------|------|-------------|------------------|
| 1 | Master of the Tower | STANDARD | Reach Floor 75, return alive | Guild (automatic) |
| 2 | Paragon's Count | STANDARD | Accumulate 1500 total kills | Guild (automatic) |
| 3 | Pantheon Walker | CHALLENGING | Encounter monsters from all 9 pantheons | Temple (rep +15) |
| 4 | Complete Arsenal II | CHALLENGING | Own Legendary weapon for each stat type | Blacksmith Master |
| 5 | Social Architect | CHALLENGING | Reach rep +15 with 8 NPCs | Tavern Master |
| 6 | Legendary Hunter | HEROIC | Solo kill 5 Legendary-affix monsters | Ancient texts |
| 7 | Perfect Paragon | HEROIC | All 8 stats at Grade S or higher | Academy Grandmaster |
| 8 | The Pacifist's Path | HEROIC | Complete achievement dealing 0 direct damage | Wandering Sage |
| 9 | Godslayer's Trial | LEGENDARY | Defeat YOUR pantheon's Legendary monster | Deity (required) |
| 10 | Ascension Absolute | MYTHIC | Floor 90+, solo Legendary, 0 damage, full HP return | UNDISCOVERED |

**War Domain Bonus**: *Blood God's Feast* (LEGENDARY) - Kill 100 enemies in single descent
**Death Domain Bonus**: *Death's Equal* (LEGENDARY) - Defeat Legendary undead + survive 1 HP 3 times

### Achievement Stacking

Complete multiple achievements before leveling up for bonus rewards:

| Stack Count | Multiplier |
|-------------|------------|
| 1 achievement | 1.0x rewards |
| 2 achievements | 1.25x rewards |
| 3 achievements (max) | 1.5x rewards |

**Tier Synergy Bonuses**:
- 2x same tier: +1 additional stat point
- 3x same tier: +2 additional stat points
- Mixed CHALLENGING + HEROIC + LEGENDARY: "Versatile" title modifier

---

## Achievement Discovery System

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

### Rumor Format (Guild/Tavern)

```
"Hey, you hear about that adventurer who [vague description]? Word is
they leveled up instantly. Nobody knows exactly how, but they were
spotted near [location hint] before it happened..."
```

### Deity Hints

Your patron deity provides hints based on your playstyle:

| Domain | Hint Style | Example |
|--------|------------|---------|
| War | Direct challenge | "Seek the strong. Destroy them." |
| Magic | Cryptic riddle | "Power flows through those who channel, not those who swing." |
| Trickery | Mischievous | "Why fight when you can simply... not be there?" |
| Death | Ominous | "Walk the line between life and death. Repeatedly." |
| Fortune | Lucky | "The cards favor the bold. Or the foolish. Same thing." |
| Nature | Observant | "The beasts know paths you do not. Listen." |

---

## Dual Agency System (Player + Deity)

### Approval Flow

```
[Player Completes Achievement]
          ↓
[System Tags Achievement with Domains]
          ↓
[Deity Evaluates]:
  - Domain Alignment
  - Achievement Tier (GLORY)
  - Current Favor Level
          ↓
[Outcome: APPROVED or CHALLENGED]
```

### Domain Alignment

| Alignment | Deity Reaction |
|-----------|----------------|
| **Strong** | Enthusiastic approval, bonus blessing |
| **Neutral** | Standard approval |
| **Weak Misalign** | Reluctant approval, no bonus |
| **Strong Misalign** | May refuse (unless LEGENDARY+) |

**LEGENDARY+ achievements override domain misalignment** - all deities respect true glory.

### If Challenged (Deity Refuses)

Options:
1. Complete alternative achievement deity prefers
2. Accept **God Challenge** (time-limited deity-assigned task)
3. Sacrifice valuable items/gold to gain approval
4. Continue playing; next achievement auto-evaluated

### Deity Enhancement on Approval

| Enthusiasm | Enhancement |
|------------|-------------|
| Reluctant | None |
| Standard | Minor domain blessing |
| Enthusiastic | Major domain blessing |
| Ecstatic | Major blessing + bonus stat points |

---

## God Challenge System

Time-limited deity-assigned achievements that test alignment with their domain.

### Trigger Conditions

- Achievement rejected by deity
- Player requests guidance at shrine (costs favor)
- Random shrine event (5% chance)
- Approaching milestone without discovered achievements

### Example Challenges by Domain

| Domain | Challenge | Requirement | Time Limit | Tier |
|--------|-----------|-------------|------------|------|
| War | Trial of Carnage | Kill 50 enemies | 5 floors | CHALLENGING |
| War | Champion's Gauntlet | Defeat 3 Elites consecutively | 3 floors | HEROIC |
| War | Worthy Opponent | Solo boss at -2 level disadvantage | 10 floors | LEGENDARY |
| Wisdom | The Tactician | Win 10 fights using status effects | 5 floors | HEROIC |
| Wisdom | Bloodless Victory | Clear 3 floors without killing | 5 floors | LEGENDARY |
| Trickery | Shadow's Game | Kill 10 enemies from stealth | 5 floors | CHALLENGING |
| Trickery | The Escape Artist | Flee 5 times, then return and win all | 3 floors | HEROIC |
| Death | Death's Threshold | Win 5 fights at <10% HP | 5 floors | CHALLENGING |
| Death | The Undying | Survive 3 lethal hits (via saves) | 10 floors | HEROIC |
| Fortune | Lucky Streak | Land 10 critical hits | 5 floors | CHALLENGING |
| Fortune | The Impossible Odds | Win fight with <1% success chance | Until death | LEGENDARY |

### Failure Consequences

| Tier | Consequence |
|------|-------------|
| CHALLENGING | -10% deity favor, challenge cooldown |
| HEROIC | -25% deity favor, minor curse (remove at temple) |
| LEGENDARY | -50% deity favor, temporary blessing block |

### Exceeded Completion Bonus

| Exceed Threshold | Bonus |
|------------------|-------|
| 150% of requirement | Title modifier added |
| 200% of requirement | Bonus stat points |
| 300% of requirement | Unique blessing |

---

## Action-Based Stat Growth (Bethesda-Style)

### Core Mechanic

Every action increases a specific stat's proficiency points. When proficiency reaches threshold, grade increases.

```typescript
proficiencyThreshold(currentGrade) = 100 * (gradeIndex + 1)
// I→H: 100 points, H→G: 200 points, ... S→SS: 1000 points
```

### STR (Strength) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Melee attack (hit) | +3 | Per hit |
| Melee attack (kill) | +10 | Bonus on kill |
| Force open door/chest | +5 | Strength check |
| Carry heavy loot (per room) | +1 | While encumbered |
| Use STR skill | +5 | Per use |
| Block with shield | +2 | Per block |

### PER (Perception) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Ranged attack (hit) | +3 | Per hit |
| Detect trap before trigger | +8 | Per trap |
| Find secret room | +15 | Per secret |
| Identify enemy weakness | +5 | First time per type |
| Search room thoroughly | +2 | Per room |
| Critical hit (ranged) | +5 | Bonus |

### END (Endurance) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Take damage | +1 | Per 10 damage taken |
| Survive status effect | +5 | Per effect survived |
| Walk while poisoned | +2 | Per room |
| Survive below 20% HP | +10 | Per combat |
| Wear heavy armor (per room) | +1 | While in heavy armor |
| Long dungeon run (10+ rooms) | +5 | Bonus |

### CHA (Charisma) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| NPC conversation | +3 | Per meaningful chat |
| Successful negotiation | +10 | Per negotiation |
| Intimidation success | +8 | Per success |
| Persuasion success | +8 | Per success |
| Gain NPC reputation | +5 | Per rep level |
| Party leadership action | +5 | If leading party |

### INT (Intelligence) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Cast spell | +3 | Per spell |
| Kill with magic | +8 | Per magic kill |
| Learn new skill | +15 | Per skill learned |
| Read book/scroll | +10 | Per item |
| Solve puzzle | +12 | Per puzzle |
| Identify item | +5 | Per identification |

### AGI (Agility) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Dodge attack | +3 | Per dodge |
| Perfect dodge | +8 | Last-moment dodge |
| Flee successfully | +10 | Per escape |
| First strike in combat | +5 | If you act first |
| Stealth kill | +10 | Per stealth kill |
| Disarm trap | +8 | Per trap disarmed |

### WIS (Wisdom) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Pray at shrine | +10 | Per shrine |
| Receive deity blessing | +15 | Per blessing |
| Use divine skill | +5 | Per use |
| Heal ally | +5 | Per heal |
| Purify curse | +10 | Per curse removed |
| Meditate/rest | +3 | Per rest |

### LCK (Luck) Growth Actions

| Action | Points | Notes |
|--------|--------|-------|
| Critical hit (any) | +3 | Per crit |
| Find rare loot | +5 | Per rare+ item |
| Gamble/random choice success | +8 | Per success |
| Survive death (1 HP) | +15 | Per survival |
| Lucky event outcome | +10 | RNG-based events |
| Natural 20 (dice checks) | +5 | Per nat 20 |

---

## Guided Grinding (Deliberate Training)

Players can deliberately train specific stats at town locations:

| Stat | Location | Method | Cost |
|------|----------|--------|------|
| STR | Academy | Strength training | 50g per session |
| PER | Library | Study enemy guides | 30g per book |
| END | Arena | Take hits deliberately | 75g per session |
| CHA | Tavern | Social practice minigames | 25g per game |
| INT | Academy | Study sessions, puzzles | 40g per session |
| AGI | Arena | Dodge-only training | 75g per session |
| WIS | Temple | Meditation | 20g offering |
| LCK | Casino | Games of chance | Varies (gambling) |

---

## Monster Loot by CR

### Loot Quality by CR

| CR Range | Common | Uncommon | Rare | Epic | Legendary |
|----------|--------|----------|------|------|-----------|
| 0.5-1.5 | 80% | 18% | 2% | 0% | 0% |
| 1.5-3.0 | 65% | 28% | 6% | 1% | 0% |
| 3.0-5.0 | 50% | 35% | 12% | 3% | 0% |
| 5.0-8.0 | 35% | 40% | 18% | 6% | 1% |
| 8.0-12.0 | 20% | 35% | 30% | 12% | 3% |
| 12.0+ | 10% | 25% | 35% | 22% | 8% |

### Gold Drops

```typescript
goldDrop(cr) = floor(cr * 10 * random(0.8, 1.2))
// CR 1.0 = 8-12 gold
// CR 5.0 = 40-60 gold
// CR 10.0 = 80-120 gold
```

### Monster Part Drops

| CR Range | Part Type | Drop Chance |
|----------|-----------|-------------|
| Any | Monster-specific part | 30% |
| 3+ | Rare part | 15% |
| 6+ | Epic part | 8% |
| 10+ | Legendary part | 3% |

### Guaranteed Drops

| Monster Type | Guaranteed Drop |
|--------------|-----------------|
| Elite (has prefix) | +1 loot roll, +50% gold |
| Rare (has suffix) | +1 loot roll, rare+ guaranteed |
| Boss (prefix + suffix) | +2 loot rolls, epic+ guaranteed |
| Pantheon Rare | Pantheon-specific item (50%) |
| Pantheon Legendary | Unique pantheon item (100%) |

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

### CR Danger Indicator

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

### Preventing Power Creep

1. **Floor CR caps** - Floor determines max monster CR, not player level
2. **Level-gated achievements** - Can't level just by grinding weak enemies
3. **Stat growth diminishing** - Higher grades require more proficiency
4. **Equipment requirements** - Best gear needs high stats AND high level
5. **Paragon as ceiling** - Level 10 is max, focus shifts to optimization

---

## Loot Tables

### Loot Quality Tiers

| Tier | Rarity | Color |
|------|--------|-------|
| Common | 50% | White |
| Uncommon | 30% | Green |
| Rare | 15% | Blue |
| Epic | 4% | Purple |
| Legendary | 1% | Gold |

### Floor-Based Loot Pools

Each floor range has a specific loot pool ensuring progression-appropriate drops.

### LCK Influence

```typescript
effective_rarity = base_rarity * (1 + LCK / 100)
// LCK 50 = +50% chance of higher rarity
```

---

## Town Economy

### Currency

- **Gold** - Primary currency
- **Tokens** - Guild currency for special items
- **Deity Favor** - Earned through shrine offerings

### Shops and Services

| Service | Cost Range |
|---------|------------|
| Basic weapon | 50-500 gold |
| Basic armor | 100-1000 gold |
| Health potion | 25 gold |
| Antidote | 50 gold |
| Skill training | 500-5000 gold |
| Equipment repair | 10% of item value |
| Identification | 100 gold |
| Blessing | 250 gold |
| Curse removal | 500 gold |

### Reputation Discounts

Discounts stack with reputation:
- +6 to +10: 10% off
- +11 to +15: 25% off
- +16 to +20: 40% off

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
- Achievements
- Unlocked deities
- Codex entries

---

## Project Structure

```
Kohrvellia/
├── app/                    # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx           # Title screen
│   ├── (menu)/             # New game, continue, codex, settings
│   ├── (town)/             # Guild, Library, Academy, Blacksmith, etc.
│   ├── (prologue)/         # Intro story
│   ├── (familia)/          # Pantheon/deity selection
│   ├── (dungeon)/          # Floor, room, event, combat, loot
│   ├── (character)/        # Stats, skills, equipment, job selection
│   ├── (paragon)/          # Paragon evolution, title reveal ceremony
│   └── (death)/            # Death screen, epitaph
├── components/
│   ├── ui/                 # Button, Card, Text, ProgressBar
│   ├── game/               # StatBlock, DeityCard, CombatLog
│   ├── combat/             # Combat UI components
│   ├── town/               # NPC interaction components
│   ├── paragon/            # Title reveal, buff display
│   └── narrative/          # TextScroller, ChoiceSelector
├── stores/                 # Zustand state management
│   ├── gameStore.ts        # Run lifecycle, meta-progression
│   ├── characterStore.ts   # Stats, skills, inventory
│   ├── jobStore.ts         # Job system
│   ├── familiaStore.ts     # Deity, blessings
│   ├── dungeonStore.ts     # Floor, rooms, depth tracking
│   ├── combatStore.ts      # Combat state, AI
│   ├── reputationStore.ts  # NPC likeability
│   ├── denatusStore.ts     # Hidden behavement tracking (Soul System)
│   └── settingsStore.ts    # User preferences
├── types/                  # TypeScript definitions
│   ├── character.ts
│   ├── combat.ts
│   ├── dungeon.ts
│   ├── items.ts
│   ├── monsters.ts
│   ├── pantheon.ts
│   ├── skills.ts
│   ├── behavement.ts       # Behavement tracking types
│   ├── denatus.ts          # Title generation types
│   └── pantheonMonster.ts  # Unique monster types
├── data/                   # Static game data
│   ├── pantheons/          # One file per pantheon
│   │   └── monsters/       # 15+ unique monsters per pantheon
│   ├── jobs/               # Job definitions
│   ├── skills/             # Skill definitions
│   ├── monsters/
│   │   ├── bases/          # Base monster types
│   │   ├── prefixes/       # Affix prefixes
│   │   └── suffixes/       # Affix suffixes
│   ├── weapons/
│   │   ├── bases/          # Base weapon types
│   │   ├── materials/      # Material modifiers
│   │   ├── qualities/      # Quality tiers
│   │   └── enchantments/   # Enchantment effects
│   ├── armor/
│   ├── npcs/               # NPC definitions per location
│   ├── events/             # Event definitions
│   ├── behavements/        # 75+ behavement definitions
│   │   ├── combat.ts       # Combat behavements (24)
│   │   ├── defense.ts      # Defense behavements (20)
│   │   ├── risk.ts         # Risk/caution behavements (18)
│   │   ├── social.ts       # Social behavements (8)
│   │   ├── exploration.ts  # Exploration behavements (8)
│   │   └── resource.ts     # Resource behavements (7)
│   └── loot-tables/        # Floor-based loot pools
├── lib/                    # Game logic
│   ├── dungeonGenerator.ts       # Procedural floor generation
│   ├── monsterGenerator.ts       # Modular monster assembly
│   ├── pantheonMonsterSpawner.ts # Unique monster prerequisites
│   ├── weaponGenerator.ts        # Modular weapon assembly
│   ├── combatEngine.ts           # Damage calculation, weakness
│   ├── enemyAI.ts                # Smart enemy behavior
│   ├── skillObserver.ts          # Skill learning system
│   ├── jobSystem.ts              # Job unlocks, progression
│   ├── reputationSystem.ts       # NPC likeability
│   ├── depthTracker.ts           # Push your luck warnings
│   ├── denatusTracker.ts         # Hidden behavement tracking hooks
│   ├── titleGenerator.ts         # Generate Paragon title from behavements
│   ├── paragonBuffGenerator.ts   # Generate unique buffs from title
│   ├── rng.ts                    # Seeded random number generator
│   ├── haptics.ts                # Tactile feedback
│   └── persistence.ts            # Save/load system
├── constants/              # Design system
│   ├── Colors.ts
│   ├── Typography.ts
│   ├── Spacing.ts
│   ├── Animations.ts
│   └── GameConstants.ts    # Balance values
├── hooks/                  # Custom React hooks
├── assets/
│   ├── fonts/
│   └── images/
├── CLAUDE.md               # This file (main game design doc)
├── SOUL_SYSTEM.md          # Complete Denatus/Behavements documentation
├── app.json
├── package.json
└── tsconfig.json
```

---

## Critical Balance Guidelines

1. **Floor CR is CAPPED** - Floor 1 can never spawn legendary monsters
2. **Rest sites are RARE** - Exponential decay, very rare deep
3. **Reputation is HARD** - Each level harder, easy to lose
4. **Counter/Parry can't be spammed** - Costs SP, has cooldown
5. **Magic is BALANCED** - SP scarce, enemies resist
6. **Levels are MILESTONES** - Not grind
7. **Loot is KING** - Dopamine from drops, not XP

---

## Development Notes

- Use strict TypeScript (no `any`)
- All game constants in `constants/GameConstants.ts`
- All balance values should be easily tunable
- Comprehensive type definitions for everything
- Zustand stores should be atomic and composable
- Lazy-load pantheon data to manage bundle size
- Use seeded RNG for reproducible testing
