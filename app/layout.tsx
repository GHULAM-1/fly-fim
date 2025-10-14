"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useState } from "react";
import { CurrencyProvider } from "@/lib/currency-context";
import Tabs from "@/components/Tabs";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { ToastContainerComponent } from "@/components/toast";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { CalendarProvider } from "@/lib/hooks/useCalendarState";
import SplashScreen from "@/components/ui/SplashScreen";
import { useSplashScreen } from "@/lib/hooks/useSplashScreen";
import PayPalProvider from "@/components/PayPalProvider";
import ActiveUsersTracker from "@/components/ActiveUsersTracker";

// --- FONT DEFINITIONS (No changes here) ---
const heading = localFont({
  src: "../fonts/heading.otf",
  variable: "--font-heading",
});

const text = localFont({
  src: "../fonts/halyard-display.otf",
  variable: "--font-text",
});

const regular = localFont({
  src: "../fonts/halyard-display.otf",
  variable: "--font-regular",
});
const halyardText = localFont({
  src: "../fonts/halyard-text.otf",
  variable: "--font-halyard-text",
});
const halyardTextRegular = localFont({
  src: "../fonts/halyard-text-regular.otf",
  variable: "--font-halyard-text-regular",
});
const halyardTextLight = localFont({
  src: "../fonts/halyard-text-light.otf",
  variable: "--font-halyard-text-light",
});
const lightText = localFont({
  src: "../fonts/light.otf",
  variable: "--font-lightText",
});
const displayLight = localFont({
  src: "../fonts/display-light.otf",
  variable: "--font-display-light",
});

const RTL_LANGUAGES: string[] = [];

function LayoutContent({ children }: { children: React.ReactNode }) {
  // Initialize splash screen - shows on every route change
  const { isVisible: showSplash } = useSplashScreen({
    minDuration: 4000, // Show for 4 seconds to let animation complete (frame #140+)
    showOnRouteChange: true // Show on every navigation
  });

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    const handleLanguageChange = () => {
      const lang = i18n.language;
      const isRTL = RTL_LANGUAGES.includes(lang);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = lang;

      // Save language to localStorage
      localStorage.setItem("preferred-language", lang);
    };

    handleLanguageChange();
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const pathname = usePathname();

  // Check for specific routes to hide default layout components
  const isDashboard = pathname?.startsWith("/dashboard");
  const isBookingPage = pathname?.startsWith("/booking");
  const isBlogPage = pathname?.startsWith("/blog");

  return (
    <>
      {/* Active Users Tracker - tracks all visitors */}
      <ActiveUsersTracker />

      {/* Splash Screen - shows on every route change */}
      {/* <SplashScreen isVisible={showSplash} /> */}

      {/* Main App Content */}
      <div className={`transition-opacity duration-300 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        {!isDashboard && !isBookingPage && !isBlogPage && <Navbar />}
        {children}
        {!isDashboard && !isBookingPage && pathname !== "/account" && <Footer />}
        {!isDashboard && !isBookingPage && !isBlogPage && <Tabs />}
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>
          Fly in Minute: Things To Do, Attractions, Cruises, Tours & Experiences
        </title>
        {/* Preload splash screen assets */}
        <link rel="preload" href="/loader.gif" as="image" type="image/gif" />
      </head>
      {/* --- THIS IS THE CRITICAL CHANGE --- */}
      {/* We apply all the font variables to the body tag */}
      <body
        className={`${heading.variable} ${text.variable} ${regular.variable} ${halyardText.variable} ${halyardTextRegular.variable} ${halyardTextLight.variable} ${lightText.variable} ${displayLight.variable}`}
      >
        <I18nextProvider i18n={i18n}>
          <Toaster position="top-center" />
          <ToastContainerComponent />
          <CurrencyProvider>
            <ConvexClientProvider>
              <CalendarProvider>
                <PayPalProvider>
                  <LayoutContent>{children}</LayoutContent>
                </PayPalProvider>
              </CalendarProvider>
            </ConvexClientProvider>
          </CurrencyProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
