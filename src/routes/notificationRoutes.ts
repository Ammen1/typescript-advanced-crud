import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

router.post('/send', notificationController.sendNotification);
router.get('/my', notificationController.getMyNotifications);
router.get('/sent', notificationController.getSentNotifications);
router.put('/:id/read', notificationController.markNotificationAsRead);
router.get('/unread/count', notificationController.getUnreadNotificationCount);
router.delete('/:id', notificationController.deleteNotification);

export default router;

