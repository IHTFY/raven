# Agent instructions

Raven is a static web app of generated pattern puzzles (Svelte 5, Vite), live at https://iq.ihtfy.com. The README explains the puzzle engine.

Security stage: public

The repository and the site are both public. `docs/security.md` lists what's been checked and what's still open.

## Working here

- Make changes on a branch in a worktree, open a pull request against `master`, and squash-merge it. There is no CI, so run `pnpm check` (tests, then a production build) before pushing.
- Live state lives in `HANDOFF.md` at the root of the main checkout. It's never committed.
- Tests live in `test/`. Engine tests run in Node; tests that need `localStorage` or DOM elements start with `// @vitest-environment happy-dom`. A bug fix comes with a test that fails without it.
- Bump `GENERATOR` in `src/lib/engine/generate.js` whenever the same seed would build different puzzles. Loading a save from another generator drops the test and practice in progress. Benchmarks (`src/lib/benchmarks.js`) are pinned to a generator and a fingerprint: after a bump, add new benchmark entries for the new generator rather than editing old ones.
- Anything read from `localStorage` or the URL is checked where it enters (`load()` in `src/lib/state.svelte.js`, the seed pattern in `src/App.svelte`).

## Deploying

`pnpm ghdeploy` builds and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves. Deploy from `master` after a merge, wait for the Pages build, then check the live site. Rollback steps are in `docs/security.md`.

## Public text

Commits, pull requests, issues, and files here are public. Keep out secrets, personal details, local machine paths, and the names of the tools or models that wrote or reviewed the code.
