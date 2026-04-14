import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Brain, Lock, ChevronRight, Sparkles, TrendingUp, Heart, Moon, Utensils, Activity } from 'lucide-react'

const CATEGORY_ICONS = {
  'Sleep': Moon,
  'Nutrition': Utensils,
  'Exercise': Activity,
  'Stress': TrendingUp,
  'Mental Health': Heart,
  'Lifestyle': Sparkles,
}

const CATEGORY_COLORS = {
  'Sleep': 'bg-violet-100 text-violet-600',
  'Nutrition': 'bg-green-100 text-green-600',
  'Exercise': 'bg-orange-100 text-orange-600',
  'Stress': 'bg-red-100 text-red-600',
  'Mental Health': 'bg-pink-100 text-pink-600',
  'Lifestyle': 'bg-blue-100 text-blue-600',
}

export default function Insights() {
  const { id } = useParams()
  
  const { data: insight, isLoading } = useQuery({
    queryKey: ['insight', id],
    queryFn: async () => {
      const response = await axios.get(`/api/insights/${id}`)
      return response.data
    },
    refetchInterval: false,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Generating your personalized insights...</p>
        </div>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Insight not found</p>
          <Link to="/assessment" className="btn-primary mt-4 inline-block">Start Assessment</Link>
        </div>
      </div>
    )
  }

  const scores = insight.scores || {}
  const overallScore = Object.values(scores).length > 0 
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Your AI Wellness Report</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Wellness Insights</h1>
          <p className="text-lg text-gray-600">Personalized analysis based on your assessment</p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-primary-500 to-wellness-lavender rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-primary-100 mb-2">Overall Wellness Score</p>
              <div className="text-6xl font-bold">{overallScore}</div>
              <p className="text-primary-100 mt-1">out of 100</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg font-medium mb-2">
                {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'Fair' : 'Needs Attention'}
              </p>
              <p className="text-primary-100 text-sm max-w-xs">
                {overallScore >= 80 
                  ? 'Outstanding wellness practices! Keep maintaining your healthy habits.'
                  : 'There is room for improvement. Follow the recommendations below to boost your score.'}
              </p>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {Object.entries(scores).map(([category, score]) => {
            const Icon = CATEGORY_ICONS[category] || Brain
            const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600'
            
            return (
              <div key={category} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category}</h3>
                    <p className="text-sm text-gray-500">Score: {score}/100</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-wellness-mint' : score >= 60 ? 'bg-primary-500' : score >= 40 ? 'bg-wellness-peach' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Analysis</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {insight.aiContent || insight.ai_content}
            </div>
          </div>
        </div>

        {/* Premium CTA */}
        {insight.tier === 'free' && (
          <div className="bg-gradient-to-r from-wellness-peach/20 to-wellness-lavender/20 rounded-2xl p-8 border border-wellness-peach/30 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-wellness-peach/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-wellness-peach" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Premium Insights</h3>
                <p className="text-gray-600 mb-4">
                  Get deeper analysis, personalized action plans, and detailed recommendations 
                  with our premium tier.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-900">$9.99</span>
                  <Link 
                    to={`/payment/${id}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    Upgrade Now
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={`/feedback/${id}`}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            Share Feedback
          </Link>
          <Link 
            to="/assessment"
            className="btn-primary flex items-center justify-center gap-2"
          >
            Take Assessment Again
          </Link>
        </div>
      </div>
    </div>
  )
}
