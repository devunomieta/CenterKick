import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CoachProfileClient from '@/components/admin/coaches/CoachProfileClient';

export default async function CoachProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Fetch Coach Data from profiles
  let coachQuery = supabase
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
    `);

  if (isUUID) {
    coachQuery = coachQuery.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    coachQuery = coachQuery.eq('slug', id);
  }

  const { data: coach, error } = await coachQuery.single();

  if (error || !coach) {
    return notFound();
  }

  // Fetch Agents for the dropdown (from profiles table)
  const { data: agents } = await supabase
    .from('profiles')
    .select('id, user_id, first_name, last_name, agency_name')
    .ilike('role', 'agent');

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <CoachProfileClient coach={coach} agents={agents || []} />
    </div>
  );
}
