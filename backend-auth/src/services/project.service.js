import prisma from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

class ProjectService {
  async createProject(userId, teamId, data) {
    try {
      // Magic handling for mock teams
      if (teamId && teamId.startsWith('mock-')) {
        const mockTeams = {
          'mock-1': 'Engineering Alpha',
          'mock-2': 'Design Systems',
          'mock-3': 'Product Strategy',
          'mock-4': 'Marketing Hub'
        };
        const teamName = mockTeams[teamId] || 'My Team';
        
        const newTeam = await prisma.team.create({
          data: {
            name: teamName,
            createdBy: userId,
            members: {
              create: { userId, role: 'ADMIN' }
            }
          }
        });
        teamId = newTeam.id;
      } else {
        // Verify user is in team
        const teamMember = await prisma.teamMember.findUnique({
          where: { teamId_userId: { teamId, userId } }
        });
        if (!teamMember || !['ADMIN', 'MANAGER'].includes(teamMember.role)) {
          throw new ForbiddenError('You must be a team manager to create projects');
        }
      }

      const { deadline, ...projectData } = data;

      return await prisma.project.create({
        data: {
          ...projectData,
          deadline: deadline ? new Date(deadline) : null,
          teamId,
          createdBy: userId,
        }
      });
    } catch (error) {
      console.error('Error in createProject service:', error);
      throw error;
    }
  }

  async getProjectsByTeam(teamId, userId) {
    const teamMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } }
    });
    if (!teamMember) throw new ForbiddenError('Access denied');

    return await prisma.project.findMany({
      where: { teamId },
      include: {
        _count: { select: { tasks: true } }
      }
    });
  }

  async getProjectDetails(projectId, userId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: { include: { members: true } },
        tasks: true
      }
    });

    if (!project) throw new NotFoundError('Project not found');
    
    const isMember = project.team.members.some(m => m.userId === userId);
    if (!isMember) throw new ForbiddenError('Access denied');

    return project;
  }

  async getProjectStats(projectId) {
    console.log('Calculating stats for project:', projectId);
    const total = await prisma.task.count({ where: { projectId } });
    const completed = await prisma.task.count({ where: { projectId, status: 'COMPLETED' } });
    const inProgress = await prisma.task.count({ 
      where: { 
        projectId, 
        status: { in: ['IN_PROGRESS', 'REVIEW'] } 
      } 
    });
    const overdue = await prisma.task.count({
      where: {
        projectId,
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() }
      }
    });

    const stats = { total, completed, inProgress, overdue };
    console.log('Stats result:', stats);
    return stats;
  }

  async listAllProjects() {
    return await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        teamId: true
      }
    });
  }
}

export default new ProjectService();
