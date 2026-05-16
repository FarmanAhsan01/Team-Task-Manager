import express from 'express';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';
import teamController from '../controllers/team.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', teamController.createTeam);
router.get('/', teamController.getMyTeams);
router.get('/:id', teamController.getTeam);
router.post('/:id/members', authorizeRoles('ADMIN', 'MANAGER', 'LEAD'), teamController.addTeamMember);
router.get('/:id/reports', authorizeRoles('ADMIN', 'MANAGER', 'LEAD'), teamController.getTeamReports);

export default router;
