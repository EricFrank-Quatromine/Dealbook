/**
 * Typed client for the Quatromine Dealbook API. Drop into the front end (e.g. src/services/)
 * to replace the localStorage-based authService/dealService. No dependencies.
 *
 * The session lives in an HttpOnly cookie set by the server: the browser sends it
 * automatically and JavaScript can never read it. Every write must be JSON from the
 * same origin, which this client always does.
 */

export type Role = 'admin' | 'investor' | 'broker';

export interface DealbookUser {
  id: string;
  email: string;
  name: string;
  firm: string;
  focus: string;
  role: Role;
}

/** Exactly what the server sends. Investors and partners never receive company identity. */
export interface DealbookDeal {
  /** Public id and, for investors/partners, the display title (e.g. "OPP-AI-01 - 04"). */
  ref: string;
  /** Company name for admins, the ref for everyone else. */
  title: string;
  blindDescription: string;
  companyStage: string[];
  assetClass: string[];
  clusters: string[];
  fields: string[];
  geography: string[];
  businessModel: string[];
  investorsBestFit: string;
  /** Admins only. */
  admin?: { company: string; published: boolean; crmUrl: string };
}

export class DealbookApiError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code);
  }
}

export function createDealbookApi(baseUrl = '') {
  async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: method === 'GET' ? undefined : { 'content-type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
    });
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    if (!res.ok) throw new DealbookApiError(res.status, (data as { error?: string }).error ?? 'request_failed');
    return data as T;
  }
  const ref = (r: string) => encodeURIComponent(r);

  return {
    /** Throws DealbookApiError: 401 invalid_credentials, 403 account_pending | account_disabled, 429 too_many_attempts. */
    login: (email: string, password: string) =>
      call<{ user: DealbookUser; mustChangePassword: boolean }>('POST', '/auth/login', { email, password }),
    logout: () => call<{ ok: true }>('POST', '/auth/logout'),
    /** 401 when signed out. */
    me: () => call<{ user: DealbookUser; mustChangePassword: boolean }>('GET', '/auth/me'),
    /** Partners apply; an admin approves. Always answers { status: 'pending' }. */
    registerPartner: (input: { name: string; firm: string; email: string; focus: string; password: string }) =>
      call<{ status: 'pending' }>('POST', '/auth/register', input),
    changePassword: (currentPassword: string, newPassword: string) =>
      call<{ ok: true }>('POST', '/auth/change-password', { currentPassword, newPassword }),

    listDeals: () => call<{ deals: DealbookDeal[] }>('GET', '/deals').then((r) => r.deals),
    getDeal: (dealRef: string) => call<{ deal: DealbookDeal }>('GET', `/deals/${ref(dealRef)}`).then((r) => r.deal),
    requestIntroduction: (dealRef: string, message = '') =>
      call<{ status: 'received'; message: string }>('POST', `/deals/${ref(dealRef)}/introduction`, { message }),
    bookCall: (dealRef: string, input: { preferredDate: string; preferredTime: string; topic: string; institution?: string; notes?: string }) =>
      call<{ status: 'received'; message: string }>('POST', `/deals/${ref(dealRef)}/call`, input),

    trackedRefs: () => call<{ refs: string[] }>('GET', '/tracked').then((r) => r.refs),
    setTracked: (dealRef: string, tracked: boolean) =>
      call<{ ok: true }>(tracked ? 'PUT' : 'DELETE', `/tracked/${ref(dealRef)}`),

    admin: {
      listUsers: () => call<{ users: (DealbookUser & { status: string; createdAt: string; lastLoginAt: string | null })[] }>('GET', '/admin/users'),
      /** Returns a one-time password to hand over; the user must change it at first sign-in. */
      createUser: (input: { email: string; name: string; firm?: string; role: Role }) =>
        call<{ user: DealbookUser; tempPassword: string }>('POST', '/admin/users', input),
      updateUser: (id: string, patch: { status?: 'pending' | 'active' | 'disabled'; role?: Role; name?: string; firm?: string; focus?: string }) =>
        call<{ user: DealbookUser }>('PATCH', `/admin/users/${encodeURIComponent(id)}`, patch),
      resetPassword: (id: string) => call<{ tempPassword: string }>('POST', `/admin/users/${encodeURIComponent(id)}/reset-password`),
    },
  };
}

export const api = createDealbookApi();

