import Head from "next/head";
import { useRouter } from "next/router";
import { absoluteImage, canonicalUrl, safeJsonLd } from "../../lib/site";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: unknown;
}

export default function SEO({
  title,
  description,
  image = "/og-byteprowler.jpg",
  url,
  type = "website",
  noindex = false,
  structuredData,
}: SEOProps) {
  const router = useRouter();
  const canonical = canonicalUrl(url || router.asPath || "/");
  const ogImage = absoluteImage(image);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      {!noindex && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${title} preview`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} preview`} />
      <link rel="icon" href="/favicon.ico" />
      {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} /> : null}

      {/* Place the final social preview image at public/og-byteprowler.jpg when ready. */}
    </Head>
  );
}
