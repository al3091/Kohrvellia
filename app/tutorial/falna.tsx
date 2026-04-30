/**
 * Tutorial Screen 5 — The Falna
 * Stats grow through deeds, not time.
 * Your weapon is your teacher. Your actions are your curriculum.
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

const ACTION_TRAINING = [
  { action: 'ATTACK with a sword',   trains: 'STR',  color: Colors.domain.war },
  { action: 'ATTACK with a staff',   trains: 'INT',  color: Colors.domain.magic },
  { action: 'ATTACK with a bow',     trains: 'PER',  color: Colors.domain.sky },
  { action: 'DEFEND',                trains: 'END',  color: Colors.domain.nature },
  { action: 'OBSERVE an enemy',      trains: 'WIS',  color: Colors.domain.wisdom },
  { action: 'FLEE successfully',     trains: 'AGI',  color: Colors.domain.trickery },
  { action: 'TAUNT an enemy',        trains: 'CHA',  color: Colors.domain.fortune },
  { action: 'LAND a critical hit',   trains: 'PER',  color: Colors.domain.sky },
];

export default function TutorialFalnaScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { advanceTutorial } = useGameStore();

  const handleContinue = () => {
    haptics.medium();
    advanceTutorial();
    router.push('/tutorial/leveling');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>The Falna</Text>
        <Text style={styles.subtitle}>Your actions write your growth.</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.formula}>
          <Text style={styles.formulaText}>Effective Stat  =  (Level × 500)  +  Grade Points</Text>
        </View>

        <Text style={styles.sectionLabel}>ACTION → STAT TRAINED</Text>

        <View style={styles.trainingList}>
          {ACTION_TRAINING.map(item => (
            <View key={item.action + item.trains} style={styles.trainingRow}>
              <Text style={styles.trainingAction}>{item.action}</Text>
              <View style={[styles.trainsTag, { borderColor: item.color }]}>
                <Text style={[styles.trainsText, { color: item.color }]}>{item.trains}</Text>
              </View>
            </View>
          ))}
        </View>

        <CeremonialDivider variant="thin" />

        <View style={styles.noteBlock}>
          <Text style={styles.noteTitle}>Excelia is hidden until you return home.</Text>
          <Text style={styles.noteBody}>
            Stats earned in the dungeon don't apply until your deity performs the Blessing Rite.
            Die before returning — lose everything you earned.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="How do I level up?"
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
    gap: Spacing.lg,
    justifyContent: 'center',
  },
  formula: {
    backgroundColor: Colors.background.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  formulaText: {
    ...Typography.bodySmall,
    color: Colors.text.accent,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  trainingList: {
    gap: Spacing.xs,
  },
  trainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  trainingAction: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  trainsTag: {
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 40,
    alignItems: 'center',
  },
  trainsText: {
    ...Typography.label,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
  noteBlock: {
    gap: Spacing.xs,
  },
  noteTitle: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  noteBody: {
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
