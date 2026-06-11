import { ALL_ACHIEVEMENTS } from '../src/data/achievements';
const FIRED = new Set(['custom','floor_reach','stat_reach','kill_count','damage_taken','damage_dealt','shrine_blessing','gold_earn','elite_kill','boss_kill']);
const DEAD  = ['kill_type','floor_return','no_damage','low_hp_win','item_collect','reputation','skill_use','status_inflict','stealth_kills','flee_success','no_consumables'];
const a = ALL_ACHIEVEMENTS as any[];
console.log(`TOTAL achievements: ${a.length}`);
// dup ids
const ids=a.map(x=>x.id); const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
console.log(`dup ids: ${dup.length?dup.join(','):'none'}`);
// uncompletable: requireAll → any req dead; else → all reqs dead
function uncompletable(x:any){const reqs=x.requirements||[];const deadHits=reqs.filter((r:any)=>!FIRED.has(r.type));if(reqs.length===0)return false;return x.requireAll!==false ? deadHits.length>0 : deadHits.length===reqs.length;}
const dead = a.filter(uncompletable);
console.log(`\nUNCOMPLETABLE (dead requirement type): ${dead.length} / ${a.length} (${Math.round(100*dead.length/a.length)}%)`);
// by tier
const byTier:Record<string,number>={}; dead.forEach(x=>byTier[x.tier]=(byTier[x.tier]||0)+1);
console.log(`  by tier: ${Object.entries(byTier).map(([k,v])=>`${k}:${v}`).join('  ')}`);
// by targetLevel
const byLvl:Record<number,number>={}; dead.forEach(x=>byLvl[x.targetLevel]=(byLvl[x.targetLevel]||0)+1);
console.log(`  by targetLevel: ${Object.entries(byLvl).sort().map(([k,v])=>`L${k}:${v}`).join('  ')}`);
// which dead types, count of achievements using each (in any req)
const typeUse:Record<string,number>={}; DEAD.forEach(t=>typeUse[t]=a.filter(x=>(x.requirements||[]).some((r:any)=>r.type===t)).length);
console.log(`  dead-type usage (achievements referencing each): ${Object.entries(typeUse).filter(([,v])=>v>0).map(([k,v])=>`${k}:${v}`).join('  ')}`);
console.log(`  dead types with ZERO usage (defined but unused even in data): ${Object.entries(typeUse).filter(([,v])=>v===0).map(([k])=>k).join(', ')||'none'}`);
// standard-tier uncompletable (these auto-unlock yet can't complete)
const stdDead = dead.filter(x=>x.tier==='standard');
console.log(`\nSTANDARD-tier uncompletable (auto-discovered, never completable): ${stdDead.length} -> ${stdDead.map(x=>x.id).slice(0,12).join(', ')}`);
// custom achievements (completion depends on the 6 custom call sites)
const custom = a.filter(x=>(x.requirements||[]).some((r:any)=>r.type==='custom'));
console.log(`\ncustom-type achievements: ${custom.length} (completion needs a matching custom call-site; updateProgress('custom') is type-blind)`);
// discoverySource distribution (130)
const ds:Record<string,number>={}; a.forEach(x=>ds[x.discoverySource||'(none)']=(ds[x.discoverySource||'(none)']||0)+1);
console.log(`discoverySource: ${Object.entries(ds).map(([k,v])=>`${k}:${v}`).join('  ')}`);
// 321 cross-check: boss achievement ids
const boss=['skaer_fuur_remembered','kohr_uwa_split_resolved','haitt_lox_war_read','ulfkon_naa_stayed','vituna_sta_endured','ekva_baniyata_cycle_read','kohr_ilskae_mirror','skaervox_anomaly','vanya_the_understood','walked_past_death'];
console.log(`\n[321] boss achievement ids in registry: ${boss.filter(b=>ids.includes(b)).length}/${boss.length} -> present: ${boss.filter(b=>ids.includes(b)).join(', ')}`);
