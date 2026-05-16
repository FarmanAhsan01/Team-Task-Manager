import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const genrateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.genrateAccessToken();
  const refreshToken = user.genrateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = async (req, res, next) => {
  try {
    const { email, password, fullName, username } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ username: username || email }, { email }] });
    if (existedUser) {
      return res.status(409).json({ message: "User with this email or username already exist" });
    }
    
    // Create new user with generated username if not provided
    const user = await User.create({ 
      fullName: fullName || email.split('@')[0],
      email, 
      username: (username || email.split('@')[0]).toLowerCase(), 
      password 
    });
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    const { accessToken, refreshToken } = await genrateAccessTokenAndRefreshToken(user._id);
    
    return res.status(201).json({ 
      user: createdUser, 
      accessToken,
      refreshToken,
      message: "User registered Successfully" 
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!username && !email) return res.status(400).json({ message: "username or email is required" });
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(404).json({ message: "user does not exist" });
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) return res.status(401).json({ message: "invalid User Credentials" });
    const { accessToken, refreshToken } = await genrateAccessTokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({ user: loggedInUser, accessToken, refreshToken, message: "User Logged in Successfully" });
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    if (req.user?._id) await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    const options = { httpOnly: true, secure: false };
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({ message: "User Logged Out" });
  } catch (err) {
    next(err);
  }
};

const refrehAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) return res.status(401).json({ message: "unauthorized request" });
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });
    if (incomingRefreshToken !== user.refreshToken) return res.status(401).json({ message: "Refresh token is expired or used" });
    const { accessToken, refreshToken } = await genrateAccessTokenAndRefreshToken(user._id);
    const options = { httpOnly: true, secure: true };
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({ accessToken, refreshToken, message: "Access token refreshed" });
  } catch (err) {
    return next(err);
  }
};

export { registerUser, loginUser, logoutUser, refrehAccessToken };
