import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

const WEEK_TITLES = [
  'Welcome to 3D Printing',
  'TinkerCAD Basics',
  'Measurements & Precision',
  'Keychains & Custom Tags',
  'STL Files & Cura Slicing',
  'Multi-Part Designs',
  'Product Design Challenge',
  'Final Capstone Project',
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get all lesson progress
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, status')
    .eq('user_id', user.id)
    .eq('status', 'complete')

  const completedLessons = progress?.length ?? 0

  // Get achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', user.id)

  // Get all achievements for display
  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*')
    .order('condition_value')

  const earnedIds = new Set(userAchievements?.map(a => a.achievement_id) ?? [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.display_name?.split(' ')[0] ?? 'Maker'}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your 3D printing journey continues</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Lessons done', value: completedLessons, sub: 'of 24 total', emoji: '✅' },
            { label: 'Badges earned', value: earnedIds.size, sub: 'of 15 total', emoji: '🏆' },
            { label: 'Weeks started', value: Math.min(Math.ceil(completedLessons / 3), 8), sub: 'of 8 weeks', emoji: '📅' },
            { label: 'Projects', value: 0, sub: 'submitted', emoji: '🖨️' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              <div className="text-xs text-gray-300">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Weekly progress */}
          <div className="sm:col-span-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">8-Week Curriculum</h2>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {WEEK_TITLES.map((title, i) => {
                const weekNum = i + 1
                const isComplete = completedLessons >= weekNum * 3
                const isActive = !isComplete && completedLessons >= (weekNum - 1) * 3
                const isLocked = !isComplete && !isActive

                return (
                  <Link
                    key={weekNum}
                    href={isLocked ? '#' : `/weeks/${weekNum}`}
                    className={`flex items-center gap-3 px-4 py-3 transition ${isLocked ? 'opacity-40 cursor-default' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isComplete ? 'bg-green-100 text-green-700' :
                      isActive ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {isComplete ? '✓' : weekNum}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        Week {weekNum}: {title}
                      </div>
                      {isActive && (
                        <div className="text-xs text-blue-600 mt-0.5">In progress →</div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isComplete ? 'bg-green-50 text-green-600' :
                      isActive ? 'bg-blue-50 text-blue-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {isComplete ? 'Complete' : isActive ? 'Active' : 'Locked'}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Achievements sidebar */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Achievements</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="grid grid-cols-3 gap-2">
                {(allAchievements ?? []).slice(0, 15).map(a => (
                  <div
                    key={a.id}
                    title={a.title}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
                      earnedIds.has(a.id)
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-gray-50 opacity-40'
                    }`}
                  >
                    <span className="text-xl">{a.icon_emoji}</span>
                    <span className="text-xs text-gray-600 leading-tight">{a.title}</span>
                  </div>
                ))}
              </div>
              <Link href="/achievements" className="block text-center text-xs text-blue-600 mt-3 hover:underline">
                View all achievements →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
