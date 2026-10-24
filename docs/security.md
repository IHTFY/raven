# Security

Security stage: public. The repository is public, and https://iq.ihtfy.com serves the app to anyone.

## What the app takes in and holds

- No server, no accounts, no payments. GitHub Pages serves static files.
- Input comes from three places: the URL hash (a test seed from a shared link, matched against `/^[a-z0-9]{1,24}$/i` in `src/App.svelte`), the save in `localStorage` (checked field by field in `load()`, `src/lib/state.svelte.js`), and keystrokes and taps.
- Scores and answers stay in the browser. Nothing is sent anywhere by the app's own code.
- Third-party code: Google AdSense, in two units: a 300×250 box on Results, and on windows at least 1200×700 a 160×600 or 300×600 box beside the puzzles during a test or practice. `src/lib/ads.js` loads the shared loader `https://ihtfy.com/ads/v1.js` (from the com.ihtfy repository) after the visitor's first tap or key press, and the loader loads AdSense at browser idle. A visitor with an `ihtfy-ad-free` key in `localStorage` or a cookie of that name gets the loader at startup instead, so it can hide the ads before they show; the app checks only that the key exists, and the loader checks the token. The first page load downloads nothing third-party for anyone else. AdSense runs in its own frames, but the loader and AdSense's script run in the page with full access to it, and nothing checks the loader's contents (no integrity hash or CSP). There are no secrets or accounts on the page to take. The loader skips ads offline, and on hosts other than `ihtfy.com` it asks for test ads only.
- Credentials: none in the repository or the bundle. Deploys push to the `gh-pages` branch with the maintainer's GitHub login.

## Checked on 2026-10-22

- Git history, all branches: no API keys, tokens, or private keys (searched for Stripe, GitHub, Anthropic, and Google key formats and `PRIVATE KEY`).
- `pnpm audit`: one high advisory, `braces` ≤ 3.0.3 (GHSA-vfj7-8cjw-p6xm), reached only through `gh-pages` → `globby` → `fast-glob` → `micromatch`. That's the deploy tool matching its own fixed patterns on the maintainer's machine; no path takes outside input, and nothing from it ships in the bundle.
- GitHub Pages: HTTPS enforced; `http://` redirects with a 301.
- Custom domain: `ihtfy.com` is verified for GitHub Pages, which covers `iq.ihtfy.com` (Pages API `protected_domain_state: verified`). There is no wildcard DNS record.
- Saved data: a malformed save no longer breaks the app on load (fixed in #2, with tests).

## Checked on 2026-10-24

- A full security audit of the source, quick profile, at `e720871`: four survey passes, three reviewers (link and save input, ads, build and history), and a final review of what they covered. It was source-only: no code ran, and the live site wasn't probed. No confirmed findings and no open leads. Git history was searched again for secrets and personal details: clean.
- Not yet checked: whether any link seed makes the puzzle generator fail or stall, which would leave the test screen broken for anyone opening that link (#14).
- Saved seeds get a looser check than link seeds (#15). Only the visitor or same-origin script can write the save.

## Open items

| Item | Where | Fix before | Status |
|---|---|---|---|
| AdSense runs with no privacy policy and no consent message. Google asks sites showing AdSense to publish a privacy policy that discloses third-party ad cookies and how to opt out, and requires a Google-certified consent tool (IAB TCF) before showing personalized ads in the EEA, UK, and Switzerland. | `index.html` | Now (public) | AdSense removed (#4). Coming back on Results: the privacy page is live at https://ihtfy.com/privacy and linked from Home and Results. Google's consent messages (EEA/UK/CH and US states) are published in AdSense Privacy & messaging, 2026-10-22 |
| The custom domain isn't verified for GitHub Pages. If Pages is ever turned off while the `iq` DNS record still points at GitHub, another account could claim the subdomain. Verifying `ihtfy.com` in the GitHub account settings (a DNS TXT record) blocks that. | GitHub profile settings → Pages; Cloudflare DNS for `ihtfy.com` | Now (public) | Fixed 2026-10-22: `ihtfy.com` verified; keep the `_github-pages-challenge-IHTFY` TXT record |
| No Content Security Policy. GitHub Pages can't set headers, so it would be a `<meta>` tag, with a hash for the inline theme script in `index.html`. Low value while the app has no accounts or secrets to steal. If one is added, AdSense needs a nonce-based policy or a host list; the com.ihtfy README lists the hosts seen. | `index.html` | Before any account, payment, or personal-data feature | Open |
| The ad loader runs with full access to the page and nothing checks its contents. Whoever controls `https://ihtfy.com/ads/v1.js` (that repository, its hosting, or the `ihtfy.com` DNS) can run script on iq.ihtfy.com. A CSP host list (row above) narrows where script comes from; an integrity hash isn't possible while the loader changes in place. | `src/lib/ads.js` | Before any account, payment, or personal-data feature | Open; accepted while the page holds nothing to take |
| The app can be framed by any site. GitHub Pages can't send `frame-ancestors` or `X-Frame-Options`, and a `<meta>` CSP can't set `frame-ancestors`. No action on the page changes anything beyond the visitor's own browser, so there's nothing to trick a click into. | Hosting | Before any account, payment, or other action that matters outside the visitor's browser | Open |
| `preinstall` runs `npx only-allow pnpm` without a pinned version, fetching it from the registry on every install. The `packageManager` field in `package.json` does the same job without a download. | `package.json` | Before any CI that installs dependencies | Open |
| `pnpm ghdeploy` publishes `dist/` with dotfiles (`gh-pages -t`). Only `.nojekyll` is there today; a stray dotfile copied into `public/` would go live. | `package.json`, `public/` | Before anything secret is kept near the build | Open; check `dist/` before deploying |
| `braces` advisory in the deploy tool (see above). | `gh-pages` dev dependency | When `gh-pages` ships a fix | No reachable path |

## Rolling back a bad deploy

The site is whatever the `gh-pages` branch holds, so a rollback is a redeploy of the last good commit:

1. Find the last good `master` commit (`git log --oneline master`).
2. Check it out in a fresh worktree, run `pnpm install`, then `pnpm ghdeploy`.
3. Wait for the Pages build (`gh api repos/IHTFY/raven/pages/builds/latest --jq .status` reads `built`) and load the site.

Prefer a redeploy to unpublishing Pages.

## Incidents

There is no user data on a server to leak. The likely incidents are a broken deploy (roll back as above), a compromised dependency in the build (roll back, then pin or replace it), or a leaked deploy credential (revoke it in GitHub settings, then check `gh-pages` history for pushes you didn't make).
