# ByteProwler security audit

## Credential findings

| Severity | Location | Finding and action | Exposure and history |
| --- | --- | --- | --- |
| High priority | Local `.env.local:15` | A populated GitHub token setting remains. Revoke the old PAT in GitHub, then remove the unused setting from local and hosted environments. No replacement is needed. | Local/server configuration. No matching credential was found in the scanned local refs; validity and compromise were not checked. |
| High | `src/pages/api/github/repo.ts`, `profile.ts` | Previous code authenticated public reads with the configured GitHub token. Repository queries accepted arbitrary pairs. Removed authentication, restricted repository lookups to configured public projects and set upstream timeouts. | Routes were public; token use was server-side. Prior code is in history; public token disclosure was not established. |
| High | `package.json`, `pnpm-lock.yaml` | Production audit initially found high and critical advisories. Updated Next.js and Nodemailer and overrode the remaining vulnerable transitive source-map dependency. | Old versions are in history; production patching requires deployment. |
| High | `.github/workflows/deploy.yml` | The deployment job could build PR and feature-branch code with Vercel configuration when secrets were available. Restricted it to pushes to main. | Prior workflow is in history; credential theft through it was not established. |
| Medium | `src/lib/contactEmail.tsx`, `src/pages/api/contact.ts`, `src/pages/api/lastfm/recent.ts` | Previous code logged contact payloads in its unconfigured fallback and emitted raw provider errors. Removed payload logging, redacted errors and made missing mail configuration fail honestly. | Prior code is in history; hosted log contents were not inspected. |

No historical credential match was found by the local signature checks. This was a pattern scan of available Git refs and selected credential filenames, not proof of absence. It does not cover remote-only/deleted refs, account settings, past deployments, logs, encoded credentials or secrets outside supported signatures. No credentials were printed, revoked or modified, and no Git history was rewritten.

## Public API and data boundaries

- **GitHub repository:** GET only, configured public project pairs only, fixed GitHub host with redirects rejected, normalized fields, timed requests and cache headers. Auth is unnecessary. Private, missing, deleted, rate-limited or malformed responses fall back to authored project data.
- **GitHub profile/activity:** GET only, configured usernames, public endpoints with no authentication. Cached responses and safe failure states. Profile telemetry excludes non-public repositories; public activity already used no PAT.
- **Last.fm / Discord:** GET public read routes use configured accounts, fixed upstream services and existing cache controls. The Last.fm credential stays server-side. Manual Last.fm refresh remains capable of bypassing shared caching.
- **Views:** GET reads the aggregate, POST accepts a token for the homepage only. The service-role-only database function deduplicates visits and increments atomically. Clients cannot set totals. Fresh arbitrary tokens can inflate the public metric; deduplication is not bot protection. Live grants and migration state were not verified.
- **Contact:** Owner and sender are server-configured. The local POST route bounds field lengths, validates a single reply/acknowledgement address, rejects header line breaks and keeps delivery errors out of browser responses. The duplicate guard is per instance and does not prevent distributed spam. The active Django endpoint, when configured, needs its own validation and rate limits; it was not changed.
- **PostHog:** Existing production-mode gate and manual resume events remain. No contact values are passed to analytics. Production-mode builds can include preview runs if configured with an analytics key; scope keys by deployment environment.
- **Worker:** The neighboring keepalive source reads the health URL from the Worker environment. Worker deployment settings and live logs were outside local verification.

## Configuration and CI

Private project records no longer ship repository coordinates in the shared project data. The production build and lint passed after restoring the project file from Git. Browser assets and generated pages showed no matching credential signatures and no browser source maps. The only audited server variable name found in browser assets was the Last.fm configuration label; a variable name is not a credential value.

Public/config: site origin, browser contact base URL, AniList/Discord identifiers, PostHog browser project key and host, and public GitHub usernames. Public variables must not embed credentials. Server config: Supabase project URL, counter key, email addressing and SMTP host/port. Secrets: Supabase service-role key, Resend key, SMTP password, Last.fm key and Vercel deployment token. Deployment scopes and actual dashboard values were not verified.

CI now checks tracked text for recognizable credential signatures and fails on high-severity production dependency advisories. Checkout credentials are not persisted, workflow permissions are read-only, and no PAT is passed to CI. Deployment still uses its existing Vercel credential on main; Vercel's CLI and GitHub Actions version tags are not immutable pins. Security headers add frame protection, nosniff, referrer and permissions policies. CSP and HSTS were deferred pending deployed origin and HTTPS policy checks.

Changed: GitHub routes and helper, project metadata, contact mail validation/route, Last.fm log handling, site settings, Next headers, dependency manifest/lock/workspace settings, example environment, ignore rules, CI/deploy workflows. Added: redacted CI scanner and focused GitHub metadata tests.

## Manual account actions

1. Revoke the old GitHub PAT; review sessions, security log, SSH and deploy keys, installed apps, webhooks, collaborator access and workflow changes. Enable two-factor authentication if needed.
2. Remove the obsolete GitHub token from local config, Vercel and any GitHub Actions secrets. Review which other deployment credentials the compromised account could access; rotate those through their providers if potentially exposed.
3. Review secret scanning alerts; enable push protection and dependency alerts where available. Require CI on main via a branch ruleset and restrict direct pushes. Review production and preview scopes independently.
4. Deploy from reviewed main, confirm deployment checks, then smoke-test GitHub fallback, the Django contact flow, Supabase counting, activity widgets and the deployed Worker. No production write probes were run.
