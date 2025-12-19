import { Router } from 'express';
import * as childController from '../controllers/childController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All child routes require authentication
router.use(authenticate);

// Only Manager can register/manage children (Admins removed)
router.post('/register', authorize(UserRole.MANAGER), childController.registerChild);
router.get('/my-children', childController.getMyChildren);
router.get('/all', authorize(UserRole.MANAGER, UserRole.GUARDIAN), childController.getAllChildren);
router.get('/registration/:registrationNumber', childController.getChildByRegistrationNumber);
router.get('/:id', childController.getChildById);
router.put('/:id', authorize(UserRole.MANAGER, UserRole.FAMILY), childController.updateChild);
router.put('/:id/delete', authorize(UserRole.MANAGER), childController.deleteChild);

export default router;

