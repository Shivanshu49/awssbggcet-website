'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BuilderUser {
  id: string;
  email: string;
  name: string;
  role: string;
  builderId: string;
  avatarUrl?: string;
  initials: string;
  provider?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: BuilderUser | null;
  isLoading: boolean;
  loginWithEmail: (email: string, name?: string) => Promise<boolean>;
  loginWithProvider: (provider: 'google' | 'apple' | 'github' | 'amazon') => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = 'aws_builder_id_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate formatted initials
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Generate an authentic AWS Builder ID string
function generateBuilderId(): string {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GCET-${randomChars}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BuilderUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore storage access error
    } finally {
      setIsLoading(false);
    }

    // Sync across browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loginWithEmail = async (email: string, customName?: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate brief network authentication latency
    await new Promise((r) => setTimeout(r, 600));

    const name = customName || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: BuilderUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      email,
      name,
      role: 'Student Cloud Builder',
      builderId: generateBuilderId(),
      initials: getInitials(name),
      provider: 'email',
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // Storage unavailable
    }
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const loginWithProvider = async (provider: 'google' | 'apple' | 'github' | 'amazon'): Promise<boolean> => {
    setIsLoading(true);
    // Simulate brief SSO provider handshake
    await new Promise((r) => setTimeout(r, 700));

    const providerDefaults = {
      google: { name: 'Student Builder', email: 'builder.gcet@gmail.com' },
      apple: { name: 'Apple Builder', email: 'student.builder@icloud.com' },
      github: { name: 'Cloud Hacker', email: 'dev.builder@github.com' },
      amazon: { name: 'AWS Builder Member', email: 'student@amazon.com' },
    };

    const target = providerDefaults[provider];
    const newUser: BuilderUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      email: target.email,
      name: target.name,
      role: 'Verified AWS Builder ID',
      builderId: generateBuilderId(),
      initials: getInitials(target.name),
      provider,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // Storage unavailable
    }
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithEmail, loginWithProvider, logout }}>
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
