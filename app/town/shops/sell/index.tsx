/**
 * Sell Items Screen
 * Sell consumables and equipment for gold
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../../src/constants/Colors';
import { Typography } from '../../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../../src/constants/Spacing';
import { useCharacterStore } from '../../../../src/stores/useCharacterStore';
import { useInventoryStore } from '../../../../src/stores/useInventoryStore';
import { useHaptics } from '../../../../src/hooks/useHaptics';
import { getConsumableById } from '../../../../src/data/consumables';
import { getMaterialById, MATERIAL_TIER_COLORS } from '../../../../src/data/materials';
import { RARITY_COLORS } from '../../../../src/types/Consumable';
import type { InventoryItem } from '../../../../src/types/Character';

interface SellableItem {
  item: InventoryItem;
  name: string;
  sellPrice: number;
  icon: string;
  rarity: string;
}

interface ItemCardProps {
  item: SellableItem;
  onPress: () => void;
}

function ItemCard({ item, onPress }: ItemCardProps) {
  // Check both consumable rarity colors and material tier colors
  const rarityColor =
    RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] ||
    MATERIAL_TIER_COLORS[item.rarity] ||
    Colors.text.secondary;

  return (
    <Pressable style={styles.itemCard} onPress={onPress}>
      <Text style={styles.itemIcon}>{item.icon}</Text>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: rarityColor }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>
          Qty: {item.item.quantity}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Sell for</Text>
        <Text style={styles.price}>{item.sellPrice} G</Text>
      </View>
    </Pressable>
  );
}

export default function SellScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const { getGold, getConsumables, getMaterials, removeItem, addGold } = useInventoryStore();

  const [selectedItem, setSelectedItem] = useState<SellableItem | null>(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const gold = getGold();

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

  // Get sellable items from inventory
  const getSellableItems = (): SellableItem[] => {
    const items: SellableItem[] = [];

    // Add consumables
    const consumables = getConsumables();
    for (const invItem of consumables) {
      const consumableData = getConsumableById(invItem.id);
      if (consumableData) {
        items.push({
          item: invItem,
          name: consumableData.name,
          sellPrice: consumableData.sellPrice,
          icon: consumableData.icon || '📦',
          rarity: consumableData.rarity,
        });
      }
    }

    // Add weapons found in dungeon
    const weapons = character?.inventory.filter(i => i.type === 'weapon' && i.weaponData) ?? [];
    for (const invItem of weapons) {
      const w = invItem.weaponData!;
      const sellPrice = Math.max(50, Math.floor((w.finalDamage * 8 + (w.floorFound ?? 1) * 15) * 0.4));
      items.push({
        item: invItem,
        name: w.displayName,
        sellPrice,
        icon: '⚔',
        rarity: w.rarity,
      });
    }

    // Add materials - lookup actual material data for proper pricing
    const materials = getMaterials();
    for (const invItem of materials) {
      const materialData = getMaterialById(invItem.id);
      if (materialData) {
        items.push({
          item: invItem,
          name: materialData.name,
          sellPrice: materialData.sellPrice,
          icon: materialData.icon,
          rarity: materialData.tier, // tier maps to rarity colors
        });
      } else {
        // Fallback for unknown materials
        items.push({
          item: invItem,
          name: invItem.name || invItem.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          sellPrice: 5,
          icon: invItem.icon || '🔧',
          rarity: 'common',
        });
      }
    }

    return items;
  };

  const sellableItems = getSellableItems();

  const handleItemPress = (item: SellableItem) => {
    haptics.light();
    setSelectedItem(item);
    setSellQuantity(1);
    setShowModal(true);
  };

  const handleSell = () => {
    if (!selectedItem) return;

    haptics.medium();

    const totalGold = selectedItem.sellPrice * sellQuantity;

    // Remove items and add gold
    removeItem(selectedItem.item.id, sellQuantity);
    addGold(totalGold);

    haptics.success();
    Alert.alert(
      'Sale Complete',
      `You sold ${sellQuantity}x ${selectedItem.name} for ${totalGold} gold.`,
      [{ text: 'OK', onPress: () => setShowModal(false) }]
    );
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const getTotalSellPrice = () => {
    if (!selectedItem) return 0;
    return selectedItem.sellPrice * sellQuantity;
  };

  const getMaxQuantity = () => {
    if (!selectedItem) return 1;
    return selectedItem.item.quantity;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>SELL ITEMS</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldLabel}>Gold</Text>
            <Text style={styles.goldValue}>{gold.toLocaleString()} G</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>💰</Text>
          <Text style={styles.infoText}>
            Sell your unwanted items for gold. All sales are final.
          </Text>
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Your Items ({sellableItems.length})</Text>

          {sellableItems.map((item) => (
            <ItemCard
              key={item.item.id}
              item={item}
              onPress={() => handleItemPress(item)}
            />
          ))}

          {sellableItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items to sell</Text>
              <Text style={styles.emptySubtext}>
                Find loot in the dungeon to sell here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sell Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalIcon}>{selectedItem.icon}</Text>

                <Text style={styles.modalLabel}>
                  You have {selectedItem.item.quantity} of these
                </Text>

                {/* Quantity selector */}
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Sell quantity:</Text>
                  <View style={styles.quantityControls}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantityValue}>{sellQuantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => setSellQuantity(Math.min(getMaxQuantity(), sellQuantity + 1))}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Quick buttons */}
                <View style={styles.quickButtons}>
                  <Pressable
                    style={styles.quickButton}
                    onPress={() => setSellQuantity(1)}
                  >
                    <Text style={styles.quickButtonText}>1</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickButton}
                    onPress={() => setSellQuantity(Math.min(5, getMaxQuantity()))}
                  >
                    <Text style={styles.quickButtonText}>5</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickButton}
                    onPress={() => setSellQuantity(Math.min(10, getMaxQuantity()))}
                  >
                    <Text style={styles.quickButtonText}>10</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickButton}
                    onPress={() => setSellQuantity(getMaxQuantity())}
                  >
                    <Text style={styles.quickButtonText}>All</Text>
                  </Pressable>
                </View>

                {/* Total */}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>You will receive:</Text>
                  <Text style={styles.totalPrice}>{getTotalSellPrice()} G</Text>
                </View>

                {/* Action buttons */}
                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.sellButton}
                    onPress={handleSell}
                  >
                    <Text style={styles.sellButtonText}>Sell</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    ...Typography.h3,
    color: Colors.text.primary,
    letterSpacing: 2,
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

  // Info
  infoContainer: {
    backgroundColor: Colors.resource.gold + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.resource.gold + '40',
  },
  infoIcon: {
    fontSize: 32,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text.secondary,
    flex: 1,
  },

  // Items
  itemsContainer: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  itemCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  itemIcon: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.body,
    fontWeight: '600',
  },
  itemQuantity: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  price: {
    ...Typography.h6,
    color: Colors.resource.gold,
  },

  // Empty state
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.h5,
    color: Colors.text.muted,
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginTop: Spacing.md,
  },
  modalLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  quantityLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  quantityButtonText: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  quantityValue: {
    ...Typography.h5,
    color: Colors.text.primary,
    minWidth: 32,
    textAlign: 'center',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  quickButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  quickButtonText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  totalLabel: {
    ...Typography.h6,
    color: Colors.text.secondary,
  },
  totalPrice: {
    ...Typography.h4,
    color: Colors.resource.gold,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.text.muted,
  },
  sellButton: {
    flex: 1,
    backgroundColor: Colors.resource.gold,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  sellButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },
});
