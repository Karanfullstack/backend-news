import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { ProfileController } from "../controllers/ProfileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { NewsController } from "../controllers/NewsController.js";
import redisCache from "../config/redis.config.js";

const router = Router();

// Auth Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Profile Routes
router.get("/auth/profile", authMiddleware, ProfileController.index);
router.put("/auth/profile/:id", authMiddleware, ProfileController.update);

// News Routes
router.post("/news", authMiddleware, NewsController.store);
router.get("/news", redisCache.route(), authMiddleware, NewsController.index);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);
export default router;
