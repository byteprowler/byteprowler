import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import SEO from "../../components/seo/SEO";
import { SITE_URL } from "../../lib/site";
vi.mock("next/head", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("next/router", () => ({ useRouter: () => ({ asPath: "/" }) }));
describe("SEO head", () => {
  it("renders complete homepage social metadata in server HTML", () => {
    const html = renderToStaticMarkup(<SEO title="ByteProwler | Frontend Developer Portfolio" description="Frontend projects and clean responsive interfaces." url="/" />);
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.title).toBe("ByteProwler | Frontend Developer Portfolio");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toContain("Frontend projects");
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(`${SITE_URL}/`);
    for (const field of ["title", "description", "image", "url", "type", "image:alt"]) expect(doc.querySelector(`meta[property="og:${field}"]`)).not.toBeNull();
    for (const field of ["card", "title", "description", "image"]) expect(doc.querySelector(`meta[name="twitter:${field}"]`)).not.toBeNull();
  });
  it("supports project-specific images and canonical URLs", () => {
    const html = renderToStaticMarkup(<SEO title="ManlagoPOS" description="Restaurant POS interface" url="/projects/manlagopos" image="/og-byteprowler.jpg" />);
    expect(html).toContain(`${SITE_URL}/projects/manlagopos`);
    expect(html).toContain(`${SITE_URL}/og-byteprowler.jpg`);
  });
  it("noindexes error pages", () => {
    const html = renderToStaticMarkup(<SEO title="Not found" description="Page unavailable" noindex />);
    expect(html).toContain("noindex, follow");
    expect(html).not.toContain('rel="canonical"');
  });
});
