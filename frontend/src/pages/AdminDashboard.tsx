import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI, analyticsAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { LogOut, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Calendar, Filter, Search, ArrowRight, Eye } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        complaintAPI.getAll({ status: filter === 'ALL' ? undefined : filter }),
        analyticsAPI.getSummary()
      ])
      setComplaints(complaintsRes.data.complaints)
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/30',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/30',
      RESOLVED: 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/30'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700/30'
  }

  const getRecentComplaints = () => {
    return [...complaints]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }

  const getUrgentComplaints = () => {
    return complaints.filter(c => c.status === 'PENDING').slice(0, 3)
  }

  const filteredComplaints = complaints.filter(c => {
    if (filter !== 'ALL' && c.status !== filter) return false
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.student.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-black dark:via-gray-950 dark:to-black">
      {/* Compact Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg dark:shadow-black/50 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button onClick={logout} className="btn-secondary flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Enhanced Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Total Complaints */}
            <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalComplaints}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Complaints</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>All time</span>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-l-4 border-yellow-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingComplaints}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Needs Attention</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  <span>Action required</span>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-l-4 border-blue-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgressComplaints}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <Calendar className="w-3 h-3" />
                  <span>Being resolved</span>
                </div>
              </div>
            </div>

            {/* Resolved */}
            <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-l-4 border-green-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolvedComplaints}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>{stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}% completion</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout: Quick Actions + All Complaints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column: Quick Actions & Urgent */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Filters */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary-500" />
                  Quick Filters
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    filter === 'ALL'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('PENDING')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    filter === 'PENDING'
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('IN_PROGRESS')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    filter === 'IN_PROGRESS'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilter('RESOLVED')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    filter === 'RESOLVED'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Urgent Complaints */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  Needs Attention
                </h3>
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full font-semibold">
                  {getUrgentComplaints().length}
                </span>
              </div>
              <div className="space-y-3">
                {getUrgentComplaints().length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No urgent complaints
                  </p>
                ) : (
                  getUrgentComplaints().map((complaint) => (
                    <div
                      key={complaint.id}
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                            {complaint.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {complaint.student.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  Recent Updates
                </h3>
              </div>
              <div className="space-y-3">
                {getRecentComplaints().slice(0, 3).map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                    className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      complaint.status === 'RESOLVED' ? 'bg-green-500' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                        {complaint.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: All Complaints List */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="card flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  All Complaints ({filteredComplaints.length})
                </h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-auto pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-dark-card text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Complaints List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No complaints found</p>
                </div>
              ) : (
                <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">{filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-gray-900/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors truncate">
                              {complaint.title}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(complaint.status)}`}>
                              {complaint.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              <span className="truncate">{complaint.student.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs flex-shrink-0">
                              {complaint.category}
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
                          <Eye className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
