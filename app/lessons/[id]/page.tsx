import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import LessonContent from '@/components/lesson/LessonContent'
import { CURRICULUM } from '@/lib/curriculum-data'

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  // Try to load from DB first
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, videos(*), week:weeks(week_number, title), quizzes(*, quiz_questions(*, quiz_options(*)))')
    .eq('id', id)
    .single()

  // Fall back to seed data for demo
  let lessonData: any = lesson
  if (!lesson && id.startsWith('seed-')) {
    const [, weekStr, indexStr] = id.split('-')
    const weekIdx = parseInt(weekStr) - 1
    const lessonIdx = parseInt(indexStr)
    const seedWeek = CURRICULUM[weekIdx]
    if (seedWeek && seedWeek.lessons[lessonIdx]) {
      const seedLesson = seedWeek.lessons[lessonIdx]
      lessonData = {
        id,
        title: seedLesson.title,
        content_markdown: seedLesson.content_markdown,
        estimated_minutes: seedLesson.estimated_minutes,
        videos: seedLesson.videos,
        week: { week_number: weekIdx + 1, title: seedWeek.title },
        quizzes: null,
      }
    }
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav userName={profile?.display_name} />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Lesson not found.</p>
        </main>
      </div>
    )
  }

  // Get progress
  const { data: progress } = await supabase
    .from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <LessonContent lesson={lessonData} userId={user.id} initialStatus={progress?.status ?? 'not_started'} />
    </div>
  )
}
