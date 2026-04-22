/**
 * Level Up Ceremony Screen
 * Shows completed achievements, allows selection, and processes level-up
 * With dramatic ceremony animations and deity approval
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { ACHIEVEMENT_TIER_REWARDS, type AchievementTier } from '../../src/types/Achievement';
import {
  ConfettiBurst,
  DeityApproval,
  LevelReveal,
  GlowRing,
} from '../../src/components/ceremony/CeremonyEffects';

// Ceremony phases
type CeremonyPhase = 'intro' | 'selection' | 'approval' | 'complete';

// Deity approval messages based on achievement tiers
const DEITY_MESSAGES = {
  standard: [
    "A humble beginning, but every journey starts with a single step.",
    "Adequate progress. Continue to strive.",
    "You show promise. Do not disappoint me.",
  ],
  challenging: [
    "You have exceeded expectations. Well done.",
    "Your dedication is commendable.",
    "I see greatness stirring within you.",
  ],
  heroic: [
    "Impressive! You bring honor to my name.",
    "Your deeds echo through the halls of legend.",
    "Few mortals achieve what you have done.",
  ],
  legendary: [
    "MAGNIFICENT! You are worthy of my blessing!",
    "The heavens themselves take notice of your achievements!",
    "You stand among the greatest of my children!",
  ],
  mythic: [
    "IMPOSSIBLE! You have transcended mortal limits!",
    "Even the gods speak your name with reverence!",
    "A NEW LEGEND IS BORN THIS DAY!",
  ],
};

// Tier colors
const TIER_COLORS: Record<AchievementTier, string> = {
  standard: Colors.text.secondary,
  challenging: Colors.ui.success,
  heroic: Colors.domain.knowledge,
  legendary: Colors.domain.authority,
  mythic: Colors.resource.gold,
};

const TIER_ICONS: Record<AchievementTier, string> = {
  standard: '',
  challenging: '*',
  heroic: '**',
  legendary: '***',
  mythic: '****',
};

export default function LevelUpScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { playSFX } = useSoundStore();

  const { character, performLevelUp } = useCharacterStore();
  const {
    isInCeremony,
    ceremonyLevel,
    availableForLevelUp,
    selectedForLevelUp,
    startLevelUpCeremony,
    selectAchievement,
    deselectAchievement,
    completeLevelUp,
    cancelCeremony,
    getAchievement,
    getProgress,
  } = useAchievementStore();

  // Ceremony state
  const [phase, setPhase] = useState<CeremonyPhase>('intro');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelReveal, setShowLevelReveal] = useState(false);
  const [showDeityApproval, setShowDeityApproval] = useState(false);
  const [deityMessage, setDeityMessage] = useState('');

  // Entrance animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Start ceremony if not already started
  useEffect(() => {
    if (!isInCeremony && character) {
      startLevelUpCeremony(character.level + 1);
    }
  }, [isInCeremony, character, startLevelUpCeremony]);

  // Intro animation sequence
  useEffect(() => {
    if (isInCeremony && phase === 'intro') {
      playSFX('level_up');
      haptics.success();

      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Show level reveal after delay
      setTimeout(() => {
        setShowLevelReveal(true);
        haptics.heavy();
      }, 500);

      // Transition to selection phase
      setTimeout(() => {
        setPhase('selection');
      }, 2000);
    }
  }, [isInCeremony, phase]);

  // Calculate rewards preview
  const rewardsPreview = useMemo(() => {
    let bonusPoints = 0;
    let gloryPoints = 0;
    const titles: string[] = [];

    for (const achievementId of selectedForLevelUp) {
      const achievement = getAchievement(achievementId);
      if (!achievement) continue;

      const tierRewards = ACHIEVEMENT_TIER_REWARDS[achievement.tier];
      bonusPoints += tierRewards.bonusStatPoints;
      gloryPoints += tierRewards.gloryPoints;

      if (tierRewards.titleModifier) {
        titles.push(tierRewards.titleModifier);
      }
    }

    // Apply stacking bonuses
    if (selectedForLevelUp.length >= 2) {
      bonusPoints = Math.floor(bonusPoints * 1.25);
    }
    if (selectedForLevelUp.length >= 3) {
      bonusPoints = Math.floor(bonusPoints * 1.2);
    }

    return { bonusPoints, gloryPoints, titles };
  }, [selectedForLevelUp, getAchievement]);

  // Handle achievement toggle
  const handleToggleAchievement = (achievementId: string) => {
    haptics.light();
    if (selectedForLevelUp.includes(achievementId)) {
      deselectAchievement(achievementId);
    } else {
      selectAchievement(achievementId);
    }
  };

  // Get highest tier from selected achievements
  const getHighestTier = useCallback((): AchievementTier => {
    const tierOrder: AchievementTier[] = ['standard', 'challenging', 'heroic', 'legendary', 'mythic'];
    let highest: AchievementTier = 'standard';

    for (const achievementId of selectedForLevelUp) {
      const achievement = getAchievement(achievementId);
      if (achievement) {
        const currentIndex = tierOrder.indexOf(achievement.tier);
        const highestIndex = tierOrder.indexOf(highest);
        if (currentIndex > highestIndex) {
          highest = achievement.tier;
        }
      }
    }
    return highest;
  }, [selectedForLevelUp, getAchievement]);

  // Handle confirm level up
  const handleConfirmLevelUp = () => {
    if (selectedForLevelUp.length === 0) return;

    haptics.success();
    playSFX('achievement');

    // Get appropriate deity message based on highest tier
    const highestTier = getHighestTier();
    const messages = DEITY_MESSAGES[highestTier];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setDeityMessage(randomMessage);

    // Start approval phase
    setPhase('approval');
    setShowDeityApproval(true);

    // After deity approval, show confetti and complete
    setTimeout(() => {
      setShowConfetti(true);
      haptics.heavy();
      playSFX('victory');
    }, 2500);

    // Complete the level up after celebration
    setTimeout(() => {
      setPhase('complete');
      completeLevelUp();
      performLevelUp();

      // Navigate back after a moment
      setTimeout(() => {
        router.back();
      }, 1500);
    }, 4000);
  };

  // Handle cancel
  const handleCancel = () => {
    haptics.light();
    cancelCeremony();
    router.back();
  };

  if (!character || !isInCeremony) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing ceremony...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get deity name (placeholder until deity store is implemented)
  // TODO: Get from useDeityStore when implemented
  const deityName = (character as any).deity?.name || 'Your Patron Deity';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Confetti Effect */}
      <ConfettiBurst active={showConfetti} particleCount={40} duration={3000} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>
          {phase === 'complete' ? 'Level Up Complete!' : 'Level Up Ceremony'}
        </Text>
        {phase !== 'complete' && (
          <Text style={styles.headerSubtitle}>
            Level {character.level} {'→'} Level {ceremonyLevel}
          </Text>
        )}
      </Animated.View>

      {/* Level Reveal (Intro Phase) */}
      {(phase === 'intro' || phase === 'approval' || phase === 'complete') && (
        <View style={styles.levelRevealWrapper}>
          <LevelReveal level={ceremonyLevel} active={showLevelReveal} />
        </View>
      )}

      {/* Deity Approval (Approval Phase) */}
      {phase === 'approval' && (
        <DeityApproval
          deityName={deityName}
          message={deityMessage}
          visible={showDeityApproval}
        />
      )}

      {/* Level transition display (Selection Phase) */}
      {phase === 'selection' && (
        <Animated.View
          style={[
            styles.levelTransition,
            { opacity: fadeAnim },
          ]}
        >
          <View style={styles.levelBox}>
            <Text style={styles.levelLabel}>Current</Text>
            <Text style={styles.levelNumber}>{character.level}</Text>
          </View>
          <Text style={styles.levelArrow}>{'→'}</Text>
          <View style={[styles.levelBox, styles.levelBoxNew]}>
            <GlowRing active={true} size={80} />
            <Text style={styles.levelLabel}>New</Text>
            <Text style={styles.levelNumberNew}>{ceremonyLevel}</Text>
          </View>
        </Animated.View>
      )}

      {/* Selection Phase Content */}
      {phase === 'selection' && (
        <>
          {/* Instructions */}
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              Select up to 3 achievements to present to {deityName}.
              Higher tier achievements grant more bonus stat points.
            </Text>
          </View>

          {/* Achievement list */}
          <ScrollView style={styles.achievementList} contentContainerStyle={styles.achievementListContent}>
        {availableForLevelUp.length === 0 ? (
          <View style={styles.noAchievements}>
            <Text style={styles.noAchievementsText}>
              No completed achievements available.
            </Text>
            <Text style={styles.noAchievementsHint}>
              Complete achievements to unlock level-up options.
            </Text>
          </View>
        ) : (
          availableForLevelUp.map((achievementId) => {
            const achievement = getAchievement(achievementId);
            const progress = getProgress(achievementId);
            if (!achievement || !progress) return null;

            const isSelected = selectedForLevelUp.includes(achievementId);
            const tierRewards = ACHIEVEMENT_TIER_REWARDS[achievement.tier];

            return (
              <Pressable
                key={achievementId}
                style={[
                  styles.achievementCard,
                  isSelected && styles.achievementCardSelected,
                  { borderLeftColor: TIER_COLORS[achievement.tier] },
                ]}
                onPress={() => handleToggleAchievement(achievementId)}
              >
                <View style={styles.achievementHeader}>
                  <View style={styles.checkBox}>
                    {isSelected && <Text style={styles.checkMark}>//</Text>}
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text
                      style={[
                        styles.achievementName,
                        { color: TIER_COLORS[achievement.tier] },
                      ]}
                    >
                      {achievement.name} {TIER_ICONS[achievement.tier]}
                    </Text>
                    <Text style={styles.achievementDesc}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.achievementRewards}>
                  <Text style={styles.achievementTier}>
                    {achievement.tier.toUpperCase()}
                  </Text>
                  {tierRewards.bonusStatPoints > 0 && (
                    <Text style={styles.achievementBonus}>
                      +{tierRewards.bonusStatPoints} stats
                    </Text>
                  )}
                  {tierRewards.gloryPoints > 0 && (
                    <Text style={styles.achievementGlory}>
                      +{tierRewards.gloryPoints} GLORY
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Rewards preview */}
      {selectedForLevelUp.length > 0 && (
        <View style={styles.rewardsPreview}>
          <Text style={styles.rewardsTitle}>
            Rewards ({selectedForLevelUp.length}/3 selected)
          </Text>
          <View style={styles.rewardsRow}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardValue}>+{rewardsPreview.bonusPoints}</Text>
              <Text style={styles.rewardLabel}>Stat Points</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={[styles.rewardValue, { color: Colors.resource.gold }]}>
                +{rewardsPreview.gloryPoints}
              </Text>
              <Text style={styles.rewardLabel}>GLORY</Text>
            </View>
          </View>
          {rewardsPreview.titles.length > 0 && (
            <Text style={styles.rewardTitles}>
              Title: {rewardsPreview.titles[rewardsPreview.titles.length - 1]}
            </Text>
          )}
          {selectedForLevelUp.length >= 2 && (
            <Text style={styles.stackingBonus}>
              Stacking Bonus: x{selectedForLevelUp.length >= 3 ? '1.5' : '1.25'}
            </Text>
          )}
        </View>
      )}

          {/* Action buttons */}
          <View style={styles.actionContainer}>
            <Pressable
              style={[
                styles.confirmButton,
                selectedForLevelUp.length === 0 && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmLevelUp}
              disabled={selectedForLevelUp.length === 0}
            >
              <Text style={styles.confirmButtonText}>
                Present to {deityName}
              </Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Complete Phase - Show summary */}
      {phase === 'complete' && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeText}>
            Your Falna has been updated!
          </Text>
          {rewardsPreview.bonusPoints > 0 && (
            <Text style={styles.completeReward}>
              +{rewardsPreview.bonusPoints} Bonus Stat Points
            </Text>
          )}
          {rewardsPreview.gloryPoints > 0 && (
            <Text style={styles.completeGlory}>
              +{rewardsPreview.gloryPoints} GLORY
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text.muted,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.resource.gold,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },

  // Level transition
  levelTransition: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.lg,
  },
  levelBox: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  levelBoxNew: {
    borderColor: Colors.resource.gold,
    backgroundColor: Colors.resource.gold + '10',
  },
  levelLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  levelNumber: {
    ...Typography.h1,
    color: Colors.text.primary,
  },
  levelNumberNew: {
    ...Typography.h1,
    color: Colors.resource.gold,
  },
  levelArrow: {
    ...Typography.h3,
    color: Colors.text.muted,
  },

  // Instructions
  instructionBox: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Padding.screen.horizontal,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  instructionText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Achievement list
  achievementList: {
    flex: 1,
  },
  achievementListContent: {
    padding: Padding.screen.horizontal,
    gap: Spacing.sm,
  },
  noAchievements: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  noAchievementsText: {
    ...Typography.body,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  noAchievementsHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },

  // Achievement card
  achievementCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderLeftWidth: 4,
  },
  achievementCardSelected: {
    backgroundColor: Colors.background.tertiary,
    borderColor: Colors.resource.gold,
  },
  achievementHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: Colors.ui.success,
    fontWeight: '700',
    fontSize: 14,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    ...Typography.h6,
    marginBottom: 2,
  },
  achievementDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  achievementRewards: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  achievementTier: {
    ...Typography.label,
    color: Colors.text.muted,
    marginRight: 'auto',
  },
  achievementBonus: {
    ...Typography.caption,
    color: Colors.ui.success,
    fontWeight: '600',
  },
  achievementGlory: {
    ...Typography.caption,
    color: Colors.resource.gold,
    fontWeight: '600',
  },

  // Rewards preview
  rewardsPreview: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Padding.screen.horizontal,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold,
  },
  rewardsTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.sm,
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardValue: {
    ...Typography.h4,
    color: Colors.ui.success,
  },
  rewardLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  rewardTitles: {
    ...Typography.bodySmall,
    color: Colors.domain.authority,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stackingBonus: {
    ...Typography.caption,
    color: Colors.text.accent,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Action buttons
  actionContainer: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
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
  cancelButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.text.muted,
  },

  // Level reveal wrapper
  levelRevealWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },

  // Complete phase
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  completeText: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  completeReward: {
    ...Typography.h5,
    color: Colors.ui.success,
    marginBottom: Spacing.sm,
  },
  completeGlory: {
    ...Typography.h5,
    color: Colors.resource.gold,
  },
});
