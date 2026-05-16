import authService from "../services/auth.service.js";
import { asyncHandler, formatResponse } from "../utils/helpers.js";
import logger from "../config/logger.js";

export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name, role, projectId } = req.body;

  const result = await authService.register(email, password, name, role, projectId);

  res.status(201).json(
    formatResponse(
      result,
      "User registered successfully",
      201
    )
  );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.validatedData;

  const result = await authService.login(email, password);

  // Set refresh token in secure cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json(formatResponse(result, "User logged in successfully"));
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  const tokens = await authService.refreshAccessToken(refreshToken);

  res.json(formatResponse(tokens, "Token refreshed successfully"));
});

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("refreshToken");

  res.json(formatResponse({}, "Logged out successfully"));
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.validatedData;
  const userId = req.user.userId;

  const result = await authService.changePassword(
    userId,
    oldPassword,
    newPassword
  );

  res.json(formatResponse(result, result.message));
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await authService.getAllUsers();
  res.json(formatResponse(users, "Users fetched successfully"));
});

export default {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  getAllUsers,
};
