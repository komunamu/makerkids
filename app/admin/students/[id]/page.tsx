import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

const WEEK_TITLES = [
  'Welcome to 3D Printing', 'TinkerCAD Basics', 'Measurements & Precision',
  'Keychains & Custom Tags', 'STL Files & Cura Slicing', 'Multi-Part Designs',
  'Product Design Challenge', 'Final Capstone Project',
]

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (profile?.role === 'student') redirect('/dashboard')

  const { data: student } = await supabase.from('users').select('*').eq('id', id).single()
  if (!student) redirect('/admin')

  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id, status, completed_at')
    .eq('user_id', id).eq('status', 'complete')

  const { data: submissions } = await supabase
    .from('submissions').select('*, homework(title, week_id, max_score)')
    .eq('user_id', id).order('submitted_at', { ascending: false })

  const { data: achievements } = await supabase
    .from('user_achievements').select('earned_at, achievements(title, icon_emoji)')
    .eq('user_id', id)

  const { data: projects } = await supabase
    .from('projects').select('*').eq('user_id', id).order('submitted_at', { ascending: false })

  const { data: quizAttempts } = await supabase
    .from('quiz_attempts').select('quiz_id, score, passed, created_at')
    .eq('user_id', id).order('created_at', { ascending: false })

  // Most recent attempt per quiz
  const quizMap = new Map<string, any>()
  for (const a of quizAttempts ?? []) {
    if (!quizMap.has(a.quiz_id)) quizMap.set(a.quiz_id, a)
  }

  const completedLessons = progress?.length ?? 0
  const weeksCompleted = Math.floor(completedLessons / 3)
  const avgQuizScore = quizAttempts?.length
    ? Math.round(quizAttempts.reduce((s, a) => s + a.score, 0) / quizAttempts.length)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/admin" className="hover:text-gray-600">Admin</Link>
          <span>/</span>
          <span className="text-gray-700">{student.display_name}</span>
        </div>

        {/* Student header */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-xl flex-shrink-0">
            {student.display_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{student.display_name}</h1>
            <p className="text-sm text-gray-400">{student.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Joined {new Date(student.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto grid grid-cols-4 gap-3 text-center">
            {[
              { label: 'Lessons', value: completedLessons },
              { label: 'Avg Quiz', value: avgQuizScore !== null ? `${avgQuizScore}%` : '—' },
              { label: 'Badges', value: achievements?.length ?? 0 },
              { label: 'Projects', value: projects?.length ?? 0 },
            ].map(s => (
              <div key={s.label}>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Weekly progress */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Weekly Progress</h2>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {WEEK_TITLES.map((title, i) => {
                const weekNum = i + 1
                const done = completedLessons >= weekNum * 3
                const active = !done && completedLessons >= (weekNum - 1) * 3
                return (
                  <div key={weekNum} className="flex items-center gap-3 px-4 py-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      done ? 'bg-green-100 text-green-700' : active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? '✓' : weekNum}
                    </div>
                    <span className={`text-xs flex-1 ${done ? 'text-gray-700' : active ? 'text-blue-700' : 'text-gray-400'}`}>
                      {title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      done ? 'bg-green-50 text-green-600' : active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {done ? 'Done' : active ? 'Active' : 'Locked'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Submissions */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Homework Submissions</h2>
              <div className="space-y-2">
                {submissions && submissions.length > 0 ? submissions.map(s => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{(s.homework as any)?.title}</span>
                      {s.score !== null ? (
                        <span className="text-xs font-semibold text-green-700">{s.score}/{(s.homework as any)?.max_score ?? 10}</span>
                      ) : (
                        <Link href={`/admin/submissions/${s.id}`} className="text-xs text-amber-600 hover:underline">Review →</Link>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(s.submitted_at).toLocaleDateString()}</div>
                    {s.feedback && <div className="text-xs text-gray-500 mt-1 italic">"{s.feedback}"</div>}
                  </div>
                )) : (
                  <div className="bg-white rounded-xl border border-gray-100 p-4 text-xs text-gray-400 text-center">
                    No submissions yet
                  </div>
                )}
              </div>
            </div>

            {/* Quiz scores */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Quiz Scores</h2>
              {quizMap.size > 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                  {Array.from(quizMap.values()).map((a: any) => {
                    const label = a.quiz_id.replace('seed-quiz-', 'Week ').replace('-', ' · Lesson ')
                    return (
                      <div key={a.quiz_id} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-xs text-gray-600 capitalize">{label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.passed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {a.score}% {a.passed ? '✓' : '✗'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-xs text-gray-400 text-center">No quiz attempts yet</div>
              )}
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Badges Earned</h2>
              {achievements && achievements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 text-xs text-amber-800">
                      <span>{(a.achievements as any)?.icon_emoji}</span>
                      <span>{(a.achievements as any)?.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-xs text-gray-400 text-center">No badges yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Projects</h2>
            <div className="grid grid-cols-3 gap-3">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.title} className="w-full h-28 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-gray-50 flex items-center justify-center text-3xl">🖨️</div>
                  )}
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-800">{p.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(p.submitted_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
