/**
 * SneakRollAnimation - Dramatic dice roll animation for sneak attempts
 * Shows the roll, the DC, and the result with ceremonial pacing
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';
import { SneakTiming, SpringConfig } from '../../constants/Animation';

export type SneakResult = 'success' | 'minor_fail' | 'major_fail' | 'critical_fail';

export interface SneakRollAnimationProps {
  /** The actual roll result (1-20) */
  roll: number;
  /** AGI modifier */
  modifier: number;
  /** The difficulty class to beat */
  dc: number;
  /** Called when animation completes */
  onComplete: (result: SneakResult) => void;
}

export function SneakRollAnimation({
  roll,
  modifier,
  dc,
  onComplete,
}: SneakRollAnimationProps) {
  const [displayedRoll, setDisplayedRoll] = useState(1);
  const [phase, setPhase] = useState<'rolling' | 'showing' | 'result'>('rolling');
  const [result, setResult] = useState<SneakResult | null>(null);

  const rollScale = useRef(new Animated.Value(0.5)).current;
  const rollOpacity = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0.8)).current;

  const total = roll + modifier;
  const success = total >= dc;

  // Calculate result type
  useEffect(() => {
    if (roll === 1) {
      setResult('critical_fail');
    } else if (success) {
      setResult('success');
    } else {
      const diff = dc - total;
      if (diff <= 3) {
        setResult('minor_fail');
      } else {
        setResult('major_fail');
      }
    }
  }, [roll, total, dc, success]);

  // Animation sequence
  useEffect(() => {
    // Phase 1: Rolling numbers rapidly
    let rollInterval: NodeJS.Timeout;
    let currentNumber = 1;

    // Start with fade in
    Animated.parallel([
      Animated.timing(rollOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(rollScale, {
        toValue: 1,
        ...SpringConfig.bouncy,
      }),
    ]).start();

    // Rapid number cycling
    rollInterval = setInterval(() => {
      currentNumber = Math.floor(Math.random() * 20) + 1;
      setDisplayedRoll(currentNumber);
    }, 80);

    // After cycling, slow down and land on actual roll
    let slowdownTimer: NodeJS.Timeout | null = null;
    let slowInterval: NodeJS.Timeout | null = null;

    slowdownTimer = setTimeout(() => {
      clearInterval(rollInterval);

      // Slower cycling
      let slowIndex = 0;
      const slowNumbers = [
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        roll, // Land on actual roll
      ];

      slowInterval = setInterval(() => {
        setDisplayedRoll(slowNumbers[slowIndex]);
        slowIndex++;
        if (slowIndex >= slowNumbers.length) {
          if (slowInterval) clearInterval(slowInterval);
          setPhase('showing');
        }
      }, 150);
    }, SneakTiming.rollCycle);

    return () => {
      clearInterval(rollInterval);
      if (slowdownTimer) clearTimeout(slowdownTimer);
      if (slowInterval) clearInterval(slowInterval);
    };
  }, [roll, rollOpacity, rollScale]);

  // Phase 2: Show roll then reveal result
  useEffect(() => {
    if (phase !== 'showing') return;

    const showTimer = setTimeout(() => {
      setPhase('result');

      // Animate result reveal
      Animated.parallel([
        Animated.timing(resultOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(resultScale, {
          toValue: 1,
          ...SpringConfig.bouncy,
        }),
      ]).start();
    }, SneakTiming.resultPause);

    return () => clearTimeout(showTimer);
  }, [phase, resultOpacity, resultScale]);

  // Phase 3: Complete
  useEffect(() => {
    if (phase !== 'result' || !result) return;

    const completeTimer = setTimeout(() => {
      onComplete(result);
    }, SneakTiming.dramaticPause + 800);

    return () => clearTimeout(completeTimer);
  }, [phase, result, onComplete]);

  const getResultDisplay = () => {
    switch (result) {
      case 'success':
        return { text: 'ESCAPED!', color: Colors.ui.success, icon: '💨' };
      case 'minor_fail':
        return { text: 'SPOTTED!', color: Colors.ui.warning, icon: '👁️' };
      case 'major_fail':
        return { text: 'CAUGHT!', color: Colors.domain.war, icon: '⚠️' };
      case 'critical_fail':
        return { text: 'AMBUSHED!', color: Colors.ui.error, icon: '💀' };
      default:
        return { text: '', color: Colors.text.muted, icon: '' };
    }
  };

  const resultDisplay = getResultDisplay();

  return (
    <View style={styles.container}>
      {/* Dice Roll Display */}
      <Animated.View
        style={[
          styles.diceContainer,
          {
            opacity: rollOpacity,
            transform: [{ scale: rollScale }],
          },
        ]}
      >
        <View style={[
          styles.dice,
          roll === 20 && phase !== 'rolling' && styles.diceNat20,
          roll === 1 && phase !== 'rolling' && styles.diceNat1,
        ]}>
          <Text style={[
            styles.diceNumber,
            roll === 20 && phase !== 'rolling' && styles.diceNumberNat20,
            roll === 1 && phase !== 'rolling' && styles.diceNumberNat1,
          ]}>
            {displayedRoll}
          </Text>
        </View>

        {/* Modifier and Total */}
        {phase !== 'rolling' && (
          <View style={styles.calculation}>
            <Text style={styles.calcText}>
              {roll} + {modifier} = {total}
            </Text>
            <Text style={styles.dcText}>
              vs DC {dc}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Result Display */}
      {phase === 'result' && result && (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text style={styles.resultIcon}>{resultDisplay.icon}</Text>
          <Text style={[styles.resultText, { color: resultDisplay.color }]}>
            {resultDisplay.text}
          </Text>
          {result !== 'success' && (
            <Text style={styles.penaltyText}>
              {result === 'minor_fail' && 'Enemy strikes first!'}
              {result === 'major_fail' && 'Accuracy reduced for 2 turns!'}
              {result === 'critical_fail' && 'Enemy gets a free attack!'}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    minHeight: 300,
  },

  // Dice
  diceContainer: {
    alignItems: 'center',
  },
  dice: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  diceNat20: {
    borderColor: Colors.resource.gold,
    backgroundColor: Colors.resource.gold + '20',
  },
  diceNat1: {
    borderColor: Colors.ui.error,
    backgroundColor: Colors.ui.error + '20',
  },
  diceNumber: {
    fontSize: 48,
    fontWeight: '200',
    color: Colors.text.primary,
  },
  diceNumberNat20: {
    color: Colors.resource.gold,
    fontWeight: '700',
  },
  diceNumberNat1: {
    color: Colors.ui.error,
    fontWeight: '700',
  },

  // Calculation
  calculation: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  calcText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  dcText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },

  // Result
  resultContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  resultText: {
    fontSize: 32,
    fontWeight: '200',
    letterSpacing: 6,
    textAlign: 'center',
  },
  penaltyText: {
    ...Typography.body,
    color: Colors.text.muted,
    marginTop: Spacing.md,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SneakRollAnimation;
