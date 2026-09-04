import React from 'react';
import { Search, X, Bookmark, RotateCcw } from 'lucide-react';
import { FilterState, Jurisdiction, OpportunityType, Sector, Role } from '../types';

interface DealFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  role?: Role;
  trackedCount?: number;
  totalDealsCount?: number;
}

const JURISDICTIONS: Jurisdiction[] = ['Switzerland', 'Luxembourg'];

const SECTORS: Sector[] = [
  'Digital Infrastructure & AI',
  'Sustainability & Transition',
  'Healthcare Technology',
];

const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Early Stage / VC',
  'Growth / SME',
  'Large / Institutional',
  'Real Assets / Infrastructure',
  'Emerging Managers',
];

export const DealFilters: React.FC<DealFiltersProps> = ({
  filters,
  onChange,
  resultCount,
  role = 'broker',
  trackedCount = 0,
  totalDealsCount = 0,
}) => {
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.jurisdiction !== 'all' ||
    filters.sector !== 'all' ||
    filters.opportunityType !== 'all' ||
    Boolean(filters.trackedOnly);

  const handleClear = () => {
    onChange({
      search: '',
      jurisdiction: 'all',
      sector: 'all',
      opportunityType: 'all',
      trackedOnly: false,
    });
  };

  const toggleTrackedFilter = () => {
    onChange({
      ...filters,
      trackedOnly: !filters.trackedOnly,
    });
  };

  return (
    <div className="space-y-3.5 mb-6">
      {/* Investor View Sub-Navigation: All vs Tracked Startups */}
      {role === 'investor' && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-1.5 p-1 bg-[#151518] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-sm">
            <button
              type="button"
              id="filter-tab-all-deals"
              onClick={() => onChange({ ...filters, trackedOnly: false })}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                !filters.trackedOnly
                  ? 'bg-[#222227] text-[#EDEDE9] shadow-sm'
                  : 'text-[#94949B] hover:text-[#EDEDE9]'
              }`}
            >
              All Opportunities ({totalDealsCount})
            </button>

            <button
              type="button"
              id="filter-tab-tracked-startups"
              onClick={toggleTrackedFilter}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filters.trackedOnly
                  ? 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)] shadow-sm'
                  : 'text-[#94949B] hover:text-[#EDEDE9]'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${filters.trackedOnly ? 'text-[#C9A24D] fill-[#C9A24D]' : 'text-[#94949B]'}`} />
              <span>Tracked Startups ({trackedCount})</span>
            </button>
          </div>

          {filters.trackedOnly && (
            <span className="text-[11.5px] text-[#C9A24D] font-light">
              Showing exclusively your tracked watch list
            </span>
          )}
        </div>
      )}

      {/* Filter controls row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center">
        {/* Search input */}
        <div className="relative">
          <input
            id="filter-search"
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search opportunity, startup, sector..."
            className="w-full bg-[#151518] border border-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.28)] text-xs text-[#EDEDE9] placeholder-[#5F5F65] rounded-xl pl-8 pr-7 py-2.5 outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#5F5F65] absolute left-2.5 top-3 pointer-events-none" />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-2.5 text-[#5F5F65] hover:text-[#EDEDE9] cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Jurisdiction dropdown */}
        <div>
          <select
            id="filter-jurisdiction"
            value={filters.jurisdiction}
            onChange={(e) => onChange({ ...filters, jurisdiction: e.target.value })}
            className="w-full bg-[#151518] border border-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.28)] text-xs text-[#EDEDE9] rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8"
          >
            <option value="all" className="bg-[#1B1B1F] text-[#EDEDE9]">
              All Jurisdictions
            </option>
            {JURISDICTIONS.map((j) => (
              <option key={j} value={j} className="bg-[#1B1B1F] text-[#EDEDE9]">
                {j}
              </option>
            ))}
          </select>
        </div>

        {/* Sector dropdown */}
        <div>
          <select
            id="filter-sector"
            value={filters.sector}
            onChange={(e) => onChange({ ...filters, sector: e.target.value })}
            className="w-full bg-[#151518] border border-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.28)] text-xs text-[#EDEDE9] rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8"
          >
            <option value="all" className="bg-[#1B1B1F] text-[#EDEDE9]">
              All Sectors
            </option>
            {SECTORS.map((s) => (
              <option key={s} value={s} className="bg-[#1B1B1F] text-[#EDEDE9]">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Opportunity type dropdown */}
        <div>
          <select
            id="filter-opportunity-type"
            value={filters.opportunityType}
            onChange={(e) => onChange({ ...filters, opportunityType: e.target.value })}
            className="w-full bg-[#151518] border border-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.28)] text-xs text-[#EDEDE9] rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8"
          >
            <option value="all" className="bg-[#1B1B1F] text-[#EDEDE9]">
              All Opportunity Types
            </option>
            {OPPORTUNITY_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#1B1B1F] text-[#EDEDE9]">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count & clear action row */}
      <div className="flex items-center justify-between text-xs text-[#94949B] pt-0.5">
        <div id="filter-result-count" className="font-normal text-[#5F5F65]">
          Displaying <span className="text-[#EDEDE9] font-medium">{resultCount}</span>{' '}
          {resultCount === 1 ? 'vetted deal' : 'vetted deals'}
          {filters.trackedOnly && (
            <span className="text-[#C9A24D] ml-1.5 font-normal">
              (tracked subset)
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            id="btn-clear-filters"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs text-[#94949B] hover:text-[#EDEDE9] transition-colors cursor-pointer focus:outline-none"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
