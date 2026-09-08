import { INITIAL_DEALS } from '../data/mockDeals';
import { CallBookingRequest, Deal, Role } from '../types';

const DEALS_STORAGE_KEY = 'quatromine_deals_store';
const BOOKINGS_STORAGE_KEY = 'quatromine_booked_calls';

/**
 * Deal service abstraction with local storage synchronization.
 * This makes it straightforward to replace the client-side mock with
 * a real REST or GraphQL API endpoint without altering UI components.
 */
export const dealService = {
  /**
   * Internal helper to load all stored deals or fallback to initial deals
   */
  getAllDealsRaw(): Deal[] {
    try {
      const stored = localStorage.getItem(DEALS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure investmentType is present and sync any new seed deals
          const enriched = parsed.map((deal: Deal) => {
            const seed = INITIAL_DEALS.find((d) => d.id === deal.id);
            return {
              ...deal,
              investmentType: deal.investmentType || seed?.investmentType || 'Growth Equity',
            };
          });

          // Check if any initial deals are completely missing from storage
          const existingIds = new Set(enriched.map((d: Deal) => d.id));
          const missingSeeds = INITIAL_DEALS.filter((d) => !existingIds.has(d.id));
          const complete = [...enriched, ...missingSeeds];

          try {
            localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(complete));
          } catch {}
          return complete;
        }
      }
    } catch (e) {
      console.warn('Could not read deals from storage, falling back to seed', e);
    }
    // Seed initial data into storage
    try {
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
    } catch {}
    return [...INITIAL_DEALS];
  },

  /**
   * Fetch deals accessible to the given role.
   * - Admin: returns all deals without restriction.
   * - Broker / Partner: returns deals where visibleToPartner is true.
   * - Investor: returns deals where visibleToInvestor is true and status === 'Published'.
   */
  async getDeals(role: Role): Promise<Deal[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allDeals = dealService.getAllDealsRaw();
        if (role === 'admin') {
          resolve(allDeals);
        } else if (role === 'broker') {
          resolve(allDeals.filter((d) => d.visibleToPartner !== false));
        } else {
          resolve(
            allDeals.filter(
              (d) => d.visibleToInvestor !== false && d.status === 'Published'
            )
          );
        }
      }, 50);
    });
  },

  /**
   * Save or update an existing deal
   */
  async updateDeal(updatedDeal: Deal): Promise<Deal> {
    const all = dealService.getAllDealsRaw();
    const index = all.findIndex((d) => d.id === updatedDeal.id);
    let next: Deal[];
    if (index >= 0) {
      next = [...all];
      next[index] = updatedDeal;
    } else {
      next = [updatedDeal, ...all];
    }
    try {
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist updated deal', e);
    }
    return updatedDeal;
  },

  /**
   * Add a new deal (created by Admin)
   */
  async createDeal(newDeal: Deal): Promise<Deal> {
    const all = dealService.getAllDealsRaw();
    const next = [newDeal, ...all];
    try {
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist created deal', e);
    }
    return newDeal;
  },

  /**
   * Reset deals back to the original initial seed data
   */
  async resetToDefaultDeals(): Promise<Deal[]> {
    try {
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
    } catch {}
    return [...INITIAL_DEALS];
  },

  /**
   * Submit an investor introduction request for a specific deal.
   */
  async requestIntroduction(dealId: string, email: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.info(`[DealService] Introduction requested for deal ${dealId} by ${email}`);
        resolve({
          success: true,
          message: 'Introduction requested. The Quatromine team has been notified and will be in touch.',
        });
      }, 200);
    });
  },

  /**
   * Book a briefing call for a deal
   */
  async bookCall(booking: CallBookingRequest): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const currentBookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
          currentBookings.push({
            ...booking,
            id: `call-${Date.now()}`,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(currentBookings));
        } catch (e) {
          console.warn('Could not store call booking', e);
        }
        resolve({
          success: true,
          message: `Briefing scheduled with the Quatromine team for ${booking.preferredDate} at ${booking.preferredTime} CET.`,
        });
      }, 300);
    });
  },

  /**
   * Track / Untrack startups for investors with local persistence.
   */
  getTrackedDealIds(): string[] {
    try {
      const stored = localStorage.getItem('quatromine_tracked_deals');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read tracked deals from storage', e);
    }
    return ['deal-01'];
  },

  toggleTrackDeal(dealId: string): string[] {
    const current = this.getTrackedDealIds();
    const next = current.includes(dealId)
      ? current.filter((id) => id !== dealId)
      : [...current, dealId];
    try {
      localStorage.setItem('quatromine_tracked_deals', JSON.stringify(next));
    } catch (e) {
      console.warn('Could not save tracked deals to storage', e);
    }
    return next;
  },
};

