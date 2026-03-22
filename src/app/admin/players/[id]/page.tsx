import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PlayerProfileClient from '@/components/admin/players/PlayerProfileClient';

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  // Fetch complete player profile with linked user data
  let playerQuery = supabase
    .from('profiles')
    .select('*, users!profiles_user_id_fkey(email, role, subscriptions(current_period_end, status))');

  if (isUUID) {
    playerQuery = playerQuery.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    playerQuery = playerQuery.eq('slug', id);
  }

  const { data: player, error: playerError } = await playerQuery.single();

  if (playerError || !player) {
    return notFound();
  }

  // Fetch all agents
  const { data: agents } = await supabase
    .from('profiles')
    .select('id, user_id, first_name, last_name, agency_name, email')
    .eq('role', 'agent');

  return (
    <div className="min-h-screen bg-gray-50/30">
      <PlayerProfileClient 
        player={player} 
        agents={agents || []} 
      />
    </div>
  );
}
