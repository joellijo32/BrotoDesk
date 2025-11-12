import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { Plus, LogOut, Bell, FileText, Clock, CheckCircle, Upload, X, AlertCircle, TrendingUp, Calendar, Eye, ArrowRight } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin')
      return
    }
    fetchComplaints()
  }, [])

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

  const filteredComplaints = statusFilter === 'ALL' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-black dark:via-gray-950 dark:to-black">
      {/* Compact Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg dark:shadow-black/50 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">BrotoDesk</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {stats.pending}
                  </span>
                )}
              </button>
              <button onClick={logout} className="btn-secondary flex items-center gap-2 text-sm py-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <FileText className="w-5 h-5 text-primary-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Complaints</p>
            </div>
          </div>

          {/* Pending */}
          <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-l-4 border-yellow-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
            </div>
          </div>

          {/* In Progress */}
          <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-l-4 border-blue-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </div>

          {/* Resolved */}
          <div className="card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-l-4 border-green-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
            </div>
          </div>
        </div>

        {/* Action Bar with Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Complaints</h2>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300">
              {filteredComplaints.length}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === 'IN_PROGRESS'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter('RESOLVED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === 'RESOLVED'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Resolved
              </button>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              New Complaint
            </button>
          </div>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="card text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading your complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {statusFilter === 'ALL' ? 'No complaints yet' : `No ${statusFilter.toLowerCase().replace('_', ' ')} complaints`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {statusFilter === 'ALL' 
                ? 'Start by creating your first complaint. We\'re here to help resolve your issues.'
                : 'Try changing the filter to see complaints in other statuses.'}
            </p>
            {statusFilter === 'ALL' && (
              <button onClick={() => setShowModal(true)} className="btn-primary">
                <Plus className="w-5 h-5 mr-2 inline" />
                Create First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => navigate(`/complaints/${complaint.id}`)}
                className="card group hover:shadow-xl dark:hover:shadow-red-glow/30 hover:scale-[1.02] transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors mb-2 truncate">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {complaint.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-3 ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium">
                      {complaint.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary-500 dark:text-primary-400 font-medium text-sm">
                    <span className="group-hover:underline">View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Complaint Modal */}
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
