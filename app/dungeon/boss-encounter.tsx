/**
 * Boss Encounter Screen
 * Pre-fight sentient dialogue with milestone bosses.
 * The boss knows who you are. The conversation matters.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useCombatStore } from '../../src/stores/useCombatStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { DramaticReveal } from '../../src/components/text/DramaticReveal';
import { getMilestoneBoss } from '../../src/data/bosses/milestoneBosses';
import type { BossChoice } from '../../src/data/bosses/milestoneBosses';

type DialoguePhase = 'opening' | 'taunt' | 'choices' | 'reaction' | 'ready';

export default function BossEncounterScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const { bossSnapshot, getCurrentMap, startCombatWithMonster } = useDungeonStore();
  const { monster, prepareEncounter } = useCombatStore();
  const map = getCurrentMap();

  const [phase, setPhase] = useState<DialoguePhase>('opening');
  const [selectedChoice, setSelectedChoice] = useState<BossChoice | null>(null);

  const boss = map ? getMilestoneBoss(map.floorNumber) : null;
  const snapshot = bossSnapshot;

  useEffect(() => {
    useSoundStore.getState().crossfadeBGM('dungeon', 1500);
  }, []);

  if (!boss || !snapshot || !character || !map) {
    // Fallback: skip to normal room flow
    router.replace('/dungeon/room');
    return null;
  }

  const personalizedTaunt = boss.dialogue.personalizedTaunt(snapshot);

  const handleChoiceSelect = (choice: BossChoice) => {
    haptics.medium();
    setSelectedChoice(choice);
    setPhase('reaction');
  };

  const handleBeginCombat = () => {
    haptics.heavy();

    // Apply pre-combat effect from dialogue choice
    if (selectedChoice?.combatEffect) {
      const effect = selectedChoice.combatEffect;
      if (effect.type === 'dodge_boost' && effect.value) {
        // Applied via a temporary combat dynamic state boost — handled in combat.tsx
        useDungeonStore.getState().setRunFlag(`boss_dodge_boost_${effect.value}`);
      } else if (effect.type === 'damage_bonus' && effect.value) {
        useDungeonStore.getState().setRunFlag(`boss_damage_bonus_${effect.value}`);
      } else if (effect.type === 'first_attack_guaranteed') {
        useDungeonStore.getState().setRunFlag('boss_first_attack');
      }
    }

    // Start combat with the pre-generated monster
    if (monster) {
      startCombatWithMonster(monster);
      router.replace('/dungeon/combat');
    } else {
      // Fallback: generate encounter
      prepareEncounter(map.floorNumber, true, false);
      router.replace('/dungeon/encounter');
    }
  };

  const combatOpenerText = selectedChoice
    ? boss.dialogue.combatOpener(snapshot, selectedChoice.id)
    : `"Then we begin."`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Boss Header */}
        <View style={styles.bossHeader}>
          <Text style={styles.bossEmoji}>{boss.appearanceEmoji}</Text>
          <Text style={styles.bossName}>{boss.name}</Text>
          <Text style={styles.bossEpithet}>{boss.epithet}</Text>
          <Text style={styles.bossPantheon}>{boss.pantheon}</Text>
        </View>

        {/* Boss Appearance */}
        <DramaticReveal delay={300} duration={600}>
          <Text style={styles.appearanceText}>{boss.appearance}</Text>
        </DramaticReveal>

        {/* Mechanic Hint */}
        <DramaticReveal delay={800} duration={500}>
          <View style={styles.mechanicHint}>
            <Text style={styles.mechanicName}>{boss.mechanic.name}</Text>
            <Text style={styles.mechanicHintText}>{boss.mechanic.hint}</Text>
          </View>
        </DramaticReveal>

        {/* Opening */}
        {(phase === 'opening' || phase === 'taunt' || phase === 'choices' || phase === 'reaction' || phase === 'ready') && (
          <DramaticReveal delay={1200} duration={600} direction="up">
            <View style={styles.speechBubble}>
              <Text style={styles.bossNameLabel}>{boss.name}:</Text>
              <Text style={styles.speechText}>{boss.dialogue.opening}</Text>
            </View>
            {phase === 'opening' && (
              <Pressable
                style={styles.continueButton}
                onPress={() => { haptics.light(); setPhase('taunt'); }}
              >
                <Text style={styles.continueButtonText}>Continue...</Text>
              </Pressable>
            )}
          </DramaticReveal>
        )}

        {/* Personalized Taunt */}
        {(phase === 'taunt' || phase === 'choices' || phase === 'reaction' || phase === 'ready') && (
          <DramaticReveal delay={200} duration={600} direction="up">
            <View style={[styles.speechBubble, styles.tauntBubble]}>
              <Text style={styles.bossNameLabel}>{boss.name}:</Text>
              <Text style={styles.tauntText}>{personalizedTaunt}</Text>
            </View>
            {phase === 'taunt' && (
              <Pressable
                style={styles.continueButton}
                onPress={() => { haptics.light(); setPhase('choices'); }}
              >
                <Text style={styles.continueButtonText}>Respond...</Text>
              </Pressable>
            )}
          </DramaticReveal>
        )}

        {/* Player Response Choices */}
        {(phase === 'choices') && (
          <DramaticReveal delay={0} duration={400}>
            <View style={styles.choicesContainer}>
              <Text style={styles.choicesLabel}>Your response:</Text>
              {boss.dialogue.choices.map((choice) => (
                <Pressable
                  key={choice.id}
                  style={styles.choiceButton}
                  onPress={() => handleChoiceSelect(choice)}
                >
                  <Text style={styles.choiceLabel}>{choice.label}</Text>
                  <Text style={styles.choiceDescription}>{choice.description}</Text>
                  {choice.combatEffect.type !== 'none' && choice.combatEffect.description && (
                    <Text style={styles.choiceEffect}>{choice.combatEffect.description}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </DramaticReveal>
        )}

        {/* Boss Reaction */}
        {(phase === 'reaction' || phase === 'ready') && selectedChoice && (
          <DramaticReveal delay={0} duration={500} direction="up">
            <View style={[styles.speechBubble, styles.reactionBubble]}>
              <Text style={styles.bossNameLabel}>{boss.name}:</Text>
              <Text style={styles.reactionText}>{selectedChoice.bossReaction}</Text>
            </View>
            {phase === 'reaction' && (
              <Pressable
                style={styles.continueButton}
                onPress={() => { haptics.medium(); setPhase('ready'); }}
              >
                <Text style={styles.continueButtonText}>Prepare yourself...</Text>
              </Pressable>
            )}
          </DramaticReveal>
        )}

        {/* Combat Opener + Begin Button */}
        {phase === 'ready' && (
          <DramaticReveal delay={0} duration={600} direction="scale" haptic hapticStyle="heavy">
            <View style={[styles.speechBubble, styles.openerBubble]}>
              <Text style={styles.bossNameLabel}>{boss.name}:</Text>
              <Text style={styles.openerText}>{combatOpenerText}</Text>
            </View>
            <Pressable style={styles.beginButton} onPress={handleBeginCombat}>
              <Text style={styles.beginButtonText}>FACE {boss.name.toUpperCase()}</Text>
            </Pressable>
          </DramaticReveal>
        )}
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
    padding: Padding.lg,
    paddingBottom: 60,
  },
  bossHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  bossEmoji: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  bossName: {
    ...Typography.h2,
    color: '#8B0000',
    letterSpacing: 4,
    textAlign: 'center',
  },
  bossEpithet: {
    ...Typography.body,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  bossPantheon: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.6,
  },
  appearanceText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  mechanicHint: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: '#8B0000',
    borderRadius: BorderRadius.sm,
    padding: Padding.md,
    marginBottom: Spacing.xl,
  },
  mechanicName: {
    ...Typography.label,
    color: '#8B0000',
    letterSpacing: 2,
    marginBottom: 4,
  },
  mechanicHintText: {
    ...Typography.caption,
    color: Colors.text.muted,
    lineHeight: 18,
  },
  speechBubble: {
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    marginBottom: Spacing.md,
  },
  tauntBubble: {
    borderColor: '#8B0000',
  },
  reactionBubble: {
    borderColor: Colors.resource.gold,
  },
  openerBubble: {
    borderColor: '#8B0000',
    borderWidth: BorderWidth.medium,
  },
  bossNameLabel: {
    ...Typography.label,
    color: '#8B0000',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  speechText: {
    ...Typography.body,
    color: Colors.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tauntText: {
    ...Typography.body,
    color: Colors.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  reactionText: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  openerText: {
    ...Typography.body,
    color: Colors.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  continueButton: {
    alignSelf: 'flex-end',
    padding: Padding.sm,
    marginBottom: Spacing.md,
  },
  continueButtonText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  choicesContainer: {
    marginBottom: Spacing.lg,
  },
  choicesLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  choiceButton: {
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.sm,
    padding: Padding.md,
    marginBottom: Spacing.sm,
  },
  choiceLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  choiceDescription: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  choiceEffect: {
    ...Typography.caption,
    color: Colors.resource.gold,
    marginTop: 4,
  },
  beginButton: {
    backgroundColor: '#8B0000',
    borderRadius: BorderRadius.md,
    padding: Padding.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  beginButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
    letterSpacing: 3,
    fontSize: 14,
  },
});
