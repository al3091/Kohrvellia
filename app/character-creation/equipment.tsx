/**
 * Equipment Selection Screen
 * Step 5 of character creation: Choose starting weapon
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { Button, Header, Card, ProgressIndicator } from '../../src/components/ui';
import { useCreationState } from '../../src/hooks/useCreationState';
import { useHaptics } from '../../src/hooks/useHaptics';
import { BACKSTORIES } from '../../src/types/Character';
import { getDeityById } from '../../src/data/pantheons';
import type { StatName } from '../../src/types/Stats';
import type { BaseWeapon } from '../../src/types/Weapon';
import { getStarterWeaponForStat } from '../../src/data/weapons/baseWeapons';

const STEP_LABELS = ['Name', 'Origin', 'Deity', 'Stats', 'Weapon', 'Confirm'];
const STAT_ORDER: StatName[] = ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'WIS', 'LCK'];

// One-line flavor — shown only in the details card on selection
const WEAPON_FLAVOR: Record<string, string> = {
  longsword: 'Balanced. Reliable in any situation.',
  mace: 'Slow. Devastating against armor.',
  dagger: 'Swift. Strikes before they can react.',
  rapier: 'Precise. Finds gaps in any defense.',
  shortbow: 'Patient. Distance is your weapon.',
  wand: 'Focused. Knowledge amplifies power.',
  staff: 'Versatile. Raw force, well-directed.',
  holy_symbol: 'Faithful. Light as both strike and shield.',
  prayer_beads: 'Wise. Patience rewarded each bead.',
  whip: 'Commanding. Presence controls the field.',
  war_fan: 'Graceful. Art and danger as one.',
  tower_shield: 'Immovable. Defense as the greater offense.',
  flail: 'Relentless. Endurance outlasts everything.',
  loaded_dice: 'Fated. Fortune rarely frowns twice.',
  throwing_knives: 'Precise. Swift hands, swifter eyes.',
};

// Get weapons available based on player's top stats
function getWeaponOptions(
  statAllocations: Record<StatName, number>,
  backstory: typeof BACKSTORIES[keyof typeof BACKSTORIES] | null,
  deity: ReturnType<typeof getDeityById> | null
): { weapon: BaseWeapon; stat: StatName; isRecommended: boolean; isRisky: boolean }[] {
  // Calculate final stat values
  const finalStats: Record<StatName, number> = {} as Record<StatName, number>;
  for (const stat of STAT_ORDER) {
    let value = statAllocations[stat] || 0;
    if (backstory?.statBonus.stat === stat) value += backstory.statBonus.value;
    if (deity?.statBonus.stat === stat) value += deity.statBonus.value;
    finalStats[stat] = value;
  }

  // Sort stats by value
  const sortedStats = STAT_ORDER
    .map(stat => ({ stat, value: finalStats[stat] }))
    .sort((a, b) => b.value - a.value);

  const options: { weapon: BaseWeapon; stat: StatName; isRecommended: boolean; isRisky: boolean }[] = [];

  // Add weapon from highest stat (recommended)
  const highestStat = sortedStats[0].stat;
  const highestWeapon = getStarterWeaponForStat(highestStat);
  if (highestWeapon) {
    options.push({ weapon: highestWeapon, stat: highestStat, isRecommended: true, isRisky: false });
  }

  // Add weapon from second highest stat
  const secondStat = sortedStats[1].stat;
  const secondWeapon = getStarterWeaponForStat(secondStat);
  if (secondWeapon && secondWeapon.id !== highestWeapon?.id) {
    options.push({ weapon: secondWeapon, stat: secondStat, isRecommended: false, isRisky: false });
  }

  // Add an alternative weapon from third stat (risky choice)
  const thirdStat = sortedStats[2].stat;
  const thirdWeapon = getStarterWeaponForStat(thirdStat);
  if (thirdWeapon && thirdWeapon.id !== highestWeapon?.id && thirdWeapon.id !== secondWeapon?.id) {
    options.push({ weapon: thirdWeapon, stat: thirdStat, isRecommended: false, isRisky: true });
  }

  return options;
}


export default function EquipmentScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { backstoryId, selectedDeityId, statAllocations, selectedWeaponId, setSelectedWeapon } = useCreationState();
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(selectedWeaponId);

  const backstory = useMemo(() => {
    return backstoryId ? BACKSTORIES[backstoryId] : null;
  }, [backstoryId]);

  const deity = useMemo(() => {
    return selectedDeityId ? getDeityById(selectedDeityId) : null;
  }, [selectedDeityId]);

  const weaponOptions = useMemo(() => {
    return getWeaponOptions(statAllocations, backstory, deity);
  }, [statAllocations, backstory, deity]);

  // Select the recommended weapon by default if nothing selected
  React.useEffect(() => {
    if (!localSelectedId && weaponOptions.length > 0) {
      const recommended = weaponOptions.find(o => o.isRecommended);
      if (recommended) {
        setLocalSelectedId(recommended.weapon.id);
      }
    }
  }, [weaponOptions]);

  const handleSelectWeapon = (weaponId: string) => {
    haptics.medium();
    setLocalSelectedId(weaponId);
  };

  const handleContinue = () => {
    if (!localSelectedId) return;
    haptics.success();
    setSelectedWeapon(localSelectedId);
    router.push('/character-creation/confirm');
  };

  const handleBack = () => {
    router.back();
  };

  const selectedWeaponData = weaponOptions.find(o => o.weapon.id === localSelectedId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Choose Your Weapon"
        subtitle="The tool defines the adventurer"
        showBack
        onBack={handleBack}
      />

      <ProgressIndicator
        currentStep={5}
        totalSteps={6}
        labels={STEP_LABELS}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Weapon Options */}
        <View style={styles.weaponGrid}>
          {weaponOptions.map(({ weapon, stat, isRecommended, isRisky }) => {
            const isSelected = localSelectedId === weapon.id;

            return (
              <Pressable
                key={weapon.id}
                style={[
                  styles.weaponCard,
                  isSelected && styles.weaponCardSelected,
                  isRisky && styles.weaponCardRisky,
                ]}
                onPress={() => handleSelectWeapon(weapon.id)}
              >
                {/* Badges */}
                <View style={styles.badgeContainer}>
                  {isRecommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                    </View>
                  )}
                  {isRisky && (
                    <View style={styles.riskyBadge}>
                      <Text style={styles.riskyBadgeText}>RISKY</Text>
                    </View>
                  )}
                </View>

                {/* Weapon Name */}
                <Text style={[styles.weaponName, isSelected && styles.weaponNameSelected]}>
                  {weapon.name}
                </Text>

                {/* Scaling Stat */}
                <View style={[styles.scalingBadge, { backgroundColor: getStatColor(stat) + '30' }]}>
                  <Text style={[styles.scalingText, { color: getStatColor(stat) }]}>
                    {stat}
                  </Text>
                </View>

                {/* Stats Row */}
                <View style={styles.weaponStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>DMG</Text>
                    <Text style={styles.statValue}>{weapon.baseDamage}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>ACC</Text>
                    <Text style={styles.statValue}>{weapon.baseAccuracy}%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>CRIT</Text>
                    <Text style={styles.statValue}>{weapon.baseCritChance}%</Text>
                  </View>
                </View>

                {/* Selection Indicator */}
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>SELECTED</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Selected Weapon Details */}
        {selectedWeaponData && (
          <Card style={styles.detailsCard}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DMG</Text>
                <Text style={styles.detailValue}>{selectedWeaponData.weapon.baseDamage}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ACC</Text>
                <Text style={styles.detailValue}>{selectedWeaponData.weapon.baseAccuracy}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>CRIT</Text>
                <Text style={styles.detailValue}>{selectedWeaponData.weapon.baseCritChance}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>SPEED</Text>
                <Text style={styles.detailValue}>{selectedWeaponData.weapon.attackSpeed.toFixed(1)}x</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>2H</Text>
                <Text style={styles.detailValue}>{selectedWeaponData.weapon.twoHanded ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>TRAINS</Text>
                <Text style={[styles.detailValue, { color: getStatColor(selectedWeaponData.stat) }]}>
                  {selectedWeaponData.stat}
                </Text>
              </View>
            </View>
            <Text style={styles.flavorText}>
              {WEAPON_FLAVOR[selectedWeaponData.weapon.id] || 'A reliable weapon for any adventurer.'}
            </Text>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!localSelectedId}
          hapticStyle="success"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

function getStatColor(stat: StatName): string {
  const statColors: Record<StatName, string> = {
    STR: Colors.ui.error,
    END: Colors.domain.nature,
    AGI: Colors.ui.success,
    INT: Colors.ui.info,
    WIS: Colors.domain.wisdom,
    PER: Colors.resource.gold,
    CHA: Colors.domain.authority,
    LCK: Colors.domain.fortune,
  };
  return statColors[stat] || Colors.text.secondary;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingBottom: Spacing['4xl'],
  },
  weaponGrid: {
    gap: Spacing.md,
  },
  weaponCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: BorderWidth.normal,
    borderColor: Colors.border.primary,
  },
  weaponCardSelected: {
    borderColor: Colors.text.accent,
    borderWidth: BorderWidth.thick,
    backgroundColor: Colors.background.tertiary,
  },
  weaponCardRisky: {
    borderColor: Colors.ui.warning + '60',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  recommendedBadge: {
    backgroundColor: Colors.ui.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  recommendedBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  riskyBadge: {
    backgroundColor: Colors.ui.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  riskyBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  weaponName: {
    ...Typography.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  weaponNameSelected: {
    color: Colors.text.accent,
  },
  scalingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  scalingText: {
    ...Typography.label,
    fontSize: 10,
    fontWeight: 'bold',
  },
  weaponStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
  },
  statValue: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.text.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  selectedIndicatorText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.background.primary,
  },
  detailsCard: {
    marginTop: Spacing.xl,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  detailItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.sm,
  },
  detailLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
  },
  detailValue: {
    ...Typography.h6,
    color: Colors.text.primary,
  },
  flavorText: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
    backgroundColor: Colors.background.primary,
  },
});
