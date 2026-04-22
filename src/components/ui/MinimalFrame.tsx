/**
 * MinimalFrame - Ultra-clean container that spotlights content
 * Part of the minimalist dark fantasy design system
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, BorderWidth } from '../../constants';

export type FrameVariant = 'default' | 'bordered' | 'glow' | 'subtle';
export type FramePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface MinimalFrameProps {
  /** Content to frame */
  children: React.ReactNode;
  /** Frame visual style */
  variant?: FrameVariant;
  /** Glow color (only for 'glow' variant) */
  glowColor?: string;
  /** Internal padding */
  padding?: FramePadding;
  /** Additional style */
  style?: ViewStyle;
  /** Center content horizontally */
  centerX?: boolean;
  /** Center content vertically */
  centerY?: boolean;
}

const PADDING_MAP: Record<FramePadding, number> = {
  none: 0,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
};

export function MinimalFrame({
  children,
  variant = 'default',
  glowColor = Colors.text.accent,
  padding = 'md',
  style,
  centerX = false,
  centerY = false,
}: MinimalFrameProps) {
  const paddingValue = PADDING_MAP[padding];

  const variantStyle = getVariantStyle(variant, glowColor);

  return (
    <View
      style={[
        styles.base,
        { padding: paddingValue },
        variantStyle,
        centerX && styles.centerX,
        centerY && styles.centerY,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function getVariantStyle(variant: FrameVariant, glowColor: string): ViewStyle {
  switch (variant) {
    case 'bordered':
      return {
        backgroundColor: Colors.background.secondary,
        borderWidth: BorderWidth.thin,
        borderColor: Colors.border.primary,
        borderRadius: BorderRadius.md,
      };

    case 'glow':
      return {
        backgroundColor: Colors.background.secondary,
        borderWidth: BorderWidth.thin,
        borderColor: Colors.border.accent,
        borderRadius: BorderRadius.md,
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      };

    case 'subtle':
      return {
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.sm,
      };

    case 'default':
    default:
      return {
        backgroundColor: 'transparent',
      };
  }
}

const styles = StyleSheet.create({
  base: {
    // Minimal base - let variant styles control appearance
  },
  centerX: {
    alignItems: 'center',
  },
  centerY: {
    justifyContent: 'center',
  },
});

export default MinimalFrame;
