import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

export function useRTL() {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const checkRTL = () => {
      const currentLang = i18n.language;
      setIsRTL(RTL_LANGUAGES.includes(currentLang));
    };

    checkRTL();
    i18n.on("languageChanged", checkRTL);

    return () => {
      i18n.off("languageChanged", checkRTL);
    };
  }, [i18n]);

  return isRTL;
}
