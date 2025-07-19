import React from "react";
import { Compass, LayoutGrid, User } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { FaCompass, FaRegCompass, FaUser, FaRegUser } from "react-icons/fa";
import { BsGrid, BsFillGridFill } from "react-icons/bs";
import Link from "next/link";

const Tabs = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const profileImage =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 bg-white z-50 border-t">
      <Link href="/" className="flex flex-col items-center gap-1">
        {pathname === "/" ? (
          <FaCompass size={20} />
        ) : (
          <FaRegCompass size={20} />
        )}
        <span className="text-[10px]">Explore</span>
      </Link>
      <Link href="#" className="flex flex-col items-center gap-1">
        {pathname === "/categories" ? (
          <BsFillGridFill size={20} />
        ) : (
          <BsGrid size={20} />
        )}
        <span className="text-[10px]">Categories</span>
      </Link>
      <Link href="/account" className="flex flex-col items-center gap-1">
        {loading ? (
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
        ) : user ? (
          <Avatar className="h-6 w-6 border border-white">
            <AvatarImage
              src="/images/user.svg"
              alt="Profile picture"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center">
              <div className="text-lg text-white/90 select-none">😊</div>
            </AvatarFallback>
          </Avatar>
        ) : pathname === "/account" ? (
          <FaUser size={20} />
        ) : (
          <FaRegUser size={20} />
        )}
        <span className="text-[10px]">Account</span>
      </Link>
    </div>
  );
};

export default Tabs;
