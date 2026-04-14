import { Outlet, Link } from 'react-router-dom'
import { Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">AI Wellness</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
              <Link to="/assessment" className="text-gray-600 hover:text-primary-600 transition-colors">Start Assessment</Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-600 hover:bg-primary-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/assessment" 
                className="block px-3 py-2 text-gray-600 hover:bg-primary-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Start Assessment
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-primary-400" />
                <span className="text-white font-bold">AI Wellness</span>
              </div>
              <p className="text-sm">Personalized health insights powered by artificial intelligence.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/assessment" className="hover:text-white transition-colors">Assessment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2024 AI Wellness. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
