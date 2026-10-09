import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { api, DealbookApiError } from '../services/dealbookApi';
import { useTheme } from '../context/ThemeContext';

interface ChangePasswordModalProps {
  userEmail: string;
  onSuccess: () => void;
  onSignOut: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  userEmail,
  onSuccess,
  onSignOut,
}) => {
  const { isLight } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Please enter your current one-time password.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password cannot be the same as your temporary password.');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        if (err.code === 'invalid_credentials') {
          setError('The current password provided is incorrect.');
        } else {
          setError(`Password change failed: ${err.code.replace(/_/g, ' ')}`);
        }
      } else {
        setError('Failed to update password. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`w-full max-w-md rounded-2xl border p-8 shadow-2xl transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10'
            : 'bg-[#121215] border-[rgba(201,162,77,0.3)] text-[#EDEDE9] shadow-black/80'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.3)] flex items-center justify-center text-[#C9A24D]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-tight text-[#EDEDE9]">
                Password Setup Required
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#8E8E93]'}`}>
                {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Sign Out"
            className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>

        <div className="mb-6 p-3.5 rounded-xl bg-[rgba(201,162,77,0.06)] border border-[rgba(201,162,77,0.2)] text-xs text-[#C9A24D] leading-relaxed">
          <p className="font-medium mb-1">First-time authentication</p>
          <p className={isLight ? 'text-slate-600' : 'text-[#C5C5C9]'}>
            Your account was created with a temporary one-time password. Please establish your private password to proceed to the DealBook.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-emerald-400">Password Established</h3>
            <p className="text-xs text-stone-400 mt-1">Redirecting to your DealBook dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Current Temporary Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Paste one-time password"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                      : 'bg-[#18181C] border-[#2E2E34] text-[#EDEDE9] placeholder:text-[#5F5F65]'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                New Private Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    : 'bg-[#18181C] border-[#2E2E34] text-[#EDEDE9] placeholder:text-[#5F5F65]'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    : 'bg-[#18181C] border-[#2E2E34] text-[#EDEDE9] placeholder:text-[#5F5F65]'
                }`}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs tracking-wide bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Securing Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Set Permanent Password & Enter</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
