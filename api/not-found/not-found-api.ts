import { CategoriesResponse } from "@/types/not-found/not-found-types";
import { SubcategoryPageResponse } from "@/types/subcategory-page/subcategory-page-types";

  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Get things to do page data by city ID
  export const fetchNotFound = async (): Promise<CategoriesResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/not-found-page`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: CategoriesResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch category page data');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching category page by city ID:', error);
      throw error;
    }
  };
  