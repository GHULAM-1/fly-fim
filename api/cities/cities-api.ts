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
      if (response.status === 409) {
        throw new Error('City already exists');
      }
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
      if (response.status === 409) {
        throw new Error('City already exists');
      }
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
      if (response.status === 409) {
        throw new Error('City already exists');
      }
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

export const createCity = async (cityData: { cityName: string; countryName: string; image?: File }): Promise<City> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('cityName', cityData.cityName);
    formData.append('countryName', cityData.countryName);

    if (cityData.image) {
      formData.append('image', cityData.image);
    }

    const response = await fetch(`${BASE_URL}/cities`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header, let browser set it for FormData
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('City already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle different response structures
    if (data.success && data.data) {
      return data.data;
    } else if (data._id) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to create city');
    }
  } catch (error) {
    console.error('Error creating city:', error);
    throw error;
  }
};

export const updateCity = async (cityId: string, cityData: { cityName: string; countryName: string; image?: File }): Promise<City> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('cityName', cityData.cityName);
    formData.append('countryName', cityData.countryName);

    if (cityData.image) {
      formData.append('image', cityData.image);
    }

    const response = await fetch(`${BASE_URL}/cities/${cityId}`, {
      method: 'PUT',
      body: formData, // Don't set Content-Type header, let browser set it for FormData
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('A city with this name already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  
    // Handle different response structures
    if (data.success && data.data) {
      return data.data;
    } else if (data._id) {
      return data;
    } else if (data.success) {
      // Handle success response without data field (just success + message)
      // Return a minimal city object since we don't have full data
      return {
        _id: cityId, // Use the cityId we passed in
        cityName: cityData.cityName,
        countryName: cityData.countryName,
        imageUrl: '', // We don't have this in the response
        image: ''
      };
    } else {
      throw new Error(data.message || 'Failed to update city');
    }
  } catch (error) {
    console.error('Error updating city:', error);
    throw error;
  }
};

export const deleteCity = async (cityId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/cities/${cityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
};

