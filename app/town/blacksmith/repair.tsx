/**
 * Salvage Screen — Blacksmith
 * Break down weapons and armor into raw materials
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useBlacksmithStore } from '../../../src/stores/useBlacksmithStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { BLACKSMITH_NPC } from '../../../src/types/Blacksmith';
import type { InventoryItem } from '../../../src/types/Character';
import type { CraftingMaterial } from '../../../src/data/materials';
import { getMaterialById } from '../../../src/data/materials';

// Material yields per weapon material tier
const WEAPON_MATERIAL_YIELDS: Record<string, Array<{ materialId: string; quantity: number }>> = {
  iron:       [{ materialId: 'iron_ingot', quantity: 1 }],
  steel:      [{ materialId: 'iron_ingot', quantity: 1 }, { materialId: 'steel_ingot', quantity: 1 }],
  silver:     [{ materialId: 'steel_ingot', quantity: 1 }],
  mithril:    [{ materialId: 'steel_ingot', quantity: 2 }],
  orichalcum: [{ materialId: 'steel_ingot', quantity: 1 }, { materialId: 'mithril_ingot', quantity: 1 }],
  adamantine: [{ materialId: 'mithril_ingot', quantity: 2 }],
  dragonbone: [{ materialId: 'mithril_ingot', quantity: 1 }, { materialId: 'dragon_heart', quantity: 1 }],
};

// Extra material for armor type
const ARMOR_TYPE_YIELD: Record<string, { materialId: string; quantity: number } | null> = {
  light:  null,
  medium: { materialId: 'iron_ingot', quantity: 1 },
  heavy:  { materialId: 'steel_ingot', quantity: 1 },
  robes:  null,
};

const QUALITY_COLORS: Record<string, string> = {
  crude:      '#666666',
  standard:   '#9a9a9a',
  fine:       '#5fa55f',
  superior:   '#5b7bb8',
  masterwork: '#7b5fb3',
  legendary:  '#c9a227',
};

interface SalvageYield {
  materials: Array<{ material: CraftingMaterial | null; quantity: number; materialId: string }>;
  goldBonus: number; // small gold recovery (5% of estimated value)
}

function computeWeaponYield(item: InventoryItem): SalvageYield | null {
  if (item.type !== 'weapon' || !item.weaponData) return null;
  const weapon = item.weaponData;
  const matName = weapon.material?.name?.toLowerCase() ?? 'iron';

  // Find matching tier key
  const yieldKey = Object.keys(WEAPON_MATERIAL_YIELDS).find((k) =>
    matName.includes(k)
  ) ?? 'iron';
  const rawYields = WEAPON_MATERIAL_YIELDS[yieldKey];

  const materials = rawYields.map((y) => ({
    materialId: y.materialId,
    material: getMaterialById(y.materialId) ?? null,
    quantity: y.quantity,
  }));

  const goldBonus = Math.max(5, Math.floor((weapon.finalDamage ?? 0) * 2));
  return { materials, goldBonus };
}

function computeArmorYield(item: InventoryItem): SalvageYield | null {
  if (item.type !== 'armor' || !item.armorData) return null;
  const armor = item.armorData;
  const matName = armor.material?.name?.toLowerCase() ?? 'iron';

  const yieldKey = Object.keys(WEAPON_MATERIAL_YIELDS).find((k) =>
    matName.includes(k)
  ) ?? 'iron';
  const rawYields = WEAPON_MATERIAL_YIELDS[yieldKey];

  const materials = rawYields.map((y) => ({
    materialId: y.materialId,
    material: getMaterialById(y.materialId) ?? null,
    quantity: y.quantity,
  }));

  // Extra material for heavy/medium armor
  const extra = ARMOR_TYPE_YIELD[armor.base?.type ?? 'light'];
  if (extra) {
    materials.push({
      materialId: extra.materialId,
      material: getMaterialById(extra.materialId) ?? null,
      quantity: extra.quantity,
    });
  }

  const goldBonus = Math.max(5, Math.floor((armor.finalDefense ?? 0) * 3));
  return { materials, goldBonus };
}

interface SalvageCardProps {
  item: InventoryItem;
  yieldData: SalvageYield;
  onSelect: () => void;
}

function SalvageCard({ item, yieldData, onSelect }: SalvageCardProps) {
  const isWeapon = item.type === 'weapon';
  const quality = isWeapon
    ? item.weaponData?.quality.tier
    : item.armorData?.quality?.tier ?? 'standard';
  const displayName = isWeapon
    ? item.weaponData?.displayName
    : item.armorData?.displayName;
  const icon = isWeapon
    ? (item.weaponData?.base.range === 'melee' ? '⚔️' : '🏹')
    : '🛡️';

  return (
    <Pressable style={styles.salvageCard} onPress={onSelect}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: QUALITY_COLORS[quality ?? 'standard'] }]}>
            {displayName ?? item.name ?? 'Unknown Item'}
          </Text>
          <Text style={styles.cardType}>
            {isWeapon ? 'Weapon' : `Armor — ${item.armorData?.base?.slot ?? ''}`}
          </Text>
        </View>
        <Text style={styles.cardArrow}>&gt;</Text>
      </View>

      {/* Preview yield */}
      <View style={styles.yieldPreview}>
        <Text style={styles.yieldLabel}>Yields:</Text>
        <View style={styles.yieldItems}>
          {yieldData.materials.map((m) => (
            <View key={m.materialId} style={styles.yieldChip}>
              <Text style={styles.yieldChipText}>
                {m.material?.icon ?? '🔩'} {m.material?.name ?? m.materialId} ×{m.quantity}
              </Text>
            </View>
          ))}
          <View style={styles.yieldChip}>
            <Text style={[styles.yieldChipText, { color: Colors.resource.gold }]}>
              {yieldData.goldBonus}G
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function RepairScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, removeFromInventory, addToInventory, modifyGold } = useCharacterStore();
  const { modifyReputation } = useBlacksmithStore();

  const [confirmItem, setConfirmItem] = useState<InventoryItem | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

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

  // Only show weapons and armor in inventory (not equipped)
  const salvageableItems = useMemo(() => {
    return character.inventory.filter(
      (item) => (item.type === 'weapon' || item.type === 'armor') && item.quantity > 0
    );
  }, [character.inventory]);

  const getYield = (item: InventoryItem): SalvageYield | null => {
    if (item.type === 'weapon') return computeWeaponYield(item);
    if (item.type === 'armor') return computeArmorYield(item);
    return null;
  };

  const confirmYield = confirmItem ? getYield(confirmItem) : null;

  const handleSalvage = () => {
    if (!confirmItem || !confirmYield) return;
    haptics.success();

    // Remove item from inventory
    removeFromInventory(confirmItem.id, 1);

    // Add materials
    for (const m of confirmYield.materials) {
      if (m.material) {
        addToInventory({
          id: m.materialId,
          name: m.material.name,
          type: 'material',
          quantity: m.quantity,
          stackable: true,
          icon: m.material.icon,
        });
      }
    }

    // Add gold
    modifyGold(confirmYield.goldBonus);

    // Small reputation gain
    modifyReputation(1);

    const matNames = confirmYield.materials.map((m) => m.material?.name ?? m.materialId).join(', ');
    setLastResult(`Salvaged for ${matNames} + ${confirmYield.goldBonus}G`);
    setConfirmItem(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => { haptics.light(); router.back(); }}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>SALVAGE</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldLabel}>Gold</Text>
            <Text style={styles.goldValue}>{character.gold.toLocaleString()} G</Text>
          </View>
        </View>

        {/* NPC Dialogue */}
        <View style={styles.npcSection}>
          <View style={styles.npcHeader}>
            <Text style={styles.npcIcon}>{BLACKSMITH_NPC.icon}</Text>
            <View style={styles.npcInfo}>
              <Text style={styles.npcName}>{BLACKSMITH_NPC.name}</Text>
            </View>
          </View>
          <View style={styles.dialogueBox}>
            <Text style={styles.dialogueText}>
              "I can break down your unwanted gear and recover the raw materials.
              Better than letting good metal go to waste — and you'll need those
              materials for proper upgrades."
            </Text>
          </View>
        </View>

        {/* Last result feedback */}
        {lastResult && (
          <View style={styles.resultBanner}>
            <Text style={styles.resultText}>{lastResult}</Text>
          </View>
        )}

        {/* Salvageable items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Salvageable Equipment ({salvageableItems.length})
          </Text>
          <Text style={styles.sectionHint}>
            Equipped items cannot be salvaged
          </Text>

          {salvageableItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔩</Text>
              <Text style={styles.emptyText}>No salvageable equipment in inventory</Text>
              <Text style={styles.emptyHint}>
                Collect weapons and armor from the dungeon to salvage them here
              </Text>
            </View>
          ) : (
            <View style={styles.itemList}>
              {salvageableItems.map((item) => {
                const yieldData = getYield(item);
                if (!yieldData) return null;
                return (
                  <SalvageCard
                    key={item.id}
                    item={item}
                    yieldData={yieldData}
                    onSelect={() => { haptics.light(); setConfirmItem(item); setLastResult(null); }}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About Salvaging</Text>
          <Text style={styles.infoText}>
            • Higher-tier materials yield better crafting components{'\n'}
            • Heavy armor yields extra metal ingots{'\n'}
            • Recovered materials can be used for weapon upgrades{'\n'}
            • Each salvage increases Garm's trust in you
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Modal */}
      <Modal
        visible={!!confirmItem}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmItem(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmItem(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Confirm Salvage</Text>

            {confirmItem && confirmYield && (
              <>
                <Text style={styles.modalItemName}>
                  {confirmItem.weaponData?.displayName ?? confirmItem.armorData?.displayName ?? confirmItem.name}
                </Text>

                <View style={styles.modalDivider} />

                <Text style={styles.modalYieldTitle}>You will receive:</Text>
                <View style={styles.modalYields}>
                  {confirmYield.materials.map((m) => (
                    <View key={m.materialId} style={styles.modalYieldRow}>
                      <Text style={styles.modalYieldIcon}>{m.material?.icon ?? '🔩'}</Text>
                      <Text style={styles.modalYieldName}>
                        {m.material?.name ?? m.materialId}
                      </Text>
                      <Text style={styles.modalYieldQty}>×{m.quantity}</Text>
                    </View>
                  ))}
                  <View style={styles.modalYieldRow}>
                    <Text style={styles.modalYieldIcon}>💰</Text>
                    <Text style={styles.modalYieldName}>Gold</Text>
                    <Text style={[styles.modalYieldQty, { color: Colors.resource.gold }]}>
                      +{confirmYield.goldBonus}G
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalWarning}>
                  This action cannot be undone.
                </Text>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalBtn, styles.cancelModalBtn]}
                    onPress={() => setConfirmItem(null)}
                  >
                    <Text style={styles.cancelModalBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalBtn, styles.confirmModalBtn]}
                    onPress={handleSalvage}
                  >
                    <Text style={styles.confirmModalBtnText}>Salvage</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
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
  npcSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  npcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  npcIcon: {
    fontSize: 36,
    marginRight: Spacing.md,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  dialogueBox: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
  },
  dialogueText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  resultBanner: {
    backgroundColor: Colors.ui.success + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.success + '60',
  },
  resultText: {
    ...Typography.body,
    color: Colors.ui.success,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  emptyHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  itemList: {
    gap: Spacing.md,
  },
  salvageCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    ...Typography.h5,
  },
  cardType: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  cardArrow: {
    ...Typography.h5,
    color: Colors.text.muted,
  },
  yieldPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  yieldLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 11,
    marginRight: Spacing.xs,
  },
  yieldItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  yieldChip: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  yieldChipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  infoBox: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  infoTitle: {
    ...Typography.h6,
    color: Colors.text.accent,
    marginBottom: Spacing.xs,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.text.muted,
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalItemName: {
    ...Typography.h5,
    color: Colors.text.accent,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border.primary,
    marginBottom: Spacing.md,
  },
  modalYieldTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  modalYields: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  modalYieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modalYieldIcon: {
    fontSize: 20,
    width: 28,
  },
  modalYieldName: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
  modalYieldQty: {
    ...Typography.h5,
    color: Colors.text.secondary,
  },
  modalWarning: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelModalBtn: {
    backgroundColor: Colors.background.secondary,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  cancelModalBtnText: {
    ...Typography.button,
    color: Colors.text.muted,
  },
  confirmModalBtn: {
    backgroundColor: Colors.domain.craft ?? Colors.text.accent,
  },
  confirmModalBtnText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
});
