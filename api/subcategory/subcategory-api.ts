export interface Subcategory {
  _id: string;
  _creationTime: number;
  subcategoryName: string;
}

export interface SubcategoryResponse {
  success: boolean;
  data: Subcategory[];
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Subcategory already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const fetchSubcategoryById = async (id: string): Promise<Subcategory> => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Subcategory already exists');
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
      return data; // Return as-is and let the component handle it
    }
  } catch (error) {
    console.error('Error fetching subcategory by ID:', error);
    throw error;
  }
};

export const fetchSubcategoryByName = async (subcategoryName: string): Promise<Subcategory> => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/name/${subcategoryName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Subcategory already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SubcategoryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch subcategory data');
    }

    if (!data.data || data.data.length === 0) {
      throw new Error('No subcategory found with the given name');
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching subcategory by name:', error);
    throw error;
  }
};

export const createSubcategory = async (subcategoryData: { subcategoryName: string }): Promise<Subcategory> => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subcategoryData),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Subcategory already exists');
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
      throw new Error(data.message || 'Failed to create subcategory');
    }
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }
};

export const updateSubcategory = async (subcategoryId: string, subcategoryData: { subcategoryName: string }): Promise<Subcategory> => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/${subcategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subcategoryData),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('A subcategory with this name already exists');
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
      // Return a minimal subcategory object since we don't have full data
      return {
        _id: subcategoryId, // Use the subcategoryId we passed in
        _creationTime: Date.now(), // We don't have this in the response
        subcategoryName: subcategoryData.subcategoryName
      };
    } else {
      throw new Error(data.message || 'Failed to update subcategory');
    }
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }
};

export const deleteSubcategory = async (subcategoryId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/${subcategoryId}`, {
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
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};