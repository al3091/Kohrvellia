/**
 * Equipment Shop Screen
 * Buy procedurally generated weapons and armor
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { useGameStore } from '../../../../src/stores/useGameStore';
import { useHaptics } from '../../../../src/hooks/useHaptics';
import { SHOP_NPCS, getReputationDiscount } from '../../../../src/types/Shop';
import type { Weapon, WeaponCategory } from '../../../../src/types/Weapon';
import { WEAPON_CATEGORY_INFO } from '../../../../src/types/Weapon';
import type { Armor } from '../../../../src/types/Armor';
import { ARMOR_TYPE_ICONS, ARMOR_SLOT_ICONS } from '../../../../src/data/armor/baseArmors';
import type { EquipmentStock } from '../../../../src/types/Shop';

// Rarity colors for equipment
const RARITY_COLORS: Record<string, string> = {
  junk: '#6a6a7a',
  common: '#9a9a9a',
  uncommon: '#5fa55f',
  rare: '#5b7bb8',
  epic: '#7b5fb3',
  legendary: '#c9a227',
};

function isArmorItem(item: Weapon | Armor): item is Armor {
  return 'finalDefense' in item;
}

interface WeaponCardProps {
  stock: EquipmentStock;
  price: number;
  canAfford: boolean;
  onPress: () => void;
}

function WeaponCard({ stock, price, canAfford, onPress }: WeaponCardProps) {
  const weapon = stock.item as Weapon;
  const rarityColor = RARITY_COLORS[weapon.rarity] || Colors.text.secondary;

  return (
    <Pressable
      style={[styles.itemCard, !canAfford && styles.itemCardDisabled]}
      onPress={onPress}
    >
      <View style={styles.itemIconContainer}>
        <Text style={styles.itemIcon}>
          {weapon.base.range === 'ranged' ? '🏹' : '⚔️'}
        </Text>
        <Text style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
          {weapon.rarity.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: rarityColor }]} numberOfLines={1}>
          {weapon.displayName}
        </Text>
        <Text style={styles.itemStats}>
          DMG {weapon.finalDamage} | ACC {weapon.finalAccuracy}% | CRIT {weapon.finalCritChance}%
        </Text>
        <Text style={styles.itemCategory}>
          {weapon.base.category} - {weapon.base.name}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, !canAfford && styles.priceUnaffordable]}>
          {price} G
        </Text>
      </View>
    </Pressable>
  );
}

interface ArmorCardProps {
  stock: EquipmentStock;
  price: number;
  canAfford: boolean;
  onPress: () => void;
}

function ArmorCard({ stock, price, canAfford, onPress }: ArmorCardProps) {
  const armor = stock.item as Armor;
  const rarityColor = RARITY_COLORS[armor.rarity] || Colors.text.secondary;
  const typeIcon = ARMOR_TYPE_ICONS[armor.base.type] || '🛡️';
  const slotIcon = ARMOR_SLOT_ICONS[armor.base.slot] || '🧥';

  return (
    <Pressable
      style={[styles.itemCard, !canAfford && styles.itemCardDisabled]}
      onPress={onPress}
    >
      <View style={styles.itemIconContainer}>
        <Text style={styles.itemIcon}>{typeIcon}</Text>
        <Text style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
          {armor.rarity.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: rarityColor }]} numberOfLines={1}>
          {armor.displayName}
        </Text>
        <Text style={styles.itemStats}>
          DEF {armor.finalDefense} | MDEF {armor.finalMagicDefense}
          {armor.speedPenalty < 0 ? ` | SPD ${armor.speedPenalty.toFixed(0)}%` : ''}
        </Text>
        <Text style={styles.itemCategory}>
          {slotIcon} {armor.base.slot.charAt(0).toUpperCase() + armor.base.slot.slice(1)} — {armor.base.type}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, !canAfford && styles.priceUnaffordable]}>
          {price} G
        </Text>
      </View>
    </Pressable>
  );
}

export default function EquipmentShopScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const {
    getEquipmentForSale,
    getEquipmentPrice,
    purchaseEquipment,
    getReputation,
    refreshStock,
    shouldRefreshStock,
    equipmentStock,
    deepestFloorAtRefresh,
  } = useShopStore();
  const { getGold, canAddItem } = useInventoryStore();
  const bestFloorReached = useGameStore((s) => s.bestFloorReached);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'weapons' | 'armor'>('all');
  const [statFilter, setStatFilter] = useState<WeaponCategory | 'all'>('all');

  const npc = SHOP_NPCS.equipment;
  const reputation = getReputation('equipment');
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

  const availableStock = getEquipmentForSale();

  // Filter stock by type and weapon category
  const filteredStock = useMemo(() => {
    let result = availableStock;

    if (typeFilter === 'weapons') {
      result = result.filter((s) => !isArmorItem(s.item));
    } else if (typeFilter === 'armor') {
      result = result.filter((s) => isArmorItem(s.item));
    }

    if (statFilter !== 'all' && typeFilter !== 'armor') {
      result = result.filter((s) => {
        if (isArmorItem(s.item)) return false;
        return (s.item as Weapon).base.category === statFilter;
      });
    }

    return result;
  }, [availableStock, typeFilter, statFilter]);

  const handleItemPress = (index: number) => {
    haptics.light();
    // Get the actual stock item from filtered list
    const stockItem = filteredStock[index];
    if (!stockItem) return;
    // Find its index in the full equipmentStock
    const stockIndex = equipmentStock.findIndex((s) => s === stockItem);
    if (stockIndex === -1) return;
    setSelectedIndex(stockIndex);
    setShowModal(true);
  };

  const handlePurchase = () => {
    if (selectedIndex === null) return;

    haptics.medium();

    // Check inventory space
    if (!canAddItem()) {
      Alert.alert('Inventory Full', 'You need to free up space before buying.');
      return;
    }

    const result = purchaseEquipment(selectedIndex);

    if (result.success) {
      haptics.success();
      const stockItem = equipmentStock[selectedIndex];
      const itemName = isArmorItem(stockItem.item)
        ? (stockItem.item as Armor).displayName
        : (stockItem.item as Weapon).displayName;
      Alert.alert(
        'Purchase Complete',
        `You bought ${itemName} for ${result.goldSpent} gold.`,
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

  const getSelectedItem = (): Weapon | Armor | null => {
    if (selectedIndex === null) return null;
    return equipmentStock[selectedIndex]?.item ?? null;
  };

  const getSelectedWeapon = (): Weapon | null => {
    const item = getSelectedItem();
    if (!item || isArmorItem(item)) return null;
    return item as Weapon;
  };

  const getSelectedArmor = (): Armor | null => {
    const item = getSelectedItem();
    if (!item || !isArmorItem(item)) return null;
    return item as Armor;
  };

  const getSelectedPrice = (): number => {
    if (selectedIndex === null) return 0;
    return getEquipmentPrice(selectedIndex);
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

  const selectedWeapon = getSelectedWeapon();
  const selectedArmor = getSelectedArmor();
  const selectedPrice = getSelectedPrice();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>EQUIPMENT</Text>
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

        {/* Stock info */}
        <View style={styles.stockInfo}>
          <Text style={styles.stockInfoText}>
            {'Stock refreshes when you descend to new floors.\nCurrent pool: floor '}
            <Text style={styles.stockInfoHighlight}>{deepestFloorAtRefresh}</Text>
            {' · '}
            <Text style={styles.stockInfoHighlight}>{equipmentStock.length}</Text>
            {' items'}
            {bestFloorReached <= deepestFloorAtRefresh
              ? '\n— Descend deeper to refresh stock'
              : ''}
          </Text>
        </View>

        {/* Type filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {(['all', 'weapons', 'armor'] as const).map((t) => (
              <Pressable
                key={t}
                style={[styles.filterChip, typeFilter === t && styles.filterChipActive]}
                onPress={() => { haptics.light(); setTypeFilter(t); if (t === 'armor') setStatFilter('all'); }}
              >
                <Text style={[styles.filterChipText, typeFilter === t && styles.filterChipTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stat filter (weapons only) */}
        {typeFilter !== 'armor' && (
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              <Pressable
                style={[styles.filterChip, statFilter === 'all' && styles.filterChipActive]}
                onPress={() => { haptics.light(); setStatFilter('all'); }}
              >
                <Text style={[styles.filterChipText, statFilter === 'all' && styles.filterChipTextActive]}>All Stats</Text>
              </Pressable>
              {(['STR', 'AGI', 'PER', 'INT', 'WIS', 'CHA', 'END', 'LCK'] as WeaponCategory[]).map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.filterChip, statFilter === cat && styles.filterChipActive]}
                  onPress={() => { haptics.light(); setStatFilter(cat); }}
                >
                  <Text style={[styles.filterChipText, statFilter === cat && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Items for Sale */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>
            Available Equipment ({filteredStock.length}{filteredStock.length !== availableStock.length ? ` / ${availableStock.length}` : ''})
          </Text>

          {filteredStock.map((stockItem, index) => {
            const actualIndex = equipmentStock.findIndex((s) => s === stockItem);
            const price = getEquipmentPrice(actualIndex);
            const canAfford = gold >= price;

            if (isArmorItem(stockItem.item)) {
              return (
                <ArmorCard
                  key={stockItem.item.id}
                  stock={stockItem}
                  price={price}
                  canAfford={canAfford}
                  onPress={() => handleItemPress(index)}
                />
              );
            }

            return (
              <WeaponCard
                key={stockItem.item.id}
                stock={stockItem}
                price={price}
                canAfford={canAfford}
                onPress={() => handleItemPress(index)}
              />
            );
          })}

          {filteredStock.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {typeFilter === 'armor'
                  ? 'No armor available. Check back after exploring more floors.'
                  : statFilter !== 'all'
                    ? `No ${WEAPON_CATEGORY_INFO[statFilter].name} weapons available.`
                    : 'No equipment available. Check back after exploring more floors.'}
              </Text>
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
            {(selectedWeapon || selectedArmor) && (
              <>
                {selectedWeapon && (
                  <>
                    <Text style={[styles.modalTitle, { color: RARITY_COLORS[selectedWeapon.rarity] }]}>
                      {selectedWeapon.displayName}
                    </Text>
                    <Text style={[styles.modalRarity, { color: RARITY_COLORS[selectedWeapon.rarity] }]}>
                      {selectedWeapon.rarity.charAt(0).toUpperCase() + selectedWeapon.rarity.slice(1)} {selectedWeapon.base.name}
                    </Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Damage</Text>
                        <Text style={styles.statValue}>{selectedWeapon.finalDamage}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Accuracy</Text>
                        <Text style={styles.statValue}>{selectedWeapon.finalAccuracy}%</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Crit</Text>
                        <Text style={styles.statValue}>{selectedWeapon.finalCritChance}%</Text>
                      </View>
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Category: </Text>
                        <Text style={styles.detailValue}>{selectedWeapon.base.category} ({selectedWeapon.base.range})</Text>
                      </Text>
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Material: </Text>
                        <Text style={styles.detailValue}>{selectedWeapon.material.name}</Text>
                      </Text>
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Quality: </Text>
                        <Text style={styles.detailValue}>{selectedWeapon.quality.name}</Text>
                      </Text>
                      {selectedWeapon.enchantment && (
                        <Text style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Enchantment: </Text>
                          <Text style={[styles.detailValue, { color: Colors.text.accent }]}>
                            {selectedWeapon.enchantment.name}
                          </Text>
                        </Text>
                      )}
                    </View>
                  </>
                )}

                {selectedArmor && (
                  <>
                    <Text style={[styles.modalTitle, { color: RARITY_COLORS[selectedArmor.rarity] }]}>
                      {selectedArmor.displayName}
                    </Text>
                    <Text style={[styles.modalRarity, { color: RARITY_COLORS[selectedArmor.rarity] }]}>
                      {selectedArmor.rarity.charAt(0).toUpperCase() + selectedArmor.rarity.slice(1)} {selectedArmor.base.name}
                    </Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Defense</Text>
                        <Text style={styles.statValue}>{selectedArmor.finalDefense}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Mag.Def</Text>
                        <Text style={styles.statValue}>{selectedArmor.finalMagicDefense}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Slot</Text>
                        <Text style={styles.statValue}>
                          {selectedArmor.base.slot.charAt(0).toUpperCase() + selectedArmor.base.slot.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type: </Text>
                        <Text style={styles.detailValue}>{selectedArmor.base.type} — {selectedArmor.base.type === 'heavy' ? 'High DEF, Low MDEF' : selectedArmor.base.type === 'robes' ? 'High MDEF, Low DEF' : 'Balanced'}</Text>
                      </Text>
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Material: </Text>
                        <Text style={styles.detailValue}>{selectedArmor.material.name}</Text>
                      </Text>
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Quality: </Text>
                        <Text style={styles.detailValue}>{selectedArmor.quality.name || 'Standard'}</Text>
                      </Text>
                      {selectedArmor.speedPenalty < 0 && (
                        <Text style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Speed Penalty: </Text>
                          <Text style={[styles.detailValue, { color: Colors.ui.error }]}>
                            {(selectedArmor.speedPenalty * 100).toFixed(0)}%
                          </Text>
                        </Text>
                      )}
                      {selectedArmor.enchantment && (
                        <Text style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Enchantment: </Text>
                          <Text style={[styles.detailValue, { color: Colors.text.accent }]}>
                            {selectedArmor.enchantment.name}
                          </Text>
                        </Text>
                      )}
                    </View>
                  </>
                )}

                {/* Price */}
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Price:</Text>
                  <Text style={[
                    styles.modalPrice,
                    gold < selectedPrice && styles.priceUnaffordable,
                  ]}>
                    {selectedPrice} G
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
                      gold < selectedPrice && styles.buyButtonDisabled,
                    ]}
                    onPress={handlePurchase}
                    disabled={gold < selectedPrice}
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
    marginBottom: Spacing.md,
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
    color: Colors.ui.success,
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
    color: Colors.ui.success,
  },
  discountNegative: {
    color: Colors.ui.error,
  },

  // Stock info
  stockInfo: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stockInfoText: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stockInfoHighlight: {
    color: Colors.text.accent,
    fontStyle: 'normal',
    fontWeight: '600',
  },

  // Filters
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterScroll: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  filterChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  filterChipActive: {
    backgroundColor: Colors.text.accent,
    borderColor: Colors.text.accent,
  },
  filterChipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
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
  itemIconContainer: {
    position: 'relative',
  },
  itemIcon: {
    fontSize: 32,
  },
  rarityBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    color: Colors.text.inverse,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.body,
    fontWeight: '600',
  },
  itemStats: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  itemCategory: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  modalRarity: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  statValue: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginTop: 2,
  },
  detailsContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  detailRow: {
    ...Typography.body,
  },
  detailLabel: {
    color: Colors.text.muted,
  },
  detailValue: {
    color: Colors.text.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  priceLabel: {
    ...Typography.h5,
    color: Colors.text.secondary,
  },
  modalPrice: {
    ...Typography.h4,
    color: Colors.resource.gold,
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
