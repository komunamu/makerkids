import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { CURRICULUM } from '@/lib/curriculum-data'

const TOTAL_LESSONS = CURRICULUM.reduce((sum, w) => sum + w.lessons.length, 0)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (profile?.role === 'student') redirect('/dashboard')

  const { data: students } = await supabase
    .from('users')
    .select('*, lesson_progress(status), quiz_attempts(score, passed)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const { data: pendingSubmissions } = await supabase
    .from('submissions')
    .select('id')
    .is('reviewed_by', null)

  const totalStudents = students?.length ?? 0
  const avgCompletion = totalStudents
    ? Math.round(students!.reduce((sum, s) => {
        const done = (s.lesson_progress ?? []).filter((p: any) => p.status === 'complete').length
        return sum + (done / TOTAL_LESSONS) * 100
      }, 0) / totalStudents)
    : 0
  const pendingCount = pendingSubmissions?.length ?? 0
  const allAttempts = students?.flatMap(s => s.quiz_attempts ?? []) ?? []
  const quizPassRate = allAttempts.length
    ? Math.round(allAttempts.filter((a: any) => a.passed).length / allAttempts.length * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track student progress and manage users</p>
          </div>
          <Link
            href="/admin/users"
            className="text-sm bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition font-medium text-gray-700"
          >
            Manage Users →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Students', value: totalStudents },
            { label: 'Avg Completion', value: `${avgCompletion}%` },
            { label: 'Pending Reviews', value: pendingCount },
            { label: 'Quiz Pass Rate', value: allAttempts.length ? `${quizPassRate}%` : '—' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Student table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Students</h2>
            <span className="text-xs text-gray-400">{totalStudents} enrolled</span>
          </div>
          {students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-6 py-3">Student</th>
                    <th className="text-left px-6 py-3">Progress</th>
                    <th className="text-left px-6 py-3">Lessons</th>
                    <th className="text-left px-6 py-3">Avg Quiz Score</th>
                    <th className="text-left px-6 py-3">Quizzes Taken</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map(s => {
                    const done = (s.lesson_progress ?? []).filter((p: any) => p.status === 'complete').length
                    const pct = Math.round((done / TOTAL_LESSONS) * 100)
                    const attempts: any[] = s.quiz_attempts ?? []
                    const avgScore = attempts.length
                      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
                      : null
                    const passed = attempts.filter(a => a.passed).length
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                              {s.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{s.display_name}</div>
                              <div className="text-xs text-gray-400">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{done} / {TOTAL_LESSONS}</td>
                        <td className="px-6 py-4">
                          {avgScore !== null ? (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${avgScore >= 75 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                              {avgScore}%
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">No attempts</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {attempts.length > 0 ? `${passed}/${attempts.length} passed` : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/students/${s.id}`}
                            className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap"
                          >
                            View details →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-gray-400">
              No students enrolled yet.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
