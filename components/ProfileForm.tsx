'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  userId: string
  initialName: string
  email: string
  role: string
}

export default function ProfileForm({ userId, initialName, email, role }: ProfileFormProps) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error } = await supabase.from('users').update({ display_name: name }).eq('id', userId)
    setSaving(false)
    if (error) { setError(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Account details</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Display name</label>
          <input
            value={name} onChange={e => setName(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
          <input
            value={email} disabled
            className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Account type</label>
          <div className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg ${
            role === 'parent' ? 'bg-purple-50 text-purple-700' :
            role === 'admin' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {role === 'student' ? '🎓' : role === 'parent' ? '👨‍👩‍👧' : '⚙️'}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit" disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
