import { City, CityResponse } from '@/types/cities/cities-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCities = async (): Promise<City[]> => {
  try {
    const response = await fetch(`${BASE_URL}/cities`, {
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
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const fetchCityById = async (id: string): Promise<City> => {
  try {
    const response = await fetch(`${BASE_URL}/cities/${id}`, {
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
    console.error('Error fetching city by ID:', error);
    throw error;
  }
};
export const fetchCityBycityName = async (cityName: string): Promise<City> => {
  try {
    const response = await fetch(`${BASE_URL}/cities/name/${cityName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CityResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch city data');
    }

    if (!data.data || data.data.length === 0) {
      throw new Error('No city found with the given name');
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching city by name:', error);
    throw error;
  }
};

