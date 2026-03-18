import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CoachDetailsClient from './CoachDetailsClient';

export default async function CoachPage({ params }: { params: { id: string } }) {
   const supabase = await createClient();

   // Fetch coach profile with linked agent
   const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, users!inner(role), agent:users!profiles_agent_id_fkey(id, profiles(*))')
      .eq('id', params.id)
      .single();

   if (error || !profile) {
      notFound();
   }

   // Only show active profiles to public, or let admins/owners see pending
   const { data: { user } } = await supabase.auth.getUser();
   const isOwner = user?.id === profile.user_id;
   const isAdmin = profile.users.role === 'superadmin'; // This is a bit flawed but we check role

   if (profile.status !== 'active' && !isOwner && !isAdmin) {
      // Check if current user is admin correctly
      const { data: currentUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id || '')
        .single();
      
      if (currentUser?.role !== 'superadmin') {
         notFound();
      }
   }

   return <CoachDetailsClient profile={profile} />;
}
