"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  CreditCard,
  CircleHelp,
  Plus,
  Minus,
  Zap,
  Calendar,
  Clock,
  Pencil,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountryCodeSelector from "@/components/booking/CountryCodeSelector";
import { FaPaypal, FaGooglePay } from "react-icons/fa";
import { Circle } from "lucide-react";

function Bullet() {
  return (
    <Circle
      className="h-1 w-1 text-black"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    />
  );
}

const ConfirmAndPayPage = () => {
  const searchParams = useSearchParams();

  const [adultCount, setAdultCount] = useState(1);
  const [seniorCount, setSeniorCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [paymentTime, setPaymentTime] = useState("payNow");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const adultPrice = 49.0;
  const seniorPrice = 46.82;
  const childPrice = 43.55;

  const totalPayable =
    adultCount * adultPrice +
    seniorCount * seniorPrice +
    childCount * childPrice;
  const payTodayAmount = paymentTime === "payNow" ? totalPayable : 0;

  const itemName =
    searchParams.get("itemName") || "Edge Observation Deck Ticket";
  const city = searchParams.get("city") || "london";
  const category = searchParams.get("category") || "entertainment";
  const subcategory = searchParams.get("subcategory") || "studio-tours";
  const item = searchParams.get("itemId") || "default-item";
  const date = searchParams.get("date") || "2025-10-06";
  const time = searchParams.get("time") || "9:00am-10:00pm";
  const optionTitle =
    searchParams.get("optionTitle") || "General Admission: Timed Entry";

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedDay = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const itemLink = `/things-to-do/${city}/${category}/${subcategory}/${item}`;
  const ticketsLink = `/booking?${searchParams.toString()}`;

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 w-full bg-white z-40 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center max-w-[1200px] mx-auto h-18">
            <div className="flex flex-row gap-10 items-center">
              <Link href="/">
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-24 sm:w-32"
                />
              </Link>
              <div className="text-xs text-gray-500  font-halyard-text-light items-center gap-2 hidden sm:flex">
                <Link
                  href={itemLink}
                  className="text-gray-800 hover:text-purple-600 underline cursor-pointer"
                >
                  1. {itemName.substring(0, 25)}...
                </Link>
                <ChevronRight size={16} />
                <Link
                  href={ticketsLink}
                  className="text-gray-800 hover:text-purple-600 underline cursor-pointer"
                >
                  2. Tickets
                </Link>
                <ChevronRight size={16} />
                <span className="font-medium text-gray-900">
                  3. Confirm & pay
                </span>
              </div>
            </div>
            <div className="flex items-center gap-10 font-halyard-text-light">
              <Link
                href="/help"
                className="text-xs flex items-center gap-1 hover:text-purple-600"
              >
                <CircleHelp strokeWidth={1} size={16} />
                <span className="hidden md:inline">Help</span>
              </Link>
              <Button
                variant="outline"
                className="border-gray-300  text-xs px-3 py-2"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 p-5 rounded-lg font-halyard-text-light text-xs mb-8 h-13">
          You can cancel for free until 9:00am local time on Oct 05, 2025.
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-7">
            {/* Guests Section */}
            <div>
              <h2 className="text-xl font-heading text-gray-800 mb-2">
                Guests
              </h2>
              <div className="flex items-center gap-2 text-sm font-halyard-text-light  mb-4">
                <Zap size={14} className="text-yellow-400 fill-amber-400" />
                Likely to sell out
              </div>
              <div className="bg-gray-100 p-3 flex flex-row  items-center gap-3 rounded-lg text-xs font-halyard-text-light mb-6 h-13">
                <Bullet />
                <span>
                  Children aged 0-5 can enter for free. Simply show your ID at
                  the venue and enter.
                </span>
              </div>
              <div className="space-y-4 ">
                {/* Adult */}
                <div className="flex justify-between items-center w-[500px] sm:w-full">
                  <div>
                    <p className="font-medium text-gray-800">Adult</p>
                    <p className="text-xs text-gray-800 font-halyard-text-light">
                      13 to 61 yrs
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-row items-center justify-center">

                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() =>
                          setAdultCount((prev) => Math.max(1, prev - 1))
                        }
                        disabled={adultCount <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {adultCount}
                      </span>
                        </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => setAdultCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    <span className="font-medium text-gray-800">
                      ${adultPrice.toFixed(2)}
                    </span>
                    </div>
                  </div>
                </div>
                {/* Senior */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Senior</p>
                    <p className="text-xs text-gray-800 font-halyard-text-light">
                      62 yrs and above
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">
                      ${seniorPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() =>
                          setSeniorCount((prev) => Math.max(0, prev - 1))
                        }
                        disabled={seniorCount <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {seniorCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => setSeniorCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Child */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Child</p>
                    <p className="text-xs text-gray-800 font-halyard-text-light">
                      6 to 12 yrs
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">
                      ${childPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() =>
                          setChildCount((prev) => Math.max(0, prev - 1))
                        }
                        disabled={childCount <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {childCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => setChildCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details Section */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-heading text-gray-800 mb-1">
                Guest details
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Add the names of each guest for seamless access.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full name
                  </label>
                  <Input id="fullName" placeholder="Must match ID" />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone number
                  </label>
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                    <CountryCodeSelector />
                    <Input
                      id="phone"
                      type="tel"
                      className="border-none focus-visible:ring-0"
                      placeholder="We may reach out..."
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="We'll send your tickets here"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm email address
                  </label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    placeholder="Just to ensure we've got this right"
                  />
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white p-6 rounded-lg border">
              {!showPromo ? (
                <button
                  onClick={() => setShowPromo(true)}
                  className="text-sm font-medium text-green-600 hover:underline"
                >
                  Have a promo code?
                </button>
              ) : (
                <div>
                  <label
                    htmlFor="promoCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter promo code
                  </label>
                  <div className="flex items-center gap-2">
                    <Input id="promoCode" placeholder="Promo code" />
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Select When to Pay */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-heading text-gray-800 mb-4">
                Select when to pay
              </h2>
              <div className="space-y-4">
                <label className="custom-radio-label">
                  <input
                    type="radio"
                    name="paymentTime"
                    value="payNow"
                    checked={paymentTime === "payNow"}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="custom-radio-input"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">Pay now</p>
                    <p className="text-sm text-gray-500">
                      You can cancel for free until 9:00am local time on Oct 05,
                      2025.
                    </p>
                  </div>
                </label>
                <label className="custom-radio-label">
                  <input
                    type="radio"
                    name="paymentTime"
                    value="payLater"
                    checked={paymentTime === "payLater"}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="custom-radio-input"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">
                      Book now, pay later
                    </p>
                    <p className="text-sm text-gray-500">
                      We'll charge your card ${totalPayable.toFixed(2)} on Oct
                      04, 2025, 9:00pm. You can cancel for free until Oct 05,
                      2025, 9:00am local time.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-heading text-gray-800 mb-4">
                Select your payment method
              </h2>
              <div className="space-y-4">
                <label className="custom-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="custom-radio-input"
                  />
                  <span className="ml-3 font-medium text-gray-800 flex items-center gap-2">
                    <CreditCard size={20} /> Credit or debit card
                  </span>
                </label>
                <label className="custom-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="custom-radio-input"
                  />
                  <span className="ml-3 font-medium text-gray-800 flex items-center gap-2">
                    <FaPaypal size={20} /> PayPal
                  </span>
                </label>
                <label className="custom-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="gpay"
                    checked={paymentMethod === "gpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="custom-radio-input"
                  />
                  <span className="ml-3 font-medium text-gray-800 flex items-center gap-2">
                    <FaGooglePay size={20} /> Google Pay
                  </span>
                </label>
              </div>
            </div>

            {/* Final Confirmation */}
            <div className="space-y-4">
              <div className="flex justify-between font-medium text-lg">
                <span>Total payable:</span>
                <span>${totalPayable.toFixed(2)}</span>
              </div>
              <div className="flex items-start gap-3">
                <input id="offers" type="checkbox" className="mt-1" />
                <label htmlFor="offers" className="text-sm text-gray-600">
                  I do not wish to receive personalized offers via email or
                  important updates via WhatsApp.
                </label>
              </div>
              <p className="text-xs text-gray-500">
                By continuing, you agree to the General Terms, Privacy Policy,
                and the Cancellation Policy.
              </p>
              <Button className="w-full bg-[#6A00D5] hover:bg-[#5A00B5] text-white font-semibold text-base py-6 rounded-xl">
                Confirm & pay
              </Button>
            </div>
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <div className="relative mb-4">
                  <img
                    src="/images/r1.jpg.avif"
                    alt={itemName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                <h3 className="font-bold text-gray-800 mb-4">{itemName}</h3>

                <div className="space-y-3 text-sm border-b pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>
                        {formattedDay}, {formattedDate}
                      </span>
                    </div>
                    <button className="text-purple-600 font-medium">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>{time}</span>
                    </div>
                    <button className="text-purple-600 font-medium">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <p className="text-gray-500">&#8226;</p>
                      <span>{optionTitle}</span>
                    </div>
                    <button className="text-purple-600 font-medium">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  {adultCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {adultCount} Adult{adultCount > 1 ? "s" : ""}
                      </span>
                      <span className="text-gray-800">
                        ${(adultCount * adultPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {seniorCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {seniorCount} Senior{seniorCount > 1 ? "s" : ""}
                      </span>
                      <span className="text-gray-800">
                        ${(seniorCount * seniorPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {childCount} Child{childCount > 1 ? "ren" : ""}
                      </span>
                      <span className="text-gray-800">
                        ${(childCount * childPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <span>Total payable</span>
                  <span>${totalPayable.toFixed(2)}</span>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Supplied by HY Attractions Manager LLC. By continuing, you
                  agree to the{" "}
                  <a href="#" className="underline">
                    General Terms
                  </a>
                  ,{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                  , and the{" "}
                  <a href="#" className="underline">
                    Cancellation Policy
                  </a>
                  .
                </p>

                <Button className="w-full mt-4 bg-[#6A00D5] hover:bg-[#5A00B5] text-white font-semibold py-4 rounded-xl">
                  Confirm & pay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmAndPayPage;
 