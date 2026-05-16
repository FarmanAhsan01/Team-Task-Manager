import express from 'express';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';
import projectController from '../controllers/project.controller.js';

const router = express.Router();

router.get('/debug/tasks', async (req, res) => {
  const tasks = await import('../config/database.js').then(m => m.default.task.findMany({ include: { project: true } }));
  res.json(tasks);
});

router.get('/list', projectController.listAllProjects);

router.use(authMiddleware);

router.post('/', projectController.createProject);
router.get('/team/:teamId', projectController.getTeamProjects);
router.get('/:id', projectController.getProject);
router.get('/:id/stats', projectController.getProjectStats);

router.get('/debug/tasks', async (req, res) => {
  const tasks = await import('../config/database.js').then(m => m.default.task.findMany({ include: { project: true } }));
  res.json(tasks);
});

export default router;
