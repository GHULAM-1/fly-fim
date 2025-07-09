"use client";
import { LogOut, User as UserIcon } from "lucide-react";
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
import type { User } from "@supabase/supabase-js";

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
  const faceSize = size === "large" ? "text-2xl" : "text-lg";
  const profileImage =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.identities?.[0]?.identity_data?.avatar_url ||
    user.identities?.[0]?.identity_data?.picture;

  if (profileImage) {
    return (
      <Avatar className={`${sizeClasses} border border-white`}>
        <AvatarImage
          src={profileImage}
          alt="Profile picture"
          className="object-cover"
        />
        <AvatarFallback
          className={`bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center ${
            scrolled ? "shadow-sm" : "shadow-sm"
          }`}
        >
          <div className={`${faceSize} text-white/90 select-none`}>😊</div>
        </AvatarFallback>
      </Avatar>
    );
  }

  // Fallback to emoji avatar
  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center ${
        scrolled ? "shadow-sm" : "shadow-sm"
      }`}
    >
      <div className={`${faceSize} text-white/90 select-none`}>😊</div>
    </div>
  );
}

export function UserDropdown({ user, scrolled }: UserDropdownProps) {
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
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
              <p className="text-base font-semibold leading-none">
                {displayName}
              </p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem>Booking</DropdownMenuItem>
        <DropdownMenuItem>Credits</DropdownMenuItem>
        <DropdownMenuItem>Saved Cards</DropdownMenuItem>
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
