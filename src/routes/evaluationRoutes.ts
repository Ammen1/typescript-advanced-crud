import { Router } from 'express';
import * as evaluationController from '../controllers/evaluationController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All evaluation routes require authentication
router.use(authenticate);

router.post('/create', authorize(UserRole.MANAGER, UserRole.GUARDIAN, UserRole.ADMIN), evaluationController.createEvaluation);
router.get('/child/:childId', evaluationController.getEvaluationsByChild);
router.get('/all', authorize(UserRole.ADMIN, UserRole.MANAGER), evaluationController.getAllEvaluations);
router.get('/:id', evaluationController.getEvaluationById);
router.put('/:id', authorize(UserRole.MANAGER, UserRole.GUARDIAN, UserRole.ADMIN), evaluationController.updateEvaluation);
router.delete('/:id', authorize(UserRole.MANAGER, UserRole.GUARDIAN, UserRole.ADMIN), evaluationController.deleteEvaluation);

export default router;

