import { ValidityLevel } from '../constants/enums';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ValidityStatus {
  daysRemaining: number;
  level: ValidityLevel;
  isExpired: boolean;
  expiryDate: string;
  label: string;
}

export interface AuditLogEntry extends BaseEntity {
  userId: string;
  userName: string;
  action: string;
  entityType: 'PROJECT' | 'EGIS' | 'REVISION' | 'SPECIFICATION' | 'DOCUMENT';
  entityId: string;
  description: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
}
