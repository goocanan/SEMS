import { Currency, EgisStatus, Production } from '../constants/enums';
import { BaseEntity, ValidityStatus } from './common';

export interface Egis extends BaseEntity {
  projectId: string;
  projectName: string;
  projectCode: string;
  egisId: string; // e.g. "HDE-26000125"
  aliasName?: string;
  production: Production;
  currency: Currency;
  port: string;
  warrantyMonths: number;
  issueDate: string;
  expiryDate: string;
  status: EgisStatus;
  currentSeqNumber: number;
  latestPrice: number;
  priceExpiryDate?: string;
  notes?: string;
  
  // Computed validity indicators
  egisValidity?: ValidityStatus;
  priceValidity?: ValidityStatus;
}

export interface CreateEgisInput {
  projectId: string;
  egisId?: string; // If auto-generated or manual
  aliasName?: string;
  production: Production;
  currency: Currency;
  port: string;
  warrantyMonths?: number;
  issueDate?: string;
  notes?: string;
}
