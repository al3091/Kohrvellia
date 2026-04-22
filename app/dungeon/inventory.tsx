/**
 * Inventory Screen
 * Equipment management and item viewing
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useCombatStore } from '../../src/stores/useCombatStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import type { Weapon } from '../../src/types/Weapon';
import type { Equipment } from '../../src/types/Armor';
import { WEAPON_CATEGORY_INFO } from '../../src/types/Weapon';
import { getConsumableById } from '../../src/data/consumables';

// Equipment slot display info
const SLOT_INFO: Record<keyof Equipment, { name: string; icon: string }> = {
  weapon: { name: 'Weapon', icon: '⚔️' },
  head: { name: 'Head', icon: '🪖' },
  chest: { name: 'Chest', icon: '🛡️' },
  hands: { name: 'Hands', icon: '🧤' },
  legs: { name: 'Legs', icon: '👢' },
  accessory1: { name: 'Accessory 1', icon: '💍' },
  accessory2: { name: 'Accessory 2', icon: '📿' },
};

// Rarity colors
const RARITY_COLORS: Record<string, string> = {
  junk: Colors.text.muted,
  common: Colors.text.secondary,
  uncommon: Colors.ui.success,
  rare: Colors.domain.knowledge,
  epic: Colors.domain.authority,
  legendary: Colors.resource.gold,
};

export default function InventoryScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, equipWeapon, unequipSlot, getDerivedStatsWithBlessings, removeFromInventory, modifyHP, modifySP, modifySatiation } = useCharacterStore();
  const { isInCombat } = useCombatStore();
  const derivedStats = getDerivedStatsWithBlessings();
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const handleUseConsumable = (itemId: string) => {
    if (isInCombat) return; // Safety guard — should never be reachable from dungeon floor nav
    const consumable = getConsumableById(itemId);
    if (!consumable || !character) return;

    const { effect } = consumable;
    const feedbackParts: string[] = [];

    if (effect.type === 'heal_hp') {
      modifyHP(effect.value);
      feedbackParts.push(`+${effect.value} HP`);
    } else if (effect.type === 'heal_percent_hp') {
      const amount = Math.floor((character.maxHP * effect.value) / 100);
      modifyHP(amount);
      feedbackParts.push(`+${amount} HP`);
    } else if (effect.type === 'heal_sp') {
      modifySP(effect.value);
      feedbackParts.push(`+${effect.value} SP`);
    } else if (effect.type === 'heal_percent_sp') {
      const amount = Math.floor((character.maxSP * effect.value) / 100);
      modifySP(amount);
      feedbackParts.push(`+${amount} SP`);
    } else if (effect.type === 'cure_poison' || effect.type === 'cure_bleed' || effect.type === 'cure_all') {
      feedbackParts.push('Cured!');
    }

    // Restore satiation for food items
    if (consumable.satiationRestore && consumable.satiationRestore > 0) {
      modifySatiation(consumable.satiationRestore);
      feedbackParts.push(`Satiation +${consumable.satiationRestore}`);
    }

    removeFromInventory(itemId, 1);
    haptics.success();
    setFeedbackText(feedbackParts.join('  '));
    setTimeout(() => setFeedbackText(null), 1500);
  };

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No character found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleSlotPress = (slot: keyof Equipment) => {
    haptics.light();
    const item = character.equipment[slot];

    if (slot === 'weapon' && item) {
      setSelectedWeapon(item as Weapon);
      setShowWeaponModal(true);
    }
    // TODO: Handle armor and accessory slots
  };

  const handleUnequipWeapon = () => {
    haptics.medium();
    unequipSlot('weapon');
    setShowWeaponModal(false);
    setSelectedWeapon(null);
  };

  const handleEquipWeapon = (weapon: Weapon) => {
    haptics.success();
    equipWeapon(weapon);
    setShowWeaponModal(false);
    setSelectedWeapon(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Equipment</Text>
        <Text style={styles.goldText}>{character.gold} G</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Equipment Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipped</Text>

          <View style={styles.equipmentGrid}>
            {(Object.keys(SLOT_INFO) as (keyof Equipment)[]).map((slot) => {
              const info = SLOT_INFO[slot];
              const item = character.equipment[slot];
              const weapon = slot === 'weapon' ? (item as Weapon | null) : null;

              return (
                <Pressable
                  key={slot}
                  style={[
                    styles.equipmentSlot,
                    item && styles.equipmentSlotFilled,
                  ]}
                  onPress={() => handleSlotPress(slot)}
                >
                  <Text style={styles.slotIcon}>{info.icon}</Text>
                  <Text style={styles.slotName}>{info.name}</Text>
                  {weapon ? (
                    <Text
                      style={[
                        styles.itemName,
                        { color: RARITY_COLORS[weapon.rarity] || Colors.text.secondary },
                      ]}
                      numberOfLines={1}
                    >
                      {weapon.displayName}
                    </Text>
                  ) : item ? (
                    <Text style={styles.itemName}>Equipped</Text>
                  ) : (
                    <Text style={styles.emptySlot}>Empty</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Inventory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Inventory ({character.inventory.length} items)
          </Text>

          {character.inventory.length === 0 ? (
            <View style={styles.emptyInventory}>
              <Text style={styles.emptyText}>Your inventory is empty.</Text>
              <Text style={styles.hintText}>
                Defeat monsters to find equipment.
              </Text>
            </View>
          ) : (
            <View style={styles.inventoryList}>
              {character.inventory.map((item) => {
                if (item.type === 'weapon') {
                  return (
                    <Pressable
                      key={item.id}
                      style={styles.inventoryItem}
                      onPress={() => haptics.light()}
                    >
                      <Text style={styles.inventoryIcon}>⚔️</Text>
                      <View style={styles.inventoryInfo}>
                        <Text style={styles.inventoryName}>{item.name ?? item.id}</Text>
                        <Text style={styles.inventoryType}>Weapon</Text>
                      </View>
                      {item.quantity > 1 && (
                        <Text style={styles.inventoryQuantity}>x{item.quantity}</Text>
                      )}
                    </Pressable>
                  );
                }

                if (item.type === 'consumable') {
                  const consumableData = getConsumableById(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      style={styles.inventoryItem}
                      onPress={() => handleUseConsumable(item.id)}
                    >
                      <Text style={styles.inventoryIcon}>{consumableData?.icon ?? '🧪'}</Text>
                      <View style={styles.inventoryInfo}>
                        <Text style={styles.inventoryName}>{consumableData?.name ?? item.id}</Text>
                        <Text style={styles.inventoryType}>Use</Text>
                      </View>
                      {item.quantity > 1 && (
                        <Text style={styles.inventoryQuantity}>x{item.quantity}</Text>
                      )}
                    </Pressable>
                  );
                }

                return (
                  <View key={item.id} style={styles.inventoryItem}>
                    <Text style={styles.inventoryIcon}>{item.icon ?? '📦'}</Text>
                    <View style={styles.inventoryInfo}>
                      <Text style={styles.inventoryName}>{item.name ?? item.id}</Text>
                      <Text style={styles.inventoryType}>{item.type}</Text>
                    </View>
                    {item.quantity > 1 && (
                      <Text style={styles.inventoryQuantity}>x{item.quantity}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Stats Summary - Using derived stats with blessing multiplier */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combat Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Attack</Text>
              <Text style={styles.statValue}>
                {derivedStats.physicalAttack}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Defense</Text>
              <Text style={styles.statValue}>
                {derivedStats.physicalDefense}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Speed</Text>
              <Text style={styles.statValue}>
                {derivedStats.speed}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Crit</Text>
              <Text style={styles.statValue}>
                {derivedStats.critChance.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Return to Dungeon</Text>
        </Pressable>
      </View>

      {/* Consumable use feedback */}
      {feedbackText && (
        <View style={styles.feedbackBanner}>
          <Text style={styles.feedbackText}>{feedbackText}</Text>
        </View>
      )}

      {/* Weapon Detail Modal */}
      <Modal
        visible={showWeaponModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWeaponModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedWeapon && (
              <>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: RARITY_COLORS[selectedWeapon.rarity] || Colors.text.primary },
                  ]}
                >
                  {selectedWeapon.displayName}
                </Text>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Damage</Text>
                    <Text style={styles.modalStatValue}>{selectedWeapon.finalDamage}</Text>
                  </View>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Accuracy</Text>
                    <Text style={styles.modalStatValue}>{selectedWeapon.finalAccuracy}%</Text>
                  </View>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Crit Chance</Text>
                    <Text style={styles.modalStatValue}>{selectedWeapon.finalCritChance.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Scaling Stat</Text>
                    <Text style={styles.modalStatValue}>{selectedWeapon.base.category}</Text>
                  </View>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Range</Text>
                    <Text style={styles.modalStatValue}>{selectedWeapon.base.range}</Text>
                  </View>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Two-Handed</Text>
                    <Text style={styles.modalStatValue}>
                      {selectedWeapon.base.twoHanded ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalCategory}>
                  {WEAPON_CATEGORY_INFO[selectedWeapon.base.category]?.description}
                </Text>

                {selectedWeapon.enchantment && (
                  <View style={styles.enchantmentBox}>
                    <Text style={styles.enchantmentTitle}>Enchantment</Text>
                    {selectedWeapon.enchantment.effects.map((effect, i) => (
                      <Text key={i} style={styles.enchantmentEffect}>
                        {effect.description}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.modalActions}>
                  {character.equipment.weapon?.id === selectedWeapon.id ? (
                    <Pressable
                      style={[styles.modalButton, styles.unequipButton]}
                      onPress={handleUnequipWeapon}
                    >
                      <Text style={styles.modalButtonText}>Unequip</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.modalButton, styles.equipButton]}
                      onPress={() => handleEquipWeapon(selectedWeapon)}
                    >
                      <Text style={styles.modalButtonText}>Equip</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setShowWeaponModal(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  goldText: {
    ...Typography.h5,
    color: Colors.resource.gold,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Padding.screen.horizontal,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  equipmentSlot: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    alignItems: 'center',
  },
  equipmentSlotFilled: {
    borderColor: Colors.border.accent,
  },
  slotIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  slotName: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  itemName: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySlot: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  emptyInventory: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  hintText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  inventoryList: {
    gap: Spacing.sm,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  inventoryIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  inventoryType: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  inventoryQuantity: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  statItem: {
    width: '45%',
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  statValue: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  footer: {
    padding: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  backButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  backButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.muted,
  },

  // Modal styles
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
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  modalTitle: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalStats: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalStatLabel: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  modalStatValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  modalCategory: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  enchantmentBox: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  enchantmentTitle: {
    ...Typography.caption,
    color: Colors.domain.knowledge,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  enchantmentEffect: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  equipButton: {
    backgroundColor: Colors.ui.success,
  },
  unequipButton: {
    backgroundColor: Colors.ui.warning,
  },
  modalButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  closeButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  closeButtonText: {
    ...Typography.button,
    color: Colors.text.muted,
  },
  feedbackBanner: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: Colors.ui.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  feedbackText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text.primary,
  },
});
