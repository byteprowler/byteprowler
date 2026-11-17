import type { NextApiRequest, NextApiResponse } from "next";
import type { GithubDeveloperTelemetryResponse } from "../../../lib/github";

interface GithubUserPayload {
  public_repos?: number;
  followers?: number;
}

interface GithubRepoPayload {
  private?: boolean;
  name?: string;
  html_url?: string;
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  pushed_at?: string | null;
  updated_at?: string | null;
  fork?: boolean;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  return headers;
}

function buildPrimaryLanguages(repos: GithubRepoPayload[]) {
  const counts = new Map<string, number>();

  repos.forEach((repo) => {
    if (!repo.language) return;
    counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([language]) => language);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GithubDeveloperTelemetryResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ configured: false, ok: false, message: "METHOD_NOT_ALLOWED" });
  }

  const username = process.env.GITHUB_USERNAME?.trim();

  if (!username) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ configured: false, ok: false, message: "GITHUB_CONFIG_MISSING" });
  }

  try {
    const options = { headers: getHeaders(), signal: AbortSignal.timeout(5000), redirect: "error" as const };
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, options),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&direction=desc&per_page=100`, options),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ configured: true, ok: false, message: "GITHUB_SIGNAL_OFFLINE" });
    }

    const user = (await userResponse.json()) as GithubUserPayload;
    const repos = ((await reposResponse.json()) as GithubRepoPayload[]).filter((repo) => repo?.private === false && !repo.fork);
    const recentlyUpdatedRepo = repos.find((repo) => repo.name && repo.html_url);

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=7200");
    return res.status(200).json({
      configured: true,
      ok: true,
      telemetry: {
        publicRepos: user.public_repos || repos.length,
        starsReceived: repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0),
        forksReceived: repos.reduce((total, repo) => total + (repo.forks_count || 0), 0),
        followers: user.followers || 0,
        primaryLanguages: buildPrimaryLanguages(repos),
        recentlyUpdatedRepo: recentlyUpdatedRepo
          ? {
              name: recentlyUpdatedRepo.name || "unknown-repo",
              url: recentlyUpdatedRepo.html_url || `https://github.com/${username}`,
              pushedAt: recentlyUpdatedRepo.pushed_at || undefined,
              updatedAt: recentlyUpdatedRepo.updated_at || undefined,
            }
          : undefined,
      },
    });
  } catch {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ configured: true, ok: false, message: "GITHUB_SIGNAL_OFFLINE" });
  }
}
