import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, CORPORATE_USERS, Permission } from '../auth/permissions';
import { RoleType } from '../types';

interface AuthContextType {
  currentUser: UserSession;
  allCorporateUsers: UserSession[];
  switchUser: (user: UserSession) => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessRole: (role: RoleType) => boolean;
  canAccessRooftop: (rooftopId: string) => boolean;
  canAccessCluster: (clusterId: string) => boolean;
  filterRooftops: <T extends { rooftopId: string }>(rooftops: T[]) => T[];
  filterClusters: <T extends { id: string }>(clusters: T[]) => T[];
}

const STORAGE_KEY = 'good_showroom_active_user_id';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const found = CORPORATE_USERS.find((u) => u.id === savedId);
    return found || CORPORATE_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentUser.id);
  }, [currentUser]);

  const switchUser = (user: UserSession) => {
    setCurrentUser(user);
  };

  const hasPermission = (permission: Permission): boolean => {
    return currentUser.permissions.includes(permission);
  };

  const canAccessRole = (role: RoleType): boolean => {
    return currentUser.allowedRoles.includes(role);
  };

  const canAccessRooftop = (rooftopId: string): boolean => {
    if (currentUser.allowedRooftops.includes('*')) return true;
    return currentUser.allowedRooftops.includes(rooftopId);
  };

  const canAccessCluster = (clusterId: string): boolean => {
    if (currentUser.allowedClusterIds.includes('*')) return true;
    return currentUser.allowedClusterIds.includes(clusterId);
  };

  const filterRooftops = <T extends { rooftopId: string }>(rooftops: T[]): T[] => {
    if (!rooftops) return [];
    if (currentUser.allowedRooftops.includes('*')) return rooftops;
    return rooftops.filter((r) => currentUser.allowedRooftops.includes(r.rooftopId));
  };

  const filterClusters = <T extends { id: string }>(clusters: T[]): T[] => {
    if (!clusters) return [];
    if (currentUser.allowedClusterIds.includes('*')) return clusters;
    return clusters.filter((c) => currentUser.allowedClusterIds.includes(c.id));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allCorporateUsers: CORPORATE_USERS,
        switchUser,
        hasPermission,
        canAccessRole,
        canAccessRooftop,
        canAccessCluster,
        filterRooftops,
        filterClusters,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
