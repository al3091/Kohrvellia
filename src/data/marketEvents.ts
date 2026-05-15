/**
 * Market Events — The Living Economy of Kohrvellia
 * 35 narrative-driven events with weight-based selection.
 * Duration is NEVER shown to the player — events simply appear and disappear.
 */

export type MaterialCategory = 'metal' | 'monster' | 'gem' | 'essence';

export interface MarketEventEffect {
  category: MaterialCategory | 'all';
  multiplier: number;
}

export interface MarketEventTemplate {
  id: string;
  title: string;
  flavor: string;
  icon: string;
  effects: MarketEventEffect[];
  durationType: 'ephemeral' | 'brief' | 'seasonal' | 'extended';
  weight: number;
  minLevel: number;
}

export const MARKET_EVENT_TEMPLATES: MarketEventTemplate[] = [
  // ─── METAL (1-5) ─────────────────────────────────────────────────────────
  {
    id: 'forge_commission',
    title: "Forge Masters' Commission",
    flavor: "The Royal Blacksmiths have issued an urgent purchasing order. Metal materials are in demand until their quota is filled.",
    icon: '⚒️',
    effects: [{ category: 'metal', multiplier: 1.8 }],
    durationType: 'seasonal',
    weight: 8,
    minLevel: 1,
  },
  {
    id: 'iron_shortage',
    title: "Iron Shortage",
    flavor: "A cave-in at the Eastwall Mines has cut supply. The Guild is paying crisis prices for any metal you bring to the Registry.",
    icon: '🪨',
    effects: [{ category: 'metal', multiplier: 2.2 }],
    durationType: 'ephemeral',
    weight: 3,
    minLevel: 3,
  },
  {
    id: 'metal_surplus',
    title: "Metal Surplus",
    flavor: "A merchant fleet arrived from the northern mines. The market is flooded. Metal prices have collapsed.",
    icon: '📉',
    effects: [{ category: 'metal', multiplier: 0.6 }],
    durationType: 'brief',
    weight: 18,
    minLevel: 1,
  },
  {
    id: 'war_preparations',
    title: "War Preparations",
    flavor: "Border tensions have the Kingdom arming. The Guild is purchasing all available metal for weapons production.",
    icon: '⚔️',
    effects: [{ category: 'metal', multiplier: 1.5 }],
    durationType: 'brief',
    weight: 10,
    minLevel: 1,
  },
  {
    id: 'mining_accident',
    title: "Mining Accident",
    flavor: "The Ironhold Mine collapsed. Survivors report rich veins now inaccessible. Metal will be scarce for some time.",
    icon: '⛏️',
    effects: [{ category: 'metal', multiplier: 1.4 }],
    durationType: 'seasonal',
    weight: 12,
    minLevel: 1,
  },

  // ─── MONSTER (6-10) ──────────────────────────────────────────────────────
  {
    id: 'goblin_campaign',
    title: "Goblin Campaign Reports",
    flavor: "The Guild has issued a study request. Scholars need monster samples for the annual Bestiary update.",
    icon: '📚',
    effects: [{ category: 'monster', multiplier: 1.5 }],
    durationType: 'seasonal',
    weight: 10,
    minLevel: 1,
  },
  {
    id: 'anatomy_study',
    title: "Monster Anatomy Study",
    flavor: "The Healer's Collegium is purchasing dungeon creature samples to research monster-derived medicine.",
    icon: '🔬',
    effects: [{ category: 'monster', multiplier: 1.4 }],
    durationType: 'brief',
    weight: 12,
    minLevel: 1,
  },
  {
    id: 'monster_market_flooded',
    title: "Monster Market Flooded",
    flavor: "A dozen high-level parties returned simultaneously from the Deep Floors. The market is drowning in monster materials.",
    icon: '💀',
    effects: [{ category: 'monster', multiplier: 0.55 }],
    durationType: 'brief',
    weight: 18,
    minLevel: 1,
  },
  {
    id: 'hunting_season',
    title: "Hunting Trophy Season",
    flavor: "The noble houses host their annual competition. Monster trophies are valued above standard market rates.",
    icon: '🏆',
    effects: [{ category: 'monster', multiplier: 1.3 }],
    durationType: 'extended',
    weight: 14,
    minLevel: 1,
  },
  {
    id: 'dungeon_purge_order',
    title: "Dungeon Purge Order",
    flavor: "The City Council has authorized emergency funding to reduce monster presence in the upper floors. All kills compensated.",
    icon: '🗡️',
    effects: [{ category: 'monster', multiplier: 1.7 }],
    durationType: 'brief',
    weight: 6,
    minLevel: 2,
  },

  // ─── GEM (11-15) ─────────────────────────────────────────────────────────
  {
    id: 'cathedral_restoration',
    title: "Cathedral Restoration",
    flavor: "The Cathedral of the Three Gods restores its Grand Altar. The High Priest has authorized unlimited gem purchasing.",
    icon: '⛪',
    effects: [{ category: 'gem', multiplier: 2.0 }],
    durationType: 'seasonal',
    weight: 4,
    minLevel: 3,
  },
  {
    id: 'enchanting_symposium',
    title: "Enchanting Symposium",
    flavor: "Master enchanters have gathered for the biannual Arcane Symposium. Gem demand is elevated.",
    icon: '✨',
    effects: [{ category: 'gem', multiplier: 1.6 }],
    durationType: 'brief',
    weight: 9,
    minLevel: 2,
  },
  {
    id: 'merchant_fleet_gems',
    title: "Merchant Fleet Arrived",
    flavor: "Ships from the Gem Coast have docked. The market is overwhelmed with imported crystals. Guild prices suppressed.",
    icon: '⛵',
    effects: [{ category: 'gem', multiplier: 0.5 }],
    durationType: 'brief',
    weight: 20,
    minLevel: 1,
  },
  {
    id: 'winter_festival',
    title: "Winter Festival Gem Craze",
    flavor: "Festival season has arrived. Citizens are purchasing gem-set jewelry as gifts. The Guild capitalizes on demand.",
    icon: '❄️',
    effects: [{ category: 'gem', multiplier: 1.7 }],
    durationType: 'seasonal',
    weight: 6,
    minLevel: 2,
  },
  {
    id: 'gem_cartel_dissolved',
    title: "Gem Cartel Dissolved",
    flavor: "The Jewelers' Association collapsed after an internal scandal. Prices have dropped without their artificial inflation.",
    icon: '💎',
    effects: [{ category: 'gem', multiplier: 0.7 }],
    durationType: 'seasonal',
    weight: 15,
    minLevel: 1,
  },

  // ─── ESSENCE (16-20) ─────────────────────────────────────────────────────
  {
    id: 'alchemist_commission',
    title: "Grand Alchemist's Commission",
    flavor: "The Royal Alchemist is preparing a once-in-a-decade transmutation. Essence materials needed in bulk, price no object.",
    icon: '⚗️',
    effects: [{ category: 'essence', multiplier: 1.6 }],
    durationType: 'brief',
    weight: 8,
    minLevel: 2,
  },
  {
    id: 'curse_outbreak',
    title: "Curse Outbreak",
    flavor: "A wave of dark curses has spread through the merchant district. Every healer and purifier is buying essence at any price.",
    icon: '🌑',
    effects: [{ category: 'essence', multiplier: 2.0 }],
    durationType: 'ephemeral',
    weight: 3,
    minLevel: 3,
  },
  {
    id: 'mages_council',
    title: "Mages' Council Gathering",
    flavor: "The Arcane Council convenes. Mages from across the continent are purchasing essence to fuel their demonstrations.",
    icon: '🧙',
    effects: [{ category: 'essence', multiplier: 1.4 }],
    durationType: 'brief',
    weight: 12,
    minLevel: 2,
  },
  {
    id: 'essence_overstock',
    title: "Essence Overstock",
    flavor: "Following last season's aggressive farming, essence stocks are at record levels. The Guild can barely move it.",
    icon: '📦',
    effects: [{ category: 'essence', multiplier: 0.55 }],
    durationType: 'brief',
    weight: 16,
    minLevel: 1,
  },
  {
    id: 'ritual_season',
    title: "Ritual Season",
    flavor: "The annual lunar cycle brings out practitioners of old rites. Essence demand rises slowly but steadily.",
    icon: '🌙',
    effects: [{ category: 'essence', multiplier: 1.3 }],
    durationType: 'extended',
    weight: 14,
    minLevel: 1,
  },

  // ─── MULTI-CATEGORY (21-30) ───────────────────────────────────────────────
  {
    id: 'trade_route_disrupted',
    title: "Trade Route Disrupted",
    flavor: "Bandits have cut the eastern trade road. Some materials are scarce; others that were imported are now surplus.",
    icon: '🛣️',
    effects: [
      { category: 'metal', multiplier: 1.4 },
      { category: 'essence', multiplier: 1.4 },
      { category: 'gem', multiplier: 0.65 },
    ],
    durationType: 'brief',
    weight: 14,
    minLevel: 1,
  },
  {
    id: 'floor_anomaly',
    title: "Floor Anomaly Detected",
    flavor: "The Guild has confirmed unusual monster migration patterns. Adventurers are being offered premium rates across all materials.",
    icon: '🌀',
    effects: [{ category: 'all', multiplier: 1.2 }],
    durationType: 'ephemeral',
    weight: 8,
    minLevel: 1,
  },
  {
    id: 'royal_tournament',
    title: "Royal Tournament",
    flavor: "The Crown hosts its annual combat tournament. Metal for weapon-making is in demand; monster trophies are out of fashion.",
    icon: '👑',
    effects: [
      { category: 'metal', multiplier: 1.4 },
      { category: 'monster', multiplier: 0.8 },
    ],
    durationType: 'brief',
    weight: 10,
    minLevel: 1,
  },
  {
    id: 'abundant_harvest',
    title: "Abundant Harvest",
    flavor: "This season's dungeon yields have been extraordinarily high. With supply up across the board, prices have softened.",
    icon: '🌾',
    effects: [{ category: 'all', multiplier: 0.85 }],
    durationType: 'seasonal',
    weight: 12,
    minLevel: 1,
  },
  {
    id: 'trade_wars',
    title: "Trade Wars Begin",
    flavor: "Two merchant guilds are competing aggressively. Metal and monster materials are caught in a bidding war. Gems are casualties.",
    icon: '⚖️',
    effects: [
      { category: 'metal', multiplier: 0.7 },
      { category: 'gem', multiplier: 1.3 },
      { category: 'monster', multiplier: 1.1 },
    ],
    durationType: 'seasonal',
    weight: 10,
    minLevel: 2,
  },
  {
    id: 'festival_of_exploration',
    title: "Festival of Exploration",
    flavor: "The annual Adventurer's Festival brings treasure hunters to the city. Magical materials are coveted as souvenirs.",
    icon: '🗺️',
    effects: [
      { category: 'gem', multiplier: 1.3 },
      { category: 'essence', multiplier: 1.3 },
      { category: 'metal', multiplier: 0.9 },
    ],
    durationType: 'extended',
    weight: 8,
    minLevel: 1,
  },
  {
    id: 'winter_shortage',
    title: "Winter Shortage",
    flavor: "Harsh weather has kept adventurers from the deeper floors. Monster and gem materials are suddenly scarce.",
    icon: '🌨️',
    effects: [
      { category: 'monster', multiplier: 1.4 },
      { category: 'gem', multiplier: 1.3 },
    ],
    durationType: 'brief',
    weight: 10,
    minLevel: 1,
  },
  {
    id: 'guild_jubilee',
    title: "Guild Jubilee",
    flavor: "The Guild celebrates its centennial founding. For a brief moment, all materials are purchased at elevated rates as a gesture of goodwill.",
    icon: '🎉',
    effects: [{ category: 'all', multiplier: 1.3 }],
    durationType: 'ephemeral',
    weight: 4,
    minLevel: 1,
  },
  {
    id: 'economic_boom',
    title: "Economic Boom",
    flavor: "A wave of prosperity has hit the city following favorable trade agreements. Material demand is high across most categories.",
    icon: '📈',
    effects: [
      { category: 'metal', multiplier: 1.2 },
      { category: 'gem', multiplier: 1.2 },
      { category: 'monster', multiplier: 1.2 },
    ],
    durationType: 'seasonal',
    weight: 6,
    minLevel: 2,
  },
  {
    id: 'market_crash',
    title: "Market Crash",
    flavor: "A major trading house collapsed overnight. Creditors are liquidating everything. Material prices are in freefall.",
    icon: '📉',
    effects: [{ category: 'all', multiplier: 0.7 }],
    durationType: 'brief',
    weight: 8,
    minLevel: 2,
  },

  // ─── EMERGENCY (31-35, minLevel 5-10) ────────────────────────────────────
  {
    id: 'dragon_sighting',
    title: "Dragon Sighting",
    flavor: "A drake has been spotted near Floor 18. The Guild is in emergency mode — monster materials at crisis prices, all others elevated.",
    icon: '🐉',
    effects: [
      { category: 'monster', multiplier: 2.5 },
      { category: 'metal', multiplier: 1.3 },
      { category: 'gem', multiplier: 1.3 },
      { category: 'essence', multiplier: 1.3 },
    ],
    durationType: 'ephemeral',
    weight: 2,
    minLevel: 7,
  },
  {
    id: 'dark_god_awakening',
    title: "Dark God Awakening",
    flavor: "The priests report signs of a dormant deity stirring in the deep floors. Every healer needs essence for protective rites.",
    icon: '👁️',
    effects: [{ category: 'essence', multiplier: 2.5 }],
    durationType: 'ephemeral',
    weight: 2,
    minLevel: 7,
  },
  {
    id: 'kingdom_at_war',
    title: "Kingdom at War",
    flavor: "War has been declared. The Crown commandeered all available metal. Foreign trade is severed — gem imports have halted.",
    icon: '🔥',
    effects: [
      { category: 'metal', multiplier: 2.0 },
      { category: 'gem', multiplier: 0.5 },
    ],
    durationType: 'brief',
    weight: 3,
    minLevel: 5,
  },
  {
    id: 'plague_in_the_east',
    title: "Plague in the East",
    flavor: "A mysterious plague spreads from the eastern provinces. Every alchemist needs essence for cures. Monster parts are worthless now.",
    icon: '🦠',
    effects: [
      { category: 'essence', multiplier: 1.8 },
      { category: 'monster', multiplier: 0.8 },
    ],
    durationType: 'brief',
    weight: 4,
    minLevel: 5,
  },
  {
    id: 'guild_master_request',
    title: "Guild Master's Personal Request",
    flavor: "The Guild Master has issued a personal procurement order. One specific material is needed at any price. This window will not last.",
    icon: '📜',
    // Effects are dynamically assigned at spawn time (see useMarketStore)
    effects: [],
    durationType: 'ephemeral',
    weight: 2,
    minLevel: 10,
  },
];

// Weight for "no event" (calm market) — higher = more common calm periods
export const NULL_EVENT_WEIGHT = 35;
