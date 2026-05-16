import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import taskController from '../controllers/task.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/me', taskController.getMyTasks);
router.get('/project/:projectId', taskController.getProjectTasks);
router.patch('/:id/status', taskController.updateTaskStatus);

export default router;
