/**
 * TowerWarningModal
 * Shown when a first-time player attempts to skip the tutorial.
 * No dismiss button — the player must choose.
 */

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

interface TowerWarningModalProps {
  visible: boolean;
  lastDeathName?: string;
  lastDeathFloor?: number;
  onDescendBlind: () => void;
  onHearTheTower: () => void;
}

export function TowerWarningModal({
  visible,
  lastDeathName,
  lastDeathFloor,
  onDescendBlind,
  onHearTheTower,
}: TowerWarningModalProps) {
  const bodyText = lastDeathName && lastDeathFloor
    ? `The last adventurer who descended without preparation was ${lastDeathName}.\nFloor ${lastDeathFloor}.\nTheir name is on the wall now.`
    : `Another one who thinks they know.\n\nThe last adventurer who descended\nwithout preparation made it to Floor 2.\n\nTheir name is on the wall now.`;

  const handleDescendBlind = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDescendBlind();
  };

  const handleHearTheTower = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onHearTheTower();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.header}>THE TOWER{'\n'}NOTICES YOU</Text>

          <View style={styles.divider} />

          <Text style={styles.body}>{bodyText}</Text>

          <View style={styles.tablets}>
            {/* Descend Blind — faded, cracked */}
            <Pressable
              style={({ pressed }) => [
                styles.tablet,
                styles.blindTablet,
                pressed && styles.tabletPressed,
              ]}
              onPress={handleDescendBlind}
            >
              <Text style={[styles.tabletTitle, styles.blindTitle]}>DESCEND BLIND</Text>
              <Text style={[styles.tabletSub, styles.blindSub]}>{'"I\'ll figure it out."'}</Text>
            </Pressable>

            {/* Hear the Tower — warm, lit */}
            <Pressable
              style={({ pressed }) => [
                styles.tablet,
                styles.listenTablet,
                pressed && styles.tabletPressed,
              ]}
              onPress={handleHearTheTower}
            >
              <Text style={[styles.tabletTitle, styles.listenTitle]}>HEAR THE TOWER</Text>
              <Text style={[styles.tabletSub, styles.listenSub]}>{'"Tell me what I need to know."'}</Text>
              <Text style={styles.tabletTime}>— 4 minutes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  panel: {
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.domain.death,
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
    width: '100%',
    maxWidth: 340,
    gap: Spacing.xl,
  },
  header: {
    ...Typography.h4,
    color: Colors.text.primary,
    letterSpacing: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.accent,
    marginHorizontal: Spacing.lg,
  },
  body: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tablets: {
    gap: Spacing.md,
  },
  tablet: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderRadius: 0,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tabletPressed: {
    opacity: 0.75,
  },

  // Descend Blind — muted, cracked look
  blindTablet: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.primary,
    borderLeftWidth: 2,
    borderLeftColor: Colors.text.muted,
    opacity: 0.7,
  },
  blindTitle: {
    color: Colors.text.muted,
  },
  blindSub: {
    color: Colors.text.muted,
  },

  // Hear the Tower — warm, lit
  listenTablet: {
    backgroundColor: Colors.background.elevated,
    borderColor: Colors.border.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
  },
  listenTitle: {
    color: Colors.text.accent,
  },
  listenSub: {
    color: Colors.text.primary,
  },

  tabletTitle: {
    ...Typography.label,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tabletSub: {
    ...Typography.caption,
    fontStyle: 'italic',
  },
  tabletTime: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
});
