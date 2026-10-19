import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { canonicalUrl, absoluteImage, safeJsonLd, SITE_URL } from "../../lib/site";
import { sitemapXml, robotsText, publicRoutes } from "../../lib/crawl";
import { getProjectBySlug, getHomepageProjects } from "../../lib/projects";

describe("production discovery", () => {
  it("normalizes canonicals without query strings, preview origins or trailing slashes", () => {
    expect(canonicalUrl("https://preview.example/projects/?filter=x#top")).toBe(`${SITE_URL}/projects`);
  });
  it("has an available social fallback and absolute image URL", () => {
    expect(existsSync("public/og-byteprowler.jpg")).toBe(true);
    expect(absoluteImage()).toBe(`${SITE_URL}/og-byteprowler.jpg`);
  });
  it("adds ManlagoPOS with honest prototype data without extending the homepage", () => {
    const project = getProjectBySlug("manlagopos");
    expect(project?.title).toBe("ManlagoPOS");
    expect(project?.status).toBe("PROTOTYPE");
    expect(project?.highlights).toHaveLength(6);
    expect(getHomepageProjects()).toHaveLength(6);
    expect(getHomepageProjects().some(p => p.slug === "manlagopos")).toBe(false);
  });
  it("produces parseable sitemap XML for real public routes only", () => {
    const doc = new DOMParser().parseFromString(sitemapXml(), "application/xml");
    expect(doc.querySelector("parsererror")).toBeNull();
    const locations = [...doc.querySelectorAll("loc")].map(n => n.textContent);
    expect(locations).toContain(`${SITE_URL}/projects/manlagopos`);
    expect(locations).toHaveLength(publicRoutes.length);
    expect(locations.some(url => url?.includes("/api/"))).toBe(false);
  });
  it("allows public assets and references the canonical sitemap", () => {
    expect(robotsText()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect(robotsText()).toContain("Disallow: /api/");
    expect(robotsText()).not.toContain("Disallow: /_next");
  });
  it("escapes script delimiters in structured data", () => {
    const json = safeJsonLd({ name: "</script>" });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json).name).toBe("</script>");
  });
});
