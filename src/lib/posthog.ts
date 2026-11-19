import type { PostHog } from "posthog-js";
import { getProjectBySlug } from "./projects";

const APP = "byteprowler-portfolio";
const PRODUCTION_HOST = "byteprowler.vercel.app";
type Properties = Record<string, string | number | boolean | string[] | undefined>;
type ResumeEventName = "resume_protocol_opened" | "resume_role_selected" | "resume_focus_selected" |
  "resume_recommendation_generated" | "resume_download_clicked" | "resume_protocol_closed";
type EventName = ResumeEventName | "$pageview" | "portfolio_project_viewed" | "portfolio_github_clicked" |
  "portfolio_live_project_clicked" | "portfolio_contact_started" | "portfolio_contact_submitted" |
  "portfolio_resume_viewed" | "portfolio_resume_downloaded" | "portfolio_external_link_clicked" |
  "portfolio_activity_refreshed" | "portfolio_tech_inspected" | "portfolio_tech_filter_updated";

const eventFields = new Set([
  "project_slug", "project_title", "project_category", "project_status", "destination_host",
  "activity_type", "resume_id", "source", "step", "hadRecommendation", "role",
  "focusAreas", "count", "recommendedResumeId", "recommendedResumeLabel", "selectedRole", "focusCount",
  "tech_node_id", "technology_category", "technology_status", "filter_type", "filter_value",
]);
const sdkFields = new Set([
  "distinct_id", "$device_id", "$session_id", "$window_id", "$lib", "$lib_version",
  "$browser", "$browser_version", "$os", "$os_version", "$device_type", "$screen_height",
  "$screen_width", "$viewport_height", "$viewport_width", "$time", "$geoip_disable",
  "$process_person_profile", "token",
]);

let loading: Promise<PostHog | null> | undefined;
let lastPage: string | undefined;

export function analyticsEnabled() {
  return typeof window !== "undefined" && Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_HOST);
}

export function publicPage(path: string) {
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (["/", "/projects", "/tech-arsenal"].includes(pathname)) return pathname;
  if (pathname.startsWith("/projects/") && getProjectBySlug(pathname.slice(10))) return pathname;
  return null;
}

export function filterEventProperties(properties: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (sdkFields.has(key) || eventFields.has(key)) result[key] = value;
  }
  // Strip query/hash/referrer and person properties, including SDK-added defaults.
  const path = typeof properties.$pathname === "string" ? publicPage(properties.$pathname) : null;
  if (path) {
    result.$pathname = path;
    result.$current_url = `https://${PRODUCTION_HOST}${path}`;
  }
  result.app = APP;
  result.host = PRODUCTION_HOST;
  result.$geoip_disable = true;
  return result;
}

export function initializePostHog(): Promise<PostHog | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!token || !host) {
    if (process.env.NODE_ENV === "development") {
      const variable = token ? "NEXT_PUBLIC_POSTHOG_HOST" : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
      throw new Error(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`);
    }
    return Promise.resolve(null);
  }

  if (loading) return loading;
  loading = import("posthog-js").then(({ default: sdk }) => sdk.init(token, {
    api_host: host,
    defaults: "2026-08-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    loaded: client => client.register({ app: APP, host: PRODUCTION_HOST }),
  }) || null).catch(() => null);
  return loading;
}

export function capturePortfolioEvent(event: EventName, properties: Properties = {}, pagePath?: string) {
  if (!analyticsEnabled()) return;
  const safe: Properties = {};
  for (const [key, value] of Object.entries(properties)) if (eventFields.has(key)) safe[key] = value;
  const pathname = publicPage(pagePath || window.location.pathname);
  if (!pathname) return;
  void initializePostHog().then(client => {
    client?.capture(event, { ...safe, app: APP, host: PRODUCTION_HOST, $pathname: pathname });
  }).catch(() => { /* Analytics must not affect the visitor's action. */ });
}

export function trackPortfolioPage(path: string) {
  const pathname = publicPage(path);
  if (!analyticsEnabled() || !pathname) { lastPage = undefined; return; }
  if (lastPage === pathname) return;
  lastPage = pathname;
  // The capture helper records the current public pathname, without query strings.
  capturePortfolioEvent("$pageview", {}, pathname);
  const project = pathname.startsWith("/projects/") ? getProjectBySlug(pathname.slice(10)) : undefined;
  if (project) capturePortfolioEvent("portfolio_project_viewed", {
    project_slug: project.slug, project_title: project.title,
    project_category: project.category || "uncategorized", project_status: project.status,
  }, pathname);
}

export function captureResumeEvent(event: ResumeEventName, properties: Properties = {}) {
  capturePortfolioEvent(event, properties);
  if (event === "resume_download_clicked") capturePortfolioEvent("portfolio_resume_downloaded", {
    resume_id: typeof properties.resumeId === "string" ? properties.resumeId : undefined,
    source: properties.source,
  });
}

export function trackProjectLink(kind: "github" | "live", project: { slug: string; title: string }, href: string) {
  capturePortfolioEvent(kind === "github" ? "portfolio_github_clicked" : "portfolio_live_project_clicked", {
    project_slug: project.slug, project_title: project.title,
    ...(kind === "live" ? { destination_host: destinationHost(href) } : {}),
  });
}

export function destinationHost(href: string) {
  try { const url = new URL(href); return ["https:", "http:"].includes(url.protocol) ? url.hostname : undefined; }
  catch { return undefined; }
}

export function trackPortfolioLink(event: MouseEvent) {
  if (event.defaultPrevented || !(event.target instanceof Element)) return;
  const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
  if (!anchor || anchor.dataset.portfolioTracked) return;
  try {
    const url = new URL(anchor.href, window.location.origin);
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (url.origin === window.location.origin && /^\/resumes\/[^/]+\.pdf$|^\/resume\.pdf$/.test(url.pathname)) {
      capturePortfolioEvent(anchor.hasAttribute("download") ? "portfolio_resume_downloaded" : "portfolio_resume_viewed", {
        source: "direct_link",
      });
    } else if (url.origin !== window.location.origin) {
      capturePortfolioEvent("portfolio_external_link_clicked", { destination_host: url.hostname });
    }
  } catch { /* Malformed links must not affect navigation. */ }
}
