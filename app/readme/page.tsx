import { clerkClient, currentUser } from "@clerk/nextjs/server";
import Editor from "./Editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Chat from "./Chat";

export default async function ReadMe() {
  const user = await currentUser();
  if (!user) {
    return <div>Please sign in</div>;
  }

  try {
    const response = (await clerkClient()).users.getUserOauthAccessToken(
      user.id,
      "github"
    );

    const data = await response;
    const token = data.data[0].token;

    // First, get user info to get the username
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await githubUserResponse.json();
    const username = userData.login;

    // Get the profile README from the special repository (username/username)
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/README.md`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    let readmeContent = null;
    let readmeExists = false;

    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      // GitHub API returns content as base64, so we need to decode it
      readmeContent = Buffer.from(readmeData.content, "base64").toString(
        "utf-8"
      );
      readmeExists = true;
    } else if (readmeResponse.status === 404) {
      // README doesn't exist yet
      readmeExists = false;
      readmeContent = "No profile README found. Would you like to create one?";
    } else {
      // Some other error
      throw new Error(`GitHub API error: ${readmeResponse.status}`);
    }

    return (
      <div className="w-full h-full">
        {readmeExists ? (
          <ResizablePanelGroup direction={"horizontal"}>
            <ResizablePanel
              collapsedSize={0}
              minSize={25}
              defaultSize={30}
              maxSize={40}
              collapsible
            >
              <Chat />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              defaultSize={70}
              minSize={50}
              collapsedSize={0}
              collapsible
              className="p-6"
            >
              <Editor content={readmeContent} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <p className="text-gray-600 italic">{readmeContent}</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p>Failed to fetch GitHub data: {error.message}</p>
        <p className="text-sm text-gray-600 mt-2">
          Make sure you have the correct GitHub OAuth scopes configured.
        </p>
      </div>
    );
  }
}
