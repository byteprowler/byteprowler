import { useQuery } from "@tanstack/react-query";
import { Github } from "lucide-react";
import { capturePortfolioEvent } from "../../lib/posthog";


interface GithubActivity {
    id: string;
    repo: string;
    action: string;
    url: string;
    createdAt: string;
}

async function getGithubActivity() {
    const res =
        await fetch("/api/github/activity");
    if (!res.ok) {
        throw new Error(
            "GITHUB_SIGNAL_OFFLINE"
        );
    }
    return res.json();
}


function relativeTime(date: string) {
    return new Intl.RelativeTimeFormat(
        "en",
        {
            numeric: "auto"
        }
    ).format(
        Math.floor(
            (
                new Date(date).getTime()
                -
                Date.now()
            )
            / 60000
        ),
        "minute"
    );
}


export default function GithubSignal() {
    const {
        data,
        isLoading,
        error,
        isFetching,
        refetch

    } = useQuery({

        queryKey: [
            "github-activity"
        ],

        queryFn:
            getGithubActivity,
        staleTime:
            1000 * 60 * 10,
        refetchInterval:
            1000 * 60 * 10,
        refetchIntervalInBackground: false,
    });
    if (isLoading) {
        return (
            <div className="font-mono text-sm text-gray-400">
                SYNCING_GITHUB_SIGNAL...
            </div>
        )
    }
    if (error) {
        return (
            <div className="font-mono text-sm text-red-400">
                GITHUB_SIGNAL_OFFLINE
            </div>
        )
    }
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center text-neon-lime">
                    <Github size={16} />
                    <span>
                        GITHUB_ACTIVITY
                    </span>
                </div>
                <button
                    onClick={() => {
                        capturePortfolioEvent("portfolio_activity_refreshed", { activity_type: "github" });
                        void refetch();
                    }}
                    className="text-xs border border-neon-lime/30 px-3 py-2 rounded hover:bg-neon-lime/10"
                >

                    {isFetching
                        ?
                        "SYNCING"
                        :
                        "REFRESH"
                    }

                </button>


            </div>



            {
                data?.activities?.map(
                    (item: GithubActivity) => (

                        <a

                            key={item.id}

                            href={item.url}

                            target="_blank"

                            rel="noreferrer"

                            className="
block
border
border-white/10
p-3
hover:border-neon-lime/40
"
                        >
                            <p className="text-neon-lime font-bold text-xs">
                                {item.action}
                            </p>
                            <p className="text-white text-sm">
                                {item.repo}
                            </p>
                            <p className="text-gray-500 text-xs">
                                {relativeTime(item.createdAt)}
                            </p>
                        </a>
                    )
                )
            }
        </div>
    )
}
