export enum Currency {
  USD = 'USD',
  CNY = 'CNY',
  EUR = 'EUR',
  JPY = 'JPY',
  IDR = 'IDR',
}

export enum Production {
  CHINA = 'CHINA',
  KOREA = 'KOREA',
}

export enum Process {
  QUOTATION = 'QUOTATION',
  FUP = 'FUP',
  APPROVAL = 'APPROVAL',
  SPEC_CHECK = 'SPEC_CHECK',
  FINAL = 'FINAL',
}

export enum ProductType {
  ELEVATOR = 'ELEVATOR',
  ESCALATOR = 'ESCALATOR',
  MOVING_WALK = 'MOVING_WALK',
  DUMBWAITER = 'DUMBWAITER',
}

export enum BuildingType {
  COMMERCIAL = 'Commercial',
  RESIDENTIAL = 'Residential',
  HOSPITAL = 'Hospital',
  HOTEL = 'Hotel',
  MIXED_USE = 'Mixed Use',
  OFFICE = 'Office',
  PUBLIC = 'Public / Infrastructure',
  INDUSTRIAL = 'Industrial',
}

export enum ValidityLevel {
  VALID = 'VALID',         // Green (> 60 days for EGIS, > 30 days for Price)
  CAUTION = 'CAUTION',     // Yellow (31 - 60 days)
  WARNING = 'WARNING',     // Orange (8 - 30 days)
  URGENT = 'URGENT',       // Red (1 - 7 days)
  EXPIRED = 'EXPIRED',     // Red expired (<= 0 days)
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  WON = 'WON',
  LOST = 'LOST',
  HOLD = 'HOLD',
}

export enum EgisStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  OBSOLETE = 'OBSOLETE',
  EXPIRED = 'EXPIRED',
}

export enum RevisionStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ESTIMATOR = 'ESTIMATOR',
  MARKETING = 'MARKETING',
  MANAGEMENT = 'MANAGEMENT',
  VIEWER = 'VIEWER',
}

export enum DiffType {
  ADDED = 'ADDED',
  MODIFIED = 'MODIFIED',
  REMOVED = 'REMOVED',
  UNCHANGED = 'UNCHANGED',
}

export enum DocumentType {
  FUP_EXCEL = 'FUP_EXCEL',
  QUOTATION_EXCEL = 'QUOTATION_EXCEL',
  SPEC_CHECK_EXCEL = 'SPEC_CHECK_EXCEL',
  EGIS_SPEC_EXCEL = 'EGIS_SPEC_EXCEL',
  COMPARISON_PDF = 'COMPARISON_PDF',
  TECHNICAL_DRAWING = 'TECHNICAL_DRAWING',
  OTHER = 'OTHER',
}
