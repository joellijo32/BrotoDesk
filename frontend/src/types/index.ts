export interface User {
  id: string
  name: string
  email: string
  studentId?: string
  role: 'STUDENT' | 'ADMIN' | 'SUPERADMIN'
  createdAt: string
}

export interface Complaint {
  id: string
  studentId: string
  title: string
  description: string
  category: ComplaintCategory
  priority: Priority
  status: ComplaintStatus
  adminResponse?: string
  assignedAdminId?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  student: {
    id: string
    name: string
    email: string
    studentId?: string
  }
  assignedAdmin?: {
    id: string
    name: string
    email: string
  }
  attachments: Attachment[]
}

export type ComplaintCategory = 
  | 'HOSTEL' 
  | 'PLACEMENT' 
  | 'MENTOR' 
  | 'SYSTEM_ISSUE' 
  | 'INFRASTRUCTURE' 
  | 'ACADEMICS' 
  | 'OTHER'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export type ComplaintStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'REOPENED' 
  | 'CLOSED'

export interface Attachment {
  id: string
  complaintId: string
  fileName: string
  fileKey: string
  mimeType: string
  fileSize: number
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  message: string
  payload?: any
  read: boolean
  createdAt: string
}
