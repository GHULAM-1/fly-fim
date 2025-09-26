// Category Page Types

// Basic Info Structure
export interface BasicInfo {
    description: string;
    images: string[];
    mainImage: string[];
    oldPrice?: number;
    price: number;
    sale?: number;
    tagOnCards?: string;
    title: string;
  }
  
  // Calendar Structure
  export interface DatePriceRange {
    endDate: number;
    price: number;
    startDate: number;
  }
  
  export interface Calendar {
    datePriceRange: DatePriceRange[];
  }
  
  // Features Structure
  export interface Features {
    featureText: string;
    features: string[];
  }
  
  // Flags Structure
  export interface Flags {
    blogSlug?: string;
    isMainCard?: boolean;
    isMustDo?: boolean;
    isPopular?: boolean;
    isTopExperience?: boolean;
  }
  
  // Operating Hours Structure
  export interface OperatingHours {
    closeTime: string;
    endDate: number;
    lastEntryTime: string;
    openTime: string;
    startDate: number;
    title: string;
  }
  
  // Location Structure
  export interface WhereTo {
    address: string;
    lat: number;
    lng: number;
  }
  
  // Information Structure
  export interface Information {
    cancellationPolicy?: string;
    exclusions?: string;
    exploreMore?: string;
    highlights?: string;
    inclusions?: string;
    knowBeforeYouGo?: string;
    myTickets?: string;
    operatingHours?: OperatingHours[];
    ticketValidity?: string;
    whereTo?: WhereTo;
  }
  
  // Package Structure
  export interface PackagePoint {
    title: string;
    subpoints?: string[];
  }
  
  export interface TimePriceSlot {
    closeTime: string;
    openTime: string;
    price: number;
  }
  
  export interface PackageType {
    name: string;
    points: PackagePoint[];
    price: number;
    timePriceSlots: TimePriceSlot[];
  }
  
  export interface Packages {
    packageType: PackageType;
  }
  
  // Relationships Structure
  export interface Relationships {
    categoryId: string;
    cityId: string;
    subcategoryId: string;
    subcategoryName: string;
    categoryName: string;
    cityName: string;
  }
  
  // Ticket Price Structure
  export interface TicketPrice {
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    totalLimit: number;
  }
  
  // Structured Experience (main structure)
  export interface StructuredExperience {
    _id: string;
    basicInfo: BasicInfo;
    calendar: Calendar;
    features: Features;
    flags: Flags;
    information: Information;
    packages: Packages;
    relationships: Relationships;
    ticketPrice: TicketPrice;
  }
  
  // Review Structure
  export interface ReviewWithImageUrls {
    _creationTime: number;
    _id: string;
    experienceId: string;
    userName: string;
    imageUrls: string[];
    images: string[];
    stars: number;
    text: string;
    userId: string;
  }
  
  // Category Page Subcategory Structure
  export interface WorldwideCategoryPageSubcategory {
    subcategoryName: string;
    experiences: StructuredExperience[];
  }
  
  // Category Page Category Structure
  export interface WorldwideCategoryPageCategory {
    categoryName: string;
    subcategories: WorldwideCategoryPageSubcategory[];
  }
  
  // Categories Response Structure
  export interface WorldwideCategoryResponse {
    categories: WorldwideCategoryResponseItem[];
  }

  export interface WorldwideCategoryResponseItem {
    categoryName: string;
    subcategories: WorldwideSubcategoryResponseItem[];
  }

  export interface WorldwideSubcategoryResponseItem {
    subcategoryName: string;
  }

  // Main Category Page Data Structure
  export interface WorldwideCategoryPageData {
    category: WorldwideCategoryPageCategory;
    topExperiences: StructuredExperience[];
    popularExperiences: StructuredExperience[];
    reviews: ReviewWithImageUrls[];
    categories: WorldwideCategoryResponseItem[];
    allCategories: AllCategory[];
  }
  export interface AllCategory {
    categoryName: string;
    subcategories: CategorySubcategory[];
  }

  export interface CategorySubcategory {
    subcategoryName: string;
    experiences: StructuredExperience[]; // from your earlier types
  }
  
  
  // Filtered Category Page Data Structure
  export interface FilteredCategoryPageData {
    category: WorldwideCategoryPageCategory;
    experiences: StructuredExperience[];
    reviews: ReviewWithImageUrls[];
  }
  
  // API Request Types
  export interface CategoryPageParams {
    cityId: string;
    categoryId: string;
  }
  
  export interface FilteredCategoryPageParams extends CategoryPageParams {
    sortBy?: string;
    subcategoryNames?: string[];
  }
  
  // Query Parameters
  export interface CategoryPageQueryParams {
    sortBy?: 'popular' | 'price_low_high' | 'price_high_low';
    subcategoryNames?: string; // JSON stringified array
  }
  
  // API Response Types
  export interface WorldwideCategoryPageResponse {
    success: boolean;
    data?: WorldwideCategoryPageData;
    message: string;
    error?: string;
  }
  
  export interface FilteredWorldwideCategoryPageResponse {
    success: boolean;
    data?: FilteredCategoryPageData;
    message: string;
    error?: string;
  }
  
  // Error Response Type
  export interface CategoryPageErrorResponse {
    success: false;
    message: string;
    error?: string;
  }
  
  // Combined Response Types
  export type CategoryPageApiResponse = WorldwideCategoryPageResponse | CategoryPageErrorResponse;
  export type FilteredCategoryPageApiResponse = FilteredWorldwideCategoryPageResponse | CategoryPageErrorResponse;
  
  // Request Handler Types (for Express)
  export interface CategoryPageRequest {
    params: CategoryPageParams;
  }
  
  export interface FilteredCategoryPageRequest {
    params: FilteredCategoryPageParams;
    query: CategoryPageQueryParams;
  }
  