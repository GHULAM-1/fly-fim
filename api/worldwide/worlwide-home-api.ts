import { WorldwideResponse } from '@/types/worldwide/worldwide-home-types';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Get things to do page data by city ID
  export const fetchHomePage = async (): Promise<WorldwideResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/worldwide`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: WorldwideResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch things to do data');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching things to do by city ID:', error);
      throw error;
    }
  };
  