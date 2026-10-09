import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Sun,
  Moon,
  ShieldCheck,
  User,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Shield,
  Briefcase,
} from 'lucide-react';
import { DealbookUser, Role } from '../types';
import { FluidBackground } from './FluidBackground';
import { useTheme } from '../context/ThemeContext';
import { api, DealbookApiError } from '../services/dealbookApi';

interface LoginScreenProps {
  onSuccess: (user: DealbookUser, mustChangePassword: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { isLight, toggleTheme } = useTheme();

  // Mode: 'login' | 'register' | 'help'
  const [mode, setMode] = useState<'login' | 'register' | 'help'>('login');

  // Sign in credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Partner Registration fields
  const [regName, setRegName] = useState('');
  const [regFirm, setRegFirm] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFocus, setRegFocus] = useState('Acquisition & Growth Equity');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email.trim() || !password) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      onSuccess(res.user, res.mustChangePassword);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        if (err.code === 'invalid_credentials') {
          setLoginError('Invalid email or password. Please verify your credentials.');
        } else if (err.code === 'account_pending') {
          setLoginError('Your partner registration is pending approval by Quatromine Operations.');
        } else if (err.code === 'account_disabled') {
          setLoginError('Your account has been deactivated. Please contact operations@quatromine.com.');
        } else if (err.code === 'too_many_attempts') {
          setLoginError('Too many failed attempts. Please wait a few moments before trying again.');
        } else {
          setLoginError(`Sign-in error: ${err.code.replace(/_/g, ' ')}`);
        }
      } else {
        setLoginError('Could not reach the authentication service. Please check your network connection.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regFirm.trim() || !regEmail.trim()) {
      setRegError('Please fill in all required profile fields.');
      return;
    }
    if (!regPassword || regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegLoading(true);
    try {
      await api.registerPartner({
        name: regName.trim(),
        firm: regFirm.trim(),
        email: regEmail.trim(),
        focus: regFocus.trim(),
        password: regPassword,
      });
      setRegSuccess(true);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        setRegError(`Application submission error: ${err.code.replace(/_/g, ' ')}`);
      } else {
        setRegError('Failed to submit partner application. Please try again.');
      }
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 overflow-hidden transition-colors duration-200 ${
        isLight ? 'bg-[#FFFFFF] text-slate-900' : 'bg-[#0B0B0C] text-[#EDEDE9]'
      }`}
    >
      {/* Top Right: Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isLight ? 'Dark' : 'White'} Theme`}
          className={`p-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-xs'
              : 'bg-[#18181C] hover:bg-[#222227] text-[#94949B] hover:text-[#EDEDE9] border border-[rgba(255,255,255,0.1)] shadow-sm'
          }`}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-[#C9A24D]" />
          )}
        </button>
      </div>

      {/* Dynamic Background */}
      <FluidBackground variant="login" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-8 max-w-sm">
          <div
            className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border ${
              isLight
                ? 'bg-amber-50 border-amber-200'
                : 'bg-[#161619] border-[rgba(201,162,77,0.25)]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#9E7922]' : 'bg-[#C9A24D]'}`} />
            <span
              className={`text-[10px] tracking-widest uppercase font-semibold ${
                isLight ? 'text-amber-900' : 'text-[#C9A24D]'
              }`}
            >
              Institutional DealBook
            </span>
          </div>
          <h1
            className={`font-serif text-3xl sm:text-4xl tracking-widest uppercase font-medium mb-1.5 ${
              isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
            }`}
          >
            QUATROMINE
          </h1>
          <p className={`text-xs tracking-normal ${isLight ? 'text-slate-600' : 'text-[#94949B]'}`}>
            Private Placement & Syndication Gateway
          </p>
        </div>

        {/* Card Box */}
        <div
          className={`w-full rounded-2xl border p-6 sm:p-8 transition-all shadow-2xl ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10'
              : 'bg-[#121215] border-[rgba(255,255,255,0.1)] text-[#EDEDE9] shadow-black/80'
          }`}
        >
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLoginError(null);
                }}
                className={`text-xs font-medium pb-1 border-b-2 transition-colors ${
                  mode === 'login'
                    ? 'border-[#C9A24D] text-[#C9A24D]'
                    : 'border-transparent text-stone-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegError(null);
                }}
                className={`text-xs font-medium pb-1 border-b-2 transition-colors ${
                  mode === 'register'
                    ? 'border-[#C9A24D] text-[#C9A24D]'
                    : 'border-transparent text-stone-400 hover:text-white'
                }`}
              >
                Partner Application
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMode('help')}
              className={`text-[11px] text-stone-400 hover:text-[#C9A24D] transition-colors ${
                mode === 'help' ? 'text-[#C9A24D]' : ''
              }`}
            >
              Support
            </button>
          </div>

          {/* MODE: SIGN IN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firm.com"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        : 'bg-[#18181C] border-[#2E2E34] text-[#EDEDE9] placeholder:text-[#5F5F65]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-stone-400">
                    Password / Temporary Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('help')}
                    className="text-[11px] text-[#C9A24D] hover:underline"
                  >
                    Lost password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        : 'bg-[#18181C] border-[#2E2E34] text-[#EDEDE9] placeholder:text-[#5F5F65]'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 px-4 rounded-xl font-medium text-xs tracking-wide bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {loginLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Enter DealBook</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-white/5 text-center">
                <p className="text-[11px] text-stone-500">
                  New origination partner?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-[#C9A24D] hover:underline"
                  >
                    Apply for partner accreditation
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: PARTNER REGISTRATION */}
          {mode === 'register' && (
            <div>
              {regSuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base text-emerald-400">Application Submitted</h3>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto">
                    Your partner origination application has been received and is currently pending review by Quatromine Operations.
                    You will receive access clearance once an administrator approves your mandate profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRegSuccess(false);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#C9A24D] text-black hover:bg-[#d4b05e] transition-colors"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-[rgba(201,162,77,0.06)] border border-[rgba(201,162,77,0.2)] text-[11px] text-stone-300 leading-relaxed mb-3">
                    Partner registration allows qualified advisors, corporate finance leads, and origination sponsors to track pipeline deals. Applications undergo administrative review.
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Marc Vance"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-[#2E2E34] text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Firm / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={regFirm}
                      onChange={(e) => setRegFirm(e.target.value)}
                      placeholder="e.g. Alpine Capital Partners"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-[#2E2E34] text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. m.vance@alpine.com"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-[#2E2E34] text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Mandate Focus / Sectors
                    </label>
                    <input
                      type="text"
                      value={regFocus}
                      onChange={(e) => setRegFocus(e.target.value)}
                      placeholder="e.g. Deep Tech, M&A Buyouts, AI"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-[#2E2E34] text-white'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 8 chars"
                        className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-[#2E2E34] text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Confirm *
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-[#2E2E34] text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                      {regLoading ? 'Submitting Application...' : 'Submit Partner Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* MODE: SUPPORT & PASSWORD HELP */}
          {mode === 'help' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,77,0.15)] text-[#C9A24D] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-medium">Access Assistance</h3>
                  <p className="text-[11px] text-stone-400">Security & Authentication Policy</p>
                </div>
              </div>

              <div className="text-xs text-stone-300 space-y-3 leading-relaxed">
                <p>
                  To uphold institutional confidentiality and regulatory compliance, the Quatromine DealBook does not utilize automated email reset links.
                </p>
                <p>
                  If you have forgotten your password or need a temporary one-time credential reset, please contact Quatromine Operations:
                </p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-[11px] text-[#C9A24D]">
                  operations@quatromine.com
                </div>
                <p className="text-[11px] text-stone-400">
                  An administrator will verify your institutional identity and issue a secure one-time password for your account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
