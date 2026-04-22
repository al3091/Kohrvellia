# KOHRVELLIA - Monster System

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Base Monsters | ✅ Implemented | 16 types (CR 0.5-3.5) |
| Prefix System | ✅ Implemented | Weak, Young, Fierce, Armored, Elite, Ancient, Mythic |
| Suffix System | ✅ Implemented | of Flame, of Frost, of Venom, the Swift, the Undying |
| CR Scaling | ✅ Implemented | Floor-based monster selection |
| Loot Tables | ✅ Implemented | 15% base + 5% per CR, boss always drops |
| Monster Stats | ✅ Implemented | HP, attack, defense scaling |
| Boss Monsters | ✅ Implemented | 1.5x HP modifier |
| Late-Game Monsters | ⏳ Pending | Giants, Demons, Dragons (CR 7+) |
| Mythic Variants | ⏳ Pending | CR 11+ legendary creatures |
| Regional Variants | ⏳ Pending | Biome-specific monsters |

---

## Modular Monster System (Affix LEGO)

### Structure

```
[Prefix] + [Base Monster] + [Suffix]
```

Each component adds to the monster's Challenge Rating (CR).

---

## Base Monsters

Base monsters have:
- Base HP, Attack, Defense
- Weakness/Resistance profile
- AI behavior pattern
- Base CR value

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

---

## Prefix Tiers

| Tier | CR Bonus | Prefixes | Effect |
|------|----------|----------|--------|
| **Negative (-0.3)** | -0.3 | Young, Weak, Starving, Injured | Reduced stats |
| **Low (+0.3)** | +0.3 | Feral, Wild, Roaming | Minor stat boost |
| **Mid (+0.5)** | +0.5 | Berserk, Armored, Swift, Cunning, Venomous | Specific enhancement |
| **High (+1.0)** | +1.0 | Elite, Ancient, Dire, Alpha, Corrupted | Major enhancement |
| **Legendary (+2.0)** | +2.0 | Mythic, Abyssal, Celestial, Primordial | Massive enhancement + special ability |

---

## Suffix Tiers

| Tier | CR Bonus | Suffixes | Effect |
|------|----------|----------|--------|
| **Low (+0.3)** | +0.3 | of the Wilds, the Scavenger, the Wanderer | Minor passive |
| **Mid (+0.5)** | +0.5 | of Poison, of Flame, of Frost, of Shadow, of Lightning | Elemental damage |
| **High (+1.0)** | +1.0 | of Regeneration, of Terror, of the Void, the Undying | Powerful passive |
| **Legendary (+2.0)** | +2.0 | World-Eater, Soul Reaver, the Deathless, Godslayer | Legendary ability |

---

## Floor-Based Affix Rules

| Floor | Max Affixes | Max Affix Tier |
|-------|-------------|----------------|
| 1-5 | 0 | None (base monsters only) |
| 6-10 | 1 | Low |
| 11-20 | 1 | Mid |
| 21-30 | 2 | Mid |
| 31-40 | 2 | High |
| 41-50 | 2 | High (5% chance Legendary) |
| 51+ | 3 | Legendary possible |

---

## Monster Generation Algorithm

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

## Loot Tables

### Loot Quality Tiers

| Tier | Rarity | Color |
|------|--------|-------|
| Common | 50% | White |
| Uncommon | 30% | Green |
| Rare | 15% | Blue |
| Epic | 4% | Purple |
| Legendary | 1% | Gold |

### LCK Influence

```typescript
effective_rarity = base_rarity * (1 + LCK / 100)
// LCK 50 = +50% chance of higher rarity
```
