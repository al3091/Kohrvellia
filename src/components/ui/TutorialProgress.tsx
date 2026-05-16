import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export function TutorialProgress({ currentStep, totalSteps }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i < currentStep - 1 && styles.segmentComplete,
            i === currentStep - 1 && styles.segmentCurrent,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 2,
  },
  segment: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border.primary,
    borderRadius: 1,
  },
  segmentComplete: {
    backgroundColor: Colors.text.muted,
  },
  segmentCurrent: {
    backgroundColor: Colors.text.accent,
  },
});
