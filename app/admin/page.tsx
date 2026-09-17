import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import AdminLoginForm from './AdminLoginForm';
import AdminDashboard, { AdminResultRow } from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = verifySessionToken(token);

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  let results: AdminResultRow[] = [];
  let loadError: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    results = data as AdminResultRow[];
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <h1 className="text-lg font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h1>
          <p className="text-sm text-gray-600">{loadError}</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard results={results} />;
}
