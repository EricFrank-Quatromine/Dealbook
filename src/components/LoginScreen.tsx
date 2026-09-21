import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  Sun,
  Moon,
  ShieldCheck,
  User,
  Building,
  Briefcase,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Role } from '../types';
import { FluidBackground } from './FluidBackground';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';

interface LoginScreenProps {
  onLogin: (role: Role, email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { isLight, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Partner specific modes: 'login' | 'signup' | 'forgot-password'
  const [partnerMode, setPartnerMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  // Standard Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Partner Sign-Up Form fields
  const [signupName, setSignupName] = useState('');
  const [signupFirm, setSignupFirm] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFocus, setSignupFocus] = useState('Acquisition & Buyouts');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupAgreed, setSignupAgreed] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Partner Forgot Password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

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
    setPartnerMode('login');
    setError('');
    setForgotSubmitted(false);
    setForgotMsg('');
    setSignupSuccess(false);

    // Provide default email for testing convenience if empty
    if (!email) {
      setEmail(role === 'broker' ? 'partner@quatromine.com' : 'investor@capital.ch');
      setPassword(role === 'broker' ? 'partner2026' : 'investor2026');
    }
  };

  const handleBack = () => {
    if (selectedRole === 'broker' && partnerMode !== 'login') {
      setPartnerMode('login');
      setError('');
      return;
    }
    setSelectedRole(null);
    setPartnerMode('login');
    setError('');
    setForgotSubmitted(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
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

  const handlePartnerSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupName.trim()) {
      setError('Please enter your full legal name');
      return;
    }
    if (!signupFirm.trim()) {
      setError('Please enter your organization or advisory firm name');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid corporate or business email address');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('The passwords entered do not match');
      return;
    }
    if (!signupAgreed) {
      setError('Please agree to the Quatromine Syndicate Partner Confidentiality Terms');
      return;
    }

    try {
      const user = await authService.registerPartner({
        name: signupName.trim(),
        firm: signupFirm.trim(),
        email: signupEmail.trim(),
        focus: signupFocus,
        password: signupPassword,
      });
      setSignupSuccess(true);
      setTimeout(() => {
        onLogin(user.role, user.email);
      }, 1000);
    } catch {
      setError('Partner registration could not be completed. Please try again.');
    }
  };

  const handlePartnerForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter your registered partner business email');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authService.requestPasswordReset(forgotEmail.trim());
      setForgotSubmitted(true);
      setForgotMsg(res.message);
    } catch {
      setError('Unable to dispatch password recovery. Please reach out to partners@quatromine.com.');
    } finally {
      setForgotLoading(false);
    }
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
                <div className="flex items-center gap-2">
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
                    className={`inline-block px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded-full border ${
                      isLight
                        ? 'text-amber-800 bg-amber-50 border-amber-200/80'
                        : 'text-amber-300/90 bg-amber-950/40 border-amber-500/30'
                    }`}
                  >
                    By Invitation Only
                  </span>
                </div>
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
                Browse the opportunities Quatromine has vetted and published for you. Access is strictly by invitation only.
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
        ) : selectedRole === 'broker' ? (
          /* ============================================================
             PARTNER PORTAL (Login, Sign-Up & Forgot Password)
             ============================================================ */
          <div className={`w-full transition-all ${partnerMode === 'signup' ? 'max-w-[480px]' : 'max-w-[420px]'}`}>
            <div
              className={`rounded-2xl p-7 sm:p-8 border transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 shadow-xl'
                  : 'bg-[#151518] border-[rgba(255,255,255,0.09)] shadow-2xl shadow-black/70'
              }`}
            >
              {/* Header Bar */}
              <div
                className={`flex items-center justify-between mb-5 pb-3 border-b ${
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
                  <span>{partnerMode !== 'login' ? 'Back to Sign In' : 'Select Role'}</span>
                </button>
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                    isLight
                      ? 'text-slate-700 bg-slate-100 border-slate-300'
                      : 'text-[#94A3AE] bg-[rgba(148,163,174,0.12)] border-[rgba(148,163,174,0.25)]'
                  }`}
                >
                  Partner Origination
                </span>
              </div>

              {/* Mode Toggle Tabs (Only shown when not in forgot-password) */}
              {partnerMode !== 'forgot-password' && (
                <div
                  className={`flex rounded-xl p-1 mb-6 border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#101012] border-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setPartnerMode('login');
                      setError('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      partnerMode === 'login'
                        ? isLight
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'bg-[#1F1F24] text-[#EDEDE9] shadow-xs'
                        : isLight
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-[#8A8A92] hover:text-[#EDEDE9]'
                    }`}
                  >
                    Partner Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPartnerMode('signup');
                      setError('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      partnerMode === 'signup'
                        ? isLight
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'bg-[#1F1F24] text-[#EDEDE9] shadow-xs'
                        : isLight
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-[#8A8A92] hover:text-[#EDEDE9]'
                    }`}
                  >
                    Apply for Partner Access
                  </button>
                </div>
              )}

              {/* 1. PARTNER LOGIN MODE */}
              {partnerMode === 'login' && (
                <>
                  <h2
                    className={`font-serif text-[24px] font-normal mb-1.5 ${
                      isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                    }`}
                  >
                    Partner Sign In
                  </h2>
                  <p className={`text-xs mb-6 ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
                    Sign in to access your deal origination and syndication portfolio
                  </p>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label
                        className={`block text-xs font-medium mb-1.5 ${
                          isLight ? 'text-slate-700' : 'text-[#94949B]'
                        }`}
                        htmlFor="email-input"
                      >
                        Business Email Address
                      </label>
                      <div className="relative">
                        <input
                          id="email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="partner@quatromine.com"
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
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          className={`block text-xs font-medium ${
                            isLight ? 'text-slate-700' : 'text-[#94949B]'
                          }`}
                          htmlFor="password-input"
                        >
                          Password
                        </label>
                        {/* FORGOT PASSWORD TRIGGER (PARTNER ONLY) */}
                        <button
                          type="button"
                          id="partner-forgot-password-link"
                          onClick={() => {
                            setPartnerMode('forgot-password');
                            setForgotEmail(email || '');
                            setError('');
                            setForgotSubmitted(false);
                          }}
                          className={`text-xs transition-colors cursor-pointer ${
                            isLight
                              ? 'text-slate-500 hover:text-slate-900 hover:underline'
                              : 'text-[#94A3AE] hover:text-white hover:underline'
                          }`}
                        >
                          Forgot password?
                        </button>
                      </div>
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
                      <div className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      id="btn-submit-login"
                      className={`w-full font-medium text-sm py-3 px-4 rounded-xl transition-opacity duration-150 hover:opacity-95 cursor-pointer focus:outline-none shadow-md ${
                        isLight ? 'bg-slate-700 text-white' : 'bg-[#94A3AE] text-[#0B0B0C]'
                      }`}
                    >
                      Sign in as Partner
                    </button>
                  </form>

                  <div
                    className={`mt-6 pt-5 border-t text-center ${
                      isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.08)]'
                    }`}
                  >
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
                      New deal origination partner?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setPartnerMode('signup');
                          setError('');
                        }}
                        className={`font-semibold cursor-pointer underline ml-1 ${
                          isLight ? 'text-slate-800' : 'text-[#94A3AE]'
                        }`}
                      >
                        Apply for Partner Access
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* 2. PARTNER FORGOT PASSWORD MODE */}
              {partnerMode === 'forgot-password' && (
                <>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#1F1F24] text-[#94A3AE]'
                      }`}
                    >
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h2
                      className={`font-serif text-[22px] font-normal ${
                        isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                      }`}
                    >
                      Reset Partner Password
                    </h2>
                  </div>
                  <p className={`text-xs mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
                    Enter your registered partner email address. We will verify your syndication credentials and send a secure reset link.
                  </p>

                  {forgotSubmitted ? (
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-xl border flex items-start gap-3 ${
                          isLight
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                        <div className="text-xs leading-relaxed">
                          <p className="font-semibold text-sm mb-1">Reset Instructions Sent</p>
                          <p>{forgotMsg}</p>
                          <p className="mt-2 text-[11px] opacity-80">
                            Please check your spam folder if you do not receive the email within 2 minutes.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPartnerMode('login');
                          setForgotSubmitted(false);
                          setError('');
                        }}
                        className={`w-full font-medium text-sm py-2.5 px-4 rounded-xl cursor-pointer transition-colors ${
                          isLight
                            ? 'bg-slate-800 text-white hover:bg-slate-900'
                            : 'bg-[#94A3AE] text-[#0B0B0C] hover:opacity-95'
                        }`}
                      >
                        Return to Partner Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePartnerForgotPasswordSubmit} className="space-y-4">
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1.5 ${
                            isLight ? 'text-slate-700' : 'text-[#94949B]'
                          }`}
                          htmlFor="forgot-email-input"
                        >
                          Registered Partner Email
                        </label>
                        <div className="relative">
                          <input
                            id="forgot-email-input"
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="partner@quatromine.com"
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

                      {error && (
                        <div className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        id="btn-submit-forgot"
                        className={`w-full font-medium text-sm py-3 px-4 rounded-xl transition-opacity duration-150 hover:opacity-95 cursor-pointer focus:outline-none shadow-md ${
                          isLight ? 'bg-slate-700 text-white' : 'bg-[#94A3AE] text-[#0B0B0C]'
                        }`}
                      >
                        {forgotLoading ? 'Verifying Credentials...' : 'Send Password Reset Link'}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPartnerMode('login');
                            setError('');
                          }}
                          className={`text-xs transition-colors cursor-pointer ${
                            isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#94A3AE] hover:text-white'
                          }`}
                        >
                          Remembered your password? Back to Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* 3. PARTNER SIGN-UP MODE */}
              {partnerMode === 'signup' && (
                <>
                  <h2
                    className={`font-serif text-[24px] font-normal mb-1.5 ${
                      isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                    }`}
                  >
                    Partner Registration
                  </h2>
                  <p className={`text-xs mb-5 ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
                    Register your advisory firm or origination desk to submit deals to Quatromine
                  </p>

                  {signupSuccess ? (
                    <div
                      className={`p-6 rounded-xl border text-center space-y-3 ${
                        isLight
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 animate-pulse" />
                      <h3 className="font-semibold text-base">Partner Account Activated</h3>
                      <p className="text-xs max-w-sm mx-auto leading-relaxed">
                        Welcome to the Quatromine Syndicate Network. Initializing your partner workspace...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handlePartnerSignupSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            className={`block text-[11px] font-medium mb-1 ${
                              isLight ? 'text-slate-700' : 'text-[#94949B]'
                            }`}
                            htmlFor="signup-name"
                          >
                            Full Legal Name
                          </label>
                          <div className="relative">
                            <input
                              id="signup-name"
                              type="text"
                              required
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              placeholder="e.g. Marc Lehmann"
                              className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors border ${
                                isLight
                                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                                  : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                              }`}
                            />
                            <User
                              className={`w-3.5 h-3.5 absolute right-3 top-2.5 pointer-events-none ${
                                isLight ? 'text-slate-400' : 'text-[#5F5F65]'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            className={`block text-[11px] font-medium mb-1 ${
                              isLight ? 'text-slate-700' : 'text-[#94949B]'
                            }`}
                            htmlFor="signup-firm"
                          >
                            Firm / Entity Name
                          </label>
                          <div className="relative">
                            <input
                              id="signup-firm"
                              type="text"
                              required
                              value={signupFirm}
                              onChange={(e) => setSignupFirm(e.target.value)}
                              placeholder="e.g. Zurich Merchant Advisory"
                              className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors border ${
                                isLight
                                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                                  : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                              }`}
                            />
                            <Building
                              className={`w-3.5 h-3.5 absolute right-3 top-2.5 pointer-events-none ${
                                isLight ? 'text-slate-400' : 'text-[#5F5F65]'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-[11px] font-medium mb-1 ${
                            isLight ? 'text-slate-700' : 'text-[#94949B]'
                          }`}
                          htmlFor="signup-email"
                        >
                          Corporate Business Email
                        </label>
                        <div className="relative">
                          <input
                            id="signup-email"
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="m.lehmann@advisory.ch"
                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors border ${
                              isLight
                                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                                : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                            }`}
                          />
                          <Mail
                            className={`w-3.5 h-3.5 absolute right-3 top-2.5 pointer-events-none ${
                              isLight ? 'text-slate-400' : 'text-[#5F5F65]'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-[11px] font-medium mb-1 ${
                            isLight ? 'text-slate-700' : 'text-[#94949B]'
                          }`}
                          htmlFor="signup-focus"
                        >
                          Primary Deal Asset Focus
                        </label>
                        <div className="relative">
                          <select
                            id="signup-focus"
                            value={signupFocus}
                            onChange={(e) => setSignupFocus(e.target.value)}
                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors border appearance-none ${
                              isLight
                                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                                : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] focus:border-[rgba(255,255,255,0.28)]'
                            }`}
                          >
                            <option value="Acquisition & Buyouts">Acquisition &amp; Corporate Buyouts</option>
                            <option value="Venture Capital & Growth">Venture Capital &amp; Growth Equity</option>
                            <option value="Infrastructure & Real Assets">Infrastructure &amp; Real Assets</option>
                            <option value="Private Debt & Mezzanine">Private Debt &amp; Mezzanine Financing</option>
                            <option value="Special Situations">Special Situations &amp; Distressed</option>
                          </select>
                          <Briefcase
                            className={`w-3.5 h-3.5 absolute right-3 top-2.5 pointer-events-none ${
                              isLight ? 'text-slate-400' : 'text-[#5F5F65]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            className={`block text-[11px] font-medium mb-1 ${
                              isLight ? 'text-slate-700' : 'text-[#94949B]'
                            }`}
                            htmlFor="signup-pwd"
                          >
                            Password (min. 6 chars)
                          </label>
                          <input
                            id="signup-pwd"
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors border ${
                              isLight
                                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                                : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                            }`}
                          />
                        </div>

                        <div>
                          <label
                            className={`block text-[11px] font-medium mb-1 ${
                              isLight ? 'text-slate-700' : 'text-[#94949B]'
                            }`}
                            htmlFor="signup-pwd-confirm"
                          >
                            Confirm Password
                          </label>
                          <input
                            id="signup-pwd-confirm"
                            type="password"
                            required
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors border ${
                              isLight
                                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                                : 'bg-[#111113] border-[rgba(255,255,255,0.09)] text-[#EDEDE9] placeholder-[#5F5F65] focus:border-[rgba(255,255,255,0.28)]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={signupAgreed}
                            onChange={(e) => setSignupAgreed(e.target.checked)}
                            className="mt-0.5 rounded text-slate-700 focus:ring-0 cursor-pointer"
                          />
                          <span
                            className={`text-[11px] leading-relaxed select-none ${
                              isLight ? 'text-slate-600' : 'text-[#94949B]'
                            }`}
                          >
                            I confirm affiliation as an authorized deal intermediary and agree to the{' '}
                            <span className={isLight ? 'text-slate-900 font-medium' : 'text-[#EDEDE9] font-medium'}>
                              Quatromine Partner NDA &amp; Non-Circumvention Terms
                            </span>
                            .
                          </span>
                        </label>
                      </div>

                      {error && (
                        <div className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        id="btn-submit-signup"
                        className={`w-full font-medium text-xs py-2.5 px-4 rounded-xl transition-opacity duration-150 hover:opacity-95 cursor-pointer focus:outline-none shadow-md ${
                          isLight ? 'bg-slate-800 text-white' : 'bg-[#94A3AE] text-[#0B0B0C]'
                        }`}
                      >
                        Register &amp; Access Partner Workspace
                      </button>

                      <div className="text-center pt-1">
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
                          Already registered?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setPartnerMode('login');
                              setError('');
                            }}
                            className={`font-semibold cursor-pointer underline ml-1 ${
                              isLight ? 'text-slate-800' : 'text-[#94A3AE]'
                            }`}
                          >
                            Sign In to Partner Portal
                          </button>
                        </p>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================
             INVESTOR PORTAL (Strictly "By Invitation Only" - No Sign Up)
             ============================================================ */
          <div className="w-full max-w-[420px]">
            <div
              className={`rounded-2xl p-7 sm:p-8 border transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 shadow-xl'
                  : 'bg-[#151518] border-[rgba(255,255,255,0.09)] shadow-2xl shadow-black/70'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-5 pb-3 border-b ${
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
                  <span>Select Role</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                      isLight
                        ? 'text-amber-900 bg-amber-100 border-amber-300'
                        : 'text-[#C9A24D] bg-[rgba(201,162,77,0.12)] border-[rgba(201,162,77,0.28)]'
                    }`}
                  >
                    Investor Portal
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <h2
                  className={`font-serif text-[24px] font-normal ${
                    isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
                  }`}
                >
                  Investor Sign In
                </h2>
                <span
                  className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                    isLight
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : 'text-amber-300 bg-amber-950/40 border-amber-500/30'
                  }`}
                >
                  By Invitation Only
                </span>
              </div>

              <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
                Review opportunities vetted and published exclusively for institutional syndicates
              </p>

              {/* NOTICE: PROMINENT BY INVITATION ONLY CALLOUT */}
              <div
                className={`mb-5 p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                  isLight
                    ? 'bg-amber-50/70 border-amber-200 text-slate-700'
                    : 'bg-[#181610] border-[rgba(201,162,77,0.25)] text-[#D4C3A3]'
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-amber-700' : 'text-[#C9A24D]'}`}
                />
                <div>
                  <span className="font-semibold block mb-0.5 text-[11px] uppercase tracking-wider">
                    Institutional Access by Invitation Only
                  </span>
                  <span>
                    Investor portal credentials are issued exclusively to verified institutional funds, family offices, and authorized syndicate principals. Unsolicited registrations are not accepted.
                  </span>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-700' : 'text-[#94949B]'
                    }`}
                    htmlFor="email-input"
                  >
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="investor@capital.ch"
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
                  <div className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-submit-login"
                  className={`w-full font-medium text-sm py-3 px-4 rounded-xl transition-opacity duration-150 hover:opacity-95 cursor-pointer focus:outline-none shadow-md ${
                    isLight ? 'bg-amber-600 text-white' : 'bg-[#C9A24D] text-[#0B0B0C]'
                  }`}
                >
                  Sign in as Vetted Investor
                </button>
              </form>

              <div
                className={`mt-6 pt-5 border-t text-center ${
                  isLight ? 'border-slate-200' : 'border-[rgba(255,255,255,0.08)]'
                }`}
              >
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#5F5F65]'}`}>
                  Access is issued directly by Quatromine by invitation only.
                </p>
                <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-400' : 'text-[#4A4A50]'}`}>
                  For syndication clearance, contact your Quatromine relationship manager.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
