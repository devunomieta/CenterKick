import { createClient } from '@/lib/supabase/server';
import { SubscriptionsClient } from '@/components/admin/payments/SubscriptionsClient';
import { redirect } from 'next/navigation';

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin', 'finance'].includes(userRecord?.role)) {
    redirect('/admin');
  }

  // Fetch current payment settings from site_content
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', 'settings')
    .eq('section', 'payment')
    .single();

  return (
    <SubscriptionsClient initialSettings={content?.content || {}} />
  );
}
