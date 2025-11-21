import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LogIn, Mail, Lock } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name}!`)
      
      // Redirect based on role
      if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-black dark:via-gray-950 dark:to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-500">
      {/* Theme Toggle - Floating */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-4 lg:px-8">
          <div className="space-y-4">
            <div className="inline-block">
              <span className="text-4xl lg:text-5xl font-bold text-primary-500 dark:text-primary-500">
                BrotoDesk
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
              Complaint Management System
            </h2>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
              A streamlined platform for Brototype students to raise and track complaints efficiently.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Resolution</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get your complaints addressed promptly by administrators</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Track Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your complaint status in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected with industry-standard security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg dark:shadow-red-glow">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center lg:text-left">Welcome Back</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center lg:text-left">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm sm:text-base text-gray-900 dark:text-white bg-white dark:bg-dark-card"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm sm:text-base text-gray-900 dark:text-white bg-white dark:bg-dark-card"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 dark:shadow-red-glow hover:shadow-xl transform hover:-translate-y-0.5">
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-500 transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Branding */}
          <div className="lg:hidden mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 BrotoDesk. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
