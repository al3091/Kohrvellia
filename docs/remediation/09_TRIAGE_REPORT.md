# 09 — TRIAGE REPORT (Phase B)

> Produced 2026-06-10 (remediation session S3) under the Remediation Master Prompt §3. Sources: the CANON
> `findings/*.md` headers + the `REMEDIATION_LEDGER.md` register (Phase A) + live HEAD verification.
> **Never sourced from `ALL_FINDINGS §4`** (it drifts from canon — ledger OBS-8).
> Machine tally: `node docs/remediation/tools/tally.js` (re-runnable).

---

## §1 — Machine-regenerated tallies (D6)

### Severity AS-FILED (canon headers; seeds 003–041 from `02_FINDINGS.md`)
| S0 | S1 | S2 | S3 | S4 | Info | Total |
|---|---|---|---|---|---|---|
| 2 | **14** | 130 | 158 | 16 | 51 | **371** ✓ |

### Current status distribution (all 371 IDs, graph-resolved)
`CONFIRMED 250 · REFINED 17 · SUPERSEDED 25 · REFUTED 11 · DOWNGRADED 2 · LATENT 8 · NEEDS-REPRO 6→0 (all resolved this session) · PART-CONF 3 · REVISED 1 · LIKELY 1 · RESOLVED 1 · MERGED 1 · POSITIVE 45`

### Current LIVE-DEFECT tally (excludes SUPERSEDED/REFUTED/MERGED/RESOLVED/POSITIVE)
| S0 | S1 | S2 | S3 | S4 | Info-class | POSITIVE |
|---|---|---|---|---|---|---|
| 1 | **6 rows = 5 defects** | ~102 | ~157 | 15 | 7 | 45 |

**The live S1 set, stated and proven:** `002 (permadeath bleed) · 080 (farming) · 099≡343 (sacred tier) · 190 (status schism) · 259 (L10 climax)` — six S1-severity rows representing **five defects** (343 is 099's quantification). Sole S0 = `001`. **No mismatch vs the expected set.**

### Divergence explanations (one line each, per D6)
| Prose claim | Machine truth | Why it diverged |
|---|---|---|
| `00_EXECUTIVE_SUMMARY` "363 findings" | 371 | regenerated at S54 synthesis, before the exhaustive tail 364–371 |
| Final hand-off "~72 S2 · ~98 S3 · ~52 Info" (≈228) | as-filed 130/158/51+16; live ~102/~157 | the `~` tallies mixed "live" with "as-filed" and were estimated, not counted |
| Master-prompt "raw grep finds 11 ever-tagged S1" | **14** as-filed S1 IDs (8 seeds + 7 canon − 1 overlap: 002) | the 11 was a line-start grep of canon only; misses seeds + the inline/struck headers |
| `ALL_FINDINGS §3` "~68 S2 · ~93 S3 · ~43 Info" | see above | snapshot at 342, `~`-estimated |
| `ALL_FINDINGS` header "001…297" / §3 "342" / footer "371" | 371 | regeneration strata — header never updated |
| `02_FINDINGS` header "363 findings" | 371 | same S54 timing |
| stores.md raw header count 98 vs 97 IDs | 106 double-headered (Needs-repro + [REFUTED] restatement) | by design — the refutation restated the header |
| types.md raw header count 71 vs 72 IDs | 164's header is inline mid-paragraph | formatting accident; caught by anywhere-anchored regex |

**Transcription QA:** canon-vs-register severity cross-check = **0 mismatches across all 332 canon IDs.**

---

## §2 — HEAD re-verification log (working tree @ 2026-06-10; commands re-runnable)

### S0 + the S1 set (mandatory) — ALL VERIFIED-AT-HEAD
| ID | Verdict | Evidence (command → result) |
|---|---|---|
| **001** S0 | ✅ VERIFIED | `git -C Kohrvellia ls-files --others --exclude-standard src/` → exactly the 3 files (also snapshotted to `backup/working-tree-2026-06-10` @ `3b8603e`, owner-authorized) |
| **303** | ✅ VERIFIED (sim) | `node .audit_tmp/scaling_sim.js` → lose ~fl.10, ONE-SHOT ~fl.20, fl.86 atk 6052 vs HP 617 — exact reproduction |
| **099/343** | ✅ VERIFIED (sim) | `tsx .audit_tmp/relic_check.ts` → 244/588 (41%) unobtainable · 15 false-unlocks · 490 secret @ revealFavorRequired:100 · 107 non-canonical damageTypes (**344** ✓) · 588 passiveIds (**210** ✓) · 0 dups |
| **259** | ✅ VERIFIED (route-graph) | rg `dungeon/level-up` in app/ → **0 inbound**; rg `dungeon/denatus` → only `level-up.tsx:309` (dead); `performDenatus|setParagonTitle` → only `denatus.tsx` + store defs |
| **080** | ✅ VERIFIED (read) | `useDungeonStore.ts` at HEAD: re-arm `:645-651` (`shouldReactivate → isCompleted:false`) + `backwardIds` merged `:711-716` + `moveToNode` has no navigability check |
| **190** | ✅ VERIFIED (diff) | `StatusEffect.ts:9-19` (…weaken/slow/regen) vs `Character.ts:111-121` (…fear/silence/paralysis) — 7/10 overlap, 3 unique each; third shape = the consumable buff object (116/158) |
| **002** | ✅ VERIFIED (read) | `clearAllStores.ts` resets 9 stores; still omits `useShopStore`/`useSacredItemStore`/`useInventoryStore`; header comment still false |

### Pattern S2 sampling (≥⅓ per pattern — quota met)
P1: 311 ✅ (grep: `specialMechanic` = type def + writer + data only, 0 readers) · 316 ✅ (`.mechanic` only at `boss-encounter:232-233` display) · 181 ✅ (`DOMAIN_EFFECTS` consumers = `getBlessingEffect` + 3 creation-display components, 0 appliers) · 343/099 ✅ · 190/191 ✅ · 177 ✅ · **192 ✅ NEW-CONFIRMED** · 325/326 ✅ (`tsx .audit_tmp/ach_check.ts` — exact reproduction incl. the 4 STANDARD-tier + 13 undiscoverable + 5/10 boss ids [**321** ✅]) — **P4:** 352 ✅ (`tsc --noEmit` exit 0 = the false green) · 344 ✅ — **P6:** 002/080/098/104 ✅ — **P8:** 303 ✅ · 151/360 ✅ (grep: GameConstants imported by exactly `useCombatStore` [Combat+Loot] + `travel` [ZONE_NAMES] + `denatus` [DENATUS_WILAK_ALIGNMENT] = the 4-of-20 claim exact) — **P10:** 113 ✅ (`BAG_CAPACITY = 20` @ `Character.ts:174` vs `MAX_INVENTORY_SLOTS = 50` @ `useInventoryStore.ts:16`) — **P11:** 325/326/321 ✅.

### The 13-item NEEDS-REPRO worklist — ALL RESOLVED
| Item | Verdict at HEAD |
|---|---|
| 169 `MonsterAbility` | **CONFIRMED dead** — interface definition only; no `.abilities` reader anywhere |
| 192 `getHealingModifier` | **CONFIRMED dead** — definition only (`StatusEffect.ts:244`), 0 callers → curse `preventsHealing` + burn `reducesHealing` are inert. **New confirmed resolver-column member (S2)** |
| 177-tail | **CONFIRMED dead ×4** — `item_effectiveness/reputation_gain/loot_discovery/tier_bonus` exist only in `Behavement.ts` definitions (+1 unrelated deity-data string); final shape: gold_bonus screen-wired (223), the other four dead |
| 239 skill scale | **CONFIRMED (incompatible-scales branch)** — `calculateSkillDamage` (`Skill.ts:117-131`) is tuned for the raw 0-999 input it receives; skills + auto-attacks sit on different economies; flat `def*0.3` (200) visible at `:127` |
| 249 mystery source | **CONFIRMED dead branches** — `useDungeonStore:85-87` sets `actualType` from `selectMysteryRevealType` (event/shrine/treasure only) → room's combat/elite/rest mystery branches unreachable |
| 034 EnemyPreview | **CONFIRMED, component LIVE** — rendered by `encounter.tsx:144`; `getDangerLevel(cr, 1)` hardcoded (`:58`) + `canInflict = []` never populated (`:64`) |
| 037-tail | **CONFIRMED** — `Breakpoint` (`Spacing.ts:115`) + `isSentenceEnd` (`Animation.ts:224`) definition-only; `Shadow.glow` 0 hits |
| 032-roster | **RESOLVED** — `AnimatedHPBar`/`AnimatedSPBar` **do not exist** (stale names; the live `AnimatedBar` replaced them and IS used — 369); `GritPanel` exists, referenced only by itself + the ui barrel → orphan-via-barrel; the other 5 orphans = knip's roster (354) |
| FloatingDamage (un-IDed `03 §2` item) | **CONFIRMED** — `:109-115` applies BOTH `translateX` AND `left:%` from `popup.x` → double-move; carried forward as `03§2-FD` (no new KV-AUD ids minted) |
| 341 data side | **CONFIRMED** — `ramifications.ts:33-37`: `weapon_chip` = `type:'buff'` + non-canonical `weapon_damage_down` (handler absence established by 057/268) |
| 363 tracked-vs-untracked | **RESOLVED** — the 17 root junk files are **UNTRACKED** (`??`); 363's "are tracked" clause REFUTED-in-part (seed 012 was right); +**6 more junk strays nested in `app/`** discovered (OBS-12) |
| 342-nit event statCheck | **CONFIRMED — a 7th raw-points site (P5)** — `room.tsx:582-584` reads `character.stats[stat].points` (raw, within-grade) vs `dc`; boss-encounter's `snapshot.statPoints` site also live (`boss-encounter.tsx:113-115`) |
| 181 / domain blessings | **CONFIRMED display-only** (see P1 sampling above) |

### STALE / FALSE-POSITIVE register (claims corrected with proof)
| Claim | Verdict | Proof |
|---|---|---|
| 363 "junk files are tracked" | STALE/wrong clause | `git status --short` → all `??`; the litter itself stands |
| seed 032's `AnimatedHPBar`/`AnimatedSPBar` | STALE names | files don't exist; `AnimatedBar` live (369) |
| CLAUDE gap #6 "no bosses 30–100" | STALE (317) | roster import: 20/20 wired |
| dungeon-inventory "Armor — future update" | STALE placeholder (267/281) | armor buyable+equippable+applies |
| the 11 audit-internal REFUTED items | per the ledger edge map E1 | each carries its refuting ID |

---

## §3 — Triage buckets (every live CONFIRMED/REFINED/DOWNGRADED/LATENT ID in exactly one)

### A — Guarantee breakers (act first)
**Build:** 001 (+352 false-green). **Winnability:** 303 (+302-variety, 322 downstream). **Permadeath/state integrity:** 002 · 069 · 098 · 104 · 227 · 124 · 248 · 254(b famine) · 231(latent guard). **Farming/nav integrity:** 080 · 081 · 082 · 246 · 251 · 252 · 264 (root) · 234 · 254(a) · 277. **The S1 systems:** 099≡343 (+207/208/210/345/100) · 190 (+158/167/115/066/240) · 259 (+260/261/271/296 routing side). **First-combat:** 138 (+058). *(⚠ 068/138/113 have no `06` item — Phase-E additions.)*

### B — Structural seams (the multipliers)
**The effect-resolver column (P1):** 052 · 057 · 116 · 177 · 181 · 188 · **192** · 191 · 193 · 194 · 199 · 204 · 211 · 224 · 301 · 311 · 312 · 316 · 327 · 333 · 336 · 341 (+210 via A). **Type tightening (P4):** 026 · 043 · 044 · 046 · 054 · 072 · 166 · 185 · 187 · 203 · 206 · 209 · 218 · 330 · 344. **Balance source-of-truth:** 360 (+151/065/154/068-wiring). **Single-source merges (P3):** 060 · 071 · 107 · 144/293 · 173 · 174 · 180 · 201 · 214 · 235 · 309 · 337 · 340 · 348 · 366. **Silent-failure guards (P10):** 113/282 · 114 · 226 · 228 · 243 · 329 · 333. **Raw-points helper (P5, 7 sites):** 218 · 239 · 261 · 279 · 318 · level-up · boss-encounter · room-events. **Cycles:** 353. **Persistence class:** 073 · 088 · 094 · 102 · 141 · 118. **Perf class:** 101 · 132 · 230 · 238 · 256 · 356 · 369. **Misc correctness:** 051/186/298 (0-dmg triangle+data) · 059 · 062 · 087 · 092 · 093/220/221/232/253 (soul counts) · 074 · 075 · 076 · 091 · 097/179 · 105 · 109 · 112 · 117 · 123 · 126 · 129 · 131 · 135 · 139 · 156/157/289 · 159-class · 160 · 183 · 198 · 200 · 215 · 216 · 222(bias) · 265 · 274 · 034 · 03§2-FD.

### C — Content reachability (gated behind A's 303 + B's resolver)
325 · 326 · 327 · 329 · 332 (+130/196 ancestry) — the achievement vectors · 335 · 336 · 338 — jobs/specs · 347 (maya/inca WIRE) · 349 · 321 · 308 · 314 · 146 · 298(content side) · 364 · 322 (the finale — terminal C item).

### D — Mechanical cleanup (CI-enforced once #3 lands)
knip DELETE roster (354): `starterSkills.ts` · 5 component orphans + 2 barrels · 6 dead barrels (140/217) · dead fns 148 · 159 · 164 · 125 · 122 · 137 · 197 · 175 · 155 · 160 · 212 · 169 · 037 · 110 · 084 · 085/171 · 172/083/245 · 305-unions · GritPanel · dead styles 237/256 · dead routes 260/262-base/291 · junk 363+OBS-12 (23 files total now) · data nits 304 · 306 · 323 · 365 · 366 · doc regeneration 317 · 350 · 313 · 064/235 · 091 · 272(d) · 295-version · 297-doc · 330 · 346-doc · 014.

### E — Noise → automation (lint/CI rules, never hand-fixes)
P9 literals + palettes: 049 · 063 · 229 · 247 · 255 · 275 · 280 · 284 · 236 · 358 · 368 · 297-nit → **two lint rules** (no balance literal outside GameConstants; no hex outside Colors) + the CI gates themselves (013 · 352 · 353 · 354 → backlog #3) + an `as any` ban (lint side of B's P4).

### F — PROTECT LIST (do-not-touch; blast-radius declarations required)
**The 45 POSITIVE rows** and their subjects: the 20-boss conversation system + roster (320/324) · all 310 deities (351/367) · the 338-weapon catalog + voice (315) · the 588-item relic authoring (346) · the 123-achievement authoring (328/331/334) · the 53 dungeon events (342) · the bestiary data (302/310) · discovery + God-Challenges (127/134/278) · eviction Option C (273) · the audio engine (143/147) · the ErrorBoundary (297) · salvage (286) · the creation flow (290) · the Falna carry model (161) · the `Colors`/`Typography`/`Spacing` token system (362) · the armor buy/equip path (281/195) · native-driver animation discipline (359/371) · `isRequirementMet`'s operators (329-positive) · effStat-keyed job selection (339) · meta-store non-reset design (142) · boss-cleared + encounter sneak flows (258/269) · the shop flow (285/288) · `enterFloor` descend-gating (257) · blessed-selector wiring (225) · soul init + ceremony liveness (096) · the market reset (111-positive).

---

## §4 — Residue
- **No FALSE-POSITIVE verdicts were issued against audit findings this phase** (the corrections above target rollup claims and seed-era names, each with proof). No finding moved severity vs the edge map; **192 hardened from Likely to Confirmed** (S2) — the only material status promotion.
- **NEEDS-REPRO remaining: 0.**
- Un-IDed carry-forward: `03§2-FD` (FloatingDamage double-move) → Phase D registry.
- Lazily-verified remainder (everything not listed in §2) verifies **before its batch enters the Surgical Plan** (§3.2 rule) — tracked per-batch in Phase E.
