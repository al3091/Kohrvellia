/**
 * B-09 step 3 guard — the bridge: persistent character effects reach combat and write back.
 * This is the wiring that makes shrine curses / paralysis / buffs actually apply in a fight
 * (KV-AUD-190/374): combat seeds `playerEffects` from `character.statusEffects` at the start and
 * persists the survivors back at the end (the character list is otherwise never ticked, so this is
 * also how a seeded effect expires — over combat turns).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useCharacterStore } from '../src/stores/useCharacterStore';
import { useCombatStore } from '../src/stores/useCombatStore';
import { createStatusEffect } from '../src/types/StatusEffect';
import type { Character } from '../src/types/Character';
import type { Monster } from '../src/types/Monster';

const dummyMonster = { displayName: 'Training Dummy' } as unknown as Monster;

describe('B-09 bridge — character effects ↔ combat', () => {
  beforeEach(() => {
    useCharacterStore.setState({ character: { statusEffects: [] } as unknown as Character });
  });

  it('seeds a persistent effect into combat at start and writes survivors back at end', () => {
    useCharacterStore.getState().addStatusEffect(createStatusEffect('curse'));
    expect(useCharacterStore.getState().character?.statusEffects.some((e) => e.type === 'curse')).toBe(true);

    // Start of fight → the curse is carried into combat's own effect list.
    useCombatStore.getState().startCombatWithMonster(dummyMonster);
    expect(useCombatStore.getState().playerEffects.some((e) => e.type === 'curse')).toBe(true);

    // End of fight → survivors persist back onto the character.
    useCombatStore.getState().endCombat();
    expect(useCharacterStore.getState().character?.statusEffects.some((e) => e.type === 'curse')).toBe(true);
  });

  it('a character with no effects starts (and ends) combat clean', () => {
    useCombatStore.getState().startCombatWithMonster(dummyMonster);
    expect(useCombatStore.getState().playerEffects).toHaveLength(0);
    useCombatStore.getState().endCombat();
    expect(useCharacterStore.getState().character?.statusEffects).toHaveLength(0);
  });
});
