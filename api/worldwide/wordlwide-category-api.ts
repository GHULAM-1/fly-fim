import { WorldwideResponse } from '@/types/worldwide/worldwide-home-types';
import { WorldwideCategoryPageResponse } from '@/types/worldwide/worlwide-category-types';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Get things to do page data by city ID
  export const fetchWorldwideCategoryPage = async (categoryId: string): Promise<WorldwideCategoryPageResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/worldwide/category/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: WorldwideCategoryPageResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch things to do data');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching things to do by city ID:', error);
      throw error;
    }
  };
    // Get filtered subcategory experiences with sorting
    export const fetchFilteredCategoryExperiences = async (
      categoryId: string,
      sortBy: string = 'price_low_high'
    ): Promise<WorldwideCategoryPageResponse> => {
      try {
        const url = `${BASE_URL}/worldwide/category/${categoryId}/filter/?sortBy=${sortBy}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data: WorldwideCategoryPageResponse = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch filtered subcategory experiences');
        }
  
        return data;
      } catch (error) {
        console.error('Error fetching filtered subcategory experiences:', error);
        throw error;
      }
    };