import { z } from 'zod';

export const specFieldValueSchema = z.object({
  fieldKey: z.string(),
  fieldLabel: z.string(),
  category: z.string(),
  value: z.any(),
  formattedValue: z.string(),
  unit: z.string().optional(),
  sourceSheet: z.string().optional(),
  sourceCell: z.string().optional(),
  sourceConfidence: z.number().min(0).max(1).optional(),
  isOverridden: z.boolean().optional(),
});

export const specificationSnapshotSchema = z.object({
  revisionId: z.string(),
  egisId: z.string(),
  seqCode: z.string(),
  projectName: z.string(),
  productType: z.string(),
  fields: z.record(specFieldValueSchema),
  completenessPercentage: z.number().min(0).max(100),
});
