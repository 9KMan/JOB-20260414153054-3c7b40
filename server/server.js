import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

import authRoutes from './routes/auth.js'
import assessmentRoutes from './routes/assessment.js'
import insightRoutes from './routes/insights.js'
import paymentRoutes from './routes/payment.js'
import feedbackRoutes from './routes/feedback.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder-key'
)

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'AI request limit reached. Please try again later.' }
})

app.use('/api', generalLimiter)
app.use('/api/ai', aiLimiter)

// Body parsing
app.use(express.json({ limit: '1mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/assessment', assessmentRoutes)
app.use('/api/insights', insightRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/feedback', feedbackRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`AI Wellness server running on port ${PORT}`)
})
