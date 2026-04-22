/**
 * CeremonialDivider - Elegant section separator
 * Thin line with fade at edges, optional ornate center
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../../constants';

export type DividerVariant = 'thin' | 'ornate' | 'fade' | 'dots' | 'ascii' | 'double';

export interface CeremonialDividerProps {
  /** Visual style of divider */
  variant?: DividerVariant;
  /** Width of divider (number for fixed, string for percentage) */
  width?: DimensionValue;
  /** Vertical margin around divider */
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom color (defaults to border.primary) */
  color?: string;
  /** Additional style */
  style?: ViewStyle;
}

const SPACING_MAP = {
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
};

export function CeremonialDivider({
  variant = 'thin',
  width = '60%',
  spacing = 'lg',
  color = Colors.border.primary,
  style,
}: CeremonialDividerProps) {
  const marginVertical = SPACING_MAP[spacing];

  const renderDivider = () => {
    switch (variant) {
      case 'fade':
        return (
          <View style={{ width, height: 1 }}>
            <LinearGradient
              colors={['transparent', color, 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.fullSize}
            />
          </View>
        );

      case 'ornate':
        return (
          <View style={[styles.ornateContainer, { width }]}>
            <View style={[styles.ornateLine, { backgroundColor: color }]} />
            <View style={[styles.ornateDiamond, { backgroundColor: color }]} />
            <View style={[styles.ornateLine, { backgroundColor: color }]} />
          </View>
        );

      case 'dots':
        return (
          <View style={[styles.dotsContainer, { width }]}>
            <View style={[styles.dot, styles.dotSmall, { backgroundColor: color }]} />
            <View style={[styles.dot, styles.dotMedium, { backgroundColor: color }]} />
            <View style={[styles.dot, styles.dotLarge, { backgroundColor: color }]} />
            <View style={[styles.dot, styles.dotMedium, { backgroundColor: color }]} />
            <View style={[styles.dot, styles.dotSmall, { backgroundColor: color }]} />
          </View>
        );

      case 'ascii': {
        const count = typeof width === 'number' ? Math.floor(width / 7.5) : 30;
        return (
          <Text style={[styles.asciiLine, { color }]}>
            {'─'.repeat(count)}
          </Text>
        );
      }

      case 'double': {
        const count = typeof width === 'number' ? Math.floor(width / 7.5) : 30;
        return (
          <Text style={[styles.asciiLine, { color }]}>
            {'═'.repeat(count)}
          </Text>
        );
      }

      case 'thin':
      default:
        return (
          <View
            style={[
              styles.thinLine,
              { width, backgroundColor: color },
            ]}
          />
        );
    }
  };

  return (
    <View style={[styles.container, { marginVertical }, style]}>
      {renderDivider()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  fullSize: {
    flex: 1,
  },

  // Thin variant
  thinLine: {
    height: 1,
  },

  // Ornate variant
  ornateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ornateLine: {
    flex: 1,
    height: 1,
  },
  ornateDiamond: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: Spacing.sm,
  },

  // Dots variant
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    borderRadius: 999,
    opacity: 0.6,
  },
  dotSmall: {
    width: 2,
    height: 2,
  },
  dotMedium: {
    width: 3,
    height: 3,
  },
  dotLarge: {
    width: 4,
    height: 4,
  },

  // ASCII box-drawing variants
  asciiLine: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
    opacity: 0.65,
  },
});

export default CeremonialDivider;
