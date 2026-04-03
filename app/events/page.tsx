import { supabase } from '@/lib/supabase';
import EventCard from '@/components/EventCard';
import { CalendarDays } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function EventsPage() {
  // Fetch active upcoming events, joined with participant count
  // Since we haven't set up complex DB functions, we'll fetch events and then a quick rough count or do it in one query if possible.
  // For simplicity in a basic setup, we just fetch events first.
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true });

  // In a production app, you might want to fetch participant counts in a single RPC call or joined query.
  // We'll mock the counts if needed, but let's try to get them via a second query or assume it's attached.
  const { data: counts } = await supabase
    .from('participants')
    .select('event_id');
    
  const countMap: Record<string, number> = {};
  if (counts) {
    counts.forEach(c => {
      countMap[c.event_id] = (countMap[c.event_id] || 0) + 1;
    });
  }

  const enhancedEvents = events?.map(e => ({
    ...e,
    participants_count: countMap[e.id] || 0
  })) || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Upcoming Events</h1>
          <p className="text-slate-400 text-lg">Find your event and connect with nearby CA members to carpool.</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          Failed to load events. Please try again later.
        </div>
      ) : enhancedEvents.length === 0 ? (
        <div className="text-center py-24 bg-slate-900 border border-white/5 rounded-2xl">
          <CalendarDays className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Events</h3>
          <p className="text-slate-400">Please check back later for newly scheduled seminars and conferences.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedEvents.map(event => (
            <EventCard key={event.id} event={event as any} />
          ))}
        </div>
      )}
    </div>
  );
}
