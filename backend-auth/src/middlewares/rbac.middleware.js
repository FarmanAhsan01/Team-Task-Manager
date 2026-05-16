import { ForbiddenError } from "../utils/errors.js";
import { ROLE_PERMISSIONS } from "../utils/constants.js";
import logger from "../config/logger.js";

export const rbacMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError("User not authenticated");
      }

      const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
      
      if (!userPermissions.includes(requiredPermission)) {
        logger.warn(
          `RBAC denied: User ${req.user.userId} (${req.user.role}) tried to access ${requiredPermission}`
        );
        throw new ForbiddenError(
          `You don't have permission to perform this action`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const roleBasedMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError("User not authenticated");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Only users with roles [${allowedRoles.join(", ")}] can access this`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default {
  rbacMiddleware,
  roleBasedMiddleware,
};
