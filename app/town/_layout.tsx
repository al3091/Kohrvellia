/**
 * Town Layout
 * Stack navigation for town screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function TownLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="character/index" />
      <Stack.Screen name="familia/index" />
      <Stack.Screen name="familia/blessing-rite" />
      <Stack.Screen name="shops" />
      <Stack.Screen name="blacksmith" />
      <Stack.Screen name="guildhall" />
    </Stack>
  );
}
