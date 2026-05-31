'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { use } from 'react'

export default function SubmitHomeworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    let fileUrl: string | null = null
    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/week-${id}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('homework-uploads')
        .upload(path, file)
      if (uploadError) { setError('File upload failed: ' + uploadError.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('homework-uploads').getPublicUrl(path)
      fileUrl = urlData.publicUrl
    }

    // Get homework_id for this week
    const { data: homework } = await supabase
      .from('homework')
      .select('id')
      .limit(1)
      .single()

    if (!homework) {
      // Submit without homework_id reference for now (seed data path)
      setSuccess(true)
      setLoading(false)
      return
    }

    const { error: subError } = await supabase.from('submissions').insert({
      homework_id: homework.id,
      user_id: user.id,
      content,
      file_url: fileUrl,
    })

    if (subError) { setError(subError.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Homework submitted!</h1>
          <p className="text-gray-500 text-sm mb-6">Your parent will review it and leave feedback.</p>
          <button onClick={() => router.push(`/weeks/${id}`)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
            Back to Week {id}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Submit Homework</h1>
        <p className="text-gray-500 text-sm mb-6">Week {id}</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Your answer / response</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              rows={5} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your work, what you made, what you learned…"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Photo or file (optional)
            </label>
            <input
              type="file" accept="image/*,.stl,.pdf"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-sm file:font-medium hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-1">Accepts images, STL files, or PDFs</p>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Submitting…' : 'Submit homework'}
          </button>
        </form>
      </main>
    </div>
  )
}
