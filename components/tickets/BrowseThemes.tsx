import React from "react";
import Link from "next/link";

interface Theme {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  href: string;
}

interface BrowseThemesProps {
  title?: string;
  themes: Theme[];
}

const BrowseThemes = ({ title = "Browse by themes", themes }: BrowseThemesProps) => {
  return (
    <div className="">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444] mb-4 md:mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((theme, index) => {
          const IconComponent = theme.icon;
          return (
            <Link
              key={index}
              href={theme.href}
              className="flex item-start md:items-center font-halyard-text-light gap-2 text-[#444444] hover:text-[#60c] transition-colors group"
            >
              <div className="flex-shrink-0">
                <IconComponent
                  size={16}
                  className="text-[#444444] mt-[2px] group-hover:text-[#60c] transition-colors"
                />
              </div>
              <span className="text-[15px] font-medium underline">
                {theme.text}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseThemes;
