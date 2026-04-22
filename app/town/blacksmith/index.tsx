/**
 * Blacksmith Hub Screen
 * NPC greeting and service selection
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../../src/constants/Spacing';
import { useCharacterStore } from '../../../src/stores/useCharacterStore';
import { useBlacksmithStore } from '../../../src/stores/useBlacksmithStore';
import { useHaptics } from '../../../src/hooks/useHaptics';
import { BLACKSMITH_NPC, getBlacksmithGreeting, IDENTIFICATION_COST } from '../../../src/types/Blacksmith';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  cost?: string;
  onPress: () => void;
  disabled?: boolean;
  badge?: number;
}

function ServiceCard({ title, description, icon, cost, onPress, disabled, badge }: ServiceCardProps) {
  return (
    <Pressable
      style={[styles.serviceCard, disabled && styles.serviceCardDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.serviceIcon}>{icon}</Text>
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.serviceInfo}>
        <Text style={[styles.serviceTitle, disabled && styles.serviceTitleDisabled]}>
          {title}
        </Text>
        <Text style={[styles.serviceDesc, disabled && styles.serviceDescDisabled]}>
          {description}
        </Text>
        {cost && (
          <Text style={[styles.serviceCost, disabled && styles.serviceCostDisabled]}>
            {cost}
          </Text>
        )}
      </View>
      <Text style={styles.serviceArrow}>&gt;</Text>
    </Pressable>
  );
}

export default function BlacksmithHubScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character } = useCharacterStore();
  const {
    reputation,
    getReputationTier,
    getUnidentifiedWeapons,
    getUpgradeableWeapons,
  } = useBlacksmithStore();

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

  const unidentifiedCount = getUnidentifiedWeapons().length;
  const upgradeableCount = getUpgradeableWeapons().length;
  const reputationTier = getReputationTier();
  const greeting = getBlacksmithGreeting(reputation);

  const handleIdentify = () => {
    haptics.light();
    router.push('/town/blacksmith/identify');
  };

  const handleUpgrade = () => {
    haptics.light();
    router.push('/town/blacksmith/upgrade');
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  // Reputation tier colors
  const repColors: Record<string, string> = {
    hostile: Colors.ui.error,
    neutral: Colors.text.muted,
    friendly: Colors.text.accent,
    trusted: Colors.resource.gold,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </Pressable>
          <Text style={styles.title}>BLACKSMITH</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldLabel}>Gold</Text>
            <Text style={styles.goldValue}>{character.gold.toLocaleString()} G</Text>
          </View>
        </View>

        {/* NPC Section */}
        <View style={styles.npcSection}>
          <View style={styles.npcHeader}>
            <Text style={styles.npcIcon}>{BLACKSMITH_NPC.icon}</Text>
            <View style={styles.npcInfo}>
              <Text style={styles.npcName}>{BLACKSMITH_NPC.name}</Text>
              <Text style={[styles.npcRep, { color: repColors[reputationTier] }]}>
                {reputationTier.charAt(0).toUpperCase() + reputationTier.slice(1)} ({reputation > 0 ? '+' : ''}{reputation})
              </Text>
            </View>
          </View>
          <View style={styles.dialogueBox}>
            <Text style={styles.dialogueText}>"{greeting}"</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Services</Text>

          <ServiceCard
            title="Identify Equipment"
            description="Reveal the true properties of mysterious weapons"
            icon="🔍"
            cost={`${IDENTIFICATION_COST}G per item`}
            onPress={handleIdentify}
            badge={unidentifiedCount}
            disabled={unidentifiedCount === 0}
          />

          <ServiceCard
            title="Upgrade Quality"
            description="Improve your weapon's craftsmanship"
            icon="⚒️"
            cost="Gold + Materials"
            onPress={handleUpgrade}
            badge={upgradeableCount}
            disabled={upgradeableCount === 0}
          />

          <ServiceCard
            title="Salvage Equipment"
            description="Break down weapons and armor into crafting materials"
            icon="🔧"
            cost="Recover materials + gold"
            onPress={() => { haptics.light(); router.push('/town/blacksmith/repair'); }}
            disabled={false}
          />
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Blacksmith Tips</Text>
          <Text style={styles.tipsText}>
            • Unidentified weapons may have hidden enchantments{'\n'}
            • Higher quality weapons deal more damage and crit more often{'\n'}
            • Build reputation to unlock advanced upgrades{'\n'}
            • Salvage unwanted gear to recover materials and gold
          </Text>
        </View>
      </ScrollView>
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

  // NPC Section
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
    fontSize: 48,
    marginRight: Spacing.md,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  npcRep: {
    ...Typography.caption,
    marginTop: 2,
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
  },

  // Services
  servicesContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  serviceCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  serviceCardDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    position: 'relative',
  },
  serviceIcon: {
    fontSize: 36,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.ui.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: 'bold',
    fontSize: 11,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  serviceTitleDisabled: {
    color: Colors.text.muted,
  },
  serviceDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  serviceDescDisabled: {
    color: Colors.text.muted,
  },
  serviceCost: {
    ...Typography.caption,
    color: Colors.resource.gold,
    marginTop: 4,
  },
  serviceCostDisabled: {
    color: Colors.text.muted,
  },
  serviceArrow: {
    ...Typography.h4,
    color: Colors.text.muted,
  },

  // Tips
  tipsContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  tipsTitle: {
    ...Typography.h6,
    color: Colors.text.accent,
    marginBottom: Spacing.xs,
  },
  tipsText: {
    ...Typography.caption,
    color: Colors.text.muted,
    lineHeight: 20,
  },
});
