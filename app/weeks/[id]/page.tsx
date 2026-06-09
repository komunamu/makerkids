import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { CURRICULUM } from '@/lib/curriculum-data'

export default async function WeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const weekNum = parseInt(id)
  if (isNaN(weekNum) || weekNum < 1 || weekNum > 8) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { data: week } = await supabase
    .from('weeks').select('*, lessons(*, videos(*))').eq('week_number', weekNum).single()

  const seedWeek = CURRICULUM[weekNum - 1]
  const weekTitle = week?.title ?? seedWeek.title
  const weekObjectives = week?.objectives ?? seedWeek.objectives
  const lessons = week?.lessons ?? seedWeek.lessons.map((l, i) => ({ ...l, id: `seed-${weekNum}-${i}`, order_index: i }))

  const { data: homework } = await supabase
    .from('homework').select('*').eq('week_id', week?.id ?? '').maybeSingle()

  const seedHomework = seedWeek.homework

  // Fetch lesson completion and homework submission in parallel
  const lessonIds = lessons.map((l: any) => l.id)
  const [{ data: progressRows }, { data: submission }] = await Promise.all([
    supabase.from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('status', 'complete')
      .in('lesson_id', lessonIds),
    supabase.from('submissions')
      .select('id, submitted_at')
      .eq('user_id', user.id)
      .eq('week_number', weekNum)
      .maybeSingle(),
  ])

  const completedIds = new Set(progressRows?.map(p => p.lesson_id) ?? [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/weeks" className="hover:text-gray-600">Curriculum</Link>
          <span>/</span>
          <span className="text-gray-700">Week {weekNum}</span>
        </div>

        {/* Week header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
          <div className="text-xs text-blue-600 font-semibold mb-1">WEEK {weekNum} OF 8</div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">{weekTitle}</h1>

          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Learning objectives</h2>
          <ul className="space-y-1">
            {weekObjectives?.map((obj: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-400 mt-0.5">→</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Lessons */}
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Lessons</h2>
        <div className="space-y-2 mb-6">
          {lessons.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, i: number) => {
            const isDone = completedIds.has(lesson.id)
            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className={`flex items-center gap-3 bg-white rounded-xl border p-4 hover:shadow-sm transition ${
                  isDone ? 'border-green-200' : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isDone ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{lesson.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{lesson.estimated_minutes} min</div>
                </div>
                {isDone
                  ? <span className="text-xs text-green-600 font-medium">Done</span>
                  : <span className="text-blue-500 text-sm">→</span>
                }
              </Link>
            )
          })}
        </div>

        {/* Homework */}
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Homework</h2>
        <div className={`rounded-xl border p-4 ${submission ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className={`font-semibold text-sm mb-1 ${submission ? 'text-green-900' : 'text-amber-900'}`}>
                {submission ? '✅' : '📝'} {homework?.title ?? seedHomework.title}
              </div>
              <p className={`text-sm mb-3 ${submission ? 'text-green-800' : 'text-amber-800'}`}>
                {homework?.description ?? seedHomework.description}
              </p>
              {submission ? (
                <p className="text-xs text-green-700 font-medium">
                  Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                </p>
              ) : (
                <Link
                  href={`/weeks/${weekNum}/submit`}
                  className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition"
                >
                  Submit homework →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
