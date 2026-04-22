/**
 * TypewriterText - Character-by-character text reveal
 * Core component for the text-forward dramatic design
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, Animated, TextStyle, ViewStyle } from 'react-native';
import { Typography, Colors } from '../../constants';
import { TypewriterTiming, getCharDelay } from '../../constants/Animation';

export interface TypewriterTextProps {
  /** The text to reveal character by character */
  text: string;
  /** Base text style */
  style?: TextStyle;
  /** Words to highlight with emphasis styling */
  emphasisWords?: string[];
  /** Style for emphasized words */
  emphasisStyle?: TextStyle;
  /** Called when text reveal completes */
  onComplete?: () => void;
  /** Animation speed preset */
  speed?: 'slow' | 'normal' | 'fast';
  /** Show blinking cursor during typing */
  cursor?: boolean;
  /** Initial delay before starting (ms) */
  delay?: number;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Skip animation and show full text immediately */
  instant?: boolean;
  /** Allow user to tap to skip animation */
  skippable?: boolean;
  /** Called when user skips */
  onSkip?: () => void;
}

const SPEED_MULTIPLIERS = {
  slow: 1.5,
  normal: 1,
  fast: 0.5,
};

export function TypewriterText({
  text,
  style,
  emphasisWords = [],
  emphasisStyle,
  onComplete,
  speed = 'normal',
  cursor = true,
  delay = 0,
  containerStyle,
  instant = false,
  skippable = false,
  onSkip,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(instant ? text : '');
  const [isComplete, setIsComplete] = useState(instant);
  const [showCursor, setShowCursor] = useState(!instant && cursor);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const indexRef = useRef(0);
  const speedMultiplier = SPEED_MULTIPLIERS[speed];

  // Cursor blink animation
  useEffect(() => {
    if (!showCursor) return;

    cursorAnimRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: TypewriterTiming.cursorBlink,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: TypewriterTiming.cursorBlink,
          useNativeDriver: true,
        }),
      ])
    );
    cursorAnimRef.current.start();

    return () => {
      cursorAnimRef.current?.stop();
    };
  }, [showCursor, cursorOpacity]);

  // Type next character
  const typeNextChar = useCallback(() => {
    if (indexRef.current >= text.length) {
      setIsComplete(true);
      setShowCursor(false);
      onComplete?.();
      return;
    }

    const char = text[indexRef.current];
    const nextChar = text[indexRef.current + 1];
    const charDelay = getCharDelay(char, nextChar) * speedMultiplier;

    setDisplayedText(text.substring(0, indexRef.current + 1));
    indexRef.current += 1;

    timeoutRef.current = setTimeout(typeNextChar, charDelay);
  }, [text, speedMultiplier, onComplete]);

  // Start typing effect
  useEffect(() => {
    if (instant) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Reset state
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);
    setShowCursor(cursor);

    // Start after delay
    const startTimeout = setTimeout(() => {
      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, instant, delay, cursor, typeNextChar, onComplete]);

  // Handle skip
  const handlePress = useCallback(() => {
    if (!skippable || isComplete) return;

    // Clear pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show full text
    setDisplayedText(text);
    setIsComplete(true);
    setShowCursor(false);
    onSkip?.();
    onComplete?.();
  }, [skippable, isComplete, text, onSkip, onComplete]);

  // Render text with emphasis
  const renderTextWithEmphasis = () => {
    if (emphasisWords.length === 0) {
      return <Text style={[styles.text, style]}>{displayedText}</Text>;
    }

    // Build regex to match emphasis words
    const pattern = emphasisWords
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Split text and render with emphasis
    const parts = displayedText.split(regex);

    return (
      <Text style={[styles.text, style]}>
        {parts.map((part, index) => {
          const isEmphasis = emphasisWords.some(
            word => word.toLowerCase() === part.toLowerCase()
          );

          if (isEmphasis) {
            return (
              <Text
                key={index}
                style={[styles.emphasis, emphasisStyle]}
              >
                {part}
              </Text>
            );
          }

          return part;
        })}
      </Text>
    );
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      onTouchEnd={skippable ? handlePress : undefined}
    >
      {renderTextWithEmphasis()}
      {showCursor && !isComplete && (
        <Animated.Text
          style={[
            styles.cursor,
            style,
            { opacity: cursorOpacity },
          ]}
        >
          |
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  text: {
    ...Typography.dramatic,
  },
  emphasis: {
    ...Typography.dramaticEmphasis,
  },
  cursor: {
    ...Typography.dramatic,
    color: Colors.text.accent,
    marginLeft: 2,
  },
});

export default TypewriterText;
