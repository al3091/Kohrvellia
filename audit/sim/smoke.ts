/* Smoke test — prove we can import the REAL game formulas (ground truth, no transcription).
 * This is the keystone for Layer D: if these imports resolve cleanly under tsx, the balance
 * simulator can call the actual source functions and cannot drift from the game. */

import { calculateDerivedStats } from '../../src/types/Stats';
import { createMonsterInstance } from '../../src/types/Monster';
import { GOBLIN, PRIMORDIAL } from '../../src/data/monsters/baseMonsters';

// Minimal Stats object (8 StatBlocks). Grade letters don't affect the linear effStat path.
const mkStats = (primaryPoints: number) => ({
  STR: { grade: 'D', points: primaryPoints, proficiency: 0 },
  PER: { grade: 'I', points: 0, proficiency: 0 },
  END: { grade: 'E', points: Math.floor(primaryPoints / 2), proficiency: 0 },
  CHA: { grade: 'I', points: 0, proficiency: 0 },
  INT: { grade: 'I', points: 0, proficiency: 0 },
  AGI: { grade: 'I', points: 0, proficiency: 0 },
  WIS: { grade: 'I', points: 0, proficiency: 0 },
  LCK: { grade: 'I', points: 0, proficiency: 0 },
}) as any;

console.log('=== Smoke: importing REAL formulas from src/ ===');

// Player derived stats at level 2, focused STR, a modest weapon, STR weapon category.
const ds = calculateDerivedStats(2, mkStats(400), {}, 20, 0, 0, 0, 1.0, Infinity, 0, 0, 'STR');
console.log('player L2 (STR focus): physAtk=%d  maxHP=%d  physDef=%d  speed=%s',
  ds.physicalAttack, ds.maxHP, ds.physicalDefense, String(ds.speed));

// Real monster instances at depth (exact scaling, incl. the zoneMultiplier).
for (const [m, floor] of [[GOBLIN, 1], [GOBLIN, 20], [PRIMORDIAL, 86]] as const) {
  const inst = createMonsterInstance(m, undefined, undefined, floor);
  console.log('%s @ floor %d:  HP=%d  atk=%d  def=%d',
    inst.base.name, floor, inst.maxHP, inst.attack, inst.defense);
}

console.log('=== Smoke OK: real-source import works → Layer D can use ground-truth formulas ===');
