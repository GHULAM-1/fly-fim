import { CategoryPageResponse } from "@/types/category-page/category-page-types";

  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Get things to do page data by city ID
  export const fetchCategoryPageById = async (cityId: string, categoryId: string): Promise<CategoryPageResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/category-page/${cityId}/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: CategoryPageResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch category page data');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching category page by city ID:', error);
      throw error;
    }
  };
  