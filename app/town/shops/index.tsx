/**
 * Shop Hub Screen
 * Choose between different shop types
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useShopStore } from '../../../src/stores/useShopStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { SHOP_NPCS } from '../../../src/types/Shop';

interface ShopCardProps {
  title: string;
  description: string;
  icon: string;
  npcName: string;
  onPress: () => void;
  disabled?: boolean;
}

function ShopCard({ title, description, icon, npcName, onPress, disabled }: ShopCardProps) {
  return (
    <Pressable
      style={[styles.shopCard, disabled && styles.shopCardDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.shopIcon}>{icon}</Text>
      <View style={styles.shopInfo}>
        <Text style={[styles.shopTitle, disabled && styles.shopTitleDisabled]}>
          {title}
        </Text>
        <Text style={[styles.shopNpc, disabled && styles.shopNpcDisabled]}>
          Run by {npcName}
        </Text>
        <Text style={[styles.shopDesc, disabled && styles.shopDescDisabled]}>
          {description}
        </Text>
      </View>
      <Text style={styles.shopArrow}>&gt;</Text>
    </Pressable>
  );
}

export default function ShopHubScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const { refreshStock, shouldRefreshStock } = useShopStore();

  // Refresh stock on first visit or when needed
  useEffect(() => {
    if (shouldRefreshStock()) {
      refreshStock();
    }
  }, []);

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

  const handleGeneralStore = () => {
    haptics.light();
    router.push('/town/shops/general');
  };

  const handleEquipmentShop = () => {
    haptics.light();
    router.push('/town/shops/equipment');
  };

  const handleSellItems = () => {
    haptics.light();
    router.push('/town/shops/sell');
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const generalNPC = SHOP_NPCS.general;
  const equipmentNPC = SHOP_NPCS.equipment;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>SHOPS</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldLabel}>Gold</Text>
            <Text style={styles.goldValue}>{character.gold.toLocaleString()} G</Text>
          </View>
        </View>

        {/* Welcome message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome to the marketplace! Browse our wares or sell your loot.
          </Text>
        </View>

        {/* Shop Options */}
        <View style={styles.shopsContainer}>
          <Text style={styles.sectionTitle}>Available Shops</Text>

          <ShopCard
            title="General Store"
            description="Potions, food, and supplies for your adventures"
            icon={generalNPC.icon}
            npcName={generalNPC.name}
            onPress={handleGeneralStore}
          />

          <ShopCard
            title="Equipment Vendor"
            description="Weapons and armor for sale"
            icon={equipmentNPC.icon}
            npcName={equipmentNPC.name}
            onPress={handleEquipmentShop}
          />
        </View>

        {/* Sell Section */}
        <View style={styles.sellContainer}>
          <Text style={styles.sectionTitle}>Services</Text>

          <Pressable style={styles.sellCard} onPress={handleSellItems}>
            <Text style={styles.sellIcon}>💰</Text>
            <View style={styles.sellInfo}>
              <Text style={styles.sellTitle}>Sell Items</Text>
              <Text style={styles.sellDesc}>
                Turn your unwanted loot into gold
              </Text>
            </View>
            <Text style={styles.shopArrow}>&gt;</Text>
          </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.text.accent,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    letterSpacing: 4,
  },
  goldContainer: {
    alignItems: 'flex-end',
  },
  goldLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  goldValue: {
    ...Typography.h5,
    color: Colors.resource.gold,
  },

  // Welcome
  welcomeContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  welcomeText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Shops
  shopsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  shopCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  shopCardDisabled: {
    opacity: 0.5,
  },
  shopIcon: {
    fontSize: 36,
  },
  shopInfo: {
    flex: 1,
  },
  shopTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  shopTitleDisabled: {
    color: Colors.text.muted,
  },
  shopNpc: {
    ...Typography.caption,
    color: Colors.text.accent,
    fontStyle: 'italic',
    marginTop: 2,
  },
  shopNpcDisabled: {
    color: Colors.text.muted,
  },
  shopDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  shopDescDisabled: {
    color: Colors.text.muted,
  },
  shopArrow: {
    ...Typography.h4,
    color: Colors.text.muted,
  },

  // Sell section
  sellContainer: {
    gap: Spacing.md,
  },
  sellCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '40',
  },
  sellCardDisabled: {
    opacity: 0.5,
  },
  sellIcon: {
    fontSize: 36,
  },
  sellInfo: {
    flex: 1,
  },
  sellTitle: {
    ...Typography.h5,
    color: Colors.resource.gold,
  },
  sellTitleDisabled: {
    color: Colors.text.muted,
  },
  sellDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  sellDescDisabled: {
    color: Colors.text.muted,
  },
});
