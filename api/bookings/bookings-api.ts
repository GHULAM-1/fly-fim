import { BookingFormData, BookingResponse } from "@/types/booking/booking-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateBookingPayload {
  userId: string;
  experienceId: string;
  bookingDate: string;
  experienceDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  primaryGuest: {
    fullName: string;
    email: string;
    confirmEmail: string;
    phoneNumber: string;
  };
  additionalAdults?: Array<{
    fullName: string;
    phoneNumber: string;
  }>;
  children?: Array<{
    fullName: string;
  }>;
  paymentDetails?: {
    stripeSessionId?: string;
    paymentMethod?: string;
    paymentTime?: "payNow" | "payLater";
    paypalOrderId?: string;
    paypalCaptureId?: string;
  };
  experienceDetails: {
    title: string;
    time: string;
    optionTitle: string;
  };
}

export const createBooking = async (bookingData: CreateBookingPayload): Promise<BookingResponse> => {
  try {
  
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Booking API error:", {
        status: response.status,
        statusText: response.statusText,
        errorText
      });

      if (response.status === 409) {
        throw new Error('Booking already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

export const fetchBookingById = async (id: string): Promise<BookingResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
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
    console.error('Error fetching booking by ID:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled",
  stripeSessionId?: string
): Promise<BookingResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        ...(stripeSessionId && { stripeSessionId })
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const fetchUserBookings = async (userId: string): Promise<BookingResponse[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/bookings`, {
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
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};