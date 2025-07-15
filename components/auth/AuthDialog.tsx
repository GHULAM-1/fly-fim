"use client";

import { useState, useTransition, useEffect } from "react";
import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { signInWithMagicLink, signInWithGoogle } from "@/lib/actions/auth";
import { useAuth } from "@/lib/hooks/useAuth";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"welcome" | "email-sent">("welcome");
  const [email, setEmail] = useState("");
  const { user } = useAuth();

  // Close dialog when user becomes authenticated
  useEffect(() => {
    if (user && open) {
      onOpenChange(false);
    }
  }, [user, open, onOpenChange]);

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

  const handleGoogleSignIn = () => {
    setError(null);
    startTransition(async () => {
      const result = await signInWithGoogle();

      if (result?.error) {
        setError(result.error);
      }
      // Note: If successful, user will be redirected to Google
    });
  };

  const resetDialog = () => {
    setMode("welcome");
    setEmail("");
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetDialog();
      }}
    >
      <DialogContent className="sm:max-w-md">
        {mode === "welcome" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-extralight">
                Welcome to Fly in minute
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Sign in or register to get exclusive members-only deals,
                personalised recommendations and so much more
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <Button
                variant="outline"
                className="w-full justify-center gap-3 py-6 shadow-none font-semibold"
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
                {isPending ? "Connecting..." : "Continue with Google"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-center gap-3 py-6 shadow-none font-semibold"
                onClick={() => {
                  // TODO: Implement Apple OAuth
                  console.log("Apple sign in");
                }}
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading mb-3">
                  Continue with email
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We'll send a link to your email that will instantly sign you
                  in
                </p>

                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full shadow-none h-10"
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

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <Button
                    className="w-full bg-primary hover:bg-primary/80 text-white py-6"
                    onClick={handleSendMagicLink}
                    disabled={!email || !email.includes("@") || isPending}
                  >
                    {isPending ? "Sending..." : "Send link"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {mode === "email-sent" && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-heading text-center">
                Check your email!
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                To sign in, tap the button in the email we sent to
                <br />
                <strong>{email}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4">
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
      </DialogContent>
    </Dialog>
  );
}
