'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole, setStoredRole, getStoredRole } from '@/lib/roleUtils';

export const Header = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(getStoredRole());

  const handleRoleChange = (newRole: UserRole) => {
    setStoredRole(newRole);
    setCurrentRole(newRole);
    // Refresh the page to update all components
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">CRM Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your travel customers</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Role:</span>
            <Select value={currentRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};