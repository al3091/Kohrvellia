/**
 * The Seal — Screen 6 / 6
 * Not a review. A ceremony. One legend card, one identity strip, one stats grid.
 * No edit buttons. Back exists. Press "SEAL THE LEGEND" to commit.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { Button, Header, CeremonialDivider } from '../../src/components/ui';
import { useCreationState, useCreationValidation } from '../../src/hooks/useCreationState';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useDeityStore } from '../../src/stores/useDeityStore';
import { useSoulStore } from '../../src/stores/useSoulStore';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { BACKSTORIES } from '../../src/types/Character';
import { getDeityById } from '../../src/data/pantheons';
import type { StatName } from '../../src/types/Stats';
import { ALL_BASE_WEAPONS, MATERIALS, QUALITIES, createWeaponInstance } from '../../src/data/weapons/baseWeapons';

const STAT_ORDER: StatName[] = ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'WIS', 'LCK'];

export default function ConfirmScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { name, epithet, backstoryId, selectedDeityId, statAllocations, selectedWeaponId, reset } = useCreationState();
  const { canSubmit } = useCreationValidation();
  const { createCharacter, setPatronDeity, equipWeapon } = useCharacterStore();
  const { setPatronDeity: initializeDeityRelationship } = useDeityStore();
  const { initializeDenatus } = useSoulStore();
  const { initializeProgress } = useAchievementStore();

  const backstory = useMemo(() => {
    return backstoryId ? BACKSTORIES[backstoryId] : null;
  }, [backstoryId]);

  const deity = useMemo(() => {
    return selectedDeityId ? getDeityById(selectedDeityId) : null;
  }, [selectedDeityId]);

  const weapon = useMemo(() => {
    return selectedWeaponId ? ALL_BASE_WEAPONS.find(w => w.id === selectedWeaponId) : null;
  }, [selectedWeaponId]);

  const getFinalStatValue = (stat: StatName): number => {
    let value = statAllocations[stat] || 0;
    if (backstory?.statBonus.stat === stat) value += backstory.statBonus.value;
    if (deity?.statBonus.stat === stat) value += deity.statBonus.value;
    return value;
  };

  const handleConfirm = () => {
    if (!canSubmit || !backstoryId || !selectedDeityId || !deity || !backstory || !selectedWeaponId) return;

    haptics.heavy();

    createCharacter(
      name,
      epithet,
      backstoryId,
      statAllocations,
      { stat: deity.statBonus.stat, value: deity.statBonus.value }
    );
    setPatronDeity(selectedDeityId);
    initializeDeityRelationship(selectedDeityId);
    initializeDenatus();

    const baseWeapon = ALL_BASE_WEAPONS.find(w => w.id === selectedWeaponId);
    if (baseWeapon) {
      const material = MATERIALS.find(m => m.tier === 'common') ?? MATERIALS[1];
      const quality = QUALITIES.find(q => q.tier === 'standard') ?? QUALITIES[1];
      const starterWeapon = createWeaponInstance(baseWeapon, material, quality, undefined, 0);
      equipWeapon(starterWeapon);
    }

    initializeProgress();
    reset();

    router.replace('/town');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Seal Your Legend" showBack onBack={handleBack} />

      <View style={styles.body}>
        {/* Legend Card — focal point */}
        <View style={styles.legendCard}>
          <Text style={styles.legendName}>{name || '—'}</Text>
          <Text style={styles.legendEpithet}>the {epithet || '—'}</Text>
        </View>

        {/* Identity Strip */}
        <View style={styles.identityStrip}>
          <Text style={styles.identityPill}>{backstory?.name ?? '—'}</Text>
          <Text style={styles.identitySep}>·</Text>
          <Text style={styles.identityPill}>{deity?.name ?? '—'}</Text>
          <Text style={styles.identitySep}>·</Text>
          <Text style={styles.identityPill}>{weapon?.name ?? '—'}</Text>
        </View>

        <CeremonialDivider variant="thin" />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STAT_ORDER.map((stat) => (
            <View key={stat} style={styles.statBox}>
              <Text style={styles.statAbbrev}>{stat}</Text>
              <Text style={styles.statValue}>{getFinalStatValue(stat)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="SEAL THE LEGEND"
          onPress={handleConfirm}
          disabled={!canSubmit}
          hapticStyle="heavy"
          size="lg"
          fullWidth
        />
        <Text style={styles.footerCaption}>What begins here cannot be undone.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  body: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  legendCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
    gap: Spacing.xs,
  },
  legendName: {
    ...Typography.h2,
    color: Colors.text.accent,
    textAlign: 'center',
    letterSpacing: 1,
  },
  legendEpithet: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  identityStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  identityPill: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 2,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  identitySep: {
    ...Typography.label,
    color: Colors.border.accent,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBox: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.sm,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    gap: 2,
  },
  statAbbrev: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 1,
  },
  statValue: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  footerCaption: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
