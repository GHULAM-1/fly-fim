import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency, CURRENCIES } from "@/lib/currency-context";

interface LanguageCurrencyDropdownProps {
  scrolled: boolean;
}

const LanguageCurrencyDropdown: React.FC<LanguageCurrencyDropdownProps> = ({
  scrolled,
}) => {
  const { i18n } = useTranslation();
  const { currency, setCurrency, formatCurrencyDisplay } = useCurrency();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);

  // Sync with localStorage and i18n changes
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage) {
      setActiveLanguage(savedLanguage);
    }

    const handleLanguageChange = () => {
      setActiveLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
    { code: "de", name: "Deutsch" },
    { code: "pt", name: "Português" },
    { code: "nl", name: "Nederlands" },
  ];

  const getCurrentLanguageName = () => {
    const currentLang = languages.find((lang) => lang.code === activeLanguage);
    return currentLang ? currentLang.name : "English";
  };

  // Split currencies into popular and more categories for display
  const popularCurrencies = CURRENCIES.slice(0, 6); // First 6 currencies
  const moreCurrencies = CURRENCIES.slice(6); // Rest of the currencies

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          {getCurrentLanguageName()} / {formatCurrencyDisplay(currency)}
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-6 mt-2" align="end" side="bottom">
        <div className="flex gap-8">
          {/* Language Section */}
          <div className="w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Language
            </h3>
            <div className="space-y-3">
              {languages.map((language) => (
                <button
                  onClick={() => {
                    i18n.changeLanguage(language.code);
                    setActiveLanguage(language.code);
                  }}
                  key={language.code}
                  className={`block w-full text-left text-sm hover:opacity-80 cursor-pointer transition-opacity ${
                    language.code === activeLanguage
                      ? "text-purple-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>

          {/* Currencies Section */}
          <div className="w-2/3">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              Popular currencies
            </h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3 mb-6">
              {popularCurrencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr);
                  }}
                  className={`text-left text-sm hover:opacity-80 transition-opacity ${
                    curr.code === currency.code
                      ? "text-purple-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold">
                    {curr.code} {curr.symbol}
                  </span>
                  <span className="ml-1">• {curr.name}</span>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              More currencies
            </h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              {moreCurrencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr);
                  }}
                  className={`text-left text-sm hover:opacity-80 transition-opacity ${
                    curr.code === currency.code
                      ? "text-purple-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold">
                    {curr.code} {curr.symbol}
                  </span>
                  <span className="ml-1">• {curr.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageCurrencyDropdown;
