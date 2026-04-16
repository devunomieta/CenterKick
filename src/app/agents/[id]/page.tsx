import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AgentDetailsClient from './AgentDetailsClient';

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;
   const supabase = await createClient();

   // Fetch agent profile
   const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, users!inner(role)')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    // Fetch managed clients (Players & Coaches)
    const { data: managedClients } = await supabase
       .from('profiles')
       .select('*, users!inner(role)')
       .eq('agent_id', profile?.user_id || '');

   if (error || !profile) {
      notFound();
   }

   // Only show active profiles to public, or let admins/owners see pending
   const { data: { user } } = await supabase.auth.getUser();
   const isOwner = user?.id === profile.user_id;

   if (profile.status !== 'active' && !isOwner) {
      const { data: currentUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id || '')
        .single();
      
      if (currentUser?.role !== 'superadmin') {
         notFound();
      }
   }

   return <AgentDetailsClient profile={profile} managedClients={managedClients || []} />;
}
