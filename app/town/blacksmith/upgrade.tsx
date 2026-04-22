/**
 * Upgrade Screen
 * Upgrade weapon quality tier using gold and materials
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useBlacksmithStore } from '../../../src/stores/useBlacksmithStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { BLACKSMITH_NPC, getNextQuality } from '../../../src/types/Blacksmith';
import { getMaterialById } from '../../../src/data/materials';
import { getWeaponById } from '../../../src/data/weaponRegistry';
import type { Weapon } from '../../../src/types/Weapon';

// Quality tier colors
const QUALITY_COLORS: Record<string, string> = {
  crude: '#666666',
  standard: '#9a9a9a',
  fine: '#5fa55f',
  superior: '#5b7bb8',
  masterwork: '#7b5fb3',
  legendary: '#c9a227',
};

interface WeaponCardProps {
  weapon: Weapon;
  inventoryId: string;
  onSelect: (id: string) => void;
  canUpgrade: boolean;
  reason?: string;
}

function WeaponCard({ weapon, inventoryId, onSelect, canUpgrade, reason }: WeaponCardProps) {
  const nextQuality = getNextQuality(weapon.quality.tier);

  return (
    <Pressable
      style={[styles.weaponCard, !canUpgrade && styles.weaponCardDisabled]}
      onPress={() => onSelect(inventoryId)}
    >
      <View style={styles.weaponHeader}>
        <Text style={styles.weaponIcon}>
          {weapon.base.range === 'melee' ? '⚔️' : '🏹'}
        </Text>
        <View style={styles.weaponInfo}>
          <Text style={[styles.weaponName, { color: QUALITY_COLORS[weapon.quality.tier] }]}>
            {weapon.displayName}
          </Text>
          <View style={styles.qualityRow}>
            <Text style={[styles.qualityBadge, { backgroundColor: QUALITY_COLORS[weapon.quality.tier] }]}>
              {weapon.quality.name}
            </Text>
            <Text style={styles.qualityArrow}> → </Text>
            {nextQuality && (
              <Text style={[styles.qualityBadge, { backgroundColor: QUALITY_COLORS[nextQuality] }]}>
                {nextQuality.charAt(0).toUpperCase() + nextQuality.slice(1)}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statText}>DMG: {weapon.finalDamage}</Text>
        <Text style={styles.statText}>ACC: {weapon.finalAccuracy}%</Text>
        <Text style={styles.statText}>CRIT: {Math.round(weapon.finalCritChance * 100)}%</Text>
      </View>
      {!canUpgrade && reason && (
        <Text style={styles.reasonText}>{reason}</Text>
      )}
    </Pressable>
  );
}

interface MaterialRowProps {
  materialId: string;
  required: number;
  owned: number;
}

function MaterialRow({ materialId, required, owned }: MaterialRowProps) {
  const material = getMaterialById(materialId);
  const hasEnough = owned >= required;

  return (
    <View style={styles.materialRow}>
      <Text style={styles.materialIcon}>{material?.icon || '?'}</Text>
      <Text style={styles.materialName}>{material?.name || materialId}</Text>
      <Text style={[styles.materialCount, !hasEnough && styles.materialCountMissing]}>
        {owned}/{required}
      </Text>
    </View>
  );
}

export default function UpgradeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const {
    canUpgrade,
    getUpgradeCost,
    upgradeWeapon,
    getMaterialInventory,
    reputation,
  } = useBlacksmithStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resultWeapon, setResultWeapon] = useState<Weapon | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No character found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get upgradeable weapons from inventory using weapon registry
  const upgradeableItems = character.inventory
    .filter((item) => item.type === 'weapon')
    .map((item) => {
      const weapon = getWeaponById(item.id);
      return weapon ? { id: item.id, weapon } : null;
    })
    .filter((item): item is { id: string; weapon: Weapon } =>
      item !== null && item.weapon.identified && item.weapon.quality.tier !== 'legendary'
    )
    .map((item) => {
      const upgradeCheck = canUpgrade(item.id);
      return {
        id: item.id,
        weapon: item.weapon,
        canUpgrade: upgradeCheck.canUpgrade,
        reason: upgradeCheck.reason,
      };
    });

  const selectedItem = upgradeableItems.find((i) => i.id === selectedId);
  const upgradeCost = selectedId ? getUpgradeCost(selectedId) : null;

  const handleSelect = (inventoryId: string) => {
    haptics.light();
    setSelectedId(inventoryId);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedId) return;

    haptics.medium();
    const result = upgradeWeapon(selectedId);

    if (result.success && result.weapon) {
      setResultWeapon(result.weapon);
      setSelectedId(null);
    } else {
      setError(result.error || 'Upgrade failed');
    }
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const closeModal = () => {
    setSelectedId(null);
    setResultWeapon(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>UPGRADE</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldLabel}>Gold</Text>
            <Text style={styles.goldValue}>{character.gold.toLocaleString()} G</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>
            {BLACKSMITH_NPC.icon} {BLACKSMITH_NPC.name} says:
          </Text>
          <Text style={styles.instructionsText}>
            "Bring me gold and materials, and I'll forge your weapon into something greater.
            Each tier requires finer materials and more skill."
          </Text>
        </View>

        {/* Weapon List */}
        {upgradeableItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚒️</Text>
            <Text style={styles.emptyText}>No upgradeable weapons</Text>
            <Text style={styles.emptySubtext}>
              Identify your weapons first, then bring them here to upgrade
            </Text>
          </View>
        ) : (
          <View style={styles.weaponList}>
            <Text style={styles.sectionTitle}>
              Your Weapons ({upgradeableItems.length})
            </Text>
            {upgradeableItems.map((item) => (
              <WeaponCard
                key={item.id}
                weapon={item.weapon}
                inventoryId={item.id}
                onSelect={handleSelect}
                canUpgrade={item.canUpgrade}
                reason={item.reason}
              />
            ))}
          </View>
        )}

        {/* Upgrade Tiers Info */}
        <View style={styles.tiersContainer}>
          <Text style={styles.tiersTitle}>Quality Tiers</Text>
          <View style={styles.tiersList}>
            <View style={styles.tierRow}>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.crude }]}>Crude</Text>
              <Text style={styles.tierArrow}>→</Text>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.standard }]}>Standard</Text>
              <Text style={styles.tierCost}>200G</Text>
            </View>
            <View style={styles.tierRow}>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.standard }]}>Standard</Text>
              <Text style={styles.tierArrow}>→</Text>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.fine }]}>Fine</Text>
              <Text style={styles.tierCost}>500G</Text>
            </View>
            <View style={styles.tierRow}>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.fine }]}>Fine</Text>
              <Text style={styles.tierArrow}>→</Text>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.superior }]}>Superior</Text>
              <Text style={styles.tierCost}>1,500G (Rep 6+)</Text>
            </View>
            <View style={styles.tierRow}>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.superior }]}>Superior</Text>
              <Text style={styles.tierArrow}>→</Text>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.masterwork }]}>Masterwork</Text>
              <Text style={styles.tierCost}>5,000G (Rep 11+)</Text>
            </View>
            <View style={styles.tierRow}>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.masterwork }]}>Masterwork</Text>
              <Text style={styles.tierArrow}>→</Text>
              <Text style={[styles.tierName, { color: QUALITY_COLORS.legendary }]}>Legendary</Text>
              <Text style={styles.tierCost}>25,000G (Quest)</Text>
            </View>
          </View>
          <Text style={styles.repText}>Your reputation: {reputation}</Text>
        </View>
      </ScrollView>

      {/* Upgrade Confirmation Modal */}
      <Modal
        visible={selectedItem !== null && upgradeCost !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upgrade Weapon</Text>

            {selectedItem && upgradeCost && (
              <>
                <Text style={[styles.modalWeaponName, { color: QUALITY_COLORS[selectedItem.weapon.quality.tier] }]}>
                  {selectedItem.weapon.displayName}
                </Text>

                <View style={styles.upgradePreview}>
                  <View style={styles.upgradeFrom}>
                    <Text style={[styles.qualityLabel, { color: QUALITY_COLORS[selectedItem.weapon.quality.tier] }]}>
                      {selectedItem.weapon.quality.name}
                    </Text>
                    <Text style={styles.previewStat}>DMG: {selectedItem.weapon.finalDamage}</Text>
                    <Text style={styles.previewStat}>CRIT: {Math.round(selectedItem.weapon.finalCritChance * 100)}%</Text>
                  </View>
                  <Text style={styles.upgradeArrow}>→</Text>
                  <View style={styles.upgradeTo}>
                    <Text style={[styles.qualityLabel, { color: QUALITY_COLORS[upgradeCost.toQuality] }]}>
                      {upgradeCost.toQuality.charAt(0).toUpperCase() + upgradeCost.toQuality.slice(1)}
                    </Text>
                    <Text style={styles.previewStatNew}>DMG: +{Math.round(selectedItem.weapon.finalDamage * 0.1)}</Text>
                    <Text style={styles.previewStatNew}>CRIT: +5%</Text>
                  </View>
                </View>

                <View style={styles.costSection}>
                  <Text style={styles.costTitle}>Cost</Text>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Gold:</Text>
                    <Text style={[
                      styles.costValue,
                      character.gold < upgradeCost.goldCost && styles.costValueMissing
                    ]}>
                      {upgradeCost.goldCost.toLocaleString()}G
                    </Text>
                  </View>
                  {upgradeCost.materials.map((mat) => (
                    <MaterialRow
                      key={mat.materialId}
                      materialId={mat.materialId}
                      required={mat.quantity}
                      owned={getMaterialInventory(mat.materialId)}
                    />
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.confirmButton, !selectedItem.canUpgrade && styles.confirmButtonDisabled]}
                    onPress={handleConfirmUpgrade}
                    disabled={!selectedItem.canUpgrade}
                  >
                    <Text style={styles.confirmButtonText}>
                      {selectedItem.canUpgrade ? 'Upgrade' : 'Cannot Upgrade'}
                    </Text>
                  </Pressable>
                </View>

                {!selectedItem.canUpgrade && selectedItem.reason && (
                  <Text style={styles.errorReason}>{selectedItem.reason}</Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={resultWeapon !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upgrade Complete!</Text>
            {resultWeapon && (
              <>
                <Text style={styles.successIcon}>✨</Text>
                <Text style={[styles.resultName, { color: QUALITY_COLORS[resultWeapon.quality.tier] }]}>
                  {resultWeapon.displayName}
                </Text>
                <View style={styles.resultStats}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Quality:</Text>
                    <Text style={[styles.statValue, { color: QUALITY_COLORS[resultWeapon.quality.tier] }]}>
                      {resultWeapon.quality.name}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Damage:</Text>
                    <Text style={styles.statValue}>{resultWeapon.finalDamage}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Accuracy:</Text>
                    <Text style={styles.statValue}>{resultWeapon.finalAccuracy}%</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Crit Chance:</Text>
                    <Text style={styles.statValue}>{Math.round(resultWeapon.finalCritChance * 100)}%</Text>
                  </View>
                </View>
              </>
            )}
            <Pressable style={styles.confirmButton} onPress={closeModal}>
              <Text style={styles.confirmButtonText}>Excellent!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={error !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upgrade Failed</Text>
            <Text style={styles.modalText}>{error}</Text>
            <Pressable style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>OK</Text>
            </Pressable>
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

  // Instructions
  instructionsContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  instructionsTitle: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  instructionsText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  emptyText: {
    ...Typography.h5,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
  },

  // Weapon list
  weaponList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  weaponCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  weaponCardDisabled: {
    opacity: 0.6,
  },
  weaponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  weaponIcon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  weaponInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  weaponName: {
    ...Typography.h6,
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qualityBadge: {
    ...Typography.caption,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    fontSize: 10,
  },
  qualityArrow: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  statText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  reasonText: {
    ...Typography.caption,
    color: Colors.ui.error,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },

  // Tiers info
  tiersContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  tiersTitle: {
    ...Typography.h6,
    color: Colors.text.accent,
    marginBottom: Spacing.sm,
  },
  tiersList: {
    gap: Spacing.xs,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierName: {
    ...Typography.caption,
    width: 70,
  },
  tierArrow: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginHorizontal: Spacing.xs,
  },
  tierCost: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginLeft: 'auto',
  },
  repText: {
    ...Typography.caption,
    color: Colors.text.accent,
    marginTop: Spacing.sm,
    textAlign: 'right',
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
    marginBottom: Spacing.md,
  },
  modalWeaponName: {
    ...Typography.h5,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Upgrade preview
  upgradePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
  },
  upgradeFrom: {
    alignItems: 'center',
    flex: 1,
  },
  upgradeTo: {
    alignItems: 'center',
    flex: 1,
  },
  upgradeArrow: {
    ...Typography.h4,
    color: Colors.text.accent,
    marginHorizontal: Spacing.sm,
  },
  qualityLabel: {
    ...Typography.h6,
    marginBottom: Spacing.xs,
  },
  previewStat: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  previewStatNew: {
    ...Typography.caption,
    color: Colors.ui.success,
  },

  // Cost section
  costSection: {
    marginBottom: Spacing.lg,
  },
  costTitle: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  costLabel: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  costValue: {
    ...Typography.body,
    color: Colors.resource.gold,
  },
  costValueMissing: {
    color: Colors.ui.error,
  },

  // Material row
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  materialIcon: {
    fontSize: 20,
    width: 28,
  },
  materialName: {
    ...Typography.body,
    color: Colors.text.secondary,
    flex: 1,
  },
  materialCount: {
    ...Typography.body,
    color: Colors.ui.success,
  },
  materialCountMissing: {
    color: Colors.ui.error,
  },

  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.primary,
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
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.text.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.text.muted,
    opacity: 0.5,
  },
  confirmButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },
  errorReason: {
    ...Typography.caption,
    color: Colors.ui.error,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Success modal
  successIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  resultName: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  resultStats: {
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  statLabel: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  statValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
});
