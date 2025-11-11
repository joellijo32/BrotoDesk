import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { ArrowLeft, User, Calendar, Tag, Image as ImageIcon } from 'lucide-react'

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

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border border-blue-300',
      RESOLVED: 'bg-green-100 text-green-800 border border-green-300'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!complaint) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
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

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Photo Evidence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="relative group">
                    <img
                      src={`http://localhost:5000/uploads/${attachment.fileKey}`}
                      alt={attachment.fileName}
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                      <p className="text-sm truncate">{attachment.fileName}</p>
                      <p className="text-xs text-gray-300">
                        {(attachment.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {complaint.adminResponse && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Admin Response</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{complaint.adminResponse}</p>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Update Complaint Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                  <span className="ml-2 text-xs text-gray-500">(Current: {complaint.status.replace('_', ' ')})</span>
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
                  <option value="PENDING">Pending - Waiting for review</option>
                  <option value="IN_PROGRESS">In Progress - Working on it</option>
                  <option value="RESOLVED">Resolved - Issue fixed</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {status === 'PENDING' && 'Complaint received, awaiting action'}
                  {status === 'IN_PROGRESS' && 'Admin is actively working on this complaint'}
                  {status === 'RESOLVED' && 'Issue has been fixed and complaint is closed'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Response
                  <span className="ml-1 text-red-500">*</span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
