import React from 'react';
import { Bookmark, Sparkles, ShieldCheck } from 'lucide-react';
import { Role } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const { isLight } = useTheme();

  return (
    <div className="mb-8">
      {role === 'broker' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] tracking-widest uppercase font-medium px-2 py-0.5 rounded-[2px] ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-300'
                  : 'text-[#94A3AE] bg-[rgba(148,163,174,0.1)] border border-[rgba(148,163,174,0.2)]'
              }`}
            >
              Partner Dealbook
            </span>
          </div>
          <h1
            className={`font-serif text-[28px] sm:text-[34px] font-normal mb-2 tracking-tight ${
              isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
            }`}
          >
            Your submitted deals
          </h1>
          <p className={`text-[14px] max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
            A real-time overview of every opportunity you've brought to Quatromine, diligence status, and private notes.
          </p>
        </>
      ) : (
        <>
          {/* Investor View: Refined, classy & clean */}
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-5 border-b pb-6 ${
              isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.07)]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-medium px-3 py-1 rounded-full border ${
                    isLight
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border-[rgba(201,162,77,0.3)]'
                  }`}
                >
                  <ShieldCheck className={`w-3 h-3 ${isLight ? 'text-amber-800' : 'text-[#C9A24D]'}`} />
                  Vetted Deal Flow
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
                  Institutional Grade &bull; Swiss &amp; Luxembourg
                </span>
              </div>
              <h1
                className={`font-serif text-[30px] sm:text-[36px] font-normal tracking-tight mb-2 ${
                  isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                }`}
              >
                Curated Investment Opportunities
              </h1>
              <p
                className={`text-[14px] max-w-2xl leading-relaxed font-light ${
                  isLight ? 'text-slate-600' : 'text-[#94949B]'
                }`}
              >
                Opportunities independently screened, structured, and validated by the Quatromine committee.
                Track key startups to receive live stage milestones.
              </p>
            </div>

            {/* Classy Quick Metrics Strip */}
            <div
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl shrink-0 shadow-sm border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#151518] border-[rgba(255,255,255,0.08)]'
              }`}
            >
              <div
                className={`px-3.5 py-1.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#111114] border-[rgba(255,255,255,0.05)]'
                }`}
              >
                <span className={`block text-[10px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
                  Available
                </span>
                <span className={`font-serif text-lg font-medium ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}`}>
                  {dealsCount}
                </span>
              </div>

              <div
                className={`px-3.5 py-1.5 rounded-xl border ${
                  isLight ? 'bg-white border-amber-200' : 'bg-[#111114] border-[rgba(201,162,77,0.2)]'
                }`}
              >
                <span
                  className={`block text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                    isLight ? 'text-amber-800 font-medium' : 'text-[#C9A24D]'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" /> Featured
                </span>
                <span
                  className={`font-serif text-lg font-medium ${
                    isLight ? 'text-amber-900' : 'text-[#C9A24D]'
                  }`}
                >
                  {featuredCount}
                </span>
              </div>

              <button
                type="button"
                id="header-filter-tracked-btn"
                onClick={onToggleTrackOnly}
                className={`px-3.5 py-1.5 text-left rounded-xl transition-all cursor-pointer border ${
                  isTrackingOnly
                    ? isLight
                      ? 'bg-amber-100 border-amber-300 shadow-xs'
                      : 'bg-[rgba(201,162,77,0.18)] border-[rgba(201,162,77,0.45)] shadow-sm'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-[#111114] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.18)]'
                }`}
                title="Click to view only tracked opportunities"
              >
                <span
                  className={`block text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                    isLight ? 'text-slate-600' : 'text-[#94949B]'
                  }`}
                >
                  <Bookmark
                    className={`w-2.5 h-2.5 ${
                      trackedCount > 0
                        ? isLight
                          ? 'text-amber-700 fill-amber-700'
                          : 'text-[#C9A24D] fill-[#C9A24D]'
                        : isLight
                        ? 'text-slate-400'
                        : 'text-[#5F5F65]'
                    }`}
                  />
                  Tracked
                </span>
                <span
                  className={`font-serif text-lg font-medium ${
                    isTrackingOnly
                      ? isLight
                        ? 'text-amber-900 font-semibold'
                        : 'text-[#C9A24D]'
                      : isLight
                      ? 'text-slate-900'
                      : 'text-[#EDEDE9]'
                  }`}
                >
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
