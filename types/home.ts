export interface City {
  _id: string;
  _creationTime: number;
  cityName: string;
  countryName: string;
}

export interface Experience {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  sale?: number;
  images: string[];
  mainImage: string;
  tagOnCards?: string;
  rating: number;
  reviews: number;
  features: string[];
  featureText: string;
  highlights?: string;
  inclusions?: string;
  exclusions?: string;
  cancellationPolicy?: string;
  ticketValidity?: string;
  exploreMore?: string;
  knowBeforeYouGo?: string;
  myTickets?: string;
  operatingHours: any[];
  whereTo: {
    address: string;
    lat: number;
    lng: number;
  };
  datePriceRange: any[];
  packageType: any;
  adultPrice: number;
  childPrice: number;
  seniorPrice: number;
  totalLimit: number;
  isMainCard?: boolean;
  isTopExperience?: boolean;
  isMustDo?: boolean;
  isPopular?: boolean;
  blogSlug?: string;
  categoryId: string;
  subcategoryId: string;
  cityId: string;

  cityName: string;
  countryName: string;
}

export interface HomePageData {
  destinations: City[];
  recommendations: Experience[];
  activities: Experience[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}
