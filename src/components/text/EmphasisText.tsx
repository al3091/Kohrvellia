/**
 * EmphasisText - Semantic text coloring with optional animations
 * For damage numbers, status effects, and important values
 */

import React, { useEffect, useRef } from 'react';
import { Text, Animated, TextStyle, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../constants';
import { EmphasisTiming, Scale, SpringConfig } from '../../constants/Animation';

export type EmphasisType = 'danger' | 'success' | 'warning' | 'gold' | 'muted' | 'critical' | 'heal' | 'info';

export interface EmphasisTextProps {
  /** Text content */
  text: string | number;
  /** Semantic emphasis type */
  emphasis: EmphasisType;
  /** Enable animation (pulse or pop) */
  animate?: boolean;
  /** Animation type */
  animationType?: 'pulse' | 'pop' | 'glow';
  /** Text size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Additional text style */
  style?: TextStyle;
  /** Make text bold */
  bold?: boolean;
  /** Use monospace font (for numbers) */
  mono?: boolean;
  /** Prefix (like + or -) */
  prefix?: string;
  /** Suffix (like % or HP) */
  suffix?: string;
}

const EMPHASIS_COLORS: Record<EmphasisType, string> = {
  danger: Colors.ui.error,
  success: Colors.ui.success,
  warning: Colors.ui.warning,
  gold: Colors.resource.gold,
  muted: Colors.text.muted,
  critical: Colors.resource.gold, // Gold for crits
  heal: Colors.resource.hp,
  info: Colors.ui.info,
};

const SIZE_MAP: Record<string, number> = {
  xs: FontSize.xs,
  sm: FontSize.sm,
  md: FontSize.md,
  lg: FontSize.lg,
  xl: FontSize.xl,
  '2xl': FontSize['2xl'],
};

export function EmphasisText({
  text,
  emphasis,
  animate = false,
  animationType = 'pop',
  size = 'md',
  style,
  bold = false,
  mono = false,
  prefix = '',
  suffix = '',
}: EmphasisTextProps) {
  const scale = useRef(new Animated.Value(animate && animationType === 'pop' ? Scale.popStart : 1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) return;

    if (animationType === 'pop') {
      // Scale pop animation
      Animated.sequence([
        Animated.spring(scale, {
          toValue: Scale.popPeak,
          ...SpringConfig.bouncy,
        }),
        Animated.spring(scale, {
          toValue: 1,
          ...SpringConfig.default,
        }),
      ]).start();
    } else if (animationType === 'pulse') {
      // Continuous pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: EmphasisTiming.pulse / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: EmphasisTiming.pulse / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animate, animationType, scale, opacity]);

  const color = EMPHASIS_COLORS[emphasis];
  const fontSize = SIZE_MAP[size];

  const textStyle: TextStyle = {
    color,
    fontSize,
    fontWeight: bold ? '700' : '400',
    fontFamily: mono ? 'monospace' : undefined,
  };

  const displayText = `${prefix}${text}${suffix}`;

  if (animate) {
    return (
      <Animated.Text
        style={[
          styles.base,
          textStyle,
          style,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        {displayText}
      </Animated.Text>
    );
  }

  return (
    <Text style={[styles.base, textStyle, style]}>
      {displayText}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base styles applied to all emphasis text
  },
});

export default EmphasisText;
