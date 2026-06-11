/* W3-DI 099 discharge: relic acquisition reachability + refint.
 * DATA imported (ground truth). DEAD-metric set transcribed from useSacredItemStore.evaluateRequirement
 * (the `return 0` cases, :206-255) + the 099 no-writer metrics (recordParagon/incrementEventSuccess/
 * incrementSkillUse all 0 callers). Classifier mirrors checkItemUnlockable (:260-276). */
import { ALL_DEITY_RELICS, DEITY_RELICS_DESIGNED, DEITY_RELICS_TOTAL_ITEMS } from '../src/data/items/deityRelics';
import { DOMAIN_ARTIFACTS } from '../src/data/items/domainArtifacts';
import { ALL_PANTHEON_PIECES } from '../src/data/items/pantheonSets/index';

const DEAD = new Set(['boss_noattack','boss_skillonly','floors_nodeath','floor_noconsumable','floor_nodefend','dodges_total','achievements_total','level_reached','stats_grade','same_weapon_run','debuffs_active_boss','sp_damage_dealt','custom','paragon','event_success','skill_uses','skill_sp_spent']);
const isDead = (req:any) => DEAD.has(req.metric) || (req.metric==='taunt_total' && req.targetType==='causes_enemy_flee');
const CANON_DMG = new Set(['slash','pierce','blunt','magic','holy','fire','ice','lightning','poison','dark']);

// flatten every SacredItem
const items:any[] = [];
(ALL_DEITY_RELICS as any[]).forEach(p => { if(p.weapon) items.push(p.weapon); if(p.accessory) items.push(p.accessory); });
(DOMAIN_ARTIFACTS as any[])?.forEach?.(a => items.push(a));
(ALL_PANTHEON_PIECES as any[])?.forEach?.(a => items.push(a));
console.log(`deity relic PAIRS: ${(ALL_DEITY_RELICS as any[]).length} (DESIGNED const=${DEITY_RELICS_DESIGNED}, TOTAL_ITEMS const=${DEITY_RELICS_TOTAL_ITEMS}) · domain artifacts: ${(DOMAIN_ARTIFACTS as any[])?.length} · pantheon pieces: ${(ALL_PANTHEON_PIECES as any[])?.length}`);
console.log(`TOTAL SacredItems flattened: ${items.length}`);

let unobtainable=0, falseUnlock=0, live=0, noReqs=0;
const unobtainableExamples:string[]=[], falseUnlockExamples:string[]=[];
for(const it of items){
  const acq = it.acquisition; const reqs = acq?.requirements ?? [];
  if(reqs.length===0){ noReqs++; continue; }
  const hardDead = reqs.filter((r:any)=> r.value>0 && isDead(r));
  const zeroDead = reqs.filter((r:any)=> r.value===0 && isDead(r));
  let unob=false;
  if(acq.requireAll!==false) unob = hardDead.length>0;            // requireAll: any dead+value>0 ⇒ unreachable
  else unob = reqs.every((r:any)=> isDead(r) && r.value>0);        // OR: all paths dead
  if(unob){ unobtainable++; if(unobtainableExamples.length<8) unobtainableExamples.push(`${it.id} [${hardDead.map((r:any)=>`${r.metric}≥${r.value}`).join(',')}]`); }
  else { live++; if(zeroDead.length>0){ falseUnlock++; if(falseUnlockExamples.length<8) falseUnlockExamples.push(`${it.id} [${zeroDead.map((r:any)=>`${r.metric}=0`).join(',')}]`); } }
}
console.log(`\n[099 DISCHARGE]`);
console.log(`  UNOBTAINABLE (dead-metric, value>0, requireAll/all-OR-paths-dead): ${unobtainable} / ${items.length} (${Math.round(100*unobtainable/items.length)}%)`);
console.log(`  FALSE-UNLOCK (value:0 'must-be-zero' on a dead metric auto-passes a challenge req): ${falseUnlock}`);
console.log(`  acquisition-reachable (has ≥1 live path): ${live} · items with NO requirements (framework/empty?): ${noReqs}`);
console.log(`  e.g. unobtainable: ${unobtainableExamples.join(' · ')}`);
console.log(`  e.g. false-unlock: ${falseUnlockExamples.join(' · ')}`);

// reveal gate (208): isSecret + revealFavorRequired read by 0 stores → hint never shown
const secret = items.filter(it=>it.isSecret).length;
const revealGated = items.filter(it=>it.revealFavorRequired!=null).length;
const reveal100 = items.filter(it=>it.revealFavorRequired===100).length;
console.log(`\n[208 reveal gate] isSecret: ${secret} · revealFavorRequired set: ${revealGated} (=100: ${reveal100}) — all double-locked (the reveal is read by 0 stores)`);

// refint
const dmgTypes = new Set<string>(); const badDmg:string[]=[];
items.forEach(it=>{ const d = it.weaponStats?.damageType; if(d){ dmgTypes.add(d); if(!CANON_DMG.has(d)) badDmg.push(`${it.id}:${d}`); }});
console.log(`\n[refint] weaponStats.damageType values: ${[...dmgTypes].join(', ')}`);
console.log(`  non-canonical damageType (206): ${badDmg.length} → e.g. ${[...new Set(badDmg.map(x=>x.split(':')[1]))].join(', ')}`);
const ids = items.map(it=>it.id); const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
console.log(`  dup SacredItem ids: ${dup.length?dup.slice(0,10).join(', ')+(dup.length>10?` …(${dup.length})`:''):'none'}`);
const passiveWithId = items.filter(it=>it.passiveId).length;
console.log(`  items with a passiveId (210 — needs a resolver): ${passiveWithId}`);
