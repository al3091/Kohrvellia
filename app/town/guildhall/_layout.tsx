/**
 * Guild Hall Layout
 * Stack navigation for guild hall screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function GuildHallLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
