/**
 * Referential-integrity CI gates (remediation B-02; KV-AUD-013/321/337/344/348-class regressions).
 * Imports the REAL data barrels (ground truth, no transcription) and asserts against the ratcheted
 * baselines in ./baselines.json. Exit 1 on any regression. Run: ./audit/node_modules/.bin/tsx audit/integration/refint_gates.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { ALL_ACHIEVEMENTS } from '../../src/data/achievements';
import { ALL_DEITY_RELICS } from '../../src/data/items/deityRelics';
import { DOMAIN_ARTIFACTS } from '../../src/data/items/domainArtifacts';
import { ALL_PANTHEON_PIECES } from '../../src/data/items/pantheonSets/index';
import { JOB_DEFINITIONS, JOB_SPECIALIZATIONS } from '../../src/data/jobs';
import { makeJobKey } from '../../src/types/Job';
import { ALL_WEAPONS } from '../../src/data/weapons';
import { ALL_BASE_MONSTERS } from '../../src/data/monsters/baseMonsters';
import { MONSTER_ASCII } from '../../src/data/monsters/monsterArt';
import { allDeities } from '../../src/data/pantheons';
import { getMilestoneBoss } from '../../src/data/bosses/milestoneBosses';

const B = JSON.parse(fs.readFileSync(path.join(__dirname, 'baselines.json'), 'utf8'));
let failures = 0;
const gate = (name: string, ok: boolean, detail: string) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (${detail})`);
  if (!ok) failures++;
};
const dups = (ids: string[]) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
const CANON_DMG = new Set(['slash', 'pierce', 'blunt', 'magic', 'holy', 'fire', 'ice', 'lightning', 'poison', 'dark']);

// ---- achievements ----
{
  const a = ALL_ACHIEVEMENTS as any[];
  const FIRED = new Set<string>(B.achievementsFiredTypes);
  const uncompletable = a.filter((x) => {
    const reqs = x.requirements || [];
    if (reqs.length === 0) return false;
    const dead = reqs.filter((r: any) => !FIRED.has(r.type));
    return x.requireAll !== false ? dead.length > 0 : dead.length === reqs.length;
  });
  gate('achievements.total', a.length >= B.achievements.totalMin, `${a.length} >= ${B.achievements.totalMin}`);
  gate('achievements.dupIds', dups(a.map((x) => x.id)).length <= B.achievements.dupIdsMax, `${dups(a.map((x) => x.id)).length}`);
  gate('achievements.uncompletable', uncompletable.length <= B.achievements.uncompletableMax, `${uncompletable.length} <= ${B.achievements.uncompletableMax}`);
}

// ---- boss outcome achievement refs (the KV-AUD-321 class) ----
// Source-scan (the audit's method): the outcomes live inside conversation closures that take a
// PlayerSnapshot, so a runtime object-walk can't see them. Also sanity-check the roster via import.
{
  for (let f = 5; f <= 100; f += 5) if (!getMilestoneBoss(f)) { gate('bosses.rosterComplete', false, `floor ${f} has no boss`); }
  const bossDir = path.join(__dirname, '..', '..', 'src', 'data', 'bosses');
  const src = ['milestoneBosses.ts', 'milestoneBossesFloors30to60.ts', 'milestoneBossesFloors65to100.ts']
    .map((f) => fs.readFileSync(path.join(bossDir, f), 'utf8')).join('\n');
  const outcomeIds = new Set([...src.matchAll(/achievement:\s*'([^']+)'/g)].map((m) => m[1]));
  const achIds = new Set((ALL_ACHIEVEMENTS as any[]).map((x) => x.id));
  const present = [...outcomeIds].filter((id) => achIds.has(id));
  gate('bosses.outcomeIdsPresent', present.length >= B.achievements.bossOutcomeIdsPresentMin, `${present.length}/${outcomeIds.size} resolve`);
}

// ---- sacred relics ----
{
  const items: any[] = [];
  (ALL_DEITY_RELICS as any[]).forEach((p) => { if (p.weapon) items.push(p.weapon); if (p.accessory) items.push(p.accessory); });
  items.push(...(DOMAIN_ARTIFACTS as any[]), ...(ALL_PANTHEON_PIECES as any[]));
  const deityIds = new Set((allDeities as any[]).map((d) => d.id));
  const relicDeityIds = [...new Set((ALL_DEITY_RELICS as any[]).map((p) => p.deityId))];
  const resolved = relicDeityIds.filter((id) => deityIds.has(id));
  const nonCanon = items.filter((i) => i.weaponStats && !CANON_DMG.has(i.weaponStats.damageType));
  gate('relics.items', items.length >= B.relics.itemsMin, `${items.length}`);
  gate('relics.dupIds', dups(items.map((i) => i.id)).length <= B.relics.dupIdsMax, `${dups(items.map((i) => i.id)).length}`);
  gate('relics.deityRefs', resolved.length >= B.relics.deityRefsResolvedMin, `${resolved.length}/${relicDeityIds.length} resolve`);
  gate('relics.nonCanonDamage', nonCanon.length <= B.relics.nonCanonicalDamageTypeMax, `${nonCanon.length} <= ${B.relics.nonCanonicalDamageTypeMax}`);
}

// ---- jobs ----
{
  const J = JOB_DEFINITIONS as any[];
  const S = JOB_SPECIALIZATIONS as any[];
  const STATS = ['STR', 'AGI', 'PER', 'INT', 'WIS', 'CHA', 'END', 'LCK'];
  const triples: string[] = [];
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) for (let k = j + 1; k < 8; k++) triples.push([STATS[i], STATS[j], STATS[k]].sort().join('+'));
  const covered = new Set(J.map((x) => makeJobKey(x.statRequirements)));
  gate('jobs.base', J.length >= B.jobs.baseMin, `${J.length}`);
  gate('jobs.dupIds', dups([...J, ...S].map((x) => x.id)).length <= B.jobs.dupIdsMax, `${dups([...J, ...S].map((x) => x.id)).length} <= ${B.jobs.dupIdsMax}`);
  gate('jobs.triplesCovered', triples.filter((t) => covered.has(t)).length >= B.jobs.triplesCoveredMin, `${triples.filter((t) => covered.has(t)).length}/56`);
}

// ---- weapons ----
{
  const W = ALL_WEAPONS as any[];
  const nonCanon = W.filter((w) => (w.damageTypes || []).some((d: string) => !CANON_DMG.has(d)));
  gate('weapons.total', W.length >= B.weapons.totalMin, `${W.length}`);
  gate('weapons.dupIds', dups(W.map((w) => w.id)).length <= B.weapons.dupIdsMax, `${dups(W.map((w) => w.id)).length}`);
  gate('weapons.nonCanonDamage', nonCanon.length <= B.weapons.nonCanonicalDamageTypeMax, `${nonCanon.length}`);
}

// ---- monsters ----
{
  const M = ALL_BASE_MONSTERS as any[];
  const art = Object.keys(MONSTER_ASCII as object);
  const withArt = M.filter((m) => art.includes(m.id));
  const contradictions = M.filter((m) => (m.weaknesses || []).some((w: string) => (m.immunities || []).includes(w)));
  gate('monsters.total', M.length >= B.monsters.totalMin, `${M.length}`);
  gate('monsters.artCoverage', withArt.length >= B.monsters.artCoveredMin, `${withArt.length}/${M.length}`);
  gate('monsters.weakImmuneContradictions', contradictions.length <= B.monsters.weakImmuneContradictionsMax, `${contradictions.map((m) => m.id).join(',') || 'none'}`);
}

// ---- deities ----
{
  const D = allDeities as any[];
  gate('deities.total', D.length >= B.deities.totalMin, `${D.length}`);
  gate('deities.dupIds', dups(D.map((d) => d.id)).length <= B.deities.dupIdsMax, `${dups(D.map((d) => d.id)).length} <= ${B.deities.dupIdsMax}`);
}

console.log(failures ? `\n${failures} gate(s) FAILED` : '\nALL REFINT GATES PASS');
process.exit(failures ? 1 : 0);
