"use client";
import { useCurrency } from "@/lib/currency-context";

interface PriceDisplayProps {
  amount: number;
  fromCurrency?: string;
  className?: string;
}

export default function PriceDisplay({
  amount,
  fromCurrency = "USD",
  className = "",
}: PriceDisplayProps) {
  const { formatPrice, convertPrice } = useCurrency();

  return (
    <span className={className}>
      {formatPrice(convertPrice(amount, fromCurrency))}
    </span>
  );
}

// Example usage:
// <PriceDisplay amount={100} /> // Shows $100 in USD, €92 in EUR, etc.
// <PriceDisplay amount={50} fromCurrency="EUR" /> // Convert from EUR to current currency
// <PriceDisplay amount={200} className="text-lg font-bold" /> // With custom styling
