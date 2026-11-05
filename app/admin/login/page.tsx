import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Organiser sign-in</h1>
      <AdminLoginForm />
    </div>
  );
}
