import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { loginUserApi, registerUserApi, forgotPasswordApi, resetPasswordApi } from '../services/api';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  loginWithCredentials: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  registerWithCredentials: (userData: Record<string, string>) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
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

const NEW_CUSTOMER: User = {
  id: 'u_customer',
  name: 'Customer',
  phone: '',
  email: '',
  role: 'customer',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  village: 'Mohanlalganj',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString().split('T')[0]
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
    return saved ? JSON.parse(saved) : NEW_CUSTOMER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('sakhisilai_access_token'));
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(currentUser.role || 'customer');
  const [pendingRedirectTab, setPendingRedirectTab] = useState<string | null>(null);
  const [pendingTailorId, setPendingTailorId] = useState<string | null>(null);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sakhisilai_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('sakhisilai_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [currentUser, isLoggedIn]);

  useEffect(() => {
    const handleExpiredSession = () => {
      localStorage.removeItem('sakhisilai_access_token');
      setIsLoggedIn(false);
    };
    window.addEventListener('sakhisilai-auth-expired', handleExpiredSession);
    return () => window.removeEventListener('sakhisilai-auth-expired', handleExpiredSession);
  }, []);

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setIsLoggedIn(true);
    if (role === 'customer') {
      setCurrentUser(prev => (prev && prev.name && prev.name !== 'Guest User' ? prev : NEW_CUSTOMER));
    } else if (role === 'tailor') {
      setCurrentUser(DEFAULT_TAILOR_USER);
    } else {
      setCurrentUser(DEFAULT_ADMIN);
    }
  };

  const loginWithCredentials = async (emailOrPhone: string, password?: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanInput = (emailOrPhone || '').trim().toLowerCase();

    // 1. Try Backend API Verification
    const res = await loginUserApi(cleanInput, password);
    if (res && res.success && res.data && res.token) {
      const userRecord: User = res.data;
      localStorage.setItem('sakhisilai_access_token', res.token);
      setIsLoggedIn(true);
      setCurrentUser(userRecord);
      setCurrentRoleState(userRecord.role);
      return { success: true, role: userRecord.role };
    }

    return { success: false, message: res?.message || 'Invalid email or password.' };
  };

  const registerWithCredentials = async (userData: Record<string, string>) => {
    const res = await registerUserApi(userData);
    if (!res?.success || !res.data || !res.token) {
      return { success: false, message: res?.message || 'Registration could not be completed.' };
    }
    localStorage.setItem('sakhisilai_access_token', res.token);
    setCurrentUser(res.data as User);
    setCurrentRoleState(res.data.role as UserRole);
    setIsLoggedIn(true);
    return { success: true, role: res.data.role as UserRole };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    const res = await forgotPasswordApi(email);
    if (res && res.success) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res?.message || 'Email address not found in database.' };
  };

  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    const res = await resetPasswordApi(email, newPassword);
    if (res && res.success) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res?.message || 'Failed to update password.' };
  };

  const loginAsCustomer = () => {
    setIsLoggedIn(true);
    setCurrentRoleState('customer');
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
    localStorage.removeItem('sakhisilai_access_token');
    localStorage.setItem('sakhisilai_is_logged_in', 'false');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('sakhisilai_access_token');
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
        loginWithCredentials,
        registerWithCredentials,
        forgotPassword,
        resetPassword,
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
