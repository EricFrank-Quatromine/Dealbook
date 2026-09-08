import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, Sun, Moon } from 'lucide-react';
import { Role } from '../types';
import { FluidBackground } from './FluidBackground';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onLogin: (role: Role, email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { isLight, toggleTheme } = useTheme();
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
    <div
      className={`relative min-h-screen flex flex-col justify-center items-center px-5 py-12 overflow-hidden transition-colors duration-200 ${
        isLight ? 'bg-[#FFFFFF] text-slate-900' : 'bg-[#0B0B0C] text-[#EDEDE9]'
      }`}
    >
      {/* Top Right: Theme Switcher Toggle (White / Dark mode) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
        <button
          type="button"
          id="home-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${isLight ? 'Dark' : 'White'} Theme`}
          className={`p-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-xs'
              : 'bg-[#18181C] hover:bg-[#222227] text-[#94949B] hover:text-[#EDEDE9] border border-[rgba(255,255,255,0.1)] shadow-sm'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'White'} Theme`}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-[#C9A24D]" />
          )}
        </button>
      </div>

      {/* Interactive sharp constellation background responding to mouse hover */}
      <FluidBackground variant="login" />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-10 max-w-lg">
          <div
            className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border ${
              isLight
                ? 'bg-amber-50 border-amber-200'
                : 'bg-[#161619] border-[rgba(201,162,77,0.25)]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#9E7922]' : 'bg-[#C9A24D]'}`} />
            <span
              className={`text-[10px] tracking-widest uppercase font-medium ${
                isLight ? 'text-amber-900' : 'text-[#C9A24D]'
              }`}
            >
              Institutional Portal
            </span>
          </div>
          <h1
            className={`font-serif text-3xl sm:text-4xl tracking-widest uppercase font-medium mb-2.5 ${
              isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
            }`}
          >
            QUATROMINE
          </h1>
          <p className={`text-sm tracking-normal ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
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
              className={`group relative text-left rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 focus:outline-none overflow-hidden cursor-pointer border border-t-2 ${
                isLight
                  ? 'bg-white border-slate-200 border-t-slate-500 hover:border-slate-300 hover:bg-slate-50/80 shadow-md'
                  : 'bg-[#151518] border-[rgba(255,255,255,0.09)] border-t-[#94A3AE] hover:border-[#94A3AE]/40 hover:bg-[#1A1A1E] shadow-xl shadow-black/60'
              }`}
            >
              {/* Interactive mouse spotlight highlight */}
              {partnerCardPos.active && (
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl border border-[#94A3AE]/50 transition-opacity duration-150"
                  style={{
                    background: `radial-gradient(220px circle at ${partnerCardPos.x}px ${partnerCardPos.y}px, rgba(148,163,174,${
                      isLight ? '0.12' : '0.08'
                    }), transparent 70%)`,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between mb-4">
                <span
                  className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${
                    isLight
                      ? 'text-slate-700 bg-slate-100 border-slate-300'
                      : 'text-[#94A3AE] bg-[rgba(148,163,174,0.12)] border-[rgba(148,163,174,0.25)]'
                  }`}
                >
                  Partner
                </span>
                <span
                  className={`text-[11px] font-mono transition-colors ${
                    isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-[#5F5F65] group-hover:text-[#94A3AE]'
                  }`}
                >
                  01 // ACCESS
                </span>
              </div>

              <h2
                className={`relative z-10 font-serif text-[24px] font-normal mb-3 transition-colors ${
                  isLight ? 'text-slate-900 group-hover:text-slate-950' : 'text-[#EDEDE9] group-hover:text-white'
                }`}
              >
                Partner Login
              </h2>
              <p
                className={`relative z-10 text-[14px] leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-[#94949B]'
                }`}
              >
                Track the deals you've brought to Quatromine and their current status.
              </p>

              <div
                className={`relative z-10 mt-8 pt-4 border-t flex items-center justify-between text-xs font-medium ${
                  isLight
                    ? 'border-slate-200 text-slate-700'
                    : 'border-[rgba(255,255,255,0.06)] text-[#94A3AE]'
                }`}
              >
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
              className={`group relative text-left rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 focus:outline-none overflow-hidden cursor-pointer border border-t-2 ${
                isLight
                  ? 'bg-white border-slate-200 border-t-[#9E7922] hover:border-amber-300 hover:bg-amber-50/20 shadow-md'
                  : 'bg-[#151518] border-[rgba(255,255,255,0.09)] border-t-[#C9A24D] hover:border-[#C9A24D]/50 hover:bg-[#1A1A1E] shadow-xl shadow-black/60'
              }`}
            >
              {/* Interactive mouse spotlight highlight */}
              {investorCardPos.active && (
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl border border-[#C9A24D]/50 transition-opacity duration-150"
                  style={{
                    background: `radial-gradient(220px circle at ${investorCardPos.x}px ${investorCardPos.y}px, rgba(201,162,77,${
                      isLight ? '0.15' : '0.1'
                    }), transparent 70%)`,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between mb-4">
                <span
                  className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${
                    isLight
                      ? 'text-amber-900 bg-amber-100 border-amber-300'
                      : 'text-[#C9A24D] bg-[rgba(201,162,77,0.14)] border-[rgba(201,162,77,0.3)]'
                  }`}
                >
                  Vetted Investor
                </span>
                <span
                  className={`text-[11px] font-mono transition-colors ${
                    isLight ? 'text-slate-400 group-hover:text-amber-800' : 'text-[#5F5F65] group-hover:text-[#C9A24D]'
                  }`}
                >
                  02 // ACCESS
                </span>
              </div>

              <h2
                className={`relative z-10 font-serif text-[24px] font-normal mb-3 transition-colors ${
                  isLight ? 'text-slate-900 group-hover:text-slate-950' : 'text-[#EDEDE9] group-hover:text-white'
                }`}
              >
                Investor Login
              </h2>
              <p
                className={`relative z-10 text-[14px] leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-[#94949B]'
                }`}
              >
                Browse the opportunities Quatromine has vetted and published for you.
              </p>

              <div
                className={`relative z-10 mt-8 pt-4 border-t flex items-center justify-between text-xs font-medium ${
                  isLight
                    ? 'border-slate-200 text-amber-900'
                    : 'border-[rgba(255,255,255,0.06)] text-[#C9A24D]'
                }`}
              >
                <span>Enter as Vetted Investor</span>
                <span className="text-base transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </button>
          </div>
        ) : (
          /* Sign-in Form */
          <div className="w-full max-w-[400px]">
            <div
              className={`rounded-2xl p-8 border transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 shadow-xl'
                  : 'bg-[#151518] border-[rgba(255,255,255,0.09)] shadow-2xl shadow-black/70'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-6 pb-3 border-b ${
                  isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.07)]'
                }`}
              >
                <button
                  type="button"
                  id="btn-back-role"
                  onClick={handleBack}
                  className={`inline-flex items-center gap-1.5 text-xs transition-colors focus:outline-none cursor-pointer ${
                    isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#94949B] hover:text-[#EDEDE9]'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                    selectedRole === 'broker'
                      ? isLight
                        ? 'text-slate-700 bg-slate-100 border-slate-300'
                        : 'text-[#94A3AE] bg-[rgba(148,163,174,0.12)] border-[rgba(148,163,174,0.25)]'
                      : isLight
                      ? 'text-amber-900 bg-amber-100 border-amber-300'
                      : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border-[rgba(201,162,77,0.28)]'
                  }`}
                >
                  {selectedRole === 'broker' ? 'Partner Portal' : 'Investor Portal'}
                </span>
              </div>

              <h2
                className={`font-serif text-[24px] font-normal mb-1.5 ${
                  isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                }`}
              >
                {selectedRole === 'broker' ? 'Partner Sign In' : 'Investor Sign In'}
              </h2>
              <p className={`text-xs mb-6 ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
                {selectedRole === 'broker'
                  ? 'Sign in to access your deal submission portfolio'
                  : 'Sign in to review vetted investment opportunities'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-700' : 'text-[#94949B]'
                    }`}
                    htmlFor="email-input"
                  >
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
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors border ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                          : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                      }`}
                    />
                    <Mail
                      className={`w-4 h-4 absolute right-3.5 top-3 pointer-events-none ${
                        isLight ? 'text-slate-400' : 'text-[#5F5F65]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-700' : 'text-[#94949B]'
                    }`}
                    htmlFor="password-input"
                  >
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
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors border ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                          : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                      }`}
                    />
                    <Lock
                      className={`w-4 h-4 absolute right-3.5 top-3 pointer-events-none ${
                        isLight ? 'text-slate-400' : 'text-[#5F5F65]'
                      }`}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-submit-login"
                  className={`w-full font-medium text-sm py-3 px-4 rounded-xl transition-opacity duration-150 hover:opacity-95 cursor-pointer focus:outline-none shadow-md ${
                    selectedRole === 'broker'
                      ? isLight
                        ? 'bg-slate-700 text-white'
                        : 'bg-[#94A3AE] text-[#0B0B0C]'
                      : isLight
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#C9A24D] text-[#0B0B0C]'
                  }`}
                >
                  {selectedRole === 'broker' ? 'Sign in as Partner' : 'Sign in as Investor'}
                </button>
              </form>

              <div
                className={`mt-6 pt-5 border-t text-center ${
                  isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.08)]'
                }`}
              >
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
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
