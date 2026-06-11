import { ALL_BASE_MONSTERS } from '../src/data/monsters/baseMonsters';
import * as LP from '../src/data/loot/lootPools';
import * as SK from '../src/data/skills/starterSkills';
import * as CN from '../src/data/consumables';
import * as MT from '../src/data/materials';

// ---- 302: monster lootTable refs vs lootPools keys ----
const mons = ALL_BASE_MONSTERS as any[];
const lootRefs = [...new Set(mons.map(m => m.lootTable).filter(Boolean))];
// find the pools container in lootPools exports
const lpExport = Object.values(LP).find(v => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 3) as any
  || Object.values(LP).find(Array.isArray) as any;
let poolKeys: string[] = [];
if (lpExport && !Array.isArray(lpExport)) poolKeys = Object.keys(lpExport);
else if (Array.isArray(lpExport)) poolKeys = lpExport.map((p:any)=>p.id ?? p.category ?? p.name).filter(Boolean);
console.log(`[302] lootPools exports: ${Object.keys(LP).join(', ')}`);
console.log(`[302] ${lootRefs.length} distinct monster lootTable refs · ${poolKeys.length} pool keys`);
const missing = lootRefs.filter(r => !poolKeys.includes(r));
console.log(`[302] lootTable refs with NO pool: ${missing.length ? missing.join(', ') : 'none — all resolve ✓'}`);
const unusedPools = poolKeys.filter(k => !lootRefs.includes(k));
console.log(`[302] pools never referenced by a monster: ${unusedPools.length ? unusedPools.join(', ') : 'none'}`);

// ---- 199: skill catalog effect types vs handled set ----
const SKILL_HANDLED = new Set(['damage','damage_multi','heal','heal_percent','shield','cleanse','debuff','drain','gold_steal']);
const skills = (Object.values(SK).find(Array.isArray) as any[]) || [];
const skillFx = new Set<string>(); const deadSkills:string[]=[];
skills.forEach(s => (s.effects||[]).forEach((e:any)=>{ skillFx.add(e.type); if(!SKILL_HANDLED.has(e.type)) deadSkills.push(`${s.id||s.name}:${e.type}`); }));
console.log(`\n[199] skill catalog: ${skills.length} skills; effect types: ${[...skillFx].join(', ')}`);
console.log(`[199] skills using a DEAD (unhandled) effect type: ${deadSkills.length?deadSkills.join(', '):'none'}`);

// ---- 204: consumable effect types vs handled set ----
const ITEM_HANDLED = new Set(['heal_hp','heal_sp','heal_percent_hp','heal_percent_sp','cure_poison','cure_bleed','cure_all','damage','flee','buff']);
const cons = (Object.values(CN).find(Array.isArray) as any[]) || [];
const conFx:Record<string,number>={}; const deadCons:string[]=[];
cons.forEach(c => { const t=c.effect?.type ?? c.effectType ?? c.type; if(t){conFx[t]=(conFx[t]||0)+1; if(!ITEM_HANDLED.has(t)) deadCons.push(`${c.id||c.name}:${t}`);} });
console.log(`\n[204] consumables: ${cons.length}; effect types: ${Object.entries(conFx).map(([k,v])=>`${k}:${v}`).join('  ')}`);
console.log(`[204] consumables using a DEAD/unhandled effect type: ${deadCons.length?deadCons.join(', '):'none'}`);

// ---- materials + dup ids ----
const mats = (Object.values(MT).find(Array.isArray) as any[]) || [];
const matIds = mats.map((m:any)=>m.id);
console.log(`\n[materials] ${mats.length} materials; categories: ${[...new Set(mats.map((m:any)=>m.category))].join(', ')}`);
const allIds=[...skills.map((s:any)=>s.id),...cons.map((c:any)=>c.id),...matIds].filter(Boolean);
const dup=[...new Set(allIds.filter((id,i)=>allIds.indexOf(id)!==i))];
console.log(`[refint] dup ids across skills/consumables/materials: ${dup.length?dup.join(','):'none'}`);
