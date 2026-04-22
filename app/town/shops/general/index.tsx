/**
 * General Store Screen
 * Buy consumables (potions, food, supplies)
 */

import React, { useState, useEffect } from 'react';
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
import { useShopStore } from '../../../../src/stores/useShopStore';
import { useInventoryStore } from '../../../../src/stores/useInventoryStore';
import { useHaptics } from '../../../../src/hooks/useHaptics';
import { SHOP_NPCS, getReputationDiscount } from '../../../../src/types/Shop';
import { getConsumableById } from '../../../../src/data/consumables';
import { RARITY_COLORS, formatConsumableEffect } from '../../../../src/types/Consumable';
import type { Consumable } from '../../../../src/types/Consumable';

interface ItemCardProps {
  consumable: Consumable;
  price: number;
  basePrice: number;
  canAfford: boolean;
  onPress: () => void;
}

function ItemCard({ consumable, price, basePrice, canAfford, onPress }: ItemCardProps) {
  const hasDiscount = price < basePrice;
  const rarityColor = RARITY_COLORS[consumable.rarity] || Colors.text.secondary;

  return (
    <Pressable
      style={[styles.itemCard, !canAfford && styles.itemCardDisabled]}
      onPress={onPress}
    >
      <Text style={styles.itemIcon}>{consumable.icon || '📦'}</Text>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: rarityColor }]}>
          {consumable.name}
        </Text>
        <Text style={styles.itemEffect}>
          {formatConsumableEffect(consumable.effect)}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        {hasDiscount && (
          <Text style={styles.originalPrice}>{basePrice} G</Text>
        )}
        <Text style={[styles.price, !canAfford && styles.priceUnaffordable]}>
          {price} G
        </Text>
      </View>
    </Pressable>
  );
}

export default function GeneralStoreScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const {
    getAvailableStock,
    getConsumablePrice,
    purchaseConsumable,
    getReputation,
    refreshStock,
    shouldRefreshStock,
  } = useShopStore();
  const { getGold, canAddItem } = useInventoryStore();

  const [selectedItem, setSelectedItem] = useState<Consumable | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const npc = SHOP_NPCS.general;
  const reputation = getReputation('general');
  const discount = getReputationDiscount(reputation);
  const gold = getGold();

  // Refresh stock if needed
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

  const stock = getAvailableStock();

  const handleItemPress = (consumable: Consumable) => {
    haptics.light();
    setSelectedItem(consumable);
    setQuantity(1);
    setShowModal(true);
  };

  const handlePurchase = () => {
    if (!selectedItem) return;

    haptics.medium();

    // Check inventory space
    if (!canAddItem()) {
      Alert.alert('Inventory Full', 'You need to free up space before buying more items.');
      return;
    }

    const result = purchaseConsumable(selectedItem.id, quantity);

    if (result.success) {
      haptics.success();
      Alert.alert(
        'Purchase Complete',
        `You bought ${quantity}x ${selectedItem.name} for ${result.goldSpent} gold.`,
        [{ text: 'OK', onPress: () => setShowModal(false) }]
      );
    } else {
      haptics.error();
      Alert.alert('Purchase Failed', result.reason || 'Unable to complete purchase.');
    }
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const getItemPrice = (consumableId: string) => {
    return getConsumablePrice(consumableId, 1);
  };

  const getTotalPrice = () => {
    if (!selectedItem) return 0;
    return getConsumablePrice(selectedItem.id, quantity);
  };

  // Get discount display text
  const getDiscountText = () => {
    if (discount > 0) {
      return `${Math.round(discount * 100)}% off`;
    } else if (discount < 0) {
      return `${Math.round(Math.abs(discount) * 100)}% markup`;
    }
    return null;
  };

  // Get reputation tier name
  const getReputationTier = () => {
    if (reputation >= 16) return 'Trusted';
    if (reputation >= 11) return 'Friendly';
    if (reputation >= 6) return 'Known';
    if (reputation >= 1) return 'Neutral';
    if (reputation >= -4) return 'Wary';
    if (reputation >= -9) return 'Unfriendly';
    return 'Hostile';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>GENERAL STORE</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldLabel}>Gold</Text>
            <Text style={styles.goldValue}>{gold.toLocaleString()} G</Text>
          </View>
        </View>

        {/* NPC Greeting */}
        <View style={styles.npcContainer}>
          <Text style={styles.npcIcon}>{npc.icon}</Text>
          <View style={styles.npcInfo}>
            <Text style={styles.npcName}>{npc.name}</Text>
            <Text style={styles.npcGreeting}>"{npc.greeting}"</Text>
          </View>
        </View>

        {/* Reputation Display */}
        <View style={styles.reputationContainer}>
          <View style={styles.reputationRow}>
            <Text style={styles.reputationLabel}>Reputation with {npc.name}</Text>
            <Text style={[
              styles.reputationValue,
              reputation >= 6 && styles.reputationPositive,
              reputation <= -5 && styles.reputationNegative,
            ]}>
              {getReputationTier()} ({reputation > 0 ? '+' : ''}{reputation})
            </Text>
          </View>
          {getDiscountText() && (
            <Text style={[
              styles.discountText,
              discount > 0 && styles.discountPositive,
              discount < 0 && styles.discountNegative,
            ]}>
              {getDiscountText()}
            </Text>
          )}
        </View>

        {/* Items for Sale */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Available Items</Text>

          {stock.map((stockItem) => {
            const consumable = getConsumableById(stockItem.consumableId);
            if (!consumable) return null;

            const price = getItemPrice(consumable.id);
            const canAfford = gold >= price;

            return (
              <ItemCard
                key={consumable.id}
                consumable={consumable}
                price={price}
                basePrice={stockItem.basePrice}
                canAfford={canAfford}
                onPress={() => handleItemPress(consumable)}
              />
            );
          })}

          {stock.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items available</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Purchase Modal */}
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
                <Text style={[styles.modalRarity, { color: RARITY_COLORS[selectedItem.rarity] }]}>
                  {selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1)}
                </Text>
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                <Text style={styles.modalEffect}>
                  {formatConsumableEffect(selectedItem.effect)}
                </Text>

                {/* Quantity selector */}
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => setQuantity(Math.min(10, quantity + 1))}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Total price */}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={[
                    styles.totalPrice,
                    gold < getTotalPrice() && styles.totalPriceUnaffordable,
                  ]}>
                    {getTotalPrice()} G
                  </Text>
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
                    style={[
                      styles.buyButton,
                      gold < getTotalPrice() && styles.buyButtonDisabled,
                    ]}
                    onPress={handlePurchase}
                    disabled={gold < getTotalPrice()}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
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

  // NPC
  npcContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  npcIcon: {
    fontSize: 48,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  npcGreeting: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  // Reputation
  reputationContainer: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  reputationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reputationLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  reputationValue: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  reputationPositive: {
    color: Colors.rarity?.uncommon || '#10B981',
  },
  reputationNegative: {
    color: Colors.ui.error,
  },
  discountText: {
    ...Typography.caption,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  discountPositive: {
    color: Colors.rarity?.uncommon || '#10B981',
  },
  discountNegative: {
    color: Colors.ui.error,
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
  itemCardDisabled: {
    opacity: 0.6,
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
  itemEffect: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.text.muted,
    textDecorationLine: 'line-through',
  },
  price: {
    ...Typography.h6,
    color: Colors.resource.gold,
  },
  priceUnaffordable: {
    color: Colors.ui.error,
  },

  // Empty state
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.muted,
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
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  modalRarity: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  modalEffect: {
    ...Typography.body,
    color: Colors.text.accent,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  totalLabel: {
    ...Typography.h5,
    color: Colors.text.secondary,
  },
  totalPrice: {
    ...Typography.h4,
    color: Colors.resource.gold,
  },
  totalPriceUnaffordable: {
    color: Colors.ui.error,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
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
  buyButton: {
    flex: 1,
    backgroundColor: Colors.resource.gold,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },
});
