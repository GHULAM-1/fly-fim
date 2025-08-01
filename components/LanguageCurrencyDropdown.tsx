import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X, Search, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency, CURRENCIES } from "@/lib/currency-context";
import { Input } from "@/components/ui/input";

interface LanguageCurrencyDropdownProps {
  scrolled: boolean;
}

const LanguageCurrencyDropdown: React.FC<LanguageCurrencyDropdownProps> = ({
  scrolled,
}) => {
  const { i18n } = useTranslation();
  const { currency, setCurrency, formatCurrencyDisplay } = useCurrency();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageDrawerOpen, setIsLanguageDrawerOpen] = useState(false);
  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const getCurrentLanguageCode = () => {
    return activeLanguage.toUpperCase();
  };

  // Split currencies into popular and more categories for display
  const popularCurrencies = CURRENCIES.slice(0, 6); // First 6 currencies
  const moreCurrencies = CURRENCIES.slice(6); // Rest of the currencies

  // Filter currencies based on search query
  const filterCurrencies = (currencies: typeof CURRENCIES) => {
    if (!searchQuery) return currencies;
    return currencies.filter(
      (curr) =>
        curr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curr.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPopularCurrencies = filterCurrencies(popularCurrencies);
  const filteredMoreCurrencies = filterCurrencies(moreCurrencies);

  const handleCurrencySelect = (curr: (typeof CURRENCIES)[0]) => {
    setCurrency(curr);
    console.log(curr);
    setIsCurrencyDrawerOpen(false);
    setSearchQuery("");
  };

  const handleLanguageSelect = (language: (typeof languages)[0]) => {
    i18n.changeLanguage(language.code);
    setActiveLanguage(language.code);
    localStorage.setItem("preferred-language", language.code);
    setIsLanguageDrawerOpen(false);
  };

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`text-sm cursor-pointer font-extralight flex items-center gap-1 hover:opacity-80 transition-opacity ${
                scrolled ? "text-[#444444]" : "text-white"
              }`}
            >
              {getCurrentLanguageName()} / {formatCurrencyDisplay(currency)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-[20px] mt-2 z-[9999]" align="end" side="bottom">
            <div className="flex">
              {/* Language Section */}
              <div className="w-[180px] border-r border-gray-200 pr-[24px]">
                <h3 className="text-lg font-heading text-[#444444] mb-6">
                  Language
                </h3>
                <div className="space-y-0">
                  {languages.map((language) => (
                    <button
                      onClick={() => {
                        i18n.changeLanguage(language.code);
                        setActiveLanguage(language.code);
                      }}
                      key={language.code}
                      className={`block w-full text-left text-sm hover:opacity-80 cursor-pointer transition-opacity ${
                        language.code === activeLanguage
                          ? "text-[#8000ff] bg-[#F8F6FF] rounded-[4px] p-[6.4px] font-medium"
                          : "text-[#666666] p-[6.4px]"
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currencies Section */}
              <div className="flex-1 pl-[24px]">
                <div className="flex gap-3">
                  <h3 className="text-lg font-heading text-[#444444] mb-6 shrink-0">
                    Popular currencies
                  </h3>
                  <hr className="w-full mt-4" />
                </div>
                <div className="grid grid-cols-3 mb-[20px]">
                  {popularCurrencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr);
                      }}
                      className={`text-left text-sm hover:opacity-80 transition-opacity ${
                        curr.code === currency.code
                         ? "text-[#8000ff] bg-[#F8F6FF] rounded-[4px] p-[6.4px] font-medium"
                          : "text-[#666666] p-[6.4px]"
                      }`}
                    >
                      <span className="font-semibold">
                        {curr.code} {curr.symbol}
                      </span>
                      <span className="ml-1">• {curr.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <h3 className="text-lg font-heading text-[#444444] mb-6 shrink-0">
                    More currencies
                  </h3>
                  <hr className="w-full mt-4" />
                </div>
                <div className="grid grid-cols-3">
                  {moreCurrencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr);
                      }}
                      className={`text-left text-sm hover:opacity-80 transition-opacity ${
                        curr.code === currency.code
                          ? "text-[#8000ff] bg-[#F8F6FF] rounded-[4px] p-[6.4px] font-medium"
                          : "text-[#666666] p-[6.4px]"
                      }`}
                    >
                      <span className="font-semibold">
                        {curr.code} {curr.symbol}
                      </span>
                      <span className="ml-1 font-halyard-text-light">• {curr.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Drawers - Two separate buttons */}
      <div className="lg:hidden flex items-center gap-3">
        {/* Language Button */}
        <Drawer
          open={isLanguageDrawerOpen}
          onOpenChange={setIsLanguageDrawerOpen}
        >
          <DrawerTrigger asChild>
            <button className={`text-sm font-halyard-text-light flex items-center gap-1 ${
              scrolled ? "text-[#444444]" : "text-white"
            }`}>
              <Globe size={12} className={`font-halyard-text-light ${
                scrolled ? "text-[#444444]" : "text-white"
              }`} />
              {getCurrentLanguageCode()}
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh] h-full">
            <DrawerHeader className="flex items-center justify-between p-4">
              <DrawerTitle className="text-lg font-heading text-[#444444] font-medium text-left">
                Select language
              </DrawerTitle>
              <DrawerClose asChild>
                <button className="p-1">
                  <X size={20} className="text-gray-500" />
                </button>
              </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-0">
                {languages.map((language, index) => (
                  <div key={language.code}>
                    <button
                      onClick={() => handleLanguageSelect(language)}
                      className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors border-b"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <span className={`text-sm ${language.code === activeLanguage ? "text-[#8000ff]" : "text-[#444444]"}`}>
                          {language.name}
                        </span>
                        <div className={`flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-full ${language.code === activeLanguage ? "bg-[#8000ff] border-none" : "border-gray-300"}`}>
                          {language.code === activeLanguage && (
                            <div className="w-2 h-2 bg-white  rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Currency Button */}
        <Drawer
          open={isCurrencyDrawerOpen}
          onOpenChange={(open) => {
            setIsCurrencyDrawerOpen(open);
            if (!open && searchInputRef.current) {
              searchInputRef.current.blur();
            }
          }}
        >
          <DrawerTrigger asChild>
            <button className={`text-sm font-halyard-text-light flex items-center gap-1 ${
              scrolled ? "text-[#444444]" : "text-white"
            }`}>
              {formatCurrencyDisplay(currency)}
            </button>
          </DrawerTrigger>
          <DrawerContent 
            className="max-h-[90vh] h-full"
            onTouchStart={() => {
              if (searchInputRef.current) {
                searchInputRef.current.blur();
              }
            }}
          >
            <DrawerHeader className="flex items-center justify-between px-[24px] pb-0 pt-2">
              <DrawerTitle className="text-lg font-heading text-[#444444] p-0 font-medium text-left">
                Select currency
              </DrawerTitle>
              <DrawerClose asChild>
                <button className="p-1">
                  <X size={20} className="text-[#444444]" />
                </button>
              </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto py-4 px-[24px] space-y-6">
              {/* Search Input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 text-[#444444] top-1/2 transform -translate-y-1/2"
                />
                <Input
                  ref={searchInputRef}
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 shadow-none placeholder:text-[#444444]"
                  style={{
                    fontFamily: 'var(--font-halyard-text-light)'
                  }}
                />
              </div>

              {/* Popular Currencies */}
              {filteredPopularCurrencies.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-heading font-medium text-[#444444] mb-2">
                    Popular currencies
                  </h3>
                  <div className="space-y-3">
                    {filteredPopularCurrencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencySelect(curr)}
                        className="w-full flex items-center border-b justify-between py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between w-full gap-3">
                          <div className="text-[15px]">
                            <span className={`${curr.code === currency.code ? "text-[#8000ff]" : "text-[#444444]"}`}>
                              {curr.code} {curr.symbol}
                            </span>
                            <span className={`font-halyard-text-light ${curr.code === currency.code ? "text-[#8000ff]" : "text-[#666666]"}`}> • {curr.name}</span>
                          </div>
                          <div className={`flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-full ${curr.code === currency.code ? "bg-[#8000ff] border-none" : "border-gray-300"}`}>
                          {curr.code === currency.code && (
                            <div className="w-2 h-2 bg-white  rounded-full"></div>
                          )}
                        </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* More Currencies */}
              {filteredMoreCurrencies.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-heading font-medium text-[#444444] mb-4">
                    More currencies
                  </h3>
                  <div className="space-y-3">
                    {filteredMoreCurrencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencySelect(curr)}
                        className="w-full flex items-center border-b justify-between py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between w-full gap-3">
                          <div className="text-sm">
                            <span className={`${curr.code === currency.code ? "text-[#8000ff]" : "text-[#444444]"}`}>
                              {curr.code} {curr.symbol}
                            </span>
                            <span className={`font-halyard-text-light ${curr.code === currency.code ? "text-[#8000ff]" : "text-[#666666]"}`}> • {curr.name}</span>
                          </div>
                          <div className={`flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-full ${curr.code === currency.code ? "bg-[#8000ff] border-none" : "border-gray-300"}`}>
                          {curr.code === currency.code && (
                            <div className="w-2 h-2 bg-white  rounded-full"></div>
                          )}
                        </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {searchQuery &&
                filteredPopularCurrencies.length === 0 &&
                filteredMoreCurrencies.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No currencies found for "{searchQuery}"
                  </div>
                )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default LanguageCurrencyDropdown;
