'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-900">Linguini Holidays ClientView360</h1>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Manage your travel customers</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">{user?.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};