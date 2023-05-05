import express from "express";
import {
  createIncident,
  getIncidentById,
  getAllIncidents,
} from "../controllers/incidentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/createIncident", authMiddleware, createIncident);
router.get("/getAllIncidents", authMiddleware, getAllIncidents);
router.get("/:id", authMiddleware, getIncidentById);

export default router;
