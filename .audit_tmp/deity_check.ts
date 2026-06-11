import { allDeities, pantheonMap, totalDeityCount } from '../src/data/pantheons';
import { ALL_DEITY_RELICS } from '../src/data/items/deityRelics';
const DOMAINS = new Set(['war','magic','trickery','death','fortune','nature','wisdom','craft','authority','life','sea','sky','fire','knowledge']);
const STATS = new Set(['STR','AGI','PER','INT','WIS','CHA','END','LCK']);
const D = allDeities as any[];
console.log(`totalDeityCount: ${totalDeityCount} across ${Object.keys(pantheonMap).length} ACTIVE pantheons (maya/inca excluded)`);
console.log(`per-pantheon: ${Object.entries(pantheonMap).map(([k,v])=>`${k}:${(v as any[]).length}`).join('  ')}`);
const ids = D.map(d=>d.id); const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
console.log(`\n[refint] dup deity ids: ${dup.length?dup.join(','):'none'}`);
const badDom = D.filter(d=>!DOMAINS.has(d.domain)).map(d=>`${d.id}:${d.domain}`);
console.log(`deity.domain ∉ 14 DeityDomain: ${badDom.length?badDom.join(', '):'none ✓'}`);
const badStat = D.filter(d=>!STATS.has(d.statBonus?.stat)||!STATS.has(d.statPenalty?.stat)).map(d=>d.id);
console.log(`statBonus/Penalty stat invalid: ${badStat.length?badStat.slice(0,10).join(','):'none ✓'}`);
// domain coverage
const domCount:Record<string,number>={}; D.forEach(d=>domCount[d.domain]=(domCount[d.domain]||0)+1);
console.log(`domain coverage (of 14): ${Object.keys(domCount).length}/14 used → ${[...DOMAINS].filter(x=>!domCount[x]).length?'MISSING: '+[...DOMAINS].filter(x=>!domCount[x]).join(','):'all 14 covered'}`);
// ★ relic→deity cross-check (discharges the DI-deferred refint)
const deitySet = new Set(ids);
const relicDeityIds = [...new Set((ALL_DEITY_RELICS as any[]).map(p=>p.deityId))];
const dangling = relicDeityIds.filter(id=>!deitySet.has(id));
console.log(`\n[★ relic→deity] ${relicDeityIds.length} distinct relic deityIds; resolve in allDeities: ${relicDeityIds.length-dangling.length}/${relicDeityIds.length}`);
console.log(`  DANGLING relic deityIds (relic exists for a deity NOT in any active pantheon): ${dangling.length} → ${dangling.slice(0,20).join(', ')}${dangling.length>20?` …(+${dangling.length-20})`:''}`);
// inverse: deities with NO relic
const relicSet = new Set(relicDeityIds);
const noRelic = ids.filter(id=>!relicSet.has(id));
console.log(`  deities WITH a relic: ${ids.filter(id=>relicSet.has(id)).length}/${totalDeityCount} (without: ${noRelic.length})`);
