# Context

## Why this exists

Two things landed at the same time:

1. My son wanted to build a homework/calendar app — expected time per
   assignment, a start/stop timer, phone DND while working, and a record of
   estimate vs. actual over time. He wanted to jump straight to something
   Minecraft-scale; I told him to start smaller, he wasn't thrilled about
   "build a calculator," so this became a real version of his idea instead —
   small enough to actually finish, useful enough to not feel like a toy
   exercise.
2. I'm weighing whether to apply to a Software Engineer posting (Robert
   Half, Raleigh-Durham, on-site) that explicitly wants "freestanding
   TypeScript... not simply React or Angular." My TS experience so far is
   entirely inside React/Next — I don't have a project that proves I can
   write typed, structured logic without a framework doing the work for me.

This app is both things at once: his idea, built as my TypeScript practice
project.

## Origin — read this before treating any of it as portfolio work

The initial scaffold (`types.ts`, `repository.ts`, `timer.ts`, `stats.ts`,
`store.ts`, `main.ts`, markup, styles) was written by Claude, not by me.
That's fine for studying from, but it isn't something I can point an
interviewer to and say I built it.

## The plan

1. Read through the existing code slowly — figure out what's easy to follow
   and what's genuinely tricky, particularly `repository.ts`'s generics and
   the way `store.ts` juggles a `Map<string, Timer>` alongside persisted
   state.
2. Delete `store.ts` entirely and rebuild it from scratch using only
   `types.ts`, `repository.ts`, and `timer.ts` as building blocks —
   `main.ts` still imports from it, so the compiler will complain until the
   shape is right again. That mismatch is effectively a checklist.
3. Once `store.ts` is genuinely mine, decide whether to keep going and
   rebuild more of it (`repository.ts` is the next candidate) or call the
   exercise done and move on to applying.
4. Commit the original AI-generated state as its own first commit, then the
   rebuild as a clearly separate commit — an honest before/after rather than
   history that implies I wrote it all from scratch.

This is one exercise among a few things in flight right now (freeCodeCamp
coursework, Dungeon of Echoes, other capstones) — not the main project, just
the fastest path to being able to honestly say "yes" to the TypeScript
requirement on that posting.

## Stretch goals (later, after the readiness check and other projects wrap up)

Not part of the current exercise — these are the pieces from the original
idea that need more than a browser tab can offer, worth revisiting if this
becomes a real app my son actually uses:

- **Background timer** — keep timing an assignment even if the tab or app
  isn't in the foreground. Needs a native wrapper or mobile app shell; a
  plain web page can't do this reliably.
- **Do Not Disturb while timing** — automatically silence notifications when
  a timer starts, restore them when it stops. Requires OS-level permissions
  (iOS/Android APIs, or a desktop equivalent) — not reachable from
  JavaScript in a browser.
- **Notification blocking** — related to DND, listed separately in the
  original idea; likely the same native-permissions work covers both.
- **Per-subject trends** — break the averages down by subject instead of
  only overall, so patterns like "always underestimates math" become
  visible.
- **Multi-device sync** — currently everything lives in one browser's
  localStorage; would need real accounts and a backend to follow a student
  across devices.
