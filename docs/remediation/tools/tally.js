#!/usr/bin/env node
/**
 * B1 — machine-regenerated severity tally (D6).
 * Sources: the CANON findings/*.md headers (severity-as-filed) + the REMEDIATION_LEDGER register
 * (current status / current severity). Never reads ALL_FINDINGS §4 (OBS-8: it drifts from canon).
 *
 * Run from repo root:  node docs/remediation/tools/tally.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..'); // Kohrvellia/
const CANON_DIR = path.join(ROOT, 'docs', 'audit', 'findings');
const LEDGER = path.join(ROOT, 'docs', 'remediation', 'REMEDIATION_LEDGER.md');

// ---------- 1) Canon: severity-as-filed per ID ----------
const canon = {}; // id -> { sev, file, dup: [] }
for (const f of fs.readdirSync(CANON_DIR).filter(x => x.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(CANON_DIR, f), 'utf8');
  // match headers ANYWHERE in a line (catches the inline 164), not just line-start
  const re = /\*\*KV-AUD-(\d{3})\s*(\[[^\]]*\])?\s*\|([^|]*)\|([^|]*)\|/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const id = m[1];
    // severity lives in the 1st or 2nd pipe field; keep strikethrough content (as-filed)
    const fields = [m[3], m[4]].map(s => s.replace(/~~/g, ' '));
    let sev = null;
    for (const fld of fields) {
      const sm = fld.match(/\b(S[0-4]|Info)\b/);
      if (sm) { sev = sm[1]; break; }
    }
    if (!sev) sev = 'UNPARSED';
    if (canon[id]) canon[id].dup.push(f); // e.g. 106 double-header
    else canon[id] = { sev, file: f, dup: [] };
  }
}

// ---------- 2) Register: current status + severity per ID ----------
const ledger = fs.readFileSync(LEDGER, 'utf8');
// register rows: | 001 | S0 | CONFIRMED | S0 | ... — only inside the FINDINGS REGISTER section
const regStart = ledger.indexOf('## FINDINGS REGISTER');
const regText = ledger.slice(regStart);
const reg = {}; // id -> { sevAud, status, sevNow }
const rowRe = /^\|\s*(\d{3})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/gm;
let r;
while ((r = rowRe.exec(regText)) !== null) {
  const id = r[1];
  if (reg[id]) { console.error(`DUP register row: ${id}`); continue; }
  reg[id] = {
    sevAud: r[2].trim().replace(/\*/g, ''),
    status: r[3].trim().replace(/\*/g, ''),
    sevNow: r[4].trim().replace(/\*/g, ''),
  };
}

// ---------- 3) Tallies ----------
const count = (obj) => { const t = {}; for (const v of Object.values(obj)) t[v] = (t[v] || 0) + 1; return t; };

const canonIds = Object.keys(canon).sort();
const regIds = Object.keys(reg).sort();
console.log(`canon unique IDs: ${canonIds.length} (expect 332)`);
console.log(`register rows:    ${regIds.length} (expect 371)`);
const dups = canonIds.filter(id => canon[id].dup.length);
if (dups.length) console.log(`canon double-headers: ${dups.map(d => d + '(' + canon[d].dup.join() + ')').join(', ')}`);

// as-filed tally (canon; seeds 003-041 sourced from the register's Sev@aud, which A1 transcribed from 02)
const asFiled = {};
for (const id of regIds) {
  const sev = canon[id] ? canon[id].sev : reg[id].sevAud; // seed-only IDs fall back to register
  asFiled[id] = sev;
}
console.log('\n== SEVERITY AS-FILED (canon headers; seeds from 02 via register) ==');
console.log(count(asFiled));

// canon-vs-register cross-check (transcription QA)
const mismatch = [];
for (const id of canonIds) {
  if (!reg[id]) { mismatch.push(`${id}: in canon, MISSING from register`); continue; }
  const a = canon[id].sev, b = reg[id].sevAud;
  if (a !== 'UNPARSED' && a !== b) mismatch.push(`${id}: canon=${a} register=${b} (${canon[id].file})`);
}
console.log('\n== canon-vs-register Sev@aud mismatches ==');
console.log(mismatch.length ? mismatch.join('\n') : 'NONE');
const unparsed = canonIds.filter(id => canon[id].sev === 'UNPARSED');
if (unparsed.length) console.log(`UNPARSED canon headers: ${unparsed.join(', ')}`);

// current tally: live defect rows only
const LIVE = new Set(['CONFIRMED', 'REFINED', 'DOWNGRADED', 'LATENT', 'NEEDS-REPRO', 'PART-CONF', 'REVISED', 'LIKELY']);
const GONE = new Set(['SUPERSEDED', 'REFUTED', 'MERGED', 'RESOLVED']);
const live = {}, statuses = {};
let positives = 0;
for (const id of regIds) {
  const { status, sevNow } = reg[id];
  statuses[status] = (statuses[status] || 0) + 1;
  if (status === 'POSITIVE') { positives++; continue; }
  if (LIVE.has(status)) live[id] = sevNow;
  else if (!GONE.has(status)) console.log(`(unclassified status: ${id} ${status})`);
}
console.log('\n== STATUS distribution (all 371) ==');
console.log(statuses);
console.log('\n== CURRENT LIVE-DEFECT tally (CONFIRMED/REFINED/DOWNGRADED/LATENT/NEEDS-REPRO/PART-CONF/REVISED) ==');
console.log(count(live));
console.log(`POSITIVE (verified-good): ${positives}`);
console.log('\n== live S1/S0 rows ==');
for (const [id, s] of Object.entries(live)) if (s === 'S0' || s === 'S1') console.log(`  ${id}: ${s} (${reg[id].status})`);
