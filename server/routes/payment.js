import express from 'express'
import Stripe from 'stripe'
import { supabase } from '../server.js'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { insightId } = req.body

    // Get the insight to check tier
    const { data: insight } = await supabase
      .from('insights')
      .select('tier')
      .eq('id', insightId)
      .single()

    if (!insight) {
      return res.status(404).json({ error: 'Insight not found' })
    }

    if (insight.tier === 'premium') {
      return res.status(400).json({ error: 'Already upgraded' })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999, // $9.99 in cents
      currency: 'usd',
      metadata: { insightId },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: 999
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    res.status(500).json({ error: 'Failed to create payment' })
  }
})

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  try {
    let event
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } else {
      event = JSON.parse(req.body)
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const insightId = paymentIntent.metadata.insightId

        // Update insight to premium
        await supabase
          .from('insights')
          .update({ tier: 'premium' })
          .eq('id', insightId)
        break
      }
      case 'payment_intent.payment_failed': {
        console.log('Payment failed:', event.data.object.id)
        break
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({ error: 'Webhook error' })
  }
})

// Get pricing tiers
router.get('/pricing', (req, res) => {
  res.json([
    { id: 'basic', name: 'Basic Premium', price: 9.99 },
    { id: 'comprehensive', name: 'Comprehensive', price: 19.99 }
  ])
})

export default router
