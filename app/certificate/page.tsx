import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import CertificatePrint from '@/components/CertificatePrint'

export default async function CertificatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('status', 'complete')

  const completedLessons = progress?.length ?? 0
  const weeksCompleted = Math.min(Math.floor(completedLessons / 3), 8)
  const isComplete = weeksCompleted >= 8

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Completion Certificate</h1>

        {isComplete ? (
          <CertificatePrint name={profile?.display_name ?? 'Student'} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Almost there!</h2>
            <p className="text-gray-500 text-sm mb-4">
              Complete all 8 weeks to unlock your certificate.
            </p>
            <div className="bg-gray-100 rounded-full h-3 max-w-xs mx-auto overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(weeksCompleted / 8) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{weeksCompleted} of 8 weeks complete</p>
          </div>
        )}
      </main>
    </div>
  )
}
