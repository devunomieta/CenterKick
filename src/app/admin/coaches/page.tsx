import { redirect } from 'next/navigation';

export default function CoachesRedirect() {
  redirect('/admin/users?role=coach');
}
