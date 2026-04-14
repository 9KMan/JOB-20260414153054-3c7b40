import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Star, ThumbsUp, ThumbsDown, Send, CheckCircle, Loader2 } from 'lucide-react'

export default function Feedback() {
  const { insightId } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [helpful, setHelpful] = useState(null)

  const submitFeedback = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/feedback', { insightId, ...data })
      return response.data
    },
    onSuccess: () => {
      navigate('/')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    submitFeedback.mutate({ rating, comment, helpful })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Share Your Feedback</h1>
          <p className="text-lg text-gray-600">
            Help us improve by rating your experience with the AI insights
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4 text-center">
                How would you rate your overall experience?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                </p>
              )}
            </div>

            {/* Helpful */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4 text-center">
                Were the insights helpful to you?
              </label>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setHelpful(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                    helpful === true
                      ? 'border-wellness-mint bg-wellness-mint/10 text-wellness-mint'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-medium">Yes, helpful</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHelpful(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                    helpful === false
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span className="font-medium">Not really</span>
                </button>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Any additional comments? (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked or how we can improve..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={rating === 0 || submitFeedback.isPending}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitFeedback.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>

            {submitFeedback.isSuccess && (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-wellness-mint mx-auto mb-4" />
                <p className="text-lg text-gray-700">Thank you for your feedback!</p>
              </div>
            )}

            {submitFeedback.isError && (
              <p className="text-center text-red-500">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
