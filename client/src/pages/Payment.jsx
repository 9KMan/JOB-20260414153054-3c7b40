import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { CreditCard, Lock, CheckCircle, Loader2, Shield } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

function CheckoutForm({ insightId, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const createPayment = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/payment/create-intent', { insightId })
      return response.data
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    try {
      const { data: { clientSecret } } = await createPayment.mutateAsync()
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
    }
    
    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#374151',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay $9.99
          </>
        )}
      </button>
    </form>
  )
}

export default function Payment() {
  const { insightId } = useParams()
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const PRICING_TIERS = [
    { id: 'basic', name: 'Basic Premium', price: 9.99, features: ['Deep AI analysis', 'Action plan', 'Priority support'] },
    { id: 'comprehensive', name: 'Comprehensive', price: 19.99, features: ['Everything in Basic', 'Weekly check-ins', 'Custom meal plans', 'Video analysis'] },
  ]
  const [selectedTier] = useState('basic')

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-wellness-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-wellness-mint" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for upgrading to premium. Your full insights are now available.
          </p>
          <a href={`/insights/${insightId}`} className="btn-primary inline-flex items-center gap-2">
            View Premium Insights
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
          <p className="text-lg text-gray-600">Unlock deeper insights and personalized action plans</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pricing */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <div className="space-y-4">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                    selectedTier === tier.id ? 'border-primary-500 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900">{tier.name}</h3>
                    <span className="text-2xl font-bold text-primary-600">${tier.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-wellness-mint" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe. Cancel anytime.</span>
            </div>
          </div>

          {/* Checkout */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  insightId={insightId} 
                  onSuccess={() => setPaymentSuccess(true)} 
                />
              </Elements>
              <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Your payment info is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
