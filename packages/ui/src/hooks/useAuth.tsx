import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '@sorvien/admingen-types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: () => void; // Redirects to login
  logout: () => void;
  checkAuth: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<AuthUser | null> => {
    try {
      setIsLoading(true);
      // Ensure cookies are sent
      const res = await fetch('/admin/api/_auth/me', {
          credentials: 'include' // <--- Key fix
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (e) {
      console.error('Auth check failed', e);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    // Navigate to /login page? Or handle modal?
    // For now, let's assume valid redirect
    window.location.href = '/admin/login'; 
  };

  const logout = async () => {
    try {
      await fetch('/admin/api/_auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/admin/login';
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
