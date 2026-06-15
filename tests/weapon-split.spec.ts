/**
 * B-12 guard (KV-AUD-312) — dual-stat weapons engage their SECOND physical stat.
 * `physScaling` used only the single `weaponCategory`, so a STR/AGI weapon ignored AGI entirely.
 * Now multiple physical primary stats split evenly (the weighting sums to 1.0 — no double-dip),
 * while single-stat weapons stay byte-identical (the B-06 golden master also asserts this).
 */
import { describe, it, expect } from 'vitest';
import { calculateDerivedStats, createDefaultStats, type Stats, type StatName } from '../src/types/Stats';

function statsWith(points: Partial<Record<StatName, number>>): Stats {
  const s = createDefaultStats();
  (Object.keys(points) as StatName[]).forEach((k) => {
    s[k] = { grade: 'I', points: points[k] ?? 0, proficiency: 0 };
  });
  return s;
}

// (level, stats, carry, wpnDmg, wpnMagic, armDef, armMagDef, blessing, cap, wpnLuck, wpnCrit, category, primaryStats?)
const phys = (stats: Stats, category: string, primaryStats?: string[]) =>
  calculateDerivedStats(1, stats, {}, 0, 0, 0, 0, 1.0, Infinity, 0, 0, category, primaryStats).physicalAttack;

describe('B-12 — dual-stat weapons engage the second physical stat', () => {
  it('a STR/AGI weapon now USES AGI: investing in AGI raises its physical attack (was ignored)', () => {
    const noAgi = phys(statsWith({ STR: 500 }), 'STR', ['STR', 'AGI']);
    const withAgi = phys(statsWith({ STR: 500, AGI: 500 }), 'STR', ['STR', 'AGI']);
    expect(withAgi).toBeGreaterThan(noAgi);
  });

  it('the split sums to 1.0 — no 061-style double-dip', () => {
    // STR=AGI=500. A double-dip (STR full + AGI full) would roughly double a single-stat result.
    const stats = statsWith({ STR: 500, AGI: 500 });
    const strOnly = phys(stats, 'STR'); // 0.008 * effSTR
    const dual = phys(stats, 'STR', ['STR', 'AGI']); // 0.5 * (0.008*effSTR + 0.007*effAGI)
    expect(dual).toBeLessThan(strOnly); // split → less than the full single-stat term, never more
    expect(dual).toBeGreaterThan(strOnly * 0.5); // but AGI's half pulls it above pure-half
  });

  it('single-stat weapon (no / empty primaryStats) is unchanged — the golden-master path', () => {
    const stats = statsWith({ STR: 500 });
    expect(phys(stats, 'STR', [])).toBe(phys(stats, 'STR'));
  });
});
