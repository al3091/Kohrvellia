/**
 * Stat Allocation Screen
 * Step 4 of character creation: Allocate starting stat points
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { Button, Header, ProgressIndicator } from '../../src/components/ui';
import { StatRow } from '../../src/components/ui/StatRow';
import {
  useCreationState,
  STARTING_POINTS,
  MAX_PER_STAT,
  MIN_PER_STAT,
} from '../../src/hooks/useCreationState';
import { useHaptics } from '../../src/hooks/useHaptics';
import { BACKSTORIES } from '../../src/types/Character';
import { getDeityById } from '../../src/data/pantheons';
import { STAT_INFO } from '../../src/types/Stats';
import type { StatName } from '../../src/types/Stats';

const STAT_ORDER: StatName[] = ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'WIS', 'LCK'];

const STEP_LABELS = ['Name', 'Origin', 'Deity', 'Stats', 'Weapon', 'Confirm'];

export default function StatAllocationScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const [selectedStatInfo, setSelectedStatInfo] = useState<StatName | null>(null);
  const {
    backstoryId,
    selectedDeityId,
    statAllocations,
    remainingPoints,
    allocateStat,
    resetAllocations,
  } = useCreationState();

  // Get backstory info for bonuses
  const backstory = useMemo(() => {
    if (!backstoryId) return null;
    return BACKSTORIES[backstoryId];
  }, [backstoryId]);

  // Get deity info for bonus/penalty preview
  const deity = useMemo(() => {
    if (!selectedDeityId) return null;
    return getDeityById(selectedDeityId);
  }, [selectedDeityId]);

  // Calculate bonuses for each stat
  const getStatBonuses = (stat: StatName) => {
    const bonuses: { source: 'backstory' | 'deity'; value: number }[] = [];

    // Backstory bonus
    if (backstory?.statBonus.stat === stat) {
      bonuses.push({ source: 'backstory', value: backstory.statBonus.value });
    }

    // Deity bonus (preview only - applied on confirm)
    if (deity?.statBonus.stat === stat) {
      bonuses.push({ source: 'deity', value: deity.statBonus.value });
    }

    return bonuses;
  };

  // Get penalty for stat (from deity)
  const getStatPenalty = (stat: StatName) => {
    if (deity?.statPenalty.stat === stat) {
      return { source: 'deity' as const, value: -deity.statPenalty.value };
    }
    return undefined;
  };

  const handleIncrement = (stat: StatName) => {
    allocateStat(stat, 1);
  };

  const handleDecrement = (stat: StatName) => {
    allocateStat(stat, -1);
  };

  const handleStatInfo = (stat: StatName) => {
    setSelectedStatInfo(stat);
  };

  const handleCloseStatInfo = () => {
    setSelectedStatInfo(null);
  };

  const handleReset = () => {
    haptics.medium();
    resetAllocations();
  };

  const handleContinue = () => {
    haptics.success();
    router.push('/character-creation/equipment');
  };

  const handleBack = () => {
    router.back();
  };

  const canContinue = remainingPoints === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Allocate Stats"
        subtitle="Distribute your starting points"
        showBack
        onBack={handleBack}
      />

      <ProgressIndicator
        currentStep={4}
        totalSteps={6}
        labels={STEP_LABELS}
      />

      {/* Points remaining indicator */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsLabel}>POINTS REMAINING</Text>
        <Text style={[
          styles.pointsValue,
          remainingPoints === 0 && styles.pointsComplete,
        ]}>
          {remainingPoints}
        </Text>
        <Text style={styles.pointsTotal}>/ {STARTING_POINTS}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {STAT_ORDER.map((stat) => (
          <StatRow
            key={stat}
            stat={stat}
            allocated={statAllocations[stat]}
            bonuses={getStatBonuses(stat)}
            penalty={getStatPenalty(stat)}
            onIncrement={() => handleIncrement(stat)}
            onDecrement={() => handleDecrement(stat)}
            onInfoPress={() => handleStatInfo(stat)}
            canIncrement={remainingPoints > 0 && statAllocations[stat] < MAX_PER_STAT}
            canDecrement={statAllocations[stat] > MIN_PER_STAT}
          />
        ))}

      </ScrollView>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <Button
          label="Reset"
          variant="secondary"
          onPress={handleReset}
          style={styles.resetButton}
          hapticStyle="medium"
        />
        <Button
          label={canContinue ? 'Continue' : `${remainingPoints} pts left`}
          onPress={handleContinue}
          disabled={!canContinue}
          style={styles.continueButton}
          hapticStyle="success"
        />
      </View>

      {/* Stat Info Modal */}
      <Modal
        visible={!!selectedStatInfo}
        animationType="fade"
        transparent
        onRequestClose={handleCloseStatInfo}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseStatInfo}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {selectedStatInfo && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalStatAbbrev, { color: Colors.grade.I }]}>
                    {selectedStatInfo}
                  </Text>
                  <Text style={styles.modalStatName}>
                    {STAT_INFO[selectedStatInfo].fullName}
                  </Text>
                </View>

                <Text style={styles.modalDescription}>
                  {STAT_INFO[selectedStatInfo].description}
                </Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>GROWS FROM</Text>
                  <Text style={styles.modalSectionText}>
                    {STAT_INFO[selectedStatInfo].growthMethod}
                  </Text>
                </View>

                <Button
                  label="Got it"
                  onPress={handleCloseStatInfo}
                  style={styles.modalButton}
                  hapticStyle="light"
                />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Padding.screen.horizontal,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  pointsLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    marginRight: Spacing.md,
  },
  pointsValue: {
    ...Typography.h2,
    color: Colors.text.accent,
  },
  pointsComplete: {
    color: Colors.ui.success,
  },
  pointsTotal: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginLeft: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
    backgroundColor: Colors.background.primary,
  },
  resetButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Padding.screen.horizontal,
  },
  modalContent: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 340,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  modalStatAbbrev: {
    ...Typography.h2,
  },
  modalStatName: {
    ...Typography.h5,
    color: Colors.text.secondary,
  },
  modalDescription: {
    ...Typography.body,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  modalSection: {
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  modalSectionTitle: {
    ...Typography.label,
    color: Colors.text.accent,
    marginBottom: Spacing.xs,
  },
  modalSectionText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: Spacing.sm,
  },
});
