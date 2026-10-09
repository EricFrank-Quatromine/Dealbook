import React, { useState } from 'react';
import { Bookmark, Layers, Sparkles } from 'lucide-react';
import { DealbookDeal, Role } from '../types';
import { DealRow } from './DealRow';
import { useTheme } from '../context/ThemeContext';

interface DealListProps {
  deals: DealbookDeal[];
  role: Role;
  totalUnfilteredCount?: number;
  onRequestIntro?: (dealRef: string) => Promise<void> | void;
  introRequestedMap?: Record<string, boolean>;
  trackedDealIds?: string[];
  onToggleTrack?: (dealRef: string) => void;
  isTrackingOnly?: boolean;
  onOpenDossier?: (deal: DealbookDeal) => void;
  onBookCall?: (deal: DealbookDeal) => void;
}

export const DealList: React.FC<DealListProps> = ({
  deals,
  role,
  totalUnfilteredCount = 0,
  onRequestIntro,
  introRequestedMap = {},
  trackedDealIds = [],
  onToggleTrack,
  isTrackingOnly = false,
  onOpenDossier,
  onBookCall,
}) => {
  const { isLight } = useTheme();
  const [expandedRef, setExpandedRef] = useState<string | null>(null);

  const handleToggle = (ref: string) => {
    setExpandedRef((prev) => (prev === ref ? null : ref));
  };

  if (deals.length === 0) {
    // If user is filtering by tracked
    if (isTrackingOnly) {
      return (
        <div
          className={`border rounded-2xl p-12 text-center transition-colors shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-[#151518] border-[rgba(255,255,255,0.08)] shadow-lg shadow-black/30'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center mx-auto ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-[rgba(201,162,77,0.1)] border-[rgba(201,162,77,0.3)] text-[#C9A24D]'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </div>
            <p className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}`}>
              No opportunities currently tracked
            </p>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
              Click the bookmark icon on any opportunity in the pipeline to track its progress and access it from your watchlist.
            </p>
          </div>
        </div>
      );
    }

    // If total deals count from server is 0 (CRM hasn't ticked deals yet)
    if (totalUnfilteredCount === 0) {
      return (
        <div
          className={`border rounded-2xl p-12 text-center transition-colors shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-[#151518] border-[rgba(255,255,255,0.08)] shadow-lg shadow-black/30'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-[rgba(201,162,77,0.1)] border-[rgba(201,162,77,0.3)] text-[#C9A24D]'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <h3 className={`font-serif text-lg font-medium ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}`}>
              No Deals Currently Published in DealBook
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
              Opportunities synced from the Quatromine CRM will appear here once published by Quatromine Operations.
              To inquire about unlisted priority mandates, contact the desk directly.
            </p>
          </div>
        </div>
      );
    }

    // If deals exist but filter returned 0
    return (
      <div
        className={`border rounded-2xl p-12 text-center transition-colors shadow-sm ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#151518] border-[rgba(255,255,255,0.08)] shadow-lg shadow-black/30'
        }`}
      >
        <div className="space-y-1">
          <p className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}`}>
            No deals match your filter criteria
          </p>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
            Try adjusting your search query or clearing active filter constraints.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {deals.map((deal) => (
        <DealRow
          key={deal.ref}
          deal={deal}
          role={role}
          isExpanded={expandedRef === deal.ref}
          onToggle={() => handleToggle(deal.ref)}
          onRequestIntro={onRequestIntro}
          introRequested={Boolean(introRequestedMap[deal.ref])}
          isTracked={trackedDealIds.includes(deal.ref)}
          onToggleTrack={onToggleTrack}
          onOpenDossier={onOpenDossier}
          onBookCall={onBookCall}
        />
      ))}
    </div>
  );
};
