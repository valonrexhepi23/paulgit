import { SignOutButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface TopChatBarInterface {
  userName: string;
  repositoryName: string;
  userImgUrl: string;
}

export default function TopChatBar({
  userName,
  repositoryName,
  userImgUrl,
}: TopChatBarInterface) {
  return (
    <div className="h-20 items-center shrink-0 p-2 px-4 flex w-full justify-between">
      <p className="text-xs tracking-tight max-w-54 truncate p-1 border rounded-sm bg-gray-100 border-gray-200 shadow-xs font-mono px-2">{`${repositoryName}/README.md`}</p>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src={userImgUrl}
            alt="user profile image"
            className="rounded-sm shadow-sm"
            width={30}
            height={30}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="tracking-tight">
          <DropdownMenuLabel className="text-xs text-gray-400">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href={`https://github.com/${userName}`}
              target="_blank"
              className="flex items-center gap-2"
            >
              Profile <ExternalLink className="size-3" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="tracking-tight">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
