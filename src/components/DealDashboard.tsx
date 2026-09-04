import React, { useEffect, useMemo, useState } from 'react';
import { AuthUser, Deal, FilterState, Role } from '../types';
import { dealService } from '../services/dealService';
import { TopBar } from './TopBar';
import { DashboardHeading } from './DashboardHeading';
import { DealFilters } from './DealFilters';
import { DealList } from './DealList';
import { FluidBackground } from './FluidBackground';
import { DealDossierModal } from './DealDossierModal';
import { BookCallModal } from './BookCallModal';
import { AdminDashboard } from './AdminDashboard';

interface DealDashboardProps {
  user: AuthUser;
  onSignOut: () => void;
}

export const DealDashboard: React.FC<DealDashboardProps> = ({ user, onSignOut }) => {
  const [activeRole, setActiveRole] = useState<Role>(user.role);
  const [isAdminView, setIsAdminView] = useState<boolean>(user.role === 'admin');

  const [deals, setDeals] = useState<Deal[]>([]);
  const [allDealsForAdmin, setAllDealsForAdmin] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [introRequestedMap, setIntroRequestedMap] = useState<Record<string, boolean>>({});
  const [trackedDealIds, setTrackedDealIds] = useState<string[]>(() => dealService.getTrackedDealIds());

  // Modal States
  const [selectedDossierDeal, setSelectedDossierDeal] = useState<Deal | null>(null);
  const [bookingCallDeal, setBookingCallDeal] = useState<Deal | null>(null);
  const [isBookCallOpen, setIsBookCallOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    jurisdiction: 'all',
    sector: 'all',
    opportunityType: 'all',
    trackedOnly: false,
  });

  // Function to reload deals based on role
  const loadDeals = async () => {
    setLoading(true);
    try {
      const data = await dealService.getDeals(activeRole);
      setDeals(data);

      // Also get all deals for admin console
      const adminData = await dealService.getDeals('admin');
      setAllDealsForAdmin(adminData);
    } catch (err) {
      console.error('Error fetching deals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, [activeRole]);

  const handleToggleTrack = (dealId: string) => {
    const nextTracked = dealService.toggleTrackDeal(dealId);
    setTrackedDealIds([...nextTracked]);
  };

  const handleToggleTrackOnly = () => {
    setFilters((prev) => ({ ...prev, trackedOnly: !prev.trackedOnly }));
  };

  const handleOpenDossier = (deal: Deal) => {
    setSelectedDossierDeal(deal);
  };

  const handleOpenBookCall = (deal?: Deal) => {
    setBookingCallDeal(deal || null);
    setIsBookCallOpen(true);
  };

  // Combined AND-logic filtering
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Tracked-only filter
      if (filters.trackedOnly && !trackedDealIds.includes(deal.id)) {
        return false;
      }

      // Free-text search matching deal name OR sector
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchName = deal.name.toLowerCase().includes(query);
        const matchSector = deal.sector.toLowerCase().includes(query);
        if (!matchName && !matchSector) {
          return false;
        }
      }

      // Jurisdiction filter
      if (filters.jurisdiction !== 'all' && deal.jurisdiction !== filters.jurisdiction) {
        return false;
      }

      // Sector filter
      if (filters.sector !== 'all' && deal.sector !== filters.sector) {
        return false;
      }

      // Opportunity type filter
      if (filters.opportunityType !== 'all' && deal.opportunityType !== filters.opportunityType) {
        return false;
      }

      return true;
    });
  }, [deals, filters, trackedDealIds]);

  const featuredCount = useMemo(() => {
    return deals.filter((d) => d.featuredForInvestor).length;
  }, [deals]);

  const trackedCount = useMemo(() => {
    return deals.filter((d) => trackedDealIds.includes(d.id)).length;
  }, [deals, trackedDealIds]);

  const handleRequestIntro = async (dealId: string) => {
    try {
      const res = await dealService.requestIntroduction(dealId, user.email);
      if (res.success) {
        setIntroRequestedMap((prev) => ({ ...prev, [dealId]: true }));
      }
    } catch (e) {
      console.error('Failed to request intro', e);
    }
  };

  const handlePreviewRole = (role: Role) => {
    setActiveRole(role);
    setIsAdminView(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0C] text-[#EDEDE9] flex flex-col overflow-x-hidden">
      {/* Minimalist fluidic background reacting to scroll and mouse hover */}
      <FluidBackground variant={isAdminView ? 'login' : activeRole === 'investor' ? 'investor' : 'broker'} />

      {/* Top Bar with glassy backing */}
      <TopBar
        role={activeRole}
        userEmail={user.email}
        onSignOut={onSignOut}
        isAdminMode={isAdminView}
        onToggleAdminMode={() => setIsAdminView((prev) => !prev)}
        onBookCall={() => handleOpenBookCall()}
      />

      {/* Main Content Area: either Admin Console or Deal Dashboard */}
      {isAdminView ? (
        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard
            deals={allDealsForAdmin}
            onDealsUpdated={loadDeals}
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
            featuredCount={featuredCount}
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
          />

          {loading ? (
            <div className="p-16 text-center text-xs text-[#5F5F65]">
              <div className="inline-block w-5 h-5 border-2 border-[rgba(201,162,77,0.3)] border-t-[#C9A24D] rounded-full animate-spin mb-3" />
              <p>Accessing vetted deal portfolio...</p>
            </div>
          ) : (
            <DealList
              deals={filteredDeals}
              role={activeRole}
              onRequestIntro={handleRequestIntro}
              introRequestedMap={introRequestedMap}
              trackedDealIds={trackedDealIds}
              onToggleTrack={handleToggleTrack}
              isTrackingOnly={Boolean(filters.trackedOnly)}
              onOpenDossier={handleOpenDossier}
              onBookCall={handleOpenBookCall}
            />
          )}
        </main>
      )}

      {/* POPUP: Deal Dossier Modal (Aspects: Team, Financials, Ask, Sector & Focus, Stage) */}
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
        introRequested={selectedDossierDeal ? Boolean(introRequestedMap[selectedDossierDeal.id]) : false}
        isTracked={selectedDossierDeal ? trackedDealIds.includes(selectedDossierDeal.id) : false}
        onToggleTrack={handleToggleTrack}
      />

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

      {/* Subtle footer */}
      <footer className="relative z-10 border-t border-[rgba(255,255,255,0.06)] bg-[#0B0B0C] py-6 text-center text-[11px] text-[#5F5F65]">
        <div className="max-w-[1080px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Quatromine Deal Dashboard &bull; Confidential Institutional Syndication</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleOpenBookCall()}
              className="text-[#C9A24D] hover:underline cursor-pointer"
            >
              Book General Briefing Call
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setIsAdminView((prev) => !prev)}
              className="text-[#94A3AE] hover:text-[#EDEDE9] cursor-pointer"
            >
              {isAdminView ? 'Switch to Standard View' : 'Deal Operations (Admin Console)'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

