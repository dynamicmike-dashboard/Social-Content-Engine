// Auth Context for Frontend
// Uses custom Teable-based authentication

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
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

  const fetchAuthState = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setState({
          isAuthenticated: data.authenticated,
          isLoading: false,
          user: data.user || null,
          membership: data.membership || null,
          profile: data.profile || null,
          capabilities: data.capabilities || {}
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    } catch (error) {
      console.error('Auth fetch failed:', error);
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
    }
  }, []);

  useEffect(() => {
    fetchAuthState();
  }, [fetchAuthState]);

  const login = (redirectUrl?: string) => {
    window.location.href = `/sign-in?redirect_url=${encodeURIComponent(redirectUrl || '/app')}`;
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