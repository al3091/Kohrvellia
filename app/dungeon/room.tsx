/**
 * Node Interaction Screen
 * Handles node-specific interactions based on node type
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useCombatStore } from '../../src/stores/useCombatStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { getNodeIcon, getNodeDisplayName, type NodeType } from '../../src/types/Dungeon';
import { TypewriterText } from '../../src/components/text/TypewriterText';
import { DramaticReveal } from '../../src/components/text/DramaticReveal';
import {
  getRandomEventForFloor,
  getRandomTrapForFloor,
  performStatCheck,
  type DungeonEvent,
  type EventChoice,
  type TrapData,
} from '../../src/data/events/dungeonEvents';
import { getDeityById } from '../../src/data/pantheons';
import { useDeityStore } from '../../src/stores/useDeityStore';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { ALL_ACHIEVEMENTS } from '../../src/data/achievements';
import { useShopStore } from '../../src/stores/useShopStore';

// Node descriptions
const NODE_DESCRIPTIONS: Record<NodeType, string> = {
  start: 'The entrance to this floor. A safe haven from the dangers below.',
  combat: 'Hostile creatures lurk in the shadows, ready to strike.',
  elite: 'A powerful enemy guards this passage. Only the strong survive.',
  treasure: 'A treasure chest sits before you, waiting to be opened.',
  event: 'Something unusual catches your attention...',
  rest: 'A campfire flickers in the darkness. A moment of respite.',
  shop: 'A wandering merchant has set up shop in this unlikely place.',
  shrine: 'Divine energy fills the air. A shrine to the gods stands before you.',
  mystery: 'The unknown beckons...',
  boss: 'A powerful presence dominates this chamber. This is no ordinary foe.',
};

const STAT_COLORS: Record<string, string> = {
  STR: '#C84832', PER: '#5B8DD9', END: '#487850', CHA: '#D4781E',
  INT: '#7B5BBF', AGI: '#4A9080', WIS: '#9A6030', LCK: '#C89030',
};

const OUTCOME_COLORS: Record<string, string> = {
  damage: '#C84832', heal_hp: '#487850', heal_sp: '#4A9080',
  gold: '#C89030', stat_xp: '#7B5BBF',
  buff: '#5B8DD9', debuff: '#D4781E', nothing: '#888888', combat: '#C84832',
  item: '#4A9080',
};

export default function RoomScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { playSFX } = useSoundStore();
  const { getCurrentNode, getCurrentMap, completeNode, useRestSite, revealMystery } = useDungeonStore();
  const { character, modifyHP, modifySP, modifyGold, addPendingExcelia, removeFromInventory, addToInventory, modifyDeityFavor, addStatusEffect, modifySatiation } = useCharacterStore();
  const { prepareEncounter } = useCombatStore();
  const { equipmentStock, purchaseEquipment, getEquipmentPrice, shouldRefreshStock, refreshStock } = useShopStore();

  const node = getCurrentNode();
  const map = getCurrentMap();

  // Event state
  const [eventResult, setEventResult] = useState<string | null>(null);
  const [eventCheckSuccess, setEventCheckSuccess] = useState<boolean | null>(null);
  const [eventOutcomeType, setEventOutcomeType] = useState<string | null>(null);
  const [trapResult, setTrapResult] = useState<{ detected: boolean; evaded?: boolean; message: string } | null>(null);
  const [eventCompleted, setEventCompleted] = useState(false);
  const [trapCompleted, setTrapCompleted] = useState(false);

  // Treasure loot state
  const [treasureLoot, setTreasureLoot] = useState<{
    gold: number;
    items: string[];
    message: string;
  } | null>(null);
  const [treasureOpened, setTreasureOpened] = useState(false);

  // Mystery node state
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryRevealedType, setMysteryRevealedType] = useState<NodeType | null>(null);

  // Shop node state
  const [shopDone, setShopDone] = useState(false);

  // Generate event data once per node visit (also for mystery nodes that reveal to event)
  const currentEvent = useMemo<DungeonEvent | null>(() => {
    if (!map) return null;
    // Regular event node
    if (node?.type === 'event') {
      return getRandomEventForFloor(map.floorNumber);
    }
    // Mystery node that revealed to event
    if (node?.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'event') {
      return getRandomEventForFloor(map.floorNumber);
    }
    return null;
  }, [map?.floorNumber, node?.id, mysteryRevealed, mysteryRevealedType]);

  // Traps can appear in mystery or treasure nodes
  const currentTrap = useMemo<TrapData | null>(() => {
    if (!map || !node) return null;
    // Check if treasure is trapped
    if (node.type === 'treasure' && node.treasureData?.isTrapped) {
      return getRandomTrapForFloor(map.floorNumber);
    }
    return null;
  }, [map?.floorNumber, node?.id, node?.treasureData]);

  const handleBack = () => {
    if (
      node &&
      (node.type === 'combat' || node.type === 'elite') &&
      !node.isCompleted
    ) {
      haptics.warning();
      Alert.alert(
        'No Retreat',
        'You cannot leave without resolving this encounter.',
        [{ text: 'Stand Your Ground' }]
      );
      return;
    }
    router.back();
  };

  const handleCompleteNode = () => {
    if (!node) return;
    haptics.success();
    completeNode(node.id);
    router.back();
  };

  // Node-specific actions
  const handleCombat = (isBoss: boolean = false, isElite: boolean = false) => {
    if (!node || !map) return;
    haptics.medium();

    // Prepare encounter (generate monster)
    prepareEncounter(map.floorNumber, isBoss, isElite);

    // Navigate to encounter screen for pre-combat preview
    router.push('/dungeon/encounter');
  };

  const handleOpenTreasure = () => {
    if (!node || !map) return;

    // Check if trapped (only for regular treasure nodes, not mystery reveals)
    if (node.type === 'treasure' && currentTrap && !trapCompleted) {
      // Show trap interaction first
      return;
    }

    // If this is a mystery node, reveal it first
    if (node.type === 'mystery') {
      revealMystery(node.id);
    }

    haptics.success();
    playSFX('treasure_creak'); // Chest opening sound

    // Delay the reveal sound slightly for dramatic effect
    setTimeout(() => {
      playSFX('treasure_open');
      playSFX('gold_pickup');
    }, 300);

    // Generate loot based on floor (treasure is ultra-rare, so rewards should be good!)
    const floorNumber = map.floorNumber;
    const lootTier = Math.floor(floorNumber / 5); // 0 for floors 1-4, 1 for 5-9, etc.

    // Gold: Base 50-100 + 25-50 per tier
    const baseGold = 50 + Math.floor(Math.random() * 51); // 50-100
    const tierGold = lootTier * (25 + Math.floor(Math.random() * 26)); // +25-50 per tier
    const totalGold = baseGold + tierGold;

    // Items based on tier
    const items: string[] = [];

    // Always give at least one consumable
    const consumablePool: Array<{ id: string; name: string }> = [
      { id: 'health_potion_small', name: 'Health Potion (Small)' },
      { id: 'spirit_potion_small', name: 'Spirit Potion (Small)' },
      { id: 'ration', name: 'Ration' },
    ];
    const picked = consumablePool[Math.floor(Math.random() * consumablePool.length)];
    items.push(`1x ${picked.name}`);
    addToInventory({ id: picked.id, type: 'consumable', stackable: true, quantity: 1, identified: true });

    // Higher tier = more items
    if (lootTier >= 1 && Math.random() < 0.6) {
      items.push('1x Antidote');
      addToInventory({ id: 'antidote', type: 'consumable', stackable: true, quantity: 1, identified: true });
    }
    if (lootTier >= 2 && Math.random() < 0.5) {
      items.push('1x Health Potion (Large)');
      addToInventory({ id: 'health_potion_large', type: 'consumable', stackable: true, quantity: 1, identified: true });
    }
    if (lootTier >= 3 && Math.random() < 0.4) {
      items.push('1x Magic Stone');
      addToInventory({ id: 'magic_stone', type: 'material', stackable: true, quantity: 1, identified: true });
    }

    // Apply rewards
    modifyGold(totalGold);

    // 10% chance to find a journal, discovering one hidden journal-source achievement
    let journalFound = false;
    if (Math.random() < 0.10) {
      const store = useAchievementStore.getState();
      const hiddenJournalAchievements = ALL_ACHIEVEMENTS.filter(a => {
        if (a.discoverySource !== 'journal') return false;
        const p = store.getProgress(a.id);
        return p?.discoveryState === 'hidden';
      });
      if (hiddenJournalAchievements.length > 0) {
        const pick = hiddenJournalAchievements[Math.floor(Math.random() * hiddenJournalAchievements.length)];
        store.discoverAchievement(pick.id, 'journal');
        journalFound = true;
      }
    }

    const lootMessage = [
      `You found a treasure!`,
      ``,
      `+${totalGold} Gold`,
      ...items.map(item => `+${item}`),
      ...(journalFound ? ['', "A weathered journal falls from the chest.\n\"The gods whisper of a deed few know...\""] : []),
    ].join('\n');

    setTreasureLoot({
      gold: totalGold,
      items,
      message: lootMessage,
    });
    setTreasureOpened(true);
  };

  const handleTreasureContinue = () => {
    if (!node) return;
    completeNode(node.id);
    router.back();
  };

  // Check if player has rations
  const hasRations = character?.inventory.some(
    (item) => item.id === 'ration' && item.quantity > 0
  ) ?? false;

  const rationCount = character?.inventory.find(i => i.id === 'ration')?.quantity ?? 0;
  const hungerState = rationCount >= 4 ? 'adequate' : rationCount >= 2 ? 'hungry' : 'starving';

  const [restChoice, setRestChoice] = useState<'pending' | 'full' | 'dangerous' | 'done'>('pending');
  const [restMessage, setRestMessage] = useState<string | null>(null);

  const handleRestWithRation = () => {
    if (!node || !character) return;
    haptics.success();

    // If this is a mystery node, reveal it first
    if (node.type === 'mystery') {
      revealMystery(node.id);
    }

    // Consume one ration and restore satiation
    removeFromInventory('ration', 1);
    modifySatiation(40);

    // Full rest: restore HP and SP scaled by hunger state
    const restMult = hungerState === 'adequate' ? 0.30 : hungerState === 'hungry' ? 0.20 : 0.10;
    const hpRestore = Math.floor(character.maxHP * restMult);
    const spRestore = Math.floor(character.maxSP * restMult);
    modifyHP(hpRestore);
    modifySP(spRestore);

    const hungerNote = hungerState === 'hungry' ? ' (hungry — reduced recovery)' : hungerState === 'starving' ? ' (starving — minimal recovery)' : '';
    setRestMessage(`You eat a ration and rest by the fire.${hungerNote}\n\n+${hpRestore} HP | +${spRestore} SP`);
    setRestChoice('done');
    useRestSite(node.id);
  };

  const handleDangerousRest = () => {
    if (!node || !character) return;
    haptics.warning();

    // If this is a mystery node, reveal it first
    if (node.type === 'mystery') {
      revealMystery(node.id);
    }

    // Dangerous rest: only 10% HP, no SP
    const hpRestore = Math.floor(character.maxHP * 0.1);
    modifyHP(hpRestore);

    setRestMessage(`You rest without food. Your body aches with hunger.\n\n+${hpRestore} HP (no SP recovery)`);
    setRestChoice('done');
    useRestSite(node.id);
  };

  const handleRestContinue = () => {
    router.back();
  };

  // Shrine state
  const [shrineUsed, setShrineUsed] = useState(false);
  const [shrineApproached, setShrineApproached] = useState(false);
  const [shrineDomain, setShrineDomain] = useState<string | null>(null);
  const [shrineAffinity, setShrineAffinity] = useState<'aligned' | 'neutral' | 'opposed'>('neutral');
  const [_shrineOfferingChoice, setShrineOfferingChoice] = useState<'blood' | 'free' | null>(null);
  const [shrineResult, setShrineResult] = useState<{
    tier: 'A' | 'B' | 'C' | 'D' | 'D+';
    favorGain: number;
    hpHealed: number;
    spHealed: number;
    statBoosted: string;
    exceliGained: number;
    permaBuff: boolean;
    cursed: boolean;
    flavorText: string;
  } | null>(null);

  const SHRINE_DOMAINS = ['War', 'Magic', 'Trickery', 'Death', 'Fortune', 'Nature', 'Wisdom', 'Craft', 'Life', 'Sky', 'Fire', 'Knowledge'] as const;

  const handleShrineApproach = () => {
    if (!character) return;
    haptics.light();
    playSFX('shrine_chime');

    // Assign a random domain to this shrine
    const domain = SHRINE_DOMAINS[Math.floor(Math.random() * SHRINE_DOMAINS.length)];
    setShrineDomain(domain);

    // Check player's patron deity domain
    let affinity: 'aligned' | 'neutral' | 'opposed' = 'neutral';
    if (character.patronDeityId) {
      const deity = getDeityById(character.patronDeityId);
      if (deity?.domain) {
        if (deity.domain === domain.toLowerCase()) {
          affinity = 'aligned';
        } else {
          // Opposing domains (simplified: death vs life, war vs wisdom, etc.)
          const opposites: Record<string, string> = {
            Death: 'Life', Life: 'Death',
            War: 'Wisdom', Wisdom: 'War',
            Trickery: 'Authority', Authority: 'Trickery',
            Chaos: 'Order', Order: 'Chaos',
          };
          if (opposites[domain] === deity.domain || opposites[deity.domain as string] === domain) {
            affinity = 'opposed';
          }
        }
      }
    }

    setShrineAffinity(affinity);
    setShrineApproached(true);
  };

  // Domain → primary stat mapping for shrine perma buff
  const DOMAIN_STAT_MAP: Record<string, 'STR' | 'PER' | 'END' | 'CHA' | 'INT' | 'AGI' | 'WIS' | 'LCK'> = {
    War: 'STR', Magic: 'INT', Fortune: 'LCK', Nature: 'END',
    Wisdom: 'WIS', Trickery: 'AGI', Death: 'END', Life: 'END',
    Craft: 'STR', Sky: 'PER', Fire: 'STR', Knowledge: 'INT',
  };

  const handleShrine = (offering: 'blood' | 'free') => {
    if (!node || !character) return;
    setShrineOfferingChoice(offering);
    haptics.success();

    if (node.type === 'mystery') {
      revealMystery(node.id);
    }
    playSFX('shrine_chime');

    const favor = character.deityFavor ?? 50;
    const isFavored = favor >= 60;
    const isDisfavored = favor < 25;
    const isAbandoned = favor < 10;
    const domainStat = shrineDomain ? (DOMAIN_STAT_MAP[shrineDomain] ?? 'LCK') : 'LCK';

    // Blood offering costs 15% current HP upfront
    if (offering === 'blood') {
      const cost = Math.floor(character.currentHP * 0.15);
      modifyHP(-cost);
    }

    // Resolve outcome tier
    let tier: 'A' | 'B' | 'C' | 'D' | 'D+';
    if (shrineAffinity === 'aligned' && (offering === 'blood' || isFavored)) {
      tier = 'A';
    } else if (shrineAffinity === 'aligned' || (shrineAffinity === 'opposed' && offering === 'blood' && isFavored)) {
      tier = 'B';
    } else if (shrineAffinity === 'neutral' && !isAbandoned) {
      tier = Math.random() < 0.5 ? 'B' : 'C';
    } else if (isAbandoned || (shrineAffinity === 'opposed' && offering === 'free' && isDisfavored)) {
      tier = 'D+';
    } else if (shrineAffinity === 'opposed' || isDisfavored) {
      tier = 'D';
    } else {
      tier = 'C';
    }

    // Apply effects per tier
    if (tier === 'A') {
      // Perma stat buff — +15 excelia points to domain stat (treated as permanent via addPendingExcelia)
      addPendingExcelia(domainStat, 15);
      modifyDeityFavor(20);
      playSFX('buff');
      setShrineResult({
        tier: 'A',
        favorGain: 20,
        hpHealed: 0,
        spHealed: 0,
        statBoosted: domainStat,
        exceliGained: 15,
        permaBuff: true,
        cursed: false,
        flavorText: 'Growth marked by divine will. Seal it at the Blessing Rite — or lose it to death.',
      });
    } else if (tier === 'B') {
      const hpHealed = Math.floor(character.maxHP * 0.30);
      const spHealed = Math.floor(character.maxSP * 0.20);
      modifyHP(hpHealed);
      modifySP(spHealed);
      addPendingExcelia(domainStat, 25);
      modifyDeityFavor(10);
      playSFX('buff');
      setShrineResult({
        tier: 'B',
        favorGain: 10,
        hpHealed,
        spHealed,
        statBoosted: domainStat,
        exceliGained: 25,
        permaBuff: false,
        cursed: false,
        flavorText: shrineAffinity === 'aligned' ? 'Your patron smiles upon this devotion.' : 'The gods acknowledge your offering.',
      });
    } else if (tier === 'C') {
      const minor = Math.random() < 0.5;
      if (minor) {
        const hpHealed = Math.floor(character.maxHP * 0.10);
        modifyHP(hpHealed);
        modifyDeityFavor(5);
        setShrineResult({
          tier: 'C',
          favorGain: 5,
          hpHealed,
          spHealed: 0,
          statBoosted: '',
          exceliGained: 0,
          permaBuff: false,
          cursed: false,
          flavorText: 'The gods spare a moment of attention.',
        });
      } else {
        setShrineResult({
          tier: 'C',
          favorGain: 0,
          hpHealed: 0,
          spHealed: 0,
          statBoosted: '',
          exceliGained: 0,
          permaBuff: false,
          cursed: false,
          flavorText: 'The shrine gazes through you. Divine silence.',
        });
      }
    } else if (tier === 'D') {
      const hpLost = -Math.floor(character.maxHP * 0.20);
      modifyHP(hpLost);
      modifyDeityFavor(-15);
      addStatusEffect({
        id: 'curse',
        name: 'Shrine Curse',
        duration: 3,
        description: 'A divine curse lingers from an opposing shrine.',
      });
      setShrineResult({
        tier: 'D',
        favorGain: -15,
        hpHealed: hpLost,
        spHealed: 0,
        statBoosted: '',
        exceliGained: 0,
        permaBuff: false,
        cursed: true,
        flavorText: 'The shrine rejects you. A curse settles on your shoulders.',
      });
    } else {
      // D+ — severe
      const hpLost = -Math.floor(character.maxHP * 0.30);
      modifyHP(hpLost);
      modifyDeityFavor(-20);
      addStatusEffect({
        id: 'curse',
        name: 'Divine Wrath',
        duration: 5,
        description: 'The gods have forsaken you. A heavy curse weighs on your soul.',
      });
      setShrineResult({
        tier: 'D+',
        favorGain: -20,
        hpHealed: hpLost,
        spHealed: 0,
        statBoosted: '',
        exceliGained: 0,
        permaBuff: false,
        cursed: true,
        flavorText: 'The gods answer with wrath. You have been forsaken.',
      });
    }

    if (tier === 'A' || tier === 'B' || tier === 'C') {
      useAchievementStore.getState().incrementProgress('shrine_blessing', 1);
    }

    // Discovery: the shrine whispers about one random hidden shrine-source achievement
    if (tier !== 'D' && tier !== 'D+' && map) {
      const store = useAchievementStore.getState();
      const hiddenShrineAchievements = ALL_ACHIEVEMENTS.filter(a => {
        if (a.discoverySource !== 'shrine') return false;
        const p = store.getProgress(a.id);
        return p?.discoveryState === 'hidden';
      });
      if (hiddenShrineAchievements.length > 0) {
        const pick = hiddenShrineAchievements[Math.floor(Math.random() * hiddenShrineAchievements.length)];
        store.discoverAchievement(pick.id, 'shrine');
      }
    }

    setShrineUsed(true);
  };

  const handleShrineContinue = () => {
    if (!node) return;
    completeNode(node.id);
    router.back();
  };

  const handleEventChoice = (choice: EventChoice) => {
    if (!node || !character || eventCompleted) return;
    haptics.medium();

    // If this is a mystery node, reveal it first
    if (node.type === 'mystery') {
      revealMystery(node.id);
    }

    let result: string;
    let outcome = choice.outcomes.success;

    // If there's a stat check, perform it
    if (choice.statCheck) {
      const statPoints = character.stats[choice.statCheck.stat].points;
      const check = performStatCheck(statPoints, choice.statCheck.dc);

      if (check.success) {
        haptics.success();
        outcome = choice.outcomes.success;
        result = outcome.message;
        setEventCheckSuccess(true);
      } else {
        haptics.warning();
        outcome = choice.outcomes.failure || choice.outcomes.success;
        result = outcome.message;
        setEventCheckSuccess(false);
      }
    } else {
      result = outcome.message;
    }

    // Apply outcome effects
    switch (outcome.type) {
      case 'gold':
        if (outcome.value) modifyGold(outcome.value);
        break;
      case 'heal_hp':
        if (outcome.value) modifyHP(outcome.value);
        break;
      case 'heal_sp':
        if (outcome.value) modifySP(outcome.value);
        break;
      case 'damage':
        if (outcome.value) modifyHP(-outcome.value);
        break;
      case 'stat_xp':
        if (outcome.stat && outcome.value) addPendingExcelia(outcome.stat, outcome.value);
        break;
      case 'combat':
        // Start a combat encounter (events can trigger combat too)
        if (map) {
          prepareEncounter(map.floorNumber, false, false);
          router.push('/dungeon/encounter');
          return;
        }
        break;
    }

    // Ancient Altar deity favor adjustments
    if (currentEvent?.id === 'ancient_altar') {
      const { adjustFavor } = useDeityStore.getState();
      if (choice.id === 'pray' && outcome === choice.outcomes.success) {
        // Pray Sincerely — WIS check passed
        adjustFavor(5, 'sincere_prayer');
      } else if (choice.id === 'offer_gold') {
        // Leave an Offering — no stat check, always succeeds
        adjustFavor(3, 'shrine_offering');
      } else if (choice.id === 'desecrate') {
        if (outcome === choice.outcomes.failure) {
          // Loot the Offerings — LCK check failed, gets cursed
          adjustFavor(-10, 'desecration');
        } else {
          // Loot the Offerings — LCK check passed, gets gold; still disrespectful
          adjustFavor(-5, 'desecration_attempt');
        }
      }
    }

    setEventOutcomeType(outcome.type);
    setEventResult(result);
    setEventCompleted(true);
  };

  const handleEventContinue = () => {
    if (!node) return;
    completeNode(node.id);
    router.back();
  };

  const handleTrapAttempt = (attemptType: 'detect' | 'proceed') => {
    if (!node || !character || !currentTrap || trapCompleted) return;

    if (attemptType === 'detect') {
      // Try to detect the trap
      const statPoints = character.stats[currentTrap.detectStat].points;
      const check = performStatCheck(statPoints, currentTrap.detectDC);

      if (check.success) {
        haptics.success();
        setTrapResult({
          detected: true,
          message: `[${currentTrap.detectStat} check passed!]\n\nYou spot the ${currentTrap.name}! You carefully disarm it and continue safely.`,
        });
        addPendingExcelia(currentTrap.detectStat, 15);
      } else {
        haptics.warning();
        // Failed detection - trap triggers, try to evade
        const evadePoints = character.stats[currentTrap.evadeStat].points;
        const evadeCheck = performStatCheck(evadePoints, currentTrap.evadeDC);

        if (evadeCheck.success) {
          const reducedDamage = Math.floor(currentTrap.baseDamage * 0.5);
          modifyHP(-reducedDamage);
          setTrapResult({
            detected: false,
            evaded: true,
            message: `[${currentTrap.detectStat} check failed!]\n\nThe trap triggers! But your reflexes save you from the worst. (-${reducedDamage} HP)`,
          });
        } else {
          modifyHP(-currentTrap.baseDamage);
          setTrapResult({
            detected: false,
            evaded: false,
            message: `[${currentTrap.detectStat} check failed!]\n\nThe ${currentTrap.name} catches you completely off guard! (-${currentTrap.baseDamage} HP)`,
          });
        }
      }
      setTrapCompleted(true);
    } else {
      // Proceed without checking - trap definitely triggers
      haptics.error();
      const evadePoints = character.stats[currentTrap.evadeStat].points;
      const evadeCheck = performStatCheck(evadePoints, currentTrap.evadeDC + 10);

      if (evadeCheck.success) {
        const reducedDamage = Math.floor(currentTrap.baseDamage * 0.75);
        modifyHP(-reducedDamage);
        setTrapResult({
          detected: false,
          evaded: true,
          message: `The ${currentTrap.name} triggers! You react just in time to minimize the damage. (-${reducedDamage} HP)`,
        });
      } else {
        const extraDamage = Math.floor(currentTrap.baseDamage * 1.25);
        modifyHP(-extraDamage);
        setTrapResult({
          detected: false,
          evaded: false,
          message: `The ${currentTrap.name} catches you completely unprepared! (-${extraDamage} HP)`,
        });
      }
      setTrapCompleted(true);
    }
  };

  const handleTrapContinue = () => {
    if (!node) return;
    // After trap, open the treasure
    completeNode(node.id);
    router.back();
  };

  // Mystery node reveal handler - shows what's inside but doesn't change store yet
  const handleMysteryReveal = () => {
    if (!node || !node.mysteryData) return;
    haptics.heavy();
    playSFX('door_open'); // Mysterious reveal sound

    // Get the actual type (don't update store yet - we want to show reveal UI first)
    const actualType = node.mysteryData.actualType;

    // Update local state to show reveal UI
    setMysteryRevealedType(actualType);
    setMysteryRevealed(true);
  };

  // Handle proceeding with revealed mystery content (combat/elite only - navigates away)
  const handleMysteryProceed = () => {
    if (!node || !mysteryRevealedType || !map) return;

    haptics.medium();

    // Update store to change node type (important for when returning)
    revealMystery(node.id);

    // Handle combat/elite - navigate to encounter
    switch (mysteryRevealedType) {
      case 'combat':
        prepareEncounter(map.floorNumber, false, false);
        router.push('/dungeon/encounter');
        break;
      case 'elite':
        prepareEncounter(map.floorNumber, false, true);
        router.push('/dungeon/encounter');
        break;
    }
  };

  // Refresh shop stock when entering a dungeon shop node
  React.useEffect(() => {
    if (node?.type === 'shop' && shouldRefreshStock()) {
      refreshStock();
    }
  }, [node?.id]);

  const handleShopBuy = (index: number) => {
    const result = purchaseEquipment(index);
    if (result.success) {
      haptics.success();
      playSFX('buff');
    } else {
      haptics.warning();
    }
  };

  const handleShopLeave = () => {
    haptics.light();
    setShopDone(true);
    completeNode(node!.id);
  };

  if (!node || !character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No node selected</Text>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // If node is already completed, just show info
  if (node.isCompleted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.nodeIcon}>{getNodeIcon(node.type)}</Text>
          <Text style={styles.nodeTitle}>{getNodeDisplayName(node.type)}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.clearedText}>This area has been cleared.</Text>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Return to Map</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.nodeIcon}>{getNodeIcon(node.type)}</Text>
        <Text style={styles.nodeTitle}>{getNodeDisplayName(node.type)}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Typewriter description for dramatic effect */}
        <TypewriterText
          text={NODE_DESCRIPTIONS[node.type]}
          style={styles.description}
          speed="fast"
          cursor={false}
          skippable={true}
        />

        {/* Node-specific content with dramatic reveals */}
        {node.type === 'combat' && (
          <DramaticReveal delay={800} duration={500}>
            <View style={styles.nodeContent}>
              <Text style={styles.warningText}>Enemies detected!</Text>
              <Text style={styles.hintText}>Prepare yourself for battle.</Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'elite' && (
          <DramaticReveal delay={800} duration={500}>
            <View style={styles.nodeContent}>
              <Text style={styles.eliteText}>An elite enemy blocks your path!</Text>
              <Text style={styles.hintText}>This foe is stronger but drops better rewards.</Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'treasure' && !currentTrap && !treasureOpened && (
          <DramaticReveal delay={800} duration={500}>
            <View style={styles.nodeContent}>
              <Text style={styles.treasureText}>A wooden chest sits before you.</Text>
              <Text style={styles.hintText}>This is a rare find! Open it carefully.</Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'treasure' && !currentTrap && treasureOpened && treasureLoot && (
          <DramaticReveal delay={200} duration={400} direction="scale" haptic>
            <View style={styles.nodeContent}>
              <Text style={styles.treasureText}>{treasureLoot.message}</Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'treasure' && currentTrap && !trapCompleted && (
          <DramaticReveal delay={600} duration={500}>
            <View style={styles.nodeContent}>
              <Text style={styles.warningText}>The chest looks suspicious...</Text>
              <Text style={styles.trapDescription}>{currentTrap.description}</Text>
              <View style={styles.statCheckInfo}>
                <Text style={styles.statCheckText}>Detection: {currentTrap.detectStat} check</Text>
                <Text style={styles.statCheckText}>Evasion: {currentTrap.evadeStat} check</Text>
              </View>
              <Text style={styles.trapDamageText}>Potential damage: ~{currentTrap.baseDamage} HP</Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'treasure' && trapCompleted && trapResult && (
          <View style={styles.nodeContent}>
            <Text style={[styles.resultText, trapResult.detected ? styles.successText : styles.failureText]}>
              {trapResult.message}
            </Text>
          </View>
        )}

        {node.type === 'rest' && restChoice === 'pending' && (
          <View style={styles.nodeContent}>
            <Text style={styles.restText}>The warmth of the fire beckons...</Text>
            {hasRations ? (
              <View style={styles.rationInfo}>
                <Text style={styles.rationText}>
                  You have rations in your pack. Eating while resting will restore 30% HP and SP.
                </Text>
              </View>
            ) : (
              <View style={styles.rationWarning}>
                <Text style={styles.rationWarningText}>
                  You have no rations! Resting hungry is dangerous - only 10% HP recovery, no SP.
                </Text>
              </View>
            )}
          </View>
        )}

        {node.type === 'rest' && restChoice === 'done' && restMessage && (
          <View style={styles.nodeContent}>
            <Text style={styles.restResultText}>{restMessage}</Text>
          </View>
        )}

        {node.type === 'shrine' && !shrineUsed && !shrineApproached && (
          <View style={styles.nodeContent}>
            <Text style={styles.shrineText}>
              A shrine dedicated to the gods stands before you. Ancient carvings line its base.
            </Text>
          </View>
        )}

        {node.type === 'shrine' && !shrineUsed && shrineApproached && shrineDomain && (
          <View style={styles.nodeContent}>
            <Text style={styles.shrineText}>
              The altar bears the sigil of <Text style={{ fontWeight: 'bold' }}>{shrineDomain}</Text>.
            </Text>
            <Text style={[styles.shrineText, {
              color: shrineAffinity === 'aligned' ? Colors.ui.success
                : shrineAffinity === 'opposed' ? Colors.resource.hp
                : Colors.text.secondary,
              marginTop: Spacing.sm,
            }]}>
              {shrineAffinity === 'aligned' && 'You sense deep resonance. This shrine welcomes you.'}
              {shrineAffinity === 'neutral' && 'You sense indifference. The shrine offers no promise.'}
              {shrineAffinity === 'opposed' && 'You sense hostility. Something warns you away.'}
            </Text>
          </View>
        )}

        {node.type === 'shrine' && shrineUsed && shrineResult && (
          <DramaticReveal delay={200} duration={400} direction="scale" haptic>
            <View style={styles.nodeContent}>
              {shrineResult.cursed ? (
                <>
                  <Text style={[styles.shrineResultTitle, { color: '#C84832' }]}>
                    {shrineResult.tier === 'D+' ? '✗ DIVINE WRATH' : '✗ CURSE RECEIVED'}
                  </Text>
                  <View style={styles.shrineResultList}>
                    <Text style={[styles.shrineResultItem, { color: '#C84832' }]}>
                      {shrineResult.hpHealed} HP
                    </Text>
                    <Text style={[styles.shrineResultItem, { color: '#C84832' }]}>
                      {shrineResult.favorGain} Deity Favor
                    </Text>
                    {shrineResult.tier === 'D+' && (
                      <Text style={[styles.shrineResultItem, { color: '#C84832' }]}>Cursed ×2 (5 encounters)</Text>
                    )}
                    {shrineResult.tier === 'D' && (
                      <Text style={[styles.shrineResultItem, { color: '#C84832' }]}>Cursed ×1 (3 encounters)</Text>
                    )}
                  </View>
                  <Text style={styles.shrineResultFlavor}>{shrineResult.flavorText}</Text>
                </>
              ) : shrineResult.permaBuff ? (
                <>
                  <Text style={[styles.shrineResultTitle, { color: '#C89030' }]}>✦ FALNA MARK PENDING</Text>
                  <View style={styles.shrineResultList}>
                    <Text style={[styles.shrineResultItem, { color: '#C89030' }]}>
                      +{shrineResult.exceliGained} {shrineResult.statBoosted} (confirm at Blessing Rite)
                    </Text>
                    <Text style={[styles.shrineResultItem, { color: '#487850' }]}>
                      +{shrineResult.favorGain} Deity Favor
                    </Text>
                  </View>
                  <Text style={styles.shrineResultFlavor}>{shrineResult.flavorText}</Text>
                </>
              ) : shrineResult.favorGain > 0 || shrineResult.hpHealed > 0 ? (
                <>
                  <Text style={[styles.shrineResultTitle, { color: '#487850' }]}>✓ BLESSING RECEIVED</Text>
                  <View style={styles.shrineResultList}>
                    {shrineResult.hpHealed > 0 && (
                      <Text style={[styles.shrineResultItem, { color: '#487850' }]}>
                        +{shrineResult.hpHealed} HP{shrineResult.spHealed > 0 ? ` | +${shrineResult.spHealed} SP` : ''}
                      </Text>
                    )}
                    {shrineResult.exceliGained > 0 && (
                      <Text style={[styles.shrineResultItem, { color: '#7B5BBF' }]}>
                        +{shrineResult.exceliGained} {shrineResult.statBoosted} Excelia
                      </Text>
                    )}
                    {shrineResult.favorGain > 0 && (
                      <Text style={[styles.shrineResultItem, { color: '#487850' }]}>
                        +{shrineResult.favorGain} Deity Favor
                      </Text>
                    )}
                  </View>
                  <Text style={styles.shrineResultFlavor}>{shrineResult.flavorText}</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.shrineResultTitle, { color: Colors.text.secondary }]}>— DIVINE SILENCE —</Text>
                  <Text style={styles.shrineResultFlavor}>{shrineResult.flavorText}</Text>
                </>
              )}
            </View>
          </DramaticReveal>
        )}

        {node.type === 'event' && currentEvent && !eventCompleted && (
          <View style={styles.nodeContent}>
            <Text style={styles.eventTitle}>{currentEvent.title}</Text>
            <Text style={styles.eventDescription}>{currentEvent.description}</Text>
            <Text style={styles.eventFlavor}>"{currentEvent.flavorText}"</Text>

            <View style={styles.choicesContainer}>
              {currentEvent.choices.map((choice) => (
                <Pressable
                  key={choice.id}
                  style={styles.choiceButton}
                  onPress={() => handleEventChoice(choice)}
                >
                  <Text style={styles.choiceLabel}>{choice.label}</Text>
                  <Text style={styles.choiceDescription}>{choice.description}</Text>
                  {choice.statCheck && (
                    <Text style={[
                      styles.choiceStatCheck,
                      { color: STAT_COLORS[choice.statCheck.stat] ?? Colors.text.accent },
                    ]}>
                      [{choice.statCheck.stat} check required]
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {node.type === 'event' && eventCompleted && eventResult && (
          <View style={styles.nodeContent}>
            {eventCheckSuccess !== null && (
              <Text style={[
                styles.resultText,
                { color: eventCheckSuccess ? '#487850' : '#C84832', fontWeight: '700', marginBottom: 8 }
              ]}>
                {eventCheckSuccess ? '✓ SUCCESS' : '✗ FAILED'}
              </Text>
            )}
            <Text style={[
              styles.resultText,
              eventOutcomeType && OUTCOME_COLORS[eventOutcomeType]
                ? { color: OUTCOME_COLORS[eventOutcomeType] }
                : undefined,
            ]}>
              {eventResult}
            </Text>
          </View>
        )}

        {/* Shop nodes are disabled - shops only exist in town */}

        {node.type === 'boss' && (
          <DramaticReveal delay={800} duration={600} haptic hapticStyle="heavy">
            <View style={styles.nodeContent}>
              <Text style={styles.bossText}>
                The floor guardian awaits. Prepare yourself!
              </Text>
              <Text style={styles.hintText}>Defeat the boss to descend deeper.</Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'mystery' && !mysteryRevealed && (
          <DramaticReveal delay={800} duration={500}>
            <View style={styles.nodeContent}>
              <Text style={styles.mysteryText}>???</Text>
              <Text style={styles.hintText}>Something lurks in the shadows...</Text>
              <Text style={styles.mysteryWarning}>
                Mystery nodes can reveal anything - treasures, shrines, or deadly foes.
              </Text>
            </View>
          </DramaticReveal>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType && (
          <DramaticReveal delay={200} duration={600} direction="scale" haptic>
            <View style={styles.nodeContent}>
              <Text style={styles.revealIcon}>{getNodeIcon(mysteryRevealedType)}</Text>
              <Text style={styles.revealText}>
                The mystery reveals itself...
              </Text>
              <Text style={[styles.revealType, {
                color: mysteryRevealedType === 'combat' || mysteryRevealedType === 'elite'
                  ? Colors.ui.error
                  : mysteryRevealedType === 'treasure'
                  ? Colors.resource.gold
                  : mysteryRevealedType === 'rest'
                  ? Colors.domain.life
                  : mysteryRevealedType === 'shrine'
                  ? Colors.domain.wisdom
                  : Colors.text.accent
              }]}>
                {getNodeDisplayName(mysteryRevealedType).toUpperCase()}!
              </Text>
              {mysteryRevealedType === 'combat' && (
                <Text style={styles.hintText}>Enemies block your path!</Text>
              )}
              {mysteryRevealedType === 'elite' && (
                <Text style={styles.eliteText}>A powerful foe awaits!</Text>
              )}
              {mysteryRevealedType === 'treasure' && (
                <Text style={styles.treasureText}>A hidden treasure!</Text>
              )}
              {mysteryRevealedType === 'event' && (
                <Text style={styles.hintText}>Something interesting catches your eye...</Text>
              )}
              {mysteryRevealedType === 'rest' && (
                <Text style={styles.restText}>A safe haven in the darkness.</Text>
              )}
              {mysteryRevealedType === 'shrine' && !shrineUsed && (
                <Text style={styles.shrineText}>Divine energy fills the air.</Text>
              )}
            </View>
          </DramaticReveal>
        )}

        {/* Mystery revealed as shrine - show hints before use */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'shrine' && !shrineUsed && (
          <View style={styles.nodeContent}>
            <View style={styles.shrineHint}>
              <Text style={styles.shrineHintText}>Praying at shrines grants:</Text>
              <Text style={styles.shrineHintItem}>+10 Deity Favor (blessing power)</Text>
              <Text style={styles.shrineHintItem}>+15% HP / +10% SP restored</Text>
              <Text style={styles.shrineHintItem}>+15 Excelia to a random stat</Text>
            </View>
          </View>
        )}

        {/* Mystery revealed as shrine - show result after use */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'shrine' && shrineUsed && shrineResult && (
          <DramaticReveal delay={200} duration={400} direction="scale" haptic>
            <View style={styles.nodeContent}>
              <Text style={styles.shrineResultTitle}>Divine Blessing Received!</Text>
              <View style={styles.shrineResultList}>
                <Text style={styles.shrineResultItem}>
                  +{shrineResult.favorGain} Deity Favor
                </Text>
                <Text style={styles.shrineResultItem}>
                  +{shrineResult.hpHealed} HP | +{shrineResult.spHealed} SP
                </Text>
                <Text style={styles.shrineResultItem}>
                  +{shrineResult.exceliGained} {shrineResult.statBoosted} Excelia
                </Text>
              </View>
              <Text style={styles.shrineResultFlavor}>
                The gods smile upon you.
              </Text>
            </View>
          </DramaticReveal>
        )}

        {/* Mystery revealed as event - show event choices */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'event' && currentEvent && !eventCompleted && (
          <View style={styles.nodeContent}>
            <Text style={styles.eventTitle}>{currentEvent.title}</Text>
            <Text style={styles.eventDescription}>{currentEvent.description}</Text>
            <Text style={styles.eventFlavor}>"{currentEvent.flavorText}"</Text>

            <View style={styles.choicesContainer}>
              {currentEvent.choices.map((choice) => (
                <Pressable
                  key={choice.id}
                  style={styles.choiceButton}
                  onPress={() => handleEventChoice(choice)}
                >
                  <Text style={styles.choiceLabel}>{choice.label}</Text>
                  <Text style={styles.choiceDescription}>{choice.description}</Text>
                  {choice.statCheck && (
                    <Text style={[
                      styles.choiceStatCheck,
                      { color: STAT_COLORS[choice.statCheck.stat] ?? Colors.text.accent },
                    ]}>
                      [{choice.statCheck.stat} check required]
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Mystery revealed as event - show result */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'event' && eventCompleted && eventResult && (
          <View style={styles.nodeContent}>
            <Text style={styles.resultText}>{eventResult}</Text>
          </View>
        )}

        {/* Mystery revealed as treasure - show loot after opening */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'treasure' && treasureOpened && treasureLoot && (
          <DramaticReveal delay={200} duration={400} direction="scale" haptic>
            <View style={styles.nodeContent}>
              <Text style={styles.treasureText}>{treasureLoot.message}</Text>
            </View>
          </DramaticReveal>
        )}

        {/* Mystery revealed as rest - show rest info */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'rest' && restChoice === 'pending' && (
          <View style={styles.nodeContent}>
            <Text style={styles.restText}>A hidden campfire in the darkness...</Text>
            {hasRations ? (
              <View style={styles.rationInfo}>
                <Text style={styles.rationText}>
                  You have rations in your pack. Eating while resting will restore 30% HP and SP.
                </Text>
              </View>
            ) : (
              <View style={styles.rationWarning}>
                <Text style={styles.rationWarningText}>
                  You have no rations! Resting hungry is dangerous - only 10% HP recovery, no SP.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Mystery revealed as rest - show result */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'rest' && restChoice === 'done' && restMessage && (
          <View style={styles.nodeContent}>
            <Text style={styles.restResultText}>{restMessage}</Text>
          </View>
        )}

        {node.type === 'start' && (
          <View style={styles.nodeContent}>
            <Text style={styles.startText}>
              You stand at the entrance. The dungeon beckons.
            </Text>
          </View>
        )}

        {/* Shop node — wandering merchant */}
        {node.type === 'shop' && (
          <View style={styles.nodeContent}>
            <Text style={styles.shopIntro}>
              A cloaked merchant eyes you from behind a makeshift stall.
              {'\n'}"Everything here has a price. So do you, probably."
            </Text>
            {equipmentStock
              .slice(0, 4)
              .map((stock, idx) => !stock.sold ? (
                <View key={stock.item.id} style={styles.shopItem}>
                  <View style={styles.shopItemInfo}>
                    <Text style={styles.shopItemName}>{stock.item.displayName}</Text>
                    <Text style={styles.shopItemPrice}>{getEquipmentPrice(idx)} G</Text>
                  </View>
                  <Pressable
                    style={[
                      styles.shopBuyBtn,
                      (character.gold < getEquipmentPrice(idx) || shopDone) && styles.shopBuyBtnDisabled,
                    ]}
                    onPress={() => handleShopBuy(idx)}
                    disabled={character.gold < getEquipmentPrice(idx) || shopDone}
                  >
                    <Text style={styles.shopBuyBtnText}>
                      {character.gold < getEquipmentPrice(idx) ? 'Can\'t Afford' : 'Buy'}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View key={stock.item.id} style={[styles.shopItem, styles.shopItemSold]}>
                  <Text style={styles.shopItemSoldText}>{stock.item.displayName} — Sold</Text>
                </View>
              ))
            }
            <Text style={styles.shopGoldDisplay}>Your gold: {character.gold} G</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        {node.type === 'combat' && (
          <Pressable style={[styles.actionButton, styles.combatButton]} onPress={() => handleCombat(false, false)}>
            <Text style={styles.actionButtonText}>Fight!</Text>
          </Pressable>
        )}

        {node.type === 'elite' && (
          <Pressable style={[styles.actionButton, styles.eliteButton]} onPress={() => handleCombat(false, true)}>
            <Text style={styles.actionButtonText}>Challenge Elite!</Text>
          </Pressable>
        )}

        {node.type === 'treasure' && !currentTrap && !treasureOpened && (
          <Pressable style={[styles.actionButton, styles.treasureButton]} onPress={handleOpenTreasure}>
            <Text style={styles.actionButtonText}>Open Chest</Text>
          </Pressable>
        )}

        {node.type === 'treasure' && !currentTrap && treasureOpened && (
          <Pressable style={[styles.actionButton, styles.treasureButton]} onPress={handleTreasureContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'treasure' && currentTrap && !trapCompleted && (
          <>
            <Pressable style={[styles.actionButton, styles.detectButton]} onPress={() => handleTrapAttempt('detect')}>
              <Text style={styles.actionButtonText}>Check for Traps ({currentTrap?.detectStat})</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.trapButton]} onPress={() => handleTrapAttempt('proceed')}>
              <Text style={styles.actionButtonText}>Just Open It (Risky)</Text>
            </Pressable>
          </>
        )}

        {node.type === 'treasure' && trapCompleted && (
          <Pressable style={[styles.actionButton, styles.treasureButton]} onPress={handleTrapContinue}>
            <Text style={styles.actionButtonText}>Take the Loot</Text>
          </Pressable>
        )}

        {node.type === 'rest' && restChoice === 'pending' && (
          <>
            {hasRations && (
              <Pressable style={[styles.actionButton, styles.restButton]} onPress={handleRestWithRation}>
                <Text style={styles.actionButtonText}>Rest with Ration (+30% HP/SP)</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.actionButton, hasRations ? styles.dangerousRestButton : styles.restButton]}
              onPress={handleDangerousRest}
            >
              <Text style={styles.actionButtonText}>
                {hasRations ? 'Rest Hungry (+10% HP only)' : 'Rest Hungry (+10% HP)'}
              </Text>
            </Pressable>
          </>
        )}

        {node.type === 'rest' && restChoice === 'done' && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleRestContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'shrine' && !shrineUsed && !shrineApproached && (
          <Pressable style={[styles.actionButton, styles.shrineButton]} onPress={handleShrineApproach}>
            <Text style={styles.actionButtonText}>Approach Shrine</Text>
          </Pressable>
        )}

        {node.type === 'shrine' && !shrineUsed && shrineApproached && (
          <>
            <Pressable style={[styles.actionButton, { backgroundColor: '#6B1A1A', borderColor: '#C84832', borderWidth: 1 }]} onPress={() => handleShrine('blood')}>
              <Text style={styles.actionButtonText}>⚔ Offer Blood</Text>
              <Text style={[styles.actionButtonText, { fontSize: 11, opacity: 0.7 }]}>(-15% HP · avoids worst outcomes)</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.shrineButton]} onPress={() => handleShrine('free')}>
              <Text style={styles.actionButtonText}>✦ Pray Freely</Text>
              <Text style={[styles.actionButtonText, { fontSize: 11, opacity: 0.7 }]}>(pure fate · higher risk & reward)</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleShrineContinue}>
              <Text style={styles.actionButtonText}>Leave</Text>
            </Pressable>
          </>
        )}

        {node.type === 'shrine' && shrineUsed && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleShrineContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'event' && eventCompleted && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleEventContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {/* Shop button removed - shops only exist in town */}

        {node.type === 'boss' && (
          <Pressable style={[styles.actionButton, styles.bossButton]} onPress={() => handleCombat(true, false)}>
            <Text style={styles.actionButtonText}>Challenge Boss</Text>
          </Pressable>
        )}

        {/* Mystery node - pre-reveal */}
        {node.type === 'mystery' && !mysteryRevealed && (
          <Pressable style={[styles.actionButton, styles.mysteryButton]} onPress={handleMysteryReveal}>
            <Text style={styles.actionButtonText}>Reveal the Mystery</Text>
          </Pressable>
        )}

        {/* Mystery node - post-reveal actions */}
        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'combat' && (
          <Pressable style={[styles.actionButton, styles.combatButton]} onPress={handleMysteryProceed}>
            <Text style={styles.actionButtonText}>Fight!</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'elite' && (
          <Pressable style={[styles.actionButton, styles.eliteButton]} onPress={handleMysteryProceed}>
            <Text style={styles.actionButtonText}>Challenge Elite!</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'treasure' && !treasureOpened && (
          <Pressable style={[styles.actionButton, styles.treasureButton]} onPress={handleOpenTreasure}>
            <Text style={styles.actionButtonText}>Open Hidden Chest</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'treasure' && treasureOpened && (
          <Pressable style={[styles.actionButton, styles.treasureButton]} onPress={handleTreasureContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'rest' && restChoice === 'pending' && (
          <>
            {hasRations && (
              <Pressable style={[styles.actionButton, styles.restButton]} onPress={handleRestWithRation}>
                <Text style={styles.actionButtonText}>Rest with Ration (+30% HP/SP)</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.actionButton, hasRations ? styles.dangerousRestButton : styles.restButton]}
              onPress={handleDangerousRest}
            >
              <Text style={styles.actionButtonText}>
                {hasRations ? 'Rest Hungry (+10% HP only)' : 'Rest Hungry (+10% HP)'}
              </Text>
            </Pressable>
          </>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'rest' && restChoice === 'done' && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleRestContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'shrine' && !shrineUsed && (
          <Pressable style={[styles.actionButton, styles.shrineButton]} onPress={() => handleShrine('free')}>
            <Text style={styles.actionButtonText}>Pray at Shrine</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'shrine' && shrineUsed && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleShrineContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'event' && !eventCompleted && currentEvent && (
          <Text style={styles.hintText}>Make your choice above...</Text>
        )}

        {node.type === 'mystery' && mysteryRevealed && mysteryRevealedType === 'event' && eventCompleted && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleEventContinue}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'start' && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleCompleteNode}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        {node.type === 'shop' && !shopDone && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleShopLeave}>
            <Text style={styles.actionButtonText}>Pack Up and Leave</Text>
          </Pressable>
        )}

        {node.type === 'shop' && shopDone && (
          <Pressable style={[styles.actionButton, styles.emptyButton]} onPress={handleCompleteNode}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>
        )}

        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Return to Map</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  nodeIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  nodeTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Padding.screen.horizontal,
    paddingVertical: Spacing.xl,
  },
  description: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  nodeContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  clearedText: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  warningText: {
    ...Typography.h5,
    color: Colors.ui.error,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  eliteText: {
    ...Typography.h5,
    color: Colors.danger.deadly,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  hintText: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  treasureText: {
    ...Typography.body,
    color: Colors.resource.gold,
    textAlign: 'center',
  },
  restText: {
    ...Typography.body,
    color: Colors.domain.life,
    textAlign: 'center',
  },
  rationInfo: {
    backgroundColor: Colors.domain.life + '20',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  rationText: {
    ...Typography.caption,
    color: Colors.domain.life,
    textAlign: 'center',
  },
  rationWarning: {
    backgroundColor: Colors.ui.warning + '20',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.warning,
  },
  rationWarningText: {
    ...Typography.caption,
    color: Colors.ui.warning,
    textAlign: 'center',
  },
  restResultText: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dangerousRestButton: {
    backgroundColor: Colors.ui.warning,
  },
  trapDamageText: {
    ...Typography.caption,
    color: Colors.ui.warning,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  shrineText: {
    ...Typography.body,
    color: Colors.domain.wisdom,
    textAlign: 'center',
  },
  shrineHint: {
    marginTop: Spacing.md,
    backgroundColor: Colors.domain.wisdom + '15',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  shrineHintText: {
    ...Typography.caption,
    color: Colors.domain.wisdom,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  shrineHintItem: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  shrineResultTitle: {
    ...Typography.h5,
    color: Colors.domain.wisdom,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  shrineResultList: {
    backgroundColor: Colors.domain.wisdom + '20',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  shrineResultItem: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    marginVertical: 2,
  },
  shrineResultFlavor: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  eventTitle: {
    ...Typography.h4,
    color: Colors.text.accent,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  eventDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  eventFlavor: {
    ...Typography.narrative,
    color: Colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  choicesContainer: {
    gap: Spacing.sm,
  },
  choiceButton: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  choiceLabel: {
    ...Typography.h6,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  choiceDescription: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  choiceStatCheck: {
    ...Typography.caption,
    color: Colors.text.accent,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  resultText: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  successText: {
    color: Colors.ui.success,
  },
  failureText: {
    color: Colors.ui.warning,
  },
  trapDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  statCheckInfo: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCheckText: {
    ...Typography.caption,
    color: Colors.text.accent,
    textAlign: 'center',
  },
  detectButton: {
    backgroundColor: Colors.domain.knowledge,
  },
  shopText: {
    ...Typography.narrative,
    color: Colors.domain.fortune,
    textAlign: 'center',
  },
  shopIntro: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    marginBottom: Spacing.xs,
  },
  shopItemSold: {
    opacity: 0.4,
  },
  shopItemInfo: {
    flex: 1,
    gap: 2,
  },
  shopItemName: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  shopItemPrice: {
    ...Typography.caption,
    color: Colors.text.accent,
  },
  shopBuyBtn: {
    backgroundColor: Colors.domain.fortune + '30',
    borderWidth: 1,
    borderColor: Colors.domain.fortune,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 80,
    alignItems: 'center',
  },
  shopBuyBtnDisabled: {
    opacity: 0.4,
    borderColor: Colors.border.primary,
    backgroundColor: Colors.background.secondary,
  },
  shopBuyBtnText: {
    ...Typography.label,
    fontSize: 12,
    color: Colors.domain.fortune,
    letterSpacing: 1,
  },
  shopItemSoldText: {
    ...Typography.bodySmall,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  shopGoldDisplay: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  bossText: {
    ...Typography.body,
    color: Colors.danger.deadly,
    textAlign: 'center',
  },
  mysteryText: {
    ...Typography.h2,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  mysteryWarning: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.md,
  },
  revealIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  revealText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  revealType: {
    ...Typography.h3,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  startText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    padding: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  combatButton: {
    backgroundColor: Colors.ui.error,
  },
  eliteButton: {
    backgroundColor: Colors.danger.deadly,
  },
  treasureButton: {
    backgroundColor: Colors.resource.gold,
  },
  restButton: {
    backgroundColor: Colors.domain.life,
  },
  trapButton: {
    backgroundColor: Colors.ui.warning,
  },
  shrineButton: {
    backgroundColor: Colors.domain.wisdom,
  },
  shopButton: {
    backgroundColor: Colors.domain.fortune,
  },
  bossButton: {
    backgroundColor: '#8B0000',
  },
  mysteryButton: {
    backgroundColor: Colors.text.muted,
  },
  emptyButton: {
    backgroundColor: Colors.background.tertiary,
  },
  backButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  backButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.muted,
  },
});
