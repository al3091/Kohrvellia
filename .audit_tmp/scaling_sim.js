/* KV-AUD-162 — 100-floor scaling simulation (audit, report-only).
 * Formulas transcribed first-hand from src/types/Monster.ts (255-318,474-499)
 * and src/types/Stats.ts (307-428). Player growth + combat-damage model are
 * documented ASSUMPTIONS (flagged); the scaled raw stats are EXACT. */

// ---- Monster scaling (EXACT, from Monster.ts) ----
const ZONES = [
  { lo:1, hi:10, L:1, z:1.0 }, { lo:11, hi:25, L:2, z:1.5 },
  { lo:26, hi:40, L:3, z:2.2 }, { lo:41, hi:55, L:4, z:3.2 },
  { lo:56, hi:70, L:5, z:4.5 }, { lo:71, hi:85, L:6, z:6.5 },
  { lo:86, hi:999, L:7, z:9.0 },
];
const zone = f => ZONES.find(Z => f>=Z.lo && f<=Z.hi);
const levelMult = cr => cr<2 ? 8 : cr<5 ? 16 : cr<10 ? 26 : 36;   // earlyGame/mid/late/mythic
const SC = { hp:1.0, attack:0.20, defense:0.1 };                  // MONSTER_STAT_SCALING

// (id, baseCR, baseHP, baseAtk, baseDef, minFloor, maxFloor) — all 36, from baseMonsters.ts
const M = [
 ['goblin',1.0,55,8,8,1,10],['skeleton',1.2,50,10,12,1,15],['wolf',1.5,70,12,6,1,20],
 ['slime',0.8,65,5,3,1,10],['bat',0.7,35,7,4,1,8],['orc',2.0,110,15,14,3,20],
 ['spider',1.8,65,11,8,2,15],['rat_swarm',0.5,40,6,3,1,5],['kobold',0.6,35,5,5,1,8],
 ['zombie',1.3,85,9,6,2,18],['ghost',2.2,55,14,2,5,25],['troll',3.0,180,18,22,6,25],
 ['fire_elemental',2.5,85,16,5,5,30],['mimic',2.8,100,15,12,4,40],['harpy',2.0,75,13,6,4,20],
 ['dark_knight',3.5,140,20,20,8,35],['ogre',4.0,200,22,18,12,35],['wraith',4.5,100,24,4,15,40],
 ['basilisk',5.0,160,20,22,18,45],['demon_soldier',5.5,180,26,20,20,50],['frost_giant',6.0,280,28,25,22,50],
 ['shadow_dragon',7.0,320,32,28,28,55],['arch_demon',8.0,380,35,30,35,60],['elder_dragon',10.0,550,45,35,45,100],
 ['fire_giant',7.0,300,30,26,28,55],['storm_giant',8.0,350,33,24,32,60],['pit_fiend',9.0,400,38,32,38,65],
 ['red_dragon',9.5,480,42,34,40,70],['lich',8.5,280,36,18,35,60],['behemoth',9.0,600,40,38,38,65],
 ['titan',11.0,700,48,40,50,100],['demon_lord',12.0,650,52,42,55,100],['void_dragon',14.0,800,58,45,60,100],
 ['primordial',16.0,1000,65,50,70,100],['death_knight',11.5,550,50,44,52,100],['ancient_wyrm',13.0,750,55,48,58,100],
];
function monStats(m, floor){           // no prefix → finalCR=baseCR → monsterLevel=floor
  const [,cr,hp,atk,def] = m, lm = levelMult(cr), z = zone(floor).z, lvl = Math.max(1, floor);
  return { hp: Math.floor((lvl*lm*SC.hp + hp)*z),
           atk: Math.floor((lvl*lm*SC.attack + atk)*z),
           def: Math.floor(lvl*lm*SC.defense + def) };
}

// ---- Player model (ASSUMPTION — focused single-stat build at the zone's targetPlayerLevel) ----
// effStat = level*500 + carry + points (Falna). Focused growth: carry ~700/lvl, current ~400.
function player(L){
  const effPri = 500*L + 700*(L-1) + 400;       // primary (e.g. STR)
  const effEnd = 0.5*effPri;                      // secondary
  const weaponDmg = 12 + 6*L;                     // starter→upgraded flat add
  const physAtk = effPri*0.008 + weaponDmg;       // Stats.ts:351-353
  const maxHP   = 50 + effEnd*0.1 + effPri*0.02;  // Stats.ts:332
  const physDef = effEnd*0.006;                   // Stats.ts:360 (no armor)
  return { effPri:Math.round(effPri), physAtk, maxHP:Math.floor(maxHP), physDef };
}

// ---- Two combat-damage models (ASSUMPTION; exact playerAttack lives in useCombatStore) ----
const dmgSub   = (atk,def) => Math.max(1, atk - def);                 // subtractive
const dmgMit   = (atk,def) => Math.max(1, atk * atk/(atk+def));        // ratio mitigation
const BURST = 2.5; // Kairos 2 actions + occasional crit/weakness, per-turn vs per-hit

console.log('floor  zone  pL  pAtk  pHP  pDef | typical(avg eligible)  monHP  monAtk monDef | hitsKill(sub/mit)  hitsDie | verdict');
const sample = [1,5,10,15,20,25,30,40,50,60,70,80,86,90,100];
let oneShotFloor=null, spongeFloor=null;
for(const f of sample){
  const elig = M.filter(m => m[5]<=f && m[6]>=f);
  if(!elig.length) continue;
  const p = player(zone(f).L);
  // average over the (uniformly-random, KV-AUD-299) eligible pool
  let hp=0,atk=0,def=0; for(const m of elig){ const s=monStats(m,f); hp+=s.hp; atk+=s.atk; def+=s.def; }
  hp/=elig.length; atk/=elig.length; def/=elig.length;
  const killSub = Math.ceil(hp / (dmgSub(p.physAtk,def)*BURST));
  const killMit = Math.ceil(hp / (dmgMit(p.physAtk,def)*BURST));
  const die     = Math.max(1, Math.floor(p.maxHP / dmgSub(atk,p.physDef)));   // player turns survived
  let verdict='ok';
  if(die<=1) verdict='ONE-SHOT';
  else if(killMit>die) verdict='LOSE(die first)';
  else if(killMit>15) verdict='sponge';
  if(verdict==='ONE-SHOT' && !oneShotFloor) oneShotFloor=f;
  if((verdict==='sponge'||verdict==='LOSE(die first)') && !spongeFloor) spongeFloor=f;
  console.log(
    `${String(f).padStart(4)} ${String(zone(f).z).padStart(5)} ${zone(f).L}  `+
    `${String(Math.round(p.physAtk)).padStart(4)} ${String(p.maxHP).padStart(4)} ${String(Math.round(p.physDef)).padStart(3)} | `+
    `n=${String(elig.length).padStart(2)}  ${String(Math.round(hp)).padStart(6)} ${String(Math.round(atk)).padStart(6)} ${String(Math.round(def)).padStart(5)} | `+
    `${String(killSub).padStart(5)} /${String(killMit).padStart(4)}    ${String(die).padStart(3)}    | ${verdict}`);
}
console.log(`\nBREAK-EVEN: player first one-shot ≈ floor ${oneShotFloor}; HP-sponge/lose ≈ floor ${spongeFloor}.`);
console.log('NOTE: scaled monster stats are EXACT; player growth + damage model are documented assumptions.');
