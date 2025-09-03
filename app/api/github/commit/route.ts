import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content, commitMessage } = await request.json();

        if (!content || !commitMessage) {
            return NextResponse.json(
                { error: "Content and commit message are required" },
                { status: 400 }
            );
        }

        const response = await (await clerkClient()).users.getUserOauthAccessToken(
            userId,
            "github"
        );
        const token = response.data[0].token;

        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const userData = await githubUserResponse.json();
        const username = userData.login;

        const repoResponse = await fetch(
            `https://api.github.com/repos/${username}/${username}`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (repoResponse.status === 404) {
            const createRepoResponse = await fetch(
                "https://api.github.com/user/repos",
                {
                    method: "POST",
                    headers: {
                        Authorization: `token ${token}`,
                        Accept: "application/vnd.github.v3+json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: username,
                        description: `${username}'s profile repository`,
                        public: true,
                        auto_init: true,
                    }),
                }
            );

            if (!createRepoResponse.ok) {
                const errorData = await createRepoResponse.json();
                return NextResponse.json(
                    { error: "Failed to create repository", details: errorData },
                    { status: 500 }
                );
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        let currentSha = null;
        const currentFileResponse = await fetch(
            `https://api.github.com/repos/${username}/${username}/contents/README.md`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (currentFileResponse.ok) {
            const currentFileData = await currentFileResponse.json();
            currentSha = currentFileData.sha;
        }

        const commitData: any = {
            message: commitMessage,
            content: Buffer.from(content).toString("base64"),
        };

        if (currentSha) {
            commitData.sha = currentSha;
        }

        const updateResponse = await fetch(
            `https://api.github.com/repos/${username}/${username}/contents/README.md`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commitData),
            }
        );

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            return NextResponse.json(
                { error: "Failed to commit changes", details: errorData },
                { status: 500 }
            );
        }

        const updateData = await updateResponse.json();

        return NextResponse.json({
            success: true,
            commit: updateData.commit,
            message: "Changes committed successfully!",
        });

    } catch (error) {
        console.error("Error committing to GitHub:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}