/**
 * Dungeon Event Definitions
 * Random encounters with meaningful choices and consequences
 */

import type { StatName } from '../../types/Stats';

export type EventOutcomeType =
  | 'gold'
  | 'heal_hp'
  | 'heal_sp'
  | 'damage'
  | 'stat_xp'
  | 'item'
  | 'buff'
  | 'debuff'
  | 'nothing'
  | 'combat';

export interface EventOutcome {
  type: EventOutcomeType;
  value?: number;
  stat?: StatName;
  message: string;
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  statCheck?: {
    stat: StatName;
    dc: number; // Difficulty class - player needs points >= dc to succeed
  };
  outcomes: {
    success: EventOutcome;
    failure?: EventOutcome; // Only used if there's a stat check
  };
}

export interface DungeonEvent {
  id: string;
  title: string;
  description: string;
  flavorText: string;
  minFloor: number;
  maxFloor: number;
  choices: EventChoice[];
}

// ===== DUNGEON EVENTS =====

export const DUNGEON_EVENTS: DungeonEvent[] = [
  // ===== EARLY FLOORS (1-5) =====
  {
    id: 'wounded_adventurer',
    title: 'Wounded Adventurer',
    description: 'A fellow adventurer lies against the wall, bleeding from a deep wound. They weakly reach out toward you.',
    flavorText: '"Please... I just need a moment to catch my breath..."',
    minFloor: 1,
    maxFloor: 15,
    choices: [
      {
        id: 'help',
        label: 'Share your supplies',
        description: 'Offer some of your resources to help them.',
        outcomes: {
          success: {
            type: 'stat_xp',
            stat: 'CHA',
            value: 15,
            message: 'The adventurer thanks you profusely. Your kindness resonates within. (+15 CHA proficiency)',
          },
        },
      },
      {
        id: 'search',
        label: 'Search their belongings',
        description: 'They seem too weak to resist...',
        statCheck: { stat: 'LCK', dc: 30 },
        outcomes: {
          success: {
            type: 'gold',
            value: 50,
            message: 'You find a hidden coin pouch. The adventurer doesn\'t notice. (+50 Gold)',
          },
          failure: {
            type: 'debuff',
            message: 'The adventurer curses you with their dying breath. You feel a chill. (Cursed: -10% damage for this floor)',
          },
        },
      },
      {
        id: 'ignore',
        label: 'Walk away',
        description: 'You have your own problems to deal with.',
        outcomes: {
          success: {
            type: 'nothing',
            message: 'You continue on your way. Some might call it wisdom, others cowardice.',
          },
        },
      },
    ],
  },
  {
    id: 'crumbling_passage',
    title: 'Crumbling Passage',
    description: 'The corridor ahead is unstable. Rocks fall periodically from the ceiling, but you can see a shortcut through.',
    flavorText: 'The safe path winds around, but who knows what dangers lurk there...',
    minFloor: 1,
    maxFloor: 20,
    choices: [
      {
        id: 'sprint',
        label: 'Sprint through',
        description: 'Use your agility to dodge the falling debris.',
        statCheck: { stat: 'AGI', dc: 25 },
        outcomes: {
          success: {
            type: 'stat_xp',
            stat: 'AGI',
            value: 20,
            message: 'You dart through the passage with practiced grace! (+20 AGI proficiency)',
          },
          failure: {
            type: 'damage',
            value: 15,
            message: 'A rock clips your shoulder as you run. You make it through, but not unscathed. (-15 HP)',
          },
        },
      },
      {
        id: 'brace',
        label: 'Brace and push through',
        description: 'Let your endurance carry you through the falling rocks.',
        statCheck: { stat: 'END', dc: 30 },
        outcomes: {
          success: {
            type: 'stat_xp',
            stat: 'END',
            value: 20,
            message: 'The rocks bounce off you harmlessly. Your toughness impresses even yourself. (+20 END proficiency)',
          },
          failure: {
            type: 'damage',
            value: 20,
            message: 'You underestimated the force. Bruised but not broken. (-20 HP)',
          },
        },
      },
      {
        id: 'safe',
        label: 'Take the safe path',
        description: 'The long way around is the certain way.',
        outcomes: {
          success: {
            type: 'nothing',
            message: 'You reach the other side safely, though it took longer.',
          },
        },
      },
    ],
  },
  {
    id: 'mysterious_chest',
    title: 'Mysterious Chest',
    description: 'A ornate chest sits in an alcove, seemingly untouched. It radiates a faint magical aura.',
    flavorText: 'Something feels off about this... but the potential reward is tempting.',
    minFloor: 1,
    maxFloor: 30,
    choices: [
      {
        id: 'inspect',
        label: 'Inspect carefully',
        description: 'Use your perception to detect any traps.',
        statCheck: { stat: 'PER', dc: 35 },
        outcomes: {
          success: {
            type: 'gold',
            value: 75,
            message: 'You spot and disarm a hidden needle trap, then claim the treasure! (+75 Gold)',
          },
          failure: {
            type: 'damage',
            value: 10,
            message: 'You miss the trap and trigger it. A needle pricks your finger. (-10 HP)',
          },
        },
      },
      {
        id: 'force',
        label: 'Force it open',
        description: 'Smash through whatever defenses it might have.',
        statCheck: { stat: 'STR', dc: 40 },
        outcomes: {
          success: {
            type: 'gold',
            value: 60,
            message: 'You tear the chest apart, ignoring its feeble protections! (+60 Gold)',
          },
          failure: {
            type: 'damage',
            value: 25,
            message: 'The chest explodes! A trap you couldn\'t brute force. (-25 HP)',
          },
        },
      },
      {
        id: 'leave',
        label: 'Leave it',
        description: 'If it seems too good to be true...',
        outcomes: {
          success: {
            type: 'stat_xp',
            stat: 'WIS',
            value: 10,
            message: 'Wisdom is knowing when not to act. (+10 WIS proficiency)',
          },
        },
      },
    ],
  },
  {
    id: 'strange_fungus',
    title: 'Strange Fungus',
    description: 'Glowing mushrooms cover the walls, releasing colorful spores. They smell oddly sweet.',
    flavorText: 'Adventurers speak of healing fungi in the dungeon... but also deadly ones.',
    minFloor: 2,
    maxFloor: 25,
    choices: [
      {
        id: 'eat',
        label: 'Eat some',
        description: 'Trust your luck and take a bite.',
        statCheck: { stat: 'LCK', dc: 50 },
        outcomes: {
          success: {
            type: 'heal_hp',
            value: 30,
            message: 'The fungus is surprisingly nutritious! You feel revitalized. (+30 HP)',
          },
          failure: {
            type: 'damage',
            value: 20,
            message: 'Your stomach churns violently. That was a terrible idea. (-20 HP)',
          },
        },
      },
      {
        id: 'harvest',
        label: 'Harvest carefully',
        description: 'Use knowledge to select the safe ones.',
        statCheck: { stat: 'INT', dc: 40 },
        outcomes: {
          success: {
            type: 'heal_sp',
            value: 25,
            message: 'You identify the mana-restoring variety. Your mind sharpens. (+25 SP)',
          },
          failure: {
            type: 'debuff',
            message: 'You grabbed the wrong ones. Your vision blurs. (Confused: reduced accuracy this floor)',
          },
        },
      },
      {
        id: 'avoid',
        label: 'Avoid them',
        description: 'Don\'t touch unknown substances in a dungeon.',
        outcomes: {
          success: {
            type: 'nothing',
            message: 'You give the fungi a wide berth. Probably wise.',
          },
        },
      },
    ],
  },

  // ===== MID FLOORS (5-15) =====
  {
    id: 'ancient_altar',
    title: 'Ancient Altar',
    description: 'A crumbling altar to a forgotten god stands in a small shrine. Faded offerings lay scattered around it.',
    flavorText: 'The divine presence here is weak but unmistakable...',
    minFloor: 5,
    maxFloor: 40,
    choices: [
      {
        id: 'pray',
        label: 'Pray sincerely',
        description: 'Offer a moment of genuine reverence.',
        statCheck: { stat: 'WIS', dc: 45 },
        outcomes: {
          success: {
            type: 'buff',
            message: 'The forgotten god stirs. A blessing washes over you. (Blessed: +15% damage for this floor)',
          },
          failure: {
            type: 'nothing',
            message: 'Your prayers echo unanswered. The god sleeps on.',
          },
        },
      },
      {
        id: 'offer_gold',
        label: 'Leave an offering',
        description: 'Place some gold on the altar.',
        outcomes: {
          success: {
            type: 'heal_hp',
            value: 40,
            message: 'The altar glows warmly. You feel your wounds closing. (-25 Gold, +40 HP)',
          },
        },
      },
      {
        id: 'desecrate',
        label: 'Loot the offerings',
        description: 'Take what the dead no longer need.',
        statCheck: { stat: 'LCK', dc: 60 },
        outcomes: {
          success: {
            type: 'gold',
            value: 100,
            message: 'You pocket ancient coins without consequence. (+100 Gold)',
          },
          failure: {
            type: 'debuff',
            message: 'A spectral hand grips your heart. The god is not pleased. (Cursed: -20% max HP this floor)',
          },
        },
      },
    ],
  },
  {
    id: 'goblin_merchant',
    title: 'Goblin Merchant',
    description: 'A goblin in tattered robes emerges from the shadows, carrying a suspicious-looking bag.',
    flavorText: '"Psst! Human want good deal? Goblin has finest wares!"',
    minFloor: 3,
    maxFloor: 30,
    choices: [
      {
        id: 'trade',
        label: 'See his wares',
        description: 'What could possibly go wrong?',
        statCheck: { stat: 'CHA', dc: 35 },
        outcomes: {
          success: {
            type: 'heal_hp',
            value: 50,
            message: '"Good customer! Take health potion, on house!" (+50 HP)',
          },
          failure: {
            type: 'gold',
            value: -30,
            message: 'The goblin sells you a "magic rock." It\'s just a rock. (-30 Gold)',
          },
        },
      },
      {
        id: 'intimidate',
        label: 'Demand his goods',
        description: 'Use your presence to get a "discount."',
        statCheck: { stat: 'STR', dc: 45 },
        outcomes: {
          success: {
            type: 'gold',
            value: 40,
            message: 'The goblin drops his coin purse and flees screaming. (+40 Gold)',
          },
          failure: {
            type: 'combat',
            message: 'The goblin whistles. Friends emerge from the darkness...',
          },
        },
      },
      {
        id: 'leave',
        label: 'Walk away',
        description: 'Never trust a dungeon goblin.',
        outcomes: {
          success: {
            type: 'nothing',
            message: '"Your loss, human!" The goblin melts back into shadows.',
          },
        },
      },
    ],
  },

  // ===== DEEPER FLOORS (10+) =====
  {
    id: 'soul_well',
    title: 'Soul Well',
    description: 'A deep well filled with swirling ethereal mist. Whispers echo from its depths, promising power.',
    flavorText: 'The voices speak of strength... but at what cost?',
    minFloor: 10,
    maxFloor: 50,
    choices: [
      {
        id: 'drink',
        label: 'Drink from the well',
        description: 'Accept whatever power it offers.',
        statCheck: { stat: 'END', dc: 55 },
        outcomes: {
          success: {
            type: 'stat_xp',
            stat: 'STR',
            value: 30,
            message: 'Power surges through you! The spirits grant their blessing. (+30 STR proficiency)',
          },
          failure: {
            type: 'damage',
            value: 35,
            message: 'The souls try to drag you in! You barely escape. (-35 HP)',
          },
        },
      },
      {
        id: 'commune',
        label: 'Commune with the spirits',
        description: 'Use wisdom to speak with the dead.',
        statCheck: { stat: 'WIS', dc: 50 },
        outcomes: {
          success: {
            type: 'stat_xp',
            stat: 'INT',
            value: 25,
            message: 'The spirits share ancient knowledge. (+25 INT proficiency)',
          },
          failure: {
            type: 'debuff',
            message: 'The whispers won\'t stop. Maddening... (Distracted: -15% accuracy this floor)',
          },
        },
      },
      {
        id: 'drop_gold',
        label: 'Toss in a coin',
        description: 'Make an offering to the depths.',
        outcomes: {
          success: {
            type: 'heal_sp',
            value: 30,
            message: 'The well hums approvingly. Magical energy flows into you. (-10 Gold, +30 SP)',
          },
        },
      },
    ],
  },
  {
    id: 'injured_minotaur',
    title: 'Injured Minotaur',
    description: 'A massive minotaur lies wounded, its leg caught in a collapsed beam. It eyes you warily but doesn\'t attack.',
    flavorText: 'Monsters rarely show mercy. But neither do they often need it...',
    minFloor: 8,
    maxFloor: 35,
    choices: [
      {
        id: 'help_free',
        label: 'Help free it',
        description: 'Show mercy to your enemy.',
        statCheck: { stat: 'STR', dc: 50 },
        outcomes: {
          success: {
            type: 'buff',
            message: 'The minotaur nods in gratitude and leaves. You feel... different. (Monster Ally: reduced enemy damage this floor)',
          },
          failure: {
            type: 'damage',
            value: 25,
            message: 'You try but fail. The minotaur lashes out in panic. (-25 HP)',
          },
        },
      },
      {
        id: 'kill',
        label: 'Finish it off',
        description: 'One less monster in the dungeon.',
        outcomes: {
          success: {
            type: 'gold',
            value: 60,
            message: 'A quick end. You find a magic stone worth selling. (+60 Gold)',
          },
        },
      },
      {
        id: 'leave',
        label: 'Leave it to fate',
        description: 'It\'s not your problem.',
        outcomes: {
          success: {
            type: 'nothing',
            message: 'You move on. The minotaur\'s eyes follow you until you\'re out of sight.',
          },
        },
      },
    ],
  },
];

// ===== TRAP DEFINITIONS =====

export type TrapType = 'spike' | 'poison_gas' | 'alarm' | 'curse' | 'arrow' | 'pit';

export interface TrapData {
  id: TrapType;
  name: string;
  description: string;
  detectStat: StatName;
  detectDC: number;
  evadeStat: StatName;
  evadeDC: number;
  baseDamage: number;
  damageType: 'physical' | 'poison' | 'magical';
  effect?: string;
}

export const TRAP_TYPES: Record<TrapType, TrapData> = {
  spike: {
    id: 'spike',
    name: 'Spike Trap',
    description: 'Pressure plates trigger hidden spikes from the floor.',
    detectStat: 'PER',
    detectDC: 25,
    evadeStat: 'AGI',
    evadeDC: 30,
    baseDamage: 20,
    damageType: 'physical',
  },
  poison_gas: {
    id: 'poison_gas',
    name: 'Poison Gas Vent',
    description: 'Noxious fumes pour from hidden vents in the walls.',
    detectStat: 'PER',
    detectDC: 35,
    evadeStat: 'END',
    evadeDC: 40,
    baseDamage: 15,
    damageType: 'poison',
    effect: 'poison',
  },
  alarm: {
    id: 'alarm',
    name: 'Magic Alarm',
    description: 'A tripwire triggers a loud magical alert.',
    detectStat: 'INT',
    detectDC: 30,
    evadeStat: 'AGI',
    evadeDC: 25,
    baseDamage: 0,
    damageType: 'magical',
    effect: 'summon_enemies',
  },
  curse: {
    id: 'curse',
    name: 'Curse Ward',
    description: 'An invisible barrier curses those who pass through unaware.',
    detectStat: 'WIS',
    detectDC: 45,
    evadeStat: 'WIS',
    evadeDC: 50,
    baseDamage: 0,
    damageType: 'magical',
    effect: 'curse',
  },
  arrow: {
    id: 'arrow',
    name: 'Arrow Trap',
    description: 'Crossbows hidden in the walls fire at intruders.',
    detectStat: 'PER',
    detectDC: 20,
    evadeStat: 'AGI',
    evadeDC: 35,
    baseDamage: 25,
    damageType: 'physical',
  },
  pit: {
    id: 'pit',
    name: 'Pit Trap',
    description: 'The floor gives way to a deep pit.',
    detectStat: 'PER',
    detectDC: 30,
    evadeStat: 'AGI',
    evadeDC: 40,
    baseDamage: 30,
    damageType: 'physical',
    effect: 'fall',
  },
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get random event for a floor
 */
export function getRandomEventForFloor(floorNumber: number): DungeonEvent {
  const available = DUNGEON_EVENTS.filter(
    (e) => e.minFloor <= floorNumber && e.maxFloor >= floorNumber
  );
  if (available.length === 0) {
    return DUNGEON_EVENTS[0]; // Fallback to first event
  }
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Get random trap for a floor
 */
export function getRandomTrapForFloor(floorNumber: number): TrapData {
  const trapTypes = Object.values(TRAP_TYPES);
  // Weight traps by floor - more dangerous traps on deeper floors
  if (floorNumber < 5) {
    const earlyTraps = trapTypes.filter((t) => t.baseDamage <= 20);
    return earlyTraps[Math.floor(Math.random() * earlyTraps.length)];
  }
  return trapTypes[Math.floor(Math.random() * trapTypes.length)];
}

/**
 * Perform a stat check
 */
export function performStatCheck(playerStatPoints: number, dc: number): { success: boolean; margin: number } {
  const roll = Math.floor(Math.random() * 20) + 1;
  // Cap stat contribution so even maxed stats can fail high-DC checks (H grade ≈ 200+ pts uncapped = always win)
  const cappedBonus = Math.min(playerStatPoints, 50);
  const total = roll + cappedBonus;
  const adjustedDC = dc + Math.floor(Math.random() * 10) - 5;

  return {
    success: total >= adjustedDC,
    margin: total - adjustedDC,
  };
}
