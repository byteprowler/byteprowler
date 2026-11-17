import type {
    NextApiRequest,
    NextApiResponse
} from "next";

import {
    fetchGithubActivity
} from "@/lib/github";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "GET") {

        return res.status(405).json({
            message: "METHOD_NOT_ALLOWED"
        });

    }


    const username =
        process.env.GITHUB_USERNAME;



    if (!username) {

        return res.status(200).json({
            configured: false,
            activities: []
        });

    }



    try {


        const activities =
            await fetchGithubActivity(
                username,
                5
            );


        res.setHeader(
            "Cache-Control",
            "s-maxage=120, stale-while-revalidate=60"
        );


        return res.status(200).json({

            configured: true,

            activities

        });


    } catch (error) {


        return res.status(500).json({

            configured: true,

            message: "GITHUB_SIGNAL_OFFLINE",

            activities: []

        });


    }


}