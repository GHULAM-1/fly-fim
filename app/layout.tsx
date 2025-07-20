"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { useEffect } from "react";
import { CurrencyProvider } from "@/lib/currency-context";
import Tabs from "@/components/Tabs";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { ToastContainerComponent } from "@/components/toast";

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

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];
function LayoutContent({ children }: { children: React.ReactNode }) {
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

  return (
    <>
      <Navbar />
      {children}
      {pathname !== "/account" && <Footer />}
      <Tabs />
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
      </head>
      <body className={`${heading.variable} ${text.variable} ${regular.variable} ${lightText.variable} ${displayLight.variable} ${halyardText.variable} ${halyardTextLight.variable} antialiased`}>
        <I18nextProvider i18n={i18n}>
        <Toaster position="top-center"/>
        <ToastContainerComponent />
          <CurrencyProvider>
            <LayoutContent>{children}</LayoutContent>
          </CurrencyProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
