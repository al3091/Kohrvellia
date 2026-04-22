/**
 * Town Hub Screen
 * Central navigation point for all town activities
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { BAG_CAPACITY } from '../../src/types/Character';
import { useSoundStore } from '../../src/stores/useSoundStore';

interface LocationCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  highlight?: boolean;
  badge?: string;
}

function LocationCard({ title, description, icon, onPress, disabled, highlight, badge }: LocationCardProps) {
  return (
    <Pressable
      style={[
        styles.locationCard,
        disabled && styles.locationCardDisabled,
        highlight && styles.locationCardHighlight,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.locationIcon}>{icon}</Text>
      <View style={styles.locationInfo}>
        <View style={styles.locationHeader}>
          <Text style={[styles.locationTitle, disabled && styles.locationTitleDisabled]}>
            {title}
          </Text>
          {badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.locationDesc, disabled && styles.locationDescDisabled]}>
          {description}
        </Text>
      </View>
      <Text style={styles.locationArrow}>&gt;</Text>
    </Pressable>
  );
}

export default function TownHubScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, hasPendingExcelia, initializePendingExcelia, canLevelUp, getDerivedStatsWithBlessings } = useCharacterStore();
  const { startNewRun, currentRun } = useDungeonStore();

  useEffect(() => {
    useSoundStore.getState().playBGM('shop');
  }, []);

  const pendingExcelia = hasPendingExcelia();
  const derivedStats = getDerivedStatsWithBlessings();

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No character found</Text>
          <Pressable style={styles.errorButton} onPress={() => router.replace('/')}>
            <Text style={styles.errorButtonText}>Return to Title</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleFamiliaHome = () => {
    haptics.light();
    router.push('/town/familia');
  };

  const enterDungeon = () => {
    // Start a new run if there isn't one already
    if (!currentRun) {
      startNewRun();
    }
    // Initialize pending excelia for this run
    initializePendingExcelia();
    router.push('/dungeon/floor');
  };

  const handleDungeonEntrance = () => {
    haptics.medium();

    // Warn if pending excelia
    if (pendingExcelia) {
      Alert.alert(
        'Uncommitted Growth',
        'You have pending excelia that has not been committed through the Blessing Rite. If you die in the dungeon, this growth will be lost forever.\n\nProceed anyway?',
        [
          { text: 'Go Back', style: 'cancel' },
          {
            text: 'Enter Dungeon',
            style: 'destructive',
            onPress: enterDungeon,
          },
        ]
      );
      return;
    }

    // Warn if HP/SP is low
    const hpPercent = character.currentHP / derivedStats.maxHP;
    const spPercent = character.currentSP / derivedStats.maxSP;
    if (hpPercent < 0.5 || spPercent < 0.3) {
      Alert.alert(
        'Low Resources',
        'Your HP or SP is low. Consider resting at the Familia Home before entering the dungeon.',
        [
          { text: 'Rest First', onPress: () => router.push('/town/familia') },
          { text: 'Enter Anyway', style: 'destructive', onPress: enterDungeon },
        ]
      );
      return;
    }

    enterDungeon();
  };

  const handleShops = () => {
    haptics.light();
    router.push('/town/shops');
  };

  const handleBlacksmith = () => {
    haptics.light();
    router.push('/town/blacksmith');
  };

  const handleInventory = () => {
    haptics.light();
    router.push('/town/inventory');
  };

  const handleGuild = () => {
    haptics.light();
    router.push('/town/guildhall');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.townName}>ORARIO</Text>
          <Text style={styles.townSubtitle}>The Labyrinth City</Text>
        </View>

        {/* Character Summary - Tappable to view full stats */}
        <Pressable
          style={styles.characterSummary}
          onPress={() => {
            haptics.light();
            router.push('/town/character');
          }}
        >
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterEpithet}>{character.epithet}</Text>
          </View>
          <View style={styles.characterStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{character.level}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Gold</Text>
              <Text style={styles.statValueGold}>{character.gold.toLocaleString()} G</Text>
            </View>
          </View>
          <Text style={styles.viewStatsHint}>View Stats &gt;</Text>
        </Pressable>

        {/* Pending Excelia Warning */}
        {pendingExcelia && (
          <View style={styles.pendingWarning}>
            <Text style={styles.pendingWarningIcon}>!</Text>
            <View style={styles.pendingWarningContent}>
              <Text style={styles.pendingWarningTitle}>Growth Awaits</Text>
              <Text style={styles.pendingWarningText}>
                Visit your deity to receive the Blessing Rite and commit your growth.
              </Text>
            </View>
          </View>
        )}

        {/* Resource Bars */}
        <View style={styles.resourceBars}>
          <View style={styles.resourceRow}>
            <Text style={styles.resourceLabel}>HP</Text>
            <View style={styles.resourceBarBg}>
              <View
                style={[
                  styles.resourceBarFill,
                  styles.hpBarFill,
                  { width: `${(character.currentHP / derivedStats.maxHP) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.resourceText}>
              {character.currentHP}/{derivedStats.maxHP}
            </Text>
          </View>
          <View style={styles.resourceRow}>
            <Text style={styles.resourceLabel}>SP</Text>
            <View style={styles.resourceBarBg}>
              <View
                style={[
                  styles.resourceBarFill,
                  styles.spBarFill,
                  { width: `${(character.currentSP / derivedStats.maxSP) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.resourceText}>
              {character.currentSP}/{derivedStats.maxSP}
            </Text>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.locationsContainer}>
          <Text style={styles.sectionTitle}>Locations</Text>

          <LocationCard
            title="Familia Home"
            description="Rest, heal, and receive your deity's blessing"
            icon="🏠"
            onPress={handleFamiliaHome}
            highlight={pendingExcelia}
            badge={pendingExcelia ? 'NEW' : undefined}
          />

          <LocationCard
            title="Dungeon Entrance"
            description="Descend into the labyrinth beneath the city"
            icon="⚔️"
            onPress={handleDungeonEntrance}
          />

          <LocationCard
            title="Shops"
            description="Purchase weapons, armor, and supplies"
            icon="🛒"
            onPress={handleShops}
          />

          <LocationCard
            title="Blacksmith"
            description="Identify mysterious weapons and upgrade quality"
            icon="🔨"
            onPress={handleBlacksmith}
          />

          <LocationCard
            title="Inventory"
            description="Manage your bag and equipped gear"
            icon="🎒"
            onPress={handleInventory}
            badge={character.inventory.length > 0 ? `${character.inventory.length}/${BAG_CAPACITY}` : undefined}
          />

          <LocationCard
            title="Guild Hall"
            description="Record your feats and seek ascension"
            icon="📋"
            onPress={handleGuild}
            badge={canLevelUp() ? 'ASCEND' : undefined}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing['2xl'],
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginBottom: Spacing.xl,
  },
  errorButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  errorButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.muted,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
    marginBottom: Spacing.lg,
  },
  townName: {
    ...Typography.h1,
    color: Colors.text.accent,
    letterSpacing: 6,
  },
  townSubtitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 2,
    marginTop: Spacing.xs,
  },

  // Character Summary
  characterSummary: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  characterEpithet: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  characterStats: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  statValue: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  statValueGold: {
    ...Typography.h6,
    color: Colors.resource.gold,
  },
  viewStatsHint: {
    ...Typography.caption,
    color: Colors.text.accent,
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.md,
    fontSize: 11,
  },

  // Pending Warning
  pendingWarning: {
    backgroundColor: Colors.resource.gold + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '60',
  },
  pendingWarningIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.resource.gold,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    backgroundColor: Colors.resource.gold + '30',
    borderRadius: 16,
  },
  pendingWarningContent: {
    flex: 1,
  },
  pendingWarningTitle: {
    ...Typography.h6,
    color: Colors.resource.gold,
    marginBottom: 2,
  },
  pendingWarningText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },

  // Resource Bars
  resourceBars: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  resourceLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    width: 24,
    fontWeight: '600',
  },
  resourceBarBg: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  resourceBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  hpBarFill: {
    backgroundColor: Colors.resource.hp,
  },
  spBarFill: {
    backgroundColor: Colors.resource.sp,
  },
  resourceText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    width: 60,
    textAlign: 'right',
  },

  // Locations
  locationsContainer: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  locationCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  locationCardDisabled: {
    opacity: 0.5,
  },
  locationCardHighlight: {
    borderColor: Colors.resource.gold,
    borderWidth: BorderWidth.normal,
  },
  locationIcon: {
    fontSize: 32,
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  locationTitleDisabled: {
    color: Colors.text.muted,
  },
  locationDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  locationDescDisabled: {
    color: Colors.text.muted,
  },
  locationArrow: {
    ...Typography.h4,
    color: Colors.text.muted,
  },
  badgeContainer: {
    backgroundColor: Colors.resource.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.background.primary,
  },
});
