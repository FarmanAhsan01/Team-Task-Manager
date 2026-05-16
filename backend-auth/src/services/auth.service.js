import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { generateTokens } from "../utils/jwt.js";
import { UnauthorizedError, ConflictError, NotFoundError } from "../utils/errors.js";
import logger from "../config/logger.js";
import { ROLES } from "../utils/constants.js";

export class AuthService {
  async register(email, password, name, role, projectId) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError("Email already registered");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
          role: role || 'MEMBER',
        },
      });

      // If joining a project, add to the project's team
      if (role === 'MEMBER' && projectId) {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { teamId: true }
        });

        if (project) {
          await prisma.teamMember.create({
            data: {
              userId: user.id,
              teamId: project.teamId,
              role: 'MEMBER'
            }
          });
        }
      }

      logger.info(`New user registered: ${email}`);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(
        user.id,
        user.email,
        user.role
      );

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      if (user.status === "SUSPENDED") {
        throw new UnauthorizedError("Account is suspended");
      }

      logger.info(`User logged in: ${email}`);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(
        user.id,
        user.email,
        user.role
      );

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedError("Refresh token required");
      }

      // Verify refresh token
      const decoded = require("../utils/jwt.js").verifyRefreshToken(refreshToken);

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Generate new tokens
      const tokens = generateTokens(user.id, user.email, user.role);

      logger.info(`Token refreshed for user: ${user.email}`);

      return tokens;
    } catch (error) {
      logger.error("Token refresh error:", error);
      throw new UnauthorizedError(error.message);
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Verify old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError("Current password is incorrect");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      logger.info(`Password changed for user: ${user.email}`);

      return { message: "Password changed successfully" };
    } catch (error) {
      logger.error("Password change error:", error);
      throw error;
    }
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true
      }
    });
    console.log('Fetched users:', users.length);
    return users;
  }
}

export default new AuthService();
