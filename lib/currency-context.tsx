"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export const CURRENCIES: Currency[] = [
  // Popular currencies (first 6)
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "USD", symbol: "$", name: "United States Dollar", rate: 1 },
  {
    code: "AED",
    symbol: "",
    name: "United Arab Emirates Dirham",
    rate: 3.67,
  },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.35 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },

  // More currencies
  { code: "ALL", symbol: "", name: "Albanian Lek", rate: 92.5 },
  { code: "ARS", symbol: "", name: "Argentine Peso", rate: 350.0 },
  { code: "AUD", symbol: "AU$", name: "Australian Dollar", rate: 1.52 },
  { code: "AZN", symbol: "₼", name: "Azerbaijan New Manat", rate: 1.7 },
  { code: "BHD", symbol: "", name: "Bahrain Dinar", rate: 0.377 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 5.02 },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36 },
  { code: "CHF", symbol: "", name: "Swiss Franc", rate: 0.88 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan Renminbi", rate: 7.24 },
  { code: "COP", symbol: "", name: "Colombian Peso", rate: 4050.0 },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón", rate: 520.0 },
  { code: "DKK", symbol: "", name: "Danish Krone", rate: 6.9 },
  { code: "DOP", symbol: "", name: "Dominican Peso", rate: 55.0 },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", rate: 30.85 },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", rate: 7.8 },
  { code: "HUF", symbol: "Ft", name: "Hungary Forint", rate: 360.0 },
  { code: "IDR", symbol: "Rp", name: "Indonesia Rupiah", rate: 15300.0 },
  { code: "ILS", symbol: "₪", name: "Israeli New Shekel", rate: 3.7 },
  { code: "ISK", symbol: "kr", name: "Icelandic Krona", rate: 138.0 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.5 },
  { code: "KRW", symbol: "₩", name: "South Korean Won", rate: 1319.5 },
];

// Currencies that have symbols positioned on the right
const RIGHT_SYMBOL_CURRENCIES = ["EUR"];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number, showSymbol?: boolean) => string;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatCurrencyDisplay: (currency: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(
    CURRENCIES.find((c) => c.code === "USD") || CURRENCIES[0]
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferred-currency");
    if (savedCurrency) {
      const found = CURRENCIES.find((c) => c.code === savedCurrency);
      if (found) {
        setCurrencyState(found);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferred-currency", newCurrency.code);
  };

  const convertPrice = (
    amount: number,
    fromCurrency: string = "USD"
  ): number => {
    if (fromCurrency === currency.code) return amount;

    // Convert from source currency to USD, then to target currency
    const fromRate = CURRENCIES.find((c) => c.code === fromCurrency)?.rate || 1;
    const usdAmount = amount / fromRate;
    return usdAmount * currency.rate;
  };

  const formatPrice = (amount: number, showSymbol: boolean = true): string => {
    const convertedAmount = convertPrice(amount);
    const formattedAmount = convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits:
        currency.code === "JPY" || currency.code === "KRW" ? 0 : 2,
      maximumFractionDigits:
        currency.code === "JPY" || currency.code === "KRW" ? 0 : 2,
    });

    if (!showSymbol) return formattedAmount;

    const isRightSymbol = RIGHT_SYMBOL_CURRENCIES.includes(currency.code);
    return isRightSymbol
      ? `${formattedAmount}${currency.symbol}`
      : `${currency.symbol}${formattedAmount}`;
  };

  const formatCurrencyDisplay = (curr: Currency): string => {
    if (!curr.symbol) return curr.code;
    if (curr.code === "AED") return "AED";

    const isRightSymbol = RIGHT_SYMBOL_CURRENCIES.includes(curr.code);
    return isRightSymbol
      ? `${curr.code}${curr.symbol}`
      : `${curr.symbol}${curr.code}`;
  };

  // Prevent hydration mismatch by showing loading state
  if (!isLoaded) {
    return (
      <CurrencyContext.Provider
        value={{
          currency: CURRENCIES.find((c) => c.code === "USD") || CURRENCIES[0],
          setCurrency: () => {},
          formatPrice: (amount) => `$${amount.toFixed(2)}`,
          convertPrice: (amount) => amount,
          formatCurrencyDisplay: (curr) => `$${curr.code}`,
        }}
      >
        {children}
      </CurrencyContext.Provider>
    );
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        formatCurrencyDisplay,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
