import prisma from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

class TeamService {
  async createTeam(userId, data) {
    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        createdBy: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: true
      }
    });
    return team;
  }

  async getTeamById(teamId, userId) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true, projects: true }
    });

    if (!team) throw new NotFoundError('Team not found');
    
    const isMember = team.members.some(m => m.userId === userId);
    if (!isMember) throw new ForbiddenError('You are not a member of this team');

    return team;
  }

  async getUserTeams(userId) {
    return await prisma.team.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        _count: {
          select: { members: true, projects: true }
        }
      }
    });
  }

  async addMember(teamId, inviterId, email, role = 'DEVELOPER') {
    // Validate inviter is Admin/Manager
    const inviter = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: inviterId } }
    });
    if (!inviter || !['ADMIN', 'MANAGER'].includes(inviter.role)) {
      throw new ForbiddenError('Only team admins can add members');
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) throw new NotFoundError('User with this email not found');

    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: userToAdd.id,
        role
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    return newMember;
  }

  async getTeamReports(teamId, requesterId) {
    // Validate requester is member
    const requester = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: requesterId } }
    });
    if (!requester) throw new ForbiddenError('Access denied');

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            tasksAssigned: {
              where: {
                project: { teamId }
              },
              select: {
                status: true,
                dueDate: true
              }
            }
          }
        }
      }
    });

    const report = members.map(m => {
      const tasks = m.user.tasksAssigned;
      const completed = tasks.filter(t => t.status === 'COMPLETED').length;
      const active = tasks.filter(t => t.status !== 'COMPLETED').length;
      const overdue = tasks.filter(t => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < new Date()).length;
      const total = tasks.length;
      const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: m.user.id,
        name: m.user.name,
        avatar: m.user.avatar,
        role: m.role,
        completed,
        active,
        overdue,
        productivity
      };
    });

    return report;
  }
}

export default new TeamService();
