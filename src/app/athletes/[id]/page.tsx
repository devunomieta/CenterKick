import { AthleteDetailsClient } from '@/components/athletes/AthleteDetailsClient';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface AthletePageProps {
  params: Promise<{ id: string }>;
}

export default async function AthleteDetailsPage({ params }: AthletePageProps) {
   const { id } = await params;
   const supabase = await createClient();

   // Fetch professional athlete profile with linked agent
   const { data: athlete, error } = await supabase
      .from('profiles')
      .select('*, agent:users!profiles_agent_id_fkey(id, profiles(*))')
      .eq('id', id)
      .single();

   // If not found or restricted (optional: check status)
   if (error || !athlete) {
      return notFound();
   }

   // If suspended, don't show to public (unless admin, but for now simple)
   if (athlete.status === 'suspended' || athlete.status === 'rejected') {
      return notFound();
   }

   return <AthleteDetailsClient athlete={athlete} />;
}
