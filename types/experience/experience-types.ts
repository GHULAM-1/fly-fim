import { Reviews } from "../reviews/review-types";

export interface ExperienceResponse {
  success: boolean;
  message: string;
  data: {
    _creationTime: number;
    _id: string;
    sale: number;
    oldPrice: number;
    adultPrice: number;
    categoryId: string;
    childPrice: number;
    cityId: string;
    cityName: string;
    categoryName: string;
    subcategoryName: string;
    datePriceRange: {
      startDate: number;
      endDate: number;
      price: number;
    }[];
    description: string;
    featureText: string;
    features: string[];
    images: string[];
    isPopular: boolean;
    mainImage: string[];
    operatingHours: {
      title: string;
      startDate: number;
      endDate: number;
      openTime: string;
      closeTime: string;
      lastEntryTime: string;
    }[];
    packageType: {
      name: string;
      price: number;
      points: {
        title: string;
        subpoints?: string[];
      }[];
      timePriceSlots: {
        openTime: string;
        closeTime: string;
        price: number;
      }[];
    };
    price: number;
    infantPrice: number;
    subcategoryId: string;
    tagOnCards: string;
    title: string;
    totalLimit: number;
    whereTo: {
      address: string;
      lat: number;
      lng: number;
    };

    // NEW — structured itinerary (optional)
    itinerary?: Itinerary;

    highlights?: string; // HTML
    inclusions?: string; // HTML
    exclusions?: string; // HTML
    cancellationPolicy?: string; // HTML
    yourExperience?: string; // HTML
    knowBeforeYouGo?: string; // HTML
    myTickets?: string; // HTML
    reviews: Reviews[];
  };
}

/** ---------- Itinerary model ---------- */

export interface Itinerary {
  title: string;
  totalDuration?: string; // e.g., "12 hours"
  modeOfTransport?: string; // e.g., "A/C Bus"
  startPoint: ItineraryStartPoint;
  endPoint: ItineraryEndPoint;
  points: ItineraryPoint[]; // intermediate stops in order
}

export interface GeoLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface NearbyThing {
  name: string;
  description?: string;
  image?: string;
}

/** Common fields shared by start/points/end */
interface ItineraryNodeBase {
  name: string;
  description?: string;
  location: GeoLocation;
  highlights?: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
}

/** Start point allows extra fields shown in your payload */
export interface ItineraryStartPoint extends ItineraryNodeBase {
  duration?: string;
  image?: string;
  thingsToDo?: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
  nearbyThingsToDo?: NearbyThing[];
}

/** End point is simple in your payload */
export interface ItineraryEndPoint extends ItineraryNodeBase {}

/** Intermediate point with optional travel/meta fields */
export interface ItineraryPoint extends ItineraryNodeBase {
  order?: number; // sequence number
  distance?: string; // e.g., "140 kms"
  duration?: string; // stop duration, e.g., "20 minutes"
  travelTime?: string; // time between prior node and this node
  image?: string; // optional image for the point
  thingsToDo?: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
  attractions?: number;
  ticketsIncluded?: boolean;
  nearbyThingsToDo?: NearbyThing[];
}
