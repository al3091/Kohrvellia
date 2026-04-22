/**
 * Shops Layout
 * Stack navigation for shop screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function ShopsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="general/index" />
      <Stack.Screen name="equipment/index" />
      <Stack.Screen name="sell/index" />
    </Stack>
  );
}
