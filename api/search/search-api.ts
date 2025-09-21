import { SearchResponse } from '@/types/search/search-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const searchApi = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch search results');
    }

    return data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};