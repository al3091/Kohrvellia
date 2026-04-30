/**
 * Button component for Kohrvellia
 * Dark fantasy themed button with haptic feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography, FontSize, FontWeight } from '../../constants/Typography';
import { Spacing, BorderRadius, Padding, TouchTarget } from '../../constants/Spacing';
import { useHaptics, HapticStyle } from '../../hooks/useHaptics';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hapticStyle?: HapticStyle;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  hapticStyle = 'medium',
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const haptics = useHaptics();

  const handlePress = () => {
    if (disabled || loading) return;
    haptics.trigger(hapticStyle);
    onPress();
  };

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.text.inverse : Colors.text.primary}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyles}>{label}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    minHeight: TouchTarget.minimum,
  },

  // Variants
  primary: {
    backgroundColor: Colors.text.accent,
    borderColor: Colors.text.accent,
    shadowOpacity: 0,
    elevation: 0,
  },
  secondary: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.border.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.ui.error,
    borderColor: Colors.ui.error,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: Padding.buttonSmall.horizontal,
    paddingVertical: Padding.buttonSmall.vertical,
    minHeight: TouchTarget.minimum,
  },
  size_md: {
    paddingHorizontal: Padding.button.horizontal,
    paddingVertical: Padding.button.vertical,
    minHeight: TouchTarget.small,
  },
  size_lg: {
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing.xl,
    minHeight: TouchTarget.large,
  },

  // States
  disabled: {
    backgroundColor: Colors.ui.disabled,
    borderColor: Colors.ui.disabled,
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },

  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },

  // Text
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  text_primary: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  text_secondary: {
    color: Colors.text.primary,
  },
  text_ghost: {
    color: Colors.text.primary,
  },
  text_danger: {
    color: Colors.text.primary,
    fontWeight: FontWeight.bold,
  },
  text_sm: {
    ...Typography.buttonSmall,
  },
  text_md: {
    ...Typography.button,
  },
  text_lg: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  textDisabled: {
    color: Colors.text.muted,
  },
});

export default Button;
