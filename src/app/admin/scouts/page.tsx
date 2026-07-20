import { redirect } from 'next/navigation';

export default function ScoutsRedirect() {
  redirect('/admin/users?role=scout');
}
