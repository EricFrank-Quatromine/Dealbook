export type Role = 'broker' | 'investor' | 'admin';

export type Jurisdiction = 'Switzerland' | 'Luxembourg';

export type Sector =
  | 'Digital Infrastructure & AI'
  | 'Sustainability & Transition'
  | 'Healthcare Technology';

export type OpportunityType =
  | 'Early Stage / VC'
  | 'Growth / SME'
  | 'Large / Institutional'
  | 'Real Assets / Infrastructure'
  | 'Emerging Managers';

export interface DealTeamMember {
  name: string;
  role: string;
  bio: string;
  previousExperience?: string;
}

export interface DealFinancials {
  valuation?: string;
  arrOrRevenue?: string;
  growthRate?: string;
  burnOrRunway?: string;
  pastFunding?: string;
  grossMargin?: string;
}

export interface DealAsk {
  roundSize: string;
  allocationAvailable: string;
  minTicket: string;
  useOfProceeds: string;
  targetClose?: string;
}

export interface DealLead {
  name: string;
  title: string;
  email: string;
  phone?: string;
}

export type ResponsiblePerson = DealLead;

export interface DealDocument {
  name: string;
  size?: string;
  type?: string;
  uploadedAt?: string;
}

export interface Deal {
  id: string;
  name: string;
  jurisdiction: Jurisdiction;
  sector: Sector;
  opportunityType: OpportunityType;
  stage: string;
  ticket: string;
  priority: string; // Internal only (visible to Partner/Admin)
  status: 'In Review' | 'Published';

  // Visibility controls (configured by Admin)
  visibleToInvestor: boolean;
  visibleToPartner: boolean;
  featuredForInvestor: boolean;

  // Person responsible for the deal (seen & edited by Admin)
  responsiblePerson: DealLead;

  // Deep dive aspects
  teaser: string;
  summary: string;
  team: DealTeamMember[];
  financials: DealFinancials;
  ask: DealAsk;
  sectorFocus: string;
  industryFocus: string;
  targetMarket?: string;
  stageMilestones?: string;

  // Files / Diligence documents
  docs: string[];
  docFiles?: DealDocument[];
}

export interface FilterState {
  search: string;
  jurisdiction: string;
  sector: string;
  opportunityType: string;
  trackedOnly?: boolean;
}

export interface AuthUser {
  email: string;
  role: Role;
}

export interface CallBookingRequest {
  dealId?: string;
  dealName?: string;
  name: string;
  email: string;
  institution?: string;
  preferredDate: string;
  preferredTime: string;
  topic: string;
  notes?: string;
}
