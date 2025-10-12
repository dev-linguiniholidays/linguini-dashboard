'use client';

import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './globals.css';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}