/**
 * Blacksmith system types for Kohrvellia
 * Defines identification, repair, and upgrade services
 */

import type { QualityTier } from './Weapon';

// ===== SERVICES =====

export type BlacksmithService = 'identify' | 'repair' | 'upgrade';

// ===== IDENTIFICATION =====

export const IDENTIFICATION_COST = 100; // Gold per item

// ===== UPGRADE SYSTEM =====

export interface UpgradeRequirement {
  fromQuality: QualityTier;
  toQuality: QualityTier;
  goldCost: number;
  materials: MaterialRequirement[];
  requiredReputation?: number; // Minimum blacksmith reputation
  questRequired?: string; // Quest ID that must be completed
}

export interface MaterialRequirement {
  materialId: string;
  quantity: number;
}

// Upgrade paths: Crude -> Standard -> Fine -> Superior -> Masterwork -> Legendary
export const UPGRADE_REQUIREMENTS: UpgradeRequirement[] = [
  {
    fromQuality: 'crude',
    toQuality: 'standard',
    goldCost: 200,
    materials: [{ materialId: 'iron_ingot', quantity: 2 }],
  },
  {
    fromQuality: 'standard',
    toQuality: 'fine',
    goldCost: 500,
    materials: [{ materialId: 'steel_ingot', quantity: 3 }],
  },
  {
    fromQuality: 'fine',
    toQuality: 'superior',
    goldCost: 1500,
    materials: [
      { materialId: 'damascus_ingot', quantity: 5 },
      { materialId: 'monster_essence', quantity: 1 },
    ],
    requiredReputation: 6,
  },
  {
    fromQuality: 'superior',
    toQuality: 'masterwork',
    goldCost: 5000,
    materials: [
      { materialId: 'mithril_ingot', quantity: 10 },
      { materialId: 'monster_essence', quantity: 3 },
    ],
    requiredReputation: 11,
  },
  {
    fromQuality: 'masterwork',
    toQuality: 'legendary',
    goldCost: 25000,
    materials: [
      { materialId: 'adamantine_ingot', quantity: 5 },
      { materialId: 'dragon_heart', quantity: 1 },
    ],
    requiredReputation: 16,
    questRequired: 'legendary_smith_quest', // Must complete special quest
  },
];

/**
 * Get upgrade requirement for a quality tier
 */
export function getUpgradeRequirement(fromQuality: QualityTier): UpgradeRequirement | null {
  return UPGRADE_REQUIREMENTS.find((r) => r.fromQuality === fromQuality) || null;
}

/**
 * Check if quality can be upgraded
 */
export function canUpgradeQuality(quality: QualityTier): boolean {
  return quality !== 'legendary';
}

/**
 * Get next quality tier
 */
export function getNextQuality(quality: QualityTier): QualityTier | null {
  const order: QualityTier[] = ['crude', 'standard', 'fine', 'superior', 'masterwork', 'legendary'];
  const index = order.indexOf(quality);
  if (index === -1 || index === order.length - 1) return null;
  return order[index + 1];
}

// ===== REPAIR SYSTEM (Future) =====

export interface RepairCost {
  goldCost: number;
  materials?: MaterialRequirement[];
}

/**
 * Calculate repair cost (10% of item value)
 */
export function calculateRepairCost(itemValue: number): RepairCost {
  return {
    goldCost: Math.floor(itemValue * 0.1),
  };
}

// ===== BLACKSMITH NPC =====

export interface BlacksmithNPC {
  id: string;
  name: string;
  greeting: string;
  farewell: string;
  icon: string;
}

export const BLACKSMITH_NPC: BlacksmithNPC = {
  id: 'blacksmith_garm',
  name: 'Garm',
  greeting: "Ah, another adventurer! Need something identified or upgraded? I'm your dwarf.",
  farewell: "May your blade stay sharp and your armor hold true!",
  icon: '🔨',
};

// Dialogue variations based on reputation
export const BLACKSMITH_GREETINGS: Record<string, string[]> = {
  hostile: [
    "What do you want? Make it quick.",
    "I don't do favors for your kind.",
  ],
  neutral: [
    "Welcome to my forge. What can I do for you?",
    "Need something identified or improved?",
  ],
  friendly: [
    "Ah, my favorite customer! What'll it be today?",
    "Good to see you again! I've been practicing some new techniques.",
  ],
  trusted: [
    "Friend! Come, let me show you what I've been working on.",
    "For you? I'll do my finest work. What do you need?",
  ],
};

export function getBlacksmithGreeting(reputation: number): string {
  let tier: string;
  if (reputation <= -5) tier = 'hostile';
  else if (reputation < 6) tier = 'neutral';
  else if (reputation < 16) tier = 'friendly';
  else tier = 'trusted';

  const greetings = BLACKSMITH_GREETINGS[tier];
  return greetings[Math.floor(Math.random() * greetings.length)];
}
