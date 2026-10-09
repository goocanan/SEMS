import { BuildingType, ProductType, ProjectStatus } from '../constants/enums';
import { BaseEntity, ValidityStatus } from './common';

export interface ProjectAlias {
  id: string;
  name: string;
  isPrimary: boolean;
  addedAt: string;
}

export interface EgisSummaryItem {
  id: string;
  egisId: string; // e.g. HDE-26000125
  aliasName?: string;
  currency: string;
  production: string;
  latestSeqNumber: number;
  latestPrice: number;
  egisValidity: ValidityStatus;
  priceValidity: ValidityStatus;
  status: string;
}

export interface Project extends BaseEntity {
  projectCode: string; // PRJ-2026-00125
  name: string;
  aliases: ProjectAlias[];
  customerId: string;
  customerName: string;
  endUser?: string;
  consultant?: string;
  contractor?: string;
  location: string;
  buildingType: BuildingType;
  productType: ProductType;
  unitQuantity: number;
  primaryMarketingId: string;
  primaryMarketingName: string;
  supportingMarketing?: string[];
  status: ProjectStatus;
  notes?: string;
  egisSummaries?: EgisSummaryItem[];
}

export interface ProjectFilterCriteria {
  search?: string;
  status?: ProjectStatus;
  productType?: ProductType;
  marketingId?: string;
  location?: string;
  buildingType?: BuildingType;
}

export interface DuplicateProjectMatch {
  existingProject: Project;
  similarityScore: number; // 0.0 - 1.0
  matchedName: string;
}
