/**
 * Tutorial Layout
 * Stack navigator for the tutorial flow
 * Gesture disabled to prevent accidental back navigation
 */

import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function TutorialLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent accidental back swipe
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="basics" />
      <Stack.Screen name="combat" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="falna" />
      <Stack.Screen name="leveling" />
      <Stack.Screen name="death" />
    </Stack>
  );
}
