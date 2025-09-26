import { ExperienceResponse } from "@/types/experience/experience-types";
import { ExperienceFormData } from "@/lib/validations/experience-validation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchExperienceById = async (id: string): Promise<ExperienceResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/experiences/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Experience already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching experience by ID:', error);
    throw error;
  }
};

export const fetchAllExperiences = async (): Promise<ExperienceResponse[]> => {
  try {
    const response = await fetch(`${BASE_URL}/experiences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Experience already exists');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all experiences:', error);
    throw error;
  }
};

// Helper function to convert form data to API payload format
export const formatExperiencePayload = (formData: ExperienceFormData) => {
  return {
    // Basic Info
    title: formData.title,
    description: formData.description,

    // Pricing
    price: formData.price,
    isOnSale: formData.isOnSale,
    oldPrice: formData.oldPrice,
    adultPrice: formData.adultPrice,
    childPrice: formData.childPrice,
    infantPrice: formData.infantPrice,
    totalLimit: formData.totalLimit,

    // Images (convert File objects to base64 or URLs as needed)
    mainImages: formData.mainImages, // Will need file upload handling
    images: formData.images,         // Will need file upload handling

    // Card Info
    tagOnCards: formData.tagsOnCard,
    cardType: formData.cardType,
    isMainCard: formData.isMainCard,
    isTopExperience: formData.isTopExperience,
    isMustDo: formData.isMustDo,
    isPopular: formData.isPopular,

    // Features
    features: {
      duration: formData.duration,
      openToday: formData.openToday,
      freeCancellation: formData.freeCancellation,
      bookNowPayLater: formData.bookNowPayLater,
      guidedTour: formData.guidedTour,
    },

    // WYSIWYG Content
    faqSections: {
      highlights: formData.highlights,
      inclusions: formData.inclusions,
      exclusions: formData.exclusions,
      cancellationPolicy: formData.cancellationPolicy,
      yourExperience: formData.youExperience,
      knowBeforeYouGo: formData.knowBeforeYouGo,
      myTickets: formData.myTickets,
      exploreMore: formData.exploreMore,
    },

    // Blog Slugs
    blogSlugs: formData.blogSlugs,

    // Operating Hours
    operatingHours: formData.operatingHours.map(hours => ({
      title: hours.title,
      startDate: new Date(hours.startDate).getTime(),
      endDate: new Date(hours.endDate).getTime(),
      openTime: hours.openTime,
      closeTime: hours.closeTime,
      lastEntryTime: hours.lastEntryTime,
    })),

    // Date Price Range
    datePriceRange: formData.datePriceRange.map(range => ({
      startDate: new Date(range.startDate).getTime(),
      endDate: new Date(range.endDate).getTime(),
      price: range.price,
    })),

    // Location
    whereTo: {
      address: formData.whereTo.address,
      lat: formData.whereTo.lat,
      lng: formData.whereTo.lng,
    },

    // Package Type
    packageType: {
      name: formData.packageType.name,
      price: formData.packageType.price,
      points: formData.packageType.points,
      timePriceSlots: formData.packageType.timePriceSlots,
    },

    // Itinerary (if provided)
    ...(formData.itinerary && {
      itinerary: {
        title: formData.itinerary.title,
        totalDuration: formData.itinerary.totalDuration,
        modeOfTransport: formData.itinerary.modeOfTransport,
        startPoint: {
          name: formData.itinerary.startPoint.name,
          description: formData.itinerary.startPoint.description,
          image: formData.itinerary.startPoint.image,
          duration: formData.itinerary.startPoint.duration,
          location: formData.itinerary.startPoint.location,
          highlights: formData.itinerary.startPoint.highlights?.map(h => h.name) || [],
          thingsToDo: formData.itinerary.startPoint.thingsToDo?.map(t => t.name) || [],
          nearbyThingsToDo: formData.itinerary.startPoint.nearbyThingsToDo || [],
        },
        points: formData.itinerary.points.map(point => ({
          order: point.order,
          name: point.name,
          description: point.description,
          image: point.image,
          duration: point.duration,
          distance: point.distance,
          travelTime: point.travelTime,
          location: point.location,
          highlights: point.highlights || [],
          thingsToDo: point.thingsToDo || [],
          attractions: point.attractions,
          ticketsIncluded: point.ticketsIncluded,
          nearbyThingsToDo: point.nearbyThingsToDo || [],
        })),
        endPoint: {
          name: formData.itinerary.endPoint.name,
          description: formData.itinerary.endPoint.description,
          image: formData.itinerary.endPoint.image,
          location: formData.itinerary.endPoint.location,
        },
      }
    })
  };
};

export const createExperience = async (formData: FormData): Promise<ExperienceResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/experiences`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

// Keep the typed version for backward compatibility if needed
export const createExperienceFromTypedData = async (formData: ExperienceFormData): Promise<ExperienceResponse> => {
  try {
    // Format the payload
    const payload = formatExperiencePayload(formData);

    // For now, we'll use FormData to handle file uploads
    const formDataToSend = new FormData();

    // Add non-file fields as JSON
    formDataToSend.append('data', JSON.stringify({
      ...payload,
      // Remove file fields from JSON data
      mainImages: undefined,
      images: undefined,
    }));

    // Add main images
    if (formData.mainImages) {
      formData.mainImages.forEach((file, index) => {
        formDataToSend.append(`mainImages`, file);
      });
    }

    // Add other images
    if (formData.images) {
      formData.images.forEach((file, index) => {
        formDataToSend.append(`images`, file);
      });
    }

    return createExperience(formDataToSend);
  } catch (error) {
    console.error('Error creating experience from typed data:', error);
    throw error;
  }
};

export const updateExperience = async (experienceId: string, formData: FormData): Promise<ExperienceResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/experiences/${experienceId}`, {
      method: 'PUT',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('An experience with this title already exists');
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();

    // Handle different response structures
    if (data.success && data.data) {
      return data.data;
    } else if (data._id) {
      return data;
    } else if (data.success) {
      // Handle success response without data field (just success + message)
      // Return a minimal experience object since we don't have full data
      return {
        success: true,
        data: {
          _id: experienceId,
          title: 'Updated Experience', // We don't have the actual title in response
        },
        message: 'Experience updated successfully'
      } as ExperienceResponse;
    } else {
      throw new Error(data.message || 'Failed to update experience');
    }
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/experiences/${experienceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};