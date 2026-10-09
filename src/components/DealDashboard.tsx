import React, { useEffect, useMemo, useState } from 'react';
import { AuthUser, DealbookDeal, FilterState, Role } from '../types';
import { api, DealbookApiError } from '../services/dealbookApi';
import { TopBar } from './TopBar';
import { DashboardHeading } from './DashboardHeading';
import { DealFilters } from './DealFilters';
import { DealList } from './DealList';
import { FluidBackground } from './FluidBackground';
import { DealDossierModal } from './DealDossierModal';
import { BookCallModal } from './BookCallModal';
import { AdminDashboard } from './AdminDashboard';
import { useTheme } from '../context/ThemeContext';

interface DealDashboardProps {
  user: AuthUser;
  onSignOut: () => void;
}

export const DealDashboard: React.FC<DealDashboardProps> = ({ user, onSignOut }) => {
  const { isLight } = useTheme();
  const [activeRole, setActiveRole] = useState<Role>(user.role);
  const [isAdminView, setIsAdminView] = useState<boolean>(user.role === 'admin');

  const [deals, setDeals] = useState<DealbookDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [introRequestedMap, setIntroRequestedMap] = useState<Record<string, boolean>>({});
  const [trackedRefs, setTrackedRefs] = useState<string[]>([]);

  // Modal States
  const [selectedDossierDeal, setSelectedDossierDeal] = useState<DealbookDeal | null>(null);
  const [bookingCallDeal, setBookingCallDeal] = useState<DealbookDeal | null>(null);
  const [isBookCallOpen, setIsBookCallOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    companyStage: 'all',
    assetClass: 'all',
    cluster: 'all',
    geography: 'all',
    businessModel: 'all',
    sortBy: 'default',
    trackedOnly: false,
  });

  // Load deals and tracked refs from real Dealbook API
  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [dealsList, trackedList] = await Promise.all([
        api.listDeals().catch((err) => {
          console.warn('Deals list request failed', err);
          return [] as DealbookDeal[];
        }),
        api.trackedRefs().catch((err) => {
          console.warn('Tracked refs request failed', err);
          return [] as string[];
        }),
      ]);
      setDeals(dealsList);
      setTrackedRefs(trackedList);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        setLoadError(`Dealbook API: ${err.code}`);
      } else {
        setLoadError('Failed to synchronize with DealBook service.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  // Handle tracking deals via API
  const handleToggleTrack = async (dealRef: string) => {
    const isTracked = trackedRefs.includes(dealRef);
    const nextTracked = isTracked
      ? trackedRefs.filter((r) => r !== dealRef)
      : [...trackedRefs, dealRef];

    // Optimistic UI update
    setTrackedRefs(nextTracked);

    try {
      await api.setTracked(dealRef, !isTracked);
    } catch (e) {
      console.warn('Tracking toggle sync failed', e);
      // Revert if API fails
      setTrackedRefs(trackedRefs);
    }
  };

  const handleToggleTrackOnly = () => {
    setFilters((prev) => ({
      ...prev,
      trackedOnly: !prev.trackedOnly,
    }));
  };

  const handleOpenDossier = (deal: DealbookDeal) => {
    if (activeRole === 'broker') return;
    setSelectedDossierDeal(deal);
  };

  const handleOpenBookCall = (deal?: DealbookDeal) => {
    setBookingCallDeal(deal || null);
    setIsBookCallOpen(true);
  };

  const handleRequestIntro = async (dealRef: string) => {
    try {
      await api.requestIntroduction(dealRef);
      setIntroRequestedMap((prev) => ({ ...prev, [dealRef]: true }));
    } catch (e) {
      console.error('Failed to request intro', e);
    }
  };

  // Distinct options from active deals dataset
  const availableStages = useMemo(() => {
    const set = new Set<string>();
    deals.forEach((d) => d.companyStage.forEach((s) => set.add(s)));
    return set.size > 0 ? Array.from(set) : ['Early Stage', 'Growth', 'Late Stage', 'Pre-IPO', 'Mega-Cap'];
  }, [deals]);

  const availableAssetClasses = useMemo(() => {
    const set = new Set<string>();
    deals.forEach((d) => d.assetClass.forEach((ac) => set.add(ac)));
    return set.size > 0 ? Array.from(set) : ['VC', 'Growth', 'PE', 'Deep Tech', 'RA', 'Other'];
  }, [deals]);

  const availableGeographies = useMemo(() => {
    const set = new Set<string>();
    deals.forEach((d) => d.geography.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [deals]);

  // Combined AND-logic filtering and sorting
  const filteredDeals = useMemo(() => {
    let result = deals.filter((deal) => {
      // Tracked-only filter
      if (filters.trackedOnly && !trackedRefs.includes(deal.ref)) {
        return false;
      }

      // Company stage filter
      if (filters.companyStage !== 'all') {
        if (!deal.companyStage.includes(filters.companyStage)) {
          return false;
        }
      }

      // Asset class filter
      if (filters.assetClass !== 'all') {
        if (!deal.assetClass.includes(filters.assetClass)) {
          return false;
        }
      }

      // Geography filter
      if (filters.geography !== 'all') {
        if (!deal.geography.includes(filters.geography)) {
          return false;
        }
      }

      // Free-text search matching ref, title, description, clusters, fields, business model, best fit
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchRef = deal.ref.toLowerCase().includes(query);
        const matchTitle = deal.title.toLowerCase().includes(query);
        const matchDesc = deal.blindDescription ? deal.blindDescription.toLowerCase().includes(query) : false;
        const matchClusters = deal.clusters.some((c) => c.toLowerCase().includes(query));
        const matchFields = deal.fields.some((f) => f.toLowerCase().includes(query));
        const matchBM = deal.businessModel.some((bm) => bm.toLowerCase().includes(query));
        const matchFit = deal.investorsBestFit ? deal.investorsBestFit.toLowerCase().includes(query) : false;

        if (!matchRef && !matchTitle && !matchDesc && !matchClusters && !matchFields && !matchBM && !matchFit) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (filters.sortBy === 'title-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === 'ref-asc') {
      result = [...result].sort((a, b) => a.ref.localeCompare(b.ref));
    }

    return result;
  }, [deals, filters, trackedRefs]);

  const trackedCount = useMemo(() => {
    return deals.filter((d) => trackedRefs.includes(d.ref)).length;
  }, [deals, trackedRefs]);

  const handlePreviewRole = (role: Role) => {
    setActiveRole(role);
    setIsAdminView(false);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-x-hidden transition-colors duration-200 ${
        isLight ? 'bg-[#FFFFFF] text-slate-900' : 'bg-[#0B0B0C] text-[#EDEDE9]'
      }`}
    >
      {/* Dynamic backdrop */}
      <FluidBackground variant={isAdminView ? 'login' : activeRole === 'investor' ? 'investor' : 'broker'} />

      {/* Top Bar with user profile & navigation */}
      <TopBar
        role={activeRole}
        userEmail={user.email}
        onSignOut={onSignOut}
        isAdminMode={isAdminView}
        onToggleAdminMode={user.role === 'admin' ? () => setIsAdminView((prev) => !prev) : undefined}
        onBookCall={() => handleOpenBookCall()}
      />

      {/* Main Content Area: either Admin Console or Deal Dashboard */}
      {isAdminView ? (
        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard
            deals={deals}
            onDealsUpdated={loadData}
            onPreviewRole={handlePreviewRole}
            onOpenDossier={handleOpenDossier}
            onSignOut={onSignOut}
            onExitAdmin={() => setIsAdminView(false)}
          />
        </main>
      ) : (
        <main className="relative z-10 flex-1 w-full max-w-[1080px] mx-auto px-6 sm:px-10 py-10">
          <DashboardHeading
            role={activeRole}
            dealsCount={deals.length}
            featuredCount={0}
            trackedCount={trackedCount}
            isTrackingOnly={Boolean(filters.trackedOnly)}
            onToggleTrackOnly={handleToggleTrackOnly}
          />

          <DealFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredDeals.length}
            role={activeRole}
            trackedCount={trackedCount}
            totalDealsCount={deals.length}
            availableStages={availableStages}
            availableAssetClasses={availableAssetClasses}
            availableGeographies={availableGeographies}
          />

          {loading ? (
            <div className={`p-16 text-center text-xs ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
              <div className="inline-block w-5 h-5 border-2 border-[rgba(201,162,77,0.3)] border-t-[#C9A24D] rounded-full animate-spin mb-3" />
              <p>Connecting to Quatromine DealBook...</p>
            </div>
          ) : loadError ? (
            <div className="p-8 text-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <p className="font-medium">{loadError}</p>
              <button
                onClick={loadData}
                className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <DealList
              deals={filteredDeals}
              role={activeRole}
              totalUnfilteredCount={deals.length}
              onRequestIntro={handleRequestIntro}
              introRequestedMap={introRequestedMap}
              trackedDealIds={trackedRefs}
              onToggleTrack={handleToggleTrack}
              isTrackingOnly={Boolean(filters.trackedOnly)}
              onOpenDossier={activeRole === 'broker' ? undefined : handleOpenDossier}
              onBookCall={handleOpenBookCall}
            />
          )}
        </main>
      )}

      {/* POPUP: Deal Dossier Modal (Guarded: Investor & Admin only) */}
      {activeRole !== 'broker' && (
        <DealDossierModal
          deal={selectedDossierDeal}
          role={activeRole}
          isOpen={Boolean(selectedDossierDeal)}
          onClose={() => setSelectedDossierDeal(null)}
          onBookCall={(deal) => {
            setSelectedDossierDeal(null);
            handleOpenBookCall(deal);
          }}
          onRequestIntro={handleRequestIntro}
          introRequested={selectedDossierDeal ? Boolean(introRequestedMap[selectedDossierDeal.ref]) : false}
          isTracked={selectedDossierDeal ? trackedRefs.includes(selectedDossierDeal.ref) : false}
          onToggleTrack={handleToggleTrack}
        />
      )}

      {/* POPUP: Book a Call Modal */}
      <BookCallModal
        deal={bookingCallDeal}
        allDeals={deals}
        userEmail={user.email}
        isOpen={isBookCallOpen}
        onClose={() => {
          setIsBookCallOpen(false);
          setBookingCallDeal(null);
        }}
      />
    </div>
  );
};
