import type { GetServerSideProps } from "next";
import { robotsText } from "../lib/crawl";
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(robotsText());
  return { props: {} };
};
export default function Robots() { return null; }
