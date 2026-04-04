'use server';

import { supabase } from '@/lib/supabase';
import { checkAdmin } from '../actions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  area: z.string().min(1, "Area is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  is_offering_ride: z.boolean().default(false),
  event_id: z.string().uuid("Invalid event ID"),
});

export async function addParticipant(data: any) {
  await checkAdmin();
  const validatedData = participantSchema.parse(data);
  const { data: newParticipant, error } = await supabase
    .from('participants')
    .insert([validatedData])
    .select()
    .single();
    
  if (error) throw error;
  revalidatePath('/admin/participants');
  return newParticipant;
}

export async function updateParticipant(id: string, data: any) {
  await checkAdmin();
  const validatedData = participantSchema.partial().parse(data);
  const { error } = await supabase.from('participants').update(validatedData).eq('id', id);
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
