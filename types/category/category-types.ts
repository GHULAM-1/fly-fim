export interface Category {
    _id: string;
    _creationTime: number;
    categoryName: string;
  }

export interface CategoryResponse {
    success: boolean;
    data: Category[];
    message: string;
}