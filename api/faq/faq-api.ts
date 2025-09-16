import { Faq, FaqResponse } from "@/types/faq/faq-types";


  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch FAQs for multiple experience IDs
export const fetchFaqsByExperienceIds = async (experienceIds: string[]): Promise<Faq[]> => {
  try {
    // Fetch FAQs for each experience ID in parallel
    const faqPromises = experienceIds.map(id => fetchFaqById(id));
    const faqArrays = await Promise.allSettled(faqPromises);

    // Flatten results and filter out failed requests
    const allFaqs = faqArrays
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return null;
        }
      })
      .filter(result => result !== null)
      .flatMap(result => {
        const data = result?.data;
        return Array.isArray(data) ? data : [data];
      })
      .filter((faq): faq is Faq => faq !== null && faq !== undefined && faq._id !== undefined); // Filter out null/undefined FAQs

    return allFaqs;
  } catch (error) {
    return []; // Return empty array instead of throwing
  }
};

export const fetchFaqById = async (id: string): Promise<FaqResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/faqs/experience/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  