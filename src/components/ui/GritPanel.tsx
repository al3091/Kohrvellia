import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GritPanelVariant = 'default' | 'inset' | 'terminal';

export interface GritPanelProps {
  variant?: GritPanelVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

const CONFIGS = {
  default: {
    outerBorder: '#3C1E22',
    topHighlight: '#4A2A2C',
    gradient: ['#291A1C', '#1C1214'] as const,
  },
  inset: {
    outerBorder: '#2A1618',
    topHighlight: '#1A1010',
    gradient: ['#1A1214', '#221618'] as const,
  },
  terminal: {
    outerBorder: '#1A3A1A',
    topHighlight: '#1E461E',
    gradient: ['#090C09', '#060406'] as const,
  },
};

export function GritPanel({ variant = 'default', children, style }: GritPanelProps) {
  const cfg = CONFIGS[variant];

  return (
    <View style={[styles.outer, { borderColor: cfg.outerBorder }, style]}>
      {/* Gradient fill — lighter top, darker bottom = physical depth */}
      <LinearGradient
        colors={cfg.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* 1px top-edge highlight simulates machined/etched surface edge */}
      <View style={[styles.topHighlight, { backgroundColor: cfg.topHighlight }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1,
    borderRadius: 0,
    overflow: 'hidden',
  },
  topHighlight: {
    height: 1,
    opacity: 0.55,
  },
});
