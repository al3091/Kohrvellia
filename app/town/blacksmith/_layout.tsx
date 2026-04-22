/**
 * Blacksmith Layout
 * Stack navigation for blacksmith screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function BlacksmithLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="identify" />
      <Stack.Screen name="upgrade" />
      <Stack.Screen name="repair" />
    </Stack>
  );
}
