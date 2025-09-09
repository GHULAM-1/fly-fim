"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Info, CreditCard } from "lucide-react";

const CreditCardForm = () => {
  return (
    <div className="mt-6  space-y-4 animate-in fade-in-0 duration-500">
      <div className="space-y-1">
        <label
          htmlFor="cardNumber"
          className="text-sm font-medium text-[#444444]"
        >
          Card number
        </label>
        <div className="relative">
          <Input
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            className="pr-10 h-12"
          />
          <CreditCard
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="expiry" className="text-sm font-medium text-[#444444]">
            Expiry
          </label>
          <Input id="expiry" placeholder="MM/YY" className="h-12" />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="cvv"
            className="text-sm font-medium text-[#444444] flex items-center"
          >
            CVV
            <Info size={14} className="ml-1 text-gray-500" />
          </label>
          <div className="relative">
            <Input id="cvv" placeholder="" className="pr-10 h-12" />
            <CreditCard
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="nameOnCard"
          className="text-sm font-medium text-[#444444]"
        >
          Name on card
        </label>
        <Input id="nameOnCard" className="h-12" />
      </div>
      <div className="pt-2">
        <p className="text-xs text-gray-500 font-halyard-text-light">
          Your card details are secured using 2048-bit SSL encryption.
        </p>
        <img
          src="/images/booking/security-compliance.svg"
          alt="Security-compliance"
          className="h-4"
          
        />
      </div>
    </div>
  );
};

export default CreditCardForm;