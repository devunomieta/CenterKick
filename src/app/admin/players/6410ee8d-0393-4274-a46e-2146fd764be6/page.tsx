import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PlayerProfileClient from '@/components/admin/players/PlayerProfileClient';

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch complete player profile with linked user data
  const { data: player, error } = await supabase
    .from('profiles')
    .select('*, users!profiles_user_id_fkey(email, role, subscriptions(current_period_end, status))')
    .eq('id', id)
    .single();

  if (error || !player) {
    return notFound();
  }

  // Fetch all agents for selection in editor
  const { data: agents } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, agency_name, email')
    .eq('role', 'agent');

  return (
    <PlayerProfileClient 
      player={player} 
      agents={agents || []} 
    />
  );
}
