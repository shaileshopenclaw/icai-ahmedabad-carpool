'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password')?.toString().trim();
  let secret = process.env.ADMIN_SECRET || 'icai_ahmedabad_admin_2024';
  
  // Clean up secret in case it has quotes from .env file
  secret = secret.replace(/^["']|["']$/g, '').trim();

  if (password === secret) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    redirect('/admin/events');
  } else {
    // Basic fallback: just redirect to admin with an error query param
    redirect('/admin?error=invalid');
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin');
}

export async function checkAdmin() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  if (!auth || auth.value !== 'true') {
    redirect('/admin');
  }
}
