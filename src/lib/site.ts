const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://byteprowler.vercel.app";
function productionOrigin(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) return url.origin;
  } catch { /* Fall back to the existing public deployment. */ }
  return "https://byteprowler.vercel.app";
}
export const SITE_URL = productionOrigin(configuredOrigin);
export const DEFAULT_OG_IMAGE = "/og-byteprowler.jpg";
export function canonicalUrl(path = "/") {
  const pathname = new URL(path, SITE_URL).pathname.replace(/\/+$/, "") || "/";
  return `${SITE_URL}${pathname}`;
}
export function absoluteImage(image = DEFAULT_OG_IMAGE) {
  try {
    const url = new URL(image, SITE_URL);
    return ["https:", "http:"].includes(url.protocol) ? url.href : `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  } catch { return `${SITE_URL}${DEFAULT_OG_IMAGE}`; }
}
export function safeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
