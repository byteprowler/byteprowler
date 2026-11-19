import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  init: vi.fn(), capture: vi.fn(), register: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: { init: mocks.init } }));

function environment(hostname = "byteprowler.vercel.app", pathname = "/") {
  vi.stubGlobal("window", { location: { hostname, pathname, origin: `https://${hostname}` } });
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "unit-test-project-token");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://analytics.example");
  vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
}

async function settle() { await new Promise(resolve => setTimeout(resolve, 0)); }

describe("portfolio analytics boundaries", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    environment();
    mocks.init.mockReturnValue({ capture: mocks.capture, register: mocks.register });
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it.each(["development", "test"])("never initializes in %s", async mode => {
    vi.stubEnv("NODE_ENV", mode);
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/");
    await settle();
    expect(mocks.init).not.toHaveBeenCalled();
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it.each(["localhost", "127.0.0.1", "portfolio-preview.vercel.app"])("disables production-build analytics on %s", async host => {
    environment(host);
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/");
    await settle();
    expect(mocks.init).not.toHaveBeenCalled();
  });

  it("disables preview environments even on an allowed hostname", async () => {
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "preview");
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/");
    await settle();
    expect(mocks.init).not.toHaveBeenCalled();
  });

  it("does nothing without configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/");
    await settle();
    expect(mocks.init).not.toHaveBeenCalled();
  });

  it("initializes once with default capture and rejects caller identity overrides", async () => {
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/");
    analytics.trackPortfolioPage("/?email=excluded#contact");
    analytics.capturePortfolioEvent("portfolio_contact_submitted", { app: "other-app", email: "must-not-send" });
    await settle();
    expect(mocks.init).toHaveBeenCalledTimes(1);
    expect(mocks.init.mock.calls[0][1]).toMatchObject({ api_host: "https://analytics.example", defaults: "2026-08-30" });
    expect(mocks.capture.mock.calls.filter(([event]) => event === "$pageview")).toHaveLength(1);
    for (const [, properties] of mocks.capture.mock.calls) {
      expect(properties).toMatchObject({ app: "byteprowler-portfolio", host: "byteprowler.vercel.app" });
      expect(properties.email).toBeUndefined();
    }
  });

  it("tracks project routes once and ignores internal or unknown routes", async () => {
    environment("byteprowler.vercel.app", "/projects/prowlerpos");
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/projects/prowlerpos");
    analytics.trackPortfolioPage("/projects/prowlerpos?private=excluded");
    await settle();
    expect(mocks.capture.mock.calls.filter(([event]) => event === "portfolio_project_viewed")).toHaveLength(1);
    expect(mocks.capture).toHaveBeenCalledWith("portfolio_project_viewed", expect.objectContaining({ project_slug: "prowlerpos", project_title: "ProwlerPOS" }));
    expect(analytics.publicPage("/api/view")).toBeNull();
    expect(analytics.publicPage("/projects/unknown")).toBeNull();
  });

  it("counts a return navigation and keeps the captured route context", async () => {
    const analytics = await import("../../lib/posthog");
    analytics.trackPortfolioPage("/");
    analytics.trackPortfolioPage("/projects");
    analytics.trackPortfolioPage("/");
    await settle();
    const pages = mocks.capture.mock.calls.filter(([event]) => event === "$pageview");
    expect(pages.map(([, properties]) => properties.$pathname)).toEqual(["/", "/projects", "/"]);
  });

  it("strips SDK URL queries, referrers, person updates, contact data and feed content", async () => {
    const { filterEventProperties } = await import("../../lib/posthog");
    expect(filterEventProperties({
      $pathname: "/", $current_url: "https://example.com/?secret=excluded",
      $referrer: "https://example.com/private", $set: { email: "excluded" },
      $session_id: "anonymous-session", message: "excluded", artist: "excluded",
      activity_type: "music", app: "other-app",
    })).toEqual({
      $pathname: "/", $current_url: "https://byteprowler.vercel.app/",
      $session_id: "anonymous-session", activity_type: "music",
      app: "byteprowler-portfolio", host: "byteprowler.vercel.app",
      $geoip_disable: true,
    });
  });

  it("never throws into an interaction when SDK initialization fails", async () => {
    mocks.init.mockImplementationOnce(() => { throw new Error("blocked"); });
    const analytics = await import("../../lib/posthog");
    expect(() => analytics.capturePortfolioEvent("portfolio_contact_started")).not.toThrow();
    await settle();
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it("only extracts a destination hostname", async () => {
    const { destinationHost } = await import("../../lib/posthog");
    expect(destinationHost("https://demo.example/path?token=excluded#secret")).toBe("demo.example");
    expect(destinationHost("mailto:someone@example.com")).toBeUndefined();
  });
});
