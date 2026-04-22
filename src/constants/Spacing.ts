/**
 * Spacing and layout constants for Kohrvellia
 * Consistent spacing using a 4px base unit
 */

// Base spacing unit (4px)
const BASE = 4;

// Spacing scale
export const Spacing = {
  none: 0,
  xs: BASE, // 4
  sm: BASE * 2, // 8
  md: BASE * 3, // 12
  lg: BASE * 4, // 16
  xl: BASE * 5, // 20
  '2xl': BASE * 6, // 24
  '3xl': BASE * 8, // 32
  '4xl': BASE * 10, // 40
  '5xl': BASE * 12, // 48
  '6xl': BASE * 16, // 64
  '7xl': BASE * 20, // 80
  '8xl': BASE * 24, // 96
} as const;

// Border radii — kept sharp for dungeon-terminal aesthetic
export const BorderRadius = {
  none: 0,
  sm: 0,
  md: 1,
  lg: 2,
  xl: 2,
  '2xl': 3,
  full: 9999,
} as const;

// Border widths
export const BorderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  normal: 2,
  thick: 3,
  heavy: 4,
} as const;

// Common padding presets
export const Padding = {
  screen: {
    horizontal: Spacing.lg,
    vertical: Spacing.xl,
  },
  card: {
    horizontal: Spacing.lg,
    vertical: Spacing.md,
  },
  button: {
    horizontal: Spacing['2xl'],
    vertical: Spacing.lg,
  },
  buttonSmall: {
    horizontal: Spacing.lg,
    vertical: Spacing.sm,
  },
  input: {
    horizontal: Spacing.md,
    vertical: Spacing.sm,
  },
  listItem: {
    horizontal: Spacing.lg,
    vertical: Spacing.md,
  },
  modal: {
    horizontal: Spacing.xl,
    vertical: Spacing.xl,
  },
  section: {
    horizontal: 0,
    vertical: Spacing['2xl'],
  },
} as const;

// Common gap values for flex containers
export const Gap = {
  none: 0,
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
  '2xl': Spacing['2xl'],
} as const;

// Icon sizes
export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

// Touch target sizes (minimum 44px for accessibility)
export const TouchTarget = {
  minimum: 44,
  small: 48,
  medium: 56,
  large: 64,
} as const;

// Screen breakpoints (for responsive layouts if needed)
export const Breakpoint = {
  sm: 360,
  md: 480,
  lg: 768,
  xl: 1024,
} as const;

// Z-index layers
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
  overlay: 100,
} as const;

// Shadow definitions
export const Shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },
  glow: {
    shadowColor: '#e8d5b7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;
