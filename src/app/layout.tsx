'use client';

import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { PostHogProvider } from '@/components/PostHogProvider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import posthog from 'posthog-js';
import './globals.css';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture('$pageview');
      }
    } catch (error) {
      console.warn('Failed to capture pageview:', error);
    }
  }, [pathname]);

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Intercept chunk load failures via window error events (capture phase)
                window.addEventListener('error', function(event) {
                  var target = event.target;
                  if (target && (target.nodeName === 'SCRIPT' || target.nodeName === 'LINK')) {
                    var url = target.src || target.href;
                    if (url && (url.indexOf('/_next/static/') !== -1 || url.indexOf('/static/') !== -1)) {
                      console.warn('Next.js static resource failed to load, reloading page:', url);
                      window.location.reload();
                    }
                  }
                }, true);

                // 2. Intercept unhandled dynamic import rejections
                window.addEventListener('unhandledrejection', function(event) {
                  var message = event.reason && event.reason.message ? event.reason.message : '';
                  if (
                    message.indexOf('ChunkLoadError') !== -1 ||
                    message.indexOf('Loading chunk') !== -1 ||
                    message.indexOf('Failed to fetch dynamically imported module') !== -1 ||
                    message.indexOf('dynamic import') !== -1
                  ) {
                    console.warn('Dynamic import chunk load failure detected, reloading page:', message);
                    window.location.reload();
                  }
                });

                // 3. Immediately unregister any lingering service workers to avoid 304 cache issues
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister().then(function(success) {
                        if (success) {
                          console.log('Successfully unregistered lingering Service Worker');
                        }
                      });
                    }
                  }).catch(function(err) {
                    console.error('Error fetching service worker registrations:', err);
                  });
                }
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <PostHogProvider>
          <AuthProvider>
            <AppContent>{children}</AppContent>
            <Toaster />
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}