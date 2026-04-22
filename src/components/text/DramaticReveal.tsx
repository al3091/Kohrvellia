/**
 * DramaticReveal - Fade-in with subtle vertical movement
 * For revealing important content with ceremonial pacing
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, ViewStyle, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { RevealTiming, Movement, SpringConfig } from '../../constants/Animation';

export interface DramaticRevealProps {
  /** Content to reveal */
  children: React.ReactNode;
  /** Delay before starting reveal (ms) */
  delay?: number;
  /** Duration of reveal animation (ms) */
  duration?: number;
  /** Direction of movement during reveal */
  direction?: 'up' | 'down' | 'fade' | 'scale';
  /** Called when reveal animation completes */
  onReveal?: () => void;
  /** Container style */
  style?: ViewStyle;
  /** Use spring physics instead of timing */
  spring?: boolean;
  /** Trigger haptic feedback on reveal */
  haptic?: boolean;
  /** Haptic intensity */
  hapticStyle?: 'light' | 'medium' | 'heavy';
  /** Skip animation, show immediately */
  instant?: boolean;
  /** Hide content initially (useful for conditional reveals) */
  hidden?: boolean;
}

export function DramaticReveal({
  children,
  delay = 0,
  duration = RevealTiming.dramatic,
  direction = 'up',
  onReveal,
  style,
  spring = false,
  haptic = false,
  hapticStyle = 'light',
  instant = false,
  hidden = false,
}: DramaticRevealProps) {
  const opacity = useRef(new Animated.Value(instant ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(instant ? 0 : getInitialTranslate(direction))).current;
  const scale = useRef(new Animated.Value(instant ? 1 : direction === 'scale' ? 0.9 : 1)).current;
  const [hasRevealed, setHasRevealed] = useState(instant);

  useEffect(() => {
    if (instant || hidden || hasRevealed) return;

    const timeout = setTimeout(() => {
      // Trigger haptic at start of reveal
      if (haptic) {
        const hapticMap = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy,
        };
        Haptics.impactAsync(hapticMap[hapticStyle]);
      }

      // Run animations
      if (spring) {
        Animated.parallel([
          Animated.spring(opacity, {
            toValue: 1,
            ...SpringConfig.gentle,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            ...SpringConfig.gentle,
          }),
          Animated.spring(scale, {
            toValue: 1,
            ...SpringConfig.gentle,
          }),
        ]).start(() => {
          setHasRevealed(true);
          onReveal?.();
        });
      } else {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setHasRevealed(true);
          onReveal?.();
        });
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, duration, spring, haptic, hapticStyle, direction, hidden, instant, hasRevealed, onReveal, opacity, translateY, scale]);

  // If hidden, don't render at all
  if (hidden) {
    return null;
  }

  const animatedStyle: Animated.AnimatedProps<ViewStyle> = {
    opacity,
    transform: [
      { translateY },
      { scale },
    ],
  };

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function getInitialTranslate(direction: DramaticRevealProps['direction']): number {
  switch (direction) {
    case 'up':
      return Movement.revealShift;
    case 'down':
      return -Movement.revealShift;
    case 'fade':
    case 'scale':
    default:
      return 0;
  }
}

const styles = StyleSheet.create({
  container: {
    // No default styling - let children control layout
  },
});

export default DramaticReveal;
