'use client';

import { ReactNode, useEffect, useState } from 'react';
import { UserRole, getStoredRole } from '@/lib/roleUtils';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUserRole(getStoredRole());
  }, []);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RoleToggleProps {
  onRoleChange: (role: UserRole) => void;
}

export const RoleToggle = ({ onRoleChange }: RoleToggleProps) => {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const role = getStoredRole();
    setUserRole(role);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    onRoleChange(role);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Role:</span>
      <select
        value={userRole}
        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
};
