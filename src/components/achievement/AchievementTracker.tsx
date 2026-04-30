/**
 * AchievementTracker
 * Compact widget showing the highest-progress known achievement for the
 * current target level plus a count of still-unknown achievements.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import { useAchievementStore } from '../../stores/useAchievementStore';
import { getAchievementsForLevel } from '../../data/achievements';

interface AchievementTrackerProps {
  targetLevel: number;
}

export function AchievementTracker({ targetLevel }: AchievementTrackerProps) {
  const { getProgress } = useAchievementStore();
  const levelAchievements = getAchievementsForLevel(targetLevel);

  // Collect known, incomplete achievements sorted by progress ratio desc
  let bestId: string | null = null;
  let bestRatio = -1;
  let hiddenCount = 0;
  let bestName = '';
  let bestCurrent = 0;
  let bestTarget = 1;

  for (const achievement of levelAchievements) {
    const p = getProgress(achievement.id);
    if (!p) continue;

    if (p.discoveryState === 'hidden') {
      hiddenCount++;
      continue;
    }

    if (p.isCompleted) continue;
    if (p.discoveryState !== 'known') continue;

    // Calculate overall progress ratio across all requirements
    const totalTarget = p.requirementProgress.reduce((s, r) => s + r.target, 0);
    const totalCurrent = p.requirementProgress.reduce((s, r) => s + Math.min(r.current, r.target), 0);
    const ratio = totalTarget > 0 ? totalCurrent / totalTarget : 0;

    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = achievement.id;
      bestName = achievement.name;
      bestCurrent = totalCurrent;
      bestTarget = totalTarget;
    }
  }

  if (!bestId && hiddenCount === 0) return null;

  const fillPercent = bestTarget > 0 ? Math.min(100, (bestCurrent / bestTarget) * 100) : 0;

  return (
    <View style={styles.container}>
      {bestId ? (
        <>
          <Text style={styles.label}>TRACKING</Text>
          <Text style={styles.achievementName} numberOfLines={1}>{bestName}</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${fillPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {bestCurrent} / {bestTarget}
          </Text>
        </>
      ) : null}

      {hiddenCount > 0 && (
        <Text style={styles.hiddenCount}>
          {hiddenCount} more achievement{hiddenCount > 1 ? 's' : ''} unknown
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 9,
    letterSpacing: 2,
  },
  achievementName: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.text.accent,
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    textAlign: 'right',
  },
  hiddenCount: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
});
