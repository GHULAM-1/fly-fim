import { z } from 'zod';

// Define the file validation schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const cityFormSchema = z.object({
  cityName: z
    .string()
    .min(1, 'City name is required')
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'City name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),

  countryName: z
    .string()
    .min(1, 'Country name is required')
    .min(2, 'Country name must be at least 2 characters')
    .max(50, 'Country name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Country name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),

  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Image size must be less than 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
});

export type CityFormData = z.infer<typeof cityFormSchema>;