import { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../src/stores/useGameStore';
import { useCharacterStore } from '../src/stores/useCharacterStore';
import { useDungeonStore } from '../src/stores/useDungeonStore';
import { useAchievementStore } from '../src/stores/useAchievementStore';
import { clearWeaponRegistry } from '../src/data/weaponRegistry';
import { useSoundStore } from '../src/stores/useSoundStore';
import { Colors } from '../src/constants/Colors';

// Static fallback epitaphs — used on first session before any deaths are recorded
const STATIC_EPITAPHS = [
  '"Floor 47. Her grip on the sword. Her last thought was of sunlight."',
  '"He chose the war deity. He died on floor 3. The ironwork was beautiful."',
  '"First run, floor 1. He opened a door. These things happen."',
  '"The Codex lists her under \'Fell to Own Ambition.\' This is accurate."',
  '"She made it to Floor 19. Longer than most. The Tower was surprised."',
  '"He read the map wrong. Most do."',
];

export default function TitleScreen() {
  const router = useRouter();
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const epitaphOpacity = useRef(new Animated.Value(0)).current;

  const { hasCompletedTutorial, runHistory } = useGameStore();
  const { character, deleteCharacter } = useCharacterStore();

  const hasExistingSave = !!character && !character.isDead;

  // Determine title screen state
  const titleState = useMemo(() => {
    if (hasExistingSave) return 'RETURNING_ACTIVE' as const;
    if (runHistory.length > 0) return 'RETURNING_DEAD' as const;
    return 'FIRST_RUN' as const;
  }, [hasExistingSave, runHistory.length]);

  // Most recent real death (not a return)
  const lastDeath = useMemo(() => {
    return runHistory.find((r) => r.causeOfDeath !== 'return') ?? null;
  }, [runHistory]);

  // Permadeath ledger — pick once on mount, never re-randomize mid-session
  const epitaph = useMemo(() => {
    if (lastDeath) {
      return `"${lastDeath.characterName}. Floor ${lastDeath.deepestFloor}. ${lastDeath.causeOfDeath}. The Tower remembers."`;
    }
    return STATIC_EPITAPHS[Math.floor(Math.random() * STATIC_EPITAPHS.length)];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    useSoundStore.getState().playBGM('title');

    // Title: slow ember-breath pulse using sine easing
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleOpacity, {
          toValue: 0.82,
          duration: 2800,
          useNativeDriver: true,
          easing: (t: number) => Math.sin(t * Math.PI),
        }),
        Animated.timing(titleOpacity, {
          toValue: 1.0,
          duration: 2800,
          useNativeDriver: true,
          easing: (t: number) => Math.sin(t * Math.PI),
        }),
      ])
    ).start();

    // Epitaph surfaces after 800ms — Tower chose a greeting
    setTimeout(() => {
      Animated.timing(epitaphOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }, 800);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAllStores = () => {
    deleteCharacter();
    useDungeonStore.getState().clearAllData();
    useAchievementStore.getState().resetAllProgress();
    clearWeaponRegistry();
  };

  const handleNewGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (hasExistingSave) {
      Alert.alert(
        'A Life Abandoned',
        `${character?.name ?? 'Your character'} still breathes. Starting again will end them permanently.`,
        [
          { text: 'Turn Back', style: 'cancel' },
          {
            text: 'Abandon Them',
            style: 'destructive',
            onPress: () => {
              clearAllStores();
              if (!hasCompletedTutorial) {
                router.push('/tutorial');
              } else {
                router.push('/character-creation/name');
              }
            },
          },
        ]
      );
      return;
    }

    clearAllStores();
    if (!hasCompletedTutorial) {
      router.push('/tutorial');
    } else {
      router.push('/character-creation/name');
    }
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/town');
  };

  const handleCodex = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/codex');
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  const primaryLabel =
    titleState === 'RETURNING_DEAD' ? 'Descend Again' : 'Descend';

  return (
    <View style={styles.container}>

      {/* Title — gold inscription with death-domain halo, ember-breath pulse */}
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        KOHRVELLIA
      </Animated.Text>

      <Text style={styles.separator}>{'⟨  ✦  ⟩'}</Text>

      <Text style={styles.subtitle}>It already knows your name.</Text>

      {/* Death memory — only shown if last run ended in death */}
      {titleState === 'RETURNING_DEAD' && lastDeath && (
        <Text style={styles.deathMemory}>
          {`${lastDeath.characterName} reached Floor ${lastDeath.deepestFloor}.\nThe Tower remembers.\nDo you?`}
        </Text>
      )}

      <View style={styles.menu}>
        {titleState === 'RETURNING_ACTIVE' ? (
          <>
            {/* Active save — Continue is primary */}
            <Pressable
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.menuButtonPressed,
              ]}
              onPress={handleContinue}
              android_ripple={{ color: Colors.domain.death }}
            >
              <Text style={styles.menuText}>Continue</Text>
              {character?.name ? (
                <Text style={styles.menuSubText}>{character.name}</Text>
              ) : null}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuButton,
                styles.menuButtonSecondary,
                pressed && styles.menuButtonPressed,
              ]}
              onPress={handleNewGame}
              android_ripple={{ color: Colors.domain.death }}
            >
              <Text style={[styles.menuText, styles.menuTextSecondary]}>
                New Descent
              </Text>
            </Pressable>
          </>
        ) : (
          /* First run or dead — single primary action */
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              pressed && styles.menuButtonPressed,
            ]}
            onPress={handleNewGame}
            android_ripple={{ color: Colors.domain.death }}
          >
            <Text style={styles.menuText}>{primaryLabel}</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.menuButton,
            styles.menuButtonTertiary,
            pressed && styles.menuButtonPressed,
          ]}
          onPress={handleCodex}
          android_ripple={{ color: Colors.domain.death }}
        >
          <Text style={[styles.menuText, styles.menuTextSecondary]}>Codex</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.menuButton,
            styles.menuButtonTertiary,
            pressed && styles.menuButtonPressed,
          ]}
          onPress={handleSettings}
          android_ripple={{ color: Colors.domain.death }}
        >
          <Text style={[styles.menuText, styles.menuTextSecondary]}>Settings</Text>
        </Pressable>
      </View>

      {/* Permadeath ledger — surfaces 800ms after mount */}
      <Animated.Text style={[styles.epitaph, { opacity: epitaphOpacity }]}>
        {epitaph}
      </Animated.Text>

      <View style={styles.versionContainer} pointerEvents="none">
        <Text style={styles.version}>v0.1.0 — Phase 0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  // Title — antique gold, purple-death shadow, ember breath
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text.accent,
    letterSpacing: 8,
    marginBottom: 6,
    textShadowColor: Colors.domain.death,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  // Decorative separator — oxidized bronze, no asset needed
  separator: {
    color: Colors.border.accent,
    fontSize: 14,
    letterSpacing: 4,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    letterSpacing: 2,
    marginBottom: 52,
  },

  // Death memory — conditional, only RETURNING_DEAD
  deathMemory: {
    fontSize: 13,
    color: Colors.danger.deadly,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -36,
    marginBottom: 28,
    lineHeight: 20,
    letterSpacing: 0.5,
    opacity: 0.85,
  },

  menu: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },

  // Iron Tablet buttons — sharp corners, gold left spine
  menuButton: {
    backgroundColor: Colors.background.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text.accent,
    alignItems: 'center',
  },
  menuButtonSecondary: {
    borderLeftColor: Colors.border.accent,
  },
  menuButtonTertiary: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.primary,
    borderLeftColor: Colors.background.elevated,
  },
  menuButtonPressed: {
    backgroundColor: Colors.background.elevated,
    borderColor: Colors.border.focus,
    borderLeftColor: Colors.domain.fire,
    transform: [{ scale: 0.98 }],
  },

  menuText: {
    color: Colors.text.primary,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
  },
  menuTextSecondary: {
    color: Colors.text.secondary,
    fontSize: 15,
    fontWeight: '400',
  },
  menuSubText: {
    color: Colors.text.muted,
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 3,
  },

  // Permadeath ledger — appears 800ms after mount
  epitaph: {
    position: 'absolute',
    bottom: 44,
    left: 20,
    right: 20,
    fontSize: 11,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 18,
  },

  versionContainer: {
    position: 'absolute',
    bottom: 20,
  },
  version: {
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 1,
  },
});
