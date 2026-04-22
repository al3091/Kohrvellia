/**
 * ProgressIndicator component for Kohrvellia
 * Step progress indicator for multi-step flows
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  style?: ViewStyle;
  showLabels?: boolean;
}

interface StepDotProps {
  index: number;
  currentStep: number;
  label?: string;
  showLabel: boolean;
  isLast: boolean;
}

function StepDot({ index, currentStep, label, showLabel, isLast }: StepDotProps) {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;

  // Animated values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const lineColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation with spring effect
    Animated.spring(scaleAnim, {
      toValue: isCurrent ? 1.2 : 1,
      friction: 8,
      tension: 100,
      useNativeDriver: false,
    }).start();

    // Color animation
    Animated.timing(colorAnim, {
      toValue: isCompleted || isCurrent ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Line color animation
    Animated.timing(lineColorAnim, {
      toValue: isCompleted ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isCompleted, isCurrent, scaleAnim, colorAnim, lineColorAnim]);

  const dotBackgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border.primary, Colors.text.accent],
  });

  const lineBackgroundColor = lineColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border.primary, Colors.text.accent],
  });

  const labelColor = isCurrent
    ? Colors.text.accent
    : isCompleted
    ? Colors.text.primary
    : Colors.text.muted;

  return (
    <View style={styles.stepContainer}>
      {/* Line positioned absolutely behind the dot */}
      {!isLast && (
        <Animated.View
          style={[
            styles.line,
            { backgroundColor: lineBackgroundColor },
          ]}
        />
      )}

      {/* Dot wrapper with fixed size to prevent layout shift during scale */}
      <View style={styles.dotWrapper}>
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: dotBackgroundColor,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {isCompleted && (
            <Text style={styles.checkmark}>✓</Text>
          )}
          {isCurrent && (
            <View style={styles.innerDot} />
          )}
        </Animated.View>
      </View>

      {showLabel && label && (
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </View>
  );
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  labels,
  style,
  showLabels = true,
}: ProgressIndicatorProps) {
  // Adjust to 0-based index
  const currentIndex = currentStep - 1;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsRow}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <StepDot
            key={index}
            index={index}
            currentStep={currentIndex}
            label={labels?.[index]}
            showLabel={showLabels && !!labels}
            isLast={index === totalSteps - 1}
          />
        ))}
      </View>
    </View>
  );
}

const DOT_SIZE = 24;
const DOT_WRAPPER_SIZE = Math.ceil(DOT_SIZE * 1.2); // Account for max scale
const LINE_HEIGHT = 3;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  dotWrapper: {
    width: DOT_WRAPPER_SIZE,
    height: DOT_WRAPPER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure dot is above the line
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: DOT_SIZE / 3,
    height: DOT_SIZE / 3,
    borderRadius: DOT_SIZE / 6,
    backgroundColor: Colors.background.primary,
  },
  checkmark: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  line: {
    position: 'absolute',
    top: DOT_WRAPPER_SIZE / 2 - LINE_HEIGHT / 2, // Vertically center with dot
    left: '50%', // Start from center of this step
    width: '100%', // Extend full width (overlaps into next step)
    height: LINE_HEIGHT,
    borderRadius: LINE_HEIGHT / 2,
    zIndex: 0, // Behind the dots
  },
  label: {
    ...Typography.caption,
    marginTop: Spacing.sm,
    textAlign: 'center',
    maxWidth: 80,
  },
});

export default ProgressIndicator;
