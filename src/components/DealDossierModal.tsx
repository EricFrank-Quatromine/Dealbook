import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Users,
  TrendingUp,
  DollarSign,
  Compass,
  Milestone,
  FileText,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  Bookmark,
} from 'lucide-react';
import { Deal, Role } from '../types';

interface DealDossierModalProps {
  deal: Deal | null;
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  onBookCall: (deal: Deal) => void;
  onRequestIntro?: (dealId: string) => void;
  introRequested?: boolean;
  isTracked?: boolean;
  onToggleTrack?: (dealId: string) => void;
}

type TabType = 'overview' | 'team' | 'financials' | 'ask' | 'sector' | 'stage' | 'docs';

export const DealDossierModal: React.FC<DealDossierModalProps> = ({
  deal,
  role,
  isOpen,
  onClose,
  onBookCall,
  onRequestIntro,
  introRequested = false,
  isTracked = false,
  onToggleTrack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  if (!isOpen || !deal) return null;

  const isInvestor = role === 'investor';
  const isPartner = role === 'broker';

  const handleDownloadDoc = (docName: string) => {
    setDownloadNote(docName);
    setTimeout(() => {
      setDownloadNote(null);
    }, 4000);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'financials', label: 'Financials', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'ask', label: 'The Ask', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'sector', label: 'Sector & Focus', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'stage', label: 'Stage & Milestones', icon: <Milestone className="w-3.5 h-3.5" /> },
    { id: 'docs', label: `Documents (${deal.docs?.length || 0})`, icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      id="deal-dossier-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Crisp dark backdrop with zero blur */}
      <div
        className="fixed inset-0 bg-[#0B0B0C]/90 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#151518] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl shadow-black/90 overflow-hidden z-10 my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Strip */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] bg-[#18181C] flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-[rgba(201,162,77,0.12)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)] inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Vetted Investment Dossier
              </span>
              <span className="text-xs text-[#5F5F65]">
                {deal.jurisdiction} &bull; {deal.opportunityType}
              </span>
              {deal.featuredForInvestor && (
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-[#C9A24D] text-[#0B0B0C]">
                  Featured
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#EDEDE9] font-normal tracking-tight truncate">
              {deal.name}
            </h1>

            <p className="text-xs text-[#94949B] mt-1 max-w-2xl font-light leading-relaxed">
              {deal.teaser}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Book a Call Button */}
            <button
              type="button"
              id="dossier-header-book-call-btn"
              onClick={() => onBookCall(deal)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer shadow-md shadow-[#C9A24D]/15 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Book a Call</span>
              <span className="sm:hidden">Call</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              id="dossier-modal-close-btn"
              onClick={onClose}
              className="text-[#94949B] hover:text-[#EDEDE9] p-2 rounded-xl hover:bg-[#222227] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="px-6 py-3 bg-[#111114] border-b border-[rgba(255,255,255,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] block">Round Size</span>
            <span className="font-serif text-sm text-[#EDEDE9] font-medium">{deal.ticket}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] block">Current Stage</span>
            <span className="font-mono text-xs text-[#C9A24D]">{deal.stage}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] block">Primary Sector</span>
            <span className="text-xs text-[#EDEDE9] truncate block">{deal.sector}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] block">Responsible Lead</span>
            <span className="text-xs text-[#94949B] truncate block">
              {deal.responsiblePerson ? deal.responsiblePerson.name : 'Quatromine Committee'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-2 border-b border-[rgba(255,255,255,0.08)] bg-[#151518] flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#C9A24D] text-[#C9A24D]'
                  : 'border-transparent text-[#94949B] hover:text-[#EDEDE9] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body / Tab Panes */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="p-5 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                    Executive Summary &amp; Investment Thesis
                  </h3>
                  <span className="text-[11px] text-[#5F5F65] font-mono">
                    ID: {deal.id}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#EDEDE9] leading-relaxed font-light">
                  {deal.summary}
                </p>
              </div>

              {/* Target Market & Competitive Moat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] font-semibold block">
                    Target Addressable Market
                  </span>
                  <p className="text-xs text-[#EDEDE9] font-light leading-relaxed">
                    {deal.targetMarket ||
                      'Institutional European and global enterprise client segments requiring tier-1 compliance and sovereignty.'}
                  </p>
                </div>

                <div className="p-4 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] font-semibold block">
                    Defensibility &amp; Moat
                  </span>
                  <p className="text-xs text-[#EDEDE9] font-light leading-relaxed">
                    {deal.sectorFocus ||
                      'Proprietary intellectual property, regulatory approvals, and multi-year contractual off-take pre-commitments.'}
                  </p>
                </div>
              </div>

              {/* Quick Glance Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl">
                  <span className="text-[10px] uppercase text-[#5F5F65] block">Valuation</span>
                  <span className="font-serif text-sm text-[#EDEDE9] font-medium mt-0.5 block">
                    {deal.financials?.valuation || 'Available upon request'}
                  </span>
                </div>
                <div className="p-3.5 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl">
                  <span className="text-[10px] uppercase text-[#5F5F65] block">Round Size</span>
                  <span className="font-serif text-sm text-[#EDEDE9] font-medium mt-0.5 block">
                    {deal.ask?.roundSize || deal.ticket}
                  </span>
                </div>
                <div className="p-3.5 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl">
                  <span className="text-[10px] uppercase text-[#5F5F65] block">Syndicate Allocation</span>
                  <span className="font-serif text-sm text-[#C9A24D] font-medium mt-0.5 block">
                    {deal.ask?.allocationAvailable || 'Direct Access'}
                  </span>
                </div>
                <div className="p-3.5 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl">
                  <span className="text-[10px] uppercase text-[#5F5F65] block">Target Close</span>
                  <span className="font-mono text-xs text-[#EDEDE9] mt-0.5 block">
                    {deal.ask?.targetClose || 'Q4 2026'}
                  </span>
                </div>
              </div>

              {/* Lead Partner Card */}
              {deal.responsiblePerson && (
                <div className="p-4 bg-[#18181C] border border-[rgba(201,162,77,0.25)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(201,162,77,0.15)] border border-[rgba(201,162,77,0.3)] flex items-center justify-center font-serif text-sm text-[#C9A24D] font-medium shrink-0">
                      {deal.responsiblePerson.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#C9A24D] tracking-wider block font-medium">
                        Deal Lead &amp; Relationship Partner
                      </span>
                      <p className="text-xs font-medium text-[#EDEDE9]">{deal.responsiblePerson.name}</p>
                      <p className="text-[11px] text-[#94949B]">{deal.responsiblePerson.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onBookCall(deal)}
                      className="px-3 py-1.5 bg-[#C9A24D] text-[#0B0B0C] font-medium rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer"
                    >
                      Schedule Call with {deal.responsiblePerson.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                    Executive Leadership &amp; Founders
                  </h3>
                  <p className="text-[11px] text-[#94949B] mt-0.5">
                    Verified track records, institutional pedigrees, and previous venture exits.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#5F5F65]">
                  {deal.team?.length || 0} Key Leaders
                </span>
              </div>

              {deal.team && deal.team.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deal.team.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-sm text-[#EDEDE9] font-medium">
                            {member.name}
                          </h4>
                          <span className="text-[11px] text-[#C9A24D] font-mono block">
                            {member.role}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#111114] border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-mono text-[11px] text-[#94949B]">
                          {member.name.split(' ').map((p) => p[0]).join('')}
                        </div>
                      </div>

                      <p className="text-xs text-[#EDEDE9] font-light leading-relaxed">
                        {member.bio}
                      </p>

                      {member.previousExperience && (
                        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] text-[11px] text-[#94949B]">
                          <span className="text-[#5F5F65] block uppercase tracking-wider text-[9.5px]">
                            Prior Credentials
                          </span>
                          {member.previousExperience}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#94949B] bg-[#111114] rounded-xl border border-[rgba(255,255,255,0.07)]">
                  Founder profiles are available directly within the confidential due diligence room.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                  Financial Performance &amp; Capitalization
                </h3>
                <p className="text-[11px] text-[#94949B] mt-0.5">
                  Audited figures, revenue trajectory, gross margins, and runway metrics.
                </p>
              </div>

              {deal.financials ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                      Valuation Baseline
                    </span>
                    <p className="font-serif text-base text-[#EDEDE9] font-medium">
                      {deal.financials.valuation || 'Under Negotiation'}
                    </p>
                    <p className="text-[11px] text-[#94949B] font-light">
                      Pre-money valuation agreed under current term sheet.
                    </p>
                  </div>

                  <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                      ARR / Contracted Run-Rate
                    </span>
                    <p className="font-serif text-base text-[#C9A24D] font-medium">
                      {deal.financials.arrOrRevenue || 'Commercial Phase'}
                    </p>
                    <p className="text-[11px] text-[#94949B] font-light">
                      Current recognized or pre-contracted commercial run-rate.
                    </p>
                  </div>

                  <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                      YoY Growth &amp; Trajectory
                    </span>
                    <p className="font-serif text-base text-[#EDEDE9] font-medium">
                      {deal.financials.growthRate || 'High Growth Mandate'}
                    </p>
                    <p className="text-[11px] text-[#94949B] font-light">
                      Annualized revenue growth velocity over past 12 months.
                    </p>
                  </div>

                  <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                      Gross Margin Structure
                    </span>
                    <p className="font-serif text-base text-[#EDEDE9] font-medium">
                      {deal.financials.grossMargin || 'N/A'}
                    </p>
                    <p className="text-[11px] text-[#94949B] font-light">
                      Blended gross margin after infrastructure/COGS.
                    </p>
                  </div>

                  <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                      Burn Rate &amp; Runway Post-Close
                    </span>
                    <p className="text-xs text-[#EDEDE9] font-mono mt-1">
                      {deal.financials.burnOrRunway || 'Targeting 24+ months runway'}
                    </p>
                  </div>

                  <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                    <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                      Historical Capital Raised
                    </span>
                    <p className="text-xs text-[#EDEDE9] font-mono mt-1">
                      {deal.financials.pastFunding || 'Seed equity and non-dilutive grants'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#94949B] bg-[#111114] rounded-xl border border-[rgba(255,255,255,0.07)]">
                  Financial statements and projections can be requested through your deal manager.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: THE ASK */}
          {activeTab === 'ask' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                  The Ask, Syndicate Allocation &amp; Use of Proceeds
                </h3>
                <p className="text-[11px] text-[#94949B] mt-0.5">
                  Target round terms, Quatromine co-investment access, and planned capital deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#18181C] border border-[rgba(201,162,77,0.3)] rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-[#C9A24D] tracking-wider block font-semibold">
                    Total Round Size
                  </span>
                  <span className="font-serif text-lg text-[#EDEDE9] font-medium block">
                    {deal.ask?.roundSize || deal.ticket}
                  </span>
                  <span className="text-[11px] text-[#94949B]">Target financing tranche</span>
                </div>

                <div className="p-4 bg-[#18181C] border border-[rgba(201,162,77,0.3)] rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-[#C9A24D] tracking-wider block font-semibold">
                    Quatromine Allocation
                  </span>
                  <span className="font-serif text-lg text-[#C9A24D] font-medium block">
                    {deal.ask?.allocationAvailable || 'Exclusive Tranche'}
                  </span>
                  <span className="text-[11px] text-[#94949B]">Reserved for vetted network</span>
                </div>

                <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block font-semibold">
                    Minimum Ticket
                  </span>
                  <span className="font-serif text-lg text-[#EDEDE9] font-medium block">
                    {deal.ask?.minTicket || 'CHF 250k / €250k'}
                  </span>
                  <span className="text-[11px] text-[#94949B]">Qualified / institutional standard</span>
                </div>
              </div>

              {/* Use of Proceeds */}
              <div className="p-5 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl space-y-2">
                <span className="text-[10px] uppercase text-[#C9A24D] tracking-wider font-semibold block">
                  Planned Deployment of Capital
                </span>
                <p className="text-xs sm:text-sm text-[#EDEDE9] font-light leading-relaxed">
                  {deal.ask?.useOfProceeds ||
                    'Proceeds will be deployed across commercial scaling, regulatory compliance certifications, and key personnel additions.'}
                </p>
              </div>

              {/* Target Close */}
              <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block">
                    Syndication Timeline
                  </span>
                  <p className="text-xs text-[#EDEDE9]">
                    Anticipated Round Close: <span className="font-mono text-[#C9A24D] font-medium">{deal.ask?.targetClose || 'Q4 2026'}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onBookCall(deal)}
                  className="px-4 py-2 bg-[#C9A24D] text-[#0B0B0C] font-medium rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer text-xs"
                >
                  Request Allocation Briefing
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECTOR & INDUSTRY FOCUS */}
          {activeTab === 'sector' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                  Sector &amp; Industry Focus
                </h3>
                <p className="text-[11px] text-[#94949B] mt-0.5">
                  Sub-sector positioning, regulatory jurisdiction, and structural tailwinds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-2">
                  <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block font-semibold">
                    Core Sector Classification
                  </span>
                  <p className="text-sm font-serif text-[#EDEDE9]">
                    {deal.sector}
                  </p>
                  <p className="text-xs text-[#94949B] font-light leading-relaxed">
                    Specific Sub-Focus: <span className="text-[#EDEDE9]">{deal.sectorFocus || deal.sector}</span>
                  </p>
                </div>

                <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-2">
                  <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block font-semibold">
                    Industry Verticals &amp; Off-Takers
                  </span>
                  <p className="text-sm font-serif text-[#EDEDE9]">
                    {deal.industryFocus || 'Pan-European Enterprise Clients'}
                  </p>
                  <p className="text-xs text-[#94949B] font-light leading-relaxed">
                    Key Off-Takers: European tier-1 institutional customers, utility grids, and public agencies.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl space-y-2">
                <span className="text-[10px] uppercase text-[#C9A24D] tracking-wider block font-semibold">
                  Jurisdictional Framework
                </span>
                <p className="text-xs text-[#EDEDE9] leading-relaxed font-light">
                  Governed under <span className="text-[#EDEDE9] font-medium">{deal.jurisdiction}</span> commercial law. Structured to fulfill strict institutional criteria (Swiss FINMA or Luxembourg CSSF standards).
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: STAGE & MILESTONES */}
          {activeTab === 'stage' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                  Maturity Stage &amp; De-risking Milestones
                </h3>
                <p className="text-[11px] text-[#94949B] mt-0.5">
                  Technical validation, commercial deployments, and regulatory milestones achieved.
                </p>
              </div>

              <div className="p-4 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider font-semibold">
                    Current Development Phase
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-[rgba(201,162,77,0.12)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)]">
                    {deal.stage}
                  </span>
                </div>
                <p className="text-xs text-[#EDEDE9] leading-relaxed font-light">
                  {deal.stageMilestones ||
                    'Key commercial pilots and technical validation benchmarks completed with audited milestone sign-off.'}
                </p>
              </div>

              {/* Status and Priority (if partner/admin) */}
              {(isPartner || role === 'admin') && (
                <div className="p-4 bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#94A3AE] tracking-wider block">
                      Partner Mandate Priority
                    </span>
                    <span className="text-xs text-[#EDEDE9] font-medium">{deal.priority}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      deal.status === 'Published'
                        ? 'bg-[rgba(201,162,77,0.15)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)]'
                        : 'bg-[rgba(148,163,174,0.15)] text-[#94A3AE] border border-[rgba(148,163,174,0.3)]'
                    }`}
                  >
                    {deal.status}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: DOCUMENTS */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
                    Confidential Due Diligence Files
                  </h3>
                  <p className="text-[11px] text-[#94949B] mt-0.5">
                    Download institutional models, investment memorandums, and technical dossiers.
                  </p>
                </div>
                <span className="text-xs text-[#5F5F65]">
                  {deal.docs?.length || 0} Files Available
                </span>
              </div>

              <div className="space-y-2">
                {deal.docs && deal.docs.length > 0 ? (
                  deal.docs.map((docName, idx) => {
                    const docObj = deal.docFiles?.find((f) => f.name === docName);
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-[#18181C] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)] rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#111114] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#C9A24D] shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-mono text-[#EDEDE9] truncate">
                              {docName}
                            </p>
                            <span className="text-[10px] text-[#5F5F65] block">
                              {docObj?.size || '2.4 MB'} &bull; Verified Institutional Document
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(docName)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#EDEDE9] hover:text-[#C9A24D] bg-[#111114] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(201,162,77,0.3)] rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#94949B]">No documents attached to this opportunity.</p>
                )}
              </div>

              {downloadNote && (
                <div className="p-3 bg-[#111114] border border-[rgba(201,162,77,0.3)] rounded-xl text-xs text-[#C9A24D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Simulated download initiated for <span className="font-mono text-[#EDEDE9]">{downloadNote}</span>.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[rgba(255,255,255,0.08)] bg-[#18181C] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Track / Watchlist Button for Investor */}
            {isInvestor && onToggleTrack && (
              <button
                type="button"
                id="dossier-toggle-track-btn"
                onClick={() => onToggleTrack(deal.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                  isTracked
                    ? 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)]'
                    : 'bg-[#111114] text-[#EDEDE9] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isTracked ? 'fill-[#C9A24D] text-[#C9A24D]' : 'text-[#94949B]'}`} />
                <span>{isTracked ? 'Tracked in Watchlist' : 'Track Opportunity'}</span>
              </button>
            )}

            {/* Request Introduction for Investor */}
            {isInvestor && onRequestIntro && (
              <button
                type="button"
                id="dossier-request-intro-btn"
                onClick={() => onRequestIntro(deal.id)}
                disabled={introRequested}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer bg-[#222227] hover:bg-[#2c2c33] text-[#EDEDE9] border border-[rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>{introRequested ? 'Intro Requested' : 'Request Intro'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs text-[#94949B] hover:text-[#EDEDE9] rounded-xl hover:bg-[#222227] transition-colors cursor-pointer text-center"
            >
              Close Dossier
            </button>

            {/* Book a Call to Know More button */}
            <button
              type="button"
              id="dossier-footer-book-call-btn"
              onClick={() => onBookCall(deal)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer shadow-md shadow-[#C9A24D]/15 text-center whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>Book a Call to Know More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
