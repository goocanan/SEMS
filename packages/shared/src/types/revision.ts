import { Currency, Process, RevisionStatus } from '../constants/enums';
import { BaseEntity, ValidityStatus } from './common';

export interface Revision extends BaseEntity {
  egisRefId: string;
  egisId: string; // e.g. "HDE-26000125"
  seqNumber: number;
  seqCode: string; // "001", "002"
  process: Process;
  revisionLabel: string; // e.g. "FUP REV 1", "SPEC CHECK REV 0"
  status: RevisionStatus;
  price: number;
  currency: Currency;
  priceDate: string;
  priceExpiryDate: string;
  priceValidity?: ValidityStatus;
  createdBy: string;
  createdByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  changeCount: number;
  sourceFileName?: string;
  sourceFileId?: string;
  notes?: string;
}

export interface CreateRevisionInput {
  egisRefId: string;
  process: Process;
  revisionLabel?: string;
  price: number;
  currency: Currency;
  priceDate?: string;
  notes?: string;
  sourceFileName?: string;
}
