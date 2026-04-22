/**
 * Sound store for Kohrvellia
 * Manages background music and sound effects
 * Uses expo-audio (replaces deprecated expo-av)
 */

import { create } from 'zustand';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

// Sound effect types
export type SFXType =
  // Combat
  | 'attack'
  | 'attack_critical'
  | 'hit'
  | 'hit_heavy'
  | 'miss'
  | 'defend'
  | 'heal'
  | 'buff'
  | 'debuff'
  // Rewards
  | 'victory'
  | 'defeat'
  | 'level_up'
  | 'achievement'
  | 'item_pickup'
  | 'item_equip'
  | 'gold_pickup'
  // UI
  | 'button_click'
  | 'button_confirm'
  | 'button_cancel'
  | 'error'
  // Exploration
  | 'door_open'
  | 'step'
  // Blessing ceremony
  | 'blessing_start'
  | 'blessing_loop'
  | 'blessing_complete'
  | 'stat_reveal'
  | 'grade_up'
  // Node-specific
  | 'shrine_chime'
  | 'treasure_open'
  | 'treasure_creak'
  | 'mimic_growl';

// Background music types
export type BGMType =
  // Core tracks
  | 'title'
  | 'dungeon'
  | 'combat'
  | 'boss'
  | 'victory'
  | 'defeat'
  | 'shop'
  | 'rest'
  // Blessing ceremony - domain specific
  | 'blessing_war'
  | 'blessing_magic'
  | 'blessing_trickery'
  | 'blessing_death'
  | 'blessing_fortune'
  | 'blessing_nature'
  | 'blessing_wisdom'
  | 'blessing_craft'
  | 'blessing_authority'
  | 'blessing_life'
  | 'blessing_sea'
  | 'blessing_sky'
  | 'blessing_fire'
  | 'blessing_knowledge'
  // Fallback blessing theme
  | 'blessing_generic';

// Ambient loop types
export type AmbientType =
  | 'dungeon_drip'
  | 'wind'
  | 'fire_crackle'
  | 'cave_echo'
  | 'forest_ambient';

// Sound preload groups for efficient loading
export const PRELOAD_GROUPS = {
  combat: ['attack', 'attack_critical', 'hit', 'hit_heavy', 'miss', 'defend', 'heal', 'buff', 'debuff'] as SFXType[],
  ui: ['button_click', 'button_confirm', 'button_cancel', 'error'] as SFXType[],
  rewards: ['victory', 'defeat', 'level_up', 'achievement', 'gold_pickup', 'item_pickup'] as SFXType[],
  exploration: ['door_open', 'step', 'item_equip', 'shrine_chime', 'treasure_open', 'treasure_creak'] as SFXType[],
  blessing: ['blessing_start', 'blessing_complete', 'stat_reveal', 'grade_up'] as SFXType[],
};

interface SoundState {
  // Settings
  masterVolume: number;
  sfxVolume: number;
  bgmVolume: number;
  ambientVolume: number;
  sfxEnabled: boolean;
  bgmEnabled: boolean;
  ambientEnabled: boolean;

  // Current state
  currentBGM: BGMType | null;
  currentAmbient: AmbientType | null;
  bgmPlayer: AudioPlayer | null;
  ambientPlayer: AudioPlayer | null;
  isInitialized: boolean;
  isPreloading: boolean;
  isCrossfading: boolean;

  // Preloaded SFX
  sfxCache: Map<SFXType, AudioPlayer>;
  preloadedGroups: Set<string>;

  // Actions
  initialize: () => Promise<void>;
  cleanup: () => void;

  // Settings
  setMasterVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  setBGMVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  toggleSFX: () => void;
  toggleBGM: () => void;
  toggleAmbient: () => void;

  // Preloading
  preloadGroup: (group: keyof typeof PRELOAD_GROUPS) => Promise<void>;
  preloadCombatSounds: () => Promise<void>;
  preloadUISounds: () => Promise<void>;
  preloadBlessingSounds: () => Promise<void>;
  unloadGroup: (group: keyof typeof PRELOAD_GROUPS) => void;

  // SFX Playback
  playSFX: (type: SFXType) => Promise<void>;
  playSFXVariant: (type: SFXType, variant?: number) => Promise<void>;

  // BGM Playback
  playBGM: (type: BGMType) => Promise<void>;
  playBlessingBGM: (domain: string) => Promise<void>;
  stopBGM: () => void;
  pauseBGM: () => void;
  resumeBGM: () => void;
  fadeOutBGM: (durationMs?: number) => Promise<void>;
  crossfadeBGM: (newType: BGMType, durationMs?: number) => Promise<void>;

  // Ambient Playback
  playAmbient: (type: AmbientType) => Promise<void>;
  stopAmbient: () => void;
  fadeAmbient: (targetVolume: number, durationMs?: number) => Promise<void>;
}

// Sound effect files
const SFX_FILES: Record<SFXType, ReturnType<typeof require> | null> = {
  // Combat
  attack: require('../../assets/sounds/sfx/combat/attack.mp3'),
  attack_critical: require('../../assets/sounds/sfx/combat/attack_critical.mp3'),
  hit: require('../../assets/sounds/sfx/combat/hit.mp3'),
  hit_heavy: require('../../assets/sounds/sfx/combat/hit_heavy.mp3'),
  miss: require('../../assets/sounds/sfx/combat/miss.mp3'),
  defend: require('../../assets/sounds/sfx/combat/defend.mp3'),
  heal: require('../../assets/sounds/sfx/combat/heal.mp3'),
  buff: require('../../assets/sounds/sfx/combat/buff.mp3'),
  debuff: require('../../assets/sounds/sfx/combat/debuff.mp3'),
  // Rewards
  victory: require('../../assets/sounds/sfx/rewards/victory.mp3'),
  defeat: require('../../assets/sounds/sfx/rewards/defeat.mp3'),
  level_up: require('../../assets/sounds/sfx/rewards/level_up.mp3'),
  achievement: require('../../assets/sounds/sfx/rewards/achievement.mp3'),
  item_pickup: require('../../assets/sounds/sfx/rewards/item_pickup.mp3'),
  item_equip: require('../../assets/sounds/sfx/rewards/item_equip.mp3'),
  gold_pickup: require('../../assets/sounds/sfx/rewards/gold_pickup.mp3'),
  // UI
  button_click: require('../../assets/sounds/sfx/ui/button_click.mp3'),
  button_confirm: require('../../assets/sounds/sfx/ui/button_confirm.mp3'),
  button_cancel: require('../../assets/sounds/sfx/ui/button_cancel.mp3'),
  error: require('../../assets/sounds/sfx/ui/error.mp3'),
  // Exploration
  door_open: require('../../assets/sounds/sfx/exploration/door_open.mp3'),
  step: require('../../assets/sounds/sfx/exploration/step.mp3'),
  // Blessing ceremony
  blessing_start: require('../../assets/sounds/sfx/blessing/blessing_start.mp3'),
  blessing_loop: require('../../assets/sounds/sfx/blessing/blessing_loop.mp3'),
  blessing_complete: require('../../assets/sounds/sfx/blessing/blessing_complete.mp3'),
  stat_reveal: require('../../assets/sounds/sfx/blessing/stat_reveal.mp3'),
  grade_up: require('../../assets/sounds/sfx/blessing/grade_up.mp3'),
  // Node-specific
  shrine_chime: require('../../assets/sounds/sfx/exploration/shrine_chime.mp3'),
  treasure_open: require('../../assets/sounds/sfx/exploration/treasure_open.mp3'),
  treasure_creak: require('../../assets/sounds/sfx/exploration/treasure_creak.mp3'),
  mimic_growl: require('../../assets/sounds/sfx/exploration/mimic_growl.mp3'),
};

// Ambient loop files
const AMBIENT_FILES: Record<AmbientType, ReturnType<typeof require> | null> = {
  dungeon_drip: require('../../assets/sounds/sfx/ambient/dungeon_drip.mp3'),
  wind: require('../../assets/sounds/sfx/ambient/wind.mp3'),
  fire_crackle: require('../../assets/sounds/sfx/ambient/fire_crackle.mp3'),
  cave_echo: require('../../assets/sounds/sfx/ambient/cave_echo.mp3'),
  forest_ambient: require('../../assets/sounds/sfx/ambient/forest_ambient.mp3'),
};

const BGM_FILES: Record<BGMType, ReturnType<typeof require> | null> = {
  // Core tracks
  title: require('../../assets/sounds/bgm/title.mp3'),
  dungeon: require('../../assets/sounds/bgm/dungeon.mp3'),
  combat: require('../../assets/sounds/bgm/combat.mp3'),
  boss: require('../../assets/sounds/bgm/boss.mp3'),
  victory: require('../../assets/sounds/bgm/victory.mp3'),
  defeat: require('../../assets/sounds/bgm/defeat.mp3'),
  shop: require('../../assets/sounds/bgm/shop.mp3'),
  rest: require('../../assets/sounds/bgm/rest.mp3'),
  // Blessing ceremony - domain specific (use generic fallback for missing domains)
  blessing_war: require('../../assets/sounds/bgm/blessing_war.mp3'),
  blessing_magic: require('../../assets/sounds/bgm/blessing_magic.mp3'),
  blessing_trickery: require('../../assets/sounds/bgm/blessing_generic.mp3'),
  blessing_death: require('../../assets/sounds/bgm/blessing_death.mp3'),
  blessing_fortune: require('../../assets/sounds/bgm/blessing_fortune.mp3'),
  blessing_nature: require('../../assets/sounds/bgm/blessing_nature.mp3'),
  blessing_wisdom: require('../../assets/sounds/bgm/blessing_wisdom.mp3'),
  blessing_craft: require('../../assets/sounds/bgm/blessing_generic.mp3'),
  blessing_authority: require('../../assets/sounds/bgm/blessing_generic.mp3'),
  blessing_life: require('../../assets/sounds/bgm/blessing_life.mp3'),
  blessing_sea: require('../../assets/sounds/bgm/blessing_generic.mp3'),
  blessing_sky: require('../../assets/sounds/bgm/blessing_generic.mp3'),
  blessing_fire: require('../../assets/sounds/bgm/blessing_fire.mp3'),
  blessing_knowledge: require('../../assets/sounds/bgm/blessing_generic.mp3'),
  blessing_generic: require('../../assets/sounds/bgm/blessing_generic.mp3'),
};

// Map deity domains to blessing BGM
const DOMAIN_TO_BGM: Record<string, BGMType> = {
  war: 'blessing_war',
  magic: 'blessing_magic',
  trickery: 'blessing_trickery',
  death: 'blessing_death',
  fortune: 'blessing_fortune',
  nature: 'blessing_nature',
  wisdom: 'blessing_wisdom',
  craft: 'blessing_craft',
  authority: 'blessing_authority',
  life: 'blessing_life',
  sea: 'blessing_sea',
  sky: 'blessing_sky',
  fire: 'blessing_fire',
  knowledge: 'blessing_knowledge',
};

// ── Safe helpers ──────────────────────────────────────────────────────────────

function safeRemove(player: AudioPlayer | null): void {
  if (!player) return;
  try { player.remove(); } catch { /* already removed */ }
}

function safeSetVolume(player: AudioPlayer | null, volume: number): void {
  if (!player) return;
  try { player.volume = Math.max(0, Math.min(1, volume)); } catch { /* ignore */ }
}

function safePlay(player: AudioPlayer | null): void {
  if (!player) return;
  try { player.play(); } catch { /* ignore */ }
}

function safePause(player: AudioPlayer | null): void {
  if (!player) return;
  try { player.pause(); } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────

export const useSoundStore = create<SoundState>((set, get) => ({
  masterVolume: 1.0,
  sfxVolume: 0.8,
  bgmVolume: 0.5,
  ambientVolume: 0.3,
  sfxEnabled: true,
  bgmEnabled: true,
  ambientEnabled: true,
  currentBGM: null,
  currentAmbient: null,
  bgmPlayer: null,
  ambientPlayer: null,
  isInitialized: false,
  isPreloading: false,
  isCrossfading: false,
  sfxCache: new Map(),
  preloadedGroups: new Set(),

  initialize: async () => {
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      });
      set({ isInitialized: true });
      console.log('[Sound] Initialized');
    } catch (error) {
      console.error('[Sound] Failed to initialize:', error);
    }
  },

  cleanup: () => {
    const { bgmPlayer, ambientPlayer, sfxCache } = get();
    safeRemove(bgmPlayer);
    safeRemove(ambientPlayer);
    for (const player of sfxCache.values()) safeRemove(player);
    set({
      bgmPlayer: null,
      ambientPlayer: null,
      currentBGM: null,
      currentAmbient: null,
      sfxCache: new Map(),
      preloadedGroups: new Set(),
      isInitialized: false,
      isPreloading: false,
      isCrossfading: false,
    });
  },

  preloadGroup: async (group) => {
    const { sfxCache, preloadedGroups, isPreloading } = get();
    if (preloadedGroups.has(group) || isPreloading) return;

    const sounds = PRELOAD_GROUPS[group];
    if (!sounds) return;

    set({ isPreloading: true });
    console.log(`[Sound] Preloading group: ${group}`);

    for (const sfxType of sounds) {
      if (sfxCache.has(sfxType)) continue;
      const file = SFX_FILES[sfxType];
      if (file) {
        try {
          const player = createAudioPlayer(file);
          sfxCache.set(sfxType, player);
        } catch (error) {
          console.error(`[Sound] Failed to preload ${sfxType}:`, error);
        }
      }
    }

    preloadedGroups.add(group);
    set({ isPreloading: false, sfxCache, preloadedGroups });
    console.log(`[Sound] Preloaded group: ${group}`);
  },

  preloadCombatSounds: async () => { await get().preloadGroup('combat'); },
  preloadUISounds: async () => { await get().preloadGroup('ui'); },
  preloadBlessingSounds: async () => { await get().preloadGroup('blessing'); },

  unloadGroup: (group) => {
    const { sfxCache, preloadedGroups } = get();
    const sounds = PRELOAD_GROUPS[group];
    if (!sounds) return;
    for (const sfxType of sounds) {
      const player = sfxCache.get(sfxType);
      if (player) {
        safeRemove(player);
        sfxCache.delete(sfxType);
      }
    }
    preloadedGroups.delete(group);
    set({ sfxCache, preloadedGroups });
    console.log(`[Sound] Unloaded group: ${group}`);
  },

  setMasterVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ masterVolume: clamped });
    const { bgmPlayer, bgmVolume } = get();
    safeSetVolume(bgmPlayer, bgmVolume * clamped);
  },

  setSFXVolume: (volume) => {
    set({ sfxVolume: Math.max(0, Math.min(1, volume)) });
  },

  setBGMVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ bgmVolume: clamped });
    const { bgmPlayer, masterVolume } = get();
    safeSetVolume(bgmPlayer, clamped * masterVolume);
  },

  toggleSFX: () => {
    set((state) => ({ sfxEnabled: !state.sfxEnabled }));
  },

  toggleBGM: () => {
    const { bgmEnabled, bgmPlayer } = get();
    if (bgmEnabled) {
      safePause(bgmPlayer);
    } else {
      safePlay(bgmPlayer);
    }
    set({ bgmEnabled: !bgmEnabled });
  },

  setAmbientVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ ambientVolume: clamped });
    const { ambientPlayer, masterVolume } = get();
    safeSetVolume(ambientPlayer, clamped * masterVolume);
  },

  toggleAmbient: () => {
    const { ambientEnabled, ambientPlayer } = get();
    if (ambientEnabled) {
      safePause(ambientPlayer);
    } else {
      safePlay(ambientPlayer);
    }
    set({ ambientEnabled: !ambientEnabled });
  },

  playSFX: async (type) => {
    const { sfxEnabled, sfxVolume, masterVolume, sfxCache } = get();
    if (!sfxEnabled) return;

    console.log(`[SFX] Would play: ${type}`);

    // Replay from cache if available
    const cached = sfxCache.get(type);
    if (cached) {
      try {
        cached.seekTo(0);
        cached.volume = sfxVolume * masterVolume;
        cached.play();
        return;
      } catch {
        sfxCache.delete(type);
      }
    }

    // Load and play; auto-remove when done
    const file = SFX_FILES[type];
    if (file) {
      try {
        const player = createAudioPlayer(file);
        player.volume = sfxVolume * masterVolume;
        player.play();
        // Auto-cleanup when finished
        const subscription = player.addListener('playbackStatusUpdate', (status: Record<string, unknown>) => {
          if (status.didJustFinish) {
            subscription.remove();
            safeRemove(player);
          }
        });
      } catch (error) {
        console.error(`[SFX] Failed to play ${type}:`, error);
      }
    }
  },

  playSFXVariant: async (type, variant) => {
    const { sfxEnabled } = get();
    if (!sfxEnabled) return;
    if (variant === undefined) {
      await get().playSFX(type);
      return;
    }
    console.log(`[SFX] Would play variant: ${type}_${variant}`);
    await get().playSFX(type);
  },

  playBGM: async (type) => {
    const { bgmEnabled, bgmVolume, masterVolume, bgmPlayer, currentBGM } = get();
    if (currentBGM === type && bgmPlayer) return;

    safeRemove(bgmPlayer);
    console.log(`[BGM] Would play: ${type}`);

    const file = BGM_FILES[type];
    if (!file) {
      set({ currentBGM: type, bgmPlayer: null });
      return;
    }

    try {
      const player = createAudioPlayer(file);
      player.loop = true;
      player.volume = bgmEnabled ? bgmVolume * masterVolume : 0;
      set({ bgmPlayer: player, currentBGM: type });
      if (bgmEnabled) player.play();
    } catch (error) {
      console.error(`[BGM] Failed to play ${type}:`, error);
    }
  },

  playBlessingBGM: async (domain) => {
    const bgmType = DOMAIN_TO_BGM[domain] ?? 'blessing_generic';
    console.log(`[BGM] Playing blessing theme for domain: ${domain} -> ${bgmType}`);
    await get().crossfadeBGM(bgmType, 1000);
  },

  stopBGM: () => {
    const { bgmPlayer } = get();
    safeRemove(bgmPlayer);
    set({ bgmPlayer: null, currentBGM: null });
  },

  pauseBGM: () => {
    safePause(get().bgmPlayer);
  },

  resumeBGM: () => {
    const { bgmPlayer, bgmEnabled } = get();
    if (bgmEnabled) safePlay(bgmPlayer);
  },

  fadeOutBGM: async (durationMs = 1000) => {
    const { bgmPlayer, bgmVolume, masterVolume } = get();
    if (!bgmPlayer) return;

    const startVol = bgmVolume * masterVolume;
    const steps = 20;
    const stepMs = durationMs / steps;

    try {
      for (let i = 0; i < steps; i++) {
        await new Promise<void>((r) => setTimeout(r, stepMs));
        safeSetVolume(bgmPlayer, Math.max(0, startVol * (1 - (i + 1) / steps)));
      }
      safePause(bgmPlayer);
      safeSetVolume(bgmPlayer, startVol); // Reset for next play
    } catch {
      // Player may have been removed during fade
    }
  },

  crossfadeBGM: async (newType, durationMs = 1500) => {
    const { bgmPlayer, bgmEnabled, bgmVolume, masterVolume, currentBGM, isCrossfading } = get();

    if (currentBGM === newType && bgmPlayer) return;
    if (isCrossfading) {
      console.log(`[BGM] Crossfade in progress, skipping: ${newType}`);
      return;
    }

    set({ isCrossfading: true });

    const targetVol = bgmVolume * masterVolume;
    const steps = 30;
    const stepMs = durationMs / steps;
    const oldPlayer = bgmPlayer;

    const fadeOutOld = (async () => {
      if (!oldPlayer) return;
      try {
        for (let i = 0; i < steps / 2; i++) {
          safeSetVolume(oldPlayer, Math.max(0, targetVol * (1 - i / (steps / 2))));
          await new Promise<void>((r) => setTimeout(r, stepMs));
        }
      } catch { /* ignore */ }
      safeRemove(oldPlayer);
    })();

    const file = BGM_FILES[newType];
    if (!file) {
      await fadeOutOld;
      set({ currentBGM: newType, bgmPlayer: null, isCrossfading: false });
      return;
    }

    try {
      const newPlayer = createAudioPlayer(file);
      newPlayer.loop = true;
      newPlayer.volume = 0;
      set({ bgmPlayer: newPlayer, currentBGM: newType });

      if (bgmEnabled) {
        newPlayer.play();
        for (let i = 0; i < steps; i++) {
          safeSetVolume(newPlayer, targetVol * (i / steps));
          await new Promise<void>((r) => setTimeout(r, stepMs));
        }
        safeSetVolume(newPlayer, targetVol);
      }

      await fadeOutOld;
      set({ isCrossfading: false });
      console.log(`[BGM] Crossfade complete: ${newType}`);
    } catch (error) {
      console.error(`[BGM] Crossfade failed:`, error);
      await fadeOutOld;
      set({ isCrossfading: false });
    }
  },

  playAmbient: async (type) => {
    const { ambientEnabled, ambientVolume, masterVolume, ambientPlayer, currentAmbient } = get();
    if (currentAmbient === type && ambientPlayer) return;

    safeRemove(ambientPlayer);
    console.log(`[Ambient] Would play: ${type}`);

    const file = AMBIENT_FILES[type];
    if (!file) {
      set({ currentAmbient: type, ambientPlayer: null });
      return;
    }

    try {
      const player = createAudioPlayer(file);
      player.loop = true;
      player.volume = ambientEnabled ? ambientVolume * masterVolume : 0;
      set({ ambientPlayer: player, currentAmbient: type });
      if (ambientEnabled) player.play();
    } catch (error) {
      console.error(`[Ambient] Failed to play ${type}:`, error);
    }
  },

  stopAmbient: () => {
    safeRemove(get().ambientPlayer);
    set({ ambientPlayer: null, currentAmbient: null });
  },

  fadeAmbient: async (targetVolume, durationMs = 1000) => {
    const { ambientPlayer, ambientVolume, masterVolume } = get();
    if (!ambientPlayer) return;

    const startVol = ambientVolume * masterVolume;
    const endVol = targetVolume * masterVolume;
    const steps = 20;
    const stepMs = durationMs / steps;
    const volStep = (endVol - startVol) / steps;

    try {
      for (let i = 0; i <= steps; i++) {
        await new Promise<void>((r) => setTimeout(r, stepMs));
        safeSetVolume(ambientPlayer, startVol + volStep * i);
      }
      set({ ambientVolume: targetVolume });
    } catch { /* player may have been removed */ }
  },
}));

// Convenience hook for playing SFX
export function useSound() {
  const {
    playSFX,
    playSFXVariant,
    playBGM,
    playBlessingBGM,
    stopBGM,
    crossfadeBGM,
    fadeOutBGM,
    playAmbient,
    stopAmbient,
    preloadCombatSounds,
    preloadUISounds,
    preloadBlessingSounds,
  } = useSoundStore();

  return {
    playSFX,
    playSFXVariant,
    playBGM,
    playBlessingBGM,
    stopBGM,
    crossfadeBGM,
    fadeOutBGM,
    playAmbient,
    stopAmbient,
    preloadCombatSounds,
    preloadUISounds,
    preloadBlessingSounds,
  };
}
