// A single subcategory inside a category
export interface Subcategory {
    _creationTime: number;
    _id: string;
    subcategoryName: string;
  }
  
  // A top-level category object
  export interface Category {
    _creationTime: number;
    _id: string;
    categoryName: string;
    subcategories: Subcategory[];
  }
  
  // The full API response
  export interface CategoriesResponse {
    success: boolean;
    data: Category[];
    message: string;
  }
  