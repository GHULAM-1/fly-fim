import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface LanguageCurrencyDropdownProps {
  scrolled: boolean;
}

const LanguageCurrencyDropdown: React.FC<LanguageCurrencyDropdownProps> = ({
  scrolled,
}) => {
  const languages = [
    { code: "en", name: "English", active: true },
    { code: "es", name: "Español", active: false },
    { code: "fr", name: "Français", active: false },
    { code: "it", name: "Italiano", active: false },
    { code: "de", name: "Deutsch", active: false },
    { code: "pt", name: "Português", active: false },
    { code: "nl", name: "Nederlands", active: false },
  ];

  const popularCurrencies = [
    { code: "EUR", symbol: "€", name: "Euro", active: false },
    { code: "USD", symbol: "$", name: "United States Dollar", active: true },
    {
      code: "AED",
      symbol: "",
      name: "United Arab Emirates Dirham",
      active: false,
    },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar", active: false },
    { code: "INR", symbol: "₹", name: "Indian Rupee", active: false },
    { code: "GBP", symbol: "£", name: "British Pound", active: false },
  ];

  const moreCurrencies = [
    { code: "ALL", symbol: "", name: "Albanian Lek" },
    { code: "ARS", symbol: "", name: "Argentine Peso" },
    { code: "AUD", symbol: "AU$", name: "Australian Dollar" },
    { code: "AZN", symbol: "₼", name: "Azerbaijan New Manat" },
    { code: "BHD", symbol: "", name: "Bahrain Dinar" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
    { code: "CHF", symbol: "", name: "Swiss Franc" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan Renminbi" },
    { code: "COP", symbol: "", name: "Colombian Peso" },
    { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
    { code: "DKK", symbol: "", name: "Danish Krone" },
    { code: "DOP", symbol: "", name: "Dominican Peso" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
    { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
    { code: "HUF", symbol: "Ft", name: "Hungary Forint" },
    { code: "IDR", symbol: "Rp", name: "Indonesia Rupiah" },
    { code: "ILS", symbol: "₪", name: "Israeli New Shekel" },
    { code: "ISK", symbol: "kr", name: "Icelandic Krona" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "KRW", symbol: "₩", name: "South Korean Won" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          English / USD
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[800px] p-6 mt-2"
        align="end"
        side="bottom"
      >
        <div className="flex gap-8">
          {/* Language Section */}
          <div className="w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Language
            </h3>
            <div className="space-y-3">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`block w-full text-left text-sm hover:opacity-80 transition-opacity ${
                    language.active
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
              {popularCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  className={`text-left text-sm hover:opacity-80 transition-opacity ${
                    currency.active
                      ? "text-purple-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold">
                    {currency.code} {currency.symbol}
                  </span>
                  <span className="ml-1">• {currency.name}</span>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              More currencies
            </h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              {moreCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  className="text-left text-sm text-gray-600 hover:opacity-80 transition-opacity"
                >
                  <span className="font-semibold">
                    {currency.code} {currency.symbol}
                  </span>
                  <span className="ml-1">• {currency.name}</span>
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
