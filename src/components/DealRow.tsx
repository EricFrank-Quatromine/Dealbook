import React, { useState } from 'react';
import {
  ChevronDown,
  FileText,
  CheckCircle2,
  Lock,
  Bookmark,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Users,
} from 'lucide-react';
import { Deal, Role } from '../types';

interface DealRowProps {
  deal: Deal;
  role: Role;
  isExpanded: boolean;
  onToggle: () => void;
  onRequestIntro?: (dealId: string) => Promise<void> | void;
  introRequested?: boolean;
  isTracked?: boolean;
  onToggleTrack?: (dealId: string) => void;
  onOpenDossier?: (deal: Deal) => void;
  onBookCall?: (deal: Deal) => void;
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
  const [requesting, setRequesting] = useState(false);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  // Compute 2-letter monogram
  const getInitials = (title: string): string => {
    const parts = title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return 'QM';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(deal.name);

  const handleIntroClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (introRequested || requesting) return;
    setRequesting(true);
    if (onRequestIntro) {
      await onRequestIntro(deal.id);
    }
    setRequesting(false);
  };

  const handleBookCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookCall?.(deal);
  };

  const handleOpenDossierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDossier?.(deal);
  };

  const handleDocClick = (e: React.MouseEvent, docName: string) => {
    e.stopPropagation();
    setDownloadNote(docName);
    setTimeout(() => {
      setDownloadNote(null);
    }, 2400);
  };

  const isInvestor = role === 'investor';
  const isFeatured = isInvestor && deal.featuredForInvestor;

  return (
    <div
      id={`deal-row-${deal.id}`}
      className={`transition-all duration-200 overflow-hidden ${
        isInvestor ? 'rounded-2xl' : 'rounded-xl'
      } ${
        isFeatured
          ? 'bg-[#18181C] border border-[rgba(201,162,77,0.32)] hover:border-[rgba(201,162,77,0.55)] shadow-lg shadow-black/40'
          : 'bg-[#151518] border border-[rgba(255,255,255,0.09)] hover:border-[rgba(255,255,255,0.2)] shadow-md shadow-black/30'
      }`}
    >
      {/* Collapsed Header / Clickable Target */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isExpanded}
        className="w-full text-left p-4 sm:p-5 focus:outline-none cursor-pointer select-none"
      >
        {/* Desktop Layout (>820px) */}
        <div
          className={`hidden min-[821px]:grid ${
            isInvestor
              ? 'grid-cols-[44px_1.4fr_1fr_0.8fr_0.8fr_auto_22px]'
              : 'grid-cols-[44px_1.5fr_1fr_0.9fr_0.8fr_auto_22px]'
          } gap-3 sm:gap-4 items-center`}
        >
          {/* Monogram */}
          <div
            onClick={handleOpenDossierClick}
            title="Click to view full Deal Dossier popup"
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-serif text-[15px] font-medium shrink-0 transition-all hover:scale-105 ${
              isFeatured
                ? 'border border-[rgba(201,162,77,0.4)] bg-[rgba(201,162,77,0.1)] text-[#C9A24D]'
                : 'border border-[rgba(255,255,255,0.14)] bg-[#101013] text-[#EDEDE9]'
            }`}
          >
            {initials}
          </div>

          {/* Name & Teaser */}
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <h3
                onClick={handleOpenDossierClick}
                className="font-serif text-[16.5px] font-normal text-[#EDEDE9] truncate leading-snug hover:text-[#C9A24D] transition-colors"
                title="View Full Deal Dossier"
              >
                {deal.name}
              </h3>
              {isFeatured && (
                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] text-[#C9A24D] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.3)]">
                  <Sparkles className="w-2.5 h-2.5" /> Featured
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#94949B] truncate leading-normal mt-0.5 font-light">
              {deal.teaser}
            </p>
          </div>

          {/* Badges: Jurisdiction + Sector */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span
              className={`inline-block px-2.5 py-0.5 text-[11px] font-normal text-[#94949B] border border-[rgba(255,255,255,0.08)] bg-[#101013] whitespace-nowrap ${
                isInvestor ? 'rounded-full' : 'rounded-md'
              }`}
            >
              {deal.jurisdiction}
            </span>
            <span
              className={`inline-block px-2.5 py-0.5 text-[11px] font-normal text-[#94949B] border border-[rgba(255,255,255,0.08)] bg-[#101013] whitespace-nowrap truncate max-w-[140px] ${
                isInvestor ? 'rounded-full' : 'rounded-md'
              }`}
            >
              {deal.sector}
            </span>
          </div>

          {/* Ticket Size */}
          <div className="text-right sm:text-left">
            <span className="text-[10px] text-[#5F5F65] block uppercase tracking-wider">
              Ticket
            </span>
            <span className="text-[13.5px] font-medium text-[#EDEDE9]">
              {deal.ticket}
            </span>
          </div>

          {/* Status / Stage Indicator */}
          <div>
            {!isInvestor ? (
              deal.status === 'Published' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium text-[#94A3AE] bg-[rgba(148,163,174,0.14)] border border-[rgba(148,163,174,0.3)] rounded-full whitespace-nowrap">
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-normal text-[#94949B] border border-[rgba(255,255,255,0.09)] bg-[#101013] rounded-full whitespace-nowrap">
                  In Review
                </span>
              )
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-mono font-normal text-[#C9A24D] border border-[rgba(201,162,77,0.3)] bg-[rgba(201,162,77,0.08)] rounded-full whitespace-nowrap">
                {deal.stage}
              </span>
            )}
          </div>

          {/* Row Actions: Book a Call, View Dossier, Track */}
          <div className="flex items-center gap-1.5 justify-end shrink-0">
            {/* Book a Call Button */}
            <button
              type="button"
              id={`btn-book-call-row-${deal.id}`}
              onClick={handleBookCallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-[rgba(201,162,77,0.15)] hover:bg-[#C9A24D] text-[#C9A24D] hover:text-[#0B0B0C] border border-[rgba(201,162,77,0.35)] transition-all cursor-pointer shadow-sm whitespace-nowrap"
              title="Schedule a 45-minute briefing call with Quatromine"
            >
              <PhoneCall className="w-3 h-3 shrink-0" />
              <span className="hidden xl:inline">Book a Call</span>
              <span className="xl:hidden">Call</span>
            </button>

            {/* View Dossier Button */}
            <button
              type="button"
              id={`btn-view-dossier-row-${deal.id}`}
              onClick={handleOpenDossierClick}
              className="p-1.5 text-[#94949B] hover:text-[#EDEDE9] bg-[#101013] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] rounded-xl transition-colors cursor-pointer shrink-0"
              title="Open deal details popup (Team, Financials, Ask, Sector & Stage)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Investor Track Button */}
            {isInvestor && (
              <button
                type="button"
                id={`btn-track-row-${deal.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTrack?.(deal.id);
                }}
                className={`p-1.5 text-xs rounded-xl transition-all cursor-pointer select-none ${
                  isTracked
                    ? 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.45)]'
                    : 'text-[#94949B] bg-[#101013] border border-[rgba(255,255,255,0.09)] hover:text-[#EDEDE9]'
                }`}
                title={isTracked ? 'Untrack startup' : 'Track startup'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isTracked ? 'fill-[#C9A24D] text-[#C9A24D]' : ''}`} />
              </button>
            )}
          </div>

          {/* Chevron */}
          <div className="flex justify-end">
            <ChevronDown
              className={`w-[18px] h-[18px] text-[#94949B] transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-[#EDEDE9]' : ''
              }`}
            />
          </div>
        </div>

        {/* Mobile Layout (<=820px) */}
        <div className="min-[821px]:hidden space-y-3">
          <div className="grid grid-cols-[36px_1fr_20px] gap-3 items-center">
            {/* Monogram */}
            <div
              onClick={handleOpenDossierClick}
              className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-serif text-[13px] font-medium shrink-0 ${
                isFeatured
                  ? 'border border-[rgba(201,162,77,0.4)] bg-[rgba(201,162,77,0.08)] text-[#C9A24D]'
                  : 'border border-[rgba(255,255,255,0.14)] bg-[#101013] text-[#EDEDE9]'
              }`}
            >
              {initials}
            </div>

            {/* Name + Teaser */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3
                  onClick={handleOpenDossierClick}
                  className="font-serif text-[16px] font-normal text-[#EDEDE9] truncate leading-snug hover:text-[#C9A24D]"
                >
                  {deal.name}
                </h3>
                {isFeatured && (
                  <span className="text-[10px] text-[#C9A24D] font-medium uppercase px-1.5 py-0.5 rounded-full bg-[rgba(201,162,77,0.12)]">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-[12.5px] text-[#94949B] truncate mt-0.5">
                {deal.teaser}
              </p>
            </div>

            {/* Chevron */}
            <div className="flex justify-end">
              <ChevronDown
                className={`w-[18px] h-[18px] text-[#94949B] transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-[#EDEDE9]' : ''
                }`}
              />
            </div>
          </div>

          {/* Restacked meta & action row for mobile */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[rgba(255,255,255,0.05)] text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10.5px] text-[#94949B] border border-[rgba(255,255,255,0.08)] bg-[#101013] rounded-full">
                {deal.jurisdiction}
              </span>
              <span className="text-[12.5px] font-medium text-[#EDEDE9]">
                {deal.ticket}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mobile Book Call Button */}
              <button
                type="button"
                onClick={handleBookCallClick}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-xl bg-[rgba(201,162,77,0.15)] text-[#C9A24D] border border-[rgba(201,162,77,0.35)] cursor-pointer whitespace-nowrap"
              >
                <PhoneCall className="w-2.5 h-2.5 shrink-0" />
                <span>Book Call</span>
              </button>

              {/* Mobile Dossier Button */}
              <button
                type="button"
                onClick={handleOpenDossierClick}
                className="px-2 py-1 text-[11px] text-[#EDEDE9] bg-[#1A1A1E] border border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer whitespace-nowrap"
              >
                Aspects
              </button>

              {isInvestor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTrack?.(deal.id);
                  }}
                  className={`p-1 text-xs rounded-xl transition-all cursor-pointer ${
                    isTracked
                      ? 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.45)]'
                      : 'text-[#94949B] bg-[#101013] border border-[rgba(255,255,255,0.09)]'
                  }`}
                  title={isTracked ? 'Untrack opportunity' : 'Track opportunity'}
                >
                  <Bookmark className={`w-3 h-3 ${isTracked ? 'fill-[#C9A24D] text-[#C9A24D]' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Expanded Detail */}
      <div className={`accordion-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="accordion-inner">
          <div className="border-t border-[rgba(255,255,255,0.08)] p-4 sm:p-5 md:p-6 bg-[#111114] sm:pl-12 md:pl-16 lg:pl-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-8">
              {/* Left column: full summary paragraph + metadata grid */}
              <div className="space-y-4 sm:space-y-5">
                {/* Executive summary box */}
                <div
                  className={`p-4 bg-[#151518] border border-[rgba(255,255,255,0.07)] ${
                    isInvestor ? 'rounded-xl' : 'rounded-md'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#5F5F65] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24D]" />
                      Executive Summary
                    </h4>
                    <button
                      type="button"
                      onClick={handleOpenDossierClick}
                      className="inline-flex items-center gap-1 text-[11px] text-[#C9A24D] hover:underline cursor-pointer"
                    >
                      <span>Full Dossier Popup (Team &amp; Financials)</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[14px] text-[#EDEDE9] leading-relaxed font-light">
                    {deal.summary}
                  </p>
                </div>

                {/* Metadata Grid with rounded boxes for each metric */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <div
                    className={`p-3 bg-[#151518] border border-[rgba(255,255,255,0.06)] ${
                      isInvestor ? 'rounded-xl' : 'rounded-md'
                    }`}
                  >
                    <span className="block text-[10px] text-[#5F5F65] uppercase tracking-wider mb-1">
                      Opportunity Type
                    </span>
                    <span className="text-[13px] font-medium text-[#EDEDE9]">
                      {deal.opportunityType}
                    </span>
                  </div>

                  <div
                    className={`p-3 bg-[#151518] border border-[rgba(255,255,255,0.06)] ${
                      isInvestor ? 'rounded-xl' : 'rounded-md'
                    }`}
                  >
                    <span className="block text-[10px] text-[#5F5F65] uppercase tracking-wider mb-1">
                      Development Stage
                    </span>
                    <span className="text-[13px] font-medium text-[#EDEDE9]">
                      {deal.stage}
                    </span>
                  </div>

                  <div
                    className={`p-3 bg-[#151518] border border-[rgba(255,255,255,0.06)] ${
                      isInvestor ? 'rounded-xl' : 'rounded-md'
                    }`}
                  >
                    <span className="block text-[10px] text-[#5F5F65] uppercase tracking-wider mb-1">
                      Jurisdiction
                    </span>
                    <span className="text-[13px] font-medium text-[#EDEDE9]">
                      {deal.jurisdiction}
                    </span>
                  </div>

                  {/* Responsible Person Card */}
                  <div
                    className={`p-3 bg-[#151518] border border-[rgba(255,255,255,0.06)] ${
                      isInvestor ? 'rounded-xl' : 'rounded-md'
                    }`}
                  >
                    <span className="block text-[10px] text-[#5F5F65] uppercase tracking-wider mb-1">
                      Responsible Lead
                    </span>
                    <span className="text-[13px] font-medium text-[#EDEDE9] truncate block">
                      {deal.responsiblePerson?.name || 'Quatromine Team'}
                    </span>
                  </div>
                </div>

                {/* Aspect Highlights Preview Card - perfectly conformed to all window sizes */}
                <div className="p-4 sm:p-5 bg-[#151518] border border-[rgba(255,255,255,0.07)] rounded-xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 sm:gap-4">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A24D] font-semibold block">
                      In-Depth Deal Aspects Available
                    </span>
                    <p className="text-xs text-[#EDEDE9] font-light leading-relaxed">
                      View full breakdown of Founders &amp; Team, Financial Models, Syndicate Ask, and Milestones.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full xl:w-auto">
                    <button
                      type="button"
                      onClick={handleOpenDossierClick}
                      className="flex-1 xl:flex-initial justify-center px-4 py-2.5 text-xs font-medium bg-[#222227] hover:bg-[#2b2b33] text-[#EDEDE9] rounded-xl border border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap text-center"
                    >
                      <Users className="w-3.5 h-3.5 text-[#C9A24D] shrink-0" />
                      <span>View Aspects Popup</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBookCallClick}
                      className="flex-1 xl:flex-initial justify-center px-4 py-2.5 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap text-center"
                    >
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                      <span>Book a Call</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column: related documents + direct action buttons */}
              <div className="space-y-5 lg:border-l lg:border-[rgba(255,255,255,0.07)] lg:pl-6">
                <div>
                  <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#5F5F65] mb-2.5">
                    Diligence Documents ({deal.docs.length})
                  </h4>
                  <ul className="space-y-2">
                    {deal.docs.map((doc, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={(e) => handleDocClick(e, doc)}
                          className={`w-full text-left group flex items-center justify-between p-2.5 bg-[#151518] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[#1A1A1F] transition-colors cursor-pointer ${
                            isInvestor ? 'rounded-xl' : 'rounded-md'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <FileText className="w-3.5 h-3.5 text-[#94949B] shrink-0 group-hover:text-[#EDEDE9]" />
                            <span className="text-xs text-[#EDEDE9] truncate font-mono">
                              {doc}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#5F5F65] group-hover:text-[#94949B] shrink-0">
                            Download
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {downloadNote && (
                    <div
                      className={`mt-2.5 text-[11px] text-[#94949B] bg-[#101013] px-3 py-2 border border-[rgba(255,255,255,0.08)] ${
                        isInvestor ? 'rounded-xl' : 'rounded-md'
                      }`}
                    >
                      Simulated download: <span className="text-[#EDEDE9] font-mono">{downloadNote}</span>
                    </div>
                  )}
                </div>

                {/* Direct Actions under documents (conforming to all widths) */}
                <div className="pt-3 border-t border-[rgba(255,255,255,0.07)] space-y-2.5">
                  <button
                    type="button"
                    id={`btn-expanded-book-call-${deal.id}`}
                    onClick={handleBookCallClick}
                    className="w-full bg-[#C9A24D] hover:bg-[#d6b05e] text-[#0B0B0C] font-medium text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5 text-center whitespace-normal"
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>Book a Call to Know More</span>
                  </button>

                  {isInvestor && (
                    introRequested ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.35)] rounded-xl p-2.5 text-center">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Introduction requested.</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        id={`btn-request-intro-${deal.id}`}
                        onClick={handleIntroClick}
                        disabled={requesting}
                        className="w-full bg-[#1A1A1E] hover:bg-[#25252A] text-[#EDEDE9] border border-[rgba(255,255,255,0.1)] text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-center whitespace-normal"
                      >
                        {requesting ? 'Submitting request...' : 'Request Direct Introduction'}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
