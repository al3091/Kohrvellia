const { loadModule, DATA } = require('./extract.js');
const fs = require('fs');
const path = require('path');

// Load the master relic index
const relicMod = loadModule(path.join(DATA, 'items/deityRelics.ts'));
const ALL = relicMod.ALL_DEITY_RELICS || [];
console.log('=== ALL_DEITY_RELICS pairs:', ALL.length, '=> items:', ALL.length*2);
console.log('=== DEITY_RELICS_DESIGNED const:', relicMod.DEITY_RELICS_DESIGNED, '| TOTAL_ITEMS:', relicMod.DEITY_RELICS_TOTAL_ITEMS);

// All file deity ids (337)
const allFileIds = JSON.parse(fs.readFileSync(path.join(__dirname,'allfile_ids.json')));
const wiredIds = JSON.parse(fs.readFileSync(path.join(__dirname,'wired_ids.json')));
const fileIdSet = new Set(allFileIds.map(d=>d.id));
const wiredSet = new Set(wiredIds);

// Relic deityIds
const relicDeityIds = ALL.map(r => r.deityId);
const relicDeitySet = new Set(relicDeityIds);

// Duplicate relic pairs (same deityId twice)
const relicDupCount = {};
for (const id of relicDeityIds) relicDupCount[id]=(relicDupCount[id]||0)+1;
const relicDups = Object.entries(relicDupCount).filter(([id,c])=>c>1);
console.log('\n=== DUPLICATE relic pairs (same deityId >1):', relicDups.length, '===');
for (const [id,c] of relicDups) console.log('  ', id, 'x', c);

// Relics referencing NON-existent deity ids (not in any file)
console.log('\n=== RELICS whose deityId is NOT in any pantheon file (broken ref) ===');
const broken = relicDeityIds.filter(id => !fileIdSet.has(id));
const brokenUniq = [...new Set(broken)];
for (const id of brokenUniq) console.log('  relic deityId not found in files:', id);
console.log('  count:', brokenUniq.length);

// Relics referencing deities that EXIST in files but are NOT wired (maya/inca)
console.log('\n=== RELICS pointing to deities that exist but are EXCLUDED from allDeities (maya/inca) ===');
const orphanWire = relicDeityIds.filter(id => fileIdSet.has(id) && !wiredSet.has(id));
for (const id of [...new Set(orphanWire)]) {
  const f = allFileIds.find(d=>d.id===id);
  console.log('  ', id, '(in', f.file+', not wired)');
}
console.log('  count:', new Set(orphanWire).size);

// WIRED deities with NO relic at all
console.log('\n=== WIRED deities WITHOUT a relic pair (no deity relic exists) ===');
const noRelic = wiredIds.filter(id => !relicDeitySet.has(id));
console.log('  count:', noRelic.length, 'of', wiredIds.length, 'wired deities');
console.log('  sample (first 40):', noRelic.slice(0,40).join(', '));

// Now collect ALL sacred item IDs (relic weapon+accessory, domain artifacts, pantheon pieces) for global dup-id check
const items = [];
for (const r of ALL) { if (r.weapon) items.push({id:r.weapon.id, src:'relic_weapon', deityId:r.deityId}); if (r.accessory) items.push({id:r.accessory.id, src:'relic_accessory', deityId:r.deityId}); }
const domMod = loadModule(path.join(DATA, 'items/domainArtifacts.ts'));
for (const a of (domMod.DOMAIN_ARTIFACTS||[])) items.push({id:a.id, src:'domain', domainId:a.domainId});
const setMod = loadModule(path.join(DATA, 'items/pantheonSets/index.ts'));
for (const p of (setMod.ALL_PANTHEON_PIECES||[])) items.push({id:p.id, src:'pantheon_piece', pantheonId:p.pantheonId, setId:p.setId});

console.log('\n=== SACRED ITEM TOTALS ===');
console.log('  relic items:', items.filter(i=>i.src.startsWith('relic')).length);
console.log('  domain artifacts:', items.filter(i=>i.src==='domain').length);
console.log('  pantheon pieces:', items.filter(i=>i.src==='pantheon_piece').length);
console.log('  GRAND TOTAL sacred items:', items.length);

const itemIdCount = {};
for (const it of items) (itemIdCount[it.id]=itemIdCount[it.id]||[]).push(it.src);
const itemDups = Object.entries(itemIdCount).filter(([id,s])=>s.length>1);
console.log('\n=== DUPLICATE sacred item IDs (across ALL sacred items):', itemDups.length, '===');
for (const [id,s] of itemDups) console.log('  DUP item id:', id, '->', s.join(', '));

fs.writeFileSync(path.join(__dirname,'relic_ids.json'), JSON.stringify([...relicDeitySet]));
fs.writeFileSync(path.join(__dirname,'sacred_items.json'), JSON.stringify(items));
