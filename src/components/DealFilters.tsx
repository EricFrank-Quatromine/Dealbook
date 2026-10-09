import React from 'react';
import { Search, X, Bookmark, RotateCcw } from 'lucide-react';
import { FilterState, Role } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DealFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  role?: Role;
  trackedCount?: number;
  totalDealsCount?: number;
  availableStages?: string[];
  availableAssetClasses?: string[];
  availableGeographies?: string[];
}

const DEFAULT_STAGES = ['Early Stage', 'Growth', 'Late Stage', 'Pre-IPO', 'Mega-Cap'];
const DEFAULT_ASSET_CLASSES = ['VC', 'Growth', 'PE', 'Deep Tech', 'RA', 'Other'];

export const DealFilters: React.FC<DealFiltersProps> = ({
  filters,
  onChange,
  resultCount,
  trackedCount = 0,
  totalDealsCount = 0,
  availableStages = DEFAULT_STAGES,
  availableAssetClasses = DEFAULT_ASSET_CLASSES,
  availableGeographies = [],
}) => {
  const { isLight } = useTheme();

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.companyStage !== 'all' ||
    filters.assetClass !== 'all' ||
    filters.geography !== 'all' ||
    Boolean(filters.trackedOnly);

  const handleClear = () => {
    onChange({
      search: '',
      companyStage: 'all',
      assetClass: 'all',
      cluster: 'all',
      geography: 'all',
      businessModel: 'all',
      sortBy: 'default',
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
    <div className="mb-6 space-y-3">
      {/* Search Bar + Tracked Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opportunities by title, reference, sector cluster, business model..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-xs'
                : 'bg-[#151518] border-white/10 text-white placeholder:text-stone-500 shadow-md shadow-black/30'
            }`}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tracked Filter Pill */}
        <button
          type="button"
          onClick={toggleTrackedFilter}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-colors shrink-0 ${
            filters.trackedOnly
              ? 'bg-[#C9A24D] text-black border-[#C9A24D] font-semibold shadow-sm'
              : isLight
              ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              : 'bg-[#151518] text-stone-300 border-white/10 hover:border-white/20'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${filters.trackedOnly ? 'fill-black' : ''}`} />
          <span>Tracked ({trackedCount})</span>
        </button>
      </div>

      {/* Filter Dropdowns row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Stage Filter */}
        <select
          value={filters.companyStage}
          onChange={(e) => onChange({ ...filters, companyStage: e.target.value })}
          className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none transition-colors ${
            filters.companyStage !== 'all'
              ? 'bg-[#C9A24D]/15 border-[#C9A24D]/50 text-[#C9A24D]'
              : isLight
              ? 'bg-white border-slate-200 text-slate-700'
              : 'bg-[#151518] border-white/10 text-stone-300'
          }`}
        >
          <option value="all">All Stages</option>
          {availableStages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Asset Class Filter */}
        <select
          value={filters.assetClass}
          onChange={(e) => onChange({ ...filters, assetClass: e.target.value })}
          className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none transition-colors ${
            filters.assetClass !== 'all'
              ? 'bg-[#C9A24D]/15 border-[#C9A24D]/50 text-[#C9A24D]'
              : isLight
              ? 'bg-white border-slate-200 text-slate-700'
              : 'bg-[#151518] border-white/10 text-stone-300'
          }`}
        >
          <option value="all">All Asset Classes</option>
          {availableAssetClasses.map((ac) => (
            <option key={ac} value={ac}>
              {ac}
            </option>
          ))}
        </select>

        {/* Geography Filter */}
        {availableGeographies.length > 0 && (
          <select
            value={filters.geography}
            onChange={(e) => onChange({ ...filters, geography: e.target.value })}
            className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none transition-colors ${
              filters.geography !== 'all'
                ? 'bg-[#C9A24D]/15 border-[#C9A24D]/50 text-[#C9A24D]'
                : isLight
                ? 'bg-white border-slate-200 text-slate-700'
                : 'bg-[#151518] border-white/10 text-stone-300'
            }`}
          >
            <option value="all">All Regions</option>
            {availableGeographies.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}

        {/* Clear active filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-white/5 flex items-center gap-1 transition-colors ml-auto sm:ml-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}

        <div className="ml-auto text-[11px] text-stone-400">
          Showing <span className="text-white font-medium">{resultCount}</span> of{' '}
          <span className="text-stone-300 font-medium">{totalDealsCount}</span> opportunities
        </div>
      </div>
    </div>
  );
};
