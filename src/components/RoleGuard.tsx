'use client';

import { ReactNode } from 'react';
import { UserRole } from '@/lib/roleUtils';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  // For demo purposes, we'll use localStorage directly
  // In a real app, this would come from a context or auth state
  const getCurrentRole = (): UserRole => {
    if (typeof window === 'undefined') return 'user';
    const stored = localStorage.getItem('linguini-crm-user-role');
    return (stored as UserRole) || 'user';
  };

  const currentRole = getCurrentRole();
  const hasPermission = allowedRoles.includes(currentRole);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};