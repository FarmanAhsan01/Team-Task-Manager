import teamService from '../services/team.service.js';
import { asyncHandler, formatResponse } from '../utils/helpers.js';

export const createTeam = asyncHandler(async (req, res) => {
  const team = await teamService.createTeam(req.user.userId, req.body);
  res.status(201).json(formatResponse(team, 'Team created successfully', 201));
});

export const getMyTeams = asyncHandler(async (req, res) => {
  const teams = await teamService.getUserTeams(req.user.userId);
  res.json(formatResponse(teams, 'Teams retrieved successfully'));
});

export const getTeam = asyncHandler(async (req, res) => {
  const team = await teamService.getTeamById(req.params.id, req.user.userId);
  res.json(formatResponse(team, 'Team retrieved successfully'));
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const member = await teamService.addMember(req.params.id, req.user.userId, email, role);
  res.json(formatResponse(member, 'Member added successfully'));
});

export const getTeamReports = asyncHandler(async (req, res) => {
  const report = await teamService.getTeamReports(req.params.id, req.user.userId);
  res.json(formatResponse(report, 'Team reports retrieved successfully'));
});

export default {
  createTeam,
  getMyTeams,
  getTeam,
  addTeamMember,
  getTeamReports
};
