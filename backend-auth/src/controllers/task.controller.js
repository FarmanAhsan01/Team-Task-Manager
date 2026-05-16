import taskService from '../services/task.service.js';
import { asyncHandler, formatResponse } from '../utils/helpers.js';

export const createTask = asyncHandler(async (req, res) => {
  const { projectId, ...taskData } = req.body;
  const task = await taskService.createTask(req.user.userId, projectId, taskData);
  res.status(201).json(formatResponse(task, 'Task created successfully', 201));
});

export const getProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByProject(req.params.projectId);
  res.json(formatResponse(tasks, 'Tasks retrieved successfully'));
});

export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByUser(req.user.userId);
  res.json(formatResponse(tasks, 'My tasks retrieved successfully'));
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await taskService.updateTaskStatus(req.params.id, req.user.userId, status);
  res.json(formatResponse(task, 'Task status updated'));
});

export default {
  createTask,
  getProjectTasks,
  getMyTasks,
  updateTaskStatus
};
