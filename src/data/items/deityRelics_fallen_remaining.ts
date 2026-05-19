/**
 * Fallen Angels Deity Relics — Remaining deities not in deityRelics_dark.ts
 * Leviathan, Semyaza, Kokabiel, Sariel, Gadreel, Penemue
 * (16th fallen angel in fallenAngels.ts is Penemue — the file has 16 deities)
 */

import type { DeityRelicPair } from './deityRelics';

const LEVIATHAN_RELICS: DeityRelicPair = {
  deityId: 'leviathan',
  weapon: {
    id: 'deity_leviathan_weapon', name: "Sea Monster's Crushing Maw",
    lore: "He is the primordial sea serpent — the chaos monster that only Behemoth could match. He breathes fire and the sea boils where he passes. He will be defeated at the end of days.",
    tier: 'deity', slot: 'weapon', deityId: 'leviathan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the great chaos serpent. The boiling sea. My maw goes to those who demonstrate my scale of destruction: kill 100 enemies in a single run reaching Floor 15. Not across your lifetime — in ONE run. The sea monster does not stop. It does not distinguish. One hundred, uninterrupted, in the same descent.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'kills_total', value: 100, targetType: 'in_one_run', description: 'Kill 100 enemies in a single run' },
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15 in that run' },
    ]},
    passiveId: 'leviathan_maw_passive',
    passiveDescription: "Boiling Sea: +5% damage after every 10 kills in the current run (max +25% after 50 kills). The sea monster grows more dangerous the longer the slaughter continues.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 55, finalAccuracy: 88, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_leviathan_accessory', name: "Scales of the Deep Chaos",
    lore: "His scales are like shields of bronze, his spine like rows of shields locked together. The scale is a fragment from where Behemoth struck him.",
    tier: 'deity', slot: 'accessory', deityId: 'leviathan',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the chaos that existed before order. The great monster of the deep. My scale goes to those who have endured like the deep: survive the Chaos damage type hitting you — specifically chaos-type attacks, in any run, 5 times lifetime. Be struck by chaos. Endure. The sea monster is not injured by the chaos it swims in.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_received_survived', value: 5, targetType: 'chaos_damage_hits_survived_lifetime', description: 'Be hit by chaos-type damage and survive 5 times lifetime' },
    ]},
    passiveId: 'leviathan_scale_passive',
    passiveDescription: "Chaos Immunity: chaos-type damage reduced by 40% on you (the sea monster is at home in chaos). Additionally: +20% damage on any floor 15+ — the leviathan's full power is in the deepest waters.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 30, STR: 20 } },
  },
};

const SEMYAZA_RELICS: DeityRelicPair = {
  deityId: 'semyaza',
  weapon: {
    id: 'deity_semyaza_weapon', name: "Watcher's Fallen Sword",
    lore: "He was the leader of the Watchers — the two hundred angels who descended to earth and took human wives. He taught enchantments and root-cuttings. He led the fall from duty.",
    tier: 'deity', slot: 'weapon', deityId: 'semyaza',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I led two hundred angels in the decision to descend. I bear the responsibility for all of them. My sword goes to those who bear equivalent weight and demonstrate it over time: reach Favoured Child status (91+ favor) with 3 different deities — across your lifetime. The Watcher-leader's sword goes to those who carry the weight of many relationships. I led many. You must have honored many.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 3, description: 'Reach 91+ favor with 3 different deities lifetime' },
    ]},
    passiveId: 'semyaza_sword_passive',
    passiveDescription: "Watcher's Burden: for each deity you have reached Favoured Child status with lifetime, gain +8% damage (max +48% from 6 deities). The leader's sword grows heavier and sharper with each relationship earned.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_semyaza_accessory', name: "Watcher's Oath Seal",
    lore: "The oath they swore on the summit of Hermon — all two hundred, swearing together. The seal carries every name from that oath.",
    tier: 'deity', slot: 'accessory', deityId: 'semyaza',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Watchers swore an oath together on Mount Hermon. An oath of descent. My seal goes to those who demonstrate they understand the weight of oaths: in a single run reaching Floor 10, make a decision in every event room (not skip any) and succeed in all of them. Every oath honored. Every decision kept. The Watcher-leader who led two hundred oaths recognizes those who keep their own.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'event_success', value: 4, targetType: 'every_event_succeeded', description: 'Succeed in every event room entered in one run (all must succeed)' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'semyaza_seal_passive',
    passiveDescription: "Watcher's Knowledge: enchantments (status effects) you inflict have 20% longer duration. Additionally: after any successful event room, the next combat this run opens with +15% damage bonus — the oath-keeper's rewards compound.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { CHA: 24, WIS: 22 } },
  },
};

const KOKABIEL_RELICS: DeityRelicPair = {
  deityId: 'kokabiel',
  weapon: {
    id: 'deity_kokabiel_weapon', name: "Star of War Blade",
    lore: "He is the Angel of Stars — he taught his human charges astrology and the secrets of the stars. He is also the lord of war and commands 365,000 spirits.",
    tier: 'deity', slot: 'weapon', deityId: 'kokabiel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I see war written in the stars. Every battle is predicted before it begins. My blade goes to those who read the battle before it unfolds: in 10 different combats across your lifetime, use Observe before making any attack. The stars reveal the battle. Ten star-readings before the sword speaks.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 10, targetType: 'ten_combats_observed_before_attack', description: 'Use Observe before any attack in 10 different combats lifetime' },
    ]},
    passiveId: 'kokabiel_blade_passive',
    passiveDescription: "Stars of War: every critical hit from this weapon gives a 'Star Reading' — reveals the enemy's next action (shown in combat log before they act). The angel of stars illuminates each moment of prediction.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'AGI', finalDamage: 48, finalAccuracy: 95, finalCritChance: 0.32, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_kokabiel_accessory', name: "Angel of Stars Astrolabe",
    lore: "He taught humans to read the stars. The astrolabe is his teaching instrument — it maps the heavens and translates them into earthly action.",
    tier: 'deity', slot: 'accessory', deityId: 'kokabiel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The stars dictate timing. Every astrological house governs its own domain. My astrolabe goes to those who respect timing: complete 5 dungeon runs on different calendar days across your lifetime. Not 5 runs in one day — spread across 5 separate days. The stars change every day. Show me you return under different constellations.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_runs_on_five_different_days', description: 'Complete 5 runs on 5 different calendar days lifetime' },
    ]},
    passiveId: 'kokabiel_astrolabe_passive',
    passiveDescription: "Stellar Timing: +3% critical hit chance for each different calendar day you have played (max +15% from 5 days). The astrolabe reads your consistency across constellations and rewards the recurring student of stars.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { PER: 26, AGI: 18, LCK: 14 } },
  },
};

const SARIEL_RELICS: DeityRelicPair = {
  deityId: 'sariel',
  weapon: {
    id: 'deity_sariel_weapon', name: "Command of God's Guiding Sword",
    lore: "Sariel (or Suriel) is the angel of guidance who appears to Moses and guides souls to their judgment. He is the angel who teaches the ways of the moon and is also associated with death's guidance.",
    tier: 'deity', slot: 'weapon', deityId: 'sariel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guide. The moon and the dead alike follow my direction. My sword goes to those who prove they navigate by the stars and the lunar cycle: complete a run to Floor 10 where you did not die and reach the deepest floor you have ever reached. Not Floor 10 specifically — your personal deepest floor, at Floor 10 minimum. The guide's sword goes to those who have found new territory.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 1, targetType: 'deepest_floor_ever_reached', description: 'This run reached your personal deepest floor ever' },
    ]},
    passiveId: 'sariel_sword_passive',
    passiveDescription: "Guiding Light: on any floor deeper than you have previously reached (this character), deal +25% damage — Sariel's guidance is most powerful in unexplored territory. In known territory, deal standard damage.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'PER', finalDamage: 46, finalAccuracy: 94, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_sariel_accessory', name: "Lunar Path Compass",
    lore: "He teaches the ways of the moon. The compass follows the moon's path, pointing always toward what the soul needs to find next.",
    tier: 'deity', slot: 'accessory', deityId: 'sariel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I guide souls to judgment. Every path eventually leads to my charge. My compass goes to those who have arrived at judgment intact: complete 5 runs lifetime where you survived to the deepest floor you entered (no death on the last floor you visited). Five times the guided arrival. Five complete journeys.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'floors_nodeath', value: 5, description: 'Complete 5 runs surviving the deepest floor reached (no death on final floor), lifetime' },
    ]},
    passiveId: 'sariel_compass_passive',
    passiveDescription: "Angel's Guidance: once per run, at the start of a new floor, you see which room contains the highest-value loot on that floor (Sariel points the way). This information appears as a floor compass marker.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { WIS: 24, PER: 22, END: 12 } },
  },
};

const GADREEL_RELICS: DeityRelicPair = {
  deityId: 'gadreel',
  weapon: {
    id: 'deity_gadreel_weapon', name: "Forbidden Weapon-Knowledge Blade",
    lore: "He taught humans how to make weapons of war — shields, breastplates, swords. He also deceived Eve in the garden (in some traditions). The forbidden teacher of making things that hurt.",
    tier: 'deity', slot: 'weapon', deityId: 'gadreel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I taught humanity to forge weapons. Every blade on earth traces its knowledge to my forbidden lesson. My blade goes to those who demonstrate mastery of that lesson: upgrade 5 different weapons at the Blacksmith across your lifetime — any quality upgrade counts. Five weapons improved by the forbidden knowledge. The teacher recognizes the student who used the curriculum.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_upgrades', value: 5, targetType: 'five_different_weapons', description: 'Upgrade 5 different weapons at the Blacksmith lifetime' },
    ]},
    passiveId: 'gadreel_blade_passive',
    passiveDescription: "Forbidden Lesson: this weapon's damage increases by 5 for each unique weapon you have ever upgraded at the Blacksmith (max +30 from 6 different weapons upgraded lifetime). The teacher's knowledge becomes the student's permanence.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'WIS', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_gadreel_accessory', name: "Deception Shield Token",
    lore: "He taught the art of deception as well as the art of weapons. The token is from the shield he showed humanity — the first piece of armor forged from the lesson of necessary defense.",
    tier: 'deity', slot: 'accessory', deityId: 'gadreel',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I taught both weapons and deception. The shield and the lie — both defensive tools. My token goes to those who use both defense and misdirection: in a single run reaching Floor 10, use Defend at least 10 times AND use Taunt at least 5 times. Shield and deception together. The fallen weapon-teacher requires both lessons to be employed.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'defend_10_times_in_run', description: 'Use Defend 10+ times in one run' },
      { metric: 'taunt_total', value: 5, description: 'Use Taunt 5+ times in that run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'gadreel_token_passive',
    passiveDescription: "Weapon and Deception: after using Defend, your next Taunt has +30% success chance (the shield makes the lie more believable). After a successful Taunt, your next Defend reduces damage by 50% instead of the normal amount (the deception makes the shield stronger).",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 22, CHA: 20, END: 16 } },
  },
};

const PENEMUE_RELICS: DeityRelicPair = {
  deityId: 'penemue',
  weapon: {
    id: 'deity_penemue_weapon', name: "Forbidden Script Staff",
    lore: "He taught humanity writing and the use of ink and paper. This was considered the worst of the forbidden teachings — because written knowledge could be stored and shared and never lost. He made human knowledge permanent.",
    tier: 'deity', slot: 'weapon', deityId: 'penemue',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I gave humanity writing — the permanent storage of knowledge. This was considered worse than weapons or war because it could not be taken back. My staff goes to those who demonstrate the permanence of accumulated study: use Observe 250 times total across your lifetime. Not for a single run — the permanent written record of 250 observations. Ink that cannot be erased.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 250, description: 'Use Observe 250 times total lifetime' },
    ]},
    passiveId: 'penemue_staff_passive',
    passiveDescription: "Written Knowledge: enemy information from Observe is now permanent — once you have Observed an enemy type, you always know their stats without needing to Observe again (the written record retains the knowledge permanently across runs).",
    weaponStats: { scalingStat: 'INT', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 96, finalCritChance: 0.26, range: 'ranged', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_penemue_accessory', name: "Ink-and-Reed Forbidden Pen",
    lore: "The reed pen and ink pot that Penemue gave to humanity. Everything written in this ink is true and cannot be revised.",
    tier: 'deity', slot: 'accessory', deityId: 'penemue',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Written knowledge cannot be taken back. The pen that wrote the Watchers' teaching writes permanently. My pen goes to those who have completed the written record of the Tower: observe every unique enemy type in the game at least once across your lifetime — complete the full Bestiary. The forbidden scribe recognizes those who have filled his tablet.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 1, targetType: 'complete_full_bestiary', description: 'Observe every unique enemy type in the game at least once (complete Bestiary)' },
    ]},
    passiveId: 'penemue_pen_passive',
    passiveDescription: "Forbidden Script: all observed enemy types take +10% damage permanently (the written record serves as targeting data). Additionally: INT effective value increases by 1 grade for damage calculations while the Bestiary is 50%+ complete.",
    accessoryStats: { accessoryType: 'seal', statBonuses: { INT: 28, WIS: 20 } },
  },
};

export const FALLEN_REMAINING_RELICS: DeityRelicPair[] = [
  LEVIATHAN_RELICS, SEMYAZA_RELICS, KOKABIEL_RELICS, SARIEL_RELICS,
  GADREEL_RELICS, PENEMUE_RELICS,
];
