/**
 * Deity Comparison Screen
 * Compare up to 3 deities side by side
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding } from '../../../src/constants/Spacing';
import { Header, Button } from '../../../src/components/ui';
import { DeityComparison } from '../../../src/components/character-creation/DeityComparison';
import { DeityCard } from '../../../src/components/character-creation/DeityCard';
import { DeitySearchBar } from '../../../src/components/character-creation/DeitySearchBar';
import { useCreationState } from '../../../src/hooks/useCreationState';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { allDeities, getDeityById } from '../../../src/data/pantheons';
import type { Deity } from '../../../src/types/Deity';

const MAX_COMPARE = 3;

export default function DeityCompareScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const params = useLocalSearchParams<{ deityIds?: string }>();
  const { setPantheon, setDeity: setCreationDeity } = useCreationState();

  // Parse initial deity IDs from params
  const initialDeityIds = useMemo(() => {
    if (!params.deityIds) return [];
    return params.deityIds.split(',').filter(Boolean);
  }, [params.deityIds]);

  const [compareDeityIds, setCompareDeityIds] = useState<string[]>(initialDeityIds);
  const [searchQuery, setSearchQuery] = useState('');

  // Get full deity objects for comparison
  const compareDeities = useMemo(() => {
    return compareDeityIds
      .map((id) => getDeityById(id))
      .filter((deity): deity is Deity => deity !== undefined);
  }, [compareDeityIds]);

  // Filter deities for adding to comparison
  const filteredDeities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allDeities
      .filter(
        (deity) =>
          !compareDeityIds.includes(deity.id) &&
          (deity.name.toLowerCase().includes(query) ||
            deity.domain.toLowerCase().includes(query) ||
            deity.title.toLowerCase().includes(query))
      )
      .slice(0, 10); // Limit results
  }, [searchQuery, compareDeityIds]);

  const handleAddDeity = useCallback(
    (deity: Deity) => {
      if (compareDeityIds.length >= MAX_COMPARE) {
        haptics.error();
        return;
      }
      haptics.selection();
      setCompareDeityIds((prev) => [...prev, deity.id]);
      setSearchQuery('');
    },
    [compareDeityIds.length, haptics]
  );

  const handleRemoveDeity = useCallback(
    (deityId: string) => {
      haptics.light();
      setCompareDeityIds((prev) => prev.filter((id) => id !== deityId));
    },
    [haptics]
  );

  const handleSelectDeity = useCallback(
    (deity: Deity) => {
      haptics.success();
      setPantheon(deity.pantheon);
      setCreationDeity(deity.id);
      router.push('/character-creation/stats');
    },
    [haptics, setPantheon, setCreationDeity, router]
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Compare Deities"
        subtitle={`${compareDeities.length}/${MAX_COMPARE} selected`}
        showBack
        onBack={handleBack}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Comparison Section */}
        <View style={styles.comparisonSection}>
          <DeityComparison
            deities={compareDeities}
            onSelect={handleSelectDeity}
            onRemove={handleRemoveDeity}
            maxDeities={MAX_COMPARE}
          />
        </View>

        {/* Add More Section */}
        {compareDeities.length < MAX_COMPARE && (
          <View style={styles.addSection}>
            <Text style={styles.sectionTitle}>Add to Comparison</Text>
            <DeitySearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for a deity..."
              resultCount={searchQuery.trim() ? filteredDeities.length : undefined}
              totalCount={allDeities.length}
            />

            {searchQuery.trim() && (
              <View style={styles.searchResults}>
                {filteredDeities.map((deity) => (
                  <DeityCard
                    key={deity.id}
                    deity={deity}
                    selected={false}
                    onSelect={handleAddDeity}
                    compact
                  />
                ))}
                {filteredDeities.length === 0 && (
                  <Text style={styles.noResults}>No deities found</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Suggested Comparisons */}
        {compareDeities.length === 0 && !searchQuery.trim() && (
          <View style={styles.suggestedSection}>
            <Text style={styles.sectionTitle}>Suggested Comparisons</Text>
            <Text style={styles.sectionHint}>
              Popular deity matchups to help you decide
            </Text>

            <View style={styles.suggestionList}>
              <SuggestionCard
                title="Power vs Wisdom"
                deityIds={['zeus', 'athena', 'ares']}
                onSelect={(ids) => setCompareDeityIds(ids)}
              />
              <SuggestionCard
                title="Norse Titans"
                deityIds={['odin', 'thor', 'freya']}
                onSelect={(ids) => setCompareDeityIds(ids)}
              />
              <SuggestionCard
                title="Eastern Legends"
                deityIds={['amaterasu', 'susanoo', 'tsukuyomi']}
                onSelect={(ids) => setCompareDeityIds(ids)}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface SuggestionCardProps {
  title: string;
  deityIds: string[];
  onSelect: (ids: string[]) => void;
}

function SuggestionCard({ title, deityIds, onSelect }: SuggestionCardProps) {
  const haptics = useHaptics();
  const deities = deityIds.map(getDeityById).filter((d): d is Deity => d !== undefined);

  if (deities.length === 0) return null;

  return (
    <View style={styles.suggestionCard}>
      <Text style={styles.suggestionTitle}>{title}</Text>
      <View style={styles.suggestionDeities}>
        {deities.map((deity) => (
          <Text key={deity.id} style={styles.suggestionDeity}>
            {deity.name}
          </Text>
        ))}
      </View>
      <Button
        label="Compare"
        onPress={() => {
          haptics.medium();
          onSelect(deityIds);
        }}
        variant="secondary"
        size="sm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing['4xl'],
  },
  comparisonSection: {
    minHeight: 300,
  },
  addSection: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  sectionHint: {
    ...Typography.bodySmall,
    color: Colors.text.muted,
    marginBottom: Spacing.lg,
  },
  searchResults: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  noResults: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  suggestedSection: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.xl,
  },
  suggestionList: {
    gap: Spacing.md,
  },
  suggestionCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  suggestionTitle: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  suggestionDeities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  suggestionDeity: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
});
