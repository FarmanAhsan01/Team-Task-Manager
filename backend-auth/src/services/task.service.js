import prisma from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { getIO } from '../sockets/index.js';

export const computePriorityScore = ({ dueDate, estimatedHours = 1 }) => {
  const now = Date.now();
  const due = dueDate ? new Date(dueDate).getTime() : null;
  const urgency = due ? Math.max(0, 1 - (due - now) / (1000 * 60 * 60 * 24 * 30)) : 0;
  return Math.round((urgency * 100) * 0.5 + estimatedHours * 5);
};

class TaskService {
  async createTask(userId, projectId, data) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundError('Project not found');

    const priorityScore = computePriorityScore(data);
    const { dueDate, ...taskData } = data;

    const task = await prisma.task.create({
      data: {
        ...taskData,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        createdBy: userId,
        priorityScore
      },
      include: { assignee: true, creator: true }
    });

    // Realtime update
    try {
      getIO().to(`project_${projectId}`).emit('taskCreated', task);
    } catch (e) {
      // Socket not initialized or error, fail silently
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'CREATED',
        entityType: 'TASK',
        entityId: task.id,
        projectId
      }
    });

    return task;
  }

  async getTasksByUser(userId) {
    return await prisma.task.findMany({
      where: { assignedTo: userId },
      include: {
        creator: { select: { name: true } },
        project: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTasksByProject(projectId) {
    return await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        comments: { select: { id: true } }
      },
      orderBy: { priorityScore: 'desc' }
    });
  }

  async updateTaskStatus(taskId, userId, status) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundError('Task not found');

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status, completedAt: status === 'COMPLETED' ? new Date() : null },
      include: { assignee: true }
    });

    try {
      getIO().to(`project_${task.projectId}`).emit('taskUpdated', updatedTask);
    } catch (e) {}

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'STATUS_CHANGED',
        entityType: 'TASK',
        entityId: task.id,
        projectId: task.projectId,
        description: `Moved to ${status}`
      }
    });

    return updatedTask;
  }
}

export default new TaskService();
