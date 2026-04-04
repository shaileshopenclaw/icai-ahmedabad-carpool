'use server';

import { supabase } from '@/lib/supabase';
import { checkAdmin } from '../actions';
import { revalidatePath } from 'next/cache';

export async function addParticipant(data: any) {
  await checkAdmin();
  const { data: newParticipant, error } = await supabase
    .from('participants')
    .insert([data])
    .select()
    .single();
    
  if (error) throw error;
  revalidatePath('/admin/participants');
  return newParticipant;
}

export async function updateParticipant(id: string, data: any) {
  await checkAdmin();
  const { error } = await supabase.from('participants').update(data).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/participants');
}

export async function deleteParticipant(id: string) {
  await checkAdmin();
  const { error } = await supabase.from('participants').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/participants');
}

export async function uploadParticipantsBulk(eventId: string, participants: any[]) {
  await checkAdmin();
  const data = participants.map(p => ({ ...p, event_id: eventId }));
  const { error } = await supabase.from('participants').insert(data);
  if (error) throw error;
  revalidatePath('/admin/participants');
}
