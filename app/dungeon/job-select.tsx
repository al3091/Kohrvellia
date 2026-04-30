/**
 * Job Selection Ceremony — triggered at Level 2.
 * Shows the 2-4 jobs that match the player's top 3 stats.
 * Player picks one; the starter skill and stat bonus are applied immediately.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useJobStore } from '../../src/stores/useJobStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import type { StatName } from '../../src/types/Stats';
import type { Job } from '../../src/types/Job';

/** Resolve the player's top-3 stats from their effective stat values. */
function resolveTopThreeStats(
  effectiveStats: Record<StatName, number>
): [StatName, StatName, StatName] {
  const ordered = (Object.entries(effectiveStats) as [StatName, number][])
    .sort(([, a], [, b]) => b - a)
    .map(([stat]) => stat);
  return [ordered[0], ordered[1], ordered[2]] as [StatName, StatName, StatName];
}

const STAT_FULL_NAMES: Record<StatName, string> = {
  STR: 'Strength',
  PER: 'Perception',
  END: 'Endurance',
  CHA: 'Charisma',
  INT: 'Intelligence',
  AGI: 'Agility',
  WIS: 'Wisdom',
  LCK: 'Luck',
};

export default function JobSelectScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { playSFX } = useSoundStore();
  const { character, getEffectiveStats } = useCharacterStore();
  const { selectJob } = useJobStore();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    playSFX('level_up');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const { topThree, availableJobs } = useMemo(() => {
    const effectiveStats = getEffectiveStats();
    const topThree = resolveTopThreeStats(effectiveStats);

    // Dynamic import to avoid circular deps at module init
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getJobsForStats } = require('../../src/data/jobs') as {
      getJobsForStats: (t: [StatName, StatName, StatName]) => Job[];
    };
    const availableJobs = getJobsForStats(topThree);

    return { topThree, availableJobs };
  }, []);

  const handleSelect = (jobId: string) => {
    if (confirmed) return;
    haptics.light();
    setSelectedJobId(jobId);
  };

  const handleConfirm = () => {
    if (!selectedJobId || confirmed) return;
    haptics.heavy();
    playSFX('achievement');
    setConfirmed(true);
    selectJob(selectedJobId);
    setTimeout(() => router.back(), 1200);
  };

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Awakening your calling...</Text>
      </SafeAreaView>
    );
  }

  const selectedJob = availableJobs.find(j => j.id === selectedJobId) ?? null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Calling Awakens</Text>
          <Text style={styles.subtitle}>Level 2 — Choose Your Path</Text>
        </View>

        {/* Top 3 stats pill row */}
        <View style={styles.statsRow}>
          {topThree.map((stat) => (
            <View key={stat} style={styles.statPill}>
              <Text style={styles.statPillLabel}>{stat}</Text>
              <Text style={styles.statPillName}>{STAT_FULL_NAMES[stat]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          {availableJobs.length} path{availableJobs.length !== 1 ? 's' : ''} available
        </Text>

        {/* Job cards */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {availableJobs.length === 0 ? (
            <View style={styles.noJobs}>
              <Text style={styles.noJobsText}>No paths found for your stat combination.</Text>
              <Text style={styles.noJobsHint}>This is a bug — please report it.</Text>
            </View>
          ) : (
            availableJobs.map((job) => {
              const isSelected = selectedJobId === job.id;
              return (
                <Pressable
                  key={job.id}
                  style={[styles.jobCard, isSelected && styles.jobCardSelected]}
                  onPress={() => handleSelect(job.id)}
                  disabled={confirmed}
                >
                  {/* Job name + bonus */}
                  <View style={styles.jobHeader}>
                    <Text style={[styles.jobName, isSelected && styles.jobNameSelected]}>
                      {job.name}
                    </Text>
                    <Text style={styles.jobBonus}>
                      +{job.statBonus.value} {job.statBonus.stat}
                    </Text>
                  </View>

                  <Text style={styles.jobDesc}>{job.description}</Text>
                  <Text style={styles.jobFlavor}>{job.flavorText}</Text>

                  {/* Starter skill preview */}
                  <View style={styles.skillBox}>
                    <Text style={styles.skillLabel}>Starter Skill</Text>
                    <View style={styles.skillRow}>
                      <Text style={styles.skillIcon}>{job.starterSkill.icon}</Text>
                      <View style={styles.skillInfo}>
                        <Text style={styles.skillName}>{job.starterSkill.name}</Text>
                        <Text style={styles.skillDesc}>{job.starterSkill.description}</Text>
                        <Text style={styles.skillMeta}>
                          {job.starterSkill.spCost} SP · CD {job.starterSkill.cooldown}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>

        {/* Confirm button */}
        <View style={styles.footer}>
          {selectedJob && !confirmed && (
            <Text style={styles.selectedNote}>
              Selected: {selectedJob.name}
            </Text>
          )}
          {confirmed && (
            <Text style={styles.confirmedNote}>Path chosen. The Falna rewrites itself...</Text>
          )}
          <Pressable
            style={[
              styles.confirmButton,
              (!selectedJobId || confirmed) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedJobId || confirmed}
          >
            <Text style={styles.confirmButtonText}>
              {confirmed ? 'Awakening...' : 'Claim This Path'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: 80,
  },

  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  title: {
    ...Typography.h2,
    color: Colors.resource.gold,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  statPill: {
    alignItems: 'center',
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.text.accent,
  },
  statPillLabel: {
    ...Typography.h5,
    color: Colors.text.accent,
  },
  statPillName: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },

  sectionLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  list: {
    flex: 1,
  },
  listContent: {
    padding: Padding.screen.horizontal,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  noJobs: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  noJobsText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  noJobsHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  jobCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  jobCardSelected: {
    borderColor: Colors.resource.gold,
    backgroundColor: Colors.background.elevated,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  jobName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  jobNameSelected: {
    color: Colors.resource.gold,
  },
  jobBonus: {
    ...Typography.caption,
    color: Colors.ui.success,
    fontWeight: '700',
  },
  jobDesc: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  jobFlavor: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },

  skillBox: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.secondary,
  },
  skillLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  skillRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  skillIcon: {
    fontSize: 28,
    lineHeight: 34,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  skillDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  skillMeta: {
    ...Typography.caption,
    color: Colors.text.muted,
  },

  footer: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  selectedNote: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  confirmedNote: {
    ...Typography.bodySmall,
    color: Colors.resource.gold,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: Colors.resource.gold,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.background.tertiary,
  },
  confirmButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
});
