import { Category, CategoryResponse } from '@/types/category/category-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories`, {
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
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
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
    console.error('Error fetching categoriy by ID:', error);
    throw error;
  }
};
export const fetchCategoryBycategoryName = async (categoryName: string): Promise<Category> => {
  try {
    const response = await fetch(`${BASE_URL}/categories/name/${categoryName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch category data');
    }

    if (!data.data || data.data.length === 0) {
      throw new Error('No category found with the given name');
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching category by name:', error);
    throw error;
  }
};

