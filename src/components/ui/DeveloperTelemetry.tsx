import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Code2, GitFork, Github, Star, Users } from "lucide-react";
import { fetchGithubDeveloperTelemetry } from "../../lib/github";
import { profile } from "../../lib/profile";

function formatDate(value?: string) {
  if (!value) return "--";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value));
  } catch {
    return "--";
  }
}

function MetricRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 border-b border-white/5 py-3">
      <dt className="flex min-w-0 items-center gap-2 font-black text-gray-300">
        {icon}
        <span className="break-words">{label}</span>
      </dt>
      <dd className="min-w-0 break-words font-bold text-white">{value}</dd>
    </div>
  );
}

export default function DeveloperTelemetry() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["githubDeveloperTelemetry"],
    queryFn: fetchGithubDeveloperTelemetry,
    staleTime: 1000 * 60 * 30,
  });

  const telemetry = data?.telemetry;
  const status = isLoading
    ? "SYNCING_DEVELOPER_SIGNAL"
    : data?.configured === false
      ? "GITHUB_CONFIG_MISSING"
      : error || !data?.ok
        ? "GITHUB_SIGNAL_OFFLINE"
        : "DEVELOPER_SIGNAL_ONLINE";

  return (
    <section
      aria-labelledby="developer-telemetry-title"
      className="min-w-0 rounded-sm border border-neon-blue/15 bg-neon-blue/5 p-4 font-mono text-xs uppercase text-gray-300"
    >
      <div className="mb-3 flex flex-col gap-3 border-b border-white/5 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 id="developer-telemetry-title" className="font-black text-neon-blue">
            BYTEPROWLER TELEMETRY
          </h3>
          <p className="mt-1 text-[10px] text-gray-400">PUBLIC_DEV_SIGNAL</p>
        </div>
        <span className={`break-words ${status === "DEVELOPER_SIGNAL_ONLINE" ? "font-black text-neon-green" : "font-black text-neon-purple"}`}>
          {status}
        </span>
      </div>

      <dl className="grid min-w-0 grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricRow
          icon={<Activity className="h-3.5 w-3.5 shrink-0 text-neon-lime" aria-hidden="true" />}
          label="BUILDING_SINCE"
          value={profile.developerStartYear}
        />
        <MetricRow
          icon={<Github className="h-3.5 w-3.5 shrink-0 text-neon-blue" aria-hidden="true" />}
          label="PUBLIC_REPOS"
          value={telemetry?.publicRepos ?? "--"}
        />
        <MetricRow
          icon={<Star className="h-3.5 w-3.5 shrink-0 text-neon-lime" aria-hidden="true" />}
          label="STARS_RECEIVED"
          value={telemetry?.starsReceived ?? "--"}
        />
        <MetricRow
          icon={<GitFork className="h-3.5 w-3.5 shrink-0 text-neon-purple" aria-hidden="true" />}
          label="FORKS_RECEIVED"
          value={telemetry?.forksReceived ?? "--"}
        />
        <MetricRow
          icon={<Users className="h-3.5 w-3.5 shrink-0 text-neon-green" aria-hidden="true" />}
          label="FOLLOWERS"
          value={telemetry?.followers ?? "--"}
        />
        <MetricRow
          icon={<Code2 className="h-3.5 w-3.5 shrink-0 text-neon-blue" aria-hidden="true" />}
          label="TOP GITHUB LANGUAGES"
          value={telemetry?.primaryLanguages?.join(", ") || "--"}
        />
      </dl>

      {telemetry?.recentlyUpdatedRepo && (
        <a
          href={telemetry.recentlyUpdatedRepo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-w-0 flex-col gap-1 border-t border-white/10 pt-3 text-xs font-bold text-gray-300 transition hover:text-neon-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4"
          aria-label={`Open recently updated GitHub repository ${telemetry.recentlyUpdatedRepo.name}`}
        >
          <span className="block font-black text-neon-blue">LATEST_PROJECT_ACTIVITY</span>
          <span className="break-all text-white">{telemetry.recentlyUpdatedRepo.name}</span>
          <span className="mt-1 block text-gray-400">
            PUSHED: {formatDate(telemetry.recentlyUpdatedRepo.pushedAt || telemetry.recentlyUpdatedRepo.updatedAt)}
          </span>
        </a>
      )}
    </section>
  );
}
