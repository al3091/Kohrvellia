/**
 * DeityFilters component
 * Collapsible filter chips for domain, stat bonus, and personality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  LayoutAnimation,

} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius, Spacing } from '../../constants/Spacing';
import { useHaptics } from '../../hooks/useHaptics';
import type { StatName } from '../../types/Stats';


// Domain icons mapping
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

// Personality icons
const PERSONALITY_ICONS: Record<string, string> = {
  stern: '⚔️',
  encouraging: '✨',
  serene: '🕊️',
  mysterious: '🌙',
  playful: '🎭',
  chaotic: '🔥',
  wrathful: '⚡',
};

// All domains
const ALL_DOMAINS = Object.keys(DOMAIN_ICONS);

// All stats
const ALL_STATS: StatName[] = ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'WIS', 'LCK'];

// All personalities
const ALL_PERSONALITIES = Object.keys(PERSONALITY_ICONS);

interface DeityFiltersProps {
  activeDomains: string[];
  activeStats: StatName[];
  activePersonalities: string[];
  onDomainToggle: (domain: string) => void;
  onStatToggle: (stat: StatName) => void;
  onPersonalityToggle: (personality: string) => void;
  onClearAll: () => void;
}

export function DeityFilters({
  activeDomains,
  activeStats,
  activePersonalities,
  onDomainToggle,
  onStatToggle,
  onPersonalityToggle,
  onClearAll,
}: DeityFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const haptics = useHaptics();

  const hasActiveFilters =
    activeDomains.length > 0 ||
    activeStats.length > 0 ||
    activePersonalities.length > 0;

  const toggleExpanded = () => {
    haptics.light();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleClearAll = () => {
    haptics.medium();
    onClearAll();
  };

  return (
    <View style={styles.container}>
      {/* Filter Header */}
      <View style={styles.header}>
        <Pressable onPress={toggleExpanded} style={styles.headerButton}>
          <Text style={styles.headerIcon}>{isExpanded ? '▼' : '▶'}</Text>
          <Text style={styles.headerText}>Filters</Text>
          {hasActiveFilters && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>
                {activeDomains.length + activeStats.length + activePersonalities.length}
              </Text>
            </View>
          )}
        </Pressable>

        {hasActiveFilters && (
          <Pressable onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* Expanded Filters */}
      {isExpanded && (
        <View style={styles.filtersContainer}>
          {/* Domain Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>DOMAIN</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {ALL_DOMAINS.map((domain) => {
                const isActive = activeDomains.includes(domain);
                const domainColor = Colors.domain[domain as keyof typeof Colors.domain] || Colors.text.accent;

                return (
                  <Pressable
                    key={domain}
                    onPress={() => {
                      haptics.selection();
                      onDomainToggle(domain);
                    }}
                    style={[
                      styles.chip,
                      isActive && { backgroundColor: domainColor + '30', borderColor: domainColor },
                    ]}
                  >
                    <Text style={styles.chipIcon}>{DOMAIN_ICONS[domain]}</Text>
                    <Text style={[styles.chipText, isActive && { color: domainColor }]}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Stat Bonus Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>BONUS STAT</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {ALL_STATS.map((stat) => {
                const isActive = activeStats.includes(stat);

                return (
                  <Pressable
                    key={stat}
                    onPress={() => {
                      haptics.selection();
                      onStatToggle(stat);
                    }}
                    style={[
                      styles.chip,
                      isActive && styles.chipActive,
                    ]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      +{stat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Personality Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>PERSONALITY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {ALL_PERSONALITIES.map((personality) => {
                const isActive = activePersonalities.includes(personality);

                return (
                  <Pressable
                    key={personality}
                    onPress={() => {
                      haptics.selection();
                      onPersonalityToggle(personality);
                    }}
                    style={[
                      styles.chip,
                      isActive && styles.chipActive,
                    ]}
                  >
                    <Text style={styles.chipIcon}>{PERSONALITY_ICONS[personality]}</Text>
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {personality.charAt(0).toUpperCase() + personality.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  headerIcon: {
    fontSize: 10,
    color: Colors.text.muted,
    marginRight: Spacing.sm,
  },
  headerText: {
    ...Typography.label,
    color: Colors.text.secondary,
  },
  activeBadge: {
    backgroundColor: Colors.text.accent,
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginLeft: Spacing.sm,
  },
  activeBadgeText: {
    ...Typography.caption,
    color: Colors.background.primary,
    fontWeight: '600',
  },
  clearButton: {
    padding: Spacing.sm,
  },
  clearText: {
    ...Typography.caption,
    color: Colors.ui.error,
  },
  filtersContainer: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  filterSection: {
    gap: Spacing.xs,
  },
  filterLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.text.muted,
    paddingLeft: Spacing.xs,
  },
  chipScroll: {
    paddingRight: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  chipActive: {
    backgroundColor: Colors.text.accent + '20',
    borderColor: Colors.text.accent,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  chipTextActive: {
    color: Colors.text.accent,
    fontWeight: '600',
  },
});

export default DeityFilters;
