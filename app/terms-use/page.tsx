import React from "react";

const termsSections = [
  {
    title: "Acceptance of Terms",
    intro:
      "By using our website and services, you confirm that you are at least 18 years old (or using our services with parental/guardian consent).",
  },
  {
    title: "Our Services",
    intro:
      "Fly in Minute provides travel and tourism services, including but not limited to:",
    items: [
      "Booking tours, cruises, and travel packages",
      "Offering guided experiences in Egypt and international destinations",
      "Providing customer support and travel assistance",
    ],
  },
  {
    title: "Bookings & Payments",
    items: [
      "All bookings are subject to availability.",
      "Prices displayed are in [USD/Egyptian Pounds] unless otherwise stated.",
      "Payment terms will be communicated at the time of booking.",
      "A booking is confirmed only after payment is received.",
    ],
  },
  {
    title: "Cancellations & Refunds",
    items: [
      "Cancellation policies vary depending on the tour or service provider.",
      "Refunds (if applicable) will follow the stated cancellation policy at the time of booking.",
      "Fly in Minute is not responsible for cancellations due to force majeure (e.g., natural disasters, strikes, political unrest).",
    ],
  },
  {
    title: "User Responsibilities",
    intro: "When using Fly in Minute's website and services, you agree to:",
    items: [
      "Provide accurate and up-to-date information.",
      "Not use the website for unlawful or fraudulent purposes.",
      "Respect local laws, customs, and tour guidelines while traveling.",
    ],
  },
  {
    title: "Intellectual Property",
    intro:
      "All content on our website, including text, images, logos, and videos, is the property of Fly in Minute. You may not copy, reproduce, or distribute any materials without prior written permission.",
  },
  {
    title: "Limitation of Liability",
    items: [
      "Fly in Minute acts as an intermediary between travelers and third-party service providers (hotels, airlines, cruise operators, etc.).",
      "We are not liable for damages, delays, injuries, or losses resulting from third-party services.",
    ],
  },
  {
    title: "Changes to Terms",
    intro:
      "Fly in Minute may update these Terms of Usage at any time. Changes will be effective immediately upon posting on our website www.flyfim.com.",
  },
  {
    title: "Contact Us",
    intro: "For any questions regarding these Terms, please contact us:",
    contact: [
      "📧 Email: support@flyfim.com",
      "🌍 Website: www.flyfim.com",
      "📍 Address: 1 Cornish Al Nile, Luxor, Egypt 85954",
    ],
  },
];

export default function TermsPolicy() {
  return (
    <div className="mt-20 px-[20px] font-halyard-text pb-[128px] mb-[60px]">
      <h1 className="text-[24px] text-[#545454] mb-[16px] font-halyard-text font-semibold">
        Terms of Usage – Fly in Minute
      </h1>
      <span className="text-[#444444] font-semibold text-[14px]">
        Last Updated:
      </span>
      <span className="text-[#444444] text-[14px]"> September 4, 2025</span>

      <p className="text-[#444444] text-[14px] mt-2">
        Welcome to Fly in Minute. By accessing or using our website, booking
        tours, or engaging with our services, you agree to the following Terms
        of Usage. Please read them carefully.
      </p>

      {/* Terms Sections */}
      {termsSections.map((section, index) => (
        <div key={index}>
          <h2 className="text-[18px] font-semibold text-[#444444] mt-6 mb-2">
            {index + 1}. {section.title}
          </h2>

          {section.intro && !section.items && !section.contact && (
            <p className="text-[#444444] text-[14px]">{section.intro}</p>
          )}

          {section.intro && (section.items || section.contact) && (
            <p className="text-[#444444] text-[14px] mb-2">{section.intro}</p>
          )}

          {section.items && (
            <ul className="list-disc ml-6 text-[#444444] text-[14px] space-y-1">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}

          {section.contact && (
            <div className="text-[#444444] text-[14px] space-y-1">
              {section.contact.map((info, idx) => (
                <p key={idx}>{info}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
