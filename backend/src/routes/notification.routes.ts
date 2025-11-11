import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get user's notifications
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.id, read: false }
    });
    
    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
});

// Mark notifications as read
router.post('/mark-read', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { notificationIds } = req.body;
    
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: req.user!.id
      },
      data: { read: true }
    });
    
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

export default router;
