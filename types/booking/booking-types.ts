export interface BookingFormData {
  userId: string;
  experienceId: string;
  bookingDate: string;
  experienceDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  totalAmount: number;
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
  experienceDetails: {
    title: string;
    time: string;
    optionTitle: string;
  };
}

export interface BookingData {
  _id: string;
  userId: string;
  experienceId: string;
  bookingDate: string;
  experienceDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
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
  };
  experienceDetails: {
    title: string;
    time: string;
    optionTitle: string;
  };
}

export interface BookingResponse {
  success: boolean;
  data?: BookingData;
  message?: string;
}

export interface CreateBookingRequest {
  experienceId: string;
  experienceDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  totalAmount: number;
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
  experienceDetails: {
    title: string;
    time: string;
    optionTitle: string;
  };
  paymentDetails?: {
    paymentMethod?: string;
    paymentTime?: "payNow" | "payLater";
  };
}