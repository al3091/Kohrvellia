/**
 * Guild Hall Screen
 * Achievement quest board, advisor NPC, and deity approval for level-up
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useGameStore } from '../../../src/stores/useGameStore';
import { useAchievementStore } from '../../../src/stores/useAchievementStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import type { AchievementProgress } from '../../../src/types/Achievement';
import { getAchievementById, getAchievementsForLevel } from '../../../src/data/achievements';
import { AchievementTracker } from '../../../src/components/achievement/AchievementTracker';

// ─── Advisor NPC ──────────────────────────────────────────────────────────────

const ADVISOR_NPC = {
  name: 'Eris Boreas',
  title: 'Guild Advisor',
  icon: '📜',
};

function getAdvisorGreeting(
  canLevel: boolean,
  deityApproved: boolean,
  completedCount: number
): string {
  if (canLevel) {
    return 'Remarkable. The gods themselves have taken notice. You are ready to advance — step forward and claim your title.';
  }
  if (deityApproved) {
    return 'Your deity smiles upon you. Now prove your deeds in the dungeon — complete a recorded feat, and your ascension awaits.';
  }
  if (completedCount > 0) {
    return `Well done — ${completedCount} feat${completedCount > 1 ? 's' : ''} on record. When your deity grants approval, you may advance.`;
  }
  return 'The dungeon tests all who enter. Accomplish something worth recording and I will inscribe it in the Great Record.';
}

// ─── Achievement card ──────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  standard: '#6B7280',    // gray
  challenging: '#3B82F6', // blue
  heroic: '#8B5CF6',      // purple
  legendary: '#F59E0B',   // amber/gold
  mythic: '#EF4444',      // red
};

const TIER_LABELS: Record<string, string> = {
  standard: 'STANDARD',
  challenging: 'CHALLENGING',
  heroic: 'HEROIC',
  legendary: 'LEGENDARY',
  mythic: 'MYTHIC',
};

interface AchievementCardProps {
  progress: AchievementProgress;
}

function AchievementCard({ progress }: AchievementCardProps) {
  const achievement = getAchievementById(progress.achievementId);
  const discoveryState = progress.discoveryState;

  // Hidden: show only a mystery placeholder
  if (discoveryState === 'hidden') {
    return (
      <View style={[styles.achievementCard, styles.achievementCardHidden]}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>🔒</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementIdHidden}>??? UNKNOWN ???</Text>
            <Text style={styles.achievementTierHidden}>UNDISCOVERED</Text>
          </View>
        </View>
        <Text style={styles.hiddenHint}>
          Something has been recorded here. Investigate to learn more.
        </Text>
      </View>
    );
  }

  // Rumored: show name dimmed + hint only, no progress
  if (discoveryState === 'rumored') {
    const tier = achievement?.tier ?? 'standard';
    const tierColor = TIER_COLORS[tier] ?? Colors.text.muted;
    const displayName = achievement?.name ?? progress.achievementId.replace(/_/g, ' ').toUpperCase();
    const hint = achievement?.hint ?? 'A great deed awaits...';

    return (
      <View style={[styles.achievementCard, styles.achievementCardRumored, { borderColor: tierColor + '25' }]}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>📜</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementIdRumored}>[RUMORED] {displayName}</Text>
            <Text style={[styles.achievementTier, { color: tierColor + '80' }]}>
              {TIER_LABELS[tier] ?? tier.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.rumoredHint}>{hint}</Text>
      </View>
    );
  }

  // Known / completed: full card
  const tier = achievement?.tier ?? 'standard';
  const tierColor = TIER_COLORS[tier] ?? Colors.text.muted;
  const totalReqs = progress.requirementProgress.length;
  const displayName = achievement?.name ?? progress.achievementId.replace(/_/g, ' ').toUpperCase();

  return (
    <View style={[styles.achievementCard, progress.isCompleted && styles.achievementCardDone, { borderColor: tierColor + '40' }]}>
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementIcon}>{progress.isCompleted ? '✅' : '🎯'}</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementId}>{displayName}</Text>
          <Text style={[styles.achievementTier, { color: tierColor }]}>
            {TIER_LABELS[tier] ?? tier.toUpperCase()}
          </Text>
        </View>
        {progress.isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>DONE</Text>
          </View>
        )}
      </View>

      {/* Progress bars */}
      {progress.requirementProgress.map((req, i) => (
        <View key={i} style={styles.reqRow}>
          <View style={styles.reqBarBg}>
            <View
              style={[
                styles.reqBarFill,
                req.completed && styles.reqBarFillDone,
                { width: `${Math.min(100, (req.current / Math.max(1, req.target)) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.reqText}>
            {req.current}/{req.target}
            {totalReqs > 1 && ` (${i + 1}/${totalReqs})`}
          </Text>
        </View>
      ))}

      {progress.isCompleted && !progress.usedForLevelUp && (
        <Text style={styles.readyHint}>Ready to use for level-up</Text>
      )}
    </View>
  );
}

// ─── Level-Up Panel ────────────────────────────────────────────────────────────

interface LevelUpPanelProps {
  canLevel: boolean;
  deityApproved: boolean;
  hasCompletedAchievement: boolean;
  primaryStatMet: boolean;
  onRequestApproval: () => void;
  onLevelUp: () => void;
}

function LevelUpPanel({
  canLevel,
  deityApproved,
  hasCompletedAchievement,
  primaryStatMet,
  onRequestApproval,
  onLevelUp,
}: LevelUpPanelProps) {
  const conditions = [
    { label: 'Primary stat at Grade A', met: primaryStatMet },
    { label: 'Feat recorded', met: hasCompletedAchievement },
    { label: 'Deity approval granted', met: deityApproved },
  ];

  return (
    <View style={styles.levelUpPanel}>
      <Text style={styles.levelUpTitle}>Ascension Requirements</Text>

      {conditions.map((c, i) => (
        <View key={i} style={styles.conditionRow}>
          <Text style={[styles.conditionIcon, c.met ? styles.conditionMet : styles.conditionUnmet]}>
            {c.met ? '✓' : '○'}
          </Text>
          <Text style={[styles.conditionLabel, c.met ? styles.conditionLabelMet : styles.conditionLabelUnmet]}>
            {c.label}
          </Text>
        </View>
      ))}

      {!deityApproved && hasCompletedAchievement && (
        <Pressable style={styles.approvalBtn} onPress={onRequestApproval}>
          <Text style={styles.approvalBtnText}>Submit Feat to Deity</Text>
        </Pressable>
      )}

      {canLevel && (
        <Pressable style={styles.levelUpBtn} onPress={onLevelUp}>
          <Text style={styles.levelUpBtnText}>ASCEND TO NEXT LEVEL</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function GuildHallScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, canLevelUp, setDeityApproval, performLevelUp } = useCharacterStore();
  const gameStore = useGameStore.getState();
  const achievementStore = useAchievementStore();

  const [confirmLevelUpVisible, setConfirmLevelUpVisible] = useState(false);

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

  // Target level is current level + 1
  const targetLevel = character.level + 1;

  // All achievement progress for the current target level, from the store
  const levelAchievements = getAchievementsForLevel(targetLevel);
  const allProgress: AchievementProgress[] = levelAchievements
    .map(a => achievementStore.getProgress(a.id))
    .filter((p): p is AchievementProgress => p !== undefined);

  const completed = allProgress.filter((a) => a.isCompleted);
  const inProgress = allProgress.filter((a) => !a.isCompleted && (a.discoveryState === 'known' || a.discoveryState === 'rumored'));
  const hidden = allProgress.filter((a) => a.discoveryState === 'hidden');
  const rumored = allProgress.filter((a) => a.discoveryState === 'rumored' && !a.isCompleted);
  const hasCompleted = completed.length > 0;
  const deityApproved = character.levelProgress.deityApproved;

  // Trigger guild discovery on first visit — advance all guild achievements to known
  React.useEffect(() => {
    achievementStore.discoverAllFromSource('guild');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isLevelUp = canLevelUp();

  const GRADE_ORDER = ['I','H','G','F','E','D','C','B','A','S','SS','SSS'];
  const highestGrade = Object.values(character.stats).reduce(
    (best, s) => GRADE_ORDER.indexOf(s.grade) > GRADE_ORDER.indexOf(best) ? s.grade : best,
    'I'
  );
  const primaryStatMet = ['A','S','SS','SSS'].includes(highestGrade);

  const greeting = useMemo(
    () => getAdvisorGreeting(isLevelUp, deityApproved, completed.length),
    [isLevelUp, deityApproved, completed.length]
  );

  const handleRequestApproval = () => {
    haptics.medium();
    Alert.alert(
      'Submit Feat to Deity',
      `Request ${character.patronDeityId ?? 'your deity'}'s blessing to ascend?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            setDeityApproval(true);
            haptics.success();
            Alert.alert('Approved', 'Your deity has blessed your ascension. You may now level up.');
          },
        },
      ]
    );
  };

  const handleLevelUp = () => {
    haptics.heavy();
    setConfirmLevelUpVisible(true);
  };

  const confirmLevel = () => {
    setConfirmLevelUpVisible(false);
    performLevelUp();
    haptics.success();
    Alert.alert(
      'Ascension Complete',
      `${character.name} has advanced to Level ${character.level + 1}. Your stats reset — the next chapter begins.`,
      [{ text: 'Continue', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => { haptics.light(); router.back(); }}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>GUILD HALL</Text>
          <View style={styles.headerRight}>
            <Text style={styles.floorLabel}>Floor</Text>
            <Text style={styles.floorValue}>{gameStore.bestFloorReached}</Text>
          </View>
        </View>

        {/* Advisor NPC */}
        <View style={styles.npcSection}>
          <View style={styles.npcHeader}>
            <Text style={styles.npcIcon}>{ADVISOR_NPC.icon}</Text>
            <View style={styles.npcInfo}>
              <Text style={styles.npcName}>{ADVISOR_NPC.name}</Text>
              <Text style={styles.npcTitle}>{ADVISOR_NPC.title}</Text>
            </View>
          </View>
          <View style={styles.dialogueBox}>
            <Text style={styles.dialogueText}>"{greeting}"</Text>
          </View>
        </View>

        {/* Achievement Tracker */}
        <View style={styles.trackerWrapper}>
          <AchievementTracker targetLevel={targetLevel} />
        </View>

        {/* Ascension Panel */}
        <LevelUpPanel
          canLevel={isLevelUp}
          deityApproved={deityApproved}
          hasCompletedAchievement={hasCompleted}
          primaryStatMet={primaryStatMet}
          onRequestApproval={handleRequestApproval}
          onLevelUp={handleLevelUp}
        />

        {/* Discovery Status Banner */}
        {hidden.length > 0 && (
          <View style={styles.discoveryBanner}>
            <Text style={styles.discoveryBannerText}>
              {hidden.length} feat{hidden.length > 1 ? 's' : ''} hidden at this level
            </Text>
            <Text style={styles.discoveryBannerHint}>
              Seek the arena, library, temple, and shrines to uncover more.
            </Text>
          </View>
        )}

        {/* Library Research — discover library-source achievements */}
        <Pressable
          style={styles.researchButton}
          onPress={() => {
            if ((character.gold ?? 0) < 100) {
              haptics.warning();
              Alert.alert('Insufficient Gold', 'Consulting the records costs 100G.');
              return;
            }
            haptics.medium();
            achievementStore.discoverAllFromSource('library');
            Alert.alert('Records Consulted', 'The guild scribes have shared what they know.');
          }}
        >
          <Text style={styles.researchButtonText}>Consult the Records (100G)</Text>
        </Pressable>

        {/* Completed Feats */}
        {completed.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recorded Feats ({completed.length})</Text>
            {completed.map((a) => (
              <AchievementCard key={a.achievementId} progress={a} />
            ))}
          </View>
        )}

        {/* In-Progress / Known */}
        {inProgress.filter(a => a.discoveryState === 'known').length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              In Progress ({inProgress.filter(a => a.discoveryState === 'known').length})
            </Text>
            {inProgress
              .filter(a => a.discoveryState === 'known')
              .map((a) => (
                <AchievementCard key={a.achievementId} progress={a} />
              ))}
          </View>
        )}

        {/* Rumored */}
        {rumored.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rumored ({rumored.length})</Text>
            {rumored.map((a) => (
              <AchievementCard key={a.achievementId} progress={a} />
            ))}
          </View>
        )}

        {/* Hidden */}
        {hidden.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unknown ({hidden.length})</Text>
            {hidden.map((a) => (
              <AchievementCard key={a.achievementId} progress={a} />
            ))}
          </View>
        )}

        {/* Empty state */}
        {allProgress.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗡️</Text>
            <Text style={styles.emptyTitle}>No Feats Recorded</Text>
            <Text style={styles.emptyText}>
              Enter the dungeon and accomplish something worth writing down.{'\n'}
              Defeat monsters, reach deep floors, and survive against the odds.
            </Text>
          </View>
        )}

        {/* Run Stats Summary */}
        <View style={styles.runStatsPanel}>
          <Text style={styles.runStatsTitle}>Current Expedition</Text>
          <View style={styles.runStatsGrid}>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatVal}>{character.runStats.monstersKilled}</Text>
              <Text style={styles.runStatLabel}>Monsters</Text>
            </View>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatVal}>{character.runStats.deepestFloor}</Text>
              <Text style={styles.runStatLabel}>Deepest</Text>
            </View>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatVal}>{character.runStats.goldEarned}</Text>
              <Text style={styles.runStatLabel}>Gold</Text>
            </View>
            <View style={styles.runStatItem}>
              <Text style={styles.runStatVal}>{character.runStats.floorsCleared}</Text>
              <Text style={styles.runStatLabel}>Floors</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Level-Up Confirm Modal */}
      <Modal visible={confirmLevelUpVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Ascension</Text>
            <Text style={styles.modalBody}>
              You are about to advance to Level {character.level + 1}.{'\n\n'}
              Your stat points will reset to Grade I. All progress carries forward as permanent bonuses that scale with future gains.{'\n\n'}
              This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => { haptics.light(); setConfirmLevelUpVisible(false); }}
              >
                <Text style={styles.modalCancelText}>Wait</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={confirmLevel}>
                <Text style={styles.modalConfirmText}>Ascend</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing['2xl'],
  },

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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.text.accent,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    letterSpacing: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  floorLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  floorValue: {
    ...Typography.h5,
    color: Colors.text.accent,
  },

  // NPC
  npcSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  npcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  npcIcon: {
    fontSize: 44,
    marginRight: Spacing.md,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  npcTitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  dialogueBox: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
  },
  dialogueText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },

  // Level-Up Panel
  levelUpPanel: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    gap: Spacing.sm,
  },
  levelUpTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  conditionIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  conditionMet: {
    color: Colors.text.accent,
  },
  conditionUnmet: {
    color: Colors.text.muted,
  },
  conditionLabel: {
    ...Typography.body,
  },
  conditionLabelMet: {
    color: Colors.text.primary,
  },
  conditionLabelUnmet: {
    color: Colors.text.muted,
  },
  approvalBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.text.accent,
  },
  approvalBtnText: {
    ...Typography.button,
    color: Colors.text.accent,
  },
  levelUpBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.resource.gold,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  levelUpBtnText: {
    ...Typography.button,
    color: Colors.background.primary,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  // Sections
  section: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  trackerWrapper: {
    marginBottom: Spacing.lg,
  },

  // Discovery Banner
  discoveryBanner: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.secondary,
    alignItems: 'center',
  },
  discoveryBannerText: {
    ...Typography.h6,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
  discoveryBannerHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },

  // Library research button
  researchButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.domain.knowledge + '60',
  },
  researchButtonText: {
    ...Typography.buttonSmall,
    color: Colors.domain.knowledge,
    letterSpacing: 1,
  },

  // Achievement Card
  achievementCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    gap: Spacing.sm,
  },
  achievementCardDone: {
    borderColor: Colors.text.accent + '60',
  },
  achievementCardHidden: {
    borderColor: Colors.border.primary,
    opacity: 0.6,
  },
  achievementCardRumored: {
    borderColor: Colors.border.primary,
    opacity: 0.75,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementId: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 11,
  },
  achievementTier: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  achievementIdHidden: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontWeight: '600',
    fontSize: 11,
    fontStyle: 'italic',
  },
  achievementTierHidden: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.muted,
    marginTop: 2,
  },
  achievementIdRumored: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontWeight: '600',
    fontSize: 11,
    fontStyle: 'italic',
  },
  hiddenHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    fontSize: 10,
  },
  rumoredHint: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    fontSize: 10,
  },
  completedBadge: {
    backgroundColor: Colors.text.accent + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  completedBadgeText: {
    ...Typography.caption,
    color: Colors.text.accent,
    fontSize: 10,
    fontWeight: 'bold',
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reqBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  reqBarFill: {
    height: '100%',
    backgroundColor: Colors.text.muted,
    borderRadius: BorderRadius.sm,
  },
  reqBarFillDone: {
    backgroundColor: Colors.text.accent,
  },
  reqText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    width: 52,
    textAlign: 'right',
  },
  readyHint: {
    ...Typography.caption,
    color: Colors.text.accent,
    fontSize: 10,
    fontStyle: 'italic',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    ...Typography.h5,
    color: Colors.text.muted,
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Run Stats
  runStatsPanel: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  runStatsTitle: {
    ...Typography.h6,
    color: Colors.text.accent,
    marginBottom: Spacing.md,
  },
  runStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  runStatItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  runStatVal: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  runStatLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalBox: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '60',
    gap: Spacing.md,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.resource.gold,
    textAlign: 'center',
    letterSpacing: 3,
  },
  modalBody: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  modalCancelText: {
    ...Typography.button,
    color: Colors.text.muted,
  },
  modalConfirm: {
    flex: 2,
    backgroundColor: Colors.resource.gold,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalConfirmText: {
    ...Typography.button,
    color: Colors.background.primary,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
