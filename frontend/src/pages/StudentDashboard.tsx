import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { Plus, LogOut, Bell, FileText, Clock, CheckCircle, Upload, X } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
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
    resolved: complaints.filter(c => c.status === 'RESOLVED').length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-black dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg dark:shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BrotoDesk</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button onClick={logout} className="btn-secondary flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <FileText className="w-10 h-10 text-primary-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Complaints</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Complaint
          </button>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No complaints yet</p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4"
            >
              Create your first complaint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div 
                key={complaint.id}
                onClick={() => navigate(`/complaints/${complaint.id}`)}
                className="card hover:shadow-lg dark:hover:shadow-red-glow/30 transition-all cursor-pointer border-2 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{complaint.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded">{complaint.category}</span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
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
