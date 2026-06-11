const { loadModule, DATA } = require('./extract.js');
const fs = require('fs');
const path = require('path');

// Metrics that ALWAYS return 0 in evaluateRequirement (from useSacredItemStore.ts:193-257)
// (return 0 unconditionally, regardless of targetType)
const ALWAYS_ZERO = new Set([
  'boss_noattack','boss_skillonly','floors_nodeath','floor_noconsumable','floor_nodefend',
  'dodges_total','achievements_total','level_reached','stats_grade','same_weapon_run',
  'debuffs_active_boss','sp_damage_dealt','custom'
]);
// Metrics zero only for certain targetType
const CONDITIONAL_ZERO = {
  'taunt_total': ['causes_enemy_flee'],  // returns 0 for this targetType
};

// Gather all sacred items
const relicMod = loadModule(path.join(DATA, 'items/deityRelics.ts'));
const domMod = loadModule(path.join(DATA, 'items/domainArtifacts.ts'));
const setMod = loadModule(path.join(DATA, 'items/pantheonSets/index.ts'));

const items = [];
for (const r of (relicMod.ALL_DEITY_RELICS||[])) {
  if (r.weapon) items.push(r.weapon);
  if (r.accessory) items.push(r.accessory);
}
for (const a of (domMod.DOMAIN_ARTIFACTS||[])) items.push(a);
for (const p of (setMod.ALL_PANTHEON_PIECES||[])) items.push(p);

console.log('Total sacred items examined:', items.length);

// For each item, examine acquisition. With requireAll=true, if ANY required req (value>0) uses an always-zero metric, item can NEVER unlock.
// With requireAll=false (OR), item is unlockable only if at least ONE req uses a live metric.
const deadItems = [];
const metricUsage = {};
for (const it of items) {
  const acq = it.acquisition || {};
  const reqs = acq.requirements || [];
  for (const rq of reqs) { metricUsage[rq.metric] = (metricUsage[rq.metric]||0)+1; }
  const requireAll = acq.requireAll;
  if (requireAll) {
    // dead if any req with value>0 uses always-zero metric (value 0 reqs are "must be zero" which 0===0 passes)
    const blocking = reqs.filter(rq => rq.value > 0 && ALWAYS_ZERO.has(rq.metric));
    if (blocking.length) deadItems.push({id:it.id, name:it.name, tier:it.tier, reason:'AND-blocked', metrics:blocking.map(b=>`${b.metric}(v=${b.value})`)});
  } else {
    // OR: dead only if EVERY req uses always-zero metric (or value 0 weirdness)
    const liveReqs = reqs.filter(rq => !(ALWAYS_ZERO.has(rq.metric) && rq.value>0));
    if (reqs.length>0 && liveReqs.length===0) deadItems.push({id:it.id, name:it.name, tier:it.tier, reason:'OR-all-dead', metrics:reqs.map(b=>b.metric)});
  }
}

console.log('\n=== METRIC USAGE across all sacred item requirements ===');
for (const [m,c] of Object.entries(metricUsage).sort((a,b)=>b[1]-a[1])) {
  const flag = ALWAYS_ZERO.has(m) ? ' <== ALWAYS RETURNS 0' : '';
  console.log('  ', m.padEnd(26), c, flag);
}

console.log('\n=== SACRED ITEMS PERMANENTLY UNOBTAINABLE (gated behind always-zero metric) ===');
console.log('  count:', deadItems.length);
for (const d of deadItems) {
  console.log(`  [${d.tier}] ${d.id} "${d.name}" -- ${d.reason}: ${d.metrics.join(', ')}`);
}

// Which always-zero metrics are actually USED (and thus block items)?
console.log('\n=== Always-zero metrics that ARE referenced by items ===');
for (const m of ALWAYS_ZERO) {
  if (metricUsage[m]) console.log('  ', m, '-> used by', metricUsage[m], 'requirement(s)');
}
console.log('\n=== Always-zero metrics NEVER referenced (dead enum, no item impact) ===');
for (const m of ALWAYS_ZERO) {
  if (!metricUsage[m]) console.log('  ', m);
}
