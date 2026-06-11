/* Layer C runner — validates game data against the zod schemas + does the cross-checks tsc can't:
 * duplicate IDs, defined-but-unused union members (dead data), and resistance/immunity redundancy.
 * Reusable: validateDataset() will be reused for deities/weapons/items/achievements as Wave 3 proceeds. */

import { ALL_BASE_MONSTERS, PREFIXES, SUFFIXES } from '../../src/data/monsters/baseMonsters';
import {
  baseMonsterSchema, monsterPrefixSchema, monsterSuffixSchema,
  MONSTER_ARMOR_TYPES, BEHAVIOR_PATTERNS, MONSTER_CATEGORIES, STATUS_EFFECT_IDS, DAMAGE_TYPES,
} from './monsters';

let hardErrors = 0;
const log = (...a: unknown[]) => console.log(...a);

function validateDataset<T>(label: string, items: T[], schema: any, getId: (t: T) => string) {
  log(`\n── ${label} (${items.length}) ──`);
  let ok = 0; const errs: string[] = [];
  for (const it of items) {
    const r = schema.safeParse(it);
    if (r.success) ok++;
    else for (const issue of r.error.issues) errs.push(`  ✗ ${getId(it)} · ${(issue.path.join('.') || '(root)')}: ${issue.message}`);
  }
  const seen = new Set<string>(); const dups = new Set<string>();
  for (const it of items) { const id = getId(it); if (seen.has(id)) dups.add(id); seen.add(id); }
  log(`  schema: ${ok}/${items.length} valid`);
  errs.forEach(e => log(e)); hardErrors += errs.length;
  if (dups.size) { hardErrors += dups.size; log(`  ✗ DUPLICATE IDS: ${[...dups].join(', ')}`); }
  if (!errs.length && !dups.size) log('  ✓ clean (schema + unique ids)');
}

log('================================================================');
log(' KOHRVELLIA DATA-INTEGRITY REPORT — W3-DC1 monsters (Layer C)');
log('================================================================');

validateDataset('Base monsters', ALL_BASE_MONSTERS, baseMonsterSchema, m => m.id);
validateDataset('Prefixes', PREFIXES, monsterPrefixSchema, p => p.id);
validateDataset('Suffixes', SUFFIXES, monsterSuffixSchema, s => s.id);

log('\n── Enum coverage (defined-but-UNUSED union members = dead data) ──');
const used = {
  armor: new Set(ALL_BASE_MONSTERS.map(m => m.armorType)),
  behav: new Set(ALL_BASE_MONSTERS.map(m => m.behaviorPattern)),
  cat: new Set(ALL_BASE_MONSTERS.map(m => m.category)),
  status: new Set(SUFFIXES.map(s => s.statusEffect).filter(Boolean)),
  dmg: new Set(ALL_BASE_MONSTERS.flatMap(m => [...m.damageTypes, ...m.weaknesses, ...m.resistances, ...m.immunities])),
};
const dead = (all: readonly string[], u: Set<unknown>) => all.filter(x => !u.has(x));
log(`  armorType  dead: ${dead(MONSTER_ARMOR_TYPES, used.armor).join(', ') || '(none)'}`);
log(`  behavior   dead: ${dead(BEHAVIOR_PATTERNS, used.behav).join(', ') || '(none)'}`);
log(`  category   dead: ${dead(MONSTER_CATEGORIES, used.cat).join(', ') || '(none)'}`);
log(`  statusEff  dead (in suffixes): ${dead(STATUS_EFFECT_IDS, used.status).join(', ') || '(none)'}`);
log(`  damageType dead: ${dead(DAMAGE_TYPES, used.dmg).join(', ') || '(none)'}`);

log('\n── Redundancy warnings (a type in BOTH resistances and immunities; immunity already negates) ──');
let redundant = 0;
for (const m of ALL_BASE_MONSTERS) {
  const both = m.resistances.filter(r => m.immunities.includes(r));
  if (both.length) { redundant++; log(`  ⚠ ${m.id}: [${both.join(', ')}] in both resistances AND immunities`); }
}
if (!redundant) log('  ✓ none');

const lootRefs = [...new Set(ALL_BASE_MONSTERS.map(m => m.lootTable))].sort();
log(`\n── lootTable refs (${lootRefs.length}) — cross-check vs lootPools pending (W3-DPr5):`);
log('  ' + lootRefs.join(', '));

log('\n================================================================');
log(` SUMMARY: ${hardErrors} hard error(s), ${redundant} redundancy warning(s).`);
log('================================================================');
process.exitCode = hardErrors > 0 ? 1 : 0;
