import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const { data: allAchievements } = await supabase.from('achievements').select('*')
  const { data: earned } = await supabase
    .from('user_achievements').select('achievement_id, earned_at').eq('user_id', user.id)

  const earnedMap = new Map(earned?.map(e => [e.achievement_id, e.earned_at]) ?? [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Achievements</h1>
        <p className="text-gray-500 text-sm mb-6">
          {earnedMap.size} of {allAchievements?.length ?? 15} badges earned
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {(allAchievements ?? []).map(a => {
            const earnedAt = earnedMap.get(a.id)
            return (
              <div
                key={a.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-3 transition ${
                  earnedAt ? 'border-amber-200 bg-amber-50' : 'border-gray-100 opacity-50'
                }`}
              >
                <span className="text-3xl flex-shrink-0">{a.icon_emoji}</span>
                <div>
                  <div className={`font-semibold text-sm ${earnedAt ? 'text-amber-900' : 'text-gray-600'}`}>
                    {a.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{a.description}</div>
                  {earnedAt && (
                    <div className="text-xs text-amber-600 mt-1">
                      Earned {new Date(earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
