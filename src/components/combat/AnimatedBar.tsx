/**
 * Animated Resource Bar Component
 * Smoothly animates between value changes for HP/SP bars
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius } from '../../constants/Spacing';

interface AnimatedBarProps {
  current: number;
  max: number;
  color: string;
  backgroundColor?: string;
  height?: number;
  showText?: boolean;
  label?: string;
  flashOnDamage?: boolean;
}

export function AnimatedBar({
  current,
  max,
  color,
  backgroundColor = Colors.background.tertiary,
  height = 24,
  showText = true,
  label,
  flashOnDamage = true,
}: AnimatedBarProps) {
  const widthAnim = useRef(new Animated.Value(current / max)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const previousValue = useRef(current);

  useEffect(() => {
    const percent = Math.max(0, Math.min(1, current / max));
    const wasDamaged = current < previousValue.current;

    // Animate the bar width
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 300,
      useNativeDriver: false, // Can't use native driver for width
    }).start();

    // Flash red when taking damage
    if (wasDamaged && flashOnDamage) {
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }

    previousValue.current = current;
  }, [current, max, widthAnim, flashAnim, flashOnDamage]);

  // Interpolate flash color
  const flashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [color, Colors.ui.error],
  });

  // Interpolate width
  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Calculate color based on percentage (goes from color -> yellow -> red)
  const percent = current / max;
  const barColor = percent > 0.5
    ? color
    : percent > 0.25
      ? Colors.ui.warning
      : Colors.ui.error;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.barContainer, { height, backgroundColor }]}>
        {/* Background damage indicator (shows where HP was) */}
        <Animated.View
          style={[
            styles.barFill,
            styles.damageIndicator,
            {
              width: animatedWidth,
              backgroundColor: flashColor,
            },
          ]}
        />
        {/* Main bar */}
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animatedWidth,
              backgroundColor: flashOnDamage ? flashColor : barColor,
            },
          ]}
        />
        {showText && (
          <Text style={styles.barText}>
            {current} / {max}
          </Text>
        )}
      </View>
    </View>
  );
}

// Specialized HP bar with low health effects
export function AnimatedHPBar({
  current,
  max,
  showText = true,
  label,
}: {
  current: number;
  max: number;
  showText?: boolean;
  label?: string;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const percent = current / max;

  // Pulse effect when HP is critically low
  useEffect(() => {
    if (percent <= 0.25 && percent > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [percent, pulseAnim]);

  return (
    <Animated.View style={{ opacity: percent <= 0.25 ? pulseAnim : 1 }}>
      <AnimatedBar
        current={current}
        max={max}
        color={Colors.resource.hp}
        showText={showText}
        label={label}
        flashOnDamage={true}
      />
    </Animated.View>
  );
}

// Specialized SP bar
export function AnimatedSPBar({
  current,
  max,
  showText = true,
  label,
}: {
  current: number;
  max: number;
  showText?: boolean;
  label?: string;
}) {
  return (
    <AnimatedBar
      current={current}
      max={max}
      color={Colors.resource.sp}
      showText={showText}
      label={label}
      flashOnDamage={false}
    />
  );
}

// Enemy HP bar (red themed)
export function AnimatedEnemyHPBar({
  current,
  max,
  showText = true,
}: {
  current: number;
  max: number;
  showText?: boolean;
}) {
  return (
    <AnimatedBar
      current={current}
      max={max}
      color={Colors.ui.error}
      showText={showText}
      flashOnDamage={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...Typography.caption,
    color: Colors.text.muted,
    width: 24,
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: BorderRadius.sm,
  },
  damageIndicator: {
    opacity: 0.3,
  },
  barText: {
    ...Typography.caption,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AnimatedBar;
