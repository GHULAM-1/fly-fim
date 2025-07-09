"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { useEffect } from "react";
import { CurrencyProvider } from "@/lib/currency-context";
import Tabs from "@/components/Tabs";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nextProvider i18n={i18n}>
          <CurrencyProvider>
            <LayoutContent>{children}</LayoutContent>
          </CurrencyProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
