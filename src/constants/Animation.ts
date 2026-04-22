/**
 * Animation constants for Kohrvellia
 * Timing, easing, and duration values for ceremonial pacing
 */

// ===== TIMING CONSTANTS =====

/**
 * Typewriter animation timing (in milliseconds)
 */
export const TypewriterTiming = {
  /** Delay between each character (faster but still dramatic) */
  charDelay: 18,
  /** Additional delay after completing a word */
  wordDelay: 50,
  /** Additional delay after punctuation (. ! ? : ;) */
  punctuationDelay: 120,
  /** Delay after paragraph/newline */
  paragraphDelay: 250,
  /** Cursor blink interval */
  cursorBlink: 530,
} as const;

/**
 * Reveal animation timing
 */
export const RevealTiming = {
  /** Quick reveal for routine UI elements */
  quick: 200,
  /** Standard reveal for normal content */
  standard: 400,
  /** Dramatic reveal for important information */
  dramatic: 800,
  /** Ceremonial reveal for major moments */
  ceremonial: 1200,
  /** Stagger delay between sequential reveals */
  stagger: 100,
} as const;

/**
 * Screen transition timing
 */
export const TransitionTiming = {
  /** Fast transition between related screens */
  fast: 250,
  /** Standard screen transition */
  standard: 400,
  /** Slow transition for dramatic effect */
  slow: 600,
  /** Modal slide in/out */
  modal: 300,
  /** Overlay fade */
  overlay: 200,
} as const;

/**
 * Combat animation timing
 */
export const CombatTiming = {
  /** Delay between combat actions for readability */
  actionDelay: 600,
  /** Duration of damage flash effect */
  damageFlash: 100,
  /** Duration of screen shake */
  shake: 250,
  /** Time to hold victory/defeat screen before interaction */
  resultHold: 1500,
  /** Turn transition overlay */
  turnTransition: 400,
  /** HP/SP bar animation duration */
  barDrain: 300,
  /** Status effect badge pop animation */
  statusPop: 200,
} as const;

/**
 * Sneak/Dice roll animation timing
 */
export const SneakTiming = {
  /** Total dice roll animation duration */
  rollTotal: 2000,
  /** How long numbers cycle rapidly */
  rollCycle: 1500,
  /** Slow down phase before lock */
  rollSlowdown: 500,
  /** Pause after showing final number */
  resultPause: 300,
  /** Dramatic pause before success/failure reveal */
  dramaticPause: 400,
} as const;

/**
 * Emphasis animation timing
 */
export const EmphasisTiming = {
  /** Scale pop duration */
  pop: 200,
  /** Pulse loop duration */
  pulse: 1600,
  /** Glow fade in/out */
  glow: 400,
  /** Color flash */
  flash: 150,
} as const;

// ===== EASING CURVES =====

/**
 * Easing functions as cubic-bezier values
 * Use with Animated.timing or CSS transitions
 */
export const Easing = {
  /** Standard ease out - most UI elements */
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  /** Dramatic entrance - important reveals */
  dramaticIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Dramatic exit - fading away */
  dramaticOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  /** Snappy - quick responsive feedback */
  snappy: 'cubic-bezier(0.4, 0, 0, 1)',
  /** Bounce - playful emphasis */
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  /** Linear - constant speed (typewriter) */
  linear: 'linear',
} as const;

// ===== ANIMATION VALUES =====

/**
 * Scale values for animations
 */
export const Scale = {
  /** Pressed state scale */
  pressed: 0.97,
  /** Emphasis pop start */
  popStart: 0.8,
  /** Emphasis pop peak */
  popPeak: 1.15,
  /** Hover/focus scale */
  hover: 1.02,
  /** Node pulse min */
  pulseMin: 1.0,
  /** Node pulse max */
  pulseMax: 1.08,
} as const;

/**
 * Opacity values for animations
 */
export const Opacity = {
  /** Disabled state */
  disabled: 0.4,
  /** Inactive/muted state */
  inactive: 0.6,
  /** Semi-visible */
  semi: 0.8,
  /** Full visibility */
  full: 1.0,
  /** Overlay backdrop */
  overlay: 0.7,
  /** Subtle connection lines */
  subtle: 0.4,
} as const;

/**
 * Movement values (in pixels) for animations
 */
export const Movement = {
  /** Small vertical shift for reveals */
  revealShift: 12,
  /** Shake amplitude */
  shakeAmount: 10,
  /** Floating damage rise distance */
  floatRise: 80,
  /** Modal slide distance */
  modalSlide: 50,
} as const;

// ===== SPRING PHYSICS =====

/**
 * Spring configuration for React Native Animated
 * Use with Animated.spring()
 */
export const SpringConfig = {
  /** Default spring - balanced response */
  default: {
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },
  /** Gentle spring - slower, smoother */
  gentle: {
    tension: 60,
    friction: 10,
    useNativeDriver: true,
  },
  /** Snappy spring - quick and responsive */
  snappy: {
    tension: 200,
    friction: 12,
    useNativeDriver: true,
  },
  /** Bouncy spring - playful overshoot */
  bouncy: {
    tension: 180,
    friction: 6,
    useNativeDriver: true,
  },
} as const;

// ===== TYPEWRITER HELPERS =====

/**
 * Check if character is punctuation that needs extra delay
 */
export function isPunctuation(char: string): boolean {
  return ['.', '!', '?', ':', ';'].includes(char);
}

/**
 * Check if character is end of sentence
 */
export function isSentenceEnd(char: string): boolean {
  return ['.', '!', '?'].includes(char);
}

/**
 * Calculate delay for a character in typewriter animation
 */
export function getCharDelay(char: string, nextChar?: string): number {
  let delay = TypewriterTiming.charDelay;

  if (isPunctuation(char)) {
    delay += TypewriterTiming.punctuationDelay;
  } else if (char === ' ' && nextChar && /[A-Z]/.test(nextChar)) {
    // New sentence starting
    delay += TypewriterTiming.wordDelay;
  } else if (char === '\n') {
    delay += TypewriterTiming.paragraphDelay;
  }

  return delay;
}
