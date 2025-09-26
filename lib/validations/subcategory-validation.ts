import { z } from 'zod';

export const subcategoryFormSchema = z.object({
  subcategoryName: z
    .string()
    .min(1, 'Subcategory name is required')
    .min(2, 'Subcategory name must be at least 2 characters')
    .max(50, 'Subcategory name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Subcategory name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
});

export type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;