import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  Edit3,
  CheckCircle2,
  Trash2,
  Save,
  X,
  Star,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Building,
  RotateCcw,
  Search,
  Filter,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { Deal, ResponsiblePerson, Role } from '../types';
import { dealService } from '../services/dealService';

interface AdminDashboardProps {
  deals: Deal[];
  onDealsUpdated: () => void;
  onPreviewRole: (role: Role) => void;
  onOpenDossier: (deal: Deal) => void;
  onSignOut?: () => void;
  onExitAdmin?: () => void;
}

const DEFAULT_TEAM_MEMBERS: ResponsiblePerson[] = [
  {
    name: 'Sarah Jenkins',
    title: 'Partner, DeepTech & AI Mandates',
    email: 's.jenkins@quatromine.com',
    phone: '+41 22 819 40 22',
  },
  {
    name: 'Marc Vance',
    title: 'Managing Partner, Infrastructure',
    email: 'm.vance@quatromine.com',
    phone: '+352 26 89 11 00',
  },
  {
    name: 'Dr. Alain Mercier',
    title: 'Partner, Life Sciences & MedTech',
    email: 'a.mercier@quatromine.com',
    phone: '+41 22 703 55 12',
  },
  {
    name: 'Elena Rossi',
    title: 'Principal, Energy Transition',
    email: 'e.rossi@quatromine.com',
    phone: '+41 21 644 19 80',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  deals,
  onDealsUpdated,
  onPreviewRole,
  onOpenDossier,
  onSignOut,
  onExitAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'investor' | 'partner' | 'hidden'>('all');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick toggle deal investor visibility
  const handleToggleInvestorVisibility = async (deal: Deal, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: Deal = {
      ...deal,
      visibleToInvestor: !deal.visibleToInvestor,
    };
    await dealService.updateDeal(updated);
    onDealsUpdated();
    showToast(
      `${deal.name} is now ${updated.visibleToInvestor ? 'VISIBLE' : 'HIDDEN'} in Investor Login.`
    );
  };

  // Quick toggle deal partner visibility
  const handleTogglePartnerVisibility = async (deal: Deal, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: Deal = {
      ...deal,
      visibleToPartner: !deal.visibleToPartner,
    };
    await dealService.updateDeal(updated);
    onDealsUpdated();
    showToast(
      `${deal.name} is now ${updated.visibleToPartner ? 'VISIBLE' : 'HIDDEN'} in Partner Login.`
    );
  };

  // Quick toggle featured status
  const handleToggleFeatured = async (deal: Deal, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: Deal = {
      ...deal,
      featuredForInvestor: !deal.featuredForInvestor,
    };
    await dealService.updateDeal(updated);
    onDealsUpdated();
    showToast(
      `${deal.name} ${updated.featuredForInvestor ? 'marked as Featured' : 'unmarked from Featured'}.`
    );
  };

  // Quick change responsible person
  const handleChangeResponsible = async (deal: Deal, memberName: string) => {
    const member = DEFAULT_TEAM_MEMBERS.find((m) => m.name === memberName) || {
      name: memberName,
      title: 'Quatromine Deal Lead',
      email: `${memberName.toLowerCase().replace(/\s+/g, '.')}@quatromine.com`,
    };
    const updated: Deal = {
      ...deal,
      responsiblePerson: member,
    };
    await dealService.updateDeal(updated);
    onDealsUpdated();
    showToast(`Assigned ${member.name} as lead for ${deal.name}.`);
  };

  // Reset to seed
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all deals back to initial default seed data?')) {
      await dealService.resetToDefaultDeals();
      onDealsUpdated();
      showToast('Deal inventory restored to factory defaults.');
    }
  };

  // Filtering
  const filteredDeals = deals.filter((deal) => {
    const matchSearch =
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.responsiblePerson?.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filterVisibility === 'investor') return deal.visibleToInvestor;
    if (filterVisibility === 'partner') return deal.visibleToPartner;
    if (filterVisibility === 'hidden') return !deal.visibleToInvestor && !deal.visibleToPartner;
    return true;
  });

  const totalVisibleInvestor = deals.filter((d) => d.visibleToInvestor).length;
  const totalVisiblePartner = deals.filter((d) => d.visibleToPartner).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1E] border border-[rgba(201,162,77,0.4)] text-[#EDEDE9] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#C9A24D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Banner */}
      <div className="bg-[#151518] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-semibold tracking-widest px-2.5 py-0.5 rounded-full bg-[rgba(201,162,77,0.15)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)] inline-flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Quatromine Team Operations
              </span>
              <span className="text-xs text-[#5F5F65]">Deal Syndication &amp; Distribution Suite</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#EDEDE9] font-normal">
              Admin &amp; Deal Management Console
            </h1>
            <p className="text-xs text-[#94949B] mt-1.5 max-w-2xl font-light">
              Upload new institutional deals with files, control visibility across Investor and Partner portals, and assign responsible deal leads.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="admin-btn-upload-new"
              onClick={() => setIsCreatingNew(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer shadow-md shadow-[#C9A24D]/10"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Deal</span>
            </button>

            <button
              type="button"
              id="admin-btn-reset"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium bg-[#1A1A1E] text-[#94949B] hover:text-[#EDEDE9] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] rounded-xl transition-colors cursor-pointer"
              title="Reset inventory to original default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            {onExitAdmin && (
              <button
                type="button"
                id="admin-btn-exit-view"
                onClick={onExitAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium bg-[#1A1A1E] text-[#94949B] hover:text-[#EDEDE9] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] rounded-xl transition-colors cursor-pointer"
                title="Switch back to client-facing deal view"
              >
                <span>Deal View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onSignOut && (
              <button
                type="button"
                id="admin-btn-sign-out"
                onClick={(e) => {
                  e.preventDefault();
                  onSignOut();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium bg-[#1A1A1E] text-[#EDEDE9] hover:text-[#C9A24D] border border-[rgba(255,255,255,0.12)] hover:border-[#C9A24D]/50 rounded-xl transition-colors cursor-pointer shadow-sm"
                title="Sign out of Quatromine session"
              >
                <LogOut className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span className="font-medium">Sign out</span>
              </button>
            )}
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)] text-xs">
          <div className="p-3 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <span className="text-[10px] uppercase text-[#5F5F65] block">Total Deal Inventory</span>
            <span className="font-serif text-xl text-[#EDEDE9] font-medium mt-0.5 block">{deals.length}</span>
          </div>
          <div className="p-3 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <span className="text-[10px] uppercase text-[#C9A24D] block">Visible to Investors</span>
            <span className="font-serif text-xl text-[#C9A24D] font-medium mt-0.5 block">
              {totalVisibleInvestor} <span className="text-xs text-[#5F5F65]">/ {deals.length}</span>
            </span>
          </div>
          <div className="p-3 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <span className="text-[10px] uppercase text-[#94A3AE] block">Visible to Partners</span>
            <span className="font-serif text-xl text-[#94A3AE] font-medium mt-0.5 block">
              {totalVisiblePartner} <span className="text-xs text-[#5F5F65]">/ {deals.length}</span>
            </span>
          </div>
          <div className="p-3 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <span className="text-[10px] uppercase text-[#5F5F65] block">Quick Preview</span>
            <div className="flex items-center gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => onPreviewRole('investor')}
                className="px-2 py-1 text-[10px] font-medium rounded-lg bg-[rgba(201,162,77,0.15)] text-[#C9A24D] hover:bg-[rgba(201,162,77,0.25)] transition-colors cursor-pointer"
              >
                Investor View
              </button>
              <button
                type="button"
                onClick={() => onPreviewRole('broker')}
                className="px-2 py-1 text-[10px] font-medium rounded-lg bg-[rgba(148,163,174,0.15)] text-[#94A3AE] hover:bg-[rgba(148,163,174,0.25)] transition-colors cursor-pointer"
              >
                Partner View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151518] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5F5F65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="admin-search-deals"
            placeholder="Search deals by name, sector, or responsible lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl pl-9 pr-3 py-2 text-xs text-[#EDEDE9] placeholder-[#5F5F65] outline-none focus:border-[#C9A24D]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] text-[#5F5F65] mr-1 hidden sm:inline">Filter Visibility:</span>
          {(
            [
              { id: 'all', label: 'All Deals' },
              { id: 'investor', label: `Investor Visible (${totalVisibleInvestor})` },
              { id: 'partner', label: `Partner Visible (${totalVisiblePartner})` },
              { id: 'hidden', label: 'Restricted / Hidden' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterVisibility(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterVisibility === tab.id
                  ? 'bg-[#C9A24D] text-[#0B0B0C]'
                  : 'bg-[#111114] text-[#94949B] hover:text-[#EDEDE9] border border-[rgba(255,255,255,0.06)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Management Table / Cards */}
      <div className="bg-[#151518] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#18181C] flex items-center justify-between">
          <h2 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D]">
            Deal Pipeline &amp; Visibility Matrix ({filteredDeals.length})
          </h2>
          <span className="text-[11px] text-[#5F5F65]">
            Click any row to edit deal aspect details or toggle visibility switches directly
          </span>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.06)]">
          {filteredDeals.length > 0 ? (
            filteredDeals.map((deal) => {
              const filesCount = deal.docs?.length || deal.docFiles?.length || 0;
              return (
                <div
                  key={deal.id}
                  className="p-5 hover:bg-[#1A1A1E] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Deal summary & info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-base text-[#EDEDE9] font-medium truncate">
                        {deal.name}
                      </h3>
                      <span className="text-xs text-[#5F5F65]">
                        &bull; {deal.jurisdiction} &bull; {deal.stage}
                      </span>
                      <span className="font-mono text-xs text-[#C9A24D] font-medium">
                        {deal.ticket}
                      </span>

                      {deal.featuredForInvestor && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-[#C9A24D] bg-[rgba(201,162,77,0.12)] px-2 py-0.5 rounded-full border border-[rgba(201,162,77,0.3)]">
                          <Star className="w-3 h-3 fill-[#C9A24D]" /> Featured
                        </span>
                      )}

                      {filesCount > 0 && (
                        <span className="text-[10px] text-[#5F5F65] inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {filesCount} files
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#94949B] line-clamp-1 font-light">
                      {deal.teaser}
                    </p>

                    <div className="text-[11px] text-[#5F5F65] flex items-center gap-3">
                      <span>Sector: <strong className="text-[#94949B] font-normal">{deal.sector}</strong></span>
                      <span>Ask: <strong className="text-[#94949B] font-normal">{deal.ask?.roundSize || deal.ticket}</strong></span>
                    </div>
                  </div>

                  {/* Middle: Responsible Person Dropdown */}
                  <div className="shrink-0 w-full lg:w-64 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#5F5F65] block font-medium">
                      Responsible Deal Lead
                    </span>
                    <select
                      id={`responsible-select-${deal.id}`}
                      value={deal.responsiblePerson?.name || 'Sarah Jenkins'}
                      onChange={(e) => handleChangeResponsible(deal, e.target.value)}
                      className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-2.5 py-1.5 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60 transition-colors"
                    >
                      {DEFAULT_TEAM_MEMBERS.map((member) => (
                        <option key={member.name} value={member.name} className="bg-[#1B1B1F]">
                          {member.name} ({member.title.split(',')[0]})
                        </option>
                      ))}
                    </select>
                    {deal.responsiblePerson?.email && (
                      <span className="text-[10px] text-[#5F5F65] font-mono block truncate">
                        {deal.responsiblePerson.email}
                      </span>
                    )}
                  </div>

                  {/* Right: Visibility Toggles & Edit Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Investor Visibility Toggle */}
                    <button
                      type="button"
                      id={`toggle-investor-${deal.id}`}
                      onClick={(e) => handleToggleInvestorVisibility(deal, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        deal.visibleToInvestor
                          ? 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)]'
                          : 'bg-[#111114] text-[#5F5F65] border border-[rgba(255,255,255,0.06)] hover:text-[#EDEDE9]'
                      }`}
                      title={deal.visibleToInvestor ? 'Visible in Investor Login' : 'Hidden in Investor Login'}
                    >
                      {deal.visibleToInvestor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>Investor</span>
                    </button>

                    {/* Partner Visibility Toggle */}
                    <button
                      type="button"
                      id={`toggle-partner-${deal.id}`}
                      onClick={(e) => handleTogglePartnerVisibility(deal, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        deal.visibleToPartner
                          ? 'bg-[rgba(148,163,174,0.18)] text-[#94A3AE] border border-[rgba(148,163,174,0.4)]'
                          : 'bg-[#111114] text-[#5F5F65] border border-[rgba(255,255,255,0.06)] hover:text-[#EDEDE9]'
                      }`}
                      title={deal.visibleToPartner ? 'Visible in Partner Login' : 'Hidden in Partner Login'}
                    >
                      {deal.visibleToPartner ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>Partner</span>
                    </button>

                    {/* Featured Toggle */}
                    <button
                      type="button"
                      id={`toggle-featured-${deal.id}`}
                      onClick={(e) => handleToggleFeatured(deal, e)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer border ${
                        deal.featuredForInvestor
                          ? 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border-[rgba(201,162,77,0.4)]'
                          : 'bg-[#111114] text-[#5F5F65] border-[rgba(255,255,255,0.06)] hover:text-[#C9A24D]'
                      }`}
                      title="Toggle Featured on Investor Home"
                    >
                      <Star className={`w-3.5 h-3.5 ${deal.featuredForInvestor ? 'fill-[#C9A24D]' : ''}`} />
                    </button>

                    {/* Edit Deal Modal Trigger */}
                    <button
                      type="button"
                      id={`edit-deal-${deal.id}`}
                      onClick={() => setEditingDeal(deal)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#EDEDE9] bg-[#222227] hover:bg-[#2c2c33] border border-[rgba(255,255,255,0.1)] rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#C9A24D]" />
                      <span>Edit Aspects</span>
                    </button>

                    {/* View Dossier Trigger */}
                    <button
                      type="button"
                      id={`view-dossier-${deal.id}`}
                      onClick={() => onOpenDossier(deal)}
                      className="p-1.5 text-[#94949B] hover:text-[#EDEDE9] rounded-xl hover:bg-[#222227] transition-colors cursor-pointer"
                      title="Preview Deal Dossier Popup"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#94949B]">
              No deals found matching the current search query or filter.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE NEW DEAL OR EDIT DEAL */}
      {(isCreatingNew || editingDeal) && (
        <DealEditorModal
          deal={editingDeal}
          isOpen={true}
          onClose={() => {
            setIsCreatingNew(false);
            setEditingDeal(null);
          }}
          onSave={async (savedDeal) => {
            if (editingDeal) {
              await dealService.updateDeal(savedDeal);
              showToast(`Deal "${savedDeal.name}" updated successfully.`);
            } else {
              await dealService.createDeal(savedDeal);
              showToast(`New deal "${savedDeal.name}" uploaded successfully.`);
            }
            setIsCreatingNew(false);
            setEditingDeal(null);
            onDealsUpdated();
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// DEAL EDITOR / UPLOADER MODAL
// ============================================================================
interface DealEditorModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
}

const DealEditorModal: React.FC<DealEditorModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEdit = Boolean(deal);

  // Core fields
  const [name, setName] = useState(deal?.name || '');
  const [jurisdiction, setJurisdiction] = useState(deal?.jurisdiction || 'Switzerland');
  const [sector, setSector] = useState(deal?.sector || 'Digital Infrastructure & AI');
  const [opportunityType, setOpportunityType] = useState(deal?.opportunityType || 'Early Stage / VC');
  const [investmentType, setInvestmentType] = useState(deal?.investmentType || 'Growth Equity');
  const [stage, setStage] = useState(deal?.stage || 'Series A');
  const [ticket, setTicket] = useState(deal?.ticket || 'CHF 5.0M');
  const [priority, setPriority] = useState(deal?.priority || 'Tier 1 — High Priority');
  const [status, setStatus] = useState<'Published' | 'In Review'>(deal?.status || 'Published');
  const [teaser, setTeaser] = useState(deal?.teaser || '');
  const [summary, setSummary] = useState(deal?.summary || '');

  // Visibility flags
  const [visibleToInvestor, setVisibleToInvestor] = useState(deal ? Boolean(deal.visibleToInvestor) : true);
  const [visibleToPartner, setVisibleToPartner] = useState(deal ? Boolean(deal.visibleToPartner) : true);
  const [featuredForInvestor, setFeaturedForInvestor] = useState(deal ? Boolean(deal.featuredForInvestor) : false);

  // Responsible person
  const [responsibleName, setResponsibleName] = useState(deal?.responsiblePerson?.name || 'Sarah Jenkins');
  const [responsibleTitle, setResponsibleTitle] = useState(deal?.responsiblePerson?.title || 'Partner, DeepTech & AI Mandates');
  const [responsibleEmail, setResponsibleEmail] = useState(deal?.responsiblePerson?.email || 's.jenkins@quatromine.com');

  // Sector and Industry Focus
  const [sectorFocus, setSectorFocus] = useState(deal?.sectorFocus || '');
  const [industryFocus, setIndustryFocus] = useState(deal?.industryFocus || '');
  const [targetMarket, setTargetMarket] = useState(deal?.targetMarket || '');
  const [stageMilestones, setStageMilestones] = useState(deal?.stageMilestones || '');

  // Financials
  const [valuation, setValuation] = useState(deal?.financials?.valuation || 'CHF 25.0M Pre-Money');
  const [arrOrRevenue, setArrOrRevenue] = useState(deal?.financials?.arrOrRevenue || 'CHF 1.8M ARR');
  const [growthRate, setGrowthRate] = useState(deal?.financials?.growthRate || '+140% YoY');
  const [burnOrRunway, setBurnOrRunway] = useState(deal?.financials?.burnOrRunway || '24 months runway post-close');
  const [pastFunding, setPastFunding] = useState(deal?.financials?.pastFunding || 'CHF 2.5M Seed');
  const [grossMargin, setGrossMargin] = useState(deal?.financials?.grossMargin || '80% Gross Margin');

  // The Ask
  const [roundSize, setRoundSize] = useState(deal?.ask?.roundSize || ticket);
  const [allocationAvailable, setAllocationAvailable] = useState(deal?.ask?.allocationAvailable || 'CHF 1.5M Quatromine Allocation');
  const [minTicket, setMinTicket] = useState(deal?.ask?.minTicket || 'CHF 250k');
  const [useOfProceeds, setUseOfProceeds] = useState(deal?.ask?.useOfProceeds || 'Commercial scaling and engineering expansion.');
  const [targetClose, setTargetClose] = useState(deal?.ask?.targetClose || 'Q4 2026');

  // Files
  const [files, setFiles] = useState<{ name: string; size: string; type: string }[]>(
    deal?.docFiles || [
      { name: `${name.replace(/\s+/g, '_') || 'Opportunity'}_Investment_Teaser.pdf`, size: '2.4 MB', type: 'PDF' },
      { name: `${name.replace(/\s+/g, '_') || 'Opportunity'}_Financial_Model.xlsx`, size: '1.8 MB', type: 'XLSX' },
    ]
  );
  const [newFileName, setNewFileName] = useState('');

  // Team
  const [teamMembers, setTeamMembers] = useState(
    deal?.team || [
      {
        name: 'Dr. Lucas Bärtsch',
        role: 'Chief Executive Officer',
        bio: 'PhD from ETH Zurich; 12 years in institutional engineering.',
        previousExperience: 'Former technical architect at IBM Research.',
      },
    ]
  );

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const cleanName = newFileName.trim().endsWith('.pdf') || newFileName.trim().endsWith('.xlsx')
      ? newFileName.trim()
      : `${newFileName.trim()}.pdf`;
    setFiles([...files, { name: cleanName, size: '2.5 MB', type: cleanName.endsWith('.xlsx') ? 'XLSX' : 'PDF' }]);
    setNewFileName('');
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploaded = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      }));
      setFiles([...files, ...uploaded]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedDeal: Deal = {
      id: deal?.id || `deal-${Date.now()}`,
      name: name.trim(),
      jurisdiction: jurisdiction as any,
      sector: sector as any,
      opportunityType: opportunityType as any,
      investmentType: (investmentType || 'Growth Equity') as any,
      stage: stage.trim(),
      ticket: ticket.trim(),
      priority: priority as any,
      status,
      visibleToInvestor,
      visibleToPartner,
      featuredForInvestor,
      teaser: teaser.trim() || 'Institutional high-conviction opportunity vetted by Quatromine committee.',
      summary: summary.trim() || teaser.trim(),
      sectorFocus: sectorFocus.trim() || sector,
      industryFocus: industryFocus.trim() || 'European enterprise and institutional clients',
      targetMarket: targetMarket.trim() || 'Tier-1 European commercial institutions',
      stageMilestones: stageMilestones.trim() || 'Commercial pilot validated and regulatory sign-off achieved.',
      responsiblePerson: {
        name: responsibleName,
        title: responsibleTitle,
        email: responsibleEmail,
      },
      financials: {
        valuation,
        arrOrRevenue,
        growthRate,
        burnOrRunway,
        pastFunding,
        grossMargin,
      },
      ask: {
        roundSize,
        allocationAvailable,
        minTicket,
        useOfProceeds,
        targetClose,
      },
      team: teamMembers,
      docs: files.map((f) => f.name),
      docFiles: files,
    };

    onSave(savedDeal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#0B0B0C]/85 transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#151518] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl shadow-black/90 overflow-hidden z-10 my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] bg-[#18181C] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-widest px-2.5 py-0.5 rounded-full bg-[rgba(201,162,77,0.15)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)]">
              {isEdit ? 'Edit Opportunity' : 'Upload New Opportunity'}
            </span>
            <h2 className="font-serif text-2xl text-[#EDEDE9] font-normal mt-1">
              {isEdit ? `Edit Deal: ${deal?.name}` : 'Upload New Deal to Quatromine Pipeline'}
            </h2>
            <p className="text-xs text-[#94949B] font-light mt-0.5">
              Configure visibility for Investor and Partner logins, assign deal leads, team bios, financials, and files.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#94949B] hover:text-[#EDEDE9] p-2 rounded-xl hover:bg-[#222227] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* SECTION 1: VISIBILITY & LEAD CONTROLS (CRITICAL) */}
          <div className="p-5 bg-[#18181C] border border-[rgba(201,162,77,0.25)] rounded-xl space-y-4">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              1. Distribution &amp; Visibility Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Investor Visibility Switch */}
              <label className="flex items-start gap-3 p-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl cursor-pointer hover:border-[#C9A24D]/50 transition-colors">
                <input
                  type="checkbox"
                  id="admin-edit-visible-investor"
                  checked={visibleToInvestor}
                  onChange={(e) => setVisibleToInvestor(e.target.checked)}
                  className="mt-0.5 rounded accent-[#C9A24D]"
                />
                <div>
                  <span className="font-medium text-[#EDEDE9] block">Visible to Investors</span>
                  <span className="text-[11px] text-[#94949B] font-light">
                    Appears in the Investor Vetted Deal Room.
                  </span>
                </div>
              </label>

              {/* Partner Visibility Switch */}
              <label className="flex items-start gap-3 p-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl cursor-pointer hover:border-[#94A3AE]/50 transition-colors">
                <input
                  type="checkbox"
                  id="admin-edit-visible-partner"
                  checked={visibleToPartner}
                  onChange={(e) => setVisibleToPartner(e.target.checked)}
                  className="mt-0.5 rounded accent-[#94A3AE]"
                />
                <div>
                  <span className="font-medium text-[#EDEDE9] block">Visible to Partners</span>
                  <span className="text-[11px] text-[#94949B] font-light">
                    Appears in Partner Deal Dashboard.
                  </span>
                </div>
              </label>

              {/* Featured Switch */}
              <label className="flex items-start gap-3 p-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl cursor-pointer hover:border-[#C9A24D]/50 transition-colors">
                <input
                  type="checkbox"
                  id="admin-edit-featured"
                  checked={featuredForInvestor}
                  onChange={(e) => setFeaturedForInvestor(e.target.checked)}
                  className="mt-0.5 rounded accent-[#C9A24D]"
                />
                <div>
                  <span className="font-medium text-[#EDEDE9] block">Featured Deal</span>
                  <span className="text-[11px] text-[#94949B] font-light">
                    Pinned highlight banner for investors.
                  </span>
                </div>
              </label>
            </div>

            {/* Deal Status Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Syndication Status
                </label>
                <select
                  id="admin-edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                >
                  <option value="Published">Published (Live in Market)</option>
                  <option value="In Review">In Review (Internal Due Diligence)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Responsible Quatromine Lead
                </label>
                <select
                  id="admin-edit-responsible"
                  value={responsibleName}
                  onChange={(e) => {
                    const found = DEFAULT_TEAM_MEMBERS.find((m) => m.name === e.target.value);
                    if (found) {
                      setResponsibleName(found.name);
                      setResponsibleTitle(found.title);
                      setResponsibleEmail(found.email);
                    } else {
                      setResponsibleName(e.target.value);
                    }
                  }}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                >
                  {DEFAULT_TEAM_MEMBERS.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} — {m.title.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: CORE DETAILS & CLASSIFICATION */}
          <div className="p-5 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-4">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-[#EDEDE9]">
              2. Opportunity Metadata &amp; Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Company / Deal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zurich Quantum Photonics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Jurisdiction
                </label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                >
                  <option value="Switzerland">Switzerland</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Primary Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                >
                  <option value="Digital Infrastructure & AI">Digital Infrastructure & AI</option>
                  <option value="Sustainability & Transition">Sustainability & Transition</option>
                  <option value="Healthcare Technology">Healthcare Technology</option>
                  <option value="Industrial DeepTech">Industrial DeepTech</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Stage
                </label>
                <input
                  type="text"
                  placeholder="e.g. Series A, Series B, Expansion Stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Round Size / Target Ticket
                </label>
                <input
                  type="text"
                  placeholder="e.g. CHF 12.0M or €45.0M"
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Mandate Opportunity Type
                </label>
                <select
                  value={opportunityType}
                  onChange={(e) => setOpportunityType(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                >
                  <option value="Early Stage / VC">Early Stage / VC</option>
                  <option value="Growth / SME">Growth / SME</option>
                  <option value="Real Assets / Infrastructure">Real Assets / Infrastructure</option>
                  <option value="Emerging Managers">Emerging Managers</option>
                  <option value="Large / Institutional">Large / Institutional</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Investment Type / Structure
                </label>
                <select
                  value={investmentType}
                  onChange={(e) => setInvestmentType(e.target.value as any)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                >
                  <option value="Acquisition">Acquisition (M&amp;A / Buyout)</option>
                  <option value="Venture Capital">Venture Capital (Early Stage)</option>
                  <option value="Growth Equity">Growth Equity (Scaling)</option>
                  <option value="Real Asset / Project">Real Asset / Project Infrastructure</option>
                  <option value="Structured / Mezzanine Debt">Structured / Mezzanine Debt</option>
                  <option value="Fund Commitment">Fund Commitment (Emerging Managers)</option>
                </select>
              </div>
            </div>

            {/* Teaser & Summary */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Single-Sentence Teaser (Card Headline)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Proprietary photonic quantum accelerators for encrypted financial communication..."
                  value={teaser}
                  onChange={(e) => setTeaser(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1">
                  Investment Summary &amp; Thesis
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed investment summary presented in the dossier pop-up..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60 resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ASPECTS — TEAM, FINANCIALS & THE ASK */}
          <div className="p-5 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-4">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-[#EDEDE9]">
              3. Aspects: Financials, The Ask &amp; Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">Valuation</label>
                <input
                  type="text"
                  value={valuation}
                  onChange={(e) => setValuation(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">ARR / Revenue</label>
                <input
                  type="text"
                  value={arrOrRevenue}
                  onChange={(e) => setArrOrRevenue(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">Growth Rate</label>
                <input
                  type="text"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">Round Size Ask</label>
                <input
                  type="text"
                  value={roundSize}
                  onChange={(e) => setRoundSize(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">Quatromine Allocation</label>
                <input
                  type="text"
                  value={allocationAvailable}
                  onChange={(e) => setAllocationAvailable(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">Target Close</label>
                <input
                  type="text"
                  value={targetClose}
                  onChange={(e) => setTargetClose(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[#5F5F65] uppercase mb-1">Use of Proceeds</label>
              <input
                type="text"
                value={useOfProceeds}
                onChange={(e) => setUseOfProceeds(e.target.value)}
                placeholder="e.g. 60% engineering scaling, 25% commercial expansion..."
                className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
              />
            </div>
          </div>

          {/* SECTION 4: FILE UPLOAD (CRITICAL REQUIREMENT) */}
          <div className="p-5 bg-[#18181C] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-[#C9A24D] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                4. Upload Deal Documents &amp; Files
              </h3>
              <span className="text-[11px] text-[#5F5F65]">
                {files.length} attached files
              </span>
            </div>

            {/* Drag & drop upload area */}
            <div className="p-6 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[#C9A24D]/60 rounded-xl text-center bg-[#111114] transition-colors relative">
              <input
                type="file"
                multiple
                onChange={handleFileUploadSim}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-[#C9A24D] mx-auto mb-2" />
              <p className="text-xs text-[#EDEDE9] font-medium">
                Click to browse files or drag and drop investment decks, financials, and whitepapers
              </p>
              <p className="text-[10px] text-[#5F5F65] mt-1">
                Supports PDF, XLSX, DOCX, CSV up to 100MB per file
              </p>
            </div>

            {/* Quick manual file add */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or type file name, e.g. Technical_Validation_ETH.pdf"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="flex-1 bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9]"
              />
              <button
                type="button"
                onClick={handleAddFile}
                className="px-3.5 py-2 bg-[#222227] hover:bg-[#2b2b33] text-[#EDEDE9] text-xs font-medium rounded-xl border border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                Add File
              </button>
            </div>

            {/* Attached file list */}
            {files.length > 0 && (
              <div className="space-y-2 pt-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-[#C9A24D] shrink-0" />
                      <span className="font-mono text-[#EDEDE9] truncate">{file.name}</span>
                      <span className="text-[10px] text-[#5F5F65] shrink-0">({file.size})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-[#94949B] hover:text-red-400 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#94949B] hover:text-[#EDEDE9] rounded-xl hover:bg-[#222227] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="admin-btn-save-deal"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer shadow-md shadow-[#C9A24D]/15"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEdit ? 'Save Deal Updates' : 'Publish New Deal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
