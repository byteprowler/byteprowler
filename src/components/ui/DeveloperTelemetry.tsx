import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Code2, GitFork, Github, Radio, Star, Users } from "lucide-react";
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
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/5 py-1.5">
      <dt className="flex min-w-0 items-center gap-2 font-black text-gray-300">
        {icon}
        <span className="truncate">{label}</span>
      </dt>
      <dd className="min-w-0 text-right font-bold text-white">{value}</dd>
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
      className="rounded-sm border border-neon-blue/15 bg-neon-blue/5 px-3 py-3 font-mono text-[10.5px] uppercase tracking-widest text-gray-300"
    >
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-white/5 pb-2">
        <div>
          <h3 id="developer-telemetry-title" className="font-black text-neon-blue">
            BYTEPROWLER TELEMETRY
          </h3>
          <p className="mt-1 text-[10px] text-gray-400">PUBLIC_DEV_SIGNAL</p>
        </div>
        <span className={status === "DEVELOPER_SIGNAL_ONLINE" ? "font-black text-neon-green" : "font-black text-neon-purple"}>
          {status}
        </span>
      </div>

      <dl className="flex flex-col gap-1">
        <MetricRow
          icon={<Radio className="h-3.5 w-3.5 shrink-0 text-neon-green" aria-hidden="true" />}
          label="CODE_SIGNAL"
          value={status === "DEVELOPER_SIGNAL_ONLINE" ? "ONLINE" : "STANDBY"}
        />
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
          label="PRIMARY_LANG"
          value={telemetry?.primaryLanguages?.join(", ") || "--"}
        />
      </dl>

      {telemetry?.recentlyUpdatedRepo && (
        <a
          href={telemetry.recentlyUpdatedRepo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-sm border border-white/10 bg-black/45 px-3 py-2 text-[10px] font-bold text-gray-300 transition hover:border-neon-blue/35 hover:text-neon-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          aria-label={`Open recently updated GitHub repository ${telemetry.recentlyUpdatedRepo.name}`}
        >
          <span className="block font-black text-neon-blue">LATEST_PROJECT_ACTIVITY</span>
          <span className="mt-1 block truncate text-white">{telemetry.recentlyUpdatedRepo.name}</span>
          <span className="mt-1 block text-gray-400">
            PUSHED: {formatDate(telemetry.recentlyUpdatedRepo.pushedAt || telemetry.recentlyUpdatedRepo.updatedAt)}
          </span>
        </a>
      )}
    </section>
  );
}
