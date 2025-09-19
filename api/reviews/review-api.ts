import { Reviews } from "@/types/reviews/review-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchReviewsById = async (id: string): Promise<Reviews> => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/experience/${id}`, {
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
    console.error('Error fetching reviews by ID:', error);
    throw error;
  }
};