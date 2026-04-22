/**
 * Combat Narration Text
 * Vivid descriptions for combat actions to replace generic messages
 */

// ===== PLAYER ATTACK DESCRIPTIONS =====

export const PLAYER_ATTACK_MISS: string[] = [
  'Your strike goes wide!',
  'The {monster} sidesteps your attack.',
  'You swing but hit only air.',
  'Your weapon cuts through empty space.',
  'The {monster} easily evades your blow.',
  'You miss completely!',
  'Your attack fails to connect.',
  'The {monster} ducks under your swing.',
];

export const PLAYER_ATTACK_HIT: string[] = [
  'You land a solid blow on the {monster}!',
  'Your weapon connects with a satisfying impact.',
  'The {monster} staggers from your strike!',
  'You slash the {monster} across its flank.',
  'Your attack draws blood!',
  'The {monster} reels from your blow.',
  'You drive your weapon into the {monster}!',
  'A clean hit! The {monster} snarls in pain.',
];

export const PLAYER_ATTACK_CRITICAL: string[] = [
  'A devastating strike! The {monster} reels!',
  'You find a gap in the {monster}\'s defenses!',
  'CRITICAL HIT! Your weapon bites deep!',
  'You strike with deadly precision!',
  'A perfect blow! The {monster} howls in agony!',
  'Your weapon sinks into a vital spot!',
  'The {monster} barely stays standing from your vicious strike!',
  'You unleash a devastating attack!',
];

export const PLAYER_ATTACK_KILL: string[] = [
  'Your final blow fells the {monster}!',
  'The {monster} collapses, defeated!',
  'With a mighty swing, you end the {monster}!',
  'The {monster} crumples before you.',
  'Your attack proves fatal. The {monster} falls.',
  'The light fades from the {monster}\'s eyes.',
  'The {monster} breathes its last.',
  'Victory! The {monster} is slain!',
];

// ===== MONSTER ATTACK DESCRIPTIONS =====

export const MONSTER_ATTACK_MISS: string[] = [
  'The {monster}\'s attack misses!',
  'You dodge the {monster}\'s strike.',
  'The {monster} lunges but you evade.',
  'You narrowly avoid the {monster}\'s blow.',
  'The {monster} swings wildly and misses.',
  'You sidestep the {monster}\'s attack.',
  'The {monster}\'s claws rake empty air.',
  'You weave out of the {monster}\'s reach.',
];

export const MONSTER_ATTACK_HIT: string[] = [
  'The {monster} strikes you!',
  'You take a hit from the {monster}.',
  'The {monster}\'s attack connects!',
  'Pain flares as the {monster} hits you.',
  'The {monster} lands a solid blow!',
  'You grunt as the {monster} strikes.',
  'The {monster} catches you off guard!',
  'The {monster}\'s attack finds its mark.',
];

export const MONSTER_ATTACK_HEAVY: string[] = [
  'The {monster} hits you HARD!',
  'A devastating blow from the {monster}!',
  'The {monster} slams into you with tremendous force!',
  'You stagger from the {monster}\'s powerful strike!',
  'The {monster} unleashes a brutal attack!',
  'You feel bones creak from the {monster}\'s blow!',
  'The {monster}\'s attack sends you reeling!',
  'A crushing blow! You barely stay standing!',
];

export const MONSTER_ATTACK_BLOCKED: string[] = [
  'You brace against the {monster}\'s attack!',
  'Your guard absorbs most of the {monster}\'s strike.',
  'You deflect the {monster}\'s blow!',
  'The {monster} hits your defense!',
  'You parry the {monster}\'s attack!',
  'Your shield catches the {monster}\'s strike.',
  'You turn aside the {monster}\'s weapon.',
  'Your defense holds against the {monster}!',
];

// ===== DEFEND DESCRIPTIONS =====

export const PLAYER_DEFEND: string[] = [
  'You raise your guard, bracing for impact.',
  'You assume a defensive stance.',
  'You ready yourself to block incoming attacks.',
  'You focus on protecting yourself.',
  'You prepare to weather the {monster}\'s assault.',
];

// ===== FLEE DESCRIPTIONS =====

export const FLEE_SUCCESS: string[] = [
  'You make a break for it and escape!',
  'You successfully flee the battle!',
  'Quick feet carry you to safety!',
  'You slip away from the {monster}!',
  'Discretion proves the better part of valor.',
];

export const FLEE_FAIL: string[] = [
  'The {monster} cuts off your escape!',
  'You stumble while trying to flee!',
  'The {monster} is too fast! You can\'t escape!',
  'Your escape route is blocked!',
  'The {monster} corners you!',
];

// ===== STATUS EFFECT DESCRIPTIONS =====

export const STATUS_APPLIED: Record<string, string[]> = {
  poison: [
    'Poison courses through your veins!',
    'You feel the venom taking hold...',
    'A sickly green tint appears on your skin.',
  ],
  burn: [
    'Flames cling to you, searing your flesh!',
    'You\'re engulfed in flames!',
    'Fire spreads across your body!',
  ],
  freeze: [
    'Ice begins to form on your limbs!',
    'A numbing cold spreads through you.',
    'You\'re slowing down from the cold...',
  ],
  stun: [
    'Your vision swims... you\'re stunned!',
    'The blow leaves you dazed!',
    'You struggle to focus...',
  ],
  bleed: [
    'Blood seeps from a deep wound!',
    'A gash opens, bleeding profusely.',
    'The wound won\'t stop bleeding!',
  ],
};

export const STATUS_DAMAGE: Record<string, string[]> = {
  poison: [
    'The poison burns in your veins!',
    'You convulse as toxins spread.',
    'The venom continues its work...',
  ],
  burn: [
    'The flames continue to sear you!',
    'Fire eats at your flesh.',
    'You can\'t extinguish the flames!',
  ],
  bleed: [
    'Blood continues to flow...',
    'The wound pulses painfully.',
    'You\'re growing weaker from blood loss.',
  ],
};

// ===== UTILITY FUNCTIONS =====

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

function formatMessage(message: string, monsterName: string): string {
  return message.replace(/\{monster\}/g, monsterName);
}

/**
 * Get a narration for player attack
 */
export function getPlayerAttackNarration(
  hit: boolean,
  critical: boolean,
  killed: boolean,
  monsterName: string
): string {
  let message: string;

  if (!hit) {
    message = getRandomMessage(PLAYER_ATTACK_MISS);
  } else if (killed) {
    message = getRandomMessage(PLAYER_ATTACK_KILL);
  } else if (critical) {
    message = getRandomMessage(PLAYER_ATTACK_CRITICAL);
  } else {
    message = getRandomMessage(PLAYER_ATTACK_HIT);
  }

  return formatMessage(message, monsterName);
}

/**
 * Get a narration for monster attack
 */
export function getMonsterAttackNarration(
  hit: boolean,
  blocked: boolean,
  heavy: boolean,
  monsterName: string
): string {
  let message: string;

  if (!hit) {
    message = getRandomMessage(MONSTER_ATTACK_MISS);
  } else if (blocked) {
    message = getRandomMessage(MONSTER_ATTACK_BLOCKED);
  } else if (heavy) {
    message = getRandomMessage(MONSTER_ATTACK_HEAVY);
  } else {
    message = getRandomMessage(MONSTER_ATTACK_HIT);
  }

  return formatMessage(message, monsterName);
}

/**
 * Get a narration for player defend
 */
export function getDefendNarration(monsterName: string): string {
  return formatMessage(getRandomMessage(PLAYER_DEFEND), monsterName);
}

/**
 * Get a narration for flee attempt
 */
export function getFleeNarration(success: boolean, monsterName: string): string {
  const messages = success ? FLEE_SUCCESS : FLEE_FAIL;
  return formatMessage(getRandomMessage(messages), monsterName);
}

/**
 * Get a narration for status effect application
 */
export function getStatusAppliedNarration(statusType: string): string {
  const messages = STATUS_APPLIED[statusType];
  if (!messages) return `You are afflicted with ${statusType}!`;
  return getRandomMessage(messages);
}

/**
 * Get a narration for status effect damage
 */
export function getStatusDamageNarration(statusType: string): string {
  const messages = STATUS_DAMAGE[statusType];
  if (!messages) return `The ${statusType} deals damage!`;
  return getRandomMessage(messages);
}
