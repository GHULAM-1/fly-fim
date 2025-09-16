export interface Faq {
    _id: string;
    _creationTime: number;
    experienceId: string;
    question: string;
    answer: string;
  }
  
  export interface CreateFaqRequest {
    experienceId: string;
    question: string;
    answer: string;
  }
  
  export interface UpdateFaqRequest {
    question?: string;
    answer?: string;
  }
  
  export interface FaqResponse {
    success: boolean;
    data?: Faq | Faq[];
    message: string;
    error?: string;
  }
  
  export interface PaginatedFaqResponse {
    success: boolean;
    data: Faq[];
    pagination: {
      limit: number;
      offset: number;
      hasMore: boolean;
      nextOffset?: number;
    };
    message: string;
    error?: string;
  }
  