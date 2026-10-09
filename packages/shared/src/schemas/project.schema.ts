import { z } from 'zod';
import { BuildingType, ProductType, ProjectStatus } from '../constants/enums';

export const projectAliasSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Alias name cannot be empty'),
  isPrimary: z.boolean().default(false),
  addedAt: z.string().optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  aliases: z.array(z.string()).default([]),
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  endUser: z.string().optional(),
  consultant: z.string().optional(),
  contractor: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  buildingType: z.nativeEnum(BuildingType),
  productType: z.nativeEnum(ProductType),
  unitQuantity: z.number().int().min(1, 'At least 1 unit is required'),
  primaryMarketingId: z.string().min(1, 'Primary marketing is required'),
  primaryMarketingName: z.string().min(1, 'Primary marketing name is required'),
  supportingMarketing: z.array(z.string()).optional(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
  notes: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
