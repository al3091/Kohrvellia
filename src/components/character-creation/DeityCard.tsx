/**
 * DeityCard component for deity selection
 * Displays a deity option with domain, blessing effect, and stats
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Deity, DOMAIN_EFFECTS } from '../../types/Deity';
import { Card } from '../ui/Card';
import { Colors } from '../../constants/Colors';
import { Typography, FontWeight } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';
import { DomainIcon } from '../icons/DomainIcon';

type DomainType = keyof typeof Colors.domain;

interface DeityCardProps {
  deity: Deity;
  selected: boolean;
  onSelect: (deity: Deity) => void;
  isAffinity?: boolean;
  compact?: boolean;
}

export function DeityCard({
  deity,
  selected,
  onSelect,
  isAffinity = false,
  compact = false,
}: DeityCardProps) {
  const handlePress = () => {
    onSelect(deity);
  };

  const domainColor = getDomainColor(deity.domain);
  const domainEffect = DOMAIN_EFFECTS[deity.domain as keyof typeof DOMAIN_EFFECTS];

  return (
    <Card
      onPress={handlePress}
      selected={selected}
      highlighted={isAffinity && !selected}
      highlightColor={domainColor}
      style={styles.card}
    >
      {/* Header with domain icon and name */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.domainIconContainer}>
            <DomainIcon
              domain={deity.domain as DomainType}
              size={32}
              color={domainColor}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{deity.name}</Text>
            <Text style={styles.title}>{deity.title}</Text>
          </View>
          {isAffinity && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>★</Text>
            </View>
          )}
        </View>
      </View>

      {/* Domain and personality badges */}
      <View style={styles.badgeRow}>
        <View style={[styles.domainBadge, { backgroundColor: domainColor + '30' }]}>
          <Text style={[styles.domainText, { color: domainColor }]}>
            {formatDomain(deity.domain)}
          </Text>
        </View>
        <View style={styles.personalityBadge}>
          <Text style={styles.personalityText}>
            {formatPersonality(deity.personality)}
          </Text>
        </View>
      </View>

      {/* Domain blessing effect - prominent display */}
      {domainEffect && (
        <View style={[styles.blessingBox, { borderColor: domainColor + '50' }]}>
          <Text style={[styles.blessingText, { color: domainColor }]}>
            {domainEffect.primaryEffect}
          </Text>
          {domainEffect.secondaryEffect && (
            <Text style={styles.blessingSecondary}>
              {domainEffect.secondaryEffect}
            </Text>
          )}
        </View>
      )}

      {!compact && (
        <>
          {/* Stat modifiers */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statBonus}>
                +{deity.statBonus.value} {deity.statBonus.stat}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statPenalty}>
                -{deity.statPenalty.value} {deity.statPenalty.stat}
              </Text>
            </View>
          </View>

          {/* Description/lore snippet */}
          <Text style={styles.description} numberOfLines={2}>
            "{deity.loreSnippet}"
          </Text>
        </>
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

function formatPersonality(personality: string): string {
  return personality.charAt(0).toUpperCase() + personality.slice(1);
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  domainIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  recommendedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedText: {
    color: Colors.text.accent,
    fontSize: 12,
  },
  title: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  domainBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  domainText: {
    ...Typography.caption,
    fontWeight: FontWeight.semibold,
  },
  personalityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.secondary,
  },
  personalityText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  blessingBox: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  blessingText: {
    ...Typography.bodySmall,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  blessingSecondary: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border.primary,
  },
  statBonus: {
    ...Typography.stat,
    fontSize: 13,
    color: Colors.ui.success,
  },
  statPenalty: {
    ...Typography.stat,
    fontSize: 13,
    color: Colors.ui.error,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default DeityCard;
