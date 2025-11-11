import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Analytics (Admin only)
router.get('/summary', authenticate, authorize('ADMIN', 'SUPERADMIN'), async (_req, res, next) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      complaintsByCategory
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.groupBy({
        by: ['category'],
        _count: true
      })
    ]);
    
    res.json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      complaintsByCategory: complaintsByCategory.map((item: any) => ({
        category: item.category,
        count: item._count
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
