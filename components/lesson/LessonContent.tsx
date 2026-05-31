'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import QuizComponent from './QuizComponent'

interface LessonContentProps {
  lesson: any
  userId: string
  initialStatus: string
}

export default function LessonContent({ lesson, userId, initialStatus }: LessonContentProps) {
  const [status, setStatus] = useState(initialStatus)
  const [marking, setMarking] = useState(false)
  const supabase = createClient()

  async function markComplete() {
    setMarking(true)
    const { error } = await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: lesson.id,
      status: 'complete',
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })
    if (!error) setStatus('complete')
    setMarking(false)
  }

  const weekNum = lesson.week?.week_number

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/weeks" className="hover:text-gray-600">Curriculum</Link>
        <span>/</span>
        {weekNum && <Link href={`/weeks/${weekNum}`} className="hover:text-gray-600">Week {weekNum}</Link>}
        {weekNum && <span>/</span>}
        <span className="text-gray-700 truncate">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-blue-600 font-semibold">
            {lesson.week?.title ?? `Week ${weekNum}`}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">{lesson.estimated_minutes} min</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        {status === 'complete' && (
          <span className="inline-block mt-2 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
            ✅ Completed
          </span>
        )}
      </div>

      {/* Videos */}
      {lesson.videos && lesson.videos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">📺 Watch first</h2>
          {lesson.videos.map((v: any) => (
            <div key={v.youtube_id ?? v.title} className="rounded-xl overflow-hidden border border-gray-100 mb-3">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.youtube_id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500">{v.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* Lesson content */}
      {lesson.content_markdown && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-blue-600">
          <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
        </div>
      )}

      {/* Quiz */}
      {lesson.quizzes && (
        <div className="mb-6">
          <QuizComponent quiz={lesson.quizzes} userId={userId} />
        </div>
      )}

      {/* Mark complete */}
      {status !== 'complete' && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 flex items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold text-blue-900 text-sm">Finished this lesson?</div>
            <div className="text-xs text-blue-700 mt-0.5">Mark it complete to track your progress</div>
          </div>
          <button
            onClick={markComplete} disabled={marking}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 flex-shrink-0"
          >
            {marking ? 'Saving…' : '✓ Mark complete'}
          </button>
        </div>
      )}
    </main>
  )
}
