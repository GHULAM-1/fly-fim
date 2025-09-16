// Top-level
export interface SubcategoryPageResponse {
    success: boolean;
    data: SubcategoryPageData;
    message: string;
  }
  
  export interface SubcategoryPageData {
    category: CategorySummary;
    experiences: Experience[];
    reviewStats: ReviewStats;
    subcategory: SubcategorySummary;
    allCategories: AllCategory[];
  }
  
  export interface AllCategory {
    categoryName: string;
    subcategories: CategorySubcategory[];
  }

  export interface CategorySubcategory {
    subcategoryName: string;
    experiences: Experience[]; // from your earlier types
  }
  
  // Summaries
  export interface CategorySummary {
    categoryName: string;
    subcategories: string[];
  }
  
  export interface SubcategorySummary {
    subcategoryName: string;
  }
  
  export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
  }
  
  // Experience
  export interface Experience {
    _id: string;
    basicInfo: BasicInfo;
    calendar: Calendar;
    features: Features;
    flags: ExperienceFlags;
    information: Information;
    packages: Packages;
    relationships: Relationships;
    ticketPrice: TicketPrice;
  }
  
  // Basic info about an experience
  export interface BasicInfo {
    title: string;
    description: string;
    images: string[];      // URLs
    mainImage: string[];   // URLs
    price: number;
    tagOnCards?: string;
    oldPrice?: number;
    sale?: number;
  }
  
  // Availability / pricing by date range
  export interface Calendar {
    datePriceRange: DatePriceRange[];
  }
  
  export interface DatePriceRange {
    startDate: number; // ms timestamp
    endDate: number;   // ms timestamp
    price: number;
  }
  
  // Bulleted features
  export interface Features {
    featureText: string;
    features: string[];
  }
  
  // Flags that may or may not be present
  export interface ExperienceFlags {
    isPopular?: boolean;
    isMustDo?: boolean;
    isTopExperience?: boolean;
    isMainCard?: boolean;
    blogSlug?: string;
  }
  
  // Operational info & location
  export interface Information {
    cancellationPolicy?: string;
    operatingHours?: OperatingHour[];
    whereTo?: WhereTo;
    exclusions?: string;
    exploreMore?: string;
    highlights?: string;
    inclusions?: string;
    knowBeforeYouGo?: string;
    myTickets?: string;
    ticketValidity?: string;
  }
  
  export interface OperatingHour {
    title: string;
    openTime: string;      // "HH:mm"
    closeTime: string;     // "HH:mm"
    lastEntryTime?: string; // "HH:mm"
    startDate: number;     // ms timestamp
    endDate: number;       // ms timestamp
  }
  
  export interface WhereTo {
    address: string;
    lat: number;
    lng: number;
  }
  
  // Packages / time slots
  export interface Packages {
    packageType: PackageType;
  }
  
  export interface PackageType {
    name: string;
    price: number;
    points: PackagePoint[];
    timePriceSlots: TimePriceSlot[];
  }
  
  export interface PackagePoint {
    title: string;
    subpoints?: string[];
  }
  
  export interface TimePriceSlot {
    openTime: string;  // "HH:mm"
    closeTime: string; // "HH:mm"
    price: number;
  }
  
  // Relationships / taxonomy
  export interface Relationships {
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
    cityId: string;
    cityName: string;
  }
  
  // Ticket prices
  export interface TicketPrice {
    adultPrice: number;
    childPrice: number;
    seniorPrice: number;
    totalLimit: number;
  }
  