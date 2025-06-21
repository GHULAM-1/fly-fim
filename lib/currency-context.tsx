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
  // Popular currencies
  { code: "USD", symbol: "$", name: "United States Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  {
    code: "AED",
    symbol: "د.إ",
    name: "United Arab Emirates Dirham",
    rate: 3.67,
  },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.35 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },

  // Additional currencies
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "AU$", name: "Australian Dollar", rate: 1.52 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.5 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", rate: 0.88 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan Renminbi", rate: 7.24 },
  { code: "KRW", symbol: "₩", name: "South Korean Won", rate: 1319.5 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 5.02 },
  { code: "MXN", symbol: "$", name: "Mexican Peso", rate: 17.85 },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", rate: 30.85 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75 },
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
