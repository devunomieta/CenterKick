import React from 'react';
import { getAdminEarningTasks, getAdminTaskSubmissions } from './actions';
import AdminTasksClient from '@/components/admin/coupons/AdminTasksClient';

export const metadata = {
  title: 'Earn Membership Task Verification | CenterKick Admin',
};

export default async function AdminCouponsTasksPage() {
  const [{ tasks }, { submissions }] = await Promise.all([
    getAdminEarningTasks(),
    getAdminTaskSubmissions(),
  ]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      <AdminTasksClient tasks={tasks} submissions={submissions} />
    </div>
  );
}
