import { Router } from "express";
import { loginUser, logoutUser, registerUser, refrehAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/autho.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refrehAccessToken);

export default router;
