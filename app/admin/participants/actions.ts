'use server';

import { supabase } from '@/lib/supabase';
import { checkAdmin } from '../actions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  area_name: z.string().min(1, "Area is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  is_offering_ride: z.boolean().default(false),
  event_id: z.string().uuid("Invalid event ID"),
  whatsapp_number: z.string().optional().or(z.literal('')),
  full_address: z.string().optional().or(z.literal('')),
  linkedin_url: z.string().optional().or(z.literal('')),
  seats_available: z.number().default(0),
});

export async function addParticipant(data: any) {
  await checkAdmin();
  try {
    const validatedData = participantSchema.parse(data);
    const { data: newParticipant, error } = await supabase
      .from('participants')
      .insert([validatedData])
      .select()
      .single();
      
    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }
    revalidatePath('/admin/participants');
    return newParticipant;
  } catch (err) {
    console.error('Validation or Insert Error:', err);
    throw err;
  }
}

export async function updateParticipant(id: string, data: any) {
  await checkAdmin();
  try {
    const validatedData = participantSchema.partial().parse(data);
    const { error } = await supabase.from('participants').update(validatedData).eq('id', id);
    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }
    revalidatePath('/admin/participants');
  } catch (err) {
    console.error('Validation or Update Error:', err);
    throw err;
  }
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
