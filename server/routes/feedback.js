import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { insightId, rating, comment, helpful } = req.body

    if (!insightId) {
      return res.status(400).json({ error: 'Insight ID is required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        insight_id: insightId,
        rating,
        feedback_text: comment || null,
        helpful: helpful !== null ? helpful : null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      feedbackId: feedback.id,
      message: 'Feedback submitted successfully'
    })
  } catch (error) {
    console.error('Feedback submission error:', error)
    res.status(500).json({ error: 'Failed to submit feedback' })
  }
})

// Get feedback for an insight
router.get('/insight/:insightId', async (req, res) => {
  try {
    const { insightId } = req.params

    const { data: feedbacks, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('insight_id', insightId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate average rating
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0

    res.json({
      feedbacks,
      averageRating: avgRating.toFixed(1),
      totalCount: feedbacks.length
    })
  } catch (error) {
    console.error('Get feedback error:', error)
    res.status(500).json({ error: 'Failed to retrieve feedback' })
  }
})

export default router
