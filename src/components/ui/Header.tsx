/**
 * Header component for Kohrvellia
 * Screen header with back navigation and optional actions
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, TouchTarget, IconSize } from '../../constants/Spacing';
import { useHaptics } from '../../hooks/useHaptics';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  style,
}: HeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const haptics = useHaptics();

  const handleBack = () => {
    haptics.light();
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
    backgroundColor: Colors.background.primary,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: Colors.text.primary,
    fontSize: IconSize.lg,
    fontWeight: '600',
  },
  title: {
    ...Typography.h4,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});

export default Header;
