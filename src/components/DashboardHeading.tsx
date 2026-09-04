import React from 'react';
import { Bookmark, Sparkles, ShieldCheck } from 'lucide-react';
import { Role } from '../types';

interface DashboardHeadingProps {
  role: Role;
  dealsCount?: number;
  featuredCount?: number;
  trackedCount?: number;
  isTrackingOnly?: boolean;
  onToggleTrackOnly?: () => void;
}

export const DashboardHeading: React.FC<DashboardHeadingProps> = ({
  role,
  dealsCount = 0,
  featuredCount = 0,
  trackedCount = 0,
  isTrackingOnly = false,
  onToggleTrackOnly,
}) => {
  return (
    <div className="mb-8">
      {role === 'broker' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] tracking-widest uppercase font-medium text-[#94A3AE] px-2 py-0.5 rounded-[2px] bg-[rgba(148,163,174,0.1)] border border-[rgba(148,163,174,0.2)]">
              Partner Dealbook
            </span>
          </div>
          <h1 className="font-serif text-[28px] sm:text-[34px] font-normal text-[#EDEDE9] mb-2 tracking-tight">
            Your submitted deals
          </h1>
          <p className="text-[14px] text-[#94949B] max-w-2xl leading-relaxed">
            A real-time overview of every opportunity you've brought to Quatromine, diligence status, and private notes.
          </p>
        </>
      ) : (
        <>
          {/* Investor View: Refined, classy & clean */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[rgba(255,255,255,0.07)] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-medium text-[#C9A24D] px-3 py-1 rounded-full bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.3)]">
                  <ShieldCheck className="w-3 h-3 text-[#C9A24D]" />
                  Vetted Deal Flow
                </span>
                <span className="text-xs text-[#5F5F65]">
                  Institutional Grade &bull; Swiss &amp; Luxembourg
                </span>
              </div>
              <h1 className="font-serif text-[30px] sm:text-[36px] font-normal text-[#EDEDE9] tracking-tight mb-2">
                Curated Investment Opportunities
              </h1>
              <p className="text-[14px] text-[#94949B] max-w-2xl leading-relaxed font-light">
                Opportunities independently screened, structured, and validated by the Quatromine committee.
                Track key startups to receive live stage milestones.
              </p>
            </div>

            {/* Classy Quick Metrics Strip with rounded edges and no blur */}
            <div className="flex items-center gap-2 sm:gap-3 bg-[#151518] border border-[rgba(255,255,255,0.08)] p-2 sm:p-2.5 rounded-2xl shrink-0 shadow-lg shadow-black/40">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#111114] border border-[rgba(255,255,255,0.05)]">
                <span className="block text-[10px] text-[#5F5F65] uppercase tracking-wider">
                  Available
                </span>
                <span className="font-serif text-lg font-medium text-[#EDEDE9]">
                  {dealsCount}
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-[#111114] border border-[rgba(201,162,77,0.2)]">
                <span className="block text-[10px] text-[#C9A24D] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Featured
                </span>
                <span className="font-serif text-lg font-medium text-[#C9A24D]">
                  {featuredCount}
                </span>
              </div>

              <button
                type="button"
                id="header-filter-tracked-btn"
                onClick={onToggleTrackOnly}
                className={`px-3.5 py-1.5 text-left rounded-xl transition-all cursor-pointer ${
                  isTrackingOnly
                    ? 'bg-[rgba(201,162,77,0.18)] border border-[rgba(201,162,77,0.45)] shadow-sm'
                    : 'bg-[#111114] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.18)]'
                }`}
                title="Click to view only tracked startups"
              >
                <span className="block text-[10px] text-[#94949B] uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className={`w-2.5 h-2.5 ${trackedCount > 0 ? 'text-[#C9A24D] fill-[#C9A24D]' : 'text-[#5F5F65]'}`} />
                  Tracked
                </span>
                <span className={`font-serif text-lg font-medium ${isTrackingOnly ? 'text-[#C9A24D]' : 'text-[#EDEDE9]'}`}>
                  {trackedCount}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
