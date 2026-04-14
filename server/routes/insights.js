import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// Get insight by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data: insight, error } = await supabase
      .from('insights')
      .select(`
        *,
        assessment:assessments(
          responses,
          scores
        )
      `)
      .eq('id', id)
      .single()

    if (error || !insight) {
      return res.status(404).json({ error: 'Insight not found' })
    }

    res.json({
      id: insight.id,
      aiContent: insight.ai_content,
      tier: insight.tier,
      scores: insight.scores || insight.assessment?.scores || {},
      createdAt: insight.created_at
    })
  } catch (error) {
    console.error('Get insight error:', error)
    res.status(500).json({ error: 'Failed to retrieve insight' })
  }
})

// Get user's insights
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data: insights, error } = await supabase
      .from('insights')
      .select(`
        id,
        tier,
        scores,
        created_at
      `)
      .eq('assessment.user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(insights)
  } catch (error) {
    console.error('Get user insights error:', error)
    res.status(500).json({ error: 'Failed to retrieve insights' })
  }
})

export default router
