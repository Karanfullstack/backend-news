import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { ProfileController } from "../controllers/ProfileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Profile Route
router.get("/auth/profile", authMiddleware, ProfileController.index);
router.put("/auth/profile/:id", authMiddleware, ProfileController.update);
export default router;
