'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Loader2, MapPin } from 'lucide-react';
import ParticipantCard, { Participant } from '@/components/ParticipantCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<(Participant & { events: { title: string } })[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Search across area_name and pincode
      const { data, error } = await supabase
        .from('participants')
        .select('*, events(title)')
        .or(`area_name.ilike.%${query}%,pincode.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setResults(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Find Nearby Riders</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Looking for a ride? Search by your area name or Pincode to see all CA members travelling from your vicinity across all upcoming events.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl mb-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Pincode (e.g. 380015) or Area (e.g. Bopal)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Search
          </button>
        </form>
      </div>

      <div>
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
             <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
             <h3 className="text-xl font-semibold text-white mb-2">No riders found in this area</h3>
             <p className="text-slate-400">Try searching for a nearby prominent area name or adjacent pincode.</p>
          </div>
        ) : (
          hasSearched && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">
                Found {results.length} members near <span className="text-amber-500">{query}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(participant => (
                  <div key={participant.id} className="relative">
                    <div className="absolute -top-3 left-4 bg-slate-800 border border-slate-700 text-xs px-3 py-1 rounded-full z-10 text-slate-300 font-medium">
                      Event: <span className="text-white">{participant.events?.title || 'Unknown Event'}</span>
                    </div>
                    <div className="pt-2">
                      <ParticipantCard participant={participant} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
