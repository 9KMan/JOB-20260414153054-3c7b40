import express from 'express'
import { supabase } from '../server.js'
import { generateInsight } from '../services/aiService.js'

const router = express.Router()

const QUESTIONS = [
  { id: 'sleep_hours', category: 'Sleep', weight: 1.5 },
  { id: 'sleep_quality', category: 'Sleep', weight: 1.5 },
  { id: 'water_intake', category: 'Nutrition', weight: 1.2 },
  { id: 'vegetables', category: 'Nutrition', weight: 1.2 },
  { id: 'exercise_days', category: 'Exercise', weight: 1.5 },
  { id: 'exercise_duration', category: 'Exercise', weight: 1.3 },
  { id: 'stress_level', category: 'Stress', weight: 1.8 },
  { id: 'work_life_balance', category: 'Stress', weight: 1.5 },
  { id: 'mental_health', category: 'Mental Health', weight: 1.8 },
  { id: 'social_connections', category: 'Mental Health', weight: 1.3 },
  { id: 'screen_time', category: 'Lifestyle', weight: 1.0 },
  { id: 'meditation', category: 'Lifestyle', weight: 1.2 },
  { id: 'goals', category: 'Goals', weight: 1.0 },
]

// Get assessment questions
router.get('/questions', (req, res) => {
  const questionsWithoutWeights = QUESTIONS.map(({ weight, ...q }) => q)
  res.json(questionsWithoutWeights)
})

// Submit assessment
router.post('/submit', async (req, res) => {
  try {
    const { answers, userId } = req.body

    // Calculate scores by category
    const categoryScores = {}
    const categoryWeights = {}

    QUESTIONS.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined && q.category !== 'Goals') {
        // Normalize answer to 0-100 scale
        let normalizedScore
        if (q.id.includes('hours')) {
          // Sleep hours: 4-10 range, ideal is 7-8
          const ideal = answer >= 7 && answer <= 8 ? 100 : answer < 7 ? answer * 15 : Math.max(0, 120 - (answer - 8) * 20)
          normalizedScore = Math.min(100, Math.max(0, ideal))
        } else if (q.id.includes('quality') || q.id.includes('mental_health') || q.id.includes('balance')) {
          normalizedScore = (answer / 5) * 100
        } else if (q.id.includes('stress')) {
          normalizedScore = ((10 - answer) / 9) * 100 // Lower stress = higher score
        } else if (q.id.includes('duration')) {
          normalizedScore = Math.min(100, (answer / 60) * 100) // Ideal is 60 min
        } else if (q.id.includes('days')) {
          normalizedScore = (answer / 7) * 100
        } else if (typeof answer === 'number') {
          normalizedScore = (answer / (q.max || 10)) * 100
        } else if (typeof answer === 'boolean') {
          normalizedScore = answer ? 80 : 40
        } else {
          normalizedScore = 70 // Default
        }

        categoryScores[q.category] = (categoryScores[q.category] || 0) + normalizedScore * (q.weight || 1)
        categoryWeights[q.category] = (categoryWeights[q.category] || 0) + (q.weight || 1)
      }
    })

    // Average scores per category
    const scores = {}
    Object.keys(categoryScores).forEach(cat => {
      scores[cat] = Math.round(categoryScores[cat] / categoryWeights[cat])
    })

    // Create assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({ 
        user_id: userId || 'anonymous',
        responses: answers,
        scores,
        status: 'completed'
      })
      .select()
      .single()

    if (assessmentError) throw assessmentError

    // Generate AI insight
    const aiContent = await generateInsight(answers, scores)

    // Create insight record
    const { data: insight, error: insightError } = await supabase
      .from('insights')
      .insert({
        assessment_id: assessment.id,
        ai_content: aiContent,
        tier: 'free',
        scores
      })
      .select()
      .single()

    if (insightError) throw insightError

    res.json({
      insightId: insight.id,
      assessmentId: assessment.id,
      scores,
      tier: 'free'
    })
  } catch (error) {
    console.error('Assessment submission error:', error)
    res.status(500).json({ error: 'Failed to process assessment' })
  }
})

export default router
