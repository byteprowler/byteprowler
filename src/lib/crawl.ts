import { projects } from "./projects";
import { canonicalUrl } from "./site";

export const publicRoutes = ["/", "/projects", "/tech-arsenal", ...projects.map(p => `/projects/${p.slug}`)];
export function sitemapXml() {
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(path => `<url><loc>${escape(canonicalUrl(path))}</loc></url>`).join("")}</urlset>`;
}
export function robotsText() { return `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${canonicalUrl("/sitemap.xml")}\n`; }
