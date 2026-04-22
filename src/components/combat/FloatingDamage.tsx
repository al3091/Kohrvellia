/**
 * Floating Damage Numbers Component
 * Shows animated damage/heal numbers that float up and fade out
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export interface DamagePopup {
  id: string;
  value: number;
  type: 'damage' | 'heal' | 'critical' | 'miss' | 'block' | 'poison' | 'burn';
  x?: number; // Horizontal offset from center
}

interface FloatingDamageProps {
  popups: DamagePopup[];
  onComplete: (id: string) => void;
}

// Single floating number
function FloatingNumber({
  popup,
  onComplete,
}: {
  popup: DamagePopup;
  onComplete: (id: string) => void;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Pop in, float up, fade out
    Animated.parallel([
      // Scale pop
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      // Float up
      Animated.timing(translateY, {
        toValue: -80,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fade out (delayed)
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete(popup.id);
    });
  }, []);

  const getColor = () => {
    switch (popup.type) {
      case 'damage':
        return Colors.resource.hp;
      case 'critical':
        return Colors.resource.gold;
      case 'heal':
        return Colors.ui.success;
      case 'miss':
        return Colors.text.muted;
      case 'block':
        return Colors.domain.wisdom;
      case 'poison':
        return Colors.status.poison;
      case 'burn':
        return Colors.status.burn;
      default:
        return Colors.text.primary;
    }
  };

  const getText = () => {
    if (popup.type === 'miss') return 'MISS';
    if (popup.type === 'block') return 'BLOCKED';
    const prefix = popup.type === 'heal' ? '+' : '-';
    return `${prefix}${Math.abs(popup.value)}`;
  };

  const getFontSize = () => {
    if (popup.type === 'critical') return 32;
    if (popup.type === 'miss' || popup.type === 'block') return 18;
    return 24;
  };

  return (
    <Animated.View
      style={[
        styles.floatingNumber,
        {
          transform: [
            { translateY },
            { translateX: popup.x || 0 },
            { scale },
          ],
          opacity,
          left: popup.x ? `${50 + (popup.x / 2)}%` : '50%',
        },
      ]}
    >
      <Text
        style={[
          styles.damageText,
          {
            color: getColor(),
            fontSize: getFontSize(),
            textShadowColor: popup.type === 'critical' ? Colors.resource.gold : 'rgba(0,0,0,0.8)',
            textShadowRadius: popup.type === 'critical' ? 10 : 4,
          },
        ]}
      >
        {getText()}
      </Text>
      {popup.type === 'critical' && (
        <Text style={styles.criticalLabel}>CRITICAL!</Text>
      )}
    </Animated.View>
  );
}

export function FloatingDamage({ popups, onComplete }: FloatingDamageProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      {popups.map((popup) => (
        <FloatingNumber key={popup.id} popup={popup} onComplete={onComplete} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    overflow: 'visible',
  },
  floatingNumber: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
    marginLeft: -50, // Center the 100px wide element
    width: 100,
  },
  damageText: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  criticalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.resource.gold,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: -4,
  },
});

export default FloatingDamage;
