/**
 * Settings Screen
 * Audio, haptics, and game settings
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { useGameStore } from '../../src/stores/useGameStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { clearAllStores } from '../../src/lib/clearAllStores';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius } from '../../src/constants/Spacing';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    masterVolume,
    sfxVolume,
    bgmVolume,
    sfxEnabled,
    bgmEnabled,
    setMasterVolume,
    setSFXVolume,
    setBGMVolume,
    toggleSFX,
    toggleBGM,
  } = useSoundStore();

  const { resetTutorial } = useGameStore();
  const { character } = useCharacterStore();

  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleResetTutorial = () => {
    Alert.alert(
      'Reset Tutorial',
      'This will show the tutorial again on your next new game.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            resetTutorial();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleDevSeedAchievement = () => {
    useCharacterStore.getState().addAchievementProgress({
      achievementId: 'dev_boost',
      discoveryState: 'completed',
      requirementProgress: [{ requirementIndex: 0, current: 1, target: 1, completed: true }],
      isCompleted: true,
      completedAt: Date.now(),
      usedForLevelUp: false,
    });
    useAchievementStore.getState().updateProgress('kill_count', 50);
    useAchievementStore.getState().updateProgress('floor_reach', 5);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/town/familia');
  };

  const handleDevToggleDeityApproval = () => {
    const charStore = useCharacterStore.getState();
    charStore.setDeityApproval(!charStore.character?.levelProgress.deityApproved);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDevStatBoost = (stat: 'STR' | 'PER' | 'END' | 'CHA' | 'INT' | 'AGI' | 'WIS' | 'LCK') => {
    const charStore = useCharacterStore.getState();
    const current = charStore.character?.stats[stat]?.points ?? 0;
    charStore.setStatPoints(stat, Math.min(999, current + 100));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete your character and all progress. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            clearAllStores();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Audio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUDIO</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Master Volume</Text>
          <View style={styles.volumeControl}>
            <Pressable
              style={styles.volumeButton}
              onPress={() => setMasterVolume(Math.max(0, masterVolume - 0.1))}
            >
              <Text style={styles.volumeButtonText}>-</Text>
            </Pressable>
            <Text style={styles.volumeValue}>{Math.round(masterVolume * 100)}%</Text>
            <Pressable
              style={styles.volumeButton}
              onPress={() => setMasterVolume(Math.min(1, masterVolume + 0.1))}
            >
              <Text style={styles.volumeButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.labelWithToggle}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={sfxEnabled}
              onValueChange={toggleSFX}
              trackColor={{ false: Colors.border.primary, true: Colors.text.accent }}
              thumbColor={Colors.text.primary}
            />
          </View>
          <View style={styles.volumeControl}>
            <Pressable
              style={[styles.volumeButton, !sfxEnabled && styles.volumeButtonDisabled]}
              onPress={() => sfxEnabled && setSFXVolume(Math.max(0, sfxVolume - 0.1))}
              disabled={!sfxEnabled}
            >
              <Text style={[styles.volumeButtonText, !sfxEnabled && styles.disabledText]}>-</Text>
            </Pressable>
            <Text style={[styles.volumeValue, !sfxEnabled && styles.disabledText]}>
              {Math.round(sfxVolume * 100)}%
            </Text>
            <Pressable
              style={[styles.volumeButton, !sfxEnabled && styles.volumeButtonDisabled]}
              onPress={() => sfxEnabled && setSFXVolume(Math.min(1, sfxVolume + 0.1))}
              disabled={!sfxEnabled}
            >
              <Text style={[styles.volumeButtonText, !sfxEnabled && styles.disabledText]}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.labelWithToggle}>
            <Text style={styles.settingLabel}>Background Music</Text>
            <Switch
              value={bgmEnabled}
              onValueChange={toggleBGM}
              trackColor={{ false: Colors.border.primary, true: Colors.text.accent }}
              thumbColor={Colors.text.primary}
            />
          </View>
          <View style={styles.volumeControl}>
            <Pressable
              style={[styles.volumeButton, !bgmEnabled && styles.volumeButtonDisabled]}
              onPress={() => bgmEnabled && setBGMVolume(Math.max(0, bgmVolume - 0.1))}
              disabled={!bgmEnabled}
            >
              <Text style={[styles.volumeButtonText, !bgmEnabled && styles.disabledText]}>-</Text>
            </Pressable>
            <Text style={[styles.volumeValue, !bgmEnabled && styles.disabledText]}>
              {Math.round(bgmVolume * 100)}%
            </Text>
            <Pressable
              style={[styles.volumeButton, !bgmEnabled && styles.volumeButtonDisabled]}
              onPress={() => bgmEnabled && setBGMVolume(Math.min(1, bgmVolume + 0.1))}
              disabled={!bgmEnabled}
            >
              <Text style={[styles.volumeButtonText, !bgmEnabled && styles.disabledText]}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Feedback Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FEEDBACK</Text>

        <View style={styles.settingRow}>
          <View style={styles.labelWithToggle}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: Colors.border.primary, true: Colors.text.accent }}
              thumbColor={Colors.text.primary}
            />
          </View>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleResetTutorial}
        >
          <Text style={styles.buttonText}>Reset Tutorial</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, styles.dangerButton, pressed && styles.buttonPressed]}
          onPress={handleClearAllData}
        >
          <Text style={[styles.buttonText, styles.dangerText]}>Clear All Data</Text>
        </Pressable>
      </View>

      {/* DEV TOOLS — only visible in dev builds */}
      {__DEV__ && character && (
        <View style={styles.devSection}>
          <Text style={styles.devLabel}>DEV TOOLS</Text>

          {/* Stat grid — tap each to +100 */}
          <Text style={styles.devSubLabel}>STATS  (tap to +100)</Text>
          <View style={styles.devStatGrid}>
            {(['STR','PER','END','CHA','INT','AGI','WIS','LCK'] as const).map(stat => {
              const s = character.stats[stat];
              return (
                <Pressable key={stat} style={[styles.devStatBtn, s.points >= 500 && styles.devStatBtnMet]}
                  onPress={() => handleDevStatBoost(stat)}>
                  <Text style={styles.devStatName}>{stat}</Text>
                  <Text style={[styles.devStatGrade, s.points >= 500 && styles.devStatGradeMet]}>{s.grade}</Text>
                  <Text style={styles.devStatPoints}>{s.points}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Deity approval toggle */}
          <Pressable style={styles.devButton} onPress={handleDevToggleDeityApproval}>
            <Text style={styles.devButtonText}>
              Deity Approval: {character.levelProgress.deityApproved ? '✓ GRANTED' : '✗ NOT GRANTED'}
            </Text>
          </Pressable>

          {/* Seed achievement + go to guild hall */}
          <Pressable style={styles.devButton} onPress={handleDevSeedAchievement}>
            <Text style={styles.devButtonText}>Seed Achievement → Familia Home</Text>
            <Text style={styles.devButtonSub}>Marks achievement complete · opens ascension panel</Text>
          </Pressable>
        </View>
      )}

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Kohrvellia v0.1.0</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backText: {
    ...Typography.body,
    color: Colors.text.accent,
  },
  title: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  spacer: {
    width: 60,
  },
  section: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  settingRow: {
    marginBottom: Spacing.lg,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  labelWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  volumeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeButtonDisabled: {
    opacity: 0.4,
  },
  volumeButtonText: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  volumeValue: {
    ...Typography.body,
    color: Colors.text.primary,
    width: 50,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.text.muted,
  },
  button: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  dangerButton: {
    borderColor: Colors.ui.error,
  },
  dangerText: {
    color: Colors.ui.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  devSection: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.domain.death + '40',
    gap: Spacing.sm,
  },
  devLabel: {
    ...Typography.label,
    color: Colors.domain.death,
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  devButton: {
    backgroundColor: Colors.domain.death + '20',
    borderWidth: 1,
    borderColor: Colors.domain.death,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  devButtonText: {
    ...Typography.bodySmall,
    color: Colors.domain.death,
    fontWeight: '600',
  },
  devButtonSub: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  devSubLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  devStatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  devStatBtn: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    padding: Spacing.sm,
    alignItems: 'center',
    minWidth: 56,
    gap: 2,
  },
  devStatBtnMet: {
    borderColor: Colors.domain.nature,
  },
  devStatName: {
    ...Typography.label,
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 1,
  },
  devStatGrade: {
    ...Typography.h5,
    color: Colors.text.secondary,
    fontWeight: '700',
  },
  devStatGradeMet: {
    color: Colors.domain.nature,
  },
  devStatPoints: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
});
