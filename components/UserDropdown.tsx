"use client";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/hooks/useAuth";
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface UserDropdownProps {
  user: User;
  scrolled: boolean;
}

// Custom avatar component that handles both Google images and fallback emoji
function CustomAvatar({
  user,
  size = "small",
  scrolled = false,
}: {
  user: User;
  size?: "small" | "large";
  scrolled?: boolean;
}) {
  const sizeClasses = size === "large" ? "h-12 w-12" : "h-10 w-10";
  return (
    <Avatar className={`${sizeClasses} border border-white`}>
      <AvatarImage
        src={"/images/user.svg"}
        alt="Profile picture"
        className="object-cover"
      />
    </Avatar>
  );
}

export function UserDropdown({ user, scrolled }: UserDropdownProps) {
  const displayName =
    user.name ||
    user.email?.split("@")[0] ||
    "User";
  const email = user.email || "";
  const { signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
          aria-label="User menu"
        >
          <CustomAvatar user={user} size="small" scrolled={scrolled} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 p-3 space-y-3 text-gray-600"
        align="end"
        sideOffset={5}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center space-x-3">
            <CustomAvatar user={user} size="large" scrolled={true} />
            <div className="space-y-1">
              <p className="text-base font-heading leading-none">
                {displayName}
              </p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem>Booking</DropdownMenuItem>
        <DropdownMenuItem>Credits</DropdownMenuItem>
        <DropdownMenuItem>Saved Cards</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Dashboard
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>Delete Account</DropdownMenuItem>
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-600 focus:text-red-600"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
