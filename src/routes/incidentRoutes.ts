import express from "express";
import { createIncident } from "../controllers/incidentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/createIncident", authMiddleware, createIncident);

export default router;
