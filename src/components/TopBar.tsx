import React from 'react';
import { LogOut, Shield, PhoneCall, Sun, Moon } from 'lucide-react';
import { Role } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  role: Role;
  userEmail?: string;
  onSignOut: () => void;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
  onBookCall?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  role,
  userEmail,
  onSignOut,
  isAdminMode = false,
  onToggleAdminMode,
  onBookCall,
}) => {
  const { theme, isLight, toggleTheme } = useTheme();

  return (
    <header
      className={`w-full sticky top-0 z-20 transition-colors duration-200 border-b ${
        isLight
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-slate-200 shadow-xs'
          : 'bg-[#141417] border-[rgba(255,255,255,0.09)]'
      }`}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all duration-150 ${
          isAdminMode ? 'max-w-7xl' : 'max-w-[1080px]'
        }`}
      >
        {/* Left: Wordmark */}
        <div className="flex items-baseline gap-3">
          <span
            className={`font-serif text-lg tracking-widest uppercase font-medium ${
              isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
            }`}
          >
            QUATROMINE
          </span>
          <span
            className={`hidden sm:inline-block text-[11px] border-l pl-3 ${
              isLight ? 'text-slate-500 border-slate-300' : 'text-[#5F5F65] border-[rgba(255,255,255,0.09)]'
            }`}
          >
            {isAdminMode ? 'Team Admin Console' : 'Deal Dashboard'}
          </span>
        </div>

        {/* Right: Theme Toggle, Role Pill, Admin Console Toggle, Book Call & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Toggle (White / Dark mode) */}
          <button
            type="button"
            id="topbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? 'Dark' : 'White'} Theme`}
            className={`p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-[#18181C] hover:bg-[#222227] text-[#94949B] hover:text-[#EDEDE9] border border-[rgba(255,255,255,0.1)]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'White'} Theme`}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-[#C9A24D]" />
            )}
          </button>

          {/* Book Call Header Button */}
          {onBookCall && !isAdminMode && (
            <button
              type="button"
              id="topbar-book-call-btn"
              onClick={onBookCall}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                isLight
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-[rgba(201,162,77,0.12)] hover:bg-[rgba(201,162,77,0.22)] text-[#C9A24D] border border-[rgba(201,162,77,0.35)]'
              }`}
              title="Schedule a confidential briefing call with the Quatromine team"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Book a Call</span>
            </button>
          )}

          {/* Admin Mode Switcher - Simple Shield Symbol */}
          {onToggleAdminMode && (
            <button
              type="button"
              id="topbar-admin-toggle-btn"
              onClick={onToggleAdminMode}
              aria-label="Admin Console"
              className={`p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0 ${
                isAdminMode
                  ? isLight
                    ? 'bg-amber-100 text-amber-900 border border-amber-400 shadow-xs'
                    : 'bg-[rgba(201,162,77,0.22)] text-[#C9A24D] border border-[#C9A24D] shadow-sm shadow-[#C9A24D]/25'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  : 'bg-[#18181C] text-[#94949B] hover:text-[#C9A24D] border border-[rgba(255,255,255,0.1)] hover:border-[#C9A24D]/50'
              }`}
              title={isAdminMode ? 'Admin Console (Active - Click to switch to Deal view)' : 'Admin Console'}
            >
              <Shield
                className={`w-4 h-4 ${
                  isAdminMode
                    ? isLight
                      ? 'text-[#8C6515] fill-[#8C6515]/30'
                      : 'text-[#C9A24D] fill-[#C9A24D]/30'
                    : isLight
                    ? 'text-slate-600'
                    : 'text-[#C9A24D]'
                }`}
              />
            </button>
          )}

          {/* Role Pill */}
          {!isAdminMode &&
            (role === 'broker' ? (
              <span
                id="role-pill-broker"
                className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium tracking-wide shrink-0 ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border border-slate-300'
                    : 'bg-[rgba(148,163,174,0.14)] text-[#94A3AE] border border-[rgba(148,163,174,0.3)]'
                }`}
              >
                Partner
              </span>
            ) : (
              <span
                id="role-pill-investor"
                className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium tracking-wide shrink-0 ${
                  isLight
                    ? 'bg-amber-100/90 text-amber-900 border border-amber-300'
                    : 'bg-[rgba(201,162,77,0.14)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)]'
                }`}
              >
                Vetted Investor
              </span>
            ))}

          {/* Sign Out Button */}
          <button
            type="button"
            id="btn-sign-out"
            onClick={(e) => {
              e.preventDefault();
              onSignOut();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl transition-all focus:outline-none cursor-pointer shadow-xs shrink-0 whitespace-nowrap ${
              isLight
                ? 'text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                : 'text-[#EDEDE9] hover:text-[#C9A24D] bg-[#18181C] hover:bg-[#222227] border border-[rgba(255,255,255,0.12)] hover:border-[#C9A24D]/50'
            }`}
            title="Sign out of Quatromine session"
          >
            <LogOut className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-amber-800' : 'text-[#C9A24D]'}`} />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

