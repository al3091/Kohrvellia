/**
 * Codex Screen
 * Encyclopedia of game knowledge
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius } from '../../src/constants/Spacing';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { ALL_ACHIEVEMENTS } from '../../src/data/achievements';
import type { AchievementTier } from '../../src/types/Achievement';

const TOTAL_SHRINE_DOMAINS = 12; // War, Magic, Trickery, Death, Fortune, Nature, Wisdom, Craft, Life, Sky, Fire, Knowledge

const TIER_LABEL: Record<AchievementTier, string> = {
  standard: 'Standard',
  challenging: 'Challenging',
  heroic: 'Heroic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function CodexScreen() {
  const router = useRouter();
  useCharacterStore(); // keep store subscribed for future use
  const { progress, getCompletedAchievements } = useAchievementStore();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const completedAchievements = getCompletedAchievements();
  const totalAchievements = ALL_ACHIEVEMENTS.length;

  // Count how many have been discovered (known, rumored, or completed)
  const discoveredCount = ALL_ACHIEVEMENTS.filter((a) => {
    const p = progress[a.id];
    return p && p.discoveryState !== 'hidden';
  }).length;

  // Group all achievements by targetLevel
  const achievementsByLevel: Record<number, typeof ALL_ACHIEVEMENTS> = {};
  for (const level of LEVELS) {
    achievementsByLevel[level] = ALL_ACHIEVEMENTS.filter(
      (a) => a.targetLevel === level
    );
  }

  const codexCategories = [
    {
      title: 'Bestiary',
      description: 'Catalog of monsters encountered in the tower',
      icon: '🐉',
      count: 0,
      total: 150,
      pending: true,
    },
    {
      title: 'Equipment',
      description: 'Weapons, armor, and artifacts discovered',
      icon: '⚔️',
      count: 0,
      total: 100,
      pending: true,
    },
    {
      title: 'Deities',
      description: 'The gods and their domains',
      icon: '✨',
      count: TOTAL_SHRINE_DOMAINS,
      total: TOTAL_SHRINE_DOMAINS,
      pending: false,
    },
    {
      title: 'Lore',
      description: 'Tales and histories of Kohrvellia',
      icon: '📜',
      count: 0,
      total: 50,
      pending: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </Pressable>
        <Text style={styles.title}>Codex</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <Text style={styles.sectionTitle}>CATEGORIES</Text>
        {codexCategories.map((category) => (
          <View
            key={category.title}
            style={[
              styles.categoryCard,
              category.pending && styles.categoryCardPending,
            ]}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            <View style={styles.categoryProgress}>
              {category.pending ? (
                <Text style={styles.pendingText}>Soon</Text>
              ) : (
                <Text style={styles.progressText}>
                  {category.count}/{category.total}
                </Text>
              )}
            </View>
          </View>
        ))}

        {/* Feats / Achievements */}
        <View style={styles.featsHeaderRow}>
          <Text style={styles.sectionTitle}>FEATS ACCOMPLISHED</Text>
          <Text style={styles.featsSummary}>
            {completedAchievements.length} completed  |  {discoveredCount} / {totalAchievements} discovered
          </Text>
        </View>

        {LEVELS.map((level) => {
          const levelAchievements = achievementsByLevel[level];
          if (!levelAchievements || levelAchievements.length === 0) return null;

          return (
            <View key={level} style={styles.levelGroup}>
              <Text style={styles.levelHeader}>
                {'-- LEVEL '}
                {level}
                {' '}
                {'--'}
              </Text>

              {levelAchievements.map((achievement) => {
                const p = progress[achievement.id];
                const discoveryState = p?.discoveryState ?? 'hidden';
                const isCompleted = p?.isCompleted ?? false;
                const tierColor = Colors.achievement[achievement.tier];

                if (discoveryState === 'hidden') {
                  return (
                    <View key={achievement.id} style={styles.featRow}>
                      <Text style={styles.featCheckHidden}>[ ]</Text>
                      <View style={styles.featBody}>
                        <View style={styles.featTitleRow}>
                          <Text style={styles.featNameHidden}>???</Text>
                          <Text style={[styles.featTier, { color: tierColor }]}>
                            {TIER_LABEL[achievement.tier]}
                          </Text>
                        </View>
                        <Text style={styles.featDescHidden}>
                          Conditions unknown.
                        </Text>
                      </View>
                    </View>
                  );
                }

                // known, rumored, or completed
                const reqProgress = p?.requirementProgress ?? [];
                const hasPartialProgress =
                  !isCompleted &&
                  reqProgress.some((r) => r.current > 0);

                return (
                  <View
                    key={achievement.id}
                    style={[
                      styles.featRow,
                      isCompleted && styles.featRowCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.featCheck,
                        isCompleted && styles.featCheckDone,
                      ]}
                    >
                      {isCompleted ? '[+]' : '[ ]'}
                    </Text>
                    <View style={styles.featBody}>
                      <View style={styles.featTitleRow}>
                        <Text
                          style={[
                            styles.featName,
                            isCompleted && styles.featNameCompleted,
                          ]}
                          numberOfLines={1}
                        >
                          {achievement.name}
                        </Text>
                        <Text style={[styles.featTier, { color: tierColor }]}>
                          {TIER_LABEL[achievement.tier]}
                        </Text>
                      </View>
                      <Text style={styles.featDesc} numberOfLines={2}>
                        {achievement.description}
                      </Text>
                      {hasPartialProgress && (
                        <View style={styles.featProgressRow}>
                          {reqProgress.map((r, i) => (
                            <Text key={i} style={styles.featProgressText}>
                              {r.current}/{r.target}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  categoryCardPending: {
    opacity: 0.45,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  categoryDescription: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  categoryProgress: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.text.accent,
    fontWeight: '600',
  },
  pendingText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },

  // Feats section
  featsHeaderRow: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  featsSummary: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  levelGroup: {
    marginBottom: Spacing.lg,
  },
  levelHeader: {
    ...Typography.label,
    color: Colors.text.accent,
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: 4,
  },
  featRowCompleted: {
    backgroundColor: Colors.background.secondary,
  },
  featCheck: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginRight: Spacing.sm,
    marginTop: 1,
  },
  featCheckDone: {
    color: Colors.ui.success,
  },
  featCheckHidden: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginRight: Spacing.sm,
    marginTop: 1,
    opacity: 0.4,
  },
  featBody: {
    flex: 1,
  },
  featTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  featName: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  featNameCompleted: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  featNameHidden: {
    ...Typography.bodySmall,
    color: Colors.text.muted,
    flex: 1,
    marginRight: Spacing.sm,
    opacity: 0.5,
  },
  featTier: {
    ...Typography.caption,
    fontWeight: '600',
  },
  featDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  featDescHidden: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    opacity: 0.4,
  },
  featProgressRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: Spacing.sm,
  },
  featProgressText: {
    ...Typography.caption,
    color: Colors.text.accent,
  },
});
