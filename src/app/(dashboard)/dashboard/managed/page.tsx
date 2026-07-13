import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ManagedAccountsClient from './ManagedAccountsClient';

export default async function ManagedAccountsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userRecord?.role || profile?.role;

  console.log('ManagedAccountsPage: Fetched profile:', !!profile);
  console.log('ManagedAccountsPage: User Role:', role);
  
  if (!profile || (role !== 'agent' && role !== 'organization')) {
    console.log('ManagedAccountsPage: Redirecting to dashboard. Condition failed.');
    redirect('/dashboard');
  }

  // Ensure role is passed to client
  const fullProfile = { ...profile, role };

  return <ManagedAccountsClient userProfile={fullProfile} />;
}
