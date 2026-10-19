import type { NextApiRequest, NextApiResponse } from "next";
import type { GithubRepoMetadataResponse } from "../../../lib/github";

const repoSegmentPattern = /^[A-Za-z0-9_.-]+$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GithubRepoMetadataResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "METHOD_NOT_ALLOWED" });
  }

  const owner = typeof req.query.owner === "string" ? req.query.owner.trim() : "";
  const repo = typeof req.query.repo === "string" ? req.query.repo.trim() : "";

  if (!owner || !repo || !repoSegmentPattern.test(owner) || !repoSegmentPattern.test(repo)) {
    return res.status(400).json({ ok: false, message: "INVALID_REPO_QUERY" });
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

    if (!response.ok) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        ok: false,
        message: response.status === 404 ? "GITHUB_REPO_UNAVAILABLE" : "GITHUB_SIGNAL_OFFLINE",
      });
    }

    const payload = await response.json();
    if (payload.private !== false) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ ok: false, message: "GITHUB_REPO_UNAVAILABLE" });
    }
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({
      ok: true,
      repo: {
        description: typeof payload.description === "string" ? payload.description : undefined,
        stars: typeof payload.stargazers_count === "number" ? payload.stargazers_count : undefined,
        forks: typeof payload.forks_count === "number" ? payload.forks_count : undefined,
        language: typeof payload.language === "string" ? payload.language : undefined,
        topics: Array.isArray(payload.topics) ? payload.topics.slice(0, 6) : undefined,
        updatedAt: typeof payload.updated_at === "string" ? payload.updated_at : undefined,
        pushedAt: typeof payload.pushed_at === "string" ? payload.pushed_at : undefined,
        url: typeof payload.html_url === "string" ? payload.html_url : undefined,
      },
    });
  } catch (error) {
    console.error("GITHUB_SIGNAL_OFFLINE", error instanceof Error ? error.message : error);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ ok: false, message: "GITHUB_SIGNAL_OFFLINE" });
  }
}
