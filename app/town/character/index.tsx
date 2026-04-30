/**
 * Character Stats Screen
 * Displays all stats with grades, points, and progress
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useJobStore } from '../../../src/stores/useJobStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import {
  StatName,
  STAT_INFO,
  GRADE_RANGES,
  GRADE_ORDER,
  type Grade,
} from '../../../src/types/Stats';

// Grade colors - higher grades get more impressive colors
const GRADE_COLORS: Record<Grade, string> = {
  I: Colors.text.muted,
  H: '#6b7280',
  G: '#9ca3af',
  F: '#a3a3a3',
  E: '#fbbf24',
  D: '#f59e0b',
  C: '#22c55e',
  B: '#3b82f6',
  A: '#8b5cf6',
  S: '#ec4899',
  SS: '#f43f5e',
  SSS: '#ffd700',
};

// Stat category colors
const STAT_CATEGORY_COLORS: Record<string, string> = {
  physical: Colors.ui.error,
  mental: Colors.domain.knowledge,
  social: Colors.domain.authority,
  misc: Colors.domain.fortune,
};

function getStatCategory(stat: StatName): string {
  switch (stat) {
    case 'STR':
    case 'END':
    case 'AGI':
      return 'physical';
    case 'INT':
    case 'WIS':
    case 'PER':
      return 'mental';
    case 'CHA':
      return 'social';
    case 'LCK':
      return 'misc';
    default:
      return 'misc';
  }
}

// Tips for how to improve each stat through gameplay
const STAT_FARMING_TIPS: Record<StatName, string> = {
  STR: 'Train by attacking unarmed or with STR-scaling weapons (swords, axes, hammers)',
  END: 'Train by defending in combat and taking damage while blocking',
  AGI: 'Train by fleeing from combat (bonus on successful escape)',
  PER: 'Train by landing critical hits and attacking with PER-scaling weapons (bows, daggers)',
  INT: 'Train by using INT-scaling magic skills and reading tomes',
  WIS: 'Train by using Observe in combat to study enemies',
  CHA: 'Train by using Taunt in combat (bonus on successful taunt)',
  LCK: 'Train by dodging enemy attacks and finding rare loot',
};

export default function CharacterStatsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, getDerivedStats, getPendingExcelia } = useCharacterStore();
  const currentJob = useJobStore((s) => s.getCurrentJob());

  // Get pending excelia (stat gains waiting to be committed via Blessing Rite)
  const pendingExcelia = getPendingExcelia();

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No character found</Text>
          <Pressable style={styles.errorButton} onPress={() => router.replace('/')}>
            <Text style={styles.errorButtonText}>Return to Title</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const derivedStats = getDerivedStats();
  const stats = character.stats;
  const statNames: StatName[] = ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'WIS', 'LCK'];

  // Calculate progress within current grade
  const getGradeProgress = (points: number, grade: Grade) => {
    const range = GRADE_RANGES[grade];
    const pointsInGrade = points - range.min;
    const gradeSize = range.max - range.min + 1;
    return Math.min(1, pointsInGrade / gradeSize);
  };

  // Get next grade
  const getNextGrade = (grade: Grade): Grade | null => {
    const index = GRADE_ORDER.indexOf(grade);
    if (index >= GRADE_ORDER.length - 1) return null;
    return GRADE_ORDER[index + 1];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </Pressable>
        <Text style={styles.title}>Status</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Character Info */}
        <View style={styles.characterCard}>
          <View style={styles.characterHeader}>
            <View>
              <Text style={styles.characterName}>{character.name}</Text>
              <Text style={styles.characterEpithet}>{character.epithet || 'No Epithet'}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelLabel}>LEVEL</Text>
              <Text style={styles.levelValue}>{character.level}</Text>
            </View>
          </View>

          <View style={styles.deityRow}>
            <Text style={styles.deityLabel}>Familia</Text>
            <Text style={styles.deityValue}>{character.patronDeityId || 'None'}</Text>
          </View>
        </View>

        {/* Pending Excelia Banner */}
        {pendingExcelia && Object.values(pendingExcelia.stats).some(v => v > 0) && (
          <View style={styles.pendingBanner}>
            <Text style={styles.pendingBannerTitle}>Falna Update Available</Text>
            <Text style={styles.pendingBannerText}>
              Visit your Familia's Blessing Rite to commit {Object.values(pendingExcelia.stats).reduce((a, b) => a + b, 0)} pending growth points.
            </Text>
          </View>
        )}

        {/* Derived Stats Summary */}
        <View style={styles.derivedCard}>
          <Text style={styles.sectionTitle}>COMBAT STATS</Text>
          <View style={styles.derivedGrid}>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Max HP</Text>
              <Text style={[styles.derivedValue, { color: Colors.resource.hp }]}>
                {derivedStats.maxHP}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Max SP</Text>
              <Text style={[styles.derivedValue, { color: Colors.resource.sp }]}>
                {derivedStats.maxSP}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Phys ATK</Text>
              <Text style={[styles.derivedValue, { color: Colors.ui.error }]}>
                {derivedStats.physicalAttack}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Mag ATK</Text>
              <Text style={[styles.derivedValue, { color: Colors.domain.magic }]}>
                {derivedStats.magicAttack}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Phys DEF</Text>
              <Text style={[styles.derivedValue, { color: Colors.domain.wisdom }]}>
                {derivedStats.physicalDefense}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Mag DEF</Text>
              <Text style={[styles.derivedValue, { color: Colors.domain.knowledge }]}>
                {derivedStats.magicDefense}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Speed</Text>
              <Text style={[styles.derivedValue, { color: Colors.domain.trickery }]}>
                {derivedStats.speed}
              </Text>
            </View>
            <View style={styles.derivedItem}>
              <Text style={styles.derivedLabel}>Crit %</Text>
              <Text style={[styles.derivedValue, { color: Colors.resource.gold }]}>
                {derivedStats.critChance.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Base Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>ABILITY SCORES</Text>

          {statNames.map((statName) => {
            const stat = stats[statName];
            const info = STAT_INFO[statName];
            const progress = getGradeProgress(stat.points, stat.grade);
            const nextGrade = getNextGrade(stat.grade);
            const categoryColor = STAT_CATEGORY_COLORS[getStatCategory(statName)];
            const pendingGain = pendingExcelia?.stats[statName] || 0;

            return (
              <View key={statName} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={styles.statNameRow}>
                    <View style={[styles.statIndicator, { backgroundColor: categoryColor }]} />
                    <Text style={styles.statAbbrev}>{statName}</Text>
                    <Text style={styles.statFullName}>{info.fullName}</Text>
                  </View>
                  <View style={styles.gradeContainer}>
                    <Text style={[styles.gradeText, { color: GRADE_COLORS[stat.grade] }]}>
                      {stat.grade}
                    </Text>
                    <Text style={styles.pointsText}>{stat.points}</Text>
                    {pendingGain > 0 && (
                      <Text style={styles.pendingGainText}>+{pendingGain}</Text>
                    )}
                  </View>
                </View>

                {/* Progress bar to next grade */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progress * 100}%`, backgroundColor: categoryColor },
                      ]}
                    />
                    {/* Show pending gain preview on progress bar */}
                    {pendingGain > 0 && (
                      <View
                        style={[
                          styles.progressBarPending,
                          {
                            left: `${progress * 100}%`,
                            width: `${Math.min((pendingGain / 100) * 100, (1 - progress) * 100)}%`,
                          },
                        ]}
                      />
                    )}
                  </View>
                  {nextGrade && (
                    <Text style={styles.nextGradeText}>
                      Next: {nextGrade}
                    </Text>
                  )}
                </View>

                {/* Stat effects */}
                <View style={styles.statEffects}>
                  <Text style={styles.effectText}>{info.combatEffect}</Text>
                </View>

                {/* How to improve */}
                <View style={styles.farmingTip}>
                  <Text style={styles.farmingTipText}>{STAT_FARMING_TIPS[statName]}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Equipment Summary */}
        <View style={styles.equipmentSection}>
          <Text style={styles.sectionTitle}>EQUIPMENT</Text>

          <View style={styles.equipmentCard}>
            <View style={styles.equipmentRow}>
              <Text style={styles.equipmentSlot}>Weapon</Text>
              <Text style={styles.equipmentName}>
                {character.equipment.weapon?.displayName || 'Unarmed'}
              </Text>
            </View>
            {character.equipment.weapon && (
              <Text style={styles.equipmentStats}>
                DMG: {character.equipment.weapon.finalDamage} |
                ACC: {character.equipment.weapon.finalAccuracy}% |
                CRIT: {character.equipment.weapon.finalCritChance.toFixed(0)}%
              </Text>
            )}
          </View>

          <View style={styles.equipmentCard}>
            <View style={styles.equipmentRow}>
              <Text style={styles.equipmentSlot}>Armor</Text>
              <Text style={styles.equipmentName}>
                {character.equipment.chest?.displayName || 'None'}
              </Text>
            </View>
          </View>

          <View style={styles.equipmentCard}>
            <View style={styles.equipmentRow}>
              <Text style={styles.equipmentSlot}>Accessory</Text>
              <Text style={styles.equipmentName}>
                {character.equipment.accessory1?.name || 'None'}
              </Text>
            </View>
          </View>
        </View>

        {/* Job / Class */}
        <View style={styles.equipmentSection}>
          <Text style={styles.sectionTitle}>CLASS</Text>
          {currentJob ? (
            <View style={styles.equipmentCard}>
              <View style={styles.equipmentRow}>
                <Text style={styles.equipmentSlot}>Path</Text>
                <Text style={[styles.equipmentName, { color: Colors.resource.gold }]}>
                  {currentJob.name}
                </Text>
              </View>
              <Text style={styles.equipmentStats}>
                {currentJob.description}
              </Text>
              <View style={[styles.equipmentRow, { marginTop: Spacing.sm }]}>
                <Text style={styles.equipmentSlot}>Starter Skill</Text>
                <Text style={styles.equipmentName}>
                  {currentJob.starterSkill.icon} {currentJob.starterSkill.name}
                </Text>
              </View>
              <Text style={styles.equipmentStats}>
                {currentJob.starterSkill.description}
              </Text>
            </View>
          ) : (
            <View style={styles.equipmentCard}>
              <Text style={[styles.equipmentStats, { fontStyle: 'italic' }]}>
                No path chosen — reach Level 2 to unlock your calling.
              </Text>
            </View>
          )}
        </View>

        {/* Run Stats */}
        <View style={styles.runStatsSection}>
          <Text style={styles.sectionTitle}>CURRENT RUN</Text>
          <View style={styles.runStatsGrid}>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatValue}>{character.runStats.monstersKilled}</Text>
              <Text style={styles.runStatLabel}>Monsters</Text>
            </View>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatValue}>{character.runStats.deepestFloor || 0}</Text>
              <Text style={styles.runStatLabel}>Floor</Text>
            </View>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatValue}>{character.runStats.goldEarned}</Text>
              <Text style={styles.runStatLabel}>Gold</Text>
            </View>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatValue}>{character.runStats.damageDealt}</Text>
              <Text style={styles.runStatLabel}>Damage</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing['2xl'],
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginBottom: Spacing.xl,
  },
  errorButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  errorButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.muted,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backText: {
    ...Typography.body,
    color: Colors.text.accent,
  },
  title: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  spacer: {
    width: 60,
  },

  // Character Card
  characterCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  characterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  characterName: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  characterEpithet: {
    ...Typography.caption,
    color: Colors.text.accent,
    fontStyle: 'italic',
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.text.accent,
  },
  levelLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
  levelValue: {
    ...Typography.h3,
    color: Colors.text.accent,
  },
  deityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  deityLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  deityValue: {
    ...Typography.body,
    color: Colors.text.primary,
  },

  // Pending Excelia Banner
  pendingBanner: {
    backgroundColor: Colors.resource.gold + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '60',
  },
  pendingBannerTitle: {
    ...Typography.label,
    color: Colors.resource.gold,
    marginBottom: Spacing.xs,
  },
  pendingBannerText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },

  // Derived Stats
  derivedCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  derivedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  derivedItem: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  derivedLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  derivedValue: {
    ...Typography.h6,
    fontWeight: '600',
  },

  // Stats Section
  statsSection: {
    marginBottom: Spacing.md,
  },
  statCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  statAbbrev: {
    ...Typography.h5,
    color: Colors.text.primary,
    width: 36,
  },
  statFullName: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  gradeText: {
    ...Typography.h4,
    fontWeight: '700',
  },
  pointsText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressBarPending: {
    position: 'absolute',
    height: '100%',
    backgroundColor: Colors.resource.gold,
    opacity: 0.5,
    borderRadius: 3,
  },
  pendingGainText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.resource.gold,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  nextGradeText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
    width: 50,
  },
  statEffects: {
    marginTop: Spacing.xs,
  },
  effectText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.text.secondary,
  },
  farmingTip: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: BorderWidth.hairline,
    borderTopColor: Colors.border.secondary,
  },
  farmingTipText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },

  // Equipment Section
  equipmentSection: {
    marginBottom: Spacing.md,
  },
  equipmentCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  equipmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentSlot: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  equipmentName: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  equipmentStats: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },

  // Run Stats
  runStatsSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  runStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  runStatItem: {
    alignItems: 'center',
  },
  runStatValue: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  runStatLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
});
