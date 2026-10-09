import React, { useState } from 'react';
import {
  ChevronDown,
  FileText,
  CheckCircle2,
  Bookmark,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Users,
  Lock,
  Globe,
  Layers,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { DealbookDeal, Role } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DealRowProps {
  deal: DealbookDeal;
  role: Role;
  isExpanded: boolean;
  onToggle: () => void;
  onRequestIntro?: (dealRef: string) => Promise<void> | void;
  introRequested?: boolean;
  isTracked?: boolean;
  onToggleTrack?: (dealRef: string) => void;
  onOpenDossier?: (deal: DealbookDeal) => void;
  onBookCall?: (deal: DealbookDeal) => void;
}

export const DealRow: React.FC<DealRowProps> = ({
  deal,
  role,
  isExpanded,
  onToggle,
  onRequestIntro,
  introRequested = false,
  isTracked = false,
  onToggleTrack,
  onOpenDossier,
  onBookCall,
}) => {
  const { isLight } = useTheme();
  const [requesting, setRequesting] = useState(false);

  // Compute 2-letter monogram
  const getInitials = (text: string): string => {
    const parts = text
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return 'QM';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(deal.ref || deal.title);

  const handleIntroClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (introRequested || requesting) return;
    setRequesting(true);
    if (onRequestIntro) {
      await onRequestIntro(deal.ref);
    }
    setRequesting(false);
  };

  const handleBookCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookCall?.(deal);
  };

  const handleOpenDossierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role === 'broker') return;
    onOpenDossier?.(deal);
  };

  const isInvestor = role === 'investor';
  const isAdmin = role === 'admin';
  const isBroker = role === 'broker';

  return (
    <div
      id={`deal-row-${deal.ref}`}
      className={`transition-all duration-200 overflow-hidden ${
        isInvestor ? 'rounded-2xl' : 'rounded-xl'
      } ${
        isLight
          ? 'bg-[#FFFFFF] border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
          : 'bg-[#141417] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(201,162,77,0.35)] shadow-md shadow-black/40'
      }`}
    >
      {/* Primary Deal Row Header / Accordion trigger */}
      <div
        onClick={onToggle}
        className={`px-5 py-4.5 sm:px-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isLight
            ? isExpanded
              ? 'bg-slate-50/80 border-b border-slate-200'
              : 'hover:bg-slate-50/50'
            : isExpanded
            ? 'bg-[#18181C] border-b border-white/5'
            : 'hover:bg-[#18181C]/70'
        }`}
      >
        {/* Left: Monogram & Identity */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-serif text-xs font-semibold tracking-wider transition-all border ${
              isLight
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-[rgba(201,162,77,0.12)] text-[#C9A24D] border-[rgba(201,162,77,0.3)]'
            }`}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#C9A24D]">
                {deal.ref}
              </span>

              {isAdmin && deal.admin && (
                <span className="text-[11px] font-medium text-stone-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {deal.admin.company}
                </span>
              )}

              {isAdmin && deal.admin?.published !== undefined && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    deal.admin.published
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-stone-500/20 text-stone-400 border border-stone-500/30'
                  }`}
                >
                  {deal.admin.published ? 'Published' : 'Draft'}
                </span>
              )}
            </div>

            <h3
              className={`font-serif text-sm sm:text-base font-normal tracking-tight line-clamp-1 mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
              }`}
            >
              {deal.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-400">
              <span>{deal.geography.join(', ') || 'Global'}</span>
              <span>&bull;</span>
              <span>{deal.companyStage.join(', ') || 'Growth'}</span>
              <span>&bull;</span>
              <span>{deal.assetClass.join(', ') || 'Equity'}</span>
            </div>
          </div>
        </div>

        {/* Center / Right tags */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap max-w-sm justify-end">
            {deal.clusters.slice(0, 2).map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-stone-300 border border-white/10 truncate max-w-[140px]"
              >
                {c}
              </span>
            ))}
            {deal.businessModel.slice(0, 1).map((bm) => (
              <span
                key={bm}
                className="px-2 py-0.5 rounded-md text-[10px] bg-[rgba(201,162,77,0.08)] text-[#C9A24D] border border-[rgba(201,162,77,0.25)]"
              >
                {bm}
              </span>
            ))}
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1.5 ml-auto md:ml-0" onClick={(e) => e.stopPropagation()}>
            {/* Track bookmark */}
            {onToggleTrack && (
              <button
                type="button"
                onClick={() => onToggleTrack(deal.ref)}
                className={`p-2 rounded-xl border transition-colors ${
                  isTracked
                    ? 'bg-[#C9A24D]/20 text-[#C9A24D] border-[#C9A24D]/40'
                    : 'text-stone-400 hover:text-white border-white/10 hover:border-white/20'
                }`}
                title={isTracked ? 'Untrack deal' : 'Track deal'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isTracked ? 'fill-[#C9A24D]' : ''}`} />
              </button>
            )}

            {/* Book call button */}
            {onBookCall && (
              <button
                type="button"
                onClick={handleBookCallClick}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[rgba(201,162,77,0.12)] hover:bg-[rgba(201,162,77,0.22)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)] transition-colors flex items-center gap-1"
                title="Schedule briefing call"
              >
                <PhoneCall className="w-3 h-3" />
                <span className="hidden sm:inline">Book Call</span>
              </button>
            )}

            {/* View dossier (investor & admin only) */}
            {!isBroker && onOpenDossier && (
              <button
                type="button"
                onClick={handleOpenDossierClick}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors hidden sm:flex items-center gap-1"
                title="View full dossier"
              >
                <FileText className="w-3 h-3" />
                <span>Dossier</span>
              </button>
            )}

            {/* Open in CRM (admin only) */}
            {isAdmin && deal.admin?.crmUrl && (
              <a
                href={deal.admin.crmUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-[#C9A24D] hover:bg-[#C9A24D]/10 border border-[rgba(201,162,77,0.3)] transition-colors inline-flex items-center"
                title="Open in CRM"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Chevron toggle */}
            <div
              className={`p-2 text-stone-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-white' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6 text-xs text-[#EDEDE9] animate-in fade-in duration-150">
          {/* Executive Overview */}
          <div>
            <span className="text-[11px] font-semibold text-[#C9A24D] uppercase tracking-wider block mb-1.5">
              Blind Executive Summary
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-300 bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {deal.blindDescription || 'Executive summary protected under blind profile.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                Company Stage & Asset Class
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {deal.companyStage.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-[11px] bg-[#C9A24D]/15 text-[#C9A24D] border border-[#C9A24D]/30"
                  >
                    {s}
                  </span>
                ))}
                {deal.assetClass.map((ac) => (
                  <span
                    key={ac}
                    className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-stone-300 border border-white/10"
                  >
                    {ac}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                Clusters & Fields
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[...deal.clusters, ...deal.fields].slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-stone-300 border border-white/10"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                Business Model & Geography
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {deal.businessModel.map((bm) => (
                  <span
                    key={bm}
                    className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-stone-300 border border-white/10"
                  >
                    {bm}
                  </span>
                ))}
                {deal.geography.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-stone-300 border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Investor Best Fit */}
          {deal.investorsBestFit && (
            <div className="p-4 rounded-xl bg-[rgba(201,162,77,0.06)] border border-[rgba(201,162,77,0.2)]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24D] block mb-1">
                Syndicate & Investor Best Fit
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {deal.investorsBestFit}
              </p>
            </div>
          )}

          {/* Confidential Terms & Aspects (On Request) */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-400">
                <Lock className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span className="text-xs font-medium text-stone-300">
                  Protected Deal Aspects (Financials, Data Room & Management Team)
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Available on request
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Financial statements, cap tables, valuation terms, and complete virtual data room access are available to verified parties upon mutual NDA and introduction request.
            </p>
          </div>

          {/* Footer Actions inside row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
            <span className="text-[11px] text-stone-500">
              Ref: <span className="font-mono text-stone-400">{deal.ref}</span>
            </span>

            <div className="flex items-center gap-2">
              {/* Partner View: No dossier, focus on scheduling call */}
              {isBroker ? (
                <button
                  type="button"
                  onClick={handleBookCallClick}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book Mandate Briefing Call</span>
                </button>
              ) : (
                <>
                  {onRequestIntro && (
                    <button
                      type="button"
                      onClick={handleIntroClick}
                      disabled={introRequested || requesting}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        introRequested
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {introRequested ? 'Intro Requested' : requesting ? 'Sending...' : 'Request Introduction'}
                      </span>
                    </button>
                  )}

                  {onOpenDossier && (
                    <button
                      type="button"
                      onClick={handleOpenDossierClick}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Dossier</span>
                    </button>
                  )}

                  {onBookCall && (
                    <button
                      type="button"
                      onClick={handleBookCallClick}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Book Call</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
