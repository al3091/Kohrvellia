import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      // Stores persist via AsyncStorage (native); tests run in node with an in-memory shim.
      '@react-native-async-storage/async-storage': fileURLToPath(
        new URL('./tests/helpers/asyncStorageMock.ts', import.meta.url)
      ),
    },
  },
});
