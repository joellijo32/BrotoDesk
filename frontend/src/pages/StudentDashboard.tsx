import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { Plus, Bell, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, ArrowRight, Filter, Upload, X, Search } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())
  const notificationRef = useRef<HTMLDivElement>(null)
  const { logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Load read notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('readNotifications')
    if (stored) {
      setReadNotifications(new Set(JSON.parse(stored)))
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin')
      return
    }
    fetchComplaints()
  }, [])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const fetchComplaints = async () => {
    try {
      const { data } = await complaintAPI.getAll()
      setComplaints(data.complaints)
    } catch (error) {
      toast.error('Failed to load complaints')
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

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length
  }

  const getRecentComplaints = () => {
    return [...complaints]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }

  const getPendingComplaints = () => {
    return complaints.filter(c => c.status === 'PENDING').slice(0, 3)
  }

  // Get all notifications (recent updates across all statuses)
  const getNotifications = () => {
    const notifications = []
    
    // Add recently updated complaints (in progress)
    const inProgressComplaints = complaints
      .filter(c => c.status === 'IN_PROGRESS')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2)
    
    notifications.push(...inProgressComplaints.map(c => ({
      ...c,
      notificationType: 'IN_PROGRESS' as const,
      message: 'Your complaint is being addressed'
    })))
    
    // Add pending complaints
    const pendingComplaints = complaints
      .filter(c => c.status === 'PENDING')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
    
    notifications.push(...pendingComplaints.map(c => ({
      ...c,
      notificationType: 'PENDING' as const,
      message: 'Awaiting review'
    })))
    
    // Add recently resolved complaints
    const resolvedComplaints = complaints
      .filter(c => c.status === 'RESOLVED' && c.resolvedAt)
      .sort((a, b) => new Date(b.resolvedAt!).getTime() - new Date(a.resolvedAt!).getTime())
      .slice(0, 2)
    
    notifications.push(...resolvedComplaints.map(c => ({
      ...c,
      notificationType: 'RESOLVED' as const,
      message: 'Complaint resolved'
    })))
    
    // Sort all by most recent update
    return notifications
      .sort((a, b) => {
        const dateA = new Date(a.notificationType === 'RESOLVED' ? a.resolvedAt! : a.updatedAt)
        const dateB = new Date(b.notificationType === 'RESOLVED' ? b.resolvedAt! : b.updatedAt)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 5) // Show max 5 notifications
  }

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
      default:
        return <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
    }
  }

  const getNotificationStyle = (type: string) => {
    switch(type) {
      case 'PENDING':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
      case 'IN_PROGRESS':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/20'
      case 'RESOLVED':
        return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-900/20'
      default:
        return 'bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-900/20'
    }
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Mark all current notifications as read
  const markNotificationsAsRead = () => {
    const currentNotifications = getNotifications()
    const newReadSet = new Set(readNotifications)
    currentNotifications.forEach(notification => {
      newReadSet.add(notification.id)
    })
    setReadNotifications(newReadSet)
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newReadSet)))
  }

  // Calculate unread count
  const getUnreadCount = () => {
    const currentNotifications = getNotifications()
    return currentNotifications.filter(notification => !readNotifications.has(notification.id)).length
  }

  const totalNotifications = getNotifications().length
  const unreadCount = getUnreadCount()

  const filteredComplaints = statusFilter === 'ALL' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter)

  // Apply search filter
  const searchFilteredComplaints = filteredComplaints.filter(c => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return c.title.toLowerCase().includes(searchLower) || 
           c.description.toLowerCase().includes(searchLower) ||
           c.category.toLowerCase().includes(searchLower)
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-black dark:via-gray-950 dark:to-black">
      {/* Compact Header - Matching Admin */}
      <header className="sticky top-0 z-10 bg-white dark:bg-dark-card border-b-2 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl dark:shadow-black/50">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Complaints</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Track and manage your submissions</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications)
                    if (!showNotifications) {
                      // Mark as read when opening
                      markNotificationsAsRead()
                    }
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-red-50 dark:from-primary-900/20 dark:to-red-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {totalNotifications} {totalNotifications === 1 ? 'update' : 'updates'}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                      {getNotifications().length > 0 ? (
                        <div className="p-3 space-y-2">
                          {getNotifications().map((notification) => {
                            const isUnread = !readNotifications.has(notification.id)
                            return (
                            <button
                              key={notification.id}
                              onClick={() => {
                                navigate(`/complaints/${notification.id}`)
                                setShowNotifications(false)
                              }}
                              className={`w-full p-3 border rounded-lg transition-all text-left relative ${getNotificationStyle(notification.notificationType)} ${isUnread ? 'ring-2 ring-red-500/20' : ''}`}
                            >
                              {isUnread && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                              <div className="flex items-start gap-3">
                                {getNotificationIcon(notification.notificationType)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className={`text-sm ${isUnread ? 'font-bold' : 'font-semibold'} text-gray-900 dark:text-white truncate`}>
                                      {notification.title}
                                    </p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                      {getTimeAgo(notification.notificationType === 'RESOLVED' ? notification.resolvedAt! : notification.updatedAt)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-medium text-gray-700 dark:text-gray-300">
                                      {notification.category}
                                    </span>
                                    {notification.adminResponse && (
                                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3" />
                                        Admin replied
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Bell className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No notifications</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={logout} className="btn-secondary text-sm px-4 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Enhanced Stats Cards - Matching Admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl">
                <Clock className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Awaiting review
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl">
                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Being addressed
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-500/20 dark:bg-green-500/10 rounded-xl">
                <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% completion rate
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 to-red-50 dark:from-primary-900/20 dark:to-red-900/20 border-l-4 border-primary-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary-500/20 dark:bg-primary-500/10 rounded-xl">
                <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              All submissions
            </div>
          </div>
        </div>

        {/* 3-Column Layout - Matching Admin Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Actions */}
          <div className="space-y-4">
            {/* Create Complaint Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full card bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 border-0 text-white hover:shadow-xl hover:scale-105 transition-all p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">New Complaint</h3>
                  <p className="text-sm text-white/80">Submit an issue</p>
                </div>
              </div>
            </button>

            {/* Quick Filters */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Quick Filters</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    statusFilter === 'ALL'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All Complaints
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    statusFilter === 'PENDING'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('IN_PROGRESS')}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    statusFilter === 'IN_PROGRESS'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setStatusFilter('RESOLVED')}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    statusFilter === 'RESOLVED'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Pending Attention - if any */}
            {getPendingComplaints().length > 0 && (
              <div className="card border-2 border-yellow-200 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-900/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Pending Review</h3>
                </div>
                <div className="space-y-2">
                  {getPendingComplaints().map((complaint) => (
                    <button
                      key={complaint.id}
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="w-full p-2.5 bg-white dark:bg-gray-800 rounded-lg text-left hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate mb-1">
                        {complaint.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-2">
                {getRecentComplaints().slice(0, 3).map((complaint) => (
                  <button
                    key={complaint.id}
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate flex-1">
                        {complaint.title}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </button>
                ))}
                {getRecentComplaints().length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Complaints List */}
          <div className="lg:col-span-2" data-complaints-list>
            <div className="card">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  {statusFilter === 'ALL' ? 'All' : statusFilter.replace('_', ' ')} Complaints
                  <span className="ml-2 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-semibold">
                    {searchFilteredComplaints.length}
                  </span>
                </h3>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-900/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Complaints List */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
                </div>
              ) : searchFilteredComplaints.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'No matching complaints' : statusFilter === 'ALL' ? 'No complaints yet' : `No ${statusFilter.toLowerCase().replace('_', ' ')} complaints`}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms.'
                      : statusFilter === 'ALL' 
                        ? 'Create your first complaint to get started.'
                        : 'Try a different filter to see more complaints.'}
                  </p>
                  {statusFilter === 'ALL' && !searchQuery && (
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                      <Plus className="w-4 h-4 mr-2 inline" />
                      New Complaint
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
                  {searchFilteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg dark:hover:shadow-red-glow/30 transition-all cursor-pointer group bg-white dark:bg-gray-900/30"
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
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-medium">
                              {complaint.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <CreateComplaintModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchComplaints()
          }}
        />
      )}
    </div>
  )
}

// Simple Modal Component
function CreateComplaintModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('OTHER')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = ['HOSTEL', 'PLACEMENT', 'MENTOR', 'SYSTEM_ISSUE', 'INFRASTRUCTURE', 'ACADEMICS', 'OTHER']

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      
      setPhoto(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (title.trim().length < 5) {
      toast.error('Title must be at least 5 characters')
      return
    }
    
    if (description.trim().length < 10) {
      toast.error('Description must be at least 10 characters')
      return
    }
    
    setLoading(true)

    try {
      // Create complaint first
      const response = await complaintAPI.create({ title, description, category })
      const complaintId = response.data.complaint.id
      
      // Upload photo if selected
      if (photo) {
        await complaintAPI.uploadAttachment(complaintId, photo)
      }
      
      toast.success('Complaint created successfully!')
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-card rounded-xl max-w-2xl w-full p-6 border-2 border-gray-200 dark:border-gray-700 shadow-2xl dark:shadow-2xl dark:shadow-black/50">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">New Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
              <span className={`ml-2 text-xs ${title.length >= 5 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                ({title.length}/5 min)
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Enter complaint title (min 5 characters)"
              required
              minLength={5}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Description
              <span className={`ml-2 text-xs ${description.length >= 10 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-400'}`}>
                ({description.length}/10 min)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={6}
              placeholder="Describe your complaint in detail (min 10 characters)"
              required
              minLength={10}
            />
          </div>
          
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Photo Evidence (Optional)
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Max 5MB - JPEG, PNG, GIF, WebP</span>
            </label>
            
            {photoPreview ? (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-800"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-800 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">PNG, JPG, GIF, WebP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </div>
          
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button 
              type="submit" 
              disabled={loading || title.length < 5 || description.length < 10} 
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
