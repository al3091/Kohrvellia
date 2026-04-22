/**
 * Tutorial Screen 3 — The Ledger
 * Kill ≠ XP. Deeds ≠ optional. Weapon = lesson.
 * Three lines of advice. One door.
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

export default function TutorialLedgerScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { completeTutorial } = useGameStore();

  const handleEnter = () => {
    haptics.heavy();
    completeTutorial();
    router.replace('/character-creation/name');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        {/* Kill vs Deed contrast */}
        <View style={styles.contrastBlock}>
          <View style={styles.contrastRow}>
            <Text style={styles.contrastDim}>KILL 1,000 GOBLINS</Text>
            <Text style={styles.contrastArrow}>→</Text>
            <Text style={styles.contrastDim}>0 XP</Text>
          </View>
          <View style={styles.contrastRow}>
            <Text style={styles.contrastGold}>COMPLETE ONE DEED</Text>
            <Text style={styles.contrastArrow}>→</Text>
            <Text style={styles.contrastGold}>LEVEL UP</Text>
          </View>
        </View>

        <CeremonialDivider variant="thin" />

        {/* Weapon lesson — Valdris condition */}
        <View style={styles.weaponLesson}>
          <Text style={styles.weaponLine}>What you carry determines what grows.</Text>
          <Text style={styles.weaponLineDim}>Your weapon is your lesson.</Text>
        </View>

        <CeremonialDivider variant="thin" />

        {/* Final advice */}
        <View style={styles.advice}>
          <Text style={styles.adviceLine}>Flee when something feels wrong.</Text>
          <Text style={styles.adviceLine}>Rest when you find it, not when you need it.</Text>
          <Text style={styles.adviceLine}>Observe before you commit.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Enter the Tower"
          onPress={handleEnter}
          hapticStyle="heavy"
          size="lg"
          fullWidth
        />
        <Text style={styles.footerNote}>
          The shade remains here, if you ever need to hear it again.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  body: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  contrastBlock: {
    gap: Spacing.md,
  },
  contrastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  contrastDim: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 2,
    fontSize: 12,
  },
  contrastArrow: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  contrastGold: {
    ...Typography.label,
    color: Colors.text.accent,
    letterSpacing: 2,
    fontSize: 12,
  },
  weaponLesson: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weaponLine: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  weaponLineDim: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  advice: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  adviceLine: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  footerNote: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
