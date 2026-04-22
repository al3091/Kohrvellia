# KOHRVELLIA - Equipment System

> See [GAME_INDEX.md](../GAME_INDEX.md) for navigation.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Base Weapons | ✅ Implemented | 32 types (4 per stat) |
| Quality Tiers | ✅ Implemented | Crude → Legendary (6 tiers) |
| Material Types | ✅ Implemented | Rusty → Adamantine (7 types) |
| Enchantments | ✅ Implemented | 7 enchantment types |
| Weapon Generation | ✅ Implemented | Floor-scaled random drops |
| Stat-Based Training | ✅ Implemented | Attack with weapon trains its stat |
| Starter Weapons | ✅ Implemented | Auto-assigned based on highest stat |
| Equipment Slots | ✅ Implemented | Weapon + 6 armor slots |
| Inventory UI | ✅ Implemented | Full inventory with equip/unequip |
| Weapon Details Modal | ✅ Implemented | Stats, rarity, enchantments |
| Combat Weapon Drops | ✅ Implemented | Post-combat equip/discard choice |
| Armor System | ⏳ Pending | Slots defined, no drops yet |
| Accessories | ⏳ Pending | Rings, amulets planned |
| Crafting | ⏳ Pending | Material combination system |

---

## Modular Weapon System (Affix LEGO)

### Structure

```
[Quality] + [Material] + [Base Weapon] + [Enchantment]
```

---

## Base Weapons by Primary Stat

Each weapon type scales primarily with one stat.

### STR Weapons (10+)

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

### AGI Weapons (10+)

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

### PER Weapons (10+)

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

### INT Weapons (10+)

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

### WIS Weapons (10+)

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

### CHA Weapons (10+)

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

---

## Weapon Stat Requirements

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

---

## Materials (Affects Base Stats)

| Tier | Materials | Stat Modifier | Floor Available |
|------|-----------|---------------|-----------------|
| **Junk** | Rusty, Broken, Crude, Rotting | -20% | 1+ |
| **Common** | Iron, Bronze, Leather, Bone | Base (100%) | 1+ |
| **Uncommon** | Steel, Hardened Leather, Silver-Plated | +10% | 6+ |
| **Rare** | Silver, Damascus, Dragonscale, Darksteel | +25% | 11+ |
| **Epic** | Mithril, Adamantine, Celestial Steel, Voidstone | +50% | 36+ |
| **Legendary** | Orichalcum, Void Metal, Divine, Primordial | +100% | 51+ |

---

## Quality (Affects Reliability/Crit)

| Quality | Accuracy | Crit Chance | Damage | Availability |
|---------|----------|-------------|--------|--------------|
| Crude | -10% | 0% | -10% | Always |
| Standard | 0% | 0% | 0% | Always |
| Fine | 0% | +5% | 0% | Floor 6+ |
| Superior | 0% | +10% | +5% | Floor 11+ |
| Masterwork | +5% | +15% | +10% | Floor 21+ |
| Legendary | +10% | +25% | +20% | Floor 41+ |

---

## Enchantments (Adds Special Effects)

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

---

## Floor-Based Weapon Generation

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
