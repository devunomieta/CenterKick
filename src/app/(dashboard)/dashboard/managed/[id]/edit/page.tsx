import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EditManagedAccountWrapper from './EditManagedAccountWrapper';

export default async function EditManagedAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userRecord?.role;

  if (role !== 'agent' && role !== 'organization' && role !== 'superadmin' && role !== 'admin' && role !== 'operations') {
    redirect('/dashboard');
  }

  // Fetch the target profile
  const { data: targetProfile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !targetProfile) {
    redirect('/dashboard/managed');
  }

  // Ensure security: the target profile must belong to the current agent or organization
  if (role !== 'superadmin' && role !== 'admin' && role !== 'operations') {
    if (role === 'agent' && targetProfile.agent_id !== user.id) {
       redirect('/dashboard/managed');
    }
    if (role === 'organization' && targetProfile.organization_id !== user.id) {
       redirect('/dashboard/managed');
    }
  }

  return <EditManagedAccountWrapper targetProfile={targetProfile} role={role || ''} />;
}
