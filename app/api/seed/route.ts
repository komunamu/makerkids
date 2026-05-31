import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CURRICULUM } from '@/lib/curriculum-data'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only admins can seed
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  // Get the course
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('title', 'Summer 3D Printing & TinkerCAD')
    .single()

  if (!course) {
    return NextResponse.json({ error: 'Course not found. Run the SQL migration first.' }, { status: 404 })
  }

  const results: string[] = []

  for (const weekData of CURRICULUM) {
    // Insert week
    const { data: week, error: weekErr } = await supabase
      .from('weeks')
      .upsert({
        course_id: course.id,
        week_number: weekData.week_number,
        title: weekData.title,
        objectives: weekData.objectives,
        is_published: true,
      }, { onConflict: 'course_id,week_number' })
      .select('id')
      .single()

    if (weekErr || !week) {
      results.push(`Week ${weekData.week_number}: ERROR - ${weekErr?.message}`)
      continue
    }

    // Insert homework
    await supabase.from('homework').upsert({
      week_id: week.id,
      title: weekData.homework.title,
      description: weekData.homework.description,
      max_score: weekData.homework.max_score,
    }, { onConflict: 'week_id' })

    // Insert lessons
    for (let i = 0; i < weekData.lessons.length; i++) {
      const lessonData = weekData.lessons[i]
      const { data: lesson, error: lessonErr } = await supabase
        .from('lessons')
        .insert({
          week_id: week.id,
          title: lessonData.title,
          content_markdown: lessonData.content_markdown,
          estimated_minutes: lessonData.estimated_minutes,
          order_index: i,
        })
        .select('id')
        .single()

      if (lessonErr || !lesson) continue

      // Insert videos for this lesson
      for (let j = 0; j < lessonData.videos.length; j++) {
        const vid = lessonData.videos[j]
        await supabase.from('videos').insert({
          lesson_id: lesson.id,
          title: vid.title,
          youtube_url: vid.youtube_url,
          youtube_id: vid.youtube_id,
          order_index: j,
        })
      }
    }

    results.push(`Week ${weekData.week_number} (${weekData.title}): seeded ${weekData.lessons.length} lessons`)
  }

  return NextResponse.json({ success: true, results })
}
