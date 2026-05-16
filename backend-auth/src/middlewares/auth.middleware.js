import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";
import { extractTokenFromHeader, verifyAccessToken } from "../utils/jwt.js";
import logger from "../config/logger.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new UnauthorizedError("No authentication token provided");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    next(new UnauthorizedError(error.message));
  }
};

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Optional auth, so we continue even if token is invalid
    next();
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }
    next();
  };
};

export default {
  authMiddleware,
  optionalAuthMiddleware,
  authorizeRoles,
};
