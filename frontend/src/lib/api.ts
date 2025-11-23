import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string; studentId?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getCurrentUser: () => api.get('/users/me'),
}

// Complaint APIs
export const complaintAPI = {
  create: (data: { title: string; description: string; category: string; priority?: string }) =>
    api.post('/complaints', data),
  
  getAll: (params?: { status?: string; category?: string; page?: number; limit?: number }) =>
    api.get('/complaints', { params }),
  
  getOne: (id: string) => api.get(`/complaints/${id}`),
  
  updateStatus: (id: string, data: { status: string; adminResponse?: string }) =>
    api.post(`/complaints/${id}/status`, data),
  
  delete: (id: string) => api.delete(`/complaints/${id}`),

  assign: (id: string, adminId: string) =>
    api.post(`/complaints/${id}/assign`, { adminId }),
  
  // Attachment APIs
  uploadAttachment: (complaintId: string, file: File) => {
    const formData = new FormData()
    formData.append('photo', file)
    return api.post(`/complaints/${complaintId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  getAttachments: (complaintId: string) =>
    api.get(`/complaints/${complaintId}/attachments`),
  
  deleteAttachment: (attachmentId: string) =>
    api.delete(`/complaints/attachments/${attachmentId}`),
}

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  
  markAsRead: (notificationIds: string[]) =>
    api.post('/notifications/mark-read', { notificationIds }),
}

// Analytics APIs
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
}
