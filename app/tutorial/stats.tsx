/**
 * Tutorial Screen 4 — Eight Pillars
 * Every action maps to a stat. Every stat maps to a grade.
 * Grades climb: I → H → G → F → E → D → C → B → A → S → SS → SSS
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { Button, CeremonialDivider } from '../../src/components/ui';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useGameStore } from '../../src/stores/useGameStore';

const STATS = [
  { abbr: 'STR', name: 'Strength',     role: 'Melee damage · carry weight',       color: Colors.domain.war },
  { abbr: 'PER', name: 'Perception',   role: 'Trap detection · ranged accuracy',   color: Colors.domain.sky },
  { abbr: 'END', name: 'Endurance',    role: 'Max HP · resistances',               color: Colors.domain.nature },
  { abbr: 'CHA', name: 'Charisma',     role: 'NPC prices · intimidation',          color: Colors.domain.fortune },
  { abbr: 'INT', name: 'Intelligence', role: 'Magic damage · puzzle bonuses',      color: Colors.domain.magic },
  { abbr: 'AGI', name: 'Agility',      role: 'Dodge · flee chance · speed',        color: Colors.domain.trickery },
  { abbr: 'WIS', name: 'Wisdom',       role: 'Magic defense · divine blessings',   color: Colors.domain.wisdom },
  { abbr: 'LCK', name: 'Luck',         role: 'Critical hits · loot quality',       color: Colors.domain.fortune },
];

const GRADE_SEQUENCE = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export default function TutorialStatsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { advanceTutorial } = useGameStore();

  const handleContinue = () => {
    haptics.medium();
    advanceTutorial();
    router.push('/tutorial/falna');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Eight Pillars</Text>
        <Text style={styles.subtitle}>Every action trains something.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {STATS.map(stat => (
          <View key={stat.abbr} style={styles.statRow}>
            <View style={[styles.abbrBox, { borderLeftColor: stat.color }]}>
              <Text style={[styles.abbr, { color: stat.color }]}>{stat.abbr}</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statName}>{stat.name}</Text>
              <Text style={styles.statRole}>{stat.role}</Text>
            </View>
          </View>
        ))}

        <CeremonialDivider variant="thin" />

        <View style={styles.gradeBlock}>
          <Text style={styles.gradeTitle}>GRADE SCALE</Text>
          <View style={styles.gradeRow}>
            {GRADE_SEQUENCE.map((g, i) => (
              <Text
                key={g}
                style={[
                  styles.grade,
                  i === 0 && styles.gradeDim,
                  g === 'D' && styles.gradeTarget,
                  g === 'SSS' && styles.gradeMax,
                ]}
              >
                {g}
              </Text>
            ))}
          </View>
          <Text style={styles.gradeNote}>
            Grade D is the floor to level up. SSS is a lifetime of mastery.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="How do stats grow?"
          onPress={handleContinue}
          hapticStyle="medium"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.accent,
    letterSpacing: 1,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  abbrBox: {
    width: 44,
    borderLeftWidth: 3,
    paddingLeft: Spacing.sm,
  },
  abbr: {
    ...Typography.label,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '700',
  },
  statInfo: {
    flex: 1,
    gap: 2,
  },
  statName: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  statRole: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  gradeBlock: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  gradeTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  grade: {
    ...Typography.caption,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    minWidth: 28,
    textAlign: 'center',
  },
  gradeDim: {
    color: Colors.text.muted,
    borderColor: Colors.border.primary,
    opacity: 0.5,
  },
  gradeTarget: {
    color: Colors.text.accent,
    borderColor: Colors.text.accent,
    fontWeight: '700',
  },
  gradeMax: {
    color: Colors.domain.magic,
    borderColor: Colors.domain.magic,
  },
  gradeNote: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
});
