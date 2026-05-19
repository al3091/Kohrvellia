/**
 * Celtic Deity Relics — Remaining deities not in deityRelics_western.ts
 * Danu, Aengus, Badb, Diancecht, Taranis, Goibniu
 */

import type { DeityRelicPair } from './deityRelics';

const DANU_RELICS: DeityRelicPair = {
  deityId: 'danu',
  weapon: {
    id: 'deity_danu_weapon', name: "Mother River Spear",
    lore: "She is the mother of the Tuatha Dé Danann — the divine tribes. All their power flows from hers, as rivers flow from headwaters.",
    tier: 'deity', slot: 'weapon', deityId: 'danu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the source of the divine tribe. Every power they carry flows first through me. My spear goes to those who have drawn from many sources: reach Favoured Child status with 5 different deities across your lifetime — any pantheon, any god. Five tributaries meeting in the same river mouth. I am the river. Show me you have known its tributaries.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 5, description: 'Reach 91+ favor with 5 different deities lifetime' },
    ]},
    passiveId: 'danu_spear_passive',
    passiveDescription: "Mother's Confluence: +5% damage for each deity you have ever reached Favoured Child status with (lifetime total, max +40% from 8 deities). The river grows stronger as more tributaries are recognized.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'CHA', finalDamage: 48, finalAccuracy: 92, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_danu_accessory', name: "Weaving of the Mother",
    lore: "She wove the Tuatha Dé into existence from the river's flow. This is a thread from that first weaving.",
    tier: 'deity', slot: 'accessory', deityId: 'danu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I nurture all who come from me. The mother's gift is strength through nurture. My weaving goes to the sustained: use healing sources 75 times total across your lifetime — consumables, rest sites, skill heals, all of it. Seventy-five moments of restoration. The mother counts each one. Come when you reach that number.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 75, description: 'Use healing sources 75 times total lifetime' },
    ]},
    passiveId: 'danu_weaving_passive',
    passiveDescription: "Mother's Blessing: healing items restore +30% additional HP (the mother's care amplifies all restoration). Additionally: when you receive any healing, your next attack deals +10% bonus damage — restored strength strikes harder.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 25, WIS: 22 } },
  },
};

const AENGUS_RELICS: DeityRelicPair = {
  deityId: 'aengus',
  weapon: {
    id: 'deity_aengus_weapon', name: "Sword of Light of Aengus",
    lore: "Aengus is the god of love and youth whose palace is at Newgrange. His sword of light is mentioned only once in myth, but it is always described as unbeatable.",
    tier: 'deity', slot: 'weapon', deityId: 'aengus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the ever-young, the god of love that even death cannot stop — I transformed my dead beloved into a swan so we could be together. My sword goes to those who demonstrate love as persistence: on the same character, reach Level 3 after having already died once. Love continues past death. Carry the same soul further than it was carried before.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 3, description: 'Reach Level 3' },
      { metric: 'custom', value: 1, targetType: 'character_that_has_died_before', description: 'This character has died at least once (restarted after death)' },
    ]},
    passiveId: 'aengus_sword_passive',
    passiveDescription: "Love Endures: this weapon's damage increases by 5 permanently for each time its current character has died and returned (max +25 from 5 deaths). Love — and this sword — grows stronger through loss.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'AGI', finalDamage: 44, finalAccuracy: 96, finalCritChance: 0.30, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_aengus_accessory', name: "Swan Feather of Eternal Youth",
    lore: "He turned his love into a swan so they could fly together. Swans mate for life. The feather carries both facts.",
    tier: 'deity', slot: 'accessory', deityId: 'aengus',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Youth is not an age. It is the willingness to try again, to see things as new. My feather goes to those who explore without cynicism: complete 20 mystery rooms total across your lifetime. Each mystery room is a new thing — unread, unknown, possibly wonderful. Twenty encounters with the unknown. That is the spirit of the ever-young.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'mystery_rooms', value: 20, description: 'Complete 20 mystery rooms total lifetime' },
    ]},
    passiveId: 'aengus_feather_passive',
    passiveDescription: "Eternal Youth: the CHA stat grants +1% evasion per grade level (D=1%, C=2%, B=3%, A=4%, S=5%, SS=6%). Additionally: mystery rooms are always positive encounters — no negative mystery room outcomes while this is equipped.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { CHA: 28, LCK: 20, AGI: 10 } },
  },
};

const BADB_RELICS: DeityRelicPair = {
  deityId: 'badb',
  weapon: {
    id: 'deity_badb_weapon', name: "Battle Crow's Screech-Blade",
    lore: "Badb is the crow of battle who flies over the slaughter screaming. Her scream drives armies to madness or retreat. She does not fight — she ensures others do.",
    tier: 'deity', slot: 'weapon', deityId: 'badb',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I flew over battlefields and foretold death with my screaming. I did not choose sides — I chose slaughter. My blade goes to those who demonstrate the crow's perspective: kill 200 enemies total lifetime. Not strategically — not with any particular weapon or method. Just 200 deaths, by any means. The crow counts only the fallen, not how they fell.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'kills_total', value: 200, description: 'Kill 200 enemies total lifetime' },
    ]},
    passiveId: 'badb_blade_passive',
    passiveDescription: "Battle Crow's Prophecy: at the start of each combat, there is a 30% chance the enemy is 'Marked by Badb' — their HP is visible and they take +15% damage from all sources this combat. The crow has already decided their fate.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'STR', finalDamage: 50, finalAccuracy: 90, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_badb_accessory', name: "Crow-Wing Omen Token",
    lore: "She perches on the battlefield before the fight begins. The crow-wing is the warning that has come too late to avoid.",
    tier: 'deity', slot: 'accessory', deityId: 'badb',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am one of the three sisters of the Morrigan. I scream the death-prophecy. My token goes to those who have died and been renewed in my presence: die on a floor where you had already killed a boss that run — your death was my prophecy, your boss kill my witness. Do this once and the token passes to you. One death that follows a boss's death.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'boss_kills_run', value: 1, description: 'Kill at least 1 boss in the run' },
      { metric: 'custom', value: 1, targetType: 'die_after_boss_kill_same_run', description: 'Then die in the same run after the boss kill — Badb witnesses the death' },
    ]},
    passiveId: 'badb_token_passive',
    passiveDescription: "Crow's Foreknowledge: at the start of each combat, you see the enemy's HP total (not percentage — exact number). Additionally: enemies with less than 20% HP remaining have their defense halved — Badb has already decided they are fallen.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { PER: 25, WIS: 20 } },
  },
};

const DIANCECHT_RELICS: DeityRelicPair = {
  deityId: 'diancecht',
  weapon: {
    id: 'deity_diancecht_weapon', name: "Surgeon God's Scalpel-Spear",
    lore: "He healed the wounds of gods and gave a silver hand to the king who lost his. His spear is as precise as his medicine.",
    tier: 'deity', slot: 'weapon', deityId: 'diancecht',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I gave King Nuada a silver hand to replace what he lost, and then I crafted a flesh-and-blood hand to replace the silver one. Healing is an art of precision and replacement. My weapon goes to those who understand surgical precision: win 10 combats in a single run where the killing blow dealt between 1 and 10 overkill damage — not a lot of overkill, just enough. Surgical kills. Ten of them.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_precise_kills_1to10_overkill', description: 'Win 10 combats where killing blow dealt 1-10 overkill damage in one run' },
    ]},
    passiveId: 'diancecht_spear_passive',
    passiveDescription: "Physician's Precision: when this weapon kills an enemy, you restore HP equal to 15% of the enemy's max HP (the healer harvests vitality from the defeated). Additionally: critical hits with this weapon additionally remove one negative status effect from you.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 98, finalCritChance: 0.26, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_diancecht_accessory', name: "Well of Healing Ring",
    lore: "He created a healing well that restored the dead gods to life. The warriors were healed and fought again. He was not happy about the ones his jealous son healed better.",
    tier: 'deity', slot: 'accessory', deityId: 'diancecht',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My healing well could raise the dead. I put my herbs in it and the warriors of Tuatha Dé were restored. My ring goes to the thoroughly healed: restore a combined total of 1,000 HP from all healing sources across your lifetime — potions, skills, rest sites, all of it. One thousand points of restoration, counted. The well recognizes those who have drunk deeply.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 1000, targetType: 'total_hp_restored', description: 'Restore 1,000 total HP across all healing sources lifetime' },
    ]},
    passiveId: 'diancecht_ring_passive',
    passiveDescription: "Well of Healing: all healing you receive is 25% more effective. Additionally: rest sites restore SP as well as HP (Diancecht's well restores what was expended, not just what was wounded).",
    accessoryStats: { accessoryType: 'ring', statBonuses: { END: 22, WIS: 24 } },
  },
};

const TARANIS_RELICS: DeityRelicPair = {
  deityId: 'taranis',
  weapon: {
    id: 'deity_taranis_weapon', name: "Thunder-Wheel Hammer",
    lore: "The wheel god, the thunder god of the Gauls. His wheel rolls across the sky leaving lightning in its path.",
    tier: 'deity', slot: 'weapon', deityId: 'taranis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My wheel rolls ceaselessly across the sky. I am the Gaulish thunder — older than the Roman who stole my worship. My hammer goes to those who demonstrate the wheel's motion: in a single run reaching Floor 15, kill at least 3 enemies each on every floor you enter — not some floors, but every floor visited. The wheel touches every part of the sky. So must your kills touch every floor.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'at_least_3_kills_every_floor_entered', description: 'Kill at least 3 enemies on every floor visited this run' },
    ]},
    passiveId: 'taranis_hammer_passive',
    passiveDescription: "Rolling Thunder: +8% damage for each floor currently descended this run (max +80% at Floor 10+). The wheel gains speed — the deeper you go, the more the thunder rolls in your favor.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 52, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_taranis_accessory', name: "Celtic Wheel Torque",
    lore: "The Celts wore twisted metal torques as symbols of divine power. Taranis's wheel is set into this one like a sun disk.",
    tier: 'deity', slot: 'accessory', deityId: 'taranis',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The wheel completes its circuit and begins again. I am the thunder, and thunder does not stop for strategy. My torque goes to those who prove relentless forward motion: complete a run to Floor 10 where you entered every combat room available on every floor — not bypassed, not skipped, not strategically avoided. Every fight. The wheel does not choose which part of the sky to miss.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'custom', value: 1, targetType: 'every_combat_room_entered_every_floor', description: 'Enter and complete every combat room available on every floor this run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'taranis_torque_passive',
    passiveDescription: "Thunderous Circuit: after clearing all combat rooms on a floor, gain a permanent +10 flat damage bonus for the next floor (the circuit completed, the thunder coils). This bonus resets each floor but reapplies when the circuit is completed again.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { STR: 25, END: 20 } },
  },
};

const GOIBNIU_RELICS: DeityRelicPair = {
  deityId: 'goibniu',
  weapon: {
    id: 'deity_goibniu_weapon', name: "God-Smith's Forged Blade",
    lore: "He forged the weapons of the Tuatha Dé Danann. When a weapon broke in battle, he reforged it during the fight itself. This was considered normal by the other gods.",
    tier: 'deity', slot: 'weapon', deityId: 'goibniu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I forge the weapons that kill gods. Nuada's sword, the spear of Lugh — all came from my forge. My blade goes to those who demonstrate mastery of craft: spend 20,000 gold total at the Blacksmith across your lifetime. Every coin in my forge becomes a part of what you receive. The smith is paid in dedication.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_spent_blacksmith', value: 20000, description: 'Spend 20,000 total gold at the Blacksmith lifetime' },
    ]},
    passiveId: 'goibniu_blade_passive',
    passiveDescription: "Smith-God Craftsmanship: this weapon's damage increases permanently each time you spend at the Blacksmith (any upgrade, repair, or service: +2 flat damage, max +30 total from 15 visits). The smith's work improves what already came from his forge.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 54, finalAccuracy: 90, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_goibniu_accessory', name: "Ale of Immortality Flask",
    lore: "Goibniu's ale feast kept the Tuatha Dé alive and free from disease. No wound suffered at his feast ever caused death. He also brewed the best ale in existence.",
    tier: 'deity', slot: 'accessory', deityId: 'goibniu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My ale sustained the gods. One taste and they could not die of wounds received at that feast. My flask goes to those who have invested in the smith-god's craft: upgrade a weapon to Legendary quality, then use it to kill at least 30 enemies before upgrading another weapon. One Legendary. Thirty kills. Prove you value the peak of what was made.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_legendary', value: 1, description: 'Upgrade any weapon to Legendary quality' },
      { metric: 'kills_with_stat', value: 30, targetType: 'with_legendary_weapon', description: 'Kill 30 enemies with that Legendary weapon before upgrading another weapon to Legendary' },
    ]},
    passiveId: 'goibniu_flask_passive',
    passiveDescription: "Immortal Ale: Legendary and Masterwork weapons deal +10% bonus damage while this is equipped (the smith-god's blessing enhances peak craftsmanship). Additionally: weapon durability decreases 30% slower — the smith's blessing on the work extends its endurance.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { STR: 22, END: 20, WIS: 16 } },
  },
};

export const CELTIC_REMAINING_RELICS: DeityRelicPair[] = [
  DANU_RELICS, AENGUS_RELICS, BADB_RELICS, DIANCECHT_RELICS, TARANIS_RELICS, GOIBNIU_RELICS,
];
