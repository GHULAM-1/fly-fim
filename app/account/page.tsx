"use client";
import React, { useState, useTransition, useEffect } from "react";
import { ChevronRight, Mail, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signInWithMagicLink } from "@/lib/actions/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  TbBrandInstagramFilled,
  TbBrandYoutubeFilled,
  TbBrandLinkedinFilled,
  TbBrandFacebookFilled,
  TbBrandTwitterFilled,
  TbBrandPinterest,
  TbBrandPinterestFilled,
} from "react-icons/tb";
import { toast } from "@/components/toast";

const AccountPage = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"welcome" | "email-sent">("welcome");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Close drawer when user becomes authenticated
  useEffect(() => {
    if (user && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [user, isDrawerOpen]);

  const handleGoogleSignIn = () => {
    setError(null);
    startTransition(async () => {
      const result = await signInWithGoogle();

      if (result?.error) {
        setError(result.error);
      }
      // Note: If successful, user will be redirected to Google
    });
    // toast.success("You have successfully signed in!");
    // console.log("handleGoogleSignIn");
  };

  const handleSendMagicLink = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await signInWithMagicLink(email);

      if (result?.error) {
        setError(result.error);
      } else {
        setMode("email-sent");
      }
    });
  };

  const resetDrawer = () => {
    setMode("welcome");
    setEmail("");
    setError(null);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      resetDrawer();
    }
  };

  // If user is signed in, show account management interface
  if (user) {
    const profileImage =
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      user?.identities?.[0]?.identity_data?.avatar_url ||
      user?.identities?.[0]?.identity_data?.picture;

    return (
      <div className="mt-15 mb-10 min-h-screen bg-gray-50">
        <div className="flex items-center justify-between gap-4 px-6 py-8">
          <div>
            <h1 className="text-lg font-heading text-gray-900">
              {user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                "User"}
            </h1>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profileImage}
              alt="Profile picture"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-2xl text-white">
              😊
            </AvatarFallback>
          </Avatar>
        </div>
        <hr />
        <div className="px-6 py-8">
          <h2 className="font-heading text-gray-800 mb-5">My Account</h2>
          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Bookings</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">City</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Select city</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Language</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">English</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Credits</span>
            <span className="text-gray-500">$0</span>
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Saved cards</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Settings</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
        <hr />
        {/* Help Section */}
        <div className="px-6 py-8">
          <h2 className="font-heading text-gray-800 mb-5">Help</h2>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Chat</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">FAQs</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
        <hr />
        <div className="px-6 py-8">
          <h2 className="font-heading text-gray-800 mb-5">Legal</h2>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Privacy Policy</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-gray-800">Terms of Usage</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
        <hr />
        <div className="px-6 py-8 ">
          <button className="text-sm text-gray-800" onClick={signOut}>
            Sign Out
          </button>
        </div>
        <div className="px-6 py-8 ">
          <button className="text-sm text-gray-800"></button>
        </div>
        <div className="px-6 py-8 ">
          <button className="text-sm text-gray-800"></button>
        </div>
        <div className="px-6 py-8 ">
          <button className="text-sm text-gray-800"></button>
        </div>
      </div>
    );
  }

  // If user is not signed in, show authentication interface
  return (
    <div className="mt-15">
      <div className="bg-gradient-to-br from-white to-primary/10 px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4 mb-[32px]">
            <h1 className="text-sm font-text text-[#444444] leading-[20px] tracking-wide">
              Sign in or register to get exclusive members-only deals,
              personalised recommendations and so much more
            </h1>
          </div>
          <div className="flex-shrink-0">
            {/* Blue chart illustration */}
            <div className="w-20 h-16 relative">
              <svg viewBox="0 0 80 64" className="w-full h-full">
                {/* Background circles */}
                <circle cx="65" cy="15" r="3" fill="#dbeafe" />
                <circle cx="70" cy="25" r="2" fill="#bfdbfe" />
                <circle cx="75" cy="35" r="1.5" fill="#93c5fd" />

                {/* Bar chart */}
                <rect
                  x="20"
                  y="45"
                  width="8"
                  height="15"
                  rx="2"
                  fill="#3b82f6"
                />
                <rect
                  x="32"
                  y="35"
                  width="8"
                  height="25"
                  rx="2"
                  fill="#2563eb"
                />
                <rect
                  x="44"
                  y="25"
                  width="8"
                  height="35"
                  rx="2"
                  fill="#1d4ed8"
                />
                <rect
                  x="56"
                  y="15"
                  width="8"
                  height="45"
                  rx="2"
                  fill="#1e40af"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="space-y-4 ">
          <Button
            variant="outline"
            className="w-full rounded-[12px] justify-center shadow-none gap-3 py-6 text-gray-700"
            onClick={handleGoogleSignIn}
            disabled={isPending}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isPending ? (
              "Connecting..."
            ) : (
              <span className="font-heading tracking-wider text-[16px] text-[#444444]">
                Continue with Google
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center shadow-none gap-3 py-6 text-[#444444]"
            onClick={() => {
              // TODO: Implement Apple OAuth
              console.log("Apple sign in");
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
              <path d="M15.53 3.83c.893-1.09 1.477-2.602 1.305-4.112-1.265.056-2.79.856-3.683 1.928-.826.942-1.553 2.455-1.36 3.902 1.426.104 2.88-.717 3.738-1.718z" />
            </svg>

            <span className="font-heading tracking-wider text-[16px]">
              Continue with Apple
            </span>
          </Button>
          <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-center shadow-none gap-3 py-6 text-gray-700"
              >
                <Mail className="text-[#444444]" size={20} />
                <span className="text-[#444444] font-heading tracking-wider text-[16px]">
                  Continue with email
                </span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-3xl">
              <div className="flex flex-col h-full">
                {mode === "welcome" && (
                  <>
                    {/* Header */}
                    <DrawerHeader className="flex flex-row items-center justify-between pb-[12px] border-b border-gray-100">
                      <DrawerTitle className="text-[18px] font-medium text-gray-900">
                        Welcome to Fly in minute
                      </DrawerTitle>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X size={20} className="text-gray-500" />
                        </Button>
                      </DrawerClose>
                    </DrawerHeader>

                    {/* Content */}
                    <div className="flex-1 px-5 pb-4 pt-[12px] overflow-auto">
                      <p className="text-[#444444] text-[12px] mb-6 leading-relaxed">
                        Sign in or register to get exclusive members-only deals,
                        personalised recommendations and so much more
                      </p>

                      {/* Auth Buttons */}
                      <div className="space-y-4 mb-6">
                        <Button
                          variant="outline"
                          className="w-full justify-center gap-3 py-5 text-gray-700 shadow-none"
                          onClick={handleGoogleSignIn}
                          disabled={isPending}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          {isPending ? (
                            "Connecting..."
                          ) : (
                            <span className="font-heading text-[16px]">
                              Continue with Google
                            </span>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-center gap-3 py-5 text-gray-700 shadow-none"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
                            <path d="M15.53 3.83c.893-1.09 1.477-2.602 1.305-4.112-1.265.056-2.79.856-3.683 1.928-.826.942-1.553 2.455-1.36 3.902 1.426.104 2.88-.717 3.738-1.718z" />
                          </svg>
                          Continue with Apple
                        </Button>
                      </div>

                      {/* OR Divider */}
                      <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-gray-500 text-sm">OR</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                      </div>

                      {/* Email Section */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Continue with email
                          </h3>
                          <p className="text-[#444444] font-lightText text-[12px] mb-4">
                            We'll send a link to your email that will instantly
                            sign you in
                          </p>
                        </div>

                        <Input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-[16px] font-text text-[#444444] py-5 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-none"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              email &&
                              email.includes("@") &&
                              !isPending
                            ) {
                              handleSendMagicLink();
                            }
                          }}
                        />

                        {error && (
                          <p className="text-sm text-red-600">{error}</p>
                        )}

                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-5 text-sm shadow-none rounded-lg"
                          onClick={handleSendMagicLink}
                          disabled={!email || !email.includes("@") || isPending}
                        >
                          {isPending ? "Sending..." : "Send link"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {mode === "email-sent" && (
                  <>
                    {/* Header */}
                    <DrawerHeader className="flex flex-row items-center justify-between p-5 border-b border-gray-100">
                      <DrawerTitle className="text-xl font-medium text-gray-900">
                        Check your email!
                      </DrawerTitle>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X size={20} className="text-gray-500" />
                        </Button>
                      </DrawerClose>
                    </DrawerHeader>

                    {/* Content */}
                    <div className="flex-1 px-5 py-8 flex flex-col items-center text-center">
                      <div className="mx-auto mb-6 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <Send className="w-8 h-8 text-purple-600" />
                      </div>

                      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                        To sign in, tap the button in the email we sent to
                        <br />
                        <strong>{email}</strong>
                      </p>

                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setMode("welcome")}
                      >
                        Back to sign in options
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Settings Section */}
      <div className="mt-8 mx-6 pb-[20px] mb-[32px] bg-white text-[#444444] border-b border-[#E2E2E2]">
        <div className="py-4 ">
          <h2 className="text-[16px] font-bold text-[#444444]">Settings</h2>
        </div>

        <div className="">
          <button className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors text-sm">
            <span className="font-text ">City</span>
            <div className="flex items-center gap-2">
              <span className="font-text">Select city</span>
              <ChevronRight size={16} className="" />
            </div>
          </button>

          <button className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors text-sm">
            <span className="font-text ">Language</span>
            <div className="flex items-center gap-2">
              <span className="font-text">English</span>
              <ChevronRight size={16} className="" />
            </div>
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-4 mx-6 pb-[20px] mb-[32px] bg-white text-[#444444] border-b border-[#E2E2E2]">
        <div className="mb-[12px] ">
          <h2 className="text-[16px] font-bold text-[#444444]">Help</h2>
        </div>

        <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors text-sm">
          <span className="font-text">Chat</span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors text-sm">
          <span className="font-text">FAQs</span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Legal Section */}
      <div className="mt-4 mx-6 pb-[20px] mb-[32px] bg-white text-[#444444] border-b border-[#E2E2E2]">
        <div className="mb-[12px] ">
          <h2 className="text-[16px] font-bold text-[#444444]">Legal</h2>
        </div>

        <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors text-sm">
          <span className="font-text">Privacy Policy</span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors text-sm">
          <span className="font-text">Terms of Usage</span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-4 justify-start mx-6 text-gray-500">
        <a
          href="https://www.linkedin.com/company/fly-in-minute"
          className="hover:text-primary"
        >
          <TbBrandLinkedinFilled size={16} />
        </a>
        <a
          href="https://www.instagram.com/flyfim/"
          className="hover:text-primary"
        >
          <TbBrandInstagramFilled size={16} />
        </a>
        <a
          href="https://www.youtube.com/@flyfim650"
          className="hover:text-primary"
        >
          <TbBrandYoutubeFilled size={16} />
        </a>
        <a
          href="https://www.facebook.com/flyfim"
          className="hover:text-primary"
        >
          <TbBrandFacebookFilled size={16} />
        </a>
        <a href="https://www.pinterest.com/flyfim/" className="hover:text-primary">
          <TbBrandPinterestFilled size={16} />
        </a>
      </div>

      {/* <div className="mt-[16px] text-[#888888] mx-6 pb-[180px]">
        <p className=" text-[12px]">Headout Inc.</p>
        <p className=" text-[12px]">Made with ❤️ all over the 🌎</p>
      </div> */}

      {/* Bottom padding for mobile tabs */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default AccountPage;
