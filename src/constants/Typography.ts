/**
 * Typography constants for Kohrvellia
 * Consistent text styling across the app
 */

import { TextStyle, Platform } from 'react-native';
import { Colors } from './Colors';

const MONO_FONT = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// Font sizes
export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 64,
} as const;

// Font weights
export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

// Line heights
export const LineHeight = {
  tight: 1.1,
  normal: 1.4,
  relaxed: 1.6,
  loose: 2,
} as const;

// Letter spacing
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 1,
  wider: 2,
  widest: 4,
  title: 8,
} as const;

// Pre-defined text styles
export const Typography = {
  // Headings
  h1: {
    fontSize: FontSize['6xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.title,
  } as TextStyle,

  h2: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.wider,
  } as TextStyle,

  h3: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  h4: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  } as TextStyle,

  h5: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  } as TextStyle,

  h6: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  } as TextStyle,

  // Body text
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.normal,
    color: Colors.text.primary,
    lineHeight: FontSize.md * LineHeight.normal,
    fontFamily: MONO_FONT,
  } as TextStyle,

  bodyLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.normal,
    color: Colors.text.primary,
    lineHeight: FontSize.lg * LineHeight.normal,
  } as TextStyle,

  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
    lineHeight: FontSize.sm * LineHeight.normal,
  } as TextStyle,

  // Labels and captions
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.normal,
    color: Colors.text.muted,
    fontFamily: MONO_FONT,
  } as TextStyle,

  // Special text
  stat: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: MONO_FONT,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  statLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  grade: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.extrabold,
    fontFamily: MONO_FONT,
  } as TextStyle,

  damage: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    fontFamily: MONO_FONT,
  } as TextStyle,

  gold: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.resource.gold,
  } as TextStyle,

  // Narrative/story text
  narrative: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.normal,
    color: Colors.text.primary,
    fontStyle: 'italic' as const,
    lineHeight: FontSize.lg * LineHeight.relaxed,
  } as TextStyle,

  quote: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
    fontStyle: 'italic' as const,
    lineHeight: FontSize.md * LineHeight.relaxed,
  } as TextStyle,

  // Button text
  button: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center' as const,
  } as TextStyle,

  buttonSmall: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    textAlign: 'center' as const,
  } as TextStyle,

  // Menu items
  menuItem: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  } as TextStyle,

  // Toast/notification
  toast: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.inverse,
  } as TextStyle,

  // Combat log
  combatLog: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
    fontFamily: MONO_FONT,
    lineHeight: FontSize.sm * LineHeight.tight,
  } as TextStyle,

  // Achievement
  achievementTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.accent,
  } as TextStyle,

  achievementDesc: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
    fontStyle: 'italic' as const,
  } as TextStyle,

  // Version text
  version: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.normal,
    color: Colors.text.muted,
  } as TextStyle,

  // ===== DRAMATIC TEXT STYLES (Text-Forward Design) =====

  // Primary dramatic narrative - for typewriter reveals
  dramatic: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.normal,
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize['2xl'] * LineHeight.relaxed,
  } as TextStyle,

  // Emphasized words within dramatic text
  dramaticEmphasis: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.accent,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  // Soft, muted text for hints and whispers
  whisper: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
    color: Colors.text.muted,
    fontStyle: 'italic' as const,
    letterSpacing: LetterSpacing.wider,
  } as TextStyle,

  // Big dramatic reveals (monster names, victory, etc.)
  announcement: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.title,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  // Narrative-style combat log (larger, more readable)
  combatNarrative: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
    lineHeight: FontSize.lg * LineHeight.relaxed,
    fontStyle: 'italic' as const,
  } as TextStyle,

  // Combat action result text
  combatAction: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    lineHeight: FontSize.xl * LineHeight.normal,
  } as TextStyle,

  // Danger/warning text for encounters
  danger: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.ui.error,
  } as TextStyle,

  // Success/positive text
  success: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.ui.success,
  } as TextStyle,
} as const;
