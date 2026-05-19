/**
 * Ascension Ceremony
 * Level 2 rite: deity examines the Falna, assigns a path (job), and offers a gift.
 * This is a sacred act. Not a form. Not a button.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useJobStore } from '../../../src/stores/useJobStore';
import { useDeityStore } from '../../../src/stores/useDeityStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { useSoundStore } from '../../../src/stores/useSoundStore';
import type { StatName } from '../../../src/types/Stats';
import type { Job } from '../../../src/types/Job';
import type { Weapon } from '../../../src/types/Weapon';
import { ConfettiBurst } from '../../../src/components/ceremony/CeremonyEffects';

type AscensionPhase = 'summons' | 'examination' | 'blessing' | 'calling' | 'gift' | 'complete';

const DOMAIN_WEAPON_CATEGORY: Partial<Record<string, StatName>> = {
  war: 'STR', craft: 'STR', authority: 'STR',
  trickery: 'AGI', fortune: 'AGI', death: 'AGI',
  knowledge: 'INT', magic: 'INT',
  wisdom: 'WIS', divine: 'WIS', life: 'WIS',
  sky: 'PER', sea: 'PER', nature: 'PER',
};

function resolveTopThreeStats(
  effectiveStats: Record<StatName, number>
): [StatName, StatName, StatName] {
  const ordered = (Object.entries(effectiveStats) as [StatName, number][])
    .sort(([, a], [, b]) => b - a)
    .map(([stat]) => stat);
  return [ordered[0], ordered[1], ordered[2]] as [StatName, StatName, StatName];
}

const STAT_FULL_NAMES: Record<StatName, string> = {
  STR: 'Strength', PER: 'Perception', END: 'Endurance', CHA: 'Charisma',
  INT: 'Intelligence', AGI: 'Agility', WIS: 'Wisdom', LCK: 'Luck',
};

export default function AscensionScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { playSFX } = useSoundStore();
  const { character, getEffectiveStats, performLevelUp, addToInventory } = useCharacterStore();
  const { selectJob } = useJobStore();
  const { getPatronDeity, relationship } = useDeityStore();

  const [phase, setPhase] = useState<AscensionPhase>('summons');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobConfirmed, setJobConfirmed] = useState(false);
  const [giftWeapon, setGiftWeapon] = useState<Weapon | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const allowBack = useRef(false);
  // Computed after performLevelUp fires so stats reflect post-level-up carry
  const [callingData, setCallingData] = useState<{
    topThree: [StatName, StatName, StatName];
    availableJobs: Job[];
  } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const deity = getPatronDeity();
  const favor = relationship?.favor ?? 50;
  const deityFavor = character?.deityFavor ?? favor;

  // Compute top-3 at mount for examination phase display (Level 1 stats, pre-reset)
  const examinationTopThree = useMemo(() => {
    const effectiveStats = getEffectiveStats();
    return resolveTopThreeStats(effectiveStats);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => !allowBack.current);
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    playSFX('level_up');
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (phase === 'examination') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [phase]);

  if (!character) return null;

  const getSummonsLine = (): string => {
    if (!deity) return '"Come forward. I have been watching."';
    const name = deity.name;
    if (deityFavor >= 70) return `"${name} smiles upon you. I have watched every step. Today, you become more than you were."`;
    if (deityFavor >= 40) return `"Your growth is undeniable. Come before me, ${character.name}. It is time."`;
    return `"You have earned this. Barely. Do not make me regret it, ${character.name}."`;
  };

  const handleAdvanceFromSummons = () => {
    haptics.medium();
    setPhase('examination');
  };

  const handleAdvanceFromExamination = () => {
    haptics.heavy();
    playSFX('achievement');
    setPhase('blessing');

    setTimeout(() => {
      performLevelUp();
      haptics.success();
      setShowConfetti(true);

      // Compute available jobs from POST-level-up effective stats (carry-based ranking)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getJobsForStats } = require('../../../src/data/jobs') as {
        getJobsForStats: (t: [StatName, StatName, StatName]) => Job[];
      };
      const postStats = useCharacterStore.getState().getEffectiveStats();
      const postTopThree = resolveTopThreeStats(postStats);
      setCallingData({ topThree: postTopThree, availableJobs: getJobsForStats(postTopThree) });
    }, 600);

    setTimeout(() => {
      setPhase('calling');
    }, 2400);
  };

  const handleSelectJob = (jobId: string) => {
    if (jobConfirmed) return;
    haptics.light();
    setSelectedJobId(jobId);
  };

  const handleConfirmJob = () => {
    if (!selectedJobId || jobConfirmed) return;
    haptics.heavy();
    setJobConfirmed(true);
    selectJob(selectedJobId);

    // Check for deity weapon gift
    const shouldGiveWeapon = deityFavor >= 60;
    if (shouldGiveWeapon) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { generateLeveledWeaponDrop } = require('../../../src/data/weapons') as typeof import('../../../src/data/weapons');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { registerWeapon } = require('../../../src/data/weaponRegistry') as typeof import('../../../src/data/weaponRegistry');

      const selectedJob = callingData?.availableJobs.find(j => j.id === selectedJobId);
      const weaponCat: StatName = selectedJob?.starterWeaponCategory
        ?? (deity ? (DOMAIN_WEAPON_CATEGORY[deity.domain] ?? 'STR') : 'STR');

      const weapon = generateLeveledWeaponDrop(1, 2, [weaponCat]);
      registerWeapon(weapon);
      setGiftWeapon(weapon);
      const added = addToInventory({
        id: weapon.id,
        type: 'weapon',
        stackable: false,
        quantity: 1,
        weaponData: weapon,
      });
      if (!added) {
        // Bag full — gift is lost. Skip gift phase.
        setTimeout(() => setPhase('complete'), 800);
        return;
      }

      setTimeout(() => setPhase('gift'), 800);
    } else {
      setTimeout(() => setPhase('complete'), 800);
    }
  };

  const handleComplete = () => {
    allowBack.current = true;
    haptics.medium();

    // Level 5: route to job specialization if not yet chosen
    const currentLevel = useCharacterStore.getState().character?.level ?? 0;
    if (currentLevel === 5) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useJobStore: jobStore } = require('../../../src/stores/useJobStore') as typeof import('../../../src/stores/useJobStore');
      if (!jobStore.getState().currentSpecializationId) {
        router.replace('/dungeon/job-select?mode=specialization');
        return;
      }
    }

    router.replace('/town');
  };

  const topThree = callingData?.topThree ?? examinationTopThree;
  const availableJobs = callingData?.availableJobs ?? [];
  const selectedJobData = availableJobs.find(j => j.id === selectedJobId) ?? null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Deity header */}
          <View style={styles.deityHeader}>
            <Text style={styles.deityIcon}>
              {deity ? (['war','craft','authority'].includes(deity.domain) ? '⚔️'
                : ['magic','knowledge'].includes(deity.domain) ? '✨'
                : ['death','trickery'].includes(deity.domain) ? '💀'
                : ['life','wisdom','divine'].includes(deity.domain) ? '🙏'
                : '🌟') : '🌟'}
            </Text>
            <Text style={styles.deityName}>{deity?.name ?? 'Your Deity'}</Text>
            <Text style={styles.ceremonyLabel}>— ASCENSION RITE —</Text>
          </View>

          {/* PHASE: SUMMONS */}
          {phase === 'summons' && (
            <View style={styles.phaseBlock}>
              <Animated.View style={[styles.speechBubble, { opacity: glowAnim }]}>
                <Text style={styles.speechText}>{getSummonsLine()}</Text>
              </Animated.View>
              <Text style={styles.phaseCaption}>
                The air grows still. Your deity's gaze is upon you.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={handleAdvanceFromSummons}>
                <Text style={styles.primaryBtnText}>Step Forward</Text>
              </Pressable>
            </View>
          )}

          {/* PHASE: EXAMINATION */}
          {phase === 'examination' && (
            <View style={styles.phaseBlock}>
              <Animated.View style={[styles.speechBubble, { opacity: glowAnim }]}>
                <Text style={styles.speechText}>
                  "Your Falna does not lie... I see what you have become."
                </Text>
              </Animated.View>
              <View style={styles.statPillRow}>
                {topThree.map(stat => (
                  <View key={stat} style={styles.statPill}>
                    <Text style={styles.statPillAbbr}>{stat}</Text>
                    <Text style={styles.statPillName}>{STAT_FULL_NAMES[stat]}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.phaseCaption}>
                Your leading pillars shine through the Falna.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={handleAdvanceFromExamination}>
                <Text style={styles.primaryBtnText}>Receive the Blessing</Text>
              </Pressable>
            </View>
          )}

          {/* PHASE: BLESSING */}
          {phase === 'blessing' && (
            <View style={styles.phaseBlock}>
              {showConfetti && <ConfettiBurst active={showConfetti} />}
              <Text style={styles.blessingTitle}>LEVEL 2</Text>
              <Animated.View style={styles.speechBubble}>
                <Text style={styles.speechText}>
                  "The old self is shed. The Falna resets — your growth now carries within you, permanent. Rise."
                </Text>
              </Animated.View>
              <Text style={styles.phaseCaption}>Your stats have been reset. Your history carries forward forever.</Text>
            </View>
          )}

          {/* PHASE: CALLING — Job Selection */}
          {phase === 'calling' && (
            <View style={styles.phaseBlock}>
              <Animated.View style={styles.speechBubble}>
                <Text style={styles.speechText}>
                  {`"Your nature reveals your path. I see ${STAT_FULL_NAMES[topThree[0]]} in you above all. Choose what you become."`}
                </Text>
              </Animated.View>

              {availableJobs.length === 0 ? (
                <View style={styles.noJobsBlock}>
                  <Text style={styles.noJobsText}>No paths found for your stat combination.</Text>
                  <Text style={styles.noJobsHint}>This is a bug. Please report it.</Text>
                  <Pressable style={styles.primaryBtn} onPress={() => setPhase('complete')}>
                    <Text style={styles.primaryBtnText}>Continue</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  {availableJobs.map(job => {
                    const isSelected = selectedJobId === job.id;
                    return (
                      <Pressable
                        key={job.id}
                        style={[styles.jobCard, isSelected && styles.jobCardSelected]}
                        onPress={() => handleSelectJob(job.id)}
                        disabled={jobConfirmed}
                      >
                        <View style={styles.jobCardHeader}>
                          <Text style={[styles.jobCardName, isSelected && styles.jobCardNameSelected]}>
                            {job.name}
                          </Text>
                          <Text style={styles.jobCardBonus}>+{job.statBonus.value} {job.statBonus.stat}</Text>
                        </View>
                        <Text style={styles.jobCardDesc}>{job.description}</Text>
                        <Text style={styles.jobCardFlavor}>{job.flavorText}</Text>
                        <View style={styles.skillPreview}>
                          <Text style={styles.skillPreviewLabel}>Skill Granted</Text>
                          <View style={styles.skillPreviewRow}>
                            <Text style={styles.skillIcon}>{job.starterSkill.icon}</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.skillName}>{job.starterSkill.name}</Text>
                              <Text style={styles.skillDesc}>{job.starterSkill.description}</Text>
                              <Text style={styles.skillMeta}>{job.starterSkill.spCost} SP · CD {job.starterSkill.cooldown}</Text>
                            </View>
                          </View>
                          {job.starterWeaponCategory && (
                            <Text style={styles.weaponNote}>
                              {deityFavor >= 60
                                ? `Deity Gift: ${job.starterWeaponCategory}-scaling weapon (favor granted)`
                                : `Weapon gift requires higher favor`}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}

                  {selectedJobId && !jobConfirmed && (
                    <Pressable style={styles.primaryBtn} onPress={handleConfirmJob}>
                      <Text style={styles.primaryBtnText}>
                        Claim This Path — {selectedJobData?.name}
                      </Text>
                    </Pressable>
                  )}
                  {jobConfirmed && (
                    <Text style={styles.confirmedNote}>Your path has been chosen. The Falna rewrites itself...</Text>
                  )}
                </>
              )}
            </View>
          )}

          {/* PHASE: GIFT */}
          {phase === 'gift' && giftWeapon && (
            <View style={styles.phaseBlock}>
              <Animated.View style={styles.speechBubble}>
                <Text style={styles.speechText}>
                  "A gift, from my hand to yours. May it serve you as faithfully as you have served."
                </Text>
              </Animated.View>
              <View style={styles.giftCard}>
                <Text style={styles.giftLabel}>DEITY GIFT</Text>
                <Text style={styles.giftName}>{giftWeapon.displayName}</Text>
                <Text style={styles.giftDesc}>
                  {giftWeapon.base.category}-scaling weapon · {giftWeapon.finalDamage} damage
                </Text>
                <Text style={styles.giftAddedNote}>Added to your inventory.</Text>
              </View>
              <Pressable style={styles.primaryBtn} onPress={() => setPhase('complete')}>
                <Text style={styles.primaryBtnText}>Accept the Gift</Text>
              </Pressable>
            </View>
          )}

          {/* PHASE: COMPLETE */}
          {phase === 'complete' && (
            <View style={styles.phaseBlock}>
              <Animated.View style={styles.speechBubble}>
                <Text style={styles.speechText}>
                  "Go. Prove it was deserved."
                </Text>
              </Animated.View>
              <Text style={styles.phaseCaption}>
                The ceremony is over. The Tower awaits.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={handleComplete}>
                <Text style={styles.primaryBtnText}>Return</Text>
              </Pressable>
            </View>
          )}

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing['2xl'],
  },
  deityHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  deityIcon: {
    fontSize: 52,
    marginBottom: Spacing.sm,
  },
  deityName: {
    ...Typography.h2,
    color: Colors.resource.gold,
    marginBottom: Spacing.xs,
  },
  ceremonyLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 3,
    fontSize: 11,
  },
  phaseBlock: {
    gap: Spacing.lg,
  },
  speechBubble: {
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '40',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  speechText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  phaseCaption: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.text.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  primaryBtnText: {
    ...Typography.button,
    color: Colors.background.primary,
    letterSpacing: 1,
    fontWeight: '700',
  },
  statPillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  statPill: {
    alignItems: 'center',
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '60',
  },
  statPillAbbr: {
    ...Typography.h5,
    color: Colors.resource.gold,
  },
  statPillName: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  blessingTitle: {
    ...Typography.h1,
    color: Colors.resource.gold,
    textAlign: 'center',
    letterSpacing: 4,
  },
  noJobsBlock: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  noJobsText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  noJobsHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  jobCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    gap: Spacing.sm,
  },
  jobCardSelected: {
    borderColor: Colors.resource.gold,
    backgroundColor: Colors.background.elevated,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobCardName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  jobCardNameSelected: {
    color: Colors.resource.gold,
  },
  jobCardBonus: {
    ...Typography.caption,
    color: Colors.ui.success,
    fontWeight: '700',
  },
  jobCardDesc: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  jobCardFlavor: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  skillPreview: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  skillPreviewLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 2,
  },
  skillPreviewRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  skillIcon: {
    fontSize: 26,
    lineHeight: 32,
  },
  skillName: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  skillDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  skillMeta: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  weaponNote: {
    ...Typography.caption,
    color: Colors.resource.gold,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  confirmedNote: {
    ...Typography.bodySmall,
    color: Colors.resource.gold,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  giftCard: {
    backgroundColor: Colors.resource.gold + '15',
    borderWidth: 1,
    borderColor: Colors.resource.gold + '60',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  giftLabel: {
    ...Typography.label,
    color: Colors.resource.gold,
    fontSize: 10,
    letterSpacing: 3,
  },
  giftName: {
    ...Typography.h3,
    color: Colors.resource.gold,
  },
  giftDesc: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  giftAddedNote: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
});
