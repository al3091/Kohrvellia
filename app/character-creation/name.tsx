/**
 * Name Entry Screen — Screen 1 / 6
 * Focal point: the live preview text.
 * No narrative. No scroll.
 */

import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { Button, TextInput, Header, ProgressIndicator } from '../../src/components/ui';
import { useCreationState, useCreationValidation } from '../../src/hooks/useCreationState';

const STEP_LABELS = ['Name', 'Origin', 'Deity', 'Stats', 'Weapon', 'Confirm'];

export default function NameScreen() {
  const router = useRouter();
  const { name, epithet, setName, setEpithet } = useCreationState();
  const { isStep1Complete } = useCreationValidation();

  const handleContinue = () => {
    router.push('/character-creation/backstory');
  };

  const preview = name && epithet
    ? `${name} the ${epithet}`
    : name
      ? `${name} the —`
      : epithet
        ? `— the ${epithet}`
        : '— the —';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Create Your Legend" />
      <ProgressIndicator
        currentStep={1}
        totalSteps={6}
        labels={STEP_LABELS}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.body}>
          <View style={styles.previewBlock}>
            <Text style={styles.previewLabel}>YOUR LEGEND</Text>
            <Text style={styles.previewText}>{preview}</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="NAME"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              maxLength={20}
              autoCapitalize="words"
            />
            <TextInput
              label="EPITHET"
              value={epithet}
              onChangeText={setEpithet}
              placeholder="the Wandering Storm"
              maxLength={30}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="Continue"
            onPress={handleContinue}
            disabled={!isStep1Complete}
            hapticStyle="medium"
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
    justifyContent: 'center',
    gap: Spacing['2xl'],
  },
  previewBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  previewLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    letterSpacing: 3,
  },
  previewText: {
    ...Typography.h3,
    color: Colors.text.accent,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.md,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    backgroundColor: Colors.background.primary,
  },
});
