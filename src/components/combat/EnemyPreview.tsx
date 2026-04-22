/**
 * EnemyPreview - Pre-combat enemy display with stats and danger assessment
 * Shows monster info before the player commits to combat
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import type { Monster } from '../../types/Monster';
import { STATUS_EFFECT_ICONS } from '../../types/StatusEffect';

export interface EnemyPreviewProps {
  monster: Monster;
  /** Show full stats (after observation) or just basics */
  observed?: boolean;
  /** Calculated sneak chance (0-100) */
  sneakChance?: number;
}

// Danger level based on CR relative to player level
function getDangerLevel(monsterCR: number, playerLevel: number): {
  level: 'trivial' | 'easy' | 'normal' | 'hard' | 'deadly';
  color: string;
  label: string;
} {
  const diff = monsterCR - playerLevel;

  if (diff <= -3) return { level: 'trivial', color: Colors.text.muted, label: 'Trivial' };
  if (diff <= -1) return { level: 'easy', color: Colors.ui.success, label: 'Easy' };
  if (diff <= 1) return { level: 'normal', color: Colors.ui.warning, label: 'Fair' };
  if (diff <= 3) return { level: 'hard', color: Colors.domain.war, label: 'Dangerous' };
  return { level: 'deadly', color: Colors.ui.error, label: 'Deadly' };
}

export function EnemyPreview({
  monster,
  observed = false,
  sneakChance,
}: EnemyPreviewProps) {
  // Calculate danger (assume player level 1 for now - will be passed in later)
  const danger = getDangerLevel(monster.finalCR, 1);

  // Get status effects this monster can inflict (from abilities)
  const canInflict: string[] = [];

  return (
    <View style={styles.container}>
      {/* Monster Icon/Art Area */}
      <View style={styles.artArea}>
        <Text style={styles.monsterIcon}>
          {monster.isBoss ? '👹' : monster.base.category === 'beast' ? '🐺' : '👾'}
        </Text>
        {monster.isBoss && (
          <View style={styles.bossIndicator}>
            <Text style={styles.bossText}>BOSS</Text>
          </View>
        )}
      </View>

      {/* Monster Name */}
      <Text style={styles.monsterName}>{monster.displayName}</Text>

      {/* Danger Level */}
      <View style={[styles.dangerBadge, { backgroundColor: danger.color + '20' }]}>
        <Text style={[styles.dangerText, { color: danger.color }]}>
          {danger.label}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CR</Text>
          <Text style={styles.statValue}>{monster.finalCR}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>HP</Text>
          <Text style={styles.statValue}>
            {observed ? monster.currentHP : '???'}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ATK</Text>
          <Text style={styles.statValue}>
            {observed ? monster.attack : '???'}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>DEF</Text>
          <Text style={styles.statValue}>
            {observed ? monster.defense : '???'}
          </Text>
        </View>
      </View>

      {/* Status Effects Warning */}
      {canInflict.length > 0 && (
        <View style={styles.statusWarning}>
          <Text style={styles.statusWarningLabel}>Can Inflict:</Text>
          <View style={styles.statusIcons}>
            {canInflict.map((effectId: string) => (
              <View key={effectId} style={styles.statusIconBadge}>
                <Text style={styles.statusIcon}>
                  {STATUS_EFFECT_ICONS[effectId as keyof typeof STATUS_EFFECT_ICONS] || '?'}
                </Text>
                <Text style={styles.statusName}>{effectId}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Sneak Chance */}
      {sneakChance !== undefined && (
        <View style={styles.sneakInfo}>
          <Text style={styles.sneakLabel}>Sneak Chance:</Text>
          <Text style={[
            styles.sneakValue,
            sneakChance >= 70 ? styles.sneakHigh :
            sneakChance >= 40 ? styles.sneakMedium :
            styles.sneakLow
          ]}>
            {Math.round(sneakChance)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.lg,
  },

  // Art Area
  artArea: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  monsterIcon: {
    fontSize: 48,
  },
  bossIndicator: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: Colors.ui.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  bossText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.inverse,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Name
  monsterName: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  // Danger Badge
  dangerBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  dangerText: {
    ...Typography.label,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    minWidth: 60,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    ...Typography.h6,
    color: Colors.text.primary,
  },

  // Status Warning
  statusWarning: {
    backgroundColor: Colors.ui.warning + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    marginBottom: Spacing.md,
  },
  statusWarningLabel: {
    ...Typography.caption,
    color: Colors.ui.warning,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statusIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statusIconBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusIcon: {
    fontSize: 14,
  },
  statusName: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontSize: 11,
    textTransform: 'capitalize',
  },

  // Sneak Info
  sneakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  sneakLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  sneakValue: {
    ...Typography.h5,
    fontWeight: '700',
  },
  sneakHigh: {
    color: Colors.ui.success,
  },
  sneakMedium: {
    color: Colors.ui.warning,
  },
  sneakLow: {
    color: Colors.ui.error,
  },
});

export default EnemyPreview;
