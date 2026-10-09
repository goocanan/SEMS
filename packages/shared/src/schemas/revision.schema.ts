import { z } from 'zod';
import { Currency, Process } from '../constants/enums';

export const createRevisionSchema = z.object({
  egisRefId: z.string().min(1, 'EGIS reference is required'),
  process: z.nativeEnum(Process),
  revisionLabel: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  currency: z.nativeEnum(Currency),
  priceValidityDays: z.number().int().min(1).default(30),
  notes: z.string().optional(),
  sourceFileName: z.string().optional(),
});

export type CreateRevisionFormData = z.infer<typeof createRevisionSchema>;
