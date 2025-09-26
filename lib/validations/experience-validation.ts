import { z } from 'zod';

export const experienceFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),

  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),

  price: z
    .number()
    .min(0, 'Price must be 0 or greater')
    .max(999999, 'Price must be less than 999999'),

  isOnSale: z.boolean().default(false),

  oldPrice: z
    .number()
    .min(0, 'Old price must be 0 or greater')
    .max(999999, 'Old price must be less than 999999')
    .optional(),

  adultPrice: z
    .number()
    .min(0, 'Adult price must be 0 or greater')
    .max(999999, 'Adult price must be less than 999999'),

  childPrice: z
    .number()
    .min(0, 'Child price must be 0 or greater')
    .max(999999, 'Child price must be less than 999999'),

  infantPrice: z
    .number()
    .min(0, 'Infant price must be 0 or greater')
    .max(999999, 'Infant price must be less than 999999'),

  totalLimit: z
    .number()
    .min(1, 'Total limit must be at least 1')
    .max(999999, 'Total limit must be less than 999999'),

  mainImages: z
    .array(z.instanceof(File))
    .min(1, 'At least 1 main image is required'),

  images: z
    .array(z.instanceof(File))
    .min(1, 'At least 1 image is required'),

  tagsOnCard: z
    .string()
    .min(1, 'Tags on card is required')
    .trim(),

  cardType: z
    .string()
    .min(1, 'Card type is required'),

  isMainCard: z.boolean().default(false),
  isTopExperience: z.boolean().default(false),
  isMustDo: z.boolean().default(false),
  isPopular: z.boolean().default(false),

  // Structured features (can be empty strings)
  duration: z.string().default(""),
  openToday: z.string().default(""),
  freeCancellation: z.string().default(""),
  bookNowPayLater: z.string().default(""),
  guidedTour: z.string().default(""),

  // WYSIWYG content fields (can be empty strings)
  highlights: z.string().default(""),
  inclusions: z.string().default(""),
  exclusions: z.string().default(""),
  cancellationPolicy: z.string().default(""),
  youExperience: z.string().default(""),
  knowBeforeYouGo: z.string().default(""),
  myTickets: z.string().default(""),
  exploreMore: z.string().default(""),

  // Blog slug field (array of strings)
  blogSlugs: z
    .array(z.string().min(1, 'Slug cannot be empty').trim())
    .default([]),

  // Operating hours array
  operatingHours: z
    .array(
      z.object({
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().min(1, 'End date is required'),
        openTime: z.string().min(1, 'Open time is required'),
        closeTime: z.string().min(1, 'Close time is required'),
        lastEntryTime: z.string().min(1, 'Last entry time is required'),
        title: z.string().min(1, 'Title is required'),
      })
    )
    .min(1, 'At least one operating hours entry is required'),

  // Date price range array
  datePriceRange: z
    .array(
      z.object({
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().min(1, 'End date is required'),
        price: z.number().min(0, 'Price must be 0 or greater'),
      })
    )
    .min(1, 'At least one date price range entry is required'),

  // Where to location
  whereTo: z.object({
    address: z.string().min(1, 'Address is required'),
    lat: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
    lng: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  }),

  // Package type
  packageType: z.object({
    name: z.string().min(1, 'Package name is required'),
    price: z.number().min(0, 'Package price must be 0 or greater'),
    points: z.array(
      z.object({
        title: z.string().min(1, 'Point title is required'),
        subpoints: z.array(z.string()).optional(),
      })
    ).min(1, 'At least one point is required'),
    timePriceSlots: z.array(
      z.object({
        openTime: z.string().min(1, 'Open time is required'),
        closeTime: z.string().min(1, 'Close time is required'),
        price: z.number().min(0, 'Price must be 0 or greater'),
      })
    ).min(1, 'At least one time price slot is required'),
  }),

  // Itinerary (optional)
  itinerary: z.object({
    title: z.string().min(1, 'Itinerary title is required'),
    totalDuration: z.string().optional(),
    modeOfTransport: z.string().optional(),
    startPoint: z.object({
      name: z.string().min(1, 'Start point name is required'),
      description: z.string().optional(),
      image: z.string().optional(),
      duration: z.string().optional(),
      location: z.object({
        address: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
      }).optional(),
      highlights: z.array(z.object({
        name: z.string().min(1, 'Highlight name is required'),
        image: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
      thingsToDo: z.array(z.object({
        name: z.string().min(1, 'Thing to do name is required'),
        image: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
      nearbyThingsToDo: z.array(z.object({
        name: z.string().min(1, 'Nearby thing to do name is required'),
        image: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
    }),
    points: z.array(z.object({
      order: z.number().min(1, 'Point order must be at least 1'),
      name: z.string().min(1, 'Point name is required'),
      description: z.string().optional(),
      image: z.string().optional(),
      duration: z.string().optional(),
      distance: z.string().optional(),
      travelTime: z.string().optional(),
      location: z.object({
        address: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
      }).optional(),
      highlights: z.array(z.object({
        name: z.string().min(1, 'Highlight name is required'),
        image: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
      thingsToDo: z.array(z.object({
        name: z.string().min(1, 'Thing to do name is required'),
        image: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
      attractions: z.number().optional(),
      ticketsIncluded: z.boolean().optional(),
      nearbyThingsToDo: z.array(z.object({
        name: z.string().min(1, 'Nearby thing to do name is required'),
        image: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
    })),
    endPoint: z.object({
      name: z.string().min(1, 'End point name is required'),
      description: z.string().optional(),
      image: z.string().optional(),
      location: z.object({
        address: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
      }).optional(),
    }),
  }).optional(),
}).refine(
  (data) => {
    // If on sale, old price should be greater than current price
    if (data.isOnSale && data.oldPrice !== undefined) {
      return data.oldPrice > data.price;
    }
    return true;
  },
  {
    message: 'Old price must be greater than current price when on sale',
    path: ['oldPrice'],
  }
).refine(
  (data) => {
    // Exactly one card type must be selected
    const selectedCount = [data.isMainCard, data.isTopExperience, data.isMustDo, data.isPopular].filter(Boolean).length;
    return selectedCount === 1;
  },
  {
    message: 'Please select exactly one card type',
    path: ['cardType'],
  }
);

export type ExperienceFormData = z.infer<typeof experienceFormSchema>;