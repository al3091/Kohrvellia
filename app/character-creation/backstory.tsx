/**
 * Backstory Selection Screen — Screen 2 / 6
 * Cards show origin name + stat pills only. No flavor text. No narrative.
 */

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Padding } from '../../src/constants/Spacing';
import { Button, Header, ProgressIndicator } from '../../src/components/ui';
import { BackstoryCard } from '../../src/components/character-creation/BackstoryCard';
import { useCreationState, useCreationValidation } from '../../src/hooks/useCreationState';
import { BACKSTORIES, BackstoryId } from '../../src/types/Character';

const STEP_LABELS = ['Name', 'Origin', 'Deity', 'Stats', 'Weapon', 'Confirm'];

export default function BackstoryScreen() {
  const router = useRouter();
  const { backstoryId, setBackstory } = useCreationState();
  const { isStep2Complete } = useCreationValidation();

  const backstories = Object.values(BACKSTORIES);

  const handleSelect = (id: BackstoryId) => {
    setBackstory(id);
  };

  const handleContinue = () => {
    router.push('/character-creation/deity');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Choose Your Origin" showBack onBack={handleBack} />
      <ProgressIndicator
        currentStep={2}
        totalSteps={6}
        labels={STEP_LABELS}
      />

      <FlatList
        data={backstories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BackstoryCard
            backstory={item}
            selected={backstoryId === item.id}
            onSelect={handleSelect}
            showDeityHint
            showFlavor={false}
          />
        )}
      />

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!isStep2Complete}
          hapticStyle="medium"
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
  list: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  footer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    backgroundColor: Colors.background.primary,
  },
});
