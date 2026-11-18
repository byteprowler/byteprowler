# ByteProwler analytics

## Initialization and environment

`src/pages/_app.tsx` calls `trackPortfolioPage` once the Pages Router is ready and on completed route changes. `src/lib/posthog.ts` lazily imports posthog-js 1.x once and creates a named ByteProwler instance. Core rendering never awaits analytics. Initialization or capture failures are caught and do not appear in the UI.

Capture requires a production build, hostname exactly `byteprowler.vercel.app`, a configured browser project token, and no preview/development Vercel environment marker. Local production builds are disabled too. A custom production domain would need an explicit hostname update. No PostHog project, personal key, dashboard or project settings were created or changed.

Set `NEXT_PUBLIC_POSTHOG_KEY` to the existing shared project's client project token. Set `NEXT_PUBLIC_POSTHOG_HOST` to that project's ingestion origin (for example the existing US or EU host). Both are intentionally browser-visible configuration. Personal/admin API keys must never be placed in either field. No real environment files or hosted variables were changed. Save production configuration and rebuild/redeploy because Next.js bundles these public variables at build time.

## Shared-project separation

Every allowed event is forced to include `app="byteprowler-portfolio"` and `host="byteprowler.vercel.app"`, even if a caller or stored property supplies different values. A named SDK instance and portfolio-specific persistence name avoid overwriting another SDK instance's configuration. No identify/reset/group/person-property calls are made. Other applications' historical events are untouched.

## Events

| Event | Additional properties | Trigger |
| --- | --- | --- |
| $pageview | sanitized $pathname and $current_url | First public route and meaningful completed pathname changes |
| portfolio_project_viewed | project_slug, project_title, project_category, project_status | Project detail route |
| portfolio_github_clicked | project_slug, project_title | Public repository link from a card or detail |
| portfolio_live_project_clicked | project_slug, project_title, destination_host | Live project/version link |
| portfolio_contact_started | none | First focus within the form per mount |
| portfolio_contact_submitted | none | Existing local or Django endpoint returns accepted success |
| portfolio_resume_viewed | source | Direct view of a resume PDF |
| portfolio_resume_downloaded | resume_id where available, source | Resume download link click |
| portfolio_external_link_clicked | destination_host | Other HTTP(S) external link clicks |
| portfolio_activity_refreshed | activity_type: anilist, music, discord or github | Manual refresh control; no polling events |

Legacy resume protocol opened/closed/selection/recommendation events are retained with controlled source, step, recommendation and role/focus selection properties. The existing resume download event also emits the new portfolio download event. General resume view links use the direct-link handler. Download events measure clicks, not confirmed completed file transfers.

There are no standalone About, Contact or Certifications routes. These remain homepage sections. Hash changes and query-only changes do not inflate pageviews. Public pages are /, /projects, /tech-arsenal and known project slugs. API routes, errors and unknown slugs are excluded. A module-level last-path guard deduplicates initial/route-event/Strict Mode capture; a full reload is a new pageview.

## Privacy and transport limits

Autocapture, automatic pageviews/pageleave/dead clicks, session replay, console recording, surveys, automatic exceptions, performance/heatmap capture and feature flag requests are disabled. A final before-send allowlist drops unapproved event names and properties, SDK referrers/campaign properties, query strings, hashes and person updates. Allowed standard SDK fields include anonymous device/session identifiers, library, browser, OS, device type and screen dimensions. No contact name/email/message, feed content, repository credentials or full destination URL is passed. mailto links are not tracked.

The SDK uses normal anonymous persistence in first-party local storage/cookies; this is not tracking with no storage. No custom fingerprint is implemented. There is no new consent banner in this pass. Any applicable consent/disclosure policy still needs review.

GeoIP enrichment is disabled per event with $geoip_disable=true. PostHog's current SDK says the deprecated ip option has no effect, so this integration does not claim it disables IP storage. Network transport necessarily exposes an IP to the receiving service. Verify the existing project's IP capture setting. Because the project is shared, do not blindly change its global policy: if needed configure a PostHog ingestion transformation restricted to app=byteprowler-portfolio to remove IP data before storage, without affecting the other application. No hosted transformation was applied during this work.

## Dashboard recommendation

After confirming ingestion, manually create BYTEPROWLER // PORTFOLIO TELEMETRY with the dashboard filter app=byteprowler-portfolio (optionally also host=byteprowler.vercel.app). Add unique anonymous visitors and total $pageview counts, project views broken down by project_title/project_category, GitHub clicks, live clicks, contact submissions, resume download clicks and activity refreshes by activity_type. Do not infer that untagged historical events belong to this portfolio or change the other application's dashboards.

## Verification

Unit tests mock the SDK; none sends real events. They cover development/test/localhost/preview exclusion, initialization deduplication, pageview deduplication, known project routes, property filtering, forced app/host tags and silent initialization failure. Local build/lint/test results are reported on delivery.

Deployment validation remains manual: on the production hostname inspect sanitized /e capture requests, confirm $pageview and an interaction in the existing project's live events, check app/host on every event, ensure no form/feed data or URL queries are present, then filter by the app property to confirm separation. Check that preview and localhost produce no PostHog initialization or requests. Live ingestion was not claimed or tested using credentials here. Supabase counting is unchanged and independent.

Final local results: pnpm lint passed; pnpm build passed including TypeScript and all project routes; pnpm test --pool=threads --maxWorkers=1 passed 17 files / 78 tests; pnpm audit --prod --audit-level high reported no known vulnerabilities. The local tracked-file credential scan and git diff --check also passed. No dedicated type-check script exists. The initial package-add command reported a blocked core-js postinstall; core-js is explicitly marked as not requiring a build in the existing pnpm policy, and pnpm install --frozen-lockfile then passed.
