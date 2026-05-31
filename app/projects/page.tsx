import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import ProjectUpload from '@/components/ProjectUpload'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-500 text-sm mt-1">Your 3D printing portfolio</p>
          </div>
          <ProjectUpload userId={user.id} />
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {p.photo_url ? (
                  <img src={p.photo_url} alt={p.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-50 flex items-center justify-center text-4xl">🖨️</div>
                )}
                <div className="p-4">
                  <div className="font-semibold text-gray-800 text-sm">{p.title}</div>
                  {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(p.submitted_at).toLocaleDateString()}
                    </span>
                    {p.is_public && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Public</span>
                    )}
                  </div>
                  {p.feedback && (
                    <div className="mt-2 text-xs text-green-700 bg-green-50 rounded p-2">
                      💬 {p.feedback}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="text-5xl mb-4">🖨️</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No projects yet</h2>
            <p className="text-gray-400 text-sm">
              Complete lessons and submit your first printed project!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
