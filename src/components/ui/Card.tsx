/**
 * Card component for Kohrvellia
 * Selectable card with glow animation for dark fantasy theme
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, BorderWidth, Padding } from '../../constants/Spacing';
import { useHaptics, HapticStyle } from '../../hooks/useHaptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  highlighted?: boolean;
  highlightColor?: string;
  hapticStyle?: HapticStyle;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function Card({
  children,
  onPress,
  selected = false,
  disabled = false,
  highlighted = false,
  highlightColor = Colors.text.accent,
  hapticStyle = 'selection',
  style,
  contentStyle,
}: CardProps) {
  const haptics = useHaptics();

  const handlePress = () => {
    if (disabled || !onPress) return;
    haptics.trigger(hapticStyle);
    onPress();
  };

  const borderColor = selected
    ? highlightColor
    : highlighted
    ? Colors.border.accent
    : Colors.border.primary;

  const backgroundColor = selected
    ? Colors.background.tertiary
    : Colors.background.card;

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          borderColor,
          backgroundColor,
        },
        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <View style={[styles.wrapper, style]}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          {cardContent}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.normal,
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    paddingHorizontal: Padding.card.horizontal,
    paddingVertical: Padding.card.vertical,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Card;
