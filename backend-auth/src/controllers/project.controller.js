import projectService from '../services/project.service.js';
import { asyncHandler, formatResponse } from '../utils/helpers.js';

export const createProject = asyncHandler(async (req, res) => {
  const { teamId, ...projectData } = req.body;
  const project = await projectService.createProject(req.user.userId, teamId, projectData);
  res.status(201).json(formatResponse(project, 'Project created successfully', 201));
});

export const getTeamProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjectsByTeam(req.params.teamId, req.user.userId);
  res.json(formatResponse(projects, 'Projects retrieved successfully'));
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectDetails(req.params.id, req.user.userId);
  res.json(formatResponse(project, 'Project details retrieved'));
});

export const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await projectService.getProjectStats(req.params.id);
  res.json(formatResponse(stats, 'Project stats retrieved successfully'));
});

export const listAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listAllProjects();
  res.json(formatResponse(projects, 'All projects retrieved'));
});

export default {
  createProject,
  getTeamProjects,
  getProject,
  getProjectStats,
  listAllProjects
};
