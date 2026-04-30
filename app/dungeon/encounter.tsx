/**
 * Encounter Screen
 * Pre-combat screen with enemy preview and sneak option
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useCombatStore } from '../../src/stores/useCombatStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useGameStore } from '../../src/stores/useGameStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { EnemyPreview } from '../../src/components/combat/EnemyPreview';
import { SneakRollAnimation, type SneakResult } from '../../src/components/combat/SneakRollAnimation';
import { DramaticReveal } from '../../src/components/text/DramaticReveal';
import { CeremonialDivider } from '../../src/components/ui/CeremonialDivider';

type EncounterPhase = 'preview' | 'sneaking' | 'sneak_result';

export default function EncounterScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { playSFX } = useSoundStore();

  const { monster, startCombatWithMonster, setSneakPenalty } = useCombatStore();
  const { character, initializePendingExcelia } = useCharacterStore();
  const { currentRun } = useDungeonStore();
  const monsterKnowledge = useGameStore(s => monster ? s.monsterKnowledge[monster.base.id] : undefined);

  const [phase, setPhase] = useState<EncounterPhase>('preview');
  const [sneakRoll, setSneakRoll] = useState(0);
  const [sneakModifier, setSneakModifier] = useState(0);
  const [sneakDC, setSneakDC] = useState(10);

  // Calculate sneak chance based on AGI
  const sneakChance = useMemo(() => {
    if (!character || !monster) return 0;

    const agiPoints = character.stats.AGI.points;
    const modifier = Math.floor(agiPoints / 50); // ~1 per 50 AGI points

    // DC = 10 + (CR × 2) + (floor ÷ 5)
    const floor = currentRun?.currentFloor || 1;
    const dc = 10 + (monster.finalCR * 2) + Math.floor(floor / 5);

    // Chance = (20 + modifier - dc) / 20 * 100, clamped
    const chance = ((20 + modifier - dc) / 20) * 100;
    return Math.max(5, Math.min(95, chance));
  }, [character, monster, currentRun]);

  if (!monster || !character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No encounter active</Text>
          <Pressable style={styles.errorButton} onPress={() => router.replace('/dungeon/floor')}>
            <Text style={styles.errorButtonText}>Return</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleAttack = () => {
    haptics.heavy();
    playSFX('attack');

    // Initialize pending excelia for the run
    initializePendingExcelia();

    // Start combat normally
    startCombatWithMonster(monster);
    router.replace('/dungeon/combat');
  };

  const handleSneak = () => {
    haptics.medium();

    // Calculate the roll
    const agiPoints = character.stats.AGI.points;
    const modifier = Math.floor(agiPoints / 50);
    const floor = currentRun?.currentFloor || 1;
    const dc = 10 + (monster.finalCR * 2) + Math.floor(floor / 5);
    const roll = Math.floor(Math.random() * 20) + 1;

    setSneakRoll(roll);
    setSneakModifier(modifier);
    setSneakDC(dc);
    setPhase('sneaking');
  };

  const handleSneakResult = (result: SneakResult) => {
    if (result === 'success') {
      // Successfully escaped
      haptics.success();
      playSFX('victory');
      router.back();
    } else {
      // Failed - start combat with penalty
      haptics.error();
      playSFX('attack');

      // Initialize pending excelia
      initializePendingExcelia();

      // Start combat with the pre-generated monster
      startCombatWithMonster(monster);

      // Set the sneak penalty (must be after starting combat)
      setSneakPenalty(result);

      router.replace('/dungeon/combat');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {phase === 'preview' && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <DramaticReveal delay={0} duration={400}>
              <Text style={styles.headerTitle}>ENCOUNTER</Text>
            </DramaticReveal>
          </View>

          {/* Enemy Preview */}
          <View style={styles.previewContainer}>
            <DramaticReveal delay={200} duration={500} direction="scale">
              <EnemyPreview
                monster={monster}
                observed={false}
                sneakChance={sneakChance}
                knowledge={monsterKnowledge}
              />
            </DramaticReveal>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <CeremonialDivider variant="fade" spacing="md" />

            <DramaticReveal delay={600} duration={400}>
              <Text style={styles.promptText}>
                A hostile creature blocks your path.
              </Text>
            </DramaticReveal>

            <DramaticReveal delay={800} duration={400}>
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.actionButton, styles.attackButton]}
                  onPress={handleAttack}
                >
                  <Text style={styles.attackButtonIcon}>⚔️</Text>
                  <Text style={styles.attackButtonText}>ATTACK</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.sneakButton]}
                  onPress={handleSneak}
                >
                  <Text style={styles.sneakButtonIcon}>🤫</Text>
                  <View style={styles.sneakButtonContent}>
                    <Text style={styles.sneakButtonText}>SNEAK AWAY</Text>
                    <Text style={styles.sneakChanceText}>
                      {Math.round(sneakChance)}% chance
                    </Text>
                  </View>
                </Pressable>
              </View>
            </DramaticReveal>
          </View>
        </>
      )}

      {phase === 'sneaking' && (
        <View style={styles.sneakingContainer}>
          <SneakRollAnimation
            roll={sneakRoll}
            modifier={sneakModifier}
            dc={sneakDC}
            onComplete={handleSneakResult}
          />
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

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h5,
    color: Colors.text.muted,
    marginBottom: Spacing.lg,
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
    ...Typography.button,
    color: Colors.text.muted,
  },

  // Header
  header: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  headerTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 4,
  },

  // Preview
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Padding.screen.horizontal,
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  promptText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  attackButton: {
    backgroundColor: Colors.ui.error,
  },
  attackButtonIcon: {
    fontSize: 28,
  },
  attackButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
    letterSpacing: 3,
    flex: 1,
    textAlign: 'center',
  },
  sneakButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  sneakButtonIcon: {
    fontSize: 28,
  },
  sneakButtonContent: {
    flex: 1,
    alignItems: 'center',
  },
  sneakButtonText: {
    ...Typography.button,
    color: Colors.text.secondary,
    letterSpacing: 2,
  },
  sneakChanceText: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },

  // Sneaking
  sneakingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
