const { loadModule, DATA } = require('./extract.js');
const fs = require('fs');
const path = require('path');

const pantheonDir = path.join(DATA, 'pantheons');
const files = fs.readdirSync(pantheonDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

for (const f of files) {
  const mod = loadModule(path.join(pantheonDir, f));
  console.log('=====', f, '=====');
  for (const [k, v] of Object.entries(mod)) {
    if (Array.isArray(v)) {
      const isDeityArr = v.length>0 && v[0] && v[0].pantheon;
      console.log('  export', k, ': Array len', v.length, isDeityArr ? '(Deity[])' : '(other[])');
    } else if (v && typeof v === 'object') {
      // could be Pantheon interface
      const keys = Object.keys(v);
      console.log('  export', k, ': object {', keys.join(','), '}');
    } else {
      console.log('  export', k, ':', typeof v, JSON.stringify(v).slice(0,40));
    }
  }
}
