import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All report routes require authentication
router.use(authenticate);

router.get('/statistics', reportController.getStatistics);
router.post('/weekly', authorize(UserRole.MANAGER, UserRole.ADMIN), reportController.generateWeeklyReport);
router.post('/monthly', authorize(UserRole.MANAGER, UserRole.ADMIN), reportController.generateMonthlyReport);
router.get('/child/:childId', reportController.getReportsByChild);
router.get('/', authorize(UserRole.ADMIN, UserRole.MANAGER), reportController.getAllReports);

export default router;

