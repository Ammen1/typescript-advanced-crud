import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.post('/create', authorize(UserRole.ADMIN), userController.createAccount);
router.get('/employees', authorize(UserRole.ADMIN), userController.getEmployees);

// Admin routes
router.get('/', authorize(UserRole.ADMIN), userController.getAllUsers);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.MANAGER), userController.getUserById);
router.put('/:id', authorize(UserRole.ADMIN), userController.updateUser);
router.delete('/:id', authorize(UserRole.ADMIN), userController.deleteUser);
router.put('/:id/status', authorize(UserRole.ADMIN), userController.activateOrDeactivateUser);

export default router;

