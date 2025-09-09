"use client";
import React, { useState, useEffect, Suspense } from "react";
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
  Ticket,
  Lock,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountryCodeSelector from "@/components/booking/CountryCodeSelector";
import { FaPaypal, FaGooglePay } from "react-icons/fa";
import { Circle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CreditCardForm from "@/components/booking/CreditCardForm";
import { isValidPhoneNumber } from "libphonenumber-js";

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

const guestDetailsSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Enter full name as per your valid ID" })
      .refine((name) => name.trim().includes(" "), {
        message: "Enter full name as per your valid ID",
      }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .refine(isValidPhoneNumber, { message: "Enter a valid phone number" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    confirmEmail: z.string().email({ message: "Enter a valid email address" }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Enter matching email ID",
    path: ["confirmEmail"],
  });

type GuestDetailsInput = z.infer<typeof guestDetailsSchema>;

const ConfirmAndPayPage = () => {
  const searchParams = useSearchParams();
  const [adultCount, setAdultCount] = useState(1);
  const [seniorCount, setSeniorCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [paymentTime, setPaymentTime] = useState("payNow");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState(false);

  const [countryCode, setCountryCode] = useState("+92");
  const [nationalNumber, setNationalNumber] = useState("");

  useEffect(() => {
    if (paymentError) {
      const timer = setTimeout(() => {
        setPaymentError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentError]);

  useEffect(() => {
    if (paymentTime === "payLater") {
      setPaymentMethod("card");
    }
  }, [paymentTime]);

  const form = useForm<GuestDetailsInput>({
    resolver: zodResolver(guestDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      confirmEmail: "",
    },
  });

  useEffect(() => {
    const fullPhoneNumber = `${countryCode}${nationalNumber}`;

    form.setValue("phone", fullPhoneNumber, { shouldValidate: true });
  }, [countryCode, nationalNumber, form]);

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

  const dateObj = new Date(date);
  const formattedMonth = dateObj.toLocaleString("en-US", { month: "short" });
  const formattedDayOfMonth = dateObj.getDate();
  const formattedDayShort = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const cancellationDate = new Date(dateObj);
  cancellationDate.setDate(dateObj.getDate() - 1);
  const formattedCancellationDate = cancellationDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );

  const paymentChargeDate = new Date(dateObj);
  paymentChargeDate.setDate(dateObj.getDate() - 2);
  const formattedPaymentChargeDate = paymentChargeDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );

  const itemLink = `/things-to-do/${city}/${category}/${subcategory}/${item}`;
  const ticketsLink = `/booking?${searchParams.toString()}`;

  const handlePaymentAttempt = () => {
    if (!paymentMethod) {
      setPaymentError(true);
    } else {
      form.handleSubmit((data) => console.log("Form Data:", data))();
      console.log("Processing payment with:", paymentMethod);
    }
  };

  const renderPaymentButton = (isSticky = false) => {
    let buttonContent;
    let buttonClasses = "";
    const amountText =
      paymentTime === "payLater" ? "at $0" : `$${totalPayable.toFixed(2)}`;

    switch (paymentMethod) {
      case "paypal":
        buttonContent = (
          <div className="flex items-center justify-center">
            <span className="mr-2 font-halyard-text-light">Pay with</span>
            <img
              src="/images/booking/paypal.svg"
              alt="PayPal Logo"
              className="h-6"
            />
          </div>
        );
        buttonClasses = "bg-[#ffc439] hover:bg-[#ffb400] text-[#111]";
        break;
      case "gpay":
        buttonContent = (
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <span className="mr-2 font-halyard-text-light">Pay with</span>
            <img
              src="/images/booking/googlePay.svg"
              alt="Google Pay Logo"
              className="h-8"
            />
            <span className="text-lg font-halyard-text-light">Pay</span>
          </div>
        );
        buttonClasses = "bg-black hover:bg-gray-800 text-white";
        break;
      default:
        buttonContent = (
          <div className="flex items-center justify-center">
            <Lock size={16} className="mr-2" />
            Confirm {amountText}
          </div>
        );
        buttonClasses = "bg-[#6A00D5] hover:bg-[#5A00B5] text-white";
        break;
    }

    if (paymentTime === "payLater") {
      buttonContent = (
        <div className="flex items-center justify-center">
          <Lock size={16} className="mr-2" />
          Confirm at $0
        </div>
      );
      buttonClasses = "bg-[#6A00D5] hover:bg-[#5A00B5] text-white";
    }

    return (
      <Button
        onClick={handlePaymentAttempt}
        className={`w-full font-semibold rounded-xl transition-all duration-300 ease-in-out ${
          isSticky ? "py-4 text-base" : "py-6 text-lg"
        } ${buttonClasses}`}
      >
        {buttonContent}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {paymentError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100/90 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center justify-between w-full max-w-md">
          <div className="flex items-center">
            <AlertTriangle
              className="h-5 w-5 text-red-600 mr-3"
              aria-hidden="true"
            />
            <p className="text-sm font-medium ">
              Please select a payment method to proceed.
            </p>
          </div>
          <button
            onClick={() => setPaymentError(false)}
            className=" hover:text-red-800"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <header className="fixed top-0 left-0 w-full bg-white z-40 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center max-w-[1200px] mx-auto h-16 md:h-20">
            <div className="flex flex-row gap-4 md:gap-10 items-center min-w-0">
              <Link href="/" className="shrink-0">
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-24"
                />
              </Link>
              <div className="text-xs text-gray-500 font-halyard-text-light items-center gap-2 hidden sm:flex">
                <Link
                  href={itemLink}
                  className="text-[#444444] hover:text-purple-600 underline cursor-pointer truncate"
                >
                  1. {itemName}
                </Link>
                <ChevronRight size={16} className="shrink-0" />
                <Link
                  href={ticketsLink}
                  className="text-[#444444] hover:text-purple-600 underline cursor-pointer whitespace-nowrap"
                >
                  2. Tickets
                </Link>
                <ChevronRight size={16} className="shrink-0" />
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  3. Confirm & pay
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 font-halyard-text-light shrink-0">
              <Link
                href="/help"
                className="text-sm flex items-center gap-1 hover:text-purple-600"
              >
                <CircleHelp strokeWidth={1.5} size={18} />
                <span className="hidden md:inline">Help</span>
              </Link>
              <Button
                variant="outline"
                className="border-gray-300 text-xs px-3 py-1.5 h-auto"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 md:pt-28 pb-40 lg:pb-32 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-7">
            {/* DYNAMIC DATE HERE */}
            <div className="bg-gray-100 p-4 rounded-lg font-halyard-text-light text-sm">
              You can cancel for free until 9:00am local time on{" "}
              {formattedCancellationDate}.
            </div>
            <div>
              <h2 className="text-2xl font-heading text-[#444444] mb-2">
                Guests
              </h2>
              <div className="flex items-center gap-2 text-sm font-halyard-text-light mb-4">
                <Zap size={14} className="text-yellow-400 fill-amber-400" />
                Likely to sell out
              </div>
              <div className="bg-gray-100 p-3 flex flex-row items-start sm:items-center gap-3 rounded-lg text-sm font-halyard-text-light mb-6">
                <Bullet />
                <span>
                  Children aged 0-5 can enter for free. Simply show your ID at
                  the venue and enter.
                </span>
              </div>
              <div className="space-y-4">
                {/* Guest Counters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-[#444444] text-lg">Adult</p>
                    <p className="text-sm text-[#444444] font-halyard-text-light">
                      13 to 61 yrs
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto justify-between">
                    <span className="font-semibold text-[#444444] sm:w-20 text-left sm:text-right">
                      ${adultPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-9 h-9 rounded-full transition-colors ${
                          adultCount > 1
                            ? "bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200 cursor-pointer"
                            : "bg-gray-100 text-gray-400"
                        }`}
                        onClick={() =>
                          setAdultCount((prev) => Math.max(1, prev - 1))
                        }
                        disabled={adultCount <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-10 text-center font-medium">
                        {adultCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer"
                        onClick={() => setAdultCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-[#444444] text-lg">Senior</p>
                    <p className="text-sm text-[#444444] font-halyard-text-light">
                      62 yrs and above
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto justify-between">
                    <span className="font-semibold text-[#444444] sm:w-20 text-left sm:text-right">
                      ${seniorPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-9 h-9 rounded-full transition-colors ${
                          seniorCount > 0
                            ? "bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200 cursor-pointer"
                            : "bg-gray-100 text-gray-400"
                        }`}
                        onClick={() =>
                          setSeniorCount((prev) => Math.max(0, prev - 1))
                        }
                        disabled={seniorCount <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-10 text-center font-medium">
                        {seniorCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer"
                        onClick={() => setSeniorCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-[#444444] text-lg">Child</p>
                    <p className="text-sm text-[#444444] font-halyard-text-light">
                      6 to 12 yrs
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto justify-between">
                    <span className="font-semibold text-[#444444] sm:w-20 text-left sm:text-right">
                      ${childPrice.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-9 h-9 rounded-full transition-colors ${
                          childCount > 0
                            ? "bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200 cursor-pointer"
                            : "bg-gray-100 text-gray-400"
                        }`}
                        onClick={() =>
                          setChildCount((prev) => Math.max(0, prev - 1))
                        }
                        disabled={childCount <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-10 text-center font-medium">
                        {childCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer"
                        onClick={() => setChildCount((prev) => prev + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details Form */}
            <div className="pt-12">
              <h2 className="text-2xl font-halyard-text font-semibold text-gray-700 mb-1">
                Guest details
              </h2>
              <p className="text-sm text-gray-700 mb-6 font-halyard-text-light">
                Add the names of each guest for seamless access.
              </p>
              <Form {...form}>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem>
                          {" "}
                          <FormLabel className="text-lg text-[#444444]">
                            {" "}
                            Full Name{" "}
                          </FormLabel>{" "}
                          <p className="text-sm text-gray-500 font-halyard-text-light mt-1 h-8">
                            {" "}
                            Must match ID{" "}
                          </p>{" "}
                          <FormControl>
                            {" "}
                            <div
                              className={`relative mt-2 border rounded-md transition-colors ${
                                error
                                  ? "border-red-500"
                                  : "border-gray-300 focus-within:border-purple-500"
                              }`}
                            >
                              {" "}
                              <Input
                                {...field}
                                className="h-14 w-full border-none bg-transparent px-3 focus:outline-none focus-visible:ring-0"
                              />{" "}
                              {error && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  {" "}
                                  <Info
                                    size={20}
                                    className="fill-red-500 text-white"
                                  />{" "}
                                </div>
                              )}{" "}
                            </div>{" "}
                          </FormControl>{" "}
                          <FormMessage className="text-red-500 text-sm mt-1" />{" "}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem>
                          {" "}
                          <FormLabel className="text-lg text-[#444444]">
                            {" "}
                            Email address{" "}
                          </FormLabel>{" "}
                          <p className="text-sm text-gray-500 font-halyard-text-light mt-1 h-8">
                            {" "}
                            We'll send your tickets here{" "}
                          </p>{" "}
                          <FormControl>
                            {" "}
                            <div
                              className={`relative mt-2 border rounded-md transition-colors ${
                                error
                                  ? "border-red-500"
                                  : "border-gray-300 focus-within:border-purple-500"
                              }`}
                            >
                              {" "}
                              <Input
                                {...field}
                                type="email"
                                className="h-14 w-full border-none bg-transparent px-3 focus:outline-none focus-visible:ring-0"
                              />{" "}
                              {error && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  {" "}
                                  <Info
                                    size={20}
                                    className="fill-red-500 text-white"
                                  />{" "}
                                </div>
                              )}{" "}
                            </div>{" "}
                          </FormControl>{" "}
                          <FormMessage className="text-red-500 text-sm mt-1" />{" "}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField
                      control={form.control}
                      name="confirmEmail"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem>
                          {" "}
                          <FormLabel className="text-lg text-[#444444]">
                            {" "}
                            Confirm email address{" "}
                          </FormLabel>{" "}
                          <p className="text-sm text-gray-500 font-halyard-text-light mt-1 h-8">
                            {" "}
                            Just to ensure we've got this right{" "}
                          </p>{" "}
                          <FormControl>
                            {" "}
                            <div
                              className={`relative mt-2 border rounded-md transition-colors ${
                                error
                                  ? "border-red-500"
                                  : "border-gray-300 focus-within:border-purple-500"
                              }`}
                            >
                              {" "}
                              <Input
                                {...field}
                                type="email"
                                className="h-14 w-full border-none bg-transparent px-3 focus:outline-none focus-visible:ring-0"
                              />{" "}
                              {error && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  {" "}
                                  <Info
                                    size={20}
                                    className="fill-red-500 text-white"
                                  />{" "}
                                </div>
                              )}{" "}
                            </div>{" "}
                          </FormControl>{" "}
                          <FormMessage className="text-red-500 text-sm mt-1" />{" "}
                        </FormItem>
                      )}
                    />

                    {/* FIX 3: Replace FormField with a manually controlled component setup */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-lg text-[#444444]">
                            Phone number
                          </FormLabel>
                          <p className="text-sm text-gray-500 font-halyard-text-light mt-1 h-8">
                            We may reach out for booking updates here over
                            SMS/WhatsApp
                          </p>
                          <div
                            className={`flex items-center border rounded-md mt-2 transition-colors ${
                              form.formState.errors.phone
                                ? "border-red-500"
                                : "border-gray-300 focus-within:border-purple-500"
                            }`}
                          >
                            <CountryCodeSelector
                              value={countryCode}
                              onValueChange={setCountryCode} // Assuming your component has this prop
                            />
                            <div className="relative w-full">
                              <Input
                                type="tel"
                                value={nationalNumber}
                                onChange={(e) =>
                                  setNationalNumber(e.target.value)
                                }
                                className="h-14 w-full border-none bg-transparent focus:outline-none focus-visible:ring-0"
                                placeholder="3314261434"
                              />
                              {form.formState.errors.phone && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <Info
                                    size={20}
                                    className="fill-red-500 text-white"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <FormMessage className="text-red-500 text-sm mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>

            {/* Promo Code */}
            <div className="pt-4 md:w-1/2">
              <button
                onClick={() => setShowPromo(true)}
                className="text-sm font-halyard-text font-medium underline text-green-700 cursor-pointer"
              >
                Have a promo code?
              </button>
              {showPromo && (
                <div className="mt-4">
                  <label
                    htmlFor="promoCode"
                    className="block text-lg font-halyard-text font-medium text-[#444444] mb-2"
                  >
                    Enter promo code
                  </label>
                  <div className="flex items-center gap-3">
                    <Input id="promoCode" className="h-12 rounded-lg" />
                    <Button
                      variant="outline"
                      className="border-green-700 text-green-700 font-medium text-md font-halyard-text hover:bg-green-700 hover:text-white h-12 px-6 cursor-pointer rounded-lg"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="pt-6">
              <h2 className="text-2xl font-heading text-[#444444] mb-4">
                Select when to pay
              </h2>
              <div className="space-y-4">
                <label className="custom-radio-label items-start sm:items-center">
                  {" "}
                  <input
                    type="radio"
                    name="paymentTime"
                    value="payNow"
                    checked={paymentTime === "payNow"}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="custom-radio-input cursor-pointer"
                  />{" "}
                  <div className="ml-3">
                    {" "}
                    <p className="font-heading text-lg text-[#444444]">
                      {" "}
                      Pay now{" "}
                    </p>{" "}
                    <p className="text-sm font-halyard-text-light text-gray-900">
                      {" "}
                      You can cancel for free until 9:00am local time on{" "}
                      {formattedCancellationDate}.{" "}
                    </p>{" "}
                  </div>{" "}
                </label>
                <label className="custom-radio-label items-start sm:items-center cursor-pointer">
                  {" "}
                  <input
                    type="radio"
                    name="paymentTime"
                    value="payLater"
                    checked={paymentTime === "payLater"}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="custom-radio-input"
                  />{" "}
                  <div className="ml-3">
                    {" "}
                    <div className="flex flex-row items-center gap-2 mb-1">
                      {" "}
                      <p className="font-heading text-lg text-[#444444]">
                        {" "}
                        Book now, pay later{" "}
                      </p>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        {" "}
                        <path
                          d="M12.7207 1.60059C13.3494 1.60084 13.7707 2.10363 13.6615 2.72292L13.556 3.32111C14.7608 3.37057 15.5556 4.3537 15.3427 5.56098L14.0573 12.8509C13.8388 14.0897 12.6423 15.0945 11.3843 15.0946H2.27299C1.01502 15.0945 0.172827 14.0897 0.391273 12.8509L1.67668 5.56098C1.89512 4.32211 3.09167 3.3173 4.34965 3.31727H4.44437L4.54917 2.72292C4.65839 2.10351 5.25678 1.60064 5.88574 1.60059C6.51474 1.60059 6.93574 2.10348 6.82652 2.72292L6.72172 3.31727H11.2784L11.3832 2.72292C11.4924 2.10348 12.0917 1.60059 12.7207 1.60059Z"
                          fill="url(#paint0_linear_1965_14329)"
                        />{" "}
                        <path
                          d="M7.86844 6.65965C7.70903 6.31084 7.96395 5.91406 8.34745 5.91406L10.4426 5.91407C11.0607 5.91407 11.622 6.27442 11.8792 6.83636L12.8184 8.8877C12.9026 9.07155 12.874 9.28737 12.745 9.44305L10.7157 11.8911C10.4155 12.2532 9.96959 12.4628 9.49925 12.4628L7.43247 12.4628C6.9867 12.4628 6.74252 11.9435 7.02684 11.6002L8.81343 9.44282C8.94227 9.28725 8.97078 9.0717 8.88682 8.88798L7.86844 6.65965Z"
                          fill="#F5F5F5"
                        />{" "}
                        <path
                          d="M3.92313 6.65965C3.76372 6.31084 4.01864 5.91406 4.40214 5.91406L4.91731 5.91407C5.53534 5.91407 6.09664 6.27442 6.35391 6.83636L7.29306 8.8877C7.37723 9.07155 7.34871 9.28737 7.21966 9.44305L5.19034 11.8911C4.89017 12.2532 4.44428 12.4628 3.97393 12.4628L3.48716 12.4628C3.04139 12.4628 2.79721 11.9435 3.08153 11.6002L4.86812 9.44282C4.99695 9.28725 5.02546 9.0717 4.9415 8.88798L3.92313 6.65965Z"
                          fill="#F5F5F5"
                        />{" "}
                        <defs>
                          {" "}
                          <linearGradient
                            id="paint0_linear_1965_14329"
                            x1="12.6753"
                            y1="1.60059"
                            x2="0.235666"
                            y2="14.3612"
                            gradientUnits="userSpaceOnUse"
                          >
                            {" "}
                            <stop stopColor="#1DC2E2"></stop>{" "}
                            <stop offset="1" stopColor="#014959"></stop>{" "}
                          </linearGradient>{" "}
                        </defs>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <p className="text-sm font-halyard-text-light text-gray-900">
                      {" "}
                      We'll charge your card ${totalPayable.toFixed(2)} on{" "}
                      {formattedPaymentChargeDate}, 9:00pm. You can cancel for
                      free until {formattedCancellationDate}, 9:00am local time.{" "}
                    </p>{" "}
                  </div>{" "}
                </label>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className={`bg-white rounded-lg ${
                paymentTime === "payLater" ? "" : "p-6 border"
              }`}
            >
              <h2 className="text-xl font-heading text-[#444444] mb-4">
                {paymentTime === "payLater"
                  ? "Confirm with credit or debit card"
                  : "Select your payment method"}
              </h2>
              {paymentTime === "payLater" && (
                <p className="text-sm font-halyard-text-light -mt-2 mb-4">
                  Your card won't be charged today.
                </p>
              )}
              {paymentTime === "payLater" ? (
                <CreditCardForm />
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg transition-all duration-200 border-gray-200 ">
                    <label className="flex items-start p-4 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="custom-radio-input"
                      />
                      <div className="ml-3 flex-1">
                        <span className="font-heading text-xl text-[#444444] flex items-center gap-2">
                          <CreditCard size={20} /> Credit or debit card
                        </span>
                        {paymentMethod === "card" && <CreditCardForm />}
                      </div>
                    </label>
                  </div>
                  <>
                    <label className="custom-radio-label cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="custom-radio-input"
                      />
                      <span className="ml-3 font-heading text-xl text-[#444444] flex items-center gap-2">
                        {" "}
                        PayPal <FaPaypal
                          size={20}
                          className="text-[#00457C]"
                        />{" "}
                      </span>
                    </label>
                    <label className="custom-radio-label cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="gpay"
                        checked={paymentMethod === "gpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="custom-radio-input"
                      />
                      <span className="ml-3 font-heading text-xl text-[#444444] flex items-center gap-2">
                        {" "}
                        Google Pay{" "}
                        <img
                          src="/images/booking/googlePay.svg"
                          alt="Google Pay Logo"
                          className="h-8"
                        />{" "}
                        <span className="text-lg">Pay</span>{" "}
                      </span>
                    </label>
                  </>
                </div>
              )}
            </div>

            {/* Final Confirmation - Hidden on mobile, shown on desktop */}
            <div className="pt-3 space-y-4 hidden lg:block">
              {paymentTime === "payLater" ? (
                <div className="flex flex-row gap-2 font-medium font-heading text-2xl">
                  <span>You pay today:</span>
                  <span>${payTodayAmount.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex flex-row gap-2 font-medium font-heading text-2xl">
                  <span>Total payable:</span>
                  <span>${totalPayable.toFixed(2)}</span>
                </div>
              )}

              <div className="h-[1px] bg-gray-200 w-full"></div>

              <div className="flex items-start gap-3 w-full md:w-[70%]">
                <input id="offers" type="checkbox" className="mt-1" />
                <label
                  htmlFor="offers"
                  className="text-xs font-halyard-text text-gray-900"
                >
                  I do not wish to receive personalized offers via email or
                  important updates via WhatsApp.
                </label>
              </div>

              <p className="text-xs text-gray-500 font-halyard-text-light">
                By continuing, you agree to the General Terms, Privacy Policy,
                and the <span className="underline">Cancellation Policy</span>.
              </p>

              <div className="w-full md:w-1/2">{renderPaymentButton()}</div>
            </div>
          </div>

          {/* Sticky Summary Card - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-lg border">
                <div className="relative">
                  <img
                    src="/images/r1.jpg.avif"
                    alt={itemName}
                    className="w-full h-15 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg break-words">
                    {itemName}
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center justify-center border rounded-lg pt-2 w-16 flex-shrink-0">
                      <span className="text-red-500 font-semibold text-sm">
                        {formattedMonth}
                      </span>
                      <span className="text-2xl text-[#444444] font-bold">
                        {formattedDayOfMonth}
                      </span>
                      <div className="text-gray-500 text-center text-xs bg-gray-100 w-full rounded-b-md">
                        {formattedDayShort}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 py-1 font-halyard-text-light min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                          <Ticket size={16} className="flex-shrink-0" />
                          <span className="truncate">{optionTitle}</span>
                        </div>
                        <Link href={ticketsLink} className="flex-shrink-0">
                          <Pencil
                            size={16}
                            className="text-gray-500 hover:text-[#444444] cursor-pointer ml-2"
                          />
                        </Link>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock size={16} className="flex-shrink-0" />
                          <span>{time}</span>
                        </div>
                        <Link href={ticketsLink} className="flex-shrink-0">
                          <Pencil
                            size={16}
                            className="text-gray-500 hover:text-[#444444] cursor-pointer"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="border-t"></div>

                  <div className="space-y-2 text-sm">
                    {adultCount > 0 && (
                      <div className="flex justify-between">
                        {" "}
                        <span className="text-gray-600">
                          {" "}
                          {adultCount} Adult{adultCount > 1 ? "s" : ""}{" "}
                        </span>{" "}
                        <span className="text-[#444444]">
                          {" "}
                          ${(adultCount * adultPrice).toFixed(2)}{" "}
                        </span>{" "}
                      </div>
                    )}
                    {seniorCount > 0 && (
                      <div className="flex justify-between">
                        {" "}
                        <span className="text-gray-600">
                          {" "}
                          {seniorCount} Senior{seniorCount > 1 ? "s" : ""}{" "}
                        </span>{" "}
                        <span className="text-[#444444]">
                          {" "}
                          ${(seniorCount * seniorPrice).toFixed(2)}{" "}
                        </span>{" "}
                      </div>
                    )}
                    {childCount > 0 && (
                      <div className="flex justify-between">
                        {" "}
                        <span className="text-gray-600">
                          {" "}
                          {childCount} Child{childCount > 1 ? "ren" : ""}{" "}
                        </span>{" "}
                        <span className="text-[#444444]">
                          {" "}
                          ${(childCount * childPrice).toFixed(2)}{" "}
                        </span>{" "}
                      </div>
                    )}
                  </div>

                  <div className="border-t"></div>

                  <div className="flex justify-between font-heading text-lg">
                    <span>Total payable</span>
                    <span>${totalPayable.toFixed(2)}</span>
                  </div>

                  {paymentTime === "payLater" ? (
                    <div className="flex flex-col">
                      <div className="border-t border-dashed border-gray-300"></div>
                      <div className="flex justify-between font-heading text-lg p-2 rounded-md">
                        <span className="text-[rgb(2,129,156)]">
                          You pay today
                        </span>
                        <span className=" text-[rgb(2,129,156)]">
                          ${payTodayAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between font-heading text-lg">
                      <span>Total payable</span>
                      <span>${totalPayable.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t"></div>

                  <p className="text-xs font-halyard-text-light text-[#444444]">
                    Supplied by HY Attractions Manager LLC.
                  </p>

                  <p className="text-xs text-[#444444] font-halyard-text-light">
                    By continuing, you agree to the{" "}
                    <a href="#" className="underline">
                      {" "}
                      General Terms{" "}
                    </a>
                    ,{" "}
                    <a href="#" className="underline">
                      {" "}
                      Privacy Policy{" "}
                    </a>
                    , and the{" "}
                    <a href="#" className="underline">
                      {" "}
                      Cancellation Policy{" "}
                    </a>
                    .
                  </p>

                  {renderPaymentButton(true)}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card - Mobile (non-sticky, at the end) */}
          <div className="lg:hidden mt-8">
            <div className="bg-white rounded-lg border">
              <div className="relative">
                <img
                  src="/images/r1.jpg.avif"
                  alt={itemName}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg break-words">
                  {itemName}
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center justify-center border rounded-lg pt-2 w-16 flex-shrink-0">
                    <span className="text-red-500 font-semibold text-sm">
                      {formattedMonth}
                    </span>
                    <span className="text-2xl text-[#444444] font-bold">
                      {formattedDayOfMonth}
                    </span>
                    <div className="text-gray-500 text-center text-xs bg-gray-100 w-full rounded-b-md">
                      {formattedDayShort}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 py-1 font-halyard-text-light min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                        <Ticket size={16} className="flex-shrink-0" />
                        <span className="truncate">{optionTitle}</span>
                      </div>
                      <Link href={ticketsLink} className="flex-shrink-0">
                        <Pencil
                          size={16}
                          className="text-gray-500 hover:text-[#444444] cursor-pointer ml-2"
                        />
                      </Link>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={16} className="flex-shrink-0" />
                        <span>{time}</span>
                      </div>
                      <Link href={ticketsLink} className="flex-shrink-0">
                        <Pencil
                          size={16}
                          className="text-gray-500 hover:text-[#444444] cursor-pointer"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="border-t"></div>
                <div className="space-y-2 text-sm">
                  {adultCount > 0 && (
                    <div className="flex justify-between">
                      {" "}
                      <span className="text-gray-600">
                        {" "}
                        {adultCount} Adult{adultCount > 1 ? "s" : ""}{" "}
                      </span>{" "}
                      <span className="text-[#444444]">
                        {" "}
                        ${(adultCount * adultPrice).toFixed(2)}{" "}
                      </span>{" "}
                    </div>
                  )}
                  {seniorCount > 0 && (
                    <div className="flex justify-between">
                      {" "}
                      <span className="text-gray-600">
                        {" "}
                        {seniorCount} Senior{seniorCount > 1 ? "s" : ""}{" "}
                      </span>{" "}
                      <span className="text-[#444444]">
                        {" "}
                        ${(seniorCount * seniorPrice).toFixed(2)}{" "}
                      </span>{" "}
                    </div>
                  )}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      {" "}
                      <span className="text-gray-600">
                        {" "}
                        {childCount} Child{childCount > 1 ? "ren" : ""}{" "}
                      </span>{" "}
                      <span className="text-[#444444]">
                        {" "}
                        ${(childCount * childPrice).toFixed(2)}{" "}
                      </span>{" "}
                    </div>
                  )}
                    <div className="border-t  border-gray-300"></div>
                  <div className="flex justify-between font-heading text-lg">

                    <span>Total payable</span>
                    <span>${totalPayable.toFixed(2)}</span>
                  </div>

                  {paymentTime === "payLater" ? (
                    <div className="flex flex-col">
                      <div className="border-t border-dashed border-gray-300"></div>
                      <div className="flex justify-between font-heading text-lg p-2 rounded-md">
                        <span className="text-[rgb(2,129,156)]">
                          You pay today
                        </span>
                        <span className=" text-[rgb(2,129,156)]">
                          ${payTodayAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between font-heading text-lg">
                      <span>Total payable</span>
                      <span>${totalPayable.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="text-sm">
              <span className="text-gray-500">
                {paymentTime === "payLater" ? "You pay today" : "Total payable"}
              </span>
              <p className="font-bold text-xl text-[#444444]">
                $
                {(paymentTime === "payLater"
                  ? payTodayAmount
                  : totalPayable
                ).toFixed(2)}
              </p>
            </div>
            <div className="w-1/2">{renderPaymentButton(true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmAndPayPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmAndPayPage />
    </Suspense>
  );
};

export default ConfirmAndPayPageWrapper;
