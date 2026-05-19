/**
 * Domain Artifacts — 14 sacred items, one per domain.
 *
 * These prove mastery of the domain's core mechanic.
 * Any adventurer can earn them regardless of patron deity,
 * but they reflect the soul of each domain.
 * Harder than pantheon pieces. Less personal than deity relics.
 */

import type { SacredItem } from '../../types/SacredItem';

export const DOMAIN_ARTIFACTS: SacredItem[] = [

  // ===== WAR =====
  {
    id: 'domain_war_targe',
    name: "Warlord's Targe",
    lore: 'War does not require skills. It requires endurance.',
    tier: 'domain', slot: 'accessory', domainId: 'war',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Defeat every milestone boss on an accessible floor in a single run — using only basic attacks. No skills. Pure war.',
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [
        { metric: 'boss_kills_run', value: 3, description: 'Defeat 3 milestone bosses in one run' },
        { metric: 'skill_uses', value: 0, description: 'Zero skill uses the entire run' },
      ],
    },
    passiveId: 'domain_war_passive',
    passiveDescription: 'Each floor deeper you descend, basic attack damage increases by 2% (max +30% at Floor 15).',
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 30, END: 20 } },
  },

  // ===== MAGIC =====
  {
    id: 'domain_magic_lens',
    name: 'The Arcane Lens',
    lore: 'The lens does not add power. It removes waste.',
    tier: 'domain', slot: 'accessory', domainId: 'magic',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Magic is devotion to the formula. Spend over 2,000 SP total on skills in a single run.',
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [{ metric: 'skill_sp_spent', value: 2000, description: 'Spend 2,000+ SP on skills in one run' }],
    },
    passiveId: 'domain_magic_passive',
    passiveDescription: 'Once per combat: use one skill without it going on cooldown.',
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 30, WIS: 25 } },
  },

  // ===== TRICKERY =====
  {
    id: 'domain_trickery_coin',
    name: "The Fool's Coin",
    lore: 'The coin always lands on its edge.',
    tier: 'domain', slot: 'accessory', domainId: 'trickery',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Cause enemies to miss 30 times in runs where you killed the floor boss WITHOUT using the basic Attack action as the killing blow.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [
        { metric: 'dodges_total', value: 30, description: '30 enemy misses (dodges) in runs where you killed the boss' },
        { metric: 'boss_noattack', value: 1, description: 'At least one of those runs: boss killed without basic attack as killing blow' },
      ],
    },
    passiveId: 'domain_trickery_passive',
    passiveDescription: "Once per run: 'cheat death' in any non-boss combat — instead of dying, flee at 100% success and lose only 1 HP.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { AGI: 25, LCK: 25 } },
  },

  // ===== DEATH =====
  {
    id: 'domain_death_sickle',
    name: "The Pale Reaper's Sickle",
    lore: 'It harvests what is ready. Everything is eventually ready.',
    tier: 'domain', slot: 'weapon', domainId: 'death',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Death harvests all floors equally. Kill 3 milestone bosses in a single run.',
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [{ metric: 'boss_kills_run', value: 3, description: 'Kill 3 milestone bosses in one run' }],
    },
    passiveId: 'domain_death_passive',
    passiveDescription: 'Enemies below 15% HP receive +50% damage from this weapon. Ignores 20% of all defense.',
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'WIS', finalDamage: 40, finalAccuracy: 92, finalCritChance: 0.25, range: 'melee', damageType: 'dark' },
  },

  // ===== FORTUNE =====
  {
    id: 'domain_fortune_wheel',
    name: 'The Loaded Wheel',
    lore: 'She spins it. You just have to still be standing when it stops.',
    tier: 'domain', slot: 'accessory', domainId: 'fortune',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: "Fortune protects her favorites. Win 25 consecutive combats without being critically hit.",
    acquisition: {
      scope: 'single_character', requireAll: true,
      requirements: [{ metric: 'consecutive_fights', value: 25, targetType: 'no_crit_received', description: '25 combat wins in a row without receiving a critical hit' }],
    },
    passiveId: 'domain_fortune_passive',
    passiveDescription: 'Once per floor: spin Fortune\'s wheel — gain one of 8 random boons (SP restore, status clear, enemy stun, damage aura, gold drop, heal, crit buff, or rare drop).',
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 30 } },
  },

  // ===== NATURE =====
  {
    id: 'domain_nature_ring',
    name: 'Bark and Blood Ring',
    lore: "Nature doesn't care about your timeline.",
    tier: 'domain', slot: 'accessory', domainId: 'nature',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: "Nature rewards those who endure cycles — not those who rush. Complete 20 dungeon runs surviving to Floor 10 or beyond.",
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'floors_reached', value: 10, targetType: 'runs_reaching_floor10', description: '20 separate runs reaching Floor 10+ lifetime' }],
    },
    passiveId: 'domain_nature_passive',
    passiveDescription: 'Your HP regenerates 1% per floor you descend.',
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 25, AGI: 20 } },
  },

  // ===== WISDOM =====
  {
    id: 'domain_wisdom_lens',
    name: "The Sage's Lens",
    lore: 'The sage does not fight the unknown. She makes everything known.',
    tier: 'domain', slot: 'accessory', domainId: 'wisdom',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Wisdom requires seeing everything completely. Observe every single enemy in 5 consecutive floors before engaging any of them.',
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [{ metric: 'observe_total', value: 1, targetType: 'five_complete_floors', description: 'In a single run: observe every enemy on 5 complete floors before making any kills on those floors' }],
    },
    passiveId: 'domain_wisdom_passive',
    passiveDescription: 'Once an enemy type has been observed by you, that type deals -10% damage to your character forever.',
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 35, INT: 20 } },
  },

  // ===== CRAFT =====
  {
    id: 'domain_craft_hammer',
    name: 'The First Hammer',
    lore: 'The first hammer did not make the second hammer. The second hammer made everything.',
    tier: 'domain', slot: 'weapon', domainId: 'craft',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'The Craft domain is the domain of making. Perform 10 total weapon upgrades at the Blacksmith.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'weapon_upgrades', value: 10, description: 'Perform 10 weapon upgrades at the Blacksmith lifetime' }],
    },
    passiveId: 'domain_craft_passive',
    passiveDescription: "Gains +3 flat damage for each weapon upgrade ever performed at the Blacksmith (lifetime counter, never resets).",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 42, finalAccuracy: 90, finalCritChance: 0.20, range: 'melee', damageType: 'physical' },
  },

  // ===== AUTHORITY =====
  {
    id: 'domain_authority_seal',
    name: 'The Mandate Seal',
    lore: "The seal does not argue. Neither does the thing it seals.",
    tier: 'domain', slot: 'accessory', domainId: 'authority',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Authority is recognized by those with authority to grant it. Reach Favoured Child status with 3 different deities across your lifetime.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'favor_favoured_child', value: 3, description: 'Reach 91+ favor with 3 different deities lifetime' }],
    },
    passiveId: 'domain_authority_passive',
    passiveDescription: 'Once per run: decree that one non-boss enemy immediately surrenders — drops loot, fight ends. +20% all NPC reputation gains.',
    accessoryStats: { accessoryType: 'seal', statBonuses: { CHA: 25, WIS: 20 } },
  },

  // ===== LIFE =====
  {
    id: 'domain_life_seed',
    name: 'The Living Seed',
    lore: 'It grows in the dark. It always has.',
    tier: 'domain', slot: 'accessory', domainId: 'life',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Life is the domain of continuation. Heal yourself 100 times across all sources lifetime.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'healing_received', value: 100, description: 'Receive healing 100 times from any source lifetime (rest sites, items, regen effects, ceremonies)' }],
    },
    passiveId: 'domain_life_passive',
    passiveDescription: "When your HP falls below 20%, 10% chance per turn to spontaneously regenerate to 50% HP. 5-floor cooldown after activating.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { END: 25, WIS: 20 } },
  },

  // ===== SEA =====
  {
    id: 'domain_sea_eye',
    name: "The Tide's Eye",
    lore: 'The tide goes out so it can come back stronger.',
    tier: 'domain', slot: 'accessory', domainId: 'sea',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'The sea yields to no fixed point — it moves around obstacles. Flee from combat 40 times lifetime.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'flee_total', value: 40, description: 'Successfully flee from combat 40 times lifetime' }],
    },
    passiveId: 'domain_sea_passive',
    passiveDescription: "Once per combat: choose to 'ebb' — take no action for 1 turn, but enemy's next attack misses with 80% probability AND flee chance becomes 100% for 2 turns.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { AGI: 25, PER: 20 } },
  },

  // ===== SKY =====
  {
    id: 'domain_sky_mantle',
    name: "The Cloud Walker's Mantle",
    lore: "The sky doesn't touch the ground. It doesn't have to.",
    tier: 'domain', slot: 'accessory', domainId: 'sky',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'The sky belongs to those who ascend high enough. Reach Floor 30 or beyond in a single run.',
    acquisition: {
      scope: 'single_run', requireAll: true,
      requirements: [{ metric: 'floors_reached', value: 30, description: 'Reach Floor 30 in a single run' }],
    },
    passiveId: 'domain_sky_passive',
    passiveDescription: 'When HP is above 75%: 5% chance per enemy attack to completely dodge with a cloud step (untouchable at height).',
    accessoryStats: { accessoryType: 'talisman', statBonuses: { AGI: 20, PER: 20 } },
  },

  // ===== FIRE =====
  {
    id: 'domain_fire_ember',
    name: "The Ember That Didn't Extinguish",
    lore: 'Some fires burn without fuel. This is one.',
    tier: 'domain', slot: 'accessory', domainId: 'fire',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'Fire is patient and cumulative. Apply burn to 100 enemies lifetime.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [{ metric: 'status_inflict', value: 100, targetType: 'burn', description: 'Apply burn status effect 100 times lifetime' }],
    },
    passiveId: 'domain_fire_passive',
    passiveDescription: 'Your burn effects stack twice (two independent burn effects can coexist). Once per combat, your burn cannot be cured by the enemy for 3 turns.',
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 25, INT: 20 } },
  },

  // ===== KNOWLEDGE =====
  {
    id: 'domain_knowledge_codex',
    name: 'The Codex Fragment',
    lore: 'The Tower forgets. You do not.',
    tier: 'domain', slot: 'accessory', domainId: 'knowledge',
    revealFavorRequired: 0, isSecret: false,
    acquisitionHint: 'The Codex records everything observed about the Tower. Kill 5 unique boss-type monsters AND observe them first AND complete the monster knowledge entry.',
    acquisition: {
      scope: 'lifetime', requireAll: true,
      requirements: [
        { metric: 'boss_kills', value: 5, targetType: 'different_bosses', description: 'Kill 5 different milestone bosses lifetime' },
        { metric: 'observe_total', value: 5, targetType: 'boss_before_kill', description: 'Observe each before killing' },
      ],
    },
    passiveId: 'domain_knowledge_passive',
    passiveDescription: 'Every enemy type ever killed is recorded. Recorded enemies take +5% damage from all sources. Applies to all characters on the same save.',
    accessoryStats: { accessoryType: 'amulet', statBonuses: { INT: 30, WIS: 25 } },
  },
];

export function getDomainArtifact(domainId: string): SacredItem | undefined {
  return DOMAIN_ARTIFACTS.find(a => a.domainId === domainId);
}
