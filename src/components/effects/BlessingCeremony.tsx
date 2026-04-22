/**
 * BlessingCeremony - Premium cinematic blessing animation
 * Multi-layered divine light effect with stat particles
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';
import { useSoundStore } from '../../stores/useSoundStore';
import type { DeityDomain } from '../../types/Deity';
import type { StatName } from '../../types/Stats';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Domain-specific colors for the divine light
const DOMAIN_GLOW_COLORS: Record<DeityDomain, string> = {
  war: '#b8243c',
  magic: '#7b5fb3',
  trickery: '#5fa55f',
  death: '#3d2a5c',
  fortune: '#c9a227',
  nature: '#4a7c4a',
  wisdom: '#5b7bb8',
  craft: '#a67c52',
  authority: '#b8962a',
  life: '#c76b8a',
  sea: '#4a9ea3',
  sky: '#7ba3c7',
  fire: '#c74a2a',
  knowledge: '#5a7a94',
};

// Domain symbols (Unicode)
const DOMAIN_SYMBOLS: Record<DeityDomain, string> = {
  war: '\u2694', // Crossed swords
  magic: '\u2728', // Sparkles
  trickery: '\u263D', // Moon
  death: '\u2620', // Skull
  fortune: '\u2618', // Clover
  nature: '\u2698', // Flower
  wisdom: '\u269B', // Atom
  craft: '\u2692', // Hammer and pick
  authority: '\u265B', // Crown (queen chess)
  life: '\u2661', // Heart
  sea: '\u2693', // Anchor
  sky: '\u2604', // Comet
  fire: '\u2739', // Star
  knowledge: '\u2706', // Telephone location sign (looks like scroll)
};

// Light ray particle
interface LightRay {
  id: number;
  angle: number;
  length: Animated.Value;
  opacity: Animated.Value;
  width: number;
}

// Floating stat particle
interface StatParticle {
  id: number;
  stat: StatName;
  value: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface BlessingCeremonyProps {
  active: boolean;
  domain: DeityDomain;
  deityName: string;
  statGains: Partial<Record<StatName, number>>;
  totalGain: number;
  onPhaseChange?: (phase: CeremonyPhase) => void;
  onComplete?: () => void;
}

type CeremonyPhase =
  | 'idle'
  | 'divine_light'    // Background glow expands
  | 'symbol_reveal'   // Deity symbol appears
  | 'stat_burst'      // Stats fly out
  | 'flash'           // Screen flash
  | 'settle';         // Final state

export function BlessingCeremony({
  active,
  domain,
  deityName,
  statGains,
  totalGain,
  onPhaseChange,
  onComplete,
}: BlessingCeremonyProps) {
  const [phase, setPhase] = useState<CeremonyPhase>('idle');
  const [lightRays, setLightRays] = useState<LightRay[]>([]);
  const [statParticles, setStatParticles] = useState<StatParticle[]>([]);

  // Sound hooks
  const { playSFX, playBlessingBGM, fadeOutBGM } = useSoundStore();

  // Animation values
  const backgroundGlow = useRef(new Animated.Value(0)).current;
  const symbolScale = useRef(new Animated.Value(0)).current;
  const symbolOpacity = useRef(new Animated.Value(0)).current;
  const symbolGlow = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const outerRingScale = useRef(new Animated.Value(0.5)).current;
  const outerRingOpacity = useRef(new Animated.Value(0)).current;
  const innerRingRotation = useRef(new Animated.Value(0)).current;

  const domainColor = DOMAIN_GLOW_COLORS[domain] || Colors.resource.gold;
  const domainSymbol = DOMAIN_SYMBOLS[domain] || '\u2605';

  // Update phase callback
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Main animation sequence
  useEffect(() => {
    if (!active) {
      setPhase('idle');
      backgroundGlow.setValue(0);
      symbolScale.setValue(0);
      symbolOpacity.setValue(0);
      symbolGlow.setValue(0);
      flashOpacity.setValue(0);
      containerOpacity.setValue(0);
      outerRingScale.setValue(0.5);
      outerRingOpacity.setValue(0);
      innerRingRotation.setValue(0);
      setLightRays([]);
      setStatParticles([]);
      return;
    }

    // Start the ceremony
    runCeremonySequence();
  }, [active]);

  const runCeremonySequence = async () => {
    // Fade in container
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Phase 1: Divine Light - play blessing start sound
    setPhase('divine_light');
    playSFX('blessing_start');
    await animateDivineLight();

    // Phase 2: Symbol Reveal - crossfade to domain-specific blessing BGM
    setPhase('symbol_reveal');
    playBlessingBGM(domain);
    await animateSymbolReveal();

    // Phase 3: Stat Burst - play stat reveal sounds for each stat
    setPhase('stat_burst');
    await animateStatBurst();

    // Phase 4: Flash - play blessing complete sound
    setPhase('flash');
    playSFX('blessing_complete');
    await animateFlash();

    // Phase 5: Settle - fade out blessing BGM
    setPhase('settle');
    await delay(1500);

    // Complete - fade out blessing music
    fadeOutBGM(1000);
    onComplete?.();
  };

  const animateDivineLight = (): Promise<void> => {
    return new Promise((resolve) => {
      // Create light rays
      const rays: LightRay[] = [];
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        rays.push({
          id: i,
          angle: (360 / rayCount) * i,
          length: new Animated.Value(0),
          opacity: new Animated.Value(0),
          width: 2 + Math.random() * 3,
        });
      }
      setLightRays(rays);

      // Animate background glow
      Animated.parallel([
        Animated.timing(backgroundGlow, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(outerRingScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(outerRingOpacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        // Animate rays
        Animated.stagger(
          80,
          rays.map((ray) =>
            Animated.parallel([
              Animated.timing(ray.length, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(ray.opacity, {
                  toValue: 0.9,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(ray.opacity, {
                  toValue: 0.4,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ]),
            ])
          )
        ),
      ]).start(() => {
        resolve();
      });

      // Start rotation
      Animated.loop(
        Animated.timing(innerRingRotation, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  };

  const animateSymbolReveal = (): Promise<void> => {
    return new Promise((resolve) => {
      Animated.sequence([
        // Symbol pops in
        Animated.parallel([
          Animated.spring(symbolScale, {
            toValue: 1.2,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(symbolOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Settle to normal size with glow pulse
        Animated.parallel([
          Animated.spring(symbolScale, {
            toValue: 1,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(symbolGlow, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(symbolGlow, {
                toValue: 0.5,
                duration: 500,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 2 }
          ),
        ]),
      ]).start(() => {
        resolve();
      });
    });
  };

  const animateStatBurst = (): Promise<void> => {
    return new Promise((resolve) => {
      // Create stat particles
      const particles: StatParticle[] = [];
      let index = 0;

      for (const [stat, value] of Object.entries(statGains)) {
        if (value && value > 0) {
          // Create multiple particles for visual interest
          const particleCount = Math.min(3, Math.ceil(value / 10));
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              id: particles.length,
              stat: stat as StatName,
              value: i === 0 ? value : 0, // Only show value on first particle
              x: new Animated.Value(0),
              y: new Animated.Value(0),
              opacity: new Animated.Value(0),
              scale: new Animated.Value(0),
            });
          }
          index++;
        }
      }
      setStatParticles(particles);

      if (particles.length === 0) {
        resolve();
        return;
      }

      // Play stat reveal sounds with staggered timing
      particles.forEach((particle, i) => {
        if (particle.value > 0) {
          setTimeout(() => {
            // Check if this is a grade up (value >= 100 indicates significant growth)
            if (particle.value >= 100) {
              playSFX('grade_up');
            } else {
              playSFX('stat_reveal');
            }
          }, i * 100); // Match stagger timing
        }
      });

      // Animate particles outward
      Animated.stagger(
        100,
        particles.map((particle, i) => {
          const angle = (Math.PI * 2 / particles.length) * i;
          const distance = 100 + Math.random() * 60;
          const targetX = Math.cos(angle) * distance;
          const targetY = Math.sin(angle) * distance;

          return Animated.parallel([
            Animated.spring(particle.x, {
              toValue: targetX,
              tension: 40,
              friction: 7,
              useNativeDriver: true,
            }),
            Animated.spring(particle.y, {
              toValue: targetY,
              tension: 40,
              friction: 7,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.parallel([
                Animated.timing(particle.opacity, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.spring(particle.scale, {
                  toValue: 1,
                  tension: 100,
                  friction: 8,
                  useNativeDriver: true,
                }),
              ]),
              Animated.delay(800),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ]);
        })
      ).start(() => {
        resolve();
      });
    });
  };

  const animateFlash = (): Promise<void> => {
    return new Promise((resolve) => {
      Animated.sequence([
        // Flash in
        Animated.timing(flashOpacity, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        // Flash out
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        resolve();
      });
    });
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  if (!active && phase === 'idle') return null;

  const rotateInterpolation = innerRingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: containerOpacity },
      ]}
      pointerEvents="none"
    >
      {/* Background overlay */}
      <Animated.View
        style={[
          styles.backgroundOverlay,
          {
            opacity: backgroundGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.85],
            }),
          },
        ]}
      />

      {/* Radial glow */}
      <Animated.View
        style={[
          styles.radialGlow,
          {
            backgroundColor: domainColor,
            opacity: backgroundGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
            transform: [
              {
                scale: backgroundGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 2],
                }),
              },
            ],
          },
        ]}
      />

      {/* Outer rotating ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            borderColor: domainColor,
            opacity: outerRingOpacity,
            transform: [
              { scale: outerRingScale },
              { rotate: rotateInterpolation },
            ],
          },
        ]}
      />

      {/* Light rays */}
      <View style={styles.rayContainer}>
        {lightRays.map((ray) => (
          <Animated.View
            key={ray.id}
            style={[
              styles.lightRay,
              {
                backgroundColor: domainColor,
                width: ray.width,
                opacity: ray.opacity,
                transform: [
                  { rotate: `${ray.angle}deg` },
                  {
                    scaleY: ray.length.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Center symbol */}
      <Animated.View
        style={[
          styles.symbolContainer,
          {
            opacity: symbolOpacity,
            transform: [{ scale: symbolScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.symbolGlowBg,
            {
              backgroundColor: domainColor,
              opacity: symbolGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6],
              }),
              transform: [
                {
                  scale: symbolGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  }),
                },
              ],
            },
          ]}
        />
        <Text style={[styles.symbol, { color: domainColor }]}>{domainSymbol}</Text>
      </Animated.View>

      {/* Deity name */}
      <Animated.View
        style={[
          styles.deityNameContainer,
          {
            opacity: symbolOpacity,
            transform: [
              {
                translateY: symbolOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.deityName}>{deityName}</Text>
        <Text style={styles.blessingText}>bestows their blessing</Text>
      </Animated.View>

      {/* Stat particles */}
      {statParticles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.statParticle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
            },
          ]}
        >
          {particle.value > 0 && (
            <>
              <Text style={styles.statParticleName}>{particle.stat}</Text>
              <Text style={[styles.statParticleValue, { color: domainColor }]}>
                +{particle.value}
              </Text>
            </>
          )}
          {particle.value === 0 && (
            <View style={[styles.statParticleDot, { backgroundColor: domainColor }]} />
          )}
        </Animated.View>
      ))}

      {/* Total gain display */}
      {phase === 'settle' && (
        <Animated.View style={styles.totalGainContainer}>
          <Text style={styles.totalGainLabel}>Total Growth</Text>
          <Text style={[styles.totalGainValue, { color: domainColor }]}>
            +{totalGain}
          </Text>
        </Animated.View>
      )}

      {/* Screen flash */}
      <Animated.View
        style={[
          styles.flash,
          {
            backgroundColor: domainColor,
            opacity: flashOpacity,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background.primary,
  },
  radialGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    borderRadius: SCREEN_WIDTH / 2,
  },
  outerRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  rayContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightRay: {
    position: 'absolute',
    height: 300,
    transformOrigin: 'center bottom',
  },
  symbolContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  symbolGlowBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  symbol: {
    fontSize: 64,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  deityNameContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.25,
    alignItems: 'center',
  },
  deityName: {
    ...Typography.h2,
    color: Colors.resource.gold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  blessingText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  statParticle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.elevated + 'E0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    minWidth: 60,
  },
  statParticleName: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  statParticleValue: {
    ...Typography.h6,
    fontWeight: 'bold',
  },
  statParticleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  totalGainContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.25,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary + 'E0',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  totalGainLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  totalGainValue: {
    ...Typography.h1,
    fontWeight: 'bold',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BlessingCeremony;
