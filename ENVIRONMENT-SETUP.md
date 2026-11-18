# Environment name recovery

Variable names are case-sensitive. Update hosting names to match the list below, keeping their existing values. Save and redeploy; changing browser variables requires a new build. Apply the same names to local configuration and restart development. Never paste secret values into chat or commit them.

## Public configuration (Vercel Config)

| If renamed to | Restore this name | Value |
| --- | --- | --- |
| ANILIST_USERNAME | NEXT_PUBLIC_ANILIST_USERNAME | Public AniList username |
| DISCORD_USER_ID | NEXT_PUBLIC_DISCORD_USER_ID | Public Discord user ID |
| CONTACT_API_URL | NEXT_PUBLIC_CONTACT_API_URL | Django base URL, without /api/contact/send/ |
| SITE_URL | NEXT_PUBLIC_SITE_URL | Canonical HTTPS portfolio origin |
| POSTHOG_KEY | NEXT_PUBLIC_POSTHOG_KEY | PostHog browser project key, not a personal API key |
| POSTHOG_HOST | NEXT_PUBLIC_POSTHOG_HOST | PostHog ingestion host |

These values are intended for browsers. Marking them Secret in hosting does not make the shipped browser values private. Missing PostHog configuration simply disables analytics. The host defaults to https://us.i.posthog.com. The contact URL must be restored if Django handles submissions; without it the form falls back to the local Next.js API route.

## Server variables (keep without NEXT_PUBLIC_)

Secret: SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, LASTFM_API_KEY, SMTP_PASS if SMTP is used.

Config: SUPABASE_URL, BYTEPROWLER_VIEW_KEY, GITHUB_USERNAME, LASTFM_USERNAME, RESEND_FROM_EMAIL, RESEND_TO_EMAIL or CONTACT_TO_EMAIL. SMTP host/port/user/recipient settings are used only for the optional SMTP transport. A username that embeds credentials must be treated as secret.

Do not recreate GITHUB_TOKEN or a PAT. Public GitHub metadata is unauthenticated. No Sentry code is installed in this portfolio; its variables have no effect here. A separate project using Sentry must follow that project's expected names.

Vercel deployment workflow secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) belong to the existing GitHub Actions configuration. They do not need NEXT_PUBLIC_ names or browser access.

Restore names in the correct project and environment scope (Production, Preview, Development). Renaming only the variable does not change or rotate its value. Once the restored deployment works, remove unused unprefixed duplicates. Do not remove an unprefixed variable from a different backend project that still uses it.
