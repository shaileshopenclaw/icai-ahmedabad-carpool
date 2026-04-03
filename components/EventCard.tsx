import Link from 'next/link';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

type Event = {
  id: string;
  title: string;
  event_date: string;
  event_time?: string;
  venue_name: string;
  event_type: string;
  participants_count?: number; // Aggregated field
};

export default function EventCard({ event }: { event: Event }) {
  const formattedDate = format(new Date(event.event_date), 'dd MMM yyyy');
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50 capitalize">
          {event.event_type}
        </span>
        
        {event.participants_count !== undefined && (
          <div className="flex items-center gap-1 text-sm text-emerald-400 font-medium bg-emerald-900/20 px-2 py-1 rounded-md">
            <Users className="w-3.5 h-3.5" />
            {event.participants_count} Carpooling
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors">
        {event.title}
      </h3>
      
      <div className="space-y-2 mt-auto text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 shrink-0 text-slate-500" />
          <span>{formattedDate}</span>
        </div>
        {event.event_time && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-slate-500" />
            <span>{event.event_time.substring(0, 5)}</span> 
          </div>
        )}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
          <span className="line-clamp-2">{event.venue_name}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
        <Link 
          href={`/events/${event.id}`}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-center py-2 px-4 rounded-lg font-medium text-sm transition-colors border border-white/10"
        >
          View Riders
        </Link>
        <Link 
          href={`/events/${event.id}/register`}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-center py-2 px-4 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Offer/Need Ride
        </Link>
      </div>
    </div>
  );
}
