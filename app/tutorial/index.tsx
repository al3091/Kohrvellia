/**
 * Tutorial Screen 1 — The Stakes
 * Going deeper is a promise. Death keeps it.
 * No skip. Press-and-hold oath. Fade to black.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useGameStore } from '../../src/stores/useGameStore';

const HOLD_DURATION = 1200;

export default function TutorialStakesScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { advanceTutorial } = useGameStore();

  // Title pulse
  const titleOpacity = useRef(new Animated.Value(0.82)).current;
  const titlePulse = useRef<Animated.CompositeAnimation | null>(null);

  // Press-and-hold fill (JS thread, acceptable — fires once per session)
  const fillWidth = useRef(new Animated.Value(0)).current;
  const [isHolding, setIsHolding] = useState(false);
  const [committed, setCommitted] = useState(false);

  // Screen fade-out on commit
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    titlePulse.current = Animated.loop(
      Animated.sequence([
        Animated.timing(titleOpacity, {
          toValue: 1.0,
          duration: 2800,
          useNativeDriver: true,
          easing: (t) => Math.sin(t * Math.PI),
        }),
        Animated.timing(titleOpacity, {
          toValue: 0.82,
          duration: 2800,
          useNativeDriver: true,
          easing: (t) => Math.sin(t * Math.PI),
        }),
      ])
    );
    titlePulse.current.start();

    return () => {
      titlePulse.current?.stop();
    };
  }, []);

  const handlePressIn = () => {
    if (committed) return;
    setIsHolding(true);
    haptics.light();

    Animated.timing(fillWidth, {
      toValue: 1,
      duration: HOLD_DURATION,
      useNativeDriver: false, // width cannot use native driver
    }).start(({ finished }) => {
      if (finished) {
        setCommitted(true);
        haptics.heavy();
        titlePulse.current?.stop();

        // Fade screen to black, then navigate
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          advanceTutorial();
          router.push('/tutorial/basics');
        });
      }
    });
  };

  const handlePressOut = () => {
    if (committed) return;
    setIsHolding(false);

    // Reset fill on release before completion
    fillWidth.stopAnimation();
    Animated.timing(fillWidth, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const fillWidthPercent = fillWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.body}>
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            K O H R V E L L I A
          </Animated.Text>

          <View style={styles.statements}>
            <Text style={styles.line}>Going deeper is a promise.</Text>
            <Text style={styles.lineGold}>Death keeps it.</Text>
            <Text style={styles.lineDim}>Everything you built. Everything you carry. Gone.</Text>
          </View>
        </View>

        {/* Bottom gradient implying depth */}
        <LinearGradient
          colors={[Colors.background.primary, Colors.domain.death + '60', Colors.domain.death + 'a0']}
          style={styles.depthGradient}
          pointerEvents="none"
        />

        <View style={styles.footer}>
          <Pressable
            style={[styles.holdButton, isHolding && styles.holdButtonActive]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={committed}
          >
            {/* Fill progress overlay */}
            <Animated.View
              style={[styles.holdFill, { width: fillWidthPercent }]}
            />
            <Text style={styles.holdLabel}>
              {isHolding ? 'Hold…' : "I'll earn my way out."}
            </Text>
          </Pressable>
          <Text style={styles.holdHint}>Hold to enter.</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Padding.screen.horizontal,
    gap: Spacing['3xl'],
  },
  title: {
    ...Typography.h3,
    color: Colors.text.accent,
    letterSpacing: 6,
    textAlign: 'center',
  },
  statements: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  line: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 24,
  },
  lineGold: {
    ...Typography.body,
    color: Colors.text.accent,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 24,
    fontWeight: '600',
  },
  lineDim: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 24,
    marginTop: Spacing.sm,
  },
  depthGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    zIndex: 1,
  },
  holdButton: {
    height: 52,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  holdButtonActive: {
    borderColor: Colors.text.accent,
  },
  holdFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.domain.death,
    opacity: 0.7,
  },
  holdLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    letterSpacing: 1,
    zIndex: 1,
  },
  holdHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
