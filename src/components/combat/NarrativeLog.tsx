/**
 * NarrativeLog - Text-forward combat log as the hero element
 * Uses typewriter text for dramatic pacing
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { TypewriterTiming, RevealTiming } from '../../constants/Animation';
import type { CombatLogEntry } from '../../stores/useCombatStore';

export interface NarrativeLogProps {
  /** Combat log entries */
  entries: CombatLogEntry[];
  /** Maximum entries to show */
  maxEntries?: number;
  /** Container style */
  style?: ViewStyle;
  /** Called when an entry animation completes */
  onEntryComplete?: () => void;
}

interface AnimatedEntryProps {
  entry: CombatLogEntry;
  isLatest: boolean;
  onComplete?: () => void;
}

// Map entry types to narrative styling
const getEntryStyle = (type: CombatLogEntry['type']) => {
  switch (type) {
    case 'player_action':
      return { color: '#5B8DD9', prefix: '[YOU] ' };
    case 'enemy_action':
      return { color: '#D4781E', prefix: '[FOE] ' };
    case 'damage':
      return { color: '#C84832', prefix: '' };
    case 'heal':
      return { color: '#487850', prefix: '' };
    case 'status':
      return { color: '#4A9080', prefix: '' };
    case 'miss':
      return { color: '#B8922A', prefix: '' };
    case 'system':
      return { color: '#888888', prefix: '> ' };
    default:
      return { color: Colors.text.secondary, prefix: '' };
  }
};

// Format message for dramatic emphasis
function formatNarrativeMessage(message: string, _type: CombatLogEntry['type']): string {
  // Add dramatic formatting based on message content
  let formatted = message;

  // Emphasize damage numbers
  formatted = formatted.replace(/(\d+) damage/gi, '$1 damage');

  // Emphasize critical hits
  formatted = formatted.replace(/critical/gi, 'CRITICAL');

  // Emphasize miss
  formatted = formatted.replace(/missed/gi, 'MISSED');
  formatted = formatted.replace(/miss!/gi, 'MISS!');

  return formatted;
}

function AnimatedEntry({ entry, isLatest, onComplete }: AnimatedEntryProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!isLatest);
  const opacity = useRef(new Animated.Value(isLatest ? 0 : 0.6)).current;
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { color, prefix } = getEntryStyle(entry.type);
  const narrativeMessage = formatNarrativeMessage(entry.message, entry.type);
  const fullMessage = prefix + narrativeMessage;

  // Typewriter effect for latest entry
  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(fullMessage);
      setIsComplete(true);
      return;
    }

    // Reset for new entry
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: RevealTiming.quick,
      useNativeDriver: true,
    }).start();

    // Start typing
    const typeNextChar = () => {
      if (indexRef.current >= fullMessage.length) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      const char = fullMessage[indexRef.current];

      // Calculate delay
      let delay = TypewriterTiming.charDelay * 0.7; // Faster for combat
      if (['.', '!', '?'].includes(char)) {
        delay += TypewriterTiming.punctuationDelay * 0.5;
      }

      setDisplayedText(fullMessage.substring(0, indexRef.current + 1));
      indexRef.current += 1;

      timeoutRef.current = setTimeout(typeNextChar, delay);
    };

    // Small initial delay
    timeoutRef.current = setTimeout(typeNextChar, 50);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLatest, fullMessage, opacity, onComplete]);

  // Fade older entries
  useEffect(() => {
    if (!isLatest && isComplete) {
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: RevealTiming.standard,
        useNativeDriver: true,
      }).start();
    }
  }, [isLatest, isComplete, opacity]);

  const resultColor = entry.resultType ? getEntryStyle(entry.resultType).color : undefined;

  return (
    <Animated.View style={[styles.entryContainer, { opacity }]}>
      <View style={styles.entryLine}>
        <Text style={[styles.entryText, { color }]}>
          {displayedText}
          {isLatest && !isComplete && (
            <Text style={styles.cursor}>|</Text>
          )}
        </Text>
        {isComplete && entry.resultText && resultColor && (
          <Text style={[styles.entryText, { color: resultColor }]}>
            {entry.resultText}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

export function NarrativeLog({
  entries,
  maxEntries = 6,
  style,
  onEntryComplete,
}: NarrativeLogProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [latestEntryId, setLatestEntryId] = useState<string | null>(null);

  // Get visible entries (most recent)
  const visibleEntries = entries.slice(-maxEntries);

  // Track latest entry
  useEffect(() => {
    if (entries.length > 0) {
      const latest = entries[entries.length - 1];
      if (latest.id !== latestEntryId) {
        setLatestEntryId(latest.id);
      }
    }
  }, [entries, latestEntryId]);

  // Scroll to bottom when new entries arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <View style={[styles.wrapper, style]}>
        <View style={styles.logHeader}>
          <Text style={styles.logHeaderText}>╔══[ CHRONICLE ]</Text>
        </View>
        <View style={[styles.container, styles.emptyContainer]}>
          <Text style={styles.emptyText}>The battle begins...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.logHeader}>
        <Text style={styles.logHeaderText}>╔══[ CHRONICLE ]</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {visibleEntries.map((entry, index) => (
          <AnimatedEntry
            key={entry.id}
            entry={entry}
            isLatest={entry.id === latestEntryId}
            onComplete={index === visibleEntries.length - 1 ? onEntryComplete : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A1A1C',
    overflow: 'hidden',
  },
  logHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#2A1A1C',
    backgroundColor: '#0A0608',
  },
  logHeaderText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#3A2A28',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  entryContainer: {
    paddingVertical: Spacing.xs,
  },
  entryLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  entryText: {
    ...Typography.body,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  cursor: {
    color: Colors.text.accent,
    fontWeight: '300',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.muted,
    fontStyle: 'italic',
    fontSize: 16,
  },
});

export default NarrativeLog;
