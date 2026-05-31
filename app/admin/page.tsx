import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (profile?.role === 'student') redirect('/dashboard')

  // Get all students (children of this parent, or all for admin)
  const query = profile?.role === 'admin'
    ? supabase.from('users').select('*').eq('role', 'student')
    : supabase.from('users').select('*').eq('parent_id', user.id)

  const { data: students } = await query

  // Get recent submissions
  const { data: recentSubmissions } = await supabase
    .from('submissions')
    .select('*, homework(*)')
    .is('reviewed_by', null)
    .order('submitted_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {profile?.role === 'admin' ? 'Admin Dashboard' : 'Parent Dashboard'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">Monitor progress and review homework</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Students */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              {profile?.role === 'admin' ? 'All Students' : 'My Children'}
            </h2>
            {students && students.length > 0 ? (
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-sm">
                        {s.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{s.display_name}</div>
                        <div className="text-xs text-gray-400">{s.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
                {profile?.role === 'parent'
                  ? 'No children linked yet. Students need to set you as their parent during registration.'
                  : 'No students enrolled yet.'}
              </div>
            )}
          </div>

          {/* Pending homework */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Homework to Review</h2>
              <Link href="/admin/submissions" className="text-xs text-blue-600 hover:underline">
                View all →
              </Link>
            </div>
            {recentSubmissions && recentSubmissions.length > 0 ? (
              <div className="space-y-2">
                {recentSubmissions.map(sub => (
                  <Link
                    key={sub.id}
                    href={`/admin/submissions/${sub.id}`}
                    className="block bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-300 transition"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {sub.homework?.title ?? 'Homework submission'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                    </div>
                    {sub.content && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.content}</div>
                    )}
                    <span className="mt-2 inline-block text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                      Awaiting review
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
                🎉 All caught up! No pending homework reviews.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
