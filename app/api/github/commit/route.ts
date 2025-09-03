// app/api/github/commit/route.ts
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

        // Get GitHub access token
        const response = await (await clerkClient()).users.getUserOauthAccessToken(
            userId,
            "github"
        );
        const token = response.data[0].token;

        // Get user info to get username
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const userData = await githubUserResponse.json();
        const username = userData.login;

        // First, check if the repository exists
        const repoResponse = await fetch(
            `https://api.github.com/repos/${username}/${username}`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        // If repository doesn't exist, create it
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

            // Wait a moment for the repository to be fully created
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Get current file SHA (if it exists) for updating
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

        // Prepare the commit data
        const commitData: any = {
            message: commitMessage,
            content: Buffer.from(content).toString("base64"),
        };

        // If file exists, include the SHA for updating
        if (currentSha) {
            commitData.sha = currentSha;
        }

        // Create or update the README.md file
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