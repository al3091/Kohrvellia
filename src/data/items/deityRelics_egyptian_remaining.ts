/**
 * Egyptian Deity Relics — Remaining deities not in deityRelics_egyptian.ts
 * Hathor, Khonsu, Atum, Khnum, Shu, Tefnut, Bes, Wadjet, Nekhbet, Min
 */

import type { DeityRelicPair } from './deityRelics';

const HATHOR_RELICS: DeityRelicPair = {
  deityId: 'hathor',
  weapon: {
    id: 'deity_hathor_weapon', name: "Sistrum of Divine Joy",
    lore: "She is the lady of music, of love, of the seven cows that nourish the dead. The sistrum drives away evil when shaken.",
    tier: 'deity', slot: 'weapon', deityId: 'hathor',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am beauty and love and the rage that follows when love is scorned. My sistrum goes to the charming: reach Favoured Child status with me (91+ favor) while your CHA stat is grade B or higher. Love must be both constant and worthy. I do not give beauty to those who have not cultivated their grace.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'favor_favoured_child', value: 1, targetType: 'hathor', description: 'Reach 91+ favor with Hathor specifically' },
      { metric: 'stats_grade', value: 1, targetType: 'CHA_grade_B_or_higher', description: 'CHA stat at grade B or above' },
    ]},
    passiveId: 'hathor_sistrum_passive',
    passiveDescription: "Sound of Joy: Taunt actions cost 0 SP while wielding this weapon. After any successful Taunt, restore 10 HP (love returns warmth). The music of Hathor carries protection as well as charm.",
    weaponStats: { scalingStat: 'CHA', secondaryStat: 'LCK', finalDamage: 40, finalAccuracy: 92, finalCritChance: 0.28, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_hathor_accessory', name: "Mirror of Hathor",
    lore: "Hathor's mirror reflects not what you are but what you could become if you were her. No one ever complained.",
    tier: 'deity', slot: 'accessory', deityId: 'hathor',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Love requires recognition. My mirror goes to those who have spread their recognition widely: use the Taunt action successfully in 20 different combat rooms across your lifetime — not 20 in one run, but 20 separate rooms where you chose charm as your opening. Loveto be noticed before you are feared.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'taunt_total', value: 20, targetType: 'different_rooms_lifetime', description: 'Use Taunt successfully in 20 different combat rooms lifetime' },
    ]},
    passiveId: 'hathor_mirror_passive',
    passiveDescription: "Divine Reflection: CHA-based checks (events, NPC interactions, Taunt) have +25% success rate. Also: enemies affected by Taunt this combat deal -20% damage to you — love softens aggression.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { CHA: 30, LCK: 20 } },
  },
};

const KHONSU_RELICS: DeityRelicPair = {
  deityId: 'khonsu',
  weapon: {
    id: 'deity_khonsu_weapon', name: "Moon Crescent Khopesh",
    lore: "The moon god who heals, who drives away evil spirits, whose name means 'traveler.' He crosses the sky every night without fail.",
    tier: 'deity', slot: 'weapon', deityId: 'khonsu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the traveler of the night sky. My khopesh goes to those who demonstrate consistent passage — not single victories, but regular journeys: complete 10 separate dungeon runs where you reached at least Floor 5 in each. Ten crossings of the threshold. Each night the moon rises again. So must you.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 10, targetType: 'ten_runs_floor5_or_deeper', description: 'Complete 10 runs reaching Floor 5+ lifetime (deaths count as long as Floor 5 was reached)' },
    ]},
    passiveId: 'khonsu_khopesh_passive',
    passiveDescription: "Moon Traveler: damage increases as you go deeper — +3% per floor descended (max +45% at Floor 15). The crescent waxes as you travel. Also: +15% damage against enemies affected by any status effect (the moon reveals what is already afflicted).",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 93, finalCritChance: 0.28, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_khonsu_accessory', name: "Lunar Healing Cartouche",
    lore: "Khonsu's cartouche was carved above the door of a temple to drive away evil spirits and hasten healing. This is that cartouche.",
    tier: 'deity', slot: 'accessory', deityId: 'khonsu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The moon heals and expels what harms. My cartouche goes to the self-restoring: heal yourself from consumables and skills a combined total of 50 times lifetime. Not once per run — fifty separate healing actions across all your time in the Tower. The moon rises fifty times. Show me you were restored each cycle.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'healing_received', value: 50, description: '50 healing actions (consumables + self-healing skills) lifetime' },
    ]},
    passiveId: 'khonsu_cartouche_passive',
    passiveDescription: "Moon Blessing: all status effects you suffer are reduced by 1 duration (minimum 1 turn). Additionally: when you use a healing action in combat, the next attack this combat deals +20% damage — the moon that heals also strikes.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 22, END: 22 } },
  },
};

const ATUM_RELICS: DeityRelicPair = {
  deityId: 'atum',
  weapon: {
    id: 'deity_atum_weapon', name: "Staff of Self-Creation",
    lore: "He created himself from the primordial waters, then created everything else. He is the complete one. Tem. The totality.",
    tier: 'deity', slot: 'weapon', deityId: 'atum',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I created myself. From nothing. Then I created the world by speaking it into existence. My staff goes to those who have built something from nothing: reach Level 5 with a character whose starting stat allocation was perfectly balanced — no stat above 4 points in character creation. Build from an equal foundation. Then rise. That is the act of self-creation.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'level_reached', value: 5, description: 'Reach Level 5' },
      { metric: 'custom', value: 1, targetType: 'creation_stats_all_equal_no_above_4', description: 'Character created with no starting stat above 4 points (balanced allocation)' },
    ]},
    passiveId: 'atum_staff_passive',
    passiveDescription: "Self-Made: all stats that are at grade C or below have their grade effectively treated as one step higher for damage calculations. The staff rewards those who built from nothing — the weaker your start, the more it augments.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 48, finalAccuracy: 95, finalCritChance: 0.25, range: 'melee', damageType: 'holy' },
  },
  accessory: {
    id: 'deity_atum_accessory', name: "Scarab of the Complete One",
    lore: "Atum is the totality of all things at sunset. The scarab carries that weight.",
    tier: 'deity', slot: 'accessory', deityId: 'atum',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the beginning and I am the twilight. Completeness requires both. My scarab goes to those who have achieved the full arc: reach Paragon — Level 10. All the way. From the first step of creation to the last step of transcendence. Atum recognizes only those who have completed the full cycle.",
    acquisition: { scope: 'single_character', requireAll: true, requirements: [
      { metric: 'paragon', value: 1, description: 'Reach Level 10 Paragon' },
    ]},
    passiveId: 'atum_scarab_passive',
    passiveDescription: "The Complete One: all stats gain +5 effective points when this is equipped (the totality adds to each domain). Additionally: once per run, when you defeat the final boss (Floor 25), gain a permanent +1 to all base stats on this character (carried across future runs).",
    accessoryStats: { accessoryType: 'seal', statBonuses: { WIS: 25, INT: 18, CHA: 15 } },
  },
};

const KHNUM_RELICS: DeityRelicPair = {
  deityId: 'khnum',
  weapon: {
    id: 'deity_khnum_weapon', name: "Potter's Wheel Flail",
    lore: "He shaped humanity on his potter's wheel. This weapon has the same patient, turning force.",
    tier: 'deity', slot: 'weapon', deityId: 'khnum',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I shape every soul on my potter's wheel before it enters the body. I know every flaw and every potential in the clay. My weapon goes to those who have shaped many characters: create and play 5 different characters across your lifetime — not necessarily all surviving, but 5 distinct characters started and played to at least Floor 2. Five times at the potter's wheel. Show me variety.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_different_characters_created', description: 'Create and play 5 different characters lifetime, each reaching Floor 2' },
    ]},
    passiveId: 'khnum_flail_passive',
    passiveDescription: "Potter's Touch: once per run, you can respec one stat point at a rest site (move a point from one stat to another). The potter reshapes the clay mid-journey. This ability can only be used once per run.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 48, finalAccuracy: 88, finalCritChance: 0.24, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_khnum_accessory', name: "Clay-Sealed Ring of the Nile",
    lore: "Khnum controlled the Nile's flood by turning a valve. The ring carries that authority over rivers.",
    tier: 'deity', slot: 'accessory', deityId: 'khnum',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The Nile floods to enrich. The Nile recedes to consolidate. To earn my ring: upgrade 3 different weapons to Masterwork quality at the Blacksmith across your lifetime — not Legendary, specifically Masterwork. The potter fires his clay at the right temperature. Too much and it shatters. Masterwork is the precise moment of completion.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'weapon_upgrades', value: 3, targetType: 'masterwork_quality_different_weapons', description: 'Upgrade 3 different weapons to Masterwork quality lifetime' },
    ]},
    passiveId: 'khnum_ring_passive',
    passiveDescription: "Nile's Measure: Blacksmith upgrade costs reduced by 20%. When you equip a newly upgraded weapon (just left the blacksmith), you gain +15% damage for the next 5 fights — the freshly-fired clay is at its peak.",
    accessoryStats: { accessoryType: 'ring', statBonuses: { STR: 20, END: 22, WIS: 16 } },
  },
};

const SHU_RELICS: DeityRelicPair = {
  deityId: 'shu',
  weapon: {
    id: 'deity_shu_weapon', name: "Feather of the Air God",
    lore: "Shu holds up the sky to separate earth from heaven. His feather is the breath between them.",
    tier: 'deity', slot: 'weapon', deityId: 'shu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I hold the sky apart from the earth. Without me, creation collapses inward. My feather goes to those who understand the art of separation — of keeping things at distance: complete a run to Floor 15 using only ranged weapons and ranged skills. Never let the enemy touch the sky you carry. Distance is my gift and my demand.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 15, description: 'Reach Floor 15' },
      { metric: 'custom', value: 1, targetType: 'only_ranged_weapons_and_skills', description: 'Only ranged weapons equipped and only ranged/magic skills used — zero melee' },
    ]},
    passiveId: 'shu_feather_passive',
    passiveDescription: "Pillars of Air: your first attack in every combat is always a critical hit if made from ranged distance. The air god's feather strikes cleanly from above. Additionally: +20% evasion on the first 2 turns of any combat (Shu's air buoys you).",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'PER', finalDamage: 44, finalAccuracy: 98, finalCritChance: 0.28, range: 'ranged', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_shu_accessory', name: "Sky-Pillar Amulet",
    lore: "He stands beneath the sky and holds it up with his arms. This amulet carries the weight of that posture.",
    tier: 'deity', slot: 'accessory', deityId: 'shu',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "The sky requires constant support. I have never once let it fall. My amulet goes to those with equivalent steadiness: complete 8 separate runs where you did not die on the floor you last reached. Eight separate runs where the final floor was not your death floor. Arrive and survive. The pillar does not collapse in the middle of its duty.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'floors_nodeath', value: 8, description: 'Complete 8 runs surviving the deepest floor you reached (no death on the final floor entered), lifetime' },
    ]},
    passiveId: 'shu_pillar_passive',
    passiveDescription: "Enduring Pillar: you cannot be stunned or knocked back while above 50% HP (the air god's support holds you firm). Below 50%, this protection is suspended — the pillar is tested when weight is greatest.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { END: 25, AGI: 20 } },
  },
};

const TEFNUT_RELICS: DeityRelicPair = {
  deityId: 'tefnut',
  weapon: {
    id: 'deity_tefnut_weapon', name: "Lioness Moisture Staff",
    lore: "She is moisture and rain and the lioness that brings the flood. Her temper is the drought that threatens existence.",
    tier: 'deity', slot: 'weapon', deityId: 'tefnut',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I left Egypt once, in lion form, and they nearly perished of drought in my absence. Everything depends on moisture, on that which flows and sustains. My staff goes to those who understand dependent cycles: complete a run to Floor 10 where you used healing items at least 3 times AND also inflicted the Poison status effect at least 5 times. Life and decay both flow from moisture.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'healing_received', value: 3, targetType: 'healing_items_used', description: 'Use at least 3 healing items in one run' },
      { metric: 'status_inflict', value: 5, targetType: 'poison_specifically', description: 'Inflict Poison status 5 times in that run' },
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
    ]},
    passiveId: 'tefnut_staff_passive',
    passiveDescription: "Moisture of Life: every time you heal with any source, the next attack deals +15% damage (life flows into offense). Additionally: Poison you inflict on enemies deals 25% more damage per tick — her rains and her toxins are equally potent.",
    weaponStats: { scalingStat: 'WIS', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 90, finalCritChance: 0.26, range: 'melee', damageType: 'magic' },
  },
  accessory: {
    id: 'deity_tefnut_accessory', name: "Rain Lioness Collar",
    lore: "When she returned from her self-imposed exile, all Egypt celebrated. The collar was her homecoming gift to herself.",
    tier: 'deity', slot: 'accessory', deityId: 'tefnut',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am twin to Shu. We were the first. Created together, inseparable. My collar goes to those who prove they understand partnership between moisture and air: in a single run, use both Defend and Flee at least once each — embracing both caution and retreat. Two responses. The lioness knows when to hold and when to vanish into the storm.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'flee_total', value: 1, description: 'Flee at least once in the run' },
      { metric: 'custom', value: 1, targetType: 'defend_used_at_least_once', description: 'Use Defend action at least once in the run' },
      { metric: 'floors_reached', value: 8, description: 'Reach Floor 8' },
    ]},
    passiveId: 'tefnut_collar_passive',
    passiveDescription: "Lioness Duality: after using Defend in a combat, your next offensive action deals +30% damage. After successfully fleeing a combat, your next combat opens with +20% damage on the first strike. Both responses carry benefit.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { WIS: 22, INT: 18, END: 18 } },
  },
};

const BES_RELICS: DeityRelicPair = {
  deityId: 'bes',
  weapon: {
    id: 'deity_bes_weapon', name: "Dwarf God's Bladed Feather Fan",
    lore: "He dances and makes grotesque faces to frighten demons away from children. This weapon was made the same way: ugly, effective, terrifying.",
    tier: 'deity', slot: 'weapon', deityId: 'bes',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I protect the vulnerable. I use noise and ugliness and laughter as my shield. My weapon goes to the fiercely protective: complete a run to Floor 10 where you used the Defend action at least 15 times total. Not once per combat — 15 times across the entire run. Stand in front of what needs protecting. I will know.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'custom', value: 15, targetType: 'defend_action_total_run', description: 'Use Defend action 15+ times across the entire run' },
    ]},
    passiveId: 'bes_fan_passive',
    passiveDescription: "Dwarf God's Ferocity: when your HP falls below 40%, you enter a Bes-Rage — all attacks deal +25% damage and enemies have a 20% chance to become frightened (skip their turn). The dwarf god protects most fiercely when the danger is greatest.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'END', finalDamage: 44, finalAccuracy: 88, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_bes_accessory', name: "Protector's Mask",
    lore: "Bes wears his fearsome face always. It has never stopped being effective.",
    tier: 'deity', slot: 'accessory', deityId: 'bes',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My mask wards evil. But only those who have earned the right to ward it. To earn mine: complete 5 runs where you survived to Floor 5 or beyond without your HP dropping below 20% at any point. Five clean, protected journeys. The guardian must not be broken to guard well.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'custom', value: 5, targetType: 'five_runs_floor5_hp_never_below_20pct', description: 'Complete 5 runs reaching Floor 5+ where HP never dropped below 20%, lifetime' },
    ]},
    passiveId: 'bes_mask_passive',
    passiveDescription: "Apotropaic Ward: once per run, the first time your HP would drop below 20%, it is capped at exactly 20% instead (Bes intercepts the blow). After this triggers, the mask grants +15% damage for the rest of the run — protected fury.",
    accessoryStats: { accessoryType: 'talisman', statBonuses: { END: 28, STR: 18, LCK: 12 } },
  },
};

const WADJET_RELICS: DeityRelicPair = {
  deityId: 'wadjet',
  weapon: {
    id: 'deity_wadjet_weapon', name: "Cobra-Scepter of Lower Egypt",
    lore: "She is the uraeus on the pharaoh's crown — the rearing cobra that spits venom at any who threaten the divine.",
    tier: 'deity', slot: 'weapon', deityId: 'wadjet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the protector of kings. The cobra that strikes without warning, without patience, without second thought. My scepter goes to those who demonstrate the cobra's nature: inflict the Poison status effect on 100 enemies total across your lifetime. No exceptions. No misses. One hundred venomous strikes. Then I will recognize you as kin.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'status_inflict', value: 100, targetType: 'poison_type', description: 'Inflict Poison on 100 enemies total lifetime' },
    ]},
    passiveId: 'wadjet_scepter_passive',
    passiveDescription: "Cobra Venom: Poison you inflict has a 30% chance to be 'Royal Venom' — dealing double tick damage and lasting 2 extra turns. Against bosses and elites, Royal Venom additionally reduces the target's damage output by 15%.",
    weaponStats: { scalingStat: 'AGI', secondaryStat: 'INT', finalDamage: 44, finalAccuracy: 93, finalCritChance: 0.30, range: 'melee', damageType: 'dark' },
  },
  accessory: {
    id: 'deity_wadjet_accessory', name: "Eye of Wadjet Pendant",
    lore: "The papyrus-green eye of the cobra goddess sees everything that slithers through the delta.",
    tier: 'deity', slot: 'accessory', deityId: 'wadjet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "My eye never closes. The cobra never sleeps with eyes open — she simply has no eyelids. My pendant goes to the vigilant: in a single run reaching Floor 10, use the Observe action in every single elite combat before attacking. The cobra reads every threat before striking. Twelve observations of those deemed worthy prey.",
    acquisition: { scope: 'single_run', requireAll: true, requirements: [
      { metric: 'floors_reached', value: 10, description: 'Reach Floor 10' },
      { metric: 'observe_total', value: 1, targetType: 'every_elite_before_attacking', description: 'Observe every elite enemy before the first attack in each elite fight this run' },
    ]},
    passiveId: 'wadjet_eye_passive',
    passiveDescription: "Serpent's Sight: enemies you Observe have their Poison resistance reduced by 50% for the rest of the combat (the cobra's eye finds the soft scales). Additionally: status effects you apply last 1 extra turn on any observed enemy.",
    accessoryStats: { accessoryType: 'amulet', statBonuses: { PER: 25, AGI: 22, INT: 12 } },
  },
};

const NEKHBET_RELICS: DeityRelicPair = {
  deityId: 'nekhbet',
  weapon: {
    id: 'deity_nekhbet_weapon', name: "Vulture Mother's Talon-Staff",
    lore: "She is the vulture goddess of Upper Egypt, the protective mother of pharaohs. Her wings shelter the crown. Her talons end what must end.",
    tier: 'deity', slot: 'weapon', deityId: 'nekhbet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I circle high above the battlefield before the blow falls. My talon-staff goes to those who approach as the vulture does: use the Observe action at least once before the killing blow in 20 separate combats across your lifetime. Not 20 in a run — 20 total instances where you watched, then delivered the final strike. The vulture waits. Then it descends.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'observe_total', value: 20, targetType: 'observed_before_killing_blow_lifetime', description: 'Use Observe before delivering the killing blow in 20 separate combats lifetime' },
    ]},
    passiveId: 'nekhbet_staff_passive',
    passiveDescription: "Vulture's Descent: if you used Observe at any point in a combat, the killing blow on the enemy deals +50% bonus damage (the vulture's patient descent strikes hardest). This applies to any combat where Observe was used, regardless of when.",
    weaponStats: { scalingStat: 'PER', secondaryStat: 'WIS', finalDamage: 46, finalAccuracy: 95, finalCritChance: 0.28, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_nekhbet_accessory', name: "White Crown Circlet",
    lore: "The white crown of Upper Egypt. She wore it before pharaohs existed to wear it.",
    tier: 'deity', slot: 'accessory', deityId: 'nekhbet',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I protected the pharaoh from above, spreading my wings so the arrows fell on me. My circlet goes to those who have survived what should have killed them: survive 10 combats where you entered with your HP below 30%, across your lifetime. Ten times the vulture mother's wings absorbed the blow for you. Survive them all.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'consecutive_fights', value: 10, targetType: 'enter_combat_below_30hp_and_survive_lifetime', description: 'Enter combat below 30% HP and survive 10 separate times lifetime' },
    ]},
    passiveId: 'nekhbet_circlet_passive',
    passiveDescription: "Mother's Wings: when your HP is below 30%, you gain +20% damage reduction (the vulture mother spreads her wings). At below 15% HP, this increases to +35% reduction. The more desperate the situation, the more protection the circlet provides.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { END: 25, PER: 20, WIS: 15 } },
  },
};

const MIN_RELICS: DeityRelicPair = {
  deityId: 'min',
  weapon: {
    id: 'deity_min_weapon', name: "Flail of the Black Land",
    lore: "Min is the god of fertility, of the harvest, of masculine potency. He raises his flail to the sky and everything grows.",
    tier: 'deity', slot: 'weapon', deityId: 'min',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "I am the provider. I make the land fertile. Everything good comes from my domain. My flail goes to those who have accumulated wealth equal to the harvest: accumulate 20,000 gold total across your lifetime. Not in one run — across all time in this Tower. Every piece of gold is a grain from my fields. Fill the granary.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'gold_accumulated', value: 20000, description: 'Accumulate 20,000 total gold across all runs lifetime' },
    ]},
    passiveId: 'min_flail_passive',
    passiveDescription: "Harvest Power: your damage scales with gold carried — every 500 gold you currently hold adds +2% damage (max +20% at 5,000 gold). Spend wisely. The fertile field rewards the one who cultivates, not the one who immediately spends the crop.",
    weaponStats: { scalingStat: 'STR', secondaryStat: 'LCK', finalDamage: 48, finalAccuracy: 88, finalCritChance: 0.26, range: 'melee', damageType: 'physical' },
  },
  accessory: {
    id: 'deity_min_accessory', name: "Lettuce of Min",
    lore: "Min's sacred plant was the lettuce, because it grew tall and upright and exuded a milky substance. No one questioned this.",
    tier: 'deity', slot: 'accessory', deityId: 'min',
    revealFavorRequired: 100, isSecret: true, acquisitionHint: '',
    deityRevealText: "Fertility is not just growth — it is abundance through repetition. My lettuce goes to the persistent: visit the shop 10 times total across your lifetime. Every time you enter a shop is an act of commerce with my domain. Trade. Accumulate. Buy and sell. Ten market days at the black stone pillar of Min.",
    acquisition: { scope: 'lifetime', requireAll: true, requirements: [
      { metric: 'shop_visits', value: 10, description: 'Visit shops 10 times total lifetime' },
    ]},
    passiveId: 'min_lettuce_passive',
    passiveDescription: "Abundant Harvest: gold dropped by defeated enemies is increased by 15%. Additionally: items found in treasure rooms have a 20% chance to be accompanied by a bonus gold cache (100-400G) — abundance multiplies when Min is invoked.",
    accessoryStats: { accessoryType: 'charm', statBonuses: { LCK: 28, CHA: 18, STR: 12 } },
  },
};

export const EGYPTIAN_REMAINING_RELICS: DeityRelicPair[] = [
  HATHOR_RELICS, KHONSU_RELICS, ATUM_RELICS, KHNUM_RELICS, SHU_RELICS,
  TEFNUT_RELICS, BES_RELICS, WADJET_RELICS, NEKHBET_RELICS, MIN_RELICS,
];
