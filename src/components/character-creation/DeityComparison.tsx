/**
 * DeityComparison component
 * Side-by-side comparison of up to 3 deities
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography, FontWeight } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import { Button } from '../ui/Button';
import { useHaptics } from '../../hooks/useHaptics';
import type { Deity } from '../../types/Deity';
import { DOMAIN_EFFECTS } from '../../types/Deity';

// Domain icons
const DOMAIN_ICONS: Record<string, string> = {
  war: '⚔️',
  magic: '✨',
  trickery: '🎭',
  death: '💀',
  fortune: '🎲',
  nature: '🌿',
  wisdom: '📚',
  craft: '🔨',
  authority: '👑',
  life: '❤️',
  sea: '🌊',
  sky: '⚡',
  fire: '🔥',
  knowledge: '🔮',
};

interface DeityComparisonProps {
  deities: Deity[];
  onSelect: (deity: Deity) => void;
  onRemove: (deityId: string) => void;
  maxDeities?: number;
}

export function DeityComparison({
  deities,
  onSelect,
  onRemove,
  maxDeities = 3,
}: DeityComparisonProps) {
  const haptics = useHaptics();

  if (deities.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>⚖️</Text>
        <Text style={styles.emptyText}>
          Select deities to compare them side by side
        </Text>
        <Text style={styles.emptyHint}>
          Tap "Compare" on deity cards to add them here
        </Text>
      </View>
    );
  }

  const getDomainColor = (domain: string): string => {
    const domainColors: Record<string, string> = Colors.domain;
    return domainColors[domain] || Colors.text.secondary;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {deities.map((deity) => {
        const domainColor = getDomainColor(deity.domain);
        const domainIcon = DOMAIN_ICONS[deity.domain] || '✦';
        const domainEffect = DOMAIN_EFFECTS[deity.domain as keyof typeof DOMAIN_EFFECTS];

        return (
          <View key={deity.id} style={styles.column}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => {
                  haptics.light();
                  onRemove(deity.id);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>✕</Text>
              </Pressable>
              <Text style={styles.deityIcon}>{domainIcon}</Text>
              <Text style={styles.deityName} numberOfLines={1}>
                {deity.name}
              </Text>
            </View>

            {/* Domain Badge */}
            <View style={[styles.domainBadge, { backgroundColor: domainColor + '30' }]}>
              <Text style={[styles.domainText, { color: domainColor }]}>
                {deity.domain.charAt(0).toUpperCase() + deity.domain.slice(1)}
              </Text>
            </View>

            {/* Comparison Rows */}
            <View style={styles.comparisonSection}>
              {/* Stat Bonus */}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>BONUS</Text>
                <Text style={styles.statBonus}>
                  +{deity.statBonus.value} {deity.statBonus.stat}
                </Text>
              </View>

              {/* Stat Penalty */}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>PENALTY</Text>
                <Text style={styles.statPenalty}>
                  -{deity.statPenalty.value} {deity.statPenalty.stat}
                </Text>
              </View>

              {/* Domain Effect */}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>BLESSING</Text>
                <Text style={[styles.blessingText, { color: domainColor }]} numberOfLines={2}>
                  {domainEffect?.primaryEffect || 'N/A'}
                </Text>
              </View>

              {/* Unique Ability */}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>ABILITY</Text>
                <Text style={styles.abilityName} numberOfLines={1}>
                  {deity.uniqueAbility.name}
                </Text>
              </View>

              {/* Personality */}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>STYLE</Text>
                <Text style={styles.personalityText}>
                  {deity.personality.charAt(0).toUpperCase() + deity.personality.slice(1)}
                </Text>
              </View>
            </View>

            {/* Select Button */}
            <Button
              label="Choose"
              onPress={() => onSelect(deity)}
              hapticStyle="heavy"
              size="sm"
              fullWidth
            />
          </View>
        );
      })}

      {/* Add more slot if under max */}
      {deities.length < maxDeities && (
        <View style={styles.addSlot}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Add deity</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptyHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  column: {
    width: 160,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    padding: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -Spacing.xs,
    right: -Spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  deityIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  deityName: {
    ...Typography.h6,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  domainBadge: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  domainText: {
    ...Typography.caption,
    fontWeight: FontWeight.semibold,
  },
  comparisonSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  row: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    paddingTop: Spacing.sm,
  },
  rowLabel: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  statBonus: {
    ...Typography.stat,
    fontSize: 14,
    color: Colors.ui.success,
  },
  statPenalty: {
    ...Typography.stat,
    fontSize: 14,
    color: Colors.ui.error,
  },
  blessingText: {
    ...Typography.caption,
    fontWeight: FontWeight.medium,
  },
  abilityName: {
    ...Typography.bodySmall,
    color: Colors.text.accent,
  },
  personalityText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  addSlot: {
    width: 160,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  addIcon: {
    fontSize: 32,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  addText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
});

export default DeityComparison;
