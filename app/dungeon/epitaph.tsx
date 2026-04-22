/**
 * Epitaph Screen
 * Shown after a character death — atmospheric permadeath summary before returning to title.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';

const CRIMSON = '#8B1A1A';
const CRIMSON_LIGHT = '#C0392B';
const CRIMSON_DIM = '#5C1111';

export default function EpitaphScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    characterName: string;
    epithet: string;
    level: string;
    floor: string;
    killedBy: string;
    monstersKilled: string;
    goldEarned: string;
  }>();

  const characterName = params.characterName ?? 'Unknown';
  const epithet = params.epithet ?? '';
  const level = params.level ?? '1';
  const floor = params.floor ?? '1';
  const killedBy = params.killedBy ?? 'the dungeon';
  const monstersKilled = params.monstersKilled ?? '0';
  const goldEarned = params.goldEarned ?? '0';

  const nameDisplay = epithet ? `${characterName}, ${epithet}` : characterName;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Fallen header */}
        <View style={styles.headerSection}>
          <Text style={styles.fallenLabel}>FALLEN</Text>
          <View style={styles.divider} />
        </View>

        {/* Character identity */}
        <View style={styles.identitySection}>
          <Text style={styles.characterName}>{nameDisplay}</Text>
          <Text style={styles.deathLine}>
            Slain by {killedBy} on Floor {floor}
          </Text>
        </View>

        {/* Stats tombstone */}
        <View style={styles.tombstone}>
          <StatLine label="Level Reached" value={level} />
          <View style={styles.statDivider} />
          <StatLine label="Monsters Slain" value={monstersKilled} />
          <View style={styles.statDivider} />
          <StatLine label="Gold Earned" value={goldEarned} />
        </View>

        {/* Epitaph inscription */}
        <View style={styles.inscriptionSection}>
          <Text style={styles.inscriptionText}>
            "Their name is carved into the Tower's memory."
          </Text>
        </View>

        {/* The shade's entry — always present, never announced */}
        <View style={styles.shadeEntry}>
          <Text style={styles.shadeName}>???</Text>
          <Text style={styles.shadeDetail}>Floor 3  ·  Year 0, Day 1</Text>
          <Text style={styles.shadeEpitaph}>"Asked the right questions."</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={styles.beginAgainButton}
            onPress={() => router.replace('/character-creation/name')}
          >
            <Text style={styles.beginAgainText}>Begin Again</Text>
          </Pressable>

          <Pressable
            style={styles.titleButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.titleButtonText}>Return to Title</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ─── Stat line helper ──────────────────────────────────────────────────────────

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    padding: Padding.screen.horizontal,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing['2xl'],
  },

  // Header
  headerSection: {
    alignItems: 'center',
    width: '100%',
    gap: Spacing.md,
  },
  fallenLabel: {
    fontSize: 48,
    fontWeight: '800',
    color: CRIMSON_LIGHT,
    letterSpacing: 12,
    textAlign: 'center',
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: CRIMSON_DIM,
  },

  // Identity
  identitySection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  characterName: {
    ...Typography.h3,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  deathLine: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Stats tombstone
  tombstone: {
    width: '100%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: CRIMSON_DIM,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  statLabel: {
    fontFamily: undefined,
    fontSize: 13,
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  statDivider: {
    height: 1,
    backgroundColor: Colors.background.tertiary,
  },

  // Inscription
  inscriptionSection: {
    paddingHorizontal: Spacing.lg,
  },
  inscriptionText: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Shade entry — always at the bottom, never explained
  shadeEntry: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
    opacity: 0.35,
  },
  shadeName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.muted,
    letterSpacing: 3,
  },
  shadeDetail: {
    fontSize: 11,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
  shadeEpitaph: {
    fontSize: 11,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },

  // Actions
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  beginAgainButton: {
    backgroundColor: CRIMSON,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: CRIMSON_LIGHT,
  },
  beginAgainText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  titleButton: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  titleButtonText: {
    ...Typography.body,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
});
