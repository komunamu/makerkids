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
        quizzes: seedLesson.quiz ?? null,
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

  // Get progress and quiz attempt in parallel
  const quizId = lessonData?.quizzes?.id ?? null
  const [{ data: progress }, { data: quizAttempt }] = await Promise.all([
    supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', id).maybeSingle(),
    quizId
      ? supabase.from('quiz_attempts').select('answers_json, score, passed')
          .eq('quiz_id', quizId).eq('user_id', user.id)
          .order('attempted_at', { ascending: false }).limit(1).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  // Compute next lesson ID
  let nextLessonId: string | null = null
  if (id.startsWith('seed-')) {
    const [, weekStr, indexStr] = id.split('-')
    const weekIdx = parseInt(weekStr) - 1
    const lessonIdx = parseInt(indexStr)
    const weekData = CURRICULUM[weekIdx]
    if (weekData?.lessons[lessonIdx + 1]) {
      nextLessonId = `seed-${weekIdx + 1}-${lessonIdx + 1}`
    } else if (CURRICULUM[weekIdx + 1]?.lessons?.length > 0) {
      nextLessonId = `seed-${weekIdx + 2}-0`
    }
  } else if (lesson) {
    const { data: nextInWeek } = await supabase
      .from('lessons').select('id')
      .eq('week_id', lesson.week_id)
      .gt('order_index', lesson.order_index)
      .order('order_index').limit(1).single()
    if (nextInWeek) {
      nextLessonId = nextInWeek.id
    } else {
      const { data: nextWeek } = await supabase
        .from('weeks').select('id, lessons(id, order_index)')
        .eq('week_number', (lesson.week?.week_number ?? 0) + 1)
        .single()
      const lessons: any[] = (nextWeek as any)?.lessons ?? []
      if (lessons.length > 0) {
        const sorted = [...lessons].sort((a: any, b: any) => a.order_index - b.order_index)
        nextLessonId = sorted[0].id
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userName={profile?.display_name} userRole={profile?.role} />
      <LessonContent lesson={lessonData} userId={user.id} initialStatus={progress?.status ?? 'not_started'} nextLessonId={nextLessonId} quizAttempt={quizAttempt as any} />
    </div>
  )
}
