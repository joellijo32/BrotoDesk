import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Validation schema
const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['HOSTEL', 'PLACEMENT', 'MENTOR', 'SYSTEM_ISSUE', 'INFRASTRUCTURE', 'ACADEMICS', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REOPENED', 'CLOSED']),
  adminResponse: z.string().optional()
});

// Create complaint (Student only)
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    console.log('Received complaint data:', req.body); // Debug log
    const data = createComplaintSchema.parse(req.body);
    
    console.log('Creating complaint with data:', data); // Debug log
    
    const complaint = await prisma.complaint.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        studentId: req.user!.id
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true
          }
        }
      }
    });
    
    console.log('Complaint created:', complaint); // Debug log
    
    // Create notification for admins
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPERADMIN'] } },
      select: { id: true }
    });
    
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin: { id: string }) => ({
          userId: admin.id,
          type: 'NEW_COMPLAINT',
          message: `New complaint: ${complaint.title}`
        }))
      });
    }
    
    res.status(201).json({
      message: 'Complaint created successfully',
      complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error); // Debug log
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
    }
    next(error);
  }
});

// Get all complaints
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { status, category, page = '1', limit = '10' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    
    // Students see only their complaints
    if (req.user!.role === 'STUDENT') {
      where.studentId = req.user!.id;
    }
    
    if (status) where.status = status;
    if (category) where.category = category;
    
    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true
            }
          },
          assignedAdmin: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          attachments: true
        }
      }),
      prisma.complaint.count({ where })
    ]);
    
    res.json({
      complaints,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single complaint
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true
          }
        },
        assignedAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        attachments: true
      }
    });
    
    if (!complaint) {
      throw new AppError('Complaint not found', 404);
    }
    
    // Students can only see their own complaints
    if (req.user!.role === 'STUDENT' && complaint.studentId !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }
    
    res.json({ complaint });
  } catch (error) {
    next(error);
  }
});

// Update complaint status (Admin only)
router.post('/:id/status', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const data = updateStatusSchema.parse(req.body);
    
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        status: data.status,
        adminResponse: data.adminResponse,
        resolvedAt: data.status === 'RESOLVED' ? new Date() : undefined
      },
      include: {
        student: true
      }
    });
    
    // Create notification for student
    await prisma.notification.create({
      data: {
        userId: complaint.studentId,
        type: 'COMPLAINT_UPDATE',
        message: `Your complaint "${complaint.title}" status changed to ${data.status}`
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_COMPLAINT_STATUS',
        targetType: 'COMPLAINT',
        targetId: complaint.id,
        details: { status: data.status, adminResponse: data.adminResponse }
      }
    });
    
    res.json({
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
});

// Assign complaint (Admin only)
router.post('/:id/assign', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { adminId } = req.body;
    
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        assignedAdminId: adminId
      }
    });
    
    res.json({
      message: 'Complaint assigned successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
});

export default router;
