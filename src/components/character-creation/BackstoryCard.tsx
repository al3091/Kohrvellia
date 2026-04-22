/**
 * BackstoryCard component for character creation
 * Displays a backstory option with stat modifiers and deity affinity
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Backstory, BackstoryId } from '../../types/Character';
import { Card } from '../ui/Card';
import { Colors } from '../../constants/Colors';
import { Typography, FontWeight } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';

interface BackstoryCardProps {
  backstory: Backstory;
  selected: boolean;
  onSelect: (id: BackstoryId) => void;
  showDeityHint?: boolean;
  showFlavor?: boolean;
}

export function BackstoryCard({
  backstory,
  selected,
  onSelect,
  showDeityHint = true,
  showFlavor = true,
}: BackstoryCardProps) {
  const handlePress = () => {
    onSelect(backstory.id);
  };

  return (
    <Card
      onPress={handlePress}
      selected={selected}
      highlightColor={Colors.text.accent}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{backstory.name}</Text>
      </View>

      {showFlavor && <Text style={styles.flavor}>"{backstory.flavor}"</Text>}

      <View style={styles.statsRow}>
        <View style={styles.statBadge}>
          <Text style={[styles.statText, styles.statBonus]}>
            +{backstory.statBonus.value} {backstory.statBonus.stat}
          </Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={[styles.statText, styles.statPenalty]}>
            -{backstory.statPenalty.value} {backstory.statPenalty.stat}
          </Text>
        </View>
      </View>

      {showDeityHint && backstory.deityAffinity.length > 0 && (
        <View style={styles.affinityRow}>
          <Text style={styles.affinityLabel}>Affinity: </Text>
          {backstory.deityAffinity.map((domain) => (
            <View
              key={domain}
              style={[
                styles.domainBadge,
                { backgroundColor: getDomainColor(domain) + '30' },
              ]}
            >
              <Text style={[styles.domainText, { color: getDomainColor(domain) }]}>
                {formatDomain(domain)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

function getDomainColor(domain: string): string {
  const domainColors: Record<string, string> = Colors.domain;
  return domainColors[domain] || Colors.text.secondary;
}

function formatDomain(domain: string): string {
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  name: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  flavor: {
    ...Typography.quote,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.secondary,
  },
  statText: {
    ...Typography.stat,
    fontSize: 14,
  },
  statBonus: {
    color: Colors.ui.success,
  },
  statPenalty: {
    color: Colors.ui.error,
  },
  affinityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  affinityLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  domainBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  domainText: {
    ...Typography.caption,
    fontWeight: FontWeight.semibold,
    textTransform: 'capitalize',
  },
});

export default BackstoryCard;
