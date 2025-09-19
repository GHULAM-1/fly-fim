import { ExperienceResponse } from "@/types/experience/experience-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchExperienceById = async (id: string): Promise<ExperienceResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/experiences/${id}`, {
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
    console.error('Error fetching experience by ID:', error);
    throw error;
  }
};