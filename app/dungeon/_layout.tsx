import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useSoundStore } from '../../src/stores/useSoundStore';

export default function DungeonLayout() {
  const { preloadCombatSounds, playBGM } = useSoundStore();

  // Preload combat sounds and start dungeon BGM when entering dungeon
  useEffect(() => {
    // Preload combat SFX for smoother combat transitions
    preloadCombatSounds();

    // Start dungeon ambient BGM
    playBGM('dungeon');

    // Cleanup on dungeon exit
    return () => {
      // Optionally unload combat sounds to free memory
      // unloadGroup('combat');
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="floor" />
      <Stack.Screen name="room" />
      <Stack.Screen name="combat" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="level-up" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="epitaph" options={{ headerShown: false }} />
    </Stack>
  );
}
