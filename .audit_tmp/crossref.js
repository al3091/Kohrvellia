const { loadModule, DATA } = require('./extract.js');
const fs = require('fs');
const path = require('path');

// ----- Valid enums from types -----
const VALID_DOMAINS = ['war','magic','trickery','death','fortune','nature','wisdom','craft','authority','life','sea','sky','fire','knowledge'];
const VALID_PANTHEONS = ['greek','norse','egyptian','japanese','celtic','mesopotamian','hindu','chinese','slavic','aztec','maya','inca','yoruba','polynesian','persian','vodou','shinto','ars_goetia','fallen_angels'];
const VALID_PERSONALITIES = ['encouraging','stern','mysterious','playful','wrathful','serene','chaotic','gentle','aggressive','wise','ancient','passionate','benevolent','dark','calculating'];

// ----- Load index.ts to get the REAL allDeities -----
const idx = loadModule(path.join(DATA, 'pantheons/index.ts'));
const allDeities = idx.allDeities || [];
const pantheonMap = idx.pantheonMap || {};
console.log('=== index.ts: allDeities.length =', allDeities.length);
console.log('=== index.ts: pantheonMap keys =', Object.keys(pantheonMap).join(','));
console.log('=== index.ts: totalDeityCount =', idx.totalDeityCount);

// ----- Build set of all deity ids that EXIST in files (all 19) -----
const pantheonDir = path.join(DATA, 'pantheons');
const files = fs.readdirSync(pantheonDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const allFileDeities = []; // {id, file, domain, pantheon, personality}
const canonicalExportFor = {
  'arsGoetia.ts':'arsGoetiaPantheon','aztec.ts':'aztecPantheon','celtic.ts':'celticPantheon',
  'chinese.ts':'chinesePantheon','egyptian.ts':'egyptianPantheon','fallenAngels.ts':'fallenAngelsPantheon',
  'greek.ts':'greekPantheon','hindu.ts':'hinduPantheon','inca.ts':'incaPantheon','japanese.ts':'japanesePantheon',
  'maya.ts':'mayaPantheon','mesopotamian.ts':'mesopotamianPantheon','norse.ts':'norsePantheon','persian.ts':'persianPantheon',
  'polynesian.ts':'polynesianPantheon','shinto.ts':'shintoPantheon','slavic.ts':'slavicPantheon','vodou.ts':'vodouPantheon','yoruba.ts':'yorubaPantheon'
};
for (const f of files) {
  const mod = loadModule(path.join(pantheonDir, f));
  const arr = mod[canonicalExportFor[f]] || [];
  for (const d of arr) allFileDeities.push({ id:d.id, file:f, domain:d.domain, pantheon:d.pantheon, personality:d.personality, name:d.name });
}
console.log('=== TOTAL deities across all 19 files (canonical exports):', allFileDeities.length);

// ----- Duplicate deity IDs across all files -----
const idCount = {};
for (const d of allFileDeities) { (idCount[d.id] = idCount[d.id] || []).push(d.file); }
const dupIds = Object.entries(idCount).filter(([id,files]) => files.length>1);
console.log('\n=== DUPLICATE deity IDs across all 19 files:', dupIds.length, '===');
for (const [id, fs] of dupIds) console.log('  DUP id:', id, 'in', fs.join(', '));

// ----- Duplicate IDs within allDeities (the wired set) -----
const wiredIdCount = {};
for (const d of allDeities) { wiredIdCount[d.id] = (wiredIdCount[d.id]||0)+1; }
const wiredDups = Object.entries(wiredIdCount).filter(([id,c])=>c>1);
console.log('\n=== DUPLICATE deity IDs within wired allDeities:', wiredDups.length, '===');
for (const [id,c] of wiredDups) console.log('  DUP', id, 'x', c);

// ----- Invalid domains -----
console.log('\n=== INVALID domain values (all files) ===');
const badDomains = allFileDeities.filter(d => !VALID_DOMAINS.includes(d.domain));
const badDomSummary = {};
for (const d of badDomains) { const k = `${d.domain} (${d.file})`; badDomSummary[k]=(badDomSummary[k]||0)+1; }
for (const [k,c] of Object.entries(badDomSummary)) console.log('  ', k, 'x', c);
console.log('  total deities with invalid domain:', badDomains.length);

// ----- Invalid personalities -----
console.log('\n=== INVALID personality values (all files) ===');
const badPers = allFileDeities.filter(d => !VALID_PERSONALITIES.includes(d.personality));
const badPersSummary = {};
for (const d of badPers) { const k = `${d.personality} (${d.file})`; badPersSummary[k]=(badPersSummary[k]||0)+1; }
for (const [k,c] of Object.entries(badPersSummary)) console.log('  ', k, 'x', c);
console.log('  total deities with invalid personality:', badPers.length);

// ----- pantheon field vs file mismatch -----
console.log('\n=== pantheon FIELD vs filename mismatch ===');
const fileToPantheon = {arsGoetia:'ars_goetia', fallenAngels:'fallen_angels'};
let mism=0;
for (const d of allFileDeities) {
  const base = d.file.replace('.ts','');
  const expected = fileToPantheon[base] || base;
  if (d.pantheon !== expected) { console.log('  ', d.id, 'in', d.file, 'has pantheon:', d.pantheon, '(expected', expected+')'); mism++; }
}
console.log('  total pantheon-field mismatches:', mism);

// Save wired ids + all file ids for relic cross-ref
fs.writeFileSync(path.join(__dirname,'wired_ids.json'), JSON.stringify(allDeities.map(d=>d.id)));
fs.writeFileSync(path.join(__dirname,'allfile_ids.json'), JSON.stringify(allFileDeities.map(d=>({id:d.id,file:d.file}))));
console.log('\nSaved wired_ids.json (', allDeities.length, ') and allfile_ids.json (', allFileDeities.length, ')');
