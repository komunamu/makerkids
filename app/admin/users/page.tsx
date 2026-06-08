import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Link from 'next/link'
import RoleSelect from './RoleSelect'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  const counts = { admin: 0, parent: 0, student: 0 }
  for (const u of users ?? []) {
    if (u.role in counts) counts[u.role as keyof typeof counts]++
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
          ← Back to dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Change roles and manage accounts</p>
          </div>
          <div className="flex gap-3 text-center">
            {[
              { label: 'Students', count: counts.student },
              { label: 'Parents', count: counts.parent },
              { label: 'Admins', count: counts.admin },
            ].map(c => (
              <div key={c.label} className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-gray-900">{c.count}</div>
                <div className="text-xs text-gray-500">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3">User</th>
                  <th className="text-left px-6 py-3">Current Role</th>
                  <th className="text-left px-6 py-3">Joined</th>
                  <th className="text-left px-6 py-3">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users?.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                          {u.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{u.display_name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'parent' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {u.id === user.id ? (
                        <span className="text-xs text-gray-400 italic">You</span>
                      ) : (
                        <RoleSelect userId={u.id} currentRole={u.role} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
