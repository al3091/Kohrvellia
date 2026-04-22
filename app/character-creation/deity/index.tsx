/**
 * Pantheon Selection Screen — Screen 3a / 6
 * Search + domain filter + By Pantheon / View All toggle.
 * Deity detail via shared DeityDetailModal. No stat filter.
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius } from '../../../src/constants/Spacing';
import { Header, ProgressIndicator } from '../../../src/components/ui';
import { PantheonCard } from '../../../src/components/character-creation/PantheonCard';
import { DeityCard } from '../../../src/components/character-creation/DeityCard';
import { DeitySearchBar } from '../../../src/components/character-creation/DeitySearchBar';
import { DeityDetailModal } from '../../../src/components/character-creation/DeityDetailModal';
import { useCreationState } from '../../../src/hooks/useCreationState';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { BACKSTORIES } from '../../../src/types/Character';
import { pantheonInfo, getDeityByPantheon, allDeities } from '../../../src/data/pantheons';
import type { Deity, DeityDomain } from '../../../src/types/Deity';

const STEP_LABELS = ['Name', 'Origin', 'Deity', 'Stats', 'Weapon', 'Confirm'];

export default function PantheonScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { backstoryId, setPantheon, setDeity: setCreationDeity } = useCreationState();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pantheons' | 'deities'>('pantheons');
  const [detailDeity, setDetailDeity] = useState<Deity | null>(null);
  const [domainFilter, setDomainFilter] = useState<DeityDomain | 'all'>('all');

  const affinityDomains = useMemo(() => {
    if (!backstoryId) return [];
    return BACKSTORIES[backstoryId]?.deityAffinity || [];
  }, [backstoryId]);

  const pantheonsWithAffinity = useMemo(() => {
    return pantheonInfo.map((pantheon) => {
      const deities = getDeityByPantheon(pantheon.id);
      const hasAffinity = deities.some((deity) =>
        affinityDomains.includes(deity.domain)
      );
      return { ...pantheon, hasAffinity };
    });
  }, [affinityDomains]);

  const sortedPantheons = useMemo(() => {
    return [...pantheonsWithAffinity].sort((a, b) => {
      if (a.hasAffinity && !b.hasAffinity) return -1;
      if (!a.hasAffinity && b.hasAffinity) return 1;
      return 0;
    });
  }, [pantheonsWithAffinity]);

  const filteredDeities = useMemo(() => {
    let result = allDeities;

    if (domainFilter !== 'all') {
      result = result.filter((deity) => deity.domain === domainFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (deity) =>
          deity.name.toLowerCase().includes(query) ||
          deity.title.toLowerCase().includes(query) ||
          deity.domain.toLowerCase().includes(query) ||
          deity.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, domainFilter]);

  const hasActiveFilters = domainFilter !== 'all';
  const showDeityResults = searchQuery.trim().length > 0 || hasActiveFilters || viewMode === 'deities';

  const handleSelect = (pantheonId: string) => {
    setPantheon(pantheonId);
    router.push(`/character-creation/deity/${pantheonId}`);
  };

  const handleDeitySelect = (deity: Deity) => {
    haptics.light();
    setDetailDeity(deity);
  };

  const handleConfirmDeity = (deityId: string) => {
    if (!detailDeity) return;
    setPantheon(detailDeity.pantheon);
    setCreationDeity(deityId);
    setDetailDeity(null);
    router.push('/character-creation/stats');
  };

  const handleCloseDetail = () => {
    setDetailDeity(null);
  };

  const handleToggleViewMode = useCallback(() => {
    haptics.light();
    setViewMode((prev) => (prev === 'pantheons' ? 'deities' : 'pantheons'));
  }, [haptics]);

  const handleBack = () => {
    router.back();
  };

  const renderPantheon = ({ item, index }: { item: typeof sortedPantheons[0]; index: number }) => {
    const isEven = index % 2 === 0;
    if (!isEven) return null;

    const nextItem = sortedPantheons[index + 1];

    return (
      <View style={styles.row}>
        <PantheonCard
          pantheon={item}
          onSelect={handleSelect}
          hasAffinityDeity={item.hasAffinity}
        />
        {nextItem ? (
          <PantheonCard
            pantheon={nextItem}
            onSelect={handleSelect}
            hasAffinityDeity={nextItem.hasAffinity}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    );
  };

  const renderDeity = ({ item }: { item: Deity }) => (
    <DeityCard
      deity={item}
      selected={false}
      onSelect={handleDeitySelect}
      isAffinity={affinityDomains.includes(item.domain)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Choose Your Patron" showBack onBack={handleBack} />
      <ProgressIndicator
        currentStep={3}
        totalSteps={6}
        labels={STEP_LABELS}
      />

      <View style={styles.searchContainer}>
        <DeitySearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search all deities..."
          resultCount={searchQuery.trim() || hasActiveFilters ? filteredDeities.length : undefined}
          totalCount={allDeities.length}
        />

        {/* Domain Filter */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              style={[styles.filterChip, domainFilter === 'all' && styles.filterChipActive]}
              onPress={() => { haptics.light(); setDomainFilter('all'); }}
            >
              <Text style={[styles.filterChipText, domainFilter === 'all' && styles.filterChipTextActive]}>All</Text>
            </Pressable>
            {(['war', 'magic', 'trickery', 'death', 'fortune', 'nature', 'wisdom', 'craft', 'authority', 'life'] as DeityDomain[]).map((dom) => (
              <Pressable
                key={dom}
                style={[styles.filterChip, domainFilter === dom && styles.filterChipActive]}
                onPress={() => { haptics.light(); setDomainFilter(dom); }}
              >
                <Text style={[styles.filterChipText, domainFilter === dom && styles.filterChipTextActive]}>
                  {dom.charAt(0).toUpperCase() + dom.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* View Mode Toggle */}
        <View style={styles.viewToggle}>
          <Pressable
            onPress={handleToggleViewMode}
            style={[styles.toggleButton, viewMode === 'pantheons' && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleText, viewMode === 'pantheons' && styles.toggleTextActive]}>
              By Pantheon
            </Text>
          </Pressable>
          <Pressable
            onPress={handleToggleViewMode}
            style={[styles.toggleButton, viewMode === 'deities' && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleText, viewMode === 'deities' && styles.toggleTextActive]}>
              View All ({allDeities.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {showDeityResults ? (
        <FlatList
          data={filteredDeities}
          renderItem={renderDeity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.deityList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {hasActiveFilters ? 'No deities match the selected domain' : 'No deities found'}
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={sortedPantheons.filter((_, i) => i % 2 === 0)}
          renderItem={({ item, index }) => renderPantheon({ item, index: index * 2 })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <DeityDetailModal
        deity={detailDeity}
        visible={!!detailDeity}
        onClose={handleCloseDetail}
        onSelect={handleConfirmDeity}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  searchContainer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.md,
  },
  filterRow: {
    marginTop: Spacing.sm,
  },
  filterChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    marginRight: Spacing.xs,
  },
  filterChipActive: {
    backgroundColor: Colors.text.accent,
  },
  filterChipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  filterChipTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginTop: Spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  toggleButtonActive: {
    backgroundColor: Colors.text.accent,
  },
  toggleText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  toggleTextActive: {
    color: Colors.background.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  deityList: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  placeholder: {
    flex: 1,
    margin: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});
