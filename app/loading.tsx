import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <h2 className="text-2xl font-semibold text-slate-100 mb-2">Loading content...</h2>
      <p className="text-slate-400">Please wait while we fetch the latest data for you.</p>
    </div>
  );
}
