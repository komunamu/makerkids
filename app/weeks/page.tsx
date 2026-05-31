import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

const WEEKS = [
  { n: 1, title: 'Welcome to 3D Printing', sub: 'Printer setup, safety, first print', emoji: '🖨️' },
  { n: 2, title: 'TinkerCAD Basics', sub: 'Shapes, groups, holes, alignment', emoji: '📐' },
  { n: 3, title: 'Measurements & Precision', sub: 'Real-world dimensions, ruler tool', emoji: '📏' },
  { n: 4, title: 'Keychains & Custom Tags', sub: 'Design functional wearable objects', emoji: '🔑' },
  { n: 5, title: 'STL Files & Cura Slicing', sub: 'Install Cura, learn key settings', emoji: '⚙️' },
  { n: 6, title: 'Multi-Part Designs', sub: 'Tolerance, fit, assembly', emoji: '🔧' },
  { n: 7, title: 'Product Design Challenge', sub: 'Empathize → prototype → test → iterate', emoji: '💡' },
  { n: 8, title: 'Final Capstone Project', sub: 'Multi-part showcase project', emoji: '🏆' },
]

export default async function WeeksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('status', 'complete')
  const completedCount = progress?.length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Curriculum</h1>
        <p className="text-gray-500 text-sm mb-6">8 weeks from first print to capstone project</p>

        <div className="space-y-3">
          {WEEKS.map(w => {
            const isComplete = completedCount >= w.n * 3
            const isActive = !isComplete && completedCount >= (w.n - 1) * 3
            const isLocked = !isComplete && !isActive

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
                  <div className="text-xs text-gray-500 mt-0.5">{w.sub}</div>
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
