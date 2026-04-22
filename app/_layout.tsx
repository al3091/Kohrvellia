import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { initWeaponRegistry } from '../src/data/weaponRegistry';
import { useSoundStore } from '../src/stores/useSoundStore';
import { GritOverlay } from '../src/components/ui/GritOverlay';

export default function RootLayout() {
  // Initialize weapon registry on app start
  useEffect(() => {
    initWeaponRegistry();
  }, []);

  // Initialize audio system on app start
  useEffect(() => {
    useSoundStore.getState().initialize();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: '#060406' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="tutorial" options={{ headerShown: false }} />
        <Stack.Screen name="character-creation" options={{ headerShown: false }} />
        <Stack.Screen name="dungeon" options={{ headerShown: false }} />
        <Stack.Screen name="codex" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      {/* Global post-processing: grain, scanlines, vignette */}
      <GritOverlay />
    </View>
  );
}
