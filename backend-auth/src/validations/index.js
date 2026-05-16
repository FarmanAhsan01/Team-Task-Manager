import Joi from "joi";

// Auth Validations
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Lowered to 6 to match typical dev needs
  name: Joi.string().min(2).max(255).required(),
  role: Joi.string().valid('ADMIN', 'MEMBER', 'DEVELOPER').default('MEMBER'),
  projectId: Joi.string().allow(null, ''),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Team Validations
export const createTeamSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000),
  avatar: Joi.string().uri(),
});

export const updateTeamSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  description: Joi.string().max(1000),
  avatar: Joi.string().uri(),
});

// Project Validations
export const createProjectSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000),
  teamId: Joi.string().required(),
  deadline: Joi.date(),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL"),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  description: Joi.string().max(1000),
  deadline: Joi.date(),
  status: Joi.string().valid("PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL"),
});

// Task Validations
export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(5000),
  projectId: Joi.string().required(),
  assignedTo: Joi.string(),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL"),
  dueDate: Joi.date(),
  estimatedHours: Joi.number().positive(),
  labels: Joi.array().items(Joi.string()),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().max(5000),
  status: Joi.string().valid("TODO", "IN_PROGRESS", "IN_REVIEW", "TESTING", "COMPLETED", "BLOCKED"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL"),
  assignedTo: Joi.string(),
  dueDate: Joi.date(),
  estimatedHours: Joi.number().positive(),
  actualHours: Joi.number().positive(),
  labels: Joi.array().items(Joi.string()),
});

// Pagination Query
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string(),
  search: Joi.string(),
});

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  createTeamSchema,
  updateTeamSchema,
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  paginationSchema,
};
