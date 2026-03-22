import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AgentProfileClient from '../../../../components/admin/agents/AgentProfileClient';

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch Agent Data
  // Support both ID and Slug lookups
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let query = supabase
    .from('profiles')
    .select(`
      *,
      users:user_id (
        email,
        role,
        subscriptions (
          current_period_end,
          status
        )
      )
    `)
    .eq('role', 'agent');

  if (isUUID) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq('slug', id);
  }

  const { data: agent, error } = await query.single();

  if (error || !agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AgentProfileClient agent={agent} />
    </div>
  );
}
