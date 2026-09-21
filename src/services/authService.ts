import { AuthUser, Role } from '../types';

const STORAGE_KEY = 'quatromine_auth_session';

export interface DemoCredential {
  email: string;
  password: string;
  label: string;
  role: Role;
  description: string;
}

export const DEMO_CREDENTIALS: Record<Role, DemoCredential> = {
  admin: {
    email: 'admin@quatromine.com',
    password: 'quatromine2026',
    label: 'Quatromine Admin & Operations',
    role: 'admin',
    description: 'Full syndicate deal management, visibility matrix & team lead assignment.',
  },
  investor: {
    email: 'investor@capital.ch',
    password: 'investor2026',
    label: 'Vetted Institutional Investor',
    role: 'investor',
    description: 'Access to published pipeline, aspects dossiers, and briefing call scheduling.',
  },
  broker: {
    email: 'partner@quatromine.com',
    password: 'partner2026',
    label: 'Deal Origination Partner',
    role: 'broker',
    description: 'Partner mandate tracking, submission pipeline, and status updates.',
  },
};

/**
 * Auth service abstraction.
 * Easily swappable for real backend authentication / session tokens.
 */
export const authService = {
  getCurrentUser(): AuthUser | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  },

  async login(role: Role, email: string, _password?: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    
    // Smart role detection: if admin email is provided, promote to admin
    const effectiveRole: Role =
      role === 'admin' || cleanEmail === 'admin@quatromine.com' || cleanEmail.startsWith('admin')
        ? 'admin'
        : role;

    const user: AuthUser = {
      email: email.trim(),
      role: effectiveRole,
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Session storage write failed', e);
    }
    return user;
  },

  async registerPartner(data: {
    name: string;
    firm: string;
    email: string;
    focus: string;
    password?: string;
  }): Promise<AuthUser> {
    const cleanEmail = data.email.trim().toLowerCase();
    const user: AuthUser = {
      email: cleanEmail,
      role: 'broker',
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      // Also persist partner profile details
      const partnersJson = localStorage.getItem('quatromine_registered_partners');
      const partners = partnersJson ? JSON.parse(partnersJson) : [];
      partners.push({
        name: data.name,
        firm: data.firm,
        email: cleanEmail,
        focus: data.focus,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('quatromine_registered_partners', JSON.stringify(partners));
    } catch (e) {
      console.warn('Partner storage write failed', e);
    }
    return user;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // Simulate real reset token generation and delivery
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email.trim()}.`,
    };
  },

  async logout(): Promise<void> {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Session storage remove failed', e);
    }
  },
};

