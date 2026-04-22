/**
 * Deity Selection Layout
 * Stack navigator for pantheon and deity selection
 */

import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function DeityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[pantheonId]" />
    </Stack>
  );
}
