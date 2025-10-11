'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, User, Shield } from 'lucide-react';
import { getCurrentUser } from '@/lib/roleUtils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const currentUser = getCurrentUser();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">LinguiniHolidays</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              {currentUser.role === 'admin' ? (
                <Shield className="h-4 w-4 text-blue-600" />
              ) : (
                <User className="h-4 w-4 text-blue-600" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};