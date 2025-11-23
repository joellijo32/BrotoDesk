import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI, BASE_URL } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { ArrowLeft, User, Calendar, Tag, Image as ImageIcon, Download, Eye, Trash2 } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import ImageViewer from '../components/ImageViewer'

interface Attachment {
  id: string
  fileName: string
  fileKey: string
  mimeType: string
  fileSize: number
  createdAt: string
}

export default function ComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [response, setResponse] = useState('')
  const [updating, setUpdating] = useState(false)
  const [viewerImage, setViewerImage] = useState<string | null>(null)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchComplaint()
      fetchAttachments()
    }
  }, [id])

  const fetchComplaint = async () => {
    try {
      const { data } = await complaintAPI.getOne(id!)
      setComplaint(data.complaint)
      setStatus(data.complaint.status)
      setResponse(data.complaint.adminResponse || '')
    } catch (error) {
      toast.error('Failed to load complaint')
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttachments = async () => {
    try {
      const { data } = await complaintAPI.getAttachments(id!)
      setAttachments(data.attachments)
    } catch (error) {
      console.error('Failed to load attachments:', error)
    }
  }

  const handleUpdateStatus = async () => {
    if (!complaint) return
    setUpdating(true)

    try {
      await complaintAPI.updateStatus(complaint.id, { status, adminResponse: response })
      toast.success('Complaint updated successfully')
      // Navigate back to admin dashboard after successful update
      navigate('/admin')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Update failed')
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!complaint) return
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return

    try {
      await complaintAPI.delete(complaint.id)
      toast.success('Complaint deleted successfully')
      navigate('/admin')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Delete failed')
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

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!complaint) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{complaint.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {complaint.student.name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {complaint.category}
                </div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>

          <div className="border-t dark:border-gray-800 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-400 whitespace-pre-wrap">{complaint.description}</p>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="border-t dark:border-gray-800 pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Photo Evidence ({attachments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((attachment) => {
                  const imageUrl = attachment.fileKey.startsWith('http') 
                    ? attachment.fileKey 
                    : `${BASE_URL}/uploads/${attachment.fileKey}`
                  
                  return (
                    <div key={attachment.id} className="relative group overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all bg-gray-100 dark:bg-gray-800">
                      <img
                        src={imageUrl}
                        alt={attachment.fileName}
                        className="w-full h-64 object-cover cursor-pointer transition-transform group-hover:scale-105"
                        onDoubleClick={() => setViewerImage(imageUrl)}
                        title="Double-click to view full screen"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400/1f2937/ffffff?text=Image+Expired';
                          e.currentTarget.onerror = null; // Prevent infinite loop
                        }}
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                          <p className="text-white font-medium text-sm truncate mb-2">{attachment.fileName}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-300">
                              {(attachment.fileSize / 1024).toFixed(1)} KB
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setViewerImage(imageUrl)
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  try {
                                    const response = await fetch(imageUrl)
                                    const blob = await response.blob()
                                    const url = window.URL.createObjectURL(blob)
                                    const link = document.createElement('a')
                                    link.href = url
                                    link.download = attachment.fileName
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                    window.URL.revokeObjectURL(url)
                                    toast.success('Image downloaded successfully')
                                  } catch (error) {
                                    toast.error('Download failed')
                                  }
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {complaint.adminResponse && (
            <div className="border-t dark:border-gray-800 pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Admin Response</h3>
              <p className="text-gray-700 dark:text-gray-400 whitespace-pre-wrap">{complaint.adminResponse}</p>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="card">
            <h2 className="text-xl font-bold dark:text-white mb-4">Update Complaint Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Status
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Current: {complaint.status.replace('_', ' ')})</span>
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
                  <option value="PENDING">Pending - Waiting for review</option>
                  <option value="IN_PROGRESS">In Progress - Working on it</option>
                  <option value="RESOLVED">Resolved - Issue fixed</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {status === 'PENDING' && 'Complaint received, awaiting action'}
                  {status === 'IN_PROGRESS' && 'Admin is actively working on this complaint'}
                  {status === 'RESOLVED' && 'Issue has been fixed and complaint is closed'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Admin Response
                  <span className="ml-1 text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="input"
                  rows={4}
                  required
                />
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || !response.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {updating ? 'Updating...' : 'Update & Notify Student'}
              </button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Complaint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {viewerImage && (
        <ImageViewer
          imageUrl={viewerImage}
          altText={complaint?.title || 'Complaint Image'}
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  )
}
