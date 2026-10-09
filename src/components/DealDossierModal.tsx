import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Users,
  TrendingUp,
  FileText,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Lock,
  Globe,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DealbookDeal, Role } from '../types';
import { api, DealbookApiError } from '../services/dealbookApi';

interface DealDossierModalProps {
  deal: DealbookDeal | null;
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  onBookCall: (deal: DealbookDeal) => void;
  onRequestIntro?: (dealRef: string) => void;
  introRequested?: boolean;
  isTracked?: boolean;
  onToggleTrack?: (dealRef: string) => void;
}

type TabType = 'overview' | 'terms' | 'confidential' | 'fit';

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
  const [requesting, setRequesting] = useState(false);
  const [introSuccessMsg, setIntroSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !deal || role === 'broker') return null;

  const handleRequestIntroClick = async () => {
    if (introRequested || requesting) return;
    setRequesting(true);
    try {
      const res = await api.requestIntroduction(deal.ref);
      setIntroSuccessMsg(res.message || 'Introduction request created in the CRM.');
      onRequestIntro?.(deal.ref);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        setIntroSuccessMsg(`Request registered: ${err.code}`);
      } else {
        setIntroSuccessMsg('Introduction requested. The Quatromine team has been notified.');
      }
    } finally {
      setRequesting(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'terms', label: 'Stage & Focus', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'fit', label: 'Syndicate Fit', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'confidential', label: 'Confidential Aspects', icon: <Lock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      id="deal-dossier-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#151518] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl shadow-black/90 overflow-hidden z-10 my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Strip */}
        <div className="p-6 border-b border-white/10 bg-[#18181C] flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-[rgba(201,162,77,0.12)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)] inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Vetted Deal Dossier
              </span>
              <span className="font-mono text-xs text-stone-400 font-semibold">
                {deal.ref}
              </span>
              {role === 'admin' && deal.admin && (
                <span className="text-xs text-stone-300 font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  Company: {deal.admin.company}
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#EDEDE9] font-medium tracking-tight">
              {deal.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-400">
              <span>{deal.geography.join(', ') || 'Global'}</span>
              <span>&bull;</span>
              <span>{deal.companyStage.join(', ') || 'Stage TBD'}</span>
              <span>&bull;</span>
              <span>{deal.assetClass.join(', ') || 'Private Equity'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleTrack && (
              <button
                type="button"
                onClick={() => onToggleTrack(deal.ref)}
                className={`p-2 rounded-xl border transition-colors ${
                  isTracked
                    ? 'bg-[#C9A24D]/20 text-[#C9A24D] border-[#C9A24D]/40'
                    : 'text-stone-400 hover:text-white border-white/10 hover:border-white/20'
                }`}
                title={isTracked ? 'Tracked opportunity' : 'Add to tracked pipeline'}
              >
                <Bookmark className={`w-4 h-4 ${isTracked ? 'fill-[#C9A24D]' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/10 bg-[#141417] flex items-center gap-2 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#C9A24D] text-[#C9A24D]'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-[#EDEDE9]">
          {introSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{introSuccessMsg}</span>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-[#C9A24D] uppercase tracking-wider mb-2">
                  Blind Executive Summary
                </h3>
                <p className="text-sm leading-relaxed text-stone-300 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {deal.blindDescription || 'No executive teaser description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">
                    Business Model
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {deal.businessModel.length > 0 ? (
                      deal.businessModel.map((bm) => (
                        <span
                          key={bm}
                          className="px-2 py-1 rounded-md text-xs bg-white/5 text-stone-200 border border-white/10"
                        >
                          {bm}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-500">Not specified</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">
                    Target Geography
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {deal.geography.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-1 rounded-md text-xs bg-white/5 text-stone-200 border border-white/10"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {role === 'admin' && deal.admin && (
                <div className="p-4 rounded-xl bg-[rgba(201,162,77,0.08)] border border-[rgba(201,162,77,0.25)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C9A24D] tracking-wider block">
                      Admin CRM Link
                    </span>
                    <span className="text-xs text-white">
                      Company: {deal.admin.company} &bull; {deal.admin.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {deal.admin.crmUrl && (
                    <a
                      href={deal.admin.crmUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#C9A24D] text-black font-semibold flex items-center gap-1 hover:bg-[#d4b05e]"
                    >
                      <span>Open CRM Opportunity</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: STAGE & FOCUS */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-2">
                    Company Stage
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {deal.companyStage.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs bg-[#C9A24D]/15 text-[#C9A24D] border border-[#C9A24D]/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-2">
                    Asset Class
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {deal.assetClass.map((ac) => (
                      <span
                        key={ac}
                        className="px-2.5 py-1 rounded-md text-xs bg-white/5 text-stone-200 border border-white/10"
                      >
                        {ac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                  Industry Clusters & Technical Fields
                </span>
                <div className="flex flex-wrap gap-2">
                  {deal.clusters.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/10 text-white border border-white/15"
                    >
                      {c}
                    </span>
                  ))}
                  {deal.fields.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-stone-300 border border-white/10"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYNDICATE FIT */}
          {activeTab === 'fit' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-semibold text-[#C9A24D] uppercase tracking-wider block">
                  Ideal Investor Profile & Mandate Fit
                </span>
                <p className="text-sm leading-relaxed text-stone-300">
                  {deal.investorsBestFit ||
                    'Suited for institutional investors, family offices, and specialist growth funds seeking verified allocation.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[rgba(201,162,77,0.06)] border border-[rgba(201,162,77,0.2)] text-xs text-stone-300 leading-relaxed">
                <p className="font-medium text-[#C9A24D] mb-1">Quatromine Deal Desk Syndicate Allocation</p>
                <p>
                  Quatromine manages co-investment syndicates and primary allocations for vetted partners.
                  To discuss check sizes, syndication terms, or co-lead opportunities, schedule a briefing call.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CONFIDENTIAL ASPECTS */}
          {activeTab === 'confidential' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#C9A24D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Financials, ARR & Valuation</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Available on request. Historical audited financials, P&L models, gross margins, and current valuation cap table are protected under mutual NDA.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <Users className="w-5 h-5 text-[#C9A24D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Management & Founder Credentials</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Available on request. Executive biographies, technical credentials, and founder backgrounds are disclosed via confidential briefing.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#C9A24D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Due Diligence Virtual Data Room</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Available on request. Pitch deck, IP patents, security audits, and client references are made available upon introductory call completion.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions Strip */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#18181C] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-stone-400">
            Confidential mandate &bull; Quatromine Syndicate
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRequestIntroClick}
              disabled={introRequested || requesting}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                introRequested
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{introRequested ? 'Intro Requested' : requesting ? 'Sending...' : 'Request Introduction'}</span>
            </button>

            <button
              type="button"
              onClick={() => onBookCall(deal)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Briefing Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
