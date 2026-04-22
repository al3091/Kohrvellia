/**
 * PantheonCard component for deity selection
 * Displays a pantheon option with deity count
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';

interface PantheonInfo {
  id: string;
  name: string;
  description: string;
  deityCount: number;
}

interface PantheonCardProps {
  pantheon: PantheonInfo;
  onSelect: (id: string) => void;
  hasAffinityDeity?: boolean;
}

export function PantheonCard({
  pantheon,
  onSelect,
  hasAffinityDeity = false,
}: PantheonCardProps) {
  const handlePress = () => {
    onSelect(pantheon.id);
  };

  return (
    <Card
      onPress={handlePress}
      highlighted={hasAffinityDeity}
      highlightColor={Colors.text.accent}
      style={styles.card}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{pantheon.name}</Text>
        <Text style={styles.description}>{pantheon.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.count}>{pantheon.deityCount} deities</Text>
          {hasAffinityDeity && (
            <View style={styles.affinityBadge}>
              <Text style={styles.affinityText}>★ Recommended</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.xs,
    minHeight: 100,
  },
  content: {
    flex: 1,
  },
  name: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  count: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  affinityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.text.accent + '20',
  },
  affinityText: {
    ...Typography.caption,
    color: Colors.text.accent,
    fontSize: 10,
  },
});

export default PantheonCard;
