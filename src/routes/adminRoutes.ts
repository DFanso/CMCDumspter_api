import express from "express";
import { addArticle } from "../controllers/adminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/addArticle", authMiddleware, addArticle);

export default router;
