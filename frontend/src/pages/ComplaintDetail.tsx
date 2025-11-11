import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [response, setResponse] = useState('')
  const [updating, setUpdating] = useState(false)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) fetchComplaint()
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

  const handleUpdateStatus = async () => {
    if (!complaint) return
    setUpdating(true)

    try {
      await complaintAPI.updateStatus(complaint.id, { status, adminResponse: response })
      toast.success('Complaint updated successfully')
      fetchComplaint()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REOPENED: 'bg-orange-100 text-orange-800',
      CLOSED: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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

          {complaint.adminResponse && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Admin Response</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{complaint.adminResponse}</p>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Update Complaint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REOPENED">Reopened</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="input"
                  rows={4}
                  placeholder="Add your response or notes..."
                />
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="btn-primary disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Complaint'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
