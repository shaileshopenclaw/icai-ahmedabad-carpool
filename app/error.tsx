'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6 text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8">
        We encountered an unexpected error. Our team has been notified. 
        In the meantime, you can try refreshing the page.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
