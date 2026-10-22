# Security

Security stage: public. The repository is public, and https://iq.ihtfy.com serves the app to anyone.

## What the app takes in and holds

- No server, no accounts, no payments. GitHub Pages serves static files.
- Input comes from three places: the URL hash (a test seed from a shared link, matched against `/^[a-z0-9]{1,24}$/i` in `src/App.svelte`), the save in `localStorage` (checked field by field in `load()`, `src/lib/state.svelte.js`), and keystrokes and taps.
- Scores and answers stay in the browser. Nothing is sent anywhere by the app's own code.
- Third-party code: Google AdSense, on the Results screen only. After the first finished test, `src/lib/ads.js` loads the shared loader `https://ihtfy.com/ads/v1.js` (from the com.ihtfy repository), which loads AdSense at browser idle into one fixed 300×250 box. The first page load downloads nothing third-party. AdSense runs in its own frames, but its script runs in the page with full access to it; there are no secrets or accounts on the page to take. The loader skips ads offline, when the `ihtfy-ad-free` key is in `localStorage`, and on hosts other than `ihtfy.com` it asks for test ads only.
- Credentials: none in the repository or the bundle. Deploys push to the `gh-pages` branch with the maintainer's GitHub login.

## Checked on 2026-10-22

- Git history, all branches: no API keys, tokens, or private keys (searched for Stripe, GitHub, Anthropic, and Google key formats and `PRIVATE KEY`).
- `pnpm audit`: one high advisory, `braces` ≤ 3.0.3 (GHSA-vfj7-8cjw-p6xm), reached only through `gh-pages` → `globby` → `fast-glob` → `micromatch`. That's the deploy tool matching its own fixed patterns on the maintainer's machine; no path takes outside input, and nothing from it ships in the bundle.
- GitHub Pages: HTTPS enforced; `http://` redirects with a 301.
- Custom domain: `ihtfy.com` is verified for GitHub Pages, which covers `iq.ihtfy.com` (Pages API `protected_domain_state: verified`). There is no wildcard DNS record.
- Saved data: a malformed save no longer breaks the app on load (fixed in #2, with tests).

## Open items

| Item | Where | Fix before | Status |
|---|---|---|---|
| AdSense runs with no privacy policy and no consent message. Google asks sites showing AdSense to publish a privacy policy that discloses third-party ad cookies and how to opt out, and requires a Google-certified consent tool (IAB TCF) before showing personalized ads in the EEA, UK, and Switzerland. | `index.html` | Now (public) | AdSense removed (#4). Coming back on Results: the privacy page is live at https://ihtfy.com/privacy and linked from Home and Results. Google's consent messages (EEA/UK/CH and US states) are published in AdSense Privacy & messaging, 2026-10-22 |
| The custom domain isn't verified for GitHub Pages. If Pages is ever turned off while the `iq` DNS record still points at GitHub, another account could claim the subdomain. Verifying `ihtfy.com` in the GitHub account settings (a DNS TXT record) blocks that. | GitHub profile settings → Pages; Cloudflare DNS for `ihtfy.com` | Now (public) | Fixed 2026-10-22: `ihtfy.com` verified; keep the `_github-pages-challenge-IHTFY` TXT record |
| No Content Security Policy. GitHub Pages can't set headers, so it would be a `<meta>` tag, with a hash for the inline theme script in `index.html`. Low value while the app has no accounts or secrets to steal. If one is added, AdSense needs a nonce-based policy or a host list; the com.ihtfy README lists the hosts seen. | `index.html` | Before any account, payment, or personal-data feature | Open |
| `braces` advisory in the deploy tool (see above). | `gh-pages` dev dependency | When `gh-pages` ships a fix | No reachable path |

## Rolling back a bad deploy

The site is whatever the `gh-pages` branch holds, so a rollback is a redeploy of the last good commit:

1. Find the last good `master` commit (`git log --oneline master`).
2. Check it out in a fresh worktree, run `pnpm install`, then `pnpm ghdeploy`.
3. Wait for the Pages build (`gh api repos/IHTFY/raven/pages/builds/latest --jq .status` reads `built`) and load the site.

Prefer a redeploy to unpublishing Pages.

## Incidents

There is no user data on a server to leak. The likely incidents are a broken deploy (roll back as above), a compromised dependency in the build (roll back, then pin or replace it), or a leaked deploy credential (revoke it in GitHub settings, then check `gh-pages` history for pushes you didn't make).
