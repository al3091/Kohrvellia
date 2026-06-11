import { JOB_DEFINITIONS, JOB_SPECIALIZATIONS } from '../src/data/jobs';
import { makeJobKey } from '../src/types/Job';
const STATS=['STR','AGI','PER','INT','WIS','CHA','END','LCK'];
const J=JOB_DEFINITIONS as any[], S=JOB_SPECIALIZATIONS as any[];
console.log(`base jobs: ${J.length} · specializations: ${S.length}`);
// dup ids
const ids=[...J,...S].map(x=>x.id); const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
console.log(`dup ids: ${dup.length?dup.join(','):'none'}`);
// triple coverage: all C(8,3)=56?
const triples:string[]=[]; for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)for(let k=j+1;k<8;k++)triples.push([STATS[i],STATS[j],STATS[k]].sort().join('+'));
const covered=new Set(J.map(x=>makeJobKey(x.statRequirements)));
const missing=triples.filter(t=>!covered.has(t));
console.log(`\nstat-triple coverage: ${covered.size}/56 covered; ${missing.length} MISSING (those builds get NO job)`);
console.log(`  missing triples: ${missing.join('  ')}`);
// jobs per covered triple
const perTriple:Record<string,number>={}; J.forEach(x=>{const k=makeJobKey(x.statRequirements);perTriple[k]=(perTriple[k]||0)+1;});
const dist:Record<number,number>={}; Object.values(perTriple).forEach(n=>dist[n]=(dist[n]||0)+1);
console.log(`  jobs-per-triple distribution: ${Object.entries(dist).sort().map(([n,c])=>`${n}jobs×${c}triples`).join('  ')}`);
// invalid statRequirements / statBonus
const badStat=J.filter(x=>!x.statRequirements.every((s:string)=>STATS.includes(s))||!STATS.includes(x.statBonus?.stat)).map(x=>x.id);
console.log(`\ninvalid stat in requirements/bonus: ${badStat.length?badStat.join(','):'none'}`);
// starter-skill effect types vs dead set (199: damage_percent/buff/flee)
const DEAD_FX=new Set(['damage_percent','buff','flee']);
const fxTypes=new Set<string>(); const jobsDeadFx:string[]=[];
J.forEach(x=>{(x.starterSkill?.effects||[]).forEach((e:any)=>{fxTypes.add(e.type); if(DEAD_FX.has(e.type))jobsDeadFx.push(`${x.id}:${e.type}`);});});
console.log(`starter-skill effect types in use: ${[...fxTypes].join(', ')}`);
console.log(`  jobs whose starter skill uses a DEAD effect type (199): ${jobsDeadFx.length?jobsDeadFx.join(', '):'none'}`);
// specialization parentJobId refint
const baseIds=new Set(J.map(x=>x.id));
const badParent=S.filter(x=>x.parentJobId&&!baseIds.has(x.parentJobId)).map(x=>`${x.id}->${x.parentJobId}`);
console.log(`\nspecialization parentJobId dangling: ${badParent.length?badParent.join(', '):'none'}`);
console.log(`base jobs with >=1 specialization: ${[...new Set(S.map(x=>x.parentJobId))].filter(p=>baseIds.has(p)).length}/${J.length}`);
