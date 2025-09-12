import React from 'react'

interface GuestsBannerProps {
  countries?: string[];
  totalCountries?: number;
}

const defaultCountries = ["United States", "United Kingdom", "France"];
const defaultTotalCountries = 94;

export default function GuestsBanner({ 
  countries = defaultCountries, 
  totalCountries = defaultTotalCountries 
}: GuestsBannerProps) {
  const flags = [
    { src: '/flags/flag1.svg', alt: 'Argentina' },
    { src: '/flags/flag2.svg', alt: 'Romania' },
    { src: '/flags/flag3.svg', alt: 'United States' },
    { src: '/flags/flag4.svg', alt: 'United Kingdom' }
  ];

  // Duplicate flags for seamless loop
  const duplicatedFlags = [...flags, ...flags, ...flags];

  return (
    <div className="bg-gradient-to-r  mt-8 from-[#f3e6ff66] to-[#f3e6ff66] md:rounded-lg my-6 w-full">
      <div className="flex items-center gap-4 md:h-20 h-17 px-6">
        {/* Moving Flags - Vertical Marquee */}
        <div className="flex-shrink-0 w-12 h-full overflow-hidden">
          <div className="flex flex-col gap-2 animate-vertical-scroll">
            {duplicatedFlags.map((flag, index) => (
              <div key={index} className="flex-shrink-0 w-8 h-6">
                <img
                  src={flag.src}
                  alt={flag.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <p className="text-[#444444] md:text-sm text-xs font-halyard-text">
            Guests from{' '}
            {countries.map((country, index) => (
              <React.Fragment key={country}>
                <strong className="font-semibold">{country}</strong>
                {index < countries.length - 1 && ', '}
              </React.Fragment>
            ))}{' '}
            and over{' '}
            <strong className="font-semibold">{totalCountries} countries</strong>{' '}
            have loved this experience
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes vertical-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        .animate-vertical-scroll {
          animation: vertical-scroll 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
