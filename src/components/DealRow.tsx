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
} from 'lucide-react';
import { Deal, Role } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const { isLight } = useTheme();
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
    if (role === 'broker') return;
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
        isLight
          ? isFeatured
            ? 'bg-[#FFFDF7] border border-[rgba(180,140,50,0.4)] hover:border-[rgba(180,140,50,0.65)] shadow-sm hover:shadow-md'
            : 'bg-[#FFFFFF] border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
          : isFeatured
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
        {/* Desktop Layout (>820px) - Ample width for Company Name and Subheading */}
        <div
          className={`hidden min-[821px]:grid ${
            isInvestor
              ? 'grid-cols-[44px_2.1fr_1.1fr_0.75fr_0.75fr_auto_22px]'
              : 'grid-cols-[44px_2.2fr_1.1fr_0.8fr_0.8fr_auto_22px]'
          } gap-3 sm:gap-4 items-center`}
        >
          {/* Monogram */}
          <div
            onClick={role !== 'broker' ? handleOpenDossierClick : undefined}
            title={role !== 'broker' ? "Click to view full Deal Dossier popup" : undefined}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-serif text-[15px] font-medium shrink-0 transition-all ${
              role !== 'broker' ? 'hover:scale-105 cursor-pointer' : ''
            } ${
              isLight
                ? isFeatured
                  ? 'border border-[rgba(180,140,50,0.4)] bg-amber-50 text-[#8C6515]'
                  : 'border border-slate-200 bg-slate-100 text-slate-800'
                : isFeatured
                ? 'border border-[rgba(201,162,77,0.4)] bg-[rgba(201,162,77,0.1)] text-[#C9A24D]'
                : 'border border-[rgba(255,255,255,0.14)] bg-[#101013] text-[#EDEDE9]'
            }`}
          >
            {initials}
          </div>

          {/* Name & Subheading - Completely visible, no truncate clipping */}
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <h3
                onClick={role !== 'broker' ? handleOpenDossierClick : undefined}
                className={`font-serif text-[17px] font-normal leading-snug transition-colors ${
                  role !== 'broker'
                    ? isLight
                      ? 'text-[#0F172A] hover:text-[#8C6515] cursor-pointer'
                      : 'text-[#EDEDE9] hover:text-[#C9A24D] cursor-pointer'
                    : isLight
                    ? 'text-[#0F172A]'
                    : 'text-[#EDEDE9]'
                }`}
                title={role !== 'broker' ? "View Full Deal Dossier" : undefined}
              >
                {deal.name}
              </h3>
              {isFeatured && (
                <span
                  className={`hidden xl:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isLight
                      ? 'bg-amber-100/80 text-amber-900 border border-amber-300 font-medium'
                      : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.3)]'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" /> Featured
                </span>
              )}
            </div>
            {/* Subheading is rendered completely with high legibility */}
            <p
              className={`text-[13px] leading-relaxed mt-1 font-light ${
                isLight ? 'text-slate-600' : 'text-[#94949B]'
              }`}
            >
              {deal.teaser}
            </p>
          </div>

          {/* Badges: Investment Type + Jurisdiction + Sector */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {deal.investmentType && (
              <span
                className={`inline-block px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${
                  deal.investmentType === 'Acquisition'
                    ? isLight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[rgba(201,162,77,0.2)] text-[#C9A24D] border border-[rgba(201,162,77,0.5)]'
                    : isLight
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-[#101013] text-[#94949B] border border-[rgba(255,255,255,0.08)]'
                } ${isInvestor ? 'rounded-full' : 'rounded-md'}`}
              >
                {deal.investmentType}
              </span>
            )}
            <span
              className={`inline-block px-2.5 py-0.5 text-[11px] font-normal whitespace-nowrap ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-[#101013] text-[#94949B] border border-[rgba(255,255,255,0.08)]'
              } ${isInvestor ? 'rounded-full' : 'rounded-md'}`}
            >
              {deal.jurisdiction}
            </span>
            <span
              className={`inline-block px-2.5 py-0.5 text-[11px] font-normal whitespace-nowrap truncate max-w-[130px] ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-[#101013] text-[#94949B] border border-[rgba(255,255,255,0.08)]'
              } ${isInvestor ? 'rounded-full' : 'rounded-md'}`}
            >
              {deal.sector}
            </span>
          </div>

          {/* Ticket Size */}
          <div className="text-right sm:text-left">
            <span
              className={`text-[10px] block uppercase tracking-wider ${
                isLight ? 'text-slate-500' : 'text-[#5F5F65]'
              }`}
            >
              Ticket
            </span>
            <span
              className={`text-[13.5px] font-medium ${
                isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
              }`}
            >
              {deal.ticket}
            </span>
          </div>

          {/* Status / Stage Indicator */}
          <div>
            {!isInvestor ? (
              deal.status === 'Published' ? (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full whitespace-nowrap ${
                    isLight
                      ? 'text-slate-700 bg-slate-100 border border-slate-300'
                      : 'text-[#94A3AE] bg-[rgba(148,163,174,0.14)] border border-[rgba(148,163,174,0.3)]'
                  }`}
                >
                  Published
                </span>
              ) : (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-normal rounded-full whitespace-nowrap ${
                    isLight
                      ? 'text-slate-500 border border-slate-200 bg-slate-50'
                      : 'text-[#94949B] border border-[rgba(255,255,255,0.09)] bg-[#101013]'
                  }`}
                >
                  In Review
                </span>
              )
            ) : (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-mono font-normal rounded-full whitespace-nowrap ${
                  isLight
                    ? 'text-[#8C6515] border border-[rgba(180,140,50,0.35)] bg-amber-50'
                    : 'text-[#C9A24D] border border-[rgba(201,162,77,0.3)] bg-[rgba(201,162,77,0.08)]'
                }`}
              >
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap ${
                isLight
                  ? 'bg-[#C9A24D] hover:bg-[#B38A36] text-[#0B0B0C] border border-[#B38A36]/40'
                  : 'bg-[rgba(201,162,77,0.15)] hover:bg-[#C9A24D] text-[#C9A24D] hover:text-[#0B0B0C] border border-[rgba(201,162,77,0.35)]'
              }`}
              title="Schedule a 45-minute briefing call with Quatromine"
            >
              <PhoneCall className="w-3 h-3 shrink-0" />
              <span className="hidden xl:inline">Book a Call</span>
              <span className="xl:hidden">Call</span>
            </button>

            {/* View Dossier Button - only shown for investor/admin, removed in partner dashboard */}
            {role !== 'broker' && (
              <button
                type="button"
                id={`btn-view-dossier-row-${deal.id}`}
                onClick={handleOpenDossierClick}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                    : 'text-[#94949B] hover:text-[#EDEDE9] bg-[#101013] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
                }`}
                title="Open deal details popup (Team, Financials, Ask, Sector & Stage)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

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
                    ? isLight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.45)]'
                    : isLight
                    ? 'text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:text-slate-900'
                    : 'text-[#94949B] bg-[#101013] border border-[rgba(255,255,255,0.09)] hover:text-[#EDEDE9]'
                }`}
                title={isTracked ? 'Untrack startup' : 'Track startup'}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isTracked
                      ? isLight
                        ? 'fill-[#8C6515] text-[#8C6515]'
                        : 'fill-[#C9A24D] text-[#C9A24D]'
                      : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Chevron */}
          <div className="flex justify-end">
            <ChevronDown
              className={`w-[18px] h-[18px] transition-transform duration-200 ${
                isLight ? 'text-slate-500' : 'text-[#94949B]'
              } ${isExpanded ? `rotate-180 ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}` : ''}`}
            />
          </div>
        </div>

        {/* Mobile Layout (<=820px) - Full visibility for Company Name & Subheading */}
        <div className="min-[821px]:hidden space-y-3">
          <div className="grid grid-cols-[36px_1fr_20px] gap-3 items-start">
            {/* Monogram */}
            <div
              onClick={role !== 'broker' ? handleOpenDossierClick : undefined}
              className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-serif text-[13px] font-medium shrink-0 mt-0.5 ${
                role !== 'broker' ? 'cursor-pointer' : ''
              } ${
                isLight
                  ? isFeatured
                    ? 'border border-[rgba(180,140,50,0.4)] bg-amber-50 text-[#8C6515]'
                    : 'border border-slate-200 bg-slate-100 text-slate-800'
                  : isFeatured
                  ? 'border border-[rgba(201,162,77,0.4)] bg-[rgba(201,162,77,0.08)] text-[#C9A24D]'
                  : 'border border-[rgba(255,255,255,0.14)] bg-[#101013] text-[#EDEDE9]'
              }`}
            >
              {initials}
            </div>

            {/* Name + Subheading without truncate */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3
                  onClick={role !== 'broker' ? handleOpenDossierClick : undefined}
                  className={`font-serif text-[16px] font-normal leading-snug ${
                    role !== 'broker'
                      ? isLight
                        ? 'text-[#0F172A] hover:text-[#8C6515] cursor-pointer'
                        : 'text-[#EDEDE9] hover:text-[#C9A24D] cursor-pointer'
                      : isLight
                      ? 'text-[#0F172A]'
                      : 'text-[#EDEDE9]'
                  }`}
                >
                  {deal.name}
                </h3>
                {isFeatured && (
                  <span
                    className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded-full ${
                      isLight
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)]'
                    }`}
                  >
                    Featured
                  </span>
                )}
                {deal.investmentType && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      deal.investmentType === 'Acquisition'
                        ? isLight
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'bg-[rgba(201,162,77,0.2)] text-[#C9A24D]'
                        : isLight
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-[#151518] text-[#94949B]'
                    }`}
                  >
                    {deal.investmentType}
                  </span>
                )}
              </div>
              {/* Full Subheading on mobile */}
              <p
                className={`text-[12.5px] mt-1 leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-[#94949B]'
                }`}
              >
                {deal.teaser}
              </p>
            </div>

            {/* Chevron */}
            <div className="flex justify-end pt-1">
              <ChevronDown
                className={`w-[18px] h-[18px] transition-transform duration-200 ${
                  isLight ? 'text-slate-500' : 'text-[#94949B]'
                } ${isExpanded ? `rotate-180 ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}` : ''}`}
              />
            </div>
          </div>

          {/* Restacked meta & action row for mobile */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t ${
              isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.05)]'
            }`}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2 py-0.5 text-[10.5px] rounded-full ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'text-[#94949B] border border-[rgba(255,255,255,0.08)] bg-[#101013]'
                }`}
              >
                {deal.jurisdiction}
              </span>
              <span
                className={`text-[12.5px] font-medium ${
                  isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                }`}
              >
                {deal.ticket}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mobile Book Call Button */}
              <button
                type="button"
                onClick={handleBookCallClick}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-xl cursor-pointer whitespace-nowrap ${
                  isLight
                    ? 'bg-[#C9A24D] text-[#0B0B0C] border border-[#B38A36]/40'
                    : 'bg-[rgba(201,162,77,0.15)] text-[#C9A24D] border border-[rgba(201,162,77,0.35)]'
                }`}
              >
                <PhoneCall className="w-2.5 h-2.5 shrink-0" />
                <span>Book Call</span>
              </button>

              {/* Mobile Dossier Button - only shown for investor/admin, removed in partner dashboard */}
              {role !== 'broker' && (
                <button
                  type="button"
                  onClick={handleOpenDossierClick}
                  className={`px-2 py-1 text-[11px] rounded-xl cursor-pointer whitespace-nowrap ${
                    isLight
                      ? 'text-slate-800 bg-slate-100 border border-slate-200'
                      : 'text-[#EDEDE9] bg-[#1A1A1E] border border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  Aspects
                </button>
              )}

              {/* Mobile Track Button */}
              {isInvestor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTrack?.(deal.id);
                  }}
                  className={`p-1 text-xs rounded-xl transition-all cursor-pointer ${
                    isTracked
                      ? isLight
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.45)]'
                      : isLight
                      ? 'text-slate-500 bg-slate-100 border border-slate-200'
                      : 'text-[#94949B] bg-[#101013] border border-[rgba(255,255,255,0.09)]'
                  }`}
                  title={isTracked ? 'Untrack opportunity' : 'Track opportunity'}
                >
                  <Bookmark
                    className={`w-3 h-3 ${
                      isTracked
                        ? isLight
                          ? 'fill-[#8C6515] text-[#8C6515]'
                          : 'fill-[#C9A24D] text-[#C9A24D]'
                        : ''
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Expanded Detail */}
      <div className={`accordion-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="accordion-inner">
          <div
            className={`border-t p-4 sm:p-5 md:p-6 sm:pl-12 md:pl-16 lg:pl-20 ${
              isLight
                ? 'border-slate-200 bg-[#F8FAFC]'
                : 'border-[rgba(255,255,255,0.08)] bg-[#111114]'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-8">
              {/* Left column: full summary paragraph + metadata grid */}
              <div className="space-y-4 sm:space-y-5">
                {/* Executive summary box */}
                <div
                  className={`p-4 border ${
                    isLight
                      ? 'bg-[#FFFFFF] border-slate-200 shadow-xs'
                      : 'bg-[#151518] border-[rgba(255,255,255,0.07)]'
                  } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4
                      className={`text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 ${
                        isLight ? 'text-slate-500' : 'text-[#5F5F65]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24D]" />
                      Executive Summary
                    </h4>
                    {role !== 'broker' && (
                      <button
                        type="button"
                        onClick={handleOpenDossierClick}
                        className={`inline-flex items-center gap-1 text-[11px] hover:underline cursor-pointer ${
                          isLight ? 'text-[#8C6515]' : 'text-[#C9A24D]'
                        }`}
                      >
                        <span>Full Dossier Popup (Team &amp; Financials)</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p
                    className={`text-[14px] leading-relaxed font-light ${
                      isLight ? 'text-slate-800' : 'text-[#EDEDE9]'
                    }`}
                  >
                    {deal.summary}
                  </p>
                </div>

                {/* Metadata Grid with rounded boxes for each metric */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <div
                    className={`p-3 border ${
                      isLight
                        ? 'bg-[#FFFFFF] border-slate-200'
                        : 'bg-[#151518] border-[rgba(255,255,255,0.06)]'
                    } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-wider mb-1 ${
                        isLight ? 'text-slate-500' : 'text-[#5F5F65]'
                      }`}
                    >
                      Investment Type
                    </span>
                    <span
                      className={`text-[13px] font-medium ${
                        deal.investmentType === 'Acquisition'
                          ? isLight
                            ? 'text-amber-900 font-semibold'
                            : 'text-[#C9A24D]'
                          : isLight
                          ? 'text-slate-900'
                          : 'text-[#EDEDE9]'
                      }`}
                    >
                      {deal.investmentType || deal.opportunityType}
                    </span>
                  </div>

                  <div
                    className={`p-3 border ${
                      isLight
                        ? 'bg-[#FFFFFF] border-slate-200'
                        : 'bg-[#151518] border-[rgba(255,255,255,0.06)]'
                    } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-wider mb-1 ${
                        isLight ? 'text-slate-500' : 'text-[#5F5F65]'
                      }`}
                    >
                      Development Stage
                    </span>
                    <span
                      className={`text-[13px] font-medium ${
                        isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                      }`}
                    >
                      {deal.stage}
                    </span>
                  </div>

                  <div
                    className={`p-3 border ${
                      isLight
                        ? 'bg-[#FFFFFF] border-slate-200'
                        : 'bg-[#151518] border-[rgba(255,255,255,0.06)]'
                    } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-wider mb-1 ${
                        isLight ? 'text-slate-500' : 'text-[#5F5F65]'
                      }`}
                    >
                      Jurisdiction
                    </span>
                    <span
                      className={`text-[13px] font-medium ${
                        isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                      }`}
                    >
                      {deal.jurisdiction}
                    </span>
                  </div>

                  {/* Responsible Person Card */}
                  <div
                    className={`p-3 border ${
                      isLight
                        ? 'bg-[#FFFFFF] border-slate-200'
                        : 'bg-[#151518] border-[rgba(255,255,255,0.06)]'
                    } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-wider mb-1 ${
                        isLight ? 'text-slate-500' : 'text-[#5F5F65]'
                      }`}
                    >
                      Responsible Lead
                    </span>
                    <span
                      className={`text-[13px] font-medium truncate block ${
                        isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                      }`}
                    >
                      {deal.responsiblePerson?.name || 'Quatromine Team'}
                    </span>
                  </div>
                </div>

                {/* Aspect Highlights Preview Card */}
                {role !== 'broker' ? (
                  <div
                    className={`p-4 sm:p-5 border rounded-xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 sm:gap-4 ${
                      isLight
                        ? 'bg-[#FFFFFF] border-slate-200 shadow-xs'
                        : 'bg-[#151518] border-[rgba(255,255,255,0.07)]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold block ${
                          isLight ? 'text-[#8C6515]' : 'text-[#C9A24D]'
                        }`}
                      >
                        In-Depth Deal Aspects Available
                      </span>
                      <p
                        className={`text-xs font-light leading-relaxed ${
                          isLight ? 'text-slate-600' : 'text-[#EDEDE9]'
                        }`}
                      >
                        View full breakdown of Founders &amp; Team, Financial Models, Syndicate Ask, and Milestones.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full xl:w-auto">
                      <button
                        type="button"
                        onClick={handleOpenDossierClick}
                        className={`flex-1 xl:flex-initial justify-center px-4 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap text-center ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                            : 'bg-[#222227] hover:bg-[#2b2b33] text-[#EDEDE9] border border-[rgba(255,255,255,0.1)]'
                        }`}
                      >
                        <Users
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isLight ? 'text-[#8C6515]' : 'text-[#C9A24D]'
                          }`}
                        />
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
                ) : (
                  <div
                    className={`p-4 border rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isLight
                        ? 'bg-[#FFFFFF] border-slate-200 shadow-xs'
                        : 'bg-[#151518] border-[rgba(255,255,255,0.07)]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold block ${
                          isLight ? 'text-slate-700' : 'text-[#94949B]'
                        }`}
                      >
                        Deal Coordination &amp; Origination Desk
                      </span>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
                        Connect with the Quatromine team regarding diligence notes and deal syndicate updates.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBookCallClick}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
                    >
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                      <span>Book a Call</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right column: related documents + direct action buttons */}
              <div
                className={`space-y-5 lg:border-l lg:pl-6 ${
                  isLight ? 'lg:border-slate-200' : 'lg:border-[rgba(255,255,255,0.07)]'
                }`}
              >
                <div>
                  <h4
                    className={`text-[11px] font-semibold tracking-wider uppercase mb-2.5 ${
                      isLight ? 'text-slate-500' : 'text-[#5F5F65]'
                    }`}
                  >
                    Diligence Documents ({deal.docs.length})
                  </h4>
                  <ul className="space-y-2">
                    {deal.docs.map((doc, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={(e) => handleDocClick(e, doc)}
                          className={`w-full text-left group flex items-center justify-between p-2.5 border transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-[#FFFFFF] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              : 'bg-[#151518] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[#1A1A1F]'
                          } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <FileText
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isLight
                                  ? 'text-slate-500 group-hover:text-slate-900'
                                  : 'text-[#94949B] group-hover:text-[#EDEDE9]'
                              }`}
                            />
                            <span
                              className={`text-xs truncate font-mono ${
                                isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                              }`}
                            >
                              {doc}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] shrink-0 ${
                              isLight
                                ? 'text-slate-500 group-hover:text-slate-800'
                                : 'text-[#5F5F65] group-hover:text-[#94949B]'
                            }`}
                          >
                            Download
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {downloadNote && (
                    <div
                      className={`mt-2.5 text-[11px] px-3 py-2 border ${
                        isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-[#101013] text-[#94949B] border-[rgba(255,255,255,0.08)]'
                      } ${isInvestor ? 'rounded-xl' : 'rounded-md'}`}
                    >
                      Simulated download:{' '}
                      <span className={`font-mono ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}`}>
                        {downloadNote}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Actions under documents */}
                <div
                  className={`pt-3 border-t space-y-2.5 ${
                    isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.07)]'
                  }`}
                >
                  <button
                    type="button"
                    id={`btn-expanded-book-call-${deal.id}`}
                    onClick={handleBookCallClick}
                    className="w-full bg-[#C9A24D] hover:bg-[#d6b05e] text-[#0B0B0C] font-medium text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5 text-center whitespace-normal"
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>Book a Call to Know More</span>
                  </button>

                  {isInvestor &&
                    (introRequested ? (
                      <div
                        className={`flex items-center justify-center gap-2 text-xs rounded-xl p-2.5 text-center ${
                          isLight
                            ? 'text-amber-900 bg-amber-100 border border-amber-300'
                            : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.35)]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Introduction requested.</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        id={`btn-request-intro-${deal.id}`}
                        onClick={handleIntroClick}
                        disabled={requesting}
                        className={`w-full text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-center whitespace-normal ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                            : 'bg-[#1A1A1E] hover:bg-[#25252A] text-[#EDEDE9] border border-[rgba(255,255,255,0.1)]'
                        }`}
                      >
                        {requesting ? 'Submitting request...' : 'Request Direct Introduction'}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
