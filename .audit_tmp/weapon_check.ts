/* W3-DC3 weapon data validator (audit, report-only).
 * DATA is imported (ground truth, no transcription). The small reference unions
 * are transcribed first-hand from src/types/Weapon.ts (read S40): HybridCategory
 * (9-25), DamageType (44-54), and the live routing Sets are IMPORTED. */
import { ALL_WEAPONS } from '../src/data/weapons';
import { MAGICAL_WEAPON_CATEGORIES, HYBRID_MIXED_CATEGORIES } from '../src/types/Weapon';

const WEAPON_CATEGORY = ['STR','AGI','PER','INT','WIS','CHA','END','LCK'];
const HYBRID_UNION = ['STR_AGI','STR_END','STR_INT','STR_PER','STR_LCK','AGI_PER','AGI_LCK','AGI_WIS','AGI_INT','INT_WIS','INT_LCK','WIS_END','WIS_CHA','PER_LCK','CHA_WIS','CHA_INT','END_PER'];
const DAMAGE_TYPES = ['slash','pierce','blunt','magic','holy','fire','ice','lightning','poison','dark'];
const ALL_CATS = new Set([...WEAPON_CATEGORY, ...HYBRID_UNION]);
const MAGICAL_STATS = new Set(['INT','WIS']);

const w = ALL_WEAPONS as any[];
console.log(`TOTAL weapons in ALL_WEAPONS: ${w.length}`);

// 1) duplicate ids
const ids = w.map(x => x.id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log(`\n[1] DUPLICATE ids: ${dup.length ? [...new Set(dup)].join(', ') : 'none'}`);

// 2) category membership (category is typed `string`, so tsc can't catch drift)
const unknownCat = [...new Set(w.filter(x => !ALL_CATS.has(x.category)).map(x => `${x.id}:${x.category}`))];
console.log(`\n[2] category ∉ (WeaponCategory ∪ HybridCategory): ${unknownCat.length ? unknownCat.join(', ') : 'none'}`);

// 3) hybrid routing mis-route: a hybrid containing INT/WIS that the resolver routes to PHYSICAL
const route = (c: string) => MAGICAL_WEAPON_CATEGORIES.has(c) ? 'magic' : HYBRID_MIXED_CATEGORIES.has(c) ? 'hybrid' : 'physical';
const hybrids = w.filter(x => x.category && x.category.includes('_'));
const byCat: Record<string, number> = {};
hybrids.forEach(x => byCat[x.category] = (byCat[x.category]||0)+1);
console.log(`\n[3] hybrid categories USED in data (count): ${Object.entries(byCat).map(([k,v])=>`${k}×${v}`).join('  ')}`);
const misrouted = Object.keys(byCat).filter(c => {
  const stats = c.split('_');
  const hasMagic = stats.some(s => MAGICAL_STATS.has(s));
  return hasMagic && route(c) === 'physical';
});
console.log(`    → MIS-ROUTED (has INT/WIS but routes PHYSICAL → magic half mis-scales): ${misrouted.length ? misrouted.map(c=>`${c} (${byCat[c]} weapons, e.g. ${hybrids.find(x=>x.category===c)?.name})`).join(' | ') : 'none'}`);
const setOnlyDead = [...HYBRID_MIXED_CATEGORIES].filter(c => !ALL_CATS.has(c));
console.log(`    → HYBRID_MIXED_CATEGORIES entries NOT in the union (dead set members): ${setOnlyDead.join(', ')}`);
const unionMixedNotInSet = HYBRID_UNION.filter(c => c.split('_').some(s=>MAGICAL_STATS.has(s)) && route(c)==='physical');
console.log(`    → union hybrids w/ a magic stat that route PHYSICAL (whether or not data uses them): ${unionMixedNotInSet.join(', ')}`);

// 4) damageType(s) canonical?  (BaseWeapon.damageTypes: DamageType[])
const badDmg: string[] = [];
w.forEach(x => {
  const dts = x.damageTypes ?? (x.damageType ? [x.damageType] : []);
  dts.forEach((d: string) => { if (!DAMAGE_TYPES.includes(d)) badDmg.push(`${x.id}:${d}`); });
});
console.log(`\n[4] damageType ∉ canonical DamageType: ${badDmg.length ? [...new Set(badDmg)].join(', ') : 'none'}`);

// 5) category vs primaryStats consistency
const mismatch = w.filter(x => Array.isArray(x.primaryStats) && x.category && !x.category.includes('_') && (x.primaryStats.length !== 1 || x.primaryStats[0] !== x.category))
  .filter(x => x.primaryStats.join('_') !== x.category && [...x.primaryStats].sort().join('_') !== [...x.category.split('_')].sort().join('_'))
  .map(x => `${x.id}: cat=${x.category} primaryStats=[${x.primaryStats}]`);
console.log(`\n[5] category vs primaryStats divergence (sample ≤10): ${mismatch.length}`);
mismatch.slice(0,10).forEach(m => console.log('     '+m));

// 6) per-category counts + isUnique + maxOutputCap presence on base data
const catCount: Record<string, number> = {};
w.forEach(x => catCount[x.category] = (catCount[x.category]||0)+1);
console.log(`\n[6] per-category counts: ${Object.entries(catCount).sort().map(([k,v])=>`${k}:${v}`).join('  ')}`);
console.log(`    isUnique weapons: ${w.filter(x=>x.isUnique).length}; with primaryStats field: ${w.filter(x=>x.primaryStats).length}; with maxOutputCap on base: ${w.filter(x=>x.maxOutputCap!=null).length}`);
