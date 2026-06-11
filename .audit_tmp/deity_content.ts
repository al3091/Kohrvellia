import { allDeities, pantheonMap } from '../src/data/pantheons';
const D = allDeities as any[];
const txt = (d:any) => [d.title,d.description,d.loreSnippet,d.domainBlessing?.description,d.uniqueAbility?.name,d.uniqueAbility?.description].filter(Boolean);
// 1) empty/stub fields
const stub = D.filter(d => !d.description||!d.loreSnippet||!d.title||!d.uniqueAbility?.description||d.description.length<15);
console.log(`[stub/empty fields]: ${stub.length} → ${stub.slice(0,8).map(d=>d.id).join(', ')}`);
// 2) duplicate descriptions / loreSnippets / ability descriptions (copy-paste)
function dups(field:string){ const m:Record<string,string[]>={}; D.forEach(d=>{const v=field.split('.').reduce((o,k)=>o?.[k],d); if(v){(m[v]=m[v]||[]).push(d.id);}}); return Object.entries(m).filter(([,ids])=>ids.length>1); }
for(const f of ['description','loreSnippet','uniqueAbility.description','uniqueAbility.name','domainBlessing.description']){
  const dd=dups(f); console.log(`[dup ${f}]: ${dd.length} groups${dd.length?` → e.g. ${dd.slice(0,3).map(([,ids])=>ids.join('=')).join(' | ')}`:''}`);
}
// 3) TODO/placeholder/Johrvellia
const ph = D.filter(d=>txt(d).some(t=>/TODO|PLACEHOLDER|FIXME|XXX|TBD|lorem|\bWIP\b/i.test(t)));
console.log(`[placeholder text]: ${ph.length} → ${ph.slice(0,8).map(d=>d.id).join(', ')}`);
const johr = D.filter(d=>txt(d).some(t=>/Johrvellia/i.test(t)));
console.log(`[Johrvellia misspell in deity text]: ${johr.length} → ${johr.slice(0,8).map(d=>d.id).join(', ')}`);
// 4) cross-deity name mention (deity text mentions ANOTHER deity's name — possible copy-paste lore error)
const names = D.map(d=>({id:d.id,name:d.name}));
const crossMention:string[]=[];
D.forEach(d=>{ const body=(d.description+' '+d.loreSnippet).toLowerCase();
  names.forEach(n=>{ if(n.id!==d.id && n.name.length>3 && new RegExp(`\b${n.name.toLowerCase()}\b`).test(body)) crossMention.push(`${d.id}→mentions ${n.name}`); }); });
console.log(`[cross-deity name mentions (review for copy-paste)]: ${crossMention.length}${crossMention.length?` → ${[...new Set(crossMention)].slice(0,12).join(' · ')}`:''}`);
// 5) personality distribution + domain×personality
const pers:Record<string,number>={}; D.forEach(d=>pers[d.personality]=(pers[d.personality]||0)+1);
console.log(`[personality values used]: ${Object.entries(pers).map(([k,v])=>`${k}:${v}`).join('  ')}`);
