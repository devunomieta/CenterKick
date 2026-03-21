import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AgentProfileClient from '../../../../components/admin/agents/AgentProfileClient';

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch Agent Data
  const { data: agent, error } = await supabase
    .from('agents')
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
    .eq('id', id)
    .single();

  if (error || !agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AgentProfileClient agent={agent} />
    </div>
  );
}
