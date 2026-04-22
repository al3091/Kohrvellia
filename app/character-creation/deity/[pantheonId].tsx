/**
 * Deity List Screen — Screen 3b / 6
 * Deities from one pantheon. Search + domain filter only (no stat filter).
 * Deity detail via shared DeityDetailModal.
 */

import React, { useMemo, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius } from '../../../src/constants/Spacing';
import { Header } from '../../../src/components/ui';
import { DeityCard } from '../../../src/components/character-creation/DeityCard';
import { DeitySearchBar } from '../../../src/components/character-creation/DeitySearchBar';
import { DeityDetailModal } from '../../../src/components/character-creation/DeityDetailModal';
import { useCreationState } from '../../../src/hooks/useCreationState';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { BACKSTORIES } from '../../../src/types/Character';
import { pantheonInfo, getDeityByPantheon } from '../../../src/data/pantheons';
import type { Deity, DeityDomain } from '../../../src/types/Deity';

export default function DeityListScreen() {
  const router = useRouter();
  const { pantheonId } = useLocalSearchParams<{ pantheonId: string }>();
  const haptics = useHaptics();
  const { backstoryId, selectedDeityId, setDeity } = useCreationState();
  const [detailDeity, setDetailDeity] = useState<Deity | null>(null);
  const flatListRef = useRef<FlatList<Deity>>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<DeityDomain | 'all'>('all');

  const pantheon = useMemo(() => {
    return pantheonInfo.find((p) => p.id === pantheonId);
  }, [pantheonId]);

  const deities = useMemo(() => {
    return getDeityByPantheon(pantheonId || '');
  }, [pantheonId]);

  const affinityDomains = useMemo(() => {
    if (!backstoryId) return [];
    return BACKSTORIES[backstoryId]?.deityAffinity || [];
  }, [backstoryId]);

  // Available domains within this pantheon for the filter chips
  const availableDomains = useMemo(() => {
    const domains = [...new Set(deities.map((d) => d.domain as DeityDomain))];
    return domains;
  }, [deities]);

  const filteredDeities = useMemo(() => {
    let result = [...deities];

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

    if (domainFilter !== 'all') {
      result = result.filter((deity) => deity.domain === domainFilter);
    }

    return result.sort((a, b) => {
      const aAffinity = affinityDomains.includes(a.domain) ? 0 : 1;
      const bAffinity = affinityDomains.includes(b.domain) ? 0 : 1;
      return aAffinity - bAffinity;
    });
  }, [deities, affinityDomains, searchQuery, domainFilter]);

  const handleSelectDeity = useCallback((deity: Deity, index: number) => {
    haptics.light();
    setDetailDeity(deity);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.3,
    });
  }, [haptics]);

  const handleConfirmDeity = (deityId: string) => {
    setDeity(deityId);
    setDetailDeity(null);
    router.push('/character-creation/stats');
  };

  const handleCloseDetail = () => {
    setDetailDeity(null);
  };

  const handleBack = () => {
    router.back();
  };

  const renderDeity = ({ item, index }: { item: Deity; index: number }) => (
    <DeityCard
      deity={item}
      selected={selectedDeityId === item.id}
      onSelect={(deity) => handleSelectDeity(deity, index)}
      isAffinity={affinityDomains.includes(item.domain)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={pantheon?.name || 'Select Deity'}
        subtitle={pantheon?.description}
        showBack
        onBack={handleBack}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <DeitySearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search deities..."
              resultCount={filteredDeities.length}
              totalCount={deities.length}
            />
          </View>
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/character-creation/deity/compare');
            }}
            style={styles.compareButton}
          >
            <Text style={styles.compareIcon}>⚖️</Text>
          </Pressable>
        </View>

        {/* Domain filter — only domains present in this pantheon */}
        {availableDomains.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <Pressable
              style={[styles.filterChip, domainFilter === 'all' && styles.filterChipActive]}
              onPress={() => { haptics.light(); setDomainFilter('all'); }}
            >
              <Text style={[styles.filterChipText, domainFilter === 'all' && styles.filterChipTextActive]}>All</Text>
            </Pressable>
            {availableDomains.map((dom) => (
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
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredDeities}
        renderItem={renderDeity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.3,
            });
          }, 100);
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No deities match your search</Text>
            <Pressable onPress={() => { setSearchQuery(''); setDomainFilter('all'); }} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />

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
    paddingBottom: Spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  searchBarWrapper: {
    flex: 1,
  },
  compareButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  compareIcon: {
    fontSize: 20,
  },
  filterScroll: {
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
  list: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  clearButton: {
    padding: Spacing.md,
  },
  clearText: {
    ...Typography.body,
    color: Colors.text.accent,
  },
});
