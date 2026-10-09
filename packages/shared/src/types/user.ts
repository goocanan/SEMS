import { UserRole } from '../constants/enums';
import { BaseEntity } from './common';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  isActive: boolean;
}

export interface MarketingPersonnel extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  region?: string;
  activeProjectCount: number;
}
