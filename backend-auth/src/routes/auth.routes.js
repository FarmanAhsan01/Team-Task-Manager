import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/index.js";
import {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  getAllUsers,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/register", validationMiddleware(registerSchema), register);
router.post("/login", validationMiddleware(loginSchema), login);
router.post("/refresh-token", validationMiddleware(refreshTokenSchema), refreshToken);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.post("/change-password", authMiddleware, changePassword);
router.get("/users", authMiddleware, getAllUsers);

export default router;
