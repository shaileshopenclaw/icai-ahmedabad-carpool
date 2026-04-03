import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowLeft, Info, Plus } from 'lucide-react';
import { format } from 'date-fns';
import ParticipantMapWrapper from '@/components/ParticipantMapWrapper';
import ParticipantCard, { Participant } from '@/components/ParticipantCard';

export const revalidate = 0; // Don't cache this page so carpoolers are always live

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  // Try UUID parsing
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
  if (!isUuid) return notFound();

  // Fetch Event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (eventError || !event) return notFound();

  // Fetch Participants for this event
  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .eq('event_id', params.id)
    .order('pincode', { ascending: true }) // Group by pincode implicitly
    .order('created_at', { ascending: false });

  const validParticipants = (participants || []) as Participant[];

  const formattedDate = format(new Date(event.event_date), 'EEEE, dd MMMM yyyy');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/events" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50 capitalize mb-4">
              {event.event_type}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{event.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
                <span>{formattedDate}</span>
              </div>
              {event.event_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                  <span>{event.event_time.substring(0, 5)}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-slate-300 max-w-2xl">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium block text-white mb-1">{event.venue_name}</span>
                <span className="text-sm">{event.venue_address}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[200px]">
            <div className="text-4xl font-bold text-white mb-1">{validParticipants.length}</div>
            <div className="text-sm text-slate-400">Total Participants<br/>Registered</div>
            <Link 
              href={`/events/${event.id}/register`}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Join Carpool
            </Link>
          </div>
        </div>

        {event.description && (
          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Event Details</h3>
            <p className="text-slate-300 leading-relaxed max-w-4xl">{event.description}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Riders & Participants</h2>
            <div className="text-sm text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
              Sorted by Pincode
            </div>
          </div>

          {validParticipants.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
              <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No one has registered yet</h3>
              <p className="text-slate-400 text-sm mb-6">Be the first to offer or request a ride for this event!</p>
              <Link 
                href={`/events/${event.id}/register`}
                className="bg-white/10 hover:bg-white/15 text-white py-2 px-6 rounded-lg font-medium text-sm transition-colors border border-white/10 inline-block"
              >
                Register Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validParticipants.map(participant => (
                <ParticipantCard key={participant.id} participant={participant} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Live Map</h2>
          <div className="sticky top-24">
            <ParticipantMapWrapper participants={validParticipants} />
            <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <p>Participants are clustered by their exact provided location or pincode center. Green pins indicate participants offering a ride.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
