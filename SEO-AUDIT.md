# ByteProwler production audit

## Files in this pass

Created: `src/lib/site.ts`, `src/lib/crawl.ts`, `src/pages/_document.tsx`, `src/pages/robots.txt.tsx`, `src/pages/sitemap.xml.tsx`, `public/og-byteprowler.jpg`, `supabase/migrations/20261019000000_atomic_portfolio_counter.sql`, `src/__tests__/unit/view-api.test.ts`, `src/__tests__/unit/seo-crawl.test.ts`, `src/__tests__/components/ViewCounter.test.tsx`, `src/__tests__/components/SEO.test.tsx`, and this report.

Modified: `.gitignore`, `.env.example` (placeholders only), `next.config.mjs`, `src/components/seo/SEO.tsx`, `src/components/ui/ViewCounter.tsx`, `src/components/ui/ProjectCard.tsx`, `src/lib/content/projects.ts`, `src/lib/posthog.ts`, `src/pages/_app.tsx`, `src/pages/api/view.ts`, `src/pages/api/github/repo.ts`, `src/pages/index.tsx`, `src/pages/404.tsx`, `src/pages/projects/index.tsx`, `src/pages/projects/[slug].tsx`, `src/pages/tech-arsenal.tsx`.

Pre-existing contact/email changes in the working tree were preserved; they are not part of this audit implementation.

## Architecture and scope

Next.js Pages Router, TypeScript, Tailwind, Motion and TanStack Query. Projects are authored in `src/lib/content/projects.ts` and statically generated through `src/pages/projects/[slug].tsx`. Homepage sections live under `/`; About and Certifications are anchors, not separate routes. Existing contact/email work was left intact.

## View counter findings and fix

The previous GET counted rows, which returns 1 for an aggregate table regardless of its `count` value. POST expected event columns absent from the stated schema. The legacy read/modify/write fallback could lose increments under concurrency; the event lookup/insert could count concurrent retries twice. Failures returned fabricated in-memory totals and could trigger the browser cooldown despite a failed write.

GET now reads the existing aggregate `count`. POST calls `record_portfolio_visit`, which inserts a unique temporary token and increments the aggregate in one database transaction. Duplicate requests return the current count without incrementing. No unsafe read/modify/write fallback is used. Supabase failures return 503 and the existing LINK_ERR UI, without internal errors or invented statistics. Counter responses use no-store.

Only homepage visits increment. Browser storage holds a random visit token, token expiry and confirmed cooldown expiry. Tokens rotate after six hours; they are not a permanent visitor identity. Refreshes, route remounts, hydration, concurrent requests and retries reuse the token. Failed requests retain it for safe retry. Storage-restricted browsers read the count without incrementing. Clearing storage can create another visit; this is a practical visit counter, not a guaranteed unique-person metric. Other API requests never call the counter.

Stored data: the existing aggregate id/count/updated_at, plus temporary token/expiry rows in `portfolio_visit_windows`. No IP address, fingerprint, email, name, user agent or page history is collected. Expired deduplication rows are pruned on writes. PostHog remains separate and is now explicitly production-only for resume interaction events.

## Required Supabase migration

Run `supabase/migrations/20261019000000_atomic_portfolio_counter.sql` in the Supabase SQL Editor before deploying this counter code. Do not rerun the earlier event-table migration manually afterward.

The migration retains an existing aggregate table. If the earlier event schema was applied, it archives those events as `portfolio_view_events_archive` and restores an aggregate initialized from archived events plus `portfolio_view_totals_legacy`. Archives are not deleted. It adds one temporary deduplication table and an atomic service-role-only RPC; RLS and explicit revocations prevent anonymous database writes. The old unguarded RPC loses public execution rights. Use a backup before applying database changes. Restoring the old application requires restoring the matching archived table/schema; do not delete new counts during rollback.

Server configuration: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; optional `BYTEPROWLER_VIEW_KEY` (default `byteprowler:portfolio:views`). No live database/schema was accessed or mutated during this local audit. SQL concurrency behavior still needs validation in Supabase after migration.

## Social previews and technical SEO

Root causes: `_app` rendered only BootSequence in the initial homepage HTML, so page metadata/content was absent for crawlers. Canonical values contained `PASTE_CANONICAL_URL_HERE`; OG image URLs were relative and `public/og-byteprowler.jpg` did not exist. Project headings used H2 as the page title. There was no sitemap or robots response.

The homepage now always renders server-side. Boot starts after hydration as an overlay; background content is inert while it is active. No JavaScript is needed for the main HTML and metadata to exist. Boot, avatar, glitch and activity widgets remain.

`src/lib/site.ts` centralizes the production origin using `NEXT_PUBLIC_SITE_URL`, falling back to the existing `https://byteprowler.vercel.app`. Set that variable to the actual canonical custom-domain origin if different; preview deployment URLs are not used automatically. Canonicals discard query strings, hashes, foreign origins and trailing slashes. Next's existing trailing-slash redirect behavior is retained. HTTPS/domain enforcement remains a deployment setting.

SEO emits title, description, canonical, OG type/url/title/description/image/image-alt and Twitter card/title/description/image/image-alt in initial HTML. A real 1200x630 PNG social image is shipped. Project-specific `ogImage` is honored; otherwise the real global image is used. Arbitrary future authored image paths still need file verification when adding content.

Homepage title: ByteProwler | Frontend Developer Portfolio. Description: Byteprowler is a hacker-inspired developer portfolio showcasing frontend projects, certifications, build logs, and web interface work. Projects use their own title and description. No keyword stuffing or private repository details are included.

`/robots.txt` allows public pages/assets, disallows `/api/`, and references the canonical sitemap. `/sitemap.xml` includes only actual public routes and all project slugs, without invented dates or API URLs. API responses receive X-Robots-Tag noindex/nofollow. The custom 404 has noindex and no canonical; unknown project slugs use static fallback=false and explicit notFound. Next provides its normal 500 response. No auth/admin/debug routes were found.

Indexable routes: `/`, `/projects`, `/tech-arsenal`, and every slug exported from the project data, including `/projects/prowlerpos`. Noindex: 404/error responses. Non-public: framework internals and server utilities. API routes: `/api/contact`, `/api/view`, `/api/lastfm/recent`, `/api/discord/presence`, `/api/github/activity`, `/api/github/profile`, `/api/github/repo`. Crawl resources: `/robots.txt`, `/sitemap.xml`.

JSON-LD uses public Person and WebSite identity on the homepage, CreativeWork and BreadcrumbList on project pages. JSON is escaped against script injection. No ratings, reviews, employer, awards, DOB, private location, unsupported credentials or performance claims were added. No Google verification token existed or was invented.

Project pages now have an H1 and a real archive link. Project cards use H3 and individually named case-study links. Archive filters use native toggle buttons with aria-pressed rather than incomplete tab semantics. Existing Layout supplies main/nav/footer. Image alt text and focus styles remain; the OG fallback has descriptive metadata. No image renaming or broad UI redesign was performed. Full contrast and mobile interaction certification requires browser review.

## Performance and integrations

GitHub, AniList, Last.fm, Discord and Supabase fetch after initial rendering; authored portfolio/project content does not await them. Existing activity limits, query cache windows and manual refresh controls remain. The GitHub repository route now rejects private responses even when a server PAT can access them; private project URLs remain hidden. No new dependency or blocking third-party request was added. No animation was removed. PostHog previously lacked the requested development guard; it now cannot initialize/capture outside production. Core Web Vitals and live social crawler access cannot be concluded from a local build: measure deployed pages in PageSpeed/Search Console.

## ProwlerPOS

Added to the existing project schema with slug `prowlerpos`, title ProwlerPOS, type Restaurant POS Platform, PROTOTYPE status, Frontend Developer role, 2026 year, lab category, unavailable source, unfeatured and excluded from homepage. Live URL: https://verbose-phi.vercel.app/ . Stack verified from the local `ship/frontend/prowler_pos/package.json`: Next.js, React, TypeScript, Tailwind CSS, Framer Motion. The live URL could not be fetched by the web tool during this pass. No production operational metrics were asserted. No repository credentials or private URL was added. The project uses the real global OG fallback.

Short description: A restaurant POS interface connecting sales, waiter ordering, kitchen operations, and business reporting through a unified workflow.

Long description: ProwlerPOS is a restaurant operations platform concept designed to connect front-of-house sales, tableside ordering, kitchen workflows, and back-office reporting in one system. The interface brings together a fast POS checkout experience, waiter ordering from phones or tablets, real-time kitchen tickets, payment handling, customer history, discounts, inventory alerts, staff performance metrics, and sales reporting. The project focuses on reducing the friction between taking an order and getting it prepared by keeping the POS, waiter workflow, and kitchen display synchronized.

The six user-supplied design highlights are stored in the project entry: unified operational workflow; order synchronization structure; checkout design; New/Preparing/Ready kitchen states; reporting dashboard; modular POS/Waiter/KDS workflows. These describe the interface concept, not verified deployed backend capabilities.

## Verification and manual setup

Focused Vitest coverage added for aggregate reads, duplicate RPC results, invalid increment requests, missing/failing Supabase, first visit, refresh, retained retry tokens, metadata, safe JSON-LD, fallback assets, ProwlerPOS, sitemap XML and robots rules. Run `pnpm lint`, `pnpm test`, `pnpm build`; no type-check script exists. Final command results are recorded in the delivery message.

Apply the SQL migration, configure server variables and canonical origin, redeploy, then verify first visit + refresh + duplicate tokens against the live database. Inspect live social image URL for HTTP 200/image/png and request a fresh social scrape because social platforms cache old previews.

Google Search Console: add a Domain property and verify using the DNS TXT value Google supplies. Submit the canonical `/sitemap.xml`; inspect `/`, `/projects` and a project URL. Review Google-selected canonical, indexing reports and rich-result tests; monitor mobile usability and Core Web Vitals once traffic provides data. Use hosting preview protection/noindex settings for preview deployments. No Google account access was attempted; no rankings or indexing guarantee is implied.

Local production HTTP checks returned 200 for `/`, `/projects/prowlerpos`, `/robots.txt`, `/sitemap.xml` and the 23,469-byte PNG; an invalid project slug returned 404. The sitemap parsed as XML with 14 canonical public URLs, no APIs and no localhost URLs. `/projects/` redirected with 308. Generated homepage HTML contains exactly one title, canonical and H1, lang=en, JSON-LD and the authored page content; ProwlerPOS contains its own title/H1/canonical and the valid fallback image.

The local preview uses `next start`; Next warns that the configured standalone artifact should be launched using its generated server for standalone deployments. Vercel handles its own build adapter. This warning does not represent an HTTP failure in the checks above. Mobile browser interaction, deployed social rescraping, production Supabase RPC execution, database concurrency and field Core Web Vitals remain manual validation steps.

Final results: `pnpm lint` passed; `pnpm build` passed including TypeScript and generation of ProwlerPOS; `pnpm test --pool=threads --maxWorkers=1 --reporter=verbose` passed 14 files / 59 tests. The initial default `pnpm test` failed to start fork workers (timeouts before any test ran); the single-worker thread run completed successfully. No type-check script exists. `git diff --check` passed, with existing Windows line-ending conversion notices only. Existing activity-cache tests use illustrative hardcoded constants, so their passing results do not independently certify live polling settings; those settings were inspected directly and left unchanged.
