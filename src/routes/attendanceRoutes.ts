import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All attendance routes require authentication
router.use(authenticate);

// Manager and Guardian can mark attendance (Admin removed)
router.post('/mark', authorize(UserRole.MANAGER, UserRole.GUARDIAN), attendanceController.markAttendance);
router.put('/:id', authorize(UserRole.MANAGER, UserRole.GUARDIAN), attendanceController.updateAttendance);
router.get('/child/:childId', attendanceController.getAttendanceByChild);
router.get('/daily', authorize(UserRole.MANAGER), attendanceController.getDailyAttendance);
router.get('/', authorize(UserRole.MANAGER), attendanceController.getAllAttendance);

export default router;

