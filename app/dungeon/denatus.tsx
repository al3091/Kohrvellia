/**
 * Denatus Ceremony — Soul Naming Ritual
 * Triggered at Level 10 (Paragon). The Tower reveals who the player became.
 * Title format: [CR Adjective] [Stat Adjective] [Skill Noun]
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useSoulStore } from '../../src/stores/useSoulStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { CeremonialDivider } from '../../src/components/ui/CeremonialDivider';
import type { GeneratedTitle } from '../../src/types/Behavement';
import type { StatName } from '../../src/types/Stats';

type CeremonyPhase =
  | 'witness'
  | 'score'
  | 'adjective1'
  | 'adjective2'
  | 'noun'
  | 'buffs'
  | 'complete';

const PHASE_ORDER: CeremonyPhase[] = [
  'witness', 'score', 'adjective1', 'adjective2', 'noun', 'buffs', 'complete',
];

const CR_SCORE_LABELS: Record<string, string> = {
  novice: 'Novice',
  apprentice: 'Apprentice',
  journeyman: 'Journeyman',
  adept: 'Adept',
  expert: 'Expert',
  master: 'Master',
  grandmaster: 'Grandmaster',
  heroic: 'Heroic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const CR_SCORE_COLORS: Record<string, string> = {
  novice: Colors.text.muted,
  apprentice: Colors.text.secondary,
  journeyman: Colors.text.secondary,
  adept: Colors.domain.nature,
  expert: Colors.domain.wisdom,
  master: Colors.text.accent,
  grandmaster: Colors.text.accent,
  heroic: Colors.domain.magic,
  legendary: Colors.domain.fortune,
  mythic: Colors.domain.magic,
};

function getTopTwoStats(character: { stats: Record<StatName, { points: number }> }): [StatName, StatName] {
  const statEntries = Object.entries(character.stats) as [StatName, { points: number }][];
  statEntries.sort((a, b) => b[1].points - a[1].points);
  return [statEntries[0][0], statEntries[1][0]];
}

export default function DenatusScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { performDenatus, getOverallScore, isCeremonyCompleted } = useSoulStore();
  const { character } = useCharacterStore();
  const [phase, setPhase] = useState<CeremonyPhase>('witness');
  const [title, setTitle] = useState<GeneratedTitle | null>(null);

  // Animations
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const wordScale = useRef(new Animated.Value(0.7)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(containerOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // Generate title once
    if (character && !isCeremonyCompleted()) {
      const topStats = getTopTwoStats(character);
      const generated = performDenatus(topStats);
      if (generated) setTitle(generated);
    } else if (character) {
      setTitle(useSoulStore.getState().getGeneratedTitle());
    }

    useSoundStore.getState().crossfadeBGM('blessing_generic', 1000);
  }, []);

  useEffect(() => {
    // Animate word reveal on each phase change (phases that reveal title words)
    if (phase === 'adjective1' || phase === 'adjective2' || phase === 'noun') {
      wordScale.setValue(0.7);
      wordOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(wordScale, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
        Animated.timing(wordOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
    if (phase === 'complete') {
      Animated.timing(glowOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [phase]);

  const advance = () => {
    haptics.medium();
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[currentIndex + 1]);
    }
  };

  const handleFinish = () => {
    haptics.heavy();
    useSoundStore.getState().crossfadeBGM('dungeon', 800);
    router.replace('/dungeon/floor');
  };

  const crScore = getOverallScore();
  const crAdj = title?.crAdjective ?? 'Novice';
  const crColor = CR_SCORE_COLORS[crAdj.toLowerCase()] ?? Colors.text.muted;

  return (
    <Animated.View style={[styles.root, { opacity: containerOpacity }]}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

        {/* PHASE: WITNESS — atmospheric intro */}
        {phase === 'witness' && (
          <View style={styles.centeredBody}>
            <Text style={styles.towerLabel}>⟁ THE TOWER SPEAKS</Text>
            <CeremonialDivider variant="fade" spacing="xl" />
            <Text style={styles.witnessText}>
              Every choice made. Every foe faced. Every floor descended.
            </Text>
            <Text style={styles.witnessSubtext}>
              The Tower has watched all of it.{'\n'}Now it names what it saw.
            </Text>
          </View>
        )}

        {/* PHASE: SCORE — CR score reveal */}
        {phase === 'score' && (
          <View style={styles.centeredBody}>
            <Text style={styles.phaseLabel}>SOUL SCORE</Text>
            <View style={[styles.scoreBox, { borderColor: crColor }]}>
              <Text style={[styles.scoreNumber, { color: crColor }]}>{Math.round(crScore)}%</Text>
              <Text style={[styles.scoreLabel, { color: crColor }]}>
                {CR_SCORE_LABELS[crAdj.toLowerCase()] ?? crAdj}
              </Text>
            </View>
            <Text style={styles.scoreDescription}>
              Your deeds across this run have been weighed.{'\n'}
              This is the measure of your legend.
            </Text>
          </View>
        )}

        {/* PHASE: ADJECTIVE1 — CR tier word */}
        {(phase === 'adjective1' || phase === 'adjective2' || phase === 'noun' || phase === 'complete') && title && (
          <View style={styles.centeredBody}>
            <Text style={styles.phaseLabel}>
              {phase === 'adjective1' ? 'YOUR LEGACY' :
               phase === 'adjective2' ? 'YOUR ESSENCE' :
               phase === 'noun' ? 'YOUR SOUL' : 'YOU ARE'}
            </Text>

            <View style={styles.titleBuilder}>
              {/* CR Adjective — always shown once revealed */}
              <Animated.Text
                style={[
                  styles.titleWord,
                  styles.titleWordCR,
                  { color: crColor },
                  phase === 'adjective1'
                    ? { opacity: wordOpacity, transform: [{ scale: wordScale }] }
                    : {},
                ]}
              >
                {title.crAdjective}
              </Animated.Text>

              {/* Stat Adjective */}
              {(phase === 'adjective2' || phase === 'noun' || phase === 'complete') && (
                <Animated.Text
                  style={[
                    styles.titleWord,
                    styles.titleWordStat,
                    phase === 'adjective2'
                      ? { opacity: wordOpacity, transform: [{ scale: wordScale }] }
                      : {},
                  ]}
                >
                  {title.statAdjective}
                </Animated.Text>
              )}

              {/* Skill Noun */}
              {(phase === 'noun' || phase === 'complete') && (
                <Animated.Text
                  style={[
                    styles.titleWord,
                    styles.titleWordNoun,
                    phase === 'noun'
                      ? { opacity: wordOpacity, transform: [{ scale: wordScale }] }
                      : {},
                  ]}
                >
                  {title.skillNoun}
                </Animated.Text>
              )}
            </View>

            {phase === 'complete' && (
              <Animated.View style={[styles.fullTitleBox, { opacity: glowOpacity }]}>
                <Text style={styles.fullTitleLabel}>PARAGON TITLE</Text>
                <Text style={[styles.fullTitle, { color: crColor }]}>{title.fullTitle}</Text>
              </Animated.View>
            )}
          </View>
        )}

        {/* PHASE: BUFFS — passive buff reveal */}
        {phase === 'buffs' && title && (
          <View style={styles.centeredBody}>
            <Text style={styles.phaseLabel}>PARAGON GIFT</Text>
            <CeremonialDivider variant="thin" spacing="md" />
            <Text style={styles.nounName}>{title.skillNoun}</Text>
            <Text style={styles.buffDescription}>
              {title.buffs.nounPassive?.description ?? 'A unique power stirs within.'}
            </Text>
            <CeremonialDivider variant="thin" spacing="md" />
            <View style={styles.statBonusBlock}>
              <Text style={styles.statBonusLabel}>STAT AMPLIFICATION</Text>
              <Text style={styles.statBonusValue}>
                +{Math.round(title.buffs.statBonus.percentage * 100)}% to{' '}
                {title.buffs.statBonus.stat1} and {title.buffs.statBonus.stat2}
              </Text>
              <Text style={styles.magnitudeNote}>
                Magnitude: {title.magnitude.toFixed(1)}×
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {phase !== 'complete' ? (
            <Pressable style={styles.continueBtn} onPress={advance}>
              <Text style={styles.continueBtnText}>
                {phase === 'buffs' ? 'See Your Title' : 'Continue'}
              </Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.continueBtn, styles.finishBtn]} onPress={handleFinish}>
              <Text style={[styles.continueBtnText, styles.finishBtnText]}>
                Enter the Tower as {title?.skillNoun ?? 'the Paragon'}
              </Text>
            </Pressable>
          )}
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
  centeredBody: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },

  // Witness phase
  towerLabel: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.domain.magic,
    letterSpacing: 3,
  },
  witnessText: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  witnessSubtext: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },

  // Score phase
  phaseLabel: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.text.muted,
    letterSpacing: 3,
  },
  scoreBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing['3xl'],
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  scoreNumber: {
    ...Typography.h1,
    fontSize: 64,
    fontWeight: '700',
  },
  scoreLabel: {
    ...Typography.h4,
    letterSpacing: 3,
    fontWeight: '600',
  },
  scoreDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Title reveal phases
  titleBuilder: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  titleWord: {
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '700',
  },
  titleWordCR: {
    ...Typography.h3,
    fontSize: 28,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  titleWordStat: {
    ...Typography.h2,
    fontSize: 38,
    letterSpacing: 2,
    color: Colors.text.primary,
  },
  titleWordNoun: {
    ...Typography.h1,
    fontSize: 52,
    letterSpacing: 1,
    color: Colors.domain.magic,
  },

  // Complete phase
  fullTitleBox: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.accent,
    gap: Spacing.xs,
  },
  fullTitleLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.text.muted,
    letterSpacing: 3,
  },
  fullTitle: {
    ...Typography.h4,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
  },

  // Buffs phase
  nounName: {
    ...Typography.h2,
    color: Colors.domain.magic,
    letterSpacing: 2,
    fontWeight: '700',
  },
  buffDescription: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  statBonusBlock: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statBonusLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.text.muted,
    letterSpacing: 2,
  },
  statBonusValue: {
    ...Typography.h5,
    color: Colors.text.accent,
    textAlign: 'center',
  },
  magnitudeNote: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },

  // Footer
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  continueBtn: {
    backgroundColor: Colors.background.card,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.domain.magic,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  continueBtnText: {
    ...Typography.body,
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  finishBtn: {
    borderLeftColor: Colors.text.accent,
    backgroundColor: Colors.text.accent + '15',
  },
  finishBtnText: {
    color: Colors.text.accent,
    fontWeight: '600',
  },
});
