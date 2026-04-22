/**
 * Inventory & Equipment Screen
 * Manage your adventurer's bag and equipped gear
 *
 * Design: Minimalist dark fantasy with dramatic reveals
 */

import React, { useState, useMemo } from 'react';
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
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { MinimalFrame } from '../../../src/components/ui/MinimalFrame';
import { CeremonialDivider } from '../../../src/components/ui/CeremonialDivider';
import { BAG_CAPACITY } from '../../../src/types/Character';
import { getMaterialById, MATERIAL_TIER_COLORS } from '../../../src/data/materials';
import { getConsumableById } from '../../../src/data/consumables';
import type { InventoryItem } from '../../../src/types/Character';
import type { Weapon } from '../../../src/types/Weapon';

// Rarity colors for equipment
const RARITY_COLORS: Record<string, string> = {
  junk: Colors.text.muted,
  common: Colors.text.secondary,
  uncommon: '#5fa55f',
  rare: '#5b7bb8',
  epic: '#7b5fb3',
  legendary: '#c9a227',
};

// Equipment slot display data
const EQUIPMENT_SLOTS = [
  { key: 'weapon', label: 'Weapon', icon: '⚔️', emptyText: 'Unarmed' },
  { key: 'head', label: 'Head', icon: '🎩', emptyText: 'None' },
  { key: 'chest', label: 'Chest', icon: '🛡️', emptyText: 'None' },
  { key: 'hands', label: 'Hands', icon: '🧤', emptyText: 'None' },
  { key: 'legs', label: 'Legs', icon: '👢', emptyText: 'None' },
  { key: 'accessory1', label: 'Ring', icon: '💍', emptyText: 'None' },
  { key: 'accessory2', label: 'Amulet', icon: '📿', emptyText: 'None' },
] as const;

// Item type icons
const ITEM_TYPE_ICONS: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  accessory: '💍',
  consumable: '🧪',
  material: '💎',
  key: '🔑',
};

interface EquipmentSlotProps {
  slot: typeof EQUIPMENT_SLOTS[number];
  equipped: Weapon | null;
  onPress: () => void;
}

function EquipmentSlot({ slot, equipped, onPress }: EquipmentSlotProps) {
  const rarity = equipped?.rarity || 'common';
  const rarityColor = RARITY_COLORS[rarity] || Colors.text.secondary;

  return (
    <Pressable style={styles.equipmentSlot} onPress={onPress}>
      <View style={styles.slotIconContainer}>
        <Text style={styles.slotIcon}>{slot.icon}</Text>
      </View>
      <View style={styles.slotInfo}>
        <Text style={styles.slotLabel}>{slot.label}</Text>
        {equipped ? (
          <Text
            style={[styles.slotItemName, { color: rarityColor }]}
            numberOfLines={1}
          >
            {equipped.displayName}
          </Text>
        ) : (
          <Text style={styles.slotEmpty}>{slot.emptyText}</Text>
        )}
      </View>
      {equipped && (
        <View style={styles.slotStats}>
          <Text style={styles.slotStatValue}>{equipped.finalDamage}</Text>
          <Text style={styles.slotStatLabel}>DMG</Text>
        </View>
      )}
    </Pressable>
  );
}

interface BagItemProps {
  item: InventoryItem;
  displayInfo: { name: string; icon: string; color: string; description?: string };
  onPress: () => void;
}

function BagItem({ item, displayInfo, onPress }: BagItemProps) {
  return (
    <Pressable style={styles.bagItem} onPress={onPress}>
      <Text style={styles.bagItemIcon}>{displayInfo.icon}</Text>
      <View style={styles.bagItemInfo}>
        <Text
          style={[styles.bagItemName, { color: displayInfo.color }]}
          numberOfLines={1}
        >
          {displayInfo.name}
        </Text>
        {displayInfo.description && (
          <Text style={styles.bagItemDesc} numberOfLines={1}>
            {displayInfo.description}
          </Text>
        )}
      </View>
      {item.quantity > 1 && (
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>x{item.quantity}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function InventoryScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const {
    character,
    equipFromInventory,
    removeFromInventory,
    unequipSlot,
    getInventoryCount,
    modifyHP,
    modifySP,
  } = useCharacterStore();

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <MinimalFrame variant="bordered" padding="xl" centerX centerY>
          <Text style={styles.errorText}>No character found</Text>
          <Pressable style={styles.errorButton} onPress={() => router.replace('/')}>
            <Text style={styles.errorButtonText}>Return to Title</Text>
          </Pressable>
        </MinimalFrame>
      </SafeAreaView>
    );
  }

  const inventoryCount = getInventoryCount();

  // Get display info for an inventory item
  const getItemDisplayInfo = (item: InventoryItem) => {
    if (item.type === 'material') {
      const materialData = getMaterialById(item.id);
      if (materialData) {
        return {
          name: materialData.name,
          icon: materialData.icon,
          color: MATERIAL_TIER_COLORS[materialData.tier] || Colors.text.secondary,
          description: `Sells for ${materialData.sellPrice}G`,
        };
      }
    }

    if (item.type === 'consumable') {
      const consumableData = getConsumableById(item.id);
      if (consumableData) {
        return {
          name: consumableData.name,
          icon: consumableData.icon || '🧪',
          color: Colors.ui.success,
          description: consumableData.description,
        };
      }
    }

    if (item.type === 'weapon' && item.weaponData) {
      return {
        name: item.weaponData.displayName,
        icon: '⚔️',
        color: RARITY_COLORS[item.weaponData.rarity] || Colors.text.secondary,
        description: `DMG: ${item.weaponData.finalDamage} | ACC: ${item.weaponData.finalAccuracy}%`,
      };
    }

    if (item.type === 'armor' && item.armorData) {
      return {
        name: item.armorData.displayName,
        icon: '🛡️',
        color: Colors.text.secondary,
        description: `DEF: ${item.armorData.finalDefense}`,
      };
    }

    // Fallback
    return {
      name: item.name || item.id.replace(/_/g, ' '),
      icon: item.icon || ITEM_TYPE_ICONS[item.type] || '📦',
      color: Colors.text.secondary,
      description: undefined,
    };
  };

  // Group inventory by type
  const groupedInventory = useMemo(() => {
    const groups: Record<string, { items: InventoryItem[]; label: string }> = {
      weapon: { items: [], label: 'Weapons' },
      armor: { items: [], label: 'Armor' },
      accessory: { items: [], label: 'Accessories' },
      consumable: { items: [], label: 'Consumables' },
      material: { items: [], label: 'Materials' },
      key: { items: [], label: 'Key Items' },
    };

    for (const item of character.inventory) {
      if (groups[item.type]) {
        groups[item.type].items.push(item);
      }
    }

    // Only return non-empty groups
    return Object.entries(groups)
      .filter(([_, group]) => group.items.length > 0)
      .map(([type, group]) => ({ type, ...group }));
  }, [character.inventory]);

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const handleItemPress = (item: InventoryItem) => {
    haptics.light();
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleEquipItem = () => {
    if (!selectedItem) return;

    haptics.medium();
    const success = equipFromInventory(selectedItem.id);

    if (success) {
      setShowItemModal(false);
      setSelectedItem(null);
    } else {
      Alert.alert('Cannot Equip', 'This item cannot be equipped.');
    }
  };

  const handleUseItem = () => {
    if (!selectedItem || !character) return;

    const consumableData = getConsumableById(selectedItem.id);
    if (!consumableData) {
      Alert.alert('Error', 'Unknown consumable item.');
      return;
    }

    // Check if usable out of combat
    if (!consumableData.usableOutOfCombat) {
      haptics.warning();
      Alert.alert('Cannot Use', 'This item can only be used in combat.');
      return;
    }

    // Apply the effect
    const effect = consumableData.effect;
    let message = '';

    switch (effect.type) {
      case 'heal_hp': {
        const healAmount = Math.min(effect.value, character.maxHP - character.currentHP);
        if (healAmount <= 0) {
          Alert.alert('Already Full', 'Your HP is already at maximum.');
          return;
        }
        modifyHP(healAmount);
        message = `Restored ${healAmount} HP!`;
        break;
      }
      case 'heal_sp': {
        const healAmount = Math.min(effect.value, character.maxSP - character.currentSP);
        if (healAmount <= 0) {
          Alert.alert('Already Full', 'Your SP is already at maximum.');
          return;
        }
        modifySP(healAmount);
        message = `Restored ${healAmount} SP!`;
        break;
      }
      case 'heal_percent_hp': {
        const healAmount = Math.floor(character.maxHP * (effect.value / 100));
        const actualHeal = Math.min(healAmount, character.maxHP - character.currentHP);
        if (actualHeal <= 0) {
          Alert.alert('Already Full', 'Your HP is already at maximum.');
          return;
        }
        modifyHP(actualHeal);
        message = `Restored ${actualHeal} HP!`;
        break;
      }
      case 'heal_percent_sp': {
        const healAmount = Math.floor(character.maxSP * (effect.value / 100));
        const actualHeal = Math.min(healAmount, character.maxSP - character.currentSP);
        if (actualHeal <= 0) {
          Alert.alert('Already Full', 'Your SP is already at maximum.');
          return;
        }
        modifySP(actualHeal);
        message = `Restored ${actualHeal} SP!`;
        break;
      }
      case 'cure_poison':
      case 'cure_bleed':
      case 'cure_all':
        // Status effects are typically only relevant in combat
        message = 'Status cleared!';
        break;
      default:
        Alert.alert('Cannot Use', 'This item cannot be used outside of combat.');
        return;
    }

    // Remove one from stack
    removeFromInventory(selectedItem.id, 1);
    haptics.success();

    // Update selected item quantity or close modal if exhausted
    const remaining = selectedItem.quantity - 1;
    if (remaining <= 0) {
      setShowItemModal(false);
      setSelectedItem(null);
    } else {
      setSelectedItem({ ...selectedItem, quantity: remaining });
    }

    Alert.alert('Item Used', message);
  };

  const handleDiscardItem = () => {
    if (!selectedItem) return;

    haptics.warning();
    Alert.alert(
      'Discard Item',
      `Are you sure you want to discard ${getItemDisplayInfo(selectedItem).name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            removeFromInventory(selectedItem.id, selectedItem.quantity);
            setShowItemModal(false);
            setSelectedItem(null);
          },
        },
      ]
    );
  };

  const handleUnequipSlot = (slotKey: string) => {
    haptics.light();
    // For now just show info - unequipping goes to bag
    const equipped = character.equipment[slotKey as keyof typeof character.equipment];
    if (equipped) {
      Alert.alert(
        'Unequip',
        `Unequip ${(equipped as any).displayName || 'this item'}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Unequip',
            onPress: () => {
              unequipSlot(slotKey as any);
              haptics.success();
            },
          },
        ]
      );
    }
  };

  const selectedItemInfo = selectedItem ? getItemDisplayInfo(selectedItem) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>INVENTORY</Text>
          <Text style={styles.subtitle}>
            {inventoryCount} / {BAG_CAPACITY} slots
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Equipment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EQUIPPED</Text>
          <CeremonialDivider variant="fade" spacing="sm" />

          <MinimalFrame variant="subtle" padding="sm">
            <View style={styles.equipmentGrid}>
              {EQUIPMENT_SLOTS.map((slot) => (
                <EquipmentSlot
                  key={slot.key}
                  slot={slot}
                  equipped={character.equipment[slot.key as keyof typeof character.equipment] as any}
                  onPress={() => handleUnequipSlot(slot.key)}
                />
              ))}
            </View>
          </MinimalFrame>
        </View>

        {/* Bag Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BAG</Text>
            <View style={styles.capacityBadge}>
              <Text style={styles.capacityText}>
                {inventoryCount}/{BAG_CAPACITY}
              </Text>
            </View>
          </View>
          <CeremonialDivider variant="fade" spacing="sm" />

          {groupedInventory.length === 0 ? (
            <MinimalFrame variant="subtle" padding="xl" centerX>
              <Text style={styles.emptyText}>Your bag is empty</Text>
              <Text style={styles.emptySubtext}>
                Find loot in the dungeon to fill it
              </Text>
            </MinimalFrame>
          ) : (
            groupedInventory.map((group) => (
              <View key={group.type} style={styles.itemGroup}>
                <Text style={styles.groupLabel}>{group.label}</Text>
                <MinimalFrame variant="subtle" padding="none">
                  {group.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <View style={styles.itemDivider} />}
                      <BagItem
                        item={item}
                        displayInfo={getItemDisplayInfo(item)}
                        onPress={() => handleItemPress(item)}
                      />
                    </React.Fragment>
                  ))}
                </MinimalFrame>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={showItemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && selectedItemInfo && (
              <>
                {/* Item Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>{selectedItemInfo.icon}</Text>
                  <Text
                    style={[styles.modalTitle, { color: selectedItemInfo.color }]}
                  >
                    {selectedItemInfo.name}
                  </Text>
                </View>

                <CeremonialDivider variant="ornate" spacing="md" />

                {/* Item Details */}
                <View style={styles.modalDetails}>
                  <Text style={styles.modalDetailText}>
                    Type: {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                  </Text>
                  {selectedItem.quantity > 1 && (
                    <Text style={styles.modalDetailText}>
                      Quantity: {selectedItem.quantity}
                    </Text>
                  )}
                  {selectedItemInfo.description && (
                    <Text style={styles.modalDescription}>
                      {selectedItemInfo.description}
                    </Text>
                  )}
                </View>

                {/* Weapon Stats */}
                {selectedItem.type === 'weapon' && selectedItem.weaponData && (
                  <View style={styles.weaponStats}>
                    <View style={styles.weaponStatRow}>
                      <Text style={styles.weaponStatLabel}>Damage</Text>
                      <Text style={styles.weaponStatValue}>
                        {selectedItem.weaponData.finalDamage}
                      </Text>
                    </View>
                    <View style={styles.weaponStatRow}>
                      <Text style={styles.weaponStatLabel}>Accuracy</Text>
                      <Text style={styles.weaponStatValue}>
                        {selectedItem.weaponData.finalAccuracy}%
                      </Text>
                    </View>
                    <View style={styles.weaponStatRow}>
                      <Text style={styles.weaponStatLabel}>Crit Chance</Text>
                      <Text style={styles.weaponStatValue}>
                        {selectedItem.weaponData.finalCritChance.toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.weaponStatRow}>
                      <Text style={styles.weaponStatLabel}>Scales With</Text>
                      <Text style={styles.weaponStatValue}>
                        {selectedItem.weaponData.base.category}
                      </Text>
                    </View>
                  </View>
                )}

                <CeremonialDivider variant="thin" spacing="md" />

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  {(selectedItem.type === 'weapon' ||
                    selectedItem.type === 'armor' ||
                    selectedItem.type === 'accessory') && (
                    <Pressable
                      style={[styles.actionButton, styles.equipButton]}
                      onPress={handleEquipItem}
                    >
                      <Text style={styles.equipButtonText}>Equip</Text>
                    </Pressable>
                  )}

                  {selectedItem.type === 'consumable' && (
                    <Pressable
                      style={[styles.actionButton, styles.useButton]}
                      onPress={handleUseItem}
                    >
                      <Text style={styles.useButtonText}>Use</Text>
                    </Pressable>
                  )}

                  <Pressable
                    style={[styles.actionButton, styles.discardButton]}
                    onPress={handleDiscardItem}
                  >
                    <Text style={styles.discardButtonText}>Discard</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowItemModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    padding: Spacing.sm,
    width: 80,
  },
  backText: {
    ...Typography.body,
    color: Colors.text.accent,
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    ...Typography.h4,
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  headerRight: {
    width: 80,
  },

  // Error state
  errorText: {
    ...Typography.h5,
    color: Colors.text.muted,
    marginBottom: Spacing.lg,
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

  // Sections
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 2,
  },
  capacityBadge: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  capacityText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },

  // Equipment Grid
  equipmentGrid: {
    gap: Spacing.xs,
  },
  equipmentSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.primary,
  },
  slotIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  slotIcon: {
    fontSize: 18,
  },
  slotInfo: {
    flex: 1,
  },
  slotLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  slotItemName: {
    ...Typography.body,
    fontWeight: '500',
  },
  slotEmpty: {
    ...Typography.bodySmall,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  slotStats: {
    alignItems: 'flex-end',
  },
  slotStatValue: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  slotStatLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 9,
  },

  // Bag Items
  itemGroup: {
    marginTop: Spacing.md,
  },
  groupLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.border.secondary,
    marginHorizontal: Spacing.sm,
  },
  bagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  bagItemIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
    marginRight: Spacing.sm,
  },
  bagItemInfo: {
    flex: 1,
  },
  bagItemName: {
    ...Typography.body,
    fontWeight: '500',
  },
  bagItemDesc: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  quantityBadge: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  quantityText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },

  // Empty State
  emptyText: {
    ...Typography.h6,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 360,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  modalHeader: {
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    ...Typography.h4,
    textAlign: 'center',
  },
  modalDetails: {
    gap: Spacing.xs,
  },
  modalDetailText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  modalDescription: {
    ...Typography.bodySmall,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },

  // Weapon Stats in Modal
  weaponStats: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  weaponStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weaponStatLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  weaponStatValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },

  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  equipButton: {
    backgroundColor: Colors.text.accent,
  },
  equipButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },
  useButton: {
    backgroundColor: Colors.ui.success,
  },
  useButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },
  discardButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.error + '60',
  },
  discardButtonText: {
    ...Typography.button,
    color: Colors.ui.error,
  },
  closeButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  closeButtonText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
});
