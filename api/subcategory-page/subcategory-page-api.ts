import { SubcategoryPageResponse } from "@/types/subcategory-page/subcategory-page-types";

  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Get things to do page data by city ID
  export const fetchSubcategoryPageById = async (cityId: string, categoryId: string, subcategoryName: string): Promise<SubcategoryPageResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/subcategory-page/${cityId}/${categoryId}/${subcategoryName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubcategoryPageResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch category page data');
      }

      return data;
    } catch (error) {
      console.error('Error fetching category page by city ID:', error);
      throw error;
    }
  };

  // Get filtered subcategory experiences with sorting
  export const fetchFilteredSubcategoryExperiences = async (
    cityId: string,
    categoryId: string,
    subcategoryName: string,
    sortBy: string = 'price_low_high'
  ): Promise<SubcategoryPageResponse> => {
    try {
      const url = `${BASE_URL}/subcategory-page/filtered/${cityId}/${categoryId}/${subcategoryName}?sortBy=${sortBy}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubcategoryPageResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch filtered subcategory experiences');
      }

      return data;
    } catch (error) {
      console.error('Error fetching filtered subcategory experiences:', error);
      throw error;
    }
  };
  