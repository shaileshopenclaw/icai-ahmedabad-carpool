import { checkAdmin, logoutAdmin } from '../actions';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Plus, Trash2, LogOut } from 'lucide-react';

export default async function AdminEventsPage() {
  await checkAdmin();

  // Fetch all events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  async function createEvent(formData: FormData) {
    'use server';
    await checkAdmin();
    
    await supabase.from('events').insert([{
      title: formData.get('title') as string,
      event_date: formData.get('event_date') as string,
      event_time: formData.get('event_time') as string,
      venue_name: formData.get('venue_name') as string,
      venue_address: formData.get('venue_address') as string,
      event_type: formData.get('event_type') as string,
      description: formData.get('description') as string,
    }]);

    revalidatePath('/admin/events');
    revalidatePath('/events');
  }

  async function deleteEvent(formData: FormData) {
    'use server';
    await checkAdmin();
    const id = formData.get('id') as string;
    await supabase.from('events').delete().eq('id', id);
    revalidatePath('/admin/events');
    revalidatePath('/events');
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <form action={logoutAdmin}>
             <button type="submit" className="text-slate-400 hover:text-red-400 flex items-center gap-2 text-sm">
                <LogOut className="w-4 h-4" /> Logout
             </button>
          </form>
       </div>

       <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <Plus className="w-5 h-5 text-blue-500" /> Add New Event
                </h2>
                <form action={createEvent} className="space-y-4">
                   <input required name="title" placeholder="Event Title" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"/>
                   <input required type="date" name="event_date" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none text-white"/>
                   <input required type="time" name="event_time" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none text-white"/>
                   <select name="event_type" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none text-white">
                      <option value="seminar">Seminar</option>
                      <option value="conference">Conference</option>
                      <option value="training">Training</option>
                      <option value="meeting">Meeting</option>
                   </select>
                   <input required name="venue_name" placeholder="Venue Name (e.g. ICAI Bhawan)" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"/>
                   <input name="venue_address" placeholder="Full Venue Address" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"/>
                   <textarea name="description" placeholder="Short description..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none h-20 resize-none"/>
                   <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded transition-colors text-sm">Create Event</button>
                </form>
             </div>
          </div>

          <div className="md:col-span-2 space-y-4">
             {events?.map(event => (
                <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex justify-between items-center group">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-medium tracking-wider">{event.event_type}</span>
                         <span className="text-sm text-slate-400">{event.event_date}</span>
                      </div>
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{event.title}</h3>
                      <p className="text-sm text-slate-500">{event.venue_name}</p>
                   </div>
                   <form action={deleteEvent}>
                      <input type="hidden" name="id" value={event.id} />
                      <button type="submit" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete Event">
                         <Trash2 className="w-5 h-5" />
                      </button>
                   </form>
                </div>
             ))}
             {events?.length === 0 && (
                 <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No events exist yet. Create one from the sidebar.
                 </div>
             )}
          </div>
       </div>
    </div>
  );
}
