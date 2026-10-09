import { DiffType } from '../constants/enums';
import { SpecCategory } from '../constants/spec-fields';
import { BaseEntity } from './common';

export interface DiffItem {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  category: SpecCategory;
  diffType: DiffType;
  oldValue: any;
  newValue: any;
  oldFormatted: string;
  newFormatted: string;
  unit?: string;
  isApproved: boolean;
  isRejected: boolean;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface ComparisonReport extends BaseEntity {
  title: string;
  projectId: string;
  projectName: string;
  sourceType: 'REVISION_VS_REVISION' | 'REVISION_VS_UPLOAD' | 'EGIS_VS_EGIS';
  baseEgisId: string;
  baseSeqCode: string;
  targetEgisId: string;
  targetSeqCode?: string;
  targetUploadFileName?: string;
  diffs: DiffItem[];
  totalChanges: number;
  addedCount: number;
  modifiedCount: number;
  removedCount: number;
  approvedCount: number;
  rejectedCount: number;
  status: 'PENDING' | 'PARTIALLY_REVIEWED' | 'APPROVED' | 'REJECTED';
}
