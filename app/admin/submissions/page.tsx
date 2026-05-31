import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default async function SubmissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (profile?.role === 'student') redirect('/dashboard')

  const { data: pending } = await supabase
    .from('submissions')
    .select('*, homework(*), users(display_name, email)')
    .is('reviewed_by', null)
    .order('submitted_at', { ascending: false })

  const { data: reviewed } = await supabase
    .from('submissions')
    .select('*, homework(*), users(display_name, email)')
    .not('reviewed_by', 'is', null)
    .order('reviewed_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">← Admin</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">Homework Submissions</h1>
        </div>

        {/* Pending */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Needs Review</h2>
            {pending && pending.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </div>
          {pending && pending.length > 0 ? (
            <div className="space-y-2">
              {pending.map(sub => (
                <Link
                  key={sub.id}
                  href={`/admin/submissions/${sub.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-300 transition"
                >
                  <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700 text-sm flex-shrink-0">
                    {(sub.users as any)?.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-800">{sub.homework?.title ?? 'Homework'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {(sub.users as any)?.display_name} · {new Date(sub.submitted_at).toLocaleDateString()}
                    </div>
                    {sub.content && (
                      <div className="text-xs text-gray-500 mt-1 truncate">{sub.content}</div>
                    )}
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-medium flex-shrink-0">
                    Review →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
              🎉 All caught up! No submissions waiting.
            </div>
          )}
        </section>

        {/* Reviewed */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recently Reviewed</h2>
          {reviewed && reviewed.length > 0 ? (
            <div className="space-y-2">
              {reviewed.map(sub => (
                <Link
                  key={sub.id}
                  href={`/admin/submissions/${sub.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-sm flex-shrink-0">
                    {(sub.users as any)?.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-800">{sub.homework?.title ?? 'Homework'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {(sub.users as any)?.display_name} · Reviewed {new Date(sub.reviewed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-700 flex-shrink-0">
                    {sub.score}/{sub.homework?.max_score ?? 10}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center text-sm text-gray-400">
              No reviewed submissions yet.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
