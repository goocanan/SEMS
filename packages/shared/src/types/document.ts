import { DocumentType } from '../constants/enums';
import { BaseEntity } from './common';

export interface DocumentItem extends BaseEntity {
  projectId: string;
  egisId?: string;
  revisionId?: string;
  seqCode?: string;
  name: string;
  originalFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  documentType: DocumentType;
  uploadedBy: string;
  uploadedByName: string;
  downloadUrl?: string;
  version: number;
}
