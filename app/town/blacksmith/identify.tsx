/**
 * Identify Screen
 * List unidentified weapons and reveal their properties
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
import { IDENTIFICATION_COST, BLACKSMITH_NPC } from '../../../src/types/Blacksmith';
import type { Weapon } from '../../../src/types/Weapon';

// Tier colors for display
const TIER_COLORS: Record<string, string> = {
  junk: '#666666',
  common: '#9a9a9a',
  uncommon: '#5fa55f',
  rare: '#5b7bb8',
  epic: '#7b5fb3',
  legendary: '#c9a227',
};

interface WeaponCardProps {
  weapon: Weapon;
  inventoryId: string;
  onIdentify: (id: string) => void;
  canAfford: boolean;
}

function WeaponCard({ weapon, inventoryId, onIdentify, canAfford }: WeaponCardProps) {
  // Show mystery stats for unidentified weapons
  return (
    <Pressable
      style={[styles.weaponCard, !canAfford && styles.weaponCardDisabled]}
      onPress={() => canAfford && onIdentify(inventoryId)}
      disabled={!canAfford}
    >
      <View style={styles.weaponHeader}>
        <Text style={styles.weaponIcon}>?</Text>
        <View style={styles.weaponInfo}>
          <Text style={styles.weaponName}>Unidentified {weapon.base.name}</Text>
          <Text style={styles.weaponType}>
            {weapon.base.category} - {weapon.base.range === 'melee' ? 'Melee' : 'Ranged'}
          </Text>
        </View>
        <View style={styles.identifyButton}>
          <Text style={[styles.identifyText, !canAfford && styles.identifyTextDisabled]}>
            Identify
          </Text>
          <Text style={[styles.identifyCost, !canAfford && styles.identifyCostDisabled]}>
            {IDENTIFICATION_COST}G
          </Text>
        </View>
      </View>
      <View style={styles.mysteryStats}>
        <Text style={styles.mysteryText}>??? DMG</Text>
        <Text style={styles.mysteryText}>??? ACC</Text>
        <Text style={styles.mysteryText}>??? CRIT</Text>
      </View>
      <Text style={styles.floorText}>Found on Floor {weapon.floorFound}</Text>
    </Pressable>
  );
}

export default function IdentifyScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const { getUnidentifiedWeapons, identifyWeapon, getIdentificationCost } = useBlacksmithStore();

  const [selectedWeapon, setSelectedWeapon] = useState<{ weapon: Weapon; id: string } | null>(null);
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

  const canAfford = character.gold >= getIdentificationCost();

  // Get unidentified weapons with their data
  const unidentifiedItems = getUnidentifiedWeapons();

  const handleIdentifyRequest = (inventoryId: string) => {
    const item = unidentifiedItems.find((i) => i.id === inventoryId);
    if (item) {
      setSelectedWeapon({ weapon: item.weapon, id: inventoryId });
    }
  };

  const handleConfirmIdentify = () => {
    if (!selectedWeapon) return;

    haptics.medium();
    const result = identifyWeapon(selectedWeapon.id);

    if (result.success && result.weapon) {
      setResultWeapon(result.weapon);
      setSelectedWeapon(null);
    } else {
      setError(result.error || 'Identification failed');
      setSelectedWeapon(null);
    }
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const closeModal = () => {
    setSelectedWeapon(null);
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
          <Text style={styles.title}>IDENTIFY</Text>
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
            "Mysterious weapons found in the dungeon often hide their true power.
            For {IDENTIFICATION_COST} gold, I can reveal their secrets."
          </Text>
        </View>

        {/* Weapon List */}
        {unidentifiedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No unidentified weapons</Text>
            <Text style={styles.emptySubtext}>
              Find mysterious weapons in the dungeon to identify them here
            </Text>
          </View>
        ) : (
          <View style={styles.weaponList}>
            <Text style={styles.sectionTitle}>
              Unidentified Weapons ({unidentifiedItems.length})
            </Text>
            {unidentifiedItems.map((item) => (
              <WeaponCard
                key={item.id}
                weapon={item.weapon}
                inventoryId={item.id}
                onIdentify={handleIdentifyRequest}
                canAfford={canAfford}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={selectedWeapon !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Identify Weapon?</Text>
            <Text style={styles.modalText}>
              Pay {IDENTIFICATION_COST}G to reveal the true properties of this{' '}
              {selectedWeapon?.weapon.base.name}?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleConfirmIdentify}>
                <Text style={styles.confirmButtonText}>Identify ({IDENTIFICATION_COST}G)</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Result Modal */}
      <Modal
        visible={resultWeapon !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Weapon Identified!</Text>
            {resultWeapon && (
              <>
                <Text style={[styles.resultName, { color: TIER_COLORS[resultWeapon.rarity] }]}>
                  {resultWeapon.displayName}
                </Text>
                <View style={styles.resultStats}>
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
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Quality:</Text>
                    <Text style={styles.statValue}>{resultWeapon.quality.name}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Material:</Text>
                    <Text style={styles.statValue}>{resultWeapon.material.name}</Text>
                  </View>
                  {resultWeapon.enchantment && (
                    <View style={styles.enchantmentBox}>
                      <Text style={styles.enchantmentTitle}>Enchantment</Text>
                      <Text style={styles.enchantmentName}>
                        {resultWeapon.enchantment.name}
                      </Text>
                      {resultWeapon.enchantment.effects.map((effect, i) => (
                        <Text key={i} style={styles.enchantmentEffect}>
                          {effect.description}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
            <Pressable style={styles.confirmButton} onPress={closeModal}>
              <Text style={styles.confirmButtonText}>Great!</Text>
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
            <Text style={styles.modalTitle}>Error</Text>
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
    fontSize: 32,
    width: 40,
    textAlign: 'center',
    color: Colors.text.muted,
  },
  weaponInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  weaponName: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  weaponType: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  identifyButton: {
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  identifyText: {
    ...Typography.buttonSmall,
    color: Colors.text.accent,
  },
  identifyTextDisabled: {
    color: Colors.text.muted,
  },
  identifyCost: {
    ...Typography.caption,
    color: Colors.resource.gold,
    fontSize: 10,
  },
  identifyCostDisabled: {
    color: Colors.text.muted,
  },
  mysteryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  mysteryText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  floorText: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'right',
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
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
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
  confirmButtonText: {
    ...Typography.button,
    color: Colors.background.primary,
  },

  // Result
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
  enchantmentBox: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#7b5fb3',
  },
  enchantmentTitle: {
    ...Typography.caption,
    color: '#7b5fb3',
    fontWeight: 'bold',
  },
  enchantmentName: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  enchantmentEffect: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
});
