import { Category, Subcategory } from "../things-to-do/things-to-do-types";

export interface SimplifiedExperience {
    _id: string;
    title: string;
    cityName: string;
    cityId: string;
    categoryName: string;
    categoryId: string;
    subcategoryId: string;
    subcategoryName: string;
    price: number;
    oldPrice?: number;
    tagOnCards?: string;
    images: string[];
    imageUrls: (string | null)[];
  }
  
  export interface CategoryWithSubcategories extends Category {
    subcategories: Subcategory[];
  }
  export interface Review {
    _id: string;
    _creationTime: number;
    userName: string;
    experienceId: string;
    experienceTitle: string;
    stars: number;
    images: string[];
    imageUrls: string[];
    text: string;
  }
  export interface WorldwideData {
    experiences: SimplifiedExperience[];
    categories: CategoryWithSubcategories[];
    reviews: Review[];
  }
  
  export interface WorldwideResponse {
    success: boolean;
    data?: WorldwideData;
    message: string;
    error?: string;
  }