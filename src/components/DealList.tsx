import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Deal, Role } from '../types';
import { DealRow } from './DealRow';

interface DealListProps {
  deals: Deal[];
  role: Role;
  onRequestIntro?: (dealId: string) => Promise<void> | void;
  introRequestedMap?: Record<string, boolean>;
  trackedDealIds?: string[];
  onToggleTrack?: (dealId: string) => void;
  isTrackingOnly?: boolean;
  onOpenDossier?: (deal: Deal) => void;
  onBookCall?: (deal: Deal) => void;
}

export const DealList: React.FC<DealListProps> = ({
  deals,
  role,
  onRequestIntro,
  introRequestedMap = {},
  trackedDealIds = [],
  onToggleTrack,
  isTrackingOnly = false,
  onOpenDossier,
  onBookCall,
}) => {
  // Store expanded deal ID in state (clicking one opens it; clicking again collapses it)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (deals.length === 0) {
    return (
      <div className="bg-[#151518] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center shadow-lg shadow-black/30">
        {isTrackingOnly ? (
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(201,162,77,0.1)] border border-[rgba(201,162,77,0.3)] flex items-center justify-center mx-auto text-[#C9A24D]">
              <Bookmark className="w-4 h-4" />
            </div>
            <p className="font-serif text-lg text-[#EDEDE9]">
              No startups currently tracked
            </p>
            <p className="text-xs text-[#94949B] leading-relaxed">
              You haven't added any opportunities to your tracked watchlist yet.
              Click the "Track" button on any vetted deal to monitor funding milestones and round updates.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-serif text-lg text-[#EDEDE9]">
              No deals match your criteria
            </p>
            <p className="text-xs text-[#94949B]">
              Try broadening your search query or clearing active filter constraints.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {deals.map((deal) => (
        <DealRow
          key={deal.id}
          deal={deal}
          role={role}
          isExpanded={expandedId === deal.id}
          onToggle={() => handleToggle(deal.id)}
          onRequestIntro={onRequestIntro}
          introRequested={Boolean(introRequestedMap[deal.id])}
          isTracked={trackedDealIds.includes(deal.id)}
          onToggleTrack={onToggleTrack}
          onOpenDossier={onOpenDossier}
          onBookCall={onBookCall}
        />
      ))}
    </div>
  );
};

