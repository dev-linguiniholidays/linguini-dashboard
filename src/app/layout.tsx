'use client';

import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { usePathname } from 'next/navigation';
import './globals.css';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
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