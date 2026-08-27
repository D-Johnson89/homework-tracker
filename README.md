# Pace — Homework Tracker

A small browser app for tracking how long homework actually takes versus how
long you thought it would take. Add an assignment with an expected time,
press start when you begin, press stop when you're done, and it keeps a
running history of estimate vs. actual — including an average variance and
an "on time" rate across everything you've completed.

No framework, no build tool beyond the TypeScript compiler, no backend.
Everything persists to `localStorage` in the browser.

## Running it

Open `index.html` directly in a browser. That's it — no server required.

If you change anything under `src/`, recompile with:

```
npx tsc
```

`tsconfig.json` is set to strict mode, so the compiler will catch type
mistakes rather than let them slide.

## Project structure

```
src/
  types.ts       Assignment, NewAssignment, VarianceResult, Stats — the shapes
  repository.ts  Generic Repository<T extends Identifiable> over localStorage
  timer.ts       Timer — plain start/stop/reset stopwatch, no DOM dependency
  stats.ts       Pure functions: variance per assignment, averages across a set
  store.ts       AssignmentStore — business logic wiring Repository + Timer together
  main.ts        DOM wiring: renders cards, handles clicks, re-renders on tick
index.html       Markup + element IDs main.ts queries against
styles.css       All styling
dist/            Compiled JS output (what index.html actually loads)
```

`repository.ts` isn't tied to assignments at all — it's a generic pattern
that could back any `{ id: string }` shaped data. `store.ts` is where the
domain logic actually lives: starting/stopping timers, accumulating time
across multiple start/stop sessions on the same assignment, and marking
things complete.

## What it does

- Add an assignment with a title, subject, and expected time in minutes
- Start/stop a timer per assignment (pausing and resuming adds up correctly)
- Mark an assignment complete, which locks in its actual time
- See average time variance and on-time rate across completed assignments
- A progress ring per card that fills toward the estimate and turns red once
  you've gone over

## What it deliberately doesn't do

- No native in-app timer running in the background when the tab is closed
- No Do Not Disturb / notification blocking — that needs OS-level
  permissions a browser tab can't get
- No accounts, sync, or multi-device support — single browser, single
  localStorage store

See `CONTEXT.md` for why the project exists and what might get added later.
