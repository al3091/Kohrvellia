/**
 * Haptic feedback utilities for Kohrvellia
 * Provides consistent tactile feedback throughout the app
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' | 'none';

export function useHaptics() {
  const light = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const medium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const heavy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const selection = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const warning = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  const error = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const trigger = useCallback((style: HapticStyle) => {
    switch (style) {
      case 'light':
        light();
        break;
      case 'medium':
        medium();
        break;
      case 'heavy':
        heavy();
        break;
      case 'selection':
        selection();
        break;
      case 'success':
        success();
        break;
      case 'warning':
        warning();
        break;
      case 'error':
        error();
        break;
      case 'none':
      default:
        break;
    }
  }, [light, medium, heavy, selection, success, warning, error]);

  return {
    light,
    medium,
    heavy,
    selection,
    success,
    warning,
    error,
    trigger,
  };
}
