import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All attendance routes require authentication
router.use(authenticate);

// Manager, Guardian and Admin can mark attendance
router.post('/mark', authorize(UserRole.MANAGER, UserRole.GUARDIAN, UserRole.ADMIN), attendanceController.markAttendance);
router.put('/:id', authorize(UserRole.MANAGER, UserRole.GUARDIAN, UserRole.ADMIN), attendanceController.updateAttendance);
router.get('/child/:childId', attendanceController.getAttendanceByChild);
router.get('/daily', authorize(UserRole.MANAGER, UserRole.ADMIN), attendanceController.getDailyAttendance);
router.get('/', authorize(UserRole.ADMIN, UserRole.MANAGER), attendanceController.getAllAttendance);

export default router;

