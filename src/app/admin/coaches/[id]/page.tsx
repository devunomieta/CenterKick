import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CoachProfileClient from '@/components/admin/coaches/CoachProfileClient';

export default async function CoachProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch Coach Data
  const { data: coach, error } = await supabase
    .from('coaches')
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

  if (error || !coach) {
    notFound();
  }

  // Fetch Agents for the dropdown
  const { data: agents } = await supabase
    .from('agents')
    .select('id, first_name, last_name');

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <CoachProfileClient coach={coach} agents={agents || []} />
    </div>
  );
}
