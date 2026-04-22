/**
 * StatTooltip - Detailed stat information popup
 * Shows stat breakdown, effects, and formula explanation
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import { STAT_INFO, GRADE_RANGES, type StatName, type Grade } from '../../types/Stats';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Grade colors matching the existing color system
const GRADE_COLORS: Record<Grade, string> = {
  I: Colors.grade.I,
  H: Colors.grade.H,
  G: Colors.grade.G,
  F: Colors.grade.F,
  E: Colors.grade.E,
  D: Colors.grade.D,
  C: Colors.grade.C,
  B: Colors.grade.B,
  A: Colors.grade.A,
  S: Colors.grade.S,
  SS: Colors.grade.SS,
  SSS: Colors.grade.SSS,
};

interface StatBreakdown {
  baseStat: number;       // From character level + points
  equipmentBonus: number; // From equipment
  blessingMultiplier: number; // From deity favor
  finalValue: number;     // After all calculations
}

interface StatTooltipProps {
  visible: boolean;
  onClose: () => void;
  stat: StatName;
  grade: Grade;
  points: number;
  level: number;
  breakdown?: StatBreakdown;
}

export function StatTooltip({
  visible,
  onClose,
  stat,
  grade,
  points,
  level,
  breakdown,
}: StatTooltipProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const statInfo = STAT_INFO[stat];
  const gradeRange = GRADE_RANGES[grade];
  const progressToNextGrade = gradeRange
    ? Math.floor(((points - gradeRange.min) / (gradeRange.max - gradeRange.min + 1)) * 100)
    : 0;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.statAbbrev}>{stat}</Text>
                <Text style={styles.statName}>{statInfo.fullName}</Text>
              </View>
              <View style={styles.headerRight}>
                <Text style={[styles.grade, { color: GRADE_COLORS[grade] }]}>
                  {grade}
                </Text>
                <Text style={styles.points}>{points}</Text>
              </View>
            </View>

            {/* Grade Progress */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Grade Progress</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressToNextGrade}%`,
                      backgroundColor: GRADE_COLORS[grade],
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {points} / {gradeRange?.max ?? 999} to next grade
              </Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.description}>{statInfo.description}</Text>
            </View>

            {/* Effects */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Combat Effect</Text>
              <Text style={styles.effect}>{statInfo.combatEffect}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Non-Combat Effect</Text>
              <Text style={styles.effect}>{statInfo.nonCombatEffect}</Text>
            </View>

            {/* Stat Breakdown (if provided) */}
            {breakdown && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Value Breakdown</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Base (Lv.{level} x 500 + {points})</Text>
                  <Text style={styles.breakdownValue}>{breakdown.baseStat}</Text>
                </View>
                {breakdown.equipmentBonus > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Equipment</Text>
                    <Text style={[styles.breakdownValue, styles.bonusValue]}>
                      +{breakdown.equipmentBonus}
                    </Text>
                  </View>
                )}
                {breakdown.blessingMultiplier !== 1.0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      Blessing ({breakdown.blessingMultiplier > 1 ? '+' : ''}
                      {Math.round((breakdown.blessingMultiplier - 1) * 100)}%)
                    </Text>
                    <Text
                      style={[
                        styles.breakdownValue,
                        breakdown.blessingMultiplier > 1 ? styles.bonusValue : styles.penaltyValue,
                      ]}
                    >
                      x{breakdown.blessingMultiplier.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={[styles.breakdownRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Final Value</Text>
                  <Text style={styles.totalValue}>{breakdown.finalValue}</Text>
                </View>
              </View>
            )}

            {/* Growth Method */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>How to Grow</Text>
              <Text style={styles.growthMethod}>{statInfo.growthMethod}</Text>
            </View>

            {/* Formula Explanation */}
            <View style={styles.formulaBox}>
              <Text style={styles.formulaTitle}>Falna Formula</Text>
              <Text style={styles.formulaText}>
                Effective Stat = (Level x 500) + Grade Points
              </Text>
              <Text style={styles.formulaExample}>
                Your {stat}: ({level} x 500) + {points} = {level * 500 + points}
              </Text>
            </View>

            {/* Close button */}
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/**
 * Compact stat row with tooltip trigger
 */
interface StatRowWithTooltipProps {
  stat: StatName;
  grade: Grade;
  points: number;
  level: number;
  breakdown?: StatBreakdown;
  compact?: boolean;
}

export function StatRowWithTooltip({
  stat,
  grade,
  points,
  level,
  breakdown,
  compact = false,
}: StatRowWithTooltipProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const statInfo = STAT_INFO[stat];

  return (
    <>
      <Pressable
        style={[styles.statRow, compact && styles.statRowCompact]}
        onPress={() => setShowTooltip(true)}
      >
        <Text style={styles.rowStatAbbrev}>{stat}</Text>
        {!compact && <Text style={styles.rowStatName}>{statInfo.fullName}</Text>}
        <Text style={[styles.rowGrade, { color: GRADE_COLORS[grade] }]}>{grade}</Text>
        <Text style={styles.rowPoints}>{points}</Text>
        <Text style={styles.infoIcon}>i</Text>
      </Pressable>

      <StatTooltip
        visible={showTooltip}
        onClose={() => setShowTooltip(false)}
        stat={stat}
        grade={grade}
        points={points}
        level={level}
        breakdown={breakdown}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: Math.min(SCREEN_WIDTH - Spacing.lg * 2, 360),
    maxHeight: '85%',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.secondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statAbbrev: {
    ...Typography.h3,
    color: Colors.text.accent,
    fontWeight: 'bold',
  },
  statName: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  grade: {
    ...Typography.h4,
    fontWeight: 'bold',
  },
  points: {
    ...Typography.caption,
    color: Colors.text.muted,
  },

  // Sections
  section: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  effect: {
    ...Typography.body,
    color: Colors.ui.success,
  },
  growthMethod: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },

  // Progress
  progressBar: {
    height: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'right',
  },

  // Breakdown
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  breakdownLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  breakdownValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  bonusValue: {
    color: Colors.ui.success,
  },
  penaltyValue: {
    color: Colors.ui.error,
  },
  totalRow: {
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  totalLabel: {
    ...Typography.h6,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  totalValue: {
    ...Typography.h5,
    color: Colors.text.accent,
    fontWeight: 'bold',
  },

  // Formula
  formulaBox: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  formulaTitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  formulaText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  formulaExample: {
    ...Typography.caption,
    color: Colors.text.accent,
    marginTop: Spacing.xs,
  },

  // Close button
  closeButton: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  closeText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },

  // Stat row (compact version for lists)
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  statRowCompact: {
    padding: Spacing.sm,
  },
  rowStatAbbrev: {
    ...Typography.h6,
    color: Colors.text.accent,
    width: 40,
    fontWeight: 'bold',
  },
  rowStatName: {
    ...Typography.body,
    color: Colors.text.secondary,
    flex: 1,
  },
  rowGrade: {
    ...Typography.h6,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  rowPoints: {
    ...Typography.body,
    color: Colors.text.muted,
    width: 40,
    textAlign: 'right',
  },
  infoIcon: {
    ...Typography.caption,
    color: Colors.text.muted,
    backgroundColor: Colors.background.tertiary,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    marginLeft: Spacing.xs,
  },
});

export default StatTooltip;
