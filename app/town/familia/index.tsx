/**
 * Familia Home Screen
 * Rest, heal, and receive the Blessing Rite from your deity
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useDeityStore, FAVOR_STATUS } from '../../../src/stores/useDeityStore';
import { useHaptics } from '../../../src/hooks/useHaptics';

// Deity greetings based on personality
const DEITY_GREETINGS: Record<string, string[]> = {
  encouraging: [
    'Welcome back, child. Rest here, you are safe.',
    'You have returned. Come, let me see how you have grown.',
    'My champion returns. I am pleased.',
  ],
  stern: [
    'You return. Good. There is much work to be done.',
    'Back already? I hope you bring results.',
    'Enter. Tell me of your progress.',
  ],
  mysterious: [
    'The threads of fate have guided you home...',
    'I sensed your approach. The patterns shift around you.',
    'You return... as was foretold.',
  ],
  playful: [
    'Oh! You are back! Did you miss me?',
    'There you are! I was getting bored watching from above.',
    'My favorite adventurer returns! Tell me everything!',
  ],
  wrathful: [
    'You dare return without victory?',
    'Hmph. At least you survived.',
    'Back again. Do not waste my time.',
  ],
  serene: [
    'Peace be with you, child.',
    'Welcome home. Rest your weary spirit.',
    'The journey continues. Rest now.',
  ],
  chaotic: [
    'Ha! You live! How... unexpected!',
    'Back so soon? Or is this late? Time is strange...',
    'Oh, it is you! I was just planning something fun!',
  ],
};

// Domain-specific icons
const DOMAIN_ICONS: Record<string, string> = {
  war: '⚔️',
  magic: '✨',
  trickery: '🎭',
  death: '💀',
  fortune: '🎲',
  nature: '🌿',
  wisdom: '📚',
  craft: '🔨',
  authority: '👑',
  life: '💖',
  sea: '🌊',
  sky: '⛈️',
  fire: '🔥',
  knowledge: '📖',
};

type ChallengeResultKind = 'completed' | 'abandoned';

interface ChallengeResultState {
  kind: ChallengeResultKind;
  challengeName: string;
  favorDelta: number;
}

export default function FamiliaHomeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const [isResting, setIsResting] = useState(false);
  const [challengeResult, setChallengeResult] = useState<ChallengeResultState | null>(null);

  const { character, hasPendingExcelia, getPendingExcelia, modifyHP, modifySP, getDerivedStatsWithBlessings } = useCharacterStore();
  const {
    getPatronDeity,
    getFavorStatus,
    relationship,
    setPatronDeity: initializeDeityRelationship,
    getAvailableChallenges,
    hasActiveChallenge,
    issueChallenge,
    abandonChallenge,
  } = useDeityStore();

  // Fallback: If deity relationship isn't initialized, try to initialize from character
  React.useEffect(() => {
    if (!relationship && character?.patronDeityId) {
      initializeDeityRelationship(character.patronDeityId);
    }
  }, [relationship, character?.patronDeityId]);

  const deity = getPatronDeity();
  const favorStatus = getFavorStatus();
  const pendingExcelia = hasPendingExcelia();
  const pending = getPendingExcelia();
  const derivedStats = getDerivedStatsWithBlessings();

  // Challenge section — only show when no active challenge and one is available
  const currentFavor = relationship?.favor ?? 0;
  const activeChallenge = hasActiveChallenge();
  const availableChallenges = (!activeChallenge && deity && currentFavor >= 30)
    ? getAvailableChallenges()
    : [];
  const proposedChallenge = availableChallenges[0] ?? null;
  const activeChallengeData = relationship?.currentChallenge ?? null;

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No character found</Text>
          <Pressable style={styles.errorButton} onPress={() => router.replace('/')}>
            <Text style={styles.errorButtonText}>Return to Title</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getGreeting = () => {
    if (!deity) return 'Welcome home.';
    const greetings = DEITY_GREETINGS[deity.personality] || DEITY_GREETINGS.serene;
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleRest = () => {
    haptics.medium();
    setIsResting(true);

    // Heal to full
    const hpToHeal = derivedStats.maxHP - character.currentHP;
    const spToHeal = derivedStats.maxSP - character.currentSP;

    modifyHP(hpToHeal);
    modifySP(spToHeal);

    setTimeout(() => {
      setIsResting(false);
      Alert.alert(
        'Rest Complete',
        'You feel refreshed. HP and SP have been fully restored.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleBlessingRite = () => {
    haptics.success();
    router.push('/town/familia/blessing-rite');
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const handleAcceptChallenge = () => {
    if (!proposedChallenge) return;
    haptics.success();
    issueChallenge(proposedChallenge.id, proposedChallenge.requirement.timeLimit ?? 5);
  };

  const handleDeclineChallenge = () => {
    haptics.light();
    // Declining does not penalise — just dismiss by doing nothing (proposal will re-appear next visit)
  };

  const handleAbandonChallenge = () => {
    if (!activeChallengeData || !deity) return;
    const challenge = deity.challenges.find((c) => c.id === activeChallengeData.challengeId);
    haptics.warning();
    Alert.alert(
      'Abandon Challenge',
      `Abandoning "${challenge?.name ?? 'this challenge'}" will cost ${challenge?.favorLoss ?? 10} favor. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: () => {
            const favorBefore = relationship?.favor ?? 0;
            abandonChallenge();
            const favorAfter = useDeityStore.getState().relationship?.favor ?? 0;
            setChallengeResult({
              kind: 'abandoned',
              challengeName: challenge?.name ?? 'Challenge',
              favorDelta: favorAfter - favorBefore,
            });
          },
        },
      ]
    );
  };

  // Calculate total pending excelia for display
  const totalPendingExcelia = pending
    ? Object.values(pending.stats).reduce((sum, v) => sum + v, 0)
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button */}
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>&lt; Town</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FAMILIA HOME</Text>
          {deity && (
            <Text style={styles.headerSubtitle}>{deity.name}'s Residence</Text>
          )}
        </View>

        {/* Deity Section */}
        <View style={styles.deitySection}>
          <View style={styles.deityPortrait}>
            <Text style={styles.deityIcon}>
              {deity ? DOMAIN_ICONS[deity.domain] || '🌟' : '🌟'}
            </Text>
          </View>

          {deity ? (
            <>
              <Text style={styles.deityName}>{deity.name}</Text>
              <Text style={styles.deityTitle}>{deity.title}</Text>
              <View style={styles.favorContainer}>
                <Text style={styles.favorLabel}>
                  {FAVOR_STATUS[favorStatus]?.label || 'Accepted'}
                </Text>
                <View style={styles.favorBarBg}>
                  <View
                    style={[
                      styles.favorBarFill,
                      { width: `${relationship?.favor || 50}%` },
                    ]}
                  />
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.deityName}>Your Patron Deity</Text>
          )}

          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>"{getGreeting()}"</Text>
          </View>
        </View>

        {/* Pending Excelia / Blessing Rite */}
        {pendingExcelia && (
          <View style={styles.blessingSection}>
            <View style={styles.blessingSectionHeader}>
              <Text style={styles.blessingSectionIcon}>✨</Text>
              <Text style={styles.blessingSectionTitle}>BLESSING RITE AVAILABLE</Text>
            </View>

            <Text style={styles.blessingText}>
              "I sense growth within you... Come, let me see your back."
            </Text>

            {pending && (
              <View style={styles.pendingSummary}>
                <Text style={styles.pendingSummaryTitle}>Run Summary</Text>
                <View style={styles.pendingStats}>
                  <View style={styles.pendingStat}>
                    <Text style={styles.pendingStatLabel}>Floors</Text>
                    <Text style={styles.pendingStatValue}>{pending.floorReached}</Text>
                  </View>
                  <View style={styles.pendingStat}>
                    <Text style={styles.pendingStatLabel}>Monsters</Text>
                    <Text style={styles.pendingStatValue}>{pending.monstersKilled}</Text>
                  </View>
                  <View style={styles.pendingStat}>
                    <Text style={styles.pendingStatLabel}>Growth</Text>
                    <Text style={styles.pendingStatValueGold}>+{totalPendingExcelia}</Text>
                  </View>
                </View>
              </View>
            )}

            <Pressable style={styles.blessingButton} onPress={handleBlessingRite}>
              <Text style={styles.blessingButtonText}>RECEIVE BLESSING</Text>
            </Pressable>
          </View>
        )}

        {/* No Pending Excelia */}
        {!pendingExcelia && (
          <View style={styles.noBlessingSection}>
            <Text style={styles.noBlessingText}>
              "Your Falna shows no new growth. Venture forth and return when you have proven yourself."
            </Text>
          </View>
        )}

        {/* Active Challenge Status */}
        {activeChallenge && activeChallengeData && deity && (() => {
          const activeCh = deity.challenges.find((c) => c.id === activeChallengeData.challengeId);
          if (!activeCh) return null;
          return (
            <View style={styles.activeChallengeSection}>
              <View style={styles.challengeSectionHeader}>
                <Text style={styles.challengeSectionIcon}>⚡</Text>
                <Text style={styles.challengeSectionTitle}>ACTIVE CHALLENGE</Text>
                <View style={[styles.tierBadge, styles[`tier_${activeCh.tier}` as keyof typeof styles] as ViewStyle]}>
                  <Text style={styles.tierBadgeText}>{activeCh.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.challengeName}>{activeCh.name}</Text>
              <Text style={styles.challengeDesc}>{activeCh.description}</Text>
              <View style={styles.challengeProgressRow}>
                <Text style={styles.challengeProgressLabel}>Progress</Text>
                <Text style={styles.challengeProgressValue}>
                  {activeChallengeData.progress} / {activeCh.requirement.value}
                </Text>
              </View>
              {activeChallengeData.floorsRemaining !== undefined && (
                <View style={styles.challengeProgressRow}>
                  <Text style={styles.challengeProgressLabel}>Floors Remaining</Text>
                  <Text style={[
                    styles.challengeProgressValue,
                    activeChallengeData.floorsRemaining <= 1 && styles.challengeProgressDanger,
                  ]}>
                    {activeChallengeData.floorsRemaining}
                  </Text>
                </View>
              )}
              <Pressable style={styles.abandonButton} onPress={handleAbandonChallenge}>
                <Text style={styles.abandonButtonText}>Abandon Challenge</Text>
              </Pressable>
            </View>
          );
        })()}

        {/* Challenge Proposal */}
        {!activeChallenge && proposedChallenge && (
          <View style={styles.challengeProposalSection}>
            <View style={styles.challengeSectionHeader}>
              <Text style={styles.challengeSectionIcon}>🏆</Text>
              <Text style={styles.challengeSectionTitle}>CHALLENGE AVAILABLE</Text>
              <View style={[styles.tierBadge, styles[`tier_${proposedChallenge.tier}` as keyof typeof styles] as ViewStyle]}>
                <Text style={styles.tierBadgeText}>{proposedChallenge.tier.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.challengeName}>{proposedChallenge.name}</Text>
            <Text style={styles.challengeDesc}>{proposedChallenge.description}</Text>
            <Text style={styles.challengeRequirement}>
              Task: {proposedChallenge.requirement.type === 'kill_bosses'
                ? `Kill ${proposedChallenge.requirement.value} boss${proposedChallenge.requirement.value > 1 ? 'es' : ''}`
                : proposedChallenge.requirement.type === 'kill_elites'
                ? `Kill ${proposedChallenge.requirement.value} elite${proposedChallenge.requirement.value > 1 ? 's' : ''}`
                : `${proposedChallenge.requirement.type.replace(/_/g, ' ')}: ${proposedChallenge.requirement.value}`}
              {proposedChallenge.requirement.timeLimit !== undefined
                ? ` within ${proposedChallenge.requirement.timeLimit} floors`
                : ''}
            </Text>
            <View style={styles.challengeRewardRow}>
              <Text style={styles.challengeRewardLabel}>Reward:</Text>
              <Text style={styles.challengeRewardValue}>
                +{proposedChallenge.favorGain} favor
                {proposedChallenge.bonusStatPoints ? `, +${proposedChallenge.bonusStatPoints} stat point${proposedChallenge.bonusStatPoints > 1 ? 's' : ''}` : ''}
              </Text>
            </View>
            <View style={styles.challengeButtons}>
              <Pressable style={styles.acceptButton} onPress={handleAcceptChallenge}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.declineButton} onPress={handleDeclineChallenge}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Challenge Result Notification */}
        {challengeResult && (
          <View style={[
            styles.challengeResultBanner,
            challengeResult.kind === 'completed'
              ? styles.challengeResultSuccess
              : styles.challengeResultFailure,
          ]}>
            <Text style={styles.challengeResultTitle}>
              {challengeResult.kind === 'completed' ? 'Challenge Complete!' : 'Challenge Abandoned'}
            </Text>
            <Text style={styles.challengeResultText}>
              {challengeResult.challengeName} — {challengeResult.favorDelta >= 0 ? '+' : ''}{challengeResult.favorDelta} favor
            </Text>
            <Pressable onPress={() => setChallengeResult(null)}>
              <Text style={styles.challengeResultDismiss}>Dismiss</Text>
            </Pressable>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>

          {/* Rest */}
          <Pressable
            style={[styles.actionCard, isResting && styles.actionCardDisabled]}
            onPress={handleRest}
            disabled={isResting || (character.currentHP >= derivedStats.maxHP && character.currentSP >= derivedStats.maxSP)}
          >
            <Text style={styles.actionIcon}>🛏️</Text>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Rest & Heal</Text>
              <Text style={styles.actionDesc}>
                {isResting
                  ? 'Resting...'
                  : character.currentHP >= derivedStats.maxHP && character.currentSP >= derivedStats.maxSP
                  ? 'Already at full health'
                  : 'Restore HP and SP to full (Free)'}
              </Text>
            </View>
            {character.currentHP < derivedStats.maxHP || character.currentSP < derivedStats.maxSP ? (
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>FREE</Text>
              </View>
            ) : null}
          </Pressable>

          {/* Talk to Deity (placeholder) */}
          <Pressable
            style={[styles.actionCard, styles.actionCardDisabled]}
            disabled
          >
            <Text style={styles.actionIcon}>💬</Text>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, styles.actionTitleDisabled]}>Talk to Deity</Text>
              <Text style={styles.actionDescDisabled}>Coming soon...</Text>
            </View>
          </Pressable>
        </View>

        {/* Character Status */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>HP</Text>
              <View style={styles.statusBarBg}>
                <View
                  style={[
                    styles.statusBarFill,
                    styles.hpBarFill,
                    { width: `${(character.currentHP / derivedStats.maxHP) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.statusValue}>
                {character.currentHP}/{derivedStats.maxHP}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>SP</Text>
              <View style={styles.statusBarBg}>
                <View
                  style={[
                    styles.statusBarFill,
                    styles.spBarFill,
                    { width: `${(character.currentSP / derivedStats.maxSP) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.statusValue}>
                {character.currentSP}/{derivedStats.maxSP}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginBottom: Spacing.xl,
  },
  errorButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  errorButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.muted,
  },

  // Back button
  backButton: {
    paddingVertical: Spacing.md,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.text.accent,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },

  // Deity Section
  deitySection: {
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  deityPortrait: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.resource.gold + '60',
  },
  deityIcon: {
    fontSize: 48,
  },
  deityName: {
    ...Typography.h3,
    color: Colors.resource.gold,
    marginBottom: Spacing.xs,
  },
  deityTitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  favorContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  favorLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  favorBarBg: {
    width: '80%',
    height: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  favorBarFill: {
    height: '100%',
    backgroundColor: Colors.resource.gold,
    borderRadius: BorderRadius.sm,
  },
  greetingBox: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
  },
  greetingText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Blessing Section
  blessingSection: {
    backgroundColor: Colors.resource.gold + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.resource.gold + '40',
  },
  blessingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  blessingSectionIcon: {
    fontSize: 24,
  },
  blessingSectionTitle: {
    ...Typography.h5,
    color: Colors.resource.gold,
    letterSpacing: 1,
  },
  blessingText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  pendingSummary: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pendingSummaryTitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  pendingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pendingStat: {
    alignItems: 'center',
  },
  pendingStatLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  pendingStatValue: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  pendingStatValueGold: {
    ...Typography.h5,
    color: Colors.resource.gold,
  },
  blessingButton: {
    backgroundColor: Colors.resource.gold,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  blessingButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
    letterSpacing: 1,
  },

  // No Blessing Section
  noBlessingSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  noBlessingText: {
    ...Typography.body,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Actions Section
  actionsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  actionCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  actionCardDisabled: {
    opacity: 0.5,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  actionTitleDisabled: {
    color: Colors.text.muted,
  },
  actionDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  actionDescDisabled: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  actionBadge: {
    backgroundColor: Colors.ui.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  actionBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },

  // Status Section
  statusSection: {
    marginBottom: Spacing.lg,
  },
  statusCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    width: 24,
    fontWeight: '600',
  },
  statusBarBg: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  statusBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  hpBarFill: {
    backgroundColor: Colors.resource.hp,
  },
  spBarFill: {
    backgroundColor: Colors.resource.sp,
  },
  statusValue: {
    ...Typography.caption,
    color: Colors.text.secondary,
    width: 60,
    textAlign: 'right',
  },

  // Challenge Proposal Section
  challengeProposalSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.resource.gold + '50',
  },

  // Active Challenge Section
  activeChallengeSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.ui.info + '60',
  },

  challengeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  challengeSectionIcon: {
    fontSize: 20,
  },
  challengeSectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    letterSpacing: 1,
    flex: 1,
  },

  // Tier badges
  tierBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tierBadgeText: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  tier_challenging: {
    backgroundColor: Colors.ui.warning,
  },
  tier_heroic: {
    backgroundColor: Colors.ui.error,
  },
  tier_legendary: {
    backgroundColor: Colors.danger.deadly,
  },

  challengeName: {
    ...Typography.h6,
    color: Colors.resource.gold,
    marginBottom: Spacing.xs,
  },
  challengeDesc: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  challengeRequirement: {
    ...Typography.caption,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  challengeRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  challengeRewardLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  challengeRewardValue: {
    ...Typography.caption,
    color: Colors.ui.success,
    fontWeight: '600',
  },
  challengeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.resource.gold,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  acceptButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
    fontWeight: 'bold',
  },
  declineButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  declineButtonText: {
    ...Typography.button,
    color: Colors.text.muted,
  },

  // Active challenge progress rows
  challengeProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  challengeProgressLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  challengeProgressValue: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  challengeProgressDanger: {
    color: Colors.ui.error,
  },
  abandonButton: {
    marginTop: Spacing.md,
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.error + '80',
  },
  abandonButtonText: {
    ...Typography.caption,
    color: Colors.ui.error,
  },

  // Challenge result banner
  challengeResultBanner: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  challengeResultSuccess: {
    backgroundColor: Colors.ui.success + '20',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.success + '60',
  },
  challengeResultFailure: {
    backgroundColor: Colors.ui.error + '20',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.error + '60',
  },
  challengeResultTitle: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  challengeResultText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  challengeResultDismiss: {
    ...Typography.caption,
    color: Colors.text.accent,
    marginTop: Spacing.xs,
  },
});
