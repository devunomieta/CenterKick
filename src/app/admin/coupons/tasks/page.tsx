import React from 'react';
import { getAdminEarningTasks, getAdminTaskSubmissions } from './actions';
import AdminTasksClient from '@/components/admin/coupons/AdminTasksClient';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = {
  title: 'Earn Membership Task Verification | CenterKick Admin',
};

export default async function AdminCouponsTasksPage() {
  const supabaseAdmin = createAdminClient();
  const [{ tasks }, { submissions }, { data: paymentContent }] = await Promise.all([
    getAdminEarningTasks(),
    getAdminTaskSubmissions(),
    supabaseAdmin
      .from('site_content')
      .select('content')
      .eq('page', 'settings')
      .eq('section', 'payment')
      .single(),
  ]);

  const paymentData = paymentContent?.content || {};
  const systemPlans = paymentData.plans || {};
  const globalDuration = paymentData.globalDuration;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      <AdminTasksClient
        tasks={tasks}
        submissions={submissions}
        systemPlans={systemPlans}
        globalDuration={globalDuration}
      />
    </div>
  );
}
