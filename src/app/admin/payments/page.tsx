import { redirect } from 'next/navigation';

export default async function AdminPaymentsPage() {
  redirect('/admin/payments/transactions');
}

