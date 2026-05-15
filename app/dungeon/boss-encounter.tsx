/**
 * Boss Encounter Screen — 3-Exchange Conversation System
 *
 * Each boss is a sentient character. Before combat, the player has
 * a real conversation — 3 exchanges of back-and-forth dialogue.
 * The right choices unlock secret outcomes:
 * - bypass (CHA): walk past without fighting
 * - loot_cache (LCK): find hidden treasure before the fight
 * - weakness_revealed (WIS/INT): boss tells you how to beat them
 * - fight (always available): the default
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useCombatStore } from '../../src/stores/useCombatStore';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { DramaticReveal } from '../../src/components/text/DramaticReveal';
import {
  getMilestoneBoss,
  type ChoiceTag,
  type BossOutcome,
} from '../../src/data/bosses/milestoneBosses';

type ConvPhase = 'exchange1' | 'exchange2' | 'exchange3' | 'outcome_select' | 'outcome_resolved';

export default function BossEncounterScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, addToInventory, modifyGold } = useCharacterStore();
  const { bossSnapshot, getCurrentMap, completeNode, getCurrentNode, setRunFlag } = useDungeonStore();
  const { monster, startCombatWithMonster } = useCombatStore();
  const map = getCurrentMap();

  const [phase, setPhase] = useState<ConvPhase>('exchange1');
  const [choice1, setChoice1] = useState<ChoiceTag | null>(null);
  const [choice2, setChoice2] = useState<ChoiceTag | null>(null);
  const [availableOutcomes, setAvailableOutcomes] = useState<BossOutcome[]>([]);
  const [resolvedOutcome, setResolvedOutcome] = useState<BossOutcome | null>(null);

  const boss = map ? getMilestoneBoss(map.floorNumber) : null;
  const snapshot = bossSnapshot;

  if (!boss || !snapshot || !character || !map) {
    router.replace('/dungeon/room');
    return null;
  }

  const tags1 = choice1?.tags ?? [];
  const tags2 = choice2?.tags ?? [];
  const allTags = [...tags1, ...tags2];

  // ── Exchange 1 ──

  const exchange1Choices = boss.conversation.exchange1.getChoices(snapshot);

  const handleChoice1 = (choice: ChoiceTag) => {
    // Check stat requirement
    if (choice.statRequirement) {
      const pts = snapshot.statPoints[choice.statRequirement.stat] ?? 0;
      if (pts < choice.statRequirement.minPoints) {
        Alert.alert(
          `Insufficient ${choice.statRequirement.stat}`,
          `This option requires ${choice.statRequirement.minPoints} ${choice.statRequirement.stat} points. You have ${pts}.`
        );
        return;
      }
    }
    haptics.medium();
    setChoice1(choice);
    setPhase('exchange2');
  };

  // ── Exchange 2 ──

  const exchange2BossText = choice1
    ? boss.conversation.exchange2.getBossText(choice1.id, snapshot)
    : '';
  const exchange2Choices = choice1
    ? boss.conversation.exchange2.getChoices(choice1.id, snapshot)
    : [];

  const handleChoice2 = (choice: ChoiceTag) => {
    if (choice.statRequirement) {
      const pts = snapshot.statPoints[choice.statRequirement.stat] ?? 0;
      if (pts < choice.statRequirement.minPoints) {
        Alert.alert(
          `Insufficient ${choice.statRequirement.stat}`,
          `This option requires ${choice.statRequirement.minPoints} ${choice.statRequirement.stat} points. You have ${pts}.`
        );
        return;
      }
    }
    haptics.medium();
    setChoice2(choice);

    // Compute available outcomes
    const c1id = choice1?.id ?? '';
    const c2id = choice.id;
    const rawOutcomes = boss.conversation.exchange3.getOutcomes(c1id, c2id, snapshot);

    // Filter: outcome is available if required tags are present AND stat check passes AND probability check passes
    const currentTags = [...(choice1?.tags ?? []), ...choice.tags];
    const filtered = rawOutcomes.filter(o => {
      if (o.id === 'fight') return true; // Always show fight
      const hasAllTags = o.unlockConditions.requiredTags.every(t => currentTags.includes(t));
      if (!hasAllTags) return false;
      if (o.unlockConditions.statCheck) {
        const pts = snapshot.statPoints[o.unlockConditions.statCheck.stat] ?? 0;
        if (pts < o.unlockConditions.statCheck.minPoints) return false;
      }
      if (o.unlockConditions.probability !== undefined) {
        // Roll the dice now
        if (Math.random() > o.unlockConditions.probability) return false;
      }
      return true;
    });

    setAvailableOutcomes(filtered.length > 0 ? filtered : [rawOutcomes.find(o => o.id === 'fight')!]);
    setPhase('exchange3');
  };

  // ── Exchange 3 ──

  const exchange3BossText = (choice1 && choice2)
    ? boss.conversation.exchange3.getBossText(choice1.id, choice2.id, snapshot)
    : '';

  // ── Outcome Resolution ──

  const handleOutcomeSelect = (outcome: BossOutcome) => {
    haptics.heavy();
    setResolvedOutcome(outcome);
    setPhase('outcome_resolved');
  };

  const executeOutcome = () => {
    if (!resolvedOutcome) return;

    switch (resolvedOutcome.id) {
      case 'bypass': {
        // No combat — mark node complete, grant achievement, navigate back
        if (resolvedOutcome.achievement) {
          useAchievementStore.getState().updateProgress('boss_bypass', 1);
        }
        useDungeonStore.getState().setRunFlag('boss_bypassed');
        const node = getCurrentNode();
        if (node) completeNode(node.id);
        haptics.success();
        router.back();
        break;
      }

      case 'loot_cache': {
        // Grant pre-fight loot, then proceed to combat
        if (resolvedOutcome.lootReward) {
          modifyGold(resolvedOutcome.lootReward.gold);
        }
        if (resolvedOutcome.achievement) {
          useAchievementStore.getState().updateProgress('boss_cache', 1);
        }
        setRunFlag(`loot_cache_granted_${boss.id}`);
        startCombatAndGo();
        break;
      }

      case 'weakness_revealed': {
        // Flag the weakness, then proceed to combat
        if (resolvedOutcome.achievement) {
          useAchievementStore.getState().updateProgress('boss_weakness', 1);
        }
        setRunFlag(`weakness_revealed_${boss.id}`);
        if (resolvedOutcome.combatEffect?.type === 'weakness_exposed') {
          setRunFlag(`boss_mechanic_hint`);
        }
        startCombatAndGo();
        break;
      }

      case 'fight':
      default:
        startCombatAndGo();
        break;
    }
  };

  const startCombatAndGo = () => {
    if (monster) {
      startCombatWithMonster(monster);
      router.replace('/dungeon/combat');
    } else {
      router.replace('/dungeon/room');
    }
  };

  // ── Render ──

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Boss Header */}
        <View style={styles.bossHeader}>
          <Text style={styles.bossEmoji}>{boss.appearanceEmoji}</Text>
          <Text style={styles.bossName}>{boss.name}</Text>
          <Text style={styles.bossEpithet}>{boss.epithet}</Text>
          <Text style={styles.bossPantheon}>{boss.pantheon}</Text>
        </View>

        {/* Appearance */}
        <DramaticReveal delay={200} duration={600}>
          <Text style={styles.appearanceText}>{boss.appearance}</Text>
        </DramaticReveal>

        {/* Mechanic Hint */}
        <DramaticReveal delay={700} duration={500}>
          <View style={styles.mechanicBox}>
            <Text style={styles.mechanicName}>{boss.mechanic.name}</Text>
            <Text style={styles.mechanicHint}>{boss.mechanic.hint}</Text>
          </View>
        </DramaticReveal>

        {/* ─── EXCHANGE 1 ─── */}
        <DramaticReveal delay={1100} duration={600} direction="up">
          <View style={styles.speechBubble}>
            <Text style={styles.bossLabel}>{boss.name}:</Text>
            <Text style={styles.speechText}>{boss.conversation.exchange1.bossOpening}</Text>
          </View>
        </DramaticReveal>

        {phase === 'exchange1' && (
          <DramaticReveal delay={200} duration={400}>
            <View style={styles.choicesContainer}>
              <Text style={styles.choicesLabel}>Your response:</Text>
              {exchange1Choices.map(c => (
                <Pressable key={c.id} style={styles.choiceBtn} onPress={() => handleChoice1(c)}>
                  <Text style={styles.choiceLabel}>{c.label}</Text>
                  <Text style={styles.choiceDesc}>{c.description}</Text>
                  {c.statRequirement && (
                    <Text style={styles.choiceReq}>
                      Requires {c.statRequirement.minPoints} {c.statRequirement.stat}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </DramaticReveal>
        )}

        {/* ─── EXCHANGE 2 ─── */}
        {choice1 && (phase === 'exchange2' || phase === 'exchange3' || phase === 'outcome_select' || phase === 'outcome_resolved') && (
          <>
            <View style={styles.playerLine}>
              <Text style={styles.playerLabel}>You:</Text>
              <Text style={styles.playerText}>{choice1.label}</Text>
            </View>
            <DramaticReveal delay={0} duration={500} direction="up">
              <View style={styles.speechBubble}>
                <Text style={styles.bossLabel}>{boss.name}:</Text>
                <Text style={styles.speechText}>{exchange2BossText}</Text>
              </View>
            </DramaticReveal>
          </>
        )}

        {phase === 'exchange2' && (
          <DramaticReveal delay={200} duration={400}>
            <View style={styles.choicesContainer}>
              <Text style={styles.choicesLabel}>Your response:</Text>
              {exchange2Choices.map(c => (
                <Pressable key={c.id} style={styles.choiceBtn} onPress={() => handleChoice2(c)}>
                  <Text style={styles.choiceLabel}>{c.label}</Text>
                  <Text style={styles.choiceDesc}>{c.description}</Text>
                  {c.statRequirement && (
                    <Text style={styles.choiceReq}>
                      Requires {c.statRequirement.minPoints} {c.statRequirement.stat}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </DramaticReveal>
        )}

        {/* ─── EXCHANGE 3 ─── */}
        {choice2 && (phase === 'exchange3' || phase === 'outcome_select' || phase === 'outcome_resolved') && (
          <>
            <View style={styles.playerLine}>
              <Text style={styles.playerLabel}>You:</Text>
              <Text style={styles.playerText}>{choice2.label}</Text>
            </View>
            <DramaticReveal delay={0} duration={500} direction="up">
              <View style={[styles.speechBubble, styles.finalSpeech]}>
                <Text style={styles.bossLabel}>{boss.name}:</Text>
                <Text style={styles.speechText}>{exchange3BossText}</Text>
              </View>
            </DramaticReveal>
          </>
        )}

        {/* ─── OUTCOME SELECTION ─── */}
        {phase === 'exchange3' && (
          <DramaticReveal delay={300} duration={400}>
            <View style={styles.choicesContainer}>
              <Text style={styles.choicesLabel}>What do you do?</Text>
              {availableOutcomes.map(o => (
                <Pressable
                  key={o.id}
                  style={[styles.choiceBtn, o.id !== 'fight' && styles.secretOutcomeBtn]}
                  onPress={() => handleOutcomeSelect(o)}
                >
                  <Text style={styles.choiceLabel}>{o.label}</Text>
                  <Text style={styles.choiceDesc}>{o.description}</Text>
                  {o.combatEffect?.description && (
                    <Text style={styles.outcomeEffect}>{o.combatEffect.description}</Text>
                  )}
                  {o.lootReward && (
                    <Text style={styles.outcomeEffect}>{o.lootReward.description}</Text>
                  )}
                  {o.achievement && (
                    <Text style={styles.achievementHint}>★ Secret achievement available</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </DramaticReveal>
        )}

        {/* ─── OUTCOME RESOLVED ─── */}
        {resolvedOutcome && phase === 'outcome_resolved' && (
          <DramaticReveal delay={0} duration={600} direction="scale" haptic hapticStyle="heavy">
            <View style={[styles.speechBubble, styles.closingBubble]}>
              <Text style={styles.bossLabel}>{boss.name}:</Text>
              <Text style={styles.closingText}>{resolvedOutcome.bossClosingLine}</Text>
            </View>

            {resolvedOutcome.id === 'bypass' ? (
              <Pressable style={styles.bypassButton} onPress={executeOutcome}>
                <Text style={styles.bypassButtonText}>WALK PAST</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.fightButton} onPress={executeOutcome}>
                <Text style={styles.fightButtonText}>
                  {resolvedOutcome.id === 'loot_cache' ? `CLAIM CACHE & FIGHT ${boss.name.toUpperCase()}` : `FIGHT ${boss.name.toUpperCase()}`}
                </Text>
              </Pressable>
            )}
          </DramaticReveal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollContent: { padding: Padding.lg, paddingBottom: 80 },
  bossHeader: { alignItems: 'center', marginBottom: Spacing.xl, paddingTop: Spacing.lg },
  bossEmoji: { fontSize: 64, marginBottom: Spacing.sm },
  bossName: { ...Typography.h2, color: '#8B0000', letterSpacing: 4, textAlign: 'center' },
  bossEpithet: { ...Typography.body, color: Colors.text.muted, fontStyle: 'italic', textAlign: 'center', marginTop: 4 },
  bossPantheon: { ...Typography.caption, color: Colors.text.muted, textAlign: 'center', marginTop: 2, opacity: 0.6 },
  appearanceText: { ...Typography.body, color: Colors.text.secondary, fontStyle: 'italic', textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 22 },
  mechanicBox: { backgroundColor: Colors.background.tertiary, borderWidth: BorderWidth.thin, borderColor: '#8B0000', borderRadius: BorderRadius.sm, padding: Padding.md, marginBottom: Spacing.xl },
  mechanicName: { ...Typography.label, color: '#8B0000', letterSpacing: 2, marginBottom: 4 },
  mechanicHint: { ...Typography.caption, color: Colors.text.muted, lineHeight: 18 },
  speechBubble: { backgroundColor: Colors.background.secondary, borderWidth: BorderWidth.thin, borderColor: Colors.border.primary, borderRadius: BorderRadius.md, padding: Padding.md, marginBottom: Spacing.md },
  finalSpeech: { borderColor: '#8B0000' },
  closingBubble: { borderColor: '#8B0000', borderWidth: BorderWidth.medium },
  bossLabel: { ...Typography.label, color: '#8B0000', letterSpacing: 2, marginBottom: Spacing.sm },
  speechText: { ...Typography.body, color: Colors.text.primary, lineHeight: 24, fontStyle: 'italic' },
  closingText: { ...Typography.body, color: Colors.text.primary, lineHeight: 24, fontStyle: 'italic', fontWeight: 'bold' },
  playerLine: { flexDirection: 'row', marginBottom: Spacing.sm, paddingHorizontal: Spacing.sm },
  playerLabel: { ...Typography.label, color: Colors.text.muted, marginRight: Spacing.sm },
  playerText: { ...Typography.body, color: Colors.text.secondary, fontStyle: 'italic', flex: 1 },
  choicesContainer: { marginBottom: Spacing.lg },
  choicesLabel: { ...Typography.label, color: Colors.text.muted, letterSpacing: 2, marginBottom: Spacing.md },
  choiceBtn: { backgroundColor: Colors.background.secondary, borderWidth: BorderWidth.thin, borderColor: Colors.border.primary, borderRadius: BorderRadius.sm, padding: Padding.md, marginBottom: Spacing.sm },
  secretOutcomeBtn: { borderColor: Colors.resource.gold },
  choiceLabel: { ...Typography.body, color: Colors.text.primary, fontWeight: 'bold', marginBottom: 4 },
  choiceDesc: { ...Typography.caption, color: Colors.text.muted },
  choiceReq: { ...Typography.caption, color: Colors.ui.warning, marginTop: 4 },
  outcomeEffect: { ...Typography.caption, color: Colors.resource.gold, marginTop: 4 },
  achievementHint: { ...Typography.caption, color: '#9A6898', marginTop: 4 },
  fightButton: { backgroundColor: '#8B0000', borderRadius: BorderRadius.md, padding: Padding.lg, alignItems: 'center', marginTop: Spacing.lg },
  fightButtonText: { ...Typography.button, color: Colors.text.inverse, letterSpacing: 3, fontSize: 13 },
  bypassButton: { backgroundColor: Colors.background.tertiary, borderWidth: BorderWidth.medium, borderColor: Colors.resource.gold, borderRadius: BorderRadius.md, padding: Padding.lg, alignItems: 'center', marginTop: Spacing.lg },
  bypassButtonText: { ...Typography.button, color: Colors.resource.gold, letterSpacing: 3, fontSize: 13 },
});
