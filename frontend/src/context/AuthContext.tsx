import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, TailorProfile } from '../types';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  loginAsCustomer: () => void;
  loginAsTailor: (tailorId?: string) => void;
  loginAsAdmin: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  activeTailorProfile?: TailorProfile;
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

  const [currentRole, setCurrentRoleState] = useState<UserRole>(currentUser.role || 'customer');

  useEffect(() => {
    localStorage.setItem('sakhisilai_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'customer') {
      setCurrentUser(DEFAULT_CUSTOMER);
    } else if (role === 'tailor') {
      setCurrentUser(DEFAULT_TAILOR_USER);
    } else {
      setCurrentUser(DEFAULT_ADMIN);
    }
  };

  const loginAsCustomer = () => setRole('customer');
  const loginAsTailor = () => setRole('tailor');
  const loginAsAdmin = () => setRole('admin');

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        setRole,
        loginAsCustomer,
        loginAsTailor,
        loginAsAdmin,
        updateUserProfile
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
