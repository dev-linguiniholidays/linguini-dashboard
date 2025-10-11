'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserRole, setStoredRole, getStoredRole } from '@/lib/roleUtils';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(getStoredRole());
  const { user, signOut } = useAuth();

  const handleRoleChange = (newRole: UserRole) => {
    setStoredRole(newRole);
    setCurrentRole(newRole);
    // Refresh the page to update all components
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Linguini Holidays ClientView360</h1>
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
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};