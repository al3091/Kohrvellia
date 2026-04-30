/**
 * Tutorial Screen 2 — The Kairos Protocol
 * Both slots visible from frame one. Bonus dimmed until primary stages.
 * Invoke button rises on completion. FLOW hint after invoke.
 * Must complete to advance.
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { Button } from '../../src/components/ui';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useGameStore } from '../../src/stores/useGameStore';

type KairosPhase = 'idle' | 'primary_staged' | 'bonus_staged' | 'invoked';

export default function TutorialKairosScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { advanceTutorial } = useGameStore();
  const [phase, setPhase] = useState<KairosPhase>('idle');

  // Bonus slot opacity — dims at start, animates to full when primary stages
  const bonusOpacity = useRef(new Animated.Value(0.25)).current;

  // Invoke button slide-up — off-screen until both slots staged
  const invokeTranslateY = useRef(new Animated.Value(60)).current;
  const invokeOpacity = useRef(new Animated.Value(0)).current;

  // Consequence pulse on primary slot when staged
  const primaryScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (phase === 'primary_staged') {
      // Bonus slot fades in
      Animated.timing(bonusOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Primary slot pulse
      Animated.sequence([
        Animated.timing(primaryScale, { toValue: 1.03, duration: 120, useNativeDriver: true }),
        Animated.timing(primaryScale, { toValue: 1.0, duration: 120, useNativeDriver: true }),
      ]).start();
    }

    if (phase === 'bonus_staged') {
      // Invoke button rises from below
      Animated.parallel([
        Animated.spring(invokeTranslateY, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
        Animated.timing(invokeOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [phase]);

  const handlePrimary = () => {
    if (phase !== 'idle') return;
    haptics.medium();
    setPhase('primary_staged');
  };

  const handleBonus = () => {
    if (phase !== 'primary_staged') return;
    haptics.medium();
    setPhase('bonus_staged');
  };

  const handleInvoke = () => {
    if (phase !== 'bonus_staged') return;
    haptics.heavy();
    setPhase('invoked');
  };

  const handleContinue = () => {
    haptics.medium();
    advanceTutorial();
    router.push('/tutorial/stats');
  };

  const primaryStaged = phase !== 'idle';
  const bonusStaged = phase === 'bonus_staged' || phase === 'invoked';
  const invoked = phase === 'invoked';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>The Kairos Protocol</Text>
        <Text style={styles.subtitle}>Stage both. Then invoke.</Text>
      </View>

      <View style={styles.body}>
        {/* Primary Slot — always full opacity */}
        <Animated.View style={{ transform: [{ scale: primaryScale }] }}>
          <Pressable
            style={[styles.slot, primaryStaged && styles.slotStagedPrimary]}
            onPress={handlePrimary}
            disabled={primaryStaged}
          >
            <View style={styles.slotRow}>
              <Text style={styles.slotLabel}>PRIMARY</Text>
              {primaryStaged
                ? <Text style={styles.stagedBadgePrimary}>✓ ATTACK  staged</Text>
                : <Text style={styles.slotHint}>tap to stage</Text>
              }
            </View>
            {!primaryStaged && <Text style={styles.slotAction}>[ ATTACK ]</Text>}
            {!primaryStaged && (
              <Text style={styles.slotCaption}>Attack · Skill · Item · Charge · Flee</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Bonus Slot — visible from frame one, dimmed until primary staged */}
        <Animated.View style={{ opacity: bonusOpacity }}>
          <Pressable
            style={[styles.slot, bonusStaged && styles.slotStagedBonus]}
            onPress={handleBonus}
            disabled={phase !== 'primary_staged'}
          >
            <View style={styles.slotRow}>
              <Text style={styles.slotLabel}>BONUS  (AGI)</Text>
              {bonusStaged
                ? <Text style={styles.stagedBadgeBonus}>✓ OBSERVE  staged</Text>
                : phase === 'primary_staged'
                  ? <Text style={styles.slotUnlocked}>Speed threshold met →</Text>
                  : <Text style={styles.slotHint}>locked</Text>
              }
            </View>
            {!bonusStaged && <Text style={[styles.slotAction, phase !== 'primary_staged' && styles.slotActionDim]}>[ OBSERVE ]</Text>}
            {!bonusStaged && (
              <Text style={styles.slotCaption}>Observe · Defend · Quick Strike · Taunt</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Invoke — rises when both staged */}
        <Animated.View style={{
          transform: [{ translateY: invokeTranslateY }],
          opacity: invokeOpacity,
        }}>
          <Pressable
            style={styles.invokeButton}
            onPress={handleInvoke}
            disabled={phase !== 'bonus_staged'}
          >
            <Text style={styles.invokeLabel}>INVOKE KAIROS</Text>
          </Pressable>
        </Animated.View>

        {/* Post-invoke: resolution + FLOW hint */}
        {invoked && (
          <View style={styles.resolvedBlock}>
            <View style={styles.resolvedRow}>
              <View style={[styles.resolvedSlot, styles.resolvedSlotGold]}>
                <Text style={styles.resolvedSlotText}>OBSERVE fires</Text>
              </View>
              <Text style={styles.resolvedArrow}>→</Text>
              <View style={[styles.resolvedSlot, styles.resolvedSlotGold]}>
                <Text style={styles.resolvedSlotText}>ATTACK fires</Text>
              </View>
            </View>
            <Text style={styles.resolvedNote}>Bonus resolves before Primary. Speed wins initiative.</Text>
            <View style={styles.flowHint}>
              <Text style={styles.flowText}>Varied actions build FLOW — bonus damage for unpredictability.</Text>
            </View>
          </View>
        )}

        {/* Warning strip — always present */}
        <View style={styles.warningStrip}>
          <Text style={styles.warningText}>Nothing fires until you invoke.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {invoked && (
          <Button
            label="Continue"
            onPress={handleContinue}
            hapticStyle="medium"
            size="lg"
            fullWidth
          />
        )}
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
    gap: Spacing.md,
    justifyContent: 'center',
  },
  slot: {
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  slotStagedPrimary: {
    borderColor: Colors.text.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
  },
  slotStagedBonus: {
    borderColor: Colors.domain.wisdom,
    borderLeftWidth: 3,
    borderLeftColor: Colors.domain.wisdom,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  slotHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  slotUnlocked: {
    ...Typography.caption,
    color: Colors.domain.wisdom,
    letterSpacing: 0.5,
  },
  slotAction: {
    ...Typography.h4,
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  slotActionDim: {
    color: Colors.text.muted,
  },
  slotCaption: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  stagedBadgePrimary: {
    ...Typography.caption,
    color: Colors.text.accent,
    letterSpacing: 1,
  },
  stagedBadgeBonus: {
    ...Typography.caption,
    color: Colors.domain.wisdom,
    letterSpacing: 1,
  },
  invokeButton: {
    backgroundColor: Colors.domain.death,
    borderWidth: 1,
    borderColor: Colors.text.accent,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  invokeLabel: {
    ...Typography.h5,
    color: Colors.text.accent,
    letterSpacing: 3,
  },

  // Post-invoke resolution
  resolvedBlock: {
    gap: Spacing.sm,
  },
  resolvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  resolvedSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
  },
  resolvedSlotGold: {
    borderColor: Colors.text.accent,
    backgroundColor: Colors.text.accent + '10',
  },
  resolvedSlotText: {
    ...Typography.caption,
    color: Colors.text.accent,
    letterSpacing: 1,
  },
  resolvedArrow: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  resolvedNote: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  flowHint: {
    backgroundColor: Colors.domain.wisdom + '12',
    borderLeftWidth: 2,
    borderLeftColor: Colors.domain.wisdom,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  flowText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },

  // Warning strip
  warningStrip: {
    backgroundColor: Colors.text.accent + '15',
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  warningText: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    minHeight: 80,
  },
});
