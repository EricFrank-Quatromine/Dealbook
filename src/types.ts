import { DealbookDeal, DealbookUser, Role } from './services/dealbookApi';

export type { Role, DealbookUser, DealbookDeal };
export type AuthUser = DealbookUser;
export type Deal = DealbookDeal;

export type Theme = 'dark' | 'light';

export interface AdminUserData extends DealbookUser {
  status: 'pending' | 'active' | 'disabled' | string;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface FilterState {
  search: string;
  companyStage: string;
  assetClass: string;
  cluster: string;
  geography: string;
  businessModel: string;
  sortBy: string;
  trackedOnly?: boolean;
}

export interface CallBookingRequest {
  dealRef: string;
  dealTitle?: string;
  name: string;
  email: string;
  institution?: string;
  preferredDate: string;
  preferredTime: string;
  topic: string;
  notes?: string;
}
