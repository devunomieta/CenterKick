'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTournament(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('tournaments')
    .insert([{
      name,
      slug,
      type,
      description,
      start_date: start_date || null,
      end_date: end_date || null,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating tournament:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/tournaments');
  return { success: true, data };
}

export async function deleteTournament(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/tournaments');
  return { success: true };
}
