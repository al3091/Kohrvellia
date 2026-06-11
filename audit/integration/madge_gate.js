/**
 * Circular-dependency ratchet gate (remediation B-02; KV-AUD-353).
 * Expects madge JSON on ./madge-report.json (the workflow writes it). Count may only go DOWN.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const baselines = JSON.parse(fs.readFileSync(path.join(here, 'baselines.json'), 'utf8'));
const cycles = JSON.parse(fs.readFileSync('madge-report.json', 'utf8'));
const n = Array.isArray(cycles) ? cycles.length : 0;
console.log(`circular dependencies: ${n} (max allowed: ${baselines.circularDepsMax})`);
if (n > baselines.circularDepsMax) {
  console.error('FAIL — new circular dependency introduced (KV-AUD-353 ratchet)');
  process.exit(1);
}
console.log('PASS');
