// Auth Context for Frontend
// Manages authentication state and API calls

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  issuer: string;
  subject: string;
  email?: string;
  name?: string;
}

interface ClientMembership {
  id: string;
  clientId: string;
  clientRecordId: string;
  clientName: string;
  role: 'CLIENT' | 'AGENCY_ADMIN';
  status: 'INVITED' | 'ACTIVE' | 'REVOKED';
}

interface ClientProfile {
  id: string;
  recordId: string;
  businessName: string;
  contactName: string;
  email: string;
  servicePackage: string;
  timeZone: string;
  contentApprovalRequired: boolean;
  // ... other fields
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  membership: ClientMembership | null;
  profile: ClientProfile | null;
  capabilities: Record<string, boolean>;
}

interface AuthContextType extends AuthState {
  login: (redirectUrl?: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setDemoMode: (enabled: boolean) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    membership: null,
    profile: null,
    capabilities: {}
  });
  
  const [isDemoMode, setIsDemoMode] = useState(true);

  const fetchAuthState = useCallback(async () => {
    try {
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setState({
          isAuthenticated: data.authenticated,
          isLoading: false,
          user: data.user || null,
          membership: data.client || null,
          profile: data.profile || null,
          capabilities: data.capabilities || {}
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    } catch (error) {
      console.error('Auth fetch failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchAuthState();
  }, [fetchAuthState]);

  const login = (redirectUrl?: string) => {
    // Integrate with your auth provider
    // Example for Clerk: window.location.href = `/sign-in?redirect_url=${redirectUrl || '/app'}`;
    // Example for NextAuth: signIn('provider', { callbackUrl: redirectUrl || '/app' });
    window.location.href = `/auth/login?redirect=${encodeURIComponent(redirectUrl || '/app')}`;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      membership: null,
      profile: null,
      capabilities: {}
    });
    window.location.href = '/';
  };

  const refreshProfile = async () => {
    await fetchAuthState();
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      user: state.user,
      membership: state.membership,
      profile: state.profile,
      capabilities: state.capabilities,
      login,
      logout,
      refreshProfile,
      setDemoMode,
      isDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Demo mode check
export function useDemoMode() {
  const { isDemoMode } = useAuth();
  return isDemoMode;
}