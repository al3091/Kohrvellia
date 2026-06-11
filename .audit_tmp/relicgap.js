const fs = require('fs');
const path = require('path');
const wiredIds = JSON.parse(fs.readFileSync(path.join(__dirname,'wired_ids.json')));
const allFileIds = JSON.parse(fs.readFileSync(path.join(__dirname,'allfile_ids.json')));
const relicIds = new Set(JSON.parse(fs.readFileSync(path.join(__dirname,'relic_ids.json'))));
const id2file = {}; for (const d of allFileIds) id2file[d.id]=d.file;

// Per pantheon: how many wired deities, how many have relics
const byPan = {};
for (const id of wiredIds) {
  const f = id2file[id] || '??';
  byPan[f] = byPan[f] || {total:0, withRelic:0, missing:[]};
  byPan[f].total++;
  if (relicIds.has(id)) byPan[f].withRelic++; else byPan[f].missing.push(id);
}
console.log('=== Relic coverage per wired pantheon file ===');
for (const [f,info] of Object.entries(byPan)) {
  console.log(f.padEnd(18), 'wired:', String(info.total).padStart(3), 'withRelic:', String(info.withRelic).padStart(3), 'MISSING:', info.total-info.withRelic);
}

// relic ids that are bosses (not in files)
const bossRelics = ['vanya','sorath','kutcher','kalindi','malik'];
console.log('\n=== Boss relic deityIds present in files? ===');
for (const b of bossRelics) console.log('  ', b, id2file[b] ? 'IN '+id2file[b] : 'NOT IN ANY FILE');
