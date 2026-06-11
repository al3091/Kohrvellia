# Kohrvellia Audit — Documentation Reconciliation & Prior-Audit Crosswalk

> Updated at the **Wave-2 boundary** (engine spine + all `app/` screens complete, `KV-AUD-001…297`). Rows the
> first-hand pass changed are marked **▲ corrected**; rows Wave 2 resolved/confirmed are marked **✔ W2**.

## 0. The meta-pattern (the most important reconciliation result)

**The project's own docs are unreliable in *both* directions, and a reader must treat code as the only
truth:**
- **PROGRESS.md *understates* Phase-2 completion.** It lists "Discovery System NOT STARTED" and "God
  Challenges NOT STARTED," but both are implemented and wired (`KV-AUD-127, 134`), and audio is fully
  implemented (`143`) despite being filed as "pending Phase 3."
- **CLAUDE.md *overstates* the stack.** It names `react-native-reanimated` and `expo-av`; neither is a
  dependency (`expo-audio` is the real, working audio lib).
- **Net:** a stakeholder reading either doc gets a wrong picture — too pessimistic on features, too
  optimistic on libraries. Collapse the five overlapping status docs to one, generated from code.

## A. Doc-vs-code drift (the docs cannot be trusted as "current state")
| Claim (doc) | Reality (code) | Evidence |
|---|---|---|
| "Animations: react-native-reanimated" (CLAUDE.md) | not a dependency; legacy RN `Animated` everywhere | `package.json:11-30` |
| **▲ "Audio: expo-av" (CLAUDE.md) — "audio is a stub"** | **CORRECTED: audio is FULLY IMPLEMENTED** via `expo-audio` (real `createAudioPlayer().play()`, preload cache, crossfade/fades); all 53 referenced `.mp3` assets exist. The `Would play` logs are stale. Only the *library-naming* doc-drift (expo-av/reanimated) survives. | `useSoundStore.ts` + asset Glob (`143` refutes `007`) |
| Store table = 12 stores (CLAUDE.md) | 15 stores; `useSacredItemStore`/`useMarketStore`/`useBlacksmithStore` under/mis-documented | `src/stores/*` (`140`) |
| "12 pantheons active, 7 planned (Phase 3)"; "Do NOT build 7 more" | 19 pantheon files exist; `PantheonId`/`PANTHEON_INFO` enumerate all 19 | `data/pantheons/*`, `types/Deity.ts` *(content pass = Wave 3)* |
| "Bosses only floors 5-25; do NOT build 30-100" | boss tables for 30-100 exist but are **untracked in git** (part of the S0) | `data/bosses/milestoneBossesFloors*` (`001`) |
| **✔ W2** Tutorial "trimmed to 3 screens" | **CONFIRMED + quantified:** `_layout` registers only `index`/`basics`/`death`, but 4 complete screens (`combat`/`stats`/`falna`/`leveling`, **~1015 LOC**) still ship as **orphans** with no inbound route (KV-AUD-291). | `app/tutorial/*` |
| **✔ W2** Falna formula shown to players omits the carry term | **CONFIRMED:** live `tutorial/falna.tsx` shows `(Level×500) + Grade Points` (no carry) and `blessing-rite` shows an **incomplete** formula (KV-AUD-272) | `Stats.ts:121-130` vs `tutorial/falna.tsx`, `blessing-rite.tsx` |
| "96 achievements (L1→L10)" | data files total more across L1–L9 | `data/achievements/*` *(exact count + which use the ~11 dead RequirementTypes = Wave 3; see `196`)* |
| **▲ "85 behavements across 10 vectors"** | **CONFIRMED ~90**, not 85 (unversioned persist array) | `useSoulStore.ts:31-141` (`091`) |
| `src/lib/generators/` (CLAUDE.md folder map) | does not exist | — |
| Combat-log length "8" (DESIGN_COMBAT) | code uses 20 | `064` |
| Tower named "Kohrvellia" | `GameConstants` uses "Johrvellia"/"Johr'…"/"kohr'feli" | `GameConstants.ts:295-310` |
| **✔ W2 "Weapon Triangle not implemented" (CLAUDE.md gap #2)** vs prior audit "wired @523-534" | **W2 sides with CLAUDE.md:** the combat pass (W2-P1) found only a *physical-only* bonus hit (`059`); no slash/blunt-vs-flesh/bone damage-type matrix is applied in `playerAttack`. So it is **not** the "RESOLVED" BUGS.md claims. Final data×material confirmation = Wave 3. | `useCombatStore.ts` + `combat.tsx` |
| **✔ W2** Title-screen version string | title shows **`v0.1.0 — Phase 0`** while Settings shows **`1.0.0 — Phase 1 Complete`** and CLAUDE.md says Phase 1 complete — the public-facing string is stale (KV-AUD-295) | `app/index.tsx:239` vs `settings/index.tsx:311` |
| **✔ W2** Root layout "SafeAreaProvider" | CLAUDE.md calls the root layout "SafeAreaProvider, navigation," but the code wraps in a plain `<View>` (no provider mounted; screens use `SafeAreaView` directly) (KV-AUD-297) | `app/_layout.tsx:62` |
| **✔ W2** Codex domain count | codex lists/counts **12** shrine domains; `Deity.ts` defines **14** (KV-AUD-296) | `codex/index.tsx:19` vs `types/Deity.ts` |
| **✔ W2** Ascension hardcodes "LEVEL 2" | the live ascension screen hardcodes a "LEVEL 2" label and has no Level-10 phase — on-screen reconfirmation that the L10 climax is unbuilt (KV-AUD-271/259) | `town/familia/ascension.tsx:278` |

**Root-repo CLAUDE.md hazard:** `C:\Users\alons\source\repos\CLAUDE.md` (RuFlo/swarm config) imposes
rules that contradict this project (npm build/test scripts, `/tests` dir, 500-line file limit, "never
create docs," parallel-agent swarms). A session opened at the repo root inherits the wrong operating
manual — the project manual is `Kohrvellia/CLAUDE.md`. *(seed AUD-020)*

## B. BUGS.md reconciliation (claims to verify against code)
- **✔ W2 Weapon-triangle:** BUGS.md/prior audit call BUG-008/032 "RESOLVED — wired in `playerAttack`," but
  `Kohrvellia/CLAUDE.md` lists it as a **known gap**. **W2-P1 combat sides with CLAUDE.md:** only a
  physical-only bonus-hit exists (`059`); no damage-type×material matrix. Treat as **not** resolved (final
  data confirmation in Wave 3).
- **▲ BUG-002 "RESOLVED" — only partially:** reset still gaps shop `lifetimeGoldSpent` + sacred
  `acquired`/char-scope (`KV-AUD-002` refined → 104 + 098). The inventory "second gold pool" worry was
  **refuted** (`106` — inventory is a facade over `character.gold`).
- **BUG-010** (Infinity weapon cap) — refined: the `Infinity` cap is **unarmed-only** (`077`); the real
  defect is upgrade omitting `maxOutputCap` (`119`).
- **▲ Job-select `as any`** — verified **FIXED** (`136`).
- **Duplicates:** BUG-002 and BUG-034 each appear twice in BUGS.md.

## C. Crosswalk — prior `docs/AUDIT_2026-06.md` (`AUD-###`) → this audit
The prior audit (S1–S4 only) is **superseded** by `docs/audit/`. Mapping of its load-bearing findings,
updated with first-hand Wave-1 verdicts:

| Prior AUD | This audit | Verdict (Wave-1 first-hand) |
|---|---|---|
| AUD-066 (reset gaps) | **KV-AUD-002** | Confirmed (refined → 104 + 098; inventory half refuted) |
| AUD-090 (favor tables) | **KV-AUD-180** (was 004) | Confirmed; but the *landmine* framing is wrong — the `0×` table is **dead** (`122`); the real S1 is favor being **inert** (`121`) |
| AUD-067 (dead balance constants) | **KV-AUD-151** (was 003) | Confirmed first-hand — Stats.ts hardcodes coeffs, ~10× drift; *partially* dead (some `CombatConfig`/`LootConfig` fields ARE used, `065`) |
| AUD-049/065 (paragon title) | **KV-AUD-176** (was 011) | Confirmed exactly — 13 of 28 stat pairs → 'Iron' |
| AUD-085 (sacred metric TODOs) | **KV-AUD-099** (was 006) | Confirmed + expanded — also dead `forceUnlock`, no-writer metrics, false-unlocks, reveal-favor inert (`208`) |
| AUD-101 (farming re-arm) | **KV-AUD-080** (was 005) | Confirmed end-to-end (re-arm + backward nav + no validation) |
| AUD-028 (StatusEffect schism) | **KV-AUD-190** (was 039) | **Escalated to S1, definitive** — three incompatible models, 7/10 ids overlap |
| AUD-087 (growth path) | **KV-AUD-068** (was 023) | Confirmed — flat `commitExcelia` bypasses the cost curve (the balance root) |
| AUD-051 (paragon buffs applied?) | **KV-AUD-177/181** (was 024) | Confirmed **dead** — half the noun passives + domain blessings are not applied; also moot via favor freeze (`121`) |
| AUD-093 (can't level up?) | KV-AUD-031 → **130** | **Refuted** — achievements progress + auto-unlock STANDARD tiers; real issue is the discovery gate |
| AUD-079 (Easing breaks native) | KV-AUD-037 | **Refuted** — strings are merely dead, never passed to `Animated.timing` |
| AUD-086 (97% deities unreachable) | KV-AUD-137 | **Refuted** — the deity-unlock layer is dead code (0 callers); all deities selectable |
| AUD-010 (ghost libs) | KV-AUD-007 | **Partly refuted** — `expo-audio` is real, working audio; only reanimated/expo-av *naming* drift remains (S3) |
| AUD-001 (garbage files) | KV-AUD-012 | Confirmed |
| AUD-002 (no lint/test) | KV-AUD-013 | Confirmed |
| (new this audit) | **KV-AUD-001** | **S0 build-break — missed by the prior audit (it rated the boss files "LOW")** |

**Net:** the prior audit is genuinely strong on types/stores/hygiene and worth keeping as raw notes,
but it (a) **missed the S0 build break**, (b) **mis-framed the favor system** (filed the dead `0×` table
as the danger; the live defect is that favor→power is **shrine-only** — `121`→S2 via `242`/`270`),
(c) over-rated a few items later refuted (audio, deities, Easing, level-up), and (d) never reached data
content, screens, balance, or benchmarking. This audit corrects and completes it; **Waves 1 (engine) + 2
(all `app/` screens) are now done** — Waves 3–4 (data/content + components/tooling) finish the reach.

## D. Wave-3 DC/DPr doc-drift (the data layer overstates its own counts) — updated S47

The meta-pattern holds and **gains a new direction in the data wave: the *data files' own comments/docs
overstate their content* (claims of more than exists).** Confirmed first-hand against the data:

| Claim (doc/comment) | Reality (code/data) | Evidence / ID |
|---|---|---|
| **CLAUDE.md Known-Gap #6:** "Bosses 6-20: Only 5 bosses (floors 5-25). **Floors 30-100 have no milestone bosses yet.**" | **STALE.** All **20** milestone bosses (floors 5–100/5) are implemented and wired via `getMilestoneBoss` (which aggregates `BOSSES_30_TO_60` + `BOSSES_65_TO_100`). *(But 15 are past the 303 wall = authored-yet-unreachable.)* | `milestoneBosses.ts:16-17,894-905` / **317** |
| **`Job.ts:4`:** "Each stat combination unlocks **2-4 distinct job options.**" | **FALSE.** Of the 56 top-3-stat triples, **35 have 0 jobs** and 3 have only 1; only 21 are covered. | **335** |
| **`hybridWeapons.ts:4`:** "Total: 16 combinations × 20 weapons = **320 hybrid weapons**." | **FALSE.** Only **~162** weapons carry `primaryStats`; the file implements far fewer than advertised. | **313** |
| Docs say **"96 achievements."** | **123** in the data. | **325** |
| CLAUDE.md "audio pending (Phase 3)" / `expo-av` | already corrected W1 (`143`) — audio is real (`expo-audio`); restated here because the achievement/job/boss **content is similarly *more complete than documented*** (Phase 2.3/2.4 "NOT STARTED" remain false). | 134/143 |

**The other direction (data understates its reach via dead wiring):** a reader of the *data* would assume the
20 boss mechanics, the 111 weapon `specialMechanic`s, the 51 jobs' buff-skills, and the Mythic achievements all
*work* — they don't (the runtime never reads them; `311/316/336/325/326`). So the docs are now unreliable in
**three** directions: PROGRESS understates features, CLAUDE overstates the stack, and the data files both
overstate their counts *and* imply wiring that doesn't exist. **One generated source of truth is overdue.**
