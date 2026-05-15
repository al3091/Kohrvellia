/**
 * Boss Cleared Screen — shown when a character reaches a floor where
 * the milestone boss was already killed by a previous character.
 * No combat. A lore tablet marks the permanence of the prior victory.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { DramaticReveal } from '../../src/components/text/DramaticReveal';
import { getMilestoneBoss } from '../../src/data/bosses/milestoneBosses';

export default function BossClearedScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { getCurrentMap, getCurrentNode, completeNode } = useDungeonStore();

  const map = getCurrentMap();
  const node = getCurrentNode();
  const boss = map ? getMilestoneBoss(map.floorNumber) : null;

  if (!boss || !map) {
    router.replace('/dungeon/room');
    return null;
  }

  const handlePassThrough = () => {
    haptics.medium();
    if (node) completeNode(node.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <DramaticReveal delay={0} duration={600} direction="scale">
          <Text style={styles.emoji}>{boss.appearanceEmoji}</Text>
        </DramaticReveal>

        <DramaticReveal delay={500} duration={600}>
          <Text style={styles.floorLabel}>FLOOR {boss.floor}</Text>
          <Text style={styles.bossName}>{boss.name.toUpperCase()}'S THRESHOLD</Text>
          <Text style={styles.epithet}>{boss.epithet}</Text>
        </DramaticReveal>

        <DramaticReveal delay={1100} duration={700}>
          <View style={styles.tablet}>
            <Text style={styles.tabletText}>{boss.bossDefeatedEcho}</Text>
          </View>
        </DramaticReveal>

        <DramaticReveal delay={1800} duration={500}>
          <Text style={styles.blessingText}>A faint warmth lingers here. The way is open.</Text>
        </DramaticReveal>

        <DramaticReveal delay={2300} duration={400}>
          <Pressable style={styles.passButton} onPress={handlePassThrough}>
            <Text style={styles.passButtonText}>PASS THROUGH</Text>
          </Pressable>
        </DramaticReveal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Padding.xl },
  emoji: { fontSize: 48, opacity: 0.5, marginBottom: Spacing.lg },
  floorLabel: { ...Typography.caption, color: Colors.text.muted, letterSpacing: 3, textAlign: 'center' },
  bossName: { ...Typography.h3, color: Colors.text.muted, letterSpacing: 2, textAlign: 'center', marginBottom: 4 },
  epithet: { ...Typography.body, color: Colors.text.muted, fontStyle: 'italic', textAlign: 'center', marginBottom: Spacing.xl, opacity: 0.7 },
  tablet: {
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.md,
    padding: Padding.lg,
    marginBottom: Spacing.xl,
  },
  tabletText: { ...Typography.body, color: Colors.text.secondary, lineHeight: 24, fontStyle: 'italic', textAlign: 'center' },
  blessingText: { ...Typography.caption, color: Colors.resource.gold, textAlign: 'center', marginBottom: Spacing.xl, opacity: 0.8 },
  passButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Padding.md,
    paddingHorizontal: Padding.xl,
  },
  passButtonText: { ...Typography.button, color: Colors.text.muted, letterSpacing: 3 },
});
