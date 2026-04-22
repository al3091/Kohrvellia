/**
 * Blessing Rite Ceremony Screen
 * The dramatic stat reveal where your deity updates your Falna
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useDeityStore } from '../../../src/stores/useDeityStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { useSoundStore } from '../../../src/stores/useSoundStore';
import { ConfettiBurst } from '../../../src/components/ceremony/CeremonyEffects';
import { BlessingCeremony } from '../../../src/components/effects/BlessingCeremony';
import type { StatName } from '../../../src/types/Stats';
import { STAT_INFO } from '../../../src/types/Stats';
import type { DeityDomain } from '../../../src/types/Deity';
import { getLeadingStats } from '../../../src/types/Character';

// Ceremony phases
type CeremonyPhase = 'approach' | 'examination' | 'revelation' | 'stat_selection' | 'approval' | 'complete';

// Deity messages based on total growth
const BLESSING_MESSAGES = {
  minimal: [
    'A modest effort. You must push harder.',
    'Barely perceptible growth. Train more diligently.',
    'Hmm... I expected more from you.',
  ],
  decent: [
    'Acceptable progress. Keep striving.',
    'Your efforts are bearing fruit.',
    'Not bad. Continue on this path.',
  ],
  impressive: [
    'Impressive! Your dedication shows.',
    'You grow stronger by the day.',
    'Well done, my child. I am pleased.',
  ],
  exceptional: [
    'MAGNIFICENT! Such growth is rare!',
    'The heavens themselves take notice!',
    'You surpass all expectations!',
  ],
};

// Archetype labels for each stat, used in the primary stat selection UI
const STAT_ARCHETYPES: Record<StatName, string> = {
  STR: 'Warrior',
  AGI: 'Scout',
  END: 'Guardian',
  INT: 'Mage',
  WIS: 'Cleric',
  PER: 'Ranger',
  CHA: 'Herald',
  LCK: 'Rogue',
};

// Grade color mapping
const GRADE_COLORS: Record<string, string> = {
  I: Colors.grade.I,
  H: Colors.grade.H,
  G: Colors.grade.G,
  F: Colors.grade.F,
  E: Colors.grade.E,
  D: Colors.grade.D,
  C: Colors.grade.C,
  B: Colors.grade.B,
  A: Colors.grade.A,
  S: Colors.grade.S,
  SS: Colors.grade.SS,
  SSS: Colors.grade.SSS,
};

// Stat names ordered for reveal
const STAT_ORDER: StatName[] = ['STR', 'END', 'AGI', 'INT', 'WIS', 'PER', 'CHA', 'LCK'];

interface StatRevealData {
  stat: StatName;
  oldValue: number;
  newValue: number;
  gain: number;
  oldGrade: string;
  newGrade: string;
  gradeUp: boolean;
}

export default function BlessingRiteScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { playSFX } = useSoundStore();

  const { character, getPendingExcelia, commitExcelia } = useCharacterStore();
  const { getPatronDeity, setPatronDeity: initializeDeityRelationship, relationship } = useDeityStore();

  // Fallback: If deity relationship isn't initialized, try to initialize from character
  React.useEffect(() => {
    if (!relationship && character?.patronDeityId) {
      initializeDeityRelationship(character.patronDeityId);
    }
  }, [relationship, character?.patronDeityId]);

  const deity = getPatronDeity();
  const pending = getPendingExcelia();

  const [phase, setPhase] = useState<CeremonyPhase>('approach');
  const [currentStatIndex, setCurrentStatIndex] = useState(-1);
  const [revealedStats, setRevealedStats] = useState<StatRevealData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCinematicCeremony, setShowCinematicCeremony] = useState(false);
  const [commitResult, setCommitResult] = useState<{ statsGained: Record<StatName, number>; gradeUps: Array<{ stat: StatName; newGrade: string }> } | null>(null);
  const [totalGain, setTotalGain] = useState(0);
  const [leadingStats, setLeadingStats] = useState<StatName[]>([]);
  const [selectedPrimaryStat, setSelectedPrimaryStat] = useState<StatName | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  // Phase timings
  useEffect(() => {
    if (!character || !pending) {
      router.replace('/town/familia');
      return;
    }

    // Start approach phase
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Transition to examination after delay
    const examTimer = setTimeout(() => {
      setPhase('examination');
      haptics.light();
    }, 3000);

    return () => clearTimeout(examTimer);
  }, []);

  // Examination phase - trigger cinematic ceremony
  useEffect(() => {
    if (phase !== 'examination') return;

    Animated.timing(textFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    // Start glow animation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
      ])
    );
    glowLoop.start();

    // Commit the excelia and prepare reveal data
    const timer = setTimeout(() => {
      if (!character || !pending) return;

      // Store old stats before commit
      const oldStats = { ...character.stats };

      // Commit the excelia
      const result = commitExcelia();
      setCommitResult(result);

      // Calculate total gain
      const total = Object.values(result.statsGained).reduce((sum, v) => sum + v, 0);
      setTotalGain(total);

      // Prepare reveal data
      const reveals: StatRevealData[] = [];
      for (const stat of STAT_ORDER) {
        const gain = result.statsGained[stat] || 0;
        if (gain > 0) {
          const gradeUp = result.gradeUps.find((g) => g.stat === stat);
          reveals.push({
            stat,
            oldValue: oldStats[stat].points,
            newValue: oldStats[stat].points + (gain > 0 ? Math.floor(gain * 0.1) : 0), // Rough estimate
            gain,
            oldGrade: oldStats[stat].grade,
            newGrade: gradeUp?.newGrade || oldStats[stat].grade,
            gradeUp: !!gradeUp,
          });
        }
      }
      setRevealedStats(reveals);

      // Trigger cinematic ceremony
      glowLoop.stop();
      setShowCinematicCeremony(true);
      haptics.medium();
      playSFX('buff');
      if (deity) {
        useSoundStore.getState().playBlessingBGM(deity.domain);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      glowLoop.stop();
    };
  }, [phase]);

  // Handle cinematic ceremony completion
  const handleCeremonyComplete = () => {
    setShowCinematicCeremony(false);
    setPhase('revelation');
  };

  // Revelation phase - reveal stats one by one
  useEffect(() => {
    if (phase !== 'revelation') return;
    if (revealedStats.length === 0) {
      // No stats gained, skip to approval
      setPhase('approval');
      return;
    }

    // Reveal first stat immediately
    setCurrentStatIndex(0);
    playSFX('buff');
    haptics.light();

    // Set up interval to reveal remaining stats
    let index = 0;
    const revealInterval = setInterval(() => {
      index++;
      if (index >= revealedStats.length) {
        clearInterval(revealInterval);
        // After all stats are revealed, determine next phase
        setTimeout(() => {
          // Read the latest character state to get post-commit stats
          const updatedCharacter = useCharacterStore.getState().character;
          const leading = updatedCharacter ? getLeadingStats(updatedCharacter) : [];
          setLeadingStats(leading);
          if (leading.length === 1) {
            setSelectedPrimaryStat(leading[0]);
            setPhase('approval');
          } else if (leading.length > 1) {
            setPhase('stat_selection');
          } else {
            setPhase('approval');
          }
        }, 1500);
        return;
      }

      setCurrentStatIndex(index);
      const stat = revealedStats[index];
      if (stat.gradeUp) {
        haptics.success();
        playSFX('level_up');
      } else {
        haptics.light();
        playSFX('buff');
      }
    }, 800);

    return () => clearInterval(revealInterval);
  }, [phase, revealedStats]);

  // Approval phase
  useEffect(() => {
    if (phase !== 'approval') return;

    // Show confetti for impressive/exceptional gains
    if (totalGain >= 30) {
      setShowConfetti(true);
      haptics.success();
      playSFX('victory');
    }

    // Move to complete after showing message
    const timer = setTimeout(() => {
      setPhase('complete');
    }, 3500);

    return () => clearTimeout(timer);
  }, [phase, totalGain]);

  // Complete phase - auto return
  useEffect(() => {
    if (phase !== 'complete') return;

    const timer = setTimeout(() => {
      router.replace('/town/familia');
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase]);

  // Get approval message based on total growth
  const getApprovalMessage = () => {
    if (totalGain < 10) {
      return BLESSING_MESSAGES.minimal[Math.floor(Math.random() * BLESSING_MESSAGES.minimal.length)];
    } else if (totalGain < 30) {
      return BLESSING_MESSAGES.decent[Math.floor(Math.random() * BLESSING_MESSAGES.decent.length)];
    } else if (totalGain < 60) {
      return BLESSING_MESSAGES.impressive[Math.floor(Math.random() * BLESSING_MESSAGES.impressive.length)];
    } else {
      return BLESSING_MESSAGES.exceptional[Math.floor(Math.random() * BLESSING_MESSAGES.exceptional.length)];
    }
  };

  if (!character || !deity) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Unable to perform Blessing Rite</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Confetti */}
      <ConfettiBurst active={showConfetti} particleCount={50} duration={3000} />

      {/* Cinematic Blessing Ceremony */}
      <BlessingCeremony
        active={showCinematicCeremony}
        domain={deity.domain as DeityDomain}
        deityName={deity.name}
        statGains={commitResult?.statsGained || {}}
        totalGain={totalGain}
        onComplete={handleCeremonyComplete}
      />

      {/* Background glow */}
      <Animated.View
        style={[
          styles.backgroundGlow,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
        pointerEvents="none"
      />

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Approach Phase */}
        {phase === 'approach' && (
          <View style={styles.phaseContainer}>
            <Text style={styles.deityName}>{deity.name}</Text>
            <Text style={styles.phaseText}>{`"Come, ${character.name}. Kneel before me..."`}</Text>
            <Text style={styles.phaseSubtext}>"Let me see your back..."</Text>
          </View>
        )}

        {/* Examination Phase - simplified while ceremony plays */}
        {phase === 'examination' && !showCinematicCeremony && (
          <View style={styles.phaseContainer}>
            <Animated.View style={[styles.examContainer, { opacity: textFade }]}>
              <Text style={styles.deityName}>{deity.name}</Text>
              <Text style={styles.examText}>"Hmm... I see..."</Text>
              <View style={styles.loadingDots}>
                <Text style={styles.loadingDot}>.</Text>
                <Text style={styles.loadingDot}>.</Text>
                <Text style={styles.loadingDot}>.</Text>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Revelation Phase */}
        {phase === 'revelation' && (
          <View style={styles.phaseContainer}>
            <Text style={styles.revelationTitle}>Your Growth</Text>

            <View style={styles.statsContainer}>
              {revealedStats.slice(0, currentStatIndex + 1).map((stat, index) => (
                <Animated.View
                  key={stat.stat}
                  style={[
                    styles.statRevealRow,
                    index === currentStatIndex && styles.statRevealRowActive,
                    stat.gradeUp && styles.statRevealRowGradeUp,
                  ]}
                >
                  <Text style={styles.statName}>{STAT_INFO[stat.stat].fullName}</Text>
                  <View style={styles.statGrowth}>
                    <Text style={[styles.statGrade, { color: GRADE_COLORS[stat.oldGrade] }]}>
                      {stat.oldGrade}
                    </Text>
                    <Text style={styles.statArrow}>→</Text>
                    <Text style={[styles.statGrade, { color: GRADE_COLORS[stat.newGrade] }]}>
                      {stat.newGrade}
                    </Text>
                    {stat.gradeUp && <Text style={styles.gradeUpBadge}>UP!</Text>}
                  </View>
                  <Text style={styles.statGain}>+{stat.gain}</Text>
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        {/* Stat Selection Phase */}
        {phase === 'stat_selection' && (
          <View style={styles.statSelectionContainer}>
            <Text style={styles.statSelectionTitle}>CHOOSE YOUR PRIMARY FOCUS</Text>
            <Text style={styles.statSelectionSubtitle}>
              {'Multiple stats have reached Grade A.\nYour primary focus defines your path.'}
            </Text>
            {leadingStats.map((stat) => (
              <Pressable
                key={stat}
                style={[
                  styles.statSelectButton,
                  selectedPrimaryStat === stat && styles.statSelectButtonActive,
                ]}
                onPress={() => setSelectedPrimaryStat(stat)}
              >
                <Text style={styles.statSelectButtonText}>
                  {stat} — {STAT_ARCHETYPES[stat]}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={[
                styles.continueButton,
                !selectedPrimaryStat && styles.continueButtonDisabled,
              ]}
              onPress={() => {
                if (!selectedPrimaryStat) return;
                useCharacterStore.getState().setPrimaryStat(selectedPrimaryStat);
                setPhase('approval');
              }}
            >
              <Text style={styles.continueButtonText}>Confirm Focus</Text>
            </Pressable>
          </View>
        )}

        {/* Approval Phase */}
        {(phase === 'approval' || phase === 'complete') && (
          <View style={styles.phaseContainer}>
            <Text style={styles.deityName}>{deity.name}</Text>
            <View style={styles.approvalContainer}>
              <Text style={styles.approvalText}>"{getApprovalMessage()}"</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Blessing Complete</Text>
              <Text style={styles.summaryText}>
                Total Growth: <Text style={styles.summaryValue}>+{totalGain}</Text> proficiency
              </Text>
              {commitResult && commitResult.gradeUps.length > 0 && (
                <Text style={styles.summaryGradeUps}>
                  {commitResult.gradeUps.length} stat{commitResult.gradeUps.length > 1 ? 's' : ''} reached new grade!
                </Text>
              )}
            </View>

            {phase === 'complete' && (
              <Text style={styles.returnText}>Returning to Familia Home...</Text>
            )}
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.resource.gold,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    textAlign: 'center',
  },

  // Phase container
  phaseContainer: {
    alignItems: 'center',
    width: '100%',
  },
  deityName: {
    ...Typography.h2,
    color: Colors.resource.gold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  phaseText: {
    ...Typography.h5,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  phaseSubtext: {
    ...Typography.body,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Examination
  examContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  examText: {
    ...Typography.h5,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  loadingDot: {
    fontSize: 32,
    color: Colors.resource.gold,
  },

  // Revelation
  revelationTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xl,
    letterSpacing: 2,
  },
  statsContainer: {
    width: '100%',
    gap: Spacing.sm,
  },
  statRevealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  statRevealRowActive: {
    borderColor: Colors.resource.gold,
    backgroundColor: Colors.background.tertiary,
  },
  statRevealRowGradeUp: {
    borderColor: Colors.ui.success,
    borderWidth: BorderWidth.normal,
  },
  statName: {
    ...Typography.body,
    color: Colors.text.primary,
    width: 100,
    fontWeight: '600',
  },
  statGrowth: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  statGrade: {
    ...Typography.h5,
    fontWeight: 'bold',
  },
  statArrow: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  gradeUpBadge: {
    ...Typography.caption,
    color: Colors.ui.success,
    fontWeight: 'bold',
    backgroundColor: Colors.ui.success + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  statGain: {
    ...Typography.h6,
    color: Colors.resource.gold,
    width: 50,
    textAlign: 'right',
  },

  // Approval
  approvalContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '60',
  },
  approvalText: {
    ...Typography.h5,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
  },
  summaryContainer: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryTitle: {
    ...Typography.h6,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
  summaryText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  summaryValue: {
    color: Colors.resource.gold,
    fontWeight: 'bold',
  },
  summaryGradeUps: {
    ...Typography.body,
    color: Colors.ui.success,
    fontWeight: '600',
  },
  returnText: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: Spacing.xl,
    fontStyle: 'italic',
  },

  // Stat selection
  statSelectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  statSelectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.resource.gold,
    textAlign: 'center',
    letterSpacing: 2,
  },
  statSelectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  statSelectButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
  },
  statSelectButtonActive: {
    borderColor: Colors.resource.gold,
    backgroundColor: Colors.background.tertiary,
  },
  statSelectButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: Colors.resource.gold,
    borderRadius: BorderRadius.md,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
