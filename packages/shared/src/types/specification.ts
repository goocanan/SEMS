import { SpecCategory } from '../constants/spec-fields';
import { BaseEntity } from './common';

export interface SpecFieldValue {
  fieldKey: string;
  fieldLabel: string;
  category: SpecCategory;
  value: any;
  formattedValue: string;
  unit?: string;
  sourceSheet?: string;
  sourceCell?: string;
  sourceConfidence?: number; // 0.0 - 1.0
  isOverridden?: boolean;
}

export interface SpecificationSnapshot extends BaseEntity {
  revisionId: string;
  egisId: string;
  seqCode: string;
  projectName: string;
  productType: string;
  fields: Record<string, SpecFieldValue>;
  completenessPercentage: number;
}

export interface SpecSearchFilter {
  category?: SpecCategory;
  fieldKey?: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  secondValue?: any;
}
