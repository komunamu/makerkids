import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Gather stats for this user
  const [
    { count: lessonsCompleted },
    { count: weeksCompleted },
    { data: quizAttempts },
    { count: publicProjects },
    { count: badgesEarned },
    { data: allAchievements },
    { data: alreadyEarned },
  ] = await Promise.all([
    supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'complete'),
    // Count distinct weeks that have all lessons completed — simplified: count completed weeks
    supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'complete'),
    supabase.from('quiz_attempts').select('passed, score').eq('user_id', user.id),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_public', true),
    supabase.from('user_achievements').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('achievements').select('*'),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
  ])

  const earnedIds = new Set(alreadyEarned?.map(a => a.achievement_id) ?? [])
  const perfectQuizzes = quizAttempts?.filter(a => a.passed && a.score === 100).length ?? 0
  const weeksCount = Math.floor((lessonsCompleted ?? 0) / 3) // approx 3 lessons/week

  const newlyEarned: string[] = []

  for (const achievement of (allAchievements ?? [])) {
    if (earnedIds.has(achievement.id)) continue

    let earned = false
    const val = achievement.condition_value ?? 0

    switch (achievement.condition_type) {
      case 'prints_completed':
        // First print is awarded when a project is submitted
        earned = (publicProjects ?? 0) >= val
        break
      case 'week_completed':
        earned = weeksCount >= val
        break
      case 'weeks_completed':
        earned = weeksCount >= val
        break
      case 'lessons_completed':
        earned = (lessonsCompleted ?? 0) >= val
        break
      case 'badges_earned':
        earned = (badgesEarned ?? 0) >= val
        break
      case 'perfect_quizzes':
        earned = perfectQuizzes >= val
        break
      case 'public_projects':
        earned = (publicProjects ?? 0) >= val
        break
      case 'projects_completed':
        earned = (publicProjects ?? 0) >= val
        break
    }

    if (earned) {
      await supabase.from('user_achievements').insert({
        user_id: user.id,
        achievement_id: achievement.id,
      })
      newlyEarned.push(achievement.title)
    }
  }

  return NextResponse.json({ newlyEarned })
}
