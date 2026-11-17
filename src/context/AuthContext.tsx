import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setStoredToken } from '../lib/api';

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'moderator' | 'admin';
  title: string;
  organization: string;
  location: string;
  bio: string;
  skills: string[];
  avatarInitials: string;
  followers: number;
  following: number;
}

interface AuthContextValue {
  user: MemberUser | null;
  ready: boolean;
  savedIds: string[];
  signIn: (email: string, password: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    title?: string;
    organization?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (payload: Partial<MemberUser>) => Promise<void>;
  toggleSave: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [ready, setReady] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const loadSession = useCallback(async () => {
    try {
      const res = await api.get<{ user: MemberUser | null }>('/auth/me');
      setUser(res.user);
      const saved = await api.get<{ ids: string[] }>('/saved').catch(() => ({ ids: [] }));
      setSavedIds(saved.ids || []);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signIn = async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; user: MemberUser }>('/auth/login', {
      email,
      password,
    });
    setStoredToken(res.accessToken);
    setUser(res.user);
    const saved = await api.get<{ ids: string[] }>('/saved').catch(() => ({ ids: [] }));
    setSavedIds(saved.ids || []);
  };

  const signInDemo = async () => {
    const res = await api.post<{ accessToken: string; user: MemberUser }>('/auth/demo');
    setStoredToken(res.accessToken);
    setUser(res.user);
    const saved = await api.get<{ ids: string[] }>('/saved').catch(() => ({ ids: [] }));
    setSavedIds(saved.ids || []);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    title?: string;
    organization?: string;
  }) => {
    const res = await api.post<{ accessToken: string; user: MemberUser }>('/auth/register', payload);
    setStoredToken(res.accessToken);
    setUser(res.user);
  };

  const signOut = async () => {
    await api.post('/auth/logout').catch(() => {});
    setStoredToken('');
    setUser(null);
  };

  const updateProfile = async (payload: Partial<MemberUser>) => {
    const res = await api.patch<{ user: MemberUser }>('/auth/profile', payload);
    setUser(res.user);
  };

  const toggleSave = async (id: string) => {
    const res = await api.post<{ ids: string[] }>('/saved/toggle', { id });
    setSavedIds(res.ids || []);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        savedIds,
        signIn,
        signInDemo,
        register,
        signOut,
        updateProfile,
        toggleSave,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
