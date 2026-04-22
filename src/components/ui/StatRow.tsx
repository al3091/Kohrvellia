/**
 * StatRow component for Kohrvellia
 * Individual stat row with visual bar, +/- buttons, and grade display
 * Used in character creation stat allocation screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import { useHaptics } from '../../hooks/useHaptics';
import type { StatName, Grade } from '../../types/Stats';
import { STAT_INFO, getGradeFromPoints } from '../../types/Stats';

interface StatBonusInfo {
  source: 'backstory' | 'deity';
  value: number;
}

interface StatRowProps {
  stat: StatName;
  allocated: number;
  bonuses?: StatBonusInfo[];
  penalty?: StatBonusInfo;
  onIncrement: () => void;
  onDecrement: () => void;
  onInfoPress?: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
  style?: ViewStyle;
}

const BAR_SEGMENTS = 10;
const POINTS_PER_SEGMENT = 2;

export function StatRow({
  stat,
  allocated,
  bonuses = [],
  penalty,
  onIncrement,
  onDecrement,
  onInfoPress,
  canIncrement,
  canDecrement,
  style,
}: StatRowProps) {
  const haptics = useHaptics();
  const info = STAT_INFO[stat];

  const handleInfoPress = () => {
    haptics.light();
    onInfoPress?.();
  };

  // Calculate total display points
  const bonusTotal = bonuses.reduce((sum, b) => sum + b.value, 0);
  const displayPoints = allocated + bonusTotal;

  // Get grade from display points
  const grade: Grade = getGradeFromPoints(displayPoints);
  const gradeColor = Colors.grade[grade];

  // Calculate filled segments (based on allocated only, max 20 = 10 segments)
  const filledSegments = Math.floor(allocated / POINTS_PER_SEGMENT);

  const handleIncrement = () => {
    if (canIncrement) {
      haptics.light();
      onIncrement();
    }
  };

  const handleDecrement = () => {
    if (canDecrement) {
      haptics.light();
      onDecrement();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Top row: Stat abbreviation, bar, points, buttons */}
      <View style={styles.topRow}>
        {/* Stat abbreviation with info button */}
        <TouchableOpacity
          style={styles.statNameContainer}
          onPress={handleInfoPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.statAbbrev, { color: gradeColor }]}>{stat}</Text>
          <Text style={styles.infoIcon}>?</Text>
        </TouchableOpacity>

        {/* Visual bar */}
        <View style={styles.barContainer}>
          {Array.from({ length: BAR_SEGMENTS }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.barSegment,
                index < filledSegments && styles.barSegmentFilled,
                index < filledSegments && { backgroundColor: gradeColor },
              ]}
            />
          ))}
        </View>

        {/* Points display */}
        <Text style={[styles.pointsText, { color: gradeColor }]}>
          {displayPoints}
        </Text>

        {/* +/- buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !canDecrement && styles.buttonDisabled]}
            onPress={handleDecrement}
            disabled={!canDecrement}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, !canDecrement && styles.buttonTextDisabled]}>
              −
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !canIncrement && styles.buttonDisabled]}
            onPress={handleIncrement}
            disabled={!canIncrement}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, !canIncrement && styles.buttonTextDisabled]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom row: Full name, grade, bonus indicators */}
      <View style={styles.bottomRow}>
        <Text style={styles.statFullName}>{info.fullName}</Text>
        <Text style={[styles.gradeText, { color: gradeColor }]}>
          {grade}-{displayPoints}
        </Text>

        {/* Bonus/penalty indicators */}
        <View style={styles.bonusContainer}>
          {bonuses.map((bonus, index) => (
            <Text key={index} style={styles.bonusText}>
              +{bonus.value} {bonus.source === 'backstory' ? 'Origin' : 'Deity'}
            </Text>
          ))}
          {penalty && (
            <Text style={styles.penaltyText}>
              {penalty.value} {penalty.source === 'backstory' ? 'Origin' : 'Deity'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNameContainer: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statAbbrev: {
    ...Typography.stat,
    fontSize: 16,
  },
  infoIcon: {
    fontSize: 10,
    color: Colors.text.muted,
    fontWeight: '700',
    backgroundColor: Colors.background.tertiary,
    width: 14,
    height: 14,
    borderRadius: 7,
    textAlign: 'center',
    lineHeight: 14,
    overflow: 'hidden',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 12,
    marginHorizontal: Spacing.sm,
    gap: 2,
  },
  barSegment: {
    flex: 1,
    backgroundColor: Colors.border.primary,
    borderRadius: 2,
  },
  barSegmentFilled: {
    backgroundColor: Colors.text.accent,
  },
  pointsText: {
    ...Typography.stat,
    width: 32,
    textAlign: 'right',
    marginRight: Spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
    backgroundColor: Colors.background.primary,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  buttonTextDisabled: {
    color: Colors.text.muted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingLeft: 50,
  },
  statFullName: {
    ...Typography.caption,
    color: Colors.text.secondary,
    flex: 1,
  },
  gradeText: {
    ...Typography.statLabel,
    marginRight: Spacing.sm,
  },
  bonusContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  bonusText: {
    ...Typography.caption,
    color: Colors.ui.success,
  },
  penaltyText: {
    ...Typography.caption,
    color: Colors.ui.warning,
  },
});

export default StatRow;
