export type Role = 'student' | 'parent' | 'admin'
export type LessonStatus = 'not_started' | 'in_progress' | 'complete'

export interface User {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  role: Role
  parent_id: string | null
  created_at: string
  last_login: string | null
}

export interface Course {
  id: string
  title: string
  description: string | null
  total_weeks: number
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface Week {
  id: string
  course_id: string
  week_number: number
  title: string
  objectives: string[] | null
  is_published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  week_id: string
  title: string
  content_markdown: string | null
  order_index: number
  estimated_minutes: number
  created_at: string
}

export interface Video {
  id: string
  lesson_id: string
  title: string
  youtube_url: string
  youtube_id: string
  duration_seconds: number | null
  order_index: number
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  status: LessonStatus
  completed_at: string | null
  time_spent_seconds: number
}

export interface Homework {
  id: string
  week_id: string
  title: string
  description: string | null
  due_offset_days: number
  max_score: number
}

export interface Submission {
  id: string
  homework_id: string
  user_id: string
  submitted_at: string
  content: string | null
  file_url: string | null
  score: number | null
  feedback: string | null
  reviewed_by: string | null
  reviewed_at: string | null
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  passing_score: number
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  order_index: number
  quiz_options: QuizOption[]
}

export interface QuizOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  score: number | null
  passed: boolean
  attempted_at: string
  answers_json: Record<string, string> | null
}

export interface Project {
  id: string
  user_id: string
  week_id: string | null
  title: string
  description: string | null
  photo_url: string | null
  stl_url: string | null
  is_public: boolean
  submitted_at: string
  feedback: string | null
}

export interface Achievement {
  id: string
  title: string
  description: string | null
  icon_emoji: string | null
  condition_type: string | null
  condition_value: number | null
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  achievements?: Achievement
}

// Dashboard summary type
export interface DashboardStats {
  lessonsCompleted: number
  totalLessons: number
  weekProgress: WeekProgress[]
  recentAchievements: UserAchievement[]
  pendingHomework: Homework[]
}

export interface WeekProgress {
  week: Week
  lessonsCompleted: number
  totalLessons: number
  percentComplete: number
  status: 'complete' | 'in_progress' | 'not_started' | 'locked'
}
