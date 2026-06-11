const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'src/data');
const cache = {};

function loadModule(absPath) {
  if (cache[absPath]) return cache[absPath];
  const src = fs.readFileSync(absPath, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, esModuleInterop: true },
    fileName: absPath,
  }).outputText;
  const moduleObj = { exports: {} };
  cache[absPath] = moduleObj.exports; // pre-seed to break cycles
  const fakeRequire = (rel) => {
    if (rel.startsWith('.')) {
      let resolved = path.resolve(path.dirname(absPath), rel);
      for (const cand of [resolved + '.ts', path.join(resolved, 'index.ts'), resolved + '.tsx']) {
        if (fs.existsSync(cand)) return loadModule(cand);
      }
      return {};
    }
    return new Proxy(function(){}, { get: () => (() => ({})), apply: () => ({}) });
  };
  const ctx = { module: moduleObj, exports: moduleObj.exports, require: fakeRequire, console, Math, Object, Array, JSON };
  vm.createContext(ctx);
  try {
    vm.runInContext(out, ctx, { filename: absPath });
  } catch (e) {
    cache[absPath] = { __error: e.message + '\n' + (e.stack||'').split('\n').slice(0,3).join('\n') };
    return cache[absPath];
  }
  cache[absPath] = moduleObj.exports;
  return moduleObj.exports;
}

module.exports = { loadModule, DATA, ROOT };

if (require.main === module) {
  const pantheonDir = path.join(DATA, 'pantheons');
  const files = fs.readdirSync(pantheonDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  let grandTotal = 0;
  const allDeities = [];
  const perFile = {};
  for (const f of files) {
    const mod = loadModule(path.join(pantheonDir, f));
    if (mod.__error) { console.log('ERROR loading', f, mod.__error); continue; }
    const arrays = Object.entries(mod).filter(([k,v]) => Array.isArray(v));
    let fileDeities = [];
    for (const [k, arr] of arrays) {
      for (const d of arr) {
        if (d && typeof d === 'object' && d.id && d.pantheon) fileDeities.push(d);
      }
    }
    perFile[f] = { exportNames: Object.keys(mod), count: fileDeities.length };
    allDeities.push(...fileDeities.map(d => ({ id:d.id, name:d.name, pantheon:d.pantheon, domain:d.domain, personality:d.personality, __file: f })));
    grandTotal += fileDeities.length;
  }
  console.log('=== PER FILE deity counts (evaluated) ===');
  for (const [f, info] of Object.entries(perFile)) {
    console.log(f.padEnd(20), '| exports:', info.exportNames.join(','), '| deities:', info.count);
  }
  console.log('GRAND TOTAL deities (all 19 files):', grandTotal);
  fs.writeFileSync(path.join(__dirname,'all_deities.json'), JSON.stringify(allDeities));
  console.log('Wrote', allDeities.length, 'deities to all_deities.json');
}
