type ResumeEventName =
  | "resume_protocol_opened"
  | "resume_role_selected"
  | "resume_focus_selected"
  | "resume_recommendation_generated"
  | "resume_download_clicked"
  | "resume_protocol_closed";

type ResumeEventProperties = Record<string, string | number | boolean | string[] | undefined>;

type PostHogQueue = unknown[] & {
  capture?: (event: string, properties?: ResumeEventProperties) => void;
  init?: (key: string, config?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    posthog?: PostHogQueue;
  }
}

let isPostHogBooted = false;

function getPostHogConfig() {
  return {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  };
}

function ensurePostHog() {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined" || isPostHogBooted) return;

  const { key, host } = getPostHogConfig();
  if (!key) return;

  try {
    const posthog = (window.posthog = window.posthog || []);
    posthog.push([
      "init",
      key,
      {
        api_host: host,
        autocapture: false,
        capture_pageview: false,
        person_profiles: "identified_only",
      },
    ]);

    const script = document.createElement("script");
    script.async = true;
    script.src = `${host.replace(/\/$/, "")}/static/array.js`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    isPostHogBooted = true;
  } catch {
    isPostHogBooted = false;
  }
}

// PostHog is used for anonymous resume interaction events only.
// Do not call posthog.identify or send contact form body, names, emails, or message content.
export function captureResumeEvent(event: ResumeEventName, properties: ResumeEventProperties = {}) {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;

  try {
    ensurePostHog();
    const { key } = getPostHogConfig();
    if (!key || !window.posthog) return;

    if (typeof window.posthog.capture === "function") {
      window.posthog.capture(event, properties);
      return;
    }

    window.posthog.push(["capture", event, properties]);
  } catch {
    // Analytics must never break the portfolio UI.
  }
}
