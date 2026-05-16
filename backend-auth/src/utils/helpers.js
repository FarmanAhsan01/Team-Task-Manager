export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const calculatePriorityScore = (task, project) => {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  
  // Calculate deadline urgency (0-1 scale, 1 = today, 0 = far away)
  const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
  const deadlineUrgency = Math.max(0, Math.min(1, 1 - daysUntilDue / 30));
  
  // Complexity (0-1 scale based on estimated hours)
  const complexity = task.estimatedHours ? Math.min(1, task.estimatedHours / 40) : 0.5;
  
  // Dependencies count (0-1 scale)
  const dependencyCount = task.dependencies?.length || 0;
  const dependencies = Math.min(1, dependencyCount / 5);
  
  // Priority multiplier
  const priorityMap = { LOW: 0.2, MEDIUM: 0.5, HIGH: 0.8, CRITICAL: 1 };
  const priorityMultiplier = priorityMap[task.priority] || 0.5;
  
  // Calculate score with weights
  const score = (
    deadlineUrgency * 40 +
    complexity * 30 +
    dependencies * 20 +
    priorityMultiplier * 10
  );
  
  return Math.round(score);
};

export const calculateWorkloadScore = (tasks) => {
  let score = 0;
  
  // Count active tasks
  score += tasks.filter(t => t.status !== 'COMPLETED').length;
  
  // Weight overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED'
  );
  score += overdueTasks.length * 2;
  
  // Add estimated hours
  score += tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  
  return score;
};

export const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

export const formatResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date() && dueDate;
};

export const getDaysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
};

export const checkPermission = (userRole, requiredPermission, rolePermissions) => {
  const userPermissions = rolePermissions[userRole] || [];
  return userPermissions.includes(requiredPermission);
};

export default {
  asyncHandler,
  calculatePriorityScore,
  calculateWorkloadScore,
  getPaginationParams,
  formatResponse,
  isOverdue,
  getDaysRemaining,
  checkPermission,
};
