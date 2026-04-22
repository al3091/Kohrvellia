/**
 * Monster Display Component
 * Shows the monster with ASCII art visual in combat
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import type { Monster, BehaviorPattern } from '../../types/Monster';
import { STATUS_EFFECT_ICONS, STATUS_EFFECT_COLORS } from '../../types/StatusEffect';
import type { StatusEffect } from '../../types/StatusEffect';
import { AnimatedEnemyHPBar } from './AnimatedBar';
import { getMonsterArt } from '../../data/monsters/monsterArt';
import { useGameStore } from '../../stores/useGameStore';

interface MonsterDisplayProps {
  monster: Monster;
  effects: StatusEffect[];
  observed: boolean;
  isTakingDamage?: boolean;
  intentVisible?: boolean;
  behaviorPattern?: BehaviorPattern;
}

interface IntentTell { icon: string; label: string; color: string }

function getMonsterTell(pattern: BehaviorPattern, hpPercent: number, observed: boolean): IntentTell {
  if (pattern === 'berserker' && hpPercent < 0.5) {
    return { icon: '⚔', label: observed ? 'BERSERK STRIKE' : 'ENRAGED', color: Colors.domain.fire };
  }
  const tells: Record<BehaviorPattern, IntentTell> = {
    aggressive:  { icon: '⚔',  label: observed ? 'PHYSICAL STRIKE' : 'ATTACKING',  color: Colors.ui.error },
    berserker:   { icon: '⚔',  label: observed ? 'HEAVY STRIKE'    : 'ATTACKING',  color: Colors.domain.fire },
    defensive:   { icon: '◆',  label: observed ? 'BRACING'         : 'DEFENSIVE',  color: Colors.domain.wisdom },
    cowardly:    { icon: '↩',  label: observed ? 'RETREATING'      : 'WARY',       color: Colors.domain.knowledge },
    caster:      { icon: '✦',  label: observed ? 'CASTING'         : 'CHANNELING', color: Colors.domain.magic },
    support:     { icon: '○',  label: observed ? 'BUFFING'         : 'PREPARING',  color: Colors.domain.nature },
    ambusher:    { icon: '!',  label: observed ? 'STRIKING FAST'   : 'TENSING',    color: Colors.domain.authority },
    regenerator: { icon: '◎',  label: observed ? 'REGENERATING'    : 'RECOVERING', color: Colors.domain.life },
    summoner:    { icon: '◈',  label: observed ? 'SUMMONING'       : 'GESTURING',  color: Colors.domain.death },
  };
  return tells[pattern];
}

export function MonsterDisplay({
  monster,
  effects,
  observed,
  isTakingDamage = false,
  intentVisible = false,
  behaviorPattern,
}: MonsterDisplayProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Shake when taking damage
  useEffect(() => {
    if (isTakingDamage) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isTakingDamage, shakeAnim]);

  // Boss pulse animation
  useEffect(() => {
    if (monster.isBoss) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [monster.isBoss, pulseAnim]);

  const monsterKnowledge = useGameStore(s => s.monsterKnowledge[monster.base.id]);
  const knowledgeTier = monsterKnowledge?.tier ?? 'unknown';

  const asciiArt = getMonsterArt(monster.base.id);
  const hpPercent = monster.currentHP / monster.maxHP;
  const isLowHP = hpPercent <= 0.25;

  // Show weakness/resistance info if: observed in-combat OR studied/mastered from past encounters
  const showWeaknessInfo = observed || knowledgeTier === 'studied' || knowledgeTier === 'mastered';
  const showBehaviorHint = observed || knowledgeTier === 'mastered';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: shakeAnim },
            { scale: Animated.multiply(entranceAnim, pulseAnim) },
          ],
          opacity: entranceAnim,
        },
      ]}
    >
      {/* Monster ASCII Art Area */}
      <View style={styles.asciiWrapper}>
        <View style={[styles.asciiContainer, monster.isBoss && styles.bossAsciiContainer]}>
          {/* Box-drawing corner marks */}
          <Text style={[styles.cornerTL, monster.isBoss && styles.bossCorner]}>┌</Text>
          <Text style={[styles.cornerTR, monster.isBoss && styles.bossCorner]}>┐</Text>
          <Text style={[styles.cornerBL, monster.isBoss && styles.bossCorner]}>└</Text>
          <Text style={[styles.cornerBR, monster.isBoss && styles.bossCorner]}>┘</Text>
          {asciiArt.map((line, index) => (
            <Text
              key={index}
              style={[
                styles.asciiLine,
                monster.isBoss && styles.bossAsciiLine,
                isLowHP && styles.lowHPAscii,
              ]}
            >
              {line}
            </Text>
          ))}
          {monster.isBoss && (
            <View style={styles.bossIndicator}>
              <Text style={styles.bossText}>BOSS</Text>
            </View>
          )}
        </View>
        {/* Intent Tell — visible during player planning */}
        {intentVisible && behaviorPattern && (() => {
          const tell = getMonsterTell(behaviorPattern, hpPercent, observed);
          return (
            <View style={[styles.intentBadge, { borderColor: tell.color + '66', backgroundColor: tell.color + '26' }]}>
              <Text style={[styles.intentIcon, { color: tell.color }]}>{tell.icon}</Text>
              <Text style={[styles.intentLabel, { color: tell.color }]}>{tell.label}</Text>
            </View>
          );
        })()}
      </View>

      {/* Monster Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.monsterName, monster.isBoss && styles.bossName]} numberOfLines={1}>
          {monster.displayName}
        </Text>

        <Text style={styles.monsterCR}>
          CR {monster.finalCR.toFixed(1)}
        </Text>

        {/* HP Bar */}
        <View style={styles.hpBarWrapper}>
          <AnimatedEnemyHPBar
            current={monster.currentHP}
            max={monster.maxHP}
            showText={true}
          />
        </View>

        {/* Status Effects */}
        {effects.length > 0 && (
          <View style={styles.statusEffectsRow}>
            {effects.map((effect) => (
              <View
                key={effect.id}
                style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_EFFECT_COLORS[effect.type] + '40' },
                ]}
              >
                <Text style={styles.statusIcon}>{STATUS_EFFECT_ICONS[effect.type]}</Text>
                <Text style={[styles.statusDuration, { color: STATUS_EFFECT_COLORS[effect.type] }]}>
                  {effect.duration > 0 ? effect.duration : '∞'}
                  {effect.stacks && effect.stacks > 1 ? ` x${effect.stacks}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Knowledge tier badge — shown when the player has studied this monster before */}
        {knowledgeTier !== 'unknown' && !observed && (
          <Text style={styles.knowledgeTierBadge}>
            {knowledgeTier === 'sighted' ? '● Sighted' : knowledgeTier === 'studied' ? '◎ Studied' : '★ Mastered'}
          </Text>
        )}

        {/* Weakness/resistance info — from in-combat Observe OR persistent study tier */}
        {showWeaknessInfo && (
          <View style={styles.observedInfo}>
            {monster.base.weaknesses.length > 0 && (
              <Text style={styles.observedText}>
                Weak: {monster.base.weaknesses.slice(0, 2).join(', ')}
              </Text>
            )}
            {monster.base.resistances.length > 0 && (
              <Text style={styles.observedText}>
                Resist: {monster.base.resistances.slice(0, 2).join(', ')}
              </Text>
            )}
            {showBehaviorHint && (
              <Text style={styles.observedText}>
                Pattern: {monster.base.behaviorPattern}
              </Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  asciiWrapper: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  asciiContainer: {
    minWidth: 110,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: '#0a0a12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: '#1a3a1a',
  },
  bossAsciiContainer: {
    borderColor: Colors.resource.gold,
    borderWidth: BorderWidth.normal,
    backgroundColor: '#0f0a12',
  },
  asciiLine: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 11,
    color: '#33ff33',
    letterSpacing: 0,
  },
  bossAsciiLine: {
    color: Colors.resource.gold,
  },
  lowHPAscii: {
    opacity: 0.6,
  },
  bossIndicator: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: Colors.resource.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  bossText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.background.primary,
  },
  infoContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  monsterName: {
    ...Typography.h5,
    color: Colors.ui.error,
  },
  bossName: {
    color: Colors.resource.gold,
  },
  monsterCR: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  hpBarWrapper: {
    marginTop: Spacing.xs,
  },
  statusEffectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusDuration: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  intentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignSelf: 'center',
  },
  intentIcon: {
    fontSize: 10,
    fontWeight: '700',
  },
  intentLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  knowledgeTierBadge: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.text.muted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  observedInfo: {
    marginTop: Spacing.xs,
    padding: Spacing.xs,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
  },
  observedText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.accent,
  },

  // Box-drawing corner characters for the ASCII terminal panel
  cornerTL: {
    position: 'absolute',
    top: 1,
    left: 2,
    fontSize: 9,
    lineHeight: 10,
    color: '#1a3a1a',
    fontFamily: 'monospace',
  },
  cornerTR: {
    position: 'absolute',
    top: 1,
    right: 2,
    fontSize: 9,
    lineHeight: 10,
    color: '#1a3a1a',
    fontFamily: 'monospace',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 1,
    left: 2,
    fontSize: 9,
    lineHeight: 10,
    color: '#1a3a1a',
    fontFamily: 'monospace',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 1,
    right: 2,
    fontSize: 9,
    lineHeight: 10,
    color: '#1a3a1a',
    fontFamily: 'monospace',
  },
  bossCorner: {
    color: '#7A6020',
  },
});

export default MonsterDisplay;
