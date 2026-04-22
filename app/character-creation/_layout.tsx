/**
 * Character Creation Layout
 * Stack navigator for the character creation wizard
 */

import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function CharacterCreationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="name" />
      <Stack.Screen name="backstory" />
      <Stack.Screen name="deity" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
