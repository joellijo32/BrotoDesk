import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI, analyticsAPI } from '../lib/api'
import { Complaint } from '../types'
import toast from 'react-hot-toast'
import { LogOut, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const { logout } = useAuth()
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage and resolve complaints</p>
            </div>
            <button onClick={logout} className="btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalComplaints}</p>
                </div>
                <FileText className="w-10 h-10 text-primary-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingComplaints}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgressComplaints}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolvedComplaints}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Complaints</h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-dark-card">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-800">
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-black/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{complaint.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{complaint.student.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{complaint.student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded">{complaint.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/complaints/${complaint.id}`)}
                          className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-500 text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
