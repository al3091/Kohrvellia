import { pantheonMap } from '../src/data/pantheons';
for(const [pid, deities] of Object.entries(pantheonMap)){
  console.log(`\n══════ ${pid.toUpperCase()} (${(deities as any[]).length}) ══════`);
  (deities as any[]).forEach(d=>{
    console.log(`• ${d.name} [${d.domain}/${d.personality}] +${d.statBonus?.value}${d.statBonus?.stat}/-${d.statPenalty?.value}${d.statPenalty?.stat} — "${d.loreSnippet}"`);
  });
}
