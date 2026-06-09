import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { CURRICULUM } from '@/lib/curriculum-data'

const WEEK_META = [
  { emoji: '🖨️' },
  { emoji: '📐' },
  { emoji: '📏' },
  { emoji: '🔑' },
  { emoji: '⚙️' },
  { emoji: '🔧' },
  { emoji: '💡' },
  { emoji: '🏆' },
]

export default async function WeeksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('status', 'complete')

  const completedIds = new Set(progressRows?.map(p => p.lesson_id) ?? [])

  // Per-week completion derived from actual lesson IDs
  const weekStatus = CURRICULUM.map((week, i) => {
    const weekNum = i + 1
    const seedIds = week.lessons.map((_, j) => `seed-${weekNum}-${j}`)
    const done = seedIds.filter(id => completedIds.has(id)).length
    return { done, total: seedIds.length, isComplete: done === seedIds.length }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Curriculum</h1>
        <p className="text-gray-500 text-sm mb-6">8 weeks from first print to capstone project</p>

        <div className="space-y-3">
          {CURRICULUM.map((week, i) => {
            const w = { n: i + 1, title: week.title, emoji: WEEK_META[i].emoji }
            const wStatus = weekStatus[i]
            const prevComplete = i === 0 || weekStatus[i - 1].isComplete
            const isComplete = wStatus.isComplete
            const isActive = !isComplete && prevComplete
            const isLocked = !isComplete && !prevComplete

            return (
              <Link
                key={w.n}
                href={isLocked ? '#' : `/weeks/${w.n}`}
                className={`flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 transition ${
                  isLocked ? 'opacity-40 cursor-default' : 'hover:border-blue-200 hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  isComplete ? 'bg-green-50' : isActive ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                  {isComplete ? '✅' : w.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Week {w.n}: {w.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {wStatus.done} / {wStatus.total} lessons complete
                  </div>
                </div>
                <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                  isComplete ? 'bg-green-50 text-green-700' :
                  isActive ? 'bg-blue-50 text-blue-700' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {isComplete ? 'Complete' : isActive ? 'Continue →' : 'Locked'}
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
