import { z } from 'zod';
import { Currency, Production } from '../constants/enums';

export const createEgisSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  egisId: z.string().optional(), // Auto-generated if not provided
  aliasName: z.string().optional(),
  production: z.nativeEnum(Production),
  currency: z.nativeEnum(Currency),
  port: z.string().min(1, 'Port of shipment is required'),
  warrantyMonths: z.number().int().min(1).default(12),
  notes: z.string().optional(),
});

export const updateEgisSchema = createEgisSchema.partial().omit({ projectId: true });

export type CreateEgisFormData = z.infer<typeof createEgisSchema>;
export type UpdateEgisFormData = z.infer<typeof updateEgisSchema>;
