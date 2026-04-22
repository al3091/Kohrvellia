/**
 * Travel Screen - Ramification Display
 * Shows consequences of moving between nodes (Buried Bornes style)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { getNodeIcon, getNodeDisplayName } from '../../src/types/Dungeon';
import {
  getRamificationSeverity,
  formatRamificationEffect,
} from '../../src/data/ramifications';
import type { Ramification } from '../../src/types/Dungeon';

export default function TravelScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, modifyHP, modifySP, modifyGold, removeFromInventory } = useCharacterStore();
  const effectsApplied = useRef(false);
  const {
    currentRun,
    getCurrentMap,
    getCurrentNode,
    lastRamifications,
    clearRamifications,
  } = useDungeonStore();

  const map = getCurrentMap();
  const currentNode = getCurrentNode();

  // Apply ramification effects when this screen loads
  useEffect(() => {
    if (!lastRamifications || !character || effectsApplied.current) return;

    // Mark as applied to prevent double application
    effectsApplied.current = true;

    // Apply effects
    for (const ram of lastRamifications.ramifications) {
      applyRamificationEffect(ram);
    }

    // Haptic feedback based on severity
    if (lastRamifications.totalHPLost > 20) {
      haptics.heavy();
    } else if (lastRamifications.ramifications.length > 0) {
      haptics.medium();
    }
  }, [lastRamifications, character]);

  const applyRamificationEffect = (ram: Ramification) => {
    const { effect } = ram;

    switch (effect.type) {
      case 'hp':
        if (effect.value) {
          modifyHP(effect.value); // modifyHP handles both positive and negative
        }
        break;
      case 'sp':
        if (effect.value) {
          modifySP(effect.value);
        }
        break;
      case 'gold':
        if (effect.value) {
          modifyGold(effect.value);
        }
        break;
      case 'ration':
        if (effect.value && effect.value < 0) {
          // Remove rations from inventory
          removeFromInventory('ration', Math.abs(effect.value));
        }
        break;
      // Status effects, buffs, and combat triggers would be handled elsewhere
    }
  };

  const handleContinue = () => {
    haptics.light();
    clearRamifications();

    // Go back to floor map or directly to room based on node completion
    if (currentNode && !currentNode.isCompleted && currentNode.type !== 'start') {
      router.replace('/dungeon/room');
    } else {
      router.replace('/dungeon/floor');
    }
  };

  if (!map || !currentRun || !character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading travel data</Text>
          <Pressable style={styles.returnButton} onPress={() => router.replace('/dungeon/floor')}>
            <Text style={styles.returnButtonText}>Return to Map</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const ramifications = lastRamifications?.ramifications ?? [];
  const hasRamifications = ramifications.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TRAVELING...</Text>
        <Text style={styles.stepInfo}>
          Step {map.stepsTaken}/{map.totalSteps}
        </Text>
      </View>

      {/* Destination Info */}
      {currentNode && (
        <View style={styles.destinationContainer}>
          <Text style={styles.destinationLabel}>Arriving at:</Text>
          <View style={styles.destinationNode}>
            <Text style={styles.destinationIcon}>{getNodeIcon(currentNode.type)}</Text>
            <Text style={styles.destinationName}>{getNodeDisplayName(currentNode.type)}</Text>
          </View>
        </View>
      )}

      {/* Ramifications List */}
      <ScrollView style={styles.ramificationsContainer} contentContainerStyle={styles.ramificationsContent}>
        {hasRamifications ? (
          <>
            <Text style={styles.ramificationsTitle}>
              {ramifications.some(r => r.isBlessing) ? 'FORTUNE SMILES...' : 'THE DUNGEON STIRS...'}
            </Text>

            {ramifications.map((ram, index) => {
              const severity = getRamificationSeverity(ram);
              const severityColors = {
                safe: Colors.text.muted,
                warning: Colors.ui.warning,
                danger: Colors.ui.error,
                blessing: Colors.ui.success,
              };
              const color = severityColors[severity];
              const icon = ram.isBlessing ? '+' : '!';

              return (
                <View
                  key={`${ram.id}-${index}`}
                  style={[
                    styles.ramificationCard,
                    ram.isBlessing ? styles.ramificationBlessing : styles.ramificationNegative,
                  ]}
                >
                  <View style={styles.ramificationHeader}>
                    <Text style={[styles.ramificationIcon, { color }]}>{icon}</Text>
                    <Text style={[styles.ramificationName, { color }]}>{ram.name}</Text>
                  </View>
                  <Text style={styles.ramificationDescription}>{ram.description}</Text>
                  <Text style={[styles.ramificationEffect, { color }]}>
                    {formatRamificationEffect(ram)}
                  </Text>
                </View>
              );
            })}
          </>
        ) : (
          <View style={styles.safePassageContainer}>
            <Text style={styles.safePassageIcon}>-</Text>
            <Text style={styles.safePassageTitle}>Safe Passage</Text>
            <Text style={styles.safePassageDescription}>
              The way ahead is clear. No ill fortune befalls you.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Summary */}
      {hasRamifications && lastRamifications && (
        <View style={styles.summaryContainer}>
          {lastRamifications.totalHPLost > 0 && (
            <Text style={styles.summaryLoss}>-{lastRamifications.totalHPLost} HP</Text>
          )}
          {lastRamifications.totalSPLost > 0 && (
            <Text style={styles.summaryLoss}>-{lastRamifications.totalSPLost} SP</Text>
          )}
          {lastRamifications.totalGoldLost > 0 && (
            <Text style={styles.summaryLoss}>-{lastRamifications.totalGoldLost} Gold</Text>
          )}
          {lastRamifications.rationsLost > 0 && (
            <Text style={styles.summaryLoss}>-{lastRamifications.rationsLost} Ration</Text>
          )}
          {lastRamifications.wasBlessed && (
            <Text style={styles.summaryBlessing}>Blessed!</Text>
          )}
        </View>
      )}

      {/* Updated Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>HP:</Text>
          <View style={styles.statusBarOuter}>
            <View
              style={[
                styles.statusBarInner,
                styles.hpBar,
                { width: `${Math.max(0, (character.currentHP / character.maxHP) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.statusValue}>
            {Math.max(0, character.currentHP)}/{character.maxHP}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>SP:</Text>
          <View style={styles.statusBarOuter}>
            <View
              style={[
                styles.statusBarInner,
                styles.spBar,
                { width: `${Math.max(0, (character.currentSP / character.maxSP) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.statusValue}>
            {Math.max(0, character.currentSP)}/{character.maxSP}
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.actionContainer}>
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>
            {currentNode && !currentNode.isCompleted && currentNode.type !== 'start'
              ? `Enter ${getNodeDisplayName(currentNode.type)}`
              : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
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
  returnButton: {
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  returnButtonText: {
    ...Typography.button,
    color: Colors.text.primary,
  },
  header: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.accent,
    letterSpacing: 2,
  },
  stepInfo: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  destinationContainer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  destinationLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  destinationNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  destinationIcon: {
    fontSize: 28,
  },
  destinationName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  ramificationsContainer: {
    flex: 1,
  },
  ramificationsContent: {
    padding: Padding.screen.horizontal,
    paddingTop: Spacing.lg,
  },
  ramificationsTitle: {
    ...Typography.h5,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  ramificationCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  ramificationNegative: {
    borderLeftColor: Colors.ui.warning,
  },
  ramificationBlessing: {
    borderLeftColor: Colors.ui.success,
  },
  ramificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  ramificationIcon: {
    ...Typography.h4,
    fontWeight: 'bold',
  },
  ramificationName: {
    ...Typography.h5,
    fontWeight: 'bold',
  },
  ramificationDescription: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  ramificationEffect: {
    ...Typography.caption,
    fontWeight: 'bold',
  },
  safePassageContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  safePassageIcon: {
    ...Typography.h1,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  safePassageTitle: {
    ...Typography.h4,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  safePassageDescription: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Padding.screen.horizontal,
    backgroundColor: Colors.background.tertiary,
  },
  summaryLoss: {
    ...Typography.caption,
    color: Colors.ui.error,
    fontWeight: 'bold',
  },
  summaryBlessing: {
    ...Typography.caption,
    color: Colors.ui.success,
    fontWeight: 'bold',
  },
  statusContainer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    gap: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    width: 30,
  },
  statusBarOuter: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.background.primary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  statusBarInner: {
    height: '100%',
    borderRadius: 6,
  },
  hpBar: {
    backgroundColor: Colors.resource.hp,
  },
  spBar: {
    backgroundColor: Colors.resource.sp,
  },
  statusValue: {
    ...Typography.caption,
    color: Colors.text.secondary,
    width: 60,
    textAlign: 'right',
  },
  actionContainer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  continueButton: {
    backgroundColor: Colors.text.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  continueButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },
});
