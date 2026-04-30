/**
 * TurnOrderTimeline — Action Economy Visualizer
 * Shows speed-based turn sequence as horizontal token strip.
 * Gold = player action, Red = monster action.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';

interface TurnOrderTimelineProps {
  sequence: ('player' | 'monster')[];
}

export function TurnOrderTimeline({ sequence }: TurnOrderTimelineProps) {
  if (!sequence.length) return null;

  const goesFirst = sequence[0];
  const playerCount = sequence.filter(s => s === 'player').length;
  const monsterCount = sequence.filter(s => s === 'monster').length;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {goesFirst === 'player' ? 'YOU ACT FIRST' : 'ENEMY ACTS FIRST'}
      </Text>
      <View style={styles.timeline}>
        {sequence.map((actor, i) => (
          <View
            key={i}
            style={[
              styles.token,
              actor === 'player' ? styles.playerToken : styles.monsterToken,
            ]}
          >
            <Text style={[styles.tokenText, actor === 'player' ? styles.playerText : styles.monsterText]}>
              {actor === 'player' ? 'YOU' : 'FOE'}
            </Text>
          </View>
        ))}
        {(playerCount > 1 || monsterCount > 1) && (
          <Text style={styles.doubleNote}>
            {playerCount > 1 ? 'Double action!' : 'Enemy strikes twice!'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  label: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.text.muted,
    letterSpacing: 1.5,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  token: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 40,
    alignItems: 'center',
  },
  playerToken: {
    backgroundColor: Colors.text.accent + '20',
    borderColor: Colors.text.accent,
  },
  monsterToken: {
    backgroundColor: Colors.ui.error + '20',
    borderColor: Colors.ui.error,
  },
  tokenText: {
    ...Typography.label,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  playerText: {
    color: Colors.text.accent,
  },
  monsterText: {
    color: Colors.ui.error,
  },
  doubleNote: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.ui.warning,
    marginLeft: Spacing.xs,
    fontStyle: 'italic',
  },
});
