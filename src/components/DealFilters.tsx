import React from 'react';
import { Search, X, Bookmark, RotateCcw, Sparkles, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FilterState, Jurisdiction, OpportunityType, Sector, Role, InvestmentType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DealFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  role?: Role;
  trackedCount?: number;
  totalDealsCount?: number;
  featuredCount?: number;
}

const JURISDICTIONS: Jurisdiction[] = ['Switzerland', 'Luxembourg'];

const SECTORS: Sector[] = [
  'Digital Infrastructure & AI',
  'Sustainability & Transition',
  'Healthcare Technology',
];

const INVESTMENT_TYPES: { label: string; value: string }[] = [
  { label: 'Acquisition (M&A / Buyout)', value: 'Acquisition' },
  { label: 'Venture Capital (Early Stage)', value: 'Venture Capital' },
  { label: 'Growth Equity (Scaling)', value: 'Growth Equity' },
  { label: 'Real Asset / Project Infrastructure', value: 'Real Asset / Project' },
  { label: 'Structured / Mezzanine Debt', value: 'Structured / Mezzanine Debt' },
  { label: 'Fund Commitment (Emerging Managers)', value: 'Fund Commitment' },
];

const TICKET_RANGES: { label: string; value: string }[] = [
  { label: 'All Ticket Sizes', value: 'all' },
  { label: 'Under CHF/€10M', value: 'under-10m' },
  { label: 'CHF/€10M – CHF/€25M', value: '10m-25m' },
  { label: 'Over CHF/€25M', value: 'over-25m' },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default (Featured First)', value: 'default' },
  { label: 'Ticket: High to Low', value: 'ticket-desc' },
  { label: 'Ticket: Low to High', value: 'ticket-asc' },
  { label: 'Company Name (A–Z)', value: 'name-asc' },
];

export const DealFilters: React.FC<DealFiltersProps> = ({
  filters,
  onChange,
  resultCount,
  role = 'broker',
  trackedCount = 0,
  totalDealsCount = 0,
  featuredCount = 0,
}) => {
  const { isLight } = useTheme();

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.jurisdiction !== 'all' ||
    filters.sector !== 'all' ||
    filters.opportunityType !== 'all' ||
    (filters.investmentType && filters.investmentType !== 'all') ||
    (filters.ticketRange && filters.ticketRange !== 'all') ||
    (filters.sortBy && filters.sortBy !== 'default') ||
    Boolean(filters.featuredOnly) ||
    Boolean(filters.trackedOnly);

  const handleClear = () => {
    onChange({
      search: '',
      jurisdiction: 'all',
      sector: 'all',
      opportunityType: 'all',
      investmentType: 'all',
      ticketRange: 'all',
      stage: 'all',
      sortBy: 'default',
      featuredOnly: false,
      trackedOnly: false,
    });
  };

  const toggleTrackedFilter = () => {
    onChange({
      ...filters,
      trackedOnly: !filters.trackedOnly,
      featuredOnly: false,
    });
  };

  const toggleFeaturedFilter = () => {
    onChange({
      ...filters,
      featuredOnly: !filters.featuredOnly,
      trackedOnly: false,
    });
  };

  return (
    <div className="space-y-3.5 mb-6">
      {/* Investor View Quick Filter Tabs: All vs Featured vs Tracked Opportunities */}
      {role === 'investor' && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
            isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.06)]'
          }`}
        >
          <div
            className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl shadow-xs border ${
              isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-[#151518] border-[rgba(255,255,255,0.08)]'
            }`}
          >
            {/* All Opportunities Tab */}
            <button
              type="button"
              id="filter-tab-all-deals"
              onClick={() => onChange({ ...filters, trackedOnly: false, featuredOnly: false })}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                !filters.trackedOnly && !filters.featuredOnly
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'bg-[#222227] text-[#EDEDE9] shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#94949B] hover:text-[#EDEDE9]'
              }`}
            >
              All Deals ({totalDealsCount})
            </button>

            {/* Featured Only Tab */}
            <button
              type="button"
              id="filter-tab-featured"
              onClick={toggleFeaturedFilter}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filters.featuredOnly
                  ? isLight
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs font-semibold'
                    : 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)] shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#94949B] hover:text-[#EDEDE9]'
              }`}
            >
              <Sparkles
                className={`w-3 h-3 ${
                  filters.featuredOnly
                    ? isLight
                      ? 'text-[#8C6515]'
                      : 'text-[#C9A24D]'
                    : isLight
                    ? 'text-slate-500'
                    : 'text-[#94949B]'
                }`}
              />
              <span>Featured ({featuredCount})</span>
            </button>

            {/* Tracked Opportunities Tab */}
            <button
              type="button"
              id="filter-tab-tracked-startups"
              onClick={toggleTrackedFilter}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filters.trackedOnly
                  ? isLight
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs font-semibold'
                    : 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)] shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#94949B] hover:text-[#EDEDE9]'
              }`}
            >
              <Bookmark
                className={`w-3 h-3 ${
                  filters.trackedOnly
                    ? isLight
                      ? 'text-[#8C6515] fill-[#8C6515]'
                      : 'text-[#C9A24D] fill-[#C9A24D]'
                    : isLight
                    ? 'text-slate-500'
                    : 'text-[#94949B]'
                }`}
              />
              <span>Tracked Watchlist ({trackedCount})</span>
            </button>
          </div>

          {/* Acquisition quick filter badge */}
          <button
            type="button"
            id="filter-quick-acquisition"
            onClick={() =>
              onChange({
                ...filters,
                investmentType: filters.investmentType === 'Acquisition' ? 'all' : 'Acquisition',
              })
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer border ${
              filters.investmentType === 'Acquisition'
                ? isLight
                  ? 'bg-amber-200/80 text-amber-950 border-amber-400 font-semibold shadow-xs'
                  : 'bg-[rgba(201,162,77,0.25)] text-[#C9A24D] border-[#C9A24D]'
                : isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                : 'bg-[#151518] hover:bg-[#1C1C20] text-[#94949B] border-[rgba(255,255,255,0.08)]'
            }`}
            title="Filter solely for M&A / Acquisition opportunities"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                filters.investmentType === 'Acquisition' ? 'bg-[#C9A24D]' : isLight ? 'bg-slate-400' : 'bg-slate-600'
              }`}
            />
            <span>Investment Type: Acquisition</span>
            {filters.investmentType === 'Acquisition' && <X className="w-3 h-3 ml-0.5" />}
          </button>
        </div>
      )}

      {/* Primary Filter controls grid: Search + Investment Type + Jurisdiction + Sector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center">
        {/* Search input */}
        <div className="relative">
          <input
            id="filter-search"
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search opportunity, sector, teaser..."
            className={`w-full text-xs rounded-xl pl-8 pr-7 py-2.5 outline-none transition-colors border ${
              isLight
                ? 'bg-white border-slate-200 focus:border-slate-400 text-slate-900 placeholder-slate-400 shadow-xs'
                : 'bg-[#151518] border-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.28)] text-[#EDEDE9] placeholder-[#5F5F65]'
            }`}
          />
          <Search
            className={`w-3.5 h-3.5 absolute left-2.5 top-3 pointer-events-none ${
              isLight ? 'text-slate-400' : 'text-[#5F5F65]'
            }`}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className={`absolute right-2.5 top-2.5 cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-[#5F5F65] hover:text-[#EDEDE9]'
              }`}
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Investment Type dropdown (with Acquisition highlighted) */}
        <div>
          <select
            id="filter-investment-type"
            value={filters.investmentType || 'all'}
            onChange={(e) => onChange({ ...filters, investmentType: e.target.value })}
            className={`w-full text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#151518] border-[rgba(255,255,255,0.09)] text-[#EDEDE9]'
            } bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8`}
          >
            <option value="all" className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}>
              All Investment Types
            </option>
            {INVESTMENT_TYPES.map((t) => (
              <option
                key={t.value}
                value={t.value}
                className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}
              >
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Jurisdiction dropdown */}
        <div>
          <select
            id="filter-jurisdiction"
            value={filters.jurisdiction}
            onChange={(e) => onChange({ ...filters, jurisdiction: e.target.value })}
            className={`w-full text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#151518] border-[rgba(255,255,255,0.09)] text-[#EDEDE9]'
            } bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8`}
          >
            <option value="all" className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}>
              All Jurisdictions
            </option>
            {JURISDICTIONS.map((j) => (
              <option
                key={j}
                value={j}
                className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}
              >
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
            className={`w-full text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#151518] border-[rgba(255,255,255,0.09)] text-[#EDEDE9]'
            } bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8`}
          >
            <option value="all" className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}>
              All Sectors
            </option>
            {SECTORS.map((s) => (
              <option
                key={s}
                value={s}
                className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}
              >
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Filter row: Ticket Range + Sort by + Active Filter Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 items-center">
        {/* Ticket Size Range dropdown */}
        <div>
          <select
            id="filter-ticket-range"
            value={filters.ticketRange || 'all'}
            onChange={(e) => onChange({ ...filters, ticketRange: e.target.value })}
            className={`w-full text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#151518] border-[rgba(255,255,255,0.09)] text-[#EDEDE9]'
            } bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8`}
          >
            {TICKET_RANGES.map((r) => (
              <option
                key={r.value}
                value={r.value}
                className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}
              >
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By dropdown */}
        <div>
          <select
            id="filter-sort-by"
            value={filters.sortBy || 'default'}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            className={`w-full text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer appearance-none border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#151518] border-[rgba(255,255,255,0.09)] text-[#EDEDE9]'
            } bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394949B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8`}
          >
            {SORT_OPTIONS.map((o) => (
              <option
                key={o.value}
                value={o.value}
                className={isLight ? 'bg-white text-slate-900' : 'bg-[#1B1B1F] text-[#EDEDE9]'}
              >
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Summary or Reset Shortcut */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          {hasActiveFilters && (
            <button
              type="button"
              id="btn-clear-filters-secondary"
              onClick={handleClear}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-[#18181C] hover:bg-[#222227] text-[#94949B] hover:text-[#EDEDE9] border-[rgba(255,255,255,0.08)]'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all criteria</span>
            </button>
          )}
        </div>
      </div>

      {/* Result count & clear action row */}
      <div
        className={`flex items-center justify-between text-xs pt-0.5 ${
          isLight ? 'text-slate-600' : 'text-[#94949B]'
        }`}
      >
        <div id="filter-result-count" className="font-normal">
          Displaying{' '}
          <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-[#EDEDE9]'}`}>
            {resultCount}
          </span>{' '}
          {resultCount === 1 ? 'vetted opportunity' : 'vetted opportunities'}
          {filters.investmentType && filters.investmentType !== 'all' && (
            <span
              className={`ml-1.5 font-medium px-2 py-0.5 rounded-full text-[11px] ${
                isLight ? 'bg-amber-100 text-amber-900' : 'bg-[rgba(201,162,77,0.18)] text-[#C9A24D]'
              }`}
            >
              &bull; {filters.investmentType}
            </span>
          )}
          {filters.trackedOnly && (
            <span className={`ml-1.5 font-normal ${isLight ? 'text-amber-800' : 'text-[#C9A24D]'}`}>
              (tracked subset)
            </span>
          )}
          {filters.featuredOnly && (
            <span className={`ml-1.5 font-normal ${isLight ? 'text-amber-800' : 'text-[#C9A24D]'}`}>
              (featured subset)
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            id="btn-clear-filters"
            onClick={handleClear}
            className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer focus:outline-none ${
              isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#94949B] hover:text-[#EDEDE9]'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
