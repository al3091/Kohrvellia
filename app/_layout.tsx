import { Component, useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, AppState, AppStateStatus, Text } from 'react-native';
import { initWeaponRegistry } from '../src/data/weaponRegistry';
import { useSoundStore } from '../src/stores/useSoundStore';
import { GritOverlay } from '../src/components/ui/GritOverlay';

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#060406', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ color: '#c9a84c', fontSize: 16, textAlign: 'center', lineHeight: 26 }}>
            The Tower claimed you unexpectedly.{'\n\n'}Restart to continue.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    initWeaponRegistry();
  }, []);

  useEffect(() => {
    useSoundStore.getState().initialize();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const { pauseBGM, resumeBGM } = useSoundStore.getState();
      if (appState.current === 'active' && nextState === 'background') {
        pauseBGM();
      } else if (appState.current !== 'active' && nextState === 'active') {
        resumeBGM();
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  return (
    <ErrorBoundary>
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
        <GritOverlay />
      </View>
    </ErrorBoundary>
  );
}
