/**
 * DeitySearchBar component
 * Search input for filtering deities
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { BorderRadius, BorderWidth, Spacing } from '../../constants/Spacing';
import { useHaptics } from '../../hooks/useHaptics';

interface DeitySearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function DeitySearchBar({
  value,
  onChangeText,
  placeholder = 'Search deities...',
  resultCount,
  totalCount,
}: DeitySearchBarProps) {
  const haptics = useHaptics();

  const handleClear = () => {
    haptics.light();
    onChangeText('');
  };

  const showResults = value.length > 0 && resultCount !== undefined;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {showResults && (
        <Text style={styles.resultText}>
          {resultCount} of {totalCount} deities
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  input: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
    paddingVertical: Spacing.md,
    minHeight: 44,
  },
  clearButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  resultText: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});

export default DeitySearchBar;
