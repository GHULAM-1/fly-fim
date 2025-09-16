import { 
  ThingsToDoResponse, 
  ThingsToDoPageData, 
  ExperienceResponse, 
  ExperienceListResponse,
  PaginatedExperienceResponse,
  ThingsToDoQueryParams 
} from '@/types/things-to-do/things-to-do-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get things to do page data by city ID
export const fetchThingsToDoByCityId = async (cityId: string): Promise<ThingsToDoPageData> => {
  try {
    const response = await fetch(`${BASE_URL}/things-to-do/${cityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ThingsToDoResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch things to do data');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching things to do by city ID:', error);
    throw error;
  }
};
