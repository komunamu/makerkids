'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface QuizProps {
  quiz: {
    id: string
    title: string
    passing_score: number
    quiz_questions: Array<{
      id: string
      question_text: string
      order_index: number
      quiz_options: Array<{ id: string; option_text: string; is_correct: boolean }>
    }>
  }
  userId: string
}

export default function QuizComponent({ quiz, userId }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const questions = [...quiz.quiz_questions].sort((a, b) => a.order_index - b.order_index)

  function selectOption(questionId: string, optionId: string) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  async function handleSubmit() {
    setSaving(true)
    const total = questions.length
    let correct = 0
    for (const q of questions) {
      const selected = answers[q.id]
      const correctOption = q.quiz_options.find(o => o.is_correct)
      if (selected === correctOption?.id) correct++
    }
    const pct = Math.round((correct / total) * 100)
    setScore(pct)
    setSubmitted(true)

    await supabase.from('quiz_attempts').insert({
      quiz_id: quiz.id,
      user_id: userId,
      score: pct,
      passed: pct >= quiz.passing_score,
      answers_json: answers,
    })
    setSaving(false)
  }

  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id])
  const passed = score >= quiz.passing_score

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">🧠 Quiz: {quiz.title}</h2>

      {questions.map((q, qi) => {
        const selectedId = answers[q.id]
        const correctOption = q.quiz_options.find(o => o.is_correct)
        return (
          <div key={q.id} className="mb-5">
            <p className="text-sm font-medium text-gray-800 mb-2">
              {qi + 1}. {q.question_text}
            </p>
            <div className="space-y-2">
              {q.quiz_options.map(opt => {
                const isSelected = selectedId === opt.id
                const isCorrect = opt.is_correct
                let style = 'border-gray-200 text-gray-600'
                if (submitted) {
                  if (isCorrect) style = 'border-green-400 bg-green-50 text-green-800'
                  else if (isSelected && !isCorrect) style = 'border-red-300 bg-red-50 text-red-700 line-through'
                  else style = 'border-gray-100 text-gray-400'
                } else if (isSelected) {
                  style = 'border-blue-400 bg-blue-50 text-blue-800'
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => selectOption(q.id, opt.id)}
                    disabled={submitted}
                    className={cn(
                      'w-full text-left px-4 py-2.5 rounded-lg border text-sm transition',
                      style,
                      !submitted && 'hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    {opt.option_text}
                    {submitted && isCorrect && ' ✓'}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || saving}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition"
        >
          {saving ? 'Submitting…' : 'Submit quiz'}
        </button>
      ) : (
        <div className={cn(
          'rounded-lg p-4 text-center',
          passed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        )}>
          <div className="text-2xl mb-1">{passed ? '🎉' : '📚'}</div>
          <div className={cn('font-bold text-lg', passed ? 'text-green-800' : 'text-amber-800')}>
            {score}%
          </div>
          <div className={cn('text-sm', passed ? 'text-green-700' : 'text-amber-700')}>
            {passed ? 'Great work! You passed.' : `You need ${quiz.passing_score}% to pass. Review the lesson and try again!`}
          </div>
        </div>
      )}
    </div>
  )
}
