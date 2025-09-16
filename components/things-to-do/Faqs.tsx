import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Faq } from "@/types/faq/faq-types";

interface FaqsProps {
  faqsData?: Faq[];
}

const Faqs = ({ faqsData }: FaqsProps) => {
  // If no FAQ data, don't render the component
  if (!faqsData || faqsData.length === 0) {
    return null;
  }

  return (
    <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
      <Accordion type="single" collapsible>
        {faqsData.map((faq, index) => (
          <AccordionItem key={faq._id} value={`item-${index}`} className="border-b py-3">
            <AccordionTrigger className="hover:cursor-pointer text-[#444444] text-lg sm:text-xl font-semibold md:font-bold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="font-halyard-text-light text-[#444444]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faqs;
