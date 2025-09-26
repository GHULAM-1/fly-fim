export interface User {
  _id: string;
  _creationTime: number;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
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
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
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
    console.error('Error deleting user:', error);
    throw error;
  }
};