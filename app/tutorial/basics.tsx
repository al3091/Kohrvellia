/**
 * Tutorial Screen 2 — The Rules
 * Three facts. Every run. No exceptions.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { Button, CeremonialDivider } from '../../src/components/ui';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useGameStore } from '../../src/stores/useGameStore';

const RULES = [
  {
    label: 'REST SITES ARE RARE.',
    body: 'You will not find one when you need it. Find one — use it.',
    color: Colors.domain.life,
  },
  {
    label: 'GOING DEEPER IS A BET.',
    body: "Every floor adds risk. There is no safe path down. There is only the path you choose.",
    color: Colors.text.accent,
  },
  {
    label: 'YOU CANNOT GO BACK.',
    body: 'No exit until you climb back out. You made the choice at the threshold.',
    color: Colors.domain.death,
  },
];

export default function TutorialBasicsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { advanceTutorial } = useGameStore();

  const handleContinue = () => {
    haptics.medium();
    advanceTutorial();
    router.push('/tutorial/combat');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Three Rules</Text>
        <Text style={styles.subtitle}>Every run. No exceptions.</Text>
      </View>

      <View style={styles.body}>
        {RULES.map((rule, i) => (
          <React.Fragment key={rule.label}>
            <View style={styles.rule}>
              <Text style={[styles.ruleLabel, { color: rule.color }]}>{rule.label}</Text>
              <Text style={styles.ruleBody}>{rule.body}</Text>
            </View>
            {i < RULES.length - 1 && <CeremonialDivider variant="thin" />}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          label="Understood"
          onPress={handleContinue}
          hapticStyle="medium"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.accent,
    letterSpacing: 1,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: Padding.screen.horizontal,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  rule: {
    gap: Spacing.sm,
  },
  ruleLabel: {
    ...Typography.label,
    fontSize: 12,
    letterSpacing: 2,
  },
  ruleBody: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
});
