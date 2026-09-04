import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { Role } from '../types';
import { FluidBackground } from './FluidBackground';

interface LoginScreenProps {
  onLogin: (role: Role, email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mouse hover coordinate tracking for interactive card glow
  const [partnerCardPos, setPartnerCardPos] = useState({ x: 0, y: 0, active: false });
  const [investorCardPos, setInvestorCardPos] = useState({ x: 0, y: 0, active: false });

  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    setter: React.Dispatch<React.SetStateAction<{ x: number; y: number; active: boolean }>>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setter({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleCardMouseLeave = (
    setter: React.Dispatch<React.SetStateAction<{ x: number; y: number; active: boolean }>>
  ) => {
    setter((prev) => ({ ...prev, active: false }));
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setError('');
    // Provide default email for testing convenience if empty
    if (!email) {
      setEmail(role === 'broker' ? 'partner@quatromine.com' : 'investor@capital.ch');
      setPassword(role === 'broker' ? 'partner2026' : 'investor2026');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your assigned email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const roleToUse: Role =
      cleanEmail === 'admin@quatromine.com' || cleanEmail.startsWith('admin')
        ? 'admin'
        : selectedRole || 'investor';

    onLogin(roleToUse, email.trim());
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0C] text-[#EDEDE9] flex flex-col justify-center items-center px-5 py-12 overflow-hidden">
      {/* Interactive sharp constellation background responding to mouse hover */}
      <FluidBackground variant="login" />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-10 max-w-lg">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#161619] border border-[rgba(201,162,77,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24D]" />
            <span className="text-[10px] tracking-widest uppercase font-medium text-[#C9A24D]">
              Institutional Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase font-medium text-[#EDEDE9] mb-2.5">
            QUATROMINE
          </h1>
          <p className="text-[#94949B] text-sm tracking-normal">
            Building Better Investments — Deal Dashboard
          </p>
        </div>

        {!selectedRole ? (
          /* Role Selection Cards */
          <div className="w-full max-w-[760px] grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partner Card */}
            <button
              type="button"
              id="role-card-broker"
              onClick={() => handleSelectRole('broker')}
              onMouseMove={(e) => handleCardMouseMove(e, setPartnerCardPos)}
              onMouseLeave={() => handleCardMouseLeave(setPartnerCardPos)}
              className="group relative text-left bg-[#151518] border border-[rgba(255,255,255,0.09)] border-t-2 border-t-[#94A3AE] rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[#94A3AE]/40 hover:bg-[#1A1A1E] focus:outline-none focus:ring-1 focus:ring-[#94A3AE] shadow-xl shadow-black/60 overflow-hidden cursor-pointer"
            >
              {/* Interactive mouse spotlight highlight (zero blur, clean crisp circular boundary) */}
              {partnerCardPos.active && (
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl border border-[#94A3AE]/50 transition-opacity duration-150"
                  style={{
                    background: `radial-gradient(220px circle at ${partnerCardPos.x}px ${partnerCardPos.y}px, rgba(148,163,174,0.08), transparent 70%)`,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-[#94A3AE] rounded-full bg-[rgba(148,163,174,0.12)] border border-[rgba(148,163,174,0.25)]">
                  Partner
                </span>
                <span className="text-[11px] text-[#5F5F65] font-mono group-hover:text-[#94A3AE] transition-colors">
                  01 // ACCESS
                </span>
              </div>

              <h2 className="relative z-10 font-serif text-[24px] font-normal text-[#EDEDE9] mb-3 group-hover:text-white transition-colors">
                Partner Login
              </h2>
              <p className="relative z-10 text-[14px] text-[#94949B] leading-relaxed">
                Track the deals you've brought to Quatromine and their current status.
              </p>

              <div className="relative z-10 mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-medium text-[#94A3AE]">
                <span>Enter as Partner</span>
                <span className="text-base transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </button>

            {/* Investor Card */}
            <button
              type="button"
              id="role-card-investor"
              onClick={() => handleSelectRole('investor')}
              onMouseMove={(e) => handleCardMouseMove(e, setInvestorCardPos)}
              onMouseLeave={() => handleCardMouseLeave(setInvestorCardPos)}
              className="group relative text-left bg-[#151518] border border-[rgba(255,255,255,0.09)] border-t-2 border-t-[#C9A24D] rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A24D]/50 hover:bg-[#1A1A1E] focus:outline-none focus:ring-1 focus:ring-[#C9A24D] shadow-xl shadow-black/60 overflow-hidden cursor-pointer"
            >
              {/* Interactive mouse spotlight highlight (zero blur, clean crisp boundary) */}
              {investorCardPos.active && (
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl border border-[#C9A24D]/50 transition-opacity duration-150"
                  style={{
                    background: `radial-gradient(220px circle at ${investorCardPos.x}px ${investorCardPos.y}px, rgba(201,162,77,0.1), transparent 70%)`,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-[#C9A24D] rounded-full bg-[rgba(201,162,77,0.14)] border border-[rgba(201,162,77,0.3)]">
                  Vetted Investor
                </span>
                <span className="text-[11px] text-[#5F5F65] font-mono group-hover:text-[#C9A24D] transition-colors">
                  02 // ACCESS
                </span>
              </div>

              <h2 className="relative z-10 font-serif text-[24px] font-normal text-[#EDEDE9] mb-3 group-hover:text-white transition-colors">
                Investor Login
              </h2>
              <p className="relative z-10 text-[14px] text-[#94949B] leading-relaxed">
                Browse the opportunities Quatromine has vetted and published for you.
              </p>

              <div className="relative z-10 mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-medium text-[#C9A24D]">
                <span>Enter as Vetted Investor</span>
                <span className="text-base transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </button>
          </div>
        ) : (
          /* Sign-in Form */
          <div className="w-full max-w-[400px]">
            <div className="bg-[#151518] border border-[rgba(255,255,255,0.09)] rounded-2xl p-8 shadow-2xl shadow-black/70">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(255,255,255,0.07)]">
                <button
                  type="button"
                  id="btn-back-role"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs text-[#94949B] hover:text-[#EDEDE9] transition-colors focus:outline-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                    selectedRole === 'broker'
                      ? 'text-[#94A3AE] bg-[rgba(148,163,174,0.12)] border border-[rgba(148,163,174,0.25)]'
                      : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.28)]'
                  }`}
                >
                  {selectedRole === 'broker' ? 'Partner Portal' : 'Investor Portal'}
                </span>
              </div>

              <h2 className="font-serif text-[24px] font-normal text-[#EDEDE9] mb-1.5">
                {selectedRole === 'broker' ? 'Partner Sign In' : 'Investor Sign In'}
              </h2>
              <p className="text-xs text-[#94949B] mb-6">
                {selectedRole === 'broker'
                  ? 'Sign in to access your deal submission portfolio'
                  : 'Sign in to review vetted investment opportunities'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94949B] mb-1.5" htmlFor="email-input">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@firm.com"
                      className="w-full bg-[#111113] border border-[rgba(255,255,255,0.09)] rounded-xl px-3.5 py-2.5 text-sm text-[#EDEDE9] placeholder-[#5F5F65] focus:outline-none focus:border-[rgba(255,255,255,0.28)] transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#5F5F65] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94949B] mb-1.5" htmlFor="password-input">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#111113] border border-[rgba(255,255,255,0.09)] rounded-xl px-3.5 py-2.5 text-sm text-[#EDEDE9] placeholder-[#5F5F65] focus:outline-none focus:border-[rgba(255,255,255,0.28)] transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#5F5F65] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3.5 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-submit-login"
                  className={`w-full font-medium text-sm py-3 px-4 rounded-xl text-[#0B0B0C] transition-opacity duration-150 hover:opacity-95 cursor-pointer focus:outline-none shadow-lg ${
                    selectedRole === 'broker' ? 'bg-[#94A3AE]' : 'bg-[#C9A24D]'
                  }`}
                >
                  {selectedRole === 'broker' ? 'Sign in as Partner' : 'Sign in as Investor'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.08)] text-center">
                <p className="text-xs text-[#5F5F65]">
                  Access is issued directly by Quatromine
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
