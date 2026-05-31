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

  // Get week data from DB if available, otherwise use seed data
  const { data: week } = await supabase
    .from('weeks').select('*, lessons(*, videos(*))').eq('week_number', weekNum).single()

  const seedWeek = CURRICULUM[weekNum - 1]
  const weekTitle = week?.title ?? seedWeek.title
  const weekObjectives = week?.objectives ?? seedWeek.objectives
  const lessons = week?.lessons ?? seedWeek.lessons.map((l, i) => ({ ...l, id: `seed-${weekNum}-${i}`, order_index: i }))

  // Get homework for this week
  const { data: homework } = await supabase
    .from('homework').select('*').eq('week_id', week?.id ?? '').single()

  const seedHomework = seedWeek.homework

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
          {lessons.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, i: number) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{lesson.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{lesson.estimated_minutes} min</div>
              </div>
              <span className="text-blue-500 text-sm">→</span>
            </Link>
          ))}
        </div>

        {/* Homework */}
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Homework</h2>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <div className="font-semibold text-amber-900 text-sm mb-1">
            📝 {homework?.title ?? seedHomework.title}
          </div>
          <p className="text-sm text-amber-800 mb-3">
            {homework?.description ?? seedHomework.description}
          </p>
          <Link
            href={`/weeks/${weekNum}/submit`}
            className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition"
          >
            Submit homework →
          </Link>
        </div>
      </main>
    </div>
  )
}
