import React, { useEffect, useState } from 'react';
import { DealbookUser } from './types';
import { api, DealbookApiError } from './services/dealbookApi';
import { LoginScreen } from './components/LoginScreen';
import { DealDashboard } from './components/DealDashboard';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<DealbookUser | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Synchronize session with server via HttpOnly cookie
  useEffect(() => {
    let isMounted = true;
    api
      .me()
      .then((res) => {
        if (!isMounted) return;
        setCurrentUser(res.user);
        setMustChangePassword(Boolean(res.mustChangePassword));
      })
      .catch((err) => {
        // Expected 401 when signed out
        if (isMounted) {
          setCurrentUser(null);
          setMustChangePassword(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setInitialLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (user: DealbookUser, mustChange: boolean) => {
    setCurrentUser(user);
    setMustChangePassword(mustChange);
  };

  const handlePasswordChanged = () => {
    setMustChangePassword(false);
  };

  const handleSignOut = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout failed', e);
    }
    setCurrentUser(null);
    setMustChangePassword(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center text-[#EDEDE9] p-4">
        <div className="w-8 h-8 border-2 border-[rgba(201,162,77,0.3)] border-t-[#C9A24D] rounded-full animate-spin mb-4" />
        <span className="font-serif text-sm tracking-widest uppercase text-[#C9A24D]">
          Quatromine DealBook
        </span>
        <p className="text-xs text-[#8E8E93] mt-1">Connecting to session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {mustChangePassword && (
        <ChangePasswordModal
          userEmail={currentUser.email}
          onSuccess={handlePasswordChanged}
          onSignOut={handleSignOut}
        />
      )}
      <DealDashboard user={currentUser} onSignOut={handleSignOut} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
