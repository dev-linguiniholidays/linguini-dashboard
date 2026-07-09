'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { ReactNode } from 'react';

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only',
      capture_pageview: false, // Captured manually in layout.tsx
    });
  } else {
    console.warn('PostHog key is missing. Analytics tracking will be disabled.');
  }
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  // Fallback if PostHog is not configured
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
