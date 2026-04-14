import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Brain, ChevronRight, ChevronLeft, Save, Loader2 } from 'lucide-react'

const QUESTIONS = [
  { id: 'sleep_hours', category: 'Sleep', question: 'How many hours do you sleep on average each night?', type: 'scale', min: 4, max: 10, step: 0.5 },
  { id: 'sleep_quality', category: 'Sleep', question: 'How would you rate your sleep quality?', type: 'scale', min: 1, max: 5 },
  { id: 'water_intake', category: 'Nutrition', question: 'How many glasses of water do you drink daily?', type: 'scale', min: 2, max: 15 },
  { id: 'vegetables', category: 'Nutrition', question: 'How many servings of vegetables do you eat daily?', type: 'scale', min: 0, max: 10 },
  { id: 'exercise_days', category: 'Exercise', question: 'How many days per week do you exercise?', type: 'scale', min: 0, max: 7 },
  { id: 'exercise_duration', category: 'Exercise', question: 'Average exercise session duration (minutes)?', type: 'scale', min: 10, max: 120, step: 10 },
  { id: 'stress_level', category: 'Stress', question: 'How would you rate your current stress level?', type: 'scale', min: 1, max: 10 },
  { id: 'work_life_balance', category: 'Stress', question: 'How satisfied are you with your work-life balance?', type: 'scale', min: 1, max: 5 },
  { id: 'mental_health', category: 'Mental Health', question: 'How would you rate your overall mental health?', type: 'scale', min: 1, max: 5 },
  { id: 'social_connections', category: 'Mental Health', question: 'How often do you connect with friends/family weekly?', type: 'scale', min: 0, max: 15 },
  { id: 'screen_time', category: 'Lifestyle', question: 'Daily screen time (hours)?', type: 'scale', min: 1, max: 16 },
  { id: 'meditation', category: 'Lifestyle', question: 'Do you practice meditation or mindfulness?', type: 'boolean' },
  { id: 'goals', category: 'Goals', question: 'What is your primary wellness goal?', type: 'select', options: ['Improve energy', 'Better sleep', 'Reduce stress', 'Lose weight', 'Build muscle', 'Mental clarity'] },
]

const CATEGORIES = [...new Set(QUESTIONS.map(q => q.category))]

export default function Assessment() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saved, setSaved] = useState(false)

  const submitAssessment = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/assessment/submit', data)
      return response.data
    },
    onSuccess: (data) => {
      navigate(`/insights/${data.insightId}`)
    },
  })

  const currentQuestion = QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100
  const isLastStep = currentStep === QUESTIONS.length - 1
  const isFirstStep = currentStep === 0

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    setSaved(false)
  }

  const handleSaveProgress = () => {
    localStorage.setItem('wellness_assessment_progress', JSON.stringify({ answers, step: currentStep }))
    setSaved(true)
  }

  const handleNext = () => {
    if (isLastStep) {
      submitAssessment.mutate(answers)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderAnswerInput = () => {
    const value = answers[currentQuestion.id]

    if (currentQuestion.type === 'scale') {
      return (
        <div className="space-y-6">
          <input
            type="range"
            min={currentQuestion.min}
            max={currentQuestion.max}
            step={currentQuestion.step || 1}
            value={value || currentQuestion.min}
            onChange={(e) => handleAnswer(parseFloat(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{currentQuestion.min}</span>
            <div className="text-4xl font-bold text-primary-600">
              {value || currentQuestion.min}
              {currentQuestion.id.includes('hours') && ' hrs'}
              {currentQuestion.id.includes('minutes') && ' min'}
              {currentQuestion.id.includes('glasses') && ' glasses'}
              {currentQuestion.id.includes('days') && ' days'}
              {currentQuestion.id === 'stress_level' && '/10'}
            </div>
            <span className="text-sm text-gray-500">{currentQuestion.max}{currentQuestion.id.includes('hours') && ' hrs'}</span>
          </div>
        </div>
      )
    }

    if (currentQuestion.type === 'boolean') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => handleAnswer(opt.value)}
              className={`p-6 rounded-xl border-2 transition-all ${
                value === opt.value 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-lg font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
      )
    }

    if (currentQuestion.type === 'select') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                value === option 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-wellness-lavender/20 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Brain className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-600">AI Wellness Assessment</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Your Wellness</h1>
          <p className="text-gray-600">Answer these questions to get personalized insights</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-primary-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {CATEGORIES.map((cat) => (
              <span 
                key={cat} 
                className={`text-xs px-2 py-1 rounded-full ${
                  QUESTIONS[currentStep]?.category === cat 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>
          
          {renderAnswerInput()}

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={handleSaveProgress}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm">Save Progress</span>
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                  isFirstStep 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={submitAssessment.isPending}
                className="btn-primary flex items-center gap-2"
              >
                {submitAssessment.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : isLastStep ? (
                  'Get My Insights'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {saved && (
            <p className="text-center text-sm text-wellness-mint mt-4">
              ✓ Progress saved! You can resume anytime.
            </p>
          )}

          {submitAssessment.isError && (
            <p className="text-center text-sm text-red-500 mt-4">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
