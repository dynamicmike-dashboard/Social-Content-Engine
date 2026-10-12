// Auth Context for Frontend
// Integrates with Clerk for authentication and backend API for client membership

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/react';

interface User {
  issuer: string;
  subject: string;
  email?: string;
  name?: string | null;
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
  
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const fetchAuthState = useCallback(async () => {
    if (!isSignedIn) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      return;
    }

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
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        fetchAuthState();
      } else {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    }
  }, [isLoaded, isSignedIn, fetchAuthState]);

  // Sync Clerk user info with our user state
  useEffect(() => {
    if (clerkUser && isSignedIn) {
      setState(prev => ({
        ...prev,
        user: {
          issuer: 'clerk',
          subject: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName || clerkUser.firstName || null,
        },
        isAuthenticated: true,
      }));
    } else if (!isSignedIn) {
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        membership: null,
        profile: null,
      }));
    }
  }, [clerkUser, isSignedIn]);

  const login = (redirectUrl?: string) => {
    window.location.href = `/sign-in?redirect_url=${encodeURIComponent(redirectUrl || '/app')}`;
  };

  const logout = async () => {
    try {
      await signOut();
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
      isLoading: state.isLoading || !isLoaded,
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