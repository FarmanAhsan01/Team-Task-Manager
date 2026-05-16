import prisma from "../config/database.js";
import { PRIORITY_WEIGHTS } from "../utils/constants.js";
import logger from "../config/logger.js";

/**
 * Smart Task Prioritization Service
 * Calculates priority scores based on:
 * - Deadline urgency (40%)
 * - Task complexity (30%)
 * - Dependencies (20%)
 * - Task severity (10%)
 */
export class TaskPrioritizationService {
  /**
   * Calculate priority score for a single task
   */
  calculatePriorityScore(task) {
    const now = new Date();
    const dueDate = new Date(task.dueDate);

    // 1. Deadline Urgency (0-1 scale, higher = more urgent)
    let deadlineUrgency = 0;
    if (task.dueDate) {
      const daysUntilDue = Math.ceil(
        (dueDate - now) / (1000 * 60 * 60 * 24)
      );
      // Overdue = 1, due today = 0.9, due in 7 days = 0.5, etc.
      deadlineUrgency = Math.max(0, Math.min(1, 1 - daysUntilDue / 30));
    }

    // 2. Task Complexity (0-1 scale based on estimated hours)
    const complexity = task.estimatedHours
      ? Math.min(1, task.estimatedHours / 40)
      : 0.5;

    // 3. Dependencies Count (0-1 scale)
    const dependencyCount = task.dependencies?.length || 0;
    const dependencies = Math.min(1, dependencyCount / 5);

    // 4. Priority Level Multiplier
    const priorityMap = {
      LOW: 0.2,
      MEDIUM: 0.5,
      HIGH: 0.8,
      CRITICAL: 1.0,
    };
    const priorityMultiplier = priorityMap[task.priority] || 0.5;

    // Calculate weighted score
    const score =
      deadlineUrgency * PRIORITY_WEIGHTS.DEADLINE_URGENCY * 100 +
      complexity * PRIORITY_WEIGHTS.COMPLEXITY * 100 +
      dependencies * PRIORITY_WEIGHTS.DEPENDENCIES * 100 +
      priorityMultiplier * PRIORITY_WEIGHTS.SEVERITY * 100;

    return Math.round(score);
  }

  /**
   * Recalculate and update priority scores for all tasks in a project
   */
  async updateProjectTaskPriorities(projectId) {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: { dependencies: true },
      });

      for (const task of tasks) {
        const priorityScore = this.calculatePriorityScore(task);

        await prisma.task.update({
          where: { id: task.id },
          data: { priorityScore },
        });
      }

      logger.info(
        `Updated priority scores for ${tasks.length} tasks in project ${projectId}`
      );

      return tasks.length;
    } catch (error) {
      logger.error("Error updating task priorities:", error);
      throw error;
    }
  }

  /**
   * Get tasks sorted by priority score (highest priority first)
   */
  async getTasksByPriority(projectId, status = null) {
    try {
      const whereCondition = { projectId };
      if (status) {
        whereCondition.status = status;
      }

      const tasks = await prisma.task.findMany({
        where: whereCondition,
        orderBy: { priorityScore: "desc" },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          dependencies: true,
        },
      });

      return tasks;
    } catch (error) {
      logger.error("Error fetching tasks by priority:", error);
      throw error;
    }
  }

  /**
   * Suggest task reordering based on new priorities
   */
  async suggestTaskReordering(projectId) {
    try {
      // Get all non-completed tasks
      const tasks = await prisma.task.findMany({
        where: {
          projectId,
          status: { not: "COMPLETED" },
        },
        include: { dependencies: true },
        orderBy: { priorityScore: "desc" },
      });

      // Group by status
      const grouped = {
        TODO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        TESTING: [],
        BLOCKED: [],
      };

      tasks.forEach(task => {
        if (grouped[task.status]) {
          grouped[task.status].push({
            id: task.id,
            title: task.title,
            priorityScore: task.priorityScore,
            priority: task.priority,
            dueDate: task.dueDate,
            estimatedHours: task.estimatedHours,
          });
        }
      });

      return grouped;
    } catch (error) {
      logger.error("Error suggesting task reordering:", error);
      throw error;
    }
  }

  /**
   * Get high-priority tasks that need attention
   */
  async getHighPriorityTasks(projectId, threshold = 70) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          projectId,
          priorityScore: { gte: threshold },
          status: { not: "COMPLETED" },
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { priorityScore: "desc" },
        take: 10,
      });

      return tasks;
    } catch (error) {
      logger.error("Error fetching high-priority tasks:", error);
      throw error;
    }
  }

  /**
   * Calculate priority metrics for a project
   */
  async getProjectPriorityMetrics(projectId) {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
      });

      if (tasks.length === 0) {
        return {
          averagePriority: 0,
          highPriorityCount: 0,
          criticalCount: 0,
          averageScore: 0,
        };
      }

      const scores = tasks.map(t => t.priorityScore);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      const criticalCount = tasks.filter(
        t => t.priorityScore >= 90
      ).length;
      const highPriorityCount = tasks.filter(
        t => t.priorityScore >= 70 && t.priorityScore < 90
      ).length;

      return {
        averageScore: Math.round(averageScore),
        highPriorityCount,
        criticalCount,
        totalTasks: tasks.length,
        distribution: {
          critical: `${Math.round((criticalCount / tasks.length) * 100)}%`,
          high: `${Math.round((highPriorityCount / tasks.length) * 100)}%`,
        },
      };
    } catch (error) {
      logger.error("Error calculating priority metrics:", error);
      throw error;
    }
  }
}

export default new TaskPrioritizationService();
