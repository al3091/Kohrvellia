/**
 * Color palette for Kohrvellia
 * Ashen Tower — volcanic stone, dried blood, bone and ember
 * Inspired by aged bone, cooling magma, and ember crimson
 */

// Base palette
export const Colors = {
  // Backgrounds - volcanic stone and dried blood
  // Indexed palette: each step is a hard visual jump, not a smooth gradient
  background: {
    primary: '#060406',    // Deepest void — near-pure black
    secondary: '#0D080A',  // One clear step up
    tertiary: '#1F1113',   // Clearly lifted surface — readable against primary
    card: '#261618',       // Distinct card surface — noticeably raised
    elevated: '#321E20',   // Strong modal/dropdown elevation
    overlay: 'rgba(0, 0, 0, 0.88)', // Modal overlay
  },

  // Text - bone and aged parchment
  text: {
    primary: '#E8D8C0',   // Bone white (warm, natural)
    secondary: '#8A7260', // Aged hide — heavier, less smooth
    muted: '#4A3A38',     // Disabled/hint — recedes hard
    inverse: '#060406',   // For light backgrounds
    accent: '#C84832',    // Ember crimson (replaces antique gold)
  },

  // Borders - dried blood and stone
  // Pushed to be visibly readable against card/elevated backgrounds
  border: {
    primary: '#3C1E22',   // Clearly visible against card bg
    secondary: '#502A2A', // Distinctly heavier for emphasis
    accent: '#7E3830',    // Physical dried-blood texture
    focus: '#C84832',     // Ember crimson for focus states
  },

  // Rarity colors - classic but warmed
  rarity: {
    common: '#787068',    // Ash gray
    uncommon: '#487850',  // Muted green
    rare: '#486898',      // Muted blue
    epic: '#6A4898',      // Muted purple
    legendary: '#9A6030', // Ember orange
    mythic: '#C84832',    // Ember crimson
  },

  // Grade colors - red-tinted equivalents
  grade: {
    I: '#5A5050',   // Ash gray
    H: '#7A6868',   // Warm gray
    G: '#B8A8A0',   // Bone off-white
    F: '#487850',   // Muted green
    E: '#3A6848',   // Dark green
    D: '#486898',   // Muted blue
    C: '#3A5888',   // Deep blue
    B: '#6A4898',   // Muted purple
    A: '#984868',   // Muted rose
    S: '#9A6030',   // Ember orange
    SS: '#B84828',  // Deep ember
    SSS: '#C84832', // Ember crimson
  },

  // Danger/CR indicators - threat escalation
  danger: {
    trivial: '#5A5050',  // Ash gray
    easy: '#487850',     // Muted green
    normal: '#C84832',   // Ember crimson
    hard: '#9A6030',     // Ember orange
    deadly: '#B84828',   // Deep ember
    suicidal: '#C84832', // Ember crimson
  },

  // Status effects - logical but warmed
  status: {
    poison: '#6A8A3A',    // Muted yellow-green
    bleed: '#C84832',     // Ember crimson
    burn: '#B84828',      // Deep ember
    freeze: '#486898',    // Muted blue
    stun: '#9A6030',      // Ember orange
    fear: '#6A3848',      // Dark rose
    curse: '#2A1830',     // Deep void indigo
    blind: '#3A4040',     // Dark slate
    silence: '#4A5050',   // Muted slate
    paralysis: '#9A7820', // Tarnished gold
  },

  // Resources - clear but warmed
  resource: {
    hp: '#C84832',    // Ember crimson
    hpBar: '#7A1810', // Dark crimson for bar
    sp: '#486898',    // Muted blue
    spBar: '#2A3870', // Darker blue for bar
    gold: '#9A6030',  // Ember orange
    xp: '#6A4898',    // Muted purple
  },

  // Elements/Damage types - distinct but cohesive
  element: {
    physical: '#787068', // Ash steel
    slash: '#787068',
    pierce: '#787068',
    blunt: '#787068',
    fire: '#C84832',     // Ember crimson
    ice: '#486898',      // Frost blue
    lightning: '#9A6030',// Ember orange (electric)
    poison: '#6A8A3A',   // Muted yellow-green
    holy: '#9A6030',     // Ember orange
    dark: '#2A1830',     // Deep void indigo
    magic: '#6A4898',    // Muted purple
  },

  // UI States - muted but clear
  ui: {
    success: '#487850',  // Muted green
    warning: '#9A6030',  // Ember orange
    error: '#C84832',    // Ember crimson
    info: '#486898',     // Muted blue
    disabled: '#5A4A48', // Red-gray
  },

  // Deity domains - thematic identity, richer
  domain: {
    war: '#C84832',       // Ember crimson (blood, not neon)
    magic: '#6A4898',     // Muted purple (arcane)
    trickery: '#487850',  // Muted green (shadow)
    death: '#2A1830',     // Deep void indigo (grave)
    fortune: '#9A6030',   // Ember orange
    nature: '#3A5830',    // Forest green (earthy)
    wisdom: '#486898',    // Muted royal blue (contemplative)
    craft: '#8A5828',     // Forge bronze
    authority: '#9A6030', // Ember orange (heavy crown)
    life: '#C84858',      // Dusty rose (heart)
    sea: '#387880',       // Deep teal (depths)
    sky: '#587898',       // Storm blue (tempest)
    fire: '#C84832',      // Ember crimson (burning)
    knowledge: '#486878', // Steel blue (ancient tomes)
  },

  // Achievement tiers - matches rarity progression
  achievement: {
    standard: '#787068',   // Ash gray
    challenging: '#487850',// Muted green
    heroic: '#486898',     // Muted blue
    legendary: '#9A6030',  // Ember orange
    mythic: '#C84832',     // Ember crimson
  },

  // Biomes - atmospheric, warmed
  biome: {
    ruins: '#7A5840',      // Warm oxidized stone
    frozen: '#587898',     // Storm blue
    forest: '#3A5830',     // Deep forest
    desert: '#A08848',     // Warm dust/sand
    jungle: '#2A4828',     // Dark canopy
    swamp: '#3A4830',      // Murky olive
    volcanic: '#8A3020',   // Cooling lava
    void: '#100808',       // Deep void
    dreamscape: '#6A4858', // Muted plum
    cavern: '#3A3838',     // Stone red-gray
    labyrinth: '#484848',  // Maze gray
  },
} as const;

// Type export for TypeScript
export type RarityColor = keyof typeof Colors.rarity;
export type GradeColor = keyof typeof Colors.grade;
export type DangerColor = keyof typeof Colors.danger;
export type StatusColor = keyof typeof Colors.status;
export type ElementColor = keyof typeof Colors.element;
export type DomainColor = keyof typeof Colors.domain;
export type BiomeColor = keyof typeof Colors.biome;
