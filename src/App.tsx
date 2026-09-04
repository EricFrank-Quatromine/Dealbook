/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthUser, Role } from './types';
import { authService } from './services/authService';
import { LoginScreen } from './components/LoginScreen';
import { DealDashboard } from './components/DealDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return authService.getCurrentUser();
  });

  const handleLogin = async (role: Role, email: string) => {
    const user = await authService.login(role, email);
    setCurrentUser(user);
  };

  const handleSignOut = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <DealDashboard user={currentUser} onSignOut={handleSignOut} />;
}
