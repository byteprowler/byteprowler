export interface GithubRepoMetadata {
  description?: string;
  stars?: number;
  forks?: number;
  language?: string;
  topics?: string[];
  updatedAt?: string;
  pushedAt?: string;
  url?: string;
}

export interface GithubRepoMetadataResponse {
  ok: boolean;
  repo?: GithubRepoMetadata;
  message?: string;
}

export interface GithubDeveloperTelemetry {
  publicRepos: number;
  starsReceived: number;
  forksReceived: number;
  followers: number;
  primaryLanguages: string[];
  recentlyUpdatedRepo?: {
    name: string;
    url: string;
    pushedAt?: string;
    updatedAt?: string;
  };
}

export interface GithubDeveloperTelemetryResponse {
  configured: boolean;
  ok: boolean;
  telemetry?: GithubDeveloperTelemetry;
  message?: "GITHUB_CONFIG_MISSING" | "GITHUB_SIGNAL_OFFLINE" | "METHOD_NOT_ALLOWED";
}

export async function fetchGithubRepoMetadata(
  owner: string,
  repo: string,
): Promise<GithubRepoMetadataResponse> {
  const params = new URLSearchParams({ owner, repo });
  const response = await fetch(`/api/github/repo?${params.toString()}`);

  if (!response.ok) {
    throw new Error("GITHUB_SIGNAL_OFFLINE");
  }

  return (await response.json()) as GithubRepoMetadataResponse;
}

export async function fetchGithubDeveloperTelemetry(): Promise<GithubDeveloperTelemetryResponse> {
  const response = await fetch("/api/github/profile");

  if (!response.ok) {
    throw new Error("GITHUB_SIGNAL_OFFLINE");
  }

  return (await response.json()) as GithubDeveloperTelemetryResponse;
}

export interface GithubActivity {
  id: string;
  type: string;
  repo: string;
  action: string;
  url?: string;
  createdAt: string;
}


export async function fetchGithubActivity(
  username: string,
  limit = 5
): Promise<GithubActivity[]> {

  if (!username) {
    return [];
  }


  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/events/public`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      next: {
        revalidate: 120,
      }
    }
  );


  if (!response.ok) {
    throw new Error("GITHUB_SIGNAL_OFFLINE");
  }


  const events = await response.json();


  return events
    .slice(0, limit)
    .map((event: any) => ({

      id: event.id,

      type: event.type,

      repo: event.repo?.name ?? "UNKNOWN_REPOSITORY",

      action: formatGithubEvent(event),

      url:
        event.repo?.url
          ?.replace(
            "api.github.com/repos",
            "github.com"
          ) || "",


      createdAt: event.created_at

    }));

}



function formatGithubEvent(event: any) {

  switch (event.type) {

    case "PushEvent":

      return `PUSHED ${event.payload?.commits?.length || 0
        } COMMIT(S)`;



    case "CreateEvent":

      return `CREATED ${event.payload?.ref_type || "RESOURCE"
        }`;


    case "PullRequestEvent":

      return `PULL REQUEST ${event.payload?.action
        }`;



    case "WatchEvent":

      return "STARRED REPOSITORY";


    default:

      return event.type
        .replace("Event", "")
        .toUpperCase();

  }

}
