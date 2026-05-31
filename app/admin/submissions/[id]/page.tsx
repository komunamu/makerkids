'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Nav from '@/components/Nav'

export default function ReviewSubmissionPage() {
  const params = useParams()
  const id = params.id as string
  const [submission, setSubmission] = useState<any>(null)
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*, homework(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => setSubmission(data))
  }, [id])

  async function handleReview(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('submissions').update({
      score: parseInt(score),
      feedback,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => router.push('/admin'), 1500)
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Loading…</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => router.push('/admin')} className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to dashboard
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-4">Review Homework</h1>

        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <div className="text-xs text-gray-400 mb-1">
            Submitted {new Date(submission.submitted_at).toLocaleDateString()}
          </div>
          <h2 className="font-semibold text-gray-800 mb-2">
            {submission.homework?.title ?? 'Homework'}
          </h2>
          {submission.content && (
            <p className="text-sm text-gray-700 whitespace-pre-line">{submission.content}</p>
          )}
          {submission.file_url && (
            <div className="mt-3">
              {submission.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={submission.file_url} alt="Submission" className="rounded-lg max-h-64 object-contain border border-gray-100" />
              ) : (
                <a href={submission.file_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline">
                  📎 View attached file
                </a>
              )}
            </div>
          )}
        </div>

        {saved ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-medium">
            ✅ Feedback saved! Redirecting…
          </div>
        ) : (
          <form onSubmit={handleReview} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Score (out of {submission.homework?.max_score ?? 10})
              </label>
              <input
                type="number" value={score} onChange={e => setScore(e.target.value)}
                min="0" max={submission.homework?.max_score ?? 10} required
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Feedback</label>
              <textarea
                value={feedback} onChange={e => setFeedback(e.target.value)} required
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Great work! I liked how you… Next time, try to…"
              />
            </div>
            <button
              type="submit" disabled={saving}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? 'Saving…' : 'Save feedback'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
