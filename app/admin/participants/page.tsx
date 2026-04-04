import { checkAdmin } from '../actions';
import { supabase } from '@/lib/supabase';
import ParticipantManager from './ParticipantManager';

export default async function ParticipantsPage() {
  await checkAdmin();

  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .order('event_date', { ascending: false });

  const { data: participants } = await supabase
    .from('participants')
    .select('*');

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Manage Participants</h1>
      <ParticipantManager events={events || []} initialParticipants={participants || []} />
    </div>
  );
}
