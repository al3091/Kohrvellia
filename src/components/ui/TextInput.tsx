/**
 * TextInput component for Kohrvellia
 * Dark fantasy styled input with label and error states
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius, BorderWidth, Padding, Spacing } from '../../constants/Spacing';
import { useHaptics } from '../../hooks/useHaptics';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  hint,
  maxLength,
  autoCapitalize = 'sentences',
  autoCorrect = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  disabled = false,
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const haptics = useHaptics();

  // Animated border color
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let toValue = 0; // default: primary
    if (error) {
      toValue = 2; // error
    } else if (isFocused) {
      toValue = 1; // focus
    }

    Animated.timing(borderColorAnim, {
      toValue,
      duration: 150,
      useNativeDriver: false, // borderColor doesn't support native driver
    }).start();
  }, [isFocused, error, borderColorAnim]);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [Colors.border.primary, Colors.border.focus, Colors.ui.error],
  });

  const handleFocus = () => {
    haptics.selection();
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showCounter = maxLength && maxLength > 0;
  const remainingChars = maxLength ? maxLength - value.length : 0;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <Animated.View style={[styles.inputContainer, { borderColor }, disabled && styles.disabled]}>
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
        />
      </Animated.View>

      <View style={styles.footer}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : hint ? (
          <Text style={styles.hint}>{hint}</Text>
        ) : (
          <View />
        )}

        {showCounter && (
          <Text style={[
            styles.counter,
            remainingChars < 10 && styles.counterWarning,
            remainingChars === 0 && styles.counterError,
          ]}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.normal,
  },
  input: {
    ...Typography.body,
    color: Colors.text.primary,
    paddingHorizontal: Padding.input.horizontal,
    paddingVertical: Padding.input.vertical,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: Colors.background.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    minHeight: 20,
  },
  error: {
    ...Typography.caption,
    color: Colors.ui.error,
    flex: 1,
  },
  hint: {
    ...Typography.caption,
    color: Colors.text.muted,
    flex: 1,
  },
  counter: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  counterWarning: {
    color: Colors.ui.warning,
  },
  counterError: {
    color: Colors.ui.error,
  },
});

export default TextInput;
