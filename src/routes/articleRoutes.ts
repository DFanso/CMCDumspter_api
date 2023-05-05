import express from "express";
import { fetchArticle } from "../controllers/articleController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/fetchArticle", authMiddleware, fetchArticle);

export default router;
