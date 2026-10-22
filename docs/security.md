# Security

Security stage: public. The repository is public, and https://iq.ihtfy.com serves the app to anyone.

## What the app takes in and holds

- No server, no accounts, no payments. GitHub Pages serves static files.
- Input comes from three places: the URL hash (a test seed from a shared link, matched against `/^[a-z0-9]{1,24}$/i` in `src/App.svelte`), the save in `localStorage` (checked field by field in `load()`, `src/lib/state.svelte.js`), and keystrokes and taps.
- Scores and answers stay in the browser. Nothing is sent anywhere by the app's own code.
- Third-party code: the Google AdSense script in `index.html` (publisher `ca-pub-7816252471679024`, public by design). It runs with full access to the page and sets ad cookies.
- Credentials: none in the repository or the bundle. Deploys push to the `gh-pages` branch with the maintainer's GitHub login.

## Checked on 2026-10-22

- Git history, all branches: no API keys, tokens, or private keys (searched for Stripe, GitHub, Anthropic, and Google key formats and `PRIVATE KEY`).
- `pnpm audit`: one high advisory, `braces` ≤ 3.0.3 (GHSA-vfj7-8cjw-p6xm), reached only through `gh-pages` → `globby` → `fast-glob` → `micromatch`. That's the deploy tool matching its own fixed patterns on the maintainer's machine; no path takes outside input, and nothing from it ships in the bundle.
- GitHub Pages: HTTPS enforced; `http://` redirects with a 301.
- Saved data: a malformed save no longer breaks the app on load (fixed in #2, with tests).

## Open items

| Item | Where | Fix before | Status |
|---|---|---|---|
| AdSense runs with no privacy policy and no consent message. Google asks sites showing AdSense to publish a privacy policy that discloses third-party ad cookies and how to opt out, and requires a Google-certified consent tool (IAB TCF) before showing personalized ads in the EEA, UK, and Switzerland. | `index.html` | Now (public) | Waiting on the owner: drop ads, or add a privacy page and Google's consent message |
| The custom domain isn't verified for GitHub Pages. If Pages is ever turned off while the `iq` DNS record still points at GitHub, another account could claim the subdomain. Verifying `ihtfy.com` in the GitHub account settings (a DNS TXT record) blocks that. | GitHub account settings, DNS for `ihtfy.com` | Now (public) | Waiting on the owner: needs DNS access |
| No Content Security Policy. GitHub Pages can't set headers, so it would be a `<meta>` tag, and the AdSense script needs a broad allowlist. Low value while the app has no accounts or secrets to steal. | `index.html` | Before any account, payment, or personal-data feature | Open |
| `braces` advisory in the deploy tool (see above). | `gh-pages` dev dependency | When `gh-pages` ships a fix | No reachable path |

## Rolling back a bad deploy

The site is whatever the `gh-pages` branch holds, so a rollback is a redeploy of the last good commit:

1. Find the last good `master` commit (`git log --oneline master`).
2. Check it out in a fresh worktree, run `pnpm install`, then `pnpm ghdeploy`.
3. Wait for the Pages build (`gh api repos/IHTFY/raven/pages/builds/latest --jq .status` reads `built`) and load the site.

To take the site down entirely (for example, if a third-party script turns hostile), remove the AdSense tag from `index.html` and redeploy; unpublishing Pages would leave the domain open to the takeover described above.

## Incidents

There is no user data on a server to leak. The likely incidents are a broken deploy (roll back as above), a compromised third-party script (remove it and redeploy), or a leaked deploy credential (revoke it in GitHub settings, then check `gh-pages` history for pushes you didn't make).
