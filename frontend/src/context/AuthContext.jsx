import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'gawa_admin_user';

const HARDCODED_CREDENTIALS = {
  'miguel.santos@gawa.ph': {
    password: 'admin123',
    user: { id: 'user-016', name: 'Miguel Santos', email: 'miguel.santos@gawa.ph', role: 'admin', avatar: null },
  },
  'angela.cruz@gawa.ph': {
    password: 'support123',
    user: { id: 'user-017', name: 'Angela Cruz', email: 'angela.cruz@gawa.ph', role: 'customer_support', avatar: null },
  },
};

function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, isAuthenticated]);

  const login = useCallback((email, password) => {
    const entry = HARDCODED_CREDENTIALS[email.toLowerCase().trim()];
    if (!entry || entry.password !== password) return false;
    setUser(entry.user);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
