# What We Changed and Why — Plain-Language Summary

**For:** the game's owner and non-technical leadership
**Covers:** every remediation change completed so far (**Wave 0 complete · Wave 1 in progress**)
**Date:** 2026-06-13
**Status:** Wave 0 complete — 5 foundational fixes landed, tested, and backed up to GitHub

> This document explains, in everyday language, what we have changed in Kohrvellia and **why** —
> with a simple way for you to check each fix yourself. You do not need to read code to use it.
> The exact technical record (file names, commit IDs, test results) lives alongside this file in
> `13_VERIFICATION_LOG.md` and `REMEDIATION_LEDGER.md`.

---

## In one paragraph

An independent audit of Kohrvellia found **371 issues**, from cosmetic to game-breaking. We are
fixing them in planned **waves**, foundation first. This is the first wave: five fixes that make the
game **buildable, honest, and cheat-proof**. Importantly, **no fix changed how the game *feels* to
play** — each one removed a way the game was *breaking, cheating, or miscounting* behind the scenes.
A safety net of **52 automated checks** now stands guard so this work cannot silently come undone.

---

## The big picture: where we are

Think of the 371 issues as a renovation punch-list. You don't start by painting walls — you start by
making sure the building is structurally sound and the alarms work. That is **Wave 0**: the
foundation and safety wave. Later waves handle the gameplay redesigns you approved (monster scaling,
weapon durability, biomes, the jobs program, and so on).

| Scorecard | Status |
|---|---|
| Total issues the audit found | **371** |
| "Drop everything" most-severe issues | **1** → ✅ fixed |
| Wave 0 fixes completed | **5** (closing ~3 dozen individual findings) |
| Automated checks now guarding the game | **52 tests** + **5 health gates** |
| Work backed up off your machine (GitHub) | ✅ yes |

---

## The five fixes at a glance

| # | What we fixed | The problem, in plain terms | Why it matters | How you can check |
|---|---|---|---|---|
| 1 | **The game builds again** | Three essential files lived only on one computer and were never saved into the shared project. The published web version was being built from a broken, ~2½-week-old copy. | This was the single most severe issue. The live game could break at any time and no one else could build it. | Any developer can now download a fresh copy and it runs with zero errors. |
| 2 | **Automatic health alarms** | Nothing was automatically checking the game's health, so problems crept in silently. | Stops this whole class of rot from coming back unnoticed. A smoke detector for the project. | Every change on GitHub now shows a row of green checkmarks; a red one blocks the change. |
| 3 | **Death is permanent & cheat-proof** | A dead character could be revived, force-closing the app dodged death, and leftover gear/stats bled into the next character. | Permanent death is the core promise of this genre. If players cheat death, all the tension collapses. | Die in a run: you go to the death screen, can't continue that hero, and the next one starts truly empty. |
| 4 | **No more infinite-reward exploit** | Players could re-enter cleared rooms to harvest endless loot and grind forever. | An infinite-reward exploit destroys game balance and the "no grind" philosophy. | Clear a room, leave, return — it stays cleared and gives nothing more. You can still walk out to exit. |
| 5 | **Your deeds are counted honestly** | Combat actions were counted twice, biasing every player's level-10 "soul title" toward a combat identity regardless of how they played. | The soul title is a signature feature — it's supposed to reflect *who you became*. Double-counting made it lie. | Locked by automated checks; the level-10 title now reflects your real playstyle. |

---

## The fixes in detail

### 1. We made the game buildable again
**The problem:** Three files that the game cannot run without — one that calculates weapon damage and
two that hold boss data — existed only on the developer's computer. They were never saved into the
project's shared history. Anyone else who downloaded the project (including the automated system that
publishes the game to the web) got a **broken copy**. The published web build was running on a
snapshot about **two and a half weeks older** than the real work.

**What we did:** Saved those three files into the shared project so the game builds cleanly from a
fresh copy, anywhere.

**Why it matters:** This was the audit's **most severe finding** — the kind you fix before anything
else. Until it was fixed, the live game could break without warning and no teammate could build it.

**How to verify:** Download a clean copy of the project on any machine; it now compiles with **zero
errors**. Before this fix, it failed.

---

### 2. We installed automatic health alarms
**The problem:** There was no automatic safety net. Nothing checked, on every change, whether the
game still compiled, whether its data was consistent, or whether dead/unused code was piling up. That
is exactly how the problem in fix #1 went unnoticed for weeks.

**What we did:** Added **five automated health checks** that run on every change: *does it compile · do
the tests pass · is every data reference valid · is there new dead code · are dependencies getting
tangled.* Each check has a "baseline" number that is only ever allowed to **improve, never worsen** —
a one-way ratchet.

**Why it matters:** It's a smoke detector for the codebase. This class of silent rot can't come back
without setting off an alarm.

**How to verify:** On GitHub, each change now shows a row of checks. Green = healthy. A red check
**blocks** the change from going in.

---

### 3. We made death permanent and impossible to cheat
**The problem:** Kohrvellia is a roguelike — death is meant to be **permanent**. But there were many
holes: a dead character could be "healed" back to life; **force-closing the app** during the killing
blow dodged death entirely; the iOS swipe-back gesture could escape a deadly screen; and leftover
gold, items, and stats from a dead character **bled into the next one**.

**What we did:** Sealed every hole. Death now commits the **instant** the killing blow lands — quitting
the app can't undo it. New characters start genuinely fresh. A dead body can't be healed. The
swipe-out gesture is disabled inside the dungeon.

**Why it matters:** Permanent death is the entire emotional weight of the genre. If players can dodge
it, every risky decision becomes meaningless.

**How to verify:** Start a run and let your character die. Confirm: (a) you land on the death screen,
(b) you cannot continue that hero, (c) your next character has **none** of the dead one's gold,
items, or stats. Try force-closing the app the instant before death — you'll still be dead when you
reopen. **11 automated checks** lock this in permanently.

---

### 4. We closed the infinite-reward exploit — without locking the exit
**The problem ("the farm"):** Players could walk back into already-cleared rooms and harvest rewards
**over and over**, grinding forever and trivializing the game — a direct violation of the game's "no
grind" philosophy.

**What we did:** Cleared rooms now stay cleared, the map layout is **remembered** for the whole run
(so it can't be re-rolled for fresh loot), and each reward is granted exactly once.

**The honest part — a mistake we caught:** Our first version of this fix made movement **one-way** to
stop backtracking. But you *leave* the dungeon by walking **back** to the entrance — so one-way
movement accidentally **sealed the only exit**. The owner caught this immediately. We restored
two-way walking; the exploit stays dead through the other three safeguards. (And the walk back out is
actually part of the intended challenge — monsters and hazards still threaten you on the way.)

**Why it matters:** An infinite-reward loop breaks game balance and progression. But the fix must not
break the legitimate way out — which is exactly the trap we caught and corrected.

**How to verify:** Clear a room, leave, and come back — it stays empty and gives no more loot. Then
walk all the way back to the entrance — you can still **exit the dungeon normally**. **6 automated
checks** guard both the closed exploit *and* the open exit.

---

### 5. We made the game count your deeds honestly
**The problem:** The game quietly watches **how** you play — aggressive, cautious, magical, lucky —
to award a unique **"soul title"** when you reach level 10. But combat actions were being counted
**twice** (once by the engine, once by the screen), which tilted **every** player's title toward a
"combat" identity no matter how they actually played. Worse, magic kills were being miscounted toward
a *physical*-combat record, and four "flawless floor" achievements only ever checked on the 5 boss
floors instead of all ~95 floors.

**What we did:** Made the engine the **single source of truth** for counting. Removed 24 duplicate
counters, fixed the magic-vs-physical mix-up, and made the per-floor achievements check on **every**
floor.

**Why it matters:** The level-10 soul title is a signature, identity-defining feature. It's supposed
to reflect who the player became — double-counting made it lie.

**How to verify:** This one is mostly invisible in a single session, so it's locked by automated
checks instead — including a new one that **forbids** the screen from ever double-counting again. The
visible effect: your level-10 title will now reflect your **real** playstyle. **52 automated checks**
in total now run after every change.

---

## The safety net we built

Before this work, there were **zero** automated checks. There are now:

- **52 automated tests** — small programs that re-prove each fix every time the code changes. If
  someone ever accidentally re-opens the death exploit or the farm, a test fails and flags it.
- **5 health gates** — the compile / data-consistency / dead-code / dependency checks from fix #2.

Together, these mean the Wave 0 fixes are **self-guarding**: they can't quietly break in the future
without raising an alarm.

---

## What's protected now (the promises restored)

- ✅ **The game builds** from a clean copy, on any machine.
- ✅ **Death means death** — no revival, no force-quit dodge, no leftover gear.
- ✅ **No grinding** — cleared rooms stay cleared; the exit still works.
- ✅ **An honest soul** — your level-10 title reflects how you really played.
- ✅ **An alarm system** — this class of problem can't silently return.

---

## Wave 1 — in progress

Wave 1 strengthens the game's internal structure so the bigger gameplay changes can land safely.
First change landed:

### We reconnected the game's "control panel" (B-06)
**The problem, in plain terms:** The game has one file that is *supposed* to hold all the balance
dials — how much health you gain per point, how hard monsters hit, how fast you move, and so on.
But that control panel was **never actually wired to the game**. Turning a dial did nothing. Worse,
the numbers printed on the dials had drifted to be roughly **10× wrong** compared to what the game
truly used — so anyone trying to tune the game from that panel would have been badly misled.

**What we did:** We connected the panel to the game and corrected every dial to match what the game
actually does — **without changing how the game plays in any way.** We also moved the
monster-difficulty settings into that same panel so they live in one place.

**Why it matters:** Every gameplay change you approved — especially the monster-difficulty rework
(making floors scale to your level) — has to be tuned from that control panel. It had to be made
real and trustworthy *first*. This is the unglamorous plumbing that makes the exciting work possible.

**How we proved nothing changed:** We took an exact "fingerprint" of the game's combat math before
the change — 40 numbers across 5 different character builds — and confirmed it came out **identical**
afterward. The separate difficulty simulation also produced a byte-for-byte identical result. So this
was pure, provable plumbing: same game, honest dials.

---

### We made saved games survive future updates (B-07)
**The problem, in plain terms:** The game already auto-saves your progress constantly — there's no save
button; it just records everything in the background. But that auto-save was **fragile**: whenever *we*
ship an update that changes how data is stored, an old save could fail to load — the game could crash or
lose a character. Twelve separate save areas all had this weakness, and one had "coped" by simply
**throwing away your dungeon run** whenever it changed.

**What we did:** Built a one-time "save-file translator" and applied it to **all twelve save areas**. Now,
when an old save loads into a newer version, anything new is filled in with sensible defaults instead of
breaking — and earned progress (levels, loot, the soul/title tracking) is always preserved. We also made
the weapon list **self-healing**: if its data ever corrupts, it cleans itself up instead of breaking the
session.

**Why it matters:** This is the safety net that lets us keep adding features — including "The Tower Fights
Back" — **without ever corrupting a player's saved character.** It changes nothing you can see; it protects
everything you've earned.

**How to verify:** Guarded by 11 new automated tests proving old-format saves load cleanly. (Total
automated checks now: **72**.)

---

## What's next (Wave 1, and beyond)

Wave 0 made the foundation sound. **Wave 1** strengthens the internal structure so the bigger
gameplay changes you approved can land safely — starting with reconnecting the game's central
"balance dials" so they actually control the game (a prerequisite for the monster-scaling redesign).

Later waves deliver the design decisions you signed off on: **monster scaling by floor** (the
"Lycagon bands"), **weapon durability & repair** (Fire-Emblem style), **all biomes made meaningful**,
**stealth/sneak**, **percentage-based deity growth bonuses**, and **the full jobs program** (~70 new
jobs). Each will get the same treatment: a clear before/after, a regression-proof test, and a
plain-language note in this document.

---

## How to verify everything yourself (the 2-minute version)

1. **The backup exists:** on GitHub, open the repository's branch list — you'll see a branch named
   `backup/remediation-wave0-2026-06-13`. That is a complete off-machine copy of all this work.
2. **The health checks are green:** open any recent change on GitHub and look for the row of green
   checkmarks.
3. **Play the game** and run the four playable checks above (build, death, farm/exit, and the soul
   note). Each behaves exactly as described.
4. **The detailed paper trail** is in `13_VERIFICATION_LOG.md` (one dated entry per fix, with the
   exact issues each one closed) and `REMEDIATION_LEDGER.md` (the master register of all 371 issues
   and their status).

---

## A note on how we work (so you can trust the record)

Every fix follows the same discipline: it names the exact audit issues it closes, it ships with a
test that guards it, and it gets a dated entry in the verification log **before** we move on. When we
made the one mistake in Wave 0 (the dungeon-exit error in fix #4), we **wrote it down honestly** and
corrected it rather than quietly patching it. That paper trail is deliberate: it means any new person
— technical or not — can pick up exactly where we are and trust what they read.

*The Tower Awaits.*
