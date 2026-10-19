import type { GetServerSideProps } from "next";
import { sitemapXml } from "../lib/crawl";
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.end(sitemapXml());
  return { props: {} };
};
export default function Sitemap() { return null; }
