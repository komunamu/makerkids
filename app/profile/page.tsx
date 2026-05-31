import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('status', 'complete')

  const { data: submissions } = await supabase
    .from('submissions').select('id, score, homework(max_score)').eq('user_id', user.id)

  const { data: achievements } = await supabase
    .from('user_achievements').select('id').eq('user_id', user.id)

  const { data: projects } = await supabase
    .from('projects').select('id').eq('user_id', user.id)

  const avgScore = submissions && submissions.length > 0
    ? Math.round(
        submissions.reduce((acc, s) => acc + (s.score ?? 0), 0) / submissions.filter(s => s.score !== null).length
      )
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Stats summary */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Lessons', value: progress?.length ?? 0, emoji: '✅' },
            { label: 'Badges', value: achievements?.length ?? 0, emoji: '🏆' },
            { label: 'Projects', value: projects?.length ?? 0, emoji: '🖨️' },
            { label: 'Avg score', value: avgScore ? `${avgScore}/10` : '—', emoji: '📊' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <div className="text-lg">{s.emoji}</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit profile form */}
        <ProfileForm
          userId={user.id}
          initialName={profile?.display_name ?? ''}
          email={user.email ?? ''}
          role={profile?.role ?? 'student'}
        />
      </main>
    </div>
  )
}
