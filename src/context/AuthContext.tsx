import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => void;
  isDemoMode: boolean;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile>(dataService.getActiveUser());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setUserState(dataService.getActiveUser());
    });
    return unsubscribe;
  }, []);

  const switchRole = (newRole: UserRole) => {
    dataService.switchRole(newRole);
  };

  const loginAsDemoUser = (targetRole: UserRole) => {
    dataService.switchRole(targetRole);
  };

  const setUser = (newUser: UserProfile) => {
    dataService.setActiveUser(newUser);
  };

  const logout = () => {
    // Return to default donor demo user
    dataService.switchRole('donor');
  };

  const resetDemoData = () => {
    dataService.resetDemoData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        switchRole,
        setUser,
        loginAsDemoUser,
        logout,
        isDemoMode: true, // Clearly stated demo mode for hackathon judging
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

