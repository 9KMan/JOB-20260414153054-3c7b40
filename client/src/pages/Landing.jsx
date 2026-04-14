import { Link } from 'react-router-dom'
import { Brain, Shield, Sparkles, TrendingUp, CheckCircle, Star } from 'lucide-react'

export default function Landing() {
  const features = [
    { icon: Brain, title: 'AI-Powered Analysis', desc: 'Advanced GPT-4 analysis of your wellness data' },
    { icon: Shield, title: 'Privacy First', desc: 'Your data is encrypted and never shared' },
    { icon: Sparkles, title: 'Personalized Insights', desc: 'Recommendations tailored to your unique profile' },
    { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor your wellness journey over time' },
  ]

  const testimonials = [
    { name: 'Sarah M.', role: 'Software Engineer', text: 'The insights were incredibly accurate and helped me improve my sleep quality significantly.', rating: 5 },
    { name: 'James K.', role: 'Product Manager', text: 'Finally, a wellness app that gives practical advice instead of generic tips.', rating: 5 },
    { name: 'Emily R.', role: 'Designer', text: 'The AI recommendations were spot-on. I love how it considers my whole lifestyle.', rating: 5 },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-wellness-lavender/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\")%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%230ea5e9\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Personal
              <span className="text-primary-600 block">AI Wellness Coach</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take our comprehensive wellness assessment and receive AI-generated insights 
              personalized to your unique lifestyle, habits, and goals. Start your journey 
              to better health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/assessment" className="btn-primary inline-flex items-center justify-center gap-2">
                Start Free Assessment
                <Sparkles className="w-5 h-5" />
              </Link>
              <a href="#features" className="btn-secondary inline-flex items-center justify-center">
                Learn More
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-wellness-mint" />
                <span>100% Free Tier</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-wellness-mint" />
                <span>5-min Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-wellness-mint" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to unlock your personalized wellness insights
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Wellness Assessment
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered questionnaire covers all aspects of your wellness to provide 
                truly personalized insights.
              </p>
              <ul className="space-y-4">
                {['Sleep Quality & Patterns', 'Nutrition & Hydration', 'Exercise & Activity', 'Stress & Mental Health', 'Lifestyle & Habits'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-wellness-mint flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/assessment" className="btn-primary inline-flex items-center gap-2 mt-8">
                Take the Assessment
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-wellness-lavender/30 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Wellness Score</p>
                      <p className="text-sm text-gray-500">Your personalized metric</p>
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold text-primary-600 mb-2">87</div>
                    <p className="text-gray-600">out of 100</p>
                  </div>
                  <div className="space-y-3">
                    {['Sleep', 'Nutrition', 'Exercise', 'Stress'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-20">{item}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${75 + idx * 5}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="card">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-wellness-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Wellness?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Start your free assessment now and discover AI-powered insights tailored to you.
          </p>
          <Link 
            to="/assessment" 
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors"
          >
            Get Started Free
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
