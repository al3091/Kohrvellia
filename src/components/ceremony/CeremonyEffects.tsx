/**
 * Ceremony Effects Components
 * Visual effects for level up and achievement celebrations
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Particle type for confetti/sparkles
interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
}

// Confetti colors
const CONFETTI_COLORS = [
  Colors.resource.gold,
  Colors.domain.life,
  Colors.domain.knowledge,
  Colors.domain.authority,
  Colors.ui.success,
  '#FFD700',
  '#FFA500',
  '#FF6B6B',
];

/**
 * Confetti burst effect for celebrations
 */
export function ConfettiBurst({
  active,
  particleCount = 30,
  duration = 2000,
}: {
  active: boolean;
  particleCount?: number;
  duration?: number;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Create particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: new Animated.Value(SCREEN_WIDTH / 2),
        y: new Animated.Value(SCREEN_HEIGHT / 3),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      });
    }
    setParticles(newParticles);

    // Animate each particle
    newParticles.forEach((particle, index) => {
      const delay = index * 20;
      const targetX = SCREEN_WIDTH / 2 + (Math.random() - 0.5) * SCREEN_WIDTH * 1.2;
      const targetY = SCREEN_HEIGHT + 100;
      const rotations = Math.random() * 4 + 2;

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: targetX,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: targetY,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: rotations * 360,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0.5,
              duration: duration - 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(duration * 0.6),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, delay);
    });
  }, [active, particleCount, duration]);

  if (!active || particles.length === 0) return null;

  return (
    <View style={styles.particleContainer} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { rotate: particle.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })},
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Glowing ring effect around level number
 */
export function GlowRing({
  active,
  color = Colors.resource.gold,
  size = 150,
}: {
  active: boolean;
  color?: string;
  size?: number;
}) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    rotate.start();

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, [active]);

  if (!active) return null;

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.glowRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          transform: [{ scale }, { rotate: rotation }],
          opacity,
          shadowColor: color,
        },
      ]}
      pointerEvents="none"
    />
  );
}

/**
 * Deity approval message with dramatic reveal
 */
export function DeityApproval({
  deityName,
  message,
  visible,
  onComplete,
}: {
  deityName: string;
  message: string;
  visible: boolean;
  onComplete?: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      textOpacity.setValue(0);
      return;
    }

    Animated.sequence([
      // Fade in container
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Reveal text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(1500),
    ]).start(() => {
      onComplete?.();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.deityApprovalContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.deityApprovalInner}>
        <Text style={styles.deityName}>{deityName}</Text>
        <Animated.Text style={[styles.deityMessage, { opacity: textOpacity }]}>
          "{message}"
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

/**
 * Level number with dramatic reveal
 */
export function LevelReveal({
  level,
  active,
  onComplete,
}: {
  level: number;
  active: boolean;
  onComplete?: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      glowAnim.setValue(0);
      return;
    }

    Animated.sequence([
      // Pop in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Glow pulse
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete?.();
    });
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.levelRevealContainer}>
      <GlowRing active={active} />
      <Animated.View
        style={[
          styles.levelRevealInner,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.levelRevealLabel}>LEVEL</Text>
        <Animated.Text
          style={[
            styles.levelRevealNumber,
            {
              textShadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 20],
              }),
            },
          ]}
        >
          {level}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

/**
 * Stat increase animation
 */
export function StatIncreasePopup({
  statName,
  amount,
  visible,
  onComplete,
  delay = 0,
}: {
  statName: string;
  amount: number;
  visible: boolean;
  onComplete?: () => void;
  delay?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      scaleAnim.setValue(0);
      translateY.setValue(20);
      opacityAnim.setValue(0);
      return;
    }

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }, delay);
  }, [visible, delay]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.statPopup,
        {
          transform: [{ scale: scaleAnim }, { translateY }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.statPopupName}>{statName}</Text>
      <Text style={styles.statPopupAmount}>+{amount}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  deityApprovalContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  deityApprovalInner: {
    backgroundColor: Colors.background.secondary + 'E0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.resource.gold + '60',
    maxWidth: '90%',
  },
  deityName: {
    ...Typography.h5,
    color: Colors.resource.gold,
    textAlign: 'center',
    marginBottom: 8,
  },
  deityMessage: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  levelRevealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
  },
  levelRevealInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  levelRevealLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 4,
    marginBottom: 4,
  },
  levelRevealNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: Colors.resource.gold,
    textShadowColor: Colors.resource.gold,
    textShadowOffset: { width: 0, height: 0 },
  },
  statPopup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.ui.success + '60',
  },
  statPopupName: {
    ...Typography.label,
    color: Colors.text.secondary,
  },
  statPopupAmount: {
    ...Typography.h6,
    color: Colors.ui.success,
  },
});

export default {
  ConfettiBurst,
  GlowRing,
  DeityApproval,
  LevelReveal,
  StatIncreasePopup,
};
