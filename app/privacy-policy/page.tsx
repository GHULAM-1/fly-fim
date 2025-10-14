import React from "react";

const privacySections = [
  {
    title: "Information We Collect",
    intro: "We may collect the following information when you interact with us:",
    items: [
      "Personal Information: Name, email, phone number, nationality, payment details.",
      "Booking Information: Travel preferences, tour dates, group size.",
      "Technical Information: IP address, browser type, and cookies for website optimization.",
    ],
  },
  {
    title: "How We Use Your Information",
    intro: "We use your information to:",
    items: [
      "Process and confirm bookings.",
      "Provide customer support.",
      "Improve our website and services.",
      "Send travel confirmations, updates, and promotional offers (if you subscribe).",
    ],
  },
  {
    title: "Sharing of Information",
    intro: "We do not sell your information. However, we may share it with:",
    items: [
      "Third-party service providers (tour guides, hotels, cruise companies, transport providers) for booking purposes.",
      "Legal authorities, if required by law.",
    ],
  },
  {
    title: "Data Security",
    items: [
      "We use secure systems to protect your information.",
      "Payment data is encrypted and processed through trusted providers.",
      "While we take all precautions, no system is 100% secure.",
    ],
  },
  {
    title: "Cookies",
    intro: "Our website uses cookies to enhance your browsing experience. You can disable cookies in your browser settings, but some features may not work properly.",
  },
  {
    title: "Your Rights",
    intro: "You have the right to:",
    items: [
      "Access, update, or correct your personal information.",
      "Request deletion of your data (subject to legal and booking requirements).",
      "Unsubscribe from marketing communications at any time.",
    ],
  },
  {
    title: "Children's Privacy",
    intro: "Our services are not directed at children under 13. We do not knowingly collect personal data from children.",
  },
  {
    title: "GDPR Compliance (EU Customers)",
    intro: "If you are located in the European Union:",
    items: [
      "You have the right to request access to your data, correction, deletion, or restriction of processing.",
      "You may withdraw consent for data processing at any time.",
      "You may request a copy of your personal data in a portable format.",
      "To exercise these rights, contact us at: support@flyfim.com.",
      "If you believe your rights have been violated, you may file a complaint with your local Data Protection Authority (DPA).",
    ],
  },
  {
    title: "CCPA Compliance (California Customers)",
    intro: "If you are a resident of California:",
    items: [
      "You have the right to request disclosure of what personal information we collect, use, and share.",
      "You have the right to request deletion of your personal information.",
      "You have the right to opt out of the sale of your personal information. (Note: Fly in Minute does not sell personal information).",
      "To exercise these rights, please contact us at support@flyfim.com.",
    ],
  },
  {
    title: "Updates to Privacy Policy",
    intro: "Fly in Minute may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date.",
  },
  {
    title: "Contact Us",
    intro: "If you have questions about this Privacy Policy, contact us:",
    contact: [
      "📧 Email: support@flyfim.com",
      "🌍 Website: www.flyfim.com",
      "📍 Address: 1 Cornish Al Nile, Luxor, Egypt 85954",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="mt-20 px-[20px] font-halyard-text pb-[128px] mb-[60px]">
      <h1 className="text-[24px] text-[#545454] mb-[16px] font-halyard-text font-semibold">
        Privacy Policy – Fly in Minute
      </h1>
      <span className="text-[#444444] font-semibold text-[14px]">
        Last Updated:
      </span>
      <span className="text-[#444444] text-[14px]"> September 4, 2025</span>

      <p className="text-[#444444] text-[14px] mt-2">
        At Fly in Minute, we value your privacy. This Privacy Policy explains
        how we collect, use, and protect your information when you use our
        website and services.
      </p>

      {/* Privacy Sections */}
      {privacySections.map((section, index) => (
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
