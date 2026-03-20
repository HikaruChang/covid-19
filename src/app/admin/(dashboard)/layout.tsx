import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import AdminShell from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');
  return <AdminShell>{children}</AdminShell>;
}
