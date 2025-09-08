"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  CircleHelp,
  Plus,
  Minus,
  Zap,
  Calendar,
  Clock,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountryCodeSelector from "@/components/booking/CountryCodeSelector";

const ConfirmAndPayPage = () => {
  const searchParams = useSearchParams();

  const [adultCount, setAdultCount] = useState(1);
  const [seniorCount, setSeniorCount] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [paymentTime, setPaymentTime] = useState("payNow");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const adultPrice = 71.68;
  const seniorPrice = 69.51;

  const totalPayable = adultCount * adultPrice + seniorCount * seniorPrice;
  const payTodayAmount = paymentTime === "payNow" ? totalPayable : 0;

  const itemName =
    searchParams.get("itemName") || "Edge Observation Deck Ticket";
  const city = searchParams.get("city") || "london";
  const category = searchParams.get("category") || "entertainment";
  const subcategory = searchParams.get("subcategory") || "studio-tours";
  const item = searchParams.get("itemId") || "default-item";
  const date = searchParams.get("date") || "Nov 24, 2025";
  const time = searchParams.get("time") || "8:00am-11:00pm";
  const optionTitle =
    searchParams.get("optionTitle") ||
    "General Admission: Timed Entry + Champagne Experience";

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedDay = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });

  const itemLink = `/things-to-do/${city}/${category}/${subcategory}/${item}`;
  const ticketsLink = `/booking?${searchParams.toString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full bg-white z-40 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center max-w-[1200px] mx-auto h-20">
            <div className="flex flex-row gap-10 items-center">
              <Link href="/">
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-24 sm:w-32"
                />
              </Link>
              <div className="text-sm text-gray-500 items-center gap-2 hidden sm:flex">
                <Link
                  href={itemLink}
                  className="text-gray-800 hover:text-purple-600 underline cursor-pointer"
                >
                  1. Edge Observation Deck Ticke...
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
            <div className="flex items-center gap-10">
              <Link
                href="/help"
                className="text-sm flex items-center gap-1 hover:text-purple-600"
              >
                <CircleHelp strokeWidth={1} size={16} />
                <span className="hidden md:inline">Help</span>
              </Link>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-800 text-sm px-4 py-2"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg border text-sm text-gray-700 mb-8">
          You can cancel for free until 8:00am local time on Nov 23, 2025.
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-heading text-gray-800 mb-2">
                Guests
              </h2>
              <div className="flex items-center gap-2 text-sm text-yellow-600 mb-4">
                <Zap size={16} className="text-yellow-500" />
                Likely to sell out
              </div>
              <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 mb-6">
                This tour is suitable for guests aged 21 and above.
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Adult</p>
                    <p className="text-sm text-gray-500">21 to 61 yrs</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">
                      ${adultPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
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
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => setAdultCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Senior</p>
                    <p className="text-sm text-gray-500">62 yrs and above</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">
                      ${seniorPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
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
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-heading text-gray-800 mb-1">
                Lead guest details
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Booking on behalf of a friend? Enter their details.
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

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-heading text-gray-800 mb-4">
                Select when to pay
              </h2>
              <div className="space-y-4">
                <label className="flex items-start p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentTime"
                    value="payNow"
                    checked={paymentTime === "payNow"}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">Pay now</p>
                    <p className="text-sm text-gray-500">
                      You can cancel for free until 8:00am local time on Nov 23,
                      2025.
                    </p>
                  </div>
                </label>
                <label className="flex items-start p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentTime"
                    value="payLater"
                    checked={paymentTime === "payLater"}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">
                      Book now, pay later
                    </p>
                    <p className="text-sm text-gray-500">
                      We'll charge your card ${totalPayable.toFixed(2)} on Nov
                      22, 2025, 8:00pm. You can cancel for free until Nov 23,
                      2025, 8:00am local time.
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
                <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-3 font-medium text-gray-800">
                    Credit or debit card
                  </span>
                </label>
                {paymentMethod === "card" && paymentTime === "payNow" && (
                  <div className="p-4 border rounded-lg space-y-4">
                    {/* Card inputs here */}
                    <p className="text-sm text-gray-600">
                      Card form appears here
                    </p>
                  </div>
                )}
                {paymentMethod === "card" && paymentTime === "payLater" && (
                  <div className="p-4 border rounded-lg space-y-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Confirm with credit or debit card
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Your card won't be charged today.
                    </p>
                    <div>
                      <label
                        htmlFor="cardNumberLater"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Card number
                      </label>
                      <Input
                        id="cardNumberLater"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDateLater"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Expiry
                        </label>
                        <Input id="expiryDateLater" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label
                          htmlFor="cvvLater"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          CVV
                        </label>
                        <Input id="cvvLater" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="cardNameLater"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Name on card
                      </label>
                      <Input id="cardNameLater" />
                    </div>
                  </div>
                )}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-3 font-medium text-gray-800">PayPal</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="gpay"
                    checked={paymentMethod === "gpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-3 font-medium text-gray-800">
                    Google Pay
                  </span>
                </label>
              </div>
            </div>

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

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <div className="relative mb-4">
                  <img
                    src="/images/r1.jpg.avif"
                    alt={itemName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                  <h3 className="absolute bottom-2 left-2 text-white font-bold">
                    {itemName}
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
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
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span>{optionTitle}</span>
                    </div>
                    <button className="text-purple-600 font-medium">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>

                <div className="border-t my-4"></div>

                <div className="space-y-2 text-sm">
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
                </div>

                <div className="border-t my-4"></div>

                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total payable</span>
                    <span>${totalPayable.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-blue-600">
                    <span>You pay today</span>
                    <span>${payTodayAmount.toFixed(2)}</span>
                  </div>
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
                  Confirm at ${payTodayAmount.toFixed(2)}
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
