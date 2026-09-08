import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  loginAsCustomer: () => void;
  loginAsTailor: () => void;
  loginAsAdmin: () => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  pendingRedirectTab: string | null;
  setPendingRedirectTab: (tab: string | null) => void;
  pendingTailorId: string | null;
  setPendingTailorId: (id: string | null) => void;
  redirectNotice: string | null;
  setRedirectNotice: (notice: string | null) => void;
}

const DEFAULT_CUSTOMER: User = {
  id: 'u_pria',
  name: 'Priya Singh',
  phone: '9812345678',
  email: 'priya@example.com',
  role: 'customer',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  village: 'Mohanlalganj',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  createdAt: '2025-01-10'
};

const DEFAULT_TAILOR_USER: User = {
  id: 'u_sunita',
  name: 'Sunita Devi',
  phone: '9876543210',
  email: 'sunita@sakhisilai.com',
  role: 'tailor',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  village: 'Mohanlalganj',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  createdAt: '2025-01-15',
  isVerified: true
};

const DEFAULT_ADMIN: User = {
  id: 'admin_1',
  name: 'Seema Sharma (Sakhi Admin)',
  phone: '9999900000',
  email: 'admin@sakhisilai.org',
  role: 'admin',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  village: 'Mohanlalganj',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  createdAt: '2024-01-01'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('sakhisilai_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedLoggedIn = localStorage.getItem('sakhisilai_is_logged_in');
    return savedLoggedIn === 'true';
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(currentUser.role || 'customer');
  const [pendingRedirectTab, setPendingRedirectTab] = useState<string | null>(null);
  const [pendingTailorId, setPendingTailorId] = useState<string | null>(null);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sakhisilai_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('sakhisilai_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [currentUser, isLoggedIn]);

  // Realtime Firebase Auth Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, fbUser => {
      if (fbUser) {
        setIsLoggedIn(true);
        setCurrentUser(prev => ({
          ...prev,
          id: fbUser.uid,
          phone: fbUser.phoneNumber || prev.phone,
          email: fbUser.email || prev.email,
          name: fbUser.displayName || prev.name
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setIsLoggedIn(true);
    if (role === 'customer') {
      setCurrentUser(DEFAULT_CUSTOMER);
    } else if (role === 'tailor') {
      setCurrentUser(DEFAULT_TAILOR_USER);
    } else {
      setCurrentUser(DEFAULT_ADMIN);
    }
  };

  const loginAsCustomer = () => {
    setIsLoggedIn(true);
    setRole('customer');
  };

  const loginAsTailor = () => {
    setIsLoggedIn(true);
    setRole('tailor');
  };

  const loginAsAdmin = () => {
    setIsLoggedIn(true);
    setRole('admin');
  };

  const loginAsGuest = () => {
    setIsLoggedIn(false);
    localStorage.setItem('sakhisilai_is_logged_in', 'false');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('sakhisilai_is_logged_in', 'false');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setIsLoggedIn(true);
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn,
        setRole,
        loginAsCustomer,
        loginAsTailor,
        loginAsAdmin,
        loginAsGuest,
        logout,
        updateUserProfile,
        pendingRedirectTab,
        setPendingRedirectTab,
        pendingTailorId,
        setPendingTailorId,
        redirectNotice,
        setRedirectNotice
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
