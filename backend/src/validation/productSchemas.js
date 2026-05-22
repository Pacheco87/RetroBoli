import { z } from 'zod';

import { PRODUCT_CONDITIONS, PRODUCT_STATUSES } from '../domain/productConstants.js';

const booleanFromForm = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => value === true || value === 'true');

export const productPayloadSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  price: z.coerce.number().min(0),
  category: z.string().trim().min(1).max(80),
  brand: z.string().trim().min(1).max(80),
  platform: z.string().trim().min(1).max(80),
  condition: z.enum(PRODUCT_CONDITIONS),
  status: z.enum(PRODUCT_STATUSES).optional(),
  wallapopUrl: z.string().trim().url(),
  featured: booleanFromForm,
  existingImages: z.string().optional(),
});

export const closeProductSchema = z.object({
  status: z.enum(['vendido', 'retirado']),
});
