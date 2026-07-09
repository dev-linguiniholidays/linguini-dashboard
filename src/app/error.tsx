'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Intercept ChunkLoadErrors or module dynamic import errors
    const message = error.message || '';
    if (
      message.includes('ChunkLoadError') ||
      message.includes('Loading chunk') ||
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('dynamic import')
    ) {
      console.warn('Chunk load error detected in Error Boundary. Reloading page...');
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="bg-red-50 text-red-800 rounded-full p-3 mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        An error occurred while loading this page. Please try refreshing or click the button below.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Refresh Page
        </button>
        <button
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
