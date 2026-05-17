import { redirect } from 'next/navigation';

export default async function AdminProspectsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const role = (resolvedParams.role as string) || '';
  
  if (role) {
    redirect(`/admin/approvals?tab=prospects&role=${role}`);
  } else {
    redirect('/admin/approvals?tab=prospects');
  }
}
