export interface SearchCity {
  id: string;
  cityName: string;
  slug: string;
  countryName: string;
  image: string;
  imageUrl?: string[];
  creationTime?: number;
  _id?: string;
}

export interface SearchExperience {
  _id: string;
  id: string;
  title: string;
  slug: string;
  city: string;
  category: string;
  subcategory: string;
  cityName: string;
  categoryName: string;
  subcategoryName: string;
  price: number;
  image: string;
  imageUrl?: string[];
  rating: number;
  reviews_count: number;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    cities: SearchCity[];
    experiences: SearchExperience[];
  };
}