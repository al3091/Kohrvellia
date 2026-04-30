/**
 * Tutorial Screen 6 — The Ascent
 * Three keys unlock the next level. All three. Every time.
 * No shortcuts. No grinding. One deed, chosen wisely.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { Button, CeremonialDivider } from '../../src/components/ui';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useGameStore } from '../../src/stores/useGameStore';

const REQUIREMENTS = [
  {
    step: '1',
    title: 'All 8 stats at Grade D',
    detail: 'Every pillar must stand. Neglect one, you stay.',
    color: Colors.domain.nature,
  },
  {
    step: '2',
    title: 'Complete a Great Achievement',
    detail: 'Choose one deed from the list. Standard to Mythic — harder choices, greater rewards.',
    color: Colors.text.accent,
  },
  {
    step: '3',
    title: 'Deity Approval',
    detail: "Your god must recognize your growth. Favor matters. Don't disappoint them.",
    color: Colors.domain.wisdom,
  },
];

const TIERS = [
  { name: 'STANDARD', mult: '×1',  color: Colors.text.muted },
  { name: 'CHALLENGING', mult: '×1.5', color: Colors.domain.nature },
  { name: 'HEROIC', mult: '×2',   color: Colors.text.accent },
  { name: 'LEGENDARY', mult: '×3', color: Colors.domain.fortune },
  { name: 'MYTHIC', mult: '×5',   color: Colors.domain.magic },
];

export default function TutorialLevelingScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { advanceTutorial } = useGameStore();

  const handleContinue = () => {
    haptics.medium();
    advanceTutorial();
    router.push('/tutorial/death');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>The Ascent</Text>
        <Text style={styles.subtitle}>Level up is earned. Not given.</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.requirementList}>
          {REQUIREMENTS.map(req => (
            <View key={req.step} style={styles.requirement}>
              <View style={[styles.stepBadge, { borderColor: req.color }]}>
                <Text style={[styles.stepNum, { color: req.color }]}>{req.step}</Text>
              </View>
              <View style={styles.reqInfo}>
                <Text style={styles.reqTitle}>{req.title}</Text>
                <Text style={styles.reqDetail}>{req.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <CeremonialDivider variant="thin" />

        <View style={styles.tiersBlock}>
          <Text style={styles.tiersLabel}>ACHIEVEMENT TIERS — Stat Bonus Multiplier</Text>
          <View style={styles.tierRow}>
            {TIERS.map(tier => (
              <View key={tier.name} style={styles.tierItem}>
                <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                <Text style={[styles.tierMult, { color: tier.color }]}>{tier.mult}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.tierNote}>
            Harder deeds amplify the stat points you lock in. Choose well — the choice is permanent.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="One last thing"
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
    paddingBottom: Spacing.lg,
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
  body: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  requirementList: {
    gap: Spacing.lg,
  },
  requirement: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNum: {
    ...Typography.label,
    fontSize: 13,
    fontWeight: '700',
  },
  reqInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  reqTitle: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  reqDetail: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  tiersBlock: {
    gap: Spacing.sm,
  },
  tiersLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  tierRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  tierItem: {
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },
  tierName: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 1,
  },
  tierMult: {
    ...Typography.h5,
    fontWeight: '700',
  },
  tierNote: {
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
